# Blueprint: account audit

## Must learn in the interview
- What the audit feeds: pitch to a prospect, new client onboarding, or a
  quarterly review. This sets tone and depth.
- Targets and conversion definitions.
- Data access: which exports, or MCP.
- Things they never want flagged (deliberate choices).
- Output: report doc, slide notes, or a checklist.

## Copy into the new skill
- references: gads-conversion-tracking.md, gads-account-structure.md,
  gads-search-terms-negatives.md, gads-quality-score.md,
  gads-impression-share.md, gads-bidding.md, gads-pmax.md (if PMax),
  gads-budget-pacing.md, data-access.md, gads-diagnostics.md.
- scripts: ngrams.py.

## Workflow to adapt
1. Collect inputs; list what is missing and what that means for coverage.
2. Tracking first. If conversions are unreliable, say so at the top; every
   other finding depends on it.
3. Then, in order: structure, search terms and waste, Quality Score
   components (spend-weighted), impression share, bidding vs targets,
   assets and RSAs, PMax, budgets and pacing.
4. Each check: PASS, ISSUE, or UNKNOWN (missing data). Never guess a PASS.
5. Rank issues by money at stake, using the account's own numbers.
6. Self-check, then output.

## Guardrails
- UNKNOWN beats a guess. Why: a false pass is worse than a gap.
- No universal benchmarks presented as rules.
- Deliberate choices from the interview are not flagged.

## Output template
1. Verdict in three lines and the top 3 fixes with money at stake.
2. Coverage: what was checked, what was not and why.
3. Findings by area: status | evidence | fix | effort.
4. 30-day action plan.

## Self-check
- Every ISSUE has numbers and a date range.
- Tracking was checked first and its status is stated.
- No check marked PASS without data.

## Eval ideas
- Full exports for a lead-gen account.
- Exports with no conversion data (should lead with tracking, mark others
  UNKNOWN where they depend on conversions).
- A deliberate multi-language duplicate structure (should not recommend merging).
