#!/usr/bin/env bash
# Общие хелперы Platform Core (source, не exec).
core_lib_port_listening() {
  local port="$1"
  lsof -nP -iTCP:"${port}" -sTCP:LISTEN -t >/dev/null 2>&1
}

core_lib_http_ok() {
  local url="$1"
  local needle="${2:-}"
  local body
  body="$(curl -fsS --max-time 3 "${url}" 2>/dev/null || true)"
  [[ -n "${body}" ]] || return 1
  [[ -z "${needle}" ]] || grep -q "${needle}" <<<"${body}"
}

core_lib_pg_ready() {
  if docker exec synth-workshop2-postgres psql -U workshop2 -d workshop2 -tAc 'SELECT 1' >/dev/null 2>&1; then
    return 0
  fi
  if command -v psql >/dev/null 2>&1; then
    PGPASSWORD=workshop2_dev psql -h 127.0.0.1 -p 5433 -U workshop2 -d workshop2 -tAc 'SELECT 1' >/dev/null 2>&1 &&
      return 0
  fi
  return 1
}

core_lib_pg_recycle() {
  local compose="$1"
  docker rm -f synth-workshop2-postgres synth-workshop2-minio 2>/dev/null || true
  docker compose -f "${compose}" up -d --remove-orphans
}

core_lib_core_dev_ready() {
  core_lib_http_ok "http://127.0.0.1:3001/api/workshop2/platform-core/health" '"coreMode":true'
}

# Загрузить SPINE_* из synth-1-full/.env.local (dev:core / e2e).
core_lib_load_spine_pg_env_from_local() {
  local env_file="${1:-}"
  [[ -n "${env_file}" && -f "${env_file}" ]] || return 0
  if grep -qE '^SPINE_OPERATIONAL_PG_PRIMARY=1' "${env_file}" 2>/dev/null; then
    export SPINE_OPERATIONAL_PG_PRIMARY=1
    echo "→ SPINE_OPERATIONAL_PG_PRIMARY=1 (${env_file})"
  fi
  if grep -qE '^SPINE_OPERATIONAL_PG=1' "${env_file}" 2>/dev/null; then
    export SPINE_OPERATIONAL_PG=1
  fi
}
