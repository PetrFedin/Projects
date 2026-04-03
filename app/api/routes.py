from fastapi import APIRouter
from app.api.v1.endpoints import (
    intelligence, product, tasks, quota, retail, logistics, fintech, product_testing,
    factory, marketing, staff, analytics, risk, creative, circular, custom, wardrobe,
    compliance, marketing_crm, wholesale, supply_chain, expansion, academy, collaboration, audit,
    esg, loyalty, assets, admin, forecasting, size_curves,
    global_compliance, sustainability, smart_contracts,
    auth, dashboard, orders, seasons, showrooms, dam, profile, buyer, plm, collections, pricing, inventory,
    client, distributor, ai_routes, alerts, search, ingestion, organization, brand,
    auctions, marketplace,
)

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
router.include_router(organization.router, prefix="/organization", tags=["organization"])
router.include_router(brand.router, prefix="/brand", tags=["brand"])
router.include_router(profile.router, prefix="/profile", tags=["profile"])
router.include_router(plm.router, prefix="/plm", tags=["plm"])
router.include_router(collections.router, prefix="/collections", tags=["collections"])
router.include_router(pricing.router, prefix="/pricing", tags=["pricing"])
router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
router.include_router(compliance.router, prefix="/compliance", tags=["compliance"])
router.include_router(fintech.router, prefix="/fintech", tags=["fintech"])
router.include_router(academy.router, prefix="/academy", tags=["academy"])
router.include_router(marketing.router, prefix="/marketing", tags=["marketing"])
router.include_router(collaboration.router, prefix="/collaboration", tags=["collaboration"])
router.include_router(orders.router, prefix="/orders", tags=["orders"])
router.include_router(seasons.router, prefix="/seasons", tags=["seasons"])
router.include_router(showrooms.router, prefix="/showrooms", tags=["showrooms"])
router.include_router(dam.router, prefix="/dam", tags=["dam"])
router.include_router(buyer.router, prefix="/buyer", tags=["buyer"])
router.include_router(intelligence.router, prefix="/intelligence", tags=["intelligence"])
router.include_router(ai_routes.router, prefix="/ai", tags=["ai"])
router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(ingestion.router, prefix="/ingestion", tags=["ingestion"])
router.include_router(product.router, prefix="/product", tags=["product"])
router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
router.include_router(quota.router, prefix="/quota", tags=["quota"])
router.include_router(retail.router, prefix="/retail", tags=["retail"])
router.include_router(logistics.router, prefix="/logistics", tags=["logistics"])
router.include_router(product_testing.router, prefix="/product-testing", tags=["product-testing"])
router.include_router(factory.router, prefix="/factory", tags=["factory"])
router.include_router(client.router, prefix="/client", tags=["client"])
router.include_router(distributor.router, prefix="/distributor", tags=["distributor"])
router.include_router(marketing_crm.router, prefix="/marketing-crm", tags=["marketing-crm"])
router.include_router(wholesale.router, prefix="/wholesale", tags=["wholesale"])
router.include_router(supply_chain.router, prefix="/supply-chain", tags=["supply-chain"])
router.include_router(staff.router, prefix="/staff", tags=["staff"])
router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
router.include_router(risk.router, prefix="/risk", tags=["risk"])
router.include_router(creative.router, prefix="/creative", tags=["creative"])
router.include_router(circular.router, prefix="/circular", tags=["circular"])
router.include_router(custom.router, prefix="/custom", tags=["custom"])
router.include_router(wardrobe.router, prefix="/wardrobe", tags=["wardrobe"])
router.include_router(expansion.router, prefix="/expansion", tags=["expansion"])
router.include_router(audit.router, prefix="/audit", tags=["audit"])
router.include_router(esg.router, prefix="/esg", tags=["esg"])
router.include_router(loyalty.router, prefix="/loyalty", tags=["loyalty"])
router.include_router(assets.router, prefix="/assets", tags=["assets"])
router.include_router(admin.router, prefix="/admin", tags=["admin"])
router.include_router(auctions.router, prefix="/auctions", tags=["auctions"])
router.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])
router.include_router(forecasting.router, prefix="/forecasting", tags=["forecasting"])
router.include_router(size_curves.router, prefix="/size-curves", tags=["size-curves"])
router.include_router(global_compliance.router, prefix="/global-compliance", tags=["global-compliance"])
router.include_router(sustainability.router, prefix="/sustainability", tags=["sustainability"])
router.include_router(smart_contracts.router, prefix="/smart-contracts", tags=["smart-contracts"])

@router.get("/")
async def root():
    return {"message": "Welcome to Synth-1 API v1"}
