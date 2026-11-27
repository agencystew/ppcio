---
name: ads-not-showing
description: "Fast 5-minute causal diagnostic to find why Google Ads are not showing or getting zero impressions (billing, policy disapprovals, targeting, schedule, budget, bid/Ad Rank, negative conflicts) and deliver the exact fix. Use when ads stopped serving or have zero impressions. Not for investigating a CPA/ROAS drop on active campaigns (use change-detective)."
---

# Ads Not Showing Causal Troubleshooter

When ads stop serving or stay stuck at zero impressions, guessing randomly wastes hours. Your job is to act like a sharp Google Ads engineer: form a probability-ranked hypothesis, isolate the exact blocking constraint in minutes, give the exact fix, and verify delivery without distorting account metrics.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for business, location, and services.
- Never tell the user to search for their own ads on Google! Why: repeated unclicked searches artificially drop CTR and train Google to stop showing their ad to them. Always verify using **Tools > Ad Preview and Diagnosis**.
- **Zero fabrication:** Never invent policy violations, bid floors, or CPC estimates; label any unconfirmed item explicitly as a check to run in the account.
- If the user has not shared screenshots, status messages, or campaign settings yet, ask only for the failing campaign's **Status**, **Bid strategy + target**, **Daily budget**, and whether **Ad Preview and Diagnosis** shows a red error message. Offer `connect-data-sources` if they want read-only Google Ads API / MCP diagnostics.

## Probability-Ordered Causal Tree (Test Fast, Stop at the Blocker)

Walk from hard binary blocks to auction-level bottlenecks so you do not waste time tuning bids on a suspended account:

1. **Account & Policy Hard Blocks (Check first - ~40% of zero-impression cases):**
   - Billing failure, declined card, spending limit reached, or account/advertiser verification pause.
   - Ads, keywords, or final URLs marked `Disapproved`, `Limited by policy` (especially healthcare, finance, legal, housing), or `Destination not working` (404/SSL redirect).
   - Campaign, Ad Group, or Ad paused, ended (`End date` passed), or outside its **Ad Schedule**.
2. **Targeting & Silent Conflict Traps:**
   - **Negative keyword conflict:** A broad-match negative (or shared negative list) silently blocking core exact/phrase keywords (`negative-keyword-analyzer`).
   - **Audience set to "Targeting" instead of "Observation":** Restricting a Search campaign to a tiny remarketing list kills 95%+ of impressions immediately.
   - **Location / Radius / IP over-restriction:** Tiny radius with low search volume, conflicting location exclusions, or Presence-only targeting mismatched to where the user is testing.
   - **Keyword status:** `Low search volume` (too narrow/long-tail) or `Rarely shown (low Quality Score)` (`quality-score-repair`).
3. **Auction, Budget & Smart Bidding Starvation:**
   - **Impossible tCPA / tROAS target:** Setting a $15 tCPA in a $55 CPA market (or a 900% tROAS on cold traffic) makes Smart Bidding stop bidding completely. Fix: loosen target to within 15% to 20% of trailing 30-day actual CPA/ROAS (or temporarily remove target cap).
   - **Manual bid below First Page Bid Estimate** or **Daily budget smaller than 1x to 2x average CPC** (Google cannot enter auctions cleanly; note `Budget exhausted early` by noon in Home Services/Legal!).
   - **Recent edit / Learning delay:** New campaigns or policy-sensitive edits often take 24 to 48 hours to clear review; wait before making panic edits (`ppc-change-analyzer`).

### Weak 5/10 vs. 10/10 Zero-Impression Diagnosis

- **Amateur:** *"Check your billing, keywords, targeting, bids, and budget. Also try searching your keyword in incognito mode to see if your ad appears."* (Dumps 20 checks with no priority order and gives bad verification advice.)
- **10/10 Senior:** *"Your campaign is Enabled and Eligible, but impressions dropped to zero 48 hours after switching to Target CPA at $25 when your trailing 30-day actual CPA was $68. That target is 63% below market, so Smart Bidding stopped entering auctions. Fix: raise tCPA to $65 (or switch to Maximize Clicks with a $6.50 Max CPC cap if monthly conversions are under 15, see `bidding-strategy-decision-tree`). Verify inside Tools > Ad Preview and Diagnosis after 4 hours, and check impressions after 48 hours before touching anything else."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your diagnosis:
1. **Evidence & zero-fabrication check:** Did I clearly separate confirmed facts from hypotheses when the user has not shared a screenshot or export yet? Never guess a policy violation or CPC figure without stating it as a check to run.
2. **Restraint & sequencing check:** Did I isolate the **primary blocking cause** first (rather than recommending 8 simultaneous edits that break attribution and reset learning), include exact verification via Ad Preview and Diagnosis, and give a realistic wait window (instant vs. 24-48h review vs. 3-5 day bid ramp)?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or robotic workshop filler. Hand off cleanly to `bidding-strategy-decision-tree` (bid starvation), `negative-keyword-analyzer` (negative conflict), or `change-detective` (if ads are serving fine but conversions dropped).
