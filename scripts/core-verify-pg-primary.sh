#!/usr/bin/env bash
# Platform Core: verify PG-primary mode (SPINE_OPERATIONAL_PG_PRIMARY=1 in dev:core env).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=core-lib.sh
source "${ROOT}/scripts/core-lib.sh"
cd "${ROOT}"

if ! core_lib_pg_ready; then
  echo "FAIL: PostgreSQL :5433 недоступен." >&2
  exit 1
fi

if ! core_lib_core_dev_ready; then
  echo "FAIL: dev:core не отвечает на :3001 → npm run dev:core" >&2
  exit 1
fi

health="$(curl -fsS --max-time 8 http://127.0.0.1:3001/api/workshop2/platform-core/health || true)"
if ! echo "$health" | grep -q '"ok":true'; then
  echo "FAIL: platform-core health" >&2
  echo "$health" >&2
  exit 1
fi

if echo "$health" | grep -q '"spineOperationalPgPrimary":true'; then
  echo "OK  spineOperationalPgPrimary=true"
else
  echo "WARN spineOperationalPgPrimary=false — добавьте SPINE_OPERATIONAL_PG_PRIMARY=1 в .env.local и перезапустите dev:core" >&2
  exit 1
fi

if echo "$health" | grep -q '"operationalOrdersSource":"postgres-primary"'; then
  echo "OK  operationalOrdersSource=postgres-primary"
else
  echo "FAIL: operationalOrdersSource не postgres-primary" >&2
  echo "$health" >&2
  exit 1
fi

integrations="$(curl -fsS --max-time 8 http://127.0.0.1:3001/api/integrations/v1/status || true)"
if echo "$integrations" | grep -q 'postgres-primary'; then
  echo "OK  integrations hub reports postgres-primary"
else
  echo "WARN integrations status без postgres-primary (проверьте SPINE_OPERATIONAL_PG_PRIMARY)" >&2
fi

# SoT: все pillar stores в postgres при pg-primary (не file_fallback / memory / localStorage)
if echo "$health" | grep -q '"platformCoreSpinePgPrimary":true'; then
  spine_bad="$(echo "$health" | node -e "
    let j;
    try { j = JSON.parse(require('fs').readFileSync(0, 'utf8')); } catch { process.exit(0); }
    if (!j.platformCoreSpinePgPrimary) process.exit(0);
    const bad = (j.spineStores || []).filter((s) => s.pgPrimary && s.mode !== 'postgres');
    if (bad.length) console.log(bad.map((s) => s.id + ':' + s.mode).join(','));
  " 2>/dev/null || true)"
  if [ -n "${spine_bad:-}" ]; then
    echo "FAIL: spine stores not unified to postgres: ${spine_bad}" >&2
    echo "$health" >&2
    exit 1
  fi
  echo "OK  spineStores unified (all postgres mode)"
fi

echo "→ smoke subset (health + integrations)"
npm run smoke:core --prefix _ai-share/synth-1-full
echo "PASS core:verify:pg-primary"
