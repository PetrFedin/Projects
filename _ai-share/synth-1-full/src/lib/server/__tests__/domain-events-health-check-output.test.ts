import {
  DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT_VALUES,
  formatDomainEventsHealthCheckEvent,
  formatDomainEventsHealthCheckEventForConsole,
  parseDomainEventsHealthCheckOutputFormat,
} from '@/lib/server/domain-events-health-check-output';

describe('formatDomainEventsHealthCheckEvent', () => {
  it('returns stable JSON object for parser-friendly logs', () => {
    const line = formatDomainEventsHealthCheckEvent({
      scope: 'domain-events-health-contract',
      level: 'error',
      code: 'contract_validation_failed',
      message: 'Contract validation failed',
      details: {
        errors: ['payload_keys_mismatch'],
      },
    });
    const parsed = JSON.parse(line) as {
      scope: string;
      level: string;
      code: string;
      message: string;
      details?: { errors?: string[] };
    };
    expect(parsed.scope).toBe('domain-events-health-contract');
    expect(parsed.level).toBe('error');
    expect(parsed.code).toBe('contract_validation_failed');
    expect(parsed.message).toBe('Contract validation failed');
    expect(parsed.details?.errors).toEqual(['payload_keys_mismatch']);
  });
});

describe('formatDomainEventsHealthCheckEventForConsole', () => {
  const event = {
    scope: 'domain-events-health-contract' as const,
    level: 'info' as const,
    code: 'contract_validation_ok',
    message: 'OK',
    details: { a: 1 },
  };

  it('pretty mode is indented JSON still parseable as one object', () => {
    const text = formatDomainEventsHealthCheckEventForConsole(event, 'pretty');
    expect(text).toContain('\n');
    expect(JSON.parse(text)).toEqual(event);
  });
});

describe('parseDomainEventsHealthCheckOutputFormat', () => {
  it('defaults to json when unset or whitespace', () => {
    expect(parseDomainEventsHealthCheckOutputFormat({})).toEqual({
      format: 'json',
      invalidRaw: null,
    });
    expect(
      parseDomainEventsHealthCheckOutputFormat({ DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT: '' })
    ).toEqual({ format: 'json', invalidRaw: null });
    expect(
      parseDomainEventsHealthCheckOutputFormat({ DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT: '   ' })
    ).toEqual({ format: 'json', invalidRaw: null });
  });

  it('returns json with invalidRaw when value is unknown', () => {
    expect(
      parseDomainEventsHealthCheckOutputFormat({ DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT: 'verbose' })
    ).toEqual({ format: 'json', invalidRaw: 'verbose' });
  });

  it('accepts json and pretty case-insensitively', () => {
    expect(
      parseDomainEventsHealthCheckOutputFormat({ DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT: 'JSON' })
    ).toEqual({ format: 'json', invalidRaw: null });
    expect(
      parseDomainEventsHealthCheckOutputFormat({ DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT: 'PRETTY' })
    ).toEqual({ format: 'pretty', invalidRaw: null });
    expect(
      parseDomainEventsHealthCheckOutputFormat({ DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT: '  Pretty  ' })
    ).toEqual({ format: 'pretty', invalidRaw: null });
  });

  it('exports stable allowed list for diagnostics', () => {
    expect([...DOMAIN_EVENTS_HEALTH_CHECK_OUTPUT_VALUES]).toEqual(['json', 'pretty']);
  });
});
