#!/usr/bin/env python3
"""Show exactly which search terms a list of negative keywords would block, using Google's rules.

Usage:
  python simulate_negatives.py search_terms.csv negatives.txt [--protect protect.txt]
         [--exclude-campaign "Brand"] [--keywords keywords.csv]

keywords.csv (optional, Keywords > Search keywords > download): Keyword, Match type,
Campaign and Status. With it, any negative that blocks one of your own enabled
keywords is a STOP. Google keeps showing that keyword as "Active" while it
gets no impressions, so nobody notices.

negatives.txt, one per line, typed the way you would enter them:
  turkey                      broad   (all words, any order)
  "at home"                   phrase  (same words, same order, extra words allowed)
  [smile direct club]         exact   (the whole search, nothing extra)
  campaign=Emergency | leeds  limit a negative to campaigns whose name contains "Emergency"
  list=NEG - Universal | jobs  name the shared list (shown in the paste-ready output)

Google rules applied (support.google.com/google-ads/answer/2453972):
- "Negative keywords won't match to close variants or other expansions":
  "flowers" blocks "red flowers" but not "red flower". So plurals, singulars
  and misspellings are NOT blocked here either, and each miss is reported.
- Invalid symbols cause an error: , ! @ % ^ ( ) = { } ; ~ ` < > ? \\ |
- Searches longer than 16 words can still show if the negative comes after
  the 16th word (reported as a note).
Output: per negative, what it blocks, cost and conversions blocked; any
converting or protected search it would block (STOP); near misses; the
total waste blocked counted once; and paste-ready lists.
"""
import argparse
import collections
import re
import sys

from st_miner import load, words_of, same_word, read_list, short
from gads_io import currency_of, load_table

INVALID = set(",!@%^()={};~`<>?\\|")


def parse_neg(line):
    scope, lst = None, None
    while "|" in line and re.match(r"^\s*(campaign|list)=", line):
        head, line = line.split("|", 1)
        k, v = head.strip().split("=", 1)
        if k == "campaign":
            scope = v.strip().lower()
        else:
            lst = v.strip()
    s = line.strip()
    if s.startswith("[") and s.endswith("]"):
        mt, kw = "exact", s[1:-1]
    elif s.startswith('"') and s.endswith('"'):
        mt, kw = "phrase", s[1:-1]
    else:
        mt, kw = "broad", s
    return dict(raw=s, kw=kw.strip().lower(), mt=mt, scope=scope, list=lst)


def blocks(neg, qwords):
    nw = words_of(neg["kw"])
    if neg["mt"] == "exact":
        return qwords == nw
    if neg["mt"] == "phrase":
        n = len(nw)
        return any(qwords[i:i + n] == nw for i in range(len(qwords) - n + 1))
    return all(w in qwords for w in nw)


def near_miss(neg, qwords):
    """Would block if plurals/singulars matched (Google does not do this for negatives)."""
    if blocks(neg, qwords):
        return False
    nw = words_of(neg["kw"])
    if neg["mt"] == "exact":
        return len(nw) == len(qwords) and all(same_word(a, b) for a, b in zip(nw, qwords))
    if neg["mt"] == "phrase":
        n = len(nw)
        return any(all(same_word(a, b) for a, b in zip(qwords[i:i + n], nw)) for i in range(len(qwords) - n + 1))
    return all(any(same_word(w, q) for q in qwords) for w in nw)


KW_ALIASES = {
    "kw": ["Keyword", "Search keyword", "Keyword text"],
    "campaign": ["Campaign"],
    "status": ["Keyword status", "Status", "Keyword state"],
    "mt": ["Match type", "Keyword match type"],
}


def load_keywords(path):
    """Enabled keywords as (text, campaign). Paused and removed ones cannot conflict today."""
    _meta, cm, rows, _totals = load_table(path, ["kw"], KW_ALIASES)
    out = []
    for r in rows:
        status = (r.get(cm["status"]) or "enabled").lower() if cm["status"] else "enabled"
        if status not in ("enabled", "eligible", "active", ""):
            continue
        text = r[cm["kw"]].strip().strip('[]"').lstrip("+").lower()
        if text and not text.startswith("--"):
            out.append((text, r.get(cm["campaign"], "") if cm["campaign"] else ""))
    return out


