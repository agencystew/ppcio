# Automating Data Pulls & Deploying White-Label Static Client Portals ($0/Month)

Once the user picks or blends their favourite prototype (A: Executive Dashboard, B: Mobile Brief, or C: Dual-View Call Prep + Client View), help them turn it into a permanent, automated reporting system that replaces TapClicks / Swydo / Looker Studio completely.

## 1. Zero-Cost Data Pull Options (Works for Agencies & In-House)

1. **Fastest Start (Today - 30 Seconds):** Export Google Ads Campaigns segmented by Day (last 90 days) + optional Search Terms & Change History CSVs, drop them in the folder, and run `build_facts.py` -> `render_prototypes.py`.
2. **Automated Weekly Pull via Google Ads Script (No API Approval Needed):** Use `google-ads-script-creator` (`scripts-library/` AI-ready export scripts) scheduled every Monday at 06:00 AM to export Mon-Sun complete week + 90-day daily metrics to Google Sheets / CSV.
3. **Direct API / MCP Automation (Multi-Account Agencies & In-House Teams):** Use `connect-data-sources` (Google Ads MCP / GAQL + GA4 + Meta Ads + Microsoft Clarity). Always enforce two hard production guards:
   - **Transient 500 Retry Guard:** Retry Google Ads `500 Internal error` up to 3 times with backoff so an API hiccup never renders a false `$0 week`.
   - **Config-to-Account Mismatch Abort:** Hard-abort any batch run if the returned Google Ads account name disagrees with the client config so Client A's numbers can NEVER render under Client B's header.

## 2. Per-Client YAML Config + Account Book Pattern

For agencies managing 5 to 100+ clients (or in-house teams managing multi-region / multi-brand accounts), keep one lightweight folder per client:
- `clients/<slug>/config.yaml`: `client_name`, `account_type`, `brand_terms`, `monthly_budget`, `target_cpa` / `target_roas`, `conversion_label`, `brand_override` (optional per-client accent/logo).
- `clients/<slug>/book.yaml`: agreed quarterly goals, active tests with check-in dates, call cadence, and explicit client promises (logged ONLY on firm commitment, never "we should look into").

## 3. Token-Gated White-Label Static Portal ($0/Month Hosting)

Running `render_prototypes.py --portal ./portal-dist` outputs a complete, zero-backend static site:
- `/r/<slug>-<token>/latest.html` : Always shows the newest verified report (bookmarkable client link).
- `/r/<slug>-<token>/<YYYY-MM-DD>/index.html` : Immutable dated historical snapshots.
- `/r/<slug>-<token>/index.html` : Per-client report archive hub.
- `/admin/<admin-token>/index.html` : Private agency/team master hub listing every client's latest status & pacing (`noindex,nofollow`).

Deploy `./portal-dist` free in 60 seconds via **Cloudflare Pages** (`wrangler pages deploy ./portal-dist`), **Netlify Drop**, or any internal intranet/S3 bucket under your own custom domain (`reports.youragency.com` or `growth.yourcompany.com`).
