# Stage 2: the audit

Goal: in about 10 minutes, tell the owner what stops a good-fit visitor from acting, and what to change first. Every finding points at a real part of their page.

## 1. Licence and capture

First check the site licence before spending time on the audit team:

    bash KIT/scripts/kit.sh check-site <site>

If it prints `LOCKED`, stop here: tell the owner in one line that the free version audits one website, the PPC.io licence unlocks every website at ppc.io, and they can paste their key here any time.

Then capture their page (skip if the start skill already captured it in this turn):

    bash KIT/scripts/kit.sh capture <url> landing-pages/<site>

It saves their page at laptop and phone size, its text, its forms, buttons, phone links, tracking tags, speed, their biggest photos, and how the page is built (`craft.md`, `live-parts.json`). Open every image it lists. Read the phone first screen first: most paid clicks come from phones.

If the capture prints NOT CAPTURED for their own page, send the same short message as the start skill: their site blocks automated visits, so paste the page text (Cmd-A, Cmd-C) and drag in a screenshot of the top of the page. Do part 2 while you wait, without saying so. Save what they send as `inputs/site-page-text.md` and `inputs/live-page-today.png`, and go on. Never ask for more than those two things. A competitor that is blocked is skipped.

## 2. Look at the market

1. Find 2 or 3 competitors. Search the web for what their buyers search (the owner's search terms, or the service and the place). Prefer the businesses that run ads for those words. Capture each one with `bash KIT/scripts/kit.sh capture <url> landing-pages/<site>/competitors/<name> --quick`.
2. Find the best pages in their kind of business in the library. Run `bash KIT/scripts/kit.sh library niches`, pick the closest niche, then `bash KIT/scripts/kit.sh library niche <slug>`. Open the first image of the top 2 or 3 pages. When no niche fits, use `library find <words>` (licensed only; on the free version, use the closest niche).

## 3. What the owner told you

Write `context.md` in the work folder from the intake and their page. Use these headings, word for word, because the audit screen reads them:

    ## What they sell
    ## Who buys
    ## Where they work
    ## What a win is
    ## Where visitors come from
    ## Competitors

The audit screen shows every line under these headings to the owner, word for word. Write only facts about their business, in plain words. Put no notes to yourself here.

Then run `bash KIT/scripts/kit.sh checkfacts landing-pages/<site> context.md`. When it prints CONFLICTING CLAIMS (their site gives two ages for the business, say), do not stop to ask. Add both versions to context.md under `## To confirm`, with the line "Use neither until the owner confirms." The team reads context.md, so no fix uses either claim. When the owner already answered, write their answer under `## The owner settled` instead.

Under "What a win is", write one of: purchase, quote_request, lead_form, call, appointment_booking, demo_request, trial_signup, signup, application, download, donation. Write only what they said or the page shows. When they gave search terms or ads, write them word for word in `ads.md`. When they also shared or connected GA4, Google Ads, Microsoft Clarity, or Meta Ads data (via `connect-data-sources` or a dropped CSV/MCP pull), save the verified numbers in `data/analytics-summary.md` (`kit.sh brief` automatically passes both `ads.md` and `data/` to the entire audit team so every finding uses real conversion and behaviour data).

## 4. The audit team

The kit has the same audit experts as the postclick app, as agents. Each numbered step below starts all its agents in ONE message, so they run at the same time. Right after that message, wait for the step with `bash KIT/scripts/kit.sh await landing-pages/<site> <the files the step writes>` in the foreground (set the command timeout to 600000 ms; when it prints STILL RUNNING, run it again). Write no text in chat while you wait, and none when an agent reports back: the studio shows the progress. When an agent's report arrives while others still run, your whole reply is the await command, with no words. Each reads the files in the work folder and writes one JSON file in `audit/`. Give each one the work folder's full path in its task message.

Before each numbered step, run `bash KIT/scripts/kit.sh brief <site>`. It writes `audit/brief.md`: every text file the agents read, in one file, so each agent reads once and writes once. Say in each task message: "Read audit/brief.md and the 2 screenshots in your first turn, then write your file in one Write call."

1. Start `lp-buyers` and, when at least one competitor was captured, `lp-competitors` in ONE message. They write `audit/buyers.json` (the 3 most likely buyers) and `audit/competitive.json`. The others read both. Then await `audit/buyers.json` (and `audit/competitive.json`). In the lp-competitors task message, name each folder in `competitors/` and say that buyers.json is not written yet, so it judges for the buyers in context.md.
2. Then start these in ONE message, so they run at the same time:
   - `lp-buyer-journey` twice: task "persona 1, write audit/journey-1.json" and "persona 2, write audit/journey-2.json".
   - `lp-leaks`, `lp-actions`, `lp-offer`, `lp-forensics`.
   - `lp-trust`, `lp-anatomy`, `lp-psych`, `lp-design`. The audit screen's score needs all 4.
   - `lp-ad-match`, when `ads.md` exists or the visitors come from paid ads.
   Then await: `audit/journey-1.json audit/journey-2.json audit/leaks.json audit/actions.json audit/offer.json audit/forensics.json audit/trust.json audit/anatomy.json audit/psych.json audit/design.json` (and `audit/ad-match.json` when you started it).
3. When `audit/leaks.json` exists, run `lp-copy`. It writes the new lines in the owner's voice. Await `audit/copy.json`.

Before the first agent starts, run `bash KIT/scripts/kit.sh view <site>`. It starts the PPC.io studio on this computer and prints its address. Open it the way SKILL.md says for this host (kit.sh writes `.claude/launch.json` for the desktop app). The studio is the postclick app's own audit wait: their page, the team at work, and each finding as its file lands. It moves to the audit by itself when `audit.md` exists. When the first-look message already gave this link, say nothing. Otherwise send one line, with the link: "My team is checking your page now. Watch them work here: <address>. About 10 minutes." Then say nothing until the audit is done.

Then run `bash KIT/scripts/kit.sh wait` in the background (the Bash tool's background option) and keep it running for the whole session. When the owner presses a button in the studio (Build my new page, a change to the new page), the command ends and prints what they asked for. Do it, then start `kit.sh wait` again.

## 5. Check the team's work

You are the lead. An agent can be wrong. When you run `kit.sh report` in part 7, the kit's audit guard automatically removes the faults code can prove (a claim that the headline, button, price or reviews are missing when the page text has them, a quote that is not on the page, the same quote twice, and a copy line that is not on the page) and logs them to `audit/guard-log.md`. Your eyes catch the rest first. Open the laptop and phone screenshots and check every finding you will show against them and against `inputs/site-page-text.md`. Some page parts load only when a visitor scrolls (review sliders, counters). Their text is in `live-parts.json`, even when the screenshot shows a blank. Drop a finding that the page contradicts: a "missing" phone number that is in the header, a blank review section that `live-parts.json` fills, a quote that is not on the page. Remove it from the agent's JSON file in `audit/`, because the audit screen reads those files. Two agents that say the same thing become one finding: keep the one with the better quote. Keep each agent's exact quotes, numbers and fixes.

Tracking comes from `tags` in `site-facts.json`, never from an agent's guess. `google_ads` found: the Google Ads tag is in the page code. Not found but `gtm` or `shopify_pixels` found: it may load inside that container, so say "check", never "missing". Neither: Google Ads cannot count the enquiries from this page, so its bidding has no conversion data.

Then add what only you can see on the screenshots: does it look like a business you would trust with money, and what does it already do well that a new page must keep?

## 6. Write it down

When the capture is more than 30 minutes old (the owner may be editing the page), run `kit.sh capture` again first and drop any finding the new page text no longer supports.

Write 2 files in the work folder:

- **The proof hunt, before facts.md.** Proof decides whether a stranger enquires, and a blind judge scored it the weakest part of our pages. Go past the homepage. Read their testimonial, case study, project, about and awards pages in `inputs/pages/`. Then, if your tool can search or fetch the web, look up the business on Google (its review rating and count), Yelp, BBB, Houzz, Trustpilot or the review site of their trade, their trade bodies, the makers that certify them (a roofer's GAF or Carlisle status, a dentist's board), awards, press and named clients. Save the text of each outside page you use to `inputs/proof/<name>.md`, first line `Source: <url>`. Then write `## Proof` in facts.md: at least 5 items, strongest first, each with its source: a named review word for word, a rating and count, a certification, an award, a named client or project, a figure. If you find fewer, add a line `Searched: <the 6 or more places you looked>`. Never invent proof and never borrow a competitor's. Proof from a saved outside page is the business's own proof: use it on the page with its source beside it ("4.6 on Google from 286 reviews, Plano", "D Magazine Best Spa, 2013 to 2016"). Never mark it "confirm with owner" or hold it back. Only two sources that disagree go under `## To confirm`.
- `facts.md` (their own facts only; a competitor's words go in audit.md, never here): every real fact the build needs, word for word: customer quotes with names and sources, ratings and review counts, figures, prices, offers, guarantees, phone, address, opening hours, service area, the problems their buyers have and the outcomes they get (their words or their customers' words), the buyer's doubts in order, and what the best pages in their kind of business do. Mark where each fact came from. Then run `bash KIT/scripts/kit.sh checkfacts landing-pages/<site>`. It prints each quote that is not on their site word for word. Fix each one before you go on. When it prints CONFLICTING CLAIMS (two ages for the business, say), do not ask now. Leave the claim out of every fix and the build until the owner settles it, and list it in `facts.md` under `## To confirm`. The captured text of their other pages is in `inputs/pages/`.
- `audit.md`: the findings, in this order: the one-line verdict as a line that starts `**Verdict:** ` (from `audit/leaks.json`; the report needs this exact label), then `## The diagnosis` and `## The plan for your new page` (below), then what works and must stay (3 points), what to fix first (up to 5, strongest first, from leaks, actions and offer), what competitors do better (2 or 3, from `audit/competitive.json`), the match with their ads (`audit/ad-match.json`), tracking and speed (`audit/forensics.json` and `site-facts.json`), the 2 simulated buyers (`audit/journey-*.json`: where each one acts or leaves, in their words).

Each fix is: **Now** (their words or the part of the page), **Change to** (the exact new words or the move), **Why** (what the buyer still needs). Never promise a percentage gain.

**The diagnosis and the plan come first. Write them like a senior strategist on a call, not a checklist.** The owner bought a full landing page system. They must finish reading and think "they get my business better than I do". Micro fixes (a button word, a missing badge) are evidence, never the headline.

`## The diagnosis`: 3 to 4 plain sentences, no bullets. Cover, in this order:
1. The job of this page: who clicks the ad, what state they are in (an emergency, a big planned purchase, comparing 3 quotes), and the one decision they must make on this page.
2. What the page does instead, at the level of strategy: the wrong page for the traffic, two businesses on one page, an offer that gives no reason to act now, no proof for a purchase that needs trust, a design that looks like every competitor. Name it with one real detail from their page.
3. What that costs them, in buyers and enquiries (never a percentage), and what the best competitor or best page in their trade does instead.

`## The plan for your new page`: exactly 3 numbered moves, strongest first. Each is one sentence that names what the new page does and which part of the diagnosis it answers: the structure (one page for one job), the offer, the proof, the design. These are what the new page delivers, so each is bigger than a word change. Example: "1. One page for roof replacement only, from the headline down, with the estimate form in the first screen so a buyer never leaves to find it."


## 7. Show it

Run `bash KIT/scripts/kit.sh report landing-pages/<site>`. It draws `audit.html` from the files in `audit/` and `context.md`, in the postclick app's audit design: the score, what you know about the business, the top fixes, the buyers, the copy, the competitors and the technical checks. Never write `audit.html` by hand. To change what it says, change the JSON in `audit/` and run it again. `audit.html` is one file the owner can send to someone. The owner reads the audit in the studio: it switched to the audit when `audit.md` landed. Give the link in your message, as SKILL.md says.

For an agency, put `brand.json` in the work folder first: `{"name": "Agency name", "logo": "brand/logo.png"}`.

Then send ONE message in chat: the text that `kit.sh report` printed between the two `----` lines, word for word. It holds the score, the verdict, the 3 fixes and the studio link. Add one last line on what happens next, as a fact, not a question. Licensed: "Now I'll pick the style that wins in your market and draw your new page in it, about 10 minutes." Free: give the fixes as words to paste, and say in one line that the new page comes with the PPC.io licence. Only when `## To confirm` in facts.md has items, add: "One thing to check when you have a second: <claim>. I've left it out until you confirm."

No homework in this message. Send it and start stage 3 in the same turn: the message must not be your last action.

Update `progress.md`.
