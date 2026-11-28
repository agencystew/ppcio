# Taste: What Makes an Agency & In-House PPC Ops OS Look Like Linear/Stripe vs. a 2002 Admin Table

Read this before writing a single line of HTML or CSS. You are NOT rendering a generic Python template. You are building a bespoke operational web app natively inside this agency or company's real visual brand.

## What 10/10 Looks Like (The Bar)

- **Unmistakably Their Brand:** Built strictly from `inputs/brand.json` and `inputs/brand.md` (their real logo/wordmark, real computed palette, real webfonts loaded from the extracted stylesheet URLs, their light or dark polarity, and their border-radius language).
- **Quiet Operational Precision:** Calm density, zero alarm fatigue. `BROKEN` accounts surface unmistakably at the top; `AT_RISK` sits second; `FINE` accounts collapse into one quiet summary count so Monday standups take 10 minutes instead of 2 hours.
- **Visual Dependency Locking:** When an account has broken conversion tracking, traffic-edit moves (`Waiting on tracking`) MUST look visually gated with physically `disabled` checkboxes and clear dependency badges so no junior manager accidentally pauses keywords before tracking is restored.
- **Real Interactive Software Feel:** Working multi-account `<select>` switcher or sidebar rail updating every KPI, move card, grade table, LP leak table, and opportunity figure smoothly; real 6-tab switching; persistent `localStorage` task checkboxes; working `"Not right? Tell us why"` rejection memory rendered safely via DOM `textContent` (zero XSS); crisp inline SVG bars/gauges; `font-variant-numeric: tabular-nums`; clean `@media print` view.
- **Zero Unsolicited Advice on Raw Data Tabs:** Keep Tab 6 (`Full Data`) completely clean and scannable so senior managers can verify the raw numbers without popup advice clutter.

## What Is Strictly Banned (Instant Fail in Critic Loop)

- **Invented Generic Themes:** Never default to invented cream/sand/navy palettes or italicized serif headlines when the agency's real website is sharp dark mode, minimal white, cyan, or bold geometric sans.
- **Broken JS or Blank Dynamic Containers:** Never nest unescaped quotes inside inline event handlers (always use `data-*` attributes + `this.dataset.*` or `addEventListener`). Every dynamic container MUST populate on load with `0` browser `pageerror` events.
- **Audit Anti-Patterns (`verify_audit.py` 6 Gates):** Zero menu-path teases ("Open Google Ads > Campaigns"), zero `$0` budget instructions, zero blame language ("your team broke"), zero confected `/100` health scores, zero unsequenced traffic cuts on broken-tracking accounts, zero em dashes, zero ecom/lead-gen vocabulary leaks.
- **AI Copy Slop:** Zero paired poetic fragments, zero deck words ("unlock", "elevate", "seamless", "leverage", "robust"), zero `Lorem ipsum` or placeholder numbers.

## 5-Point Visual Critic Rubric (Score 1 to 10 Before Showing the User)

Open `desktop.png`, `desktop-full.png`, and `phone.png` from `studio_board.cjs shot` and score ruthlessly:
1. **Brand Fidelity (9+):** Does this look like bespoke internal software built by their own product team?
2. **Triage Clarity & Dependency Restraint (9+):** Can a director see what is `BROKEN`, what is locked on tracking, and what is protected (`What Is Working`) in under 5 seconds?
3. **Interactive & Data Craft (9+):** Does account switching, tab switching, checkbox persistence, and rejection logging work flawlessly with crisp `tabular-nums` alignment?
4. **Mobile 390px Polish (9+):** Zero horizontal scroll, responsive tables/cards, readable badges?
5. **Truth & Zero Slop (10/10):** `verify_audit.py` passes all 6 gates, `verify-dom` passes with `0` JS errors, and every figure traces directly to `ops_state.json`.

If ANY score is under 9, fix it and re-shoot before handing over (up to 3 rounds).
