import { storeSewingIntentCommittedPayloadSchema } from '@/lib/order/domain-event-schemas';
import { DomainEventTypes } from '@/lib/order/domain-event-catalog';
import { publishStoreSewingIntentCommitted } from '@/lib/order/domain-event-factories';
import { eventBus, __resetDomainEventBusDedupeForTests } from '@/lib/order/domain-events';
import { __resetDomainEventOutboxForTests } from '@/lib/order/domain-event-outbox';

describe('store.sewing_intent_committed', () => {
  beforeEach(() => {
    __resetDomainEventBusDedupeForTests();
    __resetDomainEventOutboxForTests();
  });

  it('Zod-принимает минимальный payload', () => {
    const p = {
      handbookLeafId: 'x',
      pathLabel: 'A › B › C',
      l1Name: 'О',
      l2Name: 'Д',
      l3Name: 'Т',
      isApparelSewing: true,
      subjectKind: 'device' as const,
      subjectId: 'dev-1',
      source: 'sewing-patterns' as const,
    };
    expect(() => storeSewingIntentCommittedPayloadSchema.parse(p)).not.toThrow();
  });

  it('публикуется в шину (smoke)', async () => {
    const seen: string[] = [];
    const u = eventBus.subscribe(DomainEventTypes.store.sewingIntentCommitted, async (e) => {
      seen.push(e.aggregateId);
    });
    await publishStoreSewingIntentCommitted({
      aggregateId: 'store-subj-1',
      payload: {
        handbookLeafId: 'catalog-a',
        pathLabel: 'A › b › c',
        l1Name: 'О',
        l2Name: 'Д',
        l3Name: 'Т',
        isApparelSewing: true,
        subjectKind: 'user',
        subjectId: 'u-1',
        source: 'sewing-patterns',
      },
    });
    u();
    expect(seen).toContain('store-subj-1');
  });
});
