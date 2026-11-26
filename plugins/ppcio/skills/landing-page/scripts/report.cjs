// node report.cjs <work folder>
// Draws the audit screen: audit.html in the work folder, in the postclick
// app's audit look (look-v26). Claude never writes this page by hand. The audit
// agents write audit/*.json, this script puts that data, the app's own CSS,
// icons and art (report/, copied from the app by dev/sync_report_style.py)
// into report-template.html, and the template draws it. One file, no server.
//
// Reads (each one is optional, a missing file hides its part of the page):
//   audit/leaks.json, actions.json, offer.json, ad-match.json, competitive.json,
//   forensics.json, copy.json, buyers.json, journey-*.json
//   context.md, inputs/site-facts.json, inputs/live-*.png, competitors/*/, brand.json
// brand.json (optional, for an agency): {"name": "Acme Digital", "logo": "brand/logo.png"}
const fs = require('fs'); const path = require('path');
const { computeAuditScore } = require('./score.cjs');
const work = path.resolve(process.argv[2] || '.');
const site = path.basename(work);
const R = path.join(__dirname, 'report');
const read = f => { try { return JSON.parse(fs.readFileSync(path.join(work, f), 'utf8')); } catch (e) { return null; } };
const text = f => { try { return fs.readFileSync(path.join(work, f), 'utf8'); } catch (e) { return ''; } };
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
const dataUri = (rel) => {
  if (!rel) return null;
  if (/^(data:|https?:)/i.test(rel)) return rel;
  const full = path.resolve(work, rel);
  if (!full.startsWith(work + path.sep) || !fs.existsSync(full)) return rel;
  const mime = MIME[path.extname(full).toLowerCase()];
  if (!mime) return rel;
  try { return `data:${mime};base64,${fs.readFileSync(full).toString('base64')}`; } catch (e) { return rel; }
};

