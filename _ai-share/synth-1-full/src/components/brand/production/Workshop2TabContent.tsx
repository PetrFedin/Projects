'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  CircleAlert,
  ClipboardList,
  FileText,
  History,
  MessageSquare,
  Paperclip,
  Pencil,
  Pin,
  Plus,
  Search,
  SquareSplitHorizontal,
  Trash2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EmptyState, FilterToolbar, PageHeader } from '@/components/design-system';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import {
  WORKSHOP2_PIPELINE_STEP_IDS,
  type Workshop2RunStatus,
} from '@/lib/production/workshop2-collection-metrics';
import {
  aggregateSkuDoneCount,
  getSkuCurrentProcessStepId,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';
import { deriveStagesArticleFacets } from '@/lib/production/stages-tab-facets';

/** Все этапы not_started → можно удалить черновик; иначе — в работе (done / in_progress / …). */
function workshop2ArticleStageBucket(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepIds: readonly string[]
): 'not_started' | 'in_flight' {
  const entry = doc.skus[skuId];
  for (const sid of stepIds) {
    const st = entry?.stages[sid]?.status ?? 'not_started';
    if (st !== 'not_started') return 'in_flight';
  }
  return 'not_started';
}

function parseWorkshop2BulkPaste(raw: string): { sku: string; name?: string }[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const out: { sku: string; name?: string }[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    let parts: string[];
    if (line.includes('\t')) parts = line.split('\t');
    else if (line.includes(';')) parts = line.split(';');
    else if (line.includes(',')) parts = line.split(',');
    else parts = [line];
    const skuRaw = parts[0]?.trim().replace(/^["']|["']$/g, '') ?? '';
    if (!skuRaw) continue;
    if (i === 0 && /^sku$/i.test(skuRaw)) continue;
    const nameExtra =
      parts
        .slice(1)
        .map((p) => p.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
        .join(' · ') || undefined;
    const norm = normalizeLocalSkuCode(skuRaw) || skuRaw.toUpperCase().replace(/\s+/g, '-');
    const dedupKey = norm.toLowerCase();
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);
    out.push({ sku: norm, ...(nameExtra ? { name: nameExtra } : {}) });
  }
  return out;
}

function formatWorkshop2ArticleRowDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function workshop2ArticleDeletable(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepIds: readonly string[],
  prog: { done: number }
): boolean {
  if (prog.done > 0) return false;
  if (!doc.skus[skuId]) return true;
  return workshop2ArticleStageBucket(doc, skuId, stepIds) === 'not_started';
}

function Workshop2ArticleDateFlip({
  addedAtIso,
  updatedAtIso,
}: {
  addedAtIso?: string;
  updatedAtIso?: string;
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const canFlip =
      addedAtIso &&
      updatedAtIso &&
      updatedAtIso !== addedAtIso &&
      updatedAtIso.localeCompare(addedAtIso) > 0;
    if (!canFlip) return;
    const id = window.setInterval(() => setPhase((p) => p + 1), 30_000);
    return () => clearInterval(id);
  }, [addedAtIso, updatedAtIso]);

  if (!addedAtIso) {
    return <span className="text-[9px] text-slate-400">Нет даты в Цехе 2</span>;
  }
  const canFlip =
    updatedAtIso && updatedAtIso !== addedAtIso && updatedAtIso.localeCompare(addedAtIso) > 0;
  const showUpdated = canFlip && phase % 2 === 1;
  if (showUpdated && updatedAtIso) {
    return (
      <span className="block text-[9px] leading-tight text-slate-600">
        <span className="text-slate-400">Изменён</span>
        <span className="block font-medium tabular-nums text-slate-700">
          {formatWorkshop2ArticleRowDateTime(updatedAtIso)}
        </span>
      </span>
    );
  }
  return (
    <span className="block text-[9px] leading-tight text-slate-600">
      <span className="text-slate-400">Добавлен</span>
      <span className="block font-medium tabular-nums text-slate-700">
        {formatWorkshop2ArticleRowDateTime(addedAtIso)}
      </span>
    </span>
  );
}

function isoToDatetimeLocalValue(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function filterWorkshop2CollectionsForGrid(
  cols: Workshop2CollectionListItem[],
  selectedCollectionIds: ReadonlySet<string>,
  selectedSkus: ReadonlySet<string>
): Workshop2CollectionListItem[] {
  return cols.filter((col) => {
    if (selectedCollectionIds.size > 0 && !selectedCollectionIds.has(col.id)) {
      return false;
    }
    if (selectedSkus.size > 0) {
      const skuSet = new Set(
        col.articleRows.map((r) => normalizeLocalSkuCode(r.sku) || r.sku.trim()).filter(Boolean)
      );
      let hit = false;
      for (const s of selectedSkus) {
        if (skuSet.has(s)) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }
    return true;
  });
}

function runGlobalWorkshop2Search(
  query: string,
  collections: Workshop2CollectionListItem[]
): { collectionId: string; collectionName: string; field: string; snippet: string }[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: { collectionId: string; collectionName: string; field: string; snippet: string }[] =
    [];
  const push = (collectionId: string, collectionName: string, field: string, snippet: string) => {
    out.push({ collectionId, collectionName, field, snippet });
  };
  for (const col of collections) {
    if (col.displayName.toLowerCase().includes(q)) {
      push(col.id, col.displayName, 'Название коллекции', col.displayName);
    }
    if (col.id.toLowerCase().includes(q)) {
      push(col.id, col.displayName, 'Код коллекции', col.id);
    }
    for (const row of col.articleRows) {
      if (row.sku.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'SKU', row.sku);
      }
      if (row.name.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'Название артикула', row.name);
      }
      if (row.commentPreview?.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'Комментарий', row.commentPreview ?? '');
      }
      if (row.audienceLabel.toLowerCase().includes(q)) {
        push(col.id, col.displayName, 'Аудитория', row.audienceLabel);
      }
      if (
        row.internalArticleCode &&
        typeof row.internalArticleCode === 'string' &&
        row.internalArticleCode.toLowerCase().includes(q)
      ) {
        push(col.id, col.displayName, 'Внутр. артикул', row.internalArticleCode);
      }
    }
  }
  const seen = new Set<string>();
  return out.filter((r) => {
    const k = `${r.collectionId}|${r.field}|${r.snippet}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

import {
  WORKSHOP2_ART_PARAM,
  WORKSHOP2_COL_PARAM,
  WORKSHOP2_STEP_PARAM,
  WORKSHOP2_TAB_PARAM,
  workshop2ArticlePath,
  workshop2ArticleUrlSegment,
} from '@/lib/production/workshop2-url';
import {
  appendWorkshop2Activity,
  clearWorkshop2Activity,
  loadWorkshop2Activity,
} from '@/lib/production/workshop2-activity-log';
import {
  isWorkshop2InternalArticleCodeValid,
  normalizeLocalSkuCode,
  type LocalOrderLine,
  type UserCollectionRow,
  type Workshop2ArticleCommit,
  type Workshop2ArticleLinePatch,
  type Workshop2Ss27MetaPatch,
  type Workshop2UserCollectionUpdate,
} from '@/lib/production/local-collection-inventory';
import {
  Workshop2CreateArticleDialog,
  type Workshop2EditArticlePayload,
} from '@/components/brand/production/Workshop2CreateArticleDialog';
import { findHandbookLeafById, getHandbookCategoryLeaves } from '@/lib/production/category-catalog';
import type { Workshop2TzSignatoryBindings } from '@/lib/production/workshop2-dossier-phase1.types';
import { loadWorkshop2Phase1DossierMap } from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  summarizeCollectionDossierRollup,
  type CollectionDossierRollup,
} from '@/lib/production/workshop2-collection-dossier-analytics';
import { useToast } from '@/hooks/use-toast';

export type Workshop2ArticleRow = {
  id: string;
  /** Внутренний 6-значный номер (100000+), см. local-collection-inventory. */
  internalArticleCode?: string;
  sku: string;
  name: string;
  audienceLabel: string;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  season: string;
  articleOrigin?: 'new' | 'base';
  attachmentCount?: number;
  commentPreview?: string;
  /** Полный текст комментария (workshopComment). */
  workshopComment?: string;
  /** ISO добавления в Цех 2 (для сортировки). */
  addedAtIso?: string;
  /** ISO последнего изменения в Цех 2 (после смены состава и т.п.). */
  updatedAtIso?: string;
  /** Кто добавил строку в Цех 2 (если есть). */
  createdInWorkshop2By?: string;
  /** Первое изображение из вложений строки (data URL) — для превью в фильтрах. */
  articleThumbDataUrl?: string;
  /** Лист справочника категорий (для формы редактирования). */
  categoryLeafId?: string;
  workshopAttachments?: { name: string; dataUrl: string }[];
  /** Подписанты ТЗ с строки инвентаря (как при создании артикула). */
  workshopTzSignatoryBindings?: Workshop2TzSignatoryBindings;
};

export type Workshop2CreateMeta = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
};

export type Workshop2CollectionMetrics = {
  status: Workshop2RunStatus;
  progressPct: number;
  articleCount: number;
};

export type Workshop2CollectionListItem = {
  id: string;
  displayName: string;
  articleRows: Workshop2ArticleRow[];
  kind: 'ss27' | 'user';
  /** Data URL обложки из localStorage. */
  coverDataUrl?: string;
  /** Блоки даты/времени на карточке (без обрезки многоточием). */
  cardTimestamps?: {
    createdCaption: string;
    createdValue: string;
    updatedCaption?: string;
    updatedValue?: string;
  };
  /** Гвоздик: закреплена вверху списка активных. */
  pinned: boolean;
  /** Цвет метки панели артикулов (пользовательские коллекции). */
  panelAccentHex?: string;
  /** Описание коллекции (пользовательские). */
  description?: string;
  /** Заметка для команды (пользовательские). */
  teamNote?: string;
  /** Для SS27: доп. поля из workshop2Ss27Meta (форма редактирования карточки). */
  targetSeason?: string;
  targetChannel?: string;
  dropDeadlineIso?: string;
};

const READINESS_HELP =
  'Показатель заполнения этапов по подборке: число завершённых пар «артикул × этап» (done/skipped) к общему числу таких пар. Диапазон 0–100%.';

/** Подсказки для поля «Канал»; можно ввести любой свой текст. */
const WORKSHOP2_TARGET_CHANNEL_SUGGESTIONS = [
  'Retail',
  'E-com / D2C',
  'Опт',
  'Маркетплейсы',
  'Showroom',
  'B2B',
] as const;

const WORKSHOP2_AUDIENCE_FILTER_TITLE =
  'Аудитория: сегмент из справочника CATEGORY_HANDBOOK (как у артикула на вкладке «Этапы»).';
const WORKSHOP2_CAT_L1_FILTER_TITLE =
  'Уровень 1: первая ветка категории под выбранной аудиторией (aud.categories в справочнике).';
const WORKSHOP2_CAT_L2_FILTER_TITLE = 'Уровень 2: следующий уровень ветки категории.';
const WORKSHOP2_CAT_L3_FILTER_TITLE =
  'Уровень 3: подкатегория / терминальный уровень ветки перед листом справочника.';

const COLLECTION_STEP_BY_ID = new Map(COLLECTION_STEPS.map((s) => [s.id, s] as const));

function collectionCoverMonogram(id: string): string {
  const alnum = id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return alnum.slice(0, 2) || '—';
}

function ArticleFacetsInline({ row }: { row: Workshop2ArticleRow }) {
  const sep = (
    <span className="mx-1.5 shrink-0 text-slate-300" aria-hidden>
      ·
    </span>
  );
  return (
    <div className="w-full max-w-full overflow-x-auto text-[10px] text-slate-600 [scrollbar-width:thin]">
      <p className="inline-block min-w-0 whitespace-nowrap">
        <span>Аудитория: {row.audienceLabel}</span>
        {sep}
        <span>Ур. 1: {row.categoryL1}</span>
        {sep}
        <span>Ур. 2: {row.categoryL2}</span>
        {sep}
        <span>Ур. 3: {row.categoryL3}</span>
        {sep}
        <span className="font-semibold text-slate-800">Сезон: {row.season}</span>
      </p>
    </div>
  );
}

function workshop2StatusBadgeClass(s: Workshop2RunStatus): string {
  if (s === 'draft') return 'border-slate-200 text-slate-600 bg-slate-50/80';
  if (s === 'completed') return 'border-emerald-200 text-emerald-800 bg-emerald-50/80';
  return 'border-amber-200 text-amber-800 bg-amber-50/50';
}

function workshop2StatusLabel(s: Workshop2RunStatus): string {
  if (s === 'draft') return 'Черновик';
  if (s === 'completed') return 'Завершена';
  return 'В работе';
}

/** После HMR или старого кода в state может быть строка вместо Set — приводим к Set. */
function ensureFacetSelectionSet(v: unknown): Set<string> {
  if (v instanceof Set) return new Set(v);
  if (Array.isArray(v)) return new Set(v.map((x) => String(x)));
  if (typeof v === 'string' && v.trim() && v !== '__all__') return new Set([v.trim()]);
  return new Set();
}

/** Мультивыбор значения фасета: пустой набор = «все»; иначе строка проходит, если её значение в наборе (OR внутри фасета). */
function Workshop2ArticleFacetPopover({
  label,
  title,
  options,
  selected,
  onSelectedChange,
  triggerId,
}: {
  label: string;
  title: string;
  options: string[];
  selected: ReadonlySet<string> | unknown;
  onSelectedChange: (next: Set<string>) => void;
  triggerId: string;
}) {
  const [open, setOpen] = useState(false);
  const sel = ensureFacetSelectionSet(selected);
  const summary = sel.size === 0 ? 'Все' : sel.size === 1 ? [...sel][0]! : `Выбрано: ${sel.size}`;

  const toggle = (opt: string) => {
    const n = new Set(sel);
    if (n.has(opt)) n.delete(opt);
    else n.add(opt);
    onSelectedChange(n);
  };

  return (
    <div className="flex shrink-0 flex-col gap-0.5">
      <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id={triggerId}
            className="h-9 w-[6.75rem] max-w-[10rem] justify-between gap-1 px-1.5 text-left text-[10px] font-semibold text-slate-700 sm:w-[7.75rem]"
            title={title}
          >
            <span className="truncate">{summary}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(100vw-2rem,18rem)] p-0" align="start">
          <div className="max-h-64 space-y-1 overflow-y-auto p-2">
            {options.length === 0 ? (
              <p className="px-2 py-2 text-[11px] text-slate-500">Нет значений.</p>
            ) : (
              options.map((o, idx) => {
                const checkId = `${triggerId}-opt-${idx}`;
                return (
                  <label
                    key={o}
                    className="flex cursor-pointer items-start gap-2 rounded-md py-1.5 pl-1 pr-2 hover:bg-slate-50"
                  >
                    <Checkbox
                      id={checkId}
                      checked={sel.has(o)}
                      onCheckedChange={() => toggle(o)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="min-w-0 text-[11px] leading-snug text-slate-800">{o}</span>
                  </label>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

type Props = {
  /** Базовый путь без query, напр. `/brand/production/workshop2`. */
  basePath: string;
  activeCollections: Workshop2CollectionListItem[];
  archivedCollections: Workshop2CollectionListItem[];
  metricsByCollectionId: Record<string, Workshop2CollectionMetrics>;
  getArticlePipelineProgress: (
    collectionId: string,
    articleId: string
  ) => { done: number; total: number; pct: number };
  getSkuFlowDoc: (collectionId: string) => CollectionSkuFlowDoc;
  onCreateCollection: (
    rawId: string,
    displayName: string,
    opts: {
      description?: string;
      createdBy: string;
      coverDataUrl?: string;
      targetSeason?: string;
      targetChannel?: string;
      dropDeadlineIso?: string;
      teamNote?: string;
      panelAccentHex?: string;
    }
  ) => Workshop2CreateMeta;
  onArchiveCollection: (collectionId: string) => void;
  onRestoreCollection: (collectionId: string) => void;
  /** Вкл/выкл гвоздик: вкл — первая в списке; выкл — позиция без изменений. */
  onToggleCollectionPin: (collectionId: string, pinned: boolean) => void;
  getUserCollectionRow: (id: string) => UserCollectionRow | undefined;
  getCollectionCoverDataUrl: (id: string) => string | undefined;
  onUpdateUserCollection: (id: string, patch: Workshop2UserCollectionUpdate) => boolean;
  /** Описание и заметка для демо-коллекции SS27. */
  onUpdateSs27Meta: (patch: Workshop2Ss27MetaPatch) => boolean;
  articlePickerLines: LocalOrderLine[];
  onCommitWorkshop2Article: (collectionId: string, commit: Workshop2ArticleCommit) => boolean;
  onBulkAddWorkshop2Articles: (
    collectionId: string,
    rows: { sku: string; name?: string }[]
  ) => { added: number; skippedDuplicates: number };
  onRemoveWorkshop2Article: (collectionId: string, articleId: string) => void;
  onPatchWorkshop2ArticleLine: (
    collectionId: string,
    articleId: string,
    patch: Workshop2ArticleLinePatch
  ) => boolean;
  createdByLabel: string;
  /** Подсветка и скролл к строке после создания артикула. */
  highlightArticleId?: string | null;
};

const PAGE_SUBTITLE =
  'Сезонные подборки и артикулы в производственном контуре бренда: что в работе и по каким изделиям ведётся разработка.';

export function Workshop2TabContent({
  basePath,
  activeCollections,
  archivedCollections,
  metricsByCollectionId,
  getArticlePipelineProgress,
  getSkuFlowDoc,
  onCreateCollection,
  onArchiveCollection,
  onRestoreCollection,
  onToggleCollectionPin,
  getUserCollectionRow,
  getCollectionCoverDataUrl,
  onUpdateUserCollection,
  onUpdateSs27Meta,
  articlePickerLines,
  onCommitWorkshop2Article,
  onBulkAddWorkshop2Articles,
  onRemoveWorkshop2Article,
  onPatchWorkshop2ArticleLine,
  createdByLabel,
  highlightArticleId = null,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const w2col = searchParams.get(WORKSHOP2_COL_PARAM) ?? '';
  const legacyW2Art = searchParams.get(WORKSHOP2_ART_PARAM) ?? '';
  const listTab = searchParams.get(WORKSHOP2_TAB_PARAM) === 'archive' ? 'archive' : 'active';

  const collectionsForLookup = useMemo(
    () => [...activeCollections, ...archivedCollections],
    [activeCollections, archivedCollections]
  );

  const { toast } = useToast();

  const dossierRollupByCollectionId = useMemo((): Record<string, CollectionDossierRollup> => {
    if (typeof window === 'undefined') return {};
    const map = loadWorkshop2Phase1DossierMap();
    const out: Record<string, CollectionDossierRollup> = {};
    for (const col of collectionsForLookup) {
      out[col.id] = summarizeCollectionDossierRollup(map, col.id, col.articleRows);
    }
    return out;
  }, [collectionsForLookup]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.sessionStorage.getItem('synth.w2.hubTzHint.v1')) return;
    } catch {
      return;
    }
    if (listTab !== 'active') return;
    if (activeCollections.length === 0) return;
    const map = loadWorkshop2Phase1DossierMap();
    let overdue = 0;
    let weak = 0;
    for (const col of activeCollections) {
      const r = summarizeCollectionDossierRollup(map, col.id, col.articleRows);
      overdue += r.overdueSlaCount;
      weak += r.weakApprovalsCount;
    }
    try {
      window.sessionStorage.setItem('synth.w2.hubTzHint.v1', '1');
    } catch {
      /* ignore */
    }
    if (overdue === 0 && weak === 0) return;
    const parts: string[] = [];
    if (overdue > 0) {
      parts.push(`Просроченные даты ответа по ролям (SLA в паспорте): ${overdue}.`);
    }
    if (weak > 0) {
      parts.push(`Артикулов без полного набора подписей ТЗ: ${weak}.`);
    }
    toast({
      title: 'Напоминание по ТЗ',
      description: parts.join(' '),
      duration: 14_000,
    });
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, [activeCollections, listTab, toast]);

  const didLogSectionView = useRef(false);
  useEffect(() => {
    if (didLogSectionView.current) return;
    didLogSectionView.current = true;
    appendWorkshop2Activity('Просмотр: раздел «Коллекции»', createdByLabel);
  }, [createdByLabel]);

  /** Старые ссылки `?w2col=&w2art=` → отдельная страница артикула. */
  useEffect(() => {
    if (!legacyW2Art || !w2col) return;
    router.replace(workshop2ArticlePath(w2col, legacyW2Art));
  }, [legacyW2Art, w2col, router]);

  const replaceQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      mutate(p);
      const q = p.toString();
      router.replace(q ? `${basePath}?${q}` : basePath, { scroll: false });
    },
    [basePath, router, searchParams]
  );

  const setListTab = useCallback(
    (tab: 'active' | 'archive') => {
      replaceQuery((p) => {
        if (tab === 'archive') {
          p.set(WORKSHOP2_TAB_PARAM, 'archive');
          p.delete(WORKSHOP2_COL_PARAM);
          p.delete(WORKSHOP2_ART_PARAM);
          p.delete(WORKSHOP2_STEP_PARAM);
        } else {
          p.delete(WORKSHOP2_TAB_PARAM);
        }
      });
    },
    [replaceQuery]
  );

  const selectCollection = useCallback(
    (collectionId: string) => {
      const expanded = w2col === collectionId;
      const col = collectionsForLookup.find((c) => c.id === collectionId);
      const title = col?.displayName ?? collectionId;
      if (expanded) {
        appendWorkshop2Activity(`Список артикулов свёрнут · «${title}»`, createdByLabel);
      } else {
        appendWorkshop2Activity(
          `Открыт список артикулов · «${title}» (${collectionId})`,
          createdByLabel
        );
      }
      replaceQuery((p) => {
        if (expanded) {
          p.delete(WORKSHOP2_COL_PARAM);
          p.delete(WORKSHOP2_ART_PARAM);
          p.delete(WORKSHOP2_STEP_PARAM);
        } else {
          p.set(WORKSHOP2_COL_PARAM, collectionId);
          p.delete(WORKSHOP2_ART_PARAM);
          p.delete(WORKSHOP2_STEP_PARAM);
        }
      });
    },
    [replaceQuery, w2col, collectionsForLookup, createdByLabel]
  );

  const openArticle = useCallback(
    (collectionId: string, row: { id: string; internalArticleCode?: string }) => {
      router.push(
        workshop2ArticlePath(
          collectionId,
          workshop2ArticleUrlSegment(row.internalArticleCode, row.id)
        )
      );
    },
    [router]
  );

  const activeCollection = useMemo(
    () => collectionsForLookup.find((c) => c.id === w2col),
    [collectionsForLookup, w2col]
  );

  const articleRows = activeCollection?.articleRows ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(() => loadWorkshop2Activity());
  const [articleDialogCol, setArticleDialogCol] = useState<{
    id: string;
    displayName: string;
  } | null>(null);
  const [articleSkuFilter, setArticleSkuFilter] = useState('');
  const [archiveConfirm, setArchiveConfirm] = useState<{
    id: string;
    displayName: string;
    isSs27: boolean;
  } | null>(null);
  const [articlePanelStageFilter, setArticlePanelStageFilter] = useState<string | null>(null);
  const [articleListSort, setArticleListSort] = useState<'sku' | 'added'>('sku');
  const [articleFacetAudience, setArticleFacetAudience] = useState<Set<string>>(() => new Set());
  const [articleFacetL1, setArticleFacetL1] = useState<Set<string>>(() => new Set());
  const [articleFacetL2, setArticleFacetL2] = useState<Set<string>>(() => new Set());
  const [articleFacetL3, setArticleFacetL3] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setArticleFacetAudience(new Set());
    setArticleFacetL1(new Set());
    setArticleFacetL2(new Set());
    setArticleFacetL3(new Set());
  }, [w2col]);

  const [nextStepsCollectionId, setNextStepsCollectionId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkCol, setBulkCol] = useState<{ id: string; displayName: string } | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [newTargetSeason, setNewTargetSeason] = useState('');
  const [newTargetChannel, setNewTargetChannel] = useState('');
  const [newDropDeadline, setNewDropDeadline] = useState('');
  const [newTeamNote, setNewTeamNote] = useState('');
  const [newPanelAccent, setNewPanelAccent] = useState('#6366f1');
  const [newPanelAccentOn, setNewPanelAccentOn] = useState(false);
  const [gridSelectedCollectionIds, setGridSelectedCollectionIds] = useState<Set<string>>(
    () => new Set()
  );
  const [gridSelectedSkus, setGridSelectedSkus] = useState<Set<string>>(() => new Set());
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historyActorFilter, setHistoryActorFilter] = useState<string>('__all__');
  const [editOpen, setEditOpen] = useState(false);
  /** Редактирование карточки: пользовательская коллекция или демо SS27. */
  const [editKind, setEditKind] = useState<'user' | 'ss27' | null>(null);
  const [editColId, setEditColId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTargetSeason, setEditTargetSeason] = useState('');
  const [editTargetChannel, setEditTargetChannel] = useState('');
  const [editDropDeadline, setEditDropDeadline] = useState('');
  const [editTeamNote, setEditTeamNote] = useState('');
  const [editPanelAccent, setEditPanelAccent] = useState('#6366f1');
  const [editPanelAccentOn, setEditPanelAccentOn] = useState(false);
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);
  const [editCoverError, setEditCoverError] = useState<string | null>(null);
  const [editRemoveCover, setEditRemoveCover] = useState(false);
  const [editExistingCoverUrl, setEditExistingCoverUrl] = useState<string | null>(null);
  const [openCollDescId, setOpenCollDescId] = useState<string | null>(null);
  const [openCollNoteId, setOpenCollNoteId] = useState<string | null>(null);
  const [collNoteDraft, setCollNoteDraft] = useState('');
  const [collDescDraft, setCollDescDraft] = useState('');
  const [articleNotesTarget, setArticleNotesTarget] = useState<{
    collectionId: string;
    articleId: string;
    sku: string;
    draft: string;
  } | null>(null);
  const [articleEditTarget, setArticleEditTarget] = useState<
    (Workshop2EditArticlePayload & { collectionId: string; displayName: string }) | null
  >(null);
  const articleRowRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const collectionsForCurrentTab = listTab === 'active' ? activeCollections : archivedCollections;

  /** Каталог заказа + локальные строки (не только демо SS27 на вкладке). */
  const skuCatalogForFilters = useMemo(() => {
    type Entry = {
      skuNorm: string;
      skuLabel: string;
      name: string;
      thumb?: string;
      audienceLabel: string;
      categoryL1: string;
      categoryL2: string;
      categoryL3: string;
    };
    const m = new Map<string, Entry>();
    articlePickerLines.forEach((item, idx) => {
      const facets = deriveStagesArticleFacets(item as Record<string, unknown>, idx);
      const it = item as LocalOrderLine & { sku?: string; name?: string };
      const skuRaw = String(it.sku ?? '').trim();
      const skuNorm = normalizeLocalSkuCode(skuRaw) || skuRaw;
      if (!skuNorm) return;
      const firstAtt = it.workshopAttachments?.[0]?.dataUrl;
      const thumb =
        typeof firstAtt === 'string' && firstAtt.startsWith('data:') ? firstAtt : undefined;
      const prev = m.get(skuNorm);
      if (!prev) {
        m.set(skuNorm, {
          skuNorm,
          skuLabel: skuRaw || skuNorm,
          name: String(it.name ?? ''),
          thumb,
          audienceLabel: facets.audienceLabel,
          categoryL1: facets.categoryL1,
          categoryL2: facets.categoryL2,
          categoryL3: facets.categoryL3,
        });
      } else if (!prev.thumb && thumb) {
        m.set(skuNorm, { ...prev, thumb });
      }
    });
    return [...m.values()].sort((a, b) => a.skuNorm.localeCompare(b.skuNorm, 'ru'));
  }, [articlePickerLines]);

  /** Названия коллекций на текущей вкладке (активные или архив) — опции «Фильтр по коллекции». */
  const collectionOptionsForGridFilter = useMemo(() => {
    return [...collectionsForCurrentTab]
      .map((c) => ({ id: c.id, displayName: c.displayName.trim() || c.id }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, 'ru'));
  }, [collectionsForCurrentTab]);

  const globalSearchResults = useMemo(
    () => runGlobalWorkshop2Search(globalSearchQuery, collectionsForCurrentTab),
    [globalSearchQuery, collectionsForCurrentTab]
  );

  const historyActors = useMemo(() => {
    const s = new Set<string>();
    for (const e of historyEntries) {
      const a = e.actor?.trim();
      if (a) s.add(a);
    }
    return [...s].sort((x, y) => x.localeCompare(y, 'ru'));
  }, [historyEntries]);

  const historyFiltered = useMemo(() => {
    return historyEntries.filter((e) => {
      const at = new Date(e.at).getTime();
      if (historyDateFrom) {
        const from = new Date(`${historyDateFrom}T00:00:00`).getTime();
        if (at < from) return false;
      }
      if (historyDateTo) {
        const to = new Date(`${historyDateTo}T23:59:59.999`).getTime();
        if (at > to) return false;
      }
      if (historyActorFilter !== '__all__') {
        if (historyActorFilter === '__no_actor__') {
          if (e.actor?.trim()) return false;
        } else {
          const actor = e.actor?.trim() || '';
          if (actor !== historyActorFilter) return false;
        }
      }
      return true;
    });
  }, [historyEntries, historyDateFrom, historyDateTo, historyActorFilter]);

  const filteredCollectionsCount = useMemo(
    () =>
      filterWorkshop2CollectionsForGrid(
        collectionsForCurrentTab,
        gridSelectedCollectionIds,
        gridSelectedSkus
      ).length,
    [collectionsForCurrentTab, gridSelectedCollectionIds, gridSelectedSkus]
  );

  useEffect(() => {
    if (!editOpen) {
      setEditCoverPreview(null);
      return;
    }
    if (!editCoverFile) {
      setEditCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(editCoverFile);
    setEditCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [editCoverFile, editOpen]);

  useLayoutEffect(() => {
    if (!highlightArticleId || !w2col) return;
    const col = collectionsForLookup.find((c) => c.id === w2col);
    if (!col?.articleRows.some((r) => r.id === highlightArticleId)) return;
    const el = articleRowRefs.current.get(highlightArticleId);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightArticleId, w2col, collectionsForLookup]);

  useEffect(() => {
    setArticleSkuFilter('');
  }, [w2col]);

  useEffect(() => {
    setArticlePanelStageFilter(null);
  }, [w2col]);

  useEffect(() => {
    setArticleListSort('sku');
  }, [w2col]);

  useEffect(() => {
    setArticleFacetAudience('__all__');
    setArticleFacetL1('__all__');
    setArticleFacetL2('__all__');
    setArticleFacetL3('__all__');
  }, [w2col]);

  useEffect(() => {
    setGridSelectedCollectionIds(new Set());
    setGridSelectedSkus(new Set());
  }, [listTab]);

  const archiveOne = useCallback(
    (id: string) => {
      const col = collectionsForLookup.find((c) => c.id === id);
      appendWorkshop2Activity(`В архив · «${col?.displayName ?? id}» (${id})`, createdByLabel);
      if (w2col === id) {
        replaceQuery((p) => {
          p.delete(WORKSHOP2_COL_PARAM);
          p.delete(WORKSHOP2_ART_PARAM);
          p.delete(WORKSHOP2_STEP_PARAM);
        });
      }
      onArchiveCollection(id);
    },
    [w2col, collectionsForLookup, onArchiveCollection, replaceQuery, createdByLabel]
  );

  const confirmArchive = useCallback(() => {
    if (!archiveConfirm) return;
    archiveOne(archiveConfirm.id);
    setArchiveConfirm(null);
  }, [archiveConfirm, archiveOne]);

  const restoreOne = useCallback(
    (id: string) => {
      const col = archivedCollections.find((c) => c.id === id);
      appendWorkshop2Activity(
        `Восстановлено · «${col?.displayName ?? id}» (${id})`,
        createdByLabel
      );
      onRestoreCollection(id);
    },
    [archivedCollections, onRestoreCollection, createdByLabel]
  );

  const submitNewCollection = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    const raw = newCode.trim() || name;
    let coverDataUrl: string | undefined;
    if (coverFile) {
      coverDataUrl = await new Promise<string | undefined>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(typeof r.result === 'string' ? r.result : undefined);
        r.onerror = () => resolve(undefined);
        r.readAsDataURL(coverFile);
      });
    }
    let dropDeadlineIso: string | undefined;
    if (newDropDeadline.trim()) {
      const d = new Date(newDropDeadline);
      if (!Number.isNaN(d.getTime())) dropDeadlineIso = d.toISOString();
    }
    const meta = onCreateCollection(raw, name, {
      description: newDesc.trim() || undefined,
      createdBy: createdByLabel,
      coverDataUrl,
      targetSeason: newTargetSeason.trim() || undefined,
      targetChannel: newTargetChannel.trim() || undefined,
      dropDeadlineIso,
      teamNote: newTeamNote.trim() || undefined,
      panelAccentHex: newPanelAccentOn ? newPanelAccent.trim() || undefined : undefined,
    });
    appendWorkshop2Activity(
      `Создана коллекция «${meta.name}», код ${meta.id} · ${meta.createdBy}`,
      createdByLabel
    );
    setNextStepsCollectionId(meta.id);
    replaceQuery((p) => {
      p.delete(WORKSHOP2_TAB_PARAM);
      p.set(WORKSHOP2_COL_PARAM, meta.id);
      p.delete(WORKSHOP2_ART_PARAM);
      p.delete(WORKSHOP2_STEP_PARAM);
    });
    setCreateOpen(false);
    setNewName('');
    setNewCode('');
    setNewDesc('');
    setNewTargetSeason('');
    setNewTargetChannel('');
    setNewDropDeadline('');
    setNewTeamNote('');
    setNewPanelAccent('#6366f1');
    setNewPanelAccentOn(false);
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setCoverError(null);
  }, [
    newName,
    newCode,
    newDesc,
    newTargetSeason,
    newTargetChannel,
    newDropDeadline,
    newTeamNote,
    newPanelAccent,
    newPanelAccentOn,
    coverFile,
    coverPreview,
    createdByLabel,
    onCreateCollection,
    replaceQuery,
  ]);

  const resetCreateDialog = useCallback(() => {
    setNewName('');
    setNewCode('');
    setNewDesc('');
    setNewTargetSeason('');
    setNewTargetChannel('');
    setNewDropDeadline('');
    setNewTeamNote('');
    setNewPanelAccent('#6366f1');
    setNewPanelAccentOn(false);
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setCoverError(null);
  }, [coverPreview]);

  const resetEditDialog = useCallback(() => {
    setEditKind(null);
    setEditColId(null);
    setEditCode('');
    setEditName('');
    setEditDesc('');
    setEditTargetSeason('');
    setEditTargetChannel('');
    setEditDropDeadline('');
    setEditTeamNote('');
    setEditPanelAccent('#6366f1');
    setEditPanelAccentOn(false);
    setEditCoverFile(null);
    setEditCoverPreview(null);
    setEditCoverError(null);
    setEditRemoveCover(false);
    setEditExistingCoverUrl(null);
  }, []);

  const openUserCollectionEdit = useCallback(
    (col: Workshop2CollectionListItem) => {
      if (col.kind !== 'user') return;
      const row = getUserCollectionRow(col.id);
      if (!row) return;
      setEditKind('user');
      setEditColId(col.id);
      setEditCode(col.id);
      setEditName(row.name);
      setEditDesc(row.description ?? '');
      setEditTargetSeason(row.targetSeason ?? '');
      setEditTargetChannel(row.targetChannel ?? '');
      setEditDropDeadline(isoToDatetimeLocalValue(row.dropDeadlineIso));
      setEditTeamNote(row.teamNote ?? '');
      const hex = row.panelAccentHex?.trim();
      setEditPanelAccentOn(!!hex);
      setEditPanelAccent(hex || '#6366f1');
      setEditRemoveCover(false);
      setEditCoverFile(null);
      setEditCoverError(null);
      setEditExistingCoverUrl(getCollectionCoverDataUrl(col.id) ?? col.coverDataUrl ?? null);
      setEditOpen(true);
    },
    [getUserCollectionRow, getCollectionCoverDataUrl]
  );

  const openSs27CollectionCardEdit = useCallback(
    (col: Workshop2CollectionListItem) => {
      if (col.kind !== 'ss27') return;
      setEditKind('ss27');
      setEditColId(col.id);
      setEditCode(col.id);
      setEditName(col.displayName);
      setEditDesc(col.description ?? '');
      setEditTargetSeason(col.targetSeason ?? '');
      setEditTargetChannel(col.targetChannel ?? '');
      setEditDropDeadline(isoToDatetimeLocalValue(col.dropDeadlineIso));
      setEditTeamNote(col.teamNote ?? '');
      const hex = col.panelAccentHex?.trim();
      setEditPanelAccentOn(!!hex);
      setEditPanelAccent(hex || '#6366f1');
      setEditRemoveCover(false);
      setEditCoverFile(null);
      setEditCoverError(null);
      setEditExistingCoverUrl(getCollectionCoverDataUrl(col.id) ?? col.coverDataUrl ?? null);
      setEditOpen(true);
    },
    [getCollectionCoverDataUrl]
  );

  const submitEditUserCollection = useCallback(async () => {
    if (!editColId || !editName.trim()) return;
    let coverDataUrl: string | undefined = undefined;
    if (editRemoveCover) {
      coverDataUrl = '';
    } else if (editCoverFile) {
      coverDataUrl = await new Promise<string | undefined>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(typeof r.result === 'string' ? r.result : undefined);
        r.onerror = () => resolve(undefined);
        r.readAsDataURL(editCoverFile);
      });
    }
    let dropDeadlineIso: string | undefined;
    if (editDropDeadline.trim()) {
      const d = new Date(editDropDeadline);
      if (!Number.isNaN(d.getTime())) dropDeadlineIso = d.toISOString();
    }

    if (editKind === 'ss27') {
      let ss27DropPatch: string | undefined;
      if (!editDropDeadline.trim()) ss27DropPatch = '';
      else if (dropDeadlineIso) ss27DropPatch = dropDeadlineIso;

      const patch: Workshop2Ss27MetaPatch = {
        displayName: editName.trim(),
        description: editDesc,
        targetSeason: editTargetSeason,
        targetChannel: editTargetChannel,
        teamNote: editTeamNote,
        panelAccentHex: editPanelAccentOn ? editPanelAccent.trim() || '' : '',
        coverDataUrl,
        ...(ss27DropPatch !== undefined ? { dropDeadlineIso: ss27DropPatch } : {}),
      };
      if (onUpdateSs27Meta(patch)) {
        appendWorkshop2Activity(
          `Изменена карточка подборки «${editName.trim()}» (${editColId})`,
          createdByLabel
        );
        setEditOpen(false);
        resetEditDialog();
      }
      return;
    }

    const patch: Workshop2UserCollectionUpdate = {
      name: editName.trim(),
      description: editDesc.trim() || undefined,
      targetSeason: editTargetSeason.trim() || undefined,
      targetChannel: editTargetChannel.trim() || undefined,
      dropDeadlineIso,
      teamNote: editTeamNote.trim() || undefined,
      panelAccentHex: editPanelAccentOn ? editPanelAccent.trim() || '' : '',
      coverDataUrl,
    };
    if (onUpdateUserCollection(editColId, patch)) {
      appendWorkshop2Activity(
        `Изменена коллекция «${editName.trim()}» (${editColId})`,
        createdByLabel
      );
      setEditOpen(false);
      resetEditDialog();
    }
  }, [
    editColId,
    editKind,
    editName,
    editDesc,
    editTargetSeason,
    editTargetChannel,
    editDropDeadline,
    editTeamNote,
    editPanelAccentOn,
    editPanelAccent,
    editRemoveCover,
    editCoverFile,
    onUpdateUserCollection,
    onUpdateSs27Meta,
    createdByLabel,
    resetEditDialog,
  ]);

  const submitArticleNotes = useCallback(() => {
    if (!articleNotesTarget) return;
    const colTitle =
      collectionsForLookup.find((c) => c.id === articleNotesTarget.collectionId)?.displayName ??
      articleNotesTarget.collectionId;
    if (
      onPatchWorkshop2ArticleLine(articleNotesTarget.collectionId, articleNotesTarget.articleId, {
        workshopComment: articleNotesTarget.draft.trim(),
      })
    ) {
      appendWorkshop2Activity(
        `Заметки по артикулу ${articleNotesTarget.sku} · «${colTitle}»`,
        createdByLabel
      );
      setArticleNotesTarget(null);
    }
  }, [articleNotesTarget, collectionsForLookup, createdByLabel, onPatchWorkshop2ArticleLine]);

  const renderArticlesPanel = (cols: Workshop2CollectionListItem[]) => {
    const open = w2col ? cols.find((c) => c.id === w2col) : undefined;
    if (!open) return null;
    const rowsSorted = [...open.articleRows].sort((a, b) => {
      if (articleListSort === 'sku') {
        return a.sku.localeCompare(b.sku, 'ru', { sensitivity: 'base' });
      }
      const ta = a.addedAtIso ? new Date(a.addedAtIso).getTime() : 0;
      const tb = b.addedAtIso ? new Date(b.addedAtIso).getTime() : 0;
      return tb - ta;
    });
    const uniqSorted = (vals: string[]) =>
      [...new Set(vals)].sort((a, b) => a.localeCompare(b, 'ru'));
    const audienceOpts = uniqSorted(
      open.articleRows.map((r) => r.audienceLabel?.trim()).filter((v): v is string => Boolean(v))
    );
    const l1Opts = uniqSorted(
      open.articleRows.map((r) => r.categoryL1?.trim()).filter((v): v is string => Boolean(v))
    );
    const l2Opts = uniqSorted(
      open.articleRows.map((r) => r.categoryL2?.trim()).filter((v): v is string => Boolean(v))
    );
    const l3Opts = uniqSorted(
      open.articleRows.map((r) => r.categoryL3?.trim()).filter((v): v is string => Boolean(v))
    );
    const facAud = ensureFacetSelectionSet(articleFacetAudience);
    const facL1 = ensureFacetSelectionSet(articleFacetL1);
    const facL2 = ensureFacetSelectionSet(articleFacetL2);
    const facL3 = ensureFacetSelectionSet(articleFacetL3);
    const facetFiltered = rowsSorted.filter((r) => {
      const aud = r.audienceLabel.trim();
      const l1 = r.categoryL1.trim();
      const l2 = r.categoryL2.trim();
      const l3 = r.categoryL3.trim();
      if (facAud.size > 0 && !facAud.has(aud)) return false;
      if (facL1.size > 0 && !facL1.has(l1)) return false;
      if (facL2.size > 0 && !facL2.has(l2)) return false;
      if (facL3.size > 0 && !facL3.has(l3)) return false;
      return true;
    });
    const q = articleSkuFilter.trim().toLowerCase();
    const filteredRows =
      q.length > 0
        ? facetFiltered.filter(
            (r) =>
              r.sku.toLowerCase().includes(q) ||
              r.name.toLowerCase().includes(q) ||
              r.commentPreview?.toLowerCase().includes(q)
          )
        : facetFiltered;
    const panelMetrics = metricsByCollectionId[open.id] ?? {
      status: 'draft' as const,
      progressPct: 0,
      articleCount: 0,
    };
    const flowDoc = getSkuFlowDoc(open.id);
    const articleIds = rowsSorted.map((r) => r.id);
    return (
      <div className="mt-4 w-full min-w-0">
        <Card
          className={cn(
            'w-full border-indigo-100 bg-white',
            open.panelAccentHex ? 'border-l-[5px]' : ''
          )}
          style={open.panelAccentHex ? { borderLeftColor: open.panelAccentHex } : undefined}
        >
          <CardHeader className="space-y-0 pb-2">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="min-w-0">
                <CardTitle className="text-sm uppercase tracking-tight">
                  Артикулы · {open.displayName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Готовность по этапам каталога; клик по столбцу подсвечивает артикулы, которые
                  сейчас на этом этапе.
                </CardDescription>
              </div>
              <div
                className="flex w-full min-w-0 flex-nowrap items-end gap-x-2 gap-y-2 overflow-x-auto overscroll-x-contain pb-0.5 [-webkit-overflow-scrolling:touch]"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <Workshop2ArticleFacetPopover
                  label="Аудитория"
                  title={WORKSHOP2_AUDIENCE_FILTER_TITLE}
                  options={audienceOpts}
                  selected={articleFacetAudience}
                  onSelectedChange={setArticleFacetAudience}
                  triggerId={`w2-art-aud-${open.id}`}
                />
                <Workshop2ArticleFacetPopover
                  label="Ур. 1"
                  title={WORKSHOP2_CAT_L1_FILTER_TITLE}
                  options={l1Opts}
                  selected={articleFacetL1}
                  onSelectedChange={setArticleFacetL1}
                  triggerId={`w2-art-l1-${open.id}`}
                />
                <div className="flex shrink-0 flex-nowrap items-end gap-x-2">
                  <Workshop2ArticleFacetPopover
                    label="Ур. 2"
                    title={WORKSHOP2_CAT_L2_FILTER_TITLE}
                    options={l2Opts}
                    selected={articleFacetL2}
                    onSelectedChange={setArticleFacetL2}
                    triggerId={`w2-art-l2-${open.id}`}
                  />
                  <Workshop2ArticleFacetPopover
                    label="Ур. 3"
                    title={WORKSHOP2_CAT_L3_FILTER_TITLE}
                    options={l3Opts}
                    selected={articleFacetL3}
                    onSelectedChange={setArticleFacetL3}
                    triggerId={`w2-art-l3-${open.id}`}
                  />
                </div>
                <div className="flex shrink-0 flex-col justify-end gap-0.5">
                  <span
                    className="flex h-[0.875rem] items-end whitespace-nowrap text-[9px] font-semibold uppercase leading-none tracking-wide text-slate-500"
                    aria-hidden
                  >
                    {'\u00a0'}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0 whitespace-nowrap px-2 text-[9px] font-bold uppercase text-slate-700"
                    onClick={() => {
                      setArticleFacetAudience(new Set());
                      setArticleFacetL1(new Set());
                      setArticleFacetL2(new Set());
                      setArticleFacetL3(new Set());
                    }}
                  >
                    Сбросить фильтр
                  </Button>
                </div>
                <div className="flex shrink-0 flex-col gap-0.5">
                  <Label
                    htmlFor={`w2-art-sort-${open.id}`}
                    className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Сортировка
                  </Label>
                  <select
                    id={`w2-art-sort-${open.id}`}
                    value={articleListSort}
                    onChange={(e) =>
                      setArticleListSort(e.target.value === 'added' ? 'added' : 'sku')
                    }
                    className="h-9 w-[6.75rem] cursor-pointer rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700 sm:w-[7.5rem]"
                  >
                    <option value="sku">SKU A→Я</option>
                    <option value="added">Дата добавления</option>
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 gap-1 text-[10px] font-bold uppercase"
                  onClick={() => {
                    setBulkCol({ id: open.id, displayName: open.displayName });
                    setBulkText('');
                    setBulkOpen(true);
                  }}
                >
                  <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Массово
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-9 shrink-0 whitespace-nowrap text-[10px] font-bold uppercase"
                  onClick={() => {
                    setArticleEditTarget(null);
                    setArticleDialogCol({ id: open.id, displayName: open.displayName });
                  }}
                >
                  Создать артикул
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full min-w-0 space-y-3">
            {nextStepsCollectionId === open.id ? (
              <div
                className="rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-[11px] text-emerald-950"
                role="status"
              >
                <p className="mb-1.5 text-[12px] font-bold">Что дальше</p>
                <ul className="mb-2 list-disc space-y-0.5 pl-4">
                  <li>Добавьте первый артикул (кнопка выше).</li>
                  <li>При желании загрузите обложку карточки коллекции в списке слева.</li>
                  <li>Закрепите подборку гвоздиком, если она главная сейчас.</li>
                </ul>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-7 text-[10px]"
                  onClick={() => setNextStepsCollectionId(null)}
                >
                  Понятно, скрыть
                </Button>
              </div>
            ) : null}
            <div className="w-full min-w-0 space-y-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
              <div className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className="shrink-0 text-[11px] font-semibold text-slate-700">
                  Общая готовность
                </span>
                <span className="shrink-0 text-lg font-black tabular-nums leading-none text-indigo-900">
                  {panelMetrics.progressPct}%
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 rounded-full p-0.5 text-slate-400 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      aria-label="Как считается готовность"
                    >
                      <CircleAlert className="h-4 w-4" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[260px] text-[11px] leading-snug">
                    {READINESS_HELP}
                  </TooltipContent>
                </Tooltip>
              </div>
              {rowsSorted.length === 0 ? null : (
                <div className="w-full min-w-0 overflow-x-auto rounded-md border border-indigo-100/90 bg-white/80 p-1.5">
                  <div className="flex min-w-max gap-px">
                    {WORKSHOP2_PIPELINE_STEP_IDS.map((sid, idx) => {
                      const step = COLLECTION_STEP_BY_ID.get(sid);
                      const n = articleIds.length;
                      const done = aggregateSkuDoneCount(flowDoc, articleIds, sid);
                      const fillPct = n ? Math.round((done / n) * 100) : 0;
                      const active = articlePanelStageFilter === sid;
                      return (
                        <Tooltip key={sid}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                'flex h-11 w-8 shrink-0 flex-col items-stretch justify-end rounded-sm border px-0.5 pb-0.5 transition-colors',
                                active
                                  ? 'border-indigo-600 bg-indigo-100 shadow-sm'
                                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50'
                              )}
                              aria-pressed={active}
                              aria-label={`${step?.title ?? sid}: закрыли этап ${done} из ${n}`}
                              onClick={() =>
                                setArticlePanelStageFilter((prev) => (prev === sid ? null : sid))
                              }
                            >
                              <div className="relative mx-auto mt-1 flex h-7 w-5 flex-1 overflow-hidden rounded-sm bg-slate-200/90">
                                <div
                                  className="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all"
                                  style={{ height: `${fillPct}%` }}
                                />
                              </div>
                              <span className="text-center text-[8px] font-bold tabular-nums text-slate-500">
                                {idx + 1}
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[260px] text-[11px] leading-snug"
                          >
                            <p className="font-semibold">{step?.title ?? sid}</p>
                            <p className="text-slate-600">
                              Закрыли этап: {done}/{n} арт.
                            </p>
                            <p className="mt-1 text-slate-500">
                              Повторный клик снимает подсветку строк.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )}
              {articlePanelStageFilter ? (
                <p className="text-[10px] text-indigo-800/90">
                  Подсветка: артикулы, у которых по матрице текущий открытый этап — «
                  {COLLECTION_STEP_BY_ID.get(articlePanelStageFilter)?.title ??
                    articlePanelStageFilter}
                  ».
                </p>
              ) : null}
            </div>

            {rowsSorted.length >= 10 ? (
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <Input
                  value={articleSkuFilter}
                  onChange={(e) => setArticleSkuFilter(e.target.value)}
                  placeholder="Поиск по SKU, названию…"
                  className="h-9 pl-8 text-xs"
                  aria-label="Поиск по списку артикулов"
                />
              </div>
            ) : null}

            {rowsSorted.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">
                В подборке пока нет артикулов.
              </p>
            ) : filteredRows.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">
                {facetFiltered.length === 0 && rowsSorted.length > 0
                  ? 'Нет артикулов по выбранным фильтрам аудитории и категорий.'
                  : 'Ничего не найдено.'}
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
                {filteredRows.map((row) => {
                  const prog = getArticlePipelineProgress(open.id, row.id);
                  const stagesIdle = prog.total > 0 && prog.done === 0;
                  const isHighlight = highlightArticleId === row.id;
                  const currentStepId = getSkuCurrentProcessStepId(
                    flowDoc,
                    row.id,
                    WORKSHOP2_PIPELINE_STEP_IDS
                  );
                  const stageHighlight =
                    articlePanelStageFilter !== null && currentStepId === articlePanelStageFilter;
                  const stageBucket = workshop2ArticleStageBucket(
                    flowDoc,
                    row.id,
                    WORKSHOP2_PIPELINE_STEP_IDS
                  );
                  const deletable = workshop2ArticleDeletable(
                    flowDoc,
                    row.id,
                    WORKSHOP2_PIPELINE_STEP_IDS,
                    prog
                  );
                  return (
                    <li
                      key={row.id}
                      ref={(node) => {
                        if (node) articleRowRefs.current.set(row.id, node);
                        else articleRowRefs.current.delete(row.id);
                      }}
                      className="flex min-w-0 flex-row items-stretch gap-2"
                    >
                      <button
                        type="button"
                        className={cn(
                          'flex min-h-0 min-w-0 flex-1 flex-row items-stretch justify-between gap-2 overflow-hidden px-4 py-3 text-left transition-colors',
                          'hover:bg-indigo-50/60 active:bg-indigo-100/70',
                          isHighlight && 'bg-amber-50/90 ring-2 ring-inset ring-amber-200/90',
                          stageHighlight && 'bg-indigo-50/90 ring-2 ring-inset ring-indigo-300/80'
                        )}
                        onClick={() => openArticle(open.id, row)}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-[12px] font-bold text-slate-900">
                              {row.sku}
                            </p>
                            {isWorkshop2InternalArticleCodeValid(row.internalArticleCode) ? (
                              <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-slate-600">
                                id {row.internalArticleCode}
                              </span>
                            ) : null}
                            {row.articleOrigin === 'new' ? (
                              <Badge
                                variant="secondary"
                                className="h-5 border-emerald-200 bg-emerald-100 px-1.5 text-[8px] font-black uppercase text-emerald-900"
                              >
                                New
                              </Badge>
                            ) : row.articleOrigin === 'base' ? (
                              <Badge
                                variant="outline"
                                className="h-5 border-slate-300 px-1.5 text-[8px] font-black uppercase text-slate-700"
                              >
                                Base
                              </Badge>
                            ) : null}
                            {stageBucket === 'not_started' ? (
                              <Badge
                                variant="secondary"
                                className="h-5 border-slate-200 bg-slate-100 px-1.5 text-[8px] font-semibold normal-case text-slate-700"
                              >
                                Ещё не начат
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="h-5 border-amber-200 bg-amber-50 px-1.5 text-[8px] font-semibold normal-case text-amber-900"
                              >
                                В работе
                              </Badge>
                            )}
                            {row.attachmentCount ? (
                              <span
                                className="inline-flex items-center gap-0.5 text-[9px] text-slate-500"
                                title={`Вложений: ${row.attachmentCount}`}
                              >
                                <Paperclip className="h-3 w-3 shrink-0" aria-hidden />
                                <span className="tabular-nums">{row.attachmentCount}</span>
                              </span>
                            ) : null}
                          </div>
                          <ArticleFacetsInline row={row} />
                          <div className="mt-0.5 w-full border-t border-slate-100/90 pt-1.5 min-[400px]:hidden">
                            <Workshop2ArticleDateFlip
                              addedAtIso={row.addedAtIso}
                              updatedAtIso={row.updatedAtIso}
                            />
                          </div>
                        </div>
                        <div className="hidden w-[6.75rem] shrink-0 flex-col justify-center border-l border-slate-100 px-2 text-right min-[400px]:flex">
                          <Workshop2ArticleDateFlip
                            addedAtIso={row.addedAtIso}
                            updatedAtIso={row.updatedAtIso}
                          />
                        </div>
                        <div className="flex w-[7.5rem] min-w-[7rem] shrink-0 flex-col items-end justify-center gap-1.5 border-l border-slate-100 pl-2 pr-1">
                          {prog.total === 0 ? (
                            <span className="w-full break-words text-right text-[9px] font-semibold leading-tight text-slate-500">
                              Нет этапов
                            </span>
                          ) : stagesIdle ? (
                            <span className="w-full break-words text-right text-[9px] font-semibold leading-tight text-slate-500">
                              Этапы не начаты
                            </span>
                          ) : (
                            <span className="text-lg font-black tabular-nums leading-none text-indigo-800">
                              {prog.pct}%
                            </span>
                          )}
                          <Progress value={prog.pct} className="h-1.5 w-full" />
                          <span className="text-right text-[8px] uppercase leading-tight tracking-tighter text-slate-400">
                            Этапы {prog.done}/{prog.total}
                          </span>
                        </div>
                      </button>
                      <div className="relative z-[1] flex w-[6rem] min-w-[6rem] shrink-0 flex-col gap-1 border-l border-slate-100 bg-slate-50/50 py-2 pl-2 pr-1">
                        <div className="flex flex-row items-center justify-end gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 min-h-7 w-7 min-w-7 shrink-0 p-0 text-slate-600 hover:text-indigo-800"
                            aria-label="Заметки по артикулу"
                            title="Заметки по артикулу (локально в браузере)"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setArticleNotesTarget({
                                collectionId: open.id,
                                articleId: row.id,
                                sku: row.sku,
                                draft: row.workshopComment ?? '',
                              });
                            }}
                          >
                            <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          </Button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 min-h-7 w-7 min-w-7 shrink-0 p-0 text-slate-600 hover:text-indigo-800"
                                aria-label="Редактировать артикул"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setArticleDialogCol(null);
                                  const leafFromRow = row.categoryLeafId?.trim();
                                  const validLeaf =
                                    leafFromRow && findHandbookLeafById(leafFromRow)
                                      ? leafFromRow
                                      : (getHandbookCategoryLeaves()[0]?.leafId ?? '');
                                  setArticleEditTarget({
                                    collectionId: open.id,
                                    displayName: open.displayName,
                                    articleId: row.id,
                                    sku: row.sku,
                                    name: row.name,
                                    comment: row.workshopComment ?? '',
                                    categoryLeafId: validLeaf,
                                    workshopAttachments: row.workshopAttachments?.length
                                      ? row.workshopAttachments.map((a) => ({ ...a }))
                                      : [],
                                  });
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-[200px] text-[11px]">
                              Как при «Создать артикул»: название, категория, комментарий, файлы
                            </TooltipContent>
                          </Tooltip>
                          {deletable ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 min-h-7 w-7 min-w-7 shrink-0 p-0 text-red-600 hover:bg-red-50 hover:text-red-800"
                                  aria-label={`Удалить артикул ${row.sku} из подборки`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (
                                      !globalThis.confirm(
                                        `Удалить артикул ${row.sku} из подборки? Данные исчезнут из этого браузера.`
                                      )
                                    ) {
                                      return;
                                    }
                                    appendWorkshop2Activity(
                                      `Удалён артикул ${row.sku} · коллекция «${open.displayName}»`,
                                      createdByLabel
                                    );
                                    onRemoveWorkshop2Article(open.id, row.id);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-[11px]">
                                Удалить из подборки
                              </TooltipContent>
                            </Tooltip>
                          ) : null}
                        </div>
                        {!deletable ? (
                          <div className="flex flex-col gap-1 border-t border-slate-100/80 pt-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 gap-0.5 px-1 text-[8px] font-bold uppercase leading-tight"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    appendWorkshop2Activity(
                                      `Запрос деления задач · ${row.sku} · «${open.displayName}»`,
                                      createdByLabel
                                    );
                                  }}
                                >
                                  <SquareSplitHorizontal className="h-3 w-3 shrink-0" aria-hidden />
                                  Деление
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="max-w-[200px] text-[11px]">
                                Зафиксировано в истории. Разбиение задач по этапам подключим в
                                модуле изделия.
                              </TooltipContent>
                            </Tooltip>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 px-1 text-[8px] font-semibold text-slate-500 hover:text-slate-800"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setArchiveConfirm({
                                  id: open.id,
                                  displayName: open.displayName,
                                  isSs27: open.kind === 'ss27',
                                });
                              }}
                            >
                              Архив коллекции
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCollectionGrid = (cols: Workshop2CollectionListItem[], tab: 'active' | 'archive') => {
    const filteredCols = filterWorkshop2CollectionsForGrid(
      cols,
      gridSelectedCollectionIds,
      gridSelectedSkus
    );

    return (
      <div className="w-full min-w-0">
        <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 min-[520px]:grid-cols-2 lg:grid-cols-4">
          {filteredCols.map((col) => {
            const metrics = metricsByCollectionId[col.id] ?? {
              status: 'draft' as const,
              progressPct: 0,
              articleCount: 0,
            };
            const listOpen = w2col === col.id;
            const fullCardTitle = `${col.displayName} · ${col.id}`;
            return (
              <div key={col.id} className="flex h-full min-h-0 w-full min-w-0 flex-col">
                <Card
                  className={cn(
                    'relative mx-auto flex h-full min-h-[18rem] w-full max-w-[21rem] flex-col overflow-hidden border-2 transition-all min-[520px]:mx-0 min-[520px]:max-w-full',
                    'focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-400/50 focus-within:ring-offset-2',
                    listOpen
                      ? 'border-indigo-400 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200/70 ring-offset-1'
                      : 'border-slate-100'
                  )}
                >
                  {col.kind === 'user' || col.kind === 'ss27' || tab === 'active' ? (
                    <div
                      className="absolute left-1 top-1 z-[4] flex max-w-[calc(100%-0.75rem)] flex-wrap items-center gap-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {col.kind === 'user' || col.kind === 'ss27' ? (
                        <Popover
                          modal={false}
                          open={openCollDescId === col.id}
                          onOpenChange={(o) => {
                            if (o) {
                              setOpenCollDescId(col.id);
                              if (col.kind === 'ss27') setCollDescDraft(col.description ?? '');
                            } else {
                              setOpenCollDescId(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 rounded-md border border-slate-200/80 bg-white/95 shadow-sm hover:bg-white"
                              aria-label="Описание коллекции"
                              title="Описание коллекции"
                            >
                              <FileText className="h-3 w-3 text-slate-600" aria-hidden />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[min(100vw-2rem,18rem)] p-3 text-[11px]"
                            align="start"
                            side="bottom"
                            sideOffset={6}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                          >
                            <p className="mb-1.5 font-semibold text-slate-900">Описание</p>
                            {col.kind === 'user' ? (
                              <>
                                <p className="whitespace-pre-wrap break-words text-[12px] leading-relaxed text-slate-600">
                                  {col.description?.trim()
                                    ? col.description.trim()
                                    : 'Не заполнено.'}
                                </p>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="mt-2 h-auto p-0 text-[11px]"
                                  onClick={() => {
                                    setOpenCollDescId(null);
                                    openUserCollectionEdit(col);
                                  }}
                                >
                                  Изменить в форме
                                </Button>
                              </>
                            ) : (
                              <>
                                <Label htmlFor={`w2-ss27-desc-${col.id}`} className="sr-only">
                                  Текст описания
                                </Label>
                                <Textarea
                                  id={`w2-ss27-desc-${col.id}`}
                                  value={collDescDraft}
                                  onChange={(e) => setCollDescDraft(e.target.value)}
                                  rows={4}
                                  placeholder="Кратко о подборке…"
                                  className="mt-1 resize-none text-xs"
                                  aria-label="Описание подборки SS27"
                                />
                                <div className="mt-2 flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-[11px]"
                                    onClick={() => setOpenCollDescId(null)}
                                  >
                                    Отмена
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="h-8 text-[11px]"
                                    onClick={() => {
                                      if (
                                        onUpdateSs27Meta({
                                          description: collDescDraft.trim(),
                                        })
                                      ) {
                                        appendWorkshop2Activity(
                                          `Описание подборки «${col.displayName}» (${col.id})`,
                                          createdByLabel
                                        );
                                        setOpenCollDescId(null);
                                      }
                                    }}
                                  >
                                    Сохранить
                                  </Button>
                                </div>
                              </>
                            )}
                          </PopoverContent>
                        </Popover>
                      ) : null}
                      {col.kind === 'user' || col.kind === 'ss27' ? (
                        <Popover
                          open={openCollNoteId === col.id}
                          onOpenChange={(o) => {
                            if (o) {
                              setCollNoteDraft(col.teamNote ?? '');
                              setOpenCollNoteId(col.id);
                            } else {
                              setOpenCollNoteId(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 rounded-md border border-slate-200/80 bg-white/95 shadow-sm hover:bg-white"
                              aria-label="Заметка для команды"
                              title="Заметка для команды"
                            >
                              <MessageSquare className="h-3 w-3 text-slate-600" aria-hidden />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[min(100vw-2rem,20rem)] p-3"
                            align="start"
                            side="bottom"
                            sideOffset={6}
                          >
                            <p className="mb-1.5 text-[11px] font-semibold text-slate-900">
                              Заметка для команды
                            </p>
                            <Textarea
                              value={collNoteDraft}
                              onChange={(e) => setCollNoteDraft(e.target.value)}
                              rows={4}
                              placeholder="Контекст, ссылки, кто отвечает…"
                              className="resize-none text-xs"
                              aria-label="Текст заметки"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-[11px]"
                                onClick={() => setOpenCollNoteId(null)}
                              >
                                Отмена
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="h-8 text-[11px]"
                                onClick={() => {
                                  if (col.kind === 'user') {
                                    const row = getUserCollectionRow(col.id);
                                    if (!row) return;
                                    if (
                                      onUpdateUserCollection(col.id, {
                                        name: row.name,
                                        teamNote: collNoteDraft.trim(),
                                      })
                                    ) {
                                      appendWorkshop2Activity(
                                        `Заметка коллекции «${col.displayName}» (${col.id})`,
                                        createdByLabel
                                      );
                                      setOpenCollNoteId(null);
                                    }
                                  } else if (col.kind === 'ss27') {
                                    if (
                                      onUpdateSs27Meta({
                                        teamNote: collNoteDraft.trim(),
                                      })
                                    ) {
                                      appendWorkshop2Activity(
                                        `Заметка подборки «${col.displayName}» (${col.id})`,
                                        createdByLabel
                                      );
                                      setOpenCollNoteId(null);
                                    }
                                  }
                                }}
                              >
                                Сохранить
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : null}
                      {col.kind === 'user' || col.kind === 'ss27' ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0 rounded-md border border-slate-200/80 bg-white/95 shadow-sm hover:bg-white"
                              aria-label="Редактировать коллекцию"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (col.kind === 'user') {
                                  openUserCollectionEdit(col);
                                } else {
                                  openSs27CollectionCardEdit(col);
                                }
                              }}
                            >
                              <Pencil className="h-3 w-3 text-slate-600" aria-hidden />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[220px] text-[11px]">
                            Редактировать название, обложку и поля коллекции
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                      {tab === 'active' ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant={col.pinned ? 'secondary' : 'ghost'}
                              size="icon"
                              className={cn(
                                'h-6 w-6 shrink-0 rounded-md border bg-white/95 shadow-sm hover:bg-white',
                                col.pinned
                                  ? 'border-indigo-200 bg-indigo-50/90'
                                  : 'border-slate-200/80'
                              )}
                              aria-pressed={col.pinned}
                              aria-label={
                                col.pinned ? 'Снять закрепление' : 'Закрепить первой в списке'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleCollectionPin(col.id, !col.pinned);
                              }}
                            >
                              <Pin
                                className={cn(
                                  'h-3 w-3 motion-safe:transition-opacity',
                                  col.pinned
                                    ? 'fill-indigo-200/70 text-indigo-700 motion-safe:animate-pulse'
                                    : 'text-slate-400'
                                )}
                                aria-hidden
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="max-w-[260px] text-[11px] leading-snug"
                          >
                            {col.pinned
                              ? 'Снять гвоздик: карточка остаётся здесь. Новая коллекция или другой гвоздик окажутся выше.'
                              : 'Закрепить: перенести на первое место. Кто нажат последним — тот сверху.'}
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                    </div>
                  ) : null}
                  {col.coverDataUrl ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 border-b border-slate-100 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={col.coverDataUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="relative flex aspect-[16/10] w-full shrink-0 items-center justify-center border-b border-slate-100 bg-gradient-to-br from-slate-100 via-indigo-50/80 to-slate-200/90"
                      aria-hidden
                    >
                      <span className="font-mono text-2xl font-black tracking-tight text-indigo-900/25">
                        {collectionCoverMonogram(col.id)}
                      </span>
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      'absolute right-2 top-2 z-[1] max-w-[min(10rem,calc(100%-4rem))] truncate text-[9px] font-bold',
                      workshop2StatusBadgeClass(metrics.status)
                    )}
                  >
                    {metrics.articleCount === 0
                      ? workshop2StatusLabel('draft')
                      : workshop2StatusLabel(metrics.status)}
                  </Badge>
                  <CardHeader
                    className={cn(
                      'flex min-h-0 flex-1 flex-col gap-2 px-1.5 pb-2 pt-9 text-left sm:gap-2.5',
                      (col.kind === 'user' || col.kind === 'ss27') && 'pr-[1.375rem] sm:pr-6',
                      (col.kind === 'user' || col.kind === 'ss27') &&
                        tab === 'active' &&
                        'pl-[3.25rem]',
                      (col.kind === 'user' || col.kind === 'ss27') && tab === 'archive' && 'pl-9',
                      col.kind !== 'user' && col.kind !== 'ss27' && 'pr-6 sm:pr-8'
                    )}
                  >
                    <div className="flex min-h-[5.5rem] min-w-0 flex-1 flex-col justify-center gap-1">
                      <div className="flex min-w-0 items-start gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CardTitle
                              className="line-clamp-2 min-w-0 cursor-default text-left text-sm font-bold leading-snug text-slate-900"
                              title={fullCardTitle}
                            >
                              {col.displayName}
                            </CardTitle>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="max-w-[280px] text-[11px] leading-snug"
                          >
                            <p className="font-semibold">{col.displayName}</p>
                            <p className="mt-1 font-mono text-[10px] text-slate-500">{col.id}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="flex w-full min-w-0 flex-col gap-0.5 text-[10px] leading-tight text-slate-500">
                            <span className="shrink-0 text-slate-400">Код коллекции</span>
                            <span
                              className="min-w-0 truncate font-mono text-slate-600"
                              title={col.id}
                            >
                              {col.id}
                            </span>
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[320px]">
                          <span className="break-all font-mono text-[11px]">{col.id}</span>
                        </TooltipContent>
                      </Tooltip>
                      <div className="w-full min-w-0 max-w-full space-y-0.5 pt-0.5">
                        {col.cardTimestamps ? (
                          <>
                            <p
                              className="break-words text-[10px] leading-snug text-slate-700"
                              title={`${col.cardTimestamps.createdCaption} ${col.cardTimestamps.createdValue}`}
                            >
                              <span className="text-slate-400">
                                {col.cardTimestamps.createdCaption}
                              </span>{' '}
                              <span className="font-medium tabular-nums">
                                {col.cardTimestamps.createdValue}
                              </span>
                            </p>
                            {col.cardTimestamps.updatedCaption &&
                            col.cardTimestamps.updatedValue ? (
                              <p
                                className="break-words text-[10px] leading-snug text-slate-700"
                                title={`${col.cardTimestamps.updatedCaption} ${col.cardTimestamps.updatedValue}`}
                              >
                                <span className="text-slate-400">
                                  {col.cardTimestamps.updatedCaption}
                                </span>{' '}
                                <span className="font-medium tabular-nums">
                                  {col.cardTimestamps.updatedValue}
                                </span>
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <span
                            className="block select-none text-[10px] leading-snug text-transparent"
                            aria-hidden
                          >
                            —
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 text-[11px] text-slate-600">
                      {metrics.articleCount > 0 ? (
                        <p className="shrink-0 leading-snug">Артикулов: {metrics.articleCount}</p>
                      ) : null}
                      <div className="flex min-h-[2.875rem] flex-col justify-end">
                        {metrics.articleCount === 0 ? (
                          <p className="text-[10px] leading-snug text-slate-500">Нет артикулов.</p>
                        ) : listOpen ? (
                          <span className="block min-h-[2rem]" aria-hidden />
                        ) : (
                          <Fragment>
                            <div className="flex w-full min-w-0 flex-row flex-nowrap items-center gap-2 text-[10px] text-slate-600">
                              <span className="shrink-0 whitespace-nowrap font-semibold text-slate-700">
                                Общая готовность
                              </span>
                              <Progress
                                value={metrics.progressPct}
                                className="h-2.5 min-w-0 flex-1 basis-0"
                              />
                              <div className="flex shrink-0 items-center gap-0.5">
                                <span className="whitespace-nowrap text-base font-black tabular-nums text-indigo-900">
                                  {metrics.progressPct}%
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="rounded-full p-0.5 text-slate-400 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                                      aria-label="Как считается готовность"
                                    >
                                      <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    className="max-w-[260px] text-[11px] leading-snug"
                                  >
                                    {READINESS_HELP}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            {(() => {
                              const rollup = dossierRollupByCollectionId[col.id];
                              if (!rollup || rollup.withDossierCount === 0) return null;
                              return (
                                <p className="mt-1 text-[9px] leading-snug text-slate-500">
                                  <span className="font-semibold text-slate-600">ТЗ (local):</span>{' '}
                                  ~{rollup.avgTzPct}% · образец {rollup.readyForSampleCount}/
                                  {rollup.withDossierCount}
                                  {rollup.bomPinCount > 0 ? (
                                    <span className="text-teal-700">
                                      {' '}
                                      · BOM ref: {rollup.bomPinCount}
                                    </span>
                                  ) : null}
                                  {rollup.overdueSlaCount > 0 ? (
                                    <span className="font-semibold text-rose-600">
                                      {' '}
                                      · SLA просрочено: {rollup.overdueSlaCount}
                                    </span>
                                  ) : null}
                                  {rollup.weakApprovalsCount > 0 ? (
                                    <span className="text-amber-800">
                                      {' '}
                                      · без подписей: {rollup.weakApprovalsCount} арт.
                                    </span>
                                  ) : null}
                                </p>
                              );
                            })()}
                          </Fragment>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto flex min-h-[4.75rem] shrink-0 flex-col items-center justify-end gap-1.5 px-1.5 pb-2.5 pt-0 sm:pb-3">
                    <Button
                      type="button"
                      variant={listOpen ? 'secondary' : 'default'}
                      size="sm"
                      className="h-7 min-w-[9rem] max-w-[85%] px-4 text-[9px] font-black uppercase tracking-wide"
                      onClick={() => selectCollection(col.id)}
                    >
                      {listOpen ? 'Свернуть список' : 'Выбрать коллекцию'}
                    </Button>
                    <div className="flex min-h-[1.375rem] w-full flex-col items-center justify-center">
                      {tab === 'active' ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-2 py-0 text-[9px] font-normal text-slate-400 no-underline hover:text-slate-600"
                          onClick={() =>
                            setArchiveConfirm({
                              id: col.id,
                              displayName: col.displayName,
                              isSs27: col.kind === 'ss27',
                            })
                          }
                        >
                          Убрать в архив
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-6 px-2 text-[9px] text-indigo-700 hover:text-indigo-900"
                          onClick={() => restoreOne(col.id)}
                        >
                          Восстановить
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        {renderArticlesPanel(cols)}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-5">
        <PageHeader
          title="Цех 2"
          description={PAGE_SUBTITLE}
          className="mb-0 border-b border-slate-200/80 pb-4"
          actions={
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    aria-label="История действий"
                    onClick={() => {
                      setHistoryEntries(loadWorkshop2Activity());
                      setHistoryOpen(true);
                    }}
                  >
                    <History className="h-4 w-4" aria-hidden />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">История</TooltipContent>
              </Tooltip>
              {listTab === 'active' ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-1.5 text-[10px] font-black uppercase"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Создать коллекцию
                </Button>
              ) : (
                <span className="max-w-[14rem] text-[10px] leading-snug text-slate-500">
                  Архив хранится в этом браузере.
                </span>
              )}
            </div>
          }
        />

        <details className="group rounded-lg border border-slate-200 bg-slate-50/80 shadow-sm">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
            <ClipboardList className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
            <span>Пилот Цеха 2 — чеклист и обратная связь</span>
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
          </summary>
          <div className="space-y-3 border-t border-slate-200 bg-white px-3 py-3 text-[11px] leading-snug text-slate-700">
            <ol className="list-decimal space-y-1.5 pl-4">
              <li>Создайте коллекцию и добавьте SKU — данные остаются в этом браузере.</li>
              <li>Откройте артикул → ТЗ: заполните паспорт, SLA по ролям и материалы (BOM).</li>
              <li>Поставьте метки на скетче; при необходимости привяжите ref к строке из досье.</li>
              <li>Согласуйте цифровые подписи и скачайте PDF handoff для передачи в цех.</li>
              <li>
                Зафиксируйте замечания по пилоту — письмом или в переписке с командой продукта.
              </li>
            </ol>
            <a
              className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline"
              href={`mailto:?subject=${encodeURIComponent('Пилот Цеха 2 — обратная связь')}&body=${encodeURIComponent('Коллекция / SKU:\n\nЧто сработало:\n\nЧто мешает:\n')}`}
            >
              Открыть шаблон письма (mailto)
            </a>
          </div>
        </details>

        <Tabs
          value={listTab}
          onValueChange={(v) => {
            const t = v as 'active' | 'archive';
            if (t !== listTab) {
              appendWorkshop2Activity(
                t === 'archive' ? 'Вкладка: Архив' : 'Вкладка: Активные',
                createdByLabel
              );
            }
            setListTab(t);
          }}
          className="w-full"
        >
          <div className="flex flex-wrap items-center gap-3">
            <TabsList className="h-9">
              <TabsTrigger value="active" className="px-3 text-xs">
                Активные
              </TabsTrigger>
              <TabsTrigger value="archive" className="px-3 text-xs">
                Архив
              </TabsTrigger>
            </TabsList>
          </div>

          <FilterToolbar className="mt-3 border-slate-200 bg-slate-50/70 p-2 sm:p-2.5">
            <div className="flex w-full min-w-0 flex-wrap items-end gap-x-2 gap-y-2 sm:gap-x-2.5">
              <div className="grid w-[min(100%,11.5rem)] min-w-0 shrink-0 gap-0.5 sm:w-[min(100%,12.5rem)]">
                <span className="text-[8px] font-semibold uppercase leading-none tracking-wide text-slate-500">
                  Фильтр по коллекции
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      title="Подборки на этой вкладке. Остаются только карточки выбранных коллекций."
                      className="h-9 w-full justify-between gap-1.5 px-2.5 text-left text-xs font-normal"
                    >
                      <span className="truncate text-slate-700">
                        {collectionOptionsForGridFilter.length === 0
                          ? 'Нет коллекций'
                          : gridSelectedCollectionIds.size === 0
                            ? 'Коллекции…'
                            : `Выбрано: ${gridSelectedCollectionIds.size}`}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[min(100vw-2rem,26rem)] p-0" align="start">
                    {collectionOptionsForGridFilter.length === 0 ? (
                      <p className="p-3 text-[11px] text-slate-500">
                        Нет коллекций на этой вкладке.
                      </p>
                    ) : (
                      <div className="max-h-64 space-y-1 overflow-y-auto p-2">
                        {collectionOptionsForGridFilter.map((opt, idx) => {
                          const checkId = `w2-grid-col-${opt.id}-${idx}`;
                          return (
                            <div
                              key={opt.id}
                              className="flex w-full min-w-0 items-start gap-2 rounded-md py-1.5 pl-1 pr-0.5 hover:bg-slate-50"
                            >
                              <Checkbox
                                id={checkId}
                                checked={gridSelectedCollectionIds.has(opt.id)}
                                onCheckedChange={() => {
                                  setGridSelectedCollectionIds((prev) => {
                                    const n = new Set(prev);
                                    if (n.has(opt.id)) n.delete(opt.id);
                                    else n.add(opt.id);
                                    return n;
                                  });
                                }}
                                className="mt-0.5 shrink-0"
                              />
                              <label
                                htmlFor={checkId}
                                className="min-w-0 flex-1 cursor-pointer text-left leading-snug"
                              >
                                <span className="block text-[11px] font-medium text-slate-900">
                                  {opt.displayName}
                                </span>
                                <span className="mt-0.5 block font-mono text-[9px] text-slate-500">
                                  {opt.id}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid w-[min(100%,11.5rem)] min-w-0 shrink-0 gap-0.5 sm:w-[min(100%,12.5rem)]">
                <span className="text-[8px] font-semibold uppercase leading-none tracking-wide text-slate-500">
                  Фильтр по артикулу
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      title="Список из каталога заказа и локальных подборок. Остаются карточки коллекций, где есть выбранный артикул."
                      className="h-9 w-full justify-between gap-1.5 px-2.5 text-left text-xs font-normal"
                    >
                      <span className="truncate text-slate-700">
                        {skuCatalogForFilters.length === 0
                          ? 'Нет в каталоге'
                          : gridSelectedSkus.size === 0
                            ? 'Артикулы…'
                            : `Выбрано: ${gridSelectedSkus.size}`}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[min(100vw-2rem,26rem)] p-0" align="start">
                    {skuCatalogForFilters.length === 0 ? (
                      <p className="p-3 text-[11px] text-slate-500">
                        В каталоге заказа пока нет артикулов для фильтра.
                      </p>
                    ) : (
                      <div className="max-h-64 space-y-1 overflow-y-auto p-2">
                        {skuCatalogForFilters.map((row, idx) => {
                          const facetLine = [
                            row.audienceLabel?.trim() || '—',
                            `L1 ${row.categoryL1?.trim() || '—'}`,
                            `L2 ${row.categoryL2?.trim() || '—'}`,
                            `L3 ${row.categoryL3?.trim() || '—'}`,
                          ].join(' · ');
                          const checkId = `w2-grid-sku-${idx}`;
                          return (
                            <Tooltip key={row.skuNorm}>
                              <TooltipTrigger asChild>
                                <div className="flex w-full min-w-0 cursor-default items-start gap-2 rounded-md py-1.5 pl-1 pr-0.5 hover:bg-slate-50">
                                  <Checkbox
                                    id={checkId}
                                    checked={gridSelectedSkus.has(row.skuNorm)}
                                    onCheckedChange={() => {
                                      setGridSelectedSkus((prev) => {
                                        const n = new Set(prev);
                                        if (n.has(row.skuNorm)) n.delete(row.skuNorm);
                                        else n.add(row.skuNorm);
                                        return n;
                                      });
                                    }}
                                    className="mt-0.5 shrink-0"
                                  />
                                  <label
                                    htmlFor={checkId}
                                    className="min-w-0 flex-1 cursor-pointer text-left leading-snug"
                                  >
                                    <span className="block font-mono text-[11px] font-medium text-slate-900">
                                      {row.skuLabel}
                                    </span>
                                    <span className="mt-0.5 block text-[9px] text-slate-500">
                                      {facetLine}
                                    </span>
                                  </label>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="max-w-[min(92vw,260px)] border-slate-200 bg-white p-2 shadow-lg"
                              >
                                {row.thumb ? (
                                  <div className="space-y-1.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={row.thumb}
                                      alt={row.skuLabel}
                                      className="max-h-44 w-full max-w-[220px] rounded-md object-contain"
                                    />
                                    <p className="font-mono text-[10px] font-medium text-slate-800">
                                      {row.skuLabel}
                                    </p>
                                    <p className="text-[9px] leading-snug text-slate-500">
                                      {facetLine}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="max-w-[220px] space-y-1">
                                    <p className="text-[11px] text-slate-600">
                                      Нет фото во вложениях позиции
                                    </p>
                                    <p className="font-mono text-[9px] text-slate-600">
                                      {row.skuLabel}
                                    </p>
                                    <p className="text-[9px] leading-snug text-slate-500">
                                      {facetLine}
                                    </p>
                                  </div>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid w-[min(100%,11.5rem)] min-w-0 shrink-0 gap-0.5 sm:w-[min(100%,12.5rem)]">
                <span className="text-[8px] font-semibold uppercase leading-none tracking-wide text-slate-500">
                  Поиск по странице
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full gap-1.5 text-xs font-normal"
                  onClick={() => {
                    setGlobalSearchQuery('');
                    setGlobalSearchOpen(true);
                  }}
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
                  Найти…
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0 px-3 text-[10px] font-semibold"
                onClick={() => {
                  setGridSelectedCollectionIds(new Set());
                  setGridSelectedSkus(new Set());
                }}
              >
                Сбросить фильтры
              </Button>
              <div className="flex h-9 min-w-0 flex-1 basis-full items-center justify-end border-t border-slate-200/60 pt-2 sm:basis-auto sm:border-0 sm:pt-0">
                <p className="whitespace-nowrap text-right text-[10px] text-slate-500">
                  Показано{' '}
                  <span className="font-semibold tabular-nums text-slate-800">
                    {filteredCollectionsCount}/{collectionsForCurrentTab.length}
                  </span>
                </p>
              </div>
            </div>
          </FilterToolbar>

          <TabsContent value="active" className="mt-4">
            {activeCollections.length === 0 ? (
              <EmptyState
                title="Нет активных коллекций"
                description="Создайте подборку или восстановите запись из архива."
              >
                <Button
                  type="button"
                  size="sm"
                  className="h-9 gap-1.5 text-[10px] font-black uppercase"
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Создать коллекцию
                </Button>
              </EmptyState>
            ) : (
              renderCollectionGrid(activeCollections, 'active')
            )}
          </TabsContent>

          <TabsContent value="archive" className="mt-4">
            {archivedCollections.length === 0 ? (
              <EmptyState
                title="В архиве пусто"
                description="Переключитесь на активные коллекции или восстановите запись."
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[10px] font-semibold"
                  onClick={() => setListTab('active')}
                >
                  К активным
                </Button>
              </EmptyState>
            ) : (
              renderCollectionGrid(archivedCollections, 'archive')
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={globalSearchOpen} onOpenChange={setGlobalSearchOpen}>
          <DialogContent
            className="flex max-h-[85vh] flex-col sm:max-w-lg"
            aria-describedby="w2-glob-search-desc"
          >
            <DialogHeader>
              <DialogTitle>Поиск по странице</DialogTitle>
              <DialogDescription id="w2-glob-search-desc" className="text-left text-[11px]">
                По названию и коду коллекции, SKU, названию артикула, комментарию и аудитории на
                этой странице. Минимум 2 символа. Клик по строке откроет коллекцию.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Input
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Например SS27 или пальто"
                className="text-sm"
                aria-label="Строка поиска"
              />
              <div className="max-h-[50vh] min-h-0 flex-1 overflow-y-auto rounded-md border border-slate-100 bg-slate-50/50">
                {globalSearchQuery.trim().length < 2 ? (
                  <p className="p-3 text-[11px] text-slate-500">Введите не менее двух символов.</p>
                ) : globalSearchResults.length === 0 ? (
                  <p className="p-3 text-[11px] text-slate-500">Совпадений нет.</p>
                ) : (
                  <ul className="divide-y divide-slate-100 text-[11px]">
                    {globalSearchResults.map((r, idx) => (
                      <li key={`${r.collectionId}-${r.field}-${idx}`}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left transition-colors hover:bg-white"
                          onClick={() => {
                            setGlobalSearchOpen(false);
                            replaceQuery((p) => {
                              p.set(WORKSHOP2_COL_PARAM, r.collectionId);
                              p.delete(WORKSHOP2_ART_PARAM);
                              p.delete(WORKSHOP2_STEP_PARAM);
                            });
                          }}
                        >
                          <span className="font-semibold text-slate-900">{r.collectionName}</span>
                          <span className="text-slate-500"> · {r.field}</span>
                          <span className="mt-0.5 block truncate text-slate-600">{r.snippet}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGlobalSearchOpen(false)}>
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            setCreateOpen(open);
            if (!open) resetCreateDialog();
          }}
        >
          <DialogContent
            className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
            aria-describedby="workshop2-create-desc"
          >
            <DialogHeader>
              <DialogTitle>Новая коллекция</DialogTitle>
              <DialogDescription id="workshop2-create-desc">
                Данные сохраняются локально в браузере.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="w2-new-name">Название</Label>
                <Input
                  id="w2-new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Например, SS28 Resort"
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-new-code">Код коллекции (необязательно)</Label>
                <Input
                  id="w2-new-code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="SS28-RESORT — если пусто, сгенерируем из названия"
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-cover">Обложка карточки (необязательно)</Label>
                <Input
                  id="w2-cover"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer text-sm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setCoverError(null);
                    if (!f) {
                      setCoverFile(null);
                      if (coverPreview) URL.revokeObjectURL(coverPreview);
                      setCoverPreview(null);
                      return;
                    }
                    if (f.size > 900_000) {
                      setCoverError('Файл больше ~900 КБ — выберите изображение меньшего размера.');
                      e.target.value = '';
                      return;
                    }
                    setCoverFile(f);
                    if (coverPreview) URL.revokeObjectURL(coverPreview);
                    setCoverPreview(URL.createObjectURL(f));
                  }}
                />
                {coverError ? <p className="text-[10px] text-red-600">{coverError}</p> : null}
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreview}
                    alt="Предпросмотр обложки"
                    className="mt-1 max-h-28 w-full rounded-md border border-slate-200 object-cover"
                  />
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-new-desc">Описание (необязательно)</Label>
                <Textarea
                  id="w2-new-desc"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Тема, канал, сроки…"
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] leading-snug text-slate-500">
                  Канал: выберите значение из подсказок или введите свой.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
                  <div className="grid gap-1.5">
                    <Label htmlFor="w2-new-tseason">Целевой сезон (необязательно)</Label>
                    <Input
                      id="w2-new-tseason"
                      value={newTargetSeason}
                      onChange={(e) => setNewTargetSeason(e.target.value)}
                      placeholder="Напр. SS29"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="w2-new-tch">Канал (необязательно)</Label>
                    <Input
                      id="w2-new-tch"
                      list="w2-new-channel-datalist"
                      value={newTargetChannel}
                      onChange={(e) => setNewTargetChannel(e.target.value)}
                      placeholder="Выберите из списка или введите канал…"
                      className="text-sm"
                      autoComplete="off"
                    />
                    <datalist id="w2-new-channel-datalist">
                      {WORKSHOP2_TARGET_CHANNEL_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-new-drop">Дедлайн дропа (необязательно)</Label>
                <Input
                  id="w2-new-drop"
                  type="datetime-local"
                  value={newDropDeadline}
                  onChange={(e) => setNewDropDeadline(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-new-team">Заметка для команды (необязательно)</Label>
                <Textarea
                  id="w2-new-team"
                  value={newTeamNote}
                  onChange={(e) => setNewTeamNote(e.target.value)}
                  placeholder="Контекст, ссылки, кто отвечает…"
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-100 bg-slate-50/80 px-2 py-2">
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPanelAccentOn}
                    onChange={(e) => setNewPanelAccentOn(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Метка цвета в панели артикулов
                </label>
                {newPanelAccentOn ? (
                  <input
                    type="color"
                    value={newPanelAccent}
                    onChange={(e) => setNewPanelAccent(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    aria-label="Цвет метки"
                  />
                ) : null}
              </div>
              <p className="text-[10px] text-slate-500">
                Автор: <strong className="text-slate-700">{createdByLabel}</strong> · время —
                автоматически.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Отмена
              </Button>
              <Button
                type="button"
                onClick={() => void submitNewCollection()}
                disabled={!newName.trim() || !!coverError}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) resetEditDialog();
          }}
        >
          <DialogContent
            className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
            aria-describedby="workshop2-edit-desc"
          >
            <DialogHeader>
              <DialogTitle>Редактировать коллекцию</DialogTitle>
              <DialogDescription id="workshop2-edit-desc">
                Изменения сохраняются локально в браузере. Код коллекции не меняется.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="w2-edit-name">Название</Label>
                <Input
                  id="w2-edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Название коллекции"
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-edit-code">Код коллекции</Label>
                <Input
                  id="w2-edit-code"
                  value={editCode}
                  readOnly
                  className="bg-slate-50 font-mono text-sm text-slate-600"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-edit-cover">Обложка карточки</Label>
                <Input
                  id="w2-edit-cover"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer text-sm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setEditCoverError(null);
                    if (!f) {
                      setEditCoverFile(null);
                      return;
                    }
                    if (f.size > 900_000) {
                      setEditCoverError(
                        'Файл больше ~900 КБ — выберите изображение меньшего размера.'
                      );
                      e.target.value = '';
                      return;
                    }
                    setEditRemoveCover(false);
                    setEditCoverFile(f);
                  }}
                />
                {editCoverError ? (
                  <p className="text-[10px] text-red-600">{editCoverError}</p>
                ) : null}
                <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={editRemoveCover}
                    onChange={(e) => {
                      setEditRemoveCover(e.target.checked);
                      if (e.target.checked) setEditCoverFile(null);
                    }}
                    className="rounded border-slate-300"
                  />
                  Снять обложку
                </label>
                {!editRemoveCover && (editCoverPreview || editExistingCoverUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={editCoverPreview ?? editExistingCoverUrl ?? ''}
                    alt="Предпросмотр обложки"
                    className="mt-1 max-h-28 w-full rounded-md border border-slate-200 object-cover"
                  />
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-edit-desc">Описание (необязательно)</Label>
                <Textarea
                  id="w2-edit-desc"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Тема, канал, сроки…"
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] leading-snug text-slate-500">
                  Канал: выберите значение из подсказок или введите свой.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
                  <div className="grid gap-1.5">
                    <Label htmlFor="w2-edit-tseason">Целевой сезон (необязательно)</Label>
                    <Input
                      id="w2-edit-tseason"
                      value={editTargetSeason}
                      onChange={(e) => setEditTargetSeason(e.target.value)}
                      placeholder="Напр. SS29"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="w2-edit-tch">Канал (необязательно)</Label>
                    <Input
                      id="w2-edit-tch"
                      list="w2-edit-channel-datalist"
                      value={editTargetChannel}
                      onChange={(e) => setEditTargetChannel(e.target.value)}
                      placeholder="Выберите из списка или введите канал…"
                      className="text-sm"
                      autoComplete="off"
                    />
                    <datalist id="w2-edit-channel-datalist">
                      {WORKSHOP2_TARGET_CHANNEL_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-edit-drop">Дедлайн дропа (необязательно)</Label>
                <Input
                  id="w2-edit-drop"
                  type="datetime-local"
                  value={editDropDeadline}
                  onChange={(e) => setEditDropDeadline(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w2-edit-team">Заметка для команды (необязательно)</Label>
                <Textarea
                  id="w2-edit-team"
                  value={editTeamNote}
                  onChange={(e) => setEditTeamNote(e.target.value)}
                  placeholder="Контекст, ссылки, кто отвечает…"
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-100 bg-slate-50/80 px-2 py-2">
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={editPanelAccentOn}
                    onChange={(e) => setEditPanelAccentOn(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Метка цвета в панели артикулов
                </label>
                {editPanelAccentOn ? (
                  <input
                    type="color"
                    value={editPanelAccent}
                    onChange={(e) => setEditPanelAccent(e.target.value)}
                    className="h-8 w-14 cursor-pointer rounded border border-slate-200 bg-white p-0.5"
                    aria-label="Цвет метки"
                  />
                ) : null}
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Отмена
              </Button>
              <Button
                type="button"
                onClick={() => void submitEditUserCollection()}
                disabled={!editName.trim() || !!editCoverError}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!articleNotesTarget}
          onOpenChange={(open) => {
            if (!open) setArticleNotesTarget(null);
          }}
        >
          <DialogContent className="sm:max-w-md" aria-describedby="w2-art-notes-desc">
            <DialogHeader>
              <DialogTitle className="font-mono text-base">
                Заметки по артикулу · {articleNotesTarget?.sku}
              </DialogTitle>
              <DialogDescription id="w2-art-notes-desc" className="text-left text-[11px]">
                Текст для команды по этой позиции. Сохраняется локально в этом браузере.
              </DialogDescription>
            </DialogHeader>
            {articleNotesTarget ? (
              <div className="grid gap-3 py-1">
                <div className="grid gap-1.5">
                  <Label htmlFor="w2-art-notes-body">Заметка</Label>
                  <Textarea
                    id="w2-art-notes-body"
                    value={articleNotesTarget.draft}
                    onChange={(e) =>
                      setArticleNotesTarget((prev) =>
                        prev ? { ...prev, draft: e.target.value } : prev
                      )
                    }
                    rows={6}
                    className="resize-none text-sm"
                    placeholder="Контекст, ссылки, напоминания…"
                  />
                </div>
              </div>
            ) : null}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setArticleNotesTarget(null)}>
                Отмена
              </Button>
              <Button type="button" onClick={() => submitArticleNotes()}>
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={bulkOpen}
          onOpenChange={(o) => {
            setBulkOpen(o);
            if (!o) {
              setBulkText('');
              setBulkCol(null);
            }
          }}
        >
          <DialogContent
            className="flex max-h-[90vh] flex-col sm:max-w-lg"
            aria-describedby="w2-bulk-desc"
          >
            <DialogHeader>
              <DialogTitle>Массовое добавление · {bulkCol?.displayName ?? ''}</DialogTitle>
              <DialogDescription id="w2-bulk-desc" className="text-left text-[11px]">
                Вставьте список SKU или «SKU;название» / через табуляцию / CSV. Дубликаты в тексте и
                в коллекции отсеиваются. Категория по умолчанию — первая из справочника (можно
                сменить в карточке артикула позже).
              </DialogDescription>
            </DialogHeader>
            <div className="grid min-h-0 flex-1 gap-2">
              <div className="space-y-2 rounded-md border border-slate-200 bg-white p-2.5 text-[10px]">
                <p className="font-semibold text-slate-800">Файл для загрузки (CSV / TSV, UTF-8)</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[280px] border-collapse text-left text-[9px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="p-1.5 font-semibold">Столбец</th>
                        <th className="p-1.5 font-semibold">Что заполнять</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-slate-100">
                        <td className="p-1.5 align-top font-mono">A — SKU</td>
                        <td className="p-1.5">Код артикула (обязательно)</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 align-top font-mono">B — name</td>
                        <td className="p-1.5">Рабочее название (необязательно)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="leading-snug text-slate-600">
                  Первая строка может быть заголовком{' '}
                  <code className="rounded bg-slate-100 px-1 font-mono">SKU name</code> — если в
                  первом столбце нет кода SKU, строка будет пропущена. Разделитель: табуляция, «;»
                  или «,».
                </p>
                <p className="text-slate-500">
                  Пример строки данных:{' '}
                  <code className="break-all rounded bg-slate-100 px-1 font-mono">
                    SS28-TOP-01[таб]Лонгслив базовый
                  </code>
                </p>
                <div>
                  <Label htmlFor="w2-bulk-file" className="text-[10px] text-slate-500">
                    Загрузить файл
                  </Label>
                  <Input
                    id="w2-bulk-file"
                    type="file"
                    accept=".csv,.txt,text/csv,text/plain"
                    className="mt-1 h-auto cursor-pointer py-1 text-[10px]"
                    onChange={(ev) => {
                      const f = ev.target.files?.[0];
                      ev.target.value = '';
                      if (!f) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setBulkText(typeof reader.result === 'string' ? reader.result : '');
                      };
                      reader.readAsText(f, 'UTF-8');
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-[10px]"
                  onClick={() => {
                    void navigator.clipboard.readText().then(
                      (t) => setBulkText(t),
                      () => {}
                    );
                  }}
                >
                  Вставить из буфера
                </Button>
              </div>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={'SS28-TST-01\nSS28-TST-02;Рабочее название'}
                rows={8}
                className="min-h-[140px] font-mono text-xs"
                aria-label="Список SKU для импорта"
              />
              {(() => {
                const preview = bulkText.trim() ? parseWorkshop2BulkPaste(bulkText) : [];
                if (preview.length === 0) {
                  return (
                    <p className="text-[10px] text-slate-500">Предпросмотр появится после ввода.</p>
                  );
                }
                return (
                  <div className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50/80 text-[10px]">
                    <p className="border-b border-slate-200 px-2 py-1 font-semibold text-slate-700">
                      К добавлению: {preview.length} поз. (дубли в тексте убраны)
                    </p>
                    <ul className="divide-y divide-slate-100">
                      {preview.slice(0, 20).map((r) => (
                        <li key={r.sku} className="flex gap-2 px-2 py-1">
                          <span className="shrink-0 font-mono font-bold">{r.sku}</span>
                          {r.name ? (
                            <span className="truncate text-slate-600">{r.name}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                    {preview.length > 20 ? (
                      <p className="px-2 py-1 text-slate-500">… и ещё {preview.length - 20}</p>
                    ) : null}
                  </div>
                );
              })()}
            </div>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setBulkOpen(false)}>
                Отмена
              </Button>
              <Button
                type="button"
                disabled={!bulkCol || parseWorkshop2BulkPaste(bulkText).length === 0}
                onClick={() => {
                  if (!bulkCol) return;
                  const parsed = parseWorkshop2BulkPaste(bulkText);
                  if (parsed.length === 0) return;
                  const r = onBulkAddWorkshop2Articles(bulkCol.id, parsed);
                  appendWorkshop2Activity(
                    `Массово добавлено в «${bulkCol.displayName}»: ${r.added} арт., пропущено дублей ${r.skippedDuplicates}`,
                    createdByLabel
                  );
                  setBulkOpen(false);
                  setBulkText('');
                  setBulkCol(null);
                }}
              >
                Добавить в коллекцию
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!archiveConfirm}
          onOpenChange={(o) => {
            if (!o) setArchiveConfirm(null);
          }}
        >
          <DialogContent className="sm:max-w-md" aria-describedby="w2-archive-desc">
            <DialogHeader>
              <DialogTitle>Убрать в архив?</DialogTitle>
              <DialogDescription id="w2-archive-desc" className="space-y-2 text-left">
                <span className="block">
                  Коллекция «{archiveConfirm?.displayName ?? ''}» исчезнет из активных списков.
                  Артикулы и данные сохранятся в этом браузере.
                </span>
                {archiveConfirm?.isSs27 ? (
                  <span className="block text-[12px] text-amber-800/90">
                    Это демо-подборка SS27: после архива она не будет закреплена первой на экране,
                    пока не восстановите её из вкладки «Архив».
                  </span>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setArchiveConfirm(null)}>
                Отмена
              </Button>
              <Button type="button" variant="default" onClick={confirmArchive}>
                Убрать в архив
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent
            className="flex max-h-[85vh] flex-col sm:max-w-lg"
            aria-describedby="w2-history-desc"
          >
            <DialogHeader>
              <DialogTitle>История</DialogTitle>
              <DialogDescription id="w2-history-desc">
                Создания, архив, восстановления, открытия списков и артикулов — локально в браузере.
                У старых записей автор может быть не указан.
              </DialogDescription>
            </DialogHeader>
            <div className="grid shrink-0 gap-2 sm:grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="w2-hist-from" className="text-[10px] text-slate-500">
                  С даты
                </Label>
                <Input
                  id="w2-hist-from"
                  type="date"
                  value={historyDateFrom}
                  onChange={(e) => setHistoryDateFrom(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="w2-hist-to" className="text-[10px] text-slate-500">
                  По дату
                </Label>
                <Input
                  id="w2-hist-to"
                  type="date"
                  value={historyDateTo}
                  onChange={(e) => setHistoryDateTo(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid gap-1 sm:col-span-2">
                <Label htmlFor="w2-hist-actor" className="text-[10px] text-slate-500">
                  Автор
                </Label>
                <select
                  id="w2-hist-actor"
                  value={historyActorFilter}
                  onChange={(e) => setHistoryActorFilter(e.target.value)}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                >
                  <option value="__all__">Все авторы</option>
                  <option value="__no_actor__">Без автора (старые записи)</option>
                  {historyActors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-slate-100 bg-slate-50/50">
              {historyEntries.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-500">Пока нет записей.</p>
              ) : historyFiltered.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-500">
                  Нет записей по выбранным фильтрам.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 text-[11px]">
                  {historyFiltered.map((e) => (
                    <li key={e.id} className="px-3 py-2.5 leading-snug text-slate-800">
                      <span className="mb-0.5 block text-[10px] tabular-nums text-slate-400">
                        {new Date(e.at).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="mb-0.5 block text-[10px] font-semibold text-indigo-700">
                        {e.actor?.trim() ? e.actor : '—'}
                      </span>
                      {e.line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="text-slate-600"
                onClick={() => {
                  clearWorkshop2Activity();
                  setHistoryEntries([]);
                }}
                disabled={historyEntries.length === 0}
              >
                Очистить историю
              </Button>
              <Button type="button" onClick={() => setHistoryOpen(false)}>
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Workshop2CreateArticleDialog
          open={!!articleDialogCol || !!articleEditTarget}
          onOpenChange={(o) => {
            if (!o) {
              setArticleDialogCol(null);
              setArticleEditTarget(null);
            }
          }}
          collectionId={articleDialogCol?.id ?? articleEditTarget?.collectionId ?? ''}
          collectionDisplayName={
            articleDialogCol?.displayName ?? articleEditTarget?.displayName ?? ''
          }
          pickerLines={articlePickerLines}
          onCommit={onCommitWorkshop2Article}
          editArticle={
            articleEditTarget
              ? {
                  articleId: articleEditTarget.articleId,
                  sku: articleEditTarget.sku,
                  name: articleEditTarget.name,
                  comment: articleEditTarget.comment,
                  categoryLeafId: articleEditTarget.categoryLeafId,
                  workshopAttachments: articleEditTarget.workshopAttachments,
                }
              : null
          }
          onSaveEdit={(collectionId, articleId, data) =>
            onPatchWorkshop2ArticleLine(collectionId, articleId, {
              name: data.name,
              workshopComment: data.workshopComment,
              categoryLeafId: data.categoryLeafId,
              workshopAttachments: data.workshopAttachments,
            })
          }
          activityActorLabel={createdByLabel}
        />
      </div>
    </TooltipProvider>
  );
}
