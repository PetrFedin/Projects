#!/usr/bin/env bash
# Synth-1 backend dev — без Poetry (Python 3.14 + pip deps)
set -euo pipefail
cd "$(dirname "$0")/.."

PY="${PYTHON:-}"
if [[ -z "$PY" ]]; then
  for candidate in \
    /Library/Frameworks/Python.framework/Versions/3.14/bin/python3 \
    /opt/homebrew/bin/python3 \
    python3; do
    if command -v "$candidate" >/dev/null 2>&1; then
      PY="$candidate"
      break
    fi
  done
fi

if [[ -z "$PY" ]]; then
  echo "Python 3 not found. Set PYTHON=/path/to/python3" >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

missing=()
for pkg in fastapi uvicorn sqlalchemy alembic httpx asyncpg python-jose passlib; do
  if ! "$PY" -c "import ${pkg//-/_}" 2>/dev/null; then
    missing+=("$pkg")
  fi
done
if ((${#missing[@]})); then
  echo "Installing: ${missing[*]}"
  "$PY" -m pip install -q "${missing[@]}"
fi

export PYTHONPATH="${PWD}${PYTHONPATH:+:$PYTHONPATH}"
PORT="${PORT:-8000}"

if lsof -i ":$PORT" >/dev/null 2>&1; then
  echo "Port $PORT busy. To free it, run:"
  lsof -i ":$PORT" | awk 'NR==2{print "  kill " $2}'
  echo "Or use another port: PORT=8001 bash scripts/run-backend-dev.sh"
  exit 1
fi

echo "Starting Synth-1 API on http://127.0.0.1:$PORT (Python: $PY)"
exec "$PY" -m uvicorn app.main:app --reload --host 127.0.0.1 --port "$PORT"
