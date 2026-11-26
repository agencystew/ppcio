#!/usr/bin/env python3
"""Check a weekly client report draft against the numbers script, before anyone sends it.

Usage:
  python report_check.py draft.md --numbers numbers.txt
         [--term bookings] [--max-words 200] [--allow 2026 --allow 30]

  draft.md     the email: first line "Subject: ...", then the body.
  numbers.txt  the saved output of weekly_numbers.py for the same week.
  --term       what the client calls a conversion. "conversions" is flagged
               as jargon unless you pass --term conversions.
  --allow      a number that may appear without being in the script output
               (a date, a phone number). Repeat as needed.

What it checks:
  1. Every number in the draft is in the script output, after rounding.
     "about 130" matches 129.7. "£3,487" matches 3,487.31. Dates are skipped.
  2. The body is under --max-words words.
  3. No ad jargon from references/plain-words.md is left in.
  4. If the script says conversions are still to arrive, the draft says so.
  5. If brand and non-brand moved in opposite directions, the draft names both.
  6. The three sections of the template are there.

Prints PASS / WARN / FAIL lines. Exits 1 if anything FAILs.
A clean run proves the numbers and the format, not that the story is right.
"""
import argparse
import re
import sys

MONTHS = r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*"
NUM = re.compile(r"(?<![\w.])[£$€]?(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?\s?(%|x)?", re.I)
ESTIMATE_WORDS = ("about", "around", "roughly", "nearly", "almost", "just over", "just under", "close to")

# Ad words a client should not have to decode. Each maps to the plain version
# in references/plain-words.md. A term the client uses can be allowed with --term.
JARGON = {
    r"\bCPA\b|cost per conversion": "cost per booking (or lead)",
    r"\bROAS\b": "revenue for every £1 spent",
    r"\bCTR\b|click-through rate": "how often people who saw the ad clicked it",
    r"impression share": "how often our ads showed when people searched",
    r"smart bidding|target CPA|\btCPA\b|tROAS": "the cost per booking we've asked Google to aim for",
    r"broad match": "keywords that let Google show us for related searches",
    r"conversion lag": "bookings are counted on the click date, so recent days keep rising",
    r"\bnon-brand\b|\bnonbrand\b": "new customers (people who didn't search for you by name)",
    r"\bSERP\b|\bQS\b|quality score|\bPMax\b|performance max": "say what it means for the client",
    r"\bconversions?\b": "what the client calls them: bookings, leads, sales, calls",
}
STILL_ARRIVING = ("still coming in", "still to come", "still arriving", "still being counted",
                  "still come in", "still landing", "not all counted", "arrive late", "come in late")
SECTIONS = ("what happened", "what we're doing", "what we need from you")


def numbers_in(text):
    """Every number in text as (value, decimals, kind, start, raw). kind is money, pct or plain."""
    out = []
    for m in NUM.finditer(text):
        whole, frac, unit = m.group(1), m.group(2) or "", (m.group(3) or "").lower()
        value = float(whole.replace(",", "") + frac)
        kind = "money" if m.group(0)[0] in "£$€" else "pct" if unit == "%" else "plain"
        out.append((value, max(len(frac) - 1, 0), kind, m.start(), m.group(0)))
    return out


def is_date(text, start, raw):
    """Skip day numbers next to a month name, years, and times."""
    around = text[max(0, start - 12): start + len(raw) + 12].lower()
    value = raw.strip("£$€%x ").replace(",", "")
    if re.fullmatch(r"20\d\d", value):
        return True
    if re.search(MONTHS, around) and re.fullmatch(r"\d{1,2}", value):
        return True
    return bool(re.match(r"\d{1,2}(:\d\d|am|pm)", text[start:start + 6].lower()))


def matches(value, decimals, kind, hedged, source):
    """Money matches only money and a percent only a percent, so 21.8 bookings never backs "£22"."""
    for s, s_kind in source:
        if kind != "plain" and s_kind != kind:
            continue
        s = abs(s)
        if round(s, decimals) == value:
            return True
        # "about 130" may round a 129.7 estimate to the nearest 5 or 10.
        if hedged and decimals == 0 and (round(s / 5) * 5 == value or round(s / 10) * 10 == value):
            return True
    return False


