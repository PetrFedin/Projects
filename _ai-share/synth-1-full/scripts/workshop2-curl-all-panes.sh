#!/usr/bin/env bash
# Wave AD: curl all w2pane deep links for demo-ss27-01
set -euo pipefail
BASE="${WORKSHOP2_CURL_BASE_URL:-${1:-http://127.0.0.1:3000}}"
ARTICLE=demo-ss27-01
for pane in \
  overview \
  tz \
  supply \
  fit \
  plan \
  release \
  qc \
  stock \
  vault \
  documents \
  sample \
  nesting
do
  if curl -sfS -o /dev/null "$BASE/brand/production/workshop2/c/SS27/a/$ARTICLE?w2pane=${pane}"; then
    echo "ok $pane"
  else
    echo "FAIL $pane"
    exit 1
  fi
done
# file-store seed — только без PG-only (в PG ожидаем 404)
if curl -sfS -o /dev/null "$BASE/api/workshop2/articles/SS27/$ARTICLE/file-store-demo-ss27-01-sample-order" 2>/dev/null; then
  echo "ok file-store-sample-order"
else
  echo "skip file-store-sample-order (PG-only or no file-store)"
fi
