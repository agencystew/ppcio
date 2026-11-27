# PPC.io

Plug a full Google Ads and landing page team straight into **Claude Code**, **Cursor**, **Codex**, **Antigravity**, **Windsurf**, or **Gemini CLI**.

You never memorize commands or copy-paste prompts. Just talk normally, drop a website URL or a Google Ads CSV, and the right workflow, Python audit engine, or headless browser checker kicks in automatically.

Everything inside:
- **Landing Page Studio:** Checks your live page from 14 buyer and conversion angles in a real headless browser, compares it against local competitors, and builds a higher-converting version in your own brand across all **4 Postclick build modes** (Full Redesign, Improve Existing Page, New Campaign Page From Scratch, and A/B Test Variants), plus Agency Batch Mode and thank-you/funnel pages.
- **322-Page Graded Style Library:** The highest-scoring landing pages across 144 niches (picked from 1,112 graded ad pages), with real section breakdowns and strict anti-AI-slop rules.
- **17 Deterministic Python & Browser Engines (Zero Hallucinated Math):** Exact programmatic engines for 90-day causal Google Ads audits (`Brand vs. Non-Brand`, `expected_leads < 2` noise floor), PMax incremental ROAS subtraction, `days_with_spend` budget pacing, spend-weighted Quality Score, P50/P75/P90 CPC forensics, weekly triple-window triage, conversion lag estimation, change detection, search-term negative simulation, 30/90-char RSA linting, white-label HTML client dashboards, and white-label HTML audit pitch decks.
- **41 Ready-to-Run Paid Search & CRO Workflows:** Covers quick copy rewrites, ad-to-page message match, buyer objections, bidding, tracking, Shopping feeds, lead quality, onboarding, sales pitch prep, and custom workflow building.
- **On-the-Fly Data Connections:** Guided setup (30-second CSV exports or live read-only connections) for **Google Ads, GA4, Microsoft Clarity, Meta Ads, and Google Search Console**, automatically piped into your landing page audits and reports.
- **White-Label Client Reporting & Pitch Suite:** Interactive single-file HTML client dashboards, multi-client portals, and keyboard-navigable HTML audit pitch decks that adapt to **your own agency colours, logo, and typography** across 4 clean themes.
- **21 Production Google Ads Scripts & 24 Deep PPC Playbooks:** Ready-to-paste GAQL scripts (PMax Insight Engine, Make Exact Match Exact, Wasted Spend Forensics, MCC Daily Monitor) plus 3,600+ lines of first-principles paid-search foundations.

---

## Install in 2 Lines (Claude Code - Recommended)

Claude Code gives the fullest experience (parallel specialist agents, zero-friction permissions, and live preview). In Claude Code (the **Code** tab in Claude Desktop, or terminal), run:

```
/plugin marketplace add https://github.com/agencystew/ppcio.git
/plugin install ppcio@ppcio
```

Start a new chat and ask:

```
what can PPC.io do for me?
```

It asks for your website and delivers the first 3 things a buyer notices on it in about 2 minutes, or ask any quick CRO or Google Ads question immediately.

If you have a PPC.io Pro licence key (starts with `PPCIO-`), paste it into the chat at any time.

---

## Install in 1 Line (Cursor, Codex, Antigravity, Windsurf & Gemini CLI)

Paste this single line into your terminal:

```sh
curl -fsSL https://raw.githubusercontent.com/agencystew/ppcio/main/install.sh | sh
```

It clones PPC.io into `~/.ppcio/kit`, links all 41 skills cleanly into every AI tool detected on your machine (`~/.cursor/skills`, `~/.agents/skills` for Codex, `~/.gemini/antigravity/skills`, `~/.codeium/windsurf/skills`, `~/.gemini/skills`), and prepares the browser checker automatically.

Open your AI tool in any project folder and ask: `what can PPC.io do for me?`
Re-run the same command any time to pull updates.

---

## Your First 5 Minutes (5 Prompts That Prove the Value Right Away)

You never have to look up a workflow name. Just type any of these in plain English:

1. **2-Minute Live Page Teardown:** *"Audit https://mybusiness.com for my Google Ads traffic and show me the top 3 things costing me leads."*
2. **Exact Google Ads Waste & Brand Check:** Drop any 90-day Campaigns or Search Terms CSV and say *"Audit this account, separate Brand from Non-Brand, and show me where money is leaking."*
3. **30-Second Quick CRO Rewrite:** *"Compare my Google Ads against my landing page opening and rewrite the headline without inventing claims."*
4. **White-Label Client Dashboard or Audit Deck:** *"Turn this campaign export into an interactive HTML client dashboard (or sales pitch deck) in my agency colours."*
5. **Production Google Ads Script:** *"Give me the PMax Insight Engine script or Wasted Spend Forensics script ready to paste into Google Ads."*

*(Also works for **Agency Batch Mode**: "Run audits and new pages for these 5 client URLs", **Thank-you/quiz funnels**, and **Conversion Lag / Change Detection** when leads dip.)*

## Every postclick prompt, open

`plugins/ppcio/skills/landing-page/postclick/` holds the 53 prompts that ran [postclick](https://postclick.ppc.io), word for word: 24 audit experts, the 27-prompt build team (brief, art direction, copy, images, sections, critic, fact check, thank-you pages and funnels) and the A/B test forge. Its README says what each one does and where the kit uses it.

---

## Free vs. PPC.io Pro

| Capability | Free | PPC.io Pro |
|---|---|---|
| Quick CRO workflows & all 6 paid-search CRO playbooks | ✓ | ✓ |
| All 33 Google Ads & reporting workflows, 17 Python engines, 21 JS scripts & 24 playbooks | ✓ | ✓ |
| First look at your page (first 3 buyer blockers in ~2 min) | ✓ | ✓ |
| Full 14-angle landing page audit | 1 website | Unlimited websites |
| 9-style board, full custom page build, fresh review loop & go-live zip | | ✓ |
| Agency batch mode (multiple clients in parallel) | | ✓ |
| Full 322-page graded style library (144 niches) | Best page per niche | All 322 pages |

---

## Requirements & Privacy

- **Platform:** macOS or Linux (Windows via WSL). Node.js and the headless Chromium page checker install automatically on first run (about 1 minute), with nothing to configure manually.
- **Privacy:** Everything runs locally on your computer inside your own AI tool. Your client pages, copy, and Google Ads CSV exports are never sent to PPC.io servers. With a Pro licence key, the 322-page style library downloads once from PPC.io; that request sends only your licence key.
- **If your AI app stops mid-run** (a usage limit, a closed laptop): open a new chat in the same folder and say *"carry on with my landing page"*. The kit reads the files it already wrote and starts at the step it stopped on.
- **The style library** holds screenshots of public landing pages, graded for study and inspiration. PPC.io does not copy their words, logos or photos into your page. If you own a page in the library and want it removed, email support@ppc.io and we take it out in the next update.

## Updates

Every update raises the version number and adds a line to `plugins/ppcio/CHANGELOG.md` that says what changed.

- **Claude Code:** Type `/plugin`, open **Marketplaces**, select `ppcio`, and enable auto-update (or ask *"update PPC.io"*).
- **Other AI tools:** Re-run `curl -fsSL https://raw.githubusercontent.com/agencystew/ppcio/main/install.sh | sh`.

