from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.db.session import get_db
from app.db.repositories.creative import CreativeRepository, DNARepository, ConsultationRepository, AIAssetRepository, VirtualShowRepository, AIStudioRepository
from app.api.schemas.creative import (
    Lookbook, LookbookCreate, GenerateLookbookRequest,
    StyleDNA, StyleDNACreate,
    VideoConsultation, ConsultationCreate,
    AIModelAsset, AIAssetCreate,
    VirtualShowEvent, VirtualShowCreate,
    AIStudioAsset, AIStudioAssetCreate
)
from app.agents.creative_agents import lookbook_agent
from app.db.models.base import (
    Lookbook as LookbookModel,
    StyleDNA as DNAModel,
    VideoConsultation as ConsultationModel,
    AIModelAsset as AIAssetModel,
    VirtualShowEvent as ShowModel,
    AIStudioAsset as AIStudioModel
)

router = APIRouter()

@router.get("/", response_model=List[Lookbook])
async def get_published_lookbooks(
    brand_id: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    repo = CreativeRepository(db)
    items = await repo.get_published(brand_id)
    return items[:limit]

@router.post("/generate", response_model=Lookbook)
async def generate_lookbook(req: GenerateLookbookRequest, db: AsyncSession = Depends(get_db)):
    # 1. Run Lookbook Agent
    context = {
        "skus": req.skus,
        "season": req.season,
        "style_context": req.style_context
    }
    result = await lookbook_agent.run(req.brand_id, context=context)
    
    # 2. Save lookbook
    repo = CreativeRepository(db)
    new_lb = LookbookModel(
        brand_id=req.brand_id,
        title=f"{req.season} Collection",
        season=req.season,
        items_json={"skus": req.skus},
        ai_story=result.code_changes,
        is_published=False
    )
    return await repo.create(new_lb)

@router.patch("/{lookbook_id}/publish")
async def publish_lookbook(lookbook_id: int, db: AsyncSession = Depends(get_db)):
    repo = CreativeRepository(db)
    lb = await repo.get(lookbook_id)
    if not lb:
        raise HTTPException(status_code=404, detail="Lookbook not found")
    
    await repo.update(lb.id, is_published=True)
    return {"message": "Lookbook published successfully"}

@router.get("/dna/{customer_id}", response_model=Optional[StyleDNA])
async def get_style_dna(customer_id: str, db: AsyncSession = Depends(get_db)):
    repo = DNARepository(db)
    return await repo.get_by_customer(customer_id)

@router.post("/dna", response_model=StyleDNA)
async def create_style_dna(dna_in: StyleDNACreate, db: AsyncSession = Depends(get_db)):
    repo = DNARepository(db)
    new_dna = DNAModel(**dna_in.model_dump())
    return await repo.create(new_dna)

@router.get("/consultations/customer/{customer_id}", response_model=List[VideoConsultation])
async def get_customer_consultations(
    customer_id: str,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    repo = ConsultationRepository(db)
    items = await repo.get_by_customer(customer_id)
    return items[:limit]

@router.post("/consultations", response_model=VideoConsultation)
async def schedule_consultation(cons_in: ConsultationCreate, db: AsyncSession = Depends(get_db)):
    repo = ConsultationRepository(db)
    new_cons = ConsultationModel(**cons_in.model_dump())
    return await repo.create(new_cons)

@router.get("/ai-assets/{lookbook_id}", response_model=List[AIModelAsset])
async def get_lookbook_assets(
    lookbook_id: int,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    repo = AIAssetRepository(db)
    items = await repo.get_by_lookbook(lookbook_id)
    return items[:limit]

@router.post("/ai-assets", response_model=AIModelAsset)
async def create_ai_asset(asset_in: AIAssetCreate, db: AsyncSession = Depends(get_db)):
    repo = AIAssetRepository(db)
    new_asset = AIAssetModel(**asset_in.model_dump())
    return await repo.create(new_asset)

@router.get("/virtual-shows", response_model=List[VirtualShowEvent])
async def get_upcoming_shows(
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    repo = VirtualShowRepository(db)
    items = await repo.get_upcoming()
    return items[:limit]

@router.post("/virtual-shows", response_model=VirtualShowEvent)
async def create_virtual_show(show_in: VirtualShowCreate, db: AsyncSession = Depends(get_db)):
    repo = VirtualShowRepository(db)
    new_show = ShowModel(**show_in.model_dump())
    return await repo.create(new_show)

@router.get("/ai-studio/{brand_id}", response_model=List[AIStudioAsset])
async def get_studio_assets(
    brand_id: str,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    repo = AIStudioRepository(db)
    items = await repo.get_by_brand(brand_id)
    return items[:limit]

@router.post("/ai-studio", response_model=AIStudioAsset)
async def request_studio_task(asset_in: AIStudioAssetCreate, db: AsyncSession = Depends(get_db)):
    repo = AIStudioRepository(db)
    new_asset = AIStudioModel(**asset_in.model_dump())
    return await repo.create(new_asset)
