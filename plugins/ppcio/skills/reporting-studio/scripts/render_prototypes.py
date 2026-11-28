#!/usr/bin/env python3
"""Client Reporting Studio: 3-Prototype Showcase & White-Label Static Portal Generator.

From one immutable facts.json, generates 3 live interactive HTML prototypes straight off the bat:
  1. prototype-a-executive-dashboard.html  (Modular Executive Dashboard w/ sparklines, pacing, Brand split)
  2. prototype-b-mobile-brief.html         (Ultra-calm 390px Mobile Client Brief vs 6m normal + Safety Hold)
  3. prototype-c-call-prep-and-client.html (Dual-View Internal Call-Prep Book + Sanitized Client View + Email)
  + index.html                             (Side-by-side Prototype Picker Board)

Optional --portal mode builds a token-gated multi-client static portal ready for Cloudflare Pages / Netlify.
Pure Python 3 stdlib (zero pip dependencies).
"""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path

THEMES = {
    "executive-clean": {
        "bg": "#f8fafc", "card": "#ffffff", "border": "#e2e8f0", "ink": "#0f172a",
        "muted": "#475569", "accent": "#2563eb", "good": "#059669", "bad": "#dc2626",
        "good_bg": "#ecfdf5", "bad_bg": "#fef2f2", "warn_bg": "#fffbeb", "warn": "#b45309",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "editorial-warm": {
        "bg": "#f6f4ee", "card": "#ffffff", "border": "#e2ddd0", "ink": "#141915",
        "muted": "#5f665d", "accent": "#2f5d46", "good": "#1f6f4a", "bad": "#b91c1c",
        "good_bg": "#edf7f1", "bad_bg": "#fdf2f2", "warn_bg": "#fef8ec", "warn": "#b45309",
        "head_font": "Georgia, 'Iowan Old Style', Cambria, serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "modern-dark": {
        "bg": "#0b1120", "card": "#111827", "border": "#1f2937", "ink": "#f8fafc",
        "muted": "#94a3b8", "accent": "#38bdf8", "good": "#34d399", "bad": "#f87171",
        "good_bg": "rgba(52,211,153,0.12)", "bad_bg": "rgba(248,113,113,0.12)",
        "warn_bg": "rgba(251,191,36,0.12)", "warn": "#fbbf24",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "bold-contrast": {
        "bg": "#ffffff", "card": "#f4f4f5", "border": "#18181b", "ink": "#09090b",
        "muted": "#52525b", "accent": "#18181b", "good": "#15803d", "bad": "#b91c1c",
        "good_bg": "#dcfce7", "bad_bg": "#fee2e2", "warn_bg": "#fef9c3", "warn": "#a16207",
        "head_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "body_font": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
}


def esc(v):
    return html.escape("" if v is None else str(v), quote=True)


def singularize(word):
    w = (word or "conversion").strip()
    low = w.lower()
    if low.endswith("ies") and len(w) > 3:
        return w[:-3] + ("Y" if w[-1].isupper() else "y")
    if low.endswith("s") and not low.endswith("ss") and len(w) > 2:
        return w[:-1]
    return w


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "client").lower()).strip("-") or "client"


def sparkline_svg(points, stroke="var(--accent)"):
    if not points or len(points) < 2:
        return ""
    vals = [float(x) for x in points]
    lo, hi = min(vals), max(vals)
    span = (hi - lo) or 1.0
    w, h = 112, 28
    coords = [f"{(i/(len(vals)-1))*w:.1f},{h-((v-lo)/span)*(h-6)-3:.1f}" for i, v in enumerate(vals)]
    return f'<svg viewBox="0 0 {w} {h}" width="{w}" height="{h}" aria-hidden="true"><polyline fill="none" stroke="{stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="{" ".join(coords)}"/></svg>'


def base_css(t):
    return f"""
  :root {{
    --bg:{t['bg']}; --card:{t['card']}; --border:{t['border']}; --ink:{t['ink']}; --muted:{t['muted']};
    --accent:{t['accent']}; --good:{t['good']}; --bad:{t['bad']}; --warn:{t['warn']};
    --good-bg:{t['good_bg']}; --bad-bg:{t['bad_bg']}; --warn-bg:{t['warn_bg']};
    --hf:{t['head_font']}; --bf:{t['body_font']};
  }}
  * {{ box-sizing: border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--ink); font-family:var(--bf); line-height:1.55; -webkit-font-smoothing:antialiased; }}
  a {{ color:var(--accent); text-decoration:none; }}
  .wrap {{ max-width:1080px; margin:0 auto; padding:28px 20px 64px; }}
  .topbar {{ position:sticky; top:0; z-index:10; background:var(--card); border-bottom:1px solid var(--border); padding:12px 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }}
  .brand {{ font-weight:700; letter-spacing:.02em; font-size:14px; display:flex; align-items:center; gap:10px; }}
  .pill {{ display:inline-block; padding:4px 10px; border-radius:99px; font-size:12px; font-weight:600; background:var(--bg); border:1px solid var(--border); color:var(--muted); }}
  .pill-good {{ background:var(--good-bg); color:var(--good); border-color:transparent; }}
  .pill-bad {{ background:var(--bad-bg); color:var(--bad); border-color:transparent; }}
  .pill-warn {{ background:var(--warn-bg); color:var(--warn); border-color:transparent; }}
  h1,h2,h3 {{ font-family:var(--hf); margin:0 0 10px; line-height:1.2; }}
  .card {{ background:var(--card); border:1px solid var(--border); border-radius:14px; padding:22px; margin-bottom:18px; }}
  .grid4 {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:14px; margin-bottom:18px; }}
  .grid2 {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:16px; margin-bottom:18px; }}
  .kpi-val {{ font-family:var(--hf); font-size:32px; font-weight:700; line-height:1.1; margin:6px 0; font-variant-numeric:tabular-nums; }}
  .muted {{ color:var(--muted); font-size:14px; }}
  .pace-track {{ position:relative; height:12px; background:var(--border); border-radius:99px; overflow:visible; margin:14px 0 8px; }}
  .pace-fill {{ height:100%; background:var(--accent); border-radius:99px; }}
  .pace-mark {{ position:absolute; top:-4px; bottom:-4px; width:2px; background:var(--ink); }}
  table {{ width:100%; border-collapse:collapse; font-size:14px; }}
  th,td {{ text-align:left; padding:10px 8px; border-bottom:1px solid var(--border); font-variant-numeric:tabular-nums; }}
  th {{ font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); }}
  .tabs {{ display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }}
  .tab-btn {{ background:var(--bg); color:var(--ink); border:1px solid var(--border); border-radius:8px; padding:8px 14px; font-size:13px; font-weight:600; cursor:pointer; }}
  .tab-btn.active {{ background:var(--accent); color:#fff; border-color:var(--accent); }}
  .tab-pane {{ display:none; }}
  .tab-pane.active {{ display:block; }}
  .hold-banner {{ background:var(--bad-bg); border:1px solid var(--bad); color:var(--bad); border-radius:12px; padding:14px 18px; margin-bottom:18px; font-weight:600; }}
  .bar-row {{ display:flex; align-items:flex-end; gap:8px; height:108px; padding-top:20px; }}
  .bar-col {{ flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }}
  .bar {{ width:100%; max-width:34px; background:var(--accent); border-radius:6px 6px 0 0; opacity:.85; }}
  @media print {{ .topbar .no-print, .tab-btn {{ display:none; }} }}
"""


def brand_badge(brand):
    agency = brand.get("agency_name") or "Performance Reporting"
    logo = brand.get("logo_url") or ""
    if logo:
        return f'<img src="{esc(logo)}" alt="{esc(agency)}" style="height:26px;max-width:150px;object-fit:contain;"> <span>{esc(agency)}</span>'
    return esc(agency)


def render_prototype_a(facts, brand, t, story=None):
    cur = facts["totals"]["current"]
    nb = facts["non_brand"]["current"]
    br = facts["brand"]["current"]
    p = facts["pacing"]
    c = facts["currency"]
    cw = facts["conversion_label"]
    is_ecom = facts["account_type"] == "ecommerce"
    d = facts["deltas"]
    sp = facts["sparklines"]

    kpi3_lbl = "Return on Ad Spend" if is_ecom else f"Cost per {singularize(cw)}"
    kpi3_val = f"{cur['roas']:.2f}x" if (is_ecom and cur["roas"]) else (f"{c}{cur['cpa']:,.2f}" if cur["cpa"] else "N/A")
    kpi3_delta = d["roas"] if is_ecom else d["cpa"]

    kpi4_lbl = "Non-Brand ROAS" if is_ecom else f"New-Customer {cw.title()} (Non-Brand)"
    kpi4_val = f"{nb['roas']:.2f}x" if (is_ecom and nb["roas"]) else f"{nb['conversions']:,.0f}"
    kpi4_delta = d["nb_cpa"] if not is_ecom else ""

    hl_html = "".join(f"<li>{esc(x)}</li>" for x in (facts["highlights"] or ["Non-brand campaigns held steady within target range."]))
    ll_html = "".join(f"<li>{esc(x)}</li>" for x in (facts["lowlights"] or ["No major efficiency leaks flagged this period."]))
    done_html = "".join(f"<li>{esc(x['summary'])}</li>" for x in (facts["what_we_did"] or [{"summary": "Monitored search terms, pacing, and conversion quality."}]))

    max_cost = max((x["cost"] for x in facts["campaigns"]), default=1) or 1
    camp_rows = []
    for cm in facts["campaigns"][:12]:
        w_pct = min(100, (cm["cost"] / max_cost) * 100)
        eff = f"{cm['roas']:.2f}x" if (is_ecom and cm["roas"]) else (f"{c}{cm['cpa']:,.2f}" if cm["cpa"] else "-")
        tag = '<span class="pill">Brand</span>' if cm["is_brand"] else '<span class="pill pill-good">Non-Brand</span>'
        camp_rows.append(
            f"<tr><td><strong>{esc(cm['campaign'])}</strong> {tag}</td>"
            f"<td>{c}{cm['cost']:,.2f}<div style='height:4px;background:var(--border);border-radius:4px;margin-top:4px;'><div style='height:100%;width:{w_pct:.0f}%;background:var(--accent);border-radius:4px;'></div></div></td>"
            f"<td>{cm['clicks']:,}</td><td>{cm['conversions']:,.1f}</td><td>{eff}</td></tr>"
        )

    st_win = "".join(f"<tr><td>{esc(x['term'])}</td><td>{c}{x['cost']:,.2f}</td><td>{x['conversions']}</td><td>{c}{x['cpa']:,.2f}</td></tr>" for x in facts["search_terms"]["converting_non_brand"]) or "<tr><td colspan='4' class='muted'>Attach a Search Terms CSV to populate top converting non-brand queries.</td></tr>"
    st_wst = "".join(f"<tr><td>{esc(x['term'])}</td><td>{c}{x['cost']:,.2f}</td><td>{x['clicks']}</td><td>Review / Negative</td></tr>" for x in facts["search_terms"]["waste_non_brand"]) or "<tr><td colspan='4' class='muted'>No high-spend zero-conversion non-brand terms flagged.</td></tr>"

    nb_eff = (f"ROAS {nb['roas']:.2f}x") if (is_ecom and nb["roas"]) else (f"{c}{nb['cpa']:,.2f} each" if nb["cpa"] is not None else "N/A")
    summary_text = (story or {}).get("executive_summary") or (
        f"Non-brand campaigns delivered {nb['conversions']:.0f} {cw} on {c}{nb['cost']:,.0f} spend "
        f"({nb_eff}). "
        f"Brand search stayed isolated ({c}{br['cost']:,.0f} spend, {br['conversions']:.0f} {cw}) so acquisition performance stays transparent."
    )

    hold_html = f'<div class="hold-banner">{esc(facts["safety_hold_reason"])}</div>' if facts["safety_hold"] else ""
    pace_cls = "pill-good" if p["status"] == "On Track" else ("pill-bad" if p["status"] == "Over Pacing" else "pill-warn")

    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{esc(facts['client_name'])} - Executive Performance Dashboard</title>
<style>{base_css(t)}</style></head><body>
<header class="topbar">
  <div class="brand">{brand_badge(brand)}</div>
  <div style="display:flex;gap:8px;align-items:center;">
    <span class="pill">{esc(facts['period'])}</span>
    <a class="pill no-print" href="index.html">All Prototypes</a>
  </div>
</header>
<main class="wrap">
  {hold_html}
  <div style="margin-bottom:20px;">
    <span class="pill">Prototype A: Interactive Executive Dashboard</span>
    <h1 style="margin-top:8px;">{esc(facts['client_name'])}</h1>
    <p class="muted">{esc(facts['period'])} vs {esc(facts['compare_period'])} &middot; {esc(facts['lag_note'])}</p>
  </div>

  <div class="grid4">
    <div class="card"><div class="muted">Total {esc(cw.title())}</div><div class="kpi-val">{cur['conversions']:,.0f}</div><div style="display:flex;justify-content:space-between;align-items:center;"><span class="pill pill-good">{esc(d['conversions'])}</span>{sparkline_svg(sp['conversions'])}</div></div>
    <div class="card"><div class="muted">Total Ad Spend</div><div class="kpi-val">{c}{cur['cost']:,.0f}</div><div style="display:flex;justify-content:space-between;align-items:center;"><span class="pill">{esc(d['cost'])}</span>{sparkline_svg(sp['cost'])}</div></div>
    <div class="card"><div class="muted">{esc(kpi3_lbl)}</div><div class="kpi-val">{esc(kpi3_val)}</div><span class="pill">{esc(kpi3_delta)} vs prior</span></div>
    <div class="card"><div class="muted">{esc(kpi4_lbl)}</div><div class="kpi-val">{esc(kpi4_val)}</div><span class="pill pill-good">{esc(kpi4_delta or 'Brand stripped')}</span></div>
  </div>

  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <h2 style="margin:0;">Month-to-Date Budget Pacing</h2>
      <span class="pill {pace_cls}">{esc(p['status'])}</span>
    </div>
    <div class="pace-track">
      <div class="pace-fill" style="width:{min(100, p['spend_pct']):.0f}%"></div>
      <div class="pace-mark" style="left:{min(100, p['elapsed_pct']):.0f}%" title="Month elapsed"></div>
    </div>
    <p style="margin:6px 0 0;"><strong>{c}{p['mtd_spend']:,.0f}</strong> spent of <strong>{c}{p['monthly_budget']:,.0f}</strong> ({p['spend_pct']:.0f}% spent vs {p['elapsed_pct']:.0f}% of month elapsed). {esc(p['verdict'])}</p>
  </div>

  <div class="card">
    <h2>Executive Summary</h2>
    <p>{esc(summary_text)}</p>
    <p class="muted" style="margin-bottom:0;"><strong>Scale Elasticity:</strong> {esc(facts['scale_elasticity'])}</p>
  </div>

  <div class="grid2">
    <div class="card"><h3>Highlights (Non-Brand)</h3><ul>{hl_html}</ul></div>
    <div class="card"><h3>Watchlist &amp; Adjustments (Non-Brand)</h3><ul>{ll_html}</ul></div>
  </div>

  <div class="card">
    <h2>Campaign Breakdown (Brand Isolated)</h2>
    <table><thead><tr><th>Campaign</th><th>Spend</th><th>Clicks</th><th>{esc(cw.title())}</th><th>{'ROAS' if is_ecom else 'Cost / ' + esc(singularize(cw))}</th></tr></thead>
    <tbody>{''.join(camp_rows)}</tbody></table>
  </div>

  <div class="card">
    <h2>Non-Brand Search Terms &amp; Work Completed</h2>
    <div class="tabs">
      <button class="tab-btn active" onclick="sw(this,'t-win')">Converting Terms</button>
      <button class="tab-btn" onclick="sw(this,'t-wst')">Waste / Negatives</button>
      <button class="tab-btn" onclick="sw(this,'t-did')">What We Did</button>
    </div>
    <div id="t-win" class="tab-pane active"><table><thead><tr><th>Search Term</th><th>Spend</th><th>{esc(cw.title())}</th><th>CPA</th></tr></thead><tbody>{st_win}</tbody></table></div>
    <div id="t-wst" class="tab-pane"><table><thead><tr><th>Search Term</th><th>Spend</th><th>Clicks</th><th>Action</th></tr></thead><tbody>{st_wst}</tbody></table></div>
    <div id="t-did" class="tab-pane"><ul>{done_html}</ul></div>
  </div>
</main>
<script>
function sw(btn,id){{btn.parentNode.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');btn.closest('.card').querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');}}
</script></body></html>"""


def render_prototype_b(facts, brand, t):
    cur = facts["totals"]["current"]
    norm = facts["own_normal"]
    c = facts["currency"]
    cw = facts["conversion_label"]
    ms = facts["monthly_series"][-6:]
    max_m = max((x["conversions"] for x in ms), default=1) or 1
    bars = "".join(
        f"<div class='bar-col'><div class='muted' style='font-size:11px;'>{x['conversions']:.0f}</div>"
        f"<div class='bar' style='height:{max(8, int((x['conversions']/max_m)*62))}px;'></div>"
        f"<div class='muted' style='font-size:11px;'>{esc(x['month'][5:])}</div></div>"
        for x in ms
    )
    done_html = "".join(f"<li>{esc(x['summary'])}</li>" for x in (facts["what_we_did"][:4] or [{"summary": "Checked search terms, ads, and enquiry tracking."}]))
    hold_html = f'<div class="hold-banner">{esc(facts["safety_hold_reason"])}</div>' if facts["safety_hold"] else ""

    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{esc(facts['client_name'])} - Plain-English Mobile Brief</title>
<style>{base_css(t)} .phone-wrap{{max-width:460px;margin:24px auto;padding:0 16px 48px;}}</style></head><body>
<header class="topbar">
  <div class="brand">{brand_badge(brand)}</div>
  <a class="pill no-print" href="index.html">All Prototypes</a>
</header>
<main class="phone-wrap">
  {hold_html}
  <span class="pill">Prototype B: Mobile Plain-English Brief</span>
  <h1 style="margin-top:10px;font-size:26px;">{esc(facts['client_name'])}</h1>
  <p class="muted" style="margin-bottom:18px;">{esc(facts['period'])} &middot; {esc(facts['lag_note'])}</p>

  <div class="card">
    <div style="display:grid;gap:16px;">
      <div><div class="muted">{esc(cw.title())}</div><div class="kpi-val">{cur['conversions']:,.0f}</div><div class="muted">Usually about {norm['weekly_conversions']:.0f} per week</div></div>
      <div style="border-top:1px solid var(--border);padding-top:14px;"><div class="muted">Cost per {esc(singularize(cw))}</div><div class="kpi-val">{c}{cur['cpa']:,.2f}</div><div class="muted">Usually about {c}{norm['weekly_cpa'] or 0:,.2f}</div></div>
      <div style="border-top:1px solid var(--border);padding-top:14px;"><div class="muted">Amount spent</div><div class="kpi-val">{c}{cur['cost']:,.0f}</div><div class="muted">{esc(facts['pacing']['status'])} for the month</div></div>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:14px;">{esc(cw.title())} by month</h3>
    <div class="bar-row">{bars}</div>
  </div>

  <div class="card">
    <h3>What we worked on</h3>
    <ul style="padding-left:18px;margin:8px 0 0;">{done_html}</ul>
  </div>
</main></body></html>"""


