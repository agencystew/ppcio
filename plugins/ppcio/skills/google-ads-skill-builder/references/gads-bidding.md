# Bidding: Target CPA and Target ROAS

## Contents
- Google's requirements and guidance
- Decision logic for a skill
- Practitioner defaults (settings)
- Sources

## Google's requirements and guidance
- Target ROAS, Search and Shopping: "At least 15 conversions in the past 30
  days at the conversion tracking level." Demand Gen: "At least 50
  conversions in the past 35 days" (10 in the past 7 days) in the campaign,
  or 100 across Demand Gen campaigns. App: "At least 10 conversions every day
  (or 300 conversions in 30 days)."
- Target CPA recommendation = "the average CPA from the last 30 days,
  adjusted for any conversion delays". For evaluation Google recommends
  measuring "the last 30 days, including at least 30 conversions."
- Smart Bidding optimises to the primary conversion actions. Bad
  conversion data means bad bidding (see gads-conversion-tracking.md).

## Decision logic for a skill
1. Is tracking trustworthy? If not, fix tracking before touching targets.
2. Is there enough volume? Below Google's minimums, recommend a simpler
   strategy or a portfolio/shared target, not a tighter target.
3. Compare actual CPA or ROAS over a lag-adjusted window with the target.
4. Missing volume and beating target: the target may be too tight. Check
   lost IS (rank) and (budget) before loosening.
5. Missing target: check conversion rate changes, search term quality and
   recent changes before tightening the target.
6. Output recommendations as drafts with the expected direction, the
   window used and the risk.

## Practitioner defaults (settings)
PPC.io starting points, not Google rules. Confirm with the user:
- Move targets in steps (for example 10 to 20 percent), then wait at least
  one conversion cycle plus lag before judging.
- Judge on at least 30 conversions where possible, matching Google's
  evaluation guidance.
- Avoid changing target and budget on the same day; you cannot tell which
  change did what.

## Sources
- About Target ROAS: https://support.google.com/google-ads/answer/6268637
- About Target CPA: https://support.google.com/google-ads/answer/6268632
