---
name: google-ads-audit-sales-presentation
description: "Create stunning, animation-rich HTML sales presentations from Google Ads audit data. Converts audit findings (JSON, chat summaries, or raw data) into visually compelling Lemonade.io-styled presentations for client pitches. Use when you have audit results and need to present them professionally."
---

# Google Ads Audit Sales Presentation Skill

## Start here

- If a `landing-pages/*/context.md` file exists in this folder, read it first. It holds what they sell, where they work, what a win is and the searches their ads buy. Ask only what it does not answer.
- The data: In Google Ads, open Campaigns, set the dates to the last 90 days, add the columns Cost, Clicks, Conversions, Cost / conv. and Search impr. share (Columns, then Modify columns), then press Download above the table and pick .csv. Drop the file here. Say this to them in one line when you ask for it.

Transform Google Ads audit findings into zero-dependency, animation-rich HTML presentations that sell. Built specifically for PPC agencies to present audit results with Lemonade.io's distinctive, high-energy visual style.

---

## Core Philosophy

1. **Zero Dependencies** , Single HTML files with inline CSS/JS. No npm, no build tools. Send to client, they open, it works.
2. **Sell, Don't Just Report** , This isn't a data dump. Every slide should move the client toward action.
3. **Show the Pain, Then the Cure** , Lead with problems (their money is bleeding), then present your solution.
4. **Lemonade.io Aesthetic** , Bold, high-contrast, motion-forward. Professional but energetic. Yellow accents on dark backgrounds.
5. **Narrative Over Numbers** , Tell the story of their account. Why it's struggling, what's possible, how you'll get there.

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
- Read existing file, understand structure, enhance with Lemonade.io styling

---

## Phase 1: Content Extraction (When No Structured Audit)

If audit data isn't structured, extract key elements via AskUserQuestion:

### Step 1.1: Basic Account Context

**Question 1: Account Overview**
- Header: "Account"
- Question: "What's the account name and monthly spend range?"
- Options:
  - "Small ($1-5K/mo)" , Starter accounts
  - "Medium ($5-25K/mo)" , Growing accounts
  - "Large ($25-100K/mo)" , Established accounts
  - "Enterprise ($100K+/mo)" , Major accounts

**Question 2: Current Health**
- Header: "Status"
- Question: "What's your overall assessment of this account?"
- Options:
  - "Critical (Grade D)" , Bleeding money, fundamental issues
  - "Needs Work (Grade C)" , Multiple problems, underperforming
  - "Good (Grade B)" , Solid but room for improvement
  - "Excellent (Grade A)" , Fine-tuning opportunities

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

## Phase 3: Style Application (Lemonade.io Design System)

### Color Palette

```css
:root {
  /* Primary Colors */
  --lemonade-yellow: #F6DD00;        /* Accent, highlights, CTAs */
  --lemonade-blue: #1F0AE5;          /* Interactive elements */
  --black: #000000;                   /* Primary backgrounds */
  --white: #FFFFFF;                   /* Text on dark */

  /* Supporting Colors */
  --dark-surface: #0A0A0A;           /* Card backgrounds */
  --dark-border: #1A1A1A;            /* Subtle borders */
  --text-secondary: #888888;          /* Muted text */

  /* Grade Colors */
  --grade-a: #00FF88;                 /* Excellent - green */
  --grade-b: #F6DD00;                 /* Good - yellow */
  --grade-c: #FF8800;                 /* Needs work - orange */
  --grade-d: #FF3366;                 /* Critical - red */

  /* Semantic */
  --waste-red: #FF3366;               /* Money bleeding */
  --opportunity-green: #00FF88;       /* Potential gains */
  --warning-orange: #FF8800;          /* Caution */
}
```

### Typography

```css
/* Font Stack - Lemonade.io Style */
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap');

:root {
  --font-display: 'Clash Display', sans-serif;  /* Headlines */
  --font-body: 'Satoshi', sans-serif;           /* Body text */

  /* Type Scale */
  --text-hero: clamp(3rem, 8vw, 6rem);          /* Title slides */
  --text-h1: clamp(2rem, 5vw, 4rem);            /* Slide headlines */
  --text-h2: clamp(1.5rem, 3vw, 2.5rem);        /* Section headers */
  --text-h3: clamp(1.25rem, 2vw, 1.75rem);      /* Card titles */
  --text-body: clamp(1rem, 1.5vw, 1.25rem);     /* Body text */
  --text-small: clamp(0.875rem, 1vw, 1rem);     /* Captions */
}

/* Display text styling */
.display-text {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

/* Body text styling */
.body-text {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
}
```

