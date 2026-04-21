'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workshop2Phase1DossierPanel } from '@/components/brand/production/Workshop2Phase1DossierPanel';
import { findHandbookLeafById, getHandbookCategoryLeaves } from '@/lib/production/category-catalog';
import {
  calculateDossierReadiness,
  type DossierSection,
} from '@/lib/production/dossier-readiness-engine';
import {
  getLifecycleStateLabel,
  getLifecycleStateBadgeClass,
} from '@/lib/production/dossier-lifecycle';
import { getAqlPlan } from '@/lib/production/aql-standards';
import {
  formatWorkshop2InternalArticleCodePlaceholder,
  isWorkshop2InternalArticleCodeValid,
} from '@/lib/production/local-collection-inventory';
import {
  W2_ARTICLE_SECTION_DOM,
  WORKSHOP2_ARTICLE_PANE_PARAM,
  WORKSHOP2_DOSSIER_SECTION_PARAM,
  WORKSHOP2_DOSSIER_VIEW_PARAM,
  WORKSHOP2_STEP_PARAM,
  parseWorkshop2ArticlePaneParam,
  workshop2ArticleHref,
  workshop2ArticlePath,
  workshop2ArticleUrlSegment,
  workshop2CollectionListHref,
} from '@/lib/production/workshop2-url';
import {
  persistWorkshop2DossierViewPreference,
  resolveWorkshop2DossierViewFromWorkspaceUrl,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import { Workshop2DossierViewProvider } from '@/components/brand/production/workshop2-dossier-view-context';
import { Workshop2DossierViewModeSelect } from '@/components/brand/production/Workshop2DossierViewModeSelect';
import { ROUTES } from '@/lib/routes';
import { COLLECTION_DEV_HUB_TITLE_RU } from '@/lib/production/collection-development-labels';
import {
  appendWorkshop2ArticleActivity,
  buildWorkshop2ArticleProductionHistory,
} from '@/lib/production/workshop2-activity-log';
import { cn } from '@/lib/utils';
import type { Workshop2ArticleLinePatch } from '@/lib/production/local-collection-inventory';
import type { Workshop2CollectionListItem } from '@/components/brand/production/Workshop2TabContent';
import {
  ArticleWorkspaceProvider,
  useArticleWorkspace,
} from '@/components/brand/production/article-workspace-context';
import { useAuth } from '@/providers/auth-provider';
import { flushW2NextStepFeedbackToServer } from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  buildW2NextStepMlSnapshot,
  w2ReadNextStepMlBuffer,
  w2UpsertNextStepMlBuffer,
} from '@/lib/production/workshop2-dossier-next-step-telemetry';
import { Workshop2ArticleWorkspaceTabPanels } from '@/components/brand/production/Workshop2ArticleWorkspaceTabPanels';
import { useWorkshop2TzDueNotifications } from '@/hooks/use-workshop2-tz-due-notifications';
import { useRbac } from '@/hooks/useRbac';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import { mergeSs27DemoDossierIfNeeded } from '@/lib/production/workshop2-ss27-demo-full-tz-dossier';
import { WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES } from '@/lib/production/workshop2-tz-digital-signoff';
import type {
  Workshop2DossierPhase1,
  Workshop2PassportVisualSource,
  Workshop2TzSignatoryBindings,
  Workshop2TzSignatoryExtraRow,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshopTzSignatoryPickerOptions,
  normalizeWorkshopTzSignatoryBindings,
  WORKSHOP2_TZ_EXTRA_ROLE_PRESET_BUTTON_LABEL_RU,
  WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS,
  workshop2TzExtraRowFromPreset,
  workshopTzLabelsMatch,
  workshopTzSelectedStageIds,
  workshopTzSignStagesFromSelection,
  workshopTzStageExpectedSigners,
  type Workshop2TzExtraRolePresetId,
} from '@/lib/production/workshop2-tz-signatory-options';
import {
  buildWorkshop2OverviewModel,
  formatWorkshop2StageEyebrow,
  toWorkshop2OverviewBundleSnapshot,
  WORKSHOP2_DOSSIER_SECTION_GUIDANCE,
  WORKSHOP2_ROUTE_STAGE_GUIDANCE,
  type Workshop2OverviewBlocker,
  type Workshop2OverviewDecisionItem,
  type Workshop2OverviewPrimaryAction,
  type Workshop2OverviewRouteStage,
  type Workshop2OverviewTab,
} from '@/lib/production/workshop2-overview-model';
import {
  workshop2PipelineLaneForArticleMainTab,
  workshop2PipelineLaneForTzSignoffStage,
  workshop2PipelineLaneLabelRu,
  type Workshop2ArticleMainTab,
  type Workshop2PipelineLane,
} from '@/lib/production/workshop2-collection-metrics';
import {
  visualReadinessProgress,
  visualReadinessHints,
} from '@/lib/production/workshop2-visual-excellence';
import { buildWorkshop2VisualGateItems } from '@/lib/production/workshop2-visual-section-warnings';
import { isSketchFloorInSearch } from '@/lib/production/sketch-floor-url';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SectionContainer } from '@/components/design-system';

type MainTab = Workshop2ArticleMainTab;

const W2_PASSPORT_TZ_STAGE_DEFS: { id: Workshop2TzSignoffStageId; label: string }[] = [
  { id: 'tz', label: 'ТЗ' },
  { id: 'sample', label: 'Обр.' },
  { id: 'supply', label: 'Снб.' },
  { id: 'fit', label: 'Пос.' },
  { id: 'plan', label: 'Пл.' },
  { id: 'release', label: 'Вып.' },
  { id: 'qc', label: 'ОТК' },
];

const W2_PASSPORT_TZ_STAGE_ORDER: Workshop2TzSignoffStageId[] = W2_PASSPORT_TZ_STAGE_DEFS.map(
  (d) => d.id
);

function mainTabToSignoffStage(tab: MainTab): Workshop2TzSignoffStageId | null {
  switch (tab) {
    case 'overview':
      return 'sample';
    case 'tz':
      return null;
    case 'supply':
      return 'supply';
    case 'fit':
      return 'fit';
    case 'plan':
      return 'plan';
    case 'release':
      return 'release';
    case 'qc':
      return 'qc';
    default:
      return null;
  }
}

