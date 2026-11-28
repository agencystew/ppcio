#!/usr/bin/env python3
"""Deterministic Bidding Maturity & Percentile CPC Forensics Engine.

Computes per-campaign conversion density, flags Low-Volume Max Conversions CPC inflation
(<15 conv/30d & <3 clicks/day), calculates P50/P75/P80/P90 CPC & Variance Ratio (P90/P50),
compares normal-day vs spike-day (>=P80) CPA/CVR, and respects restraint on healthy campaigns.
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
        if "campaign" in low and ("cost" in low or "clicks" in low or "cpc" in low):
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


def percentile(sorted_vals, pct):
    if not sorted_vals:
        return 0.0
    k = (len(sorted_vals) - 1) * (pct / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return sorted_vals[int(k)]
    return sorted_vals[f] + (sorted_vals[c] - sorted_vals[f]) * (k - f)


def analyze_bidding(rows, window_days=30, target_cpa=None, brand_pattern="", baseline_cpc=None):
    by_camp = defaultdict(lambda: {"cost": 0.0, "clicks": 0.0, "conv": 0.0, "val": 0.0, "bid": "", "obs": [], "status": "Enabled"})

    for r in rows:
        name = col(r, ["Campaign", "Campaign name"])
        if not name:
            continue
        st = col(r, ["Campaign state", "Status"]) or "Enabled"
        if "paused" in st.lower() or "removed" in st.lower():
            continue
        bid = col(r, ["Bid strategy type", "Bid strategy"])
        cost = parse_num(col(r, ["Cost", "Spend"]))
        clicks = parse_num(col(r, ["Clicks"]))
        conv = parse_num(col(r, ["Conversions", "Conv."]))
        val = parse_num(col(r, ["Conv. value", "Revenue"]))
        row_cpc = parse_num(col(r, ["Avg. CPC", "CPC"]))
        if row_cpc == 0 and clicks > 0:
            row_cpc = cost / clicks

        rec = by_camp[name]
        rec["cost"] += cost
        rec["clicks"] += clicks
        rec["conv"] += conv
        rec["val"] += val
        if bid:
            rec["bid"] = bid
        if row_cpc > 0 and clicks > 0:
            rec["obs"].append({"cpc": row_cpc, "cost": cost, "clicks": clicks, "conv": conv})

    scale_30 = 30.0 / max(1, window_days)
    results = []
    for name, v in by_camp.items():
        if v["cost"] <= 0 and v["clicks"] <= 0:
            continue
        conv_30d = v["conv"] * scale_30
        clicks_per_day = v["clicks"] / max(1, window_days)
        avg_cpc = (v["cost"] / v["clicks"]) if v["clicks"] > 0 else 0.0
        cpa = (v["cost"] / v["conv"]) if v["conv"] > 0 else None
        is_br = bool(re.search(brand_pattern or r"\bbrand(ed)?\b", name, re.I))

        cpcs_sorted = sorted(o["cpc"] for o in v["obs"])
        p50 = percentile(cpcs_sorted, 50) if len(cpcs_sorted) >= 4 else avg_cpc
        p75 = percentile(cpcs_sorted, 75) if len(cpcs_sorted) >= 4 else avg_cpc
        p80 = percentile(cpcs_sorted, 80) if len(cpcs_sorted) >= 4 else avg_cpc
        p90 = percentile(cpcs_sorted, 90) if len(cpcs_sorted) >= 4 else avg_cpc
        var_ratio = (p90 / p50) if p50 > 0 else 1.0

        # Spike-day (>=P80) vs normal-day (<P80) CPA comparison
        spike_split = None
        if len(cpcs_sorted) >= 5 and var_ratio >= 2.0:
            hi_obs = [o for o in v["obs"] if o["cpc"] >= p80]
            lo_obs = [o for o in v["obs"] if o["cpc"] < p80]
            hi_cost, hi_conv = sum(o["cost"] for o in hi_obs), sum(o["conv"] for o in hi_obs)
            lo_cost, lo_conv = sum(o["cost"] for o in lo_obs), sum(o["conv"] for o in lo_obs)
            spike_split = {
                "normal_days": len(lo_obs),
                "normal_cpa": round(lo_cost / lo_conv, 2) if lo_conv > 0 else None,
                "spike_days": len(hi_obs),
                "spike_spend_share_pct": round((hi_cost / v["cost"]) * 100, 1) if v["cost"] > 0 else 0.0,
                "spike_cpa": round(hi_cost / hi_conv, 2) if hi_conv > 0 else None,
            }

        flags = []
        rec_strategy = ""
        bid_low = v["bid"].lower()

        if is_br:
            rec_strategy = "Keep isolated from Non-Brand (Manual CPC or Target Impression Share with Max CPC cap)."
        elif conv_30d < 15 and clicks_per_day < 3.0 and ("max" in bid_low and "conv" in bid_low):
            flags.append(
                f"LOW_VOLUME_CPC_INFLATION_RISK: Only {conv_30d:.1f} conv/30d and {clicks_per_day:.2f} clicks/day on {v['bid']}."
            )
            cap_note = (
                f"at your historical baseline cap (${baseline_cpc:.2f})"
                if baseline_cpc else
                "anchored to your best historical month's Avg. CPC BEFORE switching to Max Conversions (do NOT use the inflated current CPC as cap)"
            )
            rec_strategy = f"14-day Maximize Clicks with Max CPC cap {cap_note}."
        elif conv_30d < 15:
            rec_strategy = f"Maximize Clicks + Max CPC cap (~${baseline_cpc or p80:.2f}) or Manual CPC until reaching 15 to 30 conv/30d."
        elif conv_30d < 30:
            rec_strategy = "Maximize Conversions (tight search-term hygiene); hold strict tCPA until >=30 conv/30d."
        elif "target cpa" in bid_low and target_cpa and cpa and cpa <= target_cpa:
            rec_strategy = f"PROTECT / KEEP Target CPA (healthy winner at ${cpa:.2f} CPA vs ${target_cpa:.2f} goal; do not slash target)."
        else:
            start_tcpa = round((cpa * 0.9) if cpa else (target_cpa or 0), 2)
            if target_cpa and cpa and target_cpa < cpa * 0.75:
                flags.append(f"AGGRESSIVE_TARGET_WARNING: Goal ${target_cpa:.2f} is >25% below actual ${cpa:.2f}; step down 10-15% every 14d (start near ${start_tcpa:.2f}).")
            rec_strategy = f"Target CPA starting near ${start_tcpa:.2f} (within 10-15% of trailing actual ${cpa:.2f})" if cpa else "Target CPA / Target ROAS ready."

        if spike_split:
            worse = (spike_split["spike_cpa"] is None) or (
                spike_split["normal_cpa"] and spike_split["spike_cpa"] > spike_split["normal_cpa"] * 1.25
            )
            if worse:
                flags.append(
                    f"CPC_TAIL_SPIKE_DETECTED: P50=${p50:.2f}, P90=${p90:.2f} (Variance Ratio {var_ratio:.2f}x >= 2.0x). "
                    f"Spike days (>=${p80:.2f}) take {spike_split['spike_spend_share_pct']}% of spend at ${spike_split['spike_cpa'] or 0:.2f} CPA "
                    f"vs ${spike_split['normal_cpa'] or 0:.2f} on normal days. Test a 14-day / 50-conv 80th-percentile Max CPC cap at ${p80:.2f} (rollback if CPA +20% for 5d)."
                )

        results.append({
            "campaign": name,
            "is_brand": is_br,
            "current_bid_strategy": v["bid"] or "Unknown",
            "cost": round(v["cost"], 2),
            "conv_30d_rate": round(conv_30d, 1),
            "clicks_per_day": round(clicks_per_day, 2),
            "avg_cpc": round(avg_cpc, 2),
            "cpa": round(cpa, 2) if cpa else None,
            "cpc_percentiles": {
                "samples": len(cpcs_sorted),
                "p50": round(p50, 2),
                "p75": round(p75, 2),
                "p80_cap": round(p80, 2),
                "p90": round(p90, 2),
                "variance_ratio": round(var_ratio, 2),
            },
            "spike_vs_normal": spike_split,
            "recommendation": rec_strategy,
            "flags": flags,
        })

    results.sort(key=lambda x: x["cost"], reverse=True)
    return {"window_days": window_days, "campaigns": results}


def main():
    ap = argparse.ArgumentParser(description="Google Ads Bidding Maturity & Percentile CPC Forensics")
    ap.add_argument("--csv", required=True, help="Campaign or Daily Campaign CSV")
    ap.add_argument("--days", type=int, default=30, help="Window length in days (default 30)")
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--baseline-cpc", type=float, default=None, help="Historical best-month Avg. CPC before Max Conversions")
    ap.add_argument("--brand", default="")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    rows = load_csv(args.csv)
    if not rows:
        print("ERROR: No rows parsed from CSV.", file=sys.stderr)
        sys.exit(1)

    res = analyze_bidding(rows, args.days, args.target_cpa, args.brand, args.baseline_cpc)
    if args.json:
        print(json.dumps(res, indent=2))
        return

    print(f"=== BIDDING MATURITY & CPC FORENSICS ({res['window_days']}d window) ===")
    for c in res["campaigns"]:
        p = c["cpc_percentiles"]
        cpa_s = f"${c['cpa']:,.2f}" if c["cpa"] is not None else "N/A"
        print(f"\n- {c['campaign']} [{c['current_bid_strategy']}] | ${c['cost']:,.2f} | {c['conv_30d_rate']} conv/30d | {c['clicks_per_day']} clicks/d | CPA {cpa_s}")
        if p["samples"] >= 4:
            print(f"  CPC Percentiles ({p['samples']} pts): P50=${p['p50']:.2f} | P75=${p['p75']:.2f} | P80 Cap=${p['p80_cap']:.2f} | P90=${p['p90']:.2f} | Ratio={p['variance_ratio']:.2f}x")
        print(f"  Recommendation: {c['recommendation']}")
        for f in c["flags"]:
            print(f"  FLAG: {f}")


if __name__ == "__main__":
    main()
