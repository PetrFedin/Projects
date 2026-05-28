# ARCHITECTURE.md — Synth-1 Fashion OS

## Backend (FastAPI)

1. **API Layer** (`app/api/`, `app/api/v1/endpoints/`): REST endpoints, Pydantic schemas, Depends() DI.
2. **Service Layer** (`app/services/`): Business logic, Rule Engine, showroom, wholesale, order, production.
3. **Repository Pattern** (`app/db/repositories/`): Data access, tenant filter by `organization_id`, BaseRepository.
4. **Models** (`app/db/models/`): SQLAlchemy 2.0 async, Mapped columns, JSON fields.
5. **AI** (`app/ai/`, `app/agents/`):
   - **LLM**: `llm_client`, `llm_router`, `prompt_builder`, cache, token guard.
   - **Embeddings**: CLIP+FAISS (`clip_backend`), `EmbeddingsSearch`, `VectorSearchService`, `VisualSimilarityService`.
   - **Agents**: Orchestrator, Code, Bugfix, Docs, Review, Content, Risk, etc.
   - **Feedback Loop**: `FeedbackStore`, `AgentFeedback` — RAG over successful changes.
6. **Security**: RBAC via `UserRole`, `check_permissions`, JWT auth, rate limits (auth, AI task).
7. **Standardized Response**: `GenericResponse[T]`, `SynthBaseException`, Request ID middleware.
8. **Integrations** (`app/integrations/`): Marketplace connectors (Shopify, Ozon, WB), C1C, CRPT.

## Frontend (канон: `_ai-share/synth-1-full`)

Next.js 15 App Router, слои UI → hooks/lib → API routes / BFF. Политика путей: **`docs/MIGRATION_FULL_CUTOVER.md`**, **`_ai-share/synth-1-full/SOURCE_OF_TRUTH.md`**. Корневой каталог **`synth-1/`** в монорепо не используется; фрагменты в корневом **`src/`** (TS без приложения) — legacy, не источник правды.

## Shared Principles

- **RBAC**: Production Matrix (роли и функции).
- **Multitenancy**: Filtering by `organization_id` at repository level.
