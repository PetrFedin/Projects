"""Facade: single ProductionService interface delegating to domain services."""
from typing import Dict, List, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User
from app.db.repositories.production import TechPackRepository, ProductionExecutionRepository, InventoryRepository

from app.services.production.tech_pack_service import TechPackService
from app.services.production.bom_costing_service import BOMCostingService
from app.services.production.production_execution_service import ProductionExecutionService
from app.services.production.sourcing_rfq_service import SourcingRFQService
from app.services.production.compliance_cert_service import ComplianceCertService
from app.services.ai_rule_engine import AIRuleEngine
from app.services.production.production_messaging_service import ProductionMessagingService
from app.services.production.production_finance_service import ProductionFinanceService


class ProductionService:
    """Facade: preserves the original ProductionService API by delegating to domain services."""

    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.tech_pack_repo = TechPackRepository(db, current_user)
        self.execution_repo = ProductionExecutionRepository(db, current_user)
        self.inventory_repo = InventoryRepository(db, current_user)
        self._tech_pack = TechPackService(db, current_user)
        self._bom_costing = BOMCostingService(db, current_user)
        self._execution = ProductionExecutionService(db, current_user)
        self._sourcing = SourcingRFQService(db, current_user)
        self._compliance = ComplianceCertService(db, current_user)
        self._messaging = ProductionMessagingService(db, current_user)
        self._finance = ProductionFinanceService(db, current_user)

    # --- Tech Pack ---
    async def create_tech_pack_version(self, sku_id: str, data: Dict[str, Any], change_log: str):
        return await self._tech_pack.create_tech_pack_version(sku_id, data, change_log)

    async def compare_versions(self, sku_id: str, v1: str, v2: str) -> Dict[str, Any]:
        return await self._tech_pack.compare_versions(sku_id, v1, v2)

    async def get_sku_production_snapshot(self, sku_id: str) -> Dict[str, Any]:
        return await self._tech_pack.get_sku_production_snapshot(sku_id)

    async def save_tech_pack_details(self, sku_id: str, grading: Optional[Dict], construction: Optional[Dict]):
        return await self._tech_pack.save_tech_pack_details(sku_id, grading, construction)

    async def clone_tech_pack(self, source_sku_id: str, new_sku_id: str, new_collection_id: Optional[str] = None):
        return await self._tech_pack.clone_tech_pack(source_sku_id, new_sku_id, new_collection_id)

    async def get_machine_recipe(self, sku_id: str):
        return await self._tech_pack.get_machine_recipe(sku_id)

    async def get_production_pillars(self, sku_id: str) -> Dict[str, Any]:
        return await self._tech_pack.get_production_pillars(sku_id)

    # --- BOM & Costing ---
    async def create_bom(self, sku_id: str, items: List[Dict[str, Any]]):
        return await self._bom_costing.create_bom(sku_id, items)

    async def upload_document(self, sku_id: str, doc_type: str, title: str, url: str):
        return await self._bom_costing.upload_document(sku_id, doc_type, title, url)

    async def update_sku_costing(self, sku_id: str, data: Dict[str, Any]):
        return await self._bom_costing.update_sku_costing(sku_id, data)

    async def calculate_raw_materials(self, sku_id: str, quantity: int) -> Dict[str, Any]:
        return await self._bom_costing.calculate_raw_materials(sku_id, quantity)

    async def calculate_smv_costing(self, sku_id: str) -> Dict[str, Any]:
        return await self._bom_costing.calculate_smv_costing(sku_id)

    async def link_finance_to_sourcing(self, sku_id: str):
        return await self._bom_costing.link_finance_to_sourcing(sku_id)

    async def get_production_variance_report(self, sku_id: str) -> Dict[str, Any]:
        return await self._bom_costing.get_production_variance_report(sku_id)

    # --- Messaging ---
    async def get_production_messages(self, batch_id=None, sku_id=None, entity_type=None, entity_id=None, limit=50):
        return await self._messaging.get_production_messages(
            batch_id=batch_id, sku_id=sku_id, entity_type=entity_type, entity_id=entity_id, limit=limit
        )

    async def send_production_message(self, text: str, entity_type=None, entity_id=None, sku_id=None, batch_id=None):
        return await self._messaging.send_production_message(
            text=text, entity_type=entity_type, entity_id=entity_id, sku_id=sku_id, batch_id=batch_id
        )

    # --- Compliance ---
    async def register_eac_certificate(self, sku_list: List[str], cert_number: str):
        return await self._compliance.register_eac_certificate(sku_list, cert_number)

    async def order_marking_codes(self, sku_id: str, batch_id: str, quantity: int):
        return await self._compliance.order_marking_codes(sku_id, batch_id, quantity)

    async def register_compliance_certificate(self, data: Dict[str, Any]):
        return await self._compliance.register_compliance_certificate(data)

    async def check_compliance_for_shipping(self, batch_id: int) -> Dict[str, Any]:
        return await self._compliance.check_compliance_for_shipping(batch_id)

    # --- Sourcing & RFQ ---
    async def get_suppliers(self):
        return await self._sourcing.get_suppliers()

    async def create_material_order(self, data: Dict[str, Any]):
        order = await self._sourcing.create_material_order(data)
        rule_engine = AIRuleEngine(self.db, self.current_user)
        await rule_engine.trigger_event("production.material_order_created", {
            "module": "production", "id": order.id, "status": order.status
        })
        return order

    async def create_rfq(self, data: Dict[str, Any], items: List[Dict[str, Any]]):
        return await self._sourcing.create_rfq(data, items)

    async def submit_supplier_offer(self, data: Dict[str, Any]):
        return await self._sourcing.submit_supplier_offer(data)

    async def track_contract_usage(self, contract_id: int, new_order_volume: float):
        return await self._sourcing.track_contract_usage(contract_id, new_order_volume)

    async def get_supplier_scorecard(self, supplier_id: int):
        return await self._sourcing.get_supplier_scorecard(supplier_id)

    async def calculate_supplier_scorecard(
        self, supplier_id: int, start_date: datetime, end_date: datetime
    ):
        return await self._sourcing.calculate_supplier_scorecard(supplier_id, start_date, end_date)

    # --- Finance ---
    async def generate_payment_schedule(
        self, batch_id: Optional[int], material_order_id: Optional[int], milestones: List[Dict[str, Any]]
    ):
        return await self._finance.generate_payment_schedule(
            batch_id, material_order_id, milestones
        )

    async def get_financial_calendar(self, organization_id: str):
        return await self._finance.get_financial_calendar(organization_id)

    async def get_critical_alerts(self, organization_id: str):
        return await self._finance.get_critical_alerts(organization_id)

    async def convert_size(self, source_grid_id: int, target_grid_id: int, size_label: str) -> Optional[str]:
        return await self._finance.convert_size(source_grid_id, target_grid_id, size_label)

    # --- Execution (bulk, samples, operations, stages, inventory, archive) ---
    async def get_bulk_workflow(self, order_id: str) -> Dict[str, Any]:
        return await self._execution.get_bulk_workflow(order_id)

    async def order_sample(self, sku_id: str, factory_id: str, sample_type: str):
        return await self._execution.order_sample(sku_id, factory_id, sample_type)

    async def register_fabric_roll(
        self, material_id: str, roll_number: str, length: float, width: float, factory_id: str
    ):
        return await self._execution.register_fabric_roll(
            material_id, roll_number, length, width, factory_id
        )

    async def update_toll_material_balance(
        self, factory_id: str, material_id: str, quantity: float, action: str = "add"
    ):
        return await self._execution.update_toll_material_balance(
            factory_id, material_id, quantity, action
        )

    async def record_operation_progress(
        self, batch_id: int, operation: str, units: int, defects: int = 0, operator_id: str = None
    ):
        return await self._execution.record_operation_progress(
            batch_id, operation, units, defects, operator_id
        )

    async def request_technical_signoff(self, sku_id: str, stage: str, artifact_url: str = None):
        return await self._execution.request_technical_signoff(sku_id, stage, artifact_url)

    async def execute_signoff(self, signoff_id: int, status: str, comments: str = None):
        return await self._execution.execute_signoff(signoff_id, status, comments)

    async def create_detailed_qc(self, batch_id: int, type: str, defects: Dict, result: str):
        return await self._execution.create_detailed_qc(batch_id, type, defects, result)

    async def get_critical_path(self, order_id: str) -> List[Dict[str, Any]]:
        return await self._execution.get_critical_path(order_id)

    async def add_to_material_master(self, data: Dict[str, Any]):
        return await self._execution.add_to_material_master(data)

    async def finish_production_to_stock(
        self, batch_id: int, color: str, size: str, qty: int, warehouse_id: str
    ):
        return await self._execution.finish_production_to_stock(
            batch_id, color, size, qty, warehouse_id
        )

    async def record_material_consumption(self, batch_id: int, lot_id: int, qty: float):
        return await self._execution.record_material_consumption(batch_id, lot_id, qty)

    async def allocate_stock_to_order(self, order_id: int, stock_id: int, qty: int):
        return await self._execution.allocate_stock_to_order(order_id, stock_id, qty)

    async def calculate_detailed_requirements(self, batch_id: int):
        return await self._execution.calculate_detailed_requirements(batch_id)

    async def reserve_materials_from_lots(
        self, batch_id: int, planning_id: int, lot_reservations: List[Dict[str, Any]]
    ):
        return await self._execution.reserve_materials_from_lots(
            batch_id, planning_id, lot_reservations
        )

    async def update_grading_chart(
        self, sku_id: str, base_size: str, measurements: Dict[str, Any], increments: Optional[Dict] = None
    ):
        return await self._execution.update_grading_chart(
            sku_id, base_size, measurements, increments
        )

    async def get_batch_technical_sheet(self, batch_id: int) -> Dict[str, Any]:
        return await self._execution.get_batch_technical_sheet(batch_id)

    async def propagate_delays(self, order_id: str, delayed_milestone_id: int, delay_days: int):
        return await self._execution.propagate_delays(
            order_id, delayed_milestone_id, delay_days
        )

    async def calculate_aql_sample_size(
        self, lot_size: int, inspection_level: str = "G2", aql_level: float = 2.5
    ) -> Dict[str, Any]:
        return await self._execution.calculate_aql_sample_size(
            lot_size, inspection_level, aql_level
        )

    async def create_production_workflow(self, batch_id: int, template_id: int):
        return await self._execution.create_production_workflow(batch_id, template_id)

    async def assign_stage_responsible(
        self, stage_id: int, staff_id: Optional[str], staff_name: Optional[str], partner_id: Optional[int]
    ):
        return await self._execution.assign_stage_responsible(
            stage_id, staff_id, staff_name, partner_id
        )

    async def update_stage_readiness(
        self, stage_id: int, percent: float, comment: Optional[str], has_questions: bool = False
    ):
        return await self._execution.update_stage_readiness(
            stage_id, percent, comment, has_questions
        )

    async def get_batch_workflow_status(self, batch_id: int) -> List[Dict[str, Any]]:
        return await self._execution.get_batch_workflow_status(batch_id)

    async def get_inventory_snapshot(self) -> Dict[str, Any]:
        return await self._execution.get_inventory_snapshot()

    async def assign_responsible(self, entity_type: str, entity_id: Any, user_id: str):
        return await self._execution.assign_responsible(entity_type, entity_id, user_id)

    async def archive_production_run(self, batch_id: str):
        return await self._execution.archive_production_run(batch_id)

    async def sync_sales_results(
        self, sku_id: str, order_id: str, qty_sold: int, revenue: float, source: str
    ):
        return await self._execution.sync_sales_results(
            sku_id, order_id, qty_sold, revenue, source
        )

    async def generate_production_milestones(
        self, order_id: str, target_delivery_date: datetime
    ):
        return await self._execution.generate_production_milestones(
            order_id, target_delivery_date
        )
