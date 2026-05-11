"""
Brand-scoped endpoints for organization hub: profile, dashboard, integrations.
MVP: DB-backed where models exist, fallback to demo data for investor showcase.
"""

from copy import deepcopy
from datetime import timedelta
from typing import Any, Dict, Optional, Set

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.api.schemas.base import GenericResponse
from app.core.datetime_util import utc_now
from app.db.models.base import User, Organization, Order, Showroom, Linesheet
from app.db.models.intelligence import ChestnyZnakCode, EACCertificate, EDODocument
from app.db.models.product import Assortment, CollectionDrop, Lookbook
from app.integrations.policy import integration_idle_response

router = APIRouter()


def _buyer_key_as_str(val: Any) -> Optional[str]:
    if val is None:
        return None
    s = str(val).strip()
    return s if s else None


def _retailer_ids_from_assortment_json(raw: Any) -> Set[str]:
    """Читает retailer_ids из JSON колонки Assortment (список id или dict с ключами ids/retailer_ids)."""
    out: Set[str] = set()
    if raw is None:
        return out
    if isinstance(raw, list):
        for x in raw:
            sid = _buyer_key_as_str(x)
            if sid:
                out.add(sid)
        return out
    if isinstance(raw, dict):
        for key in ("ids", "retailer_ids", "retailers"):
            nested = raw.get(key)
            if nested is not None:
                out |= _retailer_ids_from_assortment_json(nested)
    return out


# Контракт как у synth фронта (normalizeAttentionAlertsPayload): демо при пустой орг.
DEMO_ATTENTION_ALERTS: Dict[str, Any] = {
    "certificates": [
        {"id": "c1", "name": "ISO 9001:2015", "daysLeft": 14},
        {"id": "c2", "name": "ISO 14001:2015", "daysLeft": 21},
    ],
    "profile": [
        {"id": "p1", "name": "Brand DNA", "detail": "75% заполнено"},
        {"id": "p2", "name": "Keywords", "detail": "Не указаны"},
        {"id": "p3", "name": "Target Audience", "detail": "Не указана"},
    ],
    "tasks": [
        {"id": "t1", "title": "Согласовать заказ ЦУМ", "priority": "высокий"},
        {"id": "t2", "title": "Обновить размерную сетку", "priority": "средний"},
    ],
    "integrationIssues": [],
}

EMPTY_ATTENTION_ALERTS: Dict[str, Any] = {
    "certificates": [],
    "profile": [],
    "tasks": [],
    "integrationIssues": [],
}

# Карточки «Разделы организации» на фронте (ключ = href). При активной орг. часть полей пересчитывается.
DEMO_MODULE_STATS: Dict[str, Dict[str, str]] = {
    "/brand": {"label": "Заполнено", "value": "92%", "status": "success"},
    "/brand/team": {"label": "Участников", "value": "24", "status": "active"},
    "/brand/documents": {"label": "На подписи", "value": "2", "status": "warning"},
    "/brand/integrations": {"label": "Активно", "value": "3/13", "status": "warning"},
    "/brand/subscription": {"label": "План", "value": "Elite", "status": "success"},
    "/brand/security": {"label": "Оценка", "value": "88/100", "status": "success"},
    "/brand/settings": {"label": "Конфигурация", "value": "OK", "status": "success"},
    "/brand/compliance": {"label": "Статус", "value": "Настроено", "status": "success"},
}


def _integrations_configured_snapshot() -> tuple[int, int]:
    """Сколько слотов интеграций имеют учётные данные — только свойства клиентов, без сетевых проверок."""
    from app.integrations import CRPTClient, EDOClient, C1CClient, CDEKClient, PaymentClient
    from app.integrations.marketplace.base import OzonConnector

    connectors = [
        C1CClient(),
        CDEKClient(),
        CRPTClient(),
        EDOClient(),
        PaymentClient(),
        OzonConnector(),
    ]
    total = len(connectors)
    n_ok = sum(1 for c in connectors if getattr(c, "is_configured", False))
    return n_ok, total


