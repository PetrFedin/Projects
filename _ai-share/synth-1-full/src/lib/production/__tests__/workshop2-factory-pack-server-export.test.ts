import {
  exportWorkshop2FactoryPackViaServerSnapshot,
  workshop2FactoryPackServerExportFailureRu,
} from '@/lib/production/workshop2-factory-pack-server-export';

jest.mock('@/lib/production/workshop2-server-dossier-client', () => ({
  createWorkshop2FinalExportSnapshotOnServer: jest.fn(),
  buildWorkshop2FinalExportHtmlFromSnapshotOnServer: jest.fn(),
}));

jest.mock('@/lib/production/workshop2-techpack-export-sheets', () => ({
  downloadWorkshop2TechPackHtmlFile: jest.fn(),
}));

import {
  buildWorkshop2FinalExportHtmlFromSnapshotOnServer,
  createWorkshop2FinalExportSnapshotOnServer,
} from '@/lib/production/workshop2-server-dossier-client';
import { downloadWorkshop2TechPackHtmlFile } from '@/lib/production/workshop2-techpack-export-sheets';

const createSnap = createWorkshop2FinalExportSnapshotOnServer as jest.MockedFunction<
  typeof createWorkshop2FinalExportSnapshotOnServer
>;
const buildHtml = buildWorkshop2FinalExportHtmlFromSnapshotOnServer as jest.MockedFunction<
  typeof buildWorkshop2FinalExportHtmlFromSnapshotOnServer
>;

describe('workshop2-factory-pack-server-export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates snapshot and downloads factory pack html', async () => {
    createSnap.mockResolvedValue({
      ok: true,
      data: {
        snapshotId: 'snap-1',
        version: 2,
        updatedAt: '2026-01-01T00:00:00.000Z',
        dossier: { schemaVersion: 1, assignments: [] },
      },
    });
    buildHtml.mockResolvedValue({ ok: true, html: '<html>Factory pack</html>' });

    const out = await exportWorkshop2FactoryPackViaServerSnapshot({
      collectionId: 'SS27',
      articleId: 'a1',
      actorLabel: 'Bot',
      exportContext: {
        articleSku: 'SKU-1',
        articleName: 'Name',
        pathLabel: 'Path',
        l2Name: 'L2',
        tzPhase: '1',
        categoryLeafId: 'women-dresses',
        preflightOk: true,
        preflightIssueCount: 0,
        sectionSignoffsFull: 0,
        gateLifecycleState: 'draft',
      },
      articleSku: 'SKU-1',
    });

    expect(out.ok).toBe(true);
    if (out.ok) expect(out.snapshotId).toBe('snap-1');
    expect(buildHtml).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'factory_pack', snapshotId: 'snap-1' })
    );
    expect(downloadWorkshop2TechPackHtmlFile).toHaveBeenCalled();
  });

  it('maps not_found to ru message', () => {
    expect(workshop2FactoryPackServerExportFailureRu('not_found')).toContain('PG');
  });
});
