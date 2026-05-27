jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import { mapWorkshop2DossierSavedToPlm } from '@/lib/production/workshop2-plm-bridge';
import {
  enqueueWorkshop2PlmOutbox,
  processWorkshop2PlmOutboxBatch,
  ackWorkshop2PlmOutboxDelivery,
  clearWorkshop2PlmOutboxMemoryForTests,
} from '@/lib/server/workshop2-plm-outbox';
import {
  runWorkshop2FactoryErpSync,
  clearWorkshop2FactoryErpMemoryForTests,
  resolveWorkshop2FactoryErpBaseUrl,
  resolveErpOrderIdFromResponse,
  getWorkshop2FactoryErpState,
  sanitizeWorkshop2FactoryErpState,
} from '@/lib/server/workshop2-factory-erp-repository';
import {
  upsertWorkshop2LogisticsShipment,
  listWorkshop2LogisticsShipments,
  listWorkshop2LogisticsInTransitArticleKeys,
  clearWorkshop2LogisticsMemoryForTests,
} from '@/lib/server/workshop2-logistics-repository';
import { notifyWorkshop2PlmOnDossierSaved } from '@/lib/server/workshop2-plm-runtime';
import {
  putWorkshop2InspectorReport,
  getWorkshop2InspectorReport,
  clearWorkshop2InspectorReportsMemoryForTests,
} from '@/lib/server/workshop2-inspector-report-repository';
import {
  putWorkshop2ShowroomCampaign,
  getWorkshop2ShowroomCampaign,
  clearWorkshop2ShowroomMemoryForTests,
} from '@/lib/server/workshop2-showroom-repository';
import {
  createWorkshop2PurchaseOrder,
  clearWorkshop2PurchaseOrdersMemoryForTests,
} from '@/lib/server/workshop2-purchase-order-repository';
import { computeWorkshop2RiskFromDossier } from '@/lib/production/workshop2-risk-from-dossier';
import {
  buildWorkshop2NestingFactoryExport,
  callWorkshop2NestingSimulationStub,
} from '@/lib/production/workshop2-nesting-request';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

