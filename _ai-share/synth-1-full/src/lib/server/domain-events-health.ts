import type { DomainEventOutboxStats } from '@/lib/order/domain-event-outbox';
import type { DomainEventBusHealthSnapshot } from '@/lib/order/domain-events';

export type DomainEventsHealthStatus = {
  healthy: boolean;
  severity: 'ok' | 'warning' | 'critical';
  summaryCode:
    | 'OK'
    | 'CRIT_CIRCUIT_OPEN'
    | 'CRIT_DLQ_HIGH'
    | 'CRIT_FAILED_HIGH'
    | 'CRIT_PENDING_HIGH'
    | 'WARN_BACKLOG'
    | 'WARN_DEGRADED';
  summary: string;
  alerts: string[];
  degradedReasons: string[];
  recommendations: string[];
  thresholds: {
    pendingWarn: number;
    pendingCritical: number;
    dlqWarn: number;
    dlqCritical: number;
    failedWarn: number;
    failedCritical: number;
    recentFailureWarn: number;
  };
};

/** Канонический словарь runbook-действий для summaryCode (ops/webhooks). */
export const DOMAIN_EVENTS_SUMMARY_CODE_ACTION: Record<
  DomainEventsHealthStatus['summaryCode'],
  string
> = {
  OK: 'No action required.',
  CRIT_CIRCUIT_OPEN: 'Reset circuit and inspect failing handlers immediately.',
  CRIT_DLQ_HIGH: 'Stabilize handlers, then replay DLQ in controlled batches.',
  CRIT_FAILED_HIGH: 'Run outbox drain, inspect lastError, and validate downstream availability.',
  CRIT_PENDING_HIGH: 'Investigate outbox backlog growth and drain safely.',
  WARN_BACKLOG: 'Monitor backlog trend and run proactive outbox drain.',
  WARN_DEGRADED: 'Inspect degraded signals and schedule preventive maintenance.',
};

export const DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION = 'v1' as const;
export const DOMAIN_EVENTS_HEALTH_REQUIRED_RESPONSE_KEYS = [
  'contractVersion',
  'ok',
  'status',
  'summaryCode',
  'summary',
  'alerts',
  'degradedReasons',
  'recommendations',
  'thresholds',
  'bus',
  'outbox',
  'requestId',
] as const;
export const DOMAIN_EVENTS_HEALTH_REQUIRED_HEADER_KEYS = [
  'x-request-id',
  'x-domain-events-health-contract-version',
] as const;
export const DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA = {
  version: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
  requiredResponseKeys: DOMAIN_EVENTS_HEALTH_REQUIRED_RESPONSE_KEYS,
  requiredHeaderKeys: DOMAIN_EVENTS_HEALTH_REQUIRED_HEADER_KEYS,
} as const;
export const DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR = {
  payloadKeysMismatch: 'payload_keys_mismatch',
  payloadShapeMismatch: 'payload_shape_mismatch',
  payloadContractVersionMismatch: 'payload_contract_version_mismatch',
  headerMissingPrefix: 'header_missing:',
  headerContractVersionMismatch: 'header_contract_version_mismatch',
} as const;
export type DomainEventsHealthContractErrorCode =
  | typeof DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadKeysMismatch
  | typeof DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadShapeMismatch
  | typeof DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadContractVersionMismatch
  | `${typeof DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerMissingPrefix}${string}`
  | typeof DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerContractVersionMismatch;

export type DomainEventsHealthContractValidation = {
  ok: boolean;
  errors: DomainEventsHealthContractErrorCode[];
};
export type HeaderGetterLike = {
  get(name: string): string | null;
};
export type JsonBodyReaderLike = {
  json(): Promise<unknown>;
};
export type DomainEventsHealthJsonResponseLike = {
  headers: HeaderGetterLike;
  json(): Promise<unknown>;
};
export type DomainEventsHealthResponseValidation =
  | ({
      payload: Record<string, unknown>;
    } & DomainEventsHealthContractValidation)
  | {
      ok: false;
      errors: DomainEventsHealthContractErrorCode[];
      payload: null;
      parseError: 'response_payload_not_object';
    };

