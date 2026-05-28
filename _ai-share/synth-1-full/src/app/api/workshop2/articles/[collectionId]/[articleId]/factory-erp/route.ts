/**
 * GET — статус ERP фабрики; POST — sync PO в ERP (POST /purchase-orders, erpOrderId).
 */
import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  getWorkshop2FactoryErpState,
  runWorkshop2FactoryErpSync,
} from '@/lib/server/workshop2-factory-erp-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import {
  getWorkshop2ServerDossierRecord,
  getWorkshop2ServerDossierStoreMode,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  appendWorkshop2LiveErpPostJournal,
  evaluateWorkshop2LiveErpPostResponse,
} from '@/lib/production/workshop2-live-erp-e2e-contract';
import {
  isWorkshop2FilePersistStoreMode,
  isWorkshop2PgPrimaryStoreMode,
} from '@/lib/production/workshop2-dossier-store-mode';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function getFactoryErp(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const state = await getWorkshop2FactoryErpState({
    collectionId: collectionId.trim(),
    articleId: articleId.trim(),
  });
  const messageRu =
    state.syncStatus === 'not_configured'
      ? 'ERP не настроен: задайте WORKSHOP2_FACTORY_ERP_BASE_URL (синхронизация fail-closed, только journal).'
      : state.syncStatus === 'synced' && state.erpOrderId
        ? `ERP синхронизирован: erpOrderId=${state.erpOrderId}`
        : state.syncStatus === 'error' && state.lastError
          ? `ERP ошибка: ${state.lastError}`
          : state.baseUrlConfigured
            ? 'ERP URL задан — ожидается POST /purchase-orders с erpOrderId.'
            : undefined;
  return NextResponse.json({
    ok: true,
    state,
    messageRu,
    checks: {
      baseUrlConfigured: state.baseUrlConfigured,
      erpOrderIdPresent: Boolean(state.erpOrderId?.trim()),
      livePostAttempted: false,
    },
  });
}

async function postFactoryErp(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    /* пустое тело */
  }

  const state = await runWorkshop2FactoryErpSync({
    collectionId: cid,
    articleId: aid,
    sku: body.sku ? String(body.sku) : undefined,
  });
  const messageRu =
    state.syncStatus === 'synced' && state.erpOrderId
      ? `Live ERP POST ACK: erpOrderId=${state.erpOrderId}`
      : state.syncStatus === 'not_configured'
        ? 'ERP не настроен: WORKSHOP2_FACTORY_ERP_BASE_URL не задан — POST sync не выполняется.'
        : state.lastError
          ? `ERP sync fail-closed (${state.lastError})`
          : state.syncStatus === 'error'
            ? 'ERP sync error — проверьте доступность POST /purchase-orders и формат ответа { erpOrderId }.'
            : 'erpOrderId не получен — synced без ACK запрещён (fail-closed).';

  const storeMode = getWorkshop2ServerDossierStoreMode();
  const pgPrimary = isWorkshop2PgPrimaryStoreMode(storeMode);
  const filePersistOnly = isWorkshop2FilePersistStoreMode(storeMode);

  let dossierMirror: {
    erpOrderId?: string;
    factoryErpSync?: { erpOrderId?: string; syncStatus?: string };
    factoryErpStagingMirror?: { erpOrderIdAckInPg?: boolean; partnerAckId?: string | null };
  } | null = null;

  if (state.syncStatus === 'synced' && state.erpOrderId) {
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    if (record) {
      const actor =
        resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor) ?? 'factory-erp-api';
      const outcome = evaluateWorkshop2LiveErpPostResponse({
        httpStatus: 200,
        json: { erpOrderId: state.erpOrderId },
      });
      const nextDossier = appendWorkshop2LiveErpPostJournal({
        dossier: record.dossier,
        actor,
        outcome,
        baseUrl: state.baseUrl,
      });
      const saved = await putWorkshop2ServerDossierRecord({
        collectionId: cid,
        articleId: aid,
        dossier: nextDossier,
        updatedBy: actor,
        txMeta: { eventType: 'workshop2_factory_erp_live_post_mirror' },
      });
      if (saved.ok) {
        dossierMirror = {
          erpOrderId: state.erpOrderId,
          factoryErpSync: saved.record.dossier.factoryErpSync,
          factoryErpStagingMirror: saved.record.dossier.factoryErpStagingMirror,
        };
      }
    }
  }

  if (state.syncStatus === 'not_configured') {
    return NextResponse.json(
      {
        ok: false,
        state,
        messageRu,
        storeMode,
        pgPrimary,
        filePersistOnly,
        checks: {
          baseUrlConfigured: false,
          erpOrderIdPresent: false,
          livePostAttempted: false,
        },
      },
      { status: 503 }
    );
  }

  const httpStatus =
    state.syncStatus === 'synced' && state.erpOrderId
      ? 200
      : state.syncStatus === 'error'
        ? 502
        : 409;

  return NextResponse.json(
    {
      ok: state.syncStatus === 'synced' && Boolean(state.erpOrderId),
      state,
      messageRu,
      storeMode,
      pgPrimary,
      filePersistOnly,
      dossierMirror,
      checks: {
        baseUrlConfigured: state.baseUrlConfigured,
        erpOrderIdPresent: Boolean(state.erpOrderId?.trim()),
        livePostAttempted: state.baseUrlConfigured,
      },
    },
    { status: httpStatus }
  );
}

export const GET = withWorkshop2ApiErrorRu(getFactoryErp);
export const POST = withWorkshop2ApiErrorRu(postFactoryErp);
