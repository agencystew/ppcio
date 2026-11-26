#!/usr/bin/env python3
r"""Aggregate a Google Ads search terms export into n-grams and flag waste.

Usage:
  python ngrams.py search_terms.csv --target-cpa 80 [--n 1 2 3]
         [--protect protect.txt] [--account-words towns.txt] [--protect-names] [--min-multiple 1.0] [--low-spend 20]
         [--exclude-campaign "\| B \|"] [--out candidates.csv]

Reads the UI export (skips the title and date lines and the Total rows),
or any CSV with columns like: Search term, Cost, Clicks, Impr., Conversions,
Conv. value. Numbers with commas, currency signs or "--" are handled.

An n-gram is flagged when it has zero conversions and its cost is at least
min-multiple x target CPA. Protected words (one per line in protect.txt,
plurals matched too) are never proposed as negatives. --protect-names also
protects every word in campaign and ad group names, so core service words
("plumbing", "boiler") are not proposed. Longer n-grams that add nothing
over a shorter flagged one are hidden. Output is a draft for human review.
"""
import argparse
import csv
import io
import re
from collections import defaultdict

ALIASES = {
    "term": ["search term", "search_term", "query"],
    "cost": ["cost"],
    "clicks": ["clicks"],
    "impr": ["impr.", "impressions", "impr"],
    "conv": ["conversions", "conv."],
    "value": ["conv. value", "conversion value", "conversions value", "conv value"],
    "campaign": ["campaign"],
    "adgroup": ["ad group", "ad_group"],
}

STOPWORDS = {"a", "an", "the", "to", "for", "of", "in", "on", "and", "or",
             "my", "me", "near", "is", "how", "with", "at", "by", "uk"}


def num(x):
    x = (x or "").strip()
    if x in ("", "--", "-"):
        return 0.0
    x = re.sub(r"[^\d.\-]", "", x.replace(",", ""))
    try:
        return float(x)
    except ValueError:
        return 0.0


def load(path):
    raw = open(path, encoding="utf-8-sig").read().splitlines()
    # Header row = first line naming both a search term column and cost.
    # (UI exports start with a title line such as "Search terms report".)
    start = next((i for i, l in enumerate(raw)
                  if re.search(r"search term", l, re.I) and re.search(r"\bcost\b", l, re.I)), None)
    if start is None:
        raise SystemExit("Could not find a header row with 'Search term' and 'Cost'.")
    reader = csv.DictReader(io.StringIO("\n".join(raw[start:])))
    cols = {k.lower().strip(): k for k in reader.fieldnames}
    pick = {}
    for key, names in ALIASES.items():
        for n in names:
            if n in cols:
                pick[key] = cols[n]
                break
    missing = [k for k in ("term", "cost", "conv") if k not in pick]
    if missing:
        raise SystemExit(f"Missing columns: {missing}. Found: {reader.fieldnames}")
    rows = []
    for r in reader:
        term = (r.get(pick["term"]) or "").strip()
        if not term or term.lower().startswith("total"):
            continue
        rows.append({
            "term": term.lower(),
            "cost": num(r.get(pick["cost"])),
            "clicks": num(r.get(pick.get("clicks", ""), "")),
            "impr": num(r.get(pick.get("impr", ""), "")),
            "conv": num(r.get(pick["conv"])),
            "value": num(r.get(pick.get("value", ""), "")),
            "campaign": (r.get(pick.get("campaign", ""), "") or "").strip(),
            "adgroup": (r.get(pick.get("adgroup", ""), "") or "").strip(),
        })
    return rows


def norm(w):
    w = w.lower()
    return w[:-1] if len(w) > 3 and w.endswith("s") else w


def protected_hits(text, protect):
    words = {norm(w) for w in re.findall(r"[\w'&+-]+", text)}
    hits = []
    for p in protect:
        pw = [norm(x) for x in p.split()]
        if all(x in words for x in pw):
            hits.append(p)
    return hits


