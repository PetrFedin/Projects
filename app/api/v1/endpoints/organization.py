from typing import Any, Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.api.schemas.base import GenericResponse
from app.services.organization_health_service import get_organization_health_metrics

router = APIRouter()


@router.get("/health/{brand_id}", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_organization_health(
    brand_id: str,
    db: AsyncSession = Depends(deps.get_db),
) -> GenericResponse[List[Dict[str, Any]]]:
    """
    Индекс здоровья организации (brand hub).

    Агрегирует те же источники, что виджеты хаба: профиль и дашборд из БД (где есть модели),
    интеграции через fetch_integrations_status_data (может дергать health-check провайдеров).

    Ответ: GenericResponse.data — массив метрик в формате HealthMetric на фронте
    (`useOrganizationHealth`: если массив непустой — используется как источник правды).
    """
    metrics = await get_organization_health_metrics(brand_id, db)
    return GenericResponse(data=metrics)
