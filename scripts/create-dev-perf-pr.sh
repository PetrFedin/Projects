#!/usr/bin/env bash
# Создать PR dev-perf без глобального gh (скачивает бинарник при необходимости).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

BRANCH="${1:-feat/dev-perf-optimization}"
BASE="${2:-main}"
TITLE="perf(dev): route-gated providers, dev:fast, bench tooling"
BODY_FILE=".planning/phases/dev-perf/PR_BODY.md"
COMPARE_URL="https://github.com/PetrFedin/Projects/compare/${BASE}...${BRANCH}?expand=1"

GH_BIN=""
if command -v gh >/dev/null 2>&1; then
  GH_BIN="$(command -v gh)"
else
  TMP="${TMPDIR:-/tmp}"
  GH_DIR="$TMP/gh-cli"
  GH_ZIP="$TMP/gh_mac_arm64.zip"
  if [[ ! -x "$GH_DIR/bin/gh" ]]; then
    ARCH="$(uname -m)"
    if [[ "$ARCH" == "arm64" ]]; then
      URL="https://github.com/cli/cli/releases/download/v2.92.0/gh_2.92.0_macOS_arm64.zip"
    else
      URL="https://github.com/cli/cli/releases/download/v2.92.0/gh_2.92.0_macOS_amd64.zip"
    fi
    echo "Downloading gh from $URL"
    curl -sL -o "$GH_ZIP" "$URL"
    rm -rf "$GH_DIR"
    unzip -qo "$GH_ZIP" -d "$GH_DIR"
    mv "$GH_DIR"/gh_*/* "$GH_DIR/" 2>/dev/null || true
    mkdir -p "$GH_DIR/bin"
    mv "$GH_DIR"/gh "$GH_DIR/bin/gh" 2>/dev/null || cp "$GH_DIR"/bin/gh "$GH_DIR/bin/gh" 2>/dev/null || true
  fi
  GH_BIN="$GH_DIR/bin/gh"
fi

if [[ ! -x "$GH_BIN" ]] && ! command -v gh >/dev/null 2>&1; then
  echo "gh недоступен. PR вручную:"
  echo "  $COMPARE_URL"
  echo "  Title: $TITLE"
  echo "  Body:  $BODY_FILE"
  exit 1
fi

GH="${GH_BIN:-gh}"
if ! "$GH" auth status >/dev/null 2>&1; then
  echo "GitHub CLI не авторизован. Выполните:"
  echo "  $GH auth login"
  echo ""
  echo "Или PR вручную: $COMPARE_URL"
  exit 1
fi

"$GH" pr create --base "$BASE" --head "$BRANCH" --title "$TITLE" --body-file "$BODY_FILE"
