---
name: lp-message-match
description: "Audit whether a landing page keeps the exact promise your Google Ads or Meta ad made, diagnose click-to-page drop-off across five alignment seams, and rewrite the opening so ad and page agree. Use when someone shares ads, search terms, or campaigns alongside a landing page and asks why paid clicks are not converting. Not for full HTML page rebuilds (use landing-page instead)."
---

# Ad-to-Landing-Page Message Match

Paid search clicks are expensive and impatient. When a visitor clicks an ad expecting one specific service, price, or outcome and lands on a generic homepage talking about something else, they hit Back in three seconds. Your job is to inspect both sides cold, pinpoint the exact seam where scent breaks, and deliver a paste-ready opening that makes the click feel immediately right.

## Start here

- Check for a local `landing-pages/<site>/` folder first. If present, read `ads.md`, `context.md`, `facts.md`, `inputs/site-page-text.md`, `inputs/site-page-text-phone.md`, and the desktop/phone screenshots.
- Reference `../landing-page/references/above-the-fold-and-message-match.md` when you need awareness-stage or mobile first-screen rules.
- If they shared the landing page without real search terms or ad copy, tighten any obvious opening friction now, clearly label inferred intent as a hypothesis, and offer to pull real search terms and ad headlines via `connect-data-sources` (Google Ads or Meta Ads CSV or read-only connection) so the match check runs on real spend data instead of guesses.

## First-Principles Alignment Diagnostic

Always check the full **Alignment Chain** (`Search Term -> Keyword -> Ad -> First Screen -> Offer -> Next Step`) and watch for the classic **CTR / CVR Trap**:
- **High CTR + Low CVR** almost always signals a message-match break, a hidden offer, mobile layout failure, or broken tracking.
- **Low CTR + High CVR** often means the ad is pre-qualifying buyers (for example, putting a real starting price in the ad to filter out tire-kickers). Never "fix" CTR in a way that floods the page with unqualified clicks and tanks lead quality.

Inspect all **five alignment seams** on BOTH desktop and 390px mobile (an offer buried three screens down does not save a cold phone click):
1. **Promise & keyword scent:** Does the H1 confirm the exact problem, service, or product the ad promised in the buyer's own words?
2. **Audience & geography fit:** If the ad targeted Austin emergency homeowners or B2B CFOs, does screen one prove they are in the right place immediately?
3. **Offer & price continuity:** If the ad mentions "$75 off", "Free inspection", or "From $299", is that exact offer visible beside the first button with the same conditions?
4. **Proof proportional to the ask:** Does screen one back up the ad's boldest claim with verified reviews, credentials, or real photos right away?
5. **Next-step continuity:** If the ad says "Get an instant quote" or "Book online today", does screen one actually show that form or booking step instead of dumping them into a phone-only page or 12-link nav menu?

### Weak 5/10 vs. 10/10 Senior Diagnosis

- **Amateur:** *"Your headline should include your main keyword 'emergency dentist Austin' for better message match and relevance."* (Textbook advice; ignores mobile fold, offer drop-off, and CTA mismatch.)
- **10/10 Senior:** *"Your ad promises 'Same-Day Toothache Relief in Austin - $99 Exam', while the mobile first screen opens with 'Family Dentistry Since 2004' and hides the $99 exam four scrolls down behind a 'Contact Us' menu link. Change the mobile H1 to 'Same-Day Emergency Dental Care in Austin' with '$99 Emergency Exam & X-Ray' directly above 'Book Today's Opening'."*

## Flexible Execution (Match Depth to the Account)

Scale your output to what the user gave you because a single urgent search campaign needs a 60-second hero fix while a 12-ad-group account needs a routing table (flagging where 2+ intents should split onto dedicated landing pages instead of forcing one bloated headline to serve everyone).

1. **Name the single biggest mismatch first** in plain English, quoting both sides verbatim (ad/search term vs. first-screen line). Never invent a review count, discount, or turnaround time to force a match; every figure must trace to verified source data.
2. **Verify whether the fix belongs on the page, in the ad, or in campaign structure** (sometimes the landing page is fine and the ad is over-promising or buying off-intent queries; flag `rsa-asset-writer` or `search-term-miner` when the ad side is the real culprit).
3. **Deliver the paste-ready first-screen fix:** **Headline**, **Supporting line**, **Verified proof line** (or name the exact proof missing), **Button label**, and **Next-step microcopy**, keeping every claim, price, and hedge 100% faithful to verified facts.
4. **Add a guardrail:** Before editing live ads or pages, verify conversion tracking stays intact and plan to judge results on **cost per qualified lead/sale** after at least 14 days and enough clicks (`expected_leads >= 2`), never on 1-day CTR noise.

## Closed-Loop Self-Critique (Run Before Answering)

Pressure-test your draft before sending:
1. **Truth & quote audit:** Are both sides quoted word for word from real inputs? Did you invent any discount, speed claim, or review count to force a match? If so, cut it and state the exact fact needed.
2. **Mobile reality check:** Would a tired visitor on a 390px phone see the ad's promise AND the main action without scrolling?
3. **Human voice check:** Strip any em dashes, poetic fragments, or marketing jargon ("friction", "funnel", "scent") from customer-facing copy.

If the page passes message match cleanly and visitors still hesitate, suggest `lp-buyer-objections`, `lp-copy-rewrite`, or checking Microsoft Clarity scroll/rage-click data via `connect-data-sources`.
