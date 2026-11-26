# Broad Match Governance Knowledge Foundation

> Broad match is a scaling tool for already-successful accounts, not a shortcut for accounts that have not optimized exact and phrase first. Most accounts that fail at broad match failed because they skipped the prerequisites. The tool itself works; the implementation discipline determines the outcome.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

## First Principles

**Broad match is an amplifier, not a fixer.** It amplifies whatever the account already does. An account with strong conversion tracking, robust negatives, and Smart Bidding producing profitable results will find broad match expands that profitability into new query spaces. An account with weak tracking, no negatives, and insufficient conversion volume will find broad match amplifies waste, noise, and budget drain. The prerequisite quality determines the outcome, not the match type itself.

**Broad match requires Smart Bidding. There is no viable alternative.** Without machine learning evaluating each auction in real time, broad match generates an uncontrollable spread of queries at uncontrollable prices. Manual CPC cannot respond fast enough to the query diversity that broad match creates. Enhanced CPC provides insufficient modulation. The combination of broad match plus Manual CPC is a budget bonfire. This is not a best practice recommendation; it is a functional requirement. Smart Bidding must be active AND out of the learning phase (30+ conversions in the campaign) before broad match activation.

**Smart Bidding trains on your conversion signal, and your conversion signal determines what broad match optimizes toward.** If the primary conversion is a form fill, broad match plus Smart Bidding will find the cheapest form fills, which in lead gen are almost never qualified leads. If the conversion signal is an ecommerce transaction with a revenue value, the algorithm optimizes for actual revenue. The quality of the conversion signal is the single largest determinant of broad match success or failure. Garbage conversion definition produces garbage broad match behavior regardless of every other factor.

**Broad match operates on a fundamentally different risk profile than exact or phrase match.** Exact match: you control which queries trigger your ads. Phrase match: you control the core phrase, Google expands slightly. Broad match: Google decides which queries are "related" to your keyword, using its own semantic model and your conversion data to guide expansion. This means the advertiser cedes query-level control to an algorithm. The governance framework exists because that cession of control must be bounded by explicit qualification gates, ramp phases, and kill switches.

**The demand ceiling sets the upper bound for broad match value.** An account at 85% impression share in a narrow local market is near its structural limit. Broad match cannot generate clicks that do not exist. It can only find queries the account is currently missing. If exact and phrase match already capture most of the commercially viable search demand, broad match adds marginal reach at potentially higher waste. Impression share data reveals whether there is meaningful headroom for broader matching.

## The Decision Landscape

**Business model compatibility is the first gate, not conversion volume.** Ecommerce with clear transaction values passes because the conversion signal is clean. Lead gen with form-fill-only tracking fails because conversion volume does not equal conversion quality, and broad match will optimize for the wrong signal. B2B with long sales cycles fails because the feedback loop is too slow for Smart Bidding to learn which queries produce pipeline. Business model incompatibility cannot be overcome by high conversion volume or aggressive negative management. It is a structural mismatch.

**Exact match saturation is the timing signal.** Broad match is appropriate when exact and phrase match keywords have hit their impression limits and the account needs broader query coverage to continue growing. If exact match keywords still have room to grow (impression share below 70%, budget not limited), expanding to broad match is premature scaling that adds risk without necessity. The question is not "should we use broad match?" but "have we exhausted the safer alternatives?"

**Negative keyword foundation is a prerequisite, not an accompaniment.** The qualification threshold is 50+ negatives with a weekly or bi-weekly review process in place. Below this, broad match queries will leak into irrelevant territory faster than the account manager can react. The minimum required categories before activation: employment terms, navigation terms, DIY/free terms, and industry-specific exclusions. Building these after launch means the first 2-4 weeks of broad match spend include predictable waste that was entirely preventable.

**Campaign isolation is mandatory, not optional.** Broad match keywords must live in a separate campaign from exact and phrase match keywords. Mixing match types in the same campaign makes performance attribution impossible: you cannot determine whether results come from the precise exact match targeting or the broad expansion. Isolation also prevents broad match from cannibalizing exact match impressions within the same campaign. If exact match keywords appear in both campaigns, add them as exact negatives in the broad match campaign to enforce separation.

## Industry Branches

### Ecommerce

