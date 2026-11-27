# Quill — Editor (Worker code, no LLM)

You're Quill. You're not an LLM call — you're a deterministic Worker function in `after-click-workers/src/lib/quill.ts`. Mason hands you N section HTML strings + Vela's `tokens_css` + Verse's `page_meta` + Iris's image manifest, and you assemble one self-contained HTML document. You strip what shouldn't be there, you patch what's missing, you grep for the AI-slop patterns that Mason might have leaked despite the rules, and you return a clean single-file HTML that Hawk can take screenshots of and critique.

You don't reason about design. You don't reason about copy. You assemble, validate, and report. The reasoning happens before you (Mason) and after you (Hawk). Your job is mechanical and ruthless: if it's banned, it's gone before assembly completes.

This prompt is the SPEC for the Worker code, not a system prompt to an LLM. The build orchestrator implements `quill.ts` against this spec. The same `## Output` contract is honored — what Quill returns goes verbatim to the customer.

# Shared rule: how your output gets persisted

This rule is included verbatim in every Cathedral build prompt via `@include`.

---

## The shape

Return a single JSON object. The orchestrator persists it verbatim to the matching `build_*` table column. There is no downstream filtering, no shape adapter, no clean-up pass — what you return is what the customer sees in their dashboard.

Every prompt's `## Output` section defines its exact schema. The output IS the contract.

---

## Hard rules

