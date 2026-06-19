import 'server-only';

import { toShopMatrixSizeCurveView } from '@/lib/b2b/shop-matrix-size-curve';
import type { ShopMatrixSizeCurveView } from '@/lib/b2b/shop-matrix-size-curve';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  getWorkshop2ShowroomCampaign,
  listWorkshop2PublishedShowroomArticles,
} from '@/lib/server/workshop2-showroom-repository';

export async function loadShopMatrixSizeCurveView(input: {
  collectionId: string;
  articleId?: string;
}): Promise<{ ok: true; view: ShopMatrixSizeCurveView } | { ok: false; messageRu: string }> {
  const collectionId = input.collectionId.trim();
  if (!collectionId) {
    return { ok: false, messageRu: 'Укажите collectionId.' };
  }

  const published = await listWorkshop2PublishedShowroomArticles(collectionId);
  const articleId = input.articleId?.trim() || published[0]?.articleId;
  if (!articleId) {
    return { ok: false, messageRu: 'Нет опубликованных артикулов для size curve.' };
  }

  const campaign = await getWorkshop2ShowroomCampaign({ collectionId, articleId });
  if (!campaign?.published && !published.some((a) => a.articleId === articleId)) {
    return { ok: false, messageRu: 'Артикул не опубликован — curve только после release.' };
  }

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record?.dossier) {
    return { ok: false, messageRu: 'Досье не найдено — используйте demo curve.' };
  }

  return {
    ok: true,
    view: toShopMatrixSizeCurveView({
      collectionId,
      articleId,
      dossier: record.dossier,
    }),
  };
}

export type { ShopMatrixSizeCurveView };
