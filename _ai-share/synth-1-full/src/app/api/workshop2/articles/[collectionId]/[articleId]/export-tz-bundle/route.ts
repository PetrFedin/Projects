/**
 * GET — ZIP-пакет ТЗ: dossier.json, readiness.json, README.txt (сборка + readiness snapshot).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2VaultDocumentsFromPg } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  resolveWorkshop2OrganizationId,
  workshop2DatabaseNotConfiguredResponse,
} from '@/lib/server/workshop2-api-context';
import { evaluateWorkshop2TzExportBundleGate } from '@/lib/production/workshop2-tz-export-bundle-gate';
import { buildWorkshop2NestingFactoryExport } from '@/lib/production/workshop2-nesting-request';
import { buildWorkshop2TzExportBundleZip } from '@/lib/server/workshop2-tz-export-bundle';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import { listWorkshop2QcDefectsByArticle } from '@/lib/server/workshop2-qc-defects-repository';
import { listWorkshop2DomainEventsForArticle } from '@/lib/server/workshop2-domain-events';
import { buildWorkshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getExportTzBundle(
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

  const sku = req.nextUrl.searchParams.get('sku')?.trim() || undefined;
  const name = req.nextUrl.searchParams.get('name')?.trim() || undefined;
  const categoryLeafId = req.nextUrl.searchParams.get('categoryLeafId')?.trim() || undefined;
  const audienceId = req.nextUrl.searchParams.get('audienceId')?.trim() || undefined;
  const isUnisexRaw = req.nextUrl.searchParams.get('isUnisex');
  const isUnisex =
    isUnisexRaw === '1' || isUnisexRaw === 'true'
      ? true
      : isUnisexRaw === '0' || isUnisexRaw === 'false'
        ? false
        : undefined;

  try {
    const record = await getWorkshop2ServerDossierRecord(cid, aid);
    if (!record) {
      return jsonWorkshop2ErrorRu(404, 'not_found');
    }

    const organizationId = resolveWorkshop2OrganizationId(req);
    let vaultDocuments: Awaited<ReturnType<typeof listWorkshop2VaultDocumentsFromPg>> = [];
    try {
      vaultDocuments = await listWorkshop2VaultDocumentsFromPg({
        collectionId: cid,
        articleId: aid,
        organizationId,
      });
    } catch {
      vaultDocuments = [];
    }

    let nestingFactoryExport: ReturnType<typeof buildWorkshop2NestingFactoryExport> | undefined;
    let activeSampleOrder: Awaited<ReturnType<typeof listWorkshop2SampleOrders>>[0] | undefined;
    try {
      const orders = await listWorkshop2SampleOrders({
        collectionId: cid,
        articleId: aid,
        organizationId,
      });
      const active = orders[0];
      activeSampleOrder = active;
      const nesting = active?.nestingRequest;
      if (
        active &&
        nesting &&
        (nesting.fabricWidthCm != null || nesting.efficiencyPct != null || nesting.notes)
      ) {
        nestingFactoryExport = buildWorkshop2NestingFactoryExport({
          collectionId: cid,
          articleId: aid,
          sampleOrderId: active.id,
          nesting,
          includeSimulation: Boolean(nesting.simulationYieldPct),
        });
      }
    } catch {
      nestingFactoryExport = undefined;
    }

    const leafId = categoryLeafId ?? record.dossier.categoryBindings?.[0]?.categoryLeafId;
    const exportGate = evaluateWorkshop2TzExportBundleGate({
      dossier: record.dossier,
      categoryLeafId: leafId,
      collectionId: cid,
      articleId: aid,
      articleSku: sku,
      articleName: name,
      hasActiveSampleOrder: Boolean(activeSampleOrder),
      nestingRequest: activeSampleOrder?.nestingRequest,
    });
    if (!exportGate.allowed) {
      return jsonWorkshop2ErrorRu(409, 'export_tz_bundle_blocked', {
        messageRu: 'Экспорт ZIP ТЗ заблокирован — закройте визуальные ворота.',
        checks: exportGate.checks,
      });
    }

    const [defects, events] = await Promise.all([
      listWorkshop2QcDefectsByArticle({ collectionId: cid, articleId: aid, limit: 100 }),
      listWorkshop2DomainEventsForArticle({ collectionId: cid, articleId: aid, limit: 100 }),
    ]);
    const productionAnalytics = buildWorkshop2ProductionAnalyticsSnapshot({
      collectionId: cid,
      articleId: aid,
      dossier: record.dossier,
      statusHistory: activeSampleOrder?.statusHistory,
      qcDefects: defects.map((d) => ({
        defectCode: d.defectCode,
        severity: d.severity,
        source: d.source,
        createdAt: d.createdAt,
      })),
      domainEvents: events,
    });

    const { buffer, filename } = await buildWorkshop2TzExportBundleZip({
      collectionId: cid,
      articleId: aid,
      articleSku: sku,
      articleName: name,
      categoryLeafId: categoryLeafId ?? record.dossier.categoryBindings?.[0]?.categoryLeafId,
      audienceId: audienceId ?? record.dossier.selectedAudienceId,
      isUnisex,
      dossier: record.dossier,
      version: record.version,
      updatedAt: record.updatedAt,
      vaultDocuments,
      nestingFactoryExport,
      productionAnalytics,
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes('WORKSHOP2_DATABASE_URL_NOT_CONFIGURED')) {
      return NextResponse.json(workshop2DatabaseNotConfiguredResponse(), { status: 503 });
    }
    throw e;
  }
});
