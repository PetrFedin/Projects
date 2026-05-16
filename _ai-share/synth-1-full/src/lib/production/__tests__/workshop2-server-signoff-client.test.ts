/**
 * @jest-environment node
 */
import { commitWorkshop2SectionSignoffOnServer } from '@/lib/production/workshop2-server-signoff-client';

function makeResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('commitWorkshop2SectionSignoffOnServer', () => {
  it('returns committed server dossier', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({
          ok: true,
          version: 2,
          updatedAt: '2026-04-28T12:00:00.000Z',
          dossier: { assignments: [] },
        })
      ) as unknown as typeof fetch;
    const out = await commitWorkshop2SectionSignoffOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      articleSku: 'SKU-1',
      section: 'general',
      role: 'brand',
      signerLabel: 'Иван Иванов',
      signerOrganization: 'Demo',
    });
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.data.version).toBe(2);
    global.fetch = prev;
  });

  it('returns gate errors from 409', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({ error: 'section_gate_blocked', sectionErrors: ['err1'] }, 409)
      ) as unknown as typeof fetch;
    const out = await commitWorkshop2SectionSignoffOnServer({
      collectionId: 'c1',
      articleId: 'a1',
      articleSku: 'SKU-1',
      section: 'general',
      role: 'brand',
      signerLabel: 'Иван Иванов',
      signerOrganization: 'Demo',
    });
    expect(out).toEqual({ ok: false, reason: 'section_gate_blocked', sectionErrors: ['err1'] });
    global.fetch = prev;
  });
});
