/**
 * Wave L — ERP live POST smoke with mocked Response (BASE_URL set → real fetch path).
 */
import {
  clearWorkshop2FactoryErpMemoryForTests,
  resolveErpOrderIdFromResponse,
  runWorkshop2FactoryErpSync,
} from '@/lib/server/workshop2-factory-erp-repository';
import { evaluateWorkshop2LiveErpPostResponse } from '@/lib/production/workshop2-live-erp-e2e-contract';

describe('workshop2 ERP live smoke (mocked Response)', () => {
  beforeEach(() => {
    clearWorkshop2FactoryErpMemoryForTests();
    delete process.env.WORKSHOP2_FACTORY_ERP_BASE_URL;
  });

  it('resolveErpOrderIdFromResponse picks erpOrderId | externalId | id', () => {
    expect(resolveErpOrderIdFromResponse({ erpOrderId: ' ERP-1 ' })).toBe('ERP-1');
    expect(resolveErpOrderIdFromResponse({ externalId: 'ext-2' })).toBe('ext-2');
    expect(resolveErpOrderIdFromResponse({ id: 'id-3' })).toBe('id-3');
  });

  it('evaluateWorkshop2LiveErpPostResponse fail-closed without erpOrderId on 2xx', () => {
    const out = evaluateWorkshop2LiveErpPostResponse({
      httpStatus: 200,
      json: { status: 'ok' },
    });
    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.error).toBe('erp_missing_order_id');
  });

  it('runWorkshop2FactoryErpSync: style-level POST when no PO — mocked fetch returns erpOrderId', async () => {
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:18766';

    const originalFetch = global.fetch;
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      expect(url).toContain('/purchase-orders');
      return {
        ok: true,
        status: 200,
        json: async () => ({ erpOrderId: 'ERP-LIVE-MOCK-001' }),
      } as Response;
    });

    const state = await runWorkshop2FactoryErpSync({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      sku: 'SKU-SS27-01',
    });

    global.fetch = originalFetch;

    expect(state.syncStatus).toBe('synced');
    expect(state.erpOrderId).toBe('ERP-LIVE-MOCK-001');
    expect(state.baseUrlConfigured).toBe(true);
    expect(state.payloadPreview?.transport).toBe('purchase_orders_post');
  });

  it('runWorkshop2FactoryErpSync: 503 not_configured when BASE_URL unset', async () => {
    const state = await runWorkshop2FactoryErpSync({
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(state.syncStatus).toBe('not_configured');
    expect(state.baseUrlConfigured).toBe(false);
  });

  it('runWorkshop2FactoryErpSync: HTTP 502 path when ERP returns non-2xx', async () => {
    process.env.WORKSHOP2_FACTORY_ERP_BASE_URL = 'http://127.0.0.1:18766';

    const originalFetch = global.fetch;
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 503,
      json: async () => ({ error: 'unavailable' }),
    })) as typeof fetch;

    const state = await runWorkshop2FactoryErpSync({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
    });

    global.fetch = originalFetch;

    expect(state.syncStatus).toBe('error');
    expect(state.lastError).toBe('erp_http_503');
  });
});
