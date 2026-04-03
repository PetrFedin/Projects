"""Extended production features: cutting, materials, operations, QC, suppliers."""
from typing import Dict, List, Any, Optional
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import (
    User, CuttingMarker, CuttingReport, RawMaterialTransaction,
    OperationBreakdown, InlineQC, DefectRouting, ReworkRecord, BatchSourcingType,
    GradingSpec, MaterialVariant, PreProductionMeeting, SizeRunPlan, ColorStockPlan,
    SupplierAudit, MaterialSafetyStock, FactoryFallback, GoodsReceiptNote,
    LabDipRetest, FactoryLoadPlan, DefectTypeRegistry, CAPAAction, OperatorDefectStats,
    PPSSample, WearTest, BatchTraceability,
    MaterialAllowance, MaterialSubstitute, MaterialReorderPoint, CrossAllocation,
    ProductionBatch, Supplier
)


class ProductionExtendedService:
    """Extended production management: cutting, materials, operations, QC."""

    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    # --- 1. Cutting & Markers ---
    async def create_cutting_marker(
        self, batch_id: int, sku_id: str, marker_number: str,
        planned_length_m: float, roll_id: Optional[int] = None,
        efficiency_percent: float = 0.0, selvage_cm: float = 0.0,
        waste_m: float = 0.0, defect_zones: Optional[dict] = None
    ) -> CuttingMarker:
        m = CuttingMarker(
            batch_id=batch_id, sku_id=sku_id, marker_number=marker_number,
            planned_length_m=planned_length_m, roll_id=roll_id,
            efficiency_percent=efficiency_percent, selvage_cm=selvage_cm,
            waste_m=waste_m, defect_zones_json=defect_zones, status="draft"
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return m

    async def get_cutting_markers(self, batch_id: int) -> List[Dict]:
        stmt = select(CuttingMarker).filter_by(batch_id=batch_id)
        res = await self.db.execute(stmt)
        markers = res.scalars().all()
        return [
            {"id": m.id, "marker_number": m.marker_number, "planned_length_m": m.planned_length_m,
             "efficiency_percent": m.efficiency_percent, "status": m.status, "roll_id": m.roll_id}
            for m in markers
        ]

    async def create_cutting_report(
        self, marker_id: int, batch_id: int, bom_planned_m: float, actual_used_m: float,
        raw_material_transaction_id: Optional[int] = None
    ) -> CuttingReport:
        var_pct = ((actual_used_m - bom_planned_m) / bom_planned_m * 100) if bom_planned_m else 0
        status = "ok" if abs(var_pct) <= 5 else ("over" if actual_used_m > bom_planned_m else "under")
        r = CuttingReport(
            marker_id=marker_id, batch_id=batch_id, bom_planned_m=bom_planned_m,
            actual_used_m=actual_used_m, variance_percent=round(var_pct, 2),
            validation_status=status, raw_material_transaction_id=raw_material_transaction_id
        )
        self.db.add(r)
        await self.db.commit()
        await self.db.refresh(r)
        return r

    # --- 2. Materials ---
    async def add_material_allowance(
        self, sku_id: str, material_id: str, operation: str,
        allowance_percent: float, unit: str = "m"
    ) -> MaterialAllowance:
        a = MaterialAllowance(sku_id=sku_id, material_id=material_id, operation=operation,
                              allowance_percent=allowance_percent, unit=unit)
        self.db.add(a)
        await self.db.commit()
        await self.db.refresh(a)
        return a

    async def add_material_substitute(
        self, material_id: str, substitute_material_id: str, priority: int = 1, notes: Optional[str] = None
    ) -> MaterialSubstitute:
        s = MaterialSubstitute(material_id=material_id, substitute_material_id=substitute_material_id,
                               priority=priority, notes=notes)
        self.db.add(s)
        await self.db.commit()
        await self.db.refresh(s)
        return s

    async def set_reorder_point(
        self, material_id: str, location_id: str, min_qty: float, reorder_qty: float,
        safety_stock: float = 0.0, lead_time_days: int = 7, unit: str = "m"
    ) -> MaterialReorderPoint:
        stmt = select(MaterialReorderPoint).filter_by(material_id=material_id, location_id=location_id)
        r = (await self.db.execute(stmt)).scalar_one_or_none()
        if r:
            r.min_qty, r.reorder_qty, r.safety_stock = min_qty, reorder_qty, safety_stock
            r.lead_time_days, r.unit = lead_time_days, unit
        else:
            r = MaterialReorderPoint(material_id=material_id, location_id=location_id,
                                     min_qty=min_qty, reorder_qty=reorder_qty,
                                     safety_stock=safety_stock, lead_time_days=lead_time_days, unit=unit)
            self.db.add(r)
        await self.db.commit()
        await self.db.refresh(r)
        return r

    async def create_cross_allocation(
        self, source_sku_id: str, target_sku_id: str, material_id: str,
        quantity: float, reason: str, batch_id: Optional[int] = None
    ) -> CrossAllocation:
        c = CrossAllocation(source_sku_id=source_sku_id, target_sku_id=target_sku_id,
                            material_id=material_id, quantity=quantity, reason=reason, batch_id=batch_id)
        self.db.add(c)
        await self.db.commit()
        await self.db.refresh(c)
        return c

    # --- 3. Operations ---
    async def create_operation_breakdown(
        self, sku_id: str, operation_code: str, sequence_order: int, smv: float,
        machine_type: Optional[str] = None, machine_id: Optional[str] = None,
        category: str = "sewing"
    ) -> OperationBreakdown:
        ob = OperationBreakdown(sku_id=sku_id, operation_code=operation_code,
                                sequence_order=sequence_order, smv=smv,
                                machine_type=machine_type, machine_id=machine_id, category=category)
        self.db.add(ob)
        await self.db.commit()
        await self.db.refresh(ob)
        return ob

    async def record_inline_qc(
        self, batch_id: int, operation_id: int, sample_size: int, defects_found: int,
        result: str, inspector_id: str, photo_url: Optional[str] = None
    ) -> InlineQC:
        qc = InlineQC(batch_id=batch_id, operation_id=operation_id, sample_size=sample_size,
                      defects_found=defects_found, result=result, inspector_id=inspector_id, photo_url=photo_url)
        self.db.add(qc)
        await self.db.commit()
        await self.db.refresh(qc)
        return qc

    async def route_defect(
        self, batch_id: int, defect_type: str, qty: int, routing: str, operator_id: Optional[str] = None
    ) -> DefectRouting:
        dr = DefectRouting(batch_id=batch_id, defect_type=defect_type, qty=qty, routing=routing, operator_id=operator_id)
        self.db.add(dr)
        await self.db.commit()
        await self.db.refresh(dr)
        return dr

    async def record_rework(
        self, batch_id: int, units_reworked: int, defect_id: Optional[int] = None
    ) -> ReworkRecord:
        rr = ReworkRecord(batch_id=batch_id, units_reworked=units_reworked, defect_id=defect_id)
        self.db.add(rr)
        await self.db.commit()
        await self.db.refresh(rr)
        return rr

    async def set_batch_sourcing(
        self, batch_id: int, sourcing_type: str, materials_provided_by: str, notes: Optional[str] = None
    ) -> BatchSourcingType:
        bs = BatchSourcingType(batch_id=batch_id, sourcing_type=sourcing_type,
                               materials_provided_by=materials_provided_by, notes=notes)
        self.db.add(bs)
        await self.db.commit()
        await self.db.refresh(bs)
        return bs

    # --- 4. Assortment ---
    async def create_ppm(
        self, batch_id: int, sku_id: str, meeting_date: datetime,
        decisions: dict, attendees: Optional[list] = None
    ) -> PreProductionMeeting:
        ppm = PreProductionMeeting(batch_id=batch_id, sku_id=sku_id, meeting_date=meeting_date,
                                   decisions_json=decisions, attendees_json=attendees, status="scheduled")
        self.db.add(ppm)
        await self.db.commit()
        await self.db.refresh(ppm)
        return ppm

    async def set_size_run_plan(
        self, sku_id: str, size_breakdown: dict, total_qty: int,
        batch_id: Optional[int] = None, collection_id: Optional[str] = None
    ) -> SizeRunPlan:
        srp = SizeRunPlan(sku_id=sku_id, size_breakdown_json=size_breakdown, total_qty=total_qty,
                          batch_id=batch_id, collection_id=collection_id)
        self.db.add(srp)
        await self.db.commit()
        await self.db.refresh(srp)
        return srp

    async def add_color_stock_plan(
        self, sku_id: str, color_id: int, color_name: str, planned_qty: int,
        batch_id: Optional[int] = None
    ) -> ColorStockPlan:
        csp = ColorStockPlan(sku_id=sku_id, color_id=color_id, color_name=color_name,
                             planned_qty=planned_qty, batch_id=batch_id)
        self.db.add(csp)
        await self.db.commit()
        await self.db.refresh(csp)
        return csp

    # --- 5. Suppliers ---
    async def create_supplier_audit(
        self, supplier_id: int, audit_date: datetime, audit_type: str,
        checklist: dict, result: str, responsible_id: Optional[str] = None,
        next_audit_date: Optional[datetime] = None
    ) -> SupplierAudit:
        sa = SupplierAudit(supplier_id=supplier_id, audit_date=audit_date, audit_type=audit_type,
                          checklist_json=checklist, result=result, responsible_id=responsible_id,
                          next_audit_date=next_audit_date)
        self.db.add(sa)
        await self.db.commit()
        await self.db.refresh(sa)
        return sa

    async def get_grns(self, material_order_id: Optional[int] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """List Goods Receipt Notes, optionally filtered by material order."""
        q = select(GoodsReceiptNote).order_by(GoodsReceiptNote.received_at.desc()).limit(limit)
        if material_order_id:
            q = q.where(GoodsReceiptNote.material_order_id == material_order_id)
        res = await self.db.execute(q)
        items = res.scalars().all()
        return [
            {"id": g.id, "material_order_id": g.material_order_id, "received_qty": g.received_qty,
             "ordered_qty": g.ordered_qty, "variance": g.variance, "status": g.status, "received_at": g.received_at.isoformat(), "received_by": g.received_by}
            for g in items
        ]

    async def create_grn(
        self, material_order_id: int, received_qty: float, ordered_qty: float,
        status: str, received_by: str, notes: Optional[str] = None
    ) -> GoodsReceiptNote:
        var = received_qty - ordered_qty
        grn = GoodsReceiptNote(material_order_id=material_order_id, received_qty=received_qty,
                               ordered_qty=ordered_qty, variance=var, status=status,
                               received_by=received_by, notes=notes)
        self.db.add(grn)
        await self.db.commit()
        await self.db.refresh(grn)
        return grn

    async def add_factory_fallback(
        self, primary_factory_id: int, fallback_factory_id: int, priority: int = 1
    ) -> FactoryFallback:
        ff = FactoryFallback(primary_factory_id=primary_factory_id, fallback_factory_id=fallback_factory_id,
                             priority=priority)
        self.db.add(ff)
        await self.db.commit()
        await self.db.refresh(ff)
        return ff

    # --- 6. QC ---
    async def register_defect_type(
        self, code: str, name_ru: str, category: str,
        name_en: Optional[str] = None, operation_code: Optional[str] = None
    ) -> DefectTypeRegistry:
        dt = DefectTypeRegistry(code=code, name_ru=name_ru, name_en=name_en,
                                category=category, operation_code=operation_code)
        self.db.add(dt)
        await self.db.commit()
        await self.db.refresh(dt)
        return dt

    async def create_capa(
        self, defect_type_code: str, description: str, action_type: str,
        batch_id: Optional[int] = None, operator_id: Optional[str] = None,
        due_date: Optional[datetime] = None
    ) -> CAPAAction:
        capa = CAPAAction(defect_type_code=defect_type_code, description=description,
                          action_type=action_type, batch_id=batch_id, operator_id=operator_id, due_date=due_date)
        self.db.add(capa)
        await self.db.commit()
        await self.db.refresh(capa)
        return capa

    async def get_defect_types(self) -> List[Dict]:
        stmt = select(DefectTypeRegistry).where(DefectTypeRegistry.is_active == True)
        res = await self.db.execute(stmt)
        items = res.scalars().all()
        return [{"code": d.code, "name_ru": d.name_ru, "category": d.category} for d in items]

    # --- 7. Additional ---
    async def create_pps_sample(
        self, batch_id: int, sku_id: str, stage: str = "requested"
    ) -> PPSSample:
        pps = PPSSample(batch_id=batch_id, sku_id=sku_id, stage=stage)
        self.db.add(pps)
        await self.db.commit()
        await self.db.refresh(pps)
        return pps

    async def create_wear_test(
        self, sku_id: str, start_date: datetime, batch_id: Optional[int] = None,
        status: str = "scheduled"
    ) -> WearTest:
        wt = WearTest(sku_id=sku_id, start_date=start_date, batch_id=batch_id, status=status)
        self.db.add(wt)
        await self.db.commit()
        await self.db.refresh(wt)
        return wt

    async def record_batch_traceability(
        self, production_batch_id: int, material_lot_id: int,
        fabric_roll_id: Optional[int] = None, unit_serial: Optional[str] = None,
        trace_chain: Optional[dict] = None
    ) -> BatchTraceability:
        bt = BatchTraceability(production_batch_id=production_batch_id, material_lot_id=material_lot_id,
                               fabric_roll_id=fabric_roll_id, unit_serial=unit_serial, trace_chain_json=trace_chain)
        self.db.add(bt)
        await self.db.commit()
        await self.db.refresh(bt)
        return bt
