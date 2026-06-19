/**
 * REST-обёртка над workshop2 repository (PostgreSQL) с file-fallback для dev без БД.
 */

import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshop2ServerDossierRecord,
  getWorkshop2ServerDossierStoreMode,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  workshop2DossierPutFailureBody,
  workshop2DossierPutFailureStatus,
} from '@/lib/server/workshop2-dossier-put-utils';
import { workshop2DossierStoreModeMessageRu } from '@/lib/production/workshop2-dossier-store-mode';
import { notifyWorkshop2PlmOnDossierSaved } from '@/lib/server/workshop2-plm-runtime';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
  workshop2DatabaseNotConfiguredResponse,
  workshop2RequiresJwtActorForPut,
} from '@/lib/server/workshop2-api-context';
import { getWorkshop2RealtimeHub } from '@/lib/server/workshop2-realtime-hub';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import {
  applyWorkshop2LifecycleTransition,
  normalizeWorkshop2LifecycleState,
  validateWorkshop2LifecycleTransition,
} from '@/lib/production/workshop2-lifecycle-transition';
import {
  autoSyncWorkshop2BrandCalendarAfterDossierPut,
  shouldAutoSyncWorkshop2CalendarOnDossierPut,
} from '@/lib/production/workshop2-dossier-calendar-auto-sync';
import { syncWorkshop2CostingRubMirrorOnDossier } from '@/lib/production/workshop2-dossier-costing-rub';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import { buildWorkshop2DossierLinkedPaths } from '@/lib/production/workshop2-dossier-linked-paths';
import { applyWorkshop2SupplyBatchPatchOnDossier } from '@/lib/production/workshop2-supply-batch-patch';
import { preserveWorkshop2ServerWinsFieldsOnDossierPut } from '@/lib/production/workshop2-dossier-version-merge-policy';
import { getWorkshop2B2bDossierEditLock } from '@/lib/server/workshop2-b2b-production-handoff';
import type { SupplySnapshot } from '@/lib/production/article-workspace/types';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

function isValidDossier(dossier: unknown): dossier is Workshop2DossierPhase1 {
  return Boolean(
    dossier &&
    typeof dossier === 'object' &&
    Array.isArray((dossier as Workshop2DossierPhase1).assignments)
  );
}

