// node library.cjs <command>: search the style library that ships with the kit.
//   niches                      every niche, with how many pages it has
//   niche <slug>                the best pages of one niche, best first
//   find <words...>             the pages that best match the words (a trade, a product, a look)
//   sections <words...>         the best single sections (a hero, reviews, a form, pricing) that match
//   board <out.html> <niche> [words...]  a board of 9 styles to pick from: their niche first, then the nearest pages
// Prints absolute image paths. Open the images to look at them.
const fs = require('fs'); const path = require('path');
// The full library downloads with the licence into ~/.ppcio/library. Without it, the free library in the plugin.
const FULL = path.join(process.env.PPCIO_HOME || path.join(require('os').homedir(), '.ppcio'), 'library');
const LIB = fs.existsSync(path.join(FULL, 'index.json')) ? FULL : path.join(__dirname, '..', 'library');
const load = f => JSON.parse(fs.readFileSync(path.join(LIB, f), 'utf8'));
const abs = f => path.join(LIB, f);
const [cmd, ...args] = process.argv.slice(2);
const words = args.join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
const score = (text, ws) => ws.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0);

function page(p) {
  console.log(`\n## ${p.domain} (${p.niche_name}), rank ${p.rank}`);
  console.log(`URL: ${p.url}`);
  if (p.title) console.log(`What it does: ${p.title}`);
  if (p.works.length) console.log('Works: ' + p.works.join(' | '));
  if (p.fixes.length) console.log('Weak: ' + p.fixes.join(' | '));
  console.log('Images: ' + p.images.map(abs).join('  '));
}

