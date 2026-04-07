# Fashion Platform — Open-Source Research & Integration

Principal Software Architect / Fashion-Tech Product Architect / Analytics Systems Engineer.  
Domain: fashion, wholesale, buying/procurement analytics, budgeting, assortment planning, merchandising, planning/forecasting, buyer/brand/distributor workflows.

---

## 1. Current Project Inspection

### 1.1 Existing Frontend Stack (synth-1)

- **Framework:** Next.js 15 (App Router), React 18
- **UI:** Radix UI, Tailwind CSS, shadcn-style components (`src/components/ui/`), CVA, Lucide
- **State/Data:** TanStack Query, React Hook Form, Zod, optional Firebase
- **Tables:** TanStack React Table in `DataTablePro` (sort, filter, paginate, column visibility)
- **AI:** Genkit, flows in `src/ai/flows/`, API routes under `src/app/api/ai/`
- **Backend client:** `fastapi-service.ts` (JWT, retries, mock fallbacks)

### 1.2 Existing Backend Stack (app/)

- **Framework:** FastAPI, Pydantic, repository + service layer
- **Endpoints:** REST under `app/api/v1/endpoints/` (dashboard, profile, B2B, production, audit, forecasting, etc.)
- **Auth:** JWT; frontend stores `syntha_access_token`
- **Config:** `app/core/config.py` (Settings), DB (SQLite/async), optional Redis

### 1.3 Database / Model Structure

- **Frontend:** Types in `src/lib/types/` (b2b, analytics, client, etc.); no ORM in synth-1
- **Backend (app/):** Models in `app/db/models/`, repositories in `app/db/repositories/`, async session

### 1.4 Service Architecture

- **Frontend:** `fastApiService` for all API calls; React Query for caching; domain logic in components/hooks
- **Backend:** Service layer (e.g. `forecasting_service`, `retail_service`, `linesheet_service`), repos, schemas

### 1.5 AI Modules

- **Frontend:** Genkit (Gemini), flows: suggest-size, infer-product-tags, generate-stylist-reply, analyze-wardrobe, etc.; token guard and cache
- **Backend:** `app/ai/` (embeddings_search, llm_client, prompt_builder, token_guard); agents in `app/agents/`

### 1.6 Analytics / Planning Modules

- **Budget:** `BudgetControl`, `BudgetVsActual` (brand finance), `PlanningDashboard` (showroom budget vs cart), shop B2B budget page
- **Assortment:** `AssortmentPlanningGrid` (size run, wholesale/retail price, forecast sell-through), `VisualAssortmentPlanner`, `AssortmentPlm`, range-planner, BPI matrix data
- **Wholesale:** `WholesaleOrderMatrix`, `WholesaleContractManager`, `LinesheetCreator`, `LineSheetGenerator`, draft orders, B2B order status flow
- **Analytics:** `analytics-bi` page, `B2BFinancialPerformance`, `SkuAnalytics`, `ProductionExtendedAnalytics`, sell-through and margin in dialogs
- **Procurement:** Production page (rolls, haberdashery, requisition, PO, quotes, receipt, subcontract)

### 1.7 Weak Points

- Observability: errors and API failures not sent to Sentry (logger had TODO) — **addressed by this integration**
- No shared “metrics/snapshot” pattern for planned vs actual across dashboards
- Forecasting/ML in backend not yet wired to frontend planning UIs
- Some analytics still static/mock; FastAPI endpoints exist but not all consumed

### 1.8 Modules That Must Remain Untouched

- App Router, role-based layouts, nav data (`brand-navigation`, `admin-navigation-normalized`, `entity-links`)
- RBAC (`src/lib/rbac.ts`), production-permissions, b2b-workspace-matrix
- UI component set (Radix + Tailwind + CVA), DataTablePro, Genkit flows and API layout
- FastAPI service interface and mock fallback strategy
- Existing pages and routes

### Summary

- **What already exists:** Full stack above; fashion/wholesale/planning/budget/assortment UI and types; FastAPI backend with services/repos; AI (Genkit + backend AI).
- **What must stay untouched:** Listed above.
- **What can be safely improved:** Observability (Sentry in logger — done); shared KPI/snapshot patterns; wiring more FastAPI analytics to frontend; backend pytest/RBAC later.
- **What external solutions are needed:** Lightweight observability (Sentry wiring); patterns (not big frameworks) for analytics consistency, forecasting API usage, and optional Storybook later.

---

## 2. Research Categories

