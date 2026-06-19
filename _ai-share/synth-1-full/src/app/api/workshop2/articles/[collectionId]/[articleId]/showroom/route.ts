/**
 * GET/PUT — кампания цифрового шоурума (PG + зеркало в досье).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2ShowroomCampaign,
  putWorkshop2ShowroomCampaign,
} from '@/lib/server/workshop2-showroom-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { putWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { evaluateWorkshop2ShowroomPublishGate } from '@/lib/production/workshop2-showroom-publish-gate';
import {
  buildWorkshop2ShowroomB2bMirror,
  persistWorkshop2ShowroomB2bMirrorToDossier,
} from '@/lib/production/workshop2-showroom-b2b-journal';
import { buildWorkshop2ShowroomLinesheetPayload } from '@/lib/production/workshop2-showroom-linesheet-payload';
import {
  isWorkshop2B2bBuyerTier,
  syncWorkshop2CampaignArticleIdsFromDossier,
  type Workshop2B2bBuyerTier,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';
import { postWorkshop2ShowroomB2bWebhook } from '@/lib/server/workshop2-showroom-b2b-webhook';
import { WORKSHOP2_SHOWROOM_PUBLISH_GATE_SCOPE } from '@/lib/production/workshop2-auto-showroom-publish';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getShowroom(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  const campaign = await getWorkshop2ShowroomCampaign({ collectionId: cid, articleId: aid });
  return NextResponse.json({ ok: true, campaign });
});

export const PUT = withWorkshop2ApiErrorRu(async function putShowroom(
  req: NextRequest,
  ctx: RouteCtx
) {
  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES, {
    bodyActorLabel: String(body.updatedBy ?? ''),
  });
  if (auth instanceof NextResponse) return auth;

  const published = Boolean(body.published);
  const publishGateInput = {
    published: true as const,
    wholesalePrice: body.wholesalePrice != null ? Number(body.wholesalePrice) : undefined,
    msrp: body.msrp != null ? Number(body.msrp) : undefined,
    moq: body.moq != null ? Number(body.moq) : undefined,
    windowStart: body.windowStart ? String(body.windowStart) : undefined,
    windowEnd: body.windowEnd ? String(body.windowEnd) : undefined,
    campaignName: body.campaignName ? String(body.campaignName) : `${cid} · ${aid}`,
  };
  if (published) {
    const gate = evaluateWorkshop2ShowroomPublishGate(publishGateInput);
    const blocker = gate.checks.find((c) => c.severity === 'blocker');
    if (blocker) {
      return jsonWorkshop2ErrorRu(422, 'publish_blocked', { messageRu: blocker.messageRu });
    }
    const recordPre = await getWorkshop2ServerDossierRecord(cid, aid);
    if (recordPre?.dossier) {
      const devGate = evaluateWorkshop2SampleOrderGate({
        dossier: recordPre.dossier,
        categoryLeafId: 'catalog-apparel-g0-l0',
        vaultFileCount: recordPre.dossier.vaultDocuments?.length ?? 0,
      });
      if (!devGate.allowed) {
        const devBlocker = devGate.readiness.checks.find((c) => c.severity === 'blocker');
        return jsonWorkshop2ErrorRu(422, 'development_gate_blocked', {
          messageRu:
            devBlocker?.messageRu ??
            'Публикация B2B заблокирована: не пройдены gate разработки (W2).',
        });
      }
    }
  } else if (body.evaluateShowroomPublishGate === true) {
    const gate = evaluateWorkshop2ShowroomPublishGate(publishGateInput);
    if (gate.allowed) {
      void enqueueWorkshop2DomainEvent({
        type: 'dossier.gate_passed',
        collectionId: cid,
        articleId: aid,
        payload: { gateScope: WORKSHOP2_SHOWROOM_PUBLISH_GATE_SCOPE },
        dispatchNow: true,
      }).catch(() => {
        /* auto-showroom chain best-effort */
      });
    }
  }

  const recordForSkus = await getWorkshop2ServerDossierRecord(cid, aid);
  const tierRaw = body.visibilityTier != null ? String(body.visibilityTier) : 'standard';
  const visibilityTier: Workshop2B2bBuyerTier = isWorkshop2B2bBuyerTier(tierRaw)
    ? tierRaw
    : 'standard';
  const articleIds =
    recordForSkus?.dossier && published
      ? syncWorkshop2CampaignArticleIdsFromDossier(recordForSkus.dossier, aid)
      : [];

  const campaign = await putWorkshop2ShowroomCampaign({
    collectionId: cid,
    articleId: aid,
    campaignName: body.campaignName ? String(body.campaignName) : `${cid} · ${aid}`,
    published,
    wholesalePrice: body.wholesalePrice != null ? Number(body.wholesalePrice) : undefined,
    msrp: body.msrp != null ? Number(body.msrp) : undefined,
    moq: body.moq != null ? Number(body.moq) : undefined,
    windowStart: body.windowStart ? String(body.windowStart) : undefined,
    windowEnd: body.windowEnd ? String(body.windowEnd) : undefined,
    visibilityTier,
    articleIds,
  });

  const record = recordForSkus ?? (await getWorkshop2ServerDossierRecord(cid, aid));
  let webhookResult: Awaited<ReturnType<typeof postWorkshop2ShowroomB2bWebhook>> | undefined;
  if (record) {
    const linesheet = buildWorkshop2ShowroomLinesheetPayload({
      collectionId: cid,
      articleId: aid,
      dossier: record.dossier,
      campaign,
    });
    if (campaign.published) {
      webhookResult = await postWorkshop2ShowroomB2bWebhook({
        collectionId: cid,
        articleId: aid,
        campaign,
        linesheet,
      });
      void enqueueWorkshop2DomainEvent({
        type: 'showroom.published',
        collectionId: cid,
        articleId: aid,
        payload: {
          campaignName: campaign.campaignName,
          webhookAttempted: webhookResult.attempted,
          webhookDelivered: webhookResult.delivered,
          webhookError: webhookResult.error,
        },
      }).catch(() => {
        /* best-effort */
      });
    }
    const showroomMirror = buildWorkshop2ShowroomB2bMirror({
      campaign,
      publishJournalIncrement: campaign.published ? 1 : 0,
    });
    const merged = persistWorkshop2ShowroomB2bMirrorToDossier(
      {
        ...record.dossier,
        b2bIntegrationDraft: {
          ...record.dossier.b2bIntegrationDraft,
          isLive: campaign.published,
          wholesalePrice: campaign.wholesalePrice?.toFixed(2),
          msrp: campaign.msrp?.toFixed(2),
          moq: campaign.moq != null ? String(campaign.moq) : undefined,
          startDate: campaign.windowStart,
          endDate: campaign.windowEnd,
          lastSyncAt: campaign.lastSyncAt,
          campaignId: `${cid}:${aid}`,
        },
        updatedAt: new Date().toISOString(),
        updatedBy: resolveWorkshop2UpdatedBy(req, String(body.updatedBy ?? '')),
      },
      showroomMirror
    );
    await putWorkshop2ServerDossierRecord({
      collectionId: cid,
      articleId: aid,
      dossier: merged,
      baseVersion: record.version,
      updatedBy: merged.updatedBy,
    });
  }

  return NextResponse.json({
    ok: true,
    campaign,
    publishMode: campaign.published ? 'pg_journal' : undefined,
    webhook: webhookResult,
  });
});