def render_prototype_c(facts, brand, t, story=None):
    cur = facts["totals"]["current"]
    nb = facts["non_brand"]["current"]
    c = facts["currency"]
    cw = facts["conversion_label"]
    ask = (story or {}).get("one_ask") or "Confirm whether any seasonal offers or capacity limits apply next month before we adjust non-brand budgets."
    points = (story or {}).get("talking_points") or [
        f"Non-brand generated {nb['conversions']:.0f} {cw} at {c}{nb['cpa'] or 0:,.2f} each (Brand kept separate).",
        f"Monthly pacing is {facts['pacing']['status']} ({facts['pacing']['pacing_pct']:.0f}% projected).",
        facts["scale_elasticity"],
    ]
    below_normal = [x for x in facts["campaigns"] if x["vs_own_normal"] in ("below_own_normal", "zero_conv_bleeder")]
    bn_items = []
    for x in below_normal:
        if x["vs_own_normal"] == "zero_conv_bleeder":
            bn_items.append(f"<li><strong>{esc(x['campaign'])}:</strong> {c}{x['cost']:,.0f} spend, 0 {esc(cw)} ({x['clicks']} clicks - zero-conversion bleeder).</li>")
        else:
            bn_items.append(f"<li><strong>{esc(x['campaign'])}:</strong> {c}{x['cpa'] or 0:,.2f} vs own 12-week normal {c}{x['own_normal_cpa'] or 0:,.2f}.</li>")
    bn_html = "".join(bn_items) or "<li>No campaigns drifted materially below their own 12-week normal.</li>"
    email_draft = (
        f"Subject: {facts['client_name']} update ({facts['period']}): {cur['conversions']:.0f} {cw}\n\n"
        f"Hi team,\n\n"
        f"Last week your ads brought in {cur['conversions']:.0f} {cw} ({nb['conversions']:.0f} from new customers searching without your brand name) on {c}{cur['cost']:,.0f} spend. {facts['lag_note']}\n\n"
        f"Pacing: {facts['pacing']['verdict']}\n\n"
        f"What we worked on:\n" + "\n".join(f"- {x['summary']}" for x in (facts["what_we_did"][:3] or [{"summary": "Trimmed wasted search terms and checked pacing."}])) +
        f"\n\nWhat we need from you:\n- {ask}\n"
    )
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{esc(facts['client_name'])} - Dual-View Call Prep &amp; Client Brief</title>
<style>{base_css(t)} pre{{white-space:pre-wrap;background:var(--bg);border:1px solid var(--border);padding:16px;border-radius:10px;font-family:var(--bf);font-size:14px;}}</style></head><body>
<header class="topbar">
  <div class="brand">{brand_badge(brand)}</div>
  <a class="pill no-print" href="index.html">All Prototypes</a>