def _build_module_stats(
    *,
    participants_count: int,
    marking_sync_status: str,
    has_org_activity: bool,
    edo_pending: int,
    integrations_configured: int,
    integrations_total: int,
) -> Dict[str, Dict[str, str]]:
    stats = deepcopy(DEMO_MODULE_STATS)
    stats["/brand/team"]["value"] = str(participants_count)
    if has_org_activity:
        pending_sig = min(max(int(edo_pending), 0), 99)
        stats["/brand/documents"]["value"] = str(pending_sig)
        stats["/brand/documents"]["status"] = "warning" if pending_sig > 0 else "success"
        sync_ok = marking_sync_status == "ok"
        stats["/brand/compliance"]["value"] = "Настроено" if sync_ok else "Проверить"
        stats["/brand/compliance"]["status"] = "success" if sync_ok else "warning"
        total_i = max(int(integrations_total), 1)
        n_i = min(max(int(integrations_configured), 0), total_i)
        stats["/brand/integrations"]["value"] = f"{n_i}/{total_i}"
        if n_i >= total_i:
            stats["/brand/integrations"]["status"] = "success"
        elif n_i > 0:
            stats["/brand/integrations"]["status"] = "warning"
        else:
            stats["/brand/integrations"]["status"] = "warning"
    return stats


DEMO_PARTNER_GROWTH_BY_PERIOD: Dict[str, Dict[str, Any]] = {
    "7d": {
        "total": 8,
        "items": [
            {"label": "Производства", "value": "+1", "href": "/brand/factories"},
            {"label": "Поставщики", "value": "+2", "href": "/brand/materials"},
            {"label": "Магазины", "value": "+4", "href": "/brand/retailers"},
            {"label": "Дистрибуторы", "value": "+1", "href": "/brand/distributors"},
        ],
    },
    "30d": {
        "total": 22,
        "items": [
            {"label": "Производства", "value": "+2", "href": "/brand/factories"},
            {"label": "Поставщики", "value": "+5", "href": "/brand/materials"},
            {"label": "Магазины", "value": "+12", "href": "/brand/retailers"},
            {"label": "Дистрибуторы", "value": "+3", "href": "/brand/distributors"},
        ],
    },
}


