export type SortDir = 'asc' | 'desc' | '';

export type MarketplaceFilters = {
  // search
  q: string;

  // pagination & sorting (server-side)
  page: number; // 1-based
  pageSize: number;
  sortBy: string;
  sortDir: SortDir;

  // identity / catalog
  brandIds: string[]; // multi
  retailerIds: string[]; // multi (buyers)
  supplierIds: string[]; // multi (factories/vendors)
  marketplaceIds: string[]; // multi (channels)
  countryOfOrigin: string[]; // multi

  // product taxonomy
  gender: string[]; // multi: women/men/kids/unisex
  categories: string[]; // multi
  subcategories: string[]; // multi
  material: string[]; // multi
  color: string[]; // multi
  sizeCurve: string[]; // multi (S-XL, 36-46, etc)
  season: string[]; // multi (SS25, FW25…)
  collection: string[]; // multi
  productStatus: string[]; // multi: active/draft/archived
  lifecycle: string[]; // multi: new/core/carryover/markdown

  // pricing
  currency: string; // single
  wholesaleMin?: number;
  wholesaleMax?: number;
  retailMin?: number;
  retailMax?: number;
  discountMin?: number; // 0..100
  discountMax?: number;

  // inventory & availability
  stockMin?: number;
  stockMax?: number;
  inStockOnly: boolean;
  backorderAllowed?: boolean;

  // sales & performance (deep analytics)
  ordersMin?: number;
  ordersMax?: number;
  unitsSoldMin?: number;
  unitsSoldMax?: number;
  revenueMin?: number;
  revenueMax?: number;

  gmMin?: number; // gross margin %
  gmMax?: number;
  sellThroughMin?: number; // 0..100
  sellThroughMax?: number;
  returnsRateMin?: number; // 0..100
  returnsRateMax?: number;

  stockCoverMin?: number; // weeks
  stockCoverMax?: number;
  conversionMin?: number; // %
  conversionMax?: number;

  // logistics / production
  leadTimeMin?: number; // days
  leadTimeMax?: number;
  moqMin?: number;
  moqMax?: number;
  productionStage: string[]; // multi: sampling/production/qa/shipping
  compliance: string[]; // multi: bci/gots/oeko-tex/...
  sustainability: string[]; // multi tags

  // dates (ISO yyyy-mm-dd)
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  deliveryFrom?: string;
  deliveryTo?: string;

  // flags
  hasImages?: boolean;
  hasVideo?: boolean;
  has3d?: boolean;
  hasSizeGuide?: boolean;
  hasCertificates?: boolean;

  // quality / ops
  lowStock: boolean; // derived/quick filter
  slowMover: boolean; // derived/quick filter
  highReturnRisk: boolean; // derived/quick filter
};

export const DEFAULT_FILTERS: MarketplaceFilters = {
  q: '',
  page: 1,
  pageSize: 20,
  sortBy: '',
  sortDir: '',

  brandIds: [],
  retailerIds: [],
  supplierIds: [],
  marketplaceIds: [],
  countryOfOrigin: [],

  gender: [],
  categories: [],
  subcategories: [],
  material: [],
  color: [],
  sizeCurve: [],
  season: [],
  collection: [],
  productStatus: [],
  lifecycle: [],

  currency: 'RUB',
  inStockOnly: false,

  productionStage: [],
  compliance: [],
  sustainability: [],

  lowStock: false,
  slowMover: false,
  highReturnRisk: false,
};
