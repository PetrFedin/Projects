from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class BOPISOrderBase(BaseModel):
    order_id: str
    customer_id: str
    store_id: str
    status: str = "pending"
    items: Dict[str, int] # SKU -> quantity
    pickup_code: str

class BOPISOrderCreate(BOPISOrderBase):
    pass

class BOPISOrderUpdate(BaseModel):
    status: Optional[str] = None

class BOPISOrder(BOPISOrderBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class PickupRequest(BaseModel):
    pickup_code: str
    store_id: str

class BottleneckBase(BaseModel):
    location_id: str
    severity: str
    impact_description: str
    delay_days_est: int = 0
    is_active: bool = True

class BottleneckCreate(BottleneckBase):
    pass

class Bottleneck(BottleneckBase):
    id: int
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

class PackingListBase(BaseModel):
    order_id: str
    box_number: str
    items_json: Dict # List of {sku_id, quantity}
    total_weight_kg: float = 0.0
    volumetric_weight: float = 0.0
    status: str = "draft"

class PackingListCreate(PackingListBase):
    pass

class PackingList(PackingListBase):
    id: int
    model_config = {"from_attributes": True}

class LabelDataBase(BaseModel):
    sku_id: str
    barcode_ean13: str
    care_instructions: str
    composition: str
    size_label: str

class LabelDataCreate(LabelDataBase):
    pass

class LabelData(LabelDataBase):
    id: int
    model_config = {"from_attributes": True}

class CustomsDeclarationBase(BaseModel):
    order_id: str
    declaration_number: str
    hs_codes_json: Dict
    total_duties_usd: float = 0.0
    status: str = "draft"

class CustomsDeclarationCreate(CustomsDeclarationBase):
    pass

class CustomsDeclaration(CustomsDeclarationBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class EACCertificateBase(BaseModel):
    certificate_number: str
    sku_ids_json: List[str]
    expiry_date: datetime
    certification_body: str
    file_url: Optional[str] = None

class EACCertificateCreate(EACCertificateBase):
    pass

class EACCertificate(EACCertificateBase):
    id: int
    model_config = {"from_attributes": True}

class ComplianceLogBase(BaseModel):
    partner_id: str
    action: str
    result: str
    details_json: Dict

class ComplianceLogCreate(ComplianceLogBase):
    pass

class TradeComplianceLog(ComplianceLogBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
