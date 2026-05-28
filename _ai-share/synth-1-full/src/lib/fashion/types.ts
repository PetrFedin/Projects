/** Доменные типы fashion-слоя (композиция, уход, образ, палитра). */

export type FashionSlot =
  | 'top'
  | 'bottom'
  | 'dress'
  | 'outer'
  | 'footwear'
  | 'accessory'
  | 'unknown';

export type OutfitGapResult = {
  filled: FashionSlot[];
  missing: FashionSlot[];
  hint: string;
};

export type ColorHarmonySuggestion = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  reason: string;
  score: number;
};

export type FitAdvice = {
  skew: 'size_up' | 'size_down' | 'true_to_size' | 'unknown';
  headline: string;
  detail: string;
};

export type CareSymbolDef = {
  id: string;
  label: string;
  short: string;
};

export type FabricRollupRow = {
  sku: string;
  name: string;
  color: string;
  season: string;
  compositionText: string;
  careIds: string;
};

/** 0–100: эвристика для витрины и фильтров до LCA API */
export type SustainabilityBreakdown = {
  score: number;
  tier: 'high' | 'mid' | 'low' | 'unknown';
  matchedSignals: string[];
  summary: string;
};

export type AttributeHealthRow = {
  sku: string;
  slug: string;
  name: string;
  completeness: number;
  gaps: string[];
};

export const INSPIRATION_BOARD_VERSION = 1 as const;

export type InspirationPinV1 = {
  productId: string;
  slug: string;
  note?: string;
  addedAt: number;
};

export type InspirationBoardStateV1 = {
  version: typeof INSPIRATION_BOARD_VERSION;
  updatedAt: number;
  title: string;
  pins: InspirationPinV1[];
};

/** Строка таблицы мерок из PIM (`attributes.sizeChart`). */
export type SizeChartRow = Record<string, string | number | undefined>;

export type FashionSeasonParsed = {
  raw: string;
  half: 'SS' | 'FW' | null;
  year: number | null;
  isCarryover: boolean;
};

export type LaunchReadinessCheck = {
  id: string;
  label: string;
  ok: boolean;
};

export type LaunchReadinessResult = {
  percent: number;
  checks: LaunchReadinessCheck[];
};

export type SizeCompareRow = { label: string; left: string; right: string };

export type GalleryHealthResult = {
  score: number;
  ok: boolean;
  issues: string[];
};

export type CategoryIndexBucket = {
  path: string;
  count: number;
  exampleSlug: string;
};

export type PriceWatchEntryV1 = {
  sku: string;
  slug: string;
  nameSnapshot: string;
  priceSnapshot: number;
  addedAt: number;
};

export type SizeConversionRow = { label: string; eu: string; us: string; uk: string };

export type ProductIdentifierField = { key: string; label: string; value: string };

export type AssortmentMixRow = {
  category: string;
  count: number;
  pct: number;
};

export type PackRuleRow = {
  sku: string;
  slug: string;
  moq: number | null;
  casePack: number | null;
  leadWeeks: number | null;
  incoterm: string;
  shipFrom: string;
};

export type SubstituteCandidate = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  color: string;
  reason: string;
};

export type AlterationOffer = {
  available: boolean;
  services: string[];
  note: string;
};

export const STYLE_QUIZ_VERSION = 1 as const;

export type StyleQuizProfileV1 = {
  version: typeof STYLE_QUIZ_VERSION;
  updatedAt: number;
  mood: 'minimal' | 'bold' | 'classic';
  silhouette: 'fitted' | 'relaxed';
  palette: 'neutral' | 'bright';
};

export type FabricSpecExtract = {
  gsm: number | null;
  construction: string;
  handfeelNote: string;
};

export type CategoryPriceStat = {
  category: string;
  count: number;
  min: number;
  max: number;
  avg: number;
  median: number;
};

export type DutyEstimateResult = {
  ratePct: number;
  dutyRub: number;
  vatRub: number;
  totalRub: number;
  note: string;
};

export type BundleOfferV1 = {
  id: string;
  name: string;
  items: string[]; // slugs or SKUs
  discountPct: number;
  totalOriginal: number;
  totalDiscounted: number;
};

export type GarmentMeasurementV1 = {
  label: string;
  value: string | number;
  unit: string;
};

export type SizeMeasurementsV1 = {
  size: string;
  measurements: GarmentMeasurementV1[];
};

export type OccasionTag =
  | 'office'
  | 'evening'
  | 'casual'
  | 'vacation'
  | 'sport'
  | 'wedding'
  | 'home';

export type WaitlistEntryV1 = {
  sku: string;
  slug: string;
  name: string;
  size: string;
  addedAt: number;
};

export type DemandForecastRow = {
  sku: string;
  name: string;
  size: string;
  waitlistCount: number;
  trend: 'up' | 'down' | 'stable';
};

export type BodyProfileV1 = {
  chest?: number;
  waist?: number;
  hips?: number;
  height?: number;
  weight?: number;
};

export type FitMatchResultV1 = {
  size: string;
  score: number; // 0-100
  notes: string[];
};

export type TechPackV1 = {
  sku: string;
  name: string;
  composition: string;
  careSymbols: string[];
  measurements: SizeMeasurementsV1[];
  fabricSpec: FabricSpecExtract | null;
  productIdentifiers: { ean?: string; upc?: string; gtin?: string };
};

export type LineSheetItemV1 = {
  sku: string;
  name: string;
  price: number;
  wholesalePrice: number;
  moq: number;
  colors: string[];
  sizes: string[];
  imageUrl: string;
};

export type LcaScorecardV1 = {
  totalScore: number; // 0-100
  waterLiters: number;
  co2Kg: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  breakdown: Array<{ label: string; impact: number }>;
};

export type SalesVelocityRow = {
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  inventoryLevel: number;
  daysToOOS: number | null;
  status: 'bestseller' | 'stable' | 'slow-mover' | 'critical';
};