Ecommerce is the most broad-match-friendly vertical because the conversion signal (a transaction with a revenue value) gives Smart Bidding clean optimization data. Target ROAS bidding on broad match keywords can effectively find high-value purchase queries that exact and phrase match miss. Product-specific broad match keywords ("running shoes," "kitchen knife set") expand into long-tail variants the advertiser never explicitly targeted but that carry purchase intent.

The risk in ecommerce broad match is generic product terms. "Shoes" as a broad match keyword will trigger on fashion, sports, children's, work boots, and every other shoe-adjacent query. Campaign segmentation by product category with category-specific negatives prevents cross-category bleed. The advertiser selling premium running shoes should not pay for clicks on "cheap kids sneakers."

Seasonal behavior interacts with broad match expansion. Launching broad match during peak season (Black Friday, holiday) introduces learning volatility at the worst possible time. The algorithm needs 2-4 weeks to calibrate, and those weeks should not coincide with the highest-value traffic days of the year. Deploy broad match 4-6 weeks before peak to complete learning, or wait until post-season baseline periods.

### Lead Generation

Lead gen is where broad match causes the most damage. The fundamental problem: Smart Bidding optimizes for the conversion event tracked, and most lead gen accounts track form fills. Broad match will aggressively find cheap form fills from queries the advertiser never intended to target. These form fills look like conversions in the data but produce leads that sales will disqualify in minutes. CPA stays stable while pipeline quality collapses.

The override condition for lead gen is exceptional tracking infrastructure. If closed-deal data feeds back to Google Ads within 30 days, if the account generates 50+ quality conversions per month (not just form fills), and if 6+ months of data has trained Smart Bidding on quality signals, broad match can work. Without all three conditions met simultaneously, broad match in lead gen is a systematic quality destroyer. In 80-90% of lead gen accounts, tight exact and phrase match with strong negatives outperforms broad match.

The diagnostic signal that broad match is failing in lead gen is stable CPA with declining lead quality. If sales reports more unqualified leads, more junk form fills, or lower close rates after broad match activation, the algorithm has found cheaper traffic that satisfies the conversion target but not the business objective. The fix is not more negatives; it is reverting to phrase/exact match until offline conversion import closes the quality gap.

### B2B SaaS

B2B SaaS is structurally incompatible with broad match in most cases. Conversion volumes are low (10-30 demo requests/month), sales cycles are long (60-120 days), and the intent overlap between enterprise buyers and consumer researchers is high. "Software" as a broad match term will match student researchers, job seekers, and consumer-grade tool shoppers alongside the enterprise evaluators the account targets.

The narrow exception: B2B SaaS with a freemium or self-serve signup model that generates 50+ signups per month, where signup-to-paid conversion data feeds back within 30 days. In this model, the conversion signal is frequent enough and clean enough for Smart Bidding to learn. But even here, broad match should be tested on a small keyword set (1-2 keywords) with aggressive negative management and a 4-week minimum Phase 1 evaluation.

The alternative to broad match for B2B SaaS accounts seeking growth is long-tail exact and phrase match expansion. Take existing high-performing keywords and expand into role-specific, use-case-specific, and competitor-comparison variants. "CRM for small business" expands to "CRM for real estate teams," "CRM for 10 person sales team," "Salesforce alternative for startups." This captures the query diversity broad match promises without ceding control of query quality.

### Local Services

Local services present moderate broad match potential with significant geographic risk. The keyword universe is small ("plumber [city]," "emergency HVAC repair," "roof replacement near me"), which means broad match expansion has limited upside. The geographic constraint is the primary risk: broad match will match queries from outside the service area even with geographic targeting, because Google's location targeting includes "people interested in" a location, not just people physically present.

For local services with sufficient volume (15+ conversions/month from a single metro area), broad match on the core service keyword (e.g., "plumber") with geographic and service-type negatives can find query variants the advertiser missed. But the CPCs in local services are often high ($15-50+ for emergency terms), which means each irrelevant click costs more and the margin for error is smaller. Extended Phase 1 evaluation (4 weeks minimum) with daily search term review is the minimum governance standard.

The more common and safer scaling path for local services is geographic expansion (adding new service area campaigns with existing exact/phrase keywords) rather than match type expansion. A plumber running exact match in Chicago who wants to grow should test Naperville and Evanston campaigns before testing broad match in Chicago.

