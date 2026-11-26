// Reads the PreToolUse event on stdin. Prints "allow" only for the kit's own work.
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const KIT = path.join(ROOT, 'skills', 'landing-page', 'scripts', 'kit.sh');
let raw = ''; process.stdin.on('data', d => (raw += d)).on('end', () => {
  let e; try { e = JSON.parse(raw); } catch (_) { return; }
  const t = e.tool_input || {}; const cwd = e.cwd || process.cwd();
  const pages = path.resolve(cwd, 'landing-pages');
  const inside = (p, dir) => { if (!p) return false; const r = path.relative(dir, path.resolve(cwd, p)); return r === '' || (!r.startsWith('..') && !path.isAbsolute(r)); };
  let ok = false;
  if (e.tool_name === 'Bash') {
    const c = String(t.command || '').trim();
    // One kit command, no other command chained to it. Resolve the script path so
    // un-normalized paths from start/SKILL.md (.../start/../landing-page/scripts/kit.sh) match.
    const m = c.match(/^bash\s+(?:"([^"]+)"|'([^']+)'|([^\s"'`;&|<>]+))(?:\s+(.*))?$/);
    const script = m && (m[1] || m[2] || m[3]);
    const rest = (m && m[4]) || '';
    ok = !!script && path.resolve(cwd, script) === KIT && !/[;&|`<>]|\$\(/.test(rest);
    if (!ok) { const k = c.match(/^mkdir\s+-p\s+(["']?)([^;&|`<>$"']+)\1$/); ok = !!k && inside(k[2], pages); }
  } else if (['Write', 'Edit', 'MultiEdit'].includes(e.tool_name)) {
    ok = inside(t.file_path, pages);
  } else if (['Read', 'Glob', 'Grep'].includes(e.tool_name)) {
    const p = t.file_path || t.path;
    ok = inside(p, pages) || inside(p, ROOT);
  }
  if (ok) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow', permissionDecisionReason: 'Landing Page Kit: its own files and commands' } }));
});
