# Synth-1 Fashion OS — Backend

FastAPI backend for the Synth-1 Fashion Intelligence Platform.

This repository root is **only the Python API**. The **Next.js web app** lives in `_ai-share/synth-1-full/` (separate `package.json`, install and scripts from that directory). For onboarding, CI working directories, and an **environment matrix** (demo vs FastAPI vs production intent), read **`docs/RUNBOOK.md`**.

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
