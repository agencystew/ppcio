---
name: lp-experiment-brief
description: "Turn a landing page conversion finding into a clear, buildable developer/designer handoff brief or single-variable A/B test spec with honest statistical power, low-traffic guidance, and QA/rollback guardrails. Use when scoping a landing page test or writing a CRO ticket. Not for finding Google Ads campaign experiments (use ppc-experiment-finder instead)."
---

# Landing Page Experiment & Developer Brief

Most CRO tests fail before they even launch: teams bundle five unrelated changes into one messy redesign, run a split test on 80 visitors a week where math can never reach significance, break GTM conversion tracking during the build, or hand a designer vague feedback like *"make the hero pop"*. Your job is to turn a sharp conversion hypothesis into one clean, verifiable change that any designer or developer can ship cleanly and measure honestly.

## Start here

- Check if a local `landing-pages/<site>/` folder exists. If so, read `context.md`, `audit.md`, `audit/leaks.json`, `facts.md`, and `inputs/site-facts.json` (especially platform and tracking tags) first.
- If the user has traffic and conversion numbers from GA4 or Google Ads, use real arithmetic to size the test. If not, ask for monthly page sessions and monthly conversions (or offer to pull them via `connect-data-sources`) before estimating runtime.

## First-Principles Testing & Handoff Rules

1. **Separate the Evidence Contract from the Build Direction:** Lock verified business claims, prices, phone numbers, legal copy, and tracking tags as immutable facts because designers and developers otherwise accidentally invent a stat or drop GTM/Google Ads conversion tags. Zero fabricated numbers, testimonials, or lift promises are ever allowed.
2. **One primary lever per test:** Isolate ONE buyer problem and ONE coherent change so results stay interpretable. (Wait: changing a headline AND its matching subhead + hero button is one coherent message-match lever; changing the hero, rewriting pricing, and swapping the form simultaneously is a blind gamble.)
3. **Be ruthlessly honest about sample size & traffic:**
   - Never pretend a low-traffic SMB page can run a clean A/B test. As a practical floor, pages getting **under ~250 to 300 conversions per month** usually need 8 to 16+ weeks to detect realistic lifts (15% to 20%) at 95% confidence.
   - Below that threshold, tell them straight: **ship the obvious high-confidence fix directly** (with strict desktop/mobile/form/tracking QA and a clear rollback snapshot) instead of wasting months on an underpowered split test, and note plainly that simple before/after comparisons cannot isolate seasonality or ad-mix shifts on their own.
   - Remember: an audit score is NOT a conversion rate, and raw button clicks are NOT revenue. Always anchor success on **qualified leads, bookings, or sales** (plus guardrail metrics like bounce rate, lead close rate, or mobile page speed).

### Weak 5/10 vs. 10/10 Senior Brief

- **Amateur:** *"Test a cleaner hero with better social proof and a stronger CTA button to lift conversions by 20% over the next two weeks."* (Bundles multiple guesses, invents a fake 20% lift promise, skips mobile specs, ignores traffic math and tracking protection.)
- **10/10 Senior:** *"Hypothesis: Mobile Google Ads clicks (1,800/mo, 42 leads/mo) miss the $75 off offer and 17,000+ Google reviews because both sit off-screen on 390px devices. Traffic is too low for a clean split test (~12 weeks needed), so ship direct with a 14-day rollback checkpoint. Change: Insert verified 4.8-star/17,000+ badge and '$75 off any service' directly above the existing 'Call Now: (303) 328-3060' button on mobile. Keep: GTM, Google Ads call-swap script, phone href, and form action untouched. Check: Verify DNI phone swap, form submit, and 0px mobile overflow before launch; track qualified calls >=20s and valid forms over 14 to 28 days."*

## Flexible Output Structure

Adapt depth cleanly to what the user needs (a sharp 1-screen ticket for a solo dev, or a complete Jira/agency client spec when requested), always covering:
- **Hypothesis & Target Problem:** The exact buyer blocker, backed by real page/analytics evidence.
- **Exact Change (Desktop & 390px Mobile):** Paste-ready copy, proof placement, and layout specifics with zero ambiguity.
- **Immutable Keep List (Guardrails):** Claims, prices, disclaimers, working form endpoints, DNI phone scripts, and tracking tags (`GTM`, `GA4`, `Google Ads`) that MUST stay intact.
- **Ship vs. A/B Test Decision & Math:** Honest runtime estimate (if traffic supports a split test) OR direct-ship recommendation with a clear rollback trigger (e.g., revert if qualified conversion rate drops >20% across 200+ clicks with stable traffic mix).
- **Pre-Launch QA & Success Metric:** Exact primary metric (qualified enquiries/sales), guardrail metric, and 4-point QA check (desktop, 390px phone, test submission/call, tag firing check).

## Closed-Loop Self-Critique (Run Before Answering)

Before handing over the brief, challenge it like a picky lead engineer and CRO director:
1. **Ambiguity test:** Could a developer build this cleanly tomorrow morning without Slack-messaging five follow-up questions?
2. **Truth & math test:** Did I promise a fake percentage lift? Did I recommend an A/B test on too few conversions? Did I protect tracking tags and form endpoints explicitly?
3. **Voice check:** Clear, direct, plain human prose with zero em dashes or marketing fluff.

Pair naturally with `lp-copy-rewrite` to draft exact test copy, `lp-buyer-objections` to sharpen the hypothesis, or `ppc-experiment-finder` when the bigger test belongs inside Google Ads campaigns.
