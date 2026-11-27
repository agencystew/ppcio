---
name: google-ads-skill-builder
description: Interviews a Google Ads manager about one task, their account, goals, data and rules, then builds a complete custom Agent Skill (SKILL.md, references, scripts, adversarial evals) using Karpathy-style reasoning-first design, checked against validate_skill.py and an ablation/dry-run loop. Use when someone wants to create, design, or elevate a Google Ads or PPC skill, turn a PPC workflow into a skill, or says "my PPC skills are too generic". Not for running a one-off audit or writing ads right now; do that task directly instead.
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.1.0"
---

# Google Ads Skill Builder (Karpathy-Style Elite Skill Architecture)

Generic PPC skills fail because they act like rigid fill-in-the-blank checklists stuffed with shouted rules (`NEVER`, `MUST`) that choke the model's judgment while guessing the things that actually matter: what counts as a real conversion, what "too expensive" means for this client, which terms must never be negated, and who approves edits. Your job is to interview the practitioner sharply, then build a **10/10 reasoning-first Agent Skill** backed by deterministic scripts and adversarial evals.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- Check existing chat files (exports, past reports, negative lists, brand guides) and whether Google Ads MCP tools (`search`, `list_accessible_customers`, `get_resource_metadata`) are connected (`connect-data-sources`). Say in one line what you found before starting.

## Step 1. Targeted Interview & Spec Playback

1. Read [references/interview-guide.md](references/interview-guide.md). Ask **one short plain-English question per message** (6 to 10 questions max, skipping anything already answered; propose sensible defaults when they say "you decide"). Cover: exact job + triggers + non-triggers, account setup & naming, real KPI targets, CSV vs. MCP access, protected terms/voice, approval owner, and output audience.
2. Play back the spec using [templates/skill-spec.md](templates/skill-spec.md) and ask: *"Anything wrong or missing?"* Wait for confirmation; copy their exact corrections verbatim. If they ask for one mega-skill doing 3 unrelated jobs (e.g., audit + write ads + email client), recommend splitting into focused skills and build #1 first.

## Step 2. Select Blueprint & Minimal Knowledge

Pick the closest blueprint and copy ONLY the `references/` files the task actually needs (unused files dilute context!):
- Blueprints: [search-term-miner.md](references/blueprints/search-term-miner.md), [rsa-writer.md](references/blueprints/rsa-writer.md), [account-audit.md](references/blueprints/account-audit.md), [weekly-report.md](references/blueprints/weekly-report.md), [pmax-check.md](references/blueprints/pmax-check.md), or [templates/SKILL.template.md](templates/SKILL.template.md).
- Knowledge modules: [gads-account-structure.md](references/gads-account-structure.md), [gads-search-terms-negatives.md](references/gads-search-terms-negatives.md), [gads-rsa-assets.md](references/gads-rsa-assets.md), [gads-pmax.md](references/gads-pmax.md), [gads-bidding.md](references/gads-bidding.md), [gads-quality-score.md](references/gads-quality-score.md), [gads-impression-share.md](references/gads-impression-share.md), [gads-conversion-tracking.md](references/gads-conversion-tracking.md), [gads-budget-pacing.md](references/gads-budget-pacing.md), [gads-diagnostics.md](references/gads-diagnostics.md), [data-access.md](references/data-access.md). (Keep Apache 2.0 attribution + `LICENSES/Apache-2.0.txt` if copying `gads-diagnostics.md` or `data-access.md`.)

## Step 3. Build to 10/10 Elite Skill Principles (Not Amateur Checklists)

Read [references/skill-principles.md](references/skill-principles.md) and enforce these architecture laws:
1. **Layer Hierarchy (Data -> Deterministic Check -> Prose Last):** Anything requiring exact math, char limits, n-grams, pacing, or lag goes in a Python script (`scripts/`), NOT prose reminders!
2. **High Reasoning-to-Guardrail Ratio (`R:G`):** Teach *first-principles causality and trade-offs* so the model's critical analysis thrives. Every guardrail MUST explain **why** it exists; kill bloated fill-in-the-blank forms, fake personas, em dashes, and unreasoned `ALWAYS/NEVER` walls!
3. **Closed-Loop Self-Critique:** Every skill ends with an adversarial self-check (math/evidence verification, competing hypotheses, small-sample restraint, rollback guardrails) BEFORE final delivery.
4. **Concise & Grounded:** Folder name = `name` field (lowercase-hyphens); `SKILL.md` cleanly under 240 lines; third-person `description` with explicit `"Use when"` and `"Not for"` triggers; zero invented Google Ads limits or targets (use real user numbers or mark unverified). Draft changes for human approval only (read-only default; propose-then-confirm if write MCP is used).
5. **Adversarial `evals.md` (4 Scenario Archetypes):** Start from `templates/evals.template.md` and include 4 sharp test cases: (1) **The Trap** (lagged drop, Brand masking Non-Brand, or junk conversion), (2) **The Absence** (missing CSV/target), (3) **The Healthy Account** (tests restraint - model MUST recommend leaving winners untouched!), and (4) **The Contradiction / Non-Trigger** (out-of-scope request or conflicting edits).

### Weak 5/10 vs. 10/10 Skill Design

- **Amateur:** 500-line `SKILL.md` with 30 `___` form blanks, 25 shouted `NEVER/ALWAYS` lines with no explanation, eyeballed char/math checks, and 0 restraint tests.
- **10/10 Senior:** Tight 90-line hypothesis-driven `SKILL.md`, exact math/linting inside `scripts/`, domain tables in `references/`, Weak-vs-10/10 example contrast, explicit `why` behind every rule, and 4 adversarial evals proving restraint on healthy accounts.

## Step 4. Closed-Loop Verify, Ablate & Package (Run Before Handover)

1. Run `python3 "${CLAUDE_SKILL_DIR}/scripts/validate_skill.py" <path-to-new-skill>` and fix every `FAIL`.
2. Grade against [references/quality-checklist.md](references/quality-checklist.md) AND run a quick **Ablation Audit**: delete any fluffy instruction line that does not change real model behavior, and verify zero em dashes or fabricated facts.
3. **Fresh-model dry run:** Simulate at least 2 prompts from `evals.md` (including **The Trap** and **The Healthy Account**) as if you had ONLY the new skill; fix any step where a fresh model would stall, guess, or over-edit!
4. Package cleanly (`zip` or `python3 -c "import shutil; shutil.make_archive('NAME','zip','.','NAME')"`), then hand over the zip, install steps (Claude Customize > Skills > Upload, or local skills folder for Codex/Cursor/Antigravity/Gemini CLI), and the 3 starter test prompts from `evals.md`.