describe('workshop2 external integrations', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    clearWorkshop2PlmOutboxMemoryForTests();
    clearWorkshop2FactoryErpMemoryForTests();
    clearWorkshop2LogisticsMemoryForTests();
    clearWorkshop2ShowroomMemoryForTests();
    clearWorkshop2InspectorReportsMemoryForTests();
    clearWorkshop2PurchaseOrdersMemoryForTests();
    delete process.env.WORKSHOP2_PLM_WEBHOOK_URL;
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
    delete process.env.WORKSHOP2_NESTING_API_URL;
    global.fetch = originalFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('plm outbox dispatches without auto-ack by default', async () => {
    const env = mapWorkshop2DossierSavedToPlm({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      dossier: emptyWorkshop2DossierPhase1(),
      version: 1,
    });
    await enqueueWorkshop2PlmOutbox(env);
    const result = await processWorkshop2PlmOutboxBatch(5);
    expect(result.dispatched).toBe(0);
    expect(result.acked).toBe(0);
    const { listWorkshop2PlmOutboxMemoryForTests } =
      await import('@/lib/server/workshop2-plm-outbox');
    expect(listWorkshop2PlmOutboxMemoryForTests()[0]?.status).toBe('pending');
  });

  it('plm outbox auto-acks only when WORKSHOP2_PLM_AUTO_ACK=true and webhook configured', async () => {
    process.env.WORKSHOP2_PLM_AUTO_ACK = 'true';
    process.env.WORKSHOP2_PLM_WEBHOOK_URL = 'https://example.test/plm-hook';
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as typeof fetch;
    const env = mapWorkshop2DossierSavedToPlm({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02b',
      dossier: emptyWorkshop2DossierPhase1(),
      version: 1,
    });
    await enqueueWorkshop2PlmOutbox(env);
    const result = await processWorkshop2PlmOutboxBatch(5);
    expect(result.acked).toBe(1);
    delete process.env.WORKSHOP2_PLM_AUTO_ACK;
    delete process.env.WORKSHOP2_PLM_WEBHOOK_URL;
  });

  it('plm outbox ack by deliveryId', async () => {
    process.env.WORKSHOP2_PLM_AUTO_ACK = 'false';
    process.env.WORKSHOP2_PLM_WEBHOOK_URL = 'https://example.test/plm-hook';
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as typeof fetch;
    const env = mapWorkshop2DossierSavedToPlm({
      collectionId: 'c',
      articleId: 'a',
      dossier: emptyWorkshop2DossierPhase1(),
      version: 1,
    });
    await enqueueWorkshop2PlmOutbox(env);
    await processWorkshop2PlmOutboxBatch(1);
    const { listWorkshop2PlmOutboxMemoryForTests } =
      await import('@/lib/server/workshop2-plm-outbox');
    const row = listWorkshop2PlmOutboxMemoryForTests()[0];
    expect(row?.status).toBe('sent');
    expect(row?.deliveryId).toBeTruthy();
    const ack = await ackWorkshop2PlmOutboxDelivery({ deliveryId: row!.deliveryId! });
    expect(ack.ok).toBe(true);
    expect(ack.updated).toBe(1);
    delete process.env.WORKSHOP2_PLM_AUTO_ACK;
    delete process.env.WORKSHOP2_PLM_WEBHOOK_URL;
  });

  it('factory erp without base url is not_configured', async () => {
    expect(resolveWorkshop2FactoryErpBaseUrl()).toBeUndefined();
    const state = await runWorkshop2FactoryErpSync({
      collectionId: 'SS27',
      articleId: 'art-1',
    });
    expect(state.syncStatus).toBe('not_configured');
  });

  it('factory erp configured state when URL set but not synced', async () => {
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:4099';
    const state = await getWorkshop2FactoryErpState({
      collectionId: 'SS27',
      articleId: 'art-1',
    });
    expect(state.syncStatus).toBe('configured');
    expect(state.baseUrlConfigured).toBe(true);
  });

  it('sanitize factory erp downgrades synced without erpOrderId', () => {
    const state = sanitizeWorkshop2FactoryErpState({
      collectionId: 'SS27',
      articleId: 'a1',
      syncStatus: 'synced',
      baseUrlConfigured: true,
      baseUrl: 'http://127.0.0.1:4099',
    });
    expect(state.syncStatus).toBe('configured');
    expect(state.lastError).toBe('erp_missing_order_id');
  });

  it('resolveErpOrderIdFromResponse prefers erpOrderId', () => {
    expect(resolveErpOrderIdFromResponse({ erpOrderId: 'ERP-1', id: 'x', externalId: 'y' })).toBe(
      'ERP-1'
    );
  });

  it('factory erp sync POST returns erpOrderId (style-level when no PO)', async () => {
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:4099';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ erpOrderId: 'ERP-MOCK-001' }),
    }) as unknown as typeof fetch;

    const state = await runWorkshop2FactoryErpSync({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sku: 'SKU-1',
    });
    expect(state.syncStatus).toBe('synced');
    expect(state.erpOrderId).toBe('ERP-MOCK-001');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:4099/purchase-orders',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('factory erp sync with PO uses purchase order erpOrderId', async () => {
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:4099';
    await createWorkshop2PurchaseOrder({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      qty: 100,
      status: 'draft',
    });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ erpOrderId: 'ERP-PO-777' }),
    }) as unknown as typeof fetch;

    const state = await runWorkshop2FactoryErpSync({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(state.syncStatus).toBe('synced');
    expect(state.erpOrderId).toBe('ERP-PO-777');
  });

  it('inspector report persists checked items in memory', async () => {
    await putWorkshop2InspectorReport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-inspector-1',
      checkedItemIds: ['visual_sketch', 'aql_sample'],
    });
    const report = await getWorkshop2InspectorReport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-inspector-1',
    });
    expect(report?.checkedItemIds).toEqual(['visual_sketch', 'aql_sample']);
  });

  it('dossier save enqueues PLM outbox row (pending)', async () => {
    notifyWorkshop2PlmOnDossierSaved({
      collectionId: 'SS27',
      articleId: 'plm-save-1',
      dossier: emptyWorkshop2DossierPhase1(),
      version: 2,
    });
    await new Promise((r) => setTimeout(r, 0));
    const { listWorkshop2PlmOutboxMemoryForTests } =
      await import('@/lib/server/workshop2-plm-outbox');
    const rows = listWorkshop2PlmOutboxMemoryForTests();
    expect(rows.some((r) => r.eventType && r.status === 'pending')).toBe(true);
  });

  it('logistics in_transit keys for hub badge', async () => {
    await upsertWorkshop2LogisticsShipment({
      collectionId: 'SS27',
      articleId: 'hub-log-1',
      sampleOrderId: 'ord-hub',
      status: 'in_transit',
    });
    const keys = await listWorkshop2LogisticsInTransitArticleKeys();
    expect(keys).toContain('SS27::hub-log-1');
  });

  it('logistics journal appends on step update', async () => {
    await upsertWorkshop2LogisticsShipment({
      collectionId: 'SS27',
      articleId: 'step-journal',
      sampleOrderId: 'ord-step',
      currentStep: 'factory',
    });
    const mid = await upsertWorkshop2LogisticsShipment({
      collectionId: 'SS27',
      articleId: 'step-journal',
      sampleOrderId: 'ord-step',
      currentStep: 'transit',
    });
    expect('error' in mid).toBe(false);
    if ('error' in mid) return;
    expect(mid.journal.length).toBeGreaterThanOrEqual(2);
    expect(mid.journal.some((e) => e.stepId === 'transit')).toBe(true);
  });

  it('logistics shipment requires sample order id', async () => {
    const missing = await upsertWorkshop2LogisticsShipment({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });
    expect(missing).toEqual({ error: 'sample_order_id_required' });

    await upsertWorkshop2LogisticsShipment({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-1',
      trackingNumber: 'TRK-001',
    });
    const list = await listWorkshop2LogisticsShipments({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });
    expect(list.length).toBe(1);
    expect(list[0]?.sampleOrderId).toBe('ord-1');
    expect(list[0]?.trackingNumber).toBe('TRK-001');
  });

  it('nesting factory export links sample order', () => {
    const doc = buildWorkshop2NestingFactoryExport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'order-nest-1',
      nesting: { fabricWidthCm: 150, efficiencyPct: 82 },
      includeSimulation: true,
    });
    expect(doc.format).toBe('workshop2-nesting-factory-v1');
    expect(doc.sampleOrderId).toBe('order-nest-1');
    expect(doc.simulation?.labelRu).toContain('Симуляция');
  });

  it('nesting simulation stub without external API', async () => {
    const result = await callWorkshop2NestingSimulationStub({
      collectionId: 'SS27',
      articleId: 'a',
      sampleOrderId: 'o1',
      nesting: { fabricWidthCm: 140 },
    });
    expect(result.ok).toBe(true);
    expect(result.source).toBe('local_heuristic');
    expect(result.simulation?.estimatedYieldPct).toBeGreaterThan(0);
  });

  it('showroom campaign persists per article', async () => {
    await putWorkshop2ShowroomCampaign({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      published: true,
      wholesalePrice: 45,
      moq: 50,
    });
    const c = await getWorkshop2ShowroomCampaign({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });
    expect(c?.published).toBe(true);
    expect(c?.wholesalePrice).toBe(45);
  });

  it('risk prediction from dossier BOM', () => {
    const dossier = {
      ...emptyWorkshop2DossierPhase1(),
      productionModel: {
        version: 1 as const,
        nodes: [],
        materialLines: [
          {
            id: 'm1',
            nodeId: 'n1',
            role: 'shell' as const,
            materialName: 'Хлопок',
            consumption: 2,
          },
        ],
        trimLines: [],
        operations: [],
        measurements: [],
      },
    };
    const snap = computeWorkshop2RiskFromDossier(dossier);
    expect(snap.source).toBe('dossier_bom');
    expect(snap.riskLevel).toBeDefined();
    expect(snap.formulaInputs?.some((f) => f.key === 'predicted_days')).toBe(true);
  });
});
