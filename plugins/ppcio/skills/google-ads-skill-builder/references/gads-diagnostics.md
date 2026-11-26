# Diagnostics workflows and GAQL

Adapted from Google's `google-ads-api-account-diagnostics` skill, version
1.0.3, Copyright Google LLC, Apache License 2.0.
Source: https://github.com/google/skills/blob/main/skills/ads/google-ads-api-account-diagnostics/SKILL.md
Changes by PPC.io (17 Nov 2026): reworded for skill builders; added a
CSV path for each workflow; added the conversion-lag step, the status-filter
caveat from Google's MCP server, and user-set thresholds. Google's skill
gives no numeric thresholds; the ones here are settings, not Google rules.

## Contents
- Before any workflow
- Workflow 1: conversions or conversion value dropped
- Workflow 2: lost impression share
- Workflow 3: low lead flow in recent days
- Workflow 4: offline conversion uploads failing
- What Google's skill leaves out

## Before any workflow
1. Check the tools. If the MCP tools are there, use them. If not, say live
   diagnostics need the MCP server, then give the user the queries (or the
   CSV exports) to run themselves. Do not try shell scripts or other ways
   into the account; Google's skill forbids this because they "lack
   credentials and API access and will fail".
2. Find the right account. With an MCC, list accounts and keep only enabled
   client accounts, not managers:
```sql
SELECT customer_client.id, customer_client.descriptive_name,
  customer_client.status, customer_client.manager
FROM customer_client
WHERE customer_client.status = 'ENABLED' AND customer_client.manager = FALSE
```
3. Always compare two finite periods of the same length (current vs prior).
4. Added by PPC.io: before judging conversions, drop the last N days where
   N is the account's typical conversion lag, or compare using
   "Conversions (by conv. time)". Click-dated conversions make the most
   recent days look low.

## Workflow 1: conversions or conversion value dropped
1. Pull conversions, value and cost by date and device:
```sql
SELECT campaign.name, metrics.conversions, metrics.conversions_value,
  metrics.cost_micros, segments.date, segments.device
FROM campaign
WHERE segments.date >= '{start_date}' AND segments.date <= '{end_date}'
```
2. Pull the split by conversion action, without cost (cost cannot be
   selected with `segments.conversion_action`):
```sql
SELECT campaign.name, metrics.conversions, metrics.conversions_value,
  segments.date, segments.conversion_action
FROM campaign
WHERE segments.date >= '{start_date}' AND segments.date <= '{end_date}'
```
3. Is the loss limited to one device or one conversion action? One action
   falling to zero while others hold usually means tracking, not demand.
4. If offline imports are used, check upload health (Workflow 4).
CSV path: Campaigns view segmented by day and device; then the same with
Conversions segmented by Conversion action.

## Workflow 2: lost impression share
```sql
SELECT campaign.name, metrics.search_impression_share,
  metrics.search_rank_lost_impression_share,
  metrics.search_budget_lost_impression_share
FROM campaign
WHERE segments.date >= '{start_date}' AND segments.date <= '{end_date}'
```
- High lost IS (budget): opportunities lost to budget. Google's next step:
  raise budget. Check first that the campaign hits target CPA or ROAS; more
  budget on an unprofitable campaign loses more money.
- High lost IS (rank): lost to ad rank (bids or quality). Next step: improve
  ad quality or bids.
- "High" is a user setting. See gads-impression-share.md.

## Workflow 3: low lead flow in recent days
1. Confirm the drop, after removing the lag window.
2. Split the cause: did traffic (impressions, clicks) drop, or conversion
   rate (conversions / clicks)?
```sql
SELECT campaign.id, campaign.name, segments.date, metrics.impressions,
  metrics.clicks, metrics.ctr, metrics.conversions,
  metrics.conversions_from_interactions_rate
FROM campaign
WHERE segments.date >= '{start_date}' AND segments.date <= '{end_date}'
ORDER BY segments.date DESC
```
3. Traffic dropped: run Workflow 2 (budget or rank), or search demand fell.
4. Conversion rate dropped: split by device and by conversion action.
5. Check what changed just before the drop:
```sql
SELECT change_event.change_date_time, change_event.change_resource_name,
  change_event.resource_change_operation, change_event.changed_fields
FROM change_event
WHERE change_event.change_date_time >= '{start_date}'
  AND change_event.change_date_time <= '{end_date}'
LIMIT 10000
```
`change_event`: past 30 days only, LIMIT at most 10,000, no metrics.

## Workflow 4: offline conversion uploads failing
```sql
SELECT
  offline_conversion_upload_conversion_action_summary.conversion_action_name,
  offline_conversion_upload_conversion_action_summary.successful_event_count,
  offline_conversion_upload_conversion_action_summary.total_event_count,
  offline_conversion_upload_conversion_action_summary.status
FROM offline_conversion_upload_conversion_action_summary
```
- No rows: there are no offline uploads. Stop and say so. Do not retry or
  write scripts (Google's rule).
- Rows: success rate = successful_event_count / total_event_count; read
  `status` for the failure reason.
- Google's Developer Assistant also checks whether the account accepted the
  customer data terms (`customer.conversion_tracking_setting.accepted_customer_data_terms`)
  and lists alerts with error percentages per upload client.

## What Google's skill leaves out
Worth adding in your own skills:
- No conversion lag handling (see step 4 above).
- No numeric thresholds: "high" lost IS is never defined.
- No search terms, Quality Score, auction insights or PMax channel checks.
- No business judgement. Google's Developer Assistant rules even say:
  "Never provide marketing, legal, or business strategy advice."