def _build_partner_ecosystem(
    *,
    retailers_count: int,
    order_count: int,
    pending: int,
    pending_confirmation: int,
    po_confirmed: int,
    shipped_count: int,
    orders_7d: int,
    orders_30d: int,
    edo_pending: int,
    edo_signed: int,
    has_org_activity: bool,
) -> Dict[str, Any]:
    """growthByPeriod — как на фронте; countsPatchById подмешивается поверх PARTNER_COUNTS.

    businessProcessesPatchById / ecosystemBlocksPatchById — те же id, что PARTNER_* на фронте.
    """
    growth = deepcopy(DEMO_PARTNER_GROWTH_BY_PERIOD)
    counts_patch: Dict[str, Dict[str, Any]] = {}
    processes_patch: Dict[str, Dict[str, Any]] = {}
    blocks_patch: Dict[str, Dict[str, Any]] = {}
    if has_org_activity:
        oc_cap = min(order_count, retailers_count)
        counts_patch["retailers"] = {
            "value": str(retailers_count),
            "subline": (f"{oc_cap} с заказами за 30 дн." if oc_cap else "нет заказов за период"),
            "detailMetrics": [
                {"label": "С заказами за 30 дн.", "value": str(oc_cap), "href": "/brand/b2b-orders"},
                {"label": "Открытых B2B", "value": str(pending), "href": "/brand/b2b-orders"},
                {"label": "В каталоге", "value": str(retailers_count), "href": "/brand/retailers"},
            ],
        }
        processes_patch["b2b-orders"] = {
            "count7d": int(orders_7d),
            "count30d": int(orders_30d),
            "detailMetrics": [
                {"label": "На подтверждении", "value": str(pending_confirmation), "href": "/brand/b2b-orders?status=pending"},
                {"label": "В производстве", "value": str(po_confirmed), "href": "/brand/b2b-orders"},
                {"label": "Отгружено", "value": str(shipped_count), "href": "/brand/b2b-orders"},
            ],
        }
        processes_patch["documents"] = {
            "detailMetrics": [
                {"label": "На подпись", "value": str(edo_pending), "href": "/brand/documents?status=pending"},
                {"label": "Истекают в 30 дн.", "value": "—", "href": "/brand/documents?expiring=30"},
                {"label": "Подписано в ЭДО", "value": str(edo_signed), "href": "/brand/documents"},
            ],
        }
        processes_patch["shipments"] = {
            "detailMetrics": [
                {"label": "В пути", "value": str(shipped_count), "href": "/brand/logistics"},
                {"label": "К отгрузке", "value": str(po_confirmed), "href": "/brand/b2b-orders"},
                {"label": "Задержки", "value": "0", "href": "/brand/logistics"},
            ],
        }

        contracts_metrics = [
            {"label": "На подпись", "value": str(edo_pending), "href": "/brand/documents?status=pending"},
            {"label": "Истекают в 30 дн.", "value": "—", "href": "/brand/documents?expiring=30"},
            {"label": "Подписано в ЭДО", "value": str(edo_signed), "href": "/brand/documents"},
        ]
        blocks_patch["contracts-docs"] = {
            "alertCount": edo_pending,
            "alertCount7d": edo_pending,
            "alertCount30d": edo_pending,
            "metrics": contracts_metrics,
            "metrics7d": contracts_metrics,
            "metrics30d": contracts_metrics,
        }

        lm = [
            {"label": "В пути", "value": str(shipped_count), "href": "/brand/logistics"},
            {"label": "К отгрузке", "value": str(po_confirmed), "href": "/brand/b2b-orders"},
            {"label": "Задержки", "value": "0", "href": "/brand/logistics"},
        ]
        blocks_patch["logistics-shipments"] = {"metrics": lm, "metrics7d": lm, "metrics30d": lm}

        blocks_patch["partner-analytics"] = {
            "metrics": [
                {"label": "Топ-10 партнёров", "value": str(retailers_count), "href": "/brand/retailers"},
                {"label": "План/факт", "value": "—", "href": "/brand/retailers"},
                {"label": "Рост за месяц", "value": "—", "href": "/brand/retailers"},
            ],
            "metrics7d": [
                {"label": "Топ за 7 дн.", "value": str(retailers_count), "href": "/brand/retailers"},
                {"label": "План/факт за 7 дн.", "value": "—", "href": "/brand/retailers"},
                {"label": "Рост за 7 дн.", "value": "—", "href": "/brand/retailers"},
            ],
            "metrics30d": [
                {"label": "Топ за 30 дн.", "value": str(retailers_count), "href": "/brand/retailers"},
                {"label": "План/факт за 30 дн.", "value": "—", "href": "/brand/retailers"},
                {"label": "Рост за 30 дн.", "value": "—", "href": "/brand/retailers"},
            ],
        }

    out: Dict[str, Any] = {"growthByPeriod": growth, "countsPatchById": counts_patch}
    if processes_patch:
        out["businessProcessesPatchById"] = processes_patch
    if blocks_patch:
        out["ecosystemBlocksPatchById"] = blocks_patch
    return out


DEMO_PROFILE = {
    "brand": {"name": "Syntha", "id": "demo"},
    "legal": {"inn": "7707123456", "legal_name": "ООО «Синта Фэшн»"},
    "contacts": {},
    "dna": {},
    "certificates": [],
}


