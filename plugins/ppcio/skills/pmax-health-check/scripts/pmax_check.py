#!/usr/bin/env python3
"""Deterministic Performance Max Incremental Non-Brand ROAS, P&L & Brand-Cannibalization Engine."""
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
        if ("campaign" in low or "search term" in low or "category" in low) and ("cost" in low or "conv" in low or "impr" in low):
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


def evaluate_pmax(
    pmax_cost, pmax_conv, pmax_val,
    brand_cost, brand_conv, brand_val,
    break_even_roas=None, target_cpa=None, brand_search_paused=False,
    gross_margin=None, total_account_cost=0.0, uncapped_bidding=False,
    missing_st_cost=False, brand_terms_matched=None, non_brand_terms_matched=None,
):
    nb_cost = max(0.0, pmax_cost - brand_cost)
    nb_conv = max(0.0, pmax_conv - brand_conv)
    nb_val = max(0.0, pmax_val - brand_val)

    rep_roas = (pmax_val / pmax_cost) if (pmax_cost > 0 and pmax_val > 0) else None
    inc_roas = (nb_val / nb_cost) if (nb_cost > 0 and nb_val > 0) else (0.0 if pmax_val > 0 else None)
    rep_cpa = (pmax_cost / pmax_conv) if pmax_conv > 0 else None
    inc_cpa = (nb_cost / nb_conv) if nb_conv > 0 else None

    brand_conv_share = (brand_conv / pmax_conv * 100) if pmax_conv > 0 else 0.0
    brand_val_share = (brand_val / pmax_val * 100) if pmax_val > 0 else 0.0
    brand_cost_share = (brand_cost / pmax_cost * 100) if pmax_cost > 0 else 0.0

    # Infer gross margin from break_even_roas if not provided directly
    gm = gross_margin
    if gm is None and break_even_roas and break_even_roas > 0:
        gm = 1.0 / break_even_roas
    if gm is not None and gm > 1.0:
        gm = gm / 100.0

    pnl = None
    if gm is not None and pmax_val > 0:
        rep_gp = pmax_val * gm
        nb_gp = nb_val * gm
        pnl = {
            "gross_margin_pct": round(gm * 100, 1),
            "reported_gross_profit": round(rep_gp, 2),
            "reported_net_contribution": round(rep_gp - pmax_cost, 2),
            "non_brand_gross_profit": round(nb_gp, 2),
            "non_brand_net_contribution": round(nb_gp - nb_cost, 2),
            "non_brand_poas": round(nb_gp / nb_cost, 2) if nb_cost > 0 else 0.0,
        }

    pmax_spend_share = round((pmax_cost / total_account_cost) * 100, 1) if total_account_cost > 0 else None

    flags = []
    if missing_st_cost:
        flags.append(
            "MISSING_SEARCH_TERM_COST: Search terms CSV lacks a Cost column; Brand cost defaulted to $0, "
            "which slightly understates Non-Brand ROAS. Export PMax Search Terms with Cost for exact subtraction."
        )
    if brand_search_paused:
        flags.append(
            "PAUSED_BRAND_ILLUSION: Dedicated Brand Search is paused, so PMax automatically absorbed branded demand. "
            "Do NOT trust reported PMax ROAS/CPA until Brand Search is restored and PMax Brand Exclusions are active."
        )
    if uncapped_bidding:
        flags.append(
            "UNCAPPED_PMAX_BIDDING: PMax is running uncapped Maximize Conversions / Maximize Conversion Value without a Target CPA/ROAS ceiling."
        )
    if pmax_spend_share is not None and pmax_spend_share > 40.0:
        flags.append(
            f"PMAX_OVER_CONCENTRATION: PMax absorbs {pmax_spend_share}% of total account spend (recommended cap <= 20-40% until incrementality is proven)."
        )
    if brand_conv_share >= 40.0 or brand_val_share >= 40.0:
        flags.append(
            f"SEVERE_BRAND_CANNIBALIZATION: Brand accounts for {brand_conv_share:.1f}% of PMax conversions "
            f"({brand_val_share:.1f}% of value). Reported numbers are heavily padded."
        )
    elif brand_conv_share >= 20.0:
        flags.append(f"MODERATE_BRAND_BLEED: Brand accounts for {brand_conv_share:.1f}% of PMax conversions. Add Brand Exclusions.")
    if nb_conv < 30:
        flags.append(f"FEW_DATA: Only {nb_conv:.1f} non-brand conversions (<30 volume floor); treat non-brand projections cautiously.")

    verdict = "KEEP"
    if brand_search_paused or brand_conv_share >= 40.0:
        verdict = "FIX_BRAND_EXCLUSIONS_FIRST"
    if break_even_roas is not None and inc_roas is not None:
        if inc_roas < break_even_roas:
            verdict = "KILL_OR_MIGRATE_TO_STANDARD_SHOPPING"
            net_note = f" (net contribution ${pnl['non_brand_net_contribution']:+,.2f})" if pnl else ""
            flags.append(
                f"INCREMENTAL_ROAS_UNPROFITABLE: True Non-Brand PMax ROAS is {inc_roas:.2f}x vs. {break_even_roas:.2f}x break-even{net_note} "
                f"(reported {rep_roas:.2f}x masked a losing acquisition campaign on ${nb_cost:,.2f} non-brand spend)."
            )
    elif target_cpa is not None and inc_cpa is not None:
        if inc_cpa > target_cpa * 1.4:
            verdict = "FIX_OR_PAUSE"
            flags.append(
                f"INCREMENTAL_CPA_OVER_TARGET: True Non-Brand PMax CPA is ${inc_cpa:.2f} vs. ${target_cpa:.2f} target "
                f"(reported ${rep_cpa:.2f} hid the gap)."
            )
    elif target_cpa is not None and nb_conv == 0 and nb_cost >= target_cpa:
        verdict = "KILL_OR_REBUILD"
        flags.append(f"ZERO_NONBRAND_CONVERSIONS: PMax spent ${nb_cost:,.2f} outside Brand with 0 conversions.")

    return {
        "reported": {
            "cost": round(pmax_cost, 2),
            "conversions": round(pmax_conv, 2),
            "conv_value": round(pmax_val, 2),
            "roas": round(rep_roas, 2) if rep_roas is not None else None,
            "cpa": round(rep_cpa, 2) if rep_cpa is not None else None,
        },
        "brand_portion": {
            "cost": round(brand_cost, 2),
            "conversions": round(brand_conv, 2),
            "conv_value": round(brand_val, 2),
            "cost_share_pct": round(brand_cost_share, 1),
            "conv_share_pct": round(brand_conv_share, 1),
            "value_share_pct": round(brand_val_share, 1),
            "terms_matched": brand_terms_matched or [],
        },
        "incremental_non_brand": {
            "cost": round(nb_cost, 2),
            "conversions": round(nb_conv, 2),
            "conv_value": round(nb_val, 2),
            "roas": round(inc_roas, 2) if inc_roas is not None else None,
            "cpa": round(inc_cpa, 2) if inc_cpa is not None else None,
            "terms_matched": non_brand_terms_matched or [],
        },
        "pmax_spend_share_pct": pmax_spend_share,
        "pnl": pnl,
        "verdict": verdict,
        "flags": flags,
    }


