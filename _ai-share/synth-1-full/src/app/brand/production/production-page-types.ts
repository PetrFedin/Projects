/** Артикул в коллекции с детальным статусом по этапам для оперативного создания и запуска в производство */
export interface CollectionArticle {
  id: string;
  sku: string;
  name: string;
  /** Текущий этап (id из COLLECTION_STEPS) */
  currentStageId: string;
  /** Прогноз: количество для производства */
  forecastQty: number;
  /** Прогноз: выручка (опт) */
  forecastRevenue: number;
  /** Дроп / окно поставки */
  deliveryWindowId?: string;
  techPackDone: boolean;
  samplesDone: boolean;
  poDone: boolean;
  qcDone: boolean;
  ready: boolean;
  /** Фасеты для фильтров на вкладке «Этапы» (справочник CATEGORY_HANDBOOK) */
  audienceId: string;
  audienceLabel: string;
  categoryLeafId: string;
  season: string;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  /** Аудитория › L1 › L2 › L3 по CATEGORY_HANDBOOK */
  categoryPathLabel: string;
  productionSiteId: string;
  productionSiteLabel: string;
  fabricSuppliersLabel: string;
  fabricStockNote?: string;
  /** Заказ (PO), в контексте которого ведётся артикул */
  primaryOrderRef?: string;
}
