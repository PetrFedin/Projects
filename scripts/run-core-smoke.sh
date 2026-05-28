#!/usr/bin/env bash
# Критичный путь демо/API (см. docs/MVP_CONTRACT.md)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$ROOT"

if [[ -x "$ROOT/.venv/bin/python" ]] && "$ROOT/.venv/bin/python" -m pytest --version >/dev/null 2>&1; then
  exec "$ROOT/.venv/bin/python" -m pytest tests/ -m smoke_core -q "$@"
fi
if command -v poetry >/dev/null 2>&1; then
  exec poetry run pytest tests/ -m smoke_core -q "$@"
fi
echo "Установите pytest (poetry install в корне или pip install pytest в .venv)." >&2
exit 1
