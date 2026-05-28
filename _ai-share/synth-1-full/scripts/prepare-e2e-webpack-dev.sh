#!/usr/bin/env bash
# Чистый webpack E2E dev (:3123) — после turbopack dev:fast на :3000.
set -euo pipefail
FULL="$(cd "$(dirname "$0")/.." && pwd)"
cd "$FULL"

node scripts/check-shared-next-conflict.cjs e2e
node scripts/kill-e2e-port.cjs
rm -rf .next .next-codex .next-isolated .turbo node_modules/.cache

echo "[prepare-e2e-webpack] .next cleared; safe to run playwright (dev:e2e on :3123)."