def body_of(draft):
    lines = draft.strip().splitlines()
    if lines and lines[0].lower().startswith("subject:"):
        return lines[0], "\n".join(lines[1:])
    return "", draft


def opposite_moves(numbers_text):
    """(brand change %, non-brand change %) on final estimate, if the script printed both."""
    found = {}
    for label in ("Brand", "Non-brand"):
        m = re.search(r"^- " + label + r"\n(?:.*\n){0,2}?.*change on final est\. ([+-]?\d+)%", numbers_text, re.M)
        if m:
            found[label] = int(m.group(1))
    if len(found) == 2 and found["Brand"] * found["Non-brand"] < 0:
        return found["Brand"], found["Non-brand"]
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("draft")
    ap.add_argument("--numbers", required=True, help="saved output of weekly_numbers.py")
    ap.add_argument("--term", action="append", default=[], help="a word the client uses, e.g. conversions")
    ap.add_argument("--max-words", type=int, default=200)
    ap.add_argument("--allow", action="append", default=[], help="a number allowed without a source")
    a = ap.parse_args()

    draft = open(a.draft, encoding="utf-8").read()
    numbers_text = open(a.numbers, encoding="utf-8").read()
    subject, body = body_of(draft)
    low = body.lower()
    fails = warns = 0

    def report(level, msg):
        nonlocal fails, warns
        fails += level == "FAIL"
        warns += level == "WARN"
        print(f"{level}  {msg}")

    # 1. Numbers
    source = [(v, k) for v, _d, k, *_ in numbers_in(numbers_text)]
    allowed = {float(x.replace(",", "")) for x in a.allow}
    missing = []
    for value, decimals, kind, start, raw in numbers_in(draft):
        if value in allowed or is_date(draft, start, raw):
            continue
        before = draft[max(0, start - 14): start].lower()
        hedged = any(w in before for w in ESTIMATE_WORDS)
        if not matches(value, decimals, kind, hedged, source):
            missing.append(raw.strip())
    if missing:
        report("FAIL", "numbers not in the script output: " + ", ".join(missing)
               + ". Use the script's figure, or pass --allow for a date or phone number.")
    else:
        report("PASS", "every number is in the script output")

    # 2. Length
    words = len(re.findall(r"\b[\w'£$%.,-]+\b", body))
    report("FAIL" if words > a.max_words else "PASS", f"{words} words in the body (limit {a.max_words})")
    if subject:
        n = len(subject.split(":", 2)[-1].split())
        if not 4 <= n <= 12:
            report("WARN", f"subject headline is {n} words; the template asks for 6 to 10")

    # 3. Jargon
    allow_terms = [t.lower() for t in a.term]
    for pattern, plain in JARGON.items():
        hits = sorted({m.group(0) for m in re.finditer(pattern, body, re.I)})
        hits = [h for h in hits if h.lower().rstrip("s") not in [t.rstrip("s") for t in allow_terms]]
        if hits:
            report("FAIL", f"jargon {', '.join(hits)} -> {plain}")

    # 4. Late conversions
    m = re.search(r"Still to arrive for the report week.*?: ([\d.]+) conversions", numbers_text)
    if m and float(m.group(1)) >= 1:
        if any(p in low for p in STILL_ARRIVING):
            report("PASS", "says recent bookings are still coming in")
        else:
            report("FAIL", f"the script expects about {round(float(m.group(1)))} more to arrive; "
                           "say 'bookings from the last few days are still coming in'")

    # 5. Brand split
    moves = opposite_moves(numbers_text)
    if moves:
        names_brand = "brand" in low or "by name" in low
        names_new = "new " in low or "non-brand" in low
        if names_brand and names_new:
            report("PASS", "names brand and new-customer bookings separately")
        else:
            report("FAIL", f"brand moved {moves[0]:+d}% and non-brand {moves[1]:+d}%; "
                           "a flat total hides this, so say both in the first lines")

    # 6. Sections
    gone = [s for s in SECTIONS if s not in low.replace("’", "'")]
    if gone:
        report("WARN", "missing template sections: " + ", ".join(gone))

    print(f"\n{'FAIL' if fails else 'PASS'}: {fails} fail, {warns} warn")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
