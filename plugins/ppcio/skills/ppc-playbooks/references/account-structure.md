# Account Structure Knowledge Foundation

> Account structure is the invisible architecture that determines how Google's algorithms learn, how budget flows between priorities, and whether an account can scale without being rebuilt. Get structure right and everything downstream -- bidding, creative testing, reporting -- works with less friction. Get it wrong and no amount of optimization can compensate for a foundation that fights itself.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

## First Principles

**Campaigns are budget decisions, not keyword groupings.** The only reason to create a separate campaign is to control budget independently. If two sets of keywords share the same goal, the same budget priority, and the same target metrics, they belong in the same campaign. This is counterintuitive because Google Ads' interface encourages campaign creation, and many training resources teach structure by keyword theme. But every campaign separation splits conversion data, creates management overhead, and forces independent bidding optimization. Separation must be earned by a clear business justification: different conversion goals, different ROAS targets, different geographies with distinct economics, or the need to protect a high-value keyword from being budget-starved by everything else.

**Ad groups are relevance decisions.** Within a campaign, ad groups exist to match search intent to ad copy to landing page. The test is simple: do these keywords share the same landing page, the same intent, and can they be served by the same ad copy? If any answer is no, they need separate ad groups. This is the alignment chain at the structural level: keyword intent, ad message, and landing page offer must form a coherent path, and ad group boundaries enforce that coherence.

**Consolidation is the default; complexity must justify itself.** Over-segmented accounts are far more common than under-segmented ones because splitting feels like optimization while consolidation feels like giving up control. In practice, splitting starves Smart Bidding of data, creates campaigns that never exit learning, and multiplies the number of things a manager must monitor without improving any individual decision. Google's own recommendation of 30+ conversions per month per campaign for Smart Bidding is a hard constraint from how machine learning generalizes from training examples. An account with 20 campaigns generating 3 conversions each will always underperform an account with 4 campaigns generating 15 each, assuming the groupings are logically sound.

**Structure must scale without rebuilding.** A well-designed account at $3,000/month should accommodate a 3x budget increase by adding budget and keywords to existing campaigns, not by tearing everything down and starting over. If doubling the budget requires restructuring, the original design was wrong. This means building with headroom: naming conventions that accommodate growth, campaign boundaries drawn at durable business lines rather than temporary keyword clusters, and enough consolidation that each campaign has room to absorb new ad groups.

**Naming is a future-you decision.** Six months from now, anyone looking at the account should be able to tell what every campaign does from its name alone. "Campaign 1" or "Test - Copy" signals an account built without a plan. A consistent naming convention -- typically [Type] - [Descriptor] - [Landing Page] -- serves as living documentation. It also prevents duplicate campaign creation, speeds up reporting, and makes cross-account management possible when an agency or team manages multiple accounts.

## The Decision Landscape

**When to separate campaigns.** Separation is required when you need independent budget control: brand versus non-brand (prevents brand terms from absorbing growth budget), different conversion goals within the same account (lead gen campaigns targeting demos alongside ecommerce transactions), geographic regions with materially different targets (UK operations at 50 GBP CPA versus US at $75 CPA), and product categories with significantly different margins (more than 30% ROAS difference). The Kingmaker Rule applies when a single keyword drives more than 20% of account spend or exceeds $5,000/month. That keyword deserves its own campaign with dedicated budget so it never becomes budget-limited by lower-priority traffic.

**When NOT to separate campaigns.** Match type separation is almost always wrong. Smart Bidding needs the combined signal from all match types to learn effectively. Separating exact match from phrase match from broad match triples your campaign count while cutting each campaign's data pool to a third. The only exception is accounts spending above $50,000/month with enough volume to sustain split learning. Device-type separation (mobile versus desktop) is equally wasteful because device bid adjustments accomplish the same thing without fragmenting data. Minor keyword theme differences should be handled with ad groups, not campaigns. And small audience differences belong in observation mode, not separate campaign targets.

