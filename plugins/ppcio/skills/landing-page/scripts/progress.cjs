// node progress.cjs <work folder> [--watch]
// The audit wait screen: audit-progress.html in the work folder, in the postclick
// app's dark stage look. It shows their page, the 10 specialists and the first
// finding of each one as it lands. With --watch it redraws every 3 seconds, and the
// page moves to audit.html by itself when the audit is drawn. Stops after 40 minutes.
const fs = require('fs'); const path = require('path');
const work = path.resolve(process.argv[2] || '.'); const watch = process.argv.includes('--watch');
const out = path.join(work, 'audit-progress.html'); const startF = path.join(work, 'audit', '.started');
fs.mkdirSync(path.join(work, 'audit'), { recursive: true });
if (!fs.existsSync(startF)) fs.writeFileSync(startF, String(Date.now()));
const start = Number(fs.readFileSync(startF, 'utf8')) || Date.now();
const TEAM = [
  ['buyers', 'Buyer profiler', 'Who is most likely to land here, and what they need to see'],
  ['competitive', 'Competitor scout', 'What the businesses bidding on your searches do better'],
  ['journey-1', 'Buyer one walks the page', 'Where the first buyer acts or leaves'],
  ['journey-2', 'Buyer two walks the page', 'Where the second buyer acts or leaves'],
  ['leaks', 'Leak hunter', 'What stops a good-fit visitor acting'],
  ['actions', 'Action checker', 'Your call, form or booking on laptop and phone'],
  ['offer', 'Offer judge', 'What the buyer gets, on what terms, and the risk'],
  ['trust', 'Trust checker', 'Reviews, licences, names and proof a stranger believes'],
  ['anatomy', 'Page architect', 'Section order and whether the argument builds toward action'],
  ['psych', 'Decision levers', 'Risk reversal, proof timing, urgency and ease of saying yes'],
  ['design', 'Visual critic', 'First screen hierarchy, phone fit and brand quality'],
  ['forensics', 'Speed and tracking', 'Reading level, load time and the tags Google Ads needs'],
  ['ad-match', 'Ad match', 'Does the page answer the search that paid for the click'],
  ['copy', 'Copywriter', 'Your key lines, rewritten in your own voice'],
];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const firstLine = (d, k) => {
  if (!d) return '';
  if (k === 'competitive') { const f = (d.field_strengths_vs_you || [])[0]; if (f && f.point) return f.point; }
  if (/^journey/.test(k) && Array.isArray(d.moments) && d.moments[0]) { const m = d.moments[0]; return `${d.persona_name ? d.persona_name.split(',')[0] + ': ' : ''}"${m.thought}"`; }
  const pick = d.one_line_verdict || d.verdict || d.summary || d.headline;
  if (typeof pick === 'string') return pick;
  if (Array.isArray(d.personas) && d.personas[0]) return [d.personas[0].name, d.personas[0].role || d.personas[0].who].filter(Boolean).join(', ');
  let t = ''; const walk = v => { if (t) return; if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if (typeof v.title === 'string') t = v.title; else Object.values(v).forEach(walk); } };
  walk(d); if (t) return t;
  // Last resort: the first plain sentence in the file, outside the self-check.
  const ss = []; const w2 = (v, key) => { if (key === 'quality_self_check' || ss.length) return; if (typeof v === 'string' && v.length > 40 && /\s/.test(v)) ss.push(v); else if (Array.isArray(v)) v.forEach(x => w2(x)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k2, x]) => w2(x, k2)); };
  w2(d); return ss[0] || '';
};
function draw() {
  const has = f => fs.existsSync(path.join(work, f));
  const read = f => { try { return JSON.parse(fs.readFileSync(path.join(work, f), 'utf8')); } catch (e) { return null; } };
  const facts = read('inputs/site-facts.json') || {};
  // The business name, the same way report.cjs finds it.
  const site = path.basename(work); const flat = x => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const name = (facts.title || '').split(/\s[|\-–—:·]\s/).map(x => x.trim()).find(x => flat(x).includes(flat(site)) || flat(site).includes(flat(x)) && flat(x).length > 4)
    || site.charAt(0).toUpperCase() + site.slice(1);
  const adm = has('ads.md') || has('audit/ad-match.json');
  const team = TEAM.filter(t => t[0] !== 'ad-match' || adm).filter(t => t[0] !== 'competitive' || has('competitors') || has('audit/competitive.json'));
  const rows = team.map(([k, who, job]) => { const d = read(`audit/${k}.json`); const done = !!d && !d.error;
    return `<li class="${done ? 'done' : ''}"><i></i><div><b>${esc(who)}</b><span>${esc(done ? (firstLine(d, k) || 'Done') : job)}</span></div></li>`; }).join('');
  const n = team.filter(([k]) => { const d = read(`audit/${k}.json`); return d && !d.error; }).length;
  const finished = has('audit.html');
  const shot = has('inputs/live-phone-today.png') ? 'inputs/live-phone-today.png' : has('inputs/live-page-today.png') ? 'inputs/live-page-today.png' : '';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${finished ? '<meta http-equiv="refresh" content="1;url=audit.html">' : watch ? '<meta http-equiv="refresh" content="3">' : ''}
<title>${esc(name)}: audit in progress</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,600&display=swap">
<style>
:root{--night:#120D1F;--p:#8057FF;--lav:#B39AFF;--mint:#2EE59D;--g300:#A2A2C1;--g200:#C5C5E2;--stage:radial-gradient(70% 50% at 50% 0%,rgba(98,62,214,.5),transparent 70%),radial-gradient(40% 50% at 100% 90%,rgba(255,143,107,.18),transparent 70%),radial-gradient(35% 45% at 0% 0%,rgba(155,123,255,.22),transparent 70%),#120D1F;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:var(--stage);color:#fff;font:500 16px/1.5 Figtree,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.w{max-width:1180px;margin:0 auto;padding:56px max(20px,4vw);display:grid;grid-template-columns:minmax(0,340px) minmax(0,1fr);gap:56px;align-items:start}
.ph{border-radius:28px;overflow:hidden;box-shadow:rgba(0,0,0,.7) 0 18px 36px -12px;border:1px solid rgba(255,255,255,.12);max-height:680px;position:relative}
.ph img{width:100%;display:block}.ph:after{content:"";position:absolute;left:0;right:0;height:90px;top:-90px;background:linear-gradient(180deg,transparent,rgba(179,154,255,.35),transparent);animation:scan 3.2s ease-in-out infinite}
@keyframes scan{to{top:100%}}
h1{font:600 clamp(34px,4.2vw,54px)/1.05 Fraunces,Georgia,serif;margin:0 0 10px;letter-spacing:-.01em;text-wrap:balance}
.sub{color:var(--g200);font-size:19px;margin:0 0 30px}.sub b{color:#fff}
.bar{height:8px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin:0 0 28px}.bar i{display:block;height:100%;width:${Math.round(100 * n / team.length)}%;background:linear-gradient(90deg,var(--p),var(--lav));border-radius:99px;transition:width .6s}
ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:14px;padding:14px 18px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
li i{width:14px;height:14px;margin-top:5px;border-radius:50%;border:2px solid var(--lav);animation:pulse 1.4s ease-in-out infinite}
li.done{background:rgba(46,229,157,.07);border-color:rgba(46,229,157,.25)}li.done i{background:var(--mint);border-color:var(--mint);animation:none}
li b{display:block;font-weight:700;font-size:17px}li span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:var(--g300);font-size:16px}li.done span{color:#fff}
@keyframes pulse{50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.ph:after,li i{animation:none}}
@media (max-width:820px){.w{grid-template-columns:minmax(0,1fr);gap:28px;padding-top:32px}.ph{max-height:360px;max-width:300px}}
</style></head><body><div class="w">
${shot ? `<div class="ph"><img src="${shot}" alt="Your page today"></div>` : '<div></div>'}
<div><h1>${finished ? 'Your audit is ready' : `Reading ${esc(name)}`}</h1>
<p class="sub">${finished ? 'Opening it now.' : `<b>${n} of ${team.length}</b> specialists done · <span id="t"></span> so far · about 10 to 15 minutes in all`}</p>
<div class="bar"><i></i></div><ul>${rows}</ul></div></div>
<script>(function(){var s=${start},e=document.getElementById('t');function f(){if(!e)return;var m=Math.floor((Date.now()-s)/60000),x=Math.floor((Date.now()-s)/1000)%60;e.textContent=m+' min '+(x<10?'0':'')+x+' s'}f();setInterval(f,1000)})()</script>
</body></html>`;
  fs.writeFileSync(out, html); return finished;
}
if (!watch) { draw(); console.log(`Wrote ${out}`); }
else { console.log(`Watching. ${out} redraws every 3 seconds until audit.html exists.`); const t0 = Date.now();
  const tick = () => { const f = draw(); if (f || Date.now() - t0 > 40 * 60000) process.exit(0); setTimeout(tick, 3000); }; tick(); }
