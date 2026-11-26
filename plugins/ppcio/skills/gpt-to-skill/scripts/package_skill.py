#!/usr/bin/env python3
"""Zip a skill folder so it uploads to Claude (Customize > Skills > Upload a skill).

Usage: python package_skill.py path/to/skill-folder [--out dir]
The zip holds the folder itself at its root, without caches or .DS_Store.
"""
import argparse
import zipfile
from pathlib import Path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--out", default=".")
    a = ap.parse_args()
    src = Path(a.folder).resolve()
    if not (src / "SKILL.md").exists():
        raise SystemExit(f"No SKILL.md in {src}")
    out = Path(a.out) / f"{src.name}.zip"
    n = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(src.rglob("*")):
            if f.is_file() and "__pycache__" not in f.parts and f.name != ".DS_Store":
                z.write(f, Path(src.name) / f.relative_to(src))
                n += 1
    print(f"Wrote {out} ({n} files, {out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
