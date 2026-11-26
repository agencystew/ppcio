# Account Auditing Knowledge Foundation

> An audit is a diagnostic process that identifies the root cause behind an account's underperformance, quantifies the dollar impact of each finding, and produces executable fixes -- not a checklist walkthrough that grades every dimension regardless of relevance.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

## First Principles

**Every account has one root cause, not twenty problems.** The instinct during an audit is to document every imperfection across every dimension. Resist it. Most accounts have a single structural issue -- fragmented campaigns starving smart bidding, broken tracking inflating every metric, or misaligned intent leaking budget -- and the other "problems" are downstream symptoms. Three ad groups with high CPA, poor Quality Scores, and low impression share might all trace back to one fragmented campaign structure. Finding the root cause and connecting everything back to it is the difference between an audit that changes an account and a report that gets filed.

**Averages are liars. Drill to segments before declaring anything healthy.** A campaign averaging $45 CPA might contain three ad groups at $25 and two at $90. The average looks acceptable but half the budget is burning. The alignment chain -- search term to keyword to ad to landing page to offer -- is where breaks hide, and breaks always hide behind aggregated numbers. Every metric in an audit must be disaggregated to the level where decisions get made before it earns a verdict.

**Waste elimination precedes growth, always.** The sequence is: stop the bleeding (cut clear waste), feed the winners (increase budgets on what already works), then test new growth (expand only after protecting profitability). This ordering exists because every dollar saved from waste can be reallocated to proven performers at known returns, while every dollar spent on growth is an uncertain bet. An audit that leads with scaling opportunities before quantifying waste is recommending you pour water into a leaky bucket.

**Quantify in currency, not percentages.** "CPA is 15% above target" is an observation. "$730/month wasted on irrelevant search terms" is a finding someone can act on. Percentages obscure magnitude. A 50% CPA variance on a $200/month campaign is $100 of impact. The same variance on a $20,000/month campaign is $10,000. Audits that fail to express findings in dollars get ignored because the reader cannot assess whether the finding is worth their time.

**Check whether the problem is inside or outside Google Ads.** A conversion rate collapse might be a broken landing page, not a campaign problem. A CPA spike might be a tracking change, not a bidding failure. A revenue decline might be a pricing or product problem that no amount of PPC optimization will fix. The most valuable sentence in an audit is sometimes "this problem is not fixable inside Google Ads" because it prevents weeks of misallocated optimization effort.

## The Decision Landscape

**Health grading framework.** An account earns an A when it outperforms targets and the audit's job is to protect what works. B means healthy with meaningful optimization upside -- good management with identifiable improvements. C signals underperformance from fixable structural issues -- the meat of most audits. D means fundamentally broken, where rebuilding must happen before optimization is meaningful. The grade drives the audit's tone and recommendation intensity.

**Maturity staging determines what questions to ask.** A new account (under 30 days of data) gets a structural review, alignment check, and tracking validation -- performance diagnosis requires 60+ days minimum, and forcing a thesis from thin data produces false conclusions. A mature account plateauing at high impression share needs a demand ceiling analysis, not another round of keyword optimization. A turnaround account needs triage: the single biggest source of waste right now, the top three actions, and a 30-day checkpoint. Every audit must classify the account's maturity stage before analyzing performance, because the stage determines which analytical tools are valid.

**The opportunity sizing calculation.** Total addressable opportunity includes three components: waste elimination (money currently burning on traffic that will never convert), efficiency gains (money recoverable through structural fixes like campaign consolidation), and revenue growth (money left on the table from capped impression share, underutilized landing pages, budget-starved winners). If a profitable campaign loses 30% impression share to budget, calculate the revenue upside at current conversion rates and include it. Audits that only report waste undersell their value. Audits that only report growth opportunities ignore the foundation.

**Confidence scoring governs recommendation strength.** With 50+ conversions or multiple corroborating signals, confidence is high (0.9+) and recommendations are directive. Between 20-50 conversions, confidence is medium (0.7-0.89) and recommendations carry caveats. Between 10-20, findings are directional (below 0.7) and should inform further investigation rather than immediate action. Below 10 conversions, use ranges instead of point estimates. This scoring exists because the statistical reliability of PPC data changes dramatically with sample size, and an audit that treats 8 conversions with the same certainty as 80 will produce bad recommendations.

## Industry Branches

### Ecommerce

