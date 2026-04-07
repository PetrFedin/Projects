'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  CategorySketchTemplateSvg,
  sketchAccentForLeaf,
  sketchFitVariantForContext,
  sketchKindForLeaf,
  type CategorySketchKind,
} from '@/lib/production/category-sketch-template';
import { buildCategorySketchAiPrompt } from '@/lib/production/category-sketch-ai-prompt';
import { BRANCH_CATALOG_SLOT_ROLE } from '@/lib/production/workshop2-tz-subcategory-sketches';
import type {
  Workshop2CategorySketchCompliance,
  Workshop2DossierSignoffMeta,
  Workshop2MesDefectCodeRow,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1SubcategorySketchSlot,
  Workshop2SketchAnnotationPriority,
  Workshop2SketchAnnotationStage,
  Workshop2SketchAnnotationStatus,
  Workshop2SketchAnnotationType,
  Workshop2SketchAnnotationAuditEntry,
  Workshop2SketchPropagatedDraft,
  Workshop2SketchRevisionSnapshot,
  Workshop2SketchSheetViewKind,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  TZ_PANEL_SECTION_LABELS,
  ROUTE_STAGE_NAV_OPTIONS,
  normalizeLinkedTzPanelSectionForNav,
  labelForStoredTzPanelSection,
} from '@/lib/production/workshop2-visual-excellence';
import {
  mergeSuggestedTzAttributeIdsForSketchType,
  recommendedTzSectionForSketchType,
  sketchTypeTzMatrixHint,
  type VisualCatalogSketchLinkRow,
} from '@/lib/production/workshop2-sketch-tz-matrix';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  Copy,
  Download,
  Expand,
  Factory,
  Filter,
  GitCompare,
  ImageDown,
  ImageIcon,
  LayoutGrid,
  MapPin,
  Printer,
  Save,
  Send,
  Sparkles,
  Upload,
} from 'lucide-react';
import { summarizeAnnotationsForHandoff } from '@/lib/production/sketch-link-model';
import { requestCatalogImageGeneration } from '@/lib/ai/catalog-image-gen';
import { downloadSketchBoardPng } from '@/lib/production/sketch-board-png-export';
import type { SketchPinTextSnippet } from '@/lib/production/workshop2-sketch-sheets';
import { sketchBoardQualityHints } from '@/lib/production/sketch-quality-hints';
import { compareRevisionSnapshots } from '@/lib/production/sketch-revision-diff';
import {
  bomRefsFromLiveAnnotations,
  bomRefsFromSnapshotAnnotations,
  classifyBomLineRef,
  latestRevisionSnapshotForLeaf,
} from '@/lib/production/sketch-bom-integrity';
import {
  defectBreadcrumbChain,
  mesDefectCodeCountsOnPins,
  mergedMesDefectCatalog,
} from '@/lib/production/sketch-mes-catalog';
import { isValidMesShiftId, MES_SHIFT_PRESETS } from '@/lib/production/sketch-mes-shift-utils';
import { openSketchA4Print } from '@/lib/production/sketch-a4-print';
import { openSketchHandoffPackagePrint } from '@/lib/production/sketch-handoff-print';
import {
  addAnnotationIdToSlotLinkedIds,
  appendMasterPinLineToSlotWhatToDo,
  createAnnotationTaskLine,
} from '@/lib/production/workshop2-tz-subcategory-sketches';
import { buildAnnotationDiffAudit, mergeSketchMasterAuditLog } from '@/lib/production/sketch-annotation-audit';
import {
  buildPropagatedDraftsFromAnnotationsOnly,
  mergePropagatedDrafts,
} from '@/lib/production/sketch-propagate-drafts';
import { downloadCriticalPinsCsv } from '@/lib/production/sketch-critical-csv';
import {
  buildCriticalWebhookPayload,
  postCriticalPinsWebhook,
} from '@/lib/production/sketch-critical-webhook';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';
import { downloadSketchMesQualityCsv } from '@/lib/production/sketch-mes-export';
import { SketchPinThreadPanel } from '@/components/brand/production/SketchPinThreadPanel';
import { SKETCH_SHEET_VIEW_LABELS } from '@/lib/production/workshop2-sketch-sheets';

const MAX_ANNOTATIONS = 40;
const MAX_IMAGE_CHARS = 900_000;

const NEXT_PIN_PRESET_LABEL: Record<'critical' | 'qc' | 'other', string> = {
  critical: 'критично',
  qc: 'этап ОТК',
  other: 'остальные',
};

const TYPE_LABELS: Record<Workshop2SketchAnnotationType, string> = {
  construction: 'Конструкция',
  material: 'Материал',
  fit: 'Посадка',
  finishing: 'Обработка',
  hardware: 'Фурнитура',
  labeling: 'Маркировка',
  qc: 'ОТК',
};

const PRIORITY_LABELS: Record<Workshop2SketchAnnotationPriority, string> = {
  critical: 'Критично',
  important: 'Важно',
  note: 'Заметка',
};

const STATUS_LABELS: Record<Workshop2SketchAnnotationStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Закрыта',
  rejected: 'Отклонена',
};

const STAGE_LABELS: Record<Workshop2SketchAnnotationStage, string> = {
  tz: 'ТЗ',
  sample: 'Образец',
  prelaunch: 'Предзапуск',
  release: 'Выпуск',
  qc: 'ОТК',
};

/** Подпись блока задач подкатегории без технического slotId. */
const SUBCATEGORY_TASK_SLOT_FALLBACK: Record<1 | 2 | 3, string> = {
  1: `Задачи слота «${BRANCH_CATALOG_SLOT_ROLE[1].label}»`,
  2: `Задачи слота «${BRANCH_CATALOG_SLOT_ROLE[2].label}»`,
  3: `Задачи слота «${BRANCH_CATALOG_SLOT_ROLE[3].label}»`,
};

const ORPHAN_LINKED_TASK_LABEL = 'Слот не найден — выберите блок в списке';

type SketchHotspotPreset = {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  annotationType: Workshop2SketchAnnotationType;
  text: string;
  priority?: Workshop2SketchAnnotationPriority;
};

const HOTSPOT_PRESETS_BY_KIND: Partial<Record<CategorySketchKind, SketchHotspotPreset[]>> = {
  apparel_outerwear: [
    { id: 'collar', label: 'Воротник / лацкан', xPct: 50, yPct: 20, annotationType: 'construction', text: 'Проверьте форму воротника и лацкана.', priority: 'important' },
    { id: 'shoulder', label: 'Плечо', xPct: 33, yPct: 28, annotationType: 'fit', text: 'Уточните посадку по плечу и баланс.', priority: 'important' },
    { id: 'front', label: 'Борт / застежка', xPct: 50, yPct: 43, annotationType: 'construction', text: 'Зафиксируйте борт, застежку и линию центра переда.', priority: 'critical' },
    { id: 'sleeve', label: 'Рукав', xPct: 22, yPct: 46, annotationType: 'construction', text: 'Проверьте форму рукава и свободу движения.', priority: 'important' },
    { id: 'pocket', label: 'Карман', xPct: 37, yPct: 59, annotationType: 'construction', text: 'Уточните тип кармана и его уровень.', priority: 'important' },
    { id: 'lining', label: 'Подкладка', xPct: 61, yPct: 63, annotationType: 'material', text: 'Проверьте подкладку, утеплитель или дублирование.', priority: 'note' },
    { id: 'hem', label: 'Низ изделия', xPct: 50, yPct: 86, annotationType: 'qc', text: 'Проверьте низ, симметрию и длину изделия.', priority: 'important' },
  ],
  apparel_dress: [
    { id: 'neck', label: 'Горловина', xPct: 50, yPct: 22, annotationType: 'construction', text: 'Уточните форму выреза и обработку горловины.', priority: 'important' },
    { id: 'waist', label: 'Линия талии', xPct: 50, yPct: 48, annotationType: 'fit', text: 'Зафиксируйте положение линии талии и прилегание.', priority: 'important' },
    { id: 'closure', label: 'Молния / застежка', xPct: 62, yPct: 52, annotationType: 'construction', text: 'Укажите тип и длину молнии.', priority: 'critical' },
    { id: 'hem', label: 'Низ / шлица', xPct: 50, yPct: 82, annotationType: 'finishing', text: 'Проверьте подгибку низа и наличие шлицы.', priority: 'note' },
  ],
  apparel_pants: [
    { id: 'waistband', label: 'Пояс', xPct: 50, yPct: 24, annotationType: 'construction', text: 'Проверьте ширину пояса и тип застежки.', priority: 'important' },
    { id: 'rise', label: 'Посадка (слонка)', xPct: 50, yPct: 45, annotationType: 'fit', text: 'Уточните высоту посадки и баланс изделия.', priority: 'critical' },
    { id: 'pocket', label: 'Карманы', xPct: 35, yPct: 35, annotationType: 'construction', text: 'Зафиксируйте тип и расположение карманов.', priority: 'important' },
    { id: 'hem', label: 'Низ брючин', xPct: 35, yPct: 85, annotationType: 'finishing', text: 'Проверьте обработку низа брюк.', priority: 'note' },
  ],
  apparel_shorts: [
    { id: 'waistband', label: 'Пояс', xPct: 50, yPct: 22, annotationType: 'construction', text: 'Пояс / резинка / шнур: уточнить.', priority: 'important' },
    { id: 'rise', label: 'Посадка', xPct: 50, yPct: 40, annotationType: 'fit', text: 'Высота посадки и длина шага.', priority: 'critical' },
    { id: 'leg_opening', label: 'Низ шорт', xPct: 38, yPct: 68, annotationType: 'finishing', text: 'Ширина проймы шорта, подгиб или необработанный край.', priority: 'important' },
  ],
  apparel_jumpsuit: [
    { id: 'shoulder', label: 'Плечо / лямка', xPct: 28, yPct: 32, annotationType: 'fit', text: 'Ширина плеч, лямки, пройма.', priority: 'critical' },
    { id: 'waist', label: 'Талия / резинка', xPct: 50, yPct: 48, annotationType: 'construction', text: 'Линия талии, молния, кнопки.', priority: 'important' },
    { id: 'leg', label: 'Штанина', xPct: 38, yPct: 72, annotationType: 'construction', text: 'Длина шага, объём бёдер.', priority: 'important' },
  ],
  apparel_vest: [
    { id: 'armhole', label: 'Пройма', xPct: 22, yPct: 42, annotationType: 'construction', text: 'Глубина и форма проймы.', priority: 'critical' },
    { id: 'closure', label: 'Застёжка', xPct: 50, yPct: 52, annotationType: 'construction', text: 'Молния, пуговицы, кнопки.', priority: 'important' },
    { id: 'hem', label: 'Низ жилета', xPct: 50, yPct: 78, annotationType: 'finishing', text: 'Длина по бедру / поясу.', priority: 'note' },
  ],
};

function newUuid(): string {
  return crypto.randomUUID();
}

function readFileAsDataUrlLimited(file: File, maxChars: number): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result ?? '');
      resolve(s.length <= maxChars ? s : undefined);
    };
    fr.onerror = () => resolve(undefined);
    fr.readAsDataURL(file);
  });
}

function normalizeAnnotation(annotation: Workshop2Phase1CategorySketchAnnotation): Workshop2Phase1CategorySketchAnnotation {
  return {
    ...annotation,
    annotationType: annotation.annotationType ?? 'construction',
    priority: annotation.priority ?? 'important',
    status: annotation.status ?? 'new',
    stage: annotation.stage ?? 'tz',
  };
}

/** Приоритет/этап/зона ОТК в соответствии с выбором «Следующая метка» (клик по доске и быстрые зоны). */
function priorityStageForNextPinPreset(
  annotationId: string,
  nextPinPreset: 'critical' | 'qc' | 'other'
): Partial<Workshop2Phase1CategorySketchAnnotation> {
  if (nextPinPreset === 'critical') {
    return { priority: 'critical', stage: 'tz', linkedQcZoneId: undefined };
  }
  if (nextPinPreset === 'qc') {
    return { priority: 'important', stage: 'qc', linkedQcZoneId: annotationId };
  }
  return { priority: 'important', stage: 'tz', linkedQcZoneId: undefined };
}

function CategorySketchPinHoverCard({
  annotation: a,
  index,
  attributeOptions,
  taskSlotLabelById,
}: {
  annotation: Workshop2Phase1CategorySketchAnnotation;
  index: number;
  attributeOptions: { id: string; label: string }[];
  taskSlotLabelById?: Record<string, string>;
}) {
  const linkedLabel =
    a.linkedAttributeId && attributeOptions.find((o) => o.id === a.linkedAttributeId)?.label;
  return (
    <div className="max-w-[260px] space-y-1.5 text-left text-[11px] leading-snug">
      <p className="font-semibold text-slate-900">
        Метка #{index + 1} · {TYPE_LABELS[a.annotationType ?? 'construction']} ·{' '}
        {PRIORITY_LABELS[a.priority ?? 'important']}
      </p>
      <p className="text-slate-600">
        {STATUS_LABELS[a.status ?? 'new']} · {STAGE_LABELS[a.stage ?? 'tz']}
      </p>
      {a.owner?.trim() ? <p className="text-slate-600">Ответственный: {a.owner.trim()}</p> : null}
      {a.dueDate ? (
        <p className="text-slate-600">
          Срок:{' '}
          {(() => {
            try {
              return new Date(a.dueDate).toLocaleDateString('ru-RU');
            } catch {
              return a.dueDate;
            }
          })()}
        </p>
      ) : null}
      {linkedLabel ? (
        <p className="font-medium text-indigo-800">
          Связанный атрибут: <span className="font-normal">{linkedLabel}</span>
        </p>
      ) : null}
      {a.linkedQcZoneId ? (
        <p className="text-[10px] text-amber-800">Зона ОТК: {a.linkedQcZoneId}</p>
      ) : null}
      {a.linkedTaskId ? (
        <p className="text-[10px] text-slate-600">
          Задача подкатегории:{' '}
          <span className="font-medium">
            {taskSlotLabelById?.[a.linkedTaskId] ?? ORPHAN_LINKED_TASK_LABEL}
          </span>
        </p>
      ) : null}
      {a.linkedBomLineRef?.trim() || a.linkedMaterialNote?.trim() ? (
        <p className="text-[10px] text-emerald-900">
          BOM: {a.linkedBomLineRef?.trim() || '—'}
          {a.linkedMaterialNote?.trim() ? ` · ${a.linkedMaterialNote.trim()}` : null}
        </p>
      ) : null}
      {a.mesDefectCode?.trim() || a.mesShiftId?.trim() ? (
        <p className="text-[10px] text-amber-900">
          MES: {a.mesDefectCode?.trim() || '—'}
          {a.mesShiftId?.trim() ? ` · смена ${a.mesShiftId.trim()}` : null}
        </p>
      ) : null}
      {a.proofPhotoDataUrl ? (
        <p className="text-[10px] text-slate-700">
          Фото: {a.proofPhotoFileName ?? 'вложение'} ·{' '}
          {a.proofStatus === 'accepted'
            ? 'принято'
            : a.proofStatus === 'rejected'
              ? 'брак'
              : 'на проверке'}
        </p>
      ) : null}
      <p className="border-t border-slate-200 pt-1.5 text-slate-800">
        {a.text?.trim()
          ? a.text.trim()
          : 'Описание не заполнено — добавьте текст в списке справа.'}
      </p>
    </div>
  );
}

