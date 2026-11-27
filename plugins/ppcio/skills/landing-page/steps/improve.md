# Improve my page (keep their design, upgrade conversion)

Use this mode when the owner **likes their current landing page** and wants to lift conversions **without** throwing away their layout, brand feel, or page structure.

## Core rule: upgrade, never rebuild from scratch

- **Keep their layout, sections, fonts, colours, and photos.** They chose not to rock the boat. Do not introduce a new style direction, a new palette, or a different grid structure.
- **Keep every live section and offer intact.** Never silently delete an existing promo, service block, or section unless they explicitly ask to cut it.
- **Make 6 to 10 high-impact, surgical conversion upgrades** grounded strictly in the audit (`audit.md`), `facts.md`, and `KIT/references/`.

## The high-leverage upgrades (pick the 6–10 that fit this page)

1. **First-screen promise & ad scent:** Tighten the H1 and subhead into plain founder-voice outcomes matching what buyers searched for (preserve multi-service scope).
2. **Proof beside the main action:** Move their real rating + review count + source directly next to the hero button and every major decision button.
3. **Form or call above the fold:** Bring their estimate/quote form or tap-to-call (`tel:`) action onto screen 1 where buyers expect it, and add a slim sticky mobile action bar.
4. **Offer & risk-reversal clarity:** Surface their real starting price, financing disclosure, warranty, or no-obligation terms right beside the ask (never invent terms they do not state).
5. **Action continuity:** Give every primary button one consistent outcome-led label and add a plain "what happens next" line directly beneath it.
6. **Clean out leaks:** Replace weak/stale copy (old years, filler slogans, negative featured reviews) with verified customer quotes and real facts from `inputs/pages/` or `facts.md`.
7. **Mobile-first rescue:** Fix 390px overflow, oversized chat popups covering CTAs, unclickable phone numbers, tiny text (<17px body / <16px inputs), and hidden nav actions.
8. **Section headings that read alone:** Rewrite topic-label H2s (*"Why choose us"*, *"Our services"*) into outcome-led headings a scanner understands cold.

## Workflow

1. Run `audit` first (`KIT/steps/1-audit.md`) if not already done, so every upgrade targets a real, verified leak.
2. Build `page.html` as a clean, self-contained HTML reproduction of their live page's design system (`craft.md`, `inputs/fonts.css`, their real photos and colours) with the 6–10 named conversion upgrades applied directly.
3. Write `improvements.md` listing each upgrade cleanly as **Now → Changed to → Why**.
4. Render at laptop (1440px) and phone (390px), run `kit.sh guard` and `kit.sh checkfacts`, and visually compare `r1/first.png` and `r1-phone/first.png` against `inputs/live-page-today.png` and `inputs/live-phone-today.png` to verify their brand look stayed unmistakable while conversion clarity jumped sharply.
5. Run `kit.sh pack`, write `ready.md`, and run `kit.sh review` to deliver the standalone handover zip and side-by-side comparison.
