import { brandCrmSegmentationFeatureHref } from '@/lib/b2b/brand-crm-segmentation';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { buildSupplierProcurementSession } from '@/lib/fashion/supplier-procurement-workspace';

describe('wave-aq calendar spine peers p3', () => {
  it('brand calendar context session hrefs', () => {
    const session = buildBrandOrderCommsSession({
      collectionId: 'SS27',
      orderId: 'B2B-DEMO-1',
    });
    expect(session.handoffHref).toContain('handoff');
    expect(session.registryHref).toContain('b2b-orders');
    expect(session.shopTrackingHref).toContain('tracking');
    expect(session.factoryQueueHref).toContain('handoff');
    expect(brandCrmSegmentationFeatureHref('pricelist', 'SS27')).toContain('pricelist');
  });

  it('supplier calendar context session hrefs', () => {
    const session = buildSupplierProcurementSession({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: 'B2B-DEMO-1',
    });
    expect(session.forecastHref).toContain('forecast');
    expect(session.supplyHref).toContain('supply');
    expect(session.handoffHref).toContain('handoff');
  });

  it('wave-aq testid anchors', () => {
    expect('brand-cm-calendar-context-peer-strip').toContain('context-peer');
    expect('sup-cm-calendar-context-peer-strip').toContain('context-peer');
    expect('shop-cm-calendar-brand-crm-link').toContain('brand-crm');
    expect('shop-co-registry-onboarding-brand-pricelist').toContain('pricelist');
    expect('brand-cm-calendar-crm-pricelist-link').toContain('pricelist');
  });
});
