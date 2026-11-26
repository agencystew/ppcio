# Budget pacing

## Google says
- You will never pay more than "two times your average daily budget for most
  campaigns" on any day, and "30.4 times your average daily budget" in a
  month.
- Average daily budget = monthly budget / 30.4 ("the average number of days
  in a month - 365/12").

## Pacing maths (put it in a script or explicit formula)
- Expected spend to date = monthly budget x days elapsed / days in month.
- Pace = actual spend to date / expected spend to date.
- Projected month-end = actual to date / days elapsed x days in month.
- Daily budget needed for the rest of the month =
  (monthly budget - spend to date) / days left.
- Use scripts/pacing.py so the numbers are exact.

## Rules for a pacing skill
- Use the client's budget, not Google's monthly limit. 30.4x is a ceiling,
  not a plan.
- Note that one day can spend up to 2x the daily budget, so one heavy day is
  not a pacing problem by itself.
- Draft changes; never change budgets directly.
- Practitioner default (setting): flag when pace is outside 90 to 110
  percent; confirm the band with the user.

## Source
- About average daily budgets: https://support.google.com/google-ads/answer/6385083
