// Where each piece of text sits on a full-page capture, in percent of the page.
// The studio's Fixes tab draws its spotlight boxes from these (the same shape the
// app's page reader writes: {text, xPct, yPct, wPct, hPct}). `cap` is the
// height of a clipped capture in CSS px: text below it is left out.
async function textNodes(page, cap = 0) {
  return page.evaluate((cap) => {
    const full = document.documentElement.scrollHeight, H = cap && full > cap ? cap : full, W = document.documentElement.scrollWidth, out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t.length < 2) continue;
      const p = n.parentElement; if (!p) continue;
      const cs = getComputedStyle(p); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      if (b.top + scrollY > H) continue;
      const f = (v) => +v.toFixed(2);
      out.push({ text: t.slice(0, 400), xPct: f(100 * (b.left + scrollX) / W), yPct: f(100 * (b.top + scrollY) / H), wPct: f(100 * b.width / W), hPct: f(100 * b.height / H) });
      if (out.length >= 600) break;
    }
    return out;
  }, cap).catch(() => []);
}
module.exports = { textNodes };