**Campaign count thresholds.** Accounts under $10,000/month should have fewer than 10 campaigns. This is a practical constraint derived from Smart Bidding data requirements: $10,000 spread across 15 campaigns averages $667 per campaign, which at a $50 CPA generates roughly 13 conversions per campaign per month, well below the 30-conversion threshold where automated bidding can learn. Very small budgets under $1,000/month should run 1-2 campaigns maximum: a brand campaign and a single non-brand campaign, consolidated aggressively for data volume. Accounts above $50,000/month can justify more granular segmentation because each campaign retains enough volume to feed the algorithm.

**Ad group sizing.** Each ad group should contain 5-15 keywords (up to 20 when mixing match types on the same root terms). Below 5 keywords, the ad group is probably over-segmented and will generate insufficient impression volume. Above 20, keyword intent is likely mixed enough that some searches will trigger irrelevant ad copy. The SKAG model (Single Keyword Ad Groups) is obsolete. It fragments data, starves Smart Bidding, and creates massive management overhead. If more than 50% of ad groups contain fewer than 5 keywords, the account is over-segmented and consolidation will improve performance immediately. The exception: keywords spending more than $2,000/month individually may warrant dedicated ad groups of 3-5 close variants for tighter control and custom ad copy.

## Industry Branches

### Ecommerce

Ecommerce structure revolves around product categories and margin tiers. The standard architecture separates brand search (protecting branded queries at high impression share), category-level search campaigns (non-brand product searches), Shopping or Performance Max (product feed-driven campaigns), remarketing (cart abandoners and past customers), and a DSA/discovery campaign for long-tail expansion. Budget allocation typically follows 10% brand, 30-40% category search, 30-40% Shopping/PMax, 10-15% remarketing, and 5-10% DSA/discovery.

The critical structural decision in ecommerce is how to segment Shopping campaigns. Product-group segmentation by margin tier prevents the algorithm from over-investing in low-margin products that look good on ROAS but destroy profit. Custom labels (margin tier, performance tier, seasonal flag, price bucket) enable this segmentation inside Google Ads without creating excessive campaign count. A common mistake is creating a separate Shopping campaign per product category, which fragments data. Better: one Shopping campaign with listing groups split by margin tier, controlled through custom label bidding.

### Lead Generation

Lead gen structure should follow the search intent ladder: high-intent bottom-of-funnel keywords (buy, hire, quote, demo) in one campaign receiving the largest budget share (40-50%), commercial investigation keywords (best, versus, reviews) in a second campaign at a higher CPA target (25-30%), brand terms in their own campaign at target impression share (10%), competitor terms in a controlled campaign with manual or max-clicks capped bidding (5-10%), and remarketing for re-engagement (10%). This structure works because each intent tier has genuinely different conversion rates and CPA expectations.

The structural trap in lead gen is separating by keyword theme before separating by intent. "SEO services" and "PPC services" campaigns might feel logical, but if both target high-intent keywords at the same CPA, they belong in the same campaign with different ad groups. Separating them doubles the number of campaigns competing for the same small conversion pool. Intent segmentation beats topic segmentation for lead gen because intent determines bid strategy and budget priority, while topic only determines ad copy relevance -- which is what ad groups handle.

### B2B SaaS

B2B SaaS accounts typically need very tight structures because conversion volumes are low. The standard architecture is brand (10%), core product keywords segmented by solution category (35-45%), competitor campaigns bidding on alternative/versus terms (10-15%), use-case campaigns targeting solution-plus-industry or solution-plus-role queries (20-25%), and remarketing for demo page visitors and trial dropoffs (10%). The temptation to over-segment by feature, integration, or persona should be resisted until the account generates enough volume to support it, which for most B2B SaaS means north of $20,000/month.

Portfolio bidding strategies become relevant in B2B SaaS because individual campaigns rarely hit the 30-conversion Smart Bidding threshold. Pooling 3-4 non-brand campaigns with similar CPAs into a single portfolio strategy gives the algorithm 40-60 conversions to learn from instead of 10-15 per campaign. This only works when the campaigns share similar conversion economics. A campaign targeting enterprise decision-makers at $200 CPA should never share a portfolio with a campaign targeting small-business self-serve signups at $40 CPA.

### Local Services

