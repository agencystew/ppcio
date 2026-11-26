# Stage 2: the audit

Goal: in about 10 to 15 minutes, tell the owner what stops a good-fit visitor from acting, and what to change first. Every finding points at a real part of their page.

## 1. Capture

    bash KIT/scripts/kit.sh capture <url> landing-pages/<site>

It saves their page at laptop and phone size, its text, its forms, buttons, phone links, tracking tags, speed, their biggest photos, and how the page is built (`craft.md`, `live-parts.json`). Open every image it lists. Read the phone first screen first: most paid clicks come from phones.

If the capture prints NOT CAPTURED, tell the owner the reason it gives in one line. Then ask for two things from their own browser: a full-page screenshot (on a Mac, Shift-Cmd-5; or their browser's "capture full size screenshot"), and the page's text (Cmd-A, Cmd-C on the page, then paste it here). Save them as `inputs/live-page-today.png` and `inputs/site-page-text.md`, and go on. A competitor that is blocked is skipped.

## 2. Look at the market

1. Find 2 or 3 competitors. Search the web for what their buyers search (the owner's search terms, or the service and the place). Prefer the businesses that run ads for those words. Capture each one with `bash KIT/scripts/kit.sh capture <url> landing-pages/<site>/competitors/<name> --quick`.
2. Find the best pages in their kind of business in the library. Run `bash KIT/scripts/kit.sh library niches`, pick the closest niche, then `bash KIT/scripts/kit.sh library niche <slug>`. Open the first image of the top 2 or 3 pages. When no niche fits, use `library find <words>`.

## 3. What the owner told you

Write `context.md` in the work folder from the intake and their page. Use these headings, word for word, because the audit screen reads them:

    ## What they sell
    ## Who buys
    ## Where they work
    ## What a win is
    ## Where visitors come from
    ## Competitors

The audit screen shows every line under these headings to the owner, word for word. Write only facts about their business, in plain words. Put no notes to yourself here.

Then run `bash KIT/scripts/kit.sh checkfacts landing-pages/<site> context.md`. When it prints CONFLICTING CLAIMS (their site gives two ages for the business, say), ask the owner one short question before the audit team starts, and add their answer to context.md under `## The owner settled`, in their words. The team reads context.md, so no fix uses the claim they ruled out.

Under "What a win is", write one of: purchase, quote_request, lead_form, call, appointment_booking, demo_request, trial_signup, signup, application, download, donation. Write only what they said or the page shows. When they gave search terms or ads, write them word for word in `ads.md`.

## 4. The audit team

The kit has the same audit experts as the postclick app, as agents. Each reads the files in the work folder and writes one JSON file in `audit/`. Give each one the work folder's full path in its task message.

1. Start `lp-buyers` and, when at least one competitor was captured, `lp-competitors` in ONE message. They write `audit/buyers.json` (the 3 most likely buyers) and `audit/competitive.json`. The others read both. In the lp-competitors task message, name each folder in `competitors/` and say that buyers.json is not written yet, so it judges for the buyers in context.md.
2. Then start these in ONE message, so they run at the same time:
   - `lp-buyer-journey` twice: task "persona 1, write audit/journey-1.json" and "persona 2, write audit/journey-2.json".
   - `lp-leaks`, `lp-actions`, `lp-offer`, `lp-forensics`.
   - `lp-trust`, `lp-anatomy`, `lp-psych`, `lp-design`. The audit screen's score needs all 4.
   - `lp-ad-match`, when `ads.md` exists or the visitors come from paid ads.
3. When `audit/leaks.json` exists, run `lp-copy`. It writes the new lines in the owner's voice.

Before the first agent starts, run `bash KIT/scripts/kit.sh view <site>`. It starts the PPC.io studio on this computer and prints its address. In the Claude desktop app, open it beside the chat with `preview_start` and the name "PPC.io studio" (kit.sh writes `.claude/launch.json` for you). In a terminal, run `bash KIT/scripts/kit.sh open <address>`. The studio is the postclick app's own audit wait: their page, the team at work, and each finding as its file lands. It moves to the audit by itself when `audit.md` exists. Tell the owner in one line: "14 specialists are reading your page. Watch them beside this chat, about 10 minutes."

Then run `bash KIT/scripts/kit.sh wait` in the background (the Bash tool's background option) and keep it running for the whole session. When the owner presses a button in the studio (Build my new page, a change to the new page), the command ends and prints what they asked for. Do it, then start `kit.sh wait` again.

## 5. Check the team's work

You are the lead. An agent can be wrong. `kit.sh report` already removes the faults code can prove (the postclick app's checks): a claim that the headline, button, price or reviews are missing when the page text has them, a quote that is not on the page, the same quote twice, and a copy line that is not on the page. It lists them in `audit/guard-log.md`. Your eyes catch the rest. Open the laptop and phone screenshots and check every finding you will show against them and against `inputs/site-page-text.md`. Some page parts load only when a visitor scrolls (review sliders, counters). Their text is in `live-parts.json`, even when the screenshot shows a blank. Drop a finding that the page contradicts: a "missing" phone number that is in the header, a blank review section that `live-parts.json` fills, a quote that is not on the page. Remove it from the agent's JSON file in `audit/`, because the audit screen reads those files. Two agents that say the same thing become one finding: keep the one with the better quote. Keep each agent's exact quotes, numbers and fixes.

Tracking comes from `tags` in `site-facts.json`, never from an agent's guess. `google_ads` found: the Google Ads tag is in the page code. Not found but `gtm` or `shopify_pixels` found: it may load inside that container, so say "check", never "missing". Neither: Google Ads cannot count the enquiries from this page, so its bidding has no conversion data.

Then add what only you can see on the screenshots: does it look like a business you would trust with money, and what does it already do well that a new page must keep?

## 6. Write it down

Write 2 files in the work folder:

- `facts.md`: every real fact the build needs, word for word: customer quotes with names and sources, ratings and review counts, figures, prices, offers, guarantees, phone, address, opening hours, service area, the problems their buyers have and the outcomes they get (their words or their customers' words), the buyer's doubts in order, and what the best pages in their kind of business do. Mark where each fact came from. Then run `bash KIT/scripts/kit.sh checkfacts landing-pages/<site>`. It prints each quote that is not on their site word for word. Fix each one before you go on. When it prints CONFLICTING CLAIMS (two ages for the business, say), ask the owner one short question, then write their answer in facts.md as their words. No fix in the audit may use a claim the owner has not settled. The captured text of their other pages is in `inputs/pages/`.
- `audit.md`: the findings, in this order: the one-line verdict (from `audit/leaks.json`), what works and must stay (3 points), what to fix first (up to 5, strongest first, from leaks, actions and offer), what competitors do better (2 or 3, from `audit/competitive.json`), the match with their ads (`audit/ad-match.json`), tracking and speed (`audit/forensics.json` and `site-facts.json`), the 2 simulated buyers (`audit/journey-*.json`: where each one acts or leaves, in their words).

Each fix is: **Now** (their words or the part of the page), **Change to** (the exact new words or the move), **Why** (what the buyer still needs). Never promise a percentage gain.

## 7. Show it

Run `bash KIT/scripts/kit.sh report landing-pages/<site>`. It draws `audit.html` from the files in `audit/` and `context.md`, in the postclick app's audit design: the score, what you know about the business, the top fixes, the buyers, the copy, the competitors and the technical checks. Never write `audit.html` by hand. To change what it says, change the JSON in `audit/` and run it again. `audit.html` is one file the owner can send to someone. The owner reads the audit in the studio: it switched to the audit when `audit.md` landed. If the studio is not open, run `kit.sh view <site>` and open it as in part 4.

For an agency, put `brand.json` in the work folder first: `{"name": "Agency name", "logo": "brand/logo.png"}`.

Then, in chat, give the 3 biggest fixes in one short message each, and ask: "Do you want me to fix your current page, or design a new version?" On the free version (`kit.sh licence` prints `FREE`), add in the same message that the new version comes with the PPC.io licence.

- **Fix the current page:** give each fix as words to paste and a note for whoever edits the site. Keep what works. Done.
- **A new version:** go to stage 3.

Update `progress.md`.
