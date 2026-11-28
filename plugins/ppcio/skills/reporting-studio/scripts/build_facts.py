#!/usr/bin/env python3
"""Client Reporting Studio: Deterministic Facts Builder (Zero Dependencies).

Ingests Google Ads CSV exports (daily/campaign, optional search terms & change history)
and produces an immutable, _week-locked facts.json with:
- Fuzzy Brand vs Non-Brand isolation (SequenceMatcher >= 0.85)
- 12-week per-campaign own-normal spend-weighted baselines
- Scale elasticity check (did return hold as spend rose?)
- MTD pacing + elapsed-day marker + pace-vs-return verdict
- Consolidated lowlight roll-up (never a wall of red)
- Auto-translated plain-English Change History
- Tracking Safety-Hold check (blocks auto-send if conversions collapsed <25% of normal)
"""
import argparse
import csv
import difflib
import json
import math
import re
import statistics
import sys
from collections import defaultdict
from datetime import date, datetime
from pathlib import Path


def parse_num(val):
    if val is None:
        return 0.0
    s = str(val).strip()
    if not s or s in ("--", "—", "N/A", "n/a", "-"):
        return 0.0
    if s.startswith("<"):
        m = re.search(r"[\d.]+", s)
        return float(m.group(0)) / 2.0 if m else 0.0
    s = re.sub(r"[^\d.\-]", "", s)
    try:
        return float(s) if s else 0.0
    except ValueError:
        return 0.0


def load_gads_csv(path):
    if not path or not Path(path).exists():
        return []
    lines = Path(path).read_text(encoding="utf-8-sig", errors="replace").splitlines()
    hdr = 0
    for i, line in enumerate(lines[:15]):
        low = line.lower()
        if any(k in low for k in ("campaign", "search term", "date & time", "change")) and any(
            k in low for k in ("cost", "clicks", "impr", "changes", "user", "conv")
        ):
            hdr = i
            break
    rows = []
    for r in csv.DictReader(lines[hdr:]):
        first = next((str(v).strip() for v in r.values() if v is not None), "")
        if not first or first.lower().startswith("total"):
            continue
        rows.append({(k or "").strip(): (v or "").strip() for k, v in r.items()})
    return rows


def col(row, candidates):
    lm = {k.lower(): v for k, v in row.items()}
    for c in candidates:
        if c.lower() in lm:
            return lm[c.lower()]
    for k, v in lm.items():
        for c in candidates:
            if c.lower() in k:
                return v
    return ""


def norm_text(s):
    return re.sub(r"[^a-z0-9 ]+", "", (s or "").lower()).strip()


def is_brand_match(text, brand_terms):
    if not text:
        return False
    nt = norm_text(text)
    if not brand_terms:
        return bool(re.search(r"\bbrand(ed)?\b", nt))
    for bt in brand_terms:
        nb = norm_text(bt)
        if not nb:
            continue
        if nb in nt:
            return True
        for token in nt.split():
            if len(token) >= 4 and difflib.SequenceMatcher(None, token, nb).ratio() >= 0.85:
                return True
        if difflib.SequenceMatcher(None, nt, nb).ratio() >= 0.85:
            return True
    return False


def singularize(word):
    w = (word or "conversion").strip()
    low = w.lower()
    if low.endswith("ies") and len(w) > 3:
        return w[:-3] + ("Y" if w[-1].isupper() else "y")
    if low.endswith("s") and not low.endswith("ss") and len(w) > 2:
        return w[:-1]
    return w


def safe_pct_str(cur, prev):
    if prev is None or cur is None or prev == 0:
        return None, "new"
    pct = ((cur - prev) / abs(prev)) * 100.0
    if pct > 500:
        mult = cur / prev if prev > 0 else 0
        return round(pct, 1), f"{mult:.1f}x" if mult >= 2 else "up sharply"
    if pct < -95:
        return round(pct, 1), "down sharply"
    return round(pct, 1), f"{pct:+.1f}%"


def iso_week_key(day_str):
    try:
        d = date.fromisoformat(day_str[:10])
        y, w, _ = d.isocalendar()
        return f"{y}-W{w:02d}"
    except ValueError:
        return "unknown"


