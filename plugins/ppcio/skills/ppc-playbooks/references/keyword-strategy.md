# Keyword Strategy & Intent Knowledge Foundation

> Keywords are the atomic unit of paid search. Every dollar, every click, every conversion traces back to a keyword decision. Get the keywords right and everything downstream has a fighting chance. Get them wrong and no amount of bid optimization, ad copy testing, or landing page improvement will compensate.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

## First Principles

**A keyword without a conversion path is a donation to Google.** Before recommending or evaluating any keyword, trace the alignment chain: does the search query represent genuine commercial intent, does a suitable landing page exist that can convert paid traffic, and does the expected CPC justify the investment based on the business's unit economics? Adding keywords to an account with broken conversion paths makes things worse, not better. The problem is never "not enough keywords" when the existing keywords lack supporting pages.

**Intent is not a binary. It is a spectrum with at least six meaningful stages.** The oversimplified ToF/MoF/BoF funnel misses critical distinctions that determine bidding, budget allocation, and expected conversion rates. A searcher at "problem aware" (water stain on ceiling) behaves completely differently from someone "solution comparing" (tankless vs traditional water heater) or "ready to act" (get roofing quote). Treating all three as "top of funnel" produces identical bidding and budgeting for searches with wildly different economics. The six practical stages: Problem Aware (0.5-1.5% CVR), Solution Aware (1-2% CVR), Solution Comparing (2-4% CVR), Product Comparing (3-6% CVR), Product Researching (6-12% CVR), Ready to Act (8-15%+ CVR).

**The same keyword carries different intent depending on who searches it.** "CRM pricing" is Ready to Act for a software buyer, but Solution Comparing for an agency evaluating tools for clients. "Best plumber" is Solution Comparing in a metro area with hundreds of options, but effectively Ready to Act in a small town with three plumbers. Classification must start with business context inference before applying intent signals, because identical words carry fundamentally different commercial value depending on the searcher's situation.

**Brand queries and non-brand queries are different economic universes.** Brand traffic converts at 10-30x non-brand rates, carries fundamentally different CPC dynamics, and represents demand you already created through other channels. Any analysis that blends brand and non-brand metrics into a single number produces a fiction that flatters brand performance and hides non-brand problems. Separation is not optional. It is the prerequisite for accurate keyword assessment.

**Organic rankings create a measurable halo effect for paid search.** Pages ranking in the top 3 organically typically see 15-25% higher Quality Scores on the same keywords in Google Ads, which directly reduces CPCs. When both organic and paid results appear for the same query, total clicks increase by 25-50% compared to organic alone. This means GSC data is not just an SEO asset; it is a keyword intelligence source that reveals which terms already have conversion infrastructure.

## The Decision Landscape

**Discovery vs. Expansion.** Accounts with no existing Google Ads data need keyword strategy built from scratch using website content, competitor analysis, and search volume data. The entire output is directional. Accounts with existing search term reports have proven conversion data that should drive every expansion decision. Mixing these modes produces recommendations with false confidence: treating DataForSEO volume estimates with the same weight as actual conversion data.

**SEO Bridge opportunities.** When Google Search Console data exists alongside Google Ads data, three high-value sets emerge. Gap keywords appear in organic but not paid, representing proven demand with existing landing pages. Covered keywords appear in both, where organic Quality Score halo effects reduce CPCs. PPC-only keywords appear in ads but not organic, flagging missed SEO opportunities. The gap set is typically the highest-ROI expansion path because it combines proven search demand with landing page readiness.

**Match type selection is a risk-reward decision, not a best practice.** Exact match provides maximum control and intent precision at the cost of volume. Phrase match balances control with reach. Broad match maximizes discovery but requires Smart Bidding, strong negative keyword management, and sufficient conversion volume to function. The match type decision should follow from the account's maturity, budget, and negative keyword foundation, not from Google's recommendation engine, which defaults to broad match because it increases Google's revenue.

**Keyword volume alone is a vanity metric.** Ten thousand searches per month at 0.5% conversion rate and $8 CPC loses money for most businesses. The evaluation sequence is intent quality first, then landing page readiness, then unit economics, then volume. A 200 searches/month keyword with clear commercial intent, a dedicated landing page, and a profitable CPC outperforms a 10,000 searches/month keyword with ambiguous intent every time.

## Industry Branches

### Ecommerce

Ecommerce keyword strategy revolves around product specificity and purchase intent signals. SKU numbers, model names, and color/size specifications signal bottom-funnel intent with conversion rates often exceeding 10%. The mistake is over-investing in category-level head terms ("running shoes") where CPCs are highest and intent is weakest, while ignoring long-tail product variants ("Brooks Ghost 15 wide men's size 11") where competition is thin and buyers are ready.

