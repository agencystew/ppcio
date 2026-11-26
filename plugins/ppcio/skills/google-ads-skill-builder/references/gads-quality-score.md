# Quality Score

## Google says
- "Quality Score is a diagnostic tool meant to give you a sense of how well
  your ad quality compares to other advertisers." Scale 1 to 10, keyword
  level.
- "Quality Score is not a key performance indicator and should not be
  optimized or aggregated with the rest of your data."
- "Quality Score is not an input in the ad auction."
- Components: expected click-through rate, ad relevance, landing page
  experience, each rated "Above average," "Average," or "Below average", compared
  with other advertisers whose ads showed for the exact same search over the
  last 90 days.

## How a skill should use it
- Use it to find where to look, not as a goal. Weight by spend: a QS of 3
  on a keyword that spends nothing does not matter.
- Act on the component:
  - Expected CTR below average: ad copy and offer; query match.
  - Ad relevance below average: ad group too broad; keyword not in copy.
  - Landing page below average: speed, message match, mobile experience.
- Report the share of spend on keywords with any Below average component.
- Do not average QS across the account as a headline KPI (Google says not
  to aggregate it).

## Data
CSV: Keywords view with Quality Score, Exp. CTR, Ad relevance, Landing
page exp. columns (off by default). MCP: see data-access.md.

## Sources
- About Quality Score for Search campaigns: https://support.google.com/google-ads/answer/6167118
