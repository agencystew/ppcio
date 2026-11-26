# What each kind of change usually moves

These are reasoning aids, not Google rules. Use them to explain a suspect,
then check the numbers.

- Status (paused, enabled, removed): everything for that campaign stops or
  starts. Paused items still count in past totals; status in reports is
  today's status (Google's MCP server: status fields "hold the current
  status, not the status during the date range").
- Budget: clicks and cost; lost IS (budget) moves the opposite way.
- Bidding (strategy, target CPA or ROAS, max CPC): a lower target CPA or a
  higher target ROAS usually means fewer clicks at lower CPC, and lost IS
  (rank) rises. A looser target does the opposite. Google says target CPA
  recommendations use "the average CPA from the last 30 days, adjusted for
  any conversion delays" (https://support.google.com/google-ads/answer/6268632).
- Keywords and match types: new broad keywords usually add clicks and
  cost; conversion rate often falls while the new traffic is sorted out.
  Check the search terms report.
- Auto-applied recommendations: Google can apply some recommendations on
  its own if auto-apply is on. In the API they show as client type
  GOOGLE_ADS_RECOMMENDATIONS
  (https://developers.google.com/google-ads/api/reference/rpc/latest/ChangeClientTypeEnum.ChangeClientType).
  The fix is often to review the auto-apply settings, not just the change.
- Negatives: small falls in clicks; a bad negative can quietly cut
  conversions.
- Targeting (locations, schedule, audiences, devices): clicks and cost,
  sometimes conversion rate.
- Ads and assets: mostly CTR and conversion rate, slowly.
- Conversion settings (action made primary or secondary, new action,
  counting): conversions jump or fall while clicks stay flat. Check this
  first when only conversions move across every campaign at once.

Change history in the Google Ads UI lists who changed what and when; the
API's change_event resource only covers the last 30 days and needs a
LIMIT of 10,000 or less (Google's diagnostics skill).
