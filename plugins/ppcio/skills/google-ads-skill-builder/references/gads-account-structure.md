# Account structure and naming

Most of this is practitioner judgement, not Google rules. Treat it as a
default to adapt to the user's account.

## Naming conventions
- A skill can only group results if names are consistent. Capture the
  pattern in the interview with real examples, then parse it.
- Example pattern: `Client | Type | Brand/NonBrand | Geo | Theme`, for
  example `ACME | Search | NB | UK | Boilers`.
- If names are inconsistent, the skill should list the ones it cannot
  parse instead of guessing.

## Structure checks worth building
- Brand and non-brand separated, so brand results do not hide non-brand
  performance.
- Campaigns split only where budgets, targets, geos or languages truly
  differ. Too many small campaigns starve Smart Bidding of data (see
  Google's conversion minimums in gads-bidding.md).
- Ad groups with a clear theme; keywords appear in the ad copy.
- Search and PMax overlap understood (see gads-pmax.md).
- Multi-language or multi-region duplicates are often deliberate; flag with
  a note, do not recommend merging by default.

## Data hygiene for skills
- Paused or removed campaigns still count for past spend. Do not filter
  them out of historical totals (Google MCP hint, see data-access.md).
- Use IDs, not names, when joining exports; names change.
