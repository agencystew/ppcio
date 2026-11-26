# The Paid Media Performance System

> Most paid media performance problems get blamed on platform settings. The real cause is usually two or three layers away from where the team is looking. This framework maps the entire system so you diagnose the right layer before you start fixing things.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

This is the meta-playbook. It shows how every piece of paid media connects into one system. Once you know which layer is broken, load the specific playbook for that layer to go deep.

---

## The System Map

Paid media performance is produced by eight layers. Each layer depends on the ones above it. Optimizing a downstream layer while an upstream layer is broken is the single most common waste of time and money in the industry.

```
LAYER 1: STRATEGY FOUNDATION
  Offer/market fit, audience definition, unit economics, positioning
    |
    v
LAYER 2: MEASUREMENT FOUNDATION
  Conversion tracking, attribution, data quality
    |
    v
LAYER 3: FIRST-PARTY DATA
  Transaction data, on-site behavior, offline events, external signals
    |
    v
LAYER 4: PLATFORM LEVERS (what most people think "PPC" is)
  Campaign structure, keywords, audiences, bids, budgets, ad creative
    |
    v
LAYER 5: CONVERSION ENGINE
  Landing page, page speed, form/checkout, trust signals, message match
    |
    v
LAYER 6: EXPERIMENTATION
  A/B testing, incrementality, holdout groups
    |
    v
LAYER 7: EXTERNAL CONTEXT
  Competition, demand shifts, seasonality, platform changes
    |
    v
LAYER 8: BUSINESS OUTCOMES
  Revenue, profit, growth, market share
```

**The critical insight:** Layers 1, 2, 3, and 5 sit outside the ad platform. Most PPC teams spend 90% of their time in Layer 4. This is why performance plateaus. The biggest levers are not inside Google Ads.

---

## Layer 1: Strategy Foundation

**What it is.** The decisions that determine whether paid media can work at all, before a single campaign is created. A brilliant Google Ads setup aimed at a weak offer will always lose to a mediocre setup aimed at a strong offer.

### Offer/Message-Market Fit

This is the most under-discussed factor in paid media performance. If the offer does not match what the market actually wants, no amount of keyword optimization, bid strategy tuning, or landing page testing will fix it. The symptoms show up as: decent traffic, reasonable CTR, but conversion rates that never reach benchmarks regardless of what you change on the page.

**How to diagnose an offer problem vs. a platform problem:**
- If multiple traffic sources (paid search, paid social, organic, referral) all convert poorly, the offer is the problem. Platform settings cannot cause cross-channel conversion failure.
- If paid search converts poorly but organic converts well for the same product, the problem is in Layers 4 or 5 (targeting the wrong queries or breaking the post-click experience).
- If one campaign converts well and another does not for the same product, the problem is in Layer 4 (keyword/audience selection) or Layer 5 (landing page match).

**The offer hierarchy for paid search:**
1. The offer solves an active problem the searcher is trying to fix right now (highest intent, highest conversion potential)
2. The offer improves something the searcher has been thinking about (moderate intent, needs more persuasion)
3. The offer introduces something the searcher did not know they needed (low intent from search, better suited to display/social)

Paid search works best for category 1. If you are running search campaigns for a category 3 offer, the channel mismatch is itself a strategy failure.

### Audience Definition

Who you are trying to reach determines everything downstream: which keywords to target, what the ad should say, what the landing page should promise, and what conversion action is appropriate. A vague audience definition produces vague campaigns.

The test: can you describe your target customer specifically enough that a stranger could identify them in a room? "Small business owners" fails. "Owners of plumbing companies with 5-20 employees in cities over 100,000 population who currently rely on word-of-mouth and want to grow" is specific enough to build campaigns against.

### Unit Economics

The math that determines whether a campaign can ever be profitable, independent of how well it performs.

- **Customer Lifetime Value (LTV):** The total revenue a customer generates over their relationship. Without this, you cannot set rational CPA targets.
- **Target Customer Acquisition Cost (CAC):** The maximum you can pay to acquire a customer and maintain your margin requirements. This is derived from LTV and margin, not from "what feels reasonable."
- **Allowable CPA:** The conversion-level target derived from CAC, adjusted for close rate (for lead gen) or return rate (for ecommerce).

**The relationship:** LTV determines CAC ceiling. CAC determines allowable CPA. Allowable CPA determines whether a keyword, audience, or campaign can work at your margin requirements. Without LTV, every CPA target is arbitrary.

