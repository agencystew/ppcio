#!/bin/bash
# bash kit.sh <command> [args]: the one way the skill runs its tools.
#   setup                      install the browser the checks use (once, about 1 minute)
#   capture <url> <folder>     capture a live page for the audit
#   shot <file.html> <round> [phone]   screenshots of a page, saved next to it in r<round>/
#   guard <page.html>          measured faults in the new page
#   library <args>             search the style library (library.cjs); library update downloads the full one
#   checkfacts <folder> [files]  every quote in facts.md must be on their site, word for word
#   captures [--quick] [<root>] <url | folder=url>...  capture many pages at the same time
#   progress <folder> [--watch]  the audit wait screen; --watch keeps it live until audit.html exists
#   batch <landing-pages>       draw batch.html, the agency report: one card per client
#   cost [session.jsonl]      tokens and dollars of a run (main chat and agents)
#   brief <site>              one file with every text the audit agents read
#   firstlook <site> [link]   print the first-look message (marks first look sent without requiring view)
#   agents-dir                print the resolved path to the kit's lp-*.md expert files
#   look <site>               print the look-ready message to send
#   review <folder>            draw review.html: blind scores, before and after, the faults fixed
#   report <folder>            draw audit.html from the audit files
#   open <file>                open a page in their browser (Mac, Linux, Windows)
#   pack <folder>              copy every photo the page loads into assets/, so it stands alone
#   view [site]                start the studio (the real postclick screens on this computer) and print its link
#   studio [port]              run the studio in the foreground (for hosts with native daemon support)
#   wait                       wait for a press in the studio, then print what the owner asked for
#   licence                    PRO, TEAM or FREE
#   unlock <key>               save a PPC.io licence key (licence.cjs)
# The free version runs capture and report on one website. The library board, find and sections, review, pack and batch need the licence.
# The browser lives in ~/.landing-page-kit, so plugin updates do not reinstall it.
# The whole script sits in main(), called on the last line, so bash reads the whole file before it runs.
# A plugin update during a long batch then cannot break a kit.sh that is already running (26 Nov).
main() {
K="$(cd "$(dirname "$0")" && pwd)"; D="${LPK_HOME:-$HOME/.landing-page-kit}"
PW=1.57.0
NODE_V=v24.14.0
# No Node.js: download the official build from nodejs.org into the kit folder, check its checksum, use it.
if [ -x "$D/node/bin/node" ]; then export PATH="$D/node/bin:$PATH"; fi
if ! command -v node > /dev/null 2>&1; then
  case "$(uname -s)-$(uname -m)" in
    Darwin-arm64) P=darwin-arm64 ;; Darwin-x86_64) P=darwin-x64 ;;
    Linux-x86_64) P=linux-x64 ;; Linux-aarch64) P=linux-arm64 ;;
    *) echo "NEEDS_NODE: Node.js is not installed. Install the LTS version from https://nodejs.org (one download, then run this again)."; exit 2 ;;
  esac
  echo "First run: downloading Node.js $NODE_V from nodejs.org (about 50 MB)..."
  F="node-$NODE_V-$P.tar.gz"; T="$(mktemp -d)"; mkdir -p "$D"
  if curl -fsSL "https://nodejs.org/dist/$NODE_V/$F" -o "$T/$F" && curl -fsSL "https://nodejs.org/dist/$NODE_V/SHASUMS256.txt" -o "$T/SUMS" \
     && (cd "$T" && grep " $F\$" SUMS | if command -v shasum > /dev/null 2>&1; then shasum -a 256 -c -; else sha256sum -c -; fi > /dev/null) \
     && rm -rf "$D/node" && mkdir -p "$D/node" && tar -xzf "$T/$F" -C "$D/node" --strip-components 1; then
    export PATH="$D/node/bin:$PATH"; rm -rf "$T"
  else
    rm -rf "$T"; echo "NEEDS_NODE: The Node.js download failed. Install the LTS version from https://nodejs.org, then run this again."; exit 2
  fi
fi
if [ ! -f "$D/node_modules/playwright/package.json" ]; then
  echo "First run: installing the page checker (about 1 minute)..."
  mkdir -p "$D" && cd "$D" && { [ -f package.json ] || echo '{"name":"lpk-runtime","private":true}' > package.json; } \
    && npm install --silent --no-audit --no-fund "playwright@$PW" > "$D/install.log" 2>&1 \
    && npx --yes "playwright@$PW" install chromium >> "$D/install.log" 2>&1 \
    || { echo "The install failed. The log is $D/install.log"; exit 3; }
  cd - > /dev/null
