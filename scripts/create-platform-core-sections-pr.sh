#!/usr/bin/env bash
# Два атомарных PR (docs + code) — предпочитай отдельные скрипты:
#   bash scripts/create-platform-core-sections-docs-pr.sh
#   bash scripts/create-platform-core-readiness-split-pr.sh
# Этот файл — legacy wrapper: docs, затем code (две ветки, два PR).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
bash "$ROOT/scripts/create-platform-core-sections-docs-pr.sh"
bash "$ROOT/scripts/create-platform-core-readiness-split-pr.sh"
