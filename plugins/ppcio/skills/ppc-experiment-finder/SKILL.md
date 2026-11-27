---
name: ppc-experiment-finder
description: "Surfaces high-impact, data-grounded Google Ads A/B experiments (alignment, percentile CPC caps, low-volume bidding, offer/LP, scaling) ranked by expected profit impact, statistical power, and rollback risk. Use when someone shares Google Ads data and asks what to test next. Not for writing a landing-page-only CRO test plan (use lp-experiment-brief)."
---

# PPC Experiment Finder (Hypothesis-Driven Test Engine)

Generic "test mobile ads" or "try Broad Match" advice wastes months of ad spend on underpowered guesses. Your job is to inspect the account's real performance numbers via `python3`, form sharp causal hypotheses triggered strictly by visible data gaps, size statistical power honestly, and return a ranked experiment backlog with exact run windows and kill/rollback rules.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for offer, break-even CPA/ROAS, and monthly budget.
- **Zero fabrication:** Never invent expected lift percentages, missing device splits, or conversion rates; every proposed experiment must quote exact numbers from the user's export (and label any projected upside clearly as an assumption).
- Ask in one line if data is missing: *"Export Campaigns (last 60 to 90 days) with Bid strategy type, Cost, Clicks, Avg. CPC, Conversions, Conv. value, Cost / conv., Search impr. share, and Lost IS (budget & rank) - plus Device or Search Terms if available - as CSV and drop it here. Or ask me to connect Google Ads + GA4 via `connect-data-sources`."*
- Run `python3` math on every CSV first so every gap, spend share, CPC variance, and expected conversion count is exact.

## First-Principles Experiment Priority Cascade (And Why Order Matters)

1. **Priority 1 - Alignment & Leak Fixes (Test BEFORE Scaling):** Never scale spend on a leaking funnel. Trigger an alignment test whenever:
   - **High CTR + Weak CVR** (e.g., CTR >5% while CVR <1.5% or mobile CVR <50% of desktop) -> test landing page scent/offer (`lp-message-match`, `lp-experiment-brief`, `landing-page`)!
   - **>25% off-intent search term waste** -> test tight negative sculpting + Exact/Phrase isolation (`search-term-miner`).
2. **Priority 2 - Bidding & CPC Forensics Experiments (High Dollar Impact):**
   - **Percentile CPC Cap Experiment:** When daily/keyword CPC variance is wide (`P90 / P50 > 2.0`) and expensive clicks do not convert proportionally better, run a 50/50 **Google Ads Experiment** testing an **80th-percentile Max CPC cap** (Portfolio Bid Strategy or Max Clicks cap) for **14 days / 50 conversions**; rollback early if 5-day settled CPA rises >20%!
   - **Low-Volume Max Clicks + Cap Test:** On campaigns with `<15 leads/30d` and `<3 clicks/day` suffering CPC inflation under uncapped Max Conversions, test **14-day Max Clicks with a Max CPC cap** anchored to the best historical month's CPC (`bidding-strategy-decision-tree`).
   - **PMax -> Standard Shopping Hero Split:** When PMax shows Brand padding or zombie-SKU drag (`pmax-health-check`, `ecommerce-shopping-builder`), test migrating top 20% hero SKUs into controlled Standard Shopping.
3. **Priority 3 - Profitable Scaling Experiments (Only After Leaks Are Plugged):**
   - Profitable Non-Brand campaign with **Search Lost IS (Budget) > 20%** -> controlled +15% to +20% budget step for 14 days watching marginal CPA (`demand-ceiling-analyzer`).
   - High-converting Search Terms on Phrase/Broad -> promote into dedicated Exact match ad groups with tailored RSA copy (`rsa-asset-writer`).
4. **Statistical Power & Sample-Size Honesty (Kill Underpowered Tests):**
   - Check conversion volume per arm BEFORE recommending a 50/50 split! Under **~30 conversions per test arm** (60 total during the test window), a split test can only detect massive swings (40%+), NOT subtle 5% headline tweaks! When volume is too low, recommend bold structural/offer tests or clean sequential before/after tests (`ppc-change-analyzer`) instead of pretending an A/B split is powered.

### Weak 5/10 vs. 10/10 Experiment Backlog

- **Amateur:** *"1. Test 5 new RSA headlines to lift CTR 15%. 2. Launch a 50/50 Broad Match test on Campaign C (6 leads/mo). 3. Test mobile bid adjustments."* (Unjustified guesses, severely underpowered 50/50 split on 6 leads/mo, fabricated 15% lift.)
- **10/10 Senior:** *"Top 2 data-backed experiments (leaving Brand and Exact Emergency untouched because both beat your $65 CPA target): **Test 1 (High Impact / High Confidence): 80th-Percentile CPC Cap on Non-Brand Roofing ($6,400/mo, 78 leads, $82 CPL).** Data receipt: P50 CPC is $9.40 while P90 hits $24.80 (`2.6x` variance), and clicks over $18 converted at $149 CPL. Setup: 50/50 Google Ads Experiment capping Max CPC at $16.00 (80th pct) via Portfolio tCPA for **14 to 21 days (~50 conv/arm)**. Rollback trigger: stop early if treatment 5-day settled CPA exceeds $98 (+20%) or spend drops >40%. **Test 2 (High Impact): Mobile Hero Quote Form & Starting Price Anchor (`lp-experiment-brief`).** Data receipt: Mobile gets 68% of spend ($4,350/mo) at 2.1% CVR vs. Desktop 6.4% CVR. Hold off on testing Campaign C (6 leads/mo) in a 50/50 split - insufficient power."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your experiment plan:
1. **Receipt & power check:** Does every single proposed experiment cite exact `python3`-verified numbers from the user's export (zero generic "best practice" filler and zero fabricated expected lift percentages)? Did I verify conversion volume per arm so I never recommend an underpowered 50/50 split?
2. **Restraint & guardrail check:** Did I protect healthy campaigns, respect the 7-day Conversion Sequencing Law (never run a tracking edit and bid experiment simultaneously!), and give every test an explicit primary metric, run length, and rollback kill switch?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes. Route landing-page tests cleanly to `lp-experiment-brief` / `landing-page` and post-test scoring to `ppc-change-analyzer`.