function W2PassportTzStagesPick({
  idPrefix,
  selectedIds,
  onChange,
}: {
  idPrefix: string;
  selectedIds: Workshop2TzSignoffStageId[];
  onChange: (ids: Workshop2TzSignoffStageId[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const sel = new Set(selectedIds);
  const selectionTitle =
    selectedIds.length === 0
      ? 'Не выбран ни один этап'
      : W2_PASSPORT_TZ_STAGE_DEFS.filter((d) => sel.has(d.id))
          .map((d) => d.label)
          .join(', ');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={selectionTitle}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="text-text-primary hover:bg-bg-surface2 flex h-7 w-[5.5rem] shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md border border-input bg-background px-1 text-[10px] font-medium transition-colors"
        >
          <LucideIcons.ListFilter className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
          <span className="shrink-0">Этапы</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[11rem] p-2.5" sideOffset={6}>
        <p className="text-text-secondary mb-2 text-[9px] font-bold uppercase tracking-wide">
          Этапы маршрута
        </p>
        <p className="text-text-secondary mb-2 text-[9px] leading-snug">
          Снимите галочку — роль не участвует на этапе; включите снова, когда нужно.
        </p>
        <div className="max-h-[14rem] space-y-0.5 overflow-y-auto pr-0.5">
          {W2_PASSPORT_TZ_STAGE_DEFS.map(({ id, label }) => (
            <label
              key={id}
              className="text-text-primary hover:bg-bg-surface2 flex cursor-pointer items-center gap-2 rounded py-1 pl-0.5 pr-1 text-[10px]"
            >
              <input
                id={`${idPrefix}-${id}`}
                type="checkbox"
                className="border-border-default h-3 w-3 shrink-0 rounded"
                checked={sel.has(id)}
                onChange={(e) => {
                  const next = new Set(selectedIds);
                  if (e.target.checked) next.add(id);
                  else next.delete(id);
                  onChange(W2_PASSPORT_TZ_STAGE_ORDER.filter((sid) => next.has(sid)));
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PassportTzExtraAssigneeCard({
  ex,
  signatorySelectChildren,
  articleCardOwnerName,
  onPatchTitle,
  onPatchAssignee,
  onStagesChange,
  onRemove,
  toggleCardAdminForAssignee,
  canRemoveRow,
}: {
  ex: Workshop2TzSignatoryExtraRow;
  signatorySelectChildren: ReactNode;
  articleCardOwnerName: string;
  onPatchTitle: (title: string) => void;
  onPatchAssignee: (value: string) => void;
  onStagesChange: (ids: Workshop2TzSignoffStageId[]) => void;
  onRemove: () => void;
  toggleCardAdminForAssignee: (name: string | undefined, on: boolean) => void;
  /** Крестик «удалить роль»: только админ карточки и не строка, где этот человек отмечен как админ. */
  canRemoveRow: boolean;
}) {
  const [editingTitle, setEditingTitle] = useState(() => ex.roleTitle.trim() === 'Роль');
  const titleInputId = `w2-passport-tz-extra-title-${ex.rowId}`;
  const trimmedTitle = ex.roleTitle?.trim() ?? '';
  const exAssignee = ex.assigneeDisplayLabel?.trim() ?? '';
  const adminName = articleCardOwnerName.trim();
  const adminOn = Boolean(exAssignee && adminName && workshopTzLabelsMatch(exAssignee, adminName));

  useEffect(() => {
    if (!editingTitle) return;
    const el = document.getElementById(titleInputId) as HTMLInputElement | null;
    if (el) {
      el.focus();
      el.select();
    }
  }, [editingTitle, titleInputId]);

  return (
    <div className="border-border-subtle bg-bg-surface2/80 rounded-md border p-1.5">
      <div className="mb-1 flex min-w-0 items-center gap-1">
        {editingTitle ? (
          <Input
            id={titleInputId}
            className="h-7 min-w-0 flex-1 px-1.5 text-[11px]"
            value={ex.roleTitle}
            onChange={(e) => onPatchTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            placeholder="Название роли"
            aria-label="Название роли"
          />
        ) : (
          <button
            type="button"
            className="text-text-secondary hover:bg-bg-surface2 hover:text-text-primary min-h-[1rem] min-w-0 flex-1 truncate rounded px-0.5 py-0 text-left text-[9px] font-semibold leading-tight"
            onClick={() => setEditingTitle(true)}
            aria-label="Редактировать название роли"
          >
            {trimmedTitle || 'Название роли'}
          </button>
        )}
        {canRemoveRow ? (
          <button
            type="button"
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            onClick={onRemove}
            aria-label="Удалить роль"
          >
            <LucideIcons.X className="h-2 w-2" strokeWidth={2.75} aria-hidden />
          </button>
        ) : (
          <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
        )}
      </div>
      <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto">
        <select
          className="h-7 min-w-[7rem] flex-1 rounded-md border border-input bg-background px-1.5 text-[11px]"
          value={ex.assigneeDisplayLabel ?? ''}
          onChange={(e) => onPatchAssignee(e.target.value)}
          aria-label={`Ответственный: ${trimmedTitle || 'роль'}`}
        >
          {signatorySelectChildren}
        </select>
        <W2PassportTzStagesPick
          idPrefix={ex.rowId}
          selectedIds={workshopTzSelectedStageIds(ex.signStages, W2_PASSPORT_TZ_STAGE_ORDER)}
          onChange={onStagesChange}
        />
        <button
          type="button"
          disabled={!exAssignee}
          title="Администратор модели карточки SKU: один на артикул, можно снять"
          aria-pressed={adminOn}
          className={cn(
            'shrink-0 whitespace-nowrap rounded border px-1 py-0.5 text-[8px] font-semibold transition',
            !exAssignee && 'cursor-not-allowed opacity-35',
            adminOn
              ? 'border-accent-primary/40 bg-accent-primary/15 text-accent-primary'
              : 'border-border-default text-text-secondary hover:bg-bg-surface2 bg-white'
          )}
          onClick={() => toggleCardAdminForAssignee(exAssignee || undefined, !adminOn)}
        >
          Админ
        </button>
      </div>
    </div>
  );
}

function Workshop2StageSignatoryStrip({
  bindings,
  stage,
  className,
}: {
  bindings: Workshop2TzSignatoryBindings;
  stage: Workshop2TzSignoffStageId | null;
  className?: string;
}) {
  if (!stage) return null;
  const signers = workshopTzStageExpectedSigners(bindings, stage);
  if (signers.length === 0) return null;
  const signoffLane = workshop2PipelineLaneForTzSignoffStage(stage);
  return (
    <div
      className={cn(
        'border-border-default bg-bg-surface2/80 text-text-primary rounded-lg border px-3 py-2 text-[11px]',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wider">
          Подпись на этапе
        </p>
        <Badge
          variant="outline"
          title={
            signoffLane === 'development'
              ? 'Контур разработки: в каталоге этапов до якоря supply-path (в т.ч. tech-pack и gate-all-stakeholders)'
              : 'Контур сэмплов: в каталоге от якоря supply-path — снабжение, выпуск и шаг samples'
          }
          className={cn(
            'h-4 px-1 text-[8px] font-bold uppercase tracking-wide',
            signoffLane === 'development'
              ? 'border-indigo-200 bg-indigo-50 text-indigo-950'
              : 'border-teal-200 bg-teal-50 text-teal-950'
          )}
        >
          {workshop2PipelineLaneLabelRu(signoffLane)}
        </Badge>
      </div>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
        {signers.map((s) => (
          <li key={`${s.role}-${s.name}`}>
            <span className="text-text-secondary font-medium">{s.role}:</span> {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  collectionId: string;
  articleId: string;
  createdByLabel: string;
  activeCollections: Workshop2CollectionListItem[];
  archivedCollections: Workshop2CollectionListItem[];
  getArticlePipelineProgress: (
    collectionId: string,
    articleId: string
  ) => { done: number; total: number; pct: number };
  onPatchWorkshop2ArticleLine: (
    collectionId: string,
    articleId: string,
    patch: Workshop2ArticleLinePatch
  ) => boolean;
};

/** Кто может снять цифровые подписи подтверждений ТЗ (сравнение без регистра). Дополняется текущим пользователем сессии. */
const WORKSHOP2_DEFAULT_TZ_SIGNOFF_REVOKERS: readonly string[] = [
  'Генеральный директор',
  'Руководитель бренда',
  'Заместитель руководителя бренда',
  'Главный технолог',
];

type StageUiStatus =
  | 'not_started'
  | 'in_progress'
  | 'blocked'
  | 'ready_for_review'
  | 'approved'
  | 'handed_off';

// DossierSummary imported from dossier-readiness-engine

type RouteStageMeta = {
  id: MainTab;
  label: string;
  owner: string;
  status: StageUiStatus;
  pct: number;
  blocker?: string;
};

type OpenTabOpts = { dossierSection?: DossierSection };
type OpenTabWithFlashOpts = OpenTabOpts & {
  articleFlashId?: string | null;
  /** После смены вкладки: проскроллить к элементу и обновить hash (ТЗ / операционка). */
  scrollDomId?: string;
};

type DossierFlashState = null | { mode: 'main' } | { mode: 'section'; section: DossierSection };

const W2_DOSSIER_SECTION_IDS: readonly DossierSection[] = [
  'general',
  'visuals',
  'material',
  'construction',
];

function parseWorkshop2DossierSection(raw: string | null): DossierSection | null {
  if (!raw) return null;
  if (raw === 'measurements') return 'construction';
  if (raw === 'packaging') return 'material';
  return W2_DOSSIER_SECTION_IDS.includes(raw as DossierSection) ? (raw as DossierSection) : null;
}

function getRouteCardFootStatus(status: StageUiStatus): string {
  switch (status) {
    case 'not_started':
      return 'Черновик';
    case 'in_progress':
      return 'В работе';
    case 'blocked':
      return 'Блокер';
    case 'ready_for_review':
      return 'На проверке';
    case 'approved':
      return 'Завершено';
    case 'handed_off':
      return 'Передано';
    default:
      return '—';
  }
}

function getStatusLabel(status: StageUiStatus): string {
  switch (status) {
    case 'blocked':
      return 'Блокер';
    case 'in_progress':
      return 'В работе';
    case 'ready_for_review':
      return 'К проверке';
    case 'approved':
      return 'Согласовано';
    case 'handed_off':
      return 'Передано';
    default:
      return 'Не начато';
  }
}

function getStatusClass(status: StageUiStatus): string {
  switch (status) {
    case 'blocked':
      return 'border-rose-200 bg-rose-50 text-rose-800';
    case 'in_progress':
      return 'border-accent-primary/30 bg-accent-primary/10 text-accent-primary';
    case 'ready_for_review':
      return 'border-amber-200 bg-amber-50 text-amber-900';
    case 'approved':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'handed_off':
      return 'border-border-default bg-bg-surface2 text-text-primary';
    default:
      return 'border-border-default bg-white text-text-secondary';
  }
}

/** Иконки этапов маршрута — тот же размер контейнера, что у «Следующий шаг» / обзорных карточек. */
const W2_ROUTE_STAGE_TILE_ICONS: Record<
  Workshop2OverviewTab,
  ComponentType<{ className?: string }>
> = {
  overview: LucideIcons.LayoutDashboard,
  tz: LucideIcons.FileBadge2,
  supply: LucideIcons.Package,
  fit: LucideIcons.BadgeCheck,
  plan: LucideIcons.CalendarRange,
  release: LucideIcons.Factory,
  qc: LucideIcons.CheckCircle2,
  stock: LucideIcons.Warehouse,
};

/** Карточка «Статус маршрута»: иконка, заголовок, описание и сетка плиток этапов (как на обзоре). */
function Workshop2ArticleRouteStatusCard({
  routeStages,
  activeTab,
  onOpenStage,
  onStageHelp,
}: {
  routeStages: RouteStageMeta[];
  activeTab: MainTab;
  onOpenStage: (tab: MainTab) => void;
  onStageHelp: (tab: MainTab) => void;
}) {
  const laneUi = workshop2PipelineLaneForArticleMainTab(activeTab);
  const { devStages, sampleStages } = useMemo(() => {
    const dev: RouteStageMeta[] = [];
    const sample: RouteStageMeta[] = [];
    for (const s of routeStages) {
      if (workshop2PipelineLaneForArticleMainTab(s.id) === 'development') dev.push(s);
      else sample.push(s);
    }
    return { devStages: dev, sampleStages: sample };
  }, [routeStages]);

  return (
    <Card className="border-border-default flex min-h-0 flex-col bg-white shadow-sm">
      <CardContent className="flex min-h-0 flex-1 flex-col space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.GitBranch className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">Статус маршрута</h2>
              <Badge
                variant="outline"
                title="Обзор и ТЗ — контур разработки и согласование сторон (как gate-all-stakeholders в матрице коллекции); снабжение и далее — сэмплы от якоря supply-path (как на мини-шкале в списке коллекции)"
                className={cn(
                  'h-5 px-1.5 text-[9px] font-bold uppercase tracking-wide',
                  laneUi === 'development'
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-950'
                    : 'border-teal-200 bg-teal-50 text-teal-950'
                )}
              >
                {workshop2PipelineLaneLabelRu(laneUi)}
              </Badge>
            </div>
            <p className="text-text-secondary text-sm">
              Этапы артикула и готовность. Плитки сгруппированы: разработка и ТЗ (включая смысл этапов tech-pack и
              gate-all-stakeholders в матрице коллекции), затем сэмплы и выпуск — от якоря supply-path и далее, как
              правая часть мини-шкалы в списке коллекции.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <section aria-labelledby="w2-route-dev-heading">
            <h3
              id="w2-route-dev-heading"
              className="text-text-muted mb-2 text-[10px] font-bold uppercase tracking-widest"
            >
              Разработка
            </h3>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:items-stretch">
              {devStages.map((stage) => (
                <Workshop2RouteStageTile
                  key={stage.id}
                  stage={stage}
                  lane="development"
                  active={activeTab === stage.id}
                  onOpen={() => onOpenStage(stage.id)}
                  onHelp={() => onStageHelp(stage.id)}
                />
              ))}
            </div>
          </section>
          <section aria-labelledby="w2-route-samples-heading">
            <h3
              id="w2-route-samples-heading"
              className="text-text-muted mb-2 text-[10px] font-bold uppercase tracking-widest"
            >
              Сэмплы и выпуск
            </h3>
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-cols-3 md:items-stretch">
              {sampleStages.map((stage) => (
                <Workshop2RouteStageTile
                  key={stage.id}
                  stage={stage}
                  lane="samples"
                  active={activeTab === stage.id}
                  onOpen={() => onOpenStage(stage.id)}
                  onHelp={() => onStageHelp(stage.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

/** Плитка этапа: как карточки сводки ТЗ — иконка, %, полоска прогресса, роль и статус. */
function Workshop2RouteStageTile({
  stage,
  lane,
  active,
  onOpen,
  onHelp,
}: {
  stage: RouteStageMeta;
  lane: Workshop2PipelineLane;
  active: boolean;
  onOpen: () => void;
  onHelp: () => void;
}) {
  const done = stage.status === 'approved' || stage.status === 'handed_off';
  const blocked = stage.status === 'blocked';
  const guidance = WORKSHOP2_ROUTE_STAGE_GUIDANCE[stage.id as Workshop2OverviewTab];
  const StageIcon = W2_ROUTE_STAGE_TILE_ICONS[stage.id as Workshop2OverviewTab];
  const title = guidance?.headline ?? stage.label;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={active ? 'step' : undefined}
      aria-label={`${title}, ${stage.pct}%. Контур ${workshop2PipelineLaneLabelRu(lane)}. Открыть этап`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      title={`Открыть этап «${title}»`}
      className={cn(
        W2_OVERVIEW_DECISION_ROW_MIN,
        'flex h-full min-h-0 cursor-pointer flex-col justify-between gap-0.5 rounded-xl border p-2 text-left shadow-sm outline-none transition-all',
        'border-border-default hover:border-accent-primary/30 hover:bg-bg-surface2/90 bg-white hover:shadow-md',
        'focus-visible:ring-accent-primary focus-visible:ring-2 focus-visible:ring-offset-2',
        W2_PIPELINE_LANE_TILE_BORDER[lane],
        active && 'border-accent-primary/40 ring-accent-primary/20 bg-accent-primary/10 ring-1',
        done && 'border-emerald-100 bg-emerald-50/35',
        blocked && 'border-rose-200 bg-rose-50/35'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
            done && 'bg-emerald-100 text-emerald-700',
            blocked && 'bg-rose-100 text-rose-700'
          )}
        >
          <StageIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <h3 className="text-text-primary line-clamp-1 text-sm font-semibold leading-tight">
              {title}
            </h3>
            <button
              type="button"
              className="text-text-muted hover:text-accent-primary relative z-10 shrink-0 rounded-full p-0.5 transition-colors hover:bg-white/80"
              aria-label={`Справка по этапу «${title}»`}
              onClick={(e) => {
                e.stopPropagation();
                onHelp();
              }}
            >
              <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
            </button>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'h-5 shrink-0 px-1.5 text-[9px] font-bold tabular-nums',
            done && 'border-emerald-200 bg-emerald-50 text-emerald-900',
            blocked && 'border-rose-200 bg-rose-50 text-rose-900',
            !done && !blocked && 'border-red-200 bg-red-50 text-red-900'
          )}
        >
          {stage.pct}%
        </Badge>
      </div>
      <div
        className={cn(
          'mt-1.5 h-0.5 w-full overflow-hidden rounded-full',
          done ? 'bg-emerald-100' : blocked ? 'bg-rose-100' : 'bg-bg-surface2'
        )}
        aria-hidden
      >
        <div
          className={cn(
            'h-full rounded-full',
            done ? 'bg-emerald-500' : blocked ? 'bg-rose-500' : 'bg-accent-primary'
          )}
          style={{ width: `${stage.pct}%` }}
        />
      </div>
      <div
        className={cn(
          'flex items-center justify-between gap-2 border-t pt-1.5 text-[10px]',
          done ? 'border-emerald-100' : blocked ? 'border-rose-100' : 'border-border-default'
        )}
      >
        <span className="text-text-secondary min-w-0 truncate font-medium leading-snug">
          {stage.owner}
          {stage.label !== title ? <span className="text-text-muted"> · {stage.label}</span> : null}
        </span>
        <span
          className={cn(
            'shrink-0 font-semibold',
            blocked
              ? 'text-rose-800'
              : stage.status === 'in_progress'
                ? 'text-red-900'
                : stage.status === 'approved' || stage.status === 'handed_off'
                  ? 'text-emerald-900'
                  : 'text-text-primary'
          )}
        >
          {getRouteCardFootStatus(stage.status)}
        </span>
      </div>
    </div>
  );
}

const W2_OVERVIEW_DECISION_ROW_MIN = 'min-h-[3.25rem]';
const W2_OVERVIEW_KPI_TILE_INTERACTIVE =
  'h-full min-h-0 cursor-pointer outline-none transition-[border-color,box-shadow,background-color,transform] duration-150 hover:border-accent-primary/30 hover:bg-white hover:shadow-md active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2';

/** Как у кнопки «Следующее >» в футере ТЗ (раздел паспорт / шаги). */
const W2_TZ_PASSPORT_CONTINUE_BTN_CLASS = 'h-9 gap-1.5 px-3 text-xs font-medium';

/** Вторичные «Открыть» на обзоре (блокеры, риски, диалоги). */
const W2_OVERVIEW_OPEN_BTN_CLASS = 'h-8 shrink-0 px-3 text-xs font-medium';

const W2_DECISION_SNAPSHOT_ICONS: Record<DossierSection, ComponentType<{ className?: string }>> = {
  general: LucideIcons.Users,
  visuals: LucideIcons.Sparkles,
  material: LucideIcons.Layers,
  measurements: LucideIcons.Ruler,
  construction: LucideIcons.Shirt,
  packaging: LucideIcons.Tags,
  sample_intake: LucideIcons.ClipboardCheck,
};

const W2_ROUTE_HELP_INFO_BTN_CLASS =
  'relative z-10 shrink-0 rounded-full p-0.5 text-text-muted transition-colors hover:bg-white/80 hover:text-accent-primary';

/** Левый акцент плиток по контуру разработки коллекции (согласовано с карточкой «Статус маршрута»). */
const W2_PIPELINE_LANE_TILE_BORDER: Record<Workshop2PipelineLane, string> = {
  development: 'border-l-[3px] border-l-indigo-200',
  samples: 'border-l-[3px] border-l-teal-300',
};

/** Тонкая полоска как в «Сводке решений»: незаполнено — slate + indigo, заполнено — emerald трек и заливка. */
function W2OverviewThinProgressBar({
  value,
  complete,
  risk,
}: {
  value: number;
  complete: boolean;
  /** Полная красная полоса (риск ОТК). */
  risk?: boolean;
}) {
  const v = Math.min(100, Math.max(0, value));
  if (risk) {
    return (
      <div
        className="bg-bg-surface2 mt-1.5 h-0.5 w-full overflow-hidden rounded-full"
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-red-500" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'mt-1.5 h-0.5 w-full overflow-hidden rounded-full',
        complete ? 'bg-emerald-100' : 'bg-bg-surface2'
      )}
      aria-hidden
    >
      <div
        className={cn('h-full rounded-full', complete ? 'bg-emerald-500' : 'bg-accent-primary')}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function Workshop2ArticleWorkspaceOverviewStats({
  onOpenTabWithFlash,
  onOpenRouteStageHelp,
  routeStages,
}: {
  onOpenTabWithFlash: (tab: MainTab, opts?: OpenTabWithFlashOpts) => void;
  onOpenRouteStageHelp: (tab: MainTab) => void;
  routeStages: Workshop2OverviewRouteStage[];
}) {
  const { bundle } = useArticleWorkspace();
  if (!bundle) return null;

  const supply = bundle.supply ?? { lines: [] };
  const release = bundle.release ?? {};
  const qc = bundle.qc ?? { batches: [] };

  const bomTotal = supply.lines.length;
  const bomReady = supply.lines.filter(
    (l) => l.status === 'at_factory' || l.status === 'consumed'
  ).length;
  const bomPct = bomTotal > 0 ? Math.round((bomReady / bomTotal) * 100) : 0;

  const opTotal = release.operations?.length ?? 0;
  const opDone = release.operations?.filter((o) => o.status === 'completed').length ?? 0;
  const opPct = opTotal > 0 ? Math.round((opDone / opTotal) * 100) : 0;

  const failedBatches = qc.batches.filter((b) => b.status === 'failed').length;
  const aqlRejects = qc.batches.filter((b) => {
    const aql = b.batchSize ? getAqlPlan(b.batchSize, '2.5') : null;
    return aql && b.majorDefects != null && b.majorDefects >= aql.rejectLimit;
  }).length;

  const totalBomCost = supply.lines.reduce(
    (acc, l) => acc + (l.qty || 0) * (l.costPerUnit || 0),
    0
  );
  const totalSewingCost =
    release.operations?.reduce((acc, o) => acc + (o.costPerUnit || 0), 0) ?? 0;
  const factoryGatePrice = totalBomCost + totalSewingCost;

  const fitGold = bundle.fitGold;
  const fitApproved = fitGold?.goldApproved ?? false;
  const fitCommentCount = fitGold?.fitComments?.length ?? 0;
  const fitPct = fitApproved ? 100 : fitCommentCount > 0 ? 55 : 0;

  const stockMovementCount = bundle.stock?.movements?.length ?? 0;
  const stockMovementsStarted = stockMovementCount > 0;
  const stockMovementsPct = stockMovementsStarted ? 100 : 0;

  const hasRisk = (bomTotal > 0 && bomPct < 50) || failedBatches > 0 || aqlRejects > 0;

  const riskDetail = [
    bomTotal > 0 && bomPct < 50 ? 'Низкая готовность материалов (BOM < 50%).' : '',
    failedBatches > 0 ? `Зафиксирован брак в ${failedBatches} партиях (ОТК).` : '',
    aqlRejects > 0 ? `${aqlRejects} партии не прошли AQL 2.5.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const openRiskTarget = () => {
    if (bomTotal > 0 && bomPct < 50) onOpenTabWithFlash('supply');
    else if (failedBatches > 0 || aqlRejects > 0) onOpenTabWithFlash('qc');
    else onOpenTabWithFlash('tz');
  };

  const riskTargetStage =
    bomTotal > 0 && bomPct < 50
      ? routeStages.find((s) => s.id === 'supply')
      : failedBatches > 0 || aqlRejects > 0
        ? routeStages.find((s) => s.id === 'qc')
        : routeStages.find((s) => s.id === 'tz');

  const riskStageEyebrow = riskTargetStage
    ? formatWorkshop2StageEyebrow(riskTargetStage.label, riskTargetStage.owner)
    : 'Этап · —';
  const RiskStageIcon = riskTargetStage
    ? W2_ROUTE_STAGE_TILE_ICONS[riskTargetStage.id as Workshop2OverviewTab]
    : null;

  const bomComplete = bomTotal > 0 && bomPct === 100;
  const opComplete = opTotal > 0 && opPct === 100;
  const qcOkVisual = !(aqlRejects > 0 || failedBatches > 0);
  const fgComplete = factoryGatePrice > 0 && bomComplete && opComplete;

  const samplesLaneBorder = W2_PIPELINE_LANE_TILE_BORDER.samples;
  const riskLaneBorder = riskTargetStage
    ? W2_PIPELINE_LANE_TILE_BORDER[
        workshop2PipelineLaneForArticleMainTab(riskTargetStage.id as Workshop2ArticleMainTab)
      ]
    : samplesLaneBorder;

  return (
    <div className={cn('grid gap-4', hasRisk ? 'lg:grid-cols-2 lg:items-stretch' : '')}>
      <Card className="border-border-default flex h-full min-h-0 flex-col bg-white shadow-sm">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5">
          <div className="flex shrink-0 items-start gap-3">
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LucideIcons.LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-text-primary text-base font-semibold">Операционные KPI</p>
                <Badge
                  variant="outline"
                  title="Контур сэмплов и выпуска: в каталоге от якоря supply-path (в т.ч. samples) — та же правая часть мини-шкалы в списке коллекции"
                  className="h-5 border-teal-200 bg-teal-50 px-1.5 text-[9px] font-bold uppercase tracking-wide text-teal-950"
                >
                  Сэмплы
                </Badge>
              </div>
              <p className="text-text-secondary mt-1 text-sm leading-snug">
                Контур сэмплов и выпуска (в каталоге этапов — от якоря supply-path, в т.ч. samples): снабжение и посадка
                → выпуск и себестоимость → ОТК → склад. Порядок совпадает с типовым процессом и с группой «Сэмплы и
                выпуск» в статусе маршрута.
              </p>
            </div>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-2">
            <div
              role="button"
              tabIndex={0}
              title="Открыть раздел «Снабжение» — BOM и брони"
              aria-label={`Снабжение и BOM, ${bomPct}%. ${bomReady} из ${bomTotal} единиц заполнено. Открыть вкладку «Снабжение»`}
              onClick={() => onOpenTabWithFlash('supply')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('supply');
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'flex flex-col justify-between rounded-xl border px-3 py-2.5',
                bomComplete
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-border-subtle bg-bg-surface2/70'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      bomComplete && 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    <LucideIcons.Package className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="text-text-primary line-clamp-1 text-sm font-semibold leading-tight">
                        Снабжение · BOM
                      </h3>
                      <button
                        type="button"
                        className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                        aria-label="Справка по этапу «Снабжение»"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRouteStageHelp('supply');
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 shrink-0 px-1.5 text-[9px] font-bold tabular-nums',
                    bomComplete
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900'
                  )}
                >
                  {bomPct}%
                </Badge>
              </div>
              <W2OverviewThinProgressBar value={bomPct} complete={bomComplete} />
              <div
                className={cn(
                  'mt-1 flex items-end justify-between gap-2 border-t pt-1.5',
                  bomComplete ? 'border-emerald-100' : 'border-border-default/80'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-medium leading-snug',
                    bomComplete ? 'text-emerald-800' : 'text-text-secondary'
                  )}
                >
                  {bomComplete ? 'Секция закрыта' : 'Нужны данные в ТЗ'}
                </span>
                <span className="text-text-secondary shrink-0 text-[10px] tabular-nums">
                  {bomReady}/{bomTotal} ед.
                </span>
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              title="Открыть раздел «Эталон · посадка»"
              aria-label={`Эталон и посадка, ${fitPct}%. ${fitApproved ? 'Эталон в коллекции' : fitCommentCount > 0 ? 'Есть комментарии по посадке' : 'Требуется заполнение'}. Открыть вкладку «Эталон · посадка»`}
              onClick={() => onOpenTabWithFlash('fit')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('fit');
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'flex flex-col justify-between rounded-xl border px-3 py-2.5',
                fitApproved
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-border-subtle bg-bg-surface2/70'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      fitApproved && 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    <LucideIcons.BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="text-text-primary line-clamp-1 text-sm font-semibold leading-tight">
                        Посадка
                      </h3>
                      <button
                        type="button"
                        className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                        aria-label="Справка по этапу «Эталон · посадка»"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRouteStageHelp('fit');
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 shrink-0 px-1.5 text-[9px] font-bold tabular-nums',
                    fitApproved
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : fitCommentCount > 0
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : 'border-red-200 bg-red-50 text-red-900'
                  )}
                >
                  {fitPct}%
                </Badge>
              </div>
              <W2OverviewThinProgressBar value={fitPct} complete={fitApproved} />
              <div
                className={cn(
                  'mt-1 flex items-center justify-between gap-2 border-t pt-1.5',
                  fitApproved ? 'border-emerald-100' : 'border-border-default/80'
                )}
              >
                <span
                  className={cn(
                    'shrink-0 text-[10px] font-medium',
                    fitApproved ? 'text-emerald-800' : 'text-text-secondary'
                  )}
                >
                  {fitApproved ? 'В коллекции' : fitCommentCount > 0 ? 'Ждёт склад' : 'Посадка'}
                </span>
                <span className="text-text-secondary text-right text-[10px] tabular-nums">
                  {fitApproved ? '1/1 ед.' : fitCommentCount > 0 ? '1/2' : '0/2'}
                  {fitCommentCount > 0 ? ` · ${fitCommentCount} коммент.` : ''}
                </span>
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              title="Открыть раздел «Выпуск» — производство и операции"
              aria-label={`Производство и операции, ${opPct}%. ${opDone} из ${opTotal} операций. Открыть вкладку «Выпуск»`}
              onClick={() => onOpenTabWithFlash('release')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('release');
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'flex flex-col justify-between rounded-xl border px-3 py-2.5',
                opComplete
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-border-subtle bg-bg-surface2/70'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      opComplete && 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    <LucideIcons.ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="text-text-primary line-clamp-1 text-sm font-semibold leading-tight">
                        Производство
                      </h3>
                      <button
                        type="button"
                        className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                        aria-label="Справка по этапу «Производство / выпуск»"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRouteStageHelp('release');
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 shrink-0 px-1.5 text-[9px] font-bold tabular-nums',
                    opComplete
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900'
                  )}
                >
                  {opPct}%
                </Badge>
              </div>
              <W2OverviewThinProgressBar value={opPct} complete={opComplete} />
              <div
                className={cn(
                  'mt-1 flex items-end justify-between gap-2 border-t pt-1.5',
                  opComplete ? 'border-emerald-100' : 'border-border-default/80'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-medium leading-snug',
                    opComplete ? 'text-emerald-800' : 'text-text-secondary'
                  )}
                >
                  {opComplete ? 'Секция закрыта' : 'Нужны данные в ТЗ'}
                </span>
                <span className="text-text-secondary shrink-0 text-[10px] tabular-nums">
                  {opDone}/{opTotal} опер.
                </span>
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              title="Открыть «Выпуск» — техсебестоимость и factory gate"
              aria-label={`Техсебестоимость и factory gate: ${factoryGatePrice.toLocaleString('ru-RU')} ₽. ${fgComplete ? 'Показатели закрыты' : 'Требуется заполнение'}. Открыть вкладку «Выпуск»`}
              onClick={() => onOpenTabWithFlash('release')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('release');
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'flex flex-col justify-between rounded-xl border px-3 py-2.5',
                fgComplete
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-accent-primary/20 bg-accent-primary/10'
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                    fgComplete && 'bg-emerald-100 text-emerald-700'
                  )}
                >
                  <LucideIcons.CircleDollarSign className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1">
                    <h3
                      className={cn(
                        'line-clamp-1 text-sm font-semibold leading-tight',
                        fgComplete ? 'text-emerald-900' : 'text-text-primary'
                      )}
                    >
                      Техсебестоимость
                    </h3>
                    <button
                      type="button"
                      className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                      aria-label="Справка: выпуск и factory gate"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRouteStageHelp('release');
                      }}
                    >
                      <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'mt-1.5 flex h-0.5 w-full min-w-0 overflow-hidden rounded-full',
                  fgComplete ? 'bg-emerald-100' : 'bg-bg-surface2'
                )}
                title="Доля BOM и пошива в factory gate"
                aria-hidden
              >
                <div
                  className={cn(
                    'h-full min-w-0',
                    fgComplete ? 'bg-emerald-400' : 'bg-accent-primary'
                  )}
                  style={{ flex: `${totalBomCost} 1 0%` }}
                  title="BOM"
                />
                <div
                  className={cn(
                    'h-full min-w-0',
                    fgComplete ? 'bg-emerald-500' : 'bg-accent-primary'
                  )}
                  style={{ flex: `${totalSewingCost} 1 0%` }}
                  title="Пошив"
                />
              </div>
              <div
                className={cn(
                  'mt-1 flex items-end justify-between gap-2 border-t pt-1.5',
                  fgComplete ? 'border-emerald-100' : 'border-border-default/80'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-semibold leading-snug',
                    fgComplete ? 'text-emerald-800' : 'text-text-primary'
                  )}
                >
                  Factory Gate
                </span>
                <span
                  className={cn(
                    'max-w-[55%] text-right text-[10px] font-black tabular-nums leading-tight [overflow-wrap:anywhere]',
                    fgComplete ? 'text-emerald-900' : 'text-text-primary'
                  )}
                  title="Сумма BOM и пошива по данным вкладки «Выпуск»"
                >
                  {factoryGatePrice.toLocaleString('ru-RU')}&nbsp;₽
                </span>
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              title="Открыть раздел «ОТК» — контроль качества"
              aria-label={`Контроль качества ОТК. ${qcOkVisual ? 'Без критичных отклонений' : `Отклонений: ${aqlRejects + failedBatches}`}. Открыть вкладку «ОТК»`}
              onClick={() => onOpenTabWithFlash('qc')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('qc');
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'flex flex-col justify-between rounded-xl border px-3 py-2.5',
                qcOkVisual
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-border-subtle bg-bg-surface2/70'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      qcOkVisual && 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    <LucideIcons.CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="text-text-primary line-clamp-1 text-sm font-semibold leading-tight">
                        Качество (ОТК)
                      </h3>
                      <button
                        type="button"
                        className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                        aria-label="Справка по этапу «ОТК»"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRouteStageHelp('qc');
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 shrink-0 px-1.5 text-[9px] font-bold',
                    aqlRejects > 0 || failedBatches > 0
                      ? 'border-rose-200 bg-rose-50 text-rose-900'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  )}
                >
                  {aqlRejects > 0 || failedBatches > 0 ? 'Риск' : 'ОК'}
                </Badge>
              </div>
              <W2OverviewThinProgressBar
                value={100}
                complete={qcOkVisual}
                risk={aqlRejects > 0 || failedBatches > 0}
              />
              <div
                className={cn(
                  'mt-1 flex items-end justify-between gap-2 border-t pt-1.5',
                  qcOkVisual ? 'border-emerald-100' : 'border-border-default/80'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-medium leading-snug',
                    qcOkVisual ? 'text-emerald-800' : 'text-text-secondary'
                  )}
                >
                  {qcOkVisual ? 'Секция закрыта' : 'Нужны данные в ТЗ'}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 shrink-0 px-1.5 text-[9px] font-bold',
                    aqlRejects > 0 || failedBatches > 0
                      ? 'border-rose-200 bg-rose-50 text-rose-800'
                      : 'border-emerald-100 bg-emerald-50/80 text-emerald-800'
                  )}
                >
                  {aqlRejects + failedBatches} откл.
                </Badge>
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              title="Открыть «Склад» — приёмка и движения ГП"
              aria-label={`Склад: приёмка и движения, ${stockMovementsPct}%. ${stockMovementCount > 0 ? `${stockMovementCount} операций` : 'Нет движений'}. Открыть вкладку «Склад»`}
              onClick={() => onOpenTabWithFlash('stock')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('stock');
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'flex flex-col justify-between rounded-xl border px-3 py-2.5',
                stockMovementsStarted
                  ? 'border-emerald-100 bg-emerald-50/40'
                  : 'border-border-subtle bg-bg-surface2/70'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      stockMovementsStarted && 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    <LucideIcons.Warehouse className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="text-text-primary line-clamp-1 text-sm font-semibold leading-tight">
                        Приёмка · движения
                      </h3>
                      <button
                        type="button"
                        className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                        aria-label="Справка по этапу «Склад»"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRouteStageHelp('stock');
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 shrink-0 px-1.5 text-[9px] font-bold tabular-nums',
                    stockMovementsStarted
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900'
                  )}
                >
                  {stockMovementsPct}%
                </Badge>
              </div>
              <W2OverviewThinProgressBar
                value={stockMovementsPct}
                complete={stockMovementsStarted}
              />
              <div
                className={cn(
                  'mt-1 flex items-end justify-between gap-2 border-t pt-1.5',
                  stockMovementsStarted ? 'border-emerald-100' : 'border-border-default/80'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-medium leading-snug',
                    stockMovementsStarted ? 'text-emerald-800' : 'text-text-secondary'
                  )}
                >
                  {stockMovementsStarted ? 'Есть движения' : 'Не зафиксировано'}
                </span>
                <span className="text-text-secondary shrink-0 text-[10px] tabular-nums">
                  {stockMovementCount > 0 ? `${stockMovementCount} опер.` : '0 опер.'}
                </span>
              </div>
            </div>
          </div>
          {bundle.planPo?.nestingAiOptimization ? (
            <div
              role="button"
              tabIndex={0}
              title="Открыть «План» — Nesting AI"
              aria-label={`Nesting AI: эффективность +${bundle.planPo.nestingAiOptimization.efficiencyGainPct}%. Открыть раздел плана с раскладкой`}
              onClick={() =>
                onOpenTabWithFlash('plan', { articleFlashId: W2_ARTICLE_SECTION_DOM.planNest })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenTabWithFlash('plan', { articleFlashId: W2_ARTICLE_SECTION_DOM.planNest });
                }
              }}
              className={cn(
                W2_OVERVIEW_DECISION_ROW_MIN,
                W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                samplesLaneBorder,
                'relative flex flex-col justify-between overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2.5'
              )}
            >
              <LucideIcons.Zap
                className="pointer-events-none absolute -bottom-1 -right-1 h-10 w-10 text-emerald-100"
                aria-hidden
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                    <LucideIcons.Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="line-clamp-1 text-sm font-semibold leading-tight text-emerald-900">
                        Nesting AI
                      </h3>
                      <button
                        type="button"
                        className={W2_ROUTE_HELP_INFO_BTN_CLASS}
                        aria-label="Справка по этапу «План · PO»"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenRouteStageHelp('plan');
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="h-5 shrink-0 border-emerald-100 bg-emerald-50/80 px-1.5 text-[9px] font-bold tabular-nums text-emerald-900"
                >
                  +{bundle.planPo.nestingAiOptimization.efficiencyGainPct}%
                </Badge>
              </div>
              <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-emerald-100" aria-hidden>
                <div className="h-full w-full rounded-full bg-emerald-500" />
              </div>
              <div className="mt-1 flex justify-end">
                <Badge
                  variant="outline"
                  className="h-5 border-emerald-100 bg-emerald-50/80 px-1.5 text-[9px] font-bold uppercase tracking-tighter text-emerald-800"
                >
                  Gain
                </Badge>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {hasRisk ? (
        <Card className="border-border-default flex h-full min-h-0 w-full flex-col bg-white shadow-sm">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5">
            <div className="flex shrink-0 items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <LucideIcons.AlertTriangle className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <p className="text-text-primary text-base font-semibold">Риски производства</p>
                <p className="text-text-secondary text-sm">
                  Материалы, партии и AQL — где по этому SKU нужно вмешаться в первую очередь.
                </p>
              </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <div
                className={cn(
                  W2_OVERVIEW_DECISION_ROW_MIN,
                  riskLaneBorder,
                  'flex flex-col justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between'
                )}
              >
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  {RiskStageIcon ? (
                    <span className="bg-accent-primary/10 text-accent-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                      <RiskStageIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                      {riskStageEyebrow}
                    </p>
                    <p className="text-text-primary mt-0.5 text-sm font-semibold leading-snug">
                      {riskDetail
                        ? `${riskDetail} Проверьте соответствующие вкладки.`
                        : 'Проверьте вкладки снабжения, выпуска и контроля качества.'}
                    </p>
                    <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-rose-200/80" aria-hidden>
                      <div
                        className={cn('h-full', riskDetail ? 'bg-rose-500' : 'bg-rose-300/60')}
                        style={{ width: riskDetail ? '100%' : '40%' }}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    W2_OVERVIEW_OPEN_BTN_CLASS,
                    'self-start whitespace-nowrap sm:self-center'
                  )}
                  aria-label="Перейти к этапу с риском"
                  onClick={() => openRiskTarget()}
                >
                  Открыть &gt;
                </Button>
              </div>
              <div className="min-h-0 flex-1" aria-hidden />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Workshop2OverviewDecisionSnapshot({
  items,
  onOpenSectionHelp,
  onGoToTzSection,
  className,
}: {
  items: Workshop2OverviewDecisionItem[];
  onOpenSectionHelp: (section: DossierSection) => void;
  onGoToTzSection: (section: DossierSection) => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'border-border-default flex h-full min-h-0 flex-col bg-white shadow-sm',
        className
      )}
    >
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5">
        <div className="flex shrink-0 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.FileBadge2 className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">Сводка решений</h2>
              <Badge
                variant="outline"
                title="Разделы ТЗ — контур разработки: в каталоге до якоря supply-path (в т.ч. gate-all-stakeholders) — левая часть мини-шкалы"
                className="h-5 border-indigo-200 bg-indigo-50 px-1.5 text-[9px] font-bold uppercase tracking-wide text-indigo-950"
              >
                Разработка
              </Badge>
            </div>
            <p className="text-text-secondary text-sm leading-snug">
              Каждый раздел ТЗ задаёт входные данные для следующего этапа маршрута — от досье до
              фабрики и ОТК.
            </p>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 items-stretch gap-2 [grid-auto-rows:1fr]">
          {items.map((item) => {
            const Icon = W2_DECISION_SNAPSHOT_ICONS[item.dossierSection];
            const g = WORKSHOP2_DOSSIER_SECTION_GUIDANCE[item.dossierSection];
            const title = g?.headline ?? item.label;
            const pct = item.filled ? 100 : 0;
            return (
              <div
                key={item.label}
                role="button"
                tabIndex={0}
                aria-label={`${title}: ${item.filled ? 'заполнено' : 'не заполнено'}, ${pct}%. Открыть раздел в ТЗ`}
                onClick={() => onGoToTzSection(item.dossierSection)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onGoToTzSection(item.dossierSection);
                  }
                }}
                className={cn(
                  W2_OVERVIEW_DECISION_ROW_MIN,
                  W2_OVERVIEW_KPI_TILE_INTERACTIVE,
                  W2_PIPELINE_LANE_TILE_BORDER.development,
                  'flex h-full min-h-0 cursor-pointer flex-col justify-between rounded-xl border px-3 py-2.5 text-left shadow-sm outline-none transition-colors',
                  'hover:border-border-default focus-visible:ring-accent-primary hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2',
                  item.filled
                    ? 'border-emerald-100 bg-emerald-50/40 hover:border-emerald-200'
                    : 'border-border-default hover:bg-bg-surface2/80 bg-white'
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={cn(
                      'bg-accent-primary/10 text-accent-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                      item.filled && 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-1">
                    <div className="inline-flex min-w-0 items-center gap-0.5">
                      <h3 className="text-text-primary min-w-0 truncate text-sm font-semibold leading-tight">
                        {title}
                      </h3>
                      <button
                        type="button"
                        className={cn(W2_ROUTE_HELP_INFO_BTN_CLASS, 'shrink-0')}
                        aria-label={`Справка: ${title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSectionHelp(item.dossierSection);
                        }}
                      >
                        <LucideIcons.Info className="h-[10.5px] w-[10.5px]" aria-hidden />
                      </button>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'h-5 shrink-0 justify-self-end px-1.5 text-[9px] font-bold tabular-nums',
                        item.filled
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                          : 'border-red-200 bg-red-50 text-red-900'
                      )}
                    >
                      {pct}%
                    </Badge>
                  </div>
                </div>
                <W2OverviewThinProgressBar value={pct} complete={item.filled} />
                <div
                  className={cn(
                    'mt-1 flex items-end justify-between gap-2 border-t pt-1.5 text-[10px]',
                    item.filled ? 'border-emerald-100' : 'border-border-default'
                  )}
                >
                  <span
                    className={cn(
                      'min-w-0 font-medium leading-snug',
                      item.filled ? 'text-emerald-900' : 'text-text-secondary'
                    )}
                  >
                    {item.filled ? 'Секция закрыта' : 'Нужны данные в ТЗ'}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 font-semibold',
                      item.filled ? 'text-emerald-900' : 'text-red-900'
                    )}
                  >
                    {item.filled ? 'Завершено' : 'В работе'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Workshop2OverviewTopBlockers({
  blockers,
  onOpenTab,
  className,
}: {
  blockers: Workshop2OverviewBlocker[];
  onOpenTab: (tab: MainTab, opts?: OpenTabWithFlashOpts) => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'border-border-default flex h-full min-h-0 flex-col bg-white shadow-sm',
        className
      )}
    >
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5">
        <div className="flex shrink-0 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <LucideIcons.AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-text-primary text-base font-semibold">Ключевые блокеры</p>
            <p className="text-text-secondary text-sm">
              Критичные проблемы: что тормозит этапы маршрута и что нужно закрыть в ТЗ, прежде чем
              двигаться дальше.
            </p>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {blockers.length === 0 ? (
            <div
              className={cn(
                'rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2',
                W2_OVERVIEW_DECISION_ROW_MIN
              )}
            >
              <p className="text-sm font-semibold text-emerald-900">Критичных блокеров нет.</p>
              <p className="mt-0.5 text-xs leading-snug text-emerald-800">
                Можно двигать SKU по маршруту.
              </p>
            </div>
          ) : (
            <>
              {blockers.map((blocker) => {
                const BlockStageIcon =
                  W2_ROUTE_STAGE_TILE_ICONS[blocker.stage as Workshop2OverviewTab];
                return (
                  <div
                    key={blocker.id}
                    className={cn(
                      W2_OVERVIEW_DECISION_ROW_MIN,
                      W2_PIPELINE_LANE_TILE_BORDER[
                        workshop2PipelineLaneForArticleMainTab(blocker.stage)
                      ],
                      'flex flex-col justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between'
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                      <span className="bg-accent-primary/10 text-accent-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                        <BlockStageIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                          {formatWorkshop2StageEyebrow(blocker.stageLabel, blocker.owner)}
                        </p>
                        <p className="text-text-primary mt-0.5 text-sm font-semibold leading-snug">
                          {blocker.text}
                        </p>
                        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-rose-200/80" aria-hidden>
                          <div className="h-full w-full bg-rose-500" />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        W2_OVERVIEW_OPEN_BTN_CLASS,
                        'self-start whitespace-nowrap sm:self-center'
                      )}
                      aria-label={`Перейти к этапу «${blocker.stageLabel}»`}
                      onClick={() =>
                        onOpenTab(
                          blocker.stage,
                          blocker.dossierSection
                            ? { dossierSection: blocker.dossierSection }
                            : undefined
                        )
                      }
                    >
                      Открыть &gt;
                    </Button>
                  </div>
                );
              })}
            </>
          )}
          <div className="min-h-0 flex-1" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}

function Workshop2OverviewActionRail({
  action,
  onOpenTab,
}: {
  action: Workshop2OverviewPrimaryAction;
  onOpenTab: (tab: MainTab, opts?: OpenTabWithFlashOpts) => void;
}) {
  const actionLane = workshop2PipelineLaneForArticleMainTab(action.tab);
  return (
    <div className="self-start xl:sticky xl:top-4">
      <Card className="border-border-default bg-white shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <LucideIcons.CornerDownRight className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      'h-4 shrink-0 px-1.5 text-[8px] font-bold uppercase tracking-wide',
                      actionLane === 'development'
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-950'
                        : 'border-teal-200 bg-teal-50 text-teal-950'
                    )}
                  >
                    {workshop2PipelineLaneLabelRu(actionLane)}
                  </Badge>
                  <p className="text-text-primary shrink-0 text-xs font-semibold leading-snug">
                    {action.title}
                  </p>
                </div>
                <p className="text-text-secondary text-[11px] leading-snug">{action.reason}</p>
              </div>
            </div>
            <Button
              type="button"
              className={cn(W2_TZ_PASSPORT_CONTINUE_BTN_CLASS, 'shrink-0 whitespace-nowrap')}
              aria-label={`${action.buttonLabel}: ${action.title}`}
              onClick={() =>
                onOpenTab(
                  action.tab,
                  action.dossierSection ? { dossierSection: action.dossierSection } : undefined
                )
              }
            >
              {action.buttonLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Workshop2ArticleContextRail({
  stages,
  activeTab,
  nextAction,
  warnings,
  onOpenTab,
}: {
  stages: RouteStageMeta[];
  activeTab: MainTab;
  nextAction: { tab: MainTab; title: string; reason: string; dossierSection?: DossierSection };
  warnings: string[];
  onOpenTab: (tab: MainTab, opts?: OpenTabWithFlashOpts) => void;
}) {
  const activeStage = stages.find((stage) => stage.id === activeTab) ?? stages[0]!;
  const activeLane = workshop2PipelineLaneForArticleMainTab(activeTab);
  return (
    <div className="space-y-4 self-start xl:sticky xl:top-4">
      <Card className="border-border-default">
        <CardContent className="space-y-3 pt-4">
          <div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Следующее действие
            </p>
            <p className="text-text-primary mt-1 text-sm font-bold">{nextAction.title}</p>
            <p className="text-text-secondary text-[11px]">{nextAction.reason}</p>
          </div>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs"
              aria-label={`Открыть этап: ${nextAction.title}`}
              onClick={() =>
                onOpenTab(
                  nextAction.tab,
                  nextAction.dossierSection
                    ? { dossierSection: nextAction.dossierSection }
                    : undefined
                )
              }
            >
              Открыть этап
            </Button>
        </CardContent>
      </Card>

      <Card className="border-border-default">
        <CardContent className="space-y-3 pt-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Текущий этап
              </p>
              <Badge
                variant="outline"
                title={
                  activeLane === 'development'
                    ? 'Текущий этап в контуре разработки (каталог: до supply-path, в т.ч. gate-all-stakeholders)'
                    : 'Текущий этап в контуре сэмплов (каталог: от supply-path, в т.ч. samples)'
                }
                className={cn(
                  'h-5 px-1.5 text-[9px] font-bold uppercase tracking-wide',
                  activeLane === 'development'
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-950'
                    : 'border-teal-200 bg-teal-50 text-teal-950'
                )}
              >
                {workshop2PipelineLaneLabelRu(activeLane)}
              </Badge>
            </div>
            <p className="text-text-primary mt-1 text-sm font-bold">{activeStage.label}</p>
            <p className="text-text-secondary text-[11px]">Ответственный: {activeStage.owner}</p>
          </div>
          <Badge
            variant="outline"
            className={cn('h-5 text-[9px] font-bold', getStatusClass(activeStage.status))}
          >
            {getStatusLabel(activeStage.status)}
          </Badge>
          {activeStage.blocker ? (
            <p className="text-[11px] text-amber-700">{activeStage.blocker}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-border-default">
        <CardContent className="space-y-3 pt-4">
          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
            Блокеры
          </p>
          {warnings.length === 0 ? (
            <p className="text-[11px] text-emerald-700">
              Критичных блокеров для handoff не найдено.
            </p>
          ) : (
            <ul className="space-y-2">
              {warnings.slice(0, 4).map((warning) => (
                <li
                  key={warning}
                  className="rounded-md border border-amber-100 bg-amber-50/70 p-2 text-[11px] text-amber-900"
                >
                  {warning}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Workshop2ArticleWorkspaceScreen({
  collectionId,
  article,
  collection,
  createdByLabel,
  categoryLeafId,
  categoryPath,
  getArticlePipelineProgress,
  onPatchWorkshop2ArticleLine,
  listHref,
  mainTab,
  setMainTab,
  replaceStepQuery,
  w2step,
  goOverview,
  dossierSectionQuery,
  dossierViewProfile,
  sketchFloorInUrl,
}: {
  collectionId: string;
  article: Workshop2CollectionListItem['articleRows'][number];
  collection: Workshop2CollectionListItem;
  createdByLabel: string;
  categoryLeafId: string;
  categoryPath: string;
  getArticlePipelineProgress: Props['getArticlePipelineProgress'];
  onPatchWorkshop2ArticleLine: Props['onPatchWorkshop2ArticleLine'];
  listHref: string;
  mainTab: MainTab;
  setMainTab: (tab: MainTab) => void;
  replaceStepQuery: (mutate: (p: URLSearchParams) => void) => void;
  w2step: string;
  goOverview: () => void;
  dossierSectionQuery: string | null;
  dossierViewProfile: Workshop2DossierViewProfile;
  sketchFloorInUrl: boolean;
}) {
  const { bundle } = useArticleWorkspace();
  const [dossier, setDossier] = useState<Workshop2DossierPhase1 | null>(null);
  const [dossierHydrateKey, setDossierHydrateKey] = useState(0);
  const [passportHeaderDialog, setPassportHeaderDialog] = useState<
    'progress' | 'warnings' | 'sampleReadiness' | 'lifecycleStatus' | null
  >(null);
  const [passportVisualIndex, setPassportVisualIndex] = useState(0);
  const [routeStageHelpId, setRouteStageHelpId] = useState<MainTab | null>(null);
  const [dossierSectionHelpId, setDossierSectionHelpId] = useState<DossierSection | null>(null);
  const [articleHistoryOpen, setArticleHistoryOpen] = useState(false);
  const leaf = useMemo(() => findHandbookLeafById(categoryLeafId), [categoryLeafId]);

  useWorkshop2TzDueNotifications({
    dossier,
    leaf: leaf ?? null,
    collectionId,
    articleId: article.id,
    articleSku: article.sku,
  });

  const tzSignoffRevokerLabels = useMemo(
    () =>
      Array.from(
        new Set<string>(
          [...WORKSHOP2_DEFAULT_TZ_SIGNOFF_REVOKERS, createdByLabel.trim()].filter(
            (s) => s.length > 0
          )
        )
      ),
    [createdByLabel]
  );

  const lineTzBindings = article.workshopTzSignatoryBindings;

  const setDossierViewProfile = useCallback(
    (next: Workshop2DossierViewProfile) => {
      persistWorkshop2DossierViewPreference(next);
      replaceStepQuery((p) => {
        if (next === 'full') {
          p.delete(WORKSHOP2_DOSSIER_VIEW_PARAM);
        } else {
          p.set(WORKSHOP2_DOSSIER_VIEW_PARAM, next);
        }
      });
    },
    [replaceStepQuery]
  );

  useEffect(() => {
    let raw = getWorkshop2Phase1Dossier(collectionId, article.id) ?? null;
    const demoMerged = mergeSs27DemoDossierIfNeeded(
      collectionId,
      article,
      raw,
      leaf ?? null,
      createdByLabel
    );
    if (demoMerged) {
      setWorkshop2Phase1Dossier(collectionId, article.id, demoMerged);
      raw = demoMerged;
    }
    if (raw) {
      const lineB = normalizeWorkshopTzSignatoryBindings(lineTzBindings);
      const dossierB = normalizeWorkshopTzSignatoryBindings(raw.tzSignatoryBindings);
      if (lineB && !dossierB) {
        const merged: Workshop2DossierPhase1 = {
          ...raw,
          tzSignatoryBindings: lineB,
          updatedAt: new Date().toISOString(),
          updatedBy: createdByLabel.slice(0, 120),
        };
        setWorkshop2Phase1Dossier(collectionId, article.id, merged);
        raw = merged;
      }
    }
    setDossier(raw);
  }, [
    article.id,
    article.sku,
    collectionId,
    createdByLabel,
    dossierHydrateKey,
    leaf,
    lineTzBindings,
    mainTab,
  ]);

  const signatoryOptions = useMemo(() => getWorkshopTzSignatoryPickerOptions(), []);
  const signatoryByGroup = useMemo(() => {
    const m = new Map<string, typeof signatoryOptions>();
    for (const o of signatoryOptions) {
      const arr = m.get(o.group) ?? [];
      arr.push(o);
      m.set(o.group, arr);
    }
    return m;
  }, [signatoryOptions]);
  const signatorySelectChildren = useMemo(
    () => (
      <>
        <option value="">Не закреплять</option>
        {Array.from(signatoryByGroup.entries()).map(([group, opts]) => (
          <optgroup key={group} label={group}>
            {opts.map((o) => (
              <option key={`${group}-${o.value}`} value={o.value}>
                {o.label}
                {o.sublabel ? ` — ${o.sublabel}` : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </>
    ),
    [signatoryByGroup]
  );

  const passportTzBindings = useMemo((): Workshop2TzSignatoryBindings => {
    const fromDossier = dossier?.tzSignatoryBindings;
    const fromLine = lineTzBindings;
    return {
      ...fromLine,
      ...fromDossier,
    };
  }, [dossier?.tzSignatoryBindings, lineTzBindings]);

  const passportTzSignerRowsOrdered = useMemo(() => {
    const adminName = (dossier?.passportProductionBrief?.articleCardOwnerName ?? '').trim();
    const rank = (role: 'designer' | 'technologist' | 'manager') =>
      role === 'designer' ? 0 : role === 'technologist' ? 1 : 2;

    const bases = [
      {
        id: 'w2-passport-tz-des',
        role: 'designer' as const,
        label: 'Дизайн',
        valueKey: 'designerDisplayLabel' as const,
        stages: passportTzBindings.designerSignStages,
      },
      {
        id: 'w2-passport-tz-tech',
        role: 'technologist' as const,
        label: 'Технолог',
        valueKey: 'technologistDisplayLabel' as const,
        stages: passportTzBindings.technologistSignStages,
      },
      {
        id: 'w2-passport-tz-mgr',
        role: 'manager' as const,
        label: 'Менеджер',
        valueKey: 'managerDisplayLabel' as const,
        stages: passportTzBindings.managerSignStages,
      },
    ] as const;

    type Item =
      | { admin: boolean; kind: 'base'; row: (typeof bases)[number]; assignee: string }
      | { admin: boolean; kind: 'extra'; ex: Workshop2TzSignatoryExtraRow; assignee: string };

    const items: Item[] = [];
    for (const row of bases) {
      const assignee = passportTzBindings[row.valueKey]?.trim() ?? '';
      const admin = Boolean(assignee && adminName && workshopTzLabelsMatch(assignee, adminName));
      items.push({ admin, kind: 'base', row, assignee });
    }
    for (const ex of passportTzBindings.extraAssigneeRows ?? []) {
      const assignee = ex.assigneeDisplayLabel?.trim() ?? '';
      const admin = Boolean(assignee && adminName && workshopTzLabelsMatch(assignee, adminName));
      items.push({ admin, kind: 'extra', ex, assignee });
    }

    const admins = items
      .filter((i) => i.admin)
      .sort((a, b) => {
        if (a.kind === 'base' && b.kind === 'base') return rank(a.row.role) - rank(b.row.role);
        if (a.kind === 'base') return -1;
        if (b.kind === 'base') return 1;
        return 0;
      });
    const non = items.filter((i) => !i.admin);
    const nonB = non
      .filter((i): i is Extract<Item, { kind: 'base' }> => i.kind === 'base')
      .sort((a, b) => rank(a.row.role) - rank(b.row.role));
    const nonX = non.filter((i): i is Extract<Item, { kind: 'extra' }> => i.kind === 'extra');
    return [...admins, ...nonB, ...nonX];
  }, [dossier?.passportProductionBrief?.articleCardOwnerName, passportTzBindings]);

  /** Снять исполнителя или удалить доп. роль крестиком может только администратор карточки SKU (ФИО в «Админ»). */
  const articleCardAdministratorName = (
    dossier?.passportProductionBrief?.articleCardOwnerName ?? ''
  ).trim();
  const canRemovePassportTzRoleRows = useMemo(
    () =>
      Boolean(
        articleCardAdministratorName &&
        workshopTzLabelsMatch(createdByLabel, articleCardAdministratorName)
      ),
    [articleCardAdministratorName, createdByLabel]
  );

  const tzSignatoryListScrollRef = useRef<HTMLDivElement>(null);
  const prevTzExtrasCountRef = useRef<number | null>(null);
  const tzExtrasLen = passportTzBindings.extraAssigneeRows?.length ?? 0;
  useEffect(() => {
    if (
      prevTzExtrasCountRef.current !== null &&
      tzExtrasLen > prevTzExtrasCountRef.current &&
      tzSignatoryListScrollRef.current
    ) {
      const el = tzSignatoryListScrollRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
    prevTzExtrasCountRef.current = tzExtrasLen;
  }, [tzExtrasLen]);

  const persistTzBindings = useCallback(
    (patch: Partial<Workshop2TzSignatoryBindings>) => {
      const base = dossier ?? emptyWorkshop2DossierPhase1();
      const prevBind: Workshop2TzSignatoryBindings = { ...(base.tzSignatoryBindings ?? {}) };
      const nextRaw: Workshop2TzSignatoryBindings = { ...prevBind, ...patch };
      const nextB = normalizeWorkshopTzSignatoryBindings(nextRaw);
      const merged: Workshop2DossierPhase1 = {
        ...base,
        updatedAt: new Date().toISOString(),
        updatedBy: createdByLabel.slice(0, 120),
      };
      if (nextB) merged.tzSignatoryBindings = nextB;
      else delete merged.tzSignatoryBindings;
      setDossier(merged);
      setWorkshop2Phase1Dossier(collectionId, article.id, merged);
      onPatchWorkshop2ArticleLine(collectionId, article.id, {
        workshopTzSignatoryBindings: nextB ?? null,
      });
      setDossierHydrateKey((k) => k + 1);
    },
    [article.id, collectionId, createdByLabel, dossier, onPatchWorkshop2ArticleLine]
  );

  const setRoleSignStagesBulk = useCallback(
    (role: 'designer' | 'technologist' | 'manager', ids: Workshop2TzSignoffStageId[]) => {
      const field =
        role === 'designer'
          ? 'designerSignStages'
          : role === 'technologist'
            ? 'technologistSignStages'
            : 'managerSignStages';
      persistTzBindings({
        [field]: workshopTzSignStagesFromSelection(ids, W2_PASSPORT_TZ_STAGE_ORDER),
      });
    },
    [persistTzBindings]
  );

  const updateCardAdministrator = useCallback(
    (name: string) => {
      const base = dossier ?? emptyWorkshop2DossierPhase1();
      const brief = { ...(base.passportProductionBrief ?? {}) };
      const t = name.trim();
      if (t) brief.articleCardOwnerName = t;
      else delete brief.articleCardOwnerName;
      delete brief.articleCardOwnerRole;
      const merged: Workshop2DossierPhase1 = {
        ...base,
        passportProductionBrief: Object.keys(brief).length ? brief : undefined,
        updatedAt: new Date().toISOString(),
        updatedBy: createdByLabel.slice(0, 120),
      };
      setDossier(merged);
      setWorkshop2Phase1Dossier(collectionId, article.id, merged);
    },
    [article.id, collectionId, createdByLabel, dossier]
  );

  const toggleCardAdminForAssignee = useCallback(
    (assigneeLabel: string | undefined, checked: boolean) => {
      const t = assigneeLabel?.trim() ?? '';
      const cur = (dossier?.passportProductionBrief?.articleCardOwnerName ?? '').trim();
      if (checked) {
        if (t) updateCardAdministrator(t);
        return;
      }
      if (cur && workshopTzLabelsMatch(cur, t)) {
        updateCardAdministrator('');
      }
    },
    [dossier?.passportProductionBrief?.articleCardOwnerName, updateCardAdministrator]
  );

  const setExtraRowSignStagesBulk = useCallback(
    (rowId: string, ids: Workshop2TzSignoffStageId[]) => {
      const rows = [...(passportTzBindings.extraAssigneeRows ?? [])];
      const idx = rows.findIndex((r) => r.rowId === rowId);
      if (idx < 0) return;
      rows[idx] = {
        ...rows[idx]!,
        signStages: workshopTzSignStagesFromSelection(ids, W2_PASSPORT_TZ_STAGE_ORDER),
      };
      persistTzBindings({ extraAssigneeRows: rows });
    },
    [passportTzBindings.extraAssigneeRows, persistTzBindings]
  );

  const addExtraTzRoleRow = useCallback(() => {
    const row: Workshop2TzSignatoryExtraRow = {
      rowId: `w2-tz-extra-${Date.now().toString(36)}`,
      roleTitle: 'Роль',
    };
    persistTzBindings({
      extraAssigneeRows: [...(passportTzBindings.extraAssigneeRows ?? []), row],
    });
  }, [passportTzBindings.extraAssigneeRows, persistTzBindings]);

  const addExtraTzRoleFromPreset = useCallback(
    (presetId: Workshop2TzExtraRolePresetId) => {
      const row = workshop2TzExtraRowFromPreset(presetId);
      persistTzBindings({
        extraAssigneeRows: [...(passportTzBindings.extraAssigneeRows ?? []), row],
      });
    },
    [passportTzBindings.extraAssigneeRows, persistTzBindings]
  );

  const removeExtraTzRoleRow = useCallback(
    (rowId: string) => {
      if (!canRemovePassportTzRoleRows) return;
      const rows = passportTzBindings.extraAssigneeRows ?? [];
      const victim = rows.find((r) => r.rowId === rowId);
      const adminName = (dossier?.passportProductionBrief?.articleCardOwnerName ?? '').trim();
      const victimLabel = victim?.assigneeDisplayLabel?.trim() ?? '';
      if (victimLabel && adminName && workshopTzLabelsMatch(victimLabel, adminName)) return;
      const next = rows.filter((r) => r.rowId !== rowId);
      persistTzBindings({ extraAssigneeRows: next.length ? next : undefined });
    },
    [
      canRemovePassportTzRoleRows,
      dossier?.passportProductionBrief?.articleCardOwnerName,
      passportTzBindings.extraAssigneeRows,
      persistTzBindings,
    ]
  );

  const patchExtraRowTitle = useCallback(
    (rowId: string, title: string) => {
      const rows = (passportTzBindings.extraAssigneeRows ?? []).map((r) =>
        r.rowId === rowId ? { ...r, roleTitle: title } : r
      );
      persistTzBindings({ extraAssigneeRows: rows });
    },
    [passportTzBindings.extraAssigneeRows, persistTzBindings]
  );

  const patchExtraRowAssignee = useCallback(
    (rowId: string, value: string) => {
      const rows = (passportTzBindings.extraAssigneeRows ?? []).map((r) =>
        r.rowId === rowId ? { ...r, assigneeDisplayLabel: value.trim() || undefined } : r
      );
      persistTzBindings({ extraAssigneeRows: rows });
    },
    [passportTzBindings.extraAssigneeRows, persistTzBindings]
  );

  const prog = getArticlePipelineProgress(collectionId, article.id);
  const dossierReadiness = useMemo(() => calculateDossierReadiness(dossier, leaf), [dossier, leaf]);
  const dossierSummary = dossierReadiness.summary;
  const visualReadinessOverview = useMemo(
    () => visualReadinessProgress(dossier ?? emptyWorkshop2DossierPhase1()),
    [dossier]
  );
  const visualReadinessHintsOverview = useMemo(
    () => visualReadinessHints(dossier ?? emptyWorkshop2DossierPhase1(), { sketchFloorInUrl }),
    [dossier, sketchFloorInUrl]
  );
  const overviewVisualGateItems = useMemo(
    () => buildWorkshop2VisualGateItems(dossier ?? emptyWorkshop2DossierPhase1(), leaf),
    [dossier, leaf]
  );
  const overviewModel = useMemo(
    () =>
      buildWorkshop2OverviewModel({
        dossier,
        leaf,
        bundle: toWorkshop2OverviewBundleSnapshot(bundle),
      }),
    [bundle, dossier, leaf]
  );
  const routeStages = overviewModel.routeStages as RouteStageMeta[];
  const nextAction = overviewModel.primaryAction;

  const { user } = useAuth();
  const w2MlMetricsCtx = useMemo(
    () => ({
      appUserUid: user?.uid ?? null,
      orgId: user?.activeOrganizationId ?? null,
      sku: article.sku,
    }),
    [user?.uid, user?.activeOrganizationId, article.sku]
  );
  const mlNavSeqRef = useRef<{ snapshotHash: string; seq: number }>({ snapshotHash: '', seq: 0 });
  const prevMainNavRef = useRef<{ tab: MainTab; section: string | null } | null>(null);
  useEffect(() => {
    prevMainNavRef.current = null;
    mlNavSeqRef.current = { snapshotHash: '', seq: 0 };
  }, [article.id]);
  const bundleSnapForMl = useMemo(() => toWorkshop2OverviewBundleSnapshot(bundle), [bundle]);
  const warningsDigest = dossierSummary.warnings.join('\u0001');

  useEffect(() => {
    if (typeof window === 'undefined' || !dossier) return;
    const snap = buildW2NextStepMlSnapshot({
      warnings: dossierSummary.warnings,
      model: overviewModel,
      bundle: bundleSnapForMl,
    });
    const buf = w2UpsertNextStepMlBuffer(collectionId, article.id, snap);
    if (buf.snapshotHash !== mlNavSeqRef.current.snapshotHash) {
      mlNavSeqRef.current = { snapshotHash: buf.snapshotHash, seq: 0 };
    }
  }, [article.id, bundleSnapForMl, collectionId, dossier, overviewModel, warningsDigest]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sec = dossierSectionQuery;
    const prev = prevMainNavRef.current;
    prevMainNavRef.current = { tab: mainTab, section: sec };
    if (!prev) return;
    if (prev.tab === mainTab && prev.section === sec) return;

    const buf = w2ReadNextStepMlBuffer(collectionId, article.id);
    if (!buf) return;
    if (buf.snapshotHash !== mlNavSeqRef.current.snapshotHash) {
      mlNavSeqRef.current = { snapshotHash: buf.snapshotHash, seq: 0 };
    }
    mlNavSeqRef.current.seq += 1;
    const seq = mlNavSeqRef.current.seq;
    flushW2NextStepFeedbackToServer(
      collectionId,
      article.id,
      {
        sku: article.sku,
        buffer: buf,
        mainTab,
        dossierSection: sec,
        navigationSeq: seq,
      },
      w2MlMetricsCtx
    );
  }, [article.id, article.sku, collectionId, dossierSectionQuery, mainTab, w2MlMetricsCtx]);

  const lifecycleState = dossier?.lifecycleState ?? 'draft';
  const passportLifecycleStatusLabel =
    lifecycleState === 'accepted'
      ? getLifecycleStateLabel('accepted')
      : lifecycleState === 'rework_requested'
        ? getLifecycleStateLabel('rework_requested')
        : 'Образец в работе';

  const focusDossierSection = useMemo(
    () => parseWorkshop2DossierSection(dossierSectionQuery),
    [dossierSectionQuery]
  );

  const routeStageHelp =
    routeStageHelpId !== null
      ? WORKSHOP2_ROUTE_STAGE_GUIDANCE[routeStageHelpId as Workshop2OverviewTab]
      : null;
  const routeStageHelpLane = useMemo(
    () => (routeStageHelpId ? workshop2PipelineLaneForArticleMainTab(routeStageHelpId) : null),
    [routeStageHelpId]
  );
  const dossierSectionHelp =
    dossierSectionHelpId !== null ? WORKSHOP2_DOSSIER_SECTION_GUIDANCE[dossierSectionHelpId] : null;

  const articleProductionHistory = useMemo(
    () =>
      buildWorkshop2ArticleProductionHistory({
        collectionId,
        articleId: article.id,
        articleSku: article.sku,
        dossierUpdatedAt: dossier?.updatedAt,
        dossierUpdatedBy: dossier?.updatedBy,
        inventoryAddedAt: article.addedAtIso,
        inventoryUpdatedAt: article.updatedAtIso,
        inventoryActor: article.createdInWorkshop2By,
      }),
    [
      collectionId,
      article.id,
      article.sku,
      article.addedAtIso,
      article.updatedAtIso,
      article.createdInWorkshop2By,
      dossier?.updatedAt,
      dossier?.updatedBy,
    ]
  );

  const passportUpdatedDisplay = useMemo(() => {
    const stamps = [dossier?.updatedAt, article.addedAtIso, article.updatedAtIso].filter(
      (x): x is string => Boolean(x)
    );
    if (stamps.length === 0) return null;
    const maxIso = stamps.reduce((a, b) => (a > b ? a : b));
    return new Date(maxIso).toLocaleDateString('ru-RU');
  }, [dossier?.updatedAt, article.addedAtIso, article.updatedAtIso]);

  const passportSketchSlides = useMemo(() => {
    if (!dossier) return [];
    const slides: { src: string; alt: string }[] = [];
    if (dossier.categorySketchImageDataUrl) {
      slides.push({
        src: dossier.categorySketchImageDataUrl,
        alt: 'Основной эскиз в паспорте артикула',
      });
    }
    const slots = [...(dossier.subcategorySketchSlots ?? [])].sort((a, b) => a.level - b.level);
    for (const slot of slots) {
      if (slot.imageDataUrl) {
        slides.push({
          src: slot.imageDataUrl,
          alt: `Эскиз уровня ${slot.level}`,
        });
      }
    }
    for (const sheet of dossier.sketchSheets ?? []) {
      if (sheet.imageDataUrl) {
        const t = sheet.title?.trim() || sheet.viewKind || 'лист';
        slides.push({
          src: sheet.imageDataUrl,
          alt: `Скетч-лист: ${t}`,
        });
      }
    }
    return slides;
  }, [dossier]);

  const passportReferenceSlides = useMemo(() => {
    if (!dossier) return [];
    const slides: { src: string; alt: string }[] = [];
    for (const ref of dossier.visualReferences ?? []) {
      if (ref.previewDataUrl && ref.mimeType?.startsWith('image/')) {
        slides.push({
          src: ref.previewDataUrl,
          alt: ref.title?.trim() ? ref.title : 'Визуальный референс',
        });
      }
    }
    return slides;
  }, [dossier]);

  const passportGeneratedSlides = useMemo(() => {
    if (!dossier) return [];
    const urls = dossier.passportGeneratedImageDataUrls ?? [];
    return urls.filter(Boolean).map((src, i) => ({
      src,
      alt: `Сгенерированное фото ${i + 1}`,
    }));
  }, [dossier]);

  const passportVisualSource: Workshop2PassportVisualSource =
    dossier?.passportVisualSource ?? 'sketch';

  const passportVisualSlides = useMemo(() => {
    if (passportVisualSource === 'reference') return passportReferenceSlides;
    if (passportVisualSource === 'generated') return passportGeneratedSlides;
    return passportSketchSlides;
  }, [
    passportVisualSource,
    passportReferenceSlides,
    passportGeneratedSlides,
    passportSketchSlides,
  ]);

  const updatePassportVisualSource = useCallback(
    (next: Workshop2PassportVisualSource) => {
      setDossier((prev) => {
        const base = prev ?? emptyWorkshop2DossierPhase1();
        const merged: Workshop2DossierPhase1 = {
          ...base,
          passportVisualSource: next,
          updatedAt: new Date().toISOString(),
          updatedBy: createdByLabel.slice(0, 120),
        };
        setWorkshop2Phase1Dossier(collectionId, article.id, merged);
        return merged;
      });
    },
    [article.id, collectionId, createdByLabel]
  );

  useEffect(() => {
    setPassportVisualIndex((i) => {
      const n = passportVisualSlides.length;
      if (n === 0) return 0;
      return Math.min(i, n - 1);
    });
  }, [passportVisualSlides]);

  const [articleSectionFlashId, setArticleSectionFlashId] = useState<string | null>(null);
  const [dossierFlash, setDossierFlash] = useState<DossierFlashState>(null);
  const articleFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dossierFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pulseArticleFlash = useCallback((id: string | null) => {
    if (articleFlashTimerRef.current) {
      clearTimeout(articleFlashTimerRef.current);
      articleFlashTimerRef.current = null;
    }
    setArticleSectionFlashId(id);
    if (id !== null) {
      articleFlashTimerRef.current = setTimeout(() => {
        setArticleSectionFlashId(null);
        articleFlashTimerRef.current = null;
      }, 3000);
    }
  }, []);

  const pulseDossierFlash = useCallback((next: DossierFlashState) => {
    if (dossierFlashTimerRef.current) {
      clearTimeout(dossierFlashTimerRef.current);
      dossierFlashTimerRef.current = null;
    }
    setDossierFlash(next);
    if (next !== null) {
      dossierFlashTimerRef.current = setTimeout(() => {
        setDossierFlash(null);
        dossierFlashTimerRef.current = null;
      }, 3000);
    }
  }, []);

  const defaultOperationalFlashId = useCallback((tab: MainTab): string | null => {
    switch (tab) {
      case 'supply':
        return W2_ARTICLE_SECTION_DOM.supply;
      case 'fit':
        return W2_ARTICLE_SECTION_DOM.fit;
      case 'plan':
        return W2_ARTICLE_SECTION_DOM.planPo;
      case 'release':
        return W2_ARTICLE_SECTION_DOM.release;
      case 'qc':
        return W2_ARTICLE_SECTION_DOM.qc;
      case 'stock':
        return W2_ARTICLE_SECTION_DOM.stock;
      default:
        return null;
    }
  }, []);

  const openTab = useCallback(
    (tab: MainTab, opts?: OpenTabOpts) => {
      setMainTab(tab);
      replaceStepQuery((p) => {
        if (tab === 'overview') {
          p.delete(WORKSHOP2_STEP_PARAM);
          p.delete(WORKSHOP2_DOSSIER_SECTION_PARAM);
          p.delete(WORKSHOP2_ARTICLE_PANE_PARAM);
          return;
        }
        if (tab === 'tz') {
          if (opts?.dossierSection) {
            p.set(WORKSHOP2_DOSSIER_SECTION_PARAM, opts.dossierSection);
          } else {
            p.delete(WORKSHOP2_DOSSIER_SECTION_PARAM);
          }
          p.set(WORKSHOP2_ARTICLE_PANE_PARAM, 'tz');
          return;
        }
        p.delete(WORKSHOP2_DOSSIER_SECTION_PARAM);
        p.set(WORKSHOP2_ARTICLE_PANE_PARAM, tab);
      });
    },
    [replaceStepQuery, setMainTab]
  );

  const scrollToDomIdInWorkspace = useCallback((domId: string, delayMs: number) => {
    if (typeof window === 'undefined') return;
    window.setTimeout(() => {
      const el = document.getElementById(domId);
      const reduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', `${pathname}${search}#${domId}`);
    }, delayMs);
  }, []);

  const openTabWithFlash = useCallback(
    (tab: MainTab, opts?: OpenTabWithFlashOpts) => {
      openTab(
        tab,
        opts?.dossierSection != null ? { dossierSection: opts.dossierSection } : undefined
      );
      if (tab === 'tz') {
        pulseArticleFlash(null);
        if (opts?.dossierSection != null) {
          pulseDossierFlash({ mode: 'section', section: opts.dossierSection });
        } else {
          pulseDossierFlash({ mode: 'main' });
        }
        if (opts?.scrollDomId) {
          scrollToDomIdInWorkspace(opts.scrollDomId, 180);
        } else if (opts?.dossierSection === 'visuals' && typeof window !== 'undefined') {
          window.setTimeout(() => {
            const { pathname, search } = window.location;
            window.history.replaceState(null, '', `${pathname}${search}#w2-visuals-hub`);
          }, 160);
        }
      } else if (tab === 'overview') {
        pulseDossierFlash(null);
        pulseArticleFlash(null);
      } else {
        pulseDossierFlash(null);
        const flashId =
          opts?.articleFlashId != null ? opts.articleFlashId : defaultOperationalFlashId(tab);
        pulseArticleFlash(flashId);
        if (opts?.scrollDomId) {
          scrollToDomIdInWorkspace(opts.scrollDomId, 220);
        }
      }
    },
    [
      openTab,
      pulseArticleFlash,
      pulseDossierFlash,
      defaultOperationalFlashId,
      scrollToDomIdInWorkspace,
    ]
  );

  /** Deep link: `?w2pane=fit#w2article-section-fit` после гидрации вкладки. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const paneRaw = parseWorkshop2ArticlePaneParam(
      new URLSearchParams(window.location.search).get(WORKSHOP2_ARTICLE_PANE_PARAM)
    );
    if (!paneRaw || paneRaw === 'overview' || paneRaw === 'tz') return;
    if (mainTab !== (paneRaw as MainTab)) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 280);
    return () => window.clearTimeout(t);
  }, [article.id, collectionId, mainTab]);

  const goToTzSection = useCallback(
    (section: DossierSection) => {
      openTabWithFlash('tz', { dossierSection: section });
    },
    [openTabWithFlash]
  );

  const articleSegForHref = workshop2ArticleUrlSegment(article.internalArticleCode, article.id);
  const articleOverviewHref = useMemo(
    () => workshop2ArticleHref(collectionId, articleSegForHref, { w2pane: 'overview' }),
    [articleSegForHref, collectionId]
  );

  const articleBreadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const stageMeta = routeStages.find((s) => s.id === mainTab);
    const stageShort = stageMeta?.label ?? mainTab;
    const isDev = workshop2PipelineLaneForArticleMainTab(mainTab) === 'development';
    const fourth = isDev
      ? mainTab === 'tz'
        ? 'Разработка · ТЗ'
        : 'Разработка · Обзор'
      : `Сэмплы · ${stageShort}`;

    return [
      { label: COLLECTION_DEV_HUB_TITLE_RU, href: ROUTES.brand.productionWorkshop2 },
      {
        label: `Коллекция · ${collection.displayName}`,
        href: listHref,
        title: collection.displayName,
      },
      { label: article.sku, href: articleOverviewHref },
      { label: fourth },
    ];
  }, [
    article.sku,
    articleOverviewHref,
    collection.displayName,
    listHref,
    mainTab,
    routeStages,
  ]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Breadcrumb
          items={articleBreadcrumbItems}
          className="text-text-secondary flex-wrap gap-x-1 gap-y-0.5 text-[11px] leading-tight"
        />
        <p className="text-text-muted text-[10px] leading-snug">
          Коллекция → разработка артикула → сэмплы; серия и опт — на поле цеха и в B2B.
        </p>
      </div>
      <Card className="border-border-default overflow-hidden bg-white shadow-md">
        <div className="from-accent-primary via-accent-primary relative h-2 bg-gradient-to-r to-emerald-500" />
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Visual Passport Side */}
            <div className="border-border-subtle bg-bg-surface2 flex w-full shrink-0 flex-col items-center justify-center gap-3 border-b p-4 lg:w-48 lg:border-b-0 lg:border-r xl:w-56">
              <div
                className="flex w-full max-w-[11rem] flex-wrap justify-center gap-1"
                role="group"
                aria-label="Источник изображения в паспорте"
              >
                {(
                  [
                    { key: 'sketch' as const, label: 'Эскиз' },
                    { key: 'reference' as const, label: 'Референс' },
                    { key: 'generated' as const, label: 'Сгенерир.' },
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updatePassportVisualSource(key)}
                    className={cn(
                      'rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wide transition-colors',
                      passportVisualSource === key
                        ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'border-border-default text-text-secondary hover:border-border-default bg-white'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="border-border-default text-text-muted group-hover:bg-accent-primary/10 relative flex h-44 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-white transition-colors xl:h-52 xl:w-40">
                {passportVisualSlides.length > 0 ? (
                  <>
                    <img
                      src={passportVisualSlides[passportVisualIndex]!.src}
                      alt={passportVisualSlides[passportVisualIndex]!.alt}
                      className="h-full w-full object-contain p-2"
                    />
                    {passportVisualSlides.length > 1 ? (
                      <>
                        <button
                          type="button"
                          aria-label="Предыдущее изображение"
                          className="border-border-default text-text-primary hover:text-text-primary absolute left-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPassportVisualIndex(
                              (i) =>
                                (i - 1 + passportVisualSlides.length) % passportVisualSlides.length
                            );
                          }}
                        >
                          <LucideIcons.ChevronLeft className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          aria-label="Следующее изображение"
                          className="border-border-default text-text-primary hover:text-text-primary absolute right-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPassportVisualIndex((i) => (i + 1) % passportVisualSlides.length);
                          }}
                        >
                          <LucideIcons.ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                        <span className="text-text-secondary pointer-events-none absolute bottom-1 left-0 right-0 text-center text-[9px] font-medium tabular-nums">
                          {passportVisualIndex + 1} / {passportVisualSlides.length}
                        </span>
                      </>
                    ) : null}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 px-2 text-center">
                    <LucideIcons.ImageOff className="h-8 w-8 opacity-25" aria-hidden />
                    <span className="text-text-muted text-[9px] font-medium leading-snug">
                      {passportVisualSource === 'sketch'
                        ? 'Нет эскиза'
                        : passportVisualSource === 'reference'
                          ? 'Нет референса с превью'
                          : 'Нет сгенерированного фото'}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[9px]"
                      onClick={() => openTabWithFlash('tz', { dossierSection: 'visuals' })}
                    >
                      ТЗ · Визуал
                    </Button>
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 left-1/2 z-20 h-7 -translate-x-1/2 text-[9px] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                  onClick={() => openTabWithFlash('tz', { dossierSection: 'visuals' })}
                >
                  ИЗМЕНИТЬ
                </Button>
              </div>
              <div
                className="w-full max-w-[11rem] space-y-0.5 text-center"
                title={
                  isWorkshop2InternalArticleCodeValid(article.internalArticleCode)
                    ? undefined
                    : 'Формат: 6 цифр от 100000. Номер присваивается при сохранении строки в инвентаре разработки коллекции.'
                }
              >
                <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                  Внутренний артикул
                </p>
                <p
                  className={cn(
                    'font-mono text-sm font-semibold tabular-nums',
                    isWorkshop2InternalArticleCodeValid(article.internalArticleCode)
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  )}
                >
                  id{' '}
                  {isWorkshop2InternalArticleCodeValid(article.internalArticleCode)
                    ? article.internalArticleCode
                    : formatWorkshop2InternalArticleCodePlaceholder()}
                </p>
              </div>
            </div>

            {/* Core Info Side */}
            <div className="flex min-h-0 flex-1 flex-col p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-text-secondary hover:text-text-primary hover:bg-bg-surface2 -ml-2 h-7 gap-1.5 px-2 text-[10px]"
                    >
                      <Link href={listHref}>
                        <LucideIcons.ArrowLeft className="h-3 w-3 shrink-0" aria-hidden />
                        {collection.displayName}
                      </Link>
                    </Button>
                    <span className="text-text-muted">/</span>
                    <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      {workshop2PipelineLaneForArticleMainTab(mainTab) === 'development'
                        ? 'Разработка · паспорт SKU'
                        : 'Сэмплы · маршрут артикула'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-text-primary truncate text-2xl font-black tracking-tight sm:text-3xl">
                      <span className="text-accent-primary font-mono">{article.sku}</span>
                    </h1>
                    <div className="flex items-center gap-2">
                      <LucideIcons.Tag className="text-text-muted h-3.5 w-3.5" />
                      <p className="text-text-primary text-sm font-bold">
                        {categoryPath || article.name}
                      </p>
                    </div>
                    <p className="text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                      <span className="text-text-primary font-semibold">Визуал · контур:</span>
                      {overviewVisualGateItems.length === 0 ? (
                        <span className="font-medium text-emerald-700">закрыт</span>
                      ) : (
                        <>
                          <span className="font-semibold tabular-nums text-amber-700">
                            {overviewVisualGateItems.length} открыто
                          </span>
                          <Link
                            className="text-accent-primary decoration-accent-primary/30 hover:text-accent-primary font-medium underline underline-offset-2"
                            href={workshop2ArticleHref(
                              collectionId,
                              workshop2ArticleUrlSegment(article.internalArticleCode, article.id),
                              {
                                w2step: '1',
                                w2sec: 'visuals',
                                w2pane: 'tz',
                                hash: 'w2-visuals-hub',
                              }
                            )}
                          >
                            Открыть в ТЗ
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="border-border-default bg-bg-surface2/80 flex shrink-0 overflow-hidden rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setPassportHeaderDialog('progress')}
                    className="hover:bg-bg-surface2 flex min-w-[3.25rem] flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-left transition-colors"
                    title="Прогресс маршрута по SKU"
                  >
                    <span className="text-text-secondary text-[8px] font-bold uppercase tracking-tight">
                      Прогресс
                    </span>
                    <Badge
                      variant="outline"
                      className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary h-4 px-1 text-[8px] font-bold tabular-nums leading-none"
                    >
                      {prog.pct}%
                    </Badge>
                  </button>
                  <span className="bg-border-subtle w-px shrink-0" aria-hidden />
                  <button
                    type="button"
                    onClick={() => setPassportHeaderDialog('warnings')}
                    className="hover:bg-bg-surface2 flex min-w-[3.25rem] flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-left transition-colors"
                    title="Замечания по ТЗ"
                  >
                    <span className="text-text-secondary text-[8px] font-bold uppercase tracking-tight">
                      Замечания
                    </span>
                    <span
                      className={cn(
                        'text-sm font-black tabular-nums leading-none',
                        dossierSummary.warnings.length > 0 ? 'text-amber-600' : 'text-emerald-600'
                      )}
                    >
                      {dossierSummary.warnings.length}
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-border-subtle mt-4 flex flex-col gap-4 border-t pt-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                <div className="border-border-default w-full max-w-[28rem] shrink-0 space-y-1.5 rounded-lg border bg-white p-2 shadow-sm">
                  <p className="text-text-secondary flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
                    <LucideIcons.UserCheck
                      className="text-accent-primary h-3 w-3 shrink-0"
                      aria-hidden
                    />
                    Ответственные за подпись ТЗ
                  </p>
                  <div
                    ref={tzSignatoryListScrollRef}
                    className="max-h-[7.75rem] space-y-1.5 overflow-y-auto overscroll-contain pr-0.5"
                  >
                    {passportTzSignerRowsOrdered.map((entry) => {
                      if (entry.kind === 'extra') {
                        const ex = entry.ex;
                        const exAssignee = ex.assigneeDisplayLabel?.trim() ?? '';
                        const adm =
                          dossier?.passportProductionBrief?.articleCardOwnerName?.trim() ?? '';
                        const extraRowIsCardAdmin = Boolean(
                          exAssignee && adm && workshopTzLabelsMatch(exAssignee, adm)
                        );
                        return (
                          <PassportTzExtraAssigneeCard
                            key={ex.rowId}
                            ex={ex}
                            signatorySelectChildren={signatorySelectChildren}
                            articleCardOwnerName={
                              dossier?.passportProductionBrief?.articleCardOwnerName?.trim() ?? ''
                            }
                            onPatchTitle={(title) => patchExtraRowTitle(ex.rowId, title)}
                            onPatchAssignee={(value) => patchExtraRowAssignee(ex.rowId, value)}
                            onStagesChange={(ids) => setExtraRowSignStagesBulk(ex.rowId, ids)}
                            onRemove={() => removeExtraTzRoleRow(ex.rowId)}
                            toggleCardAdminForAssignee={toggleCardAdminForAssignee}
                            canRemoveRow={canRemovePassportTzRoleRows && !extraRowIsCardAdmin}
                          />
                        );
                      }
                      const row = entry.row;
                      const assignee = passportTzBindings[row.valueKey]?.trim() ?? '';
                      const adminName =
                        dossier?.passportProductionBrief?.articleCardOwnerName?.trim() ?? '';
                      const adminOn = Boolean(
                        assignee && adminName && workshopTzLabelsMatch(assignee, adminName)
                      );
                      const showClearBaseAssignee =
                        Boolean(assignee) && canRemovePassportTzRoleRows && !adminOn;
                      return (
                        <div
                          key={row.id}
                          className="border-border-subtle bg-bg-surface2/80 rounded-md border p-1.5"
                        >
                          <div className="mb-1 flex min-w-0 items-center gap-1">
                            <Label
                              htmlFor={row.id}
                              className="text-text-secondary mb-0 min-w-0 flex-1 truncate text-[9px] font-semibold leading-tight"
                            >
                              {row.label}
                            </Label>
                            {showClearBaseAssignee ? (
                              <button
                                type="button"
                                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                                onClick={() => {
                                  persistTzBindings({
                                    [row.valueKey]: undefined,
                                  });
                                }}
                                aria-label={`Сбросить исполнителя: ${row.label}`}
                              >
                                <LucideIcons.X className="h-2 w-2" strokeWidth={2.75} aria-hidden />
                              </button>
                            ) : (
                              <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
                            )}
                          </div>
                          <div className="flex min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto">
                            <select
                              id={row.id}
                              className="h-7 min-w-[7rem] flex-1 rounded-md border border-input bg-background px-1.5 text-[11px]"
                              value={passportTzBindings[row.valueKey] ?? ''}
                              onChange={(e) =>
                                persistTzBindings({
                                  [row.valueKey]: e.target.value.trim() || undefined,
                                })
                              }
                            >
                              {signatorySelectChildren}
                            </select>
                            <W2PassportTzStagesPick
                              idPrefix={row.id}
                              selectedIds={workshopTzSelectedStageIds(
                                row.stages,
                                W2_PASSPORT_TZ_STAGE_ORDER
                              )}
                              onChange={(ids) => setRoleSignStagesBulk(row.role, ids)}
                            />
                            <button
                              type="button"
                              disabled={!assignee}
                              title="Администратор модели карточки SKU: один на артикул, можно снять"
                              aria-pressed={adminOn}
                              className={cn(
                                'shrink-0 whitespace-nowrap rounded border px-1 py-0.5 text-[8px] font-semibold transition',
                                !assignee && 'cursor-not-allowed opacity-35',
                                adminOn
                                  ? 'border-accent-primary/40 bg-accent-primary/15 text-accent-primary'
                                  : 'border-border-default text-text-secondary hover:bg-bg-surface2 bg-white'
                              )}
                              onClick={() =>
                                toggleCardAdminForAssignee(assignee || undefined, !adminOn)
                              }
                            >
                              Админ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap gap-1">
                      {WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS.map((p) => (
                        <Button
                          key={p.id}
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-6 px-1.5 text-[9px] font-medium"
                          title={`Добавить «${p.roleTitle}» (по умолчанию без подписи на этапе «ТЗ»; этапы — справа)`}
                          onClick={() => addExtraTzRoleFromPreset(p.id)}
                        >
                          + {WORKSHOP2_TZ_EXTRA_ROLE_PRESET_BUTTON_LABEL_RU[p.id]}
                        </Button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 w-full max-w-[11rem] text-[10px] font-medium"
                      onClick={addExtraTzRoleRow}
                    >
                      + Своя роль
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-1.5 sm:items-end lg:ml-auto lg:shrink-0">
                  <button
                    type="button"
                    onClick={() => setPassportHeaderDialog('sampleReadiness')}
                    className={cn(
                      'focus-visible:ring-accent-primary h-6 max-w-full cursor-pointer justify-end rounded-md border-2 px-3 text-right text-[10px] font-black leading-tight tracking-wide transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:ml-auto',
                      dossierSummary.readyForSample
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-800'
                    )}
                    title="Нажмите — минимальный чеклист и замечания"
                  >
                    {dossierSummary.readyForSample
                      ? 'Готово к образцу'
                      : 'Досье не готово к образцу'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassportHeaderDialog('lifecycleStatus')}
                    className={cn(
                      'focus-visible:ring-accent-primary h-5 max-w-full cursor-pointer justify-end rounded-md border px-2 text-right text-[9px] font-bold tracking-wide transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:ml-auto',
                      getLifecycleStateBadgeClass(lifecycleState as 'draft')
                    )}
                    title="Нажмите — что означает статус жизненного цикла"
                  >
                    {passportLifecycleStatusLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setArticleHistoryOpen(true)}
                    className="text-text-muted hover:bg-bg-surface2 hover:text-text-primary inline-flex max-w-full flex-col items-end gap-0.5 rounded-md py-0.5 text-right text-[10px] font-medium transition-colors sm:ml-auto"
                    title="История изменений по артикулу в разработке коллекции"
                  >
                    <span className="inline-flex items-center gap-1">
                      <LucideIcons.Clock className="h-3 w-3 shrink-0" aria-hidden />
                      <span className="border-border-default hover:border-border-subtle border-b border-dashed">
                        Обновлено
                      </span>
                    </span>
                    <span className="text-text-secondary tabular-nums">
                      {passportUpdatedDisplay ?? 'нет данных'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {mainTab === 'overview' ? (
        <>
          <div className="space-y-4">
            <Workshop2ArticleRouteStatusCard
              routeStages={routeStages}
              activeTab={mainTab}
              onOpenStage={(tab) => openTabWithFlash(tab)}
              onStageHelp={(tab) => setRouteStageHelpId(tab)}
            />
            <div className="space-y-1.5">
              <button
                type="button"
                className="border-border-default hover:border-accent-primary/30 hover:bg-bg-surface2/90 flex w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left shadow-sm transition"
                onClick={() => openTabWithFlash('tz', { dossierSection: 'visuals' })}
              >
                <div className="min-w-0">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Визуал
                  </p>
                  <p className="text-text-primary mt-0.5 truncate text-sm font-semibold">
                    Готовность раздела (менеджер)
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div
                    className="bg-bg-surface2 h-2 w-[5.5rem] overflow-hidden rounded-full"
                    role="progressbar"
                    aria-valuenow={visualReadinessOverview.done}
                    aria-valuemin={0}
                    aria-valuemax={visualReadinessOverview.total}
                    aria-label="Прогресс чеклиста визуала"
                  >
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        visualReadinessOverview.done >= visualReadinessOverview.total
                          ? 'bg-emerald-500'
                          : 'bg-accent-primary'
                      )}
                      style={{
                        width: `${Math.round(
                          (100 * visualReadinessOverview.done) /
                            Math.max(visualReadinessOverview.total, 1)
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-text-primary text-sm font-bold tabular-nums">
                    {visualReadinessOverview.done}/{visualReadinessOverview.total}
                  </span>
                </div>
              </button>
              {Object.keys(visualReadinessHintsOverview).length > 0 ? (
                <ul className="border-accent-primary/30 text-accent-primary/90 ml-0.5 space-y-0.5 border-l-2 pl-3 text-[10px] leading-snug">
                  {Object.entries(visualReadinessHintsOverview)
                    .slice(0, 6)
                    .map(([key, msg]) => (
                      <li key={key}>{msg}</li>
                    ))}
                </ul>
              ) : null}
            </div>
            <Workshop2StageSignatoryStrip
              bindings={passportTzBindings}
              stage={mainTabToSignoffStage(mainTab)}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
              <Workshop2OverviewDecisionSnapshot
                items={overviewModel.decisionItems}
                onOpenSectionHelp={(section) => setDossierSectionHelpId(section)}
                onGoToTzSection={goToTzSection}
                className="min-h-0 w-full min-w-0"
              />
              <Workshop2OverviewTopBlockers
                blockers={overviewModel.topBlockers}
                onOpenTab={openTabWithFlash}
                className="min-h-0 w-full min-w-0"
              />
            </div>
          </div>
          <SectionContainer className="mt-4 space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
              <Workshop2ArticleWorkspaceOverviewStats
                onOpenTabWithFlash={openTabWithFlash}
                onOpenRouteStageHelp={(tab) => setRouteStageHelpId(tab)}
                routeStages={overviewModel.routeStages}
              />
              <Workshop2OverviewActionRail action={nextAction} onOpenTab={openTabWithFlash} />
            </div>
          </SectionContainer>
        </>
      ) : null}

      {mainTab === 'overview' ? null : mainTab === 'tz' ? (
        <Workshop2DossierViewProvider
          profile={dossierViewProfile}
          setProfile={setDossierViewProfile}
        >
          <div className="mt-4 space-y-4">
            <Workshop2ArticleRouteStatusCard
              routeStages={routeStages}
              activeTab={mainTab}
              onOpenStage={(tab) => openTabWithFlash(tab)}
              onStageHelp={(tab) => setRouteStageHelpId(tab)}
            />
            <Card className="border-border-default from-bg-surface2/80 to-bg-surface bg-gradient-to-b">
              <CardContent className="pb-8 pt-6">
                <div className="border-border-subtle mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Режим ТЗ
                    </span>
                    <Badge
                      variant="outline"
                      title="Контур разработки: в каталоге до supply-path (в т.ч. gate-all-stakeholders) — левая часть мини-шкалы в списке коллекции"
                      className="h-5 border-indigo-200 bg-indigo-50 px-1.5 text-[9px] font-bold uppercase tracking-wide text-indigo-950"
                    >
                      Разработка
                    </Badge>
                  </div>
                  <Workshop2DossierViewModeSelect />
                </div>
                <Workshop2Phase1DossierPanel
                  collectionId={collectionId}
                  articleId={article.id}
                  internalArticleCode={article.internalArticleCode}
                  articleSku={article.sku}
                  articleName={article.name}
                  categoryLeafId={categoryLeafId}
                  updatedByLabel={createdByLabel}
                  focusDossierSection={focusDossierSection}
                  flashDossier={dossierFlash}
                  variant={w2step === '3' ? 'phase3' : w2step === '2' ? 'phase2' : 'phase1'}
                  onNavigateToTab={openTabWithFlash}
                  onBack={w2step === '1' ? goOverview : undefined}
                  onPreviousStep={
                    w2step === '2'
                      ? () => replaceStepQuery((p) => p.delete(WORKSHOP2_STEP_PARAM))
                      : w2step === '3'
                        ? () =>
                            replaceStepQuery((p) => {
                              p.set(WORKSHOP2_STEP_PARAM, '2');
                            })
                        : undefined
                  }
                  onContinueToNextStep={
                    w2step === '1'
                      ? () =>
                          replaceStepQuery((p) => {
                            p.set(WORKSHOP2_STEP_PARAM, '2');
                          })
                      : undefined
                  }
                  onContinueToStep3={
                    w2step === '2'
                      ? () =>
                          replaceStepQuery((p) => {
                            p.set(WORKSHOP2_STEP_PARAM, '3');
                          })
                      : undefined
                  }
                  onFinishWorkshop={w2step === '3' ? goOverview : undefined}
                  onPatchArticleLine={(patch) =>
                    onPatchWorkshop2ArticleLine(collectionId, article.id, patch)
                  }
                  tzSignoffRevokerLabels={tzSignoffRevokerLabels}
                  tzDigitalSignoffCapabilities={WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES}
                  dossierHydrateKey={dossierHydrateKey}
                />
              </CardContent>
            </Card>
          </div>
        </Workshop2DossierViewProvider>
      ) : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <Workshop2ArticleRouteStatusCard
              routeStages={routeStages}
              activeTab={mainTab}
              onOpenStage={(tab) => openTabWithFlash(tab)}
              onStageHelp={(tab) => setRouteStageHelpId(tab)}
            />
            <Workshop2ArticleWorkspaceTabPanels
              tab={mainTab}
              flashSectionId={articleSectionFlashId}
            />
            <Workshop2StageSignatoryStrip
              bindings={passportTzBindings}
              stage={mainTabToSignoffStage(mainTab)}
            />
          </div>
          <Workshop2ArticleContextRail
            stages={routeStages}
            activeTab={mainTab}
            nextAction={nextAction}
            warnings={dossierSummary.warnings}
            onOpenTab={openTabWithFlash}
          />
        </div>
      )}

      <Dialog
        open={passportHeaderDialog !== null}
        onOpenChange={(open) => {
          if (!open) setPassportHeaderDialog(null);
        }}
      >
        <DialogContent
          key={passportHeaderDialog ?? 'closed'}
          ariaTitle={
            passportHeaderDialog === 'progress'
              ? 'Прогресс маршрута'
              : passportHeaderDialog === 'warnings'
                ? 'Замечания по ТЗ'
                : passportHeaderDialog === 'sampleReadiness'
                  ? 'Готовность досье к образцу'
                  : 'Статус жизненного цикла досье'
          }
          className="max-h-[min(85vh,640px)] max-w-md overflow-y-auto"
        >
          {passportHeaderDialog === 'progress' ? (
            <>
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-text-primary text-base font-semibold leading-none tracking-tight">
                  Прогресс
                </h2>
                <p className="text-text-secondary text-sm">
                  Шаги маршрута SKU и заполнение разделов ТЗ (есть / нет данных).
                </p>
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <div className="border-border-subtle bg-bg-surface2/80 rounded-lg border p-3">
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                    Маршрут
                  </p>
                  <p className="text-text-primary mt-1">
                    Выполнено шагов: {prog.done} из {prog.total} ({prog.pct}%).
                  </p>
                  <p className="text-text-muted mt-2 text-[11px] leading-snug">
                    По каталогу этапов коллекции — та же шкала, что мини-полоска в списке: слева разработка и ТЗ, справа
                    сэмплы и выпуск; в карточке артикула контур «сэмплы» начинается с этапа снабжения.
                  </p>
                </div>
                <div className="border-border-subtle bg-bg-surface2/80 rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                      ТЗ · разделы
                    </span>
                    <Badge
                      variant="outline"
                      className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary h-5 shrink-0 px-1.5 text-[9px] font-bold tabular-nums"
                    >
                      {overviewModel.decisionItems.length > 0
                        ? `${Math.round(
                            (overviewModel.decisionItems.filter((i) => i.filled).length /
                              overviewModel.decisionItems.length) *
                              100
                          )}%`
                        : '0%'}
                    </Badge>
                  </div>
                  <ul className="mt-2 max-h-52 space-y-1.5 overflow-y-auto text-[11px] leading-snug">
                    {overviewModel.decisionItems.map((item) => (
                      <li
                        key={item.dossierSection}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-text-primary min-w-0 truncate">{item.label}</span>
                        <span
                          className={cn(
                            'shrink-0 font-semibold',
                            item.filled ? 'text-emerald-700' : 'text-amber-700'
                          )}
                        >
                          {item.filled ? 'есть' : 'нет'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : passportHeaderDialog === 'warnings' ? (
            <>
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-text-primary text-base font-semibold leading-none tracking-tight">
                  Замечания
                </h2>
                <p className="text-text-secondary text-sm">
                  Список предупреждений из досье, влияющих на готовность ТЗ.
                </p>
              </div>
              <div className="mt-3 text-sm">
                {dossierSummary.warnings.length === 0 ? (
                  <p className="border-border-subtle bg-bg-surface2/80 text-text-secondary rounded-lg border p-3">
                    Замечаний из досье нет.
                  </p>
                ) : (
                  <ul className="text-text-primary list-disc space-y-1.5 pl-4">
                    {dossierSummary.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : passportHeaderDialog === 'sampleReadiness' ? (
            <>
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-text-primary text-base font-semibold leading-none tracking-tight">
                  Готовность к образцу
                </h2>
                <p className="text-text-secondary text-sm">
                  Это отдельно от статуса «Принято» в жизненном цикле: ниже — минимальный чеклист
                  содержимого ТЗ. Зелёный бейдж «Готово к образцу» возможен только если все пункты
                  выполнены и нет замечаний из списка движка готовности.
                </p>
              </div>
              <div className="text-text-primary mt-3 space-y-3 text-sm">
                {lifecycleState === 'accepted' && !dossierSummary.readyForSample ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-[11px] leading-snug text-amber-950">
                    <p className="font-semibold">
                      Почему «Принято», но досье «не готово к образцу»?
                    </p>
                    <p className="mt-1.5">
                      «Принято» означает, что в карточке зафиксирован этап приёмки сэмпла по
                      жизненному циклу досье. Чеклист справа проверяет актуальное содержимое:
                      визуал, материал, мерки, подписи и отсутствие предупреждений. После приёмки
                      данные могли измениться, или сработало новое правило — тогда статусы
                      расходятся.
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                    Минимум для «готово»
                  </p>
                  <ul className="mt-2 space-y-2 text-[11px] leading-snug">
                    <li className="flex gap-2">
                      <span
                        className={
                          dossierSummary.visualsReady ? 'text-emerald-600' : 'text-amber-600'
                        }
                      >
                        {dossierSummary.visualsReady ? '✓' : '✗'}
                      </span>
                      <span>
                        <span className="text-text-primary font-semibold">Визуал</span>
                        <span className="text-text-secondary">
                          {' '}
                          — эскиз или метки на скетче, референсы или текст замысла (хотя бы одно).
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span
                        className={
                          dossierSummary.materialReady ? 'text-emerald-600' : 'text-amber-600'
                        }
                      >
                        {dossierSummary.materialReady ? '✓' : '✗'}
                      </span>
                      <span>
                        <span className="text-text-primary font-semibold">Материал</span>
                        <span className="text-text-secondary">
                          {' '}
                          — заполнен основной материал (атрибут mat).
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span
                        className={
                          dossierSummary.measurementsReady ? 'text-emerald-600' : 'text-amber-600'
                        }
                      >
                        {dossierSummary.measurementsReady ? '✓' : '✗'}
                      </span>
                      <span>
                        <span className="text-text-primary font-semibold">Размерный блок</span>
                        <span className="text-text-secondary">
                          {' '}
                          — выбрана размерная шкала и заполнен табель мер по размерам; при
                          необходимости все мерки из справочника категории.
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span
                        className={
                          dossierSummary.approvalsReady ? 'text-emerald-600' : 'text-amber-600'
                        }
                      >
                        {dossierSummary.approvalsReady ? '✓' : '✗'}
                      </span>
                      <span>
                        <span className="text-text-primary font-semibold">Подписи ТЗ</span>
                        <span className="text-text-secondary">
                          {' '}
                          — для всех ролей и дополнительных строк, у которых в паспорте отмечен этап
                          «ТЗ», стоят цифровые подписи.
                        </span>
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span
                        className={
                          dossierSummary.warnings.length === 0
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }
                      >
                        {dossierSummary.warnings.length === 0 ? '✓' : '✗'}
                      </span>
                      <span>
                        <span className="text-text-primary font-semibold">
                          Без блокирующих замечаний
                        </span>
                        <span className="text-text-secondary">
                          {' '}
                          — нет предупреждений движка (несовпадение шкалы, пропуск мерок и т.д.).
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="border-border-subtle bg-bg-surface2/80 rounded-lg border p-3">
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                    Текущие замечания
                  </p>
                  {dossierSummary.warnings.length === 0 ? (
                    <p className="text-text-secondary mt-1.5 text-[11px]">
                      Нет — условие «без замечаний» выполнено.
                    </p>
                  ) : (
                    <ul className="text-text-primary mt-1.5 list-disc space-y-1 pl-4 text-[11px]">
                      {dossierSummary.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setPassportHeaderDialog('warnings')}
                >
                  Открыть только список замечаний
                </Button>
              </div>
            </>
          ) : passportHeaderDialog === 'lifecycleStatus' ? (
            <>
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-text-primary text-base font-semibold leading-none tracking-tight">
                  Статус жизненного цикла
                </h2>
                <p className="text-text-secondary text-sm">
                  Отражает этап согласования и приёмки досье в процессе, а не автоматический
                  пересчёт полей ТЗ.
                </p>
              </div>
              <div className="text-text-primary mt-3 space-y-3 text-sm">
                <p className="border-border-subtle bg-bg-surface2/80 rounded-lg border p-3 text-[11px] leading-snug">
                  Сейчас в карточке:{' '}
                  <span className="text-text-primary font-semibold">
                    {lifecycleState === 'accepted' || lifecycleState === 'rework_requested'
                      ? getLifecycleStateLabel(lifecycleState)
                      : passportLifecycleStatusLabel}
                  </span>
                  {lifecycleState !== 'accepted' && lifecycleState !== 'rework_requested' ? (
                    <> (детально: {getLifecycleStateLabel(lifecycleState)}).</>
                  ) : null}
                </p>
                <ul className="text-text-primary list-disc space-y-1.5 pl-4 text-[11px] leading-snug">
                  <li>
                    <span className="text-text-primary font-medium">Черновик</span> — досье в
                    работе, передачи ещё не фиксировались.
                  </li>
                  <li>
                    <span className="text-text-primary font-medium">
                      Готово к передаче / Передано в производство
                    </span>{' '}
                    — отмеченные вручную этапы согласования маршрута.
                  </li>
                  <li>
                    <span className="text-text-primary font-medium">Принято</span> — зафиксирована
                    приёмка сэмпла по процессу; не отменяет проверку актуального содержимого ТЗ.
                  </li>
                  <li>
                    <span className="text-text-primary font-medium">Возврат на доработку</span> —
                    нужна правка перед следующей итерацией.
                  </li>
                </ul>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setPassportHeaderDialog('sampleReadiness')}
                >
                  Чеклист «готово к образцу»
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={routeStageHelpId !== null}
        onOpenChange={(open) => {
          if (!open) setRouteStageHelpId(null);
        }}
      >
        <DialogContent ariaTitle={routeStageHelp?.headline ?? 'Этап маршрута'} className="max-w-md">
          {routeStageHelp && routeStageHelpId && routeStageHelpLane ? (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-text-primary text-base">
                    {routeStageHelp.headline}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    title={
                      routeStageHelpLane === 'development'
                        ? 'Этап в контуре разработки (каталог: до supply-path, в т.ч. gate-all-stakeholders) — левая часть мини-шкалы'
                        : 'Этап в контуре сэмплов (каталог: от supply-path, в т.ч. samples) — правая часть мини-шкалы'
                    }
                    className={cn(
                      'h-5 px-1.5 text-[9px] font-bold uppercase tracking-wide',
                      routeStageHelpLane === 'development'
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-950'
                        : 'border-teal-200 bg-teal-50 text-teal-950'
                    )}
                  >
                    {workshop2PipelineLaneLabelRu(routeStageHelpLane)}
                  </Badge>
                </div>
                <DialogDescription className="text-text-secondary">
                  {routeStageHelp.purpose}
                </DialogDescription>
              </DialogHeader>
              <div>
                <p className="text-text-secondary mb-2 text-[10px] font-bold uppercase tracking-widest">
                  Самое главное на этапе
                </p>
                <ul className="text-text-primary list-disc space-y-1.5 pl-4 text-sm">
                  {routeStageHelp.essentials.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dossierSectionHelpId !== null}
        onOpenChange={(open) => {
          if (!open) setDossierSectionHelpId(null);
        }}
      >
        <DialogContent ariaTitle={dossierSectionHelp?.headline ?? 'Секция ТЗ'} className="max-w-md">
          {dossierSectionHelp && dossierSectionHelpId ? (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-text-primary text-base">
                    {dossierSectionHelp.headline}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    title="Секции ТЗ — контур разработки: в каталоге до supply-path (в т.ч. gate-all-stakeholders) — левая часть мини-шкалы"
                    className="h-5 border-indigo-200 bg-indigo-50 px-1.5 text-[9px] font-bold uppercase tracking-wide text-indigo-950"
                  >
                    Разработка · ТЗ
                  </Badge>
                </div>
                <DialogDescription className="text-text-secondary">
                  {dossierSectionHelp.purpose}
                </DialogDescription>
              </DialogHeader>
              <div>
                <p className="text-text-secondary mb-2 text-[10px] font-bold uppercase tracking-widest">
                  На что обратить внимание
                </p>
                <ul className="text-text-primary list-disc space-y-1.5 pl-4 text-sm">
                  {dossierSectionHelp.essentials.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={W2_OVERVIEW_OPEN_BTN_CLASS}
                  onClick={() => setDossierSectionHelpId(null)}
                >
                  Закрыть
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={W2_OVERVIEW_OPEN_BTN_CLASS}
                  onClick={() => {
                    goToTzSection(dossierSectionHelpId);
                    setDossierSectionHelpId(null);
                  }}
                >
                  Открыть &gt;
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={articleHistoryOpen} onOpenChange={setArticleHistoryOpen}>
        <DialogContent
          ariaTitle="История изменений артикула"
          className="flex max-h-[min(80vh,560px)] max-w-lg flex-col gap-0"
        >
          <DialogHeader>
            <DialogTitle className="text-text-primary text-base">История изменений</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Данные производства артикула{' '}
              <span className="text-text-primary font-mono font-semibold">{article.sku}</span>:
              журнал разработки коллекции, сохранения ТЗ и правки строки коллекции (локально).
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            {articleProductionHistory.length === 0 ? (
              <p className="text-text-secondary text-sm">
                Пока нет зафиксированных событий по этому SKU.
              </p>
            ) : (
              <ul className="space-y-2.5 pr-1">
                {articleProductionHistory.map((row) => (
                  <li
                    key={row.id}
                    className="border-border-subtle bg-bg-surface2/90 rounded-lg border px-3 py-2.5 text-sm shadow-sm"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                        {row.scope}
                      </span>
                      <time
                        dateTime={row.at}
                        className="text-text-secondary text-[11px] font-medium tabular-nums"
                      >
                        {new Date(row.at).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>
                    <p className="text-text-primary mt-1.5 text-[13px] font-semibold leading-snug">
                      {row.summary}
                    </p>
                    {row.actor ? (
                      <p className="text-text-secondary mt-1 text-[11px]">
                        <span className="text-text-secondary font-medium">Кто:</span> {row.actor}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter className="border-border-subtle mt-2 border-t pt-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setArticleHistoryOpen(false)}
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Workshop2ArticleWorkspace({
  collectionId,
  articleId,
  createdByLabel,
  activeCollections,
  archivedCollections,
  getArticlePipelineProgress,
  onPatchWorkshop2ArticleLine,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams ?? new URLSearchParams();
  const { role } = useRbac();
  const [mainTab, setMainTab] = useState<MainTab>(() => {
    if (typeof window === 'undefined') return 'overview';
    try {
      const pane = parseWorkshop2ArticlePaneParam(
        new URL(window.location.href).searchParams.get(WORKSHOP2_ARTICLE_PANE_PARAM)
      );
      return (pane as MainTab) ?? 'overview';
    } catch {
      return 'overview';
    }
  });

  const collections = useMemo(
    () => [...activeCollections, ...archivedCollections],
    [activeCollections, archivedCollections]
  );

  const collection = useMemo(
    () => collections.find((c) => c.id === collectionId),
    [collections, collectionId]
  );

  const article = useMemo(
    () =>
      collection?.articleRows.find(
        (a) =>
          a.id === articleId ||
          (isWorkshop2InternalArticleCodeValid(a.internalArticleCode) &&
            a.internalArticleCode === articleId)
      ),
    [collection, articleId]
  );

  /** В адресной строке — внутренний 6-значный номер, если уже выдан; старые ссылки по line id остаются рабочими. */
  useEffect(() => {
    if (!article) return;
    const seg = workshop2ArticleUrlSegment(article.internalArticleCode, article.id);
    if (articleId === seg) return;
    const nextPath = workshop2ArticlePath(collectionId, seg);
    if (pathname !== nextPath) {
      const q = query.toString();
      router.replace(q ? `${nextPath}?${q}` : nextPath, { scroll: false });
    }
  }, [article, articleId, collectionId, pathname, query, router]);

  const articleOpenLogKey = useRef('');
  useEffect(() => {
    if (!collection || !article) return;
    const key = `${collectionId}:${article.id}`;
    if (articleOpenLogKey.current === key) return;
    articleOpenLogKey.current = key;
    appendWorkshop2ArticleActivity(
      collectionId,
      article.id,
      `Открыт артикул ${article.sku} · коллекция «${collection.displayName}»`,
      createdByLabel
    );
  }, [collection, article, collectionId, createdByLabel]);

  const w2step = query.get(WORKSHOP2_STEP_PARAM) ?? '1';

  const dossierViewQueryKey = query.toString();
  const dossierViewProfile = useMemo(
    () =>
      resolveWorkshop2DossierViewFromWorkspaceUrl(query.get(WORKSHOP2_DOSSIER_VIEW_PARAM), role),
    [dossierViewQueryKey, role]
  );

  const replaceStepQuery = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(query.toString());
      mutate(p);
      const q = p.toString();
      router.replace(q ? `${pathname}?${q}` : (pathname ?? ''), { scroll: false });
    },
    [pathname, router, query]
  );

  const listHref = workshop2CollectionListHref(collectionId);

  const paneFromUrl = useMemo(
    () => parseWorkshop2ArticlePaneParam(query.get(WORKSHOP2_ARTICLE_PANE_PARAM)),
    [query]
  );

  useEffect(() => {
    if (!paneFromUrl) return;
    const next = paneFromUrl as MainTab;
    setMainTab((m) => (m === next ? m : next));
  }, [paneFromUrl]);

  const goOverview = useCallback(() => {
    setMainTab('overview');
    replaceStepQuery((p) => {
      p.delete(WORKSHOP2_ARTICLE_PANE_PARAM);
      p.delete(WORKSHOP2_STEP_PARAM);
      p.delete(WORKSHOP2_DOSSIER_SECTION_PARAM);
    });
  }, [replaceStepQuery]);

  /** Старые ссылки `?w2sec=…` без `w2pane`: открыть вкладку ТЗ и дописать `w2pane=tz`. */
  useEffect(() => {
    if (!article) return;
    if (query.get(WORKSHOP2_ARTICLE_PANE_PARAM)) return;
    const sec = parseWorkshop2DossierSection(query.get(WORKSHOP2_DOSSIER_SECTION_PARAM));
    if (!sec) return;
    setMainTab('tz');
    replaceStepQuery((p) => {
      p.set(WORKSHOP2_ARTICLE_PANE_PARAM, 'tz');
    });
  }, [article?.id, collectionId, query, replaceStepQuery]);

  if (!collection) {
    return (
      <Card className="border-amber-100 bg-amber-50/40">
        <CardContent className="space-y-3 pt-6">
          <CardDescription className="text-sm text-amber-950">
            Коллекция не найдена (возможно, архив или другой браузер).
          </CardDescription>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href={ROUTES.brand.productionWorkshop2}>{COLLECTION_DEV_HUB_TITLE_RU}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!article) {
    return (
      <Card className="border-amber-100 bg-amber-50/40">
        <CardContent className="space-y-3 pt-6">
          <CardDescription className="text-sm text-amber-950">
            Артикул не найден в этой коллекции.
          </CardDescription>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href={listHref}>К списку артикулов</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const categoryLeafId = (() => {
    const t = article.categoryLeafId?.trim();
    if (t && findHandbookLeafById(t)) return t;
    return getHandbookCategoryLeaves()[0]?.leafId ?? '';
  })();

  const leaf = findHandbookLeafById(categoryLeafId);
  const categoryPath = leaf ? `${leaf.l1Name} · ${leaf.l2Name} · ${leaf.l3Name}` : '';

  return (
    <ArticleWorkspaceProvider articleRef={{ collectionId, articleId: article.id }}>
      <Workshop2ArticleWorkspaceScreen
        collectionId={collectionId}
        article={article}
        collection={collection}
        createdByLabel={createdByLabel}
        categoryLeafId={categoryLeafId}
        categoryPath={categoryPath}
        getArticlePipelineProgress={getArticlePipelineProgress}
        onPatchWorkshop2ArticleLine={onPatchWorkshop2ArticleLine}
        listHref={listHref}
        mainTab={mainTab}
        setMainTab={setMainTab}
        replaceStepQuery={replaceStepQuery}
        w2step={w2step}
        goOverview={goOverview}
        dossierSectionQuery={query.get(WORKSHOP2_DOSSIER_SECTION_PARAM)}
        dossierViewProfile={dossierViewProfile}
        sketchFloorInUrl={isSketchFloorInSearch(query.toString())}
      />
    </ArticleWorkspaceProvider>
  );
}
