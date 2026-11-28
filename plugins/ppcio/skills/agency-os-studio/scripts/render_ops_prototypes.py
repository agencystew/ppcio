#!/usr/bin/env python3
"""Agency & In-House PPC Operations / Audit OS Studio: 3-Prototype Interactive Workbench Renderer.

From one verified ops_state.json, renders 3 live clickable HTML prototypes straight off the bat:
  1. prototype-a-morning-ops-command.html     (Portfolio Risk Screen + Dependency-Gated Team Batches + Drill-down)
  2. prototype-b-deep-audit-workbench.html    (6-Tab Multi-Account Audit OS w/ switcher, persistent ticks & safe 'Not right?' log)
  3. prototype-c-opportunity-pitch-board.html (Multi-Account Revenue Opportunity Pitch Board w/ Restraint block)
  + index.html                                (Side-by-side Ops Studio Prototype Picker)

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


def fmt_cpa(c, val):
    return f"{c}{val:,.2f}" if val is not None else "N/A"


def plural(n, word):
    return f"{n} {word}" if n == 1 else f"{n} {word}s"


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
  .btn-sm,select{{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:6px 12px;font-size:13px;color:var(--ink);cursor:pointer;}}
  .stat{{font-family:var(--hf);font-size:30px;font-weight:700;line-height:1.1;margin:6px 0;}}
  .locked{{opacity:.72;}}
"""


def render_proto_a(state, org, t):
    c = state["currency"]
    cnt = state["portfolio_counts"]
    b = state["batches"]
    acct_idx = {a["account"]: i for i, a in enumerate(state["accounts"])}
    actionable = [a for a in state["accounts"] if a["state"] in ("BROKEN", "AT_RISK", "FEW_DATA")]
    healthy_total = cnt["FINE"] + cnt["WIN"]

    acct_rows = []
    for a in actionable:
        cls = "p-bad" if a["state"] == "BROKEN" else "p-warn"
        top_mv = a["top_moves"][0]["title"] if a["top_moves"] else "Review account"
        idx = acct_idx[a["account"]]
        acct_rows.append(
            f"<tr><td><a href='prototype-b-deep-audit-workbench.html#acct-{idx}'><strong>{esc(a['account'])}</strong></a></td>"
            f"<td><span class='pill {cls}'>{esc(a['state'])}</span></td>"
            f"<td>{c}{a['non_brand']['cost']:,.0f}</td><td>{a['non_brand']['conversions']:.0f}</td>"
            f"<td>{esc(fmt_cpa(c, a['non_brand']['cpa']))}</td><td>{esc(top_mv)}</td></tr>"
        )
    if not acct_rows:
        acct_rows.append("<tr><td colspan='6' class='muted'>Zero broken or at-risk accounts today. Silence is the default.</td></tr>")

    def batch_list(items, empty_msg, prefix, locked=False):
        if not items:
            return f"<p class='muted'>{esc(empty_msg)}</p>"
        lis = []
        for i, x in enumerate(items):
            bid = f"{prefix}_{i}"
            task_txt = x["task"].strip()
            camp = (x.get("campaign") or "").strip()
            label_body = task_txt if (not camp or camp.lower() in task_txt.lower()) else f"{camp}: {task_txt}"
            dis = " disabled title='Locked until tracking is restored'" if locked else f" onchange=\"saveA('{bid}',this.checked)\""
            lis.append(
                f"<li class='{'locked' if locked else ''}'><label><input type='checkbox' data-bid='{bid}'{dis}> "
                f"<strong>{esc(x['account'])}</strong>: {esc(label_body)}</label></li>"
            )
        return "<ul>" + "".join(lis) + "</ul>"

    ed_notes = []
    if state.get("editor_csv"):
        ed_notes.append(f"PPC Batch Action Queue CSV: <code>{esc(state['editor_csv'])}</code>")
    if state.get("editor_pause_csv"):
        ed_notes.append(f"Google Ads Editor Pause Bleeders Import CSV: <code>{esc(state['editor_pause_csv'])}</code>")
    ed_html = f"<p class='muted'>{' &middot; '.join(ed_notes)}</p>" if ed_notes else ""

    quiet_line = (
        f"{plural(healthy_total, 'healthy/winning account')} collapsed ({cnt['WIN']} beating target by >15%, {cnt['FINE']} steady) and need nothing this week."
        if healthy_total > 0 else "No healthy accounts collapsed this week."
    )

    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(org)} - Morning Ops &amp; Batch-by-Task Command Center</title><style>{css(t)}</style></head><body>
