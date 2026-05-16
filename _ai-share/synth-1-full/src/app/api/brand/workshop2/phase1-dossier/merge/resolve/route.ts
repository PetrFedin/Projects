import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2DossierPhase1, Workshop2TzActionLogEntry } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';

type ResolutionChoice = 'server' | 'local';

function makeId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `w2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function collectConflictingFields(serverDossier: Workshop2DossierPhase1, localDossier: Workshop2DossierPhase1): string[] {
  const out: string[] = [];
  for (const k of Object.keys(localDossier) as (keyof Workshop2DossierPhase1)[]) {
    if (!Object.prototype.hasOwnProperty.call(serverDossier, k)) continue;
    const s = JSON.stringify(serverDossier[k]);
    const l = JSON.stringify(localDossier[k]);
    if (s !== l) out.push(String(k));
  }
  return out.sort();
}

function applyManualResolution(input: {
  serverDossier: Workshop2DossierPhase1;
  localDossier: Workshop2DossierPhase1;
  resolutions: Record<string, ResolutionChoice>;
}): Workshop2DossierPhase1 {
  const merged: Workshop2DossierPhase1 = { ...input.serverDossier };
  for (const [field, choice] of Object.entries(input.resolutions)) {
    if (choice !== 'local') continue;
    const key = field as keyof Workshop2DossierPhase1;
    if (!Object.prototype.hasOwnProperty.call(input.localDossier, key)) continue;
    (merged as Record<string, unknown>)[field] = (input.localDossier as Record<string, unknown>)[field];
  }
  return merged;
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
    localDossier?: unknown;
    resolutions?: unknown;
    actorLabel?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const actorLabel = String(b.actorLabel ?? '').trim() || 'system';
  const localDossier = b.localDossier as Workshop2DossierPhase1 | undefined;
  const resolutionsRaw = b.resolutions as Record<string, ResolutionChoice> | undefined;
  if (!collectionId || !articleId || !localDossier || !Array.isArray(localDossier.assignments) || !resolutionsRaw) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const actorResolved = resolveWorkshop2ServerActor(req, actorLabel);
  if (!actorResolved.ok) return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:merge_resolve'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }

  const cur = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!cur) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });

  const conflictingFields = collectConflictingFields(cur.dossier, localDossier);
  const unresolved = conflictingFields.filter((f) => resolutionsRaw[f] !== 'server' && resolutionsRaw[f] !== 'local');
  if (unresolved.length > 0) {
    return NextResponse.json({ ok: false, error: 'unresolved_fields', unresolved }, { status: 400 });
  }

  const merged = applyManualResolution({
    serverDossier: cur.dossier,
    localDossier,
    resolutions: resolutionsRaw,
  });
  const log: Workshop2TzActionLogEntry = {
    entryId: makeId(),
    at: new Date().toISOString(),
    by: actor.actorLabel.slice(0, 200),
    action: {
      type: 'dossier_edit',
      summaries: [
        `Manual merge resolve: ${conflictingFields.length} conflict fields resolved (${conflictingFields
          .slice(0, 8)
          .join(', ')})`,
      ],
    },
  };
  const next: Workshop2DossierPhase1 = {
    ...merged,
    updatedAt: new Date().toISOString(),
    updatedBy: actor.actorLabel.slice(0, 200),
    tzActionLog: [log, ...(merged.tzActionLog ?? [])].slice(0, 120),
  };

  const put = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: next,
    baseVersion: cur.version,
    txMeta: {
      eventType: 'merge_manual_resolve',
      eventPayload: {
        actorLabel,
        actorId: actor.actorId,
        conflicts: conflictingFields.length,
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
    mode: 'server_merge_manual',
    version: put.record.version,
    updatedAt: put.record.updatedAt,
    dossier: put.record.dossier,
    mergeReport: {
      mode: 'manual',
      conflictingFields,
      resolvedBy: actor.actorLabel.slice(0, 200),
      resolvedAt: new Date().toISOString(),
    },
  });
}