Ecommerce audits lead with ROAS as the primary metric and Shopping/feed health as a priority scan area. The alignment chain in ecommerce runs from search query through product title through product page through checkout flow, and feed quality is where most breaks occur -- poorly optimized titles, missing attributes, and incorrect product categories cause Shopping campaigns to show for wrong queries regardless of bidding. Brand vs. non-brand separation is critical because blended ROAS masks the true cost of customer acquisition: brand search at 12x ROAS subsidizes non-brand search at 2x, and the average looks comfortable while the acquisition engine underperforms. Product-level performance analysis matters because a catalog of 500 products often has 20 driving 80% of profitable revenue, with the remaining 480 diluting budget across marginal performers. The audit should tier products into scale (ROAS above 120% of target with 30+ conversions), maintain (80-120% of target), fix (50-80% of target), and cut (below 50% of target) categories with specific budget reallocation amounts.

### Lead Generation

Lead gen audits center on CPA and the quality gap between what Google counts as a conversion and what the business considers a qualified lead. The most common audit finding in lead gen is that Smart Bidding is optimizing for the cheapest form fills rather than the most qualified leads, because offline conversion import is not configured. Without that feedback loop, the algorithm has no quality signal and defaults to volume. Search term analysis carries higher weight in lead gen because a single misaligned broad match keyword at $50 CPC can waste $1,500/month on informational traffic. Form conversion rate compared across landing pages receiving similar traffic reveals broken mechanisms that no amount of upstream optimization can fix. The audit should calculate effective CAC (spend divided by closed deals, not just form fills) if any pipeline data is available, because an account showing $40 CPL with 5% qualification rate has a $800 effective CAC that changes the entire optimization conversation.

### B2B SaaS

B2B SaaS accounts operate under low conversion volume (often 10-30 demo requests per month) and long attribution lag (60-120 days from click to closed deal). These constraints mean most B2B audits work with insufficient data for high-confidence conclusions about individual campaigns. The audit should aggregate conversion data at the account level for directional assessment, check the attribution window (30-day default misses most B2B conversions), and evaluate whether the conversion action itself is appropriate -- tracking "page views" or "content downloads" as primary conversions in B2B produces meaningless CPA figures. Campaign consolidation is almost always a finding, because the typical B2B account fragments into too many small campaigns that individually lack the 30 conversions/month needed for smart bidding. Brand vs. non-brand economics differ more in B2B than any other vertical: brand CPAs of $15-30 alongside non-brand CPAs of $150-300 are normal, and blending them produces a misleading average.

### Local Services

Local services audits must assess the demand ceiling before recommending any scaling action. An account capturing 85% impression share in a market of 500 monthly searches for "plumber near me" is structurally capped regardless of budget or bidding strategy. The audit should calculate the total addressable demand (search volume times estimated CTR times conversion rate) and compare it to current performance to determine whether the account is budget-constrained (fixable) or demand-constrained (structural). Geographic targeting precision matters disproportionately: a plumber in Chicago bidding on broad queries will attract clicks from suburbs outside the service radius at $40+ CPCs. Call tracking integrity is essential to assess, since local services convert primarily through phone calls and missing call tracking means the audit is working with a fraction of actual conversion data. Day-of-week and hour-of-day patterns are more pronounced in local services than any other vertical (emergency plumbing demand spikes on weekends; dental appointments book Monday through Thursday mornings) and scheduling gaps represent real waste.

### High-Value Verticals (Legal, Medical, Financial)

These verticals demand the most conservative audit approach because the dollar exposure per finding is enormous. A single broad match keyword leaking $150 clicks to informational queries can waste $4,500/month. Negative keyword analysis is the highest-priority audit area, and the threshold for flagging waste is lower: 1-2 clicks on a clearly misaligned term at $100+ CPC warrants immediate negative keyword addition, where other verticals might wait for more data. Quality Score carries outsized financial impact because improving QS from 5 to 7 at a $150 CPC reduces actual cost by roughly $42 per click. Landing page conversion rate differences between pages are amplified: a 1% CVR page vs. a 2% CVR page at $150 CPC means the difference between $150 and $75 per conversion, which at 100 monthly clicks is $7,500/month of impact from a single landing page improvement.

## Diagnostic Trees

**IF conversion rate dropped suddenly THEN** check conversion tracking first (the most common cause of sudden drops), then check for landing page changes or downtime, then check for ad disapprovals reducing traffic quality, then check for competitor entry disrupting auction dynamics. Only after ruling out these external causes should you suspect a campaign-level problem.

**IF CPA is above target across all campaigns THEN** determine whether the target is realistic. If CPA has never been within 20% of target, the target may be aspirational rather than achievable. If CPA was previously at target, identify when it diverged and correlate with change history. If no changes were made, check impression share trends (competitive pressure), Quality Score trends (relevance decay), and landing page performance (conversion rate erosion).

