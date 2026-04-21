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
    brand_profile: ['view'],
    production: ['view', 'edit'],
    b2b_orders: ['view'],
    warehouse: ['view'],
    compliance: ['view', 'edit'],
  },
  supplier: {
    brand_profile: ['view'],
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
    brand_profile: ['view'],
    production: ['view', 'edit', 'approve'],
    compliance: ['view', 'edit'],
    marketing: ['view'],
    learning: ['view'],
  },
  production_manager: {
    brand_profile: ['view'],
    production: ['view', 'create', 'edit', 'approve', 'export'],
    b2b_orders: ['view'],
    warehouse: ['view', 'edit'],
    compliance: ['view', 'edit'],
    marketing: ['view'],
    learning: ['view'],
  },
  finance_manager: {
    brand_profile: ['view'],
    finance: ['view', 'edit', 'approve', 'export'],
    b2b_orders: ['view'],
    edo: ['view', 'create', 'edit'],
    /** Пол (цех) / разработка коллекции в навигации и read-only контур (без create/edit в матрице production). */
    production: ['view'],
    /** BI / финхаб / ESG в сайдбаре; без этого CFO не видит кластеры «Аналитика» и «Финансы». */
    analytics: ['view', 'export'],
    /** Группа «Маркетинг» в бренд-центре (согласовано: CFO видит). */
    marketing: ['view'],
    /** Ритейл-центр: бюджет, связанные кабинеты, read-only настройки. */
    settings: ['view'],
    team: ['view'],
  },
  sales_rep: {
    brand_profile: ['view'],
    b2b_orders: ['view', 'create', 'edit'],
    b2b_catalog: ['view'],
    analytics: ['view'],
    marketing: ['view'],
    learning: ['view'],
    production: ['view'],
  },
  merchandiser: {
    brand_profile: ['view'],
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

function mapStringToPlatformRole(r: string): PlatformRole | null {
  const x = r.toLowerCase();
  if (x === 'admin' || x === 'platform_admin') return 'admin';
  if (x === 'brand' || x === 'brand_owner' || x === 'brand_admin' || x === 'brand_manager') {
    return 'brand';
  }
  if (x === 'shop' || x === 'retailer') return 'retailer';
  if (x === 'buyer') return 'buyer';
  if (x === 'distributor') return 'distributor';
  if (x === 'manufacturer' || x === 'factory') return 'manufacturer';
  if (x === 'supplier') return 'supplier';
  if (x === 'designer') return 'designer';
  if (x === 'technologist') return 'technologist';
  if (x === 'production_manager') return 'production_manager';
  if (x === 'finance_manager' || x === 'cfo') return 'finance_manager';
  if (x === 'sales_rep') return 'sales_rep';
  if (x === 'merchandiser') return 'merchandiser';
  if (x === 'client') return 'client';
  return null;
}

/**
 * Одна «платформенная» роль для матрицы RBAC.
 * При нескольких ролях из Hub не берём слепо `roles[0]`: иначе, например,
 * `['production_manager','brand']` даёт production_manager без `brand_profile`,
 * а пункт «Профиль» в сайдбаре пропадает, хотя пользователь — владелец бренда.
 */
export function getPlatformRole(userRoles: string[] | undefined): PlatformRole {
  if (!userRoles?.length) return 'retailer';
  const normalized = userRoles.map((x) => String(x).toLowerCase()).filter(Boolean);
  if (normalized.includes('admin') || normalized.includes('platform_admin')) return 'admin';
  if (
    normalized.some((x) =>
      ['brand', 'brand_owner', 'brand_admin', 'brand_manager'].includes(x)
    )
  ) {
    return 'brand';
  }
  for (const raw of userRoles) {
    const mapped = mapStringToPlatformRole(String(raw));
    if (mapped) return mapped;
  }
  return 'retailer';
}

export function canAccess(role: PlatformRole, resource: Resource, action: Action): boolean {
  const actions = RBAC_MATRIX[role]?.[resource];
  if (!actions) return false;
  return actions.includes(action);
}
