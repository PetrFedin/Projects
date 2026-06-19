import { expect, type APIRequestContext, type Page } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Matrix → checkout → PG order id (B2B-\\d+, not B2B-DEMO-*). */
export async function checkoutPgOrderViaMatrix(
  page: Page,
  options?: { collectionId?: string; articleId?: string; qty?: string; size?: string }
): Promise<string> {
  const collectionId = options?.collectionId ?? 'SS27';
  const articleId = options?.articleId ?? 'demo-ss27-01';
  const qty = options?.qty ?? '12';
  const size = options?.size ?? 'M';

  const publishedArticles = page.waitForResponse(
    (r) =>
      r.url().includes(`/api/workshop2/collections/${collectionId}/published-articles`) && r.ok(),
    { timeout: 60_000 }
  );
  const res = await page.goto(`/shop/b2b/matrix?collection=${collectionId}`, GOTO);
  expect(res?.status() ?? 599).toBeLessThan(500);
  await publishedArticles;
  await expect(
    page.getByTestId('shop-co-matrix-shell').or(page.getByTestId('shop-b2b-matrix-shell'))
  ).toBeVisible({ timeout: 30_000 });

  await page
    .getByTestId(`shop-co-matrix-qty-${articleId}-${size}`)
    .or(page.getByTestId(`shop-b2b-matrix-qty-${articleId}-${size}`))
    .fill(qty);
  await expect(
    page.getByTestId('shop-co-matrix-to-checkout').or(page.getByTestId('shop-b2b-matrix-to-checkout'))
  ).toBeEnabled({ timeout: 15_000 });

  const cartUpsert = page.waitForResponse(
    (r) =>
      r.url().includes('/api/shop/b2b/cart/lines') &&
      r.request().method() === 'POST' &&
      (r.request().postData() ?? '').includes('"action":"upsert"'),
    { timeout: 60_000 }
  );
  await page
    .getByTestId('shop-co-matrix-to-checkout')
    .or(page.getByTestId('shop-b2b-matrix-to-checkout'))
    .click();
  const upsertRes = await cartUpsert;
  expect(upsertRes.ok()).toBeTruthy();
  await expect(page).toHaveURL(/\/shop\/b2b\/checkout/, { timeout: 30_000 });

  const checkoutApi = page.waitForResponse(
    (r) => {
      if (!r.url().includes('/api/shop/b2b/cart/lines') || r.request().method() !== 'POST') {
        return false;
      }
      return (r.request().postData() ?? '').includes('"action":"checkout"');
    },
    { timeout: 60_000 }
  );
  await page
    .getByTestId('shop-co-checkout-confirm')
    .or(page.getByTestId('shop-b2b-checkout-confirm'))
    .click();
  const checkoutRes = await checkoutApi;
  const checkoutJson = (await checkoutRes.json()) as {
    ok?: boolean;
    order?: { id?: string; status?: string };
    messageRu?: string;
  };
  expect(checkoutJson.ok).toBe(true);
  const orderId = checkoutJson.order?.id ?? '';
  expect(orderId).toMatch(/^B2B-\d+$/);
  expect(orderId).not.toMatch(/B2B-DEMO/);
  expect(checkoutJson.order?.status).toBe('submitted');
  return orderId;
}

export const PG_CHAIN_STEP_IDS = [
  'shop_sent',
  'brand_confirmed',
  'inventory_reserved',
  'production_po',
  'materials_supplied',
] as const;

export async function confirmPgOrderViaApi(
  request: APIRequestContext,
  orderId: string
): Promise<void> {
  const res = await request.post(
    `/api/brand/b2b/orders/${encodeURIComponent(orderId)}/confirm-order`,
    { data: {} }
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean; status?: string };
  expect(json.ok).toBe(true);
  expect(json.status === 'confirmed' || json.status === undefined).toBeTruthy();
}

