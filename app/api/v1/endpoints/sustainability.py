from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.sustainability_ledger_service import SustainabilityLedgerService
from pydantic import BaseModel

router = APIRouter()

class ProofRequest(BaseModel):
    entity_type: str
    entity_id: str
    event_type: str
    metadata: Dict[str, Any]

class PassportRequest(BaseModel):
    sku_id: str

class PassportResponse(BaseModel):
    id: int
    sku_id: str
    passport_uid: str
    composition_json: Dict[str, Any]
    origin_details_json: Dict[str, Any]
    sustainability_kpis_json: Dict[str, Any]
    circularity_options_json: Dict[str, Any]
    blockchain_proof_url: str | None
    created_at: str

@router.post("/proofs", response_model=Dict[str, Any])
async def create_proof(
    data: ProofRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Records a sustainability event and generates a blockchain-ready proof hash."""
    service = SustainabilityLedgerService(db, current_user)
    proof = await service.create_sustainability_proof(data.entity_type, data.entity_id, data.event_type, data.metadata)
    return {
        "id": proof.id,
        "proof_hash": proof.proof_hash,
        "timestamp": proof.timestamp.isoformat(),
        "status": "recorded"
    }

@router.post("/passports/generate", response_model=Dict[str, Any])
async def generate_passport(
    data: PassportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Aggregates data from multiple modules to generate a Digital Product Passport."""
    service = SustainabilityLedgerService(db, current_user)
    passport = await service.generate_digital_passport(data.sku_id)
    return {
        "id": passport.id,
        "passport_uid": passport.passport_uid,
        "sku_id": passport.sku_id,
        "blockchain_url": passport.blockchain_proof_url
    }

@router.get("/passports/{passport_uid}", response_model=Dict[str, Any])
async def get_public_passport(
    passport_uid: str,
    db: AsyncSession = Depends(get_db)
    # Public access: no current_user dependency needed for consumer-facing DPP
):
    """Public access for consumers scanning QR codes to view the Digital Product Passport."""
    # We use a system-level user or no user for public access
    # Mocking a system user for the service instance
    from app.db.models.base import User as MockUser
    mock_user = MockUser(id="system", organization_id="public", role="public")
    
    service = SustainabilityLedgerService(db, mock_user)
    passport = await service.get_passport_by_uid(passport_uid)
    if not passport:
        raise HTTPException(status_code=404, detail="Digital Passport not found.")
        
    return {
        "passport_uid": passport.passport_uid,
        "sku_id": passport.sku_id,
        "composition": passport.composition_json,
        "origin": passport.origin_details_json,
        "sustainability_metrics": passport.sustainability_kpis_json,
        "circularity_links": passport.circularity_options_json,
        "blockchain_verification": passport.blockchain_proof_url,
        "verified_at": passport.created_at.isoformat()
    }
