/**
 * @jest-environment node
 */
import { PATCH } from '@/app/api/shop/b2b/orders/[id]/status/route';
import {
  clearWorkshop2B2bOrdersMemoryForTests,
  putWorkshop2B2bOrder,
} from '@/lib/server/workshop2-b2b-orders-repository';

describe('PATCH /api/shop/b2b/orders/[id]/status', () => {
  beforeEach(() => {
    clearWorkshop2B2bOrdersMemoryForTests();
  });

  it('returns 404 when order missing', async () => {
    const req = new Request('http://localhost/api/shop/b2b/orders/B2B-MISSING/status', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'submitted' }),
    });
    const res = await PATCH(req as never, { params: Promise.resolve({ id: 'B2B-MISSING' }) });
    expect(res.status).toBe(404);
  });

  it('blocks shop from confirming order (brand-only status)', async () => {
    await putWorkshop2B2bOrder({
      id: 'B2B-T-SHOP',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      buyerId: 'shop1',
      status: 'submitted',
      tier: 'standard',
      totalRub: 1000,
      lines: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const req = new Request('http://localhost/api/shop/b2b/orders/B2B-T-SHOP/status', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' }),
    });
    const res = await PATCH(req as never, { params: Promise.resolve({ id: 'B2B-T-SHOP' }) });
    expect(res.status).toBe(409);
    const json = (await res.json()) as { code?: string };
    expect(json.code).toBe('brand_only_status');
  });

  it('allows shop submitted transition on draft order', async () => {
    await putWorkshop2B2bOrder({
      id: 'B2B-T-SUBMIT',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      buyerId: 'shop1',
      status: 'draft',
      tier: 'standard',
      totalRub: 500,
      lines: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const req = new Request('http://localhost/api/shop/b2b/orders/B2B-T-SUBMIT/status', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'submitted' }),
    });
    const res = await PATCH(req as never, { params: Promise.resolve({ id: 'B2B-T-SUBMIT' }) });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { order?: { status: string } };
    expect(json.order?.status).toBe('submitted');
  });
});
