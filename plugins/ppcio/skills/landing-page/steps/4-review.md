# Stage 4, part 2: review and finish

Check the page the way an elite design team checks finished work: measured faults first, then a critic with fresh eyes, then one batch of fixes.

## 1. Render and measure

    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 1
    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 1 phone
    bash KIT/scripts/kit.sh guard landing-pages/<site>/page.html
    bash KIT/scripts/kit.sh checkfacts landing-pages/<site> facts.md page.html

Open every image the shot commands list, the phone first. Every quote checkfacts prints is a lie until you fix it. For each line under "CHECK THESE CLAIMS", find what backs it in facts.md, their pages or the owner's words. A line that only says what the buyer gets in other words can stay. A line that promises something they never said (a speed, a method, "no job too small") goes. Read every guard line: overflow, small text, dead links, a form or proof their live page had and this page lost, the colour share in their brand, and the marks of a generic AI page ("ai marks"), each with its fix.

## 2. The critic

Start a subagent (the Agent tool) as the critic. It has not seen your reasoning, so it judges what is on the page. Give it the prompt under "The critic prompt" below, with the full paths of: the round's laptop slices (`r1/first.png`, `r1/s1.png` and on), the phone first screen and tiles (`r1-phone/first.png`, `r1-phone/t1.png` and on, which cover the whole page), `inputs/live-page-today.png`, `inputs/live-full.jpg`, `inputs/site-page-text.md`, `page.html`, `brand.md`, `case.md`, `plan.md`, `facts.md` and `KIT/TASTE.md`.

It can be wrong. Weigh it.

## 3. The verdict and the fixes

Write the critic's blind scores to `r1/scores.json` as `{"live": [5 numbers], "new": [5 numbers]}`, in the order first screen, case, proof, offer, action. Then write `r1/verdict.md` as the most ruthless art director and conversion expert alive: what is beautiful and stays, then every fault: each guard line, anything broken, covered or cut off at either width, each lie (a price, "free", guarantee, time or figure that is not word for word in facts.md or site-page-text.md is a lie, wherever it sits), each buyer question left open, each thing the critic says their live page still does better, each part of case.md the page does not make, and each headline the critic called filler or a topic label, with its new line. Number the faults. Start each with a bold label of 7 words at most, ending in a full stop (`1. **Picker shows all four panels.**`), then one plain sentence, then the section heading in brackets. The review screen lists these labels as the faults you fixed.

Fix every fault in one batch, each as a small edit to page.html. Never write page.html again whole. The design is decided: never start a new layout, never shrink the page or drop a strong photo to satisfy a note.

## 4. Finish

    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 2
    bash KIT/scripts/kit.sh shot landing-pages/<site>/page.html 2 phone
    bash KIT/scripts/kit.sh guard landing-pages/<site>/page.html

Look at both renders and fix anything your changes broke. The guard must print CLEAN and "ai marks: none to fix".

## 5. Show the owner

Run `bash KIT/scripts/kit.sh review landing-pages/<site>` and open `review.html` in their browser: the blind scores, their page today next to the new one, and every fault the review fixed. Then show the new page in the studio (`kit.sh view <site>`, the New page tab): their live page and the new one side by side, on a laptop and a phone. The owner can type a change there; `kit.sh wait` hands it to you. In chat, say in 3 short sentences what the page does differently from their live page and why a buyer acts on it. Ask what they want changed. For each change: edit, render, look, then show it. Keep `progress.md` up to date.

---

## The case check prompt

> You are a conversion lead who has run thousands of landing page tests, reading a designer's plan before they build. The page is for people who clicked this business's ad. Judge only whether a page built from this plan would win more enquiries than their live page. Only what is in these files exists: never ask for facts, prices or proof they do not have. Be blunt and specific.
>
> Read: their live page's text (inputs/site-page-text.md), the facts (facts.md), the case (case.md) and the plan (plan.md). Reply in plain text, at most 300 words:
> VERDICT: READY or FIX FIRST. One sentence why.
> LIVE PAGE DOES BETTER: up to 4 things their live page does that this plan drops or weakens (quote its words), or "none".
> FIRST SCREEN: does the planned first screen say what the buyer gets, show proof beside the button and let them act? Give a better headline if it does not.
> HEADINGS: each planned heading that is only a topic label, with a better one in the owner's voice.
> ORDER: does the plan run problem, outcome, trust, offer, doubts, action? Name the one move that would most help.
> UNUSED PROOF: any figure, review or name in the facts that the plan does not use.

## The critic prompt

> You are the best conversion lead and art director alive, reviewing a landing page a designer is making for this business, for people who clicked their ad. The page must win more customers than any page in their market and look like the business's own brand at its best. Judge it against the brand card (brand.md: colours, type, voice, real actions) and the taste notes (TASTE.md). Never push it toward another brand's look. Only what is in these files exists: never ask for prices, forms or details they lack. Be specific and ruthless.
>
> Open every image you are given, the phone first. Read the new page's headlines and buttons in page.html, in order.
>
> First, judge it blind against their live page. Call the two pages A and B in an order you pick by chance, and score each from 1 to 10 as the buyer who clicked the ad: FIRST SCREEN (in 5 seconds, do I know what I get, see proof and see how to act?), CASE (does it name my problem, show the outcome, then answer my doubts?), PROOF (reviews, counts, names and results I believe, near where I act), OFFER (clear, specific, easy to say yes to), ACTION (how easy is it to enquire wherever I might decide?). Judge what each page says and shows, not how modern it looks. Then say which page wins, and up to 4 things each page does better than the other.
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
