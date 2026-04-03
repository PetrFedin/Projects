from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from datetime import datetime

class B2BDiscountBase(BaseModel):
    tier_name: str
    min_volume: int
    discount_percentage: float

class B2BDiscountCreate(B2BDiscountBase):
    pass

class B2BDiscount(B2BDiscountBase):
    id: int
    model_config = {"from_attributes": True}

class MOQSettingBase(BaseModel):
    sku_id: str
    min_units: int = 1
    min_amount: float = 0.0
    currency: str = "USD"
    country_code: Optional[str] = None

class MOQSettingCreate(MOQSettingBase):
    pass

class MOQSetting(MOQSettingBase):
    id: int
    model_config = {"from_attributes": True}

class CreditLimitBase(BaseModel):
    partner_id: str
    total_limit: float = 0.0
    used_amount: float = 0.0
    currency: str = "USD"
    is_active: bool = True
    payment_terms_days: int = 30  # Net 30/60/90

class CreditLimitCreate(CreditLimitBase):
    pass

class CreditLimit(CreditLimitBase):
    id: int
    model_config = {"from_attributes": True}

class SeasonalCreditBase(BaseModel):
    partner_id: str
    season: str
    credit_amount: float = 0.0
    expiry_date: datetime

class SeasonalCreditCreate(SeasonalCreditBase):
    pass

class SeasonalCredit(SeasonalCreditBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class WholesaleMessageBase(BaseModel):
    sender_id: str
    receiver_id: str
    order_id: Optional[str] = None
    message_text: str

class WholesaleMessageCreate(WholesaleMessageBase):
    pass

class WholesaleMessage(WholesaleMessageBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class OrderLogBase(BaseModel):
    order_id: str
    action: str
    details_json: Dict
    user_id: str

class OrderLogCreate(OrderLogBase):
    pass

class OrderLog(OrderLogBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class CreditMemoBase(BaseModel):
    partner_id: str
    amount: float
    reason: str
    status: str = "issued"

class CreditMemoCreate(CreditMemoBase):
    pass

class CreditMemo(CreditMemoBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class BNPLBase(BaseModel):
    partner_id: str
    order_id: str
    amount: float
    terms_days: int
    due_date: datetime
    status: str = "active"

class BNPLCreate(BNPLBase):
    pass

class WholesaleBNPL(BNPLBase):
    id: int
    model_config = {"from_attributes": True}

class ExclusivityBase(BaseModel):
    partner_id: str
    region: str
    exclusive_categories_json: List[str]

class ExclusivityCreate(ExclusivityBase):
    pass

class DealerExclusivity(ExclusivityBase):
    id: int
    model_config = {"from_attributes": True}

class LinesheetItemBase(BaseModel):
    product_name: str
    sku: str
    color: Optional[str] = None
    size_range: Optional[str] = None
    wholesale_price: float = 0.0
    moq: int = 1

class LinesheetItemCreate(LinesheetItemBase):
    pass

class LinesheetItem(LinesheetItemBase):
    id: int
    linesheet_id: int
    model_config = {"from_attributes": True}

class QuoteBase(BaseModel):
    buyer_id: str
    items_json: dict  # [{sku_id, quantity, unit_price}]
    total_amount: float = 0.0
    currency: str = "USD"
    expires_at: Optional[datetime] = None
    note: Optional[str] = None

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(BaseModel):
    status: Optional[str] = None
    items_json: Optional[dict] = None
    expires_at: Optional[datetime] = None
    note: Optional[str] = None

class Quote(QuoteBase):
    id: int
    organization_id: str
    quote_number: str
    status: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class LinesheetBase(BaseModel):
    title: str
    season: str
    status: str = "draft"
    sku_list_json: Union[List, Dict] = []  # DB stores {"skus": [...]}
    organization_id: Optional[str] = None
    note: Optional[str] = None
    metadata_json: Optional[Dict] = None

class LinesheetCreate(LinesheetBase):
    pass

class Linesheet(LinesheetBase):
    id: int
    pdf_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[LinesheetItem] = []
    model_config = {"from_attributes": True}

class ShowroomSelectionItem(BaseModel):
    sku_id: str
    quantity: int
    unit_price: float

class DraftOrderFromSelection(BaseModel):
    showroom_id: Optional[int] = None
    linesheet_id: Optional[int] = None
    buyer_id: str
    items: List[ShowroomSelectionItem]
    metadata_json: Optional[Dict] = None

# --- Assortments (NuOrder) ---
class AssortmentBase(BaseModel):
    collection_id: str
    name: str
    retailer_ids: List[str] = []
    sku_list_json: List[Dict] = []  # [{sku_id, recommended_sizes: ["S","M","L"]}]
    status: str = "draft"

class AssortmentCreate(AssortmentBase):
    pass

class AssortmentUpdate(BaseModel):
    name: Optional[str] = None
    retailer_ids: Optional[List[str]] = None
    sku_list_json: Optional[List[Dict]] = None
    status: Optional[str] = None

class Assortment(AssortmentBase):
    id: int
    organization_id: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

    @classmethod
    def model_validate(cls, obj, **kwargs):
        if hasattr(obj, "__dict__"):  # ORM object
            d = {k: getattr(obj, k) for k in ("id", "organization_id", "collection_id", "name", "status", "created_at", "updated_at") if hasattr(obj, k)}
            rid = getattr(obj, "retailer_ids", None) or []
            d["retailer_ids"] = rid.get("ids", rid) if isinstance(rid, dict) else rid
            sku = getattr(obj, "sku_list_json", None) or []
            d["sku_list_json"] = sku.get("items", sku) if isinstance(sku, dict) else sku
            return super().model_validate(d, **kwargs)
        return super().model_validate(obj, **kwargs)
