// node live-craft.cjs <url> <out craft.md>: their live page's craft as data (round M change 8).
// Fonts per role and where they load from, button style, radii, shadows, motion.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
// Review 14, K5 (21 Nov): the marks of an AI-made page that their live page
// has, by the scan the guard runs on the new page (slop.cjs, the worker's
// slop.ts), on the CSS rules that style something the page shows: a
// framework's unused rules are not their look. The guard names these marks
// as their look, not a fix. A stylesheet on another host cannot be read in
// the page, so it is fetched.
async function liveMarks(p) {
  const { slopMarks } = require(path.join(__dirname, 'slop.cjs'));
  const sheets = await p.evaluate(() => [...document.styleSheets].map(s => { try { return { css: [...s.cssRules].map(r => r.cssText).join('\n') }; } catch (e) { return { href: s.href }; } }));
  const texts = await Promise.all(sheets.map(s => s.css !== undefined ? s.css : s.href ? p.request.get(s.href, { timeout: 10000 }).then(r => (r.ok() ? r.text() : '')).catch(() => '') : ''));
  const html = await p.evaluate(texts => {
    const vis = e => { const c = getComputedStyle(e), rc = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && rc.width > 0 && rc.height > 0; };
    const shown = new Set([document.documentElement, document.body, ...[...document.querySelectorAll('body *')].filter(vis)]);
    // .card:hover h3 styles the h3 in .card: match it without its states and parts.
    const bare = sel => sel.replace(/::?[a-z-]+(?:\((?:[^()]|\([^()]*\))*\))?/gi, m => (/^:(?:not|is|where|has)\(/i.test(m) ? m : ''));
    const used = [];
    const keep = rules => { for (const r of rules) {
      if (r.selectorText) { let hit = false; try { hit = [...document.querySelectorAll(bare(r.selectorText) || '*')].some(e => shown.has(e)); } catch (e) {} if (hit) used.push(r.cssText); }
      else if (r.cssRules) keep(r.cssRules);
      else if (/^@font-face/i.test(r.cssText)) used.push(r.cssText); } };
    for (const t of texts) { if (!t) continue; const s = new CSSStyleSheet(); try { s.replaceSync(t); keep(s.cssRules); } catch (e) {} }
    const doc = document.documentElement.cloneNode(true); doc.querySelectorAll('style,script,noscript,template').forEach(e => e.remove());
    const st = document.createElement('style'); st.textContent = used.join('\n'); (doc.querySelector('head') || doc).appendChild(st);
    return '<!doctype html>' + doc.outerHTML;
  }, texts);
  // A CSS rule can make an <i> italic when every <i> on the page is an icon (johnnyrooter.com, 26 Nov): the guard
  // then called italic accent words "their own look", and the site has none. Count it only when real words show
  // in italic.
  const italicWords = await p.evaluate(() => [...document.querySelectorAll('body *')].some(e => {
    if (getComputedStyle(e).fontStyle !== 'italic') return false; const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ');
    return /[A-Za-z]{3,}/.test(own);
  })).catch(() => true);
  return slopMarks(html, []).map(m => m.mark).filter(m => italicWords || !/^italic words$/i.test(m));
}

// The parts of their live page a buyer uses, read in the page (24 Nov). Pure
// DOM reads: no model, no network.
const LIVE_PARTS_JS = `(() => {
  const vis = e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && +c.opacity !== 0 && r.width > 0 && r.height > 0; };
  const top = e => e.getBoundingClientRect().top + window.scrollY;
  const vh = window.innerHeight;
  const fields = f => [...f.querySelectorAll('input,select,textarea')].filter(i => vis(i) && !/hidden|submit|button|search|checkbox|radio/i.test(i.type || ''));
  const forms = [...document.querySelectorAll('form')].filter(f => vis(f) && fields(f).length >= 2 && !/search/i.test(f.getAttribute('role') || '') );
  // Page builders (GoHighLevel on GenConnect) render fields with no <form>
  // around them, so a group of 2 or more fields within 700 px also counts.
  // Only fields a person contacts through count (a name, phone or email
  // field among them), so a postcode box or a date picker is not a form.
  const looseEls = fields(document).filter(i => !i.closest('form') && !/search/i.test((i.name || '') + (i.placeholder || '')));
  const contact = i => /email|tel/i.test(i.type || '') || /name|phone|mobile|email/i.test((i.name || '') + ' ' + (i.placeholder || '') + ' ' + (i.getAttribute('aria-label') || '') + ' ' + (i.id || ''));
  const loose = looseEls.filter(i => looseEls.some(c => contact(c) && Math.abs(top(c) - top(i)) <= 700)).map(top).sort((a, b) => a - b);
  const looseTops = loose.filter((t, k) => loose.filter(u => u >= t && u - t <= 700).length >= 2 && (k === 0 || t - loose[k - 1] > 700));
  const formTops = forms.map(top).concat(looseTops).sort((a, b) => a - b);
  // A question counts as an FAQ only where it is one: an accordion (summary, dt, aria-expanded) or a heading
  // inside a block named or titled as questions. Section headings that end in "?" ("Why make Johnny Rooter
  // your plumbing company of choice?") are not answers to a buyer's doubts, and counting them made the guard
  // demand an FAQ section the live page never had (buyer test, 26 Nov).
  const faqBlock = e => { for (let a = e; a && a !== document.body; a = a.parentElement) { if (/faq|accordion|question/i.test((a.id || '') + ' ' + (typeof a.className === 'string' ? a.className : '') + ' ' + (a.getAttribute('aria-label') || ''))) return true; const h = a.querySelector && a.querySelector(':scope > h2, :scope > h3, :scope > header h2'); if (h && h !== e && /\\b(faqs?|frequently asked|questions|q ?& ?a)\\b/i.test(h.innerText || '')) return true; } return false; };
  const q = [...document.querySelectorAll('summary,dt,h2,h3,h4,h5,button,[aria-expanded]')].filter(vis).filter(e => /^(SUMMARY|DT)$/.test(e.tagName) || e.hasAttribute('aria-expanded') || faqBlock(e)).map(e => (e.innerText || '').trim().replace(/\\s+/g, ' ')).filter(s => s.length >= 10 && s.length <= 160 && s.split(' ').length >= 4 && /\\?$/.test(s));
  const faq = [...new Set(q)];
  const rows = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue;
    const imgs = [...el.querySelectorAll(':scope > * img, :scope > img, :scope > * > * img')].filter(i => { if (!vis(i)) return false; const r = i.getBoundingClientRect(); return r.height >= 12 && r.height <= 130 && r.width <= 320; });
    if (imgs.length < 3 || imgs.length > 30) continue;
    const tops = imgs.map(i => Math.round(i.getBoundingClientRect().top));
    const sameRow = tops.filter(t => Math.abs(t - tops[0]) <= 24).length;
    if (sameRow < 3) continue;
    const alts = imgs.map(i => (i.alt || i.src.split('/').pop() || '').slice(0, 40));
    // Icons with a caption under each (LawWorks's "Workers Compensation",
    // "Medical") are a services row, not client logos.
    const near = (el.innerText || '').toLowerCase();
    if (imgs.filter(i => i.alt && i.alt.length > 3 && near.includes(i.alt.toLowerCase().slice(0, 12))).length >= imgs.length / 2) continue;
    if (top(el) < 150) continue;
    if (!rows.some(r => r.y === Math.round(top(el)))) rows.push({ y: Math.round(top(el)), count: imgs.length, alts: alts.slice(0, 10) });
  }
  const text = document.body.innerText || '';
  const figs = [...new Set([...(text.match(/(?<!\\d{3}[-)] ?|\\d{3}\\.|\\d{3} |\\d,|\\d\\.)\\b\\d[\\d,]*(?:\\.\\d+)?\\+?[ \\t]+(?:(?!our\\b|my\\b|the\\b|see\\b|read\\b|leave\\b|write\\b)[a-z-]+[ \\t]+){0,2}(?:reviews?|ratings?|testimonials?)\\b/gi) || []).concat(text.match(/\\b[1-5]\\.\\d\\s?(?:\\/\\s?5|stars?|out of 5)\\b/gi) || [])].map(x => x.replace(/\\s+/g, ' ')))].slice(0, 8);
  const wid = [...document.querySelectorAll('[class*="trustindex" i],[class*="ti-widget" i],[class*="elfsight" i],[class*="eapps" i],[class*="trustpilot" i],[class*="reviews-io" i],[class*="google-review" i]')].filter(vis);
  const outer = wid.filter(w => !wid.some(o => o !== w && o.contains(w)));
  const widget_text = outer.map(w => (w.innerText || '').trim().replace(/\\n{2,}/g, '\\n')).filter(Boolean).join('\\n---\\n').slice(0, 4000);
  // Review markup in the page's own schema (Trustindex and SEO plugins add it).
  const marks = [];
  const walk = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); const a = o.aggregateRating; if (a && (a.ratingValue || a.reviewCount || a.ratingCount)) marks.push((a.ratingValue || '?') + ' stars from ' + (a.reviewCount || a.ratingCount || '?') + ' reviews'); if (typeof o.description === 'string') { const m = o.description.match(/([1-5](?:\\.\\d)?)-star rating.*?(\\d[\\d,]*) people/); if (m) marks.push(m[1] + ' stars from ' + m[2] + ' reviews'); } Object.values(o).forEach(walk); };
  for (const x of document.querySelectorAll('script[type="application/ld+json"]')) { try { walk(JSON.parse(x.textContent)); } catch (e) {} }
  return { form_on_first_laptop_screen: formTops.length ? formTops[0] < vh : false, form_top: formTops.length ? Math.round(formTops[0]) : null, forms: forms.length, faq_count: faq.length, faq: faq.slice(0, 12), logo_rows: rows.slice(0, 4), review_figures: figs, review_widget_text: widget_text, review_markup: [...new Set(marks)].slice(0, 3) };
})()`;
(async () => {
  const t0 = Date.now();
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  // Review widgets (Trustindex, Elfsight) fetch their reviews as a file and
  // do not always draw them in a headless browser. LawWorks drew its "33
  // Google reviews" in one run and not the next. Keep the file itself.
  const widgetFiles = [];
  p.on('response', async res => { if (/cdn\.trustindex\.io\/widgets\/.+\/content\.html|elfsight\.com\/.*(widget|p)\b.*json/i.test(res.url())) { try { widgetFiles.push(await res.text()); } catch (e) {} } });
  await p.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  await p.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  for (let y = 0; y < 20000; y += 700) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
  // 24 Nov: Honda's dealer site served a bot check ("Just a moment...",
  // "Why have I been blocked?"), and we measured that page as theirs. A bot
  // check writes a note and no measurements: the audit's own capture
  // (inputs/live-page-today.png) is the live page then.
  const wall = await p.evaluate(() => /just a moment|verifying you are human|why have i been blocked|attention required|access denied|checking your browser|enable javascript and cookies/i.test(document.title + ' ' + (document.body ? document.body.innerText.slice(0, 1500) : ''))).catch(() => false);
  if (wall) {
    fs.writeFileSync(out, `# Their live page's craft (${url})\n\nTheir site showed our browser a bot check, so nothing here was measured. Read their page from inputs/live-page-today.png (the audit's capture) and inputs/site-page-text.md.\n`);
    fs.writeFileSync(path.join(path.dirname(out), 'live-parts.json'), JSON.stringify({ blocked: true }, null, 1));
    console.log('live parts: their site showed a bot check; not measured'); await b.close(); return;
  }
  const r = await p.evaluate(() => {
    const vis = e => { const c = getComputedStyle(e), rc = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && rc.width > 0 && rc.height > 0; };
    const fam = e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const tally = els => { const m = {}; els.forEach(e => { const c = getComputedStyle(e); const k = `${fam(e)} ${c.fontWeight}`; m[k] = (m[k] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => `${k} (${n})`); };
    const heads = [...document.querySelectorAll('h1,h2,h3')].filter(vis);
    const accents = heads.flatMap(h => [...h.querySelectorAll('*')]).filter(e => vis(e) && fam(e) !== fam(e.closest('h1,h2,h3')));
    const body = [...document.querySelectorAll('p,li')].filter(vis).slice(0, 80);
    const faces = []; for (const s of document.styleSheets) { try { for (const rule of s.cssRules) if (rule.constructor.name === 'CSSFontFaceRule') { const src = (rule.style.getPropertyValue('src').match(/url\(["']?([^"')]+)/) || [])[1]; faces.push(`${rule.style.getPropertyValue('font-family').replace(/["']/g, '')} ${rule.style.getPropertyValue('font-weight') || ''}: ${src ? new URL(src, s.href || location.href).href : '?'}`); } } catch (e) { if (s.href) faces.push(`stylesheet (not readable here, link it as is): ${s.href}`); } }
    const faceList = []; for (const s of document.styleSheets) { try { for (const rule of s.cssRules) if (rule.constructor.name === 'CSSFontFaceRule') { const src = (rule.style.getPropertyValue('src').match(/url\(["']?([^"')]+)/) || [])[1]; if (src && !/^data:/.test(src)) faceList.push({ family: rule.style.getPropertyValue('font-family').replace(/["']/g, '').trim(), weight: rule.style.getPropertyValue('font-weight') || '400', style: rule.style.getPropertyValue('font-style') || 'normal', src: new URL(src, s.href || location.href).href }); } } catch (e) {} }
    const fontFiles = performance.getEntriesByType('resource').map(e => e.name).filter(n => /\.(woff2?|otf|ttf)(\?|$)/i.test(n) || /typekit|fonts\.googleapis/.test(n));
    const isCookieBtn = (e) => {
      const t = (e.innerText || '').trim();
      if (/^(accept( all)?|reject( all| non-essential)?|save( preferences| settings)?|decline( all)?|allow all|manage cookies|cookie settings|customize|close|dismiss|got it)$/i.test(t)) return true;
      return !!e.closest('[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[id*="onetrust" i],[class*="cky-" i],[class*="cmplz" i],[role="dialog"][aria-label*="cookie" i]');
    };
    const isStyledLink = (e) => {
      if (e.tagName === 'BUTTON' || /btn|button|cta/i.test(e.className + '')) return true;
      const c = getComputedStyle(e);
      return c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent' && parseFloat(c.paddingTop) >= 6 && parseFloat(c.paddingLeft) >= 12;
    };
    const btns = [...document.querySelectorAll('a,button')].filter(e => vis(e) && !isCookieBtn(e) && isStyledLink(e) && (e.innerText || '').trim().length > 1).slice(0, 5).map(e => { const c = getComputedStyle(e); return `"${e.innerText.trim().slice(0, 30)}": ${fam(e)} ${c.fontWeight} ${c.fontSize}, bg ${c.backgroundColor}, text ${c.color}, radius ${c.borderRadius}, padding ${c.padding}, border ${c.borderTopWidth} ${c.borderTopColor}, shadow ${c.boxShadow === 'none' ? 'none' : c.boxShadow.slice(0, 60)}, hover transition ${c.transitionDuration}`; });
    const all = [...document.querySelectorAll('body *')].filter(vis);
    const anim = all.filter(e => getComputedStyle(e).animationName !== 'none');
    const names = [...new Set(anim.map(e => getComputedStyle(e).animationName))].slice(0, 10);
    const trans = all.filter(e => getComputedStyle(e).transitionDuration !== '0s');
    const props = [...new Set(trans.flatMap(e => getComputedStyle(e).transitionProperty.split(', ')))].filter(x => !x.startsWith('--')).slice(0, 10);
    const radii = Object.entries(all.reduce((m, e) => { const v = getComputedStyle(e).borderRadius; if (v !== '0px') m[v] = (m[v] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, n]) => `${k} (${n})`);
    const shadows = [...new Set(all.map(e => getComputedStyle(e).boxShadow).filter(s => s !== 'none'))].slice(0, 4);
    const sticky = all.filter(e => ['sticky', 'fixed'].includes(getComputedStyle(e).position)).length;
    const libs = [...document.scripts].map(s => s.src).filter(s => /gsap|lenis|lottie|aos|swiper|framer|motion|three|splide|anime/i.test(s));
    return { heads: tally(heads), accents: tally(accents), body: tally(body), faces: [...new Set(faces)].slice(0, 12), faceList: faceList.slice(0, 40), fontFiles: [...new Set(fontFiles)].slice(0, 12), btns, anim: anim.length, names, trans: trans.length, props, radii, shadows, sticky, libs };
  });
  // Their own fonts, made usable. Most sites send no cross-origin header, so a new page that links their font
  // URLs falls back to a default font (johnnyrooter.com, buyer test 26 Nov). A family Google Fonts serves gets
  // its Google Fonts link. Any other family is downloaded here and written into inputs/fonts.css as data, which
  // works from a file, from any host and after pack.
  const used = [...new Set([...r.heads, ...r.body, ...r.accents].map(x => x.replace(/\s+\d+\s+\(\d+\)$/, '').trim()))];
  const fontNote = [];
  try {
    const fams = used.filter(fm => !/^(system-ui|-apple-system|blinkmacsystemfont|sans-serif|serif|monospace|arial|helvetica|helvetica neue|times|times new roman|georgia|verdana|tahoma|segoe ui|roboto|inherit)$/i.test(fm));
    const css = []; let bytes = 0;
    for (const fm of fams) {
      const gq = encodeURIComponent(fm).replace(/%20/g, '+'); let link = '';
      for (const q of [`${gq}:wght@400;500;600;700;800`, `${gq}:wght@400;700`, gq]) { const g = await p.request.get(`https://fonts.googleapis.com/css2?family=${q}&display=swap`, { timeout: 10000 }).catch(() => null); if (g && g.ok()) { link = `https://fonts.googleapis.com/css2?family=${q}&display=swap`; break; } }
      if (link) { fontNote.push(`  - ${fm}: Google Fonts has it. Load it with <link href="${link}" rel="stylesheet">`); continue; }
      const faces = r.faceList.filter(f => f.family === fm).slice(0, 4); let got = 0;
      for (const f of faces) {
        const res = await p.request.get(f.src, { timeout: 15000 }).catch(() => null);
        if (!res || !res.ok()) continue; const buf = await res.body(); if (bytes + buf.length > 900000) break; bytes += buf.length; got++;
        const fmt = /\.woff2(\?|$)/i.test(f.src) ? 'woff2' : /\.woff(\?|$)/i.test(f.src) ? 'woff' : /\.otf(\?|$)/i.test(f.src) ? 'opentype' : 'truetype';
        css.push(`@font-face{font-family:"${fm}";font-weight:${f.weight};font-style:${f.style};font-display:swap;src:url(data:font/${fmt};base64,${buf.toString('base64')}) format("${fmt}")}`);
      }
      if (!faces.length) fontNote.push(`  - ${fm}: not found as a file and not on Google Fonts. Pick the nearest Google font and say so in brand.md.`);
      if (got) fontNote.push(`  - ${fm}: their own font, ${got} ${got === 1 ? 'weight' : 'weights'}. Paste all of inputs/fonts.css into page.html's <style>. Never link their font URLs: their server blocks other sites.`);
    }
    if (css.length) { fs.mkdirSync(path.join(path.dirname(out), 'inputs'), { recursive: true }); fs.writeFileSync(path.join(path.dirname(out), 'inputs', 'fonts.css'), css.join('\n') + '\n'); }
  } catch (e) {}
  const md = `# Their live page's craft, measured (${url})\n\n` +
    `Keep what is strong here. A well-crafted live site's type, buttons and motion are part of its brand.\n\n` +
    `## Type\n- Headings: ${r.heads.join(', ') || 'none found'}\n- Accent words inside headings: ${r.accents.join(', ') || 'none'}\n- Body: ${r.body.join(', ') || 'none found'}\n` +
    `- Their fonts, ready to use (check the guard says the font loads; only if it cannot, pick the nearest Google font and say so in brand.md):\n${fontNote.join('\n') || '  - none of their own: their headings and body use system or stock fonts'}\n\n` +
    `## Buttons\n${r.btns.map(x => '- ' + x).join('\n') || '- none found'}\n\n` +
    `## Shape\n- Corner radii, most used: ${r.radii.join(', ') || 'square'}\n- Shadows: ${r.shadows.map(s => s.slice(0, 70)).join(' | ') || 'none'}\n- Sticky or fixed elements: ${r.sticky}\n\n` +
    `## Motion\n- ${r.anim} elements animate${r.names.length ? ' (' + r.names.join(', ') + ')' : ''}; ${r.trans} have transitions (${r.props.join(', ')})\n- Motion libraries: ${r.libs.join(', ') || 'none'}\n` +
    (r.anim > 20 ? `- This site moves a lot: carry that level of motion (entrances, hover states, small loops) into the new page, done with CSS and a few lines of script, and never at the cost of the phone.\n` : '');
  fs.writeFileSync(out, md); console.log(md);
  // 24 Nov (agency builds): what their live page already does, for keep.md and
  // the guard. GenConnect lost its first-screen form, its FAQ, its logo row and
  // its "100+ five-star reviews"; LawWorks lost 33 Google reviews that load in a
  // widget only on scroll. Measured here because this browser has scrolled.
  try {
    const parts = await p.evaluate(LIVE_PARTS_JS);
    await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(800);
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
    const ph = await p.evaluate(LIVE_PARTS_JS);
    if (!parts.review_widget_text && widgetFiles.length) {
      parts.review_widget_text = widgetFiles.map(h => h.replace(/<(style|script)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&').replace(/&#0?39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim()).join('\n---\n').slice(0, 4000);
    }
    parts.form_on_first_phone_screen = ph.form_on_first_laptop_screen === true ? (ph.form_top <= 844) : false;
    await p.setViewportSize({ width: 1440, height: 900 });
    fs.writeFileSync(path.join(path.dirname(out), 'live-parts.json'), JSON.stringify(parts, null, 1));
    console.log(`live parts: form first screen ${parts.form_on_first_laptop_screen}, FAQ ${parts.faq_count}, logo rows ${parts.logo_rows.length}, review figures ${parts.review_figures.join(' | ') || 'none'}, widget ${parts.review_widget_text ? parts.review_widget_text.split('\n').slice(0, 2).join(' ') : 'none'}, markup ${parts.review_markup.join(' | ') || 'none'}`);
  } catch (e) { console.log(`live parts: not measured (${String((e && e.message) || e).slice(0, 100)})`); }
  // After craft.md, and only with time left under setup's 150 s limit: a slow
  // scan never costs the craft notes.
  const left = 135000 - (Date.now() - t0);
  if (left > 10000) {
    try {
      // A scan cut off by the timer must not fail the run once the browser closes.
      const job = liveMarks(p); job.catch(() => {});
      const marks = await Promise.race([job, new Promise((_, no) => setTimeout(() => no(new Error('it took too long')), Math.min(30000, left)))]);
      fs.writeFileSync(path.join(path.dirname(out), '.live-marks.json'), JSON.stringify(marks));
      console.log(`AI marks on their live page: ${marks.join(', ') || 'none'}`);
    } catch (e) { console.log(`AI marks on their live page: the scan did not run (${String((e && e.message) || e).slice(0, 100)})`); }
  }
  await b.close();
})();
