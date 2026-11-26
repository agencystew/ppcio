#!/usr/bin/env python3
"""Read messy Google Ads exports: the shared loader for the flagship skills.

Handles what real downloads look like:
- a title line and a date-range line above the header row
- UTF-8, UTF-8 with BOM, or UTF-16 files; comma, tab or semicolon separated
- "Total: ..." rows at the bottom (kept apart, never summed with the rows)
- money like "£1,234.56", "$1,234.56", "1.234,56 €" is NOT guessed: see num()
- "--", "", " --" for empty cells
- shares like "45.3%", "< 10%", "> 90%"
- dates like 2026-11-03, 3 Nov 2026, Nov 3, 2026, Tue, Nov 3, 2026, 03/11/2026

Import it from the other scripts: `from gads_io import load_table, num, share, parse_date`.
"""
import csv
import datetime as dt
import io
import re

MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}


def read_text(path):
    raw = open(path, "rb").read()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        return raw.decode("utf-16")
    if raw[:3] == b"\xef\xbb\xbf":
        return raw[3:].decode("utf-8")
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252")


def norm_col(c):
    c = (c or "").strip().lower().replace("\ufeff", "")
    c = re.sub(r"[\s_]+", " ", c)
    return c


def find_col(header, aliases):
    """Return the header cell matching any alias (exact after normalising)."""
    normed = {norm_col(h): h for h in header}
    for a in aliases:
        if norm_col(a) in normed:
            return normed[norm_col(a)]
    return None


def load_table(path, must_have, aliases):
    """Find the header row and return (meta_lines, colmap, rows, totals).

    must_have: keys from `aliases` that the header row has to contain.
    aliases:   {key: [possible column names]}
    colmap:    {key: actual header text or None}
    rows:      list of dicts keyed by the actual header text
    totals:    rows whose first cell starts with "Total"
    """
    text = read_text(path)
    lines = text.splitlines()
    sample = "\n".join(lines[:40])
    delim = max([",", "\t", ";"], key=lambda d: sample.count(d))
    parsed = list(csv.reader(io.StringIO(text), delimiter=delim))
    start = None
    for i, row in enumerate(parsed[:60]):
        if all(find_col(row, aliases[k]) for k in must_have):
            start = i
            break
    if start is None:
        need = ", ".join(aliases[k][0] for k in must_have)
        raise SystemExit(f"{path}: no header row with columns: {need}. "
                         f"First lines: {lines[:3]}")
    header = [h.strip() for h in parsed[start]]
    colmap = {k: find_col(header, v) for k, v in aliases.items()}
    meta = [",".join(r).strip(", ") for r in parsed[:start] if any(c.strip() for c in r)]
    rows, totals = [], []
    for r in parsed[start + 1:]:
        if not any(c.strip() for c in r):
            continue
        d = {header[j]: (r[j].strip() if j < len(r) else "") for j in range(len(header))}
        first = (r[0] if r else "").strip().lower()
        if first.startswith("total"):
            totals.append(d)
            continue
        rows.append(d)
    return meta, colmap, rows, totals


def num(x, decimal=","):
    """Parse a number. Assumes ',' thousands and '.' decimals (UK/US UI).

    Pass decimal="." for exports from accounts set to a comma-decimal
    locale, e.g. "1.234,56". Returns 0.0 for empty cells and "--".
    """
    x = (x or "").strip()
    if x in ("", "--", "-", "—", " --"):
        return 0.0
    neg = x.startswith("(") and x.endswith(")")
    if decimal == ".":
        x = x.replace(".", "").replace(",", ".")
    else:
        x = x.replace(",", "")
    x = re.sub(r"[^\d.\-]", "", x)
    try:
        v = float(x)
    except ValueError:
        return 0.0
    return -v if neg else v


def share(x):
    """Parse an impression-share style cell.

    Returns (value, flag): value is a 0-1 float or None, flag is "" or
    "<" / ">" when Google reports "< 10%" or "> 90%" (a bound, not a value).
    API values arrive as 0.35 or the string "< 0.10".
    """
    x = (x or "").strip()
    if x in ("", "--", "-"):
        return None, ""
    flag = ""
    if x.startswith("<"):
        flag = "<"
    elif x.startswith(">"):
        flag = ">"
    pct = "%" in x
    v = num(x)
    if pct or v > 1:
        v = v / 100
    return v, flag


def parse_date(s, dayfirst=True):
    s = (s or "").strip()
    if not s:
        return None
    s = re.sub(r"^[A-Za-z]{3,9},?\s+", "", s) if re.match(r"^[A-Za-z]{3,9},?\s+\w", s) and not re.match(
        r"^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d", s, re.I) else s
    s = s.split(" at ")[0]
    m = re.match(r"^(\d{4})-(\d{1,2})-(\d{1,2})", s)
    if m:
        return dt.date(int(m[1]), int(m[2]), int(m[3]))
    m = re.match(r"^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})", s)
    if m and m[2][:3].lower() in MONTHS:
        return dt.date(int(m[3]), MONTHS[m[2][:3].lower()], int(m[1]))
    m = re.match(r"^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})", s)
    if m and m[1][:3].lower() in MONTHS:
        return dt.date(int(m[3]), MONTHS[m[1][:3].lower()], int(m[2]))
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{2,4})", s)
    if m:
        a, b, y = int(m[1]), int(m[2]), int(m[3])
        y = y + 2000 if y < 100 else y
        if a > 12:
            dayfirst = True
        elif b > 12:
            dayfirst = False
        d, mo = (a, b) if dayfirst else (b, a)
        return dt.date(y, mo, d)
    return None


def guess_dayfirst(values):
    """Look at slash dates; if any first part > 12 it is day-first."""
    for v in values:
        m = re.match(r"^\s*(\d{1,2})/(\d{1,2})/", v or "")
        if m:
            if int(m[1]) > 12:
                return True
            if int(m[2]) > 12:
                return False
    return True


def currency_of(rows, cols):
    for r in rows[:200]:
        for c in cols:
            if not c:
                continue
            m = re.search(r"[£$€¥₹]", r.get(c, ""))
            if m:
                return m.group(0)
    return ""


def check_totals(rows, totals, colmap, keys):
    """Compare the sum of rows with the export's own Total row, if any."""
    out = []
    if not totals:
        return ["No Total row in the export; totals are the sum of rows."]
    t = totals[-1]
    for k in keys:
        c = colmap.get(k)
        if not c:
            continue
        s = sum(num(r.get(c)) for r in rows)
        tv = num(t.get(c))
        ok = abs(s - tv) <= max(0.01 * abs(tv), 0.5)
        out.append(f"{k}: rows sum {s:,.2f} vs export total {tv:,.2f} -> {'OK' if ok else 'MISMATCH'}")
    return out
