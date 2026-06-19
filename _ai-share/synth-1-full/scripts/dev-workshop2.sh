#!/usr/bin/env bash
# Wave AC — dev :3000 с PG-only client flag + env из .env.local
#
# Usage:
#   npm run dev:workshop2
#   npm run dev:workshop2:pg          # auto-kill :3000 + dev bypass + internal WMS
#   WORKSHOP2_DEV_KILL_PORT=1 npm run dev:workshop2   # освободить :3000 перед стартом
#
# Точка входа UI (не корень /):
#   http://127.0.0.1:3000/brand/production/workshop2
# Корень / может отдавать 404; при битом кэше .next — 500 и ENOENT .next/server/...
# Лечение без остановки dev: rm -rf .next (Next пересоберёт при следующем запросе).
#
# PostgreSQL (PG-only): в .env.local или перед запуском:
#   WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2
#   NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1
#   WORKSHOP2_DEV_BYPASS_AUTH=true
#   WORKSHOP2_INTERNAL_WMS=true
#
# Smoke:
#   curl -s http://127.0.0.1:3000/api/workshop2/health
#
# Если :3000 занят старым next без PG env — health покажет server_file_persist/postgres:disabled.
# Освободите порт: kill <pid>  или  WORKSHOP2_DEV_KILL_PORT=1 npm run dev:workshop2
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

# PG-only client flag + dossier pool mirrors (WORKSHOP2_DOSSIER_DATABASE_URL, fallback DATABASE_URL)
if [[ -n "${WORKSHOP2_DATABASE_URL:-}" ]]; then
  export WORKSHOP2_DATABASE_URL
  export NEXT_PUBLIC_WORKSHOP2_PG_ONLY="${NEXT_PUBLIC_WORKSHOP2_PG_ONLY:-1}"
  export WORKSHOP2_DOSSIER_DATABASE_URL="${WORKSHOP2_DOSSIER_DATABASE_URL:-$WORKSHOP2_DATABASE_URL}"
  export DATABASE_URL="${DATABASE_URL:-$WORKSHOP2_DATABASE_URL}"
else
  export NEXT_PUBLIC_WORKSHOP2_PG_ONLY="${NEXT_PUBLIC_WORKSHOP2_PG_ONLY:-0}"
fi

# Dev investor demo helpers — явный export для next dev child
export WORKSHOP2_DEV_BYPASS_AUTH="${WORKSHOP2_DEV_BYPASS_AUTH:-}"
export WORKSHOP2_INTERNAL_WMS="${WORKSHOP2_INTERNAL_WMS:-}"

ensure_port_3000_free() {
  local pids
  pids="$(lsof -nP -iTCP:3000 -sTCP:LISTEN -t 2>/dev/null || true)"
  if [[ -z "$pids" ]]; then
    return 0
  fi

  echo "ERROR: port 3000 already in use (127.0.0.1:3000):"
  lsof -nP -iTCP:3000 -sTCP:LISTEN 2>/dev/null || true
  echo
  for pid in $pids; do
    echo "  kill ${pid}   # or: kill -9 ${pid}"
  done
  echo "  Or auto-kill (local dev only): WORKSHOP2_DEV_KILL_PORT=1 npm run dev:workshop2"

  if [[ "${WORKSHOP2_DEV_KILL_PORT:-}" == "1" ]]; then
    echo
    echo "WORKSHOP2_DEV_KILL_PORT=1 — stopping listener(s) on :3000 ..."
    for pid in $pids; do
      kill "$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null || true
    done
    sleep 1
    if lsof -nP -iTCP:3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
      echo "ERROR: port 3000 still in use after kill"
      exit 1
    fi
    echo "  port 3000 freed"
    return 0
  fi

  exit 1
}

ensure_port_3000_free

echo "== dev:workshop2 =="
echo "  NEXT_PUBLIC_WORKSHOP2_PG_ONLY=${NEXT_PUBLIC_WORKSHOP2_PG_ONLY}"
if [[ -n "${WORKSHOP2_DATABASE_URL:-}" ]]; then
  echo "  WORKSHOP2_DATABASE_URL=set"
else
  echo "  WORKSHOP2_DATABASE_URL=unset (file-store mode)"
fi
if [[ -n "${WORKSHOP2_DEV_BYPASS_AUTH:-}" ]]; then
  echo "  WORKSHOP2_DEV_BYPASS_AUTH=${WORKSHOP2_DEV_BYPASS_AUTH}"
else
  echo "  WORKSHOP2_DEV_BYPASS_AUTH=unset"
fi
if [[ -n "${WORKSHOP2_INTERNAL_WMS:-}" ]]; then
  echo "  WORKSHOP2_INTERNAL_WMS=${WORKSHOP2_INTERNAL_WMS}"
else
  echo "  WORKSHOP2_INTERNAL_WMS=unset (auto when PG URL set)"
fi
echo "  http://127.0.0.1:3000/brand/production/workshop2"
echo

node scripts/ensure-supported-node.mjs
exec next dev --hostname 127.0.0.1 --port 3000