</header>
<main class="wrap">
  <span class="pill">Prototype C: Dual-View Call Prep + Client Email</span>
  <h1 style="margin-top:8px;">{esc(facts['client_name'])} &middot; Account Book</h1>
  <p class="muted">{esc(facts['period'])} &middot; Same verified facts.json powers internal prep and sanitized client comms.</p>

  <div class="card">
    <div class="tabs">
      <button class="tab-btn active" onclick="sw(this,'c-prep')">Internal 10-Min Call Prep</button>
      <button class="tab-btn" onclick="sw(this,'c-email')">Copy-Ready Monday Email</button>
    </div>
    <div id="c-prep" class="tab-pane active">
      <h3>The One Ask</h3>
      <p style="font-size:17px;font-weight:600;color:var(--accent);">{esc(ask)}</p>
      <h3>3 Talking Points</h3>
      <ul>{''.join(f'<li>{esc(p)}</li>' for p in points)}</ul>
      <h3>Campaigns Below Their Own 12-Week Normal</h3>
      <ul>{bn_html}</ul>
    </div>
    <div id="c-email" class="tab-pane">
      <h3>Plain-English Client Email (Under 200 Words)</h3>
      <pre>{esc(email_draft)}</pre>
    </div>
  </div>
</main>
<script>
function sw(btn,id){{btn.parentNode.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');btn.closest('.card').querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');}}
</script></body></html>"""


def render_picker(facts, brand, t):
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{esc(facts['client_name'])} - Reporting Studio Prototypes</title>
<style>{base_css(t)} .grid3{{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;}}</style></head><body>
<header class="topbar"><div class="brand">{brand_badge(brand)}</div><span class="pill">3 Live Prototypes Ready</span></header>
<main class="wrap">
  <h1>Client Reporting Studio Prototypes: {esc(facts['client_name'])}</h1>
  <p class="muted">All 3 prototypes below run on the exact same verified <code>facts.json</code> ({esc(facts['period'])}). Pick one, mix sections across them, or deploy as a token-gated multi-client portal.</p>
  <div class="grid3">
    <div class="card">
      <span class="pill pill-good">Best for Monthly / Weekly Dashboards</span>
      <h2 style="margin-top:10px;">A. Executive Dashboard</h2>
      <p class="muted">Sparkline KPI cards, MTD pacing bar with pace-vs-return verdict, brand-stripped highlights/lowlights, campaign spend bars, and search term tabs.</p>
      <a class="tab-btn active" style="display:inline-block;" href="prototype-a-executive-dashboard.html">Open Prototype A</a>
    </div>
    <div class="card">
      <span class="pill">Best for Busy Owners on Phones</span>
      <h2 style="margin-top:10px;">B. Mobile Plain-English Brief</h2>
      <p class="muted">3 numbers above the fold on a 390px phone vs 6-month normal, monthly bar strip, what we fixed, and automatic tracking Safety Hold.</p>
      <a class="tab-btn active" style="display:inline-block;" href="prototype-b-mobile-brief.html">Open Prototype B</a>
    </div>
    <div class="card">
      <span class="pill">Best for Account Managers &amp; Calls</span>
      <h2 style="margin-top:10px;">C. Dual-View Call Prep + Email</h2>
      <p class="muted">10-minute internal call brief (1 ask, 3 talking points, 12-week own-normal exceptions) paired with a copy-ready under-200-word client email.</p>
      <a class="tab-btn active" style="display:inline-block;" href="prototype-c-call-prep-and-client.html">Open Prototype C</a>
    </div>
  </div>
</main></body></html>"""


