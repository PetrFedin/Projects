import {
  applyShopBuyerChainVisibility,
  getShopProductionVisibilityPolicy,
  SHOP_PRODUCTION_VISIBILITY_LABELS_RU,
  type ShopProductionVisibility,
  type ShopProductionVisibilityPolicy,
} from '@/lib/platform-core-shop-production-visibility';

export type ChainPeerMirrorStep = { id: string; labelRu: string; done: boolean };

export type ChainPeerMirrorPayload = {
  steps?: ChainPeerMirrorStep[];
  handedOff?: boolean;
  productionOrderId?: string;
  poStatusLabelRu?: string;
  poStatus?: string;
  factoryId?: string;
  collectionId?: string;
};

/** Краткий статус бренда для экрана магазина (зеркало второй роли). */
export function formatBrandPeerStatusSummaryRu(chain: ChainPeerMirrorPayload): string {
  const brandConfirmed = chain.steps?.find((s) => s.id === 'brand_confirmed')?.done === true;
  if (!brandConfirmed) return 'ожидает подтверждения';
  if (!chain.handedOff) return 'подтвердил · ожидает передачи в цех';
  if (chain.poStatus === 'error') return 'передал · ERP: ошибка синхронизации';
  if (chain.poStatusLabelRu) return `передал · ${chain.poStatusLabelRu}`;
  if (chain.productionOrderId) {
    return `передал · ${chain.productionOrderId}`;
  }
  return 'передал в производство';
}

export type ShopBuyerMirrorHeadline = {
  policy: ShopProductionVisibilityPolicy;
  doneCount: number;
  totalCount: number;
  visibilityLabelRu: string;
};

/** Что магазин видит по policy бренда — для зеркала на карточке бренда. */
export function buildShopBuyerMirrorHeadline(
  chain: ChainPeerMirrorPayload,
  visibility?: ShopProductionVisibility
): ShopBuyerMirrorHeadline | null {
  const policy = getShopProductionVisibilityPolicy(visibility);
  const buyerChain = applyShopBuyerChainVisibility(chain, policy);
  const steps = buyerChain?.steps ?? [];
  if (steps.length === 0) return null;
  const doneCount = steps.filter((s) => s.done).length;
  return {
    policy,
    doneCount,
    totalCount: steps.length,
    visibilityLabelRu: SHOP_PRODUCTION_VISIBILITY_LABELS_RU[policy.visibility],
  };
}
