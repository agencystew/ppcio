# Brand-Adaptive Reporting Themes

Never lock a client or agency into one hardcoded visual style. Every report reads the user's own **agency name, optional logo, brand accent colour, and font pairing** first, then applies one of these 4 clean CSS token themes.

## 1. `executive-clean` (Default — Boardroom Clarity)
Best for: B2B, enterprise, finance, medical, and agencies wanting a crisp, neutral white report that prints cleanly to PDF.
- Background: `#f8fafc` | Surface cards: `#ffffff` | Border: `#e2e8f0`
- Ink: `#0f172a` | Muted: `#475569`
- Default accent (override with agency brand colour): `#2563eb`
- Typography: Clean geometric sans (`Inter`, `Plus Jakarta Sans`, or system sans)

## 2. `editorial-warm` (Calm Agency Craft)
Best for: Boutique agencies, DTC/lifestyle brands, hospitality, and luxury clients.
- Background: `#f6f4ee` | Surface cards: `#ffffff` | Border: `#e2ddd0`
- Ink: `#141915` | Muted: `#5f665d`
- Default accent (override with agency brand colour): `#2f5d46`
- Typography: Classic editorial serif headings (`Fraunces` / `Newsreader` / `Georgia`) + clean sans body

## 3. `modern-dark` (Tech & SaaS Executive)
Best for: Software, fintech, and digitally native growth teams viewing dashboards on screen.
- Background: `#0b1120` | Surface cards: `#111827` | Border: `#1f2937`
- Ink: `#f8fafc` | Muted: `#94a3b8`
- Default accent (override with agency brand colour): `#38bdf8`
- Typography: Crisp sans (`Inter` / `Figtree` / system sans) with tabular numerals (`font-variant-numeric: tabular-nums`)

## 4. `bold-contrast` (High-Energy Growth Agency)
Best for: Direct-response agencies and high-energy DTC brands that want punchy, presentation-grade contrast.
- Background: `#ffffff` | Surface cards: `#f4f4f5` | Border: `#18181b` (2px crisp framing)
- Ink: `#09090b` | Muted: `#52525b`
- Default accent (override with agency brand colour): `#18181b` with user's chosen brand highlight
- Typography: Bold display sans (`Space Grotesk` / `Figtree`) with high-contrast KPI numerals

## Custom Agency Overrides
Any theme accepts overrides in `report-data.json` under `"brand"`:
```json
{
  "brand": {
    "agency_name": "Northstar Digital",
    "agency_email": "reports@northstardigital.co",
    "logo_url": "",
    "accent": "#0f766e",
    "theme": "executive-clean"
  }
}
```
If the user supplies a client or agency website URL, pull their actual primary brand colour and font family and inject them via CSS variables rather than guessing.
