"""Production execution: batches, stages, inventory, QC, milestones, archive."""
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from app.core.datetime_util import utc_now
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.production import TechPackRepository
from app.db.models.base import (
    User, TechPackVersion, ProductionMilestone, ProductionBatch, SampleOrder,
    FabricRoll, TollMaterialBalance, ProductionOperation,
    TechnicalSignOff, ProductionStage, ProductionStageTemplate, QCInspectionDetailed,
    MaterialMaster, MaterialLot, FinishedGoodsStock, StockAllocation,
    MaterialConsumptionTrace, ProductionMaterialPlanning, GradingChart,
)
from app.db.models.product import SKUProductionArchive, SKUSalesSync
from app.core.logging import logger


class ProductionExecutionService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.tech_pack_repo = TechPackRepository(db, current_user)

    async def get_bulk_workflow(self, order_id: str) -> Dict[str, Any]:
        stmt_milestones = select(ProductionMilestone).filter_by(order_id=order_id).order_by(ProductionMilestone.target_date)
        res_m = await self.db.execute(stmt_milestones)
        milestones = res_m.scalars().all()
        return {
            "order_id": order_id,
            "milestones": [
                {"name": m.milestone_name, "date": m.target_date.isoformat(), "status": m.status}
                for m in milestones
            ],
            "gantt": {
                "stages": [
                    {"name": "Fabric Sourcing", "start": "2026-03-01", "end": "2026-03-15", "progress": 100},
                    {"name": "Cutting", "start": "2026-03-16", "end": "2026-03-20", "progress": 50},
                    {"name": "Sewing", "start": "2026-03-21", "end": "2026-04-10", "progress": 0}
                ]
            }
        }

    async def order_sample(self, sku_id: str, factory_id: str, sample_type: str) -> SampleOrder:
        sample = SampleOrder(
            sku_id=sku_id,
            factory_id=factory_id,
            sample_type=sample_type,
            status="ordered",
            created_at=utc_now()
        )
        self.db.add(sample)
        await self.db.commit()
        await self.db.refresh(sample)
        return sample

    async def register_fabric_roll(
        self, material_id: str, roll_number: str, length: float, width: float, factory_id: str
    ) -> FabricRoll:
        new_roll = FabricRoll(
            material_id=material_id,
            roll_number=roll_number,
            initial_length_m=length,
            current_length_m=length,
            width_cm=width,
            factory_id=factory_id
        )
        self.db.add(new_roll)
        await self.db.commit()
        await self.db.refresh(new_roll)
        return new_roll

    async def update_toll_material_balance(
        self, factory_id: str, material_id: str, quantity: float, action: str = "add"
    ) -> TollMaterialBalance:
        stmt = select(TollMaterialBalance).filter_by(factory_id=factory_id, material_id=material_id)
        result = await self.db.execute(stmt)
        balance = result.scalar_one_or_none()
        if not balance:
            balance = TollMaterialBalance(
                factory_id=factory_id,
                material_id=material_id,
                quantity_on_hand=0.0
            )
            self.db.add(balance)
        if action == "add":
            balance.quantity_on_hand += quantity
        elif action == "subtract":
            balance.quantity_on_hand -= quantity
        await self.db.commit()
        await self.db.refresh(balance)
        return balance

    async def record_operation_progress(
        self, batch_id: int, operation: str, units: int, defects: int = 0, operator_id: str = None
    ) -> ProductionOperation:
        stmt = select(ProductionOperation).filter_by(
            batch_id=batch_id, operation_name=operation, status="in_progress"
        )
        res = await self.db.execute(stmt)
        op = res.scalar_one_or_none()
        if not op:
            op = ProductionOperation(batch_id=batch_id, operation_name=operation, operator_id=operator_id)
            self.db.add(op)
        op.units_completed += units
        op.units_defective += defects
        await self.db.commit()
        await self.db.refresh(op)
        return op

    async def request_technical_signoff(
        self, sku_id: str, stage: str, artifact_url: str = None
    ) -> TechnicalSignOff:
        signoff = TechnicalSignOff(
            sku_id=sku_id,
            stage=stage,
            requested_by=str(self.current_user.id),
            artifact_url=artifact_url
        )
        self.db.add(signoff)
        await self.db.commit()
        await self.db.refresh(signoff)
        return signoff

    async def execute_signoff(self, signoff_id: int, status: str, comments: str = None):
        stmt = select(TechnicalSignOff).filter_by(id=signoff_id)
        res = await self.db.execute(stmt)
        signoff = res.scalar_one_or_none()
        if signoff:
            signoff.status = status
            signoff.comments = comments
            signoff.approved_by = str(self.current_user.id)
            signoff.signed_at = utc_now()
            await self.db.commit()

    async def create_detailed_qc(
        self, batch_id: int, type: str, defects: Dict, result: str
    ) -> QCInspectionDetailed:
        qc = QCInspectionDetailed(
            batch_id=batch_id,
            inspection_type=type,
            sample_size=10,
            defects_json=defects,
            result=result,
            inspector_id=str(self.current_user.id)
        )
        self.db.add(qc)
        await self.db.commit()
        await self.db.refresh(qc)
        return qc

    async def get_critical_path(self, order_id: str) -> List[Dict[str, Any]]:
        stmt = select(ProductionMilestone).filter_by(order_id=order_id).order_by(ProductionMilestone.target_date)
        res = await self.db.execute(stmt)
        milestones = res.scalars().all()
        path = []
        for i, m in enumerate(milestones):
            is_delayed = m.status == "delayed" or (
                m.status == "pending" and m.target_date < utc_now()
            )
            path.append({
                "milestone": m.milestone_name,
                "date": m.target_date.isoformat(),
                "status": "critical" if is_delayed else m.status,
                "dependency": milestones[i - 1].milestone_name if i > 0 else None
            })
        return path

    async def add_to_material_master(self, data: Dict[str, Any]) -> MaterialMaster:
        material = MaterialMaster(
            organization_id=self.current_user.organization_id,
            **data
        )
        self.db.add(material)
        await self.db.commit()
        await self.db.refresh(material)
        return material

    async def finish_production_to_stock(
        self, batch_id: int, color: str, size: str, qty: int, warehouse_id: str
    ):
        stmt_batch = select(ProductionBatch).filter_by(id=batch_id)
        batch_res = await self.db.execute(stmt_batch)
        batch = batch_res.scalar_one_or_none()
        if not batch:
            raise ValueError("Batch not found")
        stock = FinishedGoodsStock(
            sku_id=batch.sku_id,
            production_batch_id=batch.id,
            color=color,
            size=size,
            qty_on_hand=qty,
            warehouse_id=warehouse_id,
            season=batch.order_id
        )
        self.db.add(stock)
        batch.actual_qty += qty
        if batch.actual_qty >= batch.planned_qty:
            batch.status = "completed"
            batch.end_date = utc_now()
        await self.db.commit()
        return stock

    async def record_material_consumption(self, batch_id: int, lot_id: int, qty: float):
        stmt_lot = select(MaterialLot).filter_by(id=lot_id)
        lot_res = await self.db.execute(stmt_lot)
        lot = lot_res.scalar_one_or_none()
        if not lot or lot.quantity_current < qty:
            raise ValueError("Insufficient material in lot")
        trace = MaterialConsumptionTrace(
            batch_id=batch_id,
            lot_id=lot_id,
            qty_consumed=qty
        )
        self.db.add(trace)
        lot.quantity_current -= qty
        await self.db.commit()
        return trace

    async def allocate_stock_to_order(self, order_id: int, stock_id: int, qty: int):
        stmt_stock = select(FinishedGoodsStock).filter_by(id=stock_id)
        stock_res = await self.db.execute(stmt_stock)
        stock = stock_res.scalar_one_or_none()
        if not stock or (stock.qty_on_hand - stock.qty_allocated) < qty:
            raise ValueError("Insufficient available stock")
        allocation = StockAllocation(
            stock_id=stock_id,
            order_id=order_id,
            qty_reserved=qty
        )
        self.db.add(allocation)
        stock.qty_allocated += qty
        await self.db.commit()
        return allocation

    async def calculate_detailed_requirements(self, batch_id: int) -> List[ProductionMaterialPlanning]:
        from app.db.models.base import BillOfMaterials
        stmt_batch = select(ProductionBatch).filter_by(id=batch_id)
        batch_res = await self.db.execute(stmt_batch)
        batch = batch_res.scalar_one_or_none()
        if not batch or not batch.size_breakdown_json:
            return []
        stmt_bom = select(BillOfMaterials).filter_by(sku_id=batch.sku_id).order_by(BillOfMaterials.created_at.desc())
        bom_res = await self.db.execute(stmt_bom)
        bom = bom_res.scalars().first()
        if not bom:
            return []
        material_totals: Dict[str, Dict[str, Any]] = {}
        for gen_item in bom.items_json.get("items", []):
            m_id = gen_item["item"]
            needed = gen_item["qty"] * batch.planned_qty
            material_totals[m_id] = {"needed": needed, "unit": gen_item.get("unit", "pcs")}
        if getattr(bom, "size_consumption_json", None):
            for size, qty in batch.size_breakdown_json.items():
                size_needs = bom.size_consumption_json.get(size, {})
                for m_id, consumption_rate in size_needs.items():
                    needed = consumption_rate * qty
                    if m_id in material_totals:
                        material_totals[m_id]["needed"] += needed
                    else:
                        material_totals[m_id] = {"needed": needed, "unit": "m"}
        planning_records = []
        for m_id, data in material_totals.items():
            stmt_plan = select(ProductionMaterialPlanning).filter_by(batch_id=batch_id, material_id=m_id)
            plan_res = await self.db.execute(stmt_plan)
            plan = plan_res.scalar_one_or_none()
            if not plan:
                plan = ProductionMaterialPlanning(
                    batch_id=batch_id,
                    material_id=m_id,
                    required_qty=data["needed"],
                    unit=data["unit"]
                )
                self.db.add(plan)
            else:
                plan.required_qty = data["needed"]
            planning_records.append(plan)
        await self.db.commit()
        return planning_records

    async def reserve_materials_from_lots(
        self, batch_id: int, planning_id: int, lot_reservations: List[Dict[str, Any]]
    ):
        stmt_plan = select(ProductionMaterialPlanning).filter_by(id=planning_id)
        plan_res = await self.db.execute(stmt_plan)
        plan = plan_res.scalar_one_or_none()
        if not plan:
            raise ValueError("Planning record not found")
        total_reserved = 0.0
        reservations = []
        for res in lot_reservations:
            lot_id = res["lot_id"]
            qty = res["qty"]
            stmt_lot = select(MaterialLot).filter_by(id=lot_id)
            lot_res = await self.db.execute(stmt_lot)
            lot = lot_res.scalar_one_or_none()
            if lot and lot.quantity_current >= qty:
                reservations.append({"lot_id": lot_id, "qty": qty, "lot_number": lot.lot_number})
                total_reserved += qty
        plan.reserved_qty = total_reserved
        plan.reservations_json = {"items": reservations}
        plan.shortage_qty = max(0, plan.required_qty - total_reserved)
        plan.status = "fully_reserved" if plan.shortage_qty <= 0 else "shortfall"
        await self.db.commit()
        return plan

    async def update_grading_chart(
        self, sku_id: str, base_size: str, measurements: Dict[str, Any], increments: Optional[Dict] = None
    ) -> GradingChart:
        stmt = select(GradingChart).filter_by(sku_id=sku_id)
        res = await self.db.execute(stmt)
        chart = res.scalar_one_or_none()
        if not chart:
            chart = GradingChart(sku_id=sku_id)
            self.db.add(chart)
        chart.base_size = base_size
        chart.measurements_per_size_json = measurements
        chart.increments_json = increments
        await self.db.commit()
        await self.db.refresh(chart)
        return chart

    async def get_batch_technical_sheet(self, batch_id: int) -> Dict[str, Any]:
        stmt_batch = select(ProductionBatch).filter_by(id=batch_id)
        batch_res = await self.db.execute(stmt_batch)
        batch = batch_res.scalar_one_or_none()
        if not batch:
            raise ValueError("Batch not found")
        tp = await self.tech_pack_repo.get_latest_version(batch.sku_id)
        stmt_grading = select(GradingChart).filter_by(sku_id=batch.sku_id)
        grading_res = await self.db.execute(stmt_grading)
        chart = grading_res.scalar_one_or_none()
        relevant_grading = {}
        if chart and batch.size_breakdown_json:
            for size in batch.size_breakdown_json.keys():
                relevant_grading[size] = chart.measurements_per_size_json.get(size, "No data")
        stmt_plan = select(ProductionMaterialPlanning).filter_by(batch_id=batch_id)
        plan_res = await self.db.execute(stmt_plan)
        plans = plan_res.scalars().all()
        return {
            "batch_id": batch_id,
            "sku_id": batch.sku_id,
            "tech_pack": tp.data_json if tp else {},
            "size_breakdown": batch.size_breakdown_json,
            "technical_grading": relevant_grading,
            "material_requirements": [
                {"material": p.material_id, "needed": p.required_qty, "unit": p.unit, "status": p.status}
                for p in plans
            ]
        }

    async def propagate_delays(self, order_id: str, delayed_milestone_id: int, delay_days: int):
        stmt = select(ProductionMilestone).filter_by(order_id=order_id).order_by(ProductionMilestone.target_date)
        res = await self.db.execute(stmt)
        milestones = res.scalars().all()
        start_propagation = False
        for m in milestones:
            if m.id == delayed_milestone_id:
                start_propagation = True
                m.status = "delayed"
                m.actual_date = m.target_date + timedelta(days=delay_days)
                continue
            if start_propagation:
                m.target_date = m.target_date + timedelta(days=delay_days)
                m.status = "affected_by_delay"
        await self.db.commit()
        return milestones

    async def calculate_aql_sample_size(
        self, lot_size: int, inspection_level: str = "G2", aql_level: float = 2.5
    ) -> Dict[str, Any]:
        from app.db.models.base import AQLStandard
        stmt = select(AQLStandard).where(
            AQLStandard.lot_size_min <= lot_size,
            AQLStandard.lot_size_max >= lot_size,
            AQLStandard.inspection_level == inspection_level,
            AQLStandard.aql_level == aql_level
        )
        res = await self.db.execute(stmt)
        standard = res.scalar_one_or_none()
        if not standard:
            return {
                "sample_size": 20 if lot_size < 100 else 50,
                "accept_limit": 1,
                "reject_limit": 2,
                "note": "Default fallback used. Standard not found in DB."
            }
        return {
            "sample_size": standard.sample_size,
            "accept_limit": standard.accept_limit,
            "reject_limit": standard.reject_limit,
            "aql_level": aql_level
        }

    async def create_production_workflow(self, batch_id: int, template_id: int) -> List[ProductionStage]:
        stmt_batch = select(ProductionBatch).filter_by(id=batch_id)
        batch = (await self.db.execute(stmt_batch)).scalar_one_or_none()
        stmt_tpl = select(ProductionStageTemplate).filter_by(id=template_id)
        template = (await self.db.execute(stmt_tpl)).scalar_one_or_none()
        if not batch or not template:
            raise ValueError("Batch or Template not found")
        stages = []
        current_date = batch.start_date or utc_now()
        for i, s_tpl in enumerate(template.stages_json.get("stages", [])):
            duration = s_tpl.get("duration_days", 1)
            end_date = current_date + timedelta(days=duration)
            stage = ProductionStage(
                batch_id=batch_id,
                stage_name=s_tpl["name"],
                sequence_order=i + 1,
                planned_start_date=current_date,
                planned_end_date=end_date,
                status="pending"
            )
            self.db.add(stage)
            stages.append(stage)
            current_date = end_date
        await self.db.commit()
        return stages

    async def assign_stage_responsible(
        self, stage_id: int, staff_id: Optional[str], staff_name: Optional[str], partner_id: Optional[int]
    ):
        stmt = update(ProductionStage).where(ProductionStage.id == stage_id).values(
            responsible_staff_id=staff_id,
            responsible_staff_name=staff_name,
            partner_id=partner_id,
            status="in_progress" if (staff_id or staff_name) else "pending"
        )
        await self.db.execute(stmt)
        await self.db.commit()

    async def update_stage_readiness(
        self, stage_id: int, percent: float, comment: Optional[str], has_questions: bool = False
    ):
        stmt = select(ProductionStage).filter_by(id=stage_id)
        stage = (await self.db.execute(stmt)).scalar_one_or_none()
        if stage:
            stage.readiness_percent = percent
            stage.last_comment = comment
            stage.has_open_questions = has_questions
            if percent >= 100:
                stage.status = "completed"
                stage.actual_end_date = utc_now()
            await self.db.commit()
            return stage

    async def get_batch_workflow_status(self, batch_id: int) -> List[Dict[str, Any]]:
        from app.db.models.base import Supplier
        stmt = select(ProductionStage).filter_by(batch_id=batch_id).order_by(ProductionStage.sequence_order)
        res = await self.db.execute(stmt)
        stages = res.scalars().all()
        result = []
        for s in stages:
            partner_name = None
            if s.partner_id:
                stmt_p = select(Supplier.name).filter_by(id=s.partner_id)
                partner_name = (await self.db.execute(stmt_p)).scalar()
            result.append({
                "id": s.id,
                "name": s.stage_name,
                "order": s.sequence_order,
                "status": s.status,
                "progress": s.readiness_percent,
                "assigned_to": s.responsible_staff_name or partner_name or "Unassigned",
                "dates": {"start": s.planned_start_date.isoformat(), "end": s.planned_end_date.isoformat()},
                "flags": {"questions": s.has_open_questions, "critical": s.is_critical},
                "last_note": s.last_comment
            })
        return result

    async def get_inventory_snapshot(self) -> Dict[str, Any]:
        from app.db.models.base import FinishedGoodsStock, MaterialLot
        stmt_fg = select(FinishedGoodsStock)
        fg_res = await self.db.execute(stmt_fg)
        fg_items = fg_res.scalars().all()
        stmt_lots = select(MaterialLot)
        lot_res = await self.db.execute(stmt_lots)
        material_lots = lot_res.scalars().all()
        return {
            "finished_goods": [
                {
                    "sku_id": i.sku_id, "color": i.color, "size": i.size,
                    "on_hand": i.qty_on_hand, "allocated": i.qty_allocated,
                    "available": i.qty_on_hand - i.qty_allocated,
                    "warehouse": i.warehouse_id
                } for i in fg_items
            ],
            "raw_materials": [
                {
                    "material_id": l.material_id, "lot": l.lot_number,
                    "current_qty": l.quantity_current, "unit": l.unit,
                    "status": l.status
                } for l in material_lots
            ]
        }

    async def assign_responsible(self, entity_type: str, entity_id: Any, user_id: str):
        model_map = {
            "batch": (ProductionBatch, "id"),
            "milestone": (ProductionMilestone, "id"),
            "tech_pack": (TechPackVersion, "id")
        }
        if entity_type not in model_map:
            raise ValueError(f"Invalid entity type: {entity_type}")
        model, id_col = model_map[entity_type]
        stmt = update(model).where(getattr(model, id_col) == entity_id).values(responsible_user_id=user_id)
        await self.db.execute(stmt)
        await self.db.commit()

    async def archive_production_run(self, batch_id: str) -> SKUProductionArchive:
        bid = int(batch_id) if isinstance(batch_id, str) and batch_id.isdigit() else batch_id
        stmt = select(ProductionBatch).filter_by(id=bid)
        res = await self.db.execute(stmt)
        batch = res.scalar_one_or_none()
        if not batch or batch.status != "completed":
            raise ValueError("Only completed batches can be archived.")
        defect_rate = (batch.defect_qty / batch.planned_qty) if batch.planned_qty > 0 else 0
        total_cost = 0.0
        archive = SKUProductionArchive(
            sku_id=batch.sku_id,
            batch_id=str(batch.id),
            planned_qty=batch.planned_qty,
            actual_qty=batch.actual_qty,
            defect_rate=defect_rate,
            total_cost=total_cost,
            factory_id=batch.factory_id,
            produced_at=batch.end_date or utc_now()
        )
        self.db.add(archive)
        await self.db.commit()
        await self.db.refresh(archive)
        return archive

    async def sync_sales_results(
        self, sku_id: str, order_id: str, qty_sold: int, revenue: float, source: str
    ):
        stmt = select(SKUSalesSync).filter_by(sku_id=sku_id, order_id=order_id)
        res = await self.db.execute(stmt)
        sync = res.scalar_one_or_none()
        if sync:
            sync.qty_sold = qty_sold
            sync.revenue_generated = revenue
            sync.sell_through_rate = (qty_sold / sync.qty_shipped) if sync.qty_shipped > 0 else 0
            sync.last_synced_at = utc_now()
        await self.db.commit()

    async def generate_production_milestones(
        self, order_id: str, target_delivery_date: datetime
    ) -> List[ProductionMilestone]:
        milestones_data = [
            {"name": "Final Inspection (QC)", "days_before": 7},
            {"name": "Bulk Production Finish", "days_before": 10},
            {"name": "Bulk Production Start", "days_before": 30},
            {"name": "Material Arrival at Factory", "days_before": 35},
            {"name": "PPS (Pre-Production Sample) Approval", "days_before": 45},
            {"name": "Fabric Ordering", "days_before": 60}
        ]
        results = []
        for m in milestones_data:
            milestone = ProductionMilestone(
                order_id=order_id,
                milestone_name=m["name"],
                target_date=target_delivery_date - timedelta(days=m["days_before"]),
                status="pending"
            )
            self.db.add(milestone)
            results.append(milestone)
        await self.db.commit()
        return results
