#!/usr/bin/env python3
"""Package ANY bespoke AI-authored winning HTML report into a $0/mo token-gated multi-client static portal.

Preserves 100% of the bespoke HTML built by the buyer's AI (never overwrites with generic templates),
injects noindex protection if missing, maintains persistent portal-manifest.json across multiple clients
and weeks, and styles the Client Archive and Private Agency Admin index using the agency's harvested brand.json.
"""
import argparse
import hashlib
import html
import json
import re
from pathlib import Path


def esc(s):
    return html.escape("" if s is None else str(s))


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "client").lower()).strip("-") or "client"


def token_for(seed, length=10):
    return hashlib.sha256(seed.encode("utf-8")).hexdigest()[:length]


def ensure_noindex(page_html):
    if re.search(r'<meta[^>]+name=["\']robots["\']', page_html, re.I):
        return page_html
    if re.search(r"<head[^>]*>", page_html, re.I):
        return re.sub(r"(<head[^>]*>)", r'\1\n<meta name="robots" content="noindex,nofollow">', page_html, count=1, flags=re.I)
    return '<meta name="robots" content="noindex,nofollow">\n' + page_html


def shell_css(brand):
    col = brand.get("colors") or {}
    typ = brand.get("typography") or {}
    bg = col.get("bg") or "#f8f9fb"
    surf = col.get("surface") or "#ffffff"
    ink = col.get("ink") or "#111827"
    muted = col.get("muted") or "#526071"
    acc = col.get("accent") or "#2563eb"
    is_dark = brand.get("polarity") == "dark"
    border = "#262b38" if is_dark else "#e5e7eb"
    df = typ.get("display") or "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    bf = typ.get("body") or "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    links = "".join(f'<link rel="stylesheet" href="{esc(u)}">' for u in (brand.get("font_stylesheets") or [])[:3])
    return links, (
        f":root{{--bg:{bg};--surf:{surf};--ink:{ink};--muted:{muted};--acc:{acc};--bd:{border};}}"
        f"*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font-family:{bf};line-height:1.55;}}"
        f".wrap{{max-width:960px;margin:0 auto;padding:36px 20px 64px}}h1,h2{{font-family:{df};letter-spacing:-.02em;margin:0 0 10px}}"
        f".card{{background:var(--surf);border:1px solid var(--bd);border-radius:14px;padding:24px;margin-top:18px}}"
        f"table{{width:100%;border-collapse:collapse;font-size:14px}}th,td{{text-align:left;padding:12px 10px;border-bottom:1px solid var(--bd)}}"
        f"th{{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}}"
        f"a{{color:var(--acc);font-weight:600;text-decoration:none}}a:hover{{text-decoration:underline}}"
        f".muted{{color:var(--muted);font-size:14px}}"
    )


