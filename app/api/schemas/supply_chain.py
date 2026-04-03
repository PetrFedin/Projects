from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class SupplierBase(BaseModel):
    name: str
    supplier_type: str
    rating: float = 0.0
    contact_info: Optional[Dict] = None
    is_active: bool = True

class SupplierCreate(SupplierBase):
    pass

class Supplier(SupplierBase):
    id: int
    model_config = {"from_attributes": True}

class MaterialOrderBase(BaseModel):
    supplier_id: int
    material_name: str
    quantity: float
    unit: str
    total_price: float
    currency: str = "USD"
    status: str = "ordered"

class MaterialOrderCreate(MaterialOrderBase):
    pass

class MaterialOrder(MaterialOrderBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class LabDipBase(BaseModel):
    material_order_id: int
    color_name: str
    pantone_code: Optional[str] = None
    status: str = "pending"
    comments: Optional[str] = None

class LabDipCreate(LabDipBase):
    pass

class LabDip(LabDipBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class RFQBase(BaseModel):
    material_name: str
    target_quantity: float
    unit: str
    status: str = "draft"

class RFQCreate(RFQBase):
    pass

class RFQ(RFQBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class RFQVendorQuoteBase(BaseModel):
    rfq_id: int
    vendor_id: str
    price_per_unit: float
    lead_time_days: int
    is_selected: bool = False

class RFQVendorQuoteCreate(RFQVendorQuoteBase):
    pass

class RFQVendorQuote(RFQVendorQuoteBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class TraceBase(BaseModel):
    material_id: str
    origin_country: str
    factory_id: str
    blockchain_hash: Optional[str] = None
    certification_urls_json: Dict

class TraceCreate(TraceBase):
    pass

class RawMaterialTrace(TraceBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class TABase(BaseModel):
    order_id: str
    milestone_name: str
    planned_date: datetime
    status: str = "pending"

class TACreate(TABase):
    pass

class SupplyChainTA(TABase):
    id: int
    actual_date: Optional[datetime] = None
    model_config = {"from_attributes": True}

class BookingBase(BaseModel):
    factory_id: str
    brand_id: str
    month: int
    year: int
    units_reserved: int
    status: str = "confirmed"

class BookingCreate(BookingBase):
    pass

class FactoryCapacityBooking(BookingBase):
    id: int
    model_config = {"from_attributes": True}

class ReservationBase(BaseModel):
    brand_id: str
    material_id: str
    sku_id: str
    reserved_quantity: float
    status: str = "reserved"

class ReservationCreate(ReservationBase):
    pass

class MaterialReservation(ReservationBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
