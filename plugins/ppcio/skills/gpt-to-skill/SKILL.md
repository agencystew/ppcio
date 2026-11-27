---
name: gpt-to-skill
description: Turns a ChatGPT custom GPT into a clean, portable, reasoning-first Agent Skill (works in Claude Code, Cursor, Codex, Antigravity, Windsurf, Gemini CLI, and Claude.ai). Audits shouted rules, bloat, and rigid templates, moves exact checks into Python scripts and knowledge into references/, and packages a validated zip with adversarial evals. Use when someone says "move my GPT to Claude", "convert my custom GPT", "migrate my GPTs", or pastes GPT instructions asking for a skill. Not for building a brand-new Google Ads skill from scratch with no GPT behind it (use google-ads-skill-builder).
metadata:
  author: PPC.io
  version: "1.1.0"
---

# GPT to Skill (Foundation Audit & Karpathy-Style Migration)

Copying a ChatGPT custom GPT verbatim into a `SKILL.md` produces an amateur, bloated skill. Most custom GPTs are one giant wall of shouted `ALL CAPS / MUST / NEVER` rules, rigid fill-in-the-blank templates, and prose trying (and failing) to enforce exact math or character limits. Your job is to perform a **Foundation Audit** and rebuild the GPT into a **lean, portable, reasoning-first Agent Skill** that outperforms the original GPT across every frontier model.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` exists in the folder, read it first if relevant; otherwise ask in one message for what is missing: (1) GPT **Instructions** (paste is fine), (2) uploaded **Knowledge files**, (3) **Conversation starters**, (4) **Actions** (name + endpoint purpose; note actions & API keys never carry over directly!), and (5) enabled capabilities (web search, code, image gen). If they only have instructions, start right away and note what is missing.

## Step 1. Run Deterministic Audit & Foundation Diagnosis

Save instructions to `instructions.txt` and run:
`python3 "${CLAUDE_SKILL_DIR}/scripts/gpt_audit.py" instructions.txt [--starters starters.txt]`

Then run a **Foundation Audit** on the GPT instructions to spot bloat before migrating:
- **Shouted rules (`ALL CAPS / MUST / NEVER`):** Replace with calm rules paired with a concrete **why** (frontier models obey reasoned trade-offs far better than shouting).
- **Deterministic checks hidden in prose:** Any exact character count, word count, list length, or math formula belongs in a Python script (`scripts/limits_check.py`), NOT a wishful prompt instruction.
- **Template & persona bloat:** Strip robotic role-play walls and fill-in-the-blank questionnaires that stifle model critical thinking; preserve the GPT's genuine domain expertise, concrete examples, and voice!

Share 3 to 5 crisp findings in plain English, then ask at most **3 quick questions (one at a time, skipping anything already clear)**: (1) top 3 real jobs it does (becomes triggers + evals), (2) when it must NOT be used, (3) which limits/numbers must be 100% exact.

## Step 2. Map Every Part Transparently (No Silent Drops)

Read [references/migration-map.md](references/migration-map.md) and show a concise table (`GPT part | Skill destination | What changes & why`). Wait for approval. Never drop a rule silently; if you merge or delete bloat, name it and explain why. For any Custom GPT Action, specify the clean replacement (live MCP connector via `connect-data-sources`, local Python script, or CSV input step) and **never hardcode API keys or private credentials** into the skill. Keep private knowledge files strictly local unless the user confirms they can be bundled.

## Step 3. Build an Elite, Portable Agent Skill

Folder name = lowercase-hyphen `name` field (target `45 to 240` lines in `SKILL.md`, moving >50-line reference tables to `references/` and exact counts/math to `scripts/`):
- **`SKILL.md` (cleanly under 240 lines):** Front matter (`name`, third-person `description` with explicit `"Use when"` and `"Not for"` triggers), hypothesis-driven workflow, calm reasoned rules (with `why`), a concrete Weak-vs-10/10 output contrast (preserving the GPT's real voice!), guardrails, and a **Closed-Loop Self-Critique** step run before every answer.
- **`references/`:** Convert uploaded knowledge files into focused topic Markdown files, each linked from `SKILL.md` with one line telling the agent *when* to read it.
- **`scripts/`:** Add a deterministic check for every exact limit from Question 3 (starting from `scripts/limits_check.py`).
- **`evals.md`:** Include the 3 core jobs as test prompts PLUS at least 1 **Trap / Restraint** prompt and 1 **Non-Trigger** prompt that must NOT activate the skill, with clear pass/fail criteria.

### Weak 5/10 vs. 10/10 GPT Migration

- **Amateur:** Pastes the 1,800-word Custom GPT prompt straight into `SKILL.md` with 22 `NEVER/ALWAYS` shouts, keeps broken references to OpenAI Actions, and skips validation scripts.
- **10/10 Senior:** Runs `gpt_audit.py`, distills `SKILL.md` to 85 lines of clean reasoning + self-critique, moves 400 lines of reference tables into `references/`, enforces the GPT's 150-char limit via `scripts/limits_check.py`, replaces the old Action with a clean MCP/connector note (zero hardcoded keys), passes `validate_skill.py` with 0 FAILs, and packages a clean portable `.zip`.

## Step 4. Guardrails, Self-Check, Dry-Run & Package (Run Before Answering)

1. Run `python3 "${CLAUDE_SKILL_DIR}/scripts/validate_skill.py" <folder>` and fix every `FAIL` (and every applicable `WARN`).
2. **Adversarial dry-run & zero-fabrication check:** Walk through the 3 core eval prompts + the non-trigger prompt in your head as a fresh agent holding ONLY this skill. Confirm zero invented rules the GPT never had, zero hardcoded secrets, zero em dashes, and clear failure/rollback handling if an external file or input is missing.
3. Package via `python3 "${CLAUDE_SKILL_DIR}/scripts/package_skill.py" <folder>` to produce `<name>.zip`.
4. Deliver cleanly: (1) 3 to 5 audit findings, (2) migration map, (3) `<name>.zip` + portable install steps (Claude.ai Customize > Skills > Upload with Code Execution enabled, OR local skills folder for Claude Code, Cursor, Codex, Antigravity, Windsurf, Gemini CLI), and (4) 3 starter test prompts. For building a brand-new Google Ads skill from scratch, point them to `google-ads-skill-builder`.
