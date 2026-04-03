import os
os.environ["ENVIRONMENT"] = "test"  # bypass auth rate limit, relax prod checks

import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.pool import StaticPool
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.main import app
from app.api import deps
from app.db.models.base import Base
# Explicitly import all models to ensure they are registered with Base.metadata
import app.db.models.base as models 

# Test DB in memory - using StaticPool to share connection across all sessions from same engine
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

# Use override for app dependency
app.dependency_overrides[deps.get_db] = override_get_db
# get_current_user: no override — uses JWT decode, so login role is respected (buyer, brand_admin, etc.)

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function", autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture(scope="function")
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture(scope="function")
async def db():
    async with TestingSessionLocal() as session:
        yield session

@pytest.fixture(scope="function")
async def brand_token_headers(client):
    """Login as brand_admin and return auth headers."""
    resp = await client.post("/api/v1/auth/login/access-token", data={
        "username": "brand@synth1.com",
        "password": "brand_password",
    })
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def brand_user_token():
    return "test-brand-token"
