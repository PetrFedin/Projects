import type { NextRequest } from 'next/server';
import {
  isW2TechPackBrowserSameOriginRequest,
  verifyW2TechPackReadRequest,
  verifyW2TechPackWriteRequest,
  w2TechPackAllowSameOriginBrowser,
} from '@/lib/server/w2-tech-pack-api-auth';

const env = { ...process.env };

function mockNextRequest(headers: Record<string, string>): NextRequest {
  return {
    headers: {
      get: (k: string) => {
        const lower = k.toLowerCase();
        return headers[lower] ?? headers[k] ?? null;
      },
    },
  } as unknown as NextRequest;
}

describe('w2-tech-pack-api-auth', () => {
  afterEach(() => {
    process.env = { ...env };
  });

  it('write: same-origin passes when flag and secret are set (prod cabinet without public key)', () => {
    process.env.W2_TECHPACK_API_SECRET = 'pilot-secret';
    process.env.W2_TECHPACK_AUTH_DISABLED = undefined;
    process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER = '1';
    process.env.NODE_ENV = 'production';
    const req = mockNextRequest({ 'sec-fetch-site': 'same-origin' });
    expect(verifyW2TechPackWriteRequest(req).ok).toBe(true);
  });

  it('write: same-origin does not pass without same-origin flag when secret is set', () => {
    process.env.W2_TECHPACK_API_SECRET = 'pilot-secret';
    process.env.W2_TECHPACK_AUTH_DISABLED = undefined;
    delete process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER;
    process.env.NODE_ENV = 'production';
    const req = mockNextRequest({ 'sec-fetch-site': 'same-origin' });
    expect(verifyW2TechPackWriteRequest(req).ok).toBe(false);
  });

  it('write: correct bearer still passes', () => {
    process.env.W2_TECHPACK_API_SECRET = 'pilot-secret';
    delete process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER;
    process.env.NODE_ENV = 'production';
    const req = mockNextRequest({ authorization: 'Bearer pilot-secret' });
    expect(verifyW2TechPackWriteRequest(req).ok).toBe(true);
  });

  it('read: does not use same-origin bypass (factory uses bearer)', () => {
    process.env.W2_TECHPACK_API_SECRET = 'pilot-secret';
    process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER = '1';
    process.env.NODE_ENV = 'production';
    const req = mockNextRequest({ 'sec-fetch-site': 'same-origin' });
    expect(verifyW2TechPackReadRequest(req).ok).toBe(false);
  });

  it('isW2TechPackBrowserSameOriginRequest is true for sec-fetch-site', () => {
    expect(isW2TechPackBrowserSameOriginRequest(mockNextRequest({ 'sec-fetch-site': 'same-origin' }))).toBe(
      true
    );
    expect(isW2TechPackBrowserSameOriginRequest(mockNextRequest({}))).toBe(false);
  });

  it('w2TechPackAllowSameOriginBrowser reads env', () => {
    delete process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER;
    expect(w2TechPackAllowSameOriginBrowser()).toBe(false);
    process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER = 'true';
    expect(w2TechPackAllowSameOriginBrowser()).toBe(true);
  });
});
