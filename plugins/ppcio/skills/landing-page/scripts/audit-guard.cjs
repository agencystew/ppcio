// The postclick app's 4 credibility guards on the audit (after-click-workers
// src/orchestrators/audit-do.ts: dropFalseAbsenceFindings,
// dropHallucinatedEvidenceFindings, dedupeLeakFindings, dropUngroundedCopyRewrites),
// ported line for line. report.cjs runs it before it draws audit.html.
// It edits audit/leaks.json and audit/copy.json in place and writes what it
// dropped to audit/guard-log.md. With no page text it drops nothing.
const fs = require('fs'); const path = require('path');

const ABSENCE_SUBJECTS = [
  { subject: 'headline/hero', titleKeywords: /\b(headline|hero|h1|title)\b/i, present: /.{12,}/ },
  { subject: 'cta', titleKeywords: /\b(cta|call to action|button|action)\b/i,
    present: /\b(get|start|book|buy|reserve|enquir|sign up|try|request|quote|contact|order|claim|shop|subscribe|download|begin)\b/i },
  { subject: 'price', titleKeywords: /\b(price|pricing|cost|how much)\b/i,
    present: /(£|\$|€)\s?\d|\bfrom\s+(£|\$|€)?\s?\d|\bper\s+(month|year|person|pp)\b|\bfree\s+(plan|tier|trial|quote|consultation|estimate|shipping|delivery)\b/i },
  { subject: 'reviews/social proof', titleKeywords: /\b(review|social proof|testimonial|rating|stars?)\b/i,
    // Stricter than the app: a "5-Star Rated" badge is not a review. Only a count of reviews proves them.
    present: /\b\d[\d,.]*\+?\s+(google |verified |customer |5-star )?(reviews|ratings)\b/i },
];
const ABSENCE_CLAIM = /\b(no|missing|absent|lacks?|without (a|any)|none (shown|displayed|visible)|never (shown|displayed))\b/i;
// "No reviews under the heading", "no price near the button": about where a thing is, which the text cannot judge.
const PLACEMENT = /\b(under|below|above|near|beside|next to|section|heading|first screen|fold|header|footer)\b/i;
const META_COVERAGE = /\bmobile\b|\bphone\b|\b(unverifiable|couldn't (check|verify)|could not (check|verify)|unable to (check|verify))\b/i;
const LINK_OR_MARKUP = /\b(link|href|anchor|url|button)\b|points? to|goes? (to |no)where|dead[- ]?end|href\s*=|\]\(|["'#]#["'\s)]/i;
const norm = s => s.toLowerCase().replace(/[‘’“”"']/g, "'").replace(/\s+/g, ' ').trim();
const cleanLines = ev => {
  const c = ev.replace(/\[[^\]]*\]/g, ' ').replace(/\.{3,}\s*$/g, ' ').replace(/…+\s*$/g, ' ');
  const l = c.split('\n').map(x => x.trim()).filter(Boolean); return l.length ? l : [c.trim()].filter(Boolean);
};
const RANK = { S1: 4, S2: 3, S3: 2, S4: 1 };
const BUCKETS = ['killers', 'copy', 'friction'];

function guard(work) {
  const read = f => { try { return fs.readFileSync(path.join(work, f), 'utf8'); } catch (e) { return ''; } };
  // Only the text in live-parts.json, never its key names (a key called "reviews" proves nothing).
  const parts = (() => { const out = []; const walk = v => { if (typeof v === 'string') { if (v.length > 3) out.push(v); } else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    try { walk(JSON.parse(read('live-parts.json') || read('inputs/live-parts.json') || 'null')); } catch (e) {} return out.join('\n'); })();
  const desk = [read('inputs/site-page-text.md'), parts].join('\n');
  const mob = read('inputs/site-page-text-phone.md');
  const log = [];
  const lp = path.join(work, 'audit/leaks.json');
  let leaks = null; try { leaks = JSON.parse(fs.readFileSync(lp, 'utf8')); } catch (e) {}
  if (leaks && desk.trim()) {
    // 1. A finding that says the headline, button, price or reviews are missing, when the page text has them.
    for (const b of BUCKETS) if (Array.isArray(leaks[b])) leaks[b] = leaks[b].filter(f => {
      const t = typeof f?.title === 'string' ? f.title : '';
      if (!ABSENCE_CLAIM.test(t) || META_COVERAGE.test(t) || PLACEMENT.test(t)) return true;
      // Stricter than the app: the missing thing must be what "no" points at ("No price on the page",
      // "Reviews are missing"), so "Your button has no explanation" is not read as "no button".
      const says = s => { const k = s.titleKeywords.source.replace(/^\\b|\\b$/g, '');
        return new RegExp(`\\b(no|missing|lacks?|without (a|any)|none of the)\\s+(\\w+\\s+){0,2}${k}`, 'i').test(t)
          || new RegExp(`${k}\\w*\\s+(is|are)\\s+(missing|absent|not (shown|on the page))`, 'i').test(t); };
      for (const s of ABSENCE_SUBJECTS) if (says(s) && s.present.test(desk)) {
        const line = desk.split('\n').find(l => s.present.test(l)) || '';
        log.push(`Dropped (${b}): "${t}". It says the ${s.subject} is missing, but the page has: "${line.trim().slice(0, 120)}"`); return false;
      }
      return true;
    });
    // 2. A finding whose quote is not on the page.
    const dN = norm(desk), mN = norm(mob);
    for (const b of BUCKETS) if (Array.isArray(leaks[b])) leaks[b] = leaks[b].filter(f => {
      if (f?.evidence_kind === 'absent' || typeof f?.evidence !== 'string') return true;
      if (LINK_OR_MARKUP.test(f.title || '') || /#["')\s]|\]\(|href/i.test(f.evidence)) return true;
      const hay = f.viewport === 'mobile' ? (mN || dN) : `${dN}\n${mN}`;
      const lines = cleanLines(f.evidence).map(norm).filter(Boolean);
      if (!lines.length || lines.some(l => l.length < 12) || lines.every(l => hay.includes(l))) return true;
      log.push(`Dropped (${b}): "${f.title}". Its quote is not on the page: "${f.evidence.slice(0, 100)}"`); return false;
    });
  }
  if (leaks) {
    // 3. The same quote in two buckets is one finding. Keep the first, with the higher severity.
    const seen = new Map();
    for (const b of ['killers', 'friction', 'copy']) if (Array.isArray(leaks[b])) leaks[b] = leaks[b].filter(f => {
      const k = typeof f?.evidence === 'string' ? norm(f.evidence) : '';
      if (f?.evidence_kind === 'absent' || k.length < 12) return true;
      const p = seen.get(k); if (!p) { seen.set(k, f); return true; }
      if ((RANK[f.severity] || 0) > (RANK[p.severity] || 0)) p.severity = f.severity;
      if (p.viewport && f.viewport && p.viewport !== f.viewport) p.viewport = 'both';
      log.push(`Merged (${b}): "${f.title}" into "${p.title}" (same quote)`); return false;
    });
    fs.writeFileSync(lp, JSON.stringify(leaks, null, 2));
  }
  // 4. A copy rewrite whose "your current line" is not on the page.
  const cp = path.join(work, 'audit/copy.json');
  let copy = null; try { copy = JSON.parse(fs.readFileSync(cp, 'utf8')); } catch (e) {}
  const all = norm(`${desk}\n${mob}`);
  if (copy && Array.isArray(copy.rewrites) && all) {
    copy.rewrites = copy.rewrites.filter(r => {
      if (typeof r?.original !== 'string') return true;
      const o = norm(r.original); if (o.length < 12 || all.includes(o)) return true;
      log.push(`Dropped copy rewrite (${r.section || 'no section'}): the current line "${r.original.slice(0, 100)}" is not on the page`); return false;
    });
    fs.writeFileSync(cp, JSON.stringify(copy, null, 2));
  }
  if (log.length) fs.appendFileSync(path.join(work, 'audit/guard-log.md'), `# ${new Date().toISOString().slice(0, 16)}\n${log.map(l => `- ${l}`).join('\n')}\n`);
  return log;
}
module.exports = guard;
if (require.main === module) { const l = guard(path.resolve(process.argv[2] || '.')); console.log(l.length ? l.join('\n') : 'Audit guard: nothing to drop.'); }
