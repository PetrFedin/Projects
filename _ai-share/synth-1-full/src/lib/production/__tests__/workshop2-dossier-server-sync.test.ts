/**
 * @jest-environment node
 */
import { persistWorkshop2DossierWithMerge } from '@/lib/production/workshop2-dossier-server-sync';

jest.mock('@/lib/production/workshop2-server-dossier-client', () => ({
  saveWorkshop2DossierToServer: jest.fn(),
  mergeWorkshop2DossierOnServer: jest.fn(),
}));

import {
  mergeWorkshop2DossierOnServer,
  saveWorkshop2DossierToServer,
} from '@/lib/production/workshop2-server-dossier-client';

describe('persistWorkshop2DossierWithMerge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns save success when no conflict', async () => {
    (saveWorkshop2DossierToServer as jest.Mock).mockResolvedValue({
      ok: true,
      data: { version: 3, updatedAt: '2026-04-28T12:00:00.000Z' },
    });
    const out = await persistWorkshop2DossierWithMerge({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
      baseVersion: 2,
    });
    expect(out).toEqual({ ok: true, version: 3 });
  });

  it('falls back to merge on version conflict', async () => {
    (saveWorkshop2DossierToServer as jest.Mock).mockResolvedValue({
      ok: false,
      reason: 'version_conflict',
      currentVersion: 4,
    });
    (mergeWorkshop2DossierOnServer as jest.Mock).mockResolvedValue({
      ok: true,
      data: {
        version: 5,
        updatedAt: '2026-04-28T12:00:01.000Z',
        dossier: { assignments: [] },
        mergeReport: {
          mode: 'auto',
          conflictingFields: ['tzSignatoryBindings'],
          manualReviewRequired: true,
          criticalConflicts: ['tzSignatoryBindings'],
        },
      },
    });
    const out = await persistWorkshop2DossierWithMerge({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
      baseVersion: 3,
    });
    expect(out).toEqual({
      ok: true,
      version: 5,
      mergedDossier: { assignments: [] },
      manualReviewCriticalFields: ['tzSignatoryBindings'],
    });
  });
});