def translate_changes(change_rows):
    grouped = defaultdict(int)
    for r in change_rows:
        camp = col(r, ["Campaign", "Campaign name"]) or "Account"
        desc = col(r, ["Changes", "Change", "Summary"])
        low = desc.lower()
        if not desc:
            continue
        if "negative" in low:
            kind = "Blocked wasted search terms"
        elif "budget" in low:
            kind = "Adjusted daily budget"
        elif "bid" in low or "target cpa" in low or "target roas" in low:
            kind = "Refined bidding targets"
        elif "ad" in low and ("headline" in low or "description" in low or "created" in low):
            kind = "Updated ad copy"
        elif "paused" in low:
            kind = "Paused underperforming items"
        elif "keyword" in low:
            kind = "Added or tuned keywords"
        else:
            kind = "Routine account maintenance"
        grouped[(camp, kind)] += 1
    out = []
    for (camp, kind), count in sorted(grouped.items(), key=lambda x: -x[1])[:8]:
        suffix = f" ({count} updates)" if count > 1 else ""
        out.append({"campaign": camp, "summary": f"{kind} in {camp}{suffix}"})
    return out


def agg_rows(items):
    cost = sum(x["cost"] for x in items)
    clicks = sum(x["clicks"] for x in items)
    impr = sum(x["impr"] for x in items)
    conv = sum(x["conv"] for x in items)
    val = sum(x["val"] for x in items)
    return {
        "cost": round(cost, 2),
        "clicks": int(round(clicks)),
        "impressions": int(round(impr)),
        "conversions": round(conv, 2),
        "conv_value": round(val, 2),
        "cpc": round(cost / clicks, 2) if clicks > 0 else 0.0,
        "ctr_pct": round((clicks / impr) * 100, 2) if impr > 0 else 0.0,
        "cvr_pct": round((conv / clicks) * 100, 2) if clicks > 0 else 0.0,
        "cpa": round(cost / conv, 2) if conv > 0 else None,
        "roas": round(val / cost, 2) if (cost > 0 and val > 0) else None,
    }


