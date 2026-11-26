#!/usr/bin/env python3
"""Check text against exact limits. Models miscount; this does not.

Usage:
  python limits_check.py file.txt --max-chars 30            # every line
  python limits_check.py file.txt --max-words 150 --whole   # the whole file
  python limits_check.py file.txt --max-items 3              # non-empty lines

Prints one line per item with OK or FAIL, and exits 1 on any FAIL.
"""
import argparse
import sys


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--max-chars", type=int)
    ap.add_argument("--max-words", type=int)
    ap.add_argument("--max-items", type=int)
    ap.add_argument("--whole", action="store_true", help="check the whole file as one item")
    a = ap.parse_args()
    text = open(a.file, encoding="utf-8").read()
    items = [text.strip()] if a.whole else [l.rstrip() for l in text.splitlines() if l.strip()]
    bad = 0
    if a.max_items is not None:
        ok = len(items) <= a.max_items
        bad += not ok
        print(f"{'OK  ' if ok else 'FAIL'} {len(items)} items (max {a.max_items})")
    for it in items:
        msgs = []
        if a.max_chars is not None and len(it) > a.max_chars:
            msgs.append(f"{len(it)}/{a.max_chars} chars")
        if a.max_words is not None and len(it.split()) > a.max_words:
            msgs.append(f"{len(it.split())}/{a.max_words} words")
        if msgs:
            bad += 1
            print(f"FAIL {', '.join(msgs)}: {it[:80]}")
        else:
            detail = f"{len(it)} chars" if a.max_chars else f"{len(it.split())} words"
            print(f"OK   {detail}: {it[:80]}")
    print(f"\n{bad} FAIL")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
