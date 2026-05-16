/**
 * @jest-environment node
 */
import { POST } from '@/app/api/brand/workshop2/phase1-dossier/lifecycle/transition/route';
import {
  __clearWorkshop2ServerDossierStoreForTests,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

describe('POST /api/brand/workshop2/phase1-dossier/lifecycle/transition', () => {
  beforeEach(async () => {
    await __clearWorkshop2ServerDossierStoreForTests();
  });

  it('allows valid lifecycle transition', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c1',
      articleId: 'a1',
      dossier: { assignments: [], lifecycleState: 'sent_to_production' } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/lifecycle/transition',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c1',
          articleId: 'a1',
          targetState: 'rework_requested',
          actorLabel: 'FSM Operator',
          comment: 'Send to factory',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; dossier?: { lifecycleState?: string } };
    expect(json.ok).toBe(true);
    expect(json.dossier?.lifecycleState).toBe('rework_requested');
  });

  it('rejects invalid lifecycle transition with reasonCode', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c2',
      articleId: 'a2',
      dossier: { assignments: [], lifecycleState: 'draft' } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/lifecycle/transition',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c2',
          articleId: 'a2',
          targetState: 'accepted',
          actorLabel: 'FSM Operator',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(409);
    const json = (await res.json()) as { error: string; reasonCode: string };
    expect(json.error).toBe('lifecycle_transition_forbidden');
    expect(json.reasonCode).toBe('FSM_INVALID_TRANSITION');
  });

  it('blocks sent_to_production when gate prerequisites are not met', async () => {
    await putWorkshop2ServerDossierRecord({
      collectionId: 'c3',
      articleId: 'a3',
      dossier: { assignments: [], lifecycleState: 'handoff_ready' } as never,
    });
    const req = new Request(
      'http://localhost/api/brand/workshop2/phase1-dossier/lifecycle/transition',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          collectionId: 'c3',
          articleId: 'a3',
          targetState: 'sent_to_production',
          actorLabel: 'FSM Operator',
        }),
      }
    );
    const res = await POST(req as never);
    expect(res.status).toBe(409);
    const json = (await res.json()) as { error: string; reasonCode: string };
    expect(json.error).toBe('lifecycle_gate_blocked');
    expect(json.reasonCode).toBe('GATE_SECTION_SIGNOFFS_INCOMPLETE');
  });
});
