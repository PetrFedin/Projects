import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { buildPlatformB2bMarketroomSession } from '@/lib/b2b/platform-b2b-marketroom';
import { shopReplenishmentTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { ROUTES } from '@/lib/routes';

describe('wave-aj SC path platform SoT', () => {
  it('brand SC golden path includes release gate route', () => {
    const href = `${ROUTES.brand.launchReadiness}?collection=SS27`;
    expect(href).toContain('launch-readiness');
    expect(href).toContain('SS27');
  });

  it('brand order comms session exposes registry SoT href', () => {
    const session = buildBrandOrderCommsSession({ orderId: 'B2B-DEMO-1', collectionId: 'SS27' });
    expect(session.registryHref).toContain('B2B-DEMO-1');
    expect(session.detailHref).toContain('pcf=detail');
  });

  it('platform B2B hub exposes shop matrix and brand publish', () => {
    const session = buildPlatformB2bHubSession({ collectionId: 'SS27' });
    expect(session.shopMatrixHref).toContain('b2b/matrix');
    expect(session.brandPublishHref).toBeTruthy();
  });

  it('platform marketroom session exposes shop matrix', () => {
    const session = buildPlatformB2bMarketroomSession({ collectionId: 'SS27' });
    expect(session.shopMatrixHref).toContain('collection=SS27');
  });

  it('supplier forecast replenishment back-link uses stock-atp tab', () => {
    const href = shopReplenishmentTabHref('stock-atp', 'SS27', 'B2B-DEMO-1');
    expect(href).toContain('pcf=stock-atp');
  });
});
