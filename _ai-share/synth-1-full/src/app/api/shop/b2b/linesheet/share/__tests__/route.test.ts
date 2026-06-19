/** @jest-environment node */
import { NextRequest } from 'next/server';

jest.mock('@/lib/server/shop-b2b-checkout-route-auth', () => ({
  guardShopB2bCheckoutRoute: jest.fn(async () => ({
    ok: true,
    mode: 'dev',
    buyerId: 'shop1',
  })),
}));

jest.mock('@/lib/server/workshop2-b2b-wishlist-repository', () => ({
  issueWorkshop2B2bRepShareToken: jest.fn(async () => ({
    token: 'test-token',
    campaignId: 'SS27::demo-ss27-01',
    repId: 'rep-anna',
    createdAt: '2026-01-01T00:00:00.000Z',
    expiresAt: '2026-01-08T00:00:00.000Z',
  })),
}));

import { POST } from '../route';

describe('POST /api/shop/b2b/linesheet/share', () => {
  it('returns shareUrl for collectionId+articleId', async () => {
    const req = new NextRequest('http://localhost/api/shop/b2b/linesheet/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collectionId: 'SS27',
        articleId: 'demo-ss27-01',
        repId: 'rep-anna',
        email: 'buyer@demo.ru',
      }),
    });

    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; shareUrl?: string; messageRu?: string };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.shareUrl).toContain('test-token');
    expect(json.messageRu).toMatch(/journal PG/i);
  });

  it('returns 400 without campaign or collection pair', async () => {
    const req = new NextRequest('http://localhost/api/shop/b2b/linesheet/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repId: 'rep-anna' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
