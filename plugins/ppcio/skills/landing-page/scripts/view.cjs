#!/usr/bin/env node
// node view.cjs <project folder> [--port N]
// The PPC.io studio on this computer: serves the real postclick screens (the
// plugin's studio/ folder) and each site's work files as their data. Nothing
// leaves the computer. One server for every site in <project>/landing-pages:
//   /                 the site with the newest work
//   /s/<site>/        that site's studio
//   /s/<site>/data/site.json   the screens' data, rebuilt on every read
//   /s/<site>/data/files/...   the site's pictures and pages
const http = require('http'), fs = require('fs'), path = require('path');

const root = path.resolve(process.argv[2] || '.');
const pages = path.join(root, 'landing-pages');
const portArg = process.argv.indexOf('--port');
const PORT = portArg > 0 ? +process.argv[portArg + 1] : 4870;
const STUDIO = path.resolve(__dirname, '..', '..', '..', 'studio');
const FULL_LIB = path.join(process.env.PPCIO_HOME || path.join(require('os').homedir(), '.ppcio'), 'library');
const FREE_LIB = path.resolve(__dirname, '..', 'library');
const activeLib = () => (fs.existsSync(path.join(FULL_LIB, 'index.json')) ? FULL_LIB : FREE_LIB);

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.gif': 'image/gif', '.ico': 'image/x-icon' };
const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };
const json = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const mtime = (f) => { try { return fs.statSync(f).mtimeMs; } catch { return 0; } };

function sites() {
  let names = [];
  try { names = fs.readdirSync(pages).filter((n) => fs.existsSync(path.join(pages, n, 'context.md')) || fs.existsSync(path.join(pages, n, 'inputs'))); } catch {}
  return names.map((n) => ({ n, t: newest(path.join(pages, n)) })).sort((a, b) => b.t - a.t).map((s) => s.n);
}
function newest(dir) {
  let t = mtime(dir);
  for (const sub of ['', 'audit', 'inputs', 'r1']) {
    try { for (const f of fs.readdirSync(path.join(dir, sub))) t = Math.max(t, mtime(path.join(dir, sub, f))); } catch {}
  }
  return t;
}

