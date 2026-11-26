#!/usr/bin/env python3
"""Audit a custom GPT's instructions before moving it to a Claude skill.

Usage: python gpt_audit.py instructions.txt [--starters starters.txt]

Prints counts, shouted rules, exact limits, links, file names, and a first
sort of each line into role / step / rule / fact / format / example.
The sort is a keyword guess. Claude checks it before building.
"""
import argparse
import re
from collections import Counter

ROLE = re.compile(r"^\s*(you are|you're|act as|your role|as an? )", re.I)
STEP = re.compile(r"^\s*(\d+[.)]|step \d+|first,|then,|next,|finally,)", re.I)
RULE = re.compile(r"\b(never|always|must|do not|don't|avoid|only|make sure|ensure|required?)\b", re.I)
FORMAT = re.compile(r"\b(format|bullet|table|markdown|heading|output|respond with|structure)\b", re.I)
EXAMPLE = re.compile(r"\b(example|e\.g\.|for instance|sample|like this)\b", re.I)
SHOUT = re.compile(r"\b(?:NEVER|ALWAYS|MUST|DO NOT|DON'T|IMPORTANT|CRITICAL|ONLY)\b")
CAPS_WORD = re.compile(r"\b[A-Z]{4,}\b")
LIMIT = re.compile(r"(\d[\d,]*)\s*(characters?|chars?|words?|sentences?|bullets?|headlines?|descriptions?|items?|lines?|paragraphs?)", re.I)
LINK = re.compile(r"https?://\S+")
FILE = re.compile(r"\b[\w-]+\.(?:pdf|docx?|txt|csv|xlsx?|md|json|pptx?)\b", re.I)
SECRETLIKE = re.compile(r"\b(sk-[A-Za-z0-9]{10,}|api[_ -]?key\s*[:=]\s*\S+)", re.I)
IGNORED_CAPS = {"HTML", "JSON", "URL", "URLS", "PDF", "CSV", "SEO", "PPC", "ROAS", "CTA", "UTM", "GAQL", "API"}


def kind(line):
    if ROLE.search(line):
        return "role"
    if STEP.search(line):
        return "step"
    if EXAMPLE.search(line):
        return "example"
    if FORMAT.search(line):
        return "format"
    if RULE.search(line):
        return "rule"
    return "fact"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("instructions")
    ap.add_argument("--starters")
    a = ap.parse_args()
    text = open(a.instructions, encoding="utf-8", errors="replace").read()
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    words = len(re.findall(r"\S+", text))

    print("== Size")
    print(f"{words} words, {len(lines)} non-empty lines, {len(text)} characters")
    if len(text) > 8000:
        print("Over 8,000 characters: the GPT editor's limit. Some of it may never have been read.")

    shouts = SHOUT.findall(text)
    shout_words = {w for x in shouts for w in x.split()}
    caps = [w for w in CAPS_WORD.findall(text) if w not in IGNORED_CAPS and w not in shout_words]
    print("\n== Shouted rules")
    print(f"{len(shouts)} shouted rule words: {dict(Counter(shouts).most_common())}")
    print(f"{len(caps)} other all-caps words: {sorted(set(caps))[:15]}")
    for l in lines:
        if SHOUT.search(l):
            print(f"  - {l[:140]}")

    print("\n== Exact limits (each one needs a script check)")
    found = LIMIT.findall(text)
    for n, unit in found:
        print(f"  - {n} {unit}")
    if not found:
        print("  none found")

    print("\n== Links and files")
    for u in sorted(set(LINK.findall(text))):
        print(f"  link: {u}")
    for f in sorted(set(FILE.findall(text))):
        print(f"  file: {f}")
    if SECRETLIKE.search(text):
        print("  WARNING: something that looks like a key is in the instructions. Do not copy it into the skill.")

    print("\n== First sort of each line")
    counts = Counter()
    for l in lines:
        k = kind(l)
        counts[k] += 1
        print(f"  [{k:7}] {l[:120]}")
    print(f"\nTotals: {dict(counts)}")

    print("\n== Rules that may fight each other")
    pairs = [(r"\b(concise|brief|short)\b", r"\b(in detail|detailed|thorough|explain .* reasoning)\b"),
             (r"\bnever ask\b", r"\bask\b"), (r"\bformal\b", r"\b(casual|friendly|fun)\b")]
    clash = 0
    for a1, a2 in pairs:
        for l in lines:
            if re.search(a1, l, re.I) and re.search(a2, l, re.I):
                print(f"  - same line: {l[:120]}"); clash += 1
    if not clash:
        print("  none found")

    missing = []
    if not counts["example"]:
        missing.append("no example of a good answer")
    if not re.search(r"\b(don't use|do not use|not for|outside (your|the) scope|refuse)\b", text, re.I):
        missing.append("no 'when not to use'")
    if not counts["format"]:
        missing.append("no output format")
    print("Missing: " + (", ".join(missing) if missing else "nothing obvious"))

    if a.starters:
        st = [l.strip() for l in open(a.starters, encoding="utf-8").read().splitlines() if l.strip()]
        print(f"\n== Conversation starters ({len(st)}): each becomes a test prompt")
        for s in st:
            print(f"  - {s}")


if __name__ == "__main__":
    main()
