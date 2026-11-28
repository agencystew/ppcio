#!/usr/bin/env python3
"""Deterministic Spend-Weighted Quality Score & Pre-Qualifier Protection Engine."""
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
        if "keyword" in low and ("quality score" in low or "cost" in low):
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


def is_below(val):
    return "below" in (val or "").lower()


def analyze_qs(rows, target_cpa=None):
    total_cost = 0.0
    weighted_qs_num = 0.0
    low_qs_cost = 0.0
    actionable_comp_spend = {"ad_relevance": 0.0, "expected_ctr": 0.0, "landing_page": 0.0}
    fix_queue = []
    protected_prequalifiers = []
    pause_candidates = []
    ignored_low_vol = []

    all_clicks = sum(parse_num(col(r, ["Clicks"])) for r in rows)
    all_conv = sum(parse_num(col(r, ["Conversions", "Conv."])) for r in rows)
    acct_cvr = (all_conv / all_clicks) if all_clicks > 0 else 0.0

    for r in rows:
        kw = col(r, ["Keyword", "Search keyword"])
        if not kw:
            continue
        camp = col(r, ["Campaign"])
        ag = col(r, ["Ad group"])
        qs = parse_num(col(r, ["Quality Score", "Qual. score"]))
        cost = parse_num(col(r, ["Cost", "Spend"]))
        clicks = parse_num(col(r, ["Clicks"]))
        impr = parse_num(col(r, ["Impr.", "Impressions"]))
        conv = parse_num(col(r, ["Conversions", "Conv."]))
        exp_ctr = col(r, ["Exp. CTR", "Expected CTR", "Expected clickthrough rate"])
        ad_rel = col(r, ["Ad relevance", "Ad rel."])
        lp_exp = col(r, ["Landing page exp.", "Landing page experience", "LP exp."])

        if qs <= 0 or cost <= 0:
            continue

        # Align strictly with SKILL.md: ignore <100 impr OR <20 clicks (insufficient auction history)
        if impr < 100 or clicks < 20:
            ignored_low_vol.append({"keyword": kw, "qs": int(qs), "cost": round(cost, 2), "clicks": int(clicks), "impressions": int(impr)})
            continue

        total_cost += cost
        weighted_qs_num += qs * cost
        cvr = (conv / clicks) if clicks > 0 else 0.0
        cpa = (cost / conv) if conv > 0 else None

        if qs <= 5:
            low_qs_cost += cost

            # Protect high-CVR pre-qualifying ads even when Exp. CTR is Below Average
            if is_below(exp_ctr) and conv >= 3 and ((target_cpa and cpa and cpa <= target_cpa) or (acct_cvr > 0 and cvr >= acct_cvr * 1.25)):
                protected_prequalifiers.append({
                    "keyword": kw,
                    "ad_group": ag,
                    "cost": round(cost, 2),
                    "qs": int(qs),
                    "clicks": int(clicks),
                    "conversions": round(conv, 1),
                    "cvr_pct": round(cvr * 100, 1),
                    "cpa": round(cpa, 2) if cpa else None,
                    "note": "PROTECT PRE-QUALIFIER: Below Avg Exp. CTR but strong CVR/CPA. Do NOT strip price/buyer qualifiers just to chase CTR!",
                })
                continue

            if qs <= 3 and conv == 0 and is_below(ad_rel) and is_below(exp_ctr) and is_below(lp_exp) and (
                (target_cpa and cost >= target_cpa) or clicks >= 25
            ):
                pause_candidates.append({
                    "keyword": kw,
                    "campaign": camp,
                    "ad_group": ag,
                    "qs": int(qs),
                    "cost": round(cost, 2),
                    "clicks": int(clicks),
                })
                continue

            # Accumulate actionable bottleneck spend ONLY on repairable fix-queue keywords
            if is_below(ad_rel):
                actionable_comp_spend["ad_relevance"] += cost
            if is_below(exp_ctr):
                actionable_comp_spend["expected_ctr"] += cost
            if is_below(lp_exp):
                actionable_comp_spend["landing_page"] += cost

            fix_queue.append({
                "keyword": kw,
                "campaign": camp,
                "ad_group": ag,
                "qs": int(qs),
                "cost": round(cost, 2),
                "clicks": int(clicks),
                "conversions": round(conv, 1),
                "cvr_pct": round(cvr * 100, 1),
                "cpa": round(cpa, 2) if cpa else None,
                "below_components": [
                    name for name, flag in [
                        ("Ad Relevance", is_below(ad_rel)),
                        ("Exp. CTR", is_below(exp_ctr)),
                        ("Landing Page", is_below(lp_exp)),
                    ] if flag
                ],
            })

    fix_queue.sort(key=lambda x: x["cost"], reverse=True)
    max_val = max(actionable_comp_spend.values()) if actionable_comp_spend else 0.0
    dominant_list = [k for k, v in actionable_comp_spend.items() if v == max_val and v > 0]
    wqs = (weighted_qs_num / total_cost) if total_cost > 0 else 0.0

    return {
        "total_rated_spend": round(total_cost, 2),
        "spend_weighted_qs": round(wqs, 2),
        "low_qs_spend": round(low_qs_cost, 2),
        "low_qs_spend_share_pct": round((low_qs_cost / total_cost * 100), 1) if total_cost > 0 else 0.0,
        "dominant_failing_component": " + ".join(dominant_list) if dominant_list else "none",
        "actionable_component_spend": {k: round(v, 2) for k, v in actionable_comp_spend.items()},
        "top_fix_queue": fix_queue[:15],
        "protected_prequalifiers": protected_prequalifiers,
        "pause_candidates": pause_candidates,
        "ignored_low_volume_keywords": len(ignored_low_vol),
        "ignored_low_volume_list": ignored_low_vol,
    }


