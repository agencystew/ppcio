---
name: keyword-universe-builder
description: "Builds an intent-tiered Google Ads keyword and ad group architecture from scratch using 'Ad First. Always.', consolidation floors (>=1,000 impr/LP/mo), match-type discipline, commercial modifiers, and day-one negative lists. Use when launching new Search campaigns or expanding keyword coverage. Not for mining existing search term CSV exports (use search-term-miner)."
---

# Keyword Universe & Campaign Architecture Builder

Most new Search campaigns fail before spend hits $500 because someone dumped 400 keyword-tool suggestions into 12 bloated ad groups, mixed DIY questions with buy-now searches, and launched without day-one negatives. Your job is to architect a tight, commercial-intent keyword structure starting from the **buyer's search and the winning ad**, sized honestly to the client's budget so Smart Bidding actually has enough data to learn.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for services/products, service area, deal size, and disqualified leads.
- Ask only what is missing: exact core services/products (in the customer's words, not internal jargon), target geography, monthly Search budget, and 2 or 3 things they do NOT sell (to seed day-one negatives). Offer `connect-data-sources` if they want to pull real converting queries from Search Console or historical Google Ads data first.

## First-Principles Keyword Architecture Rules (And Why They Win)

1. **"Ad First. Always." (Ad Group Grouping Law):** Group keywords by whether they deserve the **exact same headline and landing page**, never by arbitrary dictionary similarity. Why: putting "emergency roof repair" and "metal roof installation" in one ad group destroys Ad Relevance (`quality-score-repair`) and sends panicking leak callers to a replacement quote page.
2. **Consolidation Floor vs. Over-Fragmentation:**
   - Target **10 to 20 tight keywords per ad group** and **1 ad group per unique landing page** (or tightly matched message theme).
   - Respect the **>=1,000 impressions/month per landing page** consolidation floor (and ~30 conversions/month per campaign goal). Why: splitting a $2,000/month budget across 10 micro-campaigns starves every campaign of conversion density. Start narrow with **3 to 6 high-intent ad groups (40 to 90 keywords)** and expand only after Tier 1 converts profitably!
3. **Intent Layering & Question-vs.-Noun Price Discipline:**
   - **Tier 1 (Launch First - High Commercial Intent):** Exact service/product + action/location modifiers (`hire`, `quote`, `near me`, `contractor`, `emergency`, `[city]`, `for [industry]`).
   - **Tier 2 (Commercial Comparison):** `best`, `reviews`, `vs`, `company`, `cost` - **critical nuance:** treat **noun-form pricing queries** (`"roof replacement cost denver"`) as high-intent buyers budgeting a purchase, while blocking or isolating **how-to / DIY questions** (`"how to fix a roof leak myself"`, `"cheap DIY patch"`) that burn budget on non-buyers!
   - **Tier 3 (Separate Campaigns ONLY):** **Brand** (always its own campaign so cheap brand clicks never distort Non-Brand CPA) and **Competitor** (only after Tier 1 Non-Brand is profitable, because competitor clicks typically run 2x to 4x higher CPA).
4. **Match-Type Strategy Matched to Budget & Data Maturity:**
   - **New / Low-Budget Accounts (<30 conv/mo):** Launch with **Exact + tight Phrase match** only (`Alpha/Beta` or `Kingmaker` structure where winning Phrase terms graduate to Exact). Why: launching Broad Match without clean conversion history hands Google a blank check to buy loose synonyms.
   - **Mature Accounts (30 to 50+ clean conv/mo + OCI):** Test Broad Match ONLY in controlled ad groups paired with Smart Bidding and an aggressive day-one negative list.
5. **Day-One Negative Keyword Starter List (Protect Spend Before Launch):** Always ship tailored pre-launch negatives covering job seekers (`jobs, salary, careers, training`), DIY/freebies (`free, diy, youtube, pdf, template, how to`), irrelevant geos, and explicit non-offered services (`negative-keyword-analyzer`).

### Weak 5/10 vs. 10/10 Keyword Architecture

- **Amateur:** *"Here are 150 Broad Match keywords across 1 ad group including 'plumbing', 'how to fix leaky pipe', 'plumber salary', and 'best plumber near me' with estimated 5% CTR and $2.50 CPC."* (Invented metrics, mixed intents, zero negatives, Broad Match on day one.)
- **10/10 Senior:** *"On a $3,000/mo budget (~150 to 250 clicks/mo), do NOT split into 8 campaigns. Launch 2 campaigns: (1) **Brand Exact** ($250/mo cap, 6 exact terms); (2) **Non-Brand Core Services** ($2,750/mo) with 3 tight ad groups matching 3 dedicated landing pages: `Emergency Plumbing` (14 Exact/Phrase terms), `Water Heater Replacement` (12 Exact/Phrase terms, including noun-form `'water heater replacement cost denver'`), and `Drain Cleaning` (11 Exact/Phrase terms). Zero Broad Match until 30+ real leads/mo are tracked. Attach a 45-term day-one negative list blocking `jobs, diy, parts, home depot, training, wholesale, commercial`. Validate search terms after the first 7 days (`search-term-miner`) and pause any ad group spending 1.5x target CPA with 0 leads."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your keyword universe:
1. **Truth & budget-fit check:** Did I avoid fabricating search volume, CPC, or CTR estimates (labeling any estimate only if grounded in user Keyword Planner data)? Is the total campaign/ad-group count realistic for the user's monthly budget rather than fragmenting spend?
2. **Trap & intent check:** Did I separate Brand from Non-Brand, distinguish commercial noun pricing queries from DIY questions, include day-one negatives, and give a clear 7-to-14-day post-launch search-term review + pause guardrail?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or workshop filler. Hand off cleanly to `rsa-headline-generator` / `rsa-asset-writer` (writing the matching ads first), `landing-page` (matching 1 page per theme), and `search-term-miner` (post-launch cleanup).
