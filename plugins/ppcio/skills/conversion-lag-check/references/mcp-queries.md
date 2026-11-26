# Live data with Google's Google Ads MCP server

Read when the MCP tools (`search`, `list_accessible_customers`,
`get_resource_metadata`, sometimes with a prefix) are connected. Check
fields with `get_resource_metadata` first; Google's tool text says "Do not
guess the fields."

If the tools are not there, say so, point to
https://github.com/googleads/google-ads-mcp for setup, and ask for the
two CSV exports instead.

## Daily campaign data (no status filter on purpose)
```sql
SELECT segments.date, campaign.name, campaign.status,
  metrics.impressions, metrics.clicks, metrics.cost_micros,
  metrics.conversions, metrics.conversions_value,
  metrics.search_impression_share,
  metrics.search_budget_lost_impression_share,
  metrics.search_rank_lost_impression_share
FROM campaign
WHERE segments.date BETWEEN '{start}' AND '{yesterday}'
```
Save the rows as CSV with those field names as headers; the script reads
them (it divides cost_micros by 1,000,000). Status is today's status:
Google's hint says filtering on it "would understate cost and
conversions". Drop rows with zero impressions after the query if needed.

## Lag history
```sql
SELECT campaign.name, segments.conversion_lag_bucket, metrics.conversions
FROM campaign
WHERE segments.date BETWEEN '{start}' AND '{end_at_least_30_days_ago}'
```
`segments.conversion_lag_bucket` is "the number of days between the
impression and the conversion" (Google Ads API field reference). The
script reads bucket names such as LESS_THAN_ONE_DAY and ONE_TO_TWO_DAYS.
Not tested against a live account by PPC.io: confirm the field pair with
`get_resource_metadata` before running.

## Sources
- Fields: https://developers.google.com/google-ads/api/fields/latest/segments
- MCP server: https://github.com/googleads/google-ads-mcp
