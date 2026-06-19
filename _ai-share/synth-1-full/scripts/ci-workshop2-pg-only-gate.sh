#!/usr/bin/env bash
# Wave 32: CI PG gate — staging-up + pg-only-verify (exit 1 on fail).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Workshop2 PG staging up"
node scripts/workshop2-pg-staging-up.mjs

echo "==> Workshop2 PG-only verify"
if ! node scripts/workshop2-pg-only-verify.mjs; then
  echo "FATAL: workshop2-pg-only-verify failed — CI gate exit 1" >&2
  exit 1
fi

echo "==> PG-only CI gate passed"
