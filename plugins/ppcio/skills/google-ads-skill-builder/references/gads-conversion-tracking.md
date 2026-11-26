# Conversion tracking pitfalls

Every Google Ads skill is only as good as the conversions it reads. Build a
tracking sanity check into any skill that judges performance.

## Contents
- Click date vs conversion date
- Primary vs all conversions
- Common failure patterns
- Offline and enhanced conversions
- Sources

## Click date vs conversion date
- Google: primary conversion columns "are calculated based on the time of
  the click, not the time of the conversion." A click last week that
  converts this week is counted last week.
- So the newest days always look worse than they are. Skills must exclude
  the lag window or use "Conversions (by conv. time)" when judging recent
  performance.
- For matching CRM, GA4 or Shopify numbers, Google suggests "All conv. (by
  conv. time)". Google says discrepancies "often up to 20%" are expected
  versus Google Analytics because of attribution differences, and
  reporting can lag 24 to 48 hours.

## Primary vs all conversions
- "Conversions" counts primary actions only and is what bidding uses.
- "All conv." adds secondary actions and other sources such as
  view-through conversions.
- A skill must state which column it uses and why.

## Common failure patterns (checks for an audit or report skill)
- One conversion action drops to zero while traffic holds: tag or form
  broke. Split conversions by conversion action.
- Conversions jump with no traffic change: duplicate counting (for example
  a Google tag action and an imported GA4 action both primary, or a lead
  action counting "every" instead of "one").
- Micro actions (page views, scrolls, clicks to call without duration)
  set as primary: bidding chases cheap actions.
- Conversion value missing or flat on an ecommerce account: tROAS cannot
  work.
- Recent "drop" that is really lag.

## Offline and enhanced conversions
- Check upload health: successful_event_count / total_event_count and the
  status per conversion action (see gads-diagnostics.md, Workflow 4).
- Google's Developer Assistant checks first whether the account accepted
  the customer data terms, and reports "CRITICAL: Customer Data Terms NOT
  accepted." if not. It also reads whether enhanced conversions for leads
  is on. Worth a manual check in any account that uploads or hashes user
  data.
- Its CSV validator rejects rows missing gclid, conversion_time or
  conversion_value, and expects time like "YYYY-MM-DD HH:MM:SS-HH:MM"
  (with timezone).

## Sources
- Understand your conversion tracking data: https://support.google.com/google-ads/answer/6270625
- Developer Assistant troubleshoot-conversions: https://github.com/googleads/google-ads-api-developer-assistant
