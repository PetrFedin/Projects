/**
 * Мост разработка коллекции (workshop2) ↔ пол `/brand/production`: единая точка для сборки deep-link без дублирования логики в UI.
 */
import {
  ROUTES,
  brandProductionFloorHref,
  withBrandProductionDeepContext,
} from '@/lib/routes';

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