export type AssetCreditsV1 = {
  photographer?: string;
  modelName?: string;
  modelInstagram?: string;
  usageUntil?: string; // ISO Date
  location?: string;
};

export type WholesaleOrderEntryV1 = {
  sku: string;
  size: string;
  quantity: number;
  price: number;
};

export type InventoryTransferV1 = {
  sku: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  reason: 'oos_prevention' | 'slow_mover_liquidation';
};

export type StyleArchetypeV1 =
  | 'minimalist'
  | 'avant-garde'
  | 'classicist'
  | 'streetwear'
  | 'bohemian';

export type UserStyleProfileV1 = {
  archetype: StyleArchetypeV1;
  confidence: number; // 0-100
  topCategories: string[];
  colorPreferences: string[];
};

export type MaterialOriginV1 = {
  fiber: string;
  country: string;
  facility?: string;
  certification?: string;
  percentage: number;
};

export type B2BCreditTermsV1 = {
  creditLimit: number;
  availableCredit: number;
  paymentTerms: 'net_15' | 'net_30' | 'net_60' | 'prepaid';
  currency: string;
  outstandingBalance: number;
};

export type AssortmentOverlapV1 = {
  skuA: string;
  skuB: string;
  similarityScore: number; // 0-100
  reason: string;
  actionHint: string;
};

export type LookbookProjectV1 = {
  id: string;
  title: string;
  skus: string[];
  status: 'draft' | 'review' | 'published' | 'archived';
  updatedAt: number;
};

export type DesignDnaV1 = {
  neckline?: string;
  sleeveLength?: string;
  fit?: string;
  hemline?: string;
  fastening?: string;
  pocketType?: string;
};

/** Агрегированный индекс здоровья ассортимента (портфель). */
export type PortfolioAssortmentHealthV1 = {
  overallScore: number;
  attributeCompleteness: number;
  salesVelocityTrend: 'up' | 'down' | 'stable';
  overlapRiskCount: number;
  readyToLaunchPct: number;
};

export type StylePairingRuleV1 = {
  id: string;
  sourceCategory: string;
  targetCategories: string[];
  styleMatch: StyleArchetypeV1[];
  boostFactor: number;
};

export type FitSentimentV1 = {
  overall: 'small' | 'true' | 'large';
  confidence: number;
  returnRate: number;
  topComplaints: string[];
};

export type MarginSimulationV1 = {
  sku: string;
  productionCost: number;
  logisticsCost: number;
  marketingCost: number;
  retailPrice: number;
  vatPct: number;
  markup: number;
  netMarginPct: number;
  netProfit: number;
};

export type ContentChannelV1 = 'wb' | 'ozon' | 'lamoda' | 'shopify' | 'instagram';

export type SyndicatedContentV1 = {
  channel: ContentChannelV1;
  title: string;
  description: string;
  keyFeatures: string[];
  tone: 'professional' | 'emotional' | 'technical';
};

export type QcCheckItemV1 = {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'pending';
  comment?: string;
};

export type FactoryInspectionV1 = {
  sku: string;
  inspector: string;
  date: string;
  checks: QcCheckItemV1[];
  overallResult: 'approved' | 'rejected' | 'rework';
};

export type MarkdownRecommendationV1 = {
  sku: string;
  currentPrice: number;
  suggestedDiscount: number;
  reason: string;
  projectedSellThrough: number;
};

export type ShowroomAppointmentV1 = {
  id: string;
  partnerName: string;
  date: string;
  time: string;
  type: 'physical' | 'virtual';
  status: 'confirmed' | 'pending' | 'completed';
};

export type TrendSentimentV1 = {
  score: number; // 0-100
  momentum: 'rising' | 'falling' | 'stable';
  keyDrivers: string[];
  marketComparison: string;
};

export type DigitalTwinTestV1 = {
  id: string;
  designName: string;
  variants: number;
  votes: number;
  conversionEstimate: number;
  status: 'active' | 'completed';
};

export type AssortmentMixV1 = {
  category: string;
  currentPct: number;
  targetPct: number;
  skuCount: number;
  gap: number;
};

export type ProductHeritageV1 = {
  storyHeadline: string;
  artisanNote?: string;
  archiveReference?: string;
  sustainabilityHigh: boolean;
};

export type SizeAffinityV1 = {
  brand: string;
  affinityScore: number; // 0-100
  recommendedSize: string;
};

export type ReplenishmentPlanV1 = {
  sku: string;
  suggestedQty: number;
  urgency: 'high' | 'normal' | 'low';
  restockDate: string;
};

export type MpAssetCheckV1 = {
  channel: string;
  status: 'pass' | 'fail';
  missingTypes: string[];
  resolutionIssues: string[];
};

export type LoyaltyRewardV1 = {
  pointsToEarn: number;
  bonusMultiplier: number;
  perks: string[];
};

export type CollectionLcaSummaryV1 = {
  totalCo2: number;
  totalWater: number;
  avgScore: number;
  topImpactCategory: string;
};

/** Пробелы ассортимента по категории (цвета, ценовые ярусы). */
export type CategoryAssortmentGapV1 = {
  category: string;
  missingColors: string[];
  missingPricePoints: string[];
  demandSignal: 'high' | 'medium';
};

export type PriceLadderBucketV1 = {
  priceRange: string;
  skuCount: number;
  avgMargin: number;
};

export type CareLongevityTipV1 = {
  action: string;
  impact: string;
  estYearsAdded: number;
};

export type SourcingRfqV1 = {
  id: string;
  sku: string;
  targetQty: number;
  targetPrice: number;
  status: 'draft' | 'sent' | 'bid_received' | 'closed';
};

export type CostPerWearV1 = {
  sku: string;
  retailPrice: number;
  projectedWears: number;
  costPerWear: number;
  investmentGrade: 'high' | 'medium' | 'low';
};

export type ProductRiskScoreV1 = {
  overallRisk: number; // 0-100
  deliveryRisk: number;
  qualityRisk: number;
  popularityRisk: number;
  alerts: string[];
};

