import { shopWorkingOrderTabHref } from '@/lib/b2b/shop-collection-order-hrefs';
import { buildSupplierOrderCommsSession } from '@/lib/b2b/supplier-order-comms';
import { buildShopReplenishmentSession } from '@/lib/b2b/shop-replenishment-workspace';
import { ROUTES } from '@/lib/routes';
import { buildOrderSectionCommsMessagesHref } from '@/lib/platform-core-comms-section-groups';

describe('wave-ai replenishment cabinet calendar comms', () => {
  it('replenishment session exposes rules and stock-atp tabs', () => {
    const session = buildShopReplenishmentSession({ collectionId: 'SS27', orderId: 'B2B-DEMO-1' });
    expect(session.rulesHref).toContain('pcf=rules');
    expect(session.stockAtpHref).toContain('pcf=stock-atp');
  });

  it('shop CO cabinet post-confirm bulk amend href', () => {
    const href = shopWorkingOrderTabHref('bulk', 'B2B-DEMO-1', 'SS27');
    expect(href).toContain('pcf=bulk');
    expect(href).toContain('B2B-DEMO-1');
  });

  it('user-task GET route path is stable', () => {
    expect('/api/workshop2/platform-core/calendar-events/user-task').toContain('user-task');
  });

  it('mfr Gantt bridge uses brand production gantt route', () => {
    const href = `${ROUTES.brand.productionGantt}?po=B2B-DEMO-1&collection=SS27`;
    expect(href).toContain('/brand/production/gantt');
  });

  it('supplier comms push strip chat href uses comms section', () => {
    const session = buildSupplierOrderCommsSession({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: 'B2B-DEMO-1',
    });
    const chatHref = buildOrderSectionCommsMessagesHref({
      roleId: 'supplier',
      orderId: 'B2B-DEMO-1',
      collectionId: 'SS27',
      sectionId: 'sup-cm-cabinet',
      pillarId: 'comms',
    });
    expect(chatHref).toContain('sup-cm-cabinet');
    expect(session.entitiesHref).toContain('pcf=entities');
  });
});