| Category | Focus |
|----------|--------|
| **A. UI / Design System** | Dense SaaS dashboards, tables, filters, forms, accessibility, icons; fashion B2B back-office |
| **B. FastAPI Backend** | Modular structure, service layer, schemas, DI, config, background tasks, file handling, versioning |
| **C. Role / Access / Workspaces** | RBAC, org-scoped access, buyer/brand/distributor/supplier/production visibility, approval workflows |
| **D. Fashion Domain Modeling** | Catalog, product/variant/SKU, attributes, seasons, collections, linesheets, showrooms, draft orders (JOOR/NuOrder-like) |
| **E. Wholesale Workflow** | Digital showroom, appointments, linesheets, lookbooks, draft order flow, approvals, payment terms, reorder |
| **F. Buying Analytics** | Procurement/purchasing analytics, sell-through, SKU performance, supplier analytics, planned vs actual |
| **G. Budgeting** | Budget planning, allocation by category/brand/season, control, approval, purchase execution |
| **H. Assortment Planning** | Assortment builder, option count, depth/breadth, size curves, regional/store clustering |
| **I. Forecasting / Prediction** | Demand forecasting, SKU/sell-through prediction, reorder, inventory risk; lightweight ML (sklearn/xgboost), inference service |
| **J. AI Discovery / Similarity** | Product similarity, embeddings, visual search, style graph, recommendations; pgvector/FAISS patterns |
| **K. Analytics Dashboards** | KPI dashboards, snapshot architecture, metrics layer, charting, dense operational UX |
| **L. Testing / Reliability** | API/service/UI tests, Storybook, visual regression, lint/format/type, CI, dependency safety |

---

## 3. Candidate Evaluation Matrix

| Candidate | Category | Problem | Relevance | Impl value | Maintenance risk | Priority | Decision |
|-----------|----------|---------|-----------|------------|------------------|----------|----------|
| **Sentry in logger** | L / Observability | Errors and API failures not reported | 9 | 9 | 2 | **High** | **Integrated** |
| React Testing Library + next/jest | L | Component tests | 10 | 9 | 1 | High | Already done |
| shadcn/TanStack table patterns | A | Dense tables | 6 | 5 | 2 | Low | Rejected — DataTablePro exists |
| FastAPI service/DI patterns | B | Maintainability | 7 | 6 | 2 | Medium | P1 — backend |
| RBAC middleware (FastAPI) | C | API enforcement | 7 | 6 | 3 | Medium | P1 |
| Fashion catalog patterns (JOOR/NuOrder) | D | Catalog structure | 7 | 6 | 3 | Medium | Adapt internally |
| Wholesale workflow patterns | E | Order/approval flow | 8 | 6 | 3 | Medium | Custom + patterns |
| Planned vs actual snapshot pattern | F/G/K | Analytics consistency | 8 | 7 | 2 | Medium | P1 |
| Budget allocation patterns | G | Budget governance | 7 | 6 | 2 | Medium | P1 — custom |
| Assortment/size-curve patterns | H | Planning UX | 7 | 6 | 2 | Medium | P2 |
| Lightweight ML (Prophet/LightGBM) | I | Forecasting | 8 | 7 | 4 | Low | P2 — backend |
| pgvector / embeddings | J | Discovery/recommendations | 8 | 7 | 4 | Low | P2 |
| Storybook | A/L | Visual QA | 6 | 5 | 4 | Low | Rejected — weight |
| Recharts / dashboard libs | K | Charts | 6 | 5 | 2 | Low | Recharts already present |

---

## 4. Best Open-Source / Pattern Recommendations

1. **Sentry in logger** — Use existing `@sentry/nextjs`; connect `reportError` / `logApiError` so all UI and API errors are reported when DSN is set. **Integrated.**
2. **Planned vs actual snapshot pattern** — Backend: time-bound metrics/snapshots; frontend: reuse one “planned vs actual” block across finance, showroom, B2B. Pattern only; no new framework.
3. **FastAPI service/DI and RBAC middleware** — In `app/`: consistent DI and optional RBAC middleware using current role model. Pattern + small code.
4. **Lightweight forecasting API** — Backend: expose existing or new forecasting service as REST; frontend: consume in planning/assortment. Additive.
5. **pgvector/embeddings (J)** — When AI discovery is prioritized: embedding pipeline and similarity API in backend; frontend calls for “similar products” / recommendations.

---

## 5. Rejected Options and Why

- **Full Storybook:** High setup/maintenance; Playwright and component tests suffice for now.
- **Replacing DataTablePro with another table framework:** Would duplicate; TanStack already in use.
- **Heavy workflow engine:** Wholesale/approval flows stay custom; adopt patterns only.
- **New design system or theme framework:** Radix + Tailwind + CVA is the standard.
- **Monolithic analytics framework:** Prefer small snapshot/KPI pattern and Recharts; no full BI replacement.
- **Large ML platform:** Forecasting and recommendations via small services (sklearn/xgboost, pgvector), not a generic ML platform.

---

## 6. Fashion Platform Integration Map