if (cmd === 'niches') {
  for (const n of load('niches.json')) console.log(`${n.niche}: ${n.name} (${n.pages})`);
} else if (cmd === 'niche') {
  const ps = load('index.json').filter(p => p.niche === args[0]);
  if (!ps.length) console.log(`No niche called "${args[0]}". Run "niches" for the list.`);
  ps.forEach(page);
} else if (cmd === 'find') {
  const ps = load('index.json').map(p => ({ p, s: 3 * score((p.niche + ' ' + p.niche_name).toLowerCase(), words) + score((p.title + ' ' + p.lessons + ' ' + p.works.join(' ')).toLowerCase(), words) }))
    .filter(x => x.s > 0).sort((a, b) => b.s - a.s || a.p.rank - b.p.rank).slice(0, 8);
  if (!ps.length) console.log('No match. Try other words, or run "niches".');
  ps.forEach(x => page(x.p));
} else if (cmd === 'sections') {
  const ss = load('atlas.json').map(s => ({ s, n: 3 * score(String(s.kind).toLowerCase(), words) + score([s.niche_name, s.move, s.why, s.heading].join(' ').toLowerCase(), words) }))
    .filter(x => x.n > 0).sort((a, b) => b.n - a.n || (b.s.score || 0) - (a.s.score || 0)).slice(0, 8);
  if (!ss.length) console.log('No match. Try: hero, reviews, form, pricing, how it works, faq, offer.');
  for (const { s } of ss) console.log(`\n## ${s.kind} from ${s.domain} (${s.niche_name})\nMove: ${s.move}\nWhy: ${s.why}\nNeeds: ${s.needs}\nImage: ${abs(s.image)}`);
} else if (cmd === 'board') {
  // The app's style pick (the owner picks a look from our library, and the build makes their page in it).
  const [out, niche, ...rest] = args;
  // Words that match every trade ("installation", "service", a city) made "nearest" mean nothing:
  // an AV integrator got 3 US electricians and a toy software page (26 Nov). Drop them.
  const GENERIC = new Set('and the for with our your services service company companies installation install installer installers business local best near sydney london austin texas new york professional quality expert experts'.split(' '));
  const ws = rest.join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !GENERIC.has(w));
  const all = load('index.json'); const seen = new Set(); const pick = [];
  const FAM = load('families.json');
  const add = p => { if (p && !seen.has(p.domain) && pick.length < 9) { seen.add(p.domain); pick.push(p); } };
  const wscore = p => 3 * score((p.niche + ' ' + p.niche_name).toLowerCase(), ws) + score((p.title + ' ' + p.lessons + ' ' + p.works.join(' ')).toLowerCase(), ws);
  if (!FAM[niche]) console.log(`No niche called "${niche}". Showing the nearest styles by your words. Run "niches" for the list.`);
  // 1. Their niche. 2. Their family of trades (home services, health, legal and money, B2B services,
  // software, consumer), best match first and one page per niche before any second one.
  all.filter(p => p.niche === niche).sort((a, b) => a.rank - b.rank).forEach(add);
  const own = new Set(all.filter(p => p.niche === niche).map(p => p.domain)).size;
  if (FAM[niche] && own < 3) console.log(`Their own trade has ${own} ${own === 1 ? 'business' : 'businesses'} in the library so far. The rest of the board is the nearest trades: say so to the owner in one line.`);
  const fam = FAM[niche] || (() => { const t = {}; for (const p of all) t[FAM[p.niche]] = (t[FAM[p.niche]] || 0) + wscore(p); return Object.entries(t).sort((a, b) => b[1] - a[1])[0]?.[0]; })();
  // Nearest trades first (buyer test, 26 Nov): a plumber's board showed one plumbing site, then a pool builder
  // and a cleaner before HVAC. Call-out trades sell the same way: an urgent problem, a phone call, a van today.
  const CALLOUT = new Set('plumbing hvac electrician water-damage septic-service appliance-repair locksmith garage-door roofing pest-control towing-service foundation-repair handyman'.split(' '));
  const near = p => CALLOUT.has(niche) && CALLOUT.has(p.niche) ? 1 : 0;
  const kin = all.filter(p => FAM[p.niche] === fam && p.niche !== niche).map(p => ({ p, s: wscore(p) })).sort((a, b) => near(b.p) - near(a.p) || b.s - a.s || a.p.rank - b.p.rank);
  const used = new Set(); kin.forEach(x => { if (!used.has(x.p.niche)) { used.add(x.p.niche); add(x.p); } }); kin.forEach(x => add(x.p));
  if (ws.length) all.map(p => ({ p, s: wscore(p) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s || a.p.rank - b.p.rank).forEach(x => add(x.p));
  all.filter(p => p.rank === 1).sort((a, b) => (b.works.length - a.works.length)).forEach(add);
  const esc = t => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const url = f => 'file://' + abs(f).split(path.sep).map(encodeURIComponent).join('/').replace(/^file:\/\/%2F?/, 'file:///');
  // In the postclick app's look (Figtree, Fraunces, the app purple). A card holds 3 things:
  // the page, its number with its trade, and the one thing it does best.
  const cards = pick.map((p, i) => { const ph = p.images.find(x => /phone/.test(x));
    return `<figure><div class="shot"><img src="${url(p.images[0])}" alt="${esc(p.domain)}" loading="lazy">${ph ? `<img class="ph" src="${url(ph)}" alt="" loading="lazy">` : ''}</div><figcaption><b>${i + 1}</b><div><h2>${esc(p.niche_name)}</h2>${p.works[0] ? `<p>${esc(p.works[0])}</p>` : ''}</div></figcaption></figure>`; }).join('');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pick a style</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,600&display=swap"><style>
:root{--ink:#0C0C0E;--p:#8057FF;--p50:#F2EDFF;--g500:#64647B;--g100:#E5E5F9;--band:linear-gradient(180deg,#e5e5f9 0%,#f2f2fd 100%);color-scheme:light}
*{box-sizing:border-box}html{background:#f2f2fd}body{margin:0;min-height:100vh;background:var(--band) no-repeat;color:var(--ink);font:500 16px/1.5 Figtree,system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:56px max(16px,4vw) 72px}
.w{max-width:1240px;margin:0 auto}h1{font:600 clamp(34px,4.4vw,56px)/1.05 Fraunces,Georgia,serif;letter-spacing:-.01em;margin:0 0 12px;text-wrap:balance}
p.sub{margin:0 0 40px;color:var(--g500);font-size:19px;max-width:60ch}p.sub b{color:var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr));gap:28px}
figure{margin:0;background:#fff;border-radius:22px;overflow:hidden;border:1px solid var(--g100);box-shadow:rgba(18,13,31,.45) 0 18px 40px -16px;transition:transform .25s cubic-bezier(.2,.7,.2,1)}
figure:hover{transform:translateY(-4px)}
.shot{position:relative;height:320px;overflow:hidden;background:#F3F3FF}.shot img{width:100%;display:block}
.shot .ph{position:absolute;right:16px;bottom:-70px;width:27%;border-radius:14px;border:3px solid #fff;box-shadow:rgba(0,0,0,.35) 0 10px 24px -8px}
figcaption{display:grid;grid-template-columns:44px minmax(0,1fr);gap:16px;padding:20px 22px 24px;align-items:start}
figcaption b{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--p);color:#fff;font-size:20px;font-weight:800}
h2{font-size:19px;font-weight:700;margin:0 0 4px;line-height:1.25}figcaption p{margin:0;color:var(--g500);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
@media (prefers-reduced-motion:reduce){figure{transition:none}}
</style><div class="w"><h1>Pick the look for your page</h1><p class="sub">Tell me the number. <b>I build your page in that look</b>, with your logo, colours, photos and words.</p><div class="grid">${cards}</div></div></html>`;
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(out, html);
  console.log(`Wrote ${path.resolve(out)} with ${pick.length} styles:`);
  pick.forEach((p, i) => { console.log(`\n${i + 1}.`); page(p); });
} else {
  console.log('Commands: niches | niche <slug> | find <words> | sections <words> | board <out.html> <niche> [words]');
}
