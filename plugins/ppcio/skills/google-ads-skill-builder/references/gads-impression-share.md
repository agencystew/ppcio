# Impression share diagnosis

## Google says
- "Impression share = impressions / total eligible impressions."
  Eligible impressions are an estimate based on targeting, approvals and
  quality.
- Eligible auctions can include ones where your ad "could show at twice its
  current bid, but could exclude auctions where your ad is estimated to need
  a 1,000% bid increase".
- "Small fluctuations over time don't necessarily indicate that action is
  needed."
- Data "can also take 24-48 hours to update."
- In the API, IS is a decimal (0.35 = 35%) or the string "< 0.10" (under
  10%). (Google diagnostics skill.)
- Lost IS (budget) = opportunities lost to limited budget. Lost IS (rank) =
  lost to low ad rank, from bids or quality. (Google diagnostics skill.)

## Decision tree for a skill
1. Is the campaign meeting its target CPA or ROAS (lag-adjusted)?
2. Lost IS (budget) high and on target: more budget is the likely win.
   Draft a budget increase with expected extra spend.
3. Lost IS (budget) high and off target: do not add budget. Fix efficiency
   first, or lower bids/targets so the budget covers more of the day.
4. Lost IS (rank) high: check Quality Score components and ad copy, then
   bids or targets. On Smart Bidding, a tight target often shows up as rank
   loss.
5. Both low and IS high: the campaign is near the market ceiling; growth
   needs new keywords, match types, geos or campaign types.
6. IS is "< 10%": the campaign is tiny relative to the market; check
   targeting and budget before anything else.

## Practitioner defaults (settings)
"High" is not defined by Google. PPC.io starting points: flag lost IS
(budget) above 10 percent on profitable campaigns, and lost IS (rank) above
30 percent on campaigns that matter. Confirm with the user. Brand campaigns
usually deserve a higher IS bar than non-brand.

## Sources
- About impression share: https://support.google.com/google-ads/answer/2497703
- Google diagnostics skill: https://github.com/google/skills/blob/main/skills/ads/google-ads-api-account-diagnostics/SKILL.md
