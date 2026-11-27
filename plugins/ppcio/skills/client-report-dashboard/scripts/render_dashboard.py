#!/usr/bin/env python3
"""Render a self-contained, brand-adaptive interactive HTML Google Ads client dashboard.

Pure Python 3 stdlib (zero pip dependencies).

Usage:
    python3 render_dashboard.py report-data.json --out reports/acme/2026-11-27.html
"""
import argparse
import html
import json
import shutil
from pathlib import Path

THEMES = {
    "executive-clean": {
        "bg": "#f8fafc", "card": "#ffffff", "border": "#e2e8f0", "ink": "#0f172a",
        "muted": "#475569", "accent": "#2563eb", "good": "#059669", "bad": "#dc2626",
        "warn": "#d97706", "good_bg": "#ecfdf5", "bad_bg": "#fef2f2", "warn_bg": "#fffbeb",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "radius": "14px", "card_border_w": "1px",
    },
    "editorial-warm": {
        "bg": "#f6f4ee", "card": "#ffffff", "border": "#e2ddd0", "ink": "#141915",
        "muted": "#5f665d", "accent": "#2f5d46", "good": "#1f6f4a", "bad": "#b91c1c",
        "warn": "#b45309", "good_bg": "#edf7f1", "bad_bg": "#fdf2f2", "warn_bg": "#fef8ec",
        "head_font": "Georgia, 'Iowan Old Style', Cambria, serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "radius": "12px", "card_border_w": "1px",
    },
    "modern-dark": {
        "bg": "#0b1120", "card": "#111827", "border": "#1f2937", "ink": "#f8fafc",
        "muted": "#94a3b8", "accent": "#38bdf8", "good": "#34d399", "bad": "#f87171",
        "warn": "#fbbf24", "good_bg": "rgba(52,211,153,0.12)", "bad_bg": "rgba(248,113,113,0.12)",
        "warn_bg": "rgba(251,191,36,0.12)",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "radius": "14px", "card_border_w": "1px",
    },
    "bold-contrast": {
        "bg": "#ffffff", "card": "#f4f4f5", "border": "#18181b", "ink": "#09090b",
        "muted": "#52525b", "accent": "#18181b", "good": "#15803d", "bad": "#b91c1c",
        "warn": "#a16207", "good_bg": "#dcfce7", "bad_bg": "#fee2e2", "warn_bg": "#fef9c3",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "radius": "8px", "card_border_w": "2px",
    },
}


def esc(v) -> str:
    return html.escape("" if v is None else str(v), quote=True)


def sparkline_svg(points, stroke="var(--accent)") -> str:
    if not points or len(points) < 2:
        return ""
    vals = [float(x) for x in points]
    lo, hi = min(vals), max(vals)
    span = (hi - lo) or 1.0
    w, h = 120, 30
    coords = [
        f"{(i / (len(vals) - 1)) * w:.1f},{h - ((v - lo) / span) * (h - 6) - 3:.1f}"
        for i, v in enumerate(vals)
    ]
    return (
        f'<svg class="spark" viewBox="0 0 {w} {h}" width="{w}" height="{h}" aria-hidden="true">'
        f'<polyline fill="none" stroke="{stroke}" stroke-width="2.2" stroke-linecap="round" '
        f'stroke-linejoin="round" points="{" ".join(coords)}"/></svg>'
    )


