// node licence.cjs <command>: the PPC.io licence, checked on this computer.
//   status            prints PRO, TEAM or FREE (and the end date)
//   unlock <key>      checks a key and saves it in ~/.ppcio/key
//   need <part> [site] exits 0 when this part may run, or prints LOCKED and exits 4
//
// A key is "PPCIO-<data>.<signature>". The data is {p: plan, i: key id, x: end date}.
// PPC.io signs it with its private key when Stripe confirms the payment. This file
// holds only the public key, so the check needs no account and no server.
// There is no email and no name in a key.
//
// The free version runs the first look and the audit on one website. Each part
// below needs a licence. A key past its end date counts as FREE.
const fs = require('fs'); const path = require('path'); const os = require('os'); const crypto = require('crypto');
const PUB = 'MCowBQYDK2VwAyEA2erlSOQpdU273OBr6YmXu32Set9UjsLTo9pppk2JU5o=';
const HOME = process.env.PPCIO_HOME || path.join(os.homedir(), '.ppcio');
const KEYFILE = path.join(HOME, 'key'); const SITES = path.join(HOME, 'free-site');
const PAID = { build: 'the page build and the style library', library: 'the full style library', agency: 'agency mode (many clients at once)', review: 'the review screen', pack: 'the go-live pack' };

function check(key) {
  const m = String(key || '').trim().match(/^PPCIO-([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/);
  if (!m) return { ok: false, why: 'This is not a PPC.io key. It starts with PPCIO-.' };
  const pub = crypto.createPublicKey({ key: Buffer.from(PUB, 'base64'), format: 'der', type: 'spki' });
  if (!crypto.verify(null, Buffer.from(m[1]), pub, Buffer.from(m[2], 'base64url'))) return { ok: false, why: 'This key did not pass the check. Copy it again from your PPC.io email.' };
  let d; try { d = JSON.parse(Buffer.from(m[1], 'base64url').toString()); } catch (e) { return { ok: false, why: 'This key is damaged. Copy it again from your PPC.io email.' }; }
  if (d.x && new Date(d.x + 'T23:59:59Z') < new Date()) return { ok: false, why: `This licence ended on ${d.x}. Renew it at ppc.io.`, d };
  return { ok: true, d };
}
const saved = () => { try { return check(fs.readFileSync(KEYFILE, 'utf8')); } catch (e) { return { ok: false }; } };
const plan = r => r.ok ? String(r.d.p || 'pro').toUpperCase() : 'FREE';


// The full library: the server checks the key and answers a link that lasts 10 minutes.
const SERVER = process.env.PPCIO_SERVER || 'https://postclick.ppc.io';
async function fetchWithRetry(url, init, tries = 2, timeoutMs = 45000) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (res.status >= 500 && i + 1 < tries) { await new Promise(r => setTimeout(r, 1200)); continue; }
      return res;
    } catch (e) {
      lastErr = e;
      if (i + 1 < tries) await new Promise(r => setTimeout(r, 1200));
    }
  }
  throw lastErr || new Error('network error');
}
async function getLibrary(key) {
  const res = await fetchWithRetry(`${SERVER}/api/public/ppcio/library`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }) }, 2, 20000);
  const j = await res.json().catch(() => ({}));
  if (res.status === 403) throw new Error('the server did not accept this key. Check you copied the whole PPCIO-... key from your email.');
  if (res.status === 429) throw new Error('this key downloaded the library too many times this month. Email support@ppc.io');
  if (!res.ok || !j.url) throw new Error(`the library server answered ${res.status}`);
  const lib = path.join(HOME, 'library'); const tmp = path.join(HOME, 'library.download'); const tgz = path.join(HOME, 'library.tar.gz');
  const file = await fetchWithRetry(j.url, {}, 2, 90000); if (!file.ok) throw new Error(`the download answered ${file.status}`);
  fs.mkdirSync(HOME, { recursive: true }); fs.writeFileSync(tgz, Buffer.from(await file.arrayBuffer()));
  fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  require('child_process').execFileSync('tar', ['-xzf', tgz, '-C', tmp]);
  if (!fs.existsSync(path.join(tmp, 'index.json'))) throw new Error('the download was not a library');
  fs.rmSync(lib, { recursive: true, force: true }); fs.renameSync(tmp, lib); fs.rmSync(tgz, { force: true });
  const n = JSON.parse(fs.readFileSync(path.join(lib, 'index.json'), 'utf8')).length;
  console.log(`LIBRARY: the full style library is ready (${n} pages).`);
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'status') {
  const r = saved();
  console.log(r.ok ? `${plan(r)} until ${r.d.x || 'no end date'}` : `FREE${r.why ? ` (${r.why})` : ''}`);
} else if (cmd === 'unlock') {
  const r = check(a);
  if (!r.ok) { console.log(`NOT UNLOCKED: ${r.why}`); process.exit(1); }
  fs.mkdirSync(HOME, { recursive: true }); fs.writeFileSync(KEYFILE, a.trim() + '\n', { mode: 0o600 });
  console.log(`UNLOCKED: PPC.io ${plan(r) === 'TEAM' ? 'Team' : 'Pro'}${r.d.x ? ` until ${r.d.x}` : ', for life'}. Everything is open: every website, the page build, the full style library and agency mode.`);
  getLibrary(a.trim()).then(() => {}, (e) => console.log(`LIBRARY NOT DOWNLOADED: ${e.message}. Run "kit.sh library update" later. Everything else works now.`));
} else if (cmd === 'library') {
  const r = saved();
  if (!r.ok) { console.log('LOCKED: the full style library comes with the PPC.io licence. Get it at https://ppc.io, then paste the key here.'); process.exit(4); }
  getLibrary(fs.readFileSync(KEYFILE, 'utf8').trim()).catch((e) => { console.log(`LIBRARY NOT DOWNLOADED: ${e.message}`); process.exit(1); });
} else if (cmd === 'need') {
  const r = saved();
  // One offer: every paid key opens every part, agency mode included.
  if (r.ok) process.exit(0);
  if (a === 'site') {
    // The free version: one website. The first site audited is the free one.
    const host = String(b || '').toLowerCase().replace(/^www\./, '').trim();
    if (!host) { console.log('Usage: licence.cjs need site <site-name>'); process.exit(1); }
    let first = ''; try { first = fs.readFileSync(SITES, 'utf8').trim(); } catch (e) {}
    if (!first) { fs.mkdirSync(HOME, { recursive: true }); fs.writeFileSync(SITES, host + '\n'); process.exit(0); }
    if (first === host) process.exit(0);
    console.log(`LOCKED: the free version audits one website (${first}). Auditing ${host} needs the PPC.io licence. Get it at https://ppc.io, then paste the key here.`);
    process.exit(4);
  }
  console.log(`LOCKED: ${PAID[a] || a} comes with the PPC.io licence. Get it at https://ppc.io, then paste the key here.`);
  process.exit(4);
} else {
  console.log('Commands: status | unlock <key> | library | need <part> [site]');
}
