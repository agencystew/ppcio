# Live data with Google's Google Ads MCP server

Read when the MCP tools are connected. Check fields with
`get_resource_metadata` first ("Do not guess the fields." Google's tool
text). If the tools are not there, ask for the CSV downloads instead.

## Change events (last 30 days only)
Adapted from Google's google-ads-api-account-diagnostics skill (Apache
2.0, see NOTICE.md). Google's notes: change_event needs a date filter
within the past 30 days, a LIMIT of at most 10,000, and cannot select
metrics.
```sql
SELECT change_event.change_date_time, change_event.change_resource_type,
  change_event.resource_change_operation, change_event.changed_fields,
  change_event.user_email, change_event.client_type, campaign.name
FROM change_event
WHERE change_event.change_date_time >= '{start}'
  AND change_event.change_date_time <= '{end}'
ORDER BY change_event.change_date_time DESC
LIMIT 10000
```
Save as CSV with those field names; the script reads them. For older
changes use the Change history download in the UI.

## Daily campaign data
```sql
SELECT segments.date, campaign.name, campaign.status,
  metrics.impressions, metrics.clicks, metrics.cost_micros,
  metrics.conversions, metrics.search_budget_lost_impression_share,
  metrics.search_rank_lost_impression_share
FROM campaign
WHERE segments.date BETWEEN '{start}' AND '{yesterday}'
```
No status filter: Google's MCP hint says filtering on status "would
understate cost and conversions".

## Sources
- change_event fields: https://developers.google.com/google-ads/api/fields/latest/change_event
- MCP server: https://github.com/googleads/google-ads-mcp