def build_facts(
    daily_rows,
    st_rows=None,
    change_rows=None,
    client_name="Client Account",
    account_type="lead_gen",
    brand_terms=None,
    monthly_budget=0.0,
    target_cpa=None,
    target_roas=None,
    currency="$",
    conversion_label=None,
):
    brand_terms = brand_terms or []
    conv_word = conversion_label or ("orders" if account_type == "ecommerce" else "enquiries")

    parsed = []
    for r in daily_rows:
        camp = col(r, ["Campaign", "Campaign name"])
        if not camp:
            continue
        day = col(r, ["Day", "Date"]) or date.today().isoformat()
        parsed.append({
            "day": day[:10],
            "week": iso_week_key(day),
            "month": day[:7],
            "campaign": camp,
            "status": col(r, ["Campaign state", "Status"]) or "Enabled",
            "is_brand": is_brand_match(camp, brand_terms),
            "cost": parse_num(col(r, ["Cost", "Spend"])),
            "clicks": parse_num(col(r, ["Clicks"])),
            "impr": parse_num(col(r, ["Impr.", "Impressions"])),
            "conv": parse_num(col(r, ["Conversions", "Conv."])),
            "val": parse_num(col(r, ["Conv. value", "Conversion value", "Revenue"])),
            "budget": parse_num(col(r, ["Budget", "Daily budget"])),
            "lost_is_budget": parse_num(col(r, ["Search lost IS (budget)", "Lost IS (budget)"])),
            "lost_is_rank": parse_num(col(r, ["Search lost IS (rank)", "Lost IS (rank)"])),
        })

    if not parsed:
        raise ValueError("No valid campaign rows found in input CSV.")

    dates = sorted({x["day"] for x in parsed})
    latest_day = dates[-1]
    cur_dates = set(dates[-7:])
    prev_dates = set(dates[-14:-7]) if len(dates) >= 14 else set()

    cur_items = [x for x in parsed if x["day"] in cur_dates]
    prev_items = [x for x in parsed if x["day"] in prev_dates]

    tot_cur = agg_rows(cur_items)
    tot_prev = agg_rows(prev_items) if prev_items else agg_rows([])
    nb_cur = agg_rows([x for x in cur_items if not x["is_brand"]])
    nb_prev = agg_rows([x for x in prev_items if not x["is_brand"]]) if prev_items else agg_rows([])
    br_cur = agg_rows([x for x in cur_items if x["is_brand"]])

    # 7-day sparklines (daily cost, conversions, cpa/roas)
    spark_days = sorted(cur_dates)
    spark_conv = [round(sum(x["conv"] for x in cur_items if x["day"] == d), 2) for d in spark_days]
    spark_cost = [round(sum(x["cost"] for x in cur_items if x["day"] == d), 2) for d in spark_days]
    spark_val = [round(sum(x["val"] for x in cur_items if x["day"] == d), 2) for d in spark_days]

    # Monthly series & 6-month normal (median)
    by_month = defaultdict(list)
    for x in parsed:
        by_month[x["month"]].append(x)
    monthly_series = []
    for m in sorted(by_month.keys()):
        a = agg_rows(by_month[m])
        a["month"] = m
        monthly_series.append(a)

    # Weekly series for 12-week own-normal & safety hold
    by_week = defaultdict(list)
    for x in parsed:
        by_week[x["week"]].append(x)
    weeks_sorted = sorted(by_week.keys())
    prior_weeks = weeks_sorted[:-1][-12:]
    prior_week_convs = [sum(x["conv"] for x in by_week[w]) for w in prior_weeks]
    normal_weekly_conv = round(statistics.median(prior_week_convs), 2) if prior_week_convs else tot_cur["conversions"]
    prior_week_cpas = [agg_rows(by_week[w])["cpa"] for w in prior_weeks if agg_rows(by_week[w])["cpa"]]
    normal_weekly_cpa = round(statistics.median(prior_week_cpas), 2) if prior_week_cpas else tot_cur["cpa"]

    # Safety Hold Gate (hold client send if conversions collapsed <25% of normal)
    safety_hold = False
    safety_hold_reason = ""
    if normal_weekly_conv >= 4 and tot_cur["conversions"] < normal_weekly_conv * 0.25:
        safety_hold = True
        safety_hold_reason = (
            f"Safety Hold: {conv_word.title()} dropped to {tot_cur['conversions']} vs usual {normal_weekly_conv}/week "
            f"(<25% of normal). Verify conversion tracking and lag before sending to client."
        )

    # Scale elasticity check (top half vs bottom half spend periods)
    scale_elasticity = "Insufficient history (<4 weeks) to measure scale elasticity."
    if len(weeks_sorted) >= 4:
        wk_stats = [agg_rows(by_week[w]) for w in weeks_sorted]
        wk_stats = [w for w in wk_stats if w["cost"] > 0]
        if len(wk_stats) >= 4:
            wk_stats.sort(key=lambda x: x["cost"])
            half = len(wk_stats) // 2
            low_sp = wk_stats[:half]
            high_sp = wk_stats[-half:]
            if account_type == "ecommerce":
                lo_r = sum(x["conv_value"] for x in low_sp) / max(1, sum(x["cost"] for x in low_sp))
                hi_r = sum(x["conv_value"] for x in high_sp) / max(1, sum(x["cost"] for x in high_sp))
                scale_elasticity = (
                    f"Return held as spend rose (ROAS {hi_r:.2f}x in higher-spend weeks vs {lo_r:.2f}x in lower-spend weeks)."
                    if hi_r >= lo_r * 0.9 else
                    f"Return compressed as spend rose (ROAS {hi_r:.2f}x in higher-spend weeks vs {lo_r:.2f}x in lower-spend weeks)."
                )
            else:
                lo_c = sum(x["cost"] for x in low_sp) / max(0.01, sum(x["conversions"] for x in low_sp))
                hi_c = sum(x["cost"] for x in high_sp) / max(0.01, sum(x["conversions"] for x in high_sp))
                scale_elasticity = (
                    f"Cost per {singularize(conv_word)} held steady as spend scaled ({currency}{hi_c:.2f} vs {currency}{lo_c:.2f})."
                    if hi_c <= lo_c * 1.15 else
                    f"Cost per {singularize(conv_word)} rose as spend scaled ({currency}{hi_c:.2f} vs {currency}{lo_c:.2f})."
                )

    # Per-campaign breakdown + 12-week own-normal
    camp_names = sorted({x["campaign"] for x in cur_items})
    campaigns = []
    highlights = []
    lowlights = []
    sub_target_rollup = []

    for cn in camp_names:
        c_cur = agg_rows([x for x in cur_items if x["campaign"] == cn])
        c_prev = agg_rows([x for x in prev_items if x["campaign"] == cn]) if prev_items else agg_rows([])
        is_br = is_brand_match(cn, brand_terms)
        hist_wks = [agg_rows([x for x in by_week[w] if x["campaign"] == cn]) for w in prior_weeks]
        hist_wks = [h for h in hist_wks if h["cost"] > 0]
        own_normal_cpa = (
            round(sum(h["cost"] for h in hist_wks) / sum(h["conversions"] for h in hist_wks), 2)
            if len(hist_wks) >= 3 and sum(h["conversions"] for h in hist_wks) > 0 else None
        )
        own_normal_roas = (
            round(sum(h["conv_value"] for h in hist_wks) / sum(h["cost"] for h in hist_wks), 2)
            if len(hist_wks) >= 3 and sum(h["cost"] for h in hist_wks) > 0 and sum(h["conv_value"] for h in hist_wks) > 0 else None
        )
        status_note = "normal"
        if not is_br and len(hist_wks) >= 3:
            if account_type == "ecommerce" and own_normal_roas and c_cur["roas"] is not None:
                if c_cur["roas"] >= own_normal_roas * 1.15:
                    status_note = "above_own_normal"
                elif c_cur["roas"] < own_normal_roas * 0.8:
                    status_note = "below_own_normal"
            elif own_normal_cpa and c_cur["cpa"] is not None:
                if c_cur["cpa"] <= own_normal_cpa * 0.85:
                    status_note = "above_own_normal"
                elif c_cur["cpa"] > own_normal_cpa * 1.25:
                    status_note = "below_own_normal"
            elif c_cur["conversions"] == 0 and c_cur["cost"] >= (target_cpa or 150):
                status_note = "zero_conv_bleeder"

        row_obj = {
            "campaign": cn,
            "is_brand": is_br,
            "cost": c_cur["cost"],
            "prev_cost": c_prev["cost"],
            "clicks": c_cur["clicks"],
            "conversions": c_cur["conversions"],
            "conv_value": c_cur["conv_value"],
            "cpa": c_cur["cpa"],
            "roas": c_cur["roas"],
            "own_normal_cpa": own_normal_cpa,
            "own_normal_roas": own_normal_roas,
            "weeks_of_history": len(hist_wks),
            "vs_own_normal": status_note,
        }
        campaigns.append(row_obj)

        # Brand is stripped from Highlights & Lowlights!
        if is_br:
            continue
        if account_type == "ecommerce":
            if c_cur["roas"] is not None and (c_cur["roas"] >= (target_roas or 3.0)) and c_cur["conversions"] >= 3:
                highlights.append(f"{cn} delivered {c_cur['roas']:.2f}x ROAS ({currency}{c_cur['conv_value']:,.0f} sales on {currency}{c_cur['cost']:,.0f} spend).")
            elif (c_cur["roas"] is not None and c_cur["roas"] < 1.0 and c_cur["cost"] >= 100) or (c_cur["conversions"] == 0 and c_cur["cost"] >= 250):
                sub_target_rollup.append(row_obj)
        else:
            if c_cur["cpa"] is not None and target_cpa and c_cur["cpa"] <= target_cpa and c_cur["conversions"] >= 3:
                highlights.append(f"{cn} generated {c_cur['conversions']:.0f} {conv_word} at {currency}{c_cur['cpa']:.2f} each (beating {currency}{target_cpa:.0f} goal).")
            elif (c_cur["conversions"] == 0 and c_cur["cost"] >= (target_cpa or 150)) or (target_cpa and c_cur["cpa"] and c_cur["cpa"] > target_cpa * 1.4 and c_cur["cost"] >= target_cpa * 2):
                sub_target_rollup.append(row_obj)

    # Consolidate multiple low-performing campaigns into ONE calm card (never a wall of red)
    if len(sub_target_rollup) == 1:
        x = sub_target_rollup[0]
        lowlights.append(f"{x['campaign']} spent {currency}{x['cost']:,.0f} for {x['conversions']:.0f} {conv_word} (under review).")
    elif len(sub_target_rollup) > 1:
        sub_target_rollup.sort(key=lambda x: x["cost"], reverse=True)
        tot_sub = sum(x["cost"] for x in sub_target_rollup)
        names = ", ".join(x["campaign"] for x in sub_target_rollup[:3])
        lowlights.append(f"{len(sub_target_rollup)} campaigns ({names}) spent {currency}{tot_sub:,.0f} below efficiency target; trimming waste next.")

    campaigns.sort(key=lambda x: x["cost"], reverse=True)

    # MTD Pacing + Pace-vs-Return verdict
    latest_month = latest_day[:7]
    mtd_items = [x for x in parsed if x["month"] == latest_month]
    mtd_spend = round(sum(x["cost"] for x in mtd_items), 2)
    day_of_month = int(latest_day[8:10]) if len(latest_day) >= 10 else 15
    days_in_month = 30
    active_mtd_days = len({x["day"] for x in mtd_items if x["cost"] > 0}) or 1
    daily_pace = mtd_spend / active_mtd_days
    projected_mtd = round(mtd_spend + daily_pace * max(0, days_in_month - day_of_month), 2)
    eff_budget = monthly_budget if monthly_budget > 0 else round(sum({x["campaign"]: x["budget"] for x in cur_items if x["budget"] > 0}.values()) * 30.4, 2)
    pacing_pct = round((projected_mtd / eff_budget) * 100, 1) if eff_budget > 0 else 100.0
    elapsed_pct = round((day_of_month / days_in_month) * 100, 1)

    if eff_budget <= 0:
        pace_status, pace_verdict = "No monthly cap set", "Paced against daily campaign budgets (no fixed monthly cap agreed yet)."
    elif pacing_pct > 105:
        pace_status = "Over Pacing"
        nb_over = f" with Non-Brand CPL ({currency}{nb_cur['cpa']:.2f}) above your {currency}{target_cpa:.0f} goal" if (target_cpa and nb_cur["cpa"] and nb_cur["cpa"] > target_cpa) else ""
        pace_verdict = f"Projected {currency}{projected_mtd:,.0f} vs {currency}{eff_budget:,.0f} budget ({pacing_pct:.0f}%{nb_over}). Trim higher-cost campaigns before month-end."
    elif pacing_pct < 90:
        pace_status = "Under Pacing"
        below_goal = (target_cpa and nb_cur["cpa"] and nb_cur["cpa"] > target_cpa) or (target_roas and nb_cur["roas"] and nb_cur["roas"] < target_roas)
        pace_verdict = (
            f"Under plan ({pacing_pct:.0f}%), and non-brand return is below goal: holding spend back is the right call until efficiency improves."
            if below_goal else
            f"Under plan ({pacing_pct:.0f}%) while hitting efficiency goals: room to shift budget into winning campaigns."
        )
    else:
        pace_status = "On Track"
        pace_verdict = f"Projected {currency}{projected_mtd:,.0f} against {currency}{eff_budget:,.0f} budget ({pacing_pct:.0f}%)."

    # Search terms (Brand filtered!)
    top_converting_terms, waste_terms = [], []
    if st_rows:
        for r in st_rows:
            term = col(r, ["Search term", "Query"])
            if not term or is_brand_match(term, brand_terms):
                continue
            c = parse_num(col(r, ["Cost", "Spend"]))
            cl = parse_num(col(r, ["Clicks"]))
            cv = parse_num(col(r, ["Conversions", "Conv."]))
            if cv >= 1:
                top_converting_terms.append({"term": term, "cost": round(c, 2), "conversions": round(cv, 1), "cpa": round(c / cv, 2)})
            elif c >= (target_cpa or 50) and cl >= 5:
                waste_terms.append({"term": term, "cost": round(c, 2), "clicks": int(cl)})
        top_converting_terms.sort(key=lambda x: x["conversions"], reverse=True)
        waste_terms.sort(key=lambda x: x["cost"], reverse=True)

    changes_plain = translate_changes(change_rows or [])

    return {
        "_week": latest_day,
        "client_name": client_name,
        "account_type": account_type,
        "currency": currency,
        "conversion_label": conv_word,
        "period": f"{min(cur_dates)} to {max(cur_dates)}",
        "compare_period": f"{min(prev_dates)} to {max(prev_dates)}" if prev_dates else "No prior week",
        "lag_note": f"Recent {conv_word} from the last 2 to 3 days are still settling.",
        "safety_hold": safety_hold,
        "safety_hold_reason": safety_hold_reason,
        "targets": {"target_cpa": target_cpa, "target_roas": target_roas, "monthly_budget": eff_budget},
        "totals": {"current": tot_cur, "previous": tot_prev},
        "non_brand": {"current": nb_cur, "previous": nb_prev},
        "brand": {"current": br_cur},
        "own_normal": {"weekly_conversions": normal_weekly_conv, "weekly_cpa": normal_weekly_cpa},
        "scale_elasticity": scale_elasticity,
        "deltas": {
            "cost": safe_pct_str(tot_cur["cost"], tot_prev["cost"])[1],
            "conversions": safe_pct_str(tot_cur["conversions"], tot_prev["conversions"])[1],
            "cpa": safe_pct_str(tot_cur["cpa"], tot_prev["cpa"])[1],
            "roas": safe_pct_str(tot_cur["roas"], tot_prev["roas"])[1],
            "nb_conversions": safe_pct_str(nb_cur["conversions"], nb_prev["conversions"])[1],
            "nb_cpa": safe_pct_str(nb_cur["cpa"], nb_prev["cpa"])[1],
        },
        "sparklines": {"days": spark_days, "conversions": spark_conv, "cost": spark_cost, "conv_value": spark_val},
        "pacing": {
            "mtd_spend": mtd_spend,
            "monthly_budget": eff_budget,
            "projected": projected_mtd,
            "pacing_pct": pacing_pct,
            "elapsed_pct": elapsed_pct,
            "spend_pct": round((mtd_spend / eff_budget) * 100, 1) if eff_budget > 0 else 0.0,
            "status": pace_status,
            "verdict": pace_verdict,
        },
        "highlights": highlights[:6],
        "lowlights": lowlights[:6],
        "campaigns": campaigns,
        "monthly_series": monthly_series[-12:],
        "search_terms": {"converting_non_brand": top_converting_terms[:10], "waste_non_brand": waste_terms[:10]},
        "what_we_did": changes_plain,
    }


