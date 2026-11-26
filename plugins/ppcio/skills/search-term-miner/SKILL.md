---
name: search-term-miner
description: Mines a Google Ads search terms report for wasted spend using n-grams judged against the account's own target CPA (not fixed money cut-offs), protects brand, service, competitor and location words, and drafts negative keywords with match type and level for a human to approve. Use when someone asks for a search terms review, negative keywords, wasted spend, "what should I exclude", the weekly search terms check, or attaches a search terms report. Not for writing ads (use rsa-asset-writer) or explaining a performance change (use change-detective).
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.2.0"
---

# Search term miner

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

A bad negative keyword is worse than wasted spend: it blocks good
searches silently and nobody notices for weeks. So this skill is strict
about two things. Waste is measured against your own target CPA, not a
generic "$10 with no conversions" rule. And brand, service, competitor and
location words you care about can never end up in a negative.

## Step 0: account profile
Read [references/account-profile.md](references/account-profile.md) when
no profile is in the chat or project. Fields needed: currency, targets
(per campaign if they differ), brand terms, competitor names you bid on,
services you sell and do not sell, target locations per campaign, never
negate list, who approves. Ask for missing targets and locations before
running; every flag depends on them.

## Inputs
Search terms report: Insights and reports > Search terms (or Keywords >
Search terms). Date range: 30 to 90 days, ending a few days ago so recent
conversions have arrived. Columns: Search term, Match type, Campaign, Ad
group, Impr., Clicks, Cost, Conversions, Conv. value. Download as CSV.

Keywords report (strongly advised): Keywords > Search keywords, all
campaigns, with Keyword, Match type, Campaign and Status. The simulator
uses it to catch a negative that blocks one of the account's own keywords.

If something is missing:
- No target CPA: ask. Never guess it.
- Under 30 days of data: say so and only flag terms at 2x target or more.
- Conversions column missing: stop; waste cannot be judged without it.

## Workflow
1. From the profile, write three small files:
   - `protect.txt`: brand terms and misspellings, competitor names you bid
     on, never-negate words. A negative containing one is never proposed.
   - `services.txt`: what you sell. Never negated on its own; negate the
     modifier instead ("course", not "implant").
   - `locations.txt`: one line per campaign, `campaign text: town, town`.
2. Find candidates:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/st_miner.py" <csv> --target-cpa <CPA> [--campaign-target "Implants=90"] --protect protect.txt --services services.txt --locations locations.txt --exclude-campaign "<brand pattern>" --low-spend <half the target>`
   For ecommerce use `--target-roas 4` instead; it works out the implied
   target CPA and lists converting n-grams under half the target ROAS.
   Each theme is listed once with its queries; fragments covered by a
   bigger theme are folded in.
3. Read [references/field-notes.md](references/field-notes.md), then
   read every candidate's queries. Keep it only if it is wrong for this
   business in every query. Wrong-location searches (a town another
   campaign targets) go to that campaign only. Read the "converting words
   that look like waste" block out loud in the answer: those words stay.
4. Write `negatives.txt` in the syntax you would type in Google Ads
   (`word` broad, `"phrase"`, `[exact]`), with `campaign=<text> |` or
   `list=<name> |` in front. Choose match type and level with
   [references/negatives-rules.md](references/negatives-rules.md).
5. Prove it:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/simulate_negatives.py" <csv> negatives.txt --protect protect.txt --exclude-campaign "<brand pattern>" --keywords <keywords.csv>`
   Ask for the keywords export (Keywords > Search keywords > download)
   if the user has not given it. With it, a negative that blocks one of
   their own enabled keywords is a STOP. Without it, say this was not
   checked.
   It applies Google's matching rules and reports, per negative, exactly
   which searches it blocks. Fix every STOP (blocks conversions or
   contains a protected term) and every NOT BLOCKED variant you want
   gone, then run it again until "Checks: PASS". Why: Google negatives do
   not match plurals, so "course" leaves "courses" running; and a broad
   negative can block converting searches you never looked at.
6. Run the self-check, then answer with the output template, using the
   simulator's TOTAL line for waste.

## Guardrails
- Draft only; a named person adds negatives. Why: a wrong negative costs
  invisible lost leads.
- Never hand over a negative list the simulator has not passed. Why: in
  testing, negating "dental" would have blocked 44 conversions and
  "emergency" 100; nobody spots that by reading n-grams.
- Never propose a negative that contains a protected word or would block
  a query with conversions.
- Zero-conversion searches under the target line go on the watch list,
  not the negative list, unless they are plainly unrelated (a vet, a job);
  those are marked low confidence.
- No negatives in brand campaigns without asking. Why: misspelled brand
  searches look wasteful but protect brand traffic.
- Label anything under the low-spend line as low confidence.

## Output template
**Search terms review: [account], [date range]**
Analysed: [currency][cost], [clicks] clicks, [conv] conversions (brand excluded).
Waste these negatives block: [currency][simulator TOTAL] ([x]% of analysed spend), 0 conversions.

Negatives to approve:
- `[negative in match syntax]` | [level] | [cost, clicks, conversions, x target] | [example queries] | [confidence]

Kept on purpose (they convert): [words and their conversions].
Watch list: [searches under the target line].
Needs a human call: [item | why]
Paste-ready lists: [simulator output, grouped by list and campaign].

Good row: `"turkey"` | Implants campaign | £437.05, 102 clicks, 0 conv, 4.9x target |
dental implants turkey; ... | High
Avoid: `implants` as a negative (the service), or a row without numbers.

## Self-check (run before answering)
- [ ] Totals match the export minus brand.
- [ ] Simulator says "Checks: PASS"; waste taken from its TOTAL (each query once).
- [ ] Plural/variant misses handled (added or explained).
- [ ] No negative contains a protected word or blocks a converting query.
- [ ] No negative blocks an enabled keyword, or the answer says the keywords export was not given.
- [ ] Every row has numbers and a confidence label.
- [ ] Date range stated; lag respected (export ends a few days ago).
