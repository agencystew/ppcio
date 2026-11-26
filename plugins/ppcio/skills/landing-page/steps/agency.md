# Agency mode: many pages, no one at the keyboard

Use this when the person runs pages for several clients: they paste a list of pages, or say "agency", "all my clients" or "batch". Ask every question now, in one message. After that, never stop to ask: run each client to the end and report once.

## 1. Ask once, for every client

When they already gave the page addresses and nothing is unclear, ask nothing: take the defaults (win: the main button or phone on each page; audits and new pages; your own report, no agency brand), say so in one line with the time it takes, and start. Ask only for what you cannot work out.

Say: "Send me one line per client. I'll ask nothing else until they're all done." Show this example:

    https://client-one.com | win: calls | Google Ads: plumber near me, emergency plumber austin | phone: (512) 555-0100
    https://client-two.com | win: booking form | Meta ads | phone: keep the one on the page

Each line has:
- The page address.
- What a win is: a call, a form, a booking or a sale.
- Where visitors come from, with 3 to 5 search terms for Google Ads. This is optional.
- The phone number the new page uses. This is optional; without it, use the number on their live page's first screen.

Then ask two things, once for the whole batch:
1. "Audits only, or audits and new pages?" The default is both.
2. "Should the audits carry your agency's name and logo?" When yes, ask for the name and the logo file, and write `brand.json` in each client's work folder (see `KIT/steps/1-audit.md`).

Write everything to `landing-pages/batch.md`: one row per client with its answers and a status (waiting, audit done, page done, failed). This file is how you resume.

Before you start, tell them in plain words:
- About how long it takes: the clients run side by side, so the batch takes about as long as the slowest client plus a little. 5 clients take about 30 to 40 minutes, 10 clients about 45 to 60.
- Their Claude may ask to approve some steps the first time. Approve them for this chat, or start Claude with edits auto-accepted, so the run does not wait for them.
- A batch runs many agents at once, so it uses their Claude plan's usage faster. If it reaches the limit, the run stops. Say "carry on with the batch" later, and it picks up from `landing-pages/batch.md`.

## 2. Run every client at the same time, in waves

Never run the clients one after another. Each wave below starts the same job for every client in ONE message, so they run side by side. Put every agent of a wave in that one message, however many there are: a second message waits for the first to finish. Several Bash calls in one message run one after another, so a wave of captures is always ONE `kit.sh captures` command. Wait for a wave to finish, then start the next.

After each wave starts, run ONE command `bash KIT/scripts/kit.sh await --multi landing-pages/<site1> <files> -- landing-pages/<site2> <files>` in the foreground (timeout 600000 ms; no `&&` chaining so the permission hook approves it automatically), and run it again on STILL RUNNING. Between waves, write nothing in chat: no "both captured", no "now the lead check". The person hears from you at exactly 3 moments: the start line, the audits done, the pages done.

The files to await: waves 4 to 6 as in `KIT/steps/1-audit.md` part 4; wave 7 `audit.md`; wave 8 `page.html`; wave 9 `r1/critic.md`; wave 10 `review.html`.

Give every agent the full path of its client's work folder and the full path of KIT in its task message. Agents cannot start other agents, so you start all of them.

1. **Capture.** Capture every client's page at the same time with one command. Each one gets its own work folder in `landing-pages/`:

       bash KIT/scripts/kit.sh captures landing-pages <url 1> <url 2> ...

   A client it prints as NOT CAPTURED gets one more try with `kit.sh capture <url> landing-pages/<site>`. If that fails too, mark it "failed" in `batch.md` with the reason in plain words, for example: "Their site blocks visitors from this country. Send a full-page screenshot and the page text, then say carry on." It leaves the batch. When `captures` prints PHONE NUMBERS DIFFER, write it in the client's row under "check before it goes live".
2. **Market.** For each client, search the web for 2 or 3 competitors (`KIT/steps/1-audit.md`, part 2). Run the searches for all clients in one message. Capture every client's competitors in ONE command, so they run side by side: `bash KIT/scripts/kit.sh captures --quick landing-pages/<site 1>/competitors/<name>=<url> landing-pages/<site 2>/competitors/<name>=<url> ...`. Pick each client's library niche.
3. **Context.** Write each client's `context.md` and `ads.md` from its row (`KIT/steps/1-audit.md`, part 3), and start its `progress.md` with "Captured, context written". Never ask a question. When a fact is missing, write "not known". When checkfacts prints CONFLICTING CLAIMS, settle it yourself: the year their About page states wins (a year beats a count of years); write it under `## The owner settled` as "From their About page: <claim>".
4. **Audit, wave 1.** First run `bash KIT/scripts/kit.sh brief <site>` for every client, and again before waves 2 and 3: it puts every text file the agents read in one file. Then, in one message: `lp-buyers` and `lp-competitors` for every client.
5. **Audit, wave 2.** In one message: for every client, `lp-buyer-journey` twice (persona 1 and persona 2), `lp-leaks`, `lp-actions`, `lp-offer`, `lp-forensics`, `lp-trust`, `lp-anatomy`, `lp-psych`, `lp-design`, and `lp-ad-match` when it has `ads.md` or paid ads.
6. **Audit, wave 3.** In one message: `lp-copy` for every client.
7. **Audit lead.** In one message: `lp-lead` for every client. It checks the findings, writes `facts.md` and `audit.md`, and draws `audit.html`. Mark each row "audit done" in `batch.md` with its 3 biggest fixes. Audits only: go to part 3. Otherwise send one message now, as visible chat text: for each client, its score out of 100, the one fix that wins it the most enquiries, and the full path of its `audit.html` as a link. Then say the new pages are next and about how long they take, and start wave 8 in the same turn.
8. **Build.** In one message: `lp-builder` with task "build" for every client. Each one picks the style, builds the page and runs the guard. When 2 or more clients share a library niche, give each of them "Style rank: 1", "Style rank: 2" and so on in its task message, so no two of them get the same look.
9. **Review.** Each builder already rendered round 1 at laptop and phone size. In one message: `lp-critic` for every client.
10. **Fix.** In one message: `lp-builder` with task "fix" for every client. Mark each row "page done" in `batch.md` with the paths of `audit.html` and `page.html`.

When an agent fails or a script fails twice for one client, write the reason in its row, mark it "failed", and leave it out of the next waves. One client never stops the batch. If the run stops, `batch.md` and each client's `progress.md` say which wave each client reached, so "carry on" starts there.

## 3. Report once

When every row is done or failed, run `bash KIT/scripts/kit.sh review landing-pages/<site>` for each finished client, then `bash KIT/scripts/kit.sh batch landing-pages`. It draws `landing-pages/batch.html`: one card per client with the new page's last-round first screen, the audit score, the 3 biggest fixes and links to its audit, review and page, and the reason for each failed client. Never write batch.html by hand. Open it with `bash KIT/scripts/kit.sh open landing-pages/batch.html`.

Then tell them in a few lines, with no table, no critic and no review scores (the batch page holds those): the full path of batch.html as a link, how many clients are done, which failed and why, and what each client must check before it goes live (the form is connected, the tracking tags, the phone number). Their changes come after, client by client, as in stage 4.
