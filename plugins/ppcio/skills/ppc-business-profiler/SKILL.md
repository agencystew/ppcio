---
name: ppc-business-profiler
description: "Build a reusable single-business positioning and audience profile from one website URL. Not for multi-competitor messaging matrices (use competitor-messaging-analysis) or agency sales pitch prep (use sales-intelligence)."
---

# PPC Business Profiler

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

Extract universal business facts from a website to inform PPC strategy. Every data point is evidence-based, confidence-scored, and gap-flagged, business intelligence, not campaign strategy.

---

## Core Philosophy

### Facts Over Assumptions

Extract only what is explicitly stated or clearly evident on the page. Never infer business model, pricing strategy, or target audience from guesswork.

**What this means:**
- If the site says "serving small businesses since 2015," extract that verbatim
- If pricing isn't shown, mark it "not disclosed", don't guess "premium" from design
- If they list 4 services but the nav shows 6, flag the gap

### Business-Level, Not Campaign-Level

This is permanent context about WHO they are, not tactical marketing decisions. Don't recommend keywords, ad copy, or bidding strategies here.

**Correct:** "They offer 3 service tiers: Basic, Pro, Enterprise"
**Incorrect:** "They should bid on 'enterprise software' keywords"

### Gaps Are Data Too

What's MISSING from a website tells you what to ask the client. A site with no pricing, no testimonials, and no team page reveals as much as one with all three.

### Confidence Scores on Everything

Every extracted field gets a confidence score (0.0-1.0):
- **0.9-1.0:** Explicitly stated, found in headline or dedicated section
- **0.7-0.8:** Clearly implied, consistent across multiple pages
- **0.5-0.6:** Inferred from context, some ambiguity
- **<0.5:** Weak signal, needs manual verification

### Cite Your Evidence

Every fact includes where it was found: hero section, about page, footer, FAQ, pricing page. This lets the user verify and builds trust in the extraction.

---

## Critical Context Gathering

### Required Input

**1. Website Content**
- Option A: User provides a URL (read the page with your web tool, or capture it with the landing-page kit)
- Option B: User pastes the page content directly
- Minimum: Homepage content
- Better: Homepage + About + Services/Products page

### Recommended Input

**2. Multiple Pages**
If available, request content from:
- Homepage (brand positioning, hero messaging)
- About page (company story, team, values)
- Services/Products page (offerings, pricing)
- Testimonials/Case studies (social proof, customer types)
- FAQ (objections, scope clarification)

**3. User Context**
- Any known details about the business
- Industry or vertical (helps calibrate extraction)

---

## Extraction Framework

### Brand Identity

Extract how this business identifies itself:

- **Business Name:** Official company name
- **Name Variants:** Acronyms, shortened versions, alternative spellings
- **Business Type:** single_location | multi_location | online_only | hybrid | franchise | marketplace
- **Brand Positioning:** Tagline, mission, or "what we do" statement in their own words (max 150 chars)
- **Evidence Source:** Where name/positioning was found
- **Confidence:** 0.0 to 1.0

**Extraction Tips:**
- Check the page title, logo alt text, and footer for official name
- Favicon and domain name may differ from brand name
- Social media links in footer may reveal additional brand variants
- Copyright notice often has the legal entity name

### Offerings

What this business provides to customers:

**Core Offerings** (for each):
- Name (how THEY refer to it)
- One-sentence description in their language
- Category (using their navigation/grouping labels)
- Synonyms (alternative names for the same offering)
- Prominence: main_navigation | hero_section | dedicated_page | mentioned_briefly

**Offering Structure:**
- How they cluster offerings (e.g., "Services > Residential > Plumbing Repair")
- Bundles, tiers, and either/or alternatives
- Upsell/cross-sell relationships visible on the site

**Explicitly NOT Offered:**
- What they explicitly say they don't do
- Context: comparison page, FAQ, or scope definition
- This is critical for PPC, prevents wasting budget on irrelevant keywords

### Target Customers

**Explicit Targeting:**
- Customer types in their own words
- Industries/verticals mentioned
- Company size indicators (SMB, mid-market, enterprise)
- Geographic focus
- Demographic signals (age, profession, life stage)

**Problem Focus:**
- Top 3-5 problems they explicitly mention solving
- Specific use cases or scenarios described

**Where to Find Customer Signals:**

