from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.production_service import ProductionService
from app.api.schemas.product import (
    GradingChart, GradingChartCreate,
    ConstructionDetail, ConstructionDetailCreate,
    SampleOrder, SampleOrderCreate,
    FitCorrection, FitCorrectionCreate
)
from app.api.schemas.production import (
    TechPackVersion, ProductDimension, ProductDimensionBase,
    FabricRoll, FabricRollBase, MarkingCode, SMV, SMVBase,
    BOMCreate, DocumentUpload, CostingUpdate, BOMItem,
    RFQCreate, SupplierOfferSubmit, ComplianceCertCreate,
    PaymentMilestoneCreate, ScorecardResponse,
    MaterialPlanningResponse, GradingChartUpdate, BatchCreateDetailed,
    ColorLibraryCreate, SizeGridCreate, ContractUsageResponse, AQLCalculationResponse,
    StageAssignment, StageUpdate, ProductionStageResponse
)
from app.api.v1.endpoints.plm.models_plm import (
    MaterialOrderCreate, LabDipCreate, ProductionMessageCreate, VersionCreate,
    MarkingOrder, CloneRequest, ResponsibleAssignment, OperationProgressUpdate,
    SignOffRequest, SignOffExecution, DetailedQCUpdate, MaterialMasterCreate,
    MaterialConsumption, ProductionFinish, AllocationRequest, LotReservationRequest,
    SizeConvertRequest, CuttingMarkerCreate, CuttingReportCreate, MaterialAllowanceCreate,
    InlineQCCreate, DefectTypeCreate, GRNCreate, CAPACreate,
)

router = APIRouter()

