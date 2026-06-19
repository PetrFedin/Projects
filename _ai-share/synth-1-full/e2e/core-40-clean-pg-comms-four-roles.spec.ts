import { test, expect } from '@playwright/test';
import { buildPgSectionVisitKey } from '../src/lib/communications/pg-contextual-section-read-state';
import {
  assertCleanPgCommsSectionGroupLink,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgSectionReadKeys,
  handoffPgOrderViaApi,
  postPgSectionReadState,
} from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

/** Wave 22: clean PG comms — 4 роли × section-groups deep-link + section-read API (B2B-\\d+). */
test.describe('core-40: clean PG comms four roles', () => {
  test('checkout→handoff: brand/shop/mfr/sup section-groups on PG order', async ({
    page,
    request,
  }) => {
    test.setTimeout(300_000);
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    await assertCleanPgCommsSectionGroupLink(page, {
      hubPath: '/brand/core?pillar=comms&collection=SS27',
      pickerTestId: 'brand-cm-section-groups-picker',
      groupTestId: 'brand-cm-section-group-brand-co-registry',
      orderId,
      expectedSection: 'brand-co-registry',
      expectedPillar: 'collection_order',
    });

    await assertCleanPgCommsSectionGroupLink(page, {
      hubPath: '/shop/core?pillar=comms&collection=SS27',
      pickerTestId: 'shop-cm-section-groups-picker',
      groupTestId: 'shop-cm-section-group-shop-co-buyer-tracking',
      orderId,
      expectedSection: 'shop-co-buyer-tracking',
      expectedPillar: 'collection_order',
    });

    await assertCleanPgCommsSectionGroupLink(page, {
      hubPath: '/factory/production/core?pillar=comms&collection=SS27',
      pickerTestId: 'mfr-cm-section-groups-picker',
      groupTestId: 'mfr-cm-section-group-mfr-op-handoff-queue',
      orderId,
      expectedSection: 'mfr-op-handoff-queue',
      expectedPillar: 'order_production',
    });

    await assertCleanPgCommsSectionGroupLink(page, {
      hubPath: '/factory/supplier/core?pillar=comms&collection=SS27',
      pickerTestId: 'sup-cm-section-groups-picker',
      groupTestId: 'sup-cm-section-group-sup-op-procurement',
      orderId,
      expectedSection: 'sup-op-procurement',
      expectedPillar: 'order_production',
    });
  });

  test('section-read-state API persists visit keys for clean PG order', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = `B2B-${Date.now()}`;
    const readerId = 'e2e-core-40-reader';
    const visitKey = buildPgSectionVisitKey(orderId, 'collection_order', 'brand-co-registry');

    await postPgSectionReadState(request, {
      orderId,
      pillarId: 'collection_order',
      sectionId: 'brand-co-registry',
      readerId,
    });

    const keys = await fetchPgSectionReadKeys(request, orderId, readerId);
    expect(keys).toContain(visitKey);
  });
});
