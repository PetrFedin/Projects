#!/usr/bin/env bash
# Alembic + dev user seed (без Poetry). Создаёт БД synth1 при необходимости.
set -euo pipefail
cd "$(dirname "$0")/.."

PY="${PYTHON:-/Library/Frameworks/Python.framework/Versions/3.14/bin/python3}"
export PYTHONPATH="${PWD}${PYTHONPATH:+:$PYTHONPATH}"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env — проверьте DATABASE_URL (на macOS user = $(whoami))"
fi

# Подсказка: DATABASE_URL в .env, не в shell one-liner
if grep -q 'YOUR_USER\|postgres:postgres@' .env 2>/dev/null; then
  MAC_USER="$(whoami)"
  echo "Fixing DATABASE_URL in .env → user $MAC_USER"
  sed -i '' "s|postgresql+asyncpg://postgres:postgres@|postgresql+asyncpg://${MAC_USER}@|g" .env 2>/dev/null || \
    sed -i "s|postgresql+asyncpg://postgres:postgres@|postgresql+asyncpg://${MAC_USER}@|g" .env
fi

if command -v psql >/dev/null 2>&1; then
  if ! psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='synth1'" | grep -q 1; then
    echo "Creating database synth1..."
    psql -d postgres -c "CREATE DATABASE synth1;"
  fi
else
  echo "Warning: psql not found — создайте БД synth1 вручную"
fi

"$PY" -m pip install -q alembic sqlalchemy asyncpg 2>/dev/null || true

if ! "$PY" -m alembic upgrade head; then
  echo "Note: alembic upgrade failed — проверьте DATABASE_URL в .env"
fi

echo "Creating tables (create_all)..."
"$PY" scripts/init_db_schema.py || echo "init_db_schema failed — см. DATABASE_URL"

if AUTH_USE_DB=true "$PY" scripts/seed_dev_users.py; then
  echo "Dev users seeded (AUTH_USE_DB=true)."
else
  echo "Seed skipped or failed — для mock-auth оставьте AUTH_USE_DB=false"
fi

echo ""
echo "Next: bash scripts/run-backend-dev.sh"
echo "  curl -s http://127.0.0.1:8000/api/v1/platform/stack/health | python3 -m json.tool"
