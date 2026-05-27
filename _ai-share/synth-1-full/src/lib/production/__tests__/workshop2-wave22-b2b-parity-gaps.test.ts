/**
 * Wave 22 — B2B parity gaps (+18 tests).
 */
jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    output: jest.fn(() => new ArrayBuffer(1200)),
  })),
}));

import fs from 'node:fs';
import path from 'node:path';

import { buildWorkshop2Ss27MenCoat01FullTzDemoDossier } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  buildWorkshop2B2bCampaign,
  buildWorkshop2B2bCatalogMatrix,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import { buildWorkshop2B2bLinesheetPdfBytes } from '@/lib/production/workshop2-b2b-linesheet-pdf';
import { buildWorkshop2B2bOrderConfirmationPdfBytes } from '@/lib/production/workshop2-b2b-order-confirmation-pdf';
import {
  buildWorkshop2B2bDeliveryCalendarEventFromOrder,
  buildWorkshop2B2bOrderAnalytics,
  buildWorkshop2B2bRepShareUrl,
  buildWorkshop2Wave22B2bParityGapsProbe,
  enrichWorkshop2B2bMatrixWithAvailability,
  formatWorkshop2B2bCampaignId,
  isWorkshop2B2bPaymentTermsRu,
  mergeWorkshop2B2bEventsIntoBrandCalendar,
  parseWorkshop2B2bCampaignId,
  patchWorkshop2DossierBuyerSampleRequested,
  resolveWorkshop2B2bMatrixAvailabilityHint,
  workshop2B2bPaymentTermsLabelRu,
  workshop2ContextualChatRoleLabelRu,
  WORKSHOP2_B2B_OFFLINE_DRAFT_STORAGE_KEY,
} from '@/lib/production/workshop2-b2b-wave22-parity';
import { buildWorkshop2Wave22B2bParityGapsProbe as probeFromBarrel } from '@/lib/production/workshop2-live-integration-probes';
import {
  attemptWorkshop2MarkingHonestSignHttpPost,
  registerWorkshop2MarkingOrderJournal,
} from '@/lib/production/workshop2-marking-honest-sign';
import {
  addWorkshop2B2bWishlistEntry,
  clearWorkshop2B2bRepShareMemoryForTests,
  clearWorkshop2B2bWishlistMemoryForTests,
  issueWorkshop2B2bRepShareToken,
  listWorkshop2B2bWishlist,
  removeWorkshop2B2bWishlistEntry,
} from '@/lib/server/workshop2-b2b-wishlist-repository';
import {
  clearWorkshop2B2bOrdersMemoryForTests,
  listWorkshop2B2bOrdersForCollection,
  putWorkshop2B2bOrder,
} from '@/lib/server/workshop2-b2b-orders-repository';

