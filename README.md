# Synth-1 Fashion OS — Backend

FastAPI backend for the Synth-1 Fashion Intelligence Platform.

**Фронтенд (Next.js):** единственный код в монорепо — **`_ai-share/synth-1-full`**. Субмодуль **`synth-1/`** удалён; порядок работ и субмодули — **`docs/MIGRATION_FULL_CUTOVER.md`**, **`docs/SUBMODULES.md`**.

**Cursor (агенты / MCP):** контракт агента — **`AGENTS.md`**, правило **`/.cursor/rules/gsd-superpowers-mcp-monorepo.mdc`**, детали — **`docs/CURSOR_AGENT_TOOLKIT.md`**, MCP — **`.cursor/mcp.json`**. Исходники Superpowers: **`tools/superpowers`** ([obra/superpowers](https://github.com/obra/superpowers.git)). После clone: **`bash scripts/bootstrap-monorepo-dev.sh`** (внутри вызывается **`scripts/normalize-gsd-cursor-paths.sh`**). После отдельного **`npx get-shit-done-cc@latest --local --cursor`** при необходимости снова: **`bash scripts/normalize-gsd-cursor-paths.sh`**.

## Quick start

```bash
# Install
poetry install

# Run
uvicorn app.main:app --reload

# API docs
open http://localhost:8000/docs
```

## Structure

- `app/api/` — REST endpoints
- `app/services/` — Business logic
- `app/ai/` — LLM, embeddings, AI services
- `app/agents/` — AI agents (orchestrator, report agents)
- `app/db/` — Models, repositories, migrations

## Key commands

```bash
# Run all agents (reports + smoke)
python scripts/run_all_agents.py

# Report agents only
python -m app.agents.agent_runner

# Tests
pytest tests/
```

## Environment

Copy `.env.example` to `.env`. Required: `SECRET_KEY`, `DATABASE_URL`.

## License

Proprietary.
