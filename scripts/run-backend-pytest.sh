#!/usr/bin/env bash
# Полный backend smoke+unit — зеркало job backend в .github/workflows/ci.yml
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$ROOT"

run_pytest() {
  if [[ -x "$ROOT/.venv/bin/python" ]] && "$ROOT/.venv/bin/python" -m pytest --version >/dev/null 2>&1; then
    exec "$ROOT/.venv/bin/python" -m pytest tests/smoke tests/unit -q "$@"
  fi
  if command -v poetry >/dev/null 2>&1; then
    exec poetry run python -m pytest tests/smoke tests/unit -q "$@"
  fi
  echo "Установите pytest: poetry install --without ml --with dev (см. pyproject.toml)." >&2
  exit 1
}

run_pytest "$@"
