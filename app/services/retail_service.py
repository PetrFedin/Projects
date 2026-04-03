from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.retail import (
    StoreInventoryRepository, POSRepository, ClientelingRepository,
    ReplenishmentRepository, ShiftRepository, RepairRepository, BookingRepository
)
from app.db.models.base import (
    User, StoreInventory, POSTransaction, CustomerClienteling,
    ReplenishmentRequest, StaffShift, RepairRequest, FittingRoomBooking
)
from app.api.schemas.retail import (
    POSTransactionCreate, InventoryUpdate, ClientelingCreate,
    ReplenishmentRequestCreate, StaffShiftCreate, RepairRequestCreate, BookingCreate
)
from app.services.ai_rule_engine import AIRuleEngine
from app.core.datetime_util import utc_now

class RetailService:
    """
    Service for Store OS: POS, Inventory Management, and Clienteling.
    Vertical link: Shop Profile hub.
    Horizontal link: Connected to AI Rule Engine for restocking and staff performance.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.inventory_repo = StoreInventoryRepository(db, current_user=current_user)
        self.pos_repo = POSRepository(db, current_user=current_user)
        self.clienteling_repo = ClientelingRepository(db, current_user=current_user)
        self.replenishment_repo = ReplenishmentRepository(db, current_user=current_user)
        self.shift_repo = ShiftRepository(db, current_user=current_user)
        self.repair_repo = RepairRepository(db, current_user=current_user)
        self.booking_repo = BookingRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- POS & Sales ---
    async def process_pos_transaction(self, data: POSTransactionCreate) -> POSTransaction:
        total = sum(item.price * item.qty for item in data.items)
        items_dict = {"items": [item.model_dump() for item in data.items]}
        
        new_tx = POSTransaction(
            store_id=data.store_id,
            staff_id=data.staff_id,
            customer_id=data.customer_id,
            items_json=items_dict,
            total_amount=total,
            payment_method=data.payment_method,
            status="completed",
            created_at=utc_now()
        )
        tx = await self.pos_repo.create(new_tx)
        
        # Horizontal Integration: Update loyalty and store metrics
        await self.rule_engine.trigger_event("retail.transaction_completed", {
            "module": "retail",
            "id": tx.id,
            "total": total,
            "customer_id": data.customer_id,
            "store_id": data.store_id
        })
        
        return tx

    # --- Inventory Management ---
    async def update_stock(self, data: InventoryUpdate) -> StoreInventory:
        # Simple upsert logic
        all_stock = await self.inventory_repo.get_store_stock(data.store_id)
        existing = next((s for s in all_stock if s.sku_id == data.sku_id), None)
        
        if existing:
            existing.quantity = data.quantity
            existing.last_sync = utc_now()
            await self.db.commit()
            await self.db.refresh(existing)
            return existing
        else:
            new_stock = StoreInventory(
                store_id=data.store_id,
                sku_id=data.sku_id,
                quantity=data.quantity,
                last_sync=utc_now()
            )
            return await self.inventory_repo.create(new_stock)

    # --- Clienteling ---
    async def add_interaction(self, data: ClientelingCreate) -> CustomerClienteling:
        new_rec = CustomerClienteling(
            staff_id=data.staff_id,
            customer_id=data.customer_id,
            interaction_type=data.interaction_type,
            notes=data.notes,
            recommended_skus_json={"skus": data.recommended_skus} if data.recommended_skus else None,
            created_at=utc_now()
        )
        rec = await self.clienteling_repo.create(new_rec)
        
        # Horizontal Integration: Notify stylist about customer visit
        await self.rule_engine.trigger_event("retail.client_interaction", {
            "module": "retail",
            "customer_id": data.customer_id,
            "staff_id": data.staff_id
        })
        return rec