When an account "cannot make the numbers work" despite good alignment and platform execution, the problem is almost always here: the unit economics do not support paid acquisition in this channel for this offer. That is a Layer 1 problem, not a Layer 4 problem.

### Competitive Positioning

Where you sit relative to alternatives determines your conversion rate floor and ceiling. If three competitors offer the same service at the same price with the same landing page structure, your conversion rate ceiling is roughly 1/N of the total converting demand, minus the portion captured by brand strength.

Competitive positioning problems show up as: adequate traffic, adequate CTR, adequate landing page quality, but conversion rates that stay stubbornly below benchmark. The searcher clicked, read the page, and chose someone else. No platform lever fixes this.

---

## Layer 2: Measurement Foundation

**What it is.** The infrastructure that turns user actions into data you can act on. If this layer is broken, every decision made in Layers 3 through 8 is based on unreliable information.

### Why Measurement Comes Before Platform Levers

Most accounts treat measurement as a setup task completed during onboarding and never revisited. In reality, measurement degrades constantly: tags break during site updates, consent managers suppress tracking, attribution windows change with platform updates, and cross-device behavior makes direct measurement increasingly incomplete.

**The measurement audit questions:**
- Are conversions being tracked accurately? (Compare Google Ads conversions against CRM/backend data. Variance above 15% means the data is unreliable.)
- Is the attribution model appropriate? (Last-click attribution in a 90-day sales cycle misattributes almost everything. Data-driven attribution with insufficient conversion volume produces noise.)
- How much conversion data is being lost to consent, cross-device, and browser restrictions? (In many markets, 20-40% of conversions are invisible to platform tracking.)
- Is there conversion lag that makes recent data misleading? (B2B accounts with 14-day conversion windows will show this week's campaigns as "zero conversions" when they actually have pipeline building.)

**The danger of optimizing on bad data:** If your conversion tracking overcounts by 30% (counting page views as conversions, double-firing tags, counting non-purchase events), every CPA in the account looks 30% better than reality. You will scale campaigns that are actually losing money. If tracking undercounts by 30% (consent suppression, cross-device loss), you will pause campaigns that are actually profitable. Both are common. Both are invisible without auditing the measurement layer.

### First-Party Conversion Data vs. Platform-Reported Data

Platform-reported conversions are a model, not a measurement. Google Ads uses machine learning to fill gaps from consent loss, cross-device behavior, and click-to-conversion delays. This modeling is generally directional but can diverge significantly from actual business outcomes.

The gold standard is matching platform-reported conversions against source-of-truth business data (CRM closed deals, ecommerce orders, actual revenue). When the two diverge, trust the business data and calibrate platform targets accordingly.

---

## Layer 3: First-Party Data

**What it is.** Data you own about your customers and their behavior that you feed back into the advertising platform to sharpen targeting, bidding, and audience selection.

### Why First-Party Data Amplifies Everything Below It

Google's algorithms make better decisions when they have better signals. First-party data is the highest-quality signal you can provide because it comes from actual customer behavior, not modeled proxies.

**Transaction data** (order values, repeat purchase rates, LTV segments) enables value-based bidding. Instead of optimizing for "a conversion," the algorithm optimizes for "a high-value conversion." This single shift can improve ROAS by 30-100% without touching any other setting.

**On-site behavior** (page visits, cart abandons, content engagement) powers remarketing and audience signals. A Smart Bidding strategy with audience signals from actual site behavior will outperform one relying solely on Google's in-market audiences.

**Offline events** (in-store visits, phone call outcomes, CRM deal stages) close the gap between online clicks and real business results. For lead gen businesses, feeding back "this lead became a customer" data transforms campaign optimization from "get more form fills" to "get more customers."

**External signals** (weather, inventory levels, promotional calendars) enable dynamic budget and bid adjustments based on business context the platform cannot see.

### How First-Party Data Connects to Platform Levers

| Data Type | Platform Application |
|-----------|---------------------|
| Customer lists | Customer Match targeting, lookalike audiences, exclusion lists |
| Purchase history | Value-based bidding, high-value audience creation |
| On-site behavior | Remarketing audiences, Smart Bidding signals |
| Offline conversions | Conversion import, offline conversion tracking |
| CRM deal stages | Lead scoring adjustments, close-rate-weighted bidding |
| Inventory data | Dynamic budget rules, product availability signals |

The accounts that outperform despite similar platform setups almost always have better first-party data integration. This layer is the most under-invested in PPC.

---

## Layer 4: Platform Levers

**What it is.** The settings and decisions inside the ad platform that most people think of as "doing PPC." This is important, but it is one layer of eight, and it only works if Layers 1, 2, and 3 are sound.

### Campaign Structure

How campaigns and ad groups are organized determines how budget flows, how data accumulates, and how granularly you can optimize. The structure should reflect the business (products, services, locations, customer segments), not arbitrary organizational schemes.

Structure problems show up as: campaigns competing against each other for the same queries, budget locked into underperforming segments with no way to shift it, or data spread so thin across hundreds of ad groups that no single one has enough volume for statistical learning.

### Keywords and Match Types

The mechanism that connects search intent to your ads. Keyword strategy is really intent strategy: which searcher intents do you want to capture, and how precisely?

The match type spectrum trades volume for precision. Broad match captures the most intent variations but requires strong Smart Bidding signals and negative keyword management. Exact match captures the least volume but the most precise intent. The right choice depends on conversion volume (Smart Bidding needs 15-30 conversions/month minimum to learn), data maturity, and risk tolerance.

### Audience Targeting

Who sees your ads, beyond keywords. Audience layers (demographics, in-market, custom segments, remarketing lists) add targeting dimensions that keywords alone cannot express. "Running shoes" as a keyword targets intent. Adding an audience layer for "household income top 30%" changes who within that intent pool sees the ad.

### Bid Strategy

How you compete in each auction. Manual bidding gives control but cannot react in real-time to the thousands of signals Google processes per auction. Smart Bidding (Target CPA, Target ROAS, Maximize Conversions) uses machine learning to set bids per auction but requires sufficient conversion data and accurate conversion tracking (Layer 2) to work well.

The bid strategy decision depends entirely on the measurement layer. Smart Bidding optimizing toward inaccurate conversion data will confidently pursue the wrong outcomes.

### Budget and Pacing

How much you spend and when. Budget is the resource constraint that forces prioritization. Pacing is the distribution of that budget across the month. Both interact with bid strategy: a budget-constrained campaign with Maximize Conversions will spend aggressively early and starve late. Budget decisions should be made based on marginal returns (what does the next dollar buy?), not historical allocation.

### Ad Creative

The message that connects your offer to the searcher's intent. Ad copy is the promise layer: it sets the expectation that the landing page must fulfill. The strongest ad copy does three things: reflects the search intent (relevance), differentiates from competitors visible on the same SERP (positioning), and pre-qualifies the click (filtering).

Ad creative problems show up as: low CTR (the ad is not resonating), high CTR with low conversion rate (the ad is over-promising), or similar performance across all ad variations (the tests are not testing meaningfully different messages).

---

## Layer 5: The Conversion Engine

**What it is.** Everything that happens between the click and the business outcome. This layer is where most performance is actually won or lost, yet it sits outside the ad platform and outside most PPC teams' direct control.

### Why the Conversion Engine Deserves Its Own Layer

In the image that inspired this framework, landing page was listed as one of eight equal "things you control" alongside budget, bid strategy, and keywords. This dramatically understates its importance. The landing page is not a setting you configure. It is the environment where the conversion decision happens. Every other layer drives traffic to the page. The page is where that traffic either converts or does not.

A 2x improvement in landing page conversion rate has the same effect as doubling your budget at the same CPA. But budget doubling costs real money. Conversion rate improvement is free marginal volume.

### Message Match

The landing page headline and opening content must directly continue the conversation the ad started. If the ad says "Get a Free Roof Inspection," the landing page headline must reference the free roof inspection, not "Welcome to ABC Roofing." This is the single fastest conversion rate fix available: matching the ad's promise to the page's headline. It can be tested and implemented in hours.

### Page Speed and Technical Performance

Every additional second of load time reduces conversion rate by roughly 7-12% on mobile. A page that loads in 5 seconds instead of 2 has already lost 20-35% of potential conversions before anyone reads a word. Google's own data shows that 53% of mobile visitors abandon sites that take longer than 3 seconds to load. Page speed is not a "nice to have" optimization. It is a conversion rate multiplier that affects every single visitor.

### Form and Checkout Friction

Every additional form field reduces completion rate. Every unexpected step in a checkout flow increases abandonment. The conversion action must match the commitment level the visitor has been primed for. A "Get a Quick Quote" ad that leads to a 15-field form with required phone number violates the expectation of "quick." A "Schedule a Demo" ad that leads to an instant sign-up with no human contact violates the expectation of "demo."

### Trust Signals

Social proof (reviews, testimonials, case studies), authority signals (credentials, certifications, media mentions), and risk reducers (guarantees, free trials, money-back promises) are not decorative elements. They are load-bearing components of the conversion decision. In high-consideration purchases (legal, medical, financial, B2B), missing trust signals do not just reduce conversion rate. They prevent conversion entirely.

### The Conversion Engine Diagnosis

When conversion rate is below benchmark and the alignment chain (keyword to ad to page) checks out, the problem is almost always in the conversion engine:
- Load the page on mobile. Count the seconds. If it takes more than 3, start here.
- Read the headline. Does it match the ad that sent you here? If not, fix message match.
- Try to complete the conversion action. How many steps? How many fields? How much friction? If it feels like work, simplify.
- Look for trust signals. If you were spending your own money, would this page give you enough confidence to act? If not, add proof.

---

## Layer 6: Experimentation

**What it is.** The discipline of testing whether changes actually caused results, or whether you are reading correlation as causation.

### Why Experimentation is a Separate Layer

Most PPC optimization is observational: you change a bid, see performance improve, and conclude the bid change worked. But dozens of other variables changed simultaneously (competitor behavior, demand patterns, day of week, audience mix). Without controlled experimentation, you cannot distinguish signal from noise.

### A/B Testing

Isolate one variable, split traffic, measure the difference. A/B testing is the most accessible form of experimentation in PPC. Ad copy A vs. Ad copy B. Landing page variant vs. control. Bid strategy X vs. bid strategy Y. The discipline required: sufficient sample size (not stopping the test when one variant looks good after 50 clicks), testing meaningful differences (not testing "Learn More" vs. "Find Out More"), and measuring the right outcome (conversions or revenue, not CTR alone).

### Incrementality Testing

The question most A/B tests cannot answer: would the conversion have happened anyway? Incrementality testing measures the true lift from advertising by comparing a group exposed to ads against a group that was not. This is particularly important for branded search (would those searchers have found you organically?) and remarketing (would those visitors have returned on their own?). Results frequently show that branded search and remarketing have lower incrementality than assumed, which changes budget allocation decisions significantly.

### Holdout Groups

A holdout group withholds ads from a random subset of your target audience. The difference in conversion behavior between the exposed and holdout groups measures the true advertising effect. This is the gold standard of incrementality measurement. It requires enough volume to detect statistically significant differences, which means it works best at the campaign or channel level, not individual ad group level.

---

## Layer 7: External Context

**What it is.** The forces that change your results regardless of what you do inside the account. Ignoring external context leads to misdiagnosis: blaming platform settings for problems caused by market shifts.

### Competition

Other advertisers in your auctions directly affect your costs, your impression share, and your relative position. A new competitor entering with aggressive bids and a strong offer will suppress your metrics even if your account is perfectly optimized. Competitive monitoring is not optional: check auction insights monthly, monitor SERP presence for your core terms, and track when new players appear or existing ones change their approach.

A sudden CPA increase with no account changes is the classic signal of a competitive shift. Before adjusting bids or budgets, check if the competitive landscape changed.

### Demand Shifts

Search volume is not static. It fluctuates with seasons, news cycles, economic conditions, and cultural trends. A campaign that performed well in Q4 may underperform in Q1 simply because fewer people are searching. This is not a platform problem. It is a demand problem. The solution is not to bid higher for less demand. It is to recognize the demand ceiling and adjust expectations and budgets accordingly.

### Seasonality

Predictable patterns in search volume, conversion rate, and competition intensity that repeat annually. Ecommerce peaks in Q4. Tax services peak in Q1. HVAC peaks in extreme weather months. B2B dips during holidays. Seasonal patterns should be built into budget planning, target setting, and performance expectations. Comparing January performance against December performance without seasonal adjustment produces misleading conclusions.

### Platform Changes

Google Ads changes constantly: new bidding strategies, match type behavior shifts, auction dynamics updates, new ad formats, policy changes. A performance shift that coincides with a platform update is likely caused by the update, not by your account deteriorating. Stay current on platform changes and factor them into diagnosis before assuming internal causes.

---

## Layer 8: Business Outcomes

**What it is.** The actual results that matter to the business. Not impressions, not clicks, not ROAS. Revenue, profit, and growth.

### Why ROAS and CPA are Diagnostic Tools, Not Goals

ROAS (Return on Ad Spend) tells you how many dollars come back per dollar spent on ads. It is useful for comparing campaigns, channels, and time periods. But it is not the end goal, and treating it as one hides critical information.

**ROAS hides margin.** A 5x ROAS on a 10% margin product generates $0.50 profit per ad dollar. A 3x ROAS on a 60% margin product generates $1.20 profit per ad dollar. The "worse" ROAS is actually 2.4x more profitable. Optimizing for ROAS alone would cut the more profitable campaign.

**ROAS hides scale.** A 10x ROAS on $1,000/month spend generates $10,000 revenue. A 4x ROAS on $50,000/month spend generates $200,000 revenue. The lower ROAS campaign generates 20x the revenue. If margin supports it, the "worse" ROAS campaign is dramatically more valuable.

**ROAS hides LTV.** A 2x ROAS campaign acquiring subscription customers with 24-month average retention is vastly more valuable than a 6x ROAS campaign acquiring one-time purchasers. First-purchase ROAS does not capture this.

**CPA has the same limitations.** A $50 CPA for a customer worth $5,000 LTV is a different decision than a $50 CPA for a customer worth $75. The CPA is identical. The business value is 67x different.

### What to Measure Instead

**Revenue.** Total revenue generated from paid media. This is the top line.

**Profit.** Revenue minus cost of goods/services minus ad spend minus operational cost. This is the number that determines whether paid media is creating or destroying value. A campaign can have excellent ROAS and still lose money when fully loaded costs are included.

**Customer Acquisition Cost vs. Lifetime Value.** The ratio that determines long-term viability. LTV:CAC of 3:1 or better is the general benchmark for sustainable paid acquisition. Below 3:1, the business is growing but not profitably enough to reinvest. Below 1:1, paid acquisition is actively destroying value.

**Market Share and Growth.** Impression share in your core terms is a proxy for how much of available demand you are capturing. Growth rate (month over month, year over year) shows trajectory. These metrics matter for businesses where market position has strategic value beyond immediate profit.

**Marginal return on ad spend.** Not average ROAS (which blends high-performing and low-performing spend), but the return on the *last* dollar spent. If your overall ROAS is 5x but your marginal ROAS (the return from increasing budget by 10%) is 1.5x, you are approaching the point of diminishing returns. This tells you when to stop scaling and reallocate.

---

## Diagnosing Which Layer Is Broken

The most common mistake in PPC management is treating everything as a Layer 4 problem. The diagnostic sequence below starts from the top and works down. The first broken layer is where you should focus. Fixing downstream layers while an upstream layer is broken wastes effort.

### The Top-Down Diagnostic

**Step 1: Is the offer viable for paid search?** (Layer 1)
Does the product/service solve an active problem people search for? Are the unit economics sound (LTV > 3x target CAC)? If the offer does not work on paper, it will not work in Google Ads regardless of execution quality.

**Step 2: Is the data trustworthy?** (Layer 2)
Compare Google Ads conversion data against backend/CRM data. If variance exceeds 15%, do not optimize based on platform data until the gap is resolved. Check for tag issues, consent suppression, and attribution model appropriateness.

**Step 3: Is first-party data being used?** (Layer 3)
Is value-based bidding enabled with actual revenue data? Are customer lists being used for targeting and exclusion? Is offline conversion data being imported? If no to all three, there is a significant performance ceiling that platform levers alone cannot break through.

**Step 4: Are platform settings well-configured?** (Layer 4)
This is the traditional PPC audit: campaign structure, keyword coverage, match type strategy, bid strategy selection, budget allocation, ad copy quality. Most PPC knowledge focuses here. It matters, but only after Layers 1-3 are sound.

**Step 5: Is the conversion engine performing?** (Layer 5)
Load the landing page on mobile. Is it fast? Does the headline match the ad? Is the conversion action simple and matched to the visitor's commitment level? Are trust signals present? If the page is slow, mismatched, or friction-heavy, this is the constraint.

**Step 6: Are you testing or guessing?** (Layer 6)
Are changes being tested with controlled experiments, or are you making changes and observing what happens? If the latter, you may be misattributing results to the wrong causes. Establish a testing cadence if conversion volume supports it.

**Step 7: Has the external environment changed?** (Layer 7)
New competitors? Seasonal demand shift? Platform update? If performance changed suddenly without account changes, the cause is likely external. Check auction insights and search volume trends before diagnosing internal issues.

**Step 8: Are you measuring the right outcome?** (Layer 8)
Is the team optimizing for ROAS when they should be optimizing for profit? Is CPA the target when LTV variance means some CPAs are bargains and others are losses? Align the metric to the business objective.

---

## How the Playbooks Map to the System

| Layer | Playbook(s) |
|-------|-------------|
| 1. Strategy Foundation | Unit Economics, Business Models, Competitive Intel |
| 2. Measurement Foundation | Measurement |
| 3. First-Party Data | Audience Strategy |
| 4. Platform Levers | Account Structure, Keyword Strategy, Bidding Strategy, Budget Pacing, Ad Copy, Negative Keywords, Broad Match, Quality Score, Performance Max, Shopping Feed |
| 5. Conversion Engine | Landing Pages, Alignment Chain |
| 6. Experimentation | Experimentation |
| 7. External Context | Competitive Intel, Scaling (demand ceilings) |
| 8. Business Outcomes | Unit Economics, Reporting |

Notice the imbalance. The majority of playbooks cover Layer 4 (platform levers). This reflects the industry's bias, not the actual distribution of performance problems. The playbooks covering Layers 1, 2, 5, and 8 are where the highest-impact insights live.

---

## Common Misdiagnoses

**"We need to lower our CPA."** CPA is an output, not an input. Which layer is producing the high CPA? If the offer is weak (Layer 1), no bid change will fix it. If tracking is overcounting (Layer 2), the real CPA may already be fine. If the landing page converts at 1% when it should convert at 3% (Layer 5), fixing the page triples your effective budget without spending more. "Lower CPA" is not a diagnosis. It is a symptom.

**"Our ads are not working."** Which part? The ads might be driving excellent traffic to a page that does not convert. Or the ads might be attracting the wrong traffic because the keyword strategy targets the wrong intent. Or the ads might look identical to three competitors because the offer has no differentiation. Same symptom, three different layers, three different fixes.

**"We need more budget."** Maybe. But if the current budget is being spent on misaligned traffic (Layer 4), uncounted conversions (Layer 2), or a page that loses 40% of visitors to load time (Layer 5), more budget amplifies the waste. Fix the system before scaling it.

**"Smart Bidding is not working."** Smart Bidding optimizes toward the conversion data it receives. If conversions are miscounted (Layer 2), the algorithm optimizes toward the wrong signal. If the conversion action is "page view" instead of "purchase" (Layer 2), the algorithm delivers page views efficiently. Smart Bidding rarely fails on its own. It amplifies whatever the measurement layer tells it to pursue.

**"We keep testing but nothing improves."** If A/B tests on ad copy and landing page variations consistently show no significant difference, the constraint is probably not in the elements being tested. It may be the offer (Layer 1), the audience (Layer 1), or the competitive environment (Layer 7). Testing within a broken layer produces noise. Test across layers to find the actual constraint.

---

## The Performance System for Different Business Models

### Ecommerce
- Layer 1 (offer) is validated by product-market fit and existing organic sales
- Layer 3 (first-party data) has the most impact through value-based bidding on actual purchase values
- Layer 5 (conversion engine) centers on product page quality, checkout friction, and shipping/return policy clarity
- Layer 8 (outcomes) must measure profit per order, not ROAS, because margin varies dramatically by product

### Lead Generation
- Layer 1 (offer) is often the binding constraint because the offer is a form fill, not a purchase, and the gap between lead and customer is large
- Layer 2 (measurement) is critical because the conversion that matters (customer) happens weeks or months after the click
- Layer 5 (conversion engine) is heavily influenced by form design and the perceived value exchange
- Layer 8 (outcomes) must track through to closed revenue, not leads, because lead quality varies 10x or more

### B2B SaaS
- Layer 1 (offer) must match the intent stage of the searcher (educational content for awareness, demo/trial for decision)
- Layer 2 (measurement) is the biggest challenge due to long sales cycles, multiple touch points, and the gap between MQL and closed deal
- Layer 4 (platform) operates with lower volume, so statistical learning is slower and manual oversight remains important
- Layer 8 (outcomes) must account for LTV, since a $200 CPA for a $50,000 ACV customer is exceptional

### Local Services
- Layer 1 (offer) includes geographic fit and service area alignment as core components
- Layer 5 (conversion engine) often centers on phone calls, not form fills, and the "landing page" extends to who answers the phone and how
- Layer 7 (external) includes hyper-local competition and weather/seasonal patterns that shift weekly
- Layer 8 (outcomes) must track revenue per job, not just leads, because job value varies significantly