| Integration | Where it fits | Improves | Enables | Role | Business impact |
|-------------|---------------|----------|---------|------|------------------|
| **Sentry in logger** | All pages, error boundary, fastapi-service | Error visibility, API failure tracking | Alerts, release health | All / DevOps | Fewer lost errors, faster debugging |
| Planned vs actual pattern | analytics, budgets, showroom, B2B | Consistency of “plan vs fact” blocks | Shared KPI components | Brand, Buyer, Admin | Clearer decisions |
| FastAPI DI + RBAC | app/api, app/core | Maintainability, security | Scaled backend | Backend / Admin | Safer, scalable API |
| Forecasting API | planning, assortment, analytics | Data-driven plans | Forecast in UI | Brand, Buyer | Better assortment and reorder |
| pgvector/embeddings | AI discovery, recommendations | Similar products, style discovery | Discovery features | Client, Buyer, Brand | More engagement and cross-sell |

---

## 7. P0 / P1 / P2 Priorities

- **P0 (must do now):**  
  - **Sentry in logger** — Done.  
  - UI/code quality and testing foundation — Already done (RTL + next/jest).

- **P1 (very valuable next):**  
  - Planned vs actual snapshot pattern (analytics/budgets).  
  - FastAPI RBAC middleware and DI patterns in `app/`.  
  - Wire existing FastAPI analytics/forecasting endpoints to frontend where missing.

- **P2 (later / strategic):**  
  - Assortment/size-curve and regional logic.  
  - Lightweight ML forecasting service (demand/SKU).  
  - pgvector/embeddings for discovery and recommendations.  
  - Optional Storybook for critical UI.

---

## 8. Chosen First Integration (This Round)

**Sentry in logger** — Connect `reportError` and `logApiError` in `src/lib/logger.ts` to Sentry so that:

- All errors reported via `reportError` (e.g. error boundary, error.tsx) are sent to Sentry when DSN is set.
- All API errors logged via `logApiError` (e.g. from fastapi-service) are sent with endpoint and status.

Chosen because: P0 observability; dependency already present; no change to architecture or routes; improves reliability and debugging for fashion/wholesale/planning flows.

---

## 9. Safe Implementation Plan

- **Additive:** Only logger changed; all call sites (error-boundary, error.tsx, fastapi-service) unchanged.
- **Safe:** Dynamic import of `@sentry/nextjs`; if Sentry is not configured or fails to load, logger still works (console in dev, no throw).
- **Minimal:** One small helper `sendToSentry`, and call from `reportError`.
- **Tested:** New unit tests ensure `reportError` and `logApiError` never throw.
- **Documented:** This file, ARCHITECTURE, TASK_QUEUE, OPEN_SOURCE_INTEGRATION.

---

## 10. Files Created

- `src/lib/__tests__/logger.test.ts` — Unit tests for reportError and logApiError.
- `FASHION_PLATFORM_OSS.md` — This document.

---

## 11. Files Minimally Updated

- `src/lib/logger.ts` — Added `sendToSentry`, wired into `reportError`; no change to public API or call sites.

---

## 12. Tests Added

- Four tests in `src/lib/__tests__/logger.test.ts`: reportError (Error, string, with context), logApiError; all assert no throw. Total tests: 45 (41 + 4).

---

## 13. What Is Now Improved

- **Observability:** When `NEXT_PUBLIC_SENTRY_DSN` (or Sentry init) is set, every `reportError` and `logApiError` is sent to Sentry with context (endpoint, status, etc.).
- **Reliability:** Error boundary and API failures are visible in Sentry without changing any page or route.
- **Fashion/wholesale impact:** Failures in B2B orders, budget, planning, and showroom flows are now traceable in production.

---

## 14. What Should Be Integrated Next

**Next recommended:** **Planned vs actual snapshot pattern** — Define a small backend contract (e.g. snapshot by scope and period) and a reusable frontend block for “planned vs actual” used in brand finance, showroom planning, and B2B analytics. No new framework; improves consistency of budgeting and buying analytics.

After that: FastAPI RBAC middleware and DI in `app/`, then wiring of forecasting/analytics endpoints to frontend, then pgvector/embeddings when AI discovery is prioritized.

Do not implement the next integration automatically; re-evaluate when starting the next sprint.

---

## Planning & Procurement Analytics Layer (Backend)

**Data model (Phase 1 — done):** В репозитории `app/` добавлен слой аналитики в стиле data warehouse: dimension tables (dim_products, dim_skus, dim_brands, dim_categories, dim_collections, dim_seasons, dim_stores, dim_regions, dim_suppliers, dim_buyers), fact tables (fact_sales, fact_orders, fact_inventory, fact_purchases, fact_returns), snapshot tables (snapshot_sellthrough, snapshot_inventory, snapshot_budget, snapshot_assortment, snapshot_category_performance, snapshot_brand_performance). Описание и план фаз: **app/docs/ANALYTICS_DATA_MODEL.md**. Миграция: `python3 -m app.db.migrations.create_analytics_tables`. Связи: в entity-links добавлена ссылка «Analytics (Planning & Procurement)» → /brand/analytics-bi; дашборды (analytics-bi, finance, planning) в будущем питаются из API, построенного на этой модели.