<header class="top"><strong>{esc(org)} &middot; PPC Ops OS</strong><a class="pill" href="index.html">All Prototypes</a></header>
<main class="wrap">
  <span class="pill">Prototype A: Morning Ops Triage &amp; Batch-by-Task Queue</span>
  <h1 style="margin-top:8px;">Portfolio Morning Triage</h1>
  <p class="muted">Noise-disciplined risk queue: click any account to open its 6-tab deep audit workbench. Healthy accounts collapse to a single count.</p>

  <div class="grid3">
    <div class="card"><div class="muted">Broken (Fix Tracking First)</div><div class="stat" style="color:var(--bad);">{cnt['BROKEN']}</div></div>
    <div class="card"><div class="muted">At Risk / Few Data</div><div class="stat" style="color:var(--warn);">{cnt['AT_RISK'] + cnt['FEW_DATA']}</div></div>
    <div class="card"><div class="muted">Healthy / Winning (Need Nothing Today)</div><div class="stat" style="color:var(--good);">{healthy_total}</div></div>
  </div>

  <div class="card">
    <h2>Priority Accounts Needing Action</h2>
    <table><thead><tr><th>Account</th><th>State</th><th>Non-Brand Spend</th><th>Conv</th><th>NB CPA</th><th>#1 Move</th></tr></thead>
    <tbody>{''.join(acct_rows)}</tbody></table>
    <p class="muted" style="margin-top:14px;">{esc(quiet_line)}</p>
  </div>

  <div class="card">
    <h2>Dependency-Gated Team Batches (Playbook Order)</h2>
    <p class="muted">Traffic tweaks on broken-tracking accounts are automatically locked in <strong>Waiting on tracking</strong> so nobody wastes edits on corrupted data.</p>
    {ed_html}
    <div class="grid2">
      <div class="move"><h3>1. Tracking Help Desk ({len(b['tracking'])})</h3>{batch_list(b['tracking'], 'All tracking clean.', 'trk')}</div>
      <div class="move"><h3>2. Web / Landing Page Team ({len(b['web_lp'])})</h3>{batch_list(b['web_lp'], 'No severe post-click leaks.', 'web')}</div>
      <div class="move"><h3>3. PPC Managers: Ready Now ({len(b['ppc_ready'])})</h3>{batch_list(b['ppc_ready'], 'No urgent traffic waste.', 'ppc')}</div>
      <div class="move"><h3>4. PPC Held: Waiting on Tracking ({len(b['ppc_waiting_on_tracking'])})</h3>{batch_list(b['ppc_waiting_on_tracking'], 'Zero traffic tasks blocked.', 'hld', locked=True)}</div>
    </div>
  </div>
