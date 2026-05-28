/**
 * @jest-environment node
 */
import { commitWorkshop2GlobalSignoffOnServer } from '@/lib/production/workshop2-server-global-signoff-client';

function makeResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('commitWorkshop2GlobalSignoffOnServer', () => {
  it('returns committed global signoff response', async () => {
    const prev = global.fetch;
    global.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>().mockResolvedValue(
      makeResponse({
        ok: true,
        version: 3,
        updatedAt: '2026-04-28T12:00:00.000Z',
        dossier: { assignments: [] },
      })
    ) as unknown as typeof fetch;
    const out = await commitWorkshop2GlobalSignoffOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      articleSku: 'SKU-1',
      rowKey: 'designer',
      signerLabel: 'Иван Иванов',
      signerOrganization: 'Demo',
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.version).toBe(3);
    global.fetch = prev;
  });

  it('maps blocked global gate details', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({ error: 'global_gate_blocked', sectionErrors: ['e1'] }, 409)
      ) as unknown as typeof fetch;
    const out = await commitWorkshop2GlobalSignoffOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      articleSku: 'SKU-1',
      rowKey: 'designer',
      signerLabel: 'Иван Иванов',
      signerOrganization: 'Demo',
    });
    expect(out).toEqual({ ok: false, reason: 'global_gate_blocked', sectionErrors: ['e1'] });
    global.fetch = prev;
  });
});