describe('workshop2 wave22 b2b — campaign id & payment terms', () => {
  it('parses collectionId::articleId', () => {
    expect(parseWorkshop2B2bCampaignId('SS27::demo-ss27-01')).toEqual({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(formatWorkshop2B2bCampaignId('SS27', 'demo-ss27-01')).toBe('SS27::demo-ss27-01');
  });

  it('labels payment terms RU', () => {
    expect(workshop2B2bPaymentTermsLabelRu('defer_30')).toMatch(/30/);
    expect(isWorkshop2B2bPaymentTermsRu('prepay_100')).toBe(true);
  });
});

describe('workshop2 wave22 b2b — wishlist store', () => {
  beforeEach(() => {
    clearWorkshop2B2bWishlistMemoryForTests();
    clearWorkshop2B2bRepShareMemoryForTests();
  });

  it('adds and lists wishlist entries', async () => {
    await addWorkshop2B2bWishlistEntry({
      buyerId: 'buyer-1',
      campaignId: 'SS27::a1',
      collectionId: 'SS27',
      articleId: 'a1',
      addedAt: new Date().toISOString(),
    });
    const items = await listWorkshop2B2bWishlist('buyer-1');
    expect(items).toHaveLength(1);
    const removed = await removeWorkshop2B2bWishlistEntry({
      buyerId: 'buyer-1',
      campaignId: 'SS27::a1',
    });
    expect(removed.removed).toBe(true);
  });

  it('issues rep share token and URL', async () => {
    const token = await issueWorkshop2B2bRepShareToken({
      campaignId: 'SS27::demo',
      repId: 'rep-1',
    });
    const url = buildWorkshop2B2bRepShareUrl({
      baseUrl: 'http://localhost:3000',
      token: token.token,
      campaignId: 'SS27::demo',
      repId: 'rep-1',
    });
    expect(url).toContain('repShare=');
  });
});

describe('workshop2 wave22 b2b — matrix availability & PDF', () => {
  const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
  const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'wave22-test');

  it('enriches matrix cells with availability hint', () => {
    const matrix = buildWorkshop2B2bCatalogMatrix({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
    });
    const enriched = enrichWorkshop2B2bMatrixWithAvailability({ matrix, dossier });
    expect(enriched.cells[0]?.availabilityHintRu).toBeTruthy();
    const hint = resolveWorkshop2B2bMatrixAvailabilityHint({
      dossier: { ...dossier, internalWmsMirror: undefined },
      cell: matrix.cells[0]!,
    });
    expect(hint.onRequest).toBe(true);
  });

  it('builds linesheet and confirmation PDF bytes', () => {
    const campaign = buildWorkshop2B2bCampaign({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      dossier,
    });
    const linesheetPdf = buildWorkshop2B2bLinesheetPdfBytes({ campaign });
    expect(linesheetPdf.byteLength).toBeGreaterThan(500);
    const confirmPdf = buildWorkshop2B2bOrderConfirmationPdfBytes({
      id: 'B2B-1',
      status: 'submitted',
      tier: 'standard',
      totalRub: 1000,
      lines: [],
      paymentTermsRu: 'defer_30',
      paymentTermsDays: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(confirmPdf.byteLength).toBeGreaterThan(400);
  });
});

describe('workshop2 wave22 b2b — orders analytics & calendar merge', () => {
  beforeEach(() => clearWorkshop2B2bOrdersMemoryForTests());

  it('aggregates brand analytics from orders', async () => {
    const now = new Date().toISOString();
    await putWorkshop2B2bOrder({
      id: 'B2B-A1',
      collectionId: 'SS27',
      articleId: 'demo',
      status: 'submitted',
      tier: 'standard',
      totalRub: 5000,
      lines: [
        {
          articleId: 'demo',
          collectionId: 'SS27',
          colorCode: 'blk',
          size: 'M',
          qty: 2,
          wholesalePriceRub: 2500,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });
    const orders = await listWorkshop2B2bOrdersForCollection('SS27');
    const analytics = buildWorkshop2B2bOrderAnalytics({ collectionId: 'SS27', orders });
    expect(analytics.ordersCount).toBe(1);
    expect(analytics.totalRub).toBe(5000);
    expect(analytics.topSkus.length).toBeGreaterThan(0);
  });

  it('builds delivery calendar event from order requestedDeliveryDate', () => {
    const ev = buildWorkshop2B2bDeliveryCalendarEventFromOrder({
      id: 'B2B-D1',
      collectionId: 'SS27',
      status: 'submitted',
      tier: 'standard',
      totalRub: 1,
      lines: [],
      requestedDeliveryDate: '2026-07-15T00:00:00.000Z',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(ev?.kind).toBe('delivery_window');
  });

  it('persists payment terms and delivery on order', async () => {
    const now = new Date().toISOString();
    await putWorkshop2B2bOrder({
      id: 'B2B-PT',
      collectionId: 'SS27',
      status: 'draft',
      tier: 'standard',
      totalRub: 1,
      lines: [],
      requestedDeliveryDate: '2026-08-01',
      paymentTermsRu: 'defer_60',
      paymentTermsDays: 60,
      createdAt: now,
      updatedAt: now,
    });
    const orders = await listWorkshop2B2bOrdersForCollection('SS27');
    const o = orders.find((x) => x.id === 'B2B-PT');
    expect(o?.paymentTermsRu).toBe('defer_60');
    expect(o?.requestedDeliveryDate).toContain('2026-08-01');
  });

  it('merges b2b events into brand calendar', () => {
    const merged = mergeWorkshop2B2bEventsIntoBrandCalendar({
      w2Events: [],
      b2bEvents: [
        {
          id: 'b2b-1',
          collectionId: 'SS27',
          articleId: 'demo',
          source: 'b2b',
          title: 'Market',
          startAt: '2026-06-01T09:00:00.000Z',
          endAt: '2026-06-01T18:00:00.000Z',
          kind: 'market_date',
        },
      ],
    });
    expect(merged.some((e) => e.id.startsWith('b2b-cal-'))).toBe(true);
  });
});

describe('workshop2 wave22 b2b — horizontal dossier & chat', () => {
  const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
  const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'wave22');

  it('flags buyerSampleRequested on dossier', () => {
    const next = patchWorkshop2DossierBuyerSampleRequested(dossier);
    expect(next.b2bIntegrationDraft?.buyerSampleRequested).toBe(true);
  });

  it('exposes contextual chat role label RU for b2b_order', () => {
    expect(workshop2ContextualChatRoleLabelRu('b2b_order')).toMatch(/B2B/);
  });
});

describe('workshop2 wave22 b2b — marking & probe & docs', () => {
  it('registerWorkshop2MarkingOrderJournal journal when no API', () => {
    const leaf = findHandbookLeafById('catalog-apparel-g0-l0');
    const dossier = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(leaf, 'm');
    const reg = registerWorkshop2MarkingOrderJournal({
      dossier: {
        ...dossier,
        passportProductionBrief: { markingRequired: true, gtin: '4600000000000' },
      },
      collectionId: 'SS27',
      articleId: 'demo',
      actor: 'test',
      env: {},
    });
    expect(reg.ok).toBe(true);
    expect(reg.mirror.journalOnly).toBe(true);
  });

  it('attemptWorkshop2MarkingHonestSignHttpPost fail-closed on bad URL', async () => {
    const res = await attemptWorkshop2MarkingHonestSignHttpPost({
      apiUrl: 'http://127.0.0.1:1',
      payload: {
        gtin: '1',
        markingOrderId: 'm1',
        collectionId: 'SS27',
        articleId: 'demo',
      },
    });
    expect(res.attempted).toBe(true);
    expect(res.ok).toBe(false);
  });

  it('buildWorkshop2Wave22B2bParityGapsProbe passes', () => {
    const probe = buildWorkshop2Wave22B2bParityGapsProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(probe.checks.length).toBeGreaterThanOrEqual(16);
    expect(
      probeFromBarrel({ WORKSHOP2_MARKET: 'ru' }).checks.some((c) => c.id === 'b2b_wishlist_api')
    ).toBe(true);
  });

  it('parity matrix and staging script exist', () => {
    const root = process.cwd();
    expect(fs.existsSync(path.join(root, '.planning/workshop2-b2b-joor-parity-matrix.md'))).toBe(
      true
    );
    expect(fs.existsSync(path.join(root, 'scripts/workshop2-pg-staging-up.sh'))).toBe(true);
  });

  it('wave22 API route files exist', () => {
    const root = process.cwd();
    expect(fs.existsSync(path.join(root, 'src/app/api/shop/b2b/wishlist/route.ts'))).toBe(true);
    expect(
      fs.existsSync(path.join(root, 'src/app/api/shop/b2b/campaigns/[id]/linesheet.pdf/route.ts'))
    ).toBe(true);
    expect(fs.existsSync(path.join(root, 'src/app/api/brand/b2b/analytics/route.ts'))).toBe(true);
  });

  it('offline draft storage key is stable for rep portal', () => {
    expect(WORKSHOP2_B2B_OFFLINE_DRAFT_STORAGE_KEY).toContain('rep.offlineOrderDrafts');
  });
});
