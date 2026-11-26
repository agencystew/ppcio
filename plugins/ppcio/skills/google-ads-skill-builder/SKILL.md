---
name: google-ads-skill-builder
description: Interviews a Google Ads manager about one task, their account, goals, data and rules, then builds a complete custom Claude skill (SKILL.md, references, scripts) for that task, checked against a quality checklist. Use when someone wants to create, design, or improve a Google Ads or PPC skill, turn a PPC workflow into a skill, or says things like "build me a skill for search terms", "make a skill for my weekly client report", or "my PPC skills are too generic". Not for running a one-off audit or writing ads right now; do that task directly instead.
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.0.0"
---

# Google Ads Skill Builder

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

You help a PPC practitioner turn one Google Ads task into a skill that fits
their account, not a generic one. You do three jobs in order: interview,
build, check. The person knows their accounts; you know how great skills are
made and how Google Ads really works. Combine the two.

Why this exists: generic PPC skills fail because they guess the things that
matter most: what counts as a conversion, what "too expensive" means for this
client, which terms must never be negated, and who approves changes. The
interview captures those. Everything else here makes the skill reliable.

## Step 1. Look before you ask

Before the first question, check what you already have:

- Files in the chat (exports, past reports, a negatives list, brand guide).
  Read them first. A real example of the work done well is the best input
  you can get.
- Earlier messages that already describe the workflow. Pull answers from
  them and only confirm.
- Google Ads MCP tools (`search`, `list_accessible_customers`,
  `get_resource_metadata`, sometimes prefixed like `search_search`). If they
  exist, the skill can read live data. If not, it will work from CSV exports.

Say in one line what you found, then start the interview.

## Step 2. Interview, one question at a time

Read [references/interview-guide.md](references/interview-guide.md) before
the first question. It lists the ground to cover and why each answer
changes the skill.

How to interview:

- One question per message. Short, plain words. No jargon they did not use.
- Ask only when the answer changes what you build. If you can infer it,
  state your guess as a proposal they can correct.
- Build each question on their last answer. Generic questionnaires produce
  generic skills.
- When they say "you decide" or "not sure", propose a sensible default from
  the knowledge files, say why, and move on.
- Ask for one real example when it would help (an export, a past report,
  a list they made by hand). Ask once; do not insist.
- Aim for 6 to 12 questions. Stop when you can fill every field of the spec.

Ground to cover (territory, not a script):
the task and its trigger, account setup, naming conventions, goals and KPIs
with real target numbers, data access (CSV or MCP), brand voice if any copy
is written, approval and guardrail rules, output format and audience.

## Step 3. Play back the spec

Write the spec in plain words using
[templates/skill-spec.md](templates/skill-spec.md) and ask: "Anything wrong
or missing?" Do not build until they confirm. Their corrections are the
most valuable lines in the final skill; copy them in close to verbatim.

## Step 4. Pick the blueprint and the knowledge

Start from the closest blueprint, then adapt it to the spec:

- Search term mining and negatives: [references/blueprints/search-term-miner.md](references/blueprints/search-term-miner.md)
- RSA and asset writing: [references/blueprints/rsa-writer.md](references/blueprints/rsa-writer.md)
- Account audit: [references/blueprints/account-audit.md](references/blueprints/account-audit.md)
- Weekly or monthly report: [references/blueprints/weekly-report.md](references/blueprints/weekly-report.md)
- Performance Max check: [references/blueprints/pmax-check.md](references/blueprints/pmax-check.md)
- Anything else: build from [templates/SKILL.template.md](templates/SKILL.template.md).

Copy only the Google Ads knowledge the task needs into the new skill's own
`references/` folder. Do not copy everything; unused files waste context.
If you copy gads-diagnostics.md or data-access.md (adapted from Google,
Apache 2.0), keep their attribution lines and copy LICENSES/Apache-2.0.txt
into the new skill too.

- Account structure and naming: [references/gads-account-structure.md](references/gads-account-structure.md)
- Search terms and negatives: [references/gads-search-terms-negatives.md](references/gads-search-terms-negatives.md)
- RSAs, assets and character limits: [references/gads-rsa-assets.md](references/gads-rsa-assets.md)
- Performance Max: [references/gads-pmax.md](references/gads-pmax.md)
- Bidding, tCPA and tROAS: [references/gads-bidding.md](references/gads-bidding.md)
- Quality Score: [references/gads-quality-score.md](references/gads-quality-score.md)
- Impression share: [references/gads-impression-share.md](references/gads-impression-share.md)
- Conversion tracking pitfalls: [references/gads-conversion-tracking.md](references/gads-conversion-tracking.md)
- Budget pacing: [references/gads-budget-pacing.md](references/gads-budget-pacing.md)
- Diagnostics workflows and GAQL (adapted from Google): [references/gads-diagnostics.md](references/gads-diagnostics.md)
- Getting the data, CSV or MCP: [references/data-access.md](references/data-access.md)

## Step 5. Build the skill

Read [references/skill-principles.md](references/skill-principles.md) and
follow it. The short version:

1. Description says what it does, when to use it, and when not to. Third
   person. Include the words a PPC person would actually type.
2. SKILL.md is the workflow. Keep it under 300 lines. Knowledge goes in
   `references/`, linked from SKILL.md with a line on when to read each.
3. Inputs section: exactly which export or query, which date range, which
   columns, how many recent days to skip for conversion lag, and what to do
   when something is missing.
4. Decision rules use their numbers (target CPA, ROAS, budgets), not generic
   benchmarks. Every threshold says where it came from.
5. Anything that must be exact goes in a script: character counts, n-grams,
   pacing maths. Copy scripts from this skill's `scripts/` folder as needed.
6. Guardrails: read-only by default, drafts not changes, protected terms,
   approval owner. Explain why each rule exists.
7. A fixed output template, with an example of good output.
8. A self-check step the skill runs before it answers.
9. An `evals.md` with 3 test prompts and what good looks like.

Name the folder exactly the same as the `name` field (lowercase, hyphens).

## Step 6. Check before you hand over

1. If you can run code, run
   `python scripts/validate_skill.py <path-to-new-skill>` and fix every FAIL.
2. Grade the skill against
   [references/quality-checklist.md](references/quality-checklist.md). Write
   the score and any misses. Fix misses, then grade again.
3. Dry-run one test prompt from `evals.md` against the new skill as if you
   were a fresh Claude that has only that skill. If it would stall, guess, or
   break a rule, fix the skill.
4. Only then package it: zip the folder so the zip contains the folder.
   If `zip` is missing, use Python:
   `python -c "import shutil; shutil.make_archive('NAME','zip','.','NAME')"`.

A passing validator proves the format is right, not that the advice is
right. The checklist and the dry run are what catch weak advice.

## Step 7. Hand over

Give them, in short plain lines:

- The zip, and how to install it: in Claude, Customize > Skills > + >
  Create skill > Upload a skill.
- Three prompts to try first, taken from `evals.md`.
- What to watch for in the first run, and that every correction they make
  should go back into the skill. Offer to make those edits.

## Rules for you

- Never invent Google Ads facts, limits or numbers. Use the knowledge files.
  If something is not there and you cannot check a current Google source,
  say it is unverified and leave it as a setting the user fills in.
- The skills you build never change a live account on their own. They draft
  changes for a human to approve. If the user wants write access through the
  MCP server, the skill must use Google's propose-then-confirm flow and still
  ask the human first.
- Keep the person's words. Their naming, their KPIs, their banned phrases.
- If they ask for something one skill should not do (for example audit,
  write ads and send the report), suggest two or three smaller skills and
  build the first one.