### Animation Patterns

```css
/* Lemonade.io Motion - Smooth, performant */
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
/* Custom Cursor Trail - Lemonade.io Signature */
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
        background: var(--lemonade-yellow);
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

## Phase 4: Slide Templates

### Slide 1: Title Slide

```html
<section class="slide title-slide">
  <div class="title-content">
    <div class="agency-logo reveal">
      <!-- Lemonade logo or agency name -->
      <span class="logo-text">LEMONADE</span>
    </div>

    <h1 class="reveal display-text">
      Google Ads Audit
    </h1>

    <p class="account-name reveal">
      <span class="highlight">[ACCOUNT_NAME]</span>
    </p>

    <div class="meta reveal">
      <span class="date">[AUDIT_DATE]</span>
      <span class="separator">•</span>
      <span class="period">[ANALYSIS_PERIOD]</span>
    </div>
  </div>

  <div class="title-decoration">
    <!-- Animated geometric shapes -->
  </div>
</section>

<style>
.title-slide {
  background: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.title-slide::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    ellipse at center,
    rgba(246, 221, 0, 0.1) 0%,
    transparent 50%
  );
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--lemonade-yellow);
}

.title-slide h1 {
  font-size: var(--text-hero);
  color: var(--white);
  margin: 2rem 0 1rem;
}

.account-name {
  font-size: var(--text-h2);
  color: var(--text-secondary);
}

.account-name .highlight {
  color: var(--white);
}

.meta {
  margin-top: 2rem;
  font-size: var(--text-small);
  color: var(--text-secondary);
}

.separator {
  margin: 0 1rem;
}
</style>
```

### Slide 2: Executive Summary (The Hook)

```html
<section class="slide summary-slide">
  <div class="slide-content">
    <span class="slide-label reveal">THE HEADLINE</span>

    <h1 class="reveal display-text">
      [EXECUTIVE_SUMMARY_HEADLINE]
    </h1>

    <div class="summary-stats reveal-stagger">
      <div class="stat-card waste">
        <span class="stat-label">Wasted Spend Identified</span>
        <span class="stat-value" data-count="[WASTE_AMOUNT]">$0</span>
        <span class="stat-period">per month</span>
      </div>

      <div class="stat-card opportunity">
        <span class="stat-label">Opportunity Value</span>
        <span class="stat-value" data-count="[OPPORTUNITY_VALUE]">$0</span>
        <span class="stat-period">potential savings</span>
      </div>

      <div class="stat-card grade">
        <span class="stat-label">Account Health</span>
        <span class="stat-grade grade-[GRADE]">[GRADE]</span>
        <span class="stat-period">[GRADE_LABEL]</span>
      </div>
    </div>

    <p class="situation reveal">
      [EXECUTIVE_SUMMARY_SITUATION]
    </p>
  </div>
</section>

<style>
.summary-slide {
  background: var(--black);
}

.slide-label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--lemonade-yellow);
  padding: 0.5rem 1rem;
  border: 1px solid var(--lemonade-yellow);
  border-radius: 2rem;
  margin-bottom: 2rem;
}

