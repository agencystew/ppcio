# PPC Experimentation Knowledge Foundation

> Experimentation in PPC is a statistical discipline that answers specific questions raised by account data -- not a list of things to try. The value of an experiment is determined before it runs by whether the account has enough conversion volume to detect the expected effect size, and the most common failure mode is running tests that can never reach significance and then making decisions on noise.

## How to Use This
Load this into a conversation, then describe your situation and ask questions.
The AI reasons about YOUR specific context using the expert knowledge below.

## First Principles

**Conversion volume determines what you can test, and this is non-negotiable math.** To detect a 20% improvement at 95% confidence, each variation needs approximately 400 conversions. At 50 conversions per month with a 50/50 split, that is a 16-month test. Most accounts cannot run statistically valid conversion tests on small changes. This is not a limitation of strategy -- it is a constraint of sample size. Accounts below 30 conversions per month should implement informed changes and monitor directionally rather than pretending formal A/B testing is viable. Accounts above 200 conversions per month can test incremental optimizations. Accounts above 500 can run continuous experimentation programs.

**Every experiment must answer a question the data raised.** "Test new headlines" is a to-do list item. "Test benefit-focused headlines because trust-focused headlines show 4.2% CTR but only 1.1% CVR, suggesting the audience responds to the click promise but the landing page does not deliver" is a diagnosis that leads to a testable hypothesis. The hypothesis structure is always: "If we change X, then Y will improve by Z because of evidence W." Without the "because" clause grounded in specific account data, you are guessing, and guesses are expensive.

**Statistical significance protects you from expensive false conclusions.** The 95% confidence threshold means accepting a 5% chance of calling a winner that is actually noise. Relaxing to 90% means 1 in 10 "winners" is wrong. For bid strategy changes that affect every auction for months, even 5% false positive rate is aggressive. The discipline is holding the line at 95% for material changes and never calling winners before the minimum observation period, regardless of how strong the early signal appears. A coin flip can show 60/40 heads after 20 flips. You need 100+ conversions per arm before any statistical test is meaningful.

**Fix the alignment chain before testing optimizations.** If the search term does not match the keyword, the keyword does not match the ad, or the ad does not match the landing page, no optimization experiment matters. High CTR with low CVR is an alignment break -- the ad promises something the landing page does not deliver. Testing new bid strategies or ad copy on a misaligned campaign makes the wrong thing happen faster. Alignment must be intact before any experiment deserves budget.

**A negative result is a result.** Treatment performing identically to control after 200+ conversions per arm is a definitive finding: the change does not matter. This eliminates a hypothesis, frees budget for the next test, and prevents future debate about whether to revisit the idea. Experiments that "fail" by finding no effect are as valuable as experiments that find improvements, because they narrow the search space. The only true failure is an inconclusive experiment that consumed budget and taught nothing.

## The Decision Landscape

**Account tier classification determines testing capacity.** Below 30 monthly conversions (micro tier), formal A/B testing is not viable and the detectable lift is above 80% -- only massive changes would show. At 30-50 conversions (growth-low), you can detect 50-80% lifts and run 1 test per quarter maximum. At 50-100 (growth), 30-50% lifts are detectable with 1-2 tests per quarter. At 100-200 (scale), 20-30% lifts are detectable with 2-4 concurrent tests. At 200-500 (scale-high), 10-20% lifts are detectable and ongoing testing is viable. Above 500 (enterprise), 5-10% lifts are detectable and continuous experimentation becomes standard practice. Classifying the account tier before generating any hypothesis prevents the most common testing mistake: designing experiments the account cannot conclude.

**The priority cascade for experiment selection.** Fix alignment problems first (these are not experiments, they are fixes). Then scale profitable performance that is constrained (high ROAS plus budget-limited impression share -- calculate the dollar value of missed impressions). Then stop obvious waste (keywords with $100+ spend and zero conversions). Then improve efficiency (device splits, geographic variance, daypart patterns, but only when 2x+ CPA gaps exist with 30+ conversions per segment). Then expand (converting search terms not yet added as keywords, adjacent services not advertised). Then test creative (only when ads have run 90+ days AND performance actually declined). This sequence exists because each level has higher certainty and faster payoff than the next.

**Experiment integrity determines whether results mean anything.** Five mandatory integrity checks run at every checkpoint: conversion tracking functioning in both arms, budget stable (no changes exceeding 20%), traffic split accurate (within 5% tolerance of specified split), configuration frozen (no changes to bid strategy, geo targets, ad schedule, audience targeting, or ad creative during the test), and traffic quality clean (no anomalous click spikes, bot patterns, or budget exhaustion events). Any critical failure invalidates the experiment. A budget change mid-test means you changed a variable. The experiment is no longer single-variable. Results may reflect the budget change, not the treatment effect.

