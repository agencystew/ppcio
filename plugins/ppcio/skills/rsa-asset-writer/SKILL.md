---
name: rsa-asset-writer
description: "Write or refresh Google Ads responsive search ads (RSAs), sitelinks, and callouts strictly from verified proof points, then lint every character, pin, claim, and punctuation rule with Python before handoff. Use when writing or auditing RSAs for a real account, refreshing ads, or adding extensions. Not for quick brainstorming with no facts file (use rsa-headline-generator) or search terms (use search-term-miner)."
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.3.0"
---

# RSA and Asset Writer

AI-written search ads fail in four predictable ways: lines over 30/90 characters, made-up proof ("Rated 4.9 by 2,000+ patients" when the site says 4.8 from 1,200), robotic "Ad Strength chasing" that ruins conversion rate, and sloppy pins that choke delivery. This skill writes from verified proof only, applies senior direct-response ad craft, and runs deterministic Python linting on every character and claim before anything is handed over.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Check for a local `landing-pages/<site>/` folder first (`context.md`, `facts.md`, `inputs/site-page-text.md`) so every ad matches the real landing page offer verbatim.
- Read [references/account-profile.md](references/account-profile.md) if no profile exists: confirm services, verified proof points with sources (saved to `facts.md`), banned words, and any legal qualifiers (`Rule: "finance" needs "subject to status"`). If they want real live ad performance data first, point to `connect-data-sources` or `03-ad-copy-performance-matrix.js`.

## First-Principles RSA Craft (Beyond "Excellent Ad Strength")

1. **Conversion rate beats "Ad Strength":** Never rewrite a profitable ad just to chase Google's "Good -> Excellent" badge; unnecessary churn triggers a 7 to 14 day learning dip (often 10% to 20% CTR/CVR volatility).
2. **Low CTR + High CVR is pre-qualification, NOT a bug:** If an ad puts a real starting price ("From £2,950") or minimum project size in the copy, CTR drops because tire-kickers skip clicking while conversion rate and lead quality jump. Protect pre-qualifying lines!
3. **45-Character Mobile Front-Load Rule:** On phones, descriptions truncate early. Put the concrete outcome, price, or offer in the first 45 characters of every 90-character description. Mix headline lengths (10 to 15, 15 to 25, 28 to 30 chars) so Google assembles clean, non-truncated combinations.
4. **Asset Performance discipline:** Never prune an asset marked "Low" with under 30 days or <1,000 impressions, or if it carries required legal/objection wording ("Low" is relative inside the ad, not absolute failure).
5. **Smart pinning only:** Leave pins blank unless legal/compliance/brand rules require a line. When pinning, pin **2 to 3 distinct variants** to Position 1 rather than 1 rigid line so the auction still optimizes. Data-driven pinning requires >=1,000 impr, >=30 days, and >=30% CTR lift.
6. **Zero poetic AI fluff:** Never write generic slogans ("Elevate your experience", "Trusted excellence"). Every line must pass the Competitor Copy-Paste Test.

### Weak 5/10 vs. 10/10 RSA Asset

- **Amateur:** `Trusted Local Plumbing Team` (27) / `Quality Service You Can Rely On` (31 - OVER LIMIT!) / `We provide seamless solutions for all your plumbing needs. Contact us today for more info!` (90 - zero proof, zero offer, dead filler.)
- **10/10 Senior:** `Denver Plumber - Open 6AM-10PM` (30) / `4.8 Stars (17,000+ Reviews)` (27) / `Save $75 on Any Plumbing Fix. Licensed, background-checked techs. No overtime charges.` (86 - concrete offer in first 30 chars, verified proof, zero fluff.)

## Workflow (Verify -> Critique -> Refine)

1. Write `facts.md` and `banned.txt` from verified business inputs (never invent a number, review count, warranty, or "free" claim). Read the destination landing page if reachable to confirm exact offer continuity (`lp-message-match`).
2. **Refresh only:** Lint the current ad first to catch real faults:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/rsa_lint.py" <current.csv> --facts facts.md --banned banned.txt --keyword "<theme>"`
3. Read [references/field-notes.md](references/field-notes.md) and [references/rsa-rules.md](references/rsa-rules.md). Draft 15 distinct headlines across 5+ angles (max 3 per angle: keyword+geo, offer/price, proof, process/speed, objection handler, CTA) and 4 distinct descriptions (front-loaded in the first 45 chars). If asked for sitelinks (25/35/35 chars, 0 or 2 desc lines) or callouts (25 chars, strongest 4 to 6 first), include them in the same CSV.
4. Write `ad.csv` (`type,text,pin`) and run `rsa_lint.py`. Fix EVERY `FAIL` and fix or justify every `WARN`. Loop until **`0 FAIL`** (count characters strictly by script, never by eye). Move qualified claims to descriptions if a 30-char headline cannot hold the required legal wording.

## Closed-Loop Self-Check & Critique (Run Before Answering)

Before handing over the draft (for human upload, with a 14-day CPA/CVR check vs. prior control ad as a rollback guardrail):
1. **Lint & fact check:** Confirm `0 FAIL` from `rsa_lint.py` on the exact final lines pasted in chat, with every number/claim traced to `facts.md`.
2. **Adversarial human read-aloud:** Pair 3 random headlines + 2 descriptions together. Do they read like a sharp human ad without repeating the same claim twice, or sounding robotic/poetic? Cut em dashes and deck buzzwords.
3. **Landing page check:** Flag immediately if the ad's strongest promise is missing from the landing page's first screen (`lp-message-match`).