export type DomainEventsHealthResponsePayload = {
  contractVersion: typeof DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION;
  ok: boolean;
  status: DomainEventsHealthStatus['severity'];
  summaryCode: DomainEventsHealthStatus['summaryCode'];
  summary: string;
  alerts: string[];
  degradedReasons: string[];
  recommendations: string[];
  thresholds: DomainEventsHealthStatus['thresholds'];
  bus: DomainEventBusHealthSnapshot;
  outbox: DomainEventOutboxStats;
  requestId: string;
};

export function buildDomainEventsHealthResponsePayload(params: {
  health: DomainEventsHealthStatus;
  bus: DomainEventBusHealthSnapshot;
  outbox: DomainEventOutboxStats;
  requestId: string;
}): DomainEventsHealthResponsePayload {
  return {
    contractVersion: DOMAIN_EVENTS_HEALTH_CONTRACT_VERSION,
    ok: params.health.healthy,
    status: params.health.severity,
    summaryCode: params.health.summaryCode,
    summary: params.health.summary,
    alerts: params.health.alerts,
    degradedReasons: params.health.degradedReasons,
    recommendations: params.health.recommendations,
    thresholds: params.health.thresholds,
    bus: params.bus,
    outbox: params.outbox,
    requestId: params.requestId,
  };
}

export function buildDomainEventsHealthResponseHeaders(requestId: string): Record<string, string> {
  return {
    'x-request-id': requestId,
    'x-domain-events-health-contract-version': DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.version,
  };
}

