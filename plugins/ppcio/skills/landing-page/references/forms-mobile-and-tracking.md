# Conversion Actions, Forms, Mobile UX & Paid-Search Tracking

A brilliant headline and offer still waste 100% of ad spend if the button is dead, the form asks 11 intrusive questions on a phone, or Google Ads is blind to conversions.

## 1. Conversion Action Matrix by Page Type

Pick ONE clear primary action and keep its exact label consistent across the entire page (hero, mid-page decision points, final band):

| Business / Page Type | Primary Action | Secondary Action | Where It Belongs |
|---|---|---|---|
| **Emergency / Urgent Trades** (plumber, locksmith, HVAC breakdown, towing) | **Tap-to-call (`tel:`)**, prominent | Short callback / dispatch form | Screen 1 (desktop + mobile) + sticky mobile call bar |
| **Considered Local / Home Services** (roofing, solar, kitchens, windows) | **Short inline estimate form** (or 2–3 step quote funnel) | Direct phone number (`tel:`) | Screen 1 (desktop), prominent CTA/form on mobile + sticky bar |
| **Medical / Dental / Med Spa** | **Book consultation** (inline booking or callback request) | Phone call (`tel:`) | Screen 1 + after practitioner/before-after proof + end |
| **B2B Services / High-Ticket SaaS** | **Book demo / Request audit** | Interactive tour / pricing / download | Screen 1 + after case studies + end |
| **Self-Serve SaaS** | **Start free trial / Create account** | Watch 2-min walkthrough | Screen 1 + after product proof + pricing + end |
| **E-commerce PDP** | **Add to Cart / Buy Now** | Express checkout / size guide | Screen 1 beside price, shipping, returns & reviews |

## 2. Three Measured Faults That ALWAYS Cost Conversions

Fix these immediately on any page:
1. **A CTA that leads nowhere** (broken `#` anchor, dead link, modal trigger that fails, or button that scrolls back to the top).
2. **A gated buy button with zero explanation** (disabled "Add to Cart" before variant selection with no visible prompt telling the buyer what to pick).
3. **A displayed phone number with no clickable `tel:` link** on mobile (forcing a thumb-typing buyer to copy-paste digits).

## 3. Form Friction & Field-Earning Discipline

Every field on a lead form must earn its place. Ask only what you genuinely need to reply or qualify:

- **Default sweet spot for paid search:** **3–5 fields** (e.g., Name, Phone or Email, Postcode/ZIP, Service needed).
- **Order fields from easiest to highest friction:** Start with easy selection/postcode/service (micro-commitment), put Name/Email/Phone last.
- **When to use a 2–3 step quote funnel:** When you genuinely need 6–8 qualifiers (roof type, home size, timeline, ZIP, contact info). Step 1 asks 1–2 easy non-personal tap questions (e.g., *"What kind of roof do you have?"* + ZIP), and contact details appear only on the final step once momentum is built.
- **Use real mobile input types & autofill:**
  - Phone: `type="tel" autocomplete="tel"`
  - Email: `type="email" autocomplete="email"`
  - Name: `autocomplete="name"`
  - Postcode/ZIP: `autocomplete="postal-code"`
- **Outcome-based submit button:** Never *"Submit"* or *"Send"*. Write the specific thing they get: *"Get My Free Roof Estimate"*, *"Check Same-Day Availability"*, *"Book My 15-Min Audit"*.
- **No fake-working forms:** During build/preview, never let an unconnected form pretend it sent a lead. Show an explicit notice until connected to the real endpoint/CRM/Formspree/Netlify Forms.

## 4. Mobile UX Non-Negotiables (~75% of Paid Clicks)

- **Minimum tap target:** 44×44px for buttons, form inputs, and accordion headers.
- **Zero horizontal overflow** at 390px viewport width.
- **Body text ≥17px**, form inputs ≥16px (prevents iOS Safari auto-zoom on focus!).
- **Tame third-party popups:** Oversized live-chat widgets, cookie bars, and promo modals routinely swallow the bottom 30% of mobile screens and cover CTAs. Keep chat unobtrusive or replace with a clean sticky call/estimate bar.
- **Keep navigation minimal on dedicated LPs:** Strip multi-level mega-menus, blog links, and social icons out of the header — every outbound link in a paid-search LP header is a paid click escaping without converting.

## 5. Paid-Search Conversion Tracking & Pre-Traffic QA

Smart Bidding (Target CPA / Target ROAS / Maximize Conversions) is only as good as the conversion data flowing back from the landing page.

### Reading Tracking Tags Accurately
- **`google_ads` (`AW-...`) present:** Direct Google Ads conversion tag is in the page code.
- **No `google_ads`, but `gtm` (`GTM-...`) or `shopify_pixels` present:** Conversion tags likely fire inside that container — always verify inside GTM Preview / Tag Assistant before launching, never claim tracking is "missing".
- **Neither present:** Google Ads cannot count leads/sales from this page — flag as a Day-1 blocker before sending paid traffic.

### Pre-Launch 6-Point QA Checklist (Before Turning Ads On)
1. **Live form delivery test:** Submit a real test lead on a phone and confirm it lands in the client's inbox/CRM AND triggers the thank-you state/event.
2. **Conversion tag fire test:** Confirm Google Ads conversion + GA4 event fire *once* on real submission (never on page load, never double-counted).
3. **Call tracking / DNI check:** If the account uses CallRail / WhatConverts / Google Forwarding Numbers, verify the displayed phone number swaps cleanly on `?gclid=test` visits and that `tel:` href updates too.
4. **Tracking tag isolation:** Never paste live GTM/GA4/Meta tags into local draft previews (renders pollute real analytics). Inject them only in the production live copy (`live/index.html`).
5. **Speed & LCP check:** Optimize hero photos (WebP/compressed JPEG, explicit width/height, `fetchpriority="high"` on hero image, `loading="lazy"` below the fold) so mobile LCP stays fast (~2.5s or under).
6. **Clean post-launch measurement:** Allow for conversion lag (use the bundled `conversion-lag-check` skill) before judging a new page in week 1 — compare qualified lead rate and cost per qualified lead, not just raw clicks.
