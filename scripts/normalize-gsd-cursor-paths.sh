#!/usr/bin/env bash
# Strip machine-specific monorepo prefixes from GSD/Cursor text files under .cursor/
# (.md, .mdc, .json, .yml/.yaml) so paths stay portable after `npx get-shit-done-cc@latest --local --cursor`.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
if [[ ! -d .cursor ]]; then
  echo "No .cursor directory at $ROOT; nothing to do."
  exit 0
fi
changed=0
while IFS= read -r -d '' f; do
  if grep -qE '(/Users/[^/]+/Projects/|/home/[^/]+/Projects/)' "$f" 2>/dev/null; then
    perl -0777 -i -pe 's{/Users/[^/]+/Projects/}{}g; s{/home/[^/]+/Projects/}{}g' "$f"
    echo "normalized: $f"
    changed=1
  fi
done < <(find .cursor -type f \( -name '*.md' -o -name '*.mdc' -o -name '*.json' -o -name '*.yml' -o -name '*.yaml' \) ! -path '*/node_modules/*' -print0)
if [[ "$changed" -eq 0 ]]; then
  echo "No absolute /Users/.../Projects/ or /home/.../Projects/ prefixes found under .cursor/."
fi
