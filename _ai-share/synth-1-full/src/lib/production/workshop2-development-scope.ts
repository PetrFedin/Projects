/**
 * Разработка коллекции (workshop2) — контур разработки и сэмплов по шкале коллекции: слева обзор/ТЗ (в каталоге этапов — в т.ч. tech-pack и
 * gate-all-stakeholders без отдельной вкладки), справа — от якоря supply-path: снабжение, образец и выпуск в карточке SKU.
 * Не серия и не опт: артикул → ТЗ → согласования → образец → шоурум. Этап каталога `samples` (отшив/приёмка) пересекается
 * с вкладками «Снабжение», «Эталон», полом (fit, gold) — см. `COLLECTION_STEPS` и `workshop2-collection-metrics.ts`.
 * Серийное производство, крупные объёмы и исполнение заказов — вне этого раздела.
 */
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';

/** Вкладки пола `/brand/production`, релевантные разработке и образцу (не серия и не массовый выпуск). */
export const WORKSHOP2_DEVELOPMENT_FLOOR_TAB_IDS: readonly ProductionFloorTabId[] = [
  'stages',
  'supplies',
  'sample',
  'quality',
];
