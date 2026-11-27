---
name: lp-buyer-objections
description: "Pinpoint the exact unanswered buyer doubts stopping good-fit visitors from enquiring or buying on a landing page, and place the smallest verified copy, proof, or offer fix right where hesitation hits. Use when someone asks why visitors bounce, what doubts buyers have, why lead quality is poor, or where a page needs stronger proof or risk reversal. Not for full HTML page builds (use landing-page instead)."
---

# Buyer Objections & Hesitation Fix

Most landing pages fail not because the headline is slightly dull, but because a good-fit buyer reaches the form or checkout button with one big unanswered doubt in their head and closes the tab. Your job is to step into the shoes of a real skeptical buyer, find the exact decision point where trust breaks, and prescribe the smallest verified proof or copy move that removes that doubt without inventing claims.

## Start here

- Check if a local `landing-pages/<site>/` folder exists. If so, read `context.md`, `facts.md`, `audit/buyers.json`, `audit/journey-*.json`, `audit/trust.json`, and `inputs/site-page-text.md` first.
- Reference `../landing-page/references/offer-and-risk-reversal.md` and `../landing-page/references/cro-doctrine.md` when calibrating proof depth or guarantee patterns by ticket size.
- If the user has Microsoft Clarity rage-click/scroll data, GA4 funnel drop-off, or sales call transcripts/CRM objection logs, use them first! If not, work sharply from the page now and offer to connect Clarity, GA4, or call-tracking exports via `connect-data-sources` so the next iteration runs on real buyer behavior rather than assumptions.

## First-Principles Objection Lenses

Think through two realities that amateur CRO checklists miss:
1. **The Value Equation:** Buyers stall when they doubt the **real outcome**, doubt **it will work for someone like them** (proof & risk), fear **how long it takes**, or dread the **hassle/disruption** (pushy sales call, messy install, 15-field form).
2. **Qualification vs. Friction:** Removing every barrier is not always better. If a service business is drowning in junk leads, hiding all price signals or writing *"affordable for every budget"* attracts the wrong clicks. Sometimes the highest-leverage move is an honest starting price ("From $12,000" or "Minimum project $2,500") that reassures real buyers while filtering out bad fits (see `lead-gen-quality` when spam/junk leads are the core complaint).

Check the **six core buyer doubts** and focus only on the 1 to 3 that actually cost this business money:
- **Price & hidden cost:** "What does this roughly cost, and am I walking into surprise fees?"
- **Risk & regret:** "What happens if the work is shoddy, the timeline slips, or it does not fit?"
- **Suitability:** "Have you solved my exact problem/home/industry, or am I a guinea pig?"
- **Effort & hassle:** "Am I about to get spammed by 6 salespeople if I enter my phone number?"
- **Credibility:** "Are these real local pros with verified reviews, licenses, and real photos?"
- **What happens next:** "After I hit submit, do I get a price, a call in 10 minutes, or radio silence?"

### Weak 5/10 vs. 10/10 Senior Diagnosis

- **Amateur:** *"Add more social proof and a money-back guarantee near your CTA to reduce friction and build trust."* (Generic, ignores whether the business even offers a guarantee, and uses textbook jargon.)
- **10/10 Senior:** *"Homeowners pricing a $15,000 roof hesitate at 'Get Your Free Estimate' because they expect a 2-hour high-pressure kitchen-table pitch. Your FAQ already says 'Written quote in 30 minutes, valid for 30 days, zero obligation', but it sits 6 scrolls down. Move that exact sentence directly beneath the submit button, and pair it with your verified 4.8 rating from 4,100 Google reviews."*

## Flexible Workflow

1. **Map the real hesitation point:** Name the realistic good-fit buyer (be honest when modelling reactions vs. quoting real Clarity/call data) and quote the exact page line or gap where they pause.
2. **Mine existing verified proof first:** Search their page, footer, FAQ, warranty page, or `facts.md` for real proof, credentials, warranties, or terms that are already confirmed and simply buried in the wrong place.
3. **Prescribe surgical placement (never cram everything into the H1):** Keep the main headline clean and place each objection handler right beside the form, price, or button where that doubt arises.
4. **Stay strictly honest on missing proof:** If the page truly lacks a guarantee, real price range, or case study, never invent one. Name the single highest-value proof asset the business owner should confirm or supply and show the conditional wording to use once confirmed.
5. **Define how to verify the fix:** Pair the change with a plain success check (qualified form submissions / booked calls, not raw clicks) and watch for any drop in lead quality over 14+ days.

## Closed-Loop Self-Critique (Run Before Answering)

Before replying, run a fast skeptical check:
1. **Trap check:** Am I listing 6 generic textbook objections instead of the 1 or 2 doubts that actually stop THIS specific buyer from paying THIS ticket size?
2. **Honesty check:** Did I clearly separate verified facts already on the site from conditional suggestions the owner must confirm? Are modelled buyer reactions clearly labelled as hypotheses rather than real interviews?
3. **Human voice check:** Cut any em dashes, marketing buzzwords, or stiff academic prose. Write paste-ready lines a real owner would stand behind out loud.

Hand off naturally to `lp-copy-rewrite` for full section rewrites, `lp-experiment-brief` to hand the change cleanly to a developer/designer, or `lead-gen-quality` if low-intent leads are the bigger leak.
