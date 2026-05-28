#!/usr/bin/env bash
# Fail if text files under .cursor/ (.md, .mdc, .json, .yml/.yaml) contain machine-local monorepo prefixes.
# CI + локально. Исправление: bash scripts/normalize-gsd-cursor-paths.sh
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
if [[ ! -d .cursor ]]; then
  echo "No .cursor directory — skip."
  exit 0
fi
bad=0
while IFS= read -r -d '' f; do
  if grep -qE '(/Users/[^/]+/Projects/|/home/[^/]+/Projects/)' "$f" 2>/dev/null; then
    echo "machine-local monorepo prefix in: $f"
    grep -nE '(/Users/[^/]+/Projects/|/home/[^/]+/Projects/)' "$f" || true
    bad=1
  fi
done < <(find .cursor -type f \( -name '*.md' -o -name '*.mdc' -o -name '*.json' -o -name '*.yml' -o -name '*.yaml' \) ! -path '*/node_modules/*' -print0 2>/dev/null)
if [[ "$bad" -ne 0 ]]; then
  echo "ERROR: commit portable paths only. Fix: bash scripts/normalize-gsd-cursor-paths.sh"
  exit 1
fi
echo "OK: no /Users/.../Projects/ or /home/.../Projects/ under .cursor/ (md, mdc, json, yml)."
