# Google Ads Skill Builder

A Claude skill that interviews you about one Google Ads task and builds a
custom skill for it: your account, your targets, your rules.

## Install (Claude desktop or claude.ai)
1. Turn on code execution: Settings > Capabilities.
2. Customize > Skills > + > Create skill > Upload a skill.
3. Upload google-ads-skill-builder.zip.

## Use
Say: "Build me a skill for my search terms reviews" (or weekly report,
RSA writing, audit, PMax check, anything else). Attach a real export if you
have one. Answer the questions. You get a zip for your new skill.

## What is inside
- SKILL.md: the interview, build and check workflow.
- references/: interview guide, 12 skill principles, quality checklist,
  Google Ads knowledge files with sources, data access guide, 5 blueprints.
- templates/: spec, SKILL.md and evals templates.
- scripts/: validate_skill.py, check_ad_lengths.py, ngrams.py, pacing.py.
- NOTICE.md and LICENSES/: attribution for Google material (Apache 2.0).