def conflicts(neg, keywords):
    """Own keywords this negative would block, inside its campaign scope."""
    return [(k, c) for k, c in keywords
            if (not neg["scope"] or neg["scope"] in c.lower()) and blocks(neg, words_of(k))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("negatives")
    ap.add_argument("--protect")
    ap.add_argument("--exclude-campaign")
    ap.add_argument("--keywords", help="Search keywords export, to catch negatives that block your own keywords")
    a = ap.parse_args()
    keywords = load_keywords(a.keywords) if a.keywords else []
    meta, cm, raw, totals, rows = load(a.csv)
    cur = currency_of(raw, [cm["cost"]])
    if a.exclude_campaign:
        rows = [r for r in rows if not re.search(a.exclude_campaign, r["campaign"], re.I)]
    protect = read_list(a.protect)
    negs = [parse_neg(l.rstrip("\n")) for l in open(a.negatives, encoding="utf-8") if l.strip() and not l.startswith("#")]
    total_cost = sum(r["cost"] for r in rows)

    def hits_of(n):
        return [i for i, r in enumerate(rows)
                if (not n["scope"] or n["scope"] in r["campaign"].lower()) and blocks(n, words_of(r["term"]))]
    blocked_by_list = set()
    for n in negs:
        blocked_by_list |= set(hits_of(n))
    blocked_any = set()
    stop = 0
    print(f"Search terms checked: {len(rows)} ({cur}{total_cost:,.2f})\n")
    for n in negs:
        bad = sorted(INVALID & set(n["kw"]))
        hits, misses = [], []
        for i, r in enumerate(rows):
            if n["scope"] and n["scope"] not in r["campaign"].lower():
                continue
            qw = words_of(r["term"])
            if blocks(n, qw):
                hits.append(i)
            elif near_miss(n, qw) and i not in blocked_by_list:
                misses.append(i)
        cost = sum(rows[i]["cost"] for i in hits)
        conv = sum(rows[i]["conv"] for i in hits)
        where = f"campaign contains '{n['scope']}'" if n["scope"] else (n["list"] or "all analysed campaigns")
        print(f"{n['raw']}  [{n['mt']}]  scope: {where}")
        if bad:
            print(f"   INVALID: contains {' '.join(bad)}; Google rejects these symbols in negatives")
            stop += 1
        print(f"   blocks {len(hits)} search terms, {cur}{cost:,.2f}, {conv:.0f} conversions")
        for i in hits[:6]:
            r = rows[i]
            flag = ""
            if r["conv"] > 0:
                flag = f"  STOP: {r['conv']:.0f} conversions"
            hitp = [p for p in protect if re.search(rf"\b{re.escape(p)}\b", r["term"]) and p in n["kw"]]
            if hitp:
                flag += f"  STOP: negative contains protected '{hitp[0]}'"
            print(f"     - {r['term']}  {cur}{r['cost']:,.2f}  {short(r['campaign'])}{flag}")
        if len(hits) > 6:
            print(f"     ... and {len(hits) - 6} more")
        if conv > 0:
            stop += 1
        if any(p in n["kw"].split() or p == n["kw"] for p in protect):
            print(f"   STOP: the negative itself contains a protected term")
            stop += 1
        own = conflicts(n, keywords)
        for k, c in own[:4]:
            print(f"   STOP: blocks your own keyword '{k}' in {short(c) if c else 'the account'}")
        if len(own) > 4:
            print(f"   STOP: ... and {len(own) - 4} more of your own keywords")
        if own:
            stop += 1
        for i in misses:
            r = rows[i]
            print(f"   NOT BLOCKED (plural/variant): {r['term']}  {cur}{r['cost']:,.2f}, {r['conv']:.0f} conv "
                  f"-> add the variant as its own negative if it is waste")
        if any(len(words_of(rows[i]["term"])) > 16 for i in hits):
            print("   Note: some searches are over 16 words; Google may still show ads if the negative follows word 16.")
        blocked_any |= set(hits)
        print()
    wc = sum(rows[i]["cost"] for i in blocked_any)
    wconv = sum(rows[i]["conv"] for i in blocked_any)
    print(f"TOTAL blocked (each search term counted once): {len(blocked_any)} terms, {cur}{wc:,.2f} "
          f"({wc / total_cost:.1%} of analysed spend), {wconv:.0f} conversions")
    if not a.keywords:
        print("Not checked: your own keywords. Pass --keywords keywords.csv to catch a negative that blocks one.")
    print(f"Checks: {'PASS' if stop == 0 else f'{stop} STOP issue(s): fix before anyone adds these'}")

    print("\n== Paste-ready (one per line, into the negative keywords box for that campaign or shared list)")
    groups = collections.defaultdict(list)
    for n in negs:
        if n["scope"]:
            names = sorted({r["campaign"] for r in rows if n["scope"] in r["campaign"].lower()})
            key = "Campaign: " + (", ".join(names) if names else f"(no campaign matches '{n['scope']}')")
        else:
            key = f"Shared list: {n['list'] or 'choose a list'}"
        groups[key].append(n["raw"])
    for k, v in groups.items():
        print(f"{k}")
        for x in v:
            print(f"  {x}")
    sys.exit(1 if stop else 0)


if __name__ == "__main__":
    main()
