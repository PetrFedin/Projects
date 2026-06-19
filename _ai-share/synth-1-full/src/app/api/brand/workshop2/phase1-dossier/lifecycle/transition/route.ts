import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2DossierLifecycleState } from '@/lib/production/workshop2-dossier-phase1.types';
import { applyLifecycleTransition } from '@/lib/server/workshop2-dossier-lifecycle-fsm';
import { validateLifecycleTargetByGate } from '@/lib/server/workshop2-process-guard';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  workshop2DossierPutFailureBody,
  workshop2DossierPutFailureStatus,
} from '@/lib/server/workshop2-dossier-put-utils';

const STATES: Workshop2DossierLifecycleState[] = [
  'draft',
  'handoff_ready',
  'sent_to_production',
  'accepted',
  'rework_requested',
];

function isState(v: unknown): v is Workshop2DossierLifecycleState {
  return typeof v === 'string' && STATES.includes(v as Workshop2DossierLifecycleState);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const b = body as {
    collectionId?: unknown;
    articleId?: unknown;
    targetState?: unknown;
    actorLabel?: unknown;
    comment?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const actorLabel = String(b.actorLabel ?? '').trim() || 'system';
  const comment = String(b.comment ?? '').trim();
  if (!collectionId || !articleId || !isState(b.targetState)) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const actorResolved = resolveWorkshop2ServerActor(req, actorLabel);
  if (!actorResolved.ok)
    return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:lifecycle_transition'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const transitioned = applyLifecycleTransition(
    record.dossier,
    b.targetState,
    actor.actorLabel,
    comment || 'Manual lifecycle transition'
  );
  if (!transitioned.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: transitioned.error,
        reasonCode: transitioned.reasonCode,
        fromState: transitioned.fromState,
        toState: transitioned.toState,
      },
      { status: 409 }
    );
  }
  const gateCheck = validateLifecycleTargetByGate(record.dossier, b.targetState);
  if (!gateCheck.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'lifecycle_gate_blocked',
        reasonCode: gateCheck.reasonCode,
        detail: gateCheck.detail,
      },
      { status: 409 }
    );
  }
  const put = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: transitioned.dossier,
    baseVersion: record.version,
    txMeta: {
      eventType: 'lifecycle_transition',
      eventPayload: {
        actorId: actor.actorId,
        actorLabel: actor.actorLabel,
        targetState: b.targetState,
      },
    },
  });
  if (!put.ok) {
    return NextResponse.json(workshop2DossierPutFailureBody(put), {
      status: workshop2DossierPutFailureStatus(put),
    });
  }
  return NextResponse.json({
    ok: true,
    version: put.record.version,
    updatedAt: put.record.updatedAt,
    dossier: put.record.dossier,
  });
}
