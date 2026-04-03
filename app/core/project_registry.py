from dataclasses import dataclass, field
from enum import StrEnum
from typing import Any


class RoleCode(StrEnum):
    ADMINISTRATOR = "administrator"
    BRAND = "brand"
    STORE = "store"
    DISTRIBUTOR = "distributor"
    SUPPLIER = "supplier"
    PRODUCTION = "production"
    CLIENT = "client"


class SectionCode(StrEnum):
    DASHBOARD = "dashboard"
    COLLECTIONS = "collections"
    PARTNERS = "partners"
    SHOWROOMS = "showrooms"
    LINESHEETS = "linesheets"
    DRAFT_ORDERS = "draft_orders"
    ORDERS = "orders"
    BUYER_WORKSPACE = "buyer_workspace"
    BRAND_WORKSPACE = "brand_workspace"
    ANALYTICS = "analytics"
    SETTINGS = "settings"
    AI_INSIGHTS = "ai_insights"
    TASK_CENTER = "task_center"
    CAMPAIGN_GENERATOR = "campaign_generator"
    AI_PRICING = "ai_pricing"
    VMI_PORTAL = "vmi_portal"
    ESG_IMPACT = "esg_impact"
    B2B_ACADEMY = "b2b_academy"
    FINANCE_HUB = "finance_hub"
    LOYALTY_CRM = "loyalty_crm"
    RUSSIAN_LAYER = "russian_layer"
    PRODUCTION_HUB = "production_hub"
    WHOLESALE_HUB = "wholesale_hub"
    SUPPLY_CHAIN = "supply_chain"
    RETAIL_OPS = "retail_ops"
    MARKETPLACE = "marketplace"
    FINANCE = "finance"


@dataclass(slots=True)
class SectionSpec:
    code: SectionCode
    title: str
    description: str
    existing_host_page: str | None = None
    is_existing: bool = False
    required_roles: list[RoleCode] = field(default_factory=list)


@dataclass(slots=True)
class ModuleSpec:
    code: str
    title: str
    description: str
    section: SectionCode
    exists: bool = False
    status: str = "missing"  # missing | partial | ready
    service_path: str | None = None
    route_path: str | None = None
    model_paths: list[str] = field(default_factory=list)
    schema_paths: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)


