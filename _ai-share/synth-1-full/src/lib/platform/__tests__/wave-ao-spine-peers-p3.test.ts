import { buildBrandLandedMarginSession } from '@/lib/b2b/brand-landed-margin';
import { buildBrandPricelistSession } from '@/lib/b2b/brand-pricelist-workspace';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { brandWssiCheckoutHref, brandWssiShopMatrixHref } from '@/lib/fashion/brand-wssi-plan';
import { buildBrandPackRulesSession } from '@/lib/fashion/brand-pack-rules-workspace';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';

describe('wave-ao spine peers p3', () => {
  it('brand range planner shop monetization hrefs', () => {
    const session = buildShopShowroomBuySession({ collectionId: 'SS27' });
    expect(session.matrixHref).toContain('/shop/b2b/matrix');
    expect(session.checkoutHref).toContain('checkout');
  });

  it('brand wssi golden path checkout href', () => {
    expect(brandWssiShopMatrixHref('SS27')).toContain('SS27');
    expect(brandWssiCheckoutHref('SS27')).toContain('checkout');
  });

  it('brand pricelist and pack-rules checkout sessions', () => {
    const pricelist = buildBrandPricelistSession({ collectionId: 'SS27' });
    const packRules = buildBrandPackRulesSession({ collectionId: 'SS27' });
    expect(pricelist.shopCheckoutHref).toContain('checkout');
    expect(packRules.shopCheckoutHref).toContain('checkout');
  });

  it('brand landed margin checkout session', () => {
    const session = buildBrandLandedMarginSession({ collectionId: 'SS27', orderId: 'B2B-DEMO-1' });
    expect(session.shopCheckoutHref).toContain('checkout');
    expect(session.shopMatrixHref).toContain('matrix');
  });

  it('supplier handoff read and chain workspace sessions', () => {
    const session = buildSupplierProcurementSession({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: 'B2B-DEMO-1',
    });
    expect(session.forecastHref).toContain('forecast');
    expect(session.shopTrackingHref).toContain('tracking');
    expect(session.supplyHref).toContain('supply');
  });

  it('wave-ao testid anchors', () => {
    expect('shop-cm-calendar-context-peer-strip').toContain('context-peer');
    expect('brand-co-registry-retail-onboarding-strip').toContain('retail-onboarding');
    expect('sup-op-handoff-read-spine-peer-strip').toContain('spine-peer');
    expect('sup-op-chain-workspace-peer-strip').toContain('workspace-peer');
    expect('shop-development-bridge-greenfield-crm-strip').toContain('greenfield-crm');
    expect('brand-dev-range-shop-matrix-link').toContain('shop-matrix');
  });
});
