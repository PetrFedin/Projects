import { notFound } from 'next/navigation';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import { WORKSHOP2_SYSTEM_COLLECTION_ID } from '@/lib/production/local-collection-inventory';
import {
  buildWorkshop2FinalTzExportContextFromDossier,
  buildWorkshop2FinalTzSpecDocumentHtml,
} from '@/lib/production/workshop2-final-tz-spec-export';
import { buildWorkshop2TechPackFactoryDocumentHtml } from '@/lib/production/workshop2-techpack-export-sheets';
import { buildWorkshop2TechPackExportOptions } from '@/lib/production/workshop2-techpack-export-options';
import { Workshop2InteractiveFactoryPortal } from '@/components/brand/production/Workshop2InteractiveFactoryPortal';
import { FactoryDossierCoreChrome } from '@/components/platform/FactoryDossierCoreChrome';
import {
  PLATFORM_CORE_DEMO_PRESETS,
  getPlatformCoreDemoByArticleId,
} from '@/lib/platform-core-hub-matrix';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';

async function resolveFactoryDossier(
  articleId: string
): Promise<Workshop2DossierPhase1 | null> {
  const demoCollectionIds = Object.values(PLATFORM_CORE_DEMO_PRESETS).map(
    (p) => p.collectionId
  );
  const preferred = getPlatformCoreDemoByArticleId(articleId).collectionId;
  const candidates = [
    preferred,
    WORKSHOP2_SYSTEM_COLLECTION_ID,
    ...demoCollectionIds,
  ].filter((id, idx, arr) => Boolean(id) && arr.indexOf(id) === idx);

  const pgFirst = isPlatformCoreMode();

  for (const collectionId of candidates) {
    if (pgFirst) {
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      if (record?.dossier) return record.dossier;
      const local = getWorkshop2Phase1Dossier(collectionId, articleId);
      if (local) return local;
    } else {
      const local = getWorkshop2Phase1Dossier(collectionId, articleId);
      if (local) return local;
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      if (record?.dossier) return record.dossier;
    }
  }
  return null;
}

export default async function FactoryDossierPortalPage(props: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await props.params;

  if (!articleId) return notFound();

  const dossier = await resolveFactoryDossier(articleId);
  if (!dossier) return notFound();

  const exportContext = buildWorkshop2FinalTzExportContextFromDossier(dossier, {
    articleId,
    exportLanguage: 'ru_en',
  });
  const exportOptions = buildWorkshop2TechPackExportOptions({
    dossier,
    articleSku: exportContext.articleSku,
    articleId,
  });
  const htmlContent = buildWorkshop2FinalTzSpecDocumentHtml(dossier, exportContext);
  const factoryPackHtml = buildWorkshop2TechPackFactoryDocumentHtml(
    dossier,
    exportContext,
    exportOptions
  );

  return (
    <FactoryDossierCoreChrome articleId={articleId} exportArticleSku={exportContext.articleSku}>
      <Workshop2InteractiveFactoryPortal
        htmlContent={htmlContent}
        factoryPackHtml={factoryPackHtml}
        articleId={articleId}
      />
    </FactoryDossierCoreChrome>
  );
}
