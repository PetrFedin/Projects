import { buildSupplierProcurementCrossLinks } from '@/lib/fashion/supplier-procurement-workspace';

describe('supplier-procurement-workspace cross-links', () => {
  it('includes manufacturer handoff peer link', () => {
    const links = buildSupplierProcurementCrossLinks({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      orderId: 'INT-1',
    });
    const handoff = links.find((l) => l.id === 'mfr-handoff');
    expect(handoff?.href).toContain('pcf=handoff');
    expect(handoff?.href).toContain('INT-1');
  });
});
