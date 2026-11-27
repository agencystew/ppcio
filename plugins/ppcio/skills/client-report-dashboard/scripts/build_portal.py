#!/usr/bin/env python3
"""Build per-client report archive hubs + master agency admin hub from dated HTML reports.

Pure Python 3 stdlib (zero dependencies). Never hardcodes an agency name or brand palette.

Folder convention:
    <root>/<client-slug>/<YYYY-MM-DD>.html
    -> writes <root>/<client-slug>/index.html (per-client archive)
    -> writes <root>/admin/index.html (master agency hub across all clients)

Usage:
    python3 build_portal.py reports --agency "Northstar Digital" --email "reports@northstar.co" --accent "#0f766e" --theme executive-clean
"""
import argparse
import datetime as dt
import html
import re
from pathlib import Path

DATE_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})\.html$")
THEMES = {
    "executive-clean": ("#f8fafc", "#ffffff", "#0f172a", "#475569", "#e2e8f0", "#2563eb", "system-ui,-apple-system,sans-serif"),
    "editorial-warm": ("#f6f4ee", "#ffffff", "#141915", "#5f665d", "#dfd9cc", "#2f5d46", "Georgia,serif"),
    "modern-dark": ("#0b1120", "#111827", "#f8fafc", "#94a3b8", "#1f2937", "#38bdf8", "system-ui,-apple-system,sans-serif"),
    "bold-contrast": ("#ffffff", "#f4f4f5", "#09090b", "#52525b", "#18181b", "#18181b", "system-ui,-apple-system,sans-serif"),
}


def esc(s: str) -> str:
    return html.escape(s or "", quote=True)


def fmt_date(iso: str) -> str:
    return dt.date.fromisoformat(iso).strftime("%B %d, %Y").replace(" 0", " ")


def pretty_name(slug: str) -> str:
    return " ".join(w.capitalize() for w in re.split(r"[-_]+", slug) if w)


def page_shell(title: str, eyebrow: str, heading: str, lede: str, body: str, footer: str, theme: str, accent: str) -> str:
    bg, card, ink, muted, line, def_accent, hfont = THEMES.get(theme, THEMES["executive-clean"])
    acc = accent or def_accent
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{esc(title)}</title>
<style>
:root{{--bg:{bg};--card:{card};--ink:{ink};--muted:{muted};--line:{line};--accent:{acc}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,sans-serif}}
.wrap{{max-width:780px;margin:0 auto;padding:64px 24px 96px}}
.eyebrow{{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}}
h1{{margin:0 0 12px;font:700 clamp(32px,5vw,44px)/1.08 {hfont};letter-spacing:-.02em}}
.lede{{margin:0 0 36px;color:var(--muted);max-width:60ch}}
h2{{margin:36px 0 12px;font:700 22px/1.2 {hfont}}}
ul.list{{list-style:none;margin:0;padding:0;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}}
ul.list li a{{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 20px;border-bottom:1px solid var(--line);text-decoration:none;color:var(--ink);transition:background .15s}}
ul.list li:last-child a{{border-bottom:0}}
ul.list li a:hover{{background:var(--bg);color:var(--accent)}}
.tag{{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);border:1px solid var(--accent);padding:2px 8px;border-radius:999px;margin-left:10px}}
footer{{margin-top:48px;color:var(--muted);font-size:13px}}
</style>
</head>
<body><main class="wrap">
  <div class="eyebrow">{esc(eyebrow)}</div>
  <h1>{esc(heading)}</h1>
  <p class="lede">{esc(lede)}</p>
  {body}
  <footer>{esc(footer)}</footer>
</main></body></html>
"""


def main():
    p = argparse.ArgumentParser(description="Build per-client and agency admin report archive hubs.")
    p.add_argument("root", help="Folder holding <client-slug>/<YYYY-MM-DD>.html files")
    p.add_argument("--agency", default="Your Agency", help="Agency name")
    p.add_argument("--email", default="", help="Contact email for footer")
    p.add_argument("--accent", default="", help="Brand accent hex colour (e.g. #0f766e)")
    p.add_argument("--theme", default="executive-clean", choices=list(THEMES.keys()))
    args = p.parse_args()

    root = Path(args.root)
    clients = []
    for d in sorted(root.iterdir()):
        if not d.is_dir() or d.name in ("admin", "_generator", "node_modules") or d.name.startswith("."):
            continue
        reports = sorted([f.name for f in d.iterdir() if DATE_RE.match(f.name)], reverse=True)
        if not reports:
            continue
        cname = pretty_name(d.name)
        items = "".join(
            f'<li><a href="./{esc(r)}"><span><strong>{esc(fmt_date(r[:-5]))}</strong>'
            f'{"<span class=tag>Latest</span>" if i == 0 else ""}</span><span>&rarr;</span></a></li>'
            for i, r in enumerate(reports)
        )
        foot = f"Managed by {args.agency}" + (f" · {args.email}" if args.email else "")
        (d / "index.html").write_text(
            page_shell(
                f"{cname} — Performance Reports",
                args.agency,
                cname,
                "Your Google Ads performance reports, newest first.",
                f'<ul class="list">{items}</ul>',
                foot,
                args.theme,
                args.accent,
            ),
            encoding="utf-8",
        )
        clients.append((d.name, cname, reports))

    admin = root / "admin"
    admin.mkdir(parents=True, exist_ok=True)
    sections = []
    for slug, cname, reports in clients:
        items = "".join(
            f'<li><a href="../{esc(slug)}/{esc(r)}"><span><strong>{esc(fmt_date(r[:-5]))}</strong>'
            f'{"<span class=tag>Latest</span>" if i == 0 else ""}</span><span>&rarr;</span></a></li>'
            for i, r in enumerate(reports)
        )
        sections.append(f'<h2>{esc(cname)}</h2><ul class="list">{items}</ul>')
    (admin / "index.html").write_text(
        page_shell(
            f"{args.agency} — All Client Reports",
            f"{args.agency} · Agency Hub",
            "All Client Reports",
            f"{len(clients)} client portals indexed. Keep this admin link private.",
            "".join(sections) or "<p>No client reports found yet.</p>",
            f"{args.agency} Internal Report Hub",
            args.theme,
            args.accent,
        ),
        encoding="utf-8",
    )
    print(f"Built {len(clients)} client hubs + {admin / 'index.html'}")


if __name__ == "__main__":
    main()
