"""Payment milestones, financial calendar, critical alerts, size conversion."""
from typing import List, Dict, Any, Optional
from datetime import timedelta
from app.core.datetime_util import utc_now
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import (
    User, PaymentMilestone, ProductionBatch, ProductionMilestone, TechnicalSignOff,
    SizeGridMaster,
)


class ProductionFinanceService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def generate_payment_schedule(
        self,
        batch_id: Optional[int],
        material_order_id: Optional[int],
        milestones: List[Dict[str, Any]]
    ) -> List[PaymentMilestone]:
        results = []
        for m in milestones:
            pm = PaymentMilestone(
                batch_id=batch_id,
                material_order_id=material_order_id,
                milestone_name=m["name"],
                percentage=m["percentage"],
                amount=m["amount"],
                currency=m.get("currency", "RUB"),
                due_date=m["due_date"],
                linked_production_milestone_id=m.get("production_milestone_id"),
                status="planned"
            )
            self.db.add(pm)
            results.append(pm)
        await self.db.commit()
        return results

    async def get_financial_calendar(self, organization_id: str) -> List[Dict[str, Any]]:
        stmt = (
            select(PaymentMilestone, ProductionBatch.sku_id)
            .join(ProductionBatch, PaymentMilestone.batch_id == ProductionBatch.id)
            .where(PaymentMilestone.status.in_(["planned", "invoiced"]))
            .order_by(PaymentMilestone.due_date)
        )
        res = await self.db.execute(stmt)
        calendar = []
        for pm, sku_id in res.all():
            calendar.append({
                "due_date": pm.due_date.isoformat(),
                "amount": pm.amount,
                "currency": pm.currency,
                "milestone": pm.milestone_name,
                "sku_id": sku_id,
                "status": pm.status
            })
        return calendar

    async def get_critical_alerts(self, organization_id: str) -> List[Dict[str, Any]]:
        now = utc_now()
        deadline = now + timedelta(hours=24)
        stmt = select(ProductionMilestone).where(
            ProductionMilestone.target_date <= deadline,
            ProductionMilestone.status == "pending"
        )
        milestones = (await self.db.execute(stmt)).scalars().all()
        alerts = []
        for m in milestones:
            stmt_so = select(TechnicalSignOff).filter_by(
                sku_id=m.order_id, stage=m.milestone_name, status="pending"
            )
            so = (await self.db.execute(stmt_so)).scalar_one_or_none()
            alerts.append({
                "type": "deadline_24h",
                "milestone": m.milestone_name,
                "order_id": m.order_id,
                "deadline": m.target_date.isoformat(),
                "responsible_user_id": m.responsible_user_id,
                "requires_signoff": so is not None
            })
        return alerts

    async def convert_size(
        self, source_grid_id: int, target_grid_id: int, size_label: str
    ) -> Optional[str]:
        stmt_s = select(SizeGridMaster).filter_by(id=source_grid_id)
        stmt_t = select(SizeGridMaster).filter_by(id=target_grid_id)
        src = (await self.db.execute(stmt_s)).scalar_one_or_none()
        tgt = (await self.db.execute(stmt_t)).scalar_one_or_none()
        if not src or not tgt:
            return None
        try:
            idx = src.sizes_json.index(size_label)
            return tgt.sizes_json[idx]
        except (ValueError, IndexError, TypeError):
            return None
