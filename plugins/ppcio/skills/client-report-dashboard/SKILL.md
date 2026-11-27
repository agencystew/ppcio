---
name: client-report-dashboard
description: "Build a polished, self-contained interactive HTML Google Ads client performance dashboard (KPI cards with sparklines, brand vs. non-brand split, budget pacing bar, campaign table, bad-news-first executive narrative, and optional multi-client static portal hub) in the user's own agency or client branding across 4 selectable design themes. Use when someone asks for a visual HTML client report, interactive dashboard, or shareable reporting portal from CSV exports or live data. Not for short Monday client emails (use weekly-client-report) or internal manager triage (use weekly-pulse)."
---

# Interactive Client Report Dashboard & Portal

Turn raw Google Ads exports (or live API/MCP data) into a crisp, self-contained HTML client dashboard ready to open in any browser, save to PDF, email, or host on a private agency portal. Every dashboard adapts to **your own agency or client branding** across 4 clean themes, never locked into a hardcoded style.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Check for a local `landing-pages/*/context.md` or existing client brief first so you already know the business model, targets, and geography.
- **Data:** Ask for a Campaigns CSV (and optionally Daily performance + Search Terms CSVs) if not already provided: *"In Google Ads, open Campaigns, set the date range with Compare to previous period enabled, include Budget, Cost, Clicks, Impressions, Conversions, Conv. value and Cost / conv., then Download .csv and drop it here. Or tell me if you want help connecting Google Ads, GA4, Meta Ads, or Microsoft Clarity read-only via `connect-data-sources`."*
- **Brand & theme (never hardcoded):** Ask once (or read from their agency brand file/website): agency name, optional logo URL/path, brand accent hex colour, and preferred visual theme from `references/themes.md` (`executive-clean`, `editorial-warm`, `modern-dark`, or `bold-contrast`; default to `executive-clean` adapted to their accent if unspecified).

## First-Principles Reporting Philosophy (Receipts, Not Confected Scores)

Clients do not renew agencies because of pretty vanity charts; they renew because they trust the numbers and see clear decisions being made with their money.
1. **Lead with truth and bad news first:** If CPA rose or ROAS fell, put it in sentence one of the executive summary with the verified cause and the fix already underway. Never bury a bad week behind impression gains.
2. **Isolate Brand from Non-Brand:** Branded search inflates blended ROAS and masks weak acquisition. Always split Brand vs. Non-Brand (and check PMax for brand cannibalization) whenever campaign naming or search terms allow it.
3. **Adapt cleanly to the business model & stakeholder:**
   - **Ecommerce:** Lead with Revenue, Spend, ROAS, Orders, Cost/Order, AOV, and top products/campaigns (never use lead-gen words like "leads" or "calls").
   - **Lead Gen:** Lead with Real Leads/Conversions, Spend, Cost per Lead, Conv. Rate, and lead-quality / search-term notes.
   - **Stakeholder register:** Keep executive copy jargon-free (CFO/owner language: *"Eliminated $2,100 in wasted search spend"*, never *"Added 47 phrase-match negatives"*).
4. **Dollar thinking & ratio honesty:** Always pair percentages with actual currency and volume (`CPA fell 18% (-$14/lead across 92 leads)`). Be honest with ratios (`1.72x` is *"about 70% higher"*, not *"almost double"*). Never divide 30-day spend by 30 if a campaign only ran 14 days; compute daily pace over actual `days_with_spend`.
5. **Agency-safe comms & lag discipline:**
   - Never expose alarming internal jargon like *"Google is in learning phase"* (frame as *"optimization period"*), never blame the client or past managers, and never ask clients about Google Ads settings they pay you to manage.
   - If the reporting window ends within the last 3 to 5 days and the account has multi-day conversion lag (check `conversion-lag-check`), add a plain 1-line lag note so nobody panics over unattributed recent clicks.

### Weak 5/10 vs. 10/10 Client Dashboard

- **Amateur:** *"Impressions grew 24% and CTR reached 6.2%! Blended ROAS is 5.4x. We are monitoring CPA closely and continuing to optimize."* (Hides a Non-Brand CPA spike inside Brand ROAS, offers zero concrete actions, and sounds like generic filler.)
- **10/10 Senior:** *"Non-Brand CPA rose 19% (+$11 to $68 across 64 leads) because two generic broad-match ad groups absorbed $1,420 after a bid update. Brand held steady at $14/lead. We paused the leaking broad terms on Thursday and shifted $400/wk back into exact-match core service campaigns, putting monthly spend on pace at $9,650 vs. $10,000 budget."*

## Flexible Build Workflow

1. **Compute exact math programmatically first:** Never eyeball totals, deltas, pacing, or Brand/Non-Brand splits from a CSV. Use a short `python3` check (or verify every row programmatically) to compute exact totals, previous-period deltas, budget pacing (`spend_to_date / monthly_budget` vs. `day_of_month / days_in_month`), and campaign rows.
2. **Chase anomalies before writing narrative:** If CPA spiked >20% or conversions dropped >30%, check whether it looks like conversion lag (`conversion-lag-check`), an account/auto-applied change (`change-detective`), tracking failure, or a landing page issue (`landing-page`), and state what you actually found.
3. **Write `report-data.json` & render:** Match the schema in `scripts/render_dashboard.py` (`brand`, `theme`, `account_type`, `period`, `kpis`, `pacing`, `brand_split`, `executive_summary`, `highlights`, `lowlights`, `next_steps`, `campaigns`, `search_terms`) and run:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/render_dashboard.py" report-data.json --out reports/<client-slug>/<YYYY-MM-DD>.html`
4. **Optional Multi-Client Agency Portal:** Save dated reports at `reports/<client-slug>/<YYYY-MM-DD>.html` and run:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/build_portal.py" reports --agency "<Agency Name>" --accent "<#hex>" --theme executive-clean`
   Generates per-client archive hubs (`index.html`, `latest.html`) and a private master hub (`reports/admin/index.html`, all `noindex, nofollow`). Keep `admin/` behind an unguessable path before deploying publicly.

## Closed-Loop Verification & Self-Critique (Run Before Delivering)

Before handing over the HTML link:
1. **Zero-hallucination math check:** Never invent a metric, trend, or target. Confirm every KPI, delta, spend total, and pacing percentage in the rendered HTML matches the source CSVs exactly.
2. **Skeptical client check:** Read the executive takeaway as a busy founder on their phone. Does it lead with the real bottom line, strip out Brand distortion, avoid em dashes/buzzwords, and state 2 to 3 concrete actions with clear verification checks for next week?
3. **Deliver the clickable full path** to the generated HTML file (and offer to wire up automated CSV/live pulls via `connect-data-sources` or `google-ads-script-creator` if they report weekly).
