---
name: ppc-account-health-check
description: "Fast 5-minute 30-day campaign-table triage that grades a Google Ads account A to D and ranks quick fixes by impact and effort. Not for a deep 90-day multi-tab alignment and profitability audit across keywords, ads, and landing pages — use ppc-strategic-audit instead."
---

# PPC Account Health Check

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 30 days, add the columns Cost, Clicks, Conversions, Cost / conv. and Search impr. share (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Strategic account assessment focused on what actually moves the needle. Not a reporting tool, a decision-making tool.

---

## Operating principles

### Core Reasoning Philosophy
- **Alignment Chain**: Verify alignment before optimizing performance
- **Profitability Hierarchy**: CPA/ROAS > CVR > CTR > Volume
- **Evidence-Based Decisions**: Confidence scores based on statistical significance
- **Context Over Rules**: No universal "best practices", every account is different

### Rules & Thresholds
- Sample size requirements by account tier
- Statistical confidence thresholds (10/30/50 conversions)
- Device/geo segmentation minimums

### Decision Framework
- Waste Before Growth: Fix leaks before adding water
- Structure Enables Performance: Fix foundation before tactics
- Sample Size Discipline: No confident conclusions from insufficient data

## Core Philosophy

**80/20 Principle:** Find the 20% of actions that drive 80% of results.

**Profitability Over Volume:** Focus on ROAS/CPA improvements, not just traffic increases.

**Evidence-Based:** Every recommendation backed by specific data, not generic best practices.

**Actionable Output:** Clear, executable fixes with success criteria.

---

## Required Context

### Must Have

**1. Performance Data**
Upload or paste campaign-level data including:
- Campaign name
- Spend (cost)
- Conversions
- CPA (cost per conversion)

Better if you also have: impressions, clicks, CTR, ROAS, conversion value

**2. Time Period**
What dates does this data cover?
- Minimum: 7 days (for directional read)
- Ideal: 30 days (reliable patterns)
- Best: 30 days + comparison to prior 30 days

### Strongly Recommended

**3. Target Metrics**
- Target CPA: $___
- Target ROAS: ___:1
- Monthly budget: $___

Without targets, I'll assess against internal benchmarks (campaign vs campaign) but can't evaluate against business goals.

### Nice to Have

- Conversion type (leads, purchases, calls, etc.)
- Industry/business type (helps contextualize benchmarks)
- Recent changes (budget, bidding, structure)
- Seasonality factors

---

## Analysis Framework

### Phase 1: Performance Triage

**Objective:** Identify what needs IMMEDIATE attention.

#### Critical Issues to Flag (Fix or Bleed Money)

**1. Financial Bleeding**
Campaigns with CPA/ROAS significantly worse than target AND meaningful spend.
- Threshold: >30% above target CPA with >10% of total spend
- Action: Immediate investigation

**2. Data Integrity**
Conversion tracking breaks or data discrepancies.
- Signals: Sudden CVR drop, zero conversions with normal traffic
- Action: Verify tracking before any optimization

**3. Growth Constraints**
Budget limiting profitable campaigns.
- Signal: Campaigns hitting caps with strong performance
- Action: Reallocate from underperformers

**4. Visibility Losses**
Major impression share drops on profitable campaigns.
- Signal: >20% IS drop week-over-week
- Action: Investigate competitive pressure or settings

**5. Execution Blocks**
Policy violations, disapprovals, or technical issues.
- Signal: Zero impressions or policy flags
- Action: Immediate resolution

---

### Phase 2: Strategic Opportunities

**Objective:** Identify high-leverage improvements.

#### 1. Structural Inefficiencies

**Data Density Problems:**
- Campaigns with <50 conversions/month hurt Smart Bidding
- Solution: Consolidate similar campaigns

**Fragmentation:**
- 10+ campaigns targeting same audience/goal
- Solution: Reduce to 3-5 consolidated campaigns

#### 2. Underutilized Winners

**Budget-Constrained Stars:**
- ROAS >2x target but IS <50%
- Solution: Increase budget, decrease on underperformers

**High-Converting Terms Not Keyworded:**
- Search terms with strong CVR still matching via broad
- Solution: Add as exact match keywords

#### 3. Waste Reduction

**Elephant Hunting:**
- Keywords with >USD 200 spend and 0-1 conversions in 30 days
- Solution: Pause, restructure, or landing page fix

**Segment Underperformance:**
- Device/geo/time segments with CPA >2x target
- Solution: Bid adjustments or exclusions

#### 4. Expansion Vectors

**Impression Share Gaps:**
- Profitable campaigns with <80% impression share
- Solution: Budget increase or bid strategy adjustment

**Missing Extensions:**
- Campaigns without sitelinks, callouts, etc.
- Solution: Add all relevant extensions

---

## Health Grade Criteria

**Grade A (Excellent)**
- CPA at or below target (within 10%)
- CTR above industry benchmark
- Healthy campaign mix (not over-reliant on brand or PMAX)
- Waste <5% of total spend
- No critical alignment issues

**Grade B (Good)**
- CPA within 20% of target
- CTR at or near benchmark
- Some optimization opportunities
- Waste 5-10% of spend
- Minor alignment issues

**Grade C (Needs Work)**
- CPA 20-50% above target
- CTR below benchmark
- Multiple significant issues
- Waste 10-20% of spend
- Alignment issues present

**Grade D (Critical)**
- CPA >50% above target OR zero conversions with material spend
- CTR significantly below benchmark
- Fundamental problems requiring restructure
- Waste >20% of spend
- Severe alignment breaks

---

## Scoring System

### Campaign Efficiency Tiers

| Tier | CPA vs Target | Assessment | Action |
|------|---------------|------------|--------|
| ⭐ Star | <75% | Outperforming | Scale if possible |
| ✅ Solid | 75-100% | Meeting goals | Maintain, optimize |
| ⚠️ Borderline | 100-125% | Underperforming | Investigate, test |
| ❌ Underperformer | 125-150% | Problematic | Fix or reduce |
| 🚫 Waste | >150% | Burning money | Pause or restructure |

### Impact Scoring

**For each recommendation:**

**Impact Score (1-10):**
- 10: Could improve profitability by 20%+
- 7-9: Could improve key metric by 10-20%
- 4-6: Solid improvement 5-10%
- 1-3: Minor improvement <5%

**Effort Score (1-10):**
- 1-3: Quick fix (<30 minutes)
- 4-6: Moderate (1-4 hours)
- 7-10: Major project (1+ days)

**Priority = High Impact + Low Effort first**

---

## Sample Size Discipline

**Per Core Reasoning Philosophy: Respect statistical significance.**

### Confidence Thresholds

| Decision Type | Minimum Data | Rationale |
|---------------|--------------|-----------|
| Pause campaign | 50+ conv OR USD 500+ spend, 30+ days | Avoid false negatives |
| Scale campaign | 30+ conv, 14+ days stable | Validates consistency |
| Change match type | 20+ conv on current | Need baseline |
| Test landing page | 100+ sessions/variant | Statistical significance |
| Adjust bids | 10+ conv at current bid | Enough signal |
| Add negative | 1 click if obvious waste | Pattern-based OK |

**When Data Insufficient:**
- Flag explicitly: "insufficient data for confident assessment"
- Focus on alignment checks (can verify without volume)
- Recommend consolidation to pool data
- Present competing hypotheses

---

## Output Format

### Executive Summary

```
OVERALL HEALTH: 🟢/🟡/🔴 [HEALTHY/NEEDS ATTENTION/CRITICAL]

[2-3 sentence overview: What's the state of this account? What's the #1 priority?]
```

---

### 🔴 Critical Issues (Fix This Week)

**Issue 1: [Problem Title]**

| Metric | Value | Context |
|--------|-------|---------|
| [Relevant metric] | [Value] | [vs target or benchmark] |

- **What's Happening:** [Specific problem with numbers]
- **Why It Matters:** [Business impact]
- **Root Cause:** [If identifiable]
- **Fix:** [Specific, executable action]
- **Success Metric:** [How to know it worked]
- **Impact:** [X]/10 | **Effort:** [X]/10

---

### 💡 High-Leverage Opportunities

**Opportunity 1: [Title]**

- **Current State:** [What's happening now with metrics]
- **Opportunity:** [What you're missing]
- **Action:** [Specific steps]
- **Expected Impact:** [Quantified improvement]
- **Effort:** Low/Medium/High

---

### ✅ What's Working (Protect These)

1. **[Campaign/Pattern]**: [Why it's working + what to preserve]
2. **[Campaign/Pattern]**: [Why it's working + what to preserve]

---

### 📊 Account Snapshot

| Metric | Current | Assessment |
|--------|---------|------------|
| Total Spend | $X | [Utilization %] |
| Total Conversions | X | [CVR if calculable] |
| Blended CPA | $X | [vs target] |
| Best Campaign | [Name] | [CPA: $X] |
| Worst Campaign | [Name] | [CPA: $X] |
| Budget Utilization | X% | [Assessment] |

---

### 📋 Priority Action List

1. **[Highest priority]** - Impact: X/10, Effort: X/10
2. **[Second priority]** - Impact: X/10, Effort: X/10
3. **[Third priority]** - Impact: X/10, Effort: X/10

**Recommended Focus:** Complete #1 within 2 days, then move to #2.

---

### 👀 Monitoring (Not Urgent Yet)

- **[Item]:** [Why monitoring] - Escalate if [trigger condition]
- **[Item]:** [Why monitoring] - Escalate if [trigger condition]

---

## What I Don't Flag (Avoiding Noise)

These are normal variance, not issues:
- Minor impression share fluctuations (<10%)
- Single-day performance anomalies
- Low-spend keywords with limited data
- Vanity metrics without conversion impact
- "Best practices" that don't fit the specific context

**Example language:**
"Mobile IS dropped 8% this week, but conversion volume remained stable at target CPA. Normal variance, no action needed."

---

## If Target Metrics Not Provided

I'll assess based on:
- **Internal benchmarks:** Campaign vs campaign comparison
- **Obvious outliers:** 10x CPA variance between campaigns
- **Zero performers:** Campaigns with spend but no conversions
- **Relative performance:** Identify best/worst performers

And note: "Without target CPA/ROAS, I'm comparing campaigns against each other. For assessment against business goals, provide targets."

---

## Data Quality Flags

**I'll flag if I notice:**
- Conversion numbers inconsistent (possible tracking issue)
- Spend doesn't match campaign count (missing data?)
- Metrics don't compute (CPA ≠ cost/conversions)
- Very short time period (<7 days = noise risk)
- Very low conversion volume (<10 total = insufficient data)

---

## Limitations

---

## Deeper Analysis Available

**I can assess:** What the data shows about performance patterns

**I cannot assess without more info:**
- Search term quality (need search terms report)
- Ad copy effectiveness (need ad-level data)
- Landing page issues (need URL + conversion path)
- Competitive pressure (need auction insights)
- Conversion quality (need backend data)

**For deeper analysis, provide:**
- Search terms export → for negative keyword analysis
- Keyword/ad group data → for granular optimization
- Landing page URLs → for conversion path audit

---

## Quality Assurance

Before delivering assessment:
- [ ] Every metric cited is from actual data, not assumed
- [ ] Impact estimates include methodology
- [ ] Actions are clear enough for junior PPC manager to execute
- [ ] Limited to 3-5 actions (not overwhelming)
- [ ] Critical issues addressed before opportunities
- [ ] Each action has success criteria
- [ ] Recommendations align with stated or inferred business goals
- [ ] Confidence levels reflect actual data volume
- [ ] Sample size discipline maintained throughout
