import { buildBrandLinesheetSyndicationSession } from '@/lib/fashion/brand-linesheet-syndication';
import { buildBrandProductionHandoffSession } from '@/lib/brand-production/brand-production-handoff';
import { buildManufacturerQcGateSession } from '@/lib/production/manufacturer-qc-gate';

describe('wave-af release + qc cross-links', () => {
  it('release gate showroom publish href stays on workspace tab', () => {
    const session = buildBrandLinesheetSyndicationSession({ collectionId: 'SS27' });
    expect(session.showroomPublishHref).toContain('pcf=showroom-publish');
    expect(session.shopShowroomHref).toContain('collection=SS27');
  });

  it('brand QC gate links handoff tab and manufacturer QC', () => {
    const handoff = buildBrandProductionHandoffSession({ orderId: 'INT-1', collectionId: 'SS27' });
    const mfr = buildManufacturerQcGateSession({ orderId: 'INT-1', collectionId: 'SS27' });
    expect(handoff.qcGateTabHref).toContain('pcf=qc-gate');
    expect(handoff.handoffTabHref).toContain('pcf=handoff');
    expect(mfr.brandQcTabHref).toContain('pcf=qc-gate');
    expect(mfr.qcTabHref).toContain('pcf=qc-gate');
  });
});