export type SupplyChainTierV1 = {
  tier: 1 | 2 | 3;
  name: string;
  location: string;
  role: 'assembly' | 'fabric' | 'yarn' | 'raw_material';
  certification?: string;
};

export type VisualMerchSlotV1 = {
  sku: string;
  position: number;
  visualWeight: number; // 0-100
  colorHarmonyScore: number;
};

export type WholesalePreOrderV1 = {
  productId: string;
  moq: number; // Minimum Order Quantity
  tierPrices: { minQty: number; price: number }[];
  preOrderWindow: { start: string; end: string };
  allocationStatus: 'open' | 'limited' | 'sold_out';
};

export type ReturnPredictionV1 = {
  productId: string;
  riskScore: number; // 0-100
  topRiskFactor: 'fit' | 'color_mismatch' | 'fabric_feel' | 'style_preference';
  advice: string;
};

export type SupplierMetricV1 = {
  supplierId: string;
  name: string;
  leadTimeDays: number;
  qualityScore: number; // 0-100
  complianceGrade: 'A' | 'B' | 'C' | 'D';
  activeOrders: number;
};

/** Карточка поставщика для сводных списков (без привязки к заказу) — `supplier-logic.ts`. */
export type SupplierScorecardMetricV1 = {
  id: string;
  name: string;
  qualityScore: number;
  esgGrade: 'A' | 'B' | 'C' | 'D';
  avgLeadTimeDays: number;
  onTimeDeliveryPct: number;
};

export type CannibalizationImpactV1 = {
  primarySku: string;
  competingSku: string;
  overlapScore: number; // 0-100
  riskLevel: 'high' | 'medium' | 'low';
  recommendation: string;
};

/** Отдельная сущность от `LookbookProjectV1`: съёмка/локация (планировщик). */
export type LookbookShootScheduleV1 = {
  id: string;
  name: string;
  shootingDate: string;
  skus: string[];
  location: string;
  status: 'draft' | 'confirmed' | 'completed';
};

export type FashionClvV1 = {
  customerId: string;
  predictedLtv: number;
  propensityToChurn: number; // 0-100
  categoryAffinity: string[];
  lastPurchaseDate: string;
};

export type FabricWasteV1 = {
  sku: string;
  materialUsed: number; // sq meters
  estimatedWaste: number; // percentage
  cutOptimizationScore: number; // 0-100
  savedMaterialCo2: number; // kg
};

export type B2BCampaignV1 = {
  id: string;
  version: string;
  theme: string;
  targetMarket: string;
  activeStatus: boolean;
  publishedAt: string;
};

/** Каталожные ценовые кампании (мультипликаторы, early bird) — `campaign-logic.ts`. */
export type B2BCatalogPriceCampaignV1 = {
  id: string;
  version: 'early_bird' | 'standard' | 'outlet' | 'sample_sale';
  priceMultiplier: number;
  accessExpiry: string;
  moqOverride?: number;
};

export type HonestMarkStatusV1 = {
  sku: string;
  status: 'active' | 'pending' | 'applied' | 'error';
  gtin: string;
  tnved: string; // Russian Customs Code
  labelType: 'clothing' | 'footwear' | 'linen';
  updatedAt: string;
};

export type EdoDocumentV1 = {
  id: string;
  type: 'upd' | 'invoice' | 'act';
  status: 'signed' | 'pending' | 'rejected' | 'delivered';
  counterparty: string;
  totalAmount: number;
  signedAt?: string;
};

export type BnplInstallmentV1 = {
  totalPrice: number;
  installments: number; // e.g., 4
  paymentAmount: number;
  nextPaymentDate: string;
  provider: 'dolyame' | 'split' | 'split_tinkoff';
};

export type RegionalStockV1 = {
  warehouse:
    | 'Central (Moscow)'
    | 'South (Krasnodar)'
    | 'Ural (Ekaterinburg)'
    | 'Siberia (Novosibirsk)';
  quantity: number;
  deliveryDays: number;
  lastSync: string;
};

export type MarketplaceMappingV1 = {
  sku: string;
  wildberriesId?: string;
  ozonId?: string;
  lamodaId?: string;
  status: 'synced' | 'pending' | 'error';
  lastFeedUpdate: string;
};

export type SizeConversionV1 = {
  system: 'RU' | 'EU' | 'US' | 'INTL' | 'UK';
  value: string;
  brandSpecificNote?: string;
};

export type DeliveryRateV1 = {
  service: 'CDEK' | 'Boxberry' | 'Russian Post';
  city: string;
  price: number;
  days: string;
  type: 'courier' | 'pickup';
};

export type RetailPlanogramV1 = {
  storeId: string;
  section: string;
  shelfPosition: number;
  adjacentSkus: string[]; // SKUs that should be nearby for cross-selling
  visualMerchTip: string;
};

export type SocialAttributionV1 = {
  channel: 'Telegram' | 'VK' | 'Instagram' | 'Bloggers';
  reach: number;
  conversionRate: number;
  promoCode: string;
  activeStatus: boolean;
};

export type EaeuPassportV1 = {
  id: string;
  declarationNumber: string; // ЕАЭС N RU Д-CN.РА01...
  standard: 'ГОСТ ISO 12947-2' | 'ГОСТ 31282' | 'ГОСТ 32119';
  validUntil: string;
  testingLab: string;
  qrUrl: string;
};

export type LocalPaymentV1 = {
  method: 'SBP' | 'SberPay' | 'TinkoffPay' | 'Card';
  bonusReward: number; // e.g., 5% extra cashback
  isPreferred: boolean;
  description: string;
};

export type DemandHeatmapV1 = {
  region: string;
  demandIndex: number; // 0-100
  stockStatus: 'optimal' | 'low' | 'overstock';
  topCategory: string;
};

export type FittingAnalyticsV1 = {
  storeId: string;
  fittingsCount: number;
  conversionToPurchase: number; // percentage
  avgTimeInFittingRoom: number; // minutes
  topAlternativeSku?: string;
};

export type LoyaltyQuestV1 = {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  status: 'available' | 'in_progress' | 'completed';
  category?: string;
};