1. **JSON only.** No prose preamble ("Here's my output:"). No trailing commentary. No `\`\`\`json` code fences (the parser strips them but it's noise). Start with `{`, end with `}`. The orchestrator parses the first valid JSON object in your response.

2. **Honor the schema exactly.** Every required key in the prompt's Output section MUST be present. Optional keys named in the schema MAY be omitted or set to `null`. Extra keys not in the schema are dropped silently by the orchestrator's `zod` validator — don't add fields; if you need a new field, the prompt is wrong and Stewart updates the schema.

3. **`null` is the right answer when you can't source something.** Don't invent. Don't approximate. Don't backfill with plausible-sounding placeholder text. The audit prompts work this way; the build prompts inherit the same discipline. Fabrication is the failure mode every prompt is designed to prevent.

4. **String fields are character-budgeted.** When a field says `< 60 chars` or `< 800 chars`, that's a hard cap. Truncation in the dashboard is ugly and reads as broken. Write to budget. The budget is set by the React component that will render the field, not by an arbitrary preference.

5. **HTML in HTML-typed fields is self-contained.** When a field says "section HTML", it's: `<section class="...">...</section>` — no `<html>`, no `<head>`, no `<body>`, no inline `<style>` (CSS comes from `design_dna_tokens`), no `<script>`, no asset URLs that aren't already in `inputs.image_assets`. Mason is the only prompt that emits HTML; every other prompt emits structured JSON.

6. **`notes[]` is the place for everything the schema can't carry.** Each entry: `{ "level": "info" | "warn" | "blocker", "message": "string" }`. Use `warn` when you proceeded but the next stage should know. Use `blocker` when you produced a degraded output and Hawk's critic loop should hammer it. `info` is for "I made a judgment call, here's why" — written for the next agent in the chain, not the customer.

---

## What the orchestrator does with your output

```ts
// pseudo-code in build-orchestrator-do.ts
const raw = await claude.complete({ prompt, inputs });
const parsed = parseFirstJsonObject(raw);            // strips code fences if any
const validated = StageOutputSchema.parse(parsed);   // throws on shape mismatch
await supabase.from(stageTable).insert({
  build_run_id, section_id, payload: validated, model, tokens
});
await taskEvents.emit({ stage, status: "done", duration_ms });
```

Shape mismatches throw at the `zod` line. The orchestrator catches the throw, logs `error_code='output_schema_mismatch'`, retries up to 3 times with a hardened "your last response failed schema validation: [error]" reminder appended. After 3 retries it fails the stage and surfaces to the user.

**Lesson: if your output mismatches the schema on the first call, you've cost the customer a 2-minute re-run for no reason.** Read your prompt's Output section before you start writing, not after.

## Inputs

```jsonc
{
  "stage": "assembly",
  "inputs": {
    "design_dna":      { /* Vela's complete output — tokens_css is the source of CSS truth */ },
    "page_meta":       { /* Verse's page_title, meta_description, og_image_intent */ },
    "section_htmls":   [
      { "section_id": "string", "section_html": "string", "estimated_height_px": 0, "estimated_height_mobile_px": 0 }
    ],
    "image_manifest":  { /* Iris's slots[] — used to verify every <img> src in section_htmls is accounted for */ },
    "audit_id":        "uuid",
    "build_run_id":    "uuid",
    "after_click_attribution": true | false   // true on default builds; false on agency-white-label re-renders
  }
}
```

## What Quill does (in order)

### 1. Concatenate sections in section_htmls order

The order is fixed by Atlas's `section_plan[]` — Mason emitted in that order, and Quill preserves it. Sections are inserted into `<main>` between sticky-nav (top) and footer (bottom).

### 2. Build the page shell

```html
<!doctype html>
<html lang="{{detected from source_scrape or 'en'}}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{page_meta.page_title}}</title>
    <meta name="description" content="{{page_meta.meta_description}}">
    <meta property="og:title" content="{{page_meta.page_title}}">
    <meta property="og:description" content="{{page_meta.meta_description}}">
    <meta property="og:image" content="{{first hero image URL from Iris}}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family={{design_dna.typography.display_font.replace(' ','+')}}:wght@400;600;700;800&family={{body_font similar}}&display=swap">

    <style>
      {{design_dna.tokens_css}}

      /* Shared reset + base */
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; font-family: var(--font-body); color: var(--color-ink); background: var(--color-paper); }
      img { max-width: 100%; height: auto; display: block; }
      h1, h2, h3 { font-family: var(--font-display); }
      :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      }
      .sticky-mobile-cta { /* universal sticky CTA bar bottom of viewport mobile-only */ }
    </style>
  </head>
  <body>
    <nav class="site-nav">...</nav>
    <main>
      {{section_htmls[0].section_html}}
      {{section_htmls[1].section_html}}
      ...
    </main>
    <aside class="sticky-mobile-cta">...primary CTA from build_brief.offer + Verse.sticky_mobile_cta...</aside>
    <footer class="site-footer">
      {{if after_click_attribution: "Built with after.click" small-text + link}}
    </footer>
    <script>
      // IntersectionObserver for scroll-reveal
      // Form handler stub: data-action="<!-- REPLACE: form-action -->"
    </script>
  </body>
</html>
```

### 3. Grep sweep (the AI-slop killer)

For every section_html in the concatenated output, scan and reject (or auto-strip) the following patterns. Any blocker-level hit fails the assembly and triggers a Mason re-run for the offending section:

| Pattern | Action | Severity |
|---|---|---|
| `—` (em dash, U+2014) | Replace with ` — ` → ` ` (space-hyphen-space → just rewrite, but flag) | blocker |
| `\b(elevate|seamless|unleash|next-gen|delve|game-changer|empower|revolutionize|leverage|harness|synergy)\b` (case-insensitive, as a feature/marketing verb) | flag for Mason rewrite | blocker |
| `transform` as a generic verb in headings or CTAs (NOT in CSS transform property) | flag | warn |
| `\b(submit|sign up|learn more|get started|see more|click here|continue)\b` in primary CTAs | flag for Verse rewrite | blocker |
| `100vh\|h-screen\|height:\s*100vh` (in CSS) | replace with `100dvh` | warn |
| `color:\s*#000000\|color:\s*#000;\|background:\s*#000000` (pure black on body elements) | flag for Mason — unless Vela's palette explicitly contains pure black | warn |
| `<h1>.*</h1>` count > 1 across all sections | flag — only one H1 per page | blocker |
| `placeholder="[^"]*"` without `<label>` for the same input | flag | warn |
| Inline hex color codes outside Vela's `tokens_css` palette (e.g. `color: #F24A2E` instead of `var(--color-accent)`) | flag | warn |
| `<img src="[^"]+">` where src is NOT in `image_manifest` AND NOT a `data:` URI | flag with image_url | blocker |
| `lorem ipsum` (any casing) | flag | blocker |
| `[REPLACE: ...]` blocks | count and report; not a failure | info |
| `<script>` tags with content beyond the orchestrator's known scroll-reveal pattern | flag for security | warn |

### 4. Image audit

For every `<img>` in the concatenated output:
- src must resolve to either (a) an `image_manifest.slots[].lifted.source_url`, (b) a generated image URL written to storage by Iris's gen call, or (c) a `data:` URI for tiny inline SVG decorations.
- `alt` attribute must be present and non-empty (or empty if explicitly decorative with `role="presentation"`).
- `width` + `height` attributes must be set on below-fold images for layout-shift prevention.

Failures here fail the assembly.

### 5. Heading hierarchy audit

- Exactly one `<h1>` in the document (inside the hero).
- No skipped heading levels — `<h2>` cannot appear before `<h1>`; `<h4>` cannot appear without an `<h3>` somewhere in the same section.
- `<h2>` text strings checked for "labels-section-type" pattern: "How it works", "What we offer", "Our process", "About us", "Why us", "Featured packages", "Testimonials", "FAQ" (as a heading, not a section role). Flag for Verse rewrite if found.

### 6. Sticky mobile CTA wiring

Ensure exactly one `<aside class="sticky-mobile-cta">` is present, mobile-only via `@media (max-width: 767px) { display: flex }` and `display: none` otherwise. Content: Verse's `sticky_mobile_cta.label` + phone if present + microcopy.

### 7. Form action placeholder

Every `<form>` element gets `data-action="<!-- REPLACE: form-action -->"` and a `<!-- REPLACE: form-action -->` HTML comment at the top of the form block. The customer wires the real endpoint before launch.

### 8. Performance + SEO checks

- `<link rel="preconnect">` for Google Fonts present.
- `<meta name="viewport">` correct.
- Open Graph + Twitter Card meta present.
- No `<script src="https://...">` references to third-party scripts (analytics, chat, etc.) — those are the customer's responsibility via `<!-- REPLACE: tracking -->`.
- Inline `<style>` total size budget: < 60KB (warn at 50KB).
- Total document size after assembly: < 250KB excluding image URLs (warn at 200KB).

## Output

```jsonc
{
  "assembled_html":      "string",          // the full HTML document, ready to write to <build_id>.html
  "bytes":               0,                  // byte length of assembled_html
  "section_count":       0,
  "h1_count":            0,
  "h2_count":            0,
  "img_count":           0,
  "replace_marker_count": 0,                 // [REPLACE: ...] blocks remaining for operator handoff
  "grep_results": [
    { "pattern": "string", "section_id": "string | null", "severity": "info" | "warn" | "blocker", "snippet": "string", "auto_fixed": true | false }
  ],
  "image_audit": {
    "all_resolved":        true | false,
    "unresolved_urls":     ["string", ...],   // <img> src values not in manifest — assembly fails if non-empty
    "missing_alt_count":   0,
    "missing_dims_count":  0
  },
  "heading_audit": {
    "h1_count_ok":         true | false,
    "labeled_section_h2_count": 0,            // count of "How it works"-style labels found
    "skipped_levels":      ["string", ...]
  },
  "performance": {
    "inline_style_bytes":   0,
    "total_bytes":          0,
    "preconnect_present":   true,
    "og_meta_present":      true
  },
  "blocker_count":  0,                        // sum of severity === "blocker" hits
  "should_retry_mason_for_sections": ["string", ...],   // section_ids that need Mason re-run before Hawk sees the build
  "notes": [
    { "level": "info" | "warn" | "blocker", "message": "string" }
  ]
}
```

## Failure mode

If `blocker_count > 0`, the orchestrator does NOT advance to Hawk. Instead it requeues Mason for each section in `should_retry_mason_for_sections[]` with an explicit error message naming the pattern that failed. Max 2 retry rounds per section before failing the build and surfacing the assembly errors to the user.

## Why Quill is Worker code, not an LLM

LLMs make grep mistakes. They might miss an em dash, or be talked into "transform" being acceptable in this one specific context. Determinism is the point. The patterns banned here ARE banned. The image manifest IS the source of truth. The heading hierarchy IS the rule. No judgment calls. No reasoning. No flexibility.

## One-line discipline

Mason builds; you assemble. Hawk critiques; you don't. The page is clean by the time Hawk sees it because every banned pattern fails at your stage. No exceptions.
