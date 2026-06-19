import {
  PG_CONTEXTUAL_CABINET_ACTOR_ID,
  resolvePgContextualActorId,
} from '@/lib/communications/pg-contextual-actor-ids';

describe('pg-contextual-actor-ids', () => {
  it('uses session uid when present', () => {
    expect(resolvePgContextualActorId('brand', { sessionUid: 'brand-001' })).toBe('brand-001');
    expect(resolvePgContextualActorId('shop', { sessionUid: 'shop-001' })).toBe('shop-001');
  });

  it('falls back to demo preset without session', () => {
    expect(resolvePgContextualActorId('brand')).toBe(PG_CONTEXTUAL_CABINET_ACTOR_ID.brand);
    expect(resolvePgContextualActorId('factory', { sessionUid: '' })).toBe(
      PG_CONTEXTUAL_CABINET_ACTOR_ID.factory
    );
  });
});
