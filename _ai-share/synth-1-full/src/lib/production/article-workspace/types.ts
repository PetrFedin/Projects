/**
 * Снимки вкладок страницы артикула в разработке коллекции.
 * Контракт рассчитан на последующую замену локального адаптера на HTTP без смены UI.
 */

export type ArticleRef = {
  collectionId: string;
  articleId: string;
};

export type SupplyLineStatus =
  | 'draft'
  | 'ordered'
  | 'in_transit'
  | 'at_factory'
  | 'reserved'
  | 'consumed';

export type SupplySnapshot = {
  /** BOM / строки сырья — заготовка под VMI и брони. */
  lines: {
    id: string;
    label: string;
    qtyNote?: string;
    status: SupplyLineStatus;
    qty?: number;
    unit?: string;
    costPerUnit?: number;
    leadTimeDays?: number; // Added: Material lead time tracking
    vendorItemId?: string; // Added: B2B Vendor Connect mock
    sourceNote?: string;
  }[];
  note?: string;
};

export type FitComment = {
  id: string;
  text: string;
  at: string;
  by?: string;
  role?: 'designer' | 'technologist' | 'brand_manager';
};

export type CadVersion = {
  id: string;
  articleId: string;
  versionNumber: number;
  fileUrl: string;
  createdAt: string;
};

export type FitSessionComment = {
  id: string;
  targetAnchor: string;
  text: string;
  photoUrls: string[];
  by?: string;
  at?: string;
};

export type FitSession = {
  id: string;
  sampleType: 'proto' | 'sms' | 'pps' | 'top';
  status: 'pending' | 'approved' | 'rework' | 'approved_with_comments';
  dateStr: string;
  measurementsDelta: Record<string, number>;
  comments: FitSessionComment[];
  cadVersionId?: string | null;
  aiFitAnalysis?: {
    wrinklesDetected: string[];
    recommendations: string[];
  };
};

export type FitGoldSnapshot = {
  goldApproved: boolean;
  approvedAt?: string;
  approvedBy?: string;
  fitComments: FitComment[];
  virtualFitScore?: number; // 0-100 from VTO
  sessions?: FitSession[];
  baseSpecUpdatedFromDeltasAt?: string; // Track when deltas were applied to base spec
};

export type PoLine = {
  id: string;
  label: string;
  qty?: string;
  dueNote?: string;
  status: 'draft' | 'sent' | 'confirmed' | 'closed';
};

export type PlanPoSnapshot = {
  purchaseOrders: PoLine[];
  milestoneNote?: string;
  nestingAiOptimization?: {
    lastRunAt: string;
    efficiencyGainPct: number;
    fabricsOptimized: string[];
  };
};

export type NestingArtifact = {
  id: string;
  title: string;
  efficiencyPct?: number;
  length?: number;
  layers?: number;
  fileRefNote?: string;
  at: string;
};

export type NestingSnapshot = {
  artifacts: NestingArtifact[];
};

export type QcBatch = {
  id: string;
  label: string;
  status: 'pending' | 'passed' | 'failed' | 'rework';
  at?: string;
  note?: string;
  batchSize?: number; // Added: For AQL calculations
  inspectedSize?: number; // Added: For AQL inspection
  majorDefects?: number; // Added: Critical for QC reporting
  minorDefects?: number; // Added: Critical for QC reporting
  defectPhotosCount?: number;
  mobileInspectionRef?: string;
};

export type QcSnapshot = {
  batches: QcBatch[];
};

export type StockMovement = {
  id: string;
  label: string;
  qty: number;
  unitCostRub: number;
  at: string;
  kind: 'in' | 'out' | 'transfer';
};

export type StockSnapshot = {
  onHandNote?: string;
  movements: StockMovement[];
};

/** Выпуск: смены, субподряд — расширяется позже без смены ключа в LS. */
export type ProductionOperation = {
  id: string;
  name: string;
  sash: number; // Стандартное время (мин/ед)
  machineSetupTime?: number; // Время переналадки (мин)
  costPerUnit: number;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
};

export type ReleaseSnapshot = {
  note?: string;
  shiftNote?: string;
  subcontractNote?: string;
  sampleMaterialsNote?: string; // Материалы для отшива образца
  operations?: ProductionOperation[];
};

export type ArticleWorkspaceBundle = {
  schemaVersion: 1;
  updatedAt?: string;
  /** Текущая версия ТЗ, на которой базируются производственные данные */
  lastSyncedDossierVersion?: number;
  supply?: SupplySnapshot;
  fitGold?: FitGoldSnapshot;
  planPo?: PlanPoSnapshot;
  nesting?: NestingSnapshot;
  release?: ReleaseSnapshot;
  qc?: QcSnapshot;
  stock?: StockSnapshot;
};

export type ArticleWorkspaceDataMode = 'local' | 'http';
