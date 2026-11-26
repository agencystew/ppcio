#!/usr/bin/env python3
"""Count ad text characters the way Google Ads does and flag anything too long.

Usage:
  python check_ad_lengths.py ads.csv
  CSV columns: type,text   (type = headline, description, path, long_headline,
  pmax_description, business_name, sitelink_text, sitelink_description,
  callout, snippet_value)

Double-width characters (Chinese, Japanese, Korean) count as 2, per Google.
Limits: RSA help page (answer 7684791), PMax specs (answer 17091269),
Google Ads API asset reference (Sitelink, Callout, StructuredSnippet).
Also flags duplicate lines, which waste RSA slots.
"""
import csv
import sys
import unicodedata

LIMITS = {
    "headline": 30, "description": 90, "path": 15,
    "long_headline": 90, "pmax_description": 90, "business_name": 25,
    "sitelink_text": 25, "sitelink_description": 35,
    "callout": 25, "snippet_value": 25,
}


def g_len(text):
    return sum(2 if unicodedata.east_asian_width(c) in ("W", "F") else 1 for c in text)


def main(path):
    rows = list(csv.DictReader(open(path, encoding="utf-8-sig")))
    bad, seen = 0, {}
    for i, r in enumerate(rows, 2):
        kind = (r.get("type") or "").strip().lower()
        text = (r.get("text") or "").strip()
        if kind not in LIMITS:
            print(f"row {i}: unknown type '{kind}'")
            bad += 1
            continue
        n, lim = g_len(text), LIMITS[kind]
        status = "OK  " if n <= lim else "LONG"
        if n > lim:
            bad += 1
        key = (kind, text.lower())
        dup = " DUPLICATE" if key in seen else ""
        if dup:
            bad += 1
        seen[key] = i
        print(f"{status} {kind:<20} {n:>3}/{lim:<3} {text}{dup}")
    counts = {}
    for r in rows:
        counts[r["type"].strip().lower()] = counts.get(r["type"].strip().lower(), 0) + 1
    if "headline" in counts and not 3 <= counts["headline"] <= 15:
        print(f"RSA needs 3 to 15 headlines, found {counts['headline']}")
        bad += 1
    if "description" in counts and not 2 <= counts["description"] <= 4:
        print(f"RSA needs 2 to 4 descriptions, found {counts['description']}")
        bad += 1
    print(f"\n{bad} problem(s)")
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
