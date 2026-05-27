/**
 * @jest-environment node
 */
import {
  buildWorkshop2FinalExportHtmlFromSnapshotOnServer,
  createWorkshop2FinalExportSnapshotOnServer,
  getWorkshop2FinalExportSnapshotMetaOnServer,
  listWorkshop2DossierEventsOnServer,
  listWorkshop2DossierVersionsOnServer,
  listWorkshop2FinalExportSnapshotsOnServer,
  loadWorkshop2DossierFromServer,
  mergeWorkshop2DossierOnServer,
  resolveWorkshop2DossierMergeOnServer,
  saveWorkshop2DossierToServer,
} from '@/lib/production/workshop2-server-dossier-client';

function makeResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('workshop2-server-dossier-client', () => {
  it('loads server dossier payload', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        collectionId: 'c1',
        articleId: 'a1',
        version: 2,
        updatedAt: '2026-04-28T12:00:00.000Z',
        dossier: { assignments: [] },
      })
    ) as unknown as typeof fetch;
    const out = await loadWorkshop2DossierFromServer('c1', 'a1');
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.version).toBe(2);
    global.fetch = prev;
  });

  it('maps load 404 to not_found', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(makeResponse({ error: 'not_found' }, 404)) as unknown as typeof fetch;
    const out = await loadWorkshop2DossierFromServer('c1', 'a1');
    expect(out).toEqual({ ok: false, reason: 'not_found' });
    global.fetch = prev;
  });

  it('saves dossier and returns version', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({ ok: true, version: 3, updatedAt: '2026-04-28T12:00:01.000Z' }, 200)
      ) as unknown as typeof fetch;
    const out = await saveWorkshop2DossierToServer({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
      baseVersion: 2,
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.version).toBe(3);
    global.fetch = prev;
  });

  it('maps save 409 to version_conflict', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({ error: 'version_conflict', currentVersion: 5 }, 409)
      ) as unknown as typeof fetch;
    const out = await saveWorkshop2DossierToServer({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [] } as never,
      baseVersion: 2,
    });
    expect(out).toEqual({ ok: false, reason: 'version_conflict', currentVersion: 5 });
    global.fetch = prev;
  });

  it('merges dossier via server merge endpoint', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        version: 6,
        updatedAt: '2026-04-28T12:00:02.000Z',
        dossier: { assignments: [] },
        mergeReport: {
          mode: 'auto',
          conflictingFields: ['tzSignatoryBindings'],
          manualReviewRequired: true,
          criticalConflicts: ['tzSignatoryBindings'],
        },
      })
    ) as unknown as typeof fetch;
    const out = await mergeWorkshop2DossierOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      localDossier: { assignments: [] } as never,
    });
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.data.version).toBe(6);
      expect(out.data.mergeReport?.manualReviewRequired).toBe(true);
    }
    global.fetch = prev;
  });

  it('resolves merge manually via resolve endpoint', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        version: 7,
        updatedAt: '2026-04-28T12:00:03.000Z',
        dossier: { assignments: [] },
        mergeReport: {
          mode: 'manual',
          conflictingFields: ['collaborationMergeNote'],
          resolvedBy: 'QA Resolver',
          resolvedAt: '2026-04-28T12:00:03.000Z',
        },
      })
    ) as unknown as typeof fetch;
    const out = await resolveWorkshop2DossierMergeOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      actorLabel: 'QA Resolver',
      localDossier: { assignments: [] } as never,
      resolutions: { collaborationMergeNote: 'local' },
    });
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.data.version).toBe(7);
      expect(out.data.mergeReport?.mode).toBe('manual');
    }
    global.fetch = prev;
  });

  it('creates final export snapshot on server', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        snapshotId: 'w2-exp-snap-1',
        version: 8,
        updatedAt: '2026-04-28T12:00:04.000Z',
        dossier: { assignments: [] },
      })
    ) as unknown as typeof fetch;
    const out = await createWorkshop2FinalExportSnapshotOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      actorLabel: 'Export Bot',
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.snapshotId).toBe('w2-exp-snap-1');
    global.fetch = prev;
  });

  it('loads immutable html by snapshot id', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({ ok: true, snapshotId: 'w2-exp-snap-1', html: '<html>immutable</html>' })
      ) as unknown as typeof fetch;
    const out = await buildWorkshop2FinalExportHtmlFromSnapshotOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      snapshotId: 'w2-exp-snap-1',
    });
    expect(out).toEqual({ ok: true, html: '<html>immutable</html>' });
    global.fetch = prev;
  });

  it('lists final export snapshots', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        snapshots: [
          {
            snapshotId: 'w2-exp-snap-1',
            createdAt: '2026-04-28T12:00:00.000Z',
            createdBy: 'Export Bot',
            dossierVersion: 8,
          },
        ],
      })
    ) as unknown as typeof fetch;
    const out = await listWorkshop2FinalExportSnapshotsOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      limit: 5,
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.snapshots[0]?.snapshotId).toBe('w2-exp-snap-1');
    global.fetch = prev;
  });

  it('loads single final export snapshot meta', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        snapshot: {
          snapshotId: 'w2-exp-snap-1',
          createdAt: '2026-04-28T12:00:00.000Z',
          createdBy: 'Export Bot',
          dossierVersion: 8,
        },
      })
    ) as unknown as typeof fetch;
    const out = await getWorkshop2FinalExportSnapshotMetaOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      snapshotId: 'w2-exp-snap-1',
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.snapshot.snapshotId).toBe('w2-exp-snap-1');
    global.fetch = prev;
  });

  it('lists dossier audit events', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        events: [
          {
            id: '1',
            collectionId: 'c1',
            articleId: 'a1',
            version: 2,
            eventType: 'merge_auto',
            eventPayload: {},
            createdAt: '2026-04-28T12:00:00.000Z',
          },
        ],
      })
    ) as unknown as typeof fetch;
    const out = await listWorkshop2DossierEventsOnServer({ collectionId: 'c1', articleId: 'a1' });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.events[0]?.eventType).toBe('merge_auto');
    global.fetch = prev;
  });

  it('lists dossier versions', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        versions: [
          {
            id: '2',
            collectionId: 'c1',
            articleId: 'a1',
            version: 2,
            createdAt: '2026-04-28T12:00:00.000Z',
          },
        ],
      })
    ) as unknown as typeof fetch;
    const out = await listWorkshop2DossierVersionsOnServer({ collectionId: 'c1', articleId: 'a1' });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.versions[0]?.version).toBe(2);
    global.fetch = prev;
  });
});