Local service businesses need the simplest structures because budgets are small and geographic reach is limited. A single-location plumber spending $3,000/month should run 3 campaigns maximum: brand, primary service types (plumbing, drain cleaning, water heater), and emergency (if applicable). Multi-location businesses face the question of geographic separation. Separate campaigns per location only when budgets differ materially (more than 30% difference) or when service offerings vary by location. Same budget, same services across locations: single campaign with geographic targeting. Different languages or currencies always require separate campaigns.

The structural mistake unique to local services is creating a campaign for every service variant. "Kitchen plumbing," "bathroom plumbing," "emergency plumbing," and "drain cleaning" as four separate campaigns for a $2,000/month account produces four campaigns averaging $500/month each, generating maybe 5-8 conversions per campaign. None will ever feed Smart Bidding properly. Better: one "Services" campaign with ad groups for each service type, letting the algorithm optimize across the full $2,000 pool.

### High-Value Verticals (Legal, Medical, Financial)

High-CPC verticals need structures that minimize the cost of mistakes. At $100-200 per click, a poorly structured campaign bleeds thousands in days. The standard approach is fewer, more tightly controlled campaigns with aggressive negative keyword architecture from day one. Brand separation is non-negotiable. Non-brand segmentation should follow practice area or specialty (personal injury versus criminal defense, or cardiology versus dermatology), because each has dramatically different CPAs and conversion dynamics.

The structural insight for high-value verticals is that negative keyword architecture IS the structure. Four layers of negatives -- account-level shared list for universal waste, brand exclusion list applied to all non-brand campaigns, campaign-level cross-campaign sculpting, and ad group-level intent sculpting -- prevent the budget leaks that at $150/click turn into catastrophic losses overnight. Building this architecture before launching any campaign is not optional.

## Diagnostic Trees

**IF more than 50% of campaigns have fewer than 15 conversions per month:** The account is over-segmented. Identify campaigns with overlapping intent or similar CPAs and consolidate. Each merge should roughly double the conversion pool for the surviving campaign. Prioritize consolidation of campaigns on the same bid strategy with similar targets.

**IF a single campaign drives more than 70% of conversions:** The account has concentration risk. If that campaign breaks (budget exhaustion, tracking failure, policy violation), the entire account collapses. Evaluate whether the dominant campaign can be split into 2-3 campaigns along natural business lines (different services, different geographies) to distribute risk while maintaining data density per campaign.

**IF brand and non-brand keywords exist in the same campaign:** This is the number-one structural defect. Brand traffic converts at 10-30x the rate of non-brand, producing a blended CPA that looks acceptable while non-brand waste hides behind brand efficiency. The fix is immediate: separate into dedicated brand and non-brand campaigns, add brand terms as exact-match negatives to the non-brand campaign, and give brand its own budget at target impression share.

**IF campaign names include "Campaign 1," "Test - Copy," or "New Campaign":** The account was built without a plan. Before optimizing anything, rename every campaign using a consistent [Type] - [Descriptor] - [URL] convention. This is not cosmetic. Inconsistent naming signals multiple managers working without a shared blueprint, which almost always means duplicated keyword targeting, missing negatives, and structural incoherence.

**IF the account has more than 15 active campaigns at under $10,000/month spend:** Check whether campaigns can be consolidated without losing budget control. Map each campaign's goal, CPA target, and conversion volume. Campaigns sharing the same goal and target within 20% are consolidation candidates. The target state is fewer campaigns, each with enough data for Smart Bidding, and enough budget headroom that winners are never capped.

## Mental Models

**The Budget Decision Test.** Before creating any new campaign, ask: does this group of keywords need its own budget lever? If you would set the same daily budget, the same bid strategy, and the same target CPA/ROAS as an existing campaign, it belongs in that existing campaign as a new ad group. This single question prevents 80% of structural bloat. It breaks down when a keyword group needs a different target but shares a landing page with an existing campaign, in which case campaign separation is correct even though relevance logic says consolidation.