.summary-slide h1 {
  font-size: var(--text-h1);
  color: var(--white);
  max-width: 900px;
  margin-bottom: 3rem;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.stat-card.waste {
  border-color: var(--waste-red);
}

.stat-card.opportunity {
  border-color: var(--opportunity-green);
}

.stat-label {
  display: block;
  font-size: var(--text-small);
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: var(--white);
}

.stat-card.waste .stat-value {
  color: var(--waste-red);
}

.stat-card.opportunity .stat-value {
  color: var(--opportunity-green);
}

.stat-grade {
  display: block;
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
}

.grade-a { color: var(--grade-a); }
.grade-b { color: var(--grade-b); }
.grade-c { color: var(--grade-c); }
.grade-d { color: var(--grade-d); }

.stat-period {
  display: block;
  font-size: var(--text-small);
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.situation {
  font-size: var(--text-body);
  color: var(--text-secondary);
  max-width: 700px;
  line-height: 1.8;
}
</style>
```

### Slide 3: Health Scorecard

```html
<section class="slide scorecard-slide">
  <div class="slide-content">
    <span class="slide-label reveal">HEALTH SCORECARD</span>

    <div class="scorecard-grid reveal-stagger">
      <!-- Main Grade -->
      <div class="main-grade">
        <div class="grade-circle grade-[OVERALL_GRADE]">
          <span class="grade-letter">[OVERALL_GRADE]</span>
        </div>
        <span class="grade-label">Overall Health</span>
      </div>

      <!-- Dimension Grid -->
      <div class="dimensions">
        <!-- Repeat for each dimension -->
        <div class="dimension-card">
          <div class="dimension-header">
            <span class="dimension-name">Profitability</span>
            <span class="dimension-grade grade-[GRADE]">[GRADE]</span>
          </div>
          <div class="dimension-bar">
            <div class="dimension-fill" style="width: [SCORE]%"></div>
          </div>
          <p class="dimension-summary">[SUMMARY]</p>
        </div>
        <!-- More dimensions... -->
      </div>
    </div>
  </div>
</section>

<style>
.scorecard-slide {
  background: var(--black);
}

.scorecard-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 3rem;
  align-items: start;
}

.main-grade {
  text-align: center;
}

.grade-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  position: relative;
}

.grade-circle::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, currentColor 0%, transparent 60%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.grade-circle.grade-a { color: var(--grade-a); }
.grade-circle.grade-b { color: var(--grade-b); }
.grade-circle.grade-c { color: var(--grade-c); }
.grade-circle.grade-d { color: var(--grade-d); }

.grade-letter {
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: 700;
}

.grade-label {
  font-size: var(--text-body);
  color: var(--text-secondary);
}

.dimensions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.dimension-card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dimension-name {
  font-weight: 600;
  color: var(--white);
}

.dimension-grade {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
}

.dimension-bar {
  height: 6px;
  background: var(--dark-border);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.dimension-fill {
  height: 100%;
  background: var(--lemonade-yellow);
  border-radius: 3px;
  transition: width 1s var(--ease-out-expo);
}

.dimension-summary {
  font-size: var(--text-small);
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
```

### Slide 4: The Money Problem

```html
<section class="slide problem-slide">
  <div class="slide-content">
    <span class="slide-label reveal">THE PROBLEM</span>

    <h2 class="reveal display-text">
      Your Ad Spend Is <span class="text-waste">Bleeding Money</span>
    </h2>

    <div class="money-visual reveal">
      <div class="money-stat">
        <span class="money-label">Monthly Waste</span>
        <span class="money-value waste-pulse" data-count="[WASTE_AMOUNT]">$0</span>
      </div>

      <div class="waste-breakdown">
        <div class="waste-item">
          <span class="waste-icon">🔥</span>
          <span class="waste-text">[WASTE_REASON_1]</span>
          <span class="waste-amount">$[AMOUNT_1]</span>
        </div>
        <div class="waste-item">
          <span class="waste-icon">🔥</span>
          <span class="waste-text">[WASTE_REASON_2]</span>
          <span class="waste-amount">$[AMOUNT_2]</span>
        </div>
        <div class="waste-item">
          <span class="waste-icon">🔥</span>
          <span class="waste-text">[WASTE_REASON_3]</span>
          <span class="waste-amount">$[AMOUNT_3]</span>
        </div>
      </div>
    </div>

    <p class="problem-context reveal">
      [CONTEXT: CPA vs target, what this means for their business]
    </p>
  </div>
</section>

<style>
.problem-slide {
  background: linear-gradient(135deg, var(--black) 0%, #1a0000 100%);
}

.text-waste {
  color: var(--waste-red);
}

.money-visual {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin: 3rem 0;
}

.money-stat {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 51, 102, 0.1);
  border: 2px solid var(--waste-red);
  border-radius: 1rem;
}

.waste-pulse {
  animation: glow 2s ease-in-out infinite;
}

.money-label {
  display: block;
  font-size: var(--text-small);
  color: var(--waste-red);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.money-value {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
  color: var(--waste-red);
}

.waste-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.waste-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--dark-surface);
  border-radius: 0.75rem;
  border-left: 4px solid var(--waste-red);
}

.waste-icon {
  font-size: 1.5rem;
}

.waste-text {
  flex: 1;
  color: var(--white);
}

.waste-amount {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--waste-red);
}

