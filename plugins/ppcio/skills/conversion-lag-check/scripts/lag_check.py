#!/usr/bin/env python3
"""Is it a real drop, or are conversions still arriving? Lag-aware check.

Usage:
  python lag_check.py --daily daily.csv --lag days_to_conversion.csv --target-cpa 60
         [--campaign-target "Implants=90" ...] [--recent 7] [--baseline 28]
         [--as-of 2026-11-16] [--lag-days 7]

--daily  Campaign report segmented by Day: Day, Campaign, Clicks, Cost,
         Conversions (Impr., Conv. value, Campaign state and the Search
         impression share columns are used when present).
--lag    Campaign report segmented by Conversions > Days to conversion,
         date range ending at least 30 days ago (Google's advice). Gives
         this account's own lag curve. Without it, pass --lag-days N and
         the newest N days are left out instead of adjusted.

Why: Google dates conversions by click, not by conversion
(support.google.com/google-ads/answer/6270625), so the newest days always
look low until late conversions arrive. This script measures how complete
each recent day is likely to be, estimates the final count, and tests the
change against normal noise. Paused and removed campaigns are kept: status
is the current status, not the status during the date range.
"""
import argparse
import collections
import datetime as dt
import math
import re
import sys

from gads_io import load_table, num, share, parse_date, guess_dayfirst, check_totals, currency_of

