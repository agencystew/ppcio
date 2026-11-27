---
name: conversion-lag-check
description: Checks whether a recent Google Ads conversion drop is real or just conversions that have not arrived yet, using the account's own Days to conversion history, then finds which campaigns and which lever (traffic or conversion rate) moved. Use when someone says leads, sales or conversions are down this week, asks "is this a real drop", "why are conversions low", "did something break", or before judging the last few days of performance. Not for finding which change caused a drop (use change-detective) or writing a client update (use weekly-client-report).
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.3.0"
---

# Conversion Lag Check

Google dates a conversion by the **day of the click**, not the day the lead or sale actually happened. So the newest 2 to 5 days always look artificially worse than they will end up. People pause profitable campaigns, slash bids, and send panicked client emails over conversions that simply have not arrived yet. Your job is to form a disciplined hypothesis before anyone touches a setting: measure this account's real arrival lag first, test whether a quiet stretch is normal variance or tracking breakage, and only then pinpoint which campaign and lever actually moved.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- Read [references/account-profile.md](references/account-profile.md) when no profile is in the chat or project (currency, counted conversion, account/campaign targets). Ask for a missing target once; without it you can still diagnose volume shifts, not target health.

## Inputs (CSV or Live MCP)

Ask for these two exports if not attached (or see [references/mcp-queries.md](references/mcp-queries.md) / `connect-data-sources` for live Google Ads MCP data):
1. **Daily campaign report:** Campaigns > Segment > Time > Day (last 60 to 90 days up to yesterday). Columns: `Campaign`, `Campaign state`, `Impr.`, `Clicks`, `Cost`, `Conversions`, `Conv. value`, `Search impr. share`, `Search lost IS (budget)`, `Search lost IS (rank)`.
2. **Days to conversion report:** Campaigns > Segment > Conversions > Days to conversion (90 days ending at least 30 days ago so conversion history is complete; `--` in Clicks/Cost is normal).

Missing-data guardrails (zero fabrication):
- No lag report: ask typical days-to-convert and pass `--lag-days N` (if unknown, use `7` and label every conclusion **"lag assumed, not measured"**).
- Under 35 days of daily data: state baseline is too short; report as-reported figures with a lag warning only.
- Under 20 conversions in the recent window: state sample is too small for a verdict and give numbers only.

## Workflow & Causal Reasoning

1. **Run the deterministic script first** (handles header rows, Total rows, currency symbols, `< 10%` values, and paused campaigns):
   `python3 "${CLAUDE_SKILL_DIR}/scripts/lag_check.py" --daily <daily.csv> --lag <lag.csv> --target-cpa <CPA> --brand "<brand campaign pattern>" [--campaign-target "Implants=90"]`
   Always pass `--brand` when brand campaigns exist. Why: cheap brand conversions regularly mask serious non-brand drops (e.g., turning a $74 non-brand CPA into a $29 blended average).
2. **Compare As-Reported vs. Lag-Adjusted (Range, Never Just a Point Estimate):** Read the account block and Non-Brand CPA line first. See [references/lag-facts.md](references/lag-facts.md) if the user questions the timing math.
3. **Check the Settled Week + Poisson Quiet-Day Sanity Test:**
   - Read the settled line (newest week >=90% complete). If the settled week is flat and only the last 2 to 4 days dipped, it is lag, not a crisis.
   - **Conversion Time vs. Click Time + Poisson Check:** On low-volume accounts (<1 to 2 leads/day), before claiming "tracking broke", check the last lead by **conversion time** (not click time) and sanity-check quiet-day probability (`P(0 leads in d days) = e^(-lambda * d)` via `python3`, e.g., at 0.7 leads/day, 2 zero-lead days happen ~25% of the time by pure chance!).
4. **Diagnose Only Real Movers:** Follow [references/diagnosis-tree.md](references/diagnosis-tree.md) for campaigns flagged `CONVERSIONS LIKELY REAL`, `TRAFFIC DOWN/UP`, `CPA OVER TARGET`, or `NO SPEND`. If a drop looks real or a high-click day shows zero conversions, read [references/field-notes.md](references/field-notes.md) before naming a cause (a broken tag or stopped micro-action looks like a real drop, and editing bids makes it worse).

### Weak 5/10 vs. 10/10 Lag Verdict

- **Amateur:** *"Conversions are down 32% this week across the account. Consider pausing Implants and cutting bids on Non-Brand immediately."* (Judges unsettled lagged days, blends Brand, panics without checking traffic vs. CVR.)
- **10/10 Senior:** *"Verdict: Mostly lag. As-reported Non-Brand conversions are down 32% (21 vs. 31), but lag-adjusted final volume is 26.4 (90% range 23 to 30, -15%, WITHIN NORMAL NOISE), and the settled week (Oct 21 to 27) was flat at -3%. One real mover to watch: Invisalign clicks fell 39% from Nov 5 while Search lost IS (rank) rose from 32% to 52%. Next checks (do NOT touch bids yet): (1) run `change-detective` for Nov 4 to 5 bid/ad edits; (2) check Auction Insights for a new competitor; (3) re-run lag check in 4 days once Nov 5 to 8 settles."*

## Guardrails & Closed-Loop Self-Check (Run Before Answering)

- **Read-only restraint:** Never pause or edit bids/budgets; never call a drop real on the newest 1 to 3 days alone; keep paused/removed campaigns in every historical total (dropping them understates past spend/conversions); always name the exact conversion column (`Conversions` vs. `All conv.`).
- **Self-critique before sending:**
  1. **Math & totals check:** Does the script's totals check report OK (or is any mismatch explained)? Did I report the 90% lag-adjusted range (never a false-precision single number) and state whether lag was measured or assumed?
  2. **Competing-hypothesis check:** Did I rule out Brand distortion, small-sample Poisson noise, and tag breakage (`conversion-tracking-planner`) before blaming campaign performance?
  3. **Voice & handoff:** Deliver the verdict cleanly in plain human English (no em dashes, no panic) with max 3 next checks and clear routing to `change-detective` (if real drop) or `weekly-client-report` (for client comms).
