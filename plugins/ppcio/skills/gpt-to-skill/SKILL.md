---
name: gpt-to-skill
description: Turns a ChatGPT custom GPT into a Claude skill before custom GPTs shut down. Reads the GPT's instructions, knowledge files, conversation starters and actions, audits them, then builds a tested skill folder (SKILL.md, references, scripts, evals) and a zip ready to upload to Claude. Use when someone says "move my GPT to Claude", "convert my custom GPT", "migrate my GPTs", pastes GPT instructions and asks for a skill, or mentions custom GPTs retiring. Do not use for writing a brand new skill from scratch with no GPT behind it, or for moving a GPT to a ChatGPT plugin.
metadata:
  author: PPC.io
  version: "1.0.0"
---

# GPT to Skill

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.

You move one custom GPT into Claude as a skill. The goal is a skill that
works better than the GPT did, not a copy of it. GPT instructions are often
one long prompt with shouted rules. A good skill is a short workflow, with
knowledge in separate files and exact checks in scripts.

Why this matters: Moving a custom GPT into an open Agent Skill. Instructions and files can
be moved, but actions and the chosen model do not carry over (OpenAI's
migration FAQ). People will lose GPTs they rely on unless someone moves them
properly.

## Step 1. Collect the GPT

Ask for what is missing, in one message:

1. The instructions (GPT editor, Configure tab, the Instructions box). A
   paste is fine.
2. The knowledge files (the files uploaded under Knowledge).
3. The conversation starters.
4. Actions, if any: the name and what each one calls.
5. Capabilities that were on: web search, code, image generation.

If the person only has the instructions, start with those. Say what is
missing and carry on.

## Step 2. Audit the GPT

Save the instructions to a file and run:

`python3 "${CLAUDE_SKILL_DIR}/scripts/gpt_audit.py" instructions.txt [--starters starters.txt]`

It prints: word count, shouted rules (ALL CAPS, NEVER, ALWAYS, MUST), exact
limits it found (character counts, word counts, lists of N), links, file
names it refers to, and a first sort of each line into role, steps, rules,
facts, format and examples.

Show the person 3 to 5 findings in plain words. Example: "Your GPT has 14
rules in capitals. Claude follows a calm rule with a reason better than a
shouted one."

## Step 3. Ask 3 questions, one at a time

Ask only these, one per message. Skip any the files already answer.

1. "What are the 3 jobs people use this GPT for most?" (These become the
   test prompts and the trigger words in the description.)
2. "When should it not be used?" (Offer your guess from the instructions.)
3. "Which numbers must be exact?" (Offer the limits the audit found.)

## Step 4. Map every part

Read [references/migration-map.md](references/migration-map.md). Then write
the map in a short table: GPT part, where it goes in the skill, and what
changes. Show it and wait for a yes. Never drop a rule silently. If you merge
or remove one, say which and why.

## Step 5. Build the skill

Folder name = the `name` field, lowercase with hyphens.

- `SKILL.md`: front matter (name, description), then the workflow in steps,
  rules with a reason each, the output format, a guardrails section and a
  self-check section. Under 300 lines.
- Description: what it does, when to use it (with the words people type,
  from question 1), and when not to (question 2). Third person.
- `references/`: one file per topic from the knowledge files, converted to
  Markdown. Link each from SKILL.md with one line on when to read it.
- `scripts/`: a check for every exact number from question 3. Start from
  `scripts/limits_check.py` (character, word and item counts).
- `evals.md`: the 3 jobs from question 1 as test prompts, plus 1 prompt that
  must not trigger the skill. Say what a good answer contains.

Rules for the rewrite (from Anthropic's skill best practices):

- Turn shouted rules into calm ones with a reason. "Keep headlines to 30
  characters, because Google rejects longer ones."
- Cut what Claude already does well. Keep what the GPT needed to correct.
- Keep the GPT's voice and examples. They are usually the best part.

## Step 6. Check and package

1. Run `python3 "${CLAUDE_SKILL_DIR}/scripts/validate_skill.py" <folder>`. Fix every FAIL. Fix a
   WARN unless you can say why it does not apply.
2. Run the 3 eval prompts against the new skill in your head, step by step,
   and fix any step that would go wrong.
3. Run `python3 "${CLAUDE_SKILL_DIR}/scripts/package_skill.py" <folder>`. It writes `<name>.zip`.
4. Tell the person how to install it: Claude, Customize, Skills, Upload a
   skill. Run this locally in Claude Code, Cursor, Codex, Antigravity, or Gemini CLI (or in Claude.ai with Code Execution enabled) (Settings, Capabilities).

## Guardrails

- Actions do not carry over. For each action, say what replaces it: a Claude
  connector if one exists, a script, or a manual step. Never write API keys
  into the skill. Keys belong in the connector.
- Do not invent rules or facts the GPT did not have. If something looks
  missing, ask.
- Knowledge files may hold private data. Keep them in the skill only if the
  person says the skill stays private.

## Self-check before you answer

- Every GPT rule is in the skill, merged, or listed as removed with a reason.
- The description has a "use when" and a "do not use" part.
- Every exact number has a script check.
- validate_skill.py shows no FAIL.
- The answer ends with: the zip, the install steps, and the 3 test prompts.

## Output

1. The audit findings (3 to 5 lines).
2. The migration map (table).
3. The zip, then install steps.
4. The 3 test prompts to try first.
