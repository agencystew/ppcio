#!/usr/bin/env python3
"""Check a responsive search ad (and assets) the way a strict reviewer would, before anyone uploads it.

Usage:
  python rsa_lint.py ad.csv --facts facts.md [--keyword "invisalign leeds" ...]
         [--banned banned.txt] [--acronyms "NHS,GDC,LS1,3D"]

ad.csv, either format:
  long:  type,text,pin        type = headline | description | path | sitelink_text |
                              sitelink_description | callout | snippet_value
                              pin  = H1 | H2 | H3 | D1 | D2 (blank = not pinned)
  wide:  Headline 1..15, Headline 1 position.., Description 1..4,
         Description 1 position.., Path 1, Path 2   (Editor-style export)

Checks (Google rules marked G, PPC.io rules marked P):
  G  length: headline 30, description 90, path 15, sitelink text 25,
     sitelink description 35, callout 25, snippet value 25; double-width
     characters count 2 (RSA help, answer 7684791; API asset reference)
  G  counts: 3-15 headlines, 2-4 descriptions
  G  pins: pinned text only shows in its position; Google suggests pinning
     "two or three unique headlines or descriptions to each position" and
     warns against pinning "identical or very similar text to the same slot"
  G  punctuation and symbols policy: repeated marks like "!!", emoji, words
     in capitals used for emphasis (answer 14847994 and the editorial policy)
  P  every number, price, rating, year and percentage must appear in the
     facts file; claim words (best, leading, award, guaranteed, #1 ...) need
     a matching fact
  P  qualifier rules from the facts file, e.g.  Rule: "finance" needs "subject to status"
  P  near-duplicates (same idea twice wastes a slot), banned words, generic
     AI copy tells, keyword coverage, headlines that cannot stand alone
Also prints how many 3-headline arrangements the pins allow, before vs after.
Exit code 1 when any FAIL is found.
"""
import argparse
import csv
import io
import itertools
import re
import sys
import unicodedata

from gads_io import read_text

LIMITS = {"headline": 30, "description": 90, "path": 15, "sitelink_text": 25,
          "sitelink_description": 35, "callout": 25, "snippet_value": 25}
CLAIM_WORDS = ["best", "leading", "award", "award-winning", "guarantee", "guaranteed", "#1", "number one",
               "no.1", "top-rated", "top rated", "cheapest", "lowest price", "pain-free", "painless",
               "world-class", "unbeatable", "free"]
GENERIC = ["unlock", "elevate", "discover the power", "your trusted partner", "solutions for all",
           "best-in-class", "look no further", "transform your", "take it to the next level",
           "in today's world", "seamless", "cutting-edge", "game-changer", "revolutionary"]
STOP = {"a", "an", "the", "to", "for", "of", "in", "on", "and", "or", "your", "you", "with", "at", "by",
        "our", "we", "is", "are", "from", "&", "-", "today", "now"}
EMOJI = re.compile("[\U0001F300-\U0001FAFF\U00002700-\U000027BF\U0001F000-\U0001F2FF\u2600-\u26FF]")


def g_len(text):
    return sum(2 if unicodedata.east_asian_width(c) in ("W", "F") else 1 for c in text)


def load(path):
    text = read_text(path)
    rows = list(csv.DictReader(io.StringIO(text)))
    if not rows:
        sys.exit("Empty file.")
    keys = {k.strip().lower(): k for k in rows[0].keys() if k}
    items = []
    if "type" in keys and "text" in keys:
        for r in rows:
            t = (r[keys["type"]] or "").strip().lower()
            x = (r[keys["text"]] or "").strip()
            pin = (r.get(keys.get("pin", ""), "") or "").strip().upper() if "pin" in keys else ""
            if x:
                items.append(dict(type=t, text=x, pin=pin))
        return items
    r = rows[0]
    for kind, n, pfx in (("headline", 15, "H"), ("description", 4, "D")):
        for i in range(1, n + 1):
            col = keys.get(f"{kind} {i}")
            if col and (r.get(col) or "").strip():
                pos = keys.get(f"{kind} {i} position")
                p = (r.get(pos) or "").strip() if pos else ""
                items.append(dict(type=kind, text=r[col].strip(), pin=f"{pfx}{p}" if p and p not in ("-", "--") else ""))
    for i in (1, 2):
        col = keys.get(f"path {i}")
        if col and (r.get(col) or "").strip():
            items.append(dict(type="path", text=r[col].strip(), pin=""))
    return items


