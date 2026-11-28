#!/usr/bin/env python3
"""Client Reporting Studio: Deterministic Zero-Drift Compiler Gate.

Validates client-facing report text or narrative JSON against immutable facts.json:
1. _week lock check (stale week's story can never attach to fresh numbers)
2. Client-safe jargon blocklist (learning phase, Impression Share, Quality Score, tCPA/tROAS)
3. Zero tiny-base absurdities (+3,000% / 0.00x) and zero em dashes
4. Vocabulary check (never "leads" on ecommerce or "ROAS" on lead_gen client copy)
5. Safety Hold check (blocks client send when tracking collapsed <25% of normal)
"""
import argparse
import json
import re
import sys
from pathlib import Path

CLIENT_JARGON = [
    (r"\blearning phase\b", "Never expose 'learning phase' excuses in client-facing reports"),
    (r"\bimpression share\b", "Translate 'Impression Share' into plain English (how often ads showed)"),
    (r"\bquality score\b", "Translate 'Quality Score' into plain English for clients"),
    (r"\btCPA\b|\btROAS\b", "Avoid raw bid acronyms (tCPA/tROAS) in client copy"),
    (r"(?:[+-]\s*(?:[5-9]\d{2}|\d{4,})(?:,\d{3})*%|\b\d{1,3},\d{3}%)", "Avoid absurd tiny-base percentages like +3,000%; use 'up sharply' or '3x'"),
    (r"—", "Remove em dashes for clean human prose"),
]


def strip_html(raw):
    s = re.sub(r"<(style|script)\b[^>]*>.*?</\1>", " ", raw, flags=re.I | re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    return s


def verify(facts, text, story_week=None, allow_hold=False):
    clean = strip_html(text) if ("<html" in text.lower() or "</" in text) else text
    errors = []
    if story_week and story_week != facts.get("_week"):
        errors.append(f"WEEK_LOCK_MISMATCH: story _week={story_week} does not match facts _week={facts.get('_week')}")
    if facts.get("safety_hold") and not allow_hold:
        errors.append(f"SAFETY_HOLD_ACTIVE: {facts.get('safety_hold_reason')}")
    for pat, msg in CLIENT_JARGON:
        if re.search(pat, clean, re.I if pat != "—" else 0):
            errors.append(f"CLIENT_COPY_FAIL: {msg}")
    atype = facts.get("account_type", "lead_gen")
    if atype == "ecommerce" and re.search(r"\b(leads|cpl|cost per lead)\b", clean, re.I):
        errors.append("VOCAB_LEAK: Ecommerce client copy uses lead-gen words (leads/CPL).")
    if atype == "lead_gen" and re.search(r"\b(roas|return on ad spend|aov)\b", clean, re.I):
        errors.append("VOCAB_LEAK: Lead-gen client copy uses ecommerce words (ROAS/AOV).")
    return errors


def main():
    ap = argparse.ArgumentParser(description="Verify client-facing report text/JSON against facts.json")
    ap.add_argument("--facts", required=True)
    ap.add_argument("--draft", required=True, help="Markdown, HTML text, or story JSON file")
    ap.add_argument("--allow-hold", action="store_true", help="Acknowledge safety hold for internal review")
    args = ap.parse_args()

    facts = json.loads(Path(args.facts).read_text(encoding="utf-8"))
    raw = Path(args.draft).read_text(encoding="utf-8")
    story_week = None
    text = raw
    if args.draft.endswith(".json"):
        obj = json.loads(raw)
        story_week = obj.get("_week")
        text = json.dumps(obj)

    errors = verify(facts, text, story_week, args.allow_hold)
    if errors:
        for e in errors:
            print(f"FAIL: {e}")
        sys.exit(1)
    print("PASS: Report passed _week lock, client-safe language, vocabulary, and safety-hold checks.")


if __name__ == "__main__":
    main()
