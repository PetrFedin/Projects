/** @jest-environment node */
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/lib/server/workshop2-route-auth', () => ({
  guardWorkshop2Route: jest.fn(async () => ({ ok: true, actor: { actorLabel: 'brand-test' } })),
  WORKSHOP2_WRITE_ROLES: ['production:edit'],
}));

jest.mock('@/lib/production/workshop2-b2b-wave23-parity', () => ({
  createWorkshop2B2bBuyerInviteToken: jest.fn(() => ({
    token: 'invite-token',
    acceptPath: '/shop/b2b/accept-invite?token=invite-token',
  })),
}));

import { POST } from '../route';
import { createWorkshop2B2bBuyerInviteToken } from '@/lib/production/workshop2-b2b-wave23-parity';
import { guardWorkshop2Route } from '@/lib/server/workshop2-route-auth';

describe('POST /api/brand/b2b/invites', () => {
  it('requires guard and mints invite token', async () => {
    const req = new NextRequest('http://localhost/api/brand/b2b/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerEmail: 'buyer@demo.ru', tier: 'standard' }),
    });

    const res = await POST(req);
    const json = (await res.json()) as { ok?: boolean; token?: string };

    expect(guardWorkshop2Route).toHaveBeenCalled();
    expect(createWorkshop2B2bBuyerInviteToken).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.token).toBe('invite-token');
  });

  it('returns 401 when guard rejects', async () => {
    (guardWorkshop2Route as jest.Mock).mockResolvedValueOnce(
      NextResponse.json({ ok: false }, { status: 401 })
    );

    const req = new NextRequest('http://localhost/api/brand/b2b/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerEmail: 'buyer@demo.ru' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
