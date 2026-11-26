# Stage 5: go live

Goal: the page is live, or in the hands of whoever runs their site, today.

First run `bash KIT/scripts/kit.sh pack landing-pages/<site>`. It copies every photo the page loads from their old site into `assets/`, so the page stands alone. Then it writes the live copy: the folder `live/` (index.html with their tracking tags, and the assets) and a zip of it, `<site>-page.zip`, in the work folder. Only the live copy carries their tags, so your renders never send visits to their analytics. Do not message yet. Render page.html again and look: every photo must still show.

Then read where their website lives from `platform` in `inputs/site-facts.json` (WordPress, Shopify, Squarespace, Wix, Webflow, or hand code), and give the one path that fits, with the zip's link. When it says `unknown`, never stop to ask: give the web-person path (the zip and a 5-line note for whoever runs their site), and add one line: "Tell me where your site is built (WordPress, Shopify, Wix...) and I'll give you the exact steps."

- **They have a developer or agency:** send them the zip. Write `handover.md` for the developer: what changed and why (from audit.md, in 5 lines), the form and where it must send enquiries, the tracking tags their live page has (from `inputs/site-facts.json`) that the new page must keep, and the address the page should replace.
- **WordPress:** a Custom HTML block on a blank page template, or a landing page plugin that takes HTML. Tell them which tracking tags must stay.
- **Webflow, Squarespace, Wix, Shopify:** these builders do not take a whole HTML file well. Give the page section by section: the words to paste, the photo for each section, and the colours and fonts. Make the short list they follow in their builder, and link it.
- **No website, or they want it live now:** Netlify Drop (app.netlify.com/drop): they drag the `live` folder onto the page and get a live link in a minute. They can connect their own domain after.

Before it goes live, check these 3 things yourself:

1. **The form sends somewhere.** A form in page.html shows the fields but sends nothing until it is connected (their builder's form, Formspree, Netlify Forms, or their CRM). Never let them think it works before it is connected.
2. **Tracking.** The Google Ads tag, GA4 and any pixel their live page has must be on the new page too, or their ads lose conversion data. pack put them into live/index.html from inputs/tracking-tags.html; check pack said it did. If you change page.html after this, run pack again so the live copy matches. A tag their site adds through GTM comes back with the GTM tag.
3. **Their phone number and links.** Tap-to-call works, and every link goes somewhere real.

When stage 4 sent its page-ready message, it already carried the zip and the go-live line: do not send another message, only write `handover.md` and the section list their platform needs. Otherwise send one "live copy ready" message: the zip's link, the one path for their site, and only the item they must do themselves (for example, connect the form). Update `progress.md`: live, handed over, or what is left. The stage ends with that message.
