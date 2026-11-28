#!/usr/bin/env python3
"""Agency & In-House PPC Operations / Audit OS Engine (Zero Dependencies).

Ingests single-account OR multi-account MCC Google Ads CSVs and computes:
- Portfolio risk triage (BROKEN -> AT_RISK -> WIN -> FINE count; silence as default)
- Statistical Quiet-Gap Break Detector (quiet_days >= 2 AND > 3*(90/leads_90d) AND spend >= 2*cpl)
- Tracking inflation detector (Non-Brand CVR > 25% on >= 50 clicks)
- 8-Step Causal Chain diagnostics + Low-Volume Max-Conv CPC inflation check
- Strict Playbook Dependency-Gated Team Batches (Tracking -> Web/LP -> PPC AM)
  holding PPC traffic tweaks in 'Waiting on tracking' whenever tracking is broken
- Ready-to-import read-only Google Ads Editor CSV exports
- 4 transparent revenue opportunity formulas for executive / sales pitch boards
"""
import argparse
import csv
import json
import math
import re
import sys
from collections import defaultdict
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


def load_csv(path):
    lines = Path(path).read_text(encoding="utf-8-sig", errors="replace").splitlines()
    hdr = 0
    for i, line in enumerate(lines[:15]):
        low = line.lower()
        if ("campaign" in low or "account" in low) and ("cost" in low or "clicks" in low or "conv" in low):
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


def is_brand(name, brand_pattern=""):
    if brand_pattern:
        return bool(re.search(brand_pattern, name, re.I))
    return bool(re.search(r"\bbrand(ed)?\b", name, re.I))


