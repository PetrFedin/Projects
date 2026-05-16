/**
 * @jest-environment node
 */
import { POST as createSnapshot } from '@/app/api/brand/workshop2/phase1-dossier/final-export-snapshot/route';
import { POST as buildDoc } from '@/app/api/brand/workshop2/phase1-dossier/final-export-document/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('POST /api/brand/workshop2/phase1-dossier/final-export-document', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('builds html by immutable snapshotId', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
    });
    const snapReq = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/final-export-snapshot',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          actorLabel: 'Export Bot',
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
        }),
      }
    );
    const snapRes = await createSnapshot(snapReq as never);
    const snapJson = (await snapRes.json()) as { snapshotId: string };

    const docReq = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/final-export-document',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          snapshotId: snapJson.snapshotId,
        }),
      }
    );
    const docRes = await buildDoc(docReq as never);
    expect(docRes.status).toBe(200);
    const docJson = (await docRes.json()) as { ok: boolean; html?: string };
    expect(docJson.ok).toBe(true);
    expect(docJson.html).toContain('Итоговое техническое задание');
  });
});
