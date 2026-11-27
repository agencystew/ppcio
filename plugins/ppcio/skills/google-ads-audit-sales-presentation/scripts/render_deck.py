#!/usr/bin/env python3
"""Render a self-contained, brand-adaptive white-label HTML Google Ads Audit Sales Deck.

Pure Python 3 stdlib (zero dependencies). Supports arrow keys, Space, click navigation,
progress bar, and clean Print-to-PDF slide pages across 4 selectable themes.

Usage:
    python3 render_deck.py deck-data.json --out decks/acme-audit.html
"""
import argparse
import html
import json
from pathlib import Path

THEMES = {
    "executive-clean": {
        "bg": "#f8fafc", "card": "#ffffff", "border": "#e2e8f0", "ink": "#0f172a",
        "muted": "#475569", "accent": "#2563eb", "good": "#059669", "bad": "#dc2626",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "editorial-warm": {
        "bg": "#f6f4ee", "card": "#ffffff", "border": "#e2ddd0", "ink": "#141915",
        "muted": "#5f665d", "accent": "#2f5d46", "good": "#1f6f4a", "bad": "#b91c1c",
        "head_font": "Georgia, 'Iowan Old Style', Cambria, serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "modern-dark": {
        "bg": "#0b1120", "card": "#111827", "border": "#1f2937", "ink": "#f8fafc",
        "muted": "#94a3b8", "accent": "#38bdf8", "good": "#34d399", "bad": "#f87171",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "bold-contrast": {
        "bg": "#ffffff", "card": "#f4f4f5", "border": "#18181b", "ink": "#09090b",
        "muted": "#52525b", "accent": "#18181b", "good": "#15803d", "bad": "#b91c1c",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
}


def esc(v):
    return html.escape("" if v is None else str(v), quote=True)


def render_deck(data):
    brand = data.get("brand") or {}
    theme_key = brand.get("theme") if brand.get("theme") in THEMES else "executive-clean"
    t = dict(THEMES[theme_key])
    if brand.get("accent"):
        t["accent"] = str(brand["accent"]).strip()

    agency = brand.get("agency_name") or "Paid Search Audit"
    logo_url = brand.get("logo_url") or ""
    prospect = data.get("prospect_name") or "Client Account"
    period = data.get("period") or ""
    audit_date = data.get("audit_date") or ""
    slides = data.get("slides") or []

    logo_html = (
        f'<img src="{esc(logo_url)}" alt="{esc(agency)}" style="height:34px;max-width:180px;object-fit:contain;">'
        if logo_url else f'<span class="brand-word">{esc(agency)}</span>'
    )

    sections = []
    # Cover slide
    sections.append(f"""
    <section class="slide active cover" data-idx="0">
      <div class="slide-inner">
        <div class="top-brand">{logo_html}</div>
        <p class="kicker">Google Ads &amp; Conversion Audit</p>
        <h1 class="hero-title">{esc(prospect)}</h1>
        <p class="hero-sub">{esc(data.get("executive_headline") or "Where budget is leaking today, what is working, and the 90-day fix plan.")}</p>
        <div class="meta-row">
          <span>{esc(period)}</span>
          <span>{esc(audit_date)}</span>
        </div>
      </div>
    </section>""")

    for i, sl in enumerate(slides, start=1):
        kind = sl.get("kind") or "finding"
        kicker = sl.get("kicker") or f"Slide {i}"
        title = sl.get("title") or ""
        lead = sl.get("lead") or ""
        metrics = sl.get("metrics") or []
        bullets = sl.get("bullets") or []
        callout = sl.get("callout") or ""

        m_html = ""
        if metrics:
            cards = []
            for m in metrics:
                tone = m.get("tone") or ""
                cls = "metric-good" if tone == "good" else ("metric-bad" if tone == "bad" else "")
                cards.append(
                    f'<div class="metric-card {cls}"><div class="m-val">{esc(m.get("value"))}</div>'
                    f'<div class="m-lbl">{esc(m.get("label"))}</div>'
                    f'{"<div class=m-sub>" + esc(m.get("note")) + "</div>" if m.get("note") else ""}</div>'
                )
            m_html = f'<div class="metric-grid">{"".join(cards)}</div>'

        b_html = ""
        if bullets:
            items = "".join(f"<li>{esc(b)}</li>" for b in bullets)
            b_html = f'<ul class="bullet-list">{items}</ul>'

        c_html = f'<div class="callout">{esc(callout)}</div>' if callout else ""

        sections.append(f"""
    <section class="slide slide-{esc(kind)}" data-idx="{i}">
      <div class="slide-inner">
        <div class="slide-head">
          <span class="kicker">{esc(kicker)}</span>
          <span class="mini-brand">{esc(agency)}</span>
        </div>
        <h2>{esc(title)}</h2>
        {"<p class='lead'>" + esc(lead) + "</p>" if lead else ""}
        {m_html}
        {b_html}
        {c_html}
      </div>
    </section>""")

    total_slides = len(sections)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(prospect)} - Google Ads Audit ({esc(agency)})</title>
<style>
  :root {{
    --bg: {t["bg"]}; --card: {t["card"]}; --border: {t["border"]};
    --ink: {t["ink"]}; --muted: {t["muted"]}; --accent: {t["accent"]};
    --good: {t["good"]}; --bad: {t["bad"]};
    --head-font: {t["head_font"]}; --body-font: {t["body_font"]};
  }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; background: var(--bg); color: var(--ink); font-family: var(--body-font); height: 100%; }}
  .deck {{ position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 36px 24px 80px; }}
  .slide {{ display: none; width: 100%; max-width: 1040px; background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 56px 64px; box-shadow: 0 20px 50px rgba(0,0,0,0.08); }}
  .slide.active {{ display: block; }}
  .slide-head {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }}
  .brand-word, .mini-brand {{ font-weight: 700; letter-spacing: 0.04em; color: var(--muted); font-size: 13px; text-transform: uppercase; }}
  .top-brand {{ margin-bottom: 28px; }}
  .kicker {{ font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin: 0; }}
  .hero-title {{ font-family: var(--head-font); font-size: clamp(36px, 5vw, 58px); line-height: 1.08; margin: 14px 0 18px; }}
  .hero-sub {{ font-size: 20px; line-height: 1.5; color: var(--muted); max-width: 720px; margin: 0 0 28px; }}
  .meta-row {{ display: flex; gap: 24px; font-size: 14px; color: var(--muted); border-top: 1px solid var(--border); padding-top: 18px; }}
  h2 {{ font-family: var(--head-font); font-size: clamp(26px, 3.2vw, 38px); line-height: 1.18; margin: 0 0 14px; }}
  .lead {{ font-size: 18px; line-height: 1.55; color: var(--muted); margin: 0 0 26px; max-width: 820px; }}
  .metric-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; margin: 0 0 26px; }}
  .metric-card {{ background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }}
  .metric-good .m-val {{ color: var(--good); }}
  .metric-bad .m-val {{ color: var(--bad); }}
  .m-val {{ font-family: var(--head-font); font-size: 32px; font-weight: 700; line-height: 1.1; color: var(--accent); }}
  .m-lbl {{ font-size: 13px; font-weight: 600; color: var(--ink); margin-top: 6px; }}
  .m-sub {{ font-size: 12px; color: var(--muted); margin-top: 4px; }}
  .bullet-list {{ margin: 0 0 22px; padding-left: 22px; display: grid; gap: 12px; font-size: 17px; line-height: 1.55; }}
  .callout {{ border-left: 4px solid var(--accent); background: var(--bg); padding: 16px 20px; border-radius: 0 10px 10px 0; font-size: 16px; line-height: 1.5; font-weight: 500; }}
  .nav-bar {{ position: fixed; bottom: 0; left: 0; right: 0; background: var(--card); border-top: 1px solid var(--border); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }}
  .nav-btns {{ display: flex; gap: 10px; }}
  button {{ background: var(--bg); color: var(--ink); border: 1px solid var(--border); border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; }}
  button:hover {{ border-color: var(--accent); color: var(--accent); }}
  .progress {{ flex: 1; max-width: 360px; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }}
  .progress > span {{ display: block; height: 100%; background: var(--accent); width: 0%; transition: width .2s ease; }}
  .counter {{ font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }}
  @media (max-width: 700px) {{ .slide {{ padding: 28px 22px; }} }}
  @media print {{
    .nav-bar {{ display: none; }}
    .deck {{ display: block; padding: 0; }}
    .slide {{ display: block !important; page-break-after: always; box-shadow: none; margin: 0 0 24px; }}
  }}