DAILY = {
    "day": ["Day", "Date", "segments.date"],
    "campaign": ["Campaign", "campaign.name"],
    "state": ["Campaign state", "Campaign status", "Status", "campaign.status"],
    "impr": ["Impr.", "Impressions", "metrics.impressions"],
    "clicks": ["Clicks", "metrics.clicks"],
    "cost": ["Cost", "metrics.cost"],
    "cost_micros": ["metrics.cost_micros"],
    "conv": ["Conversions", "Conv.", "metrics.conversions"],
    "value": ["Conv. value", "Conversion value", "metrics.conversions_value"],
    "is": ["Search impr. share", "Search impression share", "metrics.search_impression_share"],
    "isb": ["Search lost IS (budget)", "metrics.search_budget_lost_impression_share"],
    "isr": ["Search lost IS (rank)", "metrics.search_rank_lost_impression_share"],
}
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--daily", required=True)
    ap.add_argument("--lag")
    ap.add_argument("--lag-days", type=int, help="no lag file: leave out the newest N days")
    ap.add_argument("--target-cpa", type=float)
    ap.add_argument("--campaign-target", action="append", default=[],
                    help='"text in campaign name=CPA", e.g. "Implants=90"')
    ap.add_argument("--recent", type=int, default=7)
    ap.add_argument("--baseline", type=int, default=28)
    ap.add_argument("--as-of", help="last complete day in the data (default: newest day)")
    ap.add_argument("--brand", help="regex for brand campaign names; brand is reported apart so it does not flatter CPA")
    ap.add_argument("--min-complete", type=float, default=0.5,
                    help="days less complete than this are shown but marked too early")
    a = ap.parse_args()
    if not a.lag and a.lag_days is None:
        sys.exit("Give --lag (Days to conversion export) or --lag-days N. Guessing the lag is how "
                 "false 'drops' get reported.")

    meta, cm, rows, totals = load_table(a.daily, ["day", "campaign", "clicks", "conv"], DAILY)
    if not cm["cost"] and not cm["cost_micros"]:
        sys.exit("No Cost column found.")
    df = guess_dayfirst([r[cm["day"]] for r in rows])
    cur = currency_of(rows, [cm["cost"]]) or ""
    data = []
    for r in rows:
        d = parse_date(r[cm["day"]], df)
        if not d:
            continue
        cost = num(r[cm["cost"]]) if cm["cost"] else num(r[cm["cost_micros"]]) / 1e6
        data.append(dict(day=d, camp=r[cm["campaign"]], state=r.get(cm["state"], "") if cm["state"] else "",
                         impr=num(r.get(cm["impr"])) if cm["impr"] else 0, clicks=num(r[cm["clicks"]]),
                         cost=cost, conv=num(r[cm["conv"]]),
                         is_=share(r.get(cm["is"])) if cm["is"] else (None, ""),
                         isb=share(r.get(cm["isb"])) if cm["isb"] else (None, ""),
                         isr=share(r.get(cm["isr"])) if cm["isr"] else (None, "")))
    if not data:
        sys.exit("No dated rows read.")
    as_of = dt.date.fromisoformat(a.as_of) if a.as_of else max(r["day"] for r in data)
    first = min(r["day"] for r in data)

    print("== Input")
    for m in meta:
        print(f"File header: {m}")
    print(f"Rows: {len(data)}  Days: {first} to {max(r['day'] for r in data)}  As of: {as_of}")
    for line in check_totals(rows, totals, cm, ["clicks", "cost", "conv"]):
        print(f"Totals check: {line}")
    states = collections.Counter((r["camp"], r["state"]) for r in data)
    not_live = sorted({c for (c, s) in states if s and s.lower() not in ("enabled", "eligible", "")})
    if not_live:
        print("Campaigns not enabled now (kept in every total; status is today's status): " + "; ".join(not_live))

    # Windows. With --lag-days, shift the recent window back past the lag.
    shift = a.lag_days if (not a.lag and a.lag_days) else 0
    r_end = as_of - dt.timedelta(days=shift)
    r_start = r_end - dt.timedelta(days=a.recent - 1)
    b_end = r_start - dt.timedelta(days=1)
    b_start = b_end - dt.timedelta(days=a.baseline - 1)
    if b_start < first:
        print(f"WARNING: baseline starts {b_start}, before the data ({first}). Shorten --baseline or export more days.")
    if a.recent % 7 or a.baseline % 7:
        print("WARNING: windows are not whole weeks, so weekday mix differs (weekends convert differently).")
    print(f"Recent window: {r_start} to {r_end} ({a.recent} days). Baseline: {b_start} to {b_end} ({a.baseline} days).")

    curves = build_curves(a.lag) if a.lag else None
    curve_for = {}
    if curves:
        acct = curves["__account__"]
        print("\n== Lag curve (share of final conversions reported after N days)")
        print("  account: " + "  ".join(f"day{n}:{completeness(acct, n):.0%}" for n in (0, 1, 2, 3, 6, 13, 29)))
        for camp in sorted({r["camp"] for r in data}):
            c = curves.get(camp)
            if c and sum(c.values()) >= 30:
                curve_for[camp] = c
                print(f"  {camp}: " + "  ".join(f"day{n}:{completeness(c, n):.0%}" for n in (0, 1, 2, 6, 13)))
            else:
                curve_for[camp] = acct
                print(f"  {camp}: under 30 conversions in the lag file, using the account curve")
        stale = [m for m in parse_meta_dates(read_meta(a.lag)) if (as_of - m).days < 30]
        if stale:
            print("WARNING: the lag export ends less than 30 days before the data; Google says to end it "
                  "at least 30 days ago so late conversions are complete.")

    def comp(camp, d):
        if not curves:
            return 1.0
        return completeness(curve_for.get(camp, curves["__account__"]), (as_of - d).days)

    wd_only = None
    if a.recent < 7:
        wd_only = {(r_start + dt.timedelta(days=i)).weekday() for i in range(a.recent)}
        print("Recent window is under a week: the baseline uses the same weekdays only, "
              "and no verdict is given if the window is mostly too early.")

    def window(start, end, camp=None, base=False, wds=None):
        s = dict(clicks=0.0, cost=0.0, conv=0.0, adj=0.0, var=0.0, early_days=set(), days=0)
        keep = wds if wds is not None else (wd_only if base else None)
        for r in data:
            if keep is not None and r["day"].weekday() not in keep:
                continue
            if start <= r["day"] <= end and (camp is None or r["camp"] == camp):
                c = max(comp(r["camp"], r["day"]), 1e-6)
                s["clicks"] += r["clicks"]
                s["cost"] += r["cost"]
                s["conv"] += r["conv"]
                est = r["conv"] / c
                s["adj"] += est
                s["var"] += max(est, 0.5) / c          # Poisson: var(obs/c) = true*c/c^2
                if c < a.min_complete:
                    s["early_days"].add(r["day"])
        return s

    def verdict(rw, bw, scale):
        """z-test on lag-adjusted conversions per week, recent vs baseline."""
        b = bw["adj"] * scale
        vb = bw["var"] * scale * scale
        diff = rw["adj"] - b
        z = diff / math.sqrt(max(rw["var"] + vb, 1e-9))
        pct = diff / b if b else float("nan")
        if abs(z) >= 1.96:
            v = "LIKELY REAL" + (" DROP" if diff < 0 else " RISE")
        else:
            v = "WITHIN NORMAL NOISE"
        return pct, z, v

    def tgt(camp):
        for t in a.campaign_target:
            k, _, val = t.rpartition("=")
            if k and k.lower() in camp.lower():
                return float(val)
        return a.target_cpa

    n_base_days = sum(1 for i in range(a.baseline)
                      if wd_only is None or (b_start + dt.timedelta(days=i)).weekday() in wd_only)
    scale = a.recent / max(n_base_days, 1)
    R, B = window(r_start, r_end), window(b_start, b_end, base=True)
    print("\n== Account: recent window vs baseline (baseline scaled to the same number of days)")
    obs_pct = (R["conv"] - B["conv"] * scale) / (B["conv"] * scale) if B["conv"] else float("nan")
    print(f"Clicks {R['clicks']:,.0f} vs {B['clicks']*scale:,.0f} ({pct(R['clicks'], B['clicks']*scale)})")
    print(f"Cost   {cur}{R['cost']:,.2f} vs {cur}{B['cost']*scale:,.2f} ({pct(R['cost'], B['cost']*scale)})")
    print(f"Conversions as reported: {R['conv']:.1f} vs {B['conv']*scale:.1f} ({obs_pct:+.0%})")
    if curves:
        p, z, v = verdict(R, B, scale)
        if len(R["early_days"]) * 2 >= a.recent or (R["adj"] and (R["adj"] - R["conv"]) / R["adj"] >= 0.4):
            v = "TOO EARLY TO CALL (most of this window's conversions have not arrived yet)"
        lo, hi = R["adj"] - 1.645 * math.sqrt(R["var"]), R["adj"] + 1.645 * math.sqrt(R["var"])
        print(f"Conversions lag-adjusted: {R['adj']:.1f} (90% range {max(lo, R['conv']):.0f} to {hi:.0f}) vs "
              f"{B['adj']*scale:.1f} ({p:+.0%})  z={z:+.1f}  -> {v}")
        late = R["adj"] - R["conv"]
        print(f"Still to arrive for the recent window (estimate): {late:.1f} conversions "
              f"({late / R['adj']:.0%} of the final count)")
        if R["early_days"]:
            print("Too early to judge on their own: " + ", ".join(str(d) for d in sorted(R["early_days"]))
                  + f" (under {a.min_complete:.0%} complete)")
        # Settled comparison: newest week where every day is at least 90% complete.
        s_end = as_of
        while comp("__x__", s_end) < 0.9 and (as_of - s_end).days < 60:
            s_end -= dt.timedelta(days=1)
        s_start = s_end - dt.timedelta(days=a.recent - 1)
        S = window(s_start, s_end)
        s_wds = {(s_start + dt.timedelta(days=i)).weekday() for i in range(a.recent)} if a.recent < 7 else None
        sb_start = s_start - dt.timedelta(days=a.baseline)
        SB = window(sb_start, s_start - dt.timedelta(days=1), wds=s_wds)
        n_sb = sum(1 for i in range(a.baseline)
                   if s_wds is None or (sb_start + dt.timedelta(days=i)).weekday() in s_wds)
        sp, sz, sv = verdict(S, SB, a.recent / max(n_sb, 1))
        SB_scaled = SB["adj"] * a.recent / max(n_sb, 1)
        print(f"Settled check ({s_start} to {s_end}, every day >= 90% complete on the account curve): "
              f"{S['adj']:.1f} vs {SB_scaled:.1f} ({sp:+.0%}) z={sz:+.1f} -> {sv}")
    else:
        p, z, v = verdict(R, B, scale)
        print(f"Verdict on the shifted window: {p:+.0%} z={z:+.1f} -> {v}  "
              f"(newest {a.lag_days} days left out; lag not measured, so this is less certain)")
    print(why_line(R, B, scale, "lag-adjusted" if curves else "reported"))
    groups = [("All campaigns", None)]
    if a.brand:
        groups = [("Non-brand", lambda c: not re.search(a.brand, c, re.I)), ("Brand", lambda c: re.search(a.brand, c, re.I))]
    for label, keep in groups:
        g = [c for c in {r["camp"] for r in data} if keep is None or keep(c)]
        gr = sum_windows([window(r_start, r_end, c) for c in g])
        gb = sum_windows([window(b_start, b_end, c, base=True) for c in g])
        cpa = gr["cost"] / gr["adj"] if gr["adj"] else float("inf")
        bcpa = gb["cost"] / gb["adj"] if gb["adj"] else float("inf")
        t = None
        if label != "Brand" and (a.target_cpa or a.campaign_target):
            # Blend per-campaign targets by spend, so a £90 Implants target and a
            # £60 account target are both respected.
            parts = [(window(r_start, r_end, c)["cost"], tgt(c)) for c in g]
            parts = [(cst, tt) for cst, tt in parts if cst and tt]
            if parts:
                t = sum(cst for cst, _ in parts) / sum(cst / tt for cst, tt in parts)
        flag = ""
        if t:
            flag = "  OVER TARGET" if cpa > t * 1.25 else ("  on or under target" if cpa <= t else "  slightly over target")
        print(f"{label}: {'lag-adjusted' if curves else 'reported'} CPA {cur}{cpa:,.2f} (baseline {cur}{bcpa:,.2f})"
              + (f" vs target {cur}{t:,.2f} (spend-weighted from campaign targets){flag}" if t else "")
              + f"; conversions {gr['adj']:.1f} vs {gb['adj']*scale:.1f}")

    print("\n== By campaign (recent window vs baseline scaled to the same days; conversions lag-adjusted)")
    camps = sorted({r["camp"] for r in data})
    contrib = []
    for camp in camps:
        rw, bw = window(r_start, r_end, camp), window(b_start, b_end, camp, base=True)
        if not rw["clicks"] and not bw["clicks"]:
            continue
        p, z, v = verdict(rw, bw, scale)
        cz = (rw["clicks"] - bw["clicks"] * scale) / math.sqrt(max(rw["clicks"] + bw["clicks"] * scale * scale, 1))
        cpa = rw["cost"] / rw["adj"] if rw["adj"] else float("inf")
        bcpa = bw["cost"] / bw["adj"] if bw["adj"] else float("inf")
        t = tgt(camp)
        is_brand = bool(a.brand and re.search(a.brand, camp, re.I))
        state = next((r["state"] for r in data if r["camp"] == camp and r["state"]), "")
        flags = []
        if not rw["clicks"] and bw["clicks"]:
            flags.append("NO SPEND IN RECENT WINDOW (paused or stopped?)")
        if state and state.lower() not in ("enabled", "eligible"):
            flags.append(f"now {state}, past spend kept in totals")
        if t and not is_brand and rw["clicks"]:
            if cpa > t * 1.25:
                flags.append(f"CPA OVER TARGET by {cpa / t - 1:.0%}")
        if abs(cz) >= 1.96 and rw["clicks"]:
            flags.append(f"TRAFFIC {'DOWN' if cz < 0 else 'UP'} (real, z={cz:+.1f})")
        if v.startswith("LIKELY"):
            flags.append(f"CONVERSIONS {v}")
        if rw["early_days"]:
            flags.append(f"{len(rw['early_days'])} newest day(s) too early to judge")
        print(f"- {camp}{'  [brand]' if is_brand else ''}")
        print(f"    clicks {rw['clicks']:,.0f} ({pct(rw['clicks'], bw['clicks']*scale)})  cost {cur}{rw['cost']:,.2f} "
              f"({pct(rw['cost'], bw['cost']*scale)})  conv reported {rw['conv']:.1f} -> adjusted {rw['adj']:.1f} "
              f"vs {bw['adj']*scale:.1f} ({p:+.0%}, z={z:+.1f})")
        fm = lambda x: "n/a" if x == float("inf") else f"{cur}{x:,.2f}"
        print(f"    CPA adjusted {fm(cpa)} (baseline {fm(bcpa)})" + (f", target {cur}{t:,.2f}" if t and not is_brand else "")
              + (f"  conv. rate {rw['adj']/rw['clicks']:.1%} vs {bw['adj']/bw['clicks']:.1%}" if rw['clicks'] and bw['clicks'] else ""))
        print("    " + ("; ".join(flags) if flags else "no flags"))
        contrib.append((camp, rw["adj"] - bw["adj"] * scale))
    total_delta = R["adj"] - B["adj"] * scale
    print(f"\nShare of the account change (lag-adjusted {total_delta:+.1f} conversions):")
    for camp, dlt in sorted(contrib, key=lambda x: x[1]):
        share_txt = f"{dlt / total_delta:.0%}" if total_delta else "-"
        print(f"  {camp:<44} {dlt:+6.1f}  ({share_txt})")

    if cm["isb"] or cm["isr"]:
        print("\n== Search impression share, recent vs baseline (impression-weighted)")
        for camp in camps:
            line = is_line(data, camp, r_start, r_end, b_start, b_end)
            if line:
                print(f"  {camp[:44]:<44} {line}")

    print("\nNotes: z beyond +/-1.96 means a change this big would happen by chance about 1 time in 20 or less. "
          "Lag-adjusted numbers are estimates from this account's own history, not Google's figures.")


