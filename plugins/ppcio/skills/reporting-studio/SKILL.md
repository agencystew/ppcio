---
name: reporting-studio
description: "Agent-to-Agent Client Reporting Studio for agencies and in-house teams that replaces TapClicks, Swydo, and Looker Studio PDFs: harvests your real website brand (logo, exact colors, webfonts, polarity), builds an immutable _week-locked facts.json from messy Google Ads CSVs, unleashes your AI to design 4 genuinely bespoke branded interactive reporting prototypes in parallel, renders a desktop+phone visual comparison board, runs a closed-loop Visual + Truth Critic (verify_report.py + verify-dom), and packages the winner into a $0/mo token-gated multi-client static portal. Use when building, upgrading, or automating client or executive PPC reporting. Not for a single quick Monday email only (use weekly-client-report)."
---

# Client Reporting Studio (Replace TapClicks & PDF Dumps Forever)

Agencies burn $500 to $2,000/month on reporting tools just to email clients bloated PDFs nobody reads, while in-house leads waste every Monday screenshotting Looker Studio. Your job is NOT to spit out a rigid Python template. Reason from first principles like an ambitious Head of Reporting Systems: form a sharp hypothesis about why their current reporting fails to build stakeholder trust, run an **Agent-to-Agent Studio** where deterministic tools own **Truth, Brand Harvesting, Visual Boards, and Mechanical Gates**, and let your own design craft author and iterate 4 genuinely bespoke, brand-true interactive reporting web apps until the output looks like a $50,000 custom product.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Read [TASTE.md](TASTE.md), [steps/4-versions.md](steps/4-versions.md), and [references/reporting-philosophy-and-taste.md](references/reporting-philosophy-and-taste.md) before designing or writing copy (plus [references/automation-and-portal-setup.md](references/automation-and-portal-setup.md) for recurring automation). Why: separating Brand via fuzzy matching (`>= 0.85`), judging each campaign against its own 12-week baseline, harvesting the real brand instead of inventing generic themes, and triggering a `<25%` Safety Hold prevents every classic client-reporting disaster.
- Check for existing local CSVs, current report PDFs/screenshots, or `landing-pages/*/context.md` first so you skip redundant questions.

## Step 1. Fast Consultative Discovery & Current-Report Teardown

Ask **at most 3 short plain-English questions** (or jump straight in if they already gave a CSV/report/URL):
1. **Who reads this?** (Agency clients, local business owners, VP Marketing, or CFO/Board; lead gen, ecommerce, or SaaS?)
2. **What is broken today?** (Drop a screenshot/PDF/HTML of your current TapClicks/Looker report OR tell me what causes client confusion.)
3. **Real brand & data:** Your agency or company website URL (so we harvest your real colors, logo, and fonts automatically) plus one Google Ads CSV (or connect Google Ads/GA4/Meta/Clarity via `connect-data-sources`).

When they share an existing report, critique it sharply first: expose Brand-padded ROAS, missing pacing-vs-return verdicts, unadjusted last-3-day lag dips, or vanity metric walls so they immediately feel the gap.

## Step 2. Harvest Real Brand & Lock Deterministic `facts.json`

Never invent generic themes and never hand-calculate report figures! Run both truth scripts first:
1. **Harvest real website brand tokens** (and stage any current report for side-by-side contrast):
   `node "${CLAUDE_SKILL_DIR}/scripts/brand_harvest.cjs" --out-dir reports/<slug> --org "<Brand>" [--url "<https://...>"] [--current-report <path>] [--accent "<#hex>"] [--polarity <light|dark>]`
2. **Build immutable `_week`-locked `facts.json`** (fuzzy Brand stripping, 12-week own-normal, scale elasticity, MTD pacing verdict, plain-English change translation, Safety Hold check):
   `python3 "${CLAUDE_SKILL_DIR}/scripts/build_facts.py" --daily <daily.csv> [--search-terms <st.csv>] [--changes <changes.csv>] --client "<Name>" --type <lead_gen|ecommerce|saas> --brand "<brand,terms>" --budget <monthly> [--target-cpa <CPA> | --target-roas <ROAS>] --out reports/<slug>/facts.json`

## Step 3. Design 4 Bespoke Branded Prototypes, Run Visual Critic & Pack Portal

Follow [steps/4-versions.md](steps/4-versions.md) and [TASTE.md](TASTE.md) completely:
1. **Author 4 genuinely distinct interactive web apps** (`versions/a..d/page.html`) natively inside `inputs/brand.md` powered verbatim by `facts.json` (A: Current report rebuilt cleanly; B: Executive interactive web app; C: Plain-English 390px mobile client brief; D: Bold dual Call Prep + Client Email portal with a custom vertical visual). Never fall back to `scripts/render_prototypes.py` unless running in a zero-browser emergency environment.
2. **Build the desktop + phone visual comparison board & name your pick:**
   `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" board reports/<slug> --title "<Brand>: 4 Reporting Prototypes for <Client>"`
3. **Promote the pick and run up to 3 Visual + Mechanical Critic rounds:**
   - `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" pick reports/<slug> <a|b|c|d>`
   - `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" shot reports/<slug>/final/page.html reports/<slug>/final/shots`
   - `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" verify-dom reports/<slug>/final/page.html --facts reports/<slug>/facts.json`
   - `python3 "${CLAUDE_SKILL_DIR}/scripts/verify_report.py" --facts reports/<slug>/facts.json --draft reports/<slug>/final/page.html`
   Open `final/shots/desktop.png` and `phone.png`, score every `TASTE.md` dimension, and iterate until every score clears 9/10.
4. **Package the winning bespoke HTML into the `$0/mo` multi-client static portal:**
   `python3 "${CLAUDE_SKILL_DIR}/scripts/portal_pack.py" --html reports/<slug>/final/page.html --facts reports/<slug>/facts.json --portal reports/portal-dist --agency "<Brand>" --brand-json reports/<slug>/inputs/brand.json`

### Weak 5/10 vs. 10/10 Agent-to-Agent Studio Delivery

- **Amateur:** Runs a rigid Python HTML template with invented cream/navy colors, never inspects a screenshot, blends Brand into Non-Brand results, and hands back a 2002-looking page any buyer could beat with a raw prompt.
- **10/10 Senior:** Harvests the agency's real website brand, builds `_week`-locked `facts.json` (exposing Brand masking and `<25%` Safety Holds), authors 4 genuinely different bespoke web apps in parallel, inspects real desktop+phone PNGs through a Visual + Truth Critic loop until 9+/10 with 0 JS errors, and packs the winner into a `$0/mo` multi-client portal.

## Closed-Loop Self-Critique (Run Before Answering)

1. **Zero-fabrication & mechanical gate check:** Did `verify_report.py` AND `studio_board.cjs verify-dom` pass with `0` failures, `0` JS errors, and `0` horizontal overflow on 1440px and 390px?
2. **Brand fidelity & visual craft check:** Did you open `final/shots/desktop.png` and `phone.png` and confirm it genuinely uses their harvested brand (zero generic sand/serif defaults), keeps Brand isolated from Non-Brand, honors any `safety_hold`, and removes all em dashes and platform jargon?
3. **Clear handoff & next move:** Share clickable full file paths to `versions/board.html`, `final/page.html`, and the `$0/mo` portal links, plus one concrete offer to switch versions (`A/B/C/D`), automate weekly pulls via `connect-data-sources`, or build their internal Ops & Audit system with `agency-os-studio`.
