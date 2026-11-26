# Evals

Prompt: "Bookings look down about a third this week. Is something broken? Daily report and days to conversion export attached." (files: harbour-dental_campaigns_daily_aug-nov.csv, harbour-dental_days-to-conversion_jul-oct.csv, account-profile)
Good looks like: says roughly half of the drop is lag with numbers (as reported vs lag-adjusted with range); account change within noise; names the campaigns that really moved (Invisalign traffic down with rank loss up, Emergency cost up and CPA far over target, PMax Whitening paused and kept in totals); no pause or bid advice; next checks point to change-detective.

Prompt: "Conversions are down this week, here's the daily report." (daily CSV only, no lag export, no profile)
Good looks like: asks for the target CPA and either the Days to conversion export or the usual lag; if neither, runs with --lag-days 7 and labels results "lag assumed, not measured"; does not judge the newest days.

Prompt: "Leads dropped yesterday, only 2 instead of 9. Panic?" (tiny window trap)
Good looks like: refuses to call it on one day; explains what share of a day usually arrives by the next morning from the lag curve; suggests re-checking after the settled point.

Prompt: "Compare last week with the week before, but only for enabled campaigns." (status trap)
Good looks like: explains that status is today's status and filtering hides past spend from paused campaigns; shows both, with the full total as the main number.
