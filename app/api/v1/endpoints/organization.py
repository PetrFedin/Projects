from typing import Any, Dict, List

from fastapi import APIRouter

from app.api.schemas.base import GenericResponse
from app.services.organization_health_service import get_organization_health_metrics

router = APIRouter()


@router.get("/health/{brand_id}", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_organization_health(brand_id: str) -> GenericResponse[List[Dict[str, Any]]]:
    """
    Health metrics for an organization (brand). Aggregates from profile, dashboard, integrations.
    Public so dashboard works before login.
    """
    metrics = await get_organization_health_metrics(brand_id)
    return GenericResponse(data=metrics)
