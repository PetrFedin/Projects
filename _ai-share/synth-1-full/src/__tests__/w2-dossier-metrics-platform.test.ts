/** @jest-environment node */
/**
 * Дымовые проверки платформы метрик W2 (stamp, архивный fingerprint, prod loose).
 */
import { buildW2MetricsArchivePayload } from '@/lib/server/workshop2-dossier-metrics-archive';
import { verifyW2DossierMetricsPostRequest } from '@/lib/server/workshop2-dossier-metrics-post-guard';
import {
  isW2LooseStampAllowedInThisRuntime,
  signW2MetricsStamp,
  verifyW2MetricsStamp,
} from '@/lib/server/workshop2-dossier-metrics-stamp';
import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';

const row = (capturedAt: string): Workshop2DossierMetricsPayload => ({
  capturedAt,
  collectionId: 'c1',
  articleId: 'a1',
  tabOpenMinutes: 1,
  persistSuccessCount: 0,
  abandonCount: 0,
  contour: {},
  source: 'workshop2_phase1_dossier',
});

describe('W2 metrics stamp', () => {
  const secret = 'test-secret-key-for-hmac-only';

  it('sign and verify roundtrip', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = signW2MetricsStamp({ uid: 'u1', orgId: 'o1', exp }, secret);
    const v = verifyW2MetricsStamp(token, secret);
    expect(v).toEqual({ uid: 'u1', orgId: 'o1', exp });
  });

  it('rejects wrong secret', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = signW2MetricsStamp({ uid: 'u1', orgId: '', exp }, secret);
    expect(verifyW2MetricsStamp(token, 'other')).toBeNull();
  });
});

describe('W2 archive fingerprint', () => {
  it('is stable when row order differs', () => {
    const a = buildW2MetricsArchivePayload([
      row('2025-01-02T00:00:00.000Z'),
      row('2025-01-01T00:00:00.000Z'),
    ]);
    const b = buildW2MetricsArchivePayload([
      row('2025-01-01T00:00:00.000Z'),
      row('2025-01-02T00:00:00.000Z'),
    ]);
    expect(a.fingerprint).toBe(b.fingerprint);
  });
});

describe('W2 loose stamp production guard', () => {
  const prevNodeEnv = process.env.NODE_ENV;
  const prevLoose = process.env.W2_DOSSIER_METRICS_LOOSE_STAMP;
  const prevAllow = process.env.W2_DOSSIER_METRICS_LOOSE_STAMP_ALLOW_PRODUCTION;

  afterEach(() => {
    process.env.NODE_ENV = prevNodeEnv;
    process.env.W2_DOSSIER_METRICS_LOOSE_STAMP = prevLoose;
    process.env.W2_DOSSIER_METRICS_LOOSE_STAMP_ALLOW_PRODUCTION = prevAllow;
  });

  it('disallows loose in production without ALLOW_PRODUCTION', () => {
    process.env.NODE_ENV = 'production';
    process.env.W2_DOSSIER_METRICS_LOOSE_STAMP = '1';
    delete process.env.W2_DOSSIER_METRICS_LOOSE_STAMP_ALLOW_PRODUCTION;
    expect(isW2LooseStampAllowedInThisRuntime()).toBe(false);
  });

  it('allows loose in production with ALLOW_PRODUCTION', () => {
    process.env.NODE_ENV = 'production';
    process.env.W2_DOSSIER_METRICS_LOOSE_STAMP = '1';
    process.env.W2_DOSSIER_METRICS_LOOSE_STAMP_ALLOW_PRODUCTION = '1';
    expect(isW2LooseStampAllowedInThisRuntime()).toBe(true);
  });
});

describe('W2 POST guard', () => {
  const prevSecret = process.env.W2_DOSSIER_METRICS_POST_SECRET;

  afterEach(() => {
    process.env.W2_DOSSIER_METRICS_POST_SECRET = prevSecret;
  });

  it('allows when post secret unset', () => {
    delete process.env.W2_DOSSIER_METRICS_POST_SECRET;
    const req = new Request('http://localhost/api', { method: 'POST' });
    expect(verifyW2DossierMetricsPostRequest(req).ok).toBe(true);
  });

  it('rejects when post secret set and header missing', () => {
    process.env.W2_DOSSIER_METRICS_POST_SECRET = 's3cr3t';
    const req = new Request('http://localhost/api', { method: 'POST' });
    const r = verifyW2DossierMetricsPostRequest(req);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(401);
  });

  it('accepts X-W2-Metrics-Write-Key', () => {
    process.env.W2_DOSSIER_METRICS_POST_SECRET = 's3cr3t';
    const req = new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'X-W2-Metrics-Write-Key': 's3cr3t' },
    });
    expect(verifyW2DossierMetricsPostRequest(req).ok).toBe(true);
  });
});
