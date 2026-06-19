#!/usr/bin/env bash
# Wave K/Y — bootstrap PostgreSQL + MinIO для Workshop2 на macOS.
#
# Требуется один из: Docker Desktop, OrbStack, Colima (+ docker CLI), Podman,
# либо уже поднятый PostgreSQL на 127.0.0.1:5433 (без Docker).
#
# Usage:
#   bash scripts/workshop2-pg-bootstrap.sh
#   bash scripts/workshop2-pg-bootstrap.sh --smoke   # после подъёма: migrations + seed + smoke
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

COMPOSE_FILE="docker-compose.workshop2.yml"
PG_PORT="${WORKSHOP2_PG_PORT:-5433}"
PG_URL="postgresql://workshop2:workshop2_dev@127.0.0.1:${PG_PORT}/workshop2"
RUN_SMOKE=false
NATIVE_HINT=false
ORBSTACK_SOCK="${HOME}/.orbstack/run/docker.sock"
DESKTOP_SOCK="/var/run/docker.sock"

for arg in "$@"; do
  case "$arg" in
    --smoke) RUN_SMOKE=true ;;
    --native-hint) NATIVE_HINT=true ;;
    -h|--help)
      cat <<EOF
Usage: bash scripts/workshop2-pg-bootstrap.sh [--smoke] [--native-hint]

  --smoke        migrations + seed + smoke:workshop2
  --native-hint  Homebrew/native PG hints (5432 vs 5433, WORKSHOP2_PG_PORT)

Env:
  WORKSHOP2_PG_PORT   PostgreSQL port (default 5433; use 5432 for brew services postgresql@16)
EOF
      exit 0
      ;;
  esac
done

port_open() {
  local port="${1:-5433}"
  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "$port" >/dev/null 2>&1
    return $?
  fi
  (echo >/dev/tcp/127.0.0.1/"$port") >/dev/null 2>&1
}

print_native_pg_hint() {
  echo "== Native PostgreSQL hint (Homebrew) =="
  echo "  WORKSHOP2_PG_PORT=${PG_PORT} (override: export WORKSHOP2_PG_PORT=5432)"
  if port_open 5432; then
    echo "  :5432 OPEN — типичный brew postgresql@16"
    if ! port_open 5433; then
      echo "  :5433 CLOSED — для native без Docker:"
      echo "    export WORKSHOP2_PG_PORT=5432"
      echo "    export WORKSHOP2_DATABASE_URL=postgresql://\$(whoami)@127.0.0.1:5432/workshop2"
      echo "    createdb workshop2  # если БД ещё нет"
    fi
  else
    echo "  :5432 CLOSED"
  fi
  if port_open 5433; then
    echo "  :5433 OPEN — compose / custom port OK"
  else
    echo "  :5433 CLOSED — docker compose -f docker-compose.workshop2.yml up -d"
  fi
  if command -v brew >/dev/null 2>&1; then
    echo ""
    echo "  brew services list | grep -i postgres || true"
    brew services list 2>/dev/null | grep -i postgres || echo "    (no postgresql service)"
  fi
  if command -v pg_isready >/dev/null 2>&1; then
    for p in 5432 5433; do
      pg_isready -h 127.0.0.1 -p "$p" 2>&1 | sed "s/^/  pg_isready :$p /" || true
    done
  else
    echo "  pg_isready: NOT FOUND (brew install libpq && brew link --force libpq)"
  fi
  echo ""
}

postgres_ready_native() {
  if command -v pg_isready >/dev/null 2>&1; then
    pg_isready -h 127.0.0.1 -p "$PG_PORT" -U workshop2 -d workshop2 >/dev/null 2>&1 && return 0
    pg_isready -h 127.0.0.1 -p "$PG_PORT" >/dev/null 2>&1 && return 0
  fi
  port_open "$PG_PORT"
}

configure_orbstack_docker_host() {
  if [[ -S "$ORBSTACK_SOCK" ]]; then
    export DOCKER_HOST="unix://${ORBSTACK_SOCK}"
    return 0
  fi
  if [[ -d "/Applications/OrbStack.app" && -S "$DESKTOP_SOCK" ]] && docker info 2>/dev/null | grep -qi orbstack; then
    return 0
  fi
  return 1
}

detect_compose() {
  if configure_orbstack_docker_host && command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    if [[ -n "${DOCKER_HOST:-}" ]]; then
      echo "docker compose (OrbStack: ${DOCKER_HOST})"
    else
      echo "docker compose (OrbStack)"
    fi
    return 0
  fi
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    echo "docker compose"
    return 0
  fi
  if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
    echo "podman compose"
    return 0
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    echo "docker-compose"
    return 0
  fi
  return 1
}

