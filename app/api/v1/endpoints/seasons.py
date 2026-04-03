from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Optional, Dict
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.core.datetime_util import utc_now
from app.services.season_service import SeasonService

router = APIRouter()

class SeasonBase(BaseModel):
    name: str # FW26, SS25, Resort27
    start_date: datetime
    end_date: datetime
    brand_id: str
    status: str = "active" # planning, active, closed

class SeasonCreate(SeasonBase):
    pass

class Season(SeasonBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

@router.get("/", response_model=GenericResponse[List[Season]])
async def get_seasons(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    # Mock data for demonstration
    mock_seasons = [
        Season(
            id="S-26FW",
            name="Fall/Winter 2026",
            start_date=datetime(2026, 9, 1),
            end_date=datetime(2027, 2, 28),
            brand_id="B-001",
            status="planning",
            created_at=utc_now(),
            updated_at=utc_now()
        ),
        Season(
            id="S-25SS",
            name="Spring/Summer 2025",
            start_date=datetime(2025, 3, 1),
            end_date=datetime(2025, 8, 31),
            brand_id="B-001",
            status="active",
            created_at=utc_now() - timedelta(days=180),
            updated_at=utc_now() - timedelta(days=180)
        )
    ]
    return GenericResponse(data=mock_seasons)

@router.post("/", response_model=GenericResponse[Season])
async def create_season(
    season_in: SeasonCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Creates a new season and automatically generates a standard industry timeline.
    """
    new_season = Season(
        id=f"S-{season_in.name.replace('/', '').replace(' ', '')}",
        name=season_in.name,
        start_date=season_in.start_date,
        end_date=season_in.end_date,
        brand_id=season_in.brand_id,
        status="planning",
        created_at=utc_now(),
        updated_at=utc_now()
    )
    
    # 1. Initialize Season Workflow Service
    service = SeasonService(db)
    
    # 2. Generate Default Timeline Milestones
    milestones = await service.generate_default_timeline(new_season.id, new_season.start_date)
    
    # 3. Create Tasks for each Milestone
    await service.create_season_tasks(new_season.id, milestones, current_user.organization_id)
    
    return GenericResponse(data=new_season)

@router.get("/{season_id}/timeline", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_season_timeline(
    season_id: str,
    start_date: Optional[datetime] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Returns the automated GANTT/milestones for a specific season.
    """
    service = SeasonService(db)
    # Using current date if not provided for mock
    ref_date = start_date or utc_now()
    timeline = await service.generate_default_timeline(season_id, ref_date)
    return GenericResponse(data=timeline)
