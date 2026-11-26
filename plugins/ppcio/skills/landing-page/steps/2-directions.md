# Stage 3: the look

Goal: the owner picks the look of their new page in a minute, and sees their own first screen in it. The owner picks a style from our library of the best landing pages, and you make their page in it.

## 0. The licence (first, before any work)

Run `bash KIT/scripts/kit.sh licence`. When it prints `FREE`, stop here, before the brand work: the new page comes with the PPC.io licence. Say so in one line, and offer what the free version gives now: the fixes to their current page, as words they can paste (the "fix" path of the audit). Say they can paste a key any time. When they paste one, run `bash KIT/scripts/kit.sh unlock <key>` and start at part 1. Never spend their time on brand work they cannot use (buyer test, 26 Nov: 5 minutes of work, then LOCKED).

## 1. The buyer, the case and the brand

Do steps 1 and 2 of `KIT/steps/3-build.md` (`buyer.md`, `keep.md`, `case.md`, `brand.md`). The directions are built on them.

## 2. The style board

    bash KIT/scripts/kit.sh library board landing-pages/<site>/directions/styles.html <niche> <words for what they sell>

`<niche>` is a slug from `bash KIT/scripts/kit.sh library niches`: their own trade, or the closest one (an AV installer for offices: consulting). The words are what they sell, never their city. It writes a board of 9 styles (their niche first, then pages from the same family of trades) and prints each one's images and notes. Its link is `<studio address>data/files/directions/styles.html` (the studio address ends in `/s/<site>/`). Give that link and open it as SKILL.md says; never give a bare file path. Do not wait for them. Pick the style that fits their buyer best and build their first screen in it (part 3). `kit.sh look` prints the look-ready message with both links (part 3). A style they name or number later switches the build to it.

- Your pick, or the number they send: part 3.
- None of the 9 fits their buyer: part 4.

## 3. Their page in the style they picked

The style's images and notes are in what the board printed under that number: its laptop screens top to bottom, its phone screens, "Works" (what to take) and "Weak" (where it falls short).

- Build their first screen in that style, for real, as `directions/a.html`: its type, spacing, colour use, photo treatment, shapes, mood and level of finish, made with their brand: their logo, their colours, their fonts when craft.md shows real ones of their own, their photos, their words and their facts. The owner must see at once the style they picked, made theirs.
- The style leads the look of the whole page, not only the first screen. Carry it into every section in plan.md and page.html, so the page reads as one design in that style. Where the style and brand.md disagree, their logo, colours and photos win, and the style decides how they are used. Headline case is not part of a style: headlines stay in sentence case even when the style's page sets them in capitals (the guard checks it). Short labels on buttons and tags may keep the style's capitals.
- Take the style's layout, spacing, photo use and mood. Never take its headline font when its notes praise a serif or italic headline: their type comes from brand.md and KIT/TASTE.md.
- It is a style, never a template. Take no word, number, name, review, logo or photo from it, and never its headings or its sections one for one: plan the sections buyer.md needs, in your order. It never appears on the page and is never named.
- Beat it. Improve on it everywhere, for a better experience for the buyer and more enquiries for the owner, and fix where it falls short ("Weak").
- Render it at both sizes (part 5) and look at both renders beside the style's images. Fix what they show.
- Write `directions/choice.md`: a first line `Style <number>, <domain>.` (the studio names the look from it), then one plain sentence on how their page takes the style ("Your page takes its big photo and calm, roomy type, in your own green and with your own vans"), then up to 3 lines that start `- `, each one thing the look does for their buyer.
- Run `bash KIT/scripts/kit.sh look <site>`. Send the text it prints between the two `----` lines as your message, word for word. Go to stage 4 in the same turn. A change they send while you build goes into the build. Update `progress.md`.

## 4. Three directions of your own

### Find moves worth taking

1. From the library, the best pages in their niche (`library niche <slug>`) and 1 or 2 from another trade (`library find <words>` with what the buyer needs, such as "booking", "quote", "price", "before after"). Open the images.
2. The best single sections: `bash KIT/scripts/kit.sh library sections hero` (and `reviews`, `form`, `offer`, `how it works`). Each one names the move and why it works.
3. Look at `KIT/library/refs/`: `flock-*.jpg` and `our-best-*.jpg` set the level of finish. `category-*.jpg` are best-in-class pages from other trades.

Take moves, never another business's look, words or photos.

### Build 3 first screens

List 3 signature moments that only this business could have, each made from their own material: their mark, their process, their place, the moment the buyer needs them, their proof. Build one first screen for each: `directions/a.html`, `b.html`, `c.html`. Each is a real, self-contained first screen (header, headline, the line under it, proof, the main action), at their brand's colours and type, with their real photos (their URLs from `inputs/photos.md`).

Render each at both sizes (part 5):

    bash KIT/scripts/kit.sh shot landing-pages/<site>/directions/a.html a
    bash KIT/scripts/kit.sh shot landing-pages/<site>/directions/a.html a phone

The renders go to `directions/ra/` and `directions/ra-phone/`. Do the same for b and c.

Look at all 6 renders. Fix anything broken, cut off or hard to read before the owner sees it.

### The board

Write `directions/board.html`: the 3 directions side by side, each with its laptop and phone first screen (the render images), a name of 2 to 4 words, and one sentence on the idea in plain words ("Your crew and vans lead, with the 4.9 rating beside the call button"). Pick the strongest for their buyer. Send the look-ready message with the board link and your pick: "I'm building the whole page in <name> now, about 10 minutes. Say a letter or what to mix and I'll fold it in." Then go to stage 4 in the same turn.

Write `directions/choice.md` with your pick before stage 4 starts: the direction, and any mix or words they send later. Update `progress.md`.

## 5. Rendering

    bash KIT/scripts/kit.sh shot landing-pages/<site>/directions/a.html a
    bash KIT/scripts/kit.sh shot landing-pages/<site>/directions/a.html a phone

The renders go to `directions/ra/` and `directions/ra-phone/`. Look at both before the owner sees anything.
