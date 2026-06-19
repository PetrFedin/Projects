#!/usr/bin/env bash
# Platform Core — статус PG + dev:core.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"

echo "Platform Core status"
echo "--------------------"

pg_line="$(curl -fsS --max-time 3 "http://127.0.0.1:3001/api/workshop2/platform-core/health" 2>/dev/null | node -e "
  let s=''; process.stdin.on('data',d=>s+=d); process.stdin.on('end',()=>{
    try {
      const j=JSON.parse(s);
      if (j.pgReachable) process.stdout.write('OK');
      else if (j.pgConfigured) process.stdout.write('OFF');
      else process.stdout.write('N/A');
    } catch { process.stdout.write('?'); }
  });
" 2>/dev/null || echo "?")"
if [[ "${pg_line}" == "OK" ]]; then
  echo "PG :5433        OK"
elif [[ "${pg_line}" == "OFF" ]]; then
  echo "PG :5433        OFF  → OrbStack + npm run db:core:up"
elif core_lib_pg_ready; then
  echo "PG :5433        OK (port)"
else
  echo "PG :5433        OFF  → OrbStack + npm run db:core:up"
fi

if core_lib_core_dev_ready; then
  spine_pg="$(curl -fsS --max-time 3 "http://127.0.0.1:3001/api/workshop2/platform-core/health" 2>/dev/null | node -e "
    let s=''; process.stdin.on('data',d=>s+=d); process.stdin.on('end',()=>{
      try {
        const j=JSON.parse(s);
        process.stdout.write(j.spineOperationalPgPrimary ? 'primary' : j.operationalOrdersSource || 'mirror');
      } catch { process.stdout.write('?'); }
    });
  " 2>/dev/null || echo "?")"
  if [[ "${spine_pg}" == "primary" ]]; then
    echo "spine SoT        PG-primary ✓"
  elif [[ "${spine_pg}" == "postgres+file" || "${spine_pg}" == "postgres-primary" ]]; then
    echo "spine SoT        ${spine_pg}"
  elif [[ "${spine_pg}" == "?" ]]; then
    echo "spine SoT        ?"
  else
    echo "spine SoT        file+mirror  → SPINE_OPERATIONAL_PG_PRIMARY=1 в .env.local"
  fi
  echo "dev:core :3001  OK   → http://localhost:3001/platform"
elif core_lib_port_listening 3001; then
  echo "dev:core :3001  BUSY (не core) → npm run stop:stale-dev"
else
  echo "dev:core :3001  OFF  → npm run dev:core"
fi

if core_lib_core_dev_ready; then
  threads_info="$(curl -fsS --max-time 2 "http://127.0.0.1:3001/api/brand/messages/threads" 2>/dev/null | node -e "
    let s=''; process.stdin.on('data',d=>s+=d); process.stdin.on('end',()=>{
      try {
        const j=JSON.parse(s);
        const n=(j.threads||[]).length;
        process.stdout.write(j.pgUnavailable ? 'pg-off:'+n : String(n));
      } catch { process.stdout.write('?'); }
    });
  " 2>/dev/null || echo "?")"
  if [[ "${threads_info}" == pg-off:* ]]; then
    echo "chat threads    OFF  → OrbStack + npm run core:prep"
  elif [[ "${threads_info}" =~ ^[0-9]+$ && "${threads_info}" -gt 0 ]]; then
    echo "chat threads    OK   (${threads_info} contextual)"
  elif [[ "${threads_info}" == "0" ]]; then
    echo "chat threads    OFF  → npm run db:seed:workshop2-contextual-demo"
  elif [[ "${threads_info}" == "?" ]]; then
    echo "chat threads    ?    (dev API недоступен)"
  fi
fi

echo ""
echo "Демо-URL: npm run core:demo"
