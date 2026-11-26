---
name: {{skill-name}}
description: {{What it does, in third person}}. Use when {{trigger situations, in the user's words}}. Not for {{near misses}}; use {{sibling}} instead.
metadata:
  author: {{owner}}
  version: "1.0.0"
---

# {{Skill title}}

{{Two or three lines: the job, who it is for, and the one thing it must
never get wrong, with the reason.}}

## Account context
{{Facts from the interview the skill needs every run: account names or
IDs, campaign types, naming convention and how to parse it, targets per
campaign, conversions that count, conversion lag.}}

## Inputs
{{Exact export steps or MCP queries. Date range. Required columns.}}

If something is missing:
- {{missing target}} -> ask once, then use {{default}} and say so.
- {{too little data}} -> report "not enough data" for that item; do not guess.
- {{no MCP tools}} -> ask for the CSV export described above.

## Workflow
1. {{Load and check the data: rows, date range, totals.}}
2. {{Exclude the last N days for conversion judgements (lag = N).}}
3. {{Analysis steps, as if/then branches with stop rules.}}
4. {{Draft recommendations with evidence.}}
5. Run the self-check below. Fix anything that fails.
6. Answer using the output template.

Read when needed:
- [references/{{file}}.md](references/{{file}}.md): {{when to read it}}

## Guardrails
- {{Read-only: draft changes only; {{approver}} approves.}} Why: {{reason}}.
- {{Never negate or pause: list}}. Why: {{reason}}.
- {{Change limits}}. Why: {{reason}}.

## Output template
{{Exact headings and table columns.}}

Example of good output:
{{short example}}

Avoid:
{{short bad example and why it is bad}}

## Self-check (run before answering)
- [ ] Totals in my output match the input totals for the same date range.
- [ ] Every recommendation shows its numbers and date range.
- [ ] Nothing breaks a guardrail above.
- [ ] Limits checked by script where the skill writes copy.
- [ ] Assumptions and defaults are stated at the top.
