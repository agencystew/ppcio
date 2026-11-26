#!/usr/bin/env python3
"""Why did performance change? Line up the change history with the day the numbers moved.

Usage:
  python change_detective.py --daily daily.csv --changes change_history.csv
         [--lag days_to_conversion.csv | --settle-days 7] [--window 42]
         [--campaign "Invisalign"] [--target-cpa 60]

--daily    Campaign report segmented by Day (Day, Campaign, Clicks, Cost,
           Conversions; Impr. and Search lost IS columns used if present).
--changes  Change history download (Date & time, User, Campaign, Ad group,
           Changes) or Google Ads MCP change_event rows.
--lag      Days to conversion export. Conversions are only judged on days
           that are at least 90% complete. Clicks and cost have no lag and
           use every day.

What it does:
1. Finds the day each campaign's clicks, cost, CPC, conversion rate or
   conversions shifted most (a mean-shift test on weekday-adjusted daily
   values; needs 5+ days each side).
2. Classifies every change (budget, bidding, status, keywords, negatives,
   ads and assets, targeting, conversion settings, auto-applied
   recommendations) and reads "from X to Y" sizes.
3. Ranks the changes that could explain each shift by timing, scope and
   whether that kind of change moves that metric.
4. Shows 7 days before vs 7 days after every important change.
A change before a shift is a suspect, not proof. Seasons, competitors,
tracking and Google-side changes move numbers too.
"""
import argparse
import collections
import datetime as dt
import math
import re
import statistics
import sys

from gads_io import load_table, num, share, parse_date, guess_dayfirst, currency_of

DAILY = {
    "day": ["Day", "Date", "segments.date"],
    "campaign": ["Campaign", "campaign.name"],
    "state": ["Campaign state", "Campaign status", "Status", "campaign.status"],
    "impr": ["Impr.", "Impressions", "metrics.impressions"],
    "clicks": ["Clicks", "metrics.clicks"],
    "cost": ["Cost", "metrics.cost"],
    "cost_micros": ["metrics.cost_micros"],
    "conv": ["Conversions", "Conv.", "metrics.conversions"],
    "isb": ["Search lost IS (budget)", "metrics.search_budget_lost_impression_share"],
    "isr": ["Search lost IS (rank)", "metrics.search_rank_lost_impression_share"],
}
CHANGES = {
    "when": ["Date & time", "Date and time", "Date", "change_event.change_date_time"],
    "user": ["User", "change_event.user_email"],
    "client": ["Tool", "Client", "change_event.client_type"],
    "campaign": ["Campaign", "campaign.name", "change_event.campaign"],
    "adgroup": ["Ad group", "ad_group.name", "change_event.ad_group"],
    "what": ["Changes", "Change", "Details", "change_event.changed_fields"],
    "rtype": ["Item changed", "Change type", "change_event.change_resource_type"],
    "op": ["change_event.resource_change_operation"],
}

# Which metrics each change type plausibly moves (1 = strong, 0.5 = possible).
PLAUSIBLE = {
    "status":      {"clicks": 1, "cost": 1, "conv": 1, "cpc": .3, "cvr": .3},
    "budget":      {"clicks": 1, "cost": 1, "conv": .7, "cpc": .5, "cvr": .2, "isb": 1},
    "bidding":     {"clicks": 1, "cost": 1, "cpc": 1, "conv": .7, "cvr": .5, "isr": 1},
    "keywords":    {"clicks": 1, "cost": 1, "cvr": 1, "conv": .7, "cpc": .7},
    "auto-applied": {"clicks": 1, "cost": 1, "cvr": 1, "conv": .7, "cpc": .7},
    "negatives":   {"clicks": .5, "cost": .5, "cvr": .5, "conv": .3},
    "targeting":   {"clicks": 1, "cost": 1, "cvr": .7, "conv": .7, "cpc": .5},
    "ads/assets":  {"cvr": .5, "clicks": .3, "conv": .3, "isr": .3},
    "conversion settings": {"conv": 1, "cvr": 1},
    "other":       {"clicks": .3, "cost": .3, "conv": .3, "cpc": .3, "cvr": .3},
}
IMPORTANT = {"status", "budget", "bidding", "keywords", "auto-applied", "targeting", "conversion settings"}


