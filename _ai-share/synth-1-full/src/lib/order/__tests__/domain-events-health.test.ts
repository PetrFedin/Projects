import {
  __resetDomainEventBusCircuitForTests,
  __resetDomainEventBusDedupeForTests,
  DOMAIN_EVENT_BUS_CIRCUIT_FAILURE_THRESHOLD,
  DOMAIN_EVENT_BUS_CIRCUIT_RESET_TIMEOUT_MS,
  DOMAIN_EVENT_BUS_PUBLISH_DEFAULT_MAX_RETRIES,
  eventBus,
  getDomainEventBusHealthSnapshot,
} from '@/lib/order/domain-events';
import { DomainEventTypes } from '@/lib/order/domain-event-catalog';
import type { DomainEvent } from '@/lib/production/execution-linkage';

describe('domain-event-bus health snapshot', () => {
  beforeEach(() => {
    __resetDomainEventBusCircuitForTests();
    __resetDomainEventBusDedupeForTests();
  });

  afterEach(() => {
    jest.useRealTimers();
    __resetDomainEventBusCircuitForTests();
    __resetDomainEventBusDedupeForTests();
  });

  it('returns key health counters', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    try {
      const event: DomainEvent = {
        eventId: `evt-health-${Date.now()}`,
        occurredAt: new Date().toISOString(),
        aggregateId: 'health-1',
        aggregateType: 'marketing',
        version: 1,
        type: DomainEventTypes.marketing.sentimentSpike,
        payload: { region: 'EU', topic: 'health', valence: 0, arousal: 0, volume: 1 },
        dedupeKey: `health-${Date.now()}`,
      };
      await eventBus.publish(event);
      const snap = getDomainEventBusHealthSnapshot();
      expect(typeof snap.dlqSize).toBe('number');
      expect(typeof snap.eventStoreSize).toBe('number');
      expect(typeof snap.circuitOpen).toBe('boolean');
      expect(typeof snap.dedupeCacheSize).toBe('number');
      expect(typeof snap.subscriberEventTypeCount).toBe('number');
      expect(typeof snap.recentFailureCount).toBe('number');
      expect(Number.isFinite(snap.recentFailureCount)).toBe(true);
      expect(snap.lastFailureAt === null || typeof snap.lastFailureAt === 'string').toBe(true);
      expect(snap.eventStoreSize).toBeGreaterThan(0);
    } finally {
      logSpy.mockRestore();
    }
  });

  it('tracks recentFailureCount and lastFailureAt when circuit trips after handler failures', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const unsub = eventBus.subscribe(DomainEventTypes.marketing.sentimentSpike, async () => {
      throw new Error('handler-boom');
    });
    try {
      const t = Date.now();
      const mk = (suffix: string): DomainEvent => ({
        eventId: `evt-fail-${t}-${suffix}`,
        occurredAt: new Date().toISOString(),
        aggregateId: 'health-fail',
        aggregateType: 'marketing',
        version: 1,
        type: DomainEventTypes.marketing.sentimentSpike,
        payload: { region: 'EU', topic: 'fail', valence: 0, arousal: 0, volume: 1 },
        dedupeKey: `fail-${t}-${suffix}`,
      });

      await eventBus.publish(mk('a'));
      let snap = getDomainEventBusHealthSnapshot();
      expect(snap.recentFailureCount).toBe(DOMAIN_EVENT_BUS_PUBLISH_DEFAULT_MAX_RETRIES);
      expect(snap.circuitOpen).toBe(false);
      expect(snap.lastFailureAt).toBeNull();

      await eventBus.publish(mk('b'));
      snap = getDomainEventBusHealthSnapshot();
      expect(snap.recentFailureCount).toBeGreaterThanOrEqual(
        DOMAIN_EVENT_BUS_CIRCUIT_FAILURE_THRESHOLD
      );
      expect(snap.circuitOpen).toBe(true);
      expect(snap.lastFailureAt).not.toBeNull();
      expect(Date.parse(snap.lastFailureAt as string)).not.toBeNaN();
    } finally {
      unsub();
      logSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('does not reset recentFailureCount when an early handler succeeds but a later one fails', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const type = DomainEventTypes.marketing.sentimentSpike;
    const unsubA = eventBus.subscribe(type, async () => undefined);
    const unsubB = eventBus.subscribe(type, async () => {
      throw new Error('b-fail');
    });
    try {
      const t = Date.now();
      const mk = (suffix: string): DomainEvent => ({
        eventId: `evt-mix-${t}-${suffix}`,
        occurredAt: new Date().toISOString(),
        aggregateId: 'health-mix',
        aggregateType: 'marketing',
        version: 1,
        type,
        payload: { region: 'EU', topic: 'mix', valence: 0, arousal: 0, volume: 1 },
        dedupeKey: `mix-${t}-${suffix}`,
      });

      await eventBus.publish(mk('1'), 1);
      expect(getDomainEventBusHealthSnapshot().recentFailureCount).toBe(1);
      await eventBus.publish(mk('2'), 1);
      expect(getDomainEventBusHealthSnapshot().recentFailureCount).toBe(2);
    } finally {
      unsubA();
      unsubB();
      logSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('clears lastFailureAt after reset window and successful publish (half-open recovery)', async () => {
    jest.useFakeTimers();
    const base = new Date('2026-06-01T12:00:00.000Z').getTime();
    jest.setSystemTime(base);

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const type = DomainEventTypes.marketing.sentimentSpike;
    const unsubBad = eventBus.subscribe(type, async () => {
      throw new Error('boom');
    });
    try {
      const mk = (suffix: string): DomainEvent => ({
        eventId: `evt-rec-${base}-${suffix}`,
        occurredAt: new Date(base).toISOString(),
        aggregateId: 'health-rec',
        aggregateType: 'marketing',
        version: 1,
        type,
        payload: { region: 'EU', topic: 'rec', valence: 0, arousal: 0, volume: 1 },
        dedupeKey: `rec-${base}-${suffix}`,
      });

      const p1 = eventBus.publish(mk('a'));
      await jest.advanceTimersByTimeAsync(10_000);
      await p1;

      const p2 = eventBus.publish(mk('b'));
      await jest.advanceTimersByTimeAsync(10_000);
      await p2;

      expect(getDomainEventBusHealthSnapshot().circuitOpen).toBe(true);
      expect(getDomainEventBusHealthSnapshot().lastFailureAt).not.toBeNull();
    } finally {
      unsubBad();
    }

    const unsubOk = eventBus.subscribe(type, async () => undefined);
    try {
      const afterTrip = Date.now();
      jest.setSystemTime(afterTrip + DOMAIN_EVENT_BUS_CIRCUIT_RESET_TIMEOUT_MS + 5_000);
      const recoveredNow = Date.now();
      const p3 = eventBus.publish({
        eventId: `evt-rec-${base}-c`,
        occurredAt: new Date(recoveredNow).toISOString(),
        aggregateId: 'health-rec',
        aggregateType: 'marketing',
        version: 1,
        type,
        payload: { region: 'EU', topic: 'rec', valence: 0, arousal: 0, volume: 1 },
        dedupeKey: `rec-${base}-c`,
      });
      await jest.advanceTimersByTimeAsync(50);
      await p3;

      const snap = getDomainEventBusHealthSnapshot();
      expect(snap.circuitOpen).toBe(false);
      expect(snap.lastFailureAt).toBeNull();
      expect(snap.recentFailureCount).toBe(0);
    } finally {
      unsubOk();
      logSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });
});
