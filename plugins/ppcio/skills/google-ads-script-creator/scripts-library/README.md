# Production Google Ads Scripts Library (21 Ready-to-Run Scripts)

Every script below is production-tested, GAQL-first, and ready to paste into Google Ads (**Tools & Settings > Bulk Actions > Scripts**). Update the `CONFIG` block at the top, run in **Preview** mode first, then schedule.

## Core Export & Intelligence Scripts (01–08)

| File | What It Does | Output |
|---|---|---|
| `01-account-snapshot-export.js` | Full account performance snapshot across campaigns and KPIs | Google Sheet |
| `02-search-term-ai-ready-export.js` | Search terms formatted cleanly for AI mining & negative analysis | Google Sheet |
| `03-ad-copy-performance-matrix.js` | Side-by-side RSA & ad copy performance comparison | Google Sheet |
| `04-pmax-asset-performance-dump.js` | Performance Max asset group & asset-level performance dump | Google Sheet |
| `05-negative-keyword-gap-finder.js` | Finds wasted search terms missing from negative lists across campaigns | Google Sheet |
| `06-competitor-auction-insights-export.js` | Exports competitor impression share & overlap trends | Google Sheet |
| `07-landing-page-ad-mismatch-detector.js` | Flags ad-to-landing-page URL, status, and relevance mismatches | Google Sheet |
| `08-budget-pacing-intelligence.js` | Monthly budget pacing projections and daily spend alerts | Google Sheet / Email |

## Optimization & Hygiene Scripts (09–17)

| File | What It Does | Output |
|---|---|---|
| `09-make-exact-match-exact.js` | Automatically negates close-variant drift on Exact Match ad groups | Automation / Sheet |
| `10-extension-performance-audit.js` | Audits sitelinks, callouts, and structured snippets across campaigns | Google Sheet |
| `11-conversion-action-health-check.js` | Flags broken, zero-volume, or misconfigured conversion actions | Google Sheet / Alert |
| `12-quality-score-tracker.js` | Tracks Quality Score and component shifts over time | Google Sheet |
| `13-shared-negative-list-manager.js` | Applies and maintains shared negative keyword lists cleanly | Automation |
| `14-shopping-performance-export.js` | SKU / product-group Shopping performance breakdown | Google Sheet |
| `15-ab-testing-statistical-significance.js` | Statistical significance calculator for ad copy A/B tests | Google Sheet |
| `16-hourly-bid-adjustment.js` | Day-of-week and hour-of-day performance analysis & bid schedules | Automation / Sheet |
| `17-wasted-spend-forensics.js` | Deep zero-conversion wasted spend audit across placements, terms, geo, devices | Google Sheet |

## MCC, PMax & Advanced Automation (18–22)

| File | What It Does | Output |
|---|---|---|
| `18-mcc-account-health-dashboard.js` | Multi-account MCC health scorecard in one central sheet | MCC Google Sheet |
| `20-ai-keyword-expansion-engine.js` | Surfaces high-converting search terms ready for exact-match promotion | Google Sheet |
| `21-pmax-insight-engine.js` | PMax channel split (Shopping/Search/Display/Video), search themes & waste | Google Sheet / Email |
| `22-mcc-daily-monitor.js` | Daily MCC anomaly monitor (spend spikes, zero-impression drops, disapproval alerts) | MCC Email Alert |