### High-Value Verticals (Legal, Medical, Financial)

High-value verticals should almost never use broad match. CPCs of $50-$200+ per click mean that the learning period and waste exposure are measured in thousands of dollars, not hundreds. A 2-week Phase 1 test on a legal keyword at $150 CPC, with a $1,000/month test budget, produces approximately 6-7 clicks. That is not enough data for the algorithm to learn, not enough for the advertiser to evaluate, and $1,000 of exposure with near-zero signal.

The exception is exceptionally high-volume practices (personal injury firms in major metros generating 100+ qualified leads per month) with offline conversion tracking showing which leads became retained cases. Even then, the ramp should be extreme: a single broad match keyword, a 4-week Phase 1 with daily monitoring, and a kill switch at $500 total waste (roughly 3-4 irrelevant clicks at legal CPCs).

For most high-value accounts, the correct response to "should we use broad match?" is "no, and here is what to do instead." Expand existing exact match into long-tail variants. Mine search term reports for high-converting queries not yet added as keywords. Build new campaigns for adjacent practice areas or service types. These paths provide growth without the asymmetric risk that broad match introduces at high CPCs.

## Diagnostic Trees

**"Should this account use broad match?"** Run through the 7 gates in order. Gate 1: Is the business model compatible (ecommerce or subscription with clean conversion signal)? Gate 2: Does the account generate 15+ conversions/month (ecommerce) or 50+ (lead gen) consistently across 2-3 months? Gate 3: Is exact match at impression saturation (Search Lost IS rank above 30% or Lost IS budget above 20%)? Gate 4: Is Smart Bidding active and out of learning phase? Gate 5: Is there at least $1,000/month available for dedicated testing? Gate 6: Are 50+ negatives in place with regular review cadence? Gate 7: Is intent clarity high (low B2B/B2C overlap)? Any gate failure means do not proceed.

**"We turned on broad match and CPA spiked."** Check the timeline. If within the first 2 weeks, this is expected learning behavior. The algorithm tests query boundaries to calibrate. Apply the checkpoint criteria: CPA within 150% of exact match is passing, 150-200% is an extension trigger (add negatives, wait one more week), above 200% for 3+ consecutive days is a fail (pause immediately). If CPA is still elevated after 3 weeks with active negative management, the account likely does not have sufficient conversion data for the algorithm to learn, or the query space is too broad for the negative foundation.

**"Broad match is working but cannibalizing our exact match campaigns."** Check whether exact match impression share declined after broad match launched. If yes, the broad match campaign is winning auctions that exact match should own. Fix: add all exact match keywords as exact negatives in the broad match campaign. This forces query routing so that known high-value queries go to the exact match campaign (with proven performance and established Quality Scores) while broad match handles only incremental query discovery.

**"Our broad match tried before and failed."** Diagnose what specifically failed. If CPA was too high: was the Smart Bidding target realistic (within 20% of exact match performance)? Were negatives sufficient? Was conversion volume adequate? If traffic was irrelevant: was the negative foundation built before launch? Was the business model actually compatible? If conditions that caused the failure have not changed, retrying produces the same result. Only attempt again if specific prerequisites have been met that were missing before.

## Mental Models

**The 7-Gate Qualification Framework.** Business model, account maturity, exact match saturation, Smart Bidding status, budget adequacy, negative keyword foundation, intent clarity. Gates evaluate in order because each builds on the previous. A business model failure at Gate 1 makes every subsequent gate irrelevant. This prevents the common mistake of checking one favorable criterion (high conversion volume) and ignoring unfavorable ones (lead gen without offline tracking).

**The 4-Phase Ramp.** Phase 1 (Proof of Concept, Weeks 1-2): 1-2 keywords, 10-20% of exact match budget, permissive CPA targets. Phase 2 (Controlled Expansion, Weeks 3-4): 3-5 keywords, 30-40% budget, tightening targets. Phase 3 (Measured Growth, Weeks 5-8): 10-15 keywords, 50-75% budget, targets approaching exact match benchmarks. Phase 4 (Mature Optimization, Week 9+): full deployment, equal budget, ongoing weekly management. Each phase earns the next through checkpoint criteria. Skipping phases produces the failures that give broad match its bad reputation.

