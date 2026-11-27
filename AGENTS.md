# PPC.io for any AI agent

This repo is **PPC.io**: the complete Landing Page Studio (16 specialist agents, 4 build modes, self-healing `kit.sh next` harness, 6 paid-search CRO playbooks, 322-page graded style library), 4 standalone Quick-CRO skills, brand-adaptive HTML client dashboards & audit decks, 33 Google Ads skills, 21 ready-to-run Google Ads Scripts, and 24 deep PPC Knowledge Playbooks. Claude Code installs it as a plugin (see `README.md`). Any other AI coding agent (Codex, Cursor, Antigravity, Windsurf, Gemini CLI) uses it directly via `install.sh` or this folder.

When the user asks what PPC.io can do, or asks for help with a landing page or Google Ads:

1. **Front door:** Read `plugins/ppcio/skills/start/SKILL.md` and follow it. In any skill, `${CLAUDE_SKILL_DIR}` means that skill's own folder, and `KIT` means `plugins/ppcio/skills/landing-page`. Skip instructions mentioning `/plugin` or `claude plugin` (those are for Claude Code; in other apps, re-running `install.sh` updates the kit).
2. **Landing pages & CRO:** Read `plugins/ppcio/skills/landing-page/SKILL.md`.
   - For **quick CRO questions** (headline critique, form teardown, offer/risk reversal, AI-slop check, vertical LP structure), load only the 1 or 2 matching playbooks in `plugins/ppcio/skills/landing-page/references/` and answer immediately without forcing a full capture/build pipeline.
   - For **full audits & builds**, follow its "Your app" section. Run `bash KIT/scripts/kit.sh agents-dir` to get the exact resolved path to the 16 `lp-*.md` specialist files (works reliably even through symlinked skill directories). If your app does not support parallel subagents, read each specialist file and write its output file sequentially, skipping `kit.sh await`.
3. **Quick-CRO, Google Ads, Scripts & Playbooks:** The complete job-indexed catalog is in `plugins/ppcio/skills/start/catalog.md`. Every skill lives at `plugins/ppcio/skills/<name>/SKILL.md` (with `python3` scripts inside `<skill>/scripts/`, 21 production `.js` scripts inside `google-ads-script-creator/scripts-library/`, and 24 deep playbooks inside `ppc-playbooks/references/`).

## Running tools cleanly in non-Claude hosts

- **`kit.sh next <site>` drives every full run.** After every step, run `bash KIT/scripts/kit.sh next <site>`. It reads the work folder, checks the last step's file and prints the one next step. Do it, then run `next` again, to the finished page. When it names agents and your app has none, read each named `lp-*.md` file and write its output file yourself, one at a time, then run `next`. When it asks for a fresh critic or a case check and you have no subagents, judge only the images and files it names, as a stranger who never saw your plan.
- Run studio tools only as `bash <repo>/plugins/ppcio/skills/landing-page/scripts/kit.sh <command>` from the user's working folder (client work goes in `landing-pages/` there).
- **Local Studio server:** `kit.sh view <site>` starts the local studio server and prints the first-look message. If your runtime kills background `nohup` children when a shell command exits, either run `bash KIT/scripts/kit.sh studio 4870` as a persistent daemon, OR skip the localhost server, run `bash KIT/scripts/kit.sh firstlook <site>` after writing `first-look.md`, and share the standalone files (`audit.html`, `directions/styles.html`, `page.html`, `<site>-page.zip`). Skip `kit.sh wait` when no persistent server is running.
- **Runtime setup:** Node.js (v24) and the headless Chromium page checker install automatically on macOS and Linux on first run (about 1 minute). On other systems, Node 18+ and Python 3 are needed.
- **Updates:** Re-run `install.sh` or `git pull` in `~/.ppcio/kit`.

Talk to the user in plain, direct words. Never invent numbers, reviews, prices, or promises. Every finished deliverable comes with its clickable link or full file path.
