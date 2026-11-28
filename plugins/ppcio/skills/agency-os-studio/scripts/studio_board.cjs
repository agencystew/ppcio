#!/usr/bin/env node
/**
 * PPC.io Studio Visual Board, Screenshot Critic Harness & Runtime DOM Verifier.
 *
 * Powers the Agent-to-Agent 4-Version Studio loop (mirroring Landing Page Studio):
 *   1. shot <html-file> <out-dir>              -> desktop + phone PNGs, JS syntax check, overflow & error report
 *   2. verify-dom <html-file> [--facts|--state]-> headless Chromium runtime + data grounding + interactivity gate
 *   3. board <work-dir> [--title "..."]        -> side-by-side 4-version laptop+phone comparison board (board.html)
 *   4. pick <work-dir> <a|b|c|d>               -> promotes picked version to final/page.html for Critic rounds
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const LETTERS = ['a', 'b', 'c', 'd'];

function loadPlaywright() {
  const candidates = [
    process.env.LPK_HOME ? path.join(process.env.LPK_HOME, 'node_modules', 'playwright') : '',
    path.join(os.homedir(), '.landing-page-kit', 'node_modules', 'playwright'),
    'playwright',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      return require(c);
    } catch (_) {}
  }
  throw new Error('Playwright not found. Install playwright or run the Landing Page Studio setup once.');
}

function checkInlineScripts(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const errors = [];
  const rx = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  let idx = 0;
  while ((m = rx.exec(html)) !== null) {
    const js = (m[1] || '').trim();
    if (!js) continue;
    const tmp = path.join(os.tmpdir(), `ppcio-check-${process.pid}-${idx++}.js`);
    fs.writeFileSync(tmp, js, 'utf8');
    try {
      execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
    } catch (e) {
      errors.push(`Script #${idx} syntax error: ${(e.stderr || e.message).toString().trim().slice(0, 240)}`);
    } finally {
      try { fs.unlinkSync(tmp); } catch (_) {}
    }
  }
  return errors;
}

async function inspectPage(browser, htmlPath, opts = {}) {
  const abs = path.resolve(htmlPath);
  const syntaxErrors = checkInlineScripts(abs);
  const pageErrors = [];
  const consoleErrors = [];

  const ctxDesk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: opts.scale || 2 });
  const page = await ctxDesk.newPage();
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto('file://' + abs, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(500);

  const metricsDesk = await page.evaluate(() => {
    const text = (document.body.innerText || '').trim();
    return {
      text_len: text.length,
      text_sample: text.slice(0, 6000),
      overflow_px: Math.max(0, Math.round(document.documentElement.scrollWidth - window.innerWidth)),
      svg_count: document.querySelectorAll('svg').length,
      table_count: document.querySelectorAll('table').length,
      interactive_count: document.querySelectorAll('button, select, input, [role="tab"]').length,
    };
  });

  // Exercise interactive tabs and account switcher if requested
  let interactionChecks = { tabs_clicked: 0, select_switched: false };
  if (opts.exerciseInteractions) {
    const tabs = page.locator('button[role="tab"], .tbtn, .tab-btn');
    const tCount = Math.min(await tabs.count(), 4);
    for (let i = 0; i < tCount; i++) {
      await tabs.nth(i).click().catch(() => {});
      interactionChecks.tabs_clicked++;
    }
    const sel = page.locator('select').first();
    if (await sel.count()) {
      const optCount = await sel.locator('option').count();
      if (optCount > 1) {
        const before = await page.evaluate(() => (document.body.innerText || '').trim());
        const secondVal = await sel.locator('option').nth(1).getAttribute('value');
        if (secondVal !== null) {
          await sel.selectOption(secondVal).catch(() => {});
          await page.waitForTimeout(200);
          const after = await page.evaluate(() => (document.body.innerText || '').trim());
          interactionChecks.select_switched = after !== before;
          const firstVal = await sel.locator('option').nth(0).getAttribute('value');
          if (firstVal !== null) await sel.selectOption(firstVal).catch(() => {});
        }
      }
    }
  }

  if (opts.desktopShot) {
    await page.screenshot({ path: opts.desktopShot, fullPage: false, type: opts.desktopShot.endsWith('.jpg') ? 'jpeg' : 'png', quality: opts.desktopShot.endsWith('.jpg') ? 82 : undefined });
  }
  if (opts.desktopFullShot) {
    await page.screenshot({ path: opts.desktopFullShot, fullPage: true });
  }
  await ctxDesk.close();

  const ctxPhone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: opts.scale || 2 });
  const pPage = await ctxPhone.newPage();
  pPage.on('pageerror', e => pageErrors.push(`phone: ${String(e)}`));
  await pPage.goto('file://' + abs, { waitUntil: 'load', timeout: 30000 });
  await pPage.waitForTimeout(400);
  const phoneOverflow = await pPage.evaluate(() => Math.max(0, Math.round(document.documentElement.scrollWidth - window.innerWidth)));
  if (opts.phoneShot) {
    await pPage.screenshot({ path: opts.phoneShot, fullPage: Boolean(opts.fullPhone), type: opts.phoneShot.endsWith('.jpg') ? 'jpeg' : 'png', quality: opts.phoneShot.endsWith('.jpg') ? 82 : undefined });
  }
  await ctxPhone.close();

  return {
    file: abs,
    syntax_errors: syntaxErrors,
    page_errors: pageErrors,
    console_errors: consoleErrors,
    desktop_overflow_px: metricsDesk.overflow_px,
    phone_overflow_px: phoneOverflow,
    visible_text_len: metricsDesk.text_len,
    visible_text: metricsDesk.text_sample,
    svg_count: metricsDesk.svg_count,
    table_count: metricsDesk.table_count,
    interactive_count: metricsDesk.interactive_count,
    interactions: interactionChecks,
  };
}

function parseFlag(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : '';
}

(async () => {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || !['shot', 'verify-dom', 'board', 'pick'].includes(cmd)) {
    console.error('Usage: node studio_board.cjs <shot|verify-dom|board|pick> ...');
    process.exit(1);
  }

  if (cmd === 'pick') {
    const workDir = path.resolve(rest[0] || '');
    const letter = String(rest[1] || '').toLowerCase();
    const srcDir = path.join(workDir, 'versions', letter);
    const srcHtml = path.join(srcDir, 'page.html');
    if (!LETTERS.includes(letter) || !fs.existsSync(srcHtml)) {
      console.error(`Version ${letter.toUpperCase()} not found at ${srcHtml}`);
      process.exit(1);
    }
    const finalDir = path.join(workDir, 'final');
    fs.mkdirSync(finalDir, { recursive: true });
    if (fs.existsSync(path.join(finalDir, 'page.html'))) {
      fs.copyFileSync(path.join(finalDir, 'page.html'), path.join(workDir, 'versions', `page-before-${letter}.html`));
    }
    fs.copyFileSync(srcHtml, path.join(finalDir, 'page.html'));
    const notePath = path.join(srcDir, 'note.md');
    const note = fs.existsSync(notePath) ? fs.readFileSync(notePath, 'utf8').trim() : `Version ${letter.toUpperCase()}`;
    fs.writeFileSync(path.join(workDir, 'versions', 'picked.md'), `${letter}\n`, 'utf8');
    fs.writeFileSync(path.join(finalDir, 'plan.md'), `# Picked Version ${letter.toUpperCase()}\n\n${note}\n`, 'utf8');
    console.log(`PICKED ${letter.toUpperCase()}: promoted to ${path.join(finalDir, 'page.html')}`);
    process.exit(0);
  }

  const pw = loadPlaywright();
  const browser = await pw.chromium.launch();

  try {
    if (cmd === 'shot') {
      const htmlPath = path.resolve(rest[0] || '');
      const outDir = path.resolve(rest[1] || path.dirname(htmlPath));
      fs.mkdirSync(outDir, { recursive: true });
      const rep = await inspectPage(browser, htmlPath, {
        desktopShot: path.join(outDir, 'desktop.png'),
        desktopFullShot: path.join(outDir, 'desktop-full.png'),
        phoneShot: path.join(outDir, 'phone.png'),
        fullPhone: false,
      });
      const summary = { ...rep };
      delete summary.visible_text;
      fs.writeFileSync(path.join(outDir, 'shot-report.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
      console.log(`SHOT READY: ${path.join(outDir, 'desktop.png')} | ${path.join(outDir, 'phone.png')}`);
      console.log(`CHECKS: syntax_errors=${rep.syntax_errors.length} page_errors=${rep.page_errors.length} desktop_overflow=${rep.desktop_overflow_px}px phone_overflow=${rep.phone_overflow_px}px text_len=${rep.visible_text_len} svgs=${rep.svg_count}`);
      if (rep.syntax_errors.length || rep.page_errors.length) {
        console.error('JS ERRORS:', [...rep.syntax_errors, ...rep.page_errors].join(' | '));
        process.exit(1);
      }
    }

    if (cmd === 'verify-dom') {
      const htmlPath = path.resolve(rest[0] || '');
      const factsPath = parseFlag(rest, '--facts');
      const statePath = parseFlag(rest, '--state');
      const rep = await inspectPage(browser, htmlPath, { exerciseInteractions: true, scale: 1 });
      const failures = [];
      if (rep.syntax_errors.length) failures.push(`JS_SYNTAX: ${rep.syntax_errors.join('; ')}`);
      if (rep.page_errors.length) failures.push(`JS_RUNTIME: ${rep.page_errors.join('; ')}`);
      if (rep.visible_text_len < 250) failures.push(`BLANK_OR_UNHYDRATED: Rendered visible text is only ${rep.visible_text_len} chars.`);
      if (rep.desktop_overflow_px > 4) failures.push(`DESKTOP_OVERFLOW: ${rep.desktop_overflow_px}px horizontal overflow at 1440px.`);
      if (rep.phone_overflow_px > 4) failures.push(`MOBILE_OVERFLOW: ${rep.phone_overflow_px}px horizontal overflow at 390px.`);
      const bannedLeak = new RegExp('\\b(lorem ipsum|placeholder text)\\b|\\$xx,xxx|\\b' + 'sk' + '_(?:live|test)_[a-z0-9]+', 'i');
      const lm = rep.visible_text.match(bannedLeak);
      if (lm) failures.push(`PLACEHOLDER_OR_LEAK: Found banned token "${lm[0]}" in rendered DOM.`);

      if (factsPath && fs.existsSync(factsPath)) {
        const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
        if (facts.client_name && !rep.visible_text.toLowerCase().includes(facts.client_name.toLowerCase())) {
          failures.push(`DATA_DRIFT: Client name "${facts.client_name}" missing from rendered page.`);
        }
        const convStr = String(Math.round(facts.totals.current.conversions));
        if (!rep.visible_text.includes(convStr)) {
          failures.push(`DATA_DRIFT: Verified total conversions (${convStr}) not visible on rendered page.`);
        }
      }
      if (statePath && fs.existsSync(statePath)) {
        const st = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        const topAcct = (st.accounts || [])[0];
        if (topAcct && !rep.visible_text.toLowerCase().includes(topAcct.account.toLowerCase())) {
          failures.push(`DATA_DRIFT: Top priority account "${topAcct.account}" missing from rendered DOM.`);
        }
      }

      if (failures.length) {
        failures.forEach(f => console.error(`FAIL: ${f}`));
        process.exit(1);
      }
      console.log(`PASS verify-dom: 0 JS errors, 0 overflow, ${rep.visible_text_len} chars rendered, ${rep.svg_count} SVGs, tabs_clicked=${rep.interactions.tabs_clicked}, select_switched=${rep.interactions.select_switched}`);
    }

    if (cmd === 'board') {
      const workDir = path.resolve(rest[0] || '');
      const title = parseFlag(rest, '--title') || '4 Bespoke Studio Prototypes';
      const vDir = path.join(workDir, 'versions');
      if (!fs.existsSync(vDir)) {
        console.error(`No versions folder found at ${vDir}`);
        process.exit(1);
      }
      const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const readTxt = p => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
      const pickLines = readTxt(path.join(vDir, 'pick.md')).trim().split('\n');
      const pick = (pickLines[0] || '').trim().toLowerCase().replace(/[^a-d]/g, '').slice(0, 1);
      const why = (pickLines[1] || '').trim();

      const cards = [];
      const curShot = ['inputs/current-report.png', 'inputs/current-report.jpg', 'inputs/current-report.webp']
        .find(r => fs.existsSync(path.join(workDir, r)));
      if (curShot) {
        cards.push(
          `<figure class="v"><div class="shots"><a href="../${curShot}"><img src="../${curShot}" alt="Current report today"></a></div>` +
          `<figcaption><b>What you send today</b><span>The baseline report we are replacing.</span></figcaption></figure>`
        );
      }

      let doneCount = 0;
      for (const x of LETTERS) {
        const htmlPath = path.join(vDir, x, 'page.html');
        const notePath = path.join(vDir, x, 'note.md');
        if (!fs.existsSync(htmlPath)) {
          cards.push(`<figure class="v"><div class="shots"><div class="wait">Building Version ${x.toUpperCase()}</div></div><figcaption><b>${x.toUpperCase()}. In progress</b><span></span></figcaption></figure>`);
          continue;
        }
        doneCount++;
        const rep = await inspectPage(browser, htmlPath, {
          desktopShot: path.join(vDir, x, 'first.jpg'),
          phoneShot: path.join(vDir, x, 'first-phone.jpg'),
          scale: 2,
        });
        const lines = readTxt(notePath).split('\n').map(s => s.trim()).filter(Boolean);
        const name = (lines[0] || `Version ${x.toUpperCase()}`).replace(/^#+\s*/, '');
        const idea = lines[1] || '';
        const ok = rep.syntax_errors.length === 0 && rep.page_errors.length === 0 && rep.phone_overflow_px <= 4 && rep.visible_text_len >= 250;
        const badge = ok ? '<span class="ok">Verified 0 JS err</span>' : '<span class="bad">Needs fix</span>';
        const isPick = x === pick;
        cards.push(
          `<figure class="v${isPick ? ' pick' : ''}">` +
          `<div class="shots"><a href="${x}/page.html"><img src="${x}/first.jpg" alt="${esc(name)} desktop"></a>` +
          `<img class="ph" src="${x}/first-phone.jpg" alt="${esc(name)} phone"></div>` +
          `<figcaption><b>${x.toUpperCase()}. ${esc(name)}</b>${isPick ? '<span class="tag">My pick</span>' : ''}${badge}` +
          `<span>${esc(idea)}</span></figcaption></figure>`
        );
      }

      const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>:root{--bg:#f5f5f3;--fg:#14151a;--mute:#5b606e;--card:#fff;--line:#e3e4e8;--accent:#2563eb}
@media(prefers-color-scheme:dark){:root{--bg:#0f1117;--fg:#f2f4f8;--mute:#9aa2b2;--card:#171a23;--line:#262b38;--accent:#60a5fa}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:32px max(16px,4vw) 64px}
h1{font-size:clamp(26px,3.6vw,40px);line-height:1.12;margin:0 0 8px;letter-spacing:-.02em}p.lead{color:var(--mute);margin:0 0 28px;max-width:68ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,540px),1fr));gap:24px}
figure.v{margin:0;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;min-width:0}figure.pick{border:2px solid var(--accent)}
.shots{display:flex;gap:12px;align-items:flex-start}.shots a{flex:1;min-width:0}.shots img{width:100%;display:block;border-radius:8px;border:1px solid var(--line)}
.shots img.ph{width:22%;flex:none}.wait{flex:1;aspect-ratio:16/10;border-radius:8px;border:1px dashed var(--line);display:grid;place-items:center;color:var(--mute)}
figcaption{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:baseline}figcaption b{font-size:18px}figcaption span{color:var(--mute);flex-basis:100%;font-size:14px}
.tag,.ok,.bad{flex-basis:auto!important;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:600}
.tag{background:var(--accent);color:#fff!important}.ok{background:#e7f6ec;color:#166534!important}.bad{background:#fee2e2;color:#991b1b!important}</style></head>
<body><h1>${esc(title)}</h1><p class="lead">${doneCount} of 4 bespoke versions ready.${pick ? ` Recommended pick: ${pick.toUpperCase()}. ${esc(why)}` : ''} Click any preview to open the full interactive build.</p><div class="grid">${cards.join('')}</div></body></html>`;
      const boardOut = path.join(vDir, 'board.html');
      fs.writeFileSync(boardOut, html, 'utf8');
      console.log(`BOARD READY (${doneCount}/4): ${boardOut}`);
    }
  } finally {
    await browser.close();
  }
})();
