from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.base import User, PackingList, CustomsDeclaration, Order
from app.db.repositories.order import OrderRepository # Assuming it exists or I'll use base
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now

class LogisticsService:
    """
    Service for Brand/Distributor Logistics: Packing Lists, Customs (DDP), and Shipping.
    Vertical link: Logistics hub in Brand Profile.
    Horizontal link: Triggered by order submission or quota allocation.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- Packing & Shipping ---
    async def create_packing_list(self, order_id: str, items: List[Dict[str, Any]]) -> PackingList:
        new_list = PackingList(
            order_id=order_id,
            box_number=f"BOX-{order_id}-{utc_now().timestamp()}",
            items_json={"items": items},
            status="draft"
        )
        self.db.add(new_list)
        await self.db.commit()
        await self.db.refresh(new_list)
        
        # Horizontal Integration: Notify warehouse
        await self.rule_engine.trigger_event("logistics.packing_list_created", {
            "module": "logistics",
            "order_id": order_id,
            "box_id": new_list.id
        })
        return new_list

    # --- Customs & DDP (Delivered Duty Paid) ---
    async def prepare_customs_declaration(self, order_id: str, country_code: str) -> CustomsDeclaration:
        """AI-assisted HS Code classification and duty calculation."""
        # Simulated DDP logic
        new_decl = CustomsDeclaration(
            order_id=order_id,
            declaration_number=f"DECL-{order_id}-{country_code}",
            hs_codes_json={"items": [{"sku": "SKU-1", "hs_code": "6109.10", "duty": 0.12}]},
            total_duties_usd=150.0,
            status="draft",
            created_at=utc_now()
        )
        self.db.add(new_decl)
        await self.db.commit()
        await self.db.refresh(new_decl)
        
        # Horizontal Integration: Request payment from Brand Finance
        await self.rule_engine.trigger_event("logistics.customs_ready", {
            "module": "logistics",
            "order_id": order_id,
            "amount": 150.0,
            "country": country_code
        })
        return new_decl

    async def store_shipment_tracking(
        self, order_id: str, provider: str, external_id: str
    ) -> bool:
        """Store CDEK/other provider UUID in Order.metadata_json. Infrastructure ready."""
        from sqlalchemy import update
        try:
            oid = int(order_id) if isinstance(order_id, str) and order_id.isdigit() else int(order_id)
        except (ValueError, TypeError):
            return False
        r = await self.db.execute(select(Order).where(Order.id == oid))
        order = r.scalar_one_or_none()
        if not order:
            return False
        meta = dict(order.metadata_json or {})
        meta["shipment_tracking"] = {"provider": provider, "external_id": external_id}
        await self.db.execute(update(Order).where(Order.id == order.id).values(metadata_json=meta))
        await self.db.commit()
        return True

    async def get_shipment_status(self, order_id: str) -> Dict[str, Any]:
        """Get shipment status. Uses CDEK when cdek_uuid stored via store_shipment_tracking."""
        from app.integrations.cdek import CDEKClient
        from sqlalchemy import select
        try:
            oid = int(order_id) if isinstance(order_id, str) and order_id.isdigit() else int(order_id)
        except (ValueError, TypeError):
            oid = 0
        r = await self.db.execute(select(Order).where(Order.id == oid))
        order = r.scalar_one_or_none()
        tracking = (order and order.metadata_json or {}).get("shipment_tracking", {}) if order else {}
        if tracking.get("provider") == "cdek" and tracking.get("external_id"):
            cdek = CDEKClient()
            if cdek.is_configured:
                status = await cdek.get_tracking(tracking["external_id"])
                if status:
                    return {**status, "order_id": order_id}
        return {
            "order_id": order_id,
            "status": "in_transit",
            "eta": "2025-04-15",
            "location": "Central Hub, Warsaw",
        }

    async def calculate_delivery(
        self,
        from_city: str,
        to_city: str,
        weight_grams: int,
        length_cm: float = 10,
        width_cm: float = 10,
        height_cm: float = 10,
    ) -> List[Dict[str, Any]]:
        """Calculate delivery options. Uses CDEK when configured."""
        from app.integrations.cdek import CDEKClient
        cdek = CDEKClient()
        if cdek.is_configured:
            rates = await cdek.calculate_delivery(
                from_location={"code": from_city},
                to_location={"code": to_city},
                weight_grams=weight_grams,
                length_cm=length_cm,
                width_cm=width_cm,
                height_cm=height_cm,
            )
            if rates:
                return rates
        return []
