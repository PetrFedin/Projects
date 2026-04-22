# Synth-1 Fashion OS — Web (Next.js)

Next.js application for the Synth-1 Fashion Intelligence / B2B OS UI. Product conventions, design system, and Cursor agent rules are in **`AGENTS.md`** (this directory).

The path `_ai-share/synth-1-full/` is the **frontend root** inside the monorepo; the **FastAPI backend** is at the **repository root** (`app/`, Poetry). See **`../../docs/RUNBOOK.md`** for both roots, CI expectations, and the **demo vs API** environment matrix.

## Quick start

```bash
cd _ai-share/synth-1-full
npm install
npm run dev
```

Default dev server: `http://localhost:3000` (see `package.json`).

## Useful commands

- `npm run lint` — Next.js ESLint
- `npm run typecheck` — TypeScript
- `npm run test` — Jest
- `npm run test:e2e` — Playwright

## Configuration

Runtime switches for calling the backend and demo behavior are documented in **`docs/RUNBOOK.md`** at repo root (from here: `../../docs/RUNBOOK.md`) and in `src/lib/syntha-api-mode.ts`.

## License

Proprietary (same as parent repository unless stated otherwise).
