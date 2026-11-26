// node ../shot.cjs page.html <round> [phone]
// Laptop 1440x900: first screen + up to 6 screen slices, and a whole-page view, saved to shots/ and r<round>/.
// "phone" renders 390x844 instead: first screen, then the whole page in tall tiles (3 screens each). Prints the files to read.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const SITE = process.env.SITE_DIR || (fs.existsSync('/workspace/site/prompt.md') ? '/workspace/site' : process.cwd());
  const src = path.resolve(SITE, process.argv[2] || 'page.html'); const round = process.argv[3] || 'x'; const phone = process.argv[4] === 'phone';
  const dir = path.dirname(src); const out = path.join(dir, 'r' + round + (phone ? '-phone' : '')); fs.mkdirSync(out, { recursive: true });
  let html = fs.readFileSync(src, 'utf8'); const kit = path.join(dir, 'kit.css');
  if (fs.existsSync(kit) && !/id=["']?brand-kit/.test(html)) { const blk = '<style id="brand-kit">\n' + fs.readFileSync(kit, 'utf8') + '\n</style>'; html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + blk) : blk + html; }
  const tmp = path.join(dir, `.render-${round}${phone ? '-phone' : ''}.html`); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const vp = phone ? { width: 390, height: 844 } : { width: 1440, height: 900 };
  const p = await b.newPage({ viewport: vp, ignoreHTTPSErrors: true });
  // A render must never send a visit to their analytics or ads, even when a tag slipped into page.html (buyer test, 26 Nov).
  await p.route(/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|connect\.facebook\.net|facebook\.com\/tr|clarity\.ms|hotjar\.com|bat\.bing\.com|analytics\.tiktok\.com|snap\.licdn\.com/i, r => r.abort()).catch(() => {});
  await p.goto('file://' + tmp, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  // 22 Nov: 500 px steps (under one screen, so every reveal still fires), then
  // wait for the pictures themselves, at most 4 s. The old 250 px steps took
  // 4-9 s of each 10-13 s render.
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } window.scrollTo(0, 0); });
  // The 1.5 s settle stays (a header that moves on scroll needs it); the wait
  // for the pictures runs inside it, so it only adds time when photos are slow.
  await p.evaluate(() => Promise.all([new Promise(r => setTimeout(r, 1500)), Promise.race([Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.addEventListener('load', r); i.addEventListener('error', r); }))), new Promise(r => setTimeout(r, 4000))])]));
  // 26 Nov (Opus kit test): a 300 ms wait caught fade-ups half done, and the critic called the
  // sections "almost invisible". Every reveal has fired by now, so finish each one at once.
  await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation-duration:1ms!important;animation-delay:0s!important}' }).catch(() => {});
  await p.waitForTimeout(150);
  const files = []; await p.screenshot({ path: `${out}/first.png` }); files.push(`${out}/first.png`);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  // A sticky call bar is drawn where the first screen is in a full-page shot, so it covered the hero in every
  // tile and the critic called it broken (26 Nov). The tiles hide fixed bars; first.png keeps them.
  if (phone) await p.evaluate(() => { for (const e of document.querySelectorAll('body *')) if (getComputedStyle(e).position === 'fixed') e.style.setProperty('visibility', 'hidden', 'important'); }).catch(() => {});
  // Phone: the whole page in tiles of 3 screens, so no part goes unseen (4 slices covered 40% of an 11,000 px page).
  if (phone) for (let i = 1, y = vp.height; y < h && i <= 12; i++, y += 3 * vp.height) { const f = `${out}/t${i}.png`; await p.screenshot({ path: f, fullPage: true, clip: { x: 0, y, width: vp.width, height: Math.min(3 * vp.height, h - y) } }); files.push(f); }
  const n = phone ? 0 : 6; const step = Math.max(vp.height, Math.ceil((h - vp.height) / 6));
  for (let i = 1, y = step; y < h && i <= n; i++, y += step) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(300); const f = `${out}/s${i}.png`; await p.screenshot({ path: f }); files.push(f); }
  if (!phone) { await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: `${out}/whole.jpg`, fullPage: true, type: 'jpeg', quality: 60 }).catch(() => {}); }
  await b.close(); fs.unlinkSync(tmp); if (!phone) fs.copyFileSync(src, path.join(out, 'page.html'));
  // Production (17 Nov): the worker shows each first screen and round on the wait screen.
  try { const O = process.env.STUDIO_OUT; if (!O) throw 0; fs.mkdirSync(O, { recursive: true }); const tag = 'r' + round + (phone ? '-phone' : ''); fs.copyFileSync(`${out}/first.png`, `${O}/${tag}-first.png`); if (!phone) fs.copyFileSync(src, `${O}/${tag}.html`); } catch (e) {}
  console.log(`page height ${h}px. Read these:\n` + files.join('\n') + (phone ? '' : `\n(whole page: ${out}/whole.jpg, for the critic)`));
})();