**Experiment duration has both a floor and a ceiling.** Minimum 21 days covers weekly purchase cycles and prevents day-of-week effects from skewing results. Maximum 8 weeks prevents external factor contamination from exceeding the learning value. Between those bounds, the actual required duration is calculated from observed effect size and conversion accumulation rate, not from calendar deadlines. If estimated weeks exceed 8, the experiment is impractical for formal testing -- recommend implementing the stronger option and monitoring directionally.

## Industry Branches

### Ecommerce

Ecommerce is the most experiment-friendly vertical because transaction data provides a clean, immediate conversion signal. Primary metric is ROAS or revenue per session. Daily conversion volumes are typically high (50-500+ per day in scaled accounts), which means Phase 3 statistical assessment can often begin by Day 21. This high volume also means smaller effect sizes are detectable, making incremental optimization tests viable that would be impossible in other verticals. The main risks to ecommerce experiments are AOV shifts masking CVR changes (a winning variant might have higher ROAS purely because customers ordered more expensive products, not because the treatment improved anything), promotional periods contaminating results (never run experiments that span Black Friday or major sales events unless the experiment specifically tests seasonal strategy), and PMax cannibalization between arms where PMax redistributes traffic in ways that confound the split.

### Lead Generation

Lead gen experiments must contend with the quality gap: Google Ads counts form fills, but the business values qualified leads that close. Primary metric is CPA or cost per qualified lead. Expected daily conversion volume is moderate (5-50 per day per arm), meaning Phase 3 entry may require 28-35 days for significance. The critical watch item is lead quality differences not visible in Google Ads data -- a treatment that lowers CPA by 15% but attracts leads that close at half the rate is not a winner, it is a disaster. For any lead gen experiment touching ad copy, landing pages, or targeting, validate the result against downstream pipeline data if available. Form submission counts alone are insufficient for a verdict when lead quality is in play.

### B2B SaaS

B2B SaaS is the hardest vertical for formal experimentation. Primary metric is cost per SQL or pipeline contribution. Expected daily conversion volume is low (0.5-5 per day per arm), meaning Phase 3 entry may require 45-60 days. For accounts generating fewer than 3 conversions per week, 95% confidence is unreachable within budget constraints -- flag this trade-off explicitly and consider 90% confidence as the threshold with clear disclosure. Switch to weekly checkpoints instead of daily. The core challenge is that trial starts vs. paying customers often diverge dramatically -- an experiment may "win" on trials but lose on revenue. If trial-to-paid data is available, incorporate it into the assessment. For accounts below 30 conversions per month, formal split testing is mathematically non-viable; recommend sequential testing with heavy caveats or aggregating learnings across similar accounts if managing multiple.

### Local Services

Local services experiments face extreme day-of-week variance (Monday vs. Saturday can differ by 3x in call volume) and weather-driven demand shifts. Primary metric is cost per lead or cost per call. Expected daily conversion volume is low to moderate (2-15 per day per arm). Always compare same-day-of-week performance to control for cyclical patterns. Call tracking inconsistencies are a frequent integrity violation -- verify that both arms are recording calls consistently before trusting results. Geographic expansion tests must account for the fact that different service areas have fundamentally different competitive dynamics and demand levels, meaning a test in one area may not generalize.

### High-Value Verticals

Legal, medical, and financial verticals share extremely high CPCs ($50-$200+ per click) combined with low conversion volumes, making formal experimentation expensive and slow. A learning period that costs $500 in ecommerce costs $15,000 in legal. The data-per-dollar ratio is fundamentally different: a $5,000/month account in legal generates 33 clicks compared to 500 in ecommerce. For these verticals, pre/post analysis with a 4-week baseline is often more practical than parallel split testing. When parallel testing is warranted, extend minimum runtime and widen rollback trigger thresholds because the algorithm is working with far less data per dollar spent.

## Diagnostic Trees

**IF CTR is strong but CVR is weak THEN** this is an alignment break, not a testing opportunity. The ad promises something the landing page does not deliver. Fix the message match between ad and landing page before running any experiment. Once alignment is fixed, test the specific landing page element most likely to affect conversions (hero section messaging, CTA language, form length) rather than changing everything at once.

**IF a campaign has high CPC variance (standard deviation exceeding 50% of mean CPC) combined with underperformance THEN** run outlier analysis. Calculate the CPC distribution for peak performance periods (25th, 50th, 75th, 80th, 90th percentiles) and compare to poor periods. Set Max CPC cap at the 80th percentile of peak-period CPCs. This blocks the outlier clicks that destroy profitability while preserving 80% of peak-period click volume. This is the bidding experiment mode: specific, data-driven, with a clear hypothesis about which clicks are damaging performance.

