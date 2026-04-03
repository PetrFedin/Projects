from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Dict
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.registry_service import SystemRegistryService

router = APIRouter()

@router.get("/me", response_model=GenericResponse[dict])
async def get_my_profile(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    Returns user profile with role-specific navigation matching the frontend routes.
    Uses SystemRegistryService as the source of truth.
    """
    registry = SystemRegistryService()
    
    profile = {
        "user": {
            "email": current_user.email,
            "role": current_user.role,
            "organization_id": current_user.organization_id,
            "full_name": current_user.full_name
        },
        "navigation": registry.get_role_nav(current_user.role),
        "permissions": registry.get_section_access(current_user.role)
    }

    # Add status-specific badges/alerts
    profile["alerts"] = [
        {"type": "info", "message": "SS26 Collection is now live in Showroom"}
    ]

    return GenericResponse(data=profile)
