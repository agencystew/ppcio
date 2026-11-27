# What changed in PPC.io

Newest first. Update: in Claude Code, /plugin then Marketplaces then ppcio then Update. Elsewhere, run the install line again.

## 0.8.7 (27 Nov 2026)

- Stronger proof on every page: the kit now hunts reviews, ratings and awards before it builds. A final fresh check scores every finished page, and the studio shows each step of your build.

## 0.8.6 (27 Nov 2026)

- Higher bar: the page review scores on an absolute scale and adds a craft score. The studio shows the build screen while your page is built.

## 0.8.5 (27 Nov 2026)

- Sharper, normal human conversion copy rules (no poetic/verbose AI phrasing), cleaner first-answer & README copy, and fixed chat-check wording.

## 0.8.4 (27 Nov 2026)

- Quieter runs: the AI waits for each check without status messages. New page checks for a repeated button and a small logo. The first answer names your 12 specialists.

## 0.8.3 (27 Nov 2026)

- Windows: the installer gives the WSL steps.

## 0.8.2 (27 Nov 2026)

- Fixes from blind run 12: the review loop stops at the best page, renders load every photo, the critic trusts the business's own facts. Updates now reach every buyer.

# Changelog

## 0.8.1 (27 Nov 2026)
- **Every postclick prompt, open:** `skills/landing-page/postclick/` holds the 53 prompts that ran postclick (24 audit, 27 build, 2 A/B) and its 4 house rules, with a README that maps each one to the kit. New jobs: thank-you pages and quiz funnels, and a plan for a whole site.
- **Fixes from blind run 12:** the first look is checked before it is shown; the audit asks for its Verdict line; the report always links the studio; dollar amounts in skills no longer turn into the website address.
- **Connect Your Analytics & Ad Platforms on the Fly (`connect-data-sources`):** Added a guided, read-only data connector skill for **Google Ads, GA4, Microsoft Clarity, Meta Ads, and Google Search Console** (offering both a 30-second zero-setup CSV export path and a live MCP/API/Script connection path), plus natural non-blocking offers across Landing Page Studio and Client Report Dashboards.
- **Real Data Piped Automatically into Every Audit Expert:** `kit.sh brief` now automatically includes `data/analytics-summary.md` (and any `data/*.md` / `data/*.txt` files) inside `audit/brief.md`, so all 14 Landing Page Studio specialists use actual search terms, mobile vs. desktop conversion gaps, scroll drop-offs, and rage-clicks whenever provided.

## 0.8.0 (26 Nov 2026)
- **All 4 Postclick build modes & brand-adaptive HTML client reporting:** Added full support for Redesign, Improve Existing Page (`steps/improve.md`), Build New Campaign Page From Scratch (`steps/new-page.md`), and A/B Test Variants (`steps/variants.md`), plus the brand-adaptive `client-report-dashboard` HTML reporting & multi-client portal suite (4 selectable themes, zero hardcoded agency branding) and de-hardcoded brand-adaptive audit sales decks.
- **Built-in paid-search CRO knowledge base & Quick CRO mode:** 6 battle-tested reference playbooks inside the Landing Page Studio (CRO doctrine, above-the-fold & message match, anti-AI-slop voice & design, offer & risk reversal, forms/mobile/tracking, and 6 vertical playbooks) so your agent gives sharp paid-search CRO answers immediately on quick questions as well as full page builds.
- **4 standalone Quick-CRO skills:** `lp-copy-rewrite`, `lp-message-match`, `lp-buyer-objections`, and `lp-experiment-brief` work directly on pasted copy/screenshots or local `landing-pages/` audits with zero external account needed.
- **Expanded Google Ads bonus suite:** 32 Google Ads skills (including 7 new interactive workshops: Ads Not Showing, Quality Score Repair, Conversion Tracking Planner, Bidding Strategy Decision Tree, Ecommerce Shopping Builder, Keyword Universe Builder, and Lead-Gen Quality), 21 ready-to-paste production Google Ads Scripts (`google-ads-script-creator/scripts-library/`), and 24 first-principles PPC Knowledge Playbooks (`ppc-playbooks`).
- **One-line multi-tool installer:** Installs cleanly for Codex, Cursor, Windsurf, Antigravity, and Gemini CLI (in addition to Claude Code's 2-line plugin install), with automatic Node.js and browser setup on macOS and Linux.
- **Same clear chat & exact Studio v2 score parity:** 5 clean stage messages, exact score parity between `audit.html`, `batch.html`, chat, and Studio, clean raw GTM tracking capture, zero permission spam on Pro library reads and PPC URLs with `&` query params, and reliable non-Claude agent/studio paths.
- Faster audits: each specialist reads your page in one go and writes once, so the audit uses fewer tokens.
- You always see your new look before the whole page is built, so you can switch styles early.
- A new page goes back for more rounds of fixes until a fresh critic scores it 8 or more out of 10 on every point and above your page today.
- Every step checks its own work before the next one starts: no invented quote, figure, phone number or promise reaches you.
- The kit learns on your computer: the mistakes it made before, and the changes you asked for, shape the next page.

## 0.7.0 (26 Nov 2026)
- The PPC.io studio: the postclick app's own screens, on your computer. Your audit, the live wait while the specialists work, your designs and your new page beside your live one, on a laptop and a phone. Claude opens it beside the chat.
- Press "Build my new page" or type a change in the studio, and Claude does it in your chat. No copying and pasting.
- 4 more specialists: trust, page sections, what makes your buyers act, and design. Your audit now has its page score.
- The spotlight on each fix sits on the real words of your page, on a laptop and a phone.

## 0.6.0 (26 Nov 2026)
- One plugin for everything: install `ppcio@ppcio` and ask "what can PPC.io do for me?". Claude asks for your website and shows the first 3 things a buyer notices, in about 2 minutes.
- 25 Google Ads skills are now inside: search terms, ads, account audits, client reports, budgets, scripts and more.
- The PPC.io licence: paste your key (it starts with PPCIO-) and every website, the page build, the full style library and agency mode open. The key is checked on your computer. No account.
- The free version: the first look and the full audit on one website, and all 25 Google Ads skills.

## 0.5.0 (26 Nov 2026)
- Agency mode: give a list of client pages and every client runs at the same time. 5 clients take about 30 to 40 minutes.
- A live wait screen while the audit runs: your page, the 10 specialists and each one's first finding as it lands.
- The style board has the postclick app's look: big shots, a number and one line on what each page does best.
- A review screen after the build: the blind test scores of your page today against the new one, both first screens side by side, and every fault fixed.
- Agency mode: one summary page for the batch (`kit.sh batch`), a failed client gets a second try and a plain reason, and a phone number that differs across the page is flagged.
- The audit is not drawn while a suggested line still holds a blank or a note to fill in.
- New: `kit.sh pack` copies every photo into the page's own folder, so the page stands alone when it goes live.
- Fewer "Allow?" prompts: the kit's own files and folders are approved while it runs.
- The audit runs the postclick app's credibility checks in code: a finding that calls something missing when the page has it, a quote that is not on the page, a repeated finding, and a copy line that is not on the page are all removed before you see the audit.
- The page check lists every number on the new page (a price, a time, a year, a review count) that is not in the business's own words, so no figure is made up.
- The capture opens the pop-up form behind an estimate or quote button and saves it, so the audit can judge the main action.
- Agency mode: clients of the same trade in one batch each get a different style from the library.
- Blocked pages stop in seconds with the reason, and the kit asks for a screenshot instead.

## 0.4.0 (25 Nov 2026)
- First version: audit in the postclick app's design, style library, full build, critic review and go-live steps.
