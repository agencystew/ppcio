---
name: demand-ceiling-analyzer
description: "Diagnose whether Google Search still has profitable headroom to scale or has hit its demand ceiling using Search Impression Share, Lost IS (Budget vs. Rank), marginal CPA/ROAS curves, and SEO-PPC overlap. Use when someone asks if they can spend more on Search, why scale is stalling, or before raising budgets. Not for comparing new platforms like Meta or LinkedIn (use channel-expansion-planner)."
---

# Demand Ceiling & Marginal Scale Analyzer

Raising Google Ads budgets blindly on a saturated Search campaign does not buy more cheap customers; it forces Smart Bidding to pay double for bottom-of-the-barrel marginal clicks and broad-match junk. Your job is to test a clear hypothesis about **where real profitable Search headroom actually exists** using impression share and marginal return math, so the business knows whether to scale Search, improve CVR/Rank first, or expand to new channels.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for business model, target CPA/ROAS, contribution margin, and geography.
- Ask in one line if data is missing: *"In Google Ads, open Campaigns (last 30 to 90 days, plus a prior spend tier if you scaled recently), include Cost, Clicks, Conversions, Conv. value, Cost / conv., Search impr. share, Search lost IS (budget), and Search lost IS (rank), Download .csv and drop it here. Or ask me to help connect Google Ads + Search Console via `connect-data-sources`."*

## First-Principles Scaling Math (Average CPA Lies; Marginal CPA Decides)

Run exact arithmetic via `python3` whenever given CSV exports; never eyeball headroom or marginal return, and never fabricate industry benchmarks.

1. **Read the 3-way Impression Share Split (Non-Brand ONLY; always strip Brand first):**
   - **High Search Lost IS (Budget) (>15% to 20%) on profitable Non-Brand campaigns:** Genuine unmet demand. Why: Google already wins the auction cheaply and simply runs out of daily budget. Scale in controlled 15% to 20% steps every 7 to 14 days while watching marginal CPA.
   - **High Search Lost IS (Rank) (>30% to 40%) with low Lost IS (Budget):** Raising budget alone will NOT spend or will spike CPC. Why: you are losing auctions on Ad Rank (Quality Score x Bid x Landing Page CVR), not budget. Fix `quality-score-repair`, `landing-page`, or `bidding-strategy-decision-tree` before adding budget.
   - **Already >=75% to 85% Search Impression Share on core Non-Brand:** You are near the auction ceiling! Squeezing out the last 10% to 15% of Search IS almost always costs 1.5x to 2.5x your average CPA.
2. **Marginal Return Check:** Compare incremental spend vs. incremental conversions across spend tiers (`Marginal CPA = Delta Cost / Delta Conversions`). Even if blended CPA looks acceptable, stop scaling Search if **marginal CPA exceeds break-even CPA** (see `ppc-playbooks/references/scaling.md` and `ppc-playbooks/references/unit-economics.md`).
3. **Check for Organic / SEO Cannibalization & Conversion Ceiling:**
   - Before pouring extra Search budget into keywords where the business already ranks Organic #1 to #3 with low competition, note the 10% to 30% organic click cannibalization risk (cross-check Search Console via `connect-data-sources`).
   - Remember: lifting landing page CVR from 3% to 4.5% (`landing-page`) expands profitable Search headroom by 50% automatically because you can afford higher Ad Rank at the same CPA.
4. **Small-sample & restraint discipline:** Never judge headroom on <20 clicks or <10 conversions, never raise an unspent budget, and never recommend raising spend on a leaking account before waste is cut (`ppc-strategic-audit`).

### Weak 5/10 vs. 10/10 Scaling Verdict

- **Amateur:** *"Your Search Impression Share is 58%, so you have 42% room to grow. Double your daily budget to capture the rest!"* (Ignores whether the 42% loss is Rank vs. Budget, ignores Brand padding, ignores marginal CPC spike.)
- **10/10 Senior:** *"Non-Brand Core Search sits at 58% IS, with 34% Lost IS (Rank) and only 8% Lost IS (Budget), at $64 CPA vs. $70 target. Doubling budget will barely spend or will inflate CPCs. True budget headroom right now is only ~$450/mo (+12%). To open another $3,000/mo of profitable Search volume: (1) raise LP mobile CVR from 2.1% to 3.5%+ (`landing-page`), (2) fix 4 spend-carrying keywords with Below Average Ad Relevance (`quality-score-repair`), and (3) step tCPA up 10% for 14 days only after tracking/LP wins land; revert if marginal CPA crosses $75."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your ceiling verdict, challenge your own math and assumptions:
1. **Trap & math check:** Did I strip Brand campaigns before judging Search IS? Did I verify Budget-lost vs. Rank-lost separately with exact math and zero invented benchmarks? Could recent lag (`conversion-lag-check`) make marginal CPA look artificially worse?
2. **Guardrail check:** Does the scaling plan use controlled 15% to 20% budget/target steps with a clear 14-day marginal CPA rollback threshold?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes. Route to `channel-expansion-planner` ONLY when core Non-Brand Search is genuinely capped, or to `landing-page` / `quality-score-repair` when Rank/CVR is the true bottleneck.
