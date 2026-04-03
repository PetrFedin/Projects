"""
Create agent_feedback table for feedback loop.
Run: python -m app.db.migrations.create_agent_feedback_table
"""
import asyncio
from app.db.session import engine
from app.db.models.intelligence import AgentFeedback


async def create_agent_feedback_table():
    async with engine.begin() as conn:
        await conn.run_sync(lambda c, t=AgentFeedback.__table__: t.create(c, checkfirst=True))
        print("Created table: agent_feedback")


def run():
    asyncio.run(create_agent_feedback_table())
    print("Agent feedback table created.")


if __name__ == "__main__":
    run()
