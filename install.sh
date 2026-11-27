#!/bin/sh
# PPC.io for any AI tool: curl -fsSL https://raw.githubusercontent.com/agencystew/ppcio/main/install.sh | sh
# It puts the kit in ~/.ppcio/kit and links its skills into each AI tool it finds on this computer.
# Claude Code gets its 2 plugin lines instead, because the plugin also brings the agents and the updates.
# Run it again to update. PPCIO_SRC=<folder> installs from a local copy (tests).
set -e
# Windows: the kit's scripts need a Unix shell. Git Bash and Cygwin break the page checker, so send them to WSL.
case "${PPCIO_OS:-$(uname -s)}" in MINGW*|MSYS*|CYGWIN*|Windows*)
  echo "PPC.io runs on Windows through WSL (Windows Subsystem for Linux)."
  echo "1. Open PowerShell as administrator and run: wsl --install"
  echo "2. Restart, open the Ubuntu app, and run this install line again inside it."
  echo "3. Open your AI tool from Ubuntu (for Claude Code: type claude there)."
  exit 1;; esac
REPO="https://github.com/agencystew/ppcio"
KIT="$HOME/.ppcio/kit"
mkdir -p "$HOME/.ppcio"

if [ -n "$PPCIO_SRC" ]; then
  rm -rf "$KIT" && mkdir -p "$KIT" && cp -R "$PPCIO_SRC/." "$KIT/" && rm -rf "$KIT/.git"
elif [ -d "$KIT/.git" ] && command -v git > /dev/null 2>&1; then
  git -C "$KIT" pull -q --ff-only
elif command -v git > /dev/null 2>&1; then
  rm -rf "$KIT" && git clone -q --depth 1 "$REPO" "$KIT"
else
  T="$(mktemp -d)"
  curl -fsSL "$REPO/archive/refs/heads/main.tar.gz" | tar -xz -C "$T"
  rm -rf "$KIT" && mv "$T"/*/ "$KIT" && rm -rf "$T"
fi
SK="$KIT/plugins/ppcio/skills"
[ -f "$SK/start/SKILL.md" ] || { echo "The download did not hold the PPC.io skills. Try again in a minute."; exit 1; }

# Each tool reads skills from its own folder. A skill keeps its own folder name, because
# start/SKILL.md finds the studio at ../landing-page.
link() { # link <skills folder> <tool name>
  mkdir -p "$1"
  for s in "$SK"/*/; do
    n="$(basename "$s")"
    if [ -e "$1/$n" ] && [ ! -L "$1/$n" ]; then echo "  skipped $n in $1: a skill of that name is already there"; continue; fi
    ln -sfn "${s%/}" "$1/$n"
  done
  echo "Set up for $2: $1"
}
FOUND=0
if command -v codex > /dev/null 2>&1 || [ -d "$HOME/.codex" ]; then link "$HOME/.agents/skills" "Codex"; FOUND=1; fi
if command -v cursor > /dev/null 2>&1 || [ -d "$HOME/.cursor" ]; then link "$HOME/.cursor/skills" "Cursor"; FOUND=1; fi
if [ -d "$HOME/.codeium/windsurf" ]; then link "$HOME/.codeium/windsurf/skills" "Windsurf"; FOUND=1; fi
if [ -d "$HOME/.gemini/antigravity" ]; then link "$HOME/.gemini/antigravity/skills" "Antigravity"; FOUND=1; fi
if command -v gemini > /dev/null 2>&1 || [ -d "$HOME/.gemini" ]; then link "$HOME/.gemini/skills" "Gemini CLI"; FOUND=1; fi
if [ "$FOUND" = 0 ]; then link "$HOME/.agents/skills" "any tool that reads ~/.agents/skills"; fi

# The page checks need Node and a browser. kit.sh downloads both on first use when they are missing.
bash "$SK/landing-page/scripts/kit.sh" setup > "$HOME/.ppcio/install.log" 2>&1 \
  && echo "The page checker is ready." \
  || echo "The page checker installs on first use (about 1 minute)."

echo ""
if command -v claude > /dev/null 2>&1 || [ -d "$HOME/.claude" ]; then
  echo "Claude Code (recommended): type these 2 lines in Claude Code."
  echo "  /plugin marketplace add https://github.com/agencystew/ppcio.git"
  echo "  /plugin install ppcio@ppcio"
  echo ""
fi
echo "PPC.io is installed (3 Flagship Studios: Landing Page, Client Reporting, Agency/In-House Ops OS + 43 workflows, 19 engines, 21 Ads scripts, 24 playbooks)."
echo "Open your AI tool in any folder and try one of these right away:"
echo "  1. What can PPC.io do for me?"
echo "  2. Audit https://mywebsite.com for Google Ads and show me the top 3 things costing me leads."
echo "  3. Drop any Google Ads CSV and ask: Build 3 live client reporting prototypes in my agency colours (or build our Morning Ops Triage & 6-Tab Audit Workbench)."
echo ""
echo "Paste your PPC.io Pro licence key in the chat any time. Update any time by re-running this install line."