| Page | Signal Type | What to Extract |
|------|------------|-----------------|
| Homepage hero | Primary audience | Who the main message addresses |
| Navigation labels | Audience segmentation | "For Teams" vs "For Individuals" |
| Testimonials | Customer types | Job titles, company names, industry |
| Case studies | Use cases | Problem/solution pairs, company size |
| Pricing tiers | Buyer segments | Feature splits often map to personas |
| FAQ | Objections | Questions reveal knowledge level and concerns |
| Footer | Geographic scope | Locations served, office addresses |

### Market Positioning

**Pricing Signals:**
- Explicit prices (item, price, unit)
- Pricing model: one-time | subscription | usage-based | tiered | custom-quote | freemium | not-disclosed
- Language signaling price position ("affordable," "premium," "enterprise-grade")

**Pricing Confidence Matrix:**

| Evidence | Confidence | Interpretation |
|----------|-----------|----------------|
| Explicit prices on pricing page | 0.95 | Directly stated |
| "Starting from $X" | 0.85 | Floor price, actual may vary |
| "Contact for pricing" / "Custom quote" | 0.70 | Likely mid-market to enterprise |
| "Affordable" / "Budget-friendly" language | 0.50 | Positioning signal, not actual price |
| No pricing information anywhere | 0.30 | Could be any tier, mark as gap |
| "Premium" / "Enterprise-grade" design only | 0.40 | Design inference only, unreliable |

**Competitive Landscape:**
- Competitors mentioned by name
- How they compare themselves
- Top 3-5 differentiation claims

**Trust & Authority:**
- Certifications, licenses, credentials
- Awards, press, notable achievements
- Years in business
- Guarantees (warranties, money-back, promises)
- Social proof types: testimonials | case-studies | reviews | client-logos | statistics

### Operational Scope

- **Headquarters:** City, state, country
- **Additional locations**
- **Service areas:** Where they operate/deliver
- **Business scale:** startup | small-business | mid-market | enterprise | unclear
- **Operational reach:** local | regional | national | international
- **Online vs physical:** online-only | physical-only | hybrid

### Quality Metadata

- **URL analyzed**
- **Page type:** homepage | about-page | services-page | product-page | landing-page
- **Content quality:** excellent | good | fair | poor
- **Overall confidence:** Average across all extractions
- **Data gaps:** Important information missing from the site
- **Manual review flags:** Fields with confidence < 0.7
- **Ambiguities:** Unclear or contradictory information found

---

## Multi-Page Analysis Patterns

When content from multiple pages is available, combine signals intelligently:

**Homepage → Brand positioning, primary offering, primary audience**
- This is the strongest signal for how the business wants to be perceived
- Hero section = their #1 message to the world

**About Page → Company story, team size, values, founding year**
- Often more honest and specific than the homepage
- "Founded by..." reveals founder-led vs corporate
- Team photos reveal company size when headcount isn't stated

**Services/Products Page → Offering depth, categorization, pricing**
- Navigation structure reveals how they think about their business
- Service descriptions reveal their language and terminology
- Pricing page (if it exists) reveals their buyer sophistication expectations

**Testimonials/Reviews → Real customer types, actual outcomes, trust signals**
- Richest source for customer profile data
- Different testimonial types reveal different personas
- Specific outcomes mentioned reveal value propositions that actually work

**FAQ → Objections, scope boundaries, customer knowledge level**
- Questions asked reveal what customers don't understand
- Answers reveal the business's approach to objection handling
- "We don't do X" answers are critical for negative keyword strategy

**Confidence Boost Rule:** When the same fact appears on 2+ pages, increase confidence by 0.1 (cap at 1.0). Consistency across pages is the strongest signal of truth.

---

## Worked Example

**Input:** Homepage content from https://brightpath-tutoring.com

**Extraction:**

**Brand Identity:**
- Business Name: BrightPath Tutoring (Conf: 0.95, Source: logo + page title)
- Name Variants: "BrightPath" (used in body copy), "Bright Path Learning" (footer copyright)
- Business Type: hybrid (online + in-person)
- Brand Positioning: "Personalized K-12 Tutoring That Actually Works" (Conf: 0.95, Source: hero h1)

**Offerings:**
1. One-on-One Tutoring, "Personalized sessions matched to your child's learning style" (Prominence: hero_section, Conf: 0.95)
2. SAT/ACT Prep, "Score improvement guaranteed or your money back" (Prominence: main_navigation, Conf: 0.90)
3. Learning Assessment, "Free 30-minute assessment to identify gaps" (Prominence: hero_section, Conf: 0.90)
4. Group Workshops, Mentioned in footer link only (Prominence: mentioned_briefly, Conf: 0.60)

