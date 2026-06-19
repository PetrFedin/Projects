import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };
const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';
const FACTORY_ID = 'fact-1';

test.describe('core-11: MES cut/sew/qc на production-orders', () => {
  test('API: mesReleaseStage в очереди handoff', async ({ request }) => {
    const res = await request.get(
      `/api/workshop2/factory/production-handoff-queue?factoryId=${FACTORY_ID}`
    );
    test.skip(!res.ok(), 'нужен db:core:bootstrap + handoff seed');
    const json = (await res.json()) as {
      ok?: boolean;
      items?: Array<{ b2bOrderId: string; mesReleaseStage?: string }>;
    };
    const row = json.items?.find((i) => i.b2bOrderId === DEMO_ORDER);
    test.skip(!row, 'demo PO не в очереди');
    expect(typeof row.mesReleaseStage).toBe('string');
  });

  test('UI: принять серию → MES advance cut → sew', async ({ page, request }) => {
    const queueRes = await request.get(
      `/api/workshop2/factory/production-handoff-queue?factoryId=${FACTORY_ID}`
    );
    test.skip(!queueRes.ok(), 'PG/seed недоступен');
    const queue = (await queueRes.json()) as {
      items?: Array<{
        b2bOrderId: string;
        productionOrderId: string;
        collectionId: string;
        articleId: string;
        status: string;
        mesReleaseStage?: string;
      }>;
    };
    const row = queue.items?.find((i) => i.b2bOrderId === DEMO_ORDER);
    test.skip(!row, 'demo PO не в очереди');

    if (row.status === 'pending_erp') {
      const ack = await request.post(
        '/api/workshop2/factory/production-handoff-queue/bulk-acknowledge',
        {
          data: {
            factoryId: FACTORY_ID,
            items: [
              {
                productionOrderId: row.productionOrderId,
                collectionId: row.collectionId,
                articleId: row.articleId,
              },
            ],
            actor: 'e2e-core-11',
          },
        }
      );
      expect(ack.ok()).toBeTruthy();
    }

    const res = await page.goto('/factory/production/orders', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    const mes = page.getByTestId(`factory-production-order-mes-${DEMO_ORDER}`);
    await expect(mes).toBeVisible({ timeout: 60_000 });

    const advance = page.getByTestId(`factory-production-order-mes-${DEMO_ORDER}-advance`);
    if (await advance.isVisible().catch(() => false)) {
      await advance.click();
      await expect(page.getByTestId(`factory-production-order-mes-${DEMO_ORDER}-step-sew`)).toBeVisible({
        timeout: 30_000,
      });
    } else {
      await expect(page.getByTestId(`factory-production-order-mes-${DEMO_ORDER}-step-cut`)).toBeVisible();
    }
  });

  test('FW27: MES strip на production-orders', async ({ page, request }) => {
    const fwOrder = 'B2B-DEMO-SHOP1-FW27';
    const queueRes = await request.get(
      `/api/workshop2/factory/production-handoff-queue?factoryId=${FACTORY_ID}`
    );
    test.skip(!queueRes.ok(), 'PG/seed недоступен');
    const queue = (await queueRes.json()) as {
      items?: Array<{ b2bOrderId: string }>;
    };
    const row = queue.items?.find((i) => i.b2bOrderId === fwOrder);
    test.skip(!row, 'FW27 PO не в очереди');

    const res = await page.goto('/factory/production/orders', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    const mes = page.getByTestId(`factory-production-order-mes-${fwOrder}`);
    await expect(mes).toBeVisible({ timeout: 60_000 });
  });
});
