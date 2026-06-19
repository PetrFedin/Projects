/**
 * Канон sidebar Platform Core (:3001) — единая логика для всех ролей.
 *
 * Правила:
 * - Порядок групп = порядок столпов golden path для роли.
 * - «Мой кабинет» — первый пункт первой операционной группы.
 * - «Связь» — всегда последняя группа; внутри: Сообщения → Календарь.
 * - Legacy «Товар/Заказы/Архив/Команда/…» в core не показываются (archive + augment).
 *
 * Реализация: `apply*NavPipeline`, `augment*Nav*`, `filterNavGroupsForCoreSidebar`.
 */
import {
  BRAND_B2B_GROUP_LABEL,
  BRAND_DEVELOPMENT_GROUP_LABEL,
  BRAND_PIM_GROUP_LABEL,
  BRAND_PRODUCTION_GROUP_LABEL,
  COMMS_GROUP_LABEL,
  MFR_PRODUCTION_GROUP_LABEL,
  SHOP_B2B_GROUP_LABEL,
  SHOP_PARTNERS_GROUP_LABEL,
  SHOP_PIM_GROUP_LABEL,
  SUPPLIER_PIM_GROUP_LABEL,
} from '@/lib/platform-core-canonical-labels';

export type PlatformCoreRoleNavSpec = {
  roleKey: 'brand' | 'shop' | 'manufacturer' | 'supplier';
  groupOrder: readonly string[];
  groups: Readonly<
    Record<
      string,
      {
        label: string;
        linkValues: readonly string[];
        pillar?: string;
      }
    >
  >;
};

export const PLATFORM_CORE_BRAND_NAV: PlatformCoreRoleNavSpec = {
  roleKey: 'brand',
  groupOrder: ['development', 'pim', 'b2b', 'production', 'comms'],
  groups: {
    development: {
      label: BRAND_DEVELOPMENT_GROUP_LABEL,
      pillar: 'development',
      linkValues: ['platform-core-cabinet', 'workshop2', 'range-planner'],
    },
    pim: {
      label: BRAND_PIM_GROUP_LABEL,
      pillar: 'sample_collection',
      linkValues: ['linesheets-core', 'showroom'],
    },
    b2b: {
      label: BRAND_B2B_GROUP_LABEL,
      pillar: 'collection_order',
      linkValues: ['orders', 'retailers-core'],
    },
    production: {
      label: BRAND_PRODUCTION_GROUP_LABEL,
      pillar: 'order_production',
      linkValues: ['shop-floor', 'materials-core'],
    },
    comms: {
      label: COMMS_GROUP_LABEL,
      pillar: 'comms',
      linkValues: ['messages', 'calendar'],
    },
  },
};

export const PLATFORM_CORE_SHOP_NAV: PlatformCoreRoleNavSpec = {
  roleKey: 'shop',
  groupOrder: ['pim', 'partners', 'b2b', 'comms'],
  groups: {
    pim: {
      label: SHOP_PIM_GROUP_LABEL,
      pillar: 'collection_order',
      linkValues: ['platform-core-cabinet', 'showroom-core', 'matrix-core'],
    },
    partners: {
      label: SHOP_PARTNERS_GROUP_LABEL,
      linkValues: ['partners-discover-core', 'partners-apply-core'],
    },
    b2b: {
      label: SHOP_B2B_GROUP_LABEL,
      pillar: 'collection_order',
      linkValues: ['b2b-orders', 'b2b-tracking-core'],
    },
    comms: {
      label: COMMS_GROUP_LABEL,
      pillar: 'comms',
      linkValues: ['messages', 'calendar'],
    },
  },
};

export const PLATFORM_CORE_MANUFACTURER_NAV: PlatformCoreRoleNavSpec = {
  roleKey: 'manufacturer',
  groupOrder: ['production', 'comms'],
  groups: {
    production: {
      label: MFR_PRODUCTION_GROUP_LABEL,
      pillar: 'order_production',
      linkValues: [
        'platform-core-cabinet',
        'handoff-queue-core',
        'production-orders-core',
        'dossier-core',
      ],
    },
    comms: {
      label: COMMS_GROUP_LABEL,
      pillar: 'comms',
      linkValues: ['messages', 'calendar'],
    },
  },
};

export const PLATFORM_CORE_SUPPLIER_NAV: PlatformCoreRoleNavSpec = {
  roleKey: 'supplier',
  groupOrder: ['pim', 'comms'],
  groups: {
    pim: {
      label: SUPPLIER_PIM_GROUP_LABEL,
      pillar: 'order_production',
      linkValues: ['platform-core-cabinet', 'materials-bom-core', 'materials-procurement-core'],
    },
    comms: {
      label: COMMS_GROUP_LABEL,
      pillar: 'comms',
      linkValues: ['messages', 'calendar'],
    },
  },
};

export const PLATFORM_CORE_ROLE_NAV_BY_KEY = {
  brand: PLATFORM_CORE_BRAND_NAV,
  shop: PLATFORM_CORE_SHOP_NAV,
  manufacturer: PLATFORM_CORE_MANUFACTURER_NAV,
  supplier: PLATFORM_CORE_SUPPLIER_NAV,
} as const;
