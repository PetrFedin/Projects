/** URL и focus-хелперы для реестров B2B (brand/shop · столп order_production). */

import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { isPlatformCorePgCheckoutOrderId } from '@/lib/platform-core-spine-active-order-fallback';

export type B2bRegistryProductionFilter = 'awaiting_handoff' | 'in_production';

function platformCoreGoldenOrderId(id: string, focusOrderId?: string | null): boolean {
  if (id.startsWith('B2B-DEMO-')) return true;
  if (isPlatformCorePgCheckoutOrderId(id)) return true;
  if (focusOrderId && id === focusOrderId) return true;
  return false;
}

/** Platform Core: только golden B2B-DEMO (+ deep-link focus), без INT-JOOR overlay в poll/SSE. */
export function filterPlatformCoreShopOrderRows<T extends { order?: string; orderId?: string }>(
  rows: T[],
  focusOrderId?: string | null
): T[] {
  if (!isPlatformCoreMode()) return rows;
  return rows.filter((r) => platformCoreGoldenOrderId(r.orderId ?? r.order ?? '', focusOrderId));
}

export function filterPlatformCoreBrandOrderRows<T extends { order: string }>(
  rows: T[],
  focusOrderId?: string | null
): T[] {
  if (!isPlatformCoreMode()) return rows;
  return rows.filter((r) => platformCoreGoldenOrderId(r.order, focusOrderId));
}

export function resolveB2bRegistryFocusOrderId(
  searchParams: URLSearchParams | null | { get: (key: string) => string | null }
): string | null {
  const raw = searchParams?.get('order')?.trim() || searchParams?.get('orderId')?.trim() || '';
  return raw || null;
}

export function pickB2bRegistryProductionFilter(input: {
  awaitingHandoff: boolean;
  inProduction: boolean;
}): B2bRegistryProductionFilter | null {
  if (input.awaitingHandoff) return 'awaiting_handoff';
  if (input.inProduction) return 'in_production';
  return null;
}