async def fetch_brand_profile_data(brand_id: str, db: AsyncSession) -> Dict[str, Any]:
    """
    Brand profile: Organization from DB when exists, else demo.
    Infrastructure ready for legal/contacts when models are added.
    """
    r = await db.execute(select(Organization).where(Organization.id == brand_id))
    org = r.scalar_one_or_none()
    if org:
        return {
            "brand": {"name": org.name, "id": org.id, "type": org.type},
            "legal": getattr(org, "metadata_json", {}) or {},
            "contacts": {},
            "dna": {},
            "certificates": [],
            "_source": "db",
        }
    return {**DEMO_PROFILE, "brand": {**DEMO_PROFILE["brand"], "id": brand_id}, "_source": "demo"}


def _format_sync_time(dt: Any) -> str:
    """HH:MM UTC для подписи маркировки на дашборде."""
    try:
        return dt.strftime("%H:%M")  # type: ignore[union-attr]
    except Exception:
        return "—"


async def fetch_brand_dashboard_data(brand_id: str, db: AsyncSession) -> Dict[str, Any]:
    """
    Brand KPIs: real counts from DB (orders, showrooms, linesheets, team members).
    Fallback to demo values when tables are empty for investor demo.
    Hub presence: participantsCount / onlineCount (online heuristic ~⅓ of team when DB has members).
    """
    # Orders
    order_count = (await db.execute(select(func.count(Order.id)).where(Order.organization_id == brand_id))).scalar() or 0
    pending = (await db.execute(select(func.count(Order.id)).where(Order.organization_id == brand_id, Order.status.in_(["draft", "pending", "confirmed"])))).scalar() or 0
    po_confirmed = (
        await db.execute(
            select(func.count(Order.id)).where(
                Order.organization_id == brand_id,
                Order.status == "confirmed",
            )
        )
    ).scalar() or 0
    pending_confirmation = (
        await db.execute(
            select(func.count(Order.id)).where(
                Order.organization_id == brand_id,
                Order.status == "pending",
            )
        )
    ).scalar() or 0
    shipped_count = (
        await db.execute(
            select(func.count(Order.id)).where(
                Order.organization_id == brand_id,
                Order.status == "shipped",
            )
        )
    ).scalar() or 0
    now = utc_now()
    cut_7d = now - timedelta(days=7)
    cut_30d = now - timedelta(days=30)
    orders_7d = (
        await db.execute(
            select(func.count(Order.id)).where(
                Order.organization_id == brand_id,
                Order.created_at >= cut_7d,
            )
        )
    ).scalar() or 0
    orders_30d = (
        await db.execute(
            select(func.count(Order.id)).where(
                Order.organization_id == brand_id,
                Order.created_at >= cut_30d,
            )
        )
    ).scalar() or 0
    edo_pending = 0
    edo_signed = 0
    try:
        edo_pending = (
            await db.execute(
                select(func.count(EDODocument.id)).where(
                    EDODocument.organization_id == brand_id,
                    EDODocument.status.in_(["draft", "sent"]),
                )
            )
        ).scalar() or 0
        edo_signed = (
            await db.execute(
                select(func.count(EDODocument.id)).where(
                    EDODocument.organization_id == brand_id,
                    EDODocument.status == "signed",
                )
            )
        ).scalar() or 0
    except Exception:
        edo_pending = 0
        edo_signed = 0
    # Showrooms
    showroom_count = (await db.execute(select(func.count(Showroom.id)).where(Showroom.organization_id == brand_id))).scalar() or 0
    try:
        linesheet_count = (await db.execute(select(func.count(Linesheet.id)).where(Linesheet.organization_id == brand_id))).scalar() or 0
    except Exception:
        linesheet_count = 0

    member_count = (
        await db.execute(
            select(func.count(User.id)).where(
                User.organization_id == brand_id,
                User.is_active.is_(True),
            )
        )
    ).scalar() or 0
    participants_count = member_count if member_count > 0 else 24
    online_count = (
        8
        if member_count == 0
        else max(1, min(round(member_count * 0.33), participants_count))
    )

    # Контрагенты B2B: DISTINCT buyer из заказов ∪ retailer_ids из Assortment (каталог дистров).
    buyer_key = func.coalesce(Order.buyer_organization_id, Order.buyer_id)
    buyer_keys_normalized: Set[str] = set()
    catalog_retailer_ids: Set[str] = set()
    try:
        buyer_rows = (
            await db.execute(
                select(buyer_key).distinct().where(
                    Order.organization_id == brand_id,
                    buyer_key.isnot(None),
                )
            )
        ).all()
        for row in buyer_rows:
            sid = _buyer_key_as_str(row[0])
            if sid:
                buyer_keys_normalized.add(sid)

        ar_rows = (
            await db.execute(select(Assortment.retailer_ids).where(Assortment.organization_id == brand_id))
        ).all()
        for (rj,) in ar_rows:
            catalog_retailer_ids |= _retailer_ids_from_assortment_json(rj)
    except Exception:
        buyer_keys_normalized = set()
        catalog_retailer_ids = set()

    retailer_union_count = len(buyer_keys_normalized | catalog_retailer_ids)

    collections_count_db = 0
    try:
        cd = (
            await db.execute(select(func.count(CollectionDrop.id)).where(CollectionDrop.brand_id == brand_id))
        ).scalar() or 0
        lb = (await db.execute(select(func.count(Lookbook.id)).where(Lookbook.brand_id == brand_id))).scalar() or 0
        collections_count_db = int(cd) + int(lb)
    except Exception:
        collections_count_db = 0

    certs_active_db = 0
    try:
        certs_active_db = (
            await db.execute(
                select(func.count(EACCertificate.id)).where(
                    EACCertificate.organization_id == brand_id,
                    EACCertificate.status == "active",
                )
            )
        ).scalar() or 0
    except Exception:
        certs_active_db = 0

    cz_count = 0
    cz_last = None
    try:
        cz_row = (
            await db.execute(
                select(
                    func.count(ChestnyZnakCode.id),
                    func.max(func.coalesce(ChestnyZnakCode.applied_at, ChestnyZnakCode.created_at)),
                ).where(ChestnyZnakCode.organization_id == brand_id)
            )
        ).one()
        cz_count = int(cz_row[0] or 0)
        cz_last = cz_row[1]
    except Exception:
        cz_count = 0
        cz_last = None

    has_org_activity = bool(order_count or showroom_count or member_count)
    attention_alerts = EMPTY_ATTENTION_ALERTS if has_org_activity else DEMO_ATTENTION_ALERTS

    if cz_count > 0 and cz_last is not None:
        marking_sync_status = "ok"
        marking_last_sync = _format_sync_time(cz_last)
    elif has_org_activity:
        marking_sync_status = "warning"
        marking_last_sync = "—"
    else:
        marking_sync_status = "ok"
        marking_last_sync = "09:12"

    if retailer_union_count > 0:
        retailers_count = retailer_union_count
    elif has_org_activity:
        retailers_count = max(order_count, showroom_count, 1)
    else:
        retailers_count = 24 if order_count == 0 else max(24, order_count)

    open_b2b_orders = pending if has_org_activity else (pending or 7)
    certs_active_out = certs_active_db if has_org_activity else 1
    if certs_active_out == 0 and not has_org_activity:
        certs_active_out = 1
    po_in_production_out = int(po_confirmed) if has_org_activity else 4
    collections_count_out = int(collections_count_db) if has_org_activity else 12

    integ_n, integ_total = _integrations_configured_snapshot()

    return {
        "retailersCount": retailers_count,
        "openB2bOrders": open_b2b_orders,
        "certsActive": certs_active_out,
        "poInProduction": po_in_production_out,
        "collectionsCount": collections_count_out,
        "markingSyncStatus": marking_sync_status,
        "markingLastSync": marking_last_sync,
        "ordersTotal": order_count,
        "showroomsCount": showroom_count,
        "linesheetsCount": linesheet_count,
        "participantsCount": participants_count,
        "onlineCount": online_count,
        "attentionAlerts": attention_alerts,
        "documentsPendingSignature": int(edo_pending),
        "moduleStats": _build_module_stats(
            participants_count=participants_count,
            marking_sync_status=marking_sync_status,
            has_org_activity=has_org_activity,
            edo_pending=edo_pending,
            integrations_configured=integ_n,
            integrations_total=integ_total,
        ),
        "partnerEcosystem": _build_partner_ecosystem(
            retailers_count=retailers_count,
            order_count=order_count,
            pending=pending,
            pending_confirmation=pending_confirmation,
            po_confirmed=po_confirmed,
            shipped_count=shipped_count,
            orders_7d=orders_7d,
            orders_30d=orders_30d,
            edo_pending=edo_pending,
            edo_signed=edo_signed,
            has_org_activity=has_org_activity,
        ),
        "_source": "db" if order_count or showroom_count or member_count else "demo",
    }


