from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.api.schemas.base import GenericResponse
from app.services.organization_health_service import get_organization_health_bundle

router = APIRouter()


@router.get("/health/{brand_id}", response_model=GenericResponse[Dict[str, Any]])
async def get_organization_health(
    brand_id: str,
    db: AsyncSession = Depends(deps.get_db),
) -> GenericResponse[Dict[str, Any]]:
    """
    Индекс здоровья организации (brand hub).

    Агрегирует те же источники, что виджеты хаба: профиль и дашборд из БД (где есть модели),
    интеграции через fetch_integrations_status_data (может дергать health-check провайдеров).

    Ответ: GenericResponse.data — объект с ключами ``metrics`` (массив HealthMetric), ``profile``,
    ``dashboard``, ``integrations`` — один запрос вместо параллельных GET profile/dashboard/integrations + health.
    """
    bundle = await get_organization_health_bundle(brand_id, db)
    return GenericResponse(data=bundle)
