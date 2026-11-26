// Prints the first-look message, ready to send, from landing-pages/<site>/first-look.md.
// Usage: node firstlook.cjs <site | work folder> [studio link]
// 26 Nov: in 3 of 4 tests the model wrote the first look to the file and never sent it.
const fs = require('fs'); const path = require('path');
const [arg, link] = process.argv.slice(2);
if (!arg) process.exit(0);
const dir = fs.existsSync(path.resolve(arg, 'first-look.md')) ? path.resolve(arg) : path.resolve('landing-pages', path.basename(arg));
const site = path.basename(dir);
const f = path.join(dir, 'first-look.md');
if (!fs.existsSync(f)) process.exit(0);
const items = fs.readFileSync(f, 'utf8').split(/^\d+\.\s+/m).slice(1).map(s => s.trim().replace(/\n\s*\n[\s\S]*$/, '')).filter(Boolean).slice(0, 3);
if (items.length < 3) { console.log('first-look.md needs 3 numbered items. Fix it, then run view or firstlook again.'); process.exit(0); }
const fmt = s => { const [what, fix] = s.split(/\n\s*Fix:\s*/); return `${what.replace(/\s+/g, ' ').trim()}${fix ? `\n   **Fix:** ${fix.replace(/\s+/g, ' ').trim()}` : ''}`; };
let host = site; try { const sf = JSON.parse(fs.readFileSync(path.join(dir, 'inputs', 'site-facts.json'), 'utf8')); host = new URL(sf.final_url || sf.url).host.replace(/^www\./, ''); } catch {}
const big = ((fs.readFileSync(f, 'utf8').match(/^Big picture:\s*(.+)$/mi) || [])[1] || '').trim();
const nextLine = link
  ? `Next I'm running the full audit of this page: your buyers, your competitors, your proof and your words. About 10 minutes. Watch it here: ${link}`
  : `Next I'm running the full audit of this page: your buyers, your competitors, your proof and your words. About 10 minutes.`;
const lines = [...(big ? [`**The big picture:** ${big}`, ''] : []), `**The first 3 things a buyer notices on ${host}:**`, '', ...items.map((s, i) => `${i + 1}. ${fmt(s)}`), '', nextLine];
fs.writeFileSync(path.join(dir, '.first-look-sent'), new Date().toISOString());
console.log(`\nMESSAGE TO SEND NOW. Send the text between the lines as your very next chat message, word for word, before any other tool call. Then start the audit in this same turn, and write nothing else in chat until a tool prints the next MESSAGE TO SEND NOW.\n----\n${lines.join('\n')}\n----`);
