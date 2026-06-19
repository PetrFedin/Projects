'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { PlatformCoreChromeShell } from '@/components/platform/PlatformCoreChromeShell';
import { PlatformCoreWorkspaceWayfinding } from '@/components/platform/PlatformCoreWorkspaceWayfinding';
import {
  ROUTES,
  brandMessagesWorkshop2ArticleContextHref,
  factoryProductionDossierHref,
} from '@/lib/routes';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { useWorkshop2B2bDossierEditLock } from '@/hooks/use-workshop2-b2b-dossier-edit-lock';
import {
  brandLinesheetsHrefForDemo,
  brandShowroomHrefForDemo,
  factoryMaterialsHrefForDemo,
  platformCoreDemoForArticle,
  getPlatformCoreDemo,
} from '@/lib/platform-core-hub-matrix';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import {
  brandDevelopmentSamplePeerHref,
  brandDevelopmentSamplePeerLabelLong,
} from '@/lib/platform-core-brand-sample-peer';
import { BrandCentricStyleImportPanel } from '@/components/integrations/BrandCentricStyleImportPanel';
import { BrandCentricBomConflictPanel } from '@/components/integrations/BrandCentricBomConflictPanel';
import { BrandCentricMediaImportPanel } from '@/components/integrations/BrandCentricMediaImportPanel';
import { BrandZedonkCostingHintStrip } from '@/components/integrations/BrandZedonkCostingHintStrip';
import { Workshop2TzAttachToChatButton } from '@/components/platform/Workshop2TzAttachToChatButton';
import { Workshop2TzExportButton } from '@/components/platform/Workshop2TzExportButton';

type Props = {
  collectionId: string;
  articleId: string;
};

