/**
 * Canonical test ids для shop × collection_order (audit section shop-co-*).
 * Legacy shop-op-* — только data-audit-legacy, не primary data-testid.
 */

export function shopCoTrackingTestId(part: string): string {
  return `shop-co-tracking-${part}`;
}

export function shopCoDetailTestId(part: string): string {
  return `shop-co-detail-${part}`;
}

export function shopCoChainTestId(part: string): string {
  return `shop-co-chain-${part}`;
}

/** @deprecated data-audit-legacy only */
export function legacyShopOpTrackingTestId(part: string): string {
  return `shop-op-tracking-${part}`;
}

/** @deprecated data-audit-legacy only */
export function legacyShopOpOrderStatusTestId(part: string): string {
  return `shop-op-order-status-${part}`;
}
