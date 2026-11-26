# Account profile

Every flagship skill reads this first. Skills are only as good as what
they know about your account: the same search term can be waste for one
client and a best seller for another. Fill it once per account, keep it in
the client project folder (or Claude Project) for that client (or attach it), and update it when
targets change.

## How a skill uses it
1. Look for a file named `account-profile*.md` in the chat, the Project
   knowledge, or pasted text that starts with "Account profile".
2. If there is none, ask only for the fields marked with the skill's name
   below, one question at a time, then offer the filled profile back so
   the user can save it.
3. Never fill a field with a guess. Write "unknown" and say what that
   changes in the answer.

## Template (copy, fill, save)

```
Account profile: [account or client name]
Currency: [GBP / USD / EUR ...]            (all skills)
Business: [one line: what they sell, to whom, where]   (all skills)
Counted conversion: [name of the primary action(s), e.g. "Booking form"; column used: Conversions]   (all skills)
Targets:                                     (all skills)
  - Account: [target CPA or target ROAS]
  - [campaign or service]: [target]
Monthly budget: [amount, and whether Google Ads only]   (weekly-client-report)
Typical conversion lag: [e.g. "most within 3 days, some up to 30" or "unknown"]   (conversion-lag-check, change-detective, weekly-client-report)
Brand terms and misspellings: [list]          (search-term-miner, rsa-asset-writer)
Competitor names we bid on on purpose: [list or none]   (search-term-miner)
Services and products we sell: [list]        (search-term-miner, rsa-asset-writer)
Services we do NOT offer: [list]             (search-term-miner)
Target locations per campaign: [campaign: towns or radius]   (search-term-miner)
Never negate: [words or phrases]             (search-term-miner)
Proof points we can use in ads: [facts with source, e.g. "4.8 stars from 1,200 Google reviews (Google Business Profile, Nov 2026)"]   (rsa-asset-writer)
Words or claims we must not use: [list, plus any legal lines]   (rsa-asset-writer)
Who approves changes: [name]                 (all skills)
Client report style: [e.g. "Slack, short, no jargon, Monday 9am"; who reads it]   (weekly-client-report)
```

## Example (fictional)

```
Account profile: Harbour Dental Group
Currency: GBP
Business: private dental clinics in Leeds and York; implants, Invisalign, emergency appointments, whitening
Counted conversion: "Online booking" + "Calls from ads 60s+"; column used: Conversions
Targets:
  - Account: target CPA £60
  - Implants: target CPA £90
Monthly budget: £16,000 Google Ads
Typical conversion lag: unknown
Brand terms and misspellings: harbour dental, harbor dental, harbour dentist, hdg dental
Competitor names we bid on on purpose: none
Services and products we sell: dental implants, invisalign, clear aligners, emergency dentist, teeth whitening, check ups, hygienist
Services we do NOT offer: nhs treatment, orthodontics for under 12s, dentures
Target locations per campaign: Leeds campaigns: leeds, headingley, horsforth, roundhay, chapel allerton; York campaign: york, acomb, haxby
Never negate: emergency, same day, near me, open now, saturday, finance
Proof points we can use in ads: free consultation with 3D scan; 0% finance over 12 months (subject to status); Invisalign from £2,950; 4.8 stars from 1,200+ Google reviews; open Saturdays; Leeds city centre LS1; GDC-registered dentists; established 2011
Words or claims we must not use: cheap, pain-free, guaranteed, best, award-winning
Who approves changes: Jo (agency), Sam (practice manager) for budgets
Client report style: email to Sam, Monday 10am, short, no jargon
```
