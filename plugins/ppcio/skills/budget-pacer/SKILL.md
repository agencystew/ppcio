---
name: budget-pacer
description: Budget pacing diagnostic and reallocation tool for Google Ads accounts. Triggers when user asks about budget pacing, underspending, overspending, month-end projections, or "are we on track with budget?" Diagnoses pacing issues with a 5-stage hierarchy, projects month-end spend, recommends reallocation between campaigns, and provides urgency-based prioritization. Works with any budget and spend data, paste account or campaign-level metrics to get a diagnosis and action plan.
---

# Budget Pacer

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to "This month", add the columns Budget, Cost, Conversions and Cost / conv. (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Diagnose budget pacing issues, project month-end spend, and get reallocation recommendations. Answers the question every account manager dreads: "Are we going to hit budget this month?"

---

## Operating principles

### Core Reasoning Philosophy
- **Evidence-Based Decisions**: Every diagnosis backed by specific numbers, not hedging
- **Context Over Rules**: Account tier, time of month, and performance context matter
- **Profitability Hierarchy**: Budget reallocation follows performance, not equal distribution

### Budget Pacing Methodology
- 5-stage diagnostic hierarchy (status -> budget -> bids -> CPCs -> competition)
- Projected month-end spend calculation (not just current pacing %)
- Priority scoring that factors variance severity, client tier, time urgency, and fixability
- Specific actions, never "monitor closely"

### Bidding Strategy Framework
- Smart Bidding throttling as a root cause of underpacing
- Bid strategy behavior patterns that affect spend velocity
- Budget-limited impression share as a primary diagnostic signal

## Required Context

### Must Have

**1. Budget and Spend Data**
- Monthly budget: $___
- Current spend (month-to-date): $___
- Days elapsed in the month: ___
- Total days in the month: ___

**2. Business Context**
- Account name / client name
- Business type (ecommerce, lead-gen, SaaS, local services)
- Is the budget a hard cap or a flexible target?

### Strongly Recommended

**3. Campaign-Level Data**
Upload or paste campaign-level metrics:
- Campaign name and status (enabled, paused, removed)
- Daily budget per campaign
- Spend MTD per campaign
- Conversions and CPA per campaign
- Budget-limited impression share (if available)

Without campaign data, I can diagnose at the account level but cannot pinpoint which campaigns are causing pacing issues.

**4. Client Tier**
- Enterprise (highest priority, tightest tolerances)
- Growth (standard priority)
- Starter (lower priority, wider tolerances)

If not specified, I default to Growth tier.

### Nice to Have

- Same period last month spend (enables trend comparison)
- 7-day average daily spend (enables trend detection)
- Recent changes (budget adjustments, campaign pauses, bid strategy changes)
- Impression share data (budget-lost IS, rank-lost IS)
- Conversion performance data (CPA, ROAS by campaign)

---

## Pacing Calculation

### Core Formula

```
Pacing % = (Current Spend / Expected Spend at This Point) x 100

Where:
Expected Spend = (Monthly Budget / Days in Month) x Days Elapsed
```

### Projected Month-End Spend

```
Projected Spend = (Current Spend / Days Elapsed) x Days in Month
```

### Variance

```
Variance = Projected Spend - Monthly Budget
Variance % = ((Projected Spend - Monthly Budget) / Monthly Budget) x 100
```

### Daily Target for Remaining Days

```
Daily Target = (Monthly Budget - Current Spend) / (Days in Month - Days Elapsed)
```

### Example Calculation

```
Monthly Budget: USD 30,000
Current Spend: USD 12,000
Days Elapsed: 15 (of 30)

Expected Spend: (USD 30,000 / 30) x 15 = USD 15,000
Pacing: (USD 12,000 / USD 15,000) x 100 = 80%
Projected Spend: (USD 12,000 / 15) x 30 = USD 24,000
Variance: USD 24,000 - USD 30,000 = -USD 6,000
Daily Target Remaining: (USD 30,000 - USD 12,000) / 15 = USD 1,200/day
```

---

## Pacing Status Thresholds

### Standard Thresholds

| Status | Pacing Range | Indicator | Description |
|--------|-------------|-----------|-------------|
| HEALTHY | 90-110% | GREEN | On track. No action needed. |
| WARNING (Under) | 80-90% | AMBER | Underpacing. Attention needed this week. |
| WARNING (Over) | 110-120% | AMBER | Overpacing. May exhaust budget early. |
| CRITICAL (Under) | <80% | RED | Significant underspend. Act today. |
| CRITICAL (Over) | >120% | RED | Will overshoot significantly. Act today. |

### Context Adjustments

| Context | Adjustment | Rationale |
|---------|-----------|-----------|
| Days 1-7 of month | Widen to +/-15% for HEALTHY | Early-month volatility is normal |
| Days 25+ of month | Tighten to +/-5% for HEALTHY | Little time to correct course |
| Enterprise tier | Flag at +/-8% (not +/-10%) | Tighter tolerance for premium clients |
| New campaigns (<2 weeks) | Widen to +/-20% for HEALTHY | Ramp-up period expected |
| Smart Bidding learning mode | Widen to +/-15% for HEALTHY | Learning period spend is erratic |

### Pacing Status Labels

| Label | Definition |
|-------|-----------|
| ON_TRACK | Spend within 90-110% of daily target |
| OVER_BUDGET | Spend >110% of daily target |
| NEAR_LIMIT | Spend at 85-100% of monthly budget with 5+ days remaining |
| UNDERPACING | Spend <80% of daily target for 3+ consecutive days |

---

## 5-Stage Diagnostic Hierarchy

When pacing is off, investigate causes in this order. The hierarchy moves from most common and easily fixable to least common and hardest to control.

### Stage 1: Campaign Status Changes

**Check first, this is the most common cause of sudden pacing shifts.**

| Signal | Diagnosis | Action |
|--------|-----------|--------|
| Campaign paused that was previously active | Paused campaign killed spend capacity | Re-enable or redistribute its budget |
| Campaign removed | Permanent capacity loss | Redistribute budget to remaining campaigns |
| New campaign added but not spending | Possible approval issue | Check ad/keyword approvals |
| Campaign enabled but 0 impressions | Serving issue | Check targeting, bids, and policy |

**Example diagnosis:** "Non-brand campaign paused, killed USD 1,200/day in spend capacity. Account needs USD 2,133/day to hit target; only USD 900 available from active campaigns."

### Stage 2: Budget Constraints

**Check budget-limited impression share (budget_lost_IS).**

| Budget Lost IS | Diagnosis | Action |
|----------------|-----------|--------|
| >20% on profitable campaign | Budget cap throttling profitable traffic | Increase daily budget |
| >20% on unprofitable campaign | Budget cap is doing its job | Do not increase; optimize first |
| 0% but underpacing | Budget is not the issue | Move to Stage 3 |
| >50% on any campaign | Severely budget-constrained | Major budget reallocation needed |

**Daily budget capacity check:**
```
Total Daily Capacity = Sum of all active campaign daily budgets
Required Daily Spend = Monthly Budget / Days in Month

If Total Daily Capacity < Required Daily Spend:
  → "Active campaigns have $X/day total capacity, but need $Y/day to hit budget."
  → Action: Increase budgets or re-enable paused campaigns
```

### Stage 3: Bid Strategy Behavior

**Smart Bidding can throttle spend when it can't find conversions at target.**

| Signal | Diagnosis | Action |
|--------|-----------|--------|
| Target CPA too aggressive + underpacing | Bid strategy can't find traffic at target | Raise target CPA by 15-20% |
| Learning mode + erratic spend | Still calibrating | Wait 2 weeks before intervening |
| Smart Bidding underspending vs manual baseline | Algorithm being too cautious | Consider raising targets or reverting |
| tROAS too aggressive + underpacing | Can't achieve target return | Lower tROAS target by 10-15% |

**Bid strategy diagnostic questions:**
- Is Smart Bidding in learning mode? (If yes, pacing variance is expected)
- Has target CPA/ROAS been changed recently? (Triggers re-learning)
- Is the target realistic given current market conditions?

### Stage 4: CPC Changes

**Same budget but different cost per click = different spend velocity.**

| Signal | Diagnosis | Action |
|--------|-----------|--------|
| CPC increased >20% WoW | Paying more per click, budget exhausts faster | Review bids, check competitive pressure |
| CPC decreased >20% WoW | Paying less per click, budget lasts longer | May need to increase bids to maintain volume |
| CPC stable but spend changed | Volume change, not pricing | Move to Stage 5 |

### Stage 5: Competitive/External Pressure

**Last resort, external factors are hardest to control.**

| Signal | Diagnosis | Action |
|--------|-----------|--------|
| Search impression share lost to rank increasing | Competitors outbidding | Decide: raise bids or accept lower IS |
| Industry-wide demand shift | Seasonal or market change | Adjust expectations, notify client |
| Platform issue (rare) | Google Ads serving anomaly | Check Google Ads status dashboard |
| New competitor entering auction | Increased competition | Review competitive strategy |

---

## Priority Scoring System

When analyzing multiple campaigns or accounts, rank by priority score:

### Formula

```
Priority Score = (Variance Severity x 40) + (Client Tier x 30) + (Time Urgency x 20) + (Fixability x 10)

Score range: 0-100
```

### Component Scores

**Variance Severity (0-1.0):**
```
Score = |pacing deviation from 100%| / 20
Capped at 1.0 (so 20%+ deviation = max severity)
Example: 72% pacing → |72-100|/20 = 1.4 → capped at 1.0
Example: 92% pacing → |92-100|/20 = 0.4
```

**Client Tier (0-1.0):**

| Tier | Score |
|------|-------|
| Enterprise | 1.0 |
| Growth | 0.6 |
| Starter | 0.3 |

**Time Urgency (0-1.0):**
```
Score = 1 - (days_remaining / days_in_month)
Example: 5 days remaining in 30-day month → 1 - (5/30) = 0.83
Example: 20 days remaining → 1 - (20/30) = 0.33
```

**Fixability (0-1.0):**

| Fix Type | Score |
|----------|-------|
| Campaign-level fix (budget, bid, status) | 1.0 |
| Needs client approval (budget increase) | 0.5 |
| External factor (competition, market) | 0.2 |

### Priority Classification

| Score Range | Classification | Response Time |
|-------------|---------------|---------------|
| 80-100 | CRITICAL | Act today |
| 60-79 | HIGH | Act this week |
| 40-59 | MEDIUM | Review this week |
| 0-39 | LOW | Monitor, check next week |

---

## Budget Reallocation Framework

When budget needs redistribution between campaigns:

### Reallocation Decision Table

| From Campaign | To Campaign | Condition | Max Reallocation |
|--------------|-------------|-----------|-----------------|
| Paused / Removed | Any active campaign at target | Budget is unused | 100% of freed budget |
| CPA >150% of target | CPA <75% of target | Performance gap clear | 50% of underperformer budget |
| Low impression share, profitable | (Increase own budget) | Budget-constrained winner | Increase by 25-50% |
| High impression share, at target | Budget-constrained star | Winner has ceiling, star needs room | 20-30% of at-ceiling budget |

### Reallocation Rules

1. **Never reallocate more than 50% of a campaign's budget in a single change** (disrupts Smart Bidding)
2. **Never reallocate away from a campaign meeting targets** unless it's at >90% impression share
3. **Always document the rationale** for each reallocation
4. **Monitor for 3-5 days** after reallocation before making further changes
5. **If budget is a hard cap**, reallocation is the only option (cannot increase total)
6. **If budget is flexible**, recommend total budget increase instead of robbing Peter to pay Paul

### Reallocation Output Format

```
REALLOCATION RECOMMENDATION:

From: [Campaign Name] ($X/day current)
  → Reduce to: $Y/day (-Z%)
  → Rationale: [Why this campaign can give up budget]

To: [Campaign Name] ($A/day current)
  → Increase to: $B/day (+C%)
  → Rationale: [Why this campaign deserves more budget]

Net impact: USD 0 total budget change
Expected outcome: [Specific metric improvement]
Monitor: Check pacing in 3-5 days
```

---

## Forecasting

### Month-End Projection Methods

**Method 1: Linear Projection (Default)**
```
Projected = (Current Spend / Days Elapsed) x Days in Month
```
Best for: Accounts with stable daily spend patterns.

**Method 2: Weighted Recent (If 7-Day Average Available)**
```
Projected = Current Spend + (7-Day Avg Daily Spend x Days Remaining)
```
Best for: Accounts with recent spend trend changes.

**Method 3: Trend-Adjusted (If Historical Available)**
```
If spend trend = UP: Apply 1.1x multiplier to remaining days
If spend trend = DOWN: Apply 0.9x multiplier to remaining days
If spend trend = STABLE: Use linear projection
```
Best for: Accounts with clear directional trends.

### Forecast Confidence

| Days Elapsed | Forecast Confidence | Note |
|-------------|-------------------|------|
| 1-7 | LOW (50-60%) | Too early, high variance |
| 8-14 | MEDIUM (65-75%) | Reasonable directional signal |
| 15-21 | HIGH (75-85%) | Reliable projection |
| 22+ | VERY HIGH (85-95%) | Outcome is nearly locked in |

---

## Output Format

### Budget Pacing Diagnosis - [Account Name] - [Date]

```
PACING STATUS: GREEN / AMBER / RED
PACING: [X]% of expected spend at day [X] of [X]
PROJECTED MONTH-END: $X (variance: +/-$X)
```

---

#### Pacing Summary

| Metric | Value |
|--------|-------|
| Monthly Budget | $X |
| Spent MTD | $X |
| Expected at Day X | $X |
| Pacing | X% |
| Projected Month-End | $X |
| Variance | +/-$X (+/-X%) |
| Daily Target (remaining days) | $X/day |

---

#### Diagnosis

**Primary Cause:** [Root cause from 5-stage hierarchy]

**Confidence:** X%

**Evidence:**
- [Specific data point supporting diagnosis]
- [Specific data point supporting diagnosis]
- [Specific data point supporting diagnosis]

**Contributing Factors:**
- [Secondary cause, if any]

---

#### Campaign Breakdown (If Campaign Data Provided)

| Campaign | Status | Spend MTD | Daily Budget | Budget Lost IS | CPA | Issue |
|----------|--------|-----------|-------------|----------------|-----|-------|
| [Name] | Enabled/Paused | $X | $X | X% | $X | [Flag or OK] |

**Daily Budget Capacity Check:**
- Total active daily capacity: $X/day
- Required daily spend to hit budget: $X/day
- Gap: +/-$X/day

---

#### Recommended Actions

**1. [Action Title]** | Priority: CRITICAL/HIGH/MEDIUM | Urgency: TODAY/THIS WEEK/MONITOR

- **Action:** [Specific, executable in Google Ads]
- **Expected Impact:** [Quantified change to pacing]
- **Rationale:** [Data-backed reasoning]

---

#### Reallocation Recommendations (If Applicable)

```
From: [Campaign] ($X/day) -> Reduce to $Y/day
To: [Campaign] ($A/day) -> Increase to $B/day
Net: USD 0 change | Expected: [Outcome]
```

---

#### Forecast

| Scenario | Projected Month-End | Variance |
|----------|-------------------|----------|
| No action (current trajectory) | $X | +/-$X |
| With recommended actions | $X | +/-$X |
| Best case | $X | +/-$X |

---

#### Client Communication Draft (If Pacing is Off)

> Subject: [Account Name] Budget Pacing Update - [Month]
>
> Hi [Client],
>
> [Brief status: on track / ahead of pace / behind pace]
>
> [What's happening and why, in plain language]
>
> [What we're doing about it / what we recommend]
>
> [Expected outcome]

---

## Guardrails (Hard Rules)

**NEVER:**
- Say "monitor closely" without a specific threshold, date, or action trigger
- Diagnose without citing specific evidence (campaign status, IS data, spend numbers)
- Recommend "talk to client" as the sole action (always include a Google Ads action alongside)
- Present a projection without stating forecast confidence
- Recommend budget increases >50% in a single change (disrupts Smart Bidding)
- Ignore client tier when prioritizing (Enterprise gets tighter tolerances)
- Round to false precision (USD 36,247.83 should be USD 36,250)
- Force a single diagnosis when multiple causes are possible (list top 2-3 with confidence)

**ALWAYS:**
- Include specific numbers in every diagnosis (USD 1,200/day, not "significant")
- Show projected month-end spend, not just current pacing %
- Factor time-of-month into urgency (day 25 is more urgent than day 5)
- Distinguish between hard budget caps and flexible targets
- State confidence level for every diagnosis
- Include the daily target for remaining days (tells the manager what "catching up" looks like)
- Provide campaign-level breakdown when data is available
- Note when data is insufficient for a confident diagnosis

---

## Edge Cases & Nuances

### Early Month (Days 1-7)
- Pacing variance is NORMAL in the first week
- Do not flag as CRITICAL unless >120% or <70%
- Use historical same-period comparison if available
- Recommendation: "Day 5 of month, too early for confident projection. Check again at day 8."

### Late Month (Days 25+)
- Outcome is nearly locked in, small interventions have limited impact
- If underpacing: Calculate if recovery is mathematically possible
  - "Would need $X/day for remaining Y days. Current capacity is $Z/day. Recovery is [possible/impossible]."
- If overpacing: Emergency budget reduction or campaign pauses
- Be direct: "Budget will be exhausted by day 27. Reduce daily budgets across all campaigns by 30%."

### Overpacing with Strong Performance
- Overpacing is NOT always bad, if CPA is below target, the client may want more spend
- Always ask: "Is this budget a hard cap or a flexible target?"
- If hard cap: Reduce spend to stay within budget
- If flexible: Recommend: "Performance is strong. Consider increasing monthly budget to capture demand."
- Frame positively: "Account is overpacing because it's performing well, campaigns are finding profitable traffic faster than budgeted."

### Underpacing with Poor Performance
- Underpacing + high CPA = the budget is underspending because the system can't find efficient traffic
- Do NOT recommend increasing budgets or bids to "catch up", this wastes money
- Instead: Fix the performance problem first (landing page, targeting, negatives)
- Then reassess pacing once CPA is closer to target

### Shared Budgets
- If a daily budget is shared across multiple campaigns, changes affect ALL campaigns on that budget
- Always flag: "This is a shared budget affecting [N] campaigns. Adjustment will impact all of them."
- List all affected campaigns before recommending changes

### Smart Bidding in Learning Mode
- Pacing is expected to be erratic during learning (typically 1-2 weeks)
- Do NOT panic-adjust budgets during learning periods
- Flag: "Smart Bidding is in learning mode. Pacing variance is expected. Re-evaluate after learning completes."
- Exception: If learning mode has persisted >3 weeks, that's a problem, diagnose why

### Budget Cut Mid-Month
- Client reduced budget mid-month, recalculate all pacing from the change date
- New daily target = (New Monthly Budget - Spend to Date) / Remaining Days
- Note: "Budget revised from $X to $Y on [date]. Pacing recalculated from revision date."

### Multiple Accounts (Portfolio Context)
- If analyzing multiple accounts, rank by priority score (not alphabetically)
- Surface cross-account patterns only if 3+ accounts show similar behavior
- Flag account manager workload: "Manager X has 3 critical accounts, may need redistribution"

---

## Data Quality Checks

**Before diagnosing, verify:**

- Spend and budget numbers are in the same currency
- Days elapsed + days remaining = days in month
- Campaign-level spend sums to (approximately) account-level spend
- No campaigns showing impossible metrics (negative spend, >100% IS)
- If spend is exactly USD 0.00, confirm the account is actually active

**If data quality issues found:**
- Flag before diagnosing
- Note which conclusions may be affected
- "Campaign-level spend ($X) doesn't match account-level ($Y). Using account-level for pacing; campaign breakdown may be incomplete."

---

## Limitations

---

## Quality Assurance

Before delivering the pacing diagnosis:
- [ ] Pacing % calculated correctly
- [ ] Projected month-end spend calculated and stated
- [ ] Daily target for remaining days provided
- [ ] Diagnosis follows the 5-stage hierarchy
- [ ] Every diagnosis cites specific evidence with numbers
- [ ] Every recommendation is a specific action (not "monitor closely")
- [ ] Confidence level stated for diagnosis
- [ ] Time-of-month context factored into urgency
- [ ] Client tier factored into priority (if specified)
- [ ] Hard cap vs flexible target distinction made
- [ ] Campaign-level breakdown included (if data provided)
- [ ] Forecast includes confidence level based on days elapsed
- [ ] Numbers appropriately rounded (no false precision)
- [ ] Client communication draft included (if pacing is off)
