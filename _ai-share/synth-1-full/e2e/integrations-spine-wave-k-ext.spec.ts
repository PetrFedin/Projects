import { test, expect } from '@playwright/test';
import { PLATFORM_CORE_DEMO } from '../src/lib/platform-core-demo-context';

/**
 * Wave K · pillar 2 sample_collection — Centric eligible → PXM → linesheet gen → shop ATS.
 */
test.describe('Integrations spine Wave K (sample_collection)', () => {
  test('Centric PXM → linesheet persist → shop inventory + eligible', async ({ request }) => {
    const { collectionId, demoArticleId } = PLATFORM_CORE_DEMO;

    const styleRes = await request.post('/api/integrations/v1/centric/styles/import', {
      data: {
        styleId: `CENTRIC-WK-${demoArticleId}`,
        articleId: demoArticleId,
        collectionId,
        lifecycleState: 'Approved',
      },
    });
    expect(styleRes.ok()).toBe(true);

    const gateRes = await request.get(
      `/api/integrations/v1/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(demoArticleId)}/eligible`
    );
    expect(gateRes.ok()).toBe(true);
    const gate = (await gateRes.json()) as { data?: { eligibleForCollection?: boolean } };
    expect(gate.data?.eligibleForCollection).toBe(true);

    const pxmRes = await request.post('/api/integrations/v1/centric/media/import', {
      data: {
        styleId: `CENTRIC-PXM-${demoArticleId}`,
        collectionId,
        articleId: demoArticleId,
      },
    });
    expect(pxmRes.ok()).toBe(true);

    const pubRes = await request.get(
      `/api/workshop2/collections/${encodeURIComponent(collectionId)}/published-articles`
    );
    expect(pubRes.ok()).toBe(true);
    const pub = (await pubRes.json()) as {
      articles?: Array<{ articleId?: string; pxmSource?: boolean }>;
    };
    const pubHit = pub.articles?.find((a) => a.articleId === demoArticleId);
    if (pubHit) {
      expect(pubHit.pxmSource).toBe(true);
    }

    const genRes = await request.post('/api/integrations/v1/linesheet/generate', {
      data: { collectionId },
    });
    expect(genRes.ok()).toBe(true);
    const genBody = (await genRes.json()) as {
      data?: { linesheet?: { articleCount?: number; linesheetId?: string } };
    };
    expect(genBody.data?.linesheet?.articleCount).toBeGreaterThan(0);
    expect(genBody.data?.linesheet?.linesheetId).toMatch(/^LS-/);

    const snapRes = await request.get(
      `/api/integrations/v1/linesheet/${encodeURIComponent(collectionId)}`
    );
    expect(snapRes.ok()).toBe(true);
    const snap = (await snapRes.json()) as {
      data?: { linesheet?: { linesheetId?: string; pxmOverlayCount?: number } };
    };
    expect(snap.data?.linesheet?.linesheetId).toBeTruthy();

    const aimsInv = await request.get('/api/integrations/v1/aims360/inventory');
    expect(aimsInv.ok()).toBe(true);
    const zedInv = await request.get('/api/integrations/v1/zedonk/inventory');
    expect(zedInv.ok()).toBe(true);
    const sku = 'SS27-M-COAT-01';
    const aimsItems = ((await aimsInv.json()) as { data?: { items?: Array<{ sku: string }> } }).data
      ?.items;
    const zedItems = ((await zedInv.json()) as { data?: { items?: Array<{ sku: string }> } }).data
      ?.items;
    expect(aimsItems?.some((i) => i.sku === sku)).toBe(true);
    expect(zedItems?.some((i) => i.sku === sku)).toBe(true);
  });
});
