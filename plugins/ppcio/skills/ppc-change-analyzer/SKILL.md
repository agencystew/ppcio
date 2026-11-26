---
name: ppc-change-analyzer
description: "Evaluate one known Google Ads change (before vs after) and give a keep, revert, or wait verdict with a confidence score. Not for investigating an unknown performance drop across change history — use change-detective instead."
---

# PPC Change Analyzer

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, type "Change history" in the search box at the top and open it, set the dates to cover the change and two weeks either side, then press Download and pick .csv. Add a Campaigns download for the same dates. Drop both files here. Say this to them in one line when you ask for it.

Analyze the before/after impact of Google Ads changes. Get a clear verdict (positive/negative/neutral/inconclusive) with confidence scoring, causation analysis, and actionable recommendations.

---

## Core Philosophy

### Close the Loop Between Actions and Outcomes

Account managers make changes constantly, pausing campaigns, adjusting bids, testing new copy. The problem? They forget to check results. Your job is to connect what changed with what happened.

**What this means:**
- Every analysis must clearly state the change, the before/after metrics, and a verdict
- Don't just report what happened, explain whether the change CAUSED it
- Provide a clear recommendation: keep, revert, or monitor longer

### Causation vs Correlation

Performance shifting after a change doesn't prove the change caused it. Be rigorous about attribution.

**Strong causation signals:**
- Performance shift timing matches change timing closely
- The changed element directly affects the shifted metric
- No other major changes in the window
- Effect persists across the analysis period

**Weak/uncertain signals:**
- Performance was already trending before the change
- Multiple concurrent changes
- Very short analysis window
- External factors present (holidays, seasonality, competitor moves)

When correlation is present but causation is uncertain, say so clearly.

### Conversion Data Wins

CTR changes are interesting but inconclusive. Conversion and revenue changes are what matter. CPA/ROAS shifts are the ultimate verdict.

**Metric Hierarchy for Verdict Decisions:**

| Priority | Metric | Why It Matters |
|----------|--------|---------------|
| 1 | Conversions + CPA | Direct business outcomes |
| 2 | Conversion Value + ROAS | Revenue impact |
| 3 | Clicks + CPC | Volume and cost signals |
| 4 | CTR | Relevance proxy (never conclusive alone) |
| 5 | Impressions + IS | Visibility indicators |

### Statistical Rigor Over Gut Feel

- 7-day windows minimum for analysis
- 14-day windows recommended for cleaner signal
- Flag when sample size is insufficient
- Don't declare victory or failure from noise

### Acknowledge Uncertainty

Not every analysis produces a clear answer. When data is insufficient or confounders are present, say "inconclusive", that's a valid and valuable finding.

---

## Critical Context Gathering

### Required Context

**1. What Changed**
- Describe the change in plain English (e.g., "Switched from Manual CPC to Maximize Conversions")
- When it happened (date)
- What it affected (specific campaign, ad group, or account-wide)

**2. Before Metrics**
- Performance data from BEFORE the change
- Minimum: spend, conversions, CPA
- Better: include impressions, clicks, CTR, CPC, ROAS

**3. After Metrics**
- Performance data from AFTER the change
- Same metrics as before, same time window length

### Recommended Context

**4. Analysis Window Length**
- How many days in each period
- Default: 14 days before and 14 days after

**5. Other Changes in the Window**
- Were any other changes made during the same period?
- Budget shifts, new campaigns, paused keywords, seasonal events
- Critical for assessing attribution confidence

**6. Business Targets**
- Target CPA or ROAS
- Helps determine if changes moved performance toward goals

---

## Analysis Window Requirements

### Minimum Windows by Change Type

Different changes need different observation periods to show reliable signals:

| Change Type | Minimum Window | Recommended Window | Why |
|-------------|---------------|-------------------|-----|
| Campaign paused/enabled | 7 days | 14 days | Traffic on/off is immediate |
| Budget change (>20%) | 7 days | 14 days | Volume adjusts within days |
| Bid strategy switch | 14 days | 28 days | Algorithm needs 2-4 weeks to learn |
| Landing page change | 14 days | 21 days | CVR needs volume to stabilize |
| Keyword additions (10+) | 7 days | 14 days | Impression ramp takes days |
| Ad copy change | 14 days | 21 days | Ad rotation needs time to test |
| Audience targeting change | 14 days | 21 days | Audience signals build gradually |
| Geographic targeting change | 7 days | 14 days | Geo shifts are relatively fast |

### When Windows Are Too Short

If the user provides less than the minimum window, flag it explicitly:

- **< 7 days:** "This analysis covers [X] days, too short for reliable conclusions. The patterns shown are directional only. Re-assess after [minimum window] days."
- **7-13 days:** "Adequate for quick changes (budget, campaign status) but insufficient for bid strategy or creative changes. Results should be treated as preliminary."
- **14+ days:** Sufficient for most change types.

