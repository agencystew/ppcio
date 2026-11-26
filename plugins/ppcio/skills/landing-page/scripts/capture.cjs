// node capture.cjs <url> <work folder> [--quick]
// --quick (a competitor): the laptop and phone first screens, the text and the facts only.
// Captures a live landing page for the audit, with no model and no account:
//   inputs/live-page-today.png    laptop first screen (1440 x 900)
//   inputs/live-phone-today.png   phone first screen (390 x 844)
//   inputs/live-full.jpg          the whole laptop page (capped at 9000 px)
//   inputs/site-page-text.md      the visible text, headings marked
//   inputs/site-facts.json        title, forms, buttons, phone numbers, tags, speed; popup_forms: a form a button opens
//   inputs/live-popup-form.png    that form, open, when there is one
//   inputs/pages/*.md             the text of up to 6 of their other pages (about, services, projects...)
//   inputs/photos/NN.jpg          their 24 biggest photos from all those pages, and photo-sheet.jpg
// Then live-craft.cjs adds craft.md, live-parts.json and .live-marks.json.
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const { textNodes } = require('./textmap.cjs');

const url = process.argv[2]; const work = path.resolve(process.argv[3] || '.'); const QUICK = process.argv.includes('--quick');
if (!url) { console.log('Usage: capture.cjs <url> <work folder>'); process.exit(1); }
const IN = path.join(work, 'inputs'); fs.mkdirSync(path.join(IN, 'photos'), { recursive: true });
fs.rmSync(path.join(work, 'NOT-CAPTURED.txt'), { force: true });

// The tags in the page's code. Same table as the postclick worker (page-actions.ts).
const TAGS = [
  ['google_ads', "googleadservices|google_conversion|gtag\\('config',\\s*'AW-\\d|AW-\\d{6,}"],
  ['ga4', "gtag\\(|googletagmanager\\.com/gtag|G-[A-Z0-9]{8,}"],
  ['gtm', 'googletagmanager\\.com/gtm|GTM-[A-Z0-9]+'],
  ['shopify_pixels', 'web-pixels-manager|webPixelsConfigList|/cdn/wpm/|web-pixels@'],
  ['meta_pixel', 'connect\\.facebook\\.net|fbq\\('],
  ['ms_clarity', 'clarity\\.ms'], ['hotjar', 'hotjar'],
  ['linkedin', 'linkedin\\.com/px|_linkedin_partner_id'],
  ['microsoft_ads', 'bat\\.bing\\.com|uetq'], ['tiktok', 'tiktok.*analytics|ttq\\.'],
];

// What the site is built on, for the go-live step. The first match wins.
const PLATFORMS = [
  ['Shopify', 'cdn\\.shopify\\.com|Shopify\\.theme'], ['WordPress', 'wp-content/|wp-includes/'],
  ['Squarespace', 'static1\\.squarespace\\.com|squarespace-cdn'], ['Wix', 'static\\.wixstatic\\.com|wix-bolt|_wixCIDX'],
  ['Webflow', 'webflow\\.(com|js)|data-wf-page'], ['HubSpot', 'hs-scripts\\.com|hubspot'], ['Framer', 'framerusercontent\\.com|framer\\.com/m/'],
  ['Next.js', '/_next/static/'], ['GoDaddy', 'img1\\.wsimg\\.com'], ['Duda', 'dudaone|cdn-website\\.com'],
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function settle(p) {
  // Act like a visitor: move the mouse and turn the wheel. Many sites hold their scripts (review widgets,
  // chat, sliders) until one of these happens, and a plain scrollTo never fires them.
  await p.mouse.move(400, 300).catch(() => {}); await p.mouse.move(700, 500).catch(() => {});
  const H = await p.evaluate(() => Math.min(document.body.scrollHeight, 20000)).catch(() => 0);
  const step = 500; let wheel = true;
  for (let y = 0; y < H; y += step) {
    if (wheel) await p.mouse.wheel(0, step).catch(() => { wheel = false; });
    if (!wheel) await p.evaluate(y => window.scrollTo(0, y), y).catch(() => {});
    await p.waitForTimeout(250);
  }
  await p.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await toTop(p);
}

// Back to the top, for real. After a wheel scroll, a plain scrollTo(0, 0) can lose to smooth scrolling or
// scroll momentum: on johnnyrooter.com the phone shot sat 29 px down and the header and logo were gone,
// so the audit said "no logo" when the real phone page shows it. Force an instant jump and check it held.
async function toTop(p) {
  for (let i = 0; i < 5; i++) {
    await p.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
    }).catch(() => {});
    await p.waitForTimeout(i ? 400 : 1200);
    const y = await p.evaluate(() => window.scrollY + ((window.visualViewport && window.visualViewport.pageTop) || 0)).catch(() => 0);
    if (y < 1) break;
  }
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = ''; }).catch(() => {});
}

