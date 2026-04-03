from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class GiftRegistryItem(BaseModel):
    sku_id: str
    status: str = "pending" # pending, purchased
    purchaser_id: Optional[str] = None

class GiftRegistryBase(BaseModel):
    user_id: str
    title: str
    event_date: Optional[datetime] = None
    items: Optional[List[GiftRegistryItem]] = []
    is_public: bool = True

class GiftRegistryCreate(GiftRegistryBase):
    pass

class GiftRegistry(GiftRegistryBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class PurchaseGiftRequest(BaseModel):
    registry_id: int
    sku_id: str
    purchaser_id: str

class ReplenishmentRequestBase(BaseModel):
    store_id: str
    sku_id: str
    quantity: int
    priority: str = "medium"
    status: str = "pending"

class ReplenishmentRequestCreate(ReplenishmentRequestBase):
    pass

class ReplenishmentRequest(ReplenishmentRequestBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class StaffTrainingBase(BaseModel):
    staff_id: str
    course_name: str
    status: str = "enrolled"
    score: Optional[float] = None

class StaffTrainingCreate(StaffTrainingBase):
    pass

class StaffTraining(StaffTrainingBase):
    id: int
    completed_at: Optional[datetime] = None
    model_config = {"from_attributes": True}

class StoreExpenseBase(BaseModel):
    store_id: str
    expense_type: str
    amount: float
    currency: str = "USD"
    period_month: int
    period_year: int

class StoreExpenseCreate(StoreExpenseBase):
    pass

class StoreExpense(StoreExpenseBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class InventorySyncLogBase(BaseModel):
    external_system: str
    sync_type: str
    items_synced_count: int
    status: str
    error_message: Optional[str] = None

class InventorySyncLogCreate(InventorySyncLogBase):
    pass

class InventorySyncLog(InventorySyncLogBase):
    id: int
    timestamp: datetime
    model_config = {"from_attributes": True}

class StaffShiftBase(BaseModel):
    staff_id: str
    store_id: str
    start_time: datetime
    end_time: datetime
    status: str = "scheduled"

class StaffShiftCreate(StaffShiftBase):
    pass

class StaffShift(StaffShiftBase):
    id: int
    model_config = {"from_attributes": True}

class RepairRequestBase(BaseModel):
    customer_id: str
    sku_id: str
    description: str
    status: str = "submitted"
    repair_cost: float = 0.0

class RepairRequestCreate(RepairRequestBase):
    pass

class RepairRequest(RepairRequestBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class BookingBase(BaseModel):
    customer_id: str
    store_id: str
    booking_time: datetime
    sku_ids_json: Dict # Items to prepare
    status: str = "confirmed"

class BookingCreate(BookingBase):
    pass

class FittingRoomBooking(BookingBase):
    id: int
    model_config = {"from_attributes": True}

class POSItem(BaseModel):
    sku_id: str
    qty: int
    price: float

class POSTransactionCreate(BaseModel):
    store_id: str
    staff_id: str
    customer_id: Optional[str] = None
    items: List[POSItem]
    payment_method: str = "card"

class InventoryUpdate(BaseModel):
    store_id: str
    sku_id: str
    quantity: int

class ClientelingCreate(BaseModel):
    staff_id: str
    customer_id: str
    interaction_type: str
    notes: Optional[str] = None
    recommended_skus: Optional[List[str]] = None
