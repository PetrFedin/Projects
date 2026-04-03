from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.db.models.intelligence import UnifiedAlert
from app.db.models.base import User
from app.core.datetime_util import utc_now

class AlertService:
    def __init__(self, db: AsyncSession, current_user: Optional[User] = None):
        self.db = db
        self.current_user = current_user

    async def create_alert(
        self, 
        category: str, 
        alert_type: str, 
        severity: str, 
        title: str, 
        description: str,
        organization_id: Optional[str] = None,
        context_type: Optional[str] = None,
        context_id: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> UnifiedAlert:
        org_id = organization_id or (self.current_user.organization_id if self.current_user else "PLATFORM")
        
        alert = UnifiedAlert(
            organization_id=org_id,
            category=category,
            alert_type=alert_type,
            severity=severity,
            title=title,
            description=description,
            context_type=context_type,
            context_id=context_id,
            metadata_json=metadata
        )
        self.db.add(alert)
        await self.db.commit()
        await self.db.refresh(alert)
        return alert

    async def get_active_alerts(
        self,
        category: Optional[str] = None,
        status: Optional[str] = "open",
        limit: int = 100,
    ) -> List[UnifiedAlert]:
        org_id = self.current_user.organization_id if self.current_user else "PLATFORM"
        query = select(UnifiedAlert).where(UnifiedAlert.organization_id == org_id)
        if status and status != "all":
            query = query.where(UnifiedAlert.status == status)
        if category:
            query = query.where(UnifiedAlert.category == category)
        query = query.order_by(UnifiedAlert.created_at.desc()).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def resolve_alert(self, alert_id: int):
        await self.db.execute(
            update(UnifiedAlert)
            .where(UnifiedAlert.id == alert_id)
            .values(status="resolved", resolved_at=utc_now())
        )
        await self.db.commit()

    async def check_content_expiry(self, lookbooks: List[Dict] = None, certificates: List[Dict] = None) -> List[UnifiedAlert]:
        """Content Expiry Alerts (Fashion Cloud): lookbook/certificate reminders."""
        created = []
        now = utc_now()
        for item in (lookbooks or []):
            exp = item.get("expiry_date") or item.get("expires_at")
            if exp and getattr(exp, "date", lambda: exp)() <= (now.date() if hasattr(now, "date") else now):
                a = await self.create_alert(
                    category="content",
                    alert_type="expiry",
                    severity="medium",
                    title=f"Lookbook expired: {item.get('name', 'Unknown')}",
                    description="Lookbook has expired. Update or archive.",
                    context_type="lookbook",
                    context_id=str(item.get("id", "")),
                    metadata=item
                )
                created.append(a)
        for item in (certificates or []):
            exp = item.get("expiry_date") or item.get("valid_until")
            if exp and getattr(exp, "date", lambda: exp)() <= (now.date() if hasattr(now, "date") else now):
                a = await self.create_alert(
                    category="compliance",
                    alert_type="cert_expiry",
                    severity="high",
                    title=f"Certificate expired: {item.get('name', 'Unknown')}",
                    description="Certificate has expired. Renew to maintain compliance.",
                    context_type="certificate",
                    context_id=str(item.get("id", "")),
                    metadata=item
                )
                created.append(a)
        return created
