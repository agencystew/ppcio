#!/usr/bin/env python3
"""Deterministic Google Ads 90-day causal audit engine (zero dependencies).

Computes Brand vs. Non-Brand split, expected_leads < 2 noise floors, wasted spend,
PMax brand-padding red flags, fragmentation risk, and healthy campaigns to PROTECT.
"""
import argparse
import csv
import json
import re
import sys
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
    if s.startswith(">"):
        m = re.search(r"[\d.]+", s)
        return float(m.group(0)) if m else 0.0
    s = re.sub(r"[^\d.\-]", "", s)
    try:
        return float(s) if s else 0.0
    except ValueError:
        return 0.0


def load_gads_csv(path):
    lines = Path(path).read_text(encoding="utf-8-sig", errors="replace").splitlines()
    header_idx = 0
    for i, line in enumerate(lines[:15]):
        low = line.lower()
        if ("campaign" in low or "keyword" in low or "search term" in low) and (
            "cost" in low or "clicks" in low or "impr" in low
        ):
            header_idx = i
            break
    reader = csv.DictReader(lines[header_idx:])
    rows = []
    for r in reader:
        if not r:
            continue
        first_val = next((str(v).strip() for v in r.values() if v is not None), "")
        if not first_val or first_val.lower().startswith("total"):
            continue
        rows.append({(k or "").strip(): (v or "").strip() for k, v in r.items()})
    return rows


def col(row, candidates):
    low_map = {k.lower(): v for k, v in row.items()}
    for c in candidates:
        if c.lower() in low_map:
            return low_map[c.lower()]
    for k, v in low_map.items():
        for c in candidates:
            if c.lower() in k:
                return v
    return ""


def is_brand(name, pattern):
    if pattern:
        return bool(re.search(pattern, name, re.I))
    return bool(re.search(r"\bbrand(ed)?\b", name, re.I))


def is_pmax(name, ctype):
    return bool(re.search(r"pmax|performance\s*max", f"{name} {ctype}", re.I))


