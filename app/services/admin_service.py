from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.base import User, Organization, PlatformDispute, PlatformAnnouncement
from app.services.ai_rule_engine import AIRuleEngine
from app.core.project_health import build_project_health_report
from datetime import datetime

class AdminService:
    """
    Service for Platform Administration: Disputes, Health Hub, and Global Settings.
    Vertical link: Admin Profile hub.
    Horizontal link: Connected to AIRuleEngine for system-wide alerts.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- Platform Health ---
    async def get_platform_health(self) -> Dict[str, Any]:
        """Returns central health report and system metrics."""
        health = build_project_health_report()
        # Add some dynamic metrics
        query_orgs = select(Organization)
        result_orgs = await self.db.execute(query_orgs)
        total_orgs = len(result_orgs.scalars().all())
        
        health["active_organizations"] = total_orgs
        health["system_version"] = "v1.85.0"
        return health

    # --- Dispute Management ---
    async def create_dispute(self, requester_org_id: str, target_org_id: str, reason: str, description: str, order_id: Optional[str] = None) -> PlatformDispute:
        new_dispute = PlatformDispute(
            requester_org_id=requester_org_id,
            target_org_id=target_org_id,
            order_id=order_id,
            reason=reason,
            description=description,
            status="open"
        )
        self.db.add(new_dispute)
        await self.db.commit()
        await self.db.refresh(new_dispute)
        
        # Horizontal Integration: Notify both parties
        await self.rule_engine.trigger_event("admin.dispute_opened", {
            "module": "admin",
            "id": new_dispute.id,
            "requester": requester_org_id,
            "target": target_org_id
        })
        return new_dispute

    async def get_all_disputes(self) -> List[PlatformDispute]:
        query = select(PlatformDispute)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    # --- Global Announcements ---
    async def create_announcement(self, title: str, content: str, target_role: Optional[str] = None) -> PlatformAnnouncement:
        new_ann = PlatformAnnouncement(
            title=title,
            content=content,
            target_role=target_role,
            is_active=True
        )
        self.db.add(new_ann)
        await self.db.commit()
        await self.db.refresh(new_ann)
        
        # Horizontal Integration: Trigger system notification
        await self.rule_engine.trigger_event("admin.announcement_published", {
            "module": "admin",
            "id": new_ann.id,
            "title": title
        })
        return new_ann
