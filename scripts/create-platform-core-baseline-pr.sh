#!/usr/bin/env bash
# Platform Core baseline: зеркало локального synth-1-full → worktree off origin/main (rsync --delete).
# Usage: bash scripts/create-platform-core-baseline-pr.sh [branch-name]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BRANCH="${1:-feat/platform-core-baseline}"
BASE="${BASE_BRANCH:-main}"
WT="$ROOT/.worktrees/$BRANCH"
SRC="$ROOT/_ai-share/synth-1-full"
DEST="$WT/_ai-share/synth-1-full"
PREFIX="_ai-share/synth-1-full/"

RSYNC_EXCLUDES=(
  --exclude='.next/'
  --exclude='.next-*/'
  --exclude='node_modules/'
  --exclude='test-results/'
  --exclude='playwright-report/'
  --exclude='coverage/'
  --exclude='.turbo/'
)

git fetch origin "$BASE"

mkdir -p "$(dirname "$WT")"
if [[ -d "$WT/.git" || -f "$WT/.git" ]]; then
  git -C "$WT" fetch origin "$BASE" 2>/dev/null || true
  git -C "$WT" checkout "$BRANCH" 2>/dev/null || git -C "$WT" checkout -B "$BRANCH" "origin/$BASE"
else
  git worktree add -B "$BRANCH" "$WT" "origin/$BASE"
fi

git -C "$WT" reset --hard "origin/$BASE" >/dev/null

rsync -a --delete "${RSYNC_EXCLUDES[@]}" "$SRC/" "$DEST/"

cd "$WT"
git add -A "$PREFIX"
if git diff --cached --quiet; then
  echo "Нет изменений для baseline PR (локальное дерево = origin/$BASE)." >&2
  exit 1
fi

FILE_COUNT="$(git diff --cached --name-only -- "$PREFIX" | wc -l | tr -d ' ')"
echo "→ worktree $WT готов к коммиту ($FILE_COUNT files)."
echo "  cd $WT && git diff --cached --stat | tail -5"
echo "  ln -sf $ROOT/_ai-share/synth-1-full/node_modules $DEST/node_modules"
echo "  npm run build --prefix _ai-share/synth-1-full"
echo "  git commit && git push -u origin HEAD && gh pr create ..."
