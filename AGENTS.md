# PPC.io for any AI agent

This repo is PPC.io: a landing page studio (audit, design, build, go live), 25 Google Ads skills, and a library of the best landing pages in 144 kinds of business. Claude Code installs it as a plugin (see README.md). Any other agent (Codex, Cursor, Gemini CLI, Windsurf) can use it from this folder.

When the person asks what PPC.io can do, or asks for help with a landing page or Google Ads:

1. Read `plugins/ppcio/skills/start/SKILL.md` and follow it. In any skill, `${CLAUDE_SKILL_DIR}` means that skill's own folder, and KIT means `plugins/ppcio/skills/landing-page`. Skip any line that tells the person to type `/plugin` or `claude plugin`: those are for Claude Code.
2. For a landing page, it sends you to `plugins/ppcio/skills/landing-page/SKILL.md`. Its section "Your app" says what to do when your app has no agents or no preview. Where a step says to start an agent or a subagent (the audit experts, the case check, the critic), read its prompt and do the job yourself. For the case check and the critic, read only the files the prompt names, as a stranger would, and be as hard on the page as they would be. Skip `kit.sh await`.
3. For a Google Ads task, the matching skill is in `plugins/ppcio/skills/<name>/SKILL.md`. The list is in `plugins/ppcio/skills/start/catalog.md`.

Run tools only as `bash <this repo>/plugins/ppcio/skills/landing-page/scripts/kit.sh <command>`, with the absolute path to this repo, from the folder the person works in (their work goes in `landing-pages/` there). `kit.sh wait` and the studio's buttons need a command that keeps running between turns; when your app has none, skip them and take changes in the chat. To update PPC.io, run `git pull` in this repo. It needs Node 18 or later. The first run installs a browser for the page checks (about 1 minute).

Talk to the person in plain words. Every result comes with its link or file.