def main():
    ap = argparse.ArgumentParser(description="Build immutable _week-locked facts.json for Client Reporting Studio")
    ap.add_argument("--daily", required=True, help="Daily or Campaign Google Ads CSV")
    ap.add_argument("--search-terms", default="", help="Optional Search Terms CSV")
    ap.add_argument("--changes", default="", help="Optional Change History CSV")
    ap.add_argument("--client", default="Client Account")
    ap.add_argument("--type", choices=["lead_gen", "ecommerce", "saas"], default="lead_gen")
    ap.add_argument("--brand", default="", help="Comma-separated brand terms for fuzzy stripping")
    ap.add_argument("--budget", type=float, default=0.0)
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--target-roas", type=float, default=None)
    ap.add_argument("--currency", default="$")
    ap.add_argument("--conversion-label", default=None)
    ap.add_argument("--out", required=True, help="Output facts.json path")
    args = ap.parse_args()

    daily = load_gads_csv(args.daily)
    st = load_gads_csv(args.search_terms) if args.search_terms else []
    ch = load_gads_csv(args.changes) if args.changes else []
    brand_terms = [b.strip() for b in re.split(r"[,|]+", args.brand) if b.strip()]

    facts = build_facts(
        daily, st, ch,
        client_name=args.client,
        account_type=args.type,
        brand_terms=brand_terms,
        monthly_budget=args.budget,
        target_cpa=args.target_cpa,
        target_roas=args.target_roas,
        currency=args.currency,
        conversion_label=args.conversion_label,
    )
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(facts, indent=2), encoding="utf-8")
    print(f"facts.json written: {out.resolve()} (_week={facts['_week']}, safety_hold={facts['safety_hold']})")


if __name__ == "__main__":
    main()
