/**
 * Единая точка доступа к данным производства без HTTP.
 * Реализация: localStorage. Для API — реализуйте HttpProductionDataPort с теми же методами
 * и подмените getProductionDataPort() в одном месте.
 */

import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';

export type BrandTaskStatus = 'todo' | 'in_progress' | 'done';

export type BrandTaskRecord = {
  id: string;
  title: string;
  status: BrandTaskStatus;
  assignee: string;
  due: string;
  project: string;
  collectionId?: string;
  articleSku?: string;
  createdAt: string;
  updatedAt: string;
};

export type TechPackDraftV1 = {
  v: 1;
  styleId: string;
  selectedSizeScale: string;
  isApproved: boolean;
  isEditing?: boolean;
  bomData: unknown[];
  gradingData: unknown[];
  patternsData: unknown[];
  careData: Record<string, unknown>;
  specsData: Record<string, unknown>;
  seamsData: unknown[];
  smvData: unknown[];
  packData: Record<string, unknown>;
  historyData: unknown[];
  updatedAt: string;
};

/** Вкладки цеха и вложенные экраны — один JSON-черновик на scope (до API). */
export type FloorTabScope =
  | 'gold-sample'
  | 'qc-app'
  | 'gantt'
  | 'nesting'
  | 'fit-comments'
  | 'daily-output'
  | 'worker-skills'
  | 'milestones-video'
  | 'subcontractor';

export interface ProductionDataPort {
  /**
   * Единый документ контура коллекции по SKU (v:1).
   * Тело при миграции на API: JSON с полями `productionProfileId?`, `skus` — см. `CollectionSkuFlowDoc`.
   */
  getSkuFlow(collectionKey: string): Promise<CollectionSkuFlowDoc>;
  saveSkuFlow(collectionKey: string, doc: CollectionSkuFlowDoc): Promise<void>;
  getTechPackDraft(styleId: string): Promise<TechPackDraftV1 | null>;
  saveTechPackDraft(draft: TechPackDraftV1): Promise<void>;
  listTasks(): Promise<BrandTaskRecord[]>;
  saveTasks(tasks: BrandTaskRecord[]): Promise<void>;
  getFloorTabDraft(scope: FloorTabScope): Promise<unknown | null>;
  saveFloorTabDraft(scope: FloorTabScope, payload: unknown): Promise<void>;
}
