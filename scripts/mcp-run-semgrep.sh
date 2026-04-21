#!/usr/bin/env bash
# Запуск MCP Semgrep без захардкоженного PATH в .cursor/mcp.json.
# Добавляет типичные каталоги pip --user (Linux/macOS), затем npx mcp-server-semgrep.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
for d in \
  "${HOME}/Library/Python/3.14/bin" \
  "${HOME}/Library/Python/3.13/bin" \
  "${HOME}/Library/Python/3.12/bin" \
  "${HOME}/.local/bin"; do
  if [[ -d "$d" && ":${PATH:-}:" != *":$d:"* ]]; then
    PATH="$d:$PATH"
  fi
done
export PATH
exec npx -y mcp-server-semgrep "$@"
