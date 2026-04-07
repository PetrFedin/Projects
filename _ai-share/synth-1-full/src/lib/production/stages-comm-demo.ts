/**
 * Демо-данные для связки «этап коллекции → сообщения / календарь / задачи» (MVP без API).
 * Логика каналов: на этапе материалов — бренд, снабжение, поставщики, производство; не розница.
 */

import type { CalendarEvent } from '@/lib/types/calendar';
import type { BrandTaskRecord } from '@/lib/production-data/port';
import type { Chat, ChatMessage } from '@/lib/types';

/** Короткие названия этапов для заголовка чата из матрицы */
const STEP_TITLE_RU: Record<string, string> = {
  brief: 'Бриф',
  'assortment-map': 'Карта ассортимента',
  'collection-hub': 'Коллекция в цеху',
  costing: 'Себестоимость',
  materials: 'Материалы и поставщики',
  'photo-ref': 'Фотореференсы',
  'tech-pack': 'Tech Pack',
  samples: 'Семплы',
};

function skuSlug(s: string): string {
  return s.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 48);
}

/** Все токены, по которым ищем в календаре/задачах из URL матрицы */
export function matrixContextSearchBlob(
  stepId: string,
  ctx: { sku?: string | null; season?: string | null; order?: string | null }
): string {
  const sku = firstSku(ctx.sku ?? undefined);
  const season = firstSeason(ctx.season ?? undefined);
  const order = ctx.order?.split('|')[0]?.trim() ?? '';
  return [sku, season, order, stepId].filter(Boolean).join(' ').toLowerCase();
}

function calendarDescriptionWithBlob(
  base: string,
  stepId: string,
  ctx: { sku?: string | null; season?: string | null; order?: string | null }
): string {
  const blob = matrixContextSearchBlob(stepId, ctx);
  return blob ? `${base}\n${blob}` : base;
}

/** Этапы, где не поднимаем в топ B2B-чаты с магазинами. */
export const SUPPLY_AND_STUDIO_STEP_IDS = new Set([
  'materials',
  'photo-ref',
  'tech-pack',
  'samples',
  'costing',
  'collection-hub',
]);

/** Предпочтительный мок-чат при открытии из матрицы по этапу. */
export const STAGE_PREFERRED_CHAT_ID: Partial<Record<string, string>> = {
  materials: 'chat_fabric_supply',
  'photo-ref': 'chat_design_team',
  'tech-pack': 'chat_design_team',
  samples: 'chat_production_line',
  costing: 'chat_marketing',
  /** Хаб коллекции: внутренний контур, не тред с байером */
  'collection-hub': 'chat_design_team',
};

function firstSku(raw: string | null | undefined): string {
  if (!raw?.trim()) return '';
  const t = raw.split('|')[0] ?? raw;
  return t.split(',')[0]?.trim() ?? '';
}

function firstSeason(raw: string | null | undefined): string {
  if (!raw?.trim()) return '';
  return (raw.split('|')[0] ?? raw).trim();
}