**The Data Pool Model.** Think of each campaign as a pool collecting conversion data. Smart Bidding dips into this pool to learn patterns. A shallow pool (fewer than 30 conversions) produces unreliable patterns. A deep pool (50-100+) enables the algorithm to identify which combinations of device, location, time, and audience produce results. Every time you split a campaign, you drain half the water from one pool into a new one. Both pools become shallower. Merge campaigns and both pools combine into a deeper, more informative resource. This model breaks down when the campaigns being merged have fundamentally different conversion dynamics, in which case pooling introduces noise rather than signal.

**The Alignment Chain.** Search term, keyword, ad copy, landing page, offer. At every boundary in the account structure, these five elements should be in coherent alignment. Ad groups enforce alignment between keywords and ads. Campaigns enforce alignment between budget and business priority. When a structural element breaks alignment -- an ad group serving car insurance ads for home insurance keywords, a campaign combining $20 CPA brand traffic with $80 CPA non-brand -- the structure itself is the source of inefficiency.

**The Scaling Spine.** Imagine the account at 3x current budget. Does the structure still make sense? If the answer is "we would need to rebuild," the current structure lacks a scaling spine. Good structure has natural expansion points: new ad groups slot into existing campaigns, new product lines become new campaigns following the same naming convention, and geographic expansion replicates an existing campaign template. The spine is the set of campaigns that represent durable business lines (brand, high-intent, commercial, remarketing), not transient keyword clusters.

**The Negative Keyword Blueprint.** Structure is not just what you target; it is what you exclude at each level. Account-level negatives block universal waste (jobs, salary, free, DIY, login). Brand exclusion lists on non-brand campaigns prevent cannibalization. Campaign-level negatives sculpt traffic between campaigns. Ad-group-level negatives route queries to the most relevant ad group. This layered exclusion architecture is as much a structural decision as campaign creation itself. Without it, campaigns compete against each other, brand steals non-brand budget, and informational traffic leaks into commercial campaigns.

## Thresholds and Benchmarks

**30 conversions/month per campaign** is the minimum for Target CPA and Maximize Conversions. This comes from Google's documentation and reflects the statistical requirement for the bidding model to distinguish patterns from noise. Below 30, consider consolidation, a less data-hungry strategy (Maximize Conversions uncapped), or micro-conversions as a supplemental signal.

**50 conversions/month per campaign** is the minimum for Target ROAS and Maximize Conversion Value. ROAS optimization requires the algorithm to learn which conversions are high-value versus low-value, demanding a larger training set than binary conversion counting.

**15 conversions/month per campaign** is the bare minimum for Maximize Conversions with no target. Below this, even uncapped automation struggles. Manual CPC is the appropriate strategy until volume builds.

**1,000 impressions/month per ad group** is the minimum for statistically meaningful performance data. Ad groups below this threshold should be consolidated into broader groups or paused. Insufficient impression volume means the ad group is too narrow to generate actionable data.

**10 campaigns maximum for accounts under $10,000/month.** This derives from dividing budget by campaign count and checking whether each campaign can generate enough conversions for its bid strategy. More campaigns at low budget means less data per campaign.

**2-4 campaigns maximum for accounts under $3,000/month.** At this budget, consolidation is survival. Brand plus one non-brand campaign, maybe a remarketing campaign. Anything more fragments the data beyond usefulness.

**Greater than 20% CPA variance within a campaign** signals ad groups with mismatched economics that may need campaign separation. A campaign averaging $45 CPA might hide ad groups at $25 and $90. The $90 ad groups might belong in a different campaign with a higher target, or they might need structural fixes (better landing pages, tighter keywords) before splitting them off.

## Common Mistakes and WHY They Happen

**Separating campaigns by match type.** This was standard practice before Smart Bidding, when exact match campaigns had higher bids and phrase/broad had lower bids. With automated bidding, the algorithm sets bids per auction anyway. Match type separation cuts each campaign's data pool by two-thirds for zero benefit. It persists because older training materials and muscle memory perpetuate the practice.

**Creating SKAGs (Single Keyword Ad Groups).** SKAGs emerged when Quality Score was the dominant optimization lever and each keyword needed perfectly matched ad copy. In 2024+, RSAs dynamically match ad copy to queries, Smart Bidding adjusts bids per auction, and close variants render exact-match less exact. SKAGs create thousands of data-starved ad groups, make account management a full-time job, and prevent Smart Bidding from learning. They persist because they feel precise and controllable, two qualities managers value even when they no longer produce results.

