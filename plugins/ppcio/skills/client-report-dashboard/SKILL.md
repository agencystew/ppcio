---
name: client-report-dashboard
description: "Build a polished, self-contained interactive HTML Google Ads client performance dashboard (KPI cards with sparklines, brand vs. non-brand split, budget pacing bar, campaign table, bad-news-first executive narrative, and optional multi-client static portal hub). Adapts automatically to the user's own agency or client brand colours, logo, and typography with 4 selectable design themes — never hardcoded to one style. Use when someone asks for a visual HTML client report, interactive dashboard, client reporting portal, or shareable weekly/monthly PPC dashboard from CSV exports or live data. Not for short plain-text Monday client emails (use weekly-client-report) or internal weekly manager triage (use weekly-pulse)."
---

# Interactive Client Report Dashboard & Portal

Turn Google Ads exports (or live API/MCP data) into a single, self-contained HTML client dashboard ready to open in a browser, export to PDF, email, or host on a private agency portal — styled cleanly in **your own brand**, never locked into a hardcoded template.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first for business context.
- **Data:** Ask for a Campaigns CSV (and optionally Daily performance + Search Terms CSVs) if not provided. One-line export instruction: *"In Google Ads, open Campaigns, set the date range with Compare to previous period enabled, include Budget, Cost, Clicks, Impressions, Conversions, Conv. value and Cost / conv., then Download .csv and drop it here — or tell me if you'd like me to help connect Google Ads, GA4, Meta Ads, or Microsoft Clarity directly so we can pull live data going forward."* (If they want a live connection, use the `connect-data-sources` skill.)
- **Brand & theme (never hardcoded):** Ask once (or read from their agency brand file / website):
  1. Agency name, optional logo URL/path, and brand accent hex colour.
  2. Preferred visual style from `references/themes.md` (`executive-clean`, `editorial-warm`, `modern-dark`, or `bold-contrast` — default to `executive-clean` adapted to their brand accent if they don't specify).

## Core Reporting Philosophy

1. **Bad news first, never buried.** If CPA rose or ROAS dropped, say so in the opening executive takeaway with the real cause and the fix already underway.
2. **Isolate Brand from Non-Brand.** Branded search inflates blended ROAS/CPA. Split Brand vs. Non-Brand whenever campaign names allow it so the client sees true incremental acquisition performance.
3. **Ecom vs. Lead Gen auto-adaptation.**
   - **Ecommerce:** Lead with Revenue, Spend, ROAS, Purchases, Cost/Purchase, AOV, and top products/campaigns.
   - **Lead Gen:** Lead with Conversions/Leads, Spend, Cost per Lead (CPA), Conv. Rate, and lead-quality / search-term notes.
4. **Dollar thinking over vanity percentages.** Always pair `%` shifts with actual currency and volume (`-18% CPA (-$14/lead across 92 leads)`). Never invent a number — every KPI must match the uploaded data exactly.
5. **Respect conversion lag.** If the reporting window ends within the last 3–5 days and the account has multi-day lag, add a clear 1-line lag note so clients don't panic over unattributed recent days.

## How to Build a Dashboard

1. Read the user's CSV/data (and `references/themes.md` for CSS token customization).
2. Compute exact period totals, previous-period deltas, budget pacing (`spend_to_date / monthly_budget` vs. `day_of_month / days_in_month`), Brand vs. Non-Brand breakdown, and campaign table rows.
3. Write a clean JSON data file (`report-data.json`) matching the schema documented in `scripts/render_dashboard.py` (includes `brand`, `theme`, `account_type`, `period`, `kpis`, `pacing`, `brand_split`, `executive_summary`, `highlights`, `lowlights`, `next_steps`, `campaigns`, `search_terms`).
4. Run:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/render_dashboard.py" report-data.json --out reports/<client-slug>/<YYYY-MM-DD>.html`
5. Verify every figure in the rendered HTML matches the source CSVs, and give the user the full clickable path to the generated HTML file.

## Optional: Multi-Client Agency Reporting Portal

To give every client a permanent, unguessable archive URL (deployable free to Vercel, Netlify Drop, or Cloudflare Pages):

1. Save each dated report at `reports/<client-slug>/<YYYY-MM-DD>.html`.
2. Run:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/build_portal.py" reports --agency "<Agency Name>" --accent "<#hex>" --theme executive-clean`
3. It generates:
   - `reports/<client-slug>/index.html` (clean per-client archive hub, newest first, with `Latest` badge)
   - `reports/<client-slug>/latest.html` (always points to the newest report)
   - `reports/admin/index.html` (master agency hub across all clients — keep private / behind an unguessable path before deploying publicly; every generated page carries `noindex, nofollow`).
