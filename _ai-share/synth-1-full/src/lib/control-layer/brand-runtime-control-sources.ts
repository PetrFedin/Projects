/**
 * Единая точка входа для **brand** read-only control, пока данные mock/localStorage.
 *
 * - UI control-center / b2b-orders / tasks берут заказы и артикулы **только через этот модуль**,
 *   чтобы позже заменить реализацию на API без поиска по всему дереву.
 * - **Pilot `--from-file`**: JSON уже содержит `OrderControlInput` / `ArticleControlInput` / …
 *   (`parsePilotRealBundle`); этот файл не участвует — типы те же, что ожидают адаптеры.
 * - **Pilot demo-dump** (`pilot-control-dump` без `--from-file`): использует те же функции ниже,
 *   что и UI, чтобы снимок совпадал с экраном при одних и тех же сидах.
 */
import { loadBrandProductionState } from '@/lib/brand-production';
import type { ArticleEntity } from '@/lib/brand-production/types';
import {
  articleControlInputFromArticleEntity,
  buildArticleControlOutput,
} from '@/lib/control-adapters/article-control-output';
import {
  buildOrderControlOutput,
  orderControlInputFromB2BOrder,
} from '@/lib/control-adapters/order-control-output';
import type { ControlOutput } from '@/lib/contracts';
import { listB2BOrdersForOperationalUi } from '@/lib/order/b2b-orders-list-read-model';
import type { B2BOrder } from '@/lib/types';

/** Текущий список B2B заказов для control-layer (сейда; потом — fetch/API). */
export function sourceBrandB2BOrders(): B2BOrder[] {
  return listB2BOrdersForOperationalUi();
}

export function brandB2BOrderToOrderControlInput(order: B2BOrder, asOf: string) {
  return orderControlInputFromB2BOrder(order, asOf);
}

export function buildOrderControlFromBrandB2BOrder(
  order: B2BOrder,
  asOf: string
): ControlOutput | null {
  try {
    return buildOrderControlOutput(orderControlInputFromB2BOrder(order, asOf));
  } catch {
    return null;
  }
}

/** Артикулы из того же снимка production state, что PIM / operations / sample block. */
export function sourceBrandArticleEntities(): ArticleEntity[] {
  return loadBrandProductionState().articles;
}

export function brandArticleToArticleControlInput(article: ArticleEntity, asOf: string) {
  return articleControlInputFromArticleEntity(article, asOf);
}

export function buildArticleControlFromBrandEntity(
  article: ArticleEntity,
  asOf: string
): ControlOutput | null {
  try {
    return buildArticleControlOutput(articleControlInputFromArticleEntity(article, asOf));
  } catch {
    return null;
  }
}