async def fetch_integrations_status_data(brand_id: str) -> Dict[str, Any]:
    """
    Status of integrations (1C, ЭДО, СДЭК, маркировка, оплата).
    Uses real health checks when credentials are configured.
    """
    from app.integrations import CRPTClient, EDOClient, C1CClient, CDEKClient, PaymentClient
    from app.integrations.marketplace.base import OzonConnector

    idle = integration_idle_response

    crpt = CRPTClient()
    edo = EDOClient()
    c1c = C1CClient()
    cdek = CDEKClient()
    payment = PaymentClient()
    ozon = OzonConnector()

    c1c_status = await c1c.health_check() if c1c.is_configured else idle()
    cdek_status = await cdek.health_check() if cdek.is_configured else idle()
    znak_status = await crpt.health_check() if crpt.is_configured else idle()
    edo_status = await edo.health_check() if edo.is_configured else idle()
    payment_status = await payment.health_check() if payment.is_configured else idle()
    ozon_status = {"status": "stub"} if ozon.is_configured else idle()

    return {
        "c1c": {"status": c1c_status.get("status", "unknown"), "configured": c1c.is_configured},
        "cdek": {"status": cdek_status.get("status", "unknown"), "configured": cdek.is_configured},
        "znak": {"status": znak_status.get("status", "unknown"), "configured": crpt.is_configured},
        "edo": {"status": edo_status.get("status", "unknown"), "configured": edo.is_configured},
        "payment": {"status": payment_status.get("status", "unknown"), "configured": payment.is_configured},
        "ozon": {"status": ozon_status.get("status", "unknown"), "configured": ozon.is_configured},
    }


