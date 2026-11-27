---
name: connect-data-sources
description: "Help the user connect Google Ads, Google Analytics 4 (GA4), Microsoft Clarity, Meta Ads, Google Search Console, or CRM/call-tracking exports on the fly so landing page audits, CRO rewrites, A/B tests, and client dashboards use real search terms, conversion rates, scroll drop-offs, and rage-click data instead of guessing. Use whenever someone asks to connect their analytics, ad account, Clarity, Meta Ads, GA4, Search Console, pull live data, or says yes when offered deeper data-backed audits."
---

# Connect Your Data Sources (On the Fly)

Real first-party data turns a good audit into an undeniable one. Instead of guessing why mobile visitors bounce or which ad headline brings the wrong clicks, pull their actual search terms, conversion rates, scroll depth, and rage-clicks straight into their audits, landing pages, and client dashboards.

Talk in plain English. Never intimidate a non-technical business owner with OAuth jargon. Always give them the **30-second zero-setup path** first alongside the **live connection path**, and let them pick whichever feels easier right now.

## 1. Ask one quick question (if they have not already named a platform)

Ask once:
> "Which data do you want to bring in first — **Google Ads**, **GA4 (Google Analytics)**, **Microsoft Clarity**, **Meta Ads**, or **Google Search Console**? And would you rather:
> 1. **Quickest (30 seconds):** export one CSV or paste a snapshot right now, or
> 2. **Live connection:** wire it up read-only so I can pull fresh numbers for you any time?"

Never block their audit or landing page if they skip this. Carry on with whatever they already have.

## 2. Platform playbooks (pick only the platform they chose)

### Google Ads (search terms, ad copy, landing page CPA & ROAS)
- **Why it makes landing pages much better:** Shows the exact words buyers typed before landing on the page (for `lp-ad-match`), which campaigns waste spend, and mobile vs. desktop CPA gaps.
- **30-second path:**
  1. Open Google Ads → **Insights and reports → Search terms** (last 30–90 days) → Download `.csv`.
  2. Optionally also export **Campaigns** (with Compare to previous period) and **Landing pages** → Download `.csv`.
  3. Drop the files here (or into `data/`).
- **Live / automated path:**
  - **No API token required (easiest automation):** Use our bundled AI-ready export scripts in `google-ads-script-creator/scripts-library/` (`01-account-snapshot-export.js`, `02-search-term-ai-ready-export.js`, or `07-landing-page-ad-mismatch-detector.js`) — paste into Google Ads → Tools → Scripts, run read-only to a Google Sheet, and pull/export cleanly on schedule.
  - **Live MCP / API connection:** Guide them through adding a read-only Google Ads MCP server (in Claude Code: `claude mcp add ...`; in Cursor / Windsurf / Antigravity / Codex: add the MCP entry to that app's MCP config) using a read-only OAuth credential or MCC developer token stored strictly in local environment variables.

### Google Analytics 4 — GA4 (landing page conversion rate, mobile vs. desktop drop-off, engagement)
- **Why it makes landing pages much better:** Pinpoints exact landing pages with high traffic and low key-event rates, huge mobile vs. desktop conversion gaps, and where visitors exit.
- **30-second path:**
  1. Open GA4 → **Reports → Engagement → Landing page** (last 30–90 days).
  2. Click the `+` secondary dimension button → add **Device category** (so desktop vs. mobile shows side by side).
  3. Click **Share this report → Download file → Download CSV** and drop it here.
- **Live connection path:**
  - Connect a read-only GA4 MCP server or Google Analytics Data API (`analytics.readonly` scope) with their numeric GA4 Property ID (`Admin → Property details`) and a read-only service account JSON stored outside the project repo (never committed).

### Microsoft Clarity (rage clicks, dead clicks, scroll depth, quick-backs)
- **Why it makes landing pages much better:** Shows *physical proof* of buyer frustration — non-clickable cards people rage-click, forms people abandon mid-field, and the exact scroll depth where 70% of mobile visitors give up.
- **30-second path:**
  1. Open their Clarity project → **Dashboard** (filter to the target landing page URL + last 30 days).
  2. Share or paste the headline numbers (**Scroll depth %**, **Dead clicks %**, **Rage clicks %**, **Quick backs %**, **Mobile vs. Desktop split**) or drop a screenshot of the dashboard / click-map right in chat.
- **Live connection path (Clarity Data Export API — super fast):**
  1. In Clarity → **Settings → Data Export → Generate new API token** (read-only).
  2. Store it in a local env var (`CLARITY_API_TOKEN` in `.env`, verified in `.gitignore` — never in HTML or committed files).
  3. Query Clarity's official `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3` endpoint (note Clarity's daily request limit of 10 calls/day — cache the response immediately to `data/clarity.json` so you never burn their quota!). Or connect the official Microsoft Clarity MCP server if their AI app supports MCP.

