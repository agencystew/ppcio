// kit.sh brief <site>: one file that holds every text file an audit agent needs, each under its own heading.
// The audit agents read it with the 2 screenshots in their first turn, instead of 10 to 20 reads in 20 to 30
// turns, each with its own thinking (blind-8, 26 Nov: 60,000 to 95,000 output tokens per agent, most of it thinking).
const fs = require('fs'); const path = require('path');
const site = process.argv[2];
const dir = path.resolve('landing-pages', site || '');
if (!site || !fs.existsSync(dir)) { console.log('Usage: kit.sh brief <site>'); process.exit(1); }
// Run 10 went into the audit with no first look sent. The first look comes first, always.
if (!fs.existsSync(path.join(dir, '.first-look-sent')) && !fs.existsSync(path.join(dir, '..', 'batch.md'))) {
  console.log(`STOP: the owner has not had the first look. Write landing-pages/${site}/first-look.md (3 numbered items), run kit.sh view ${site} and send the message it prints. Then run kit.sh brief ${site} again.`); process.exit(5);
}
const read = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8').trim(); } catch (e) { return ''; } };
const cap = (s, n) => s.length > n ? s.slice(0, n) + `\n[... ${s.length - n} more characters in the file]` : s;
const parts = [];
const add = (f, n = 40000, note = '') => { const s = read(f); if (s) parts.push(`## ${f}${note ? ` (${note})` : ''}\n\n${cap(s, n)}`); };
add('context.md'); add('ads.md'); add('first-look.md', 4000, 'the first look already sent to the owner');
add('inputs/site-page-text.md'); add('inputs/site-page-text-phone.md');
add('inputs/site-facts.json'); add('live-parts.json'); add('craft.md'); add('inputs/photos.md');
add('audit/buyers.json'); add('audit/competitive.json');
let pages = []; try { pages = fs.readdirSync(path.join(dir, 'inputs/pages')).filter(f => f.endsWith('.md')); } catch (e) {}
for (const p of pages) add(`inputs/pages/${p}`, 3000, 'another of their pages');
let comps = []; try { comps = fs.readdirSync(path.join(dir, 'competitors')).filter(c => fs.statSync(path.join(dir, 'competitors', c)).isDirectory()); } catch (e) {}
const shots = ['inputs/live-page-today.png', 'inputs/live-phone-today.png', 'inputs/live-full.jpg', 'inputs/live-full-phone.jpg'].filter(f => fs.existsSync(path.join(dir, f)));
const head = `# Audit brief for ${site}\n\nEvery text file of the audit, in one place. Screenshots are images, so read them on their own: ${shots.map(s => path.join(dir, s)).join(', ')}.\nCompetitors captured: ${comps.length ? comps.map(c => `competitors/${c}/` + (fs.existsSync(path.join(dir, 'competitors', c, 'NOT-CAPTURED.txt')) ? ' (not captured)' : '')).join(', ') : 'none'}. Their text and screenshots are in those folders.`;
fs.mkdirSync(path.join(dir, 'audit'), { recursive: true });
// The Read tool shows 2,000 lines and cuts lines over 2,000 characters: wrap long lines, split into parts of 1,800 lines.
const lines = (parts.join('\n\n')).replace(/\n{3,}/g, '\n\n').split('\n').flatMap(l => l.length > 1800 ? l.match(/[\s\S]{1,1800}/g) : [l]);
const chunks = []; for (let i = 0; i < lines.length; i += 1800) chunks.push(lines.slice(i, i + 1800));
for (const f of fs.readdirSync(path.join(dir, 'audit')).filter(f => /^brief(-\d)?\.md$/.test(f))) fs.unlinkSync(path.join(dir, 'audit', f));
const names = chunks.map((c, i) => path.join(dir, 'audit', i ? `brief-${i + 1}.md` : 'brief.md'));
const partsNote = names.length > 1 ? `\nThis brief has ${names.length} parts. Read all of them: ${names.join(', ')}.` : '';
chunks.forEach((c, i) => fs.writeFileSync(names[i], (i ? '' : head + partsNote + '\n\n') + c.join('\n') + '\n'));
console.log(`Wrote ${names.join(' and ')}: ${parts.length} files, ${Math.round(lines.join('\n').length / 1000)} KB. Now start this step's agents and, in the same message, run kit.sh await (in apps without subagents, do the experts yourself and skip kit.sh await). Write nothing in chat: the owner already has the studio link, which shows the progress. If the app asks you for an update, send only this line: Still working on it. The studio link above shows the progress live.`);
