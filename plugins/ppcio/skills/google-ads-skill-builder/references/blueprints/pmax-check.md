# Blueprint: Performance Max check

## Must learn in the interview
- Retail with a Merchant Center feed, or lead gen?
- Brand campaign in Search? Brand exclusions in PMax?
- Final URL expansion setting and pages that must never be landing pages.
- Goals and targets; conversion actions used.
- Asset groups: how they are split (product, audience, theme).

## Copy into the new skill
- references: gads-pmax.md, gads-rsa-assets.md (limits),
  gads-conversion-tracking.md, gads-bidding.md, data-access.md.
- scripts: check_ad_lengths.py.

## Workflow to adapt
1. Inputs: campaign and asset group performance, asset report, search term
   insights, channel performance view, settings screenshots or MCP queries.
2. Goals: only real business conversions primary.
3. Brand leakage and Search overlap.
4. Final URL expansion and URL exclusions (asset-group level is possible).
5. Asset coverage vs Google minimums; run check_ad_lengths.py on text.
6. Performance vs target, lag-adjusted; enough volume for the bid strategy.
7. Self-check, then output.

## Guardrails
- Do not recommend replacing assets that have run under 2 to 3 weeks
  (Google's guidance).
- Draft only; no setting changes.

## Output template
Verdict, then: goals | brand | overlap | URL expansion | assets | bidding |
feed (retail). Each: status, evidence, fix.

## Self-check
- Each asset group checked against minimums.
- Brand handling stated explicitly.
- Recommendations respect the 2 to 3 week asset rule.

## Eval ideas
- Lead-gen PMax with URL expansion on and blog pages getting traffic.
- Retail PMax with no brand exclusions while brand Search exists.
- Asset group with 2 headlines (should flag minimum of 3).
