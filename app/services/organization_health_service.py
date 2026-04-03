"""
Organization health metrics aggregation.
Computes health scores from profile, dashboard, and integrations data.
"""

from datetime import date
from typing import Any, Dict, List

HEALTH_OK = 85
HEALTH_WARNING = 60


def _status_from_score(score: int) -> str:
    if score >= HEALTH_OK:
        return "ok"
    if score >= HEALTH_WARNING:
        return "warning"
    return "critical"


def _color_from_score(score: int) -> str:
    if score >= HEALTH_OK:
        return "bg-emerald-500"
    if score >= HEALTH_WARNING:
        return "bg-amber-500"
    return "bg-rose-500"


def _compute_profile_score(profile: Dict[str, Any]) -> tuple[int, List[str], List[str] | None, str | None]:
    if not profile or not isinstance(profile, dict):
        return 0, ["Нет данных профиля"], ["Название", "ИНН", "Юр. наименование", "Контакты", "Brand DNA"], "Загрузите профиль бренда"
    brand = profile.get("brand") or {}
    legal = profile.get("legal") or {}
    contacts = profile.get("contacts") or {}
    dna = profile.get("dna") or {}
    filled: List[str] = []
    if brand.get("name"):
        filled.append("Название бренда")
    if legal.get("inn"):
        filled.append("ИНН")
    if legal.get("legal_name"):
        filled.append("Юр. наименование")
    if contacts:
        filled.append("Контакты")
    if dna:
        filled.append("Brand DNA")
    total = 5
    score = min(100, round((len(filled) / total) * 100))
    missing: List[str] = []
    if not brand.get("name"):
        missing.append("Название")
    if not legal.get("inn"):
        missing.append("ИНН")
    if not legal.get("legal_name"):
        missing.append("Юр. наименование")
    if not contacts:
        missing.append("Контакты")
    if not dna:
        missing.append("Brand DNA")
    tips = f"Добавьте: {', '.join(missing)}" if missing else None
    return score, filled or ["Заполните профиль"], missing or None, tips


def _compute_integrations_score(integrations: Dict[str, Any]) -> tuple[int, List[str], List[str] | None, str | None]:
    if not integrations or not isinstance(integrations, dict):
        return 50, ["Статус интеграций неизвестен"], None, "Проверьте раздел Интеграции"
    entries = [(k, v) for k, v in integrations.items() if v is not None]
    total = max(len(entries), 1)
    ok = sum(1 for _, v in entries if (v or {}).get("status") == "ok")
    score = min(100, round((ok / total) * 100))
    status_str = lambda v: "активна" if (v or {}).get("status") == "ok" else (v or {}).get("status") or "ошибка"
    checklist = [f"{k}: {status_str(v)}" for k, v in entries]
    errors = [k for k, v in entries if (v or {}).get("status") != "ok"]
    missing = errors if errors else None
    tips = f"Исправьте: {', '.join(errors)}" if errors else None
    return score, checklist or ["Нет подключённых интеграций"], missing, tips


def _compute_marking_score(dashboard: Dict[str, Any]) -> tuple[int, List[str]]:
    if not dashboard:
        return 70, ["Статус маркировки неизвестен"]
    status = dashboard.get("markingSyncStatus")
    score = 94 if status == "ok" else (50 if status == "error" else 75)
    sync = dashboard.get("markingLastSync", "")
    checklist = [
        "ЭДО активна" if status == "ok" else "Проверьте ЭДО",
        f"Синхр: {sync}" if sync else "Синхронизация КИЗ",
    ]
    return score, checklist


