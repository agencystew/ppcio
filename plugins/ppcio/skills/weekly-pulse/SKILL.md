---
name: weekly-pulse
description: "Internal PPC manager weekly diagnostic comparing this week vs. last week vs. the 4-week rolling baseline, checking lag and tracking first, filtering small-sample noise, and returning 3 to 5 concrete weekly moves. Use for internal weekly account triage. Not for client-facing Monday emails (use weekly-client-report) or monthly/quarterly executive summaries (use ppc-report-narrator)."
---

# Weekly Pulse (Internal Operator Triage)

A great Monday PPC review takes 5 minutes: form a sharp hypothesis about **what actually broke, what is just conversion lag or noise, what healthy campaigns to leave alone, and the exact 3 to 5 actions to finish this week**. Never hide behind scary robotic labels or dump 20 metrics without a causal diagnosis.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for target CPA/ROAS, monthly budget, and Brand vs. Non-Brand rules.
- **Zero fabrication:** Never invent missing 4-week baselines, industry benchmarks, or conversion rates; mark missing comparison data plainly and run `python3` math on every CSV so WoW %, vs-4-week-baseline %, Brand vs. Non-Brand totals, and dollar deltas are 100% exact.
- Ask in one line if data is missing: *"In Google Ads, open Campaigns, compare last 7 days vs. prior 7 days (plus 30-day / 4-week baseline if handy), include Cost, Clicks, Conversions, Conv. value, Cost / conv., and Lost IS, Download .csv and drop it here. Or ask me to connect Google Ads via `connect-data-sources`."*

## First-Principles Weekly Triage Order (And Why Fundamentals Come Before Edits)

1. **Sanity-Check Lag & Tracking FIRST (Stop False-Alarm Edits!):**
   - Conversions are dated by click day, not conversion day. If only the last 2 to 4 days dipped while clicks and spend stayed steady, flag **conversion lag** (`conversion-lag-check`) before recommending any bid or campaign pause!
   - If clicks held steady and conversions suddenly hit **0 across 2+ high-click days** (beyond normal Poisson variance), treat **tracking breakage** (`conversion-tracking-planner`) as Priority #1 before touching ads.
2. **Strip Brand from Non-Brand + Compare Triple Windows (This Week vs. Last Week vs. 4-Week Avg):**
   - Always separate Brand from Non-Brand so cheap brand clicks never mask a Non-Brand CPA spike.
   - Why triple windows matter: a +25% WoW CPA jump after an unusually lucky prior week may still sit right on the 4-week average (normal variance, not an emergency!).
3. **Apply the Small-Sample Noise Floor:**
   - If `expected_leads = clicks * account_cvr < 2` (or under 20 clicks in the 7-day window), classify as **noise, not proof** and hold off on structural edits.
4. **Isolate the Single Bottleneck Lever (Spend -> Clicks/CPC -> CVR -> CPA/ROAS):**
   - Pinpoint whether a real CPA/ROAS move came from **CPC inflation** (auction/bidding), **CTR drop** (ad fatigue/competition), **CVR collapse** (search-term leak or landing page issue), or **budget exhaustion** (profitable campaign losing >20% IS to budget).
5. **Restraint on Healthy Campaigns:** Explicitly list campaigns hitting target CPA/ROAS as **PROTECT - DO NOT TOUCH** this week so nobody breaks winners by over-tinkering.

### Weak 5/10 vs. 10/10 Weekly Pulse

- **Amateur:** *"CRITICAL ALERT: Financial bleeding detected in Campaign A (CPA +28% WoW). Data integrity risk in Campaign B. Visibility crisis in Campaign C. Action: optimize keywords and monitor closely."* (Robotic labels, ignores 4-week baseline, ignores lag, zero concrete actions.)
- **10/10 Senior:** *"Non-Brand spend held steady at $3,140 (-2% WoW) with 38 leads ($82.63 CPL vs. $65 target and $69 4-week avg). Ignore the apparent 2-day dip on Sat/Sun (normal conversion lag; settled Mon-Fri was $79 CPL). Real driver: **Campaign B (Broad HVAC)** CPC jumped +31% ($9.10 -> $11.92) while CVR fell from 6.1% to 3.4% after 4 auto-applied broad keywords launched Tuesday. This week's 3 actions: (1) Run `search-term-miner` on Campaign B and block the 11 off-intent commercial queries ($490 wasted); (2) Pause the 4 auto-applied keywords and disable Auto-Apply 'Add new keywords' (`change-detective`); (3) **DO NOT TOUCH** Campaign A (Exact AC Repair: $51 CPL, 22 leads) or Brand ($14 CPL). Recheck settled 7-day CPL next Monday; revert nothing on Campaign A."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your weekly pulse:
1. **Trap & math check:** Did I check conversion lag, Brand distortion, 4-week baseline context, and small-sample noise (`expected_leads < 2`) before calling any move a real problem? Every dollar and % verified via `python3` with zero fabricated numbers?
2. **Actionability & restraint check:** Are recommendations capped at **3 to 5 concrete moves completable this week**, each naming the exact campaign, dollar impact, and rollback/recheck trigger, while explicitly protecting healthy campaigns?
3. **Human voice & handoff:** Direct, plain human English with zero robotic alarm labels, zero em dashes, and zero form blanks. Link cleanly to `conversion-lag-check` (if lag suspected), `change-detective` (if sudden shift), or `weekly-client-report` (to turn findings into a client-safe Monday email).
