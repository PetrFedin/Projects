import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { PRODUCTION_FLOOR_TAB_IDS, type ProductionFloorTabId } from '@/lib/production/floor-flow';

export type FloorTabPrimaryStages = {
  tab: ProductionFloorTabId;
  /** Этапы каталога, у которых основной модуль = эта вкладка цеха */
  primaryStageTitles: string[];
};

/** Сопоставление вкладки цеха этапам с заполненным productionFloorTab */
export function buildPrimaryStagesByFloorTab(): FloorTabPrimaryStages[] {
  const map = new Map<ProductionFloorTabId, string[]>();
  for (const id of PRODUCTION_FLOOR_TAB_IDS) {
    map.set(id, []);
  }
  for (const step of COLLECTION_STEPS) {
    if (!step.productionFloorTab) continue;
    map.get(step.productionFloorTab)?.push(step.title);
  }
  return PRODUCTION_FLOOR_TAB_IDS.map((tab) => ({
    tab,
    primaryStageTitles: map.get(tab) ?? [],
  }));
}

/** Пояснения для вкладок без прямого primary или с особой ролью */
export const FLOOR_TAB_INDEX_NOTES: Partial<Record<ProductionFloorTabId, string>> = {
  stages:
    'Здесь — матрица, доска, схема зависимостей и контекст SKU по всему каталогу этапов; переходы в остальные вкладки — из «Связей» и основных ссылок этапа.',
  live: 'Сквозная схема процесса; этап «Согласование всех сторон» дополнительно открывает LIVE-процесс бренда.',
};
