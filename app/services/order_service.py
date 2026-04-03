from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.db.models.base import Order, User, OrderItem
from app.db.repositories.order import OrderRepository
from app.services.rule_engine import RuleEngine
from app.core.logging import logger
from app.api.schemas.order import OrderCreate, OrderItemCreate

class OrderService:
    def __init__(self, db: AsyncSession, current_user: Optional[User] = None):
        self.db = db
        self.current_user = current_user
        self.repo = OrderRepository(db, current_user=current_user)
        self.rule_engine = RuleEngine(db, current_user=current_user)

    async def create_draft(self, order_data: Dict[str, Any]) -> Order:
        """
        Creates a new order in 'draft' status.
        """
        items = order_data.get("items", [])
        total = sum(item.get("quantity", 0) * item.get("unit_price", 0.0) for item in items)
        
        brand_roles = ("brand_admin", "brand_manager", "sales_rep", "platform_admin")
        org_id = (self.current_user.organization_id if (self.current_user and self.current_user.role in brand_roles) else None) or order_data.get("organization_id") or (self.current_user.organization_id if self.current_user else "")
        new_order = Order(
            organization_id=org_id,
            buyer_id=order_data.get("buyer_id"),
            seller_organization_id=order_data.get("seller_organization_id") or order_data.get("organization_id"),
            buyer_organization_id=order_data.get("buyer_organization_id") or order_data.get("buyer_id"),
            status="draft",
            total_amount=total,
            currency=order_data.get("currency", "USD"),
            note=order_data.get("note"),
            items_json={"items": items},
            metadata_json=order_data.get("metadata_json")
        )
        
        created = await self.repo.create(new_order)
        
        # Add items to order_items table if they are provided
        for item in items:
            order_item = OrderItem(
                order_id=created.id,
                product_name=item.get("product_name", "Unknown"),
                sku=item.get("sku_id") or item.get("sku"),
                color=item.get("color"),
                size_label=item.get("size_label"),
                quantity=item.get("quantity", 1),
                wholesale_price=item.get("unit_price") or item.get("wholesale_price", 0.0)
            )
            self.db.add(order_item)
        
        if items:
            await self.db.commit()

        logger.info(f"Order draft created: ID {created.id} for Org {created.organization_id}")
        return created

    async def update_draft(self, order_id: int, data: Dict[str, Any]) -> Optional[Order]:
        """Always-On Cart: persist draft changes between sessions."""
        order = await self.repo.get(order_id)
        if not order or order.status != "draft":
            return None
        updates = {}
        if "items" in data and data["items"] is not None:
            items = data["items"]
            total = sum((it.get("quantity", 0) or 0) * float(it.get("unit_price", 0) or 0) for it in items)
            updates["items_json"] = {"items": items}
            updates["total_amount"] = total
        if "note" in data and data["note"] is not None:
            updates["note"] = data["note"]
        if "metadata_json" in data and data["metadata_json"] is not None:
            updates["metadata_json"] = data["metadata_json"]
        if updates:
            return await self.repo.update(order_id, **updates)
        return order

    async def add_order_item(self, order_id: int, item_data: OrderItemCreate) -> OrderItem:
        """Adds an item to a draft order."""
        order = await self.repo.get(order_id)
        if not order or order.status != "draft":
            raise Exception("Order not found or is not in draft status")

        new_item = OrderItem(
            order_id=order_id,
            product_name=item_data.product_name,
            sku=item_data.sku,
            color=item_data.color,
            size_label=item_data.size_label,
            quantity=item_data.quantity,
            wholesale_price=item_data.wholesale_price
        )
        self.db.add(new_item)
        
        # Update total amount
        order.total_amount += new_item.wholesale_price * new_item.quantity
        
        await self.db.commit()
        await self.db.refresh(new_item)
        return new_item

    async def validate_order(self, order_id: int) -> Dict[str, Any]:
        """
        Runs business rules validation via RuleEngine.
        """
        order = await self.repo.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
            
        return await self.rule_engine.validate_order(order)

    async def submit_order(self, order_id: int) -> Order:
        """
        Validates and transitions order from 'draft' to 'submitted'.
        """
        order = await self.repo.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
            
        if order.status != "draft":
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot submit order in status '{order.status}'. Only 'draft' orders can be submitted."
            )
            
        # 1. Final Validation
        validation = await self.rule_engine.validate_order(order)
        if not validation["is_valid"]:
            raise HTTPException(
                status_code=400, 
                detail={"message": "Order validation failed", "errors": validation["errors"]}
            )
            
        # 2. Transition status
        updated = await self.repo.update(order_id, status="submitted")
        logger.info(f"Order {order_id} submitted successfully")
        
        return updated

    async def cancel_order(self, order_id: int) -> Order:
        """
        Cancels an order if it's not already processed.
        """
        order = await self.repo.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
            
        if order.status in ["processed", "shipped", "completed"]:
            raise HTTPException(status_code=400, detail=f"Cannot cancel order in status '{order.status}'")
            
        updated = await self.repo.update(order_id, status="cancelled")
        logger.info(f"Order {order_id} cancelled")
        return updated
