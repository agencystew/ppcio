# Blueprint: RSA and asset writer

## Must learn in the interview
- Product or service, the offer, proof points (numbers, reviews, years,
  awards) that are true and allowed.
- Brand voice: words to use, words never to use, legal lines, tone.
- Pin rules (what must always show).
- Ad group themes and the keywords per ad group.
- Which assets they want: RSA, sitelinks, callouts, snippets, PMax text.
- Examples of ads they like or past winners.

## Copy into the new skill
- references: gads-rsa-assets.md, gads-pmax.md (if PMax text), a new
  brand-voice.md built from the interview.
- scripts: check_ad_lengths.py.

## Workflow to adapt
1. Read the ad group theme and keywords; if missing, ask.
2. Write angles first (3 to 5 distinct reasons to click), then headlines
   per angle, then descriptions.
3. Include keyword headlines, proof, offer, CTA and objection handling.
4. Check against brand-voice.md and the generic tells list.
5. Write the copy to a CSV (type,text) and run check_ad_lengths.py. Fix
   every LONG and DUPLICATE line and run again.
6. Pin only what the user's rules require.
7. Self-check, then output.

## Guardrails
- Use only proof points from the user or their site. Why: invented claims
  break ad policy and trust.
- Never use banned words. Why: client and legal rules.
- Never claim lengths are fine without the script output.

## Output template
Per ad group: headlines (text | chars | angle | pin), descriptions (text |
chars), paths, then assets. End with the script's summary line.

## Self-check
- check_ad_lengths.py shows 0 problems.
- 3 to 15 headlines, 2 to 4 descriptions per RSA.
- No headline could run unchanged for a competitor.
- No banned word; legal lines present where required.

## Eval ideas
- Normal ad group with keywords and USPs.
- A brief with no proof points (should ask, not invent "rated 5 stars").
- A 31-character headline request trap (should shorten, show the count).
