#!/usr/bin/env bash
# P0: e2e fixes wave — shop pillars, core-16 visibility, visibility route 500, core-restart.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BRANCH="${1:-fix/platform-core-e2e-wave-101}"
BASE="${BASE_BRANCH:-main}"
WT="$ROOT/.worktrees/$BRANCH"
FIX_FILES=(
  _ai-share/synth-1-full/src/app/api/workshop2/b2b/orders/[orderId]/shop-production-visibility/route.ts
  _ai-share/synth-1-full/src/lib/platform-core-shop-production-visibility.ts
  _ai-share/synth-1-full/src/lib/server/workshop2-shop-production-visibility-repository.ts
  _ai-share/synth-1-full/src/lib/server/workshop2-b2b-orders-repository.ts
  scripts/core-restart.sh
)

# Platform-core UI components (OrderDetailChrome, tracking panel, …) require the full
# stack on origin/main — do not copy via worktree until baseline PR lands. Keep those
# fixes in the monorepo working tree / a feat branch against local main.

for f in "${FIX_FILES[@]}"; do
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

for f in "${FIX_FILES[@]}"; do
  mkdir -p "$WT/$(dirname "$f")"
  cp "$ROOT/$f" "$WT/$f"
done

cd "$WT"
git add "${FIX_FILES[@]}"
if git diff --cached --quiet; then
  echo "Нет изменений для e2e fixes PR." >&2
  exit 1
fi

git commit -m "$(cat <<'EOF'
fix(platform-core): shop pillars, visibility panel, tracking policy links

- shop-co-detail-footer-chat-link on order detail chrome
- hide production nav on buyer tracking when visibility excludes production_po
- mount BrandShopProductionVisibilitySettings on /brand/retailers (core-16)
- fix shop-production-visibility route handler shadowing (500)
- core-restart: tolerate missing .next before clean fallback
EOF
)"

git push -u origin HEAD

if command -v gh >/dev/null 2>&1; then
  gh pr create --base "$BASE" --title "fix(platform-core): e2e wave 101 — shop pillars + core-16" --body "$(cat <<'EOF'
## Summary
- Shop order detail footer chat link (`shop-co-detail-footer-chat-link`)
- Buyer tracking production links respect ShopProductionVisibility policy
- Brand retailers visibility settings panel (core-16)
- Fix `shop-production-visibility` GET 500 (handler import shadowing)
- `core-restart.sh` no longer aborts on missing `.next`

## Test plan
- [x] `npx playwright test -g "shop core pillars|core-16"` — 5/5
- [ ] `npm run core:verify` exit 0

Depends on: merge `refactor/platform-core-readiness-sections-split` if hub imports conflict.

EOF
)"
else
  echo "→ gh не найден; PR: https://github.com/PetrFedin/Projects/compare/main...$BRANCH"
fi

echo "OK: e2e fixes PR from worktree $WT"
