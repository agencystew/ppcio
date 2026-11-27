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
if (items.length < 3) { console.log('NOT READY TO SEND. first-look.md needs 3 numbered items. Fix it, then run view or firstlook again. Send nothing yet.'); process.exit(0); }
// Run 12 (27 Nov): view printed the message before the first-look check, so the buyer saw a big picture that was too
// long and a quote that is not on their site. Check first. A fact fault always blocks; any other fault lets go after 3 tries.
{
  const tf = path.join(dir, '.harness', 'firstlook-tries'); let n = 0; try { n = +fs.readFileSync(tf, 'utf8') || 0; } catch {}
  let faults = []; try { faults = require('./gates.cjs')['first-look'](dir); } catch {}
  if (n >= 3) faults = faults.filter(x => /not on their site|a figure|the figure|phone number|promises|percentage/i.test(x));
  if (faults.length) {
    fs.mkdirSync(path.dirname(tf), { recursive: true }); fs.writeFileSync(tf, String(n + 1));
    console.log(`NOT READY TO SEND. Fix these in first-look.md, then run this command again. Send nothing yet.\n${faults.map(x => '- ' + x).join('\n')}`);
    process.exit(0);
  }
}
const fmt = s => { const [what, fix] = s.split(/\n\s*Fix:\s*/); return `${what.replace(/\s+/g, ' ').trim()}${fix ? `\n   **Fix:** ${fix.replace(/\s+/g, ' ').trim()}` : ''}`; };
let host = site; try { const sf = JSON.parse(fs.readFileSync(path.join(dir, 'inputs', 'site-facts.json'), 'utf8')); host = new URL(sf.final_url || sf.url).host.replace(/^www\./, ''); } catch {}
const big = ((fs.readFileSync(f, 'utf8').match(/^Big picture:\s*(.+)$/mi) || [])[1] || '').trim();
const nextLine = link
  ? `Next I'm running the full audit of this page: your buyers, your competitors, your proof and your words. About 10 minutes. Watch it here: ${link}`
  : `Next I'm running the full audit of this page: your buyers, your competitors, your proof and your words. About 10 minutes.`;
const lines = [...(big ? [`**The big picture:** ${big}`, ''] : []), `**The first 3 things a buyer notices on ${host}:**`, '', ...items.map((s, i) => `${i + 1}. ${fmt(s)}`), '', nextLine];
fs.writeFileSync(path.join(dir, '.first-look-sent'), new Date().toISOString());
console.log(`\nMESSAGE TO SEND NOW. Send the text between the lines as your very next chat message, word for word, before any other tool call. Then, in this same turn, run kit.sh next <site> and do the step it prints, and write nothing else in chat until a tool prints the next MESSAGE TO SEND NOW.\n----\n${lines.join('\n')}\n----`);
