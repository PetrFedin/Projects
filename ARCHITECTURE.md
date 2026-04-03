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

## Frontend (synth-1)

1. **Unified Context**: `B2BStateProvider`, seamless data flow.
2. **Repository Pattern**: Data abstraction via `/lib/repositories`.
3. **Layered Design**: UI (React) → State (Context/Hooks) → Business Logic (Lib/Rules) → Data (Repositories).
4. **AI**: Rule-based first, embeddings/search second, LLM for generation.

## Shared Principles

- **RBAC**: Production Matrix (роли и функции).
- **Multitenancy**: Filtering by `organization_id` at repository level.