def main():
    ap = argparse.ArgumentParser(description="Spend-Weighted Google Ads Quality Score Audit")
    ap.add_argument("--keywords", required=True, help="Keywords CSV export with QS columns")
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    rows = load_csv(args.keywords)
    if not rows:
        print("ERROR: No keyword rows parsed from CSV.", file=sys.stderr)
        sys.exit(1)

    res = analyze_qs(rows, args.target_cpa)
    if args.json:
        print(json.dumps(res, indent=2))
        return

    print("=== SPEND-WEIGHTED QUALITY SCORE SUMMARY ===")
    print(f"Spend-Weighted Avg QS : {res['spend_weighted_qs']} / 10 (across ${res['total_rated_spend']:,.2f} qualified spend)")
    print(f"Spend at QS <= 5      : ${res['low_qs_spend']:,.2f} ({res['low_qs_spend_share_pct']}% of qualified spend)")
    print(f"Actionable Bottleneck : {res['dominant_failing_component']} ({res['actionable_component_spend']})")
    if res["ignored_low_volume_list"]:
        names = ", ".join(f"[{x['keyword']}] (${x['cost']:.0f}, {x['clicks']} clicks)" for x in res["ignored_low_volume_list"][:5])
        print(f"Ignored Low-Vol KWs   : {res['ignored_low_volume_keywords']} (<100 impr or <20 clicks): {names}")

    if res["protected_prequalifiers"]:
        print("\n=== PROTECTED PRE-QUALIFYING KEYWORDS (DO NOT REWRITE FOR VANITY CTR!) ===")
        for p in res["protected_prequalifiers"]:
            print(f"  - [{p['keyword']}] QS {p['qs']} | ${p['cost']:,.2f} | CVR {p['cvr_pct']}% | CPA ${p['cpa']:,.2f} | {p['note']}")

    print("\n=== TOP SPEND-CARRYING FIX QUEUE (BY MONTHLY SPEND) ===")
    for k in res["top_fix_queue"][:10]:
        cpa_s = f"${k['cpa']:,.2f}" if k["cpa"] is not None else "N/A"
        print(f"  - [{k['keyword']}] ({k['ad_group']}) | QS {k['qs']} | ${k['cost']:,.2f} | {k['clicks']} clicks | {k['conversions']} conv | CVR {k['cvr_pct']}% | CPA {cpa_s} | Below: {', '.join(k['below_components']) or 'Average'}")

    if res["pause_candidates"]:
        print("\n=== PAUSE CANDIDATES (QS 1-3, ALL BELOW AVG, 0 CONV) ===")
        for p in res["pause_candidates"]:
            print(f"  - [{p['keyword']}] ({p['campaign']}) | QS {p['qs']} | ${p['cost']:,.2f} | {p['clicks']} clicks, 0 conv")


if __name__ == "__main__":
    main()
