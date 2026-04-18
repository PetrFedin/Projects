/**
 * Инфраструктура согласований по модулю этапа коллекции (без реального API).
 * Ссылки в задачи/чат с унифицированными query; порт для будущего POST.
 */

import { ROUTES } from '@/lib/routes';
import { COLLECTION_ID_PARAM, STAGES_STEP_PARAM } from '@/lib/production/stages-url';

/** Маркер для фильтров на страницах задач/сообщений (до отдельного раздела UI). */
export const REVIEW_FLOW_PARAM = 'reviewFlow';
export const REVIEW_FLOW_COLLECTION_STAGE = 'collection_stage_module';

export type CollectionStageReviewLinkInput = {
  collectionId: string;
  stepId: string;
  stepTitle: string;
};

function buildReviewSearchParams(input: CollectionStageReviewLinkInput): URLSearchParams {
  const p = new URLSearchParams();
  const cid = input.collectionId?.trim();
  if (cid) p.set(COLLECTION_ID_PARAM, cid);
  p.set(STAGES_STEP_PARAM, input.stepId);
  p.set(REVIEW_FLOW_PARAM, REVIEW_FLOW_COLLECTION_STAGE);
  p.set('q', `Согласование этапа: ${input.stepTitle}`);
  return p;
}

export function buildCollectionStageReviewTasksUrl(input: CollectionStageReviewLinkInput): string {
  return `${ROUTES.brand.tasks}?${buildReviewSearchParams(input).toString()}`;
}

export function buildCollectionStageReviewMessagesUrl(
  input: CollectionStageReviewLinkInput
): string {
  return `${ROUTES.brand.messages}?${buildReviewSearchParams(input).toString()}`;
}

// —— Порт API (заглушка → HTTP) ——

export type CollectionStageReviewRequestPayload = {
  /** Ключ хранилища flow / модулей */
  collectionKey: string;
  /** Человекочитаемый id коллекции из URL */
  collectionIdLabel: string;
  stepId: string;
  stepTitle: string;
  actorLabel: string;
  channels: readonly ('tasks' | 'messages')[];
  /** Краткое описание для тикета / первого сообщения */
  summaryNote?: string;
};

export type CollectionStageReviewRequestResult = {
  ok: boolean;
  mode: 'stub' | 'http';
  taskRef?: string;
  messageThreadRef?: string;
  error?: string;
};

/**
 * Заменить на fetch('/api/brand/collection-stage-review', { method: 'POST', body: JSON.stringify(payload) })
 * при появлении бэкенда. Пока — детерминированный stub для UI и тестов.
 */
export async function submitCollectionStageReviewRequest(
  payload: CollectionStageReviewRequestPayload
): Promise<CollectionStageReviewRequestResult> {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    globalThis.console?.info?.('[collection-stage-review] stub submit', payload);
  }
  await Promise.resolve();
  return {
    ok: true,
    mode: 'stub',
    taskRef: `stub-task:${payload.collectionKey}:${payload.stepId}`,
    messageThreadRef: `stub-thread:${payload.collectionKey}:${payload.stepId}`,
  };
}