export async function fetchPgContextualMessages(
  request: APIRequestContext,
  orderId: string
): Promise<Array<{ id: string; message: string; sender: string }>> {
  const res = await request.get(
    `/api/messages/contextual?contextType=b2b_order&contextId=${encodeURIComponent(orderId)}`
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { messages?: Array<{ id: string; message: string; sender: string }> };
  return json.messages ?? [];
}

export async function ensurePgContextualThreadViaApi(
  request: APIRequestContext,
  orderId: string,
  body?: { pillarId?: string; sectionId?: string; source?: 'api' | 'registry' }
): Promise<{ created: boolean; messageCount: number }> {
  const res = await request.post('/api/messages/contextual/ensure-b2b-order', {
    data: { orderId, source: body?.source ?? 'api', ...body },
  });
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { created?: boolean; messageCount?: number };
  return { created: json.created === true, messageCount: json.messageCount ?? 0 };
}

export async function handoffPgOrderViaApi(
  request: APIRequestContext,
  orderId: string
): Promise<string> {
  const res = await request.post(
    `/api/brand/b2b/orders/${encodeURIComponent(orderId)}/confirm-production-handoff`,
    { data: {} }
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean; productionOrderId?: string };
  expect(json.ok).toBe(true);
  const poId = json.productionOrderId ?? '';
  expect(poId).toMatch(/^PO-B2B-/);
  await waitForHandoffQueueOrder(request, orderId);
  return poId;
}

export async function waitForHandoffQueueOrder(
  request: APIRequestContext,
  orderId: string,
  factoryId = 'fact-1'
): Promise<void> {
  await expect
    .poll(
      async () => {
        const res = await request.get(
          `/api/workshop2/factory/production-handoff-queue?factoryId=${encodeURIComponent(factoryId)}`
        );
        if (!res.ok()) return false;
        const json = (await res.json()) as { items?: Array<{ b2bOrderId?: string }> };
        return (json.items ?? []).some((i) => i.b2bOrderId?.trim() === orderId);
      },
      { timeout: 30_000 }
    )
    .toBe(true);
}

export type HandoffQueueItem = {
  productionOrderId: string;
  collectionId: string;
  articleId: string;
  status: string;
  erpExternalId?: string;
};

export async function fetchHandoffQueueItemForOrder(
  request: APIRequestContext,
  orderId: string,
  factoryId = 'fact-1'
): Promise<HandoffQueueItem> {
  const res = await request.get(
    `/api/workshop2/factory/production-handoff-queue?factoryId=${encodeURIComponent(factoryId)}`
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as {
    items?: Array<{
      b2bOrderId?: string;
      productionOrderId?: string;
      collectionId?: string;
      articleId?: string;
      status?: string;
      erpExternalId?: string;
    }>;
  };
  const item = (json.items ?? []).find((i) => i.b2bOrderId?.trim() === orderId);
  expect(item).toBeTruthy();
  return {
    productionOrderId: item!.productionOrderId ?? '',
    collectionId: item!.collectionId ?? '',
    articleId: item!.articleId ?? '',
    status: item!.status ?? '',
    erpExternalId: item!.erpExternalId,
  };
}

/** Factory bulk ack для clean PG order (pending_erp → synced / journal-only ERP). */
export async function bulkAckPgHandoffViaApi(
  request: APIRequestContext,
  orderId: string,
  factoryId = 'fact-1'
): Promise<{ productionOrderId: string }> {
  const item = await fetchHandoffQueueItemForOrder(request, orderId, factoryId);
  expect(item.productionOrderId).toMatch(/^PO-B2B-/);
  expect(item.status).toBe('pending_erp');
  const res = await request.post(
    '/api/workshop2/factory/production-handoff-queue/bulk-acknowledge',
    {
      data: {
        factoryId,
        items: [
          {
            productionOrderId: item.productionOrderId,
            collectionId: item.collectionId,
            articleId: item.articleId,
          },
        ],
      },
    }
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { acknowledged?: string[] };
  expect(json.acknowledged ?? []).toContain(item.productionOrderId);
  return { productionOrderId: item.productionOrderId };
}

export async function waitForChainOverviewPgOrder(
  request: APIRequestContext,
  orderId: string,
  collectionId = 'SS27'
): Promise<void> {
  await expect
    .poll(
      async () => {
        const res = await request.get(
          `/api/workshop2/platform-core/chain-overview?collectionId=${encodeURIComponent(collectionId)}`
        );
        if (!res.ok()) return '';
        const json = (await res.json()) as { demoOrderId?: string };
        return json.demoOrderId?.trim() ?? '';
      },
      { timeout: 30_000 }
    )
    .toBe(orderId);
}

export async function fetchPgChainStatus(
  request: APIRequestContext,
  orderId: string
): Promise<{
  status?: string;
  handedOff?: boolean;
  productionOrderId?: string;
  inventoryReserved?: boolean;
  steps?: Array<{ id: string; done: boolean }>;
}> {
  const res = await request.get(`/api/workshop2/b2b/orders/${encodeURIComponent(orderId)}/chain-status`);
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as {
    ok?: boolean;
    chain?: {
      status?: string;
      handedOff?: boolean;
      productionOrderId?: string;
      inventoryReserved?: boolean;
      steps?: Array<{ id: string; done: boolean }>;
    };
  };
  expect(json.ok).toBe(true);
  return json.chain ?? {};
}

export async function bulkConfirmPgMaterialsViaApi(
  request: APIRequestContext,
  orderId: string,
  productionOrderId?: string
): Promise<void> {
  const res = await request.post('/api/workshop2/supplier/material-request/bulk-confirm', {
    data: {
      b2bOrderId: orderId,
      productionOrderId,
      confirmAllArticles: true,
    },
  });
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean; confirmed?: number };
  expect(json.ok).toBe(true);
  expect((json.confirmed ?? 0) >= 0).toBe(true);
}

export async function assertW2RegistryResolvesOrder(
  request: APIRequestContext,
  orderId: string,
  collectionId = 'SS27'
): Promise<void> {
  const shopRes = await request.get(
    `/api/shop/b2b/orders?buyerId=shop1&collectionId=${encodeURIComponent(collectionId)}`
  );
  expect(shopRes.ok()).toBeTruthy();
  const shopJson = (await shopRes.json()) as { ok?: boolean; orders?: Array<{ id?: string }> };
  expect(shopJson.ok).toBe(true);
  expect(shopJson.orders?.[0]?.id).toBe(orderId);

  const brandRes = await request.get(
    `/api/brand/b2b/orders?collectionId=${encodeURIComponent(collectionId)}`
  );
  expect(brandRes.ok()).toBeTruthy();
  const brandJson = (await brandRes.json()) as { ok?: boolean; orders?: Array<{ id?: string }> };
  expect(brandJson.ok).toBe(true);
  expect(brandJson.orders?.some((o) => o.id === orderId)).toBe(true);

  const chainRes = await request.get(`/api/workshop2/b2b/orders/${orderId}/chain-status`);
  expect(chainRes.ok()).toBeTruthy();
  const chainJson = (await chainRes.json()) as { ok?: boolean; chain?: { status?: string } };
  expect(chainJson.ok).toBe(true);
  expect(chainJson.chain?.status).toBeTruthy();
}

export async function postPgSectionReadState(
  request: APIRequestContext,
  input: {
    orderId: string;
    pillarId: string;
    sectionId: string;
    readerId: string;
  }
): Promise<void> {
  const res = await request.post('/api/messages/contextual/section-read-state', {
    data: input,
  });
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean };
  expect(json.ok).toBe(true);
}

export async function fetchPgSectionReadKeys(
  request: APIRequestContext,
  orderId: string,
  readerId: string
): Promise<string[]> {
  const res = await request.get(
    `/api/messages/contextual/section-read-state?orderId=${encodeURIComponent(orderId)}&readerId=${encodeURIComponent(readerId)}`
  );
  expect(res.ok()).toBeTruthy();
  const json = (await res.json()) as { ok?: boolean; keys?: string[] };
  expect(json.ok).toBe(true);
  return json.keys ?? [];
}

export async function assertCleanPgCommsSectionGroupLink(
  page: Page,
  input: {
    hubPath: string;
    pickerTestId: string;
    groupTestId: string;
    orderId: string;
    expectedSection: string;
    expectedPillar: string;
  }
): Promise<void> {
  const res = await page.goto(input.hubPath, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  expect(res?.status() ?? 599).toBeLessThan(500);
  await expect(page.getByTestId('comms-pillar-card')).toBeVisible({ timeout: 60_000 });
  await expect(page.getByTestId(input.pickerTestId)).toBeVisible({ timeout: 30_000 });

  const group = page.getByTestId(input.groupTestId);
  await expect(group).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(
      async () => {
        const href = await group.getAttribute('href');
        if (!href) return false;
        return new RegExp(input.orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(href);
      },
      { timeout: 30_000 }
    )
    .toBe(true);
  const href = await group.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).not.toMatch(/B2B-DEMO/);
  expect(href).toMatch(new RegExp(`section=${input.expectedSection}`));
  expect(href).toMatch(new RegExp(`pillar=${input.expectedPillar}`));

  await group.click();
  await expect(page).toHaveURL(/\/messages/, { timeout: 60_000 });
  await expect(page).toHaveURL(new RegExp(`section=${input.expectedSection}`), { timeout: 30_000 });
  expect(page.url()).toMatch(new RegExp(input.orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  expect(page.url()).not.toMatch(/B2B-DEMO/);
}

export function supplierProcurementHrefForPgOrder(
  orderId: string,
  opts?: { collectionId?: string; articleId?: string; poId?: string }
): string {
  const collectionId = opts?.collectionId ?? 'SS27';
  const articleId = opts?.articleId ?? 'demo-ss27-01';
  const poId = opts?.poId ?? `PO-B2B-${orderId}`;
  const sp = new URLSearchParams({
    collection: collectionId,
    article: articleId,
    view: 'procurement',
    po: poId,
    order: orderId,
    orderId,
    role: 'supplier',
  });
  return `/factory/production/materials?${sp.toString()}`;
}

export function orderSectionCommsMessagesHref(input: {
  roleId: 'brand' | 'shop' | 'manufacturer' | 'supplier';
  orderId: string;
  sectionId: string;
  collectionId?: string;
  pillarId?: string;
}): string {
  const collectionId = input.collectionId ?? 'SS27';
  const pillarId = input.pillarId ?? 'order_production';
  const orderId = input.orderId.trim();
  const base =
    input.roleId === 'brand'
      ? `/brand/messages?order=${encodeURIComponent(orderId)}&orderId=${encodeURIComponent(orderId)}&contextType=b2b_order`
      : input.roleId === 'shop'
        ? `/shop/messages?order=${encodeURIComponent(orderId)}&orderId=${encodeURIComponent(orderId)}&contextType=b2b_order`
        : input.roleId === 'supplier'
          ? `/factory/supplier/messages?order=${encodeURIComponent(orderId)}&orderId=${encodeURIComponent(orderId)}&contextType=b2b_order`
          : `/factory/production/messages?order=${encodeURIComponent(orderId)}&orderId=${encodeURIComponent(orderId)}&contextType=b2b_order&role=manufacturer`;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}collection=${encodeURIComponent(collectionId)}&section=${encodeURIComponent(input.sectionId)}&pillar=${encodeURIComponent(pillarId)}`;
}

export async function assertOrderSectionCommsAutoThread(
  page: Page,
  options: {
    chatTestId?: string;
    href?: string;
    expectedSectionId: string;
    expectedPillar?: string;
    orderId: string;
  }
): Promise<void> {
  const href =
    options.href ??
    (await page.getByTestId(options.chatTestId!).getAttribute('href'));
  expect(href).toBeTruthy();
  expect(href).toContain(`section=${options.expectedSectionId}`);
  if (options.expectedPillar) {
    expect(href).toContain(`pillar=${options.expectedPillar}`);
  }
  expect(href).toContain(options.orderId);

  const messagesRes = await page.goto(href!, GOTO);
  expect(messagesRes?.status() ?? 599).toBeLessThan(500);
  await expect(page.getByTestId('comms-section-context-auto-thread')).toBeVisible({
    timeout: 60_000,
  });
  await expect(page.getByTestId('comms-section-context-auto-thread')).toHaveAttribute(
    'data-section-id',
    options.expectedSectionId
  );
}
