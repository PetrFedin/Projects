import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
} from './helpers/core-checkout-pg';

/** 14 active hub cells — smoke on clean PG order (comms links → B2B-\\d+). */
const ACTIVE_CELL_SMOOKES = [
  {
    cell: 'brand×dev',
    href: '/brand/core?pillar=development&collection=SS27',
    panel: 'brand-dev-cabinet-panel',
  },
  {
    cell: 'brand×sample',
    href: '/brand/core?pillar=sample_collection&collection=SS27',
    panel: 'brand-sc-cabinet-panel',
    alt: 'brand-sample-collection-mini',
  },
  {
    cell: 'brand×co',
    href: '/brand/core?pillar=collection_order&collection=SS27',
    panel: 'brand-co-cabinet-panel',
  },
  {
    cell: 'brand×op',
    href: '/brand/core?pillar=order_production&collection=SS27',
    panel: 'brand-op-cabinet-panel',
  },
  {
    cell: 'brand×comms',
    href: '/brand/core?pillar=comms&collection=SS27',
    panel: 'comms-pillar-card',
    chatLink: 'brand-cm-order-chat-link',
  },
  {
    cell: 'shop×sample',
    href: '/shop/core?pillar=sample_collection&collection=SS27',
    panel: 'shop-sc-cabinet-panel',
    alt: 'shop-showroom-mini',
  },
  {
    cell: 'shop×co',
    href: '/shop/core?pillar=collection_order&collection=SS27',
    panel: 'shop-co-cabinet-panel',
  },
  {
    cell: 'shop×comms',
    href: '/shop/core?pillar=comms&collection=SS27',
    panel: 'comms-pillar-card',
    chatLink: 'shop-cm-order-chat-link',
  },
  {
    cell: 'mfr×dev',
    href: '/factory/production/core?pillar=development&collection=SS27',
    panel: 'mfr-dev-cabinet-panel',
    alt: 'development-pillar-card',
  },
  {
    cell: 'mfr×op',
    href: '/factory/production/core?pillar=order_production&collection=SS27',
    panel: 'mfr-op-cabinet-panel',
    alt: 'order-production-pillar-card',
  },
  {
    cell: 'mfr×comms',
    href: '/factory/production/core?pillar=comms&collection=SS27',
    panel: 'comms-pillar-card',
    chatLink: 'mfr-cm-order-chat-link',
  },
  {
    cell: 'sup×dev',
    href: '/factory/supplier/core?pillar=development&collection=SS27',
    panel: 'supplier-bom-preview-mini',
  },
  {
    cell: 'sup×op',
    href: '/factory/supplier/core?pillar=order_production&collection=SS27',
    panel: 'sup-op-cabinet-panel',
    alt: 'order-production-pillar-card',
  },
  {
    cell: 'sup×comms',
    href: '/factory/supplier/core?pillar=comms&collection=SS27',
    panel: 'comms-pillar-card',
    chatLink: 'sup-cm-order-chat-link',
  },
] as const;

test.describe.configure({ mode: 'serial' });

test.describe('core-24: clean PG 14-cell matrix smoke', () => {
  test('checkout + handoff then smoke all 14 active cells', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap (SS27 publish)');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);
    expect(orderId).not.toMatch(/B2B-DEMO/);

    for (const cell of ACTIVE_CELL_SMOOKES) {
      const res = await gotoRoleCoreCabinet(page, cell.href);
      expect(res?.status() ?? 599).toBeLessThan(500);

      const panel = page.getByTestId(cell.panel);
      const locator = 'alt' in cell && cell.alt ? panel.or(page.getByTestId(cell.alt)) : panel;
      await expect(locator.first()).toBeVisible({ timeout: 60_000 });

      if ('chatLink' in cell && cell.chatLink) {
        const chat = page.getByTestId(cell.chatLink);
        if ((await chat.count()) > 0) {
          await expect
            .poll(
              async () => {
                const href = await chat.first().getAttribute('href');
                if (!href) return false;
                return (
                  new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(href) &&
                  !/B2B-DEMO/.test(href)
                );
              },
              { timeout: 30_000 }
            )
            .toBe(true);
        }
      }
    }
  });
});