@router.get("/profile/{brand_id}", response_model=GenericResponse[Dict[str, Any]])
async def get_brand_profile(
    brand_id: str,
    db: AsyncSession = Depends(deps.get_db),
) -> GenericResponse[Dict[str, Any]]:
    """Brand profile: Organization from DB or demo. Ready for legal/contacts extension."""
    data = await fetch_brand_profile_data(brand_id, db)
    return GenericResponse(data=data)


@router.get("/dashboard/{brand_id}", response_model=GenericResponse[Dict[str, Any]])
async def get_brand_dashboard(
    brand_id: str,
    db: AsyncSession = Depends(deps.get_db),
) -> GenericResponse[Dict[str, Any]]:
    """Brand KPIs: real DB counts (orders, showrooms, linesheets) or demo fallback."""
    data = await fetch_brand_dashboard_data(brand_id, db)
    return GenericResponse(data=data)


@router.get("/integrations/status/{brand_id}", response_model=GenericResponse[Dict[str, Any]])
async def get_integrations_status(brand_id: str) -> GenericResponse[Dict[str, Any]]:
    """Integration status: configured via env (CDEK_*, CRPT_*, etc). MVP: stubs when not configured."""
    data = await fetch_integrations_status_data(brand_id)
    return GenericResponse(data=data)
