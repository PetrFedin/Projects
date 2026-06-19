/**
 * GET — список PO; POST — создать PO из заявок / material request / sample plan.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  createWorkshop2PurchaseOrder,
  createWorkshop2PurchaseOrdersFromRequisitions,
  listWorkshop2PurchaseOrders,
} from '@/lib/server/workshop2-purchase-order-repository';
import { listWorkshop2MaterialRequisitions } from '@/lib/server/workshop2-material-requisition-repository';
import {
  resolveWorkshop2OrganizationId,
  resolveWorkshop2UpdatedBy,
} from '@/lib/server/workshop2-api-context';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { resolveWorkshop2FactoryErpBaseUrl } from '@/lib/server/workshop2-factory-erp-repository';
import { postWorkshop2PurchaseOrderToErpOnCreate } from '@/lib/server/workshop2-purchase-order-erp-create';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getPurchaseOrders(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const purchaseOrders = await listWorkshop2PurchaseOrders({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
  });
  return NextResponse.json({
    ok: true,
    purchaseOrders,
    erpConfigured: Boolean(resolveWorkshop2FactoryErpBaseUrl()),
  });
});

export const POST = withWorkshop2ApiErrorRu(async function postPurchaseOrders(
  req: NextRequest,
  ctx: RouteCtx
) {
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

  const orgId = resolveWorkshop2OrganizationId(req);
  const createdBy = resolveWorkshop2UpdatedBy(req, String(b.createdBy ?? ''), auth.actor);
  const source = String(b.source ?? 'manual');

  if (source === 'requisitions' || source === 'bom_requisition') {
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    const dossier = record?.dossier;
    const requisitions = await listWorkshop2MaterialRequisitions({
      collectionId: cid,
      articleId: aid,
      organizationId: orgId,
    });
    const bomRefs = dossier?.bomRequisitionByLineRef ?? {};
    const lines =
      requisitions.length > 0
        ? requisitions.map((r) => ({
            lineRef: r.bomLineRef,
            materialLabel: r.materialLabel,
            quantity: r.quantity,
            unit: r.unit,
            requisitionId: r.id,
          }))
        : Object.entries(bomRefs).map(([lineRef, ref]) => {
            const row = ref as { materialLabel?: string; id?: string };
            return {
              lineRef,
              materialLabel: row.materialLabel ?? lineRef,
              quantity: 1,
              requisitionId: row.id ?? lineRef,
            };
          });

    if (lines.length === 0) {
      return jsonWorkshop2ErrorRu(400, 'no_requisitions', {
        messageRu: 'Нет заявок на материал. Создайте заявку из BOM.',
      });
    }

    const purchaseOrders = await createWorkshop2PurchaseOrdersFromRequisitions({
      collectionId: cid,
      articleId: aid,
      organizationId: orgId,
      lines,
    });
    const erpConfigured = Boolean(resolveWorkshop2FactoryErpBaseUrl());
    const synced: typeof purchaseOrders = [];
    for (const po of purchaseOrders) {
      const attempt = await postWorkshop2PurchaseOrderToErpOnCreate({
        collectionId: cid,
        articleId: aid,
        purchaseOrder: po,
      });
      synced.push(attempt.purchaseOrder);
    }
    return NextResponse.json(
      {
        ok: true,
        purchaseOrders: synced,
        erpConfigured,
        erpCreateAttempts: synced.map((p) => ({
          id: p.id,
          status: p.status,
          erpExternalId: p.erpExternalId ?? null,
        })),
        message: `Создано PO: ${synced.length}`,
        createdBy,
      },
      { status: 201 }
    );
  }

  if (source === 'sample_plan') {
    const qty = typeof b.qty === 'number' ? b.qty : Number(b.qty ?? 0);
    const label = b.label != null ? String(b.label) : 'Серия из плана';
    const po = await createWorkshop2PurchaseOrder({
      collectionId: cid,
      articleId: aid,
      organizationId: orgId,
      qty: qty > 0 ? qty : 1,
      lineRef: b.lineRef != null ? String(b.lineRef) : undefined,
      supplierId: b.supplierId != null ? String(b.supplierId) : undefined,
      payload: {
        source: 'sample_plan',
        label,
        createdBy,
        sampleOrderId: b.sampleOrderId,
      },
    });
    const attempt = await postWorkshop2PurchaseOrderToErpOnCreate({
      collectionId: cid,
      articleId: aid,
      purchaseOrder: po,
    });
    return NextResponse.json(
      {
        ok: true,
        purchaseOrders: [attempt.purchaseOrder],
        erpConfigured: Boolean(resolveWorkshop2FactoryErpBaseUrl()),
        erpCreateAttempt: {
          ok: attempt.ok,
          mode: attempt.mode,
          erpExternalId: attempt.erpExternalId ?? null,
          error: attempt.error,
        },
      },
      { status: 201 }
    );
  }

  const qty = typeof b.qty === 'number' ? b.qty : Number(b.qty ?? 1);
  const po = await createWorkshop2PurchaseOrder({
    collectionId: cid,
    articleId: aid,
    organizationId: orgId,
    lineRef: b.lineRef != null ? String(b.lineRef) : undefined,
    supplierId: b.supplierId != null ? String(b.supplierId) : undefined,
    qty: qty > 0 ? qty : 1,
    payload: {
      source: 'manual',
      label: b.label != null ? String(b.label) : undefined,
      createdBy,
    },
  });
  const attempt = await postWorkshop2PurchaseOrderToErpOnCreate({
    collectionId: cid,
    articleId: aid,
    purchaseOrder: po,
  });
  return NextResponse.json(
    {
      ok: true,
      purchaseOrders: [attempt.purchaseOrder],
      erpConfigured: Boolean(resolveWorkshop2FactoryErpBaseUrl()),
      erpCreateAttempt: {
        ok: attempt.ok,
        mode: attempt.mode,
        erpExternalId: attempt.erpExternalId ?? null,
        error: attempt.error,
      },
    },
    { status: 201 }
  );
});
