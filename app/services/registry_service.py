from typing import List, Optional, Dict, Any
from app.api.deps import UserRole
from app.core.config import settings
from app.core.project_registry import (
    RoleCode, SectionCode, SECTION_REGISTRY, MODULE_REGISTRY,
    get_sections_for_role, get_project_registry_snapshot
)
from app.core.project_health import build_project_health_report

class SystemRegistryService:
    """
    Project Brain / Registry Layer.
    Manages system-wide feature flags, role permissions, and workspace configurations.
    Uses app.core.project_registry as the source of truth.
    """
    def __init__(self):
        self.version = "v1.57.0"
        self.features = {
            "ai_sku_planner": True,
            "vr_showroom_360": True,
            "smart_body_scanner": True,
            "blockchain_ip_ledger": False, # Experimental
            "rfid_warehouse_gates": True,
            "iot_machine_monitoring": True
        }

    def _map_user_role_to_code(self, role: str) -> RoleCode:
        """
        Maps existing UserRole (from deps.py) to new RoleCode (from project_registry.py).
        """
        mapping = {
            "platform_admin": RoleCode.ADMINISTRATOR,
            "brand_admin": RoleCode.BRAND,
            "brand_manager": RoleCode.BRAND,
            "sales_rep": RoleCode.BRAND,
            "buyer_admin": RoleCode.STORE,
            "buyer": RoleCode.STORE,
            "merchandiser": RoleCode.BRAND,
            "planner": RoleCode.BRAND,
            "finance_user": RoleCode.BRAND,
            "analyst": RoleCode.BRAND,
        }
        return mapping.get(role, RoleCode.CLIENT)

    def get_system_status(self) -> Dict[str, Any]:
        snapshot = get_project_registry_snapshot()
        health = build_project_health_report()
        return {
            "version": self.version,
            "features": self.features,
            "environment": "development", # Should come from settings
            "registry": snapshot,
            "project_health": health
        }

    def get_role_nav(self, role: str) -> List[Dict[str, str]]:
        """
        Standardized role-based navigation contracts.
        Ensures consistency between frontend/backend registries.
        """
        role_code = self._map_user_role_to_code(role)
        sections = get_sections_for_role(role_code)
        
        # Define base path mapping for sections
        path_map = {
            SectionCode.DASHBOARD: "/brand/dashboard" if role_code == RoleCode.BRAND else "/shop",
            SectionCode.COLLECTIONS: "/brand/products",
            SectionCode.PARTNERS: "/brand/retailers",
            SectionCode.SHOWROOMS: "/brand/showroom" if role_code == RoleCode.BRAND else "/shop/b2b",
            SectionCode.LINESHEETS: "/brand/linesheets" if role_code == RoleCode.BRAND else "/shop/b2b/linesheets",
            SectionCode.DRAFT_ORDERS: "/brand/b2b-orders" if role_code == RoleCode.BRAND else "/shop/b2b/orders",
            SectionCode.ORDERS: "/brand/orders" if role_code == RoleCode.BRAND else "/shop/orders",
            SectionCode.BUYER_WORKSPACE: "/shop/workspace",
            SectionCode.BRAND_WORKSPACE: "/brand/workspace",
            SectionCode.ANALYTICS: "/brand/analytics" if role_code == RoleCode.BRAND else "/shop/analytics",
            SectionCode.SETTINGS: "/brand/settings" if role_code == RoleCode.BRAND else "/shop/settings",
            SectionCode.AI_INSIGHTS: "/brand/ai-insights" if role_code == RoleCode.BRAND else "/shop/ai-insights",
            SectionCode.TASK_CENTER: "/admin/tasks",
            SectionCode.CAMPAIGN_GENERATOR: "/brand/kickstarter",
            SectionCode.AI_PRICING: "/brand/pricing",
            SectionCode.VMI_PORTAL: "/brand/vmi",
            SectionCode.ESG_IMPACT: "/brand/esg",
            SectionCode.B2B_ACADEMY: "/brand/blog",
            SectionCode.FINANCE_HUB: "/brand/finance",
            SectionCode.LOYALTY_CRM: "/brand/customer-intelligence",
            SectionCode.RUSSIAN_LAYER: "/brand/compliance",
            SectionCode.WHOLESALE_HUB: "/brand/wholesale",
            SectionCode.SUPPLY_CHAIN: "/brand/supply-chain",
            SectionCode.RETAIL_OPS: "/brand/retail-ops",
            SectionCode.MARKETPLACE: "/shop/marketplace",
            SectionCode.FINANCE: "/shop/finance"
        }

        # Define icons for sections
        icon_map = {
            SectionCode.DASHBOARD: "activity",
            SectionCode.COLLECTIONS: "database",
            SectionCode.PARTNERS: "users",
            SectionCode.SHOWROOMS: "monitor",
            SectionCode.LINESHEETS: "layers",
            SectionCode.DRAFT_ORDERS: "package",
            SectionCode.ORDERS: "list-ordered",
            SectionCode.BUYER_WORKSPACE: "layout-dashboard",
            SectionCode.BRAND_WORKSPACE: "briefcase",
            SectionCode.ANALYTICS: "bar-chart-3",
            SectionCode.SETTINGS: "settings",
            SectionCode.AI_INSIGHTS: "sparkles",
            SectionCode.TASK_CENTER: "check-square",
            SectionCode.CAMPAIGN_GENERATOR: "rocket",
            SectionCode.AI_PRICING: "dollar-sign",
            SectionCode.VMI_PORTAL: "truck",
            SectionCode.ESG_IMPACT: "globe",
            SectionCode.B2B_ACADEMY: "book-open",
            SectionCode.FINANCE_HUB: "wallet",
            SectionCode.LOYALTY_CRM: "users",
            SectionCode.RUSSIAN_LAYER: "shield-check",
            SectionCode.WHOLESALE_HUB: "package",
            SectionCode.SUPPLY_CHAIN: "truck",
            SectionCode.RETAIL_OPS: "store",
            SectionCode.MARKETPLACE: "shopping-bag",
            SectionCode.FINANCE: "wallet"
        }

        navigation = []
        for section in sections:
            navigation.append({
                "title": section.title,
                "path": path_map.get(section.code, "/profile"),
                "icon": icon_map.get(section.code, "user")
            })
        
        return navigation if navigation else [{"title": "Profile", "path": "/profile", "icon": "user"}]

    def get_section_access(self, role: str) -> List[str]:
        """
        Returns accessible UI section codes for a given role.
        """
        role_code = self._map_user_role_to_code(role)
        sections = get_sections_for_role(role_code)
        return [section.code.value for section in sections]
