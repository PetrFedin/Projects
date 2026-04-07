/**
 * Единая модель производства бренда: коллекции, артикулы, PO, BOM, QC, коммуникации.
 * Слой данных без HTTP — localStorage + структура под будущий API (те же поля в JSON).
 */

export type ArticleLifecycleStage =
  | 'concept'
  | 'development'
  | 'tech_pack'
  | 'samples'
  | 'approval'
  | 'po'
  | 'manufacturing'
  | 'qc'
  | 'warehouse'
  | 'b2b_ready';

export const ARTICLE_LIFECYCLE_ORDER: ArticleLifecycleStage[] = [
  'concept',
  'development',
  'tech_pack',
  'samples',
  'approval',
  'po',
  'manufacturing',
  'qc',
  'warehouse',
  'b2b_ready',
];

export const ARTICLE_LIFECYCLE_LABELS: Record<ArticleLifecycleStage, string> = {
  concept: 'Концепт',
  development: 'Разработка',
  tech_pack: 'Техпак',
  samples: 'Сэмплы',
  approval: 'Утверждение',
  po: 'PO',
  manufacturing: 'Производство',
  qc: 'QC',
  warehouse: 'Склад',
  b2b_ready: 'Готов к B2B',
};

export interface CollectionEntity {
  id: string;
  name: string;
  code: string;
  status: 'draft' | 'active' | 'completed';
  targetFirstDropDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleEntity {
  id: string;
  collectionId: string;
  sku: string;
  name: string;
  lifecycleStage: ArticleLifecycleStage;
  dropId: string;
  goldSampleApproved: boolean;
  techPackVersion: string;
  targetTechPackDate?: string;
  targetCutDate?: string;
  b2bReady: boolean;
  finishedGoodsQty: number;
  linesheetReady: boolean;
}

export interface FactoryEntity {
  id: string;
  name: string;
  country?: string;
  utilizationPct?: number;
  maxCapacityUnits?: number;
}

export type POStatus = 'draft' | 'sent' | 'confirmed' | 'in_production' | 'completed';

export interface POLineEntity {
  id: string;
  articleId: string;
  dropId: string;
  sizeBreakdown: Record<string, number>;
  totalQty: number;
}

export interface POEntity {
  id: string;
  code: string;
  collectionId: string;
  factoryId: string;
  status: POStatus;
  confirmedAt?: string;
  criticalPathEnd?: string;
  /** Предупреждение о срыве срока (мок: вычисляется в alerts) */
  atRisk?: boolean;
  lines: POLineEntity[];
  createdAt: string;
}

export type PurchaseStatus = 'not_ordered' | 'ordered' | 'in_transit' | 'received' | 'reserved';

export interface BOMLineEntity {
  id: string;
  articleId: string;
  materialCode: string;
  materialName: string;
  qtyPerUnit: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  purchaseStatus: PurchaseStatus;
  etaToFactory?: string;
  reservedQty: number;
}

export type QCPlanStatus = 'planned' | 'done' | 'failed' | 'cancelled';

export interface QCPlanEntity {
  id: string;
  poId: string;
  articleId?: string;
  type: 'inline' | 'final';
  scheduledAt: string;
  status: QCPlanStatus;
  checklistTemplateId: string;
}

export type QCResult = 'pass' | 'fail' | 'rework';

export interface QCInspectionEntity {
  id: string;
  planId: string;
  poId: string;
  articleId?: string;
  result: QCResult;
  notes?: string;
  photoUrls: string[];
  blocksShipment: boolean;
  inspectedAt: string;
  inspectorLabel: string;
}

export interface ThreadMessageEntity {
  id: string;
  at: string;
  authorRole: string;
  authorLabel: string;
  body: string;
  fileUrl?: string;
  techPackVersion?: string;
}

export interface ThreadEntity {
  id: string;
  scope: 'article' | 'po';
  scopeId: string;
  messages: ThreadMessageEntity[];
}

export interface AuditEntryEntity {
  id: string;
  at: string;
  userId: string;
  userLabel: string;
  entityType: string;
  entityId: string;
  action: string;
  fromValue?: string;
  toValue?: string;
  meta?: Record<string, unknown>;
}

export interface B2BOrderRefEntity {
  id: string;
  collectionId: string;
  articleSku: string;
  qty: number;
  status: string;
  orderRef: string;
}

/** Настройки интеграций (подключение API позже) */
export interface IntegrationConfigEntity {
  erpExportEnabled: boolean;
  erpType?: '1c' | 'moy_sklad' | 'custom';
  webhookUrl?: string;
  webhookSecretPlaceholder?: string;
  factoryStatusWebhookEnabled: boolean;
  lastExportAt?: string;
}

export type ProductionRole = 'design' | 'production' | 'procurement' | 'merchandising' | 'admin';

export interface BrandProductionState {
  collections: CollectionEntity[];
  articles: ArticleEntity[];
  factories: FactoryEntity[];
  purchaseOrders: POEntity[];
  bomLines: BOMLineEntity[];
  qcPlans: QCPlanEntity[];
  qcInspections: QCInspectionEntity[];
  threads: ThreadEntity[];
  auditLog: AuditEntryEntity[];
  b2bOrderRefs: B2BOrderRefEntity[];
  integration: IntegrationConfigEntity;
  /** Текущий пользователь (мок до auth API) */
  currentUserId: string;
  currentUserLabel: string;
  currentRole: ProductionRole;
}
