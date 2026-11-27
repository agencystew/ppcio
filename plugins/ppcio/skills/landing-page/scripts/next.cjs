// kit.sh next <site>: the harness. It reads landing-pages/<site>/ and prints the ONE next step.
// Stewart, 26 Nov: "loop, graph and harness". The loop: every step's file must pass its check (gates.cjs) before
// the run moves on, and the review repeats until a fresh critic scores the page at the bar. The graph: the order
// below, with the agents of each audit wave started together. The harness: the log, stuck detection, rollback to
// the best round, and a memory on this computer of the faults each step most often makes.
// Why: in runs 1 to 11 the model read long rule files and every run broke a different rule. In every run it obeyed
// what a tool printed. So the order and the bar live here, in code.
//   kit.sh next <site>           the next step
//   kit.sh next <site> --status  the steps so far, with minutes (for tests)
const fs = require('fs'); const path = require('path'); const os = require('os'); const { execFileSync } = require('child_process');
const gates = require('./gates.cjs');
const site = (process.argv[2] || '').replace(/\/$/, '').split('/').pop();
const W = path.resolve('landing-pages', site || '');
if (!site || !fs.existsSync(W)) { console.log(`Usage: kit.sh next <site>. Make landing-pages/<site>/ first, then capture their page:\n  bash KIT/scripts/kit.sh capture <url> landing-pages/<site>`); process.exit(1); }
const kit = 'bash KIT/scripts/kit.sh';
const has = f => fs.existsSync(path.join(W, f));
const read = f => { try { return fs.readFileSync(path.join(W, f), 'utf8'); } catch (e) { return ''; } };
const json = f => { try { return JSON.parse(read(f)); } catch (e) { return null; } };
const newer = (a, b) => has(a) && has(b) && fs.statSync(path.join(W, a)).mtimeMs > fs.statSync(path.join(W, b)).mtimeMs;
const agency = fs.existsSync(path.join(W, '..', 'batch.md'));

// The log: one line per call, so the harness sees a step that keeps failing, and a test sees the minutes.
const H = path.join(W, '.harness'); fs.mkdirSync(H, { recursive: true }); const LOG = path.join(H, 'log.jsonl');
const log = (() => { try { return fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse); } catch (e) { return []; } })();
if (process.argv.includes('--status')) {
  const t0 = log.length ? log[0].t : Date.now(); let last = '';
  for (const e of log) { if (e.key !== last) console.log(`${String(Math.round((e.t - t0) / 60000)).padStart(3)} min  ${e.stage}: ${e.key}${e.faults ? ` (${e.faults} faults)` : ''}`); last = e.key; }
  process.exit(0);
}
const streak = key => { let n = 0; for (let i = log.length - 1; i >= 0 && log[i].key === key; i--) n++; return n; };

// The memory on this computer: which faults each check finds most often. Every next run of this step is told,
// so the model writes it right the first time. The longer the kit runs here, the fewer rounds each step takes.
const MEM = path.join(process.env.PPCIO_MEMORY_DIR || path.join(os.homedir(), ".ppcio"), 'harness-memory.json');
const mem = (() => { try { return JSON.parse(fs.readFileSync(MEM, 'utf8')); } catch (e) { return {}; } })();
const remember = (gate, faults) => {
  if (!faults.length || streak(`fix:${gate}`) > 0) return; // count each fault once per run, not on every retry
  const g = mem[gate] = mem[gate] || {};
  for (const f of faults) { const k = f.replace(/"[^"]{25,}"/g, '"..."').replace(/\d+/g, 'N').split(/\.\s|\.$/)[0].slice(0, 120); g[k] = (g[k] || 0) + 1; }
  try { fs.mkdirSync(path.dirname(MEM), { recursive: true }); fs.writeFileSync(MEM, JSON.stringify(mem, null, 1)); } catch (e) {}
};
const often = gate => Object.entries(mem[gate] || {}).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);

