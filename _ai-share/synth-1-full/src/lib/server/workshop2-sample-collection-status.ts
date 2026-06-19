import 'server-only';

import { getPlatformCoreDemo } from '@/lib/platform-core-hub-matrix';
import { workshop2CollectionLinesheetPdfHref } from '@/lib/production/workshop2-collection-linesheet-pdf-href';
import { listWorkshop2PublishedShowroomArticles } from '@/lib/server/workshop2-showroom-repository';
import { getWorkshop2PgPool, isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';
import { ensureWorkshop2PgSchema } from '@/lib/server/workshop2-dossier-repository';

export type Workshop2SampleCollectionStepId =
  | 'samples_ready'
  | 'showroom_published'
  | 'linesheet_pack'
  | 'buyer_showroom';

export type Workshop2SampleCollectionStep = {
  id: Workshop2SampleCollectionStepId;
  labelRu: string;
  done: boolean;
};

export type Workshop2SampleCollectionStatus = {
  collectionId: string;
  articleCount: number;
  publishedCount: number;
  readyForBuyers: boolean;
  steps: Workshop2SampleCollectionStep[];
  showroomHref: string;
  linesheetHref: string;
  linesheetPdfHref: string | null;
  workshop2Href: string;
  shopShowroomHref: string;
  shopMatrixHref: string;
};

async function countCollectionArticles(collectionId: string): Promise<number> {
  if (!isWorkshop2PostgresEnabled()) return 0;
  await ensureWorkshop2PgSchema();
  const res = await getWorkshop2PgPool().query<{ n: string }>(
    `SELECT COUNT(*)::text AS n FROM workshop2_articles WHERE collection_id = $1`,
    [collectionId]
  );
  return Number(res.rows[0]?.n ?? 0);
}

export async function getWorkshop2SampleCollectionStatus(
  collectionId: string
): Promise<Workshop2SampleCollectionStatus> {
  const cid = collectionId.trim() || 'SS27';
  const [published, articleCount] = await Promise.all([
    listWorkshop2PublishedShowroomArticles(cid),
    countCollectionArticles(cid),
  ]);
  const publishedCount = published.length;
  const samplesReady = articleCount > 0;
  const showroomPublished = publishedCount > 0;
  const linesheetPack = showroomPublished;
  const buyerShowroom = showroomPublished;

  const steps: Workshop2SampleCollectionStep[] = [
    {
      id: 'samples_ready',
      labelRu: `Образцы в коллекции (${articleCount} арт.)`,
      done: samplesReady,
    },
    {
      id: 'showroom_published',
      labelRu: `Витрина опубликована (${publishedCount})`,
      done: showroomPublished,
    },
    {
      id: 'linesheet_pack',
      labelRu: 'Linesheet и презентация для байеров',
      done: linesheetPack,
    },
    {
      id: 'buyer_showroom',
      labelRu: 'Магазины видят коллекцию в showroom',
      done: buyerShowroom,
    },
  ];

  const demoArticleId = getPlatformCoreDemo(cid).demoArticleId;
  const hasPdfSource = publishedCount > 0 || Boolean(demoArticleId);
  const linesheetPdfHref = hasPdfSource ? workshop2CollectionLinesheetPdfHref(cid) : null;

  return {
    collectionId: cid,
    articleCount,
    publishedCount,
    readyForBuyers: buyerShowroom,
    steps,
    workshop2Href: `/brand/production/workshop2?w2col=${encodeURIComponent(cid)}`,
    linesheetHref: `/brand/linesheets?collection=${encodeURIComponent(cid)}&article=${encodeURIComponent(getPlatformCoreDemo(cid).demoArticleId)}`,
    linesheetPdfHref,
    showroomHref: '/brand/showroom',
    shopShowroomHref: `/shop/b2b/showroom?collection=${encodeURIComponent(cid)}`,
    shopMatrixHref: `/shop/b2b/matrix?collection=${encodeURIComponent(cid)}`,
  };
}
