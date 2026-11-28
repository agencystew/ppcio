# Taste: What Makes a Reporting System Look Like a $50,000 Custom Product vs. Cheap AI Slop

Read this before writing a single line of HTML or CSS. You are NOT rendering a generic Python template. You are designing a bespoke interactive web product natively inside this agency or company's real brand.

## What 10/10 Looks Like (The Bar)

- **Unmistakably Their Brand:** Pulled straight from `inputs/brand.json` and `inputs/brand.md` (their real logo/wordmark, their exact computed background/surface/accent colors, their real webfonts loaded from the extracted stylesheet URLs, their light or dark polarity, and their border-radius language).
- **3-Second Executive Scan:** A busy business owner or CFO understands the entire week in 3 seconds: total results, Brand vs. Non-Brand truth, budget pacing vs. month elapsed, and the single calm narrative verdict.
- **Bespoke Visual Data Craft:** Crisp inline SVG charts engineered from `facts.json` (month-to-date pacing gauge with elapsed-day tick, Brand vs. Non-Brand comparison bar, 6-month enquiry/revenue bar chart with value labels and subtle hover tooltips, KPI sparklines, proportional campaign spend bars). Every metric uses `font-variant-numeric: tabular-nums`.
- **Genuine Web-App Polish:** Working interactive tab toggles (Converting Terms / Waste & Negatives / What We Did), Internal Call Prep vs. Copy-Ready Monday Email switch with a real one-click **Copy Email** button, responsive 390px phone layout with zero horizontal scroll, and a clean `@media print` stylesheet.
- **Calm, High-Trust Restraint:** No bright-red alarm boxes for normal 8% weekly noise. When `safety_hold` is true, display a clear, composed internal hold banner so nobody mails broken tracking numbers to a client.

## What Is Strictly Banned (Instant Fail in Critic Loop)

- **Invented Generic Themes:** Never default to generic cream/sand backgrounds, generic navy/forest palettes, or italicized serif display headlines when the user's real brand is crisp modern sans, bold dark UI, cyan, emerald, or high-contrast black-and-white.
- **2002 Template Layouts:** No uniform grey-bordered boxes stacked identically, no unstyled default `<select>`/`<button>` controls, no cramped data tables that overflow on a 390px phone, no walls of raw text without visual hierarchy.
- **Classic AI Copy & Deck Slop:** Zero em dashes, zero paired poetic fragments ("Built for speed. Ready for scale."), zero deck words ("unlock", "leverage", "seamless", "elevate", "robust", "holistic"), zero Google Ads platform jargon ("learning phase", "impression share", "quality score") in client-facing views.
- **Number Drift or Unrendered Placeholders:** Never hardcode fake numbers, `Lorem ipsum`, `TBD`, or `$XX,XXX`. Embed the exact verified `facts.json` payload directly into the page or render every figure verbatim from it.

## 5-Point Visual Critic Rubric (Score 1 to 10 Before Showing the User)

Open `desktop.png`, `desktop-full.png`, and `phone.png` from `studio_board.cjs shot` and score ruthlessly:
1. **Brand Fidelity (9+):** Does this look like it was designed by their own senior brand team?
2. **Executive Hierarchy (9+):** Do the 3 to 4 numbers that matter dominate immediately, with Brand kept cleanly separate from Non-Brand?
3. **Chart & Data Craft (9+):** Are SVGs sharp, properly spaced (zero overlapping labels), tabular-aligned, and instantly readable?
4. **Mobile 390px Polish (9+):** Zero horizontal scroll, zero clipped tables, clean stacked cards, comfortable tap targets?
5. **Truth & Zero Slop (10/10):** Zero `verify_report.py` failures, zero `verify-dom` failures, zero JS errors, zero AI buzzwords.

If ANY score is under 9, fix it and re-shoot before handing over (up to 3 rounds).
