# The postclick prompts

These are the prompts that ran postclick (postclick.ppc.io) from August to November 2026: the audit team, the build team, the thank-you page and funnel builders, and the A/B test forge. They are here word for word, so anyone can read how each expert thinks.

The kit runs its own versions of the audit prompts as agents (`agents/lp-*.md`). The other prompts are working references: the kit reads them for the jobs listed under "When the kit reads them". Each prompt was written for a pipeline that returns JSON. In the kit, use the thinking and the checks, and write the file the kit step asks for.

The internal names (Atlas, Vela, Verse, Mason, Iris, Hawk, Forager, Quill) are the roles in that pipeline. Never show them to a buyer.

## Audit (`audit/`)

| Prompt | What it does | In the kit |
|---|---|---|
| conversion-action-auditor | Checks the form, button, phone and booking at the end of the page | agent lp-actions |
| awareness-matcher | Matches the page to how aware the traffic is (5 stages) | agent lp-ad-match |
| page-anatomy-auditor | Maps each section and the order a buyer needs | agent lp-anatomy |
| buyer-simulator | Walks one buyer through the page, second by second | agent lp-buyer-journey |
| buyers-personas | Who the page is written for, against who lands on it | agent lp-buyers |
| competitive-scanner | Compares the page with competitor pages | agent lp-competitors |
| copy-deck-rewriter | Rewrites the key lines in the owner's voice | agent lp-copy |
| design-critic | Judges the design from the screenshots | agent lp-design |
| forensics-runner | Reading level, speed, technical faults | agent lp-forensics |
| leaks-hunter | Killers, weak copy and friction, with fixes | agent lp-leaks |
| offer-auditor | 7 checks on the offer | agent lp-offer |
| psych-lever-auditor | The persuasion levers present and missing | agent lp-psych |
| trust-gap-auditor | The proof a stranger would believe | agent lp-trust |
| context-extractor | What the business does, for whom, where | the capture step (context.md) |
| quick-scan-hunter | The 3 to 5 things a consultant sees in 30 seconds | the first look |
| brand-pack-extractor | Colours, type, photo style, voice of the brand | reference for the build |
| buyer-lens | 4 buyers, one card each | reference |
| journey-synthesis | What the 3 buyer walks show together | reference for audit.md |
| direction-strategist | 6 design directions for a rebuild | reference for the style board |
| direction-evidence | Why each direction exists, from the audit | reference for choice.md |
| concept-explore-judge | Picks the strongest of many hero sketches | reference for the style board |
| opportunity-planner | The page a business is missing, and its case | the site plan job |
| suite-planner | One judgement per page across a whole account | the site plan job |
| project-comparison | Compares pages across one account | the site plan job |

## Build (`build/`)

| Prompt | What it does |
|---|---|
| atlas-brief-strategist | The locked brief: one buyer, one promise, one action |
| vela-art-director | The design system for this brand and this buyer |
| forager-reference-scout | Which reference pages to borrow moves from, and why |
| verse-copywriter | All page copy, in the founder's voice |
| iris-image-conceptor | Image concepts, never fake evidence |
| mason-section-builder | Builds one section of HTML at a time |
| quill-editor | Joins the sections and checks the page (code, no model) |
| hawk-critic | 15 failure modes a fresh reviewer checks |
| build-agent, build-agent-v2, build-agent-keep | The one-agent build: new page, or keep the look and improve it |
| build-critique, build-team, build-director* | Reviewers who judge a draft against the live page |
| build-fact-check | Checks the page against the owner's own words |
| builder-page, critic-concept | Builds and judges a page from a chosen concept |
| *-funnel-* | The same team for a guided quiz funnel |
| *-thankyou-* | The same team for the page after an enquiry |

## A/B tests (`ab-test/`)

| Prompt | What it does |
|---|---|
| hypothesis-pool | A ranked list of one-change tests for a finished page |
| variant-patcher | Makes one variant with exactly one change |

## House rules (this folder)

- `voice.md`: how every line talks to the owner.
- `fix-lines.md`: how a fix reads.
- `local-prices.md`: how a price shows in the buyer's currency.
- `no-fabrication-rule.md`: never invent a review, a number or a result.

## When the kit reads them

- A thank-you page or a quiz funnel: `steps/thankyou-funnel.md`.
- A/B test variants: `steps/variants.md`, with `ab-test/`.
- A plan for a whole site or account: `audit/suite-planner.md` and `audit/opportunity-planner.md`.
- A deeper build: the build step may read `build/hawk-critic.md` for the 15 failure modes, and `build/vela-art-director.md` before it picks a look.