export type CisSupplierV1 = {
  id: string;
  name: string;
  location: 'Moscow' | 'Saint-P' | 'Ivanovo' | 'Minsk' | 'Almaty';
  specialization: 'knitwear' | 'denim' | 'outerwear' | 'accessories';
  moq: number;
  rating: number;
};

export type EaeuTaxV1 = {
  country: 'KZ' | 'BY' | 'AM' | 'KG';
  vatRate: number;
  exportDuty: number;
  totalLandCost: number;
};

export type FabricDefectScanV1 = {
  sku: string;
  batchId: string;
  detectedDefects: number;
  defectTypes: ('stain' | 'hole' | 'thread_pull' | 'color_variance')[];
  passRate: number; // percentage
  actionRequired: 'quarantine' | 'rework' | 'pass';
};

export type PriceOptimizationV1 = {
  currentPrice: number;
  recommendedPrice: number;
  confidenceScore: number;
  reason: string;
  trendFactor: 'high_demand' | 'overstock' | 'season_end' | 'competitor_drop';
};

export type CircularityScoreV1 = {
  sku: string;
  recycledContent: number; // percentage
  recyclabilityRate: number; // percentage
  carbonSavings: number; // kg
};

export type StoreWeatherCorrelationV1 = {
  storeId: string;
  date: string;
  weatherCondition: 'rain' | 'snow' | 'sunny' | 'cold';
  trafficImpact: number; // percentage change
  recommendedStock: string[]; // SKUs to push
};

export type CustomsDutyV1 = {
  priceEur: number;
  weightKg: number;
  dutyEur: number;
  brokerFee: number;
  totalDutyRub: number;
  isAboveThreshold: boolean;
};

export type InfluencerSeedingV1 = {
  id: string;
  name: string;
  channel: 'Telegram' | 'VK' | 'YouTube';
  status: 'draft' | 'shipped' | 'mention_received' | 'completed';
  sentSku: string;
  reach: number;
};

export type MarketplaceHealthV1 = {
  sku: string;
  marketplace: 'WB' | 'Ozon' | 'Lamoda';
  buyboxStatus: 'won' | 'lost' | 'not_applicable';
  ratingTrend: 'up' | 'down' | 'stable';
  outOfStockRisk: number; // 0-100
  buybackRate: number; // percentage (выкуп)
};

export type SeasonalMaterialFitV1 = {
  sku: string;
  materialGsm: number;
  recommendedTempRange: string;
  fitScore: number; // 0-100 for current region
  advice: string;
};

export type PvzEfficiencyV1 = {
  sku: string;
  pvzTryOnRate: number; // % of orders tried on at pickup point
  pvzReturnRate: number; // % returned at PVZ
  avgStayAtPvz: number; // minutes
  logisticLossPerUnit: number; // RUB
};

/** Расширенная запись шоурума (локация, отбор SKU) — не путать с `ShowroomAppointmentV1`. */
export type ShowroomAppointmentSessionV1 = {
  id: string;
  partnerName: string;
  date: string;
  location: 'Moscow Showroom' | 'Almaty Hub' | 'Milan Virtual';
  selectedSkus: string[];
  status: 'scheduled' | 'review' | 'order_placed';
  sampleStatus: 'ready' | 'missing' | 'in_transit';
  estimatedPreOrderValue?: number;
  partnerFeedback?: Record<string, 'love' | 'maybe' | 'skip'>;
  sessionNotes?: string;
};

export type ShowroomSessionV1 = {
  id: string;
  appointmentId: string;
  activeSkus: string[];
  orderDraft: { sku: string; quantity: number }[];
  lastInteraction: string; // ISO timestamp
};

export type B2BReservationV1 = {
  id: string;
  partnerId: string;
  sku: string;
  quantity: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'converted';
};

export type FabricDigitalTwinV1 = {
  sku: string;
  martindaleCycles: number; // Abraison resistance
  pillingGrade: number; // 1-5
  colorFastness: number; // 1-5
  breathabilityGsm: number;
  washDurability: number; // Cycles until loss of shape
};

export type RegionalHubStockV1 = {
  sku: string;
  hubs: {
    name: 'Moscow Central' | 'Saint Petersburg' | 'Ekaterinburg' | 'Novosibirsk' | 'Krasnodar';
    available: number;
    transitDays: number;
  }[];
};

export type OrderAnomalyV1 = {
  sku: string;
  quantity: number;
  anomalyType: 'overstock' | 'size_imbalance' | 'price_outlier' | 'region_mismatch';
  severity: 'low' | 'medium' | 'high';
  reason: string;
  suggestion: string;
};

export type HonestMarkRequirementV1 = {
  sku: string;
  status: 'ready' | 'pending' | 'missing';
  codesRequired: number;
  ean: string;
  declarationEaeu: string;
};

export type WholesaleRebateV1 = {
  partnerId: string;
  currentTurnover: number;
  targetForNextRebate: number;
  estimatedRebatePercent: number;
  activePromos: string[];
};

export type ShowroomLookV1 = {
  id: string;
  name: string;
  items: string[]; // SKUs
  totalWholesale: number;
  stylingNotes?: string;
};

export type RegionalDemandV1 = {
  region: string;
  demandScore: number; // 0-100
  topCategories: string[];
  growthRate: number; // percentage
  competitorSaturation: 'low' | 'medium' | 'high';
};

export type B2BContractV1 = {
  id: string;
  partnerId: string;
  orderValue: number;
  status: 'draft' | 'signed' | 'expired';
  terms: string;
  generatedDate: string;
  legalEntityRu: string;
};

export type FulfillmentRiskV1 = {
  sku: string;
  logisticRisk: number; // 0-100
  productionRisk: number; // 0-100
  overallScore: number; // 0-100
  factors: string[];
};

export type ShowroomEngagementV1 = {
  sku: string;
  totalViewTimeSec: number;
  interactedWith3d: boolean;
  engagementScore: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'skeptical';
};

