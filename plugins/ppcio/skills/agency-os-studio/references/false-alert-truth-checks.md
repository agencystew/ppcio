# Hard-Won False-Alert Elimination & Truth Checks

Nothing kills an internal PPC audit or monitoring system faster than false alarms. Every rule below came from hand-verifying real false alerts across 50+ accounts and locking them permanently into code.

## 1. Statistical Quiet-Gap Break Detection (Stop Crying Wolf on Low-Volume Accounts)

Never alert *"0 leads in 48 hours!"* on a local account averaging 10 leads/month (2 quiet days happen constantly by pure luck). Trigger a break alert ONLY when ALL three hold simultaneously:
1. `quiet_days >= 2`
2. `quiet_days > 3 * (90 / leads_90d)` (exceeds 3x the account's normal inter-lead gap)
3. `spend_since_last_lead >= 2 * cpl` (at least 2x normal Cost Per Lead spent with zero leads)

Before firing, also verify:
- Check last lead by **conversion date**, NOT click date.
- Confirm the account is not paused and total leads fell `<60%` of the 6-month median (not just 1 redundant secondary action).
- Confirm the current month has not already recovered past day 7.

## 2. The 9 Mandatory False-Alert Filters

1. **Paused Ad Groups & Campaigns:** Ignore disapproved ads sitting inside PAUSED ad groups or PAUSED campaigns.
2. **Dead Historical URLs:** Never alert on a 404 URL from 90 days ago if **zero currently ENABLED ads** point to it today.
3. **Bot Walls (403 / 429) & Business Profiles:** Treat HTTP 403/429 as bot protection (not a dead site); only flag 0 / 404 / 5xx, and skip `google.com` Business Profile URLs.
4. **Google's `CONTACT` Conversion Category:** Never blindly classify `"CONTACT"` conversions as junk; real contact forms and click-to-call actions often live there. Verify actual conversion names instead.
5. **Expected-Leads Noise Floor:** `expected_leads = clicks * account_lead_rate`. If `< 2` (or `< 20 clicks`), zero conversions is noise (`too few clicks to judge`), NEVER waste!
6. **Low-Volume Max Conversions CPC-Spike Exception:** Uncapped Max Conversions on `<15 leads/30d` buying `<3 clicks/day` inflates CPCs. Exception: test 14-day Max Clicks with a Max CPC cap from the best historical month (Phrase/Exact only); revert if CPL worsens.
7. **Sitelinks on Single-Page Dedicated LPs:** Never recommend adding sitelinks to campaigns sending traffic to a dedicated conversion landing page (sitelinks leak buyers off the funnel).
8. **Adjacent Ad-Schedule Merging:** Merge contiguous daily schedule blocks (e.g., `06-11`, `11-14`, `14-23`) before counting running hours; never advise cutting evenings/weekends unless the business explicitly requested office hours only.
9. **Budget & Sequencing Laws:** Never recommend raising budget as Move #1 while waste exists; never raise an unspent daily budget; never instruct setting a `$0 / £0` daily budget (Google Ads rejects 0 -> pause); wait **7 full days** after tracking changes before changing bids or targets.

## 3. Regression-Locking Discipline

Every single false alert spotted by a human goes straight into a permanent regression test (`eval_behavioral.py`) and the deterministic engine, NEVER patched manually in an HTML file. Keep every new alert rule in shadow mode until it runs cleanly across 5 consecutive accounts.
