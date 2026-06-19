/**
 * Метаданные пяти столпов Platform Core hub.
 */
import {
  getPlatformCoreCollectionLabel,
  PLATFORM_CORE_DEMO,
  type PlatformCoreDemoContext,
} from '@/lib/platform-core-demo-context';
import type { CoreHubPillarId } from '@/lib/platform-core-hub-matrix.types';

export const PLATFORM_CORE_PILLARS: readonly {
  id: CoreHubPillarId;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'development',
    title: 'Разработка',
    subtitle: 'ТЗ, досье и образец',
  },
  {
    id: 'sample_collection',
    title: 'Коллекция и витрина',
    subtitle: 'Лайншит и B2B-витрина',
  },
  {
    id: 'collection_order',
    title: 'Оптовый заказ',
    subtitle: 'Матрица и подтверждение',
  },
  {
    id: 'order_production',
    title: 'Производство',
    subtitle: 'Выпуск, ТЗ и сырьё',
  },
  {
    id: 'comms',
    title: 'Связь',
    subtitle: 'Чат и календарь',
  },
];

export const PLATFORM_CORE_CHAIN_LEAD =
  'Бренд доводит артикул до образца → собирает коллекцию (лайншиты, витрина) → магазин формирует оптовый заказ → бренд подтверждает и передаёт на производство по техзаданию досье → цех и поставщик закрывают выпуск. Координация — чат и календарь.';

export const PLATFORM_CORE_HUB_HEADING = 'Цепочка: пять столпов × четыре роли';

/** Подписи столпов без технических id заказов/PO (investor UI). */
export function buildPillarEntityLabels(
  demo: PlatformCoreDemoContext
): Record<CoreHubPillarId, string> {
  const col = getPlatformCoreCollectionLabel(demo.collectionId);
  return {
    development: `Разработка · ${col}`,
    sample_collection: col,
    collection_order: `Оптовый заказ · ${col}`,
    order_production: `Выпуск · ${col}`,
    comms: `Связь · ${col}`,
  };
}

export const PLATFORM_CORE_PILLAR_DEMO_ENTITY: Record<CoreHubPillarId, string> =
  buildPillarEntityLabels(PLATFORM_CORE_DEMO);