Shopping campaigns and Performance Max handle much of ecommerce's keyword matching through product feed data, which means Search campaigns should target queries that Shopping misses: comparison searches ("Nike Pegasus vs Brooks Ghost"), use-case searches ("best running shoes for wide feet"), and brand-plus-intent combinations ("Nike Pegasus sale"). Broad match on generic product terms burns budget fast in ecommerce because the query space for consumer products is enormous. Campaign segmentation by product margin tier prevents the algorithm from investing equally in high-margin and low-margin product lines.

Seasonal keyword strategy is critical for ecommerce accounts with predictable demand curves. Building keyword coverage 4-6 weeks before peak season allows Quality Score to develop before high-volume periods arrive. Launching new keywords during Black Friday means paying premium CPCs with no Quality Score history, which is the most expensive possible timing.

### Lead Generation

Lead gen keyword strategy must obsess over intent quality because the gap between a form fill and a qualified lead is enormous. The keyword "emergency plumber near me" with 50 clicks and zero conversions is almost certainly a landing page problem, not a traffic problem. But "types of plumbing pipes" with 50 clicks and zero conversions is an intent problem: informational searchers will not convert regardless of page quality. Distinguishing between traffic problems and intent problems prevents the common mistake of negating keywords that should instead trigger landing page investigation.

Match type discipline matters more in lead gen than any other vertical. Broad match plus Smart Bidding optimizes for conversion volume (form fills), not conversion quality (qualified leads). In 80-90% of lead gen accounts, tight exact and phrase match with strong negatives outperforms broad match because it controls which queries reach the form. The exception is lead gen with robust offline conversion import feeding closed-deal data back to Google, where the algorithm can learn quality signals.

Budget allocation should follow intent stages strictly. Ready to Act keywords ("hire accountant," "get quote") receive budget first and should never be budget-limited. Product Comparing and Solution Comparing keywords receive budget only after bottom-funnel is fully funded. Problem Aware and Solution Aware keywords are typically Display or content plays, not Search investments, for lead gen accounts under $10K/month.

### B2B SaaS

B2B SaaS keyword strategy operates under low volume and long attribution lag. Most accounts generate 10-30 demo requests per month, which means every keyword decision carries disproportionate weight. The practical consequence: a B2B SaaS account should target 30-50 high-confidence keywords rather than 500 speculative ones, because each keyword needs enough traffic to prove or disprove its value within a reasonable timeframe.

Intent classification shifts in B2B contexts. "Demo" and "trial" are transactional (Ready to Act), not investigational. "RFP" and "procurement" signal active evaluation cycles worth pursuing aggressively. "Enterprise" as a modifier indicates higher deal value and longer sales cycles but does not change the intent stage. Role-specific modifiers ("CFO," "CTO," "procurement") signal enterprise buying committees and carry premium value. First-touch attribution will systematically undervalue early-stage keywords because the click-to-close lag stretches 60-120 days, which means 30-day conversion windows show zero conversions for keywords that actually generate pipeline.

Competitor keyword strategy in B2B SaaS centers on "[competitor] alternative" and "switch from [competitor]" queries. These represent actively dissatisfied customers with high purchase intent. Bidding on competitor brand names directly is legal but invites retaliation and typically produces high CPCs with low conversion rates unless the landing page directly addresses why switchers should choose you.

### Local Services

Local service keyword strategy is constrained by geographic boundaries and driven by urgency signals. "Emergency plumber near me" and "HVAC repair [city]" carry the highest intent because the searcher needs someone now, in their area. The keyword universe is small: most local service businesses operate profitably on 20-50 core keywords with geographic modifiers. Attempting to scale beyond this natural keyword ceiling through broad match or informational terms wastes budget on traffic that will not convert locally.

Phone call tracking is essential for local keyword evaluation because many conversions happen by call, not form. A keyword showing zero form conversions but generating 60-second-plus phone calls is performing well. Without call tracking, the keyword appears to be waste when it is actually producing business. Minimum call duration filtering (60-90 seconds) separates real inquiries from wrong numbers and pocket dials.

"Near me" and city-name modifiers are bottom-funnel signals for local businesses, unlike national accounts where they indicate local search behavior without purchase intent. Ad scheduling also intersects with keyword strategy: emergency-related keywords should run 24/7 while routine service keywords can pause during off-hours when the business cannot answer calls.

### High-Value Verticals (Legal, Medical, Financial)

High-value verticals face CPCs of $50-$200+ per click, which compresses the margin for error to near zero. A single irrelevant keyword burning $3,000/month on informational traffic is not a minor inefficiency; it is a material budget drain. Keyword strategy in these verticals demands exact match on high-intent terms with manual bids calculated from target CAC, conversion rates, and case values.

