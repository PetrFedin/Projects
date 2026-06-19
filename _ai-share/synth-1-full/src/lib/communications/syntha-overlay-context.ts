/**
 * Ядро №3 — надстройка Syntha (чаты / календарь): единый контракт query-параметров для привязки треда и задач к сущностям.
 * Согласован с `stages-url.ts` (коллекция, артикул, этап каталога) и с B2B (`order` / `orderId`).
 *
 * Политика: переписка не заменяет ТЗ/PO — источник правды по этапам ядра №1 остаётся в матрице и в разработке коллекции;
 * URL здесь только связывает модули коммуникаций с тем же контекстом, что производство и B2B.
 *
 * Публичный API: {@link parseSynthaOverlayContext}, {@link appendSynthaOverlaySearchParams}, бренд/shop-хелперы для сообщений и календаря.
 */

import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ROUTES } from '@/lib/routes';
import {
  COLLECTION_ID_PARAM,
  PRODUCT_ID_PARAM,
  STAGES_SKU_PARAM,
  STAGES_STEP_PARAM,
} from '@/lib/production/stages-url';

/** Ссылка на PO / номер заказа поставщику (текстовый ref, не путать с B2B wholesale order). */
export const SYNTHA_PO_REF_PARAM = 'po';

export type SynthaOverlayParsedContext = {
  orderId: string | null;
  poRef: string | null;
  collectionId: string | null;
  /** id артикула в flow / полу: stagesSku || productId */
  articleId: string | null;
  catalogStageId: string | null;
  skuCode: string | null;
  /** workspace/PG thread context type (b2b_order, workshop2_article, …) */
  contextType?: string | null;
};

/** `contextType` + `contextId` с workspace/PG threads (b2b_order, workshop2_article). */
export function parseWorkspaceThreadContext(searchParams: URLSearchParams): {
  orderId: string | null;
  collectionId: string | null;
  articleId: string | null;
} {
  const contextType = searchParams.get('contextType')?.trim() || '';
  const contextId = searchParams.get('contextId')?.trim() || '';
  if (!contextType || !contextId) {
    return { orderId: null, collectionId: null, articleId: null };
  }
  if (contextType === 'b2b_order') {
    return { orderId: contextId, collectionId: null, articleId: null };
  }
  if (contextType === 'workshop2_article') {
    const sep = contextId.indexOf(':');
    if (sep <= 0) return { orderId: null, collectionId: null, articleId: null };
    return {
      orderId: null,
      collectionId: contextId.slice(0, sep).trim() || null,
      articleId: contextId.slice(sep + 1).trim() || null,
    };
  }
  return { orderId: null, collectionId: null, articleId: null };
}

export function parseSynthaOverlayContext(
  searchParams: URLSearchParams
): SynthaOverlayParsedContext {
  const workspace = parseWorkspaceThreadContext(searchParams);
  const orderId =
    searchParams.get('orderId')?.trim() ||
    searchParams.get('order')?.trim() ||
    searchParams.get('wholesaleOrderId')?.trim() ||
    workspace.orderId ||
    null;
  const stagesSku = searchParams.get(STAGES_SKU_PARAM)?.trim() || '';
  const productId = searchParams.get(PRODUCT_ID_PARAM)?.trim() || '';
  const articleId = stagesSku || productId || workspace.articleId || null;
  const collectionId =
    searchParams.get(COLLECTION_ID_PARAM)?.trim() || workspace.collectionId || null;
  return {
    orderId,
    poRef: searchParams.get(SYNTHA_PO_REF_PARAM)?.trim() || null,
    collectionId,
    articleId,
    catalogStageId: searchParams.get(STAGES_STEP_PARAM)?.trim() || null,
    skuCode: searchParams.get('sku')?.trim() || null,
  };
}

/** URL-контекст коммуникаций (без core demo fallback) — для скрытия дублей баннеров. */
export function hasCommunicationsUrlContext(searchParams: URLSearchParams): boolean {
  const ctx = parseSynthaOverlayContext(searchParams);
  if (ctx.orderId?.trim()) return true;
  if (ctx.collectionId?.trim() && ctx.articleId?.trim()) return true;
  const contextType = searchParams.get('contextType')?.trim() || '';
  const contextId = searchParams.get('contextId')?.trim() || '';
  return Boolean(contextType && contextId);
}