export type TieredPriceV1 = {
  sku: string;
  baseWholesale: number;
  tiers: { minQty: number; price: number }[];
};

export type PartnerContentPackV1 = {
  sku: string;
  socialNetworks: ('VK' | 'Telegram' | 'Instagram')[];
  assetsCount: number;
  copywritingReady: boolean;
  previewUrl?: string;
};

export type EdiDocumentV1 = {
  id: string;
  type: 'invoice' | 'contract' | 'specification' | 'waybill';
  status: 'pending' | 'signed' | 'error';
  ediOperator: 'Diadoc' | 'Sbis' | '1C-Link';
  legalRef: string;
};

/** Пробелы в строках заказа (рекомендации по SKU). */
export type OrderLineAssortmentGapV1 = {
  sku: string;
  recommendation: 'essential' | 'optional' | 'trend_match';
  reason: string;
  missingInCurrentOrder: boolean;
};

export type EaeuCustomsValueV1 = {
  sku: string;
  transactionValue: number;
  insuranceCost: number;
  freightCost: number;
  totalCustomsValue: number;
  dutyRatePercent: number;
  vatRatePercent: number;
  estimatedTotalTax: number;
};

export type SessionParticipantV1 = {
  id: string;
  name: string;
  role: 'Buyer' | 'Merchandiser' | 'Brand Manager';
  isOnline: boolean;
  lastAction?: string;
};

export type AssortmentCapsuleV1 = {
  id: string;
  name: string;
  skus: string[];
  retailSellThroughEstimate: number; // 0-100
  stylingDirection: string;
};

export type PaymentMilestoneV1 = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  percentage: number;
};

export type RegionalVelocityV1 = {
  region: string;
  predictedSellThrough: number; // %
  topSizeRank: string[]; // e.g. ['M', 'L', 'S']
  localTrendFactor: number; // 1.0 is neutral
};

export type B2BClaimV1 = {
  id: string;
  sku: string;
  type: 'defect' | 'shortage' | 'wrong_item';
  status: 'under_review' | 'approved' | 'rejected';
  ediRef: string;
};

export type StockExchangeV1 = {
  sku: string;
  type: 'excess' | 'request';
  partnerId: string;
  quantity: number;
  location: string;
  pricePerUnit: number;
  status: 'active' | 'negotiation' | 'completed';
};

export type MarketplaceSentimentV1 = {
  sku: string;
  wbRating: number;
  ozonRating: number;
  summarySentiment: string;
  topPositiveTraits: string[];
  topNegativeTraits: string[];
  reviewCountTotal: number;
};

export type WeatherDemandCorrelationV1 = {
  sku: string;
  region: string;
  temperatureSensitivity: number; // 1-10
  idealTempRange: string;
  demandShiftFactor: number; // e.g. 1.2 for late spring
  recommendation: string;
};

export type SampleTrafficV1 = {
  sku: string;
  timesTouched: number;
  avgInspectionTimeSec: number;
  physicalInterestRank: number;
  conversionToDraftRate: number; // %
};

export type B2BLogisticsRouteV1 = {
  id: string;
  carrier: 'CDEK' | 'PEK' | 'Dellin' | 'BusinessLines';
  from: string;
  to: string;
  estDays: number;
  costRub: number;
  reliabilityScore: number; // 1-100
  carbonFootprintKg: number;
};

export type B2BLoyaltyQuestV1 = {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  progressPercent: number;
  status: 'active' | 'completed' | 'locked';
};

export type RemotePresenceV1 = {
  participantId: string;
  device: 'mobile' | 'tablet' | 'desktop';
  lastSeenPdpSection: string;
  isArActive: boolean;
  viewportX: number;
  viewportY: number;
};

export type RegionalDemandHeatmapV1 = {
  region: string;
  demandIndex: number; // 0-100
  trend: 'rising' | 'stable' | 'falling';
  topCategories: string[];
};

export type VMPlanogramV1 = {
  id: string;
  sku: string;
  displayType: 'hanging' | 'folding' | 'mannequin';
  priorityLevel: number; // 1-3
  suggestedNeighbors: string[]; // SKUs
  technicalNotes: string; // e.g. "Use wood hangers"
};

export type StorePerformanceV1 = {
  storeType: 'Street' | 'Mall' | 'Flagship' | 'Corner';
  predictedSellThrough: number;
  bestSellingSize: string;
  trafficIntensity: number; // 1-10
};

export type FittingRoomFeedbackV1 = {
  sku: string;
  rejectedCount: number;
  topReasons: string[]; // e.g. "Bad fit", "Transparent fabric"
  conversionRate: number; // try-on to buy %
};

export type StockSwapOfferV1 = {
  id: string;
  sku: string;
  fromStoreId: string;
  toStoreId: string;
  quantity: number;
  urgency: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_transit' | 'completed';
};

export type DynamicMarkdownV1 = {
  sku: string;
  currentPrice: number;
  suggestedMarkdownPercent: number;
  reason: string;
  projectedSellThroughIncrease: number;
  localStockLevel: 'excess' | 'optimal' | 'low';
};

export type RFIDScanSessionV1 = {
  id: string;
  timestamp: string;
  scannedCount: number;
  discrepancyCount: number;
  locationId: string;
  status: 'synced' | 'warning' | 'error';
};

export type StoreZoneHeatmapV1 = {
  zoneName: string; // e.g. "Window", "Core", "Sale"
  footfallCount: number;
  dwellTimeAvgSec: number;
  conversionRate: number;
};

export type B2BClientelingV1 = {
  partnerId: string;
  lastInteractionDate: string;
  preferredCategories: string[];
  totalLifetimeValue: number;
  unlockedPerks: string[];
  nextSuggestedMeeting: string;
};

export type StaffScheduleV1 = {
  id: string;
  shift: 'Morning' | 'Day' | 'Evening';
  requiredStaffCount: number;
  predictedTrafficPeak: string; // e.g. "14:00 - 16:00"
  efficiencyRating: number; // 1-100
};

