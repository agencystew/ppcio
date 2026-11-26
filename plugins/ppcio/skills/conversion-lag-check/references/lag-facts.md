# Conversion timing: what Google says

All quotes checked on 17 Nov 2026.

- Click date, not conversion date: primary conversion columns "are
  calculated based on the time of the click, not the time of the
  conversion." https://support.google.com/google-ads/answer/6270625
- Conversions "can be reported up to 90 days after the click, depending
  on the conversion window you've chosen."
  https://support.google.com/google-ads/answer/6239119
- Days to conversion report: Campaigns, Ad groups or Search keywords
  table, segment icon, Conversions > Days to conversion, "up to 19 rows".
  Use a date range that "ends at least 30 days ago (or longer if you have
  a longer conversion window)". Same page.
- Google's own description of the segment: use it "to understand how long
  you should wait for a given reporting day before you interpret your
  conversion numbers." Conversion segments only work with conversion
  columns; Clicks, Impr. and Cost show "--".
  https://support.google.com/google-ads/answer/2454072
- Google shows lag hints in the account too: hover over Conversions in
  the Campaigns table, or open the bid strategy report.
  https://support.google.com/google-ads/answer/9347065
- For matching CRM numbers use "Conversions (by conv. time)" (API:
  `metrics.conversions_by_conversion_date`). Answer 6270625.
- API: `segments.conversion_lag_bucket` = "the number of days between the
  impression and the conversion".
  https://developers.google.com/google-ads/api/fields/latest/segments
- Status trap: Google's MCP server says status fields "hold the current
  status, not the status during the date range" and filtering on them
  "would understate cost and conversions".
  https://github.com/googleads/google-ads-mcp/blob/main/ads_mcp/tools/search.py

What PPC.io added (method, not Google's): the completeness curve, the
lag-adjusted estimate with a 90% range, the settled-week check and the
z-score verdict in scripts/lag_check.py.