export type CategorySketchAnnotatorPatch = {
  categorySketchImageDataUrl?: string;
  categorySketchImageFileName?: string;
  categorySketchAnnotations?: Workshop2Phase1CategorySketchAnnotation[];
  categorySketchCompareOverlayDataUrl?: string | null;
  categorySketchCompareOverlayFileName?: string | null;
  categorySketchCompareOverlayOpacityPct?: number;
  categorySketchCompareOverlayScalePct?: number;
  categorySketchCompareOffsetXPct?: number;
  categorySketchCompareOffsetYPct?: number;
  sketchPropagatedDrafts?: Workshop2SketchPropagatedDraft[];
  subcategorySketchSlots?: Workshop2Phase1SubcategorySketchSlot[];
  categorySketchRevisionLabel?: string;
  categorySketchFreezeUntilDate?: string;
  categorySketchProductionApproved?: Workshop2DossierSignoffMeta;
  categorySketchCompliance?: Workshop2CategorySketchCompliance;
  sketchBrandbookConstraints?: string;
  sketchMasterAnnotationAuditLog?: Workshop2SketchAnnotationAuditEntry[];
  categorySketchRevisionSnapshots?: Workshop2SketchRevisionSnapshot[];
  categorySketchSceneId?: string;
  categorySketchSceneView?: Workshop2SketchSheetViewKind;
  sketchMesDefectCatalog?: Workshop2MesDefectCodeRow[];
};

export type CategorySketchAnnotatorContext = {
  audienceId?: string;
  audienceName?: string;
  isUnisex?: boolean;
};

const SKETCH_ONBOARD_LS_KEY = 'category-sketch-onboard-v2';

/** Внешнее хранение меток/фото (доп. скетч-листы) — без записи в `categorySketch*`. */
export type CategorySketchAnnotatorSheetStorage = {
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  onAnnotationsChange: (next: Workshop2Phase1CategorySketchAnnotation[]) => void;
  onImageChange: (imageDataUrl?: string, imageFileName?: string) => void;
};

type Props = {
  currentLeaf: HandbookCategoryLeaf;
  imageDataUrl?: string;
  imageFileName?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  attributeOptions?: { id: string; label: string }[];
  /** Аудитория и унисекс из паспорта — влияют на пропорции типового силуэта и промпт ИИ. */
  sketchContext?: CategorySketchAnnotatorContext;
  onNavigateStage?: (stage: 'fit' | 'qc') => void;
  onPatch: (patch: CategorySketchAnnotatorPatch) => void;
  /** Если false — заголовок и вводный текст только снаружи (карточка паспорта); в диалоге остаётся DialogTitle. */
  showPassportSectionHeader?: boolean;
  /** Режим листа: метки и смена подложки через колбэки; `onPatch` для остального может быть no-op. */
  sheetStorage?: CategorySketchAnnotatorSheetStorage;
  /** Лимит меток (по умолчанию 40; для листов — меньше). */
  maxAnnotations?: number;
  /** Кнопки вставки текста в выбранную метку (или новая метка в центре). */
  pinTextSnippets?: SketchPinTextSnippet[];
  /** Имя файла для «Снимок PNG» (без расширения). */
  exportFileNameStem?: string;
  /** Подпись SKU на печати А4. */
  articleSku?: string;
  /** Режим цеха: крупные пины, без правок. */
  viewMode?: 'edit' | 'floor';
  /** Слоты задач L1–L3 — связь метки с блоком «Задачи по подкатегории». */
  subcategorySketchSlots?: Workshop2Phase1SubcategorySketchSlot[];
  /** Наложение эталона поверх подложки (master). */
  categorySketchCompareOverlayDataUrl?: string;
  categorySketchCompareOverlayFileName?: string;
  categorySketchCompareOverlayOpacityPct?: number;
  /** Черновики посадки/ОТК из меток (хранятся в досье). */
  sketchPropagatedDrafts?: Workshop2SketchPropagatedDraft[];
  /** Для журнала изменений меток (ФИО из сессии). */
  auditActor?: string;
  categorySketchRevisionLabel?: string;
  categorySketchFreezeUntilDate?: string;
  categorySketchProductionApproved?: Workshop2DossierSignoffMeta;
  categorySketchCompliance?: Workshop2CategorySketchCompliance;
  sketchBrandbookConstraints?: string;
  sketchMasterAnnotationAuditLog?: Workshop2SketchAnnotationAuditEntry[];
  categorySketchCompareOverlayScalePct?: number;
  categorySketchCompareOffsetXPct?: number;
  categorySketchCompareOffsetYPct?: number;
  /** Вкладка «Задачи L1→L3»: лента подкатегории под доской. */
  sketchTasksPanel?: ReactNode;
  categorySketchRevisionSnapshots?: Workshop2SketchRevisionSnapshot[];
  categorySketchSceneId?: string;
  categorySketchSceneView?: Workshop2SketchSheetViewKind;
  sketchMesDefectCatalog?: Workshop2MesDefectCodeRow[];
  onAppendSketchRevisionSnapshot?: () => void;
  /** Сохранить текущий набор меток как шаблон в досье (не терять пресеты). */
  onSavePinTemplateToDossier?: () => void;
  onSavePinTemplateToOrg?: () => void;
  /** Подпись сцены/вида для печати листа (перекрывает авто master). */
  printSceneCaption?: string;
  /** Строки BOM/материалов из досье — быстрый выбор в поле ref метки. */
  bomLinePickOptions?: { value: string; label: string }[];
  /** Переключить секцию ТЗ в панели досье (фаза 1). */
  onJumpToDossierSection?: (section: Workshop2TzPanelSectionId) => void;
  /** Открыть операционную вкладку артикула по этапу маршрута. */
  onNavigateRouteStage?: (stage: Workshop2TzSignoffStageId) => void;
  /** Атрибуты из секции «Визуал» (фаза 1) — пересечение с матрицей типа активной метки подсвечивается в панели. */
  visualCatalogAttributeIds?: string[];
  /** Поля секции «Визуал» с `sketchHighlightForPinTypes` из JSON каталога — доп. подсказки к матрице. */
  visualCatalogSketchLinks?: VisualCatalogSketchLinkRow[];
  onVisualCatalogSuggestFromSketch?: (attributeIds: string[]) => void;
};