**IF an experiment has been running 14+ days with zero directional signal (less than 5% delta on primary metric) THEN** the effect may be too small to detect at current volume. Calculate estimated additional days to significance. If the estimate exceeds 28 more days, consider whether the experiment budget would produce more value elsewhere. A neutral result with 200+ conversions per arm IS the result -- the treatment does not work.

**IF the treatment is winning on primary metric but a secondary metric degraded more than 10% THEN** this is a trade-off requiring business judgment, not a clear winner. A treatment that improves CPA by 15% but drops conversion volume by 25% is acquiring fewer customers more efficiently. Whether that is good depends on whether the business is volume-constrained or efficiency-constrained. Never apply a "winner" that shows significant secondary metric degradation without explicit acknowledgment of the trade-off.

**IF an experiment was contaminated (budget changed, bid strategy modified, tracking broke) THEN** end the experiment. You cannot isolate the treatment effect from the configuration change. Fix the issue and restart with a clean 21-day minimum. Results from a contaminated experiment are meaningless regardless of how promising the numbers appear.

## Mental Models

**The Volume Gate.** Before designing any experiment, calculate: monthly conversions per arm, detectable effect size at that volume, and estimated weeks to significance. If the math says the experiment will take longer than 8 weeks, stop. Either find a higher-volume campaign to test on, bundle similar campaigns into a portfolio-level experiment, or recommend implementing the change and monitoring rather than running a formal test. The Volume Gate prevents the most common experimentation failure: tests that run forever, never reach significance, and produce decisions based on noise.

**The One-Variable Discipline.** When multiple changes are tested simultaneously (new headlines AND new landing page AND new bid strategy), a positive result teaches nothing about which change drove the result. A negative result teaches nothing about whether one change would have worked without the others. Sequential single-variable testing is slower but produces actionable knowledge. Multi-variable tests produce directional signals at best. The one exception is when changes are structurally inseparable (a new product page requires matching ad copy), in which case the experiment tests the package, not the components.

**The Cost of Patience.** Every day an experiment runs, it costs real money. The treatment arm may be performing worse than control, which means the experiment is paying for learning with revenue. Quantify this: experiment spend to date, additional spend required to reach conclusion, and projected payoff if the treatment wins. If the potential monthly savings from a winning treatment are $1,000, and the experiment costs $3,000 in learning, the payback period is 3 months. This math determines whether an experiment is worth running or whether the budget would produce more value on proven optimizations.

**The Pre-Commitment Protocol.** Define success criteria, minimum runtime, and rollback triggers BEFORE the experiment starts. This prevents the two most common behavioral failures: calling winners early when the data looks exciting (survivorship bias -- you are only excited because this particular sample happened to show a favorable result), and running tests forever when the data is inconclusive (sunk cost fallacy -- you already invested the learning budget, so stopping feels wasteful). Pre-commitment transforms experimentation from an emotional process into a mechanical one.

**The Kill Criteria Framework.** Set explicit conditions under which the experiment ends early: primary KPI degrades 20%+ for 5 consecutive days, or primary KPI degrades 50%+ at any single checkpoint. These thresholds prevent experiments from burning excessive budget when the treatment is clearly losing. But do not kill too early -- performance during the first 7 days is dominated by noise, and a variant that starts 30% behind may recover as the sample grows.

## Thresholds and Benchmarks

**21 days minimum** runtime for any PPC experiment. This covers at least three complete weekly cycles and prevents day-of-week effects from skewing results. Source: industry standard from Google's experiment documentation and confirmed by practitioner experience showing that sub-21-day experiments produce unreliable conclusions due to cyclical patterns.

**100 conversions per arm minimum** before running any statistical significance test. Below this threshold, you are measuring noise. Cap confidence at 0.60 and label findings as "insufficient sample." Source: statistical power analysis -- detecting a 20% effect at 95% confidence requires approximately 400 conversions per arm; 100 is the practical minimum for directional validity.

**95% confidence threshold** (p < 0.05) for bid strategy and campaign structure changes. These decisions affect every auction for months, so the tolerance for false positives must be low. The only exception is B2B accounts generating fewer than 3 conversions per week where 95% is unreachable within budget -- flag the trade-off explicitly. Source: standard statistical testing methodology applied to PPC by Google and practitioners.

**8-week maximum** experiment runtime. External factor contamination (competitive changes, seasonal shifts, platform updates, market conditions) exceeds the experiment's learning value beyond this point. If 200+ conversions per arm show less than 5% difference after 8 weeks, the effect is real: there is not one. Source: PPC.io operational experience across managed accounts showing diminishing result validity beyond 8 weeks.

