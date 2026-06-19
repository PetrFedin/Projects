/**
 * Production forecast lines from W2 orders or INT-* operational detail (ADR-002).
 */
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';
import { b2bV1SynthaActorRoleHeaders } from '@/lib/auth/b2b-v1-api-client-headers';
import { parseOperationalOrderV1DetailResponse } from '@/lib/order/operational-order-dto.schema';
import { isIntegrationImportedWholesaleOrderId } from './integration-ui-utils';

/** Map imported line productId → dossier articleId (best-effort). */
export function resolveArticleIdFromProductId(productId: string): string {
  const id = productId.trim();
  if (!id) return '';
  const demo = id.match(/demo-[a-z0-9-]+/i);
  if (demo) return demo[0].toLowerCase();
  const parts = id.split('-');
  if (parts.length >= 3 && /^[a-z]{2}\d{2}$/i.test(parts[0]!)) {
    return parts.slice(1).join('-').toLowerCase();
  }
  return id.toLowerCase();
}

/** Коллекция из SKU строки импорта (SS27-M-COAT-01 → SS27). */
export function resolveSpineCollectionIdFromLines(
  lineItems: Array<{ productId?: string; sku?: string }>,
  fallback: string
): string {
  for (const line of lineItems) {
    const sku = String(line.productId ?? line.sku ?? '').trim();
    const m = sku.match(/^([A-Za-z]{2}\d{2})-/);
    if (m?.[1]) return m[1].toUpperCase();
  }
  return fallback.trim() || fallback;
}

export type ProductionForecastLine = { articleId: string; qty: number };

export function mapOperationalItemsToForecastLines(
  items: B2BOrderLineItem[]
): ProductionForecastLine[] {
  const byArticle = new Map<string, number>();
  for (const item of items) {
    const articleId = resolveArticleIdFromProductId(String(item.productId ?? ''));
    if (!articleId) continue;
    byArticle.set(articleId, (byArticle.get(articleId) ?? 0) + (item.quantity ?? 0));
  }
  return [...byArticle.entries()].map(([articleId, qty]) => ({ articleId, qty }));
}

/** INT-* wholesale order detail via operational v1 (supplier / manufacturer surfaces). */
export async function fetchSpineOperationalOrderDetail(
  wholesaleOrderId: string
): Promise<{ status: string; lines: ProductionForecastLine[] } | null> {
  if (!isIntegrationImportedWholesaleOrderId(wholesaleOrderId)) return null;
  const res = await fetch(
    `/api/b2b/v1/operational-orders/${encodeURIComponent(wholesaleOrderId)}`,
    {
      headers: { ...b2bV1SynthaActorRoleHeaders('brand') },
      cache: 'no-store',
    }
  );
  const parsed = parseOperationalOrderV1DetailResponse(await res.json());
  if (!parsed.success) return null;
  const order = parsed.data.data.order;
  return {
    status: order.status,
    lines: mapOperationalItemsToForecastLines(order.items ?? []),
  };
}

/** @deprecated use fetchSpineOperationalOrderDetail */
export async function fetchSpineOperationalForecastLines(
  wholesaleOrderId: string
): Promise<{ status: string; lines: ProductionForecastLine[] } | null> {
  const detail = await fetchSpineOperationalOrderDetail(wholesaleOrderId);
  if (!detail?.lines.length) return null;
  return detail;
}
