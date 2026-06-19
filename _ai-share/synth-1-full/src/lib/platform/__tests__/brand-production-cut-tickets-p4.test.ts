import {
  brandProductionCutTicketPgToRow,
  brandProductionCutTicketRowToPgPayload,
  mapBrandCutTicketStatusToW2,
} from '@/lib/production/brand-production-cut-ticket-spine';

describe('brand-production-cut-ticket-spine', () => {
  it('maps PG record to brand row with brandStatus from payload', () => {
    const row = brandProductionCutTicketPgToRow({
      id: 'ct-1',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      ticketNo: 'CT-SS27-001',
      qty: 100,
      w2Status: 'draft',
      payload: {
        poCode: 'PO-101',
        brandStatus: 'ready',
        factoryName: 'North',
      },
    });
    expect(row.poCode).toBe('PO-101');
    expect(row.status).toBe('ready');
    expect(row.totalQty).toBe(100);
  });

  it('maps brand status to workshop2 ticket status', () => {
    expect(mapBrandCutTicketStatusToW2('ready')).toBe('draft');
    expect(mapBrandCutTicketStatusToW2('issued')).toBe('cut');
    expect(mapBrandCutTicketStatusToW2('in_wip')).toBe('issued');
  });

  it('serializes local row to PG payload with order spine', () => {
    const payload = brandProductionCutTicketRowToPgPayload(
      {
        id: 'ct-local',
        poId: 'po-1',
        poCode: 'PO-1',
        articleId: 'demo-ss27-01',
        sku: 'demo-ss27-01',
        articleName: 'Demo',
        factoryName: 'Fab',
        totalQty: 50,
        sizeSummary: 'M:50',
        status: 'ready',
        lifecycleLabel: 'Mfg',
      },
      'B2B-DEMO-1'
    );
    expect(payload.b2bOrderId).toBe('B2B-DEMO-1');
    expect(payload.brandStatus).toBe('ready');
  });
});
