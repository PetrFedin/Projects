import json
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Tuple

def _parse_quota_json(raw: str, dealer_ids: List[str], total: int, dealer_kpis: List = None) -> List[Tuple[str, int]]:
    """Parse LLM JSON response. Fallback to rule-based if invalid."""
    if not raw:
        return _rule_based_alloc(dealer_ids, total, dealer_kpis)
    try:
        cleaned = re.sub(r"```\w*\n?", "", raw).strip()
        arr = json.loads(cleaned)
        out = []
        for item in arr:
            did = str(item.get("dealer_id") or item.get("dealer") or "")
            qty = int(item.get("quantity") or item.get("qty") or 0)
            if did in dealer_ids and qty > 0:
                out.append((did, qty))
        if out and sum(q for _, q in out) <= total * 2:
            return out
    except (json.JSONDecodeError, ValueError, TypeError):
        pass
    return _rule_based_alloc(dealer_ids, total, dealer_kpis)

def _rule_based_alloc(dealer_ids: List[str], total: int, dealer_kpis: List = None) -> List[Tuple[str, int]]:
    """Trust_score weighted: qty = share * (trust_score/50). Matches legacy behavior."""
    if dealer_kpis and len(dealer_kpis) >= len(dealer_ids):
        kpi_by_id = {getattr(k, "dealer_id", None): k for k in dealer_kpis}
        out = []
        for d in dealer_ids:
            kpi = kpi_by_id.get(d)
            score = getattr(kpi, "trust_score", 50) or 50
            qty = int((total / len(dealer_ids)) * (score / 50))
            out.append((d, max(1, qty)))
        return out
    n = len(dealer_ids)
    base = total // n
    rem = total % n
    return [(d, base + (1 if i < rem else 0)) for i, d in enumerate(dealer_ids)]
from app.db.session import get_db
from app.db.repositories.quota import QuotaRepository, DealerKPIRepository
from app.api.schemas.quota import QuotaAllocation, QuotaAllocationRequest, DealerKPI, DealerKPICreate
from app.agents.quota_agent import quota_agent
from app.db.models.base import QuotaAllocation as QuotaModel, DealerKPI as KPIModel

router = APIRouter()

@router.get("/kpi", response_model=List[DealerKPI])
async def get_dealer_kpis(db: AsyncSession = Depends(get_db)):
    repo = DealerKPIRepository(db)
    return await repo.get_all()

@router.post("/kpi", response_model=DealerKPI)
async def create_dealer_kpi(kpi_in: DealerKPICreate, db: AsyncSession = Depends(get_db)):
    repo = DealerKPIRepository(db)
    existing = await repo.get_by_dealer_id(kpi_in.dealer_id)
    if existing:
        raise HTTPException(status_code=400, detail="Dealer KPI already exists")
    new_kpi = KPIModel(**kpi_in.model_dump())
    return await repo.create(new_kpi)

@router.post("/allocate", response_model=List[QuotaAllocation])
async def allocate_quotas(req: QuotaAllocationRequest, db: AsyncSession = Depends(get_db)):
    # 1. Fetch KPIs for requested dealers
    kpi_repo = DealerKPIRepository(db)
    dealer_kpis = []
    for d_id in req.dealer_ids:
        kpi = await kpi_repo.get_by_dealer_id(d_id)
        if kpi:
            dealer_kpis.append(kpi)
    
    if not dealer_kpis:
        raise HTTPException(status_code=400, detail="No dealers with KPIs found")

    context = {"dealer_kpis": dealer_kpis, "total_quantity": req.total_quantity}
    result = await quota_agent.run(req.sku_id, context=context)
    ai_allocations = _parse_quota_json(
        result.code_changes, [k.dealer_id for k in dealer_kpis], req.total_quantity, dealer_kpis
    )

    quota_repo = QuotaRepository(db)
    allocations = []
    for dealer_id, qty in ai_allocations:
        new_quota = QuotaModel(
            sku_id=req.sku_id,
            dealer_id=dealer_id,
            allocated_quantity=qty,
            status="proposed",
            reason="AI allocation"
        )
        saved = await quota_repo.create(new_quota)
        allocations.append(saved)
    return allocations

@router.get("/{sku_id}", response_model=List[QuotaAllocation])
async def get_sku_allocations(sku_id: str, db: AsyncSession = Depends(get_db)):
    repo = QuotaRepository(db)
    return await repo.get_by_sku(sku_id)
