import type { MarketplaceFilters } from "../../types/filters";

export function chipsFromFilters(f: MarketplaceFilters, labels: Record<string, string>) {
  const chips: Array<{ key: string; label: string; value: string }> = [];

  const add = (key: keyof MarketplaceFilters, value: string) => {
    if (!value) return;
    chips.push({ key: key as string, label: labels[key as string] ?? (key as string), value });
  };

  const arrayKeys: Array<keyof MarketplaceFilters> = [
    "brandIds","retailerIds","supplierIds","marketplaceIds","countryOfOrigin",
    "gender","categories","subcategories","material","color","sizeCurve","season","collection",
    "productStatus","lifecycle","productionStage","compliance","sustainability"
  ];
  for (const k of arrayKeys) {
    const v = f[k] as any[];
    if (v?.length) add(k, v.length <= 2 ? v.join(", ") : `${v.length} selected`);
  }

  add("q", f.q);
  add("currency", f.currency);

  if (f.inStockOnly) add("inStockOnly", "Yes");
  if (f.lowStock) add("lowStock", "Yes");
  if (f.slowMover) add("slowMover", "Yes");
  if (f.highReturnRisk) add("highReturnRisk", "Yes");

  const range = (min?: number, max?: number) => (min != null || max != null ? `${min ?? "—"} … ${max ?? "—"}` : "");
  add("wholesaleMin", range(f.wholesaleMin, f.wholesaleMax));
  add("retailMin", range(f.retailMin, f.retailMax));
  add("discountMin", range(f.discountMin, f.discountMax));
  add("stockMin", range(f.stockMin, f.stockMax));
  add("ordersMin", range(f.ordersMin, f.ordersMax));
  add("unitsSoldMin", range(f.unitsSoldMin, f.unitsSoldMax));
  add("revenueMin", range(f.revenueMin, f.revenueMax));
  add("gmMin", range(f.gmMin, f.gmMax));
  add("sellThroughMin", range(f.sellThroughMin, f.sellThroughMax));
  add("returnsRateMin", range(f.returnsRateMin, f.returnsRateMax));
  add("stockCoverMin", range(f.stockCoverMin, f.stockCoverMax));
  add("conversionMin", range(f.conversionMin, f.conversionMax));
  add("leadTimeMin", range(f.leadTimeMin, f.leadTimeMax));
  add("moqMin", range(f.moqMin, f.moqMax));

  const dateRange = (from?: string, to?: string) => (from || to ? `${from ?? "—"} … ${to ?? "—"}` : "");
  add("createdFrom", dateRange(f.createdFrom, f.createdTo));
  add("updatedFrom", dateRange(f.updatedFrom, f.updatedTo));
  add("deliveryFrom", dateRange(f.deliveryFrom, f.deliveryTo));

  if (f.hasImages) add("hasImages", "Yes");
  if (f.hasVideo) add("hasVideo", "Yes");
  if (f.has3d) add("has3d", "Yes");
  if (f.hasSizeGuide) add("hasSizeGuide", "Yes");
  if (f.hasCertificates) add("hasCertificates", "Yes");

  return chips;
}