def analyze(rows, brand_pattern="", target_cpa=None, target_roas=None):
    camps = []
    for r in rows:
        name = col(r, ["Campaign", "Campaign name"])
        if not name:
            continue
        status = col(r, ["Campaign state", "Status", "State"]) or "Enabled"
        ctype = col(r, ["Campaign type", "Channel type"])
        bid = col(r, ["Bid strategy type", "Bid strategy"])
        cost = parse_num(col(r, ["Cost", "Spend"]))
        clicks = parse_num(col(r, ["Clicks"]))
        impr = parse_num(col(r, ["Impr.", "Impressions"]))
        conv = parse_num(col(r, ["Conversions", "Conv."]))
        val = parse_num(col(r, ["Conv. value", "Conversion value", "Revenue"]))
        budget = parse_num(col(r, ["Budget", "Daily budget"]))
        is_share = parse_num(col(r, ["Search impr. share", "Search IS"]))
        lost_bud = parse_num(col(r, ["Search lost IS (budget)", "Lost IS (budget)"]))
        lost_rank = parse_num(col(r, ["Search lost IS (rank)", "Lost IS (rank)"]))
        if cost == 0 and clicks == 0 and conv == 0:
            continue
        cpa = (cost / conv) if conv > 0 else None
        roas = (val / cost) if (cost > 0 and val > 0) else None
        cvr = (conv / clicks) if clicks > 0 else 0.0
        ctr = (clicks / impr) if impr > 0 else 0.0
        cpc = (cost / clicks) if clicks > 0 else 0.0
        camps.append({
            "campaign": name,
            "status": status,
            "type": ctype,
            "bid_strategy": bid,
            "is_brand": is_brand(name, brand_pattern),
            "is_pmax": is_pmax(name, ctype),
            "cost": cost,
            "clicks": clicks,
            "impressions": impr,
            "conversions": conv,
            "conv_value": val,
            "budget": budget,
            "cpa": cpa,
            "roas": roas,
            "cvr": cvr,
            "ctr": ctr,
            "cpc": cpc,
            "search_is": is_share,
            "lost_is_budget": lost_bud,
            "lost_is_rank": lost_rank,
        })

    def summarize(items):
        cost = sum(x["cost"] for x in items)
        clicks = sum(x["clicks"] for x in items)
        conv = sum(x["conversions"] for x in items)
        val = sum(x["conv_value"] for x in items)
        return {
            "campaigns": len(items),
            "cost": round(cost, 2),
            "clicks": int(round(clicks)),
            "conversions": round(conv, 2),
            "conv_value": round(val, 2),
            "cpa": round(cost / conv, 2) if conv > 0 else None,
            "roas": round(val / cost, 2) if (cost > 0 and val > 0) else None,
            "cvr_pct": round((conv / clicks) * 100, 2) if clicks > 0 else 0.0,
            "cpc": round(cost / clicks, 2) if clicks > 0 else 0.0,
        }

    total = summarize(camps)
    brand_sum = summarize([c for c in camps if c["is_brand"]])
    nonbrand_items = [c for c in camps if not c["is_brand"]]
    nonbrand_sum = summarize(nonbrand_items)
    nb_cvr = (nonbrand_sum["conversions"] / nonbrand_sum["clicks"]) if nonbrand_sum["clicks"] > 0 else 0.0
    effective_target = target_cpa or nonbrand_sum["cpa"] or total["cpa"] or 100.0

    flags = []
    protect = []
    waste_candidates = []
    noise_campaigns = []

    # Account-level sanity checks
    if total["conversions"] < 10:
        flags.append(f"FEW_DATA: Only {total['conversions']} total conversions in export; treat CPA/ROAS splits as directional only.")
    if nonbrand_sum["cvr_pct"] > 25.0 and nonbrand_sum["clicks"] >= 50:
        flags.append(
            f"TRACKING_INFLATION_SUSPECT: Non-Brand CVR is {nonbrand_sum['cvr_pct']}% across {nonbrand_sum['clicks']} clicks. "
            "Check Primary conversions for page views, button clicks, or 5-second calls before touching bids."
        )
    if brand_sum["cost"] > 0 and nonbrand_sum["cpa"] and total["cpa"]:
        distortion = ((nonbrand_sum["cpa"] - total["cpa"]) / nonbrand_sum["cpa"]) * 100
        if distortion >= 15:
            flags.append(
                f"BRAND_MASKING_DISTORTION: Blended CPA is {total['cpa']} but true Non-Brand CPA is {nonbrand_sum['cpa']} "
                f"(Brand hides {distortion:.1f}% of acquisition cost)."
            )

    enabled_nb = [c for c in nonbrand_items if "paused" not in c["status"].lower() and c["cost"] > 0]
    if len(enabled_nb) >= 5 and nonbrand_sum["conversions"] > 0:
        avg_conv_per_camp = nonbrand_sum["conversions"] / len(enabled_nb)
        if avg_conv_per_camp < 15:
            flags.append(
                f"OVER_FRAGMENTATION: {len(enabled_nb)} active Non-Brand campaigns average only {avg_conv_per_camp:.1f} conversions each "
                "(starves Smart Bidding below the 30/mo density floor)."
            )

    for c in camps:
        expected_leads = c["clicks"] * (nb_cvr if not c["is_brand"] else (total["cvr_pct"] / 100.0))
        c["expected_leads"] = round(expected_leads, 2)

        if c["is_pmax"] and ((c["roas"] and c["roas"] >= 5.0) or (c["cvr"] >= 0.15 and c["clicks"] >= 40)):
            flags.append(
                f"PMAX_BRAND_AUDIT_NEEDED: '{c['campaign']}' shows suspiciously high efficiency "
                f"(ROAS={c['roas']}, CVR={c['cvr']*100:.1f}%). Run pmax-health-check to strip Brand before trusting it."
            )

        if c["is_brand"]:
            if not target_cpa or (c["cpa"] and c["cpa"] <= effective_target):
                protect.append({"campaign": c["campaign"], "reason": f"Brand capture (${c['cost']:.0f} spend, {c['conversions']:.1f} conv, CPA {c['cpa']})"})
            continue

        # Small-sample noise floor
        if c["clicks"] < 20 or (c["conversions"] == 0 and expected_leads < 2.0 and c["cost"] < effective_target):
            noise_campaigns.append({
                "campaign": c["campaign"],
                "cost": round(c["cost"], 2),
                "clicks": int(c["clicks"]),
                "expected_leads": round(expected_leads, 2),
            })
            continue

        # Waste vs Healthy classification
        if c["conversions"] == 0 and (c["cost"] >= effective_target or expected_leads >= 2.0):
            waste_candidates.append({
                "campaign": c["campaign"],
                "cost": round(c["cost"], 2),
                "clicks": int(c["clicks"]),
                "conversions": 0.0,
                "cpa": None,
                "issue": f"Zero conversions on ${c['cost']:.2f} ({c['clicks']:.0f} clicks, expected {expected_leads:.1f} leads)",
            })
        elif target_roas and c["roas"] is not None and c["roas"] < target_roas * 0.75:
            waste_candidates.append({
                "campaign": c["campaign"],
                "cost": round(c["cost"], 2),
                "clicks": int(c["clicks"]),
                "conversions": round(c["conversions"], 2),
                "roas": round(c["roas"], 2),
                "issue": f"ROAS {c['roas']:.2f}x is >25% below target {target_roas:.2f}x on ${c['cost']:.2f} spend",
            })
        elif c["cpa"] is not None and c["cpa"] > effective_target * 1.35 and c["conversions"] >= 3:
            waste_candidates.append({
                "campaign": c["campaign"],
                "cost": round(c["cost"], 2),
                "clicks": int(c["clicks"]),
                "conversions": round(c["conversions"], 2),
                "cpa": round(c["cpa"], 2),
                "issue": f"CPA ${c['cpa']:.2f} is {((c['cpa']/effective_target)-1)*100:.0f}% above target ${effective_target:.2f}",
            })
        elif (target_roas and c["roas"] is not None and c["roas"] >= target_roas) or (
            not target_roas and c["cpa"] is not None and c["cpa"] <= effective_target and c["conversions"] >= 3
        ):
            headroom = f", {c['lost_is_budget']:.0f}% Lost IS (Budget)" if c["lost_is_budget"] >= 15 else ""
            protect.append({
                "campaign": c["campaign"],
                "reason": f"Healthy winner (${c['cost']:.0f} spend, {c['conversions']:.1f} conv, CPA ${c['cpa']:.2f}{headroom})",
            })

    waste_candidates.sort(key=lambda x: x["cost"], reverse=True)
    return {
        "total": total,
        "brand": brand_sum,
        "non_brand": nonbrand_sum,
        "target_cpa_used": round(effective_target, 2),
        "flags": flags,
        "waste_candidates": waste_candidates,
        "protect_healthy": protect,
        "small_sample_noise": noise_campaigns,
    }