</main>
<script>
const AK='ppcio_ops_a_{esc(org)}';
function saveA(id,v){{const d=JSON.parse(localStorage.getItem(AK)||'{{}}');d[id]=v;localStorage.setItem(AK,JSON.stringify(d));}}
(function(){{const d=JSON.parse(localStorage.getItem(AK)||'{{}}');document.querySelectorAll('input[data-bid]').forEach(el=>{{if(!el.disabled && d[el.dataset.bid])el.checked=true;}});}})();
</script></body></html>"""


def render_proto_b(state, org, t):
    c = state["currency"]
    opts = "".join(f"<option value='{i}'>{esc(a['account'])} ({esc(a['state'])})</option>" for i, a in enumerate(state["accounts"]))
    data_json = json.dumps({"currency": c, "accounts": state["accounts"]}).replace("</", "<\\/")

    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(org)} - 6-Tab Causal Audit Workbench</title><style>{css(t)}</style></head><body>
<header class="top">
  <strong>{esc(org)} &middot; 6-Tab Deep Audit OS</strong>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
    <label class="muted" for="acct-sel">Account:</label>
    <select id="acct-sel" onchange="renderAcct(Number(this.value))">{opts}</select>
    <a class="pill" href="index.html">All Prototypes</a>
  </div>
</header>
<main class="wrap">
  <span class="pill">Prototype B: 6-Tab Deep Causal Account Audit Workbench</span>
  <h1 id="acct-title" style="margin-top:8px;"></h1>
  <p id="acct-sub" class="muted"></p>

  <div class="tabs">
    <button class="tbtn active" onclick="st(this,'t1')">1. Monday Overview</button>
    <button class="tbtn" onclick="st(this,'t2')">2. Health (A-D)</button>
    <button class="tbtn" onclick="st(this,'t3')">3. Tracking &amp; Quality</button>
    <button class="tbtn" onclick="st(this,'t4')">4. Ads &amp; Landing Pages</button>
    <button class="tbtn" onclick="st(this,'t5')">5. Notes &amp; Rejections</button>
    <button class="tbtn" onclick="st(this,'t6')">6. Full Data</button>
  </div>

  <div id="t1" class="tpane active">
    <div class="card"><h2>Top Prioritized Moves (5-Part Finding Contract)</h2><div id="moves-box"></div></div>
    <div class="card"><h3>What Is Working (Protect These)</h3><ul id="prot-list"></ul></div>
  </div>
  <div id="t2" class="tpane"><div class="card"><h2>Account Health (Neutral Topic Grades)</h2><table><thead><tr><th>Area</th><th>Grade</th><th>Verified Receipt</th></tr></thead><tbody id="grade-rows"></tbody></table></div></div>
  <div id="t3" class="tpane"><div class="card"><h2>Tracking &amp; Real-Lead Integrity</h2><div id="trk-box"></div></div></div>
  <div id="t4" class="tpane"><div class="card"><h2>Ads &amp; Landing Pages (Post-Click Leaks)</h2><div id="lp-box"></div></div></div>
  <div id="t5" class="tpane"><div class="card"><h2>Team Notes &amp; Persistent "Not Right?" Memory</h2><p class="muted">Dismissed moves persist per account in browser storage so rejected advice stops returning.</p><ul id="rej-list"></ul></div></div>
  <div id="t6" class="tpane"><div class="card"><h2>Full Campaign Data (Zero Unsolicited Advice)</h2><table><thead><tr><th>Campaign</th><th>Segment</th><th>Bidding</th><th>Cost</th><th>Clicks</th><th>Conv</th><th>Lost IS (B/R)</th></tr></thead><tbody id="camp-rows"></tbody></table></div></div>
</main>
<script>
const DATA={data_json};
let curIdx=0;
function esc(s){{return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}
function money(v){{return DATA.currency+Number(v||0).toLocaleString(undefined,{{maximumFractionDigits:2,minimumFractionDigits:2}});}}
function st(b,id){{document.querySelectorAll('.tbtn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tpane').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');}}
function keyFor(a){{return 'ppcio_os_'+a.account;}}
function saveTick(id,v){{const k=keyFor(DATA.accounts[curIdx]);const d=JSON.parse(localStorage.getItem(k)||'{{}}');d[id]=v;localStorage.setItem(k,JSON.stringify(d));}}
function flagWrong(id,title){{const why=prompt('Why is "'+title+'" not right? (Saved to team rejection memory)');if(!why)return;const k=keyFor(DATA.accounts[curIdx])+'_rej';const d=JSON.parse(localStorage.getItem(k)||'[]');d.push({{id,title,why,at:new Date().toISOString().slice(0,10)}});localStorage.setItem(k,JSON.stringify(d));renderRej();}}
function renderRej(){{const ul=document.getElementById('rej-list');ul.innerHTML='';const k=keyFor(DATA.accounts[curIdx])+'_rej';const d=JSON.parse(localStorage.getItem(k)||'[]');if(!d.length){{const li=document.createElement('li');li.className='muted';li.textContent='No dismissed items logged yet for this account.';ul.appendChild(li);return;}}d.forEach(x=>{{const li=document.createElement('li');const strong=document.createElement('strong');strong.textContent=x.title;li.appendChild(strong);li.appendChild(document.createTextNode(': '+x.why+' ('+x.at+')'));ul.appendChild(li);}});}}
function renderAcct(idx){{
  curIdx=Math.max(0,Math.min(DATA.accounts.length-1,idx));
  document.getElementById('acct-sel').value=String(curIdx);
  const a=DATA.accounts[curIdx];
  const cls=a.state==='BROKEN'?'p-bad':(a.state==='WIN'||a.state==='FINE'?'p-good':'p-warn');
  document.getElementById('acct-title').innerHTML=esc(a.account)+' <span class="pill '+cls+'">'+esc(a.state)+'</span>';
  const cpaTxt=a.non_brand.cpa!==null?money(a.non_brand.cpa):'N/A';
  document.getElementById('acct-sub').textContent='Non-Brand: '+DATA.currency+Number(a.non_brand.cost).toLocaleString()+' spend | '+a.non_brand.conversions+' conversions | CPA '+cpaTxt+' (goal '+DATA.currency+a.target_cpa+')';
  const saved=JSON.parse(localStorage.getItem(keyFor(a))||'{{}}');
  const mbox=document.getElementById('moves-box');
  if(!a.top_moves.length){{mbox.innerHTML='<p class="muted">Account is healthy; protect current winning campaigns.</p>';}}
  else{{
    mbox.innerHTML=a.top_moves.map((m,i)=>{{
      const mid='m'+(i+1);
      const chk=saved[mid]?' checked':'';
      const dis=m.blocked_by_tracking?' disabled title="Locked until tracking is restored"':'';
      const blk=m.blocked_by_tracking?'<span class="pill p-bad">Waiting on tracking</span> ':'';
      return '<div class="move'+(m.blocked_by_tracking?' locked':'')+'"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;"><div><label><input type="checkbox"'+chk+dis+' data-mid="'+mid+'" onchange="saveTick(this.dataset.mid,this.checked)"> <strong>'+(i+1)+'. '+esc(m.title)+'</strong></label> '+blk+'<span class="pill">'+esc(m.owner)+'</span></div><button class="btn-sm" data-mid="'+mid+'" data-title="'+esc(m.title)+'" onclick="flagWrong(this.dataset.mid,this.dataset.title)">Not right? Tell us why</button></div><p style="margin:8px 0 4px;"><strong>Claim:</strong> '+esc(m.claim)+'</p><p class="muted" style="margin:4px 0;"><strong>Evidence:</strong> '+esc(m.evidence)+'</p><p class="muted" style="margin:4px 0;"><strong>Reading:</strong> '+esc(m.reading)+'</p><p style="margin:6px 0 0;"><strong>Fix:</strong> '+esc(m.fix)+' &middot; <span style="color:var(--accent);font-weight:600;">'+esc(m.est_monthly_gain)+'</span></p></div>';
    }}).join('');
  }}
  document.getElementById('prot-list').innerHTML=a.protect_healthy.length?a.protect_healthy.map(p=>'<li><strong>'+esc(p.campaign)+':</strong> '+esc(p.reason)+'</li>').join(''):'<li class="muted">No confirmed winning campaigns yet.</li>';
  document.getElementById('grade-rows').innerHTML=a.health_grades.map(g=>'<tr><td><strong>'+esc(g.topic)+'</strong></td><td><span class="pill '+(g.grade==='A'?'p-good':(g.grade==='D'?'p-bad':'p-warn'))+'">'+esc(g.grade)+'</span></td><td class="muted">'+esc(g.note)+'</td></tr>').join('');
  document.getElementById('trk-box').innerHTML=a.break_reasons.length?'<p><strong style="color:var(--bad);">ALERT:</strong> '+esc(a.break_reasons.join(' | '))+'</p>':'<p>Tracking continuity and Non-Brand CVR ('+esc(a.non_brand.cvr_pct)+'%) appear within normal bounds. Confirm Primary actions exclude 5-second calls, button clicks, and page views.</p>';
  const lps=a.lp_leak_campaigns||[];
  document.getElementById('lp-box').innerHTML=lps.length?'<table><thead><tr><th>Campaign</th><th>Spend</th><th>Clicks</th><th>CTR</th><th>CVR</th><th>Next Step</th></tr></thead><tbody>'+lps.map(x=>'<tr><td><strong>'+esc(x.campaign)+'</strong></td><td>'+money(x.spend)+'</td><td>'+x.clicks+'</td><td>'+x.ctr_pct+'%</td><td>'+x.cvr_pct+'%</td><td>Run Landing Page Studio &amp; RSA Asset Writer</td></tr>').join('')+'</tbody></table>':'<p class="muted">No severe high-CTR / low-CVR post-click leaks flagged in this account. Pair top spend campaigns with Landing Page Studio when scaling.</p>';
  document.getElementById('camp-rows').innerHTML=a.campaigns.map(cm=>'<tr><td>'+esc(cm.campaign)+'</td><td>'+(cm.is_brand?'Brand':'Non-Brand')+'</td><td>'+esc(cm.bid||'-')+'</td><td>'+money(cm.cost)+'</td><td>'+Math.round(cm.clicks)+'</td><td>'+cm.conv+'</td><td>'+Math.round(cm.lost_b)+'% / '+Math.round(cm.lost_r)+'%</td></tr>').join('');
  renderRej();
}}
const m=location.hash.match(/^#acct-(\d+)$/);
renderAcct(m?Number(m[1]):0);
</script></body></html>"""


