// node ../guard.cjs page.html  -> measured faults at laptop and phone; exit 0 only when clean.
const fs = require('fs'); const path = require('path');
const SITE = process.env.SITE_DIR || (fs.existsSync('/workspace/site/prompt.md') ? '/workspace/site' : process.cwd());
// Review 14 (20 Nov): the guard checks only the new page. Before page.html or
// directions/ exist it says so in one line and stops: our audit already read
// their live page, and a guard and critic on it again cost build f5fc9fe0 90 s.
if (!fs.existsSync(path.join(SITE, 'page.html')) && !fs.existsSync(path.join(SITE, 'directions'))) { console.log('There is no new page to check yet. Our audit already read their live page: build directions/ or page.html first.'); process.exit(1); }
const src = path.resolve(SITE, process.argv[2] || 'page.html'); const dir = path.dirname(src);
if (!fs.existsSync(src)) { console.log(`There is no ${path.relative(SITE, src) || src} yet, so there is nothing to check.`); process.exit(1); }
const { chromium } = require('playwright');
(async () => {
  let html = fs.readFileSync(src, 'utf8'); const kit = path.join(dir, 'kit.css');
  if (fs.existsSync(kit)) html = html.replace(/<head[^>]*>/i, m => m + '<style id="brand-kit">' + fs.readFileSync(kit, 'utf8') + '</style>');
  const tmp = path.join(dir, '.guard.html'); fs.writeFileSync(tmp, html);
// Lines about the site itself (24 Nov, Subaru). Each matches one sentence.
const META_LINES = [
  /[^.\n]*\bour (?:old|previous|current|existing) (?:page|site|website|homepage|tool|form|calculator|payment tool|search)\b[^.\n]*/i,
  /[^.\n]*\b(?:our|the) (?:site|website)?\s?search (?:says|shows|returns|said)\b[^.\n]*/i,
  /[^.\n]*\bthis (?:list|page|section|tool|calculator|form) (?:does the job of|replaces|fixes)\b[^.\n]*/i,
  /[^.\n]*\bfrom our (?:homepage|home page|website|live page)\b[^.\n]*/i,
  /[^.\n]*\b(?:our|their|the) (?:live|old) (?:page|site)\b[^.\n]*/i,
  /[^.\n]*\bour [a-z ]{0,25}\b(?:reads|says) ["\u201c][^.\n]*/i,
];
  const b = await chromium.launch(); const faults = []; const notes = []; const facts = {};
  // Their tracking tags belong only in the live copy that pack writes. In page.html every render and every
  // preview sends a visit to their real analytics and ads (johnnyrooter.com GA4, GTM and Meta, 26 Nov).
  const tagHits = [...new Set((html.match(/googletagmanager\.com\/(?:gtag\/js|gtm\.js)[^"'\s]*|\bgtag\(\s*['"]config['"]\s*,\s*['"][^'"]+|\bfbq\(\s*['"]init['"]\s*,\s*['"][^'"]+|clarity\.ms\/tag\/\w+|GTM-[A-Z0-9]{4,}/g) || []))];
  if (tagHits.length) faults.push(`tracking tags in page.html (${tagHits.slice(0, 3).join(' | ')}): take them out and leave <!-- ppcio:tracking-tags --> in the <head>. pack puts them into the live copy only.`);
  for (const [name, vp] of [['laptop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport: vp, ignoreHTTPSErrors: true }); await p.route(/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|connect\.facebook\.net|facebook\.com\/tr|clarity\.ms|hotjar\.com|bat\.bing\.com|analytics\.tiktok\.com|snap\.licdn\.com/i, r => r.abort()).catch(() => {}); await p.goto('file://' + tmp, { waitUntil: 'load', timeout: 60000 }).catch(() => {}); await p.waitForTimeout(1200); await p.evaluate(() => document.fonts.ready).catch(() => {});
    const r = await p.evaluate(() => {
      const out = { small: [], dash: [], buttons: [], fonts: [], strips: [], broken: [], dupes: [], overflow: 0 };
      const vis = el => { const s = getComputedStyle(el); const rc = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05 && rc.width > 0 && rc.height > 0; };
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const seenEl = new Set();
      while (tw.nextNode()) { const t = tw.currentNode.textContent.trim(); if (!t) continue; const el = tw.currentNode.parentElement; if (!el || seenEl.has(el) || !vis(el)) continue; seenEl.add(el); const s = getComputedStyle(el); const fs = parseFloat(s.fontSize);
        if (fs < 14 && t.length > 1) out.small.push(`${fs}px "${t.slice(0, 40)}"`);
        if (/—/.test(t) && !el.closest('blockquote,q,cite') && !/[“"][^”"]*—[^”"]*[”"]/.test(t)) out.dash.push(t.slice(0, 60)); // run 12: a quoted review keeps its own dash
        const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        if (/^(times|times new roman|serif)$/i.test(fam) || (fam && ![...document.fonts].some(f => f.family.replace(/["']/g, '') === fam && f.status === 'loaded') && !document.fonts.check(`${s.fontWeight} 16px "${fam}"`) && !/^(system-ui|-apple-system|sans-serif|serif|arial|helvetica|georgia|inherit)$/i.test(fam))) out.fonts.push(`${fam} on "${t.slice(0, 30)}"`); }
      document.querySelectorAll('a,button,[role=button],input[type=submit]').forEach(el => { if (!vis(el)) return; const s = getComputedStyle(el); const t = (el.innerText || el.value || '').trim(); const cls = (el.className || '') + '';
        const looksAction = el.tagName !== 'A' || /btn|button|cta/i.test(cls) || /^(call|book|get|schedule|start|find|request|claim|see|apply|reserve|contact)\b/i.test(t);
        if (!looksAction || !t || t.length > 60) return; const bg = s.backgroundColor; const hasBg = bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg); const hasBorder = parseFloat(s.borderTopWidth) > 0 && !/rgba\(0, 0, 0, 0\)/.test(s.borderTopColor);
        const rc = el.getBoundingClientRect(); const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom); const underlined = /underline/.test(s.textDecorationLine); if (el.closest('nav,header') === null && ((!hasBg && !hasBorder && rc.height < 44) || (pad < 12 && rc.height < 36) || (underlined && (hasBg || /btn|button|cta/i.test(cls))))) out.buttons.push(`"${t.slice(0, 30)}" is an action with no button look (${Math.round(rc.height)}px tall)`); });
      document.querySelectorAll('img').forEach(im => { if (!vis(im)) return; const rc = im.getBoundingClientRect(); if (im.complete && im.naturalWidth === 0) out.broken.push(im.src.slice(-60)); else if (rc.width > 700 && rc.width / rc.height > 3.4) out.strips.push(`${Math.round(rc.width)}x${Math.round(rc.height)} ${im.src.slice(-40)}`); });
      const hs = {}; document.querySelectorAll('h1,h2,h3').forEach(h => { const t = h.innerText.trim().toLowerCase(); if (t) hs[t] = (hs[t] || 0) + 1; }); out.dupes = Object.entries(hs).filter(([, n]) => n > 1).map(([t]) => t.slice(0, 50));
      out.overflow = document.documentElement.scrollWidth - window.innerWidth;
      // Blind runs 6 and 10: the same button twice in the first screen ("Book Now" in the header and the hero), and a logo too small to read.
      const vh = window.innerHeight; const firstActs = {};
      document.querySelectorAll('a,button,input[type=submit]').forEach(el => { if (!vis(el)) return; const rc = el.getBoundingClientRect(); const pos = getComputedStyle(el.closest('[style*=fixed],[style*=sticky]') || el).position; const top = rc.top + window.scrollY; if (top + rc.height / 2 < 0 || top + rc.height / 2 > vh || /fixed|sticky/.test(pos) && rc.top > vh * 0.6) return; const t = (el.innerText || el.value || '').trim().toLowerCase().replace(/\s+/g, ' '); if (t && t.length < 40 && !/^[\d()+\-\s.]+$/.test(t)) firstActs[t] = (firstActs[t] || 0) + 1; });
      out.twice = Object.entries(firstActs).filter(([, n]) => n > 1).map(([t]) => `"${t}"`);
      const logo = [...document.querySelectorAll('header img, nav img, header svg, [class*=logo] img, img[alt*=logo i], img[src*=logo i]')].filter(vis)[0];
      out.logoH = logo ? Math.round(logo.getBoundingClientRect().height) : null;
      const heads = [...document.querySelectorAll('h1,h2,h3')].filter(vis);
      out.italicHeads = heads.filter(h => h.querySelector('em,i') || [...h.querySelectorAll('*')].some(x => getComputedStyle(x).fontStyle === 'italic') || getComputedStyle(h).fontStyle === 'italic').map(h => h.innerText.trim().slice(0, 50));
      out.fragments = heads.map(h => h.innerText.trim()).filter(t => { const parts = t.split(/[.!?]\s+/).map(x => x.replace(/[.!?]$/, '').trim()).filter(Boolean); return parts.length >= 2 && parts.every(p => p.split(/\s+/).length <= 4); }).map(t => t.slice(0, 50));
      const deck = /\b(unlock|leverage|seamless(ly)?|elevate[sd]?|robust|empower|streamline|holistic|synergy|game-?changer|effortless(ly)?|curated|bespoke journey)\b/i;
      out.deck = [...new Set((document.body.innerText.match(new RegExp(deck.source, 'gi')) || []).map(x => x.toLowerCase()))];
      const acts = [...document.querySelectorAll('a,button,input[type=submit]')].filter(vis).map(a => (a.innerText || a.value || '').trim().replace(/[\d()+\-\s]{7,}/g, ' #').replace(/\s+/g, ' ').toLowerCase()).filter(t => t && t.length < 40 && /^(book|call|get|schedule|find|request|start|see|choose|claim|reserve|contact|send|apply|text|email|plan)/.test(t));
      out.actionNames = [...new Set(acts)];
      out.lookalikes = [...document.querySelectorAll('body *')].filter(vis).filter(el => getComputedStyle(el).cursor === 'pointer' && !el.closest('a,button,label,input,select,textarea,summary,[role=button],[role=tab],[role=radio],[role=checkbox],[onclick],[tabindex],details')).map(el => (el.innerText || el.className || el.tagName).toString().trim().slice(0, 30)).slice(0, 6);
      const js = [...document.scripts].map(x => x.textContent).join('\n');
      out.mailForm = [...document.querySelectorAll('form')].some(f => /^mailto:/i.test(f.getAttribute('action') || '')) || /(submit[\s\S]{0,1500}mailto:|location\.href\s*=\s*['"`]mailto:)/.test([...document.scripts].map(x => x.textContent).join(''));
      // A form the kit has not connected yet says so in plain words (3-build.md). That is honest, so it is a
      // go-live note, not a fault. Before 26 Nov the guard failed it and the builders hacked around it.
      out.formNotConnected = /this form is not connected yet/i.test(js + document.body.innerHTML);
      out.fakeSend = !out.formNotConnected && /preventDefault\(\)/.test(js) && /submit/.test(js) && !/fetch\(|XMLHttpRequest|sendBeacon|location\.(href|assign)|mailto:|window\.open|\.submit\(\)/.test(js);
      out.eyebrows = [...document.querySelectorAll('body *')].filter(vis).filter(el => { const s = getComputedStyle(el); const t = (el.innerText || '').trim(); return t && t.length < 50 && el.children.length <= 1 && s.textTransform === 'uppercase' && parseFloat(s.letterSpacing) > 0.5 && parseFloat(s.fontSize) <= 17 && !el.closest('a,button,nav,footer,header,label'); }).map(el => el.innerText.trim().slice(0, 30));
      out.mono = [...new Set([...document.querySelectorAll('body *')].filter(vis).filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(el => getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '').trim()).filter(f => /mono|courier|consolas|menlo|^monospace$/i.test(f)))];
      out.caseHeads = heads.filter(h => { const tt = getComputedStyle(h).textTransform; const w = h.innerText.trim().split(/\s+/).length; return tt === 'lowercase' || (tt === 'uppercase' && w > 6); }).map(h => h.innerText.trim().slice(0, 50));
      out.ctaFirst = [...document.querySelectorAll('a,button,input[type=submit]')].filter(vis).some(el => { const rc = el.getBoundingClientRect(); const s = getComputedStyle(el); const bg = s.backgroundColor; const t = (el.innerText || el.value || '').trim(); return rc.top >= 0 && rc.bottom <= window.innerHeight && rc.height >= 40 && rc.width >= 120 && bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg) && t.length > 2 && !el.closest('nav'); });
      const wc = t => t.trim().split(/\s+/).filter(Boolean).length;
      const chrome = e => !!e.closest('header,nav,footer');
      const h12 = [...document.querySelectorAll('h1,h2')].filter(e => vis(e) && !chrome(e)).map(e => wc(e.innerText));
      out.headWords = h12.length ? +(h12.reduce((x, y) => x + y, 0) / h12.length).toFixed(1) : 0;
      const pw = [...document.querySelectorAll('p')].filter(e => vis(e) && !chrome(e)).map(e => wc(e.innerText)).filter(n => n > 3).sort((x, y) => x - y);
      out.paraWords = pw.length ? pw[Math.floor(pw.length / 2)] : 0;
      const alltext = [...document.querySelectorAll('p,li,h1,h2,h3')].filter(e => vis(e) && !chrome(e)).map(e => e.innerText).join(' ');
      const sents = alltext.split(/[.!?]+\s/).map(wc).filter(n => n > 2); out.sentWords = sents.length ? +(sents.reduce((x, y) => x + y, 0) / sents.length).toFixed(1) : 0;
      let fw = 0; const tw2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); while (tw2.nextNode()) { const n = tw2.currentNode; const el = n.parentElement; if (!el || !vis(el) || chrome(el) || el.closest('script,style')) continue; if (el.getBoundingClientRect().top + scrollY < window.innerHeight) fw += wc(n.textContent); } out.firstWords = fw;
      out.headTexts = [...document.querySelectorAll('h1,h2,h3')].map(e => e.textContent.replace(/\s+/g, ' ').trim().toLowerCase()).filter(Boolean);
      out.btnTexts = [...document.querySelectorAll('a,button,input[type=submit]')].map(e => (e.textContent || e.value || '').replace(/\s+/g, ' ').trim().toLowerCase()).filter(t => t && t.length < 40);
      out.leadForms = [...document.querySelectorAll('form')].filter(f => [...f.querySelectorAll('input,select,textarea')].filter(i => !/^(hidden|submit|button|search|image|reset)$/i.test(i.type || '')).length >= 2).length;
      // 24 Nov (agency builds): what the live-parts checks below compare.
      const fieldTops = [...document.querySelectorAll('input,select,textarea')].filter(i => vis(i) && !/^(hidden|submit|button|search|image|reset|checkbox|radio)$/i.test(i.type || '')).map(i => i.getBoundingClientRect().top + scrollY).sort((a, b) => a - b);
      out.formTop = fieldTops.length >= 2 ? Math.round(fieldTops[0]) : null;
      out.faqCount = new Set([...document.querySelectorAll('summary,dt,h2,h3,h4,h5,h6,button,[aria-expanded],p,strong')].map(e => (e.textContent || '').replace(/\s+/g, ' ').trim().replace(/[^\w?)]+$/, '')).filter(t => t.length <= 160 && t.split(' ').length >= 4 && /\?$/.test(t))).size;
      out.bodyText = (document.body.innerText || '').slice(0, 200000);
      // A thin line (4 px or less) that crosses heading text: the GenConnect
      // hero shipped with a stray vertical rule through its headline.
      const bigHeads = [...document.querySelectorAll('h1,h2')].filter(vis).map(h => { const rg = document.createRange(); rg.selectNodeContents(h); return { t: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 50), rs: [...rg.getClientRects()].filter(x => x.width > 2), h }; });
      out.linesOverHeads = [];
      for (const e of document.querySelectorAll('body *')) {
        if (!vis(e) || e.closest('h1,h2')) continue; const rc = e.getBoundingClientRect(); const thin = (rc.width <= 4 && rc.height >= 24) || (rc.height <= 4 && rc.width >= 24); if (!thin) continue;
        const c = getComputedStyle(e); const inked = (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') || parseFloat(c.borderLeftWidth) > 0 || parseFloat(c.borderTopWidth) > 0 || c.backgroundImage !== 'none'; if (!inked) continue;
        for (const hd of bigHeads) { if (hd.h.contains(e)) continue; if (hd.rs.some(x => rc.left < x.right && rc.right > x.left && rc.top < x.bottom && rc.bottom > x.top)) { out.linesOverHeads.push(`a ${Math.round(rc.width)}x${Math.round(rc.height)} px line (${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : ''}) crosses "${hd.t}"`); break; } }
        if (out.linesOverHeads.length >= 4) break;
      }
      // (No ::before/::after check: a heading's accent bar or underline is
      // design, and the pixel seam check below covers a real line.)
      out.ids = [...document.querySelectorAll('[id],a[name]')].map(e => e.id || e.getAttribute('name'));
      out.hrefs = [...document.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href') || '', t: (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30) }));
      const h1 = document.querySelector('h1'); out.h1 = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0;
      const ps = [...document.querySelectorAll('p')].filter(vis).map(p => parseFloat(getComputedStyle(p).fontSize)).sort((a, b) => a - b); out.body = ps.length ? ps[Math.floor(ps.length / 2)] : 0;
      return out; });
    // Review 15 (21 Nov, his video 18:14): on a phone the card "Emergency
    // plumber in..." had its heading cut in half by the next card, and 3 of 9
    // service cards had a photo. The guard saw neither. Two checks:
    // (1) covered: each visible h1-h3 and button, scrolled to the middle of the
    //     screen, is hit-tested at 5 points; another element on top at 2 or
    //     more is a fault. In a stack of sticky cards, a heading may be fully
    //     hidden by the next card (that is the stack), never cut part way.
    // (2) cards: in a set of 3 or more like cards, photos go on all, none, or
    //     all but one (or one feature card). Icons do not count.
    const r3 = await p.evaluate(() => {
      const vis = el => { const s = getComputedStyle(el); const rc = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && rc.width > 0 && rc.height > 0; };
      const stuck = el => { for (let x = el; x && x !== document.body; x = x.parentElement) { const ps = getComputedStyle(x).position; if (ps === 'sticky' || ps === 'fixed') return x; } return null; };
      const label = el => (el.innerText || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 40);
      const who = el => el ? (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '')) : 'nothing';
      const probe = el => { const rc = el.getBoundingClientRect(); const pts = [[0.5, 0.5], [0.2, 0.25], [0.8, 0.25], [0.2, 0.75], [0.8, 0.75]]; let hit = 0; let by = null;
        for (const [fx, fy] of pts) { const x = rc.left + rc.width * fx; const y = rc.top + rc.height * fy; if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue; const top = document.elementFromPoint(x, y); if (top && top !== el && !el.contains(top) && !top.contains(el)) { hit++; by = by || top; } }
        return { hit, by }; };
      // A page with scroll-behavior: smooth would still be moving when we
      // hit-test (build 403bd3bb has it), so every scroll here is instant.
      document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important'); document.body.style.setProperty('scroll-behavior', 'auto', 'important');
      const covered = []; const seen = new Set();
      const targets = [...document.querySelectorAll('h1,h2,h3,button,a.btn,a.button,[class*=cta],input[type=submit]')].filter(el => vis(el) && el.getBoundingClientRect().height < innerHeight * 0.6 && label(el)).slice(0, 80);
      for (const el of targets.filter(el => !stuck(el))) {
        const rc = el.getBoundingClientRect(); window.scrollTo(0, Math.max(0, rc.top + scrollY - innerHeight / 2 + rc.height / 2));
        const { hit, by } = probe(el); if (hit >= 2 && !seen.has(label(el))) { seen.add(label(el)); covered.push(`"${label(el)}" is covered by ${who(by)} at ${hit} of 5 points`); } }
      // Sticky stacks: when each card reaches its stuck place, the card before
      // it must show its heading whole or hide it whole.
      const stacks = new Map(); document.querySelectorAll('body *').forEach(el => { if (getComputedStyle(el).position === 'sticky' && el.parentElement && vis(el)) { const k = el.parentElement; (stacks.get(k) || stacks.set(k, []).get(k)).push(el); } });
      for (const cards of stacks.values()) { if (cards.length < 2) continue;
        for (let i = 1; i < cards.length; i++) { const prev = cards[i - 1]; const head = prev.querySelector('h1,h2,h3,h4'); if (!head || !vis(head)) continue; const next = cards[i];
          const topAt = parseFloat(getComputedStyle(next).top) || 0; window.scrollTo(0, 0); const flow = next.getBoundingClientRect().top + scrollY; window.scrollTo(0, Math.max(0, flow - topAt));
          const hr = head.getBoundingClientRect(); let hid = 0; let rows = 0;
          for (let fy = 0.05; fy < 1; fy += 0.1) { const y = hr.top + hr.height * fy; if (y < 0 || y >= innerHeight) continue; rows++; const top = document.elementFromPoint(hr.left + hr.width * 0.3, y); if (top && top !== head && !head.contains(top) && !top.contains(head)) hid++; }
          if (rows && hid && hid < rows && !seen.has(label(head))) { seen.add(label(head)); covered.push(`"${label(head)}" is cut part way by the next stacked card (${Math.round((100 * hid) / rows)}% of it hidden); give each card's heading room or hide it whole`); } } }
      window.scrollTo(0, 0);
      // Card sets: siblings with the same tag and first class, each with text.
      // Page parts (section, main and their direct children) are not cards:
      // the Pimlico style build (3e6fc38a) has photos in 2 of 5 sections by design.
      const part = /^(SECTION|MAIN|HEADER|FOOTER|NAV|ASIDE|FORM)$/;
      const sets = []; document.querySelectorAll('body *').forEach(par => { if (/^(BODY|MAIN)$/.test(par.tagName)) return; const kids = [...par.children].filter(k => vis(k) && !part.test(k.tagName)); if (kids.length < 3) return;
        const groups = {}; kids.forEach(k => { const key = k.tagName + '.' + ((typeof k.className === 'string' && k.className.trim().split(/\s+/)[0]) || ''); (groups[key] = groups[key] || []).push(k); });
        for (const g of Object.values(groups)) { if (g.length < 3 || g.some(k => k.getBoundingClientRect().height < 80 || !(k.innerText || '').trim() || k.closest('nav,header,footer'))) continue;
          const photo = k => { const w = k.getBoundingClientRect().width; return [...k.querySelectorAll('img,picture,video')].some(m => vis(m) && m.getBoundingClientRect().width >= w * 0.3) || [...k.querySelectorAll('*'), k].some(x => /url\(/.test(getComputedStyle(x).backgroundImage) && x.getBoundingClientRect().width >= w * 0.3 && x.getBoundingClientRect().height >= 80); };
          const n = g.length; const withPhoto = g.filter(photo).length; if (withPhoto >= 2 && withPhoto <= n - 2) sets.push(`${withPhoto} of ${n} cards have a photo ("${label(g.find(photo).querySelector('h2,h3,h4') || g.find(photo))}" has one, "${label(g.find(k => !photo(k)).querySelector('h2,h3,h4') || g.find(k => !photo(k)))}" has none); give every card a photo, or none`); } });
      return { covered, sets: [...new Set(sets)] }; });
    r3.covered.slice(0, 6).forEach(x => faults.push(`${name}: covered: ${x}`));
    r3.sets.slice(0, 3).forEach(x => faults.push(`${name}: cards mix photos: ${x}`));
    facts[name] = { h1: r.h1, bodyMedian: r.body };
    const add = (k, list) => list.slice(0, 8).forEach(x => faults.push(`${name}: ${k}: ${x}`));
    add('text under 14px', r.small); add('em dash', r.dash); add('button', r.buttons); add('font not loaded or fallback', r.fonts.slice(0, 3)); add('photo cut to a strip', r.strips); add('broken image', r.broken); add('repeated heading', r.dupes); add('same button twice in the first screen', r.twice); if (r.logoH !== null && r.logoH < (name === 'phone' ? 22 : 30)) faults.push(`${name}: logo is ${r.logoH}px tall; make it at least ${name === 'phone' ? 22 : 30}px so the brand reads`);
    if (name === 'laptop') { if (r.italicHeads.length > 1) notes.push(`laptop: ${r.italicHeads.length} headings use italic accent words (the look the owner said grates): ${r.italicHeads.slice(0, 3).join(' | ')}`);
      if (r.fragments.length >= 2) notes.push(`laptop: ${r.fragments.length} headings are paired or tripled fragments (AI copy rhythm): ${r.fragments.slice(0, 4).join(' | ')}`);
      if (r.deck.length) notes.push(`laptop: deck words: ${r.deck.join(', ')}`);
      if (r.actionNames.length > 4) notes.push(`laptop: ${r.actionNames.length} different names for the page's actions (use the brand card's one name each): ${r.actionNames.slice(0, 8).join(' | ')}`);
      if (r.lookalikes.length) faults.push(`laptop: looks pressable (pointer) but is not a link, button or control: ${r.lookalikes.join(' | ')}`);
      if (r.eyebrows.length > 1) notes.push(`laptop: ${r.eyebrows.length} small letter-spaced uppercase labels (eyebrows, a banned AI tell): ${r.eyebrows.slice(0, 5).join(' | ')}`);
      if (r.mailForm) faults.push('laptop: a form opens the mail app on submit; it must send, hand off to their real form, or be a plain email link');
      if (r.formNotConnected) notes.push('laptop: the form says "This form is not connected yet". Before it goes live, connect it to their form tool, Formspree, Netlify Forms or their CRM (5-go-live.md)');
      if (r.fakeSend) faults.push('laptop: a form handler stops the submit and sends nothing; it must post somewhere real, hand off, or not pretend to send'); }
    if (r.mono.length) faults.push(`${name}: monospace type on the page (the owner's standing rule: none): ${r.mono.join(', ')}`);
    if (name === 'laptop' && r.caseHeads.length) faults.push(`laptop: headings forced into lowercase, or long uppercase sentences (set headlines in sentence case): ${r.caseHeads.slice(0, 4).join(' | ')}`);
    if (name === 'phone' && !r.ctaFirst) faults.push('phone: no filled main button on the first screen (390x844); the buyer must see how to act without scrolling');
    if (name === 'laptop') notes.push(`laptop: copy shape: headings ${r.headWords} words on average (aim for 6 to 10, with an outcome, a fact or the buyer's problem in each), sentences ${r.sentWords} (Flock 13), paragraphs ${r.paraWords} (Flock 11), first screen ${r.firstWords} words (Flock 66; keep it under about 80)`);
    if (name === 'laptop') {
      // Review 13, 19 Nov: a paying customer's live page took sign-ups through
      // a form; the new page had none, and six buttons still pointed at the
      // old page's #assinar, so they go nowhere once this page replaces it.
      let sf = {}; try { sf = JSON.parse(fs.readFileSync(path.join(dir, 'inputs', 'site-facts.json'), 'utf8')); } catch (e) {}
      const live = Array.isArray(sf.live_forms) ? sf.live_forms : Array.isArray(sf.forms) ? sf.forms.filter(f => (f.fields || []).length >= 2) : [];
      if (live.length && !r.leadForms) { const f = live[0]; const flds = f.asks || f.fields || []; const btn = f.submit || f.button || ''; faults.push(`laptop: their live page takes enquiries through a form (it asks: ${flds.slice(0, 6).join(', ')}${btn ? `; button "${btn}"` : ''}). This page has no form: keep one that asks the same, where a buyer decides`); }
      // 24 Nov (agency builds): the new page must keep what their live page
      // already does well (live-parts.json, from live-craft.cjs). GenConnect
      // lost its first-screen form, its FAQ and its "100+" reviews; LawWorks
      // lost "33 Google reviews". Each check is skipped when the file is missing.
      let lp = null; try { lp = JSON.parse(fs.readFileSync(path.join(SITE, 'live-parts.json'), 'utf8')); } catch (e) {}
      if (lp && !lp.blocked) {
        let plan = ''; try { plan = fs.readFileSync(path.join(SITE, 'plan.md'), 'utf8'); } catch (e) {}
        if (lp.form_on_first_laptop_screen && (r.formTop == null || r.formTop > 900) && !/form moved:/i.test(plan)) faults.push(`laptop: their live page has its enquiry form on the first screen; this page's form is ${r.formTop == null ? 'missing' : `at ${r.formTop} px`}. Put the form on the first screen, beside the headline, or, if their live first-screen fields are not an enquiry form, write "Form moved: <the reason>" in plan.md`);
        if ((lp.faq_count || 0) >= 3 && !r.faqCount && !/faq left out:/i.test(plan)) faults.push(`laptop: their live page answers ${lp.faq_count} questions (${(lp.faq || []).slice(0, 3).join(' | ')}); this page has no question-and-answer section. Keep one near the form, or write "FAQ left out: <the reason>" in plan.md`);
        const nums = new Set(); const grab = t => { for (const m of String(t || '').matchAll(/(?<![\d\-.)(])(\d[\d,]*)\+?\s+(?:[a-z-]+\s+){0,3}reviews?/gi)) nums.add(m[1].replace(/,/g, '')); };
        (lp.review_figures || []).forEach(grab); grab((lp.review_widget_text || '').slice(0, 300));
        if (!nums.size) (lp.review_markup || []).forEach(grab);
        const shown = [...nums].some(n => new RegExp(`\\b${n.replace(/\B(?=(\d{3})+$)/g, ',?')}\\+?\\s+(?:[a-z-]+\\s+){0,3}reviews?`, 'i').test(r.bodyText) || new RegExp(`\\b${n}(?!\\d)[^.]{0,40}reviews?`, 'i').test(r.bodyText));
        if (nums.size && !shown && !/reviews left out:/i.test(plan)) faults.push(`laptop: their live page shows ${[...nums].map(n => n + ' reviews').join(' and ')}; this page shows none of those figures. Show the count and its source beside the main button, or, if a rule in their trade stops it, write "Reviews left out: <the reason>" in plan.md`);
        if ((lp.logo_rows || []).length) notes.push(`laptop: their live page has a row of small images (${lp.logo_rows[0].alts.slice(0, 5).join(', ')}). If they are client logos, awards or badges, show them as images, not as a line of text. If they are suppliers or brands they install or sell, leave them out: a buyer reads them as clients`);
      }
      r.linesOverHeads.forEach(x => faults.push(`laptop: ${x}; move it off the text or remove it`));
      // 24 Nov (Subaru rebuild): judged against their live page, the build
      // wrote that comparison onto the page: "Our old payment tool showed $0 a
      // month", "So our search says No vehicles matched", "This list does the
      // job of our search filters". A buyer reads about cars, never the site.
      const meta = new Set(); META_LINES.forEach(re => (r.bodyText.match(new RegExp(re.source, 'gi')) || []).forEach(x => meta.add(x.trim().slice(0, 90)))); meta.forEach(x => faults.push(`laptop: a line talks about their website or this page instead of the offer ("${x}"). Rewrite it for the buyer, or remove it`));
      // A seam is a 1 or 2 px column of a different colour that runs through a
      // heading: GenConnect's hero photo began 1 px left of its dark overlay,
      // so a bright line ran down through the headline. No element is thin
      // there, so this reads the pixels of each heading's band.
      try {
        const bands = await p.evaluate(() => [...document.querySelectorAll('h1,h2')].filter(h => h.getBoundingClientRect().height > 20).slice(0, 10).map(h => { const rc = h.getBoundingClientRect(); return { t: h.textContent.replace(/\s+/g, ' ').trim().slice(0, 50), x: Math.max(0, Math.round(rc.left - 40)), y: Math.max(0, Math.round(rc.top + scrollY) - 24), w: Math.round(Math.min(rc.width + 80, 1440 - Math.max(0, rc.left - 40))), h: Math.round(rc.height) + Math.min(24, Math.round(rc.top + scrollY)) + 24, m: Math.min(24, Math.round(rc.top + scrollY)) }; }));
        for (const bd of bands) {
          const png = await p.screenshot({ clip: { x: bd.x, y: bd.y, width: bd.w, height: bd.h }, fullPage: true });
          const xs = await p.evaluate(async ([b64, M]) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; const W = c.width, H = c.height; const L = (x, y) => { const i = (y * W + x) * 4; return 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]; }; const hits = [];
            // A seam runs on above and below the heading (24 px each way), where
            // no letter reaches: a letter's 1 px stroke (l, I, t) never does.
            const hit = (x, w, y) => { const a = L(x - 1, y), m = (L(x, y) + L(x + w - 1, y)) / 2, z = L(x + w, y); return (m - a > 14 && m - z > 14) || (a - m > 14 && z - m > 14); };
            for (let x = 1; x < W - 3; x++) for (const w of [1, 2]) { let top = 0, mid = 0, bot = 0; for (let y = 0; y < H; y++) { if (!hit(x, w, y)) continue; if (y < M) top++; else if (y >= H - 24) bot++; else mid++; } if ((M < 8 || top >= M * 0.9) && bot >= 24 * 0.9 && mid >= (H - M - 24) * 0.5) { hits.push(x); break; } }
            return hits; }, [png.toString('base64'), bd.m]);
          if (xs.length && xs.length <= 3) faults.push(`laptop: a 1 to 2 px seam runs down through "${bd.t}" at x ${bd.x + xs[0]} px (often a photo or panel edge that does not meet its overlay); line the edges up or move the edge off the text`);
        }
      } catch (e) { notes.push('laptop: the seam check did not run (' + String((e && e.message) || e).slice(0, 80) + ')'); }

      const key = u => { try { const x = new URL(u); return (x.origin + x.pathname.replace(/\/+$/, '')).toLowerCase(); } catch (e) { return null; } };
      const dec = x => { try { return decodeURIComponent(x); } catch (e) { return x; } };
      const own = sf.url ? key(sf.url) : null; const ids = new Set(r.ids); const dead = {};
      for (const { href, t } of r.hrefs) {
        let id = null;
        if (/^#[^#]+$/.test(href) && !/^#top$/i.test(href)) id = dec(href.slice(1));
        else if (own && /^https?:/i.test(href) && href.includes('#')) { const [base, h] = href.split('#'); if (h && key(base) === own) id = dec(h); }
        if (id && !ids.has(id)) (dead[id] ??= []).push(t || href.slice(0, 40));
      }
      for (const [id, labels] of Object.entries(dead).slice(0, 4)) faults.push(`laptop: ${labels.length} link${labels.length > 1 ? 's go' : ' goes'} to #${id}, which is on no part of this page (once this page replaces theirs, ${labels.length > 1 ? 'they go' : 'it goes'} nowhere): ${[...new Set(labels)].slice(0, 3).join(' | ')}. Build that part here with id="${id}", or point ${labels.length > 1 ? 'them' : 'it'} at a part of this page`);
    }
    if (r.overflow > 2) faults.push(`${name}: page is ${r.overflow}px wider than the screen`);
    if (name === 'laptop' && r.body && r.body < 17) faults.push(`laptop: body text median is ${r.body}px (17px or more)`);
    if (name === 'laptop' && fs.existsSync(path.join(dir, 'brand.md'))) {
      await p.addStyleTag({ content: 'img,video,picture,svg image{visibility:hidden!important} *{background-image:none!important}' });
      const shot = path.join(dir, '.colour.png'); await p.screenshot({ path: shot, fullPage: true });
      const r2 = require('child_process').spawnSync('python3', [path.join(__dirname, 'colourshare.py'), shot, path.join(dir, 'brand.md')], { encoding: 'utf8' });
      let line = (r2.stdout || '').trim();
      if (!line) {
        // Pure-Playwright fallback when python3 or Pillow is absent on a buyer's computer.
        try {
          const hexes = [...new Set((fs.readFileSync(path.join(dir, 'brand.md'), 'utf8').match(/#[0-9a-fA-F]{6}\b/g) || []))].slice(0, 6);
          const b64 = fs.readFileSync(shot).toString('base64');
          line = await p.evaluate(async ([img64, hx]) => {
            const hls = (r, g, b) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; if (mx === mn) return [0, l, 0]; const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); const h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); return [h * 60, l, s]; };
            const bh = hx.map(h => hls(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16))).filter(([, , s]) => s > 0.2).map(([h, l]) => [h, l]);
            if (!bh.length) return 'COLOUR: no brand hexes found in brand.md';
            const im = new Image(); im.src = 'data:image/png;base64,' + img64; await im.decode();
            const scale = Math.min(1, 360 / im.width, 4000 / im.height);
            const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.width * scale)); c.height = Math.max(1, Math.round(im.height * scale));
            const g = c.getContext('2d'); g.drawImage(im, 0, 0, c.width, c.height);
            const d = g.getImageData(0, 0, c.width, c.height).data; let on = 0, off = 0; const offc = {};
            for (let i = 0; i < d.length; i += 4) { const [h, l, s] = hls(d[i], d[i + 1], d[i + 2]); if (s < 0.18 || l < 0.06 || l > 0.96) continue; const ok = bh.some(([x, bl]) => Math.min(Math.abs(h - x), 360 - Math.abs(h - x)) <= 20 && (Math.abs(l - bl) <= 0.3 || l > 0.85)); if (ok) on++; else { off++; const k = Math.floor(h / 30) * 30; offc[k] = (offc[k] || 0) + 1; } }
            const t = on + off; const share = t ? Math.round(100 * on / t) : 100;
            const top = Object.entries(offc).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => `${k}deg`);
            return `COLOUR: ${share}% of the coloured area (photos hidden) is in their brand hues ${hx.join(', ')}; off-brand hues near ${top.join(', ') || 'none'}`;
          }, [b64, hexes]);
        } catch (e) {}
      }
      if (line) console.log(line);
      fs.unlinkSync(shot); }
    await p.close(); }
  await b.close(); fs.unlinkSync(tmp);
  // Review 14, K5 (21 Nov): the marks of an AI-made page, by the old
  // builder's own scan (slop.cjs, built from the worker's slop.ts), on the
  // page as written. Build f5fc9fe0 shipped with 13 of them and this guard
  // named none. A mark their live page has too (.live-marks.json, from
  // live-craft.cjs), a font their brand names, or one the style the owner
  // picked shows (references/style.md) is their look, so it is named and
  // stays. No model call.
  const ai = (() => {
    try {
      const slop = require(path.join(__dirname, 'slop.cjs'));
      const read = f => { try { return fs.readFileSync(path.join(SITE, f), 'utf8'); } catch (e) { return ''; } };
      let live = []; try { live = JSON.parse(read('.live-marks.json') || '[]'); } catch (e) {}
      const brandText = read('brand.md') + '\n' + read('inputs/brand-pack.json');
      let rawHtml = fs.readFileSync(src, 'utf8');
      // Strip unused @font-face blocks (e.g. a site's own Mono font in pasted inputs/fonts.css that no element uses)
      // so slopMarks never false-positives on a declared-but-unrendered font face.
      const styleOutsideFaces = rawHtml.replace(/@font-face\s*\{[^}]*\}/gi, '');
      rawHtml = rawHtml.replace(/@font-face\s*\{[^}]*\}/gi, (blk) => {
        const fm = (blk.match(/font-family\s*:\s*["']?([^;"'}]+)/i) || [])[1];
        if (!fm) return blk;
        const escFm = fm.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`font-family\\s*:[^;{}]*\\b${escFm}\\b`, 'i').test(styleOutsideFaces) ? blk : '';
      });
      const marks = slop.slopMarks(rawHtml, slop.brandHexes(brandText, read('kit.css')));
      // Resolve the chosen style's works/notes from directions/choice.md + library/index.json
      // (falling back to references/style.md) so style-sanctioned choices are never false-flagged.
      let styleNotes = read('references/style.md');
      if (!styleNotes) {
        const choice = read('directions/choice.md');
        const dom = ((choice.split('\n')[0] || '').match(/style\s*\d+\s*,\s*([^\s,]+)/i) || [])[1];
        if (dom) {
          const cleanDom = dom.replace(/\.+$/, '').replace(/^www\./, '').toLowerCase();
          const os = require('os');
          const libFiles = [
            path.join(process.env.PPCIO_HOME || path.join(os.homedir(), '.ppcio'), 'library', 'index.json'),
            path.join(__dirname, '..', 'library', 'index.json'),
          ];
          for (const lf of libFiles) {
            try {
              const idx = JSON.parse(fs.readFileSync(lf, 'utf8'));
              const hit = (Array.isArray(idx) ? idx : idx.pages || []).find(p => String(p.domain || p.url || '').toLowerCase().includes(cleanDom));
              if (hit) {
                const works = Array.isArray(hit.works) ? hit.works.join('\n') : String(hit.works || hit.notes || '');
                if (works) { styleNotes = works; break; }
              }
            } catch (e) {}
          }
        }
      }
      return slop.marksToReport(marks, Array.isArray(live) ? live : [], slop.styleWorksOf(styleNotes), brandText);
    } catch (e) { return { error: String((e && e.message) || e).slice(0, 120) }; }
  })();
  console.log(JSON.stringify({ measured: facts, faults: faults.length }, null, 0)); faults.forEach(f => console.log('- ' + f));
  if (ai.error) console.log(`ai marks: the scan did not run (${ai.error})`);
  else {
    ai.fix.forEach(m => console.log(`- ai mark: ${m.mark}: ${m.found}. Fix: ${m.fix}`));
    if (ai.theirs.length) console.log(`ai marks that are their own look (their live page or their brand has them), so they stay: ${ai.theirs.join(', ')}`);
    if (ai.style.length) console.log(`ai marks the style the owner picked shows, so they stay: ${ai.style.join(', ')}`);
    console.log(ai.fix.length ? `ai marks: ${ai.fix.length} to fix. Each "- ai mark" line makes the page look AI-made: fix it in this round.` : 'ai marks: none to fix');
  }
  notes.forEach(n => console.log('note (taste, not a rule): ' + n.replace(/^laptop: /, ''))); console.log(faults.length || (ai.fix && ai.fix.length) ? 'FAIL: fix every line above, then run the guard again.' : 'CLEAN');
  process.exit(faults.length ? 1 : 0);
})();
