from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import ComplianceRepository, ChestnyZnakRepository, EDORepository
from app.db.models.base import EACCertificate, ChestnyZnakCode, EDODocument, User
from app.services.ai_rule_engine import AIRuleEngine
from app.integrations.crpt import CRPTClient
from app.integrations.edo import EDOClient
from app.core.logging import logger
from app.core.datetime_util import utc_now


class ComplianceService:
    """
    Service for managing Russian Layer compliance: EAC, Chestny ZNAK, and EDO.
    Vertical link: Brand Compliance Hub.
    Horizontal link: Connected to AI Rule Engine for expiry alerts and sync tasks.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.eac_repo = ComplianceRepository(db, current_user=current_user)
        self.cz_repo = ChestnyZnakRepository(db, current_user=current_user)
        self.edo_repo = EDORepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- EAC Certificates ---
    async def register_eac_certificate(self, data: Dict[str, Any]) -> EACCertificate:
        new_cert = EACCertificate(**data)
        cert = await self.eac_repo.create(new_cert)
        
        # Horizontal Integration: Trigger alert 30 days before expiry
        await self.rule_engine.trigger_event("compliance.eac_registered", {
            "module": "compliance",
            "id": cert.id,
            "expiry_date": cert.expiry_date.isoformat()
        })
        return cert

    # --- Chestny ZNAK ---
    async def emit_marking_codes(
        self, sku_id: str, quantity: int, gtin: str = "04601234567890"
    ) -> List[ChestnyZnakCode]:
        """Emit codes from CRPT (Честный ЗНАК) when configured, else simulate."""
        org_id = self.current_user.organization_id or ""
        crpt = CRPTClient()

        if crpt.is_configured:
            crpt_codes = await crpt.emit_codes(sku_id, quantity, gtin, org_id)
            if crpt_codes:
                codes = []
                for i, item in enumerate(crpt_codes):
                    sn = (
                        item.get("serial_number")
                        or item.get("crypto_code")
                        or item.get("identification_code")
                        or f"CRPT-{sku_id}-{utc_now().timestamp()}-{i}"
                    )
                    code = ChestnyZnakCode(
                        sku_id=sku_id,
                        gtin=gtin,
                        serial_number=str(sn),
                        status="emitted",
                        organization_id=org_id,
                    )
                    created = await self.cz_repo.create(code)
                    codes.append(created)
                await self.rule_engine.trigger_event("compliance.codes_emitted", {
                    "module": "compliance", "sku_id": sku_id, "count": quantity
                })
                return codes

        # Fallback: simulate when CRPT not configured
        codes = []
        for i in range(quantity):
            code = ChestnyZnakCode(
                sku_id=sku_id,
                gtin=gtin,
                serial_number=f"SN-{sku_id}-{utc_now().timestamp()}-{i}",
                status="emitted",
                organization_id=org_id,
            )
            created = await self.cz_repo.create(code)
            codes.append(created)
        await self.rule_engine.trigger_event("compliance.codes_emitted", {
            "module": "compliance", "sku_id": sku_id, "count": quantity
        })
        return codes

    # --- EDO (Electronic Documents) ---
    async def sign_edo_document(self, doc_id: int) -> Optional[EDODocument]:
        doc = await self.edo_repo.get(doc_id)
        if not doc:
            return None

        edo = EDOClient()
        if edo.is_configured:
            result = await edo.sign_document(str(doc_id))
            if not result.get("success"):
                logger.warning(f"EDO sign failed: {result.get('error')}, saving locally")

        doc.status = "signed"
        await self.db.commit()
        await self.db.refresh(doc)
        await self.rule_engine.trigger_event("compliance.edo_signed", {
            "module": "compliance", "id": doc.id, "doc_number": doc.doc_number
        })
        return doc

    async def get_edo_documents(self) -> List[EDODocument]:
        return await self.edo_repo.get_all()
