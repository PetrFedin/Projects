/** Версии экспортируемых JSON для миграций при подключении API */

export const VISUAL_SEARCH_EXPORT_VERSION = 1 as const;
export const CAPSULE_EXPORT_VERSION = 1 as const;
export const FOR_YOU_PREFS_VERSION = 1 as const;

export type VisualSearchHit = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  /** 0..1, демо-скор */
  score?: number;
};

export type VisualSearchSessionV1 = {
  version: typeof VISUAL_SEARCH_EXPORT_VERSION;
  updatedAt: number;
  /** data URL превью (может быть большим — в проде хранить object id) */
  previewDataUrl?: string | null;
  hits: VisualSearchHit[];
  queryNote?: string;
};

export type CapsuleExportV1 = {
  version: typeof CAPSULE_EXPORT_VERSION;
  exportedAt: number;
  name: string;
  productIds: (string | null)[];
};

export type ForYouPreferencesV1 = {
  version: typeof FOR_YOU_PREFS_VERSION;
  updatedAt: number;
  sizeHint: string;
  brandHints: string[];
};

export type ForYouFeedItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  reasonTag?: string;
};

/** Партнёрские демо-строки — форма для будущего API */
export type PartnerAssortmentMatrixRow = {
  channel: string;
  sku: string;
  color: string;
  sizes: string;
  status: string;
  sellThrough: string;
  season?: string;
  lastSync?: string;
};

export type PartnerMarkdownHint = {
  sku: string;
  reason: string;
  action: string;
  confidence: 'rule' | 'ml_stub' | 'manual';
  region?: string;
  channel?: string;
};

export type PartnerFactorySample = {
  id: string;
  style: string;
  status: string;
  issue: string;
  dueAt?: string;
  poRef?: string;
};

export type PartnerMarketplaceIssue = {
  marketplace: string;
  region: string;
  sku: string;
  problem: string;
  severity: 'high' | 'med' | 'low';
  fixHint?: string;
};

export type PartnerDamPolicyRow = {
  id: string;
  label: string;
  enabled: boolean;
  scope: string;
};

/** DPP — контракт для API; локально собирается из товара + демо */
export type DppSupplyStep = {
  stage: string;
  location: string;
  detail: string;
  status: 'completed' | 'pending' | 'issue';
};

export type DppMaterial = {
  name: string;
  percentage: number;
  description: string;
};

export type DppCertificate = {
  name: string;
  description: string;
  tone: 'emerald' | 'blue' | 'indigo';
};

export type DigitalProductPassportPayload = {
  passportId: string;
  productId: string;
  productName: string;
  brand: string;
  sustainabilityScore: number;
  sustainabilityBlurb: string;
  batchLabel: string;
  dyeBatchLabel: string;
  fabricCertLine: string;
  supplyChain: DppSupplyStep[];
  materials: DppMaterial[];
  certificates: DppCertificate[];
};

export type FitFeedbackAggregateDto = {
  sku: string;
  runsSmall: number;
  trueFit: number;
  runsLarge: number;
  source: 'local_storage' | 'api';
};
