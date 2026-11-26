# Negative keyword rules (Google)

Checked 17 Nov 2026 against https://support.google.com/google-ads/answer/2453972
and https://support.google.com/google-ads/answer/7478529.

- Negatives do not match close variants. Google: "Negative keywords won't
  match to close variants or other expansions. For example, if you exclude
  the negative broad match keyword 'flowers', ads won't be eligible to
  serve when a user searches 'red flowers', but can serve if a user
  searches for 'red flower'." So "course" does not block "courses". Add
  both forms when both appear (the simulator reports each miss).
- Long searches: "Your ad might still show when someone searches for a
  phrase that's longer than 16 words, and your negative keyword follows
  that 16th word."
- Broad negative: blocks searches containing all the words, in any order.
- Phrase negative `"..."`: "your ad won't show if the search contains the
  exact keyword terms in the same order". Extra words around it are fine.
- Exact negative `[...]`: "your ad won't show if the search contains the
  exact keyword terms, in the same order, without extra words."
- Syntax when typing keywords: phrase "in quotes", exact [in brackets]
  (answer 7478529).
- Symbols: only "&", accent marks and "*" are recognised. Accented words
  count as different negatives. Some symbols are invalid and cause an
  error: , ! @ % ^ () = {} ; ~ ` < > ? \ | (answer 2453972).

## Level (PPC.io practice, not Google rules)
- Wrong for the whole business (jobs, courses, a service you never sell):
  shared negative list on all non-brand campaigns.
- Wrong location or wrong service for one campaign only (a town another
  campaign targets): that campaign only. Never put a target town of any
  campaign on a shared list.
- Prefer phrase match for themes; exact for one-off queries.
