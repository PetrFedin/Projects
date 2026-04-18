import type { Product } from '@/lib/types';
import type { MarginSimulationV1 } from './types';

/** Расчет маржинальности и прибыльности SKU (Инструмент мерчанта). */
export function simulateMargin(
  product: Product,
  overrides?: Partial<MarginSimulationV1>
): MarginSimulationV1 {
  const retailPrice = overrides?.retailPrice ?? product.price;
  const productionCost =
    overrides?.productionCost ?? (product.productionCost || Math.round(retailPrice * 0.25));
  const logisticsCost = overrides?.logisticsCost ?? Math.round(retailPrice * 0.08);
  const marketingCost = overrides?.marketingCost ?? Math.round(retailPrice * 0.12);
  const vatPct = overrides?.vatPct ?? 20;

  const vatAmount = Math.round((retailPrice * vatPct) / (100 + vatPct));
  const netRevenue = retailPrice - vatAmount;
  const totalCost = productionCost + logisticsCost + marketingCost;
  const netProfit = netRevenue - totalCost;
  const netMarginPct = Math.round((netProfit / retailPrice) * 100);
  const markup = Math.round((retailPrice / productionCost) * 100) / 100;

  return {
    sku: product.sku,
    productionCost,
    logisticsCost,
    marketingCost,
    retailPrice,
    vatPct,
    markup,
    netMarginPct,
    netProfit,
  };
}