def write_portal(portal_dir, facts, brand, t, dash_html):
    slug = slugify(facts["client_name"])
    tok = hashlib.sha256(f"{slug}:{brand.get('agency_name','agency')}".encode()).hexdigest()[:10]
    admin_tok = hashlib.sha256(f"admin:{brand.get('agency_name','agency')}".encode()).hexdigest()[:12]
    wk = facts["_week"]
    client_root = portal_dir / "r" / f"{slug}-{tok}"
    snap_dir = client_root / wk
    snap_dir.mkdir(parents=True, exist_ok=True)

    # Replace prototype-picker link cleanly for live portal context
    latest_html = dash_html.replace('<a class="pill no-print" href="index.html">All Prototypes</a>', '<a class="pill no-print" href="index.html">Report Archive</a>')
    snap_html = dash_html.replace('<a class="pill no-print" href="index.html">All Prototypes</a>', '<a class="pill no-print" href="../index.html">Report Archive</a>')
    (snap_dir / "index.html").write_text(snap_html, encoding="utf-8")
    (client_root / "latest.html").write_text(latest_html, encoding="utf-8")

    # Update persistent manifest so multi-client & multi-week runs NEVER overwrite prior entries
    manifest_path = portal_dir / "portal-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"clients": {}}
    c_entry = manifest["clients"].get(slug, {"name": facts["client_name"], "slug": slug, "token": tok, "weeks": {}})
    c_entry["name"] = facts["client_name"]
    c_entry["latest_week"] = wk
    c_entry["latest_period"] = facts["period"]
    c_entry["pacing_status"] = facts["pacing"]["status"]
    c_entry["conversions"] = facts["totals"]["current"]["conversions"]
    c_entry["conversion_label"] = facts["conversion_label"]
    c_entry["weeks"][wk] = {
        "period": facts["period"],
        "conversions": facts["totals"]["current"]["conversions"],
        "cost": facts["totals"]["current"]["cost"],
        "currency": facts["currency"],
        "label": facts["conversion_label"],
    }
    manifest["clients"][slug] = c_entry
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    # Render aggregated per-client historical archive
    wk_cards = []
    for w_key in sorted(c_entry["weeks"].keys(), reverse=True):
        w_info = c_entry["weeks"][w_key]
        badge = '<span class="pill pill-good">Latest</span> ' if w_key == c_entry["latest_week"] else ""
        wk_cards.append(
            f"<div class='card'>{badge}<a href='{esc(w_key)}/index.html'><strong>{esc(w_info['period'])}</strong></a>"
            f" &middot; {w_info['conversions']:.0f} {esc(w_info['label'])} &middot; {esc(w_info['currency'])}{w_info['cost']:,.0f} spend</div>"
        )
    (client_root / "index.html").write_text(
        f"<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='robots' content='noindex,nofollow'>"
        f"<title>{esc(facts['client_name'])} Report Archive</title><style>{base_css(t)}</style></head><body>"
        f"<header class='topbar'><div class='brand'>{brand_badge(brand)}</div><a class='pill' href='latest.html'>Latest Report</a></header>"
        f"<main class='wrap'><h1>{esc(facts['client_name'])} Report Archive</h1>{''.join(wk_cards)}</main></body></html>",
        encoding="utf-8",
    )

    # Render aggregated private agency admin hub across ALL clients in manifest
    admin_dir = portal_dir / "admin" / admin_tok
    admin_dir.mkdir(parents=True, exist_ok=True)
    client_cards = []
    for cl in sorted(manifest["clients"].values(), key=lambda x: x["name"].lower()):
        p_cls = "pill-good" if cl["pacing_status"] == "On Track" else ("pill-bad" if cl["pacing_status"] == "Over Pacing" else "pill-warn")
        client_cards.append(
            f"<div class='card' style='display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;'>"
            f"<div><a href='../../r/{esc(cl['slug'])}-{esc(cl['token'])}/latest.html'><strong>{esc(cl['name'])}</strong></a>"
            f" <span class='muted'>&middot; {esc(cl['latest_period'])} &middot; {cl['conversions']:.0f} {esc(cl['conversion_label'])}</span></div>"
            f"<div><span class='pill {p_cls}'>{esc(cl['pacing_status'])}</span> "
            f"<a class='pill' href='../../r/{esc(cl['slug'])}-{esc(cl['token'])}/index.html'>Archive ({len(cl['weeks'])})</a></div></div>"
        )
    (admin_dir / "index.html").write_text(
        f"<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='robots' content='noindex,nofollow'>"
        f"<title>{esc(brand.get('agency_name','Agency'))} Reporting Hub</title><style>{base_css(t)}</style></head><body>"
        f"<header class='topbar'><div class='brand'>{brand_badge(brand)}</div><span class='pill'>{len(manifest['clients'])} Active Client{'s' if len(manifest['clients'])!=1 else ''}</span></header>"
        f"<main class='wrap'><h1>{esc(brand.get('agency_name','Agency'))} Client Reporting Hub</h1>{''.join(client_cards)}</main></body></html>",
        encoding="utf-8",
    )
    return client_root / "latest.html", admin_dir / "index.html"


