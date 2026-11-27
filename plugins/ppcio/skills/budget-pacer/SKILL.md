---
name: budget-pacer
description: "Diagnoses Google Ads monthly budget pacing (underpacing or overspending) using active spend days, projects month-end spend, pinpoints Smart Bidding throttling or auction constraints, and recommends profitable reallocation. Use when someone asks if campaigns are on track to hit monthly budget or why spend dropped/spiked. Not for evaluating whether Search has hit its long-term demand ceiling (use demand-ceiling-analyzer)."
---

# Budget Pacer & Spend Reallocation Diagnostics

Answering "are we going to hit monthly budget?" with `MTD spend / calendar days` breaks constantly whenever a campaign launched mid-month, paused for 3 days, or got throttled by Smart Bidding. Your job is to compute exact pacing math via `python3`, form a clear hypothesis about *why* spend velocity drifted, protect hard budget caps, and reallocate money strictly from expensive campaigns to proven profitable winners.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Check if a local `landing-pages/*/context.md` exists first for monthly budget cap, target CPA/ROAS, and seasonality.
- **Zero fabrication:** Never invent missing daily spend, Impression Share, or prior-month pacing figures; state missing columns plainly and verify all math via the bundled script.
- Ask in one line if data is missing: *"In Google Ads, open Campaigns (This month + last 7 days, ideally segmented by Day), include Budget, Bid strategy type, Cost, Clicks, Conversions, Cost / conv., Search lost IS (budget), and Search lost IS (rank), Download .csv and drop it here (plus your monthly budget and whether it is a hard cap). Or ask me to connect Google Ads via `connect-data-sources`."*
- **Run the deterministic pacing engine first:**
  `python3 "${CLAUDE_SKILL_DIR}/scripts/pace_check.py" --csv <campaigns.csv> --monthly-budget <BUDGET> --days-elapsed <N> --days-in-month <30|31> [--target-cpa <CPA>]`
  It computes active `days_with_spend`, flags unspent-budget traps and mid-window launches, and ranks reallocation from dearest to cheapest CPL.

## First-Principles Pacing Math & Diagnosis (And Why Naive Formulas Lie)

1. **Exact Pacing Math (`python3` mandatory on CSVs - zero eyeballing):**
   - **Never divide partial-month spend by 30 (or total elapsed calendar days) when a campaign launched mid-window or was paused:** use **`days_with_spend`** (active days) AND compare **7-day run rate** vs. **MTD run rate** so you catch sudden recent throttling (`Projected Month-End = MTD Spend + (7d Daily Avg x Remaining Days)`).
   - **Ignore mid-window launches** when judging account-level historical pacing trend, and separate **hard budget caps** (overspend risk is urgent) from **flexible performance targets**.
   - **Never raise an unspent daily budget:** If a campaign has a $200/day budget and only spends $95/day, raising budget to $300/day does literally nothing! Underpacing on unspent budget is ALWAYS an auction/targeting/Smart Bidding bottleneck, never a budget cap.
2. **5-Stage Underpacing Diagnostic Hierarchy (Check in Order):**
   - **Stage 1 - Status & Eligibility:** Paused campaigns/ad groups, disapproved ads, billing/card caps, or tight ad schedules (`ads-not-showing`).
   - **Stage 2 - Smart Bidding Throttling (Most Common Culprit!):** An aggressive tCPA (e.g., 30% below real CPA) or high tROAS stops Google from bidding. Fix: relax target 10% to 15% in controlled steps (`bidding-strategy-decision-tree`).
   - **Stage 3 - Rank & Bid Constraints:** High **Search Lost IS (Rank)** with low Lost IS (Budget) -> fix bids, QS, or landing page CVR (`quality-score-repair`, `landing-page`).
   - **Stage 4 - Targeting & Negative Conflicts:** Audience set to "Targeting" instead of "Observation", tight geo radius, or broad negative blocking core terms (`negative-keyword-analyzer`).
   - **Stage 5 - True Demand Saturation / Seasonality:** High Search IS (>=80%) -> do not force wasted spend just to burn a budget; reallocate or propose `channel-expansion-planner`!
3. **Profitability-First Reallocation (Dearest to Cheapest CPL / Best ROAS):**
   - When shifting budget to hit monthly pacing, move dollars from **highest-CPL / lowest-ROAS** campaigns (above target) into **proven profitable campaigns showing Search Lost IS (Budget) > 15%**.
   - Keep budget steps controlled (**<=20% per adjustment** when possible, or flag learning-period risk if forced near month-end to protect a hard cap!).

### Weak 5/10 vs. 10/10 Pacing Plan

- **Amateur:** *"You spent $8,400 by day 14 (60% of $14,000), so you are underpacing. Raise daily budgets by 25% across all campaigns and monitor closely."* (Raises budgets on unspent campaigns, ignores 7-day trend, ignores which campaigns are actually profitable.)
- **10/10 Senior:** *"Using actual active spend velocity (last 7 days averaging $480/day vs. $600/day MTD average), you project **$16,080** against a **$20,000** monthly target (-$3,920 / -19.6% under). Do NOT raise budget on Campaign B (Non-Brand Plumbing) - its $250/day cap is only spending $142/day because tCPA was cut from $65 to $45 on the 6th (Rank Lost IS jumped to 58%). Exact fixes: (1) Relax Campaign B tCPA from $45 back to $58 (+15% step) to recover ~$95/day; (2) Shift +$110/day directly to Campaign A (Emergency Drain, $44 CPL vs. $65 target, 34% Budget Lost IS); (3) Leave Campaign C (Water Heaters, $112 CPL) untouched. Recheck 3-day spend velocity on day 18; rollback tCPA if 7-day settled CPA crosses $72."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your pacing plan:
1. **Math & trap check:** Did I verify `days_with_spend`, 7-day run rate vs. MTD average, and exact remaining-days daily target (`(Budget - MTD) / Remaining Days`) via `python3` with zero fabricated numbers? Did I avoid telling anyone to raise an unspent daily budget?
2. **Restraint & guardrail check:** If the only way to spend remaining budget is burning money on unprofitable campaigns, say **DO NOT FORCE SPEND** plainly. Include exact 3-to-7-day pacing check + rollback guardrails.
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or form-filler blanks. Link naturally to `bidding-strategy-decision-tree` (Smart Bidding throttling), `demand-ceiling-analyzer` (true ceiling), or `weekly-client-report` (client pacing update).