.problem-context {
  font-size: var(--text-body);
  color: var(--text-secondary);
  max-width: 700px;
}
</style>
```

### Slide 5-7: Critical Issues (Repeat Pattern)

```html
<section class="slide issue-slide">
  <div class="slide-content">
    <div class="issue-header reveal">
      <span class="issue-number">01</span>
      <span class="issue-category">[CATEGORY]</span>
    </div>

    <h2 class="reveal display-text">
      [ISSUE_TITLE]
    </h2>

    <div class="issue-details reveal-stagger">
      <div class="detail-card current-state">
        <span class="detail-label">Current State</span>
        <p class="detail-text">[CURRENT_STATE_WITH_METRICS]</p>
      </div>

      <div class="detail-card root-cause">
        <span class="detail-label">Root Cause</span>
        <p class="detail-text">[ROOT_CAUSE_EXPLANATION]</p>
      </div>

      <div class="detail-card recommendation">
        <span class="detail-label">Recommendation</span>
        <p class="detail-text">[SPECIFIC_ACTION]</p>
      </div>
    </div>

    <div class="issue-impact reveal">
      <span class="impact-label">Estimated Monthly Impact</span>
      <span class="impact-value">$[ESTIMATED_MONTHLY_IMPACT]</span>
    </div>
  </div>
</section>

<style>
.issue-slide {
  background: var(--black);
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.issue-number {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: var(--lemonade-yellow);
  opacity: 0.5;
}

.issue-category {
  font-size: var(--text-small);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--lemonade-yellow);
  padding: 0.5rem 1rem;
  background: rgba(246, 221, 0, 0.1);
  border-radius: 0.25rem;
}

.issue-slide h2 {
  font-size: var(--text-h1);
  color: var(--white);
  max-width: 800px;
  margin-bottom: 2rem;
}

.issue-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.detail-card.current-state {
  border-top: 3px solid var(--waste-red);
}

.detail-card.root-cause {
  border-top: 3px solid var(--warning-orange);
}

.detail-card.recommendation {
  border-top: 3px solid var(--opportunity-green);
}

.detail-label {
  display: block;
  font-size: var(--text-small);
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.detail-text {
  font-size: var(--text-body);
  color: var(--white);
  line-height: 1.6;
}

.issue-impact {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid var(--opportunity-green);
  border-radius: 0.5rem;
}

.impact-label {
  font-size: var(--text-small);
  color: var(--opportunity-green);
}

.impact-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--opportunity-green);
}
</style>
```

### Slide 8: What's Working

```html
<section class="slide wins-slide">
  <div class="slide-content">
    <span class="slide-label reveal">WHAT'S WORKING</span>

    <h2 class="reveal display-text">
      Building on Your <span class="text-success">Strengths</span>
    </h2>

    <div class="wins-grid reveal-stagger">
      <div class="win-card">
        <span class="win-icon">✓</span>
        <h3 class="win-title">[WIN_1_TITLE]</h3>
        <p class="win-description">[WIN_1_DESCRIPTION]</p>
      </div>

      <div class="win-card">
        <span class="win-icon">✓</span>
        <h3 class="win-title">[WIN_2_TITLE]</h3>
        <p class="win-description">[WIN_2_DESCRIPTION]</p>
      </div>

      <div class="win-card">
        <span class="win-icon">✓</span>
        <h3 class="win-title">[WIN_3_TITLE]</h3>
        <p class="win-description">[WIN_3_DESCRIPTION]</p>
      </div>
    </div>

    <p class="wins-note reveal">
      We'll protect and amplify these strengths while fixing the issues.
    </p>
  </div>
</section>

<style>
.wins-slide {
  background: linear-gradient(135deg, var(--black) 0%, #001a0a 100%);
}

.text-success {
  color: var(--opportunity-green);
}

.wins-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
}

.win-card {
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 1rem;
  padding: 2rem;
}

.win-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: var(--opportunity-green);
  color: var(--black);
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.win-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--white);
  margin-bottom: 0.75rem;
}

