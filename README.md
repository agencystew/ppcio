# PPC.io

A decade of paid-search landing page mastery and Google Ads systems — packaged as one clean, portable plugin for **Claude Code**, **Cursor**, **Codex**, **Antigravity**, **Windsurf**, and **Gemini CLI**.

Drop it into your AI agent and immediately get:
- **The Complete Landing Page Studio:** 16 specialist agents, a self-healing step harness (`kit.sh next` with automated review loop, rollback, and local taste memory), 6 battle-tested paid-search CRO playbooks, instant Quick-CRO answers, and all **4 Postclick build modes** (Full Redesign, Improve Existing Page, Build New Campaign Page From Scratch, and A/B Test Variants) + Agency Batch Mode.
- **322-Page Graded Style Library:** The highest-scoring landing pages across 144 niches (selected from 1,112 graded pages), with real section breakdowns and anti-AI-slop design rules.
- **4 Standalone Quick-CRO Skills:** Founder-voice copy rewrites, ad-to-page message match, buyer-objection fixes, and single-variable A/B experiment briefs.
- **Brand-Adaptive Client Reporting Suite:** Interactive self-contained HTML client performance dashboards + multi-client static portal hub (`client-report-dashboard`) and 12–15 slide audit pitch decks (`google-ads-audit-sales-presentation`) that adapt to **your own agency colours, logo, and typography** across 4 clean themes — never hardcoded to one style.
- **33 Google Ads & Reporting Skills:** Search term mining with negative impact simulation, RSA character/fact linting, conversion-lag analysis, change detective, PMax & Shopping builders, Quality Score repair, tracking planner, bidding decision tree, weekly client emails, and agency pitch tools.
- **21 Ready-to-Run Production Google Ads Scripts:** PMax Insight Engine, Make Exact Match Exact, Wasted Spend Forensics, Ad-to-LP Mismatch Detector, Conversion Health Check, Quality Score Tracker, MCC Daily Monitor, and AI-ready account exports.
- **24 First-Principles PPC Knowledge Playbooks:** Deep paid-search foundations covering unit economics, measurement, Shopping feeds, broad match governance, bidding, scaling, and the 8-layer Paid Media Performance System.

---

## Install in 2 Lines (Claude Code — Recommended)

Claude Code gives the fullest experience (parallel specialist agents, zero-friction permissions, and live preview). In Claude Code (the **Code** tab in Claude Desktop, or terminal), run:

```
/plugin marketplace add https://github.com/agencystew/ppcio.git
/plugin install ppcio@ppcio
```

Start a new chat and ask:

```
what can PPC.io do for me?
```

It asks for your website and delivers the first 3 things a buyer notices on it in about 2 minutes — or ask any quick CRO or Google Ads question immediately.

If you have a PPC.io Pro licence key (starts with `PPCIO-`), paste it into the chat at any time.

---

## Install in 1 Line (Cursor, Codex, Antigravity, Windsurf & Gemini CLI)

Paste this single line into your terminal:

```sh
curl -fsSL https://raw.githubusercontent.com/agencystew/ppcio/main/install.sh | sh
```

It clones PPC.io into `~/.ppcio/kit`, links all 40 skills cleanly into every AI tool detected on your machine (`~/.cursor/skills`, `~/.agents/skills` for Codex, `~/.gemini/antigravity/skills`, `~/.codeium/windsurf/skills`, `~/.gemini/skills`), and prepares the browser checker automatically.

Open your AI tool in any project folder and ask: `what can PPC.io do for me?`
Re-run the same command any time to pull updates.

---

## What You Can Ask Right Away

- **Full Landing Page Audit & Build:** *"Audit and redesign https://mybusiness.com for my Google Ads traffic."*
- **Quick CRO Help (30 seconds):** *"Critique this hero headline"*, *"Why isn't my mobile roofing form converting?"*, *"Check this landing page copy for AI slop"*, *"Compare my Google Ads against my landing page opening."*
- **Google Ads Data & Scripts:** *"Mine wasted spend from this 90-day search terms CSV"*, *"Give me the PMax Insight Engine script"*, *"My ads aren't showing — help me troubleshoot"*, *"Check if this week's CPA drop is real or conversion lag."*
- **Agency Mode:** *"Run audits and new pages for these 5 client URLs."*

---

## Free vs. PPC.io Pro

| Capability | Free | PPC.io Pro |
|---|---|---|
| Quick CRO help & all 6 paid-search CRO playbooks | ✓ | ✓ |
| 4 Quick-CRO skills (`lp-copy-rewrite`, `lp-message-match`, etc.) | ✓ | ✓ |
| 33 Google Ads & brand-adaptive HTML reporting skills, 21 scripts & 24 playbooks | ✓ | ✓ |
| First look at your page (first 3 buyer blockers in ~2 min) | ✓ | ✓ |
| Full 14-specialist landing page audit | 1 website | Unlimited websites |
| 9-style board, full custom page build, critic & go-live zip | | ✓ |
| Agency batch mode (multiple clients in parallel) | | ✓ |
| Full 322-page graded style library (144 niches) | Best page per niche | All 322 pages |

---

## Requirements & Privacy

- **Platform:** macOS or Linux (Windows via WSL). Node.js and the headless Chromium page checker install automatically on first run (about 1 minute) — nothing to configure manually.
- **Privacy:** Everything runs locally on your computer inside your own AI tool. Your client pages, copy, and Google Ads CSV exports are never sent to PPC.io servers. With a Pro licence key, the 322-page style library downloads once from PPC.io; that request sends only your licence key.

## Updates

- **Claude Code:** Type `/plugin`, open **Marketplaces**, select `ppcio`, and enable auto-update (or ask *"update PPC.io"*).
- **Other AI tools:** Re-run `curl -fsSL https://raw.githubusercontent.com/agencystew/ppcio/main/install.sh | sh`.

