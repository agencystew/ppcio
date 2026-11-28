---
name: reporting-studio
description: "Consultative Client Reporting Studio for agencies and in-house teams that replaces TapClicks, Swydo, and Looker Studio PDFs: interviews you about your current reporting setup (or critiques an existing PDF/report/CSV), immediately generates 3 live clickable white-label HTML prototypes from one verified facts.json (Executive Dashboard, Mobile Plain-English Brief, and Dual-View Call Prep + Client Email), builds a token-gated multi-client static portal, and runs a zero-drift verification compiler. Use when someone wants to build, upgrade, or automate client or executive PPC reporting. Not for a single quick Monday email only (use weekly-client-report)."
---

# Client Reporting Studio (Replace TapClicks & PDF Dumps Forever)

Agencies spend $500 to $2,000/month on reporting tools just to email clients bloated PDFs nobody reads, while in-house leads burn every Monday morning screenshotting Looker Studio. Your job is to reason like an ambitious Head of Reporting Systems: form a clear hypothesis about why their current reports confuse stakeholders or fail to build trust, **generate 3 live clickable interactive prototypes straight off the bat** in their own brand colours/logo from verified data, and build their permanent automated reporting infrastructure.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Read [references/reporting-philosophy-and-taste.md](references/reporting-philosophy-and-taste.md) before critiquing their current report or drafting narrative copy, and [references/automation-and-portal-setup.md](references/automation-and-portal-setup.md) when setting up recurring automation or static portals. Why: separating Brand via fuzzy matching (`>= 0.85`), judging each campaign against its own 12-week baseline, and triggering a `<25%` Safety Hold prevents every classic client-reporting disaster.
- Check if a local `landing-pages/*/context.md` or existing client CSVs/PDFs are already in the folder so you skip redundant questions.

## Step 1. Consultative Setup & Current-Report Teardown (Fast, Zero Bloat)

Ask **at most 3 short plain-English questions** (or skip straight to diagnosis if they dropped a current report/PDF/CSV):
1. **Who is reading these reports?** (Agency clients, local business owners, VP Marketing, or CFO/Board; lead gen, ecommerce, or SaaS?)
2. **What is broken today?** (Drop a screenshot/PDF of your current report OR tell me what takes too long or triggers confused client questions.)
3. **Brand & data:** Agency/company name, accent hex or theme preference (`editorial-warm`, `executive-clean`, `modern-dark`, `bold-contrast`), and one sample Google Ads CSV (or connect Google Ads/GA4/Meta/Clarity via `connect-data-sources`).

When they share an existing report or PDF, critique it sharply first: pinpoint Brand-padded ROAS, missing pacing-vs-return verdicts, unadjusted last-3-day lag dips, vanity metric walls, or missing next actions so they immediately see *why* the new system wins.

## Step 2. Build Immutable `facts.json` & Render 3 Live Prototypes Straight Off The Bat

Never hand-code inconsistent numbers across HTML views! Run the deterministic pipeline first:
1. **Build `_week`-locked `facts.json`** (fuzzy Brand stripping, 12-week campaign own-normal, scale elasticity, MTD pacing + verdict, consolidated lowlights, plain-English change translation, Safety Hold check):
   `python3 "${CLAUDE_SKILL_DIR}/scripts/build_facts.py" --daily <daily.csv> [--search-terms <st.csv>] [--changes <changes.csv>] --client "<Name>" --type <lead_gen|ecommerce|saas> --brand "<brand,terms>" --budget <monthly> [--target-cpa <CPA> | --target-roas <ROAS>] --out reports/<slug>/facts.json`
2. **Generate all 3 live clickable HTML prototypes + Prototype Picker (`index.html`)** (optional `--story story.json` accepts `{"_week", "executive_summary", "one_ask", "talking_points"}`; add `--portal reports/portal-dist` to build/append to a multi-client token-gated static portal):
   `python3 "${CLAUDE_SKILL_DIR}/scripts/render_prototypes.py" --facts reports/<slug>/facts.json --out-dir reports/<slug>/prototypes --agency "<Brand>" --theme <editorial-warm|executive-clean|modern-dark|bold-contrast> [--accent "<#hex>"] [--logo "<url>"] [--story reports/<slug>/story.json] [--portal reports/portal-dist]`
3. **Run the Zero-Drift Compiler Gate (`verify_report.py`)** on any custom narrative/email draft BEFORE showing it:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/verify_report.py" --facts reports/<slug>/facts.json --draft <story_or_draft>`
   Why: one stale week's text, one leaked "learning phase" excuse, or one ecommerce/lead-gen vocabulary slip destroys trust immediately.

## Step 3. Customize Ambition-First (Never Lock Them Into One Template)

Present the clickable full file path to `reports/<slug>/prototypes/index.html` and explain the 3 distinct prototypes cleanly:
- **Prototype A (Interactive Executive Dashboard):** Sparkline KPIs, MTD pacing bar with elapsed-day marker + pace-vs-return verdict, brand-stripped highlights/lowlights, campaign spend bars, and search term tabs.
- **Prototype B (Mobile Plain-English Brief):** 3 numbers above the fold on a 390px phone vs. 6-month normal, monthly bar strip, what we fixed, and automatic tracking Safety Hold.
- **Prototype C (Dual-View Call Prep + Client Email):** 10-minute internal call brief (The 1 Ask, 3 Talking Points, 12-week own-normal exceptions) paired with a copy-ready under-200-word client email.

Then ask what they want to blend, add (e.g., GA4/Meta/Clarity panels via `connect-data-sources`, per-client sub-branding, multi-client static portal on Cloudflare Pages/Netlify, or automated Monday Google Ads Script pulls), and build their customized production system!

### Weak 5/10 vs. 10/10 Reporting System Delivery

- **Amateur:** Writes a generic 1-off HTML file with hardcoded fake numbers, no Brand vs. Non-Brand split, bright-red alarm boxes for every minor dip, and no repeatable pipeline for next Monday.
- **10/10 Senior:** Runs `build_facts.py` on the user's real CSV (exposing Brand masking + safety-holding a broken tracking drop), generates 3 distinct live branded prototypes in 2 seconds from one `_week`-locked `facts.json`, verifies client copy with `verify_report.py`, and wires up a repeatable `$0/mo` token-gated static portal + automated weekly pull.

## Closed-Loop Self-Critique (Run Before Answering)

Before handing over prototypes or a customized reporting system:
1. **Zero-fabrication & parity check:** Does every number across all 3 prototypes and executive prose trace directly to `facts.json` with zero invented targets or fake benchmarks? Did `verify_report.py` pass with 0 failures?
2. **Safety & restraint check:** If `safety_hold` is true (conversions <25% of normal), warn the user clearly BEFORE sharing with a client. Ensure Brand is stripped from non-brand highlights, minor weekly noise stays calm, and zero em dashes or platform jargon appear in client-facing text.
3. **Clear next-step & rollback path:** Give clickable full file paths to every generated HTML prototype/portal, plus a clean 1-step way to iterate on layout/metrics or connect live data via `connect-data-sources` (and link to `agency-os-studio` if they also want internal Ops triage and deep audits).
