// Prints the look-ready message, ready to send, so every run gives the buyer the same message.
// Reads landing-pages/<site>/directions/choice.md: line 1 "Style <n>, <domain>.", then one sentence on how
// their page takes the style, then up to 3 "- " lines on what the look does for their buyer.
const fs = require('fs'); const path = require('path');
const site = process.argv[2];
const dir = path.resolve('landing-pages', site || '', 'directions');
const read = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch (e) { return ''; } };
const choice = read('choice.md').trim();
if (!site || !choice || !fs.existsSync(path.join(dir, 'a.html'))) {
  console.log(`NEXT: build ${path.join(dir, 'a.html')} and write ${path.join(dir, 'choice.md')} (line 1 "Style <n>, <domain>.", then one sentence on how their page takes the style, then up to 3 "- " lines on what it does for their buyer). Then run kit.sh look ${site || '<site>'} again.`);
  process.exit(0);
}
const lines = choice.split('\n').map(l => l.trim()).filter(Boolean);
const domain = ((lines[0].match(/style\s*\d+\s*,\s*([^\s.]+(?:\.[^\s.]+)+)/i) || [])[1] || '').replace(/^www\./, '');
const rest = lines.slice(1);
const sentence = rest.find(l => !/^[-*]\s/.test(l) && !/^their words/i.test(l)) || '';
const points = rest.filter(l => /^[-*]\s+\S/.test(l)).slice(0, 3).map(l => `- ${l.replace(/^[-*]\s+/, '')}`);
const base = process.env.PPCIO_STUDIO ? `${process.env.PPCIO_STUDIO}/s/${site}/data/files/directions/` : dir + path.sep;
const msg = [
  `**Your page in its new look:** ${base}a.html`,
  `${domain ? `It takes its style from ${domain}. ` : ''}${sentence}`.trim(),
  points.join('\n'),
  fs.existsSync(path.join(dir, 'styles.html')) ? `The other styles are here: ${base}styles.html. Tell me the one you like better and I'll switch.` : '',
  'I\'m building the whole page in this look now. About 10 minutes.',
].filter(Boolean).join('\n\n');
fs.writeFileSync(path.join(dir, '.look-sent'), new Date().toISOString());
console.log(`MESSAGE TO SEND NOW. Send the text between the lines as your very next chat message, word for word, before any other tool call. Then, in this same turn, run kit.sh next <site> and do the step it prints, and write nothing else in chat until a tool prints the next MESSAGE TO SEND NOW.\n----\n${msg}\n----`);
