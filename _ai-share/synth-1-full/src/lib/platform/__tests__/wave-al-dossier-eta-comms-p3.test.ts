import { brandProductionOpsFeatureHref } from '@/lib/brand-production/brand-production-handoff';
import { brandAttributeSchemaFeatureHref } from '@/lib/fashion/brand-attribute-schema-workspace';
import { brandSampleLifecycleFeatureHref } from '@/lib/fashion/brand-sample-lifecycle-workspace';
import { buildManufacturerQcGateSession } from '@/lib/production/manufacturer-qc-gate';
import { shopB2bOrderProductionContextHref, shopB2bTrackingOrderHref } from '@/lib/routes';

describe('wave-al dossier eta comms peers', () => {
  it('brand op dossier production peer hrefs', () => {
    expect(brandProductionOpsFeatureHref('B2B-DEMO-1', 'qc-gate')).toContain('pcf=qc-gate');
    expect(brandProductionOpsFeatureHref('B2B-DEMO-1', 'cut-ticket')).toContain('pcf=cut-ticket');
    const qc = buildManufacturerQcGateSession({ orderId: 'B2B-DEMO-1', collectionId: 'SS27' });
    expect(qc.qcTabHref).toContain('pcf=qc-gate');
  });

  it('shop tracking eta peek hrefs', () => {
    expect(shopB2bTrackingOrderHref('B2B-DEMO-1')).toContain('order=B2B-DEMO-1');
    expect(shopB2bOrderProductionContextHref('B2B-DEMO-1')).toContain('#shop-co-buyer-tracking');
  });

  it('brand dev cabinet peer hrefs', () => {
    expect(brandSampleLifecycleFeatureHref('rounds', 'SS27')).toContain('pcf=rounds');
    expect(brandAttributeSchemaFeatureHref('health', 'SS27')).toContain('pcf=health');
  });

  it('wave-al testid anchors', () => {
    expect('brand-op-dossier-production-peer-strip').toContain('production-peer');
    expect('shop-op-cabinet-eta-peek-strip').toContain('eta-peek');
    expect('mfr-cm-unified-po-inbox-strip').toContain('unified-po');
    expect('sup-dev-materials-price-journal-honest-strip').toContain('price-journal');
    expect('brand-cm-order-registry-stream-health-strip').toContain('registry-stream-health');
  });
});
