# Stage 2: Build 4 Bespoke Branded PPC Ops & Audit OS Prototypes + Visual Critic Loop

Goal: Instead of rendering a rigid Python template, you build **4 genuinely distinct, interactive PPC Operations & Audit web apps** natively inside the buyer's real brand from one verified `ops_state.json`, show all 4 side by side on a laptop + phone comparison board (`versions/board.html`), name your recommended pick, and polish it through a closed-loop Visual + Truth Critic until it clears 9/10.

## 1. Write `versions/briefs.md` First

After running `brand_harvest.cjs` and `ops_engine.py`, inspect `inputs/brand.md`, `inputs/brand-site-desktop.png` (if captured), any existing audit doc they shared, and `ops_state.json`. Write `versions/briefs.md` with four genuinely distinct architectural briefs (`## A`, `## B`, `## C`, `## D`), never 4 color swaps of one layout:

| Letter | Name the Owner Sees | Architectural Direction |
|---|---|---|
| A | Morning Ops Command Cockpit | 9am standup war room in their real brand: noise-disciplined risk queue collapsing `FINE` accounts to one count, 4 dependency-gated team batch columns (`Tracking -> Web/LP -> PPC Ready -> PPC Held [disabled checkboxes]`), and direct Ads Editor CSV export actions. |
| B | 6-Tab Causal Deep Audit Workbench | Interactive multi-account audit workspace with `<select>` switcher, Monday Overview with 5-Part Finding Cards, neutral A-D topic grades, Tracking & Lead Integrity view, Ads & LP leak table, persistent `"Not right? Tell us why"` memory, and clean Full Data tab. |
| C | Revenue Opportunity & Executive Pitch Board | Boardroom/CFO/new-biz interactive pitch app: multi-account switcher, transparent conservative 40% waste recovery math + LP CVR lift + profitable search headroom cards, interactive SVG recovery waterfall, 3-phase 90-day roadmap, and mandatory `"What Is Already Working (Protect First)"` restraint block. |
| D | The Bold Unified Agency OS | Master-detail multi-client command web app styled like flagship SaaS inside their real agency brand: persistent left client rail sorted by severity, instant mode switcher (Triage / Deep Audit / Opportunity Pitch), live dependency lock indicators, and one signature executive health strip. |

## 2. Build All 4 Bespoke Versions (Parallel When Your App Supports Subagents)

Each version is authored from scratch in clean standalone HTML/CSS/JS (no build step; load real webfonts from `inputs/brand.json` with clean fallbacks) powered strictly by embedding or reading `ops_state.json`:
- Write `versions/<x>/page.html` and `versions/<x>/note.md` (line 1: version name; line 2: one sharp sentence on how this OS upgrades their workflow).
- **Parallel apps (Claude Code, Antigravity, etc.):** Launch 4 builder subagents in parallel (one per letter A, B, C, D), passing full paths to `inputs/brand.md`, `inputs/brand.json`, `ops_state.json`, `TASTE.md`, and its section of `versions/briefs.md`.
- **Single-agent apps (Codex, Cursor, etc.):** Author A and B first, run `studio_board.cjs board` to show live previews fast, then author C and D and refresh the board.

Every builder MUST run before finishing its version:
1. `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" shot <work-dir>/versions/<x>/page.html <work-dir>/versions/<x>/shots`
2. `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" verify-dom <work-dir>/versions/<x>/page.html --state <work-dir>/ops_state.json`
3. `python3 "${CLAUDE_SKILL_DIR}/scripts/verify_audit.py" --draft <work-dir>/versions/<x>/page.html --state <work-dir>/ops_state.json --type <lead_gen|ecommerce|saas>`
4. Open `shots/desktop.png` and `shots/phone.png` with your viewer and fix any visual clutter, overflow, or off-brand styling immediately.

## 3. Build the Side-by-Side Comparison Board & Name Your Pick

1. Open all desktop and phone previews across versions A, B, C, and D.
2. Pick the direction that best matches their team size and primary pain point, and write `<work-dir>/versions/pick.md`:
   - Line 1: single letter (`a`, `b`, `c`, or `d`)
   - Line 2: one plain sentence explaining why this OS fits their team best.
3. Generate the comparison board:
   `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" board <work-dir> --title "<Org>: 4 PPC Operations & Audit OS Prototypes"`
4. Present the clickable full path to `<work-dir>/versions/board.html` with 1 short line per version and your pick, then immediately promote and polish your pick (their choice always wins if they ask for another letter).

## 4. Closed-Loop Visual & Truth Critic (Up to 3 Rounds on the Pick)

1. Promote the winning version:
   `node "${CLAUDE_SKILL_DIR}/scripts/studio_board.cjs" pick <work-dir> <letter>`
2. Run screenshot + DOM + 6-gate audit verification on `<work-dir>/final/page.html`:
   - `studio_board.cjs shot <work-dir>/final/page.html <work-dir>/final/shots`
   - `studio_board.cjs verify-dom <work-dir>/final/page.html --state <work-dir>/ops_state.json`
   - `verify_audit.py --draft <work-dir>/final/page.html --state <work-dir>/ops_state.json --type <lead_gen|ecommerce|saas>`
3. Open `final/shots/desktop.png`, `final/shots/desktop-full.png`, and `final/shots/phone.png` and grade all 5 dimensions in `TASTE.md`. Fix every flaw below 9/10 and re-verify (max 3 rounds).
4. Also write `<work-dir>/audit-summary.md` and pass it through `verify_audit.py` so the team has a verified written brief alongside the live interactive OS and `editor-exports/*.csv`.
