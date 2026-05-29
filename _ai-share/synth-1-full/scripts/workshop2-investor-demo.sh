#!/usr/bin/env bash
# Investor demo — curl probes + investor-demo/status
set -e
BASE="${1:-http://127.0.0.1:3123}"
curl -sfS "$BASE/api/workshop2/investor-demo/status" | head -c 200
curl -sfS "$BASE/api/workshop2/integration-probes" | head -c 200
echo "[investor-demo] OK $BASE"
