/**
 * @jest-environment node
 */
import { commitWorkshop2HandoffOnServer } from '@/lib/production/workshop2-server-handoff-client';

function makeResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('commitWorkshop2HandoffOnServer', () => {
  it('returns committed handoff response', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        version: 2,
        updatedAt: '2026-04-28T12:00:00.000Z',
        dossier: { assignments: [] },
      })
    ) as unknown as typeof fetch;
    const out = await commitWorkshop2HandoffOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      actorLabel: 'Иван',
      revisionLabel: 'R1',
      channel: 'zip_download',
      attachmentIds: ['a1'],
      brandDispatched: { at: '1', by: 'b' },
      factoryReceived: { at: '2', by: 'f' },
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.version).toBe(2);
    global.fetch = prev;
  });
});
