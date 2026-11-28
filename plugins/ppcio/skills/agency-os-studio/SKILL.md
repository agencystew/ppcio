---
name: agency-os-studio
description: "Agent-to-Agent Agency & In-House PPC Operations and Deep Audit OS Studio: harvests your organization's real website brand (logo, exact colors, webfonts, polarity), runs deterministic multi-account triage and Playbook Dependency Gating via ops_engine.py (quiet-gap tracking break detection + Google Ads Editor CSV exports), unleashes your AI to design 4 genuinely bespoke branded interactive Ops & Audit web apps in parallel, renders a desktop+phone visual comparison board, and enforces all 6 deterministic audit gates (verify_audit.py + verify-dom). Use when building an internal PPC audit system, agency management OS, or multi-account workflow. Not for client-facing weekly/monthly reporting portals (use reporting-studio)."
---

# Agency & In-House PPC Operations / Audit OS Studio

Agencies running 5 to 100+ accounts and in-house teams running multi-region spend drown in noisy false alerts, scattered spreadsheets, and juniors pausing keywords while tracking is broken. Your job is NOT to spit out a generic Python HTML table. Reason from first principles like an ambitious Head of Paid Search Operations: form a sharp hypothesis about the single operational constraint hurting retention (broken tracking, noisy alerts, or inconsistent audits), run an **Agent-to-Agent Studio** where deterministic engines own **Math, Quiet-Gap Tracking Breaks, Dependency Locking, Ads Editor CSVs, Visual Boards, and 6 Hard Audit Gates**, and let your own design craft author and customize 4 genuinely bespoke, brand-true operational web apps until the team gets flagship internal software.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Read [TASTE.md](TASTE.md), [steps/4-versions.md](steps/4-versions.md), [references/agency-os-architecture.md](references/agency-os-architecture.md), and [references/false-alert-truth-checks.md](references/false-alert-truth-checks.md) before designing or auditing. Why: batching by task type and enforcing tracking-first dependency order (`quiet_days >= 2`, `> 3x` normal gap, `>= 2x` CPL, `< 2` expected leads = noise) eliminates 90% of agency false alarms and catastrophic keyword cuts.
- Check for existing local CSVs, audit docs, or `landing-pages/*/context.md` first so you skip redundant questions.

## Delivery Standard

Deliver concrete, ready-to-use files with clickable full paths: `ops/versions/board.html` (4 bespoke branded prototypes side by side), `ops/final/page.html` (polished winning Ops OS), `ops/ops_state.json`, verified `ops/audit-summary.md`, and ready-to-import `ops/editor-exports/*.csv`, plus a plain-English summary of `BROKEN` vs. `AT_RISK` vs. `WIN/FINE` accounts and 7-day (tracking) / 14-day (traffic) rollback checks.

## Step 1. Fast Consultative Ops Discovery

Ask **at most 3 short plain-English questions** (or jump straight to diagnosis if they already dropped an MCC CSV or audit doc):
1. **Team & scale:** Agency or in-house? How many Google Ads accounts/brands, and who executes fixes (PPC managers, web/LP team, tracking/dev)?
2. **Biggest headache today:** Drop an existing audit doc/spreadsheet or name what breaks most (missed tracking drops, noisy alerts, inconsistent audits, or proving opportunity to executives/prospects).
3. **Real brand & data:** Your agency/company website URL (to harvest real brand colors, logo, and fonts automatically) plus a single-account or MCC Google Ads CSV (or connect Google Ads/GA4/Clarity via `connect-data-sources`).

When they share an existing audit doc, critique it honestly first: expose missing Brand separation, menu-path teases (*"Open Google Ads > Campaigns"*), missing tracking-first dependency locks, confected `/100` scores, or low-sample noise.

## Step 2. Harvest Real Brand & Run Deterministic Ops Engine

