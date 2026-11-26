---
name: weekly-client-report
description: Writes the weekly Google Ads update for a client or boss in plain words, built on exact numbers - week vs week with paused campaigns kept in, conversions still to arrive estimated from the account's own lag, budget pacing, and the week's changes including auto-applied ones - so every sentence can be backed up. Use when someone asks for the weekly report, client update, Monday email, "how did last week go", or a performance summary for a non-PPC reader. Not for diagnosing a drop in depth (use conversion-lag-check and change-detective) or for search term work.
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.2.0"
---

# Weekly client report

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

Clients read the first two lines and the number they care about. Most AI
reports bury that under jargon, or worse, report a "drop" that is just
bookings still coming in. This skill gets the numbers exactly right with a
script, then writes like a person: what happened, why (only if there is
evidence), what we are doing, what we need from you.

## Step 0: account profile
Read [references/account-profile.md](references/account-profile.md) when
no profile is in the chat or project. Fields needed: currency, counted
conversion and what the client calls it ("bookings", "leads"), targets,
monthly budget, brand campaigns, report style and reader, who approves.

## Inputs
1. Daily campaign report (Campaigns view segmented by Day, or Report
   editor), from 6 weeks before the report week to yesterday. Columns:
   Campaign, Campaign state, Clicks, Impr., Cost, Conversions, Conv. value.
2. Days to conversion report (Segment > Conversions > Days to
   conversion, 90 days ending at least 30 days ago). Optional but it
   stops false "drops".
3. Change history download for the last 2 weeks. Optional.
If the daily report is missing, ask for it. If the lag report is
missing, write "bookings from the last few days are still coming in"
and do not call a drop.

## Workflow
1. Run:
   `python scripts/weekly_numbers.py --daily <daily.csv> --lag <lag.csv> --changes <changes.csv> --budget <monthly> --brand "<brand pattern>" --target-cpa <CPA> [--campaign-target "Implants=90"]`
2. Pick the one headline number the reader cares about (from the
   profile: bookings, leads, sales or revenue) and say how it moved, on
   the final estimate, not the as-reported count. Compare final estimate
   with final estimate (the script gives both weeks). If brand and
   non-brand move in different directions, say so in the first lines:
   brand bookings come from people who already know the business, so a
   flat total can hide a fall in new customers.
3. Pick at most 3 things that explain the week, from the script: biggest
   movers, pacing, changes. A cause is only a cause if a change or a
   number backs it; otherwise say "we're checking".
4. Translate jargon with
   [references/plain-words.md](references/plain-words.md), and read
   [references/field-notes.md](references/field-notes.md) (both before
   writing).
5. Write with the template to `draft.md`. Save the step 1 output to
   `numbers.txt`, then run:
   `python scripts/report_check.py draft.md --numbers numbers.txt --term <what the client calls a conversion>`
   Fix every FAIL and run it again until it passes. Why: one number that is
   not in the script output, or one "CPA", and the client stops trusting
   the rest.
6. Run the self-check.

## Guardrails
- Every number in the report comes from the script output. Why: one
  wrong number and the client stops trusting the rest.
- Never call the newest days a drop; say they are still coming in. Why:
  conversions are dated by click and arrive late.
- Keep paused campaigns in totals and say they were paused. Why: status
  is today's status, past spend still happened.
- Name auto-applied changes as Google's, without drama, and say what we
  will do about them.
- No blame. Name who made a change only to the internal reader, not in
  the client version.
- Changes we recommend are proposals; the client or approver decides.

## Output template
Subject: [Account] week of [date]: [headline in 6-10 words]

[2-3 sentences: the headline number on final estimate vs last week and
vs target; the one-line reason; what we are doing.]

What happened
- [movement with number]
- [movement with number]
- [pacing: spent X of Y, on track to Z]

What we're doing
- [action, or proposal awaiting approval]

What we need from you
- [decision or info, or "nothing this week"]

Good: "Total bookings held at about 130 once late ones are counted (103 so
far), but that's thanks to people searching for Harbour by name. Bookings
from new patients fell from about 67 to about 54."
Avoid: "Impression share decreased due to rank, conversions -13%" (jargon,
and the -13% is mostly bookings not counted yet).

## Self-check (run before answering)
- [ ] `report_check.py` passes on the final draft.
- [ ] Every number appears in the script output.
- [ ] Headline compares final estimate with final estimate and says some bookings are still to come.
- [ ] Brand and non-brand both stated if they moved differently.
- [ ] Paused campaigns mentioned if they had spend in the comparison weeks.
- [ ] No jargon from the plain-words list left untranslated.
- [ ] Under 200 words for the client version.