export type SynthaOverlayHrefContext = {
  orderId?: string | null;
  poRef?: string | null;
  collectionId?: string | null;
  articleId?: string | null;
  catalogStageId?: string | null;
  skuCode?: string | null;
};

/**
 * Добавляет в `URLSearchParams` канонические ключи контекста ядра №3 (заказ, коллекция, артикул, этап, PO ref, sku).
 * Используйте при сборке произвольных deep-link в сообщения/календарь без дублирования имён параметров.
 */
export function appendSynthaOverlaySearchParams(
  sp: URLSearchParams,
  ctx: SynthaOverlayHrefContext
): void {
  const oid = ctx.orderId?.trim();
  if (oid) {
    sp.set('order', oid);
    sp.set('orderId', oid);
  }
  const cid = ctx.collectionId?.trim();
  if (cid) sp.set(COLLECTION_ID_PARAM, cid);
  const aid = ctx.articleId?.trim();
  if (aid) sp.set(STAGES_SKU_PARAM, aid);
  const st = ctx.catalogStageId?.trim();
  if (st) sp.set(STAGES_STEP_PARAM, st);
  const sku = ctx.skuCode?.trim();
  if (sku) sp.set('sku', sku);
  const po = ctx.poRef?.trim();
  if (po) sp.set(SYNTHA_PO_REF_PARAM, po);
}

function messagesOverlaySearchQuery(ctx: SynthaOverlayHrefContext): string | undefined {
  const qParts: string[] = [];
  if (ctx.orderId?.trim()) qParts.push(`B2B ${ctx.orderId.trim()}`);
  if (ctx.collectionId?.trim()) qParts.push(ctx.collectionId.trim());
  if (ctx.catalogStageId?.trim()) qParts.push(`этап ${ctx.catalogStageId.trim()}`);
  if (ctx.poRef?.trim()) qParts.push(`PO ${ctx.poRef.trim()}`);
  return qParts.length ? qParts.join(' · ') : undefined;
}

/**
 * Сообщения бренда с полным контекстом (B2B-заказ + опционально коллекция/артикул/этап / PO ref).
 * Параметр `q` — семя поиска по чатам (как в {@link brandMessagesB2bOrderContextHref}).
 */
export function brandMessagesSynthaOverlayHref(ctx: SynthaOverlayHrefContext): string {
  const sp = new URLSearchParams();
  appendSynthaOverlaySearchParams(sp, ctx);
  const mq = messagesOverlaySearchQuery(ctx);
  if (mq) sp.set('q', mq);
  const q = sp.toString();
  return q ? `${ROUTES.brand.messages}?${q}` : ROUTES.brand.messages;
}

/**
 * Сообщения байера: тот же контракт query, что {@link brandMessagesSynthaOverlayHref}, маршрут `/shop/messages`.
 * Сквозной контекст (заказ + этап + коллекция) при открытии ссылки от бренда или из матрицы.
 */
export function shopMessagesSynthaOverlayHref(ctx: SynthaOverlayHrefContext): string {
  const sp = new URLSearchParams();
  appendSynthaOverlaySearchParams(sp, ctx);
  const mq = messagesOverlaySearchQuery(ctx);
  if (mq) sp.set('q', mq);
  const q = sp.toString();
  return q ? `${ROUTES.shop.messages}?${q}` : ROUTES.shop.messages;
}

/**
 * Календарь бренда со слоем задач и тем же контекстом, что и сообщения — дедлайны можно фильтровать по этапу ядра №1.
 */
export function brandCalendarTasksSynthaOverlayHref(ctx: SynthaOverlayHrefContext): string {
  const sp = new URLSearchParams();
  sp.set('layers', 'tasks');
  appendSynthaOverlaySearchParams(sp, ctx);
  const q = sp.toString();
  return `${ROUTES.brand.calendar}?${q}`;
}

/**
 * Календарь байера со слоем задач — зеркало {@link brandCalendarTasksSynthaOverlayHref} для `/shop/calendar`.
 */
export function shopCalendarTasksSynthaOverlayHref(ctx: SynthaOverlayHrefContext): string {
  const sp = new URLSearchParams();
  sp.set('layers', 'tasks');
  appendSynthaOverlaySearchParams(sp, ctx);
  const q = sp.toString();
  const base = isPlatformCoreMode() ? ROUTES.shop.b2bCalendar : ROUTES.shop.calendar;
  return `${base}?${q}`;
}
