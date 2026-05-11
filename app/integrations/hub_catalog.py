"""
Слоты интеграций для KPI карточки «Разделы организации» (/brand/integrations).

Числитель — только подключённые через env клиенты (без сетевых health-check).
Знаменатель — все проводные коннекторы плюс позиции каталога из кабинета (роадмап), см. brand integrations UI.
"""

from __future__ import annotations

from typing import Any, List, Tuple

# Совпадают с ключами в fetch_integrations_status_data (для консистентности контракта).
WIRED_SLOT_IDS: Tuple[str, ...] = ("c1c", "cdek", "znak", "edo", "payment", "ozon")

# Маркетплейсы и строки из демо-списка страницы интеграций — пока без Python-клиентов, только в знаменателе.
CATALOG_ONLY_SLOT_IDS: Tuple[str, ...] = (
    "wildberries",
    "lamoda",
    "yandex_market",
    "yandex_metrika",
    "moysklad",
    "vk_ads",
    "kontur",
)


def integration_hub_slot_total() -> int:
    return len(WIRED_SLOT_IDS) + len(CATALOG_ONLY_SLOT_IDS)


def wired_connector_instances() -> List[Any]:
    from app.integrations import CRPTClient, EDOClient, C1CClient, CDEKClient, PaymentClient
    from app.integrations.marketplace.base import OzonConnector

    return [
        C1CClient(),
        CDEKClient(),
        CRPTClient(),
        EDOClient(),
        PaymentClient(),
        OzonConnector(),
    ]


def count_configured_integrations_for_hub() -> Tuple[int, int]:
    """(configured_count, total_catalog_slots) для отображения X/Y на хабе."""
    connectors = wired_connector_instances()
    if len(connectors) != len(WIRED_SLOT_IDS):
        raise RuntimeError("WIRED_SLOT_IDS and wired_connector_instances() must stay in sync")
    n_ok = sum(1 for c in connectors if getattr(c, "is_configured", False))
    total = integration_hub_slot_total()
    return n_ok, total
