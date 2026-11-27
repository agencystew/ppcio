// node checkfacts.cjs <work folder> [file.md ...]
// Checks every quote in facts.md (and any other files named, such as page.html)
// word for word against the text the capture saved: inputs/site-page-text*.md,
// inputs/pages/*.md and live-parts.json. The postclick build does the same check (studio-kit
// facts.py), because a quote the page does not hold is an invented review.
// Prints each quote that is NOT on their site. Exit 1 when there is one.
const fs = require('fs'); const path = require('path');
const work = path.resolve(process.argv[2] || '.');
const files = process.argv.slice(3).length ? process.argv.slice(3) : ['facts.md'];
const norm = s => s.toLowerCase().replace(/[‘’`´]/g, "'").replace(/[“”«»]/g, '"').replace(/[–—]/g, '-').replace(/[^a-z0-9$%'.,\- ]+/g, ' ').replace(/\s+/g, ' ').trim();

const IN = path.join(work, 'inputs'); const sources = [];
for (const f of fs.existsSync(IN) ? fs.readdirSync(IN) : []) if (/^site-page-text.*\.md$/.test(f)) sources.push(path.join(IN, f));
const PAGES = path.join(IN, 'pages');
for (const f of fs.existsSync(PAGES) ? fs.readdirSync(PAGES) : []) if (f.endsWith('.md')) sources.push(path.join(PAGES, f));
// Proof from outside their site (reviews, awards, case studies): saved page text, first line "Source: <url>".
const PROOF = path.join(IN, 'proof');
for (const f of fs.existsSync(PROOF) ? fs.readdirSync(PROOF) : []) if (f.endsWith('.md')) sources.push(path.join(PROOF, f));
if (!sources.length) { console.log(`No captured text in ${IN}. Give the work folder (landing-pages/<site>), or run the capture first.`); process.exit(2); }
// live-parts.json holds text that loads late (review widgets, sliders): its strings count as their site too.
const strings = o => typeof o === 'string' ? [o] : o && typeof o === 'object' ? Object.values(o).flatMap(strings) : [];
let late = ''; try { late = strings(JSON.parse(fs.readFileSync(path.join(work, 'live-parts.json'), 'utf8'))).join('\n'); } catch (e) {}
// Their meta description and photo alt text are their words too (26 Nov: "often within the hour" was flagged).
let extra = ''; try { extra += (JSON.parse(fs.readFileSync(path.join(IN, 'site-facts.json'), 'utf8')).description || '') + '\n'; } catch (e) {}
try { extra += [...fs.readFileSync(path.join(IN, 'photos.md'), 'utf8').matchAll(/alt "([^"]*)"/g)].map(m => m[1]).join('\n'); } catch (e) {}
const site = norm(sources.map(f => fs.readFileSync(f, 'utf8')).join('\n') + '\n' + late + '\n' + extra);

let bad = 0, total = 0;
for (const name of files) {
  const f = path.isAbsolute(name) ? name : path.join(work, name);
  if (!fs.existsSync(f)) { console.log(`Missing: ${name}`); continue; }
  let text = fs.readFileSync(f, 'utf8');
  // A built page: check the words a visitor reads, not the code.
  if (/\.html?$/i.test(f)) text = text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<(br|p|div|li|h[1-6]|blockquote|figcaption|section)\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&ldquo;|&#8220;/g, '“').replace(/&rdquo;|&#8221;/g, '”').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&#8217;/g, "'");
  // Match ALL double-quoted spans first (short or long) so a short term like "since 1976" never shifts
  // quote pairing onto the prose between two quotes, then filter to 4+ word quotes.
  const quotes = text.split('\n').filter(l => !/\bowner\b/i.test(l))
    .flatMap(l => [...l.matchAll(/"([^"\n]{1,600})"|“([^”\n]{1,600})”/g)].map(m => m[1] ?? m[2]))
    .filter(q => q && q.length >= 12 && q.trim().split(/\s+/).length >= 4);
  // 26 Nov (Opus kit test): unquoted claims passed ("We plan the install around your business
  // operations"). On a built page, list each sentence that says "we", "our", "every" or a number
  // and whose words are mostly not on their site. A list to check, not a fault: a good rewrite is new words too.
  if (/\.html?$/i.test(f)) {
    // Word pairs, not single words: their site uses "plan", "install" and "business" too, but never "plan the install".
    const sw = site.split(/[^a-z0-9$%']+/).filter(Boolean); const pairs = new Set(sw.slice(1).map((x, i) => sw[i] + ' ' + x));
    const sents = text.replace(/["“][^"”]{12,600}["”]/g, ' ').split(/\n|(?<=[.!?])\s+/).map(t => t.replace(/\s+/g, ' ').trim()).filter(t => t.split(' ').length >= 5);
    const claims = [...new Set(sents)].filter(t => /\b(we|we're|we'll|our|us|every|always|never|no job|guarantee\w*|\d+)\b/i.test(t)).filter(t => {
      const w = norm(t).split(/[^a-z0-9$%']+/).filter(Boolean); const ps = w.slice(1).map((x, i) => w[i] + ' ' + x);
      return ps.length >= 4 && ps.filter(x => pairs.has(x)).length / ps.length < 0.5; });
    // 26 Nov (agency test): builders invented figures that only the critic caught. Every price, percentage,
    // time, count or year on the page must be on their site, in facts.md or in the owner's words. A fault.
    let factsTxt = ''; try { factsTxt = norm(fs.readFileSync(path.join(work, 'facts.md'), 'utf8')); } catch (e) {}
    const known = site + '\n' + factsTxt; const digits = x => x.replace(/[^\d.]/g, '').replace(/\.$/, '');
    const nums = [...new Set([...text.replace(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g, ' ').matchAll(/(?:[$£€]\s?\d[\d,.]*|\b\d[\d,.]*\s?(?:%|\+|years?|yrs|minutes?|mins?|hours?|hrs|days?|weeks?|reviews?|ratings?|customers?|clients?|jobs|homes|projects|stars?|-star)|\b(?:since|in|est\.?)\s+(?:19|20)\d{2}\b|\b\d\.\d\b)/gi)].map(m => m[0].trim()))]
      .filter(n => { const d = digits(n); if (!d) return false;
        // The figure as a whole number, never inside a longer one ("45" inside a phone number is not "45 minutes").
        const has = x => new RegExp(`(^|[^\\d.,])${x.replace(/[.]/g, '\\.')}(?![\\d]|[.,]\\d)`).test(known);
        return !has(d) && !has(Number(d).toLocaleString('en-US')); });
    if (nums.length) { bad += nums.length; total += nums.length; console.log(`NUMBERS NOT IN THEIR WORDS (${name}): each figure is not on their site or in facts.md. Use their real figure, or cut it:\n` + nums.slice(0, 20).map(n => '  - ' + n).join('\n')); }
    if (claims.length) console.log(`CHECK THESE CLAIMS (${name}): each is a statement about the business in words their site does not use. Keep it only if facts.md or the owner backs it; otherwise cut it.\n` + claims.slice(0, 25).map(c => '  - ' + c.slice(0, 160)).join('\n'));
  }
  for (const q of quotes) {
    total++;
    // Allow "..." for a cut inside a quote: every piece must be on the site.
    const pieces = q.split(/\s*(?:\.\.\.|…)\s*/).map(norm).filter(p => p.length >= 8);
    if (pieces.length && pieces.every(p => site.includes(p))) continue;
    bad++; console.log(`NOT ON THEIR SITE (${name}): "${q.slice(0, 160)}"`);
  }
}
// Claims on their own site that cannot both be true (buyer test, 26 Nov): johnnyrooter.com says "Family-Owned for
// Over 50 Years" on the home page and "since 1993" on About. The page must not pick one by chance.
const yearNow = new Date().getFullYear(); const said = [];
for (const f of sources) {
  const raw = fs.readFileSync(f, 'utf8'); const page = path.basename(f, '.md').replace(/^site-page-text.*$/, 'their page');
  for (const m of raw.matchAll(/\b(?:since|founded(?: in)?|established(?: in)?|est\.?|opened(?: in)?|started(?: in)?|serving [^.\n]{0,40}? since)\s+((?:19|20)\d\d)\b/gi)) said.push({ year: +m[1], text: m[0], page });
  for (const m of raw.matchAll(/\b(?:over|more than|nearly|almost)?\s*(\d{1,3})\+?\s+years\b(?! old)/gi)) {
    const n = +m[1];
    if (n < 3 || n > 150) continue;
    // Skip product lifespans, warranties, and financing terms ("average lifetime (20 years or less)") unless
    // the surrounding clause explicitly refers to company history/experience.
    const ctx = raw.slice(Math.max(0, m.index - 45), m.index + m[0].length + 45);
    const isProductDuration = /\b(lifetime|lifespan|warranty|guarantee|asphalt|shingle|metal|roof|loan|financing|term|amortiz|average|every\s+\d+|or\s+less|lasts?\s+(?:up\s+to\s+)?\d+)\b/i.test(ctx);
    const isBusinessAge = /\b(experience|in business|family[- ]owned|serving|established|history|trusted|remodeling|industry)\b/i.test(ctx);
    if (isProductDuration && !isBusinessAge) continue;
    said.push({ year: yearNow - n, text: m[0].trim(), page });
  }
}
const yrs = said.map(x => x.year);
if (yrs.length && Math.max(...yrs) - Math.min(...yrs) > 5) {
  const seen = new Set(); const lines = said.filter(x => { const k = x.text.toLowerCase() + x.page; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
  console.log(`CONFLICTING CLAIMS: their site gives different ages for the business. Never pick one by chance. Do not stop to ask now: list both under "## To confirm" and leave them out of every fix and the build until the owner settles them (in agency mode, use the year their About page states, because a year beats a count of years that goes stale).\n` + lines.map(x => `  - "${x.text}" (${x.page})`).join('\n'));
}
console.log(bad ? `${bad} of ${total} quotes are not on their site. Fix each one: copy it word for word from the captured text, or mark it as the owner's words with where they said it, or remove it.` : `All ${total} quotes are on their site, word for word.`);
process.exit(bad ? 1 : 0);
