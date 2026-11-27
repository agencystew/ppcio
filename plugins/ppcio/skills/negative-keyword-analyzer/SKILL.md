---
name: negative-keyword-analyzer
description: "Quick triage for small pasted search-term tables (under 50 rows) when you need fast waste categorization, match-type selection, and synonym-safe negative keywords without a full CSV export. Use when someone pastes a short list of search queries in chat. For full 30-90 day Google Ads CSV exports over 50 rows, use search-term-miner instead."
---

# Negative Keyword Analyzer (Quick Small-Table Triage)

When a user pastes 10 to 50 search queries straight into chat, they want fast, sharp judgment that stops obvious waste without accidentally blocking profitable buyers. If they attach a full CSV export (>50 rows), route straight to `search-term-miner` so our Python n-gram miner and simulator prove every single negative mathematically.

## Start here

- Check for a local `landing-pages/*/context.md` first so you know their exact services, synonyms, service area, and target CPA/ROAS.
- If they have not shared their business model or target CPA/ROAS, ask one crisp question OR flag obvious non-buyer waste now (jobs, DIY, schools, wrong country) while holding ambiguous commercial queries on a **Watch / Confirm** list until targets are confirmed.
- If they have a full Google Ads account and want deeper waste hunting, offer `search-term-miner` or `connect-data-sources` (or bundled script `05-negative-keyword-gap-finder.js`).

## First-Principles Negative Rules (Mechanical Before Magical)

1. **Core-service & synonym shield:** Never negate a word that describes what they sell or how normal buyers abbreviate it (`"lipo"`, `"ac"`, `"boiler"`). Negate only the disqualifying modifier (`"salary"`, `"course"`, `"youtube"`, `"manual"`).
2. **Whole-word matching reality (kill common myths):**
   - Google Ads broad negatives match whole words only: adding `bar` does NOT block `barn`, and adding `free` does NOT block an ad headline saying `"Stress Free"`.
   - Google Ads negatives do **NOT** auto-match plurals, typos, or close variants! If you exclude `"course"`, explicitly include `"courses"` too.
   - Use **Exact `[term]`** when only that exact phrasing is bad (or for routing cross-campaign cannibalization); **Phrase `"term"`** when the word order defines the bad intent; **Broad `term`** only for universally toxic modifiers (`jobs`, `salary`, `diy`, `reddit`, `pdf`, `login`, `wiki`) checked carefully against converting queries.
3. **Intent nuance over blunt bans:**
   - Separate *early research questions* (`"how much does X cost"`) from *buying-stage price terms* (`"X pricing near me"`).
   - Competitor terms typically run **2x to 3x CPC at 50% to 70% CVR (3.5x to 4x CPA)**; only keep competitor queries if intentionally running a dedicated competitor campaign with comparison landing pages.
4. **Sample-size restraint (`expected_leads < 2`):** A relevant-looking query with 4 clicks and 0 conversions is noise, not waste. Put it on the **Watch List** instead of killing future revenue.

### Weak 5/10 vs. 10/10 Quick Triage

- **Amateur:** Puts `free`, `cheap`, `cost`, and `repair` into one account-level broad list from a 25-row paste without checking plurals or whether any row converted.
- **10/10 Senior:** Splits the 25 queries cleanly into (1) **Safe to Exclude Now** (with exact match syntax + plural pairs + campaign vs. account level + exact spend saved), (2) **Keep / Converting** (explicitly protecting high-intent price/service queries), and (3) **Watch List** (low-click commercial queries below noise floor), plus one line noting any cross-campaign routing conflicts.

## Closed-Loop Self-Critique (Run Before Answering)

Before sending your negative list (draft only for human approval, with a 14-day impression/CPL check as a rollback guardrail):
1. **Safety trap check:** Scan every proposed negative against EVERY converting query and core service synonym in the pasted table. Would any broad or phrase negative accidentally block a good search?
2. **Math & plural check:** Verify exact wasted spend summed across excluded rows (zero invented numbers) and add missing singular/plural variants.
3. **Plain human voice:** Clear, scannable, zero em dashes, zero fluff. Suggest `search-term-miner` when they are ready to run a full 90-day CSV simulation.