export function demoCalendarEventsForProductionStage(
  stepId: string,
  ctx: { sku?: string | null; season?: string | null; order?: string | null }
): CalendarEvent[] {
  if (!stepId) return [];
  const sku = firstSku(ctx.sku ?? undefined);
  const season = firstSeason(ctx.season ?? undefined);
  const tag = [sku, season].filter(Boolean).join(' · ');
  const suffix = tag ? ` · ${tag}` : '';
  const now = Date.now();
  const iso = (ms: number) => new Date(ms).toISOString();
  const skuKey = sku ? skuSlug(sku) : 'all';

  if (stepId === 'materials') {
    return [
      {
        id: `demo-stage-cal-materials-rfq-${skuKey}`,
        ownerId: 'brand',
        ownerRole: 'brand',
        ownerName: 'Закупки · бренд',
        calendarId: 'demo-stage',
        title: `Окно RFQ поставщикам ткани/фурнитуры${suffix}`,
        description: calendarDescriptionWithBlob(
          `Внутренний контур и поставщики (не розница). Заказ: ${ctx.order ?? '—'}`,
          stepId,
          ctx
        ),
        layer: 'production',
        visibility: 'internal',
        type: 'task',
        startAt: iso(now + 86400000),
        endAt: iso(now + 86400000 + 7200000),
        participants: [],
        importance: 'high',
      },
      {
        id: `demo-stage-cal-materials-review-${skuKey}`,
        ownerId: 'brand',
        ownerRole: 'brand',
        ownerName: 'Технолог · бренд',
        calendarId: 'demo-stage',
        title: `Ревизия образцов материалов${suffix}`,
        description: calendarDescriptionWithBlob(
          'Согласование с технологом и снабжением перед фиксацией в ТЗ',
          stepId,
          ctx
        ),
        layer: 'production',
        visibility: 'internal',
        type: 'event',
        startAt: iso(now + 86400000 * 2),
        endAt: iso(now + 86400000 * 2 + 3600000),
        participants: [],
        importance: 'medium',
      },
    ];
  }

  if (stepId === 'tech-pack') {
    return [
      {
        id: `demo-stage-cal-techpack-sync-${skuKey}`,
        ownerId: 'brand',
        ownerRole: 'brand',
        ownerName: 'Конструкторский контур',
        calendarId: 'demo-stage',
        title: `Синхронизация Tech Pack${suffix}`,
        description: calendarDescriptionWithBlob(
          'Дизайн, технолог, при необходимости фабрика — без канала магазина',
          stepId,
          ctx
        ),
        layer: 'production',
        visibility: 'internal',
        type: 'event',
        startAt: iso(now + 43200000),
        endAt: iso(now + 43200000 + 5400000),
        participants: [],
        importance: 'high',
      },
    ];
  }

  return [
    {
      id: `demo-stage-cal-generic-${stepId}-${skuKey}`,
      ownerId: 'brand',
      ownerRole: 'brand',
      ownerName: 'Производственный контур',
      calendarId: 'demo-stage',
      title: `Слот по этапу «${stepId}»${suffix}`,
      description: calendarDescriptionWithBlob('Демо-событие из матрицы этапов (до API)', stepId, ctx),
      layer: 'production',
      visibility: 'internal',
      type: 'task',
      startAt: iso(now + 3600000),
      endAt: iso(now + 3600000 + 3600000),
      participants: [],
      importance: 'medium',
    },
  ];
}

