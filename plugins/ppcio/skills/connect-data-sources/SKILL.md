---
name: connect-data-sources
description: "Guide the user step by step to connect Google Ads, Google Analytics 4 (GA4), Microsoft Clarity, Meta Ads, Google Search Console, or CRM/call-tracking exports on the fly (30-second CSV path or read-only live MCP/API/Script connection) so landing page audits, CRO rewrites, A/B tests, and client dashboards run on real first-party data instead of guesses. Use whenever someone asks to connect analytics, ad accounts, Clarity, Meta Ads, GA4, or Search Console, or says yes when offered deeper data-backed audits."
---

# Connect Your Data Sources (On the Fly)

Real first-party data turns a good audit into an undeniable one. Instead of guessing why mobile visitors bounce or which ad headline brings weak clicks, pull their actual search terms, mobile vs. desktop conversion rates, scroll depth, and rage-clicks straight into their audits, landing pages, and client dashboards.

Talk in plain human English. Never intimidate a non-technical owner with OAuth jargon. Always offer the **30-second zero-setup path** right beside the **live read-only connection path**, and let them pick whichever fits their comfort level today.

## Start here

- Check if a local `landing-pages/<site>/` folder exists (read `context.md` and `inputs/site-facts.json` first: `site-facts.json` already lists which tags are live on their site, such as `google_ads`, `ga4`, `ms_clarity`, or `meta_pixel`, so only suggest platforms they actually run!).
- If they have not named a platform yet, ask one clear question:
  > "Which data do you want to bring in first (Google Ads, GA4, Microsoft Clarity, Meta Ads, or Google Search Console)? And would you rather: (1) drop in a quick 30-second CSV export right now, or (2) wire up a read-only live connection so I can pull fresh numbers any time?"
- Never block their audit or landing page if they skip this. Work sharply with whatever they already have.

## Platform Playbooks (Load Only What They Pick)

### 1. Google Ads (search terms, ad copy, landing page CPA & ROAS)
- **Why it matters:** Shows the exact words buyers typed before landing on the page (for `lp-message-match`), which campaigns waste spend, and mobile vs. desktop CPA gaps.
- **30-second path:** Google Ads -> **Insights and reports -> Search terms** (last 30 to 90 days) -> Download `.csv`. Optionally also export **Campaigns** (with Compare to previous period) and **Landing pages** `.csv`.
- **Live / automated path:**
  - *Zero-API-token automation:* Use our bundled read-only Google Ads Scripts in `../google-ads-script-creator/scripts-library/` (`01-account-snapshot-export.js`, `02-search-term-ai-ready-export.js`, `07-landing-page-ad-mismatch-detector.js`) to export cleanly to a Google Sheet on schedule.
  - *Live MCP / API:* Guide them to add a read-only Google Ads MCP server in their AI tool (Claude Code `claude mcp add ...`, or the MCP config for Cursor, Windsurf, Antigravity, or Codex) with read-only OAuth credentials stored in local env vars.

### 2. Google Analytics 4 / GA4 (landing page CVR, mobile vs. desktop drop-off)
- **Why it matters:** Pinpoints high-traffic landing pages with low key-event rates and huge mobile vs. desktop gaps (often 2x to 4x worse on phones).
- **30-second path:** GA4 -> **Reports -> Engagement -> Landing page** (last 30 to 90 days) -> click `+` secondary dimension -> **Device category** -> **Share this report -> Download CSV**.
- **Live path:** Read-only GA4 MCP server or Analytics Data API (`analytics.readonly` scope) using their numeric GA4 Property ID (`Admin -> Property details`) and a read-only service account JSON stored outside the repo.

### 3. Microsoft Clarity (rage clicks, dead clicks, scroll depth, quick-backs)
- **Why it matters:** Gives physical proof of buyer friction: non-clickable cards people rage-click, forms abandoned mid-field, and the exact scroll depth where 70% of mobile visitors give up.
- **30-second path:** Clarity -> **Dashboard** (filter to target landing page URL + last 30 days) -> paste headline metrics (**Scroll depth %, Dead clicks %, Rage clicks %, Quick backs %, Mobile vs. Desktop**) or drop a screenshot in chat.
- **Live path (Clarity Data Export API):** Clarity -> **Settings -> Data Export -> Generate new API token** (read-only), save as `CLARITY_API_TOKEN` in `.env` (verified in `.gitignore`), query `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3`. **Quota guardrail:** Clarity caps this API at **10 calls/day**, so always cache the raw JSON to `data/clarity.json` immediately and never loop redundant calls!

### 4. Meta Ads (winning ad hooks, CTR vs. Landing Page View rate vs. leads)
- **Why it matters:** Meta traffic is colder than Search. Comparing Link Clicks vs. Landing Page Views catches slow in-app mobile loads immediately, and seeing top ad hooks fixes opening scent.
- **30-second path:** Meta Ads Manager -> **Ads** tab (last 30 days) -> columns: Spend, Link Clicks, Landing Page Views, Leads/Purchases, Cost per Result, Primary Text / Headline -> **Reports -> Export table data (.csv)**.
- **Live path:** Read-only Meta Ads MCP server or Marketing API system-user token (`ads_read` scope only, stored in `.env`).

### 5. Google Search Console & CRM / Call Tracking
- **Search Console:** Search results -> Filter by Page (last 3 months) -> Export CSV (or read-only `webmasters.readonly` MCP). Great for exact buyer phrasing and SEO-PPC arbitrage.
- **CRM / CallRail / WhatConverts / Hotjar / PostHog:** Even 20 rows of closed-won vs. junk leads (with keyword/source or call-duration >=20s vs. <20s) transforms `lead-gen-quality` and form qualification.

## Distill & Pipe Data Straight Into Every PPC.io Skill

### Amateur 5/10 vs. 10/10 Senior Data Pull
- **Amateur:** Dumps a raw 400-row CSV summary into chat without checking date ranges, tracking inflation, or whether a campaign launched mid-month.
- **10/10 Senior:** Uses `python3` to verify exact totals, checks `days_with_spend` (never dividing 14-day spend by 30), flags suspicious conversion actions (page views or 5s calls counted as leads), caches raw data in `data/`, and writes a tight, factual `landing-pages/<site>/data/analytics-summary.md` (plus paid queries/ads into `ads.md`). Note that `kit.sh brief <site>` automatically feeds `data/analytics-summary.md` and `ads.md` to all 14 Landing Page Studio experts!

## Security, Honesty & Closed-Loop Verification (Run Before Saving)

1. **Read-only first & zero passwords:** Never ask for write/admin permissions or account passwords. Store any token in local `.env` after verifying `.env` is in `.gitignore`, and never copy secrets into `audit/`, `facts.md`, HTML pages, or dashboards.
2. **Sanity-check the pulled numbers:** Verify date window, currency, conversion-lag window (check last-lead date by *conversion date*, not click date), and sample size (`clicks * cvr < 2` is noise, not a trend). Quote zero invented metrics.
3. **Self-critique before handoff:** Does `data/analytics-summary.md` highlight the 2 or 3 real conversion bottlenecks clearly enough that `landing-page`, `client-report-dashboard`, `ppc-strategic-audit`, or `search-term-miner` can act on it immediately? Refine until crisp.
