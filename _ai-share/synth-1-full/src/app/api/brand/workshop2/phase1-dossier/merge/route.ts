import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2DossierPhase1,
  Workshop2DossierSignoffMeta,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { actorHasAnyRole, resolveWorkshop2ServerActor } from '@/lib/server/workshop2-server-actor';

type Workshop2MergeReport = {
  mode: 'auto';
  conflictingFields: string[];
  manualReviewRequired: boolean;
  criticalConflicts: string[];
};

const CRITICAL_MERGE_FIELDS: readonly (keyof Workshop2DossierPhase1)[] = [
  'tzSignatoryBindings',
  'sectionSignoffs',
  'techPackFactoryHandoffs',
  'productionModel',
  'sampleIntakeRelease',
];

function hasOwnValue<T extends object>(obj: T, key: keyof T): boolean {
  return (
    Object.prototype.hasOwnProperty.call(obj, key) &&
    (obj as Record<string, unknown>)[key as string] !== undefined
  );
}

function buildMergeReport(
  serverDossier: Workshop2DossierPhase1,
  localDossier: Workshop2DossierPhase1
): Workshop2MergeReport {
  const fields = new Set<string>();
  for (const k of Object.keys(localDossier) as (keyof Workshop2DossierPhase1)[]) {
    if (!hasOwnValue(serverDossier, k) || !hasOwnValue(localDossier, k)) continue;
    const s = JSON.stringify(serverDossier[k]);
    const l = JSON.stringify(localDossier[k]);
    if (s !== l) fields.add(String(k));
  }
  const conflictingFields = [...fields].sort();
  const criticalConflicts = conflictingFields.filter((f) =>
    (CRITICAL_MERGE_FIELDS as readonly string[]).includes(f)
  );
  return {
    mode: 'auto',
    conflictingFields,
    manualReviewRequired: criticalConflicts.length > 0,
    criticalConflicts,
  };
}

function newerMeta(
  a: Workshop2DossierSignoffMeta | undefined,
  b: Workshop2DossierSignoffMeta | undefined
): Workshop2DossierSignoffMeta | undefined {
  if (!a) return b;
  if (!b) return a;
  return (a.at ?? '') >= (b.at ?? '') ? a : b;
}

function mergeUniqueBy<T>(items: T[], key: (v: T) => string): T[] {
  const out = new Map<string, T>();
  for (const i of items) out.set(key(i), i);
  return [...out.values()];
}

function autoMergeDossier(
  serverDossier: Workshop2DossierPhase1,
  localDossier: Workshop2DossierPhase1
) {
  const merged: Workshop2DossierPhase1 = {
    ...serverDossier,
    ...localDossier,
    sectionSignoffs: {
      ...(serverDossier.sectionSignoffs ?? {}),
      ...(localDossier.sectionSignoffs ?? {}),
      general: {
        ...(serverDossier.sectionSignoffs?.general ?? {}),
        ...(localDossier.sectionSignoffs?.general ?? {}),
        brand: newerMeta(
          serverDossier.sectionSignoffs?.general?.brand,
          localDossier.sectionSignoffs?.general?.brand
        ),
        tech: newerMeta(
          serverDossier.sectionSignoffs?.general?.tech,
          localDossier.sectionSignoffs?.general?.tech
        ),
      },
      visuals: {
        ...(serverDossier.sectionSignoffs?.visuals ?? {}),
        ...(localDossier.sectionSignoffs?.visuals ?? {}),
        brand: newerMeta(
          serverDossier.sectionSignoffs?.visuals?.brand,
          localDossier.sectionSignoffs?.visuals?.brand
        ),
        tech: newerMeta(
          serverDossier.sectionSignoffs?.visuals?.tech,
          localDossier.sectionSignoffs?.visuals?.tech
        ),
      },
      material: {
        ...(serverDossier.sectionSignoffs?.material ?? {}),
        ...(localDossier.sectionSignoffs?.material ?? {}),
        brand: newerMeta(
          serverDossier.sectionSignoffs?.material?.brand,
          localDossier.sectionSignoffs?.material?.brand
        ),
        tech: newerMeta(
          serverDossier.sectionSignoffs?.material?.tech,
          localDossier.sectionSignoffs?.material?.tech
        ),
      },
      construction: {
        ...(serverDossier.sectionSignoffs?.construction ?? {}),
        ...(localDossier.sectionSignoffs?.construction ?? {}),
        brand: newerMeta(
          serverDossier.sectionSignoffs?.construction?.brand,
          localDossier.sectionSignoffs?.construction?.brand
        ),
        tech: newerMeta(
          serverDossier.sectionSignoffs?.construction?.tech,
          localDossier.sectionSignoffs?.construction?.tech
        ),
      },
    },
    techPackFactoryHandoffs: mergeUniqueBy(
      [
        ...(serverDossier.techPackFactoryHandoffs ?? []),
        ...(localDossier.techPackFactoryHandoffs ?? []),
      ],
      (h) => h.handoffId
    ),
    tzActionLog: mergeUniqueBy(
      [...(serverDossier.tzActionLog ?? []), ...(localDossier.tzActionLog ?? [])],
      (e) => e.entryId
    )
      .sort((a, b) => (b.at ?? '').localeCompare(a.at ?? ''))
      .slice(0, 120),
    updatedAt: localDossier.updatedAt ?? serverDossier.updatedAt,
    updatedBy: localDossier.updatedBy ?? serverDossier.updatedBy,
  };
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
    actorLabel?: unknown;
  };
  const collectionId = String(b.collectionId ?? '').trim();
  const articleId = String(b.articleId ?? '').trim();
  const localDossier = b.localDossier as Workshop2DossierPhase1 | undefined;
  if (!collectionId || !articleId || !localDossier || !Array.isArray(localDossier.assignments)) {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const actorResolved = resolveWorkshop2ServerActor(
    req,
    String(b.actorLabel ?? '').trim() || 'system'
  );
  if (!actorResolved.ok)
    return NextResponse.json({ ok: false, error: 'actor_required' }, { status: 401 });
  const actor = actorResolved.actor;
  if (!actorHasAnyRole(actor, ['production:edit', 'w2:merge'])) {
    return NextResponse.json({ ok: false, error: 'forbidden_actor_role' }, { status: 403 });
  }
  const cur = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!cur) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  const mergeReport = buildMergeReport(cur.dossier, localDossier);
  const merged = autoMergeDossier(cur.dossier, localDossier);
  const put = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier: merged,
    baseVersion: cur.version,
    txMeta: {
      eventType: 'merge_auto',
      eventPayload: {
        actorId: actor.actorId,
        actorLabel: actor.actorLabel,
        conflicts: mergeReport.conflictingFields.length,
        criticalConflicts: mergeReport.criticalConflicts.length,
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
    mode: 'server_merge_auto',
    mergeReport,
    version: put.record.version,
    updatedAt: put.record.updatedAt,
    dossier: put.record.dossier,
  });
}
