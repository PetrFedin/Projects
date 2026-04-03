"""
Global search for Cmd+K Command Center.
MVP: DB queries (Order, Organization, FeatureProposal, Showroom) + static pages.
Infrastructure ready for Elasticsearch when scaled.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Dict, Optional
from app.api import deps
from app.db.models.base import User, Order, Organization, FeatureProposal, Showroom
from app.api.schemas.base import GenericResponse
from pydantic import BaseModel

router = APIRouter()

class SearchResult(BaseModel):
    id: str
    type: str
    title: str
    description: Optional[str] = None
    url: str

# Static nav for investor demo (no DB)
STATIC_PAGES = [
    {"id": "nav-prod", "type": "page", "title": "Production Console", "desc": "Manage factory lines", "url": "/brand/production"},
    {"id": "nav-dam", "type": "page", "title": "DAM Library", "desc": "Media assets", "url": "/brand/dam"},
    {"id": "nav-wholesale", "type": "page", "title": "Wholesale", "desc": "B2B orders", "url": "/brand/wholesale"},
]


async def _search_orders(db: AsyncSession, q: str, org_id: Optional[str], limit: int) -> List[Dict]:
    conds = []
    if q.isdigit():
        conds.append(Order.id == int(q))
    conds.append(Order.note.ilike(f"%{q}%"))
    stmt = select(Order).where(or_(*conds))
    if org_id:
        stmt = stmt.where(Order.organization_id == org_id)
    r = await db.execute(stmt.limit(limit))
    orders = r.scalars().all()
    return [{"id": f"ORD-{o.id}", "type": "order", "title": f"Order #{o.id}", "desc": f"{o.status} · {o.total_amount}", "url": f"/brand/b2b-orders/{o.id}"} for o in orders]


async def _search_orgs(db: AsyncSession, q: str, limit: int) -> List[Dict]:
    stmt = select(Organization).where(Organization.name.ilike(f"%{q}%")).limit(limit)
    r = await db.execute(stmt)
    orgs = r.scalars().all()
    return [{"id": o.id, "type": "brand", "title": o.name, "desc": o.type, "url": f"/brand"} for o in orgs]


async def _search_proposals(db: AsyncSession, q: str, org_id: Optional[str], limit: int) -> List[Dict]:
    stmt = select(FeatureProposal).where(or_(FeatureProposal.name.ilike(f"%{q}%"), FeatureProposal.category.ilike(f"%{q}%")))
    if org_id:
        stmt = stmt.where(FeatureProposal.organization_id == org_id)
    stmt = stmt.limit(limit)
    r = await db.execute(stmt)
    items = r.scalars().all()
    return [{"id": f"P-{p.id}", "type": "product", "title": p.name, "desc": p.category, "url": f"/brand/products/P-{p.id}"} for p in items]


async def _search_showrooms(db: AsyncSession, q: str, org_id: Optional[str], limit: int) -> List[Dict]:
    stmt = select(Showroom).where(Showroom.name.ilike(f"%{q}%"))
    if org_id:
        stmt = stmt.where(Showroom.organization_id == org_id)
    stmt = stmt.limit(limit)
    r = await db.execute(stmt)
    items = r.scalars().all()
    return [{"id": f"SR-{s.id}", "type": "showroom", "title": s.name, "desc": "Digital showroom", "url": f"/brand/showrooms/{s.id}"} for s in items]


@router.get("/", response_model=GenericResponse[List[SearchResult]])
async def global_search(
    q: str,
    limit: int = 20,
    types: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Search: DB (orders, orgs, proposals, showrooms) + static pages. types: product,order,brand,page."""
    query = (q or "").strip().lower()
    type_filter = [t.strip() for t in (types or "").split(",") if t.strip()] if types else None
    results: List[Dict] = []
    org_id = getattr(current_user, "organization_id", None)
    per_type = max(5, limit // 4)

    if not query:
        return GenericResponse(data=[])

    try:
        if not type_filter or "order" in type_filter:
            results.extend(await _search_orders(db, query, org_id, per_type))
        if not type_filter or "brand" in type_filter:
            results.extend(await _search_orgs(db, query, per_type))
        if not type_filter or "product" in type_filter:
            results.extend(await _search_proposals(db, query, org_id, per_type))
        if not type_filter or "showroom" in type_filter:
            results.extend(await _search_showrooms(db, query, org_id, per_type))
    except Exception:
        pass

    # Static pages
    for p in STATIC_PAGES:
        if query in (p["title"] + " " + p["desc"]).lower():
            if not type_filter or "page" in type_filter:
                results.append(p)

    seen = set()
    deduped = []
    for r in results:
        k = (r["id"], r["type"])
        if k not in seen:
            seen.add(k)
            deduped.append(SearchResult(id=r["id"], type=r["type"], title=r["title"], description=r.get("desc"), url=r["url"]))

    return GenericResponse(data=deduped[:limit])