export function validateDomainEventsHealthContract(params: {
  payload: Record<string, unknown>;
  headers: Record<string, string | null | undefined>;
}): DomainEventsHealthContractValidation {
  const errors: DomainEventsHealthContractErrorCode[] = [];
  const headersNormalized: Record<string, string | null | undefined> = {};
  for (const [k, v] of Object.entries(params.headers)) {
    headersNormalized[k.toLowerCase()] = typeof v === 'string' ? v.trim() : v;
  }
  const payloadKeys = Object.keys(params.payload).sort();
  const requiredPayloadKeys = [
    ...DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredResponseKeys,
  ].sort();
  if (JSON.stringify(payloadKeys) !== JSON.stringify(requiredPayloadKeys)) {
    errors.push(DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadKeysMismatch);
  }

  const payloadVersion =
    typeof params.payload.contractVersion === 'string' ? params.payload.contractVersion : null;
  if (payloadVersion !== DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.version) {
    errors.push(DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadContractVersionMismatch);
  }
  if (!isValidDomainEventsHealthPayloadShape(params.payload)) {
    errors.push(DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadShapeMismatch);
  }

  const requiredHeaderKeys = DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredHeaderKeys;
  for (const key of requiredHeaderKeys) {
    const v = headersNormalized[key];
    if (typeof v !== 'string' || v.length === 0) {
      errors.push(`${DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerMissingPrefix}${key}`);
    }
  }
  const headerVersion = headersNormalized['x-domain-events-health-contract-version'];
  if (headerVersion !== DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.version) {
    errors.push(DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.headerContractVersionMismatch);
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function isObjectLike(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

function isValidDomainEventsHealthPayloadShape(payload: Record<string, unknown>): boolean {
  const status = payload.status;
  if (status !== 'ok' && status !== 'warning' && status !== 'critical') return false;
  if (typeof payload.ok !== 'boolean') return false;
  if (typeof payload.summary !== 'string') return false;
  if (typeof payload.requestId !== 'string' || payload.requestId.trim().length === 0) return false;
  if (typeof payload.summaryCode !== 'string') return false;
  if (!(payload.summaryCode in DOMAIN_EVENTS_SUMMARY_CODE_ACTION)) return false;
  if (!isStringArray(payload.alerts)) return false;
  if (!isStringArray(payload.degradedReasons)) return false;
  if (!isStringArray(payload.recommendations)) return false;

  if (!isObjectLike(payload.thresholds)) return false;
  const thresholds = payload.thresholds;
  if (!isFiniteNumber(thresholds.pendingWarn)) return false;
  if (!isFiniteNumber(thresholds.pendingCritical)) return false;
  if (!isFiniteNumber(thresholds.dlqWarn)) return false;
  if (!isFiniteNumber(thresholds.dlqCritical)) return false;
  if (!isFiniteNumber(thresholds.failedWarn)) return false;
  if (!isFiniteNumber(thresholds.failedCritical)) return false;
  if (!isFiniteNumber(thresholds.recentFailureWarn)) return false;

  if (!isObjectLike(payload.bus)) return false;
  const bus = payload.bus;
  if (!isFiniteNumber(bus.dlqSize)) return false;
  if (!isFiniteNumber(bus.eventStoreSize)) return false;
  if (typeof bus.circuitOpen !== 'boolean') return false;
  if (!isFiniteNumber(bus.dedupeCacheSize)) return false;
  if (!isFiniteNumber(bus.subscriberEventTypeCount)) return false;
  if (!isFiniteNumber(bus.recentFailureCount)) return false;
  if (!(bus.lastFailureAt === null || typeof bus.lastFailureAt === 'string')) return false;

  if (!isObjectLike(payload.outbox)) return false;
  const outbox = payload.outbox;
  if (!isFiniteNumber(outbox.total)) return false;
  if (!isFiniteNumber(outbox.pending)) return false;
  if (!isFiniteNumber(outbox.sent)) return false;
  if (!isFiniteNumber(outbox.failed)) return false;

  return true;
}

export function validateDomainEventsHealthFetchResponse(params: {
  payload: Record<string, unknown>;
  headers: HeaderGetterLike;
}): DomainEventsHealthContractValidation {
  const normalizedHeaders: Record<string, string | null> = {};
  for (const key of DOMAIN_EVENTS_HEALTH_CONTRACT_METADATA.requiredHeaderKeys) {
    normalizedHeaders[key] = params.headers.get(key);
  }
  return validateDomainEventsHealthContract({
    payload: params.payload,
    headers: normalizedHeaders,
  });
}

export async function parseAndValidateDomainEventsHealthResponse(
  response: DomainEventsHealthJsonResponseLike
): Promise<DomainEventsHealthResponseValidation> {
  const payloadUnknown = await response.json();
  if (!payloadUnknown || typeof payloadUnknown !== 'object' || Array.isArray(payloadUnknown)) {
    return {
      ok: false,
      errors: [DOMAIN_EVENTS_HEALTH_CONTRACT_ERROR.payloadKeysMismatch],
      payload: null,
      parseError: 'response_payload_not_object',
    };
  }
  const payload = payloadUnknown as Record<string, unknown>;
  const validation = validateDomainEventsHealthFetchResponse({
    payload,
    headers: response.headers,
  });
  return {
    ...validation,
    payload,
  };
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function getSummaryCode(params: {
  bus: DomainEventBusHealthSnapshot;
  outbox: DomainEventOutboxStats;
  pendingCritical: number;
  dlqCritical: number;
  failedCritical: number;
  pendingWarn: number;
  degraded: boolean;
}): DomainEventsHealthStatus['summaryCode'] {
  if (params.bus.circuitOpen) return 'CRIT_CIRCUIT_OPEN';
  if (params.bus.dlqSize >= params.dlqCritical) return 'CRIT_DLQ_HIGH';
  if (params.outbox.failed >= params.failedCritical) return 'CRIT_FAILED_HIGH';
  if (params.outbox.pending >= params.pendingCritical) return 'CRIT_PENDING_HIGH';
  if (params.outbox.pending >= params.pendingWarn) return 'WARN_BACKLOG';
  if (params.degraded) return 'WARN_DEGRADED';
  return 'OK';
}

export function evaluateDomainEventsHealth(
  bus: DomainEventBusHealthSnapshot,
  outbox: DomainEventOutboxStats
): DomainEventsHealthStatus {
  const pendingWarn = envInt('EVENTS_HEALTH_PENDING_WARN', 100);
  const pendingCritical = envInt('EVENTS_HEALTH_PENDING_CRIT', 500);
  const dlqWarn = envInt('EVENTS_HEALTH_DLQ_WARN', 1);
  const dlqCritical = envInt('EVENTS_HEALTH_DLQ_CRIT', 10);
  const failedWarn = envInt('EVENTS_HEALTH_FAILED_WARN', 1);
  const failedCritical = envInt('EVENTS_HEALTH_FAILED_CRIT', 10);
  const recentFailureWarn = envInt('EVENTS_HEALTH_RECENT_FAILURES_WARN', 1);
  const recentFailuresDegraded = bus.recentFailureCount >= recentFailureWarn;

  const degradedReasons = [
    ...(bus.circuitOpen ? ['event_bus_circuit_open'] : []),
    ...(recentFailuresDegraded ? ['event_bus_recent_failures'] : []),
    ...(bus.dlqSize >= dlqWarn ? ['event_bus_dlq_nonempty'] : []),
    ...(outbox.failed >= failedWarn ? ['outbox_failed_pending'] : []),
    ...(outbox.pending >= pendingWarn ? ['outbox_pending_backlog'] : []),
  ];
  const recommendations = [
    ...(bus.circuitOpen ? ['Reset event-bus circuit and inspect last handler failures.'] : []),
    ...(recentFailuresDegraded
      ? [
          `Inspect recent handler failures in event-bus logs when consecutive failure count >= ${recentFailureWarn} (before replay actions).`,
        ]
      : []),
    ...(bus.dlqSize >= dlqWarn ? ['Run DLQ replay after validating idempotent handlers.'] : []),
    ...(outbox.failed >= failedWarn
      ? ['Run /api/cron/domain-event-outbox-drain and inspect outbox.lastError.']
      : []),
    ...(outbox.pending >= pendingWarn
      ? [`Investigate sustained outbox backlog (pending >= ${pendingWarn}).`]
      : []),
  ];
  const critical =
    bus.circuitOpen ||
    bus.dlqSize >= dlqCritical ||
    outbox.failed >= failedCritical ||
    outbox.pending >= pendingCritical;
  const warning = degradedReasons.length > 0;
  const severity: DomainEventsHealthStatus['severity'] = critical
    ? 'critical'
    : warning
      ? 'warning'
      : 'ok';
  const alerts = [
    ...(severity === 'critical' ? ['domain_events_health_critical'] : []),
    ...(severity === 'warning' ? ['domain_events_health_warning'] : []),
    ...(bus.circuitOpen ? ['event_bus_circuit_open'] : []),
    ...(recentFailuresDegraded ? ['event_bus_recent_failures'] : []),
    ...(bus.dlqSize >= dlqWarn ? ['event_bus_dlq_nonempty'] : []),
    ...(outbox.failed >= failedWarn ? ['outbox_failed_pending'] : []),
    ...(outbox.pending >= pendingWarn ? ['outbox_pending_backlog'] : []),
  ];
  const summaryCode = getSummaryCode({
    bus,
    outbox,
    pendingCritical,
    dlqCritical,
    failedCritical,
    pendingWarn,
    degraded: warning,
  });
  const summary =
    severity === 'ok'
      ? 'OK: domain events pipeline healthy.'
      : `${severity.toUpperCase()}: ${alerts
          .filter(
            (a) => a !== 'domain_events_health_warning' && a !== 'domain_events_health_critical'
          )
          .slice(0, 3)
          .join(' + ')}`;
  return {
    healthy: !warning,
    severity,
    summaryCode,
    summary,
    alerts,
    degradedReasons,
    recommendations,
    thresholds: {
      pendingWarn,
      pendingCritical,
      dlqWarn,
      dlqCritical,
      failedWarn,
      failedCritical,
      recentFailureWarn,
    },
  };
}