export type B2BTechPackV1 = {
  sku: string;
  fabricComposition: string;
  trims: { name: string; source: string; quantity: number }[];
  careSymbols: string[];
  constructionType: string;
  sizeSpecsCm: Record<string, number>; // e.g. { chest: 54, length: 72 }
};

export type ProductionMilestoneV1 = {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dueDate: string;
  progressPercent: number;
};

export type RetailInventoryHealthV1 = {
  storeId: string;
  sku: string;
  onHand: number;
  minBuffer: number;
  status: 'healthy' | 'at_risk' | 'critical' | 'excess';
  action: string;
};

export type RUContractSpecV1 = {
  id: string;
  docNumber: string;
  date: string;
  buyerLegalName: string;
  totalQuantity: number;
  totalAmountRub: number;
  items: { sku: string; name: string; qty: number; price: number }[];
};

export type StaffCommissionV1 = {
  sku: string;
  baseCommissionPercent: number;
  bonusAmountRub: number;
  targetQuantity: number;
  currentQuantity: number;
  incentiveType: 'volume' | 'vm_compliance' | 'upsell';
};

export type B2BRepairRequestV1 = {
  id: string;
  sku: string;
  partnerId: string;
  type: 'repair' | 'replacement' | 'recycling';
  status: 'pending' | 'shipped_to_brand' | 'fixing' | 'returned';
  trackingNumber?: string;
};

export type StoreContentPostV1 = {
  id: string;
  platform: 'VK' | 'Telegram';
  copyRu: string;
  mediaAssets: string[];
  scheduledDate: string;
  isAutoGenerated: boolean;
};

export type WholesaleAllocationV1 = {
  sku: string;
  totalRequested: number;
  allocatedPercent: number;
  fairnessScore: number; // 1-100
  reasoning: string;
};

export type StaffTrainingPackV1 = {
  sku: string;
  keySellingPointsRu: string[];
  fabricBenefitRu: string;
  fitAdviceRu: string;
  comparisonWithCompetitorsRu: string;
  videoUrl?: string;
};

export type PreOrderFinancingV1 = {
  totalAmount: number;
  depositPercent: number; // e.g. 30
  depositAmount: number;
  remainingAmount: number;
  remainingDueDate: string;
  isInterestFree: boolean;
  creditTermDays: number;
};

export type ClickAndCollectV1 = {
  orderId: string;
  storeId: string;
  readyForPickupDate: string;
  storageDaysLimit: number;
  status: 'picking' | 'in_transit_to_store' | 'ready' | 'picked_up' | 'expired';
};

export type StoreZoneConversionV1 = {
  zoneName: string;
  footTraffic: number;
  conversionPercent: number;
  recommendedVMScheme: string;
};

export type LineSheetV1 = {
  id: string;
  collectionName: string;
  items: { sku: string; wholesalePrice: number; moq: number }[];
  lastExported: string;
};

/** Здоровье ассортимента в разрезе категории. */
export type CategoryAssortmentHealthV1 = {
  category: string;
  colorBalance: number; // 0-100
  sizeAvailability: number; // 0-100
  marginHealth: number; // 0-100
  recommendations: string[];
};

export type PartnerTierV1 = {
  partnerId: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  creditLimit: number;
  paymentTermDays: number;
  discountPercentage: number;
};

/** Профиль оптового партнёра (кредитная линия, лояльность) — `wholesale-tiers.ts`. */
export type WholesalePartnerTierV1 = {
  partnerId: string;
  partnerName: string;
  tier: 'Diamond' | 'Platinum' | 'Gold';
  creditLine: number;
  unpaidInvoices: number;
  availableLimit: number;
  loyaltyPoints: number;
};

export type LaunchReadinessV1 = {
  sku: string;
  targetHoliday: 'New Year' | 'March 8' | 'Feb 23' | 'Back to School';
  stockReadiness: number; // 0-100
  marketingContentReady: boolean;
  honestMarkReady: boolean;
  launchStatus: 'on_track' | 'at_risk' | 'delayed';
};

export type BodyInclusivityV1 = {
  sku: string;
  slavicFitScore: number; // 0-100
  petiteFriendly: boolean;
  tallFriendly: boolean;
  adjustmentPoints: string[]; // e.g., ['waist elastic', 'adjustable straps']
};

export type ParallelImportV1 = {
  sku: string;
  originChain: string[]; // ['Manufacturer', 'Broker', 'Exporter']
  declarationStatus: 'verified' | 'pending' | 'missing';
  allowedInRf: boolean;
  complianceDocUrl?: string;
};

export type MarketplaceSeoV1 = {
  sku: string;
  marketplace: 'WB' | 'Ozon';
  keyword: string;
  rank: number;
  visibilityScore: number; // 0-100
  searchTrend: 'rising' | 'falling' | 'stable';
};

export type AlterationServiceV1 = {
  atelierName: string;
  distanceKm: number;
  availableServices: ('hem' | 'waist' | 'sleeves' | 'taper')[];
  estimatedPrice: number;
  bookingUrl: string;
};

export type LogisticStrategyV1 = {
  sku: string;
  recommendedModel: 'FBO' | 'FBS' | 'DBS';
  marginImpact: number; // percentage
  deliverySpeedBonus: number; // days saved
  reason: string;
};

export type RfidReconciliationV1 = {
  sku: string;
  expectedQty: number;
  scannedQty: number;
  discrepancy: number;
  lastScanDate: string;
  status: 'matched' | 'discrepancy' | 'pending';
};

export type ShowroomLookToOrderV1 = {
  lookId: string;
  skus: string[];
  totalWholesaleValue: number;
  conversionStatus: 'draft' | 'converted_to_order';
  targetStoreId?: string;
};

export type SupplierQcReportV1 = {
  sku: string;
  batchId: string;
  inspectionDate: string;
  passRate: number; // 0-100
  criticalDefects: string[];
  supplierName: string;
  status: 'approved' | 'rejected' | 'rework';
};

