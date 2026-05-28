/**
 * Унифицированные подписи только для таблицы «Темы покрытия» на /project-info/roles-matrix.
 * Не меняет навигацию — только отображение в UI (красные чипы).
 * Для общих русских подписей кластеров см. MATRIX_CLUSTER_LABEL_RU.
 */

import type { RoleHubId } from './role-hub-matrix';

type UnifiedValue = string | readonly string[];

/**
 * Подписи по умолчанию, если нет правила для строки темы.
 * У поставщика кластер «Материалы и поставки» в таблице везде показываем как «Сырьё и материалы».
 */
export const MATRIX_CLUSTER_LABEL_RU: Record<string, string> = {
  /** Как у группы сайдбара: `brand-navigation` / `distributor-navigation` / `factory-navigation` (`Логистика и остатки`). */
  Логистика: 'Логистика и остатки',
  /** Легаси: в навигации бренда кластер переименован в «Заказы»; в таблице при необходимости — через ROLE_HUB_TABLE_UNIFICATION. */
  'B2B Заказы': 'Заказы B2B',
  'AI и обучение': 'ИИ и обучение',
  'Материалы и поставки': 'Сырьё и материалы',
  /** Оптовый контур в кабинете магазина — в таблице тем единообразно «Заказы B2B». */
  'Оптовые закупки (B2B)': 'Заказы B2B',
  'Розничные продажи (B2C)': 'Продажи (B2C)',
};

/** Чипы для кластеров «Партнёры-бренды» / «Каталог и партнёры»: в таблице тем — «Продукт», не «Каталог». */
const PRODUCT_PARTNERS_CHIPS: readonly string[] = ['Продукт', 'Партнёры'];

/**
 * По id строки матрицы (ROLE_HUB_MATRIX[].id) и роли: имя кластера из данных → целевая подпись в таблице.
 * Массив — разбиение одного кластера на несколько целевых.
 */
export const ROLE_HUB_TABLE_UNIFICATION: Partial<
  Record<string, Partial<Record<RoleHubId, Record<string, UnifiedValue>>>>
> = {
  org: {
    brand: {
      Управление: 'Управление',
    },
  },
  comms: {
    brand: {
      Управление: ['Чаты', 'Календарь'],
    },
    shop: {
      Управление: ['Чаты', 'Календарь'],
    },
    distributor: {
      Управление: ['Чаты', 'Календарь'],
    },
    manufacturer: {
      Управление: ['Чаты', 'Календарь'],
    },
    supplier: {
      Управление: ['Чаты', 'Календарь'],
    },
  },
  product: {
    shop: {
      'Партнёры-бренды': PRODUCT_PARTNERS_CHIPS,
    },
    distributor: {
      'Каталог и партнёры': PRODUCT_PARTNERS_CHIPS,
    },
  },
  materials: {
    distributor: {
      Заказы: 'Заказы B2B',
    },
  },
  qc: {
    brand: {
      Заказы: 'Контроль качества',
    },
  },
  b2b: {
    brand: {
      Заказы: 'Заказы B2B',
    },
    distributor: {
      Заказы: 'Заказы B2B',
      'Каталог и партнёры': PRODUCT_PARTNERS_CHIPS,
    },
  },
  partners: {
    brand: {
      'Партнёры и клиенты': ['Партнёры', 'Клиенты'],
    },
    shop: {
      'Партнёры-бренды': PRODUCT_PARTNERS_CHIPS,
    },
    distributor: {
      'Каталог и партнёры': PRODUCT_PARTNERS_CHIPS,
    },
  },
  marketing: {
    shop: {
      'Партнёры-бренды': PRODUCT_PARTNERS_CHIPS,
    },
    distributor: {
      'Каталог и партнёры': PRODUCT_PARTNERS_CHIPS,
    },
  },
  ai: {
    brand: {
      'AI и обучение': ['ИИ', 'Обучение'],
    },
    shop: {
      'Оптовые закупки (B2B)': ['Обучение'],
    },
    distributor: {
      Заказы: ['Обучение'],
    },
  },
};

export type TableClusterItem = { label: string; isUnified: boolean };

export function getTableClusterDisplay(
  rowId: string,
  roleId: RoleHubId,
  clusterNames: readonly string[]
): TableClusterItem[] {
  const perRole = ROLE_HUB_TABLE_UNIFICATION[rowId]?.[roleId];
  const out: TableClusterItem[] = [];
  for (const name of clusterNames) {
    const u = perRole?.[name];
    if (u === undefined) {
      const fallback = MATRIX_CLUSTER_LABEL_RU[name];
      out.push({
        label: fallback ?? name,
        isUnified: Boolean(fallback),
      });
    } else if (Array.isArray(u)) {
      for (const l of u) {
        out.push({ label: l, isUnified: true });
      }
    } else {
      out.push({ label: u as string, isUnified: true });
    }
  }
  return out;
}
