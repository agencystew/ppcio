# Field notes: before you call a drop real

What PPC.io learned from real accounts. Google's rules are in
[lag-facts.md](lag-facts.md). Read these notes when the lag check says the
drop is real, or when the numbers look odd in either direction.

## Contents
- Is it the tracking?
- Is it the right conversion?
- Before anyone changes anything

## Is it the tracking?

1. **Normal spend with zero conversions is a broken tag, not lag.** Lag
   makes the newest days low. It never takes a day with normal clicks to
   zero. Check, in this order: did the thank-you page URL change, did a
   new Google Tag Manager version change a trigger, does the booking step
   now cross to another domain (a booking tool, a payment page)?
   Source: PPC.io measurement playbook

2. **Tag Manager and website changes are not in the Google Ads change
   history.** A site redesign or a new GTM version can move conversions
   with no matching row in the account. Ask "did anything change on the
   website?" and check the GTM version history. Source: PPC.io measurement playbook

3. **A sudden rise is as suspect as a drop.** Over-counting is the more
   dangerous direction, because the cost per booking looks better than it
   is and Smart Bidding chases it. The usual causes: the same tag fires
   twice (a hard-coded tag and a GTM tag on one page), a lead form counts
   "Every" instead of "One", or page views and button clicks sit in the
   Conversions column. Source: PPC.io measurement playbook

4. **A stalled CRM import looks exactly like lag.** If the account imports
   offline conversions, check the date of the last good upload before you
   read the lag curve. Source: PPC.io measurement playbook

5. **Compare with what the business saw.** As a PPC.io rule of thumb,
   Google Ads within 10% of the CRM is healthy, 10% to 25% needs a look,
   and over 25% means the tracking is wrong enough to mislead decisions.
   Ask the user for the bookings the business counted for the same days.
   Source: PPC.io measurement playbook

## Is it the right conversion?

6. **Most accounts count more than one thing as a conversion.** In the 100
   accounts I read for a client onboarding guide, 76 had five or more
   primary conversion actions, including page views and button clicks.
   Only 2 had a single primary action. A "drop" can be a page view action
   that stopped firing while bookings were fine. Ask which action means
   money and run the check on that action alone.
   Source: ppc.io/blog/ppc-client-onboarding

7. **A short conversion window hides late bookings for good.** Lag means
   they arrive late. A window shorter than the sales cycle means they never
   arrive in Google Ads at all. If the lag report shows a lot of
   conversions in the last bucket before the window ends, tell the user to
   check the window. Source: PPC.io measurement playbook

## Before anyone changes anything

8. **Write the baseline first.** Note the lag-adjusted numbers in the
   answer before anyone pauses, cuts or rebuilds. A change made in a panic
   contaminates the numbers you need to judge it.
   Source: ppc.io/blog/ppc-client-onboarding

9. **Tell the client about a dip before it happens.** Making one action
   primary, or changing the target, causes a short dip while Smart Bidding
   adjusts. A dip the client was warned about is a plan. One they find
   first is a problem. Source: ppc.io/blog/ppc-client-onboarding
