#!/usr/bin/env python3
"""Conversion lag curve from a Days to conversion export (shared helper).

build_curves(path) -> {campaign: Counter{(lo, hi): conversions}, "__account__": ...}
completeness(curve, age) -> share of a day's final conversions reported
`age` days after it (age 0 = last complete day).
"""
import collections
import re

from gads_io import load_table, num

LAG = {
    "campaign": ["Campaign", "campaign.name"],
    "bucket": ["Days to conversion", "Conversion lag", "segments.conversion_lag_bucket"],
    "conv": ["Conversions", "metrics.conversions", "All conv."],
}
WORDS = {w: i for i, w in enumerate(
    "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen".split())}
WORDS.update({"twenty_one": 21, "thirty": 30, "forty_five": 45, "sixty": 60, "ninety": 90})


def bucket_bounds(label):
    """'< 1 day' -> (0,1); '1 to < 2 days' -> (1,2); 'ONE_TO_TWO_DAYS' -> (1,2)."""
    s = label.strip()
    if re.fullmatch(r"[A-Z_]+", s):
        if s.startswith("LESS_THAN_ONE"):
            return (0, 1)
        m = re.match(r"([A-Z_]+?)_TO_([A-Z_]+?)_DAYS?$", s)
        if m:
            a, b = WORDS.get(m[1].lower()), WORDS.get(m[2].lower())
            if a is not None and b is not None:
                return (a, b)
        return None
    nums = [int(n) for n in re.findall(r"\d+", s)]
    if not nums:
        return None
    if len(nums) == 1:
        if s.lstrip().startswith("<"):
            return (0, nums[0])
        return (nums[0], nums[0] + 30)          # "90+ days" or "> 90 days"
    return (nums[0], nums[1])


def build_curves(path):
    _, cm, rows, _ = load_table(path, ["bucket", "conv"], LAG)
    per = collections.defaultdict(lambda: collections.Counter())
    bad = set()
    for r in rows:
        b = bucket_bounds(r[cm["bucket"]])
        if not b:
            bad.add(r[cm["bucket"]])
            continue
        camp = r.get(cm["campaign"], "") if cm["campaign"] else ""
        n = num(r[cm["conv"]])
        per[camp][b] += n
        per["__account__"][b] += n
    if bad:
        print(f"WARNING: could not read lag buckets: {sorted(bad)}")
    return per


def completeness(curve, age):
    """Share of a day's final conversions already reported `age` days later.

    Day with age 0 = the last complete day. A conversion with lag L days is
    in the data once age >= L. Buckets wider than a day are spread evenly.
    """
    total = sum(curve.values())
    if not total:
        return 1.0
    got = 0.0
    for (lo, hi), n in curve.items():
        if hi <= age + 1:
            got += n
        elif lo <= age:
            got += n * (age + 1 - lo) / (hi - lo)
    return got / total


