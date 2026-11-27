---
name: pmax-health-check
description: "Diagnose whether Performance Max is generating real incremental conversions or cannibalizing Brand Search and remarketing, quantify true non-brand economics, and deliver a clear Keep, Fix, or Kill verdict (plus Standard Shopping migration path when appropriate). Use when someone shares PMax data or asks whether PMax is working. Not for general Search-only audits (use ppc-strategic-audit)."
---

# Performance Max (PMax) Health Check

Performance Max reporting is built to look flattering. Your job is to separate **real incremental profit** from **attribution theater** (stealing cheap Brand Search clicks, harvesting remarketing, or chasing junk lead forms) and give the advertiser an honest **Keep, Fix, or Kill** decision backed by real arithmetic.

## Start here

- Check for a local `landing-pages/*/context.md` first for business model (ecommerce vs. lead gen vs. local SMB vs. B2B), margins, and target CPA/ROAS.
- Ask in one line if data is missing: *"In Google Ads, open Campaigns (last 30 to 90 days, ideally comparing pre-PMax vs. post-PMax), include Campaign type, Cost, Conversions, Conv. value, and Conv. value / cost, Download .csv and drop it here (plus your PMax Search Term Insights if you have them). Or ask me to help pull it via `connect-data-sources`."*

## First-Principles PMax Diagnostic (Challenge Assumptions First)

Run exact calculations via `python3` on CSV exports; never eyeball incremental ROAS or brand shares.

1. **Qualification & Business-Model Reality Check:**
   - **Lead Gen WITHOUT verified CRM / Offline Conversion Import (SQL/Closed-Won):** High risk of spam/junk form optimization on Display and YouTube. Even if the campaign is already running, **quantify the real damage** (`surface CPA / real close rate = true customer cost`, e.g., $50 form CPL at 5% close rate = $1,000 true acquisition cost vs. Search at $200) rather than just saying "stop PMax."
   - **Local trades / urgent SMBs (<30 real leads/mo):** Standard Search + Local Services Ads almost always beat PMax because PMax burns thin budgets on low-intent placements.
   - **B2B sales cycles:** 3+ months = high risk; 6+ months = usually unsuitable because attribution lag breaks automated bidding.
   - **Volume floor:** Below ~50 purchases/month (ecom) or ~30 qualified leads/month (lead gen), PMax lacks enough signal to learn cleanly.
2. **Brand Cannibalization & Incremental ROAS Subtraction (Check FIRST):**
   - PMax reporting 500% to 800%+ ROAS is almost always soaking up Brand searches and existing buyers.
   - **Incremental math:** `Incremental PMax Conversions = Reported PMax Conversions - Brand Search Conversion Drop (pre vs. post launch)` (or strip brand search categories directly).
   - **The Paused Brand Campaign Anti-Pattern:** If the advertiser paused their Brand Search campaign when turning on PMax, warn them plainly that they destroyed the baseline needed to measure cannibalization and handed Google a blank check to claim $0.80 brand clicks at PMax CPAs.
   - Never recommend scaling a cannibalized PMax budget; scaling it just pays extra for customers already searching your name.
3. **PMax vs. Standard Shopping Path (Ecommerce):**
   - If PMax over-indexes on Display/YouTube remarketing or hides margin differences across SKUs, evaluate a controlled **PMax to Standard Shopping Pareto 80/20 migration** (Bestsellers Shopping + Catch-All Shopping + Branded Shopping + clean Product-ID remarketing, pausing PMax cleanly so attribution does not double-count; see `ecommerce-shopping-builder` and `ppc-playbooks/references/performance-max.md`).
4. **Asset Group & Feed Hygiene (Only if PMax Qualifies):**
   - Treat Google's "Low/Good/Best" asset labels as relative internal rankings, never ground truth. Do not churn assets with under 30 days or <1,000 impressions.
   - Verify Brand Exclusions, URL Expansion / Final URL exclusions (block `/blog`, `/careers`, `/login`, `/account`), and clean Shopping feed titles/margins (`ecommerce-shopping-builder`).

### Weak 5/10 vs. 10/10 Senior Verdict

- **Amateur:** *"Your PMax ROAS is 6.2x, which beats your 4.0x target! Add 5 more videos and raise budget 25% to scale."* (Walked straight into Brand cannibalization and recommended scaling wasted spend.)
- **10/10 Senior:** *"Verdict: FIX BEFORE SCALING (Brand Cannibalization). PMax reports $48,000 revenue on $7,700 spend (6.2x), but your Brand Search conversions fell by 142 orders ($26,400 revenue) the exact month PMax launched. Subtracting stolen Brand drops true incremental PMax ROAS to 2.8x (below your 3.5x break-even). Move 1: Apply Brand Exclusions to PMax and restore exact-match Brand Search. Move 2: Run the PMax Insight Engine script (`google-ads-script-creator`, script `21-pmax-insight-engine.js`) to inspect Shopping vs. Display/Video spend split. Recheck incremental Non-Brand ROAS after 21 days before deciding Keep vs. Standard Shopping migration."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your **Keep / Fix / Kill** verdict:
1. **Trap & restraint check:** Did I check Brand drop and total account lift (not just PMax's own row)? If PMax is genuinely hitting incremental Non-Brand targets with clean Brand Exclusions and verified CRM/revenue data, say **KEEP** clearly and protect it!
2. **Math & honesty check:** Are all incremental calculations grounded strictly in the user's export with zero invented figures? Flag `few_data` when sample size is too thin (<30 conversions or <30 days) and respect conversion lag (`conversion-lag-check`).
3. **Human voice & guardrail check:** Plain, direct English with zero em dashes or filler. Include clear rollback guardrails (e.g., revert or shift to Standard Shopping if Non-Brand ROAS holds below break-even after 21 days) and point to `21-pmax-insight-engine.js` or `lead-gen-quality` when relevant.
