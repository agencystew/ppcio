# Negative Keywords Knowledge Foundation

> Negative keywords are the immune system of a Google Ads account. They do not generate revenue directly, but without them, every dollar of ad spend is exposed to irrelevant traffic that will never convert. The cost of blocking a converting term by mistake (lost revenue compounding every week) far exceeds tolerating a few dollars of waste. Precision beats aggression.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

## First Principles

**Adding negatives is irreversible in practice.** Technically you can remove a negative keyword, but wrongly blocked terms silently destroy revenue for as long as they remain in place, and no alert will tell you. A profitable search term that gets negated disappears from your reports. You do not see the revenue you are no longer earning. This asymmetry means the burden of proof for negating should be high: multiple corroborating signals, sufficient click volume, and explicit separation between "definitely block" and "investigate further."

**Negatives are a classification problem, not a strategy problem.** Get the classification right and the strategy follows. Every search term belongs in one of five buckets: KEEP (profitable, converting), MONITOR (converting but unprofitable or ambiguous), NEGATE (irrelevant with high confidence), HUMAN REVIEW (conflicting signals), or SKIP (insufficient data). The entire discipline reduces to sorting terms into these buckets with appropriate confidence levels, then acting on the high-confidence negations while holding ambiguous cases for more data.

**Context determines whether a term is waste.** "Free" is waste for premium SaaS and gold for freemium products. "Cheap" is waste for luxury brands and a buying signal for discount ecommerce. "Repair" is waste for a product seller and revenue for a service provider. No universal waste list applies to every business. Every negative keyword recommendation must be validated against the specific business model, product offering, and campaign strategy before implementation.

**Google hides 30-50% of search terms.** The visible search term report represents only a portion of actual query matching. Always calculate and state the visible-to-total spend ratio. If visible spend is less than 60% of total campaign spend, overall confidence in any search term analysis should be reduced, and the likely waste hiding in unseen terms should be acknowledged.

**Negatives are band-aids for systemic problems.** Before recommending negatives, check whether the real fix lies elsewhere. A high-volume commercial term with zero conversions ("emergency plumber near me" with 50 clicks) is a landing page problem, not a traffic problem. Services listed on the website but not offered is a listing mismatch. Geographic waste from clicks outside the service area is a geo-targeting settings issue. Name the root cause; negatives should supplement the structural fix, not replace it.

**Proactive protection beats reactive cleanup.** Building a negative keyword foundation before launching campaigns prevents the first weeks of waste that reactive management cannot recover. A 6-layer proactive foundation (universal waste, industry-specific, competitor, cross-modality, intent filtering, CPC protection) typically produces 50-150 negatives that block major waste categories from day one. Reactive search term mining then catches the account-specific patterns that no proactive list can predict.

## The Decision Landscape

**Match type for negatives is a precision decision with different risk profiles.** Broad negative match blocks any query containing ALL words in any order, which sounds precise but blocks more than expected. Phrase negative blocks queries containing the exact phrase in order, which is the safest default for multi-word negatives. Exact negative blocks only that specific query, which is surgical but requires adding every variant independently because negative exact does not match close variants (unlike positive exact match). The target distribution is roughly 15% broad (universal waste categories), 70% phrase (the workhorse), 15% exact (surgical precision for ambiguous terms).

**Application level matters as much as the keyword itself.** Account-level negatives (via shared lists) protect every campaign from universal waste. Campaign-level negatives handle context-specific blocking: competitor terms, cross-service isolation, geographic restrictions. Ad group-level negatives provide surgical control where the same term is wanted in one ad group but not another. Applying everything at the wrong level either over-blocks (account-level negatives that should be campaign-level) or under-protects (campaign-level negatives missing from related campaigns).

**Smart Bidding changes the calculus.** Campaigns running Target CPA or Target ROAS may already suppress waste terms to minimal CPCs through bid modulation. If a waste term's CPC is far below the campaign average, the algorithm has already deprioritized it. Adding negatives provides clean data benefits but may not save significant spend. For Smart Bidding campaigns, limit negative additions to 10-15 per campaign per week to avoid disrupting the algorithm's learned patterns.

