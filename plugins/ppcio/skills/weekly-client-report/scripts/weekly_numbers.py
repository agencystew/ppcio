#!/usr/bin/env python3
"""The numbers for a weekly client update, done exactly, so the words can be simple.

Usage:
  python weekly_numbers.py --daily daily.csv [--lag days_to_conversion.csv]
         [--changes change_history.csv] [--budget 9000] [--week-start 2026-11-09]
         [--brand "Brand"] [--target-cpa 60] [--campaign-target "Implants=90"]

Gives: last full week (Mon-Sun by default) vs the week before vs the 4 weeks
before that, for the account, non-brand, brand and each campaign (paused
campaigns stay in: status is today's status); how many conversions are
probably still to arrive for the week (needs --lag); month-to-date pacing
against the monthly budget; the week's changes from the change history.
"""
import argparse
import calendar
import collections
import datetime as dt
import re
import sys

from gads_io import load_table, num, parse_date, guess_dayfirst, currency_of, check_totals
import lagcurve

DAILY = {
    "day": ["Day", "Date", "segments.date"],
    "campaign": ["Campaign", "campaign.name"],
    "state": ["Campaign state", "Campaign status", "Status", "campaign.status"],
    "clicks": ["Clicks", "metrics.clicks"],
    "impr": ["Impr.", "Impressions", "metrics.impressions"],
    "cost": ["Cost", "metrics.cost"],
    "cost_micros": ["metrics.cost_micros"],
    "conv": ["Conversions", "Conv.", "metrics.conversions"],
    "value": ["Conv. value", "Conversion value", "metrics.conversions_value"],
}
CHANGES = {
    "when": ["Date & time", "Date and time", "Date", "change_event.change_date_time"],
    "user": ["User", "change_event.user_email"],
    "client": ["change_event.client_type"],
    "campaign": ["Campaign", "campaign.name"],
    "what": ["Changes", "Change", "change_event.changed_fields"],
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--daily", required=True)
    ap.add_argument("--lag")
    ap.add_argument("--changes")
    ap.add_argument("--budget", type=float, help="monthly Google Ads budget")
    ap.add_argument("--week-start", help="Monday of the week to report (default: last full Mon-Sun week)")
    ap.add_argument("--brand")
    ap.add_argument("--target-cpa", type=float)
    ap.add_argument("--campaign-target", action="append", default=[])
    a = ap.parse_args()

    meta, cm, rows, totals = load_table(a.daily, ["day", "campaign", "clicks", "conv"], DAILY)
    df = guess_dayfirst([r[cm["day"]] for r in rows])
    cur = currency_of(rows, [cm["cost"]])
    data = []
    for r in rows:
        d = parse_date(r[cm["day"]], df)
        if not d:
            continue
        cost = num(r[cm["cost"]]) if cm["cost"] else num(r[cm["cost_micros"]]) / 1e6
        data.append(dict(day=d, camp=r[cm["campaign"]], state=(r.get(cm["state"]) or "") if cm["state"] else "",
                         clicks=num(r[cm["clicks"]]), cost=cost, conv=num(r[cm["conv"]]),
                         value=num(r.get(cm["value"])) if cm["value"] else 0))
    last = max(r["day"] for r in data)
    if a.week_start:
        ws = dt.date.fromisoformat(a.week_start)
    else:
        ws = last - dt.timedelta(days=last.weekday())         # Monday of the newest week
        if last - ws < dt.timedelta(days=6):
            ws -= dt.timedelta(days=7)                        # that week is not complete
    we = ws + dt.timedelta(days=6)
    if we > last:
        print(f"WARNING: the report week ends {we} but data ends {last}; the week is incomplete.")
    pws, pwe = ws - dt.timedelta(days=7), ws - dt.timedelta(days=1)
    bs, be = ws - dt.timedelta(days=35), ws - dt.timedelta(days=8)

    print(f"Report week: {ws:%a %d %b} - {we:%a %d %b %Y}. Week before: {pws:%d %b} - {pwe:%d %b}. "
          f"4-week average: {bs:%d %b} - {be:%d %b}. Data to {last}.")
    for line in check_totals(rows, totals, cm, ["clicks", "cost", "conv"]):
        print(f"Totals check: {line}")
    paused = sorted({r["camp"] for r in data if r["state"] and r["state"].lower() not in ("enabled", "eligible")})
    if paused:
        print("Not enabled today (still counted for the days they ran): " + "; ".join(paused))

    curves = lagcurve.build_curves(a.lag) if a.lag else None

    def comp(camp, d):
        if not curves:
            return 1.0
        c = curves.get(camp)
        c = c if c and sum(c.values()) >= 30 else curves["__account__"]
        return lagcurve.completeness(c, (last - d).days)

    def tgt(camp):
        for t in a.campaign_target:
            k, _, v = t.rpartition("=")
            if k and k.lower() in camp.lower():
                return float(v)
        return a.target_cpa

    def agg(s, e, keep=lambda c: True):
        o = dict(clicks=0.0, cost=0.0, conv=0.0, value=0.0, adj=0.0)
        for r in data:
            if s <= r["day"] <= e and keep(r["camp"]):
                for k in ("clicks", "cost", "conv", "value"):
                    o[k] += r[k]
                o["adj"] += r["conv"] / max(comp(r["camp"], r["day"]), 0.2)
        return o

    is_brand = (lambda c: bool(re.search(a.brand, c, re.I))) if a.brand else (lambda c: False)
    groups = [("Account", lambda c: True)]
    if a.brand:
        groups += [("Non-brand", lambda c: not is_brand(c)), ("Brand", is_brand)]
    camps = sorted({r["camp"] for r in data})
    groups += [(c, (lambda cc: (lambda x: x == cc))(c)) for c in camps]

    print("\n== Week vs week (conversions: as reported now; 'final est.' adds conversions still to arrive)")
    for name, keep in groups:
        w, p, b = agg(ws, we, keep), agg(pws, pwe, keep), agg(bs, be, keep)
        if not (w["clicks"] or p["clicks"] or b["clicks"]):
            continue
        b4 = {k: v / 4 for k, v in b.items()}
        cpa = lambda x: x["cost"] / x["conv"] if x["conv"] else None
        cpa_adj = w["cost"] / w["adj"] if w["adj"] else None
        if name == "Non-brand":
            t = blended_target(data, ws, we, tgt, is_brand)
        elif name in ("Account", "Brand") or is_brand(name):
            t = None
        else:
            t = tgt(name)
        print(f"- {name}")
        print(f"    spend {cur}{w['cost']:,.2f} (week before {cur}{p['cost']:,.2f}, {pc(w['cost'], p['cost'])}; "
              f"4-wk avg {cur}{b4['cost']:,.2f})  clicks {w['clicks']:,.0f} ({pc(w['clicks'], p['clicks'])})")
        if curves:
            line = (f"    conversions so far {w['conv']:.1f}, final est. {w['adj']:.1f} | week before so far "
                    f"{p['conv']:.1f}, final est. {p['adj']:.1f} | change on final est. {pc(w['adj'], p['adj'])} | "
                    f"4-wk avg final est. {b4['adj']:.1f}")
        else:
            line = (f"    conversions {w['conv']:.1f} vs {p['conv']:.1f} week before ({pc(w['conv'], p['conv'])}; "
                    f"recent days still rising) | 4-wk avg {b4['conv']:.1f}")
        print(line)
        cp = cpa_adj if curves else cpa(w)
        cpp = (p["cost"] / p["adj"] if p["adj"] else None) if curves else cpa(p)
        if cp is not None:
            print(f"    cost per conversion {cur}{cp:,.2f}" + (f" (week before {cur}{cpp:,.2f})" if cpp else "")
                  + (f" vs target {cur}{t:,.2f}{' -> OVER' if cp > t * 1.1 else (' -> on target' if cp <= t else ' -> slightly over')}" if t else ""))
        elif w["cost"]:
            print(f"    cost per conversion: no conversions yet this week")
        if w["value"]:
            print(f"    conversion value {cur}{w['value']:,.2f} (ROAS {w['value'] / w['cost']:.2f})")
        if not w["clicks"] and p["clicks"]:
            print("    no activity this week (paused or stopped)")

    if curves:
        w = agg(ws, we)
        print(f"\nStill to arrive for the report week (estimate from this account's lag history): "
              f"{w['adj'] - w['conv']:.1f} conversions. Say it plainly: 'bookings from the last few days are still "
              f"coming in'.")
    else:
        print("\nNo lag file: say that the most recent days' conversions may still rise.")

    if a.budget:
        ms = last.replace(day=1)
        dim = calendar.monthrange(last.year, last.month)[1]
        spent = agg(ms, last)["cost"]
        elapsed = last.day
        expected = a.budget * elapsed / dim
        proj = spent / elapsed * dim
        pace = spent / expected if expected else 0
        need = (a.budget - spent) / (dim - elapsed) if dim > elapsed else 0
        status = "on pace" if 0.9 <= pace <= 1.1 else ("under-pacing" if pace < 0.9 else "over-pacing")
        print(f"\n== Budget pacing {last:%B %Y}: spent {cur}{spent:,.2f} of {cur}{a.budget:,.2f} after {elapsed} of {dim} days "
              f"(expected {cur}{expected:,.2f}) -> {pace:.1%}, {status}. Projected month end {cur}{proj:,.2f}. "
              f"To land on budget: {cur}{need:,.2f} a day for the rest of the month.")
        print("   (Google can spend up to 2x the average daily budget on a day, but no more than 30.4x it in a "
              "month: support.google.com/google-ads/answer/6385083. Pace band 90-110% is a PPC.io setting.)")

    if a.changes:
        _, cc, crow, _ = load_table(a.changes, ["when", "what"], CHANGES)
        print(f"\n== Changes in the report week and the week before ({pws:%d %b} - {we:%d %b})")
        items = collections.OrderedDict()
        for r in crow:
            d = parse_date(r[cc["when"]])
            if not d or not (pws <= d <= we):
                continue
            who = (r.get(cc["user"]) if cc["user"] else "") or (r.get(cc["client"]) if cc["client"] else "") or "unknown"
            camp = (r.get(cc["campaign"]) if cc["campaign"] else "") or ""
            key = (d, who, camp)
            items.setdefault(key, []).append(r.get(cc["what"], ""))
        for (d, who, camp), whats in sorted(items.items()):
            auto = " [AUTO-APPLIED by Google]" if re.search(r"auto.?appl|recommendation", who, re.I) else ""
            print(f"   {d:%a %d %b}  {camp or 'account'}  {who}{auto}: " + "; ".join(x[:70] for x in whats))


def blended_target(data, ws, we, tgt, is_brand):
    parts = collections.defaultdict(float)
    for r in data:
        if ws <= r["day"] <= we and not is_brand(r["camp"]):
            parts[r["camp"]] += r["cost"]
    p = [(c, t) for c, t in ((v, tgt(k)) for k, v in parts.items()) if c and t]
    return sum(c for c, _ in p) / sum(c / t for c, t in p) if p else None


def pc(a, b):
    if not b:
        return "n/a"
    v = (a - b) / b
    return "0%" if abs(v) < 0.005 else f"{v:+.0%}"


if __name__ == "__main__":
    main()