.win-description {
  font-size: var(--text-body);
  color: var(--text-secondary);
  line-height: 1.6;
}

.wins-note {
  font-size: var(--text-body);
  color: var(--text-secondary);
  font-style: italic;
}
</style>
```

### Slide 9: The Opportunity

```html
<section class="slide opportunity-slide">
  <div class="slide-content">
    <span class="slide-label reveal">THE OPPORTUNITY</span>

    <h2 class="reveal display-text">
      90-Day Projected Impact
    </h2>

    <div class="opportunity-visual reveal">
      <div class="opportunity-stat primary">
        <span class="opp-label">Total Value</span>
        <span class="opp-value" data-count="[TOTAL_90_DAY_VALUE]">$0</span>
        <span class="opp-period">over 90 days</span>
      </div>

      <div class="opportunity-breakdown">
        <div class="breakdown-item">
          <span class="breakdown-label">Waste Recovered</span>
          <span class="breakdown-value">$[WASTE_RECOVERED]</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Efficiency Gains</span>
          <span class="breakdown-value">$[EFFICIENCY_GAINS]</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Growth Opportunity</span>
          <span class="breakdown-value">$[GROWTH_OPPORTUNITY]</span>
        </div>
      </div>
    </div>

    <blockquote class="opportunity-quote reveal">
      "[CORE_LIMITING_FACTOR] is currently holding back your account.
      Once we address this, [EXPECTED_RESULTS]"
    </blockquote>
  </div>
</section>

<style>
.opportunity-slide {
  background: var(--black);
  position: relative;
}

.opportunity-slide::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: radial-gradient(
    ellipse at right center,
    rgba(0, 255, 136, 0.1) 0%,
    transparent 60%
  );
}

.opportunity-visual {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 3rem;
  margin: 3rem 0;
  position: relative;
  z-index: 1;
}

.opportunity-stat.primary {
  background: rgba(0, 255, 136, 0.1);
  border: 2px solid var(--opportunity-green);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
}

.opp-label {
  display: block;
  font-size: var(--text-small);
  color: var(--opportunity-green);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.opp-value {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 700;
  color: var(--opportunity-green);
  line-height: 1;
}

.opp-period {
  display: block;
  font-size: var(--text-body);
  color: var(--text-secondary);
  margin-top: 1rem;
}

.opportunity-breakdown {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--dark-surface);
  border-radius: 0.75rem;
  border-left: 4px solid var(--opportunity-green);
}

.breakdown-label {
  color: var(--text-secondary);
}

.breakdown-value {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--opportunity-green);
}

.opportunity-quote {
  font-size: var(--text-h3);
  color: var(--white);
  border-left: 4px solid var(--lemonade-yellow);
  padding-left: 2rem;
  margin: 0;
  max-width: 800px;
  font-style: italic;
}
</style>
```

### Slide 10-11: Strategic Roadmap

```html
<section class="slide roadmap-slide">
  <div class="slide-content">
    <span class="slide-label reveal">THE PLAN</span>

    <h2 class="reveal display-text">
      90-Day Strategic Roadmap
    </h2>

    <div class="roadmap-timeline reveal-stagger">
      <div class="phase-card phase-1">
        <div class="phase-header">
          <span class="phase-number">01</span>
          <span class="phase-timeline">Week 1-2</span>
        </div>
        <h3 class="phase-title">[PHASE_1_TITLE]</h3>
        <p class="phase-focus">[PHASE_1_FOCUS]</p>
        <ul class="phase-actions">
          <li>[ACTION_1]</li>
          <li>[ACTION_2]</li>
          <li>[ACTION_3]</li>
        </ul>
        <span class="phase-impact">[EXPECTED_IMPACT]</span>
      </div>

      <div class="phase-connector"></div>

      <div class="phase-card phase-2">
        <!-- Same structure -->
      </div>

      <div class="phase-connector"></div>

      <div class="phase-card phase-3">
        <!-- Same structure -->
      </div>

      <div class="phase-connector"></div>

      <div class="phase-card phase-4">
        <!-- Same structure -->
      </div>
    </div>
  </div>
</section>

<style>
.roadmap-slide {
  background: var(--black);
}

.roadmap-timeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-top: 3rem;
  overflow-x: auto;
  padding-bottom: 2rem;
}