**Shared negative keyword lists have hard capacity limits.** 5,000 keywords per shared list, 20 lists per account, 10,000 campaign-level negatives. Accounts approaching 70% of any limit need consolidation before expansion. A list at capacity that cannot accept new negatives leaves the account exposed to waste that should be blocked.

## Industry Branches

### Ecommerce

Ecommerce negative keyword strategy centers on separating purchase intent from research, wholesale, and post-purchase traffic. Wholesale and bulk queries ("wholesale," "distributor," "supplier") indicate B2B intent that B2C stores cannot serve. Returns-related queries ("return policy," "refund," "defective") are existing customer service issues, not new acquisition. Used/refurbished queries waste budget when the store sells new only. Marketplace navigation ("amazon [product]," "walmart [product]") indicates the searcher wants that specific retailer, not your site.

The subtlety in ecommerce is that comparison and review queries ("best [product]," "[product] reviews," "[product A] vs [product B]") carry commercial investigation intent and should generally be kept, not negated. Blocking these cuts off potential customers who are actively evaluating options. The exception is when budget is extremely tight and bottom-funnel keywords are already budget-limited. Price-seeking terms ("cheap," "discount," "coupon," "on sale") are buying signals in discount ecommerce, not waste, and should only be negated if the brand explicitly avoids price competition.

Brand-plus-negative-modifier combinations require special attention. "[Your brand] complaints," "[your brand] cancel," and "[your brand] refund" are existing customer navigation that does not generate new revenue through paid search. These should be negated from acquisition campaigns but kept in any brand defense or retention campaigns.

### Lead Generation

Lead gen negative strategy must protect against the volume-over-quality trap that broad match and Smart Bidding create. Consumer-intent modifiers ("free," "personal," "home use") attract the wrong buyer profile for B2B services. Self-service signals ("diy," "do it yourself," "template," "how to") indicate the searcher wants to avoid hiring a professional. Pro bono and charity-related terms attract people who cannot afford services. Each of these categories looks like engagement in the data (clicks, sometimes even form fills) but produces leads that will never close.

Geographic waste is the hidden killer in lead gen. Service-area businesses running phrase or broad match will attract clicks from cities they cannot serve. City and region names outside the service area should be campaign-level phrase negatives. But verify the root cause first: if geo-targeting settings allow impressions outside the target area, fixing targeting eliminates the problem without negatives.

Employment terms (jobs, careers, salary, hiring, internship, glassdoor) are universally irrelevant for lead gen and should be broad negatives at the account level. These are the highest-confidence negatives across all lead gen verticals because job seekers will never become customers. The one exception: staffing agencies and recruiters, for whom these terms are primary traffic.

### B2B SaaS

B2B SaaS negative strategy must filter personal-use and consumer intent from business-buyer traffic. "Personal," "home use," "individual," "student" modifiers indicate the wrong buyer segment. Open source alternatives ("open source," "free alternative," "free software") indicate unwillingness to pay for a commercial solution. These terms produce form fills from people who will never enter a sales process.

Integration and technical terms ("API," "github," "developer," "documentation") present a nuanced decision. If the ideal customer profile includes developers and technical evaluators, these terms carry value. If the ICP is business decision-makers, technical queries attract the wrong audience. The correct approach depends entirely on the product's buyer persona.

Enterprise vs. SMB segmentation through negatives prevents budget waste from size mismatch. An enterprise-only product should negate "small business," "freelancer," "personal," and "starter" modifiers. An SMB product should negate "enterprise," "government," "procurement," and "RFP" if it cannot serve those segments. Getting this wrong means paying for demos that sales will disqualify in the first five minutes.

For B2B with 30-90 day sales cycles, terms with zero conversions in a 30-day window may convert later. Reduce negation confidence for any B2B account and recommend longer lookback periods (60-90 days) before classifying terms as waste. The exception is terms that are clearly off-intent regardless of time horizon.