// Show the parts that wait for a scroll effect (fade-ins), so the full screenshot has no blank bands.
async function revealAll(p) {
  await p.addStyleTag({ content: '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}' }).catch(() => {});
  await p.evaluate(() => {
    for (const e of document.querySelectorAll('body *')) {
      const c = getComputedStyle(e);
      if (c.position === 'fixed' || c.display === 'none') continue;
      const r = e.getBoundingClientRect();
      if (r.width < 40 || r.height < 20) continue;
      if (parseFloat(c.opacity) < 0.05 || c.visibility === 'hidden') {
        if (e.closest('[role=dialog],[aria-modal=true],nav,header [aria-hidden=true]')) continue;
        // Hover tips and pop-overs stay hidden: a visitor sees them only on hover.
        if (e.closest('[role=tooltip],[class*=tooltip i],[class*=popover i],[class*=dropdown i]') || (c.position === 'absolute' && r.width < 320)) continue;
        e.style.setProperty('opacity', '1', 'important'); e.style.setProperty('visibility', 'visible', 'important'); e.style.setProperty('transform', 'none', 'important');
      }
    }
    for (const i of document.querySelectorAll('img[loading=lazy]')) i.loading = 'eager';
  }).catch(() => {});
  await p.waitForTimeout(800);
}

