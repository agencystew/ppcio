// The checks kit.sh next runs on each step's file before the run may move on.
// Every check here comes from a real fault in a blind buyer run (runs 1 to 11, 26 Nov 2026) or from
// Stewart's rules for postclick builds. The run number or the rule is in the comment beside each one.
// node gates.cjs <work folder> <gate>  prints the faults of one gate (for tests). next.cjs requires it.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');

const read = (W, f) => { try { return fs.readFileSync(path.join(W, f), 'utf8'); } catch (e) { return ''; } };
const json = (W, f) => { try { return JSON.parse(read(W, f)); } catch (e) { return null; } };
const words = s => (s.match(/[A-Za-z0-9$%'’-]+/g) || []).length;
const sentences = s => s.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[A-Z0-9"“$])/).filter(x => words(x) >= 3);
const section = (md, head) => ((md.split(new RegExp(`^##\\s+${head}\\s*$`, 'mi'))[1] || '').split(/^##\s/m)[0]).trim();
const items = s => s.split(/\n(?=\s*\d+\.\s)/).map(x => x.trim()).filter(x => /^\d+\.\s/.test(x));
const norm = s => s.toLowerCase().replace(/[‘’`´]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ');

// Words the buyer must never see (runs 2, 4, 5, 11: "my team of 12 checkers", "the critic", "4 of 11 checks", "rivals").
const INTERNAL = /\b(sub-?agents?|agents?|critic|guard|checkfacts|kit\.sh|json|brief\.md|facts\.md|audit\.md|context\.md|first-look\.md|checkers?|judge|lp-[a-z-]+|wave \d|step \d|stage \d|harness|rivals?)\b/i;
// The AI register Stewart calls slop (site-copy skill, rule 7) and the em dash (rule 8).
const AI_WORDS = /\b(delve|leverage|utili[sz]e|robust|seamless(ly)?|holistic|streamline|empower|elevate|actionable|best practices|landscape|unlock|game-?changer|supercharge)\b/i;
const PERCENT_PROMISE = /\b\d{1,3}\s?%\s+(more|higher|better|increase|lift|uplift|boost)/i;
const banned = (text, where) => {
  const f = []; const t = text.replace(/`[^`]*`/g, '');
  const i = t.match(INTERNAL); if (i) f.push(`${where} uses "${i[0]}", a word about how the kit works. The owner sees only their business: say what you found, never who or what found it.`);
  const a = t.match(AI_WORDS); if (a) f.push(`${where} uses "${a[0]}", a word that reads as AI-written. Say it the way the owner would on a call.`);
  if (/—/.test(t)) f.push(`${where} has an em dash. Use a spaced hyphen ( - ) or two sentences.`);
  if (PERCENT_PROMISE.test(t)) f.push(`${where} promises a percentage gain ("${t.match(PERCENT_PROMISE)[0]}"). Never promise a number we cannot prove: say what the buyer gets instead.`);
  return f;
};

// Everything the business itself says: their pages, late-loading parts, the capture facts, the owner's words.
const known = (W, own) => {
  let s = ''; const IN = path.join(W, 'inputs');
  for (const d of [IN, path.join(IN, 'pages'), path.join(IN, 'proof')]) for (const f of fs.existsSync(d) ? fs.readdirSync(d) : []) if (/\.md$/.test(f)) s += read(d, f) + '\n';
  for (const f of ['live-parts.json', 'inputs/site-facts.json', 'facts.md', 'ads.md', 'owner.md', ...(own ? [] : ['context.md'])]) s += read(W, f) + '\n';
  // own: only what the business and the owner said. The audit agents' suggestions are not proof of a promise.
  const A = path.join(W, 'audit'); if (!own) for (const f of fs.existsSync(A) ? fs.readdirSync(A) : []) if (/\.json$/.test(f)) s += read(A, f) + '\n';
  return norm(s);
};
// A figure ($ price, %, count, time, years, rating) that is nowhere in what they or the audit said is invented
// (agency test 26 Nov: builders invented figures that only the critic caught; Vooba 26 Nov: "one number").
const stray = (W, text) => {
  const k = known(W).replace(/,/g, ''); const out = new Set();
  const t = text.replace(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g, ' ');
  for (const m of t.matchAll(/(?:[$£€]\s?\d[\d,.]*\s?[kKmM]?|\b\d[\d,.]*\s?(?:%|\+|stars?|years?|minutes?|mins?|hours?|days?|weeks?|months?|reviews?|ratings?|customers?|patients?|clients?|jobs|homes|locations|offices))/g)) {
    const d = m[0].replace(/[^\d.]/g, '').replace(/\.$/, ''); if (!d || +d <= 3) continue;
    if (!new RegExp(`(^|[^\\d.])${d.replace(/\./g, '\\.')}(?![\\d])`).test(k)) out.add(m[0].trim());
  }
  return [...out];
};
const siteQuotes = (W, text, where) => {
  const site = known(W).replace(/[^a-z0-9$%'. -]+/g, ' ').replace(/\s+/g, ' ');
  // Quotes on a "Fix:" line or under "Change to" are new words, not their words (run 11 false alarm).
  const theirs = text.split('\n').filter(l => !/^\s*(Fix:|\*\*Change to|Change to|- \*\*Change)/i.test(l)).join('\n').replace(/\*\*/g, '');
  const qs = []; for (const line of theirs.split('\n')) { const seg = line.replace(/[“”]/g, '"').split('"'); for (let i = 1; i < seg.length; i += 2) if (/^[A-Za-z0-9$]/.test(seg[i]) && seg[i].length >= 10 && seg[i].length <= 200) qs.push(seg[i]); }
  return qs.filter(q => {
    const parts = q.split(/\s*(?:\.\.\.|…)\s*/).map(p => norm(p).replace(/[^a-z0-9$%'. -]+/g, ' ').replace(/\s+/g, ' ').trim()).filter(p => p.length >= 8);
    return parts.length && !parts.every(p => site.includes(p));
  }).slice(0, 5).map(q => `${where} quotes "${q.slice(0, 90)}", which is not on their site word for word. Copy their exact words, or drop the quote marks and say it plainly.`);
};

const G = {};

// first-look.md. Runs 5 and 8 never sent it; run 11 dropped it. Stewart 26 Nov: "never talks like a high level
// strategist", so line 1 is the big picture, and the 3 items quote their page.
G['first-look'] = W => {
  const md = read(W, 'first-look.md'); const f = [];
  const big = (md.match(/^\s*Big picture:\s*(.+)$/mi) || [])[1] || '';
  if (!big) f.push('first-look.md has no "Big picture: " line at the top. Write one or two sentences: who clicks their ads, what that buyer must decide, and what this page does instead.');
  else if (words(big) > 55) f.push(`The big picture is ${words(big)} words. Keep it to one or two sentences, under 55 words.`);
  else if (sentences(big).length > 2) f.push('The big picture is more than 2 sentences. Cut it to the one idea that matters most.');
  const its = items(md);
  if (its.length !== 3) f.push(`first-look.md has ${its.length} numbered items. Write exactly 3, worst first.`);
  its.forEach((it, i) => {
    const label = (it.match(/^\d+\.\s+\*\*(.+?)\*\*/) || [])[1];
    if (!label) f.push(`Item ${i + 1} does not start with a bold label (1. **Label of 3 to 7 words**).`);
    else if (words(label) < 2 || words(label) > 8) f.push(`Item ${i + 1}'s label "${label}" is ${words(label)} words. Use 3 to 7.`);
    if (!/^\s*Fix:/mi.test(it)) f.push(`Item ${i + 1} has no line that starts "Fix:".`);
    const body = it.replace(/^\d+\.\s+\*\*.+?\*\*/, '').split(/^\s*Fix:/mi)[0];
    if (sentences(body).length > 3) f.push(`Item ${i + 1} explains in ${sentences(body).length} sentences. Use at most 2: what is on their page, and what it costs them.`);
  });
  return [...f, ...banned(md, 'The first look'), ...siteQuotes(W, md, 'The first look'), ...stray(W, md).slice(0, 3).map(n => `The first look says "${n}", a figure that is not on their site. Use their real figure or cut it.`)];
};

// context.md: the audit screen shows these headings word for word (1-audit.md part 3).
G.context = W => {
  const md = read(W, 'context.md'); const f = [];
  for (const h of ['What they sell', 'Who buys', 'Where they work', 'What a win is', 'Where visitors come from', 'Competitors'])
    if (!new RegExp(`^##\\s+${h}\\s*$`, 'mi').test(md)) f.push(`context.md has no "## ${h}" heading, word for word.`);
  const win = section(md, 'What a win is');
  if (win && !/\b(purchase|quote_request|lead_form|call|appointment_booking|demo_request|trial_signup|signup|application|download|donation)\b/.test(win)) f.push('Under "What a win is", write one of: purchase, quote_request, lead_form, call, appointment_booking, demo_request, trial_signup, signup, application, download, donation.');
  if (/\b(TODO|TBD|I think|I'll|note to self|maybe)\b/i.test(md)) f.push('context.md holds a note to yourself. The owner reads every line of it: keep only facts about their business.');
  return f;
};

// audit/*.json: an agent that crashed or ran out of turns leaves a broken file, and the audit screen breaks.
G['audit-files'] = W => {
  const A = path.join(W, 'audit'); const bad = [];
  for (const f of fs.existsSync(A) ? fs.readdirSync(A) : []) {
    if (!/\.json$/.test(f)) continue; const raw = read(A, f);
    let ok = false; try { const j = JSON.parse(raw); ok = j && typeof j === 'object' && raw.length > 150; } catch (e) {}
    if (!ok) bad.push(f);
  }
  return bad;
};

// audit.md. Stewart 26 Nov: the "3 fixes" were micro fixes; the diagnosis and the plan come first, as a strategist.
const MICRO = /\b(button|badge|icon|font|colou?r|typo|spelling|link|label|word|wording|tagline|logo size|alt text|favicon|bold)\b/i;
const BIG = /\b(page|first screen|section|offer|proof|structure|layout|design|form|headline down|whole|journey|one job|every|order|story|case)\b/i;
G.audit = W => {
  const md = read(W, 'audit.md'); const f = [];
  const dx = section(md, 'The diagnosis'); const plan = section(md, 'The plan for your new page');
  if (!dx) f.push('audit.md has no "## The diagnosis" section.');
  else {
    if (/^\s*[-*\d]+[.)]?\s/m.test(dx)) f.push('The diagnosis uses bullets or a list. Write 3 to 4 plain sentences, like a strategist talking on a call.');
    const n = sentences(dx).length; if (n < 3 || n > 5) f.push(`The diagnosis is ${n} sentences. Write 3 to 4: the page's job and the buyer's state, what it does instead, and what that costs against the best competitor.`);
    if (words(dx) > 150) f.push(`The diagnosis is ${words(dx)} words. Keep it under 150: one strong idea, not a summary of every finding.`);
    if (!/["“][^"”]{6,}["”]|\b(headline|first screen|button|form|hero|menu)\b/i.test(dx)) f.push('The diagnosis names no real detail from their page. Quote one line from their page or name the part, so the owner sees it is about their page.');
  }
  const moves = items(plan);
  if (moves.length !== 3) f.push(`The plan has ${moves.length} numbered moves. Write exactly 3, strongest first.`);
  moves.forEach((m, i) => {
    if (words(m) < 14) f.push(`Plan move ${i + 1} is only ${words(m)} words. Each move says what the new page does and which part of the diagnosis it answers.`);
    if (MICRO.test(m) && !BIG.test(m)) f.push(`Plan move ${i + 1} ("${m.slice(3, 80)}") is a small fix. A move is a change to the whole page: its structure, its offer, its proof or its design. Put small fixes under "What to fix first".`);
  });
  if (!/\*\*Verdict:\*\*\s*\S/.test(md)) f.push('audit.md has no "**Verdict:** " line. Add one line at the top: the page in one plain sentence, as you would say it to the owner.');
  if (!/\*\*Now:?\*\*|Now:/.test(md) || !/Change to/.test(md)) f.push('audit.md has no "What to fix first" list with Now and Change to lines.');
  f.push(...banned(dx + '\n' + plan, 'The diagnosis and the plan'));
  f.push(...stray(W, dx + '\n' + plan).slice(0, 4).map(n => `The diagnosis or the plan says "${n}", a figure that is nowhere in their pages or the audit. Use a real figure or cut it.`));
  let cf = ''; try { execFileSync(process.execPath, [path.join(__dirname, 'checkfacts.cjs'), W, 'facts.md'], { encoding: 'utf8' }); } catch (e) { cf = String(e.stdout || ''); }
  cf.split('\n').filter(l => /^NOT ON THEIR SITE/.test(l)).slice(0, 4).forEach(l => f.push(`facts.md: ${l}`));
  // Proof was the weakest score in the blind judge on 27 Nov (kit 6.3 of 10). The hunt is not optional.
  const facts = read(W, 'facts.md'); const proof = (facts.split(/^## Proof[ \t]*$/m)[1] || '').split(/^## /m)[0];
  const proofItems = proof.split('\n').filter(l => /^\s*[-*\d]/.test(l) && /(https?:\/\/|inputs\/)/.test(l));
  const searched = (proof.match(/^Searched:(.*)$/m) || [])[1] || '';
  const saved = fs.existsSync(path.join(W, 'inputs', 'proof')) ? fs.readdirSync(path.join(W, 'inputs', 'proof')).filter(x => x.endsWith('.md')).length : 0;
  if (!proof.trim()) f.push('facts.md has no "## Proof" section. Run the proof hunt in KIT/steps/1-audit.md part 5 first: their testimonial, case study and about pages, their Google reviews, Yelp, BBB, Houzz or Trustpilot, trade bodies, maker certifications, awards, named clients and press.');
  else if (proofItems.length < 5 && searched.split(',').filter(x => x.trim()).length < 6) f.push(`facts.md "## Proof" lists ${proofItems.length} items with a source. Find at least 5 (a named review, a review count, a certification, an award, a named client or project), each with its source, or list the 6 places you searched on a "Searched:" line.`);
  if (proof.trim() && !saved && /https?:\/\//.test(proof)) f.push('facts.md "## Proof" cites outside pages, but inputs/proof/ is empty. Save the text of each page you used to inputs/proof/<name>.md, first line "Source: <url>", so each quote can be checked word for word.');
  return f;
};

// directions/choice.md, read by lookready.cjs (2-directions.md part 3).
G.choice = W => {
  const c = read(W, 'directions/choice.md'); const f = [];
  if (!/^Style \d+, [^\s]+\./.test(c.trim())) f.push('directions/choice.md must start "Style <number>, <domain>." (the style from the board), then one sentence on how their page takes that look.');
  return [...f, ...banned(c, 'choice.md')];
};

// plan.md: the build must carry out the audit's 3 moves (blind-4: "page skipped 3 audit fixes"), and the case check ran.
const content = s => new Set((norm(s).match(/[a-z]{5,}/g) || []).filter(w => !/^(their|there|which|where|about|every|these|those|would|could|should|before|after|first|other|thing|page's|while)$/.test(w)));
G.plan = W => {
  const p = read(W, 'plan.md'); const f = []; const pw = content(p);
  items(section(read(W, 'audit.md'), 'The plan for your new page')).forEach((m, i) => {
    const mw = [...content(m)]; const hit = mw.filter(w => pw.has(w)).length;
    if (mw.length && hit / mw.length < 0.3) f.push(`plan.md does not carry out move ${i + 1} of the audit's plan ("${m.slice(3, 90)}"). Say which section of the page does it.`);
  });
  if (!/Case check:\s*(VERDICT )?READY/i.test(p)) f.push('plan.md has no line "Case check: READY". Run the case check (a fresh subagent, the prompt in 4-review.md), fix plan.md for each point you agree with, then add that line.');
  return f;
};

// page.html, on top of the guard: the phone number (blind-4's best catch was a phone mismatch), invented figures
// and quotes (checkfacts), and every width from 320 to 2560 (Stewart: "sweep every width, not a few breakpoints").
G.page = async W => {
  const f = []; const html = read(W, 'page.html');
  const sf = json(W, 'inputs/site-facts.json') || {}; const theirs = new Set([...(sf.phones || []), ...((sf.phone_numbers || []).map(p => p.digits))].map(d => String(d).replace(/\D/g, '').slice(-10)));
  const extra = (read(W, 'facts.md') + read(W, 'ads.md') + read(W, 'owner.md')).replace(/\D+/g, ' ');
  const nums = new Set([...html.matchAll(/tel:([+\d\s().-]{7,})/g), ...html.replace(/<[^>]+>/g, ' ').matchAll(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g)].map(m => (m[1] || m[0]).replace(/\D/g, '').slice(-10)).filter(d => d.length === 10));
  for (const d of nums) if (theirs.size && !theirs.has(d) && !extra.includes(d)) f.push(`page.html shows the phone number ${d}, which is not on their site or in facts.md. Use their real number: ${[...theirs].join(' or ')}.`);
  if (theirs.size && !nums.size && /call/i.test(read(W, 'context.md'))) f.push('page.html shows no phone number, but calls are a win for this business. Put their number in the header and the first screen as a tel: link.');
  let cf = ''; try { cf = execFileSync(process.execPath, [path.join(__dirname, 'checkfacts.cjs'), W, 'page.html'], { encoding: 'utf8' }); } catch (e) { cf = String(e.stdout || ''); }
  const lines = cf.split('\n'); let mode = '';
  for (const l of lines) {
    if (/^NOT ON THEIR SITE/.test(l)) f.push(l.replace('NOT ON THEIR SITE (page.html)', 'page.html quotes a line that is not on their site'));
    if (/^NUMBERS NOT IN THEIR WORDS/.test(l)) mode = 'num'; else if (/^[A-Z ]{8,}/.test(l)) mode = '';
    else if (mode === 'num' && /^\s*[-•]?\s*\S/.test(l) && f.length < 14) f.push(`page.html shows the figure ${l.trim().replace(/^[-•]\s*/, '')}, which is not on their site or in facts.md. Use their real figure or cut it.`);
  }
  // Promises a buyer relies on. The postclick rule: never add "free", a guarantee, a rating or a result the source does not confirm.
  const vis = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const k = known(W, true);
  for (const [re, say] of [[/\bfree\b/i, 'free'], [/\bguarantee[sd]?\b/i, 'a guarantee'], [/\bwarrant(y|ies)\b/i, 'a warranty'], [/\b24\s?\/\s?7\b/, '24/7'], [/\bsame[- ]day\b/i, 'same day'], [/\b(licen[sc]ed|insured|bonded)\b/i, 'licensed or insured'], [/\baward[- ]winning\b/i, 'award-winning'], [/\bno[\s-]+obligations?\b|\bobligation[\s-]+free\b|\bwithout (any )?obligations?\b/i, 'no obligation']])
    if (re.test(vis) && !re.test(k)) f.push(`page.html promises ${say}, which their site and facts.md never say. Cut it, or get the owner to confirm it first.`);
  try {
    const { chromium } = require('playwright'); const b = await chromium.launch(); const p = await b.newPage();
    const errs = []; p.on('pageerror', e => errs.push(String(e.message || e).slice(0, 100)));
    await p.route(/googletagmanager|google-analytics|googleadservices|doubleclick|facebook\.net/, r => r.abort());
    await p.goto('file://' + path.join(W, 'page.html'), { waitUntil: 'load', timeout: 30000 }).catch(() => {});
    const wide = [];
    for (const w of [320, 360, 390, 414, 768, 1024, 1280, 1440, 1710, 1920, 2560]) {
      await p.setViewportSize({ width: w, height: 900 }); await p.waitForTimeout(150);
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 2) wide.push(`${w} px (${o} px too wide)`);
    }
    const blank = await p.evaluate(() => document.body.innerText.trim().length < 200);
    await b.close();
    if (errs.length) f.push(`page.html throws a script error in the browser: ${errs[0]}. Fix it: a broken script can hide a form or a menu.`);
    if (blank) f.push('page.html shows almost no text in the browser. Check the page renders.');
    if (wide.length) f.push(`page.html scrolls sideways at ${wide.join(', ')}. Find the element wider than the screen and let it shrink or wrap.`);
  } catch (e) { if (process.env.GATES_DEBUG) console.error('sweep did not run:', e.message); }
  return f;
};

// The critic's files: a bad scores.json made the review screen show no scores (26 Nov).
G.scores = (W, n) => {
  const s = json(W, `r${n}/scores.json`); const f = [];
  const ok = a => Array.isArray(a) && a.length === 6 && a.every(x => typeof x === 'number' && x >= 0 && x <= 10);
  if (!s || !ok(s.live) || !ok(s.new)) f.push(`r${n}/scores.json must be {"live": [6 numbers], "new": [6 numbers]}, each 0 to 10, in the order first screen, case, proof, offer, action, craft.`);
  const v = read(W, `r${n}/verdict.md`);
  if (!v) f.push(`r${n}/verdict.md is missing.`); else if (!/^\s*1\.\s+\*\*/m.test(v) && !(s && s.new && s.new.every(x => x >= 9))) f.push(`r${n}/verdict.md has no numbered faults with bold labels (1. **Label.** sentence). The review screen lists these labels.`);
  return f;
};

// ready.md, read by review.cjs: an optional "Today:" line, then 3 numbered sentences (blind-8's best final message).
G.ready = W => {
  const r = read(W, 'ready.md'); const f = []; const its = items(r);
  if (its.length < 2 || its.length > 4) f.push(`ready.md has ${its.length} numbered sentences. Write 3: what the new page does differently, and why a buyer acts.`);
  its.forEach((it, i) => { if (words(it) > 55) f.push(`ready.md sentence ${i + 1} is ${words(it)} words. Keep each under 55.`); });
  return [...f, ...banned(r, 'ready.md'), ...stray(W, r).slice(0, 3).map(n => `ready.md says "${n}", a figure that is not on their site.`)];
};

module.exports = G;
if (require.main === module) (async () => {
  const W = path.resolve(process.argv[2] || '.'); const g = process.argv[3];
  if (!G[g]) { console.log(`Gates: ${Object.keys(G).join(', ')}`); process.exit(2); }
  const out = await G[g](W, process.argv[4] || 1); console.log(out.length ? out.map(x => '- ' + x).join('\n') : 'PASS'); process.exit(out.length ? 1 : 0);
})();