def norm_num(s):
    return s.replace(",", "").replace("£", "").replace("$", "").replace("€", "").strip(".+").lower()


def numbers_in(text):
    return re.findall(r"[£$€]?\d[\d,]*(?:\.\d+)?\+?%?", text)


def content_words(t):
    return {w for w in re.findall(r"[a-z0-9£%']+", t.lower()) if w not in STOP}


def arrangements(heads):
    pinned = {p: [h for h in heads if h["pin"] == p] for p in ("H1", "H2", "H3")}
    free = [h for h in heads if not h["pin"]]
    slots = [pinned[p] if pinned[p] else free for p in ("H1", "H2", "H3")]
    n = 0
    for combo in itertools.product(*slots):
        if len({id(h) for h in combo}) == 3:
            n += 1
    return n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ad")
    ap.add_argument("--facts", required=True, help="proof points the ad may use, one per line")
    ap.add_argument("--keyword", action="append", default=[])
    ap.add_argument("--banned")
    ap.add_argument("--acronyms", default="NHS,GDC,UK,LS1,3D,ROI,CPA,FAQ,SEO,PPC,USA,US,EU,TV,CEO")
    a = ap.parse_args()
    items = load(a.ad)
    facts_text = read_text(a.facts).lower()
    fact_nums = {norm_num(n) for n in numbers_in(facts_text)}
    # Qualifier rules, written in facts.md as:  Rule: "finance" needs "subject to status"
    rules = re.findall(r'rule:\s*"([^"]+)"\s+needs\s+"([^"]+)"', facts_text)
    banned = [l.strip().lower() for l in open(a.banned, encoding="utf-8")] if a.banned else []
    banned = [b for b in banned if b and not b.startswith("#")]
    acr = {x.strip().upper() for x in a.acronyms.split(",")}
    fails = warns = 0

    def out(level, msg):
        nonlocal fails, warns
        if level == "FAIL":
            fails += 1
        else:
            warns += 1
        print(f"   {level}: {msg}")

    heads = [i for i in items if i["type"] == "headline"]
    descs = [i for i in items if i["type"] == "description"]
    print(f"{len(heads)} headlines, {len(descs)} descriptions, "
          f"{sum(1 for i in items if i['type'] == 'path')} paths, {len(items)} lines in total\n")
    seen = []
    for it in items:
        lim = LIMITS.get(it["type"])
        n = g_len(it["text"])
        pin = f" [pinned {it['pin']}]" if it["pin"] else ""
        print(f"{'OK  ' if lim and n <= lim else 'LONG'} {it['type']:<20} {n:>3}/{lim or '?':<3} {it['text']}{pin}")
        t = it["text"]
        tl = t.lower()
        if not lim:
            out("FAIL", f"unknown type '{it['type']}'")
            continue
        if n > lim:
            out("FAIL", f"{n - lim} character(s) over the {lim} limit")
        for num in numbers_in(t):
            if norm_num(num) not in fact_nums:
                out("FAIL", f"'{num}' is not in the facts file (prices, ratings, counts and years must come from it)")
        for w in CLAIM_WORDS:
            if re.search(rf"(?<![\w-]){re.escape(w)}(?![\w-])", tl) and w not in facts_text:
                out("FAIL", f"claim word '{w}' has no matching fact")
        for b in banned:
            if re.search(rf"(?<![\w-]){re.escape(b)}(?![\w-])", tl):
                out("FAIL", f"banned word or claim '{b}'")
        for trig, need in rules:
            if trig in tl and need not in tl:
                out("FAIL", f"mentions '{trig}' without '{need}' (rule in facts file). Put it where the "
                            f"qualifier fits, usually a description")
        if re.search(r"([!?.,])\1", t):
            out("FAIL", "repeated punctuation (Google: not allowed, e.g. 'flowers!!')")
        if EMOJI.search(t):
            out("FAIL", "emoji (Google: invalid or unsupported characters)")
        caps = [w for w in re.findall(r"\b[A-Z]{3,}\b", t) if w not in acr]
        if caps:
            out("WARN", f"capitals for emphasis may break Google's capitalisation policy: {', '.join(caps)}")
        for gtell in GENERIC:
            if gtell in tl:
                out("WARN", f"generic AI copy tell: '{gtell}'")
        if it["type"] == "headline" and re.search(r"(\band|&|,|\bwith|\bfor|\bthe)$", tl.strip()):
            out("WARN", "headline ends mid-thought; RSA headlines show in any order and must stand alone")
        if it["type"] in ("headline", "description"):
            cw = content_words(t)
            for prev in seen:
                if prev["type"] != it["type"]:
                    continue
                pw = content_words(prev["text"])
                if cw and pw and len(cw & pw) / len(cw | pw) >= 0.6:
                    out("WARN", f"says much the same as '{prev['text']}' (wastes a slot)")
                    break
                if tl == prev["text"].lower():
                    out("FAIL", "exact duplicate")
                    break
            seen.append(it)

    print("\n== Ad-level checks")
    if heads and not 3 <= len(heads) <= 15:
        out("FAIL", f"RSA needs 3 to 15 headlines (found {len(heads)})")
    if descs and not 2 <= len(descs) <= 4:
        out("FAIL", f"RSA needs 2 to 4 descriptions (found {len(descs)})")
    for kw in a.keyword:
        k = kw.lower()
        hits = [h for h in heads if k in h["text"].lower()]
        print(f"   keyword '{kw}': in {len(hits)} of {len(heads)} headlines")
        if len(hits) < 2 and heads:
            out("WARN", f"'{kw}' is in fewer than 2 headlines (PPC.io default: 2-3, so the keyword can show wherever Google places it)")
        if g_len(kw) > 30:
            out("WARN", f"'{kw}' is over 30 characters; Google advises keeping a keyword intact within a single headline")
    for pos in ("H1", "H2", "H3", "D1", "D2"):
        pinned = [i for i in items if i["pin"] == pos]
        if not pinned:
            continue
        if len(pinned) == 1:
            out("WARN", f"one line pinned to {pos}: it shows in every ad. Fine for a legal line; otherwise Google "
                        f"suggests 2 or 3 unique options per pinned position")
        for x, y in itertools.combinations(pinned, 2):
            cx, cy = content_words(x["text"]), content_words(y["text"])
            if cx and cy and len(cx & cy) / len(cx | cy) >= 0.5:
                out("WARN", f"similar text pinned to {pos}: '{x['text']}' / '{y['text']}' (Google: avoid; can lower Ad Strength)")
    # Sitelinks: description lines are optional, but "if one is set, both must be" (API SitelinkAsset).
    current, ndesc = None, 0
    for it in items + [dict(type="sitelink_text", text="__end__", pin="")]:
        if it["type"] == "sitelink_text":
            if current and ndesc not in (0, 2):
                out("FAIL", f"sitelink '{current}' has {ndesc} description line(s); use 0 or 2")
            current, ndesc = it["text"], 0
        elif it["type"] == "sitelink_description":
            ndesc += 1
    if len(heads) >= 3:
        with_pins = arrangements(heads)
        no_pins = arrangements([dict(h, pin="") for h in heads])
        print(f"   3-headline arrangements: {with_pins:,} with these pins vs {no_pins:,} unpinned")
        if no_pins and with_pins / no_pins < 0.1:
            out("WARN", f"pins cut headline combinations by {1 - with_pins / no_pins:.0%}; pin only what must show")
    print(f"\n{fails} FAIL, {warns} WARN")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