.phase-card {
  flex: 0 0 280px;
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
}

.phase-card.phase-1 { border-top: 4px solid var(--waste-red); }
.phase-card.phase-2 { border-top: 4px solid var(--warning-orange); }
.phase-card.phase-3 { border-top: 4px solid var(--lemonade-yellow); }
.phase-card.phase-4 { border-top: 4px solid var(--opportunity-green); }

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.phase-number {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--lemonade-yellow);
  opacity: 0.5;
}

.phase-timeline {
  font-size: var(--text-small);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  background: var(--dark-border);
  border-radius: 1rem;
}

.phase-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--white);
  margin-bottom: 0.5rem;
}

.phase-focus {
  font-size: var(--text-small);
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.phase-actions {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.phase-actions li {
  font-size: var(--text-small);
  color: var(--white);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.phase-actions li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--lemonade-yellow);
}

.phase-impact {
  display: block;
  font-size: var(--text-small);
  color: var(--opportunity-green);
  font-weight: 600;
}

.phase-connector {
  flex: 0 0 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--dark-border) 0%, var(--lemonade-yellow) 50%, var(--dark-border) 100%);
  align-self: center;
  margin-top: -60px;
}
</style>
```

### Slide 12: Quick Wins

```html
<section class="slide quickwins-slide">
  <div class="slide-content">
    <span class="slide-label reveal">IMMEDIATE VALUE</span>

    <h2 class="reveal display-text">
      Quick Wins <span class="text-highlight">This Week</span>
    </h2>

    <div class="quickwins-list reveal-stagger">
      <div class="quickwin-item">
        <span class="quickwin-number">1</span>
        <div class="quickwin-content">
          <h3 class="quickwin-title">[QUICK_WIN_1_TITLE]</h3>
          <p class="quickwin-description">[QUICK_WIN_1_DESCRIPTION]</p>
        </div>
        <span class="quickwin-impact">+$[IMPACT]</span>
      </div>

      <!-- Repeat for 3-5 quick wins -->
    </div>

    <div class="quickwins-total reveal">
      <span class="total-label">Total Quick Win Value</span>
      <span class="total-value">$[TOTAL_QUICK_WIN_VALUE]/mo</span>
    </div>
  </div>
</section>

<style>
.quickwins-slide {
  background: var(--black);
}

.text-highlight {
  color: var(--lemonade-yellow);
}

.quickwins-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 3rem 0;
}

.quickwin-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 0.75rem;
  transition: border-color 0.3s ease;
}

.quickwin-item:hover {
  border-color: var(--lemonade-yellow);
}

.quickwin-number {
  flex: 0 0 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lemonade-yellow);
  color: var(--black);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  border-radius: 50%;
}

.quickwin-content {
  flex: 1;
}

.quickwin-title {
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--white);
  margin-bottom: 0.25rem;
}

.quickwin-description {
  font-size: var(--text-small);
  color: var(--text-secondary);
}

.quickwin-impact {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--opportunity-green);
}

.quickwins-total {
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(246, 221, 0, 0.1);
  border: 2px solid var(--lemonade-yellow);
  border-radius: 0.75rem;
}

.total-label {
  font-size: var(--text-body);
  color: var(--lemonade-yellow);
}

.total-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--lemonade-yellow);
}
</style>
```

### Slide 13: Investment & Timeline

```html
<section class="slide investment-slide">
  <div class="slide-content">
    <span class="slide-label reveal">INVESTMENT</span>

    <h2 class="reveal display-text">
      Your Investment
    </h2>

    <div class="investment-options reveal-stagger">
      <!-- Option 1: One-time Audit Implementation -->
      <div class="investment-card">
        <span class="option-label">One-Time Fix</span>
        <h3 class="option-title">Audit Implementation</h3>
        <p class="option-price">[PRICE_1]</p>
        <ul class="option-includes">
          <li>All quick wins implemented</li>
          <li>Critical issues fixed</li>
          <li>Structure optimized</li>
          <li>Handoff documentation</li>
        </ul>
        <span class="option-timeline">Completed in [X] weeks</span>
      </div>

      <!-- Option 2: Ongoing Management -->
      <div class="investment-card featured">
        <span class="featured-badge">RECOMMENDED</span>
        <span class="option-label">Ongoing</span>
        <h3 class="option-title">Full Management</h3>
        <p class="option-price">[PRICE_2]<span>/month</span></p>
        <ul class="option-includes">
          <li>Everything in One-Time Fix</li>
          <li>Ongoing optimization</li>
          <li>Weekly reporting</li>
          <li>Strategy calls</li>
          <li>Continuous testing</li>
        </ul>
        <span class="option-timeline">Minimum [X] months</span>
      </div>
    </div>

    <p class="roi-note reveal">
      Based on our audit findings, you should see a <strong>[X]x ROI</strong>
      on your investment within the first [X] months.
    </p>
  </div>
