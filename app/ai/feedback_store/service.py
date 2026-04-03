"""FeedbackStore: save outcomes, retrieve similar successful examples for RAG."""
from datetime import datetime, timedelta
from typing import Any, Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.base import AgentFeedback, User
from app.db.repositories.intelligence import AgentFeedbackRepository


class FeedbackStore:
    """Store and retrieve agent feedback for RAG context."""

    def __init__(self, db: AsyncSession, current_user: Optional[User] = None):
        self.repo = AgentFeedbackRepository(db, current_user)
        self.db = db

    async def save(
        self,
        task: str,
        task_type: str,
        success: bool,
        code_changes: Optional[str] = None,
        test_passed: Optional[bool] = None,
        lint_passed: Optional[bool] = None,
        metadata: Optional[dict] = None,
    ) -> AgentFeedback:
        """Record agent change outcome."""
        org_id = self.repo.current_user.organization_id if self.repo.current_user else None
        fb = AgentFeedback(
            organization_id=org_id,
            task=task[:2000],
            task_type=task_type,
            code_changes=code_changes[:8000] if code_changes else None,
            success=success,
            test_passed=test_passed,
            lint_passed=lint_passed,
            metadata_json=metadata,
        )
        return await self.repo.create(fb)

    async def get_similar_successful(
        self, task_type: str, task: str, limit: int = 5, min_confidence: float = 0
    ) -> list[dict[str, Any]]:
        """Return successful examples for prompt injection."""
        rows = await self.repo.get_similar_successful(task_type, task, limit=limit)
        return [
            {"task": r.task, "code_changes": r.code_changes, "created_at": str(r.created_at)}
            for r in rows
        ]

    async def get_stats(self, task_type: str | None = None) -> dict[str, Any]:
        """Aggregate feedback stats. task_type: filter by type (CODE_ITERATION, BUGFIX_ITERATION, etc)."""
        def _filter(q):
            if self.repo.current_user and self.repo.current_user.role != "platform_admin":
                q = q.where(
                    (AgentFeedback.organization_id == self.repo.current_user.organization_id)
                    | (AgentFeedback.organization_id.is_(None))
                )
            if task_type:
                q = q.where(AgentFeedback.task_type == task_type)
            return q
        total = (await self.db.execute(_filter(select(func.count(AgentFeedback.id))))).scalar() or 0
        success_q = _filter(select(func.count(AgentFeedback.id)).where(AgentFeedback.success == True))
        success_count = (await self.db.execute(success_q)).scalar() or 0
        out = {
            "total": total,
            "success_count": success_count,
            "fail_count": total - success_count,
            "success_rate": round(success_count / total, 2) if total else 0,
        }
        if task_type:
            out["task_type"] = task_type
        return out

    async def get_recent(
        self, task_type: Optional[str] = None, limit: int = 20, success_only: bool = False
    ) -> list[dict[str, Any]]:
        """List recent feedback entries."""
        q = select(AgentFeedback).order_by(AgentFeedback.created_at.desc()).limit(limit)
        if task_type:
            q = q.where(AgentFeedback.task_type == task_type)
        if success_only:
            q = q.where(AgentFeedback.success == True)
        if self.repo.current_user and self.repo.current_user.role != "platform_admin":
            q = q.where(
                (AgentFeedback.organization_id == self.repo.current_user.organization_id)
                | (AgentFeedback.organization_id.is_(None))
            )
        rows = (await self.db.execute(q)).scalars().all()
        return [
            {
                "id": r.id,
                "task": r.task[:100],
                "task_type": r.task_type,
                "success": r.success,
                "created_at": str(r.created_at),
            }
            for r in rows
        ]
