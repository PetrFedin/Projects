from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.api import deps
from app.db.repositories.analytics import AnalyticsRepository, ARRepository, SellThroughRepository, ReturnAnalysisRepository, MerchandiseRepository, FeedbackRepository
from app.api.schemas.analytics import (
    FootfallMetric, FootfallMetricCreate, ARNavigationNode, ARNavigationNodeCreate,
    CategorySellThrough, SellThroughCreate, ReturnAnalysis, ReturnAnalysisCreate,
    MerchandiseGrid, MerchandiseGridCreate, CustomerFeedback, FeedbackCreate,
    DemandForecast, DemandForecastRequest, AssortmentIntelligenceRequest, AssortmentIntelligenceResponse
)
from app.db.models.base import (
    FootfallMetric as FootfallModel, 
    ARNavigationNode as ARModel,
    CategorySellThrough as SellThroughModel,
    ReturnAnalysis as ReturnModel,
    MerchandiseGrid as MerchandiseModel,
    CustomerFeedback as FeedbackModel,
    MediaAsset as AssetModel
)
from app.ai.modules import DemandForecastingEngine
from app.services.assortment_service import AssortmentIntelligenceService
from app.db.repositories.base import BaseRepository

class MediaRepository(BaseRepository[AssetModel]):
    def __init__(self, session: AsyncSession, current_user: Optional[deps.User] = None):
        super().__init__(AssetModel, session, current_user)

router = APIRouter()

@router.post("/demand-forecast", response_model=DemandForecast)
async def get_demand_forecast(
    req: DemandForecastRequest,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    # 1. Get visual analytics context from DAM if asset_id provided
    visual_trend_score = 1.0
    if req.media_asset_id:
        repo = MediaRepository(db, current_user=current_user)
        asset = await repo.get(req.media_asset_id)
        if asset and asset.metadata_json:
            # Simulate getting trend score from DAM metadata
            visual_trend_score = asset.metadata_json.get("trend_score", 1.0)
    
    # 2. Run AI Engine
    engine = DemandForecastingEngine()
    result = await engine.predict(
        sku_id=req.sku_id, 
        season=req.season, 
        visual_trend_score=visual_trend_score
    )
    
    return result

@router.get("/footfall", response_model=List[FootfallMetric])
async def get_all_footfall(
    limit: int = 100,
    skip: int = 0,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = AnalyticsRepository(db, current_user=current_user)
    items = await repo.get_all(skip=skip, limit=limit)
    return items

@router.post("/footfall", response_model=FootfallMetric)
async def submit_footfall(
    metric_in: FootfallMetricCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = AnalyticsRepository(db, current_user=current_user)
    new_metric = FootfallModel(**metric_in.model_dump())
    return await repo.create(new_metric)

@router.get("/footfall/store/{store_id}", response_model=List[FootfallMetric])
async def get_store_footfall(
    store_id: str,
    limit: int = 100,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = AnalyticsRepository(db, current_user=current_user)
    items = await repo.get_by_store(store_id)
    return items[:limit]

@router.get("/ar/nodes/{store_id}", response_model=List[ARNavigationNode])
async def get_ar_nodes(
    store_id: str,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ARRepository(db, current_user=current_user)
    nodes = await repo.get_store_nodes(store_id)
    return nodes[:limit]

@router.post("/ar/nodes", response_model=ARNavigationNode)
async def add_ar_node(
    node_in: ARNavigationNodeCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ARRepository(db, current_user=current_user)
    existing = await repo.get_node_by_id(node_in.store_id, node_in.node_id)
    if existing:
        raise HTTPException(status_code=400, detail="Node ID already exists for this store")
    new_node = ARModel(**node_in.model_dump())
    return await repo.create(new_node)

@router.get("/sell-through/{brand_id}", response_model=List[CategorySellThrough])
async def get_brand_sell_through(
    brand_id: str,
    limit: int = 100,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SellThroughRepository(db, current_user=current_user)
    items = await repo.get_by_brand(brand_id)
    return items[:limit]

@router.post("/sell-through", response_model=CategorySellThrough)
async def submit_sell_through(
    st_in: SellThroughCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SellThroughRepository(db, current_user=current_user)
    new_st = SellThroughModel(**st_in.model_dump())
    return await repo.create(new_st)

@router.get("/returns/{sku_id}", response_model=List[ReturnAnalysis])
async def get_sku_returns(
    sku_id: str,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ReturnAnalysisRepository(db, current_user=current_user)
    items = await repo.get_by_sku(sku_id)
    return items[:limit]

@router.post("/returns", response_model=ReturnAnalysis)
async def report_return(
    ret_in: ReturnAnalysisCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ReturnAnalysisRepository(db, current_user=current_user)
    new_ret = ReturnModel(**ret_in.model_dump())
    return await repo.create(new_ret)

@router.get("/merchandise/{brand_id}", response_model=List[MerchandiseGrid])
async def get_merchandise_grids(
    brand_id: str,
    season: Optional[str] = None,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = MerchandiseRepository(db, current_user=current_user)
    items = await repo.get_by_brand(brand_id, season)
    return items[:limit]

@router.post("/merchandise", response_model=MerchandiseGrid)
async def create_merchandise_grid(
    grid_in: MerchandiseGridCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = MerchandiseRepository(db, current_user=current_user)
    new_grid = MerchandiseModel(**grid_in.model_dump())
    return await repo.create(new_grid)

@router.get("/feedback/{brand_id}", response_model=List[CustomerFeedback])
async def get_brand_feedback(
    brand_id: str,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = FeedbackRepository(db, current_user=current_user)
    items = await repo.get_by_brand(brand_id)
    return items[:limit]

@router.post("/feedback", response_model=CustomerFeedback)
async def submit_feedback(
    feedback_in: FeedbackCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = FeedbackRepository(db, current_user=current_user)
    new_feedback = FeedbackModel(**feedback_in.model_dump())
    return await repo.create(new_feedback)

@router.get("/nps/{brand_id}")
async def get_nps(
    brand_id: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = FeedbackRepository(db, current_user=current_user)
    score = await repo.get_nps_score(brand_id)
    return {"brand_id": brand_id, "nps_score": score}

@router.post("/ai-assortment", response_model=AssortmentIntelligenceResponse)
async def generate_ai_assortment(
    req: AssortmentIntelligenceRequest,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Triggers AI Assortment Intelligence to generate an optimal merchandise grid.
    Links production costing and demand analytics.
    """
    service = AssortmentIntelligenceService(db, current_user=current_user)
    result = await service.generate_recommendation(
        brand_id=req.brand_id,
        budget=req.total_budget,
        season=req.season
    )
    return result