print_runtime_diagnostics() {
  echo "== Runtime check =="
  echo "docker:   $(command -v docker 2>/dev/null || echo 'NOT FOUND')"
  echo "podman:   $(command -v podman 2>/dev/null || echo 'NOT FOUND')"
  echo "colima:   $(command -v colima 2>/dev/null || echo 'NOT FOUND')"
  echo "orbstack: $(command -v orbstack 2>/dev/null || echo 'NOT FOUND (app may still be installed)')"
  if [[ -S "$ORBSTACK_SOCK" ]]; then
    echo "orbstack socket: FOUND at ${ORBSTACK_SOCK}"
    if ! command -v docker >/dev/null 2>&1; then
      echo "  → socket есть, но docker CLI отсутствует: brew install docker docker-compose"
    fi
  else
    echo "orbstack socket: NOT FOUND (${ORBSTACK_SOCK})"
  fi
  if [[ -d "/Applications/OrbStack.app" ]]; then
    echo "OrbStack.app: installed — запустите: open -a OrbStack"
  fi
  if port_open 5433; then
    echo "postgres :5433: port OPEN (возможен native PG без Docker)"
    if command -v pg_isready >/dev/null 2>&1; then
      pg_isready -h 127.0.0.1 -p 5433 2>&1 | sed 's/^/  /' || true
    fi
  else
    echo "postgres :5433: port CLOSED"
  fi
  if port_open 5432; then
    echo "postgres :5432: port OPEN (Homebrew native — export WORKSHOP2_PG_PORT=5432)"
  else
    echo "postgres :5432: port CLOSED"
  fi
}

print_macos_install_guide() {
  cat <<'EOF'

╔══════════════════════════════════════════════════════════════════╗
║  Workshop2 PG — контейнерный runtime не найден (Wave Y)         ║
╚══════════════════════════════════════════════════════════════════╝

На macOS установите ОДИН из вариантов:

  1) OrbStack (рекомендуется, быстрый):
       brew install orbstack
       open -a OrbStack
       # socket: ~/.orbstack/run/docker.sock

  2) Docker Desktop:
       https://docs.docker.com/desktop/install/mac-install/

  3) Colima + Docker CLI:
       brew install colima docker docker-compose
       colima start

  4) Podman Desktop:
       brew install podman podman-compose
       podman machine init && podman machine start

  5) Native PostgreSQL на :5433 (без Docker):
       brew install postgresql@16
       createdb -p 5433 workshop2   # или свой инстанс
       export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2

После установки перезапустите терминал и выполните:

  bash scripts/workshop2-pg-bootstrap.sh --smoke

Ручной подъём (если compose уже работает):

  docker compose -f docker-compose.workshop2.yml up -d
  export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2
  export NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1
  npm run db:apply:workshop2-migrations
  npm run db:seed:workshop2-ss27-dossiers
  npm run dev

Проверка PG:
  docker compose -f docker-compose.workshop2.yml ps
  curl -sf http://127.0.0.1:3000/api/workshop2/health

EOF
}

apply_migrations_and_seed() {
  export WORKSHOP2_DATABASE_URL="$PG_URL"
  echo "export WORKSHOP2_DATABASE_URL=$PG_URL"
  echo "== Applying migrations =="
  npm run db:apply:workshop2-migrations
  echo "== Seeding SS27 dossiers =="
  if ! npm run db:seed:workshop2-ss27-dossiers; then
    echo ""
    echo "ERROR: SS27 dossier seed failed (migrations already applied)."
    echo "Retry seed only:"
    echo "  export WORKSHOP2_DATABASE_URL=$PG_URL"
    echo "  npm run db:seed:workshop2-ss27-dossiers"
    echo "Then re-run smoke if needed:"
    echo "  bash scripts/workshop2-pg-bootstrap.sh --smoke"
    exit 1
  fi
}

finish_ok() {
  cat <<EOF

✓ PG stack ready.

Add to .env.local (or export before npm run dev):

  WORKSHOP2_DATABASE_URL=$PG_URL
  NEXT_PUBLIC_WORKSHOP2_PG_ONLY=1

Then restart dev server:

  npm run dev

EOF
  if [[ "$RUN_SMOKE" == "true" ]]; then
    echo "== Running smoke:workshop2 =="
    npm run smoke:workshop2
  fi
  echo "ok: workshop2-pg-bootstrap finished"
}

USE_NATIVE_PG=false
if [[ "$NATIVE_HINT" == "true" ]]; then
  print_native_pg_hint
fi

if postgres_ready_native; then
  echo "== Native PostgreSQL detected on 127.0.0.1:${PG_PORT} (skip Docker) =="
  USE_NATIVE_PG=true
fi

if [[ "$USE_NATIVE_PG" == "true" ]]; then
  apply_migrations_and_seed
  finish_ok
  exit 0
fi

if ! COMPOSE_CMD=$(detect_compose); then
  print_runtime_diagnostics
  print_native_pg_hint
  print_macos_install_guide
  exit 1
fi

echo "== Using: $COMPOSE_CMD =="
echo "== Starting workshop2-postgres + workshop2-minio =="
$COMPOSE_CMD -f "$COMPOSE_FILE" up -d

echo "== Waiting for postgres health (max 60s) =="
deadline=$((SECONDS + 60))
while (( SECONDS < deadline )); do
  if $COMPOSE_CMD -f "$COMPOSE_FILE" ps --format json 2>/dev/null | grep -q '"Health":"healthy"'; then
    break
  fi
  if docker exec synth-workshop2-postgres pg_isready -U workshop2 -d workshop2 >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

apply_migrations_and_seed
finish_ok
