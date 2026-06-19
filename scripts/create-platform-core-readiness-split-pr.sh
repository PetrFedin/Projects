#!/usr/bin/env bash
# Атомарный PR: только refactor split platform-core-readiness-sections/ (без docs).
# Worktree от origin/main — не трогает текущую ветку.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d "$ROOT/.git" ]]; then
  echo "FAIL: нет .git в $ROOT" >&2
  exit 1
fi

BRANCH="${1:-refactor/platform-core-readiness-sections-split}"
BASE="${BASE_BRANCH:-main}"
WT="$ROOT/.worktrees/$BRANCH"
CODE_FILES=(
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/types.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/index.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/brand-audit.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/shop-audit.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/manufacturer-audit.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/supplier-audit.ts
  _ai-share/synth-1-full/src/lib/platform-core-readiness-sections/empty-cells-audit.ts
)

for f in "${CODE_FILES[@]}"; do
  if [[ ! -e "$ROOT/$f" ]]; then
    echo "FAIL: нет $ROOT/$f" >&2
    exit 1
  fi
done

git fetch origin "$BASE"
mkdir -p "$(dirname "$WT")"
if [[ -d "$WT/.git" || -f "$WT/.git" ]]; then
  git -C "$WT" fetch origin "$BASE" 2>/dev/null || true
  git -C "$WT" checkout "$BRANCH" 2>/dev/null || git -C "$WT" checkout -b "$BRANCH" "origin/$BASE"
else
  git worktree add -B "$BRANCH" "$WT" "origin/$BASE"
fi

for f in "${CODE_FILES[@]}"; do
  mkdir -p "$WT/$(dirname "$f")"
  if [[ -d "$ROOT/$f" ]]; then
    rm -rf "$WT/$f"
    cp -R "$ROOT/$f" "$WT/$f"
  else
    cp "$ROOT/$f" "$WT/$f"
  fi
done

cd "$WT"
git add "${CODE_FILES[@]}"
if git diff --cached --quiet; then
  echo "Нет изменений для code split PR (уже в ветке?)." >&2
  exit 1
fi

git commit -m "$(cat <<'EOF'
refactor(platform-core): split SECTION_AUDIT into per-role modules

Move SECTION_AUDIT and EMPTY_SECTION_AUDIT into platform-core-readiness-sections/
(brand/shop/manufacturer/supplier/empty-cells). Preserve public API via barrel
@/lib/platform-core-readiness-sections — no consumer import changes.
EOF
)"

git push -u origin HEAD

gh pr create --base "$BASE" --title "refactor(platform-core): split platform-core-readiness-sections" --body "$(cat <<'EOF'
## Summary
- Split monolithic `platform-core-readiness-sections.ts` (~1874 lines) into per-role modules under `platform-core-readiness-sections/`.
- Public barrel `@/lib/platform-core-readiness-sections` unchanged — no consumer import changes.

## Test plan
- [x] `npm test -- --testPathPattern=platform-core-readiness-audit|platform-core-comms-canon` (from synth-1-full)
- [x] `npm test -- --testPathPattern=platform-core-hub-matrix`
- [ ] `npm run core:verify` on idle `:3001` (optional full gate)

## Scope
Code only — SECTION-DETAIL docs in a separate PR.

EOF
)"

echo "OK: code-only PR from worktree $WT"
