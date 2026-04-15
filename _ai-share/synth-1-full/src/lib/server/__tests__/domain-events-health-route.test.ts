import {
  DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR,
  DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA,
  DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
  DOMAIN_EVENTS_HEALTH_REQUIRED_HEADER_KEYS,
  DOMAIN_EVENTS_HEALTH_REQUIRED_RESPONSE_KEYS,
  buildDomainEventsHealthResponseHeaders,
  buildDomainEventsHealthResponsePayload,
  evaluateDomainEventsHealth,
  parseAndValidateDomainEventsHealthResponse,
  validateDomainEventsHealthContract,
  validateDomainEventsHealthFetchResponse,
} from '@/lib/server/domain-events-health';

describe('GET /api/ops/domain-events/health', () => {
  it('returns stable contract keys for monitoring integrations', async () => {
    const bus = {
      dlqSize: 0,
      eventStoreSize: 25,
      circuitOpen: false,
      dedupeCacheSize: 3,
      subscriberEventTypeCount: 9,
      recentFailureCount: 0,
      lastFailureAt: null,
    } as const;
    const outbox = {
      total: 12,
      pending: 2,
      sent: 10,
      failed: 0,
    } as const;
    const health = evaluateDomainEventsHealth(bus, outbox);
    const body = buildDomainEventsHealthResponsePayload({
      health,
      bus,
      outbox,
      requestId: 'rid-1',
    });
    
    expect(body).toEqual(
      expect.objectContaining({
        contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
        ok: expect.any(Boolean),
        status: expect.any(String),
        summaryCode: expect.any(String),
        summary: expect.any(String),
        alerts: expect.any(Array),
        degradedReasons: expect.any(Array),
        recommendations: expect.any(Array),
        thresholds: expect.any(Object),
        bus: expect.any(Object),
        outbox: expect.any(Object),
        requestId: expect.any(String),
      })
    );
    expect(Object.keys(body).sort()).toEqual([...DOMAIN_EVENTS_HEALTH_REQUIRED_RESPONSE_KEYS].sort());
    expect(DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredResponseKeys).toEqual(
      DOMAIN_EVENTS_HEALTH_REQUIRED_RESPONSE_KEYS
    );
  });

  it('returns stable response headers for monitoring integrations', () => {
    const headers = buildDomainEventsHealthResponseHeaders('rid-headers-1');
    expect(headers).toEqual({
      'x-request-id': 'rid-headers-1',
      'x-domain-events-health-contract-version': DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
    });
    expect(Object.keys(headers).sort()).toEqual([...DOMAIN_EVENTS_HEALTH_REQUIRED_HEADER_KEYS].sort());
    expect(DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredHeaderKeys).toEqual(
      DOMAIN_EVENTS_HEALTH_REQUIRED_HEADER_KEYS
    );
    expect(DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.version).toBe(DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION);
  });

  it('validates payload + headers with a single contract helper', () => {
    const bus = {
      dlqSize: 0,
      eventStoreSize: 1,
      circuitOpen: false,
      dedupeCacheSize: 0,
      subscriberEventTypeCount: 1,
      recentFailureCount: 0,
      lastFailureAt: null,
    } as const;
    const outbox = {
      total: 1,
      pending: 0,
      sent: 1,
      failed: 0,
    } as const;
    const health = evaluateDomainEventsHealth(bus, outbox);
    const payload = buildDomainEventsHealthResponsePayload({
      health,
      bus,
      outbox,
      requestId: 'rid-validator-1',
    });
    const headers = buildDomainEventsHealthResponseHeaders('rid-validator-1');

    const valid = validateDomainEventsHealthContract({ payload, headers });
    expect(valid).toEqual({ ok: true, errors: [] });

    const broken = validateDomainEventsHealthContract({
      payload: { ...payload, contractVersion: 'v0' },
      headers: { ...headers, 'x-domain-events-health-contract-version': 'v0' },
    });
    expect(broken.ok).toBe(false);
    expect(broken.errors).toContain(
      DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadContractVersionMismatch
    );
    expect(broken.errors).toContain(
      DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerContractVersionMismatch
    );
  });

  it('reports stable error code for missing required headers', () => {
    const invalid = validateDomainEventsHealthContract({
      payload: {
        contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
        ok: true,
        status: 'ok',
        summaryCode: 'OK',
        summary: 'OK: domain events pipeline healthy.',
        alerts: [],
        degradedReasons: [],
        recommendations: [],
        thresholds: {
          pendingWarn: 100,
          pendingCritical: 500,
          dlqWarn: 1,
          dlqCritical: 10,
          failedWarn: 1,
          failedCritical: 10,
          recentFailureWarn: 1,
        },
        bus: {
          dlqSize: 0,
          eventStoreSize: 0,
          circuitOpen: false,
          dedupeCacheSize: 0,
          subscriberEventTypeCount: 0,
          recentFailureCount: 0,
          lastFailureAt: null,
        },
        outbox: { total: 0, pending: 0, sent: 0, failed: 0 },
        requestId: 'rid-missing-header',
      },
      headers: {},
    });
    expect(invalid.ok).toBe(false);
    expect(invalid.errors).toContain(`${DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerMissingPrefix}x-request-id`);
    expect(invalid.errors).toContain(
      `${DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerMissingPrefix}x-domain-events-health-contract-version`
    );
  });

  it('reports stable error code for invalid nested payload shape', () => {
    const invalid = validateDomainEventsHealthContract({
      payload: {
        contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
        ok: true,
        status: 'ok',
        summaryCode: 'OK',
        summary: 'OK: domain events pipeline healthy.',
        alerts: [],
        degradedReasons: [],
        recommendations: [],
        thresholds: {
          pendingWarn: 100,
          pendingCritical: 500,
          dlqWarn: 1,
          dlqCritical: 10,
          failedWarn: 1,
          failedCritical: 10,
          recentFailureWarn: '1',
        },
        bus: {
          dlqSize: 0,
          eventStoreSize: 0,
          circuitOpen: false,
          dedupeCacheSize: 0,
          subscriberEventTypeCount: 0,
          recentFailureCount: 0,
          lastFailureAt: null,
        },
        outbox: { total: 0, pending: 0, sent: 0, failed: 0 },
        requestId: 'rid-invalid-shape',
      } as unknown as Record<string, unknown>,
      headers: {
        'x-request-id': 'rid-invalid-shape',
        'x-domain-events-health-contract-version': DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
      },
    });
    expect(invalid.ok).toBe(false);
    expect(invalid.errors).toContain(DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadShapeMismatch);
  });

  it('accepts case-insensitive headers and trims values', () => {
    const payload = {
      contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
      ok: true,
      status: 'ok',
      summaryCode: 'OK',
      summary: 'OK: domain events pipeline healthy.',
      alerts: [],
      degradedReasons: [],
      recommendations: [],
      thresholds: {
        pendingWarn: 100,
        pendingCritical: 500,
        dlqWarn: 1,
        dlqCritical: 10,
        failedWarn: 1,
        failedCritical: 10,
        recentFailureWarn: 1,
      },
      bus: {
        dlqSize: 0,
        eventStoreSize: 0,
        circuitOpen: false,
        dedupeCacheSize: 0,
        subscriberEventTypeCount: 0,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      outbox: { total: 0, pending: 0, sent: 0, failed: 0 },
      requestId: 'rid-ci-headers',
    };
    const validation = validateDomainEventsHealthContract({
      payload,
      headers: {
        'X-Request-Id': 'rid-ci-headers',
        'X-Domain-Events-Health-Contract-Version': ` ${DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION} `,
      },
    });
    expect(validation).toEqual({ ok: true, errors: [] });
  });

  it('validates contract from fetch-like headers getter', () => {
    const payload = {
      contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
      ok: true,
      status: 'ok',
      summaryCode: 'OK',
      summary: 'OK: domain events pipeline healthy.',
      alerts: [],
      degradedReasons: [],
      recommendations: [],
      thresholds: {
        pendingWarn: 100,
        pendingCritical: 500,
        dlqWarn: 1,
        dlqCritical: 10,
        failedWarn: 1,
        failedCritical: 10,
        recentFailureWarn: 1,
      },
      bus: {
        dlqSize: 0,
        eventStoreSize: 0,
        circuitOpen: false,
        dedupeCacheSize: 0,
        subscriberEventTypeCount: 0,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      outbox: { total: 0, pending: 0, sent: 0, failed: 0 },
      requestId: 'rid-fetch-like',
    };
    const headerMap: Record<string, string> = {
      'x-request-id': 'rid-fetch-like',
      'x-domain-events-health-contract-version': DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
    };
    const headers = {
      get(name: string): string | null {
        const k = name.toLowerCase();
        return Object.prototype.hasOwnProperty.call(headerMap, k) ? headerMap[k] : null;
      },
    };

    const valid = validateDomainEventsHealthFetchResponse({ payload, headers });
    expect(valid).toEqual({ ok: true, errors: [] });

    const invalid = validateDomainEventsHealthFetchResponse({
      payload,
      headers: {
        get(name: string): string | null {
          if (name.toLowerCase() === 'x-request-id') return 'rid-fetch-like';
          return null;
        },
      },
    });
    expect(invalid.ok).toBe(false);
    expect(invalid.errors).toContain(
      `${DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerMissingPrefix}x-domain-events-health-contract-version`
    );
  });

  it('parses and validates response-like object end-to-end', async () => {
    const payload = {
      contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
      ok: true,
      status: 'ok',
      summaryCode: 'OK',
      summary: 'OK: domain events pipeline healthy.',
      alerts: [],
      degradedReasons: [],
      recommendations: [],
      thresholds: {
        pendingWarn: 100,
        pendingCritical: 500,
        dlqWarn: 1,
        dlqCritical: 10,
        failedWarn: 1,
        failedCritical: 10,
        recentFailureWarn: 1,
      },
      bus: {
        dlqSize: 0,
        eventStoreSize: 0,
        circuitOpen: false,
        dedupeCacheSize: 0,
        subscriberEventTypeCount: 0,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      outbox: { total: 0, pending: 0, sent: 0, failed: 0 },
      requestId: 'rid-parse-validate',
    };
    const headers = {
      get(name: string): string | null {
        if (name.toLowerCase() === 'x-request-id') return 'rid-parse-validate';
        if (name.toLowerCase() === 'x-domain-events-health-contract-version') {
          return DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION;
        }
        return null;
      },
    };
    const responseLike = {
      headers,
      async json(): Promise<unknown> {
        return payload;
      },
    };
    const res = await parseAndValidateDomainEventsHealthResponse(responseLike);
    expect(res.ok).toBe(true);
    expect(res.payload).toEqual(payload);
  });

  it('returns payload parse error for non-object body', async () => {
    const responseLike = {
      headers: {
        get(): string | null {
          return null;
        },
      },
      async json(): Promise<unknown> {
        return ['not-object'];
      },
    };
    const res = await parseAndValidateDomainEventsHealthResponse(responseLike);
    expect(res.ok).toBe(false);
    expect(res.payload).toBeNull();
    if (!res.ok && 'parseError' in res) {
      expect(res.parseError).toBe('response_payload_not_object');
    }
  });
});