### Local Services

Local services generate the most straightforward waste categories. Parts and supplies queries ("faucet," "thermostat," "wire," "breaker") attract DIY shoppers buying components, not hiring a professional. Brand-name product queries ("Moen," "Carrier," "Honeywell") indicate product shopping. Tool queries ("wrench," "multimeter," "pipe cutter") reach tradespeople or DIY enthusiasts. "How to fix," "how to install," and "how to replace" explicitly signal self-service intent.

Licensing and code queries ("permit requirements," "building codes," "regulations") attract contractors or homeowners doing compliance research, not customers looking to hire. These are high-confidence phrase negatives for service businesses.

The CPC protection layer is particularly valuable for local services. Emergency-related keywords ("emergency plumber," "24 hour HVAC") carry CPCs 2-5x higher than standard service terms. If the business does not offer emergency services, or if the break-even CPC cannot support emergency-tier pricing, these modifiers should be negated to prevent budget drain on uneconomical traffic.

### High-Value Verticals (Legal, Medical, Financial)

High-value verticals face unique waste patterns that mirror their professional categories. Legal forms and self-representation terms ("legal template," "pro se," "free legal form") attract people avoiding professional services. Practice-area mismatch is the primary waste driver: a personal injury firm bidding on broad or phrase match will attract family law, criminal defense, and immigration queries that are completely irrelevant. Wrong practice areas should be the first negative layer, applied before universal waste patterns.

Medical waste patterns include symptom research ("symptoms of," "signs of," "do I have"), home remedies ("natural cure," "alternative to," "home remedy"), and insurance/billing queries ("insurance coverage," "payment plan"). These represent information seekers, self-treaters, and existing patients, none of whom generate new patient acquisition.

The dollar exposure per negative keyword mistake in these verticals is extreme. A missing negative on a $150 CPC keyword burns $3,000-$5,000/month. Conversely, an overly aggressive negative that blocks "$200/click personal injury" queries destroys tens of thousands in case value. The confidence threshold for adding negatives should be higher here than in any other vertical, and every negative should be reviewed against the firm's specific practice areas and target case types.

## Diagnostic Trees

**"Search term waste is high but I don't know where to start."** Begin with the highest-spend non-converting terms. Sort search terms by cost descending, filter to zero conversions and 50+ clicks. This surfaces the biggest waste first. Then cluster similar-intent terms into named patterns ("Employment Seekers," "DIY Researchers," "Geographic Mismatch"). Named patterns are memorable and actionable; numbered categories are forgettable. Address the highest-dollar pattern first.

**"We added negatives and impression share dropped."** Over-blocking is the most common mistake with aggressive negative strategies. Check whether a broad match negative caught something unexpected. "Free" as a broad negative blocks "free consultation" if that is the offer. "Repair" as a broad negative blocks "AC repair" if that is the service. Switch from broad to phrase match for the offending negative. Review impression share weekly for 4 weeks after any negative deployment, and maintain a rollback protocol: if impression share drops more than 15% or click volume drops more than 20% without CPA improvement within 14 days, pause the new negative keyword list.

**"We have 500+ negatives and performance is still leaking."** Audit the existing negatives before adding more. Accounts with large negative lists often have redundant entries, overly broad negatives suppressing valuable traffic, and structural conflicts between negatives and positive keywords. A negative keyword audit that removes 50 harmful negatives can improve performance more than adding 50 new ones.

**"PMax is generating irrelevant search terms."** PMax does not support campaign-level negatives. The only option is account-level shared lists. Add waste terms to a dedicated shared list and apply it at the account level. Brand exclusions in PMax prevent brand cannibalization. Monitor PMax search category reports for irrelevant categories, and if Search impression share drops after PMax launch, PMax is cannibalizing core search traffic.

## Mental Models

