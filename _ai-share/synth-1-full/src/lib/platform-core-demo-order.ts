import { PLATFORM_CORE_DEMO_PRESETS } from '@/lib/platform-core-demo-context';

/** Snapshot JOOR operational ids (`mockB2BOrders`, `B2B-0012`) — не workshop2 PG. */
const LEGACY_OPERATIONAL_B2B_ORDER_RE = /^B2B-\d{4}$/;

export function isLegacyOperationalB2bOrderId(orderId: string): boolean {
  return LEGACY_OPERATIONAL_B2B_ORDER_RE.test(orderId.trim());
}

/**
 * B2B order id из PG registry (`workshop2_b2b_orders`) vs legacy JOOR snapshot.
 * Client-safe heuristic: demo presets, `B2B-DEMO-*`, прочие `B2B-*` кроме `B2B-00xx`.
 */
export function isPlatformCorePgB2bOrder(orderId: string): boolean {
  const id = orderId.trim();
  if (!id) return false;
  if (isLegacyOperationalB2bOrderId(id)) return false;
  if (id.startsWith('B2B-DEMO-')) return true;
  if (Object.values(PLATFORM_CORE_DEMO_PRESETS).some((p) => p.demoOrderId === id)) {
    return true;
  }
  if (id.startsWith('B2B-')) return true;
  return false;
}

/** Канон для comms/read-state/logistics — alias `isPlatformCorePgB2bOrder`. */
export function isPlatformCoreWholesaleOrderId(orderId: string): boolean {
  return isPlatformCorePgB2bOrder(orderId);
}

/** @deprecated alias — prefer `isPlatformCorePgB2bOrder` */
export function isPlatformCoreDemoB2bOrder(orderId: string): boolean {
  return isPlatformCorePgB2bOrder(orderId);
}

export function isPlatformCoreDemoB2bOrderId(orderId: string): boolean {
  return isPlatformCorePgB2bOrder(orderId);
}
