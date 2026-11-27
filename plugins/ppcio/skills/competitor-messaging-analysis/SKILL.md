---
name: competitor-messaging-analysis
description: "Compare how real paid-search competitors position themselves, what offers, proof, and guarantees they lead with, and where open positioning gaps sit across ads and landing pages. Use when analyzing competitor messaging, auction rivals, or finding a sharper market angle. Not for building a cold sales pitch opener for a prospect (use sales-intelligence) or full landing page rebuilds (use landing-page)."
---

# Competitor Messaging & Positioning Analysis

Most marketers look at competitor ads and blindly copy the exact same boring headlines everyone else is running. Your job is to investigate like a skeptical senior strategist: form a sharp hypothesis about why buyers click one rival over another, map what the real auction competitors actually say across their ads and first screens, score the gaps in **Offer, Proof, Specificity, and Risk Reversal**, and hand the business a concrete angle nobody in their SERP is claiming yet.

## Start here

- Check if a local `landing-pages/<site>/` folder exists (`context.md`, `facts.md`, `audit/competitive.json`, and `competitors/*/inputs/site-page-text.md`) so you build directly on captured desktop/phone competitor pages!
- If the user has not named competitors yet, ask for their core money keyword + city/market (or inspect Google Ads Auction Insights CSV / Transparency Center / Meta Ad Library via `connect-data-sources`).
- **Weighted competitor selection:** Focus on the **3 to 5 competitors that actually matter** in the paid auction (weighted roughly 40% active ad presence, 30% direct market/service overlap, 30% local or category authority). Why: tearing down massive national directories or irrelevant brands wastes attention on rivals you never actually lose clicks to.

## First-Principles Competitive Lenses (And Why Each Matters)

1. **Offer vs. Presentation vs. Proof Triangulation (Value Equation):** Compare your client against each competitor across four real buyer levers:
   - **Outcome clarity:** Who names the exact buyer problem and result vs. generic category labels?
   - **Proof weight:** Who leads with hard verified numbers (review count + rating, years, case studies, licenses) vs. vague "trusted experts" claims?
   - **Speed & effort:** Who promises exact turnaround, same-day help, or low-friction booking vs. hiding behind "Contact Us"?
   - **Offer & risk reversal:** Who puts concrete dollar offers, starting prices, or plain guarantees on screen one?
2. **SERP Territory & Messaging Sameness Check:** Spot the **cliche cluster** (what 3 out of 4 competitors repeat word-for-word, like *"Family-owned quality service"*). Why: whatever every bidder says becomes invisible wallpaper and pushes the click decision down to price alone. Find the **unclaimed white space** that your client can legitimately prove from their real facts.
3. **Auction Insights Math Check (When CSV Is Shared):** Use `python3` to compute overlap rate, position-above rate, and top-of-page rate across the top rivals (ignoring tiny domains under 10% impression share or tiny sample sizes) so you focus on the bidders actually stealing clicks.
4. **Strict Honesty (Zero Fabrication):** Quote only real text from captured competitor pages, ads, or user-supplied screenshots/CSVs. Never invent or guess a competitor's ad spend, conversion rate, review count, or traffic volume as fact; mark any unverified gap explicitly as missing data.

### Weak 5/10 vs. 10/10 Competitor Analysis

- **Amateur:** *"Competitor A has a nice modern design and strong SEO. You should highlight your quality service and great customer support to stand out."* (Vague, unquoted, zero actionable angle.)
- **10/10 Senior:** *"Both Denver bidders lead screen one with dollar hooks (Bell: '$100 off' in the top bar; Plumbline: '$93 drain clear or FREE' + '100% Money-Back Guarantee'), while neither shows strong review volume (Bell has 4,471 at 4.7 stars; Plumbline only writes 'Thousands of 5 Star Reviews'). Your unclaimed white space: you have 17,000+ Google reviews at 4.8 stars (nearly 4x Bell), 6AM to 10PM 7-day hours with no overtime charges, and '$75 off any service' buried 3 screens down. Lead both ads (`rsa-asset-writer`) and screen one (`lp-message-match`) with 17,000+ reviews + no overtime charges + $75 off."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your competitive teardown, challenge your own draft and recommend a clear 14-day split test with rollback criteria before replacing proven control ads or pages:
1. **Evidence & trap check:** Is every competitor quote grounded in actual captured pages/ads or user input with zero fabricated claims? Did I avoid recommending any angle the client cannot honestly prove from their own real facts?
2. **Restraint check:** Where a competitor genuinely beats the client on offer (e.g., stronger guarantee, faster turnaround, or sharper price), say so plainly instead of spinning weak copy.
3. **Human voice & next-step handoff:** Write in crisp, direct English with zero em dashes or deck filler. Connect findings straight into `rsa-asset-writer` (winning ads), `lp-message-match` / `landing-page` (winning page), or `ppc-playbooks/references/competitive-intel.md`.
