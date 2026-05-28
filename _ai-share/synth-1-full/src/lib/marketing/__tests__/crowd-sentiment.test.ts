import {
  __resetDomainEventBusCircuitForTests,
  __resetDomainEventBusDedupeForTests,
  eventBus,
} from '@/lib/order/domain-events';
import { DomainEventTypes } from '@/lib/order/domain-event-catalog';
import { CrowdSentimentEngine, normalizeSentimentPayload } from '@/lib/marketing/crowd-sentiment';
import type { DomainEvent } from '@/lib/production/execution-linkage';

describe('normalizeSentimentPayload', () => {
  it('clamps valence, arousal, volume and clears NaN', () => {
    const n = normalizeSentimentPayload({
      region: ' EU ',
      topic: ' x ',
      valence: NaN,
      arousal: 2,
      volume: -5,
    });
    expect(n.region).toBe('EU');
    expect(n.topic).toBe('x');
    expect(n.valence).toBe(0);
    expect(n.arousal).toBe(1);
    expect(n.volume).toBe(0);
  });
});

describe('CrowdSentimentEngine.publishDomainSpike', () => {
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    __resetDomainEventBusDedupeForTests();
    publishSpy = jest.spyOn(eventBus, 'publish').mockResolvedValue(undefined);
  });

  afterEach(() => {
    publishSpy.mockRestore();
  });

  it('publishes marketing.sentiment_spike with default dedupeKey', async () => {
    await CrowdSentimentEngine.publishDomainSpike({
      aggregateId: 'm1',
      version: 2,
      data: { region: 'US', topic: 't', valence: 0, arousal: 0.5, volume: 100 },
    });
    expect(publishSpy).toHaveBeenCalledTimes(1);
    const ev = publishSpy.mock.calls[0][0];
    expect(ev.type).toBe(DomainEventTypes.marketing.sentimentSpike);
    expect(ev.dedupeKey).toBe('marketing.sentiment_spike:m1:2');
    expect(ev.payload).toMatchObject({ region: 'US', topic: 't', volume: 100 });
  });

  it('respects custom dedupeKey and correlationId', async () => {
    await CrowdSentimentEngine.publishDomainSpike({
      aggregateId: 'm1',
      version: 1,
      data: { region: 'US', topic: 't', valence: 0, arousal: 0, volume: 0 },
      dedupeKey: 'custom-key',
      correlationId: 'corr-1',
    });
    const ev = publishSpy.mock.calls[0][0];
    expect(ev.dedupeKey).toBe('custom-key');
    expect(ev.correlationId).toBe('corr-1');
  });
});

describe('DomainEventBus dedupeKey', () => {
  beforeEach(() => {
    __resetDomainEventBusDedupeForTests();
    __resetDomainEventBusCircuitForTests();
    eventBus.clearDLQ();
  });

  it('does not persist a second event with the same dedupeKey', async () => {
    const data = { region: 'US', topic: 't', valence: 0, arousal: 0.5, volume: 100 };
    const before = eventBus.getEventStore().length;
    await CrowdSentimentEngine.publishDomainSpike({
      aggregateId: 'agg-dedupe',
      version: 1,
      data,
    });
    const mid = eventBus.getEventStore().length;
    await CrowdSentimentEngine.publishDomainSpike({
      aggregateId: 'agg-dedupe',
      version: 1,
      data,
    });
    const after = eventBus.getEventStore().length;
    expect(mid - before).toBe(1);
    expect(after).toBe(mid);
  });

  it('does not remember dedupe when handler exhausts retries — second publish runs again', async () => {
    const t = DomainEventTypes.marketing.sentimentSpike;
    let handlerCalls = 0;
    const off = eventBus.subscribe(t, async () => {
      handlerCalls += 1;
      throw new Error('handler fail');
    });
    const mk = (eventId: string): DomainEvent => ({
      eventId,
      occurredAt: new Date().toISOString(),
      aggregateId: 'a-dedupe-retry',
      aggregateType: 'marketing',
      version: 1,
      type: t,
      payload: { region: 'US', topic: 't', valence: 0, arousal: 0, volume: 1 },
      dedupeKey: 'dedupe-retry-outbox',
    });
    try {
      await eventBus.publish(mk('ev-retry-1'));
      expect(handlerCalls).toBe(3);
      expect(
        eventBus.getDeadLetterQueue().some((r) => r.event.dedupeKey === 'dedupe-retry-outbox')
      ).toBe(true);
      __resetDomainEventBusCircuitForTests();
      await eventBus.publish(mk('ev-retry-2'));
      expect(handlerCalls).toBe(6);
    } finally {
      off();
    }
  });

  it('does not remember dedupe for urgent publish when handler fails', async () => {
    const t = DomainEventTypes.marketing.sentimentSpike;
    let handlerCalls = 0;
    const off = eventBus.subscribe(t, async () => {
      handlerCalls += 1;
      throw new Error('urgent fail');
    });
    const mk = (eventId: string): DomainEvent => ({
      eventId,
      occurredAt: new Date().toISOString(),
      aggregateId: 'a-dedupe-urgent',
      aggregateType: 'marketing',
      version: 1,
      type: t,
      payload: { region: 'US', topic: 't', valence: 0, arousal: 0, volume: 1 },
      dedupeKey: 'dedupe-urgent-retry',
    });
    try {
      await eventBus.publishUrgent(mk('ev-urgent-1'));
      await eventBus.publishUrgent(mk('ev-urgent-2'));
      expect(handlerCalls).toBe(2);
      const urgentDlq = eventBus
        .getDeadLetterQueue()
        .filter((r) => r.event.dedupeKey === 'dedupe-urgent-retry');
      expect(urgentDlq.length).toBeGreaterThanOrEqual(2);
    } finally {
      off();
    }
  });
});
