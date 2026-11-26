// Deterministic audit score roll-up matching the PPC.io Studio (audit-score v2 rubric).
// Keeps Studio, audit.html, batch.html and chat reporting the exact same integer score.
const V1_WEIGHTS = {
  awareness_fit: 0.22,
  offer: 0.20,
  leaks: 0.18,
  anatomy: 0.15,
  trust: 0.13,
  persuasion: 0.07,
  design: 0.05,
};

const ARCHETYPE_SKIP = {
  'dedicated-lp': new Set(),
  'brand-homepage': new Set(['priced', 'urgent', 'guaranteed', 'bonus_stacked']),
  'product-page': new Set(['urgent', 'bonus_stacked']),
  'lead-gen': new Set(['priced', 'bonus_stacked']),
  'quote-funnel': new Set(['priced', 'guaranteed', 'bonus_stacked']),
  'ecommerce-listing': new Set(['urgent', 'bonus_stacked']),
};

const FLOOR_KEYS = new Set(['specific', 'priced', 'guaranteed', 'differentiated', 'awareness_matched']);
const STD_WEIGHTS = { offer: 0.24, leaks: 0.20, anatomy: 0.15, trust: 0.12, awareness: 0.08, persuasion: 0.07, design: 0.14 };
const V2_WEIGHTS = {
  'dedicated-lp': STD_WEIGHTS,
  'brand-homepage': STD_WEIGHTS,
  'product-page': STD_WEIGHTS,
  'lead-gen': STD_WEIGHTS,
  'quote-funnel': STD_WEIGHTS,
  'ecommerce-listing': { offer: 0.24, leaks: 0.24, anatomy: 0.15, trust: 0.07, awareness: 0.08, persuasion: 0.04, design: 0.18 },
};

const clamp100 = (n) => Math.max(0, Math.min(100, Math.round(n)));
const nz = (v) => (typeof v === 'number' && Number.isFinite(v) ? clamp100(v) : null);