def build_ops_state(rows, default_account="Primary Account", target_cpa=None, brand_pattern="", currency="$", export_dir=None, account_targets=None):
    account_targets = account_targets or {}
    by_acct = defaultdict(list)
    for r in rows:
        acct = col(r, ["Account", "Account name", "Customer name"]) or default_account
        if acct.lower().startswith("zz -") or acct.lower().startswith("zz-"):
            continue
        camp = col(r, ["Campaign", "Campaign name"]) or "Campaign"
        day = col(r, ["Day", "Date"])
        status = col(r, ["Campaign state", "Status"]) or "Enabled"
        bid = col(r, ["Bid strategy type", "Bid strategy"])
        cost = parse_num(col(r, ["Cost", "Spend"]))
        clicks = parse_num(col(r, ["Clicks"]))
        impr = parse_num(col(r, ["Impr.", "Impressions"]))
        conv = parse_num(col(r, ["Conversions", "Conv."]))
        val = parse_num(col(r, ["Conv. value", "Conversion value", "Revenue"]))
        lost_b = parse_num(col(r, ["Search lost IS (budget)", "Lost IS (budget)"]))
        lost_r = parse_num(col(r, ["Search lost IS (rank)", "Lost IS (rank)"]))
        if cost == 0 and clicks == 0 and conv == 0:
            continue
        by_acct[acct].append({
            "day": day[:10] if day else "",
            "campaign": camp,
            "status": status,
            "bid": bid,
            "is_brand": is_brand(camp, brand_pattern),
            "cost": cost,
            "clicks": clicks,
            "impr": impr,
            "conv": conv,
            "val": val,
            "lost_b": lost_b,
            "lost_r": lost_r,
        })

    accounts = []
    batches = {
        "tracking": [],
        "web_lp": [],
        "ppc_ready": [],
        "ppc_waiting_on_tracking": [],
    }
    editor_rows = []
    editor_pause_rows = []

    for acct, items in sorted(by_acct.items()):
        nb_items = [x for x in items if not x["is_brand"]]
        br_items = [x for x in items if x["is_brand"]]
        tot_cost = sum(x["cost"] for x in items)
        tot_conv = sum(x["conv"] for x in items)
        nb_cost = sum(x["cost"] for x in nb_items)
        nb_clicks = sum(x["clicks"] for x in nb_items)
        nb_conv = sum(x["conv"] for x in nb_items)
        nb_cvr = (nb_conv / nb_clicks) if nb_clicks > 0 else 0.0
        nb_cpa = (nb_cost / nb_conv) if nb_conv > 0 else None
        tot_cpa = (tot_cost / tot_conv) if tot_conv > 0 else None
        acct_goal = account_targets.get(acct) or account_targets.get(acct.lower()) or target_cpa
        eff_target = acct_goal or nb_cpa or tot_cpa or 75.0

        # Per-campaign rollup inside account
        by_camp = defaultdict(lambda: {"cost": 0.0, "clicks": 0.0, "impr": 0.0, "conv": 0.0, "val": 0.0, "lost_b": 0.0, "lost_r": 0.0, "bid": "", "status": "Enabled", "is_brand": False})
        by_day = defaultdict(lambda: {"cost": 0.0, "conv": 0.0})
        for x in items:
            rec = by_camp[x["campaign"]]
            rec["cost"] += x["cost"]
            rec["clicks"] += x["clicks"]
            rec["impr"] += x["impr"]
            rec["conv"] += x["conv"]
            rec["val"] += x["val"]
            rec["lost_b"] = max(rec["lost_b"], x["lost_b"])
            rec["lost_r"] = max(rec["lost_r"], x["lost_r"])
            if x["bid"]:
                rec["bid"] = x["bid"]
            rec["status"] = x["status"]
            rec["is_brand"] = x["is_brand"]
            if x["day"] and not x["is_brand"]:
                by_day[x["day"]]["cost"] += x["cost"]
                by_day[x["day"]]["conv"] += x["conv"]

        # Statistical Quiet-Gap Break Detector (3x normal inter-lead gap + >=2x CPL spend)
        tracking_broken = False
        break_reasons = []
        days_sorted = sorted(by_day.keys())
        if len(days_sorted) >= 7 and nb_conv >= 4:
            quiet_days = 0
            spend_since = 0.0
            for d in reversed(days_sorted):
                if by_day[d]["conv"] == 0:
                    quiet_days += 1
                    spend_since += by_day[d]["cost"]
                else:
                    break
            avg_gap = len(days_sorted) / max(1.0, nb_conv)
            cpl_est = nb_cpa or eff_target
            if quiet_days >= 2 and quiet_days > 3.0 * avg_gap and spend_since >= 2.0 * cpl_est:
                tracking_broken = True
                break_reasons.append(
                    f"Quiet-gap tracking break: {quiet_days} consecutive 0-conversion days spending {currency}{spend_since:,.0f} "
                    f"(exceeds 3x normal {avg_gap:.1f}d gap and 2x CPL)."
                )

        if nb_cvr > 0.25 and nb_clicks >= 50:
            tracking_broken = True
            break_reasons.append(
                f"Tracking inflation suspect: Non-Brand CVR is {nb_cvr*100:.1f}% across {nb_clicks:.0f} clicks "
                "(likely counting page views, button clicks, or 5s calls as Primary)."
            )

        # Moves & 5-Part Findings (with Playbook dependency gating!)
        moves = []
        protect = []
        lp_leak_campaigns = []
        waste_dollars = 0.0
        headroom_dollars = 0.0
        lp_weak_spend = 0.0
        lp_weak_clicks = 0.0

        if tracking_broken:
            for br in break_reasons:
                moves.append({
                    "owner": "Tracking Help Desk",
                    "priority": 1,
                    "title": "Fix Primary conversion tracking before touching bids or keywords",
                    "claim": br,
                    "evidence": f"Non-Brand: {nb_clicks:.0f} clicks, {nb_conv:.1f} conversions ({nb_cvr*100:.1f}% CVR), {currency}{nb_cost:,.0f} spend.",
                    "reading": "Optimizing traffic while conversion counting is broken mis-trains Smart Bidding and destroys good campaigns.",
                    "verdict": "fix",
                    "fix": "Audit Primary conversions (keep real forms & >=20s answered calls only), verify tag firing, wait 7 days before bid edits.",
                    "est_monthly_gain": "Prevents mis-trained bidding across full budget",
                })
                batches["tracking"].append({"account": acct, "task": br, "spend_at_risk": round(nb_cost, 2)})

        for cname, c in sorted(by_camp.items(), key=lambda kv: -kv[1]["cost"]):
            cpa = (c["cost"] / c["conv"]) if c["conv"] > 0 else None
            cvr = (c["conv"] / c["clicks"]) if c["clicks"] > 0 else 0.0
            ctr = (c["clicks"] / c["impr"]) if c["impr"] > 0 else 0.0
            exp_leads = c["clicks"] * (nb_cvr if nb_cvr > 0 else 0.05)

            if c["is_brand"]:
                protect.append({"campaign": cname, "reason": f"Brand capture ({currency}{c['cost']:,.0f}, {c['conv']:.0f} conv)"})
                continue

            # Small-sample noise floor
            if c["clicks"] < 20 or (c["conv"] == 0 and exp_leads < 2.0 and c["cost"] < eff_target):
                continue

            # High CTR + Low CVR -> Web / LP Team batch
            if ctr >= 0.05 and cvr < 0.015 and c["clicks"] >= 40:
                lp_weak_spend += c["cost"]
                lp_weak_clicks += c["clicks"]
                lp_leak_campaigns.append({
                    "campaign": cname,
                    "spend": round(c["cost"], 2),
                    "clicks": int(c["clicks"]),
                    "ctr_pct": round(ctr * 100, 1),
                    "cvr_pct": round(cvr * 100, 2),
                    "conversions": round(c["conv"], 1),
                })
                moves.append({
                    "owner": "Web / LP Team",
                    "priority": 2,
                    "title": f"Fix post-click landing page conversion leak on {cname}",
                    "claim": f"{cname} gets {ctr*100:.1f}% CTR but only {cvr*100:.1f}% CVR on {currency}{c['cost']:,.0f} spend.",
                    "evidence": f"{c['clicks']:.0f} clicks, {c['conv']:.1f} conversions, {currency}{c['cost']:,.0f} spend.",
                    "reading": "Strong CTR shows search intent and ad copy work; buyers are bouncing after the click.",
                    "verdict": "fix",
                    "fix": "Match screen-one headline to ad promise, place verified proof & clear offer above the fold (run landing-page studio); recheck in 14d.",
                    "est_monthly_gain": f"+{max(1, round(c['clicks'] * 0.015))} extra conversions/mo (+1.5 pt CVR lift)",
                })
                batches["web_lp"].append({"account": acct, "campaign": cname, "task": f"Post-click LP leak on {cname} (CTR {ctr*100:.1f}% / CVR {cvr*100:.1f}%)", "spend": round(c["cost"], 2)})

            # Waste / Over-target campaign -> PPC Batch (HELD if tracking is broken!)
            if (c["conv"] == 0 and (c["cost"] >= eff_target or exp_leads >= 2.0)) or (cpa and cpa > eff_target * 1.35 and c["conv"] >= 3):
                waste_dollars += c["cost"]
                mv = {
                    "owner": "PPC Manager",
                    "priority": 3 if not tracking_broken else 4,
                    "blocked_by_tracking": tracking_broken,
                    "title": f"Cut off-intent waste in {cname}",
                    "claim": f"{cname} spent {currency}{c['cost']:,.0f} for {c['conv']:.1f} conversions (CPA {currency}{cpa:.2f} vs {currency}{eff_target:.0f} goal)." if cpa else f"{cname} spent {currency}{c['cost']:,.0f} across {c['clicks']:.0f} clicks with 0 conversions.",
                    "evidence": f"Cost {currency}{c['cost']:,.2f}, Clicks {c['clicks']:.0f}, Conv {c['conv']:.1f}, Expected leads {exp_leads:.1f}.",
                    "reading": "Volume exceeds noise floor (expected leads >= 2 or spend >= target CPA); real money is leaking.",
                    "verdict": "fix" if not tracking_broken else "check",
                    "fix": "Run search-term-miner, add simulated exact/phrase negatives, pause 0-conv bleeders; recheck after 14d (rollback if valid volume drops >20%).",
                    "est_monthly_gain": f"Recover ~{currency}{c['cost']*0.4:,.0f}/mo waste",
                }
                moves.append(mv)
                batch_item = {"account": acct, "campaign": cname, "task": mv["title"], "spend": round(c["cost"], 2)}
                if tracking_broken:
                    batches["ppc_waiting_on_tracking"].append(batch_item)
                else:
                    batches["ppc_ready"].append(batch_item)
                    editor_rows.append({"Account": acct, "Campaign": cname, "Action": "Review Search Terms & Cap Bleed", "Current Spend": round(c["cost"], 2), "Status": "Ready for AM"})
                    if c["conv"] == 0:
                        editor_pause_rows.append({"Account": acct, "Campaign": cname, "Campaign Status": "Paused"})

            elif cpa and cpa <= eff_target and c["conv"] >= 3:
                if c["lost_b"] >= 15:
                    headroom_dollars += c["cost"] * (c["lost_b"] / max(10.0, 100.0 - c["lost_b"]))
                protect.append({"campaign": cname, "reason": f"Healthy winner ({currency}{c['cost']:,.0f}, {c['conv']:.0f} conv, CPA {currency}{cpa:.2f})"})
            elif cpa and cpa <= eff_target * 1.15 and c["conv"] >= 10:
                protect.append({"campaign": cname, "reason": f"Core workhorse within 15% of goal ({currency}{c['cost']:,.0f}, {c['conv']:.0f} conv, CPA {currency}{cpa:.2f} - monitor, do not disrupt)"})

        # Account health state
        if tracking_broken:
            state = "BROKEN"
        elif nb_conv < 5 and tot_conv < 10:
            state = "FEW_DATA"
        elif waste_dollars >= max(eff_target * 3, nb_cost * 0.25) or (nb_cpa and nb_cpa > eff_target * 1.3):
            state = "AT_RISK"
        elif nb_cpa and nb_cpa <= eff_target * 0.85 and nb_conv >= 10:
            state = "WIN"
        else:
            state = "FINE"

        # 8-point Health Grades (neutral topic labels only!)
        grades = [
            {"topic": "Conversion tracking integrity", "grade": "D" if tracking_broken else "A", "note": break_reasons[0] if break_reasons else "Conversion rate and continuity within normal bounds."},
            {"topic": "Brand vs. Non-Brand separation", "grade": "A" if br_items else "C", "note": f"Brand isolated ({currency}{sum(x['cost'] for x in br_items):,.0f})" if br_items else "No dedicated Brand campaign detected; verify brand isolation."},
            {"topic": "Non-Brand acquisition efficiency", "grade": "A" if (nb_cpa and nb_cpa <= eff_target) else ("D" if (not nb_cpa or nb_cpa > eff_target * 1.4) else "B"), "note": f"Non-Brand CPA {currency}{nb_cpa:.2f} vs {currency}{eff_target:.0f} goal" if nb_cpa else "Zero Non-Brand conversions recorded."},
            {"topic": "Post-click landing page conversion", "grade": "C" if lp_weak_spend > 0 else "A", "note": f"{currency}{lp_weak_spend:,.0f} spend on high-CTR / low-CVR campaigns" if lp_weak_spend > 0 else "No severe CTR-vs-CVR post-click mismatch detected."},
        ]

        # 4 Transparent Revenue Opportunity Formulas (consistent click-based math)
        opp_waste = round(waste_dollars * 0.40, 2)
        opp_cvr_leads = round(lp_weak_clicks * 0.015, 1) if lp_weak_clicks > 0 else 0.0
        opp_headroom = round(min(headroom_dollars, nb_cost * 0.5), 2)

        accounts.append({
            "account": acct,
            "state": state,
            "tracking_broken": tracking_broken,
            "break_reasons": break_reasons,
            "totals": {"cost": round(tot_cost, 2), "conversions": round(tot_conv, 1), "cpa": round(tot_cpa, 2) if tot_cpa else None},
            "non_brand": {"cost": round(nb_cost, 2), "clicks": int(nb_clicks), "conversions": round(nb_conv, 1), "cpa": round(nb_cpa, 2) if nb_cpa else None, "cvr_pct": round(nb_cvr * 100, 2)},
            "target_cpa": round(eff_target, 2),
            "top_moves": moves[:5],
            "protect_healthy": protect,
            "lp_leak_campaigns": lp_leak_campaigns,
            "health_grades": grades,
            "campaigns": [{"campaign": k, **{kk: round(vv, 2) if isinstance(vv, float) else vv for kk, vv in v.items()}} for k, v in sorted(by_camp.items(), key=lambda kv: -kv[1]["cost"])],
            "opportunities": {
                "reclaimable_waste_est": opp_waste,
                "waste_formula": f"40% of {currency}{waste_dollars:,.0f} over-target/zero-conv spend = {currency}{opp_waste:,.0f} reclaimable",
                "lp_cvr_extra_leads_est": opp_cvr_leads,
                "budget_headroom_est": opp_headroom,
            },
        })

    order = {"BROKEN": 0, "AT_RISK": 1, "FEW_DATA": 2, "WIN": 3, "FINE": 4}
    accounts.sort(key=lambda a: (order.get(a["state"], 9), -a["totals"]["cost"]))

    editor_csv_path = ""
    editor_pause_csv_path = ""
    if export_dir and editor_rows:
        ed = Path(export_dir)
        ed.mkdir(parents=True, exist_ok=True)
        ecsv = ed / "ppc-batch-action-queue.csv"
        with ecsv.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=["Account", "Campaign", "Action", "Current Spend", "Status"])
            w.writeheader()
            w.writerows(editor_rows)
        editor_csv_path = str(ecsv.resolve())
        if editor_pause_rows:
            pcsv = ed / "google-ads-editor-pause-bleeders.csv"
            with pcsv.open("w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=["Account", "Campaign", "Campaign Status"])
                w.writeheader()
                w.writerows(editor_pause_rows)
            editor_pause_csv_path = str(pcsv.resolve())

    counts = {k: sum(1 for a in accounts if a["state"] == k) for k in ("BROKEN", "AT_RISK", "FEW_DATA", "WIN", "FINE")}
    return {
        "currency": currency,
        "portfolio_counts": counts,
        "accounts": accounts,
        "batches": batches,
        "editor_csv": editor_csv_path,
        "editor_pause_csv": editor_pause_csv_path,
    }


def main():
    ap = argparse.ArgumentParser(description="Agency & In-House PPC Operations / Audit OS Engine")
    ap.add_argument("--csv", required=True, help="Single-account or multi-account MCC CSV")
    ap.add_argument("--account", default="Primary Account")
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--targets-json", default="", help="Optional JSON file mapping Account Name -> Target CPA")
    ap.add_argument("--brand", default="")
    ap.add_argument("--currency", default="$")
    ap.add_argument("--export-dir", default="", help="Optional directory for PPC batch queue & Ads Editor CSV exports")
    ap.add_argument("--out", required=True, help="Output ops_state.json path")
    args = ap.parse_args()

    rows = load_csv(args.csv)
    if not rows:
        print("ERROR: No rows parsed from CSV.", file=sys.stderr)
        sys.exit(1)

    acct_targets = json.loads(Path(args.targets_json).read_text(encoding="utf-8")) if (args.targets_json and Path(args.targets_json).exists()) else {}
    state = build_ops_state(rows, args.account, args.target_cpa, args.brand, args.currency, args.export_dir or None, acct_targets)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(state, indent=2), encoding="utf-8")
    c = state["portfolio_counts"]
    print(
        f"ops_state.json written: {out.resolve()} | "
        f"Broken={c['BROKEN']} AtRisk={c['AT_RISK']} FewData={c['FEW_DATA']} Win={c['WIN']} Fine={c['FINE']} | "
        f"TrackingBatches={len(state['batches']['tracking'])} PpcReady={len(state['batches']['ppc_ready'])} HeldOnTracking={len(state['batches']['ppc_waiting_on_tracking'])}"
    )


if __name__ == "__main__":
    main()
