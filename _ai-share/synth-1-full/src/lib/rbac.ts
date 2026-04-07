/**
 * RBAC — единая система ролей и прав для brand, b2b, production, warehouse, admin.
 * Интеграция с useAuth, production-permissions, b2b-workspace-matrix.
 */

export type PlatformRole =
  | 'admin'
  | 'brand'
  | 'retailer'
  | 'buyer'
  | 'distributor'
  | 'manufacturer'
  | 'supplier'
  | 'designer'
  | 'technologist'
  | 'production_manager'
  | 'finance_manager'
  | 'sales_rep'
  | 'merchandiser'
  | 'client';

export type Resource =
  | 'brand_profile'
  | 'production'
  | 'b2b_orders'
  | 'b2b_catalog'
  | 'warehouse'
  | 'finance'
  | 'compliance'
  | 'integrations'
  | 'team'
  | 'analytics'
  | 'edo'
  | 'settings';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

const RBAC_MATRIX: Record<PlatformRole, Partial<Record<Resource, Action[]>>> = {
  admin: {
    brand_profile: ['view', 'create', 'edit', 'delete'],
    production: ['view', 'create', 'edit', 'delete', 'approve', 'export'],
    b2b_orders: ['view', 'create', 'edit', 'delete', 'approve', 'export'],
    b2b_catalog: ['view', 'create', 'edit', 'delete', 'export'],
    warehouse: ['view', 'create', 'edit', 'delete', 'export'],
    finance: ['view', 'create', 'edit', 'delete', 'approve', 'export'],
    compliance: ['view', 'create', 'edit', 'delete'],
    integrations: ['view', 'create', 'edit', 'delete'],
    team: ['view', 'create', 'edit', 'delete'],
    analytics: ['view', 'export'],
    edo: ['view', 'create', 'edit', 'delete'],
    settings: ['view', 'edit'],
  },
  brand: {
    brand_profile: ['view', 'edit'],
    production: ['view', 'create', 'edit', 'approve', 'export'],
    b2b_orders: ['view', 'create', 'edit', 'approve', 'export'],
    b2b_catalog: ['view', 'create', 'edit', 'export'],
    warehouse: ['view', 'edit', 'export'],
    finance: ['view', 'export'],
    compliance: ['view', 'edit'],
    integrations: ['view', 'edit'],
    team: ['view', 'edit'],
    analytics: ['view', 'export'],
    edo: ['view', 'create', 'edit'],
    settings: ['view', 'edit'],
  },
  retailer: {
    b2b_orders: ['view', 'create'],
    b2b_catalog: ['view'],
    warehouse: ['view'],
    finance: ['view'],
    analytics: ['view'],
    edo: ['view'],
  },
  buyer: {
    b2b_orders: ['view', 'create'],
    b2b_catalog: ['view'],
    analytics: ['view'],
    production: ['view'],
  },
  distributor: {
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view'],
    warehouse: ['view'],
    analytics: ['view'],
    edo: ['view'],
    production: ['view'],
  },
  manufacturer: {
    production: ['view', 'edit'],
    b2b_orders: ['view'],
    warehouse: ['view'],
    compliance: ['view', 'edit'],
  },
  supplier: {
    production: ['view'],
    b2b_orders: ['view'],
  },
  designer: {
    production: ['view', 'edit'],
    b2b_catalog: ['view'],
  },
  technologist: {
    production: ['view', 'edit', 'approve'],
    compliance: ['view', 'edit'],
  },
  production_manager: {
    production: ['view', 'create', 'edit', 'approve', 'export'],
    b2b_orders: ['view'],
    warehouse: ['view', 'edit'],
    compliance: ['view', 'edit'],
  },
  finance_manager: {
    finance: ['view', 'edit', 'approve', 'export'],
    b2b_orders: ['view'],
    edo: ['view', 'create', 'edit'],
    /** Цех / Цех 2 в навигации и read-only контур (без create/edit в матрице production). */
    production: ['view'],
  },
  sales_rep: {
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view'],
    analytics: ['view'],
    production: ['view'],
  },
  merchandiser: {
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view', 'edit'],
    analytics: ['view'],
    production: ['view'],
  },
  client: {
    b2b_catalog: ['view'],
    analytics: ['view'],
  },
};

export function getPlatformRole(userRoles: string[] | undefined): PlatformRole {
  if (!userRoles?.length) return 'retailer';
  const r = userRoles[0]?.toLowerCase();
  if (r === 'admin' || r === 'platform_admin') return 'admin';
  if (r === 'brand' || r === 'brand_owner' || r === 'brand_admin' || r === 'brand_manager') {
    return 'brand';
  }
  if (r === 'shop' || r === 'retailer') return 'retailer';
  if (r === 'buyer') return 'buyer';
  if (r === 'distributor') return 'distributor';
  if (r === 'manufacturer' || r === 'factory') return 'manufacturer';
  if (r === 'supplier') return 'supplier';
  if (r === 'designer') return 'designer';
  if (r === 'technologist') return 'technologist';
  if (r === 'production_manager') return 'production_manager';
  if (r === 'finance_manager' || r === 'cfo') return 'finance_manager';
  if (r === 'sales_rep') return 'sales_rep';
  if (r === 'merchandiser') return 'merchandiser';
  if (r === 'client') return 'client';
  return 'retailer';
}

export function canAccess(role: PlatformRole, resource: Resource, action: Action): boolean {
  const actions = RBAC_MATRIX[role]?.[resource];
  if (!actions) return false;
  return actions.includes(action);
}
