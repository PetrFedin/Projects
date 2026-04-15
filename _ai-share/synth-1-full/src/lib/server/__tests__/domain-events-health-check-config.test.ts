import { getDomainEventsHealthCheckConfig } from '@/lib/server/domain-events-health-check-config';

describe('getDomainEventsHealthCheckConfig', () => {
  it('returns skip mode when skip flag is enabled', () => {
    const cfg = getDomainEventsHealthCheckConfig({
      SKIP_DOMAIN_EVENTS_HEALTH_CONTRACT_CHECK: '1',
    });
    expect(cfg).toEqual({ kind: 'skip', reason: 'flag' });
  });

  it('returns skip mode when URL is missing unless strict mode is enabled', () => {
    const cfg = getDomainEventsHealthCheckConfig({});
    expect(cfg).toEqual({ kind: 'skip', reason: 'no_url' });
  });

  it('returns error mode when URL is missing in strict mode', () => {
    const cfg = getDomainEventsHealthCheckConfig({
      DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT: '1',
    });
    expect(cfg.kind).toBe('error');
    if (cfg.kind === 'error') {
      expect(cfg.message).toContain('DOMAIN_EVENTS_HEALTH_URL');
      expect(cfg.message).toContain('STRICT');
    }
  });

  it('returns normalized runtime config for valid env', () => {
    const cfg = getDomainEventsHealthCheckConfig({
      DOMAIN_EVENTS_HEALTH_URL: '  https://ops.example/health  ',
      DOMAIN_EVENTS_HEALTH_TIMEOUT_MS: '15000',
      DOMAIN_EVENTS_HEALTH_SECRET: '  sec  ',
    });
    expect(cfg).toEqual({
      kind: 'ok',
      url: 'https://ops.example/health',
      timeoutMs: 15000,
      secret: 'sec',
    });
  });

  it('falls back to default timeout when invalid value is provided', () => {
    const cfg = getDomainEventsHealthCheckConfig({
      DOMAIN_EVENTS_HEALTH_URL: 'https://ops.example/health',
      DOMAIN_EVENTS_HEALTH_TIMEOUT_MS: 'oops',
    });
    expect(cfg.kind).toBe('ok');
    if (cfg.kind === 'ok') {
      expect(cfg.timeoutMs).toBe(10000);
      expect(cfg.secret).toBeNull();
    }
  });
});
