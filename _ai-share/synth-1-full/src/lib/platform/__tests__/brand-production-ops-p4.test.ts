import { buildBrandProductionOpsSession } from '@/lib/brand-production/brand-production-ops-session';
import { createSeedState } from '@/lib/brand-production/seed';
import {
  buildBrandProductionOpsLocalSyncPayload,
  mapBrandPoStatusToWorkshop2,
} from '@/lib/production/brand-production-ops-local-sync';
import {
  labelBrandProductionOpsPoStatusRu,
  workshop2PoToBrandProductionOpsRow,
  workshop2RequisitionToBrandProductionOpsBomRow,
} from '@/lib/production/brand-production-ops-spine';

describe('brand-production-ops-spine', () => {
  it('maps workshop2 PO to brand ops row', () => {
    const row = workshop2PoToBrandProductionOpsRow({
      id: 'po-1',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      qty: 100,
      status: 'synced',
      mesReleaseStage: 'queued',
      payload: { poCode: 'PO-101', factoryName: 'North', b2bOrderId: 'B2B-1' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(row.poCode).toBe('PO-101');
    expect(row.b2bOrderId).toBe('B2B-1');
    expect(labelBrandProductionOpsPoStatusRu('synced')).toContain('Confirmed');
  });

  it('maps material requisition to BOM row', () => {
    const row = workshop2RequisitionToBrandProductionOpsBomRow({
      id: 'req-1',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      bomLineRef: 'shell:fabric',
      materialLabel: 'Shell fabric',
      quantity: 10,
      unit: 'm',
      status: 'draft',
      createdAt: new Date().toISOString(),
    });
    expect(row.materialLabel).toBe('Shell fabric');
    expect(row.qty).toBe(10);
  });
});

describe('brand-production-ops-session', () => {
  it('builds cross-links to handoff cut ticket supplier bom', () => {
    const session = buildBrandProductionOpsSession({
      orderId: 'INT-1',
      collectionId: 'SS27',
    });
    expect(session.handoffTabHref).toContain('pcf=handoff');
    expect(session.cutTicketTabHref).toContain('pcf=cut-ticket');
    expect(session.supplierBomHref).toContain('pcf=bom');
    expect(session.operationsTabHref).toContain('pcf=operations');
  });
});

describe('brand-production-ops-local-sync', () => {
  it('builds sync payload from local PO lines', () => {
    const state = createSeedState();
    const payload = buildBrandProductionOpsLocalSyncPayload({
      targetCollectionId: 'SS27',
      orderId: 'B2B-1',
      sourceCollectionId: 'col-fw26',
      purchaseOrders: state.purchaseOrders,
      bomLines: state.bomLines,
      articles: state.articles,
      factories: state.factories,
    });
    expect(payload.poLines.length).toBeGreaterThan(0);
    expect(payload.poLines[0]?.collectionId).toBe('SS27');
    expect(payload.bomLines.length).toBeGreaterThan(0);
    expect(mapBrandPoStatusToWorkshop2('confirmed')).toBe('synced');
  });
});