**50% effect size** is what accounts with fewer than 30 monthly conversions would need to detect in an 8-week test. Only massive, obvious changes are testable at this volume. Source: sample size calculation for two-proportion z-test at 95% confidence and 80% power.

**20% performance degradation for 5 consecutive days** is the standard rollback trigger. This threshold balances the risk of prematurely killing a test (losing the learning investment) against the cost of continuing a losing treatment (paying for inferior performance). Source: PPC.io operational framework validated across managed accounts.

## Common Mistakes and WHY They Happen

**Calling winners before Day 21.** Treatment is ahead by 20% on Day 10, the stakeholder wants to capture the gains, and waiting 11 more days feels like leaving money on the table. This happens because early variance looks like signal when sample sizes are small. The mathematical reality: with 10 days of data and 30 conversions per arm, the confidence interval around that 20% lead is so wide that the true effect could be anywhere from -15% to +55%. The discipline is pre-committing to the minimum runtime before starting the experiment.

**Running experiments on accounts that cannot conclude them.** A manager designs a 3-variant headline test for an account generating 40 conversions per month. With a 3-way split, each arm receives roughly 13 conversions per month. To detect a 20% improvement at 95% confidence, each arm needs 400 conversions. This test would take over 30 months. The mistake happens because the manager is thinking about what to test, not whether they can test. The fix: always run the Volume Gate math before designing the experiment.

**Ignoring trade-offs between metrics.** ROAS improved 15%! Ship it. But conversion volume dropped 25% because the treatment only converts the easiest 60% of traffic. The audience narrowed, the CPA per remaining conversion looks great, but total profit declined. This happens because dashboards emphasize single metrics and the optimization target is usually one-dimensional. The discipline is mandatory trade-off analysis: check all secondary metrics for degradation exceeding 10% before applying any winner.

**Changing multiple variables at once to "save time."** New headlines, new landing page, new bid strategy, all launched together. If performance improves, you do not know which change worked. If performance declines, you do not know which change failed. This happens because sequential testing feels slow and stakeholders want comprehensive improvements. The reality is that multi-variable changes occasionally produce gains but never produce knowledge, and knowledge is what compounds over time.

**Ignoring integrity violations because the data looks good.** Budget changed mid-test, but the treatment arm still looks 18% ahead, so the result must be valid. It is not. The budget change altered traffic volume, quality, and auction dynamics. The 18% lead may be entirely attributable to the budget shift, not the treatment. This happens because acknowledging an integrity violation means restarting the test and losing the invested learning period. The discipline is treating integrity violations as fatal to results, regardless of how promising the numbers appear.

## What Changes Over Time

Google Ads experiments have expanded in capability. Campaign experiments now support more campaign types and the infrastructure for split testing within the platform continues to improve. However, the underlying statistical requirements have not changed -- the minimum data needed for reliable conclusions is a function of math, not platform features.

Smart Bidding's learning period creates a structural challenge for experimentation. Switching bid strategies triggers 1-4 weeks of volatile performance that cannot be counted as experiment data. Experiments testing bid strategy changes must account for this learning period on top of the minimum observation window, extending total runtime significantly. For campaigns spending under $50/day, the learning period may extend to 3-4 weeks.

AI-generated ad variations increasingly automate what was once manual creative testing. RSA (Responsive Search Ads) already test headline and description combinations algorithmically. This shifts the creative testing question from "which headline wins" to "which messaging angle produces the best outcomes when Google combines elements." The experimentation focus moves upstream to angles and themes rather than specific copy.

## Connected Domains

**Account auditing** identifies the questions experiments should answer. A thorough audit surfaces the specific performance gaps, alignment breaks, and structural issues that become experiment hypotheses. Without an audit first, experiment selection is guesswork.

**Bidding strategy** is one of the most impactful experiment categories but requires the most data and the longest runtime. Bidding experiments should only run after alignment is verified (score above 0.70), conversion tracking is healthy, and no other concurrent changes are planned.

**Landing page performance** determines conversion rate, which directly affects how many conversions flow into each experiment arm. Improving the landing page before running experiments accelerates data accumulation and shortens time to significance.

**Keyword strategy** determines which auctions feed the experiment. Testing a new ad angle only works if the keyword set is sending relevant traffic to begin with. Keyword and negative keyword optimization should precede creative experiments.

**Measurement and tracking** is the foundation all experiments rest on. If conversions are miscounted, undercounted, or attributed incorrectly, the experiment is comparing noise in both arms. Tracking validation is the first item on any experiment pre-flight checklist.