/** context.md's sections, by heading. */
function sections(md) {
  const out = {}; let key = null;
  for (const line of (md || '').split('\n')) {
    const h = line.match(/^##\s+(.+)/);
    if (h) { key = h[1].trim().toLowerCase(); out[key] = ''; continue; }
    if (key) out[key] += line + '\n';
  }
  for (const k in out) out[k] = out[k].trim();
  return out;
}
const KPI = [[/call|phone/i, 'calls'], [/book/i, 'bookings'], [/sale|buy|order|checkout/i, 'sales'], [/form|quote|lead|enquir/i, 'leads']];

function offerLine(dir) {
  const o = json(path.join(dir, 'audit', 'offer.json'));
  const t = (o && o.current_offer) || '';
  return (t.match(/^[^.]*\./) || [t])[0].trim().slice(0, 200);
}

function auditContext(dir, comp) {
  const s = sections(read(path.join(dir, 'context.md')));
  const sell = s['what they sell'] || '';
  const category = (sell.split(/[:.\n]/)[0] || '').replace(/\s+for\s+.*$/i, '').trim().slice(0, 60);
  const where = (s['where they work'] || '').split(/[\n.]/)[0];
  const win = s['what a win is'] || '';
  const from = s['where visitors come from'] || '';
  return {
    category: category || null,
    confidence: 'high',
    competitors: ((comp && comp.competitors) || []).map((c) => ({ name: c.name, url: c.url })),
    positioning: (sell.match(/^[^.]*\./) || [sell])[0].replace(/:\s.*$/, '.').trim(),
    primary_kpi: (KPI.find(([re]) => re.test(win)) || [null, 'leads'])[1],
    target_geos: where ? [where.split(',')[0].trim()] : [],
    offer_baseline: offerLine(dir),
    traffic_source: /google ads|search ads|ppc/i.test(from) ? 'google_ads' : /meta|facebook|instagram/i.test(from) ? 'meta' : from ? 'organic' : null,
  };
}

// The app's stage names for each kit file. The run stage reads these rows as
// it reads the audit worker's task events.
const STAGES = [
  ['buyers', ['audit/buyers.json']],
  ['leaks', ['audit/leaks.json']],
  ['competitive-context', ['audit/competitive.json']],
  ['conversion-actions', ['audit/actions.json']],
  ['copy-deck', ['audit/copy.json']],
  ['awareness-match', ['audit/ad-match.json']],
  ['offer-audit', ['audit/offer.json']],
  ['forensics', ['audit/forensics.json']],
  ['trust-gaps', ['audit/trust.json']],
  ['page-anatomy', ['audit/anatomy.json']],
  ['psych-levers', ['audit/psych.json']],
  ['design-critic', ['audit/design.json']],
  ['buyer-simulations', ['audit/journey-1.json']],
];

// The finished line the audit worker writes for a stage, with its count, so
// the wait screen can say "3 buyers" or "9 problems".
function count(dir, stage) {
  const A = (f) => json(path.join(dir, 'audit', f));
  const len = (v) => (Array.isArray(v) ? v.length : 0);
  if (stage === 'buyers') { const b = A('buyers.json'); const n = len(b && (b.personas || b)); return n ? `buyers done (${n} extracted)` : null; }
  if (stage === 'leaks') { const l = A('leaks.json'); const n = l ? len(l.killers) + len(l.copy) + len(l.friction) + len(l.findings) : 0; return n ? `leaks hunter done (${n} findings)` : null; }
  if (stage === 'buyer-simulations') { let n = 0; for (let i = 1; i <= 6; i++) if (A(`journey-${i}.json`)) n++; return n ? `simulations done (${n}/${n} personas)` : null; }
  return null;
}

function events(dir, desk, facts, done) {
  const iso = (ms) => new Date(ms).toISOString();
  const at = (f) => mtime(path.join(dir, f));
  let shot = 0;
  try { shot = Math.min(...fs.readdirSync(path.join(dir, 'inputs')).map((f) => at(path.join('inputs', f))).filter(Boolean)); } catch {}
  const ctx = at('context.md');
  const t0 = Math.min(...[shot, ctx].filter((v) => v > 0 && isFinite(v)), Date.now());
  const row = (stage, status, start, end, metadata = null) => ({
    stage, agent: stage.includes(':') || stage === 'kickoff' ? null : stage, status, started_at: iso(start), ended_at: end ? iso(end) : null,
    duration_ms: end ? Math.max(0, Math.round(end - start)) : null, user_visible: true, micro_event: null, metadata,
  });
  const out = [{ ...row('kickoff', 'done', t0, t0, { tier: 'full', source: 'kit' }), user_visible: false }];
  const shotEnd = shot || null;
  out.push(row('scrape', shotEnd ? 'done' : 'running', t0, shotEnd));
  if (shotEnd && desk) out.push(row('scrape:photo', 'done', shotEnd, shotEnd, { mobile: true, shot_url: `./data/files/${desk}` }));
  const h1 = ((facts.headings || []).find((h) => h.tag === 'h1') || {}).text || facts.title;
  if (shotEnd && h1) out.push(row('scrape:read', 'done', shotEnd, shotEnd, { words: facts.words || null, headline: h1 }));
  if (!ctx && !shotEnd) return out;
  const ctxStart = shotEnd || t0;
  out.push(ctx ? { ...row('context', 'done', ctx, ctx), duration_ms: Math.max(0, Math.round(ctx - ctxStart)) } : row('context', 'running', ctxStart, null));
  if (!ctx) return out;
  for (const [stage, files] of STAGES) {
    const end = Math.max(0, ...files.map(at));
    if (end) {
      // The screen prints each row at its start time. A kit agent's file lands when it finishes,
      // so the row is placed at that moment and keeps its real length.
      out.push({ ...row(stage, 'done', end, end), duration_ms: Math.max(0, Math.round(end - ctx)) });
      const n = count(dir, stage);
      if (n != null) out.push({ ...row(`${stage}_done`, 'done', end, end), user_visible: false, agent: null, micro_event: n });
    }
    else if (!done) out.push(row(stage, 'running', ctx, null));
  }
  return out;
}

// The designs the kit drew (directions/a.html, b, c), as the design screen's looks.
function looksOf(dir) {
  const D = path.join(dir, 'directions'), out = [];
  const choice = read(path.join(D, 'choice.md')) || '';
  const how = choice.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && !/^style \d|^direction/i.test(l))[0] || null;
  for (const k of ['a', 'b', 'c']) {
    const html = read(path.join(D, `${k}.html`));
    if (!html) continue;
    const pic = ['whole.jpg', 'first.png'].map((f) => `directions/r${k}/${f}`).find((f) => fs.existsSync(path.join(dir, f)));
    if (!pic) continue;
    const title = ((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '').trim();
    // The picked look is named after the library page it follows: "Style 2, vice-restoration.com".
    const ref = k === 'a' ? (choice.match(/style \d+,\s*([a-z0-9.-]+\.[a-z]{2,})/i) || [])[1] : null;
    const name = ref ? `In the style of ${ref.replace(/^www\./, '')}` : title && title.length <= 40 ? title : `Look ${k.toUpperCase()}`;
    out.push({ id: k, name: name.slice(0, 48), img: `./data/files/${pic}`, why: k === 'a' ? how : null });
  }
  return out;
}

function siteJson(name) {
  const dir = path.join(pages, name), A = (f) => json(path.join(dir, 'audit', f));
  const comp = A('competitive.json');
  const journeys = [];
  for (let i = 1; i <= 6; i++) { const j = A(`journey-${i}.json`); if (j) journeys.push(j); }
  const facts = json(path.join(dir, 'inputs', 'site-facts.json')) || {};
  const nodes = json(path.join(dir, 'inputs', 'text-nodes.json')) || {};
  const file = (...c) => c.find((f) => fs.existsSync(path.join(dir, f)));
  const desk = file('inputs/live-full-desk.png', 'inputs/live-full.jpg', 'inputs/live-page-today.png');
  const phone = file('inputs/live-full-phone.png', 'inputs/live-full-phone.jpg', 'inputs/live-phone-today.png');
  const url = facts.url || facts.final_url || (read(path.join(dir, 'context.md')) || '').match(/https?:\/\/\S+/)?.[0] || `https://${name}`;
  let auditFiles = [];
  try { auditFiles = fs.readdirSync(path.join(dir, 'audit')).map((f) => mtime(path.join(dir, 'audit', f))); } catch {}
  const startedAt = new Date(mtime(path.join(dir, 'context.md')) || Date.now()).toISOString();
  const updatedAt = new Date(Math.max(0, ...auditFiles) || Date.now()).toISOString();
  const pageFile = path.join(dir, 'page.html');
  const pageHtml = read(pageFile);
  const host = (() => { try { return new URL(url).host.replace(/^www\./, ''); } catch { return name; } })();
  const done = fs.existsSync(path.join(dir, 'audit.md')) || fs.existsSync(path.join(dir, 'audit.html'));
  return {
    url, name, startedAt, updatedAt, done,
    events: events(dir, desk, facts, done),
    looks: looksOf(dir),
    parts: {
      audit_context: auditContext(dir, comp),
      findings: A('leaks.json'),
      audit_personas: A('buyers.json'),
      persona_journeys: journeys.length ? journeys : null,
      copy_rewrites: A('copy.json'),
      offer_audit: A('offer.json'),
      awareness_match: A('ad-match.json'),
      competitive_context: comp,
      forensics: A('forensics.json'),
      conversion_actions: A('actions.json'),
      trust_audit: A('trust.json'),
      page_anatomy: A('anatomy.json'),
      psych_audit: A('psych.json'),
      design_critique: A('design.json'),
    },
    scrape: {
      screenshot: desk ? `./data/files/${desk}` : null,
      mobileScreenshot: phone ? `./data/files/${phone}` : null,
      textNodes: nodes.desk || undefined,
      mobileTextNodes: nodes.phone || undefined,
      title: facts.title || null,
    },
    // The new page in the screens' frame: its pictures load from the work folder,
    // while in-page #anchor links still scroll inside the srcdoc frame instead of navigating away.
    page: pageHtml ? { html: pageHtml.replace(/<head([^>]*)>/i, `<head$1><base href="./data/files/"><script>document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;var id=a.getAttribute('href').slice(1);if(!id)return;var el=document.getElementById(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}});</script>`), at: new Date(mtime(pageFile)).toISOString() } : null,
    asks: {
      build: `Build me a better page for ${host}`,
      designs: `Show me 3 new looks for ${host}`,
      fix: `Change my new page for ${host}`,
    },
  };
}

function send(res, code, body, type) {
  res.writeHead(code, { 'content-type': type || 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
  res.end(body);
}
function sendFile(res, f) {
  fs.readFile(f, (e, b) => (e ? send(res, 404, 'Not found') : send(res, 200, b, TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream')));
}

// Requests from the screens (a press on Build, Change, Put it live). They wait in
// <project>/landing-pages/.asks.jsonl until Claude reads them with `kit.sh wait`.
const ASKS = path.join(pages, '.asks.jsonl');
const waiters = new Set();
function asksAfter(n) {
  const lines = (read(ASKS) || '').split('\n').filter(Boolean);
  return { list: lines.slice(n).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean), total: lines.length };
}
function addAsk(site, body) {
  const kinds = ['build', 'designs', 'change', 'live', 'wrong', 'fixed'];
  if (!kinds.includes(body.kind)) return false;
  const row = { site, kind: body.kind, text: String(body.text || '').slice(0, 2000), part: body.part ? String(body.part).slice(0, 200) : null, at: new Date().toISOString() };
  fs.mkdirSync(pages, { recursive: true });
  fs.appendFileSync(ASKS, JSON.stringify(row) + '\n');
  for (const w of waiters) w();
  return true;
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const p = decodeURIComponent(u.pathname);
  // Claude's side: hold the request open until a press arrives after ?after=N.
  // kit.sh asks which folder this studio serves, so a second project never reuses it.
  if (p === '/root') { res.writeHead(200, { 'content-type': 'text/plain', 'cache-control': 'no-store' }); return res.end(root); }
  if (p === '/wait') {
    const after = +u.searchParams.get('after') || 0;
    const now = asksAfter(after);
    if (now.list.length) return send(res, 200, JSON.stringify(now), TYPES['.json']);
    let done = false;
    const finish = () => { if (done) return; done = true; waiters.delete(finish); clearTimeout(t); send(res, 200, JSON.stringify(asksAfter(after)), TYPES['.json']); };
    const t = setTimeout(finish, 25 * 60 * 1000);
    waiters.add(finish);
    req.on('close', () => { done = true; waiters.delete(finish); clearTimeout(t); });
    return;
  }
  if (p === '/' || p === '/index.html') {
    const s = sites();
    if (!s.length) return send(res, 200, '<p style="font:18px system-ui;padding:40px">No audits yet. Ask Claude in your chat: “audit my page”.</p>', TYPES['.html']);
    res.writeHead(302, { location: `/s/${encodeURIComponent(s[0])}/` }); return res.end();
  }
  // The screens' mascots, avatars and font, at the paths the app uses.
  if (/^\/(look-v26|fonts)\//.test(p)) {
    const f = path.resolve(STUDIO, '.' + p);
    if (!f.startsWith(STUDIO + path.sep)) return send(res, 403, 'No');
    return sendFile(res, f);
  }
  // Style library images served over HTTP so styles.html renders cleanly inside Studio
  // (browsers block file:// images on http://localhost pages).
  if (p.startsWith('/lib/')) {
    const rel = p.slice('/lib/'.length);
    for (const base of [activeLib(), FREE_LIB]) {
      const f = path.resolve(base, rel);
      if (f.startsWith(base + path.sep) && fs.existsSync(f) && fs.statSync(f).isFile()) return sendFile(res, f);
    }
    return send(res, 404, 'Not found');
  }
  const m = p.match(/^\/s\/([^/]+)\/(.*)$/);
  if (!m) return send(res, 404, 'Not found');
  const [, name, rest] = m;
  const dir = path.join(pages, name);
  if (!dir.startsWith(pages + path.sep) || !fs.existsSync(dir)) return send(res, 404, 'No such site');
  if (rest === 'data/site.json') return send(res, 200, JSON.stringify(siteJson(name)), TYPES['.json']);
  if (rest === 'ask' && req.method === 'POST') {
    const hostHdr = String(req.headers.host || '').toLowerCase();
    const okHost = hostHdr === `localhost:${PORT}` || hostHdr === `127.0.0.1:${PORT}`;
    const origin = String(req.headers.origin || '').toLowerCase();
    const okOrigin = !origin || origin === `http://localhost:${PORT}` || origin === `http://127.0.0.1:${PORT}`;
    const ct = String(req.headers['content-type'] || '').toLowerCase();
    if (!okHost || !okOrigin || !ct.startsWith('application/json')) return send(res, 403, 'Forbidden');
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 10000) req.destroy(); });
    req.on('end', () => { let j = {}; try { j = JSON.parse(body); } catch {} send(res, addAsk(name, j) ? 200 : 400, 'ok'); });
    return;
  }
  if (rest.startsWith('data/files/')) {
    const f = path.resolve(dir, rest.slice('data/files/'.length));
    if (!f.startsWith(dir + path.sep)) return send(res, 403, 'No');
    if (f.toLowerCase().endsWith('.html') && fs.existsSync(f)) {
      let html = fs.readFileSync(f, 'utf8');
      for (const base of [activeLib(), FREE_LIB]) {
        const prefix = 'file://' + base.split(path.sep).map(encodeURIComponent).join('/').replace(/^file:\/\/%2F?/, 'file:///') + '/';
        if (html.includes(prefix)) html = html.split(prefix).join('/lib/');
      }
      return send(res, 200, html, TYPES['.html']);
    }
    return sendFile(res, f);
  }
  const f = path.resolve(STUDIO, rest || 'index.html');
  if (!f.startsWith(STUDIO + path.sep) && f !== STUDIO) return send(res, 403, 'No');
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return sendFile(res, f);
  return sendFile(res, path.join(STUDIO, 'index.html'));
});
server.on('error', (e) => { console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} is busy.` : e.message); process.exit(1); });
server.listen(PORT, '127.0.0.1', () => console.log(`PPC.io studio: http://localhost:${PORT}/`));
