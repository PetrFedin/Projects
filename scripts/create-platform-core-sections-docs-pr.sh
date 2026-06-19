#!/usr/bin/env bash
# Атомарный PR: 10 P0 SECTION-DETAIL skeletons (docs only). Worktree от origin/main — не трогает текущую ветку.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d "$ROOT/.git" ]]; then
  echo "FAIL: нет .git в $ROOT" >&2
  exit 1
fi

BRANCH="${1:-docs/platform-core-section-detail-p0}"
BASE="${BASE_BRANCH:-main}"
WT="$ROOT/.worktrees/$BRANCH"
DOC_FILES=(
  .planning/audits/SECTION-DETAIL-BRAND-DEV-PG-SYNC.md
  .planning/audits/SECTION-DETAIL-BRAND-DEV-CROSS.md
  .planning/audits/SECTION-DETAIL-BRAND-CM-SECTION-GROUPS.md
  .planning/audits/SECTION-DETAIL-SHOP-CO-BUYER-TRACKING.md
  .planning/audits/SECTION-DETAIL-MFR-DEV-SAMPLE-QUEUE.md
  .planning/audits/SECTION-DETAIL-MFR-DEV-STATUS.md
  .planning/audits/SECTION-DETAIL-SUP-DEV-BOM.md
  .planning/audits/SECTION-DETAIL-SUP-DEV-MATERIALS.md
  .planning/audits/SECTION-DETAIL-SUP-DEV-COMMS-PEER.md
  .planning/audits/SECTION-DETAIL-SUP-DEV-CABINET.md
)

for f in "${DOC_FILES[@]}"; do
  if [[ ! -f "$ROOT/$f" ]]; then
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

for f in "${DOC_FILES[@]}"; do
  mkdir -p "$WT/$(dirname "$f")"
  cp "$ROOT/$f" "$WT/$f"
done

cd "$WT"
git add "${DOC_FILES[@]}"
if git diff --cached --quiet; then
  echo "Нет изменений для docs PR (уже в ветке?)." >&2
  exit 1
fi

git commit -m "$(cat <<'EOF'
docs(platform-core): add P0 SECTION-DETAIL skeletons for 10 golden gaps

Seed audit docs from SECTION_AUDIT (label, scores, good/bad/fix, SS27 URLs)
for brand dev/comms, shop buyer-tracking, mfr sample queue, supplier dev pillar.
EOF
)"

git push -u origin HEAD

gh pr create --base "$BASE" --title "docs(platform-core): P0 SECTION-DETAIL skeletons (10 gaps)" --body "$(cat <<'EOF'
## Summary
- Add 10 P0 `SECTION-DETAIL` audit skeletons for golden-path gaps (brand dev/comms, shop buyer-tracking, mfr sample queue, supplier dev pillar).
- Seeds from `SECTION_AUDIT` in `platform-core-readiness-sections` — scores, good/bad/fix, SS27 URLs.

## Test plan
- [ ] Review links and section ids against live hub matrix
- No code changes — safe to merge before refactor PR

EOF
)"

echo "OK: docs PR from worktree $WT"
