---
name: ppc-experiment-finder
description: Surface actionable A/B test opportunities from Google Ads performance data. Triggers when user shares Google Ads data and asks for test ideas, experiment recommendations, optimization opportunities, or "what should I test". Every experiment must cite specific metrics from the input data and be explained in plain English.
---

# PPC Experiment Finder

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 90 days, add the columns Bid strategy type, Cost, Conversions and Cost / conv. (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Identify high-impact experiments from Google Ads performance patterns. Every recommendation is grounded in YOUR account's specific data, not generic best practices.

---

## Core Philosophy

### Surface What The Data Shows, Not Generic Best Practices

Every experiment must be triggered by a specific performance pattern visible in the data.

**What this means:**
- Don't suggest "test mobile ads" unless mobile performance shows a problem
- Don't recommend "add more keywords" unless search terms show missed opportunities
- Don't propose "increase budgets" unless impression share shows constraints

**Right:** "Mobile CVR is 0.8% vs desktop 2.4%" --> Test mobile landing page
**Wrong:** "Test mobile landing page" (no data justification)

### Prioritize High-Impact, Low-Risk First

Quick wins before complex tests:
- **High Priority:** Strong signal + easy execution + low risk + clear impact
- **Medium Priority:** Good signal + moderate complexity + manageable risk
- **Low Priority:** Weak signal OR complex execution OR high risk

### Speak Plain English

No jargon. Everyone on the team should understand immediately.

**Right:** "Increase budget on branded campaign"
**Wrong:** "Optimize budget allocation for RLSA-enabled brand SKAG"

**Right:** "Mobile users convert 3X worse than desktop"
**Wrong:** "Device-level CVR variance indicates UX optimization opportunity"

### Connect Performance Gaps to Business Impact

Don't just say "CTR is low" - explain what it costs.

- "Campaign losing 60% IS to budget" --> "Could be generating ~$12K more revenue"
- "Search term converting at $18 CPA below $50 target" --> "Leaving money on table"

### Acknowledge Uncertainty

Not every signal is definitive. Use confidence scores:
- **0.9-1.0:** Strong signal, 30+ conversions, clear pattern
- **0.7-0.8:** Good signal, 10-29 conversions, mostly consistent
- **0.5-0.6:** Weak signal, <10 conversions, inconsistent
- **<0.5:** Insufficient data to recommend

---

## Critical Context Gathering

### Required Context

**1. Google Ads Performance Data**
Minimum: Campaign-level metrics (spend, conversions, CPA)
Better: Include device/geo breakdowns, search terms, impression share

**2. Business Targets**
- Target CPA (cost per acquisition goal) OR
- Target ROAS (return on ad spend goal)
- If not provided, will use account averages as baseline

### Recommended Context

**3. Time Period**
- Default: Last 30 days
- Better: 90 days for more reliable patterns

**4. Business Type**
- Lead gen vs eCommerce vs SaaS
- Helps validate experiment priorities

---

## Priority Cascade (When Multiple Opportunities Exist)

### ALIGNMENT PROBLEMS (Fix First)

If the alignment chain is broken, fix before optimization.

**Signals:**
- High CTR + Low CVR --> Ad promise doesn't match landing page
- Conversions but wrong intent --> Keywords attracting wrong audience
- Low Quality Score --> Message-to-page mismatch

**Thresholds that trigger alignment experiments:**

| Signal | Threshold | Experiment Type |
|--------|-----------|----------------|
| CTR >6% but CVR <1% | Mismatch confirmed | Landing page or ad copy test |
| Quality Score <5 on high-spend keywords | Poor relevance | Message match review |
| Search terms >30% off-intent | Targeting leak | Negative keyword + match type test |

### SCALING PROFITABLE PERFORMANCE (Quick Wins)

If something is working and constrained, scale it.

**Signals:**
- High ROAS + Lost impression share to budget
- Strong performance + limited by budget

**Thresholds:**

| Signal | Threshold | Experiment |
|--------|-----------|-----------|
| ROAS >2x target + IS lost to budget >30% | Clear win | Increase budget 25-50% |
| CPA <75% of target + IS lost to budget >20% | Strong headroom | Increase budget 30% |
| Converting search terms not as keywords | Missed opportunity | Add as exact match |

### STOPPING OBVIOUS WASTE (Cost Savings)

If something is clearly not working, stop spending.

**Signals and Thresholds:**

| Signal | Threshold | Action |
|--------|-----------|--------|
| Keyword with $200+ spend, 0 conversions | >2x target CPA in spend | Pause or restructure |
| Search term with CPA >3x target | Consistent over 30 days | Add as negative |
| Campaign with ROAS <0.5x, no strategic reason | 30+ days of data | Reduce budget or pause |

### EFFICIENCY IMPROVEMENTS (Optimization)

Make what's working work better.

**Signals and Thresholds:**

| Signal | Threshold | Experiment |
|--------|-----------|-----------|
| Mobile CVR <50% of desktop CVR | 20+ conversions per device | Mobile bid adjustment or LP test |
| Geographic CPA variance >50% | 10+ conversions per geo | Geo bid adjustments |
| Match type CPA spread >30% | 10+ conversions per type | Match type rebalancing |
| Day-of-week CPA variance >40% | 4+ weeks of data | Ad schedule test |

### EXPANSION OPPORTUNITIES (Growth)

Find new opportunities to capture demand.

**Signals:**
- Converting search terms not in keyword list
- Underutilized match types
- Related products/services not advertised

### CREATIVE TESTING (Iterative)

Test new ad copy, landing pages, offers.

**Signals and Thresholds:**

| Signal | Threshold | Experiment |
|--------|-----------|-----------|
| Ads running 90+ days without new variants | Creative fatigue likely | New ad copy test |
| CTR declining >15% over 60 days | Fatigue confirmed | New headlines and descriptions |
| Only 1-2 active RSA per ad group | Insufficient testing | Add RSA variants |

---

## Sample Size Requirements

### Minimum Data for Experiment Recommendations

| Recommendation Type | Minimum Data | Why |
|--------------------|-------------|-----|
| Pause keyword/campaign | 50+ clicks, 0 conversions, 30+ days | Avoid false negatives |
| Scale campaign (budget increase) | 30+ conversions, 14+ days stable | Validates consistency |
| Device bid adjustment | 20+ conversions per device segment | Need per-segment signal |
| Match type change | 20+ conversions on current type | Need baseline |
| New keyword addition | N/A (search term must show conversions) | Data supports itself |
| Add negative keyword | 1+ click if obvious waste | Pattern-based is OK |
| Creative test | 100+ impressions per ad | Need exposure signal |

### When Data Is Missing

**No impression share data:**
- Skip budget scaling experiments
- Focus on efficiency experiments (device, match type, geo)
- Note gap in data quality notes

**No keyword-level data:**
- Campaign-level experiments only
- Skip match type optimization and keyword expansion

**No search terms data:**
- Cannot identify query gaps or waste
- Flag as critical missing data

**No device/geo breakdowns:**
- Campaign-level only
- Cannot identify segmentation opportunities

**Fewer than 10 conversions total:**
- Flag entire analysis as "insufficient conversion volume"
- Only suggest high-confidence experiments (budget cuts on obvious waste)
- Focus on traffic quality signals rather than conversion optimization

**Zero conversions (no tracking or brand new account):**
- Flag: "No conversions tracked, cannot calculate CPA/ROAS-based experiments"
- Switch to traffic quality signals: CTR trends, bounce rate (if available), impression share
- Focus experiments on: keyword expansion, ad copy testing (CTR as proxy), negative keyword cleanup
- Recommend: Set up conversion tracking as #1 priority

---

## Worked Examples

### Example 1: Clear Opportunity, Budget Scaling

**Input data:** Campaign "Brand - Exact Match" over 30 days:
- Spend: $1,250 | Conversions: 45 | CPA: $27.78 | ROAS: 7.6X
- Search IS: 35% | Lost IS (budget): 65% | Lost IS (rank): 0%
- Target CPA: $50, Target ROAS: 4.0X

**Experiment:** Increase Brand campaign budget by 50%

**Why test this:** Your branded campaign is performing at 7.6X ROAS but only capturing 35% of possible traffic. You're leaving money on the table.

**Expected impact:** Should deliver ~25-30 additional conversions per month (~$700 extra revenue). Low risk since branded search is highest-intent traffic.

**How to run it:**
1. Go to Campaigns > Select "Brand - Exact Match"
2. Click Settings > Budget
3. Increase daily budget from $42 to $63 (50% increase)
4. Monitor for 14 days
5. Check if impression share increases and ROAS holds

**Risk:** Low | **Confidence:** 0.95

### Example 2: Ambiguous Signal, Device Performance Gap

**Input data:** Campaign "Non-Brand - Plumbing Services" device breakdown:
- Desktop: 18 conversions at $54 CPA (CVR 4.3%)
- Mobile: 4 conversions at $205 CPA (CVR 0.7%)
- Mobile gets 56% of clicks but only 18% of conversions
- Target CPA: $75

**Experiment:** Reduce mobile bids by 30% OR test mobile landing page

**Why test this:** Mobile users are converting 6X worse than desktop, driving CPA above target. Something is broken in the mobile experience.

**Expected impact:**
- Option 1 (reduce bids): Save ~$250/month in wasted mobile spend
- Option 2 (fix mobile): Could add 10-15 conversions/month if mobile CVR improves to half of desktop

**Risk:** Medium | **Confidence:** 0.65 (limited mobile conversion volume)

### Example 3: Alignment Break, Strong CTR, Weak CVR

**Input data:** Campaign "Free Trial - Broad Match" over 30 days:
- CTR: 6% (above average) | CVR: 0.3% (terrible) | CPA: $400 vs $100 target
- Search term "free crm software": 450 clicks, 0 conversions
- Search term "best crm for sales teams": 380 clicks, 4 conversions

**Experiment:** Add "free" as negative keyword + check landing page message match

**Why test this:** Your ads get great clicks but almost no conversions. The data shows you're attracting people looking for "free CRM" who won't convert on a paid trial offer.

**Expected impact:** Cut wasted spend by $500-800/month by blocking "free" searchers. CVR should improve dramatically.

**Risk:** Low | **Confidence:** 0.85

---

## Output Format

For each experiment:

### Experiment Title
5-10 words, plain English, action-oriented

### Why Test This
1-2 conversational sentences explaining the opportunity

### What The Data Shows
Specific metrics that triggered this (actual numbers from input)

### Expected Impact
What should improve, rough magnitude in dollars or percentages

### How To Run It
3-5 clear numbered steps in Google Ads UI

### Risk Level
Low / Medium / High

### Confidence
0.5-1.0 based on data quality

---

### Summary Section

At the end, provide:
- **Quick Wins:** Experiments to do immediately (low risk, high confidence)
- **Data Quality Notes:** Any gaps that limited analysis
- **Estimated Total Value:** Rough dollar impact if high-priority tests succeed

---

## Guardrails

**NEVER** suggest generic best practices without account-specific data
**NEVER** recommend complex dev work (new tracking, page rebuilds)
**NEVER** propose experiments without clear success metrics
**NEVER** suggest A/B tests for segments with <10 conversions/month
**NEVER** use jargon without explanation

**ALWAYS** cite specific metrics from the input data
**ALWAYS** provide Google Ads UI navigation steps
**ALWAYS** quantify expected impact (dollars or percentages)
**ALWAYS** state confidence score based on data quality
**ALWAYS** prioritize quick wins first

---

## Handling Conflicting Signals

**Strong CTR, Weak CVR:**
- Primary hypothesis: Alignment break (ad does not equal landing page)
- Recommend: Landing page test or ad copy adjustment
- Check search terms: Are queries relevant?

**Weak CTR, Strong CVR:**
- This is actually GOOD - ads are filtering for intent
- Don't recommend "improve CTR" - you'll hurt CVR
- Recommend: Consider scaling with budget if profitable

**High ROAS but Low Volume:**
- Check impression share: If lost to budget, recommend scaling
- If not, may be niche opportunity - keep but don't prioritize

**Low CPA but Low ROAS:**
- Context matters: Is this lead gen? If yes, CPA is what matters
- If eCommerce, investigate: Low AOV products? Conversion tracking issue?

---

## Anti-Patterns to Avoid

**Generic advice not grounded in data:**
- "Test responsive search ads" (unless current ads are underperforming)
- "Implement enhanced conversion tracking" (dev work, out of scope)
- "Improve campaign structure" (too vague)

**Tests that can't reach significance:**
- Recommending A/B test when campaign gets 2 conversions/month
- Suggesting split tests in ad groups with minimal traffic

**Jargon-heavy explanations:**
- Using acronyms without explanation
- Assuming advanced PPC knowledge

---

## Quality Assurance

Before delivering experiments:

- [ ] Every experiment cites specific metrics from input data
- [ ] Titles are 5-10 words, plain English
- [ ] "How to run it" has specific Google Ads navigation
- [ ] Priority aligns with impact + ease
- [ ] Confidence scores reflect data quality and sample sizes
- [ ] Sample size minimums checked before recommending
- [ ] Expected impact quantified in dollars or percentages
- [ ] Quick wins section identifies 2-3 immediate actions
- [ ] Conflicting signals handled explicitly (not ignored)
- [ ] Data gaps noted in quality section
