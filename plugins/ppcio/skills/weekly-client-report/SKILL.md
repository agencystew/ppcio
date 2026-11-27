---
name: weekly-client-report
description: Writes the weekly Google Ads update for a client or boss in plain words, built on exact numbers - week vs week with paused campaigns kept in, conversions still to arrive estimated from the account's own lag, budget pacing, and the week's changes including auto-applied ones - so every sentence can be backed up. Use when someone asks for the weekly report, client update, Monday email, "how did last week go", or a performance summary for a non-PPC reader. Not for diagnosing a drop in depth (use conversion-lag-check and change-detective) or for search term work.
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.3.0"
---

# Weekly Client Report

Clients read the first two lines and the one business number they care about. Most AI reports bury that under PPC jargon, expose internal platform excuses ("Google's learning phase"), or panic the client over a fake "drop" that is really just bookings still arriving. Your job is to compute exact lag-adjusted numbers via deterministic scripts, form a crisp explanation backed strictly by evidence, and write a calm, trustworthy under-200-word human update.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- Read [references/account-profile.md](references/account-profile.md) when no profile is in the chat or project (currency, what the client calls a conversion like "bookings" or "leads", targets, monthly budget, brand campaigns, report reader, approver).

## Inputs (CSV or Live MCP via `connect-data-sources`)

1. **Daily campaign report** (Campaigns segmented by Day, 6 weeks before report week through yesterday): `Campaign`, `Campaign state`, `Clicks`, `Impr.`, `Cost`, `Conversions`, `Conv. value`.
2. **Days to conversion report** (Segment > Conversions > Days to conversion, 90 days ending >=30 days ago). Optional, prevents false drops; if missing, write `"bookings/leads from the last few days are still coming in"` and never call a drop.
3. **Change history CSV** (last 2 weeks, optional).

## Workflow & Agency-Safe Writing Rules

1. **Run the deterministic numbers script first:**
   `python3 "${CLAUDE_SKILL_DIR}/scripts/weekly_numbers.py" --daily <daily.csv> --lag <lag.csv> --changes <changes.csv> --budget <monthly> --brand "<brand pattern>" --target-cpa <CPA> [--campaign-target "Implants=90"]`
2. **Lead with the One Business Number (Final Estimate vs. Final Estimate):** Always compare lag-adjusted final estimate vs. prior week's final estimate (never raw lagged counts). If Brand and Non-Brand moved in opposite directions, say so plainly in line 1: *"people searching for your name"* vs. *"new customers finding you"*.
3. **Pick at Most 3 Evidence-Backed Drivers:** Only cite a cause backed by a number or change row; otherwise say plainly *"we're checking why"*. Never fabricate explanations or numbers.
4. **Apply the Van-Driver Client Lens & Agency-Safe Comms:**
   - Read [references/plain-words.md](references/plain-words.md) and [references/field-notes.md](references/field-notes.md) before drafting.
   - **Never include in a client email:** raw jargon (`CPA`, `IS lost to rank`, `CTR`, `Quality Score`), excuses about *"Google's learning phase"*, internal blame (name who made an edit only in internal notes, never to the client), or asking the client questions about *our own* Google Ads settings!
   - Keep paused campaigns in historical totals (mention if they spent during the window), frame Google auto-applied edits calmly without drama, and phrase recommendations as clear proposals awaiting their approval (with next-week check-in / rollback discipline).
5. **Run Deterministic Verification Loop (`report_check.py`):** Save step 1 output to `numbers.txt`, write the draft to `draft.md`, and run:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/report_check.py" draft.md --numbers numbers.txt --term <what the client calls a conversion>`
   Fix every `FAIL` and re-run until clean! Why: one stray invented number or untranslated acronym breaks client trust immediately.

### Weak 5/10 vs. 10/10 Client Update

- **Amateur:** *"Conversions dropped 13% WoW while Impression Share lost to rank spiked due to Smart Bidding re-entering the learning phase after Jo adjusted tCPA. Let us know if your conversion tag is working."* (Jargon, reports fake lag drop, exposes learning phase, blames teammate, asks client about our tracking.)
- **10/10 Senior:** *"Subject: Harbour Dental week of 4 Nov: bookings steady overall, new patients dipped. Total bookings held around 130 once late ones are counted (103 logged so far), led by people searching for Harbour by name. Bookings from new patients fell from about 67 to 54 ($78 each vs. $70 goal). What happened: Invisalign ads showed less often after a mid-week bid tightening; spend is $3,420 of $14,000 (on track for $13,800). What we're doing: proposing a small bid lift on Invisalign to recover new-patient volume and rechecking Monday. What we need from you: a quick yes to lift Invisalign bids."*

## Guardrails & Self-Check (Closed-Loop Self-Critique Before Answering)

Before sending the final email (keep client version cleanly under 200 words, zero em dashes), challenge your own draft like a skeptical client:
1. **Deterministic proof check:** Did `report_check.py` pass with zero failures? Does every single figure trace verbatim to `numbers.txt` with zero invented numbers, and are Brand vs. Non-Brand + paused campaigns handled honestly?
2. **Client-safety & restraint check:** Zero untranslated PPC jargon, zero "learning phase" excuses, zero teammate blame, and zero panic over unsettled days (if a drop looks real, flag `conversion-lag-check` / `change-detective` internally first)?
3. **Structure check:** Covers Subject (6 to 10 words), 2-to-3-sentence executive summary, `What happened` (max 3 bullets including pacing), `What we're doing`, and `What we need from you` (or *"nothing this week"*).
