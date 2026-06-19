import type { Page } from '@playwright/test';

/** Canonical shop-co-tracking-* with legacy shop-op-tracking-* fallback. */
export function shopTrackingTestId(page: Page, part: string) {
  return page
    .getByTestId(`shop-co-tracking-${part}`)
    .or(page.getByTestId(`shop-op-tracking-${part}`));
}

export function shopTrackingRow(page: Page, orderId: string) {
  return page
    .getByTestId(`shop-co-tracking-row-${orderId}`)
    .or(page.getByTestId(`shop-op-tracking-row-${orderId}`))
    .or(page.getByTestId(`platform-core-tracking-${orderId}`));
}
