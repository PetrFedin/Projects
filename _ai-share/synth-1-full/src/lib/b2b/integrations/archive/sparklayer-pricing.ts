/**
 * SparkLayer B2B Pricing API (TypeScript).
 * Docs: https://docs.sparklayer.io/tech-docs/pricing-api
 * - Get Pricing by SKU, Calculate Pricing, Manage Price Lists. OAuth2, REST.
 * - Frontend: https://docs.sparklayer.io/tech-docs/javascript-sdk, GraphQL для продвинутых сценариев.
 * Use when SPARKLAYER_API_URL + SPARKLAYER_ACCESS_TOKEN; otherwise platform mocks.
 */

export interface SparkLayerPriceList {
  slug: string;
  name: string;
  currency?: string;
  [key: string]: unknown;
}

export interface SparkLayerPriceTier {
  minQuantity: number;
  price: number;
  currency?: string;
}

export interface SparkLayerSkuPricing {
  sku: string;
  priceListSlug: string;
  price: number;
  tiers?: SparkLayerPriceTier[];
  currency?: string;
}

export interface SparkLayerCalculateRequest {
  skus: Array<{ sku: string; quantity: number }>;
  priceListSlug: string;
}

export interface SparkLayerCalculateResponse {
  total: number;
  lines: Array<{ sku: string; quantity: number; unitPrice: number; lineTotal: number }>;
  currency?: string;
}

/** Проверка: настроена ли интеграция SparkLayer (Pro/Enterprise). */
export function isSparkLayerConfigured(): boolean {
  if (typeof process === 'undefined') return false;
  return !!(process.env.NEXT_PUBLIC_SPARKLAYER_API_URL || process.env.SPARKLAYER_API_URL);
}

/** Получить цену по SKU и прайс-листу (SparkLayer: Get Pricing by SKU). Мок при отсутствии API. */
export async function sparkLayerGetPricingBySku(
  sku: string,
  priceListSlug: string
): Promise<SparkLayerSkuPricing | null> {
  if (!isSparkLayerConfigured()) {
    return {
      sku,
      priceListSlug,
      price: 0,
      currency: 'EUR',
      tiers: [{ minQuantity: 1, price: 0 }],
    };
  }
  const base = process.env.NEXT_PUBLIC_SPARKLAYER_API_URL || process.env.SPARKLAYER_API_URL;
  const url = `${base}/pricing/sku/${encodeURIComponent(sku)}?priceList=${encodeURIComponent(priceListSlug)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.SPARKLAYER_ACCESS_TOKEN || ''}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as SparkLayerSkuPricing;
}

/** Рассчитать сумму по SKU и количеству (SparkLayer: Calculate Pricing). Мок при отсутствии API. */
export async function sparkLayerCalculatePricing(
  request: SparkLayerCalculateRequest
): Promise<SparkLayerCalculateResponse> {
  if (!isSparkLayerConfigured()) {
    const lines = request.skus.map(({ sku, quantity }) => ({
      sku,
      quantity,
      unitPrice: 0,
      lineTotal: 0,
    }));
    return { total: 0, lines, currency: 'EUR' };
  }
  const base = process.env.NEXT_PUBLIC_SPARKLAYER_API_URL || process.env.SPARKLAYER_API_URL;
  const res = await fetch(`${base}/pricing/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SPARKLAYER_ACCESS_TOKEN || ''}`,
    },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`SparkLayer calculate: ${res.status}`);
  return (await res.json()) as SparkLayerCalculateResponse;
}

/** Список прайс-листов (SparkLayer). Мок при отсутствии API. */
export async function sparkLayerGetPriceLists(): Promise<SparkLayerPriceList[]> {
  if (!isSparkLayerConfigured()) {
    return [
      { slug: 'wholesale', name: 'Wholesale', currency: 'EUR' },
      { slug: 'retail', name: 'Retail', currency: 'EUR' },
    ];
  }
  const base = process.env.NEXT_PUBLIC_SPARKLAYER_API_URL || process.env.SPARKLAYER_API_URL;
  const res = await fetch(`${base}/price-lists`, {
    headers: { Authorization: `Bearer ${process.env.SPARKLAYER_ACCESS_TOKEN || ''}` },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as SparkLayerPriceList[] | { items?: SparkLayerPriceList[] };
  return Array.isArray(data) ? data : data.items ?? [];
}
