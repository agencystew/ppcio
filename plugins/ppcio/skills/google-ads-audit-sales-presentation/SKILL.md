---
name: google-ads-audit-sales-presentation
description: "Create stunning, animation-rich HTML sales presentations from Google Ads audit data. Converts audit findings (JSON, chat summaries, or raw data) into visually compelling high-contrast agency-branded presentations for client pitches. Use when you have audit results and need to present them professionally."
---

# Google Ads Audit Sales Presentation Skill

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 90 days, add the columns Cost, Clicks, Conversions, Cost / conv. and Search impr. share (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Transform Google Ads audit findings into zero-dependency, animation-rich HTML presentations that sell. Built specifically for PPC agencies to present audit results styled cleanly in your own agency brand colours, logo and typography (or 4 built-in themes: Executive Light, Editorial Warm, Modern Dark, Bold High-Contrast).

---

## Core Philosophy

1. **Zero Dependencies**: Single HTML files with inline CSS/JS. No npm, no build tools. Send to client, they open, it works.
2. **Sell, Don't Just Report**: This isn't a data dump. Every slide should move the client toward action.
3. **Show the Pain, Then the Cure**: Lead with problems (their money is bleeding), then present your solution.
4. **High-Contrast Agency Aesthetic** - Bold, high-contrast, motion-forward. Professional but energetic. Yellow accents on dark backgrounds.
5. **Narrative Over Numbers**: Tell the story of their account. Why it's struggling, what's possible, how you'll get there.

---

## Phase 0: Detect Input Mode

First, determine what audit data the user has:

**Mode A: JSON Audit Report**
- User has a structured JSON audit (from Deep Account Audit Agent)
- Proceed directly to Phase 2 (Content Mapping)

**Mode B: Chat/Summary Audit**
- User has audit findings in chat or text format
- Proceed to Phase 1 (Content Extraction)

**Mode C: Raw Account Data**
- User has raw performance data, no audit done
- First run audit analysis, then proceed to Phase 2

**Mode D: Enhancement/Revision**
- User has an existing presentation to improve
- Read existing file, understand structure, enhance with the agency's styling

---

## Phase 1: Content Extraction (When No Structured Audit)

If audit data isn't structured, extract key elements via AskUserQuestion:

### Step 1.1: Basic Account Context

**Question 1: Account Overview**
- Header: "Account"
- Question: "What's the account name and monthly spend range?"
- Options:
  - "Small ($1-5K/mo)": Starter accounts
  - "Medium ($5-25K/mo)": Growing accounts
  - "Large ($25-100K/mo)": Established accounts
  - "Enterprise ($100K+/mo)": Major accounts

**Question 2: Current Health**
- Header: "Status"
- Question: "What's your overall assessment of this account?"
- Options:
  - "Critical (Grade D)": Bleeding money, fundamental issues
  - "Needs Work (Grade C)": Multiple problems, underperforming
  - "Good (Grade B)": Solid but room for improvement
  - "Excellent (Grade A)": Fine-tuning opportunities

### Step 1.2: Key Findings

Ask user to provide:
1. **Top 3-5 Critical Issues** (what's broken)
2. **Waste Amount** ($ identified in wasted spend)
3. **Opportunity Value** ($ potential improvement)
4. **Quick Wins** (immediate actions)
5. **Strategic Recommendations** (longer-term fixes)

If user has a text summary, ask them to paste it.

---

## Phase 2: Content Mapping (Audit to Slides)

Map audit findings to presentation structure. Every Google Ads audit presentation follows this narrative arc:

### Presentation Structure (12-15 Slides)

| Slide | Type | Content Source | Purpose |
|-------|------|----------------|---------|
| 1 | Title | Account name, audit date | Set professional tone |
| 2 | Executive Summary | `executive_summary.headline` | Hook with main insight |
| 3 | Health Scorecard | `health_scorecard` | Visual grade breakdown |
| 4 | The Money Problem | `waste_identified`, CPA vs target | Create urgency |
| 5-7 | Critical Issues | `opportunity_catalog` (top 3) | Show specific problems |
| 8 | What's Working | `client_summary.key_wins` | Balance criticism |
| 9 | The Opportunity | `strategic_roadmap.total_90_day_impact` | Paint the vision |
| 10-11 | Solution Preview | `strategic_roadmap` phases | Show the path |
| 12 | Quick Wins | Immediate actions list | Prove easy value |
| 13 | Investment & Timeline | Pricing, timeline | The ask |
| 14 | Next Steps | CTA, contact | Drive action |

### Content Extraction from JSON Audit

```javascript
// Key data points to extract
const presentation = {
  accountName: audit.audit_metadata.account_name,
  healthGrade: audit.health_scorecard.overall_grade,
  headline: audit.executive_summary.headline,
  wasteIdentified: audit.executive_summary.total_waste_identified,
  opportunityValue: audit.executive_summary.total_opportunity_value,

  // Top 3 issues (sorted by priority)
  criticalIssues: audit.opportunity_catalog
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3),

  // Health dimensions for scorecard
  dimensions: audit.health_scorecard.dimension_grades,

  // What's working
  wins: audit.client_summary.key_wins,

  // 90-day roadmap
  roadmap: audit.strategic_roadmap,

  // Quick wins (immediate type)
  quickWins: audit.opportunity_catalog
    .filter(o => o.implementation_type === 'immediate')
    .slice(0, 5)
};
```

---

## Phase 3: Brand-Adaptive Style System (Never Hardcoded)

Always match the user's **own agency or company brand first** (name, logo, primary accent colour, light or dark preference, and font pairing). If they share their website URL or brand kit, extract their real primary colour and typography.

When no brand preference is given, offer (or pick the best fit from) these **4 clean CSS variable themes**:

| Theme | Best For | Background / Surface | Ink / Muted | Default Accent (Override With Agency Hex) |
|---|---|---|---|---|
| **Executive Light** *(default)* | B2B, enterprise, corporate prospects | `#ffffff` / `#f8fafc` | `#0f172a` / `#475569` | `#2563eb` |
| **Editorial Warm** | Boutique agencies, hospitality, DTC | `#f6f4ee` / `#ffffff` | `#141915` / `#5f665d` | `#2f5d46` |
| **Modern Dark** | SaaS, tech, screen-share sales calls | `#0b1120` / `#111827` | `#f8fafc` / `#94a3b8` | `#38bdf8` |
| **Bold High-Contrast** | Direct-response & high-energy pitches | `#09090b` / `#18181b` | `#ffffff` / `#a1a1aa` | `#22c55e` *(or user's accent)* |

### Semantic CSS Variables (Swap Tokens, Keep Structure)

```css
:root {
  /* Override with the user's own agency palette or chosen theme above */
  --bg: #ffffff;
  --surface: #f8fafc;
  --border: #e2e8f0;
  --ink: #0f172a;
  --text-secondary: #475569;
  --brand-accent: #2563eb;        /* Agency primary accent, highlights, CTAs */
  --brand-secondary: #0f766e;     /* Secondary accent */

  /* Backwards-compatible aliases used in slide templates */
  --black: var(--bg);
  --white: var(--ink);
  --dark-surface: var(--surface);
  --dark-border: var(--border);

  /* Semantic Grade & Signal Colors (adjust contrast for light vs. dark) */
  --grade-a: #059669;             /* Excellent */
  --grade-b: #2563eb;             /* Good */
  --grade-c: #d97706;             /* Needs work */
  --grade-d: #dc2626;             /* Critical */
  --waste-red: #dc2626;           /* Money bleeding */
  --opportunity-green: #059669;   /* Potential gains */
  --warning-orange: #d97706;      /* Caution */
}
```

### Typography

Use the agency's own font stack when provided, or pair clean display + body web fonts (e.g., `Plus Jakarta Sans` + `Inter`, `Fraunces` + `Inter`, or `Space Grotesk` + `Inter` — falling back gracefully to system sans):

```css
:root {
  --font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* Type Scale */
  --text-hero: clamp(2.75rem, 6.5vw, 5rem);     /* Title slides */
  --text-h1: clamp(2rem, 4.5vw, 3.5rem);        /* Slide headlines */
  --text-h2: clamp(1.4rem, 2.8vw, 2.25rem);     /* Section headers */
  --text-h3: clamp(1.15rem, 1.8vw, 1.5rem);     /* Card titles */
  --text-body: clamp(1rem, 1.3vw, 1.15rem);     /* Body text */
  --text-small: clamp(0.875rem, 1vw, 0.95rem);  /* Captions */
}

.display-text {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.body-text {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
}
```

### Animation Patterns

```css
/* Deck Motion - Smooth, performant */
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --duration-fast: 0.3s;
  --duration-normal: 0.6s;
  --duration-slow: 1s;
}

/* Reveal animation (slide + fade) */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity var(--duration-normal) var(--ease-out-expo),
    transform var(--duration-normal) var(--ease-out-expo);
}

.slide.visible .reveal {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered children */
.reveal-stagger > *:nth-child(1) { transition-delay: 0.1s; }
.reveal-stagger > *:nth-child(2) { transition-delay: 0.2s; }
.reveal-stagger > *:nth-child(3) { transition-delay: 0.3s; }
.reveal-stagger > *:nth-child(4) { transition-delay: 0.4s; }
.reveal-stagger > *:nth-child(5) { transition-delay: 0.5s; }

/* Number counter animation */
@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse for emphasis */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Glow effect for critical items */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 51, 102, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 51, 102, 0.6); }
}
```

### Interactive Elements

```javascript
/* Custom Cursor Trail */
class CursorTrail {
  constructor() {
    this.dots = [];
    this.dotCount = 12;
    this.init();
  }

  init() {
    for (let i = 0; i < this.dotCount; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      dot.style.cssText = `
        position: fixed;
        width: ${20 - i}px;
        height: ${20 - i}px;
        background: var(--brand-accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${1 - i * 0.08};
        transition: transform 0.1s ease;
      `;
      document.body.appendChild(dot);
      this.dots.push({ element: dot, x: 0, y: 0 });
    }

    document.addEventListener('mousemove', (e) => this.move(e));
  }

  move(e) {
    this.dots.forEach((dot, i) => {
      setTimeout(() => {
        dot.element.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }, i * 20);
    });
  }
}

// Only on desktop
if (window.innerWidth > 768) {
  new CursorTrail();
}
```

---

## Phase 4 & 5: Slide Templates and JavaScript Controller

Read `templates/slide-templates-and-controller.md` (inside this skill folder) before generating the HTML deck. It holds the complete HTML/CSS layout templates for all slide types and the interactive keyboard/progress JavaScript controller.

---

## Phase 6: Generation & Delivery

### File Output

Generate a single HTML file with all CSS and JS inlined:

**Naming Convention:**
```
[account-name-slug]-audit-presentation-[YYYY-MM-DD].html
```

**Example:**
```
acme-corp-audit-presentation-2026-01-28.html
```

### Final Checklist Before Delivery

- [ ] All slides render correctly
- [ ] Numbers animate on scroll
- [ ] Navigation works (keyboard, dots, scroll)
- [ ] Mobile responsive
- [ ] All placeholders replaced with real data
- [ ] Agency contact info included
- [ ] File opens in browser without dependencies

### Delivery Message

```
Your audit presentation is ready!

📁 File: [filename].html
🎨 Style: High-Contrast Agency Design System
📊 Slides: [count]

**Navigation:**
- Arrow keys (← → ↑ ↓) or Space to navigate
- Scroll/swipe also works
- Click the dots on the right to jump to slides

**To present:**
- Open in browser, hit F11 for fullscreen
- Or use any screen sharing tool

**To customize:**
- Colors: Edit :root CSS variables
- Content: Find and replace placeholders
- Branding: Update logo and contact info

Would you like me to make any adjustments?
```

---

## Guardrails

❌ **NEVER** generate presentations without real audit data or findings
❌ **NEVER** use generic stock photos or placeholder imagery
❌ **NEVER** include technical jargon without explanation for client audiences
❌ **NEVER** exaggerate savings or opportunity numbers beyond audit findings

✅ **ALWAYS** lead with business impact, not technical metrics
✅ **ALWAYS** include specific evidence for every claim
✅ **ALWAYS** maintain a consistent, high-contrast agency visual identity (using the user's own agency logo and brand colours if supplied)
✅ **ALWAYS** end with a clear call-to-action

---

## Edge Cases

### Small Accounts (< $5K/mo)
- Simplify metrics (absolute numbers may be small)
- Focus on % improvements rather than $ amounts
- Shorter presentation (8-10 slides)

### Excellent Accounts (Grade A)
- Reframe as "optimization" not "fixing"
- Lead with wins, opportunities second
- Focus on scaling and growth potential

### No Pricing Information
- Replace investment slide with "Discussion" slide
- Focus on ROI conversation, not specific numbers
- Include placeholder for verbal pricing discussion

### Multiple Decision Makers
- Add agenda slide after title
- Include recap slide before CTA
- More detailed methodology section

---

## Quality Assurance

Before finalizing:
- [ ] All audit findings accurately represented
- [ ] Dollar amounts match audit data
- [ ] Grade colors consistent throughout
- [ ] All animations trigger on scroll
- [ ] Mobile layout tested
- [ ] No broken links or placeholders
- [ ] Contact info is correct
- [ ] File loads without errors

---

## Related Skills

- **deep-account-audit-agent**: Generates the audit JSON this skill consumes
- **ppc-account-health-check**: Quick audits for simpler presentations
- **landing-page-quick-audit**: Detailed LP findings to include

---

**END OF SPECIFICATION**
