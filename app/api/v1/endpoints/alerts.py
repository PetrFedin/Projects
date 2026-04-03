from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Dict, Optional
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.alert_service import AlertService
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

router = APIRouter()

class AlertSchema(BaseModel):
    id: int
    category: str
    alert_type: str
    severity: str
    title: str
    description: str
    context_type: Optional[str]
    context_id: Optional[str]
    status: str
    created_at: datetime
    model_config = {"from_attributes": True}

@router.get("/", response_model=GenericResponse[List[AlertSchema]])
async def get_alerts(
    category: Optional[str] = None,
    status: Optional[str] = "open",
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """status: open|resolved|all. limit: max alerts."""
    service = AlertService(db, current_user)
    alerts = await service.get_active_alerts(category, status, limit)
    return GenericResponse(data=alerts)

@router.post("/{alert_id}/resolve", response_model=GenericResponse[dict])
async def resolve_alert(
    alert_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = AlertService(db, current_user)
    await service.resolve_alert(alert_id)
    return GenericResponse(data={"status": "resolved"})

class ContentExpiryCheck(BaseModel):
    lookbooks: Optional[List[Dict]] = None
    certificates: Optional[List[Dict]] = None

@router.post("/content-expiry-check", response_model=GenericResponse[List[AlertSchema]])
async def check_content_expiry(
    body: ContentExpiryCheck,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Content Expiry Alerts (Fashion Cloud): check lookbooks/certificates, create alerts."""
    service = AlertService(db, current_user)
    alerts = await service.check_content_expiry(body.lookbooks, body.certificates)
    return GenericResponse(data=alerts)

@router.post("/test-trigger", response_model=GenericResponse[AlertSchema])
async def trigger_test_alert(
    category: str = "production",
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Mock endpoint to trigger an alert for testing."""
    service = AlertService(db, current_user)
    alert = await service.create_alert(
        category=category,
        alert_type="delay",
        severity="high",
        title=f"Critical {category.capitalize()} Alert",
        description=f"Automated detection of anomaly in {category} workflow.",
        context_type="order",
        context_id="ORD-TEST-001"
    )
    return GenericResponse(data=alert)
