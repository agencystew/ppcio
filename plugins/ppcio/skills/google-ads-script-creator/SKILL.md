---
name: google-ads-script-creator
description: "Generate production-ready, white-label, GAQL-first Google Ads Scripts that work cleanly on first run, or select and customize from the built-in 21-script agency library. Handles platform limits (30-min / 6-hr MCC, 250K GAQL rows, 400K sheet cells), DRY_RUN safety, and error isolation. Use when someone needs a Google Ads script, automated alert, MCC rollup, or custom data export. Not for one-off CSV audits (use ppc-strategic-audit)."
---

# Google Ads Script Creator (GAQL-First & White-Label)

Most AI-generated Google Ads Scripts crash on first paste because they use deprecated AdWords API methods, slow nested object loops that time out at 30 minutes, row-by-row spreadsheet writes, or unguarded mutations. Your job is to deliver **first-run-clean, white-label, GAQL-first Google Ads Scripts** built for real account and MCC scale, reusing our tested 21-script library whenever it already fits.

## Start here

- **Check the built-in 21-script library FIRST:** Inspect `scripts-library/README.md` (inside this skill folder). It already ships 21 production scripts (`01` through `22`: PMax insights, Make Exact Match Exact, Wasted Spend Forensics, Ad-to-LP Mismatch Detector, Conversion Health Check, Quality Score Tracker, MCC Daily Monitor, and AI-ready exports). If a library script solves the request, customize its `CONFIG` block directly instead of reinventing from scratch!
- For custom scripts, read [references/script-templates.md](references/script-templates.md) for the exact white-label header, `CONFIG` block, GAQL + fallback skeleton, batched Sheets writer, and MCC parallel/resumable patterns.
- Check `landing-pages/*/context.md` if present for account context. Ask only what is missing: single account or MCC scale, output destination (Google Sheet / Email / Slack / Logger), and exact trigger thresholds.

## First-Principles Engineering Standards (And Why They Prevent Crashes)

1. **GAQL-First Architecture (10x to 50x Faster):** Always query `AdsApp.search(query)` against modern Google Ads API tables (`campaign`, `keyword_view`, `search_term_view`, `ad_group_ad`, `campaign_criterion`) instead of nested `AdsApp.campaigns().get()` loops. Wrap GAQL in `try/catch` with clean error logging or a standard fallback so partial schema quirks never fail silently.
2. **Write Operations Safety (Non-Negotiable):**
   - Every script that pauses, edits bids/budgets, or adds negatives MUST ship with **`DRY_RUN: true` by default** so the operator verifies every planned mutation in Preview logs before flipping it live!
   - Create any new entities in `PAUSED` state, never delete historical data, and never hardcode customer IDs, webhook secrets, emails, or thresholds inside function bodies (keep 100% of knobs inside top-level `CONFIG`).
3. **White-Label by Default:** Put the user's own agency or team name in the header, sheet title, and alert subjects (never hardcode third-party vendor branding unless the user explicitly asks).
4. **Enforce Hard Google Ads Script Limits Automatically:**
   - **Timeouts:** 30 min standard / 30 min per account (`executeInParallel`, max 50 accounts) / 6 hr sequential MCC. Check elapsed time every 500 rows and exit gracefully at 25 min (use `PropertiesService` checkpoints for 100+ account MCCs).
   - **Data & Sheets:** 250K GAQL rows, 400K cells per write, 10M workbook cells. Always **batch spreadsheet writes** in chunks of 500 rows (`setValues()`), never `appendRow()` inside a loop!
   - **Zero-crash hygiene:** Convert `cost_micros / 1000000` cleanly, guard division by zero (`clicks > 0`), handle empty result sets gracefully, and isolate per-account errors inside MCC loops so one bad account never aborts the run.

### Weak 5/10 vs. 10/10 Script Delivery

- **Amateur:** Uses `AdWordsApp.keywords()`, loops `sheet.appendRow()` inside nested `while` loops, hardcodes `cost > 50` (forgetting micros = `50000000`), omits `DRY_RUN`, and immediately pauses keywords live on first run.
- **10/10 Senior:** Checks `scripts-library/` first; if custom, delivers a single copy-pasteable white-label script with `CONFIG.DRY_RUN = true`, `CAMPAIGN_NAME_CONTAINS` / `EXCLUDES`, GAQL `search_term_view` query dividing `costMicros / 1000000`, 500-row batched `setValues()`, 25-minute time guard, empty-data fallback, and exact Preview-first verification steps (plus rollback guidance for any mutation script).

## Closed-Loop Code Verification & Self-Critique (Run Before Answering)

Before handing over any script, audit your own code like a senior code reviewer:
1. **API & math sanity check:** Zero deprecated `AdWordsApp` calls, zero invented GAQL field names (verify field names against standard Google Ads API v17+ / `references/script-templates.md`), exact `costMicros / 1000000` conversion, and zero divide-by-zero risks (`impressions === 0` or `clicks === 0`). If shell access is available, run `node --check` on a quick syntax check of the generated JS so a stray bracket never breaks first paste!
2. **Safety & restraint check:** Is `DRY_RUN: true` enforced for every mutation? Are all thresholds in `CONFIG` with white-label defaults, batched Sheets writes, 25-minute timeout checks, and a Preview-before-Live rollout note?
3. **Human voice & handoff:** Crisp setup instructions (paste, edit `CONFIG`, click Preview, verify logs, schedule) with zero em dashes or filler. Mention `connect-data-sources` if they prefer live read-only MCP/API analysis instead of scheduled Sheets scripts.