# --- Tech Pack Versioning ---
@router.post("/tech-pack/versions", response_model=GenericResponse[TechPackVersion])
async def create_version(
    v_in: VersionCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    version = await service.create_tech_pack_version(v_in.sku_id, v_in.data, v_in.change_log)
    return GenericResponse(data=version)

@router.post("/tech-pack/clone", response_model=GenericResponse[TechPackVersion])
async def clone_tech_pack_endpoint(
    clone_in: CloneRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    new_version = await service.clone_tech_pack(clone_in.source_sku_id, clone_in.new_sku_id, clone_in.new_collection_id)
    return GenericResponse(data=new_version)

@router.get("/tech-pack/{sku_id}/compare", response_model=GenericResponse[Dict[str, Any]])
async def compare_versions(
    sku_id: str,
    v1: str,
    v2: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    diff = await service.compare_versions(sku_id, v1, v2)
    return GenericResponse(data=diff)

# --- Marking (Chestny Znak) ---
@router.post("/marking/order", response_model=GenericResponse[List[MarkingCode]])
async def order_marking(
    order_in: MarkingOrder,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    codes = await service.order_marking_codes(order_in.sku_id, order_in.batch_id, order_in.quantity)
    return GenericResponse(data=codes)

# --- Raw Materials & Toll Manufacturing ---
@router.post("/inventory/rolls", response_model=GenericResponse[FabricRoll])
async def register_roll(
    roll_in: FabricRollBase,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    roll = await service.register_fabric_roll(
        roll_in.material_id, roll_in.roll_number, 
        roll_in.initial_length_m, roll_in.width_cm, roll_in.factory_id
    )
    return GenericResponse(data=roll)

@router.post("/inventory/toll-balance/update", response_model=GenericResponse[Dict[str, Any]])
async def update_toll_balance(
    factory_id: str,
    material_id: str,
    quantity: float,
    action: str = "add",
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    balance = await service.update_toll_material_balance(factory_id, material_id, quantity, action)
    return GenericResponse(data={"factory_id": balance.factory_id, "material_id": balance.material_id, "balance": balance.quantity_on_hand})

# --- Costing & SMV ---
@router.post("/costing/smv", response_model=GenericResponse[Dict[str, Any]])
async def calculate_smv_cost(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    result = await service.calculate_smv_costing(sku_id)
    return GenericResponse(data=result)

# --- Master Production View ---
@router.get("/sku/{sku_id}/snapshot", response_model=GenericResponse[Dict[str, Any]])
async def get_sku_snapshot(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns a full 360-degree overview of production stages for a SKU."""
    service = ProductionService(db, current_user)
    snapshot = await service.get_sku_production_snapshot(sku_id)
    return GenericResponse(data=snapshot)

# --- Detailing & BOM ---
@router.post("/bom", response_model=GenericResponse[Dict[str, Any]])
async def create_bom(
    bom_in: BOMCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Creates or updates a Bill of Materials for a SKU."""
    service = ProductionService(db, current_user)
    bom = await service.create_bom(bom_in.sku_id, [i.model_dump() for i in bom_in.items])
    return GenericResponse(data={"id": bom.id, "total_cost": bom.total_material_cost})

# --- Documents Hub ---
@router.post("/documents", response_model=GenericResponse[Dict[str, Any]])
async def upload_document(
    doc_in: DocumentUpload,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Links a production document (Tech Pack, Lab report) to a SKU."""
    service = ProductionService(db, current_user)
    doc = await service.upload_document(doc_in.sku_id, doc_in.doc_type, doc_in.title, doc_in.url)
    return GenericResponse(data={"id": doc.id, "title": doc.title})

# --- Financials & Costing ---
@router.post("/costing", response_model=GenericResponse[Dict[str, Any]])
async def update_costing(
    cost_in: CostingUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Updates the advanced costing data for a SKU."""
    service = ProductionService(db, current_user)
    # Calculate landed cost and margin simply for now
    data = cost_in.model_dump()
    data["total_landed_cost"] = data["fabric_cost"] + data["trim_cost"] + data["labor_cost"] + data["logistics_cost"]
    data["projected_margin"] = (data["target_retail_price"] - data["total_landed_cost"]) / data["target_retail_price"] if data["target_retail_price"] > 0 else 0
    
    costing = await service.update_sku_costing(cost_in.sku_id, data)
    return GenericResponse(data={"sku_id": costing.sku_id, "landed_cost": costing.total_landed_cost, "margin": costing.projected_margin})

# --- Bulk Production Tracking ---
@router.get("/bulk/{order_id}/workflow", response_model=GenericResponse[Dict[str, Any]])
async def get_bulk_workflow(
    order_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns the mass production workflow (GANTT, Milestones, QC)."""
    service = ProductionService(db, current_user)
    workflow = await service.get_bulk_workflow(order_id)
    return GenericResponse(data=workflow)

# --- Sourcing ---
@router.get("/suppliers", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_suppliers(
    limit: int = 100,
    supplier_type: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    suppliers = await service.get_suppliers()
    if supplier_type:
        suppliers = [s for s in suppliers if getattr(s, "supplier_type", None) == supplier_type]
    return GenericResponse(data=[{"id": s.id, "name": s.name, "type": s.supplier_type} for s in suppliers[:limit]])

@router.post("/material-orders", response_model=GenericResponse[Dict[str, Any]])
async def create_material_order(
    order_in: MaterialOrderCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    order = await service.create_material_order(order_in.model_dump())
    return GenericResponse(data={"id": order.id, "status": order.status})

# --- Tech Pack & BOM ---
class TechPackDetailsBody(BaseModel):
    grading: Optional[Dict] = None
    construction: Optional[Dict] = None

@router.post("/tech-pack/{sku_id}/details", response_model=GenericResponse[Dict[str, Any]])
async def save_tech_pack(
    sku_id: str,
    body: Optional[TechPackDetailsBody] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    g = body.grading if body else None
    c = body.construction if body else None
    await service.save_tech_pack_details(sku_id, g, c)
    return GenericResponse(data={"status": "updated", "sku_id": sku_id})

@router.get("/bom/{sku_id}/calculate", response_model=GenericResponse[Dict[str, Any]])
async def calculate_bom(
    sku_id: str,
    quantity: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    result = await service.calculate_raw_materials(sku_id, quantity)
    return GenericResponse(data=result)

# --- Sampling ---
@router.post("/samples", response_model=GenericResponse[Dict[str, Any]])
async def order_sample(
    sample_in: SampleOrderCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    sample = await service.order_sample(sample_in.sku_id, sample_in.factory_id, sample_in.sample_type)
    return GenericResponse(data={"id": sample.id, "status": sample.status})

# --- Collaboration ---
@router.post("/messages", response_model=GenericResponse[Dict[str, Any]])
async def send_plm_message(
    msg_in: ProductionMessageCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Sends a contextual message linked to a specific SKU, Batch, or any Entity."""
    service = ProductionService(db, current_user)
    sku_id = msg_in.sku_id or msg_in.context_id
    msg = await service.send_production_message(
        text=msg_in.text,
        entity_type=msg_in.entity_type,
        entity_id=msg_in.entity_id or msg_in.context_id,
        sku_id=sku_id,
        batch_id=msg_in.batch_id
    )
    return GenericResponse(data={"id": msg.id, "status": "sent"})

# --- Compliance ---
@router.post("/compliance/eac", response_model=GenericResponse[Dict[str, Any]])
async def register_eac(
    sku_list: List[str],
    cert_number: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ProductionService(db, current_user)
    cert = await service.register_eac_certificate(sku_list, cert_number)
    return GenericResponse(data={"id": cert.id, "certificate_number": cert.certificate_number})

@router.post("/production/milestones/generate", response_model=GenericResponse[Dict[str, Any]])
async def generate_milestones(
    order_id: str,
    delivery_date: datetime,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Auto-generates typical production milestones for an order."""
    service = ProductionService(db, current_user)
    milestones = await service.generate_production_milestones(order_id, delivery_date)
    return GenericResponse(data={"order_id": order_id, "milestones_count": len(milestones)})

# --- Archive & History ---
@router.get("/sku/{sku_id}/archive", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_sku_archive(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns the historical record of all production runs for a SKU."""
    from app.db.models.product import SKUProductionArchive
    from sqlalchemy import select
    stmt = select(SKUProductionArchive).filter_by(sku_id=sku_id).order_by(SKUProductionArchive.produced_at.desc())
    res = await db.execute(stmt)
    archives = res.scalars().all()
    return GenericResponse(data=[{
        "id": a.id, "batch_id": a.batch_id, "actual_qty": a.actual_qty, 
        "defect_rate": a.defect_rate, "produced_at": a.produced_at.isoformat()
    } for a in archives])

@router.get("/sku/{sku_id}/sales-sync", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_sku_sales_performance(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns sales performance data synced from Marketroom/Outlet/POS."""
    from app.db.models.product import SKUSalesSync
    from sqlalchemy import select
    stmt = select(SKUSalesSync).filter_by(sku_id=sku_id).order_by(SKUSalesSync.last_synced_at.desc())
    res = await db.execute(stmt)
    syncs = res.scalars().all()
    return GenericResponse(data=[{
        "id": s.id, "store_id": s.store_id, "color": s.color, "size": s.size,
        "qty_shipped": s.qty_shipped, "qty_sold": s.qty_sold, "sell_through": s.sell_through_rate,
        "revenue": s.revenue_generated, "source": s.sync_source
    } for s in syncs])

# --- Team & Responsible Assignment ---
@router.post("/production/assign-responsible", response_model=GenericResponse[Dict[str, Any]])
async def assign_responsible_user(
    assign_in: ResponsibleAssignment,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Assigns a responsible team member to a specific production stage or entire batch."""
    service = ProductionService(db, current_user)
    await service.assign_responsible(assign_in.entity_type, assign_in.entity_id, assign_in.user_id)
    return GenericResponse(data={"status": "assigned", "user_id": assign_in.user_id})

# --- Granular Operation Tracking ---
@router.post("/production/operations/track", response_model=GenericResponse[Dict[str, Any]])
async def track_operation_progress(
    track_in: OperationProgressUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Real-time tracking of specific operations (sewing, cutting, etc.) within a batch."""
    service = ProductionService(db, current_user)
    op = await service.record_operation_progress(
        track_in.batch_id, track_in.operation, 
        track_in.units, track_in.defects, track_in.operator_id
    )
    return GenericResponse(data={"id": op.id, "units_completed": op.units_completed})

# --- Technical Sign-offs (Workflow) ---
@router.post("/production/sign-off/request", response_model=GenericResponse[Dict[str, Any]])
async def request_stage_signoff(
    req_in: SignOffRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Factory requests a technical approval for a stage (e.g., sample approval)."""
    service = ProductionService(db, current_user)
    signoff = await service.request_technical_signoff(req_in.sku_id, req_in.stage, req_in.artifact_url)
    return GenericResponse(data={"id": signoff.id, "status": "pending"})

@router.post("/production/sign-off/{signoff_id}/execute", response_model=GenericResponse[Dict[str, Any]])
async def execute_stage_signoff(
    signoff_id: int,
    exec_in: SignOffExecution,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Brand approves or rejects a technical stage."""
    service = ProductionService(db, current_user)
    await service.execute_signoff(signoff_id, exec_in.status, exec_in.comments)
    return GenericResponse(data={"id": signoff_id, "status": exec_in.status})

# --- Technical Recipes & Machine settings ---
@router.get("/sku/{sku_id}/machine-recipe", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_machine_recipe(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns exact machine settings and thread specs for a SKU."""
    service = ProductionService(db, current_user)
    recipe = await service.get_machine_recipe(sku_id)
    return GenericResponse(data=recipe)

# --- Production Pillars & Workflow Ordering ---
@router.get("/sku/{sku_id}/workflow-pillars", response_model=GenericResponse[Dict[str, Any]])
async def get_workflow_pillars(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns the ordered logical sections of production for a brand."""
    service = ProductionService(db, current_user)
    pillars = await service.get_production_pillars(sku_id)
    return GenericResponse(data=pillars)

@router.post("/production/qc/detailed", response_model=GenericResponse[Dict[str, Any]])
async def record_detailed_qc(
    qc_in: DetailedQCUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Records a deep quality inspection with defect categorization."""
    service = ProductionService(db, current_user)
    qc = await service.create_detailed_qc(qc_in.batch_id, qc_in.inspection_type, qc_in.defects, qc_in.result)
    return GenericResponse(data={"id": qc.id, "result": qc.result})

# --- Critical Path (CP) ---
@router.get("/orders/{order_id}/critical-path", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_order_critical_path(
    order_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns the production timeline with critical dependency analysis."""
    service = ProductionService(db, current_user)
    path = await service.get_critical_path(order_id)
    return GenericResponse(data=path)

# --- Sourcing & Material Reference (Справочники) ---
@router.post("/reference/materials", response_model=GenericResponse[Dict[str, Any]])
async def add_material_reference(
    mat_in: MaterialMasterCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Adds a new material to the organization's reference book."""
    service = ProductionService(db, current_user)
    material = await service.add_to_material_master(mat_in.model_dump())
    return GenericResponse(data={"id": material.id, "name": material.name})

# --- Inventory & Traceability (Запасы и Прослеживаемость) ---
@router.get("/inventory/snapshot", response_model=GenericResponse[Dict[str, Any]])
async def get_inventory_snapshot(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Full view of raw materials and finished goods vs. demand."""
    service = ProductionService(db, current_user)
    snapshot = await service.get_inventory_snapshot()
    return GenericResponse(data=snapshot)

@router.post("/inventory/consume-materials", response_model=GenericResponse[Dict[str, Any]])
async def record_consumption(
    cons_in: MaterialConsumption,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Links raw material batches to production batches (Traceability)."""
    service = ProductionService(db, current_user)
    trace = await service.record_material_consumption(cons_in.batch_id, cons_in.lot_id, cons_in.qty)
    return GenericResponse(data={"id": trace.id, "status": "recorded"})

@router.post("/production/finish-to-stock", response_model=GenericResponse[Dict[str, Any]])
async def finish_to_stock(
    finish_in: ProductionFinish,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Moves finished production into inventory."""
    service = ProductionService(db, current_user)
    stock = await service.finish_production_to_stock(
        finish_in.batch_id, finish_in.color, finish_in.size, 
        finish_in.qty, finish_in.warehouse_id
    )
    return GenericResponse(data={"id": stock.id, "qty_on_hand": stock.qty_on_hand})

@router.post("/inventory/allocate", response_model=GenericResponse[Dict[str, Any]])
async def allocate_stock(
    alloc_in: AllocationRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Allocates finished goods to a specific customer order."""
    service = ProductionService(db, current_user)
    alloc = await service.allocate_stock_to_order(alloc_in.order_id, alloc_in.stock_id, alloc_in.qty)
    return GenericResponse(data={"id": alloc.id, "status": "allocated"})

# --- Finance & Sourcing Link ---
@router.post("/sku/{sku_id}/sync-finance", response_model=GenericResponse[Dict[str, Any]])
async def sync_sku_finance(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Automatically updates financial costing based on actual BOM and SMV data."""
    service = ProductionService(db, current_user)
    await service.link_finance_to_sourcing(sku_id)
    return GenericResponse(data={"status": "synced", "sku_id": sku_id})

# --- Advanced Sourcing (RFQ & Offers) ---
@router.post("/sourcing/rfq", response_model=GenericResponse[Dict[str, Any]])
async def create_rfq(
    rfq_in: RFQCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Initiates a Request for Quotation for materials or production."""
    service = ProductionService(db, current_user)
    rfq = await service.create_rfq(rfq_in.model_dump(), rfq_in.items)
    return GenericResponse(data={"id": rfq.id, "title": rfq.title, "status": rfq.status})

@router.post("/sourcing/offer", response_model=GenericResponse[Dict[str, Any]])
async def submit_offer(
    offer_in: SupplierOfferSubmit,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Supplier submits an offer in response to an RFQ."""
    service = ProductionService(db, current_user)
    offer = await service.submit_supplier_offer(offer_in.model_dump())
    return GenericResponse(data={"id": offer.id, "status": offer.status})

# --- Compliance & Law (Certificates) ---
@router.post("/compliance/certificate", response_model=GenericResponse[Dict[str, Any]])
async def register_certificate(
    cert_in: ComplianceCertCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Registers a legal certificate (EAC, ISO, Oeko-Tex) for a supplier or material."""
    service = ProductionService(db, current_user)
    cert = await service.register_compliance_certificate(cert_in.model_dump())
    return GenericResponse(data={"id": cert.id, "cert_number": cert.cert_number, "status": cert.status})

# --- Production Finance (Payments) ---
@router.post("/finance/payment-milestones", response_model=GenericResponse[List[Dict[str, Any]]])
async def create_payment_schedule(
    batch_id: Optional[int] = None,
    material_order_id: Optional[int] = None,
    milestones: List[PaymentMilestoneCreate] = [],
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Generates a financial payment schedule tied to production milestones."""
    service = ProductionService(db, current_user)
    results = await service.generate_payment_schedule(batch_id, material_order_id, [m.model_dump() for m in milestones])
    return GenericResponse(data=[{"id": p.id, "milestone": p.milestone_name, "amount": p.amount} for p in results])

# --- Advanced Planning & MRP (Планирование сырья) ---
@router.post("/production/batches/detailed", response_model=GenericResponse[Dict[str, Any]])
async def create_detailed_batch(
    batch_in: BatchCreateDetailed,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Creates a production batch with detailed size breakdown."""
    service = ProductionService(db, current_user)
    from app.db.models.base import ProductionBatch
    batch = ProductionBatch(
        factory_id=batch_in.factory_id,
        order_id=batch_in.order_id,
        sku_id=batch_in.sku_id,
        planned_qty=batch_in.planned_qty,
        size_breakdown_json=batch_in.size_breakdown,
        status="pending"
    )
    db.add(batch)
    await db.commit()
    await db.refresh(batch)
    return GenericResponse(data={"id": batch.id, "sku_id": batch.sku_id})

@router.post("/production/batches/{batch_id}/calculate-mrp", response_model=GenericResponse[List[MaterialPlanningResponse]])
async def calculate_batch_mrp(
    batch_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Calculates exact raw material requirements based on batch size breakdown."""
    service = ProductionService(db, current_user)
    plans = await service.calculate_detailed_requirements(batch_id)
    return GenericResponse(data=plans)

@router.post("/production/batches/{batch_id}/reserve-lots", response_model=GenericResponse[MaterialPlanningResponse])
async def reserve_lots_for_batch(
    batch_id: int,
    res_in: LotReservationRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Reserves specific material lots for a production plan."""
    service = ProductionService(db, current_user)
    plan = await service.reserve_materials_from_lots(batch_id, res_in.planning_id, res_in.lot_reservations)
    return GenericResponse(data=plan)

@router.get("/production/batches/{batch_id}/technical-sheet", response_model=GenericResponse[Dict[str, Any]])
async def get_batch_tz(
    batch_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns the complete technical task (ТЗ) for a batch, including per-size specs and materials."""
    service = ProductionService(db, current_user)
    tz = await service.get_batch_technical_sheet(batch_id)
    return GenericResponse(data=tz)

# --- Grading & Dimensions (Размерные сетки и ТЗ) ---
@router.post("/tech-pack/grading", response_model=GenericResponse[Dict[str, Any]])
async def update_grading(
    grading_in: GradingChartUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Saves detailed dimensions and increments for every size in the Tech Pack."""
    service = ProductionService(db, current_user)
    chart = await service.update_grading_chart(
        grading_in.sku_id, 
        grading_in.base_size, 
        grading_in.measurements_per_size, 
        grading_in.increments
    )
    return GenericResponse(data={"id": chart.id, "sku_id": chart.sku_id})

# --- Master Data Management (Справочники) ---
@router.post("/reference/colors", response_model=GenericResponse[Dict[str, Any]])
async def add_color_reference(
    color_in: ColorLibraryCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Registers a color from Pantone or brand library."""
    from app.db.models.base import ColorLibrary
    color = ColorLibrary(**color_in.model_dump())
    db.add(color)
    await db.commit()
    await db.refresh(color)
    return GenericResponse(data={"id": color.id, "name": color.name})

@router.post("/reference/size-grids", response_model=GenericResponse[Dict[str, Any]])
async def add_size_grid(
    grid_in: SizeGridCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Adds a standard size grid (EU, US, etc.) to the library."""
    from app.db.models.base import SizeGridMaster
    grid = SizeGridMaster(name=grid_in.name, region=grid_in.region, sizes_json=grid_in.sizes)
    db.add(grid)
    await db.commit()
    await db.refresh(grid)
    return GenericResponse(data={"id": grid.id, "name": grid.name})

# --- Advanced QC (AQL) ---
@router.get("/qc/calculate-aql", response_model=GenericResponse[AQLCalculationResponse])
async def calculate_aql(
    lot_size: int,
    inspection_level: str = "G2",
    aql_level: float = 2.5,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Calculates sample size and limits for a QC inspection."""
    service = ProductionService(db, current_user)
    result = await service.calculate_aql_sample_size(lot_size, inspection_level, aql_level)
    return GenericResponse(data=result)

# --- Critical Path & Delay Propagation ---
@router.post("/orders/{order_id}/propagate-delay", response_model=GenericResponse[List[Dict[str, Any]]])
async def shift_order_timeline(
    order_id: str,
    milestone_id: int,
    delay_days: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Vertical: Automatically shifts all subsequent milestones when a delay occurs."""
    service = ProductionService(db, current_user)
    milestones = await service.propagate_delays(order_id, milestone_id, delay_days)
    return GenericResponse(data=[{"id": m.id, "name": m.milestone_name, "new_date": m.target_date.isoformat()} for m in milestones])

# --- Advanced Sourcing (Contracts) ---
@router.post("/sourcing/contracts/{contract_id}/track", response_model=GenericResponse[ContractUsageResponse])
async def track_contract(
    contract_id: int,
    volume: float,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Tracks material usage against a long-term supplier contract."""
    service = ProductionService(db, current_user)
    usage = await service.track_contract_usage(contract_id, volume)
    return GenericResponse(data=usage)

# --- Finance (Variance) ---
@router.get("/sku/{sku_id}/variance-report", response_model=GenericResponse[Dict[str, Any]])
async def get_variance(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Finance: Compares planned vs actual costs for a SKU."""
    service = ProductionService(db, current_user)
    report = await service.get_production_variance_report(sku_id)
    return GenericResponse(data=report)

# --- Structured Workflow & Assignments (Этапы и Ответственные) ---
@router.post("/production/batches/{batch_id}/init-workflow", response_model=GenericResponse[List[ProductionStageResponse]])
async def initialize_workflow(
    batch_id: int,
    template_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Systematizes a batch by creating a sequence of production stages from a template."""
    service = ProductionService(db, current_user)
    await service.create_production_workflow(batch_id, template_id)
    status = await service.get_batch_workflow_status(batch_id)
    return GenericResponse(data=status)

@router.get("/production/batches/{batch_id}/workflow", response_model=GenericResponse[List[ProductionStageResponse]])
async def get_workflow(
    batch_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Returns the step-by-step status of all production stages for a batch."""
    service = ProductionService(db, current_user)
    status = await service.get_batch_workflow_status(batch_id)
    return GenericResponse(data=status)

@router.post("/production/stages/{stage_id}/assign", response_model=GenericResponse[Dict[str, Any]])
async def assign_responsible_to_stage(
    stage_id: int,
    assign_in: StageAssignment,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Assigns a partner or a specific staff member (seamstress) to a production stage."""
    service = ProductionService(db, current_user)
    await service.assign_stage_responsible(stage_id, assign_in.staff_id, assign_in.staff_name, assign_in.partner_id)
    return GenericResponse(data={"status": "assigned"})

@router.post("/production/stages/{stage_id}/update", response_model=GenericResponse[Dict[str, Any]])
async def update_stage_progress(
    stage_id: int,
    update_in: StageUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Updates readiness, adds comments, and flags questions for a production stage."""
    service = ProductionService(db, current_user)
    stage = await service.update_stage_readiness(stage_id, update_in.readiness_percent, update_in.comment, update_in.has_questions)
    return GenericResponse(data={"id": stage.id, "progress": stage.readiness_percent, "has_questions": stage.has_questions})

# --- AI Supplier Scorecards ---
@router.get("/suppliers/{supplier_id}/scorecard", response_model=GenericResponse[ScorecardResponse])
async def get_supplier_scorecard(
    supplier_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Retrieves the latest AI-calculated performance scorecard for a supplier."""
    service = ProductionService(db, current_user)
    scorecard = await service.get_supplier_scorecard(supplier_id)
    if not scorecard:
        raise HTTPException(status_code=404, detail="Scorecard not found. Run recalculation.")
    return GenericResponse(data=scorecard)

@router.post("/suppliers/{supplier_id}/recalculate-score", response_model=GenericResponse[ScorecardResponse])
async def recalculate_supplier_score(
    supplier_id: int,
    start_date: datetime,
    end_date: datetime,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Triggers AI aggregation of delays, defects, and compliance to update supplier rating."""
    service = ProductionService(db, current_user)
    scorecard = await service.calculate_supplier_scorecard(supplier_id, start_date, end_date)
    return GenericResponse(data=scorecard)

# --- Advanced Detail: Financial Projection ---
@router.get("/finance/calendar", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_payment_calendar(
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Finance: Returns a project-wide payment calendar for cash flow planning."""
    service = ProductionService(db, current_user)
    calendar = await service.get_financial_calendar(current_user.organization_id)
    items = calendar if isinstance(calendar, list) else [calendar]
    return GenericResponse(data=items[:limit])

# --- Advanced Detail: Critical Path Monitoring ---
@router.get("/critical-path/alerts", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_cp_alerts(
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Critical Path: Returns proactive alerts for milestones due within 24h."""
    service = ProductionService(db, current_user)
    alerts = await service.get_critical_alerts(current_user.organization_id)
    items = alerts if isinstance(alerts, list) else [alerts]
    return GenericResponse(data=items[:limit])

# --- Advanced Detail: Legal Check ---
@router.get("/production/batches/{batch_id}/compliance-check", response_model=GenericResponse[Dict[str, Any]])
async def check_batch_compliance(
    batch_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Law & Compliance: Validates certificates before allowing logistics/shipping."""
    service = ProductionService(db, current_user)
    check = await service.check_compliance_for_shipping(batch_id)
    return GenericResponse(data=check)

# --- Advanced Detail: MDM Utility ---
@router.post("/reference/size-grids/convert", response_model=GenericResponse[Dict[str, Any]])
async def convert_size_label(
    conv_in: SizeConvertRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """MDM: Utility to convert size labels across different standard grids."""
    service = ProductionService(db, current_user)
    target_label = await service.convert_size(conv_in.source_grid_id, conv_in.target_grid_id, conv_in.size_label)
    if not target_label:
        raise HTTPException(status_code=400, detail="Conversion failed. Grids incompatible or size not found.")
    return GenericResponse(data={"converted_size": target_label})


# --- Extended Production (Раскрой, материалы, операции, QC, поставщики) ---
from app.services.production_extended_service import ProductionExtendedService
from datetime import datetime as dt

@router.post("/cutting/markers", response_model=GenericResponse[Dict[str, Any]])
async def create_cutting_marker(
    body: CuttingMarkerCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """1. Раскрой: Создать маркер-лист с учётом дефектов, nesting."""
    svc = ProductionExtendedService(db, current_user)
    m = await svc.create_cutting_marker(**body.model_dump())
    return GenericResponse(data={"id": m.id, "marker_number": m.marker_number, "status": m.status})

@router.get("/cutting/batches/{batch_id}/markers", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_cutting_markers(
    batch_id: int,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """1. Раскрой: Список маркеров по партии."""
    svc = ProductionExtendedService(db, current_user)
    markers = await svc.get_cutting_markers(batch_id)
    return GenericResponse(data=(markers or [])[:limit])

@router.post("/cutting/reports", response_model=GenericResponse[Dict[str, Any]])
async def create_cutting_report(
    body: CuttingReportCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """1. Раскрой: Отчёт раскроя, валидация vs BOM."""
    svc = ProductionExtendedService(db, current_user)
    r = await svc.create_cutting_report(**body.model_dump())
    return GenericResponse(data={"id": r.id, "validation_status": r.validation_status, "variance_percent": r.variance_percent})

@router.post("/materials/allowance", response_model=GenericResponse[Dict[str, Any]])
async def add_material_allowance(
    body: MaterialAllowanceCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """2. Сырьё: Нормы списания (allowance) по операциям."""
    svc = ProductionExtendedService(db, current_user)
    a = await svc.add_material_allowance(**body.model_dump())
    return GenericResponse(data={"id": a.id})

@router.post("/qc/inline", response_model=GenericResponse[Dict[str, Any]])
async def record_inline_qc(
    body: InlineQCCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """3. Операции: Inline QC — межоперационный контроль."""
    svc = ProductionExtendedService(db, current_user)
    qc = await svc.record_inline_qc(**body.model_dump())
    return GenericResponse(data={"id": qc.id, "result": qc.result})

@router.post("/qc/defect-types", response_model=GenericResponse[Dict[str, Any]])
async def register_defect_type(
    body: DefectTypeCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """6. QC: Реестр типов дефектов."""
    svc = ProductionExtendedService(db, current_user)
    rec = await svc.register_defect_type(**body.model_dump())
    return GenericResponse(data={"id": rec.id, "code": rec.code})

@router.get("/qc/defect-types", response_model=GenericResponse[List[Dict[str, Any]]])
async def list_defect_types(
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """6. QC: Список типов дефектов."""
    svc = ProductionExtendedService(db, current_user)
    items = await svc.get_defect_types()
    return GenericResponse(data=(items or [])[:limit])

@router.get("/messages", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_production_messages(
    batch_id: Optional[str] = None,
    sku_id: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Комментарии к партии/SKU: список сообщений."""
    service = ProductionService(db, current_user)
    msgs = await service.get_production_messages(batch_id=batch_id, sku_id=sku_id, limit=limit)
    return GenericResponse(data=msgs)

@router.post("/grn", response_model=GenericResponse[Dict[str, Any]])
async def create_grn(
    body: GRNCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """GRN — приёмка материалов."""
    svc = ProductionExtendedService(db, current_user)
    grn = await svc.create_grn(**body.model_dump())
    return GenericResponse(data={"id": grn.id, "status": grn.status, "variance": grn.variance})

@router.get("/grn", response_model=GenericResponse[List[Dict[str, Any]]])
async def list_grns(
    material_order_id: Optional[int] = None,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Список GRN (приёмки)."""
    svc = ProductionExtendedService(db, current_user)
    items = await svc.get_grns(material_order_id=material_order_id, limit=limit)
    return GenericResponse(data=items)

@router.post("/qc/capa", response_model=GenericResponse[Dict[str, Any]])
async def create_capa(
    body: CAPACreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """CAPA — корректирующее действие по дефекту."""
    svc = ProductionExtendedService(db, current_user)
    capa = await svc.create_capa(**body.model_dump())
    return GenericResponse(data={"id": capa.id, "status": capa.status})

@router.post("/production/batches/{batch_id}/pps", response_model=GenericResponse[Dict[str, Any]])
async def create_pps_sample(
    batch_id: int,
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """7. Pre-shipment sample (PPS)."""
    svc = ProductionExtendedService(db, current_user)
    pps = await svc.create_pps_sample(batch_id, sku_id)
    return GenericResponse(data={"id": pps.id, "stage": pps.stage})
