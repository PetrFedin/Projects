/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useWorkshop2HandoffCommit } from '@/lib/production/use-workshop2-handoff-commit';

jest.mock('@/lib/production/workshop2-server-handoff-client', () => ({
  commitWorkshop2HandoffOnServer: jest.fn(),
}));

import { commitWorkshop2HandoffOnServer } from '@/lib/production/workshop2-server-handoff-client';

describe('useWorkshop2HandoffCommit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('applies committed dossier on success', async () => {
    const applyCommittedServerDossier = jest.fn();
    const toast = jest.fn();
    (commitWorkshop2HandoffOnServer as jest.Mock).mockResolvedValue({
      ok: true,
      data: {
        version: 2,
        updatedAt: '2026-04-28T12:00:00.000Z',
        dossier: { assignments: [] },
      },
    });
    const { result } = renderHook(() =>
      useWorkshop2HandoffCommit({
        collectionId: 'c1',
        articleId: 'a1',
        updatedByLabel: 'Иван',
        toast,
        applyCommittedServerDossier,
      })
    );
    const ok = await result.current.commitHandoffOnServer({
      revisionLabel: 'R1',
      channel: 'zip_download',
      attachmentIds: ['a1'],
      brandDispatched: { at: '1', by: 'b' },
      factoryReceived: { at: '2', by: 'f' },
    });
    expect(ok).toBe(true);
    expect(applyCommittedServerDossier).toHaveBeenCalled();
  });
});
