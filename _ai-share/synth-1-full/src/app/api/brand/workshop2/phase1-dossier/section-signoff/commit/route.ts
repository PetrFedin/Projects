import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2DossierPhase1,
  Workshop2DossierSignoffMeta,
  Workshop2TzActionLogEntry,
  Workshop2TzSignoffSectionKey,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { computeWorkshop2TzSignatureDigest } from '@/lib/production/workshop2-tz-digital-signoff';
import { workshopTzSignerAllowed } from '@/lib/production/workshop2-tz-signatory-options';
import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';
import { applyLifecycleTransition } from '@/lib/server/workshop2-dossier-lifecycle-fsm';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

type SectionSignoffRole = 'brand' | 'tech';
const SECTION_KEYS: Workshop2TzSignoffSectionKey[] = ['general', 'material', 'construction'];

function isSectionKey(v: unknown): v is Workshop2TzSignoffSectionKey {
  return typeof v === 'string' && SECTION_KEYS.includes(v as Workshop2TzSignoffSectionKey);
}

function isRole(v: unknown): v is SectionSignoffRole {
  return v === 'brand' || v === 'tech';
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendSectionSignoffActionLog(
  dossier: Workshop2DossierPhase1,
  by: string,
  section: Workshop2TzSignoffSectionKey,
  role: SectionSignoffRole,
  signerOrganization: string
): Workshop2DossierPhase1 {
  const entry: Workshop2TzActionLogEntry = {
    entryId: makeId(),
    at: nowIso(),
    by,
    action: { type: 'section_signoff', section, role, set: true, signerOrganization },
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
    section?: unknown;
    role?: unknown;
    signerLabel?: unknown;
    signerOrganization?: unknown;
    articleSku?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const signerLabel = String(b.signerLabel ?? '').trim();
  const signerOrganization = String(b.signerOrganization ?? '').trim();
  const articleSku = String(b.articleSku ?? '').trim();
  if (
    !collectionId ||
    !articleId ||
    !isSectionKey(b.section) ||
    !isRole(b.role) ||
    !signerLabel ||
    !signerOrganization
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const actorResolved = resolveWorkshop2ServerActor(req, signerLabel, signerOrganization);
  if (!actorResolved.ok)
    return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:signoff'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const current = record.dossier;
  const bindings = current.tzSignatoryBindings;
  if (b.role === 'brand') {
    const designated = bindings?.designerDisplayLabel?.trim() ?? '';
    if (!designated || !workshopTzSignerAllowed(signerLabel, designated)) {
      return NextResponse.json({ ok: false, error: 'signer_not_allowed_brand' }, { status: 409 });
    }
  } else {
    const designated = bindings?.technologistDisplayLabel?.trim() ?? '';
    if (!designated || !workshopTzSignerAllowed(signerLabel, designated)) {
      return NextResponse.json({ ok: false, error: 'signer_not_allowed_tech' }, { status: 409 });
    }
  }

  const gate = buildWorkshop2TzGateSnapshot(current);
  const sectionErrors =
    b.section === 'assignment' ? [] : ((gate.sectionMinimumErrors as any)?.[b.section] ?? []);
  if (sectionErrors.length > 0) {
    return NextResponse.json(
      { ok: false, error: 'section_gate_blocked', section: b.section, sectionErrors },
      { status: 409 }
    );
  }

  const at = nowIso();
  const signoffMeta: Workshop2DossierSignoffMeta = {
    by: actor.actorLabel.slice(0, 120),
    byOrganization: (actor.actorOrganization || signerOrganization).slice(0, 200),
    at,
    signatureDigest: computeWorkshop2TzSignatureDigest({
      role: `section:${b.section}:${b.role}`,
      signerLabel: actor.actorLabel,
      signerOrganization: actor.actorOrganization || signerOrganization,
      collectionId,
      articleId,
      articleSku,
      signedAtIso: at,
    }),
  };
  let next: Workshop2DossierPhase1 = {
    ...current,
    updatedAt: at,
    updatedBy: actor.actorLabel.slice(0, 120),
    sectionSignoffs: {
      ...(current.sectionSignoffs ?? {}),
      [b.section]: {
        ...(current.sectionSignoffs?.[b.section] ?? {}),
        [b.role]: signoffMeta,
      },
    },
  };
  next = appendSectionSignoffActionLog(
    next,
    actor.actorLabel,
    b.section,
    b.role,
    actor.actorOrganization || signerOrganization
  );
  const lifecycleCurrent = next.lifecycleState ?? 'draft';
  if (lifecycleCurrent === 'accepted') {
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
      'All section signoffs completed'
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
      eventType: 'section_signoff_commit',
      eventPayload: {
        actorId: actor.actorId,
        actorLabel: actor.actorLabel,
        section: b.section,
        role: b.role,
      },
    },
  });
  if (!put.ok) {
    return NextResponse.json(
      { ok: false, error: 'version_conflict', currentVersion: put.currentVersion },
      { status: 409 }
    );
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