Never invent generic themes and never hand-wave dependency gating! Run both truth scripts first:
1. **Harvest real website brand tokens:**
   `node "${CLAUDE_SKILL_DIR}/scripts/brand_harvest.cjs" --out-dir ops --org "<Org>" [--url "<https://...>"] [--accent "<#hex>"] [--polarity <light|dark>]`
2. **Build `ops_state.json` + Batch Queue & Google Ads Editor CSV Exports:**
   `python3 "${CLAUDE_SKILL_DIR}/scripts/ops_engine.py" --csv <mcc_or_campaigns.csv> [--account "<Name>"] [--target-cpa <CPA>] [--targets-json <targets.json>] [--currency "$"] [--brand "<brand regex>"] --export-dir ops/editor-exports --out ops/ops_state.json`

## Step 3. Design 4 Bespoke Branded Ops OS Prototypes & Run Visual + 6-Gate Critic

Follow [steps/4-versions.md](steps/4-versions.md) and [TASTE.md](TASTE.md) completely:
1. **Author 4 genuinely distinct interactive Ops & Audit web apps** (`ops/versions/a..d/page.html`) natively inside `ops/inputs/brand.md` powered verbatim by `ops_state.json` (A: Morning Ops Command Cockpit; B: 6-Tab Causal Deep Audit Workbench; C: Revenue Opportunity Pitch Board; D: Bold Unified Agency OS). Never fall back to `scripts/render_ops_prototypes.py` unless running in a zero-browser emergency environment.
2. **Build the desktop + phone visual comparison board & name your pick:**
   `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" board ops --title "<Org>: 4 PPC Operations & Audit OS Prototypes"`
3. **Promote the pick and run up to 3 Visual + Mechanical Critic rounds:**
   - `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" pick ops <a|b|c|d>`
   - `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" shot ops/final/page.html ops/final/shots`
   - `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" verify-dom ops/final/page.html --state ops/ops_state.json`
   - `python3 "${CLAUDE_SKILL_DIR}/scripts/verify_audit.py" --draft ops/final/page.html --state ops/ops_state.json --type <lead_gen|ecommerce|saas>`
   Open `ops/final/shots/desktop.png` and `phone.png`, score every `TASTE.md` dimension, and iterate until every score clears 9/10. Also compile `ops/audit-summary.md` through `verify_audit.py`.

### Weak 5/10 vs. 10/10 Agent-to-Agent Ops OS Delivery

- **Amateur:** Runs a static Python template with invented colors, never opens a screenshot, prints 40 noisy green cards, cuts keywords on a broken-tracking account, and drops a menu-path checklist.
- **10/10 Senior:** Harvests the agency's real brand, catches a quiet-gap tracking break and physically locks PPC traffic tweaks in `Waiting on tracking`, exports valid Google Ads Editor CSVs, authors 4 bespoke brand-true Ops web apps in parallel, verifies 0 JS errors + all 6 audit gates + 9+/10 visual polish in Chromium, and gives the team flagship internal software.

## Closed-Loop Self-Critique (Run Before Answering)

1. **Dependency & compiler gate check:** Did `ops_engine.py`, `verify_audit.py` (all 6 gates), AND `studio_board.cjs verify-dom` pass with `0` failures, `0` JS errors, and working live multi-account switching? Are traffic edits strictly locked whenever tracking is broken?
2. **Brand fidelity, noise & restraint check:** Did you open `ops/final/shots/desktop.png` and `phone.png` to confirm genuine brand alignment, collapsed `FINE` noise, explicit **Protect First** winners, and clear 7-day (tracking) / 14-day (bid/keyword) verification & rollback guardrails?
3. **Human voice & handoff:** Crisp, blame-free English with zero em dashes. Share clickable full paths to `ops/versions/board.html`, `ops/final/page.html`, and `ops/editor-exports/`, and offer to switch versions (`A/B/C/D`), pair with `reporting-studio` (client reporting), or fix Batch 2 post-click leaks via `landing-page`.
