---
name: rsa-asset-writer
description: Writes or refreshes Google Ads responsive search ads, sitelinks and callouts from the account's own proof points, then checks every line with a script for character limits (double-width aware), pin logic, claims not backed by the facts sheet, banned words, near-duplicates and Google's punctuation rules. Use when someone asks to write RSAs, new ad copy, headlines and descriptions, refresh or audit an existing ad, fix "Ad strength", or add sitelinks or callouts. Not for search term or negative keyword work (use search-term-miner) or Performance Max asset groups.
license: Apache-2.0 portions, see NOTICE.md
metadata:
  author: PPC.io
  version: "1.2.0"
---

# RSA and asset writer

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.

AI-written ads fail in three boring ways: lines that are too long, claims
nobody can back up ("Rated 4.9 by 2,000+ patients" when it's 4.8 from
1,200), and pins that quietly shrink the ad to one combination. This skill
writes from a facts sheet only, and a script checks every character,
number and pin before anything is handed over.

## Step 0: account profile
Read [references/account-profile.md](references/account-profile.md) when
no profile is in the chat or project. Fields needed: business, services,
proof points with sources, words and claims not allowed, brand terms.
Save the proof points as `facts.md`, one per line. If there are none,
ask for them; do not invent any. Write any legal qualifier as a rule
line the script enforces, for example:
`Rule: "finance" needs "subject to status"`. Ask the user whether any
claim (finance, prices, guarantees, health claims) needs wording like
this; regulated sectors usually do.

## Inputs
- The keyword theme of the ad group and the landing page URL (read the
  page if it is reachable, to match its offer and wording).
- For a refresh: the current ad (Ads view download, or an Editor export
  with Headline 1..15, Headline N position, Description 1..4, Path 1-2).
- Optional: the asset report with performance labels, to keep proven
  lines.

## Workflow
1. Write `facts.md` and `banned.txt` from the profile.
2. Refresh only: run the lint on the current ad first and list what is
   wrong:
   `python3 "${CLAUDE_SKILL_DIR}/scripts/rsa_lint.py" <current.csv> --facts facts.md --banned banned.txt --keyword "<theme>"`
3. Read [references/field-notes.md](references/field-notes.md). Plan 15 headlines across angles, at most 3 per angle: keyword theme
   with location, offer, proof, process or speed, objection handling,
   call to action. Plan 4 descriptions: offer plus proof, objection plus
   CTA, process, location and hours. Rules and limits:
   [references/rsa-rules.md](references/rsa-rules.md).
4. Write `ad.csv` (type,text,pin). Leave pins blank unless a line must
   show in every ad (legal, finance, brand rule). If you pin, pin 2 or 3
   different options to that position.
5. Run the lint. Fix every FAIL. Fix WARNs or say why they stay. Repeat
   until 0 FAIL. A claim that needs a qualifier usually cannot fit in a
   30-character headline; move it to a description rather than cutting
   the qualifier. For sitelinks, give each one 0 or 2 description lines.
6. Run the self-check, then answer with the output template.

## Guardrails
- Every number, price, rating, year and claim comes from facts.md. Why:
  invented proof is the fastest way to a disapproval or a complaint.
- Respect banned words and legal lines exactly.
- Drafts only; a person uploads. Why: ads go live in front of customers.
- Count characters with the script, never by eye.

## Output template
**[Ad group] RSA, [date]**  Lint: 0 FAIL, [n] WARN ([why kept])

Headlines (15): `text` (chars) [pin if any]
Descriptions (4): `text` (chars)
Paths: `path1` / `path2`
What changed vs the current ad (refresh only): [lint findings fixed]
Sitelinks or callouts if asked: same format.

Good: `Invisalign From £2,950` (22) - price from facts.md.
Good: `Invisalign from £2,950. 0% finance over 12 months, subject to status. Free 3D scan.` (83)
Avoid: `Rated 4.9 by 2,000+ Patients` (numbers not in facts), or three
near-identical headlines all pinned to position 1.

## Self-check (run before answering)
- [ ] Lint shows 0 FAIL on the final file; output pasted from that file.
- [ ] 15 headlines cover at least 5 angles; no two say the same thing.
- [ ] Pins: none, or 2-3 options per pinned position, with a reason.
- [ ] Every claim traceable to a facts.md line; every rule line satisfied.