**Explicitly NOT Offered:** "We focus exclusively on academic tutoring, we don't offer music, art, or athletic coaching" (Source: FAQ, Conf: 0.95)

**Target Customers:**
- Primary: Parents of K-12 students (Conf: 0.95, Source: hero messaging, testimonials)
- Problem focus: "struggling grades," "test anxiety," "learning gaps after COVID" (Source: about page)

**Market Positioning:**
- Pricing: "Starting from USD 45/hour" (Conf: 0.85, Source: pricing page)
- Trust: 4.9 Google rating, "500+ families served," 3 named testimonials (Source: homepage)
- Differentiator: "Guaranteed score improvement" (SAT/ACT program only)

**Gaps Identified:**
- No team page, can't assess tutor qualifications (Critical for parent trust)
- No case studies, testimonials are generic ("Great experience!")
- No blog or resource section, missed SEO opportunity
- "Group Workshops" in footer but no dedicated page, unclear offering

---

## Edge Cases

### Single-Page Website (No Navigation)
- Extract what's available with lower confidence scores
- Flag: "Analysis limited to single page, additional pages would significantly improve profile accuracy"
- Focus extraction on the hero section, any scrollable sections, and the footer

### Site Under Construction or Coming Soon
- Business Name and basic positioning may still be extractable
- Mark all fields as low confidence (< 0.5)
- Flag as critical gap: "Site is not live, profile requires client conversation to validate"

### Multi-Language Site
- Extract from the primary language version
- Note additional languages as an operational scope signal (international reach)
- Flag if content differs significantly between languages

### Franchise or Multi-Location
- Extract the brand-level positioning AND location-specific details
- Note which pages are corporate template vs locally customized
- Flag: Service area may need location-by-location verification

### B2B and B2C Signals on Same Site
- Create separate offering groups for each audience
- Note the split and which audience appears primary (based on homepage hero)
- Flag: "Dual audience, persona building should create separate B2B and B2C profiles"

---

## Output Format

Structure the output as a markdown report with clear sections:

### Business Profile: [Company Name]

**Source:** [URL or "pasted content"]
**Overall Confidence:** [0.0-1.0]
**Content Quality:** [excellent/good/fair/poor]

Then each extraction category as an H3 section with bullet points including confidence scores and evidence sources.

### Summary Section

At the end, provide:
- **Key Strengths:** What the site communicates well (strong confidence data)
- **Critical Gaps:** Important missing information that limits PPC planning
- **Manual Review Needed:** Fields flagged with confidence < 0.7
- **Recommended Next Steps:** What additional content or client input would improve the profile

---

## Guardrails

**NEVER** infer business model from website design alone
**NEVER** make campaign strategy decisions (keywords, bids, ad copy)
**NEVER** assume pricing tier from visual design
**NEVER** fill in gaps with industry assumptions, flag them instead
**NEVER** skip the "explicitly NOT offered" section

**ALWAYS** extract only what is explicitly stated or clearly evident
**ALWAYS** include confidence scores for every extracted field
**ALWAYS** cite evidence source (hero section, about page, footer, etc.)
**ALWAYS** flag data gaps and fields needing manual review
**ALWAYS** capture what the business does NOT offer

---

## Anti-Patterns to Avoid

"They seem like a premium brand" (without pricing evidence)
"Their target audience is probably millennials" (without demographic signals)
"They compete with [major brand]" (unless explicitly stated on site)
Skipping the "not offered" section because nothing was found
Marking everything as high confidence when content is thin
Confusing marketing aspirations with business facts ("We're the #1 provider", is that verified?)

---

## Quality Assurance

Before delivering the business profile:

- [ ] Every data point cites its evidence source
- [ ] Confidence scores reflect actual evidence strength
- [ ] "Explicitly NOT offered" section is included (even if empty with explanation)
- [ ] Data gaps are clearly listed
- [ ] No campaign strategy recommendations have crept in
- [ ] Brand positioning uses THEIR words, not your summary
- [ ] Offerings use THEIR categories and labels
- [ ] Manual review flags called out for low-confidence fields
- [ ] Multi-page signals combined with confidence boost rule applied
- [ ] Pricing confidence matrix applied (not guessing tier from design)
- [ ] Edge cases handled (franchise, multi-language, B2B+B2C) if applicable
