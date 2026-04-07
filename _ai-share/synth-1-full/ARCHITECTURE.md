# Synth-1 Architecture

## Overview

Synth-1 is a **unified Fashion OS** (Next.js frontend + FastAPI backend) for design, production, B2B, retail, and client experiences. This document summarizes the current architecture and where open-source integrations apply.

## Existing Architecture

### Frontend (synth-1)

- **Framework:** Next.js 15 (App Router), React 18
- **UI:** Radix UI primitives, Tailwind CSS, shadcn-style components (`src/components/ui/`), CVA for variants, Lucide icons
- **State / Data:** React Query (TanStack Query), React Hook Form + Zod, optional Firebase
- **Tables:** TanStack React Table in `DataTablePro` (sorting, filtering, pagination, column visibility)
- **AI (frontend):** Genkit (Google AI), flows in `src/ai/flows/`, API routes under `src/app/api/ai/`
- **Backend client:** `fastapi-service.ts` — single API client for FastAPI backend (JWT, retries, mock fallbacks when offline)

### Backend (app/ — separate codebase)

- **Framework:** FastAPI, Pydantic schemas, repository pattern, service layer
- **Endpoints:** REST under `app/api/v1/endpoints/` (dashboard, profile, B2B, production, audit, etc.)
- **Auth:** JWT; frontend stores `syntha_access_token`, sends Bearer

### Cross-cutting

- **RBAC:** `src/lib/rbac.ts` — role × resource × action matrix; used for UI and (optionally) API
- **Navigation:** Role-based (Brand, Shop, Distributor, Admin, Client, etc.); data in `src/lib/data/*-navigation.ts`, `entity-links.ts`
- **Logging:** `src/lib/logger.ts` — `reportError` / `logApiError`; Sentry integrated (sends to Sentry when DSN set)

## What Should Stay Untouched

- App Router and route structure; role-based layouts and nav data
- Existing UI component set (Radix + Tailwind + CVA) and design tokens
- FastAPI service interface and mock fallback strategy
- RBAC matrix and entity-links
- Genkit AI flows and API route layout
- DataTablePro and TanStack Table usage

## What Can Be Safely Improved

- **Testing:** Unit + component tests (Jest + RTL + jsdom — integrated)
- **Observability:** Sentry wired in logger; optional structured logging
- **Forms:** Keep RHF + Zod; optionally standardize schema location and error display
- **Tables:** Keep DataTablePro; optionally extract shared column patterns from shadcn data-table ideas
- **Backend patterns:** FastAPI in `app/` can adopt more shared patterns (e.g. dependency injection, error handling) without changing frontend contract
- **AI:** Centralize prompts and model config; consider embedding pipeline (e.g. pgvector) in backend

## Open-Source Integration Decisions

See **OPEN_SOURCE_INTEGRATION.md** and **FASHION_PLATFORM_OSS.md** for:

- Research targets and evaluation matrix (UI, FastAPI, RBAC, fashion/wholesale/analytics)
- Selected vs rejected integrations
- Integrations implemented: testing foundation (RTL + next/jest), Sentry in logger
- What to evaluate next (planned vs actual pattern, FastAPI RBAC, forecasting API)
