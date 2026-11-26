---
name: lp-experiment-brief
description: "Turn a landing page finding into a crisp, single-variable developer or designer handoff brief (Change, Why, Keep, Check) with honest A/B test sizing and low-traffic guidance. Use when briefing a designer/developer on a CRO change or scoping a landing page A/B test. Works standalone or on a local landing-pages/<site>/ audit. Not for finding Google Ads campaign experiments — use ppc-experiment-finder instead."
---

# Landing Page Experiment & Designer Brief

Turn a conversion finding into one clear, buildable change with zero ambiguity and an honest way to check whether it worked.

## Start here

- If a local `landing-pages/<site>/` folder exists, read `audit.md`, `audit/leaks.json`, and `inputs/site-facts.json` first. Otherwise work from the finding, page copy, or screenshots supplied.

## Method

1. Isolate **one primary problem** and the specific visitor action it affects. Explain why the change should reduce friction or hesitation. Remember: an audit score is not a conversion rate.
2. Specify **exact scope**: what changes (paste-ready copy, proof, or layout move), where it sits on desktop and mobile, and what MUST stay untouched (accurate claims, pricing, tracking tags, working forms, strong existing sections).
3. Keep unrelated ideas out of a single test so results stay interpretable.
4. Define the real success metric: **qualified enquiries, bookings, or sales** — never raw button clicks alone.
5. Be honest about traffic volume:
   - If monthly visitors and conversions are missing, ask for them before estimating A/B test duration or sample size.
   - For low-traffic pages (<~300 conversions/month), recommend shipping the obvious fix with a usability/QA check rather than running an underpowered split test, and note plainly that before-and-after comparisons cannot prove causation alone.

## Output

Default to a tight **under-100-word brief** (expand only if asked for a full Jira/client ticket):
- **Change:** Exact copy or layout change and where it goes.
- **Why:** The buyer blocker it removes.
- **Keep:** Claims, tracking, and sections that stay unchanged.
- **Check:** Primary conversion metric + pre-launch desktop/mobile/form/tracking QA checklist.
