/**
 * Wave 16 RU: единый JSON-ответ ошибок Workshop2 API с русскими messageRu и gate-checks.
 */
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import {
  localizeWorkshop2GateChecks,
  mapWorkshop2GateReasonCodeToRu,
} from '@/lib/production/workshop2-gate-messages-ru';

/** Канон русских сообщений для кодов ошибок API (без gate id). */
export const WORKSHOP2_API_ERROR_RU: Record<string, string> = {
  invalid_path: 'Некорректный путь API — проверьте collectionId и articleId.',
  invalid_request: 'Некорректный запрос — проверьте параметры.',
  not_found: 'Ресурс не найден на сервере Workshop2.',
  invalid_json: 'Тело запроса — невалидный JSON.',
  invalid_body: 'Тело запроса не прошло валидацию.',
  version_conflict: 'Конфликт версий: досье изменено другим пользователем. Обновите страницу.',
  handoff_commit_blocked: 'Handoff заблокирован — закройте блокеры ТЗ и vault.',
  handoff_not_ready: 'Handoff не готов — закройте блокеры ТЗ и связанные разделы.',
  handoff_not_found: 'Запись handoff не найдена в досье.',
  handoff_pdf_blocked: 'Экспорт PDF handoff заблокирован — закройте визуальные ворота.',
  lab_dip_pending: 'Lab dip в ожидании — заказ образца временно заблокирован.',
  global_gate_blocked: 'Глобальные ворота ТЗ не пройдены — заполните обязательные секции.',
  preflight_blocked: 'Pre-flight ТЗ не пройден — исправьте блокеры перед handoff.',
  missing_collection_id: 'Не указан идентификатор коллекции.',
  missing_collection_or_article: 'Укажите collectionId и articleId.',
  missing_territory_id: 'Не указан идентификатор территории.',
  missing_params: 'Не хватает обязательных query-параметров.',
  article_ids_required: 'Передайте articleIds[] в теле или query запроса.',
  too_many_articles: 'Превышен лимит артикулов для batch-операции.',
  unauthorized: 'Недостаточно прав для операции Workshop2.',
  dossier_not_found: 'Досье не найдено на сервере Workshop2.',
  invalid_collection: 'Некорректный идентификатор коллекции.',
  sample_order_not_found: 'Заказ образца не найден.',
  change_request_not_found: 'Change request не найден.',
  revision_not_found: 'Ревизия vault не найдена в dossier.',
  publish_blocked: 'Публикация шоурума заблокирована — исправьте blockers.',
  moysklad_not_configured: 'МойСклад не настроен — задайте MOYSKLAD_TOKEN.',
  postgres_down: 'PostgreSQL недоступен — проверьте WORKSHOP2_DATABASE_URL.',
  file_size_rejected: 'Размер файла не допускается для vault.',
  internal_error: 'Внутренняя ошибка Workshop2 API — повторите запрос или проверьте логи.',
  invalid_kind: 'Некорректный kind документа (ttn | upd).',
};

export type Workshop2ApiErrorDetails = {
  messageRu?: string;
  checks?: Workshop2ApiGateCheck[];
  [key: string]: unknown;
};

/** Стандартное тело ошибки Workshop2 (без NextResponse — удобно для unit-тестов). */
export function buildWorkshop2ErrorRuBody(
  code: string,
  details?: Workshop2ApiErrorDetails
): Record<string, unknown> {
  const mapped = mapWorkshop2GateReasonCodeToRu(code);
  const messageRu =
    details?.messageRu?.trim() ||
    mapped ||
    WORKSHOP2_API_ERROR_RU[code] ||
    `Ошибка Workshop2 (${code}).`;

  const { messageRu: _omit, checks, ...rest } = details ?? {};
  const body: Record<string, unknown> = {
    ok: false,
    error: code,
    messageRu,
    ...rest,
  };
  if (checks?.length) {
    body.checks = localizeWorkshop2GateChecks(checks);
  }
  return body;
}

/** Стандартный JSON-ответ ошибки Workshop2 (lazy NextResponse — без поломки Jest). */
export function jsonWorkshop2ErrorRu(
  status: number,
  code: string,
  details?: Workshop2ApiErrorDetails
): import('next/server').NextResponse {
  const { NextResponse } = require('next/server') as typeof import('next/server');
  return NextResponse.json(buildWorkshop2ErrorRuBody(code, details), { status });
}
