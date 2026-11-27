---
name: rsa-headline-generator
description: "Rapidly brainstorm high-converting Google Ads RSA headlines (<=30 chars) and descriptions (<=90 chars) across 8 direct-response angles when you have no existing ad CSV or facts file yet. Use when someone wants quick RSA ideation or new campaign drafts. Not for linting real account ads against a verified facts sheet and CSV export (use rsa-asset-writer instead)."
---

# RSA Headline & Description Workshop ("Ad First. Always.")

Write search ads *before* copying competitor mediocrity. When someone launches a new campaign or wants fresh direct-response angles fast without a CSV export, form a sharp hypothesis about what makes their best buyer click (and what disqualifies time-wasters), then write normal human search ads that respect strict 30/90 character limits and match the landing page cold.

## Start here

- Check if a local `landing-pages/*/context.md` or `facts.md` exists first so you pull real prices, locations, reviews, and offers rather than guessing.
- If they have not given you verified proof (reviews, years, pricing, turnaround time), ask for 2 or 3 real facts OR draft clearly marked verified angles now and flag the exact 1 or 2 real numbers that would make the proof headlines twice as strong. Never invent fake ratings, discounts, or guarantees!
- If they want strict automated CSV/facts-sheet linting on an existing account, point them to `rsa-asset-writer`.

## First-Principles Direct-Response RSA Rules (And Why They Win)

1. **8 Distinct Buying Angles (15 Headlines, <=30 chars each):** Spread across (1) Exact Keyword + Location, (2) Concrete Outcome, (3) Offer / Price Pre-Qualifier, (4) Verified Proof, (5) Speed / Convenience, (6) Objection Handler / Risk Reversal, (7) Differentiator (what competitors skip), and (8) Direct Call to Action. Why: Google pairs headlines dynamically, so repeating the same claim in swapped words produces redundant ads and wastes auction slots.
2. **45-Character Mobile Front-Load (4 Descriptions, <=90 chars each):** Put the sharpest promise or price in the first 45 characters so mobile truncation never hides the point. Cover 4 distinct jobs: Offer + Proof, Objection + CTA, Process/Speed, and Local/Hours.
3. **Mixed headline lengths:** Combine short punchy headlines (12 to 18 chars) with full-width lines (24 to 30 chars) so Google assembles clean pairs without awkward clipping.
4. **Pre-qualify ruthlessly (CTR vs. CVR trade-off):** Putting a real starting price ("From $1,500") or buyer filter ("For B2B Teams 20+") often lowers vanity CTR while lifting conversion rate and lead quality. Why: filtering out bargain hunters before they click saves real ad spend.
5. **Kill corporate filler:** Zero em dashes, zero buzzwords ("Premier", "Best-In-Class", "Trusted Excellence"), and zero generic slogans a competitor could copy unchanged.
6. **Smart pinning & Ad Customizers:** Keep pins blank by default so Google can test combinations; pin 2 to 3 variants to H1 only for strict legal/compliance needs. Mention `{LOCATION(City)}` or `{=COUNTDOWN(...)}` only when genuinely useful.

### Weak 5/10 vs. 10/10 RSA Draft

- **Amateur:** `Best Roofers In Town` (20) / `Quality Roofing Solutions` (25) / `Call Our Expert Team Today` (26) / `We deliver unmatched roofing excellence with turnkey tailored solutions for every homeowner.` (92 - OVER 90 CHARS, generic filler!)
- **10/10 Senior:** `Denver Roof Replacement` (23) / `Installed in 1 to 2 Days` (24) / `4.8 Stars - 1,400+ Reviews` (26) / `Free Written Roof Quote in 30 Min. Licensed local crew, lifetime workmanship warranty.` (86 chars, verified, human, front-loaded.)

## Closed-Loop Verification & Self-Critique (Run Before Answering)

Before sending your draft, run this 3-pass check and recommend testing against the existing control ad for 14+ days / 1,000+ impr before pausing winners (restraint + rollback guardrail):
1. **Exact character count check via `python3` (never eyeball!):** Verify every headline is `<=30` characters and every description is `<=90` characters programmatically when shell access is available (or verify character-by-character).
2. **Zero-fabrication & landing-page scent check:** Confirm zero invented claims, prices, or reviews, and verify every headline promise actually appears on the landing page's first screen (`lp-message-match`).
3. **Random combination read-aloud:** Pair 3 headlines + 2 descriptions randomly. If any pair repeats the same fact or sounds like an AI brochure, rewrite it until it sounds like a sharp human ad. Offer to run `rsa-asset-writer` for formal CSV linting or `connect-data-sources` to pull winning search terms first.
