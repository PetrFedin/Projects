'use client';

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import {
  STAGES_PRODUCTION_SITES,
  getHandbookAudiences,
  stagesArticleDisplayLabel,
} from '@/lib/production/stages-tab-facets';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SkuProcessDetailPanel } from '@/components/brand/production/SkuProcessDetailPanel';
import {
  getCollectionBrandGuideTitles,
  getCollectionBrandNarrativeTitles,
  type CollectionStep,
} from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  getEffectiveDependsOn,
  getProductionStageDisplayMode,
  normalizeProductionFlowProfileId,
  PRODUCTION_FLOW_PROFILES,
  type ProductionFlowProfileId,
} from '@/lib/production/collection-production-profiles';
import {
  aggregateDepSatisfied,
  aggregateSkuProgressLine,
  appendSkuStageAuditLine,
  buildAggregateStatusMap,
  patchProductionProfile,
  patchSkuStage,
  setStageStatusForAllSkus,
  type CollectionSkuFlowDoc,
  type MatrixStepStatus,
  type SkuStageDetail,
} from '@/lib/production/unified-sku-flow-store';
import {
  evaluateStageDataFill,
  STAGE_FILL_EDIT_TAB_LABELS,
} from '@/lib/production/stage-data-fill-spec';
import {
  loadStagesLastInnerSubTab,
  loadStagesPanelsSession,
  saveStagesLastInnerSubTab,
  saveStagesPanelsSession,
} from '@/lib/production/stages-panels-session';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ROUTES } from '@/lib/routes';
import {
  STAGES_MATRIX_PHASE_PARAM,
  STAGES_MATRIX_Q_PARAM,
  STAGES_SKU_PARAM,
  STAGES_SKU_PANEL_STEP_PARAM,
  STAGES_SKU_PANEL_TAB_PARAM,
  STAGES_SKU_PANEL_TAB_VALUES,
  STAGES_WORK_SKU_PARAM,
  parseStagesSkuPanelTab,
  type StagesSkuPanelTab,
} from '@/lib/production/stages-url';

export { STAGES_SKU_PARAM, STAGES_WORK_SKU_PARAM };
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Crosshair,
  Download,
  Filter,
  FolderPlus,
  Info,
  LayoutGrid,
  ListTree,
  Lock,
  MessageSquare,
  MessageCircle,
  MinusCircle,
  Package,
  Pin,
  Plus,
  StickyNote,
  Trash2,
  Upload,
} from 'lucide-react';

/** Подсказка по наведению: без «заливки» на hover у иконки — текст в панели. */
function StagesHelpHover({
  trigger,
  title,
  children,
  align = 'start',
  wide,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  wide?: boolean;
}) {
  const alignProp = align === 'end' ? 'end' : align === 'center' ? 'center' : 'start';
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        align={alignProp}
        side="bottom"
        sideOffset={8}
        collisionPadding={16}
        className={cn(
          'border-border-default text-text-primary z-[500] border bg-white p-0 shadow-lg',
          'max-h-[min(72vh,32rem)] overflow-y-auto overflow-x-hidden',
          wide
            ? 'w-[min(100vw-1.5rem,28rem)] max-w-[min(100vw-1.5rem,28rem)]'
            : 'w-[min(100vw-1.5rem,24rem)] max-w-[min(100vw-1.5rem,24rem)]'
        )}
      >
        <div className="px-3 py-3 sm:px-4 sm:py-3.5">
<<<<<<< HEAD
          <p className="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">
            {title}
          </p>
          <div className="space-y-2.5 pt-2.5 text-[11px] leading-relaxed text-slate-600">
=======
          <p className="border-border-subtle text-text-primary border-b pb-2 text-sm font-semibold">
            {title}
          </p>
          <div className="text-text-secondary space-y-2.5 pt-2.5 text-[11px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
            {children}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

/** Иконка «i»: только смена оттенка текста при hover, без цветного фона. */
const STAGES_HELP_ICON_BTN_CLASS =
  'inline-flex h-8 w-8 shrink-0 cursor-help items-center justify-center rounded-md p-0 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-subtle/70';

/** Radix TooltipTrigger asChild прокидывает ref и onPointer* на потомка — без forwardRef подсказка не открывается. */
const StagesHelpIconTrigger = React.forwardRef<
  HTMLButtonElement,
  { 'aria-label': string; className?: string } & React.ComponentPropsWithoutRef<'button'>
>(function StagesHelpIconTrigger({ 'aria-label': ariaLabel, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className={cn(STAGES_HELP_ICON_BTN_CLASS, 'relative z-20', className)}
      aria-label={ariaLabel}
    >
      <Info className="pointer-events-none h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
    </button>
  );
});
StagesHelpIconTrigger.displayName = 'StagesHelpIconTrigger';

function StagesHelpWhyBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
<<<<<<< HEAD
    <div className="space-y-1 rounded-md border border-slate-100 bg-slate-50/90 px-2.5 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <div className="space-y-1 text-[10px] leading-snug text-slate-600">{children}</div>
=======
    <div className="border-border-subtle bg-bg-surface2/90 space-y-1 rounded-md border px-2.5 py-2">
      <p className="text-text-secondary text-[10px] font-bold uppercase tracking-wide">{title}</p>
      <div className="text-text-secondary space-y-1 text-[10px] leading-snug">{children}</div>
>>>>>>> recover/cabinet-wip-from-stash
    </div>
  );
}

/** Внутренние табы: URL stagesSub=ops | process | sku (по умолчанию ops) */
const STAGES_SUB_VALUES = ['ops', 'process', 'sku'] as const;
export type StagesSubTab = (typeof STAGES_SUB_VALUES)[number];

function normalizeStagesSub(raw: string | null): StagesSubTab {
  if (raw === 'process' || raw === 'sku') return raw;
  return 'ops';
}

/** Вкладка, на которой последний раз меняли срез / перечень / узел схемы (пульс-иконка фильтра только на ней). */
const STAGES_FILTER_SUB_PARAM = 'stagesFilterSub';

function subTabFromStagesParams(params: URLSearchParams): StagesSubTab {
  return normalizeStagesSub(params.get('stagesSub'));
}

function filterActiveInParams(params: URLSearchParams): boolean {
  if (params.get('stagesChainFocus')) return true;
  if (
    params.get('stagesAudience') ||
    params.get('stagesSeason') ||
    params.get('stagesL1') ||
    params.get('stagesL2') ||
    params.get('stagesL3') ||
    params.get('stagesFab')
  ) {
    return true;
  }
  return false;
}

/** Несколько значений в одном query-параметре: OR внутри оси; между осями — AND. */
function decodeFacetList(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((x) => {
      const t = x.trim();
      if (!t) return '';
      try {
        return decodeURIComponent(t);
      } catch {
        return t;
      }
    })
    .filter(Boolean);
}

function encodeFacetList(values: Iterable<string>): string {
  return [...values]
    .sort()
    .map((v) => encodeURIComponent(v))
    .join(',');
}

type FacetAxis = 'audience' | 'season' | 'l1' | 'l2' | 'l3' | 'fab';

type FacetSetBundle = Record<FacetAxis, Set<string>>;

function articleMatchesFacetBundle(
  a: StagesTabArticle,
  bundle: FacetSetBundle,
  omit?: FacetAxis
): boolean {
  if (
    omit !== 'audience' &&
    bundle.audience.size > 0 &&
    (!a.audienceId || !bundle.audience.has(a.audienceId))
  )
    return false;
  if (omit !== 'season' && bundle.season.size > 0 && (!a.season || !bundle.season.has(a.season)))
    return false;
  if (omit !== 'l1' && bundle.l1.size > 0 && (!a.categoryL1 || !bundle.l1.has(a.categoryL1)))
    return false;
  if (omit !== 'l2' && bundle.l2.size > 0 && (!a.categoryL2 || !bundle.l2.has(a.categoryL2)))
    return false;
  if (omit !== 'l3' && bundle.l3.size > 0 && (!a.categoryL3 || !bundle.l3.has(a.categoryL3)))
    return false;
  if (
    omit !== 'fab' &&
    bundle.fab.size > 0 &&
    (!a.productionSiteId || !bundle.fab.has(a.productionSiteId))
  )
    return false;
  return true;
}

const SLICE_PANEL_HEIGHT_CLASS = 'h-[min(22rem,52vh)] min-h-[260px]';

/** После изменения фильтров: снять метку владельца, если фильтров нет; иначе при setOwner — запомнить вкладку. */
function finishStagesFilterMutation(params: URLSearchParams, setOwner?: StagesSubTab) {
  if (!filterActiveInParams(params)) {
    params.delete(STAGES_FILTER_SUB_PARAM);
    return;
  }
  if (setOwner !== undefined) {
    params.set(STAGES_FILTER_SUB_PARAM, setOwner);
  }
}

const DEPS_SCHEMA_CHUNK = 5;
/** Колонок «Доски этапов» в одном ряду (далее — перенос на следующую строку). */
const BOARD_STAGES_PER_ROW = 4;

function chunkStepsForDepsSchema<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

/** Всегда 5 слотов узла + стрелки — последний неполный ряд не растягивает карточки на всю ширину. */
const DEPS_SCHEMA_FULL_ROW_GRID =
  'minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr) minmax(1.5rem,1.85rem) minmax(0,1fr)';

const MATRIX_GRID =
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

