# Search terms and negative keywords

## Contents
- How negatives really match (Google)
- Workflow for mining search terms
- Choosing match type and level
- Protect list
- Practitioner defaults (settings, change per account)
- Sources

## How negatives really match (Google)
- "Negative keywords won't match to close variants or other expansions."
  Excluding "flowers" does not block "flower".
- "You'll need to add synonyms and singular or plural versions if you want
  to exclude them."
- "Negative keywords automatically account for casing and misspellings."
- Negative broad: blocks queries containing all the words, any order.
  Negative phrase: blocks queries containing the words in that order.
  Negative exact: blocks only that exact query.
- Performance Max now supports negative keywords and brand exclusions
  (Google lists "Brand exclusions and negative keywords: Prevent overlaps
  and block unwanted queries" among PMax controls).

## Workflow for mining search terms
1. Export 30 to 90 days, ending before the conversion lag window.
2. If rows repeat per day or month, aggregate by search term + campaign
   first.
3. Split brand vs non-brand using the account's naming convention or brand
   term list.
4. Build n-grams (1, 2 and 3 words) with cost, clicks, conversions and
   value summed. Single wasteful queries are noise; wasteful words that
   repeat across many queries are where the money is. Use
   scripts/ngrams.py.
5. Flag candidates using the user's target CPA (see defaults below).
6. Check each candidate against the protect list and against the account's
   own positive keywords, so a negative never blocks a keyword they bid on.
6b. Never propose the service word itself. If "plumbing" is flagged
   because of "plumbing jobs" and "plumbing course", the negatives are
   "jobs" and "course".
7. Cluster candidates by theme (jobs, free, DIY, wrong location, wrong
   product, competitor, informational) and recommend one negative per theme
   where possible.
8. Output a draft list with level, match type, evidence and confidence. No
   changes go live without approval.

## Choosing match type and level
- One-off irrelevant query: negative exact.
- A word that is always wrong for this business (e.g. "jobs", "free" for
  most service firms): negative phrase or broad, at shared list or account
  level, after checking it never appears in a converting query.
- Wrong for one campaign only (e.g. a city served by another campaign):
  campaign-level negative.
- Steering traffic between ad groups is a different job (query sculpting);
  label it separately from waste.

## Protect list
Never suggest these as negatives without explicit approval:
- Brand terms and product names (the user's list).
- Competitor names the user bids on on purpose.
- Any term with a conversion in the analysed window.
- Words the user named in the interview.
ppc.io's own Negative Keyword Analyzer uses a protected pattern list (for
example "best", "top", "reviews", "near me", "compare") because these signal
buying intent; offer it as a starting list.

## Practitioner defaults (settings, change per account)
These are PPC.io starting points, not Google rules. Ask the user to confirm.
- Minimum evidence for a zero-conversion term: spend at least 1x target CPA
  (strong flag at 2x). Fixed currency thresholds ignore account economics.
- Minimum clicks before judging a term with no conversions: about
  1 / expected conversion rate (e.g. 25 clicks at 4%).
- Exclude the last N days (N = conversion lag) from "zero conversion" calls.
- Report wasted spend as an estimate with the date range shown.

## Sources
- About negative keywords: https://support.google.com/google-ads/answer/2453972
- About Performance Max campaigns (controls): https://support.google.com/google-ads/answer/10724817
- ppc.io skills library: https://ppc.io/claude-skills
