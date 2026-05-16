import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2DossierPhase1,
  Workshop2TechPackFactoryHandoff,
  Workshop2TzActionLogEntry,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';
import { buildWorkshop2TzPreflightReport } from '@/lib/production/workshop2-tz-trace';
import { applyLifecycleTransition } from '@/lib/server/workshop2-dossier-lifecycle-fsm';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';

function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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
    revisionLabel?: unknown;
    windowNote?: unknown;
    contactLabel?: unknown;
    channel?: unknown;
    attachmentIds?: unknown;
    brandDispatched?: unknown;
    factoryReceived?: unknown;
    actorLabel?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const revisionLabel = String(b.revisionLabel ?? '').trim();
  const windowNote = String(b.windowNote ?? '').trim();
  const contactLabel = String(b.contactLabel ?? '').trim();
  const actorLabel = String(b.actorLabel ?? '').trim();
  const attachmentIds = Array.isArray(b.attachmentIds)
    ? b.attachmentIds.map((x) => String(x ?? '').trim()).filter(Boolean)
    : [];
  const brandDispatched = b.brandDispatched as { at?: unknown; by?: unknown } | undefined;
  const factoryReceived = b.factoryReceived as { at?: unknown; by?: unknown } | undefined;
  const channel = String(b.channel ?? '').trim();
  if (
    !collectionId ||
    !articleId ||
    !revisionLabel ||
    !channel ||
    attachmentIds.length === 0 ||
    !brandDispatched?.at ||
    !brandDispatched?.by ||
    !factoryReceived?.at ||
    !factoryReceived?.by
  ) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const actorResolved = resolveWorkshop2ServerActor(req, actorLabel);
  if (!actorResolved.ok) return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:handoff_commit'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }
  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const cur = record.dossier;
  const gate = buildWorkshop2TzGateSnapshot(cur);
  const minErr = [...(gate.sectionMinimumErrors.material ?? []), ...(gate.sectionMinimumErrors.construction ?? [])];
  if (minErr.length > 0) {
    return NextResponse.json({ ok: false, error: 'global_gate_blocked', sectionErrors: minErr }, { status: 409 });
  }
  const preflight = buildWorkshop2TzPreflightReport(cur);
  if (!preflight.ok) {
    return NextResponse.json({ ok: false, error: 'preflight_blocked' }, { status: 409 });
  }
  const attachments = cur.techPackAttachments ?? [];
  const verifiedTechPackAuditAtSend = attachments
    .filter((a) => attachmentIds.includes(a.attachmentId) && a.canonicalSource === 'object_store_verified')
    .map((a) => ({
      attachmentId: a.attachmentId,
      remoteObjectKey: a.remoteObjectKey?.trim() || undefined,
      integritySha256Full: a.integritySha256Full?.trim().toLowerCase() || undefined,
      remoteSyncedAt: a.remoteSyncedAt?.trim() || undefined,
      objectStoreEtag: a.objectStoreEtag?.trim() || undefined,
    }));
  const hid = makeId();
  const row: Workshop2TechPackFactoryHandoff = {
    handoffId: hid,
    createdAt: new Date().toISOString(),
    createdBy: actor.actorLabel.slice(0, 200) || 'system',
    brandDispatchedAt: String(brandDispatched.at),
    brandDispatchedBy: String(brandDispatched.by).slice(0, 240),
    factoryReceivedAt: String(factoryReceived.at),
    factoryReceivedBy: String(factoryReceived.by).slice(0, 240),
    packageRevisionLabel: revisionLabel,
    windowNote: windowNote || undefined,
    contactLabel: contactLabel || undefined,
    channel: channel as Workshop2TechPackFactoryHandoff['channel'],
    status: 'sent',
    sentAt: new Date().toISOString(),
    attachmentIds,
    ...(verifiedTechPackAuditAtSend.length > 0 ? { verifiedTechPackAuditAtSend } : {}),
  };
  const log: Workshop2TzActionLogEntry = {
    entryId: makeId(),
    at: new Date().toISOString(),
    by: actor.actorLabel.slice(0, 200) || 'system',
    action: {
      type: 'tech_pack_handoff',
      handoffId: hid,
      detail: `Передача пакета (${revisionLabel}, ${channel}): вложений ${attachmentIds.length}.`,
    },
  };
  let next: Workshop2DossierPhase1 = {
    ...cur,
    updatedAt: new Date().toISOString(),
    updatedBy: actor.actorLabel.slice(0, 200) || 'system',
    techPackFactoryHandoffs: [...(cur.techPackFactoryHandoffs ?? []), row],
    tzActionLog: [log, ...(cur.tzActionLog ?? [])].slice(0, 120),
  };
  const lifecycleActor = actor.actorLabel.slice(0, 200) || 'system';
  const state = next.lifecycleState ?? 'draft';
  if (state === 'draft') {
    const toReady = applyLifecycleTransition(
      next,
      'handoff_ready',
      lifecycleActor,
      'FSM auto-transition before handoff commit'
    );
    if (!toReady.ok) {
      return NextResponse.json(
        { ok: false, error: toReady.error, reasonCode: toReady.reasonCode, fromState: toReady.fromState, toState: toReady.toState },
        { status: 409 }
      );
    }
    next = toReady.dossier;
  }
  const toSent = applyLifecycleTransition(next, 'sent_to_production', lifecycleActor, 'Handoff committed');
  if (!toSent.ok) {
    return NextResponse.json(
      { ok: false, error: toSent.error, reasonCode: toSent.reasonCode, fromState: toSent.fromState, toState: toSent.toState },
      { status: 409 }
    );
  }
  next = toSent.dossier;
  const put = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: next,
    baseVersion: record.version,
    txMeta: {
      eventType: 'handoff_commit',
      eventPayload: {
        actorId: actor.actorId,
        actorLabel: actor.actorLabel,
        handoffId: hid,
        revisionLabel,
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
    version: put.record.version,
    updatedAt: put.record.updatedAt,
    dossier: put.record.dossier,
  });
}