def pack_portal(html_path, facts, portal_dir, agency, brand=None):
    brand = brand or {}
    pdir = Path(portal_dir)
    pdir.mkdir(parents=True, exist_ok=True)
    (pdir / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")

    slug = slugify(facts["client_name"])
    tok = token_for(f"{agency}:{slug}:client", 10)
    admin_tok = token_for(f"{agency}:admin-index", 12)
    wk = facts["_week"]
    cur = facts["totals"]["current"]
    c = facts["currency"]

    cdir = pdir / "r" / f"{slug}-{tok}"
    cdir.mkdir(parents=True, exist_ok=True)

    bespoke_html = ensure_noindex(Path(html_path).read_text(encoding="utf-8"))
    (cdir / f"{wk}.html").write_text(bespoke_html, encoding="utf-8")
    (cdir / "latest.html").write_text(bespoke_html, encoding="utf-8")

    manifest_path = pdir / "portal-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"agency": agency, "clients": {}}
    manifest["agency"] = agency
    client_entry = manifest["clients"].get(slug) or {"name": facts["client_name"], "dir": f"{slug}-{tok}", "weeks": {}}
    client_entry["name"] = facts["client_name"]
    client_entry["dir"] = f"{slug}-{tok}"
    client_entry["latest_week"] = wk
    client_entry["latest_period"] = facts["period"]
    client_entry["latest_spend"] = f"{c}{cur['cost']:,.0f}"
    client_entry["latest_conv"] = f"{cur['conversions']:,.0f} {facts['conversion_label']}"
    client_entry["weeks"][wk] = {"period": facts["period"], "spend": f"{c}{cur['cost']:,.0f}", "conv": f"{cur['conversions']:,.0f}"}
    manifest["clients"][slug] = client_entry
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    font_links, css_txt = shell_css(brand)

    # Client archive index
    wk_items = "".join(
        f"<tr><td><strong>{esc(w)}</strong></td><td>{esc(info['period'])}</td><td>{esc(info['spend'])}</td><td>{esc(info['conv'])}</td><td><a href='{esc(w)}.html'>Open report</a></td></tr>"
        for w, info in sorted(client_entry["weeks"].items(), reverse=True)
    )
    (cdir / "index.html").write_text(
        f"<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
        f"<meta name='robots' content='noindex,nofollow'>{font_links}<title>{esc(facts['client_name'])} - Report Archive</title><style>{css_txt}</style></head><body>"
        f"<div class='wrap'><div class='muted'>{esc(agency)}</div><h1>{esc(facts['client_name'])}</h1>"
        f"<p class='muted'><a href='latest.html'>Open latest report ({esc(facts['period'])})</a></p>"
        f"<div class='card'><h2>Report Archive</h2><table><thead><tr><th>Week</th><th>Period</th><th>Spend</th><th>Results</th><th>Link</th></tr></thead><tbody>{wk_items}</tbody></table></div>"
        f"</div></body></html>",
        encoding="utf-8",
    )

    # Private agency admin index (all clients aggregated)
    adir = pdir / "admin" / admin_tok
    adir.mkdir(parents=True, exist_ok=True)
    rows = "".join(
        f"<tr><td><strong>{esc(cl['name'])}</strong></td><td>{esc(cl['latest_period'])}</td>"
        f"<td>{esc(cl.get('latest_spend', '-'))}</td><td>{esc(cl.get('latest_conv', '-'))}</td>"
        f"<td><a href='../../r/{esc(cl['dir'])}/latest.html'>Latest</a> &middot; <a href='../../r/{esc(cl['dir'])}/index.html'>Archive ({len(cl['weeks'])})</a></td></tr>"
        for _, cl in sorted(manifest["clients"].items(), key=lambda kv: kv[1]["name"].lower())
    )
    (adir / "index.html").write_text(
        f"<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>"
        f"<meta name='robots' content='noindex,nofollow'>{font_links}<title>{esc(agency)} - Private Client Portal</title><style>{css_txt}</style></head><body>"
        f"<div class='wrap'><div class='muted'>Private Agency Portal &middot; $0/mo Static Hosting</div><h1>{esc(agency)}</h1>"
        f"<p class='muted'>Token-gated, noindex links ready for Cloudflare Pages, Netlify, or GitHub Pages. {len(manifest['clients'])} active client(s).</p>"
        f"<div class='card'><table><thead><tr><th>Client</th><th>Latest Period</th><th>Spend</th><th>Results</th><th>Links</th></tr></thead><tbody>{rows}</tbody></table></div>"
        f"</div></body></html>",
        encoding="utf-8",
    )
    return cdir / "latest.html", adir / "index.html"


def main():
    ap = argparse.ArgumentParser(description="Pack bespoke AI-authored HTML report into $0/mo multi-client static portal")
    ap.add_argument("--html", required=True, help="Path to winning bespoke HTML file (e.g. final/page.html)")
    ap.add_argument("--facts", required=True, help="Path to verified facts.json")
    ap.add_argument("--portal", required=True, help="Output static portal directory (e.g. reports/portal-dist)")
    ap.add_argument("--agency", default="Performance Reporting")
    ap.add_argument("--brand-json", default="", help="Optional inputs/brand.json from brand_harvest.cjs")
    args = ap.parse_args()

    facts = json.loads(Path(args.facts).read_text(encoding="utf-8"))
    brand = json.loads(Path(args.brand_json).read_text(encoding="utf-8")) if args.brand_json and Path(args.brand_json).exists() else {}
    client_latest, admin_index = pack_portal(args.html, facts, args.portal, args.agency, brand)
    print(f"Portal client latest: {client_latest.resolve()}")
    print(f"Portal private admin: {admin_index.resolve()}")


if __name__ == "__main__":
    main()
