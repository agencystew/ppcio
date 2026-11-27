# Client Reporting Philosophy, Taste & Anti-Patterns

Why agencies pay $500 to $2,000/month for tools like TapClicks, Swydo, or AgencyAnalytics and STILL get fired: clients never read 14-page PDF data dumps full of blended ROAS, CTR tables, and zero narrative.

This reference encodes the complete reporting philosophy built across hundreds of real agency and in-house accounts.

## 1. The 4-Beat Storyteller Structure (Never a Raw Metric Dump)

Every weekly or monthly report answers exactly four questions in order:
1. **What changed (the headline):** One clear business outcome (`enquiries`, `bookings`, `orders`, `sales`) on settled or lag-adjusted numbers, never raw platform jargon.
2. **Why it changed (the causal story):** Backed strictly by a verifiable number or change-history event. If no cause is proven, state plainly *"we are checking why"*.
3. **What we did / propose (the action):** Concrete work completed in plain English (never raw Google Ads changelog gibberish) and at most 1 to 3 proposals awaiting approval.
4. **What to expect next (checkpoint + reversal criteria):** Exact date we recheck and what triggers a rollback.

## 2. The 8 Non-Negotiable Taste & Truth Rules

1. **Brand Is Noise (Fuzzy Strip):** Brand campaigns carry artificially cheap CPAs and inflated ROAS. Strip Brand (including typos via `SequenceMatcher >= 0.85`) out of Highlights, Lowlights, and Top Converting Search Terms so acquisition truth is never masked.
2. **Judge Every Campaign Against *Its Own* 12-Week Normal:** Never label a campaign "broken" just because its CPA sits above the account average; compare each campaign to its own spend-weighted 12-week baseline. Campaigns under 3 weeks old are never called abnormal.
3. **Dual-View Separation (Report, Don't Lecture):**
   - **Client View:** Clean outcomes, calm pace-vs-return verdict, wins/watchlist without unsolicited lecturing, fake letter grades, or internal campaign clutter.
   - **Internal Call-Prep Brief (Same `facts.json`):** The 1 Ask, 3 Talking Points, Likely Client Questions with prepared answers, Non-Punitive "Since Last Week", Open Promises, and a 60-second stand-in briefing so any teammate can run the call.
4. **Account-Type Native Language:** Ecommerce speaks orders, sales, return per dollar, and top products (never "leads"). Lead gen speaks enquiries, calls, bookings, and cost per enquiry (never "ROAS").
5. **No "Wall of Red":** When multiple campaigns miss target, consolidate them into ONE prioritized summary card sorted by spend instead of ten bright-red alarm boxes. Use restrained neutral grey for normal weekly noise so minor dips do not trigger client panic.
6. **Non-Punitive Continuity ("Since Last Week"):** Never open a call brief with a punitive "Done / Missed" scorecard that ignores mid-week pivots. Show last week's plan beside this week's actual campaign spend neutrally.
7. **Safety Hold Gate:** If weekly conversions collapse below 25% of the account's 6-month median normal, automatically **HOLD** client delivery until conversion tracking and lag are verified.
8. **Zero-Drift Single Source of Truth:** Every total in the hero, KPI tiles, pacing bar, campaign table, email, and call prep MUST derive from the exact same `_week`-locked `facts.json`. Never attach last week's narrative to this week's numbers, and never print absurd tiny-base percentages like `+3,000%` (use `"up sharply"` or `"3x"`).

## 3. Stakeholder Calibration (Agency & In-House)

- **Business Owner / Local Service ("Van-Driver Lens"):** 3 numbers above the fold on a 390px phone (`Enquiries`, `Cost per enquiry`, `Spend`, each vs. `"usually about X"`), 1 row of monthly bars, 3 lines of plain-English work done.
- **VP Marketing / Head of Growth (In-House or Mid-Market):** Non-Brand vs. Brand split, 13-month scale elasticity (did return hold as spend rose?), MTD pacing vs. return verdict, top converting vs. wasted non-brand terms.
- **CFO / Finance:** Cash spent vs. cap, contribution profit / cost per customer, pacing projection, zero ad-platform acronyms.