</style>
</head>
<body>
<main class="deck">
{"".join(sections)}
</main>
<footer class="nav-bar">
  <div class="nav-btns">
    <button type="button" id="prev">Prev</button>
    <button type="button" id="next">Next</button>
    <button type="button" onclick="window.print()">Print / PDF</button>
  </div>
  <div class="progress"><span id="bar"></span></div>
  <div class="counter" id="cnt">1 / {total_slides}</div>
</footer>
<script>
(function() {{
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var cur = 0;
  function show(i) {{
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function(s, idx) {{ s.classList.toggle('active', idx === cur); }});
    document.getElementById('cnt').textContent = (cur + 1) + ' / ' + slides.length;
    document.getElementById('bar').style.width = (((cur + 1) / slides.length) * 100) + '%';
  }}
  document.getElementById('prev').onclick = function() {{ show(cur - 1); }};
  document.getElementById('next').onclick = function() {{ show(cur + 1); }};
  document.addEventListener('keydown', function(e) {{
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {{ e.preventDefault(); show(cur + 1); }}
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {{ e.preventDefault(); show(cur - 1); }}
  }});
  show(0);
}})();
</script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser(description="Render white-label HTML Google Ads Audit Sales Deck")
    ap.add_argument("input_json", help="Path to audit deck JSON")
    ap.add_argument("--out", required=True, help="Output .html file path")
    args = ap.parse_args()

    data = json.loads(Path(args.input_json).read_text(encoding="utf-8"))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render_deck(data), encoding="utf-8")
    print(f"Deck written: {out.resolve()}")


if __name__ == "__main__":
    main()
