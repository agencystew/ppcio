# RSAs, assets and character limits

## Contents
- Limits (verify with scripts/check_ad_lengths.py)
- How RSAs assemble
- Writing rules that matter
- Generic tells to avoid
- Sources

## Limits (verify with scripts/check_ad_lengths.py)
Responsive search ads (Google Help):
- Headlines: 30 characters each; minimum 3, up to 15.
- Descriptions: 90 characters each; minimum 2, up to 4.
- Display path: 15 characters each, 2 paths.
- Double-width languages (Korean, Japanese, Chinese): each character
  counts as 2.
Assets (Google Ads API reference):
- Sitelink link text: 1 to 25 characters. Sitelink description lines:
  1 to 35 characters each; if one is set, both must be set.
- Callout: 1 to 25 characters.
- Structured snippet: header from Google's fixed list; 3 to 10 values,
  each 1 to 25 characters.
Performance Max text assets: see gads-pmax.md.

## How RSAs assemble
- Google mixes headlines and descriptions; "a minimum of one headline and
  one description will be selected" per impression. Every headline must
  make sense next to any other.
- "If you have text that should appear in every ad, you must pin the text
  to either Headline position 1, Headline position 2, or Description
  position 1." Pinning narrows the combinations, so pin only what must show
  (legal lines, brand rules).
- Google reports advertisers who add a third RSA to an ad group "find an
  average 3.7% increase in conversions at a similar cost per conversion"
  (Google's own figure, quoted from the RSA help page).

## Writing rules that matter
- Cover different reasons to click across headlines: the keyword theme,
  the offer, proof (numbers, reviews, years), the CTA, objections.
- Do not repeat the same idea in different words; it wastes slots.
- Use the user's real proof points only. Never invent prices, ratings,
  awards or guarantees.
- Respect the user's banned words and legal lines.
- Count characters with the script, never by eye.

## Generic tells to avoid
Like Anthropic's frontend-design skill naming AI's default looks, name the
default copy so the skill steers away from it. Practitioner list, extend
with the user's own:
- "Unlock", "Elevate", "Discover the power of", "Your trusted partner",
  "Solutions for all your needs", "Best-in-class", "Look no further".
- Headlines that could fit any competitor. Test: swap in a competitor's
  name; if it still works, it is generic.

## Sources
- About responsive search ads: https://support.google.com/google-ads/answer/7684791
- SitelinkAsset: https://developers.google.com/google-ads/api/reference/rpc/latest/SitelinkAsset
- CalloutAsset: https://developers.google.com/google-ads/api/reference/rpc/latest/CalloutAsset
- StructuredSnippetAsset: https://developers.google.com/google-ads/api/reference/rpc/latest/StructuredSnippetAsset
- Anthropic frontend-design: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
