"""Tech Pack versioning and SKU production snapshot."""
from typing import Dict, List, Any, Optional
from app.core.datetime_util import utc_now
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.production import TechPackRepository
from app.db.models.base import (
    User, TechPackVersion, AdvancedCosting, ProductionBatch,
)
from app.core.logging import logger


class TechPackService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.tech_pack_repo = TechPackRepository(db, current_user)

    async def create_tech_pack_version(self, sku_id: str, data: Dict[str, Any], change_log: str) -> TechPackVersion:
        """Saves a new snapshot of the Tech Pack."""
        latest = await self.tech_pack_repo.get_latest_version(sku_id)
        next_version = "1.0"
        if latest:
            try:
                major, minor = map(int, latest.version_number.split('.'))
                next_version = f"{major}.{minor + 1}"
            except ValueError:
                next_version = "1.1"

        new_v = TechPackVersion(
            sku_id=sku_id,
            version_number=next_version,
            data_json=data,
            change_log=change_log,
            created_by=str(self.current_user.id),
            created_at=utc_now(),
            is_approved=False
        )
        self.db.add(new_v)
        await self.db.commit()
        await self.db.refresh(new_v)
        return new_v

    async def compare_versions(self, sku_id: str, v1: str, v2: str) -> Dict[str, Any]:
        """Returns a diff between two tech pack versions."""
        stmt1 = select(TechPackVersion).filter_by(sku_id=sku_id, version_number=v1)
        stmt2 = select(TechPackVersion).filter_by(sku_id=sku_id, version_number=v2)
        res1 = await self.db.execute(stmt1)
        res2 = await self.db.execute(stmt2)
        tp1 = res1.scalar_one_or_none()
        tp2 = res2.scalar_one_or_none()
        return {
            "v1_data": tp1.data_json if tp1 else {},
            "v2_data": tp2.data_json if tp2 else {},
            "comparison_summary": f"Comparing version {v1} with {v2}"
        }

    async def get_sku_production_snapshot(self, sku_id: str) -> Dict[str, Any]:
        """Full 360 overview of SKU production state."""
        tp = await self.tech_pack_repo.get_latest_version(sku_id)
        stmt_cost = select(AdvancedCosting).filter_by(sku_id=sku_id)
        cost_res = await self.db.execute(stmt_cost)
        costing = cost_res.scalar_one_or_none()
        stmt_batches = select(ProductionBatch).filter_by(sku_id=sku_id)
        batch_res = await self.db.execute(stmt_batches)
        batches = batch_res.scalars().all()
        return {
            "sku_id": sku_id,
            "tech_pack": {
                "version": tp.version_number if tp else None,
                "is_approved": tp.is_approved if tp else False
            },
            "costing": {
                "landed_cost": costing.total_landed_cost if costing else 0,
                "margin": costing.projected_margin if costing else 0
            },
            "active_production": [
                {"id": b.id, "status": b.status, "planned_qty": b.planned_qty, "actual_qty": b.actual_qty}
                for b in batches
            ],
            "updated_at": utc_now().isoformat()
        }

    async def save_tech_pack_details(self, sku_id: str, grading: Optional[Dict], construction: Optional[Dict]):
        if grading or construction:
            pass  # Placeholder: update or create grading/construction
        await self.db.commit()

    async def clone_tech_pack(self, source_sku_id: str, new_sku_id: str, new_collection_id: Optional[str] = None) -> TechPackVersion:
        latest = await self.tech_pack_repo.get_latest_version(source_sku_id)
        if not latest:
            raise ValueError(f"Source Tech Pack {source_sku_id} not found.")
        new_data = latest.data_json.copy()
        if new_collection_id:
            new_data["collection_id"] = new_collection_id
        new_v = TechPackVersion(
            sku_id=new_sku_id,
            version_number="1.0",
            data_json=new_data,
            change_log=f"Cloned from {source_sku_id}",
            created_by=str(self.current_user.id),
            created_at=utc_now(),
            is_approved=False
        )
        self.db.add(new_v)
        await self.db.commit()
        await self.db.refresh(new_v)
        return new_v

    async def get_machine_recipe(self, sku_id: str) -> List[Dict[str, Any]]:
        """Returns exact machine settings for quality replication."""
        from app.db.models.base import MachineSettingRegistry
        stmt = select(MachineSettingRegistry).filter_by(sku_id=sku_id)
        res = await self.db.execute(stmt)
        settings = res.scalars().all()
        return [
            {
                "operation": s.operation_name,
                "machine": s.machine_type,
                "settings": s.settings_json,
                "thread": s.thread_spec_json
            } for s in settings
        ]

    async def get_production_pillars(self, sku_id: str) -> Dict[str, Any]:
        """Returns the full production lifecycle organized by 5 logical pillars."""
        return {
            "1_development": {
                "label": "Проектирование (Development)",
                "functions": ["Tech Pack", "BOM", "Costing", "Grading"],
                "control_points": ["Approval of Version 1.0", "Costing Margin Check"]
            },
            "2_sourcing": {
                "label": "Снабжение (Sourcing)",
                "functions": ["Material Booking", "Lab Dips", "Trims Selection"],
                "control_points": ["Lab Dip Approval", "Material Arrival at Factory"]
            },
            "3_sampling": {
                "label": "Прототипирование (Sampling)",
                "functions": ["Fitting", "PPS Sample", "Wear Test"],
                "control_points": ["PPS Approval (Start Bulk)"]
            },
            "4_execution": {
                "label": "Производство (Execution)",
                "functions": ["Cutting", "Sewing", "Operation Tracking", "Quality Control"],
                "control_points": ["Inline QC", "AQL Final Inspection"]
            },
            "5_logistics": {
                "label": "Логистика (Logistics)",
                "functions": ["Packing", "Marking", "Shipping Docs"],
                "control_points": ["Packing List Accuracy", "EAC/Marking Verification"]
            }
        }
