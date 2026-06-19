#!/usr/bin/env bash
# SYNTHA — расширенный статус стека (PG, Core, seed, Redis, Ollama, агенты).
# Usage: syntha-status.sh [--compact]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

COMPACT="${1:-}"

health_json=""
health_json="$(curl -fsS --max-time 4 "http://127.0.0.1:3001/api/workshop2/platform-core/health" 2>/dev/null || true)"

parse_health() {
  local field="$1"
  if [[ -z "${health_json}" ]]; then
    echo "?"
    return
  fi
  node -e "
    let s=process.argv[1], f=process.argv[2];
    try {
      const j=JSON.parse(s);
      const v=j[f];
      process.stdout.write(v===true?'true':v===false?'false':String(v??'?'));
    } catch { process.stdout.write('?'); }
  " "${health_json}" "${field}" 2>/dev/null || echo "?"
}

# --- PostgreSQL ---
if core_lib_pg_ready; then
  PG_LINE="PostgreSQL :5433     ✓ OK"
  PG_OK=1
elif [[ "$(parse_health pgReachable)" == "true" ]]; then
  PG_LINE="PostgreSQL :5433     ✓ OK (health)"
  PG_OK=1
else
  PG_LINE="PostgreSQL :5433     ✗ OFF → OrbStack + npm run db:core:up"
  PG_OK=0
fi

# --- Platform Core ---
if core_lib_core_dev_ready; then
  CORE_LINE="Platform Core :3001 ✓ OK (coreMode)"
  CORE_OK=1
elif core_lib_port_listening 3001; then
  CORE_LINE="Platform Core :3001 ⚠ BUSY — npm run core:restart"
  CORE_OK=0
else
  CORE_LINE="Platform Core :3001 ✗ OFF → npm run dev:core"
  CORE_OK=0
fi

# --- Demo seed ---
seed="$(parse_health demoSeeded)"
if [[ "${seed}" == "true" ]]; then
  SEED_LINE="Demo seed           ✓ OK"
  SEED_OK=1
elif [[ "${CORE_OK}" == "1" ]]; then
  SEED_LINE="Demo seed           ✗ нет → npm run core:bootstrap"
  SEED_OK=0
else
  SEED_LINE="Demo seed           — (core offline)"
  SEED_OK=0
fi

# --- Redis (optional) ---
redis="$(parse_health redisConfigured)"
if [[ "${redis}" == "true" ]]; then
  REDIS_LINE="Redis (chain SSE)   ✓ configured"
else
  REDIS_LINE="Redis (chain SSE)   — poll only (опционально)"
fi

# --- Ollama ---
if curl -fsS --max-time 2 "http://127.0.0.1:11434/api/tags" >/dev/null 2>&1; then
  OLLAMA_LINE="Ollama :11434        ✓ OK"
else
  OLLAMA_LINE="Ollama :11434        — offline (локальный AI опционален)"
fi

# --- Cursor agent (planner) ---
CURSOR_AGENT_LINE="Cursor SDK агент   —"
full_env="${ROOT}/_ai-share/synth-1-full/.env.local"
root_env="${ROOT}/.env.local"
has_key=0
for f in "${full_env}" "${root_env}" "${ROOT}/.env"; do
  if [[ -f "${f}" ]] && grep -qE '^CURSOR_API_KEY=.+' "${f}" 2>/dev/null; then
    has_key=1
    break
  fi
done
runner="${ROOT}/scripts/planner-cursor-agent/node_modules/@cursor/sdk"
if [[ "${has_key}" == "1" && -d "${runner}" ]]; then
  CURSOR_AGENT_LINE="Cursor SDK агент   ✓ ключ + runner"
elif [[ "${has_key}" == "1" ]]; then
  CURSOR_AGENT_LINE="Cursor SDK агент   ⚠ ключ есть → npm run planner:agent:install"
else
  CURSOR_AGENT_LINE="Cursor SDK агент   — CURSOR_API_KEY в .env.local (План → чат)"
fi

# --- FastAPI / stack note (SYNTHA не поднимает) ---
STACK_NOTE="FastAPI/JWT/Stripe   — в app/ (не лаунчер); продукт на /platform"

if [[ "${COMPACT}" == "--compact" ]]; then
  printf 'PG:%s Core:%s Seed:%s\n' "${PG_OK}" "${CORE_OK}" "${SEED_OK}"
  exit 0
fi

echo "SYNTHA — состояние"
echo "=================="
echo "${PG_LINE}"
echo "${CORE_LINE}"
echo "${SEED_LINE}"
echo "${REDIS_LINE}"
echo "${OLLAMA_LINE}"
echo "${CURSOR_AGENT_LINE}"
echo ""
echo "${STACK_NOTE}"
echo ""
if [[ "${CORE_OK}" == "1" ]]; then
  echo "План:     http://127.0.0.1:3001/platform?view=planner"
  echo "Hub:      http://127.0.0.1:3001/platform"
fi
echo ""
echo "Команды: npm run desktop:menu · core:restart · core:bootstrap"
