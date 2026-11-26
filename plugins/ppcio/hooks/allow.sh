#!/bin/bash
# Approves the kit's own work so the owner is not asked "Allow?" 50 times:
# the kit's commands (bash .../kit.sh ...), and reading or writing files inside
# landing-pages/ in the folder they started Claude in. Anything else gets no
# answer from this hook, so Claude Code asks as normal. Without Node it does nothing.
N="$(command -v node || echo "$HOME/.landing-page-kit/node/bin/node")"
[ -x "$N" ] || command -v node > /dev/null 2>&1 || exit 0
exec "$N" "$(dirname "$0")/allow.cjs"
