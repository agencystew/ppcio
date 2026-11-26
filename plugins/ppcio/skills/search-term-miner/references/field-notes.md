# Field notes: search terms and negatives

What PPC.io learned from auditing real accounts. Google's rules are in
[negatives-rules.md](negatives-rules.md). These notes are judgement: read
them before step 3, when you decide which candidates to keep.

## Contents
- Before you add a negative
- Patterns worth a negative on day one
- When the search term is not the problem
- Keeping it clean

## Before you add a negative

1. **A negative can block your own keyword, and Google still shows that
   keyword as "Active".** It gets no impressions and nobody notices. Run
   `simulate_negatives.py` with `--keywords`. The four usual causes:
   - a shared list applied to a campaign it was not built for (broad
     `free` on a list, then a free trial campaign launches);
   - an industry template pasted in (broad `software` in a software account);
   - old campaign negatives left behind after a rebuild or a new agency;
   - two people working apart (one adds `training` as a negative, six
     weeks later the other adds the keyword `sales training`).
   Source: ppc.io/blog/negative-keyword-conflicts

2. **Check the riskiest negatives first:** one-word broad negatives,
   shared lists applied at campaign level, and anything added in the last
   90 days. Source: ppc.io/blog/negative-keyword-conflicts

3. **A term that converts above target is not a negative.** At 2x target
   it is a bid, ad or landing page problem. Put it in the "Watch" list with
   its numbers. Blocking it removes the bookings as well as the cost.
   Source: PPC.io negative keywords playbook

4. **One phrase negative beats ten exact ones.** "dental implant cost" and
   "cost of dental implants" are one pattern: the `cost` modifier. Decide
   whether price shoppers are wanted, then block the pattern or neither.
   Source: PPC.io negative keywords playbook

5. **Some words depend on the offer, so ask before you block them.**
   "free consultation" and "no win no fee" are waste for a firm that
   charges for the first meeting. For a firm that offers one, they are the
   searches it pays most to reach. The same goes for "cheap", "free" and
   "finance". Source: ppc.io/blog/negative-keywords-examples

## Patterns worth a negative on day one

6. **Jobs, training, DIY and "how to" searches are knowable before the
   first click.** Waiting for them to show in the report means paying for
   them first. Suggest a starter shared list for a new campaign.
   Source: PPC.io negative keywords playbook

7. **Deal hunters look like buyers and are not.** One ecommerce account I
   audited spent $4,200 a month on searches like "free shipping" and
   "coupon code". Flag coupon, voucher and discount code searches for
   ecommerce, and add the same negatives to Shopping campaigns.
   Source: ppc.io/blog/find-wasted-spend-google-ads-ai

## When the search term is not the problem

8. **Wrong-town searches often come from a location setting.** When we
   read 100 accounts in August 2026, 57 of 205 Search campaigns still
   targeted people "in or interested in" a location. That shows ads to
   people outside the area. If many wasted terms name other towns, tell
   the user to check the setting. Negatives only patch it.
   Source: ppc.io/blog/find-wasted-spend-google-ads-ai

9. **Search partners can hold the waste.** In the same 100 accounts, 38 of
   205 Search campaigns had search partners on. If the waste is spread
   across good-looking terms, ask for the campaign report split by network
   before you blame the words. Source: ppc.io/blog/find-wasted-spend-google-ads-ai

10. **Zero bookings on the core service is a page or tracking problem.**
    If "emergency dentist york" spends and never books, do not block it.
    Check that the conversion tag fires and the page answers the search.
    Source: PPC.io negative keywords playbook

## Keeping it clean

11. **The usual mistake is to add negatives once and stop.** Broad match
    keeps reaching further. Check search terms weekly in a new campaign's
    first month, then every two weeks. Run a fresh check within 2 weeks of
    any big change: new campaigns, a match type change, or a PMax launch.
    Source: ppc.io/blog/negative-keywords-examples and the PPC.io playbook

12. **Google can remove your negatives for you.** One auto-applied
    recommendation is "Remove conflicting negative keywords". If a negative
    you added is gone, check the change history for an auto-applied entry
    (the change-detective skill reads it). Source: PPC.io negative keywords playbook
