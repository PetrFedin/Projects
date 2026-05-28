#!/usr/bin/env bash
# Быстрая проверка: GSD paths, gsd-sdk, agent-browser, субмодули, MCP npx.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$ROOT"
export PATH="/Applications/Cursor.app/Contents/Resources/app/resources/bin:${PATH}"

echo "==> 1. GSD portable paths"
bash "$ROOT/scripts/check-gsd-cursor-paths.sh"

echo ""
echo "==> 2. gsd-sdk"
if command -v gsd-sdk >/dev/null 2>&1; then
  gsd-sdk --help 2>&1 | head -4
else
  echo "MISSING: add Cursor bin to PATH (see ~/.zshrc)"
  exit 1
fi

echo ""
echo "==> 3. agent-browser"
agent-browser --version 2>&1 || true

echo ""
echo "==> 4. Superpowers (tools/superpowers)"
if [[ -f "$ROOT/tools/superpowers/.cursor-plugin/plugin.json" ]]; then
  node -p "require('$ROOT/tools/superpowers/.cursor-plugin/plugin.json').version" 2>/dev/null || cat "$ROOT/tools/superpowers/.cursor-plugin/plugin.json" | head -3
else
  echo "WARN: no tools/superpowers/.cursor-plugin"
fi

echo ""
echo "==> 5. MCP packages"
printf "  %s: " "@modelcontextprotocol/server-filesystem"
npm view "@modelcontextprotocol/server-filesystem" version 2>/dev/null || echo "?"
printf "  %s: " "agent-browser-mcp"
npm view agent-browser-mcp version 2>/dev/null || echo "?"
echo "  mcp-server-git / mcp-server-fetch (pip):"
pip3 show mcp-server-git mcp-server-fetch 2>/dev/null | grep -E '^Name:|^Version:' || echo "  (pip missing)"

echo ""
echo "==> 6. Project .cursor/mcp.json — без machine-local PATH (Semgrep)"
if grep -qE '"/Users/|"/home/|"env".*"PATH".*Users' "$ROOT/.cursor/mcp.json" 2>/dev/null; then
  echo "ERROR: machine-specific paths in $ROOT/.cursor/mcp.json"
  exit 1
fi
if ! grep -q 'mcp-run-semgrep.sh' "$ROOT/.cursor/mcp.json" 2>/dev/null; then
  echo "WARN: expected semgrep wrapper in .cursor/mcp.json"
fi
if [[ ! -x "$ROOT/scripts/mcp-run-semgrep.sh" ]]; then
  echo "WARN: scripts/mcp-run-semgrep.sh not executable"
fi

echo ""
echo "==> 7. User MCP config"
if [[ -f "$HOME/.cursor/mcp.json" ]]; then
  python3 -c "import json; d=json.load(open('$HOME/.cursor/mcp.json')); print('servers:', list(d.get('mcpServers',{}).keys()))" 2>/dev/null || grep -o '"filesystem"\|"git"\|"fetch"\|"agent-browser"' "$HOME/.cursor/mcp.json" | sort -u
else
  echo "WARN: no ~/.cursor/mcp.json"
fi

echo ""
echo "OK — toolkit checks finished."
