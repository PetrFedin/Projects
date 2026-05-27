/**
 * Мост разработка коллекции (workshop2) ↔ пол `/brand/production`: единая точка для сборки deep-link без дублирования логики в UI.
 */
import { ROUTES, brandProductionFloorHref, withBrandProductionDeepContext } from '@/lib/routes';

export type Workshop2FloorBridgeContext = {
  collectionId: string;
  /** Id строки артикула (как в разработке коллекции и в `stagesSku` на полу). */
  articleLineId?: string;
};

/**
 * Вход на пол из разработки коллекции: при выбранном артикуле — вкладка «Этапы» (контур ТЗ);
 * без артикула — «Коллекция» на полу.
 */
export function workshop2ContextToProductionFloorHubHref(ctx: Workshop2FloorBridgeContext): string {
  const { collectionId, articleLineId } = ctx;
  const aid = articleLineId?.trim();
  const floorTab = aid ? 'stages' : 'workshop';
  return brandProductionFloorHref(floorTab, {
    collectionId,
    ...(aid ? { stagesSku: aid } : {}),
  });
}

/** Любая вкладка пола с контекстом разработки коллекции (query w2col/w2art). */
export function workshop2ContextToProductionFloorTabHref(
  floorTab: string,
  ctx: Workshop2FloorBridgeContext
): string {
  const aid = ctx.articleLineId?.trim();
  return brandProductionFloorHref(floorTab, {
    collectionId: ctx.collectionId,
    ...(aid ? { stagesSku: aid } : {}),
  });
}

/** Страница модуля цеха (gold-sample, operations, …) с тем же query, что и мост из разработки коллекции. */
export function workshop2ContextToProductionModuleHref(
  modulePath: string,
  ctx: Workshop2FloorBridgeContext
): string {
  return withBrandProductionDeepContext(modulePath, {
    collectionId: ctx.collectionId,
    stagesSku: ctx.articleLineId ?? undefined,
  });
}

/** Базовый путь пола бренда. */
export function productionFloorBasePath(): string {
  return ROUTES.brand.production;
}

/** Вкладка пола по статусу заказа образца (синхронизация W2 ↔ `/brand/production`). */
const SAMPLE_ORDER_STATUS_TO_FLOOR_TAB: Record<string, string> = {
  draft: 'stages',
  sent: 'samples',
  in_progress: 'operations',
  received: 'quality',
  approved: 'gold-sample',
  cancelled: 'stages',
};

/** Вкладка пола по логистическому статусу образца (created / in_transit / received). */
const SAMPLE_MOVEMENT_TO_FLOOR_TAB: Record<string, string> = {
  created: 'samples',
  in_transit: 'operations',
  received: 'quality',
};

export function workshop2SampleMovementStatusToFloorTab(
  movementStatus: string | undefined
): string {
  if (!movementStatus?.trim()) return 'stages';
  return SAMPLE_MOVEMENT_TO_FLOOR_TAB[movementStatus] ?? 'stages';
}

export function workshop2SampleOrderStatusToFloorTab(status: string | undefined): string {
  if (!status?.trim()) return 'stages';
  return SAMPLE_ORDER_STATUS_TO_FLOOR_TAB[status] ?? 'stages';
}

/** Deep-link на пол с учётом статуса образца (query w2col / stagesSku сохраняются). */
export function workshop2ContextToProductionFloorFromSampleOrder(
  ctx: Workshop2FloorBridgeContext,
  sampleOrderStatus?: string
): string {
  return workshop2ContextToProductionFloorTabHref(
    workshop2SampleOrderStatusToFloorTab(sampleOrderStatus),
    ctx
  );
}