def render(data: dict) -> str:
    brand = data.get("brand") or {}
    theme_key = brand.get("theme") if brand.get("theme") in THEMES else "executive-clean"
    t = dict(THEMES[theme_key])
    if brand.get("accent"):
        t["accent"] = str(brand["accent"]).strip()

    agency = brand.get("agency_name") or "Performance Marketing Report"
    agency_email = brand.get("agency_email") or ""
    logo_url = brand.get("logo_url") or ""
    client = data.get("client_name") or "Client Account"
    period = data.get("period") or ""
    compare_period = data.get("compare_period") or ""
    lag_note = data.get("lag_note") or ""
    summary = data.get("executive_summary") or ""
    kpis = data.get("kpis") or []
    pacing = data.get("pacing") or {}
    brand_split = data.get("brand_split") or []
    highlights = data.get("highlights") or []
    lowlights = data.get("lowlights") or []
    next_steps = data.get("next_steps") or []
    campaigns = data.get("campaigns") or []
    search_terms = data.get("search_terms") or []

    kpi_html = ""
    for k in kpis:
        direction = k.get("status") or "neutral"  # good | bad | warn | neutral
        badge_cls = f"delta {direction}"
        delta = k.get("delta") or ""
        spark = sparkline_svg(k.get("sparkline") or [])
        kpi_html += f"""
        <article class="kpi">
          <div class="kpi-top">
            <span class="kpi-label">{esc(k.get('label'))}</span>
            {f'<span class="{badge_cls}">{esc(delta)}</span>' if delta else ''}
          </div>
          <div class="kpi-val">{esc(k.get('value'))}</div>
          <div class="kpi-foot">
            <span class="kpi-sub">{esc(k.get('previous') or '')}</span>
            {spark}
          </div>
        </article>"""

    pacing_html = ""
    if pacing:
        pct = max(0, min(100, float(pacing.get("spend_pct", 0))))
        time_pct = max(0, min(100, float(pacing.get("month_elapsed_pct", 0))))
        status = pacing.get("status") or "On track"
        pacing_html = f"""
        <section class="panel">
          <div class="panel-head">
            <h2>Monthly Budget Pacing</h2>
            <span class="pill">{esc(status)}</span>
          </div>
          <div class="pace-nums">
            <span><strong>{esc(pacing.get('spent'))}</strong> spent of <strong>{esc(pacing.get('budget'))}</strong> ({pct:.0f}%)</span>
            <span>Projected month-end: <strong>{esc(pacing.get('projected'))}</strong></span>
          </div>
          <div class="pace-bar" role="progressbar" aria-valuenow="{pct:.0f}" aria-valuemin="0" aria-valuemax="100">
            <div class="pace-fill" style="width:{pct:.1f}%"></div>
            <div class="pace-marker" style="left:{time_pct:.1f}%" title="Month elapsed ({time_pct:.0f}%)"></div>
          </div>
          <p class="muted small">Vertical marker shows {time_pct:.0f}% of month elapsed.</p>
        </section>"""

    split_html = ""
    if brand_split:
        rows = "".join(
            f"<tr><td><strong>{esc(r.get('segment'))}</strong></td>"
            f"<td>{esc(r.get('spend'))}</td><td>{esc(r.get('conversions'))}</td>"
            f"<td>{esc(r.get('cpa_or_roas'))}</td><td>{esc(r.get('share'))}</td></tr>"
            for r in brand_split
        )
        split_html = f"""
        <section class="panel">
          <div class="panel-head"><h2>Brand vs. Non-Brand Split</h2></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Segment</th><th>Spend</th><th>Conversions</th><th>CPA / ROAS</th><th>Spend Share</th></tr></thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </section>"""

    def bullet_list(items, empty_msg):
        if not items:
            return f'<p class="muted">{esc(empty_msg)}</p>'
        return "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul>"

    camp_html = ""
    if campaigns:
        cols = list(campaigns[0].keys())
        th = "".join(f'<th data-col="{i}">{esc(c)}</th>' for i, c in enumerate(cols))
        trs = ""
        for row in campaigns:
            tds = "".join(f"<td>{esc(row.get(c))}</td>" for c in cols)
            trs += f"<tr>{tds}</tr>"
        camp_html = f"""
        <section class="panel">
          <div class="panel-head">
            <h2>Campaign Breakdown</h2>
            <span class="muted small">Click any column header to sort</span>
          </div>
          <div class="table-wrap">
            <table class="sortable">
              <thead><tr>{th}</tr></thead>
              <tbody>{trs}</tbody>
            </table>
          </div>
        </section>"""

    st_html = ""
    if search_terms:
        cols = list(search_terms[0].keys())
        th = "".join(f"<th>{esc(c)}</th>" for c in cols)
        trs = "".join("<tr>" + "".join(f"<td>{esc(r.get(c))}</td>" for c in cols) + "</tr>" for r in search_terms)
        st_html = f"""
        <section class="panel">
          <div class="panel-head"><h2>Notable Search Terms</h2></div>
          <div class="table-wrap">
            <table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>
          </div>
        </section>"""

    logo_block = f'<img class="logo" src="{esc(logo_url)}" alt="{esc(agency)}">' if logo_url else ""

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{esc(client)} — {esc(period or 'Performance Report')}</title>
<style>
:root {{
  --bg: {t['bg']}; --card: {t['card']}; --border: {t['border']};
  --ink: {t['ink']}; --muted: {t['muted']}; --accent: {t['accent']};
  --good: {t['good']}; --bad: {t['bad']}; --warn: {t['warn']};
  --good-bg: {t['good_bg']}; --bad-bg: {t['bad_bg']}; --warn-bg: {t['warn_bg']};
  --radius: {t['radius']}; --bw: {t['card_border_w']};
}}
* {{ box-sizing: border-box; }}
body {{
  margin: 0; background: var(--bg); color: var(--ink);
  font: 16px/1.55 {t['body_font']}; -webkit-font-smoothing: antialiased;
}}
.wrap {{ max-width: 1140px; margin: 0 auto; padding: 36px 20px 72px; }}
header.top {{
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end;
  gap: 16px; padding-bottom: 24px; border-bottom: var(--bw) solid var(--border); margin-bottom: 28px;
}}
.agency {{ display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }}
.logo {{ max-height: 28px; width: auto; display: block; }}
h1 {{ margin: 0; font: 700 clamp(28px, 4vw, 40px)/1.1 {t['head_font']}; letter-spacing: -.02em; }}
h2 {{ margin: 0; font: 700 19px/1.25 {t['head_font']}; letter-spacing: -.01em; }}
.period {{ text-align: right; color: var(--muted); font-size: 14px; }}
.period strong {{ color: var(--ink); display: block; font-size: 15px; }}
.summary-box {{
  background: var(--card); border: var(--bw) solid var(--border); border-left: 4px solid var(--accent);
  border-radius: var(--radius); padding: 20px 24px; margin-bottom: 24px;
}}
.summary-box p {{ margin: 8px 0 0; font-size: 16.5px; }}
.lag {{ margin-top: 10px; font-size: 13.5px; color: var(--warn); background: var(--warn-bg); padding: 8px 12px; border-radius: 8px; display: inline-block; }}
.kpi-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px; }}
.kpi {{ background: var(--card); border: var(--bw) solid var(--border); border-radius: var(--radius); padding: 18px 20px; display: flex; flex-direction: column; gap: 8px; }}
.kpi-top {{ display: flex; justify-content: space-between; align-items: center; gap: 8px; }}
.kpi-label {{ font-size: 13px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }}
.kpi-val {{ font-size: 30px; font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }}
.kpi-foot {{ display: flex; justify-content: space-between; align-items: flex-end; gap: 8px; margin-top: auto; }}
.kpi-sub {{ font-size: 13px; color: var(--muted); }}
.delta {{ font-size: 12.5px; font-weight: 700; padding: 3px 8px; border-radius: 999px; font-variant-numeric: tabular-nums; }}
.delta.good {{ color: var(--good); background: var(--good-bg); }}
.delta.bad {{ color: var(--bad); background: var(--bad-bg); }}
.delta.warn {{ color: var(--warn); background: var(--warn-bg); }}
.delta.neutral {{ color: var(--muted); background: var(--bg); }}
.narrative-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }}
.panel {{ background: var(--card); border: var(--bw) solid var(--border); border-radius: var(--radius); padding: 20px 22px; margin-bottom: 20px; }}
.panel-head {{ display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }}
.pill {{ font-size: 12.5px; font-weight: 700; color: var(--accent); background: var(--bg); border: 1px solid var(--border); padding: 4px 10px; border-radius: 999px; }}
.panel ul {{ margin: 0; padding-left: 18px; display: grid; gap: 8px; }}
.pace-nums {{ display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 14.5px; margin-bottom: 10px; font-variant-numeric: tabular-nums; }}
.pace-bar {{ position: relative; height: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 999px; overflow: visible; }}
.pace-fill {{ height: 100%; background: var(--accent); border-radius: 999px; }}
.pace-marker {{ position: absolute; top: -4px; bottom: -4px; width: 2px; background: var(--ink); }}
.table-wrap {{ overflow-x: auto; }}
table {{ width: 100%; border-collapse: collapse; font-size: 14.5px; font-variant-numeric: tabular-nums; }}
th, td {{ text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); white-space: nowrap; }}
th {{ font-size: 12.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); cursor: pointer; user-select: none; }}
tbody tr:last-child td {{ border-bottom: 0; }}
.muted {{ color: var(--muted); }}
.small {{ font-size: 13px; margin: 8px 0 0; }}
footer {{ margin-top: 36px; padding-top: 18px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; font-size: 13px; color: var(--muted); }}
@media (max-width: 640px) {{ .period {{ text-align: left; }} }}
@media print {{
  body {{ background: #fff !important; color: #000 !important; }}
  .panel, .kpi, .summary-box {{ break-inside: avoid; box-shadow: none; }}
}}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div>
      <div class="agency">{logo_block}<span>{esc(agency)}</span></div>
      <h1>{esc(client)}</h1>
    </div>
    <div class="period">
      <strong>{esc(period)}</strong>
      {f'<span>vs. {esc(compare_period)}</span>' if compare_period else ''}
    </div>
  </header>

  {f'<section class="summary-box"><h2>Executive Takeaway</h2><p>{esc(summary)}</p>{f"<div class=lag>{esc(lag_note)}</div>" if lag_note else ""}</section>' if summary else ''}

  <section class="kpi-grid">{kpi_html}</section>

  {pacing_html}

  <div class="narrative-grid">
    <section class="panel" style="margin-bottom:0">
      <div class="panel-head"><h2>What Needs Attention</h2></div>
      {bullet_list(lowlights, 'No material declines flagged this period.')}
    </section>
    <section class="panel" style="margin-bottom:0">
      <div class="panel-head"><h2>What Worked</h2></div>
      {bullet_list(highlights, 'Steady baseline performance across active campaigns.')}
    </section>
    <section class="panel" style="margin-bottom:0">
      <div class="panel-head"><h2>Next Actions</h2></div>
      {bullet_list(next_steps, 'Monitor current tests and pacing.')}
    </section>
  </div>

  {split_html}
  {camp_html}
  {st_html}

  <footer>
    <span>Prepared by {esc(agency)}{f' · {esc(agency_email)}' if agency_email else ''}</span>
    <span>Self-contained report · Print or Save as PDF anytime</span>
  </footer>
</div>
<script>
document.querySelectorAll('table.sortable th').forEach(function(th){{
  let asc = false;
  th.addEventListener('click', function(){{
    const tb = th.closest('table').querySelector('tbody');
    const idx = Array.from(th.parentNode.children).indexOf(th);
    const rows = Array.from(tb.querySelectorAll('tr'));
    const num = s => parseFloat(String(s).replace(/[^0-9.-]+/g, ''));
    rows.sort((a, b) => {{
      const av = a.children[idx].innerText.trim(), bv = b.children[idx].innerText.trim();
      const an = num(av), bn = num(bv);
      if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    }});
    asc = !asc;
    rows.forEach(r => tb.appendChild(r));
  }});
}});
</script>
</body>
</html>
"""


def main():
    p = argparse.ArgumentParser(description="Render a brand-adaptive HTML Google Ads client dashboard.")
    p.add_argument("data_json", help="Path to JSON report payload")
    p.add_argument("--out", required=True, help="Output HTML path (e.g. reports/acme/2026-11-27.html)")
    args = p.parse_args()
    data = json.loads(Path(args.data_json).read_text(encoding="utf-8"))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(data), encoding="utf-8")
    if out.name != "latest.html":
        shutil.copy2(out, out.parent / "latest.html")
    print(f"Wrote {out.resolve()} (and latest.html)")


if __name__ == "__main__":
    main()
