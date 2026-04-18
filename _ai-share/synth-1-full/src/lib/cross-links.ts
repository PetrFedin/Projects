// Глобальный граф связей между сущностями для сквозной аналитики
// Используется для построения кросс-ссылок: Клиенты → Заказы → SKU → Сток → Фабрики

import { ROUTES } from '@/lib/routes';

export interface EntityLink {
  type: 'client' | 'retailer' | 'sku' | 'order' | 'factory';
  id: string;
  name: string;
  href: string;
}

export interface CrossLink {
  from: EntityLink;
  to: EntityLink;
  relation: 'purchased' | 'ordered' | 'produces' | 'stocks' | 'returns';
  metadata?: Record<string, any>;
}

// Пример связи: Клиент → SKU → Сток → Фабрика
export const MOCK_CROSS_LINKS: CrossLink[] = [
  // Александра В. (VIP-клиент из Москвы)
  {
    from: { type: 'client', id: 'c-001', name: 'Александра В.', href: '/brand/customers?id=c-001' },
    to: {
      type: 'sku',
      id: 'sku-4821',
      name: 'Платье FW25 #4821',
      href: '/brand/products?sku=4821',
    },
    relation: 'purchased',
    metadata: { volume: 142000, date: '2026-01-15' },
  },
  {
    from: {
      type: 'sku',
      id: 'sku-4821',
      name: 'Платье FW25 #4821',
      href: '/brand/products?sku=4821',
    },
    to: {
      type: 'factory',
      id: 'f-vostok',
      name: 'Восток (RU)',
      href: '/brand/production?factory=vostok',
    },
    relation: 'produces',
    metadata: { status: 'delay', days: -5 },
  },

<<<<<<< HEAD
  // ЦУМ (Ритейлер) → Заказ → SKU
  {
    from: {
      type: 'retailer',
      id: 'r-tsum',
      name: 'ЦУМ Москва',
      href: '/brand/retailers?id=r-tsum',
    },
    to: { type: 'order', id: 'b2b-0012', name: 'B2B-0012', href: '/brand/b2b-orders/b2b-0012' },
=======
  // Демо-ритейлер → Заказ → SKU
  {
    from: {
      type: 'retailer',
      id: 'retail_msk_2',
      name: 'Демо-магазин · Москва 2',
      href: '/brand/retailers?id=retail_msk_2',
    },
    to: {
      type: 'order',
      id: 'b2b-0012',
      name: 'B2B-0012',
      href: ROUTES.brand.b2bOrder('B2B-0012'),
    },
>>>>>>> recover/cabinet-wip-from-stash
    relation: 'ordered',
    metadata: { value: 221800000, status: 'pending' },
  },
  {
<<<<<<< HEAD
    from: { type: 'order', id: 'b2b-0012', name: 'B2B-0012', href: '/brand/b2b-orders/b2b-0012' },
=======
    from: {
      type: 'order',
      id: 'b2b-0012',
      name: 'B2B-0012',
      href: ROUTES.brand.b2bOrder('B2B-0012'),
    },
>>>>>>> recover/cabinet-wip-from-stash
    to: {
      type: 'sku',
      id: 'sku-1092',
      name: 'Куртка Outerwear #1092',
      href: '/brand/products?sku=1092',
    },
    relation: 'ordered',
    metadata: { qty: 240, wholesale_price: 12400 },
  },
  {
    from: {
      type: 'sku',
      id: 'sku-1092',
      name: 'Куртка Outerwear #1092',
      href: '/brand/products?sku=1092',
    },
    to: {
      type: 'factory',
      id: 'f-nordic',
      name: 'Nordic Wool (FI)',
      href: '/brand/production?factory=nordic',
    },
    relation: 'produces',
    metadata: { status: 'on-track', days: 0, progress: 85 },
  },

  // Проблемные SKU → Deadstock
  {
    from: {
      type: 'sku',
      id: 'sku-4821',
      name: 'Платье FW25 #4821',
      href: '/brand/products?sku=4821',
    },
    to: { type: 'sku', id: 'stock-warning', name: 'Deadstock Alert', href: '/brand/inventory' },
    relation: 'stocks',
    metadata: { sold_pct: 12, risk: 82, action: 'discount_30' },
  },
];

// Утилита для поиска связанных сущностей
export function findRelated(entityId: string, relation?: CrossLink['relation']): CrossLink[] {
  return MOCK_CROSS_LINKS.filter(
    (link) =>
      (link.from.id === entityId || link.to.id === entityId) &&
      (!relation || link.relation === relation)
  );
}

// Построение цепочки: Client → Order → SKU → Factory
export function buildChain(startId: string): EntityLink[] {
  const visited = new Set<string>();
  const chain: EntityLink[] = [];

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const links = MOCK_CROSS_LINKS.filter((l) => l.from.id === id);
    links.forEach((link) => {
      chain.push(link.to);
      traverse(link.to.id);
    });
  }

  const start = MOCK_CROSS_LINKS.find((l) => l.from.id === startId)?.from;
  if (start) chain.push(start);
  traverse(startId);

  return chain;
}
