#!/usr/bin/env python3
"""Agency & In-House PPC OS Studio: 6-Gate Audit Compiler.

Enforces hard operational quality rules BEFORE any audit or ops plan ships:
1. No menu-path teases ("Open Google Ads > Campaigns to check") -> evidence must sit on the page
2. No $0/£0 daily budget instructions (Google Ads rejects 0 -> pause campaign)
3. No agency-firing blame/settings language ("your team broke", "learning phase", "rivals")
4. No confected vanity scores ("Overall Health Score: 42/100")
5. Strict Playbook Dependency check (flags keyword/negative cuts while tracking is BROKEN)
6. Vocabulary & clean voice check (zero em dashes; ecom vs lead_gen vocabulary match)
"""
import argparse
import json
import re
import sys
from pathlib import Path

BANNED_PATTERNS = [
    (r"open google ads\s*>\s*", "MENU_TEASE: Never tell the reader to open Google Ads menus to find proof; put the evidence on the page."),
    (r"set (?:the )?(?:daily )?budget to [£$€]0\b", "INVALID_BUDGET_ZERO: Google Ads rejects a 0 daily budget; pause the campaign instead."),
    (r"\byour team (?:broke|blocked|messed up|forgot)\b", "BLAME_TONE: State the neutral fact and date; never blame the team."),
    (r"\blearning phase\b", "JARGON_EXCUSE: Avoid blaming 'learning phase' in stakeholder audits."),
    (r"\brivals\b", "VOICE_RULE: Use 'competitors', never 'rivals'."),
    (r"\bhealth score\s*[:\-]?\s*\d{1,2}\s*/\s*100\b", "CONFECTED_SCORE: Use verified dollar receipts, not arbitrary /100 health scores."),
    (r"—", "VOICE_RULE: Remove em dashes for plain, direct English."),
]


def verify_audit(text, account_type="lead_gen", tracking_broken=False):
    errors = []
    for pat, msg in BANNED_PATTERNS:
        if re.search(pat, text, re.I if pat != "—" else 0):
            errors.append(msg)
    if tracking_broken and re.search(r"(?:priority\s*#?1|move\s*#?1|step\s*1).{0,80}(?:negative|cut keyword|pause keyword)", text, re.I | re.S):
        errors.append("DEPENDENCY_VIOLATION: Tracking is BROKEN; fix conversion tracking BEFORE cutting keywords or adding negatives.")
    if account_type == "ecommerce" and re.search(r"\b(cost per lead|cpl)\b", text, re.I):
        errors.append("VOCAB_LEAK: Ecommerce audit uses lead-gen terminology (CPL).")
    if account_type == "lead_gen" and re.search(r"\b(target roas|average order value)\b", text, re.I):
        errors.append("VOCAB_LEAK: Lead-gen audit uses ecommerce terminology (tROAS/AOV).")
    return errors


def main():
    ap = argparse.ArgumentParser(description="6-Gate Audit & Ops Quality Compiler")
    ap.add_argument("--draft", required=True, help="Audit markdown/HTML file to verify")
    ap.add_argument("--state", default="", help="Optional ops_state.json to check tracking_broken dependency")
    ap.add_argument("--type", choices=["lead_gen", "ecommerce", "saas"], default="lead_gen")
    args = ap.parse_args()

    text = Path(args.draft).read_text(encoding="utf-8")
    tracking_broken = False
    if args.state and Path(args.state).exists():
        st = json.loads(Path(args.state).read_text(encoding="utf-8"))
        tracking_broken = any(a.get("tracking_broken") for a in st.get("accounts", []))

    errors = verify_audit(text, args.type, tracking_broken)
    if errors:
        for e in errors:
            print(f"FAIL: {e}")
        sys.exit(1)
    print("PASS: Audit passed all 6 deterministic operating-system quality gates.")


if __name__ == "__main__":
    main()
