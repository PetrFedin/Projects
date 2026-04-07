import type { MarketplaceFilters } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";

export function normalizeFilters(input: Partial<MarketplaceFilters>): MarketplaceFilters {
  const f: any = { ...DEFAULT_FILTERS, ...input };

  // hard guards
  f.page = Math.max(1, Number(f.page || 1));
  f.pageSize = [10, 20, 30, 50].includes(Number(f.pageSize)) ? Number(f.pageSize) : 20;

  // numbers: undefined if NaN
  const numKeys = [
    "wholesaleMin","wholesaleMax","retailMin","retailMax","discountMin","discountMax",
    "stockMin","stockMax","ordersMin","ordersMax","unitsSoldMin","unitsSoldMax","revenueMin","revenueMax",
    "gmMin","gmMax","sellThroughMin","sellThroughMax","returnsRateMin","returnsRateMax",
    "stockCoverMin","stockCoverMax","conversionMin","conversionMax","leadTimeMin","leadTimeMax","moqMin","moqMax"
  ] as const;

  for (const k of numKeys) {
    const v = f[k];
    if (v === "" || v === null || v === undefined) f[k] = undefined;
    else {
      const n = Number(v);
      f[k] = Number.isFinite(n) ? n : undefined;
    }
  }

  // arrays ensure
  const arrayKeys = [
    "brandIds","retailerIds","supplierIds","marketplaceIds","countryOfOrigin",
    "gender","categories","subcategories","material","color","sizeCurve","season","collection",
    "productStatus","lifecycle","productionStage","compliance","sustainability"
  ] as const;

  for (const k of arrayKeys) {
    f[k] = Array.isArray(f[k]) ? f[k] : typeof f[k] === "string" && f[k] ? f[k].split(",") : [];
    f[k] = (f[k] as string[]).filter(Boolean);
  }

  // booleans
  const boolKeys = ["inStockOnly","lowStock","slowMover","highReturnRisk","hasImages","hasVideo","has3d","hasSizeGuide","hasCertificates"] as const;
  for (const k of boolKeys) f[k] = Boolean(f[k]);

  // dates simple sanitize (expect yyyy-mm-dd)
  const dateKeys = ["createdFrom","createdTo","updatedFrom","updatedTo","deliveryFrom","deliveryTo"] as const;
  for (const k of dateKeys) {
    if (f[k] && !/^\d{4}-\d{2}-\d{2}$/.test(f[k])) f[k] = undefined;
  }

  return f as MarketplaceFilters;
}

export function buildWhere(f: MarketplaceFilters) {
  return {
    q: f.q || undefined,
    brandIds: f.brandIds,
    retailerIds: f.retailerIds,
    supplierIds: f.supplierIds,
    marketplaceIds: f.marketplaceIds,
    countryOfOrigin: f.countryOfOrigin,
    gender: f.gender,
    categories: f.categories,
    subcategories: f.subcategories,
    material: f.material,
    color: f.color,
    sizeCurve: f.sizeCurve,
    season: f.season,
    collection: f.collection,
    productStatus: f.productStatus,
    lifecycle: f.lifecycle,
    currency: f.currency,

    ranges: {
      wholesale: [f.wholesaleMin, f.wholesaleMax],
      retail: [f.retailMin, f.retailMax],
      discount: [f.discountMin, f.discountMax],
      stock: [f.stockMin, f.stockMax],
      orders: [f.ordersMin, f.ordersMax],
      unitsSold: [f.unitsSoldMin, f.unitsSoldMax],
      revenue: [f.revenueMin, f.revenueMax],
      gm: [f.gmMin, f.gmMax],
      sellThrough: [f.sellThroughMin, f.sellThroughMax],
      returnsRate: [f.returnsRateMin, f.returnsRateMax],
      stockCover: [f.stockCoverMin, f.stockCoverMax],
      conversion: [f.conversionMin, f.conversionMax],
      leadTime: [f.leadTimeMin, f.leadTimeMax],
      moq: [f.moqMin, f.moqMax]
    },

    flags: {
      inStockOnly: f.inStockOnly,
      lowStock: f.lowStock,
      slowMover: f.slowMover,
      highReturnRisk: f.highReturnRisk,
      hasImages: f.hasImages,
      hasVideo: f.hasVideo,
      has3d: f.has3d,
      hasSizeGuide: f.hasSizeGuide,
      hasCertificates: f.hasCertificates
    },

    dates: {
      created: [f.createdFrom, f.createdTo],
      updated: [f.updatedFrom, f.updatedTo],
      delivery: [f.deliveryFrom, f.deliveryTo]
    },

    production: {
      stage: f.productionStage,
      compliance: f.compliance,
      sustainability: f.sustainability
    }
  };
}

