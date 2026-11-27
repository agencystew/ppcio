# Stage 4, part 2: review and finish

Check the page the way an elite design team checks finished work: measured faults first, then a critic with fresh eyes, then one batch of fixes. Then again, until it passes. `kit.sh next <site>` runs the rounds: it names the round number N, runs the guard and the fact checks itself, asks for the critic, and sends the page back for another round until a fresh critic scores it 8 or more on all 6 points, 8.5 or more on average, and at least their page today (up to 5 rounds). Below, `r1` stands for the round `next` names: use `rN`.

## 1. Render and measure

    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 1
    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 1 phone
    bash KIT/scripts/kit.sh guard landing-pages/<site>/page.html
    bash KIT/scripts/kit.sh checkfacts landing-pages/<site> facts.md page.html

Open every image the shot commands list, the phone first. Every quote checkfacts prints is a lie until you fix it. For each line under "CHECK THESE CLAIMS", find what backs it in facts.md, their pages or the owner's words. A line that only says what the buyer gets in other words can stay. A line that promises something they never said (a speed, a method, "no job too small") goes. Read every guard line: overflow, small text, dead links, a form or proof their live page had and this page lost, the colour share in their brand, and the marks of a generic AI page ("ai marks"), each with its fix.

## 2. The critic

Start a subagent (the Agent tool) as the critic. Tell it to write its whole reply to `rN/critic.md` in one Write call, and in the same message run `kit.sh await landing-pages/<site> rN/critic.md`, so you wait in a tool call. Write nothing in chat while it works. It has not seen your reasoning, so it judges what is on the page. Give it the prompt under "The critic prompt" below, with the full paths of: the round's laptop slices (`r1/first.png`, `r1/s1.png` and on), the phone first screen and tiles (`r1-phone/first.png`, `r1-phone/t1.png` and on, which cover the whole page), `inputs/live-page-today.png`, `inputs/live-full.jpg`, `inputs/site-page-text.md`, `page.html`, `brand.md`, `case.md`, `plan.md`, `facts.md` and `KIT/TASTE.md`.

It can be wrong. Weigh it.

## 3. The verdict and the fixes

Write the critic's blind scores to `rN/scores.json` (N is the round `next` names) as `{"live": [6 numbers], "new": [6 numbers]}`, in the order first screen, case, proof, offer, action, craft. Then write `rN/verdict.md` as the most ruthless art director and conversion expert alive: what is beautiful and stays, then every fault: each guard line, anything broken, covered or cut off at either width, an empty block larger than about a quarter of the first screen, the same button twice in the first screen (header buttons count), each lie (a price, "free", guarantee, time or figure that is not word for word in facts.md or site-page-text.md is a lie, wherever it sits), each buyer question left open, each thing the critic says their live page still does better, each part of case.md the page does not make, and each headline the critic called filler or a topic label, with its new line. Number the faults. Start each with a bold label of 7 words at most, ending in a full stop (`1. **Picker shows all four panels.**`), then one plain sentence, then the section heading in brackets. The review screen lists these labels as the faults you fixed.

Add these to the faults too. Open audit.md and page.html side by side: each of the audit's top fixes that the page does not carry out (unless you held it back for a fact they must confirm), and each contradiction the audit or facts.md names that the page still shows (two recovery times, two different ages for the business). The page uses one value, or leaves the claim out. A claim wider than its source is a lie too: "upfront quote on HVAC pricing" never becomes "an upfront quote before any work starts". A vague line the audit flagged ("See available offers", a bare "Yes!") gets the real answer from facts.md, or goes.

Fix every fault in one batch, each as a small edit to page.html. Never write page.html again whole. The design is decided: never start a new layout, never shrink the page or drop a strong photo to satisfy a note.

## 4. Finish

    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 2
    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 2 phone
    bash KIT/scripts/kit.sh guard landing-pages/<site>/page.html

Look at both renders and fix anything your changes broke. The guard must print CLEAN and "ai marks: none to fix".

## 5. Show the owner

1. Run stage 5's first step now: `bash KIT/scripts/kit.sh pack landing-pages/<site>`, and check every photo still shows (KIT/steps/5-go-live.md has the 3 checks).
2. Write `landing-pages/<site>/ready.md`:
   - `Today:` one or two lines, only when something needs their action today (a phone number that does not match, a broken form, tracking that misses calls, Google Ads not counting bookings, an offer that ends within 14 days).
   - 3 numbered sentences: what the new page does differently from their live page, and why a buyer acts on it. Their words and their facts, never scores.
   - `Ask:` one line, only when the page needs one fact they have not given (what the warranty covers, which phone number to use).
