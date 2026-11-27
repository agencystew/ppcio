#!/usr/bin/env python3
"""Agency & In-House PPC Operations / Audit OS Studio: 3-Prototype Interactive Workbench Renderer.

From one verified ops_state.json, renders 3 live clickable HTML prototypes straight off the bat:
  1. prototype-a-morning-ops-command.html   (Portfolio Risk Screen + Dependency-Gated Team Batches)
  2. prototype-b-deep-audit-workbench.html  (6-Tab Account Audit OS w/ interactive checkboxes & 'Not right?' log)
  3. prototype-c-opportunity-pitch-board.html (Revenue-First Audit & Opportunity Pitch Board w/ Restraint block)
  + index.html                              (Side-by-side Ops Studio Prototype Picker)

Pure Python 3 stdlib (zero pip dependencies). Quiet editorial aesthetic across 4 selectable themes.
"""
import argparse
import html
import json
from pathlib import Path

THEMES = {
    "editorial-warm": {
        "bg": "#f6f4ee", "card": "#ffffff", "border": "#e2ddd0", "ink": "#141915",
        "muted": "#5f665d", "accent": "#2f5d46", "good": "#1f6f4a", "bad": "#b91c1c",
        "good_bg": "#edf7f1", "bad_bg": "#fdf2f2", "warn_bg": "#fef8ec", "warn": "#b45309",
        "hf": "Georgia, 'Iowan Old Style', Cambria, serif",
        "bf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "executive-clean": {
        "bg": "#f8fafc", "card": "#ffffff", "border": "#e2e8f0", "ink": "#0f172a",
        "muted": "#475569", "accent": "#2563eb", "good": "#059669", "bad": "#dc2626",
        "good_bg": "#ecfdf5", "bad_bg": "#fef2f2", "warn_bg": "#fffbeb", "warn": "#b45309",
        "hf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "bf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "modern-dark": {
        "bg": "#0b1120", "card": "#111827", "border": "#1f2937", "ink": "#f8fafc",
        "muted": "#94a3b8", "accent": "#38bdf8", "good": "#34d399", "bad": "#f87171",
        "good_bg": "rgba(52,211,153,0.12)", "bad_bg": "rgba(248,113,113,0.12)",
        "warn_bg": "rgba(251,191,36,0.12)", "warn": "#fbbf24",
        "hf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "bf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
    "bold-contrast": {
        "bg": "#ffffff", "card": "#f4f4f5", "border": "#18181b", "ink": "#09090b",
        "muted": "#52525b", "accent": "#18181b", "good": "#15803d", "bad": "#b91c1c",
        "good_bg": "#dcfce7", "bad_bg": "#fee2e2", "warn_bg": "#fef9c3", "warn": "#a16207",
        "hf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
        "bf": "system-ui, -apple-system, 'Segoe UI', Inter, sans-serif",
    },
}


def esc(v):
    return html.escape("" if v is None else str(v), quote=True)


def css(t):
    return f"""
  :root{{--bg:{t['bg']};--card:{t['card']};--border:{t['border']};--ink:{t['ink']};--muted:{t['muted']};--accent:{t['accent']};--good:{t['good']};--bad:{t['bad']};--warn:{t['warn']};--good-bg:{t['good_bg']};--bad-bg:{t['bad_bg']};--warn-bg:{t['warn_bg']};--hf:{t['hf']};--bf:{t['bf']};}}
  *{{box-sizing:border-box;}}
  body{{margin:0;background:var(--bg);color:var(--ink);font-family:var(--bf);line-height:1.55;}}
  a{{color:var(--accent);text-decoration:none;}}
  .top{{position:sticky;top:0;z-index:10;background:var(--card);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;}}
  .wrap{{max-width:1120px;margin:0 auto;padding:28px 20px 64px;}}
  h1,h2,h3{{font-family:var(--hf);margin:0 0 10px;line-height:1.2;}}
  .card{{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:18px;}}
  .pill{{display:inline-block;padding:4px 10px;border-radius:99px;font-size:12px;font-weight:600;background:var(--bg);border:1px solid var(--border);color:var(--muted);}}
  .p-bad{{background:var(--bad-bg);color:var(--bad);border-color:transparent;}}
  .p-warn{{background:var(--warn-bg);color:var(--warn);border-color:transparent;}}
  .p-good{{background:var(--good-bg);color:var(--good);border-color:transparent;}}
  .grid3{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-bottom:18px;}}
  .grid2{{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-bottom:18px;}}
  .muted{{color:var(--muted);font-size:14px;}}
  table{{width:100%;border-collapse:collapse;font-size:14px;}}
  th,td{{text-align:left;padding:10px 8px;border-bottom:1px solid var(--border);font-variant-numeric:tabular-nums;}}
  th{{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);}}
  .tabs{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}}
  .tbtn{{background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;}}
  .tbtn.active{{background:var(--accent);color:#fff;border-color:var(--accent);}}
  .tpane{{display:none;}} .tpane.active{{display:block;}}
  .move{{border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;background:var(--bg);}}
  .btn-sm{{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;color:var(--ink);}}
  .stat{{font-family:var(--hf);font-size:30px;font-weight:700;line-height:1.1;margin:6px 0;}}
"""


def render_proto_a(state, org, t):
    c = state["currency"]
    cnt = state["portfolio_counts"]
    b = state["batches"]
    actionable = [a for a in state["accounts"] if a["state"] in ("BROKEN", "AT_RISK", "FEW_DATA")]
    wins = [a for a in state["accounts"] if a["state"] == "WIN"]

    acct_rows = []
    for a in actionable:
        cls = "p-bad" if a["state"] == "BROKEN" else "p-warn"
        top_mv = a["top_moves"][0]["title"] if a["top_moves"] else "Review account"
        acct_rows.append(
            f"<tr><td><strong>{esc(a['account'])}</strong></td><td><span class='pill {cls}'>{esc(a['state'])}</span></td>"
            f"<td>{c}{a['non_brand']['cost']:,.0f}</td><td>{a['non_brand']['conversions']:.0f}</td>"
            f"<td>{c}{a['non_brand']['cpa']:,.2f}</td><td>{esc(top_mv)}</td></tr>"
        )
    if not acct_rows:
        acct_rows.append("<tr><td colspan='6' class='muted'>Zero broken or at-risk accounts today. Silence is the default.</td></tr>")

    def batch_list(items, empty_msg):
        if not items:
            return f"<p class='muted'>{esc(empty_msg)}</p>"
        return "<ul>" + "".join(
            f"<li><label><input type='checkbox'> <strong>{esc(x['account'])}</strong>: {esc(x.get('campaign',''))} {esc(x['task'])}</label></li>"
            for x in items
        ) + "</ul>"

    ed_note = f"<p class='muted'>Ready-to-import Google Ads Editor CSV generated at: <code>{esc(state['editor_csv'])}</code></p>" if state.get("editor_csv") else ""

    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(org)} - Morning Ops &amp; Batch-by-Task Command Center</title><style>{css(t)}</style></head><body>
<header class="top"><strong>{esc(org)} &middot; PPC Ops OS</strong><a class="pill" href="index.html">All Prototypes</a></header>
<main class="wrap">
  <span class="pill">Prototype A: Morning Ops Triage &amp; Batch-by-Task Queue</span>
  <h1 style="margin-top:8px;">Portfolio Morning Triage</h1>
  <p class="muted">Noise-disciplined risk queue: broken and at-risk accounts surface first; healthy accounts collapse to a single count.</p>

  <div class="grid3">
    <div class="card"><div class="muted">Broken (Fix Tracking First)</div><div class="stat" style="color:var(--bad);">{cnt['BROKEN']}</div></div>
    <div class="card"><div class="muted">At Risk / Few Data</div><div class="stat" style="color:var(--warn);">{cnt['AT_RISK'] + cnt['FEW_DATA']}</div></div>
    <div class="card"><div class="muted">Healthy / Winning (Need Nothing Today)</div><div class="stat" style="color:var(--good);">{cnt['FINE'] + cnt['WIN']}</div></div>
  </div>

  <div class="card">
    <h2>Priority Accounts Needing Action</h2>
    <table><thead><tr><th>Account</th><th>State</th><th>Non-Brand Spend</th><th>Conv</th><th>NB CPA</th><th>#1 Move</th></tr></thead>
    <tbody>{''.join(acct_rows)}</tbody></table>
    <p class="muted" style="margin-top:14px;">{cnt['FINE']} accounts need nothing this week. {len(wins)} accounts are beating target by >15%.</p>
  </div>

  <div class="card">
    <h2>Dependency-Gated Team Batches (Playbook Order)</h2>
    <p class="muted">Traffic tweaks on broken-tracking accounts are automatically held in <strong>Waiting on tracking</strong> so nobody wastes edits on corrupted data.</p>
    {ed_note}
    <div class="grid2">
      <div class="move"><h3>1. Tracking Help Desk ({len(b['tracking'])})</h3>{batch_list(b['tracking'], 'All tracking clean.')}</div>
      <div class="move"><h3>2. Web / Landing Page Team ({len(b['web_lp'])})</h3>{batch_list(b['web_lp'], 'No severe post-click leaks.')}</div>
      <div class="move"><h3>3. PPC Managers: Ready Now ({len(b['ppc_ready'])})</h3>{batch_list(b['ppc_ready'], 'No urgent traffic waste.')}</div>
      <div class="move"><h3>4. PPC Held: Waiting on Tracking ({len(b['ppc_waiting_on_tracking'])})</h3>{batch_list(b['ppc_waiting_on_tracking'], 'Zero traffic tasks blocked.')}</div>
    </div>
  </div>
</main></body></html>"""


def render_proto_b(state, org, t):
    c = state["currency"]
    a = state["accounts"][0]
    moves_html = ""
    for i, m in enumerate(a["top_moves"], start=1):
        blk = '<span class="pill p-bad">Waiting on tracking</span> ' if m.get("blocked_by_tracking") else ""
        moves_html += f"""
        <div class="move" data-mid="m{i}">
          <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;">
            <div><label><input type="checkbox" onchange="saveTick('m{i}',this.checked)"> <strong>{i}. {esc(m['title'])}</strong></label> {blk}<span class="pill">{esc(m['owner'])}</span></div>
            <button class="btn-sm" onclick="flagWrong('m{i}','{esc(m['title'])}')">Not right? Tell us why</button>
          </div>
          <p style="margin:8px 0 4px;"><strong>Claim:</strong> {esc(m['claim'])}</p>
          <p class="muted" style="margin:4px 0;"><strong>Evidence:</strong> {esc(m['evidence'])}</p>
          <p class="muted" style="margin:4px 0;"><strong>Reading:</strong> {esc(m['reading'])}</p>
          <p style="margin:6px 0 0;"><strong>Fix:</strong> {esc(m['fix'])} &middot; <span style="color:var(--accent);font-weight:600;">{esc(m['est_monthly_gain'])}</span></p>
        </div>"""
    if not moves_html:
        moves_html = "<p class='muted'>Account is healthy; protect current winning campaigns.</p>"

    grade_rows = "".join(
        f"<tr><td><strong>{esc(g['topic'])}</strong></td><td><span class='pill {'p-good' if g['grade']=='A' else ('p-bad' if g['grade']=='D' else 'p-warn')}'>{esc(g['grade'])}</span></td><td class='muted'>{esc(g['note'])}</td></tr>"
        for g in a["health_grades"]
    )
    camp_rows = "".join(
        f"<tr><td>{esc(cm['campaign'])}</td><td>{'Brand' if cm['is_brand'] else 'Non-Brand'}</td><td>{esc(cm['bid'] or '-')}</td><td>{c}{cm['cost']:,.2f}</td><td>{cm['clicks']:.0f}</td><td>{cm['conv']:.1f}</td><td>{cm['lost_b']:.0f}% / {cm['lost_r']:.0f}%</td></tr>"
        for cm in a["campaigns"]
    )
    prot_html = "".join(f"<li><strong>{esc(p['campaign'])}:</strong> {esc(p['reason'])}</li>" for p in a["protect_healthy"]) or "<li>No confirmed winning campaigns yet.</li>"

    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(a['account'])} - 6-Tab Causal Audit Workbench</title><style>{css(t)}</style></head><body>
<header class="top"><strong>{esc(org)} &middot; 6-Tab Deep Audit OS</strong><a class="pill" href="index.html">All Prototypes</a></header>
<main class="wrap">
  <span class="pill">Prototype B: 6-Tab Deep Causal Account Audit Workbench</span>
  <h1 style="margin-top:8px;">{esc(a['account'])} <span class="pill {'p-bad' if a['state']=='BROKEN' else 'p-warn'}">{esc(a['state'])}</span></h1>
  <p class="muted">Non-Brand: {c}{a['non_brand']['cost']:,.0f} spend &middot; {a['non_brand']['conversions']:.0f} conversions &middot; CPA {c}{a['non_brand']['cpa'] or 0:,.2f} (goal {c}{a['target_cpa']:,.0f})</p>

  <div class="tabs">
    <button class="tbtn active" onclick="st(this,'t1')">1. Monday Overview</button>
    <button class="tbtn" onclick="st(this,'t2')">2. Health (A-D)</button>
    <button class="tbtn" onclick="st(this,'t3')">3. Tracking &amp; Quality</button>
    <button class="tbtn" onclick="st(this,'t4')">4. Ads &amp; Landing Pages</button>
    <button class="tbtn" onclick="st(this,'t5')">5. Notes &amp; Rejections</button>
    <button class="tbtn" onclick="st(this,'t6')">6. Full Data</button>
  </div>

  <div id="t1" class="tpane active">
    <div class="card"><h2>Top Prioritized Moves (5-Part Finding Contract)</h2>{moves_html}</div>
    <div class="card"><h3>What Is Working (Protect These)</h3><ul>{prot_html}</ul></div>
  </div>
  <div id="t2" class="tpane"><div class="card"><h2>Account Health (Neutral Topic Grades)</h2><table><thead><tr><th>Area</th><th>Grade</th><th>Verified Receipt</th></tr></thead><tbody>{grade_rows}</tbody></table></div></div>
  <div id="t3" class="tpane"><div class="card"><h2>Tracking &amp; Real-Lead Integrity</h2><p>{'<strong>ALERT:</strong> ' + esc('; '.join(a['break_reasons'])) if a['break_reasons'] else 'Tracking continuity and Non-Brand CVR (' + str(a['non_brand']['cvr_pct']) + '%) appear within normal bounds. Confirm Primary actions exclude 5s calls, button clicks, and page views.'}</p></div></div>
  <div id="t4" class="tpane"><div class="card"><h2>Ads &amp; Landing Pages</h2><p class="muted">Pair high-CTR / low-CVR campaigns directly with Landing Page Studio (`landing-page`) and RSA linting (`rsa-asset-writer`) so ad promise and screen one match.</p></div></div>
  <div id="t5" class="tpane"><div class="card"><h2>Team Notes &amp; Persistent "Not Right?" Memory</h2><p class="muted">Rejections logged below persist in browser storage so dismissed moves stop coming back in future runs.</p><ul id="rej-list"><li class="muted">No dismissed items logged yet.</li></ul></div></div>
  <div id="t6" class="tpane"><div class="card"><h2>Full Campaign Data (Zero Unsolicited Advice)</h2><table><thead><tr><th>Campaign</th><th>Segment</th><th>Bidding</th><th>Cost</th><th>Clicks</th><th>Conv</th><th>Lost IS (B/R)</th></tr></thead><tbody>{camp_rows}</tbody></table></div></div>
</main>
<script>
const K='ppcio_os_{esc(a["account"])}';
function st(b,id){{document.querySelectorAll('.tbtn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tpane').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');}}
function saveTick(id,v){{const d=JSON.parse(localStorage.getItem(K)||'{{}}');d[id]=v;localStorage.setItem(K,JSON.stringify(d));}}
function flagWrong(id,title){{const why=prompt('Why is "'+title+'" not right? (Saved to team rejection memory)');if(!why)return;const d=JSON.parse(localStorage.getItem(K+'_rej')||'[]');d.push({{id,title,why,at:new Date().toISOString().slice(0,10)}});localStorage.setItem(K+'_rej',JSON.stringify(d));renderRej();}}
function renderRej(){{const d=JSON.parse(localStorage.getItem(K+'_rej')||'[]');if(!d.length)return;document.getElementById('rej-list').innerHTML=d.map(x=>'<li><strong>'+x.title+'</strong>: '+x.why+' ('+x.at+')</li>').join('');}}
renderRej();
</script></body></html>"""


def render_proto_c(state, org, t):
    c = state["currency"]
    a = state["accounts"][0]
    opp = a["opportunities"]
    prot = "".join(f"<li><strong>{esc(p['campaign'])}:</strong> {esc(p['reason'])}</li>" for p in a["protect_healthy"]) or "<li>Baseline winners verified before any structural change.</li>"
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(a['account'])} - Revenue Opportunity Audit Board</title><style>{css(t)}</style></head><body>
<header class="top"><strong>{esc(org)} &middot; Revenue Opportunity Audit</strong><a class="pill" href="index.html">All Prototypes</a></header>
<main class="wrap">
  <span class="pill">Prototype C: Revenue-First Opportunity &amp; Executive Pitch Board</span>
  <h1 style="margin-top:8px;">{esc(a['account'])}: Verified Recovery Opportunity</h1>
  <p class="muted">Built on visible arithmetic receipts, never confected health scores or guaranteed ROAS hype.</p>

  <div class="grid3">
    <div class="card"><div class="muted">Reclaimable Waste (Conservative 40%)</div><div class="stat" style="color:var(--accent);">{c}{opp['reclaimable_waste_est']:,.0f}</div><div class="muted">{esc(opp['waste_formula'])}</div></div>
    <div class="card"><div class="muted">Post-Click CVR Opportunity</div><div class="stat">+{opp['lp_cvr_extra_leads_est']}</div><div class="muted">Extra conversions if leaking LPs lift +1.5 pts</div></div>
    <div class="card"><div class="muted">Unmet Profitable Search Headroom</div><div class="stat" style="color:var(--good);">{c}{opp['budget_headroom_est']:,.0f}</div><div class="muted">From profitable campaigns losing IS to budget</div></div>
  </div>

  <div class="card">
    <h2>3-Phase 90-Day Recovery Sequence</h2>
    <ol>
      <li><strong>Phase 1 (Days 1 to 14 - Tracking &amp; Waste Stop):</strong> Verify clean Primary conversion signals, wait 7 days (Conversion Sequencing Law), and trim proven waste.</li>
      <li><strong>Phase 2 (Days 15 to 45 - Reallocate &amp; Fix Post-Click):</strong> Shift recovered spend to proven winners and match landing page screen one to search intent.</li>
      <li><strong>Phase 3 (Days 46 to 90 - Controlled Scale):</strong> Expand profitable Non-Brand headroom in 15% to 20% steps only while marginal CPA holds below goal.</li>
    </ol>
  </div>

  <div class="card">
    <h2>What Is Already Working (Protect First)</h2>
    <ul>{prot}</ul>
  </div>
