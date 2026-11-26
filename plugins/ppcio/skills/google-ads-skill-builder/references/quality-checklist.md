# Quality checklist

Grade every skill you build. Each item is PASS or FAIL. Write the score as
"x / 24" plus the list of fails. Ship only at 22 or more with no fail in
the Critical group. Then fix the remaining fails if you can.

## Contents
- Critical (must all pass)
- Trigger
- Structure
- Inputs and data
- Google Ads correctness
- Output and verification
- Testing

## Critical (must all pass)
1. Read-only by default. The skill never changes a live account by itself;
   changes are drafts for a named human to approve.
2. Uses the user's own targets (CPA, ROAS, budget) for every threshold, or
   asks for them. No unexplained benchmark numbers.
3. No invented Google Ads facts. Every limit or rule that can change has a
   source link in a reference file.
4. Frontmatter is valid: `name` matches the folder, lowercase and hyphens,
   max 64 chars; `description` non-empty, max 1,024 chars, no angle
   brackets; only these fields: name, description, license, compatibility,
   metadata, allowed-tools.
5. Protected items from the interview (brand terms, products, competitors
   they target on purpose) are written into the guardrails.

## Trigger
6. Description says what it does and when to use it, in third person.
7. Description includes words the user actually types (their terms, e.g.
   "search terms report", "negatives", "weekly client report").
8. Description says when not to use it, or points to a sibling skill.

## Structure
9. SKILL.md body under 300 lines (hard max 500).
10. Knowledge lives in references/, each linked directly from SKILL.md with
    a "read when" line. No reference links to another reference.
11. Reference files over 100 lines start with a contents list.
12. Steps are numbered and in the order they run. Diagnosis uses if/then
    branches with a stop rule.

## Inputs and data
13. Inputs section names the exact export or query, the date range, and the
    columns needed.
14. Says what to do when an input is missing or too small (ask, fall back,
    or stop), instead of guessing.
15. Handles conversion lag: the most recent days are excluded or flagged
    before judging conversions.
16. Does not filter historical metrics by current status (paused or removed
    items still count for past spend).

## Google Ads correctness
17. Uses the right knowledge for the task (character limits, negative match
    behaviour, IS definitions, pacing limits) copied from the builder's
    references, with sources.
18. Anything that must be exact (character counts, n-grams, pacing maths,
    totals) is done by a script or an explicit formula, not by eye.

## Output and verification
19. A fixed output template with an example of good output.
20. Recommendations show evidence (numbers, date range, source rows) and
    say confidence or sample size.
21. A self-check list runs before answering: totals reconcile with the
    input, limits met, guardrails respected, assumptions stated.
22. Explains the why behind its firm rules (no wall of caps-lock MUSTs).

## Testing
23. evals.md has at least 3 realistic prompts with what good looks like,
    including one edge case (missing data, tiny account, or a trap).
24. The builder dry-ran at least one eval against the skill and fixed what
    broke.
