/**
 * @jest-environment node
 */
import { validateWorkshop2DossierOnServer } from '@/lib/production/workshop2-server-validation-client';

function makeResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('validateWorkshop2DossierOnServer', () => {
  it('returns ok=true with parsed server payload', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(
        makeResponse({
          ok: true,
          mode: 'server_validate_only',
          gate: {
            state: 'draft',
            blockers: [],
            firstUnmet: null,
            sectionMinimumErrors: {},
            sectionSignoffsFull: 0,
            hasHandoffMarks: false,
          },
          preflight: { ok: false, issues: [] },
        })
      ) as unknown as typeof fetch;
    const out = await validateWorkshop2DossierOnServer(
      { assignments: [] } as unknown as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1
    );
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.data.mode).toBe('server_validate_only');
      expect(out.data.gate.state).toBe('draft');
    }
    global.fetch = prev;
  });

  it('maps non-2xx to http_* reason', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(makeResponse({ error: 'bad' }, 503)) as unknown as typeof fetch;
    const out = await validateWorkshop2DossierOnServer(
      { assignments: [] } as unknown as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1
    );
    expect(out).toEqual({ ok: false, reason: 'http_503' });
    global.fetch = prev;
  });

  it('maps invalid server body to invalid_server_response', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(makeResponse({ ok: false, error: '' }, 200)) as unknown as typeof fetch;
    const out = await validateWorkshop2DossierOnServer(
      { assignments: [] } as unknown as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1
    );
    expect(out).toEqual({ ok: false, reason: 'invalid_server_response' });
    global.fetch = prev;
  });

  it('maps fetch exception to network_or_server_error', async () => {
    const prev = global.fetch;
    global.fetch = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockRejectedValue(new Error('network')) as unknown as typeof fetch;
    const out = await validateWorkshop2DossierOnServer(
      { assignments: [] } as unknown as import('@/lib/production/workshop2-dossier-phase1.types').Workshop2DossierPhase1
    );
    expect(out).toEqual({ ok: false, reason: 'network_or_server_error' });
    global.fetch = prev;
  });
});
