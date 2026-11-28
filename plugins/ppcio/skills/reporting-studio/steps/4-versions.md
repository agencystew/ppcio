# Stage 2: Build 4 Bespoke Branded Reporting Prototypes + Visual Critic Loop

Goal: Instead of spitting out a rigid template, you build **4 genuinely distinct, interactive reporting web apps** natively inside the buyer's real brand from one verified `facts.json`, display all 4 side by side on a desktop + phone visual comparison board (`versions/board.html`), pick the strongest one, and polish it through a visual + mechanical Critic Loop until it clears 9/10.

## 1. Write `versions/briefs.md` First

After running `brand_harvest.cjs` and `build_facts.py`, inspect `inputs/brand.md`, `inputs/brand-site-desktop.png` (if captured), any `inputs/current-report.*`, and `facts.json`. Write `versions/briefs.md` with four genuinely different architectural briefs (`## A`, `## B`, `## C`, `## D`), never 4 color swaps of one layout:

| Letter | Name the Owner Sees | Architectural Direction |
|---|---|---|
| A | Your current report, rebuilt cleanly | If they gave a current PDF/screenshot: keeps the familiar structure their client expects, strips vanity bloat, isolates Brand vs Non-Brand, and elevates it into their real website brand. If no current report: clean Single-Page Executive Memo tailored to print/PDF and web. |
| B | Executive Interactive Web App | Full agency-branded live web app: custom SVG KPI sparklines, MTD budget pacing gauge with today-elapsed marker, Brand vs Non-Brand split bar, proportional campaign spend table, and interactive search-term + work-completed tabs. |
| C | Plain-English Mobile Client Brief | Designed mobile-first at 390px like a private-banking weekly memo for a busy founder reading on their phone: 3 calm numbers vs. own 6-month normal, crisp monthly SVG bar chart, plain-English work log, zero PPC jargon. |
| D | The Bold Signature Portal | Dual-mode workspace (Internal 10-Min Call Prep + Copy-Ready Monday Email with one-click Copy button) PLUS one signature visual moment engineered specifically for this client's account (e.g., Brand vs Non-Brand cost bridge, scale elasticity curve, or vertical lead breakdown). |

## 2. Build All 4 Bespoke Versions (Parallel When Your App Supports Subagents)

Each version is authored from scratch in clean standalone HTML/CSS/JS (no external build step required; load the real webfonts from `inputs/brand.json` with clean fallbacks) powered strictly by `facts.json`:
- Write `versions/<x>/page.html` and `versions/<x>/note.md` (line 1: version name; line 2: one crisp sentence explaining the design idea and why a client would love it).
- **Parallel apps (Claude Code, Antigravity, etc.):** Launch 4 builder subagents in parallel (one per letter A, B, C, D), giving each the full paths to `inputs/brand.md`, `inputs/brand.json`, `facts.json`, `TASTE.md`, and its section of `versions/briefs.md`.
- **Single-agent apps (Codex, Cursor, etc.):** Author A and B first, run `studio_board.cjs board` so they see live previews immediately, then author C and D and refresh the board.

Every builder MUST run before finishing its version:
1. `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" shot <work-dir>/versions/<x>/page.html <work-dir>/versions/<x>/shots`
2. `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" verify-dom <work-dir>/versions/<x>/page.html --facts <work-dir>/facts.json`
3. `python3 "${CLAUDE_SKILL_DIR}/scripts/verify_report.py" --facts <work-dir>/facts.json --draft <work-dir>/versions/<x>/page.html` (use `--internal` only for internal call-prep sections if needed; client-facing views MUST pass strict client mode!)
4. Open `shots/desktop.png` and `shots/phone.png` with your file/image viewer and fix any awkward spacing, crowded labels, or unbranded defaults immediately.

## 3. Build the Side-by-Side Comparison Board & Name Your Pick

1. Open all desktop and phone previews across versions A, B, C, and D (plus `inputs/current-report.*` if supplied).
2. Decide which version best serves this buyer's audience and write `<work-dir>/versions/pick.md`:
   - Line 1: single letter (`a`, `b`, `c`, or `d`)
   - Line 2: one plain sentence explaining why this version wins for their client/stakeholder.
3. Generate the comparison board:
   `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" board <work-dir> --title "<Agency>: 4 Reporting System Prototypes for <Client>"`
4. Share the clickable full path to `<work-dir>/versions/board.html` with 1 short line per version and your pick, then immediately promote and polish your pick (their choice always overrides yours if they ask for another letter).

## 4. Closed-Loop Visual & Truth Critic (Up to 3 Rounds on the Pick)

1. Promote the winning version:
   `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" pick <work-dir> <letter>`
2. Run a fresh screenshot + mechanical verification pass on `<work-dir>/final/page.html`:
   - `studio_board.cjs shot <work-dir>/final/page.html <work-dir>/final/shots`
   - `studio_board.cjs verify-dom <work-dir>/final/page.html --facts <work-dir>/facts.json`
   - `verify_report.py --facts <work-dir>/facts.json --draft <work-dir>/final/page.html`
3. Open `final/shots/desktop.png`, `final/shots/desktop-full.png`, and `final/shots/phone.png` and grade all 5 dimensions in `TASTE.md`. Fix every flaw below 9/10 and re-verify (max 3 rounds; never regress JS or truth gates).

## 5. Package Into the `$0/mo` Multi-Client Token-Gated Portal

Once `final/page.html` passes visual and mechanical gates, wrap it untouched into the permanent static portal:
`python3 "${CLAUDE_SKILL_DIR}/scripts/portal_pack.py" --html <work-dir>/final/page.html --facts <work-dir>/facts.json --portal <portal-dir> --agency "<Brand>" --brand-json <work-dir>/inputs/brand.json`
