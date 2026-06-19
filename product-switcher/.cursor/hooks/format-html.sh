#!/usr/bin/env bash
# Format project source files with Prettier after agent edits (requires npm install).
set -euo pipefail

input=$(cat)
file_path=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('file_path',''))" 2>/dev/null || echo "")

# Only format known project source paths
case "$file_path" in
  *index.html|*styles/*|*scripts/*) ;;
  *) exit 0 ;;
esac

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PRETTIER="$ROOT/node_modules/.bin/prettier"

if [[ ! -x "$PRETTIER" ]]; then
  exit 0
fi

"$PRETTIER" --write "$file_path" 2>/dev/null || true
exit 0
