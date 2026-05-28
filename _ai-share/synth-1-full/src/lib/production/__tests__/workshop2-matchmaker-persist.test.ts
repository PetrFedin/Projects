import { buildWorkshop2MatchmakerPersistedResult } from '@/lib/production/workshop2-matchmaker-persist';

describe('workshop2-matchmaker-persist', () => {
  it('builds persisted result from top match', () => {
    const r = buildWorkshop2MatchmakerPersistedResult(
      {
        matches: [{ contractorId: 'p1', score: 88, rationale: 'Опыт по трикотажу' }],
      },
      [{ id: 'p1', label: 'Фабрика А', capabilities: ['Пошив'] }]
    );
    expect(r.recommendedContractorId).toBe('p1');
    expect(r.recommendedLabel).toBe('Фабрика А');
    expect(r.confidence).toBe(88);
    expect(r.syncedAt).toBeTruthy();
  });
});
