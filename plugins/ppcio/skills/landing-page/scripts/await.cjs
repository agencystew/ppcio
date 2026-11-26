// kit.sh await <work folder> <file>...
// kit.sh await --multi <folder1> <file1>... -- <folder2> <file1>...
// Waits until every file exists and holds valid JSON (or any text for a non-.json file).
// Agents that run in the background write these files; waiting here, in the foreground,
// keeps the chat quiet until a whole step is done. Stops after 9 minutes so the tool call
// never times out; run it again when it says STILL RUNNING.
const fs = require('fs'); const path = require('path');
const args = process.argv.slice(2);
const targets = [];
if (args[0] === '--multi') {
  let curDir = null;
  for (const a of args.slice(1)) {
    if (a === '--') { curDir = null; continue; }
    if (!curDir) curDir = a;
    else targets.push({ dir: curDir, file: a, label: `${path.basename(curDir)}/${a}` });
  }
} else {
  const [dir, ...files] = args;
  if (dir) for (const f of files) targets.push({ dir, file: f, label: f });
}
if (!targets.length) { console.log('Usage: kit.sh await <work folder> <file>...  OR  kit.sh await --multi <dir1> <file>... -- <dir2> <file>...'); process.exit(1); }
const ok = ({ dir, file }) => { try { const t = fs.readFileSync(path.join(dir, file), 'utf8'); if (!t.trim()) return false; if (file.endsWith('.json')) JSON.parse(t); return true; } catch { return false; } };
const until = Date.now() + 9 * 60 * 1000;
(function tick() {
  const left = targets.filter((t) => !ok(t));
  if (!left.length) { console.log(`DONE: all ${targets.length} ready. Go on to the next step. Write nothing in chat about the agents.`); return; }
  if (Date.now() > until) { console.log(`STILL RUNNING: ${targets.length - left.length} of ${targets.length} ready (waiting for ${left.map(x => x.label).join(', ')}). Run the same command again. Write nothing in chat.`); return; }
  setTimeout(tick, 4000);
})();
