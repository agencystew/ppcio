---
name: new-client-onboarding
description: Structured 90-day onboarding plan for new Google Ads client accounts. Triggers when user is taking over a new account, onboarding a client, starting PPC management, or asks "what should I do with this new account?" Guides through 4 phases, Stabilization, Optimization, Growth, Graduation, with phase-appropriate actions, data confidence requirements, and weekly milestone tracking. Works with any account data, paste current metrics and targets to get a phase assessment and action plan.
---

# New Client Onboarding

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 90 days, add the columns Budget, Bid strategy type, Cost, Conversions and Cost / conv. (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Structured 90-day plan that takes a new client account from uncertainty to confidence. The first 90 days need fundamentally different management than a mature account,this skill gives you the framework.

---

## Operating principles

### Core Reasoning Philosophy
- **Alignment Chain**: Search Term -> Keyword -> Ad -> Landing Page -> Offer
- **Profitability Hierarchy**: CPA/ROAS > CVR > CTR > Volume
- **Evidence-Based Decisions**: Confidence scales with data volume,act accordingly
- **Context Over Rules**: Phase-appropriate risk tolerance, not blanket best practices

### First 90 Days Playbook
- 4-phase lifecycle: Stabilization -> Optimization -> Growth -> Graduation
- Phase-appropriate risk tolerance (Conservative -> Balanced -> Aggressive)
- Data confidence requirements for each decision type
- Phase transition criteria with hard and fallback thresholds

### Accumulated Intelligence
- Each week builds on the previous week's learnings
- Track what worked, what didn't, and what the agency rejected
- Celebrate milestones to demonstrate progress

## Required Context

### Must Have

**1. Account Data (Current State)**
Upload or paste campaign-level data:
- Campaign name, spend, conversions, CPA or ROAS
- Impressions, clicks, CTR
- Time period covered (at least 7 days, ideally 30)

**2. Engagement Details**
- When did you take over this account? (Week 1, Week 4, etc.)
- Is this a brand new account or existing account with history?
- How many total conversions since you took over?

**3. Target Metrics (at least one)**
- Target CPA: $___
- Target ROAS: ___:1
- Monthly budget: $___

**4. Business Context**
- Business type: ecommerce, lead-gen, SaaS, local services
- What they sell and to whom
- Industry vertical

### Strongly Recommended

**5. Conversion Tracking Status**
- What conversion actions are set up?
- Are conversions recording consistently?
- Any known tracking gaps?

**6. Budget Data**
- Daily budget per campaign
- Budget utilization (are campaigns exhausting budgets?)

**7. Search Terms Data**
- Recent search terms (enables waste detection)
- Especially valuable in Stabilization phase

### Nice to Have

- Prior week's recommended actions and whether they were executed
- Brand terms list (for brand vs non-brand analysis)
- Impression share data
- Competitor landscape notes

---

## The 4-Phase Framework

### Phase Overview

| Phase | Timeline | Goal | Risk Tolerance | Focus |
|-------|----------|------|----------------|-------|
| Stabilization | Weeks 1-4 | Build data confidence | CONSERVATIVE | Tracking, waste, budget health |
| Optimization | Weeks 3-8 | Hit target metrics | BALANCED | Performance decisions, bid strategy |
| Growth | Weeks 6-12 | Scale what works | AGGRESSIVE | Budget scaling, new campaigns, expansion |
| Graduation | Week 8-12+ | Hand off to ongoing management | STANDARD | Stability confirmation, knowledge transfer |

### Phase Transition Criteria

```
STABILIZATION -> OPTIMIZATION:
  Primary gate:   30+ conversions accumulated
  Fallback gate:  4 weeks elapsed (transition regardless)
  Hard blocker:   Conversion tracking must be healthy
  Low-data rule:  If <5 conversions at 4-week fallback ->
                  Transition with DATA_INSUFFICIENT flag.
                  Skip CPA-based decisions. Focus on waste + tracking.

OPTIMIZATION -> GROWTH:
  Primary gate:   CPA within 20% of target AND smart bidding on 1+ campaign
  Fallback gate:  8 weeks elapsed
  Override:       CPA >50% above target at 8 weeks -> escalate to agency
  Zero-data rule: If <10 conversions at 8-week fallback -> AUTO-ESCALATE.
                  "Account has not generated enough data for AI optimization.
                   Manual strategic review required."

GROWTH -> GRADUATION:
  Primary gate:   4+ consecutive weeks meeting targets AND smart bidding stable
  Escalation:     If in Growth 8+ weeks without graduating -> escalate
                  Options: adjust targets, extend, or manual graduation
```

---

## Phase 1: Stabilization (Weeks 1-4)

### Goal
Build data confidence and eliminate obvious waste. Do NOT optimize,you don't have enough data yet.

### Risk Tolerance: CONSERVATIVE
- No bid strategy changes
- No campaign restructuring
- No aggressive keyword additions
- Only remove clearly wasteful elements

### Priority Actions (In Order)

**Priority 1: Conversion Tracking Verification**
- Confirm all conversion actions are firing correctly
- Check for duplicate counting, missing tags, or broken pixels
- Test the full conversion path (click -> landing page -> thank you page)
- Threshold: Must see consistent conversions recording before any optimization

**Decision table:**

| Signal | Assessment | Action |
|--------|------------|--------|
| Conversions recording consistently | Tracking healthy | Proceed to Priority 2 |
| Sporadic conversions (some days 0, some days normal) | Possible intermittent issue | Investigate before anything else |
| Zero conversions with 100+ clicks | Tracking likely broken | STOP all optimization. Fix tracking first. |
| Conversion count doesn't match CRM/backend | Attribution mismatch | Audit conversion setup |

**Priority 2: Search Term Waste Removal**
- Review ALL search terms from the past 7 days
- Identify and remove Alignment Waste (terms that can NEVER convert):
  - Employment intent (jobs, careers, salary)
  - DIY/educational (how to, tutorial, guide)
  - Wrong industry (completely unrelated verticals)
  - Navigation (login, account, portal)
- Identify and remove Audience Waste (wrong person):
  - Price signals mismatched to offer (free, cheap for premium service)
  - B2B vs B2C mismatch
- Do NOT make Performance Waste decisions yet (insufficient data)

**Waste assessment thresholds (Stabilization):**

| Waste Type | Confidence Required | Match Type |
|------------|-------------------|------------|
| Alignment waste (can never convert) | 0.85+ | Broad or Phrase negative |
| Audience waste (wrong person) | 0.75+ | Phrase negative |
| Performance waste (economics) | NOT YET: need 50+ clicks | Hold for Optimization |

**Priority 3: Budget Health**
- Is budget being utilized? (Target: 85-95% utilization)
- Any campaigns exhausting budget before 6pm? (Flag for review)
- Any campaigns significantly underspending? (Serving issue or targeting too narrow)
- Budget pacing: On track for monthly target?

**Priority 4: CPC Baseline**
- Document current average CPCs by campaign
- Flag any keywords with CPC >2x campaign average
- This becomes the baseline for future comparison
- No action yet,just measurement

### Weekly Stabilization Checklist

- [ ] Conversion tracking verified (all actions firing)
- [ ] Search terms reviewed and negatives added
- [ ] Budget utilization checked (85-95% target)
- [ ] CPC baseline documented
- [ ] Week's metrics recorded for future comparison
- [ ] Total conversions accumulated: ___  (need 30 for phase transition)

---

## Phase 2: Optimization (Weeks 3-8)

### Goal
Start making performance-based decisions. You now have enough data for targeted improvements.

### Risk Tolerance: BALANCED
- Performance-based keyword pauses allowed
- Bid strategy testing allowed (with safeguards)
- Ad copy testing allowed
- No major structural changes yet

### Priority Actions (In Order)

**Priority 1: Performance-Based Keyword Decisions**

| Keyword Status | Clicks (30d) | Conversions (30d) | Action |
|----------------|-------------|-------------------|--------|
| Star performer | 50+ | 5+ (above avg CVR) | Protect. Add exact match if matching via broad. |
| Solid performer | 30+ | 2+ (near avg CVR) | Maintain. Monitor for improvement. |
| Underperformer | 50+ | 0-1 | Investigate: landing page? Intent mismatch? Pause if no fix. |
| Data insufficient | <30 | Any | Continue collecting data. No decision yet. |
| Zero performer | 100+ | 0 | Pause immediately. Investigate root cause. |

**Priority 2: Bid Strategy Assessment**

| Condition | Recommendation | Risk Level |
|-----------|---------------|------------|
| 30+ conversions/month, manual bidding | Test tCPA or tROAS on one campaign | LOW |
| 50+ conversions/month, manual bidding | Strong candidate for smart bidding | LOW |
| <30 conversions/month | Stay on manual or maximize clicks | N/A |
| Smart bidding active, performing at target | Maintain, monitor weekly | LOW |
| Smart bidding active, CPA >30% above target for 2+ weeks | Consider reverting to manual | MEDIUM |

**Smart bidding transition rules:**
- Start with ONE campaign (highest conversion volume)
- Set target at 110-120% of current CPA (give room to learn)
- Learning period: minimum 2 weeks before judging
- Success criteria: CPA within 20% of target after learning period
- Rollback criteria: CPA >40% above target for 3+ weeks

**Priority 3: Structural Optimization**

| Signal | Recommendation |
|--------|---------------|
| Campaign with <15 conversions/month | Consolidation candidate (merge similar campaigns) |
| Brand + non-brand mixed in one campaign | Separate into brand and non-brand campaigns |
| 10+ ad groups with <5 conversions each | Consolidate to 3-5 ad groups |
| Ad copy with <100 impressions per variant | Insufficient data,don't judge yet |
| Ad copy with 500+ impressions, CTR <50% of best variant | Pause underperformer |

**Priority 4: Landing Page Signal Detection**

| Signal | Implication | Action |
|--------|------------|--------|
| High CTR (>5%) but low CVR (<1%) | Landing page disconnect | Audit LP message match |
| Mobile CVR <50% of desktop CVR | Mobile experience issue | Check mobile LP speed/UX |
| Bounce rate >70% (if available) | Poor relevance or slow load | Check LP relevance + speed |
| CVR variance >3x between campaigns with similar intent | LP quality difference | Compare landing pages |

### Weekly Optimization Checklist

- [ ] Performance-based keyword decisions made (50+ click threshold)
- [ ] Bid strategy assessed (ready for smart bidding?)
- [ ] Structural efficiency reviewed
- [ ] Landing page signals checked
- [ ] CPA/ROAS vs target tracked
- [ ] Phase transition criteria evaluated (CPA within 20%? Smart bidding active?)

---

## Phase 3: Growth (Weeks 6-12)

### Goal
Scale what's working. You've proven the fundamentals,now expand.

### Risk Tolerance: AGGRESSIVE
- Budget increases on proven campaigns
- New campaign types (PMAX, remarketing)
- Broader match types on proven keywords
- Geographic expansion

### Priority Actions (In Order)

**Priority 1: Scaling Proven Winners**

| Campaign Status | Impression Share | CPA vs Target | Action |
|----------------|-----------------|---------------|--------|
| Below target CPA, <50% IS | Budget constrained | Scale budget 25-50% |
| Below target CPA, 50-70% IS | Room to grow | Scale budget 15-25% |
| Below target CPA, >80% IS | Near ceiling | Expand keywords/audiences instead |
| At target CPA, <60% IS | Competitive pressure | Test bid increase 10-15% |
| Above target CPA | Underperforming | Do NOT scale. Optimize first. |

**Budget scaling rules:**
- Never increase budget more than 50% in a single week (disrupts Smart Bidding)
- Monitor for 7 days after each increase before scaling again
- If CPA rises >15% after budget increase, revert
- Document baseline metrics before each increase

**Priority 2: New Campaign Opportunities**

| Opportunity | Requirements | Expected Timeline |
|-------------|-------------|-------------------|
| Performance Max | 50+ conversions/month, strong feed (ecom) | 2-3 weeks to launch + learn |
| Remarketing | 1,000+ audience list, conversion tracking solid | 1 week to launch |
| Competitor brand campaigns | Budget available, brand terms protected | 1 week to launch |
| Geographic expansion | Proven in primary geo, budget for test | 2 weeks to test |
| Broader match types | Proven exact match keywords with volume ceiling | Gradual over 2-3 weeks |

**Priority 3: Competitive Landscape**
- Monitor impression share trends (declining IS on profitable campaigns = competitive pressure)
- Identify new competitors appearing in auction
- Assess whether to defend position or find new angles
- Decision: If IS dropping >10% WoW on profitable campaigns for 2+ weeks, investigate

### Weekly Growth Checklist

- [ ] Budget-constrained winners identified and scaled
- [ ] New campaign opportunities evaluated
- [ ] Competitive position monitored
- [ ] CPA/ROAS still meeting targets after scaling
- [ ] Graduation criteria evaluated (4+ weeks at target?)

---

## Phase 4: Graduation

### Criteria
- 4+ consecutive weeks meeting CPA/ROAS targets
- Smart bidding stable (no learning mode disruptions)
- No critical issues outstanding

### Graduation Report Contents

When the account meets graduation criteria, produce:

1. **Journey Summary:** Where the account started vs where it is now
2. **Key Milestones:** Phase transitions, breakthrough moments, critical fixes
3. **Intelligence Gathered:**
   - Top performing keywords/campaigns
   - Waste patterns identified and blocked
   - What bid strategies work for this account
   - Landing page learnings
4. **Baseline vs Final Metrics:**

| Metric | Week 1 Baseline | Current (Graduation) | Improvement |
|--------|----------------|---------------------|-------------|
| CPA | $X | $X | -X% |
| Conversions/week | X | X | +X% |
| CVR | X% | X% | +X% |
| Waste % | X% | X% | -X% |

5. **Ongoing Strategy Recommendations:**
   - What to continue doing
   - What to monitor
   - What to test next
   - Seasonal considerations

6. **Handoff to Ongoing Management:**
   - Account transitions from "onboarding mode" to "maintenance mode"
   - Weekly Pulse (standard weekly audit) takes over
   - All accumulated intelligence carries forward

---

## Confidence Scoring

Data confidence scales with volume. Use this to calibrate recommendation strength:

| Conversion Volume | Weeks of Data | Confidence Level | Score | What You Can Decide |
|-------------------|---------------|-----------------|-------|---------------------|
| 50+ conversions | 4+ weeks | HIGH | 0.8-1.0 | Full optimization: pause, scale, restructure |
| 30-50 conversions | 2-4 weeks | MEDIUM | 0.5-0.8 | Moderate changes: bid adjustments, targeted pauses |
| 15-30 conversions | 1-3 weeks | LOW | 0.3-0.5 | Conservative: waste removal, tracking fixes only |
| <15 conversions | Any | INSUFFICIENT | 0.0-0.3 | Structural only: tracking, waste, budget health |

### Confidence-Gated Decisions

| Decision Type | Minimum Confidence | Minimum Data |
|---------------|-------------------|--------------|
| Pause a keyword | MEDIUM (0.5+) | 50+ clicks, 0-1 conversions |
| Change bid strategy | MEDIUM (0.5+) | 30+ conversions/month |
| Scale budget | HIGH (0.8+) | 4+ weeks at target CPA |
| Restructure campaigns | HIGH (0.8+) | Clear pattern over 30+ days |
| Add negative keywords (alignment waste) | LOW (0.3+) | 1+ clicks if obvious waste |
| Add negative keywords (performance waste) | MEDIUM (0.5+) | 50+ clicks, 0 conversions |

---

## Impact Scoring System

### Impact Score (1-10)

| Score | Meaning | Example |
|-------|---------|---------|
| 10 | Could improve profitability by 20%+ | Fix broken conversion tracking |
| 7-9 | Could improve key metric by 10-20% | Move top campaign to smart bidding |
| 4-6 | Solid improvement 5-10% | Add 15 negative keywords saving $150/week |
| 1-3 | Minor improvement <5% | Update ad extensions |

### Effort Score (1-10)

| Score | Meaning | Time Required |
|-------|---------|---------------|
| 1-3 | Quick win | <30 minutes |
| 4-6 | Moderate | 1-4 hours |
| 7-10 | Major project | 1+ days |

### Recommendation Rules
- NEVER more than 5 recommendations per week (3-5 ideal)
- ALWAYS lead with highest-impact, lowest-effort actions
- ALWAYS include at least 1 quick win (gives the team an easy victory)
- NEVER recommend actions inappropriate for the current phase
- NEVER present LOW/INSUFFICIENT confidence recommendations as actionable

---

## Output Format

### New Client Onboarding Assessment - [Account Name]

```
CURRENT PHASE: [STABILIZATION / OPTIMIZATION / GROWTH / GRADUATION]
WEEK: [X] of engagement
PHASE PROGRESS: [X]% toward next phase transition
ACCOUNT HEALTH: GREEN / AMBER / RED
```

---

#### Phase Status

**Phase:** [Current phase name]
**Goal:** [What this phase is about]
**Risk Tolerance:** [CONSERVATIVE / BALANCED / AGGRESSIVE]
**Transition Check:** [Criteria met / Not met: specific reason]
- [Detail: "23 conversions accumulated, need 30 for transition. At current rate, expect threshold in 1-2 weeks."]

---

#### Previous Recommendations Status

| # | Recommendation | Status | Result |
|---|---|---|---|
| 1 | [From last session] | Completed / In Progress / Not Started | [Outcome if completed] |

*If first session: "First onboarding assessment. No prior recommendations to review."*

---

#### This Week's Recommendations

**1. [Action Title]** | Priority: CRITICAL/HIGH/MEDIUM | Effort: quick_win/moderate/significant | Confidence: X.X

- **Action:** [Clear, executable description]
- **Reasoning:** [Data-backed explanation with specific numbers]
- **Phase Context:** [Why this matters NOW in this phase]
- **Expected Impact:** [Projected improvement]
- **Success Metric:** [How to measure if it worked]
- **Impact:** X/10 | **Effort:** X/10

---

#### Performance Snapshot

| Metric | Current | vs Target | vs Baseline (Week 1) |
|--------|---------|-----------|---------------------|
| Spend | $X |: | +/-X% |
| Conversions | X |: | +/-X% |
| CPA / ROAS | $X | X% above/below | +/-X% |
| CVR | X% |: | +/-X% |

**Cumulative conversions since engagement start:** X

---

#### Accumulated Intelligence

- **What's working:** [Keywords, campaigns, patterns that perform]
- **Waste blocked:** [Total waste $ eliminated, negatives added]
- **Key learning this week:** [Most important insight]

---

#### Client-Facing Narrative

[3-5 paragraph professional summary suitable for sharing with the client. Focus on progress, next steps, and phase context without jargon.]

---

#### Next Week's Focus

[What to prioritize in the next session. Set expectations for what comes next.]

---

## Guardrails (Hard Rules)

**NEVER:**
- Recommend aggressive optimization during Stabilization phase (data confidence is insufficient)
- Skip phase transition evaluation (check every session)
- Make CPA-based decisions with <15 conversions (insufficient data)
- Recommend budget scaling when CPA is above target
- Recommend more than 5 actions per week
- Present LOW or INSUFFICIENT confidence recommendations as actionable
- Suggest campaign restructuring in Stabilization phase
- Rush through phases even if performance looks excellent early

**ALWAYS:**
- State the current phase before any analysis
- Reference accumulated intelligence (what was tried, what worked)
- Adapt recommendation intensity to current phase risk tolerance
- Include phase context in every recommendation
- Check phase transition criteria every session
- Include at least 1 quick win in every recommendation set
- Differentiate between new accounts and existing accounts being taken over
- Flag data quality issues before making performance conclusions

---

## Edge Cases & Nuances

### Existing Account (Not New to Google Ads)
- Account has history before you took over
- Run a baseline audit FIRST (don't assume previous management was sound)
- Check: conversion tracking accuracy, existing negatives, campaign structure
- Start in Stabilization regardless,you need to verify the foundation
- The 90-day clock starts when YOU begin managing, not when the account was created

### Conversion Tracking Breaks Mid-Phase
- Immediately escalate (CRITICAL severity)
- Pause the phase clock,do not count days toward transition while tracking is broken
- Do NOT make optimization decisions until tracking is restored
- All performance data during the break is unreliable

### Budget Cut >50%
- Re-evaluate current phase. May need to drop back to Stabilization
- Adjust targets proportionally
- Flag: "Budget reduction impacts data gathering pace. Timeline may extend."
- Recalculate: New expected transition dates based on reduced conversion velocity

### New Campaigns Added Mid-Engagement
- Absorb into current phase strategy
- Do NOT restart the 90-day clock
- New campaigns follow the same phase rules as existing campaigns
- Monitor new campaigns more closely in their first 2 weeks

### Account Dramatically Exceeds Targets Early
- Do NOT rush through phases,you still need data confidence
- Celebrate the performance, but note: "Strong early results, but need [X] more weeks of data to confirm sustainability."
- Phase transitions still require minimum data thresholds
- Exception: If account has 50+ conversions in Week 2, you may accelerate to Optimization

### Zero Conversions After 4 Weeks
- Transition to Optimization with DATA_INSUFFICIENT flag
- Skip ALL CPA-based decisions
- Focus exclusively on: search term waste, budget utilization, tracking health, CPC optimization
- If still <10 conversions at Week 8: ESCALATE
- "Account has not generated enough data for AI optimization. Manual review required: check tracking, targeting, budget, landing pages, or market fit."

### Seasonal Start
- Account launched during known seasonal period (Black Friday, summer lull)
- Note: "Onboarding coincides with [seasonal period]. Performance baselines may not be representative."
- Extend Stabilization phase by 1-2 weeks if seasonality distorts data
- Compare to industry seasonal benchmarks rather than absolute targets

### First Session (No History)
- Set baseline: "This is our first onboarding assessment. Today's metrics become the baseline."
- Emphasize: Provide updated data next session for comparison
- Focus on Phase 1 (Stabilization) priorities regardless of account maturity
- Recommend establishing target metrics if not already defined

---

## Data Quality Checks

**Before analyzing, verify:**

- Conversion numbers are internally consistent (CPA = cost / conversions)
- Conversion tracking appears healthy (consistent daily conversion recording)
- Budget and spend numbers make sense for the time period
- Time period covers at least 7 days (shorter periods are noise)
- If comparing periods, both cover the same number of days

**If data quality issues found:**
- Flag explicitly before proceeding
- Note which conclusions may be affected
- Tracking issues are always Priority 1 in any phase

---

## Limitations

---

## Quality Assurance

Before delivering the onboarding assessment:
- [ ] Current phase correctly identified based on timeline and data
- [ ] Phase-appropriate risk tolerance applied (no aggressive actions in Stabilization)
- [ ] Phase transition criteria evaluated with specific numbers
- [ ] Recommendations limited to 3-5, prioritized by impact/effort
- [ ] At least 1 quick win included
- [ ] Confidence levels reflect actual data volume
- [ ] Every recommendation includes phase context
- [ ] Data quality issues flagged before performance conclusions
- [ ] Prior recommendations referenced if provided
- [ ] Success metrics included for each recommendation
- [ ] Client-facing narrative is jargon-free and professional
- [ ] Next week's focus clearly stated