def is_line(data, camp, rs, re_, bs, be):
    out, flagged = [], 0
    for (s, e) in ((bs, be), (rs, re_)):
        elig = lb = lr = 0.0
        for r in data:
            if r["camp"] != camp or not (s <= r["day"] <= e):
                continue
            v, f = r["is_"]
            if v is None or f or not r["impr"]:
                if f:
                    flagged += 1
                continue
            el = r["impr"] / v if v else 0
            elig += el
            lb += el * (r["isb"][0] or 0)
            lr += el * (r["isr"][0] or 0)
        out.append((lb / elig, lr / elig) if elig else None)
    if out[0] is None and out[1] is None:
        return "IS shown as a bound (e.g. '> 90%' or '< 10%') on every day; not averaged" if flagged else ""
    f = lambda x: "n/a" if x is None else f"budget {x[0]:.0%}, rank {x[1]:.0%}"
    note = f"  ({flagged} bound values like '< 10%' skipped)" if flagged else ""
    return f"lost IS baseline {f(out[0])} -> recent {f(out[1])}{note}"


def sum_windows(ws):
    out = dict(clicks=0.0, cost=0.0, conv=0.0, adj=0.0, var=0.0)
    for w in ws:
        for k in out:
            out[k] += w[k]
    return out


def why_line(R, B, scale, label):
    """Plain words: did traffic or conversion rate move?"""
    if not (R["clicks"] and B["clicks"] and B["adj"]):
        return "Why: not enough data to split traffic from conversion rate."
    ch = R["clicks"] / (B["clicks"] * scale) - 1
    cr_r, cr_b = R["adj"] / R["clicks"], B["adj"] / B["clicks"]
    cr = cr_r / cr_b - 1
    main = "traffic" if abs(ch) > abs(cr) else "conversion rate"
    return (f"Why: clicks {ch:+.0%}, {label} conversion rate {cr:+.0%} ({cr_r:.1%} vs {cr_b:.1%}); "
            f"the change is mostly {main}.")


def pct(a, b):
    return f"{(a - b) / b:+.0%}" if b else "n/a"


def read_meta(path):
    from gads_io import read_text
    return read_text(path).splitlines()[:3]


def parse_meta_dates(lines):
    out = []
    for l in lines:
        parts = re.split(r"\s+-\s+|\s+to\s+", l.replace('"', ""))
        if len(parts) == 2:
            d = parse_date(parts[1].strip())
            if d:
                out.append(d)
    return out


if __name__ == "__main__":
    main()
