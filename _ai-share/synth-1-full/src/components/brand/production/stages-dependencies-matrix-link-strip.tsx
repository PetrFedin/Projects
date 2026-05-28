'use client';

import Link from 'next/link';
import { CalendarDays, MessageCircle, MessageSquare, StickyNote } from 'lucide-react';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/** Поля артикула для query ссылок «чат / задачи / календарь / заметки» в матрице этапов. */
export type StagesCommLinkArticle = {
  sku: string;
  season?: string;
  primaryOrderRef?: string;
};

/** Поля артикула для агрегации колонки «Связь» по перечню SKU. */
export type StagesMatrixLinkAggregationArticle = {
  id: string;
  currentStageId: string;
};

/** Сетка строки матрицы этапов (колонки в т.ч. «Связь»). */
export const MATRIX_GRID =
  'grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.45fr)_minmax(0,0.78fr)_minmax(0,0.55fr)_minmax(0,1fr)_minmax(0,0.72fr)_minmax(0,0.72fr)_minmax(0,1.2fr)] grid-cols-1 gap-3';

/** MVP: детерминированный «шум» по паре SKU×этап (только после проверки допустимости этапа). */
function matrixSkuStepActivityHash(skuId: string, stepId: string): number {
  const s = `${skuId}\0${stepId}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function catalogStepIndex(steps: readonly { id: string }[], stepId: string): number {
  const i = steps.findIndex((s) => s.id === stepId);
  return i;
}

/** Состояния иконок колонки «Связь» (матрица): нет / риск / ок; для заметок — neutral = есть фиксация без «всё зелёное». */
type MatrixLinkIconState = 'none' | 'risk' | 'ok' | 'neutral';

type MatrixSkuStepLinkSignals = {
  chat: MatrixLinkIconState;
  tasks: MatrixLinkIconState;
  calendar: MatrixLinkIconState;
  notes: MatrixLinkIconState;
  tasksOpen: number;
  tasksClosed: number;
};

/**
 * Детерминированные сигналы по паре SKU×этап (MVP без API). Те же границы контура, что раньше у счётчиков:
 * чат / задачи / заметки — только для этапов не «впереди» текущего положения артикула; календарь — текущий и следующий этап.
 */
function deriveMatrixSkuStepLinkSignals(
  skuId: string,
  stepId: string,
  steps: readonly CollectionStep[],
  currentStageId: string
): MatrixSkuStepLinkSignals | null {
  const idxStep = catalogStepIndex(steps, stepId);
  const idxCur = catalogStepIndex(steps, currentStageId);
  if (idxStep < 0 || idxCur < 0) return null;

  const eligibleNotesChat = idxStep <= idxCur;
  const eligibleCalendar = idxStep <= idxCur + 1;
  if (!eligibleNotesChat && !eligibleCalendar) return null;

  const h = matrixSkuStepActivityHash(skuId, stepId);
  const out: MatrixSkuStepLinkSignals = {
    chat: 'none',
    tasks: 'none',
    calendar: 'none',
    notes: 'none',
    tasksOpen: 0,
    tasksClosed: 0,
  };

  if (eligibleNotesChat) {
    const hc = h % 11;
    if (hc >= 4 && hc <= 6) out.chat = 'ok';
    else if (hc >= 7) out.chat = 'risk';

    const ht = h % 9;
    if (ht >= 3 && ht <= 5) {
      out.tasksOpen = 1 + (h % 2);
      out.tasksClosed = h % 3 === 0 ? 1 : 0;
      out.tasks = 'risk';
    } else if (ht >= 6) {
      out.tasksClosed = 2;
      out.tasks = 'ok';
    }

    const hn = h % 6;
    if (hn >= 2) {
      out.notes = h % 19 === 0 ? 'risk' : 'neutral';
    }
  }

  if (eligibleCalendar) {
    const hc = (h + stepId.length * 7) % 13;
    if (hc >= 4 && hc <= 7) out.calendar = 'risk';
    else if (hc >= 8) out.calendar = 'ok';
  }

  return out;
}

export type MatrixStepLinkRowModel = {
  chat: MatrixLinkIconState;
  tasks: MatrixLinkIconState;
  calendar: MatrixLinkIconState;
  notes: MatrixLinkIconState;
  tasksOpenTotal: number;
  /** Этап в матрице «готово», но по каналу остались открытые коммуникации — пульс на иконке. */
  attentionPulse: { chat: boolean; tasks: boolean; calendar: boolean; notes: boolean };
  lines: { chat: string; tasks: string; calendar: string; notes: string };
  aria: { chat: string; tasks: string; calendar: string; notes: string };
};

export function aggregateMatrixStepLinkRow(
  articles: readonly StagesMatrixLinkAggregationArticle[],
  stepId: string,
  steps: readonly CollectionStep[],
  flowDoc: CollectionSkuFlowDoc
): MatrixStepLinkRowModel {
  const signals: MatrixSkuStepLinkSignals[] = [];
  const attentionPulse = { chat: false, tasks: false, calendar: false, notes: false };

  for (const a of articles) {
    const s = deriveMatrixSkuStepLinkSignals(a.id, stepId, steps, a.currentStageId);
    if (!s) continue;
    signals.push(s);
    const rowSt = flowDoc.skus[a.id]?.stages[stepId]?.status ?? 'not_started';
    const stepMarkedDone = rowSt === 'done' || rowSt === 'skipped';
    if (!stepMarkedDone) continue;
    if (s.chat === 'risk') attentionPulse.chat = true;
    if (s.tasks === 'risk' || s.tasksOpen > 0) attentionPulse.tasks = true;
    if (s.calendar === 'risk') attentionPulse.calendar = true;
    if (s.notes === 'risk') attentionPulse.notes = true;
  }

  const chatRisk = signals.filter((s) => s.chat === 'risk').length;
  const chatOk = signals.filter((s) => s.chat === 'ok').length;
  let chat: MatrixLinkIconState = 'none';
  if (chatRisk > 0) chat = 'risk';
  else if (chatOk > 0) chat = 'ok';

  const tasksOpenTotal = signals.reduce((acc, s) => acc + s.tasksOpen, 0);
  const tasksClosedTotal = signals.reduce((acc, s) => acc + s.tasksClosed, 0);
  const anyTasks = signals.some((s) => s.tasks !== 'none');
  let tasks: MatrixLinkIconState = 'none';
  if (tasksOpenTotal > 0) tasks = 'risk';
  else if (anyTasks && signals.every((s) => s.tasks === 'none' || s.tasks === 'ok')) tasks = 'ok';

  const calRisk = signals.filter((s) => s.calendar === 'risk').length;
  const calOk = signals.filter((s) => s.calendar === 'ok').length;
  let calendar: MatrixLinkIconState = 'none';
  if (calRisk > 0) calendar = 'risk';
  else if (calOk > 0) calendar = 'ok';

  const notesRisk = signals.filter((s) => s.notes === 'risk').length;
  const notesNeu = signals.filter((s) => s.notes === 'neutral').length;
  let notes: MatrixLinkIconState = 'none';
  if (notesRisk > 0) notes = 'risk';
  else if (notesNeu > 0) notes = 'neutral';

  const n = articles.length;
  const chatLine =
    chat === 'none'
      ? 'Чат: в контуре этапа нет тредов по перечню'
      : chat === 'risk'
        ? `Чат: у ${chatRisk} из ${n} SKU ждём входящий ответ после исходящего`
        : `Чат: по ${chatOk} SKU есть ответ в переписке`;
  const tasksLine =
    tasks === 'none'
      ? 'Задачи: нет задач в контексте этапа (демо-модель)'
      : tasks === 'risk'
        ? `Задачи: открыто слотов ≈ ${tasksOpenTotal} по перечню (закрыто ≈ ${tasksClosedTotal})`
        : `Задачи: по перечню открытых нет, есть закрытые (≈ ${tasksClosedTotal} слотов)`;
  const calendarLine =
    calendar === 'none'
      ? 'Встреча / календарь: нет запланированных слотов в контуре'
      : calendar === 'risk'
        ? `Календарь: у ${calRisk} SKU есть слот, встреча ещё не отмечена как проведённая`
        : `Календарь: есть проведённые / закрытые слоты (≈ ${calOk} SKU)`;
  const notesLine =
    notes === 'none'
      ? 'Заметки: нет записей по процессу в контуре этапа'
      : notes === 'risk'
        ? `Заметки: у ${notesRisk} SKU есть пометки с открытым вопросом`
        : `Заметки: ${notesNeu} SKU с фиксациями по ходу этапа`;

  return {
    chat,
    tasks,
    calendar,
    notes,
    tasksOpenTotal,
    attentionPulse,
    lines: { chat: chatLine, tasks: tasksLine, calendar: calendarLine, notes: notesLine },
    aria: {
      chat:
        chat === 'none'
          ? 'Чат: нет переписки'
          : chat === 'risk'
            ? 'Чат: ожидается ответ'
            : 'Чат: есть ответ',
      tasks:
        tasks === 'none'
          ? 'Задачи: нет'
          : tasks === 'risk'
            ? `Задачи: открытые, всего открыто около ${tasksOpenTotal}`
            : 'Задачи: все закрытые в контуре',
      calendar:
        calendar === 'none'
          ? 'Встреча: нет в календаре'
          : calendar === 'risk'
            ? 'Встреча: запланирована, не проведена'
            : 'Встреча: проведена или слот закрыт',
      notes:
        notes === 'none'
          ? 'Заметок нет'
          : notes === 'risk'
            ? 'Заметки: есть открытые вопросы'
            : `Заметки: есть записи (${notesNeu} SKU)`,
    },
  };
}

/** Query для ссылок «задачи / сообщения / календарь»: артикул, сезон, заказ, этап, общий поиск. */
export function buildStagesCommLinkQuery(
  articles: readonly StagesCommLinkArticle[],
  stepId: string
): string {
  const p = new URLSearchParams();
  p.set('stagesStep', stepId);
  const skus = [...new Set(articles.map((a) => a.sku))].sort();
  const seasons = [...new Set(articles.map((a) => a.season).filter(Boolean))] as string[];
  const orders = [...new Set(articles.map((a) => a.primaryOrderRef).filter(Boolean))] as string[];
  if (skus.length === 1) p.set('sku', skus[0]);
  else if (skus.length <= 6) p.set('sku', skus.join(','));
  else p.set('sku', `${skus.slice(0, 5).join(',')}|n=${skus.length}`);
  if (seasons.length === 1) p.set('season', seasons[0]);
  else if (seasons.length > 1) p.set('season', seasons.slice(0, 4).join('|'));
  if (orders.length === 1) p.set('order', orders[0]);
  else if (orders.length > 1) p.set('order', orders.slice(0, 5).join('|'));
  /** Без id этапа в q — иначе поиск в календаре/задачах скрывает демо-слоты */
  const qTokens = [...skus.slice(0, 4), ...seasons.slice(0, 2), ...orders.slice(0, 2)].filter(
    Boolean
  );
  if (qTokens.length) p.set('q', qTokens.join(' '));
  return p.toString();
}

/** Query для заметок/документов — тот же контекст, что у задач/чата. */
export function buildStagesNotesLinkQuery(
  articles: readonly StagesCommLinkArticle[],
  stepId: string
): string {
  const base = buildStagesCommLinkQuery(articles, stepId);
  return base ? `${base}&context=stagesNotes` : 'context=stagesNotes';
}

function matrixLinkIconWrapClass(state: MatrixLinkIconState): string {
  if (state === 'none') {
    return 'border-border-default/90 text-text-muted bg-white/80 opacity-[0.38] hover:opacity-90';
  }
  if (state === 'risk') {
    return 'border-amber-300/90 bg-amber-50 text-amber-800 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]';
  }
  if (state === 'ok') {
    return 'border-emerald-300/90 bg-emerald-50 text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,0.12)]';
  }
  return 'border-border-default/90 bg-bg-surface2 text-text-primary';
}

/** Пульс, если этап в матрице уже «готово», а по каналу связи остались открытые пункты. */
const MATRIX_LINK_ATTENTION_PULSE_CLASS =
  'ring-2 ring-amber-500/75 shadow-[0_0_0_2px_rgba(245,158,11,0.22)] animate-pulse';
const MATRIX_LINK_ATTENTION_ARIA_SUFFIX =
  ' Этап в матрице завершён, по каналу остались открытые пункты.';

const MATRIX_LINK_TIP_FOOTER = 'Клик — открыть модуль с контекстом этапа и артикула в фокусе.';

const MATRIX_LINK_TIP_CONTENT_CLASS =
  'z-[500] max-w-[min(100vw-1rem,17rem)] border border-border-default bg-white px-2.5 py-2 text-text-primary shadow-lg';

/** Сетка 2×2: чат · задачи / календарь · заметки; у каждой иконки свой tooltip. */
export function MatrixLinkStrip({
  row,
  commQuery,
  notesQuery,
  mergeCollectionQuery,
  collectionQuery,
}: {
  row: MatrixStepLinkRowModel;
  commQuery: string;
  notesQuery: string;
  mergeCollectionQuery: (path: string, q: string) => string;
  collectionQuery: string;
}) {
  const chatHref = mergeCollectionQuery(`${ROUTES.brand.messages}?${commQuery}`, collectionQuery);
  const tasksHref = mergeCollectionQuery(`${ROUTES.brand.tasks}?${commQuery}`, collectionQuery);
  const calHref = mergeCollectionQuery(`${ROUTES.brand.calendar}?${commQuery}`, collectionQuery);
  const notesHref = mergeCollectionQuery(
    `${ROUTES.brand.documents}?${notesQuery}`,
    collectionQuery
  );

  const iconClass = 'h-3.5 w-3.5 shrink-0';
  const slotClass =
    'relative inline-flex h-7 w-[26px] shrink-0 items-center justify-center rounded-md border text-[0] transition-colors hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/80';

  return (
    <div
      className="grid w-[56px] shrink-0 grid-cols-2 justify-items-start gap-x-1 gap-y-1 overflow-visible"
      role="group"
      aria-label="Связь: чат, задачи, календарь, заметки"
    >
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <Link
            href={chatHref}
            className={cn(
              slotClass,
              matrixLinkIconWrapClass(row.chat),
              row.attentionPulse.chat && MATRIX_LINK_ATTENTION_PULSE_CLASS
            )}
            aria-label={
              row.attentionPulse.chat
                ? `Чат. ${row.aria.chat}${MATRIX_LINK_ATTENTION_ARIA_SUFFIX}`
                : `Чат. ${row.aria.chat}`
            }
          >
            <MessageCircle
              className={iconClass}
              strokeWidth={row.chat === 'none' ? 2 : 2.25}
              aria-hidden
            />
            {row.chat === 'risk' ? (
              <span
                className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-1 ring-white"
                aria-hidden
              />
            ) : null}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className={MATRIX_LINK_TIP_CONTENT_CLASS}>
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">Чат</p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.chat}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
            {MATRIX_LINK_TIP_FOOTER}
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <Link
            href={tasksHref}
            className={cn(
              slotClass,
              matrixLinkIconWrapClass(row.tasks),
              row.attentionPulse.tasks && MATRIX_LINK_ATTENTION_PULSE_CLASS
            )}
            aria-label={
              row.attentionPulse.tasks
                ? `Задачи. ${row.aria.tasks}${MATRIX_LINK_ATTENTION_ARIA_SUFFIX}`
                : `Задачи. ${row.aria.tasks}`
            }
          >
            <MessageSquare
              className={iconClass}
              strokeWidth={row.tasks === 'none' ? 2 : 2.25}
              aria-hidden
            />
            {row.tasksOpenTotal > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-amber-600 px-0.5 text-[8px] font-bold leading-none text-white ring-1 ring-white">
                {row.tasksOpenTotal > 9 ? '9+' : row.tasksOpenTotal}
              </span>
            ) : null}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className={MATRIX_LINK_TIP_CONTENT_CLASS}>
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">Задачи</p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.tasks}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
            {MATRIX_LINK_TIP_FOOTER}
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <Link
            href={calHref}
            className={cn(
              slotClass,
              matrixLinkIconWrapClass(row.calendar),
              row.attentionPulse.calendar && MATRIX_LINK_ATTENTION_PULSE_CLASS
            )}
            aria-label={
              row.attentionPulse.calendar
                ? `Календарь. ${row.aria.calendar}${MATRIX_LINK_ATTENTION_ARIA_SUFFIX}`
                : `Календарь. ${row.aria.calendar}`
            }
          >
            <CalendarDays
              className={iconClass}
              strokeWidth={row.calendar === 'none' ? 2 : 2.25}
              aria-hidden
            />
            {row.calendar === 'risk' ? (
              <span
                className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-1 ring-white"
                aria-hidden
              />
            ) : null}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className={MATRIX_LINK_TIP_CONTENT_CLASS}>
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
            Календарь
          </p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.calendar}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
            {MATRIX_LINK_TIP_FOOTER}
          </p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <Link
            href={notesHref}
            className={cn(
              slotClass,
              matrixLinkIconWrapClass(row.notes),
              row.attentionPulse.notes && MATRIX_LINK_ATTENTION_PULSE_CLASS
            )}
            aria-label={
              row.attentionPulse.notes
                ? `Заметки. ${row.aria.notes}${MATRIX_LINK_ATTENTION_ARIA_SUFFIX}`
                : `Заметки. ${row.aria.notes}`
            }
          >
            <StickyNote
              className={iconClass}
              strokeWidth={row.notes === 'none' ? 2 : 2.25}
              aria-hidden
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className={MATRIX_LINK_TIP_CONTENT_CLASS}>
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
            Заметки
          </p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.notes}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
            {MATRIX_LINK_TIP_FOOTER}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
