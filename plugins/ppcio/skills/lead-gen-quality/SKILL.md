---
name: lead-gen-quality
description: "Causal diagnostic for Google Ads lead generation accounts plagued by spam, unqualified leads, or low close rates: audits the 5-link lead-quality spiral (ads, search terms, geo, price anchor, form friction), fixes Primary conversion signal pollution, and designs offline conversion import (OCI) feedback loops. Use when leads are coming in but sales says lead quality is poor. Not for auditing landing page visual layout (use landing-page)."
---

# Lead-Gen Quality & Junk Lead Fixer

Most lead-gen advertisers celebrate a falling Cost Per Lead while sales complains that 80% of inquiries are broke, out-of-area, or spam. Smart Bidding is not broken; it is obeying the cheapest conversion signal you handed it. Your job is to investigate like a skeptical senior growth operator: form a clear hypothesis across the **entire 5-link chain** from search query to closed deal, calculate real **Cost Per Qualified Lead / Cost Per Sale**, stop junk at the door without destroying good volume, and wire closed-pipeline data back into Google Ads.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for offer, minimum project/deal size, service area, and sales process.
- **Zero fabrication & restraint:** Never invent close rates, spam percentages, or pipeline values; never add heavy form friction blindly to an account already starved for qualified leads (<15/mo) without testing first.
- Ask only what is missing: current Primary conversion actions, raw CPL, approximate **qualified rate & close rate**, minimum profitable deal size, and what CRM they use (HubSpot, Salesforce, ServiceTitan, CallRail, spreadsheet). Offer `connect-data-sources` if they want to pull Search Terms + campaign metrics first.

## First-Principles Lead-Quality Diagnostics (And Why Each Link Fails)

Run exact funnel math in `python3` or explicitly (`True Cost Per Sale = Surface CPL / (Qualified Rate x Close Rate)`). A $45 lead closing at 5% ($900/sale) loses badly to a $110 lead closing at 25% ($440/sale)!

1. **Audit the 5-Link Lead-Quality Spiral (Inspect ALL 5 Before Guessing):**
   - **Link 1 - Ad Copy & Forgotten Remarketing Ads:** Are active Search or old Remarketing/PMax ads still promising "affordable", "cheap", "free quote", or missing minimum project/B2B qualifiers? Fix with pre-qualifying ad copy (`rsa-asset-writer`).
   - **Link 2 - Search Terms & Network Leaks:** Check for missing DIY/bargain/job negatives (`search-term-miner`), **Search Partners** or **Display Expansion** left ON (classic spam-bot magnets!), or PMax running without strong negatives/brand exclusions (`pmax-health-check`).
   - **Link 3 - Geo & Presence Leaks:** Confirm location targeting is set to **"Presence: People in or regularly in your targeted locations"** (NOT "Presence or interest", which imports out-of-area researchers).
   - **Link 4 - Zero Price Anchor on the Landing Page:** Hiding starting prices or minimum budgets invites price-shocked tire-kickers to fill out the form just to find out what it costs (`lp-buyer-objections`, `landing-page`).
   - **Link 5 - Zero Qualification Friction on the Form:** A 3-field Name/Email/Phone form with optional budget lets anyone submit. Adding 1 or 2 smart qualifiers (e.g., **required budget range / project scope / timeline** or a 2-step form) cuts junk leads sharply while lifting real close rate.
2. **Clean the Conversion Signal (Real-Lead Taxonomy):**
   - Audit Primary conversions (`conversion-tracking-planner`): only real buyer intent belongs in Primary (completed qualified forms, bookings, and **answered ad calls `>=20s`**, tracking `over_120s` as your booked-job proxy!). Demote 5-second calls, repeat callers, `tel:` button clicks, and page views to Secondary immediately.
   - **Conversion Sequencing Law:** Wait **7 full days** after cleaning Primary conversions before changing bid strategies or targets!
3. **Wire the Offline Conversion Import (OCI) Feedback Loop:**
   - Capture `GCLID` / `GBRAID` / `WBRAID` in hidden form fields (and call tracking via CallRail/WhatConverts) into the CRM.
   - Import **Qualified Lead (SQL)** and **Closed-Won** stages back to Google Ads with expected revenue values (`Avg Deal Size x Stage Close Rate`). Why: SQLs happen faster (within days) so Smart Bidding gets enough volume (30+/mo) to optimize away from junk without waiting 90 days for closed deals.

### Weak 5/10 vs. 10/10 Lead-Quality Plan

- **Amateur:** *"Add a CAPTCHA to your form, raise your negative keywords, and ask Google support to refund spam clicks."* (Treats symptoms, misses the 5-link spiral, ignores Smart Bidding's corrupted signal.)
- **10/10 Senior:** *"Your $38 surface CPL looks great until sales math shows a 12% qualified rate ($317 true CPQL). Four concrete leaks found: (1) Search Partners + Display Expansion are ON (41% of leads, 0 SQLs - turn OFF today); (2) Location is set to 'Presence or interest' (19% out-of-state leads - switch to Presence only); (3) Your landing page hides your $8,000 project minimum and leaves Budget optional on the form - add a plain starting-price anchor on screen one (`lp-buyer-objections`) + required project-size dropdown; (4) Demote `Tel_Button_Click` from Primary to Secondary, wait 7 days, then start uploading HubSpot SQLs via GCLID (`$1,200` stage value = `$6,000 deal x 20% close rate`). Track CPQL weekly for 21 days; rollback form friction only if qualified lead volume (not raw form fills!) drops >25%."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your lead-quality overhaul:
1. **Math & zero-fabrication check:** Did I calculate true CPQL / Cost Per Sale using only user-supplied numbers (never inventing close rates or spam percentages) and inspect all 5 links rather than blaming just the form?
2. **Sequencing & guardrail check:** Did I enforce the 7-day Conversion Sequencing Law between tracking cleanup and bid edits, distinguish raw form-fill drops (good when junk falls!) from qualified-lead drops, and include a clear 14 to 21-day rollback check?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or workshop filler. Link naturally to `conversion-tracking-planner` (tag cleanup), `search-term-miner` (query waste), and `lp-buyer-objections` (price anchoring and objection handling).