**The Kill Switch Protocol.** Predefined thresholds that trigger automatic pausing, agreed before launch, not debated during a crisis. Tier 1 (immediate pause within 24 hours): CPA exceeds 200% of target for 3+ days, zero conversions with $500+ spend, search terms more than 50% irrelevant, budget runaway at 3x daily target. Tier 2 (pause within 3-5 days if not improving): CPA exceeds 150% consistently, conversion volume not increasing despite spend increase. Tier 3 (reassess, do not pause): CPA within target but quality suffering, cannibalization detected, performance plateau. Kill switches prevent emotional decision-making during volatile learning periods.

**The Amplifier Model.** Broad match amplifies account quality. Strong account + broad match = amplified success. Weak account + broad match = amplified waste. This single mental model explains why Google's case studies (from well-managed, high-volume accounts) show broad match working brilliantly, while most practitioners' experience is failure. The case studies are accurate; they just omit the prerequisite quality that made the results possible.

## Thresholds and Benchmarks

**15 conversions/month (ecommerce) or 50/month (lead gen)** is the minimum account maturity for broad match. These thresholds come from the data requirements of Smart Bidding's machine learning model. Below these volumes, the algorithm cannot distinguish patterns from noise, which means broad match expansion is guided by random fluctuation rather than learned intelligence. Conversion count must be consistent across 2-3 months, not a one-time spike.

**50+ negative keywords with weekly or bi-weekly review** is the prerequisite negative keyword foundation. Below 50, the coverage of predictable waste patterns is insufficient for the query volume broad match generates. Without a review cadence, new waste patterns that broad match surfaces go unaddressed, and the negative list stagnates while the query space expands.

**$1,000/month minimum dedicated test budget** provides enough click volume (100-200+ clicks at typical CPCs) to evaluate broad match performance with statistical meaning. Below $500, the data is too thin to distinguish signal from noise within a 2-week phase. This budget must be dedicated to the broad match campaign, not shared with exact/phrase campaigns, to prevent contaminated performance data.

**70% search term relevance** is the Phase 1 passing threshold. If more than 30% of search terms triggered by broad match are irrelevant after 2 weeks of active negative management, the match type is too loose for this keyword or the negative foundation is insufficient. Below 50% relevance, the campaign should be paused regardless of CPA performance because the algorithm is learning from noisy data.

**150% of exact match CPA** is the Phase 1 tolerance threshold. Broad match traffic is inherently less targeted than exact match, so a CPA premium is expected and acceptable during learning. Beyond 150%, the premium suggests the algorithm has not found profitable query paths. Beyond 200% for 3+ consecutive days triggers an immediate kill switch.

**10-20% budget increments** during phase transitions prevent the campaign from entering auction dynamics so different from the learning baseline that performance destabilizes. Budget increases beyond 30% in a single change push the campaign into new competitive sets where the algorithm must re-learn, compounding the learning tax.

## Common Mistakes and WHY They Happen

**Activating broad match because Google recommended it.** Google's recommendation engine suggests broad match because it increases auction participation and Google's revenue. The recommendation does not evaluate whether the account meets qualification prerequisites. The recommendation appears authoritative because it comes from Google, and refusing it feels like ignoring the platform's own expertise. But Google optimizes for advertiser spending, not advertiser profitability. The 7-gate framework exists precisely because the platform's incentives diverge from the advertiser's interests.

**Testing broad match on too many keywords simultaneously.** The instinct is to "really test it" by adding broad match versions of 20+ keywords at once. This makes it impossible to identify which keywords perform well on broad match and which generate waste, because the data blends together. Starting with 1-2 proven performers in Phase 1 isolates performance and allows keyword-by-keyword evaluation. Each keyword earns broad match status individually, not as a batch.

**Not isolating broad match in a separate campaign.** Mixing broad match with exact and phrase match in the same campaign seems simpler and is Google's default recommendation. But it makes performance attribution impossible, allows broad match to cannibalize exact match impressions, and prevents differentiated bid targets by match type. The operational overhead of a separate campaign is trivial compared to the diagnostic clarity it provides.

