---
name: sales-intelligence
description: Generate competitive sales intelligence from a prospect's URL. Analyze their website, discover competitors, audit landing pages side-by-side, identify messaging gaps, and produce strategic campaign recommendations. Everything an agency needs to walk into a pitch meeting prepared. No Google Ads account access needed. Triggers on "sales pitch", "prospect analysis", "competitive pitch", "new business intelligence", "pitch prep", or "analyze this prospect".
---

# Sales Intelligence Report

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

Turn a prospect's URL into everything your agency needs to win the pitch. No account access required.

---

## What You Get

A comprehensive markdown intelligence report with:

1. **60-Second Brief** , One page with the strongest angle, website grade, and 3 conversation starters
2. **Business & Market Context** , Who the prospect is and who they compete with
3. **Website Audit** , Landing page analysis with side-by-side competitor comparison
4. **Competitive Intelligence** , Messaging themes, white space, ad activity
5. **Strategic Recommendations** , 2 testable campaign hypotheses backed by evidence
6. **Internal Sales Notes** , Pain points, objection responses, quick wins (for your eyes only)

---

## Required Context

### Must Have

**1. Prospect's Website URL**
The only thing I need to get started.

```
Example: https://smithplumbing.com
```

### Recommended

**2. Industry / Service Description**
Helps me find the right competitors and benchmarks.

```
Example: "Emergency plumbing services in Austin, TX"
Example: "B2B SaaS , project management for construction teams"
```

**3. Competitor URLs (1-3)**
If you know their main competitors, provide them. Otherwise, I'll auto-discover via search.

### Optional

- **Budget context** , Does the prospect have a budget range in mind?
- **Whether they're currently advertising** , Running Google Ads already?
- **Specific concerns** , Anything you know about the prospect's pain points?

---

## Analysis Pipeline

### Step 1: Business Profiling

I analyze the prospect's website to extract:

| Data Point | What I Look For | Why It Matters |
|-----------|----------------|---------------|
| Business name | Official company name and variants | Identity baseline |
| What they do | Core offering in 1-2 sentences | Positioning clarity |
| Who they serve | Target customers/audience | Targeting alignment |
| Business model | Lead gen, ecommerce, SaaS, local | Campaign structure guidance |
| Positioning tier | Premium, mid-market, budget | Messaging approach |
| Key differentiators | What they claim makes them unique | Ad angle ammunition |
| Notable gaps | What's MISSING from the site | Pain points to discuss |

**Extraction Rules:**
- Extract ONLY what is explicitly stated or clearly evident
- Assign confidence scores to inferred fields
- Flag what's MISSING from the site (no pricing? no testimonials? no about page?)

### Step 2: Competitor Discovery

If you didn't provide competitors, I find 3 by searching for businesses solving the same problem in the same market.

**Competitor Qualification Rules:**

| Include (Proper Competitors) | Exclude (NOT Competitors) |
|------------------------------|--------------------------|
| Same service/product category | Directories (Yelp, G2, Clutch) |
| Similar geographic scope | Job boards, recruitment sites |
| Comparable business size | Tutorial/educational sites |
| Competing for same customers | News articles about the industry |

**Intellectual Honesty Requirement:** Auto-discovered competitors always include this caveat: "Competitors identified based on search overlap , verify with the prospect before your meeting."

### Step 3: Landing Page Audit

The hero section of the report. I analyze the prospect's site AND competitor sites across these dimensions:

**3-Second Test** , Can a visitor answer "What is this? Who is it for? Why should I care?" within 3 seconds?

**Trust & Social Proof** , Using the Have/Buried/Missing framework:
- What trust signals exist? (testimonials, logos, ratings, certifications)
- Are they prominent or buried?
- What's missing that competitors have?

**Offer Strength** , How clear is the value proposition?
- Clarity: Is the offer immediately obvious?
- Risk reversal: Is there a guarantee, free trial, or low-commitment entry point?
- Urgency: Is there authentic urgency (not manufactured countdown timers)?

**Positioning Alignment** , Does the website's design, language, and presentation match the positioning they claim? A "premium" service with a basic template and stock photos has a credibility problem.

**Conversion Path** , How easy is it to take the next step?
- How many fields in the form?
- Is the CTA prominent and clear?
- Is click-to-call available on mobile?

