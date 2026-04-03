from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.smart_contract_service import SmartContractService
from pydantic import BaseModel

router = APIRouter()

class ContractCreate(BaseModel):
    partner_id: str
    contract_type: str # production_bonus, penalty, escrow_release
    conditions: Dict[str, Any]

class ContractResponse(BaseModel):
    id: int
    partner_id: str
    contract_type: str
    status: str
    created_at: str

@router.post("/", response_model=Dict[str, Any])
async def create_smart_contract(
    data: ContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Sets up a new automated financial contract (AI Escalator)."""
    service = SmartContractService(db, current_user)
    contract = await service.create_contract(data.model_dump())
    return {
        "id": contract.id,
        "partner_id": contract.partner_id,
        "contract_type": contract.contract_type,
        "status": contract.status
    }

@router.get("/active", response_model=List[ContractResponse])
async def get_active_contracts(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns active smart contracts for the organization."""
    service = SmartContractService(db, current_user)
    contracts = await service.contract_repo.get_active_contracts(current_user.organization_id)
    contracts = contracts[:limit]
    return [ContractResponse(
        id=c.id,
        partner_id=c.partner_id,
        contract_type=c.contract_type,
        status=c.status,
        created_at=c.created_at.isoformat()
    ) for c in contracts]

@router.get("/executions/{contract_id}", response_model=List[Dict[str, Any]])
async def get_contract_executions(
    contract_id: int,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns execution history for a contract."""
    return []
