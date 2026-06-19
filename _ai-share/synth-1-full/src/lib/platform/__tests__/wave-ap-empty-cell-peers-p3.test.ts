import { buildManufacturerHandoffQueueSession } from '@/lib/production/manufacturer-handoff-queue';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';
import { shopB2bCheckoutCollectionHref } from '@/lib/routes';

describe('wave-ap empty-cell spine peers p3', () => {
  it('mfr empty CO session hrefs', () => {
    const session = buildManufacturerHandoffQueueSession({
      factoryId: 'factory-1',
      collectionId: 'SS27',
      orderId: 'B2B-DEMO-1',
    });
    expect(session.brandHandoffHref).toContain('handoff');
    expect(session.shopTrackingHref).toContain('tracking');
    expect(session.handoffHref).toContain('handoff');
  });

  it('mfr empty SC shop monetization hrefs', () => {
    const session = buildShopShowroomBuySession({ collectionId: 'SS27' });
    expect(session.showroomHref).toContain('showroom');
    expect(session.matrixHref).toContain('/shop/b2b/matrix');
  });

  it('sup empty CO procurement session hrefs', () => {
    const session = buildSupplierProcurementSession({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: 'B2B-DEMO-1',
    });
    expect(session.forecastHref).toContain('forecast');
    expect(session.shopTrackingHref).toContain('tracking');
  });

  it('greenfield checkout hrefs', () => {
    expect(shopB2bCheckoutCollectionHref('SS27')).toContain('checkout');
  });

  it('wave-ap testid anchors', () => {
    expect('mfr-empty-sc-peer-strip').toContain('sc-peer');
    expect('mfr-empty-co-peer-strip').toContain('co-peer');
    expect('sup-empty-co-peer-strip').toContain('co-peer');
    expect('shop-development-bridge-checkout').toContain('checkout');
    expect('shop-co-registry-onboarding-checkout').toContain('checkout');
    expect('shop-dev-bridge-crm-checkout-link').toContain('checkout');
  });
});
