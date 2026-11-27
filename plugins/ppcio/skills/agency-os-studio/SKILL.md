---
name: agency-os-studio
description: "Consultative Agency & In-House PPC Operations and Deep Audit OS Studio: interviews you about how you monitor, audit, and manage Google Ads accounts (or critiques your current audit doc / MCC export), immediately generates 3 live clickable HTML Ops & Audit prototypes from one verified ops_state.json (Morning Ops Triage & Dependency-Gated Team Batches, 6-Tab Causal Account Audit Workbench, and Revenue Opportunity Pitch Board), exports Google Ads Editor CSVs, and compiles audits through 6 deterministic quality gates. Use when building an internal PPC audit system, agency management OS, or multi-account workflow. Not for client-facing weekly/monthly reporting portals (use reporting-studio)."
---

# Agency & In-House PPC Operations / Audit OS Studio

Agencies managing 5 to 100+ accounts and in-house teams managing multi-region or high-spend accounts drown in scattered spreadsheets, noisy false alerts, and manual Monday fire drills. Your job is to reason like an ambitious Head of Paid Search Operations: form a sharp hypothesis about the single operational constraint hurting account retention (broken tracking, noisy alerts, or scattered per-account checklists), **generate 3 live clickable interactive Ops & Audit OS prototypes straight off the bat** from their real account data, and customize their permanent internal audit & management system.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Read [references/agency-os-architecture.md](references/agency-os-architecture.md) and [references/false-alert-truth-checks.md](references/false-alert-truth-checks.md) before designing their operations workflow or running deep audits. Why: batching by task type and enforcing tracking-first dependency order (`quiet_days >= 2`, `> 3x` normal gap, `>= 2x` CPL, `< 2` expected leads = noise) eliminates 90% of agency false alarms and wasted keyword edits.
- Check if local CSVs, audit docs, or `landing-pages/*/context.md` already exist in the folder so you skip redundant questions.

## Delivery Standard

Deliver clickable full paths to `ops/prototypes/index.html` (all 3 live HTML prototypes), `ops/ops_state.json`, any generated `ops/editor-exports/*.csv`, a plain-English summary of what is `BROKEN` vs. `AT_RISK` vs. `FINE`, and concrete 7-day (tracking) / 14-day (traffic) verification steps.

## Step 1. Consultative Ops Discovery (Fast, Zero Bloat)

Ask **at most 3 short plain-English questions** (or skip straight to diagnosis if they dropped an MCC export or current audit doc):
1. **Team & scale:** Agency or in-house team? Roughly how many Google Ads accounts / brands, and who executes fixes (PPC managers, web/LP team, tracking/dev)?
2. **Biggest operational headache today:** Drop an existing audit doc or tell me what breaks most often (missed tracking drops, noisy alerts, inconsistent audits across managers, manual Monday triage, or proving opportunity to executives/prospects).
3. **Brand & data:** Organization name, theme (`editorial-warm`, `executive-clean`, `modern-dark`, `bold-contrast`), and a single-account or multi-account MCC Google Ads CSV (or connect Google Ads / GA4 / Clarity read-only via `connect-data-sources`).

When they share an existing audit doc or checklist, critique it honestly first: call out missing Brand separation, menu-path teases (*"Open Google Ads > Campaigns"*), lack of tracking-first dependency gating, confected health scores, or noisy low-sample alerts so they immediately see the upgrade.

## Step 2. Run Deterministic Ops Engine & Render 3 Live Prototypes Straight Off The Bat

Never hand-code inconsistent audits or skip dependency gating! Run the 3-step deterministic pipeline:
1. **Build `ops_state.json` + Google Ads Editor CSV Batch Exports** (portfolio triage `BROKEN -> AT_RISK -> WIN -> FINE`, Statistical Quiet-Gap break check, tracking inflation check, 8-step causal moves, Playbook Dependency Gating holding PPC traffic tasks whenever tracking is broken, and 4 transparent opportunity formulas):
   `python3 "${CLAUDE_SKILL_DIR}/scripts/ops_engine.py" --csv <mcc_or_campaigns.csv> [--account "<Name>"] [--target-cpa <CPA>] [--brand "<brand regex>"] --export-dir ops/editor-exports --out ops/ops_state.json`