Practice area specificity is the primary structural concern. A personal injury firm bidding on "lawyer" or even "personal injury lawyer" faces maximum competition. "Motorcycle accident lawyer [city]" or "medical malpractice attorney free consultation" narrows the field, reduces CPCs, and improves conversion rates because the ad and landing page can match the specific situation. Long-tail expansion from existing high performers is the safest growth path: a keyword converting at 8% likely has related 4-5 word variants converting at even higher rates with lower CPCs.

Google Ads policy requirements must be flagged for restricted industries. Healthcare keywords trigger certification requirements. Financial product keywords require disclaimers. Legal advertising rules vary by jurisdiction. Launching campaigns without addressing these requirements risks ad disapprovals that waste the entire setup investment.

## Diagnostic Trees

**"We have keywords but no conversions."** Check the alignment chain in order. First: are the keywords commercially relevant, or are they informational queries that will never convert? Second: do landing pages exist for each keyword theme with clear CTAs and forms? Third: is conversion tracking actually firing? A "no conversions" problem is almost always a landing page or tracking problem, not a keyword problem, when the keywords have clear commercial intent.

**"We don't know which keywords to add next."** Start with what is already working. Pull the search term report and identify high-performing queries not yet added as explicit keywords. These are proven converters hiding behind broad or phrase match. Promoting them to exact match gives bid control and Quality Score benefits. Then map current keywords against the business's full product/service offering to find themes with zero coverage.

**"Our keywords are cannibalizing each other."** When the same search term triggers ads from different ad groups or campaigns, Google picks the winner by Ad Rank, not by relevance. The wrong ad shows, CTR drops, CPCs rise, and Smart Bidding learns from noisy signals. Fix with the One Search Term = One Canonical Owner principle: assign ownership based on intent fit, then landing page quality, then keyword precision, then historical performance (as tiebreaker only). Enforce ownership through exact-match negatives in all non-owner ad groups. Typical accounts have 15-40% of search terms appearing in multiple ad groups.

**"Competitors are bidding on keywords we are not."** Validate every competitor keyword against the business's actual business model and unit economics before acting. Competitors make bad decisions too. Filter competitor keywords for commercial intent, cross-reference against existing landing pages, and only pursue keywords where a conversion path exists. A competitor bidding on informational terms does not mean you should follow them into unprofitable territory.

## Mental Models

**The Alignment Chain.** Search Term > Keyword > Ad > Landing Page > Offer. Every link must reinforce the same intent. When any link breaks, throwing more keywords at the problem compounds the waste. This model prevents the instinct to "add more keywords" when the real problem is that existing keywords lack supporting infrastructure.

**The Intent Ladder.** Budget flows from the bottom up: Ready to Act first, then Product Comparing, then Solution Comparing, then earlier stages only if budget allows after bottom-funnel is fully funded. This model prevents the common mistake of spreading budget evenly across intent stages, which starves high-converting keywords to fund low-converting discovery.

**The Coverage vs. Depth Trade-off.** 50 well-chosen keywords with strong landing pages outperform 500 generic keywords with weak pages. Depth of support (dedicated landing pages, tailored ad copy, appropriate bids) matters more than breadth of keyword coverage. This model breaks down only at enterprise scale with dedicated landing page teams who can build pages as fast as keywords are identified.

**The Money-on-the-Table Estimate.** For gap keywords with CPC data, apply estimated ad CTR by intent type: transactional at 6-8%, commercial investigation at 4-5%, informational at 2-3%. Always present as a range with explicit assumptions. This provides the business case for keyword expansion without overstating certainty. The estimate becomes more accurate with actual conversion rate data from existing campaigns.

## Thresholds and Benchmarks

**5-15 keywords per ad group** is the structural sweet spot. Below 5, the ad group lacks enough data for Smart Bidding. Above 15, ad relevance suffers because a single ad cannot match the intent diversity. This comes from the trade-off between data aggregation and relevance: too few keywords per group fragments data, too many dilutes message match.

**Stage 6 (Ready to Act) should represent 25-50% of keyword budget** depending on business model. Local services skew higher (40-50%) because the keyword universe is small and urgency-driven. SaaS skews lower (20-25%) because the funnel is longer. Accounts with less than 20% of budget on Ready to Act keywords are systematically under-investing in their highest-converting traffic.

**70% relevant search terms** is the minimum acceptable threshold for any campaign. Below 70%, the match type strategy is too loose or the negative keyword foundation is insufficient. Below 50%, the campaign is functionally broken regardless of other optimizations.

**10+ clicks** provides directional keyword performance data. 30 clicks with corroborating signals (intent match, positive Quality Score) supports moderate-confidence decisions. 50+ clicks provides high-confidence data for keyword-level actions. For high-CPC verticals ($10+), also classify if spend exceeds 3x target CPA regardless of click count.

**15-25% Quality Score improvement** is typical for keywords where the business has strong organic rankings on the same terms. This halo effect from organic authority directly reduces CPCs for paid keywords, making SEO Bridge keywords among the most cost-effective expansion paths.

