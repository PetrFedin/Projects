from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime

class FootfallMetricBase(BaseModel):
    store_id: str
    zone_id: str
    visitor_count: int
    dwell_time_avg: float
    heatmap_data: Optional[Dict] = None

class FootfallMetricCreate(FootfallMetricBase):
    pass

class FootfallMetric(FootfallMetricBase):
    id: int
    timestamp: datetime

    model_config = {"from_attributes": True}

class ARNavigationNodeBase(BaseModel):
    store_id: str
    node_id: str
    location_name: str
    coordinates_json: Dict
    beacon_id: Optional[str] = None
    metadata_json: Optional[Dict] = None

class ARNavigationNodeCreate(ARNavigationNodeBase):
    pass

class ARNavigationNode(ARNavigationNodeBase):
    id: int

    model_config = {"from_attributes": True}

class SellThroughBase(BaseModel):
    brand_id: str
    category: str
    sold_qty: int
    stock_initial: int
    sell_through_pct: float

class SellThroughCreate(SellThroughBase):
    pass

class CategorySellThrough(SellThroughBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class ReturnAnalysisBase(BaseModel):
    sku_id: str
    reason_code: str
    quantity: int = 1
    comments: Optional[str] = None

class ReturnAnalysisCreate(ReturnAnalysisBase):
    pass

class ReturnAnalysis(ReturnAnalysisBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class MerchandiseGridBase(BaseModel):
    brand_id: str
    season: str
    total_budget: float
    category_split_json: Dict
    target_units: int

class MerchandiseGridCreate(MerchandiseGridBase):
    pass

class MerchandiseGrid(MerchandiseGridBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class FeedbackBase(BaseModel):
    brand_id: str
    sku_id: Optional[str] = None
    customer_id: str
    rating: int
    comment: Optional[str] = None
    tags_json: Optional[Dict] = None

class FeedbackCreate(FeedbackBase):
    pass

class DemandForecastRequest(BaseModel):
    sku_id: str
    season: str
    media_asset_id: Optional[int] = None

class DemandForecast(BaseModel):
    sku_id: str
    season: str
    predicted_demand: int
    confidence: float
    factors: Dict[str, Any]

class AssortmentIntelligenceRequest(BaseModel):
    brand_id: str
    season: str
    total_budget: float

class AssortmentIntelligenceResponse(BaseModel):
    grid_id: int
    brand_id: str
    season: str
    total_budget: float
    recommendation: Dict[str, Any]
    status: str

class CustomerFeedback(FeedbackBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