def classify(text, user, client, rtype):
    t = f"{text} {rtype}".lower()
    who = f"{user} {client}".lower()
    if re.search(r"auto.?appl|recommendations?(_subscription)?\b|google_ads_recommendations", who):
        base = "auto-applied"
    elif re.search(r"conversion (action|goal)|primary|secondary|conversion_action|customer_conversion_goal|attribution", t):
        base = "conversion settings"
    elif re.search(r"status|paused|enabled|removed|\bpause\b", t):
        base = "status"
    elif re.search(r"budget|campaign_budget", t):
        base = "budget"
    elif re.search(r"bid strategy|target cpa|target roas|tcpa|troas|max(imum)? cpc|bid adjust|bidding|maximi[sz]e", t):
        base = "bidding"
    elif re.search(r"negative", t):
        base = "negatives"
    elif re.search(r"keyword|ad_group_criterion", t):
        base = "keywords"
    elif re.search(r"location|radius|schedule|audience|device|language|geo|campaign_criterion", t):
        base = "targeting"
    elif re.search(r"\bad\b|ads\b|headline|description|sitelink|callout|asset|image|responsive", t):
        base = "ads/assets"
    else:
        base = "other"
    return base


def size_of(text):
    m = re.search(r"from\s+[^\d\-]*([\d,]+(?:\.\d+)?)\S*\s+to\s+[^\d\-]*([\d,]+(?:\.\d+)?)", text, re.I)
    if not m:
        return None
    a, b = num(m[1]), num(m[2])
    return (b - a) / a if a else None


def parse_when(s):
    d = parse_date(s)
    if not d:
        return None, None
    m = re.search(r"(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?", s.split(",")[-1] if "," in s else s)
    hour = None
    if m:
        hour = int(m[1]) % 12 + (12 if (m[3] or "").lower() == "pm" else 0) if m[3] else int(m[1])
    return d, hour


