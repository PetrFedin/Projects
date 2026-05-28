/**
 * POST — выгрузка PO в ERP фабрики (WORKSHOP2_FACTORY_ERP_BASE_URL) или PLM outbox.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { syncWorkshop2PurchaseOrdersToErp } from '@/lib/server/workshop2-purchase-order-erp-sync';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    /* пустое тело */
  }

  const purchaseOrderIds = Array.isArray(body.purchaseOrderIds)
    ? body.purchaseOrderIds.map(String)
    : undefined;

  const result = await syncWorkshop2PurchaseOrdersToErp({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
    purchaseOrderIds,
  });

  const message = result.erpNotConfigured
    ? 'WORKSHOP2_FACTORY_ERP_BASE_URL не задан — синхронизация в ERP невозможна'
    : result.synced > 0
      ? `Синхронизировано PO: ${result.synced}${result.failed ? `, ошибок: ${result.failed}` : ''}`
      : result.skipped > 0
        ? 'Все PO уже синхронизированы'
        : result.failed > 0
          ? `Ошибок синхронизации: ${result.failed}`
          : 'Нет PO для синхронизации';

  return NextResponse.json({
    ok: result.failed === 0 && !result.erpNotConfigured,
    ...result,
    message,
  });
}
