# Getting the data: CSV exports or Google's MCP server

## Contents
- Choose the path
- Path A: CSV exports from the Google Ads UI
- Path B: Google Ads MCP server (live, read-only)
- Gotchas that apply to both
- Sources

## Choose the path
- No API setup, or a client account you only see in the UI: CSV.
- Google's Google Ads MCP server already working in Claude: MCP.
- A built skill should support CSV even when MCP exists, so it still works
  when the tools are missing. Google's own diagnostics skill does this: if
  the tools are not there it tells the user, points to setup, and hands over
  the queries to run by hand.

## Path A: CSV exports from the Google Ads UI
Tell the user exactly what to export. For each export give: report, date
range, columns, and "download as CSV".

Common exports:
- Search terms: Insights and reports > Search terms. Columns: Search term,
  Match type, Campaign, Ad group, Added/Excluded, Impr., Clicks, Cost,
  Conversions, Conv. value. Range: 30 to 90 days, ending before the lag window.
- Keywords with Quality Score: Keywords view. Add Quality Score, Exp. CTR,
  Ad relevance, Landing page exp. (all off by default), plus Cost, Clicks,
  Conversions.
- Campaigns with impression share: Campaigns view. Add Search impr. share,
  Search lost IS (budget), Search lost IS (rank), Budget, Bid strategy type,
  Cost, Conversions, Conv. value.
- Ads and assets: Ads view with headlines, descriptions, final URL, status,
  Ad strength.
- Change history: Change history page, for "what changed before the drop".

When the CSV arrives, the skill should check: the date range in the file
header, totals row vs sum of rows (do not double count the totals row), the
currency, and whether rows are segmented by day or month (aggregate first).

## Path B: Google Ads MCP server (live, read-only)
Google's server: https://github.com/googleads/google-ads-mcp
Read tools (names may carry a prefix, for example `search_search`):
- `list_accessible_customers`: account IDs you can see. Call first.
- `get_resource_metadata`: which fields a resource supports. Google's tool
  text says: "Do not guess the fields. Use the tool to look them up."
- `search`: runs GAQL from structured fields: `customer_id` (10 digits, no
  hyphens), `resource`, `fields`, optional `conditions`, `orderings`,
  `limit`, `login_customer_id` (manager account ID when going through an MCC).

Write tools (since v0.0.6, 2 Nov 2026): create assets, upload videos,
manage labels and label links. It cannot change bids, budgets, campaigns,
ad groups or ads, or link assets. Every write is two steps: a dry run that
returns a checksum, then the same call with the checksum "after user
approval". To force read-only, set `labels: false` and `assets: false` in
`tools_config.yaml`.

Useful queries (check fields with `get_resource_metadata` first):

Search terms:
```sql
SELECT search_term_view.search_term, search_term_view.status,
  campaign.name, ad_group.name, metrics.impressions, metrics.clicks,
  metrics.cost_micros, metrics.conversions, metrics.conversions_value
FROM search_term_view
WHERE segments.date BETWEEN '{start}' AND '{end}'
```

Keyword Quality Score:
```sql
SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text,
  ad_group_criterion.keyword.match_type,
  ad_group_criterion.quality_info.quality_score,
  ad_group_criterion.quality_info.search_predicted_ctr,
  ad_group_criterion.quality_info.creative_quality_score,
  ad_group_criterion.quality_info.post_click_quality_score,
  metrics.cost_micros, metrics.conversions
FROM keyword_view
WHERE segments.date BETWEEN '{start}' AND '{end}'
```

More diagnostic queries (impression share, change events, offline
uploads, client accounts under an MCC) are in gads-diagnostics.md.

## Gotchas that apply to both
From Google's diagnostics skill and MCP server (Apache 2.0, see NOTICE.md):
- Cost in the API is in micros: divide `metrics.cost_micros` by 1,000,000.
- Impression share comes back as a decimal (0.35 = 35%) or a string like
  "< 0.10". Treat "< 0.10" as "under 10%", not as a number.
- `metrics.cost_micros` cannot be selected together with
  `segments.conversion_action`. Query cost and the conversion action split
  separately.
- Dates must be YYYY-MM-DD and ranges must have a start and an end.
- Do not filter past performance by current status. Google's hint: status
  fields "hold the current status, not the status during the date range";
  filtering them out "would understate cost and conversions". Drop
  zero-impression rows after the query instead.
- `change_event` needs a date filter within the past 30 days, a LIMIT of at
  most 10,000, and cannot select metrics.
- `click_view` needs a single-day date filter (Google's GAQL validator
  rejects anything else).
- GAQL has no OR. Use IN, or run two queries.

Conversion timing (applies to every export and query):
- The standard Conversions column is dated by the click, not the
  conversion. Recent days always look low until late conversions arrive.
  Google: primary conversion columns "are calculated based on the time of
  the click, not the time of the conversion."
- For matching CRM or sales numbers use "Conversions (by conv. time)"
  (API: `metrics.conversions_by_conversion_date`).

## Sources
- MCP server and tool text: https://github.com/googleads/google-ads-mcp (search.py, status hint added 10 Nov 2026)
- Tool reference: https://github.com/google/skills/blob/main/skills/ads/google-ads-api-mcp-setup/references/tools.md
- Diagnostics skill: https://github.com/google/skills/blob/main/skills/ads/google-ads-api-account-diagnostics/SKILL.md
- GAQL validator: https://github.com/googleads/google-ads-api-developer-assistant (skills/validate-gaql/scripts/validate_gaql.py)
- Conversion timing: https://support.google.com/google-ads/answer/6270625
