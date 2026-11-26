---
name: conversion-lag-check
description: Checks whether a recent Google Ads conversion drop is real or just conversions that have not arrived yet, using the account's own Days to conversion history, then finds which campaigns and which lever (traffic or conversion rate) moved. Use when someone says leads, sales or conversions are down this week, asks "is this a real drop", "why are conversions low", "did something break", or before judging the last few days of performance. Not for finding which change caused a drop (use change-detective) or writing a client update (use weekly-client-report).
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.2.0"
---

# Conversion lag check

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

Google dates a conversion by the day of the click, not the day it
happened. So the last few days always look worse than they will end up.
People pause campaigns, cut bids and send panicked client emails over
conversions that simply have not arrived yet. This skill measures how
late this account's conversions usually arrive, estimates the final
numbers, and only then asks what really changed.

## Step 0: account profile
Read [references/account-profile.md](references/account-profile.md) when
no profile is in the chat or project. Fields needed here: currency,
counted conversion, targets (account and per campaign). If a target is
missing, ask for it once. Without a target the skill can still say
whether volume changed, but not whether performance is good or bad.

## Inputs
Ask for these two exports if they are not attached:
1. Daily campaign report: Campaigns view, Segment > Time > Day (or
   Reports > Report editor with Day and Campaign as rows if the table
   will not segment that range by day). Date range: last 60 to 90 days up
   to yesterday. Columns: Campaign, Campaign state, Impr., Clicks, Cost,
   Conversions, Conv. value, Search impr. share, Search lost IS (budget),
   Search lost IS (rank). Download as CSV.
2. Days to conversion report: Campaigns view, Segment > Conversions >
   Days to conversion. Date range: 90 days ending at least 30 days ago.
   Google says to end it that early "to make sure the report has
   complete conversion data". Clicks and Cost show "--" in this view;
   that is normal.

Live data instead of CSVs: see
[references/mcp-queries.md](references/mcp-queries.md) (read when the
Google Ads MCP tools are connected).

If something is missing:
- No Days to conversion report and the user cannot get it: ask how many
  days most conversions take. Run with `--lag-days N`, which leaves those
  days out instead of estimating them. If they do not know, use 7 and
  label every conclusion "lag assumed, not measured".
- Fewer than 35 days of daily data: say the baseline is too short; only
  report as-reported numbers with a lag warning.
- Under 20 conversions in the recent window across the account: say the
  sample is too small for a verdict and give numbers only.

## Workflow
1. Run the script (it handles header rows, "Total" rows, currency signs,
   "< 10%" values and paused campaigns):
   `python scripts/lag_check.py --daily <daily.csv> --lag <lag.csv> --target-cpa <CPA> --brand "<brand campaign pattern>" [--campaign-target "Implants=90"]`
   Always pass `--brand` when the account has brand campaigns. Why: cheap
   brand conversions hide non-brand problems (in testing, brand made a
   £74 non-brand CPA look like £29 for the account).
2. Read the account block first. Compare "as reported" with
   "lag-adjusted". The gap is the part of the drop that is just lag. The
   method and Google's own words on timing are in
   [references/lag-facts.md](references/lag-facts.md) (read when the user
   asks why, or doubts the adjustment).
   Then read the non-brand CPA line against the target.
3. Read the verdict. LIKELY REAL means a change this size would happen by
   chance about 1 time in 20 or less. WITHIN NORMAL NOISE means do not act
   on conversions alone yet. TOO EARLY TO CALL means most of the window's
   conversions are still to come (the script says this for windows under
   a week that are mostly unsettled, and compares same weekdays only).
4. Check the settled line. It repeats the comparison on the newest week
   whose days are at least 90% complete. If the settled week is flat and
   only the newest days are down, it is lag.
5. Read each campaign's flags. Conversions are only one signal: a
   campaign can be "within noise" on conversions while traffic jumps or
   CPA runs far over target. Treat any of these flags as worth
   explaining: CONVERSIONS LIKELY REAL, TRAFFIC DOWN/UP, CPA OVER TARGET,
   NO SPEND. For each, follow the tree in
   [references/diagnosis-tree.md](references/diagnosis-tree.md).
6. If the drop looks real, or a day has normal clicks and zero
   conversions, read [references/field-notes.md](references/field-notes.md)
   before you name a cause. Why: a broken tag or a page view action that
   stopped firing looks like a real drop, and the fix is not in the ads.
7. Run the self-check, then answer with the output template.

## Guardrails
- Read-only. Never pause, change bids or budgets. Recommend checks and
  draft changes for the named approver. Why: acting on lagged numbers is
  the exact mistake this skill exists to prevent.
- Never call a drop real on the newest 1 to 3 days alone. Why: on a
  typical lead account only about half of a day's conversions are in by
  the next morning.
- Keep paused and removed campaigns in every total. Why: status is
  today's status, not what it was during the date range; dropping them
  understates past spend and conversions (Google's own MCP server warns
  about this).
- Say which conversion column you used. Why: "All conv." and
  "Conversions" differ, and bidding only uses Conversions.
- Lag-adjusted numbers are estimates. Show the range, not just the point.

## Output template
**Is it a real drop? [account], [recent window] vs [baseline]**

Verdict: [one sentence. e.g. "Mostly lag. About half of the 32% drop
will fill in; the real change is -15%, which is within normal noise."]

- As reported: [conv] vs [baseline] ([%]).
- Lag-adjusted: [est] (90% range [lo]-[hi]) vs [baseline] ([%]). Still
  to arrive: about [n].
- Settled week ([dates]): [%], [verdict].
- What moved: [campaigns that explain most of the change, with numbers].
- Next checks: [from the tree, max 3, each with what it would show].

Good: "Invisalign clicks fell 39% from 5 Nov while lost IS (rank) rose
from 32% to 52%: that is a traffic problem, not tracking."
Avoid: "Conversions are down 32% this week, consider pausing Implants."
(judges lagged days and recommends action without evidence).

## Self-check (run before answering)
- [ ] Totals check in the script output says OK (or the mismatch is explained).
- [ ] Recent window does not rely on the newest days alone; lag source stated (measured or assumed).
- [ ] Paused campaigns included; conversion column named.
- [ ] Every claim has a number and a date range; verdict matches the z value.
- [ ] No action taken or promised; recommendations are checks or drafts.
