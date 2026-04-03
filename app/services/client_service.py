from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.product import WardrobeRepository, BodyScanRepository, WalletRepository, WalletTransactionRepository
from app.db.models.base import User, WardrobeItem, BodyScan, UserWallet, WalletTransaction
from app.services.ai_rule_engine import AIRuleEngine
from app.core.datetime_util import utc_now

class ClientService:
    """
    Service for Client OS: Wardrobe, Body Scans, and Personal Finance (Wallet).
    Vertical link: Client Profile hub.
    Horizontal link: Connected to AI Rule Engine for size recommendations and rewards.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.wardrobe_repo = WardrobeRepository(db, current_user=current_user)
        self.scan_repo = BodyScanRepository(db, current_user=current_user)
        self.wallet_repo = WalletRepository(db, current_user=current_user)
        self.tx_repo = WalletTransactionRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- Digital Wardrobe ---
    async def get_wardrobe(self) -> List[WardrobeItem]:
        return await self.wardrobe_repo.get_all()

    async def add_to_wardrobe(self, sku_id: str) -> WardrobeItem:
        new_item = WardrobeItem(
            customer_id=self.current_user.id,
            sku_id=sku_id,
            purchase_date=utc_now()
        )
        item = await self.wardrobe_repo.create(new_item)
        
        # Horizontal Integration: Trigger event for new purchase
        await self.rule_engine.trigger_event("client.wardrobe_updated", {
            "module": "client",
            "id": item.id,
            "sku_id": sku_id
        })
        return item

    # --- AI Body Scan ---
    async def save_body_scan(self, data: Dict[str, Any]) -> BodyScan:
        new_scan = BodyScan(
            customer_id=self.current_user.id,
            **data,
            created_at=utc_now()
        )
        scan = await self.scan_repo.create(new_scan)
        
        # Horizontal Integration: Trigger event for new scan to suggest sizes
        await self.rule_engine.trigger_event("client.body_scan_completed", {
            "module": "client",
            "id": scan.id,
            "height": scan.height_cm
        })
        return scan

    # --- Wallet & Payments ---
    async def get_wallet(self) -> UserWallet:
        # Simplified: ensure wallet exists
        wallets = await self.wallet_repo.get_all()
        wallet = next((w for w in wallets if w.user_id == self.current_user.id), None)
        
        if not wallet:
            wallet = UserWallet(
                user_id=self.current_user.id,
                balance=0.0,
                bonus_points=0
            )
            wallet = await self.wallet_repo.create(wallet)
        return wallet

    async def process_cashback(self, amount: float, bonus_points: int = 0) -> UserWallet:
        wallet = await self.get_wallet()
        wallet.balance += amount
        wallet.bonus_points += bonus_points
        
        tx = WalletTransaction(
            wallet_id=wallet.id,
            amount=amount,
            transaction_type="cashback",
            description=f"Cashback for purchase: {bonus_points} pts added"
        )
        await self.tx_repo.create(tx)
        
        await self.db.commit()
        await self.db.refresh(wallet)
        return wallet