export function CategorySketchAnnotator(props: Props) {
  const {
    currentLeaf,
    imageDataUrl,
    imageFileName,
    annotations,
    attributeOptions = [],
    sketchContext,
    onNavigateStage,
    onPatch,
    sheetStorage,
    maxAnnotations: maxAnnotationsProp,
    pinTextSnippets = [],
    exportFileNameStem,
    articleSku,
    viewMode = 'edit',
    subcategorySketchSlots = [],
    categorySketchCompareOverlayDataUrl: compareOverlayDataUrl,
    categorySketchCompareOverlayFileName: compareOverlayFileName,
    categorySketchCompareOverlayOpacityPct: compareOpacityProp,
    sketchPropagatedDrafts = [],
    auditActor: auditActorProp,
    categorySketchRevisionLabel,
    categorySketchFreezeUntilDate,
    categorySketchProductionApproved,
    categorySketchCompliance: complianceProp,
    sketchBrandbookConstraints,
    sketchMasterAnnotationAuditLog = [],
    categorySketchRevisionSnapshots = [],
    categorySketchSceneId: sceneIdProp,
    categorySketchSceneView: sceneViewProp,
    sketchMesDefectCatalog,
    onAppendSketchRevisionSnapshot,
    onSavePinTemplateToDossier,
    onSavePinTemplateToOrg,
    printSceneCaption,
    bomLinePickOptions = [],
    categorySketchCompareOverlayScalePct: compareScaleProp,
    categorySketchCompareOffsetXPct: compareOffsetXProp,
    categorySketchCompareOffsetYPct: compareOffsetYProp,
    sketchTasksPanel,
    onJumpToDossierSection,
    onNavigateRouteStage,
    visualCatalogAttributeIds = [],
    visualCatalogSketchLinks,
    onVisualCatalogSuggestFromSketch,
  } = props;
  const readOnly = viewMode === 'floor';
  const compareOpacity = Math.min(100, Math.max(15, compareOpacityProp ?? 45));
  const compareScalePct = Math.min(200, Math.max(40, compareScaleProp ?? 100));
  const compareOffsetXPct = Math.min(40, Math.max(-40, compareOffsetXProp ?? 0));
  const compareOffsetYPct = Math.min(40, Math.max(-40, compareOffsetYProp ?? 0));
  const auditActor = auditActorProp?.trim();
  const compliance = complianceProp ?? {};
  const showPassportSectionHeader = props.showPassportSectionHeader ?? true;
  const annotationLimit = maxAnnotationsProp ?? MAX_ANNOTATIONS;
  const dataAnnotations = sheetStorage?.annotations ?? annotations;
  const sketchImageInputId = useId();
  const sketchCompareInputId = useId();

  const boardRef = useRef<HTMLDivElement>(null);
  const templateLayerRef = useRef<HTMLDivElement>(null);
  const previewSketchFileInputRef = useRef<HTMLInputElement>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [placeMode, setPlaceMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | Workshop2SketchAnnotationType>('all');
  const [filterStage, setFilterStage] = useState<'all' | Workshop2SketchAnnotationStage>('all');
  /** Соответствует цвету пина на доске: критично / этап ОТК / остальные. */
  const [filterPinVisual, setFilterPinVisual] = useState<'all' | 'critical' | 'qc' | 'other'>('all');
  /** Какую группу пина ставить при следующем клике по доске в режиме «+ Метка». */
  const [nextPinPreset, setNextPinPreset] = useState<'critical' | 'qc' | 'other'>('other');
  /** Тип узла для следующей метки по клику на доске (не зона). */
  const [nextAnnotationType, setNextAnnotationType] = useState<Workshop2SketchAnnotationType>('construction');
  const [aiExtraHints, setAiExtraHints] = useState('');
  const [aiCopied, setAiCopied] = useState(false);
  const [demoRefBusy, setDemoRefBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [webhookBusy, setWebhookBusy] = useState(false);
  const [batchSelectedIds, setBatchSelectedIds] = useState<string[]>([]);
  const [lastExportSummary, setLastExportSummary] = useState<string>('');
  const [compareSnapIdA, setCompareSnapIdA] = useState<string>('');
  const [compareSnapIdB, setCompareSnapIdB] = useState<string>('');
  const [sketchPageUrl, setSketchPageUrl] = useState<string | undefined>(undefined);
  const [onboard, setOnboard] = useState(() => ({
    s1: false,
    s2: false,
    s3: false,
    s4: false,
    done: false,
  }));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSketchPageUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SKETCH_ONBOARD_LS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as typeof onboard;
        if (p && typeof p === 'object') {
          setOnboard((o) => ({ ...o, ...p }));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistOnboard = useCallback((next: typeof onboard) => {
    setOnboard(next);
    try {
      localStorage.setItem(SKETCH_ONBOARD_LS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);
  const taskSlotLabelOptions = useMemo(
    () =>
      subcategorySketchSlots.map((s) => {
        const firstLine = (s.productionTasks?.whatToDo ?? '')
          .split('\n')
          .map((l) => l.trim())
          .find(Boolean);
        const short = firstLine ? firstLine.replace(/^•\s*/, '').slice(0, 42) : '';
        const line = firstLine ?? '';
        return {
          slotId: s.slotId,
          label: short
            ? `${BRANCH_CATALOG_SLOT_ROLE[s.level].label} — ${short}${line.length > 42 ? '…' : ''}`
            : SUBCATEGORY_TASK_SLOT_FALLBACK[s.level],
        };
      }),
    [subcategorySketchSlots]
  );

  const taskSlotLabelById = useMemo(
    () => Object.fromEntries(taskSlotLabelOptions.map((o) => [o.slotId, o.label])),
    [taskSlotLabelOptions]
  );

  const mesDefectCatalogMerged = useMemo(
    () => mergedMesDefectCatalog(sketchMesDefectCatalog),
    [sketchMesDefectCatalog]
  );

  const sketchKind = useMemo(() => sketchKindForLeaf(currentLeaf), [currentLeaf]);
  const sketchAccent = useMemo(() => sketchAccentForLeaf(currentLeaf), [currentLeaf]);
  const fitVariant = useMemo(
    () =>
      sketchFitVariantForContext({
        audienceId: sketchContext?.audienceId ?? currentLeaf.audienceId,
        audienceName: sketchContext?.audienceName,
        isUnisex: sketchContext?.isUnisex,
      }),
    [currentLeaf.audienceId, sketchContext?.audienceId, sketchContext?.audienceName, sketchContext?.isUnisex]
  );

  /** Аудитория из паспорта/контекста + путь L1›L2›L3 (в `pathLabel` аудитория не зашита). */
  const sketchCatalogCaption = useMemo(() => {
    const path = currentLeaf.pathLabel.trim();
    const aud = sketchContext?.audienceName?.trim() || currentLeaf.audienceName?.trim();
    const parts = [aud || null, path || null].filter(Boolean) as string[];
    let s = parts.length === 2 ? `${parts[0]} · ${parts[1]}` : path || aud || '';
    if (sketchContext?.isUnisex && s) s += ' · Унисекс';
    return s;
  }, [
    currentLeaf.audienceName,
    currentLeaf.pathLabel,
    sketchContext?.audienceName,
    sketchContext?.isUnisex,
  ]);

  const aiPromptText = useMemo(
    () =>
      buildCategorySketchAiPrompt({
        pathLabel: sketchCatalogCaption,
        kind: sketchKind,
        variant: fitVariant,
        isUnisex: sketchContext?.isUnisex,
        extraHints: aiExtraHints,
        brandbookConstraints: sketchBrandbookConstraints,
      }),
    [
      aiExtraHints,
      sketchCatalogCaption,
      fitVariant,
      sketchBrandbookConstraints,
      sketchContext?.isUnisex,
      sketchKind,
    ]
  );

  const copyAiPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(aiPromptText);
      setAiCopied(true);
      window.setTimeout(() => setAiCopied(false), 2000);
    } catch {
      setAiCopied(false);
    }
  }, [aiPromptText]);

  const downloadSvgSilhouette = useCallback(() => {
    const svg = templateLayerRef.current?.querySelector('svg');
    if (!svg) {
      window.alert('SVG доступен только при типовой подложке (без загруженного фото).');
      return;
    }
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sketch-${currentLeaf.leafId.slice(0, 24)}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentLeaf.leafId]);

  const applyDemoAiReference = useCallback(async () => {
    setDemoRefBusy(true);
    try {
      const res = await requestCatalogImageGeneration({
        prompt: aiPromptText.slice(0, 900),
        imageType: 'model',
      });
      if (!res.imageUrl) return;
      const imgRes = await fetch(res.imageUrl);
      const blob = await imgRes.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result ?? ''));
        r.onerror = () => reject(new Error('read'));
        r.readAsDataURL(blob);
      });
      if (dataUrl.length > MAX_IMAGE_CHARS) {
        window.alert('Изображение слишком большое для сохранения в досье.');
        return;
      }
      if (sheetStorage) {
        sheetStorage.onImageChange(dataUrl, 'ai-demo-model-reference.jpg');
      } else {
        onPatch({
          categorySketchImageDataUrl: dataUrl,
          categorySketchImageFileName: 'ai-demo-model-reference.jpg',
        });
      }
    } catch {
      window.alert('Не удалось загрузить демо-изображение. Проверьте сеть или вставьте файл вручную.');
    } finally {
      setDemoRefBusy(false);
    }
  }, [aiPromptText, onPatch, sheetStorage]);

  const leafId = currentLeaf.leafId;

  const pinsOnLeaf = useMemo(
    () => dataAnnotations.map(normalizeAnnotation).filter((a) => sketchPinBelongsToLeaf(a, leafId)),
    [dataAnnotations, leafId]
  );

  const latestRevisionSnap = useMemo(
    () => latestRevisionSnapshotForLeaf(categorySketchRevisionSnapshots, leafId),
    [categorySketchRevisionSnapshots, leafId]
  );
  const baselineBomRefs = useMemo(() => {
    if (!latestRevisionSnap) return undefined as Set<string> | undefined;
    return bomRefsFromSnapshotAnnotations(latestRevisionSnap.annotations, leafId);
  }, [latestRevisionSnap, leafId]);
  const liveBomRefs = useMemo(
    () => bomRefsFromLiveAnnotations(dataAnnotations.map(normalizeAnnotation), leafId),
    [dataAnnotations, leafId]
  );

  const mesTopCodesOnBoard = useMemo(
    () => mesDefectCodeCountsOnPins(dataAnnotations.map(normalizeAnnotation), leafId).slice(0, 8),
    [dataAnnotations, leafId]
  );

  const masterPrintSceneCaption = useMemo(() => {
    const id = sceneIdProp?.trim();
    const vk = sceneViewProp ? SKETCH_SHEET_VIEW_LABELS[sceneViewProp] : '';
    const parts = [id && `сцена ${id}`, vk && `вид: ${vk}`].filter(Boolean);
    return parts.length ? parts.join(' · ') : undefined;
  }, [sceneIdProp, sceneViewProp]);

  const revisionDiff = useMemo(() => {
    if (!compareSnapIdA || !compareSnapIdB || compareSnapIdA === compareSnapIdB) return null;
    const a = categorySketchRevisionSnapshots.find((s) => s.snapshotId === compareSnapIdA);
    const b = categorySketchRevisionSnapshots.find((s) => s.snapshotId === compareSnapIdB);
    if (!a || !b) return null;
    return compareRevisionSnapshots(a, b);
  }, [categorySketchRevisionSnapshots, compareSnapIdA, compareSnapIdB]);

  useEffect(() => {
    if (readOnly || sheetStorage) return;
    if (onboard.done) return;
    const s1 = onboard.s1 || nextPinPreset !== 'other';
    const s2 = onboard.s2 || placeMode;
    const s3 = onboard.s3 || pinsOnLeaf.length >= 1;
    const s4 = onboard.s4 || pinsOnLeaf.some((a) => (a.text ?? '').trim().length > 1);
    const done = s1 && s2 && s3 && s4;
    if (
      s1 === onboard.s1 &&
      s2 === onboard.s2 &&
      s3 === onboard.s3 &&
      s4 === onboard.s4 &&
      done === onboard.done
    ) {
      return;
    }
    persistOnboard({ s1, s2, s3, s4, done });
  }, [
    nextPinPreset,
    placeMode,
    pinsOnLeaf,
    onboard.done,
    onboard.s1,
    onboard.s2,
    onboard.s3,
    onboard.s4,
    persistOnboard,
    readOnly,
    sheetStorage,
  ]);

  const handleAppendPropagatedDrafts = useCallback(() => {
    const own = dataAnnotations.map(normalizeAnnotation).filter((a) => sketchPinBelongsToLeaf(a, leafId));
    const incoming = buildPropagatedDraftsFromAnnotationsOnly(own);
    if (incoming.length === 0) {
      window.alert(
        'Нет подходящих меток: тип «Посадка» или этап «Образец», либо тип/этап «ОТК».'
      );
      return;
    }
    onPatch({
      sketchPropagatedDrafts: mergePropagatedDrafts(sketchPropagatedDrafts, incoming),
    });
  }, [dataAnnotations, leafId, onPatch, sketchPropagatedDrafts]);

  const handleCriticalCsv = useCallback(() => {
    const norm = dataAnnotations.map(normalizeAnnotation);
    downloadCriticalPinsCsv({
      pathLabel: currentLeaf.pathLabel,
      sku: articleSku,
      annotations: norm,
      leafId,
      fileNameStem: exportFileNameStem ?? `critical-${articleSku ?? 'sku'}`,
    });
    const crit = norm.filter((a) => sketchPinBelongsToLeaf(a, leafId) && a.priority === 'critical');
    setLastExportSummary(
      `CSV критич.: ${crit.length} пин(ов); в каждой строке: смена, BOM ref, код MES (если заданы).`
    );
  }, [articleSku, currentLeaf.pathLabel, dataAnnotations, exportFileNameStem, leafId]);

  const handleMesQualityCsv = useCallback(() => {
    const norm = dataAnnotations.map(normalizeAnnotation);
    downloadSketchMesQualityCsv({
      pathLabel: currentLeaf.pathLabel,
      sku: articleSku,
      annotations: norm,
      leafId,
      defectCatalog: sketchMesDefectCatalog,
      fileNameStem: exportFileNameStem ?? `mes-quality-${articleSku ?? 'sku'}`,
    });
    const n = norm.filter((a) => sketchPinBelongsToLeaf(a, leafId)).length;
    setLastExportSummary(`MES все: ${n} меток в выгрузке; поля согласованы с webhook критичных.`);
  }, [articleSku, currentLeaf.pathLabel, dataAnnotations, exportFileNameStem, leafId, sketchMesDefectCatalog]);

  const handleMesQcCsv = useCallback(() => {
    const norm = dataAnnotations.map(normalizeAnnotation);
    downloadSketchMesQualityCsv({
      pathLabel: currentLeaf.pathLabel,
      sku: articleSku,
      annotations: norm,
      leafId,
      defectCatalog: sketchMesDefectCatalog,
      fileNameStem: exportFileNameStem ?? `mes-qc-${articleSku ?? 'sku'}`,
      onlyQcOrCritical: true,
    });
    setLastExportSummary('MES ОТК+крит.: только соответствующие метки; смена и BOM — в колонках.');
  }, [articleSku, currentLeaf.pathLabel, dataAnnotations, exportFileNameStem, leafId, sketchMesDefectCatalog]);

  const handleCriticalWebhook = useCallback(async () => {
    const norm = dataAnnotations.map(normalizeAnnotation);
    const criticalPins = norm.filter((a) => sketchPinBelongsToLeaf(a, leafId) && a.priority === 'critical');
    const badShift = criticalPins.filter((a) => (a.mesShiftId ?? '').trim() && !isValidMesShiftId(a.mesShiftId));
    if (badShift.length > 0) {
      window.alert('Проверьте формат смены у критичных меток (допустимы буквы, цифры, пробел, дефис, дата).');
      return;
    }
    setWebhookBusy(true);
    try {
      const payload = buildCriticalWebhookPayload(
        currentLeaf.pathLabel,
        articleSku,
        leafId,
        norm
      );
      const r = await postCriticalPinsWebhook(payload);
      if (!r.ok) {
        window.alert(r.message ?? 'Не удалось отправить');
        setLastExportSummary('');
      } else {
        setLastExportSummary(
          `Webhook: ${payload.criticalPins.length} критич.; payload: смена, BOM ref, код MES, текст.`
        );
      }
    } finally {
      setWebhookBusy(false);
    }
  }, [articleSku, currentLeaf.pathLabel, dataAnnotations, leafId]);

  const pinVisualMatch = useCallback(
    (a: Workshop2Phase1CategorySketchAnnotation, group: 'critical' | 'qc' | 'other') => {
      const p = a.priority ?? 'important';
      const s = a.stage ?? 'tz';
      if (group === 'critical') return p === 'critical';
      if (group === 'qc') return p !== 'critical' && s === 'qc';
      return p !== 'critical' && s !== 'qc';
    },
    []
  );

  const visible = useMemo(
    () =>
      dataAnnotations
        .map(normalizeAnnotation)
        .filter((a) => sketchPinBelongsToLeaf(a, leafId))
        .filter((a) => filterType === 'all' || a.annotationType === filterType)
        .filter((a) => filterStage === 'all' || a.stage === filterStage)
        .filter((a) => filterPinVisual === 'all' || pinVisualMatch(a, filterPinVisual)),
    [dataAnnotations, filterPinVisual, filterStage, filterType, leafId, pinVisualMatch]
  );

  const visibleIds = useMemo(() => new Set(visible.map((a) => a.annotationId)), [visible]);

  useEffect(() => {
    if (pinsOnLeaf.length === 0) {
      setActiveId(null);
      return;
    }
    setActiveId((id) => {
      if (id && pinsOnLeaf.some((a) => a.annotationId === id)) return id;
      return pinsOnLeaf[0]!.annotationId;
    });
  }, [pinsOnLeaf]);

  const activeAnn = useMemo(() => {
    if (pinsOnLeaf.length === 0) return null;
    if (activeId) {
      const hit = pinsOnLeaf.find((a) => a.annotationId === activeId);
      if (hit) return hit;
    }
    return pinsOnLeaf[0]!;
  }, [pinsOnLeaf, activeId]);

  const activeAnnIdx = useMemo(
    () => (activeAnn ? pinsOnLeaf.findIndex((a) => a.annotationId === activeAnn.annotationId) : -1),
    [activeAnn, pinsOnLeaf]
  );

  useEffect(() => {
    if (!onVisualCatalogSuggestFromSketch) return;
    if (!visualCatalogAttributeIds.length) {
      onVisualCatalogSuggestFromSketch([]);
      return;
    }
    const allowed = new Set(visualCatalogAttributeIds);
    const t = activeAnn?.annotationType;
    if (!t) {
      onVisualCatalogSuggestFromSketch([]);
      return;
    }
    const sug = mergeSuggestedTzAttributeIdsForSketchType(t, visualCatalogSketchLinks);
    onVisualCatalogSuggestFromSketch(sug.filter((id) => allowed.has(id)));
  }, [
    activeAnn?.annotationId,
    activeAnn?.annotationType,
    onVisualCatalogSuggestFromSketch,
    visualCatalogAttributeIds,
    visualCatalogSketchLinks,
  ]);

  const hiddenByFilters = pinsOnLeaf.length > 0 && visible.length === 0;

  const boardSketchStatus = useMemo(() => {
    if (categorySketchProductionApproved) {
      let d = categorySketchProductionApproved.at;
      try {
        d = new Date(categorySketchProductionApproved.at).toLocaleDateString('ru-RU');
      } catch {
        /* raw */
      }
      return {
        label: 'Утверждён',
        detail: `${categorySketchProductionApproved.by} · ${d}`,
      };
    }
    if (categorySketchFreezeUntilDate?.trim()) {
      return { label: 'Заморозка', detail: `до ${categorySketchFreezeUntilDate.trim()}` };
    }
    return {
      label: 'Черновик',
      detail: sheetStorage ? 'Лист: статус в досье артикула' : 'Подпись производства не проставлена',
    };
  }, [sheetStorage, categorySketchFreezeUntilDate, categorySketchProductionApproved]);

  const pinVisualCounts = useMemo(() => {
    const own = dataAnnotations.map(normalizeAnnotation).filter((a) => sketchPinBelongsToLeaf(a, leafId));
    let critical = 0;
    let qc = 0;
    let other = 0;
    for (const a of own) {
      if (pinVisualMatch(a, 'critical')) critical++;
      else if (pinVisualMatch(a, 'qc')) qc++;
      else other++;
    }
    return { critical, qc, other };
  }, [dataAnnotations, leafId, pinVisualMatch]);

  const counters = useMemo(() => {
    const own = dataAnnotations.map(normalizeAnnotation).filter((a) => sketchPinBelongsToLeaf(a, leafId));
    const linked = own.filter((a) => a.linkedAttributeId || a.linkedTaskId || a.linkedQcZoneId).length;
    return {
      total: own.length,
      critical: own.filter((a) => a.priority === 'critical').length,
      inWork: own.filter((a) => a.status === 'in_progress').length,
      qc: own.filter((a) => a.stage === 'qc').length,
      linked,
    };
  }, [dataAnnotations, leafId]);

  const hotspotPresets = useMemo(
    () => HOTSPOT_PRESETS_BY_KIND[sketchKind] ?? [],
    [sketchKind]
  );

  const setAnnotations = useCallback(
    (next: Workshop2Phase1CategorySketchAnnotation[]) => {
      if (readOnly) return;
      const norm = next.map(normalizeAnnotation);
      if (sheetStorage) {
        sheetStorage.onAnnotationsChange(norm);
        return;
      }
      const patch: CategorySketchAnnotatorPatch = { categorySketchAnnotations: norm };
      if (auditActor) {
        const diff = buildAnnotationDiffAudit(dataAnnotations, norm, leafId, auditActor);
        if (diff.length > 0) {
          patch.sketchMasterAnnotationAuditLog = mergeSketchMasterAuditLog(sketchMasterAnnotationAuditLog, diff);
        }
      }
      onPatch(patch);
    },
    [
      auditActor,
      dataAnnotations,
      leafId,
      onPatch,
      readOnly,
      sheetStorage,
      sketchMasterAnnotationAuditLog,
    ]
  );

  const updateAnnotation = useCallback(
    (
      id: string,
      patch:
        | Partial<Workshop2Phase1CategorySketchAnnotation>
        | ((current: Workshop2Phase1CategorySketchAnnotation) => Partial<Workshop2Phase1CategorySketchAnnotation>)
    ) => {
      setAnnotations(
        dataAnnotations.map((raw) => {
          const current = normalizeAnnotation(raw);
          if (current.annotationId !== id) return current;
          const resolved = typeof patch === 'function' ? patch(current) : patch;
          return normalizeAnnotation({ ...current, ...resolved });
        })
      );
    },
    [dataAnnotations, setAnnotations]
  );

  const qualityHints = useMemo(
    () =>
      sketchBoardQualityHints(dataAnnotations.map(normalizeAnnotation), {
        leafId,
        hasImageSubstrate: Boolean(imageDataUrl),
      }),
    [dataAnnotations, leafId, imageDataUrl]
  );

  useEffect(() => {
    setBatchSelectedIds([]);
  }, [leafId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.getAttribute('role') === 'combobox' ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'Escape' && placeMode) {
        e.preventDefault();
        setPlaceMode(false);
        return;
      }
      if (readOnly) return;
      if (!activeId || placeMode) return;
      const step = e.shiftKey ? 2 : 0.8;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      if (e.key === 'ArrowRight') dx = step;
      if (e.key === 'ArrowUp') dy = -step;
      if (e.key === 'ArrowDown') dy = step;
      if (!dx && !dy) return;
      e.preventDefault();
      updateAnnotation(activeId, (cur) => ({
        xPct: Math.min(98, Math.max(2, cur.xPct + dx)),
        yPct: Math.min(98, Math.max(2, cur.yPct + dy)),
      }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, placeMode, readOnly, updateAnnotation]);

  const applyLastPinStyleToNext = useCallback(() => {
    const own = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId)).map(normalizeAnnotation);
    if (own.length === 0) return;
    const last = own[own.length - 1]!;
    if (last.priority === 'critical') setNextPinPreset('critical');
    else if (last.stage === 'qc') setNextPinPreset('qc');
    else setNextPinPreset('other');
    setNextAnnotationType(last.annotationType ?? 'construction');
  }, [dataAnnotations, leafId]);

  const batchApplyPriority = useCallback(
    (p: Workshop2SketchAnnotationPriority) => {
      if (batchSelectedIds.length === 0) return;
      setAnnotations(
        dataAnnotations.map((raw) => {
          const a = normalizeAnnotation(raw);
          if (!batchSelectedIds.includes(a.annotationId)) return a;
          return normalizeAnnotation({ ...a, priority: p });
        })
      );
    },
    [batchSelectedIds, dataAnnotations, setAnnotations]
  );

  const batchApplyStage = useCallback(
    (stage: Workshop2SketchAnnotationStage) => {
      if (batchSelectedIds.length === 0) return;
      setAnnotations(
        dataAnnotations.map((raw) => {
          const a = normalizeAnnotation(raw);
          if (!batchSelectedIds.includes(a.annotationId)) return a;
          const patch: Partial<Workshop2Phase1CategorySketchAnnotation> = { stage };
          if (stage === 'qc') patch.linkedQcZoneId = a.annotationId;
          return normalizeAnnotation({ ...a, ...patch });
        })
      );
    },
    [batchSelectedIds, dataAnnotations, setAnnotations]
  );

  const onBoardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (readOnly || !placeMode || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const xPct = Math.min(98, Math.max(2, x));
    const yPct = Math.min(98, Math.max(2, y));
    if (pinsOnLeaf.length >= annotationLimit) {
      window.alert(
        `На этой доске уже ${annotationLimit} меток (лимит). Удалите точки на текущем листе или откройте другой уровень категории.`
      );
      return;
    }
    const id = newUuid();
    const nextAnnotation = normalizeAnnotation({
      annotationId: id,
      categoryLeafId: leafId,
      xPct,
      yPct,
      text: '',
      annotationType: nextAnnotationType,
      ...priorityStageForNextPinPreset(id, nextPinPreset),
    });
    setAnnotations([...dataAnnotations, nextAnnotation]);
    setActiveId(nextAnnotation.annotationId);
    setPlaceMode(false);
  };

  const removeAnn = (id: string) => {
    if (readOnly) return;
    setAnnotations(dataAnnotations.filter((a) => a.annotationId !== id));
    setBatchSelectedIds((ids) => ids.filter((x) => x !== id));
    if (activeId === id) setActiveId(null);
  };

  const addPresetAnnotation = useCallback(
    (preset: SketchHotspotPreset) => {
      const onLeaf = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId)).length;
      if (onLeaf >= annotationLimit) return;
      const id = newUuid();
      const nextAnnotation = normalizeAnnotation({
        annotationId: id,
        categoryLeafId: leafId,
        xPct: preset.xPct,
        yPct: preset.yPct,
        annotationType: preset.annotationType,
        status: 'new',
        text: preset.text,
        ...priorityStageForNextPinPreset(id, nextPinPreset),
      });
      setAnnotations([...dataAnnotations, nextAnnotation]);
      setActiveId(nextAnnotation.annotationId);
    },
    [dataAnnotations, leafId, nextPinPreset, setAnnotations, annotationLimit]
  );

  const applyPinTextSnippet = useCallback(
    (snippetText: string) => {
      const t = snippetText.trim();
      if (!t) return;
      if (activeId) {
        updateAnnotation(activeId, (cur) => ({
          text: cur.text?.trim() ? `${cur.text.trim()}\n${t}` : t,
        }));
        return;
      }
      const onLeaf = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId)).length;
      if (onLeaf >= annotationLimit) {
        window.alert(
          `На этой доске уже ${annotationLimit} меток (лимит). Удалите точки или откройте другой лист.`
        );
        return;
      }
      const id = newUuid();
      const nextAnnotation = normalizeAnnotation({
        annotationId: id,
        categoryLeafId: leafId,
        xPct: 50,
        yPct: 50,
        text: t,
        annotationType: nextAnnotationType,
        ...priorityStageForNextPinPreset(id, nextPinPreset),
      });
      setAnnotations([...dataAnnotations, nextAnnotation]);
      setActiveId(id);
    },
    [
      activeId,
      annotationLimit,
      dataAnnotations,
      leafId,
      nextAnnotationType,
      nextPinPreset,
      setAnnotations,
      updateAnnotation,
    ]
  );

  const addDraftSuggestedPins = useCallback(() => {
    const ownLen = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId)).length;
    let room = annotationLimit - ownLen;
    if (room <= 0) return;
    const positions: [number, number][] = [
      [22, 22],
      [78, 22],
      [22, 78],
      [78, 78],
    ];
    const batch: Workshop2Phase1CategorySketchAnnotation[] = [];
    for (const [xPct, yPct] of positions) {
      if (room <= 0) break;
      const id = newUuid();
      batch.push(
        normalizeAnnotation({
          annotationId: id,
          categoryLeafId: leafId,
          xPct,
          yPct,
          text: 'Черновик: уточните позицию и описание.',
          annotationType: 'construction',
          ...priorityStageForNextPinPreset(id, nextPinPreset),
        })
      );
      room--;
    }
    setAnnotations([...dataAnnotations, ...batch]);
  }, [annotationLimit, dataAnnotations, leafId, nextPinPreset, setAnnotations]);

  const removeDraftSuggestedPins = useCallback(() => {
    if (readOnly) return;
    const next = dataAnnotations.filter((raw) => {
      if (!sketchPinBelongsToLeaf(raw, leafId)) return true;
      const t = (normalizeAnnotation(raw).text ?? '').trim();
      return !t.startsWith('Черновик:');
    });
    if (next.length === dataAnnotations.length) {
      window.alert('Нет меток с текстом «Черновик:…» на этой доске.');
      return;
    }
    setAnnotations(next.map(normalizeAnnotation));
  }, [dataAnnotations, leafId, readOnly, setAnnotations]);

  const handleExportPng = useCallback(async () => {
    const own = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId)).map(normalizeAnnotation);
    const stem =
      exportFileNameStem?.trim() ||
      `sketch-${currentLeaf.leafId.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 32)}`;
    setExportBusy(true);
    try {
      await downloadSketchBoardPng({
        imageDataUrl,
        annotations: own.map((a, index) => ({
          xPct: a.xPct,
          yPct: a.yPct,
          priority: a.priority,
          stage: a.stage,
          index,
        })),
        fileName: stem,
        subtitle: currentLeaf.pathLabel,
      });
    } catch {
      window.alert('Не удалось сформировать PNG.');
    } finally {
      setExportBusy(false);
    }
  }, [currentLeaf.leafId, currentLeaf.pathLabel, dataAnnotations, exportFileNameStem, imageDataUrl, leafId]);

  const onPickImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    const u = await readFileAsDataUrlLimited(f, MAX_IMAGE_CHARS);
    if (!u) {
      window.alert('Файл слишком большой для сохранения в досье.');
      return;
    }
    if (sheetStorage) {
      sheetStorage.onImageChange(u, f.name);
    } else {
      onPatch({
        categorySketchImageDataUrl: u,
        categorySketchImageFileName: f.name,
      });
    }
  };

  const clearImage = () => {
    if (sheetStorage) {
      sheetStorage.onImageChange(undefined, undefined);
    } else {
      onPatch({ categorySketchImageDataUrl: undefined, categorySketchImageFileName: undefined });
    }
  };

  const onPickCompareOverlay = async (e: ChangeEvent<HTMLInputElement>) => {
    if (readOnly || sheetStorage) return;
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    const u = await readFileAsDataUrlLimited(f, MAX_IMAGE_CHARS);
    if (!u) {
      window.alert('Файл слишком большой для сохранения в досье.');
      return;
    }
    onPatch({
      categorySketchCompareOverlayDataUrl: u,
      categorySketchCompareOverlayFileName: f.name,
      categorySketchCompareOverlayOpacityPct: compareOpacity,
    });
  };

  const clearCompareOverlay = () => {
    if (readOnly || sheetStorage) return;
    onPatch({
      categorySketchCompareOverlayDataUrl: null,
      categorySketchCompareOverlayFileName: null,
      categorySketchCompareOverlayScalePct: 100,
      categorySketchCompareOffsetXPct: 0,
      categorySketchCompareOffsetYPct: 0,
    });
  };

  /** Сброс общей доски для текущей ветки каталога: метки этой ветки + своя подложка + сравнение. */
  const resetMasterSketchBoard = () => {
    if (readOnly || sheetStorage) return;
    const ownPins = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId));
    const ownCount = ownPins.length;
    const hasImage = Boolean(imageDataUrl);
    const hasOverlay = Boolean(compareOverlayDataUrl);
    if (ownCount === 0 && !hasImage && !hasOverlay) {
      window.alert(
        'Нечего сбрасывать: для этой ветки нет меток на общей доске, своей подложки и сравнения с эталоном.'
      );
      return;
    }
    if (
      !window.confirm(
        `Очистить общий скетч для текущей ветки каталога?\n\n• Удалить меток: ${ownCount}\n• Вернуть типовой силуэт вместо своего фото${hasOverlay ? '\n• Убрать наложение «сравнение с эталоном»' : ''}\n\nМетки других веток на этой доске не меняются. Отменить нельзя.`
      )
    ) {
      return;
    }
    const rest = dataAnnotations.filter((a) => !sketchPinBelongsToLeaf(a, leafId));
    onPatch({
      categorySketchAnnotations: rest,
      categorySketchImageDataUrl: undefined,
      categorySketchImageFileName: undefined,
      categorySketchCompareOverlayDataUrl: null,
      categorySketchCompareOverlayFileName: null,
      categorySketchCompareOverlayScalePct: 100,
      categorySketchCompareOffsetXPct: 0,
      categorySketchCompareOffsetYPct: 0,
    });
    setActiveId(null);
    setBatchSelectedIds([]);
  };

  const onPickProofPhoto = useCallback(
    async (annotationId: string, e: ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      const f = e.target.files?.[0];
      e.target.value = '';
      if (!f || !f.type.startsWith('image/')) return;
      const u = await readFileAsDataUrlLimited(f, MAX_IMAGE_CHARS);
      if (!u) {
        window.alert('Файл слишком большой для сохранения в досье.');
        return;
      }
      updateAnnotation(annotationId, {
        proofPhotoDataUrl: u,
        proofPhotoFileName: f.name,
        proofStatus: 'pending',
      });
    },
    [readOnly, updateAnnotation]
  );

  const editorBody = (
    <div className="space-y-3">
      {qualityHints.length > 0 ? (
        <Alert className="border-amber-200 bg-amber-50/70">
          <AlertTitle className="text-xs">Проверка перед «готово»</AlertTitle>
          <AlertDescription className="text-[11px] text-slate-800">
            <ul className="list-disc space-y-0.5 pl-4">
              {qualityHints.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
      {readOnly ? (
        <div className="flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50/90 px-3 py-2 text-[11px] text-teal-950">
          <Factory className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Режим цеха</p>
            <p className="text-teal-900/90">Просмотр и экспорт; правки меток отключены.</p>
          </div>
        </div>
      ) : null}
      {!readOnly && !sheetStorage ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-b border-slate-100 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-red-700 hover:bg-red-50 hover:text-red-900"
            title="Удаляет все метки общей доски для текущей ветки каталога, сбрасывает своё фото и сравнение с эталоном. Метки других веток на этой доске не меняются."
            onClick={resetMasterSketchBoard}
          >
            Очистить общий скетч…
          </Button>
        </div>
      ) : null}
      {!sheetStorage ? (
        <details className="rounded-lg border border-slate-200 bg-slate-50/60 text-[11px] text-slate-700">
          <summary className="cursor-pointer list-none px-3 py-2 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
            Подсказки: с чего начать и как устроены метки
          </summary>
          <div className="space-y-3 border-t border-slate-200 px-3 py-3">
            {!readOnly && !onboard.done ? (
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Чеклист</p>
                <ul className="space-y-1">
                  {(
                    [
                      { ok: onboard.s1, label: 'Выбран цвет группы (критично / ОТК / остальное)' },
                      { ok: onboard.s2, label: 'Нажато «+ на доске»' },
                      { ok: onboard.s3, label: 'Клик по картинке поставил точку' },
                      { ok: onboard.s4, label: 'Справа вписан текст метки' },
                    ] as const
                  ).map((row) => (
                    <li key={row.label} className="flex items-start gap-2">
                      {row.ok ? (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                      ) : (
                        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                      )}
                      <span>{row.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-2 text-[10px] font-medium text-sky-800 underline"
                  onClick={() => persistOnboard({ ...onboard, done: true })}
                >
                  Не показывать чеклист
                </button>
              </div>
            ) : !readOnly ? (
              <p className="text-[10px] text-slate-600">
                <span className="font-medium text-slate-800">Кратко:</span> цвет → «+ на доске» → клик по картинке → текст
                справа.{' '}
                <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[9px]">Esc</kbd> —
                выйти из режима клика.
              </p>
            ) : null}
            <ul className="list-disc space-y-1.5 pl-4 text-[10px] leading-snug">
              <li>
                <span className="font-medium text-slate-900">Цвет кружка</span> — насколько срочно и для кого (критично,
                ОТК, обычная заметка). Это не то же самое, что «тип узла» в списке ниже.
              </li>
              <li>
                <span className="font-medium text-slate-900">Тип узла</span> — что именно отмечаем (шов, фурнитура…).
              </li>
              <li>
                <span className="font-medium text-slate-900">Этап</span> — когда проверяем (ТЗ, образец, ОТК).
              </li>
              <li>
                <span className="font-medium text-slate-900">Задачи по глубине ветки</span> — связь метки с блоком
                «линия / группа / карточка» на вкладке ветки (тот же SKU, разная гранулярность).
              </li>
            </ul>
          </div>
        </details>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
        <div className="min-w-0 flex-1">
          {showPassportSectionHeader ? (
            <p className="text-[10px] font-medium text-zinc-500">Скетч по категории</p>
          ) : null}
          <p className="truncate text-sm font-semibold text-zinc-900" title={sketchCatalogCaption}>
            {sketchCatalogCaption}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {articleSku?.trim() ? (
            <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-900">
              {articleSku.trim()}
            </span>
          ) : null}
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-[10px] font-medium',
              categorySketchProductionApproved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : categorySketchFreezeUntilDate?.trim()
                  ? 'border-amber-200 bg-amber-50 text-amber-950'
                  : 'border-zinc-200 bg-white text-zinc-600'
            )}
            title={boardSketchStatus.detail}
          >
            {boardSketchStatus.label}
          </span>
          <span className="text-[10px] tabular-nums text-zinc-500">
            {counters.total}/{annotationLimit}
            {counters.critical > 0 ? (
              <span className="text-rose-600"> · {counters.critical} крит.</span>
            ) : null}
          </span>
        </div>
      </div>

      {!sheetStorage ? (
        <details className="rounded-lg border border-zinc-200 bg-white text-[10px]">
          <summary className="cursor-pointer list-none px-3 py-2 font-medium text-zinc-700 [&::-webkit-details-marker]:hidden">
            PLM: сцена артикула и вид листа (по желанию)
          </summary>
          <div className="flex flex-wrap items-end gap-3 border-t border-zinc-100 px-3 py-3">
            <label className="min-w-[10rem] flex-1 space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-zinc-500">ID сцены</span>
              <Input
                className="h-8 text-[11px]"
                placeholder="один id на виды"
                value={sceneIdProp ?? ''}
                disabled={readOnly}
                onChange={(e) => onPatch({ categorySketchSceneId: e.target.value.trim() || undefined })}
              />
            </label>
            <label className="min-w-[10rem] space-y-0.5">
              <span className="text-[9px] font-semibold uppercase text-zinc-500">Вид</span>
              <select
                className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[11px]"
                value={sceneViewProp ?? ''}
                disabled={readOnly}
                onChange={(e) => {
                  const v = e.target.value;
                  onPatch({
                    categorySketchSceneView: v ? (v as Workshop2SketchSheetViewKind) : undefined,
                  });
                }}
              >
                <option value="">—</option>
                {Object.entries(SKETCH_SHEET_VIEW_LABELS).map(([k, lab]) => (
                  <option key={k} value={k}>
                    {lab}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </details>
      ) : null}

      <div
        className={cn(
          'grid gap-4 grid-cols-1',
          !readOnly && 'lg:grid-cols-[minmax(0,6.5fr)_minmax(300px,3.5fr)] lg:items-start'
        )}
      >
        <div className="min-w-0 space-y-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-zinc-900">Шаг 1 — поставить точку на картинке</p>
          <div className="rounded-lg border border-zinc-100 bg-zinc-50/90 p-2.5">
            <div className="mb-2 text-[10px] text-zinc-600">
              Выберите цвет (важность), нажмите «+ на доске», затем клик по изображению ниже. Текст метки — справа.
            </div>
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-200/80 bg-white px-2 py-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-500">Группа</span>
            <div className="flex flex-wrap gap-1">
              {(
                [
                  { key: 'critical' as const, dot: 'bg-rose-600', border: 'border-rose-300', activeBg: 'bg-rose-50' },
                  { key: 'qc' as const, dot: 'bg-amber-600', border: 'border-amber-300', activeBg: 'bg-amber-50' },
                  { key: 'other' as const, dot: 'bg-zinc-400', border: 'border-zinc-300', activeBg: 'bg-zinc-50' },
                ] as const
              ).map(({ key, dot, border, activeBg }) => (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    'inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-medium transition-colors',
                    nextPinPreset === key
                      ? cn(border, activeBg, 'text-zinc-900')
                      : 'border-transparent bg-white text-zinc-600 hover:bg-zinc-100'
                  )}
                  aria-pressed={nextPinPreset === key}
                  disabled={readOnly}
                  onClick={() => setNextPinPreset(key)}
                >
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', dot)} aria-hidden />
                  {NEXT_PIN_PRESET_LABEL[key]}
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant={placeMode ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'h-7 shrink-0 text-[10px]',
                pinsOnLeaf.length === 0 && !placeMode && !readOnly && 'animate-pulse shadow-md'
              )}
              disabled={readOnly}
              onClick={() => setPlaceMode((v) => !v)}
              title={pinsOnLeaf.length === 0 ? 'Нажмите, затем кликните по подложке, чтобы поставить первую метку' : undefined}
            >
              {placeMode ? 'Клик…' : '+ на доске'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 shrink-0 text-[10px]"
              disabled={readOnly}
              onClick={applyLastPinStyleToNext}
            >
              Как у последней
            </Button>
            <label className="flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-zinc-600">
              <span className="shrink-0 font-semibold uppercase tracking-wide text-zinc-500">Тип узла</span>
              <select
                className="h-7 max-w-[11rem] rounded-md border border-zinc-200 bg-white px-1.5 text-[10px]"
                value={nextAnnotationType}
                disabled={readOnly}
                onChange={(e) => setNextAnnotationType(e.target.value as Workshop2SketchAnnotationType)}
                title="Используется при «+ на доске» и шаблонах текста без выбранной метки"
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          </div>

          <details className="rounded-lg border border-slate-100 bg-white">
            <summary className="cursor-pointer list-none px-2 py-2 text-[10px] font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
              Фильтр номеров справа (необязательно)
            </summary>
            <div className="space-y-1.5 border-t border-slate-100 p-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden />
              <span className="text-[10px] font-semibold text-slate-700">По цвету кружка</span>
              <span
                className="cursor-help text-[8px] font-normal normal-case text-slate-500"
                title="Влияет на боковую панель и кнопки номеров; на подложке всегда видны все метки листа. Новая точка — блок «Группа» выше."
              >
                ⓘ
              </span>
            </div>
            <p className="text-[9px] leading-snug text-slate-500">
              По цвету пина, типу узла и этапу. «Все» / «Сбросить» — полный список справа; точки на картинке не скрываются.
              Пресет новой метки — блок «Новая метка» выше.
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-slate-600">
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
                  filterPinVisual === 'all' && filterType === 'all' && filterStage === 'all'
                    ? 'border-zinc-400 bg-zinc-100 font-medium text-zinc-900'
                    : 'border-transparent bg-transparent hover:bg-slate-100'
                )}
                aria-pressed={filterPinVisual === 'all' && filterType === 'all' && filterStage === 'all'}
                title="Снять фильтры: полный список справа; на доске и так видны все метки листа"
                onClick={() => {
                  setFilterPinVisual('all');
                  setFilterType('all');
                  setFilterStage('all');
                }}
              >
                Все
                <span className="tabular-nums text-slate-400">({pinsOnLeaf.length})</span>
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
                  filterPinVisual === 'critical'
                    ? 'border-rose-300 bg-rose-50 text-rose-900'
                    : 'border-transparent bg-transparent hover:bg-slate-100'
                )}
                aria-pressed={filterPinVisual === 'critical'}
                title="Только красное кольцо (приоритет «критично»). Ещё раз — режим «Все»."
                onClick={() => setFilterPinVisual((v) => (v === 'critical' ? 'all' : 'critical'))}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-600" aria-hidden />
                критично
                <span className="tabular-nums text-slate-400">({pinVisualCounts.critical})</span>
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
                  filterPinVisual === 'qc'
                    ? 'border-amber-300 bg-amber-50 text-amber-950'
                    : 'border-transparent bg-transparent hover:bg-slate-100'
                )}
                aria-pressed={filterPinVisual === 'qc'}
                title="Только этап ОТК (янтарь). Ещё раз — «Все»."
                onClick={() => setFilterPinVisual((v) => (v === 'qc' ? 'all' : 'qc'))}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-600" aria-hidden />
                этап ОТК
                <span className="tabular-nums text-slate-400">({pinVisualCounts.qc})</span>
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 transition-colors',
                  filterPinVisual === 'other'
                    ? 'border-teal-300 bg-teal-50 text-teal-950'
                    : 'border-transparent bg-transparent hover:bg-slate-100'
                )}
                aria-pressed={filterPinVisual === 'other'}
                title="Остальные (серое кольцо). Ещё раз — «Все»."
                onClick={() => setFilterPinVisual((v) => (v === 'other' ? 'all' : 'other'))}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" aria-hidden />
                остальные
                <span className="tabular-nums text-slate-400">({pinVisualCounts.other})</span>
              </button>
              <button
                type="button"
                className="ml-0.5 text-[9px] font-medium text-slate-500 underline-offset-2 hover:underline"
                disabled={
                  filterPinVisual === 'all' &&
                  filterType === 'all' &&
                  filterStage === 'all' &&
                  !placeMode &&
                  nextPinPreset === 'other'
                }
                onClick={() => {
                  setFilterPinVisual('all');
                  setFilterType('all');
                  setFilterStage('all');
                  setPlaceMode(false);
                  setNextPinPreset('other');
                }}
              >
                Сбросить всё
              </button>
            </div>
            {hiddenByFilters ? (
              <p className="rounded border border-amber-200 bg-amber-50/90 px-2 py-1.5 text-[9px] text-amber-950">
                Фильтры не совпадают ни с одной из {pinsOnLeaf.length} меток на листе: список справа и номера подсвечены
                приглушённо. На доске точки видны все; нажмите «Все» / «Сбросить всё», чтобы убрать несовпадение.
              </p>
            ) : null}

          <details className="rounded-lg border border-slate-100 bg-slate-50/80 p-2">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[10px] font-semibold text-slate-700 [&::-webkit-details-marker]:hidden">
              <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden />
              Доп. фильтр: тип узла и этап
              <span
                className="ml-auto cursor-help text-[8px] font-normal text-slate-500"
                title="Сужает список справа и номера меток; доска показывает все точки листа. Суммируется с цветовым фильтром выше."
              >
                ⓘ
              </span>
            </summary>
            <p className="mt-2 text-[9px] leading-snug text-slate-600">
              Это поля карточки метки (конструкция, материал… и ТЗ / образец / ОТК…). Вместе с цветовым фильтром выше
              сужает список справа и кнопки номеров; на подложке по‑прежнему отображаются все метки текущего листа.
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Тип узла</span>
                <select
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px]"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                >
                  <option value="all">Все типы</option>
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Этап маршрута</span>
                <select
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px]"
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value as typeof filterStage)}
                >
                  <option value="all">Все этапы</option>
                  {Object.entries(STAGE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>
          </div>
          </details>

          {hotspotPresets.length > 0 ? (
            <details className="rounded-lg border border-teal-100 bg-teal-50/20">
              <summary className="cursor-pointer list-none px-2 py-2 text-[10px] font-medium text-teal-950 [&::-webkit-details-marker]:hidden">
                Готовые точки по зонам (ускорение)
              </summary>
              <div className="flex flex-wrap gap-1.5 border-t border-teal-100 p-2">
                {hotspotPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px]"
                    onClick={() => addPresetAnnotation(preset)}
                  >
                    + {preset.label}
                  </Button>
                ))}
              </div>
            </details>
          ) : null}

          {pinTextSnippets.length > 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-2">
              <p className="mb-1.5 text-[10px] font-medium text-slate-800">Готовые фразы в текст метки</p>
              <div className="flex flex-wrap gap-1.5">
                {pinTextSnippets.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 text-[10px]"
                    onClick={() => applyPinTextSnippet(s.text)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {!readOnly && !sheetStorage && (onSavePinTemplateToDossier || onSavePinTemplateToOrg) ? (
            <details className="rounded-lg border border-emerald-200 bg-emerald-50/30">
              <summary className="cursor-pointer list-none px-2 py-2 text-[10px] font-medium text-emerald-950 [&::-webkit-details-marker]:hidden">
                Сохранить этот набор точек как шаблон
              </summary>
              <div className="flex flex-wrap gap-2 border-t border-emerald-100 p-2">
                {onSavePinTemplateToDossier ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className="h-8 gap-1 text-[10px]"
                    onClick={onSavePinTemplateToDossier}
                  >
                    <Save className="h-3.5 w-3.5" />
                    В досье
                  </Button>
                ) : null}
                {onSavePinTemplateToOrg ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-[10px]"
                    onClick={onSavePinTemplateToOrg}
                  >
                    В библиотеку
                  </Button>
                ) : null}
              </div>
            </details>
          ) : null}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
            <p className="mb-2 text-center text-xs font-semibold text-zinc-900">Картинка и точки</p>
            <div className="rounded-lg border border-zinc-200 bg-zinc-100 p-1.5">
              <div
                ref={boardRef}
                role="region"
                aria-label="Поле скетча категории с метками"
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden border border-zinc-200 bg-white',
                  placeMode && 'cursor-crosshair ring-2 ring-zinc-900 ring-offset-2'
                )}
                onClick={onBoardClick}
              >
                {placeMode ? (
                  <div className="pointer-events-none absolute inset-x-3 top-3 z-10 rounded-md border border-teal-200 bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-teal-900 shadow-sm">
                    Кружок: <span className="font-bold">{NEXT_PIN_PRESET_LABEL[nextPinPreset]}</span>. Кликните по
                    картинке.
                  </div>
                ) : null}
                <div ref={templateLayerRef} className="absolute inset-0 h-full w-full">
                  {imageDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- data URL из досье
                    <img src={imageDataUrl} alt="Подложка скетча" className="h-full w-full object-contain" />
                  ) : (
                    <CategorySketchTemplateSvg
                      leaf={currentLeaf}
                      sketchContext={sketchContext}
                      className="h-full w-full"
                    />
                  )}
                  {compareOverlayDataUrl && !sheetStorage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- data URL эталона
                    <img
                      src={compareOverlayDataUrl}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                      style={{
                        opacity: compareOpacity / 100,
                        transform: `translate(${compareOffsetXPct}%, ${compareOffsetYPct}%) scale(${compareScalePct / 100})`,
                        transformOrigin: 'center center',
                      }}
                    />
                  ) : null}
                </div>
                {pinsOnLeaf.map((a, idx) => (
                  <Tooltip key={a.annotationId} delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'absolute z-[5] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-zinc-50 font-mono font-bold tabular-nums text-zinc-900 shadow-sm transition-shadow',
                          readOnly ? 'h-11 w-11 text-base' : 'h-9 w-9 text-sm',
                          a.priority === 'critical'
                            ? 'border-rose-600 shadow-[0_0_0_1px_rgba(225,29,72,0.35)]'
                            : a.stage === 'qc'
                              ? 'border-amber-500 shadow-[0_0_0_1px_rgba(217,119,6,0.35)]'
                              : 'border-zinc-400',
                          activeId === a.annotationId && 'ring-2 ring-zinc-900 ring-offset-1',
                          !visibleIds.has(a.annotationId) && 'opacity-55 ring-1 ring-dashed ring-slate-400'
                        )}
                        style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setActiveId(a.annotationId);
                        }}
                        aria-label={`Метка ${idx + 1}, наведите для описания и параметров`}
                      >
                        {idx + 1}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      className="border-slate-200 bg-white p-3 text-popover-foreground shadow-lg"
                    >
                      <CategorySketchPinHoverCard
                        annotation={a}
                        index={idx}
                        attributeOptions={attributeOptions}
                        taskSlotLabelById={taskSlotLabelById}
                      />
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          <details className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-medium text-zinc-800 [&::-webkit-details-marker]:hidden">
              Свой файл вместо силуэта · эталон · скачать .svg
            </summary>
            <div className="space-y-2 border-t border-slate-100 p-3">
              <p className="text-[10px] leading-snug text-slate-600">
                {sheetStorage
                  ? 'Фото этого листа; метки остаются на своих местах.'
                  : 'Необязательно: можно оставить типовой силуэт. Свой снимок полностью меняет картинку под метками.'}
              </p>
              <div className="space-y-1">
                <Label htmlFor={sketchImageInputId} className="text-[10px] text-slate-500">
                  {imageDataUrl ? 'Заменить другим файлом' : 'Файл изображения (jpg, png, webp…)'}
                </Label>
                <Input
                  id={sketchImageInputId}
                  type="file"
                  accept="image/*"
                  className="h-9 cursor-pointer text-xs"
                  disabled={readOnly}
                  onChange={(e) => void onPickImage(e)}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-[10px]"
                  disabled={Boolean(imageDataUrl)}
                  onClick={downloadSvgSilhouette}
                  title={imageDataUrl ? 'Сбросьте фото, чтобы экспортировать вектор' : ''}
                >
                  <Download className="h-3.5 w-3.5" />
                  Скачать .svg силуэта
                </Button>
                {!sheetStorage ? (
                  <details className="min-w-[12rem] flex-1 rounded-md border border-slate-200/80 bg-white/70 p-2 text-[10px]">
                    <summary className="cursor-pointer font-medium text-slate-700">
                      Демо-подложка через API
                    </summary>
                    <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1 text-[10px]"
                        disabled={demoRefBusy}
                        onClick={() => void applyDemoAiReference()}
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        {demoRefBusy ? 'Загрузка…' : 'Демо: ИИ-референс'}
                      </Button>
                      <p className="text-[9px] leading-snug text-slate-500">
                        Тестовое фото вместо ручной загрузки; в проде подключается ваша модель генерации.
                      </p>
                    </div>
                  </details>
                ) : null}
              </div>
              {!sheetStorage ? (
                <div className="space-y-1.5 border-t border-slate-200/80 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <GitCompare className="h-3.5 w-3.5 shrink-0 text-teal-700" aria-hidden />
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      Сравнение с эталоном
                    </p>
                    <span
                      className="cursor-help text-[8px] font-normal normal-case text-slate-500"
                      title="Накладывает референс поверх подложки для визуальной проверки. Не входит в экспорт SVG силуэта."
                    >
                      ⓘ
                    </span>
                  </div>
                  <p className="text-[9px] leading-snug text-slate-600">
                    Наложение поверх подложки (прошлая партия, референс). Подгонка масштаба и сдвига — слайдерами ниже.
                  </p>
                  <Label htmlFor={sketchCompareInputId} className="text-[10px] text-slate-500">
                    {compareOverlayDataUrl ? 'Заменить эталон' : 'Файл эталона (jpg, png…)'}
                  </Label>
                  <Input
                    id={sketchCompareInputId}
                    type="file"
                    accept="image/*"
                    className="h-9 cursor-pointer text-xs"
                    disabled={readOnly}
                    onChange={(e) => void onPickCompareOverlay(e)}
                  />
                  {compareOverlayDataUrl ? (
                    <div className="space-y-2">
                      <p className="text-[9px] leading-snug text-slate-600">
                        Прозрачность, масштаб и смещение по полю.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] text-slate-600">Прозрачность: {compareOpacity}%</span>
                        <input
                          type="range"
                          min={15}
                          max={100}
                          value={compareOpacity}
                          disabled={readOnly}
                          className="h-2 w-[min(100%,12rem)] accent-teal-600"
                          onChange={(e) =>
                            onPatch({ categorySketchCompareOverlayOpacityPct: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] text-slate-600">Масштаб: {compareScalePct}%</span>
                        <input
                          type="range"
                          min={40}
                          max={200}
                          value={compareScalePct}
                          disabled={readOnly}
                          className="h-2 w-[min(100%,10rem)] accent-teal-600"
                          onChange={(e) =>
                            onPatch({ categorySketchCompareOverlayScalePct: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] text-slate-600">Сдвиг X: {compareOffsetXPct}%</span>
                        <input
                          type="range"
                          min={-40}
                          max={40}
                          value={compareOffsetXPct}
                          disabled={readOnly}
                          className="h-2 w-[min(100%,10rem)] accent-teal-600"
                          onChange={(e) =>
                            onPatch({ categorySketchCompareOffsetXPct: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] text-slate-600">Сдвиг Y: {compareOffsetYPct}%</span>
                        <input
                          type="range"
                          min={-40}
                          max={40}
                          value={compareOffsetYPct}
                          disabled={readOnly}
                          className="h-2 w-[min(100%,10rem)] accent-teal-600"
                          onChange={(e) =>
                            onPatch({ categorySketchCompareOffsetYPct: Number(e.target.value) })
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] text-slate-600"
                        disabled={readOnly}
                        onClick={clearCompareOverlay}
                      >
                        Убрать наложение
                      </Button>
                    </div>
                  ) : null}
                  {compareOverlayFileName ? (
                    <p className="truncate text-[9px] text-slate-500" title={compareOverlayFileName}>
                      {compareOverlayFileName}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {imageFileName || imageDataUrl ? (
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-2">
                  <span className="truncate text-[10px] text-slate-600" title={imageFileName ?? ''}>
                    {imageFileName?.trim()
                      ? imageFileName
                      : imageDataUrl
                        ? 'Своя подложка (без имени файла)'
                        : ''}
                    {!imageDataUrl && imageFileName ? ' · файл не сохранён (слишком большой)' : ''}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-red-600"
                    onClick={clearImage}
                  >
                    {sheetStorage ? 'Убрать подложку' : 'Вернуть типовой силуэт'}
                  </Button>
                </div>
              ) : null}
            </div>
          </details>

          <details className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/30">
            <summary className="cursor-pointer list-none px-2 py-2 text-[10px] font-semibold text-indigo-900 [&::-webkit-details-marker]:hidden">
              Черновики в углах поля (по желанию)
            </summary>
            <div className="space-y-2 border-t border-indigo-100 px-2 pb-2 pt-2">
            <p className="text-[10px] leading-snug text-indigo-900/80">
              До четырёх меток в углах с текущим цветом; лишнее удалите или сдвиньте.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[10px] border-indigo-200"
                disabled={readOnly || dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId)).length >= annotationLimit}
                onClick={addDraftSuggestedPins}
              >
                + Черновики (4 точки)
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-[10px] text-red-700"
                disabled={readOnly}
                onClick={removeDraftSuggestedPins}
              >
                Убрать черновики
              </Button>
            </div>
            </div>
          </details>

          <details className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-medium text-zinc-800 [&::-webkit-details-marker]:hidden">
              Печать, выгрузки, MES и ревизия (для отдела)
            </summary>
            <div className="border-t border-zinc-200 p-2">
          <Tabs defaultValue="handoff" className="w-full">
              <TabsList className="mb-2 flex h-auto min-h-9 w-full flex-wrap justify-start gap-0.5 rounded-md bg-white p-1">
                <TabsTrigger value="handoff" className="px-2 py-1.5 text-[10px]">
                  Документы и MES
                </TabsTrigger>
                {sketchTasksPanel ? (
                  <TabsTrigger value="tasks" className="px-2 py-1.5 text-[10px]">
                    Задачи L1→L3
                  </TabsTrigger>
                ) : null}
              </TabsList>
              <TabsContent value="handoff" className="mt-0 space-y-2 rounded-lg border border-zinc-200 bg-white p-2.5 text-[11px]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                  Ревизия · комплаенс · экспорт
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="space-y-0.5">
                    <span className="text-[9px] font-semibold text-zinc-500">Ревизия скетча</span>
                    <Input
                      className="h-8 text-[11px]"
                      value={categorySketchRevisionLabel ?? ''}
                      disabled={readOnly}
                      placeholder="A/B, номер"
                      onChange={(e) => onPatch({ categorySketchRevisionLabel: e.target.value || undefined })}
                    />
                  </label>
                  <label className="space-y-0.5">
                    <span className="text-[9px] font-semibold text-zinc-500">Заморозка до</span>
                    <Input
                      type="date"
                      className="h-8 text-[11px]"
                      value={categorySketchFreezeUntilDate ?? ''}
                      disabled={readOnly}
                      onChange={(e) => onPatch({ categorySketchFreezeUntilDate: e.target.value || undefined })}
                    />
                  </label>
                  <label className="space-y-0.5 sm:col-span-2">
                    <span className="text-[9px] font-semibold text-zinc-500">Утверждённый референс</span>
                    <Input
                      className="h-8 text-[11px]"
                      value={compliance.approvedReferenceUrl ?? ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        onPatch({
                          categorySketchCompliance: { ...compliance, approvedReferenceUrl: e.target.value || undefined },
                        })
                      }
                    />
                  </label>
                  <label className="space-y-0.5">
                    <span className="text-[9px] font-semibold text-zinc-500">Версия лекал</span>
                    <Input
                      className="h-8 text-[11px]"
                      value={compliance.patternPackVersion ?? ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        onPatch({
                          categorySketchCompliance: { ...compliance, patternPackVersion: e.target.value || undefined },
                        })
                      }
                    />
                  </label>
                  <label className="space-y-0.5">
                    <span className="text-[9px] font-semibold text-zinc-500">Акт образца</span>
                    <Input
                      className="h-8 text-[11px]"
                      value={compliance.sampleAcceptanceActRef ?? ''}
                      disabled={readOnly}
                      onChange={(e) =>
                        onPatch({
                          categorySketchCompliance: { ...compliance, sampleAcceptanceActRef: e.target.value || undefined },
                        })
                      }
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[10px]"
                    disabled={readOnly || !onAppendSketchRevisionSnapshot}
                    onClick={() => onAppendSketchRevisionSnapshot?.()}
                  >
                    Снимок ревизии в архив
                  </Button>
                  {categorySketchRevisionSnapshots.length > 0 ? (
                    <details className="max-w-full text-[10px] text-zinc-600">
                      <summary className="cursor-pointer font-medium text-zinc-700">
                        Архив ({categorySketchRevisionSnapshots.length})
                      </summary>
                      <ul className="mt-1 max-h-28 space-y-0.5 overflow-y-auto font-mono text-[9px]">
                        {[...categorySketchRevisionSnapshots].reverse().slice(0, 12).map((s) => (
                          <li key={s.snapshotId}>
                            {s.revisionLabel} · {s.annotations.length} мет. · {s.by} ·{' '}
                            {(() => {
                              try {
                                return new Date(s.at).toLocaleString('ru-RU');
                              } catch {
                                return s.at;
                              }
                            })()}
                          </li>
                        ))}
                      </ul>
                      {categorySketchRevisionSnapshots.length >= 2 ? (
                        <div className="mt-2 space-y-2 rounded-md border border-zinc-200 bg-zinc-50/90 p-2 text-[9px] text-zinc-800">
                          <p className="font-semibold text-zinc-900">Сравнение снимков A ↔ B</p>
                          <div className="flex flex-wrap gap-2">
                            <label className="flex flex-col gap-0.5">
                              <span className="text-[8px] uppercase text-zinc-500">Снимок A</span>
                              <select
                                className="h-8 max-w-[14rem] rounded border border-zinc-200 bg-white px-1 text-[9px]"
                                value={compareSnapIdA}
                                onChange={(e) => setCompareSnapIdA(e.target.value)}
                              >
                                <option value="">—</option>
                                {[...categorySketchRevisionSnapshots].reverse().map((s) => (
                                  <option key={s.snapshotId} value={s.snapshotId}>
                                    {s.revisionLabel} · {new Date(s.at).toLocaleDateString('ru-RU')}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="flex flex-col gap-0.5">
                              <span className="text-[8px] uppercase text-zinc-500">Снимок B</span>
                              <select
                                className="h-8 max-w-[14rem] rounded border border-zinc-200 bg-white px-1 text-[9px]"
                                value={compareSnapIdB}
                                onChange={(e) => setCompareSnapIdB(e.target.value)}
                              >
                                <option value="">—</option>
                                {[...categorySketchRevisionSnapshots].reverse().map((s) => (
                                  <option key={`b-${s.snapshotId}`} value={s.snapshotId}>
                                    {s.revisionLabel} · {new Date(s.at).toLocaleDateString('ru-RU')}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          {revisionDiff ? (
                            <div className="space-y-1 border-t border-zinc-200 pt-2 font-mono text-[8px] leading-snug">
                              <p>
                                Меток: {revisionDiff.countA} → {revisionDiff.countB}
                                {revisionDiff.leafMismatch ? (
                                  <span className="text-amber-700"> · разные ветки leafId</span>
                                ) : null}
                              </p>
                              <p>+ {revisionDiff.addedIds.length} id · − {revisionDiff.removedIds.length} id</p>
                              {revisionDiff.changed.length > 0 ? (
                                <table className="w-full border-collapse text-left">
                                  <thead>
                                    <tr className="border-b border-zinc-200">
                                      <th className="py-0.5 pr-1">annotationId</th>
                                      <th className="py-0.5">изменения</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {revisionDiff.changed.slice(0, 24).map((row) => (
                                      <tr key={row.annotationId} className="border-b border-zinc-100">
                                        <td className="py-0.5 pr-1 align-top">{row.annotationId.slice(0, 10)}…</td>
                                        <td className="py-0.5 align-top">
                                          {row.diffs.map((d) => (
                                            <span key={`${row.annotationId}-${d.field}`} className="mr-1 block">
                                              {d.field}: {d.from} → {d.to}
                                            </span>
                                          ))}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-zinc-500">Поля priority / stage / BOM ref совпадают.</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-zinc-500">Выберите два разных снимка.</p>
                          )}
                        </div>
                      ) : null}
                    </details>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-[10px]"
                    disabled={readOnly || !auditActor}
                    onClick={() =>
                      onPatch({
                        categorySketchProductionApproved: {
                          by: auditActor ?? '—',
                          at: new Date().toISOString(),
                        },
                      })
                    }
                  >
                    Утвердить для производства
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    disabled={exportBusy}
                    onClick={() => void handleExportPng()}
                  >
                    <ImageDown className="h-3.5 w-3.5" />
                    PNG
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    onClick={() => {
                      const norm = dataAnnotations
                        .filter((a) => sketchPinBelongsToLeaf(a, leafId))
                        .map(normalizeAnnotation);
                      void (async () => {
                        await openSketchA4Print({
                          title: exportFileNameStem?.trim() || currentLeaf.pathLabel || 'Скетч',
                          sku: (articleSku ?? exportFileNameStem ?? '—').trim(),
                          pathLabel: currentLeaf.pathLabel,
                          imageDataUrl: imageDataUrl ?? undefined,
                          annotations: norm,
                          leafId,
                          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
                          sceneCaption: printSceneCaption?.trim() || masterPrintSceneCaption,
                        });
                      })();
                    }}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Печать А4
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    onClick={() => {
                      const norm = dataAnnotations
                        .filter((a) => sketchPinBelongsToLeaf(a, leafId))
                        .map(normalizeAnnotation);
                      void (async () => {
                        await openSketchHandoffPackagePrint({
                          title: exportFileNameStem?.trim() || currentLeaf.pathLabel || 'Скетч',
                          sku: (articleSku ?? exportFileNameStem ?? '—').trim(),
                          pathLabel: currentLeaf.pathLabel,
                          revisionLabel: categorySketchRevisionLabel,
                          freezeUntilDate: categorySketchFreezeUntilDate,
                          productionApproved: categorySketchProductionApproved,
                          compliance,
                          imageDataUrl: imageDataUrl ?? undefined,
                          annotations: norm,
                          leafId,
                          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
                          sceneCaption: printSceneCaption?.trim() || masterPrintSceneCaption,
                          includePlmAppendix: true,
                          threadExcerptLines: 2,
                        });
                      })();
                    }}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Лист в цех
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    disabled={readOnly}
                    onClick={handleAppendPropagatedDrafts}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    В посадку / ОТК
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="h-8 gap-1 text-[10px]" onClick={handleCriticalCsv}>
                    <Download className="h-3.5 w-3.5" />
                    CSV критич.
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    onClick={handleMesQualityCsv}
                  >
                    <Download className="h-3.5 w-3.5" />
                    MES все
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    onClick={handleMesQcCsv}
                  >
                    <Download className="h-3.5 w-3.5" />
                    MES ОТК+крит.
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-[10px]"
                    disabled={webhookBusy || readOnly}
                    title={readOnly ? 'В режиме цеха отправка в MES отключена' : undefined}
                    onClick={() => void handleCriticalWebhook()}
                  >
                    <Send className="h-3.5 w-3.5" />
                    {webhookBusy ? '…' : 'В MES'}
                  </Button>
                </div>
                {mesTopCodesOnBoard.length > 0 ? (
                  <p className="text-[9px] leading-snug text-zinc-600">
                    <span className="font-semibold text-zinc-700">Топ кодов MES на доске:</span>{' '}
                    {mesTopCodesOnBoard
                      .map(
                        (x) =>
                          `${x.code} (${x.count})`
                      )
                      .join(', ')}
                  </p>
                ) : null}
                {lastExportSummary ? (
                  <p className="rounded border border-emerald-200 bg-emerald-50/80 px-2 py-1 text-[9px] text-emerald-950">
                    Последний экспорт / отправка: {lastExportSummary}
                  </p>
                ) : null}
                {sketchPropagatedDrafts.length > 0 ? (
                  <ul className="max-h-32 space-y-1 overflow-y-auto border-t border-zinc-100 pt-2 text-[10px]">
                    {sketchPropagatedDrafts.map((d) => (
                      <li key={d.draftId} className="flex justify-between gap-2 border-b border-zinc-50 pb-1">
                        <span className="min-w-0 text-zinc-700">
                          <span className="font-semibold text-teal-800">{d.kind === 'fit' ? 'Посадка' : 'ОТК'}:</span>{' '}
                          {d.text}
                        </span>
                        <Button type="button" variant="ghost" size="sm" className="h-6 shrink-0 text-[9px]" onClick={() => void navigator.clipboard.writeText(d.text)}>
                          Копир.
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </TabsContent>
              {sketchTasksPanel ? (
                <TabsContent value="tasks" className="mt-0 max-h-[min(85dvh,640px)] overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50/50 p-2">
                  {sketchTasksPanel}
                </TabsContent>
              ) : null}
            </Tabs>
            </div>
          </details>
        </div>

        <div className="min-w-0 flex flex-col gap-3 border-l border-zinc-200 pl-3 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto lg:pl-4">
          <div className="rounded-lg border border-slate-100 bg-white/80 p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Быстрые действия</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[10px]"
                onClick={() => activeId && updateAnnotation(activeId, { stage: 'sample', status: 'in_progress' })}
                disabled={readOnly || !activeId}
              >
                Пометить для посадки
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[10px]"
                onClick={() => activeId && updateAnnotation(activeId, { stage: 'qc', linkedQcZoneId: activeId })}
                disabled={readOnly || !activeId}
              >
                Пометить для ОТК
              </Button>
              {onNavigateStage ? (
                <>
                  <Button type="button" size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => onNavigateStage('fit')}>
                    Открыть посадку
                  </Button>
                  <Button type="button" size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => onNavigateStage('qc')}>
                    Открыть ОТК
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">Выбор метки</p>
          <div className="flex flex-wrap gap-1">
            {pinsOnLeaf.map((p, idx) => {
              const inFilter = visibleIds.has(p.annotationId);
              return (
                <button
                  key={p.annotationId}
                  type="button"
                  className={cn(
                    'flex h-9 min-w-9 items-center justify-center rounded-md border font-mono text-sm font-bold tabular-nums transition-colors',
                    activeAnn?.annotationId === p.annotationId
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50',
                    p.priority === 'critical' && activeAnn?.annotationId !== p.annotationId && 'border-rose-500',
                    p.stage === 'qc' &&
                      p.priority !== 'critical' &&
                      activeAnn?.annotationId !== p.annotationId &&
                      'border-amber-500',
                    !inFilter && activeAnn?.annotationId !== p.annotationId && 'border-dashed opacity-45'
                  )}
                  onClick={() => setActiveId(p.annotationId)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {!activeAnn ? (
            <p className="text-[11px] text-zinc-500">Нет меток на этом листе.</p>
          ) : (
            <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                <span className="font-mono text-xl font-bold tabular-nums tracking-tight text-zinc-900">
                  #{activeAnnIdx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[10px] text-red-600"
                  disabled={readOnly}
                  onClick={() => removeAnn(activeAnn.annotationId)}
                >
                  Удалить
                </Button>
              </div>

              <label className="block space-y-1">
                <span className="text-[9px] font-semibold uppercase text-zinc-500">Текст</span>
                <Textarea
                  className="min-h-[100px] text-sm"
                  placeholder="Что показать в этой точке…"
                  value={activeAnn.text}
                  disabled={readOnly}
                  onChange={(e) => updateAnnotation(activeAnn.annotationId, { text: e.target.value })}
                />
              </label>

              <div className="space-y-1">
                <span className="text-[9px] font-semibold uppercase text-zinc-500">Фото-доказательство</span>
                <div className="flex flex-wrap items-end gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="h-8 max-w-full cursor-pointer text-[10px]"
                    disabled={readOnly}
                    onChange={(e) => void onPickProofPhoto(activeAnn.annotationId, e)}
                  />
                  <select
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[10px]"
                    value={activeAnn.proofStatus ?? 'pending'}
                    disabled={readOnly || !activeAnn.proofPhotoDataUrl}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        proofStatus: e.target.value as 'pending' | 'accepted' | 'rejected',
                      })
                    }
                  >
                    <option value="pending">На проверке</option>
                    <option value="accepted">Принято</option>
                    <option value="rejected">Брак</option>
                  </select>
                </div>
                {activeAnn.proofPhotoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeAnn.proofPhotoDataUrl}
                    alt=""
                    className="max-h-40 max-w-full rounded border border-zinc-200 object-contain"
                  />
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Срок</span>
                  <Input
                    type="date"
                    className="h-8 text-[11px]"
                    value={activeAnn.dueDate ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { dueDate: e.target.value || undefined })
                    }
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Ответственный</span>
                  <Input
                    className="h-8 text-[11px]"
                    value={activeAnn.owner ?? ''}
                    disabled={readOnly}
                    onChange={(e) => updateAnnotation(activeAnn.annotationId, { owner: e.target.value })}
                    placeholder="ФИО"
                  />
                </label>
              </div>

              {attributeOptions.length > 0 ? (
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Связь с атрибутом ТЗ</span>
                  <select
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[11px]"
                    value={activeAnn.linkedAttributeId ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedAttributeId: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">Не связан</option>
                    {attributeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {!readOnly && attributeOptions.some((o) => o.id === 'mat') ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-7 w-full text-[9px]"
                  disabled={readOnly || activeAnn.linkedAttributeId === 'mat'}
                  onClick={() =>
                    updateAnnotation(activeAnn.annotationId, { linkedAttributeId: 'mat' })
                  }
                >
                  Связать с полем «Основной материал»
                </Button>
              ) : null}

              {taskSlotLabelOptions.length > 0 ? (
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Задача подкатегории</span>
                  <select
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[11px]"
                    value={activeAnn.linkedTaskId ?? ''}
                    disabled={readOnly}
                    title={
                      activeAnn.linkedTaskId
                        ? (taskSlotLabelById[activeAnn.linkedTaskId] ?? ORPHAN_LINKED_TASK_LABEL)
                        : undefined
                    }
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { linkedTaskId: e.target.value || undefined })
                    }
                  >
                    <option value="">Не связана</option>
                    {taskSlotLabelOptions.map((o) => (
                      <option key={o.slotId} value={o.slotId}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {taskSlotLabelOptions.length > 0 && activeAnn.linkedTaskId ? (
                <div className="space-y-2 rounded-md border border-indigo-100 bg-indigo-50/50 p-2 text-[10px] text-indigo-950">
                  <p className="leading-snug">
                    Блок задач:{' '}
                    <span className="font-semibold">
                      {taskSlotLabelById[activeAnn.linkedTaskId] ?? ORPHAN_LINKED_TASK_LABEL}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-7 text-[9px]"
                      disabled={readOnly}
                      onClick={() => {
                        const line = createAnnotationTaskLine(normalizeAnnotation(activeAnn));
                        const next = appendMasterPinLineToSlotWhatToDo(
                          subcategorySketchSlots,
                          activeAnn.linkedTaskId!,
                          line
                        );
                        onPatch({ subcategorySketchSlots: next });
                      }}
                    >
                      В «Что сделать»
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-[9px]"
                      disabled={readOnly}
                      onClick={() => {
                        const next = addAnnotationIdToSlotLinkedIds(
                          subcategorySketchSlots,
                          activeAnn.linkedTaskId!,
                          activeAnn.annotationId
                        );
                        onPatch({ subcategorySketchSlots: next });
                      }}
                    >
                      Привязать к задаче
                    </Button>
                  </div>
                </div>
              ) : null}

              {activeAnn.linkedAttributeId ? (
                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] font-semibold text-indigo-700 hover:underline"
                  onClick={() => {
                    const el = document.getElementById(`w2-attr-${activeAnn.linkedAttributeId}`);
                    if (el) {
                      setEditorOpen(false);
                      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                  }}
                >
                  <ArrowRight className="h-3 w-3" />
                  К полю в ТЗ
                </button>
              ) : null}

              <div className="space-y-2 rounded-md border border-violet-100 bg-violet-50/50 p-2">
                <span className="text-[9px] font-semibold uppercase text-violet-900">Раздел ТЗ и этап маршрута</span>
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Раздел досье (навигация)</span>
                  <select
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[11px]"
                    value={normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey) ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedTzSectionKey: (e.target.value || undefined) as Workshop2TzPanelSectionId | undefined,
                      })
                    }
                  >
                    <option value="">Не задан</option>
                    {(Object.keys(TZ_PANEL_SECTION_LABELS) as Workshop2TzPanelSectionId[]).map((k) => (
                      <option key={k} value={k}>
                        {TZ_PANEL_SECTION_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </label>
                {activeAnn.annotationType ? (
                  <div className="rounded border border-violet-200/90 bg-white/90 px-2 py-1.5 text-[10px] leading-snug text-violet-950">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-violet-900">
                      Матрица: тип «{TYPE_LABELS[activeAnn.annotationType]}»
                    </p>
                    <p className="mt-1 text-violet-900/95">{sketchTypeTzMatrixHint(activeAnn.annotationType)}</p>
                    {(() => {
                      const rec = recommendedTzSectionForSketchType(activeAnn.annotationType);
                      if (!rec) return null;
                      const matches =
                        normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey) === rec;
                      return (
                        <>
                          <p className="mt-1 text-[9px] text-zinc-600">
                            Рекомендуемый раздел ТЗ:{' '}
                            <span className="font-semibold text-zinc-800">{TZ_PANEL_SECTION_LABELS[rec]}</span>
                            {matches ? ' · совпадает с выбором' : ''}
                          </p>
                          {!readOnly && !matches ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-1.5 h-7 w-full text-[9px]"
                              onClick={() =>
                                updateAnnotation(activeAnn.annotationId, { linkedTzSectionKey: rec })
                              }
                            >
                              Подставить «{TZ_PANEL_SECTION_LABELS[rec]}»
                            </Button>
                          ) : null}
                        </>
                      );
                    })()}
                  </div>
                ) : null}
                {activeAnn.annotationType && attributeOptions.length > 0
                  ? (() => {
                      const sug = mergeSuggestedTzAttributeIdsForSketchType(
                        activeAnn.annotationType,
                        visualCatalogSketchLinks
                      );
                      const quick = attributeOptions.filter((o) => sug.includes(o.id));
                      if (!quick.length) return null;
                      return (
                        <div className="rounded border border-sky-200/90 bg-sky-50/60 px-2 py-1.5 text-[10px] text-sky-950">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-sky-900">
                            Поля каталога по типу метки
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {quick.map((o) => (
                              <Button
                                key={o.id}
                                type="button"
                                variant={activeAnn.linkedAttributeId === o.id ? 'default' : 'outline'}
                                size="sm"
                                className="h-7 max-w-full truncate px-2 text-[9px]"
                                disabled={readOnly}
                                title={o.id}
                                onClick={() =>
                                  updateAnnotation(activeAnn.annotationId, {
                                    linkedAttributeId: activeAnn.linkedAttributeId === o.id ? undefined : o.id,
                                  })
                                }
                              >
                                {o.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  : null}
                {onJumpToDossierSection && activeAnn.linkedTzSectionKey ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 w-full text-[9px]"
                    onClick={() => {
                      const nav = normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey);
                      if (nav) onJumpToDossierSection(nav);
                      setEditorOpen(false);
                    }}
                  >
                    Открыть раздел «{labelForStoredTzPanelSection(activeAnn.linkedTzSectionKey)}»
                  </Button>
                ) : null}
                <label className="block space-y-1">
                  <span className="text-[9px] font-semibold uppercase text-zinc-500">Этап маршрута SKU</span>
                  <select
                    className="h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-[11px]"
                    value={activeAnn.linkedRouteStageId ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, {
                        linkedRouteStageId: (e.target.value || undefined) as Workshop2TzSignoffStageId | undefined,
                      })
                    }
                  >
                    <option value="">Не задан</option>
                    {ROUTE_STAGE_NAV_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                {onNavigateRouteStage && activeAnn.linkedRouteStageId ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-full text-[9px]"
                    onClick={() => {
                      onNavigateRouteStage(activeAnn.linkedRouteStageId!);
                      setEditorOpen(false);
                    }}
                  >
                    Перейти к вкладке этапа
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-2 rounded-md border border-emerald-100 bg-emerald-50/50 p-2 sm:grid-cols-2">
                {bomLinePickOptions.length > 0 ? (
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-[9px] font-semibold uppercase text-emerald-900">
                      Строка из досье (BOM / материал)
                    </span>
                    <select
                      key={`${activeAnn.annotationId}-${activeAnn.linkedBomLineRef ?? ''}`}
                      className="h-8 w-full rounded-md border border-emerald-200/80 bg-white px-2 text-[11px] text-zinc-900"
                      disabled={readOnly}
                      defaultValue=""
                      aria-label="Подставить ref из заполненного BOM в досье"
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        updateAnnotation(activeAnn.annotationId, { linkedBomLineRef: v });
                      }}
                    >
                      <option value="">Выбрать из досье…</option>
                      {bomLinePickOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-[9px] font-semibold uppercase text-emerald-900">BOM / PLM — ref строки</span>
                  <Input
                    className="h-8 text-[11px]"
                    placeholder="ID строки BOM, PIM, PLM…"
                    value={activeAnn.linkedBomLineRef ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { linkedBomLineRef: e.target.value || undefined })
                    }
                  />
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-[9px] font-semibold text-emerald-900">Материал / узел (текст)</span>
                  <Input
                    className="h-8 text-[11px]"
                    placeholder="Ткань, фурнитура, узел…"
                    value={activeAnn.linkedMaterialNote ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { linkedMaterialNote: e.target.value || undefined })
                    }
                  />
                </label>
                {!sheetStorage ? (
                  <p className="sm:col-span-2 text-[9px] leading-snug text-emerald-900/90">
                    {(() => {
                      const st = classifyBomLineRef(
                        activeAnn.linkedBomLineRef,
                        baselineBomRefs,
                        liveBomRefs
                      );
                      if (st === 'empty') return null;
                      if (st === 'no_snapshot')
                        return 'Нет снимка ревизии в архиве — сверка ref с PLM по снимку недоступна; сделайте «Снимок ревизии в архив».';
                      if (st === 'in_baseline') return 'Ref входит в последний снимок ревизии.';
                      if (st === 'not_in_baseline')
                        return 'Ref не в последнем снимке (новая привязка или расхождение с архивом).';
                      return 'Ref в снимке и среди текущих ref на доске.';
                    })()}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2 rounded-md border border-amber-100 bg-amber-50/40 p-2 sm:grid-cols-2">
                <div className="flex flex-wrap gap-1 sm:col-span-2">
                  <span className="w-full text-[8px] font-semibold uppercase text-amber-900">Быстрая смена</span>
                  {MES_SHIFT_PRESETS.map((p) => (
                    <Button
                      key={p.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[9px]"
                      disabled={readOnly}
                      onClick={() => updateAnnotation(activeAnn.annotationId, { mesShiftId: p.value })}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold text-amber-950">Смена / партия (MES)</span>
                  <Input
                    className="h-8 text-[11px]"
                    placeholder="Смена А, 2026-04-01…"
                    value={activeAnn.mesShiftId ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { mesShiftId: e.target.value || undefined })
                    }
                  />
                  {(activeAnn.mesShiftId ?? '').trim() && !isValidMesShiftId(activeAnn.mesShiftId) ? (
                    <span className="text-[8px] text-rose-700">Формат: буквы, цифры, пробел, дефис, дата.</span>
                  ) : null}
                </label>
                <label className="space-y-1">
                  <span className="text-[9px] font-semibold text-amber-950">Код дефекта (иерархия)</span>
                  <select
                    className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[10px]"
                    value={activeAnn.mesDefectCode ?? ''}
                    disabled={readOnly}
                    onChange={(e) =>
                      updateAnnotation(activeAnn.annotationId, { mesDefectCode: e.target.value || undefined })
                    }
                  >
                    <option value="">—</option>
                    {mesDefectCatalogMerged.map((row) => (
                      <option key={row.code} value={row.code}>
                        {(row.parentCode ? '· ' : '') + row.code + ' — ' + row.label}
                      </option>
                    ))}
                  </select>
                </label>
                {activeAnn.mesDefectCode?.trim() ? (
                  <p className="sm:col-span-2 text-[9px] text-amber-950/90">
                    <span className="font-semibold">Цепочка:</span>{' '}
                    {defectBreadcrumbChain(mesDefectCatalogMerged, activeAnn.mesDefectCode)
                      .map((c) => `${c.code} (${c.label})`)
                      .join(' → ')}
                  </p>
                ) : null}
              </div>

              <SketchPinThreadPanel
                annotationId={activeAnn.annotationId}
                pinNumber={activeAnnIdx >= 0 ? activeAnnIdx + 1 : undefined}
                mesDefectCode={activeAnn.mesDefectCode}
                linkedQcZoneId={activeAnn.linkedQcZoneId}
                linkedBomLineRef={activeAnn.linkedBomLineRef}
                comments={activeAnn.sketchPinComments}
                actorLabel={auditActor?.trim() || 'Участник'}
                sku={articleSku}
                pathLabel={currentLeaf.pathLabel}
                readOnly={readOnly}
                threadResolved={activeAnn.sketchPinThreadResolved}
                threadLastReadAt={activeAnn.sketchPinThreadLastReadAt}
                sketchPageUrl={sketchPageUrl}
                onPatchThreadMeta={(patch) => updateAnnotation(activeAnn.annotationId, patch)}
                onReplaceComments={(next) =>
                  updateAnnotation(activeAnn.annotationId, { sketchPinComments: next })
                }
              />

              <details className="rounded-md border border-zinc-100 bg-zinc-50/80 p-2 text-[11px]">
                <summary className="cursor-pointer font-medium text-zinc-800">Тип, приоритет, этап, статус</summary>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Тип</span>
                    <select
                      className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[10px]"
                      value={activeAnn.annotationType ?? 'construction'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          annotationType: e.target.value as Workshop2SketchAnnotationType,
                        })
                      }
                    >
                      {Object.entries(TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Приоритет</span>
                    <select
                      className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[10px]"
                      value={activeAnn.priority ?? 'important'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          priority: e.target.value as Workshop2SketchAnnotationPriority,
                        })
                      }
                    >
                      {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Статус</span>
                    <select
                      className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[10px]"
                      value={activeAnn.status ?? 'new'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          status: e.target.value as Workshop2SketchAnnotationStatus,
                        })
                      }
                    >
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-[9px] text-zinc-500">Этап</span>
                    <select
                      className="h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-[10px]"
                      value={activeAnn.stage ?? 'tz'}
                      disabled={readOnly}
                      onChange={(e) =>
                        updateAnnotation(activeAnn.annotationId, {
                          stage: e.target.value as Workshop2SketchAnnotationStage,
                        })
                      }
                    >
                      {Object.entries(STAGE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </details>

              <details className="rounded-md border border-zinc-100 bg-zinc-50/80 p-2 text-[10px]">
                <summary className="cursor-pointer font-medium text-zinc-800">Групповое редактирование</summary>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    <Checkbox
                      className="h-4 w-4"
                      disabled={readOnly}
                      checked={batchSelectedIds.includes(activeAnn.annotationId)}
                      onCheckedChange={(v) => {
                        setBatchSelectedIds((ids) => {
                          if (v === true) {
                            return ids.includes(activeAnn.annotationId) ? ids : [...ids, activeAnn.annotationId];
                          }
                          return ids.filter((x) => x !== activeAnn.annotationId);
                        });
                      }}
                    />
                    <span className="text-zinc-600">Включить текущую в группу ({batchSelectedIds.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['critical', 'important', 'note'] as const).map((p) => (
                      <Button
                        key={p}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[9px]"
                        disabled={readOnly || batchSelectedIds.length === 0}
                        onClick={() => batchApplyPriority(p)}
                      >
                        {PRIORITY_LABELS[p]}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['tz', 'sample', 'prelaunch', 'release', 'qc'] as const).map((s) => (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[9px]"
                        disabled={readOnly || batchSelectedIds.length === 0}
                        onClick={() => batchApplyStage(s)}
                      >
                        {STAGE_LABELS[s]}
                      </Button>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>

      <details className="rounded-lg border border-violet-100 bg-violet-50/40 p-2">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700 [&::-webkit-details-marker]:hidden">
          <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
          Дополнительно: промпт ИИ и брендбук
          <span className="font-normal normal-case text-slate-500">— если пользуетесь Midjourney, Krea…</span>
        </summary>
        <div className="mt-2 space-y-2 border-t border-violet-100/80 pt-2">
          <p className="text-[9px] leading-snug text-slate-600">
            Брендбук попадает в текст промпта жёстче, чем свободные подсказки ниже.
          </p>
          <label className="block space-y-1">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-600">
              Брендбук (палитра, силуэт, запреты)
            </span>
            <Textarea
              className="min-h-[56px] text-[11px]"
              placeholder="Напр. только матовые ткани; без клея по лицу; запрет на контрастный top-stitch…"
              value={sketchBrandbookConstraints ?? ''}
              disabled={readOnly}
              onChange={(e) => onPatch({ sketchBrandbookConstraints: e.target.value || undefined })}
            />
          </label>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-[10px] border-violet-200"
              onClick={() => void copyAiPrompt()}
            >
              <Copy className="h-3 w-3" />
              {aiCopied ? 'Скопировано' : 'Копировать промпт'}
            </Button>
          </div>
          <label className="block space-y-1">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-600">
              Свои уточнения к промпту
            </span>
            <Textarea
              className="min-h-[72px] text-[11px]"
              placeholder="Капюшон, длина, ворот, карманы…"
              value={aiExtraHints}
              onChange={(e) => setAiExtraHints(e.target.value)}
            />
          </label>
          <details className="rounded border border-violet-100/80 bg-white/50 p-2 text-[10px] text-slate-600">
            <summary className="cursor-pointer font-medium text-slate-700">
              Техническое: полный текст промпта и интеграция в код
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded border border-slate-100 bg-white p-2 text-[10px] leading-snug text-slate-800">
              {aiPromptText}
            </pre>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 text-[10px]"
                onClick={() => void copyAiPrompt()}
              >
                Копировать этот блок целиком
              </Button>
            </div>
            <p className="mt-2 text-[9px] leading-snug text-slate-500">
              Демо «ИИ-референс» и <code className="rounded bg-slate-100 px-0.5">requestCatalogImageGeneration</code> берут
              тот же собранный текст (<code className="rounded bg-slate-100 px-0.5">aiPromptText</code>), включая брендбук
              из досье. См. <code className="rounded bg-slate-100 px-0.5">catalog-image-gen.ts</code>.
            </p>
          </details>
        </div>
      </details>

      {!sheetStorage && (sketchMasterAnnotationAuditLog?.length ?? 0) > 0 ? (
        <details className="rounded-lg border border-slate-200 bg-white p-2 text-[10px]">
          <summary className="cursor-pointer font-medium text-slate-700">
            Журнал изменений меток (последние {Math.min(15, sketchMasterAnnotationAuditLog.length)})
          </summary>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-slate-600">
            {sketchMasterAnnotationAuditLog.slice(-15).reverse().map((e) => (
              <li key={e.entryId} className="border-b border-slate-100 pb-1 font-mono text-[9px] leading-snug">
                <span className="text-slate-400">
                  {(() => {
                    try {
                      return new Date(e.at).toLocaleString('ru-RU');
                    } catch {
                      return e.at;
                    }
                  })()}
                </span>{' '}
                · {e.by} · {e.summary}
                {e.annotationId && !e.annotationId.startsWith('__') ? (
                  <span className="text-slate-400"> · {e.annotationId.slice(0, 8)}…</span>
                ) : e.action === 'revision_snapshot' ? (
                  <span className="text-slate-400"> · PLM</span>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <p className="text-[10px] leading-snug text-slate-500">
        Слой для посадки, ОТК и задач цеха; при смене категории — только метки текущего листа.
      </p>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          {showPassportSectionHeader ? (
            <>
              <p className="text-sm font-semibold text-slate-900">Скетч по категории</p>
              <p className="text-[11px] leading-snug text-slate-600">
                Редактор в модальном окне; силуэт и метки по ветке L1–L3.
              </p>
            </>
          ) : null}
          <p className="truncate text-[11px] font-medium text-slate-700" title={sketchCatalogCaption}>
            {sketchCatalogCaption}
          </p>
        </div>
        <div className="flex w-full flex-none flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <input
            ref={previewSketchFileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={(e) => void onPickImage(e)}
          />
          <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-600 shadow-sm tabular-nums">
            {counters.total} / {annotationLimit} меток
          </span>
          <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold text-rose-700">
            {counters.critical} критично
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 min-w-[9.5rem] flex-1 gap-1.5 text-xs sm:flex-initial"
            disabled={readOnly}
            title={readOnly ? 'В режиме цеха загрузка отключена' : 'Заменить типовой силуэт своим фото'}
            onClick={() => previewSketchFileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Загрузить скетч
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-9 min-w-[9.5rem] flex-1 gap-1.5 text-xs sm:flex-initial"
            onClick={() => setEditorOpen(true)}
          >
            <Expand className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Открыть скетч
          </Button>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setEditorOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setEditorOpen(true);
          }
        }}
        className="group block w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:border-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/3] w-full min-h-[14rem] overflow-hidden bg-white sm:min-h-[min(56vh,32rem)]">
          {imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL из досье
            <img src={imageDataUrl} alt="Подложка скетча" className="h-full w-full object-contain" />
          ) : (
            <CategorySketchTemplateSvg leaf={currentLeaf} sketchContext={sketchContext} className="h-full w-full" />
          )}
          {dataAnnotations
            .map(normalizeAnnotation)
            .filter((a) => sketchPinBelongsToLeaf(a, leafId))
            .slice(0, 8)
            .map((a, idx) => (
              <Tooltip key={a.annotationId} delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'pointer-events-auto absolute z-[15] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-zinc-50 font-mono text-[11px] font-bold tabular-nums text-zinc-900 shadow-sm transition-transform hover:scale-105',
                      a.priority === 'critical'
                        ? 'border-rose-600'
                        : a.stage === 'qc'
                          ? 'border-amber-500'
                          : 'border-zinc-400'
                    )}
                    style={{ left: `${a.xPct}%`, top: `${a.yPct}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(a.annotationId);
                      setEditorOpen(true);
                    }}
                    aria-label={`Метка ${idx + 1}, наведите для комментария`}
                  >
                    {idx + 1}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="border-slate-200 bg-white p-3 text-popover-foreground shadow-lg"
                >
                  <CategorySketchPinHoverCard
                  annotation={a}
                  index={idx}
                  attributeOptions={attributeOptions}
                  taskSlotLabelById={taskSlotLabelById}
                />
                </TooltipContent>
              </Tooltip>
            ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-slate-900/70 to-transparent px-3 py-2 text-white">
            <span className="truncate text-[10px] font-bold uppercase tracking-widest" title={sketchCatalogCaption}>
              {sketchCatalogCaption}
            </span>
            <span className="shrink-0 text-[10px] opacity-90 group-hover:underline">Открыть редактор</span>
          </div>
        </div>
      </div>

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setPlaceMode(false);
        }}
      >
        <DialogContent className="overflow-hidden p-0 sm:max-w-6xl" ariaTitle="Скетч по категории">
          <div className="border-b border-slate-100 bg-white px-6 py-4">
            <DialogHeader>
              <DialogTitle>Скетч по категории</DialogTitle>
              <DialogDescription>
                Рабочее окно для меток и комментариев: {sketchCatalogCaption}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="max-h-[85vh] overflow-y-auto bg-slate-50/40 p-6">{editorBody}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
