import {
  DOMAIN_EVENTS_SUMMARY_CODE_ACTION,
  evaluateDomainEventsHealth,
} from '@/lib/server/domain-events-health';

describe('evaluateDomainEventsHealth', () => {
  const prevPendingWarn = process.env.EVENTS_HEALTH_PENDING_WARN;
  const prevPendingCrit = process.env.EVENTS_HEALTH_PENDING_CRIT;
  const prevDlqWarn = process.env.EVENTS_HEALTH_DLQ_WARN;
  const prevDlqCrit = process.env.EVENTS_HEALTH_DLQ_CRIT;
  const prevFailedWarn = process.env.EVENTS_HEALTH_FAILED_WARN;
  const prevFailedCrit = process.env.EVENTS_HEALTH_FAILED_CRIT;
  const prevRecentFailureWarn = process.env.EVENTS_HEALTH_RECENT_FAILURES_WARN;

  afterEach(() => {
    if (prevPendingWarn === undefined) delete process.env.EVENTS_HEALTH_PENDING_WARN;
    else process.env.EVENTS_HEALTH_PENDING_WARN = prevPendingWarn;
    if (prevPendingCrit === undefined) delete process.env.EVENTS_HEALTH_PENDING_CRIT;
    else process.env.EVENTS_HEALTH_PENDING_CRIT = prevPendingCrit;
    if (prevDlqWarn === undefined) delete process.env.EVENTS_HEALTH_DLQ_WARN;
    else process.env.EVENTS_HEALTH_DLQ_WARN = prevDlqWarn;
    if (prevDlqCrit === undefined) delete process.env.EVENTS_HEALTH_DLQ_CRIT;
    else process.env.EVENTS_HEALTH_DLQ_CRIT = prevDlqCrit;
    if (prevFailedWarn === undefined) delete process.env.EVENTS_HEALTH_FAILED_WARN;
    else process.env.EVENTS_HEALTH_FAILED_WARN = prevFailedWarn;
    if (prevFailedCrit === undefined) delete process.env.EVENTS_HEALTH_FAILED_CRIT;
    else process.env.EVENTS_HEALTH_FAILED_CRIT = prevFailedCrit;
  });

  it('returns healthy with no recommendations on nominal state', () => {
    delete process.env.EVENTS_HEALTH_RECENT_FAILURES_WARN;

    const res = evaluateDomainEventsHealth(
      {
        dlqSize: 0,
        eventStoreSize: 10,
        circuitOpen: false,
        dedupeCacheSize: 2,
        subscriberEventTypeCount: 5,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      {
        total: 3,
        pending: 0,
        sent: 3,
        failed: 0,
      }
    );
    expect(res.healthy).toBe(true);
    expect(res.severity).toBe('ok');
    expect(res.summaryCode).toBe('OK');
    expect(res.summary).toContain('OK:');
    expect(res.alerts).toHaveLength(0);
    expect(res.degradedReasons).toHaveLength(0);
    expect(res.recommendations).toHaveLength(0);
    expect(res.thresholds.pendingWarn).toBe(100);
    expect(res.thresholds.pendingCritical).toBe(500);
    expect(res.thresholds.dlqWarn).toBe(1);
    expect(res.thresholds.dlqCritical).toBe(10);
    expect(res.thresholds.failedWarn).toBe(1);
    expect(res.thresholds.failedCritical).toBe(10);
    expect(res.thresholds.recentFailureWarn).toBe(1);
  });

  it('returns degraded reasons and actionable recommendations', () => {
    const res = evaluateDomainEventsHealth(
      {
        dlqSize: 3,
        eventStoreSize: 50,
        circuitOpen: true,
        dedupeCacheSize: 10,
        subscriberEventTypeCount: 12,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      {
        total: 150,
        pending: 130,
        sent: 20,
        failed: 7,
      }
    );
    expect(res.healthy).toBe(false);
    expect(res.severity).toBe('critical');
    expect(res.summaryCode).toBe('CRIT_CIRCUIT_OPEN');
    expect(res.summary).toContain('CRITICAL:');
    expect(res.summary).toContain('event_bus_circuit_open');
    expect(res.alerts).toEqual(
      expect.arrayContaining([
        'domain_events_health_critical',
        'event_bus_circuit_open',
        'event_bus_dlq_nonempty',
        'outbox_failed_pending',
        'outbox_pending_backlog',
      ])
    );
    expect(res.degradedReasons).toEqual(
      expect.arrayContaining([
        'event_bus_circuit_open',
        'event_bus_dlq_nonempty',
        'outbox_failed_pending',
        'outbox_pending_backlog',
      ])
    );
    expect(res.recommendations.join(' ')).toContain('Reset event-bus circuit');
    expect(res.recommendations.join(' ')).toContain('DLQ replay');
    expect(res.recommendations.join(' ')).toContain('outbox-drain');
    expect(res.recommendations.join(' ')).toContain('backlog');
  });

  it('supports env threshold overrides and warning severity', () => {
    process.env.EVENTS_HEALTH_PENDING_WARN = '5';
    process.env.EVENTS_HEALTH_PENDING_CRIT = '999';
    process.env.EVENTS_HEALTH_DLQ_WARN = '2';
    process.env.EVENTS_HEALTH_DLQ_CRIT = '50';
    process.env.EVENTS_HEALTH_FAILED_WARN = '2';
    process.env.EVENTS_HEALTH_FAILED_CRIT = '99';
    process.env.EVENTS_HEALTH_RECENT_FAILURES_WARN = '1';

    const res = evaluateDomainEventsHealth(
      {
        dlqSize: 2,
        eventStoreSize: 12,
        circuitOpen: false,
        dedupeCacheSize: 1,
        subscriberEventTypeCount: 3,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      {
        total: 20,
        pending: 6,
        sent: 14,
        failed: 2,
      }
    );
    expect(res.healthy).toBe(false);
    expect(res.severity).toBe('warning');
    expect(res.summaryCode).toBe('WARN_BACKLOG');
    expect(res.summary).toContain('WARNING:');
    expect(res.alerts).toEqual(
      expect.arrayContaining([
        'domain_events_health_warning',
        'event_bus_dlq_nonempty',
        'outbox_failed_pending',
        'outbox_pending_backlog',
      ])
    );
    expect(res.degradedReasons).toEqual(
      expect.arrayContaining([
        'event_bus_dlq_nonempty',
        'outbox_failed_pending',
        'outbox_pending_backlog',
      ])
    );
    expect(res.thresholds).toEqual({
      pendingWarn: 5,
      pendingCritical: 999,
      dlqWarn: 2,
      dlqCritical: 50,
      failedWarn: 2,
      failedCritical: 99,
      recentFailureWarn: 1,
    });
  });

  it('uses WARN_DEGRADED when not backlog-driven', () => {
    process.env.EVENTS_HEALTH_PENDING_WARN = '100';
    process.env.EVENTS_HEALTH_PENDING_CRIT = '999';
    process.env.EVENTS_HEALTH_DLQ_WARN = '1';
    process.env.EVENTS_HEALTH_DLQ_CRIT = '50';
    process.env.EVENTS_HEALTH_FAILED_WARN = '10';
    process.env.EVENTS_HEALTH_FAILED_CRIT = '99';

    const res = evaluateDomainEventsHealth(
      {
        dlqSize: 1,
        eventStoreSize: 12,
        circuitOpen: false,
        dedupeCacheSize: 1,
        subscriberEventTypeCount: 3,
        recentFailureCount: 0,
        lastFailureAt: null,
      },
      {
        total: 20,
        pending: 0,
        sent: 20,
        failed: 0,
      }
    );
    expect(res.severity).toBe('warning');
    expect(res.summaryCode).toBe('WARN_DEGRADED');
  });

  it('respects EVENTS_HEALTH_RECENT_FAILURES_WARN before flagging recent failures', () => {
    process.env.EVENTS_HEALTH_RECENT_FAILURES_WARN = '3';

    const below = evaluateDomainEventsHealth(
      {
        dlqSize: 0,
        eventStoreSize: 12,
        circuitOpen: false,
        dedupeCacheSize: 1,
        subscriberEventTypeCount: 3,
        recentFailureCount: 2,
        lastFailureAt: '2026-04-15T10:00:00.000Z',
      },
      {
        total: 20,
        pending: 0,
        sent: 20,
        failed: 0,
      }
    );
    expect(below.healthy).toBe(true);
    expect(below.severity).toBe('ok');
    expect(below.degradedReasons).not.toContain('event_bus_recent_failures');
    expect(below.thresholds.recentFailureWarn).toBe(3);

    const at = evaluateDomainEventsHealth(
      {
        dlqSize: 0,
        eventStoreSize: 12,
        circuitOpen: false,
        dedupeCacheSize: 1,
        subscriberEventTypeCount: 3,
        recentFailureCount: 3,
        lastFailureAt: '2026-04-15T10:00:00.000Z',
      },
      {
        total: 20,
        pending: 0,
        sent: 20,
        failed: 0,
      }
    );
    expect(at.severity).toBe('warning');
    expect(at.summaryCode).toBe('WARN_DEGRADED');
    expect(at.degradedReasons).toContain('event_bus_recent_failures');
  });

  it('marks warning when bus has recent failures without circuit trip', () => {
    process.env.EVENTS_HEALTH_RECENT_FAILURES_WARN = '1';

    const res = evaluateDomainEventsHealth(
      {
        dlqSize: 0,
        eventStoreSize: 12,
        circuitOpen: false,
        dedupeCacheSize: 1,
        subscriberEventTypeCount: 3,
        recentFailureCount: 2,
        lastFailureAt: '2026-04-15T10:00:00.000Z',
      },
      {
        total: 20,
        pending: 0,
        sent: 20,
        failed: 0,
      }
    );
    expect(res.severity).toBe('warning');
    expect(res.summaryCode).toBe('WARN_DEGRADED');
    expect(res.degradedReasons).toContain('event_bus_recent_failures');
    expect(res.alerts).toContain('event_bus_recent_failures');
    expect(res.recommendations.join(' ')).toContain('recent handler failures');
  });

  it('has runbook action for each summaryCode', () => {
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.OK).toMatch(/No action/i);
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.CRIT_CIRCUIT_OPEN).toMatch(/Reset circuit/i);
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.CRIT_DLQ_HIGH).toMatch(/replay DLQ/i);
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.CRIT_FAILED_HIGH).toMatch(/outbox drain/i);
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.CRIT_PENDING_HIGH).toMatch(/backlog/i);
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.WARN_BACKLOG).toMatch(/Monitor backlog/i);
    expect(DOMAIN_EVENTS_SUMMARY_CODE_ACTION.WARN_DEGRADED).toMatch(/degraded/i);
  });
});