### The Comparison Table (THE Hero Feature)

The single most powerful visual in the report:

```markdown
| Dimension | [Prospect] | [Competitor 1] | [Competitor 2] | [Competitor 3] |
|-----------|-----------|----------------|----------------|----------------|
| 3-Second Test | FAIL | PASS | PASS | FAIL |
| Hero Clarity | Vague ("Welcome to...") | Specific ("Get X in Y days") | Specific | Vague |
| Trust Signals | 0 above fold | 3 logos + rating | Testimonial | 2 logos |
| Offer Strength | Weak (no CTA) | Strong (free trial) | Moderate | Weak |
| Risk Reversal | None | Money-back guarantee | Free consultation | None |
| Form Fields | 7 required | 3 required | 4 required | 5 required |
| Positioning | Claims premium, delivers mid | Consistent premium | Budget-clear | Unclear |
```

### Revenue-Tied Observations

Every finding must be tied to business impact. Not "your hero section could be improved" but:

- "Your hero says 'Welcome to Smith Plumbing' while your top competitor says 'Emergency Plumber , 2 Hour Response Guaranteed.' That headline difference influences which search result a customer clicks."
- "Your site has zero trust signals above the fold. All 3 competitors display Google ratings. For visitors comparing options, your site provides no reason to trust you over alternatives."
- "Your contact form has 7 required fields. Competitor 1 has 3. Industry data suggests each additional field reduces form completion by 5-10%."

### Step 4: Competitive Intelligence

**Messaging Theme Extraction:**

For each competitor, identify their primary and secondary messaging angles. Build a frequency table:

| Theme | Adoption Rate | Prospect Uses? | Significance |
|-------|--------------|----------------|--------------|
| Free consultation | 4/5 (80%) | No | Table stakes , must have |
| 24/7 availability | 3/5 (60%) | Yes | Competitive , keep using |
| Specific guarantee | 1/5 (20%) | No | Differentiator , opportunity |
| Industry specialization | 0/5 (0%) | No | White space , test this |

**White Space Identification:**

White space = messaging angles NO competitor is using. These are gold for sales conversations:
- "Nobody in your market is leading with [angle]. If your prospect can deliver on this, they own it."
- Rate feasibility for the prospect: high (they already do this), medium (they could), low (major change needed)

**Ad Activity Signals:**

Determine who's running Google Ads:
- Is the prospect currently advertising?
- Which competitors appear to be running ads?
- Rough intensity signal (heavy/moderate/light/none)

**Critical sales intelligence:** "Your prospect is NOT running ads but 3 of their 5 competitors ARE" is the single best opening line in a PPC sales conversation.

### Step 5: Strategic Recommendations

2 testable hypotheses, each following this format:

> "We believe [doing X] will [produce Y] because [evidence Z from this analysis]"

These are hypotheses, not guarantees. They give you something specific and evidence-backed to discuss in the meeting.

**Each hypothesis includes:**
- What to test and why
- Evidence from this analysis
- 30-day test structure
- Success signals to monitor
- Budget range estimate
- Confidence level (high/medium/low)

### Step 6: Internal Sales Notes

For your team only , never share with the prospect:

- **Pain points** to lead with (backed by evidence from the analysis)
- **Likely objections** with evidence-based responses
- **Quick wins** you could deliver fast to build trust
- **Things to verify** before the meeting (confidence warnings)

---

## Confidence Scoring

Every section of the report gets a confidence rating based on evidence quality:

| Section | High Confidence | Medium Confidence | Low Confidence |
|---------|----------------|-------------------|----------------|
| Business profiling | Multi-page analysis, explicit claims found | Homepage only, some inference | Thin site, heavy inference |
| Competitor discovery | User-provided + verified | Auto-discovered, 3+ found | Auto-discovered, <2 found |
| Landing page audit | Full page loaded, all elements visible | Partial load, some elements missing | Site blocked/broken, limited data |
| Messaging themes | 3+ competitors with consistent patterns | 2 competitors, some patterns | 1 competitor or inconsistent data |
| Ad activity signals | Clear evidence of ads (AdTransparency) | Indirect signals (sponsored links) | No data found either way |
| Strategy hypotheses | Strong data across multiple dimensions | Reasonable data in 1-2 dimensions | Extrapolated from limited evidence |

