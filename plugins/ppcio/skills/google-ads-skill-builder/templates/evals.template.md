# Evals for {{skill-name}}

Run each prompt with the skill on. Compare with the same prompt and no skill.

## 1. {{Normal case}}
Prompt: "{{what the user would really type}}"
Files: {{input}}
Good looks like:
- {{observable behaviour}}
- {{observable behaviour}}

## 2. {{Second normal case, different phrasing}}
Prompt: "..."
Good looks like:
- ...

## 3. Edge case: {{missing data / tiny account / trap}}
Prompt: "..."
Good looks like:
- Asks for {{missing input}} or stops with a clear reason.
- Does not {{the tempting wrong move}}.
