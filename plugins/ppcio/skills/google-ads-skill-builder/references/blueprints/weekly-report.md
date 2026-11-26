# Blueprint: weekly client report

## Must learn in the interview
- Who reads it and what they care about (leads, revenue, cost).
- Comparison: last week vs prior week, vs same week last year, vs target.
- KPIs and targets per client; conversion lag.
- Format and tone: email, Slack, doc; plain words; length.
- How to explain drops (what context they want), and what never to say.
- Data access and which accounts.

## Copy into the new skill
- references: gads-conversion-tracking.md (lag and columns),
  gads-budget-pacing.md, gads-impression-share.md, gads-diagnostics.md
  (low lead flow tree), data-access.md.
- scripts: pacing.py.

## Workflow to adapt
1. Pull last 7 complete days and the comparison period. Use the same
   weekdays.
2. Flag the lag: the latest days are incomplete under click-date
   conversions. Either report "by conv. time" or say the numbers will rise.
3. Compute KPIs vs prior and vs target. Totals by explicit formula.
4. For any KPI that moved more than the agreed band, run the diagnostic
   tree (traffic or conversion rate; IS budget or rank; changes made).
5. Pacing with pacing.py.
6. Write the narrative: what happened, why, what we are doing next.
7. Self-check, then output as a draft.

## Guardrails
- Draft only; [account manager from the interview] sends it. Why: it goes to a client.
- Never blame tracking or Google without evidence.
- Do not filter past spend by current status.

## Output template
Subject line. Three-line summary. KPI table: metric | this week | last week
| change | target. What changed and why (3 bullets max). Next steps (3
bullets max). Pacing line.

## Self-check
- Totals match the export for the same dates.
- Lag stated if recent days are included.
- Every "why" points to evidence (IS, change history, search terms).
- Tone matches the client's preference; no jargon they do not use.

## Eval ideas
- Normal week with a 20 percent lead drop caused by lost IS (budget).
- A week where the drop is only lag in the last 2 days (should say so).
- Missing comparison data (should ask or report only what exists).
