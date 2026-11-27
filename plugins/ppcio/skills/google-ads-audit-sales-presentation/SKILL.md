---
name: google-ads-audit-sales-presentation
description: "Turn Google Ads audit findings (JSON, CSV exports, or audit notes) into a single-file, white-label HTML client pitch deck adapted cleanly to your agency's own colours, logo, and typography across 4 selectable themes. Use when presenting a Google Ads audit to win a new client or run a QBR pitch. Not for ongoing weekly/monthly KPI dashboards (use client-report-dashboard) or raw account auditing first (use ppc-strategic-audit)."
---

# Google Ads Audit Sales Presentation

Turn real Google Ads audit findings into a zero-dependency, single-file HTML sales deck that wins deals on clarity and receipts rather than agency hype. Every deck adapts automatically to **your agency's own brand colours, logo, and typography** (or 4 clean selectable themes), never hardcoded to one style.

## Start here

- Check if a local `landing-pages/*/context.md`, `audit.md`, or prior Google Ads audit output exists in this folder so you build from verified facts instead of re-asking questions.
- **Data:** If they only have raw Google Ads exports, run a sharp causal audit (`ppc-strategic-audit` or `ppc-account-health-check`) first, or ask in one line: *"In Google Ads, open Campaigns (last 90 days), include Cost, Clicks, Conversions, Cost / conv., and Search impr. share, Download .csv and drop it here. Or tell me if you want help connecting Google Ads, GA4, or Clarity read-only via `connect-data-sources`."*
- **Brand & theme (never hardcoded):** Ask once (or extract from their agency website): agency name, logo path/URL, primary accent hex, and light/dark preference (`executive-clean`, `editorial-warm`, `modern-dark`, or `bold-contrast`).
- **Deterministic Deck Renderer (preferred - zero broken HTML):** Write verified audit receipts to `deck-data.json` (`brand`, `prospect_name`, `period`, `audit_date`, `executive_headline`, and `slides[]` with `kicker`, `title`, `lead`, `metrics[]`, `bullets[]`, `callout`) and run:
  `python3 "${CLAUDE_SKILL_DIR}/scripts/render_deck.py" deck-data.json --out decks/<prospect>-audit.html`
  (If `${CLAUDE_SKILL_DIR}` is empty in Codex, Cursor, Windsurf, Antigravity, or Gemini CLI, replace it with the folder containing this `SKILL.md`; custom HTML layouts are also available in `templates/slide-templates-and-controller.md`.)

## First-Principles Sales Deck Philosophy (Receipts, Not Hype)

Prospects sit through five agency pitches full of made-up "42/100 Health Scores" and vague promises to "scale 3x". You win the room by showing exact receipts from their own account in plain human English.

1. **Lead with the verified money problem, never a vanity grade:** Name the exact dollars wasted on off-intent searches, Brand-padded PMax, broken tracking, or a leaking landing page before showing any roadmap.
2. **Never blame past managers or the prospect:** State plainly what the data shows (*"Search terms for DIY and jobs spent $2,480 with 0 conversions over 90 days"*), because blaming people makes internal stakeholders defensive and kills the deal.
3. **Worst-case honest math over fake guarantees:** Frame projections as conservative, arithmetic-backed ranges (*"Reallocating $2,480/mo of zero-conversion waste at your existing $62 Non-Brand CPL equals roughly 25 to 40 additional leads/month before any landing page gains"*). Never invent fake benchmarks, percentages, or guaranteed ROAS lifts.
4. **Include at least 1 post-click / offer move:** Prospects lose as many leads after the click as inside Google Ads. Pair account fixes with one sharp landing page or offer finding (`landing-page` or `lp-buyer-objections`) so you sound like a revenue partner, not a button-pusher.
5. **Tailor the language to the buyer in the room:**
   - **Founder / CFO:** Zero PPC jargon. Talk investment, wasted spend, real leads/orders, and payback.
   - **VP Marketing / In-House Lead:** Trajectory, Brand vs. Non-Brand split, tracking integrity, and 90-day sequence.
   - **Spot red flags early:** If the account has <10 conversions/month, broken tracking, or a weak offer, state honestly that Phase 1 is fixing measurement and the offer before raising spend.

### Weak 5/10 vs. 10/10 Audit Pitch Deck

- **Amateur:** *"Slide 2: Your account scores 54/100. We will restructure your campaigns, add negative keywords, and scale your ROAS by 3x in 90 days."* (Confected score, zero receipts, unbelievable claim.)
- **10/10 Senior:** *"Slide 2: $4,120 of last quarter's $18,400 spend went to 3 fixable leaks (Brand-padded PMax, broad-match DIY terms, and a mobile landing page hiding your phone number). Slide 8: What is already working (Exact-Match Core Services hits $41 CPL across 118 leads - we protect this first). Slide 11: Conservative 90-day plan with tracking fixed in Week 1 before touching bids."*

## Flexible Narrative Arc (Adapt Slide Count to the Prospect, Typically 10 to 14 Slides)

1. **Cover:** Prospect name, audit window, agency brand & logo.
2. **Executive Takeaway:** One blunt sentence naming the biggest verified dollar leak and the biggest verified strength.
3. **The Money Problem (Receipts):** Exact wasted spend or Brand vs. Non-Brand distortion with real campaign/search-term examples.
4. **Top 3 Root Causes (3 slides):** Each backed by exact CSV numbers, causal explanation, and concrete fix (including at least 1 landing page / tracking / offer leak when present).
5. **What Is Working (Restraint Slide):** Explicitly show what you will NOT break so the prospect trusts your judgment.
6. **Conservative 90-Day Roadmap:** Phase 1 (Fix tracking & stop waste, Days 1 to 14) -> Phase 2 (Reallocate to proven winners & sharpen ads/LP, Days 15 to 45) -> Phase 3 (Controlled expansion only after targets hold, Days 46 to 90), with clear verification & rollback guardrails.
7. **Transparent Scope & Next Step:** Separate agency fee cleanly from ad spend paid direct to Google, plus one clear next step.

## Closed-Loop Verification & Self-Critique (Run Before Delivering)

1. **Math & receipt audit:** Verify every dollar total, percentage, and CPA/ROAS figure programmatically via `python3` against the source CSV or audit file. Zero invented numbers.
2. **Skeptical prospect check:** Read every slide headline alone from Slide 1 to the end. Does the story make sense without spoken narration? Would a skeptical CFO challenge any projection as hype? Tighten any vague slide.
3. **Brand & voice check:** Confirm the HTML uses the user's chosen brand colours/theme (zero hardcoded default yellow accents or rival agency branding), works offline in one self-contained `.html` file, and reads in crisp normal human English with zero em dashes or deck buzzwords. Give the clickable full file path.