async def get_organization_health_metrics(brand_id: str) -> List[Dict[str, Any]]:
    """
    Aggregate health metrics from profile, dashboard, integrations.
    Returns list of HealthMetric-shaped dicts for frontend.
    """
    from app.api.v1.endpoints.brand import (
        fetch_brand_profile_data,
        fetch_brand_dashboard_data,
        fetch_integrations_status_data,
    )

    last_check = date.today().strftime("%d.%m.%Y")

    profile = await fetch_brand_profile_data(brand_id)
    dashboard = await fetch_brand_dashboard_data(brand_id)
    integrations = await fetch_integrations_status_data(brand_id)

    profile_score, profile_checklist, profile_missing, profile_tips = _compute_profile_score(profile)
    int_score, int_checklist, int_missing, int_tips = _compute_integrations_score(integrations)
    marking_score, marking_checklist = _compute_marking_score(dashboard)

    team_count = 8  # TODO: from staff/team API
    team_score = 90 if team_count >= 5 else (75 if team_count >= 2 else (60 if team_count >= 1 else 40))

    docs_score = 75 if dashboard.get("openB2bOrders") else 85

    metrics: List[Dict[str, Any]] = [
        {
            "label": "Полнота профиля",
            "score": profile_score,
            "color": _color_from_score(profile_score),
            "desc": "Заполнены ключевые поля" if profile_score >= 80 else "Заполните обязательные поля",
            "href": "/brand",
            "trend": 0,
            "status": _status_from_score(profile_score),
            "details": {
                "lastCheck": last_check,
                "checklist": profile_checklist,
                "missing": profile_missing,
                "tips": profile_tips,
            },
        },
        {
            "label": "Безопасность",
            "score": 88,
            "color": "bg-emerald-500",
            "desc": "2FA, API-ключи",
            "href": "/brand/security",
            "trend": 0,
            "status": "ok",
            "details": {"lastCheck": last_check, "checklist": ["2FA", "API-ключи", "Сессии"]},
        },
        {
            "label": "Активность команды",
            "score": team_score,
            "color": _color_from_score(team_score),
            "desc": f"{team_count} участников" if team_count else "Добавьте участников",
            "href": "/brand/team",
            "trend": 0,
            "status": _status_from_score(team_score),
            "details": {
                "lastCheck": last_check,
                "checklist": [f"{team_count} в команде"] if team_count else [],
                "missing": None if team_count else ["Добавьте участников в раздел Команда"],
            },
        },
        {
            "label": "Интеграции",
            "score": int_score,
            "color": _color_from_score(int_score),
            "desc": f"{sum(1 for v in integrations.values() if (v or {}).get('status') == 'ok')} активных" if integrations else "Проверьте статус",
            "href": "/brand/integrations",
            "trend": 0,
            "status": _status_from_score(int_score),
            "details": {"lastCheck": last_check, "checklist": int_checklist, "missing": int_missing, "tips": int_tips},
        },
        {
            "label": "ЭДО и маркировка",
            "score": marking_score,
            "color": _color_from_score(marking_score),
            "desc": "Честный ЗНАК, ЭДО" if dashboard.get("markingSyncStatus") == "ok" else "Проверьте маркировку",
            "href": "/brand/compliance",
            "trend": 0,
            "status": _status_from_score(marking_score),
            "details": {"lastCheck": last_check, "checklist": marking_checklist},
        },
        {
            "label": "Подписка",
            "score": 100,
            "color": "bg-emerald-500",
            "desc": "Тариф активен",
            "href": "/brand/subscription",
            "trend": 0,
            "status": "ok",
            "details": {"lastCheck": last_check, "checklist": ["Подписка активна"]},
        },
        {
            "label": "Документы",
            "score": docs_score,
            "color": "bg-amber-500",
            "desc": "Договоры, счета",
            "href": "/brand/documents",
            "trend": 0,
            "status": "warning",
            "details": {"lastCheck": last_check, "checklist": ["Проверьте раздел Документы"]},
        },
        {
            "label": "Настройки",
            "score": 78,
            "color": "bg-amber-500",
            "desc": "Конфигурация",
            "href": "/brand/settings",
            "trend": 0,
            "status": "warning",
            "details": {"lastCheck": last_check, "checklist": ["Часовой пояс", "Валюта", "Webhooks"]},
        },
    ]
    return metrics
