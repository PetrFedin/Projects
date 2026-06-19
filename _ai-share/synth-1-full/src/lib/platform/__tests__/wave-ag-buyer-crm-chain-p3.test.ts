import {
  buildShopBuyerCrmProfile,
  resolveShopBuyerDefaultSegmentKey,
  SHOP_BUYER_DEFAULT_SEGMENT_KEY,
} from '@/lib/b2b/shop-buyer-crm-profile';
import { buildBrandLinesheetSyndicationSession } from '@/lib/fashion/brand-linesheet-syndication';
import { buildSupplierOrderCommsSession } from '@/lib/b2b/supplier-order-comms';
import {
  clearShopBuyerCrmProfilesMemoryForTests,
  getShopBuyerCrmProfileServer,
} from '@/lib/server/shop-buyer-crm-profile-repository';
import { clearBrandCrmSegmentsMemoryForTests } from '@/lib/server/brand-crm-segments-repository';

describe('wave-ag buyer CRM + chain + supplier WMS', () => {
  beforeEach(() => {
    clearBrandCrmSegmentsMemoryForTests();
    clearShopBuyerCrmProfilesMemoryForTests();
  });

  it('maps shop2 greenfield buyer to retail segment by default', () => {
    expect(resolveShopBuyerDefaultSegmentKey('shop2')).toBe('retail');
    expect(SHOP_BUYER_DEFAULT_SEGMENT_KEY.shop1).toBe('wholesale');
  });

  it('seeds buyer CRM profile with segment terms from brand CRM', async () => {
    const { profile, storageMode } = await getShopBuyerCrmProfileServer({ buyerId: 'shop2' });
    expect(profile).toBeTruthy();
    expect(profile?.segmentKey).toBe('retail');
    expect(profile?.netTermDays).toBeGreaterThan(0);
    expect(profile?.priceTier).toBeTruthy();
    expect(['pg', 'file', 'memory', 'demo']).toContain(storageMode);
  });

  it('buildShopBuyerCrmProfile preserves discount and VAT flags', () => {
    const profile = buildShopBuyerCrmProfile({
      buyerId: 'shop1',
      segment: {
        id: 'crm-seg-wholesale',
        segmentKey: 'wholesale',
        nameRu: 'Опт',
        query: {},
        defaultPriceTier: 'retail_b',
        defaultNetTermDays: 30,
        firstOrderDiscountPct: 8,
        vatExempt: false,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    });
    expect(profile.firstOrderDiscountPct).toBe(8);
    expect(profile.buyerLabelRu).toContain('Москва');
  });

  it('syndication session exposes showroom publish href for post-push CTA', () => {
    const session = buildBrandLinesheetSyndicationSession({ collectionId: 'SS27' });
    expect(session.showroomPublishHref).toContain('showroom-publish');
    expect(session.syndicationHref).toContain('syndication');
  });

  it('supplier order comms session exposes WMS cross-links', () => {
    const session = buildSupplierOrderCommsSession({
      orderId: 'B2B-DEMO-1',
      collectionId: 'SS27',
    });
    expect(session.brandOrderHandoffHref).toContain('handoff');
    expect(session.shopTrackingHref).toContain('tracking');
  });
});