export function Workshop2ArticleCoreWayfinding({ collectionId, articleId }: Props) {
  const factoryId = getPlatformCoreDemo(collectionId).factoryId;
  const [bomLineCount, setBomLineCount] = useState<number | null>(null);
  const [sampleStatus, setSampleStatus] = useState<string | null>(null);
  const b2bDossierEditLock = useWorkshop2B2bDossierEditLock(collectionId, articleId);

  useEffect(() => {
    if (!isPlatformCoreMode()) return;
    let cancelled = false;
    (async () => {
      try {
        const headers = buildWorkshop2ApiRequestHeaders();
        const [dossierRes, queueRes] = await Promise.all([
          fetch(
            `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/dossier`,
            { headers, cache: 'no-store' }
          ),
          fetch(`/api/workshop2/factory/sample-queue?factoryId=${encodeURIComponent(factoryId)}`, {
            headers,
            cache: 'no-store',
          }),
        ]);
        const dossierJson = (await dossierRes.json()) as {
          ok?: boolean;
          dossier?: { productionModel?: { materialLines?: unknown[] } };
        };
        const queueJson = (await queueRes.json()) as {
          ok?: boolean;
          items?: Array<{ articleId?: string; collectionId?: string; status?: string }>;
        };
        if (!cancelled && dossierJson.ok && dossierJson.dossier) {
          setBomLineCount(dossierJson.dossier.productionModel?.materialLines?.length ?? 0);
        }
        if (!cancelled && queueJson.ok && queueJson.items) {
          const hit = queueJson.items.find(
            (i) => i.articleId === articleId && i.collectionId === collectionId
          );
          setSampleStatus(hit?.status ?? null);
        }
      } catch {
        if (!cancelled) {
          setBomLineCount(null);
          setSampleStatus(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collectionId, articleId, factoryId]);

  if (!isPlatformCoreMode()) return null;

  const backHref = `${ROUTES.brand.productionWorkshop2}?w2col=${encodeURIComponent(collectionId)}`;
  const factoryDossierHref = factoryProductionDossierHref(articleId, { collectionId });
  const sampleHandoffHref = brandDevelopmentSamplePeerHref(collectionId, articleId, {
    sampleStatus,
  });
  const sampleHandoffLabel = brandDevelopmentSamplePeerLabelLong({ sampleStatus });
  const articleDemo = platformCoreDemoForArticle(collectionId, articleId);
  const supplierBomHref = factoryMaterialsHrefForDemo(articleDemo);
  const gatesHref = workshop2ArticleHref(collectionId, articleId, {
    hash: 'w2-tz-section-signoff-general',
  });
  const rangePlannerHref = `${ROUTES.brand.rangePlanner}?collection=${encodeURIComponent(collectionId)}`;
  const showroomHref = brandShowroomHrefForDemo(articleDemo);
  const linesheetsHref = brandLinesheetsHrefForDemo(articleDemo);

  return (
    <PlatformCoreChromeShell collectionId={collectionId}>
      <div data-testid="brand-dev-dossier-panel" className="space-y-2">
        <PlatformCoreWorkspaceWayfinding
          roleId="brand"
          pillarId="development"
          entityLabel={articleId}
          backHref={backHref}
          backLabel="Коллекция в разработке"
          peerHref={factoryDossierHref}
          peerLabel="Досье цеха"
          commsHref={brandMessagesWorkshop2ArticleContextHref(collectionId, articleId)}
          commsTestId="brand-dossier-article-chat-link"
        />
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs"
          data-testid="brand-dev-dossier-context-strip"
        >
          <Link
            href={backHref}
            data-testid="brand-dev-dossier-w2-hub-link"
            className="text-accent-primary font-medium hover:underline"
          >
            W2 hub
          </Link>
          <Link
            href={rangePlannerHref}
            data-testid="brand-dev-dossier-range-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Планировщик
          </Link>
          <Link
            href={showroomHref}
            data-testid="brand-dev-dossier-showroom-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Витрина
          </Link>
          <Link
            href={linesheetsHref}
            data-testid="brand-dev-dossier-linesheets-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Лайншиты
          </Link>
          <Link
            href={gatesHref}
            data-testid="brand-dev-dossier-gates-link"
            data-audit-legacy="brand-w2-gates-summary-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Gates ТЗ
          </Link>
          <Link
            href={`/brand/production/workshop2/investor-summary?collection=${encodeURIComponent(collectionId)}&article=${encodeURIComponent(articleId)}`}
            data-testid="brand-dev-dossier-investor-summary-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Investor summary
          </Link>
        </div>
        {b2bDossierEditLock.locked && b2bDossierEditLock.messageRu ? (
          <p
            className="mx-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-950"
            data-testid="brand-w2-dossier-b2b-lock-notice"
            role="status"
          >
            {b2bDossierEditLock.messageRu}
          </p>
        ) : null}
        <BrandCentricStyleImportPanel collectionId={collectionId} articleId={articleId} compact />
        <BrandCentricBomConflictPanel collectionId={collectionId} articleId={articleId} compact />
        <BrandCentricMediaImportPanel collectionId={collectionId} articleId={articleId} compact />
        <BrandZedonkCostingHintStrip collectionId={collectionId} articleId={articleId} />
        <div className="mt-2 flex flex-wrap items-center gap-2 px-1 text-xs">
          {bomLineCount != null && bomLineCount > 0 ? (
            <Badge
              variant="outline"
              data-testid="brand-w2-bom-ready-badge"
              className="h-4 border-emerald-200 bg-emerald-50 px-1.5 text-[9px] text-emerald-800"
            >
              BOM · {bomLineCount} строк
            </Badge>
          ) : null}
          {sampleStatus ? (
            <Badge
              variant="outline"
              data-testid="brand-w2-sample-queue-badge"
              className="h-4 border-sky-200 bg-sky-50 px-1.5 text-[9px] text-sky-800"
            >
              Образец · {sampleStatus}
            </Badge>
          ) : null}
        </div>
        <div
          className="mt-1 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs"
          data-testid="brand-dev-dossier-cross-strip"
        >
          <Link
            href={sampleHandoffHref}
            data-testid="brand-dev-dossier-sample-handoff-link"
            data-audit-legacy="brand-w2-sample-handoff-link"
            className="text-accent-primary font-semibold hover:underline"
          >
            {sampleHandoffLabel}
          </Link>
          <Link
            href={factoryDossierHref}
            data-testid="brand-dev-dossier-factory-peer-link"
            className="text-accent-primary font-medium hover:underline"
          >
            Досье цеха →
          </Link>
          <Link
            href={supplierBomHref}
            data-testid="brand-dev-dossier-supplier-bom-link"
            data-audit-legacy="brand-w2-supplier-bom-link"
            className="text-accent-primary font-medium hover:underline"
          >
            BOM поставщика →
          </Link>
          <Workshop2TzExportButton collectionId={collectionId} articleId={articleId} />
          <Workshop2TzAttachToChatButton collectionId={collectionId} articleId={articleId} />
        </div>
      </div>
    </PlatformCoreChromeShell>
  );
}
