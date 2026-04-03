"""EAC, marking codes, compliance certificates and shipping checks."""
from typing import List, Dict, Any
from app.core.datetime_util import utc_now
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import (
    User, EACCertificate, ChestnyZnakCode, ComplianceCertificate,
    ProductionBatch,
)


class ComplianceCertService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def register_eac_certificate(self, sku_list: List[str], cert_number: str) -> EACCertificate:
        cert = EACCertificate(
            organization_id=self.current_user.organization_id,
            certificate_number=cert_number,
            sku_list_json={"skus": sku_list},
            status="active"
        )
        self.db.add(cert)
        await self.db.commit()
        await self.db.refresh(cert)
        return cert

    async def order_marking_codes(self, sku_id: str, batch_id: str, quantity: int) -> List[ChestnyZnakCode]:
        codes = []
        for i in range(quantity):
            code = ChestnyZnakCode(
                organization_id=self.current_user.organization_id,
                sku_id=sku_id,
                batch_id=batch_id,
                gtin="0460000000000",
                serial_number=f"CZ-{sku_id}-{batch_id}-{i:04d}",
                status="ordered"
            )
            self.db.add(code)
            codes.append(code)
        await self.db.commit()
        return codes

    async def register_compliance_certificate(self, data: Dict[str, Any]) -> ComplianceCertificate:
        cert = ComplianceCertificate(
            organization_id=self.current_user.organization_id,
            **data,
            status="active"
        )
        self.db.add(cert)
        await self.db.commit()
        await self.db.refresh(cert)
        return cert

    async def check_compliance_for_shipping(self, batch_id: int) -> Dict[str, Any]:
        stmt_batch = select(ProductionBatch).filter_by(id=batch_id)
        batch = (await self.db.execute(stmt_batch)).scalar_one_or_none()
        if not batch:
            raise ValueError("Batch not found")
        stmt_s_certs = select(ComplianceCertificate).filter_by(supplier_id=int(batch.factory_id), cert_type="ISO")
        s_certs = (await self.db.execute(stmt_s_certs)).scalars().all()
        s_expired = [c.cert_number for c in s_certs if c.valid_until < utc_now()]
        stmt_eac = select(ComplianceCertificate).filter_by(cert_type="EAC").filter(
            ComplianceCertificate.metadata_json["skus"].contains([batch.sku_id])
        )
        eac = (await self.db.execute(stmt_eac)).scalar_one_or_none()
        is_blocked = len(s_expired) > 0 or eac is None or (eac and eac.valid_until < utc_now())
        return {
            "batch_id": batch_id,
            "can_ship": not is_blocked,
            "block_reasons": [
                f"Expired Supplier Certs: {', '.join(s_expired)}" if s_expired else None,
                "Missing or Expired EAC Certificate" if (eac is None or (eac and eac.valid_until < utc_now())) else None
            ],
            "eac_status": eac.status if eac else "missing"
        }
