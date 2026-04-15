export type DomainEventsHealthCheckConfig =
  | { kind: 'skip'; reason: 'flag' | 'no_url' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ok';
      url: string;
      timeoutMs: number;
      secret: string | null;
    };

export function getDomainEventsHealthCheckConfig(
  env: NodeJS.ProcessEnv = process.env
): DomainEventsHealthCheckConfig {
  if (env.SKIP_DOMAIN_EVENTS_HEALTH_CONTRACT_CHECK === '1') {
    return { kind: 'skip', reason: 'flag' };
  }

  const url = env.DOMAIN_EVENTS_HEALTH_URL?.trim();
  if (!url) {
    if (env.DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT === '1') {
      return {
        kind: 'error',
        message:
          'DOMAIN_EVENTS_HEALTH_URL is required when DOMAIN_EVENTS_HEALTH_CONTRACT_STRICT=1 (CI / gated checks)',
      };
    }
    return { kind: 'skip', reason: 'no_url' };
  }

  const timeoutMsRaw = Number.parseInt(env.DOMAIN_EVENTS_HEALTH_TIMEOUT_MS || '', 10);
  const timeoutMs = Number.isFinite(timeoutMsRaw) && timeoutMsRaw > 0 ? timeoutMsRaw : 10000;
  const secret = env.DOMAIN_EVENTS_HEALTH_SECRET?.trim() || null;

  return {
    kind: 'ok',
    url,
    timeoutMs,
    secret,
  };
}
