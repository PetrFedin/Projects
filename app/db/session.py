from sqlalchemy import event
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

_engine_kw: dict = {"echo": False, "future": True}
if "sqlite" in settings.DATABASE_URL:
    _engine_kw["connect_args"] = {"timeout": 30}

# Create async engine
engine = create_async_engine(settings.DATABASE_URL, **_engine_kw)

if "sqlite" in settings.DATABASE_URL:

    @event.listens_for(engine.sync_engine, "connect")
    def _sqlite_wal_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.execute("PRAGMA cache_size=-64000")
        cursor.close()

# Create session factory
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