def mean_shift(series, min_side=5):
    """Best single breakpoint. series: list of (date, value). Returns dict or None."""
    vals = [v for _, v in series]
    n = len(vals)
    if n < 2 * min_side:
        return None
    best = None
    for k in range(min_side, n - min_side + 1):
        a, b = vals[:k], vals[k:]
        ma, mb = statistics.mean(a), statistics.mean(b)
        sse = sum((x - ma) ** 2 for x in a) + sum((x - mb) ** 2 for x in b)
        if best is None or sse < best[0]:
            best = (sse, k, ma, mb)
    sse, k, ma, mb = best
    sd = math.sqrt(sse / max(n - 2, 1)) or 1e-9
    t = (mb - ma) / (sd * math.sqrt(1 / k + 1 / (n - k)))
    return dict(date=series[k][0], before=ma, after=mb, t=t,
                pct=(mb - ma) / ma if ma else float("inf"), n_before=k, n_after=n - k)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--daily", required=True)
    ap.add_argument("--changes", required=True)
    ap.add_argument("--lag")
    ap.add_argument("--settle-days", type=int, default=None,
                    help="without --lag: conversions on the newest N days are ignored")
    ap.add_argument("--window", type=int, default=42, help="days analysed, ending on the newest day")
    ap.add_argument("--campaign", help="only campaigns whose name contains this text")
    ap.add_argument("--target-cpa", type=float, help="adds CPA vs target to before/after lines")
    ap.add_argument("--campaign-target", action="append", default=[],
                    help='"text in campaign name=CPA", e.g. "Implants=90"')
    ap.add_argument("--min-pct", type=float, default=0.15,
                    help="smallest shift worth reporting (a setting; confirm with the user)")
    ap.add_argument("--min-t", type=float, default=3.0,
                    help="smallest shift strength worth reporting (a setting)")
    a = ap.parse_args()
    if not a.lag and a.settle_days is None:
        sys.exit("Give --lag (Days to conversion export) or --settle-days N. Conversions on recent days are "
                 "incomplete and would look like a drop.")

    _, cm, rows, _ = load_table(a.daily, ["day", "campaign", "clicks", "conv"], DAILY)
    df = guess_dayfirst([r[cm["day"]] for r in rows])
    cur = currency_of(rows, [cm["cost"]])
    data = collections.defaultdict(dict)
    for r in rows:
        d = parse_date(r[cm["day"]], df)
        if not d:
            continue
        camp = r[cm["campaign"]]
        if a.campaign and a.campaign.lower() not in camp.lower():
            continue
        cost = num(r[cm["cost"]]) if cm["cost"] else num(r.get(cm["cost_micros"])) / 1e6
        data[camp][d] = dict(clicks=num(r[cm["clicks"]]), cost=cost, conv=num(r[cm["conv"]]),
                             isb=share(r.get(cm["isb"]))[0] if cm["isb"] else None,
                             isr=share(r.get(cm["isr"]))[0] if cm["isr"] else None)
    if not data:
        sys.exit("No campaign rows read (check --campaign).")
    last = max(max(v) for v in data.values())
    start = last - dt.timedelta(days=a.window - 1)

    curves, curve_for = None, {}
    if a.lag:
        curves = lagcurve.build_curves(a.lag)
        acct = curves["__account__"]
        for camp in data:
            c = curves.get(camp)
            curve_for[camp] = c if c and sum(c.values()) >= 30 else acct
        # Conversions are lag-adjusted on days at least 50% complete (per campaign curve);
        # newer days are left out of conversion metrics.
        settled_until = last
        while lagcurve.completeness(acct, (last - settled_until).days) < 0.5:
            settled_until -= dt.timedelta(days=1)
        for camp in data:
            for d, v in data[camp].items():
                c = lagcurve.completeness(curve_for[camp], (last - d).days)
                v["comp"] = c
                v["conv_adj"] = v["conv"] / c if c >= 0.5 else None
        print(f"Window: {start} to {last}. Conversions are lag-adjusted with each campaign's own curve and "
              f"used on days at least 50% complete; clicks and cost use every day.")
    else:
        settled_until = last - dt.timedelta(days=a.settle_days)
        for camp in data:
            for d, v in data[camp].items():
                v["conv_adj"] = v["conv"] if d <= settled_until else None
        print(f"Window: {start} to {last}. Conversions judged up to {settled_until} (newest "
              f"{a.settle_days} days left out, lag not measured); clicks and cost use every day.")

    # Changes
    _, cc, crow, _ = load_table(a.changes, ["when", "what"], CHANGES)
    changes = []
    for r in crow:
        d, hour = parse_when(r[cc["when"]])
        if not d:
            continue
        text = r.get(cc["what"], "")
        user = r.get(cc["user"], "") if cc["user"] else ""
        client = r.get(cc["client"], "") if cc["client"] else ""
        rtype = r.get(cc["rtype"], "") if cc["rtype"] else ""
        camp = (r.get(cc["campaign"], "") if cc["campaign"] else "").strip()
        if camp in ("--", "-"):
            camp = ""
        kind = classify(text, user, client, rtype)
        changes.append(dict(date=d, hour=hour, user=user or client, camp=camp, text=text, kind=kind,
                            size=size_of(text), first_day=d + dt.timedelta(days=1) if hour is not None and hour >= 12 else d))
    changes.sort(key=lambda c: (c["date"], c["hour"] or 0))
    grouped = []
    for c in changes:
        g = grouped[-1] if grouped else None
        if g and (g["date"], g["hour"], g["camp"], g["kind"], g["user"]) == (c["date"], c["hour"], c["camp"], c["kind"], c["user"]):
            g["n"] += 1
            g["texts"].append(c["text"])
            continue
        c["n"], c["texts"] = 1, [c["text"]]
        grouped.append(c)
    for g in grouped:
        if g["n"] > 1:
            g["text"] = f"{g['n']} changes: " + "; ".join(t[:45] for t in g["texts"][:4]) + ("; ..." if g["n"] > 4 else "")
    changes = grouped
    if a.campaign:
        changes = [c for c in changes if not c["camp"] or a.campaign.lower() in c["camp"].lower()]
    print(f"Changes read: {len(changes)} ({collections.Counter(c['kind'] for c in changes).most_common()})")

    # Weekday index from the 8 weeks before the window (falls back to the window itself).
    def weekday_index(camp, key):
        ref = [(d, v[key]) for d, v in data[camp].items() if start - dt.timedelta(days=56) <= d < start]
        if len(ref) < 28:
            ref = [(d, v[key]) for d, v in data[camp].items() if d <= settled_until]
        by = collections.defaultdict(list)
        for d, v in ref:
            by[d.weekday()].append(v)
        overall = statistics.mean([v for _, v in ref]) if ref else 0
        return {w: (statistics.mean(by[w]) / overall if by[w] and overall else 1.0) for w in range(7)}

    def series(camp, metric):
        out = []
        idx_c = weekday_index(camp, "clicks")
        d = start
        while d <= last:
            v = data[camp].get(d, dict(clicks=0, cost=0, conv=0, conv_adj=0, isb=None, isr=None))
            if metric in ("conv", "cvr") and v.get("conv_adj") is None:
                d += dt.timedelta(days=1)
                continue
            w = idx_c.get(d.weekday(), 1.0) or 1.0
            if metric == "clicks":
                out.append((d, v["clicks"] / w))
            elif metric == "cost":
                out.append((d, v["cost"] / w))
            elif metric == "conv":
                out.append((d, v["conv_adj"] / w))
            elif metric == "cpc":
                if v["clicks"]:
                    out.append((d, v["cost"] / v["clicks"]))
            elif metric == "cvr":
                if v["clicks"]:
                    out.append((d, v["conv_adj"] / v["clicks"]))
            elif metric in ("isb", "isr"):
                if v[metric] is not None:
                    out.append((d, v[metric]))
            d += dt.timedelta(days=1)
        return out

    shifts = []
    print("\n== Where the numbers moved (weekday-adjusted; strongest shift per metric)")
    for camp in sorted(data):
        found = []
        for metric in ("clicks", "cost", "cpc", "cvr", "conv", "isb", "isr"):
            ms = mean_shift(series(camp, metric))
            if not ms:
                continue
            big = abs(ms["pct"]) >= a.min_pct if metric not in ("isb", "isr") else abs(ms["after"] - ms["before"]) >= 0.08
            if big and abs(ms["t"]) >= a.min_t:
                ms.update(camp=camp, metric=metric)
                found.append(ms)
                shifts.append(ms)
        if found:
            print(f"- {camp}")
            for s in found:
                print("    " + fmt_shift(s, cur))
        else:
            print(f"- {camp}: no clear shift in the window")

    print("\n== Suspects, campaign by campaign (changes from 1 day after to 7 days before each shift)")
    by_camp = collections.defaultdict(list)
    for sh in shifts:
        by_camp[sh["camp"]].append(sh)
    for camp, shs in sorted(by_camp.items(), key=lambda kv: -max(abs(x["t"]) for x in kv[1])):
        print(f"* {camp}")
        for sh in sorted(shs, key=lambda x: x["date"]):
            print(f"    moved: {fmt_shift(sh, cur)}")
        scores = {}
        for sh in shs:
            for c in changes:
                if c["camp"] and c["camp"] != camp:
                    continue
                gap = (sh["date"] - c["first_day"]).days
                if not -1 <= gap <= 7:
                    continue
                timing = 1.0 if gap in (-1, 0, 1) else (0.8 if gap <= 3 else 0.5)
                scope = 1.0 if c["camp"] else 0.7
                fit = PLAUSIBLE.get(c["kind"], {}).get(sh["metric"], 0.1)
                key = id(c)
                sc = timing * scope * fit
                if key not in scores or sc > scores[key][0]:
                    scores[key] = (sc, c, [])
                scores[key][2].append(sh["metric"])
        cands = sorted(scores.values(), key=lambda x: -x[0])
        if not cands:
            print("    No change in the history lines up. Check: tracking (conversion action split), landing page, "
                  "season or news, competitors (Auction insights), Google-side changes, or changes made before "
                  "this history starts.")
            continue
        top = cands[0][0]
        for sc, c, mets in cands[:4]:
            when = f"{c['date']}" + (f" {c['hour']:02d}h" if c["hour"] is not None else "")
            size = f" ({c['size']:+.0%})" if c["size"] is not None else ""
            print(f"    suspect {sc:.2f}  {when}  [{c['kind']}]{size} {c['text'][:110]}  by {c['user'] or 'unknown'}"
                  f"  (fits: {', '.join(sorted(set(mets)))})")
        close = [x for x in cands if x[0] >= top * 0.6]
        if len({(x[1]['date'], x[1]['kind']) for x in close}) > 1:
            print("    Note: more than one plausible change at about the same time; the numbers alone cannot "
                  "separate them. Use which metrics moved as the clue.")
        same_day_other = [x for x in cands if x[0] < top * 0.6 and x[1]["date"] == cands[0][1]["date"]]
        if same_day_other:
            print("    Same day, weaker fit: " + "; ".join(f"[{x[1]['kind']}] {x[1]['text'][:50]}" for x in same_day_other))

    print("\n== Before vs after each important change (7 days each side, change day left out)")
    for c in changes:
        if c["kind"] not in IMPORTANT:
            continue
        camps = [c["camp"]] if c["camp"] in data else (list(data) if not c["camp"] else [])
        if not camps:
            print(f"- {c['date']} [{c['kind']}] {c['text'][:70]}: campaign not in the daily report")
            continue
        # 7 full days before the change day and 7 after it; the change day is left out.
        b_s, b_e = c["date"] - dt.timedelta(days=7), c["date"] - dt.timedelta(days=1)
        a_s = c["date"] + dt.timedelta(days=1)
        af_end = min(c["date"] + dt.timedelta(days=7), last)
        b = agg(data, camps, b_s, b_e)
        af = agg(data, camps, a_s, af_end)
        nb, na = 7, (af_end - a_s).days + 1
        if na <= 0:
            continue
        conv_after = agg(data, camps, a_s, min(af_end, settled_until))
        nconv = (min(af_end, settled_until) - a_s).days + 1
        label = c["camp"] or "whole account"
        line = (f"- {c['date']} [{c['kind']}] {label}: {c['text'][:70]}\n"
                f"    per day: clicks {b['clicks']/nb:.1f} -> {af['clicks']/na:.1f} ({pc(af['clicks']/na, b['clicks']/nb)}), "
                f"cost {cur}{b['cost']/nb:,.2f} -> {cur}{af['cost']/na:,.2f} ({pc(af['cost']/na, b['cost']/nb)})")
        if nconv >= 3:
            line += (f", conv {b['conv_adj']/nb:.2f} -> {conv_after['conv_adj']/nconv:.2f} "
                     f"({pc(conv_after['conv_adj']/nconv, b['conv_adj']/nb)}, {nconv} days{', lag-adjusted' if curves else ''})")
            tgt = a.target_cpa
            for t in a.campaign_target:
                k, _, val = t.rpartition("=")
                if k and c["camp"] and k.lower() in c["camp"].lower():
                    tgt = float(val)
            if "brand" in (c["camp"] or "").lower():
                tgt = None
            if tgt and conv_after["conv_adj"]:
                cpa_b = b["cost"] / b["conv_adj"] if b["conv_adj"] else float("inf")
                cpa_a = conv_after["cost"] / conv_after["conv_adj"]
                line += f", CPA {cur}{cpa_b:,.2f} -> {cur}{cpa_a:,.2f} (target {cur}{tgt:,.2f})"
        else:
            line += ", conversions: too recent to judge"
        if na < 7:
            line += f"  [only {na} days after]"
        if nconv >= 3 and (nconv < 7 or conv_after["conv_adj"] < 10):
            line += "  [conversion change based on too few days or conversions to judge]"
        print(line)

    print("\nRead this as suspects, not proof. Two changes on the same day cannot be separated from the numbers; "
          "say so instead of picking one.")