async function getDossier(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  try {
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    if (!record) {
      return jsonWorkshop2ErrorRu(404, 'not_found', {
        messageRu: 'Досье не найдено на сервере',
        storeMode: getWorkshop2ServerDossierStoreMode(),
      });
    }

    const supplierStatus = new URL(req.url).searchParams.get('supplierStatus') === '1';
    if (supplierStatus) {
      const d = record.dossier;
      return NextResponse.json({
        ok: true,
        collectionId: cid,
        articleId: aid,
        supplierStatus: {
          edoStatus: d.edoSignoffMirror?.edoStatus ?? null,
          markingStatus: d.markingHonestSignMirror?.status ?? null,
          gtin: d.passportProductionBrief?.gtin ?? null,
          sampleOrderId: d.sampleWorkflow?.activeSampleOrderId ?? null,
          updatedAt: record.updatedAt,
        },
        workshop2Href: buildWorkshop2DossierLinkedPaths({
          collectionId: cid,
          articleId: aid,
          dossier: d,
        }).workspace,
      });
    }

    const b2bEditLock = await getWorkshop2B2bDossierEditLock({ collectionId: cid, articleId: aid });

    return NextResponse.json({
      ok: true,
      storeMode: getWorkshop2ServerDossierStoreMode(),
      collectionId: record.collectionId,
      articleId: record.articleId,
      version: record.version,
      updatedAt: record.updatedAt,
      dossier: record.dossier,
      b2bEditLock,
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
}

async function putDossier(req: NextRequest, ctx: RouteCtx) {
  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const dossier = (body as { dossier?: Workshop2DossierPhase1 })?.dossier;
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: dossier?.updatedBy,
  });
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const editLock = await getWorkshop2B2bDossierEditLock({ collectionId: cid, articleId: aid });
  if (editLock.locked) {
    return NextResponse.json(
      {
        ok: false,
        error: 'b2b_dossier_locked',
        messageRu:
          editLock.messageRu ??
          'ТЗ заблокировано после передачи заказа в производство — правки только через новый заказ.',
        b2bEditLock: editLock,
      },
      { status: 409 }
    );
  }

  const baseVersion = (body as { baseVersion?: number })?.baseVersion;
  const organizationId = resolveWorkshop2OrganizationId(req);
  const updatedBy =
    resolveWorkshop2UpdatedBy(req, dossier?.updatedBy, auth.actor) ?? auth.actor?.actorLabel;

  if (workshop2RequiresJwtActorForPut() && !auth.actor?.actorId && !auth.actor?.actorLabel) {
    return NextResponse.json(
      {
        ok: false,
        error: 'actor_required',
        message: 'В production требуется JWT-сессия (actor) для сохранения досье.',
      },
      { status: 401 }
    );
  }

  if (!isValidDossier(dossier)) {
    return NextResponse.json(
      { ok: false, error: 'invalid_dossier', message: 'Некорректная структура досье' },
      { status: 400 }
    );
  }

  let previousLifecycleState: string | undefined;
  let priorDossier: Workshop2DossierPhase1 | null = null;
  let dossierToSave = syncWorkshop2CostingRubMirrorOnDossier(dossier);
  const batchMode = req.nextUrl.searchParams.get('batch')?.trim();
  if (batchMode === 'supply') {
    const supplyBody = (body as { supply?: SupplySnapshot | null }).supply;
    const batch = applyWorkshop2SupplyBatchPatchOnDossier({
      dossier: dossierToSave,
      supply: supplyBody,
      acceptVendorWinner: true,
    });
    dossierToSave = batch.dossier;
  }
  try {
    const prior = await getWorkshop2ServerDossierRecord(cid, aid);
    priorDossier = prior?.dossier ?? null;
    previousLifecycleState = prior?.dossier.lifecycleState;
    const from = normalizeWorkshop2LifecycleState(prior?.dossier.lifecycleState);
    const to = normalizeWorkshop2LifecycleState(dossier.lifecycleState);
    const transition = validateWorkshop2LifecycleTransition(from, to);
    if (!transition.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid_lifecycle_transition',
          messageRu: transition.messageRu,
          from,
          to,
        },
        { status: 409 }
      );
    }
    if (from !== to) {
      const applied = applyWorkshop2LifecycleTransition(dossier, to, updatedBy);
      if (applied.transition.allowed) {
        dossierToSave = applied.dossier;
      }
    }
  } catch {
    /* новое досье */
  }

  dossierToSave = preserveWorkshop2ServerWinsFieldsOnDossierPut(priorDossier, dossierToSave);

  try {
    const result = await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: dossierToSave,
      ...(typeof baseVersion === 'number' ? { baseVersion } : {}),
      organizationId,
      updatedBy,
      txMeta: { eventType: 'workshop2_api_put' },
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          message: 'Конфликт версий: досье изменено другим пользователем',
          ...workshop2DossierPutFailureBody(result),
        },
        { status: workshop2DossierPutFailureStatus(result) }
      );
    }

    getWorkshop2RealtimeHub().publishDossierUpdated({
      collectionId: cid,
      articleId: aid,
      version: result.record.version,
      updatedAt: result.record.updatedAt,
      updatedBy: result.record.updatedBy,
    });

    notifyWorkshop2PlmOnDossierSaved({
      collectionId: cid,
      articleId: aid,
      dossier: result.record.dossier as Workshop2DossierPhase1,
      version: result.record.version,
      previousLifecycleState,
    });

    let calendarAutoSync: { synced: number; skipped: boolean } | null = null;
    if (
      shouldAutoSyncWorkshop2CalendarOnDossierPut({
        previous: priorDossier,
        next: result.record.dossier as Workshop2DossierPhase1,
      })
    ) {
      try {
        const orders = await listWorkshop2SampleOrders({
          collectionId: cid,
          articleId: aid,
          organizationId,
        });
        const latestDue = orders.find((o) => o.dueDate)?.dueDate ?? null;
        calendarAutoSync = await autoSyncWorkshop2BrandCalendarAfterDossierPut({
          collectionId: cid,
          articleId: aid,
          dossier: result.record.dossier as Workshop2DossierPhase1,
          organizationId,
          sampleOrderDueDate: latestDue,
        });
      } catch {
        calendarAutoSync = { synced: 0, skipped: true };
      }
    }

    return NextResponse.json({
      ok: true,
      version: result.record.version,
      updatedAt: result.record.updatedAt,
      updatedBy: result.record.updatedBy ?? updatedBy,
      actorId: auth.actor?.actorId,
      storeMode: getWorkshop2ServerDossierStoreMode(),
      postgres: isWorkshop2PostgresEnabled(),
      calendarAutoSync,
      linkedPaths: buildWorkshop2DossierLinkedPaths({
        collectionId: cid,
        articleId: aid,
        articleUrlSegment: aid,
        dossier: result.record.dossier as Workshop2DossierPhase1,
      }),
      messageRu: workshop2DossierStoreModeMessageRu(getWorkshop2ServerDossierStoreMode()),
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
}

export const GET = withWorkshop2ApiErrorRu(getDossier);
export const PUT = withWorkshop2ApiErrorRu(putDossier);
