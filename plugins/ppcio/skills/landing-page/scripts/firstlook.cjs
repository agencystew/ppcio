// Prints the first-look message, ready to send, from landing-pages/<site>/first-look.md.
// Usage: node firstlook.cjs <site> <studio link>
// 26 Nov: in 3 of 4 tests the model wrote the first look to the file and never sent it.
const fs = require('fs'); const path = require('path');
const [site, link] = process.argv.slice(2);
const f = path.join('landing-pages', site, 'first-look.md');
if (!fs.existsSync(f)) process.exit(0);
const items = fs.readFileSync(f, 'utf8').split(/^\d+\.\s+/m).slice(1).map(s => s.trim().replace(/\n\s*\n[\s\S]*$/, '')).filter(Boolean).slice(0, 3);
if (items.length < 3) { console.log('first-look.md needs 3 numbered items. Fix it, then run view again.'); process.exit(0); }
const fmt = s => { const [what, fix] = s.split(/\n\s*Fix:\s*/); return `${what.replace(/\s+/g, ' ').trim()}${fix ? `\n   **Fix:** ${fix.replace(/\s+/g, ' ').trim()}` : ''}`; };
let host = site; try { const sf = JSON.parse(fs.readFileSync(path.join('landing-pages', site, 'inputs', 'site-facts.json'), 'utf8')); host = new URL(sf.final_url || sf.url).host.replace(/^www\./, ''); } catch {}
const lines = [`**The first 3 things a buyer notices on ${host}:**`, '', ...items.map((s, i) => `${i + 1}. ${fmt(s)}`), '',
  `Next I'm running the full audit of this page: your buyers, your competitors, your proof and your words. About 10 minutes. Watch it here: ${link}`];
fs.writeFileSync(path.join('landing-pages', site, '.first-look-sent'), new Date().toISOString());
console.log(`\nMESSAGE TO SEND NOW, before any agent starts. Send the text between the lines as your chat message, word for word (you may bold the first words of each item). Then start the audit in this same turn.\n----\n${lines.join('\n')}\n----`);
