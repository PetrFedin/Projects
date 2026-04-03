from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import os
import difflib
from app.api import deps
from app.db.repositories.product import (
    ProductRepository, GradingRepository, Asset3DRepository, SampleRepository,
    ConstructionRepository, SwatchRepository, LCARepository, DropRepository, FitCorrectionRepository
)
from app.api.schemas.product import (
    FeatureProposal, FeatureProposalCreate,
    GradingChart, GradingChartCreate,
    Asset3D, Asset3DCreate,
    SampleOrder, SampleOrderCreate,
    ConstructionDetail, ConstructionDetailCreate,
    DigitalSwatch, DigitalSwatchCreate,
    ProductLCA, ProductLCACreate,
    CollectionDrop, CollectionDropCreate,
    FitCorrection, FitCorrectionCreate
)
from app.db.models.base import (
    User,
    FeatureProposal as ProposalModel,
    GradingChart as GradingModel,
    Product3DAsset as AssetModel,
    SampleOrder as SampleModel,
    ConstructionDetail as ConstructionModel,
    DigitalSwatch as SwatchModel,
    ProductLCA as LCAModel,
    CollectionDrop as DropModel,
    FitCorrection as FitModel
)
from app.agents.product_architect_agent import product_architect_agent
from app.agents.roadmap_agent import roadmap_agent

router = APIRouter()

@router.get("/", response_model=List[FeatureProposal])
async def get_proposals(
    limit: int = 100,
    skip: int = 0,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ProductRepository(db, current_user=current_user)
    items = await repo.get_all(skip=skip, limit=limit)
    return items

@router.post("/propose", response_model=FeatureProposal)
async def propose_feature(
    task: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    # 1. Run Agent
    result = await product_architect_agent.run(task)
    
    # 2. Simulate saving proposal
    repo = ProductRepository(db, current_user=current_user)
    
    new_proposal = ProposalModel(
        name="AI Styled Lookbooks",
        category="Marketing",
        problem="High cost of manual styling",
        proposed_solution=result.code_changes or "AI generated stylist engine",
        business_value="Reduce styling costs by 40%",
        priority=1,
        organization_id=current_user.organization_id
    )
    return await repo.create(new_proposal)

@router.post("/update-roadmap")
async def update_roadmap(
    apply: bool = False,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Run roadmap agent. Returns diff. apply=true requires platform_admin."""
    try:
        with open("MASTER_PLAN.md", "r") as f:
            master_plan = f.read()
        with open("TASK_QUEUE.md", "r") as f:
            task_queue = f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Roadmap or Task Queue files not found")

    context = {"master_plan": master_plan, "task_queue": task_queue}
    result = await roadmap_agent.run("Synchronize roadmap with task queue", context=context)
    new_content = (result.code_changes or "").strip()

    diff_lines = list(difflib.unified_diff(
        master_plan.splitlines(keepends=True),
        new_content.splitlines(keepends=True) if new_content else [],
        fromfile="MASTER_PLAN.md",
        tofile="MASTER_PLAN.md",
    ))
    diff_text = "".join(diff_lines) if diff_lines else ""

    if apply and new_content:
        if current_user.role != "platform_admin":
            raise HTTPException(status_code=403, detail="Only platform_admin can apply roadmap changes")
        with open("MASTER_PLAN.md", "w") as f:
            f.write(new_content)

    return {
        "message": "Roadmap update suggested",
        "summary": result.changes_proposed,
        "diff": diff_text,
        "applied": apply and bool(new_content),
    }

@router.get("/grading/{sku_id}", response_model=Optional[GradingChart])
async def get_grading(
    sku_id: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = GradingRepository(db, current_user=current_user)
    return await repo.get_by_sku(sku_id)

@router.post("/grading", response_model=GradingChart)
async def create_grading(
    grading_in: GradingChartCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = GradingRepository(db, current_user=current_user)
    new_grading = GradingModel(**grading_in.model_dump())
    return await repo.create(new_grading)

@router.get("/assets-3d/{sku_id}", response_model=Optional[Asset3D])
async def get_asset_3d(
    sku_id: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = Asset3DRepository(db, current_user=current_user)
    return await repo.get_by_sku(sku_id)

@router.post("/assets-3d", response_model=Asset3D)
async def create_asset_3d(
    asset_in: Asset3DCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = Asset3DRepository(db, current_user=current_user)
    new_asset = AssetModel(**asset_in.model_dump())
    return await repo.create(new_asset)

@router.get("/samples/{sku_id}", response_model=List[SampleOrder])
async def get_samples(
    sku_id: str,
    limit: int = 50, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SampleRepository(db, current_user=current_user)
    items = await repo.get_by_sku(sku_id)
    return items[:limit]

@router.post("/samples", response_model=SampleOrder)
async def create_sample(
    sample_in: SampleOrderCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SampleRepository(db, current_user=current_user)
    new_sample = SampleModel(**sample_in.model_dump())
    return await repo.create(new_sample)

@router.get("/construction/{sku_id}", response_model=Optional[ConstructionDetail])
async def get_construction(
    sku_id: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ConstructionRepository(db, current_user=current_user)
    return await repo.get_by_sku(sku_id)

@router.post("/construction", response_model=ConstructionDetail)
async def create_construction(
    construction_in: ConstructionDetailCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = ConstructionRepository(db, current_user=current_user)
    new_construction = ConstructionModel(**construction_in.model_dump())
    return await repo.create(new_construction)

@router.get("/swatches/{material_name}", response_model=Optional[DigitalSwatch])
async def get_swatch(
    material_name: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SwatchRepository(db, current_user=current_user)
    return await repo.get_by_material(material_name)

@router.post("/swatches", response_model=DigitalSwatch)
async def create_swatch(
    swatch_in: DigitalSwatchCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SwatchRepository(db, current_user=current_user)
    new_swatch = SwatchModel(**swatch_in.model_dump())
    return await repo.create(new_swatch)

@router.get("/lca/{sku_id}", response_model=Optional[ProductLCA])
async def get_product_lca(
    sku_id: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = LCARepository(db, current_user=current_user)
    return await repo.get_by_sku(sku_id)

@router.post("/lca", response_model=ProductLCA)
async def create_product_lca(
    lca_in: ProductLCACreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = LCARepository(db, current_user=current_user)
    new_lca = LCAModel(**lca_in.model_dump())
    return await repo.create(new_lca)

@router.get("/drops/{brand_id}", response_model=List[CollectionDrop])
async def get_collection_drops(
    brand_id: str,
    season: Optional[str] = None,
    limit: int = 100,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = DropRepository(db, current_user=current_user)
    items = await repo.get_by_brand(brand_id, season)
    return items[:limit]

@router.post("/drops", response_model=CollectionDrop)
async def create_collection_drop(
    drop_in: CollectionDropCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = DropRepository(db, current_user=current_user)
    new_drop = DropModel(**drop_in.model_dump())
    return await repo.create(new_drop)

@router.get("/fit-corrections/{sku_id}", response_model=List[FitCorrection])
async def get_fit_corrections(
    sku_id: str,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = FitCorrectionRepository(db, current_user=current_user)
    items = await repo.get_by_sku(sku_id)
    return items[:limit]

@router.post("/fit-corrections", response_model=FitCorrection)
async def create_fit_correction(
    fit_in: FitCorrectionCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = FitCorrectionRepository(db, current_user=current_user)
    new_fit = FitModel(**fit_in.model_dump())
    return await repo.create(new_fit)
