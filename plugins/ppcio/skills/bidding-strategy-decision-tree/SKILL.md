---
name: bidding-strategy-decision-tree
description: "Data-maturity Google Ads bidding selector (Manual CPC, Maximize Clicks with CPC cap, Maximize Conversions, Target CPA, Target ROAS) with percentile CPC forensics, low-volume CPC-inflation protection, transition sequencing, and rollback bands. Use when choosing, auditing, or switching a campaign bid strategy. Not for checking month-end spend pacing (use budget-pacer)."
---

# Bidding Strategy Decision Tree & CPC Forensics

Bidding strategy controls the economic engine of a Google Ads account. Blindly applying "Target CPA everywhere" starves low-volume campaigns, while running uncapped Maximize Conversions on tiny budgets lets Google pay 3x normal CPCs for random clicks. Your job is to evaluate each campaign individually from real conversion density and CPC distribution math, sequence changes safely, and define exact rollback triggers before touching a single setting.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Check if a local `landing-pages/*/context.md` exists first for business model, break-even CPA/ROAS, and close rate.
- Ask only for missing campaign metrics: per-campaign 30-day **Spend, Clicks, Avg. CPC, Conversions, Conv. value, Bid strategy, Limited by budget status, and Brand vs. Non-Brand**. Offer `connect-data-sources` if they want live Google Ads data pulled directly.
- **Run the deterministic CPC forensics & maturity engine first:**
  `python3 "${CLAUDE_SKILL_DIR}/scripts/cpc_forensics.py" --csv <campaigns_or_daily.csv> --days 30 [--target-cpa <CPA>] [--brand "<brand regex>"]`
  It computes per-campaign conversion density, flags Low-Volume Max Conversions CPC inflation (`<15 conv/30d & <3 clicks/d`), calculates `P50/P75/P80/P90` CPC + Variance Ratio (`P90/P50`), and outputs exact 80th-percentile Max CPC cap targets.

## First-Principles Bidding Rules (And Why Each Exists)

1. **Dual-Constraint Priority (Clean Signal Before Smart Bidding):** Never switch a campaign to Smart Bidding while primary conversions include junk (page views, 5-second calls, duplicate submits) or while Search Terms are leaking >25% waste. Why: Smart Bidding ruthlessly optimizes toward whatever signal you feed it; garbage in produces expensive garbage faster. Fix `conversion-tracking-planner` and `search-term-miner` first.
2. **Conversion Sequencing Law (7-Day Separation Rule):** NEVER change Primary conversion actions and bid strategies/targets on the same day. Wait **7 full days** after any tracking edit so Smart Bidding digests the clean signal before touching bids or targets.
3. **Campaign Data-Maturity Gates (Evaluate Per Campaign, Never Account-Wide):**
   - **<15 conversions/30d (Low-Volume Exception):** Uncapped Maximize Conversions with **<15 leads/30d and <3 clicks/day** frequently triggers severe CPC inflation (Google bids $30+ on $8 keywords trying to buy a conversion). Fix: run a **14-day Maximize Clicks test with a Max CPC cap** anchored to the campaign's best historical month's average CPC (or 80th-percentile CPC) until conversion volume stabilizes.
   - **15 to 29 conversions/30d:** Maximize Conversions (with strict search-term hygiene) OR Maximize Clicks + CPC cap if CPCs spike >35% above historical norm. Hold off on strict Target CPA until volume crosses ~30/month consistently.
   - **30+ conversions/30d (Lead Gen):** Target CPA set within **10% to 20% of trailing 30-day actual CPA** (never an aspirational fantasy target like half your real CPA, which throttles spend to zero).
   - **50+ purchases/30d with clean dynamic revenue (Ecommerce):** Target ROAS set conservatively near trailing 30-day actual ROAS, segmented by margin tier (`ecommerce-shopping-builder`).
4. **Percentile CPC Forensics (Catching Hidden Overbidding):** Averages hide tail spikes. When daily or keyword CPC data is available, compute **P50 (median), P75, P90, and Variance Ratio (`P90 / P50`)** in `python3`. If `P90 / P50 > 2.0` and high-CPC clicks are not converting proportionally better, test an **80th-percentile Max CPC cap** (via Portfolio Bid Strategy max CPC or Max Clicks cap) for 14 days / 50 conversions; rollback if CPA rises >20% for 5 consecutive days.
5. **No-Portfolio Brand + Non-Brand Mixing:** Never bundle Brand and Non-Brand campaigns into the same portfolio bid strategy. Why: cheap $10 Brand conversions make blended CPA look healthy while Non-Brand silently overbids at $120.
6. **Learning-Period Degradation Bands (Exact Rollback Discipline):**
   - **>50% drop in conversions or spend in 3 to 5 days:** Do not "wait out learning"; check for an overly tight target or tracking break and revert immediately.
   - **30% to 50% drop by day 7:** Audit search terms, impression share lost to rank, and lag (`conversion-lag-check`) before deciding.
   - **<30% fluctuation during days 1 to 14:** Hold steady for the full 14-day window; tweaking every 3 days traps the campaign in permanent re-learning.

### Weak 5/10 vs. 10/10 Bidding Recommendation

- **Amateur:** *"Switch all campaigns to Target CPA at your $40 goal and give Smart Bidding 30 days to learn."* (Starves a 9-lead/mo campaign, sets an impossible target 45% below actual $72 CPA, mixes Brand and Non-Brand, zero rollback plan.)
- **10/10 Senior:** *"Keep Brand Search on Manual CPC / Target Impression Share (85% abs. top, $1.80 cap) so it never pads Non-Brand. For Non-Brand Roofing (42 leads/30d, $74 actual CPA), move from uncapped Max Conversions to Target CPA at **$70** (not $40 - cut in 10% steps every 14 days once stable). For Commercial Roof Repair (7 leads/30d, 2.1 clicks/day, Avg CPC jumped from $11 to $29 under Max Conversions), switch to **Maximize Clicks with a $12.50 Max CPC cap** (your Q1 best-month CPC) for 14 days. Rollback rule: revert if 5-day settled CPA rises >20% or volume falls >50% after day 4. Change one campaign first, wait 7 days before touching the next."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your bidding plan, challenge every single recommendation:
1. **Trap & restraint check:** Did I check conversion tracking cleanliness and Brand vs. Non-Brand separation first? Did I avoid touching healthy campaigns already hitting target CPA/ROAS? Did I verify zero fabricated benchmarks and exact `python3` math on any shared CSV?
2. **Sequencing & rollback check:** Does every strategy change respect the 7-day Conversion Sequencing Law, start within 10% to 20% of trailing actuals, and include explicit 3-5d / 7d / 14d rollback thresholds?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or workshop filler. Link naturally to `conversion-tracking-planner` (signal cleanup), `ppc-experiment-finder` (structured 50/50 bid experiments), or `ppc-change-analyzer` (measuring post-switch impact).