def grams(words, n):
    return {" ".join(words[i:i + n]) for i in range(len(words) - n + 1)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--target-cpa", type=float, required=True)
    ap.add_argument("--n", type=int, nargs="+", default=[1, 2, 3])
    ap.add_argument("--protect", help="file with protected words, one per line")
    ap.add_argument("--min-multiple", type=float, default=1.0)
    ap.add_argument("--low-spend", type=float, default=0.0,
                    help="flag candidates under this spend as low confidence")
    ap.add_argument("--protect-names", action="store_true",
                    help="protect words found in campaign and ad group names")
    ap.add_argument("--account-words",
                    help="file of words that may appear in queries but never in a negative "
                         "(target towns, services), one per line")
    ap.add_argument("--exclude-campaign", help="regex; matching campaigns are skipped (e.g. brand)")
    ap.add_argument("--show-protected", action="store_true",
                    help="also list protected n-grams (hidden by default)")
    ap.add_argument("--out")
    a = ap.parse_args()

    rows = load(a.csv)
    if a.exclude_campaign:
        before = len(rows)
        rows = [r for r in rows if not re.search(a.exclude_campaign, r["campaign"])]
        print(f"Skipped {before - len(rows)} rows in campaigns matching {a.exclude_campaign!r}")
    protect = set()
    if a.protect:
        protect = {l.strip().lower() for l in open(a.protect) if l.strip()}

    user_protect = set(protect)
    name_words = set()
    if a.protect_names:
        for r in rows:
            for w in re.findall(r"[A-Za-z][A-Za-z'-]+", r["campaign"] + " " + r["adgroup"]):
                if len(w) > 2 and w.lower() not in STOPWORDS and not w.isupper():
                    name_words.add(w.lower())
        print(f"Account words from names: {', '.join(sorted(name_words))}")
    if a.account_words:
        name_words |= {l.strip().lower() for l in open(a.account_words) if l.strip()}
    protect |= name_words

    total_cost = sum(r["cost"] for r in rows)
    total_conv = sum(r["conv"] for r in rows)
    print(f"Rows: {len(rows)}  Cost: {total_cost:,.2f}  Conversions: {total_conv:,.2f}")

    agg = defaultdict(lambda: {"cost": 0.0, "clicks": 0.0, "conv": 0.0, "value": 0.0,
                               "terms": 0, "ids": set()})
    for idx, r in enumerate(rows):
        words = re.findall(r"[\w'&+-]+", r["term"])
        for n in a.n:
            for g in grams(words, n):
                if n == 1 and g in STOPWORDS:
                    continue
                d = agg[(n, g)]
                for k in ("cost", "clicks", "conv", "value"):
                    d[k] += r[k]
                d["terms"] += 1
                d["ids"].add(idx)

    flagged = []
    for (n, g), d in agg.items():
        if d["conv"] > 0 or d["cost"] < a.min_multiple * a.target_cpa:
            continue
        hits = protected_hits(g, protect)
        d.update(n=n, gram=g, multiple=d["cost"] / a.target_cpa,
                 protected=",".join(hits))
        d["low"] = d["cost"] < a.low_spend
        flagged.append(d)
    flagged.sort(key=lambda d: (d["n"], -d["cost"]))
    kept = []
    for d in flagged:
        # Hide a longer n-gram that covers exactly the same queries as a
        # shorter unprotected one already kept: it adds nothing to review.
        redundant = any(k["n"] < d["n"] and not k["protected"] and k["ids"] == d["ids"]
                        for k in kept)
        if not redundant:
            kept.append(d)
    flagged = sorted(kept, key=lambda d: -d["cost"])

    print(f"\nZero-conversion n-grams costing >= {a.min_multiple}x target CPA ({a.target_cpa}):")
    print(f"{'n':<2} {'ngram':<32} {'terms':>5} {'clicks':>7} {'cost':>10} {'xCPA':>5}  note")
    shown = [d for d in flagged if a.show_protected or not d["protected"]]
    hidden = len(flagged) - len(shown)
    for d in shown[:50]:
        note = f"PROTECTED ({d['protected']})" if d["protected"] else ""
        if d.get("low"):
            note += " LOW-CONFIDENCE"
        print(f"{d['n']:<2} {d['gram'][:32]:<32} {d['terms']:>5} {d['clicks']:>7.0f} {d['cost']:>10,.2f} {d['multiple']:>5.1f}  {note}")
    if hidden:
        print(f"({hidden} protected n-grams hidden; use --show-protected to list them)")
    print(f"\nZero-conversion search terms costing >= {a.min_multiple}x target CPA:")
    for r in sorted(rows, key=lambda r: -r["cost"]):
        if r["conv"] == 0 and r["cost"] >= a.min_multiple * a.target_cpa:
            hit = protected_hits(r["term"], protect)
            user_hit = [h for h in hit if h in user_protect]
            if user_hit:
                tag = f"  PROTECTED ({','.join(user_hit)}): ask before any negative"
            elif hit:
                tag = f"  contains account words ({','.join(hit)}): never negate these words on their own"
            else:
                tag = ""
            print(f"   {r['term']:<40} {r['cost']:>9,.2f}  {r['campaign']}{tag}")
    unprotected = sum(d["cost"] for d in flagged if not d["protected"] and d["n"] == 1)
    print(f"\nNote: n-grams overlap, so do not add their costs together across n.")
    print(f"Single-word candidates (unprotected) cost: {unprotected:,.2f} of {total_cost:,.2f}")

    if a.out:
        with open(a.out, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["n", "ngram", "terms", "clicks", "cost", "x_target_cpa", "protected", "low_confidence"])
            for d in flagged:
                w.writerow([d["n"], d["gram"], d["terms"], int(d["clicks"]),
                            round(d["cost"], 2), round(d["multiple"], 2), d["protected"], d.get("low", False)])
        print(f"Wrote {a.out}")


if __name__ == "__main__":
    main()
