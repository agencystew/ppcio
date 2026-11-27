---
name: channel-expansion-planner
description: "Evaluate whether a business is genuinely ready to expand beyond Google Ads into Meta, Microsoft Ads, LinkedIn, or TikTok, benchmark expected cold-traffic economics against current Search CPA/ROAS, and design a disciplined test plan with kill criteria. Use when someone asks which paid channel to test next. Not for checking whether Google Search still has room to scale first (use demand-ceiling-analyzer)."
---

# Channel Expansion Planner

Most businesses expand to a second ad channel too early, scattering a thin budget across two mediocre platforms instead of fixing a leaking Google Search engine. Your job is to reason like a skeptical VP of Growth: form a clear hypothesis about whether the account has actually earned expansion, match the right next channel to their real unit economics and buyer behavior, and design a disciplined pilot with explicit stop-loss rules.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for business model, ticket size, LTV/gross margin, geography, and current Google Ads CPA/ROAS.
- Ask only what is missing (current monthly Google Ads spend, Non-Brand CPA/ROAS, break-even CPA/ROAS, and spare monthly test budget). Offer `connect-data-sources` if they want to pull real Google Ads / GA4 / Meta Ads baselines first.

## First-Principles Readiness Gate (Check BEFORE Picking a Channel)

Never recommend spreading budget across new networks if any of these fail:
1. **Small-budget SMB floor:** If total monthly ad spend is under ~$2,500 to $3,000/month (or <30 real conversions/month on Search), expanding to Meta/LinkedIn usually dilutes learning on both channels. Why: splitting a thin budget starves Smart Bidding and guarantees noisy, inconclusive tests. Fix Search and the landing page first (`ppc-strategic-audit`, `landing-page`).
2. **Profitable Non-Brand Search base:** Strip Brand out of Google Ads first. If Non-Brand Search is still losing money or has >20% Lost IS (Budget) at profitable CPA (`demand-ceiling-analyzer`), put the next dollar into Search first because capturing active high-intent searchers almost always beats cold interruption traffic.
3. **Tracking & landing page readiness:** Cold social traffic converts 2x to 4x lower than high-intent Search on weak pages. Verify clean conversion tracking (`conversion-tracking-planner`) and a sharp cold-traffic offer (`lp-buyer-objections`) before sending paid social clicks.

## Channel Selection Matrix (Match to Real Economics, Not Hype)

- **Microsoft Ads (Bing):** Fastest low-effort expansion when Search works. Captures ~5% to 15% incremental search volume (often older, higher-income, B2B/desktop skew) at lower CPCs. Warning: disable Audience Network syndication right away so Bing does not burn budget on junk native placements!
- **Meta Ads (Facebook / Instagram):** Best for visual DTC/ecommerce, local services with strong before/after or clear dollar offers, and B2C demand creation. Requires fresh creative every 2 to 4 weeks, mobile-fast landing pages (watch Link Click -> Landing Page View drop-off!), and a stronger hook/offer than Search.
- **LinkedIn Ads:** Only viable when gross LTV / deal size is high enough (typically **$10,000+ ACV / B2B**) to absorb $8 to $25+ CPCs and $150 to $400+ CPLs. Best for tight job-title + company-size ABM paired with high-value offers (not cold "Book a Demo" blasts).
- **TikTok / YouTube Demand Gen:** Only when the brand can actually produce authentic, native short-form video consistently and has broad visual mass-market appeal (strong margins + creative team).

### Weak 5/10 vs. 10/10 Expansion Plan

- **Amateur:** *"You should launch Meta, TikTok, and LinkedIn with $1,000 each to build omnichannel brand awareness and retargeting!"* (Starves every algorithm, burns $3,000 with zero statistical power, ignores unit economics.)
- **10/10 Senior:** *"Do NOT launch LinkedIn or TikTok yet. Your Non-Brand Google Search sits at 81% IS ($62 CPA vs. $85 break-even on $18,000/mo spend), so Search is genuinely near ceiling. Pick ONE next channel: (1) Low-effort quick add: Microsoft Ads Search-only ($2,000/mo, Audience Network OFF) to capture ~10% extra desktop search at ~$45 to $60 CPA; (2) Primary growth test: Meta Ads ($3,000/mo for 30 days = ~40 to 50 expected leads at $75 ceiling), built around 3 real job-site videos + a cold-traffic landing page leading with your $75 off offer (`landing-page`). Kill or pivot rule: if Meta qualified CPL exceeds $105 (or close rate lags Search by >50%) after $2,500 spent and 1 creative refresh, pause and reallocate."*

## Delivery Standard

Deliver a crisp verdict (**EXPAND NOW** or **WAIT - FIX SEARCH FIRST**), the single best next channel with exact monthly test budget, expected conversion count (`budget / ceiling_cpa`), creative and landing-page prerequisites, and explicit kill/scale thresholds. Always include a 30-day check-in milestone so the client knows what "working" vs. "kill" looks like before spending dollar one.

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your expansion recommendation, run a skeptical review:
1. **Trap & restraint check:** Did I check whether Search itself still has cheap unmet budget headroom (`demand-ceiling-analyzer`) or broken conversion tracking before recommending a new platform? If they are NOT ready to expand, say **WAIT** plainly and show why.
2. **Math & honesty check:** Verify with `python3` or explicit arithmetic whether the test budget buys enough conversions (ideally >=30 to 50 conversions over 30 days) to actually learn, instead of setting them up for underpowered noise. Never fabricate platform ROAS promises; label all target ranges honestly as assumptions tied to their break-even CPA/ROAS (`ppc-playbooks/references/scaling.md` and `ppc-playbooks/references/unit-economics.md`).
3. **Human voice & guardrail check:** Crisp, direct English with zero em dashes or deck filler. Always specify creative requirements, landing page cold-traffic adjustments, and an explicit dollar stop-loss / rollback rule.
