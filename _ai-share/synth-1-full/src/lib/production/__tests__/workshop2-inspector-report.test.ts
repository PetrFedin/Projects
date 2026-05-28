jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: () => false,
}));

jest.mock('@/lib/server/workshop2-dossier-repository', () => ({
  ensureWorkshop2PgSchema: jest.fn(),
}));

import {
  clearWorkshop2InspectorReportsMemoryForTests,
  getWorkshop2InspectorReport,
  putWorkshop2InspectorReport,
} from '@/lib/server/workshop2-inspector-report-repository';

describe('workshop2 inspector report', () => {
  beforeEach(() => {
    clearWorkshop2InspectorReportsMemoryForTests();
  });

  it('persists checklist in memory by sample order id', async () => {
    await putWorkshop2InspectorReport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-qc-1',
      checkedItemIds: ['chk-a', 'chk-b'],
      notes: 'line check',
    });

    const report = await getWorkshop2InspectorReport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-qc-1',
    });

    expect(report?.checkedItemIds).toEqual(['chk-a', 'chk-b']);
    expect(report?.notes).toBe('line check');
  });

  it('scopes report to collection and article', async () => {
    await putWorkshop2InspectorReport({
      collectionId: 'SS27',
      articleId: 'demo-ss27-02',
      sampleOrderId: 'ord-1',
      checkedItemIds: ['x'],
    });

    const wrongArticle = await getWorkshop2InspectorReport({
      collectionId: 'SS27',
      articleId: 'other',
      sampleOrderId: 'ord-1',
    });
    expect(wrongArticle).toBeNull();
  });
});
