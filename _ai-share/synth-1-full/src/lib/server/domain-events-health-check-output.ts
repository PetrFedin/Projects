export type DomainEventsHealthCheckLogLevel = 'info' | 'warn' | 'error';

export type DomainEventsHealthCheckOutputFormat = 'json' | 'pretty';

/** Допустимые значения `DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT` (CI / локально). */
export const DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT_VALUES = ['json', 'pretty'] as const;

export type DomainEventsHealthCheckOutputFormatParseResult = {
  format: DomainEventsHealthCheckOutputFormat;
  /** Нормализованное значение env, если оно не пустое и не распознано как `json`|`pretty`. */
  invalidRaw: string | null;
};

export type DomainEventsHealthCheckEvent = {
  scope: 'domain-events-health-contract';
  level: DomainEventsHealthCheckLogLevel;
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

/** CI default: single-line JSON (log aggregators). */
export function formatDomainEventsHealthCheckEvent(event: DomainEventsHealthCheckEvent): string {
  return formatDomainEventsHealthCheckEventForConsole(event, 'json');
}

export function parseDomainEventsHealthCheckOutputFormat(
  env: NodeJS.ProcessEnv = process.env
): DomainEventsHealthCheckOutputFormatParseResult {
  const raw = env.DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT?.trim();
  if (!raw) {
    return { format: 'json', invalidRaw: null };
  }
  const lower = raw.toLowerCase();
  if (lower === 'json') return { format: 'json', invalidRaw: null };
  if (lower === 'pretty') return { format: 'pretty', invalidRaw: null };
  return { format: 'json', invalidRaw: raw };
}

export function formatDomainEventsHealthCheckEventForConsole(
  event: DomainEventsHealthCheckEvent,
  format: DomainEventsHealthCheckOutputFormat
): string {
  if (format === 'pretty') {
    return JSON.stringify(event, null, 2);
  }
  return JSON.stringify(event);
}
