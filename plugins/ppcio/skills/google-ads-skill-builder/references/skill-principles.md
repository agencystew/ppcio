# What makes a skill work

Twelve principles, taken from the best public skills. Apply all of them to
every skill you build. Each has a source you can open.

## Contents
1. The description is the trigger
2. Short SKILL.md, knowledge on demand
3. Only teach what the model gets wrong
4. Explain the why; match strictness to risk
5. Decision trees for diagnosis
6. Scripts for anything that must be exact
7. A verification loop before answering
8. Guardrails and a plan for missing tools
9. Ask before acting, one question at a time
10. Show good and bad examples, name the defaults
11. Test it like Google does: evals and a baseline
12. Nothing that goes stale

## 1. The description is the trigger
An AI agent picks a skill from its name and description alone, so the
description must say what it does, when to use it, and when not to.
- Anthropic: "The AI agent uses it to choose the right Skill from potentially 100+
  available Skills." Write in third person.
  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Anthropic's skill-creator notes Claude tends to "undertrigger" skills and
  suggests descriptions be "a little bit 'pushy'".
  https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md
- Google: 180 of the 206 skills in google/skills say when not to use them,
  for example "Don't use for setting up new campaigns".
  https://github.com/google/skills
- obra/superpowers: the description "never summarizes the skill's workflow,
  because an agent that reads a workflow summary follows it instead of
  reading the skill."
  https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md
Do: what + when (the words a PPC person types) + not-for. Max 1,024 chars.

## 2. Short SKILL.md, knowledge on demand
Only the name and description load at start. SKILL.md loads when the skill
fires. Reference files load only when needed.
- Anthropic: keep the body "under 500 lines"; keep references "one level
  deep from SKILL.md"; give long files a table of contents.
- Google goes further: reference files open with a contents list that gives
  line ranges, for example "Read Tools: Lines 12-52".
  https://github.com/google/skills/blob/main/skills/ads/google-ads-api-mcp-setup/references/tools.md
Do: workflow in SKILL.md (aim under 300 lines), knowledge in references/,
each link says when to read it.

## 3. Only teach what the model gets wrong
- Anthropic: "Default assumption: Claude is already very smart. Only add
  context Claude doesn't already have."
- Google's whole pmax-listing-filter skill is a few lines that correct one
  false belief: "Do not falsely claim webpage URL contains filters are
  unsupported at the Asset Group level."
  https://github.com/googleads/google-ads-api-developer-assistant/blob/main/plugins/google-ads-api-developer-assistant/skills/pmax-listing-filter/SKILL.md
- Google's MCP server added this hint on 10 Nov 2026: "Status fields ...
  hold the current status, not the status during the date range ... Entities
  paused or removed during the range would drop out and totals would
  understate cost and conversions."
  https://github.com/googleads/google-ads-mcp/blob/main/ads_mcp/tools/search.py
Do: spend words on gotchas, account rules and thresholds, not on explaining
what a CPA is.

## 4. Explain the why; match strictness to risk
- skill-creator: "If you find yourself writing ALWAYS or NEVER in all caps
  ... that's a yellow flag", explain the reasoning instead.
- Anthropic's "degrees of freedom": a narrow bridge with cliffs gets exact
  steps; an open field gets general direction.
- Google uses hard MUST checklists, but only for fragile steps such as setup
  and error answers ("your response MUST include ...").
  https://github.com/google/skills/blob/main/skills/ads/google-ads-api-quickstart/SKILL.md
Do: firm rules for money and irreversible actions, with a reason; judgement
for analysis and writing.

## 5. Decision trees for diagnosis
Google's low lead flow workflow is a tree, not an essay: confirm the drop;
did traffic drop or conversion rate? If traffic, check impression share
(budget or rank). If conversion rate, split by device and conversion action.
Then check the change history.
https://github.com/google/skills/blob/main/skills/ads/google-ads-api-account-diagnostics/SKILL.md
Do: write diagnostic skills as "if X, check Y" branches with a stop rule.

## 6. Scripts for anything that must be exact
- Anthropic checklist: "Scripts solve problems rather than defer to Claude"
  and "No 'voodoo constants' (all values justified)".
- Anthropic's xlsx skill makes a recalculation script mandatory and says
  "never treat a clean exit as a clean workbook."
  https://github.com/anthropics/skills/blob/main/skills/xlsx/SKILL.md
- Google's Developer Assistant runs validate_gaql.py before any query;
  it rejects OR, unbounded dates and bad click_view filters.
Do: character counts, n-grams, pacing and totals go in scripts. Models
miscount characters.

## 7. A verification loop before answering
- Anthropic: "Run validator, fix errors, repeat. This pattern greatly
  improves output quality."
- xlsx: "A green recalc proves your formulas evaluate, not that they are
  right."
- superpowers: "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE."
  https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md
Do: end every built skill with a self-check list it must pass before it
answers (totals reconcile, limits met, guardrails respected).

## 8. Guardrails and a plan for missing tools
- Google's diagnostics skill checks its tools first, and if they are missing
  it still helps: it hands over the GAQL, the gotchas and next steps.
- It knows when to stop: if the upload summary is empty, "immediately
  stop ... rather than retrying".
- Google's MCP write tools use propose-then-confirm: a dry run returns a
  checksum, and the change only goes through when called again with it
  "after user approval".
  https://github.com/google/skills/blob/main/skills/ads/google-ads-api-mcp-setup/references/tools.md
- Google's Developer Assistant: "NO MUTATE ... All mutations must be
  generated as code scripts ... for the user to execute."
Do: read-only by default, drafts not changes, a CSV path when there is no
API, explicit stop rules.

## 9. Ask before acting, one question at a time
- superpowers brainstorming: "Ask a question only when the answer would
  change what gets built ... Ask one at a time." And: "A proposal they can
  correct, plus your reason for it, often beats a question."
  https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md
- skill-creator: "Proactively ask questions about edge cases, input/output
  formats, example files, success criteria".
Do: built skills ask for missing essentials (target CPA, date range) before
analysing, and say what they assumed.

## 10. Show good and bad examples, name the defaults
- Anthropic's frontend-design skill lists the looks AI design "clusters
  around" so the model can avoid them.
  https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- Anthropic best practices: "Examples are concrete, not abstract."
Do: give one good output, one bad output, and a list of generic tells
(for ad copy: the phrases every AI ad uses).

## 11. Test it like Google does: evals and a baseline
- Anthropic: "Create evaluations BEFORE writing extensive documentation"
  and compare against Claude without the skill.
- Google's 14 Oct 2026 commit to its diagnostics skill is tagged
  "#skill-tuner" and adds "eval case `mcp_tools_unavailable_fallback` in
  `EVAL.txtpb`". The eval files are not public.
  https://github.com/google/skills/commit/300d74bfeec2e1bd62c71255483af8c9b406b745
- Google's first version (24 Jul 2026) shipped an example query selecting
  metrics.cost_micros with segments.conversion_action, which GAQL rejects;
  the fix and a gotcha came in that later commit.
Do: every built skill ships evals.md with 3 prompts and what good looks like.

## 12. Nothing that goes stale
- Anthropic: "Avoid time-sensitive information"; put old methods in an
  "old patterns" section.
- Google's quickstart: "Do not rely on hardcoded defaults"; resolve the
  latest API version at the start of each run.
Do: no "as of this month" claims in built skills. Put limits that can
change in one reference file with the source link, so they are easy to update.