type MatrixStepLinkRowModel = {
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

function aggregateMatrixStepLinkRow(
  articles: readonly StagesTabArticle[],
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

/** Query для заметок/документов — тот же контекст, что у задач/чата. */
function buildStagesNotesLinkQuery(articles: readonly StagesTabArticle[], stepId: string): string {
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
function MatrixLinkStrip({
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
<<<<<<< HEAD
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Чат</p>
          <p className="mt-1 text-[11px] leading-snug text-slate-700">{row.lines.chat}</p>
          <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">
=======
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">Чат</p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.chat}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Задачи</p>
          <p className="mt-1 text-[11px] leading-snug text-slate-700">{row.lines.tasks}</p>
          <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">
=======
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">Задачи</p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.tasks}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Календарь</p>
          <p className="mt-1 text-[11px] leading-snug text-slate-700">{row.lines.calendar}</p>
          <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">
=======
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
            Календарь
          </p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.calendar}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Заметки</p>
          <p className="mt-1 text-[11px] leading-snug text-slate-700">{row.lines.notes}</p>
          <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500">
=======
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
            Заметки
          </p>
          <p className="text-text-primary mt-1 text-[11px] leading-snug">{row.lines.notes}</p>
          <p className="border-border-subtle text-text-secondary mt-1.5 border-t pt-1.5 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
            {MATRIX_LINK_TIP_FOOTER}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

/** Query для ссылок «задачи / сообщения / календарь»: артикул, сезон, заказ, этап, общий поиск. */
function buildStagesCommLinkQuery(articles: readonly StagesTabArticle[], stepId: string): string {
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

/** Фиксированная высота шапки колонки доски — выравнивание по горизонтали */
const BOARD_COL_HEADER_H = 'min-h-[118px]';

export type StagesTabArticle = {
  id: string;
  sku: string;
  name: string;
  currentStageId: string;
  deliveryWindowId?: string;
  audienceId?: string;
  audienceLabel?: string;
  categoryLeafId?: string;
  categoryPathLabel?: string;
  season?: string;
  categoryL1?: string;
  categoryL2?: string;
  categoryL3?: string;
  productionSiteId?: string;
  productionSiteLabel?: string;
  fabricSuppliersLabel?: string;
  fabricStockNote?: string;
  /** Номер заказа (B2B/PO), в котором ведётся артикул — для ссылок в чаты и календарь */
  primaryOrderRef?: string;
};

function skuDependencySatisfiedForHint(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  depId: string,
  steps: readonly CollectionStep[]
): boolean {
  const depStep = steps.find((x) => x.id === depId);
  const st = doc.skus[skuId]?.stages[depId]?.status ?? 'not_started';
  if (depStep?.relaxesWhenNotStarted && st === 'not_started') return true;
  return st === 'done' || st === 'skipped';
}

/** Что сделать, чтобы двигаться к следующему этапу каталога для одного SKU (зависимости = статусы матрицы). */
function hintTextForArticleNextCatalogStep(
  doc: CollectionSkuFlowDoc,
  steps: readonly CollectionStep[],
  a: StagesTabArticle,
  skuLabel: string,
  profileId: ProductionFlowProfileId
): string {
  const curId = a.currentStageId;
  const idx = steps.findIndex((s) => s.id === curId);
  const curTitle = steps[idx]?.title ?? curId;
  if (idx < 0) {
    return `${skuLabel}: этап «${curTitle}» не сопоставлен каталогу коллекции — проверьте данные артикула.`;
  }
  if (idx >= steps.length - 1) {
    return `${skuLabel}: по каталогу вы на последнем этапе («${curTitle}»). Дальше — отгрузка, B2B и склады в профильных модулях; статусы поддерживайте в «Матрице этапов».`;
  }
  const next = steps[idx + 1];
  const nextDeps = getEffectiveDependsOn(next, profileId);
  const missing = nextDeps.filter((d) => !skuDependencySatisfiedForHint(doc, a.id, d, steps));
  if (missing.length > 0) {
    const names = missing.map((d) => steps.find((x) => x.id === d)?.title ?? d).join(' · ');
    return `${skuLabel} · сейчас «${curTitle}». Чтобы перейти к «${next.title}», сначала закройте зависимости: ${names} — в «Матрице этапов» для этого артикула отметьте эти этапы «Готово» (или выполните работу в привязанных к строке вкладках).`;
  }
  return `${skuLabel} · сейчас «${curTitle}». Следующий этап — «${next.title}»; зависимости для него закрыты. Завершите работу по «${curTitle}», в матрице отметьте этап «Готово» и ведите «${next.title}» (переходы по ссылкам из матрицы).`;
}

function getSkuContourNavigationDetail(
  doc: CollectionSkuFlowDoc,
  steps: readonly CollectionStep[],
  a: StagesTabArticle,
  profileId: ProductionFlowProfileId
): {
  cur?: CollectionStep;
  next?: CollectionStep;
  blockedDeps: { id: string; title: string }[];
  atEnd: boolean;
} {
  const curId = a.currentStageId;
  const idx = steps.findIndex((s) => s.id === curId);
  const cur = idx >= 0 ? steps[idx] : undefined;
  const atEnd = idx >= 0 && idx >= steps.length - 1;
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : undefined;
  let blockedDeps: { id: string; title: string }[] = [];
  if (next) {
    blockedDeps = getEffectiveDependsOn(next, profileId)
      .filter((d) => !skuDependencySatisfiedForHint(doc, a.id, d, steps))
      .map((d) => ({ id: d, title: steps.find((x) => x.id === d)?.title ?? d }));
  }
  return { cur, next, blockedDeps, atEnd };
}

/** Локальные черновики коллекции/артикулов (без API) — см. local-collection-inventory. */
export type StagesLocalInventoryTools = {
  collectionId: string;
  totalArticlesInCollection: number;
  poolArticleCount: number;
  contextFilterActive: boolean;
  onResetFacets: () => void;
  localRemovableArticles: { id: string; sku: string }[];
  isUserDefinedCollection: boolean;
  /** true если SKU уже в пуле коллекции */
  isSkuDuplicate: (skuCode: string) => boolean;
  onAddArticle: (skuCode: string, displayName?: string) => boolean;
  onCreateCollection: (rawId: string, displayName: string) => void;
  onRemoveLocalArticle: (articleId: string) => void;
  onRemoveUserCollection: () => void;
  onExportInventory: () => void;
  onImportInventory: (jsonText: string, replaceAll: boolean) => { ok: boolean; message: string };
  /** Экспорт unified SKU flow (localStorage-слой) для текущего collectionFlowKey */
  onExportUnifiedFlow?: () => void;
};

export type StagesLocalInventoryToolsInput = Omit<
  StagesLocalInventoryTools,
  'poolArticleCount' | 'contextFilterActive' | 'onResetFacets'
>;

type Props = {
  collectionArticles: StagesTabArticle[];
  flowDoc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  setUnifiedDoc: React.Dispatch<React.SetStateAction<CollectionSkuFlowDoc>>;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  /** Ключ unified flow (как на странице производства) — индикатор сохранения в панели SKU. */
  collectionFlowKey: string;
  localInventoryTools?: StagesLocalInventoryToolsInput;
};

function StagesLocalInventoryToolbar({
  tools,
  layout = 'card',
}: {
  tools: StagesLocalInventoryTools;
  /** plain — компактная панель без тяжёлого Card (раскрывается по кнопке). */
  layout?: 'card' | 'plain';
}) {
  const [sku, setSku] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [colId, setColId] = useState('');
  const [colName, setColName] = useState('');
  const [formError, setFormError] = useState('');
  const [importReplaceAll, setImportReplaceAll] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{ tone: 'ok' | 'err'; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const collectionLabel =
    tools.collectionId.trim() === ''
      ? 'по умолчанию (все демо-артикулы + локальные в общий пул)'
      : `«${tools.collectionId}»`;

  const submitArticle = () => {
    if (!sku.trim()) {
      setFormError('Введите код артикула (например SS28-JKT-01).');
      return;
    }
    if (tools.isSkuDuplicate(sku.trim())) {
      setFormError('Такой код SKU уже есть в текущей коллекции.');
      return;
    }
    setFormError('');
    const ok = tools.onAddArticle(sku.trim(), displayName.trim() || undefined);
    if (!ok) {
      setFormError('Не удалось добавить артикул (проверьте дубликат кода).');
      return;
    }
    setSku('');
    setDisplayName('');
  };

  const submitCollection = () => {
    if (!colId.trim()) {
      setFormError('Введите код коллекции (латиница, цифры, дефис).');
      return;
    }
    setFormError('');
    tools.onCreateCollection(colId.trim(), colName.trim() || colId.trim());
    setColId('');
    setColName('');
  };

  const onPickImportFile = () => fileInputRef.current?.click();

  const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const res = tools.onImportInventory(text, importReplaceAll);
      setImportFeedback({ tone: res.ok ? 'ok' : 'err', text: res.message });
    };
    reader.readAsText(f);
  };

  const emptyCol = tools.totalArticlesInCollection === 0;

  const body = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden
        onChange={onImportFileChange}
      />
      {formError ? (
        <p
          className="rounded-md border border-rose-200 bg-rose-50/90 px-2 py-1.5 text-[10px] font-medium text-rose-700"
          role="alert"
        >
          {formError}
        </p>
      ) : null}
      {importFeedback ? (
        <p
          className={cn(
            'rounded-md border px-2 py-1.5 text-[10px] font-medium',
            importFeedback.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800'
              : 'border-rose-200 bg-rose-50/90 text-rose-700'
          )}
          role="status"
        >
          {importFeedback.text}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={() => tools.onExportInventory()}
        >
          <Download className="h-3 w-3" aria-hidden />
          Черновики коллекций
        </Button>
        {tools.onExportUnifiedFlow ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-[10px]"
            onClick={() => tools.onExportUnifiedFlow?.()}
          >
            <Download className="h-3 w-3" aria-hidden />
            Flow по SKU
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={onPickImportFile}
        >
          <Upload className="h-3 w-3" aria-hidden />
          Импорт JSON
        </Button>
<<<<<<< HEAD
        <label className="flex cursor-pointer select-none items-center gap-1.5 text-[10px] text-slate-600">
=======
        <label className="text-text-secondary flex cursor-pointer select-none items-center gap-1.5 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
          <Checkbox
            checked={importReplaceAll}
            onCheckedChange={(v) => setImportReplaceAll(v === true)}
          />
          Заменить всё (не сливать)
        </label>
      </div>
      {tools.isUserDefinedCollection ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200/90 bg-amber-50/50 px-3 py-2">
          <p className="text-[10px] leading-snug text-amber-950">
            Это <strong>ваша локальная коллекция</strong> — можно удалить целиком вместе с
            артикулами.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-7 shrink-0 gap-1 text-[9px]"
            onClick={() => tools.onRemoveUserCollection()}
          >
            <Trash2 className="h-3 w-3" aria-hidden />
            Удалить коллекцию
          </Button>
        </div>
      ) : null}
      {emptyCol ? (
        <div className="space-y-2 rounded-lg border border-emerald-100/90 bg-white/80 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-800">
            Новая коллекция
          </p>
<<<<<<< HEAD
          <p className="text-[10px] leading-snug text-slate-600">
=======
          <p className="text-text-secondary text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
            Создаётся запись в списке коллекций и открывается контекст{' '}
            <code className="text-[9px]">collectionId</code> — дальше добавьте артикулы ниже.
          </p>
          <div className="flex flex-col flex-wrap gap-2 sm:flex-row">
            <Input
              className="h-8 text-[10px] sm:max-w-[10rem]"
              placeholder="Код: SS28-PRE"
              value={colId}
              onChange={(e) => setColId(e.target.value)}
              aria-label="Код новой коллекции"
            />
            <Input
              className="h-8 min-w-[8rem] flex-1 text-[10px]"
              placeholder="Название (необязательно)"
              value={colName}
              onChange={(e) => setColName(e.target.value)}
              aria-label="Название новой коллекции"
            />
            <Button
              type="button"
              size="sm"
              className="h-8 shrink-0 gap-1 text-[10px] font-semibold"
              variant="secondary"
              onClick={submitCollection}
            >
              <FolderPlus className="h-3 w-3" aria-hidden />
              Создать и открыть
            </Button>
          </div>
        </div>
      ) : null}
<<<<<<< HEAD
      <div className="space-y-2 rounded-lg border border-slate-200/90 bg-white/90 p-3">
        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
=======
      <div className="border-border-default/90 space-y-2 rounded-lg border bg-white/90 p-3">
        <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
          {emptyCol ? 'Первый артикул в этой коллекции' : 'Добавить артикул'}
        </p>
        <div className="flex flex-col flex-wrap items-stretch gap-2 sm:flex-row sm:items-center">
          <Input
            className="h-8 text-[10px] sm:max-w-[11rem]"
            placeholder="Код SKU *"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            aria-label="Код нового артикула"
          />
          <Input
            className="h-8 min-w-[8rem] flex-1 text-[10px]"
            placeholder="Название модели (необязательно)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            aria-label="Название модели"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 gap-1 text-[10px] font-semibold"
            onClick={submitArticle}
          >
            <Plus className="h-3 w-3" aria-hidden />
            Добавить в коллекцию
          </Button>
        </div>
      </div>
      {tools.localRemovableArticles.length > 0 ? (
<<<<<<< HEAD
        <div className="space-y-2 rounded-lg border border-slate-200/80 bg-slate-50/60 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
=======
        <div className="border-border-default/80 bg-bg-surface2/60 space-y-2 rounded-lg border p-3">
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
            Локальные артикулы (удаление)
          </p>
          <ul className="max-h-32 space-y-1.5 overflow-y-auto">
            {tools.localRemovableArticles.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 text-[10px]">
<<<<<<< HEAD
                <span className="truncate font-mono text-slate-800" title={a.id}>
=======
                <span className="text-text-primary truncate font-mono" title={a.id}>
>>>>>>> recover/cabinet-wip-from-stash
                  {a.sku}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 shrink-0 p-0 text-rose-600 hover:text-rose-700"
                  aria-label={`Удалить артикул ${a.sku}`}
                  onClick={() => {
                    if (
                      typeof window !== 'undefined' &&
                      !window.confirm(`Удалить локальный артикул ${a.sku}?`)
                    )
                      return;
                    tools.onRemoveLocalArticle(a.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );

  if (layout === 'plain') {
    return (
      <div className="space-y-3 rounded-lg border border-emerald-200/80 bg-white/95 p-3 shadow-sm">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
          <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Коллекция и артикулы
        </p>
<<<<<<< HEAD
        <p className="-mt-1 text-[9px] leading-snug text-slate-600">
=======
        <p className="text-text-secondary -mt-1 text-[9px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
          Контекст {collectionLabel}. Импорт/экспорт, добавление SKU — без API (
          <strong className="text-text-primary">ProductionDataPort</strong> / localStorage).
        </p>
        {body}
      </div>
    );
  }

  return (
    <Card className="border-emerald-200/90 bg-gradient-to-br from-emerald-50/40 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[11px] uppercase tracking-tight text-emerald-900">
          <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Коллекция и артикулы (локально, без API)
        </CardTitle>
<<<<<<< HEAD
        <CardDescription className="text-[10px] leading-relaxed text-slate-600">
          Данные в <strong className="text-slate-800">localStorage</strong>; контекст{' '}
          {collectionLabel}. Импорт/экспорт — перенос между браузерами. Записи процесса по SKU
          синхронизируются при удалении. Дальше —{' '}
          <strong className="text-slate-800">ProductionDataPort</strong>.
=======
        <CardDescription className="text-text-secondary text-[10px] leading-relaxed">
          Данные в <strong className="text-text-primary">localStorage</strong>; контекст{' '}
          {collectionLabel}. Импорт/экспорт — перенос между браузерами. Записи процесса по SKU
          синхронизируются при удалении. Дальше —{' '}
          <strong className="text-text-primary">ProductionDataPort</strong>.
>>>>>>> recover/cabinet-wip-from-stash
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">{body}</CardContent>
    </Card>
  );
}

function statusLabel(s: MatrixStepStatus, blocked: boolean, profileNa?: boolean) {
  if (profileNa) return 'Вне профиля';
  if (blocked) return 'Заблокировано';
  if (s === 'done') return 'Готово';
  if (s === 'in_progress') return 'В работе';
  return 'Не начато';
}

/** Пульсирующая цветная иконка: активен контекстный фильтр (внутренние табы этапов или родительский триггер). */
export function StagesContextFilterPulseIcon() {
  return (
    <span
      className="pointer-events-none relative inline-flex h-4 w-4 shrink-0 items-center justify-center"
      title="Активен фильтр среза / перечня / узла схемы"
    >
      <span
<<<<<<< HEAD
        className="pointer-events-none absolute inline-flex h-3 w-3 animate-ping rounded-full bg-violet-400/45 motion-reduce:hidden"
        aria-hidden
      />
      <Filter
        className="pointer-events-none relative h-3.5 w-3.5 animate-pulse text-violet-600 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)] motion-reduce:animate-none motion-reduce:opacity-100"
=======
        className="bg-accent-primary/15 pointer-events-none absolute inline-flex h-3 w-3 animate-ping rounded-full motion-reduce:hidden"
        aria-hidden
      />
      <Filter
        className="text-accent-primary pointer-events-none relative h-3.5 w-3.5 animate-pulse drop-shadow-[0_0_5px_rgba(139,92,246,0.5)] motion-reduce:animate-none motion-reduce:opacity-100"
>>>>>>> recover/cabinet-wip-from-stash
        strokeWidth={2.5}
        aria-hidden
      />
      <span className="sr-only">Активен фильтр контекста</span>
    </span>
  );
}

/** Вертикальный переход: колонка 1–5 под последним узлом потока в строке (чётная — справа, нечётная — слева). */
/** Шеврон сворачивания + «гвоздик»: закреплён — всегда развёрнуто; без закрепления — шеврон сворачивает. */
function StagesCollapsePinBar({
  pinned,
  onPinnedChange,
  open,
  onOpenChange,
  collapseAriaLabel,
}: {
  pinned: boolean;
  onPinnedChange: (v: boolean) => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  collapseAriaLabel: string;
}) {
  return (
<<<<<<< HEAD
    <div className="ml-1 flex shrink-0 items-center gap-0.5 border-l border-slate-200/80 pl-2">
=======
    <div className="border-border-default/80 ml-1 flex shrink-0 items-center gap-0.5 border-l pl-2">
>>>>>>> recover/cabinet-wip-from-stash
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 shrink-0 p-0"
            disabled={pinned}
            aria-expanded={pinned ? true : open}
            aria-label={collapseAriaLabel}
            onClick={() => !pinned && onOpenChange(!open)}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                pinned ? 'text-text-muted' : 'text-text-secondary',
                (pinned || open) && 'rotate-180'
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
          {pinned
            ? 'Снимите закрепление (гвоздик), чтобы сворачивать блок'
            : open
              ? 'Свернуть'
              : 'Развернуть'}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 shrink-0 p-0',
              pinned ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
            )}
            aria-pressed={pinned}
            aria-label={pinned ? 'Снять закрепление блока' : 'Закрепить блок развёрнутым'}
            onClick={() => {
              if (pinned) onPinnedChange(false);
              else {
                onPinnedChange(true);
                onOpenChange(true);
              }
            }}
          >
            <Pin
              className={cn('h-3.5 w-3.5', pinned && 'fill-accent-primary/40')}
              strokeWidth={2.25}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-xs">
          {pinned
            ? 'Снять закрепление — затем можно сворачивать шевроном'
            : 'Закрепить: блок всегда развёрнут, шеврон отключён'}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function DepsRowTurnConnector({ column }: { column: number }) {
  const col = Math.min(Math.max(Math.round(column), 1), 5);
  return (
    <div className="grid min-h-[28px] w-full shrink-0 grid-cols-5" aria-hidden>
      {[1, 2, 3, 4, 5].map((c) =>
        c === col ? (
          <span key={c} className="flex flex-col items-center justify-start">
<<<<<<< HEAD
            <span className="h-2.5 w-0.5 rounded-full bg-indigo-500/90" />
            <ArrowDown className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2.5} />
=======
            <span className="bg-accent-primary/90 h-2.5 w-0.5 rounded-full" />
            <ArrowDown className="text-accent-primary h-3.5 w-3.5" strokeWidth={2.5} />
>>>>>>> recover/cabinet-wip-from-stash
          </span>
        ) : (
          <span key={c} />
        )
      )}
    </div>
  );
}

export function StagesDependenciesTabContent({
  collectionArticles,
  flowDoc,
  steps,
  collectionQuery,
  floorHref,
  mergeCollectionQuery,
  setUnifiedDoc,
  getProductionFloorTabTitle,
  collectionFlowKey,
  localInventoryTools,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const pathBase = pathname ?? '/';
  const sp = searchParams ?? new URLSearchParams();
  const pendingMatrixScrollRef = useRef<string | null>(null);

  const legacyPickRaw = sp.get('stagesPick') || '';
  const stagesSkuParam = sp.get(STAGES_SKU_PARAM)?.trim() ?? '';
  const rawAudience = sp.get('stagesAudience') ?? '';
  const rawSeason = sp.get('stagesSeason') ?? '';
  const rawL1 = sp.get('stagesL1') ?? '';
  const rawL2 = sp.get('stagesL2') ?? '';
  const rawL3 = sp.get('stagesL3') ?? '';
  const rawFab = sp.get('stagesFab') ?? '';
  const chainFocusStepId = sp.get('stagesChainFocus') || '';
  /** Устаревший deep link: переносится в stagesSku и удаляется */
  const stagesMatrixSkuParam = sp.get('stagesMatrixSku')?.trim() ?? '';
  const stagesWorkSkuParam = sp.get(STAGES_WORK_SKU_PARAM)?.trim() ?? '';
  const stagesSkuPanelParam = sp.get(STAGES_SKU_PANEL_STEP_PARAM)?.trim() ?? '';
  const stagesSkuPanelTabParsed = parseStagesSkuPanelTab(sp.get(STAGES_SKU_PANEL_TAB_PARAM));
  const matrixPhaseParam = sp.get(STAGES_MATRIX_PHASE_PARAM)?.trim() ?? '';
  const matrixTextQParam = sp.get(STAGES_MATRIX_Q_PARAM)?.trim() ?? '';

  const productionProfileId = useMemo(
    () => normalizeProductionFlowProfileId(flowDoc.productionProfileId),
    [flowDoc.productionProfileId]
  );
  const productionProfileHint = useMemo(
    () => PRODUCTION_FLOW_PROFILES.find((p) => p.id === productionProfileId)?.hint ?? '',
    [productionProfileId]
  );
  const productionProfileLabel = useMemo(
    () => PRODUCTION_FLOW_PROFILES.find((p) => p.id === productionProfileId)?.label ?? '',
    [productionProfileId]
  );

  const audienceFacetList = useMemo(() => decodeFacetList(rawAudience), [rawAudience]);
  const seasonFacetList = useMemo(() => decodeFacetList(rawSeason), [rawSeason]);
  const l1FacetList = useMemo(() => decodeFacetList(rawL1), [rawL1]);
  const l2FacetList = useMemo(() => decodeFacetList(rawL2), [rawL2]);
  const l3FacetList = useMemo(() => decodeFacetList(rawL3), [rawL3]);
  const fabFacetList = useMemo(() => decodeFacetList(rawFab), [rawFab]);

  const facetBundle: FacetSetBundle = useMemo(
    () => ({
      audience: new Set(audienceFacetList),
      season: new Set(seasonFacetList),
      l1: new Set(l1FacetList),
      l2: new Set(l2FacetList),
      l3: new Set(l3FacetList),
      fab: new Set(fabFacetList),
    }),
    [audienceFacetList, seasonFacetList, l1FacetList, l2FacetList, l3FacetList, fabFacetList]
  );

  const legacyPickIds = useMemo(
    () =>
      legacyPickRaw
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    [legacyPickRaw]
  );

  /** Только useSearchParams + pathname из Next — без window, чтобы не конфликтовать с клиентской навигацией и не зациклить replace. */
  const replaceQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(sp.toString());
      params.delete('stagesProd');
      mutate(params);
      const q = params.toString();
      const href = q ? `${pathBase}?${q}` : pathBase;
      router.replace(href, { scroll: false });
    },
    [pathBase, router, sp]
  );

  const setFocusSku = useCallback(
    (id: string, opts?: { preserveChain?: boolean }) => {
      replaceQuery((params) => {
        if (id) params.set(STAGES_SKU_PARAM, id);
        else params.delete(STAGES_SKU_PARAM);
        params.delete('stagesPick');
        params.delete(STAGES_WORK_SKU_PARAM);
        if (!opts?.preserveChain) params.delete('stagesChainFocus');
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const toggleFacetValue = useCallback(
    (
      param: 'stagesAudience' | 'stagesSeason' | 'stagesL1' | 'stagesL2' | 'stagesL3' | 'stagesFab',
      value: string
    ) => {
      replaceQuery((params) => {
        const cur = decodeFacetList(params.get(param));
        const next = new Set(cur);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        const enc = encodeFacetList(next);
        if (!enc) params.delete(param);
        else params.set(param, enc);
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const toggleChainFocus = useCallback(
    (stepId: string) => {
      replaceQuery((params) => {
        const cur = params.get('stagesChainFocus');
        if (cur === stepId) {
          params.delete('stagesChainFocus');
          finishStagesFilterMutation(params, undefined);
        } else {
          params.set('stagesChainFocus', stepId);
          params.delete('stagesMatrixSku');
          finishStagesFilterMutation(params, 'process');
        }
      });
    },
    [replaceQuery]
  );

  const clearAllFacets = useCallback(() => {
    replaceQuery((params) => {
      params.delete('stagesSeason');
      params.delete('stagesAudience');
      params.delete('stagesL1');
      params.delete('stagesL2');
      params.delete('stagesL3');
      params.delete('stagesFab');
      params.delete('stagesChainFocus');
      params.delete(STAGES_MATRIX_PHASE_PARAM);
      params.delete(STAGES_MATRIX_Q_PARAM);
      params.delete(STAGES_FILTER_SUB_PARAM);
      finishStagesFilterMutation(params, undefined);
    });
  }, [replaceQuery]);

  const subTab = useMemo(() => normalizeStagesSub(sp.get('stagesSub')), [sp]);

  const setSubTab = useCallback(
    (next: StagesSubTab) => {
      saveStagesLastInnerSubTab(collectionFlowKey, next);
      const params = new URLSearchParams(sp.toString());
      params.delete('stagesProd');
      if (next === 'ops') params.delete('stagesSub');
      else params.set('stagesSub', next);
      const q = params.toString();
      router.replace(q ? `${pathBase}?${q}` : pathBase, { scroll: false });
    },
    [collectionFlowKey, pathBase, router, sp]
  );

  useEffect(() => {
    if (sp.get('stagesSub')?.trim()) return;
    const saved = loadStagesLastInnerSubTab(collectionFlowKey);
    if (!saved || saved === 'ops') return;
    replaceQuery((params) => {
      params.set('stagesSub', saved);
      finishStagesFilterMutation(params, saved);
    });
  }, [collectionFlowKey, sp.toString(), replaceQuery]);

  const contextFilterActive = Boolean(
    rawAudience || rawSeason || rawL1 || rawL2 || rawL3 || rawFab || chainFocusStepId
  );

  const stagesFilterSubParam = sp.get(STAGES_FILTER_SUB_PARAM) || '';

  /** Вкладка, на которой показывать пульс-иконку фильтра (последнее действие пользователя). */
  const filterBadgeSub: StagesSubTab | null = useMemo(() => {
    if (!contextFilterActive) return null;
    if (
      stagesFilterSubParam === 'process' ||
      stagesFilterSubParam === 'sku' ||
      stagesFilterSubParam === 'ops'
    ) {
      return stagesFilterSubParam;
    }
    if (chainFocusStepId) return 'process';
    return subTab;
  }, [contextFilterActive, stagesFilterSubParam, chainFocusStepId, subTab]);

  const [pickerQ, setPickerQ] = useState('');
  /** Фильтр строк матрицы по названию / фазе / id / зоне (локально, без API). */
  const [matrixStageFilterQ, setMatrixStageFilterQ] = useState('');
  /** Развёрнута подробная строка в перечне артикулов (категория · сезон · этап). */
  const [expandedPickDetailIds, setExpandedPickDetailIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setMatrixStageFilterQ(matrixTextQParam);
  }, [matrixTextQParam]);

  const matrixSearchDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
    };
  }, []);

  const flushMatrixSearchToUrl = useCallback(
    (raw: string) => {
      replaceQuery((params) => {
        const t = raw.trim();
        if (t) params.set(STAGES_MATRIX_Q_PARAM, t);
        else params.delete(STAGES_MATRIX_Q_PARAM);
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const onMatrixSearchChange = useCallback(
    (v: string) => {
      setMatrixStageFilterQ(v);
      if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
      matrixSearchDebounceRef.current = window.setTimeout(() => flushMatrixSearchToUrl(v), 420);
    },
    [flushMatrixSearchToUrl]
  );

  const togglePickDetailRow = useCallback((id: string) => {
    setExpandedPickDetailIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const poolArticles = useMemo(() => {
    return collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle));
  }, [collectionArticles, facetBundle]);

  const matrixPhaseOptions = useMemo(() => {
    const u = new Set<string>();
    for (const s of steps) {
      const p = s.phase?.trim();
      if (p) u.add(p);
    }
    return [...u];
  }, [steps]);

  const matrixStepsFiltered = useMemo(() => {
    let list = steps;
    if (matrixPhaseParam) {
      list = list.filter((s) => s.phase === matrixPhaseParam);
    }
    const q = matrixStageFilterQ.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.phase?.toLowerCase().includes(q) ?? false) ||
        s.id.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q)
    );
  }, [steps, matrixStageFilterQ, matrixPhaseParam]);

  const focusArticle = useMemo(() => {
    if (poolArticles.length === 0) return null;
    const tryIds = [stagesSkuParam, ...legacyPickIds, stagesWorkSkuParam].filter(Boolean);
    for (const id of tryIds) {
      const a = poolArticles.find((x) => x.id === id);
      if (a) return a;
    }
    return poolArticles[0];
  }, [poolArticles, stagesSkuParam, legacyPickIds, stagesWorkSkuParam]);

  const resolvedFocusId = focusArticle?.id ?? '';

  useEffect(() => {
    if (poolArticles.length === 0) return;
    const legacy = legacyPickRaw.trim().length > 0 || stagesWorkSkuParam.length > 0;
    const mismatch = stagesSkuParam !== resolvedFocusId;
    if (!legacy && !mismatch) return;
    replaceQuery((params) => {
      if (resolvedFocusId) params.set(STAGES_SKU_PARAM, resolvedFocusId);
      params.delete('stagesPick');
      params.delete(STAGES_WORK_SKU_PARAM);
      finishStagesFilterMutation(params, undefined);
    });
  }, [
    poolArticles.length,
    resolvedFocusId,
    stagesSkuParam,
    legacyPickRaw,
    stagesWorkSkuParam,
    replaceQuery,
  ]);

  const clearMatrixFilters = useCallback(() => {
    if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
    setMatrixStageFilterQ('');
    replaceQuery((params) => {
      params.delete(STAGES_MATRIX_PHASE_PARAM);
      params.delete(STAGES_MATRIX_Q_PARAM);
      finishStagesFilterMutation(params, subTabFromStagesParams(params));
    });
  }, [replaceQuery]);

  const audienceHandbook = useMemo(() => getHandbookAudiences(), []);

  const articlesForAudienceAxis = useMemo(
    () => collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle, 'audience')),
    [collectionArticles, facetBundle]
  );
  const articlesForSeasonAxis = useMemo(
    () => collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle, 'season')),
    [collectionArticles, facetBundle]
  );
  const articlesForL1Axis = useMemo(
    () => collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle, 'l1')),
    [collectionArticles, facetBundle]
  );
  const articlesForL2Axis = useMemo(
    () => collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle, 'l2')),
    [collectionArticles, facetBundle]
  );
  const articlesForL3Axis = useMemo(
    () => collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle, 'l3')),
    [collectionArticles, facetBundle]
  );
  const articlesForFabAxis = useMemo(
    () => collectionArticles.filter((a) => articleMatchesFacetBundle(a, facetBundle, 'fab')),
    [collectionArticles, facetBundle]
  );

  const audienceFacetChoices = useMemo(() => {
    const ids = new Set<string>();
    for (const a of articlesForAudienceAxis) {
      if (a.audienceId) ids.add(a.audienceId);
    }
    return audienceHandbook
      .filter((x) => ids.has(x.id))
      .sort((x, y) => x.name.localeCompare(y.name, 'ru'));
  }, [articlesForAudienceAxis, audienceHandbook]);

  const seasonFacetChoices = useMemo(() => {
    const set = new Set<string>();
    for (const a of articlesForSeasonAxis) {
      if (a.season) set.add(a.season);
    }
    return [...set].sort((x, y) => x.localeCompare(y, 'ru'));
  }, [articlesForSeasonAxis]);

  const l1FacetChoices = useMemo(() => {
    const set = new Set<string>();
    for (const a of articlesForL1Axis) {
      if (a.categoryL1) set.add(a.categoryL1);
    }
    return [...set].sort((x, y) => x.localeCompare(y, 'ru'));
  }, [articlesForL1Axis]);

  const l2FacetChoices = useMemo(() => {
    const set = new Set<string>();
    for (const a of articlesForL2Axis) {
      if (a.categoryL2 && a.categoryL2 !== '—') set.add(a.categoryL2);
    }
    return [...set].sort((x, y) => x.localeCompare(y, 'ru'));
  }, [articlesForL2Axis]);

  const l3FacetChoices = useMemo(() => {
    const set = new Set<string>();
    for (const a of articlesForL3Axis) {
      if (a.categoryL3 && a.categoryL3 !== '—') set.add(a.categoryL3);
    }
    return [...set].sort((x, y) => x.localeCompare(y, 'ru'));
  }, [articlesForL3Axis]);

  const fabFacetChoices = useMemo(() => {
    const ids = new Set<string>();
    for (const a of articlesForFabAxis) {
      if (a.productionSiteId) ids.add(a.productionSiteId);
    }
    return STAGES_PRODUCTION_SITES.filter((s) => ids.has(s.id));
  }, [articlesForFabAxis]);

  const depsSchemaChunks = useMemo(
    () => chunkStepsForDepsSchema(steps, DEPS_SCHEMA_CHUNK),
    [steps]
  );

  const boardStepRows = useMemo(
    () => chunkStepsForDepsSchema(steps, BOARD_STAGES_PER_ROW),
    [steps]
  );

  /**
   * Один артикул в фокусе; при фильтре узла схемы — пусто, если текущий этап SKU не совпадает с узлом (сузьте узел или смените артикул).
   */
  const viewArticles = useMemo(() => {
    if (!focusArticle) return [];
    if (chainFocusStepId && focusArticle.currentStageId !== chainFocusStepId) return [];
    return [focusArticle];
  }, [focusArticle, chainFocusStepId]);

  /** Список для выбора артикула: весь пул после среза и поиска (без привязки к узлу схемы). */
  const articlesForPickerList = useMemo(() => {
    let list = poolArticles;
    const q = pickerQ.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.sku.toLowerCase().includes(q) ||
          (a.season?.toLowerCase().includes(q) ?? false) ||
          (a.categoryPathLabel?.toLowerCase().includes(q) ?? false) ||
          (a.fabricSuppliersLabel?.toLowerCase().includes(q) ?? false) ||
          (a.fabricStockNote?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [poolArticles, pickerQ]);

  /** Выпадающий список «По артикулам»: пул после поиска; текущий фокус всегда в списке, даже если строка отфильтрована. */
  const skuSelectArticles = useMemo(() => {
    if (!focusArticle || articlesForPickerList.some((a) => a.id === focusArticle.id)) {
      return articlesForPickerList;
    }
    return [focusArticle, ...articlesForPickerList];
  }, [articlesForPickerList, focusArticle]);

  /**
   * SKU для агрегатов матрицы и массовых кнопок — тот же артикул в фокусе (и узел схемы при необходимости).
   */
  const effectiveSkuIds = useMemo(() => viewArticles.map((a) => a.id), [viewArticles]);

  const aggregateStatus = useMemo(
    () => buildAggregateStatusMap(flowDoc, effectiveSkuIds, steps),
    [flowDoc, effectiveSkuIds, steps]
  );

  const depSatisfied = useCallback(
    (depId: string): boolean => {
      const depStep = steps.find((x) => x.id === depId);
      return aggregateDepSatisfied(flowDoc, effectiveSkuIds, depId, depStep);
    },
    [flowDoc, effectiveSkuIds, steps]
  );

  const isBlocked = useCallback(
    (step: CollectionStep) =>
      getEffectiveDependsOn(step, productionProfileId).some((depId) => !depSatisfied(depId)),
    [depSatisfied, productionProfileId]
  );

  const markStatus = (id: string, next: MatrixStepStatus) => {
    if (effectiveSkuIds.length === 0) return;
    setUnifiedDoc((d) => setStageStatusForAllSkus(d, effectiveSkuIds, id, next));
  };

  const patchSkuStageLocal = useCallback(
    (skuId: string, stepId: string, patch: Partial<SkuStageDetail>) => {
      setUnifiedDoc((d) => patchSkuStage(d, skuId, stepId, patch));
    },
    [setUnifiedDoc]
  );

  const appendSkuAuditLineLocal = useCallback(
    (skuId: string, stepId: string, line: { summary: string; by?: string }) => {
      setUnifiedDoc((d) => appendSkuStageAuditLine(d, skuId, stepId, line));
    },
    [setUnifiedDoc]
  );

  useEffect(() => {
    if (!stagesMatrixSkuParam) return;
    const inPool = poolArticles.some((a) => a.id === stagesMatrixSkuParam);
    if (!inPool) {
      replaceQuery((params) => {
        params.delete('stagesMatrixSku');
        finishStagesFilterMutation(params, undefined);
      });
      return;
    }
    replaceQuery((params) => {
      params.set(STAGES_SKU_PARAM, stagesMatrixSkuParam);
      params.delete('stagesMatrixSku');
      params.delete('stagesPick');
      params.delete(STAGES_WORK_SKU_PARAM);
      if (normalizeStagesSub(params.get('stagesSub')) !== 'sku') {
        params.set('stagesSub', 'sku');
      }
      finishStagesFilterMutation(params, 'sku');
    });
  }, [stagesMatrixSkuParam, poolArticles, replaceQuery]);

  const [depsOpen, setDepsOpen] = useState(true);
  const [depsPinned, setDepsPinned] = useState(true);
  const depsExpanded = depsPinned || depsOpen;

  const [sliceOpen, setSliceOpen] = useState(true);
  const [slicePinned, setSlicePinned] = useState(true);
  const sliceExpanded = slicePinned || sliceOpen;

  const [boardOpen, setBoardOpen] = useState(true);
  const [boardPinned, setBoardPinned] = useState(true);
  const boardExpanded = boardPinned || boardOpen;

  const [matrixOpen, setMatrixOpen] = useState(true);
  const [matrixPinned, setMatrixPinned] = useState(true);
  const matrixExpanded = matrixPinned || matrixOpen;

  /**
   * Матрица во вкладке «Процесс»; без переключения вкладки и раскрытия блока прокрутка к строке не работает.
   */
  const jumpToMatrixRow = useCallback(
    (stepId: string) => {
      if (typeof window === 'undefined' || !stepId.trim()) return;
      pendingMatrixScrollRef.current = stepId.trim();
      if (matrixSearchDebounceRef.current) window.clearTimeout(matrixSearchDebounceRef.current);
      setMatrixStageFilterQ('');
      setMatrixOpen(true);
      saveStagesLastInnerSubTab(collectionFlowKey, 'process');
      replaceQuery((params) => {
        params.delete(STAGES_MATRIX_PHASE_PARAM);
        params.delete(STAGES_MATRIX_Q_PARAM);
        params.set('stagesSub', 'process');
        finishStagesFilterMutation(params, 'process');
      });
    },
    [collectionFlowKey, replaceQuery]
  );

  useEffect(() => {
    const id = pendingMatrixScrollRef.current;
    if (!id || subTab !== 'process' || !matrixExpanded) return;
    const t = window.setTimeout(() => {
      document
        .getElementById(`stages-matrix-row-${id}`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pendingMatrixScrollRef.current = null;
    }, 120);
    return () => window.clearTimeout(t);
  }, [subTab, matrixExpanded, flowDoc, matrixStepsFiltered.length]);

  const scrollToCurrentMatrixStage = useCallback(() => {
    const sid = focusArticle?.currentStageId;
    if (!sid) return;
    jumpToMatrixRow(sid);
  }, [focusArticle?.currentStageId, jumpToMatrixRow]);

  const [skuPanelOpen, setSkuPanelOpen] = useState(true);
  const [skuPanelPinned, setSkuPanelPinned] = useState(true);
  const skuPanelExpanded = skuPanelPinned || skuPanelOpen;

  /** Панель выбора профиля: по умолчанию свёрнута (меньше шума на демо). */
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  /** Импорт/экспорт и добавление SKU — по кнопке, без тяжёлого блока по умолчанию. */
  const [localInventoryOpen, setLocalInventoryOpen] = useState(false);

  const [panelsHydrated, setPanelsHydrated] = useState(false);

  useEffect(() => {
    const s = loadStagesPanelsSession(collectionFlowKey);
    if (s) {
      if (typeof s.depsPinned === 'boolean') setDepsPinned(s.depsPinned);
      if (typeof s.depsOpen === 'boolean') setDepsOpen(s.depsOpen);
      if (typeof s.slicePinned === 'boolean') setSlicePinned(s.slicePinned);
      if (typeof s.sliceOpen === 'boolean') setSliceOpen(s.sliceOpen);
      if (typeof s.boardPinned === 'boolean') setBoardPinned(s.boardPinned);
      if (typeof s.boardOpen === 'boolean') setBoardOpen(s.boardOpen);
      if (typeof s.matrixPinned === 'boolean') setMatrixPinned(s.matrixPinned);
      if (typeof s.matrixOpen === 'boolean') setMatrixOpen(s.matrixOpen);
      if (typeof s.skuPanelPinned === 'boolean') setSkuPanelPinned(s.skuPanelPinned);
      if (typeof s.skuPanelOpen === 'boolean') setSkuPanelOpen(s.skuPanelOpen);
      if (typeof s.profilePanelOpen === 'boolean') setProfilePanelOpen(s.profilePanelOpen);
    }
    setPanelsHydrated(true);
  }, [collectionFlowKey]);

  useEffect(() => {
    if (!panelsHydrated) return;
    saveStagesPanelsSession(collectionFlowKey, {
      depsPinned,
      depsOpen,
      slicePinned,
      sliceOpen,
      boardPinned,
      boardOpen,
      matrixPinned,
      matrixOpen,
      skuPanelPinned,
      skuPanelOpen,
      profilePanelOpen,
    });
  }, [
    panelsHydrated,
    collectionFlowKey,
    depsPinned,
    depsOpen,
    slicePinned,
    sliceOpen,
    boardPinned,
    boardOpen,
    matrixPinned,
    matrixOpen,
    skuPanelPinned,
    skuPanelOpen,
    profilePanelOpen,
  ]);

  const [depsNodeInfoStepId, setDepsNodeInfoStepId] = useState<string | null>(null);

  const buildTransitionUrl = useCallback(
    (targetHref: string, chosenArticleId: string, stepId: string) => {
      const article = poolArticles.find((a) => a.id === chosenArticleId);
      const merged = mergeCollectionQuery(targetHref, collectionQuery);
      if (typeof window === 'undefined') return merged;
      const u = new URL(merged, window.location.origin);
      if (chosenArticleId) u.searchParams.set(STAGES_SKU_PARAM, chosenArticleId);
      u.searchParams.delete('stagesPick');
      u.searchParams.delete(STAGES_WORK_SKU_PARAM);
      if (stepId) u.searchParams.set('stagesStep', stepId);
      if (article) {
        u.searchParams.set('sku', article.sku);
        u.searchParams.set('productId', article.id);
      }

      const pathNorm = (u.pathname.replace(/\/$/, '') || '/') as string;
      const collectionsNewBase = ROUTES.brand.collectionsNew.replace(/\/$/, '');
      if (pathNorm === collectionsNewBase || pathNorm.endsWith('/collections/new')) {
        const cid = u.searchParams.get('collectionId')?.trim();
        if (cid && cid.toLowerCase() !== 'new') {
          u.pathname = ROUTES.brand.production;
          u.searchParams.set('floorTab', 'workshop');
        }
      }

      return `${u.pathname}${u.search}`;
    },
    [poolArticles, mergeCollectionQuery, collectionQuery]
  );

  /** Те же query-параметры, что у «К данным этапа» / матрицы: collectionId, stagesSku, stagesStep, sku, productId. */
  const mergeModuleHref = useCallback(
    (href: string, stepId: string, articleId?: string) => {
      const id = articleId ?? focusArticle?.id;
      if (!id) return mergeCollectionQuery(href, collectionQuery);
      return buildTransitionUrl(href, id, stepId);
    },
    [focusArticle, mergeCollectionQuery, collectionQuery, buildTransitionUrl]
  );

  /** «В модуль»: для этапов коллекции — без stagesSku; для остальных — с артикулом в фокусе. */
  const navigateToStageModule = useCallback(
    (step: CollectionStep, targetHref: string) => {
      if (step.collectionScopedModuleNav) {
        router.push(mergeCollectionQuery(targetHref, collectionQuery));
        return;
      }
      if (!focusArticle) return;
      router.push(buildTransitionUrl(targetHref, focusArticle.id, step.id));
    },
    [focusArticle, router, buildTransitionUrl, mergeCollectionQuery, collectionQuery]
  );

  const openSkuPanelForStep = useCallback(
    (skuId: string, stepId: string, panelTab?: StagesSkuPanelTab) => {
      replaceQuery((params) => {
        if (skuId) params.set(STAGES_SKU_PARAM, skuId);
        params.set('stagesSub', 'sku');
        params.set(STAGES_SKU_PANEL_STEP_PARAM, stepId);
        if (panelTab && panelTab !== 'process') params.set(STAGES_SKU_PANEL_TAB_PARAM, panelTab);
        else params.delete(STAGES_SKU_PANEL_TAB_PARAM);
        params.set('floorTab', 'stages');
        params.delete('stagesPick');
        params.delete(STAGES_WORK_SKU_PARAM);
        finishStagesFilterMutation(params, 'sku');
      });
    },
    [replaceQuery]
  );

  const setMatrixPhaseFilter = useCallback(
    (phase: string | null) => {
      replaceQuery((params) => {
        if (phase?.trim()) params.set(STAGES_MATRIX_PHASE_PARAM, phase.trim());
        else params.delete(STAGES_MATRIX_PHASE_PARAM);
        finishStagesFilterMutation(params, subTabFromStagesParams(params));
      });
    },
    [replaceQuery]
  );

  const consumePendingSkuPanel = useCallback(() => {
    replaceQuery((params) => {
      params.delete(STAGES_SKU_PANEL_STEP_PARAM);
      params.delete(STAGES_SKU_PANEL_TAB_PARAM);
    });
  }, [replaceQuery]);

  const depsInfoStep = useMemo(
    () => (depsNodeInfoStepId ? (steps.find((s) => s.id === depsNodeInfoStepId) ?? null) : null),
    [depsNodeInfoStepId, steps]
  );
  const depsInfoArticles = useMemo(
    () =>
      depsNodeInfoStepId && focusArticle && focusArticle.currentStageId === depsNodeInfoStepId
        ? [focusArticle]
        : [],
    [focusArticle, depsNodeInfoStepId]
  );

  const columnStats = useMemo(() => {
    return steps.map((step) => {
      const here = viewArticles.filter((a) => a.currentStageId === step.id);
      let done = 0;
      let prog = 0;
      let block = 0;
      for (const a of here) {
        const st = flowDoc.skus[a.id]?.stages[step.id]?.status ?? 'not_started';
        if (st === 'done' || st === 'skipped') done += 1;
        else if (st === 'blocked') block += 1;
        else if (st === 'in_progress') prog += 1;
      }
      return {
        step,
        here,
        done,
        prog,
        block,
        line: aggregateSkuProgressLine(flowDoc, effectiveSkuIds, step.id),
      };
    });
  }, [steps, viewArticles, flowDoc, effectiveSkuIds]);

  const focusSkuContourGuidance = useMemo(() => {
    if (!focusArticle) return null;
    const label = stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season);
    const narrative = hintTextForArticleNextCatalogStep(
      flowDoc,
      steps,
      focusArticle,
      label,
      productionProfileId
    );
    const detail = getSkuContourNavigationDetail(flowDoc, steps, focusArticle, productionProfileId);
    return { ...detail, narrative, label };
  }, [flowDoc, steps, focusArticle, productionProfileId]);

  const focusSkuMatrixPhase = useMemo(() => {
    if (!focusArticle) return '';
    const st = steps.find((s) => s.id === focusArticle.currentStageId);
    return st?.phase?.trim() ?? '';
  }, [focusArticle, steps]);

  const mergedLocalInventoryTools: StagesLocalInventoryTools | null = localInventoryTools
    ? {
        ...localInventoryTools,
        poolArticleCount: poolArticles.length,
        contextFilterActive,
        onResetFacets: clearAllFacets,
      }
    : null;

  const sliceEmptyButCollectionHasArticles =
    Boolean(mergedLocalInventoryTools) &&
    mergedLocalInventoryTools!.totalArticlesInCollection > 0 &&
    mergedLocalInventoryTools!.poolArticleCount === 0 &&
    mergedLocalInventoryTools!.contextFilterActive;

  const localModeHelpText =
    'Срез, статусы этапов и черновики коллекции хранятся в браузере (localStorage / sessionStorage). Синхронизации с сервером пока нет: не очищайте данные сайта без нужды и периодически делайте экспорт JSON («Коллекция и данные») перед сменой устройства или браузера. Дальше тот же контракт подключится через ProductionDataPort / API.';

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={400}>
      <div className="space-y-4">
        {sliceEmptyButCollectionHasArticles ? (
<<<<<<< HEAD
          <div className="flex flex-col gap-2 rounded-lg border border-violet-200 bg-violet-50/50 px-3 py-2.5 text-[10px] text-violet-950 sm:flex-row sm:items-center">
=======
          <div className="border-accent-primary/25 bg-accent-primary/10 text-text-primary flex flex-col gap-2 rounded-lg border px-3 py-2.5 text-[10px] sm:flex-row sm:items-center">
>>>>>>> recover/cabinet-wip-from-stash
            <p className="flex-1 leading-snug">
              В коллекции есть{' '}
              <strong>{mergedLocalInventoryTools!.totalArticlesInCollection}</strong> SKU, но{' '}
              <strong>срез и узел схемы</strong> их отфильтровали — доска и матрица пусты.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 shrink-0 text-[10px]"
              onClick={clearAllFacets}
            >
              Сбросить фильтры среза
            </Button>
          </div>
        ) : null}
<<<<<<< HEAD
        <div className="rounded-lg border border-indigo-200/80 bg-indigo-50/35 px-3 py-2">
=======
        <div className="border-accent-primary/30 bg-accent-primary/10 rounded-lg border px-3 py-2">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              {!profilePanelOpen ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
<<<<<<< HEAD
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-indigo-900/85">
                      Профиль контура
                    </span>
                    <span className="text-[10px] font-semibold leading-snug text-slate-800">
=======
                    <span className="text-accent-primary/85 shrink-0 text-[9px] font-black uppercase tracking-wider">
                      Профиль контура
                    </span>
                    <span className="text-text-primary text-[10px] font-semibold leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                      {productionProfileLabel}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 shrink-0 text-[10px] sm:self-center"
                    onClick={() => setProfilePanelOpen(true)}
                  >
                    Изменить профиль
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
<<<<<<< HEAD
                      <p className="text-[9px] font-black uppercase tracking-wider text-indigo-900/85">
=======
                      <p className="text-accent-primary/85 text-[9px] font-black uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                        Профиль контура производства
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
<<<<<<< HEAD
                        className="h-7 shrink-0 text-[10px] text-slate-600"
=======
                        className="text-text-secondary h-7 shrink-0 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                        onClick={() => setProfilePanelOpen(false)}
                      >
                        Свернуть
                      </Button>
                    </div>
<<<<<<< HEAD
                    <p className="text-[9px] leading-snug text-slate-600">
                      {productionProfileHint}
                    </p>
                    <p className="text-[8px] text-slate-500">
                      Хранится в документе коллекции (
                      <code className="rounded bg-white/80 px-0.5">productionProfileId</code>) через{' '}
                      <strong className="text-slate-700">ProductionDataPort</strong> (сейчас
                      localStorage; с API — тот же контракт). Меняет{' '}
                      <strong className="text-slate-700">блокировки</strong> и подсветку этапов «вне
                      профиля», не названия модулей.
=======
                    <p className="text-text-secondary text-[9px] leading-snug">
                      {productionProfileHint}
                    </p>
                    <p className="text-text-secondary text-[8px]">
                      Хранится в документе коллекции (
                      <code className="rounded bg-white/80 px-0.5">productionProfileId</code>) через{' '}
                      <strong className="text-text-primary">ProductionDataPort</strong> (сейчас
                      localStorage; с API — тот же контракт). Меняет{' '}
                      <strong className="text-text-primary">блокировки</strong> и подсветку этапов
                      «вне профиля», не названия модулей.
>>>>>>> recover/cabinet-wip-from-stash
                    </p>
                  </div>
                  <Select
                    value={productionProfileId}
                    onValueChange={(v) => {
                      setUnifiedDoc((d) => patchProductionProfile(d, v));
                    }}
                  >
                    <SelectTrigger
                      className="h-8 w-full shrink-0 bg-white text-[10px] sm:w-[min(100%,22rem)]"
                      aria-label="Профиль контура производства"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTION_FLOW_PROFILES.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-[11px]">
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
<<<<<<< HEAD
            <div className="flex shrink-0 flex-row items-center justify-end gap-2 border-t border-indigo-200/40 pt-2 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
=======
            <div className="border-accent-primary/30 flex shrink-0 flex-row items-center justify-end gap-2 border-t pt-2 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
>>>>>>> recover/cabinet-wip-from-stash
              <StagesHelpHover
                title="Локальный режим без API"
                trigger={
                  <button
                    type="button"
<<<<<<< HEAD
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-indigo-200/90 bg-white text-indigo-700 shadow-sm hover:bg-indigo-50/90"
=======
                    className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                    aria-label="Справка: локальные данные в браузере"
                  >
                    <Info className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                }
              >
<<<<<<< HEAD
                <p className="max-w-sm text-[11px] leading-relaxed text-slate-700">
=======
                <p className="text-text-primary max-w-sm text-[11px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                  {localModeHelpText}
                </p>
              </StagesHelpHover>
              {mergedLocalInventoryTools ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
<<<<<<< HEAD
                  className="h-8 border-indigo-200/90 bg-white text-[10px]"
=======
                  className="border-accent-primary/30 h-8 bg-white text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={() => setLocalInventoryOpen((o) => !o)}
                >
                  {localInventoryOpen ? 'Скрыть коллекцию' : 'Коллекция и данные'}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
        {localInventoryOpen && mergedLocalInventoryTools ? (
          <StagesLocalInventoryToolbar tools={mergedLocalInventoryTools} layout="plain" />
        ) : null}
        {focusArticle ? (
          <div
            className="space-y-2 rounded-xl border border-emerald-200/85 bg-gradient-to-r from-emerald-50/90 to-white px-3 py-2.5 text-[10px] text-emerald-950 shadow-sm"
            role="status"
          >
            <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
              <span className="font-black uppercase tracking-wider text-emerald-800/90">
                Контур SKU
              </span>
<<<<<<< HEAD
              <span className="text-slate-400"> · </span>
              <span className="font-semibold text-slate-800">
=======
              <span className="text-text-muted"> · </span>
              <span className="text-text-primary font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
                {stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season)}
              </span>
              {(() => {
                const st = steps.find((s) => s.id === focusArticle.currentStageId);
                const idx = steps.findIndex((s) => s.id === focusArticle.currentStageId);
                if (!st) return null;
                return (
                  <>
<<<<<<< HEAD
                    <span className="text-slate-400"> — </span>
                    {st.phase ? <span className="text-slate-600">{st.phase} · </span> : null}
=======
                    <span className="text-text-muted"> — </span>
                    {st.phase ? <span className="text-text-secondary">{st.phase} · </span> : null}
>>>>>>> recover/cabinet-wip-from-stash
                    <strong className="text-emerald-950">{st.title}</strong>
                    {idx >= 0 ? (
                      <span className="ml-1 font-mono text-[9px] font-bold text-emerald-700/80">
                        {idx + 1}/{steps.length}
                      </span>
                    ) : null}
                  </>
                );
              })()}
            </div>
            {focusSkuContourGuidance ? (
              <div className="space-y-2 border-t border-emerald-200/50 pt-2">
<<<<<<< HEAD
                <p className="text-[9px] leading-relaxed text-slate-700">
=======
                <p className="text-text-primary text-[9px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                  {focusSkuContourGuidance.narrative}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {focusSkuContourGuidance.next && !focusSkuContourGuidance.atEnd ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 gap-1 px-2 text-[9px]"
                      onClick={() => jumpToMatrixRow(focusSkuContourGuidance.next!.id)}
                      title="Откроется вкладка «Процесс и правила» и прокрутка к строке этапа в матрице"
                    >
                      <Crosshair className="h-3 w-3 shrink-0" aria-hidden />К следующему в матрице
                    </Button>
                  ) : null}
                  {focusSkuContourGuidance.blockedDeps.length > 0
                    ? focusSkuContourGuidance.blockedDeps.map((d) => (
                        <Button
                          key={d.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 max-w-[12rem] truncate px-2 text-[9px]"
                          onClick={() => jumpToMatrixRow(d.id)}
                          title="Откроется вкладка «Процесс и правила» и прокрутка к этапу в матрице"
                        >
                          К «{d.title}»
                        </Button>
                      ))
                    : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <Tabs
          value={subTab}
          onValueChange={(v) => setSubTab(normalizeStagesSub(v))}
          className="w-full"
        >
<<<<<<< HEAD
          <Card className="border-slate-200 bg-slate-50/60">
            <CardHeader className="space-y-0 pb-3">
              <div className="flex flex-row flex-wrap items-start gap-2">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <CardTitle className="text-xs uppercase tracking-tight text-slate-800">
                    Контроль коллекции: этапы и зависимости
                  </CardTitle>
                  <p className="text-xs leading-relaxed text-slate-600">
=======
          <Card className="border-border-default bg-bg-surface2/60">
            <CardHeader className="space-y-0 pb-3">
              <div className="flex flex-row flex-wrap items-start gap-2">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <CardTitle className="text-text-primary text-xs uppercase tracking-tight">
                    Контроль коллекции: этапы и зависимости
                  </CardTitle>
                  <p className="text-text-secondary text-xs leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    Срез и перечень SKU, доска по текущим этапам, схема зависимостей и
                    агрегированная матрица статусов — один контекст коллекции без прыжков по
                    модулям.
                  </p>
                </div>
                <StagesHelpHover
                  wide
                  title="Контроль коллекции: этапы и зависимости"
                  trigger={
                    <StagesHelpIconTrigger
                      aria-label="Справка: контроль коллекции, срез, URL и схема"
                      className="shrink-0"
                    />
                  }
                >
                  <StagesHelpWhyBlock title="Зачем">
                    <p>
                      Один экран связывает срез артикулов, перечень для расчётов, схему этапов и
                      матрицу статусов — чтобы не прыгать между модулями без контекста.
                    </p>
                  </StagesHelpWhyBlock>
                  <StagesHelpWhyBlock title="Контур коллекции в каталоге">
<<<<<<< HEAD
                    <p className="mb-2 text-[10px] leading-snug text-slate-600">
                      Полный путь «от идеи к полке» — тот же порядок, что в{' '}
                      <strong className="text-slate-800">матрице этапов</strong> и в графе{' '}
                      <code className="rounded bg-slate-100 px-1">dependsOn</code> (блокировки
                      следующего шага считаются по зависимостям, а не по номеру в списке ниже).
                    </p>
                    <ol className="max-h-52 list-decimal space-y-0.5 overflow-y-auto rounded-md border border-slate-100 bg-slate-50/50 p-2 pl-4 text-[10px] text-slate-600">
=======
                    <p className="text-text-secondary mb-2 text-[10px] leading-snug">
                      Полный путь «от идеи к полке» — тот же порядок, что в{' '}
                      <strong className="text-text-primary">матрице этапов</strong> и в графе{' '}
                      <code className="bg-bg-surface2 rounded px-1">dependsOn</code> (блокировки
                      следующего шага считаются по зависимостям, а не по номеру в списке ниже).
                    </p>
                    <ol className="text-text-secondary border-border-subtle bg-bg-surface2/80 max-h-52 list-decimal space-y-0.5 overflow-y-auto rounded-md border p-2 pl-4 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                      {getCollectionBrandNarrativeTitles().map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ol>
                  </StagesHelpWhyBlock>
                  <StagesHelpWhyBlock title="Гайд бренда (дорожная карта)">
<<<<<<< HEAD
                    <p className="mb-2 text-[10px] leading-snug text-slate-600">
                      Тот же набор этапов в логике{' '}
                      <strong className="text-slate-800">
=======
                    <p className="text-text-secondary mb-2 text-[10px] leading-snug">
                      Тот же набор этапов в логике{' '}
                      <strong className="text-text-primary">
>>>>>>> recover/cabinet-wip-from-stash
                        презентаций и планирования с командой
                      </strong>{' '}
                      (семплы и закупка до формального согласования образа и ТЗ; комплектация B2B в
                      повестке рядом со складом). Для{' '}
<<<<<<< HEAD
                      <strong className="text-slate-800">статусов и «что блокирует что»</strong>{' '}
                      ориентируйтесь на список выше и матрицу — там порядок строк = исполнение и{' '}
                      <code className="rounded bg-slate-100 px-1">dependsOn</code> (например семплы
                      после Tech Pack и поставки в цех; на серии — nesting → выпуск → ОТК → склад →
                      комплектация → отгрузка).
                    </p>
                    <ol className="max-h-52 list-decimal space-y-0.5 overflow-y-auto rounded-md border border-indigo-100 bg-indigo-50/40 p-2 pl-4 text-[10px] text-slate-600">
=======
                      <strong className="text-text-primary">статусов и «что блокирует что»</strong>{' '}
                      ориентируйтесь на список выше и матрицу — там порядок строк = исполнение и{' '}
                      <code className="bg-bg-surface2 rounded px-1">dependsOn</code> (например
                      семплы после Tech Pack и поставки в цех; на серии — nesting → выпуск → ОТК →
                      склад → комплектация → отгрузка).
                    </p>
                    <ol className="text-text-secondary border-accent-primary/20 bg-accent-primary/10 max-h-52 list-decimal space-y-0.5 overflow-y-auto rounded-md border p-2 pl-4 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                      {getCollectionBrandGuideTitles().map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ol>
                  </StagesHelpWhyBlock>
                  <p>
<<<<<<< HEAD
                    <strong className="text-slate-800">Категории</strong> — из{' '}
                    <strong className="text-slate-800">CATEGORY_HANDBOOK</strong>: сначала
                    аудитория, затем три уровня L1–L3 под корнями аудитории.
                  </p>
                  <p>
                    <strong className="text-slate-800">Схема зависимостей</strong> (5 узлов в
=======
                    <strong className="text-text-primary">Категории</strong> — из{' '}
                    <strong className="text-text-primary">CATEGORY_HANDBOOK</strong>: сначала
                    аудитория, затем три уровня L1–L3 под корнями аудитории.
                  </p>
                  <p>
                    <strong className="text-text-primary">Схема зависимостей</strong> (5 узлов в
>>>>>>> recover/cabinet-wip-from-stash
                    строке, змейка, без горизонтального скролла): числа — по пулу среза; клик по
                    узлу сужает доску и матрицу до SKU с этапом на этом узле (повторный клик —
                    сброс).
                  </p>
                  <div>
<<<<<<< HEAD
                    <p className="mb-1.5 font-semibold text-slate-800">Параметры в URL</p>
                    <ul className="list-disc space-y-1 pl-4 text-[10px] text-slate-600">
                      <li>
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
                          stagesAudience
                        </code>
                        ,{' '}
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
                          stagesSeason
                        </code>
                        ,{' '}
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
                          stagesL1
                        </code>
                        –<code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">L3</code>
                        ,{' '}
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                    <p className="text-text-primary mb-1.5 font-semibold">Параметры в URL</p>
                    <ul className="text-text-secondary list-disc space-y-1 pl-4 text-[10px]">
                      <li>
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                          stagesAudience
                        </code>
                        ,{' '}
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                          stagesSeason
                        </code>
                        ,{' '}
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                          stagesL1
                        </code>
                        –
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
                          L3
                        </code>
                        ,{' '}
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesFab
                        </code>{' '}
                        — срез (несколько значений через запятую, OR внутри оси; между осями — AND).
                        Значения в URL кодируются через{' '}
                        <code className="text-[10px]">encodeURIComponent</code>.
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesSku
                        </code>{' '}
                        — один артикул в рабочем контексте (id в коллекции)
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesChainFocus
                        </code>{' '}
                        — фильтр узла схемы
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesMatrixSku
                        </code>{' '}
                        — устаревший deep link: при открытии переносит на вкладку «По артикулам» с
                        выбранным SKU и удаляется из URL
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesSub
                        </code>{' '}
                        — внутренняя вкладка (оперативка / процесс / по артикулам)
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesFilterSub
                        </code>{' '}
                        — вкладка, где последний раз меняли срез (пульсирующая иконка фильтра)
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesMatrixPhase
                        </code>{' '}
                        — фильтр матрицы по фазе каталога (точное имя группы этапа); сбрасывается
                        вместе с «Сбросить срез»
                      </li>
                      <li>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">
=======
                        <code className="bg-bg-surface2 text-text-primary rounded px-1 py-0.5">
>>>>>>> recover/cabinet-wip-from-stash
                          stagesMatrixQ
                        </code>{' '}
                        — текстовый фильтр строк матрицы (подстрока в названии, фазе, id или зоне);
                        до ~120 символов
                      </li>
                    </ul>
                  </div>
                </StagesHelpHover>
              </div>
<<<<<<< HEAD
              <TabsList className="mt-4 h-auto w-full flex-wrap justify-start gap-1 border border-slate-200 bg-slate-100/90 p-1">
                <TabsTrigger
                  value="ops"
                  title="Доска этапов и срез коллекции (без перезагрузки страницы — меняется блок ниже)"
                  className="gap-1.5 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-white"
=======
              {/* cabinetSurface v1 */}
              <TabsList className={cn(cabinetSurface.tabsList, 'mt-4 flex-wrap')}>
                <TabsTrigger
                  value="ops"
                  title="Доска этапов и срез коллекции (без перезагрузки страницы — меняется блок ниже)"
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'h-auto gap-1.5 px-2.5 py-2 tracking-wider'
                  )}
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <LayoutGrid
                    className="pointer-events-none h-3.5 w-3.5 shrink-0 opacity-70"
                    aria-hidden
                  />
                  <span className="whitespace-nowrap">Оперативка</span>
                  {contextFilterActive && filterBadgeSub === 'ops' ? (
                    <StagesContextFilterPulseIcon />
                  ) : null}
                </TabsTrigger>
                <TabsTrigger
                  value="process"
                  title="Схема зависимостей и матрица статусов по этапам"
<<<<<<< HEAD
                  className="gap-1.5 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-white"
=======
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'h-auto gap-1.5 px-2.5 py-2 tracking-wider'
                  )}
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <ListTree
                    className="pointer-events-none h-3.5 w-3.5 shrink-0 opacity-70"
                    aria-hidden
                  />
                  <span className="max-w-[10rem] leading-tight sm:whitespace-nowrap">
                    Процесс и правила
                  </span>
                  {contextFilterActive && filterBadgeSub === 'process' ? (
                    <StagesContextFilterPulseIcon />
                  ) : null}
                </TabsTrigger>
                <TabsTrigger
                  value="sku"
                  title="Карточка одного SKU: чеклисты этапов и кнопки «в модуль»"
<<<<<<< HEAD
                  className="gap-1.5 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider data-[state=active]:bg-white"
=======
                  className={cn(
                    cabinetSurface.tabsTrigger,
                    'h-auto gap-1.5 px-2.5 py-2 tracking-wider'
                  )}
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <Package
                    className="pointer-events-none h-3.5 w-3.5 shrink-0 opacity-70"
                    aria-hidden
                  />
                  <span className="whitespace-nowrap">По артикулам</span>
                  {contextFilterActive && filterBadgeSub === 'sku' ? (
                    <StagesContextFilterPulseIcon />
                  ) : null}
                </TabsTrigger>
              </TabsList>
<<<<<<< HEAD
              <p className="mt-2 text-[10px] leading-snug text-slate-500">
                Это три{' '}
                <strong className="font-semibold text-slate-700">секции одного экрана</strong>{' '}
=======
              <p className="text-text-secondary mt-2 text-[10px] leading-snug">
                Это три{' '}
                <strong className="text-text-primary font-semibold">секции одного экрана</strong>{' '}
>>>>>>> recover/cabinet-wip-from-stash
                (адрес в браузере чуть меняется — так удобнее делиться ссылкой). Не обновление
                страницы: переключается только содержимое ниже. Матрица этапов — на вкладке «Процесс
                и правила».
              </p>
            </CardHeader>
          </Card>

<<<<<<< HEAD
          <Card className="border-indigo-100">
=======
          <Card className="border-accent-primary/20">
>>>>>>> recover/cabinet-wip-from-stash
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1">
                  <CardTitle className="text-sm uppercase tracking-tight">Срез и артикул</CardTitle>
                  <CardDescription className="text-xs">
                    Слева оси (OR), между осями AND. Справа — перечень пула; строка задаёт один SKU
                    в фокусе.
                  </CardDescription>
                </div>
                <StagesCollapsePinBar
                  pinned={slicePinned}
                  onPinnedChange={setSlicePinned}
                  open={sliceOpen}
                  onOpenChange={setSliceOpen}
                  collapseAriaLabel="Свернуть или развернуть блок «Срез и перечень»"
                />
<<<<<<< HEAD
                <div className="flex h-8 shrink-0 items-center border-l border-slate-200 pl-2">
=======
                <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
>>>>>>> recover/cabinet-wip-from-stash
                  <StagesHelpHover
                    align="end"
                    wide
                    title="Срез и артикул"
                    trigger={
                      <StagesHelpIconTrigger
                        aria-label="Справка: срез коллекции и выбор артикула"
                        className="shrink-0"
                      />
                    }
                  >
                    <StagesHelpWhyBlock title="Как это работает">
                      <p>
                        Слева — оси среза коллекции; справа — список артикулов пула. Клик по строке
                        задаёт{' '}
<<<<<<< HEAD
                        <strong className="text-slate-800">единственный артикул в фокусе</strong> (
                        <code className="rounded bg-slate-100 px-1">stagesSku</code>): схема, доска,
                        матрица и переходы считаются только в его контексте. Свод по всей коллекции
                        без выбора строки — отдельный сценарий (бэклог).
=======
                        <strong className="text-text-primary">единственный артикул в фокусе</strong>{' '}
                        (<code className="bg-bg-surface2 rounded px-1">stagesSku</code>): схема,
                        доска, матрица и переходы считаются только в его контексте. Свод по всей
                        коллекции без выбора строки — отдельный сценарий (бэклог).
>>>>>>> recover/cabinet-wip-from-stash
                      </p>
                    </StagesHelpWhyBlock>
                    <StagesHelpWhyBlock title="Зачем">
                      <p>
                        Меньше когнитивной нагрузки: всегда ясно, с каким стилем ведёте работу на
                        этом экране.
                      </p>
                    </StagesHelpWhyBlock>
                    <StagesHelpWhyBlock title="URL и ссылки">
                      <p>
<<<<<<< HEAD
                        <code className="rounded bg-slate-100 px-1">stagesSku</code> — id артикула в
                        URL. Чтобы снять привязку к узлу схемы, удалите из адреса{' '}
                        <code className="rounded bg-slate-100 px-1">stagesChainFocus</code>; при
                        необходимости уберите устаревшие{' '}
                        <code className="rounded bg-slate-100 px-1">stagesPick</code> /{' '}
                        <code className="rounded bg-slate-100 px-1">stagesWorkSku</code>.
                      </p>
                      <p className="mt-2">
                        Подробности по строке — по стрелке.{' '}
                        <strong className="text-slate-800">Ткань и площадка</strong> — в модулях:
=======
                        <code className="bg-bg-surface2 rounded px-1">stagesSku</code> — id артикула
                        в URL. Чтобы снять привязку к узлу схемы, удалите из адреса{' '}
                        <code className="bg-bg-surface2 rounded px-1">stagesChainFocus</code>; при
                        необходимости уберите устаревшие{' '}
                        <code className="bg-bg-surface2 rounded px-1">stagesPick</code> /{' '}
                        <code className="bg-bg-surface2 rounded px-1">stagesWorkSku</code>.
                      </p>
                      <p className="mt-2">
                        Подробности по строке — по стрелке.{' '}
                        <strong className="text-text-primary">Ткань и площадка</strong> — в модулях:
>>>>>>> recover/cabinet-wip-from-stash
                      </p>
                      <ul className="list-disc space-y-1 pl-4">
                        <li>
                          <Link
                            href={
                              focusArticle
                                ? mergeModuleHref(
                                    ROUTES.brand.materials,
                                    focusArticle.currentStageId
                                  )
                                : mergeCollectionQuery(ROUTES.brand.materials, collectionQuery)
                            }
<<<<<<< HEAD
                            className="font-semibold text-indigo-600 hover:underline"
=======
                            className="text-accent-primary font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Материалы
                          </Link>
                          {focusArticle ? (
<<<<<<< HEAD
                            <span className="text-slate-400"> (с контекстом артикула в URL)</span>
=======
                            <span className="text-text-muted"> (с контекстом артикула в URL)</span>
>>>>>>> recover/cabinet-wip-from-stash
                          ) : null}
                        </li>
                        <li>
                          <Link
                            href={
                              focusArticle
                                ? mergeModuleHref(
                                    floorHref('workshop'),
                                    focusArticle.currentStageId
                                  )
                                : mergeCollectionQuery(floorHref('workshop'), collectionQuery)
                            }
<<<<<<< HEAD
                            className="font-semibold text-indigo-600 hover:underline"
=======
                            className="text-accent-primary font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Коллекция в цеху
                          </Link>
                        </li>
                      </ul>
                    </StagesHelpWhyBlock>
                  </StagesHelpHover>
                </div>
              </div>
            </CardHeader>

            {sliceExpanded ? (
              <CardContent className="space-y-3 pb-4 pt-0">
                <div
                  className={cn(
<<<<<<< HEAD
                    'flex min-h-0 flex-col gap-3 rounded-xl border border-slate-200/90 bg-slate-50/90 p-2 sm:flex-row',
                    SLICE_PANEL_HEIGHT_CLASS
                  )}
                >
                  <aside className="flex max-h-[min(13rem,46vh)] min-h-0 w-full shrink-0 flex-col gap-2 overflow-y-auto sm:max-h-none sm:w-[12.5rem] sm:max-w-[13rem] sm:border-r sm:border-slate-200/80 sm:pr-2.5">
                    <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                      Фильтры
                    </p>
                    <p className="text-[9px] leading-snug text-slate-500">
=======
                    'border-border-default/90 bg-bg-surface2/90 flex min-h-0 flex-col gap-3 rounded-xl border p-2 sm:flex-row',
                    SLICE_PANEL_HEIGHT_CLASS
                  )}
                >
                  <aside className="sm:border-border-default/80 flex max-h-[min(13rem,46vh)] min-h-0 w-full shrink-0 flex-col gap-2 overflow-y-auto sm:max-h-none sm:w-[12.5rem] sm:max-w-[13rem] sm:border-r sm:pr-2.5">
                    <p className="text-text-muted text-[7px] font-bold uppercase tracking-wide">
                      Фильтры
                    </p>
                    <p className="text-text-secondary text-[9px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                      Варианты в каждом блоке — из коллекции с учётом остальных выбранных осей.
                    </p>
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 shrink-0 text-[9px]"
                        onClick={clearAllFacets}
                      >
                        Сбросить срез
                      </Button>
                      <Input
                        className="h-8 min-w-0 flex-1 basis-[8rem] text-xs sm:min-w-[6rem]"
                        placeholder="Поиск по артикулу…"
                        value={pickerQ}
                        onChange={(e) => setPickerQ(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
<<<<<<< HEAD
                      <span className="text-[7px] font-bold uppercase text-slate-400">
                        Аудитория
                      </span>
                      <div className="space-y-0.5 rounded-md border border-slate-100 bg-white px-1 py-1">
                        {audienceFacetChoices.length === 0 ? (
                          <p className="px-0.5 py-1 text-[9px] text-slate-400">Нет вариантов</p>
=======
                      <span className="text-text-muted text-[7px] font-bold uppercase">
                        Аудитория
                      </span>
                      <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                        {audienceFacetChoices.length === 0 ? (
                          <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
>>>>>>> recover/cabinet-wip-from-stash
                        ) : (
                          audienceFacetChoices.map((o) => {
                            const fid = `facet-aud-${o.id}`;
                            return (
                              <label
                                key={o.id}
                                htmlFor={fid}
<<<<<<< HEAD
                                className="flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5 hover:bg-slate-50"
=======
                                className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Checkbox
                                  id={fid}
                                  className="h-3.5 w-3.5 shrink-0"
                                  checked={facetBundle.audience.has(o.id)}
                                  onCheckedChange={() => toggleFacetValue('stagesAudience', o.id)}
                                />
<<<<<<< HEAD
                                <span className="truncate text-[10px] leading-tight text-slate-800">
=======
                                <span className="text-text-primary truncate text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {o.name}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
<<<<<<< HEAD
                      <span className="text-[7px] font-bold uppercase text-slate-400">Сезон</span>
                      <div className="space-y-0.5 rounded-md border border-slate-100 bg-white px-1 py-1">
                        {seasonFacetChoices.length === 0 ? (
                          <p className="px-0.5 py-1 text-[9px] text-slate-400">Нет вариантов</p>
=======
                      <span className="text-text-muted text-[7px] font-bold uppercase">Сезон</span>
                      <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                        {seasonFacetChoices.length === 0 ? (
                          <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
>>>>>>> recover/cabinet-wip-from-stash
                        ) : (
                          seasonFacetChoices.map((s) => {
                            const fid = `facet-sea-${encodeURIComponent(s)}`;
                            return (
                              <label
                                key={s}
                                htmlFor={fid}
<<<<<<< HEAD
                                className="flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5 hover:bg-slate-50"
=======
                                className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Checkbox
                                  id={fid}
                                  className="h-3.5 w-3.5 shrink-0"
                                  checked={facetBundle.season.has(s)}
                                  onCheckedChange={() => toggleFacetValue('stagesSeason', s)}
                                />
<<<<<<< HEAD
                                <span className="truncate text-[10px] leading-tight text-slate-800">
=======
                                <span className="text-text-primary truncate text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {s}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
<<<<<<< HEAD
                      <span className="text-[7px] font-bold uppercase text-slate-400">L1</span>
                      <div className="space-y-0.5 rounded-md border border-slate-100 bg-white px-1 py-1">
                        {l1FacetChoices.length === 0 ? (
                          <p className="px-0.5 py-1 text-[9px] text-slate-400">Нет вариантов</p>
=======
                      <span className="text-text-muted text-[7px] font-bold uppercase">L1</span>
                      <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                        {l1FacetChoices.length === 0 ? (
                          <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
>>>>>>> recover/cabinet-wip-from-stash
                        ) : (
                          l1FacetChoices.map((s) => {
                            const fid = `facet-l1-${encodeURIComponent(s)}`;
                            return (
                              <label
                                key={s}
                                htmlFor={fid}
<<<<<<< HEAD
                                className="flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5 hover:bg-slate-50"
=======
                                className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Checkbox
                                  id={fid}
                                  className="h-3.5 w-3.5 shrink-0"
                                  checked={facetBundle.l1.has(s)}
                                  onCheckedChange={() => toggleFacetValue('stagesL1', s)}
                                />
<<<<<<< HEAD
                                <span className="truncate text-[10px] leading-tight text-slate-800">
=======
                                <span className="text-text-primary truncate text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {s}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
<<<<<<< HEAD
                      <span className="text-[7px] font-bold uppercase text-slate-400">L2</span>
                      <div className="space-y-0.5 rounded-md border border-slate-100 bg-white px-1 py-1">
                        {l2FacetChoices.length === 0 ? (
                          <p className="px-0.5 py-1 text-[9px] text-slate-400">Нет вариантов</p>
=======
                      <span className="text-text-muted text-[7px] font-bold uppercase">L2</span>
                      <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                        {l2FacetChoices.length === 0 ? (
                          <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
>>>>>>> recover/cabinet-wip-from-stash
                        ) : (
                          l2FacetChoices.map((s) => {
                            const fid = `facet-l2-${encodeURIComponent(s)}`;
                            return (
                              <label
                                key={s}
                                htmlFor={fid}
<<<<<<< HEAD
                                className="flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5 hover:bg-slate-50"
=======
                                className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Checkbox
                                  id={fid}
                                  className="h-3.5 w-3.5 shrink-0"
                                  checked={facetBundle.l2.has(s)}
                                  onCheckedChange={() => toggleFacetValue('stagesL2', s)}
                                />
<<<<<<< HEAD
                                <span className="truncate text-[10px] leading-tight text-slate-800">
=======
                                <span className="text-text-primary truncate text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {s}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
<<<<<<< HEAD
                      <span className="text-[7px] font-bold uppercase text-slate-400">L3</span>
                      <div className="space-y-0.5 rounded-md border border-slate-100 bg-white px-1 py-1">
                        {l3FacetChoices.length === 0 ? (
                          <p className="px-0.5 py-1 text-[9px] text-slate-400">Нет вариантов</p>
=======
                      <span className="text-text-muted text-[7px] font-bold uppercase">L3</span>
                      <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                        {l3FacetChoices.length === 0 ? (
                          <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
>>>>>>> recover/cabinet-wip-from-stash
                        ) : (
                          l3FacetChoices.map((s) => {
                            const fid = `facet-l3-${encodeURIComponent(s)}`;
                            return (
                              <label
                                key={s}
                                htmlFor={fid}
<<<<<<< HEAD
                                className="flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5 hover:bg-slate-50"
=======
                                className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Checkbox
                                  id={fid}
                                  className="h-3.5 w-3.5 shrink-0"
                                  checked={facetBundle.l3.has(s)}
                                  onCheckedChange={() => toggleFacetValue('stagesL3', s)}
                                />
<<<<<<< HEAD
                                <span className="truncate text-[10px] leading-tight text-slate-800">
=======
                                <span className="text-text-primary truncate text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {s}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
<<<<<<< HEAD
                      <span className="text-[7px] font-bold uppercase text-slate-400">
                        Производство
                      </span>
                      <div className="space-y-0.5 rounded-md border border-slate-100 bg-white px-1 py-1">
                        {fabFacetChoices.length === 0 ? (
                          <p className="px-0.5 py-1 text-[9px] text-slate-400">Нет вариантов</p>
=======
                      <span className="text-text-muted text-[7px] font-bold uppercase">
                        Производство
                      </span>
                      <div className="border-border-subtle space-y-0.5 rounded-md border bg-white px-1 py-1">
                        {fabFacetChoices.length === 0 ? (
                          <p className="text-text-muted px-0.5 py-1 text-[9px]">Нет вариантов</p>
>>>>>>> recover/cabinet-wip-from-stash
                        ) : (
                          fabFacetChoices.map((o) => {
                            const fid = `facet-fab-${o.id}`;
                            return (
                              <label
                                key={o.id}
                                htmlFor={fid}
<<<<<<< HEAD
                                className="flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5 hover:bg-slate-50"
=======
                                className="hover:bg-bg-surface2 flex cursor-pointer items-center gap-1.5 rounded px-0.5 py-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Checkbox
                                  id={fid}
                                  className="h-3.5 w-3.5 shrink-0"
                                  checked={facetBundle.fab.has(o.id)}
                                  onCheckedChange={() => toggleFacetValue('stagesFab', o.id)}
                                />
<<<<<<< HEAD
                                <span className="truncate text-[10px] leading-tight text-slate-800">
=======
                                <span className="text-text-primary truncate text-[10px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {o.label}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </aside>

<<<<<<< HEAD
                  <div className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
                    {articlesForPickerList.length === 0 ? (
                      <p className="col-span-full py-2 text-[10px] text-slate-400">
=======
                  <div className="border-border-default min-h-0 min-w-0 flex-1 overflow-y-auto rounded-lg border bg-white p-2">
                    {articlesForPickerList.length === 0 ? (
                      <p className="text-text-muted col-span-full py-2 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        Нет артикулов в пуле.
                      </p>
                    ) : (
                      articlesForPickerList.map((a) => {
                        const st = steps.find((s) => s.id === a.currentStageId);
                        const pathLine =
                          a.categoryPathLabel ??
                          `${a.audienceLabel ?? '—'} › ${a.categoryL1 ?? '—'} › ${a.categoryL2 ?? '—'} › ${a.categoryL3 ?? '—'}`;
                        const expanded = expandedPickDetailIds.has(a.id);
                        const active = resolvedFocusId === a.id;
                        return (
                          <div
                            key={a.id}
                            className={cn(
                              'flex flex-col gap-0.5 rounded border px-1 py-1 text-[10px] transition-colors',
                              active
<<<<<<< HEAD
                                ? 'border-indigo-400 bg-indigo-50/50 shadow-sm'
                                : 'border-transparent hover:border-slate-100 hover:bg-slate-50'
=======
                                ? 'border-accent-primary/40 bg-accent-primary/10 shadow-sm'
                                : 'hover:bg-bg-surface2 hover:border-border-subtle border-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-1.5">
                              <button
                                type="button"
<<<<<<< HEAD
                                className="min-w-0 flex-1 cursor-pointer truncate text-left font-medium text-slate-800"
=======
                                className="text-text-primary min-w-0 flex-1 cursor-pointer truncate text-left font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                                onClick={() => setFocusSku(a.id)}
                              >
                                {stagesArticleDisplayLabel(a.sku, a.season)}
                              </button>
                              <button
                                type="button"
<<<<<<< HEAD
                                className="shrink-0 rounded p-0.5 text-slate-400 transition-colors hover:bg-indigo-50/80 hover:text-indigo-600"
=======
                                className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/15 shrink-0 rounded p-0.5 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                                aria-expanded={expanded}
                                aria-controls={`stages-pick-detail-${a.id}`}
                                title={expanded ? 'Скрыть подробности' : 'Категория, сезон, этап'}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  togglePickDetailRow(a.id);
                                }}
                              >
                                <ChevronDown
                                  className={cn(
                                    'h-3.5 w-3.5 transition-transform duration-200',
                                    expanded && 'rotate-180'
                                  )}
                                  aria-hidden
                                />
                              </button>
                            </div>
                            {expanded ? (
                              <div
                                id={`stages-pick-detail-${a.id}`}
<<<<<<< HEAD
                                className="mt-0.5 space-y-1 border-t border-slate-100/90 pl-1 pt-1 text-[8px] leading-snug text-slate-500"
                              >
                                <p className="line-clamp-4 text-slate-600">{pathLine}</p>
                                <p className="text-slate-500">
                                  <span className="font-semibold text-slate-600">Сезон:</span>{' '}
                                  {a.season ?? '—'}
                                  <span className="text-slate-300"> · </span>
                                  <span className="font-semibold text-slate-600">Этап:</span>{' '}
                                  {st?.title ?? a.currentStageId}
                                </p>
                                <p className="text-[7px] leading-snug text-slate-400">
=======
                                className="text-text-secondary border-border-subtle/90 mt-0.5 space-y-1 border-t pl-1 pt-1 text-[8px] leading-snug"
                              >
                                <p className="text-text-secondary line-clamp-4">{pathLine}</p>
                                <p className="text-text-secondary">
                                  <span className="text-text-secondary font-semibold">Сезон:</span>{' '}
                                  {a.season ?? '—'}
                                  <span className="text-text-muted"> · </span>
                                  <span className="text-text-secondary font-semibold">
                                    Этап:
                                  </span>{' '}
                                  {st?.title ?? a.currentStageId}
                                </p>
                                <p className="text-text-muted text-[7px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                                  Ткань и поставщики —{' '}
                                  <Link
                                    href={mergeModuleHref(
                                      ROUTES.brand.materials,
                                      a.currentStageId,
                                      a.id
                                    )}
<<<<<<< HEAD
                                    className="font-medium text-indigo-600 hover:underline"
=======
                                    className="text-accent-primary font-medium hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Материалы
                                  </Link>
                                  . Площадка производства —{' '}
                                  <Link
                                    href={mergeModuleHref(
                                      floorHref('workshop'),
                                      a.currentStageId,
                                      a.id
                                    )}
<<<<<<< HEAD
                                    className="font-medium text-indigo-600 hover:underline"
=======
                                    className="text-accent-primary font-medium hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Коллекция в цеху
                                  </Link>
                                  .
                                </p>
                              </div>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </CardContent>
            ) : null}
          </Card>

          <TabsContent value="ops" className="mt-4 space-y-4 focus-visible:outline-none">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="text-sm uppercase tracking-tight">Доска этапов</CardTitle>
                    <CardDescription className="text-xs">
                      Колонки — этапы коллекции; артикул в фокусе — карточка в колонке текущего
                      этапа. В шапке каждой колонки —{' '}
<<<<<<< HEAD
                      <strong className="text-slate-800">% заполнения данных</strong> для этого
=======
                      <strong className="text-text-primary">% заполнения данных</strong> для этого
>>>>>>> recover/cabinet-wip-from-stash
                      этапа и SKU (обязательные и доп. поля под модуль этапа, не прогресс «можно ли
                      идти дальше»).
                    </CardDescription>
                  </div>
                  <StagesCollapsePinBar
                    pinned={boardPinned}
                    onPinnedChange={setBoardPinned}
                    open={boardOpen}
                    onOpenChange={setBoardOpen}
                    collapseAriaLabel="Свернуть или развернуть «Доску этапов»"
                  />
<<<<<<< HEAD
                  <div className="flex h-8 shrink-0 items-center border-l border-slate-200 pl-2">
=======
                  <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <StagesHelpHover
                      align="end"
                      wide
                      title="Доска этапов"
                      trigger={
                        <StagesHelpIconTrigger aria-label="Справка: доска этапов и колонки" />
                      }
                    >
                      <StagesHelpWhyBlock title="Зачем">
                        <p>
                          Визуальный Kanban по коллекции: видно текущий этап выбранного SKU и
                          локальные статусы по шагам.
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Подробно">
                        <p>
                          Карточка артикула стоит в колонке его{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">текущего</strong> этапа. Этапы — сеткой
                          по четыре колонки в ряд; сводка в шапке колонки — по артикулу в фокусе (
                          <code className="rounded bg-slate-100 px-1">stagesSku</code>). Колонка с
                          карточкой SKU подсвечена. Кнопка{' '}
                          <strong className="text-slate-800">«К данным этапа»</strong> в шапке
=======
                          <strong className="text-text-primary">текущего</strong> этапа. Этапы —
                          сеткой по четыре колонки в ряд; сводка в шапке колонки — по артикулу в
                          фокусе (<code className="bg-bg-surface2 rounded px-1">stagesSku</code>).
                          Колонка с карточкой SKU подсвечена. Кнопка{' '}
                          <strong className="text-text-primary">«К данным этапа»</strong> в шапке
>>>>>>> recover/cabinet-wip-from-stash
                          колонки открывает модуль этапа с этим SKU в URL для любой колонки (не
                          только текущей). Клик по карточке SKU ведёт на вкладку цеха / модуль этого
                          этапа (заполнение данных) с тем же артикулом в URL; если у этапа нет
                          ссылки — открывается «По артикулам». Больше двух карточек в колонке —
                          прокрутка.
                        </p>
                        <p className="mt-1.5">
<<<<<<< HEAD
                          <strong className="text-slate-800">Процент в шапке колонки</strong> —
=======
                          <strong className="text-text-primary">Процент в шапке колонки</strong> —
>>>>>>> recover/cabinet-wip-from-stash
                          заполненность полей карточки процесса под модуль этого этапа (бриф, PIM,
                          бюджет, материалы… — разный чеклист). Это не то же самое, что статус
                          «готово» в цепочке этапов. Без артикула в фокусе процент не показывается.
                        </p>
                      </StagesHelpWhyBlock>
<<<<<<< HEAD
                      <p className="text-[10px] text-slate-500">
=======
                      <p className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        Массовые статусы по этапам — в «Матрице этапов» ниже; схема зависимостей —
                        для фильтра узла и обзора цифр.
                      </p>
                    </StagesHelpHover>
                  </div>
                </div>
              </CardHeader>
              {boardExpanded ? (
                <CardContent className="-mx-1 space-y-3 px-1 pb-2">
                  {boardStepRows.map((rowSteps, rowIdx) => (
                    <div
                      key={`board-row-${rowIdx}`}
<<<<<<< HEAD
                      className="grid min-h-[280px] grid-cols-2 items-stretch gap-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 md:grid-cols-4"
=======
                      className="border-border-default bg-bg-surface2/80 grid min-h-[280px] grid-cols-2 items-stretch gap-0 overflow-hidden rounded-xl border md:grid-cols-4"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      {rowSteps.map((step, colIdxInRow) => {
                        const globalColIdx = rowIdx * BOARD_STAGES_PER_ROW + colIdxInRow;
                        const stat = columnStats.find((c) => c.step.id === step.id);
                        const here = stat?.here ?? [];
                        const blocked = isBlocked(step);
                        const profileNa =
                          getProductionStageDisplayMode(step.id, productionProfileId) ===
                          'not_applicable';
                        const s = aggregateStatus[step.id] ?? 'not_started';
                        const focusStageFill =
                          focusArticle != null
                            ? evaluateStageDataFill(
                                step.id,
                                flowDoc.skus[focusArticle.id]?.stages[step.id] ?? {
                                  status: 'not_started' as const,
                                }
                              )
                            : null;
                        /** Переход в модуль этапа доступен при выбранном SKU всегда (не только для «текущей» колонки / «готово»). */
                        const boardNavHref: string | null =
                          focusArticle != null && (step.productionFloorTab || step.href)
                            ? step.productionFloorTab
                              ? mergeCollectionQuery(
                                  floorHref(step.productionFloorTab),
                                  collectionQuery
                                )
                              : mergeCollectionQuery(step.href!, collectionQuery)
                            : null;
                        const boardFillShortcuts =
                          focusStageFill != null
                            ? STAGES_SKU_PANEL_TAB_VALUES.filter(
                                (t) =>
                                  t !== 'process' &&
                                  focusStageFill.items.some((i) => i.editTab === t)
                              )
                            : [];
                        const headerShell = cn(
<<<<<<< HEAD
                          'px-2.5 pt-2.5 pb-2 border-b border-slate-100 flex flex-col justify-between transition-colors',
=======
                          'px-2.5 pt-2.5 pb-2 border-b border-border-subtle flex flex-col justify-between transition-colors',
>>>>>>> recover/cabinet-wip-from-stash
                          BOARD_COL_HEADER_H
                        );
                        return (
                          <div
                            key={step.id}
                            className={cn(
<<<<<<< HEAD
                              'flex min-w-0 flex-col border-l border-slate-200 bg-white/90 first:rounded-l-xl first:border-l-0 last:rounded-r-xl',
                              profileNa && 'bg-slate-50/95 opacity-[0.72]',
=======
                              'border-border-default flex min-w-0 flex-col border-l bg-white/90 first:rounded-l-xl first:border-l-0 last:rounded-r-xl',
                              profileNa && 'bg-bg-surface2/95 opacity-[0.72]',
>>>>>>> recover/cabinet-wip-from-stash
                              here.length > 0 &&
                                'z-[1] border-emerald-200/90 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] ring-2 ring-inset ring-emerald-500/50'
                            )}
                          >
                            <div className={headerShell}>
                              <div>
<<<<<<< HEAD
                                <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                                  Этап {globalColIdx + 1}
                                </p>
                                <p className="line-clamp-2 text-[11px] font-bold leading-tight text-slate-900">
=======
                                <p className="text-text-muted text-[8px] font-black uppercase tracking-wider">
                                  Этап {globalColIdx + 1}
                                </p>
                                <p className="text-text-primary line-clamp-2 text-[11px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {step.title}
                                </p>
                              </div>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {profileNa ? (
                                  <Badge
                                    variant="outline"
<<<<<<< HEAD
                                    className="h-5 border-dashed border-slate-300 px-1 py-0 text-[7px] text-slate-500"
=======
                                    className="border-border-default text-text-secondary h-5 border-dashed px-1 py-0 text-[7px]"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    Вне профиля
                                  </Badge>
                                ) : null}
                                <Badge
                                  variant="outline"
<<<<<<< HEAD
                                  className="h-5 border-slate-200 px-1 py-0 text-[8px]"
                                >
                                  {step.area}
                                </Badge>
                                <span className="text-[8px] text-slate-500">
=======
                                  className="border-border-default h-5 px-1 py-0 text-[8px]"
                                >
                                  {step.area}
                                </Badge>
                                <span className="text-text-secondary text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                                  {stat?.line ?? '—'}
                                </span>
                              </div>
                              {focusStageFill ? (
                                <div className="mt-2 w-full space-y-1">
                                  <div className="flex items-center justify-between gap-1">
<<<<<<< HEAD
                                    <span className="text-[7px] font-bold uppercase tracking-wide text-slate-500">
                                      Данные SKU
                                    </span>
                                    <span className="text-[10px] font-black tabular-nums text-indigo-700">
                                      {focusStageFill.percent}%
                                    </span>
                                  </div>
                                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className="h-full rounded-full bg-indigo-500"
                                      style={{ width: `${focusStageFill.percent}%` }}
                                    />
                                  </div>
                                  <p className="text-[7px] leading-tight text-slate-400">
=======
                                    <span className="text-text-secondary text-[7px] font-bold uppercase tracking-wide">
                                      Данные SKU
                                    </span>
                                    <span className="text-accent-primary text-[10px] font-black tabular-nums">
                                      {focusStageFill.percent}%
                                    </span>
                                  </div>
                                  <div className="bg-border-subtle h-1 w-full overflow-hidden rounded-full">
                                    <div
                                      className="bg-accent-primary h-full rounded-full"
                                      style={{ width: `${focusStageFill.percent}%` }}
                                    />
                                  </div>
                                  <p className="text-text-muted text-[7px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                    Обяз. {focusStageFill.requiredFilled}/
                                    {focusStageFill.requiredTotal} · Доп.{' '}
                                    {focusStageFill.optionalFilled}/{focusStageFill.optionalTotal}
                                  </p>
                                </div>
                              ) : (
<<<<<<< HEAD
                                <p className="mt-2 text-[7px] leading-tight text-slate-400">
=======
                                <p className="text-text-muted mt-2 text-[7px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  Выберите артикул в фокусе — покажем % заполнения по этапу.
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap gap-1">
                                {boardNavHref &&
                                (focusArticle || step.collectionScopedModuleNav) ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-[8px] font-semibold"
                                    title={
                                      step.collectionScopedModuleNav
                                        ? 'Модуль этапа коллекции: только collectionId в URL, без привязки к SKU'
                                        : 'Вкладка цеха или внешний модуль этапа с артикулом в фокусе (stagesSku, stagesStep в URL)'
                                    }
                                    onClick={() => navigateToStageModule(step, boardNavHref)}
                                  >
                                    К данным этапа →
                                  </Button>
                                ) : boardNavHref &&
                                  !focusArticle &&
                                  !step.collectionScopedModuleNav ? (
<<<<<<< HEAD
                                  <span className="text-[7px] leading-tight text-slate-400">
=======
                                  <span className="text-text-muted text-[7px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                    Выберите артикул справа в срезе — откроются переходы по этапам
                                  </span>
                                ) : focusArticle &&
                                  !boardNavHref &&
                                  !step.productionFloorTab &&
                                  !step.href ? (
<<<<<<< HEAD
                                  <span className="text-[7px] leading-tight text-slate-400">
=======
                                  <span className="text-text-muted text-[7px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                    Нет маршрута этапа — только «Панель данных»
                                  </span>
                                ) : null}
                                {focusArticle ? (
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="h-6 px-2 text-[8px] font-semibold"
                                    title="Открыть панель заполнения этапа на вкладке «По артикулам»"
                                    onClick={() => openSkuPanelForStep(focusArticle.id, step.id)}
                                  >
                                    Панель данных
                                  </Button>
                                ) : null}
                              </div>
                              {focusArticle && boardFillShortcuts.length > 0 ? (
                                <div
<<<<<<< HEAD
                                  className="mt-1.5 flex flex-col gap-0.5 border-t border-slate-100/90 pt-1.5"
                                  role="group"
                                  aria-label="Блоки формы в панели этапа"
                                >
                                  <span className="text-[6px] font-bold uppercase tracking-wider text-slate-400">
=======
                                  className="border-border-subtle/90 mt-1.5 flex flex-col gap-0.5 border-t pt-1.5"
                                  role="group"
                                  aria-label="Блоки формы в панели этапа"
                                >
                                  <span className="text-text-muted text-[6px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                                    Блоки
                                  </span>
                                  <div className="flex flex-wrap gap-0.5">
                                    {boardFillShortcuts.map((t) => (
                                      <button
                                        key={t}
                                        type="button"
<<<<<<< HEAD
                                        className="h-5 min-w-[1.1rem] rounded border border-slate-200 bg-white px-1 text-[7px] font-black text-slate-600 hover:border-indigo-200 hover:bg-indigo-50"
=======
                                        className="border-border-default text-text-secondary hover:bg-accent-primary/10 hover:border-accent-primary/30 h-5 min-w-[1.1rem] rounded border bg-white px-1 text-[7px] font-black"
>>>>>>> recover/cabinet-wip-from-stash
                                        title={`Панель данных · ${STAGE_FILL_EDIT_TAB_LABELS[t]}`}
                                        onClick={() =>
                                          openSkuPanelForStep(focusArticle.id, step.id, t)
                                        }
                                      >
                                        {t === 'people'
                                          ? 'Л'
                                          : t === 'costs'
                                            ? '₽'
                                            : t === 'outputs'
                                              ? 'В'
                                              : 'Ф'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col gap-2 px-2 py-2">
<<<<<<< HEAD
                              <div className="shrink-0 space-y-0.5 rounded-md bg-slate-100/80 px-2 py-1.5 text-[9px] text-slate-600">
                                <p>
                                  <strong className="text-slate-800">В колонке:</strong>{' '}
=======
                              <div className="bg-bg-surface2/80 text-text-secondary shrink-0 space-y-0.5 rounded-md px-2 py-1.5 text-[9px]">
                                <p>
                                  <strong className="text-text-primary">В колонке:</strong>{' '}
>>>>>>> recover/cabinet-wip-from-stash
                                  {here.length} арт.
                                </p>
                                <p>
                                  Готово: {stat?.done ?? 0} · В работе: {stat?.prog ?? 0}
                                  {(stat?.block ?? 0) > 0 ? ` · Блок: ${stat?.block}` : ''}
                                </p>
<<<<<<< HEAD
                                <p className="text-slate-500">
                                  Матрица:{' '}
                                  <strong className="text-slate-700">
=======
                                <p className="text-text-secondary">
                                  Матрица:{' '}
                                  <strong className="text-text-primary">
>>>>>>> recover/cabinet-wip-from-stash
                                    {statusLabel(s, blocked, profileNa)}
                                  </strong>
                                </p>
                              </div>
                              {here.length === 0 ? (
<<<<<<< HEAD
                                <p className="py-6 text-center text-[9px] text-slate-400">
=======
                                <p className="text-text-muted py-6 text-center text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                                  Нет артикулов
                                </p>
                              ) : (
                                <div
                                  className={cn(
                                    'min-h-0 space-y-2',
                                    here.length > 2 &&
                                      'max-h-[min(15rem,40vh)] flex-1 overflow-y-auto overflow-x-hidden'
                                  )}
                                >
                                  {here.map((a) => {
                                    const row = flowDoc.skus[a.id]?.stages[step.id] ?? {
                                      status: 'not_started' as const,
                                    };
                                    const assignee = row.assignee?.trim();
                                    const cardNavHref = step.productionFloorTab
                                      ? mergeCollectionQuery(
                                          floorHref(step.productionFloorTab),
                                          collectionQuery
                                        )
                                      : step.href
                                        ? mergeCollectionQuery(step.href, collectionQuery)
                                        : null;
                                    const goCardPrimary = () => {
                                      if (cardNavHref) {
                                        if (step.collectionScopedModuleNav) {
                                          router.push(cardNavHref);
                                        } else {
                                          router.push(
                                            buildTransitionUrl(cardNavHref, a.id, step.id)
                                          );
                                        }
                                        return;
                                      }
                                      setSubTab('sku');
                                      setFocusSku(a.id, { preserveChain: true });
                                    };
                                    return (
                                      <div
                                        key={a.id}
<<<<<<< HEAD
                                        className="w-full space-y-1.5 rounded-lg border border-slate-100 bg-white p-2 text-left shadow-sm"
                                      >
                                        <button
                                          type="button"
                                          className="-m-0.5 w-full space-y-1 rounded-md p-0.5 text-left transition-colors hover:bg-indigo-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
=======
                                        className="border-border-subtle w-full space-y-1.5 rounded-lg border bg-white p-2 text-left shadow-sm"
                                      >
                                        <button
                                          type="button"
                                          className="hover:bg-accent-primary/10 focus-visible:ring-accent-primary -m-0.5 w-full space-y-1 rounded-md p-0.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2"
>>>>>>> recover/cabinet-wip-from-stash
                                          title={
                                            cardNavHref
                                              ? step.collectionScopedModuleNav
                                                ? 'Этап коллекции: переход в модуль без привязки к этому SKU в URL'
                                                : 'Перейти к заполнению данных по этому этапу (вкладка цеха или модуль) с этим артикулом'
                                              : 'Нет прямой ссылки этапа — открыть карточку процесса «По артикулам»'
                                          }
                                          onClick={goCardPrimary}
                                        >
<<<<<<< HEAD
                                          <p className="truncate text-[10px] font-bold text-slate-900">
                                            {stagesArticleDisplayLabel(a.sku, a.season)}
                                          </p>
                                          <p className="truncate text-[8px] text-slate-500">
=======
                                          <p className="text-text-primary truncate text-[10px] font-bold">
                                            {stagesArticleDisplayLabel(a.sku, a.season)}
                                          </p>
                                          <p className="text-text-secondary truncate text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                                            {a.productionSiteLabel ?? '—'}
                                          </p>
                                          {a.fabricStockNote ? (
                                            <p className="line-clamp-2 text-[7px] leading-snug text-amber-900/80">
                                              {a.fabricStockNote}
                                            </p>
                                          ) : null}
                                          <div className="flex flex-wrap gap-1 pt-0.5">
                                            <Badge
                                              variant="secondary"
                                              className="h-5 px-1 text-[8px]"
                                            >
                                              {row.status === 'done' || row.status === 'skipped'
                                                ? 'Готово'
                                                : row.status === 'in_progress'
                                                  ? 'В работе'
                                                  : row.status === 'blocked'
                                                    ? 'Блок'
                                                    : 'Не начато'}
                                            </Badge>
                                          </div>
<<<<<<< HEAD
                                          <p className="text-[8px] text-slate-500">
                                            <span className="font-semibold text-slate-600">
=======
                                          <p className="text-text-secondary text-[8px]">
                                            <span className="text-text-secondary font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
                                              Кто:
                                            </span>{' '}
                                            {assignee || '—'}
                                          </p>
                                          {row.notes?.trim() ? (
<<<<<<< HEAD
                                            <p className="line-clamp-2 text-[8px] text-slate-500">
                                              {row.notes}
                                            </p>
                                          ) : null}
                                          <p className="pt-0.5 text-[7px] font-bold uppercase tracking-wide text-indigo-600">
=======
                                            <p className="text-text-secondary line-clamp-2 text-[8px]">
                                              {row.notes}
                                            </p>
                                          ) : null}
                                          <p className="text-accent-primary pt-0.5 text-[7px] font-bold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
                                            {cardNavHref ? 'К работе по этапу →' : 'По артикулам →'}
                                          </p>
                                        </button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="h-6 w-full text-[8px] font-semibold"
                                          onClick={() => openSkuPanelForStep(a.id, step.id)}
                                        >
                                          Панель данных
                                        </Button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </CardContent>
              ) : null}
            </Card>
          </TabsContent>

          <TabsContent value="process" className="mt-4 space-y-4 focus-visible:outline-none">
            <Card>
              <CardHeader className="space-y-0 pb-2">
                <div className="flex w-full items-center gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-1">
                    <div className="min-w-0 flex-1 pr-1">
                      <CardTitle className="text-sm uppercase tracking-tight">
                        Схема зависимостей
                      </CardTitle>
<<<<<<< HEAD
                      <p className="mt-1 text-xs leading-snug text-slate-500">
=======
                      <p className="text-text-secondary mt-1 text-xs leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                        Перечень SKU · клик по узлу сужает список и доску «Оперативка»
                      </p>
                    </div>
                    <StagesCollapsePinBar
                      pinned={depsPinned}
                      onPinnedChange={setDepsPinned}
                      open={depsOpen}
                      onOpenChange={setDepsOpen}
                      collapseAriaLabel="Свернуть или развернуть «Схему зависимостей»"
                    />
                  </div>
<<<<<<< HEAD
                  <div className="flex h-8 shrink-0 items-center border-l border-slate-200 pl-2">
=======
                  <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <StagesHelpHover
                      align="end"
                      wide
                      title="Схема зависимостей — справка"
                      trigger={
                        <StagesHelpIconTrigger aria-label="Справка: схема зависимостей, счётчики на узлах" />
                      }
                    >
                      <StagesHelpWhyBlock title="Схема и клики">
                        <p>
                          Быстро увидеть, на каких этапах «лежит» перечень SKU, и сузить контекст
                          кликом по узлу (список и доска «Оперативка»).
                        </p>
                        <p className="mt-1.5">
                          У каждого узла справа сверху — иконка{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">i</strong>: список артикулов перечня на
                          этом этапе и подсказка, что сделать, чтобы двигаться дальше по контуру.
=======
                          <strong className="text-text-primary">i</strong>: список артикулов перечня
                          на этом этапе и подсказка, что сделать, чтобы двигаться дальше по контуру.
>>>>>>> recover/cabinet-wip-from-stash
                          Если на узле 0 SKU, сначала закройте предшественников в матрице или
                          расширьте срез.
                        </p>
                        <p className="mt-1.5">
                          Числа на узлах — по{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">перечню SKU</strong> (срез слева +
=======
                          <strong className="text-text-primary">перечню SKU</strong> (срез слева +
>>>>>>> recover/cabinet-wip-from-stash
                          чекбоксы). Узлы в 5 колонок и змейка; стрелки — визуальный порядок, не
                          полный граф (полный — в матрице ниже).
                        </p>
                        <p className="mt-1.5">
                          Узлы с артикулами перечня —{' '}
                          <strong className="text-emerald-800">зелёная рамка</strong>. Активный
<<<<<<< HEAD
                          фильтр узла — <strong className="text-indigo-800">индиго</strong>.
=======
                          фильтр узла — <strong className="text-accent-primary">индиго</strong>.
>>>>>>> recover/cabinet-wip-from-stash
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Счётчики «арт. здесь» и контекст">
                        <p>
                          «Арт. здесь» = сколько SKU из{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">пула среза</strong> имеют{' '}
                          <strong className="text-slate-800">текущий этап</strong> на этом узле
=======
                          <strong className="text-text-primary">пула среза</strong> имеют{' '}
                          <strong className="text-text-primary">текущий этап</strong> на этом узле
>>>>>>> recover/cabinet-wip-from-stash
                          (поле контура коллекции).
                        </p>
                        <p className="mt-1.5">
                          Рабочий контекст — один артикул (
<<<<<<< HEAD
                          <code className="rounded bg-slate-100 px-1">stagesSku</code>); доска и
=======
                          <code className="bg-bg-surface2 rounded px-1">stagesSku</code>); доска и
>>>>>>> recover/cabinet-wip-from-stash
                          матрица показывают его только если этап SKU совпадает с выбранным узлом
                          схемы (или узел не включён).
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Следующий этап по SKU">
                        <p>
                          Текущий и следующий этап — из данных коллекции и каталога; зависимости
                          следующего шага сверяются со статусами в матрице (включая «не начато — не
                          блокирует», если задано в каталоге).
                        </p>
                        <p className="mt-1.5">
                          Статусы меняются в{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">«Матрице этапов»</strong>; текст по
                          конкретному артикулу — в окне узла (кнопка{' '}
                          <strong className="text-slate-800">i</strong> на карточке этапа), без
=======
                          <strong className="text-text-primary">«Матрице этапов»</strong>; текст по
                          конкретному артикулу — в окне узла (кнопка{' '}
                          <strong className="text-text-primary">i</strong> на карточке этапа), без
>>>>>>> recover/cabinet-wip-from-stash
                          дублирования здесь.
                        </p>
                      </StagesHelpWhyBlock>
                    </StagesHelpHover>
                  </div>
                </div>
              </CardHeader>
              {depsExpanded && (
                <CardContent className="max-w-full overflow-x-hidden pb-4">
                  <div className="mb-3 space-y-1.5">
<<<<<<< HEAD
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm">
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                          <Package className="h-4 w-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold leading-tight text-slate-900">
=======
                    <div className="border-border-default/90 flex flex-wrap items-center gap-2 rounded-xl border bg-white px-3 py-2.5 shadow-sm">
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <span className="bg-accent-primary/15 text-accent-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                          <Package className="h-4 w-4" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-text-primary text-[11px] font-bold leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {focusArticle
                              ? `В фокусе: ${stagesArticleDisplayLabel(focusArticle.sku, focusArticle.season)}`
                              : 'Нет артикула в фокусе'}
                          </p>
<<<<<<< HEAD
                          <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
=======
                          <p className="text-text-secondary mt-0.5 text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                            Счётчики на узлах — по пулу среза; доска и матрица следуют одному SKU и
                            узлу схемы · подробности — в справке у «Схема зависимостей»
                          </p>
                        </div>
                      </div>
                    </div>
                    {chainFocusStepId ? (
<<<<<<< HEAD
                      <p className="text-[10px] text-slate-600" aria-live="polite">
=======
                      <p className="text-text-secondary text-[10px]" aria-live="polite">
>>>>>>> recover/cabinet-wip-from-stash
                        Узел «
                        <strong>
                          {steps.find((s) => s.id === chainFocusStepId)?.title ?? chainFocusStepId}
                        </strong>
                        »: этап выбранного SKU{' '}
                        {viewArticles.length > 0
                          ? 'совпадает с узлом — доска и матрица активны'
                          : 'не на этом узле — доска и матрица пусты, пока не смените артикул или узел'}
                        .{' '}
                        <button
                          type="button"
<<<<<<< HEAD
                          className="font-semibold text-indigo-600 hover:underline"
=======
                          className="text-accent-primary font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                          onClick={() => toggleChainFocus(chainFocusStepId)}
                        >
                          Снять фильтр узла
                        </button>
                      </p>
                    ) : (
<<<<<<< HEAD
                      <p className="text-[10px] text-slate-500">
=======
                      <p className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        Клик по узлу цепочки — сузить список, доску и матрицу до артикулов с текущим
                        этапом на узле; на карточке узла всегда видно число «арт.: N», в т.ч. 0.
                      </p>
                    )}
                  </div>
                  <div
                    className="w-full max-w-full space-y-0 py-1"
                    role="list"
                    aria-label="Цепочка этапов: змейка по 5 узлов в строке"
                  >
                    {depsSchemaChunks.map((chunk, rowIdx) => {
                      const isEvenRow = rowIdx % 2 === 0;
                      const ordered = isEvenRow ? chunk : [...chunk].reverse();
                      const paddedSlots: (CollectionStep | null)[] = Array.from(
                        { length: DEPS_SCHEMA_CHUNK },
                        (_, i) => ordered[i] ?? null
                      );
                      return (
                        <Fragment key={`deps-row-${rowIdx}`}>
                          <div
                            className="grid min-h-[62px] w-full min-w-0 items-stretch"
                            style={{ gridTemplateColumns: DEPS_SCHEMA_FULL_ROW_GRID }}
                          >
                            {paddedSlots.map((step, i) => {
                              const cellKey = step?.id ?? `deps-empty-${rowIdx}-${i}`;
                              if (!step) {
                                return (
                                  <Fragment key={cellKey}>
                                    <div
                                      className="min-h-[52px] min-w-0 rounded-lg border border-transparent bg-transparent"
                                      aria-hidden
                                    />
                                    {i < DEPS_SCHEMA_CHUNK - 1 ? (
                                      <div
                                        className="relative flex min-w-0 items-center justify-center opacity-25"
                                        aria-hidden
                                      >
<<<<<<< HEAD
                                        <span className="pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-slate-200" />
                                        {isEvenRow ? (
                                          <ArrowRight
                                            className="relative z-[1] h-3 w-3 text-slate-300"
=======
                                        <span className="bg-border-subtle pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" />
                                        {isEvenRow ? (
                                          <ArrowRight
                                            className="text-text-muted relative z-[1] h-3 w-3"
>>>>>>> recover/cabinet-wip-from-stash
                                            strokeWidth={2.5}
                                          />
                                        ) : (
                                          <ArrowLeft
<<<<<<< HEAD
                                            className="relative z-[1] h-3 w-3 text-slate-300"
=======
                                            className="text-text-muted relative z-[1] h-3 w-3"
>>>>>>> recover/cabinet-wip-from-stash
                                            strokeWidth={2.5}
                                          />
                                        )}
                                      </div>
                                    ) : null}
                                  </Fragment>
                                );
                              }
                              const articlesHere = viewArticles.filter(
                                (a) => a.currentStageId === step.id
                              );
                              const count = articlesHere.length;
                              const active = chainFocusStepId === step.id;
                              const hasArticlesHere = count > 0;
                              const hasNextNode =
                                i < DEPS_SCHEMA_CHUNK - 1 && paddedSlots[i + 1] != null;
                              const profileNa =
                                getProductionStageDisplayMode(step.id, productionProfileId) ===
                                'not_applicable';
                              return (
                                <Fragment key={cellKey}>
                                  <div
                                    role="listitem"
                                    className={cn(
                                      'relative flex h-full min-w-0 flex-col rounded-lg border transition-colors',
                                      profileNa &&
<<<<<<< HEAD
                                        'border-dashed border-slate-300/90 bg-slate-100/50 opacity-70',
                                      active
                                        ? 'z-[1] border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-300'
                                        : hasArticlesHere
                                          ? 'border-2 border-emerald-500 bg-emerald-50/45 shadow-[0_0_0_1px_rgba(16,185,129,0.12)] hover:border-emerald-600 hover:bg-emerald-50/70'
                                          : 'border border-slate-200 bg-slate-50/90 hover:border-slate-300 hover:bg-white'
=======
                                        'border-border-default/90 bg-bg-surface2/50 border-dashed opacity-70',
                                      active
                                        ? 'border-accent-primary bg-accent-primary/10 ring-accent-primary/40 z-[1] shadow-sm ring-2'
                                        : hasArticlesHere
                                          ? 'border-2 border-emerald-500 bg-emerald-50/45 shadow-[0_0_0_1px_rgba(16,185,129,0.12)] hover:border-emerald-600 hover:bg-emerald-50/70'
                                          : 'border-border-default bg-bg-surface2/90 hover:border-border-default border hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                                    )}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => toggleChainFocus(step.id)}
                                      title={
                                        active
                                          ? 'Снять фильтр'
                                          : hasArticlesHere
                                            ? `На этапе ${count} арт. — показать только их`
                                            : 'На этом этапе нет артикулов в перечне'
                                      }
                                      className="flex min-h-[48px] flex-1 flex-col justify-center px-1.5 py-1 pr-5 text-left"
                                    >
<<<<<<< HEAD
                                      <p className="line-clamp-2 text-[7px] font-bold leading-tight text-slate-500">
                                        {step.title}
                                      </p>
                                      {profileNa ? (
                                        <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-wide text-slate-400">
                                          вне профиля
                                        </p>
                                      ) : null}
                                      <p className="mt-0.5 text-[8px] tabular-nums text-slate-600">
                                        арт. на узле: <strong>{count}</strong>
                                      </p>
                                      {active ? (
                                        <p className="mt-0.5 text-[7px] font-semibold tabular-nums text-indigo-800">
=======
                                      <p className="text-text-secondary line-clamp-2 text-[7px] font-bold leading-tight">
                                        {step.title}
                                      </p>
                                      {profileNa ? (
                                        <p className="text-text-muted mt-0.5 text-[7px] font-semibold uppercase tracking-wide">
                                          вне профиля
                                        </p>
                                      ) : null}
                                      <p className="text-text-secondary mt-0.5 text-[8px] tabular-nums">
                                        арт. на узле: <strong>{count}</strong>
                                      </p>
                                      {active ? (
                                        <p className="text-accent-primary mt-0.5 text-[7px] font-semibold tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                                          узел выбран · {count} SKU
                                        </p>
                                      ) : null}
                                    </button>
                                    <button
                                      type="button"
<<<<<<< HEAD
                                      className="absolute right-0.5 top-0.5 z-[2] flex h-5 w-5 items-center justify-center rounded-md text-indigo-600/90 shadow-sm hover:bg-white hover:text-indigo-800"
=======
                                      className="text-accent-primary/90 hover:text-accent-primary absolute right-0.5 top-0.5 z-[2] flex h-5 w-5 items-center justify-center rounded-md shadow-sm hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                                      aria-label={`Артикулы и следующий шаг: ${step.title}`}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDepsNodeInfoStepId(step.id);
                                      }}
                                    >
                                      <Info className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                                    </button>
                                  </div>
                                  {i < DEPS_SCHEMA_CHUNK - 1 ? (
                                    <div
                                      className={cn(
                                        'relative flex min-w-0 items-center justify-center',
                                        !hasNextNode && 'opacity-25'
                                      )}
                                      aria-hidden
                                    >
                                      <span
                                        className={cn(
                                          'pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full',
                                          hasNextNode
<<<<<<< HEAD
                                            ? 'bg-gradient-to-r from-violet-200 via-indigo-400 to-violet-200 opacity-95'
                                            : 'bg-slate-200'
=======
                                            ? 'from-accent-primary/20 via-accent-primary to-accent-primary/20 bg-gradient-to-r opacity-95'
                                            : 'bg-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
                                        )}
                                      />
                                      {isEvenRow ? (
                                        <ArrowRight
                                          className={cn(
                                            'relative z-[1] h-3 w-3 stroke-[2.5] drop-shadow-sm',
<<<<<<< HEAD
                                            hasNextNode ? 'text-indigo-600' : 'text-slate-300'
=======
                                            hasNextNode ? 'text-accent-primary' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                                          )}
                                        />
                                      ) : (
                                        <ArrowLeft
                                          className={cn(
                                            'relative z-[1] h-3 w-3 stroke-[2.5] drop-shadow-sm',
<<<<<<< HEAD
                                            hasNextNode ? 'text-indigo-600' : 'text-slate-300'
=======
                                            hasNextNode ? 'text-accent-primary' : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                                          )}
                                        />
                                      )}
                                    </div>
                                  ) : null}
                                </Fragment>
                              );
                            })}
                          </div>
                          {rowIdx < depsSchemaChunks.length - 1 ? (
                            <DepsRowTurnConnector
                              column={
                                isEvenRow
                                  ? chunk.length === 1
                                    ? 3
                                    : Math.min(chunk.length, DEPS_SCHEMA_CHUNK)
                                  : 1
                              }
                            />
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="text-sm uppercase tracking-tight">
                      Матрица этапов
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Один артикул в фокусе (<code className="text-[10px]">stagesSku</code>) и при
                      необходимости узел схемы: агрегат и массовые кнопки по этому SKU; детальная
                      карточка процесса — на «По артикулам». Чеклист заполнения и правки по каждому
                      этапу — кнопка «Панель данных»; без API всё сохраняется в браузере (единый
                      flow коллекции).
                    </CardDescription>
                  </div>
                  <StagesCollapsePinBar
                    pinned={matrixPinned}
                    onPinnedChange={setMatrixPinned}
                    open={matrixOpen}
                    onOpenChange={setMatrixOpen}
                    collapseAriaLabel="Свернуть или развернуть «Матрицу этапов»"
                  />
<<<<<<< HEAD
                  <div className="flex h-8 shrink-0 items-center border-l border-slate-200 pl-2">
=======
                  <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <StagesHelpHover
                      align="end"
                      wide
                      title="Матрица этапов"
                      trigger={
                        <StagesHelpIconTrigger aria-label="Справка: матрица этапов, статусы и колонка «Связь»" />
                      }
                    >
                      <StagesHelpWhyBlock title="Зачем">
                        <p>
                          Статусы по этапам для{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">одного артикула в фокусе</strong> (и
=======
                          <strong className="text-text-primary">одного артикула в фокусе</strong> (и
>>>>>>> recover/cabinet-wip-from-stash
                          узла схемы, если включён); блокировки из каталога, пока предшественники не
                          закрыты.
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Срез и фокус">
                        <p>
                          Пул артикулов задаёт срез слева; в URL фиксируется{' '}
<<<<<<< HEAD
                          <code className="rounded bg-slate-100 px-1">stagesSku</code>. Узел схемы
=======
                          <code className="bg-bg-surface2 rounded px-1">stagesSku</code>. Узел схемы
>>>>>>> recover/cabinet-wip-from-stash
                          может скрыть строки матрицы, если этап SKU не на этом узле — смените
                          артикул или снимите узел.
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Колонка «Связь»">
                        <p>
                          Четыре иконки сеткой 2×2 (сверху:{' '}
<<<<<<< HEAD
                          <strong className="text-slate-800">чат</strong>,{' '}
                          <strong className="text-slate-800">задачи</strong>; снизу:{' '}
                          <strong className="text-slate-800">календарь</strong>,{' '}
                          <strong className="text-slate-800">заметки</strong>) — компактнее, чтобы
                          не заезжать на кнопку «В модуль». Наведение на{' '}
                          <strong className="text-slate-800">конкретную</strong> иконку показывает
                          сводку только по этому каналу. Серый контур — нет активности; янтарь —
                          ждём ответ / открытые задачи / слот без «проведено»; зелёный — контур
                          закрыт; заметки при наличии — нейтральная заливка. Чат/задачи/заметки не
                          для этапов «впереди» текущего SKU; календарь — текущий и следующий этап.
=======
                          <strong className="text-text-primary">чат</strong>,{' '}
                          <strong className="text-text-primary">задачи</strong>; снизу:{' '}
                          <strong className="text-text-primary">календарь</strong>,{' '}
                          <strong className="text-text-primary">заметки</strong>) — компактнее,
                          чтобы не заезжать на кнопку «В модуль». Наведение на{' '}
                          <strong className="text-text-primary">конкретную</strong> иконку
                          показывает сводку только по этому каналу. Серый контур — нет активности;
                          янтарь — ждём ответ / открытые задачи / слот без «проведено»; зелёный —
                          контур закрыт; заметки при наличии — нейтральная заливка.
                          Чат/задачи/заметки не для этапов «впереди» текущего SKU; календарь —
                          текущий и следующий этап.
>>>>>>> recover/cabinet-wip-from-stash
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Как пользоваться">
                        <p>
                          «По арт.» — прогресс выбранного SKU по этапу. «В работе / Готово» и
                          «Сброс» — для этого же артикула в контексте узла схемы (если узел
                          включён).
                        </p>
                        <p className="mt-1.5">
<<<<<<< HEAD
                          Поле <strong className="text-slate-800">Поиск этапа</strong> сужает список
                          по названию, фазе, id или зоне (локально); запрос синхронизируется с URL{' '}
                          <code className="rounded bg-slate-100 px-1">stagesMatrixQ</code> (debounce
                          ~0,4 с). Чипы <strong className="text-slate-800">фаз</strong> пишут фильтр
                          в URL (
                          <code className="rounded bg-slate-100 px-1">stagesMatrixPhase</code>) —
=======
                          Поле <strong className="text-text-primary">Поиск этапа</strong> сужает
                          список по названию, фазе, id или зоне (локально); запрос синхронизируется
                          с URL <code className="bg-bg-surface2 rounded px-1">stagesMatrixQ</code>{' '}
                          (debounce ~0,4 с). Чипы <strong className="text-text-primary">фаз</strong>{' '}
                          пишут фильтр в URL (
                          <code className="bg-bg-surface2 rounded px-1">stagesMatrixPhase</code>) —
>>>>>>> recover/cabinet-wip-from-stash
                          удобно шарить ссылку. Зелёное кольцо на чипе — фаза текущего этапа SKU в
                          фокусе. «Сброс фильтра матрицы» очищает чип, поле и параметр в адресе.
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Переходы и связи">
                        <p>
                          Кнопки ведут во вкладку цеха или внешний модуль с тем же{' '}
<<<<<<< HEAD
                          <code className="rounded bg-slate-100 px-1">stagesSku</code> в URL (без
=======
                          <code className="bg-bg-surface2 rounded px-1">stagesSku</code> в URL (без
>>>>>>> recover/cabinet-wip-from-stash
                          мульти-перечня). Свод «сколько SKU на каком этапе» по коллекции —
                          отдельный сценарий в бэклоге, не смешивается с этим рабочим контекстом.
                        </p>
                      </StagesHelpWhyBlock>
<<<<<<< HEAD
                      <p className="text-[10px] text-slate-500">
=======
                      <p className="text-text-secondary text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        Схема зависимостей выше задаёт фильтр узла; число артикулов на узле всегда
                        на карточке, в т.ч. 0.
                      </p>
                    </StagesHelpHover>
                  </div>
                </div>
              </CardHeader>
              {matrixExpanded ? (
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
<<<<<<< HEAD
                    <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                        Перечень для матрицы
                      </p>
                      <p className="mt-1 text-[10px] leading-snug text-slate-600">
=======
                    <div className="border-border-default bg-bg-surface2/80 min-w-0 flex-1 rounded-lg border px-3 py-2.5">
                      <p className="text-text-secondary text-[9px] font-black uppercase tracking-wider">
                        Перечень для матрицы
                      </p>
                      <p className="text-text-secondary mt-1 text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                        Артикул в фокусе — справа в «Срез и артикул»
                        {chainFocusStepId ? (
                          <>
                            {' '}
                            · узел схемы «
                            {steps.find((s) => s.id === chainFocusStepId)?.title ??
                              chainFocusStepId}
                            »
                          </>
                        ) : null}
                        . Матрица и кнопки — для этого SKU
                        {viewArticles.length === 0 && focusArticle
                          ? ' (сейчас этап SKU не на узле — снимите узел или смените артикул)'
                          : ''}
                        .
                      </p>
                    </div>
                    <div className="w-full shrink-0 space-y-1.5 sm:w-[14rem]">
                      <label
                        htmlFor="stages-matrix-stage-filter"
<<<<<<< HEAD
                        className="mb-1 block text-[8px] font-bold uppercase tracking-wide text-slate-400"
=======
                        className="text-text-muted mb-1 block text-[8px] font-bold uppercase tracking-wide"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        Поиск этапа
                      </label>
                      <Input
                        id="stages-matrix-stage-filter"
                        className="h-8 text-xs"
                        placeholder="Название, фаза, зона…"
                        value={matrixStageFilterQ}
                        onChange={(e) => onMatrixSearchChange(e.target.value)}
                        aria-label="Фильтр строк матрицы этапов"
                      />
                      <div className="flex flex-wrap gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-[9px]"
                          onClick={clearMatrixFilters}
                          disabled={
                            !matrixPhaseParam && !matrixStageFilterQ.trim() && !matrixTextQParam
                          }
                        >
                          Сброс фильтра матрицы
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-7 gap-1 px-2 text-[9px]"
                          onClick={scrollToCurrentMatrixStage}
                          disabled={!focusArticle?.currentStageId}
                          title="Вкладка «Процесс», раскрыть матрицу и прокрутить к строке текущего этапа SKU"
                        >
                          <Crosshair className="h-3 w-3 shrink-0" aria-hidden />К этапу SKU
                        </Button>
                      </div>
                    </div>
                  </div>

                  {matrixPhaseOptions.length > 0 ? (
<<<<<<< HEAD
                    <div className="rounded-lg border border-slate-200/90 bg-white/80 px-2.5 py-2">
                      <p className="mb-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
=======
                    <div className="border-border-default/90 rounded-lg border bg-white/80 px-2.5 py-2">
                      <p className="text-text-muted mb-1.5 text-[8px] font-black uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                        Фазы каталога (фильтр в URL)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          type="button"
                          variant={!matrixPhaseParam ? 'secondary' : 'outline'}
                          size="sm"
                          className="h-7 px-2 text-[9px]"
                          onClick={() => setMatrixPhaseFilter(null)}
                        >
                          Все фазы
                        </Button>
                        {matrixPhaseOptions.map((ph) => {
                          const isFocusSkuPhase = Boolean(
                            focusSkuMatrixPhase && ph === focusSkuMatrixPhase
                          );
                          return (
                            <Button
                              key={ph}
                              type="button"
                              variant={matrixPhaseParam === ph ? 'default' : 'outline'}
                              size="sm"
                              className={cn(
                                'h-7 max-w-[min(100%,14rem)] truncate px-2 text-[9px]',
<<<<<<< HEAD
                                matrixPhaseParam === ph && 'bg-indigo-600 hover:bg-indigo-600',
=======
                                matrixPhaseParam === ph &&
                                  'bg-accent-primary hover:bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                                isFocusSkuPhase &&
                                  matrixPhaseParam !== ph &&
                                  'ring-2 ring-emerald-500/55 ring-offset-1 ring-offset-white'
                              )}
                              title={
                                isFocusSkuPhase && matrixPhaseParam !== ph
                                  ? `${ph} — фаза текущего этапа SKU в фокусе`
                                  : ph
                              }
                              onClick={() =>
                                setMatrixPhaseFilter(matrixPhaseParam === ph ? null : ph)
                              }
                            >
                              {ph}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {!focusArticle ? (
<<<<<<< HEAD
                    <p className="text-xs text-slate-500">
                      Нет артикула в фокусе — расширьте срез или выберите строку справа.
                    </p>
                  ) : viewArticles.length === 0 ? (
                    <p className="text-xs text-slate-500">
=======
                    <p className="text-text-secondary text-xs">
                      Нет артикула в фокусе — расширьте срез или выберите строку справа.
                    </p>
                  ) : viewArticles.length === 0 ? (
                    <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                      Этап выбранного SKU не совпадает с узлом схемы — снимите узел или выберите
                      другой артикул.
                    </p>
                  ) : (
                    <>
                      <div
                        className={cn(
<<<<<<< HEAD
                          'hidden items-center border-b border-slate-100 pb-2 text-[10px] font-bold text-slate-500 md:grid',
=======
                          'text-text-secondary border-border-subtle hidden items-center border-b pb-2 text-[10px] font-bold md:grid',
>>>>>>> recover/cabinet-wip-from-stash
                          MATRIX_GRID
                        )}
                      >
                        <span>Ось UI</span>
                        <span>Этап</span>
                        <span>Зона</span>
                        <span>Обяз.</span>
                        <span>Статус</span>
                        <span>По арт.</span>
<<<<<<< HEAD
                        <span className="flex items-center gap-1 font-semibold normal-case text-slate-600">
=======
                        <span className="text-text-secondary flex items-center gap-1 font-semibold normal-case">
>>>>>>> recover/cabinet-wip-from-stash
                          Связь
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
<<<<<<< HEAD
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
=======
                                className="text-text-muted hover:bg-bg-surface2 hover:text-text-primary inline-flex h-5 w-5 shrink-0 items-center justify-center rounded"
>>>>>>> recover/cabinet-wip-from-stash
                                aria-label="Легенда: чат, задачи, календарь, заметки"
                              >
                                <span className="text-[10px] font-bold leading-none">?</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
<<<<<<< HEAD
                              className="max-w-xs border border-slate-200 bg-white text-[10px] leading-snug text-slate-800"
=======
                              className="border-border-default text-text-primary max-w-xs border bg-white text-[10px] leading-snug"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              Иконки связи — сетка 2×2: чат и задачи сверху, календарь и заметки
                              снизу. Наведение на иконку — сводка только по этому каналу; клик —
                              переход в модуль.
                            </TooltipContent>
                          </Tooltip>
                        </span>
                        <span>Переходы и связи</span>
                      </div>
                      <div className="space-y-2">
                        {matrixStepsFiltered.length === 0 ? (
                          <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
                            Нет этапов по текущим фильтрам
                            {matrixPhaseParam ? <> (фаза «{matrixPhaseParam}»)</> : null}
                            {matrixStageFilterQ.trim() ? (
                              <> и запросу «{matrixStageFilterQ.trim()}»</>
                            ) : null}
                            . Нажмите «Сброс фильтра матрицы» или смените чип фазы.
                          </p>
                        ) : null}
                        {matrixStepsFiltered.map((step, stepIdx) => {
                          const prevPhase =
                            stepIdx > 0 ? matrixStepsFiltered[stepIdx - 1]?.phase : undefined;
                          const showPhaseHeader = Boolean(step.phase && step.phase !== prevPhase);
                          const s = aggregateStatus[step.id] ?? 'not_started';
                          const blocked = isBlocked(step);
                          const profileNa =
                            getProductionStageDisplayMode(step.id, productionProfileId) ===
                            'not_applicable';
                          const skuProgressLine = aggregateSkuProgressLine(
                            flowDoc,
                            effectiveSkuIds,
                            step.id
                          );
                          const icon =
                            s === 'done' ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : profileNa ? (
<<<<<<< HEAD
                              <MinusCircle className="h-4 w-4 text-slate-400" aria-hidden />
                            ) : blocked ? (
                              <Lock className="h-4 w-4 text-slate-400" />
=======
                              <MinusCircle className="text-text-muted h-4 w-4" aria-hidden />
                            ) : blocked ? (
                              <Lock className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                            ) : (
                              <CircleDot className="h-4 w-4 text-amber-500" />
                            );
                          const label = statusLabel(s, blocked, profileNa);
                          const statusColor = profileNa
<<<<<<< HEAD
                            ? 'text-slate-500'
                            : s === 'done'
                              ? 'text-emerald-700'
                              : blocked
                                ? 'text-slate-500'
                                : s === 'in_progress'
                                  ? 'text-amber-700'
                                  : 'text-slate-600';
=======
                            ? 'text-text-secondary'
                            : s === 'done'
                              ? 'text-emerald-700'
                              : blocked
                                ? 'text-text-secondary'
                                : s === 'in_progress'
                                  ? 'text-amber-700'
                                  : 'text-text-secondary';
>>>>>>> recover/cabinet-wip-from-stash

                          const commQuery = buildStagesCommLinkQuery(viewArticles, step.id);
                          const notesQuery = buildStagesNotesLinkQuery(viewArticles, step.id);
                          const linkRow = aggregateMatrixStepLinkRow(
                            viewArticles,
                            step.id,
                            steps,
                            flowDoc
                          );

                          return (
                            <Fragment key={step.id}>
                              {showPhaseHeader && step.phase ? (
<<<<<<< HEAD
                                <div className="rounded-lg border border-slate-200/80 bg-slate-100/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
=======
                                <div className="border-border-default/80 bg-bg-surface2/90 text-text-primary rounded-lg border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                                  {step.phase}
                                </div>
                              ) : null}
                              <div
                                id={`stages-matrix-row-${step.id}`}
                                title={
                                  profileNa
                                    ? 'Этап не относится к выбранному профилю контура (готовый товар / дропшип и т.д.)'
                                    : undefined
                                }
                                className={cn(
                                  MATRIX_GRID,
                                  'scroll-mt-4 items-start rounded-xl border p-2.5 sm:p-3',
<<<<<<< HEAD
                                  profileNa && 'border-dashed border-slate-200/95 bg-slate-50/75',
                                  focusArticle && step.id === focusArticle.currentStageId
                                    ? 'border-emerald-300/90 bg-emerald-50/35 ring-1 ring-emerald-400/40'
                                    : !profileNa && 'border-slate-100 bg-white/60'
                                )}
                              >
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 md:hidden">
=======
                                  profileNa &&
                                    'border-border-default/95 bg-bg-surface2/75 border-dashed',
                                  focusArticle && step.id === focusArticle.currentStageId
                                    ? 'border-emerald-300/90 bg-emerald-50/35 ring-1 ring-emerald-400/40'
                                    : !profileNa && 'border-border-subtle bg-white/60'
                                )}
                              >
                                <div className="space-y-1">
                                  <span className="text-text-muted text-[9px] font-bold uppercase tracking-wider md:hidden">
>>>>>>> recover/cabinet-wip-from-stash
                                    Ось UI
                                  </span>
                                  {step.productionFloorTab ? (
                                    <>
<<<<<<< HEAD
                                      <Badge className="border-indigo-200 bg-indigo-50 text-[8px] font-black uppercase tracking-wider text-indigo-800">
=======
                                      <Badge className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary text-[8px] font-black uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                                        Вкладка цеха
                                      </Badge>
                                      <button
                                        type="button"
                                        disabled={!focusArticle && !step.collectionScopedModuleNav}
<<<<<<< HEAD
                                        className="block w-full text-left text-[10px] font-bold leading-snug text-indigo-700 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
=======
                                        className="text-accent-primary block w-full text-left text-[10px] font-bold leading-snug hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
>>>>>>> recover/cabinet-wip-from-stash
                                        onClick={() => {
                                          const tab = step.productionFloorTab;
                                          if (!tab) return;
                                          if (step.collectionScopedModuleNav) {
                                            router.push(
                                              mergeCollectionQuery(floorHref(tab), collectionQuery)
                                            );
                                            return;
                                          }
                                          if (!focusArticle) return;
                                          router.push(mergeModuleHref(floorHref(tab), step.id));
                                        }}
                                      >
                                        {getProductionFloorTabTitle(step.productionFloorTab)}
                                      </button>
                                    </>
                                  ) : step.href ? (
                                    <>
                                      <Badge
                                        variant="outline"
<<<<<<< HEAD
                                        className="border-slate-200 text-[8px] font-black uppercase tracking-wider text-slate-600"
=======
                                        className="border-border-default text-text-secondary text-[8px] font-black uppercase tracking-wider"
>>>>>>> recover/cabinet-wip-from-stash
                                      >
                                        Вне цеха
                                      </Badge>
                                      <button
                                        type="button"
                                        disabled={!focusArticle && !step.collectionScopedModuleNav}
                                        title={
                                          step.collectionScopedModuleNav
                                            ? 'Открыть модуль этапа с контекстом коллекции (без SKU в URL)'
                                            : 'Открыть основной модуль этапа с тем же артикулом в URL'
                                        }
<<<<<<< HEAD
                                        className="block w-full text-left text-[10px] font-bold leading-snug text-indigo-700 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
=======
                                        className="text-accent-primary block w-full text-left text-[10px] font-bold leading-snug hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
>>>>>>> recover/cabinet-wip-from-stash
                                        onClick={() => {
                                          if (step.collectionScopedModuleNav && step.href) {
                                            router.push(
                                              mergeCollectionQuery(step.href, collectionQuery)
                                            );
                                            return;
                                          }
                                          if (!focusArticle) return;
                                          router.push(mergeModuleHref(step.href!, step.id));
                                        }}
                                      >
                                        {step.externalAxisLabel ?? 'Модуль этапа'}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <Badge
                                        variant="outline"
<<<<<<< HEAD
                                        className="border-slate-200 text-[8px] font-black uppercase tracking-wider text-slate-600"
                                      >
                                        Вне цеха
                                      </Badge>
                                      <span className="block text-[10px] leading-snug text-slate-500">
=======
                                        className="border-border-default text-text-secondary text-[8px] font-black uppercase tracking-wider"
                                      >
                                        Вне цеха
                                      </Badge>
                                      <span className="text-text-secondary block text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                                        Ссылка в каталоге не задана
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="space-y-0.5">
<<<<<<< HEAD
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 md:hidden">
=======
                                  <span className="text-text-muted text-[9px] font-bold uppercase tracking-wider md:hidden">
>>>>>>> recover/cabinet-wip-from-stash
                                    Этап
                                  </span>
                                  <div className="flex flex-wrap items-start gap-1.5">
                                    {icon}
<<<<<<< HEAD
                                    <span className="min-w-0 text-[11px] font-semibold leading-snug text-slate-900">
=======
                                    <span className="text-text-primary min-w-0 text-[11px] font-semibold leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                                      {step.title}
                                    </span>
                                    {profileNa ? (
                                      <Badge
                                        variant="outline"
<<<<<<< HEAD
                                        className="h-5 shrink-0 border-dashed px-1 text-[7px] text-slate-500"
=======
                                        className="text-text-secondary h-5 shrink-0 border-dashed px-1 text-[7px]"
>>>>>>> recover/cabinet-wip-from-stash
                                      >
                                        вне профиля
                                      </Badge>
                                    ) : null}
                                  </div>
<<<<<<< HEAD
                                  <p className="line-clamp-3 text-[10px] leading-snug text-slate-600">
                                    {step.description}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-600 md:justify-start">
                                  <span className="text-[9px] font-bold uppercase text-slate-400 md:hidden">
                                    Зона
                                  </span>
                                  <Badge variant="outline" className="border-slate-200 text-[9px]">
=======
                                  <p className="text-text-secondary line-clamp-3 text-[10px] leading-snug">
                                    {step.description}
                                  </p>
                                </div>
                                <div className="text-text-secondary flex items-center justify-between text-[10px] md:justify-start">
                                  <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                                    Зона
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="border-border-default text-[9px]"
                                  >
>>>>>>> recover/cabinet-wip-from-stash
                                    {step.area}
                                  </Badge>
                                </div>
                                <div className="flex flex-col justify-between gap-0.5 text-[10px] md:justify-start">
<<<<<<< HEAD
                                  <span className="text-[9px] font-bold uppercase text-slate-400 md:hidden">
=======
                                  <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
>>>>>>> recover/cabinet-wip-from-stash
                                    Обяз.
                                  </span>
                                  <span
                                    className={cn(
                                      'shrink-0 font-semibold',
<<<<<<< HEAD
                                      step.mandatory ? 'text-rose-600' : 'text-slate-500'
=======
                                      step.mandatory ? 'text-rose-600' : 'text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                                    )}
                                  >
                                    {step.mandatory ? 'Да' : 'Нет'}
                                  </span>
                                  {!step.mandatory || step.canSkipForNow ? (
<<<<<<< HEAD
                                    <p className="max-w-[11rem] text-[8px] leading-tight text-slate-500">
=======
                                    <p className="text-text-secondary max-w-[11rem] text-[8px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                      {!step.mandatory
                                        ? 'Необязателен в каталоге — статус можно отложить.'
                                        : 'К закрытию обязателен; отметку в матрице можно позже.'}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="space-y-1">
<<<<<<< HEAD
                                  <span className="text-[9px] font-bold uppercase text-slate-400 md:hidden">
=======
                                  <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
>>>>>>> recover/cabinet-wip-from-stash
                                    Статус
                                  </span>
                                  <span
                                    className={cn(
                                      'flex items-center gap-1 text-[10px] font-semibold',
                                      statusColor
                                    )}
                                  >
                                    {label}
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-[9px]"
                                      disabled={blocked || profileNa}
                                      title={
                                        profileNa
                                          ? 'Этап вне профиля — массовые статусы отключены'
                                          : undefined
                                      }
                                      onClick={() => markStatus(step.id, 'in_progress')}
                                    >
                                      В работе
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-6 px-2 text-[9px]"
                                      disabled={blocked || profileNa}
                                      title={
                                        profileNa
                                          ? 'Этап вне профиля — массовые статусы отключены'
                                          : undefined
                                      }
                                      onClick={() => markStatus(step.id, 'done')}
                                    >
                                      Готово
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
<<<<<<< HEAD
                                      className="h-6 px-2 text-[9px] text-slate-400"
=======
                                      className="text-text-muted h-6 px-2 text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                                      onClick={() => markStatus(step.id, 'not_started')}
                                    >
                                      Сброс
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-col items-start gap-1">
<<<<<<< HEAD
                                  <span className="text-[9px] font-bold uppercase text-slate-400 md:hidden">
                                    По арт.
                                  </span>
                                  <span className="text-[9px] font-semibold text-slate-700">
=======
                                  <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
                                    По арт.
                                  </span>
                                  <span className="text-text-primary text-[9px] font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
                                    {skuProgressLine}
                                  </span>
                                  {focusArticle ? (
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="sm"
                                      className="h-6 px-2 text-[9px] font-semibold"
                                      title="Чеклист этапа, люди, затраты, выходы — сохранение в localStorage"
                                      onClick={() => openSkuPanelForStep(focusArticle.id, step.id)}
                                    >
                                      Панель данных
                                    </Button>
                                  ) : null}
                                </div>
                                <div className="flex flex-col gap-1.5">
<<<<<<< HEAD
                                  <span className="text-[9px] font-bold uppercase text-slate-400 md:hidden">
=======
                                  <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
>>>>>>> recover/cabinet-wip-from-stash
                                    Связь
                                  </span>
                                  <MatrixLinkStrip
                                    row={linkRow}
                                    commQuery={commQuery}
                                    notesQuery={notesQuery}
                                    mergeCollectionQuery={mergeCollectionQuery}
                                    collectionQuery={collectionQuery}
                                  />
                                </div>
                                <div className="flex flex-col items-start gap-2">
<<<<<<< HEAD
                                  <span className="text-[9px] font-bold uppercase text-slate-400 md:hidden">
=======
                                  <span className="text-text-muted text-[9px] font-bold uppercase md:hidden">
>>>>>>> recover/cabinet-wip-from-stash
                                    Переходы
                                  </span>
                                  {step.href ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-7 px-2 text-[9px]"
                                      disabled={!focusArticle && !step.collectionScopedModuleNav}
                                      title={
                                        step.collectionScopedModuleNav
                                          ? 'Модуль этапа коллекции: collectionId в URL, без stagesSku'
                                          : 'Тот же переход, что по клику в колонке «Ось UI» — с контекстом коллекции и SKU'
                                      }
                                      onClick={() =>
                                        navigateToStageModule(
                                          step,
                                          mergeCollectionQuery(step.href!, collectionQuery)
                                        )
                                      }
                                    >
                                      В модуль
                                      <ArrowRight className="ml-1 inline h-3 w-3" />
                                    </Button>
                                  ) : (
<<<<<<< HEAD
                                    <span className="text-[10px] text-slate-400">
=======
                                    <span className="text-text-muted text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                                      Без основной ссылки
                                    </span>
                                  )}
                                  {step.crossLinks && step.crossLinks.length > 0 ? (
<<<<<<< HEAD
                                    <div className="max-h-28 w-full space-y-1 overflow-y-auto border-t border-slate-100 pt-2">
                                      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
=======
                                    <div className="border-border-subtle max-h-28 w-full space-y-1 overflow-y-auto border-t pt-2">
                                      <p className="text-text-muted text-[8px] font-black uppercase tracking-wider">
>>>>>>> recover/cabinet-wip-from-stash
                                        Связи
                                      </p>
                                      <div className="flex flex-col gap-1 pr-0.5">
                                        {step.crossLinks.map((cl) => (
                                          <button
                                            key={`${step.id}-${cl.label}-${cl.href}`}
                                            type="button"
                                            disabled={
                                              !focusArticle && !step.collectionScopedModuleNav
                                            }
<<<<<<< HEAD
                                            className="text-left text-[9px] font-medium text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
=======
                                            className="text-accent-primary text-left text-[9px] font-medium hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
>>>>>>> recover/cabinet-wip-from-stash
                                            onClick={() =>
                                              navigateToStageModule(
                                                step,
                                                mergeCollectionQuery(cl.href, collectionQuery)
                                              )
                                            }
                                          >
                                            {cl.label} →
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              ) : null}
            </Card>
          </TabsContent>

          <TabsContent value="sku" className="mt-4 space-y-4 focus-visible:outline-none">
<<<<<<< HEAD
            <Card className="border-indigo-100 bg-indigo-50/20">
=======
            <Card className="border-accent-primary/20 bg-accent-primary/10">
>>>>>>> recover/cabinet-wip-from-stash
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <CardTitle className="text-sm uppercase tracking-tight">
                      По артикулам: процесс, ответственные, затраты, выходы
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Один SKU из пула среза; в URL — <code className="text-[10px]">stagesSku</code>
                      .
                    </CardDescription>
                  </div>
                  <StagesCollapsePinBar
                    pinned={skuPanelPinned}
                    onPinnedChange={setSkuPanelPinned}
                    open={skuPanelOpen}
                    onOpenChange={setSkuPanelOpen}
                    collapseAriaLabel="Свернуть или развернуть блок «По артикулам»"
                  />
<<<<<<< HEAD
                  <div className="flex h-8 shrink-0 items-center border-l border-slate-200 pl-2">
=======
                  <div className="border-border-default flex h-8 shrink-0 items-center border-l pl-2">
>>>>>>> recover/cabinet-wip-from-stash
                    <StagesHelpHover
                      align="end"
                      wide
                      title="По артикулам"
                      trigger={
                        <StagesHelpIconTrigger aria-label="Справка: вкладка по артикулам, окно этапа и модуль цеха" />
                      }
                    >
                      <StagesHelpWhyBlock title="Две кнопки в колонке">
                        <p>
<<<<<<< HEAD
                          <strong className="text-slate-800">Панель этапа</strong> — окно: чеклист
                          обязательно/дополнительно, под ним форма выбранной строки (редактирование)
                          и отдельно «Журнал». <strong className="text-slate-800">Таб этапа</strong>{' '}
                          — переход во вкладку цеха или внешний модуль с контекстом коллекции (если
                          маршрут задан в каталоге).
=======
                          <strong className="text-text-primary">Панель этапа</strong> — окно:
                          чеклист обязательно/дополнительно, под ним форма выбранной строки
                          (редактирование) и отдельно «Журнал».{' '}
                          <strong className="text-text-primary">Таб этапа</strong> — переход во
                          вкладку цеха или внешний модуль с контекстом коллекции (если маршрут задан
                          в каталоге).
>>>>>>> recover/cabinet-wip-from-stash
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Зачем">
                        <p>
                          По одному артикулу: проверить и поправить всё по каждому этапу в одном
                          месте — не только перейти в модуль, но и увидеть заполненное и пустое,
                          историю правок и зафиксировать запрос ответственному.
                        </p>
                      </StagesHelpWhyBlock>
                      <StagesHelpWhyBlock title="Как связано с матрицей">
                        <p>
<<<<<<< HEAD
                          Тот же <code className="rounded bg-slate-100 px-1">stagesSku</code>, что и
                          на «Процесс и правила»; матрица — сводка, здесь — доска этапов с панелью и
                          табом этапа.
=======
                          Тот же <code className="bg-bg-surface2 rounded px-1">stagesSku</code>, что
                          и на «Процесс и правила»; матрица — сводка, здесь — доска этапов с панелью
                          и табом этапа.
>>>>>>> recover/cabinet-wip-from-stash
                        </p>
                      </StagesHelpWhyBlock>
                    </StagesHelpHover>
                  </div>
                </div>
              </CardHeader>
              {skuPanelExpanded ? (
                <CardContent className="space-y-4">
                  {poolArticles.length > 0 ? (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
<<<<<<< HEAD
                        <span className="shrink-0 text-[10px] font-bold uppercase text-slate-500">
=======
                        <span className="text-text-secondary shrink-0 text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Артикул
                        </span>
                        <Select
                          value={resolvedFocusId}
                          onValueChange={(id) => setFocusSku(id, { preserveChain: true })}
                        >
                          <SelectTrigger className="h-9 max-w-xl text-xs">
                            <SelectValue placeholder="Выберите артикул" />
                          </SelectTrigger>
                          <SelectContent>
                            {skuSelectArticles.map((a) => (
                              <SelectItem key={a.id} value={a.id} className="text-xs">
                                {stagesArticleDisplayLabel(a.sku, a.season)}
                                {a.categoryPathLabel ? ` · ${a.categoryPathLabel}` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {focusArticle ? (
<<<<<<< HEAD
                        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200/90 bg-white/80 px-2 py-2">
                          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-slate-400">
=======
                        <div className="border-border-default/90 flex flex-wrap items-center gap-2 rounded-lg border bg-white/80 px-2 py-2">
                          <span className="text-text-muted shrink-0 text-[9px] font-bold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
                            Связь экранов
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-[9px]"
                            title="Вкладка «Оперативка»: доска этапов"
                            onClick={() => setSubTab('ops')}
                          >
                            <LayoutGrid className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                            Доска
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-[9px]"
                            title="Вкладка «Процесс»: схема зависимостей и матрица"
                            onClick={() => setSubTab('process')}
                          >
                            <ListTree className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                            Схема и матрица
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-8 gap-1 text-[9px]"
                            title="Переключить на «Процесс», раскрыть матрицу и прокрутить к этапу"
                            onClick={() => jumpToMatrixRow(focusArticle.currentStageId)}
                          >
                            <Crosshair className="h-3 w-3 shrink-0" aria-hidden />К этапу в матрице
                          </Button>
                        </div>
                      ) : null}
                      {focusArticle ? (
                        <SkuProcessDetailPanel
                          skuId={resolvedFocusId}
                          skuLabel={stagesArticleDisplayLabel(
                            focusArticle.sku,
                            focusArticle.season
                          )}
                          currentStageId={focusArticle.currentStageId}
                          doc={flowDoc}
                          steps={steps}
                          onPatch={(stepId, patch) =>
                            patchSkuStageLocal(resolvedFocusId, stepId, patch)
                          }
                          onAppendAuditLine={(stepId, line) =>
                            appendSkuAuditLineLocal(resolvedFocusId, stepId, line)
                          }
                          mergeModuleHref={mergeModuleHref}
                          floorHref={floorHref}
                          mergeCollectionQuery={mergeCollectionQuery}
                          collectionQuery={collectionQuery}
                          collectionFlowKey={collectionFlowKey}
                          pendingOpenPanelStepId={stagesSkuPanelParam || null}
                          pendingOpenPanelTab={stagesSkuPanelTabParsed}
                          onConsumedOpenPanelRequest={consumePendingSkuPanel}
                        />
                      ) : null}
                    </>
                  ) : collectionArticles.length === 0 ? (
<<<<<<< HEAD
                    <p className="text-xs text-slate-500">
=======
                    <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                      В этой коллекции пока нет артикулов — нажмите «Коллекция и данные» (справа у
                      профиля контура), добавьте SKU или переключите коллекцию.
                    </p>
                  ) : (
                    <div className="space-y-2">
<<<<<<< HEAD
                      <p className="text-xs leading-relaxed text-slate-600">
=======
                      <p className="text-text-secondary text-xs leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                        В коллекции <strong>{collectionArticles.length}</strong> SKU, но в{' '}
                        <strong>текущем срезе</strong> (фильтры слева и узел схемы) ни одного не
                        осталось.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-[10px]"
                        onClick={clearAllFacets}
                      >
                        Сбросить фильтры среза
                      </Button>
                    </div>
                  )}
                </CardContent>
              ) : null}
            </Card>
          </TabsContent>
        </Tabs>
        {depsInfoStep && typeof document !== 'undefined'
          ? createPortal(
              <div
                className="fixed inset-0 z-[600] flex items-end justify-center bg-black/40 p-4 sm:items-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="deps-node-info-title"
                onClick={() => setDepsNodeInfoStepId(null)}
              >
                <div
<<<<<<< HEAD
                  className="max-h-[min(85vh,32rem)] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl"
=======
                  className="border-border-default text-text-primary max-h-[min(85vh,32rem)] w-full max-w-md overflow-y-auto rounded-xl border bg-white p-4 shadow-xl"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p id="deps-node-info-title" className="text-sm font-semibold leading-tight">
                        {depsInfoStep.title}
                      </p>
<<<<<<< HEAD
                      <p className="mt-1 text-[10px] text-slate-500">
=======
                      <p className="text-text-secondary mt-1 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        В перечне на этом этапе: {depsInfoArticles.length} SKU
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 text-[10px]"
                      onClick={() => setDepsNodeInfoStepId(null)}
                    >
                      Закрыть
                    </Button>
                  </div>
                  {depsInfoArticles.length === 0 ? (
<<<<<<< HEAD
                    <p className="text-[10px] leading-snug text-slate-600">
=======
                    <p className="text-text-secondary text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
                      На этом узле нет артикулов текущего перечня — сначала завершите
                      предшественников в матрице (статусы) или расширьте срез. Тогда здесь появятся
                      SKU и пошаговые подсказки.
                    </p>
                  ) : (
<<<<<<< HEAD
                    <ul className="space-y-2 border-t border-slate-100 pt-3">
=======
                    <ul className="border-border-subtle space-y-2 border-t pt-3">
>>>>>>> recover/cabinet-wip-from-stash
                      {depsInfoArticles.map((a) => {
                        const label = stagesArticleDisplayLabel(a.sku, a.season);
                        const hint = hintTextForArticleNextCatalogStep(
                          flowDoc,
                          steps,
                          a,
                          label,
                          productionProfileId
                        );
                        return (
                          <li
                            key={a.id}
<<<<<<< HEAD
                            className="border-b border-slate-100/80 pb-2 text-[10px] last:border-0 last:pb-0"
                          >
                            <p className="font-semibold text-slate-800">{label}</p>
                            <p className="mt-1 leading-snug text-slate-600">{hint}</p>
=======
                            className="border-border-subtle/80 border-b pb-2 text-[10px] last:border-0 last:pb-0"
                          >
                            <p className="text-text-primary font-semibold">{label}</p>
                            <p className="text-text-secondary mt-1 leading-snug">{hint}</p>
>>>>>>> recover/cabinet-wip-from-stash
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {focusArticle && depsInfoStep ? (
<<<<<<< HEAD
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
=======
                    <div className="border-border-subtle mt-3 flex flex-wrap gap-2 border-t pt-3">
>>>>>>> recover/cabinet-wip-from-stash
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 text-[10px]"
                        onClick={() => {
                          jumpToMatrixRow(depsInfoStep.id);
                          setDepsNodeInfoStepId(null);
                        }}
                      >
                        <Crosshair className="mr-1 inline h-3 w-3" aria-hidden />
                        Строка в матрице
                      </Button>
                      {depsInfoStep.productionFloorTab || depsInfoStep.href ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-[10px]"
                          onClick={() => {
                            const href = depsInfoStep.productionFloorTab
                              ? mergeCollectionQuery(
                                  floorHref(depsInfoStep.productionFloorTab),
                                  collectionQuery
                                )
                              : mergeCollectionQuery(depsInfoStep.href!, collectionQuery);
                            navigateToStageModule(depsInfoStep, href);
                            setDepsNodeInfoStepId(null);
                          }}
                        >
                          В модуль этапа
                          <ArrowRight className="ml-1 inline h-3 w-3" aria-hidden />
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[10px]"
                        onClick={() => openSkuPanelForStep(focusArticle.id, depsInfoStep.id)}
                      >
                        Панель данных SKU
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>,
              document.body
            )
          : null}
      </div>
    </TooltipProvider>
  );
}

/** Для индикатора на TabsTrigger «Этапы и зависимости» */
export function stagesTabHasActiveFilters(
  params: Pick<URLSearchParams, 'get'> | null | undefined
): boolean {
  if (!params) return false;
  if (params.get('stagesAudience')) return true;
  if (params.get('stagesSeason')) return true;
  if (params.get('stagesL1')) return true;
  if (params.get('stagesL2')) return true;
  if (params.get('stagesL3')) return true;
  if (params.get('stagesFab')) return true;
  if (params.get('stagesChainFocus')) return true;
  if (params.get(STAGES_MATRIX_PHASE_PARAM)) return true;
  if (params.get(STAGES_MATRIX_Q_PARAM)?.trim()) return true;
  return false;
}
