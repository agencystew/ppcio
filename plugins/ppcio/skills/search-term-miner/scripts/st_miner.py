#!/usr/bin/env python3
r"""Find wasted spend in a Google Ads search terms report with n-grams judged against YOUR targets.

Usage:
  python st_miner.py search_terms.csv --target-cpa 60 [--campaign-target "Implants=90" ...]
         [--target-roas 4.0] [--protect protect.txt] [--services services.txt]
         [--locations locations.txt] [--exclude-campaign "Brand"] [--min-multiple 1.0]
         [--low-spend 30] [--out candidates.csv]

Reads messy UI downloads (title lines, Total rows, currency signs, UTF-16
or tab-separated files) or MCP rows (search_term_view.search_term,
metrics.cost_micros ...).

Flags an n-gram when it has zero conversions and cost of at least
min-multiple x the spend-weighted target CPA of the queries it appears in
(so a £90 Implants target and a £60 account target are both respected).
With --target-roas, the target CPA is implied: average conversion value /
target ROAS; n-grams that convert but at under half the target ROAS are
listed separately for review.

Protection:
  protect.txt   brand terms, competitor names you bid on, never-negate words.
                An n-gram containing one is never proposed.
  services.txt  what you sell. Never proposed on its own (negate the modifier).
  locations.txt "campaign text: town, town" per line. A query in campaign A
                naming a town only another campaign targets is flagged as a
                campaign-level location negative, never a shared-list one.

An n-gram whose queries are all covered by a bigger candidate already listed
is hidden ("covered by"), so the list shows themes, not fragments.
"""
import argparse
import collections
import csv
import re
import sys

from gads_io import load_table, num, check_totals, currency_of

ALIASES = {
    "term": ["Search term", "search_term_view.search_term", "Query"],
    "match": ["Match type", "Search terms match type", "segments.search_term_match_type"],
    "campaign": ["Campaign", "campaign.name"],
    "adgroup": ["Ad group", "ad_group.name"],
    "impr": ["Impr.", "Impressions", "metrics.impressions"],
    "clicks": ["Clicks", "metrics.clicks"],
    "cost": ["Cost", "metrics.cost"],
    "cost_micros": ["metrics.cost_micros"],
    "conv": ["Conversions", "Conv.", "metrics.conversions"],
    "value": ["Conv. value", "Conversion value", "metrics.conversions_value"],
    "added": ["Added/Excluded", "search_term_view.status"],
}
STOPWORDS = {"a", "an", "the", "to", "for", "of", "in", "on", "and", "or", "my", "me", "near", "is",
             "how", "with", "at", "by", "uk", "all", "are", "much", "what", "best", "do", "does", "can", "i"}


def words_of(text):
    return re.findall(r"[\w'&+-]+", text.lower())


def stem(w):
    """Crude singular form used only for comparisons (see same_word)."""
    if len(w) > 4 and w.endswith("ies"):
        return w[:-3] + "y"
    if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
        return w[:-1]
    return w


def same_word(a, b):
    """True for the same word or a simple plural/singular pair:
    course/courses, denture/dentures, box/boxes, clinic/clinics, city/cities."""
    if a == b:
        return True
    for x, y in ((a, b), (b, a)):
        if y == x + "s" or y == x + "es" or (x.endswith("y") and y == x[:-1] + "ies"):
            return True
    return False


def contains_phrase(text_words, phrase):
    pw = phrase.split()
    n = len(pw)
    return any(all(same_word(t, p) for t, p in zip(text_words[i:i + n], pw))
               for i in range(len(text_words) - n + 1))


def load(path):
    meta, cm, rows, totals = load_table(path, ["term", "conv"], ALIASES)
    if not cm["cost"] and not cm["cost_micros"]:
        sys.exit("No Cost column.")
    out = []
    for r in rows:
        term = r.get(cm["term"], "").strip()
        if not term:
            continue
        cost = num(r[cm["cost"]]) if cm["cost"] else num(r[cm["cost_micros"]]) / 1e6
        out.append(dict(term=term.lower(), cost=cost,
                        clicks=num(r.get(cm["clicks"])) if cm["clicks"] else 0,
                        conv=num(r[cm["conv"]]),
                        value=num(r.get(cm["value"])) if cm["value"] else 0,
                        campaign=(r.get(cm["campaign"]) or "").strip() if cm["campaign"] else "",
                        adgroup=(r.get(cm["adgroup"]) or "").strip() if cm["adgroup"] else "",
                        added=(r.get(cm["added"]) or "").strip() if cm["added"] else ""))
    return meta, cm, rows, totals, out


