// Reads the PreToolUse event on stdin. Prints "allow" only for the kit's own work.
const fs = require('fs');
const os = require('os');
const path = require('path');
const real = (p) => {
  let cur = path.resolve(p);
  const tail = [];
  while (true) {
    try { return path.join(fs.realpathSync(cur), ...tail.reverse()); } catch (_) {}
    const parent = path.dirname(cur);
    if (parent === cur) return path.resolve(p);
    tail.push(path.basename(cur));
    cur = parent;
  }
};
const ROOT = real(path.resolve(__dirname, '..'));
const KIT = real(path.join(ROOT, 'skills', 'landing-page', 'scripts', 'kit.sh'));
const PPCIO_LIB = real(path.join(process.env.PPCIO_HOME || path.join(os.homedir(), '.ppcio'), 'library'));
let raw = ''; process.stdin.on('data', d => (raw += d)).on('end', () => {
  let e; try { e = JSON.parse(raw); } catch (_) { return; }
  const t = e.tool_input || {}; const cwd = real(e.cwd || process.cwd());
  const pages = path.resolve(cwd, 'landing-pages');
  const inside = (p, dir) => {
    if (!p) return false;
    const resolved = path.resolve(cwd, p);
    const r = path.relative(dir, resolved);
    if (r === '' || (!r.startsWith('..') && !path.isAbsolute(r))) return true;
    const rReal = path.relative(real(dir), real(resolved));
    return rReal === '' || (!rReal.startsWith('..') && !path.isAbsolute(rReal));
  };
  // Strip safely quoted arguments (e.g. "https://site.com/?utm_source=google&utm_medium=cpc")
  // before testing for shell chaining/redirection metacharacters.
  const isSafeArgs = (rest) => {
    if (/[\r\n]/.test(rest)) return false;
    let unquoted = '';
    for (let i = 0; i < rest.length; i++) {
      const ch = rest[i];
      if (ch === "'") {
        const end = rest.indexOf("'", i + 1);
        if (end < 0) return false;
        i = end;
      } else if (ch === '"') {
        let j = i + 1, inner = '';
        while (j < rest.length && rest[j] !== '"') {
          if (rest[j] === '\\' && j + 1 < rest.length) { inner += rest[j + 1]; j += 2; continue; }
          inner += rest[j++];
        }
        if (j >= rest.length) return false;
        if (/`|\$\(/.test(inner)) return false;
        i = j;
      } else {
        unquoted += ch;
      }
    }
    return !/[;&|`<>]|\$\(/.test(unquoted);
  };
  let ok = false;
  if (e.tool_name === 'Bash') {
    const c = String(t.command || '').trim();
    // 1. One kit.sh command, no other command chained to it.
    const m = c.match(/^bash\s+(?:"([^"]+)"|'([^']+)'|([^\s"'`;&|<>]+))(?:\s+(.*))?$/);
    const script = m && (m[1] || m[2] || m[3]);
    const rest = (m && m[4]) || '';
    ok = !!script && real(path.resolve(cwd, script)) === KIT && isSafeArgs(rest);
    // 2. Python scripts bundled inside this plugin's own skills/*/scripts/*.py
    if (!ok) {
      const pm = c.match(/^python3?\s+(?:"([^"]+)"|'([^']+)'|([^\s"'`;&|<>]+))(?:\s+(.*))?$/);
      const pyScript = pm && (pm[1] || pm[2] || pm[3]);
      const pyRest = (pm && pm[4]) || '';
      if (pyScript && /\.py$/i.test(pyScript) && isSafeArgs(pyRest)) {
        const resolvedPy = real(path.resolve(cwd, pyScript));
        ok = inside(resolvedPy, path.join(ROOT, 'skills')) && resolvedPy.includes(`${path.sep}scripts${path.sep}`);
      }
    }
    if (!ok) { const k = c.match(/^mkdir\s+-p\s+(["']?)([^;&|`<>$"'\r\n]+)\1$/); ok = !!k && inside(k[2], pages); }
  } else if (['Write', 'Edit', 'MultiEdit'].includes(e.tool_name)) {
    ok = inside(t.file_path, pages);
  } else if (['Read', 'Glob', 'Grep'].includes(e.tool_name)) {
    const p = t.file_path || t.path;
    ok = inside(p, pages) || inside(p, ROOT) || inside(p, PPCIO_LIB);
  }
  if (ok) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow', permissionDecisionReason: 'Landing Page Kit: its own files and commands' } }));
});