const QUIET = 'Write nothing in chat for this step. Only text a tool prints under MESSAGE TO SEND NOW goes to chat.';
const AGAIN = `When it is done, run ${kit} next ${site}.`;
const say = (stage, key, step, how, opts = {}) => {
  const n = streak(key) + 1;
  fs.appendFileSync(LOG, JSON.stringify({ t: Date.now(), stage, key, faults: (opts.faults || []).length }) + '\n');
  const out = [`STAGE: ${stage}`, `NEXT: ${step}`];
  if (opts.faults && opts.faults.length) out.push('FIX THESE, then run next again:', ...opts.faults.slice(0, 12).map(f => '- ' + f));
  if (how) out.push(`HOW: ${how}`);
  const o = opts.gate ? often(opts.gate) : []; if (o.length && !(opts.faults || []).length) out.push(`On this computer, this step most often goes wrong on: ${o.join('; ')}. Get these right the first time.`);
  if (n >= 3) out.push(`STUCK: this is try ${n} at this step. Change the approach, not the details: read the HOW part again and rewrite the file from the start${opts.agents ? ', or start any agent whose file is still missing again, on its own' : ''}.`);
  out.push(QUIET, AGAIN); console.log(out.join('\n')); process.exit(0);
};
// A check on a step's own file. Soft checks (layout of a file) let the run go on after 4 tries, so a format rule can
// never trap a buyer; a fact check (an invented quote, figure, phone number or promise) never lets go.
const FACT = /not on their site|a figure|the figure|phone number|promises|how the kit works|percentage/i;
const check = async (gate, file, stage, fixHow, soft = true, arg) => {
  let faults = await gates[gate](W, arg); if (!faults.length) return;
  const key = `fix:${gate}`;
  if (streak(key) >= 4) { if (soft) return; faults = faults.filter(f => FACT.test(f)); if (!faults.length) return; }
  remember(gate, faults);
  say(stage, key, `${file} does not pass its check yet.`, fixHow, { faults, gate });
};
const agents = (names, outs) => `Run ${kit} brief ${site}. Then start ${names.join(', ')} in ONE message (the Agent tool; let them run while you wait). Tell each: "Work folder: ${W}. Read audit/brief.md and the 2 screenshots in your first turn, then write your file in one Write call." Then run ${kit} await landing-pages/${site} ${outs.join(' ')} in the same message (timeout 600000 ms; when it prints STILL RUNNING, run it again and write nothing). In apps without subagents, find the expert prompts via ${kit} agents-dir, do each one yourself in order, and skip ${kit} await.`;

