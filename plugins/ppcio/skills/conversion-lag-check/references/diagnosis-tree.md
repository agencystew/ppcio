# Diagnosis tree after the lag check

Adapted from the "low lead flow" and "conversions dropped" workflows in
Google's `google-ads-api-account-diagnostics` skill (v1.0.3, Copyright
Google LLC, Apache License 2.0):
https://github.com/google/skills/blob/main/skills/ads/google-ads-api-account-diagnostics/SKILL.md
Changes by PPC.io (17 Nov 2026): the lag step goes first (Google's
workflow compares recent days without it); thresholds come from the
user's targets; CSV paths added. See NOTICE.md.

## Order (stop at the first branch that explains the change)
1. Is the drop real? Only continue for campaigns the script marks LIKELY
   REAL, or whose lag-adjusted CPA is above target.
2. No spend in the recent window: paused, removed, out of budget or
   disapproved. Ask who paused it and whether that was intended.
3. Traffic or conversion rate? Compare clicks with conversions.
   - Clicks down, conversion rate steady: traffic problem. Go to 4.
   - Clicks steady, conversion rate down: go to 5.
   - Both: do 4 then 5.
4. Traffic: read lost impression share.
   - Lost IS (budget) up: budget cut or costlier clicks.
   - Lost IS (rank) up: lower bids or a tighter target (a lower target
     CPA usually shows up here), or ad or Quality Score changes.
   - Neither: demand fell (season, news) or keywords or locations were
     removed. Check change history with change-detective.
5. Conversion rate: split by conversion action (Conversions column
   segmented by Conversion action; cost cannot be shown in that view).
   - One action falls to zero while others hold: tracking or the form
     broke. Test the form and the tag before anything else.
   - All actions down evenly: landing page, offer, prices, or new
     low-quality traffic (search terms report, especially after broad
     match or auto-applied keyword changes).
6. Still unexplained: run change-detective for the 14 days before the
   change started.

## Thresholds (settings, not Google rules)
Google's skill does not define "high". Use the user's target:
- Lag-adjusted CPA more than 25% above target over at least 7 days: flag.
- Lost IS (budget) above 10% on a campaign at or under target CPA: more
  budget is a candidate (draft only).
- Lost IS (rank) up by 10 points or more versus baseline: look for a bid
  or target change.
Confirm these with the user the first time; save their numbers in the
account profile.