// What the page holds: forms, buttons, phone links, photos, headings. Run on the laptop and the phone page.
const FACTS = () => {
    const vis = e => { const c = getComputedStyle(e), r = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
    const txt = e => (e.innerText || e.value || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
    const top = e => Math.round(e.getBoundingClientRect().top + window.scrollY);
    const forms = [...document.querySelectorAll('form')].filter(vis).map(f => ({
      top: top(f),
      fields: [...f.querySelectorAll('input,select,textarea')].filter(i => vis(i) && !['hidden', 'submit', 'button'].includes(i.type))
        .map(i => (i.labels && i.labels[0] && txt(i.labels[0])) || i.placeholder || i.name || i.type).slice(0, 15),
      inputs: [...f.querySelectorAll('input,select,textarea')].filter(i => vis(i) && !['hidden', 'submit', 'button'].includes(i.type))
        .map(i => ({ type: i.tagName === 'INPUT' ? i.type : i.tagName.toLowerCase(), name: i.name || '', required: i.required, autocomplete: i.getAttribute('autocomplete') || '' })).slice(0, 15),
      action: f.getAttribute('action') || '', method: (f.getAttribute('method') || 'get').toLowerCase(),
      captcha: !!f.querySelector('.g-recaptcha,[name*=recaptcha],iframe[src*=recaptcha],iframe[src*=hcaptcha],.cf-turnstile'),
      button: txt(f.querySelector('button,[type=submit]') || f) .slice(0, 60),
    }));
    const buttons = [...document.querySelectorAll('a,button')].filter(vis).map(e => ({ text: txt(e).slice(0, 60), href: e.getAttribute('href') || '', top: top(e) }))
      .filter(x => x.text && x.text.split(' ').length <= 6).slice(0, 80);
    // Every phone number on the page and where it is, so a number that differs between the link and its
    // label, or between the header and the footer, is caught (Johnny Rooter, Best Choice, 26 Nov).
    const dig = t => t.replace(/\D/g, '').replace(/^1(\d{10})$/, '$1');
    const where = el => el.closest('header,nav') ? 'header' : el.closest('footer') ? 'footer' : (el.getBoundingClientRect().top + scrollY < 900 ? 'first screen' : 'body');
    const pn = new Map(); const addN = (d, w) => { if (d.length < 10 || d.length > 13) return; const x = pn.get(d) || new Set(); x.add(w); pn.set(d, x); };
    for (const a of document.querySelectorAll('a[href^="tel:"]')) { addN(dig(a.getAttribute('href')), 'link in the ' + where(a));
      const hd = dig(a.getAttribute('href')); const shownM = (a.innerText || '').match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}|\d[\d\s.-]{9,}\d/); const shown = shownM ? dig(shownM[0]) : ''; if (shown.length >= 10 && !hd.endsWith(shown) && !shown.endsWith(hd)) addN(shown, 'shown on a link that dials another number, in the ' + where(a)); }
    for (const m of (document.body.innerText || '').matchAll(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}|\+?44\s?\(?0?\)?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}|\b0\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g)) addN(dig(m[0]), 'text');
    const phone_numbers = [...pn].map(([d, w]) => ({ digits: d, where: [...w] }));
    const phones = [...new Set([...document.querySelectorAll('a[href^="tel:"]')].map(a => { const v = a.getAttribute('href').slice(4); try { return decodeURIComponent(v).trim(); } catch (e) { return v; } }))];
    const imgs = [...document.images].filter(vis).map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, top: top(i) }))
      .filter(i => i.w >= 300 && i.h >= 200 && /^https?:/.test(i.src) && !/\.svg(\?|$)/i.test(i.src));
    // A hero photo is often a CSS background (Reliant's plumber in a branded shirt, 26 Nov). Keep big ones; a first-screen one leads.
    for (const e of document.querySelectorAll('body *')) { const bg = getComputedStyle(e).backgroundImage; const m = bg && bg.match(/url\(["']?(https?:[^"')]+)/); if (!m || /\.svg(\?|$)/i.test(m[1])) continue;
      const r = e.getBoundingClientRect(); if (r.width >= 400 && r.height >= 250) imgs.push({ src: m[1], alt: (e.getAttribute('aria-label') || 'background photo').slice(0, 80), w: Math.round(r.width), h: Math.round(r.height), top: top(e), bg: true }); }
    const heads = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(e => ({ tag: e.tagName.toLowerCase(), text: txt(e).slice(0, 160), top: top(e) })).filter(x => x.text);
    // Logo rows: 3 or more small images on one line. Their alt text and file names are the only way to know whose logos they are.
    const small = [...document.images].filter(vis).map(i => { const r = i.getBoundingClientRect(); return { alt: (i.alt || '').trim(), file: decodeURIComponent(((i.currentSrc || i.src || '').split('?')[0].split('/').pop()) || ''), top: top(i), h: r.height, w: r.width }; })
      .filter(i => i.h >= 16 && i.h <= 140 && i.w <= 320);
    const rows = {}; for (const i of small) { const k = Math.round(i.top / 40); (rows[k] = rows[k] || []).push(i); }
    const logos = Object.values(rows).filter(r => r.length >= 3).map(r => ({ top: r[0].top, names: r.map(i => i.alt || i.file).slice(0, 24) }));
    return {
      title: document.title, description: (document.querySelector('meta[name=description]') || {}).content || '',
      lang: document.documentElement.lang, height: document.documentElement.scrollHeight,
      headings: heads, logos, forms, buttons, phones, phone_numbers, images: imgs,
      first_screen_words: (document.body.innerText || '').split(/\s+/).length,
    };
  };

// The visible text, with headings marked.
const TEXT = () => {
    // Labels of fields a visitor never fills (UTM, gclid): the reveal step showed them, and 4 audit agents asked about "UTM" (26 Nov).
    for (const l of document.querySelectorAll('label')) { const i = l.htmlFor ? document.getElementById(l.htmlFor) : l.querySelector('input,select,textarea'); if (i && (i.type === 'hidden' || getComputedStyle(i).display === 'none')) l.style.display = 'none'; }
    const out = []; const walk = n => {
      for (const e of n.children) {
        const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || /^(SCRIPT|STYLE|NOSCRIPT|SVG|TEMPLATE|IFRAME)$/i.test(e.tagName) || e instanceof SVGElement) continue;
        // A field a visitor never fills (UTM, gclid) still has a label the forms plugin hides; the
        // capture's reveal step showed it, and 4 audit agents asked if visitors see "UTM" (26 Nov).
        const ctl = e.tagName === 'LABEL' && e.htmlFor ? [document.getElementById(e.htmlFor)] : (e.innerText || '').length < 40 ? [...e.querySelectorAll('input,select,textarea')] : [];
        if (ctl.length && ctl.every(i => !i || i.type === 'hidden' || getComputedStyle(i).display === 'none') && !e.querySelector('button,a')) continue;
        if (/^H[1-4]$/.test(e.tagName)) { out.push('#'.repeat(+e.tagName[1]) + ' ' + (e.innerText || '').replace(/\s+/g, ' ').trim()); continue; }
        // A block with no blocks inside is one line of text, whatever its tag. Review widgets and page builders
        // often put their words straight into a div.
        if (!e.querySelector('p,li,h1,h2,h3,h4,div,section,article,ul,ol,table,form')) {
          const t = (e.innerText || '').replace(/\s+/g, ' ').trim(); if (t && out[out.length - 1] !== t) out.push((e.tagName === 'LI' ? '- ' : '') + t); continue; }
        walk(e);
      } };
    // One odd node must never fail a client (onehourheatandair, 26 Nov): fall back to the plain page text.
    try { walk(document.body); } catch (err) { return document.body.innerText; } return out.join('\n');
  };

// A bot check or an error page, not the real page.
const WALL = /just a moment|attention required|access denied|verify you are human|are you a robot|checking your browser|captcha|403 forbidden|request blocked|cf-chl|not available in your (region|country)|not available in your location/i;

// Close cookie banners and pop-ups so the screenshots show the page.
async function clearPopups(p) {
  const words = ['Accept all', 'Accept', 'I agree', 'Agree', 'Allow all', 'Got it', 'OK', 'Close', 'No thanks'];
  for (const w of words) {
    const b = p.getByRole('button', { name: w, exact: true }).first();
    if (await b.isVisible({ timeout: 300 }).catch(() => false)) { await b.click({ timeout: 1500 }).catch(() => {}); await p.waitForTimeout(400); }
  }
  await p.keyboard.press('Escape').catch(() => {});
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, ignoreHTTPSErrors: true });
  // Record the largest paint as it happens. Read after load, the browser has no entry.
  await ctx.addInitScript(() => { try { new PerformanceObserver(l => { const e = l.getEntries().pop(); if (e) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {} });
  const p = await ctx.newPage();
  const t0 = Date.now(); let status = 0;
  const resp = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => { console.log('Could not open the page: ' + e.message.split('\n')[0]); return null; });
  if (!resp) { await b.close(); process.exit(1); }
  status = resp.status();
  await p.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
  const loadMs = Date.now() - t0;
  await clearPopups(p); await settle(p); await clearPopups(p); await toTop(p);
  await p.screenshot({ path: path.join(IN, 'live-page-today.png') });
  const lcpMs = await p.evaluate(() => window.__lcp ? Math.round(window.__lcp) : null).catch(() => null);
  const wallText = await p.evaluate(() => document.title + ' ' + (document.body.innerText || '').slice(0, 600)).catch(() => '');
  const blocked = status >= 400 || (WALL.test(wallText) && wallText.split(/\s+/).length < 120);
  // Stop now: a block page is not their page, and every later step would read it as theirs (26 Nov: a
  // region block was saved as the page and took 47 s to report).
  if (blocked) {
    const why = /region|country|location/i.test(wallText) ? 'a region block (the site does not serve visitors from this country)' : /captcha|robot|human|browser|moment|cf-chl/i.test(wallText) ? 'a bot check' : `an error page (status ${status})`;
    fs.writeFileSync(path.join(work, 'NOT-CAPTURED.txt'), `${url} showed ${why}.\n`);
    for (const f of ['live-page-today.png']) fs.renameSync(path.join(IN, f), path.join(work, 'blocked-page.png'));
    await b.close();
    console.log(`NOT CAPTURED: ${url} showed ${why}. Nothing was saved as their page. What the capture saw: ${path.join(work, 'blocked-page.png')}`);
    process.exit(2);
  }
  await revealAll(p);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  if (h > 9000) await p.setViewportSize({ width: 1440, height: 900 });
  await p.screenshot({ path: path.join(IN, 'live-full.jpg'), fullPage: h <= 9000, quality: 70, type: 'jpeg', clip: h > 9000 ? { x: 0, y: 0, width: 1440, height: 9000 } : undefined }).catch(() => {});
  // Where each line of text sits on live-full.jpg: the studio's spotlight boxes.
  const nodes = { desk: QUICK ? [] : await textNodes(p, 9000), phone: [] };

  const html = await p.content();
  // The tracking snippets as the site serves them (not what they inject later), so the new page can keep them.
  try { const raw = await resp.text(); const keep = [...raw.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>|<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi)].map(m => m[0])
      .filter(t => TAGS.some(([, re]) => new RegExp(re).test(t)) && t.length < 6000)
      // Cloudflare Rocket Loader serves scripts as type="<hash>-text/javascript" and runs them itself. Pasted
      // as is, GTM and GA4 never fire on the new page (26 Nov, Reliant). Give them back a plain type.
      .map(t => t.replace(/\stype=(["'])[0-9a-f]{16,}-text\/javascript\1/gi, '').replace(/\sdata-cf-[a-z-]+=(["'])[^"']*\1/gi, '')
        // Speed plugins delay tags with a made-up type (Perfmatters "pmdelayedscript", WP Rocket
        // "rocketlazyloadscript", LiteSpeed "litespeed/javascript") and run them later themselves. On the new
        // page nothing runs them, so GA4 and GTM never fire (Johnny Rooter, 26 Nov). Give back a plain script.
        .replace(/<script\b([^>]*?)\stype=(["'])(?!text\/javascript|application\/javascript|module|application\/ld\+json)[^"']*\2/gi, '<script$1')
        .replace(/\sdata-(rocket-src|litespeed-src|pmdelayedscript-src)=/gi, ' src=').replace(/\sdata-(no-optimize|no-defer|no-minify|rocket-[a-z-]+|litespeed-[a-z-]+|pm[a-z-]*)=(["'])[^"']*\2/gi, ''));
    if (keep.length) fs.writeFileSync(path.join(IN, 'tracking-tags.html'), '<!-- Their live page\'s tracking tags, copied as served. Paste into the new page\'s <head> unchanged. -->\n' + keep.join('\n') + '\n'); } catch (e) {}
  const tags = TAGS.filter(([, re]) => new RegExp(re).test(html)).map(([t]) => t);

  const facts = await p.evaluate(FACTS);
  // A form that opens only when a button is pressed (a pop-up or a slide-in): press the first quote or booking
  // button that stays on this page, and save the form that appears. Best Choice Roofing, 26 Nov: all 3 estimate
  // buttons opened a pop-up, so the audit could not judge the main action.
  try {
    const before = facts.forms.length;
    const btn = await p.evaluateHandle(() => [...document.querySelectorAll('a,button')].find(a => { const r = a.getBoundingClientRect(); const h = a.getAttribute('href') || '';
      return r.width > 0 && r.height > 0 && /estimate|quote|inspection|book|schedule|appointment|consult/i.test(a.innerText || '') && (a.tagName === 'BUTTON' || h === '' || h.startsWith('#') || /^javascript/i.test(h)); }) || null);
    if (btn && await btn.evaluate(x => !!x)) {
      await btn.evaluate(x => x.scrollIntoView({ block: 'center' })); await btn.click({ timeout: 3000 }); await p.waitForTimeout(1800);
      const after = await p.evaluate(FACTS);
      const fresh = after.forms.filter(f => !facts.forms.some(g => JSON.stringify(g.fields) === JSON.stringify(f.fields)));
      if (fresh.length) { facts.popup_forms = fresh.map(f => ({ ...f, opened_by: 'a button on the page' }));
        await p.screenshot({ path: path.join(IN, 'live-popup-form.png') }).catch(() => {}); }
      await p.keyboard.press('Escape').catch(() => {});
    }
  } catch (e) {}
  facts.url = url; facts.final_url = p.url(); facts.status = status; facts.load_ms = loadMs; facts.lcp_ms = lcpMs; facts.blocked = blocked; facts.tags = tags;
  facts.platform = (PLATFORMS.find(([, re]) => new RegExp(re, 'i').test(html)) || ['unknown'])[0];

  // The visible text, with headings marked, for the copy review.
  const text = await p.evaluate(TEXT);
  fs.writeFileSync(path.join(IN, 'site-page-text.md'), `# ${facts.title}\n\nURL: ${url}\n\n${text}\n`);
  // Flesch-Kincaid grade of the body copy (lines of 8+ words), so no audit agent counts syllables by hand.
  { const body = text.split('\n').filter(l => !/^#/.test(l) && l.split(/\s+/).length >= 8).join(' ');
    const words = body.match(/[A-Za-z']+/g) || []; const sents = Math.max(1, (body.match(/[.!?]+(\s|$)/g) || []).length);
    const syl = w => Math.max(1, (w.toLowerCase().replace(/e$/, '').match(/[aeiouy]+/g) || []).length);
    facts.reading_grade = words.length >= 50 ? Math.round((0.39 * words.length / sents + 11.8 * words.reduce((n, w) => n + syl(w), 0) / words.length - 15.59) * 10) / 10 : null; }

  // Their other pages (about, services, projects, reviews...): text for the facts, and more of their photos.
  // The postclick build hunts the same way (studio-kit prep.py).
  facts.pages = [];
  if (!QUICK && !blocked) {
    const host = new URL(p.url()).host;
    const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({ href: a.href, text: (a.innerText || '').trim().slice(0, 40) }))).catch(() => []);
    const WANT = /about|service|project|work|portfolio|review|testimonial|case|gallery|team|pricing|price|our-|why|quote|consult|book|contact|enquir/i;
    // Photos and proof first: their projects, reviews and about page, then pricing, then the services.
    const RANK = [/quote|consult|book|enquir|contact/i, /project|portfolio|gallery|case|our-work|\/work/i, /review|testimonial/i, /about|team|why/i, /pric/i, /service/i];
    const picked = []; const seenPath = new Set([new URL(p.url()).pathname.replace(/\/$/, '')]);
    for (const l of links) {
      let u; try { u = new URL(l.href); } catch (e) { continue; }
      const key = u.pathname.replace(/\/$/, '');
      if (u.host !== host || seenPath.has(key) || /\.(pdf|jpe?g|png|zip|docx?)$/i.test(key) || /cart|login|account|privacy|terms|cookie|wp-admin|feed/i.test(key)) continue;
      if (!WANT.test(key + ' ' + l.text)) continue;
      seenPath.add(key); picked.push({ u: u.origin + u.pathname, rank: RANK.findIndex(re => re.test(key + ' ' + l.text)) });
    }
    picked.sort((a, c) => (a.rank < 0 ? 99 : a.rank) - (c.rank < 0 ? 99 : c.rank)); picked.splice(7);
    fs.mkdirSync(path.join(IN, 'pages'), { recursive: true });
    for (const { u } of picked) {
      const r = await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => null);
      if (!r || r.status() >= 400) continue;
      await p.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
      await settle(p);
      const t = await p.evaluate(TEXT).catch(() => '');
      const f2 = await p.evaluate(FACTS).catch(() => null);
      const slug = (new URL(u).pathname.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-') || 'home').slice(0, 60);
      if (t) { fs.writeFileSync(path.join(IN, 'pages', slug + '.md'), `# ${f2 ? f2.title : slug}\n\nURL: ${u}\n\n${t}\n`); facts.pages.push(u); }
      if (f2) facts.images.push(...f2.images.map(i => ({ ...i, page: u })));
    }
  }

  // Phone first screen.
  const ph = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, ignoreHTTPSErrors: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
  const pp = await ph.newPage();
  await pp.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  await clearPopups(pp); await settle(pp); await clearPopups(pp); await toTop(pp);
  await pp.screenshot({ path: path.join(IN, 'live-phone-today.png') });
  await revealAll(pp);
  if (!QUICK) {
    // The whole phone page, and where its text sits, for the studio's phone view.
    const ph2 = await pp.evaluate(() => document.documentElement.scrollHeight).catch(() => 0);
    await pp.screenshot({ path: path.join(IN, 'live-full-phone.jpg'), type: 'jpeg', quality: 70, fullPage: ph2 <= 9000, clip: ph2 > 9000 ? { x: 0, y: 0, width: 390, height: 9000 } : undefined }).catch(() => {});
    nodes.phone = await textNodes(pp, 9000);
    fs.writeFileSync(path.join(IN, 'text-nodes.json'), JSON.stringify(nodes));
  }
  const phoneText = await pp.evaluate(TEXT).catch(() => '');
  if (phoneText) fs.writeFileSync(path.join(IN, 'site-page-text-phone.md'), `# ${facts.title} (phone, 390 px)\n\nURL: ${url}\n\n${phoneText}\n`);
  const pf = await pp.evaluate(FACTS).catch(() => null);
  facts.phone = await pp.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    tel_on_first_screen: [...document.querySelectorAll('a[href^="tel:"]')].some(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.top < 844; }),
  })).catch(() => ({}));
  if (pf) facts.phone.actions = { forms: pf.forms, buttons: pf.buttons, phones: pf.phones };

  // Their logo, saved, so the build can use the real file.
  facts.logo = null;
  if (!QUICK) {
    const lg = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 }).then(() => p.evaluate(() => {
      const c = [...document.querySelectorAll('header img, nav img, [class*=logo i] img, img[class*=logo i], img[alt*=logo i], img[src*=logo i]')]
        .find(i => (i.currentSrc || i.src) && i.getBoundingClientRect().width > 20);
      return c ? { src: c.currentSrc || c.src, alt: c.alt || '' } : null;
    })).catch(() => null);
    if (lg && /^https?:/.test(lg.src)) {
      const r = await ctx.request.get(lg.src, { timeout: 15000 }).catch(() => null);
      if (r && r.ok()) { const ext = (lg.src.split('?')[0].match(/\.(png|svg|webp|jpe?g|gif)$/i) || [, 'png'])[1].toLowerCase(); const f = path.join(IN, 'logo.' + ext); fs.writeFileSync(f, await r.body()); facts.logo = { file: path.relative(work, f), src: lg.src, alt: lg.alt }; }
    }
  }

  // Their photos: the 24 biggest from all their pages, saved, and one sheet to look at.
  if (QUICK) facts.images = [];
  // The landing page's own hero background first, then other pages' heroes, then by size.
  const hero = i => i.bg && i.top < 900 ? (i.page ? 1 : 2) : 0;
  const seen = new Set(); const photos = facts.images.filter(i => !seen.has(i.src) && seen.add(i.src)).sort((a, c) => hero(c) - hero(a) || c.w * c.h - a.w * a.h).slice(0, QUICK ? 0 : 24);
  const saved = [];
  for (const [i, im] of photos.entries()) {
    const r = await ctx.request.get(im.src, { timeout: 15000 }).catch(() => null);
    if (!r || !r.ok()) continue;
    const f = path.join(IN, 'photos', String(i + 1).padStart(2, '0') + '.jpg'); fs.writeFileSync(f, await r.body());
    saved.push({ file: path.relative(work, f), ...im });
  }
  fs.writeFileSync(path.join(IN, 'photos.md'), '# Their photos, biggest first\n\n' + saved.map(s => `- ${s.file}: ${s.w}x${s.h}${s.bg ? (s.top < 900 ? (s.page ? ', the hero background of that page' : ', the hero background of the landing page') : ', a section background') : ''}, alt "${s.alt}", from ${s.page || 'the landing page'}, ${s.src}`).join('\n') + '\n');
  if (saved.length) {
    const sheet = await b.newPage({ viewport: { width: 1200, height: 800 } });
    await sheet.setContent(`<body style="margin:0;background:#fff;font:14px sans-serif;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px">${saved.map(s => `<figure style="margin:0"><img src="${s.src}" style="width:100%;height:200px;object-fit:cover;display:block"><figcaption>${path.basename(s.file)} ${s.w}x${s.h}</figcaption></figure>`).join('')}</body>`, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    await sheet.screenshot({ path: path.join(IN, 'photo-sheet.jpg'), fullPage: true, type: 'jpeg', quality: 75 }).catch(() => {});
  }
  delete facts.images; facts.photos_saved = saved.length;
  fs.writeFileSync(path.join(IN, 'site-facts.json'), JSON.stringify(facts, null, 1));
  await b.close();

  // Their page's craft: fonts, buttons, colours, motion, and what it already does well.
  const c = QUICK ? { status: 0 } : spawnSync(process.execPath, [path.join(__dirname, 'live-craft.cjs'), url, path.join(work, 'craft.md')], { encoding: 'utf8', timeout: 180000, env: process.env });
  if (!QUICK && c.status !== 0) fs.writeFileSync(path.join(work, 'craft.md'), "Their live page's craft could not be measured.\n");

  if (blocked) {
    fs.writeFileSync(path.join(work, 'NOT-CAPTURED.txt'), `${url} showed a bot check or an error page (status ${status}).\n`);
    console.log(`NOT CAPTURED: ${url} showed a bot check or an error page (status ${status}). The files show that page, not theirs.`);
    console.log(QUICK ? 'Pick another competitor, or leave this one out of the audit.' : 'Ask the owner for screenshots of the page and its text, and work from those.');
    process.exit(2);
  }
  console.log(`Captured ${url} (status ${status}, loaded in ${(loadMs / 1000).toFixed(1)} s, largest paint ${lcpMs == null ? 'not measured' : (lcpMs / 1000).toFixed(1) + ' s'}).`);
  console.log(`Tags found: ${tags.join(', ') || 'none'}. Forms: ${facts.forms.length}. Phone links: ${facts.phones.length}. Photos saved: ${saved.length}.`);
  const pns = facts.phone_numbers || [];
  if (pns.length > 5) console.log(`PHONE NUMBERS: ${pns.length} numbers on the page, likely a location list. Use the main one in the header.`);
  else if (pns.length > 1 || pns.some(n => n.where.some(w => /dials another/.test(w)))) console.log(`PHONE NUMBERS DIFFER: ${pns.map(n => `${n.digits} (${n.where.join(', ')})`).join('; ')}. Use the number on their live first screen without stopping to ask, and flag the mismatch first in the page-ready message (or in agency mode under "check before it goes live").`);
  console.log('Read these files:');
  for (const f of ['inputs/live-page-today.png', 'inputs/live-phone-today.png', 'inputs/live-full.jpg', 'inputs/site-page-text.md', 'inputs/site-page-text-phone.md', 'inputs/site-facts.json', 'inputs/photo-sheet.jpg', 'inputs/photos.md', facts.logo && facts.logo.file, 'craft.md', 'live-parts.json'])
    if (f && fs.existsSync(path.join(work, f))) console.log('  ' + path.join(work, f));
  if (fs.existsSync(path.join(IN, 'tracking-tags.html'))) console.log(`  ${path.join(IN, 'tracking-tags.html')} (their tracking tags, for the new page's <head>)`);
  if (facts.pages.length) console.log(`  ${path.join(work, 'inputs/pages')}/ (${facts.pages.length} more of their pages, as text)`);
})().catch(e => { console.log('Capture failed: ' + e.message); process.exit(1); });