3. Run `bash KIT/scripts/kit.sh review landing-pages/<site>`. It writes `review.html` for anyone who asks (do not open it for them) and prints the page-ready message between two `----` lines.
4. Send that text as your message, word for word, including the full path to `<site>-page.zip` (which holds `index.html`, all downloaded `assets/`, and their tracking tags so it shares cleanly without broken photos). This is the one message they get for stages 4 and 5. The studio's New page tab shows their live page and the new one side by side; `kit.sh wait` hands you any change they type there.

Never report checks, scores or a "reviewer" in chat. They are in the review file for anyone who asks. For each change: edit, render, look, then show it. Keep `progress.md` up to date.

---

## The case check prompt

> You are a conversion lead who has run thousands of landing page tests, reading a designer's plan before they build. The page is for people who clicked this business's ad. Judge only whether a page built from this plan would win more enquiries than their live page. Only what is in these files exists: never ask for facts, prices or proof they do not have. Be blunt and specific.
>
> Read: their live page's text (inputs/site-page-text.md), their other pages (inputs/pages/*.md), the facts (facts.md), the case (case.md) and the plan (plan.md). Reply in plain text, at most 300 words:
> VERDICT: READY or FIX FIRST. One sentence why.
> LIVE PAGE DOES BETTER: up to 4 things their live page does that this plan drops or weakens (quote its words), or "none".
> FIRST SCREEN: does the planned first screen say what the buyer gets, show proof beside the button and let them act? Give a better headline if it does not.
> HEADINGS: each planned heading that is only a topic label, with a better one in the owner's voice.
> ORDER: does the plan run problem, outcome, trust, offer, doubts, action? Name the one move that would most help.
> UNUSED PROOF: any figure, review or name in the facts that the plan does not use.

## The critic prompt

> You are the best conversion lead and art director alive, reviewing a landing page a designer is making for this business, for people who clicked their ad. The page must win more customers than any page in their market and look like the business's own brand at its best. Judge it against the brand card (brand.md: colours, type, voice, real actions) and the taste notes (TASTE.md). Never push it toward another brand's look. Only what is in these files exists: never ask for prices, forms or details they lack. Every figure, name, price and review in facts.md, inputs/ and live-parts.json is the business's own and true: never call it invented. Flag only a claim that is in none of them. Be specific and ruthless.
>
> Open every image you are given, the phone first. Read the new page's headlines and buttons in page.html, in order.
>
> First, judge it blind against their live page. Call the two pages A and B in an order you pick by chance, and score each from 1 to 10 as the buyer who clicked the ad: FIRST SCREEN (in 5 seconds, do I know what I get, see proof and see how to act?), CASE (does it name my problem, show the outcome, then answer my doubts?), PROOF (reviews, counts, names and results I believe, near where I act), OFFER (clear, specific, easy to say yes to), ACTION (how easy is it to enquire wherever I might decide?), CRAFT (does it look like the best studio in the world made it for this brand: hierarchy, type, spacing, photos used well, polish; or like a template or an AI page?). Score on an absolute bar, never one page against the other: 9 means the best conversion agency in the world would be proud to ship it to a paying client today; most pages on the web score 4 to 6. A blind judge on 27 Nov scored a page 6 that its own critic had scored 8: do not be that critic. Then say which page wins, and up to 4 things each page does better than the other.
>
> Then reply in plain text, at most 320 words:
> COLD READ: read only the headlines and button labels, top to bottom, as a stranger who clicked an ad. Do they know what this is, who it is for and where, why to trust it and how to act? Quote any headline that is filler, a riddle, a line lifted from an old web page, or a line no owner would say out loud, and give a better line in the owner's voice.
> PHONE: on the first phone screen, what does the buyer press and what happens? Is the main action repeated with the same name where a buyer decides?
> BEAUTIFUL: what is already beautiful and must stay (specific).
> RICHER: the two most important things to add or make richer with their own material (a photo used larger or better, the signature moment pushed further, type with more character). Exact moves.
> BRAND AND VOICE: one line each: do their colours and type carry it; does the copy sound like this owner and their customers, or like AI (paired fragments, groups of three, slogans)?
> HEADINGS: every section heading that is only a topic label, with a better heading in the owner's voice.
> MISSING: any buyer question unanswered or real proof unused.
> LIES: anything that looks pressable and does nothing, a button named differently from the brand card's actions, or a claim not in the facts.
> BROKEN: at either width, anything that covers the subject of a photo, overlaps other text, is cut off or cannot be read.
