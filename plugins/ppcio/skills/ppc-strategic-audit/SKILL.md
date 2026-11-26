---
name: ppc-strategic-audit
description: "Deep 90-day multi-tab Google Ads audit checking strategic alignment across campaigns, keywords, ads, and landing pages, separating profitable spend from waste. Not for a quick 5-minute campaign-table health grade — use ppc-account-health-check instead."
---

# PPC Strategic Audit

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 90 days, add the columns Budget, Bid strategy type, Cost, Conversions, Cost / conv. and Search impr. share (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Perform data-driven Google Ads audits that identify wasted spend and high-leverage optimization opportunities. This skill extracts strategic insights, not generic advice.

---

## Core Philosophy

### Alignment Before Performance
Verify the alignment chain (search term --> keyword --> ad --> landing page --> offer) BEFORE analyzing performance metrics. A low CVR might indicate broken alignment, not poor performance.

### Profitability Over Vanity
Prioritize profit-driving metrics over volume-driving metrics:
1. CPA / ROAS (profitability)
2. CVR (efficiency)
3. CTR (relevance signal)
4. Impressions / Clicks (volume)

### Sample Size Discipline
Respect statistical significance. No confident conclusions from insufficient data:

| Confidence | Conversions | Time Period | Pattern |
|-----------|------------|------------|---------|
| High | 30+ | 90+ days | Clear, consistent |
| Medium | 10-30 | 30-90 days | Reasonable, some variance |
| Low | <10 | <30 days | Unclear, high variance |

### Waste Before Growth
Eliminate waste before pursuing growth. Fix leaks before adding water:
1. Stop the bleeding (cut clear waste)
2. Feed the winners (increase budgets on what works)
3. Test new growth (after protecting profitability)

### Structure Enables Performance
Fix foundational structure before tactical tweaks. 10 campaigns with 2 conversions each < 2 campaigns with 10 conversions each.

---

## Critical Context Gathering

### Required Context (Ask if not provided)

**1. Google Ads Performance Data**
- Minimum: Campaign-level metrics (spend, conversions, CPA)
- Ideal: Campaign, ad group, keyword, and search term data
- Acceptable formats: Excel export, CSV, Google Sheets link, pasted data

**2. Business Targets**
- Target CPA (cost per acquisition goal) OR
- Target ROAS (return on ad spend goal)
- If not provided, will use account averages as baseline

**3. Time Period**
- Default: Last 30 days
- Ideal: 90 days for statistical reliability

### Recommended Context

**4. Business Type**
- Lead gen, eCommerce, local services, SaaS, etc.
- Helps validate alignment and set expectations

**5. Account Spend Tier**

| Tier | Monthly Spend | Statistical Impact |
|------|-------------|-------------------|
| Small | <$5K/mo | Limited per-campaign confidence, focus on account-level |
| Medium | $5-25K/mo | Campaign-level analysis reliable for top spenders |
| Large | $25-100K/mo | Full keyword-level analysis possible |
| Enterprise | >$100K/mo | All dimensions analyzable with high confidence |

### Optional Context

**6. Recent Changes**
- New campaigns, budget shifts, bidding changes
- Helps explain anomalies

**7. Seasonal Context**
- Peak vs slow season for this business
- Known promotions or market events

---

## Input Format

Accept Google Ads data in any reasonable format:

- **Excel/CSV export** (preferred): Full account export or specific tabs
- **Google Sheets link**: With view access
- **Pasted data**: Tables with campaign/ad group/keyword metrics
- **Screenshots**: Can extract key metrics (less reliable)
- **API data**: JSON format from Google Ads API

**Minimum data requirements:**
- At least 7 days of data (30+ preferred)
- Campaign names and metrics (impressions, clicks, cost, conversions)
- At least 1 conversion recorded (for meaningful analysis)

---

## Analysis Framework

### Phase 1: Account Maturity Assessment

Before diving into metrics, classify the account to calibrate expectations:

| Stage | Signals | Audit Focus |
|-------|---------|-------------|
| **New** (0-3 mo) | Learning phase, limited data, structure forming | Tracking validation, structure, patience |
| **Growth** (3-12 mo) | Winners emerging, room to scale, testing active | Scale winners, expand carefully, data density |
| **Mature** (1-3 yr) | Stable performance, optimization refined | Efficiency gains, incremental improvements |
| **Plateau** (3+ yr) | Flat YoY, optimizations exhausted | Structural innovation, new channels |
| **Turnaround** (any age) | Inherited mess, performance crisis | Triage: stop bleeding first |

**Why this matters:** Recommending "scale your budget" to a turnaround account or "consolidate structure" to a new account causes harm. Match recommendations to maturity.

### Phase 2: Data Quality Assessment

Before analysis, evaluate data integrity:

**Conversion Tracking Validation:**
- How many conversion actions are being tracked?
- Are there duplicate conversions inflating numbers?
- Is conversion value being tracked (needed for ROAS)?
- Conversion lag: Are recent days reliable?

**Data Quality Flags:**

| Flag | What It Means | Impact on Analysis |
|------|--------------|-------------------|
| Conversions > Clicks | Tracking error or offline imports | Flag, don't trust CVR |
| Sudden conversion drop to 0 | Tracking broke | Exclude affected period |
| CPA varies >5x between campaigns | Different conversion actions or types | Normalize before comparing |
| Zero impression share data | Search campaigns may be limited | Cannot assess budget constraints |

### Phase 3: Alignment Chain Validation

The most important phase. Fix alignment BEFORE optimizing performance.

**The Chain:** Search Term --> Keyword --> Ad Copy --> Landing Page --> Offer

| Chain Link | What to Check | Broken Signal |
|-----------|--------------|---------------|
| Search Term --> Keyword | Are search terms relevant to keyword intent? | High impressions, low CTR on irrelevant terms |
| Keyword --> Ad Copy | Does ad reflect keyword promise? | Low Quality Score creative component |
| Ad Copy --> Landing Page | Does LP deliver what ad promised? | High CTR + Low CVR = alignment break |
| Landing Page --> Offer | Is the next step clear and compelling? | Traffic but no form fills/calls |

**Alignment Break Detection:**

| Pattern | Diagnosis | Fix Priority |
|---------|-----------|-------------|
| High CTR (>6%) + Low CVR (<1%) | Ad-to-LP mismatch | Critical, fix before anything else |
| Low CTR (<2%) + Normal CVR | Ad relevance issue | High, test new ad copy |
| Normal CTR + Low CVR | LP or offer problem | High, audit landing page |
| Low IS (Rank) + Normal IS (Budget) | Quality/relevance issue | Medium, improve Quality Score |
| Low IS (Budget) + Normal IS (Rank) | Budget constraint | Good problem, consider scaling |

**Intent Classification for Search Terms:**

| Intent | Signal Words | Expected Action |
|--------|-------------|----------------|
| Commercial High | buy, order, hire, quote, price, near me | High bid, strong LP |
| Commercial Medium | best, top, compare, review, alternative | Moderate bid, comparison content |
| Informational | how to, what is, guide, tips, free | Low bid or exclude |
| Wrong Intent | jobs, salary, DIY, template, download free | Negative keyword immediately |

### Phase 4: Working vs Not Working

Classify every significant segment:

| Status | Criteria | Action |
|--------|----------|--------|
| Working | CPA <= target, CVR >= account avg, 10+ conversions | Protect and consider scaling |
| Promising | CPA within 20% of target, 5-10 conversions | Monitor, give more time |
| Not Working | CPA > 1.5x target, 30+ days, adequate spend | Fix alignment or cut |
| Insufficient Data | <10 conversions, <30 days | Cannot conclude, wait |
| Clear Waste | $200+ spend, 0 conversions, obvious intent mismatch | Pause or negative keyword |

### Phase 5: Opportunity Identification

Categories in priority order:

**1. Waste Elimination (Do First)**
- Zero-conversion keywords/campaigns with significant spend
- Search terms with clear wrong intent
- Geographic targeting leaks (serving non-service areas)
- Quantify: "Pausing [X] would save $[Y]/month"

**2. Alignment Fixes (Do Second)**
- Intent mismatches identified in Phase 3
- Ad-to-LP disconnects
- Quality Score issues on high-spend keywords
- Quantify: "Fixing alignment on [X] could improve CVR from [Y]% to [Z]%"

**3. Scaling Winners (Do Third)**
- Budget-constrained profitable campaigns (lost IS to budget >20%)
- High-ROAS campaigns with room to grow
- Converting search terms not yet added as keywords
- Quantify: "Increasing budget on [X] could generate [Y] additional conversions at $[Z] CPA"

**4. Structural Improvements (Do Fourth)**
- Data fragmentation (too many campaigns, thin data per campaign)
- Competing campaigns bidding on same terms
- Match type consolidation opportunities
- Quantify: "Consolidating [X] campaigns would improve data density for algorithm optimization"

### Phase 6: Prioritized Action Plan

Every recommendation must include:

| Component | Requirement |
|-----------|------------|
| Trigger metric | What data supports this (cite specific numbers) |
| Rationale | Why this matters for the business (revenue-tied) |
| Specific action | What to do in Google Ads (navigation steps) |
| Expected impact | Quantified in dollars or percentages |
| Effort level | Low (15 min) / Medium (1-2 hrs) / High (half day+) |
| Confidence | High / Medium / Low based on data quality |

**Priority Scoring:**

| Priority | Impact | Effort | Risk | Timeline |
|----------|--------|--------|------|----------|
| Quick Win | High | Low | Low | This week |
| High Priority | High | Medium | Low-Med | This month |
| Medium Priority | Medium | Medium | Medium | Next 30 days |
| Monitor | Low-Med | Low | Low | Ongoing |

---

## Output Format

### Executive Summary
```
**Situation:** [1-2 sentence account health assessment]

**Core Issue:** [Primary limiting factor identified]

**Waste Quantified:** [$X on [specific waste type]]

**Top Opportunity:** [Highest-leverage path forward]

**Estimated Impact:** [Projected business value]
```

### Account Snapshot
| Metric | Value | vs Target |
|--------|-------|-----------|
| Spend | $X | - |
| Conversions | X | - |
| CPA | $X | X% above/below target |
| CVR | X% | vs X% account avg |

### Account Health Grade (A/B/C/D)

| Grade | Criteria |
|-------|----------|
| **A** | Hitting targets, good structure, minimal waste, strong alignment |
| **B** | Mostly hitting targets, 1-2 moderate issues, some optimization headroom |
| **C** | Missing targets OR significant waste OR alignment breaks |
| **D** | Multiple critical issues, major waste, broken tracking, or structural failure |

### What's Working (Protect These)
- [Segment]: [Metrics] - [Why it works]

### What's Not Working (Fix or Cut)
- [Segment]: [Metrics] - [What's wrong] - [Root cause]

### Priority Action Plan

**1. [Action Title]** (Quick Win / High Priority / Medium Priority)
- Trigger: [Specific metric that flagged this]
- Action: [Exactly what to do]
- Impact: [Expected outcome in dollars]
- Effort: [Low/Medium/High]
- Confidence: [High/Medium/Low]

### Data Quality Notes
- [Any flags, anomalies, or missing information]
- [What additional data would improve analysis]

---

## Edge Cases

### Low-Volume Account (<20 conversions in 30 days)
- Focus on alignment checks (can verify without conversion volume)
- Recommend consolidation to pool data
- Flag insufficient data explicitly
- Avoid performance-based optimization claims
- Still quantify waste: "$500 spent on 0-conversion keywords is waste regardless of volume"

### No Target CPA/ROAS Provided
- Use account average as baseline
- Compare segments relative to each other
- Flag: "Without target CPA/ROAS, I'm comparing campaigns against each other. Absolute assessment requires business targets."

### Single Campaign Account
- Focus on keyword/ad group level analysis
- Check for structural expansion opportunities
- Analyze search term alignment
- Recommend breaking into brand vs non-brand at minimum

### eCommerce vs Lead Gen

| Dimension | eCommerce Focus | Lead Gen Focus |
|-----------|----------------|---------------|
| Primary metric | ROAS | CPA |
| Campaign types | Shopping + Search + PMAX | Search + PMAX |
| Alignment check | Product page relevance | Form/call experience |
| Waste signals | Products with spend but no sales | Keywords with spend but no leads |
| Growth signals | High-ROAS products constrained | Low-CPA campaigns budget-limited |
| Structure check | Product groups granularity | Campaign-to-service mapping |

### Brand vs Non-Brand Mix
- Always separate brand and non-brand performance in the analysis
- Blended CPA is misleading when brand drives most conversions
- A common pattern: "Account CPA is $35 (below $50 target)" but non-brand CPA is $95 and brand CPA is $12
- Recommendation: Always report "Account CPA: $35 (Brand: $12, Non-Brand: $95)"

### Turnaround Account (Inherited Mess)
- Start with triage: what's the biggest source of waste RIGHT NOW?
- Don't try to fix everything at once, prioritize the top 3 actions
- Set a 30-day checkpoint: "After these 3 fixes, reassess"
- Be honest with the client: "This account needs foundational rebuilding, not optimization"

### Seasonal Period
- Compare to same period last year if possible
- Note seasonal CPC inflation as normal (not a problem to solve)
- Frame expectations: "Q4 CPCs are 15-30% higher industry-wide"

---

## Guardrails

**NEVER** make confident claims from insufficient data (<10 conversions)
**NEVER** recommend bid changes without checking alignment first
**NEVER** suggest killing campaigns with <30 days data and <5 conversions
**NEVER** give generic advice ("improve ad copy") without specific guidance
**NEVER** ignore data quality issues
**NEVER** present blended metrics without noting brand vs non-brand split

**ALWAYS** quantify waste in dollars
**ALWAYS** state confidence level for each finding
**ALWAYS** prioritize profitability over volume
**ALWAYS** check for alignment issues before performance optimization
**ALWAYS** provide specific, actionable recommendations
**ALWAYS** include root cause for every identified issue

---

## Anti-Patterns to Avoid

**Laundry list of issues:** 20 findings with no prioritization, overwhelms, doesn't guide
**Generic advice:** "Test new ad copy" without specifying which campaign, why, and what to test
**Metrics without context:** "CTR is 3.2%", is that good or bad for this account type?
**Ignoring account stage:** Recommending advanced optimization for a 2-week-old account
**Cherry-picking wins:** Only highlighting improvements while ignoring waste
**Blended CPA trap:** Reporting account-level CPA that hides brand vs non-brand problems

---

## Quality Assurance

Before delivering audit:

- [ ] All metrics cited match provided data exactly
- [ ] Confidence levels appropriate for sample sizes
- [ ] No generic recommendations without account-specific evidence
- [ ] Waste quantified in specific dollar amounts
- [ ] Action plan is prioritized (not a laundry list)
- [ ] Each recommendation includes rationale + specific action + expected impact
- [ ] Data quality issues flagged transparently
- [ ] Working segments identified and protected
- [ ] Alignment chain checked before performance optimization
- [ ] Account maturity assessed and recommendations calibrated accordingly
- [ ] Brand vs non-brand performance separated
- [ ] Root cause provided for every significant finding
