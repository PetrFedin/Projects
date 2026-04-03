from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.wholesale import (
    WholesaleRepository, MOQRepository, CreditLimitRepository, 
    SeasonalCreditRepository, MessageRepository, OrderLogRepository, 
    MemoRepository, BNPLRepository, ExclusivityRepository, LinesheetRepository,
    QuoteRepository, AssortmentRepository
)
from app.db.repositories.showroom import ShowroomRepository
from app.db.models.base import (
    User, B2BDiscount, MOQSetting, CreditLimit, SeasonalCredit, 
    WholesaleMessage, OrderLog, CreditMemo, WholesaleBNPL, DealerExclusivity,
    Linesheet, Showroom, Order, LinesheetItem, Quote, Assortment
)
from app.services.linesheet_service import LinesheetService
from app.services.order_service import OrderService
from app.api.schemas.wholesale import LinesheetCreate, LinesheetItemCreate
from app.core.datetime_util import utc_now

class WholesaleService:
    """
    Service for managing wholesale operations, B2B logic, and linesheet generation.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        # Repositories
        self.discount_repo = WholesaleRepository(db, current_user=current_user)
        self.moq_repo = MOQRepository(db, current_user=current_user)
        self.limit_repo = CreditLimitRepository(db, current_user=current_user)
        self.credit_repo = SeasonalCreditRepository(db, current_user=current_user)
        self.msg_repo = MessageRepository(db, current_user=current_user)
        self.log_repo = OrderLogRepository(db, current_user=current_user)
        self.memo_repo = MemoRepository(db, current_user=current_user)
        self.bnpl_repo = BNPLRepository(db, current_user=current_user)
        self.exclusivity_repo = ExclusivityRepository(db, current_user=current_user)
        self.linesheet_repo = LinesheetRepository(db, current_user=current_user)
        self.showroom_repo = ShowroomRepository(db, current_user=current_user)
        self.quote_repo = QuoteRepository(db, current_user=current_user)
        self.assortment_repo = AssortmentRepository(db, current_user=current_user)
        self.order_service = OrderService(db, current_user=current_user)

    # --- Discounts & MOQ ---
    async def get_all_discounts(self) -> List[B2BDiscount]:
        return await self.discount_repo.get_all_discounts()

    async def create_discount(self, data: Dict[str, Any]) -> B2BDiscount:
        new_discount = B2BDiscount(**data)
        return await self.discount_repo.create(new_discount)

    async def get_sku_moq(self, sku_id: str, country_code: Optional[str] = None) -> Optional[MOQSetting]:
        return await self.moq_repo.get_by_sku(sku_id, country_code)

    # --- Linesheets ---
    async def get_linesheets(self, season: Optional[str] = None) -> List[Linesheet]:
        if season:
            return await self.linesheet_repo.get_by_season(season)
        return await self.linesheet_repo.get_all()

    async def create_linesheet(self, data: LinesheetCreate) -> Linesheet:
        """Creates a new linesheet."""
        sku_json = data.sku_list_json if isinstance(data.sku_list_json, (dict, list)) else []
        sku_list = sku_json.get("skus", sku_json.get("items", [])) if isinstance(sku_json, dict) else sku_json
        sku_store = {"skus": sku_list} if isinstance(sku_list, list) else (sku_list if isinstance(sku_list, dict) else {"skus": []})
        new_linesheet = Linesheet(
            organization_id=self.current_user.organization_id,
            title=data.title,
            season=data.season,
            status=data.status,
            sku_list_json=sku_store,
            metadata_json=data.metadata_json,
            created_at=utc_now()
        )
        return await self.linesheet_repo.create(new_linesheet)

    async def add_linesheet_item(self, linesheet_id: int, item_data: LinesheetItemCreate) -> LinesheetItem:
        """Adds a product item to a linesheet."""
        # Check access
        linesheet = await self.linesheet_repo.get(linesheet_id)
        if not linesheet or (self.current_user.role != "platform_admin" and linesheet.organization_id != self.current_user.organization_id):
            raise Exception("Linesheet not found or access denied")

        new_item = LinesheetItem(
            linesheet_id=linesheet_id,
            product_name=item_data.product_name,
            sku=item_data.sku,
            color=item_data.color,
            size_range=item_data.size_range,
            wholesale_price=item_data.wholesale_price,
            moq=item_data.moq
        )
        self.db.add(new_item)
        await self.db.commit()
        await self.db.refresh(new_item)
        return new_item

    async def generate_linesheet_pdf(self, linesheet_id: int) -> str:
        linesheet = await self.linesheet_repo.get(linesheet_id)
        if not linesheet:
            return None
        
        service = LinesheetService()
        pdf_url = await service.generate(
            linesheet_id=linesheet.id,
            title=linesheet.title,
            skus=linesheet.sku_list_json
        )
        
        await self.linesheet_repo.update(linesheet_id, pdf_url=pdf_url)
        return pdf_url

    # --- Credit & Finance ---
    async def get_partner_credit_limit(self, partner_id: str) -> Optional[CreditLimit]:
        return await self.limit_repo.get_by_partner(partner_id)

    async def get_seasonal_credits(self, partner_id: str, season: str) -> List[SeasonalCredit]:
        return await self.credit_repo.get_by_partner_and_season(partner_id, season)

    # --- Communication & Logs ---
    async def get_order_messages(self, order_id: str) -> List[WholesaleMessage]:
        return await self.msg_repo.get_order_messages(order_id)

    async def log_order_action(self, order_id: str, action: str, details: Optional[Dict] = None) -> OrderLog:
        new_log = OrderLog(
            order_id=order_id,
            action=action,
            details_json=details,
            actor_id=self.current_user.id
        )
        return await self.log_repo.create(new_log)

    # --- Integrated Wholesale Workflows ---
    async def create_draft_from_selection(self, data: Dict[str, Any]) -> Order:
        """
        Takes a selection from a Showroom or Linesheet and creates a Draft Order.
        Applies Wholesale rules like MOQ and Discounts.
        """
        buyer_id = data.get("buyer_id")
        items = data.get("items", [])
        
        # 1. Prepare order data for OrderService
        order_data = {
            "organization_id": self.current_user.organization_id,
            "buyer_id": buyer_id,
            "items": items,
            "metadata_json": {
                "source": "showroom" if data.get("showroom_id") else "linesheet",
                "source_id": data.get("showroom_id") or data.get("linesheet_id"),
                "context": data.get("metadata_json")
            }
        }
        
        # 2. Use existing OrderService to create the draft
        order = await self.order_service.create_draft(order_data)
        
        # 3. Log the action
        await self.log_order_action(
            order_id=str(order.id), 
            action="draft_created_from_selection",
            details={"source": order_data["metadata_json"]["source"]}
        )
        
        return order

    async def create_quote(self, data: Dict[str, Any]) -> Quote:
        import uuid
        quote_number = f"QT-{uuid.uuid4().hex[:8].upper()}"
        total = sum(
            (it.get("quantity", 0) or 0) * float(it.get("unit_price", 0) or 0)
            for it in data.get("items_json", {}).get("items", data.get("items_json", []))
        ) if isinstance(data.get("items_json"), dict) else 0
        items = data.get("items_json", [])
        if isinstance(items, list):
            total = sum((it.get("quantity", 0) or 0) * float(it.get("unit_price", 0) or 0) for it in items)
            items = {"items": items}
        quote = Quote(
            organization_id=self.current_user.organization_id,
            buyer_id=data["buyer_id"],
            quote_number=quote_number,
            items_json=items if isinstance(items, dict) else {"items": items},
            total_amount=total or data.get("total_amount", 0),
            currency=data.get("currency", "USD"),
            status="draft",
            expires_at=data.get("expires_at"),
            note=data.get("note"),
        )
        return await self.quote_repo.create(quote)

    async def update_quote_status(self, quote_id: int, status: str) -> Optional[Quote]:
        quote = await self.quote_repo.get(quote_id)
        if not quote or quote.organization_id != self.current_user.organization_id:
            return None
        if status not in ("draft", "sent", "accepted", "expired"):
            return None
        quote.status = status
        await self.db.commit()
        await self.db.refresh(quote)
        return quote

    async def get_quotes(self) -> List[Quote]:
        return await self.quote_repo.get_by_organization()

    async def attach_linesheet_to_showroom(self, showroom_id: int, linesheet_id: int) -> Showroom:
        """Links a specific linesheet to a showroom for interactive ordering."""
        return await self.showroom_repo.update(showroom_id, linesheet_id=linesheet_id)

    # --- Assortments (NuOrder) ---
    async def get_assortments(self, collection_id: Optional[str] = None) -> List[Assortment]:
        if collection_id:
            return await self.assortment_repo.get_by_collection(collection_id)
        return await self.assortment_repo.get_all()

    async def create_assortment(self, data: "AssortmentCreate") -> Assortment:
        from app.api.schemas.wholesale import AssortmentCreate
        retail = data.retailer_ids if isinstance(data.retailer_ids, list) else []
        sku_list = data.sku_list_json if isinstance(data.sku_list_json, list) else []
        new_a = Assortment(
            organization_id=self.current_user.organization_id,
            collection_id=data.collection_id,
            name=data.name,
            retailer_ids={"ids": retail} if retail else {},
            sku_list_json={"items": sku_list} if sku_list else {},
            status=data.status,
        )
        return await self.assortment_repo.create(new_a)

    async def update_assortment(self, assortment_id: int, data: "AssortmentUpdate") -> Optional[Assortment]:
        from app.api.schemas.wholesale import AssortmentUpdate
        updates = {}
        if data.name is not None:
            updates["name"] = data.name
        if data.retailer_ids is not None:
            updates["retailer_ids"] = {"ids": data.retailer_ids}
        if data.sku_list_json is not None:
            updates["sku_list_json"] = {"items": data.sku_list_json}
        if data.status is not None:
            updates["status"] = data.status
        if not updates:
            return await self.assortment_repo.get(assortment_id)
        return await self.assortment_repo.update(assortment_id, **updates)

    async def get_assortment(self, assortment_id: int) -> Optional[Assortment]:
        return await self.assortment_repo.get(assortment_id)