def read_list(path):
    if not path:
        return []
    return [l.strip().lower() for l in open(path, encoding="utf-8") if l.strip() and not l.startswith("#")]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--target-cpa", type=float)
    ap.add_argument("--campaign-target", action="append", default=[])
    ap.add_argument("--target-roas", type=float, help="e.g. 4.0 for 400%%")
    ap.add_argument("--protect")
    ap.add_argument("--services")
    ap.add_argument("--locations")
    ap.add_argument("--exclude-campaign", help="regex, e.g. brand campaigns")
    ap.add_argument("--min-multiple", type=float, default=1.0)
    ap.add_argument("--low-spend", type=float, default=0.0)
    ap.add_argument("--n", type=int, nargs="+", default=[1, 2, 3])
    ap.add_argument("--out")
    a = ap.parse_args()
    if not a.target_cpa and not a.target_roas:
        sys.exit("Give --target-cpa or --target-roas. Waste is only waste against a target.")

    meta, cm, raw_rows, totals, rows = load(a.csv)
    cur = currency_of(raw_rows, [cm["cost"]])
    for m in meta:
        print(f"File header: {m}")
    for t in totals:
        label = list(t.values())[0]
        c = num(t.get(cm["cost"])) if cm["cost"] else 0
        print(f"Export total row '{label}': cost {cur}{c:,.2f}")
    allcost = sum(r["cost"] for r in rows)
    print(f"Sum of listed search terms: {cur}{allcost:,.2f} ({len(rows)} rows). If an account total is higher, "
          "the gap is spend on terms Google does not list; it cannot be mined.")
    if a.exclude_campaign:
        before = len(rows)
        rows = [r for r in rows if not re.search(a.exclude_campaign, r["campaign"], re.I)]
        print(f"Excluded {before - len(rows)} rows in campaigns matching {a.exclude_campaign!r}")
    if not rows:
        sys.exit("No rows left to analyse.")

    def target_for(r):
        for t in a.campaign_target:
            k, _, v = t.rpartition("=")
            if k and k.lower() in r["campaign"].lower():
                return float(v)
        if a.target_cpa:
            return a.target_cpa
        conv = sum(x["conv"] for x in rows)
        aov = sum(x["value"] for x in rows) / conv if conv else 0
        return aov / a.target_roas if a.target_roas and aov else None

    if a.target_roas and not a.target_cpa:
        t0 = target_for({"campaign": ""})
        print(f"Implied target CPA from target ROAS {a.target_roas:g}: {cur}{t0:,.2f} (average conversion value / ROAS)")

    protect = read_list(a.protect)
    services = read_list(a.services)
    locs = {}
    for line in read_list(a.locations):
        if ":" in line:
            k, v = line.split(":", 1)
            locs[k.strip()] = [x.strip() for x in v.split(",") if x.strip()]
    all_towns = sorted({t for v in locs.values() for t in v})

    tot_cost = sum(r["cost"] for r in rows)
    tot_conv = sum(r["conv"] for r in rows)
    tot_clicks = sum(r["clicks"] for r in rows)
    print(f"Analysed: {cur}{tot_cost:,.2f}, {tot_clicks:,.0f} clicks, {tot_conv:,.2f} conversions, {len(rows)} search terms")

    # Location check per campaign.
    loc_flags = []
    for i, r in enumerate(rows):
        mine = next((v for k, v in locs.items() if k in r["campaign"].lower()), None)
        if mine is None:
            continue
        w = words_of(r["term"])
        for town in all_towns:
            if town not in mine and contains_phrase(w, town):
                loc_flags.append((i, town))

    agg = collections.defaultdict(lambda: dict(cost=0.0, clicks=0.0, conv=0.0, value=0.0, ids=set(), tcost=0.0))
    for i, r in enumerate(rows):
        w = words_of(r["term"])
        seen = set()
        for n in a.n:
            for j in range(len(w) - n + 1):
                g = " ".join(w[j:j + n])
                if g in seen or (n == 1 and g in STOPWORDS) or all(x in STOPWORDS for x in g.split()):
                    continue
                seen.add(g)
                d = agg[g]
                for k in ("cost", "clicks", "conv", "value"):
                    d[k] += r[k]
                d["ids"].add(i)
                t = target_for(r) or 0
                d["tcost"] += r["cost"] / t if t else 0     # cost / target = target-CPA units

    def protected_reason(g):
        gw = g.split()
        for p in protect:
            if contains_phrase(gw, p) or contains_phrase(p.split(), g):
                return f"protected ({p})"
        if all(any(contains_phrase([x], s) or contains_phrase(s.split(), x) for s in services) or x in STOPWORDS for x in gw):
            return "service word on its own"
        if any(contains_phrase(gw, t) for t in all_towns):
            return "contains a target town"
        return ""

    cands = []
    for g, d in agg.items():
        if d["conv"] > 0:
            continue
        # spend-weighted target for this n-gram's queries
        tgt = d["cost"] / d["tcost"] if d["tcost"] else None
        if not tgt or d["cost"] < a.min_multiple * tgt:
            continue
        reason = protected_reason(g)
        cands.append(dict(gram=g, n=len(g.split()), tgt=tgt, x=d["cost"] / tgt, reason=reason, **d))
    cands.sort(key=lambda c: (-c["cost"], c["n"]))
    shown, covered = [], {}
    for c in cands:
        if c["reason"]:
            continue
        cover = next((s for s in shown if c["ids"] <= s["ids"]), None)
        if cover:
            covered[c["gram"]] = cover["gram"]
            continue
        shown.append(c)

    print(f"\n== Candidate negative themes (0 conversions, cost >= {a.min_multiple:g}x the target CPA of their queries)")
    print(f"{'n-gram':<28} {'queries':>7} {'clicks':>7} {'cost':>10} {'xTarget':>8}  campaigns  note")
    for c in shown:
        camps = sorted({short(rows[i]["campaign"]) for i in c["ids"]})
        note = "LOW SPEND, low confidence" if c["cost"] < a.low_spend else ""
        print(f"{c['gram']:<28} {len(c['ids']):>7} {c['clicks']:>7,.0f} {c['cost']:>10,.2f} {c['x']:>8.1f}  "
              f"{', '.join(camps)}  {note}")
        for i in sorted(c["ids"], key=lambda i: -rows[i]["cost"])[:4]:
            print(f"      - {rows[i]['term']}  ({cur}{rows[i]['cost']:,.2f}, {short(rows[i]['campaign'])})")
    hidden = [c for c in cands if c["reason"]]
    if hidden:
        print("\nNot proposed (protected): " + "; ".join(f"{c['gram']} [{c['reason']}]" for c in hidden[:15])
              + (" ..." if len(hidden) > 15 else ""))
    if covered:
        print("Covered by a bigger theme above: " + "; ".join(f"{k} -> {v}" for k, v in list(covered.items())[:15]))

    watch = []
    for i, r in enumerate(rows):
        t = target_for(r)
        if r["conv"] == 0 and t and 0.5 * t <= r["cost"] < a.min_multiple * t and \
                not any(i in c["ids"] for c in shown):
            watch.append(r)
    if watch:
        print(f"\n== Watch list: zero-conversion searches at 0.5x to {a.min_multiple:g}x target (not enough spend to judge yet)")
        for r in sorted(watch, key=lambda r: -r["cost"]):
            print(f"   {r['term']:<40} {cur}{r['cost']:>8,.2f}  {short(r['campaign'])}")

    if loc_flags:
        print("\n== Wrong location for the campaign (town targeted by another campaign): campaign-level negatives only")
        for i, town in loc_flags:
            r = rows[i]
            print(f"   {r['term']:<40} {cur}{r['cost']:>8,.2f}  {r['conv']:.0f} conv  in {short(r['campaign'])} -> "
                  f"'{town}' is not this campaign's area")

    print("\n== Converting words that look like waste (do NOT negate; listed so nobody does)")
    for w in ("free", "cheap", "cost", "price", "how much", "near me", "nhs", "jobs", "diy"):
        d = agg.get(w)
        if d and d["conv"] > 0:
            print(f"   '{w}': {d['conv']:.0f} conversions from {len(d['ids'])} queries ({cur}{d['cost']:,.2f})")

    if a.target_roas:
        print("\n== Converting n-grams under half the target ROAS (review, not automatic negatives)")
        for g, d in sorted(agg.items(), key=lambda kv: -kv[1]["cost"]):
            if d["conv"] > 0 and d["cost"] and d["value"] / d["cost"] < a.target_roas / 2 and d["cost"] >= 2 * (target_for(rows[next(iter(d['ids']))]) or 0):
                print(f"   {g:<28} ROAS {d['value'] / d['cost']:.2f} on {cur}{d['cost']:,.2f}")

    if a.out:
        with open(a.out, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["ngram", "queries", "clicks", "cost", "x_target", "campaigns"])
            for c in shown:
                w.writerow([c["gram"], len(c["ids"]), int(c["clicks"]), round(c["cost"], 2), round(c["x"], 2),
                            "; ".join(sorted({rows[i]["campaign"] for i in c["ids"]}))])
        print(f"\nWrote {a.out}")
    print("\nNext: write the negatives you want into negatives.txt and run simulate_negatives.py to see exactly "
          "what they block (Google negatives do not match plurals or close variants).")


def short(c):
    parts = [p.strip() for p in c.split("|")]
    return " | ".join(parts[-2:]) if len(parts) > 2 else c


if __name__ == "__main__":
    main()
