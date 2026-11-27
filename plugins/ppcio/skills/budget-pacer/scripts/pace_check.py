#!/usr/bin/env python3
"""Deterministic Google Ads Budget Pacing & Reallocation Engine.

Uses actual days_with_spend (never divides partial-month spend by 30), flags unspent-budget
traps (never recommends raising an unspent cap), and ranks reallocation from dearest to cheapest CPL.
"""
import argparse
import csv
import json
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
    for i, l in enumerate(lines[:15]):
        low = l.lower()
        if "campaign" in low and ("cost" in low or "budget" in low):
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


def analyze_pacing(rows, monthly_budget, days_elapsed, days_in_month, target_cpa=None):
    remaining_days = max(0, days_in_month - days_elapsed)
    by_camp = defaultdict(lambda: {"dates": {}, "budget": 0.0, "conv": 0.0, "lost_bud": 0.0, "lost_rank": 0.0, "cost": 0.0, "status": "Enabled"})
    has_day_col = False

    for r in rows:
        name = col(r, ["Campaign", "Campaign name"])
        if not name:
            continue
        day = col(r, ["Day", "Date"])
        cost = parse_num(col(r, ["Cost", "Spend"]))
        conv = parse_num(col(r, ["Conversions", "Conv."]))
        bud = parse_num(col(r, ["Budget", "Daily budget"]))
        lb = parse_num(col(r, ["Search lost IS (budget)", "Lost IS (budget)"]))
        lr = parse_num(col(r, ["Search lost IS (rank)", "Lost IS (rank)"]))
        st = col(r, ["Campaign state", "Status"]) or "Enabled"
        rec = by_camp[name]
        rec["cost"] += cost
        rec["conv"] += conv
        if bud > 0:
            rec["budget"] = bud
        if lb > 0:
            rec["lost_bud"] = lb
        if lr > 0:
            rec["lost_rank"] = lr
        rec["status"] = st
        if day:
            has_day_col = True
            rec["dates"][day] = rec["dates"].get(day, 0.0) + cost

    mtd_spend = sum(v["cost"] for v in by_camp.values())
    all_dates = sorted({d for v in by_camp.values() for d in v["dates"]})
    if has_day_col and len(all_dates) >= 7:
        last7 = set(all_dates[-7:])
        recent_7d_spend = sum(v["dates"].get(d, 0.0) for v in by_camp.values() for d in last7)
        recent_daily = recent_7d_spend / 7.0
        active_account_days = sum(1 for d in all_dates if sum(v["dates"].get(d, 0.0) for v in by_camp.values()) > 0)
    else:
        active_account_days = max(1, days_elapsed)
        recent_daily = mtd_spend / active_account_days

    mtd_daily = mtd_spend / max(1, active_account_days)
    projected = mtd_spend + (recent_daily * remaining_days)
    variance = projected - monthly_budget
    variance_pct = (variance / monthly_budget * 100) if monthly_budget > 0 else 0.0
    needed_daily = ((monthly_budget - mtd_spend) / remaining_days) if remaining_days > 0 else 0.0

    unspent_traps = []
    mid_window_launches = []
    scale_recipients = []
    trim_donors = []

    for name, v in by_camp.items():
        if "paused" in v["status"].lower():
            continue
        days_with_spend = sum(1 for c in v["dates"].values() if c > 0) if has_day_col else days_elapsed
        avg_daily = v["cost"] / max(1, days_with_spend)
        util_pct = (avg_daily / v["budget"] * 100) if v["budget"] > 0 else None
        cpa = (v["cost"] / v["conv"]) if v["conv"] > 0 else None

        if has_day_col and 0 < days_with_spend < max(1, len(all_dates) * 0.6):
            mid_window_launches.append({
                "campaign": name,
                "days_with_spend": days_with_spend,
                "active_daily_spend": round(avg_daily, 2),
                "note": f"Active only {days_with_spend} of {len(all_dates)} days; use active daily rate (${avg_daily:.2f}/d), NOT /30.",
            })

        if util_pct is not None and util_pct < 75.0 and v["budget"] > 0:
            cause = "Smart Bidding throttling or Rank Lost IS" if v["lost_rank"] >= 25 else "Targeting/bid constraint"
            unspent_traps.append({
                "campaign": name,
                "daily_budget": round(v["budget"], 2),
                "actual_daily": round(avg_daily, 2),
                "utilization_pct": round(util_pct, 1),
                "rule": f"DO NOT RAISE BUDGET (only spending {util_pct:.0f}% of ${v['budget']:.0f}/d). Fix {cause} instead.",
            })

        if v["lost_bud"] >= 15.0 and (target_cpa is None or (cpa is not None and cpa <= target_cpa)):
            scale_recipients.append({
                "campaign": name,
                "cpa": round(cpa, 2) if cpa else None,
                "lost_is_budget": round(v["lost_bud"], 1),
                "daily_budget": round(v["budget"], 2),
            })
        elif target_cpa is not None and ((cpa is not None and cpa > target_cpa * 1.25) or (v["conv"] == 0 and v["cost"] >= target_cpa)):
            trim_donors.append({
                "campaign": name,
                "cost": round(v["cost"], 2),
                "cpa": round(cpa, 2) if cpa else None,
                "daily_budget": round(v["budget"], 2),
            })

    scale_recipients.sort(key=lambda x: (x["cpa"] if x["cpa"] is not None else 999999))
    trim_donors.sort(key=lambda x: (x["cpa"] if x["cpa"] is not None else 999999), reverse=True)

    return {
        "monthly_budget": round(monthly_budget, 2),
        "mtd_spend": round(mtd_spend, 2),
        "days_elapsed": days_elapsed,
        "days_remaining": remaining_days,
        "active_spend_days": active_account_days,
        "mtd_daily_avg": round(mtd_daily, 2),
        "recent_7d_daily_avg": round(recent_daily, 2),
        "projected_month_end": round(projected, 2),
        "variance": round(variance, 2),
        "variance_pct": round(variance_pct, 1),
        "daily_needed_remaining": round(needed_daily, 2),
        "unspent_budget_traps": unspent_traps,
        "mid_window_launches": mid_window_launches,
        "scale_recipients": scale_recipients,
        "trim_donors": trim_donors,
    }


