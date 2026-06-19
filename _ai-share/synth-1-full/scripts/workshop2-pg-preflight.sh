#!/usr/bin/env bash
# Wave AB — быстрая проверка PG :5433 перед bootstrap / human UAT.
# Usage: bash scripts/workshop2-pg-preflight.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# OrbStack: docker CLI + DOCKER_HOST (Cursor/minimal PATH shells)
export PATH="${HOME}/.orbstack/bin:${PATH:-/usr/local/bin:/usr/bin:/bin}"
ORBSTACK_SOCK="${HOME}/.orbstack/run/docker.sock"
if [[ -S "$ORBSTACK_SOCK" ]]; then
  export DOCKER_HOST="unix://${ORBSTACK_SOCK}"
fi

PG_PORT="${WORKSHOP2_PG_PORT:-5433}"
port_open() {
  local port="${1:-5433}"
  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "$port" >/dev/null 2>&1
    return $?
  fi
  (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1
}

echo "== Workshop2 PG preflight =="
echo "postgres :5433: $(port_open 5433 && echo OPEN || echo CLOSED)"
echo "postgres :5432: $(port_open 5432 && echo OPEN || echo CLOSED) (native brew — WORKSHOP2_PG_PORT=5432)"
echo "target port WORKSHOP2_PG_PORT=${PG_PORT}: $(port_open "$PG_PORT" && echo OPEN || echo CLOSED)"

if port_open "$PG_PORT"; then
  if command -v pg_isready >/dev/null 2>&1; then
    pg_isready -h 127.0.0.1 -p "$PG_PORT" 2>&1 | sed 's/^/  /' || true
  fi
  echo ""
  echo "✓ Port ${PG_PORT} open — run full bootstrap:"
  echo "  bash scripts/workshop2-pg-bootstrap.sh --smoke"
  exit 0
fi

echo ""
echo "✗ PostgreSQL :${PG_PORT} not reachable on this machine."
exit 1
