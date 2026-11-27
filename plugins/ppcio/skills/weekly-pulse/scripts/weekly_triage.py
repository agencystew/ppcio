#!/usr/bin/env python3
"""Deterministic Weekly Pulse Triage Engine (This Week vs Last Week vs 4-Week Baseline).

Separates Brand vs Non-Brand, filters expected_leads < 2 noise, runs Poisson quiet-day checks,
isolates bottleneck lever (CPC vs CVR vs Spend), and protects healthy campaigns.
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
    if not s or s in ("--", "—", "N/A", "-"):
        return 0.0
    s = re.sub(r"[^\d.\-]", "", s)
    try:
        return float(s) if s else 0.0
    except ValueError:
        return 0.0


def load_csv(path):
    lines = Path(path).read_text(encoding="utf-8-sig", errors="replace").splitlines()
    hdr = 0
    for i, l in enumerate(lines[:15]):
        low = l.lower()
        if "campaign" in low and ("day" in low or "date" in low or "cost" in low):
            hdr = i
            break
    rows = []
    for r in csv.DictReader(lines[hdr:]):
        first = next((str(v).strip() for v in r.values() if v is not None), "")
        if not first or first.lower().startswith("total"):
            continue
        rows.append({(k or "").strip(): (v or "").strip() for k, v in r.items()})
    return rows


def col(row, names):
    lm = {k.lower(): v for k, v in row.items()}
    for n in names:
        if n.lower() in lm:
            return lm[n.lower()]
    for k, v in lm.items():
        for n in names:
            if n.lower() in k:
                return v
    return ""


def agg(items):
    cost = sum(x["cost"] for x in items)
    clicks = sum(x["clicks"] for x in items)
    conv = sum(x["conv"] for x in items)
    val = sum(x["val"] for x in items)
    return {
        "cost": round(cost, 2),
        "clicks": int(round(clicks)),
        "conv": round(conv, 2),
        "val": round(val, 2),
        "cpc": round(cost / clicks, 2) if clicks > 0 else 0.0,
        "cvr": round((conv / clicks) * 100, 2) if clicks > 0 else 0.0,
        "cpa": round(cost / conv, 2) if conv > 0 else None,
    }


def pct_delta(cur, prev):
    if prev is None or cur is None or prev == 0:
        return None
    return round(((cur - prev) / prev) * 100, 1)


def triage_weekly(rows, brand_pattern="", target_cpa=None):
    by_date = defaultdict(list)
    for r in rows:
        day = col(r, ["Day", "Date"])
        camp = col(r, ["Campaign", "Campaign name"])
        if not day or not camp:
            continue
        by_date[day].append({
            "day": day,
            "campaign": camp,
            "is_brand": bool(re.search(brand_pattern or r"\bbrand(ed)?\b", camp, re.I)),
            "cost": parse_num(col(r, ["Cost", "Spend"])),
            "clicks": parse_num(col(r, ["Clicks"])),
            "conv": parse_num(col(r, ["Conversions", "Conv."])),
            "val": parse_num(col(r, ["Conv. value", "Revenue"])),
        })

    dates = sorted(by_date.keys())
    if len(dates) < 14:
        return {"error": f"Need at least 14 daily dates for WoW triage (got {len(dates)})."}

    this_w_dates = set(dates[-7:])
    last_w_dates = set(dates[-14:-7])
    base_4w_dates = set(dates[-35:-7]) if len(dates) >= 35 else set(dates[:-7])
    base_weeks = max(1.0, len(base_4w_dates) / 7.0)

    def split_nb(date_set):
        items = [x for d in date_set for x in by_date[d]]
        return agg([x for x in items if not x["is_brand"]]), agg([x for x in items if x["is_brand"]])

    nb_cur, br_cur = split_nb(this_w_dates)
    nb_prev, br_prev = split_nb(last_w_dates)
    nb_base_raw, _ = split_nb(base_4w_dates)
    nb_base = {
        "cost": round(nb_base_raw["cost"] / base_weeks, 2),
        "clicks": int(round(nb_base_raw["clicks"] / base_weeks)),
        "conv": round(nb_base_raw["conv"] / base_weeks, 2),
        "cpc": nb_base_raw["cpc"],
        "cvr": nb_base_raw["cvr"],
        "cpa": nb_base_raw["cpa"],
    }

    # Check trailing quiet days (Poisson sanity check)
    daily_lambda = (nb_base["conv"] / 7.0) if nb_base["conv"] > 0 else 0.0
    zero_tail = 0
    for d in reversed(dates[-7:]):
        if sum(x["conv"] for x in by_date[d] if not x["is_brand"]) == 0:
            zero_tail += 1
        else:
            break
    poisson_p = math.exp(-daily_lambda * zero_tail) if (daily_lambda > 0 and zero_tail > 0) else 1.0

    alerts = []
    if zero_tail >= 2 and daily_lambda >= 1.0:
        if poisson_p < 0.05:
            alerts.append(
                f"ZERO_CONVERSION_TAIL: {zero_tail} consecutive 0-lead Non-Brand days (expected {daily_lambda:.1f}/d, "
                f"Poisson p={poisson_p:.3f}). Check conversion lag first (conversion-lag-check) and verify tag firing!"
            )
        else:
            alerts.append(
                f"QUIET_TAIL_NORMAL_VARIANCE: {zero_tail} zero-lead days at {daily_lambda:.2f} leads/d has Poisson p={poisson_p:.2f} (normal chance + lag; do not panic)."
            )

    # Per-campaign movers (Non-Brand)
    camps = sorted({x["campaign"] for d in this_w_dates | last_w_dates for x in by_date[d] if not x["is_brand"]})
    nb_base_cvr = (nb_base["cvr"] / 100.0) if nb_base["cvr"] > 0 else 0.05
    movers = []
    protect = []
    noise = []

    for c in camps:
        cur = agg([x for d in this_w_dates for x in by_date[d] if x["campaign"] == c])
        prev = agg([x for d in last_w_dates for x in by_date[d] if x["campaign"] == c])
        b4 = agg([x for d in base_4w_dates for x in by_date[d] if x["campaign"] == c])
        exp_leads = cur["clicks"] * nb_base_cvr

        if cur["clicks"] < 20 or (cur["conv"] == 0 and exp_leads < 2.0 and (not target_cpa or cur["cost"] < target_cpa)):
            noise.append({"campaign": c, "cost": cur["cost"], "clicks": cur["clicks"], "expected_leads": round(exp_leads, 2)})
            continue

        cpa_wow = pct_delta(cur["cpa"], prev["cpa"])
        cpa_vs_4w = pct_delta(cur["cpa"], b4["cpa"])
        cpc_wow = pct_delta(cur["cpc"], prev["cpc"])
        cvr_wow = pct_delta(cur["cvr"], prev["cvr"])

        if (target_cpa and cur["cpa"] and cur["cpa"] <= target_cpa) and (cpa_vs_4w is None or cpa_vs_4w <= 15):
            protect.append({"campaign": c, "cost": cur["cost"], "conv": cur["conv"], "cpa": cur["cpa"]})
            continue

        if (cur["conv"] == 0 and cur["cost"] >= (target_cpa or 150)) or (
            cpa_wow is not None and cpa_wow >= 20 and (cpa_vs_4w is None or cpa_vs_4w >= 15)
        ):
            driver = "CPC inflation" if (cpc_wow and cpc_wow >= 15) else ("CVR drop" if (cvr_wow and cvr_wow <= -20) else "Mixed CPC/CVR drift")
            movers.append({
                "campaign": c,
                "cost": cur["cost"],
                "conv": cur["conv"],
                "cpa_this_week": cur["cpa"],
                "cpa_last_week": prev["cpa"],
                "cpa_4w_avg": b4["cpa"],
                "cpa_wow_pct": cpa_wow,
                "cpa_vs_4w_pct": cpa_vs_4w,
                "primary_lever": driver,
            })

    movers.sort(key=lambda x: x["cost"], reverse=True)
    return {
        "dates": {"this_week": f"{min(this_w_dates)}..{max(this_w_dates)}", "last_week": f"{min(last_w_dates)}..{max(last_w_dates)}"},
        "non_brand": {"this_week": nb_cur, "last_week": nb_prev, "four_week_weekly_avg": nb_base},
        "brand": {"this_week": br_cur, "last_week": br_prev},
        "alerts": alerts,
        "action_movers": movers[:5],
        "protect_healthy": protect,
        "noise_filtered": noise,
    }


def main():
    ap = argparse.ArgumentParser(description="Weekly Pulse Triple-Window Triage")
    ap.add_argument("--daily", required=True, help="Daily campaign CSV (at least 14 days, ideally 35+ days)")
    ap.add_argument("--brand", default="")
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    rows = load_csv(args.daily)
    res = triage_weekly(rows, args.brand, args.target_cpa)
    if "error" in res:
        print(f"ERROR: {res['error']}", file=sys.stderr)
        sys.exit(1)
    if args.json:
        print(json.dumps(res, indent=2))
        return

    nb = res["non_brand"]
    print(f"=== WEEKLY PULSE ({res['dates']['this_week']} vs {res['dates']['last_week']}) ===")
    print(f"Non-Brand This Week : Cost ${nb['this_week']['cost']:,.2f} | Conv {nb['this_week']['conv']} | CPA {nb['this_week']['cpa']} | CPC ${nb['this_week']['cpc']} | CVR {nb['this_week']['cvr']}%")
    print(f"Non-Brand Last Week : Cost ${nb['last_week']['cost']:,.2f} | Conv {nb['last_week']['conv']} | CPA {nb['last_week']['cpa']} | CPC ${nb['last_week']['cpc']} | CVR {nb['last_week']['cvr']}%")
    print(f"Non-Brand 4-Wk Avg  : Cost ${nb['four_week_weekly_avg']['cost']:,.2f} | Conv {nb['four_week_weekly_avg']['conv']} | CPA {nb['four_week_weekly_avg']['cpa']}")

    if res["alerts"]:
        print("\n=== LAG / TRACKING SANITY CHECKS ===")
        for a in res["alerts"]:
            print(f"  - {a}")

    print("\n=== REAL MOVERS NEEDING ACTION THIS WEEK ===")
    if not res["action_movers"]:
        print("  None outside 4-week variance band.")
    for m in res["action_movers"]:
        print(f"  - {m['campaign']}: ${m['cost']:,.2f} | CPA {m['cpa_this_week']} (WoW {m['cpa_wow_pct']}%, vs 4w {m['cpa_vs_4w_pct']}%) | Lever: {m['primary_lever']}")

    print("\n=== PROTECT (HEALTHY - DO NOT TOUCH) ===")
    for p in res["protect_healthy"]:
        print(f"  - {p['campaign']}: ${p['cost']:,.2f}, {p['conv']} conv, CPA ${p['cpa']}")

    if res["noise_filtered"]:
        print("\n=== FILTERED AS SMALL-SAMPLE NOISE ===")
        for n in res["noise_filtered"]:
            print(f"  - {n['campaign']}: ${n['cost']:,.2f}, {n['clicks']} clicks, expected_leads={n['expected_leads']}")


if __name__ == "__main__":
    main()
