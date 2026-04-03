from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class CompetitorSignalBase(BaseModel):
    organization_id: Optional[str] = None
    competitor_name: str
    feature_name: str
    signal_type: str
    description: str
    url: Optional[str] = None
    priority: int = 1
    metadata_json: Optional[Dict] = None

class CompetitorSignalCreate(CompetitorSignalBase):
    pass

class CompetitorSignal(CompetitorSignalBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class FeatureProposalBase(BaseModel):
    name: str
    category: str
    problem: str
    proposed_solution: str
    business_value: str
    priority: int = 1
    organization_id: Optional[str] = None
    metadata_json: Optional[Dict] = None

class FeatureProposalCreate(FeatureProposalBase):
    pass

class FeatureProposal(FeatureProposalBase):
    id: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}

class GradingChartBase(BaseModel):
    sku_id: str
    base_size: str
    increments_json: Dict

class GradingChartCreate(GradingChartBase):
    pass

class GradingChart(GradingChartBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class Asset3DBase(BaseModel):
    sku_id: str
    clo3d_url: Optional[str] = None
    viewer_config_json: Optional[Dict] = None
    file_format: str = "glb"

class Asset3DCreate(Asset3DBase):
    pass

class Asset3D(Asset3DBase):
    id: int
    model_config = {"from_attributes": True}

class SampleOrderBase(BaseModel):
    sku_id: str
    factory_id: str
    sample_type: str
    status: str = "ordered"
    comments_json: Optional[Dict] = None

class SampleOrderCreate(SampleOrderBase):
    pass

class SampleOrder(SampleOrderBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class ConstructionDetailBase(BaseModel):
    sku_id: str
    seam_schemes_json: Optional[Dict] = None
    finishing_description: Optional[str] = None

class ConstructionDetailCreate(ConstructionDetailBase):
    pass

class ConstructionDetail(ConstructionDetailBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class DigitalSwatchBase(BaseModel):
    material_name: str
    pantone_code: Optional[str] = None
    texture_url: Optional[str] = None
    hex_color: Optional[str] = None
    metadata_json: Optional[Dict] = None

class DigitalSwatchCreate(DigitalSwatchBase):
    pass

class DigitalSwatch(DigitalSwatchBase):
    id: int
    model_config = {"from_attributes": True}

class ProductLCABase(BaseModel):
    sku_id: str
    carbon_footprint_kg: float = 0.0
    water_usage_liters: float = 0.0
    recycle_info_json: Dict
    sustainability_score: float = 0.0

class ProductLCACreate(ProductLCABase):
    pass

class ProductLCA(ProductLCABase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class CollectionDropBase(BaseModel):
    brand_id: str
    season: str
    drop_name: str
    scheduled_date: datetime
    sku_list_json: Dict
    status: str = "planned"

class CollectionDropCreate(CollectionDropBase):
    pass

class CollectionDrop(CollectionDropBase):
    id: int
    model_config = {"from_attributes": True}

class FitCorrectionBase(BaseModel):
    sku_id: str
    photo_url: str
    pencil_marks_json: Optional[Dict] = None
    voice_note_url: Optional[str] = None
    comments: Optional[str] = None

class FitCorrectionCreate(FitCorrectionBase):
    pass

class FitCorrection(FitCorrectionBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
