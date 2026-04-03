"""BOM, costing, documents and variance reporting."""
from typing import Dict, List, Any
from app.core.datetime_util import utc_now
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import (
    User, BillOfMaterials, ProductionDocument, AdvancedCosting,
    StandardMinuteValue, MaterialOrder, ProductionOperation,
)


class BOMCostingService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def create_bom(self, sku_id: str, items: List[Dict[str, Any]]) -> BillOfMaterials:
        total_cost = sum(item.get("qty", 0) * item.get("cost", 0) for item in items)
        bom = BillOfMaterials(
            sku_id=sku_id,
            items_json={"items": items},
            total_material_cost=total_cost,
            created_at=utc_now()
        )
        self.db.add(bom)
        await self.db.commit()
        await self.db.refresh(bom)
        return bom

    async def upload_document(self, sku_id: str, doc_type: str, title: str, url: str) -> ProductionDocument:
        doc = ProductionDocument(
            organization_id=self.current_user.organization_id,
            sku_id=sku_id,
            doc_type=doc_type,
            title=title,
            file_url=url,
            created_at=utc_now()
        )
        self.db.add(doc)
        await self.db.commit()
        await self.db.refresh(doc)
        return doc

    async def update_sku_costing(self, sku_id: str, data: Dict[str, Any]) -> AdvancedCosting:
        stmt = select(AdvancedCosting).filter_by(sku_id=sku_id)
        res = await self.db.execute(stmt)
        costing = res.scalar_one_or_none()
        if not costing:
            costing = AdvancedCosting(sku_id=sku_id)
            self.db.add(costing)
        for key, value in data.items():
            if hasattr(costing, key):
                setattr(costing, key, value)
        await self.db.commit()
        await self.db.refresh(costing)
        return costing

    async def calculate_raw_materials(self, sku_id: str, quantity: int) -> Dict[str, Any]:
        stmt = select(BillOfMaterials).filter_by(sku_id=sku_id).order_by(BillOfMaterials.created_at.desc())
        res = await self.db.execute(stmt)
        bom = res.scalars().first()
        if not bom:
            return {"sku_id": sku_id, "target_quantity": quantity, "requirements": [], "total_estimated_material_cost": 0}
        items = bom.items_json.get("items", [])
        requirements = []
        for item in items:
            total_qty = item.get("qty", 0) * quantity
            requirements.append({
                "item": item.get("item"),
                "total_needed": total_qty,
                "unit": item.get("unit"),
                "estimated_cost": total_qty * item.get("cost", 0)
            })
        return {
            "sku_id": sku_id,
            "target_quantity": quantity,
            "requirements": requirements,
            "total_estimated_material_cost": sum(r["estimated_cost"] for r in requirements)
        }

    async def calculate_smv_costing(self, sku_id: str) -> Dict[str, Any]:
        stmt = select(StandardMinuteValue).filter_by(sku_id=sku_id)
        result = await self.db.execute(stmt)
        operations = result.scalars().all()
        total_minutes = sum(op.minutes for op in operations)
        total_cost = sum(op.minutes * op.labor_rate_per_min for op in operations)
        return {
            "sku_id": sku_id,
            "total_smv": total_minutes,
            "total_labor_cost": total_cost,
            "operations_count": len(operations)
        }

    async def link_finance_to_sourcing(self, sku_id: str):
        stmt_bom = select(BillOfMaterials).filter_by(sku_id=sku_id).order_by(BillOfMaterials.created_at.desc())
        bom_res = await self.db.execute(stmt_bom)
        bom = bom_res.scalars().first()
        fabric_total = bom.total_material_cost if bom else 0.0
        stmt_smv = select(StandardMinuteValue).filter_by(sku_id=sku_id)
        smv_res = await self.db.execute(stmt_smv)
        labor_total = sum(op.minutes * op.labor_rate_per_min for op in smv_res.scalars().all())
        await self.update_sku_costing(sku_id, {
            "fabric_cost": fabric_total,
            "labor_cost": labor_total
        })

    async def get_production_variance_report(self, sku_id: str) -> Dict[str, Any]:
        stmt_bom = select(BillOfMaterials).filter_by(sku_id=sku_id).order_by(BillOfMaterials.created_at.desc())
        bom = (await self.db.execute(stmt_bom)).scalars().first()
        planned_material = bom.total_material_cost if bom else 0.0
        item_names = [i["item"] for i in bom.items_json.get("items", [])] if bom else []
        stmt_mat_orders = select(MaterialOrder).filter(MaterialOrder.material_name.in_(item_names)) if item_names else select(MaterialOrder).where(False)
        actual_material = sum(o.total_price for o in (await self.db.execute(stmt_mat_orders)).scalars().all())
        return {
            "sku_id": sku_id,
            "material_variance": actual_material - planned_material,
            "planned_total": planned_material,
            "actual_total": actual_material,
            "status": "over_budget" if actual_material > planned_material else "on_track"
        }