// The app's credibility guards run first: false 'missing' claims, quotes not on the page, repeats.
const dropped = require('./audit-guard.cjs')(work);
if (dropped.length) console.log(`Audit guard: ${dropped.length} findings removed or merged (see audit/guard-log.md).`);
// A rewrite with a blank for the owner to fill ([year], {fee}, XX, TBD) must never reach the audit screen.
// Also a note to the owner inside a line to paste ("If you know your call-out fee, put it on this line", Johnny Rooter, 26 Nov).
const BLANK = /\[[^\]]{2,40}\]|\{[^}]{2,40}\}|\bX{2,}\b|\bTBD\b|\bTK\b|<insert|\$X\b|\bif you (know|have)\b[^.]{0,60}\b(put|add|use)\b|\bput (it|that|them) (on|in) this\b|\bfill (it |this )?in\b/i;
const blanks = [];
// Only lines we tell the owner to use. A quote of their page (evidence, original) may hold [notes].
const NEW = /rewrite|fix|suggest|new_|after|replacement|move|counter/i; const OLD = /evidence|original|quote|before|current|detail|mechanism|why/i;
for (const f of ['leaks', 'copy', 'offer', 'actions', 'competitive', 'ad-match']) {
  const found = new Set(); const walk = (v, k = '') => { if (typeof v === 'string') { if (NEW.test(k) && !OLD.test(k)) (v.match(new RegExp(BLANK.source, 'g')) || []).forEach(x => found.add(x)); }
    else if (Array.isArray(v)) v.forEach(x => walk(x, k)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k2, x]) => walk(x, k2)); };
  walk(read(`audit/${f}.json`)); if (found.size) blanks.push(`audit/${f}.json: ${[...found].slice(0, 4).join(', ')}`);
}
// The owner reads this page. A file name or a word for how we worked ("Seen in live-phone-today.png",
// "structural inference", "the craft notes") must never reach it (buyer test, 26 Nov). Notes the page never
// draws (what held the agent back, its self check) may name files.
const INTERNAL = /\b[\w-]+\.(png|jpe?g|webp|json|md|html|cjs|txt)\b|structural inference|\bcraft notes\b|\b(the|a|this) (scrape|capture|inventory)\b|site-facts|\bfacts\.md\b/i;
const NOT_DRAWN = /held_back|uncertainty|self_check|evidence_for|source|^url$|shot/i;
for (const f of ['leaks', 'copy', 'offer', 'actions', 'competitive', 'ad-match', 'forensics', 'buyers', 'trust', 'anatomy', 'psych', 'design'].concat(fs.existsSync(path.join(work, 'audit')) ? fs.readdirSync(path.join(work, 'audit')).filter(x => /^journey-\d+\.json$/.test(x)).map(x => x.replace(/\.json$/, '')) : [])) {
  const found = new Set(); const walk = (v, k = '') => { if (NOT_DRAWN.test(k)) return; if (typeof v === 'string') { const m = v.match(INTERNAL); if (m) found.add(`${k}: "${m[0]}"`); }
    else if (Array.isArray(v)) v.forEach(x => walk(x, k)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k2, x]) => walk(x, k2)); };
  walk(read(`audit/${f}.json`)); if (found.size) blanks.push(`audit/${f}.json names a file or how we worked, which the owner would see (${[...found].slice(0, 3).join('; ')}). Say what is on their page in plain words instead`);
}
if (blanks.length) { console.log(`NOT DRAWN (fix this silently: write nothing in chat): these audit files hold lines the owner must not see. Fix each line (a blank: use a fact from facts.md or site-page-text.md, or rewrite the line without it), then run report again:\n- ${blanks.join('\n- ')}`); process.exit(3); }
const A = {};
for (const k of ['leaks', 'actions', 'offer', 'ad-match', 'competitive', 'forensics', 'copy', 'buyers', 'trust', 'anatomy', 'psych', 'design']) {
  const d = read(`audit/${k}.json`);
  if (d && !d.error) A[k.replace('-', '_')] = d;
}
const AD = path.join(work, 'audit');
A.journeys = (fs.existsSync(AD) ? fs.readdirSync(AD) : []).filter(f => /^journey-\d+\.json$/.test(f)).sort()
  .map(f => read(`audit/${f}`)).filter(j => j && !j.error && Array.isArray(j.moments));
if (!A.leaks && !A.actions) { console.log('No audit/leaks.json or audit/actions.json yet. Run the audit team first.'); process.exit(2); }

