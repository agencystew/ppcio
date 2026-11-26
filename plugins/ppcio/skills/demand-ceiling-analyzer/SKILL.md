---
name: demand-ceiling-analyzer
description: Diagnoses whether a Google Ads account is hitting the natural limit of what search advertising can deliver. Triggers when user asks "is this account at its ceiling?", "can we scale further?", "is more budget going to help?", "why isn't spend increasing?", "are we maxed out?", or "should we invest in other channels?" Analyses impression share, marginal cost of additional customers, and market context to classify the account as having room to grow, approaching diminishing returns, or at the structural limit of demand capture.
---

# Demand Ceiling Analyzer

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 30 days, add the columns Budget, Cost, Search impr. share, Search lost IS (budget) and Search lost IS (rank) (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Diagnose whether a Google Ads account has room to grow on search, or whether it has captured most of what the market offers. Answers the question: "If we spend more, will we actually get more?"

---

## Operating principles

### Demand Capture vs Demand Creation
- Google Ads finds people who are already looking, it does not make new people start looking
- Every account has a natural limit determined by how many people search for what the business sells
- That limit is not a failure of management, it is a feature of the channel
- Growth beyond the ceiling requires creating new demand (brand awareness, content, other channels) or expanding the business (new products, new markets)

### Market Context Over Fixed Thresholds
- No universal impression share cutoffs, a local plumber at 60% IS is closer to their ceiling than a national SaaS at 80%
- Geographic scope, industry search volume, seasonality, and product breadth all shift what "near ceiling" means
- Brand and non-brand are separate markets with separate ceilings, always analyse them independently

### Marginal Returns Analysis
- The easiest customers get captured first, each additional dollar pursues less efficient traffic
- The key question is never "did average CPA go up?" but "are the additional customers worth what they cost?"
- Spending twice as much typically yields 1.5-1.8x the customers, not double

## Required Context

### Must Have

**1. Impression Share Data**
For each major campaign or campaign theme:
- Search impression share (%)
- Search lost IS, budget (%)
- Search lost IS, rank (%)
- Impressions, clicks, conversions, cost (last 30 or 90 days)

**2. Business Context**
- What the business sells
- Geographic scope: local (city/region), national, or international
- Industry / vertical
- Average order value or customer lifetime value
- Target CPA or target ROAS

### Strongly Recommended

**3. Monthly Trend Data (6-12 months)**
- Monthly impressions, clicks, conversions, cost, impression share
- This enables plateau detection and marginal returns analysis
- Without trends, ceiling classification has reduced confidence

**4. Brand vs Non-Brand Split**
- Brand and non-brand performance separated
- Brand impression share vs non-brand impression share
- These are different markets, analysing them blended produces misleading conclusions

### Nice to Have

- Recent budget increase data (before/after spend and conversions) for marginal CPA calculation
- Competitor auction insights (impression share, overlap rate)
- Seasonal patterns or year-over-year data
- Product/service catalogue breadth

---

## Three-Dimension Diagnostic

### Dimension 1: Market Capture Assessment

How much of the available search market is the account capturing?

**What to calculate:**

```
Total market impressions = Current impressions / Current impression share
Uncaptured impressions = Total market impressions - Current impressions
Estimated uncaptured conversions = (IS lost to budget / Current IS) × Current conversions
```

**What to contextualise:**

Before interpreting the numbers, consider the business:
- A local dentist at 65% IS in one city may have only 300 remaining monthly searches, near ceiling
- A national SaaS at 65% IS may have 40,000 remaining monthly searches, significant room
- Seasonal businesses may show "near ceiling" in off-season but have headroom in peak months
- Single-product businesses have narrower ceilings than multi-category retailers

**What to check:**
- Is IS being lost to budget (fixable) or to rank (competitive problem) or neither (market is small)?
- Is IS trending up (growing), stable (plateau), or declining (competitive pressure)?
- Are there untapped keyword themes that would expand the addressable market?

### Dimension 2: Marginal Returns Analysis

What does each additional dollar of spend actually buy?

**If budget increase data is available:**

```
Marginal cost per customer = (New spend - Old spend) / (New conversions - Old conversions)
```

Compare to average cost per customer:
- Marginal ≈ average → efficient scaling territory
- Marginal 1.5-2× average → each new customer getting progressively expensive
- Marginal >2× average → deep diminishing returns, approaching ceiling

**If no scaling data available, model it:**

Use the non-linear scaling rule: 2× spend ≈ 1.5-1.8× conversions.

```
At +25% spend: New CPA ≈ Current CPA × 1.10-1.15
At +50% spend: New CPA ≈ Current CPA × 1.20-1.35
At +100% spend: New CPA ≈ Current CPA × 1.40-1.65
```

These are estimates, always flag the confidence level.

**Key question to answer:** "If you increased the budget by $X, you'd likely get Y additional customers at roughly $Z each, compared to your current average of $A. Is that trade-off worth it for your margins?"

### Dimension 3: Ceiling Classification

Bring it together. For each campaign theme and the account overall:

**Room to grow**, Capturing a small share of a sizable market. Budget or bids are the constraint, not demand. More spend should produce more customers at reasonable cost.

**Scaling gets expensive**, The efficient traffic is captured. More spend brings more conversions, but each one costs more. Worth doing if the economics work, model the trade-off explicitly.

**Near the ceiling**, Most available search demand is captured. Significantly more spend would produce little additional volume at much higher cost per customer.

**Demand is the constraint**, The account has captured what the search market offers. Growth requires getting more people to start searching (brand awareness, content, social) or expanding what the business offers (new products, new locations, new audiences).

---

## Output Format

### Demand Ceiling Diagnosis, [Account Name], [Date]

**Verdict:** [One sentence, classification and why]

---

#### Market Capture Summary

| Campaign Theme | Impression Share | IS Lost (Budget) | IS Lost (Rank) | Est. Market Size | Classification |
|----------------|:---:|:---:|:---:|---|---|
| Brand | X% | X% | X% | [context] | [classification] |
| Non-Brand: [theme] | X% | X% | X% | [context] | [classification] |

---

#### Marginal Returns Assessment

**Method used:** [Historical scaling data / Modelled projection]

[For each major theme:]
- Current cost per customer: $X
- Estimated cost of additional customers: $Y (roughly Z% more)
- What +25% / +50% budget increase would produce: [projections]

---

#### Ceiling Classification

**Overall account:** [Classification with plain-language explanation]

[For each campaign theme at or near ceiling:]
- What it means in practical terms
- How confident the classification is (and what data would increase confidence)

---

#### What This Means for Planning

[2-3 sentences framing the diagnosis in business terms. Not prescriptive, contextual.]

Example: "This account is capturing about 75% of the available non-brand search market. There's room to grow, but each additional customer will cost roughly 30% more than your current average. Whether that's worth it depends on your margins and growth targets, not on the advertising."

---

## Guardrails (Hard Rules)

**NEVER:**
- Use fixed impression share thresholds as universal rules (60% IS means different things for different businesses)
- Conflate brand and non-brand impression share, they are separate markets
- Claim "at ceiling" without checking whether IS is lost to budget (fixable) vs lost to rank (competitive) vs structurally unavailable
- Recommend specific channels, tactics, or budget changes, diagnose, don't prescribe
- Frame ceiling proximity as criticism, an account capturing its market efficiently is a success
- Present marginal CPA projections without stating confidence level and method used
- Fabricate ceiling estimates when impression share data is missing

**ALWAYS:**
- Establish business context (geo scope, industry, product breadth) before classifying
- Separate brand and non-brand analysis
- Quantify in dollars and plain language, "$Y per additional customer" not "marginal CPA elasticity"
- Check seasonal patterns before declaring a structural ceiling
- State what data is missing and how it affects confidence
- Frame the output as context for business decisions, not as a directive

---

## Edge Cases

### Low-Volume Account (<20 conversions/month)
- Marginal CPA calculation is unreliable, use directional estimates with explicit caveats
- IS data may be suppressed by Google (too few impressions to report)
- Focus on market context and qualitative assessment rather than precise calculations
- "There isn't enough data for a precise ceiling analysis, but here's what the market context suggests..."

### Very High IS Already (>85%)
- Check whether remaining IS is lost to budget or rank
- If lost to budget: there IS room, but it's expensive, calculate marginal cost
- If lost to rank: competitive ceiling, not demand ceiling, different diagnosis
- If neither: structural ceiling, the searches simply don't exist

### PMax-Heavy Account
- PMax does not report standard search impression share
- Ceiling analysis is limited to Search campaigns only
- Note: "PMax spend cannot be ceiling-analysed with this framework, IS data unavailable"

### Seasonal Business
- Always compare to same period last year if data available
- "At ceiling in January" may be meaningless if July volume is 3× higher
- Classify separately for peak and off-peak periods

### Multiple Geographies
- Analyse ceilings per geography, a business "at ceiling" in London may have room to grow in Manchester
- National IS averages can hide geographic variation

---

## Limitations

**What I Cannot Do Without API Access:**

1. **Automated ceiling tracking**, You must run this manually
2. **Portfolio-wide analysis**, One account at a time
3. **Historical marginal CPA tracking**, You provide before/after data
4. **Proactive ceiling alerts**, No automated "you're approaching the ceiling" notifications
5. **Cross-account patterns**, No visibility into which accounts are ceiling-bound
6. **Channel expansion handoff**, Diagnosis only, no routing to expansion planning
7. **Seasonal benchmarking**, Only if you provide year-over-year data

---

## Quality Assurance

Before delivering the ceiling diagnosis:
- [ ] Business context established (geo scope, industry, product breadth)
- [ ] Brand and non-brand analysed separately
- [ ] Market size contextualised (not just IS percentage)
- [ ] IS lost to budget vs rank vs structural distinguished
- [ ] Marginal CPA calculated or modelled with method stated
- [ ] Classification supported by both IS data and marginal returns data
- [ ] Seasonal patterns considered
- [ ] Confidence level stated for each classification
- [ ] Output uses plain language, no jargon a business owner wouldn't understand
- [ ] No specific channel or tactic recommendations (diagnosis only)
- [ ] Ceiling framed as context, not criticism