2. **Generate all 3 live clickable HTML Ops & Audit OS prototypes + Picker (`ops/prototypes/index.html`):**
   `python3 "${CLAUDE_SKILL_DIR}/scripts/render_ops_prototypes.py" --state ops/ops_state.json --out-dir ops/prototypes --org "<Agency or Company>" --theme <editorial-warm|executive-clean|modern-dark|bold-contrast> [--accent "<#hex>"]`
3. **Compile every written audit or action brief through the 6-Gate Audit Compiler (`verify_audit.py`):**
   `python3 "${CLAUDE_SKILL_DIR}/scripts/verify_audit.py" --draft <audit_draft.md> --state ops/ops_state.json --type <lead_gen|ecommerce|saas>`
   Why: catches menu-path teases, `$0` budget bugs, blame language, confected `/100` scores, broken-tracking dependency violations, and ecom/lead-gen vocabulary leaks BEFORE anyone sees the audit.

## Step 3. Customize Into Their Permanent Internal Operating System

Share the clickable full file path to `ops/prototypes/index.html` and explain the 3 distinct prototypes cleanly:
- **Prototype A (Morning Ops Triage & Batch-by-Task Command Center):** Risk-sorted portfolio queue (collapsing healthy accounts to a single count), dependency-gated Team Batches (`Tracking -> Web/LP -> PPC AM`, auto-holding traffic edits when tracking is broken), and ready-to-import Google Ads Editor CSVs.
- **Prototype B (6-Tab Deep Causal Account Audit Workbench):** Monday Overview with 5-Part Finding Cards, neutral A-D grades, Tracking check, Ads & LP view, interactive checkboxes, persistent `"Not right? Tell us why"` rejection memory, and clean Full Data tab.
- **Prototype C (Revenue-First Audit & Opportunity Pitch Board):** Transparent waste/CVR/headroom arithmetic, 3-phase 90-day sequence, and mandatory `"What Is Already Working (Protect First)"` restraint block for agency pitches or CFO buy-in.

Then ask what they want to customize or wire up next (scheduled nightly `$0` break monitor via Google Ads Scripts / MCP, Cloudflare Pages + KV team workspace with persistent checkboxes, ClickUp/Asana/Slack morning batch alerts, or pairing with `reporting-studio` for automated client reports).

### Weak 5/10 vs. 10/10 Ops & Audit System

- **Amateur:** Writes a 4-page generic checklist telling the manager to *"Open Google Ads > Campaigns to check CPA"*, recommends raising budget while waste leaks, cuts keywords on a broken-tracking account, and prints 40 green "all clear" cards.
- **10/10 Senior:** Runs `ops_engine.py` across the portfolio (catching a 3-day quiet-gap tracking break and automatically locking PPC traffic tweaks in `Waiting on tracking`), generates 3 live branded HTML Ops & Audit workbenches + Google Ads Editor CSV exports in 2 seconds, enforces the 6-gate compiler, and gives the team a quiet, noise-free Monday operating system.

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering prototypes or a custom Ops OS:
1. **Dependency & math check:** Did `ops_engine.py` and `verify_audit.py` pass with 0 failures? Are traffic edits strictly held whenever tracking is broken, with zero fabricated metrics, zero `$0` budget instructions, and every move grounded in a 5-Part Finding Contract?
2. **Noise & restraint check:** Are healthy accounts collapsed cleanly (`FINE` count) and winning campaigns explicitly listed under **Protect First**, with clear 7-day (tracking) and 14-day (bid/keyword) verification & rollback guardrails?
3. **Human voice & handoff:** Crisp, blame-free English with zero em dashes or staff-micromanagement metrics. Share clickable full file paths to `ops/prototypes/index.html` and `editor-exports/`, and offer `reporting-studio` (client reporting) or `landing-page` (fixing post-click leaks flagged in Batch 2).
