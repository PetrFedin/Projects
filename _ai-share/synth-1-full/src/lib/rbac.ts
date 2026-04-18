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
  | 'marketing'
  | 'learning'
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
    marketing: ['view', 'create', 'edit', 'delete', 'export'],
    learning: ['view', 'create', 'edit', 'delete'],
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
    marketing: ['view', 'export'],
    learning: ['view', 'edit'],
    edo: ['view', 'create', 'edit'],
    settings: ['view', 'edit'],
  },
  retailer: {
    b2b_orders: ['view', 'create'],
    b2b_catalog: ['view'],
    warehouse: ['view'],
    finance: ['view'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
    edo: ['view'],
    /** Ритейл-центр: настройки магазина, команда — группа «Сеть и доступы». */
    settings: ['view'],
    team: ['view'],
  },
  buyer: {
    b2b_orders: ['view', 'create'],
    b2b_catalog: ['view'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
    production: ['view'],
  },
  distributor: {
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view'],
    warehouse: ['view'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
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
    brand_profile: ['view'],
    production: ['view', 'edit'],
    b2b_catalog: ['view'],
    marketing: ['view'],
    learning: ['view', 'edit'],
  },
  technologist: {
    production: ['view', 'edit', 'approve'],
    compliance: ['view', 'edit'],
    marketing: ['view'],
    learning: ['view'],
  },
  production_manager: {
    production: ['view', 'create', 'edit', 'approve', 'export'],
    b2b_orders: ['view'],
    warehouse: ['view', 'edit'],
    compliance: ['view', 'edit'],
    marketing: ['view'],
    learning: ['view'],
  },
  finance_manager: {
    finance: ['view', 'edit', 'approve', 'export'],
    b2b_orders: ['view'],
    edo: ['view', 'create', 'edit'],
    /** Цех / Цех 2 в навигации и read-only контур (без create/edit в матрице production). */
    production: ['view'],
    /** BI / финхаб / ESG в сайдбаре; без этого CFO не видит группу «Аналитика и финансы». */
    analytics: ['view', 'export'],
    /** Группа «Маркетинг» в бренд-центре (согласовано: CFO видит). */
    marketing: ['view'],
    /** Ритейл-центр: бюджет, связанные кабинеты, read-only настройки. */
    settings: ['view'],
    team: ['view'],
  },
  sales_rep: {
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
    production: ['view'],
  },
  merchandiser: {
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view', 'edit'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
    production: ['view'],
  },
  client: {
    b2b_catalog: ['view'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
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
