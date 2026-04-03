"""Suppliers, material orders, RFQ, offers, contracts, scorecards."""
from typing import List, Dict, Any, Optional
from app.core.datetime_util import utc_now
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import (
    User, Supplier, MaterialOrder, SupplierRFQ, SupplierRFQItem,
    SupplierOffer, SupplierContract, SupplierScorecard,
    ProductionMilestone, ProductionBatch, DefectReport, ComplianceCertificate,
)


class SourcingRFQService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def get_suppliers(self) -> List[Supplier]:
        stmt = select(Supplier).filter_by(is_active=True)
        res = await self.db.execute(stmt)
        return res.scalars().all()

    async def create_material_order(self, data: Dict[str, Any]) -> MaterialOrder:
        order = MaterialOrder(**data, created_at=utc_now())
        self.db.add(order)
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def create_rfq(self, data: Dict[str, Any], items: List[Dict[str, Any]]) -> SupplierRFQ:
        rfq = SupplierRFQ(
            organization_id=self.current_user.organization_id,
            title=data["title"],
            deadline=data["deadline"],
            notes=data.get("notes"),
            status="open"
        )
        self.db.add(rfq)
        await self.db.flush()
        for item_data in items:
            item = SupplierRFQItem(
                rfq_id=rfq.id,
                material_name=item_data["material_name"],
                specification_json=item_data.get("specification", {}),
                target_quantity=item_data["quantity"],
                target_unit=item_data["unit"],
                target_price=item_data.get("target_price")
            )
            self.db.add(item)
        await self.db.commit()
        await self.db.refresh(rfq)
        return rfq

    async def submit_supplier_offer(self, data: Dict[str, Any]) -> SupplierOffer:
        offer = SupplierOffer(**data, status="submitted", created_at=utc_now())
        self.db.add(offer)
        await self.db.commit()
        await self.db.refresh(offer)
        return offer

    async def track_contract_usage(self, contract_id: int, new_order_volume: float):
        stmt = select(SupplierContract).filter_by(id=contract_id)
        res = await self.db.execute(stmt)
        contract = res.scalar_one_or_none()
        if not contract:
            raise ValueError("Contract not found")
        contract.volume_ordered += new_order_volume
        usage_percent = (contract.volume_ordered / contract.total_volume_committed) * 100
        is_warning = usage_percent >= contract.warning_threshold_percent
        await self.db.commit()
        return {
            "contract_number": contract.contract_number,
            "usage_percent": usage_percent,
            "volume_remaining": contract.total_volume_committed - contract.volume_ordered,
            "status": "warning" if is_warning else "healthy"
        }

    async def get_supplier_scorecard(self, supplier_id: int) -> Optional[SupplierScorecard]:
        stmt = select(SupplierScorecard).filter_by(supplier_id=supplier_id).order_by(SupplierScorecard.updated_at.desc())
        res = await self.db.execute(stmt)
        return res.scalar_one_or_none()

    async def calculate_supplier_scorecard(
        self, supplier_id: int, start_date: datetime, end_date: datetime
    ) -> SupplierScorecard:
        stmt_batches = select(ProductionBatch.id, ProductionBatch.order_id).filter_by(factory_id=str(supplier_id))
        res_batches = await self.db.execute(stmt_batches)
        batches = res_batches.all()
        batch_ids = [b.id for b in batches]
        order_ids = [b.order_id for b in batches]
        avg_delay = 0.0
        if order_ids:
            stmt_ms = select(ProductionMilestone).filter(ProductionMilestone.order_id.in_(order_ids))
            ms_res = await self.db.execute(stmt_ms)
            milestones = ms_res.scalars().all()
            delays = [max(0, (m.actual_date - m.target_date).days) for m in milestones if m.actual_date and m.target_date]
            if delays:
                avg_delay = sum(delays) / len(delays)
        defect_rate = 0.0
        total_delivered = 0
        total_defects = 0
        if batch_ids:
            stmt_defects = select(DefectReport).filter(DefectReport.batch_id.in_(batch_ids))
            def_res = await self.db.execute(stmt_defects)
            reports = def_res.scalars().all()
            stmt_batch_qty = select(ProductionBatch).filter(ProductionBatch.id.in_(batch_ids))
            qty_res = await self.db.execute(stmt_batch_qty)
            active_batches = qty_res.scalars().all()
            total_delivered = sum(b.actual_qty for b in active_batches)
            total_defects = sum(r.total_rejected_qty for r in reports)
            if total_delivered > 0:
                defect_rate = (total_defects / total_delivered) * 100
        stmt_certs = select(ComplianceCertificate).filter_by(supplier_id=supplier_id)
        certs = (await self.db.execute(stmt_certs)).scalars().all()
        active_certs = [c for c in certs if c.status == "active" and c.valid_until > utc_now()]
        compliance_score = (len(active_certs) / len(certs) * 100) if certs else 100.0
        overall = (100 - (avg_delay * 5)) * 0.4 + (100 - (defect_rate * 10)) * 0.4 + compliance_score * 0.2
        scorecard = SupplierScorecard(
            supplier_id=supplier_id,
            period_start=start_date,
            period_end=end_date,
            avg_delay_days=avg_delay,
            defect_rate_percent=defect_rate,
            compliance_score=compliance_score,
            overall_score=min(max(overall, 0), 100),
            total_orders_analyzed=len(batch_ids),
            total_items_delivered=total_delivered,
            total_defects_found=total_defects
        )
        self.db.add(scorecard)
        await self.db.execute(
            update(Supplier).where(Supplier.id == supplier_id).values(
                rating=scorecard.overall_score,
                reliability_score=100 - (avg_delay * 10)
            )
        )
        await self.db.commit()
        await self.db.refresh(scorecard)
        return scorecard
