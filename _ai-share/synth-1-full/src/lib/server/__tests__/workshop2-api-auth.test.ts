/** @jest-environment node */

import { NextRequest } from 'next/server';
import {
  assertWorkshop2ApiAccess,
  workshop2DevBypassAuthEnabled,
} from '@/lib/server/workshop2-api-auth';

jest.mock('@/lib/server/workshop2-platform-session', () => ({
  resolveWorkshop2PlatformSession: jest.fn(),
}));

import { resolveWorkshop2PlatformSession } from '@/lib/server/workshop2-platform-session';

const mockResolveSession = resolveWorkshop2PlatformSession as jest.MockedFunction<
  typeof resolveWorkshop2PlatformSession
>;

function mockReq(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost/api/workshop2/health', {
    headers,
  });
}

describe('workshop2-api-auth', () => {
  const prevEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockResolveSession.mockReset();
    process.env = { ...prevEnv, NODE_ENV: 'test' };
    delete process.env.WORKSHOP2_DEV_BYPASS_AUTH;
    delete process.env.WORKSHOP2_API_SECRET;
    delete process.env.WORKSHOP2_TRUST_ACTOR_HEADERS;
  });

  afterAll(() => {
    process.env = prevEnv;
  });

  it('dev bypass when WORKSHOP2_DEV_BYPASS_AUTH=true', () => {
    process.env.WORKSHOP2_DEV_BYPASS_AUTH = 'true';
    expect(workshop2DevBypassAuthEnabled()).toBe(true);
    return assertWorkshop2ApiAccess(mockReq()).then((a) => {
      expect(a.ok).toBe(true);
      if (a.ok) expect(a.mode).toBe('bypass');
    });
  });

  it('rejects without actor in test env', async () => {
    const a = await assertWorkshop2ApiAccess(mockReq());
    expect(a.ok).toBe(false);
    if (!a.ok) expect(a.status).toBe(401);
  });

  it('accepts Bearer JWT session via platform profile', async () => {
    mockResolveSession.mockResolvedValue({
      uid: 'session-user-1',
      displayName: 'Session User',
      organizationId: 'org-w2',
      platformRoles: ['brand_manager'],
      workshop2Roles: ['production:edit', 'w2:audit_read'],
    });
    const a = await assertWorkshop2ApiAccess(mockReq({ authorization: 'Bearer test-jwt-token' }));
    expect(a.ok).toBe(true);
    if (a.ok) {
      expect(a.mode).toBe('session');
      expect(a.actor?.actorId).toBe('session-user-1');
      expect(a.actor?.roles).toContain('production:edit');
    }
  });

  it('accepts x-w2-actor headers when trust enabled', async () => {
    process.env.WORKSHOP2_TRUST_ACTOR_HEADERS = '1';
    const a = await assertWorkshop2ApiAccess(
      mockReq({
        'x-w2-actor-id': 'u1',
        'x-w2-actor-label': 'Test User',
        'x-w2-actor-roles': 'production:edit',
      })
    );
    expect(a.ok).toBe(true);
    if (a.ok) {
      expect(a.mode).toBe('actor');
      expect(a.actor?.actorId).toBe('u1');
    }
  });

  it('rejects x-w2-actor-only in production without trust', async () => {
    process.env.NODE_ENV = 'production';
    const a = await assertWorkshop2ApiAccess(
      mockReq({
        'x-w2-actor-id': 'u1',
        'x-w2-actor-label': 'Test User',
        'x-w2-actor-roles': 'production:edit',
      })
    );
    expect(a.ok).toBe(false);
    if (!a.ok) expect(a.status).toBe(401);
  });

  it('dev bypass disabled in production even when WORKSHOP2_DEV_BYPASS_AUTH=true', async () => {
    process.env.NODE_ENV = 'production';
    process.env.WORKSHOP2_DEV_BYPASS_AUTH = 'true';
    expect(workshop2DevBypassAuthEnabled()).toBe(false);
    const a = await assertWorkshop2ApiAccess(mockReq());
    expect(a.ok).toBe(false);
    if (!a.ok) expect(a.status).toBe(401);
  });

  it('accepts session from cookie syntha_access_token', async () => {
    mockResolveSession.mockResolvedValue({
      uid: 'cookie-user',
      displayName: 'Cookie User',
      organizationId: 'org-w2',
      platformRoles: ['brand_manager'],
      workshop2Roles: ['production:edit'],
    });
    const req = new NextRequest('http://localhost/api/workshop2/health', {
      headers: { cookie: 'syntha_access_token=cookie-jwt' },
    });
    const a = await assertWorkshop2ApiAccess(req);
    expect(a.ok).toBe(true);
    if (a.ok) {
      expect(a.mode).toBe('session');
      expect(a.actor?.actorId).toBe('cookie-user');
    }
  });
});
