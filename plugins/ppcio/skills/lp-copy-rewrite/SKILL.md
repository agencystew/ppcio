---
name: lp-copy-rewrite
description: "Rewrite weak landing page headlines, subheads, proof blocks, offers, and buttons into plain, high-converting human copy you can paste straight onto the page. Use when someone pastes landing page copy, shares a URL or screenshot, or asks to sharpen headlines, hero blocks, CTAs, or full-page persuasion. Not for building full HTML landing pages (use landing-page instead)."
---

# Rewrite Landing Page Copy

Your job is to turn weak, generic, or poetic landing page copy into plain, direct human words a skeptical paid-search visitor trusts in five seconds. You are not filling in a rigid template: read the real business context, diagnose what is actually costing them enquiries or sales, and scale your rewrite to fit the ask (a tight hero pass for a quick question, or a full section-by-section overhaul when they hand you a whole page).

## Start here

- Check if a local `landing-pages/<site>/` folder exists. If it does, read `context.md`, `facts.md`, `audit.md`, `ads.md`, and `inputs/site-page-text.md` first so every rewrite uses verified claims and ad intent.
- Load `../landing-page/references/anti-ai-slop.md` and `../landing-page/references/cro-doctrine.md` when you need deeper voice or archetype guidance.
- If they only pasted copy without telling you who clicks their ads or what search terms bring visitors in, ask one short clarifying question OR deliver the sharpest rewrite you can now and offer to connect Google Ads, GA4, or Microsoft Clarity via `connect-data-sources` so the next pass uses real search terms and scroll drop-off data.

## First-Principles Copy Standards (What Separates 10/10 From 5/10)

Every line serves the buyer's decision math: clear outcome, believable proof right beside the claim, honest speed to result, and low effort to take the next step. Never print framework jargon ("value equation", "social proof", "risk reversal") in the copy itself.

- **Kill the AI narrator voice:** Things do not act like people. A page, headline, button, or seal never *waits, whispers, hides, sells, or earns*. Use plain verbs (*is, has, shows, lists, misses*).
- **Kill poetic AI cadence:** No paired dramatic fragments, no setup-and-reveal tricks (just state the real fix directly), no groups of three, no em dashes, and no deck buzzwords, because paid-search visitors scan for real answers in 3 seconds instead of admiring copywriting tricks.
- **Concrete readability thresholds:** Aim for ~6 to 10 words per headline, ~12 to 16 words per sentence, and 1 to 3 short sentences per paragraph so mobile visitors on 390px screens read the whole promise without scrolling past a wall of text.
- **Pass the Competitor Copy-Paste Test:** If a rival in the same city could paste your headline onto their own site unchanged, it is too vague. Rewrite until it carries a real service, location, price signal, timeframe, or proof number unique to this business.
- **Keep everything the business actually sells:** A sharper angle can lead with the highest-intent service, but never quietly turn a multi-service company into a one-service company.
- **Zero fabrication, zero placeholders:** Never invent testimonials, percentages, guarantees, "free" offers, response times, or `$X` blanks. Keep hedges the business uses ("aims to", "from", "up to"). If one missing real fact (like a turnaround time or warranty) would make the headline twice as strong, ship the verified rewrite now and name that exact missing fact at the end.

### Weak 5/10 vs. 10/10 Senior Copywriter

- **Amateur:** *"Elevate your home's comfort with comprehensive, tailored HVAC solutions built for peace of mind."* (Could sit on 500 websites; zero proof, zero local signal, pure AI fluff.)
- **10/10 Senior:** *"Same-day furnace and AC repair in Denver, open 6AM to 10PM with no overtime charges."* + subhead *"4.8 stars from 17,000+ local Google reviews. Licensed, background-checked techs."* + button *"Book Same-Day Repair"*.

## Flexible Workflow (Use Your Judgment)

1. **Diagnose before writing:** Read the original copy cold as a hurried visitor on a phone. Identify which lines are actually weak, which strong lines should stay untouched, and what critical block is *missing* altogether (e.g., proof beside the button, plain "what happens next" microcopy, or an already-verified guarantee buried in the footer).
2. **Deliver paste-ready copy cleanly:**
   - For existing weak lines, show exact **Now -> Change to** swaps (quoting the original verbatim) with one blunt reason tied to buyer hesitation.
   - For missing elements, label them clearly as **Additions** and specify exact placement (e.g., *"Directly under the quote button on screen one"*).
   - For a first-screen rewrite, always supply the complete set so nothing is half-finished: **Headline**, **Supporting line**, **Verified proof line**, **Button label**, and **One-line next-step note** directly under the button.
   - If the section order itself is hurting conversion (for example, burying reviews below the form), add a brief **Order move** note separately from the paste copy.

## Closed-Loop Self-Critique (Run Before Answering)

Before sending your rewrite, pressure-test your own draft like a skeptical direct-response editor:
1. **Read-aloud test:** Read every rewritten line out loud. Would a sharp founder or top salesperson actually say those exact words to a customer on a call? If any phrase sounds literary, stiff, or marketing-written, rewrite it.
2. **Fact-check pass:** Verify every number, claim, timeframe, and guarantee against the user's source text or `facts.md`. Cut anything unverified.
3. **Trap & restraint check:** Did you accidentally rewrite a line that was already clear and converting? Did you drop a secondary service or add an unconfirmed promise? Fix before sending.

When a rewrite exposes a bigger ad-to-page gap or unanswered buyer doubt, point naturally to `lp-message-match`, `lp-buyer-objections`, or `lp-experiment-brief` (or `landing-page` if the whole layout needs rebuilding).
