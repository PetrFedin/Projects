import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import { brandMessagesWorkshop2ArticleContextHref, ROUTES } from '@/lib/routes';

export type BrandCommsEntityThreadKind = 'bom' | 'sample' | 'qc' | 'rfq';

export type BrandCommsEntityThreadRow = {
  id: BrandCommsEntityThreadKind;
  labelRu: string;
  summaryRu: string;
  messagesHref: string;
  contextHref: string;
  dossierTzHref: string;
  attachTzSupported: boolean;
  pillarRu: string;
};

export function buildBrandCommsEntityThreads(input?: {
  collectionId?: string;
  articleId?: string;
  orderId?: string;
}): BrandCommsEntityThreadRow[] {
  const collectionId = input?.collectionId?.trim() || PLATFORM_CORE_DEMO.collectionId;
  const articleId = input?.articleId?.trim() || PLATFORM_CORE_DEMO.demoArticleId || 'demo-ss27-01';
  const baseMessages = brandMessagesWorkshop2ArticleContextHref(collectionId, articleId);

  const thread = (
    id: BrandCommsEntityThreadKind,
    labelRu: string,
    summaryRu: string,
    contextHref: string,
    pillarRu: string,
    q: string,
    attachTzSupported: boolean
  ): BrandCommsEntityThreadRow => ({
    id,
    labelRu,
    summaryRu,
    messagesHref: `${baseMessages}&q=${encodeURIComponent(q)}`,
    contextHref,
    dossierTzHref: workshop2ArticleHref(collectionId, articleId, { w2pane: 'tz', w2sec: 'spec' }),
    attachTzSupported,
    pillarRu,
  });

  return [
    thread(
      'bom',
      'BOM · material line',
      'Centric/Apparel Magic: строка BOM → supplier quote.',
      workshop2ArticleHref(collectionId, articleId, { w2pane: 'tz', w2sec: 'material' }),
      'development',
      'BOM material RFQ',
      true
    ),
    thread(
      'sample',
      'Sample round',
      'Образец proto/SMS → fit comments в W2.',
      workshop2ArticleHref(collectionId, articleId, { w2pane: 'sample' }),
      'development',
      'Sample round feedback',
      true
    ),
    thread(
      'qc',
      'QC gate',
      'Inspectorio AQL перед ship — production ops.',
      `${ROUTES.brand.productionOperations}?${PILLAR_CAPABILITY_FEATURE_PARAM}=qc-gate`,
      'order_production',
      'QC gate checklist',
      false
    ),
    thread(
      'rfq',
      'Centric RFQ',
      'Quote → award в spine procurement.',
      `${ROUTES.brand.integrationsCentric}?${PILLAR_CAPABILITY_FEATURE_PARAM}=rfq`,
      'development',
      'Centric RFQ award',
      false
    ),
  ];
}
