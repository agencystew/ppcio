# A/B test variants & focused post-build edits

Use this mode after a page is built (`landing-pages/<site>/page.html`) when the owner wants **split-test variations** to test in Google Ads / Optimizely / VWO / Unbounce, or wants targeted follow-up edits.

## 1. Focused post-build edits (single change requests)

When the owner asks for a specific edit (*"make the form 2 steps"*, *"swap the hero photo"*, *"lead with financing"*):
- Edit `page.html` surgically (never rewrite the whole file from scratch or alter unrelated sections).
- Preserve strict truth: if a requested change would introduce an unverified claim or figure, fulfill the supported part and state the exact fact needed in one plain sentence.
- After every edit: render laptop + phone (`kit.sh shot`), run `kit.sh guard` and `kit.sh checkfacts`, visually inspect both screenshots, re-run `kit.sh pack` so `live/` and `<site>-page.zip` stay in sync, and show the updated page.

## 2. Generating A/B test variants (forking the finished page)

When the owner asks for **A/B test versions** (default: 3 variants; up to 5 if requested):

Each variant forks `page.html` into `landing-pages/<site>/variants/v1.html`, `v2.html`, `v3.html`... and changes **ONE clear conversion lever** so test results stay interpretable:

| Variant | Single Lever Tested | What Changes (Rest of Page Stays Identical) |
|---|---|---|
| **V1: Outcome vs. Pain Headline** | Hero framing | Tests a pain-relief headline against the control's outcome headline (subhead + first-screen proof adjusted to match) |
| **V2: Offer & Risk-Reversal Lead** | Offer prominence | Moves the strongest verified offer term (price anchor, financing, warranty, or turnaround speed) directly into the hero headline/subhead and beside the submit button |
| **V3: Action Friction (Form vs. Multi-Step / Call)** | Conversion mechanic | Tests a 2-step micro-commitment quote opener (or prominent tap-to-call lead) against the control's inline form |
| **V4: Proof-First Hero** *(optional)* | Social proof placement | Places a named customer quote or before-and-after proof block directly in the hero beside the CTA |
| **V5: Short Direct-Response Cut** *(optional)* | Page length | Tight 4 to 5 section high-intent version for bottom-of-funnel / brand / retargeting clicks |

### Rules for every variant
1. **Strict truth:** Zero invented numbers, reviews, prices, guarantees, or urgency (every claim comes from `facts.md` or `inputs/site-page-text.md`).
2. **Same brand & quality bar:** Every variant passes `kit.sh guard` and `kit.sh checkfacts` and renders cleanly at 1440px and 390px (`kit.sh shot variants/v1.html v1` + `phone`).
3. **Comparison board:** Write `landing-pages/<site>/variants/board.html` showing the Control alongside each variant's desktop + phone first screen, the exact hypothesis (**Change / Why / Primary Metric**), and direct links to each variant file.
4. **Honest testing advice:** Never promise a lift percentage. Remind the owner in one line to measure **qualified enquiries/sales** (not clicks), keep tracking identical across variants, and if traffic is under ~300 conversions/month, test only the single biggest lever (Control vs. V1) rather than splitting traffic 5 ways.

For the full test pool and the one-change rule, read `KIT/postclick/ab-test/hypothesis-pool.md` and `KIT/postclick/ab-test/variant-patcher.md`.
