#!/usr/bin/env bash
set -e
node scripts/workshop2-mes-mock-server.mjs &
PID=$!
sleep 1
npx jest src/lib/production/__tests__/workshop2-wave-c2-floor-mes-contract.test.ts
kill $PID 2>/dev/null || true
