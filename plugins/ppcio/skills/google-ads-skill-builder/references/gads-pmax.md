# Performance Max

## Contents
- Asset limits (Google)
- Controls you have
- Checks worth building
- Sources

## Asset limits (Google)
Per asset group, from Google's PMax specs page:
- Headlines: 30 characters max, include at least one of 15 or fewer;
  minimum 3, maximum 15 (11+ recommended).
- Long headlines: 90 characters max; minimum 1, maximum 5.
- Descriptions: 90 characters max; minimum 2, maximum 5 (Google's best
  practice page recommends 4 and lists 3 as the minimum; follow the specs
  page for what is required to publish).
- Business name: 25 characters max; must match the domain or verified
  business name.
- Display path: 15 characters each, up to 2.
- Images (API docs): landscape 1.91:1 and square 1:1 required, up to 20
  each; logo 1:1.
- Google: wait "2-3 weeks before deciding to replace low performing assets."

## Controls you have
Listed by Google among PMax controls:
- Brand exclusions and negative keywords.
- Search themes, with "the same priority as phrase and broad match
  keywords".
- Final URL expansion: Google may swap the landing page and generate
  matching text. Google: "you remain responsible for reviewing and ensuring
  compliance and accuracy of landing page content".
- URL exclusions can be set per asset group, not only per campaign. Google's
  Developer Assistant includes a skill whose only job is to stop the model
  claiming otherwise.
- Channel prioritization: Google channels (Search, YouTube, Maps, Gmail,
  Discover) are grouped; Search partners and Display can get separate
  priority tiers and optional daily budget allocations.
- Text customization: Google generates extra headlines and descriptions
  from the landing page, domain and current ads.

## Checks worth building
- Brand leakage: is brand traffic flowing into PMax when a brand Search
  campaign exists? Check brand exclusions and search term insights.
- Search overlap: which search themes or terms overlap Search keywords.
- Asset coverage: each asset group meets minimums; Ad strength; video
  present.
- Final URL expansion: on or off, and which URLs are excluded (blog,
  careers, support pages are common exclusions).
- Feed health (retail): products disapproved or limited in Merchant Center.
- Conversion goals: PMax optimises to the account or campaign goals; check
  that only real business conversions are primary.

## Sources
- PMax specs: https://support.google.com/google-ads/answer/17091269
- PMax text asset best practices: https://support.google.com/google-ads/answer/15996555
- Asset group best practices: https://support.google.com/google-ads/answer/14528220
- About Performance Max: https://support.google.com/google-ads/answer/10724817
- API asset requirements: https://developers.google.com/google-ads/api/performance-max/asset-requirements
- Developer Assistant pmax-listing-filter skill: https://github.com/googleads/google-ads-api-developer-assistant