def main():
    ap = argparse.ArgumentParser(description="Performance Max Incremental ROAS, P&L & Brand-Cannibalization Calculator")
    ap.add_argument("--campaigns", help="Campaigns CSV containing PMax row(s)")
    ap.add_argument("--search-terms", help="PMax Search Terms CSV (with Cost, Conversions, Conv. value)")
    ap.add_argument("--brand-pattern", required=True, help="Regex for brand terms (e.g. 'acme|acme plumbing')")
    ap.add_argument("--break-even-roas", type=float, default=None)
    ap.add_argument("--gross-margin", type=float, default=None, help="Gross margin as decimal (0.40) or percent (40)")
    ap.add_argument("--target-cpa", type=float, default=None)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    pmax_cost = pmax_conv = pmax_val = total_account_cost = 0.0
    brand_search_paused = False
    uncapped_bidding = False
    if args.campaigns:
        for r in load_csv(args.campaigns):
            name = col(r, ["Campaign", "Campaign name"])
            ctype = col(r, ["Campaign type", "Channel type"])
            status = col(r, ["Campaign state", "Status"])
            bid = col(r, ["Bid strategy type", "Bid strategy"]).lower()
            c_cost = parse_num(col(r, ["Cost", "Spend"]))
            total_account_cost += c_cost
            if re.search(r"pmax|performance\s*max", f"{name} {ctype}", re.I):
                pmax_cost += c_cost
                pmax_conv += parse_num(col(r, ["Conversions", "Conv."]))
                pmax_val += parse_num(col(r, ["Conv. value", "Conversion value", "Revenue"]))
                if "maximize" in bid and "target" not in bid:
                    uncapped_bidding = True
            elif (re.search(args.brand_pattern, name, re.I) or re.search(r"\bbrand(ed)?\b", name, re.I)) and "paused" in status.lower():
                brand_search_paused = True

    brand_cost = brand_conv = brand_val = 0.0
    missing_st_cost = False
    brand_terms_matched, nb_terms_matched = [], []
    if args.search_terms:
        st_rows = load_csv(args.search_terms)
        if st_rows and not any("cost" in k.lower() or "spend" in k.lower() for k in st_rows[0].keys()):
            missing_st_cost = True
        st_total_cost = st_total_conv = st_total_val = 0.0
        for r in st_rows:
            term = col(r, ["Search term", "Search category", "Query"])
            c = parse_num(col(r, ["Cost", "Spend"]))
            cv = parse_num(col(r, ["Conversions", "Conv."]))
            vl = parse_num(col(r, ["Conv. value", "Conversion value", "Revenue"]))
            st_total_cost += c
            st_total_conv += cv
            st_total_val += vl
            if re.search(args.brand_pattern, term, re.I):
                brand_cost += c
                brand_conv += cv
                brand_val += vl
                brand_terms_matched.append(term)
            elif term:
                nb_terms_matched.append(term)
        if pmax_cost == 0:
            pmax_cost, pmax_conv, pmax_val = st_total_cost, st_total_conv, st_total_val

    if pmax_cost == 0:
        print("ERROR: No PMax spend found in provided CSV(s).", file=sys.stderr)
        sys.exit(1)

    res = evaluate_pmax(
        pmax_cost, pmax_conv, pmax_val,
        brand_cost, brand_conv, brand_val,
        args.break_even_roas, args.target_cpa, brand_search_paused,
        args.gross_margin, total_account_cost, uncapped_bidding,
        missing_st_cost, brand_terms_matched, nb_terms_matched,
    )
    if args.json:
        print(json.dumps(res, indent=2))
        return

    rep, br, inc = res["reported"], res["brand_portion"], res["incremental_non_brand"]
    fmt_r = lambda v: f"{v:.2f}x" if v is not None else "N/A"
    fmt_c = lambda v: f"${v:,.2f}" if v is not None else "N/A"
    print(f"=== PMAX INCREMENTAL HEALTH VERDICT: {res['verdict']} ===")
    print(f"Reported PMax        : Cost ${rep['cost']:,.2f} | Conv {rep['conversions']} | Val ${rep['conv_value']:,.2f} | ROAS {fmt_r(rep['roas'])} | CPA {fmt_c(rep['cpa'])}")
    print(f"Stripped Brand Share : Cost ${br['cost']:,.2f} ({br['cost_share_pct']}%) | Conv {br['conversions']} ({br['conv_share_pct']}%) | Val ${br['conv_value']:,.2f} ({br['value_share_pct']}%)")
    print(f"True Non-Brand PMax  : Cost ${inc['cost']:,.2f} | Conv {inc['conversions']} | Val ${inc['conv_value']:,.2f} | ROAS {fmt_r(inc['roas'])} | CPA {fmt_c(inc['cpa'])}")
    if res["pmax_spend_share_pct"] is not None:
        print(f"PMax Account Share   : {res['pmax_spend_share_pct']}% of total spend")
    if res["pnl"]:
        p = res["pnl"]
        print(f"CFO P&L ({p['gross_margin_pct']}% GM)   : Reported Net ${p['reported_net_contribution']:+,.2f} | True Non-Brand Net ${p['non_brand_net_contribution']:+,.2f} (POAS {p['non_brand_poas']:.2f}x)")
    if res["flags"]:
        print("\nFlags:")
        for f in res["flags"]:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
