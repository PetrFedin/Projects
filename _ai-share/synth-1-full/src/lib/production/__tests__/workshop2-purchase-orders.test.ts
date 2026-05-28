jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import {
  clearWorkshop2PurchaseOrdersMemoryForTests,
  createWorkshop2PurchaseOrder,
  createWorkshop2PurchaseOrdersFromRequisitions,
  listWorkshop2PurchaseOrders,
  updateWorkshop2PurchaseOrderErpSync,
} from '@/lib/server/workshop2-purchase-order-repository';
import { syncWorkshop2PurchaseOrdersToErp } from '@/lib/server/workshop2-purchase-order-erp-sync';
import { clearWorkshop2PlmOutboxMemoryForTests } from '@/lib/server/workshop2-plm-outbox';
import { resolveWorkshop2PurchaseOrderErpDisplayStatus } from '@/lib/production/workshop2-purchase-order-erp-display';

describe('workshop2 purchase orders', () => {
  beforeEach(() => {
    clearWorkshop2PurchaseOrdersMemoryForTests();
    clearWorkshop2PlmOutboxMemoryForTests();
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
  });

  it('creates PO from requisitions in memory', async () => {
    const pos = await createWorkshop2PurchaseOrdersFromRequisitions({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      lines: [
        {
          lineRef: 'bom-1',
          materialLabel: 'Хлопок',
          quantity: 120,
          unit: 'м',
          requisitionId: 'req-1',
        },
      ],
    });
    expect(pos).toHaveLength(1);
    expect(pos[0]!.qty).toBe(120);
    expect(pos[0]!.status).toBe('draft');
    expect(pos[0]!.payload.source).toBe('material_request');

    const listed = await listWorkshop2PurchaseOrders({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });
    expect(listed).toHaveLength(1);
  });

  it('sync to ERP without base url returns erp_not_configured error', async () => {
    const po = await createWorkshop2PurchaseOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      qty: 500,
      payload: { source: 'sample_plan', label: 'Серия SS27' },
    });
    const result = await syncWorkshop2PurchaseOrdersToErp({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(result.synced).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.erpConfigured).toBe(false);
    expect(result.erpNotConfigured).toBe(true);

    const listed = await listWorkshop2PurchaseOrders({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    const updated = listed.find((p) => p.id === po.id);
    expect(updated?.status).toBe('error');
    expect(updated?.payload?.lastError).toBe('erp_not_configured');
  });

  it('display blocks fake synced without erp external id', () => {
    const d = resolveWorkshop2PurchaseOrderErpDisplayStatus({
      status: 'synced',
      erpConfigured: true,
    });
    expect(d.code).toBe('pending_erp');
    expect(d.labelRu).toMatch(/erpOrderId/i);
  });

  it('marks PO synced with erp external id', async () => {
    const po = await createWorkshop2PurchaseOrder({
      collectionId: 'c',
      articleId: 'a',
      qty: 10,
    });
    const updated = await updateWorkshop2PurchaseOrderErpSync({
      id: po.id,
      collectionId: 'c',
      articleId: 'a',
      status: 'synced',
      erpExternalId: 'ERP-PO-001',
    });
    expect(updated?.erpExternalId).toBe('ERP-PO-001');
    expect(updated?.status).toBe('synced');
  });
});