## Common Mistakes and WHY They Happen

**Adding keywords without checking landing page readiness.** The instinct is to "get coverage" first and worry about landing pages later. This happens because keyword lists feel like progress, while landing page audits feel like obstacles. But launching ads to a page without a clear CTA, without a form, or with a 6-second mobile load time converts at near zero. The money spent during the "fix it later" phase is permanently lost.

**Treating competitor keyword lists as strategy.** Competitive keyword tools show what competitors bid on, which feels like validated opportunity. But competitors make bad decisions too. A competitor bidding on informational terms, or targeting keywords with no landing page support, is wasting money you should not replicate. Every competitor keyword needs independent validation against your own business model and unit economics.

**Over-investing in head terms.** High-volume keywords feel important because the numbers are large. "Running shoes" at 100,000 searches/month is intoxicating compared to "Brooks Ghost 15 wide size 11" at 200 searches/month. But the head term has diffuse intent, maximum competition, and CPC premiums. The long-tail variant has buyer-ready intent, thin competition, and profitable CPCs. This mistake persists because volume feels like opportunity when it is often just expensive noise.

**Running broad match as a discovery tool in new accounts.** Google positions broad match as the way to "find new queries." Without Smart Bidding, sufficient conversion volume, and a robust negative keyword strategy, broad match in a new account generates irrelevant traffic that wastes budget and corrupts early performance data. Discovery in new accounts should come from DataForSEO research, search term reports from phrase match, and organic search data, not from handing Google a blank check.

**Ignoring cannibalization until performance degrades.** When multiple ad groups compete for the same search term, the wrong ad shows and both groups underperform. Account managers often do not investigate cannibalization until CPCs rise or CTR drops, by which point months of budget have been misallocated. Proactive conflict detection every 2-4 weeks, especially after adding new keywords or changing match types, prevents this silent waste.

## What Changes Over Time

Google continues to push broad match as the default match type, paired with Smart Bidding. The stated rationale is that the algorithm handles query expansion better than manual keyword selection. In practice, this benefits Google's revenue because broader matching generates more auction participation. The strategic response is governance: if adopting broad match, pair it with aggressive negative keyword management, isolated campaign testing, and explicit kill switch criteria. Phrase and exact match remain viable and often superior for accounts below 50 conversions/month.

Search term visibility continues to decline. Google hides 30-50% of search terms in most accounts, and the percentage is increasing. This makes proactive keyword strategy more important than reactive search term mining, because you cannot optimize what you cannot see. Building keyword lists from business context, competitor analysis, and organic data reduces dependence on search term report visibility.

Performance Max absorbs Search keyword matching into its automated system. For accounts running both Search and PMax, keyword strategy must account for PMax cannibalizing high-performing search queries. Adding exact-match negatives of top search keywords to PMax, or using brand exclusions, prevents the overlap. The trend suggests that keyword-level control will continue to erode, making the quality of remaining manual keyword decisions more important, not less.

Intent classification is becoming more nuanced as Google's auction incorporates more contextual signals. The same keyword can trigger different ad ranks depending on the searcher's recent behavior, location, device, and time of day. This means static keyword-level bids are increasingly outmatched by algorithmic bidding that evaluates context per auction. The response is not to abandon keyword strategy but to pair strong keyword selection with Smart Bidding once volume thresholds are met.

## Connected Domains

**Negative keywords** are the defensive complement to keyword strategy. Every keyword expansion increases the surface area for irrelevant matching. The more aggressive the match type, the more critical the negative keyword foundation. An account adding 50 new phrase match keywords without updating its negative keyword lists will see waste increase proportionally.

**Quality Score** is directly influenced by keyword-ad-landing page alignment. Keywords in tightly themed ad groups with matching ad copy and dedicated landing pages earn higher Quality Scores, reducing CPCs by 20-50%. Keyword strategy and Quality Score optimization are not separate workstreams; they are two views of the same alignment problem.

**Bidding strategy** determines what you pay for the keywords you select. Broad match paired with Smart Bidding is a specific combination where the algorithm manages expanded query matching through bid modulation. Exact match paired with Manual CPC gives human control over both keyword selection and price. These are coupled decisions that should be made together.

**Account structure** determines how keyword data aggregates for bid optimization. Fragmented structures with too many campaigns dilute conversion data below Smart Bidding thresholds. Consolidated structures with well-themed ad groups pool data while maintaining relevance. Structure is the invisible lever that makes keyword strategy either powerful or wasteful.

**Landing page readiness** is the ultimate constraint on keyword strategy. The best keyword in the world, with perfect intent and profitable CPC, generates zero revenue if it points to a page that does not convert. Keyword expansion and landing page development must be synchronized, or the expansion just adds cost without adding revenue.