export type InStoreClientelingV1 = {
  clientId: string;
  styleProfile: string; // e.g. 'Minimalist'
  sizeAffinity: string; // e.g. 'M'
  lastPurchaseCategory: string;
  recommendedSkus: string[];
};

export type RegionalPriceLadderV1 = {
  region: string;
  avgRetailPrice: number;
  localCompetitorAvg: number;
  marginHealth: number;
  priceIndex: number; // 100 = national avg
};

export type FittingRoomQueueV1 = {
  storeId: string;
  sku: string;
  activeWaitlistCount: number;
  estimatedWaitMinutes: number;
  availableBooths: number;
  isRushHour: boolean;
};

export type RawMaterialBookingV1 = {
  bookingId: string;
  sku: string;
  fabricId: string;
  reservedQtyMeters: number;
  supplierId: string;
  expiryDate: string;
  status: 'reserved' | 'released' | 'converted_to_po';
};

export type DistributorStockBalanceV1 = {
  partnerId: string;
  sku: string;
  currentStock: number;
  sellThroughRate: number;
  rebalanceSuggestion: 'transfer_out' | 'transfer_in' | 'keep';
  targetQty: number;
};

export type PartnerReliabilityScoreV1 = {
  partnerId: string;
  orderFulfillmentRate: number; // 0-100
  paymentOnTimeRate: number; // 0-100
  returnRate: number; // 0-100
  reliabilityTier: 'A+' | 'A' | 'B' | 'C';
};

export type PlatformSystemHealthV1 = {
  module: string; // e.g., 'ECHO', 'CIS', 'WB_API'
  status: 'online' | 'warning' | 'critical';
  latencyMs: number;
  lastSuccessfulSync: string;
};

export type PreOrderAllocationV1 = {
  sku: string;
  totalAvailableQty: number;
  allocatedQty: number;
  reservedForTopTierQty: number;
  remainingQty: number;
  allocationStatus: 'open' | 'limited' | 'closed';
};

export type ProductionLeadTimeV1 = {
  sku: string;
  samplingDays: number;
  rawMaterialLeadDays: number;
  productionDays: number;
  logisticsDays: number;
  totalLeadDays: number;
  estimatedDeliveryDate: string;
};

export type RegionalLogisticsRoutingV1 = {
  sku: string;
  warehouseId: string;
  targetRegion: string;
  routeType: 'direct' | 'cross-dock' | 'milk-run';
  transitDays: number;
  costPerUnit: number;
  co2Impact: number;
};

export type ShowroomSessionBudgetV1 = {
  sessionId: string;
  partnerId: string;
  allocatedBudget: number;
  currentOrderValue: number;
  remainingBudget: number;
  targetMargin: number;
  currentEstimatedMargin: number;
};

export type B2BFactoringV1 = {
  partnerId: string;
  totalLimit: number;
  availableLimit: number;
  factoringStatus: 'eligible' | 'under_review' | 'not_eligible';
  averageDaysToPay: number;
  overdueAmount: number;
};

export type VmComplianceV1 = {
  storeId: string;
  sku: string;
  planogramMatchScore: number; // 0-100
  photoReportStatus: 'approved' | 'rejected' | 'pending';
  lastReportDate: string;
  complianceNotes: string[];
};

export type SampleLifecycleV1 = {
  sku: string;
  sampleType: 'Proto' | 'SMS' | 'Gold' | 'Press';
  location: 'Factory' | 'Showroom' | 'Atelier' | 'Marketing';
  status: 'in_transit' | 'received' | 'sent_back' | 'archived';
  trackingNumber?: string;
};

export type EaeuDigitalPassportV1 = {
  sku: string;
  honestMarkId: string; // KIZ
  edoStatus: 'signed' | 'pending' | 'draft';
  customsDeclarationNum?: string;
  certificationType: 'TR_CU' | 'EAC' | 'GOST';
  originCountry: string;
};

export type ShowroomSampleTrafficV1 = {
  sku: string;
  totalTouches: number;
  fittingsCount: number;
  scanDensityScore: number; // 0-100 (Heatmap)
  lastTouchTime: string;
};

export type WholesalePriceNegotiatorV1 = {
  sku: string;
  baseWholesalePrice: number;
  negotiatedPrice: number;
  qtyTier: number;
  marginAtNegotiatedPrice: number;
  status: 'draft' | 'approved' | 'counter_offered';
};

export type LocalCourierDispatchV1 = {
  orderId: string;
  courierService: 'CDEK' | 'Boxberry' | 'LocalStoreCourier';
  status: 'dispatched' | 'collected' | 'delivered';
  currentHub: string;
  estimatedArrival: string;
  trackingLink: string;
};

export type StockTransferTrackingV1 = {
  transferId: string;
  sku: string;
  fromStoreId: string;
  toStoreId: string;
  qty: number;
  status: 'picking' | 'in_transit' | 'received';
  expectedReceivedDate: string;
};

export type StaffShiftOptimizationV1 = {
  storeId: string;
  date: string;
  totalStaffNeeded: number;
  availableStaff: number;
  shiftStatus: 'optimal' | 'understaffed' | 'overstaffed';
  peakHours: string[]; // e.g., ['14:00', '18:00']
};

export type RepairHubRequestV1 = {
  requestId: string;
  sku: string;
  issueType: 'stitch' | 'zipper' | 'lining' | 'size_alteration';
  status: 'received' | 'in_repair' | 'ready_for_pickup';
  estimatedCost: number;
  atelierId: string;
};

export type SustainabilityLedgerV1 = {
  sku: string;
  materialOrigin: string;
  carbonFootprintKg: number;
  waterUsageLiters: number;
  isRecyclable: boolean;
  certificates: string[]; // e.g., ['GOTS', 'OEKO-TEX']
};

export type B2BQualityClaimV1 = {
  claimId: string;
  sku: string;
  partnerId: string;
  reason: 'fabric_defect' | 'stitching' | 'stain' | 'size_deviation';
  status: 'open' | 'under_review' | 'resolved' | 'credit_note_issued';
  evidenceUrls: string[];
  createdAt: string;
};