SECTION_REGISTRY: dict[SectionCode, SectionSpec] = {
    SectionCode.DASHBOARD: SectionSpec(
        code=SectionCode.DASHBOARD,
        title="Dashboard",
        description="Общий обзор и входная точка роли",
        is_existing=True,
        required_roles=[role for role in RoleCode],
    ),
    SectionCode.COLLECTIONS: SectionSpec(
        code=SectionCode.COLLECTIONS,
        title="B2B Каталог",
        description="Коллекции, сезонные наборы, ассортимент",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.PARTNERS: SectionSpec(
        code=SectionCode.PARTNERS,
        title="Партнеры",
        description="Управление базой ритейлеров и дистрибьюторов",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.SHOWROOMS: SectionSpec(
        code=SectionCode.SHOWROOMS,
        title="Showrooms",
        description="Digital showroom и презентация коллекций",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.LINESHEETS: SectionSpec(
        code=SectionCode.LINESHEETS,
        title="Linesheets",
        description="Коммерческие таблицы товаров для заказа",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.DRAFT_ORDERS: SectionSpec(
        code=SectionCode.DRAFT_ORDERS,
        title="Draft Orders",
        description="Черновики оптовых заказов",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.ORDERS: SectionSpec(
        code=SectionCode.ORDERS,
        title="Orders",
        description="Работа с заказами и их статусами",
        is_existing=True,
        required_roles=[role for role in RoleCode],
    ),
    SectionCode.BUYER_WORKSPACE: SectionSpec(
        code=SectionCode.BUYER_WORKSPACE,
        title="Buyer Workspace",
        description="Рабочее пространство байера",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.BRAND_WORKSPACE: SectionSpec(
        code=SectionCode.BRAND_WORKSPACE,
        title="Brand Workspace",
        description="Рабочее пространство бренда",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.ANALYTICS: SectionSpec(
        code=SectionCode.ANALYTICS,
        title="Analytics",
        description="Аналитика по продажам, заказам, ассортименту",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR, RoleCode.SUPPLIER, RoleCode.PRODUCTION],
    ),
    SectionCode.SETTINGS: SectionSpec(
        code=SectionCode.SETTINGS,
        title="Settings",
        description="Настройки профиля, организации и платформы",
        is_existing=True,
        required_roles=[role for role in RoleCode],
    ),
    SectionCode.AI_INSIGHTS: SectionSpec(
        code=SectionCode.AI_INSIGHTS,
        title="AI Insights",
        description="AI-рекомендации и AI-аналитика",
        is_existing=False,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.TASK_CENTER: SectionSpec(
        code=SectionCode.TASK_CENTER,
        title="Task Center",
        description="Очередь задач и прогресс развития платформы",
        is_existing=False,
        required_roles=[RoleCode.ADMINISTRATOR],
    ),
    SectionCode.CAMPAIGN_GENERATOR: SectionSpec(
        code=SectionCode.CAMPAIGN_GENERATOR,
        title="Генератор кампаний",
        description="AI-генерация маркетинговых кампаний и контента",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND],
    ),
    SectionCode.AI_PRICING: SectionSpec(
        code=SectionCode.AI_PRICING,
        title="AI Ценообразование",
        description="Динамическое ценообразование и анализ маржинальности",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND],
    ),
    SectionCode.VMI_PORTAL: SectionSpec(
        code=SectionCode.VMI_PORTAL,
        title="VMI Портал",
        description="Vendor Managed Inventory: управление запасами на стороне ритейлеров",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.PRODUCTION],
    ),
    SectionCode.ESG_IMPACT: SectionSpec(
        code=SectionCode.ESG_IMPACT,
        title="ESG Влияние",
        description="Мониторинг экологического следа и устойчивости производства",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.PRODUCTION],
    ),
    SectionCode.B2B_ACADEMY: SectionSpec(
        code=SectionCode.B2B_ACADEMY,
        title="B2B Академия",
        description="Обучающие материалы и сертификация для партнеров",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE],
    ),
    SectionCode.FINANCE_HUB: SectionSpec(
        code=SectionCode.FINANCE_HUB,
        title="Кошелек Syntha",
        description="Внутренние расчеты, эскроу и финансовый мониторинг",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.LOYALTY_CRM: SectionSpec(
        code=SectionCode.LOYALTY_CRM,
        title="CRM & Лояльность",
        description="Управление базой клиентов и программами лояльности",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND],
    ),
    SectionCode.RUSSIAN_LAYER: SectionSpec(
        code=SectionCode.RUSSIAN_LAYER,
        title="Russian Layer",
        description="ЭДО, Маркировка (Честный ЗНАК) и локальное соответствие",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.PRODUCTION],
    ),
    SectionCode.WHOLESALE_HUB: SectionSpec(
        code=SectionCode.WHOLESALE_HUB,
        title="Wholesale Hub",
        description="B2B wholesale, showrooms, linesheets, draft orders",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.SUPPLY_CHAIN: SectionSpec(
        code=SectionCode.SUPPLY_CHAIN,
        title="Supply Chain",
        description="Logistics, bottlenecks, sourcing",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.DISTRIBUTOR, RoleCode.PRODUCTION],
    ),
    SectionCode.RETAIL_OPS: SectionSpec(
        code=SectionCode.RETAIL_OPS,
        title="Retail Ops",
        description="Retail operations and store management",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.MARKETPLACE: SectionSpec(
        code=SectionCode.MARKETPLACE,
        title="Marketplace",
        description="Buyer marketplace and catalog",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.FINANCE: SectionSpec(
        code=SectionCode.FINANCE,
        title="Finance",
        description="Finance and investment campaigns",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.STORE, RoleCode.DISTRIBUTOR],
    ),
    SectionCode.PRODUCTION_HUB: SectionSpec(
        code=SectionCode.PRODUCTION_HUB,
        title="Центр Производства",
        description="Полный контроль цикла производства: от материалов и техпакетов до массового пошива и логистики",
        is_existing=True,
        required_roles=[RoleCode.ADMINISTRATOR, RoleCode.BRAND, RoleCode.PRODUCTION],
    ),
}


MODULE_REGISTRY: dict[str, ModuleSpec] = {
    "digital_showroom": ModuleSpec(
        code="digital_showroom",
        title="Digital Showroom",
        description="Работа с шоурумами, товарными позициями и лук-блоками",
        section=SectionCode.SHOWROOMS,
        service_path="app/services/showroom_service.py",
        route_path="app/api/routes/showrooms.py",
        model_paths=["app/models/showroom.py"],
        schema_paths=["app/schemas/showroom.py"],
        tags=["wholesale", "joor-style", "showroom"],
    ),
    "linesheet_system": ModuleSpec(
        code="linesheet_system",
        title="Linesheet System",
        description="Оптовые таблицы товаров и коммерческих параметров",
        section=SectionCode.LINESHEETS,
        service_path="app/services/linesheet_service.py",
        route_path="app/api/routes/linesheets.py",
        model_paths=["app/models/linesheet.py"],
        schema_paths=["app/schemas/linesheet.py"],
        tags=["wholesale", "linesheet"],
    ),
    "draft_order_system": ModuleSpec(
        code="draft_order_system",
        title="Draft Order System",
        description="Черновики заказов до отправки и согласования",
        section=SectionCode.DRAFT_ORDERS,
        service_path="app/services/draft_order_service.py",
        route_path="app/api/routes/draft_orders.py",
        model_paths=["app/models/draft_order.py"],
        schema_paths=["app/schemas/draft_order.py"],
        tags=["orders", "wholesale"],
    ),
    "buyer_workspace": ModuleSpec(
        code="buyer_workspace",
        title="Buyer Workspace",
        description="Заметки, планирование и материалы для байера",
        section=SectionCode.BUYER_WORKSPACE,
        service_path="app/services/buyer_workspace_service.py",
        route_path="app/api/routes/workspaces.py",
        model_paths=["app/models/workspace.py"],
        schema_paths=["app/schemas/workspace_notes.py"],
        tags=["workspace", "buyer"],
    ),
    "brand_workspace": ModuleSpec(
        code="brand_workspace",
        title="Brand Workspace",
        description="Заметки, внутренние материалы и управление брендом",
        section=SectionCode.BRAND_WORKSPACE,
        service_path="app/services/brand_workspace_service.py",
        route_path="app/api/routes/workspaces.py",
        model_paths=["app/models/workspace.py"],
        schema_paths=["app/schemas/workspace_notes.py"],
        tags=["workspace", "brand"],
    ),
    "production_plm": ModuleSpec(
        code="production_plm",
        title="Production PLM",
        description="Полный цикл производства: сорсинг, техпакеты, образцы, соответствие",
        section=SectionCode.BRAND_WORKSPACE,
        exists=True,
        status="ready",
        service_path="app/services/production_service.py",
        route_path="app/api/v1/endpoints/plm.py",
        model_paths=["app/db/models/factory.py", "app/db/models/product.py"],
        schema_paths=["app/api/schemas/product.py"],
        tags=["plm", "production", "sourcing", "sampling"],
    ),
    "team_collaboration": ModuleSpec(
        code="team_collaboration",
        title="Team Collaboration",
        description="Управление задачами и уведомлениями внутри команды бренда",
        section=SectionCode.BRAND_WORKSPACE,
        exists=True,
        status="ready",
        service_path="app/services/collaboration_service.py",
        route_path="app/api/v1/endpoints/collaboration.py",
        model_paths=["app/db/models/collaboration.py"],
        tags=["collaboration", "tasks", "notifications"],
    ),
    "collection_management": ModuleSpec(
        code="collection_management",
        title="Collection Management",
        description="Планирование коллекций, распределение дропов и мерчандайзинг-сетка",
        section=SectionCode.COLLECTIONS,
        exists=True,
        status="ready",
        service_path="app/services/collection_service.py",
        route_path="app/api/v1/endpoints/collections.py",
        model_paths=["app/db/models/product.py"],
        tags=["collections", "drops", "merchandising"],
    ),
    "campaign_generator": ModuleSpec(
        code="campaign_generator",
        title="AI Campaign Generator & Content Factory",
        description="Генерация маркетингового контента, SEO-копий и стратегий продвижения с AI-копирайтингом",
        section=SectionCode.CAMPAIGN_GENERATOR,
        exists=True,
        status="ready",
        service_path="app/services/marketing_service.py",
        route_path="app/api/v1/endpoints/marketing.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["marketing", "ai", "content", "seo"],
    ),
    "supply_chain_risk": ModuleSpec(
        code="supply_chain_risk",
        title="AI Supply Chain Risk Radar",
        description="Мониторинг задержек производства и логистики с AI-рекомендациями по минимизации рисков",
        section=SectionCode.AI_INSIGHTS,
        exists=True,
        status="ready",
        service_path="app/services/supply_chain_service.py",
        route_path="app/api/v1/endpoints/supply_chain.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["supply_chain", "ai", "risk", "logistics"],
    ),
    "market_expansion": ModuleSpec(
        code="market_expansion",
        title="AI Market Expansion Hub",
        description="Анализ выхода на новые рынки: налоги, пошлины, логистика и комплаенс",
        section=SectionCode.RUSSIAN_LAYER, # Or create a Global section later
        exists=True,
        status="ready",
        service_path="app/services/expansion_service.py",
        route_path="app/api/v1/endpoints/expansion.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["expansion", "strategy", "compliance"],
    ),
    "staff_os": ModuleSpec(
        code="staff_os",
        title="Retail Staff HR-OS",
        description="Управление персоналом магазина: смены, авансы зарплат, геймификация и обучение",
        section=SectionCode.SETTINGS, # Should be a separate HR section if possible
        exists=True,
        status="ready",
        service_path="app/services/staff_service.py",
        route_path="app/api/v1/endpoints/staff.py",
        model_paths=["app/db/models/retail.py"],
        tags=["hr", "retail", "staff"],
    ),
    "ai_pricing": ModuleSpec(
        code="ai_pricing",
        title="AI Pricing Optimizer",
        description="Динамическое ценообразование и аудит маржинальности",
        section=SectionCode.AI_PRICING,
        exists=True,
        status="ready",
        service_path="app/services/pricing_service.py",
        route_path="app/api/v1/endpoints/pricing.py",
        tags=["finance", "ai", "pricing"],
    ),
    "vmi_portal": ModuleSpec(
        code="vmi_portal",
        title="VMI Portal",
        description="Контроль остатков и авто-пополнение запасов у ритейлеров",
        section=SectionCode.VMI_PORTAL,
        exists=True,
        status="ready",
        service_path="app/services/inventory_service.py",
        route_path="app/api/v1/endpoints/inventory.py",
        tags=["inventory", "retail", "vmi"],
    ),
    "esg_impact": ModuleSpec(
        code="esg_impact",
        title="ESG Impact Monitoring",
        description="Мониторинг экологического следа и устойчивого производства",
        section=SectionCode.ESG_IMPACT,
        exists=True,
        status="ready",
        service_path="app/services/esg_service.py",
        route_path="app/api/v1/endpoints/esg.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["esg", "sustainability", "impact"],
    ),
    "b2b_academy": ModuleSpec(
        code="b2b_academy",
        title="B2B Academy",
        description="Обучение и сертификация сотрудников и партнеров",
        section=SectionCode.B2B_ACADEMY,
        exists=True,
        status="ready",
        service_path="app/services/academy_service.py",
        route_path="app/api/v1/endpoints/academy.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["academy", "training", "certification"],
    ),
    "finance_hub": ModuleSpec(
        code="finance_hub",
        title="Finance Hub",
        description="Инвойсинг, факторинг и финансовые инструменты для брендов",
        section=SectionCode.FINANCE_HUB,
        exists=True,
        status="ready",
        service_path="app/services/fintech_service.py",
        route_path="app/api/v1/endpoints/fintech.py",
        model_paths=["app/db/models/order.py", "app/db/models/finance.py"],
        tags=["fintech", "finance", "payments"],
    ),
    "loyalty_crm": ModuleSpec(
        code="loyalty_crm",
        title="CRM & Loyalty",
        description="Управление базой клиентов и программами лояльности",
        section=SectionCode.LOYALTY_CRM,
        exists=True,
        status="ready",
        service_path="app/services/loyalty_service.py",
        route_path="app/api/v1/endpoints/loyalty.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["crm", "loyalty", "marketing"],
    ),
    "russian_layer": ModuleSpec(
        code="russian_layer",
        title="Russian Layer Compliance",
        description="ЭДО, маркировка и юридическое соответствие для рынка РФ",
        section=SectionCode.RUSSIAN_LAYER,
        exists=True,
        status="ready",
        service_path="app/services/compliance_service.py",
        route_path="app/api/v1/endpoints/compliance.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["compliance", "edo", "marking"],
    ),
    "global_compliance": ModuleSpec(
        code="global_compliance",
        title="AI Global Tax & Compliance Engine",
        description="Автоматический расчет налогов (VAT/GST), санкционные проверки и комплаенс-отчетность",
        section=SectionCode.RUSSIAN_LAYER, # or a new section if needed
        exists=True,
        status="ready",
        service_path="app/services/global_compliance_service.py",
        route_path="app/api/v1/endpoints/global_compliance.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["compliance", "tax", "global", "security"],
    ),
    "sustainability_ledger": ModuleSpec(
        code="sustainability_ledger",
        title="AI Sustainability Ledger & DPP",
        description="Формирование цифровых паспортов изделий (Digital Product Passports) и блокчейн-реестра экологических сертификатов",
        section=SectionCode.ESG_IMPACT,
        exists=True,
        status="ready",
        service_path="app/services/sustainability_ledger_service.py",
        route_path="app/api/v1/endpoints/sustainability.py",
        model_paths=["app/db/models/product.py"],
        tags=["esg", "sustainability", "blockchain", "dpp", "transparency"],
    ),
    "smart_contract_escalator": ModuleSpec(
        code="smart_contract_escalator",
        title="AI Smart Contract Escalator",
        description="Автоматическое исполнение финансовых условий (бонусы, штрафы, эскроу) на основе событий платформы",
        section=SectionCode.FINANCE_HUB,
        exists=True,
        status="ready",
        service_path="app/services/smart_contract_service.py",
        route_path="app/api/v1/endpoints/smart_contracts.py",
        model_paths=["app/db/models/finance.py"],
        tags=["fintech", "finance", "automation", "contracts"],
    ),
    "admin_disputes": ModuleSpec(
        code="admin_disputes",
        title="Platform Dispute Center",
        description="Центр разрешения конфликтов между организациями",
        section=SectionCode.TASK_CENTER,
        exists=True,
        status="ready",
        service_path="app/services/admin_service.py",
        route_path="app/api/v1/endpoints/admin.py",
        model_paths=["app/db/models/core.py"],
        tags=["admin", "disputes", "platform"],
    ),
    "demand_forecasting": ModuleSpec(
        code="demand_forecasting",
        title="AI Demand Forecasting",
        description="Прогнозирование спроса на уровне SKU с учетом визуальных трендов",
        section=SectionCode.AI_INSIGHTS,
        exists=True,
        status="ready",
        service_path="app/services/forecasting_service.py",
        route_path="app/api/v1/endpoints/forecasting.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["ai", "analytics", "forecasting"],
    ),
    "size_curve_optimizer": ModuleSpec(
        code="size_curve_optimizer",
        title="AI Size Curve Optimizer",
        description="Оптимизация распределения размеров (S/M/L/XL) на основе региональных данных",
        section=SectionCode.AI_INSIGHTS,
        exists=True,
        status="ready",
        service_path="app/services/size_curve_service.py",
        route_path="app/api/v1/endpoints/size_curves.py",
        model_paths=["app/db/models/intelligence.py"],
        tags=["ai", "production", "distribution"],
    ),
    "sourcing_manager": ModuleSpec(
        code="sourcing_manager",
        title="Sourcing & Materials",
        description="Управление поставщиками, склад материалов (ткани, фурнитура) и заказы на закупку",
        section=SectionCode.PRODUCTION_HUB,
        exists=True,
        status="ready",
        service_path="app/services/production_service.py",
        route_path="app/api/v1/endpoints/plm.py",
        tags=["sourcing", "materials", "suppliers"],
    ),
    "tech_pack_studio": ModuleSpec(
        code="tech_pack_studio",
        title="Tech Pack Studio",
        description="Детализация изделий: спецификации (BOM), градация, конструктивные узлы и документация",
        section=SectionCode.PRODUCTION_HUB,
        exists=True,
        status="ready",
        service_path="app/services/production_service.py",
        route_path="app/api/v1/endpoints/plm.py",
        tags=["techpack", "bom", "design"],
    ),
    "sampling_tracker": ModuleSpec(
        code="sampling_tracker",
        title="Sampling Workflow",
        description="Отслеживание этапов разработки образцов (Proto, SMS, Gold), фит-коррекции и утверждения",
        section=SectionCode.PRODUCTION_HUB,
        exists=True,
        status="ready",
        service_path="app/services/production_service.py",
        route_path="app/api/v1/endpoints/plm.py",
        tags=["sampling", "proto", "approval"],
    ),
    "bulk_production_control": ModuleSpec(
        code="bulk_production_control",
        title="Bulk Production Control",
        description="Массовое производство: партии (Batches), график GANTT, контроль качества (QC) и финансовые расходы",
        section=SectionCode.PRODUCTION_HUB,
        exists=True,
        status="ready",
        service_path="app/services/production_service.py",
        route_path="app/api/v1/endpoints/plm.py",
        tags=["production", "bulk", "qc", "finance"],
    ),
}


def get_sections_for_role(role: RoleCode) -> list[SectionSpec]:
    return [section for section in SECTION_REGISTRY.values() if role in section.required_roles]


def get_project_registry_snapshot() -> dict[str, Any]:
    return {
        "roles": [role.value for role in RoleCode],
        "sections": [
            {
                "code": section.code.value,
                "title": section.title,
                "description": section.description,
                "is_existing": section.is_existing,
                "required_roles": [role.value for role in section.required_roles],
            }
            for section in SECTION_REGISTRY.values()
        ],
        "modules": [
            {
                "code": module.code,
                "title": module.title,
                "description": module.description,
                "section": module.section.value,
                "status": module.status,
                "service_path": module.service_path,
                "route_path": module.route_path,
                "model_paths": module.model_paths,
                "schema_paths": module.schema_paths,
                "tags": module.tags,
            }
            for module in MODULE_REGISTRY.values()
        ],
    }
