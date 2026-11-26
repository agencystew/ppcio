---
name: change-detective
description: Works out why Google Ads performance changed by finding the day each campaign's clicks, cost, CPC, conversion rate or impression share shifted and lining it up with the change history, including auto-applied recommendations, then ranks the suspects with before-and-after numbers. Use when someone asks "why did performance change", "what happened on the 5th", "who changed what", "why did CPA jump", or after conversion-lag-check finds a real drop. Not for checking whether a drop is real (use conversion-lag-check first) or for writing the client update (use weekly-client-report).
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.2.0"
---

# Change detective

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

Most "why did it drop" answers are guesses: someone remembers one change
and blames it. This skill does it the way a good analyst would. It finds
the exact day the numbers moved, then lists every change made in the days
before, scores each one by timing, scope and whether that kind of change
can move that metric, and shows before-and-after numbers. Changes made by
Google's auto-applied recommendations are called out, because nobody
remembers making them.

## Step 0: account profile
Read [references/account-profile.md](references/account-profile.md) when
no profile is in the chat or project. Fields needed: currency, targets,
typical conversion lag, who approves changes.

## Inputs
Ask for what is missing:
1. Daily campaign report (Campaigns view segmented by Day, or Report
   editor with Day and Campaign rows), last 60 to 90 days to yesterday.
   Columns: Campaign, Impr., Clicks, Cost, Conversions, Search lost IS
   (budget), Search lost IS (rank).
2. Change history download: Change history page, same date range,
   download as CSV. Keep all users and tools; do not filter out Google's
   changes.
3. Days to conversion report (Campaigns view, Segment > Conversions > Days
   to conversion, 90 days ending at least 30 days ago). Without it, ask
   for the usual lag and use `--settle-days N`.
Live data: [references/mcp-queries.md](references/mcp-queries.md) (read
when the Google Ads MCP tools are connected; the API keeps only 30 days
of change events).

If the change history is missing, say the answer will only show when and
where numbers moved, not why, and ask for it before guessing.

## Workflow
1. Run:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/change_detective.py" --daily <daily.csv> --changes <changes.csv> --lag <lag.csv> --target-cpa <CPA> [--campaign-target "Implants=90"]`
   Add `--campaign "<text>"` to focus on one campaign. Changes made at
   the same minute by the same person or tool are grouped (for example
   "3 changes: Keyword added ...").
   The script reports shifts of at least 15% with strength 3 or more.
   These are settings, not Google rules: lower them with `--min-pct` and
   `--min-t` for small accounts, and say so in the answer.
2. Read "Where the numbers moved". Each line is a shift: the first day
   the new level started, before and after levels, and strength (above 3
   is a clear shift). Conversion metrics use lag-adjusted values on days
   at least half complete, so a conversion-rate shift can show up later
   than a clicks shift. Daily conversion rate is noisy on small
   campaigns; the before/after block (CPA vs target) is often the clearer
   signal for keyword and auto-applied changes.
3. For each shift, read the suspects. Scores near 1.0 mean the change
   happened 0 to 1 days before, in that campaign, and is the kind of
   change that moves that metric. Use
   [references/change-types.md](references/change-types.md) (read when
   explaining why a type of change moves a metric).
4. If two changes share the top score, say they cannot be separated from
   the numbers. Use the pattern of metrics to argue which is likelier
   (for example lost IS (rank) rising points to bidding, not ad text).
5. For shifts with no suspect, list the outside causes to check:
   tracking, landing page, season, competitors (Auction insights).
   Read [references/field-notes.md](references/field-notes.md) when you
   rank suspects or when no row explains the shift. Why: website and Tag
   Manager changes, and Google's own auto-apply settings, leave no row or
   only a hidden one.
6. Run the self-check, then answer with the output template.

## Guardrails
- Read-only. Never undo or change anything. Suggest a fix as a draft for
  the approver, with the expected effect. Why: undoing the wrong change
  adds a second shock and makes the next diagnosis harder.
- Call a change a suspect, never the proven cause. Why: timing is
  evidence, not proof.
- Do not judge conversions on unsettled days. Why: they are dated by
  click and still arriving; clicks and cost have no lag.
- Name the person or tool that made each change, including
  auto-applied recommendations. Why: the fix is often a setting
  (auto-apply) rather than the change itself.

## Output template
**What changed and why: [account], [window]**

1. [Campaign]: [metric] moved from [before] to [after] from [date].
   Prime suspect: [change, date, who], because [timing + metric fit].
   Before vs after: [numbers]. Confidence: [high/medium/low and why].
   Draft fix: [what, for whom to approve].
(repeat, most important first)

Not explained by any change: [shift + checks to run].

Good: "Invisalign: lost IS (rank) jumped from 28% to 52% from 5 Nov, the
day after Jo cut target CPA from £70 to £45 (4 Nov, 16:51). A tighter
target makes Google bid lower, which shows up as rank loss. The RSA edit
2 minutes later is unlikely to move rank share."
Avoid: "Performance dropped because of recent changes." (no date, no
change, no numbers).

## Self-check (run before answering)
- [ ] Every suspect has a date, who made it, and before-and-after numbers.
- [ ] Conversion claims use settled days only.
- [ ] Same-day changes flagged as inseparable.
- [ ] Auto-applied changes called out by name.
- [ ] No change made; fixes are drafts with an approver.