def main():
    ap = argparse.ArgumentParser(description="Render 3 live Reporting Studio HTML prototypes + optional static portal")
    ap.add_argument("--facts", required=True, help="Path to facts.json from build_facts.py")
    ap.add_argument("--out-dir", required=True, help="Output directory for prototypes")
    ap.add_argument("--agency", default="Performance Reporting")
    ap.add_argument("--logo", default="")
    ap.add_argument("--theme", choices=list(THEMES.keys()), default="editorial-warm")
    ap.add_argument("--accent", default="")
    ap.add_argument("--story", default="", help="Optional narrative JSON (validated against _week)")
    ap.add_argument("--portal", default="", help="Optional directory to build a token-gated static portal")
    args = ap.parse_args()

    facts = json.loads(Path(args.facts).read_text(encoding="utf-8"))
    story = None
    if args.story and Path(args.story).exists():
        st_data = json.loads(Path(args.story).read_text(encoding="utf-8"))
        if st_data.get("_week") == facts.get("_week"):
            story = st_data

    t = dict(THEMES[args.theme])
    if args.accent:
        t["accent"] = args.accent.strip()
    brand = {"agency_name": args.agency, "logo_url": args.logo, "theme": args.theme, "accent": t["accent"]}

    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    html_a = render_prototype_a(facts, brand, t, story)
    html_b = render_prototype_b(facts, brand, t)
    html_c = render_prototype_c(facts, brand, t, story)
    html_p = render_picker(facts, brand, t)

    (out / "prototype-a-executive-dashboard.html").write_text(html_a, encoding="utf-8")
    (out / "prototype-b-mobile-brief.html").write_text(html_b, encoding="utf-8")
    (out / "prototype-c-call-prep-and-client.html").write_text(html_c, encoding="utf-8")
    (out / "index.html").write_text(html_p, encoding="utf-8")
    print(f"3 Prototypes ready: {(out / 'index.html').resolve()}")

    if args.portal:
        c_url, a_url = write_portal(Path(args.portal), facts, brand, t, html_a)
        print(f"Portal client latest: {c_url.resolve()}")
        print(f"Portal private admin: {a_url.resolve()}")


if __name__ == "__main__":
    main()
