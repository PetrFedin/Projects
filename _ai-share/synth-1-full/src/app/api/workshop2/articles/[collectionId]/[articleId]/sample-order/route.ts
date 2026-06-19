/**
 * GET — список заказов образца; POST — создать заказ образца.
 */
import { NextRequest, NextResponse } from 'next/server';
import type {
  Workshop2SampleOrderSizes,
  Workshop2NestingRequest,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { normalizeWorkshop2NestingRequest } from '@/lib/production/workshop2-nesting-request';
import {
  createWorkshop2SampleOrder,
  isWorkshop2SampleOrderMemoryStoreAllowed,
  listWorkshop2SampleOrders,
} from '@/lib/server/workshop2-sample-order-repository';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
} from '@/lib/server/workshop2-api-context';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { evaluateWorkshop2PendingChangeRequestReorderGate } from '@/lib/production/workshop2-qc-defect-change-request';
import { isWorkshop2InternalWmsEnabled } from '@/lib/production/workshop2-internal-wms';
import { persistWorkshop2InternalWmsToDossier } from '@/lib/production/workshop2-internal-wms';
import {
  getWorkshop2ServerDossierRecord,
  getWorkshop2ServerDossierStoreMode,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import { buildWorkshop2SampleOrderFileModeHonesty } from '@/lib/production/workshop2-sample-order-file-mode-honesty';
import {
  localizeWorkshop2GateChecks,
  mapWorkshop2GateReasonCodeToRu,
} from '@/lib/production/workshop2-gate-messages-ru';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { listWorkshop2VaultDocumentsFromPg } from '@/lib/server/workshop2-dossier-repository';
import { reserveWorkshop2WmsForSampleOrder } from '@/lib/server/workshop2-internal-wms-server';
import {
  buildWorkshop2ArticleDevelopmentState,
  persistWorkshop2ArticleDevelopmentStateToDossier,
} from '@/lib/production/workshop2-article-development-state';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const orders = await listWorkshop2SampleOrders({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
  });
  const storeMode = getWorkshop2ServerDossierStoreMode();
  const honesty = buildWorkshop2SampleOrderFileModeHonesty({
    storeMode,
    allowed: true,
  });
  return NextResponse.json({
    ok: true,
    orders,
    storeMode: honesty.storeMode,
    pgPrimary: honesty.pgPrimary,
    filePersistOnly: honesty.filePersistOnly,
    demoBadgeRu: honesty.demoBadgeRu,
    memoryFallback: !isWorkshop2PostgresEnabled() && isWorkshop2SampleOrderMemoryStoreAllowed(),
  });
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as Record<string, unknown>;
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(b.createdBy ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const createdBy =
    resolveWorkshop2UpdatedBy(req, String(b.createdBy ?? ''), auth.actor) ?? 'sample-order-api';

  const existingOrders = await listWorkshop2SampleOrders({
    collectionId: cid,
    articleId: aid,
  });
  const isReorder = existingOrders.length > 0;

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  const organizationId = resolveWorkshop2OrganizationId(req);
  let vaultFileCount = 0;
  let categoryLeafId: string | undefined;
  if (record) {
    if (isReorder) {
      const reorderGate = evaluateWorkshop2PendingChangeRequestReorderGate(record.dossier);
      if (reorderGate) {
        return jsonWorkshop2ErrorRu(409, 'change_requests_pending', {
          messageRu: reorderGate.messageRu,
        });
      }
    }
    try {
      const docs = await listWorkshop2VaultDocumentsFromPg({
        collectionId: cid,
        articleId: aid,
        organizationId,
      });
      vaultFileCount = docs.filter((d) => d.storagePath?.trim()).length;
    } catch {
      vaultFileCount = (record.dossier.vaultDocuments ?? []).filter((d) =>
        (d as { storagePath?: string }).storagePath?.trim()
      ).length;
    }
    categoryLeafId =
      record.dossier.categoryBindings?.[0]?.categoryLeafId ??
      (typeof b.categoryLeafId === 'string' ? b.categoryLeafId : undefined);
    const gate = evaluateWorkshop2SampleOrderGate({
      dossier: record.dossier,
      categoryLeafId,
      vaultFileCount,
    });
    if (!gate.allowed) {
      const blocker = gate.readiness.checks.find((c) => c.severity === 'blocker');
      const labDipBlocked = blocker?.id === 'supply.lab_dip.not_approved';
      const honesty = buildWorkshop2SampleOrderFileModeHonesty({
        storeMode: getWorkshop2ServerDossierStoreMode(),
        allowed: false,
      });
      void enqueueWorkshop2DomainEvent({
        type: 'dossier.gate_blocked',
        collectionId: cid,
        articleId: aid,
        payload: {
          gateScope: 'sample_order',
          reason: labDipBlocked ? 'lab_dip_pending' : 'handoff_not_ready',
          messageRu: blocker?.messageRu,
          checks: gate.readiness.checks,
        },
      }).catch(() => {
        /* best-effort */
      });
      const localizedChecks = localizeWorkshop2GateChecks(
        gate.readiness.checks.map((c) => ({
          id: c.id,
          severity: c.severity,
          messageRu: c.messageRu,
        }))
      );
      const gateMessageRu =
        mapWorkshop2GateReasonCodeToRu(labDipBlocked ? 'lab_dip_pending' : 'handoff_not_ready') ??
        blocker?.messageRu ??
        honesty.gateMessageRu;
      return jsonWorkshop2ErrorRu(409, labDipBlocked ? 'lab_dip_pending' : 'handoff_not_ready', {
        messageRu: gateMessageRu,
        checks: localizedChecks,
        storeMode: honesty.storeMode,
        filePersistOnly: honesty.filePersistOnly,
        pgPrimary: honesty.pgPrimary,
      });
    }
  }

  const orderHonesty = buildWorkshop2SampleOrderFileModeHonesty({
    storeMode: getWorkshop2ServerDossierStoreMode(),
    allowed: true,
  });

  let order;
  try {
    order = await createWorkshop2SampleOrder({
      collectionId: cid,
      articleId: aid,
      organizationId: resolveWorkshop2OrganizationId(req),
      contractorId:
        b.contractorId != null
          ? String(b.contractorId)
          : b.factoryId != null
            ? String(b.factoryId)
            : undefined,
      dueDate: b.dueDate != null ? String(b.dueDate) : undefined,
      sizes:
        b.sizes && typeof b.sizes === 'object' ? (b.sizes as Workshop2SampleOrderSizes) : undefined,
      quantity: typeof b.quantity === 'number' ? b.quantity : undefined,
      notes: b.notes != null ? String(b.notes) : undefined,
      status: b.status != null ? (String(b.status) as 'draft') : undefined,
      createdBy,
      nestingRequest:
        b.nestingRequest && typeof b.nestingRequest === 'object'
          ? normalizeWorkshop2NestingRequest(b.nestingRequest as Workshop2NestingRequest)
          : undefined,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'sample_order_create_failed';
    if (msg === 'WORKSHOP2_SAMPLE_ORDER_PG_REQUIRED') {
      return jsonWorkshop2ErrorRu(503, 'pg_required', {
        messageRu: 'Заказ образца требует PostgreSQL — memory fallback отключён в production.',
        pgPrimary: false,
        filePersistOnly: false,
      });
    }
    throw e;
  }

  let wmsReserve: Awaited<ReturnType<typeof reserveWorkshop2WmsForSampleOrder>> | undefined;
  let wmsPersistError: string | undefined;
  let devStatePersistError: string | undefined;

  const persistDevStateSnapshot = async (
    baseDossier: NonNullable<typeof record>['dossier'],
    baseVersion: number,
    vaultCount: number,
    leaf?: string
  ) => {
    const snap = buildWorkshop2ArticleDevelopmentState({
      dossier: baseDossier,
      actor: createdBy,
      vaultFileCount: vaultCount,
      categoryLeafId: leaf,
      latestSampleOrder: {
        id: order.id,
        status: order.status,
        movementStatus: order.movementStatus,
        movementLogLength: order.movementLog?.length ?? 0,
      },
    });
    const withDev = persistWorkshop2ArticleDevelopmentStateToDossier(baseDossier, snap);
    const saved = await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: withDev,
      baseVersion,
      updatedBy: createdBy,
      txMeta: { eventType: 'workshop2_article_development_state' },
    });
    if (!saved.ok) {
      devStatePersistError = saved.error ?? 'dev_state_persist_failed';
    }
    return saved;
  };

  if (record && isWorkshop2InternalWmsEnabled()) {
    try {
      wmsReserve = await reserveWorkshop2WmsForSampleOrder({
        collectionId: cid,
        articleId: aid,
        dossier: record.dossier,
        actor: createdBy,
        sampleOrderId: order.id,
      });
      if (!wmsReserve.ok && wmsReserve.reason === 'internal_wms_disabled') {
        wmsPersistError = 'internal_wms_disabled';
      } else {
        const nextDossier = persistWorkshop2InternalWmsToDossier(record.dossier, {
          mirror: wmsReserve.mirror,
        });
        const saved = await putWorkshop2ServerDossierRecord({
          collectionId: cid,
          articleId: aid,
          dossier: nextDossier,
          baseVersion: record.version,
          updatedBy: createdBy,
          txMeta: { eventType: 'workshop2_wms_reserve_on_sample_order' },
        });
        if (!saved.ok) {
          wmsPersistError = saved.error ?? 'dossier_version_conflict';
        } else if (saved.record) {
          await persistDevStateSnapshot(
            saved.record.dossier,
            saved.record.version,
            vaultFileCount,
            categoryLeafId
          );
        }
      }
    } catch (e) {
      wmsPersistError = e instanceof Error ? e.message : 'wms_reserve_failed';
    }
  } else if (record) {
    await persistDevStateSnapshot(record.dossier, record.version, vaultFileCount, categoryLeafId);
  }

  void enqueueWorkshop2DomainEvent({
    type: 'dossier.gate_passed',
    collectionId: cid,
    articleId: aid,
    payload: { gateScope: 'sample_order', orderId: order.id },
  }).catch(() => {
    /* best-effort */
  });
  void enqueueWorkshop2DomainEvent({
    type: 'sample_order.status_changed',
    collectionId: cid,
    articleId: aid,
    payload: { orderId: order.id, status: order.status, previousStatus: 'none' },
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json(
    {
      ok: true,
      order,
      devStatePersistError,
      storeMode: orderHonesty.storeMode,
      filePersistOnly: orderHonesty.filePersistOnly,
      pgPrimary: orderHonesty.pgPrimary,
      demoBadgeRu: orderHonesty.demoBadgeRu,
      messageRu: orderHonesty.successMessageRu,
      wmsReserve: wmsReserve
        ? {
            ok: wmsReserve.ok,
            reservedLines: wmsReserve.reservedLines,
            deficitLineCount: wmsReserve.deficitLineCount,
            warningDeficit: wmsReserve.deficitLineCount > 0,
            idempotent: wmsReserve.reason === 'idempotent_reserve_skip',
            persistError: wmsPersistError,
          }
        : undefined,
    },
    { status: 201 }
  );
}