**The Friendly Fire Principle.** The cost of blocking a profitable term (lost revenue, compounding weekly, invisible in reports) exceeds the cost of tolerating waste (visible, bounded, quantifiable). This asymmetry should bias every close call toward keeping rather than negating. When confidence is below 0.7, monitor the term rather than blocking it.

**The 6-Layer Foundation.** Layer 1: Universal waste (employment, navigation, DIY). Layer 2: Industry-specific waste. Layer 3: Competitor blocking (if desired). Layer 4: Cross-modality protection (service A terms negated in service B campaigns). Layer 5: Intent filtering (informational modifiers). Layer 6: CPC protection (terms where the math cannot work). Building proactively from Layer 1 outward creates comprehensive protection. Building reactively from search term reports alone always leaves structural gaps.

**The Aggregate Waste Principle.** Individual waste terms at $0.50 per impression feel ignorable. But 200 single-impression junk terms at $0.50 each total $100/month. Always scan skipped low-volume terms in aggregate before dismissing them. One clear negative recommendation can eliminate an entire pattern that individual term analysis would miss.

**The Named Pattern.** "Product Purchase Intent," "Competitor Navigation," "Geographic Mismatch" are memorable and actionable waste categories. "Category 1," "Category 2," "Category 3" are forgettable. Naming patterns makes them persistent mental models that account managers apply in future reviews without needing to re-derive the classification logic.

## Thresholds and Benchmarks

**50+ clicks with zero conversions** is the minimum threshold for high-confidence waste classification on performance data alone. Below 50, the sample size is insufficient for statistically reliable conclusions. For high-CPC keywords ($10+), spend exceeding 3x target CPA qualifies regardless of click count because the dollar exposure justifies action at lower statistical confidence.

**50-200 account-level negatives plus 20-50 per campaign** is the typical range for a well-managed account. Zero negatives means no protection. Over 1,000 total negatives likely indicates over-blocking. The right number is determined by how many waste patterns exist in the specific vertical, not by an arbitrary target.

**0.9+ confidence score** warrants immediate implementation. 0.7-0.89 confidence warrants implementation with 5-day monitoring. Below 0.7 warrants investigation, not action. This confidence scoring should be based on independent signal count: (1) waste pattern match, (2) zero conversions with sufficient clicks, (3) CPA exceeding 3x target, (4) no service keyword overlap, (5) confirmed intent misalignment. Four or five signals produce 0.9+. Three signals produce 0.7-0.9. One to two signals stay below 0.7.

**Weekly search term review for the first month, bi-weekly thereafter** is the maintenance cadence for healthy accounts. Monthly negative keyword conflict reviews catch over-blocking. Quarterly competitor list updates catch new market entrants. Any major account change (new campaigns, match type changes, DSA or PMax launch) triggers an immediate re-scan within 1-2 weeks.

**10-15 negatives per campaign per week** is the maximum safe implementation rate for Smart Bidding campaigns. Bulk-adding 50 negatives simultaneously disrupts the algorithm's learned patterns and can trigger re-learning periods. Manual CPC campaigns have no such constraint.

**75% of PPC professionals use exact match negatives often or always**, while broad match satisfaction for negatives sits at 41%. This reflects the industry-wide recognition that broad match negatives block more than intended. Default to phrase match for safety; use broad match negatives only for single-word universal waste categories where any query containing the word is irrelevant.

## Common Mistakes and WHY They Happen

**Negating terms with conversions because CPA is high.** The instinct is to cut anything above target CPA. But a converting term at 2x target CPA is an optimization problem (improve the landing page, adjust the bid), not a negation problem. Negating it eliminates revenue entirely rather than improving its efficiency. Unprofitable converters should go to MONITOR status for bid and landing page review, not to the negative list.

**Using broad match negatives for multi-word phrases.** Broad match negatives block any query containing all the words in any order. "Free trial" as a broad negative blocks "free trial software" but also blocks "trial offer free shipping," which might be relevant. This happens because managers assume negative broad match works like positive broad match. In reality, negative broad is the most aggressive match type and should be reserved for single-word universal waste patterns only.

