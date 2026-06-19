import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2DossierPhase1,
  Workshop2DossierSignoffMeta,
  Workshop2TzActionLogPayload,
  Workshop2TzActionLogEntry,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { computeWorkshop2TzSignatureDigest } from '@/lib/production/workshop2-tz-digital-signoff';
import {
  technologistEarlyStagesRequired,
  workshopTzSignerAllowed,
} from '@/lib/production/workshop2-tz-signatory-options';
import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  workshop2DossierPutFailureBody,
  workshop2DossierPutFailureStatus,
} from '@/lib/server/workshop2-dossier-put-utils';
import { applyLifecycleTransition } from '@/lib/server/workshop2-dossier-lifecycle-fsm';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';

type GlobalRowKey = 'designer' | 'technologist' | 'manager' | `extra:${string}`;

function isGlobalRowKey(v: unknown): v is GlobalRowKey {
  if (v === 'designer' || v === 'technologist' || v === 'manager') return true;
  return typeof v === 'string' && v.startsWith('extra:');
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function addLog(
  dossier: Workshop2DossierPhase1,
  by: string,
  rowKey: GlobalRowKey,
  roleTitle?: string
): Workshop2DossierPhase1 {
  const action: Workshop2TzActionLogPayload = rowKey.startsWith('extra:')
    ? {
        type: 'tz_extra_signoff',
        rowId: rowKey.slice('extra:'.length),
        roleTitle: roleTitle?.trim() || 'Роль',
        set: true,
      }
    : {
        type: 'tz_global_signoff',
        role: rowKey as 'designer' | 'technologist' | 'manager',
        set: true,
      };
  const entry: Workshop2TzActionLogEntry = {
    entryId: makeId(),
    at: nowIso(),
    by,
    action,
  };
  return {
    ...dossier,
    tzActionLog: [entry, ...(dossier.tzActionLog ?? [])].slice(0, 120),
  };
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
    articleSku?: unknown;
    rowKey?: unknown;
    signerLabel?: unknown;
    signerOrganization?: unknown;
    extraRoleTitle?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const articleSku = String(b.articleSku ?? '').trim();
  const signerLabel = String(b.signerLabel ?? '').trim();
  const signerOrganization = String(b.signerOrganization ?? '').trim();
  const extraRoleTitle = String(b.extraRoleTitle ?? '').trim();
  if (
    !collectionId ||
    !articleId ||
    !isGlobalRowKey(b.rowKey) ||
    !signerLabel ||
    !signerOrganization
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const actorResolved = resolveWorkshop2ServerActor(req, signerLabel, signerOrganization);
  if (!actorResolved.ok)
    return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:global_signoff'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const cur = record.dossier;
  const globalMinErrors = [
    ...(buildWorkshop2TzGateSnapshot(cur).sectionMinimumErrors.material ?? []),
    ...(buildWorkshop2TzGateSnapshot(cur).sectionMinimumErrors.construction ?? []),
  ];
  if (globalMinErrors.length > 0) {
    return NextResponse.json(
      { ok: false, error: 'global_gate_blocked', sectionErrors: globalMinErrors },
      { status: 409 }
    );
  }

  const rowKey = b.rowKey;
  if (rowKey === 'designer') {
    const designated = cur.tzSignatoryBindings?.designerDisplayLabel?.trim() ?? '';
    if (designated && !workshopTzSignerAllowed(actor.actorLabel, designated)) {
      return NextResponse.json(
        { ok: false, error: 'signer_not_allowed_designer' },
        { status: 409 }
      );
    }
  } else if (rowKey === 'technologist') {
    const designated = cur.tzSignatoryBindings?.technologistDisplayLabel?.trim() ?? '';
    if (designated && !workshopTzSignerAllowed(actor.actorLabel, designated)) {
      return NextResponse.json(
        { ok: false, error: 'signer_not_allowed_technologist' },
        { status: 409 }
      );
    }
    if (
      technologistEarlyStagesRequired(cur.tzSignatoryBindings?.technologistSignStages).length > 0
    ) {
      return NextResponse.json(
        { ok: false, error: 'technologist_early_stages_required' },
        { status: 409 }
      );
    }
  } else if (rowKey === 'manager') {
    const designated = cur.tzSignatoryBindings?.managerDisplayLabel?.trim() ?? '';
    if (designated && !workshopTzSignerAllowed(actor.actorLabel, designated)) {
      return NextResponse.json({ ok: false, error: 'signer_not_allowed_manager' }, { status: 409 });
    }
  } else {
    const rowId = rowKey.slice('extra:'.length);
    const ex = (cur.tzSignatoryBindings?.extraAssigneeRows ?? []).find((r) => r.rowId === rowId);
    const designated = ex?.assigneeDisplayLabel?.trim() ?? '';
    if (designated && !workshopTzSignerAllowed(actor.actorLabel, designated)) {
      return NextResponse.json({ ok: false, error: 'signer_not_allowed_extra' }, { status: 409 });
    }
  }

  const at = nowIso();
  const meta: Workshop2DossierSignoffMeta = {
    by: actor.actorLabel.slice(0, 120),
    byOrganization: (actor.actorOrganization || signerOrganization).slice(0, 200),
    at,
    signatureDigest: computeWorkshop2TzSignatureDigest({
      role: rowKey,
      signerLabel: actor.actorLabel,
      signerOrganization: actor.actorOrganization || signerOrganization,
      collectionId,
      articleId,
      articleSku,
      signedAtIso: at,
    }),
  };
  let next: Workshop2DossierPhase1;
  if (rowKey === 'designer') {
    next = {
      ...cur,
      updatedAt: at,
      updatedBy: actor.actorLabel,
      isVerifiedByDesigner: true,
      designerSignoff: meta,
    };
  } else if (rowKey === 'technologist') {
    next = {
      ...cur,
      updatedAt: at,
      updatedBy: actor.actorLabel,
      isVerifiedByTechnologist: true,
      technologistSignoff: meta,
    };
  } else if (rowKey === 'manager') {
    next = {
      ...cur,
      updatedAt: at,
      updatedBy: actor.actorLabel,
      isVerifiedByManager: true,
      managerSignoff: meta,
    };
  } else {
    const rowId = rowKey.slice('extra:'.length);
    next = {
      ...cur,
      updatedAt: at,
      updatedBy: actor.actorLabel,
      extraTzSignoffsByRowId: {
        ...(cur.extraTzSignoffsByRowId ?? {}),
        [rowId]: meta,
      },
    };
  }
  next = addLog(next, actor.actorLabel, rowKey, extraRoleTitle);
  if ((next.lifecycleState ?? 'draft') === 'accepted') {
    return NextResponse.json(
      { ok: false, error: 'lifecycle_transition_forbidden', reasonCode: 'FSM_TERMINAL_ACCEPTED' },
      { status: 409 }
    );
  }
  const gateAfterSignoff = buildWorkshop2TzGateSnapshot(next);
  if (gateAfterSignoff.sectionSignoffsFull >= 4) {
    const transitioned = applyLifecycleTransition(
      next,
      'handoff_ready',
      actor.actorLabel,
      'Global signoff completed'
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
    next = transitioned.dossier;
  }
  const put = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: next,
    baseVersion: record.version,
    txMeta: {
      eventType: 'global_signoff_commit',
      eventPayload: {
        actorId: actor.actorId,
        actorLabel: actor.actorLabel,
        rowKey,
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
    collectionId,
    articleId,
    version: put.record.version,
    updatedAt: put.record.updatedAt,
    dossier: put.record.dossier,
  });
}
