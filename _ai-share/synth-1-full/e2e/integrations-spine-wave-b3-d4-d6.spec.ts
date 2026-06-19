import { test, expect } from '@playwright/test';
import { PLATFORM_CORE_DEMO } from '../src/lib/platform-core-demo-context';

test.describe('Integrations spine Wave B3/D4/D6', () => {
  test('PXM media → published-articles · Zedonk enrich · confirm → allocation', async ({
    request,
  }) => {
    const mediaRes = await request.post('/api/integrations/v1/centric/media/import', {
      data: {
        styleId: `CENTRIC-PXM-${PLATFORM_CORE_DEMO.demoArticleId}`,
        collectionId: PLATFORM_CORE_DEMO.collectionId,
        articleId: PLATFORM_CORE_DEMO.demoArticleId,
      },
    });
    expect(mediaRes.ok()).toBe(true);

    const pubRes = await request.get(
      `/api/workshop2/collections/${encodeURIComponent(PLATFORM_CORE_DEMO.collectionId)}/published-articles`
    );
    expect(pubRes.ok()).toBe(true);
    const pub = (await pubRes.json()) as {
      articles?: Array<{ articleId?: string; pxmSource?: boolean; heroImageUrl?: string }>;
    };
    const hit = pub.articles?.find((a) => a.articleId === PLATFORM_CORE_DEMO.demoArticleId);
    if (hit) {
      expect(hit.pxmSource).toBe(true);
      expect(hit.heroImageUrl).toContain('http');
    }

    const zStyle = await request.post('/api/integrations/v1/zedonk/styles/import', {
      data: {
        styleId: `ZEDONK-${PLATFORM_CORE_DEMO.demoArticleId}`,
        collectionId: PLATFORM_CORE_DEMO.collectionId,
        articleId: PLATFORM_CORE_DEMO.demoArticleId,
      },
    });
    expect(zStyle.ok()).toBe(true);

    const enrich = await request.get(
      `/api/integrations/v1/zedonk/enrich?collectionId=${encodeURIComponent(PLATFORM_CORE_DEMO.collectionId)}&articleId=${encodeURIComponent(PLATFORM_CORE_DEMO.demoArticleId)}`
    );
    expect(enrich.ok()).toBe(true);
    const enrichBody = (await enrich.json()) as { data?: { hintRu?: string } };
    expect(enrichBody.data?.hintRu).toMatch(/Zedonk/);

    const aimsInv = await request.get('/api/integrations/v1/aims360/inventory');
    expect(aimsInv.ok()).toBe(true);
    const inv = (await aimsInv.json()) as {
      data?: { items?: Array<{ openToSell?: number }> };
    };
    expect(inv.data?.items?.[0]?.openToSell).toBeGreaterThan(0);

    const extId = `wave-b3d6-joor-${Date.now()}`;
    const importRes = await request.post('/api/integrations/v1/joor/orders/import', {
      data: {
        externalOrderId: extId,
        id: extId,
        status: 'pending',
        customer_name: 'Alloc Shop',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 8, unit_price: 42000 }],
      },
    });
    expect(importRes.ok()).toBe(true);
    const wholesaleOrderId = (
      (await importRes.json()) as { data?: { results?: Array<{ wholesaleOrderId: string }> } }
    ).data?.results?.[0]?.wholesaleOrderId;
    expect(wholesaleOrderId).toMatch(/^INT-/);

    await request.post(`/api/brand/b2b/orders/${encodeURIComponent(wholesaleOrderId!)}/confirm-order`, {
      data: {},
    });

    const allocGet = await request.get(
      `/api/integrations/v1/allocation/${encodeURIComponent(wholesaleOrderId!)}`
    );
    expect(allocGet.ok()).toBe(true);
    const allocBody = (await allocGet.json()) as {
      data?: { allocation?: { status?: string; lines?: unknown[] } };
    };
    expect(allocBody.data?.allocation?.status).toBe('queued');
    expect(allocBody.data?.allocation?.lines?.length).toBeGreaterThan(0);

    const syncAlloc = await request.post('/api/integrations/v1/aims360/allocation/sync', {
      data: { wholesaleOrderId },
    });
    expect(syncAlloc.ok()).toBe(true);
    const synced = (await syncAlloc.json()) as {
      data?: { allocation?: { status?: string } };
    };
    expect(['allocated', 'partial', 'in_progress']).toContain(synced.data?.allocation?.status);

    const queue = await request.get('/api/integrations/v1/allocation/queue?limit=5');
    expect(queue.ok()).toBe(true);
  });
});
