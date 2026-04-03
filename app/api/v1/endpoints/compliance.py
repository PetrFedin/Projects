from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.compliance_service import ComplianceService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class EACCertificateCreate(BaseModel):
    certificate_number: str
    sku_ids: List[str]
    expiry_date: datetime
    certification_body: str

class MarkingEmitRequest(BaseModel):
    sku_id: str
    quantity: int

@router.post("/eac/register", response_model=GenericResponse[Dict[str, Any]])
async def register_eac_certificate(
    cert_in: EACCertificateCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ComplianceService(db, current_user)
    cert = await service.register_eac_certificate({
        "certificate_number": cert_in.certificate_number,
        "sku_ids_json": {"skus": cert_in.sku_ids},
        "expiry_date": cert_in.expiry_date,
        "certification_body": cert_in.certification_body
    })
    return GenericResponse(data={"id": cert.id, "status": "registered"})

@router.post("/marking/emit", response_model=GenericResponse[List[Dict[str, Any]]])
async def emit_marking_codes(
    req: MarkingEmitRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ComplianceService(db, current_user)
    codes = await service.emit_marking_codes(req.sku_id, req.quantity)
    return GenericResponse(data=[{"serial": c.serial_number, "status": c.status} for c in codes])

@router.get("/edo/documents", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_edo_documents(
    limit: int = 100,
    status: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """status: filter by doc status (draft, signed, etc)."""
    service = ComplianceService(db, current_user)
    docs = await service.get_edo_documents()
    if status:
        docs = [d for d in docs if getattr(d, "status", None) == status]
    return GenericResponse(data=[{
        "id": d.id,
        "number": d.doc_number,
        "type": d.doc_type,
        "status": d.status,
        "total": d.total_amount
    } for d in docs[:limit]])

@router.post("/edo/{doc_id}/sign", response_model=GenericResponse[Dict[str, Any]])
async def sign_edo_document(
    doc_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ComplianceService(db, current_user)
    doc = await service.sign_edo_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return GenericResponse(data={"id": doc.id, "status": doc.status})
