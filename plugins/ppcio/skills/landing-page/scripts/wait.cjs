#!/usr/bin/env node
// node wait.cjs <project folder> [--port N]
// Waits until the owner presses a button in the PPC.io studio, then prints what
// they asked for and exits. Claude runs it in the background and acts on the
// words when it ends. The last ask read is kept in landing-pages/.asks-read.
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(process.argv[2] || '.');
const portArg = process.argv.indexOf('--port');
const PORT = portArg > 0 ? +process.argv[portArg + 1] : 4870;
const seenFile = path.join(root, 'landing-pages', '.asks-read');
const after = +(fs.existsSync(seenFile) ? fs.readFileSync(seenFile, 'utf8') : 0) || 0;

const WHAT = {
  build: (a) => `Build the new page for ${a.site}${a.text ? ` from the look "${a.text}"` : ''}. Follow the studio's build step.`,
  designs: (a) => `Draw new looks for ${a.site} (the studio's style board step).`,
  change: (a) => `Change the new page for ${a.site}${a.part ? `, in the part "${a.part}"` : ''}: "${a.text}". Make the change in page.html, render it, then run \`kit.sh wait\` again.`,
  wrong: (a) => `The owner says this finding in the ${a.site} audit is wrong: "${a.part}".${a.text ? ` Their note: "${a.text}".` : ''} Check it against their page. If they are right, remove it from its file in audit/ (the studio updates by itself) and say so in one line. If the page shows it is right, say what you see, kindly.`,
  fixed: (a) => `The owner says they already fixed this in the ${a.site} audit: "${a.part}". Remove it from its file in audit/ and say so in one line.`,
  live: (a) => `Get the new page for ${a.site} ready to go live: run the go-live step (pack the page, then say where the zip is and how to put it live).`,
};

// It keeps listening until a press comes, so an idle studio never wakes Claude (a "nobody pressed"
// message in chat is noise to the owner).
let fails = 0;
function listen(after) {
  const req = http.get({ host: '127.0.0.1', port: PORT, path: `/wait?after=${after}`, timeout: 26 * 60 * 1000 }, (res) => {
    let b = '';
    res.on('data', (c) => (b += c));
    res.on('end', () => {
      fails = 0;
      let j = { list: [], total: after };
      try { j = JSON.parse(b); } catch {}
      fs.writeFileSync(seenFile, String(j.total));
      if (!j.list.length) return listen(j.total);
      console.log('The owner pressed in the studio. Do this now, then run `kit.sh wait` again in the background:');
      for (const a of j.list) console.log('- ' + (WHAT[a.kind] || ((x) => JSON.stringify(x)))(a));
    });
  });
  req.on('timeout', () => req.destroy());
  req.on('error', () => {
    if (++fails > 10) { console.log('The studio stopped. Say nothing to the owner about it; start it again with `kit.sh view` the next time you show them something.'); process.exit(3); }
    setTimeout(() => listen(after), 30000);
  });
}
listen(after);