export type RegionalDemandPredictionV1 = {
  sku: string;
  region: string;
  demandIndex: number; // 0-100
  confidence: number; // 0-100
  growthFactor: 'weather' | 'local_trend' | 'event' | 'marketing';
  predictedQty: number;
};

export type ShowroomLookInterestV1 = {
  lookId: string;
  skus: string[];
  totalHearts: number;
  productionPriority: 'low' | 'medium' | 'high' | 'urgent';
  trendingStatus: 'rising' | 'stable' | 'fading';
};

export type StoreVipFittingV1 = {
  appointmentId: string;
  clientId: string;
  storeId: string;
  timeSlot: string;
  stylistId: string;
  preSelectedSkus: string[];
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
};

export type WholesaleTieredPricingV1 = {
  sku: string;
  tiers: { minQty: number; pricePerUnit: number; discountPercent: number }[];
  currentActiveTier: number;
};

export type RegionalHubFulfillmentV1 = {
  hubId: string;
  sku: string;
  stockInHub: number;
  availableForB2B: number;
  reservedForRetail: number;
  nextReplenishmentDate: string;
};

export type FactoryCapacityV1 = {
  factoryId: string;
  sku: string;
  totalMonthlyCapacity: number;
  currentBookedQty: number;
  utilizationPercent: number;
  earliestAvailableSlot: string;
};

export type PartnerCreditScoreV1 = {
  partnerId: string;
  creditScore: number; // 0-1000
  recommendedLimit: number;
  riskRating: 'low' | 'medium' | 'high';
  paymentHistoryPoints: number;
};

export type ShowroomBuyerPresenceV1 = {
  sessionId: string;
  activeBuyers: { name: string; currentSku: string; lastSeen: string }[];
};

export type ShowroomOrderSimulationV1 = {
  sessionId: string;
  projectedSellThrough: number; // 0-100
  projectedMargin: number; // 0-100
  inventoryTurnoverWeeks: number;
  markdownRiskScore: number; // 0-100
};

export type RegionalDeliveryWindowV1 = {
  region: string;
  earliestDeparture: string;
  latestArrival: string;
  availableCapacityUnits: number;
  truckType: 'standard' | 'refrigerated' | 'express';
  distributorId: string;
};

export type AssortmentClashV1 = {
  sku: string;
  nearbyCompetitorStores: number;
  clashIntensity: 'low' | 'medium' | 'high';
  suggestedAction: 'proceed' | 'diversify_color' | 'skip';
  radiusKm: number;
};

export type ShowroomCollabNoteV1 = {
  id: string;
  authorRole: 'brand' | 'store' | 'distributor';
  authorName: string;
  sku?: string;
  content: string;
  timestamp: string;
};

export type AllocationGroupV1 = {
  groupId: string; // e.g., 'Premium Clusters'
  storeCount: number;
  minAssortmentWidth: number; // min SKU count
  maxOrderValuePerStore: number;
  priority: 'low' | 'medium' | 'high';
};

export type B2BOrderSplitV1 = {
  sku: string;
  totalQty: number;
  splits: { storeId: string; qty: number; status: 'confirmed' | 'pending' }[];
};

export type PartnerPerkV1 = {
  perkId: string;
  title: string;
  requirementDescription: string;
  isUnlocked: boolean;
  progressPercent: number;
};

export type ShowroomVirtualSampleV1 = {
  sku: string;
  has3dModel: boolean;
  modelUrl?: string;
  avatarTypes: ('slavic' | 'asian' | 'curvy' | 'tall')[];
  fitAccuracy: number; // 0-100
};

export type EaeuTaxCalculationV1 = {
  country: 'BY' | 'KZ' | 'AM' | 'KG' | 'RU';
  vatRate: number; // e.g. 0.20
  customsDutyRate: number; // e.g. 0.05
  estimatedTotalTax: number;
  currency: 'RUB' | 'BYN' | 'KZT';
};

export type AssortmentCapsuleIntegrityV1 = {
  capsuleId: string;
  requiredSkus: string[];
  missingSkus: string[];
  integrityScore: number; // 0-100
  isCapsuleComplete: boolean;
};

export type WholesaleMilestoneV1 = {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedDate: string;
  actualDate?: string;
  riskFactor: number; // 0-100
};

export type B2BMultiCurrencySettlementV1 = {
  orderId: string;
  baseAmount: number; // in RUB
  currency: 'RUB' | 'CNY' | 'KZT' | 'BYN';
  exchangeRate: number;
  finalAmount: number;
  isRateLocked: boolean;
};

export type ShowroomResourceV1 = {
  resourceId: string;
  type: 'stylist' | 'fitting_room' | 'presentation_zone';
  name: string;
  availabilityPercent: number;
  nextAvailableSlot: string;
};

export type WholesaleRegionalHeatmapV1 = {
  region: string;
  interestScore: number; // 0-100
  projectedUnits: number;
  growthRate: number; // percentage
};

export type B2BReorderSuggestionV1 = {
  sku: string;
  suggestedQty: number;
  confidenceScore: number; // 0-100
  reason:
    | 'Low Stock in Central Hub'
    | 'High Velocity in Region'
    | 'Capsule Completion'
    | 'Trend Spike';
};

export type ShowroomSampleStatusV1 = {
  id: string;
  sku: string;
  currentZone: string;
  lastScannedBy: string;
  status: 'available' | 'with_buyer' | 'maintenance' | 'transit';
};

/** Демо-подсказка для PDP; в проде — CMS / юр. блок. */
export type ReturnPolicyHint = {
  summary: string;
  daysHint: number | null;
  restrictions: string[];
};

export type ColorwayRollupRow = {
  displayColor: string;
  skuCount: number;
  categorySample: string;
  seasonSample: string;
};

export type TradeCodeRow = {
  sku: string;
  slug: string;
  name: string;
  hsCode: string;
  eacMark: string;
  origin: string;
  completeness: 'full' | 'partial' | 'empty';
};
