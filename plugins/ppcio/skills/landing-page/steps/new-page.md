# Build a new page from scratch (new campaign or offer)

Use this mode when the owner is launching a **new Google Ads campaign, service line, location, or offer** and has **no dedicated landing page yet** (only their main website, or plain notes about what they sell).

## How this differs from a Redesign

- **No old landing page to audit or score-beat.** Do not waste time auditing a generic homepage as if it were the broken LP — use their main site strictly for **brand DNA** (logo, colours, typography, real photos, verified reviews, licences, phone number, voice) and real facts.
- **Research the exact campaign intent.** Search the web for the exact terms their new ads will bid on and capture 2–3 real paid competitors (`kit.sh capture <url> landing-pages/<site>/competitors/<name> --quick`) so the new page beats what searchers see right now.

## Workflow

1. **Quick intake (ask only what is missing, one question at a time):**
   - What exact service, product, or offer is this campaign selling?
   - What is their main website URL (if they have one) so you can pull their real brand, photos, and reviews?
   - Where do their customers live, and what counts as a win (call, quote form, booking, demo, sale)?
   - Optional: 3–5 search terms or an ad headline they plan to run.
2. **Capture brand & market:**
   - If they have a main website, capture it (`kit.sh capture <url> landing-pages/<site>`) purely to extract `craft.md`, `inputs/fonts.css`, `inputs/logo.*`, `inputs/photos.md`, `inputs/tracking-tags.html`, and real customer proof (`inputs/site-page-text.md`, `inputs/pages/*.md`).
   - Capture 2–3 competitors bidding on the target campaign search terms.
   - Write `context.md`, `ads.md` (if keywords/ads given), and `facts.md` (verified facts only — never invent reviews, prices, or guarantees; list any gaps under `## To confirm`).
3. **Pick the style & build the first screen (`KIT/steps/2-directions.md`):**
   - Run `kit.sh library board` for the campaign's exact niche, build `directions/a.html` in their brand for the new offer, render laptop + phone, write `directions/choice.md`, and send the look-ready message (`kit.sh look <site>`).
4. **Build, check, and package (`KIT/steps/3-build.md`, `4-review.md`, `5-go-live.md`):**
   - Follow `KIT/references/vertical-playbooks.md` and `KIT/references/above-the-fold-and-message-match.md` so screen 1 matches the new campaign's ad scent cold.
   - Run the case check, render laptop + phone, run `kit.sh guard` and `kit.sh checkfacts`, run the critic against the top 2 captured competitors (not an old page), fix every fault, run `kit.sh pack`, write `ready.md`, and deliver `<site>-page.zip`.
