// node batch.cjs <landing-pages folder>
// The agency report: batch.html, one card per client, in the postclick app's look.
// Each card: the new page's first screen (the last round), the name with the audit
// score, the 3 biggest fixes, and links to the audit, the review and the page.
// A client that failed shows its reason (NOT-CAPTURED.txt or the line in batch.md).
const fs = require('fs'); const path = require('path');
const root = path.resolve(process.argv[2] || 'landing-pages');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const J = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
const batchMd = (() => { try { return fs.readFileSync(path.join(root, 'batch.md'), 'utf8'); } catch (e) { return ''; } })();
const dirs = fs.readdirSync(root).filter(d => fs.statSync(path.join(root, d)).isDirectory() && !d.startsWith('.')).sort();
const cards = dirs.map(d => {
  const w = path.join(root, d); const has = f => fs.existsSync(path.join(w, f));
  const leaks = J(path.join(w, 'audit/leaks.json')) || {};
  const facts = J(path.join(w, 'inputs/site-facts.json')) || {};
  const flat = x => x.toLowerCase().replace(/[^a-z0-9]/g, '');
  const name = (facts.title || '').split(/\s[|\-–—:·]\s/).map(x => x.trim()).find(x => flat(x).includes(flat(d)) || (flat(d).includes(flat(x)) && flat(x).length > 4)) || d;
  const rounds = fs.readdirSync(w).filter(x => /^r\d+$/.test(x) && has(`${x}/first.png`)).sort((a, b) => +b.slice(1) - +a.slice(1));
  const shot = rounds[0] ? `${d}/${rounds[0]}/first.png` : has('inputs/live-page-today.png') ? `${d}/inputs/live-page-today.png` : '';
  const fixes = ['killers', 'friction', 'copy'].flatMap(b => leaks[b] || []).map(f => f.title).filter(Boolean).slice(0, 3);
  const failed = has('NOT-CAPTURED.txt') ? fs.readFileSync(path.join(w, 'NOT-CAPTURED.txt'), 'utf8').split('\n')[0]
    : ((batchMd.split('\n').find(l => l.includes(d) && /failed/i.test(l)) || '').split('|').map(x => x.trim()).filter(Boolean).pop() || '');
  const status = failed ? 'Failed' : has('page.html') && rounds.length ? 'Page done' : has('audit.html') ? 'Audit done' : 'Not finished';
  const links = [['audit.html', 'Audit'], ['review.html', 'Review'], ['page.html', 'New page']].filter(([f]) => has(f)).map(([f, t]) => `<a href="${d}/${f}">${t}</a>`).join('');
  return `<article class="${failed ? 'bad' : ''}"><div class="shot">${shot ? `<img src="${shot}" alt="${esc(name)}" loading="lazy">` : ''}${rounds[0] ? '<span>New page</span>' : ''}</div>
<div class="body"><h2>${esc(name)}${typeof leaks.overall_score === 'number' ? `<b>${leaks.overall_score}</b>` : ''}</h2><p class="st">${status}</p>
${failed ? `<p class="why">${esc(failed.slice(0, 220))}</p>` : fixes.length ? `<ol>${fixes.map(f => `<li>${esc(f)}</li>`).join('')}</ol>` : ''}
${links ? `<nav>${links}</nav>` : ''}</div></article>`;
}).join('');
const done = dirs.filter(d => fs.existsSync(path.join(root, d, 'page.html'))).length;
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your clients' pages</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,600&display=swap"><style>
:root{--ink:#0C0C0E;--p:#8057FF;--p50:#F2EDFF;--g500:#64647B;--g100:#E5E5F9;--or7:#B4471C;--ort:#FCE7DD;--band:linear-gradient(180deg,#e5e5f9 0%,#f2f2fd 100%);color-scheme:light}
*{box-sizing:border-box}html{background:#f2f2fd}body{margin:0;min-height:100vh;background:var(--band) no-repeat;color:var(--ink);font:500 16px/1.5 Figtree,system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:56px max(16px,4vw) 72px}
.w{max-width:1240px;margin:0 auto}h1{font:600 clamp(34px,4.4vw,56px)/1.05 Fraunces,Georgia,serif;margin:0 0 12px}.sub{color:var(--g500);font-size:19px;margin:0 0 36px}.sub b{color:var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr));gap:28px}
article{background:#fff;border:1px solid var(--g100);border-radius:22px;overflow:hidden;box-shadow:rgba(18,13,31,.45) 0 18px 40px -16px;display:flex;flex-direction:column}
.shot{position:relative;height:260px;overflow:hidden;background:#F3F3FF}.shot img{width:100%;display:block}.shot span{position:absolute;left:14px;top:14px;background:var(--p);color:#fff;font-weight:700;font-size:14px;padding:4px 12px;border-radius:99px}
.body{padding:20px 22px 22px;display:flex;flex-direction:column;gap:10px;flex:1}h2{font-size:21px;font-weight:800;margin:0;display:flex;justify-content:space-between;gap:12px;align-items:baseline}
h2 b{font-size:15px;font-weight:800;color:var(--p);background:var(--p50);border-radius:99px;padding:2px 12px;white-space:nowrap}h2 b::after{content:" / 100";font-weight:600;color:var(--g500)}
.st{margin:0;color:var(--g500);font-weight:600}ol{margin:0;padding-left:20px}ol li{margin:0 0 4px}
.bad .st{color:var(--or7)}.why{margin:0;background:var(--ort);border-radius:12px;padding:10px 14px;color:var(--or7)}
nav{display:flex;gap:10px;flex-wrap:wrap;margin-top:auto;padding-top:6px}nav a{text-decoration:none;font-weight:700;border:1.5px solid var(--g100);border-radius:12px;padding:8px 14px}nav a:last-child{background:var(--p);border-color:var(--p);color:#fff}
</style><div class="w"><h1>Your clients' pages</h1><p class="sub"><b>${done} of ${dirs.length}</b> clients have a new page. Each card links to its audit, its review and the page.</p><div class="grid">${cards}</div></div></html>`;
fs.writeFileSync(path.join(root, 'batch.html'), html);
console.log(`Wrote ${path.join(root, 'batch.html')}: ${dirs.length} clients, ${done} with a new page.`);
