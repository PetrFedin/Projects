# Open-Source Integration — Research & Decisions

Principal Architect / Integration Lead review. Only high-value, minimal-weight integrations are adopted.

---

## 1. Current Project Inspection (Summary)

| Area | Existing | Notes |
|------|----------|--------|
| **Architecture** | Next.js 15 App Router + FastAPI backend (separate `app/`) | Frontend in `synth-1`, API client in `fastapi-service.ts` |
| **Backend stack** | FastAPI, Pydantic, repos, services | CORS, JWT, request logging; no change to contract |
| **Frontend stack** | React 18, Next 15, React Query, RHF, Zod | Keep as-is |
| **UI / design system** | Radix, Tailwind, CVA, shadcn-style components in `src/components/ui/` | Do not replace |
| **Tables** | TanStack React Table in `DataTablePro` | Already aligned with shadcn data-table ideas |
| **Tests** | Jest (node), 2 suites (rbac, production); 1 RTL Button test not run (wrong Jest config) | Fixed by first integration |
| **AI** | Genkit, flows in `src/ai/flows/`, API routes under `src/app/api/ai/` | Keep structure |
| **Weak points** | Component tests not running; no Sentry in logger; no shared form error pattern doc | Addressed: tests + Sentry in logger |
| **Do not replace** | RBAC, entity-links, nav data, Genkit, FastAPI client, DataTablePro, existing pages/routes | — |

---

## 2. Open-Source Search Targets

- **A. Frontend / UI:** shadcn data-table patterns (we already use TanStack), form patterns (RHF+Zod in place), dashboard layouts (existing).
- **B. Backend / FastAPI:** Modular structure, RBAC middleware, service layer, config — in `app/`, not in this repo.
- **C. Testing / Quality:** Jest + React Testing Library + jsdom, Playwright (already present), lint/format/type-check.
- **D. AI / Search:** pgvector/FAISS patterns, embedding pipelines — backend and future.
- **E. Domain:** Wholesale workflows, approval flows, discovery — adapt internally, no big external frameworks.

---

## 3. Candidate Evaluation Matrix

| Candidate | Problem | Relevance | Complexity | Maintenance risk | Priority | Decision |
|-----------|---------|-----------|------------|-------------------|----------|----------|
| **React Testing Library + jsdom** | Component tests not running; no DOM tests | 10 | 2 | 1 | **High** | **Integrated** |
| next/jest | Correct Next.js env for Jest (aliases, CSS) | 10 | 2 | 1 | High | Integrated |
| shadcn data-table | Richer table patterns | 5 | 3 | 2 | Low | Rejected — DataTablePro already covers needs |
| Storybook | Component docs/visual tests | 6 | 6 | 4 | Medium | Rejected — weight vs current team size |
| Sentry in logger | Observability | 8 | 2 | 2 | Medium | **Integrated** |
| pytest + FastAPI TestClient | Backend tests | 8 | 3 | 2 | Medium | Deferred — backend in `app/` |
| RBAC middleware (FastAPI) | Enforce roles on API | 7 | 4 | 3 | Medium | Deferred — backend |
| pgvector / embeddings | Vector search, recommendations | 8 | 7 | 4 | Low | Deferred — AI/search phase |
| Husky + lint-staged | Pre-commit quality | 6 | 2 | 2 | Low | Optional later |

---

## 4. Selected High-Value Integrations (Planned)

1. **Testing foundation (RTL + jsdom + next/jest)** — **DONE** (see below).
2. **Sentry in logger** — **DONE.** `reportError` / `logApiError` send to Sentry when DSN set (dynamic import).
3. **Backend pytest + TestClient** — In `app/`; add a small pattern and one endpoint test.
4. **RBAC enforcement on FastAPI** — Optional middleware in `app/` using existing role model.

---

## 5. Rejected Options and Why

- **Full Storybook:** Adds significant setup and maintenance; current UI is stable; E2E (Playwright) already exists.
- **New table framework:** DataTablePro + TanStack already in use; shadcn data-table is same idea; no swap.
- **Heavy form library beyond RHF+Zod:** Would duplicate and conflict with existing usage.
- **New design system or theme framework:** Radix + Tailwind + CVA is the standard; no replacement.
- **Large workflow engine:** Domain workflows (approvals, wholesale) stay custom; integrate patterns, not a product.

---

## 6. Chosen First Integration: Testing Foundation

**Choice:** React Testing Library + jest-dom + jsdom + next/jest so that component tests run and the existing Button test is the canonical example.

**Why first:**

- Priority was “code quality / design system / **testing foundation**”.
- No replacement of existing code; only enables existing Button test and future component tests.
- Low complexity, minimal new surface, high long-term value.

**What improves:**

- All Jest tests (including `Button.test.tsx`) run in a single `npm test`.
- Next.js aliases and environment handled by next/jest.
- Clear pattern for new component tests under `**/__tests__/**/*.test.tsx`.

---

## 7. Safe Implementation (What Was Done)

- **Preserved:** All existing tests, `src/` layout, UI components, FastAPI client, RBAC, nav.
- **Added:**  
  - DevDependencies: `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`.  
  - `jest.setup.ts` with `import '@testing-library/jest-dom'`.  
  - `jest.config.js` switched to `next/jest` with `testEnvironment: 'jsdom'`, `setupFilesAfterEnv`, and `testMatch` extended to `*.test.tsx`.
- **No removals:** Old node-based tests still pass; Button test now runs.

---

## 8. Files Created

- `jest.setup.ts` — Jest setup; imports `@testing-library/jest-dom`.

---

## 9. Files Minimally Updated

- `jest.config.js` — Uses `next/jest`, `jsdom`, `setupFilesAfterEnv`, and `testMatch` including `*.test.tsx`.
- `package.json` — New devDependencies (via `npm install -D ...`).

---

## 10. Tests Added

- None added; **existing** `src/components/ui/__tests__/Button.test.tsx` is now included and passing (41 tests total: 39 existing + 2 Button tests).

---

## 11. What Is Now Improved

- **Single command:** `npm test` runs unit and component tests.
- **Canonical pattern:** New UI component tests can follow `Button.test.tsx` under any `__tests__/` with `*.test.tsx`.
- **Next.js compatibility:** next/jest handles `@/` and Next internals for tests.
- **Stability:** Regression coverage for UI components without replacing any production code.

---

## 12. What Open-Source Integration Should Be Next

**Next recommended:** **Planned vs actual snapshot pattern** — Shared backend contract and frontend block for “plan vs fact” in analytics and budgets (see FASHION_PLATFORM_OSS.md). Then: FastAPI RBAC middleware, then forecasting/embeddings as needed.

Do not implement the next integration automatically; re-evaluate when starting the next sprint.

Do not implement the next integration automatically; re-evaluate when starting the next sprint.