(async () => {
  // Stage 1: the first look (start/SKILL.md part 3). Runs 5, 8 and 11 lost it; Stewart: "talk like a strategist".
  if (!has('inputs/site-facts.json')) say('first look', 'capture', `Capture their page: ${kit} capture <their url> landing-pages/${site}. When it prints NOT CAPTURED, send the one short message start/SKILL.md gives for a blocked site.`);
  if (!has('first-look.md')) say('first look', 'write:first-look', `Open inputs/live-phone-today.png and inputs/live-page-today.png, read inputs/site-page-text.md, then write first-look.md.`,
    `Line 1: "Big picture: " and one or two sentences, said like a senior strategist: who clicks their ads, what that buyer must decide, and what this page does instead. Then 3 numbered items, worst first: a bold label of 3 to 7 words, at most 2 sentences that quote their page word for word and say what it costs them, then a line "Fix: ...". Never invent a number, a review or a result.`, { gate: 'first-look' });
  await check('first-look', 'first-look.md', 'first look', 'Edit first-look.md for each line above. A quote must be their exact words from inputs/site-page-text.md.', false);
  if (!has('.first-look-sent') && !agency) say('first look', 'send:first-look', `Run ${kit} view ${site} (or ${kit} firstlook ${site} if your app does not keep background servers running). It prints the first look under MESSAGE TO SEND NOW: send it as your very next chat message, word for word.`);

  // Stage 2: the audit, as a graph of agents in 2 waves.
  if (!has('context.md')) say('audit', 'write:context', `Capture 2 competitors into competitors/, then write context.md and run ${kit} checkfacts landing-pages/${site} context.md.`, `KIT/steps/1-audit.md, parts 2 and 3.`, { gate: 'context' });
  await check('context', 'context.md', 'audit', 'KIT/steps/1-audit.md, part 3.');
  // A crashed agent leaves a broken file. Move it aside, so the step below starts only that agent again.
  for (const f of await gates['audit-files'](W)) { try { fs.renameSync(path.join(W, 'audit', f), path.join(W, 'audit', f + '.broken')); } catch (e) {} }
  const comps = has('competitors') ? fs.readdirSync(path.join(W, 'competitors')).filter(d => fs.statSync(path.join(W, 'competitors', d)).isDirectory()) : [];
  const w1 = [['lp-buyers', 'audit/buyers.json'], ...(comps.length ? [['lp-competitors', 'audit/competitive.json']] : [])].filter(([, f]) => !has(f));
  if (w1.length) say('audit', 'agents:1', agents(w1.map(x => x[0]), w1.map(x => x[1])), comps.length ? `In the lp-competitors task, name each folder in competitors/ (${comps.join(', ')}).` : '', { agents: true });
  const paid = has('ads.md') || /\b(ads|ppc|paid|google|adwords|cpc)\b/i.test(read('context.md').split(/^## Where visitors come from/mi)[1] || '');
  const w2 = [['lp-buyer-journey (task "persona 1, write audit/journey-1.json")', 'audit/journey-1.json'], ['lp-buyer-journey (task "persona 2, write audit/journey-2.json")', 'audit/journey-2.json'],
    ...['leaks', 'actions', 'offer', 'forensics', 'trust', 'anatomy', 'psych', 'design'].map(k => [`lp-${k}`, `audit/${k}.json`]), ...(paid ? [['lp-ad-match', 'audit/ad-match.json']] : [])].filter(([, f]) => !has(f));
  if (w2.length) say('audit', 'agents:2', agents(w2.map(x => x[0]), w2.map(x => x[1])), '', { agents: true });
  if (!has('audit/copy.json')) say('audit', 'agents:3', agents(['lp-copy'], ['audit/copy.json']), '', { agents: true });
  if (!has('facts.md') || !has('audit.md')) say('audit', 'write:audit', `Check the team's work against the screenshots, then write facts.md and audit.md.`, `KIT/steps/1-audit.md, parts 5 and 6. audit.md opens with the verdict, "## The diagnosis" (3 to 4 sentences, as a senior strategist) and "## The plan for your new page" (exactly 3 moves, each a change to the whole page).`, { gate: 'audit' });
  await check('audit', 'audit.md', 'audit', 'KIT/steps/1-audit.md, part 6, "The diagnosis and the plan come first". Fix facts.md quotes word for word from the captured text.', false);
  if (!has('audit.html') || newer('audit.md', 'audit.html') || (!has('.audit-sent') && !agency)) say('audit', 'send:audit', `Run ${kit} report landing-pages/${site}. It prints the audit-done message under MESSAGE TO SEND NOW: send it as your very next chat message, word for word. When it prints NOT DRAWN, fix those lines and run it again.`);

  // The new page comes with the licence.
  let licence = ''; try { licence = execFileSync(process.execPath, [path.join(__dirname, 'licence.cjs'), 'status'], { encoding: 'utf8' }); } catch (e) {}
  if (/FREE/.test(licence)) { console.log(`STAGE: done (free)\nNEXT: Nothing. The new page comes with the PPC.io licence, and the audit-done message already said so. When they paste a key, run ${kit} unlock <key>, then ${kit} next ${site}.`); process.exit(0); }

  // Stage 3: the look. Run 9 built page.html first and faked the look, so the owner always sees it first.
  const notes = ['buyer.md', 'keep.md', 'case.md', 'brand.md'].filter(f => !has(f));
  const taste = path.join(path.dirname(MEM), 'taste.md');
  if (notes.length) say('look', 'write:notes', `Write ${notes.join(', ')}.`, `KIT/steps/3-build.md, steps 0 to 2. The audit's diagnosis and plan are the brief.${fs.existsSync(taste) ? ` Read ${taste} first: the changes owners on this computer asked for before.` : ''}`);
  if (!has('directions/styles.html')) say('look', 'board', `Run ${kit} library board landing-pages/${site}/directions/styles.html <niche> <words for what they sell>, open it, and pick the style that fits their buyer best.`, `KIT/steps/2-directions.md, part 2. Niches: ${kit} library niches.`);
  if (!has('directions/a.html') || !has('directions/choice.md')) say('look', 'write:look', `Build their first screen in the style you picked as directions/a.html. Render it (${kit} shot landing-pages/${site}/directions/a.html a, and again with phone), open both images, fix what looks wrong, then write directions/choice.md.`, `KIT/steps/2-directions.md, part 3.`, { gate: 'choice' });
  await check('choice', 'directions/choice.md', 'look', 'KIT/steps/2-directions.md, part 3.');
  if (!has('directions/.look-sent') && !agency) say('look', 'send:look', `Run ${kit} look ${site}. Send what it prints under MESSAGE TO SEND NOW as your very next chat message, word for word.`);

  // Stage 4: the build. Blind-4 skipped 3 of the audit's fixes, so plan.md must carry out the 3 moves.
  if (!has('plan.md')) say('build', 'write:plan', `Write plan.md. Then test it with the case check: a fresh subagent with the prompt in KIT/steps/4-review.md "The case check prompt", in the foreground. Fix plan.md for each point you agree with, and add the line "Case check: READY".`, `KIT/steps/3-build.md, steps 3 and 4.`, { gate: 'plan' });
  await check('plan', 'plan.md', 'build', 'KIT/steps/3-build.md, steps 3 and 4.');
  if (!has('page.html')) say('build', 'write:page', `Write page.html in the look of directions/a.html, carrying out the 3 moves of the audit's plan and every section of plan.md.`, `KIT/steps/3-build.md, step 5.`, { gate: 'page' });

  // The review loop. Cheap checks first (code), then the expensive judge (a fresh critic). Up to MAX rounds.
  const MAX = 5; const KEYS = ['first screen', 'case', 'proof', 'offer', 'action'];
  const avg = s => s && s.new ? s.new.reduce((a, b) => a + b, 0) / 5 : 0;
  const atBar = s => s && Array.isArray(s.new) && s.new.length === 5 && s.new.every((x, i) => x >= 8 && x >= ((s.live || [])[i] || 0));
  let n = 1; while (has(`r${n + 1}`)) n++;
  // pack rewrites page.html to point at local copies of the photos. That is the same page, not a new round: the
  // round keeps its score, and only the code checks run again (they catch a photo the copy broke).
  if (log.length && log[log.length - 1].key === 'pack' && has(`${site}-page.zip`) && !newer('page.html', `${site}-page.zip`) && has(`r${n}/page.html`)) fs.copyFileSync(path.join(W, 'page.html'), path.join(W, `r${n}/page.html`));
  const fresh = !has(`r${n}/page.html`) || newer('page.html', `r${n}/page.html`); // page.html changed since round n was rendered
  const scored = has(`r${n}/scores.json`);
  if (scored && fresh) n++; // edits after round n's verdict: they become round n+1
  if (!has(`r${n}/first.png`) || !has(`r${n}-phone/first.png`) || (!has(`r${n}/scores.json`) && newer('page.html', `r${n}/page.html`)))
    say(`review, round ${n}`, `shot:${n}`, `Render round ${n}: ${kit} shot landing-pages/${site}/page.html ${n}, then ${kit} shot landing-pages/${site}/page.html ${n} phone. Open every image, phone first.`, `KIT/steps/4-review.md, part 1.`);
  // Code checks before the critic: the guard (40 checks on the rendered page) and the gate (phone, figures, quotes, promises, every width).
  // Both take about 30 seconds, so the result is kept until page.html changes.
  const CACHE = path.join(H, 'page-check.json'); const stamp = String(fs.statSync(path.join(W, 'page.html')).mtimeMs);
  let cached = null; try { cached = JSON.parse(fs.readFileSync(CACHE, 'utf8')); if (cached.stamp !== stamp) cached = null; } catch (e) {}
  if (!cached) {
    let guard = ''; try { guard = execFileSync('bash', [path.join(__dirname, 'kit.sh'), 'guard', path.join('landing-pages', site, 'page.html')], { encoding: 'utf8' }); } catch (e) { guard = String(e.stdout || ''); }
    cached = { stamp, g: guard.split('\n').filter(l => /^- /.test(l)).map(l => l.slice(2)), p: await gates.page(W) };
    fs.writeFileSync(CACHE, JSON.stringify(cached));
  }
  const gfaults = cached.g; const pfaults = cached.p;
  const hard = [...pfaults, ...gfaults];
  if (hard.length && !(streak(`fix:page:${n}`) >= 4 && !pfaults.length)) {
    remember('page', hard);
    say(`review, round ${n}`, `fix:page:${n}`, `Fix every line below as small edits to page.html. Then run ${kit} next ${site} again (it renders the round again).`, `KIT/steps/4-review.md, part 1. Never start a new layout: a fix changes the part that is wrong and nothing else.`, { faults: hard, gate: 'page' });
  }
  // After the page is sent, a change is the owner's own ask: render it and run the code checks, but no critic and
  // no rollback, so their change always stays.
  const ownerRound = has('.page-sent');
  if (!ownerRound) {
  if (!has(`r${n}/scores.json`)) say(`review, round ${n}`, `critic:${n}`, `Run the critic on round ${n}: a FRESH subagent (never one that saw an earlier round), in the foreground, with the prompt in KIT/steps/4-review.md "The critic prompt" and the r${n}/ and r${n}-phone/ images. Write its scores to r${n}/scores.json and its faults to r${n}/verdict.md.`, `KIT/steps/4-review.md, part 2.${n > 1 ? ` Give it round ${n}'s images only. It must not know there was an earlier round.` : ''}`, { gate: 'scores' });
  await check('scores', `r${n}/scores.json`, `review, round ${n}`, 'KIT/steps/4-review.md, part 2.', true, n);

  const rounds = []; for (let i = 1; i <= n; i++) { const s = json(`r${i}/scores.json`); if (s && s.new) rounds.push({ i, s, a: avg(s) }); }
  const best = rounds.reduce((b, r) => (!b || r.a > b.a || (r.a === b.a && r.i > b.i) ? r : b), null);
  const cur = rounds[rounds.length - 1];
  // Rollback: a round that scores lower than the best one goes back to the best page (postclick rule: "never drop the visuals he liked").
  if (best && cur.i !== best.i && cur.a < best.a - 0.1 && has(`r${best.i}/page.html`) && !has(`r${cur.i}/.rolled-back`)) {
    fs.copyFileSync(path.join(W, `r${best.i}/page.html`), path.join(W, 'page.html')); fs.writeFileSync(path.join(W, `r${cur.i}/.rolled-back`), String(best.i));
    say(`review, round ${cur.i + 1}`, `rollback:${cur.i}`, `Round ${cur.i} scored ${cur.a.toFixed(1)}, below round ${best.i} (${best.a.toFixed(1)}), so page.html is back to round ${best.i}. Fix the faults in r${best.i}/verdict.md that round ${cur.i} did not fix, one small edit at a time, keeping everything round ${best.i} did well.`, `KIT/steps/4-review.md, part 3.`);
  }
  const stalled = rounds.length >= 3 && rounds.slice(-2).every(r => r.a <= rounds[rounds.length - 3].a + 0.1);
  if (!atBar(cur.s) && n < MAX && !stalled) {
    const low = KEYS.filter((k, i) => !(cur.s.new[i] >= 8 && cur.s.new[i] >= ((cur.s.live || [])[i] || 0)));
    say(`review, round ${n + 1} of up to ${MAX}`, `improve:${n}`, `The page is not at the bar yet: a fresh critic must score it 8 or more out of 10, and at least their page today, on each of first screen, case, proof, offer and action. Round ${n} is below on: ${low.join(', ')}. Fix every fault in r${n}/verdict.md, strongest first, as small edits to page.html. Then run ${kit} next ${site}.`, `KIT/steps/4-review.md, parts 2 and 3. Never start a new layout.`);
  }
  // The loop is over. Hand over the best round's page. Its time is set back, so it does not count as a new edit.
  if (best && best.i !== cur.i && cur.a < best.a && has(`r${best.i}/page.html`)) {
    const P = path.join(W, 'page.html'); fs.copyFileSync(path.join(W, `r${best.i}/page.html`), P);
    const t = (fs.statSync(path.join(W, `r${n}/page.html`)).mtimeMs - 1000) / 1000; fs.utimesSync(P, t, t);
  }
  }

  // Stage 5: hand it over.
  if (!has(`${site}-page.zip`) || newer('page.html', `${site}-page.zip`)) say('hand over', 'pack', `Run ${kit} pack landing-pages/${site} and check every photo still shows in live/index.html.`, `KIT/steps/5-go-live.md.`);
  if (!has('ready.md')) say('hand over', 'write:ready', `Write ready.md.`, `KIT/steps/4-review.md, part 5, item 2. Lead with the most useful real catch of the run (blind-4: "the truck shows a different phone number from the buttons").`, { gate: 'ready' });
  await check('ready', 'ready.md', 'hand over', 'KIT/steps/4-review.md, part 5, item 2.');
  if ((!has('.page-sent') || newer('page.html', '.page-sent')) && !agency) say('hand over', 'send:page', `Run ${kit} review landing-pages/${site}. Send what it prints under MESSAGE TO SEND NOW as your very next chat message, word for word, and attach page.html.`);
  console.log(`STAGE: done\nNEXT: Nothing. Keep ${kit} wait running in the background. When they ask for a change in the studio or the chat: add one line to ${taste} with what they asked, in their words (the next page on this computer reads it), and any fact they gave to landing-pages/${site}/owner.md. Make the change, then run ${kit} next ${site} again: it renders, checks, judges and sends the new page.`);
})();
