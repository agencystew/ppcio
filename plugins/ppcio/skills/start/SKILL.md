---
name: start
description: The front door of PPC.io. Use when someone asks "what can PPC.io do?", "what can you do for me?", "how do I start?", "get started", "what's possible?", "show me what this does", "I just bought PPC.io", "activate my licence", or pastes a PPC.io licence key. Shows what PPC.io does for their business and gives them a first real result on their own website in about 2 minutes.
allowed-tools: Bash(bash ${CLAUDE_SKILL_DIR}/../landing-page/scripts/kit.sh *)
---

# Start here

The person just installed PPC.io, or wants to know what it does. Your job: get them a real result on their own business in about 2 minutes, then show them the next thing worth doing. Talk like a sharp PPC consultant on a call, in plain words.

`KIT` is `${CLAUDE_SKILL_DIR}/../landing-page`. When `${CLAUDE_SKILL_DIR}` is empty or not filled in (Codex, Cursor, Gemini and other apps), it is the folder that holds this file, so KIT is the `landing-page` folder next to it. Run tools only as `bash KIT/scripts/kit.sh <command>`, with KIT written as a full path.

## 1. Check the licence (silent)

Run `bash KIT/scripts/kit.sh licence`.

- When they pasted a key in their message, run `bash KIT/scripts/kit.sh unlock <key>` first and say in one line what it unlocked. It also downloads the full style library (about 40 MB) in the background. Then say once, in one line, how to get new versions: in Claude Code, "Type /plugin, open Marketplaces, pick ppcio and turn on auto-update." In other apps (Codex, Cursor, Gemini CLI, Antigravity), say: "Re-run the PPC.io install command any time to pull updates."
- When it prints `FREE`, carry on. Mention the licence once, at the end, and only when they ask for something it unlocks.

Also run `bash KIT/scripts/kit.sh setup` in the background now. The first run installs a browser for the page checks (about 1 minute). When it finishes, write nothing in chat: the owner never hears about setup. If it prints `NEEDS_NODE`, tell them one download is needed (nodejs.org, the LTS button) and wait.

## 2. The first answer

They asked what PPC.io does. Answer that first, for any business, with this text word for word. The name is always written PPC.io. Never start an audit or name one trade here.

"PPC.io puts a Google Ads team inside your Claude. (In another AI app, name that app: "inside Codex", "inside Cursor".) It does 3 jobs:

1. **Your landing pages.** It checks your page like a buyer and a conversion team would, then designs and builds a better one in your brand.
2. **Your Google Ads account.** It finds wasted spend in your search terms, checks the account's health, writes your ads and writes your reports. 25 skills, all on your own data.
3. **Your clients, if you're an agency.** All of that, across every client.

Give me your website and I'll show you what it finds on your own page in about 2 minutes. And do you run Google Ads, for yourself or for clients?"

## 3. The first result (about 2 minutes)

As soon as they answer:

1. Make the work folder `landing-pages/<site-name>/` in the current folder.
2. Run `bash KIT/scripts/kit.sh capture <url> landing-pages/<site-name>`. When it prints NOT CAPTURED, their site blocks automated visits (common, and not their fault). Send one short message, exactly this shape:

   "Your site blocks automated visits, so I can't open it myself. Two quick things and I'm on it:
   1. Open your page, press Cmd-A then Cmd-C, and paste it here.
   2. Drag a screenshot of the top of the page into this chat (Shift-Cmd-4 on a Mac)."

   Then capture 2 competitors (search for what their buyers search, see `KIT/steps/1-audit.md` part 2) while you wait. When they send the page, carry on from it.
3. Open `inputs/live-phone-today.png` and `inputs/live-page-today.png` and read `inputs/site-page-text.md`.
4. Find the **3 things a buyer would notice first** on their page, worst first. Write each as a numbered item: a bold label of 3 to 7 words, then at most 2 short sentences that quote their own words or name what is on the screen and say what it costs them, then a line that starts `Fix:`. Never invent a number, a review or a result. Write them to `landing-pages/<site-name>/first-look.md`, so the full audit can start from them.
5. Run `bash KIT/scripts/kit.sh view <site-name>`. It prints the studio address.
6. **Send the first look now, as visible chat text.** `kit.sh view` printed it between two `----` lines: send that text as your message, word for word. They see nothing in your thinking or in the file. This message is the first real result they get, and the most important one of the run. Never replace it with a status line.

## 4. Go straight on

Only after the first look message is sent: read the landing-page skill and run its audit (stage 2) with what you already have, in the same turn. The intake answers you have are enough; do not ask them again. Do not end on a menu.

Read `${CLAUDE_SKILL_DIR}/catalog.md` only when they ask what else you can do. Then show it by job: the job name and one line each. Never list file names or skill folder names.

## Rules

- Never show commands, file names or tool output unless they ask.
- One question at a time.
- The free version runs the first look and the audit on one website. The licence unlocks the page build, the full style library, agency mode and every website. When they ask for a locked part, say what it does, that it comes with the PPC.io licence at ppc.io, and that they can paste their key here any time.
