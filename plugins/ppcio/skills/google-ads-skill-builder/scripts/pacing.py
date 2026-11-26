#!/usr/bin/env python3
"""Budget pacing maths, exact.

Usage: python pacing.py --budget 3000 --spent 1640 [--date 2026-11-17] [--band 10]

Expected to date = budget x days elapsed / days in month (days elapsed
counts the given date as complete). Google caps a day at 2x the average
daily budget and a month at 30.4x (support.google.com/google-ads/answer/6385083).
"""
import argparse
import calendar
import datetime as dt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--budget", type=float, required=True, help="client monthly budget")
    ap.add_argument("--spent", type=float, required=True, help="spend month to date")
    ap.add_argument("--date", default=dt.date.today().isoformat(), help="last complete day")
    ap.add_argument("--band", type=float, default=10.0, help="ok band in percent")
    a = ap.parse_args()

    d = dt.date.fromisoformat(a.date)
    dim = calendar.monthrange(d.year, d.month)[1]
    elapsed = d.day
    left = dim - elapsed
    expected = a.budget * elapsed / dim
    pace = a.spent / expected if expected else 0
    projected = a.spent / elapsed * dim if elapsed else 0
    needed = (a.budget - a.spent) / left if left else 0

    status = "ON PACE"
    if pace > 1 + a.band / 100:
        status = "OVERPACING"
    elif pace < 1 - a.band / 100:
        status = "UNDERPACING"

    print(f"Month: {d:%B %Y} ({elapsed} of {dim} days complete, {left} left)")
    print(f"Budget: {a.budget:,.2f}  Spent: {a.spent:,.2f}  Expected: {expected:,.2f}")
    print(f"Pace: {pace:.0%}  -> {status} (band +/-{a.band:.0f}%)")
    print(f"Projected month end: {projected:,.2f} ({projected - a.budget:+,.2f} vs budget)")
    if left:
        print(f"Daily spend needed for the rest of the month: {needed:,.2f}")
        print(f"Average daily budget to set (Google treats it as average): {needed:,.2f}")


if __name__ == "__main__":
    main()