def render_proto_c(state, org, t):
    c = state["currency"]
    opts = "".join(f"<option value='{i}'>{esc(a['account'])} ({esc(a['state'])})</option>" for i, a in enumerate(state["accounts"]))
    data_json = json.dumps({"currency": c, "accounts": state["accounts"]}).replace("</", "<\\/")

    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(org)} - Revenue Opportunity Audit Board</title><style>{css(t)}</style></head><body>
<header class="top">
  <strong>{esc(org)} &middot; Revenue Opportunity Audit</strong>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
    <label class="muted" for="opp-sel">Account:</label>
    <select id="opp-sel" onchange="renderOpp(Number(this.value))">{opts}</select>
    <a class="pill" href="index.html">All Prototypes</a>
  </div>
</header>
<main class="wrap">
  <span class="pill">Prototype C: Revenue-First Opportunity &amp; Executive Pitch Board</span>
  <h1 id="opp-h1" style="margin-top:8px;"></h1>
  <p class="muted">Built on visible arithmetic receipts, never confected health scores or guaranteed ROAS hype.</p>

  <div class="grid3">
    <div class="card"><div class="muted">Reclaimable Waste (Conservative 40%)</div><div class="stat" id="o-waste" style="color:var(--accent);"></div><div class="muted" id="o-wform"></div></div>
    <div class="card"><div class="muted">Post-Click CVR Opportunity</div><div class="stat" id="o-cvr"></div><div class="muted">Extra conversions if leaking LPs lift +1.5 pts</div></div>
    <div class="card"><div class="muted">Unmet Profitable Search Headroom</div><div class="stat" id="o-head" style="color:var(--good);"></div><div class="muted">From profitable campaigns losing IS to budget</div></div>
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
    <ul id="o-prot"></ul>
  </div>
