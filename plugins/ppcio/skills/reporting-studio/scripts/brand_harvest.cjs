#!/usr/bin/env node
/**
 * PPC.io Studio Brand & Current-Report Harvester.
 *
 * Extracts real design tokens from an agency or company's live website via headless Chromium
 * (exact computed colors, real Google/web fonts, border-radius language, light/dark polarity,
 * logo asset, and headline voice) + optionally captures/stages an existing report screenshot
 * or PDF so the buyer's AI designs INSIDE their true brand instead of inventing generic themes.
 *
 * Usage:
 *   node brand_harvest.cjs --out-dir <work-dir> [--url <https://...>] [--org "<Name>"] \
 *     [--accent "<#hex>"] [--polarity <light|dark>] [--current-report <path>]
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

function loadPlaywright() {
  const candidates = [
    process.env.LPK_HOME ? path.join(process.env.LPK_HOME, 'node_modules', 'playwright') : '',
    path.join(os.homedir(), '.landing-page-kit', 'node_modules', 'playwright'),
    'playwright',
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      return require(c);
    } catch (_) {}
  }
  return null;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      out[k] = v;
    }
  }
  return out;
}

function rgbToHex(rgb) {
  if (!rgb) return null;
  if (rgb.startsWith('#')) return rgb.toLowerCase();
  const m = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!m) return null;
  if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
  return (
    '#' +
    [m[1], m[2], m[3]]
      .map(n => Math.max(0, Math.min(255, parseInt(n, 10))).toString(16).padStart(2, '0'))
      .join('')
  );
}

function luminance(hex) {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return 0.9;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isNeutral(hex) {
  if (!hex || hex.length < 7) return true;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return Math.max(r, g, b) - Math.min(r, g, b) < 22;
}

function buildMarkdown(b) {
  const fontLinks = (b.font_stylesheets || []).length
    ? b.font_stylesheets.map(u => `- \`${u}\``).join('\n')
    : '- None detected externally (use the extracted display/body font stack with clean system fallbacks).';
  const paletteLines = (b.palette_swatches || []).slice(0, 6).map(x => `\`${x}\``).join(', ') || `\`${b.colors.accent}\``;
  return [
    `# Brand Identity Brief: ${b.org}`,
    '',
    `Source: ${b.url || 'Manual brand brief (no live URL provided)'} (${b.source_mode})`,
    '',
    '## Hard Brand Rules (Follow These Strictly)',
    '- Build every prototype natively inside THIS organization\'s visual identity.',
    '- NEVER default to generic serif-italic headlines, generic sand/cream/navy palettes, or identical card grids.',
    `- Respect their polarity (**${b.polarity}**) and primary accent (**\`${b.colors.accent}\`**).`,
    '',
    '## Extracted Design Tokens',
    `- **Polarity:** \`${b.polarity}\``,
    `- **Page background:** \`${b.colors.bg}\``,
    `- **Card / surface:** \`${b.colors.surface}\``,
    `- **Primary ink:** \`${b.colors.ink}\``,
    `- **Muted ink:** \`${b.colors.muted}\``,
    `- **Primary brand accent:** \`${b.colors.accent}\``,
    `- **Secondary / header color:** \`${b.colors.header_bg}\``,
    `- **Observed brand swatches:** ${paletteLines}`,
    `- **Display font (headings):** \`${b.typography.display}\``,
    `- **Body font:** \`${b.typography.body}\``,
    `- **Border-radius language:** \`${b.radius.style}\` (${b.radius.sample_px}px typical)`,
    `- **Logo asset:** ${b.logo_url || (b.logo_svg ? 'Inline SVG captured in brand.json (`logo_svg`)' : 'None found (render a crisp typographic wordmark in the display font)')}`,
    '',
    '## Webfont Stylesheets to Load',
    fontLinks,
    '',
    '## Real Brand Voice Sample (From Their Live Site)',
    `- **Page title:** ${b.voice.title || b.org}`,
    `- **Hero headline:** ${b.voice.h1 || 'Not captured'}`,
    `- **Meta description:** ${b.voice.description || 'Not captured'}`,
    `- **Primary CTA wording:** ${(b.voice.ctas || []).slice(0, 4).join(' | ') || 'Not captured'}`,
    b.current_report_file
      ? `\n## Existing Report / Audit Reference to Beat\n- Staged at \`${b.current_report_file}\` (open and critique before designing Version A).`
      : '',
    '',
  ].join('\n');
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const outDir = args['out-dir'];
  if (!outDir) {
    console.error('Usage: node brand_harvest.cjs --out-dir <work-dir> [--url <https://...>] [--org "<Name>"] [--accent "<#hex>"] [--polarity <light|dark>] [--current-report <path>]');
    process.exit(1);
  }
  const inputsDir = path.join(path.resolve(outDir), 'inputs');
  fs.mkdirSync(inputsDir, { recursive: true });

  const org = args.org || 'Organization';
  const url = (args.url || '').trim();
  const polarityHint = args.polarity === 'dark' ? 'dark' : 'light';
  const accentHint = args.accent && args.accent.startsWith('#') ? args.accent.toLowerCase() : '#2563eb';

  let brand = {
    org,
    url,
    source_mode: 'manual_fallback',
    polarity: polarityHint,
    colors: polarityHint === 'dark'
      ? { bg: '#0c0e14', surface: '#151923', ink: '#f3f5f8', muted: '#98a2b3', accent: accentHint, header_bg: '#10131c' }
      : { bg: '#f8f9fb', surface: '#ffffff', ink: '#111827', muted: '#526071', accent: accentHint, header_bg: '#ffffff' },
    palette_swatches: [accentHint],
    typography: {
      display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    font_stylesheets: [],
    radius: { style: 'soft', sample_px: 10 },
    logo_url: '',
    logo_svg: '',
    voice: { title: org, h1: '', description: '', ctas: [] },
    screenshots: {},
    current_report_file: '',
  };

  // Stage optional existing report screenshot / PDF / HTML for side-by-side comparison
  if (args['current-report']) {
    const src = path.resolve(args['current-report']);
    if (fs.existsSync(src)) {
      const ext = path.extname(src).toLowerCase() || '.bin';
      const dest = path.join(inputsDir, `current-report${ext}`);
      fs.copyFileSync(src, dest);
      brand.current_report_file = path.relative(path.resolve(outDir), dest);
    }
  }

  const pw = loadPlaywright();
  if (url && pw) {
    let browser;
    try {
      browser = await pw.chromium.launch();
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
      const page = await ctx.newPage();
      await page.route(/doubleclick\.net|googlesyndication\.com|hotjar\.com|intercom\.io/i, r => r.abort()).catch(() => {});
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(1500);

      const deskPath = path.join(inputsDir, 'brand-site-desktop.png');
      await page.screenshot({ path: deskPath, fullPage: false });
      brand.screenshots.desktop = path.relative(path.resolve(outDir), deskPath);

      const raw = await page.evaluate(() => {
        const cs = el => (el ? getComputedStyle(el) : null);
        const bodyCs = cs(document.body);
        const htmlCs = cs(document.documentElement);
        const h1 = document.querySelector('h1');
        const h1Cs = cs(h1);
        const header = document.querySelector('header, nav');
        const headerCs = cs(header);

        const colorCounts = new Map();
        const addColor = (val, weight = 1) => {
          if (!val || val === 'transparent' || val === 'rgba(0, 0, 0, 0)') return;
          colorCounts.set(val, (colorCounts.get(val) || 0) + weight);
        };

        const ctas = [];
        const radii = [];
        document.querySelectorAll('a, button, [role="button"], .btn, [class*="cta"], [class*="button"]').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width < 40 || r.height < 22 || r.top > 1800) return;
          const st = getComputedStyle(el);
          addColor(st.backgroundColor, 5);
          addColor(st.borderColor, 1);
          const rad = parseFloat(st.borderRadius);
          if (!Number.isNaN(rad) && rad < 60) radii.push(rad);
          const txt = (el.innerText || '').trim().replace(/\s+/g, ' ');
          if (txt && txt.length >= 3 && txt.length <= 42 && !ctas.includes(txt)) ctas.push(txt);
        });
        document.querySelectorAll('h1, h2, h3, strong, [class*="accent"], [class*="primary"]').forEach(el => {
          const st = getComputedStyle(el);
          addColor(st.color, 2);
        });

        // Surface card sample
        let surfaceBg = null;
        for (const el of document.querySelectorAll('section, article, .card, [class*="card"]')) {
          const bg = getComputedStyle(el).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== bodyCs.backgroundColor) {
            surfaceBg = bg;
            break;
          }
        }

        // Logo discovery
        let logoUrl = '';
        let logoSvg = '';
        const logoImg = document.querySelector('header img, nav img, img[alt*="logo" i], img[src*="logo" i], [class*="logo" i] img');
        if (logoImg && logoImg.src) logoUrl = logoImg.src;
        if (!logoUrl) {
          const svg = document.querySelector('header svg, nav svg, [class*="logo" i] svg');
          if (svg && svg.outerHTML.length < 8000) logoSvg = svg.outerHTML;
        }

        const fontLinks = [...document.querySelectorAll('link[rel="stylesheet"]')]
          .map(l => l.href)
          .filter(h => /fonts\.googleapis\.com|use\.typekit\.net|fonts\.bunny\.net|fontshare\.com/i.test(h));

        const desc = (document.querySelector('meta[name="description"]') || {}).content || '';
        return {
          title: document.title || '',
          h1: h1 ? (h1.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 140) : '',
          description: desc.slice(0, 220),
          ctas: ctas.slice(0, 8),
          bodyBg: bodyCs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? bodyCs.backgroundColor : htmlCs.backgroundColor,
          bodyInk: bodyCs.color,
          headerBg: headerCs ? headerCs.backgroundColor : null,
          surfaceBg,
          displayFont: h1Cs ? h1Cs.fontFamily : bodyCs.fontFamily,
          bodyFont: bodyCs.fontFamily,
          fontLinks,
          logoUrl,
          logoSvg,
          radii: radii.slice(0, 20),
          weightedColors: [...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18),
        };
      });

      const phoneCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true });
      const phonePage = await phoneCtx.newPage();
      await phonePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      await phonePage.waitForTimeout(800);
      const phonePath = path.join(inputsDir, 'brand-site-phone.png');
      await phonePage.screenshot({ path: phonePath, fullPage: false }).catch(() => {});
      brand.screenshots.phone = path.relative(path.resolve(outDir), phonePath);
      await phoneCtx.close();

      const bgHex = rgbToHex(raw.bodyBg) || '#ffffff';
      const inkHex = rgbToHex(raw.bodyInk) || (luminance(bgHex) < 0.4 ? '#f3f5f8' : '#111827');
      const isDark = luminance(bgHex) < 0.35;
      const swatches = [];
      for (const [col] of raw.weightedColors) {
        const hx = rgbToHex(col);
        if (hx && !swatches.includes(hx) && !isNeutral(hx)) swatches.push(hx);
      }
      const pickedAccent = args.accent && args.accent.startsWith('#') ? args.accent.toLowerCase() : (swatches[0] || accentHint);
      const surfHex = rgbToHex(raw.surfaceBg) || (isDark ? '#161b26' : '#ffffff');
      const headHex = rgbToHex(raw.headerBg) || bgHex;
      const avgRad = raw.radii.length ? Math.round(raw.radii.reduce((a, b) => a + b, 0) / raw.radii.length) : 10;
      const radStyle = avgRad <= 4 ? 'sharp' : avgRad <= 12 ? 'soft' : avgRad <= 22 ? 'rounded' : 'pill';

      brand = {
        ...brand,
        org: args.org || (raw.title ? raw.title.split(/[|\-–—]/)[0].trim() : org),
        source_mode: 'live_url_harvest',
        polarity: args.polarity ? polarityHint : (isDark ? 'dark' : 'light'),
        colors: {
          bg: bgHex,
          surface: surfHex,
          ink: inkHex,
          muted: isDark ? '#98a2b3' : '#526071',
          accent: pickedAccent,
          header_bg: headHex,
        },
        palette_swatches: swatches.length ? swatches.slice(0, 6) : [pickedAccent],
        typography: {
          display: raw.displayFont || brand.typography.display,
          body: raw.bodyFont || brand.typography.body,
        },
        font_stylesheets: raw.fontLinks || [],
        radius: { style: radStyle, sample_px: avgRad },
        logo_url: raw.logoUrl || '',
        logo_svg: raw.logoSvg || '',
        voice: {
          title: raw.title,
          h1: raw.h1,
          description: raw.description,
          ctas: raw.ctas,
        },
      };
      await ctx.close();
    } catch (err) {
      brand.harvest_warning = `Could not scrape live URL (${String(err.message || err).slice(0, 120)}); using structured fallback tokens.`;
    } finally {
      if (browser) await browser.close().catch(() => {});
    }
  } else if (url && !pw) {
    brand.harvest_warning = 'Playwright not installed in this environment; using structured fallback tokens.';
  }

  // If current-report is an HTML file and Playwright is available, screenshot it for the comparison board
  if (brand.current_report_file && brand.current_report_file.endsWith('.html') && pw) {
    let b2;
    try {
      b2 = await pw.chromium.launch();
      const p = await b2.newPage({ viewport: { width: 1440, height: 900 } });
      await p.goto('file://' + path.join(path.resolve(outDir), brand.current_report_file), { waitUntil: 'load', timeout: 15000 });
      const shotOut = path.join(inputsDir, 'current-report.png');
      await p.screenshot({ path: shotOut, fullPage: false });
      brand.current_report_shot = 'inputs/current-report.png';
    } catch (_) {
    } finally {
      if (b2) await b2.close().catch(() => {});
    }
  } else if (brand.current_report_file && /\.(png|jpe?g|webp)$/i.test(brand.current_report_file)) {
    brand.current_report_shot = brand.current_report_file;
  }

  fs.writeFileSync(path.join(inputsDir, 'brand.json'), JSON.stringify(brand, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(inputsDir, 'brand.md'), buildMarkdown(brand), 'utf8');
  console.log(`Brand brief ready (${brand.source_mode}): ${path.join(inputsDir, 'brand.md')} | Polarity=${brand.polarity} Accent=${brand.colors.accent} Display=${brand.typography.display.split(',')[0]}`);
})();
