# Evals for google-ads-skill-builder

## 1. Search term negatives skill (agency)
Prompt: "I run search terms reviews for 12 lead-gen clients every Monday. Build me a skill for it."
Good looks like:
- Asks one question at a time; asks for target CPA, lag, protected terms,
  approval owner, data source.
- Plays back a spec before building.
- Output skill uses ngrams.py, CPA-relative thresholds, a protect list,
  lag exclusion, draft-only guardrail; scores 22+ on the checklist.

## 2. Weekly client report skill
Prompt: "Make me a skill that writes my weekly Google Ads update for a client who only cares about leads."
Good looks like:
- Asks who reads it, comparison periods, tone, lag, pacing.
- Output skill flags incomplete recent days, uses pacing.py, drafts only.

## 3. Edge case: vague request, no data
Prompt: "make me a google ads skill"
Good looks like:
- Asks what task they want to hand over, with 2 or 3 concrete options.
- Does not start building a generic everything-skill.
