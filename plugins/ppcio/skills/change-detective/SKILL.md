---
name: change-detective
description: Works out why Google Ads performance changed by finding the day each campaign's clicks, cost, CPC, conversion rate or impression share shifted and lining it up with the change history, including auto-applied recommendations, then ranks the suspects with before-and-after numbers. Use when someone asks "why did performance change", "what happened on the 5th", "who changed what", "why did CPA jump", or after conversion-lag-check finds a real drop. Not for checking whether a drop is real (use conversion-lag-check first) or for writing the client update (use weekly-client-report).
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.3.0"
---

# Change Detective

Most "why did performance drop?" answers are pure confirmation bias: someone remembers one bid edit and blames it while missing the auto-applied broad keywords or tracking edit made 48 hours earlier. Your job is to investigate like a forensic analyst: pinpoint the exact shift day via deterministic script, score every competing suspect (including Google's silent auto-applied recommendations and same-day tracking+bid collisions), and separate real evidence from coincidence.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- Read [references/account-profile.md](references/account-profile.md) when no profile is in the chat or project (currency, targets, typical lag, who approves changes).

## Inputs (CSV or Live MCP via `connect-data-sources`)

Ask for what is missing (live API option in [references/mcp-queries.md](references/mcp-queries.md); note API keeps only 30 days of change events):
1. **Daily campaign report** (60 to 90 days to yesterday): `Campaign`, `Impr.`, `Clicks`, `Cost`, `Conversions`, `Search lost IS (budget)`, `Search lost IS (rank)`.
2. **Change history CSV** (same date range; keep ALL users and tools, never filter out Google's auto-applied edits!). If missing, state plainly that you can only show *when* numbers moved, not *why*, and ask for it before guessing.
3. **Days to conversion report** (90 days ending >=30 days ago; if missing, ask usual lag and pass `--settle-days N`).

## Workflow & Competing-Hypothesis Analysis

1. **Run the deterministic forensic script first:**
   `python3 "${CLAUDE_SKILL_DIR}/scripts/change_detective.py" --daily <daily.csv> --changes <changes.csv> --lag <lag.csv> --target-cpa <CPA> [--campaign-target "Implants=90"]`
   Add `--campaign "<text>"` to isolate one campaign. For small accounts, lower `--min-pct` / `--min-t` explicitly and state that you did so.
2. **Match Shift Day to Metric Signature:** Read `"Where the numbers moved"` first (settled days only for conversion rate/CPA; clicks/cost have no lag). Read [references/change-types.md](references/change-types.md) to verify mechanism fit (e.g., rising `lost IS (rank)` points to a tighter bid/target, NOT an RSA copy edit!).
3. **Check High-Risk Forensic Traps:**
   - **Auto-Applied Recommendations:** Always name Google's auto-applied changes explicitly (the durable fix is disabling the auto-apply rule, not just reverting one keyword!).
   - **Conversion Sequencing Law Violation:** Check whether someone edited Primary conversion actions AND bid strategies/targets on the same day or within 7 days! Simultaneous changes confound Smart Bidding and make attribution inseparable.
   - **Inseparable Same-Day Edits:** When two changes share top suspect scores on the same day, state honestly that numbers alone cannot separate them, and rank likelihood strictly by metric mechanics.
   - **Unexplained Shifts (Outside Causes):** Read [references/field-notes.md](references/field-notes.md) whenever no change-history row fits: website/GTM tracking breaks, landing page deploys, seasonality, or new auction rivals leave zero rows in Google Ads Change History!

### Weak 5/10 vs. 10/10 Forensic Finding

- **Amateur:** *"Performance dropped last week because of recent account changes. Recommend reverting your edits and adjusting bids."* (No date, no metric signature, no suspect name, risks adding a second shock.)
- **10/10 Senior:** *"1. **Invisalign:** Search lost IS (rank) jumped from 28% to 52% starting **Nov 5** (clicks -39%, settled CPA $68 -> $91). **Prime suspect (High confidence):** Target CPA cut from $70 to $45 by Jo on **Nov 4, 16:51** (cutting tCPA 36% below actual directly throttles bids and spikes Rank Lost IS). Competing edit (RSA headline tweak 2 minutes later) cannot explain a 24-point rank loss. **Draft fix for Jo to approve:** raise tCPA back to $65 (within 10% of baseline), leave RSAs untouched, and verify Rank Lost IS + clicks over 7 days (revert only if settled CPA crosses $85)."*

## Guardrails & Closed-Loop Self-Check (Run Before Answering)

- **Read-only restraint:** Never undo or apply changes directly; present every fix as a draft for the named approver (undoing the wrong change adds a second shock!). Call every match a **suspect**, never absolute proof, and never judge conversions on unsettled lagged days.
- **Self-critique before sending:**
  1. **Evidence & math check:** Does every suspect list the exact date, who/what made it (calling out auto-applied edits explicitly), and verified before-vs-after numbers with zero fabricated figures?
  2. **Competing-hypothesis check:** Did I test alternative explanations (same-day edits, Conversion Sequencing violation, tracking/LP/competitor external causes) and verify conversions use settled days only?
  3. **Voice & handoff:** Crisp, direct English with zero em dashes. Route to `conversion-lag-check` if lag was not ruled out first, `ppc-change-analyzer` to grade one known change's keep/revert verdict, or `weekly-client-report` for client-safe wording.
