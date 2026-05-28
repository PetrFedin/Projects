#!/usr/bin/env python3
"""
Генерирует конфиг MCP для монорепо Projects.

Пишет:
  - <repo>/.cursor/mcp.json   (аргументы с ${workspaceFolder} для Cursor)
  - ~/.cursor/mcp.json        (абсолютный REPO_ROOT)

Semgrep: без machine-local PATH в JSON — см. scripts/mcp-run-semgrep.sh (pip --user semgrep).

Опционально (переменные окружения):
  TAVILY_API_KEY     — сервер deep-research (@pinkpixel/deep-research-mcp)
  DD_API_KEY         — вместе с DD_APPLICATION_KEY и DD_MCP_DOMAIN — Datadog MCP
  DD_APPLICATION_KEY
  DD_MCP_DOMAIN      — например app.datadoghq.com
"""
from __future__ import annotations

import json
import os
from pathlib import Path


def build_servers(repo_abs: str, use_workspace_token: bool) -> dict:
    """use_workspace_token: True для .cursor/mcp.json в репо (подстановка ${workspaceFolder})."""
    root = "${workspaceFolder}" if use_workspace_token else repo_abs

    semgrep_args = (
        ["${workspaceFolder}/scripts/mcp-run-semgrep.sh"]
        if use_workspace_token
        else [str(Path(repo_abs) / "scripts" / "mcp-run-semgrep.sh")]
    )

    servers: dict = {
        "filesystem": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", root],
        },
        "git": {
            "command": "python3",
            "args": ["-m", "mcp_server_git", "--repository", root],
        },
        "fetch": {
            "command": "python3",
            "args": ["-m", "mcp_server_fetch"],
        },
        "agent-browser": {
            "command": "npx",
            "args": ["-y", "agent-browser-mcp"],
        },
        "exa": {"url": "https://mcp.exa.ai/mcp"},
        "figma": {"type": "http", "url": "https://mcp.figma.com/mcp"},
        "sentry": {"type": "http", "url": "https://mcp.sentry.dev/mcp"},
        "linear": {"url": "https://mcp.linear.app/mcp", "transport": "http"},
        "semgrep": {
            "command": "bash",
            "args": semgrep_args,
        },
    }

    tavily = (os.environ.get("TAVILY_API_KEY") or "").strip()
    if tavily:
        servers["deep-research"] = {
            "command": "npx",
            "args": ["-y", "@pinkpixel/deep-research-mcp"],
            "env": {"TAVILY_API_KEY": tavily},
        }

    dd_key = (os.environ.get("DD_API_KEY") or "").strip()
    dd_app = (os.environ.get("DD_APPLICATION_KEY") or "").strip()
    dd_dom = (os.environ.get("DD_MCP_DOMAIN") or "").strip()
    if dd_key and dd_app and dd_dom:
        servers["datadog"] = {
            "url": (
                f"https://{dd_dom}/api/unstable/mcp-server/mcp"
                "?referrer_ide=cursor-plugin&plugin_version=0.7.1"
                "&toolsets=core,visualizations"
            ),
            "headers": {
                "DD_API_KEY": dd_key,
                "DD_APPLICATION_KEY": dd_app,
            },
        }

    return servers


def main() -> None:
    repo = os.environ.get("REPO_ROOT", str(Path.home() / "Projects")).rstrip("/")
    repo_path = Path(repo).resolve()

    out_project = repo_path / ".cursor" / "mcp.json"
    out_user = Path.home() / ".cursor" / "mcp.json"

    for out, use_token in ((out_project, True), (out_user, False)):
        out.parent.mkdir(parents=True, exist_ok=True)
        data = {"mcpServers": build_servers(str(repo_path), use_workspace_token=use_token)}
        with open(out, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        print(f"Wrote {out} ({len(data['mcpServers'])} servers)")

    print("Restart Cursor or reload MCP.")


if __name__ == "__main__":
    main()
