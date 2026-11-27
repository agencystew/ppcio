---
name: sales-intelligence
description: "Prepares an agency new-business sales call from one prospect URL without account access: combines cross-platform 'impossible to know' signals (pixels/tech stack, Meta Ad Library, Google Ads Transparency, GBP), 3-competitor offer/page teardown, client red-flag disqualification, worst-case economics pitch, and 3 sharp call openers. Use for agency pitch prep. Not for auditing an active client's Google Ads CSV (use ppc-strategic-audit)."
---

# Sales Intelligence & Pitch Prep Engine

Most agency discovery calls sound identical: *"We saw your website and think we can help grow your Google Ads!"* Prospects ignore that pitch instantly. Your job is to turn a single prospect URL (with zero account access) into an **"impossible to know" pre-call dossier** that proves you actually inspected their pixels, live ads, reviews, and top 3 local/category rivals, while honestly screening out bad-fit prospects BEFORE the agency wastes a proposal.

## Start here

- Check if a local `landing-pages/<site>/` folder already exists (`context.md`, `facts.md`, `audit/competitive.json`, `competitors/*`) so you reuse captured screenshots and real page copy!
- Only 1 input is required: **Prospect URL** (optional: target city/service, 1 to 3 known competitors, rough budget).
- **Intellectual Honesty & Zero Fabrication:** Never invent ad spend, traffic volume, conversion rates, or competitor claims. Cite only what you actually observed on pages, HTML/pixels, Ad Transparency libraries, or user notes; explicitly label auto-discovered competitors with: *"Verify these rivals with the prospect before quoting them as primary competitors."*

## The "Impossible to Know" Research & Pitch Pipeline

1. **Cross-Platform Tech, Ad & Proof Forensics (What Proves You Did Homework):**
   - **Website & Tech/Tracking Signals:** Check visible tags/pixels (GTM, GA4, Google Ads tag, Meta Pixel, Clarity/Hotjar, CallRail/dynamic phone swapping) and mobile conversion friction (click-to-call, buried form, slow hero). Spotting a missing Google Ads tag or un-tracked raw `tel:` link while running live ads is an instant call-winning insight!
   - **Active Ad Footprints:** Inspect **Google Ads Transparency Center** and **Meta Ad Library** (when accessible, or note exact checks for the rep) + **Google Business Profile** review count/rating vs. rivals.
   - **Organic Traffic PPC-Equivalent Framing:** Note where strong organic trust (reviews, rankings) is currently NOT carried into paid ads or screen one (`lp-message-match`).
2. **3-Competitor Offer & Landing Page Teardown (Real Rivals Only - Exclude Yelp/Directories):**
   - Compare Prospect vs. 3 direct competitors side-by-side on **Screen-One Clarity (3-Second Test)**, **Concrete Offer / Price Anchor**, **Trust Proof (Have / Buried / Missing)**, **Risk Reversal / Guarantee**, and **Conversion Friction**.
   - Highlight the single clearest **buried asset** (e.g., 1,200 five-star reviews hidden in the footer while a weaker rival leads with "$99 special" above the fold).
3. **Client Red-Flag Disqualification Matrix (Internal Eyes Only):**
   Screen honestly BEFORE pitching! Flag any of these red flags plainly:
   - Budget too tiny to survive category CPCs (e.g., $1,000/mo in $45-CPC personal injury legal).
   - Weak/uncompetitive core offer or broken website that refuses landing-page fixes (`AVS <= 2/5`).
   - Unrealistic 14-day ROI demand on a 60-day B2B sales cycle, or refusal to share conversion/CRM access.
4. **Worst-Case Projection Pitch & 3 Sharp Call Openers:**
   - Never pitch bloated "3x ROAS guaranteed!" fantasy math. Use conservative **Worst-Case / Break-Even Math** (`python3` verified from user-supplied ticket size/margin, or clearly marked illustrative placeholders) showing what modest, believable improvement looks like!
   - Deliver **3 human, zero-fluff call openers** quoting exact verifiable things seen on the prospect's site and ads, plus **2 testable 30-day hypotheses** with explicit check-in/kill milestones.

### Weak 5/10 vs. 10/10 Call Opener

- **Amateur:** *"Hi! I reviewed your website and noticed opportunities to elevate your digital footprint and optimize your PPC funnel for stronger ROI. Can we grab 15 minutes?"* (Generic spam anyone could send without opening the URL.)
- **10/10 Senior:** *"Quick observation before our call: you are running 6 active Google Ads for 'Denver roof replacement' sending clicks to your general homepage where your 4.9-star / 640-review badge sits 4 scrolls down and your phone number is plain text (no CallRail tracking). Meanwhile, your two auction rivals (Bell and Plumbline) both put a dollar offer + review count on screen one. Even if a dedicated page only nudges conversion rate from 3% to 4.5% (conservative math, verify against your real current CPL), that cuts your cost per booked estimate by a third without raising ad spend."*

## Closed-Loop Self-Critique (Run Before Answering)

Before delivering your sales dossier:
1. **Evidence & zero-fabrication check:** Is every pixel, ad, review count, and competitor quote grounded strictly in observed pages/inputs (zero invented traffic or spend numbers), with the explicit auto-discovered competitor caveat?
2. **Disqualification & restraint check:** Did I include an honest internal **Red-Flag Disqualification Check** (telling the agency when to walk away or require a landing-page fix first!) and conservative worst-case math rather than hyped promises?
3. **Human voice & handoff:** Crisp, sharp, zero-em-dash English separated clearly into **60-Second Executive Brief**, **Prospect vs. 3-Rival Teardown**, **3 Call Openers + 2 Hypotheses**, and **Internal Sales & Disqualification Notes**. Route next into `landing-page` (mocking up a winning page for the pitch) or `google-ads-audit-sales-presentation` (deck once account data is shared).