**IF a campaign shows strong ROAS but impression share is low THEN** check whether impression share loss is budget-driven or rank-driven. Budget loss on a profitable campaign is a scaling opportunity -- calculate the revenue upside at current conversion rates and recommend budget increase. Rank loss on a profitable campaign is a Quality Score problem -- break down QS components (ad relevance, expected CTR, landing page experience) to diagnose which factor to improve.

**IF Performance Max appears to be the top performer THEN** strip out brand traffic before crediting PMax performance. Compare PMax brand CPA against Search brand CPA; if PMax is paying more for the same brand conversions, it is cannibalizing, not creating, value. Check whether brand search impression share declined when PMax launched or scaled. Calculate "true non-brand PMax ROAS" and evaluate whether PMax actually outperforms dedicated Search campaigns for customer acquisition.

**IF the account has many small campaigns with few conversions each THEN** this is a structural fragmentation problem. Smart Bidding requires 30+ conversions per month per campaign to function effectively. Three campaigns with 12, 15, and 13 conversions each collectively have 40 conversions but individually none crosses the threshold. The recommendation is consolidation, which pools data and unlocks automation without increasing total conversion volume.

## Mental Models

**The Root Cause Tree.** Every audit finding is either a root cause or a symptom. Test by asking: "If I fix this, do the other findings improve?" If fixing campaign structure would improve Quality Score, reduce CPA, and increase impression share, then structure is the root cause and the others are symptoms. If fixing negative keywords reduces waste but does not affect creative performance, those are independent findings. The goal is to identify the shortest path to the largest impact, which almost always runs through the root cause.

**The Alignment Chain Scan.** Search term to keyword to ad to landing page to offer. Walk the chain for the top spending keywords. If any link is broken -- the search term does not match the keyword's intent, the ad does not reflect the search term, the landing page does not match the ad promise, the offer does not match the landing page -- that break is the finding, and everything downstream of it is noise until the break is fixed. This model prevents the mistake of optimizing bids on a misaligned campaign, which makes the wrong thing happen faster.

**The Risk Concentration Assessment.** If one campaign generates more than 70% of conversions, one audience segment delivers more than 80% of revenue, or PMax represents more than 60% of total spend, the account has a single point of failure. Quantify the dollar exposure: if that campaign stopped converting tomorrow, how much revenue disappears? Risk concentration findings are defensive -- they do not improve current performance but protect against catastrophic drops.

**The 180-Day vs. 30-Day Lens.** When 180-day trends conflict with 30-day snapshots, weight the long-term trend. A metric that improved last month after declining for five months is bouncing, not recovered. A metric that dipped this month after improving for five months is noise, not crisis. This model prevents the recency bias that causes audits to over-react to recent changes while missing the structural trajectory.

**The Waste-First Sequence.** Fix leaks before adding water. Stop the bleeding (cut clear waste), feed the winners (increase budgets on proven performers), then test new growth (expand only after protecting profitability). Every audit roadmap should follow this sequence because each dollar saved from waste is reallocated at known returns, while growth spending carries uncertainty. An audit that recommends budget increases before addressing $2,000/month in waste is asking the client to fund waste at scale.

## Thresholds and Benchmarks

**$500/month impact** is the minimum for a finding to warrant a dedicated recommendation in a well-managed account. Below this threshold, document the observation but do not inflate it into a finding card. This threshold comes from practitioner consensus that findings below $500/month impact do not justify the management time to implement (source: Google Ads Help Community and agency operational data across 100+ managed accounts).

**30 conversions minimum** before making performance-based pause decisions on any entity. This comes from Google's own documentation on Smart Bidding data requirements and the statistical reality that smaller samples produce unreliable CPA estimates (source: Google Ads Help, "About Smart Bidding").

**180 days** is the standard lookback window for a comprehensive audit. This captures seasonal patterns, recent trends, and enough data for reliable campaign-level conclusions. For weekly audits, compare this week against last week AND the 4-week average -- a single bad week is noise, two consecutive bad weeks is a pattern, three is a fire (source: PPC.io operational framework across managed accounts).

**Brand vs. non-brand separation** is mandatory in every audit where brand traffic represents more than 10% of conversions. Brand search typically converts at 10-30x the rate of non-brand, and blending the two produces a CPA figure that is too optimistic for acquisition and too pessimistic for brand defense (source: industry benchmarks from WordStream, Optmyzr, and agency operational data).

**Quality Score of 5** is the break-even point on Google's QS scale. Below 5, you pay a premium on every click. Above 5, you receive a discount. Improving from 5 to 7 reduces CPC by approximately 28%. Improving from 3 to 5 reduces CPC by approximately 37% (source: Google's QS auction mechanics documentation and third-party QS impact studies from Adalysis and WordStream).