### Learning Period Considerations

Some changes have built-in ramp-up periods that must be excluded from the "after" window:

| Change | Learning Period | Exclude From Analysis |
|--------|----------------|----------------------|
| Smart Bidding switch | 7-14 days | First 7 days after switch |
| New campaign launch | 3-7 days | First 3 days minimum |
| Major keyword expansion | 1-3 days | First day |
| PMAX launch | 14-21 days | First 14 days |

**Example:** If bid strategy changed on March 1, the "after" window should start March 8 (excluding learning), not March 1.

---

## Change Significance Guide

### High-Impact Changes (Always Analyze)
- Campaign paused or enabled (traffic on/off)
- Bid strategy changes (fundamentally alters optimization)
- Budget changes >20% (capacity shift)
- Landing page URL changes (alignment chain affected)
- Major keyword additions/removals (10+ keywords or high-volume terms)
- Audience or geographic targeting changes

### Low-Impact Changes (Context Determines)
- Single keyword bid adjustments
- Minor ad copy tweaks (<3 ads)
- Small budget changes (<10%)
- Adding/removing a few negative keywords

A single keyword pause in a 500-keyword account is noise. A single keyword pause when that keyword drives 40% of conversions is critical. Context matters.

### Change Interaction Matrix

When multiple changes happen in the same window, use this to assess attribution clarity:

| Scenario | Attribution Confidence | Recommendation |
|----------|----------------------|----------------|
| Single change, no external factors | High (0.8-1.0) | Confident verdict |
| Single change + minor external factor | Moderate (0.6-0.8) | Verdict with caveat |
| Two changes, different scope | Moderate (0.5-0.7) | Attribute separately if possible |
| Two changes, same scope | Low (0.3-0.5) | Inconclusive for individual changes |
| Three+ changes in window | Very low (0.1-0.3) | Report net result, flag attribution issue |

---

## Impact Verdict Framework

### POSITIVE
- Primary KPIs improved
- Improvement is statistically meaningful (beyond noise)
- No major trade-offs (e.g., CPA improved but conversions dropped 80%)

### NEGATIVE
- Primary KPIs declined
- Decline is meaningful, not just variance
- Direct link to change is plausible

### NEUTRAL
- Metrics essentially unchanged (within +/-10%)
- Improvement in one area offset by decline in another
- Change achieved its goal but had no net impact

### INCONCLUSIVE
- Insufficient data for verdict
- Multiple confounding factors
- Metrics moved but causation is unclear

### Threshold Guidelines for "Meaningful" Changes

| Metric | Noise Range (Ignore) | Marginal (Monitor) | Significant (Act) |
|--------|---------------------|-------------------|-------------------|
| CPA | +/-10% | 10-20% | >20% |
| ROAS | +/-10% | 10-20% | >20% |
| CVR | +/-15% | 15-25% | >25% |
| CPC | +/-10% | 10-20% | >20% |
| CTR | +/-15% | 15-30% | >30% |
| Conversion volume | +/-15% | 15-25% | >25% |

**Important:** These thresholds assume 30+ conversions in each window. With fewer conversions, widen the "noise" range significantly.

---

## Confidence Scoring

**0.9-1.0 (High):** Large sample size, single isolated change, clear timing correlation, conversion-level data available

**0.7-0.9 (Moderate):** Adequate sample size, mostly isolated change, some minor confounders present

**0.5-0.7 (Low):** Small sample size OR multiple concurrent changes OR short analysis window

**Below 0.5 (Very Low):** Preliminary or directional only. Recommend longer monitoring before any action.

### Confidence Adjustment Factors

Start with a base confidence, then apply adjustments:

| Factor | Adjustment |
|--------|-----------|
| Single isolated change | +0.15 |
| 14+ day windows both sides | +0.10 |
| 30+ conversions each window | +0.10 |
| Conversion data available (not just clicks) | +0.10 |
| Clear timing correlation | +0.05 |
| Multiple concurrent changes | -0.20 |
| Analysis window < 14 days | -0.10 |
| < 10 conversions in either window | -0.15 |
| Known external factor (holiday, season) | -0.10 |
| Performance was trending before change | -0.15 |
| Bid strategy still in learning phase | -0.20 |

**Example calculation:** Base 0.50, single change (+0.15), 14-day windows (+0.10), 40 conversions (+0.10), known holiday (-0.10) = 0.75 (Moderate confidence)

---

## Recommendation Logic

| Verdict | Confidence | Recommendation |
|---------|-----------|---------------|
| POSITIVE | High (>0.7) | **KEEP** the change, consider doubling down |
| POSITIVE | Low (<0.7) | **KEEP** but monitor, need more data |
| NEGATIVE | High (>0.7) | **REVERT** unless strategic reason to persist |
| NEGATIVE | Low (<0.7) | **MONITOR LONGER** before reverting |
| NEUTRAL | Any | Evaluate if change achieved other goals |
| INCONCLUSIVE | Any | **MONITOR LONGER**, add more tracking |

