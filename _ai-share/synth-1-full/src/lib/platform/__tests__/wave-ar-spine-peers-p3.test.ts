import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { buildShopCollaborativeOrderSession } from '@/lib/b2b/shop-collaborative-order';
import { buildShopReplenishmentSession } from '@/lib/b2b/shop-replenishment-workspace';
import { buildShopWorkingOrderSession } from '@/lib/b2b/shop-working-order-session';

describe('wave-ar spine peers p3', () => {
  it('brand order comms session monetization hrefs', () => {
    const session = buildBrandOrderCommsSession({
      collectionId: 'SS27',
      orderId: 'B2B-DEMO-1',
    });
    expect(session.shopMatrixHref).toContain('matrix');
    expect(session.shopCheckoutHref).toContain('checkout');
    expect(session.replenishmentAtpHref).toContain('replenishment');
    expect(brandCrmSegmentationFeatureHref('pricelist', 'SS27')).toContain('pricelist');
  });

  it('shop CO workspace session hrefs', () => {
    const replenishment = buildShopReplenishmentSession({
      collectionId: 'SS27',
      orderId: 'B2B-DEMO-1',
    });
    const collaborative = buildShopCollaborativeOrderSession({
      collectionId: 'SS27',
      orderId: 'B2B-DEMO-1',
    });
    const workingOrder = buildShopWorkingOrderSession({
      wholesaleOrderId: 'INT-DEMO-1',
      collectionId: 'SS27',
    });
    expect(replenishment.checkoutHref).toContain('checkout');
    expect(collaborative.checkoutHref).toContain('checkout');
    expect(workingOrder.matrixHref).toContain('matrix');
  });

  it('wave-ar testid anchors', () => {
    expect('brand-cm-order-context-strip').toContain('context-strip');
    expect('brand-cm-cabinet-spine-peer-strip').toContain('spine-peer');
    expect('brand-co-chain-shop-checkout-link').toContain('checkout');
    expect('shop-replenishment-co-spine-peer-strip').toContain('spine-peer');
    expect('shop-working-order-co-spine-peer-strip').toContain('spine-peer');
    expect('shop-agent-rep-brand-co-peer-strip').toContain('brand-co');
    expect('shop-collaborative-checkout-link').toContain('checkout');
    expect('brand-order-comms-golden-checkout-link').toContain('checkout');
  });
});