</section>

<style>
.investment-slide {
  background: var(--black);
}

.investment-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 3rem 0;
  max-width: 800px;
}

.investment-card {
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 2rem;
  position: relative;
}

.investment-card.featured {
  border: 2px solid var(--lemonade-yellow);
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--lemonade-yellow);
  color: var(--black);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.35rem 1rem;
  border-radius: 1rem;
}

.option-label {
  display: block;
  font-size: var(--text-small);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.option-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  color: var(--white);
  margin-bottom: 1rem;
}

.option-price {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: var(--lemonade-yellow);
  margin-bottom: 1.5rem;
}

.option-price span {
  font-size: 1rem;
  color: var(--text-secondary);
}

.option-includes {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.option-includes li {
  font-size: var(--text-small);
  color: var(--white);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.option-includes li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--opportunity-green);
}

.option-timeline {
  display: block;
  font-size: var(--text-small);
  color: var(--text-secondary);
  padding-top: 1rem;
  border-top: 1px solid var(--dark-border);
}

.roi-note {
  font-size: var(--text-body);
  color: var(--text-secondary);
  max-width: 600px;
}

.roi-note strong {
  color: var(--opportunity-green);
}
</style>
```

### Slide 14: Next Steps (CTA)

```html
<section class="slide cta-slide">
  <div class="slide-content">
    <span class="slide-label reveal">NEXT STEPS</span>

    <h2 class="reveal display-text">
      Let's Fix Your Account
    </h2>

    <div class="cta-steps reveal-stagger">
      <div class="cta-step">
        <span class="step-number">1</span>
        <p class="step-text">Schedule a call to discuss the audit</p>
      </div>
      <div class="cta-step">
        <span class="step-number">2</span>
        <p class="step-text">Finalize scope and timeline</p>
      </div>
      <div class="cta-step">
        <span class="step-number">3</span>
        <p class="step-text">We start fixing your account</p>
      </div>
    </div>

    <div class="cta-contact reveal">
      <a href="mailto:[EMAIL]" class="cta-button">
        Schedule Your Call
      </a>
      <div class="contact-info">
        <p>[CONTACT_NAME]</p>
        <p>[EMAIL] • [PHONE]</p>
      </div>
    </div>
  </div>
</section>

<style>
.cta-slide {
  background: linear-gradient(135deg, var(--black) 0%, #1a1a00 100%);
  position: relative;
}

.cta-slide::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: radial-gradient(
    ellipse at bottom center,
    rgba(246, 221, 0, 0.15) 0%,
    transparent 70%
  );
}

.cta-slide .slide-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.cta-slide h2 {
  font-size: var(--text-hero);
  color: var(--white);
  margin-bottom: 3rem;
}

.cta-steps {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 4rem;
}

.cta-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-step .step-number {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lemonade-yellow);
  color: var(--black);
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
}

.cta-step .step-text {
  font-size: var(--text-body);
  color: var(--white);
  max-width: 200px;
}

.cta-contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1.25rem 3rem;
  background: var(--lemonade-yellow);
  color: var(--black);
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(246, 221, 0, 0.3);
}

.contact-info {
  text-align: center;
}

.contact-info p {
  color: var(--text-secondary);
  font-size: var(--text-body);
  margin: 0.25rem 0;
}

.contact-info p:first-child {
  color: var(--white);
  font-weight: 600;
}
</style>
```

---

## Phase 5: JavaScript Controller

Every presentation needs this controller for navigation and animations:

```javascript
/* ===========================================
   AUDIT PRESENTATION CONTROLLER
   Handles navigation, animations, counters
   =========================================== */

class AuditPresentation {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.currentSlide = 0;
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Setup Intersection Observer for scroll animations
    this.setupObserver();

