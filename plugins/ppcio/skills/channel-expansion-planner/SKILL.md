---
name: channel-expansion-planner
description: Evidence-based channel expansion analysis for profitable Google Ads accounts. Triggers when user asks "where should I expand next?", wants to evaluate Meta/Microsoft/LinkedIn/TikTok, is hitting impression share ceilings on Google, or wants a multi-channel growth plan. Evaluates 6 signals (competitive validation, audience alignment, performance prediction, creative readiness, budget viability, business model fit) to rank channels with predicted CPA ranges, pilot budgets, and launch timelines. Works with Google Ads performance data and business context.
---

# Channel Expansion Planner

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 90 days, add the columns Cost, Clicks, Conversions, Conv. value and Search impr. share (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

You're profitable on Google. Where do you grow next? This skill evaluates Meta Ads, Microsoft Ads, LinkedIn Ads, and TikTok Ads using evidence from YOUR account and YOUR competitors,not generic playbooks.

---

## Operating principles

### Core Reasoning Philosophy
- **Context Over Rules**: No rigid disqualifiers ("B2B = no TikTok" is wrong). Every channel CAN work in the right context.
- **Evidence-Based Decisions**: Competitive validation is the primary signal,competitors spending sustained budget = proven channel.
- **Profitability Hierarchy**: CPA economics must work at predicted channel dynamics, not just "try and see."

### Six-Signal Evaluation
- Competitive Validation (primary signal)
- Audience Alignment (device, age, time patterns)
- Performance Prediction (CPA range from Google baseline)
- Creative Readiness (asset requirements by channel)
- Budget Viability (minimum test budgets)
- Business Model Fit (patterns, not rigid rules)

### Honest Assessment
- Disqualify with evidence, not blanket rules
- Predict what could go wrong, not just what could go right
- "Not Yet Ready" gets specific unlock gates, not vague "maybe later"

## Required Context

### Must Have

**1. Google Ads Performance Data (90 Days Minimum)**
Upload or paste account-level performance:
- Monthly spend
- Total conversions
- CPA (or ROAS for ecommerce)
- Conversion rate
- Impressions and impression share (if available)

**2. Business Context**
- What you sell and to whom
- Business type: ecommerce, lead-gen, SaaS, local services
- Target geography
- Average order value or customer lifetime value (if known)

**3. Current Monthly Budget**
- Total monthly Google Ads spend
- Is there additional budget available for expansion, or must it come from Google?

### Strongly Recommended

**4. Google Ads Demographics (from Reports)**
- Device split: mobile/desktop/tablet %
- Age distribution of converters (18-24, 25-34, 35-44, 45-54, 55-64, 65+)
- Gender split of converters
- Time-of-day conversion patterns (work hours vs evening vs weekend)

**5. Competitor Information**
For 3-5 direct competitors:
- Are they running Meta/Facebook ads? (Check Meta Ad Library: facebook.com/ads/library)
- Are they on LinkedIn Ads? (Check LinkedIn Ad Library)
- Are they on TikTok? (Check TikTok Ad Library)
- How many ads are they running? How long have they been active?
- What creative formats are they using? (Image, video, carousel, UGC)

**6. Creative Asset Inventory**
- How many product/service images do you have? (Professional quality)
- Do you have any videos? How many? What length?
- Do you have user-generated content or testimonials on video?
- What's on your landing pages? (Strong visuals or text-heavy?)

### Nice to Have

- Impression share data (are you hitting ceiling on Google?)
- Conversion tracking setup (pixel, CAPI, offline)
- Industry vertical (for benchmark lookups)
- Seasonal patterns (peak and off-peak months)

---

## The Six Signals Framework

### Signal 1: Competitive Validation (PRIMARY SIGNAL)

**Why primary:** Competitors spending sustained budget on a channel is the strongest evidence that the channel works. More reliable than demographic theory or industry assumptions.

**How to evaluate:**

| Competitor Presence | Duration | Interpretation |
|---|---|---|
| 4-5 out of 5 competitors active | 6+ months | Proven channel. Competitive necessity. You're late. |
| 2-3 out of 5 competitors active | 3+ months | Some validation. Not saturated. |
| 0-1 out of 5 competitors active | Any | First-mover risk OR channel doesn't work for this vertical |
| Competitors active but only 30 days | Recent | Testing. Results not proven yet. |

**What to look for in competitor ads:**
- Ad count (proxy for spend level): 50+ ads = serious investment
- Duration: 12+ months = channel is working for them
- Creative formats: Carousel, video, UGC = signals about what resonates
- Frequency of new ads: High turnover = active testing

**Example good analysis:**
"5/5 competitors on Meta. Brand A: 89 ads, active 24 months. Brand B: 34 ads, 11 months. Brand C: 47 ads, 6 months, aggressive volume. All using carousel + video. Meta is proven for this vertical."

**Example poor analysis:**
"Your competitors are probably on Meta." (No evidence.)

---

### Signal 2: Audience Alignment

**Map your Google Ads converters to channel demographics:**

| Data Point | Meta Strength | Microsoft Strength | LinkedIn Strength | TikTok Strength |
|-----------|--------------|-------------------|------------------|----------------|
| Mobile conversion % | >60% = strong fit | <40% = strong fit | 40-60% = neutral | >70% = strong fit |
| Age 18-34 | Strong | Weak | Moderate | Very strong |
| Age 35-54 | Strong | Strong | Strong | Moderate |
| Age 55+ | Moderate | Very strong | Moderate | Weak |
| Work hours peak | Moderate | Very strong | Very strong | Weak |
| Evening/weekend peak | Very strong | Weak | Weak | Very strong |
| Desktop heavy | Weak fit | Strong fit | Strong fit | No fit (mobile only) |

**Decision logic:** Look for ALIGNMENT patterns, not single datapoints. A 55% mobile, age 35-44, evening-converting audience aligns with Meta much more than with Microsoft.

---

### Signal 3: Performance Prediction

**Start with Google CPA as your anchor. Apply channel-specific dynamics:**

| Channel | CPA Multiplier vs Google | Notes |
|---------|------------------------|-------|
| Meta Ads | 1.2-1.6x (ecom), 1.5-2.0x (lead-gen) | Interrupt-based = higher cost but broader reach |
| Microsoft Ads | 0.9-1.1x | Import advantage, lower competition, older audience |
| LinkedIn Ads | 3.0-5.0x | B2B premium. Lead quality often justifies premium. |
| TikTok Ads | 1.3-1.8x (ecom), 2.0-3.0x (lead-gen) | Only viable for specific verticals. Low quality leads common. |

**For each channel, calculate:**

```
Google Baseline CPA: $X
Predicted CPA Range: $Y - $Z
Monthly Test Budget: $A
Predicted Conversions at Test Budget: B-C/month
Profitability Check: Does margin support this CPA? Yes/No
```

**Risk factors to state:**
- "If mobile traffic is low-quality (high bounce, low time-on-site), expect CPA inflation"
- "If creative fatigue hits early due to small audience, CPA will rise after month 2"
- "If conversion tracking isn't pixel + CAPI, attribution will undercount"

---

### Signal 4: Creative Readiness

**Minimum requirements by channel:**

| Channel | Images Needed | Videos Needed | Special Requirements | Timeline Impact |
|---------|--------------|--------------|---------------------|----------------|
| Meta Ads | 8-10 | 3+ recommended | Carousel + single image + video variations | 0 weeks if ready, 2-4 weeks if not |
| Microsoft Ads | 0 (import) | 0 | None: imports Google text ads directly | 1-2 days to import |
| LinkedIn Ads | 5+ | Nice to have | Professional quality, not casual | 1-2 weeks |
| TikTok Ads | Nice to have | 5-8 REQUIRED | UGC-style, vertical, phone-shot OK | 4-6 weeks if starting from 0 |

**Readiness assessment:**

| Status | Definition | Impact |
|--------|-----------|--------|
| Ready | Meets or exceeds minimum requirements | Launch within 1-2 weeks |
| Partial | Has some assets, needs supplementation | Launch in 2-4 weeks |
| Not Ready | Missing critical assets (e.g., 0 videos for TikTok) | 4-6 weeks to create |
| Blocked | Cannot create required assets without external help | Flag as prerequisite |

---

### Signal 5: Budget Viability

**Minimum test budgets (guidelines, not rigid gates):**

| Channel | Minimum Test Budget | Why | Learning Period |
|---------|-------------------|-----|----------------|
| Meta Ads | USD 2,000/month | Need ~50 conversions for algorithm learning | 4-6 weeks |
| Microsoft Ads | USD 500/month | Can start small, lower competition | 2-4 weeks |
| LinkedIn Ads | USD 3,000/month | Higher CPCs, need volume for optimization | 6-8 weeks |
| TikTok Ads | USD 3,000/month | Algorithm is extremely data-hungry | 4-6 weeks |

**Viability check:**

| Available Budget | Assessment | Recommendation |
|-----------------|-----------|----------------|
| Current Google spend >= 2x channel minimum | Viable | Can allocate without cannibalizing Google |
| Current spend = 1-2x channel minimum | Stretch | Risky: must reduce Google or have new budget |
| Current spend < 1x channel minimum | Too early | "Scale Google to $X/month first, then revisit" |

**Critical question:** Is the expansion budget NEW money or carved from Google? If carved from Google, quantify the cannibalization risk: "Reducing Google by USD 2K/month could cost [X] conversions at your current CPA."

---

### Signal 6: Business Model Fit

**Traditional patterns (acknowledge but don't rigidly apply):**

| Business Type | Natural Fit | Secondary | Exception Examples |
|--------------|-------------|-----------|-------------------|
| Ecommerce (visual products) | Meta, TikTok | Microsoft | Low-price impulse = TikTok. Premium = Meta only. |
| Ecommerce (non-visual) | Microsoft, Meta | - | Office supplies, industrial parts = Microsoft strong |
| B2B SaaS | LinkedIn, Microsoft | Meta (retargeting) | Young founder audience = TikTok viable |
| B2B Professional Services | LinkedIn | Microsoft | Accounting firms = Microsoft matches audience age |
| Local Services | Microsoft | Meta (geo-targeted) | Visual results (before/after) = Meta strong |
| Lead-Gen (B2C) | Meta | Microsoft, TikTok | High-ticket = LinkedIn possible |
| DTC / Subscription | Meta, TikTok | - | Commodity = price-driven = Microsoft |

**Critical principle:** These are STARTING POINTS, not rules. Always override with evidence from Signals 1-5.

---

## Ranking & Recommendation Process

### Step 1: Identify Hard Constraints (Rare)

Only THREE things truly block a channel:
- Budget: <USD 2K/month total across all channels = most channels blocked except Microsoft
- TikTok without ANY video capability = hard block (video is non-negotiable)
- Restricted industry without platform policy compliance = legal block

Everything else is a soft signal that contributes to the picture.

### Step 2: Assess Each Channel Against All 6 Signals

For each of Meta, Microsoft, LinkedIn, and TikTok, assess all 6 signals. No single weak signal disqualifies,look for COMBINATIONS of weakness.

**Disqualification requires stacked weak signals:**
- 0/5 competitors + audience mismatch + CPA economics don't work = "Don't Pursue"
- One weak signal alone is NEVER enough to disqualify

### Step 3: Flag "Not Yet Ready" Channels (Specific Gates)

If a channel has potential but specific blockers:
- List exact unlock conditions with numbers
- Provide timeline for when gates might be met
- Example: "TikTok: Strong audience fit BUT need 50+ conv/mo (currently 23), 5-8 videos (currently 0), USD 3K/mo budget (currently USD 5K total). Revisit Q3 2026."

### Step 4: Rank Viable Channels

**Ranking hierarchy:**
1. **Primary:** Competitive validation (4-5/5 competitors = strongest signal)
2. **Secondary:** Audience match (highest overlap with Google converters)
3. **Tertiary:** Budget efficiency (lowest predicted CPA)
4. **Tiebreaker:** Speed to launch (Microsoft beats Meta if all else equal due to direct import)

---

## Pilot Structure

### Recommended Pilot Framework

For the #1 recommended channel:

| Element | Specification |
|---------|--------------|
| Duration | 6-8 weeks minimum (4 weeks learning + 2-4 weeks optimization) |
| Budget | Channel minimum test budget (see Signal 5) |
| Campaigns | 2-3 campaigns max (avoid fragmentation) |
| Targeting | Start broad, let algorithm optimize (especially Meta/TikTok) |
| Creative | Launch with minimum viable creative set, iterate based on data |
| Conversion tracking | Set up BEFORE launch. Pixel + CAPI for Meta. UET for Microsoft. |
| Success criteria | CPA within predicted range after learning period |
| Kill criteria | CPA >2x predicted range after 6 weeks with proper setup |
| Review cadence | Weekly check-ins, formal assessment at Week 4 and Week 6 |

### Success Criteria Decision Table

| Result After Pilot | Assessment | Next Step |
|-------------------|-----------|-----------|
| CPA within predicted range | Success | Scale budget 50% in week 7-8 |
| CPA 20-50% above predicted | Promising but needs work | Optimize creative/targeting, extend pilot 4 weeks |
| CPA 50-100% above predicted | Underperforming | Deep diagnosis: creative? tracking? targeting? |
| CPA >2x predicted after 6 weeks | Channel not viable (for now) | Pause, reallocate to Google or secondary channel |
| Profitable but low volume | Channel works but limited scale | Maintain at current budget, don't force scale |

---

## Output Format

### Channel Expansion Analysis - [Business Name] - [Date]

```
GOOGLE ADS BASELINE: $X/mo spend, $Y CPA, Z conversions/mo
PRIMARY RECOMMENDATION: [Channel Name]
CONFIDENCE: HIGH / MODERATE / LOW
```

---

#### Executive Summary

**Primary Recommendation:** [Channel]: [1-2 sentence evidence-based reason]

**Expected CPA Range:** $X-Y (vs $Z Google baseline)
**Timeline to Launch:** X weeks
**Recommended Test Budget:** $X/month for [duration]
**Predicted Test Conversions:** X-Y/month

---

#### Channel Rankings

| Channel | Verdict | Expected CPA | Timeline | Test Budget | Volume Lift | Key Factor |
|---------|---------|-------------|----------|-------------|-------------|------------|
| [#1 Channel] | Recommended | $X-Y | X weeks | $X/mo | +X% | [Primary evidence] |
| [#2 Channel] | Secondary | $X-Y | X weeks | $X/mo | +X% | [Primary evidence] |
| [#3 Channel] | Not Yet Ready | $X-Y | X weeks | $X/mo |: | [Blocker + gate] |
| [#4 Channel] | Don't Pursue | $X-Y |: |: |: | [Evidence for rejection] |

---

#### Detailed Analysis: [#1 Recommended Channel]

**Verdict: RECOMMENDED**

**Competitive Validation:**
[X/5 competitors present. Specific examples with ad counts, durations, creative formats.]

**Audience Alignment:**
[Evidence from Google data: device %, age distribution, time patterns. How this maps to channel.]

**Performance Prediction:**
- Google baseline CPA: $X
- Predicted range: $X-Y
- Rationale: [Why this range for THIS business]
- Profitability check: [Margin supports / doesn't support]

**Creative Readiness:**
[Current assets vs requirements. Timeline impact. Gaps to close.]

**Budget Viability:**
[Budget assessment. Cannibalization risk if reallocating from Google.]

**What Could Make This Wrong:**
1. [Risk factor 1]
2. [Risk factor 2]
3. [Risk factor 3]

---

*Repeat detailed analysis for each channel.*

---

#### Pilot Plan

**Channel:** [Recommended channel]
**Budget:** $X/month
**Duration:** X weeks
**Campaign Structure:** [2-3 campaigns targeting X]
**Creative Plan:** [What to launch with, what to test]
**Tracking Setup:** [Pixel, CAPI, offline events]
**Success Criteria:** CPA < $X after learning period
**Kill Criteria:** CPA > $X after 6 weeks
**Review Schedule:** Week 2, Week 4, Week 6

---

#### Budget Allocation Recommendation

| Channel | Monthly Budget | % of Total | Source |
|---------|---------------|-----------|--------|
| Google Ads (current) | $X | X% | Existing |
| [New Channel] (pilot) | $X | X% | New budget / reallocated |
| **Total** | **$X** | **100%** | |

---

## Guardrails (Hard Rules)

**NEVER:**
- Use rigid disqualifiers ("B2B = no TikTok", "B2C = no LinkedIn")
- Recommend a channel without predicting a CPA range from Google baseline
- Recommend without checking competitive validation FIRST
- Give vague "Not Yet Ready" verdicts without specific numeric unlock gates
- Force a secondary recommendation if only one channel is genuinely viable
- Say "this channel has a large audience" as evidence (that's not account-specific)
- Recommend launching during known dead seasons (wasted learning budget)
- Recommend expansion when Google itself is not yet profitable
- Recommend expanding when total budget is <USD 2K/month (scale Google first)

**ALWAYS:**
- Analyze competitor channel presence FIRST before recommending
- Predict CPA range (not a single number) with rationale
- Include "What Could Make This Wrong" for every recommended channel
- Provide specific gates for "Not Yet Ready" verdicts (numbers, dates, conditions)
- Check if margin supports the predicted CPA (not just "CPA is reasonable")
- Include creative readiness assessment with timeline impact
- State confidence level (High/Moderate/Low) with reasoning
- Include a pilot plan with success and kill criteria
- Flag restricted industries that may face platform policy issues
- Quantify cannibalization risk if budget comes from Google

---

## Edge Cases & Nuances

### Insufficient Google Data (<30 Days, <10 Conversions)
- Flag low confidence prominently at top of report
- Lean more heavily on competitor intelligence and industry patterns
- Recommendation: "Scale Google first" OR "Microsoft as low-risk, low-budget test"
- Note: "CPA prediction based on limited data. Confidence is LOW."

### All Channels Score Poorly
- Be honest: "No strong expansion channel identified based on current evidence."
- Recommend: Scale Google deeper, improve conversion rate, build creative assets
- Provide a roadmap: "Revisit in 3 months when [specific conditions are met]"
- Don't force a recommendation just to have output

### Budget Too Constrained (<USD 2K/month Total)
- "Too early to expand. Scale Google to USD 4-5K/month first."
- Provide budget gates: "USD 5K/mo = Microsoft viable. USD 8K/mo = Meta viable. USD 12K/mo = multiple channels."
- Explain WHY: Underfunded pilots fail because the algorithm can't learn.

### Competitor Data Unavailable
- Flag gap: "Limited competitive intelligence,recommendations rely on audience signals and industry patterns"
- Fall back to Signals 2-6 (audience, performance, creative, budget, business model)
- Recommend manual competitor research before committing budget

### Restricted Industries (CBD, Crypto, Gambling, Pharma)
- Check platform-specific policies BEFORE recommending
- Meta and TikTok have strict policies; LinkedIn bans some categories outright
- Flag prominently: "Your industry has advertising restrictions on [channel]. Verify policy compliance before budget commitment."

### Conflicting Signals
- Surface the conflict explicitly,don't hide it
- Provide two paths: "Fix creative first, launch Meta in 4 weeks" OR "Launch Microsoft now, build Meta assets in parallel"
- Let the reader choose based on their priorities

### Client Preference Override
- Don't fight the preference,support their choice with risk-adjusted guidance
- Present your analysis, then help them succeed with their chosen channel
- "You prefer TikTok. Here's what to expect and how to maximize your odds."

### Seasonal Business
- Time-aware recommendations: "Launch Q3 to complete learning BEFORE Q4 peak"
- Never recommend launching during dead months (wasted learning budget)
- Budget seasonal ramp: "Start at USD 2K/mo in September, scale to USD 5K in November"

### Hitting Google Impression Share Ceiling
- This is the strongest signal to expand: you've maxed out Google
- Note: "Google impression share at 85%+,limited room to scale. Expansion is not optional; it's necessary for growth."
- Prioritize channels with the broadest incremental reach (typically Meta)

### No Clear Winner (Tie Between Channels)
- Present as an honest tie with tiebreaker guidance
- "Meta and Microsoft are equally viable. Choose Meta if you want maximum scale ceiling and have visual assets. Choose Microsoft if you want speed, low risk, and easy import."
- Don't force an artificial ranking

---

## Data Quality Checks

**Before analyzing, verify:**

- Google Ads data covers at least 30 days (90+ preferred for reliable patterns)
- Conversion volume is sufficient for CPA calculation (minimum 10 conversions)
- Monthly budget is stated (needed for expansion feasibility)
- Business type is clear (affects channel mapping significantly)
- Competitor information, if provided, is recent (within last 30 days)

**If data quality issues found:**
- Flag at top of analysis
- Note which signals are affected
- "Device/age breakdown not provided,audience alignment assessment has lower confidence"

---

## Limitations

---

## Quality Assurance

Before delivering the channel expansion analysis:
- [ ] Google Ads baseline clearly stated (spend, CPA, conversions)
- [ ] Competitive validation analyzed FIRST for each channel
- [ ] CPA predicted as a RANGE (not single number) with rationale for each channel
- [ ] All 6 signals evaluated for each viable channel
- [ ] No rigid disqualifiers used (evidence-based reasoning only)
- [ ] "Not Yet Ready" verdicts have specific numeric gates
- [ ] "What Could Make This Wrong" included for recommended channels
- [ ] Pilot plan included with success AND kill criteria
- [ ] Budget viability checked (including cannibalization risk)
- [ ] Creative readiness assessed with timeline impact
- [ ] Margin/profitability check against predicted CPA
- [ ] Confidence level stated with reasoning
- [ ] Restricted industry policies flagged if applicable
- [ ] Summary table with all channels, verdicts, and key metrics
