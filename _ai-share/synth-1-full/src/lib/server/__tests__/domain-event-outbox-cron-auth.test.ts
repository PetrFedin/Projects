import {
  verifyDomainEventOpsHealthRequest,
  verifyDomainEventOutboxCronRequest,
} from '@/lib/server/domain-event-outbox-cron-auth';

function mockRequest(url: string, authorization?: string): Request {
  return {
    url,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === 'authorization' ? (authorization ?? null) : null,
    },
  } as unknown as Request;
}

describe('verifyDomainEventOutboxCronRequest', () => {
  const prevOutbox = process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET;
  const prevCron = process.env.CRON_SECRET;
  const prevHealth = process.env.DOMAIN_EVENT_HEALTH_SECRET;

  afterEach(() => {
    if (prevOutbox === undefined) delete process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET;
    else process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET = prevOutbox;
    if (prevCron === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prevCron;
    if (prevHealth === undefined) delete process.env.DOMAIN_EVENT_HEALTH_SECRET;
    else process.env.DOMAIN_EVENT_HEALTH_SECRET = prevHealth;
  });

  it('rejects when no secret configured', () => {
    delete process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET;
    delete process.env.CRON_SECRET;
    const req = mockRequest('https://x.test/api/cron/domain-event-outbox-drain', 'Bearer s');
    expect(verifyDomainEventOutboxCronRequest(req)).toBe(false);
  });

  it('accepts Bearer CRON_SECRET', () => {
    process.env.CRON_SECRET = 'secret-xyz';
    delete process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET;
    const req = mockRequest(
      'https://x.test/api/cron/domain-event-outbox-drain',
      'Bearer secret-xyz'
    );
    expect(verifyDomainEventOutboxCronRequest(req)).toBe(true);
  });

  it('accepts case-insensitive Bearer and extra whitespace', () => {
    process.env.CRON_SECRET = 'secret-xyz';
    delete process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET;
    const req = mockRequest(
      'https://x.test/api/cron/domain-event-outbox-drain',
      'bearer  secret-xyz  '
    );
    expect(verifyDomainEventOutboxCronRequest(req)).toBe(true);
  });

  it('accepts query key DOMAIN_EVENT_OUTBOX_CRON_SECRET', () => {
    process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET = 'k1';
    const req = mockRequest('https://x.test/api/cron/domain-event-outbox-drain?key=k1');
    expect(verifyDomainEventOutboxCronRequest(req)).toBe(true);
  });

  it('ops health prefers DOMAIN_EVENT_HEALTH_SECRET', () => {
    process.env.DOMAIN_EVENT_HEALTH_SECRET = 'health-s';
    process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET = 'outbox-s';
    const req = mockRequest('https://x.test/api/ops/domain-events/health', 'Bearer health-s');
    expect(verifyDomainEventOpsHealthRequest(req)).toBe(true);
  });

  it('ops health falls back to outbox/cron secrets', () => {
    delete process.env.DOMAIN_EVENT_HEALTH_SECRET;
    process.env.DOMAIN_EVENT_OUTBOX_CRON_SECRET = 'outbox-s';
    const req = mockRequest('https://x.test/api/ops/domain-events/health?key=outbox-s');
    expect(verifyDomainEventOpsHealthRequest(req)).toBe(true);
  });
});