    // Setup keyboard navigation
    this.setupKeyboard();

    // Setup touch/swipe
    this.setupTouch();

    // Setup navigation dots
    this.setupDots();

    // Setup progress bar
    this.setupProgress();

    // Setup number counters
    this.setupCounters();

    // Mark first slide as visible
    this.slides[0].classList.add('visible');
  }

  setupObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.triggerCounters(entry.target);
        }
      });
    }, options);

    this.slides.forEach(slide => observer.observe(slide));
  }

  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;

      switch(e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          this.prevSlide();
          break;
      }
    });
  }

  setupTouch() {
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }, { passive: true });
  }

  setupDots() {
    const nav = document.createElement('nav');
    nav.className = 'nav-dots';
    nav.innerHTML = this.slides.length > 0 ?
      Array.from(this.slides).map((_, i) =>
        `<button class="nav-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>`
      ).join('') : '';

    document.body.appendChild(nav);

    nav.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-dot')) {
        this.goToSlide(parseInt(e.target.dataset.slide));
      }
    });
  }

  setupProgress() {
    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    progress.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progress);

    this.progressFill = progress.querySelector('.progress-fill');
    this.updateProgress();

    // Update on scroll
    document.addEventListener('scroll', () => this.updateProgress());
  }

  updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    this.progressFill.style.width = `${progress}%`;

    // Update current slide index
    const slideIndex = Math.round((scrollTop / docHeight) * (this.slides.length - 1));
    if (slideIndex !== this.currentSlide) {
      this.currentSlide = slideIndex;
      this.updateDots();
    }
  }

  updateDots() {
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
    });
  }

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.currentSlide = index;
    this.slides[index].scrollIntoView({ behavior: 'smooth' });
    this.updateDots();
  }

  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide - 1);
  }

  setupCounters() {
    this.counters = document.querySelectorAll('[data-count]');
  }

  triggerCounters(slide) {
    const counters = slide.querySelectorAll('[data-count]');
    counters.forEach(counter => {
      if (counter.dataset.counted) return;
      counter.dataset.counted = 'true';
      this.animateCounter(counter);
    });
  }

  animateCounter(element) {
    const target = parseFloat(element.dataset.count.replace(/[^0-9.]/g, ''));
    const prefix = element.dataset.count.match(/^[^0-9]*/)[0];
    const suffix = element.dataset.count.match(/[^0-9]*$/)[0];
    const duration = 2000;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      const current = Math.floor(target * eased);

      element.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  new AuditPresentation();
});
```

### Navigation Styles

```css
/* Navigation Dots */
.nav-dots {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 100;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot:hover {
  background: rgba(255, 255, 255, 0.4);
}

.nav-dot.active {
  background: var(--lemonade-yellow);
  transform: scale(1.3);
}

/* Progress Bar */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--dark-border);
  z-index: 100;
}

.progress-fill {
  height: 100%;
  background: var(--lemonade-yellow);
  width: 0%;
  transition: width 0.1s linear;
}

/* Keyboard Hint */
.keyboard-hint {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.keyboard-hint:hover {
  opacity: 1;
}

.key {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--dark-surface);
  border: 1px solid var(--dark-border);
  border-radius: 0.25rem;
  font-family: monospace;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .nav-dots {
    display: none;
  }

  .keyboard-hint {
    display: none;
  }

  .slide-content {
    padding: 1.5rem;
  }

  .summary-stats,
  .issue-details,
  .wins-grid,
  .investment-options {
    grid-template-columns: 1fr;
  }

  .roadmap-timeline {
    flex-direction: column;
  }

  .phase-connector {
    width: 2px;
    height: 40px;
    margin: 0 auto;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: opacity 0.3s ease;
    transform: none;
  }

  @keyframes rotate,
  @keyframes glow,
  @keyframes pulse {
    from, to { }
  }
}
```

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
🎨 Style: Lemonade.io Design System
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
✅ **ALWAYS** maintain the Lemonade.io visual identity
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

- **deep-account-audit-agent** , Generates the audit JSON this skill consumes
- **ppc-account-health-check** , Quick audits for simpler presentations
- **landing-page-quick-audit** , Detailed LP findings to include

---

**END OF SPECIFICATION**
