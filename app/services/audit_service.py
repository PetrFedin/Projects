from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.audit import AuditRepository
from app.db.models.base import AuditTrail, User
from app.core.logging import logger
from app.core.project_health import build_project_health_report

class AuditService:
    """
    Service for managing project audit trails and health monitoring.
    """
    def __init__(self, db: AsyncSession, current_user: Optional[User] = None):
        self.db = db
        self.current_user = current_user
        self.repo = AuditRepository(db)

    async def log_action(self, entity_type: str, entity_id: str, action: str, changes: Optional[Dict] = None) -> AuditTrail:
        """
        Logs a user action in the audit trail.
        """
        user_id = self.current_user.id if self.current_user else "system"
        logger.info(f"Audit: {user_id} performed {action} on {entity_type}:{entity_id}")
        
        new_entry = AuditTrail(
            entity_type=entity_type,
            entity_id=str(entity_id),
            action=action,
            changes_json=changes,
            user_id=user_id
        )
        return await self.repo.create(new_entry)

    async def get_history(self, entity_type: str, entity_id: str) -> List[AuditTrail]:
        return await self.repo.get_by_entity(entity_type, entity_id)

    async def get_system_health(self) -> Dict[str, Any]:
        """
        Checks health of various system components.
        """
        # 1. Database connection check
        db_ok = False
        try:
            from sqlalchemy import text
            await self.db.execute(text("SELECT 1"))
            db_ok = True
        except Exception as e:
            logger.error(f"Health Check: DB failure - {str(e)}")

        project_health = build_project_health_report()

        return {
            "status": "healthy" if db_ok else "unhealthy",
            "modules": {
                "database": "online" if db_ok else "offline",
                "ai_layer": "online", # TODO: Ping LLM provider
                "storage": "online"
            },
            "project_metrics": project_health,
            "version": "v1.0.0",
            "environment": "production" # Should come from settings
        }