### Revert Decision Framework

Before recommending a revert, check these gates:

1. **Is the change still in its learning period?** If yes, recommend monitoring, not reverting.
2. **Was the change strategic or tactical?** Strategic changes (bid strategy, structure) deserve longer evaluation.
3. **Is the negative result within the tolerance zone?** A 12% CPA increase with a 25% volume increase might be acceptable.
4. **Can the change be iterated instead of reverted?** Sometimes adjusting (e.g., lower target ROAS) is better than fully reverting.

---

## Worked Examples

### Example 1: Clear Positive, Paused Underperforming Ad Groups

**Change:** Paused 3 underperforming ad groups on May 1st
**Window:** 14 days before vs. 14 days after

| Metric | Before (Apr 17-30) | After (May 1-14) | Change |
|--------|-------------------|-------------------|--------|
| Cost | $4,200 | $3,800 | -9.5% |
| Conversions | 28 | 32 | +14.3% |
| CPA | $150 | $119 | -20.7% |
| ROAS | 2.1X | 2.8X | +33.3% |

**Verdict:** POSITIVE (Confidence: 0.85)
**Why:** CPA dropped 21% while conversions increased 14%. Budget previously wasted on low-performers was reallocated to better-performing ad groups. Single change, adequate window, clear metrics improvement.
**Recommendation:** KEEP. Monitor for 2 more weeks to confirm trend holds. Consider similar analysis for other ad groups with CPA >$150.

### Example 2: Negative, But Needs Patience, Bid Strategy Switch

**Change:** Switched from Manual CPC to Maximize Conversions on March 15
**Window:** 14 days before vs. 14 days after

| Metric | Before (Mar 1-14) | After (Mar 15-28) | Change |
|--------|-------------------|-------------------|--------|
| Cost | $5,000 | $5,200 | +4.0% |
| Conversions | 50 | 38 | -24.0% |
| CPA | $100 | $137 | +37.0% |
| Avg CPC | $2.50 | $4.10 | +64.0% |

**Verdict:** NEGATIVE (Confidence: 0.65, reduced because bid strategy learning period may not be complete)
**Why:** CPA rose 37% while conversion volume dropped 24%. The algorithm is bidding more aggressively (CPC up 64%) without finding proportional conversions. However, Maximize Conversions typically needs 2-4 weeks to optimize, and 14 days may not be enough.
**Recommendation:** MONITOR LONGER. Check again at day 30. If CPA doesn't improve to <$120, consider reverting to Manual CPC or switching to Target CPA with a $110 target.

### Example 3: Inconclusive, Multiple Concurrent Changes

**Changes in window:**
- March 1: Added 50 new keywords
- March 3: Increased budget 25%
- March 5: Launched new ad copy

**Result:** CPA down 15%, conversions up 20%

**Verdict:** INCONCLUSIVE (Confidence: 0.40)
**Why:** Performance improved, but three significant changes within 5 days make it impossible to isolate which change drove the improvement. Any of the three, or their combination, could be responsible.
**Recommendation:** KEEP all changes (net result is positive). For future tests, change one variable at a time with 2-week gaps between changes.

### Example 4: Neutral with Trade-Off, Budget Increase

**Change:** Increased campaign budget from $100/day to $150/day on June 1
**Window:** 14 days before vs. 14 days after

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Cost | $1,400 | $2,050 | +46.4% |
| Conversions | 20 | 26 | +30.0% |
| CPA | $70 | $79 | +12.9% |
| IS (Budget) | 35% lost | 18% lost | Improved |

**Verdict:** NEUTRAL (Confidence: 0.80)
**Why:** Conversions increased 30% but CPA rose 12.9%. The additional budget captured incremental conversions at a higher marginal cost, this is expected. The trade-off is volume vs. efficiency.
**Recommendation:** KEEP if the business prioritizes volume growth and CPA at $79 is still below target ($100). REVERT if efficiency is the priority and $70 CPA was more valuable than the extra 6 conversions.

---

## Handling Conflicting Signals

**CPA improved but conversions dropped:**
- Calculate total impact: fewer conversions at lower CPA may mean less total value
- Ask: Would the client prefer 50 conversions at $100 or 30 at $80?
- Frame as a trade-off requiring business judgment
- If conversion volume dropped >50%, flag as NEGATIVE regardless of CPA improvement

**CTR increased but conversions declined:**
- Ad is attracting more clicks but wrong audience, or landing page isn't converting
- Trust conversion data over engagement data
- Investigate alignment between ad promise and landing page delivery
- This pattern usually indicates an alignment problem

