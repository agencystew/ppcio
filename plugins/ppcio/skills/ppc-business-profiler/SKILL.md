---
name: ppc-business-profiler
description: "Builds a reusable, evidence-cited single-business profile from one website URL: extracts offerings, explicitly excluded services, 5-dimension buyer persona (sophistication, decision speed, fears, required proof), and Advertising Viability Score (AVS 0 to 5) ready for context.md. Use when onboarding or profiling a business before PPC or landing page work. Not for multi-competitor matrices (use competitor-messaging-analysis) or sales pitch prep (use sales-intelligence)."
---

# PPC Business Profiler & Viability Scorer

Great PPC campaigns and landing pages fail when built on vague guesses about who the buyer is, what the business refuses to sell, or whether the economics can even survive paid clicks. Your job is to extract **verified, evidence-cited business intelligence** from a website into a clean reusable profile (compatible with `landing-pages/<site>/context.md`) while scoring real **Advertising Viability** honestly.

## Start here

- Check if a local `landing-pages/*/context.md`, `facts.md`, or `inputs/site-page-text.md` already exists so you enrich verified facts instead of re-asking.
- If given a URL, inspect the Homepage plus Services/Pricing/About/FAQ pages (or ask the user to paste key pages if the site blocks automated fetches).
- **Strict Facts-Over-Assumptions Rule (Zero Fabrication):** Extract ONLY what is explicitly stated or directly visible on the site. Cite the exact source page/section (Hero, Nav, Pricing, Footer, FAQ) and attach a confidence tag (`High / Explicit`, `Medium / Implied`, `Missing - Ask Client`). If pricing, reviews, or service area are missing, mark them **`NOT DISCLOSED`** (gaps are high-value diagnostic data, never guess!).

## First-Principles Extraction Framework (Business Intelligence, Not Tactical Guessing)

1. **Brand Identity & Scope Boundaries:**
   - Official brand name, brand name variants (important for Brand exclusions!), business model (`Local Service | Ecommerce | B2B SaaS | Hybrid`), exact geography, and positioning in their own words.
   - **Core Offerings (In Customer Words)** vs. **Explicitly NOT Offered** (e.g., *"residential only - no commercial"*, *"no DIY parts"*, *"minimum $5,000 project"* -> immediately seeds day-one negative keywords!).
2. **5-Dimension Buyer Persona (How Real Buyers Decide):**
   - **Who buys & trigger moment:** Emergency pain vs. planned upgrade vs. committee B2B evaluation.
   - **Buyer Sophistication:** `Novice` (needs plain-English problem/solution clarity) | `Informed` (compares guarantees, turnaround, proof) | `Expert` (checks specs, integrations, exact pricing/SLA).
   - **Decision Speed:** Same-hour emergency | 1 to 7 day considered purchase | 30 to 90+ day B2B cycle (directly dictates attribution window and form friction!).
   - **Fear -> Counter-Message -> Required Proof Map:** Pair the top 3 buyer anxieties (hidden fees, shoddy work, slow turnaround, lock-in) with the exact verified proof visible on the site (or flag it `MISSING`!).
3. **Advertising Viability Score (`AVS 0 to 5` - Honest Pre-Spend Reality Check):**
   Score 1 point each (citing evidence or marking `Unknown - verify with client`):
   - **(1) Margin / Deal-Size Headroom:** Can gross profit per customer comfortably absorb paid-search CPCs (check via `python3` if deal size & margin are supplied)?
   - **(2) Search Demand Clarity:** Do buyers actively search Google for this exact solution?
   - **(3) Conversion Path Readiness:** Clear above-the-fold CTA, mobile click-to-call or simple form, no broken dead ends.
   - **(4) Visible Trust & Proof:** Verified reviews, real photos, licenses, guarantees, or named case studies.
   - **(5) Clear Differentiation / Offer:** Concrete hook beyond generic *"quality service since..."* wallpaper.
   - Flag **AVS <= 2/5** honestly as *"Fix offer/page fundamentals before spending heavily on cold paid ads!"*

### Weak 5/10 vs. 10/10 Business Profile

- **Amateur:** *"Acme Plumbing is a premium, trustworthy local business offering comprehensive plumbing solutions. Recommend bidding on 'best plumber near me' and launching PMax."* (Mixes vague fluff with unasked tactical advice, invents "premium", cites zero page evidence, misses gaps.)
- **10/10 Senior:** *"Brand: Acme Plumbing & Drain (`Local Service`, Denver metro - Footer, High). Core offerings: Emergency leak repair, Drain clearing, Tankless water heaters (Nav + Services, High). **Explicitly NOT offered:** Commercial grease traps, septic tanks (FAQ, High -> day-one negatives). Buyer Persona: **Novice/Informed homeowner, Same-hour emergency speed**; top fear = surprise overtime fees (Counter-message on Hero: 'No overtime charges 6AM-10PM', High; Proof: '4.8 stars / 1,840 Google reviews', Hero, High). **Missing gaps to ask client:** starting service-call fee (`NOT DISCLOSED`), average job ticket, target CPL. **AVS: 4/5** (strong demand, proof, urgency, CTA; loses 1 point for hidden call-out pricing). Ready to save into `context.md`."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your profile:
1. **Evidence & zero-fabrication check:** Does every extracted claim cite its exact source section/page, mark missing data plainly as `NOT DISCLOSED` / `Ask Client`, and avoid guessing pricing, margins, or ad spend?
2. **Scope & restraint check:** Did I stay focused on durable business intelligence (offerings, exclusions, 5-dimension buyer persona, AVS 0 to 5) without prematurely dumping generic keyword lists, and give clear follow-up questions for the 2 to 3 highest-impact missing facts?
3. **Human voice & handoff:** Crisp, plain English with zero em dashes or corporate filler. Offer cleanly to save into `landing-pages/<site>/context.md` or route next into `competitor-messaging-analysis`, `keyword-universe-builder`, or `landing-page`.
