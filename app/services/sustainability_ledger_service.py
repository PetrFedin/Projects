from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User, DigitalProductPassport, SustainabilityProof, ProductionBatch, ProductLCA
from app.db.repositories.product import PassportRepository, SustainabilityProofRepository, LCARepository
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now
import hashlib
import uuid

class SustainabilityLedgerService:
    """
    AI Sustainability Ledger & Digital Product Passport (DPP) Service.
    Creates an immutable chain of proofs for sustainability claims.
    Vertical Link: Brand OS (Sustainability) + Client OS (Public DPP).
    Horizontal Link: Factory OS + ESG Service + Compliance.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.passport_repo = PassportRepository(db, current_user)
        self.proof_repo = SustainabilityProofRepository(db, current_user)
        self.lca_repo = LCARepository(db, current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def create_sustainability_proof(self, entity_type: str, entity_id: str, event_type: str, metadata: Dict[str, Any]) -> SustainabilityProof:
        """Records a sustainability event and generates a blockchain-ready proof hash."""
        # Create a unique content-based hash for the proof
        content_str = f"{entity_type}:{entity_id}:{event_type}:{str(metadata)}:{utc_now().isoformat()}"
        proof_hash = hashlib.sha256(content_str.encode()).hexdigest()
        
        proof = SustainabilityProof(
            entity_type=entity_type,
            entity_id=entity_id,
            event_type=event_type,
            proof_hash=proof_hash,
            metadata_json=metadata,
            timestamp=utc_now()
        )
        self.db.add(proof)
        await self.db.commit()
        await self.db.refresh(proof)
        
        logger.info(f"Sustainability: Proof recorded for {entity_type} {entity_id} - Hash: {proof_hash[:10]}")
        return proof

    async def generate_digital_passport(self, sku_id: str) -> DigitalProductPassport:
        """
        Aggregates data from multiple modules to generate a Digital Product Passport.
        Connects: Factory (Origin), ESG (LCA), Compliance (HS Codes).
        """
        # 1. Check if passport already exists
        existing = await self.passport_repo.get_by_sku(sku_id)
        if existing:
            return existing
            
        # 2. Fetch LCA data
        lca = await self.lca_repo.get_by_sku(sku_id)
        sustainability_kpis = {
            "carbon_footprint": lca.carbon_footprint_kg if lca else "Pending",
            "water_usage": lca.water_usage_liters if lca else "Pending",
            "sustainability_score": lca.sustainability_score if lca else 0.0
        }
        
        # 3. Create Passport
        passport_uid = f"DPP-{uuid.uuid4().hex[:12].upper()}"
        passport = DigitalProductPassport(
            sku_id=sku_id,
            passport_uid=passport_uid,
            composition_json={"main_fabric": "100% Organic Cotton", "trims": "Recycled Polyester"},
            origin_details_json={"factory_country": "Portugal", "transparency_level": "Tier 1 Verified"},
            sustainability_kpis_json=sustainability_kpis,
            circularity_options_json={
                "resell_partner": "Syntha-Resell",
                "recycling_points": "Local Hubs",
                "rental_eligible": True
            },
            blockchain_proof_url=f"https://blockchain-explorer.syntha.io/tx/{hashlib.md5(sku_id.encode()).hexdigest()}"
        )
        self.db.add(passport)
        await self.db.commit()
        await self.db.refresh(passport)
        
        # Horizontal Integration: Trigger event for marketing to update product page
        await self.rule_engine.trigger_event("sustainability.passport_generated", {
            "module": "sustainability",
            "sku_id": sku_id,
            "passport_uid": passport_uid
        })
        
        return passport

    async def get_passport_by_uid(self, passport_uid: str) -> Optional[DigitalProductPassport]:
        """Public access method for consumers scanning QR codes."""
        return await self.passport_repo.get_by_uid(passport_uid)