def main():
    ap = argparse.ArgumentParser(description="Deterministic Google Ads Budget Pacing Engine")
    ap.add_argument("--csv", required=True, help="Campaign or Daily Campaign CSV")
    ap.add_argument("--monthly-budget", type=float, required=True)
    ap.add_argument("--days-elapsed", type=int, required=True)
    ap.add_argument("--days-in-month", type=int, default=30)
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    rows = load_csv(args.csv)
    if not rows:
        print("ERROR: No rows parsed from CSV.", file=sys.stderr)
        sys.exit(1)

    res = analyze_pacing(rows, args.monthly_budget, args.days_elapsed, args.days_in_month, args.target_cpa)
    if args.json:
        print(json.dumps(res, indent=2))
        return

    print("=== BUDGET PACING VERDICT ===")
    print(f"MTD Spend       : ${res['mtd_spend']:,.2f} of ${res['monthly_budget']:,.2f} ({res['days_elapsed']}/{res['days_elapsed']+res['days_remaining']} days elapsed)")
    print(f"Daily Run Rate  : MTD active avg ${res['mtd_daily_avg']:,.2f}/d | Recent 7d avg ${res['recent_7d_daily_avg']:,.2f}/d")
    print(f"Month-End Proj. : ${res['projected_month_end']:,.2f} (Variance: ${res['variance']:+,.2f} / {res['variance_pct']:+.1f}%)")
    print(f"Needed Remaining: ${res['daily_needed_remaining']:,.2f}/day over {res['days_remaining']} remaining days")

    if res["unspent_budget_traps"]:
        print("\n=== UNSPENT BUDGET TRAPS (DO NOT RAISE BUDGET CAP!) ===")
        for u in res["unspent_budget_traps"]:
            print(f"  - {u['campaign']}: {u['rule']}")

    if res["mid_window_launches"]:
        print("\n=== MID-WINDOW LAUNCHES (ACTIVE-DAYS ADJUSTED) ===")
        for m in res["mid_window_launches"]:
            print(f"  - {m['campaign']}: {m['note']}")

    if res["scale_recipients"]:
        print("\n=== PROFITABLE SCALE RECIPIENTS (CHEAPEST CPL FIRST) ===")
        for s in res["scale_recipients"]:
            print(f"  - {s['campaign']}: CPA ${s['cpa']} | Lost IS (Budget) {s['lost_is_budget']}% | Budget ${s['daily_budget']}/d")

    if res["trim_donors"]:
        print("\n=== EXPENSIVE DONORS TO TRIM FIRST (DEAREST CPL FIRST) ===")
        for d in res["trim_donors"]:
            print(f"  - {d['campaign']}: CPA {d['cpa']} | MTD Cost ${d['cost']:,.2f} | Budget ${d['daily_budget']}/d")


if __name__ == "__main__":
    main()