**Impression share loss to budget exceeding 20%** on a campaign with CPA below target is a scaling opportunity worth calculating. The formula: lost impression share percentage times current impressions divided by current impression share, times current CTR, times current conversion rate, times average conversion value. This produces the estimated monthly revenue being left on the table (source: Google Ads impression share documentation).

## Common Mistakes and WHY They Happen

**Writing about every dimension equally.** The instinct is to be thorough by covering every possible area. But equal coverage means shallow coverage. An audit with 8 sections of equal depth buries the one finding that matters inside 7 that do not. This happens because auditors confuse completeness with value. The discipline is spending 60% of analysis depth on the top 3 findings and giving healthy dimensions nothing more than "no issues found."

**Recommending without delivering the fix.** "Add negatives" without the actual keyword list is incomplete. "Consolidate campaigns" without the proposed structure is incomplete. This happens because auditors think their job is to identify problems. In practice, the deliverable IS the action. A finding that includes the proposed campaign structure, the budget reallocation table, or the copy-paste negative keyword list gets implemented. A finding that describes what should happen gets filed.

**Evaluating Performance Max at face value.** PMax blends brand and non-brand traffic with zero transparency, and its reported ROAS almost always looks strong because brand traffic converts cheaply. Auditors who do not strip out brand cannibalization effects will wrongly conclude PMax is the top performer. The mistake happens because PMax does not expose the data needed to evaluate it honestly, and the surface metrics look impressive. The discipline is comparing PMax brand CPA against Search brand CPA and checking whether brand search impression share declined when PMax scaled.

**Recommending bid strategy changes when alignment is broken.** If the search term does not match the keyword intent, or the ad does not match the landing page, changing from Manual CPC to Target CPA will make the wrong thing happen faster and more efficiently. This mistake happens because bidding is the most visible lever in Google Ads and the instinct is to adjust what you can see. The discipline is checking the alignment chain before touching bids.

**Using 30-day snapshots to contradict 180-day trends.** A single good month after five bad months is not a recovery. A single bad month after five good months is not a crisis. This happens because the most recent data feels most relevant and carries emotional weight. The discipline is always weighting the long-term trend over the short-term snapshot, and naming the distinction explicitly when they conflict.

## What Changes Over Time

Google continues to reduce transparency and manual control. Performance Max absorbs more campaign types, automated recommendations become harder to disable, and broad match becomes the default in new campaign setups. Auditors must adapt by developing expertise in PMax governance (brand exclusion lists, search theme analysis, asset group performance) because these campaigns will increasingly dominate account spend. The implication for auditing: the traditional search-term-heavy audit framework becomes less applicable as PMax grows, and the audit must shift toward evaluating the inputs PMax receives (feed quality, asset groups, audience signals) rather than the outputs it hides.

Conversion tracking is becoming simultaneously more important and more difficult. Cookie deprecation, consent frameworks, and privacy regulations reduce data fidelity, while Google's Enhanced Conversions and consent-mode adjustments attempt to fill the gaps. Auditors who validate tracking integrity as their first step -- before any performance analysis -- will catch the growing category of problems where metrics look wrong because measurement is broken, not because performance actually changed.

Offline conversion import has moved from an advanced feature to essential infrastructure for any lead gen or B2B account. As automation becomes mandatory, the quality of the signal you send to Google's algorithm determines the quality of the results you get back. Audits that do not assess offline conversion tracking maturity miss the single highest-leverage recommendation for most non-ecommerce accounts.

## Connected Domains

**Conversion tracking and measurement** is the foundation every audit rests on. If tracking is broken, every metric is wrong and every recommendation based on those metrics is suspect. Tracking validation is always step one.

**Budget pacing** is tightly coupled with audit findings. A campaign that appears underperforming might actually be budget-constrained, and a campaign that appears overspending might have its budget misallocated from a more profitable campaign. Audits must evaluate budget allocation across the portfolio, not just individual campaign performance.

**Keyword strategy and negative keywords** are the most common source of audit findings in search-heavy accounts. Waste from irrelevant search terms, missing negatives, and match type misalignment accounts for the majority of recoverable spend in most audits.

**Landing page performance** determines the ceiling on what any campaign can achieve. An audit that finds 2x CPA variance between landing pages receiving similar traffic has identified a fix worth more than any bid or budget adjustment.

**Account structure** determines how data flows to bid strategies and whether Smart Bidding can function effectively. Fragmented accounts with many low-volume campaigns are the most common structural problem, and consolidation is the most common structural recommendation.

**Competitive intelligence** enriches audits with context about why metrics changed. An impression share decline might be explained by a new competitor entering the auction, not by anything the advertiser did wrong. Auction insights data should be pulled as part of any comprehensive audit.
