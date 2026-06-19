/** @jest-environment node */

import { NextRequest } from 'next/server';

jest.mock('@/lib/server/shop-b2b-checkout-route-auth', () => ({
  guardShopB2bCheckoutRoute: jest.fn(async () => ({
    ok: true,
    mode: 'dev',
    buyerId: 'shop1',
  })),
}));

jest.mock('@/lib/server/workshop2-b2b-orders-repository', () => ({
  getWorkshop2B2bOrder: jest.fn(async () => null),
}));

jest.mock('@/lib/server/workshop2-b2b-invoice-repository', () => ({
  upsertWorkshop2B2bInvoiceForOrder: jest.fn(async () => ({ persisted: false })),
}));

import { GET } from '../route';

describe('GET /api/shop/b2b/orders/[id]/schet-offerta.pdf', () => {
  it('returns 404 when PG order missing (no demo fallback)', async () => {
    const res = await GET(
      new NextRequest('http://localhost/api/shop/b2b/orders/B2B-MISSING/schet-offerta.pdf'),
      { params: Promise.resolve({ id: 'B2B-MISSING' }) }
    );
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBe('order_not_found');
  });
});