**Applying negatives at the wrong level.** Account-level negatives for terms that are waste in one campaign but valuable in another (competitor names, for instance) block traffic the advertiser deliberately targets. Campaign-level negatives for universal waste terms (jobs, careers) leave other campaigns unprotected. This happens because Google Ads makes account-level shared lists slightly harder to set up than campaign-level negatives, so managers default to campaign-level and miss the structural benefit.

**Reacting to individual terms instead of patterns.** Negating "dental implant cost" and "cost of dental implants" as two separate items instead of recognizing the pattern ("cost" modifier queries) and building one phrase negative. This happens because search term reports are presented as flat lists, not clustered by intent. Analyzing clusters produces 80% of the waste prevention with 20% of the negatives.

**Building negatives reactively only.** Waiting for waste to appear in search term reports before blocking it means the first 2-4 weeks of every new campaign hemorrhage budget on predictable waste categories. Employment terms, navigation terms, DIY terms, and industry-specific waste are knowable before the first dollar is spent. Proactive deployment of Layer 1-2 negatives on day one prevents this predictable waste.

**Trusting Google's automated negative keyword suggestions.** Industry adoption of Google's auto-apply for negative keywords sits at 5% with 27% satisfaction, the lowest of any Google Ads feature. Google's suggestions optimize for Google's revenue, not your profitability. If auto-apply recommendations are enabled, check whether "Remove conflicting negative keywords" is active, as Google may silently remove negatives you intentionally added.

## What Changes Over Time

Search term visibility continues to decline. Google now hides an increasing percentage of search terms behind privacy thresholds, which reduces the effectiveness of reactive negative keyword management. Proactive strategies (Layer 1-6 foundation, industry pattern databases) become more valuable as the data available for reactive management shrinks.

Performance Max does not support campaign-level negatives and provides limited search term visibility. As PMax absorbs more budget share, the primary negative keyword lever shifts to account-level shared lists. Brand exclusion lists in PMax serve a similar function to negative keywords, preventing PMax from cannibalizing branded search traffic.

Broad match expansion by Google increases the surface area that negatives must cover. As Google pushes more accounts toward broad match, the importance of robust negative keyword foundations grows proportionally. An account on exact match with 20 negatives may function adequately. The same account on broad match with 20 negatives will hemorrhage budget on irrelevant queries.

Negative keyword limits have not increased as account complexity has grown. The 5,000-per-shared-list and 20-lists-per-account constraints date from an era of smaller, simpler accounts. Large accounts managing hundreds of campaigns across multiple service lines are hitting these limits, requiring strategic consolidation and careful capacity planning.

## Connected Domains

**Keyword strategy** is the offensive counterpart to negative keyword defense. Every keyword expansion increases the query surface area that negatives must protect. Adding 50 new phrase match keywords without updating negatives proportionally increases waste exposure. The two disciplines must be synchronized.

**Broad match governance** depends entirely on negative keyword infrastructure. Broad match without negatives is, as the industry describes it, a blank check to Google. The qualification framework for broad match deployment includes a gate requiring 50+ negatives with regular review cadence. Negative keywords are the prerequisite that makes broad match viable.

**Quality Score** improves when irrelevant search terms are negated because the remaining traffic has higher relevance, improving click-through rates and ad relevance scores. Negative keyword cleanup is one of the fastest paths to Quality Score improvement because the effect on CTR is immediate.

**Account structure** determines where negatives can be applied and how they interact. Cross-modality negatives (service A terms blocked in service B campaigns) require multi-campaign architecture. Shared lists require an understanding of which campaigns share waste patterns. Structure and negatives are interdependent.

**Measurement and tracking** underpin every negative keyword decision. Without accurate conversion data, the distinction between "waste" and "underperforming" collapses. A term with zero tracked conversions might be driving phone calls that are not tracked. Ensuring conversion completeness before negating is essential to prevent friendly fire.