function archetypeOf(pageType, url) {
  const s = String(pageType || '').toLowerCase();
  if (/comparison|quote|lead-capture/.test(s)) return 'quote-funnel';
  if (/home/.test(s)) return 'brand-homepage';
  if (/category|collection|listing|catalog|\bplp\b|\bshops?\b|\bstore\b/.test(s) && !/\bpdp\b|product (page|detail)/.test(s)) return 'ecommerce-listing';
  if (/product/.test(s)) return 'product-page';
  if (/service|lead/.test(s)) return 'lead-gen';
  if (/landing page|\blp\b|sales page|squeeze|opt-?in/.test(s)) return 'dedicated-lp';
  if (url) {
    if (/\/(quotes?|compare|comparison|campaigns?)\//i.test(url)) return 'quote-funnel';
    if (/\/(shop|store|category|categories|collections?|catalog(ue)?|department|browse|range)\//i.test(url)) return 'ecommerce-listing';
  }
  return 'dedicated-lp';
}

function awarenessV2(gap, sev) {
  if (typeof gap === 'number' && Number.isFinite(gap)) {
    const a = Math.abs(gap);
    return a === 0 ? 92 : a === 1 ? 70 : a === 2 ? 48 : 25;
  }
  switch (sev) {
    case 'match': return 92;
    case 'minor': return 70;
    case 'significant': return 48;
    case 'critical': return 25;
    default: return null;
  }
}

function awarenessV1(sev) {
  switch (sev) {
    case 'match': return 95;
    case 'minor': return 72;
    case 'significant': return 45;
    case 'critical': return 20;
    default: return null;
  }
}

function computeV2(A, url) {
  const arch = archetypeOf(A.anatomy && A.anatomy.page_type, url);
  const skip = ARCHETYPE_SKIP[arch];
  const workabilities = [A.offer, A.leaks]
    .map(x => x && x.quality_self_check && x.quality_self_check.source_workability)
    .filter(v => typeof v === 'number' && Number.isFinite(v));
  const workability = workabilities.length ? Math.min(...workabilities) : null;
  const conf = workability !== null && workability < 45 ? 'degraded' : workability !== null && workability < 60 ? 'low' : 'normal';
  if (conf === 'degraded') return null;

  const rawChecks = A.offer && A.offer.checks && typeof A.offer.checks === 'object' && !Array.isArray(A.offer.checks)
    ? Object.entries(A.offer.checks)
      .filter(([, v]) => v && typeof v === 'object')
      .map(([key, v]) => ({ key, pass: typeof v.pass === 'boolean' ? v.pass : null, score: nz(v.score) }))
    : [];
  const offerChecks = rawChecks.filter(c => !skip.has(c.key));
  const passedChecks = offerChecks.filter(c => c.pass === true);

  const killers = A.leaks && Array.isArray(A.leaks.killers)
    ? A.leaks.killers.slice(0, 3).map(k => ({
      severity: typeof k.severity === 'string' ? k.severity : null,
      title: typeof k.title === 'string' ? k.title : null,
      evidenceKind: typeof k.evidence_kind === 'string' ? k.evidence_kind : null,
    }))
    : null;
  const s1Count = killers !== null ? killers.filter(k => k.severity === 'S1').length : null;
  const s1Active = killers !== null ? killers.filter(k => k.severity === 'S1' && (conf === 'normal' || k.evidenceKind === 'present')).length : null;

  const integrityCompromised = !!(A.leaks && A.leaks.page_integrity && A.leaks.page_integrity.compromised === true);
  const spamKiller = (killers || []).some(k => k.severity === 'S1' && k.title && ((/\bspam\b/i.test(k.title) && /\b(links?|anchors?|inject(ed|ion)?)\b/i.test(k.title)) || /\bhacked\b/i.test(k.title)));
  if (integrityCompromised || spamKiller) return 12;

  const checkScores = offerChecks.map(c => c.score).filter(v => v !== null);
  const offerVal = checkScores.length >= 3 ? Math.round(checkScores.reduce((s, v) => s + v, 0) / checkScores.length) : nz(A.offer && A.offer.overall_offer_score);
  const w = V2_WEIGHTS[arch];
  const dims = [
    { value: offerVal, weight: w.offer },
    { value: nz(A.leaks && A.leaks.overall_score), weight: w.leaks },
    { value: nz(A.anatomy && A.anatomy.anatomy_score), weight: w.anatomy },
    { value: nz(A.trust && A.trust.overall_trust_score), weight: w.trust },
    { value: awarenessV2(A.ad_match && A.ad_match.gap, A.ad_match && A.ad_match.gap_severity), weight: w.awareness },
    { value: nz(A.psych && A.psych.overall_persuasion_score), weight: w.persuasion },
    { value: nz(A.design && A.design.design_score), weight: w.design },
  ];
  const present = dims.filter(d => d.value !== null);
  const presentW = present.reduce((s, d) => s + d.weight, 0);
  const totalW = dims.reduce((s, d) => s + d.weight, 0);
  const coverage = Number((presentW / totalW).toFixed(2));

  const gradedChecks = offerChecks.filter(c => c.pass !== null);
  const hasFullChecks = gradedChecks.length >= 3 && s1Count !== null;
  const leaksVal = nz(A.leaks && A.leaks.overall_score);
  if (hasFullChecks && gradedChecks.length >= 5 && passedChecks.length <= 1 && (s1Active ?? 0) >= 1 && leaksVal !== null && leaksVal <= 40) {
    return Math.max(10, Math.min(20, 20 - s1Count * 3 + passedChecks.length * 3));
  }
  if (coverage < 0.7 || presentW === 0) return null;

  const raw = present.reduce((s, d) => s + d.weight * d.value, 0) / presentW;
  const stretched = clamp100(Math.round(36 + ((raw - 40) * 38) / 30));
  const penalty = s1Count === null ? 0 : 4 * Math.min(s1Count, 3);
  const cap = hasFullChecks ? (s1Count !== null && s1Count >= 1 ? 74 : 100) : 77;
  const score = Math.max(5, Math.min(stretched - penalty, cap));

  if (hasFullChecks && s1Count === 0) {
    const core = offerChecks.filter(c => FLOOR_KEYS.has(c.key));
    if (core.length >= 3 && core.every(c => c.pass === true && (c.score ?? 0) >= 65) && (leaksVal ?? 0) >= 70) {
      return Math.max(score, 80);
    }
  }
  return score;
}

function computeAuditScore(A, url = null) {
  if (!A || typeof A !== 'object') return null;
  const v2 = computeV2(A, url);
  if (v2 !== null) return v2;
  const dims = [
    [V1_WEIGHTS.awareness_fit, awarenessV1(A.ad_match && A.ad_match.gap_severity)],
    [V1_WEIGHTS.offer, nz(A.offer && A.offer.overall_offer_score)],
    [V1_WEIGHTS.leaks, nz(A.leaks && A.leaks.overall_score)],
    [V1_WEIGHTS.anatomy, nz(A.anatomy && A.anatomy.anatomy_score)],
    [V1_WEIGHTS.trust, nz(A.trust && A.trust.overall_trust_score)],
    [V1_WEIGHTS.persuasion, nz(A.psych && A.psych.overall_persuasion_score)],
    [V1_WEIGHTS.design, nz(A.design && A.design.design_score)],
  ].filter(([, v]) => v !== null);
  const totalWeight = dims.reduce((s, [w]) => s + w, 0);
  if (totalWeight > 0) {
    return clamp100(dims.reduce((s, [w, v]) => s + w * v, 0) / totalWeight);
  }
  return nz(A.leaks && A.leaks.overall_score) ?? nz(A.actions && A.actions.action_score) ?? null;
}

module.exports = { computeAuditScore };
