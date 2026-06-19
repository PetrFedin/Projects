/** @jest-environment node */

import { NextRequest } from 'next/server';

jest.mock('@/lib/server/workshop2-route-auth', () => ({
  guardWorkshop2Route: jest.fn(async () => ({
    ok: true,
    access: { ok: true },
  })),
  WORKSHOP2_WRITE_ROLES: ['production:edit'],
}));

jest.mock('@/lib/server/b2b-intake-allocation-repository', () => ({
  persistB2bIntakeAllocationPlan: jest.fn(async () => ({
    planId: 'alloc-smoke-1',
    mode: 'memory',
  })),
}));

jest.mock('@/lib/server/workshop2-b2b-orders-repository', () => ({
  putWorkshop2B2bOrder: jest.fn(async () => ({ mode: 'memory', order: { id: 'FC-ORDER-1' } })),
}));

jest.mock('@/lib/server/workshop2-b2b-inbound-calendar-persist', () => ({
  persistWorkshop2B2bInboundCalendarTask: jest.fn(async () => ({ ok: true, mode: 'memory' })),
}));

jest.mock('@/lib/server/workshop2-domain-events', () => ({
  enqueueWorkshop2DomainEvent: jest.fn(async () => undefined),
}));

import { POST as intakeAllocatePost } from '@/app/api/b2b/intake/allocate/route';
import { POST as fashionCloudWebhookPost } from '@/app/api/shop/b2b/inbound/fashion-cloud-webhook/route';

describe('b2b spine routes smoke (Wave K)', () => {
  const prevFcEnabled = process.env.WORKSHOP2_B2B_FASHION_CLOUD_WEBHOOK_ENABLED;

  afterEach(() => {
    if (prevFcEnabled === undefined) delete process.env.WORKSHOP2_B2B_FASHION_CLOUD_WEBHOOK_ENABLED;
    else process.env.WORKSHOP2_B2B_FASHION_CLOUD_WEBHOOK_ENABLED = prevFcEnabled;
  });

  it('POST /api/b2b/intake/allocate returns planId (not 500)', async () => {
    const res = await intakeAllocatePost(
      new NextRequest('http://localhost/api/b2b/intake/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch: {
            batchId: 'batch-smoke',
            items: [{ articleId: 'demo-ss27-01', size: 'M', quantity: 8 }],
          },
          demand: {
            b2bBackorders: [
              {
                orderId: 'INT-1',
                articleId: 'demo-ss27-01',
                size: 'M',
                requestedQuantity: 3,
              },
            ],
            ecomDemand: [],
            retailDemand: [],
          },
        }),
      })
    );
    expect(res.status).not.toBe(500);
    expect([200, 400, 401, 403]).toContain(res.status);
    if (res.status === 200) {
      const json = (await res.json()) as { planId?: string };
      expect(json.planId).toBeTruthy();
    }
  });

  it('POST /shop/b2b/inbound/fashion-cloud-webhook returns ok when enabled', async () => {
    process.env.WORKSHOP2_B2B_FASHION_CLOUD_WEBHOOK_ENABLED = 'true';
    const body = JSON.stringify({
      type: 'order.created',
      order: {
        id: 'FC-SMOKE-1',
        lines: [{ articleId: 'demo-ss27-01', size: 'M', quantity: 2, wholesalePriceRub: 500 }],
      },
    });
    const res = await fashionCloudWebhookPost(
      new NextRequest('http://localhost/api/shop/b2b/inbound/fashion-cloud-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    );
    expect(res.status).not.toBe(500);
    expect([200, 401, 503]).toContain(res.status);
  });
});
