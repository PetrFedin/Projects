#!/usr/bin/env bash
# Создать PR dev-perf без глобального gh (скачивает бинарник при необходимости).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export ROOT

if [[ -x "/Applications/Xcode.app/Contents/Developer/usr/bin/git" ]]; then
  export PATH="/Applications/Xcode.app/Contents/Developer/usr/bin:$PATH"
fi

BRANCH="${1:-feat/dev-perf-optimization}"
BASE="${2:-main}"
TITLE="perf(dev): route-gated providers, dev:fast, bench tooling"
BODY_FILE=".planning/phases/dev-perf/PR_BODY.md"
export TITLE BODY_FILE BRANCH BASE
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
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    echo "gh не авторизован — пробуем GITHUB_TOKEN + REST API…"
    python3 <<'PY'
import json
import os
import urllib.error
import urllib.request

root = os.environ["ROOT"]
body_file = os.path.join(root, os.environ["BODY_FILE"])
with open(body_file, encoding="utf-8") as fh:
    body = fh.read()

payload = json.dumps(
    {
        "title": os.environ["TITLE"],
        "head": os.environ["BRANCH"],
        "base": os.environ["BASE"],
        "body": body,
    }
).encode("utf-8")

req = urllib.request.Request(
    "https://api.github.com/repos/PetrFedin/Projects/pulls",
    data=payload,
    headers={
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "dev-perf-pr-script",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.load(resp)
        print("PR создан:", data.get("html_url", data))
except urllib.error.HTTPError as err:
    print(err.read().decode("utf-8", errors="replace"))
    raise SystemExit(1)
PY
    exit 0
  fi

  echo "GitHub CLI не авторизован. Выполните:"
  echo "  $GH auth login"
  echo "  # или export GITHUB_TOKEN=ghp_… && bash scripts/create-dev-perf-pr.sh"
  echo ""
  echo "Или PR вручную: $COMPARE_URL"
  if [[ "$(uname -s)" == "Darwin" ]] && command -v open >/dev/null 2>&1; then
    open "$COMPARE_URL" || true
  fi
  exit 1
fi

"$GH" pr create --base "$BASE" --head "$BRANCH" --title "$TITLE" --body-file "$BODY_FILE"