**How to use confidence in the report:**
- High confidence findings go in the 60-Second Brief
- Medium confidence findings go in the body with context
- Low confidence findings go in "Things to verify" in Internal Sales Notes

---

## Worked Example: Local Service Business

**Input:** https://austinroofingpros.com, "Roofing contractor in Austin, TX"

**Business Profile Extracted:**
- Business: Austin Roofing Pros, residential + commercial roofing
- Positioning: "Central Texas's Most Trusted Roofer Since 2008"
- Model: Local service, lead gen (free estimates)
- Key gap: No reviews/testimonials above the fold, no pricing guidance

**Competitors Found (auto-discovered):**
1. Lon Smith Roofing (lonsmithroofing.com) , 4.8 stars, 600+ reviews
2. Austin Roofing & Construction (austinroofer.com) , Specializes in storm damage
3. Ranger Roofing (rangerroofing.com) , "Free roof inspection" lead-in offer

**Comparison Table:**

| Dimension | Austin Roofing Pros | Lon Smith | Austin R&C | Ranger Roofing |
|-----------|-------------------|-----------|------------|----------------|
| 3-Second Test | FAIL ("Welcome to...") | PASS (clear CTA) | PASS (storm focus) | PASS (free inspection) |
| Trust Signals | 0 above fold | Google rating + 600 reviews | BBB badge + gallery | 5-star badge |
| Offer Strength | "Contact us" (weak) | "Free estimate in 24h" | "Emergency storm service" | "Free roof inspection" |
| Form Fields | 6 required | 3 required | 4 required | 2 required + phone |

**60-Second Brief:**
- **Strongest angle:** "Your 3 top competitors all display reviews prominently. Your site has zero social proof above the fold."
- **Website Grade:** C (fails 3-Second Test, no trust signals)
- **Conversation starters:**
  1. "Lon Smith has 600+ Google reviews featured on their homepage. How many reviews does Austin Roofing Pros have that aren't being showcased?"
  2. "Ranger Roofing offers a free roof inspection as their entry point. Your site asks visitors to 'Contact us' with a 6-field form. That friction difference matters when homeowners are comparing options."
  3. "All 3 competitors are running Google Ads for 'roof repair Austin.' Are you seeing them take calls that could be yours?"

---

## 60-Second Brief: Selection Logic

The brief is the FIRST page of the report , not an afterthought.

**Strongest Angle Selection (ranked):**
1. "Competitors are advertising, prospect is not" (if true , this always wins)
2. Specific revenue-tied LP weakness (e.g., "Your site fails the 3-Second Test")
3. Competitive white space opportunity (e.g., "Nobody in your market owns [angle]")
4. Market timing opportunity (e.g., "3 competitors just started advertising")

**Website Grade (A/B/C/D):**
- **A:** Passes 3-Second Test, strong trust signals, clear offer, good positioning alignment
- **B:** Passes most checks, 1-2 moderate gaps
- **C:** Fails 3-Second Test OR has significant trust/offer gaps
- **D:** Multiple critical failures, fundamental positioning issues

**Conversation Starters (3, specific to THIS prospect):**
- BAD: "Have you considered PPC advertising?"
- GOOD: "I noticed your competitors [Name] and [Name] are running Google Ads for [service]. Have you tested competing for that traffic?"
- GOOD: "Your website mentions [specific claim] but I couldn't find any evidence backing it up. How do your customers typically validate that?"

---

## Edge Cases

### Prospect Website is Very Thin (<200 words)
- Note the limitation in the brief
- LP audit focuses on what's there
- Recommend "website development before advertising" as Hypothesis 1

### No Competitors Found
- Report on the prospect's site only
- Flag: "No direct competitors identified via search , verify with the prospect"
- Skip comparison table
- Focus on LP audit and general strategy

### Prospect Already Running Ads
- Reframe pitch from "start advertising" to "improve your advertising"
- LP audit becomes more powerful: "You're spending money sending traffic to this page , here's what's happening when they arrive."

### Prospect and Competitors Are Very Similar
- Emphasize micro-differentiators and white space
- The positioning map becomes critical
- Strategy hypotheses should focus on standing out, not table-stakes improvements

