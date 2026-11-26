# Blueprint: search term miner (negatives and new keywords)

Start here for any skill that reads search terms. Adapt to the spec.

## Must learn in the interview
- Target CPA (or ROAS) per campaign; conversion lag in days.
- Brand terms, product names, competitor terms bid on deliberately.
- Protected words; words they always exclude.
- Negative list setup: shared lists, account-level, campaign-level habits.
- Output: Google Ads Editor-ready CSV, a review table, or both.
- Who approves negatives.

## Copy into the new skill
- references: gads-search-terms-negatives.md, data-access.md (search terms
  part only), gads-conversion-tracking.md (lag part).
- scripts: ngrams.py.

## Workflow to adapt
1. Get the export (30 to 90 days, ending N days ago, N = lag), or run the
   search_term_view query.
2. Check: date range, row count, totals match the account view.
3. Run ngrams.py with their target CPA, a protect file (terms never to
   negate), an account-words file (target towns and service words that may
   sit in a query but never in a negative), `--protect-names`,
   `--low-spend` and `--exclude-campaign` for brand campaigns.
4. Review flagged n-grams in context: open sample queries for each. Words
   like "cheap" or "free" can be right for some businesses. When a flagged
   word describes what the client sells or a selling point (for example
   "safe" in "gas safe"), negate the modifier instead ("course",
   "register check"), never the service word.
4b. Location check: compare place names in queries with the campaign's
   target towns. A town not on the list is a campaign-level negative
   candidate; if the list is unknown, ask.
5. Check each candidate against positive keywords (no self-blocking) and
   the protect list.
6. Pick level and match type per the reference rules.
7. Find positives too: converting queries not yet keywords, at or under
   target CPA.
8. Self-check, then output.

## Guardrails
- Draft only. [approver from the interview] adds negatives. Why: a wrong negative silently
  kills converting traffic and is hard to spot later.
- Never negate a term with a conversion in the window.
- Never negate protected words without asking.

## Output template
1. Summary: date range, spend analysed, estimated waste (with method).
2. Negatives table: negative | match type | level | evidence (cost, clicks,
   conv, n queries) | example queries | confidence.
3. New keyword candidates: query | conv | CPA | suggested ad group.
4. Not sure: items needing a human call, with the reason.
5. Editor CSV (if asked): Campaign, Ad group, Keyword, Criterion type.

## Self-check
- Totals in the summary equal the export totals.
- No candidate appears in the protect list or matches a positive keyword.
- Lag window excluded.
- Each negative has evidence and a match type reason.

## Eval ideas
- Normal 90-day export, ask for negatives.
- Export with a brand misspelling that spends a lot with zero conversions
  (should be protected or asked about, not negated).
- No target CPA given (should ask, or use the export's average CPA and say so).
