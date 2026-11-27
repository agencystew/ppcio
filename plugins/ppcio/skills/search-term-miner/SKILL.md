---
name: search-term-miner
description: "Mine a Google Ads search terms CSV for wasted spend using n-grams judged against the account's own target CPA or ROAS, protect brand, service synonyms, competitor, and location words, and simulate every negative against Google's matching rules before human approval. Use when someone attaches a search terms report or asks for negative keywords and wasted spend. Not for small pasted tables under 50 rows (use negative-keyword-analyzer) or writing ads (use rsa-asset-writer)."
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.3.0"
---

# Search Term Miner

A bad negative keyword is worse than wasted spend because it silently blocks profitable searches for months. This skill follows a **mechanical before magical** discipline: deterministic Python scripts calculate n-gram waste against the account's real target CPA/ROAS and simulate every proposed negative against Google's exact matching rules before a human ever approves it.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Check for a local `landing-pages/*/context.md` first (it holds what they sell, where they work, and core buyer searches). Read [references/account-profile.md](references/account-profile.md) when no profile exists yet: confirm currency, target CPA/ROAS (per campaign if different), brand terms + misspellings, services sold (including colloquial synonyms & device names!), services NOT sold, target locations per campaign, and never-negate words.
- **Inputs:** Search Terms CSV (30 to 90 days, ending 3 to 5 days ago to respect conversion lag; columns: Search term, Match type, Campaign, Ad group, Impr., Clicks, Cost, Conversions, Conv. value) + ideally Search Keywords CSV (so the simulator catches negatives that block enabled keywords). If they want live/automated exports, point to `connect-data-sources` or bundled script `02-search-term-ai-ready-export.js`.
- **Data gates:** No target CPA/ROAS -> ask, never guess. Conversions column missing -> stop (cannot judge waste). Under 30 days -> state clearly and only flag high-confidence terms >=2x target.

## First-Principles Nuance (Don't Negate Like a Robot)

1. **Protect industry synonyms & colloquialisms:** Never auto-negate abbreviations, device names, or everyday words customers use for the core service (e.g., `"lipo"` for `"liposuction"`, `"ac"` for `"air conditioning"`). Add them to `services.txt` so you negate only the disqualifying modifier (`"school"`, `"salary"`, `"diy"`), never the core service.
2. **Intent over blunt word bans:** Distinguish *early-funnel question* research (`"how much does X cost"`) from *near-buy noun* price queries (`"X cost near me"`). Similarly, `"cheap dental implants near me"` can convert well in price-sensitive trades; always read the actual converting queries before excluding any price modifier.
3. **Spot internal auction cannibalization:** Watch for identical search terms triggering across 2 or 3 campaigns (e.g., Broad Search + Exact Search + PMax) at wildly different CPCs (200% to 900% variance is common!). Flag those for exact-match traffic routing negatives (`[exact]` in the wrong campaign), not account-wide blocks.
4. **Noise vs. proof:** Zero-conversion queries with spend under half the target CPA (`expected_leads < 2`) belong on the **Watch List**, not the negative list, unless clearly irrelevant (a job seeker, another trade, or out-of-area state).

### Weak 5/10 vs. 10/10 Search Term Review

- **Amateur:** Adds `free`, `cost`, and `emergency` as broad negatives across the account without simulation, silently killing 40 converting `"emergency plumber cost"` queries.
- **10/10 Senior:** Runs `st_miner.py` + `simulate_negatives.py`, explicitly lists converting words kept on purpose (`"emergency"`: 38 conv, `"cost"`: 14 conv), catches `"turkey"` (`£437, 102 clicks, 0 conv`) and plural variants (`"course"` + `"courses"`), flags 3 queries cannibalizing between Broad and Exact at 4x CPC, and hands over a `Checks: PASS` paste-ready list for human approval.

## Workflow (Verify -> Critique -> Refine)

1. Write `protect.txt` (brand + misspellings, targeted competitors, never-negate words), `services.txt` (core services + buyer synonyms), and `locations.txt` (`campaign text: town, town`).
2. Mine candidates:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/st_miner.py" <csv> --target-cpa <CPA> [--campaign-target "Implants=90"] --protect protect.txt --services services.txt --locations locations.txt --exclude-campaign "<brand pattern>" --low-spend <half target>`
   (For ecommerce, pass `--target-roas <ROAS>` instead.)
3. Read [references/field-notes.md](references/field-notes.md) and inspect EVERY candidate's actual queries. Keep a negative only if it is wrong for this business across every query. Route wrong-location towns to campaign-level negatives, never account-wide. Call out the **"Kept on purpose (they convert)"** words explicitly.
4. Draft `negatives.txt` (`word` broad, `"phrase"`, `[exact]` with `campaign=<text> |` or `list=<name> |` prefix) using [references/negatives-rules.md](references/negatives-rules.md). Remember Google negatives do NOT auto-match plurals or close variants.
5. Simulate and loop until spotless:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/simulate_negatives.py" <csv> negatives.txt --protect protect.txt --exclude-campaign "<brand pattern>" --keywords <keywords.csv>`
   Fix every `STOP` (blocks conversions, protected word, or enabled keyword) and every missed plural/variant, then re-run until `Checks: PASS`. Never hand over an unsimulated list.

## Closed-Loop Self-Check & Critique (Run Before Answering)

Before delivering your final review (draft only; a human uploads, and rechecks Non-Brand volume/CPL after 14 days as a rollback guardrail):
1. **Simulator & math truth:** Totals match the export minus brand; waste dollar figure comes strictly from the simulator's deduplicated `TOTAL` line; zero invented figures.
2. **Adversarial trap check:** Could any proposed broad negative quietly block a converting synonym or plural? Did I leave Brand campaigns untouched unless explicitly asked? Did I check for cross-campaign cannibalization?
3. **Plain human delivery:** Present the clean executive summary (spend analysed, deduplicated waste blocked, negatives to approve with cost/clicks/conv/confidence, words kept on purpose, watch list, needs-a-human-call items, and paste-ready simulator blocks) in plain English with zero em dashes. If search terms look clean yet CPA is still high, point naturally to `landing-page` or `conversion-lag-check`.
