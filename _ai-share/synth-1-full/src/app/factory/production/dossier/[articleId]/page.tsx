import { notFound } from 'next/navigation';
import { getWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import { WORKSHOP2_SYSTEM_COLLECTION_ID } from '@/lib/production/local-collection-inventory';
import { buildWorkshop2FinalTzSpecDocumentHtml } from '@/lib/production/workshop2-final-tz-spec-export';
import { Workshop2InteractiveFactoryPortal } from '@/components/brand/production/Workshop2InteractiveFactoryPortal';

export default async function FactoryDossierPortalPage(props: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await props.params;
  const internalCode = WORKSHOP2_SYSTEM_COLLECTION_ID;

  if (!internalCode || !articleId) return notFound();

  const dossier = await getWorkshop2Phase1Dossier(internalCode, articleId);
  if (!dossier) return notFound();

  // Имитация HTML документа для фабрики, но с интерактивной оберткой
  const htmlContent = buildWorkshop2FinalTzSpecDocumentHtml(dossier, {
    articleSku: 'SKU-' + articleId.slice(0, 4),
    articleName: 'Тестовое изделие',
    pathLabel: 'Каталог > Группа',
    l2Name: 'Группа',
    tzPhase: '1',
    categoryLeafId: 'leaf-test',
    measurementsLeaf: null,
    preflightOk: true,
    preflightIssueCount: 0,
    sectionSignoffsFull: 4,
    gateLifecycleState: 'Сборка',
    exportLanguage: 'ru_en',
  });

  return <Workshop2InteractiveFactoryPortal htmlContent={htmlContent} articleId={articleId} />;
}
