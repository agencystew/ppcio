# Field notes: reading the change history

What PPC.io learned from reading change histories on real accounts. The
general patterns are in [change-types.md](change-types.md). Read these
notes when you rank suspects.

## Contents
- Google's own changes
- What the history does not show
- Reading the rows

## Google's own changes

1. **Check the auto-apply settings, not only the rows.** Google can apply
   its own recommendations automatically. In the 100 accounts I read for a
   client onboarding guide, 32 had at least one auto-apply subscription
   switched on. If the history shows auto-applied rows, list which
   subscriptions are on and suggest the user turns them off and applies
   the useful ones by hand. Source: ppc.io/blog/ppc-client-onboarding

2. **Google can remove your negatives.** "Remove conflicting negative
   keywords" is one of the auto-applied recommendations. If a search the
   user blocked is back in the search terms, look for that row.
   Source: PPC.io negative keywords playbook

3. **Performance Max can send traffic to pages nobody chose.** With final
   URL expansion on, PMax picks any page on the site it thinks fits,
   including the blog and the careers page. Half of the 84 PMax campaigns
   I pulled for an audit guide had served at least one expanded URL. If
   PMax conversions fell with no row in the history, ask for the landing
   page report. Source: ppc.io/blog/performance-max-audit

## What the history does not show

4. **Website and Tag Manager changes are not in it.** A new thank-you page,
   a site redesign or a new GTM version can move conversions with no row
   at all. When the numbers moved on a day with no change, ask what
   changed on the website that day. Source: PPC.io measurement playbook

5. **No changes is a finding too.** In that PMax pull, 41 of 84 campaigns
   had zero edits in 28 days. A campaign nobody touched is still running
   on what it learned in its first weeks. Say so, and do not invent a
   cause. Source: ppc.io/blog/performance-max-audit

## Reading the rows

6. **A wall of automated rows hides the human edit.** Group the history by
   who made the change and by hour. Regular small human edits mean someone
   manages the account. Nothing but automated rows means nobody has been
   in it for a while. Source: ppc.io/blog/ppc-client-onboarding

7. **Weekly budget and target edits are a cause on their own.** Each one
   can restart learning, so a campaign edited every week never settles.
   If you see that pattern, suggest batching changes once a month.
   Source: ppc.io/blog/performance-max-audit

8. **A conversion action change outranks most other suspects.** Smart
   Bidding optimises to the primary actions. If one was added, removed or
   changed from primary to secondary, expect the numbers to move, and say
   which way. The median account in the PMax pull had 9 primary actions,
   so the campaign optimises to whichever is easiest to get.
   Source: ppc.io/blog/performance-max-audit

9. **A rebuild is the biggest change there is.** When a new agency rebuilds
   campaigns in its first weeks, bid strategies reset and the first month
   often looks worse than the old agency's last. If the history shows new
   campaigns replacing old ones, give that as the context before any
   smaller suspect. Source: ppc.io/blog/ppc-client-onboarding

10. **Location settings leak budget quietly.** "Presence or interest", the
    default, shows ads to people outside the area who searched for it. 40%
    of the PMax campaigns in the pull were on it. A change to or from this
    setting moves cost per lead with no change in the keywords.
    Source: ppc.io/blog/performance-max-audit
