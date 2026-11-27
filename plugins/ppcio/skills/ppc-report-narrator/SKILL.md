---
name: ppc-report-narrator
description: "Turn monthly, quarterly, or QBR campaign performance tables into a plain-English strategic narrative explaining why results moved. Not for lag-adjusted weekly client emails (use weekly-client-report) or internal weekly triage (use weekly-pulse)."
---

# PPC Report Narrator

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the period of the report, compared with the period before (Compare in the date picker), add the columns Cost, Clicks, Conversions and Cost / conv. (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Transform monthly Google Ads performance data into strategic, client-facing report narratives. Every insight translates metrics into business outcomes, not data dumps.

---

## Core Philosophy

### Business Impact Over Metric Reporting

Translate metrics to business outcomes. Clients don't hire you to say "CPA increased 15%". They hire you to know if that's a problem, why it happened, and what to do about it.

**What this means:**
- Every metric change must be translated into business impact language
- Prioritize insights by strategic importance, not magnitude of change
- Connect tactical metrics (CPC, CTR) to strategic outcomes (customer acquisition, profitability)

**Right:** "You're paying USD 7 more per customer this month. This was driven by expanding into broader keywords to scale volume, a strategic trade-off that increased total conversions by 28%."
**Wrong:** "Your CPA increased from USD 45 to USD 52 (+15.6%)"

### Context Over Comparison

Changes in metrics are meaningless without understanding WHY they happened. A 20% drop might be excellent (paused waste) or concerning (tracking broke).

**What this means:**
- Explain the root cause of every significant change
- Acknowledge seasonal patterns, testing phases, scaling decisions
- Distinguish between signal (real trend) and noise (random variation)

**Right:** "Conversions dipped 18% in Week 1 as we paused underperforming campaigns, then recovered to +5% above baseline by Week 4."
**Wrong:** "Conversions dropped 18% month-over-month"

### Strategic Storytelling, Not Data Dumps

Reports should read like a strategic brief from a trusted advisor, not a spreadsheet export.

**What this means:**
- Lead with the most important insight
- Use plain English over jargon
- Structure insights as: situation, evidence, implication, recommendation
- Acknowledge trade-offs transparently

### Confidence-Weighted Insights

Not all insights are equally certain. Be explicit about data quality.

- **High confidence:** 30+ conversions, 90+ days, clear pattern
- **Medium confidence:** 10-29 conversions, 30+ days, mostly consistent
- **Low confidence:** <10 conversions, short window, high variance
- Never make definitive claims from insufficient data

### Balanced Perspective

Every strategic decision involves trade-offs. Celebrate wins appropriately. Flag concerns without panic. Never cherry-pick.

**Right:** "ROAS dipped from 4.2X to 3.8X as we expanded reach. You're still acquiring customers profitably, revenue is up 35%."
**Wrong:** "ROAS dropped from 4.2X to 3.8X, we need to optimize"

---

## Critical Context Gathering

### Required Context

**1. Google Ads Performance Data**
Minimum: Account-level metrics (spend, conversions, CPA, clicks, impressions)
Better: Campaign-level breakdown with period comparison

**2. Business Targets**
- Target CPA (cost per acquisition goal) OR
- Target ROAS (return on ad spend goal)
- If not provided, use account averages as baseline

### Recommended Context

**3. Comparison Period Data**
- Previous month or previous period metrics
- Enables trend analysis and context

**4. Business Type & Growth Phase**
- Lead gen vs eCommerce vs SaaS
- Scaling vs efficiency vs testing phase
- Helps frame trade-offs appropriately

**5. Actions Taken This Period**
- What changed (budget shifts, new campaigns, paused keywords)
- Enables "what we did and why" narrative

---

## Priority Cascade

When multiple insights compete for attention, apply this priority order:

### Priority 1: Profitability Relative to Goals
Are you acquiring customers profitably based on targets? This is the only metric that directly answers "Is advertising working?"

| Performance vs Target | Framing Approach |
|----------------------|-----------------|
| Meeting/exceeding targets | Lead with positive outcome, build on momentum |
| Missing slightly (<15%) | Lead with context (why), then the gap |
| Missing significantly (>15%) | Lead with the gap, then action plan |
| No targets provided | Compare periods + internal benchmarks |

### Priority 2: Conversion Volume & Statistical Significance
Do you have enough data for reliable conclusions?

| Volume | Confidence | Framing |
|--------|-----------|---------|
| <10 conversions | Low | "Too early to judge, we need more data" |
| 10-30 conversions | Moderate | "Emerging patterns suggest..." |
| 30+ conversions | High | Draw confident conclusions |

### Priority 3: Total Business Impact (Absolute Value)
A 50% improvement in a USD 100/month campaign matters less than a 10% decline in a USD 10,000/month campaign. Always calculate absolute dollar impact.

### Priority 4: Strategic Alignment with Growth Phase
The same performance can be "good" or "bad" depending on goals. CPA rising 10% while volume increases 40% is excellent for growth-focused clients.

### Tiebreaker Rules
- Conversion data beats engagement data
- Total impact beats per-unit efficiency
- Established patterns beat new signals
- Longer time windows beat shorter ones

---

## Narrative Construction Framework

### The SEIRA Model (for each key insight)

**S, Situation:** What happened (the metric change)
**E, Evidence:** Specific data supporting it
**I, Implication:** What it means for the business
**R, Root cause:** Why it happened
**A, Action:** What we're doing about it (or recommending)

**Example:**
- **S:** "Customer acquisition cost increased 15% this month"
- **E:** "CPA moved from USD 45 to USD 52 across non-brand campaigns"
- **I:** "At current volume (120 conversions), this represents USD 840 additional monthly spend"
- **R:** "We expanded into broader match types to capture more volume, which brought in higher-funnel traffic"
- **A:** "We're monitoring closely. If CPA doesn't return to <USD 50 by Week 3 of next month, we'll tighten match types back to phrase"

### Change Significance Thresholds

Not every metric change deserves mention. Use these to filter noise from signal:

| Metric | Normal Variance (Skip) | Worth Mentioning | Highlight |
|--------|----------------------|-----------------|-----------|
| CPA | +/-8% | 8-20% | >20% |
| ROAS | +/-8% | 8-20% | >20% |
| CTR | +/-15% | 15-30% | >30% |
| CPC | +/-10% | 10-25% | >25% |
| Conversion volume | +/-10% | 10-25% | >25% |
| Spend | +/-5% | 5-15% | >15% |

### Framing Trade-Offs

When efficiency metrics conflict with volume metrics, frame for the client's growth phase:

**Growth Phase Client:**
"Conversions increased 40% while CPA rose 12%. This is the expected trade-off when scaling, each incremental customer costs slightly more to acquire, but you're growing revenue significantly faster. At USD 52 CPA vs your USD 60 target, there's still healthy margin."

**Efficiency Phase Client:**
"CPA increased 12% to USD 52, approaching your USD 55 ceiling. While volume increased, the marginal cost of each new conversion is rising. We recommend holding budgets steady and focusing on conversion rate improvements before pushing for more volume."

---

## Output Format

For each report, provide these sections in markdown:

### Executive Summary
2-3 sentences, plain English. Lead with the headline metric. Frame against targets and previous period.

### What's Working
Narrative with specific examples. Cite actual metrics. Explain WHY it's working, not just WHAT is performing.

### What's Concerning
With context, not panic. Explain the root cause. Distinguish real problems from normal variance. Include what you're doing about it.

### Key Insights
Each insight must include:
- **Observation:** What you found (specific data)
- **Evidence:** Metrics supporting it
- **Business Impact:** What it means for the business
- **Confidence:** High / Medium / Low (based on data quality)

### Next Steps
Prioritized recommendations, each with:
- Specific action to take
- Rationale connected to data
- Expected impact (dollars or percentages)
- Timeline (immediate / this week / this month)

### Campaign Breakdown
Status per campaign: working well / needs attention / monitoring
One-sentence summary for each with key metric

### Quality Notes
Data gaps, limitations, things that would improve the analysis

---

## Guardrails

**ALWAYS** frame metrics against targets and previous period
**ALWAYS** include both wins AND challenges, no cherry-picking
**ALWAYS** translate jargon into plain English
**ALWAYS** assign confidence levels based on data quality
**ALWAYS** provide at least 2 actionable next steps

**NEVER** report raw metrics without business context
**NEVER** make definitive claims from <10 conversions
**NEVER** bury strategic insights behind tactical details
**NEVER** use jargon the audience won't understand
**NEVER** propose actions without connecting them to data

---

## Anti-Patterns to Avoid

**Reporting without prioritization**, Listing 15 metric changes without indicating which matter most
**Celebrating noise**, Calling a 3% improvement from 2 data points a "win"
**Panic over volatility**, Flagging every week-over-week dip during normal variance
**Jargon overload**, Using CTR, CVR, QS without translation
**Burying the lede**, Leading with tactical details instead of business impact
**Making excuses**, Over-explaining every decline instead of owning it and providing solutions
**Definitive claims from tiny samples**, "This campaign doesn't work" after 3 conversions

---

## What I Don't Flag (Avoiding Noise)

These are normal variance, not issues, skip them in reports:
- Minor impression share fluctuations (<10%)
- Single-day performance anomalies
- Low-spend keywords with limited data
- Vanity metrics without conversion impact
- "Best practices" that don't fit the specific context
- CPC fluctuations <10% (market dynamics)

**Example language for dismissing noise:**
"Mobile IS dropped 8% this week, but conversion volume remained stable at target CPA. Normal variance, no action needed."

---

## Conversion Lag Considerations

Recent data is incomplete for accounts with conversion lag. Always account for this:

| Conversion Type | Typical Lag | Reporting Impact |
|----------------|------------|-----------------|
| Online purchase | 0-1 days | Minimal, report as-is |
| Form submission (lead gen) | 0-3 days | Exclude last 3 days from metrics |
| Offline conversion (CRM) | 7-30 days | Heavily caveat recent weeks |
| B2B sales qualified lead | 14-90 days | Recent months always incomplete |

**Standard caveat:** "Note: The last [X] days of data may be incomplete due to conversion reporting lag. Final numbers typically improve by [X]% once all conversions report."

---

## If Target Metrics Not Provided

When the client hasn't shared CPA/ROAS targets, assess based on:
- **Internal benchmarks:** Campaign vs campaign comparison
- **Obvious outliers:** 10x CPA variance between campaigns
- **Zero performers:** Campaigns with spend but no conversions
- **Relative performance:** Identify best/worst performers

And note: "Without target CPA/ROAS, I'm comparing campaigns against each other. For assessment against business goals, provide targets."

---

## Edge Cases

### No Comparison Period Available

When the user only provides one period of data:
- Compare campaigns against each other (internal benchmark)
- Compare against targets (if provided)
- Flag: "Without comparison period data, trend analysis is limited. Provide last month's data for richer insights."

### First Month Report (New Account)

- Focus on foundation metrics: tracking validation, structure assessment, initial signals
- Set expectations: "Month 1 is about building the foundation. Performance conclusions require 60-90 days of data."
- Highlight what's been set up and what's working directionally

### Very Small Account (<USD 2K/month, <10 conversions)

- Avoid per-campaign efficiency analysis (insufficient data)
- Focus on: alignment checks, traffic quality, keyword relevance
- Frame honestly: "At current volume, we're in data-gathering mode. Statistical confidence requires more conversions."

### Dramatic Performance Shift (>50% change in key metric)

- Investigate root cause BEFORE presenting numbers
- Common causes: tracking break, seasonal shift, major budget change, new competition
- Lead with the explanation, not the alarming number

### Mixed Results Across Campaigns

When some campaigns crush targets while others underperform:
- Report at account level FIRST (blended performance vs goals)
- Then break down: "Here's where the wins are, here's where the challenges are"
- Quantify the drag: "Campaign X is pulling blended CPA up by USD 8. Without it, account CPA would be USD 42 vs USD 50 target."
- Recommend: reallocate, fix, or pause the underperformers

### Seasonal Period (Holiday, Summer, etc.)

- Always acknowledge seasonality when relevant
- Compare to same period last year if possible, not just last month
- Frame expectations: "December CPC increases are industry-wide. The 15% CPC jump is consistent with seasonal competition."
- Separate seasonal effects from structural changes

---

## Quality Assurance

Before delivering the report:

- [ ] Executive summary is 2-3 sentences, plain English, leads with headline metric
- [ ] Every insight cites specific metrics from the input data
- [ ] Both wins and concerns are included (balanced perspective)
- [ ] Confidence levels reflect actual data quality and sample sizes
- [ ] Next steps are specific, actionable, and connected to data
- [ ] Campaign breakdown covers all campaigns with clear status
- [ ] No jargon used without explanation
- [ ] Metrics are framed against targets and/or prior period
- [ ] Trade-offs are acknowledged transparently
- [ ] Change significance thresholds applied (noise filtered out)
- [ ] Root causes provided for every significant metric change
