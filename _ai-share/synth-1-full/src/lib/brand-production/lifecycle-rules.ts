/**
 * Автоправила жизненного цикла артикула (как на бэкенде; здесь — клиентская валидация до API).
 */

import type { ArticleEntity, POEntity, QCInspectionEntity } from './types';
import { ARTICLE_LIFECYCLE_ORDER, type ArticleLifecycleStage } from './types';

export function lifecycleIndex(stage: ArticleLifecycleStage): number {
  return ARTICLE_LIFECYCLE_ORDER.indexOf(stage);
}

export interface TransitionCheck {
  allowed: boolean;
  reason?: string;
}

/** Переход на этап `po`: нужен Gold Sample */
export function canMoveToPoStage(article: ArticleEntity): TransitionCheck {
  if (!article.goldSampleApproved) {
    return { allowed: false, reason: 'Нельзя перейти на этап PO без утверждённого Gold Sample.' };
  }
  if (lifecycleIndex(article.lifecycleStage) < lifecycleIndex('approval')) {
    return { allowed: false, reason: 'Сначала завершите этапы до «Утверждение».' };
  }
  return { allowed: true };
}

/** Создание/активация PO для артикула */
export function canAttachArticleToPO(article: ArticleEntity): TransitionCheck {
  return canMoveToPoStage(article);
}

/** Отгрузка / склад: последняя инспекция по PO не fail с блокировкой */
export function canShipForPO(
  po: POEntity,
  inspections: QCInspectionEntity[]
): TransitionCheck {
  const forPo = inspections.filter((i) => i.poId === po.id && i.blocksShipment);
  const blocking = forPo.filter((i) => i.result === 'fail' || i.result === 'rework');
  if (blocking.length > 0) {
    return {
      allowed: false,
      reason: 'Отгрузка заблокирована: есть QC с результатом fail/rework и блокировкой отгрузки.',
    };
  }
  const finals = inspections.filter((i) => i.poId === po.id && i.result === 'pass');
  if (finals.length === 0) {
    return { allowed: false, reason: 'Нужна успешная финальная инспекция QC перед отгрузкой.' };
  }
  return { allowed: true };
}

/** Переход артикула на warehouse после QC */
export function canMoveArticleToWarehouse(
  article: ArticleEntity,
  po: POEntity | undefined,
  inspections: QCInspectionEntity[]
): TransitionCheck {
  if (!po) return { allowed: false, reason: 'Нет PO для артикула.' };
  const ship = canShipForPO(po, inspections);
  if (!ship.allowed) return ship;
  return { allowed: true };
}

export function suggestNextStage(article: ArticleEntity): ArticleLifecycleStage | null {
  const i = lifecycleIndex(article.lifecycleStage);
  if (i < 0 || i >= ARTICLE_LIFECYCLE_ORDER.length - 1) return null;
  return ARTICLE_LIFECYCLE_ORDER[i + 1];
}
