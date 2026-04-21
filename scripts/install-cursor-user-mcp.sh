#!/usr/bin/env bash
# Совместимость: раньше только user mcp; теперь полная синхронизация репо + ~/.cursor.
# См. scripts/cursor-mcp-sync.py
#
# Переменные (опционально): TAVILY_API_KEY, DD_API_KEY, DD_APPLICATION_KEY, DD_MCP_DOMAIN
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
export REPO_ROOT="${REPO_ROOT:-$ROOT}"
exec python3 "$ROOT/scripts/cursor-mcp-sync.py"