export function demoTasksForProductionStage(
  stepId: string,
  ctx: { sku?: string | null; season?: string | null; order?: string | null }
): BrandTaskRecord[] {
  if (!stepId) return [];
  const sku = firstSku(ctx.sku ?? undefined);
  const season = firstSeason(ctx.season ?? undefined);
  const tag = [sku, season].filter(Boolean).join(' · ');
  const now = new Date().toISOString();
  const ctxBlob = matrixContextSearchBlob(stepId, ctx);
  const proj = (p: string) => (ctxBlob ? `${p} · ${ctxBlob}` : p);

  if (stepId === 'materials') {
    return [
      {
        id: `demo-stage-task-materials-bom-${skuSlug(sku || 'x')}`,
        title: tag ? `Сверить BOM и нормы расхода · ${tag}` : 'Сверить BOM и нормы расхода',
        status: 'in_progress',
        assignee: 'Технолог',
        due: 'Ср',
        project: proj('Материалы · снабжение'),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `demo-stage-task-materials-rfq-${skuSlug(sku || 'x')}`,
        title: tag ? `RFQ фурнитуры (2 поставщика) · ${tag}` : 'RFQ фурнитуры (2 поставщика)',
        status: 'todo',
        assignee: 'Закупки',
        due: 'Пт',
        project: proj('Материалы · снабжение'),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `demo-stage-task-materials-order-${skuSlug(sku || 'x')}`,
        title: ctx.order ? `Привязка к закупке ${ctx.order}` : 'Привязка артикула к закупке PO',
        status: 'todo',
        assignee: 'Снабжение',
        due: 'Пн',
        project: proj('Материалы · снабжение'),
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  if (stepId === 'tech-pack') {
    return [
      {
        id: `demo-stage-task-tp-review-${skuSlug(sku || 'x')}`,
        title: tag ? `Ревью Tech Pack · ${tag}` : 'Ревью Tech Pack',
        status: 'in_progress',
        assignee: 'Технолог',
        due: 'Чт',
        project: proj('Tech pack'),
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  return [
    {
      id: `demo-stage-task-${stepId}-${skuSlug(sku || 'x')}`,
      title: tag ? `Задача по этапу (${stepId}) · ${tag}` : `Задача по этапу (${stepId})`,
      status: 'todo',
      assignee: 'Команда',
      due: '—',
      project: proj('Коллекция'),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

type SpLike = { get(name: string): string | null };

export function matrixContextChatId(sp: SpLike): string | null {
  const step = sp.get('stagesStep')?.trim() ?? '';
  if (!step) return null;
  const sku = firstSku(sp.get('sku'));
  const key = sku ? skuSlug(sku) : 'all';
  return `chat_matrix_ctx_${step}_${key}`;
}

/** Верхний чат в списке: этап из матрицы; при SKU в URL — тред по артикулу. */
export function matrixContextChatRow(sp: SpLike): Chat | null {
  const step = sp.get('stagesStep')?.trim() ?? '';
  if (!step) return null;
  const sku = firstSku(sp.get('sku'));
  const id = matrixContextChatId(sp);
  if (!id) return null;
  const season = firstSeason(sp.get('season'));
  const order = sp.get('order')?.split('|')[0]?.trim() ?? '';
  const st = STEP_TITLE_RU[step] ?? step;
  return {
    id,
    title: sku ? `${st} · ${sku}` : `${st} · перечень коллекции`,
    subtitle: sku
      ? [season, order].filter(Boolean).join(' · ') || 'Тред из матрицы этапов по артикулу'
      : [season, order, `этап ${step}`].filter(Boolean).join(' · ') || `Тред из матрицы этапов · ${step}`,
    time: 'сейчас',
    participantsCount: 3,
    type: 'team',
    avatar: '/logo_placeholder.svg',
    creatorId: 'user_petr',
    linkCollectionId: season || undefined,
    participants: [
      { id: 'user_petr', name: 'Petr', role: 'brand', isOnline: true, isAdmin: true },
      { id: 'user_olga', name: 'Ольга (Технолог)', role: 'brand', isOnline: true },
      { id: 'user_sergey', name: 'Сергей (Поставщик)', role: 'supplier', isOnline: false },
    ],
  };
}

export function matrixContextMessages(sp: SpLike): ChatMessage[] {
  const id = matrixContextChatId(sp);
  if (!id) return [];
  const stepRaw = sp.get('stagesStep')?.trim() ?? '';
  const sku = firstSku(sp.get('sku'));
  const season = firstSeason(sp.get('season'));
  const order = sp.get('order')?.split('|')[0]?.trim() ?? '';
  const ts = Date.now();
  const st = STEP_TITLE_RU[stepRaw] ?? stepRaw;

  if (!sku) {
    return [
      {
        id: ts + 1,
        chatId: id,
        user: 'Ольга (Технолог)',
        text: `Этап «${st}»${season ? ` · ${season}` : ''}: держим общий контур; чтобы видеть переписку по конкретному артикулу, откройте иконку чата из матрицы при выбранном SKU в перечне.`,
        time: '10:02',
        createdAt: ts - 7200000,
        type: 'message',
      },
      {
        id: ts + 2,
        chatId: id,
        user: 'Сергей (Поставщик)',
        text: `По этапу ${stepRaw}: жду список SKU из вашего среза — тогда разложу RFQ и образцы по позициям.`,
        time: '10:09',
        createdAt: ts - 3600000,
        type: 'message',
      },
      {
        id: ts + 3,
        chatId: id,
        user: 'Petr',
        text: order
          ? `Заказ ${order}: без фиксации по этапу «${st}» не двигаем PO.`
          : `Синхронизируем статусы в матрице этапов — этот тред совпадает с контекстом ссылки из схемы/матрицы.`,
        time: '10:14',
        createdAt: ts - 1800000,
        type: 'message',
      },
    ];
  }

  return [
    {
      id: ts + 1,
      chatId: id,
      user: 'Ольга (Технолог)',
      text: `По ${sku}${season ? ` (${season})` : ''}: нормы расхода на согласовании, черновик в PIM.`,
      time: '10:04',
      createdAt: ts - 7200000,
      type: 'message',
    },
    {
      id: ts + 2,
      chatId: id,
      user: 'Сергей (Поставщик)',
      text: `Отправил образцы подкладки и молний под ${sku}. Жду решения по основной ткани до пятницы.`,
      time: '10:18',
      createdAt: ts - 3600000,
      type: 'message',
    },
    {
      id: ts + 3,
      chatId: id,
      user: 'Petr',
      text: order
        ? `Держим связку с заказом ${order}: без согласования материалов в PO не переносим.`
        : 'Фиксируем поставщика по основной ткани после сравнения RFQ.',
      time: '10:22',
      createdAt: ts - 1800000,
      type: 'message',
    },
  ];
}
