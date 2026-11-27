# Thank-you pages and quiz funnels

Use this when the owner asks for the page after an enquiry (a thank-you page) or a guided quiz funnel in place of a form.

1. Do the audit first, as for a landing page, so you know the buyer, the offer and the brand.
2. Read the 4 prompts for the job in `KIT/postclick/build/`:
   - Thank-you page: `atlas-thankyou-brief-strategist.md`, `verse-thankyou-copywriter.md`, `mason-thankyou-section-builder.md`, `hawk-thankyou-critic.md`.
   - Quiz funnel: `atlas-funnel-brief-strategist.md`, `verse-funnel-copywriter.md`, `mason-funnel-section-builder.md`, `hawk-funnel-critic.md`.
3. Write the brief (`brief-<kind>.md`) as the brief prompt says: one buyer, the questions or the confirmation, what happens next.
4. Build one self-contained `page.html` in their brand, as `steps/3-build.md` says for a landing page. Use the copy and section rules of the prompts. Never invent a review, a price or a promise.
5. Run the guard and render it at laptop and phone width (`kit.sh review` as for a landing page). Then check it against every failure mode in the critic prompt, fix what fails, and render again.
6. Send it as `steps/4-review.md` says.
