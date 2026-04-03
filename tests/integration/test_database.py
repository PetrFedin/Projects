import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.db.models.base import Base, Task, TaskStatus

@pytest.mark.asyncio
async def test_db_connection_and_models():
    # Use in-memory SQLite for testing
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    test_session_factory = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)
    
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with test_session_factory() as session:
        # Create a task
        new_task = Task(
            task_id="test-1",
            module="infra",
            task_type="test",
            purpose="Verify DB",
            status=TaskStatus.TODO
        )
        session.add(new_task)
        await session.commit()
        await session.refresh(new_task)
        
        assert new_task.id is not None
        assert new_task.task_id == "test-1"
        
        # Query task
        from sqlalchemy import select
        res = await session.execute(select(Task).where(Task.task_id == "test-1"))
        task_from_db = res.scalar_one()
        assert task_from_db.purpose == "Verify DB"

    await test_engine.dispose()