**Restructuring during a performance crisis.** When CPA spikes or conversions drop, the instinct is to rebuild the account. But restructuring resets every campaign's learning period simultaneously, guaranteeing 2-4 weeks of degraded performance on top of whatever caused the original crisis. The correct sequence: diagnose the root cause (tracking break? competitor entry? landing page change?), fix the cause, then evaluate whether the structure contributed. Restructuring should be planned and staged, not reactive.

**Over-segmenting to "see more data."** Managers create separate campaigns for each service, location, or audience because they want granular reporting. But granular campaigns with thin data produce noisy, unreliable metrics. Better: consolidated campaigns with segmented ad groups and custom labels, using dimensions and segments in reporting to see the same granularity without fragmenting the bidding data.

**Ignoring negative keyword architecture at launch.** Negatives are treated as a reactive cleanup task ("we will add negatives when we see bad search terms") rather than a structural design decision. By the time bad search terms show up in the report, the damage is done. An account launched without four layers of negative keyword architecture (universal waste, brand exclusion, cross-campaign sculpting, intent sculpting) will waste 10-20% of its first month's budget on traffic it should never have entered auctions for.

## What Changes Over Time

Google's push toward automation and consolidation continues. Broad match is increasingly the default, Smart Bidding is increasingly mandatory, and Performance Max absorbs campaign types. The structural implication: accounts that over-segment will become harder to manage as Google removes the manual controls that made granular structures viable.

Performance Max introduces a new structural question: how does PMax interact with Search campaigns? Brand exclusions in PMax are critical to prevent cannibalization. PMax should supplement Search, not replace it, and structure must account for the overlap. If PMax is running alongside Search, monitor Search impression share weekly. If it drops after PMax launch without a corresponding increase in total account conversions, PMax is redistributing, not growing.

Campaign-level conversion goals (available since 2023) allow different campaigns to optimize for different conversion actions within the same account. This structural capability means a single account can run a lead gen campaign optimizing for phone calls alongside an ecommerce campaign optimizing for purchases, without one distorting the other's bidding. But it also means conversion action assignment is now a structural decision that must be deliberately managed.

The trend toward fewer, larger campaigns will accelerate. Google's algorithm improvements make it better at handling diverse keyword sets within a single campaign, reducing the need for manual segmentation. Accounts built today should err on the side of consolidation, with the expectation that future Google Ads features will reward broader campaigns with better data utilization.

## Connected Domains

**Bidding strategy** is downstream of structure. The number of conversions flowing to each campaign determines which bid strategies are viable. Restructuring to consolidate campaigns often unlocks automation that was previously impossible due to data poverty. Evaluate structure and bidding strategy together, never independently.

**Negative keywords** are a structural element, not a maintenance task. The four-layer architecture (universal waste, brand exclusion, cross-campaign sculpting, ad-group intent sculpting) determines traffic flow as much as campaign boundaries do. A well-structured account with poor negatives still leaks budget. Negative keyword strategy should be designed alongside campaign structure, not added after launch.

**Budget pacing** interacts directly with structure because each campaign has its own daily budget. Too many campaigns means each gets a thin slice. A campaign that is budget-limited every day at $20/day while generating a $30 CPA has a structural problem: it deserves more budget, which requires either increasing total spend or reallocating from lower-performing campaigns. Pacing decisions are structural decisions in disguise.

**Performance Max** complicates traditional structure because it operates across all Google channels with minimal transparency. The structural decision is how much budget to allocate to PMax versus Search, how to prevent PMax from cannibalizing branded Search traffic, and whether PMax asset groups are segmented by product theme or audience. PMax governance is now a core structural concern.

**Landing page architecture** should mirror campaign structure. Each ad group should point to a landing page that matches its keyword intent. If the website lacks dedicated landing pages for major keyword themes, the account structure must accommodate that constraint -- either by consolidating ad groups that share a landing page, or by flagging the landing page gap as a prerequisite before launching those keyword themes.
