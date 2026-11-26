// node pack.cjs <work folder> [page.html]
// Makes the page stand on its own: downloads every photo, background and icon the
// page loads from another site into assets/, and points the page at the copies.
// A photo that moves or vanishes on their old site then cannot break the new page.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const work = path.resolve(process.argv[2] || '.');
const file = path.join(work, process.argv[3] || 'page.html');
let html = fs.readFileSync(file, 'utf8');
const urls = new Set();
for (const re of [/\s(?:src|poster|data-src)\s*=\s*["'](https?:\/\/[^"']+)["']/gi, /url\(\s*["']?(https?:\/\/[^"')]+)["']?\s*\)/gi, /\ssrcset\s*=\s*["']([^"']+)["']/gi, /["'](https?:\/\/[^"'\s]+\.(?:png|jpe?g|webp|gif|svg|avif|mp4)(?:\?[^"'\s]*)?)["']/gi]) {
  let m; while ((m = re.exec(html))) {
    if (re.source.includes('srcset')) m[1].split(',').map(s => s.trim().split(/\s+/)[0]).filter(u => /^https?:/.test(u)).forEach(u => urls.add(u));
    else urls.add(m[1]);
  }
}
const skip = u => /fonts\.(googleapis|gstatic)\.com|googletagmanager|google-analytics|doubleclick|facebook\.net|\.js(\?|$)|\.css(\?|$)/i.test(u);
const EXT = { 'font/woff2': '.woff2', 'font/woff': '.woff', 'application/font-woff': '.woff', 'application/font-woff2': '.woff2', 'font/ttf': '.ttf', 'font/otf': '.otf', 'application/x-font-ttf': '.ttf', 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg', 'image/avif': '.avif', 'video/mp4': '.mp4' };
(async () => {
  const dir = path.join(work, 'assets'); fs.mkdirSync(dir, { recursive: true });
  let ok = 0; const failed = [];
  const sortedUrls = [...urls].filter(u => !skip(u)).sort((a, b) => b.length - a.length);
  for (const u of sortedUrls) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131 Safari/537.36' }, signal: AbortSignal.timeout(20000) });
      const type = (r.headers.get('content-type') || '').split(';')[0].trim();
      if (!r.ok || !EXT[type]) { failed.push(`${u} (${r.status} ${type || 'no type'})`); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      const base = path.basename(new URL(u).pathname).replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9-]+/gi, '-').slice(0, 40) || 'file';
      const name = `${base}-${crypto.createHash('md5').update(u).digest('hex').slice(0, 6)}${EXT[type]}`;
      fs.writeFileSync(path.join(dir, name), buf);
      html = html.split(u).join(`assets/${name}`); ok++;
    } catch (e) { failed.push(`${u} (${e.name === 'TimeoutError' ? 'timed out' : e.message})`); }
  }
  fs.writeFileSync(file, html);
  console.log(`Copied ${ok} files into ${dir} and pointed ${path.basename(file)} at them.`);
  if (failed.length) console.log(`Could not copy ${failed.length} (the page still loads these from the old site):\n- ${failed.join('\n- ')}`);
  // The live copy (buyer test, 26 Nov). Their tracking tags go only here, so drafts and renders never send
  // visits to their analytics, and the owner gets one folder and one zip to hand over.
  const live = path.join(work, 'live'); fs.rmSync(live, { recursive: true, force: true }); fs.mkdirSync(path.join(live, 'assets'), { recursive: true });
  for (const a of fs.readdirSync(dir)) { const srcA = path.join(dir, a); if (fs.statSync(srcA).isFile()) fs.copyFileSync(srcA, path.join(live, 'assets', a)); }
  let tags = ''; try { tags = fs.readFileSync(path.join(work, 'inputs', 'tracking-tags.html'), 'utf8').replace(/^<!--[^]*?-->\s*/, '').trim(); } catch (e) {}
  let page = html; const MARK = '<!-- ppcio:tracking-tags -->';
  if (tags) page = page.includes(MARK) ? page.replace(MARK, () => tags) : page.replace(/<\/head>/i, () => tags + '\n</head>');
  fs.writeFileSync(path.join(live, 'index.html'), page);
  const zip = path.join(work, `${path.basename(work)}-page.zip`); fs.rmSync(zip, { force: true });
  const z = require('child_process').spawnSync('zip', ['-qr', zip, '.'], { cwd: live });
  const n = (tags.match(/<script\b/gi) || []).length + (tags.match(/<noscript\b/gi) || []).length;
  console.log(`Live copy: ${live} (index.html and assets)${z.status === 0 ? `, zipped as ${zip}` : ' (no zip tool here: zip the live folder by hand)'}.`);
  console.log(tags ? `Their tracking tags (${n} tags from inputs/tracking-tags.html) are in live/index.html only.` : 'Their live page had no tracking tags to carry over.');
  console.log('To put it live, upload the live folder, or send the zip to whoever runs their site.');
})();