// What we know about the business: the parts of context.md, by heading.
const ctx = {}; let cur = null;
for (const line of text('context.md').split('\n')) {
  const h = line.match(/^#{2,3}\s+(.+?)\s*$/);
  if (h) { cur = h[1].toLowerCase(); ctx[cur] = ''; continue; }
  // A "- Label: value" line counts as its own part too, so a context.md without the headings still reads.
  const kv = line.match(/^[-*]\s+([A-Za-z][^:]{1,40}):\s+(.+)$/);
  if (kv && !(kv[1].toLowerCase() in ctx)) ctx[kv[1].toLowerCase()] = kv[2].trim();
  if (cur && line.trim()) ctx[cur] += (ctx[cur] ? ' ' : '') + line.replace(/^[-*]\s+/, '').trim();
}
const pick = re => { const k = Object.keys(ctx).find(k => re.test(k)); return k ? ctx[k].replace(/\s*\(from (their|the) page\)/gi, '').replace(/^./, c => c.toUpperCase()).trim() : ''; };

const facts = read('inputs/site-facts.json') || {};
const parts = (facts.title || '').split(/\s[|\-–—:·]\s/).map(s => s.trim()).filter(Boolean);
const flatName = s => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
const finalHost = (() => { try { return new URL(facts.final_url || facts.url || '').hostname.replace(/^www\./, '').split('.')[0]; } catch { return ''; } })();
const keys = [site, finalHost].filter(Boolean).map(flatName);
const name = parts.find(p => keys.some(k => flatName(p).includes(k) || (flatName(p).length > 3 && k.startsWith(flatName(p)))))
  || (parts.length > 1 && parts[parts.length - 1].length <= 32 ? parts[parts.length - 1] : null)
  || site.charAt(0).toUpperCase() + site.slice(1);
const CD = path.join(work, 'competitors');
const blocked = (fs.existsSync(CD) ? fs.readdirSync(CD) : []).filter(d => fs.existsSync(path.join(CD, d, 'NOT-CAPTURED.txt')));
const has = f => fs.existsSync(path.join(work, f));
const brand = read('brand.json');
if (brand && brand.logo) brand.logo = dataUri(brand.logo);
const pageUrl = String(facts.final_url || facts.url || '').replace(/#.*$/, '');
const score = computeAuditScore(A, pageUrl);
const md = text('audit.md');
const sec = h => (md.split(new RegExp(`^## ${h}\\s*$`, 'mi'))[1] || '').split(/^## /m)[0].trim();
const diagnosis = sec('The diagnosis').replace(/\s+/g, ' ').trim();
const plan = sec('The plan for your new page').split(/^\d+\.\s+/m).slice(1).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 3);
const data = {
  name, site, url: pageUrl, date: new Date().toISOString().slice(0, 10),
  composite_score: score,
  h1: (facts.headings || []).find(h => h.tag === 'h1')?.text || '', button: (() => { const bs = (facts.buttons || []).filter(b => b.top > 100 && b.top < 900);
    return (bs.find(b => /^tel:/.test(b.href)) || bs.find(b => /call|book|quote|schedule|estimate|appointment|get started|free|contact|order|buy|start/i.test(b.text)) || bs.find(b => !/^#|^https?:\/\/[^/]+\/?$/.test(b.href)))?.text || ''; })(),
  forms: facts.forms || [], lcp_ms: facts.lcp_ms ?? null, tags: facts.tags || [],
  shots: {
    laptop: has('inputs/live-page-today.png') ? dataUri('inputs/live-page-today.png') : null,
    phone: has('inputs/live-phone-today.png') ? dataUri('inputs/live-phone-today.png') : null,
  },
  biz: { sell: pick(/what they sell|what they do|^business$|^sells?$/), who: pick(/who buys|buyers?$|customers?$|sell to/), where: pick(/^where( they (work|sell))?$|area|location/), win: (() => { const w = pick(/win/); const plain = { purchase: 'A sale', quote_request: 'A quote request', lead_form: 'A form enquiry', call: 'A phone call', appointment_booking: 'A booking', demo_request: 'A demo request', trial_signup: 'A trial sign-up', signup: 'A sign-up', application: 'An application', download: 'A download', donation: 'A donation' };
      const m = w.match(/^([A-Za-z_]+)\b\s*(.*)$/); if (!m || !plain[m[1].toLowerCase()]) return w; return m[2] ? m[2].replace(/^./, c => c.toUpperCase()) : plain[m[1].toLowerCase()]; })(),
    from: pick(/visitors|come from|traffic/) },
  blocked, brand, ...A, diagnosis, plan,
};
// A thumbnail for each competitor: its own laptop screenshot, embedded so audit.html stands alone when shared.
if (data.competitive && Array.isArray(data.competitive.competitors)) for (const c of data.competitive.competitors) {
  const host = String(c.url || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[./]/)[0].toLowerCase();
  const flat = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const dir = (fs.existsSync(CD) ? fs.readdirSync(CD) : []).find(d => host && (flat(d).startsWith(flat(host)) || flat(host).startsWith(flat(d))));
  const shot = dir && ['inputs/live-page-today.png', 'live-page-today.png'].map(f => `competitors/${dir}/${f}`).find(has);
  if (shot) c.shot = dataUri(shot);
}

const art = {};
for (const f of fs.readdirSync(path.join(R, 'art'))) art[f.replace(/\.webp$/, '')] = 'data:image/webp;base64,' + fs.readFileSync(path.join(R, 'art', f)).toString('base64');
const safe = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const out = fs.readFileSync(path.join(__dirname, 'report-template.html'), 'utf8')
  .replace('/*__CSS__*/', () => fs.readFileSync(path.join(R, 'v26.css'), 'utf8').replace(/<\/style/gi, '<\\/style'))
  .replace('/*__DATA__*/null', () => safe(data))
  .replace('/*__ICONS__*/null', () => safe(JSON.parse(fs.readFileSync(path.join(R, 'icons.json'), 'utf8'))))
  .replace('/*__ART__*/null', () => safe(art))
  .replace(/__TITLE__/g, `${name} audit`.replace(/[<>&"]/g, ''));
fs.writeFileSync(path.join(work, 'audit.html'), out);
const got = Object.keys(A).filter(k => k !== 'journeys' && A[k]).concat(A.journeys.length ? [`${A.journeys.length} journeys`] : []);
console.log(`Wrote ${path.join(work, 'audit.html')}\nFrom: ${got.join(', ')}`);
// The audit-done message, ready to send, so every app sends the same one (26 Nov: models skipped it when it was only a rule).
const verdict = (md.match(/\*\*Verdict:\*\*\s*(.+)/) || [])[1] || '';
const fixSec = (md.split(/^## (?:What to )?fix first\s*$/mi)[1] || '').split(/^## /m)[0];
const top = fixSec.split(/^\d+\.\s+/m).slice(1).map(item => item.match(/\*\*Now:?\*\*:?\s*([\s\S]+?)\s*\*\*Change to:?\*\*:?\s*([\s\S]+?)\s*(?:\*\*Why|$)/)).filter(Boolean).map(m => [m[0], m[1].replace(/\s+/g, ' '), m[2].replace(/\s+/g, ' ')]).slice(0, 3);
const studio = process.env.PPCIO_STUDIO ? `${process.env.PPCIO_STUDIO}/s/${site}/` : path.join(work, 'audit.html');
// Stewart, 26 Nov: the message read like 3 micro fixes, never a strategist. It leads with the diagnosis and the plan.
const nFix = (fixSec.match(/^\d+\.\s+/gm) || []).length;
if (verdict && (top.length || plan.length)) {
  const lines = [`**Your audit is ready${score != null ? `: ${name} scores ${score} out of 100` : ''}.**`, ''];
  if (diagnosis && plan.length) {
    lines.push(`**What is going on.** ${diagnosis}`, '', '**What your new page does about it:**');
    plan.forEach((x, i) => lines.push(`${i + 1}. ${x}`));
    lines.push('', `The full audit has your buyers, your competitors${nFix ? ` and ${nFix} fixes you can make to today's page this week` : ' and every fix'}: ${studio}`);
  } else {
    lines.push(verdict, '', '**The 3 fixes that win you the most enquiries:**');
    top.forEach((m, i) => lines.push(`${i + 1}. **Now:** ${m[1].trim()}\n   **Change to:** ${m[2].trim()}`));
    lines.push('', `The full audit, with your buyers, your competitors and every fix: ${studio}`);
  }
  let free = false; try { free = /FREE/.test(require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'licence.cjs'), 'status'], { encoding: 'utf8' })); } catch (e) {}
  lines.push('', free ? 'The new page comes with the PPC.io licence. Paste your key here any time and I\'ll build it.' : 'Next I\'m drawing your new page in the style that fits your buyers best. You\'ll see its first screen in about 10 minutes, then the whole page.');
  console.log(`\nMESSAGE TO SEND NOW. Send the text between the lines as your very next chat message, word for word, before any other tool call. Add nothing to it: no offer, no question, no extra advice. Do not end your turn after it: in this same turn, open KIT/steps/2-directions.md and run its first command. The owner does not need to reply.\n----\n${lines.join('\n')}\n----`);
} else {
  console.log('NEXT: audit.md has no verdict or no "What to fix first" list in the Now / Change to form. Fix audit.md, then run report again.');
}
