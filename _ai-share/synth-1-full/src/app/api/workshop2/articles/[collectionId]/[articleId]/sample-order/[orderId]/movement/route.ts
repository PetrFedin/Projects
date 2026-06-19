/**
 * POST — переход движения образца (created → in_transit → received) + validateSampleIntake.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import {
  getNextWorkshop2SampleMovementStatus,
  transitionWorkshop2SampleGoodsMovement,
} from '@/lib/production/workshop2-sample-goods-movement';
import {
  advanceWorkshop2SampleOrderMovement,
  listWorkshop2SampleOrders,
} from '@/lib/server/workshop2-sample-order-repository';
import { isWorkshop2InternalWmsEnabled } from '@/lib/production/workshop2-internal-wms';
import { persistWorkshop2InternalWmsToDossier } from '@/lib/production/workshop2-internal-wms';
import {
  getWorkshop2ServerDossierRecord,
  getWorkshop2ServerDossierStoreMode,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { releaseWorkshop2WmsOnMovementReceived } from '@/lib/server/workshop2-internal-wms-server';
import { buildWorkshop2WmsReleaseFileModeHonesty } from '@/lib/production/workshop2-wms-file-mode-honesty';
import { appendWorkshop2InternalWmsMemoryJournal } from '@/lib/production/workshop2-internal-wms-memory-journal';
import { listWorkshop2VaultDocumentsFromPg } from '@/lib/server/workshop2-dossier-repository';
import {
  buildWorkshop2ArticleDevelopmentState,
  persistWorkshop2ArticleDevelopmentStateToDossier,
} from '@/lib/production/workshop2-article-development-state';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
} from '@/lib/server/workshop2-api-context';
import { autoSyncWorkshop2BrandCalendarAfterSampleMovement } from '@/lib/production/workshop2-dossier-calendar-auto-sync';

type RouteCtx = {
  params: Promise<{ collectionId: string; articleId: string; orderId: string }>;
};

export const POST = withWorkshop2ApiErrorRu(async function postSampleMovement(
  req: NextRequest,
  ctx: RouteCtx
) {
  const { collectionId, articleId, orderId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  const oid = orderId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as Record<string, unknown>;
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(b.actor ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid || !oid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const orders = await listWorkshop2SampleOrders({ collectionId: cid, articleId: aid });
  const existing = orders.find((o) => o.id === oid);
  if (!existing) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  const dossier = record?.dossier ?? null;
  const current = existing.movementStatus;

  const targetRaw = String(
    b.target ?? b.movementStatus ?? ''
  ).trim() as Workshop2SampleGoodsMovementStatus;
  const target =
    targetRaw === 'created' || targetRaw === 'in_transit' || targetRaw === 'received'
      ? targetRaw
      : getNextWorkshop2SampleMovementStatus(current);

  if (!target) {
    return jsonWorkshop2ErrorRu(400, 'no_next_status', {
      messageRu: 'Образец уже принят — дальнейших переходов нет.',
    });
  }

  const transition = transitionWorkshop2SampleGoodsMovement({
    current,
    target,
    dossier,
    strictIntakeOnReceived: b.strictIntake !== false,
  });

  if (!transition.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: transition.error,
        messageRu: transition.messageRu,
        intakeMissing: transition.intakeMissing,
      },
      { status: transition.error === 'intake_blocked' ? 409 : 400 }
    );
  }

  const actor =
    resolveWorkshop2UpdatedBy(req, String(b.actor ?? ''), auth.actor) ?? 'sample-movement-api';
  const order = await advanceWorkshop2SampleOrderMovement({
    id: oid,
    collectionId: cid,
    articleId: aid,
    target: transition.next,
    actor,
  });

  if (!order) {
    return jsonWorkshop2ErrorRu(404, 'not_found');
  }

  let persistedDossier = record?.dossier ?? null;
  let persistedVersion = record?.version;
  let wmsReleaseHonesty: ReturnType<typeof buildWorkshop2WmsReleaseFileModeHonesty> | null = null;

  if (transition.next === 'received' && record) {
    if (isWorkshop2InternalWmsEnabled()) {
      const released = await releaseWorkshop2WmsOnMovementReceived({
        collectionId: cid,
        articleId: aid,
        actor,
        sampleOrderId: oid,
      });
      let nextDossier = persistWorkshop2InternalWmsToDossier(record.dossier, {
        mirror: released.mirror,
      });
      if (released.mirror.wmsSyncStatus === 'memory_fallback') {
        nextDossier = appendWorkshop2InternalWmsMemoryJournal(nextDossier, {
          kind: 'release',
          actor,
          sampleOrderId: oid,
          qty: released.mirror.reservedQty,
          movementCount: released.mirror.movementCount,
          messageRu: released.ok
            ? 'WMS release on intake (memory simulation, dossier journal).'
            : 'WMS release failed (memory mode).',
        });
      }
      const saved = await putWorkshop2ServerDossierRecord({
        collectionId: cid,
        articleId: aid,
        dossier: nextDossier,
        baseVersion: record.version,
        updatedBy: actor,
        txMeta: { eventType: 'workshop2_wms_release_on_intake' },
      });
      if (saved.ok && saved.record) {
        persistedDossier = saved.record.dossier;
        persistedVersion = saved.record.version;
      }
      wmsReleaseHonesty = buildWorkshop2WmsReleaseFileModeHonesty({
        storeMode: getWorkshop2ServerDossierStoreMode(),
        mirror: released.mirror,
        internalWmsEnabled: true,
        releaseOk: released.ok,
      });
    } else {
      wmsReleaseHonesty = buildWorkshop2WmsReleaseFileModeHonesty({
        storeMode: getWorkshop2ServerDossierStoreMode(),
        internalWmsEnabled: false,
        releaseOk: false,
      });
    }
  }

  if (persistedDossier && persistedVersion != null) {
    let vaultFileCount = 0;
    try {
      const docs = await listWorkshop2VaultDocumentsFromPg({
        collectionId: cid,
        articleId: aid,
        organizationId: resolveWorkshop2OrganizationId(req),
      });
      vaultFileCount = docs.filter((d) => d.storagePath?.trim()).length;
    } catch {
      vaultFileCount = (persistedDossier.vaultDocuments ?? []).filter((d) =>
        (d as { storagePath?: string }).storagePath?.trim()
      ).length;
    }
    const snap = buildWorkshop2ArticleDevelopmentState({
      dossier: persistedDossier,
      actor,
      vaultFileCount,
      categoryLeafId: persistedDossier.categoryBindings?.[0]?.categoryLeafId,
      latestSampleOrder: {
        id: order.id,
        status: order.status,
        movementStatus: order.movementStatus,
        movementLogLength: order.movementLog?.length ?? 0,
      },
    });
    await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: persistWorkshop2ArticleDevelopmentStateToDossier(persistedDossier, snap),
      baseVersion: persistedVersion,
      updatedBy: actor,
      txMeta: { eventType: 'workshop2_article_development_state' },
    });
  }

  if (persistedDossier && (transition.next === 'in_transit' || transition.next === 'received')) {
    void autoSyncWorkshop2BrandCalendarAfterSampleMovement({
      collectionId: cid,
      articleId: aid,
      dossier: persistedDossier,
      organizationId: resolveWorkshop2OrganizationId(req),
      sampleOrders: orders.map((o) =>
        o.id === order.id
          ? {
              id: order.id,
              movementStatus: order.movementStatus,
              movementLog: order.movementLog,
            }
          : {
              id: o.id,
              movementStatus: o.movementStatus,
              movementLog: o.movementLog,
            }
      ),
      sampleOrderDueDate: order.dueDate ?? null,
    }).catch(() => {
      /* best-effort calendar sync */
    });
  }

  return NextResponse.json({
    ok: true,
    order,
    movement: {
      status: order.movementStatus,
      log: order.movementLog,
    },
    ...(wmsReleaseHonesty
      ? {
          wmsRelease: {
            released: wmsReleaseHonesty.released,
            pgPrimary: wmsReleaseHonesty.pgPrimary,
            filePersistOnly: wmsReleaseHonesty.filePersistOnly,
            storeMode: wmsReleaseHonesty.storeMode,
            wmsSyncStatus: wmsReleaseHonesty.wmsSyncStatus,
            messageRu: wmsReleaseHonesty.messageRu,
          },
        }
      : {}),
  });
});
