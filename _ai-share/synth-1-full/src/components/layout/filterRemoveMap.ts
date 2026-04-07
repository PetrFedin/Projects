import type { MarketplaceFilters } from "../../types/filters";

export const REMOVE_MAP: Record<string, Array<keyof MarketplaceFilters>> = {
  wholesaleMin: ["wholesaleMin", "wholesaleMax"],
  retailMin: ["retailMin", "retailMax"],
  discountMin: ["discountMin", "discountMax"],
  stockMin: ["stockMin", "stockMax"],
  ordersMin: ["ordersMin", "ordersMax"],
  unitsSoldMin: ["unitsSoldMin", "unitsSoldMax"],
  revenueMin: ["revenueMin", "revenueMax"],
  gmMin: ["gmMin", "gmMax"],
  sellThroughMin: ["sellThroughMin", "sellThroughMax"],
  returnsRateMin: ["returnsRateMin", "returnsRateMax"],
  stockCoverMin: ["stockCoverMin", "stockCoverMax"],
  conversionMin: ["conversionMin", "conversionMax"],
  leadTimeMin: ["leadTimeMin", "leadTimeMax"],
  moqMin: ["moqMin", "moqMax"],
  createdFrom: ["createdFrom", "createdTo"],
  updatedFrom: ["updatedFrom", "updatedTo"],
  deliveryFrom: ["deliveryFrom", "deliveryTo"]
};

export function removePatch(key: keyof MarketplaceFilters) {
  const keys = REMOVE_MAP[key as string] ?? [key];
  const patch: any = {};
  for (const k of keys) patch[k] = Array.isArray(({} as any)[k]) ? [] : "";
  return patch;
}