</main></body></html>"""


def render_picker(state, org, t):
    cnt = state["portfolio_counts"]
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(org)} - PPC Operations &amp; Audit OS Prototypes</title><style>{css(t)}</style></head><body>
<header class="top"><strong>{esc(org)} &middot; PPC Operations &amp; Audit OS Studio</strong><span class="pill">3 Live Prototypes Ready</span></header>
<main class="wrap">
  <h1>PPC Operations &amp; Audit OS Prototypes ({len(state['accounts'])} Account{'s' if len(state['accounts'])!=1 else ''})</h1>
  <p class="muted">Portfolio snapshot: {cnt['BROKEN']} Broken &middot; {cnt['AT_RISK']} At Risk &middot; {cnt['WIN']} Winning &middot; {cnt['FINE']} Fine. All 3 prototypes share one verified <code>ops_state.json</code>.</p>
  <div class="grid3">
    <div class="card"><span class="pill p-bad">Best for Agencies &amp; Multi-Brand Ops</span><h2 style="margin-top:10px;">A. Morning Ops &amp; Batch Queue</h2><p class="muted">Noise-disciplined risk triage, dependency-gated team batches (Tracking -> Web -> PPC), and Google Ads Editor CSV exports.</p><a class="tbtn active" style="display:inline-block;" href="prototype-a-morning-ops-command.html">Open Prototype A</a></div>
    <div class="card"><span class="pill">Best for Weekly Account Management</span><h2 style="margin-top:10px;">B. 6-Tab Causal Audit Workbench</h2><p class="muted">Monday Overview with 5-Part Findings, neutral A-D grades, Tracking check, interactive checkboxes, and persistent 'Not right?' memory.</p><a class="tbtn active" style="display:inline-block;" href="prototype-b-deep-audit-workbench.html">Open Prototype B</a></div>
    <div class="card"><span class="pill p-good">Best for New-Biz Pitch or CFO Buy-In</span><h2 style="margin-top:10px;">C. Revenue Opportunity Board</h2><p class="muted">Transparent waste/CVR/headroom arithmetic, 3-phase 90-day roadmap, and explicit 'What Is Working' restraint block.</p><a class="tbtn active" style="display:inline-block;" href="prototype-c-opportunity-pitch-board.html">Open Prototype C</a></div>
  </div>
</main></body></html>"""


def main():
    ap = argparse.ArgumentParser(description="Render 3 live Agency & In-House PPC Ops OS HTML prototypes")
    ap.add_argument("--state", required=True, help="Path to ops_state.json from ops_engine.py")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--org", default="Paid Search Operations")
    ap.add_argument("--theme", choices=list(THEMES.keys()), default="editorial-warm")
    ap.add_argument("--accent", default="")
    args = ap.parse_args()

    state = json.loads(Path(args.state).read_text(encoding="utf-8"))
    t = dict(THEMES[args.theme])
    if args.accent:
        t["accent"] = args.accent.strip()
    out = Path(args.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "prototype-a-morning-ops-command.html").write_text(render_proto_a(state, args.org, t), encoding="utf-8")
    (out / "prototype-b-deep-audit-workbench.html").write_text(render_proto_b(state, args.org, t), encoding="utf-8")
    (out / "prototype-c-opportunity-pitch-board.html").write_text(render_proto_c(state, args.org, t), encoding="utf-8")
    (out / "index.html").write_text(render_picker(state, args.org, t), encoding="utf-8")
    print(f"3 Ops/Audit OS Prototypes ready: {(out / 'index.html').resolve()}")


if __name__ == "__main__":
    main()
