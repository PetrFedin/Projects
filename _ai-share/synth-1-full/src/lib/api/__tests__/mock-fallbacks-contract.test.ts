/**
 * Контрактные проверки офлайн-фолбеков для fetchFromApi (USE_FASTAPI=false / API down).
 * При смене DTO в UI — обновите соответствующий ключ в mock-fallbacks.ts и этот тест.
 */
import { getMockFallback, MOCK_FALLBACKS } from '../mock-fallbacks';

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

describe('mock-fallbacks contract', () => {
  it('exposes every MOCK_FALLBACKS key (non-regression: empty map)', () => {
    expect(Object.keys(MOCK_FALLBACKS).length).toBeGreaterThan(0);
  });

  it('profile/me: session identity fields', () => {
    const fb = getMockFallback('/profile/me');
    expect(fb).not.toBeNull();
    expect(isRecord(fb)).toBe(true);
    expect(typeof fb.id).toBe('string');
    expect(typeof fb.name).toBe('string');
    expect(typeof fb.role).toBe('string');
    expect(typeof fb.brand_id).toBe('string');
  });

  it('dashboard: data.kpis for retailer KPI strip', () => {
    const fb = getMockFallback('/dashboard');
    expect(isRecord(fb)).toBe(true);
    const data = fb.data;
    expect(isRecord(data)).toBe(true);
    const kpis = data.kpis;
    expect(isRecord(kpis)).toBe(true);
    expect(typeof kpis.my_orders).toBe('number');
    expect(typeof kpis.health_score).toBe('number');
  });

  it('brand profile prefix: brand + legal shell', () => {
    const fb = getMockFallback('/brand/profile/org-test');
    expect(isRecord(fb)).toBe(true);
    expect(isRecord(fb.brand)).toBe(true);
    expect(typeof (fb.brand as Record<string, unknown>).name).toBe('string');
    expect(isRecord(fb.legal)).toBe(true);
  });

  it('brand dashboard prefix: aggregates + attentionAlerts', () => {
    const fb = getMockFallback('/brand/dashboard/org-test');
    expect(isRecord(fb)).toBe(true);
    expect(typeof fb.retailersCount).toBe('number');
    expect(isRecord(fb.attentionAlerts)).toBe(true);
    const aa = fb.attentionAlerts as Record<string, unknown>;
    expect(Array.isArray(aa.certificates)).toBe(true);
    expect(Array.isArray(aa.profile)).toBe(true);
  });

  it('brand integrations status prefix: known slots', () => {
    const fb = getMockFallback('/brand/integrations/status/org-test');
    expect(isRecord(fb)).toBe(true);
    expect(isRecord(fb.c1c)).toBe(true);
    expect(isRecord(fb.ozon)).toBe(true);
  });

  it('organization health: null sentinel (caller handles empty)', () => {
    expect(getMockFallback('/organization/health/org-test')).toBeNull();
  });

  it('brand attention-dismiss: data.v envelope', () => {
    const fb = getMockFallback('/brand/attention-dismiss/org-test');
    expect(isRecord(fb)).toBe(true);
    const data = fb.data;
    expect(isRecord(data)).toBe(true);
    expect(data.v).toBe(1);
    expect(Array.isArray(data.certificateIds)).toBe(true);
  });

  it('prefix match: analytics/feedback with brand suffix', () => {
    const fb = getMockFallback('/analytics/feedback/brand-1');
    expect(Array.isArray(fb)).toBe(true);
    const row = (fb as unknown[])[0];
    expect(isRecord(row)).toBe(true);
    expect(typeof row.rating).toBe('number');
  });

  it('unknown path returns null', () => {
    expect(getMockFallback('/api/v1/no-mock-here')).toBeNull();
  });
});
