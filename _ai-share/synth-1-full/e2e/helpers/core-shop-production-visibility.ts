import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

export const W2_BRAND_WRITE_HEADERS = {
  'content-type': 'application/json',
  'x-w2-actor-label': 'e2e-policy',
  'x-w2-actor-id': 'brand-001',
  'x-w2-actor-roles': 'production:edit',
  'x-w2-organization-id': 'org-brand-001',
};

export type ShopProductionVisibilityLevel = 'none' | 'milestones' | 'logistics' | 'full';

export async function patchCollectionShopProductionVisibility(
  request: APIRequestContext,
  collectionId: string,
  visibility: ShopProductionVisibilityLevel
): Promise<void> {
  const res = await request.patch(
    `/api/workshop2/collections/${encodeURIComponent(collectionId)}/shop-production-visibility`,
    {
      headers: W2_BRAND_WRITE_HEADERS,
      data: { visibility },
    }
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean; visibility?: string };
  expect(json.ok).toBe(true);
  expect(json.visibility).toBe(visibility);
}

export async function patchOrderShopProductionVisibility(
  request: APIRequestContext,
  orderId: string,
  visibility: ShopProductionVisibilityLevel | null
): Promise<void> {
  const res = await request.patch(
    `/api/workshop2/b2b/orders/${encodeURIComponent(orderId)}/shop-production-visibility`,
    {
      headers: W2_BRAND_WRITE_HEADERS,
      data: visibility == null ? { clear: true } : { visibility },
    }
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean; visibility?: string; orderOverride?: string | null };
  expect(json.ok).toBe(true);
  if (visibility == null) {
    expect(json.orderOverride ?? null).toBeNull();
  } else {
    expect(json.orderOverride).toBe(visibility);
  }
}
