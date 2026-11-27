---
name: quality-score-repair
description: "Spend-weighted Google Ads Quality Score diagnostic (Expected CTR, Ad Relevance, Landing Page Experience) that targets spend-carrying keywords, protects CVR pre-qualifiers, calculates CPC penalty vs. historical norm, and delivers a prioritized fix sequence. Use when Quality Scores are low (<=5) or CPCs are rising due to Ad Rank. Not for full account health grading (use ppc-account-health-check) or rebuilding landing pages (use landing-page)."
---

# Quality Score Repair & CPC Penalty Analyzer

Quality Score is not a vanity report card; it directly taxes your Cost Per Click via Ad Rank. Yet most advertisers waste hours polishing QS 2 keywords spending $14/month or ripping price qualifiers out of their ads just to chase a higher Expected CTR, tanking conversion rate in the process. Your job is to focus strictly on **spend-carrying keywords**, isolate the single dominant failing component, protect real conversion efficiency, and sequence fixes by speed and dollar savings.

## Start here

- Script path: if `${CLAUDE_SKILL_DIR}` is empty (Codex, Cursor, Windsurf, Antigravity, Gemini CLI), replace it with the folder containing this `SKILL.md`.
- Check if a local `landing-pages/*/context.md` exists first for core offers, landing pages, and target CPA.
- **Zero fabrication:** Never invent CPC-savings guarantees or missing QS ratings; compute exact spend-weighted averages strictly from user-supplied CSV rows, and label any savings projection clearly as an assumption.
- Ask in one line if data is missing: *"Export your Keywords tab (last 30 to 90 days) with Keyword, Campaign, Ad group, Cost, Clicks, Avg. CPC, Conversions, Quality Score, Exp. CTR, Ad relevance, and Landing page exp. as CSV and drop it here (plus your landing page URL). Or ask me to connect Google Ads via `connect-data-sources`."*
- **Run the deterministic spend-weighted QS engine first:**
  `python3 "${CLAUDE_SKILL_DIR}/scripts/qs_audit.py" --keywords <keywords.csv> [--target-cpa <CPA>]`
  It calculates exact spend-weighted QS, dollars at `QS <= 5`, dominant failing component by dollar weight, protected high-CVR pre-qualifiers, and pause candidates.

## Delivery Standard

Deliver: (1) Spend-weighted QS & total monthly spend sitting at `QS <= 5`, (2) the single dominant failing component by dollar weight, (3) exact top fixes ordered by speed (`Ad Relevance -> Exp. CTR -> LP Experience`), (4) low-spend / high-CVR keywords explicitly marked **DO NOT TOUCH**, and (5) a 21-day re-export verification and rollback plan.

## First-Principles QS Diagnosis (And Why Sequence Matters)

1. **Spend-Carrying Keyword Priority (Ignore Zero-Spend Noise):** Sort strictly by **monthly spend**, NOT lowest QS number! Why: raising a QS 5 keyword spending $2,800/month to QS 7 saves far more real money than fixing twenty QS 2 keywords spending $12 each. Ignore keywords with `<100 impressions` or `<20 clicks` (insufficient auction history).
2. **Protect Pre-Qualifying Ads (CTR vs. CVR Trade-Off):** Never strip a real price anchor ("From $2,500") or B2B filter just to chase `Above Average` Expected CTR! If a keyword has **Below Average Exp. CTR but strong CVR and profitable CPA**, leave the pre-qualification intact (`rsa-asset-writer`) and check Ad Relevance or Landing Page Experience instead.
3. **Check CPC Inflation vs. Best Month First:** Rising CPCs are not always a QS problem. Check whether Avg. CPC inflated after switching to uncapped Max Conversions (`bidding-strategy-decision-tree`) or rising auction competition before blaming Quality Score.
4. **Diagnose the Dominant Failing Component (Fix in Speed Order):**
   - **Ad Relevance = Below Average (Fastest fix - 24 to 48h):** Almost always a **structural problem** (bloated ad group mixing unrelated intents) or missing keyword match in the first 45 characters of mobile headlines/descriptions. Fix: split into tight 10 to 20-keyword ad groups (`keyword-universe-builder`) with crisp keyword-matched RSA headlines (`rsa-asset-writer`).
   - **Expected CTR = Below Average (1 to 2 weeks):** Weak, generic headlines blending into the SERP (`competitor-messaging-analysis`), missing extensions (sitelinks, callouts, structured snippets, call/location assets), or uncompetitive offer hooks.
   - **Landing Page Experience = Below Average (2 to 4 weeks, highest compound impact):** Slow mobile load (>3s), broken headline-to-ad scent (`lp-message-match`), thin content, or aggressive popups. Fixing one shared landing page (`landing-page`) lifts QS across every keyword pointing to it!
5. **Know When to Pause Instead of Repair:** A keyword at `QS 1 to 3` with all three components `Below Average`, high spend (>1x target CPA), and `0 conversions` usually does not belong in the account at all; pause it and reallocate spend to winners.

### Weak 5/10 vs. 10/10 Quality Score Plan

- **Amateur:** *"You have 42 keywords with QS under 6. Rewrite all your ads with Dynamic Keyword Insertion to boost CTR and aim for QS 8+ across the account!"* (Wastes time on $5 keywords, breaks pre-qualification, ignores LP Experience and spend weighting.)
- **10/10 Senior:** *"Spend-weighted QS across your account is 5.4, with **$4,120/mo (64% of Search spend)** sitting on just 9 keywords at QS 4 to 5 (ignore the 27 low-QS keywords spending under $20/mo). Dominant failure by spend: **Landing Page Experience is Below Average on 7 of those 9 keywords** ($3,450/mo), while Ad Relevance is Below Average on 4 keywords stuck inside one 48-keyword 'General HVAC' ad group. Fix order: (1) This week, split `'ac replacement cost'` and `'emergency ac repair'` into 2 focused ad groups with matching H1s (`rsa-asset-writer`) - expect Ad Relevance lift in 48h; (2) Weeks 1 to 2, rebuild the slow 4.8s mobile landing page with matching screen-one headlines (`landing-page`, `lp-message-match`); (3) Do NOT remove 'Starting at $5,900' from your Replacement ads even though Exp. CTR is Average, because those ads convert at 11.4% vs. 4.2% account avg. Re-export QS after 21 days; pause any test ad whose CPA rises >20% after 1,000 impressions."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your repair plan:
1. **Spend-weight & math check:** Did I calculate spend-weighted QS and rank fixes by actual monthly dollars at risk (not raw keyword count), with zero fabricated CPC-savings promises (stating any estimated savings clearly as an assumption)?
2. **Restraint & trap check:** Did I protect high-CVR pre-qualifying ads from vanity CTR rewrites, separate QS drops from bidding-driven CPC inflation, and include a 14 to 28-day re-check + rollback rule?
3. **Human voice & handoff:** Crisp, direct English with zero em dashes or workshop filler. Route naturally to `rsa-asset-writer` (ad relevance/CTR), `keyword-universe-builder` (ad group splits), or `landing-page` / `lp-message-match` (LP experience).