def main():
    ap = argparse.ArgumentParser(description="Deterministic Google Ads causal audit engine")
    ap.add_argument("--campaigns", required=True, help="Campaigns CSV export path")
    ap.add_argument("--brand", default="", help="Regex pattern matching brand campaign names")
    ap.add_argument("--target-cpa", type=float, default=None, help="Target CPA")
    ap.add_argument("--target-roas", type=float, default=None, help="Target ROAS (e.g. 3.5)")
    ap.add_argument("--json", action="store_true", help="Emit JSON output")
    args = ap.parse_args()

    rows = load_gads_csv(args.campaigns)
    if not rows:
        print("ERROR: No campaign rows parsed from CSV.", file=sys.stderr)
        sys.exit(1)

    res = analyze(rows, args.brand, args.target_cpa, args.target_roas)
    if args.json:
        print(json.dumps(res, indent=2))
        return

    t, b, nb = res["total"], res["brand"], res["non_brand"]
    print("=== ACCOUNT SUMMARY (BRAND VS NON-BRAND) ===")
    print(f"Total     : {t['campaigns']} camps | Cost ${t['cost']:,.2f} | Clicks {t['clicks']:,} | Conv {t['conversions']} | CPA {t['cpa']} | ROAS {t['roas']} | CVR {t['cvr_pct']}%")
    print(f"Brand     : {b['campaigns']} camps | Cost ${b['cost']:,.2f} | Clicks {b['clicks']:,} | Conv {b['conversions']} | CPA {b['cpa']} | ROAS {b['roas']} | CVR {b['cvr_pct']}%")
    print(f"Non-Brand : {nb['campaigns']} camps | Cost ${nb['cost']:,.2f} | Clicks {nb['clicks']:,} | Conv {nb['conversions']} | CPA {nb['cpa']} | ROAS {nb['roas']} | CVR {nb['cvr_pct']}%")

    if res["flags"]:
        print("\n=== CRITICAL SYSTEM FLAGS ===")
        for f in res["flags"]:
            print(f"  - {f}")

    print("\n=== TOP WASTE / UNDERPERFORMING CAMPAIGNS (BY SPEND) ===")
    if not res["waste_candidates"]:
        print("  None above threshold.")
    for w in res["waste_candidates"]:
        print(f"  - {w['campaign']}: ${w['cost']:,.2f} | {w['issue']}")

    print("\n=== HEALTHY CAMPAIGNS TO PROTECT (DO NOT BREAK) ===")
    if not res["protect_healthy"]:
        print("  None confirmed yet.")
    for p in res["protect_healthy"]:
        print(f"  - {p['campaign']}: {p['reason']}")

    if res["small_sample_noise"]:
        print("\n=== SMALL-SAMPLE NOISE (HOLD OFF - EXPECTED LEADS < 2 OR < 20 CLICKS) ===")
        for n in res["small_sample_noise"]:
            print(f"  - {n['campaign']}: ${n['cost']:,.2f}, {n['clicks']} clicks, expected_leads={n['expected_leads']}")


if __name__ == "__main__":
    main()
