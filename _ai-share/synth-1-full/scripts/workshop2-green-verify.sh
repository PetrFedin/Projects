#!/usr/bin/env bash
# Одна команда: unit green manifest + sample-shop E2E (как CI, external dev:e2e).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
export WORKSHOP2_DATABASE_URL="${WORKSHOP2_DATABASE_URL:-postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2}"
echo "==> Workshop2 unit (green manifest)"
npm run test:workshop2:unit
echo "==> Sample-shop E2E (ci-workshop2-sample-shop-e2e.sh)"
bash scripts/ci-workshop2-sample-shop-e2e.sh
echo "==> verify:workshop2 passed"
