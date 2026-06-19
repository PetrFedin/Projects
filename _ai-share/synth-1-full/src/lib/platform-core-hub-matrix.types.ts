/** Типы hub-матрицы «роль × столп» (Platform Core). */

export type CoreHubPillarId =
  | 'development'
  | 'sample_collection'
  | 'collection_order'
  | 'order_production'
  | 'comms';

export type CoreChainRoleId = 'brand' | 'shop' | 'manufacturer' | 'supplier';

export const PLATFORM_CORE_ROLE_LABELS: Record<CoreChainRoleId, string> = {
  brand: 'Бренд',
  shop: 'Магазин',
  manufacturer: 'Производство',
  supplier: 'Поставщик',
};

export type CoreHubAction = { label: string; href: string };

export type CoreHubCell =
  | { kind: 'active'; title: string; lead: string; actions: CoreHubAction[] }
  | { kind: 'empty'; reason: string };

export type CoreHubRoleRow = {
  id: CoreChainRoleId;
  label: string;
  landingHref: string;
  pillars: Record<CoreHubPillarId, CoreHubCell>;
};