### Prospect Website is Broken or Under Construction
- Website Grade = D
- First hypothesis: "Build a conversion-ready landing page"
- Be honest: "Advertising before fixing the website will waste budget"
- Still analyze competitors , the competitive intel is valuable regardless

---

## Guardrails

**NEVER** invent competitor data , only report what's observable from their websites
**NEVER** reference Google Ads account data , none is available in this analysis
**NEVER** guarantee specific results , these are hypotheses, not promises
**NEVER** use generic conversation starters ("Have you considered PPC?")
**NEVER** skip the Internal Sales Notes , they're the most practical section for reps
**NEVER** present auto-discovered competitors as confirmed , always include the verification caveat

**ALWAYS** tie every LP finding to revenue impact, not UX theory
**ALWAYS** include at least 1 competitor in the comparison table
**ALWAYS** quantify messaging adoption rates with ratios (3/5, not "most")
**ALWAYS** provide 3 specific conversation starters tailored to THIS prospect
**ALWAYS** assign a website grade (A/B/C/D) with clear justification
**ALWAYS** rate white space opportunities by feasibility (high/medium/low)

---

## Anti-Patterns to Avoid

**Generic LP feedback:** "Your hero section could be improved" (no specifics, no competitor reference)
**Design opinions:** "I'd recommend a blue CTA button" (UX theory, not revenue-tied)
**Ungrounded competitor claims:** "They probably spend a lot on ads" (without ad activity evidence)
**Cherry-picking positives:** Only highlighting prospect strengths to avoid hard conversations
**Burying the comparison table:** The side-by-side table should be prominent, not hidden
**Vague white space:** "There's an opportunity in the market" (without specifying the angle and feasibility)

---

## Key Principles

**Specificity Over Generics**
Every finding should be specific to THIS prospect. Not "your hero section could be improved" but "your hero says 'Welcome to Smith Plumbing' while your top competitor says 'Emergency Plumber , 2 Hour Response Guaranteed.'"

**Revenue Impact Over UX Theory**
Don't cite design best practices. Tie every finding to business impact: lost clicks, lost trust, lost conversions.

**Hypotheses Not Prescriptions**
Campaign recommendations are tests to propose, not plans to implement. The agency and prospect should validate together.

**Intellectual Honesty**
If competitors were auto-discovered, say so. If evidence is thin, flag it. If a finding has low confidence, warn the rep. Credibility is built on honesty, not polish.

---

## Report Delivery Tips

**For a Cold Pitch (Prospect Doesn't Know You):**
- Lead with the 60-Second Brief only
- Save the full report for after first contact
- Use the comparison table as the "hook" in your email
- Don't overwhelm , curiosity beats information overload

**For a Warm Lead (Prospect Expects Analysis):**
- Deliver the full report
- Walk through the comparison table live if possible
- Save Internal Sales Notes for your team's pre-meeting prep
- Present hypotheses as conversation starters, not prescriptions

**For an Existing Client Expansion (Selling Additional Services):**
- Focus on competitive intelligence sections
- The comparison table shows what competitors do differently
- White space = new service opportunities to pitch
- Frame as "protecting their position" rather than "fixing problems"

**Shelf Life:** This report is a snapshot. Competitor sites change. Ad activity shifts. Recommend re-running the analysis every 3-6 months for active prospects.

---

## Quality Assurance

Before delivering the report:

- [ ] 60-Second Brief is the FIRST section (not buried at the end)
- [ ] Side-by-side comparison table exists and has at least 1 competitor
- [ ] Internal Sales Notes are clearly marked "FOR AGENCY USE ONLY"
- [ ] Every LP finding references revenue impact, not just UX advice
- [ ] Competitor patterns are quantified with specific ratios
- [ ] Campaign hypotheses cite specific evidence from the analysis
- [ ] Auto-discovered competitors include the intellectual honesty caveat
- [ ] Confidence warnings are populated (never empty)
- [ ] Conversation starters are specific to THIS prospect (not generic)
- [ ] Report does not reference Google Ads account data (none is available)
- [ ] Website grade assigned with clear justification
- [ ] White space opportunities identified and rated by feasibility
