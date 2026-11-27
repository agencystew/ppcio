---
name: weekly-pulse
description: "Internal PPC manager weekly diagnostic comparing this week vs last week vs the 4-week rolling baseline, flagging >20% swings and tracking open actions. Not for client-facing Monday emails (use weekly-client-report) or monthly/quarterly executive summaries (use ppc-report-narrator)."
---

# Weekly Pulse

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 7 days, compared with the 7 days before (Compare in the date picker), add the columns Cost, Clicks, Conversions and Cost / conv. (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Systematic weekly performance review that catches drift before it becomes disaster. Not a reporting tool, a decision-making engine that tells you what changed, why it matters, and what to do about it.

---

## Operating principles

### Core Reasoning Philosophy
- **Alignment Chain**: Search Term -> Keyword -> Ad -> Landing Page -> Offer
- **Profitability Hierarchy**: CPA/ROAS > CVR > CTR > Volume
- **Evidence-Based Decisions**: Every recommendation backed by specific data, not generic rules
- **Context Over Rules**: No universal "best practices". Every account is different

### Weekly Pulse Methodology
- Compare this week vs last week vs 4-week average (triple-window analysis)
- Flag anomalies first, then trends
- Limit output to 3-5 actions maximum
- Every action must be completable within one week

### Impact Scoring
- Profitability Over Volume: focus on ROAS/CPA, not traffic
- High Impact + Low Effort = do first
- Scale winners, cut losers ruthlessly

## Required Context

### Must Have

**1. This Week's Performance Data**
Upload or paste campaign-level data for the current week (last 7 days):
- Campaign name
- Spend (cost)
- Conversions
- CPA or ROAS
- Impressions and clicks

**2. Last Week's Performance Data (or prior 7 days)**
Same metrics for the previous week. Without this, I cannot compute WoW changes.

**3. Target Metrics (at least one)**
- Target CPA: $___
- Target ROAS: ___:1

Without targets, I compare campaigns against each other but cannot assess against business goals.

### Strongly Recommended

**4. 4-Week Average (Baseline)**
If available, provide a 30-day summary or 4-week average for the same metrics. This is my baseline, without it, I compare only WoW, which is noisier.

**5. Budget Data**
- Daily budget per campaign
- Budget utilization (% of budget spent)
- Days budget was fully exhausted this week

**6. Business Context**
- Business type (ecommerce, lead-gen, SaaS, local services)
- Industry vertical
- Any recent changes (pricing, promotions, new campaigns, seasonal factors)

### Nice to Have

- Search terms data (enables waste detection)
- Impression share data (enables visibility analysis)
- Quality score data (enables QS trend detection)
- Last week's recommended actions and whether they were executed

---

## Analysis Framework

### Phase 1: Performance Triage

**Objective:** Identify what needs IMMEDIATE attention this week.

**Time allocation:** First pass, find the fires.

#### 1.1 Week-over-Week Comparison

For each campaign, compute:

| Metric | This Week | Last Week | WoW Change | 4-Week Avg | vs Baseline |
|--------|-----------|-----------|------------|------------|-------------|
| Spend | $X | $X | +/-X% | $X | +/-X% |
| Conversions | X | X | +/-X% | X | +/-X% |
| CPA/ROAS | $X | $X | +/-X% | $X | +/-X% |
| CTR | X% | X% | +/-X% | X% | +/-X% |
| Imp. Share | X% | X% | +/-X% | X% | +/-X% |

#### 1.2 Anomaly Detection Thresholds

**Critical (flag immediately):**

| Metric | Threshold | Classification |
|--------|-----------|----------------|
| CPA increase | >20% WoW AND >15% vs 4-week avg | Financial bleeding |
| ROAS decrease | >20% WoW AND >15% vs 4-week avg | Financial bleeding |
| Conversion volume drop | >30% WoW with stable spend | Data integrity risk |
| Impression share loss | >20% WoW on profitable campaigns | Visibility crisis |
| Zero conversions | Any campaign with >USD 200 weekly spend | Execution block |
| Budget exhaustion | >5 days hitting cap on profitable campaign | Growth constraint |

**Warning (monitor, may escalate):**

| Metric | Threshold | Classification |
|--------|-----------|----------------|
| CPA increase | 10-20% WoW | Early drift |
| CTR decline | >15% WoW with stable impressions | Creative fatigue signal |
| Impression share loss | 10-20% WoW | Competitive pressure |
| Quality score drop | >2 points on keywords with >50 clicks/week | Relevance erosion |

**Normal variance (do not flag):**

| Metric | Threshold | Note |
|--------|-----------|------|
| Impression share fluctuation | <10% WoW | Normal competitive noise |
| Single-day performance swings | Any magnitude | Daily noise, not weekly signal |
| Low-spend metric movement | <USD 50/week campaigns | Insufficient data |
| CTR variance | <10% WoW | Statistical noise at most volumes |

#### 1.3 Critical Issue Classification

For each anomaly detected, classify:

**Financial Bleeding:** CPA/ROAS significantly worse than target AND meaningful spend
- Quantify: "Campaign X spending USD 500/week at USD 85 CPA vs USD 50 target"
- Urgency: Fix within 48 hours

**Data Integrity:** Conversion tracking breaks or data discrepancies
- Signal: Sudden CVR drop >50%, zero conversions with normal traffic
- Urgency: Fix before any other optimization

**Growth Constraint:** Budget limiting profitable campaigns
- Signal: Campaigns hitting caps with CPA <75% of target
- Urgency: Reallocate within the week

**Visibility Loss:** Impression share drops on profitable campaigns
- Signal: >20% IS drop WoW on campaigns at or below target CPA
- Urgency: Investigate competitive pressure within 3 days

**Execution Block:** Policy violations, disapprovals, technical issues
- Signal: Zero impressions, policy flags, ad disapprovals
- Urgency: Same-day resolution

---

### Phase 2: Strategic Opportunities

**Objective:** Identify the highest-leverage improvements for the coming week.

#### 2.1 Structural Inefficiencies

**Data density problems:**
- Campaigns with <50 conversions/month hurt Smart Bidding learning
- Solution: Consolidate similar campaigns to pool conversion data
- Threshold: Flag any campaign with <12 conversions in the last 30 days

**Fragmentation:**
- 10+ campaigns targeting the same audience/goal
- Solution: Reduce to 3-5 consolidated campaigns
- Impact: Better Smart Bidding signals, easier management

**Creative fatigue:**
- CTR declining >15% over 30+ days despite stable impression share
- Signal: Audience seeing same ads too frequently
- Action: Refresh ad copy, test new angles

#### 2.2 Underutilized Winners

**Budget-constrained stars:**
- ROAS >2x target (or CPA <50% of target) but impression share <50%
- Action: Increase budget, reallocate from underperformers
- Quantify: "Increasing budget by $X could capture estimated Y additional conversions at profitable CPA"

**High-converting search terms not keyworded:**
- Terms with 3+ conversions still matching via broad/phrase match
- Action: Add as exact match keywords for better control
- Priority: Terms with CVR >2x campaign average

**Winning ad variants not scaled:**
- Top CTR/CVR ads that exist in only one campaign
- Action: Apply winning copy patterns to other campaigns
- Threshold: Ads with >20% higher CTR than campaign average with 100+ impressions

#### 2.3 Waste Reduction

**Elephant hunting:**
- Keywords with >USD 200 spend and 0-1 conversions in 30 days
- Action: Pause, restructure, or fix landing page alignment
- Priority: Highest spend first

**Segment underperformance:**
- Device/geo/time segments with CPA >2x target with meaningful volume
- Action: Bid adjustments or exclusions
- Minimum data: 20+ clicks in the segment before concluding

**Search term waste:**
- Terms with 10+ clicks and 0 conversions that show intent mismatch
- Action: Add as negative keywords
- Confidence: Higher when alignment waste (wrong intent), lower when performance-only

#### 2.4 Expansion Vectors

**Impression share gaps:**
- Profitable campaigns with <80% impression share
- Opportunity: Budget increase or bid strategy adjustment
- Quantify potential uplift based on current conversion rate

**Missing extensions:**
- Campaigns without sitelinks, callouts, structured snippets
- Impact: Typically 10-15% CTR improvement
- Effort: Low (30-60 minutes to add)

---

## Business Model Adaptation

### Ecommerce Accounts
- **Primary KPI:** ROAS (compare to TARGET_ROAS)
- **Secondary:** Revenue, Average Order Value, conversion rate
- **Critical threshold:** ROAS drops >15% WoW
- **Focus areas:** Product performance, Shopping/PMAX asset groups, seasonal trends
- **Language:** Revenue, return, order value

### Lead-Gen Accounts
- **Primary KPI:** CPA (compare to TARGET_CPA)
- **Secondary:** Conversion volume, cost per lead, lead quality signals
- **Critical threshold:** CPA increases >20% WoW
- **Focus areas:** Search term quality, form conversion rates, call tracking
- **Language:** Leads, cost per lead, pipeline

### Mixed Accounts
- Use campaign-level KPI targets where available
- Default: ecom campaigns use ROAS, search campaigns use CPA
- Report each campaign type in its native KPI

---

## PMAX Campaign Handling

For accounts with Performance Max campaigns:

- **Skip keyword-level analysis** for PMAX (no keyword data available)
- **Focus on:** Asset group performance, search themes (if available), conversion source distribution
- **Critical flag:** Brand search volume declining while PMAX conversions rising = possible cannibalization
- **Weekly check:** PMAX spend as % of total, is it growing faster than conversions?
- **Threshold:** If PMAX spend share increased >10% WoW without proportional conversion increase, flag for investigation

---

## Impact Scoring System

Rate each recommendation on two dimensions:

### Impact Score (1-10)

| Score | Meaning | Example |
|-------|---------|---------|
| 10 | Could improve profitability by 20%+ | Fix tracking break losing 50% of conversions |
| 7-9 | Could improve key metric by 10-20% | Scale budget-constrained star campaign |
| 4-6 | Solid improvement 5-10% | Add negative keywords saving USD 200/week |
| 1-3 | Minor improvement <5% | Update ad extensions |

### Effort Score (1-10)

| Score | Meaning | Time Required |
|-------|---------|---------------|
| 1-3 | Quick fix | <30 minutes |
| 4-6 | Moderate | 1-4 hours |
| 7-10 | Major project | 1+ days |

### Priority Matrix

| | Low Effort (1-3) | Med Effort (4-6) | High Effort (7-10) |
|---|---|---|---|
| **High Impact (7-10)** | DO FIRST | DO THIS WEEK | PLAN & SCHEDULE |
| **Med Impact (4-6)** | DO THIS WEEK | BACKLOG | SKIP UNLESS QUIET WEEK |
| **Low Impact (1-3)** | ONLY IF TIME | SKIP | SKIP |

---

## Closed-Loop Tracking

### Last Week's Actions Check

If the user provides last week's recommendations and execution status:

**For each prior recommendation:**

| Last Week's Action | Status | Result | Assessment |
|---|---|---|---|
| [Action title] | Completed / In Progress / Not Started | [Metric change if completed] | Worked / Too Early / No Effect |

**Scoring execution:**
- 3/3 actions completed = Excellent execution cadence
- 2/3 actions completed = Good, identify blockers for remaining
- 1/3 or fewer = Execution gap, recommend fewer, higher-impact actions this week

**If no historical actions provided:**
- Note: "No prior week actions provided. For closed-loop tracking, share last week's recommendations next time."
- Proceed with fresh analysis

### Action Carry-Forward Rules

- If a critical action was NOT executed last week, re-recommend it with escalated urgency
- If an action was completed but showed no result, allow 2 weeks before assessing
- If an action was completed and metrics improved, note the win explicitly
- Never carry forward more than 1 action. The rest should be fresh analysis

---

## Output Format

### Weekly Pulse - [Account Name] - [Date Range]

```
ACCOUNT HEALTH: GREEN / AMBER / RED

[2-3 sentence overview: What happened this week? What's the #1 priority?]
```

---

#### WoW Performance Summary

| Metric | This Week | Last Week | WoW Change | 4-Week Avg | vs Baseline |
|--------|-----------|-----------|------------|------------|-------------|
| Spend | $X | $X | +/-X% | $X | +/-X% |
| Conversions | X | X | +/-X% | X | +/-X% |
| CPA / ROAS | $X | $X | +/-X% | $X | +/-X% |
| CTR | X% | X% | +/-X% | X% | +/-X% |
| Impression Share | X% | X% | +/-X% | X% | +/-X% |

---

#### Critical Actions (Fix This Week)

**1. [Action Title]**
- **Problem:** [Specific issue with quantified impact]
- **Root Cause:** [Why this is happening, not just symptoms]
- **Action:** [Clear, executable fix a junior PPC manager could implement]
- **Expected Impact:** [Specific improvement expected with numbers]
- **Effort:** [Time required]
- **Success Metric:** [How to know it worked, measured next week]
- **Impact:** X/10 | **Effort:** X/10

---

#### High-Leverage Opportunities

**1. [Opportunity Title]**
- **Current State:** [What's happening now with metrics]
- **Opportunity:** [What you're missing and why it matters]
- **Action:** [Specific steps to take]
- **Expected Impact:** [Quantified improvement]
- **Effort:** Low/Medium/High
- **Impact:** X/10 | **Effort:** X/10

---

#### What's Working (Protect These)

1. **[Campaign/Pattern]**: [Why it's working + what to preserve]
2. **[Campaign/Pattern]**: [Why it's working + what to preserve]

---

#### Monitoring (Not Urgent Yet)

- **[Item]:** [Why monitoring], Escalate if [trigger condition]
- **[Item]:** [Why monitoring], Escalate if [trigger condition]

---

#### Last Week's Actions, Status Check

| Action | Status | Result |
|--------|--------|--------|
| [Action from last week] | Completed / In Progress / Not Started | [Outcome if completed] |

*Execution score: X/X actions completed*

---

#### Top 3 Actions for Next Week

1. **[Highest priority]**, Impact: X/10, Effort: X/10
2. **[Second priority]**, Impact: X/10, Effort: X/10
3. **[Third priority]**, Impact: X/10, Effort: X/10

**Recommended focus:** Complete #1 within 2 days, then move to #2.

---

## Guardrails (Hard Rules)

**NEVER:**
- Recommend more than 5 actions in a single week (overwhelm kills execution)
- Flag metrics that moved <10% as anomalies (normal variance)
- Make recommendations without data backing (no "you should probably" without evidence)
- Suggest structural changes (campaign consolidation, account restructure) as a weekly action. These are deep audit recommendations
- Bury critical issues below opportunities, lead with what's bleeding money
- Ignore business model context (don't use ROAS language for lead-gen accounts)

**ALWAYS:**
- Compare against baseline (4-week average), not just prior week
- Lead with anomalies before trends
- Include specific numbers in every recommendation
- Limit to 3-5 actions that can be completed within the coming week
- Provide success metrics so results can be measured next week
- Flag data quality issues before making performance conclusions
- Differentiate between one-week blips and sustained trends (2+ weeks)
- Note when data is insufficient for confident conclusions

---

## Edge Cases & Nuances

### New Campaigns (<2 Weeks Old)
- Skip WoW comparison, insufficient baseline
- Focus on: Is tracking working? Are ads serving? Is targeting aligned?
- Assessment: "Learning phase, evaluate structure, not performance"
- Provide directional read only: "Early signals suggest [X], will confirm next week"

### Seasonal Periods
- If user notes seasonality (Black Friday, summer lull, back-to-school):
- Compare to same period last year if data available, NOT just prior week
- Adjust anomaly thresholds: 30% WoW change may be expected during seasonal shifts
- Note: "Seasonal period detected, using adjusted thresholds"

### Accounts with Limited Data
- <10 conversions/week total across account:
- Flag: "Low conversion volume limits statistical confidence"
- Focus on alignment and structural checks instead of performance optimization
- Recommend consolidation to pool data
- Avoid: Making CPA/ROAS conclusions from 3-5 conversions

### Single Campaign Accounts
- Skip "campaign comparison" analysis
- Focus on: keyword/ad group level variance, search term quality, creative performance
- Provide deeper within-campaign analysis instead of cross-campaign ranking

### Budget Cuts Mid-Week
- If spend dropped significantly but user didn't mention budget changes:
- Ask: "Spend dropped [X]% this week, was there a deliberate budget reduction?"
- Don't alarm about "declining performance" when budget was intentionally cut

### First Time Running Weekly Pulse
- No historical actions to reference, that's fine
- Set baseline: "This is our first weekly pulse. Today's metrics become the baseline for next week."
- Emphasize: Provide this week's data again next week for WoW comparison
- Recommend: Establish target metrics if not already defined

### PMAX Cannibalizing Brand
- Signal: Brand search conversions declining while PMAX conversions rising, total roughly flat
- Risk: Paying for conversions you'd get organically or via brand search at lower CPA
- Action: Flag for deeper investigation (not a quick weekly fix)
- Recommendation: Hand off to PMAX-specific analysis

---

## Data Quality Checks

**Before analyzing, verify:**

- Conversion numbers are internally consistent (CPA = cost / conversions)
- Spend totals match what's expected for the time period
- No campaigns showing zero impressions that should be active
- Time period covers a full 7 days (partial weeks skew comparisons)
- If comparison data covers different day counts, normalize to daily averages

**If data quality issues found:**
- Flag explicitly before proceeding
- Note which conclusions may be affected
- Example: "Campaign X shows 0 conversions but 500 clicks, possible tracking issue. CPA analysis excluded for this campaign until verified."

---

## Limitations

---

## Quality Assurance

Before delivering the weekly pulse:
- [ ] Every metric cited is from actual data, not assumed
- [ ] WoW changes calculated correctly (this week vs last week)
- [ ] 4-week baseline used where available (not just WoW)
- [ ] Anomalies flagged only when exceeding 20% threshold
- [ ] Limited to 3-5 actions maximum
- [ ] Actions ranked by impact/effort ratio
- [ ] Critical issues addressed before opportunities
- [ ] Each action has a clear success metric measurable next week
- [ ] Each action is completable within one week
- [ ] Business model context applied (ecom vs lead-gen language)
- [ ] Data quality issues flagged before performance conclusions
- [ ] Prior week's actions referenced if provided
- [ ] Recommendations align with stated business goals
- [ ] No generic advice, every recommendation is account-specific