fi
export NODE_PATH="$D/node_modules"
# Normalize <site>, landing-pages/<site>, or /abs/path/to/landing-pages/<site> consistently.
resolve_site_dir() {
  local a="${1%/}"
  if [ -z "$a" ]; then echo "."; return; fi
  if [ -d "$a" ]; then (cd "$a" && pwd); return; fi
  if [ -d "landing-pages/$a" ]; then (cd "landing-pages/$a" && pwd); return; fi
  echo "$a"
}
resolve_site_name() {
  local a="${1%/}"
  [ -z "$a" ] && return
  basename "$a"
}
find_studio_url() {
  local root="$(pwd)"
  while [ ! -d "$root/landing-pages" ] && [ "$root" != / ] && [ "$root" != "$HOME" ]; do root="$(dirname "$root")"; done
  local saved="$(cat "$root/landing-pages/.studio-port" 2>/dev/null || true)"
  if [ -n "$saved" ] && [ "$(curl -fs "http://127.0.0.1:$saved/root" --max-time 1 2>/dev/null)" = "$root" ]; then
    echo "http://localhost:$saved"; return 0
  fi
  for P in $(seq 4870 4899); do
    [ "$P" = "$saved" ] && continue
    if [ "$(curl -fs "http://127.0.0.1:$P/root" --max-time 1 2>/dev/null)" = "$root" ]; then
      echo "http://localhost:$P"; return 0
    fi
  done
}
cmd="${1:-setup}"; shift
case "$cmd" in
  setup) V="$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$K/../../../.claude-plugin/plugin.json")"
    if [ -f "$D/version" ] && [ "$(cat "$D/version")" != "$V" ]; then
      echo "Updated to version $V. What is new:"; awk -v v="$V" '$0 ~ "^## "v {f=1; next} /^## / {f=0} f && NF' "$K/../../../CHANGELOG.md"
    fi
    echo "$V" > "$D/version"; echo "Ready (version $V). Write nothing in chat about this." ;;
  capture) node "$K/capture.cjs" "$@" ;;
  captures) # captures [--quick] [<root>] <url | folder=url>...  every page at the same time
    Q=""; R="."; ITEMS=()
    for x in "$@"; do case "$x" in --quick) Q="--quick" ;; *=http*|http*) ITEMS+=("$x") ;; *) R="$x" ;; esac; done
    # More than one client page at once is agency mode. Competitor captures are part of any audit.
    n=0; for x in "${ITEMS[@]}"; do case "$x" in */competitors/*) ;; *) n=$((n+1)) ;; esac; done
    [ "$n" -gt 1 ] && { node "$K/licence.cjs" need agency || exit 4; }
    L="$(mktemp -d)"; i=0; USED_FOLDERS="|"
    for x in "${ITEMS[@]}"; do i=$((i+1))
      case "$x" in *=http*) f="${x%%=http*}"; u="http${x#*=http}" ;; *) u="$x"; base="$(echo "$u" | sed -E 's#^https?://##; s#^www\.##; s#[/.:].*##')"; f="$R/$base"; case "$USED_FOLDERS" in *"|$f|"*) f="${f}-${i}" ;; esac ;; esac
      USED_FOLDERS="${USED_FOLDERS}${f}|"
      echo "$u|$f" > "$L/$i.job"; mkdir -p "$(dirname "$f")"
      ( node "$K/capture.cjs" "$u" "$f" $Q > "$L/$i.log" 2>&1; echo $? > "$L/$i.code" ) & done; wait
    for j in $(seq 1 $i); do IFS='|' read -r u f < "$L/$j.job"
      if [ "$(cat "$L/$j.code")" = 0 ]; then echo "CAPTURED $u -> $f"; grep -m1 "PHONE NUMBERS DIFFER" "$L/$j.log"
      else echo "NOT CAPTURED $u -> $f: $(grep -m1 -i 'not captured\|failed\|error\|blocked' "$L/$j.log" || tail -1 "$L/$j.log")"; fi; done
    rm -rf "$L" ;;
  shot|guard) # The owner sees the look before the whole page is built (run 9 built page.html first and faked the look).
    F="$1"; D="$(cd "$(dirname "$F")" 2>/dev/null && pwd)"
    if [ "$(basename "$F")" = page.html ] && [ ! -f "$D/directions/.look-sent" ] && [ ! -f "$D/../batch.md" ]; then
      echo "STOP: the owner has not seen the look yet. Open KIT/steps/2-directions.md: build directions/a.html in the style, write directions/choice.md, run kit.sh look $(basename "$D") and send its message. Then build page.html."; exit 5; fi
    if [ "$cmd" = shot ]; then SITE_DIR="$D" node "$K/shot.cjs" "$(basename "$F")" "${2:-1}" ${3:-}; else SITE_DIR="$D" node "$K/guard.cjs" "$(basename "$F")"; fi ;;
  library) # The audit reads the best page of their niche for free. The board and the search need the licence.
    case "$1" in update) node "$K/licence.cjs" library; exit $? ;; board|find|sections) node "$K/licence.cjs" need library || exit 4
      [ -f "${PPCIO_HOME:-$HOME/.ppcio}/library/index.json" ] || node "$K/licence.cjs" library ;; esac
    node "$K/library.cjs" "$@" ;;
  checkfacts) DIR="$(resolve_site_dir "${1:-}")"; shift 2>/dev/null || true; node "$K/checkfacts.cjs" "$DIR" "$@" ;;
  check-site) node "$K/licence.cjs" need site "$(resolve_site_name "${1:-}")" ;;
  report) DIR="$(resolve_site_dir "${1:-.}")"; node "$K/licence.cjs" need site "$(basename "$DIR")" || exit 4
    # Run 12: with no studio running, the message gave a file path. Start the studio first, then find it.
    SURL="$(find_studio_url)"; if [ -z "$SURL" ]; then ( bash "$0" view > /dev/null 2>&1 ); SURL="$(find_studio_url)"; fi
    [ -n "$SURL" ] && export PPCIO_STUDIO="$SURL"
    node "$K/report.cjs" "$DIR" ;;
  pack) node "$K/licence.cjs" need pack || exit 4; DIR="$(resolve_site_dir "${1:-.}")"; shift 2>/dev/null || true; node "$K/pack.cjs" "$DIR" "$@" ;;
  progress) DIR="$(resolve_site_dir "${1:-.}")"; shift 2>/dev/null || true; node "$K/progress.cjs" "$DIR" "$@" ;;
  brief) node "$K/brief.cjs" "$(resolve_site_dir "${1:-}")" ;;
  firstlook) DIR="$(resolve_site_dir "${1:-}")"; LINK="${2:-}"; [ -z "$LINK" ] && { SURL="$(find_studio_url)"; [ -n "$SURL" ] && LINK="$SURL/s/$(basename "$DIR")/"; }; node "$K/firstlook.cjs" "$DIR" ${LINK:+"$LINK"} ;;
  agents-dir) (cd "$K/../../../agents" && pwd -P) ;;
  next) # The harness: reads the work folder and prints the one next step. Run it after every step.
    # Run 12: next worked only from the project folder. Walk up to the folder that holds landing-pages.
    while [ ! -d landing-pages ] && [ "$(pwd)" != / ] && [ "$(pwd)" != "$HOME" ]; do cd ..; done
    N1="$(resolve_site_name "${1:-}")"; shift 2>/dev/null || true; node "$K/next.cjs" "$N1" "$@" | sed "s#KIT/#$(cd "$K/.." && pwd)/#g" ;;
  cost) node "$K/cost.cjs" "$@" ;;
  await) node "$K/await.cjs" "$@" ;;
  look) # The look-ready message, ready to send.
    SURL="$(find_studio_url)"; [ -n "$SURL" ] && export PPCIO_STUDIO="$SURL"
    node "$K/lookready.cjs" "$(resolve_site_name "${1:-}")" ;;
  review) node "$K/licence.cjs" need review || exit 4
    DIR="$(resolve_site_dir "${1:-.}")"; [ -f "$DIR/$(basename "$DIR")-page.zip" ] || [ ! -f "$DIR/page.html" ] || node "$K/pack.cjs" "$DIR" > /dev/null
    SURL="$(find_studio_url)"; [ -n "$SURL" ] && export PPCIO_STUDIO="$SURL"
    node "$K/review.cjs" "$DIR" ;;
  batch) node "$K/licence.cjs" need agency || exit 4; node "$K/batch.cjs" "$@" ;;
  view) # The studio: one local server for every site in ./landing-pages, on port 4870 (or the next free one).
    # Run from a subfolder (landing-pages/<site>/inputs): serve the project folder above it, never the subfolder (blind tests, 26 Nov).
    while [ ! -d landing-pages ] && [ "$(pwd)" != / ] && [ "$(pwd)" != "$HOME" ]; do cd ..; done
    [ -d landing-pages ] || { echo "No landing-pages folder here or above. Run this from the project folder."; exit 1; }
    ROOT="$(pwd)"; P="${PPCIO_PORT:-4870}"
    # A studio already on this port that serves another folder belongs to another project: use the next port.
    while :; do
      R=$(curl -fs "http://127.0.0.1:$P/root" --max-time 1 2>/dev/null)
      if [ "$R" = "$ROOT" ]; then break; fi
      if [ -z "$R" ] && [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$P/" --max-time 1 2>/dev/null)" = "000" ]; then break; fi
      P=$((P+1)); [ $P -gt 4899 ] && break
    done
    if [ "$(curl -fs "http://127.0.0.1:$P/root" --max-time 1 2>/dev/null)" != "$ROOT" ]; then
      mkdir -p "$ROOT/landing-pages"
      nohup node "$K/view.cjs" "$ROOT" --port "$P" < /dev/null > "$ROOT/landing-pages/.studio.log" 2>&1 &
      for i in 1 2 3 4 5 6 7 8 9 10; do curl -fs -o /dev/null "http://127.0.0.1:$P/" --max-time 1 && break; sleep 0.3; done
    fi
    # The Claude desktop app opens it in its pane from .claude/launch.json (preview_start, name "PPC.io studio").
    # Only touch .claude/ when running in Claude Code or a workspace that already uses .claude/.
    if [ -n "${CLAUDECODE:-}" ] || [ -n "${CLAUDE_PROJECT_DIR:-}" ] || [ -d "$ROOT/.claude" ]; then
      mkdir -p "$ROOT/.claude"
      node -e 'const f=process.argv[1],p=+process.argv[2];let j={version:"0.0.1",configurations:[]};try{j=JSON.parse(require("fs").readFileSync(f,"utf8"))}catch{}j.configurations=(j.configurations||[]).filter(c=>c.name!=="PPC.io studio");j.configurations.push({name:"PPC.io studio",url:"http://localhost:"+p,port:p});require("fs").writeFileSync(f,JSON.stringify(j,null,2)+"\n")' "$ROOT/.claude/launch.json" "$P"
    fi
    mkdir -p "$ROOT/landing-pages"; echo "$P" > "$ROOT/landing-pages/.studio-port"
    S="$(resolve_site_name "${1:-}")"; echo "STUDIO http://localhost:$P/${S:+s/$S/}"; [ -n "$S" ] && [ ! -f "landing-pages/$S/audit.md" ] && node "$K/firstlook.cjs" "$ROOT/landing-pages/$S" "http://localhost:$P/s/$S/" ;;
  studio) # Run the studio in the foreground (for non-Claude hosts with native daemon support).
    while [ ! -d landing-pages ] && [ "$(pwd)" != / ] && [ "$(pwd)" != "$HOME" ]; do cd ..; done
    [ -d landing-pages ] || { echo "No landing-pages folder here or above. Run this from the project folder."; exit 1; }
    P="${1:-${PPCIO_PORT:-4870}}"; mkdir -p landing-pages; echo "$P" > landing-pages/.studio-port
    exec node "$K/view.cjs" "$(pwd)" --port "$P" ;;
  wait) P=$(cat landing-pages/.studio-port 2>/dev/null || echo "${PPCIO_PORT:-4870}"); node "$K/wait.cjs" "$(pwd)" --port "$P" ;;
  licence) node "$K/licence.cjs" status ;;
  unlock) node "$K/licence.cjs" unlock "$@" ;;
  open) F="$1"; case "$F" in http*) ;; *) [ -e "$F" ] || { echo "No file: $F"; exit 1; } ;; esac
    if command -v open > /dev/null 2>&1 && [ "$(uname -s)" = Darwin ]; then open "$F"
    elif command -v xdg-open > /dev/null 2>&1; then xdg-open "$F" > /dev/null 2>&1 &
    elif command -v cmd.exe > /dev/null 2>&1; then cmd.exe /c start "" "$F"
    else case "$F" in http*) echo "Open this link in your browser: $F" ;; *) echo "Open this file in your browser: $(cd "$(dirname "$F")" && pwd)/$(basename "$F")" ;; esac; fi ;;
  *) echo "Unknown command: $cmd"; exit 1 ;;
esac
}
main "$@"; exit $?
