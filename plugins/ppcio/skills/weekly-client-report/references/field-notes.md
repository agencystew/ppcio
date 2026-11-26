# Field notes: reports clients read

What PPC.io learned from years of client reports that nobody read, and the
ones that worked. The wording rules are in [plain-words.md](plain-words.md),
and `report_check.py` checks them. Read these notes before you write.

## Contents
- What the client wants to know
- Check the numbers mean what the client thinks
- After you send it

## What the client wants to know

1. **Every client question comes down to three.** Are we wasting money?
   Is it working? What do we do next? Answer them in that order and the
   report needs no call to explain it. Send 47 numbers across 12 campaigns
   and the reply is "can we get on a call?".
   Source: ppc.io/blog/build-ai-powered-ppc-client-reports

2. **Turn the work into money.** Do not write "we added 23 negative
   keywords to improve targeting". Write "you spent $143 on people looking
   for free services, and we've blocked those searches". Take the amount
   from the search-term-miner output, never from a guess.
   Source: ppc.io/blog/build-ai-powered-ppc-client-reports

3. **"What next" is one action with what it should do.** Not "we should
   reallocate budget". Name the campaign, the amount and the expected
   result, and only when the script numbers back it. Otherwise write "we're
   checking" and say when you will know.
   Source: ppc.io/blog/build-ai-powered-ppc-client-reports

4. **Report against what the business can take.** A plumber who can do
   four jobs a week does not need forty leads. If the profile has a
   capacity, say how the week compares with it.
   Source: ppc.io/blog/ppc-client-onboarding

## Check the numbers mean what the client thinks

5. **"Conversions" often include things that are not leads.** When I
   pulled the conversion settings of 50 live accounts, 16 got a quarter or
   more of their conversions from store visits, directions and page views.
   Check which actions are primary before you call them bookings.
   Source: ppc.io/blog/agency-reporting

6. **The same lead can count twice.** In those 50 accounts, 9 had the same
   lead type set up twice, once imported from GA4 and once from the Google
   Ads tag. In 3 of them both counted leads in the same 90 days. If the
   client's own count is about half of yours, look for this first.
   Source: ppc.io/blog/agency-reporting

7. **Do not compare actions measured different ways.** 42 of the 50
   accounts mixed two attribution models across their main conversion
   actions. If two actions use different models, report them separately.
   Source: ppc.io/blog/agency-reporting

## After you send it

8. **The dashboard is the evidence. The email is the story.** If a client
   never opens the dashboard, the email is the whole report, so it must
   stand on its own. Source: ppc.io/blog/agency-reporting

9. **Ask the client to confirm the numbers match theirs.** The first time,
   ask whether the bookings in the report match what the business counted.
   That one reply protects you in month three.
   Source: ppc.io/blog/ppc-client-onboarding