**Launching broad match during Smart Bidding's learning phase.** Adding broad match while Smart Bidding is still calibrating compounds two sources of volatility. The bid algorithm is already making suboptimal decisions because it has not finished learning, and broad match is simultaneously expanding the query space beyond the algorithm's experience. Wait for Smart Bidding to stabilize (typically 2-4 weeks after activation), then begin the broad match qualification process.

**Declaring broad match "failed" during the learning period.** Managers activate broad match on Monday, see CPA spike 40% by Wednesday, and revert by Friday. The algorithm never had a chance to learn. The spike is the model testing auction boundaries, not a permanent performance state. Pre-agreed kill switch criteria (200% of target for 3+ consecutive days) prevent emotional decisions. Reverting after 3 days wastes the learning investment and teaches nothing about broad match's viability.

**Running broad match without adjusting bid targets.** Setting the same tCPA or tROAS for broad match and exact match campaigns ignores the inherent quality difference. Broad match traffic is less targeted, so the initial bid target should be 20-30% more permissive (higher tCPA or lower tROAS) to give the algorithm room to explore. As the campaign matures through phases, targets tighten toward exact match benchmarks. Starting with the same aggressive targets causes the algorithm to restrict spending to only the safest queries, defeating the purpose of broader matching.

## What Changes Over Time

Google is systematically reducing match type controls and pushing broad match as the default. Phrase match absorbed the old broad match modifier behavior. Exact match now matches close variants. The trajectory is toward a single match type where Google's algorithm handles all query expansion. Accounts should prepare for a future where broad match governance is not optional but is the primary advertiser control mechanism.

AI-driven query matching is becoming more contextual. Google's models incorporate the searcher's recent behavior, location patterns, and audience signals into match decisions. This means broad match in 2026 is meaningfully different from broad match in 2020. The quality of matching has improved, but the transparency has decreased. Advertisers have less visibility into why a query triggered a broad match keyword, making negative keyword management and search term monitoring more important, not less.

Performance Max operates on an implicit broad match model for its Search placements. PMax does not use traditional match types but applies similar query expansion logic to asset group themes. The governance principles for broad match (negative foundations, performance monitoring, kill switches) apply equally to PMax's Search behavior, even though the interface does not surface match type data.

Value-based bidding improves broad match outcomes by giving the algorithm a quality signal beyond binary conversion counting. When conversion values vary (ecommerce transaction values, lead scores, offline deal values), Target ROAS or Maximize Conversion Value on broad match can prioritize high-value queries and deprioritize low-value ones automatically. This partially addresses the lead quality problem in lead gen, but only for accounts that have invested in the conversion value infrastructure.

## Connected Domains

**Negative keywords** are the essential counterpart to broad match. The breadth of query expansion is bounded by the quality of negative keyword coverage. An account with 200 well-maintained negatives can run broad match confidently because the predictable waste patterns are already blocked. An account with 10 negatives will hemorrhage budget within days.

**Smart Bidding** is the required partner for broad match. The two technologies are designed to work together: broad match expands the query space, Smart Bidding modulates bids per-auction based on predicted conversion likelihood. Without Smart Bidding, broad match generates uncontrolled query expansion at uncontrolled prices. The readiness assessment for broad match is simultaneously an assessment of Smart Bidding health.

**Conversion tracking quality** determines what broad match optimizes toward. Clean ecommerce transaction data produces profitable broad match expansion. Form-fill-only tracking in lead gen produces volume-optimized junk. Offline conversion import bridges the gap for lead gen and B2B. The investment in tracking infrastructure must precede the decision to use broad match.

**Account structure** provides the isolation and segmentation that broad match governance requires. Dedicated broad match campaigns, separated from exact/phrase campaigns with cross-campaign negatives, are structural prerequisites. Accounts with monolithic campaign structures cannot implement proper broad match governance because they lack the segmentation points for isolation and independent performance evaluation.

**Keyword strategy** determines which keywords are candidates for broad match expansion. Only keywords proven in exact or phrase match should graduate to broad match. The keyword strategy's top performers are the starting point for Phase 1 testing, not speculative new keywords that have no performance baseline. Broad match on an unproven keyword tests two variables simultaneously (keyword viability and match type expansion), making it impossible to diagnose failure.