def agg(data, camps, s, e):
    out = dict(clicks=0.0, cost=0.0, conv=0.0, conv_adj=0.0)
    for camp in camps:
        for d, v in data[camp].items():
            if s <= d <= e:
                for k in ("clicks", "cost", "conv"):
                    out[k] += v[k]
                out["conv_adj"] += v["conv_adj"] if v.get("conv_adj") is not None else 0
    return out


def pc(a, b):
    return f"{(a - b) / b:+.0%}" if b else "n/a"


def fmt_shift(s, cur):
    m = s["metric"]
    if m in ("isb", "isr"):
        name = "lost IS (budget)" if m == "isb" else "lost IS (rank)"
        return (f"{name} from {s['date']}: {s['before']:.0%} -> {s['after']:.0%} "
                f"(strength {abs(s['t']):.1f}, {s['n_before']} days before / {s['n_after']} after)")
    names = dict(clicks="clicks/day", cost="cost/day", cpc="CPC", cvr="conversion rate", conv="conversions/day")
    if m == "cvr":
        vals = f"{s['before']:.1%} -> {s['after']:.1%}"
    elif m in ("cost", "cpc"):
        vals = f"{cur}{s['before']:,.2f} -> {cur}{s['after']:,.2f}"
    else:
        vals = f"{s['before']:.1f} -> {s['after']:.1f}"
    return (f"{names[m]} from {s['date']}: {vals} ({s['pct']:+.0%}, strength {abs(s['t']):.1f}, "
            f"{s['n_before']} days before / {s['n_after']} after)")


import lagcurve  # noqa: E402

if __name__ == "__main__":
    main()
