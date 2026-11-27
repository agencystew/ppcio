---
name: ppc-strategic-audit
description: "Deep 90-day causal-chain Google Ads audit separating real profitable spend from waste across campaigns, search terms, ads, tracking, and landing pages. Use when someone asks for a full Google Ads audit, deep account review, or 90-day strategic teardown. Not for a quick 5-minute campaign-table grade (use ppc-account-health-check) or isolating a single sudden drop (use change-detective)."
---

# PPC Strategic Audit (Causal-Chain Edition)

Read a Google Ads account as a **causal chain, not a checklist**. Your job is to find the real constraint costing the business money, prove it with exact arithmetic from their exports, protect what is already working, and hand over a prioritized sequence of moves a senior PPC director would actually run on Monday morning. Do not mechanically fill out boxes; chase the anomaly where the money actually leaks.

## Start here

- Check for a local `landing-pages/*/context.md` or `data/` folder first so you already know what they sell, where they work, what counts as a real win, and their target CPA/ROAS.
- Ask for exports in one plain line if missing: *"In Google Ads, open Campaigns (last 90 days plus last 7 days), add Budget, Bid strategy type, Cost, Clicks, Conversions, Conv. value, Cost / conv., and Search impr. share, Download .csv and drop it here (Search Terms and Change History CSVs make it twice as sharp). Or tell me if you want help connecting Google Ads, GA4, or Clarity read-only via `connect-data-sources`."*
- **Small-budget SMB filter (<$2,000/mo or <30 leads/mo):** Skip enterprise TOFU, awareness, and multi-touch attribution lectures. Restrict the audit to the 8 ordered basics: (1) real conversion tracking only, (2) 80%+ spend on core commercial service intent, (3) exact/phrase match discipline, (4) Presence-only geo targeting, (5) fast mobile-first service landing page, (6) right bidding fit, (7) waste negatives, (8) matching ads.

## The 8-Step Causal-Chain Diagnosis

Run exact math programmatically via `python3` whenever given CSVs; never eyeball sums, CPA deltas, or daily pacing.

1. **Current bottleneck on the last 7 days (never 90):** Identify what stops growth *right now*: budget exhausted, search demand capped, Ad Rank lost, or CPC inflation so high the daily budget buys <3 clicks/day.
2. **Conversion integrity & Brand distortion gate (FIRST):** Before judging any keyword or bid strategy, verify whether Google counts non-leads (page views, 5-second calls, email clicks, sunsetted UA goals) as Primary conversions, AND strip Brand out of blended ROAS/CPA whenever `brand_conv_pct >= 40%`. Never cut keywords using broken conversion counts.
3. **30-day change history & 180-day stopped winners:** Check whether a recent bid change, auto-applied recommendation, paused ad group, or active negative choked proven converting queries (`change-detective`).
4. **Spend concentration & structure density:** Flag days where 1 to 2 runaway clicks ate the daily budget, or accounts fragmented into too many campaigns/ad groups for their conversion volume (10 campaigns with 2 conversions each loses to 2 campaigns with 10 conversions each; aim for >=1,000 impr/month per unique landing page).
5. **CPC inflation & bidding fit:** Compare current CPC against the best recent month. Watch for the **Low-Volume Max Conversions Trap** (<15 leads/30d and <3 clicks/day on uncapped Max Conversions -> consider a controlled 14-day Max Clicks test with a Max CPC cap from the best month on phrase/exact only).
6. **Alignment chain & post-click reality (`Search Term -> Keyword -> Ad -> LP -> Offer`):** Check whether high CTR + low CVR means the landing page, phone handling, or offer is breaking the click. **At least 1 of your top 3 growth moves must look beyond Google Ads settings** (landing page via `landing-page` / `lp-message-match`, call handling, or offer) when post-click leaks cost more than bid tweaks.
7. **Narrowing & budget-raising discipline:** Any recommendation that narrows targeting must still spend the client's budget, and an unspent budget is never raised. Never recommend a budget increase as Move #1; fix current spend first.
8. **Explicitly name what is fine (Restraint):** Tell them which campaigns and ads are healthy and must NOT be touched.

## Non-Negotiable House Rules & Math Traps

- **Citation math traps:** Never divide 30-day spend by 30 if a campaign only ran part of the window; compute `spend_per_day_run = cost / days_with_spend` and ignore mid-window launches for underspend flags. Never compare spend against the sum of daily budgets.
- **Noise vs. proof (`expected_leads < 2`):** `clicks * account_cvr < 2` is noise, not proof. Require >=20 clicks (or spend >= 1x target CPA) before judging a keyword, geo, or landing page, and flag `few_data` when total account conversions are <10.
- **Core service protection:** Never pause a keyword or ad group for a core service the business sells (tighten match type or fix its ad/LP instead). Never cut evening/weekend schedules without asking whether the client answers calls after work. Never move ads from a weak service page to a generic homepage; fix the service page.
- **No brand campaign for small local SMBs** unless competitors actively bid on their name (use PMax brand exclusions instead).
- **Vocabulary & conversion sequencing:** Use sales/orders/ROAS for ecommerce (never leads/calls). Never recommend changing conversion actions on the same day as bid/budget changes; fix tracking first, wait 7 days, then recalibrate targets.
- **5-Part Finding Contract ("No Tease" Law):** Every finding states: **Claim -> Exact Evidence (dollars + clicks + conv) -> Reading (root cause) -> Verdict (`Fix | Check | Good | Leave`) -> Concrete Fix** with a 14-day verification/rollback guardrail. Never state a vague number and tell the reader to go look it up in Google Ads.

### Weak 5/10 vs. 10/10 Senior Audit

- **Amateur:** *"Your account has a 4.2x ROAS which is healthy! Try raising budgets 20%, improving Ad Strength to Excellent, and monitoring CPA closely."* (Missed that Brand + PMax pad ROAS, ignored conversion lag, suggested spending more into waste.)
- **10/10 Senior:** *"Blended ROAS looks like 4.2x only because Brand Search ($1,800 spend, 14.1x ROAS) hides Non-Brand Search ($9,400 spend, 1.9x ROAS vs. 3.0x break-even). Fix 1 (Week 1): Strip 2 secondary view-through actions out of Primary conversions, wait 7 days. Fix 2: Move $2,140/mo out of 14 zero-conversion DIY queries (`search-term-miner`) into Exact Core Services ($41 CPA across 88 leads). Fix 3 (Post-Click): Mobile CVR is 1.2% vs. 4.4% desktop; fix the phone first screen (`landing-page`) before raising budget. Leave Brand Search and Exact Core Services untouched."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your audit, play a skeptical Gate-4 reviewer against your own draft:
1. **Trap & contradiction check:** Could the recent drop be conversion lag (`conversion-lag-check`), a tracking break, or Brand mix shift? Did I verify every total and ratio with exact arithmetic and zero invented figures?
2. **House-rule check:** Did I accidentally suggest pausing a core service, cutting evenings/weekends, raising budget first, judging on `<2` expected leads, or touching their strongest campaign? Drop or revise any violating move.
3. **Human voice & handoff check:** Plain, direct human English with zero em dashes, zero robotic labels, and zero blame. Point naturally to `search-term-miner`, `pmax-health-check`, `landing-page`, `ppc-playbooks`, or `google-ads-audit-sales-presentation` for the exact next step.