**Short-term negative, long-term potential:**
- Bid strategy changes need 2-4 weeks to learn
- New campaigns need ramp time
- Flag as "too early" rather than "failed"
- Provide a specific date for reassessment

**Volume up, efficiency down (or vice versa):**
- This is the most common trade-off in PPC
- Frame against business goals: growth phase = tolerate efficiency loss; efficiency phase = protect margins
- Calculate the marginal CPA: what is each incremental conversion costing?

---

## Output Format

For each analysis, provide these sections in markdown:

### Change Summary
Plain-English description of what changed, when, and what it affected.

### Analysis Windows
Before period: dates, duration
After period: dates, duration

### Metrics Comparison
Side-by-side before/after for each metric:
- Metric name, before value, after value, change (absolute and %), direction (up/down/flat)
- Flag whether each change is significant, marginal, or noise

### Verdict
- **Impact:** POSITIVE / NEGATIVE / NEUTRAL / INCONCLUSIVE
- **Confidence:** 0.0-1.0 with explanation
- **Summary:** 2-3 sentence plain-English assessment

### Context Factors
Any factors that affect the analysis:
- Concurrent changes, seasonality, external events
- How each factor affects confidence

### Recommendation
- **Action:** KEEP / REVERT / ITERATE / MONITOR LONGER
- **Rationale:** Why this action, connected to the data
- **Next Steps:** Specific actions with timeline

---

## Edge Cases

### Bid Strategy Changes with Mandatory Learning Phase

When analyzing a bid strategy switch (Manual to Smart Bidding, or between Smart Bidding strategies):
- Exclude the first 7-14 days as "learning period"
- If total after-window is less than 21 days, explicitly warn: "Bid strategy changes need 2-4 weeks post-learning to evaluate. This analysis is premature."
- Never assign high confidence to a bid strategy verdict before day 28

### Seasonal Overlap

If the before/after window spans a seasonal boundary (e.g., Black Friday, summer slowdown):
- Acknowledge the seasonal confound explicitly
- If YoY data is available, use it to normalize
- Reduce confidence by 0.10-0.20
- Recommend year-over-year comparison for the same period

### Zero-Conversion Scenarios

If either window has zero conversions:
- Cannot calculate CPA/ROAS, switch to click/CTR-level analysis only
- Flag: "Insufficient conversion data for reliable performance verdict"
- Focus on directional signals (click volume trends, CTR changes)
- Recommend monitoring until at least 10 conversions accumulate in both windows

### Very Small Accounts (<$1K/month)

For small-spend accounts:
- Widen noise thresholds by 50% (e.g., CPA noise range becomes +/-15% instead of +/-10%)
- Extend minimum analysis windows by 50%
- Be explicit: "At this spend level, variance is high. Patterns need more time to confirm."

---

## Guardrails

**ALWAYS** cite specific metrics in every diagnosis (e.g., "CPA dropped from $150 to $119" not "CPA improved")
**ALWAYS** state confidence level alongside every verdict
**ALWAYS** acknowledge when concurrent changes make attribution unreliable
**ALWAYS** recommend monitoring duration before reverting
**ALWAYS** use "correlation does not equal causation" when confidence is low

**NEVER** assign a verdict without stating confidence level
**NEVER** declare success or failure from <7 days of data
**NEVER** ignore confounding factors to deliver a cleaner narrative
**NEVER** recommend reverting without considering learning period requirements
**NEVER** present uncertain findings as definitive conclusions

---

## Anti-Patterns to Avoid

**Declaring victory too early**, "The change worked!" after 3 days and 2 conversions
**Ignoring confounders**, Attributing all improvement to one change when three things changed
**Reverting prematurely**, Killing a bid strategy change after 5 days when it needs 2-4 weeks
**Metric cherry-picking**, Celebrating CTR improvement while ignoring conversion decline
**False precision**, "Confidence: 0.83" when the underlying data barely supports a directional guess
**Ignoring trade-offs**, Calling a change "positive" when CPA improved but volume dropped 60%
**Binary thinking**, Every change must be "good" or "bad", NEUTRAL and INCONCLUSIVE are valid findings

---

## Quality Assurance

Before delivering the analysis:

- [ ] Change is described in plain English (not API jargon)
- [ ] Before/after windows are clearly stated with dates and duration
- [ ] Analysis window meets minimum for the change type
- [ ] Learning period excluded for bid strategy changes
- [ ] Percentage changes are directionally clear (+23% not "23% change")
- [ ] Confidence score reflects data quality, confounders, and sample size
- [ ] Confidence adjustment factors are considered
- [ ] Verdict is justified with specific metrics
- [ ] Confounding factors are acknowledged
- [ ] Recommendation includes specific next steps with timeline
- [ ] Statistical limitations are flagged when relevant
- [ ] Trade-offs are framed for business judgment, not buried
