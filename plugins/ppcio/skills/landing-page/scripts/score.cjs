// Deterministic audit score roll-up matching the PPC.io Studio (audit-score.ts).
// Keeps Studio, audit.html, batch.html and chat reporting the exact same score.
const WEIGHTS = {
  awareness_fit: 0.22,
  offer: 0.20,
  leaks: 0.18,
  anatomy: 0.15,
  trust: 0.13,
  persuasion: 0.07,
  design: 0.05,
};

function awarenessFit(sev) {
  switch (sev) {
    case 'match': return 95;
    case 'minor': return 72;
    case 'significant': return 45;
    case 'critical': return 20;
    default: return null;
  }
}

const clamp100 = (n) => Math.max(0, Math.min(100, Math.round(n)));
const nz = (v) => (typeof v === 'number' && Number.isFinite(v) ? clamp100(v) : null);

function computeAuditScore(A) {
  if (!A || typeof A !== 'object') return null;
  const dims = [
    [WEIGHTS.awareness_fit, awarenessFit(A.ad_match && A.ad_match.gap_severity)],
    [WEIGHTS.offer, nz(A.offer && A.offer.overall_offer_score)],
    [WEIGHTS.leaks, nz(A.leaks && A.leaks.overall_score)],
    [WEIGHTS.anatomy, nz(A.anatomy && A.anatomy.anatomy_score)],
    [WEIGHTS.trust, nz(A.trust && A.trust.overall_trust_score)],
    [WEIGHTS.persuasion, nz(A.psych && A.psych.overall_persuasion_score)],
    [WEIGHTS.design, nz(A.design && A.design.design_score)],
  ].filter(([, v]) => v !== null);
  const totalWeight = dims.reduce((s, [w]) => s + w, 0);
  if (totalWeight > 0) {
    return clamp100(dims.reduce((s, [w, v]) => s + w * v, 0) / totalWeight);
  }
  return nz(A.leaks && A.leaks.overall_score) ?? nz(A.actions && A.actions.action_score) ?? null;
}

module.exports = { computeAuditScore };
