// kit.sh cost [session.jsonl]: the tokens and dollars of one Claude Code run, the main chat and every agent.
// With no file, it reads the newest session of this folder in ~/.claude/projects.
// Prices: USD per million tokens, API list prices from docs.claude.com/en/docs/about-claude/pricing (26 Nov 2026).
// [input, output, cache write 5 min, cache write 1 hour, cache read]
const fs = require('fs'); const path = require('path'); const os = require('os');
const PRICE = {
  'fable-5-2': [8, 40, 10, 16, 0.20], 'opus-5-5': [4, 20, 5, 8, 0.20], 'sonnet-5-5': [2, 10, 2.5, 4, 0.10],
  'haiku-5-5': [0.10, 0.50, 0.125, 0.20, 0.01], 'opus-5': [5, 25, 6.25, 10, 0.50], 'opus-4': [5, 25, 6.25, 10, 0.50],
  'sonnet-5': [2, 10, 2.5, 4, 0.20], 'sonnet-4': [3, 15, 3.75, 6, 0.30], 'haiku-4': [1, 5, 1.25, 2, 0.10],
};
const priceOf = m => { const k = Object.keys(PRICE).find(k => String(m).includes(k)); return k ? [k, PRICE[k]] : ['opus-5-5', PRICE['opus-5-5']]; };
let file = process.argv[2];
if (!file) {
  const dir = path.join(os.homedir(), '.claude', 'projects', process.cwd().replace(/[^A-Za-z0-9]/g, '-'));
  const all = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')).map(f => path.join(dir, f)) : [];
  if (!all.length) { console.log(`No Claude Code session found for this folder (${dir}). Pass a session file.`); process.exit(1); }
  file = all.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
}
const subDir = file.replace(/\.jsonl$/, '') + '/subagents';
const files = [['main chat', file], ...(fs.existsSync(subDir) ? fs.readdirSync(subDir).filter(f => f.endsWith('.jsonl')).map(f => ['agents', path.join(subDir, f)]) : [])];
const rows = {}; let first = null, last = null;
// One API reply spans several lines (one per content block); keep each reply's last usage, which is the final count.
const replies = new Map();
for (const [who, f] of files) {
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    let d; try { d = JSON.parse(line); } catch (e) { continue; }
    if (d.timestamp && who === 'main chat') { const t = Date.parse(d.timestamp); first = first ?? t; last = t; }
    const m = d.message; if (d.type !== 'assistant' || !m || !m.usage) continue;
    replies.set(`${f}|${m.id || d.uuid}`, [who, m]);
  }
}
for (const [who, m] of replies.values()) {
  {
    const u = m.usage; const [k, p] = priceOf(m.model);
    const r = rows[`${who} ${k}`] ??= { who, k, n: 0, in: 0, out: 0, w: 0, rd: 0, usd: 0, opus: 0 };
    const w1 = (u.cache_creation && u.cache_creation.ephemeral_1h_input_tokens) || 0;
    const w5 = (u.cache_creation_input_tokens || 0) - w1;
    const t = [u.input_tokens || 0, u.output_tokens || 0, w5, w1, u.cache_read_input_tokens || 0];
    r.n++; r.in += t[0]; r.out += t[1]; r.w += t[2] + t[3]; r.rd += t[4];
    r.usd += t.reduce((s, x, i) => s + x * p[i], 0) / 1e6;
    r.opus += t.reduce((s, x, i) => s + x * PRICE['opus-5-5'][i], 0) / 1e6;
  }
}
const M = x => (x / 1e6).toFixed(2) + ' M';
const list = Object.values(rows).sort((a, b) => b.usd - a.usd);
console.log(`Run: ${path.basename(file)}, ${files.length - 1} agents${first && last ? `, ${Math.round((last - first) / 60000)} minutes` : ''}`);
console.log('who        model        replies   output  input+writes  cache reads     cost');
for (const r of list) console.log(`${r.who.padEnd(10)} ${r.k.padEnd(12)} ${String(r.n).padStart(7)}  ${M(r.out).padStart(7)}  ${M(r.in + r.w).padStart(12)}  ${M(r.rd).padStart(11)}  $${r.usd.toFixed(2).padStart(6)}`);
const sum = k => list.reduce((s, r) => s + r[k], 0);
console.log(`TOTAL at API list prices: $${sum('usd').toFixed(2)} (output ${M(sum('out'))}, cache reads ${M(sum('rd'))})`);
console.log(`The same tokens, all on Opus 5.5: $${sum('opus').toFixed(2)}`);
