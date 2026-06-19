#!/usr/bin/env bash
# db:core:bootstrap с авто-резолвом WORKSHOP2_DATABASE_URL (bridge IP при битом :5433).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

URL="$(node scripts/resolve-workshop2-database-url.mjs)"
export WORKSHOP2_DATABASE_URL="${URL}"
echo "→ WORKSHOP2_DATABASE_URL=${WORKSHOP2_DATABASE_URL}"

npm run db:apply:workshop2-migrations
npm run db:seed:workshop2-ss27-dossiers

echo "→ parallel seeds (showroom, b2b-demo-order)"
FAIL=0
npm run db:seed:workshop2-ss27-showroom &
P_SHOW=$!
npm run db:seed:workshop2-b2b-demo-order &
P_B2B=$!
wait "${P_SHOW}" || FAIL=1
wait "${P_B2B}" || FAIL=1
if [[ "${FAIL}" -ne 0 ]]; then
  echo "ERROR: showroom или b2b-demo-order seed завершился с ошибкой" >&2
  exit 1
fi

npm run db:seed:workshop2-b2b-production-handoff

echo "→ parallel seeds (sample-order, contextual, fw27-core)"
FAIL=0
npm run db:seed:workshop2-sample-order &
P1=$!
npm run db:seed:workshop2-contextual-demo &
P2=$!
npm run db:seed:workshop2-fw27-core &
P3=$!
wait "${P1}" || FAIL=1
wait "${P2}" || FAIL=1
wait "${P3}" || FAIL=1
if [[ "${FAIL}" -ne 0 ]]; then
  echo "ERROR: один или несколько parallel seeds завершились с ошибкой" >&2
  exit 1
fi
