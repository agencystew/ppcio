---
name: ppc-account-health-check
description: "Fast 5-minute Google Ads triage on a 30-day campaign export: checks tracking and Brand distortion first, spots the 3 biggest money leaks, protects what is working, and hands over a clear priority order. Use when someone wants a quick account checkup or pastes a campaign table. Not for deep multi-tab 90-day audits (use ppc-strategic-audit) or weekly WoW manager diffs (use weekly-pulse)."
---

# PPC Account Health Check (5-Minute Causal Triage)

Give a busy business owner or account manager an honest, sharp 5-minute diagnosis from a single 30-day campaign export. Form a real hypothesis about the single biggest constraint holding the account back instead of hiding behind vague letter grades or robotic labels; show where money is leaking right now, what is actually working, and the exact 3 moves to make first.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for business model, location, and target CPA/ROAS.
- Ask in one line if they have not shared data yet: *"In Google Ads, open Campaigns (last 30 days), include Budget, Bid strategy type, Cost, Clicks, Conversions, Conv. value, and Cost / conv., Download .csv and drop it here. Or tell me if you want help connecting Google Ads, GA4, or Clarity read-only via `connect-data-sources`."*

## The 5-Minute Triage Order (Fundamentals Before Tweaks)

Run quick `python3` math on CSV exports whenever possible so every sum, share of spend, and CPA/ROAS delta is exact. Zero fabrication: never invent missing metrics, benchmarks, or conversion rates; state clearly what the export cannot prove.

1. **Sanity-check the numbers first (Why: bad data invalidates every downstream recommendation):**
   - Are conversion counts suspiciously high (e.g., 25%+ CVR on cold search -> likely counting page views, button clicks, or 5-second calls)? If tracking looks inflated, call that out as Priority #1 before suggesting bid or keyword cuts.
   - Strip **Brand vs. Non-Brand** (and flag PMax with >500% ROAS or >40% brand share) so cheap brand conversions never mask a broken acquisition engine.
   - Check `days_with_spend` (never divide partial-month spend by 30) and conversion lag (if the last 3 to 5 days look weak, flag `conversion-lag-check` before panicking).
2. **Separate real waste from small-sample noise:**
   - Apply the noise floor: `expected_leads = clicks * account_cvr < 2` (or under 20 clicks) is noise, not proof. Flag `few_data` honestly if the whole account has <10 conversions in 30 days.
   - Rank leaks by **actual wasted dollars**, not scary percentages on $40 of spend.
3. **Spot the 4 highest-impact account leaks:**
   - Campaigns spending >1x target CPA with 0 conversions (or >1.5x target CPA across 10+ conversions).
   - Over-fragmentation (budget sliced across too many campaigns so none get enough conversion density for Smart Bidding).
   - Low-volume uncapped Max Conversions CPC spikes (<15 leads/30d buying <3 clicks/day).
   - High CTR + weak CVR pointing to a post-click landing page or offer leak (`landing-page` or `lp-message-match`).
4. **Name what is healthy (Restraint):** Explicitly list the winning campaigns hitting target CPA/ROAS and protect them from unnecessary edits. Why: touching healthy campaigns resets learning and breaks what already pays the bills.
5. **Domain discipline:** Never suggest raising budget as Move #1 while clear waste exists, never suggest pausing a core service they sell, and never confuse ecommerce vocabulary (orders/revenue/ROAS) with lead-gen vocabulary (leads/calls/CPL).

### Weak 5/10 vs. 10/10 Quick Triage

- **Amateur:** *"Overall Grade: C+. Critical Alert: Financial bleeding in Campaign B (CPA +45%) and Growth Constraint in Campaign A. Recommend optimizing keywords and monitoring closely."* (Robotic labels, no dollar sizing, ignores Brand padding, vague advice.)
- **10/10 Senior:** *"Your 30-day blended CPL looks fine at $52 only because Brand ($910 spend, 48 leads, $19 CPL) masks Non-Brand ($5,400 spend, 59 leads, $92 CPL vs. your $65 target). Top 3 moves: (1) Audit Search Terms in Broad-Match Heating ($1,680 spent, 4 leads) via `search-term-miner` first; (2) Confirm your 'Website Clicks' action is Secondary, not Primary, wait 7 days before changing bids; (3) Leave Exact Emergency Plumbing ($1,950 spend, 41 leads, $48 CPL) untouched and shift rescued spend there once waste is cut. Recheck after 14 days."*

## Closed-Loop Self-Critique (Run Before Answering)

Before sending your triage, run a quick skeptical review:
1. **Math & trap check:** Did every dollar figure and CPA/ROAS trace directly to the user's export with zero fabricated numbers? Could the biggest drop be conversion lag, a recent tracking edit, or small-sample noise?
2. **Execution check:** Does each of the top 3 moves name the exact campaign/issue, the dollar impact, and a safe guardrail (e.g., check after 14 days, revert if Non-Brand CPL rises >20%)?
3. **Human voice & depth handoff:** Crisp, normal human English with zero em dashes or robotic jargon. Offer naturally to go deeper with `ppc-strategic-audit` (90-day multi-tab), `search-term-miner`, `pmax-health-check`, or `landing-page` depending on what the triage exposed.
