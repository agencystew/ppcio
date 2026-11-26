#!/usr/bin/env python3
"""Check a skill folder for format problems before handing it over.

Usage: python validate_skill.py path/to/skill-folder

Prints PASS / WARN / FAIL lines and exits 1 if anything FAILs.
A clean run proves the format is right, not that the advice is right.
"""
import os
import re
import sys

ALLOWED_FIELDS = {"name", "description", "license", "compatibility",
                  "metadata", "allowed-tools"}
results = []


def report(level, msg):
    results.append((level, msg))


def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return None, text
    raw = m.group(1)
    fields, current = {}, None
    for line in raw.splitlines():
        if not line.strip():
            continue
        top = re.match(r"^([A-Za-z][\w-]*):\s?(.*)$", line)
        if top and not line.startswith(" "):
            current = top.group(1)
            fields[current] = top.group(2).strip()
        elif current:
            fields[current] = (fields[current] + " " + line.strip()).strip()
    for k, v in fields.items():
        if v in (">-", ">", "|", "|-"):
            fields[k] = ""
        fields[k] = fields[k].lstrip(">|- ").strip()
        if len(fields[k]) >= 2 and fields[k][0] == fields[k][-1] and fields[k][0] in "\"'":
            fields[k] = fields[k][1:-1]
    return fields, text[m.end():]


def main(path):
    path = path.rstrip("/")
    skill_md = os.path.join(path, "SKILL.md")
    if not os.path.isfile(skill_md):
        report("FAIL", "SKILL.md not found")
        return
    text = open(skill_md, encoding="utf-8").read()
    fm, body = parse_frontmatter(text)
    if fm is None:
        report("FAIL", "No YAML frontmatter between --- lines")
        return

    extra = set(fm) - ALLOWED_FIELDS
    if extra:
        report("FAIL", f"Frontmatter fields not allowed for upload: {sorted(extra)}")
    else:
        report("PASS", "Frontmatter fields allowed")

    name = fm.get("name", "")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name or ""):
        report("FAIL", f"name '{name}' must be lowercase letters, numbers, hyphens")
    elif len(name) > 64:
        report("FAIL", "name longer than 64 characters")
    elif re.search(r"anthropic|claude", name):
        report("FAIL", "name uses a reserved word")
    else:
        report("PASS", f"name '{name}' ok")
    if os.path.basename(os.path.abspath(path)) != name:
        report("FAIL", "folder name must match the name field")

    desc = fm.get("description", "")
    if not desc:
        report("FAIL", "description is empty")
    else:
        if len(desc) > 1024:
            report("FAIL", f"description is {len(desc)} chars (max 1024)")
        else:
            report("PASS", f"description length {len(desc)}")
        if "<" in desc or ">" in desc:
            report("FAIL", "description contains angle brackets")
        if not re.search(r"\buse (it |this )?(when|for|whenever)\b", desc, re.I):
            report("WARN", "description has no 'Use when' trigger clause")
        if not re.search(r"\b(not for|don't use|do not use|skip when|instead)\b", desc, re.I):
            report("WARN", "description does not say when NOT to use it")
        if re.search(r"\b(I can|I will|you can use)\b", desc, re.I):
            report("WARN", "description should be third person")

    lines = body.count("\n") + 1
    if lines > 500:
        report("FAIL", f"SKILL.md body {lines} lines (max 500)")
    elif lines > 300:
        report("WARN", f"SKILL.md body {lines} lines (aim under 300)")
    else:
        report("PASS", f"SKILL.md body {lines} lines")

    # Placeholders left behind
    for fname, content in iter_md(path):
        if os.sep + "templates" + os.sep in fname:
            continue
        if re.search(r"\{\{[^}]+\}\}", content):
            report("FAIL", f"unfilled {{{{placeholder}}}} in {fname}")

    # Links resolve, references one level deep
    links = re.findall(r"\]\(([^)#\s]+)\)", body)
    for link in links:
        if link.startswith("http"):
            continue
        if not os.path.exists(os.path.join(path, link)):
            report("FAIL", f"broken link in SKILL.md: {link}")
    ref_dir = os.path.join(path, "references")
    if os.path.isdir(ref_dir):
        for fname, content in iter_md(ref_dir):
            n = content.count("\n") + 1
            if n > 100 and not re.search(r"^#+\s*(contents|table of contents)", content, re.I | re.M):
                report("WARN", f"{fname} has {n} lines and no contents list")
            rel = os.path.relpath(fname, path)
            if rel not in " ".join(links):
                report("WARN", f"{rel} is not linked from SKILL.md")

    # Caps-lock shouting
    shouts = re.findall(r"\b(MUST|NEVER|ALWAYS|CRITICAL)\b", body)
    if len(shouts) > 8:
        report("WARN", f"{len(shouts)} all-caps MUST/NEVER/ALWAYS; explain the why instead")

    # Testing and verification signals
    if not os.path.exists(os.path.join(path, "evals.md")):
        report("FAIL", "evals.md missing (need 3 test prompts)")
    else:
        n = len(re.findall(r"^Prompt:", open(os.path.join(path, "evals.md")).read(), re.M))
        report("PASS" if n >= 3 else "FAIL", f"evals.md has {n} prompts")
    if not re.search(r"self-check", body, re.I):
        report("FAIL", "no self-check section in SKILL.md")
    if not re.search(r"guardrail", body, re.I):
        report("FAIL", "no guardrails section in SKILL.md")
    # Google MCP hint: status fields hold the CURRENT status, so filtering
    # historical metrics by status drops paused/removed items and
    # understates cost and conversions.
    for fname, content in iter_md(path):
        for block in re.findall(r"```(?:sql)?\n(.*?)```", content, re.S):
            if re.search(r"segments\.date", block) and re.search(r"\.status\s*(=|!=|IN)", block):
                report("FAIL", f"{os.path.relpath(fname, path)}: GAQL filters historical metrics by status "
                               "(understates cost and conversions; filter zero-impression rows instead)")
    if not re.search(r"lag", text, re.I) and re.search(r"conversion", text, re.I):
        report("WARN", "talks about conversions but never mentions conversion lag")


def iter_md(root):
    for d, _, files in os.walk(root):
        for f in files:
            if f.endswith(".md"):
                p = os.path.join(d, f)
                yield p, open(p, encoding="utf-8").read()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1])
    for level, msg in results:
        print(f"{level}: {msg}")
    fails = sum(1 for lvl, _ in results if lvl == "FAIL")
    warns = sum(1 for lvl, _ in results if lvl == "WARN")
    print(f"\n{fails} fail, {warns} warn")
    sys.exit(1 if fails else 0)