### Meta Ads (ad hooks, creative angles, CTR vs. Landing Page View rate vs. conversions)
- **Why it makes landing pages much better:** Meta traffic is colder than Google Search. Seeing the exact winning ad hooks, thumb-stop rates, and link-click → landing-page-view drop-off tells you immediately whether the hero breaks scent or loads too slowly on in-app mobile browsers.
- **30-second path:**
  1. Open Meta Ads Manager → **Ads** tab (last 30 days) → columns: Spend, Link Clicks, Landing Page Views, Leads/Purchases, Cost per Result, Primary Text / Headline.
  2. **Reports → Export table data (.csv)** and drop it here (or paste their top 3 ad headlines/hooks).
- **Live connection path:**
  - Connect a read-only Meta Ads MCP server or Marketing API system-user token (`ads_read` scope only, stored in `.env`) to pull ad-level creative hooks and landing-page-view ratios.

### Google Search Console (real organic search queries & landing page CTR)
- **Why it makes landing pages much better:** Surfaces exact buyer language and high-impression / low-CTR queries you can mirror in H1s, FAQs, and paid search campaigns.
- **30-second path:**
  1. Open Search Console → **Search results → Filter by Page** (target URL, last 3 months) → **Export → Download CSV** and drop it here.
- **Live connection path:**
  - Connect a read-only GSC MCP server (`webmasters.readonly` scope) or local service account JSON.

### Other Useful Sources (CRM, Call Tracking, Hotjar / PostHog)
- **CallRail / WhatConverts / CRM exports (HubSpot, Salesforce, Pipedrive):** Even a 20-row CSV of closed-won vs. junk leads (with source/keyword or call transcript themes) dramatically sharpens form qualification and `lead-gen-quality` fixes.
- **Hotjar / PostHog:** Paste scroll-depth & funnel drop-off numbers or drop an export CSV into `data/`.

## 3. Save the data cleanly so every PPC.io tool uses it automatically

Whenever data arrives (from a live connection OR a dropped CSV/screenshot):
1. Save raw files in `landing-pages/<site>/data/` (or `./data/` if working on a standalone Google Ads account or client dashboard).
2. Distill the real, verified findings into **`landing-pages/<site>/data/analytics-summary.md`** (concise, bulleted, strictly factual, with exact date range and source platform):
   - **Traffic & Device Split** (e.g. Mobile vs. Desktop sessions & conversion rate)
   - **Top Converting & Top Wasted Search Terms / Ad Angles**
   - **Behaviour & Friction Signals** (Clarity scroll depth, rage clicks, dead clicks, quick-backs, form drop-off)
   - **Biggest Data-Backed CRO Opportunity** (1–2 plain-English sentences)
3. If paid search terms or ad headlines came in, also write the exact search terms and ad headlines into **`landing-pages/<site>/ads.md`** so `lp-ad-match` checks exact message match automatically.
4. Note that **`kit.sh brief <site>` automatically includes `data/analytics-summary.md` and `ads.md`** in `audit/brief.md` — so all 14 Landing Page Studio audit experts automatically use the owner's real data on the audit or re-audit!

## 4. Security & Honesty Rules (Non-Negotiable)

- **Read-only first, always.** Never ask for write, edit, billing, or admin permissions just to audit, design a page, or build a dashboard.
- **Zero passwords in chat.** Never ask for a Google/Meta/Microsoft password. Use official read-only API tokens, OAuth MCP servers, or CSV exports.
- **Protect secrets on disk.** If creating `.env` for a token, verify `.env` is in `.gitignore` first and never copy tokens into `audit/`, `facts.md`, `page.html`, or client dashboards.
- **Zero invented numbers.** Quote only figures present in the connected API response or uploaded CSV, with the exact date window attached.
