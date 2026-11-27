---
name: new-client-onboarding
description: "First-90-days Google Ads onboarding state machine (Stabilization -> Optimization -> Growth -> Graduation) with vertical modifiers (Home Services, Legal/Medical, B2B), conversion volume gates, DATA_INSUFFICIENT escalation rules, and Write Operations Safety. Use when taking over a new client account or starting PPC management. Not for a one-off 5-minute triage (use ppc-account-health-check)."
---

# New Client Onboarding (First 90 Days State Machine)

Taking over a new Google Ads account and rewriting everything in Week 1 is the fastest way to blow up baseline data and lose client trust. The first 90 days require a disciplined, phase-gated state machine where risk tolerance expands ONLY as real conversion data accumulates. Your job is to classify the account's exact phase from verified data, apply vertical-specific guardrails, and output concrete weekly milestones with safe rollout rules.

## Start here

- Check if a local `landing-pages/*/context.md` exists first for business model, vertical, budget, and target CPA/ROAS.
- Ask only what is missing: takeover week (`Week 1` through `Week 12`), new vs. inherited account, 30-to-90-day Campaigns CSV (plus Search Terms / tracking status), target CPA/ROAS, monthly budget, and vertical (Home Services, Legal/Medical, Ecommerce, or B2B/SaaS). Offer `connect-data-sources` to pull live Google Ads + GA4 + Clarity baselines immediately.
- Run `python3` math on any shared CSV so conversion counts, waste share, and spend utilization are exact with zero fabricated figures.

## The 4-Phase State Machine (And Exact Transition Gates)

Never skip a gate just because the calendar advanced; data maturity governs risk!

1. **Phase 1: Stabilization (Weeks 1 to 4 - Risk: CONSERVATIVE):**
   - **Focus:** Audit conversion tracking first (`conversion-tracking-planner` - Primary vs. Secondary cleanup, call duration `>=20s`, Enhanced Conversions), stop obvious Search Term / Display / Search Partner bleed (`search-term-miner`), separate Brand vs. Non-Brand, disable silent Auto-Applied Recommendations, and verify budget pacing (`budget-pacer`).
   - **Write Operations Safety:** Never wipe working legacy campaigns on Day 1; build new structures paused, review before launch, and respect the **7-day Conversion Sequencing Law** (wait 7 days after tracking edits before touching bids!).
   - **Gate -> Optimization:** `30+ clean conversions` (Primary) OR `4 weeks elapsed` (Fallback) AND healthy tracking. **Low-data rule:** if `<5 conversions` at Week 4, enter Optimization with **`DATA_INSUFFICIENT`** flag (skip CPA-based bid cuts; fix offer, landing page `landing-page`, and search-term intent first!).
2. **Phase 2: Optimization (Weeks 3 to 8 - Risk: BALANCED):**
   - **Focus:** Graduate qualified campaigns to Smart Bidding (`bidding-strategy-decision-tree`, keeping `<15 leads/30d & <3 clicks/day` on Max Clicks + CPC cap!), run RSA copy + landing page scent upgrades (`rsa-asset-writer`, `lp-message-match`), and wire CRM/OCI feedback (`lead-gen-quality`).
   - **Gate -> Growth:** CPA within 20% of target AND Smart Bidding stable on >=1 core Non-Brand campaign (Fallback: 8 weeks). **Hard Escalation Rule:** if `<10 conversions by Week 8` OR CPA remains `>50% above target` at Week 8 -> **AUTO-ESCALATE** for manual strategic/offer review (do NOT keep tweaking bids when market fit or landing page CVR is broken!).
3. **Phase 3: Growth (Weeks 6 to 12 - Risk: CONTROLLED EXPANSION):**
   - **Focus:** Scale profitable Non-Brand headroom in 15% to 20% steps (`demand-ceiling-analyzer`), test incremental keyword themes/Shopping tiers (`ecommerce-shopping-builder`), and evaluate next channels (`channel-expansion-planner`) ONLY after core Search is clean.
   - **Gate -> Graduation:** 4+ consecutive weeks hitting targets with stable Smart Bidding (escalate if stuck in Growth >8 weeks).
4. **Phase 4: Graduation (Week 12+):** Hand off to steady-state `weekly-pulse`, `weekly-client-report`, and `ppc-experiment-finder` cadence with a documented "What Worked / What Failed / Client Rejections" log.

## Vertical Modifiers (Calibrate Speed & Waste Rules)

- **Home Services (Plumbing, HVAC, Roofing):** High urgency + high CPC. Flag obvious waste terms after **2 non-converting clicks**; set a **3:00 PM daily budget-exhaustion alert** so emergency evening demand is not missed!
- **Legal / Medical (High-CPC $25 to $150+):** Flag obvious off-intent waste after **1 click**; set a **2:00 PM budget-exhaustion alert**; enforce strict policy & compliance pinning (`rsa-asset-writer`).
- **B2B / High-ACV SaaS (Long Sales Cycle):** Extend phase fallback windows to **6 weeks (Stabilization) and 10 weeks (Optimization)**; prioritize GCLID/OCI SQL imports (`lead-gen-quality`) over raw form-fill volume.

### Weak 5/10 vs. 10/10 Onboarding Plan

- **Amateur:** *"Week 1: Pause all old campaigns, rebuild 12 SKAGs, switch everything to Target CPA, and turn on Performance Max to scale quickly!"* (Destroys baseline, violates Conversion Sequencing Law, starves Smart Bidding.)
- **10/10 Senior:** *"Account status: **Week 1 - Stabilization (Home Services modifier, $6,000/mo budget, $65 target CPL)**. Your inherited export shows 41% CVR because `Tel_Button_Click` and `Page_View_Contact` are marked Primary alongside real forms. Week 1 to 2 moves ONLY: (1) Demote micro-actions to Secondary, add CallRail `>=20s` answered calls (`conversion-tracking-planner`), wait **7 full days** before changing any bid strategy; (2) Disable Search Partners + Auto-Apply + block 2-click DIY/job waste via `search-term-miner`; (3) Keep legacy Exact Emergency Plumbing running untouched while building a clean Brand campaign paused for review; (4) Set 3pm budget alert + `weekly-client-report` baseline. Exit gate to Phase 2: 30 clean leads (or Week 4 check-in; trigger `DATA_INSUFFICIENT` if <5 leads)."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your onboarding plan:
1. **Gate & math check:** Did I place the account accurately in its phase based on real verified numbers (zero invented metrics), apply the right vertical modifier, and enforce the `<5 conv / Week 4` and `<10 conv / Week 8` escalation triggers?
2. **Safety & restraint check:** Did I protect working legacy campaigns from Day-1 demolition, enforce the 7-day Conversion Sequencing Law, and include clear rollback / escalation criteria for every phase?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or form blanks. Route naturally into `conversion-tracking-planner` (Week 1), `search-term-miner`, `landing-page`, and `weekly-client-report`.
