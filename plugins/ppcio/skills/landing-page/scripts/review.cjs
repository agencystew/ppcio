// node review.cjs <work folder>
// The review screen: review.html in the work folder, in the postclick app's look.
// It shows the blind test scores (their live page against the new page), the two
// first screens side by side, and the faults the review found and fixed.
// Reads r1/scores.json {"live":[6 numbers],"new":[6 numbers]}, r1/verdict.md,
// inputs/live-page-today.png and the newest r<round>/first.png.
const fs = require('fs'); const path = require('path');
const work = path.resolve(process.argv[2] || '.');
const has = f => fs.existsSync(path.join(work, f));
const read = f => { try { return fs.readFileSync(path.join(work, f), 'utf8'); } catch (e) { return ''; } };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// The harness loops the review (kit.sh next): show the newest round's scores, and the faults fixed in every round.
const nums = []; for (let i = 1; has(`r${i}`); i++) nums.push(i);
let sc = null; for (const i of nums) { try { sc = JSON.parse(read(`r${i}/scores.json`)); } catch (e) {} }
const rounds = fs.readdirSync(work).filter(d => /^r\d+$/.test(d) && has(`${d}/first.png`)).sort((a, b) => +b.slice(1) - +a.slice(1));
const newShot = rounds[0] ? `${rounds[0]}/first.png` : '';
// Each numbered fault starts with a short label: "1. **Label.** Sentence" or "1. Label. Sentence". The step file
// never asked for bold, so a plain label found nothing and the screen showed no fixes (buyer test, 26 Nov).
const fixes = nums.map(i => read(`r${i}/verdict.md`)).join('\n').split('\n').map(l => l.match(/^\s*\d+\.\s+(?:\*\*(.+?)\*\*|([^.*\n]{3,90}?)\.(?:\s|$))/)).filter(Boolean).map(m => (m[1] || m[2]).replace(/\.$/, '').trim());
const AX = ['First screen', 'Case', 'Proof', 'Offer', 'Action'];
const avg = a => a && a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : '';
const bars = sc && Array.isArray(sc.live) && Array.isArray(sc.new) ? AX.map((a, i) => `<div class="ax"><span>${a}</span><div class="b"><i class="l" style="width:${sc.live[i] * 10}%"></i><em>${sc.live[i]}</em></div><div class="b"><i class="n" style="width:${sc.new[i] * 10}%"></i><em>${sc.new[i]}</em></div></div>`).join('') : '';
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your new page, checked</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600;700;800&family=Fraunces:opsz,wght@9..144,600&display=swap"><style>
:root{--ink:#0C0C0E;--p:#8057FF;--g500:#64647B;--g300:#A2A2C1;--g100:#E5E5F9;--mint:#2EE59D;--ok7:#0B6B43;--band:linear-gradient(180deg,#e5e5f9 0%,#f2f2fd 100%);color-scheme:light}
*{box-sizing:border-box}html{background:#f2f2fd}body{margin:0;min-height:100vh;background:var(--band) no-repeat;color:var(--ink);font:500 16px/1.5 Figtree,system-ui,sans-serif;-webkit-font-smoothing:antialiased;padding:56px max(16px,4vw) 72px}
.w{max-width:1240px;margin:0 auto}h1{font:600 clamp(34px,4.4vw,56px)/1.05 Fraunces,Georgia,serif;margin:0 0 12px;text-wrap:balance}
.sub{color:var(--g500);font-size:19px;margin:0 0 36px}.sub b{color:var(--ink)}
.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;margin:0 0 28px}
.card{background:#fff;border:1px solid var(--g100);border-radius:22px;box-shadow:rgba(18,13,31,.45) 0 18px 40px -16px;overflow:hidden}
.card h2{font-size:19px;font-weight:700;margin:0;padding:18px 22px}.card h2 small{font-weight:600;color:var(--g500);font-size:16px;margin-left:8px}
.card .shot{height:420px;overflow:hidden;border-top:1px solid var(--g100)}.card .shot img{width:100%;display:block}
.sc{padding:26px 28px}.sc h2{padding:0 0 6px}.leg{display:flex;gap:18px;color:var(--g500);font-size:15px;margin:0 0 18px}.leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.ax{display:grid;grid-template-columns:120px minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:center;margin:0 0 10px}.ax span{font-weight:600}
.b{position:relative;height:28px;background:#F3F3FF;border-radius:8px}.b i{position:absolute;inset:0 auto 0 0;border-radius:8px}.b .l{background:var(--g300)}.b .n{background:var(--p)}
.b em{position:absolute;right:10px;top:2px;font-style:normal;font-weight:800}
ol{margin:0;padding:8px 28px 26px 50px;columns:2;column-gap:40px}ol li{break-inside:avoid;margin:0 0 8px}ol li::marker{color:var(--ok7);font-weight:800}
@media (max-width:820px){.two{grid-template-columns:minmax(0,1fr)}.card .shot{height:300px}ol{columns:1}.ax{grid-template-columns:90px minmax(0,1fr) minmax(0,1fr)}}
</style><div class="w"><h1>Your new page, checked</h1>
<p class="sub">${sc ? `A blind judge scored both pages as the buyer who clicked your ad: <b>your page today ${avg(sc.live)}</b>, <b>the new page ${avg(sc.new)}</b> out of 10.` : 'Your page today next to the new page.'}${fixes.length ? ` Then the review found <b>${fixes.length} faults</b>, and I fixed every one.` : ''}</p>
<div class="two"><div class="card"><h2>Your page today</h2><div class="shot">${has('inputs/live-page-today.png') ? '<img src="inputs/live-page-today.png" alt="Your page today">' : ''}</div></div>
<div class="card"><h2>The new page<small>${esc(rounds[0] ? 'after the review' : '')}</small></h2><div class="shot">${newShot ? `<img src="${newShot}" alt="The new page">` : ''}</div></div></div>
${bars ? `<div class="card sc" style="margin:0 0 28px"><h2>Blind test, out of 10</h2><div class="leg"><span><i style="background:#A2A2C1"></i>Your page today</span><span><i style="background:#8057FF"></i>The new page</span></div>${bars}</div>` : ''}
${fixes.length ? `<div class="card"><h2>What the review fixed</h2><ol>${fixes.map(f => `<li>${esc(f)}</li>`).join('')}</ol></div>` : ''}
</div></html>`;
fs.writeFileSync(path.join(work, 'review.html'), html);
console.log(`Wrote ${path.join(work, 'review.html')}${sc ? '' : ' (no r1/scores.json, so no scores)'}`);

// The page-ready message, printed ready to send, so every run gives the buyer the same message.
// The model writes ready.md first: an optional "Today:" line, 3 numbered sentences, an optional "Ask:" line.
const site = path.basename(work);
const ready = read('ready.md');
const zip = path.join(work, `${site}-page.zip`);
const liveDir = path.join(work, 'live');
const handover = fs.existsSync(zip) ? zip : (fs.existsSync(path.join(liveDir, 'index.html')) ? liveDir : null);
if (!ready.trim()) {
  console.log(`\nNEXT: write ${path.join(work, 'ready.md')} (an optional "Today:" line for what they must check today, 3 numbered sentences on what the new page does differently and why a buyer acts, in their words, never scores, and an optional "Ask:" line for one missing fact). ${handover ? '' : 'Run kit.sh pack first. '}Then run kit.sh review again: it prints the message to send.`);
  process.exit(0);
}
if (!handover) { console.log(`\nNEXT: run kit.sh pack landing-pages/${site} first, so the message carries the file to hand over. Then run kit.sh review again.`); process.exit(0); }
// Run 12: the Ask line lost its capital. Every line we print starts with one.
const cap = t => t && t[0].toUpperCase() + t.slice(1);
const line = re => cap((ready.match(re) || [])[1]);
const today = line(/^\s*\**today:?\**:?\s*(.+)$/im);
const ask = line(/^\s*\**ask:?\**:?\s*(.+)$/im);
const says = ready.split('\n').map(l => l.match(/^\s*\d+\.\s+(.+)$/)).filter(Boolean).map(m => cap(m[1].trim())).slice(0, 3);
let sf = {}; try { sf = JSON.parse(read('inputs/site-facts.json')); } catch (e) {}
const platform = String(sf.platform || 'unknown').toLowerCase();
const GO = {
  wordpress: 'To put it live on WordPress, your web person adds it as a new page with a Custom HTML block. It takes about 30 minutes.',
  shopify: 'Your site runs on Shopify, which does not take a whole page file well. I can give you each section to paste, with its photo and colours.',
  squarespace: 'Your site runs on Squarespace, which does not take a whole page file well. I can give you each section to paste, with its photo and colours.',
  wix: 'Your site runs on Wix, which does not take a whole page file well. I can give you each section to paste, with its photo and colours.',
  webflow: 'Your site runs on Webflow. Your web person can rebuild it from this file in about an hour, or I can give you each section to paste.',
};
const go = GO[platform] || 'To put it live, send this file to whoever runs your website. It holds the page, its photos and your tracking tags, and takes them about 30 minutes. Tell me where your site is built (WordPress, Shopify, Wix...) and I\'ll give you the exact steps.';
const link = process.env.PPCIO_STUDIO ? `${process.env.PPCIO_STUDIO}/s/${site}/` : path.join(work, 'page.html');
const msg = [
  today ? `**Check this today:** ${today}\n` : '',
  `**Your new page is ready:** ${link}`,
  process.env.PPCIO_STUDIO ? '(Your page today and the new one side by side, on a laptop and a phone.)\n' : '',
  says.length > 1 ? says.map((s, i) => `${i + 1}. ${s}`).join('\n') : says.join(' '), '',
  `${go}`, `The file to hand over: ${handover}`, '',
  ask ? `${ask}\n` : '',
  'Tell me any change and I\'ll fold it in.',
].filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
try { fs.writeFileSync(path.join(work, '.page-sent'), msg); } catch (e) {}
console.log(`\nMESSAGE TO SEND NOW. Send the text between the lines as your very next chat message, word for word and in full (a short-replies style does not apply to it), as visible text and never in your thinking. Do not end your turn after it: that stops the work until the owner writes back. Send it before any other tool call. Attach page.html too, or show it in your app's preview, so they can share it. Then run kit.sh next ${site}: it checks the owner got the message.\n----\n${msg}\n----`);