</main>
<script>
const DATA={data_json};
function esc(s){{return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}
function renderOpp(idx){{
  const a=DATA.accounts[idx]||DATA.accounts[0];
  const o=a.opportunities;
  document.getElementById('opp-h1').textContent=a.account+': Verified Recovery Opportunity';
  document.getElementById('o-waste').textContent=DATA.currency+Number(o.reclaimable_waste_est).toLocaleString();
  document.getElementById('o-wform').textContent=o.waste_formula;
  document.getElementById('o-cvr').textContent='+'+o.lp_cvr_extra_leads_est;
  document.getElementById('o-head').textContent=DATA.currency+Number(o.budget_headroom_est).toLocaleString();
  document.getElementById('o-prot').innerHTML=a.protect_healthy.length?a.protect_healthy.map(p=>'<li><strong>'+esc(p.campaign)+':</strong> '+esc(p.reason)+'</li>').join(''):'<li class="muted">Baseline winners verified before any structural change.</li>';
}}
renderOpp(0);
</script></body></html>"""


def render_picker(state, org, t):
    cnt = state["portfolio_counts"]
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(org)} - PPC Operations &amp; Audit OS Prototypes</title><style>{css(t)}</style></head><body>
<header class="top"><strong>{esc(org)} &middot; PPC Operations &amp; Audit OS Studio</strong><span class="pill">3 Live Prototypes Ready</span></header>
<main class="wrap">
  <h1>PPC Operations &amp; Audit OS Prototypes ({plural(len(state['accounts']), 'Account')})</h1>
  <p class="muted">Portfolio snapshot: {cnt['BROKEN']} Broken &middot; {cnt['AT_RISK']} At Risk &middot; {cnt['WIN']} Winning &middot; {cnt['FINE']} Fine. All 3 prototypes share one verified <code>ops_state.json</code> and support full multi-account switching.</p>
  <div class="grid3">
    <div class="card"><span class="pill p-bad">Best for Agencies &amp; Multi-Brand Ops</span><h2 style="margin-top:10px;">A. Morning Ops &amp; Batch Queue</h2><p class="muted">Noise-disciplined risk triage with clickable account drill-downs, locked dependency-gated team batches (Tracking -> Web -> PPC), and CSV batch exports.</p><a class="tbtn active" style="display:inline-block;" href="prototype-a-morning-ops-command.html">Open Prototype A</a></div>
    <div class="card"><span class="pill">Best for Weekly Account Management</span><h2 style="margin-top:10px;">B. 6-Tab Causal Audit Workbench</h2><p class="muted">Multi-account switcher, Monday Overview with 5-Part Findings, neutral A-D grades, Tracking check, persistent checkboxes, and 'Not right?' memory.</p><a class="tbtn active" style="display:inline-block;" href="prototype-b-deep-audit-workbench.html">Open Prototype B</a></div>
    <div class="card"><span class="pill p-good">Best for New-Biz Pitch or CFO Buy-In</span><h2 style="margin-top:10px;">C. Revenue Opportunity Board</h2><p class="muted">Multi-account switcher, transparent waste/CVR/headroom arithmetic, 3-phase 90-day roadmap, and explicit 'What Is Working' restraint block.</p><a class="tbtn active" style="display:inline-block;" href="prototype-c-opportunity-pitch-board.html">Open Prototype C</a></div>
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
