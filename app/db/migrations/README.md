# Database migrations

- **Phase 1 (analytics):** Run `python -m app.db.migrations.create_analytics_tables` to create only the analytics layer tables (prefix `analytics_`). Does not modify existing tables.
- **Agent feedback:** Run `python -m app.db.migrations.create_agent_feedback_table` to create `agent_feedback` for the RAG feedback loop.
- For full schema create (e.g. new env), use SQLAlchemy `Base.metadata.create_all(engine)` as in the main app.
