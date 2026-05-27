'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type Dispatch,
  type LegacyRef,
  type ReactNode,
  type Ref,
  type SetStateAction,
} from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  CategorySketchAnnotator,
  type CategorySketchAnnotatorContext,
  type CategorySketchAnnotatorHandle,
} from '@/components/brand/production/CategorySketchAnnotator';
import { SketchCompareMiniBoard } from '@/components/brand/production/category-sketch-sheets-block-compare-mini-board';
import { WORKFLOW_STATUS_LABEL } from '@/components/brand/production/category-sketch-sheets-block-constants';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1SketchSheet,
  Workshop2SketchSheetViewKind,
  Workshop2SketchSheetWorkflowStatus,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchSheetQualityHints } from '@/lib/production/sketch-quality-hints';
import type { VisualCatalogSketchLinkRow } from '@/lib/production/workshop2-sketch-tz-matrix';
import {
  appendOrgSketchPinTemplate,
  readOrgSketchPinTemplatesSync,
} from '@/lib/production/sketch-org-templates-repository';
import {
  appendSketchPinTemplate,
  applySketchPinTemplateToSheet,
  createSketchPinTemplateRecord,
  resolveSketchPinTemplatePick,
} from '@/lib/production/workshop2-sketch-pin-templates';
import {
  appendImportedLegacySheets,
  createEmptySketchSheet,
  defaultExtraSketchSheetTitle,
  duplicateSketchSheet,
  MAX_ANNOTATIONS_PER_SKETCH_SHEET,
  MAX_SKETCH_SHEETS,
  moveSketchSheet,
  normalizeSketchSheets,
  patchSketchSheet,
  removeSketchSheet,
  SKETCH_PIN_SNIPPETS_BY_VIEW,
  SKETCH_SHEET_VIEW_LABELS,
} from '@/lib/production/workshop2-sketch-sheets';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Columns2,
  Copy,
  Layers,
  Trash2,
} from 'lucide-react';

function newUuid(): string {
  return crypto.randomUUID();
}

const VIEW_KINDS = Object.keys(SKETCH_SHEET_VIEW_LABELS) as Workshop2SketchSheetViewKind[];

type Props = {
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  sketchContext?: CategorySketchAnnotatorContext;
  masterSketchAnnotations?: Workshop2Phase1CategorySketchAnnotation[];
  /** SKU для печати А4 и подписей экспорта на листах. */
  articleSku?: string;
  /** Id коллекции — библиотека шаблонов в localStorage (см. sketch-org-templates-repository). */
  collectionId?: string;
  /** Счётчик мутаций org-шаблонов из родителя (обновление списка). */
  sketchOrgLibraryRevision?: number;
  onOrgSketchTemplatesMutated?: () => void;
  /** Подпись для утверждения скетча и аудита (как на общей доске). */
  auditActor?: string;
  /** Режим цеха (как у мастер-скетча): без правок структуры листов и полей. */
  sketchViewFloor: boolean;
  /** Родитель задаёт активный лист и скрывает дублирующий ряд кнопок-ячеек («Общий + листы» в одной зоне). */
  embeddedPicker?: {
    activeSheetId: string;
    onActiveSheetChange: (sheetId: string) => void;
  };
  /** Левая колонка «Общий + листы» (например W2SketchThumbRail), если родитель уже рисует её снаружи. */
  sketchSheetsRail?: ReactNode;
  /** Скрыть горизонтальный ряд мини-кнопок листов в карточке «Какой лист…» — выбор только из sketchSheetsRail. */
  hideSheetThumbnailRail?: boolean;
  /** Варианты BOM ref из досье — см. CategorySketchAnnotator. */
  bomLinePickOptions?: readonly { value: string; label: string }[];
  /** Сквозная навигация с метки листа — как у master-скетча в досье. */
  onJumpToDossierSection?: (section: Workshop2TzPanelSectionId) => void;
  onNavigateRouteStage?: (stage: Workshop2TzSignoffStageId) => void;
  /** Подсветка полей каталога «Визуал» при выборе метки на скетче. */
  visualCatalogAttributeIds?: readonly string[];
  visualCatalogSketchLinks?: readonly VisualCatalogSketchLinkRow[];
  onVisualCatalogSuggestFromSketch?: (ids: string[]) => void;
  /** Реф на редактор листа — кнопка «Открыть скетч» в шапке досье. */
  /** Ref на активный листовый аннотатор (совместим с `useRef<T | null>`). */
  sketchToolbarEditorRef?: Ref<CategorySketchAnnotatorHandle | null>;
};

export function CategorySketchSheetsBlock({
  currentLeaf,
  dossier,
  setDossier,
  sketchContext,
  masterSketchAnnotations = [],
  articleSku,
  collectionId,
  sketchOrgLibraryRevision = 0,
  onOrgSketchTemplatesMutated,
  auditActor,
  sketchViewFloor,
  embeddedPicker,
  sketchSheetsRail,
  hideSheetThumbnailRail = false,
  bomLinePickOptions,
  onJumpToDossierSection,
  onNavigateRouteStage,
  visualCatalogAttributeIds,
  visualCatalogSketchLinks,
  onVisualCatalogSuggestFromSketch,
  sketchToolbarEditorRef,
}: Props) {
  const sheetChromeReadOnly = sketchViewFloor;
  const leafId = currentLeaf.leafId;
  const sheets = useMemo(() => normalizeSketchSheets(dossier.sketchSheets), [dossier.sketchSheets]);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const resolvedSheetId = embeddedPicker?.activeSheetId ?? activeSheetId;

  const pickSheet = useCallback(
    (id: string) => {
      if (embeddedPicker) embeddedPicker.onActiveSheetChange(id);
      else setActiveSheetId(id);
    },
    [embeddedPicker]
  );
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePeerId, setComparePeerId] = useState<string | null>(null);
  const [compareZoom, setCompareZoom] = useState(1);
  const [sheetTemplatePickId, setSheetTemplatePickId] = useState('');
  const { toast } = useToast();

  const legacySlots = dossier.subcategorySketchSlots;
  const canImportLegacy = useMemo(() => {
    const slots = legacySlots ?? [];
    return slots.some(
      (s) =>
        Boolean(s.imageDataUrl) ||
        (s.annotations?.length ?? 0) > 0 ||
        [s.productionTasks?.whatToDo, s.productionTasks?.watchAttention].some((t) =>
          String(t ?? '').trim()
        )
    );
  }, [legacySlots]);

  useEffect(() => {
    if (embeddedPicker) return;
    if (sheets.length === 0) {
      setActiveSheetId(null);
      return;
    }
    if (!activeSheetId || !sheets.some((s) => s.sheetId === activeSheetId)) {
      setActiveSheetId(sheets[0]!.sheetId);
    }
  }, [sheets, activeSheetId, embeddedPicker]);

  const activeSheet = useMemo(
    () => (resolvedSheetId ? sheets.find((s) => s.sheetId === resolvedSheetId) : undefined),
    [sheets, resolvedSheetId]
  );

  const masterPinsForLeaf = useMemo(
    () => masterSketchAnnotations.filter((a) => a.categoryLeafId === leafId),
    [leafId, masterSketchAnnotations]
  );

  const sheetQualityHints = useMemo(
    () => (activeSheet ? sketchSheetQualityHints(activeSheet, leafId) : []),
    [activeSheet, leafId]
  );

  const backViewQcHint = useMemo(() => {
    if (!activeSheet || activeSheet.viewKind !== 'back') return null;
    const pins = activeSheet.annotations.filter((a) => a.categoryLeafId === leafId);
    if (pins.length === 0) return null;
    const hasQc = pins.some((a) => (a.stage ?? 'tz') === 'qc');
    if (hasQc) return null;
    return 'На виде «Спина» нет меток с этапом ОТК — при необходимости добавьте контрольные точки.';
  }, [activeSheet, leafId]);

  const pinSnippetsForActive = useMemo(() => {
    const k = activeSheet?.viewKind ?? 'other';
    return SKETCH_PIN_SNIPPETS_BY_VIEW[k] ?? SKETCH_PIN_SNIPPETS_BY_VIEW.other;
  }, [activeSheet?.viewKind]);

  const exportStem = useMemo(() => {
    if (!activeSheet) return 'sketch-sheet';
    const t = (activeSheet.title ?? SKETCH_SHEET_VIEW_LABELS[activeSheet.viewKind ?? 'other'])
      .replace(/[^a-zA-Zа-яА-ЯёЁ0-9_-]+/g, '-')
      .slice(0, 40);
    return `sheet-${t || activeSheet.sheetId.slice(0, 8)}`;
  }, [activeSheet]);

  const sheetPrintSceneCaption = useMemo(() => {
    if (!activeSheet) return undefined;
    const parts = [
      activeSheet.sceneId?.trim() && `сцена ${activeSheet.sceneId.trim()}`,
      activeSheet.viewKind && `вид: ${SKETCH_SHEET_VIEW_LABELS[activeSheet.viewKind ?? 'other']}`,
    ].filter(Boolean) as string[];
    return parts.length ? parts.join(' · ') : undefined;
  }, [activeSheet]);

  const sceneMismatch = useMemo(() => {
    if (!activeSheet) return null;
    const mid = dossier.categorySketchSceneId?.trim();
    const sid = activeSheet.sceneId?.trim();
    if (mid && sid && mid !== sid) return 'id' as const;
    const mv = dossier.categorySketchSceneView;
    const sv = activeSheet.viewKind;
    if (mv && sv && mv !== sv) return 'view' as const;
    return null;
  }, [activeSheet, dossier.categorySketchSceneId, dossier.categorySketchSceneView]);

  useEffect(() => {
    if (sheets.length === 0) return;
    const current = embeddedPicker?.activeSheetId ?? activeSheetId;
    if (!current || !sheets.some((s) => s.sheetId === current)) {
      const next = sheets[0]!.sheetId;
      if (embeddedPicker) embeddedPicker.onActiveSheetChange(next);
      else setActiveSheetId(next);
    }
  }, [sheets, activeSheetId, embeddedPicker]);

  const orgSketchTemplatesForSheet = useMemo(
    () => readOrgSketchPinTemplatesSync(collectionId),
    [collectionId, sketchOrgLibraryRevision]
  );

  const addSheet = useCallback(() => {
    let newId = '';
    setDossier((p) => {
      const cur = normalizeSketchSheets(p.sketchSheets);
      if (cur.length >= MAX_SKETCH_SHEETS) return p;
      const sheet = createEmptySketchSheet(defaultExtraSketchSheetTitle(cur.length));
      newId = sheet.sheetId;
      return { ...p, sketchSheets: [...cur, sheet] };
    });
    if (newId) pickSheet(newId);
  }, [pickSheet, setDossier]);

  const deleteActiveSheet = useCallback(() => {
    if (!resolvedSheetId) return;
    if (!window.confirm('Удалить этот скетч-лист вместе с подложкой и метками?')) return;
    setDossier((p) => ({ ...p, sketchSheets: removeSketchSheet(p.sketchSheets, resolvedSheetId) }));
  }, [resolvedSheetId, setDossier]);

  const patchActive = useCallback(
    (patch: Partial<Omit<Workshop2Phase1SketchSheet, 'sheetId'>>) => {
      if (!resolvedSheetId) return;
      setDossier((p) => ({
        ...p,
        sketchSheets: patchSketchSheet(p.sketchSheets, resolvedSheetId, patch),
      }));
    },
    [resolvedSheetId, setDossier]
  );

  const importMasterPins = useCallback(() => {
    if (!activeSheet || masterPinsForLeaf.length === 0) return;
    const own = activeSheet.annotations.filter((a) => a.categoryLeafId === leafId);
    const room = MAX_ANNOTATIONS_PER_SKETCH_SHEET - own.length;
    if (room <= 0) return;
    const copies = masterPinsForLeaf.slice(0, room).map((a) => ({
      ...a,
      annotationId: newUuid(),
      linkedTaskId: undefined,
      linkedQcZoneId: undefined,
      linkedAttributeId: undefined,
    }));
    patchActive({ annotations: [...activeSheet.annotations, ...copies] });
  }, [activeSheet, leafId, masterPinsForLeaf, patchActive]);

  const duplicateActiveFixed = useCallback(
    (mode: 'full' | 'pinsOnly') => {
      if (!activeSheet) return;
      let newId = '';
      setDossier((p) => {
        const cur = normalizeSketchSheets(p.sketchSheets);
        if (cur.length >= MAX_SKETCH_SHEETS) return p;
        const copy = duplicateSketchSheet(activeSheet, mode);
        newId = copy.sheetId;
        return { ...p, sketchSheets: [...cur, copy] };
      });
      if (newId) pickSheet(newId);
    },
    [activeSheet, pickSheet, setDossier]
  );

  const moveActive = useCallback(
    (dir: -1 | 1) => {
      if (!resolvedSheetId) return;
      setDossier((p) => ({
        ...p,
        sketchSheets: moveSketchSheet(p.sketchSheets, resolvedSheetId, dir),
      }));
    },
    [resolvedSheetId, setDossier]
  );

  const goPrevSheet = useCallback(() => {
    if (!resolvedSheetId) return;
    const idx = sheets.findIndex((s) => s.sheetId === resolvedSheetId);
    if (idx <= 0) return;
    pickSheet(sheets[idx - 1]!.sheetId);
  }, [resolvedSheetId, sheets, pickSheet]);

  const goNextSheet = useCallback(() => {
    if (!resolvedSheetId) return;
    const idx = sheets.findIndex((s) => s.sheetId === resolvedSheetId);
    if (idx < 0 || idx >= sheets.length - 1) return;
    pickSheet(sheets[idx + 1]!.sheetId);
  }, [resolvedSheetId, sheets, pickSheet]);

  const openCompareDialog = useCallback(() => {
    if (sheets.length < 2 || !resolvedSheetId) return;
    const buddy = sheets.find((s) => s.sheetId !== resolvedSheetId);
    setComparePeerId(buddy?.sheetId ?? null);
    setCompareZoom(1);
    setCompareOpen(true);
  }, [sheets, resolvedSheetId]);

  const saveActiveSheetPinTemplate = useCallback(() => {
    if (!activeSheet) return;
    const name = window.prompt('Название шаблона меток с этого листа', '')?.trim();
    if (!name) return;
    const own = activeSheet.annotations.filter((a) => a.categoryLeafId === leafId);
    if (own.length === 0) {
      toast({
        title: 'Нет меток',
        description: 'На этом листе нет меток для текущей ветки каталога.',
        variant: 'destructive',
      });
      return;
    }
    setDossier(
      (p) =>
        appendSketchPinTemplate(p, {
          name,
          viewKind: activeSheet.viewKind,
          sourceLeafId: leafId,
          annotations: activeSheet.annotations,
        }).dossier
    );
    toast({ title: 'Шаблон сохранён', description: name });
  }, [activeSheet, leafId, setDossier, toast]);

  const applySheetPinTemplate = useCallback(
    (mode: 'merge' | 'replace') => {
      if (!resolvedSheetId) return;
      const tid = sheetTemplatePickId.trim();
      if (!tid) return;
      const org = readOrgSketchPinTemplatesSync(collectionId);
      const t = resolveSketchPinTemplatePick(tid, dossier, org);
      if (!t) return;
      setDossier((p) => applySketchPinTemplateToSheet(p, resolvedSheetId, t, leafId, mode));
      toast({
        title: mode === 'merge' ? 'Метки добавлены из шаблона' : 'Метки листа заменены шаблоном',
        description: t.name,
      });
    },
    [resolvedSheetId, collectionId, dossier, leafId, setDossier, sheetTemplatePickId, toast]
  );

  const saveActiveSheetPinTemplateToOrg = useCallback(() => {
    const cid = String(collectionId ?? '').trim();
    if (!cid) {
      toast({
        title: 'Нет коллекции',
        description: 'Нужен id коллекции для библиотеки в этом браузере.',
        variant: 'destructive',
      });
      return;
    }
    if (!activeSheet) return;
    const name = window.prompt('Имя в библиотеке коллекции', '')?.trim();
    if (!name) return;
    const own = activeSheet.annotations.filter((a) => a.categoryLeafId === leafId);
    if (own.length === 0) {
      toast({
        title: 'Нет меток',
        description: 'На этом листе нет меток для текущей ветки каталога.',
        variant: 'destructive',
      });
      return;
    }
    const t = createSketchPinTemplateRecord({
      name,
      viewKind: activeSheet.viewKind,
      sourceLeafId: leafId,
      annotations: activeSheet.annotations,
    });
    void appendOrgSketchPinTemplate(cid, t).then(() => {
      onOrgSketchTemplatesMutated?.();
      toast({ title: 'В библиотеке коллекции', description: name });
    });
  }, [activeSheet, collectionId, leafId, onOrgSketchTemplatesMutated, toast]);

  const importLegacySlots = useCallback(() => {
    if (!canImportLegacy) return;
    if (
      !window.confirm(
        'Импортировать старые мини-скетчи трёх шагов ветки каталога (бывшие слоты 1–3) как отдельные скетч-листы? Старые данные в JSON останутся; при необходимости удалите дубликаты вручную.'
      )
    ) {
      return;
    }
    setDossier((p) => ({
      ...p,
      sketchSheets: appendImportedLegacySheets(p.sketchSheets, p.subcategorySketchSlots),
    }));
  }, [canImportLegacy, setDossier]);

  if (sheets.length === 0) {
    return (
      <div className="space-y-4">
        {canImportLegacy ? (
          <details className="rounded-lg border border-amber-200 bg-amber-50/50">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-amber-950 [&::-webkit-details-marker]:hidden">
              Импорт старых мини-скетчей (3 слота ветки) в листы
            </summary>
            <div className="flex flex-wrap items-center gap-2 border-t border-amber-100 px-3 py-3">
              <Layers className="h-4 w-4 shrink-0 text-amber-800" aria-hidden />
              <span className="text-sm text-amber-900/90">
                Перенос данных из бывших слотов 1–3 в отдельные листы.
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                disabled={sheetChromeReadOnly}
                onClick={importLegacySlots}
              >
                Импортировать в скетч-листы
              </Button>
            </div>
          </details>
        ) : null}
        <div className="space-y-3">
          <p className="text-text-secondary text-sm leading-snug">
            Дополнительные скетч-листы: анфас, спина, деталь, фото — своя подложка и метки к
            текущему листу каталога.
          </p>
          <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 text-xs"
              disabled={sheetChromeReadOnly}
              onClick={addSheet}
            >
              + {defaultExtraSketchSheetTitle(0)}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeIndexAll = resolvedSheetId
    ? sheets.findIndex((s) => s.sheetId === resolvedSheetId)
    : -1;
  const comparePeerSheet = comparePeerId
    ? sheets.find((s) => s.sheetId === comparePeerId)
    : undefined;

  const mainColumn = (
    <div className="space-y-4">
      {canImportLegacy ? (
        <details className="rounded-lg border border-amber-200 bg-amber-50/50">
          <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-amber-950 [&::-webkit-details-marker]:hidden">
            Импорт старых трёх слотов ветки в листы
          </summary>
          <div className="flex flex-wrap items-center gap-2 border-t border-amber-100 px-3 py-3 text-amber-900/90">
            <Layers className="h-4 w-4 shrink-0 text-amber-800" aria-hidden />
            <span className="text-sm">Перенести старые слоты в листы (копия данных).</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              disabled={sheetChromeReadOnly}
              onClick={importLegacySlots}
            >
              Импортировать
            </Button>
          </div>
        </details>
      ) : null}

      <div className="border-border-default space-y-2 rounded-xl border bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="border-border-default bg-bg-surface2 flex h-9 shrink-0 items-center gap-0.5 rounded-lg border px-0.5"
            role="group"
            aria-label="Переключение листа"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              disabled={activeIndexAll <= 0 || sheets.length < 2}
              title="Предыдущий лист"
              onClick={goPrevSheet}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </Button>
            {sheets.length > 0 ? (
              <span className="text-text-secondary flex h-9 min-w-[2.75rem] items-center justify-center px-1 text-center text-[10px] font-semibold tabular-nums">
                {activeIndexAll >= 0 ? activeIndexAll + 1 : '—'} / {sheets.length}
              </span>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              disabled={activeIndexAll < 0 || activeIndexAll >= sheets.length - 1}
              title="Следующий лист"
              onClick={goNextSheet}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
          {activeSheet ? (
            <div className="min-w-0 max-w-[min(100%,20rem)] flex-1 basis-[10rem]">
              <Label htmlFor="sketch-sheet-title-inline" className="sr-only">
                Название листа
              </Label>
              <Input
                id="sketch-sheet-title-inline"
                className="h-9 text-xs"
                value={activeSheet.title ?? ''}
                placeholder="Название листа"
                readOnly={sheetChromeReadOnly}
                onChange={(e) => patchActive({ title: e.target.value })}
              />
            </div>
          ) : null}
          <div
            className="border-border-default bg-bg-surface2/80 flex h-9 shrink-0 items-center gap-0.5 rounded-lg border px-0.5"
            title="Порядок листов в общем списке досье"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              disabled={activeIndexAll <= 0 || sheetChromeReadOnly}
              aria-label="Выше в общем списке листов"
              onClick={() => moveActive(-1)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              disabled={
                activeIndexAll < 0 || activeIndexAll >= sheets.length - 1 || sheetChromeReadOnly
              }
              aria-label="Ниже в общем списке листов"
              onClick={() => moveActive(1)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          {!hideSheetThumbnailRail ? (
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {sheets.map((s) => {
                const n = s.annotations.filter((a) => a.categoryLeafId === leafId).length;
                const idxAll = Math.max(
                  0,
                  sheets.findIndex((x) => x.sheetId === s.sheetId)
                );
                const label = (s.title?.trim() || defaultExtraSketchSheetTitle(idxAll)).slice(
                  0,
                  28
                );
                return (
                  <button
                    key={s.sheetId}
                    type="button"
                    onClick={() => pickSheet(s.sheetId)}
                    className={cn(
                      'inline-flex h-9 min-h-9 max-w-[180px] items-center gap-1.5 rounded-lg border px-2.5 text-left text-xs font-medium transition-colors',
                      s.sheetId === resolvedSheetId
                        ? 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary shadow-sm'
                        : 'border-border-default bg-bg-surface2/80 text-text-primary hover:border-border-default hover:bg-white'
                    )}
                  >
                    <span className="truncate">{label}</span>
                    {s.sceneId?.trim() ? (
                      <span
                        className="shrink-0 font-mono text-[9px] text-teal-700"
                        title="ID сцены"
                      >
                        {s.sceneId.trim().slice(0, 6)}
                      </span>
                    ) : null}
                    {n > 0 ? (
                      <span className="text-text-secondary shrink-0 rounded-full bg-white/90 px-1.5 text-[10px] font-bold tabular-nums">
                        {n}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-rose-200 bg-white text-xs font-medium text-rose-800 hover:bg-rose-50 hover:text-rose-900"
            disabled={!resolvedSheetId || sheetChromeReadOnly}
            title="Удалить текущий лист с подложкой и метками"
            onClick={deleteActiveSheet}
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
            Удалить лист
          </Button>
        </div>
      </div>

      {activeSheet ? (
        <div className="space-y-3">
          {sceneMismatch ? (
            <Alert className="border-rose-200 bg-rose-50/80 py-2">
              <AlertTitle className="text-xs font-semibold text-rose-950">
                Сцена / вид не совпадают с master
              </AlertTitle>
              <AlertDescription className="flex flex-wrap items-center gap-2 text-xs text-rose-900/90">
                {sceneMismatch === 'id' ? (
                  <span>ID сцены листа ≠ сцена артикула на общей доске.</span>
                ) : (
                  <span>Вид листа ≠ вид master в досье.</span>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px]"
                  disabled={sheetChromeReadOnly}
                  onClick={() => {
                    if (sceneMismatch === 'id' && dossier.categorySketchSceneId?.trim()) {
                      patchActive({ sceneId: dossier.categorySketchSceneId.trim() });
                    }
                    if (sceneMismatch === 'view' && dossier.categorySketchSceneView) {
                      patchActive({ viewKind: dossier.categorySketchSceneView });
                    }
                  }}
                >
                  Подтянуть как в досье
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}
          {backViewQcHint || sheetQualityHints.length > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-amber-950">
              <p className="font-semibold text-amber-900">Замечания по листу</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {backViewQcHint ? <li key="qc-back">{backViewQcHint}</li> : null}
                {sheetQualityHints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-border-default rounded-xl border bg-white p-3 shadow-sm">
            <CategorySketchAnnotator
              ref={sketchToolbarEditorRef as LegacyRef<CategorySketchAnnotatorHandle> | undefined}
              currentLeaf={currentLeaf}
              imageDataUrl={activeSheet.imageDataUrl}
              imageFileName={activeSheet.imageFileName}
              annotations={activeSheet.annotations}
              sketchContext={sketchContext}
              bomLinePickOptions={bomLinePickOptions}
              onPatch={(patch) => setDossier((p) => ({ ...p, ...patch }))}
              showPassportSectionHeader={false}
              maxAnnotations={MAX_ANNOTATIONS_PER_SKETCH_SHEET}
              pinTextSnippets={pinSnippetsForActive}
              exportFileNameStem={exportStem}
              printSceneCaption={sheetPrintSceneCaption}
              articleSku={articleSku}
              viewMode={sketchViewFloor ? 'floor' : 'edit'}
              subcategorySketchSlots={dossier.subcategorySketchSlots ?? []}
              sketchPropagatedDrafts={dossier.sketchPropagatedDrafts ?? []}
              auditActor={auditActor}
              categorySketchRevisionLabel={dossier.categorySketchRevisionLabel}
              categorySketchFreezeUntilDate={dossier.categorySketchFreezeUntilDate}
              categorySketchProductionApproved={dossier.categorySketchProductionApproved}
              categorySketchCompliance={dossier.categorySketchCompliance}
              sketchBrandbookConstraints={dossier.sketchBrandbookConstraints}
              sketchMasterAnnotationAuditLog={dossier.sketchMasterAnnotationAuditLog ?? []}
              categorySketchRevisionSnapshots={dossier.categorySketchRevisionSnapshots ?? []}
              categorySketchSceneId={dossier.categorySketchSceneId}
              categorySketchSceneView={dossier.categorySketchSceneView}
              sketchMesDefectCatalog={dossier.sketchMesDefectCatalog}
              sketchMaterialCards={activeSheet.materialCards ?? []}
              onSketchMaterialCardsChange={(next) => patchActive({ materialCards: next })}
              sheetStorage={{
                annotations: activeSheet.annotations,
                onAnnotationsChange: (next) => patchActive({ annotations: next }),
                onImageChange: (url?: string, name?: string) => {
                  if (!url) {
                    patchActive({ imageDataUrl: undefined, imageFileName: undefined });
                    return;
                  }
                  const nextOrientation = activeSheet.boardOrientation ?? 'landscape';
                  if (!activeSheet.imageDataUrl || sheetChromeReadOnly) {
                    patchActive({
                      imageDataUrl: url,
                      imageFileName: name,
                      boardOrientation: nextOrientation,
                    });
                    return;
                  }
                  let newId = '';
                  setDossier((p) => {
                    const cur = normalizeSketchSheets(p.sketchSheets);
                    if (cur.length >= MAX_SKETCH_SHEETS) {
                      return p;
                    }
                    const baseTitle = String(activeSheet.title ?? '').trim();
                    const nextTitle = baseTitle || defaultExtraSketchSheetTitle(cur.length);
                    const fresh = createEmptySketchSheet(nextTitle);
                    newId = fresh.sheetId;
                    const nextSheet: Workshop2Phase1SketchSheet = {
                      ...fresh,
                      imageDataUrl: url,
                      imageFileName: name,
                      boardOrientation: nextOrientation,
                    };
                    return { ...p, sketchSheets: [...cur, nextSheet] };
                  });
                  if (newId) pickSheet(newId);
                },
              }}
              onJumpToDossierSection={onJumpToDossierSection}
              onNavigateRouteStage={onNavigateRouteStage}
              visualCatalogAttributeIds={visualCatalogAttributeIds}
              visualCatalogSketchLinks={visualCatalogSketchLinks}
              onVisualCatalogSuggestFromSketch={onVisualCatalogSuggestFromSketch}
            />
          </div>

          <details
            key={`sheet-plm-${resolvedSheetId ?? 'none'}`}
            className="border-border-default bg-bg-surface2/60 rounded-xl border shadow-sm"
          >
            <summary className="text-text-primary cursor-pointer list-none px-3 py-2.5 text-xs font-semibold [&::-webkit-details-marker]:hidden">
              Поля листа для производства и PLM
            </summary>
            <div className="border-border-default space-y-4 border-t bg-white p-3">
              <p className="text-text-secondary text-[11px] leading-snug">
                После загрузки подложки: укажите{' '}
                <span className="text-text-primary font-medium">вид листа</span> и при необходимости{' '}
                <span className="text-text-primary font-medium">ID сцены</span> (как в досье) — для
                пакета PLM и сопоставления ракурсов;{' '}
                <span className="text-text-primary font-medium">статус и чеклист</span> — перед
                передачей в цех;{' '}
                <span className="text-text-primary font-medium">задача по виду</span> — что
                проверить на этом скетче.
              </p>
              <section className="space-y-3">
                <h4 className="text-text-secondary text-[11px] font-semibold uppercase tracking-wide">
                  Статус и чеклист перед цехом
                </h4>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                  <div className="space-y-1">
                    <Label className="text-text-secondary text-xs">
                      Статус листа (цех / согласования)
                    </Label>
                    <select
                      className="border-border-default h-9 w-full min-w-[180px] rounded-md border bg-white px-2 text-sm disabled:opacity-60"
                      value={activeSheet.sheetWorkflowStatus ?? 'draft'}
                      disabled={sheetChromeReadOnly}
                      onChange={(e) =>
                        patchActive({
                          sheetWorkflowStatus: e.target.value as Workshop2SketchSheetWorkflowStatus,
                        })
                      }
                    >
                      {(
                        Object.keys(WORKFLOW_STATUS_LABEL) as Workshop2SketchSheetWorkflowStatus[]
                      ).map((k) => (
                        <option key={k} value={k}>
                          {WORKFLOW_STATUS_LABEL[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2 sm:min-w-[280px]">
                    <Label className="text-text-secondary text-xs">Чеклист готовности</Label>
                    <div className="text-text-primary flex flex-col gap-2 text-sm">
                      <label
                        className={cn(
                          'flex items-center gap-2',
                          sheetChromeReadOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                        )}
                      >
                        <Checkbox
                          disabled={sheetChromeReadOnly}
                          checked={Boolean(activeSheet.sheetChecklist?.substrateConfirmed)}
                          onCheckedChange={(v) =>
                            patchActive({
                              sheetChecklist: {
                                ...activeSheet.sheetChecklist,
                                substrateConfirmed: v === true,
                              },
                            })
                          }
                        />
                        Фото / подложка на листе
                      </label>
                      <label
                        className={cn(
                          'flex items-center gap-2',
                          sheetChromeReadOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                        )}
                      >
                        <Checkbox
                          disabled={sheetChromeReadOnly}
                          checked={Boolean(activeSheet.sheetChecklist?.qcPinsConfirmed)}
                          onCheckedChange={(v) =>
                            patchActive({
                              sheetChecklist: {
                                ...activeSheet.sheetChecklist,
                                qcPinsConfirmed: v === true,
                              },
                            })
                          }
                        />
                        Метки ОТК учтены
                      </label>
                      <label
                        className={cn(
                          'flex items-center gap-2',
                          sheetChromeReadOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                        )}
                      >
                        <Checkbox
                          disabled={sheetChromeReadOnly}
                          checked={Boolean(activeSheet.sheetChecklist?.workshopTaskConfirmed)}
                          onCheckedChange={(v) =>
                            patchActive({
                              sheetChecklist: {
                                ...activeSheet.sheetChecklist,
                                workshopTaskConfirmed: v === true,
                              },
                            })
                          }
                        />
                        Задача цеха заполнена
                      </label>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1 text-xs sm:shrink-0"
                    disabled={sheets.length < 2}
                    onClick={openCompareDialog}
                    title="Два листа рядом с общим масштабом (анфас и спина и т.д.)"
                  >
                    <Columns2 className="h-3.5 w-3.5" />
                    Сравнить
                  </Button>
                </div>
              </section>

              <section className="border-border-subtle space-y-3 border-t pt-4">
                <h4 className="text-text-secondary text-[11px] font-semibold uppercase tracking-wide">
                  Вид листа и сцена (PLM)
                </h4>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-end">
                  <div className="space-y-1">
                    <Label className="text-text-secondary text-xs">Тип / вид (в сцене)</Label>
                    <select
                      className="border-border-default h-9 w-full rounded-md border bg-white px-2 text-sm disabled:opacity-60"
                      value={activeSheet.viewKind ?? 'other'}
                      disabled={sheetChromeReadOnly}
                      onChange={(e) =>
                        patchActive({ viewKind: e.target.value as Workshop2SketchSheetViewKind })
                      }
                    >
                      {VIEW_KINDS.map((k) => (
                        <option key={k} value={k}>
                          {SKETCH_SHEET_VIEW_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1 text-xs"
                      disabled={masterPinsForLeaf.length === 0 || sheetChromeReadOnly}
                      onClick={importMasterPins}
                      title="Копирует метки общего скетча на этот лист (новые id)"
                    >
                      <Copy className="h-3.5 w-3.5" />С master ({masterPinsForLeaf.length})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs"
                      disabled={sheets.length >= MAX_SKETCH_SHEETS || sheetChromeReadOnly}
                      onClick={() => duplicateActiveFixed('full')}
                    >
                      Копия + фото
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs"
                      disabled={sheets.length >= MAX_SKETCH_SHEETS || sheetChromeReadOnly}
                      onClick={() => duplicateActiveFixed('pinsOnly')}
                    >
                      Копия меток
                    </Button>
                  </div>
                </div>
                <div className="rounded-lg border border-teal-100 bg-teal-50/40 p-3">
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="min-w-[12rem] flex-1 space-y-1">
                      <Label className="text-text-secondary text-xs">
                        ID сцены (один на анфас / спину / деталь)
                      </Label>
                      <Input
                        className="h-9 text-sm"
                        value={activeSheet.sceneId ?? ''}
                        placeholder={
                          dossier.categorySketchSceneId?.trim() || 'совпадает с общей доской'
                        }
                        readOnly={sheetChromeReadOnly}
                        onChange={(e) =>
                          patchActive({ sceneId: e.target.value.trim() || undefined })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs"
                      disabled={!dossier.categorySketchSceneId?.trim() || sheetChromeReadOnly}
                      onClick={() =>
                        patchActive({ sceneId: dossier.categorySketchSceneId?.trim() || undefined })
                      }
                    >
                      Как в досье
                    </Button>
                  </div>
                  <p className="text-text-secondary mt-2 text-[11px]">
                    ID сцены в досье артикула:{' '}
                    <span className="text-text-primary font-mono">
                      {dossier.categorySketchSceneId ?? '—'}
                    </span>
                  </p>
                </div>
              </section>

              <section className="border-border-subtle space-y-3 border-t pt-4">
                <h4 className="text-text-secondary text-[11px] font-semibold uppercase tracking-wide">
                  Задача цеха по этому скетчу
                </h4>
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-text-secondary text-xs">
                        Задача цеха по этому виду
                      </Label>
                      <Textarea
                        className="min-h-[72px] text-sm"
                        placeholder="Коротко: что проверить / сделать на этом ракурсе…"
                        value={activeSheet.workshopTaskNote ?? ''}
                        readOnly={sheetChromeReadOnly}
                        onChange={(e) => patchActive({ workshopTaskNote: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-text-secondary text-xs">
                        Комментарий к листу (обсуждение)
                      </Label>
                      <Textarea
                        className="min-h-[72px] text-sm"
                        placeholder="Не привязано к точке — для заметок команды…"
                        value={activeSheet.sheetComment ?? ''}
                        readOnly={sheetChromeReadOnly}
                        onChange={(e) => patchActive({ sheetComment: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-text-secondary text-xs">Видео-референс (URL)</Label>
                      <Input
                        className="h-9 text-sm"
                        placeholder="Ссылка на короткое видео посадки / движения"
                        value={activeSheet.referenceMotionVideoUrl ?? ''}
                        readOnly={sheetChromeReadOnly}
                        onChange={(e) =>
                          patchActive({
                            referenceMotionVideoUrl: e.target.value.trim()
                              ? e.target.value.trim().slice(0, 2000)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-text-secondary text-xs">Заметка к видео</Label>
                      <Input
                        className="h-9 text-sm"
                        placeholder="Что смотреть в ролике"
                        value={activeSheet.referenceMotionVideoNote ?? ''}
                        readOnly={sheetChromeReadOnly}
                        onChange={(e) =>
                          patchActive({
                            referenceMotionVideoNote: e.target.value.trim()
                              ? e.target.value.trim().slice(0, 2000)
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  {activeSheet.referenceMotionVideoUrl?.trim() ? (
                    <p className="text-sm">
                      <a
                        href={activeSheet.referenceMotionVideoUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-primary font-medium underline"
                      >
                        Открыть видео-референс
                      </a>
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="border-border-subtle space-y-3 border-t pt-4">
                <h4 className="text-text-secondary text-[11px] font-semibold uppercase tracking-wide">
                  Шаблоны меток (по скетчу)
                </h4>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <select
                    className="border-border-default h-9 min-w-[200px] flex-1 rounded-md border bg-white px-2 text-sm disabled:opacity-60"
                    value={sheetTemplatePickId}
                    disabled={sheetChromeReadOnly}
                    onChange={(e) => setSheetTemplatePickId(e.target.value)}
                    aria-label="Шаблон для листа"
                  >
                    <option value="">— выберите шаблон —</option>
                    {(dossier.sketchPinTemplates ?? []).length > 0 ? (
                      <optgroup label="Это досье">
                        {(dossier.sketchPinTemplates ?? []).map((t) => (
                          <option key={`d:${t.templateId}`} value={`d:${t.templateId}`}>
                            {t.name} ({t.annotations.length}
                            {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''})
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                    {orgSketchTemplatesForSheet.length > 0 ? (
                      <optgroup label="Библиотека коллекции (браузер)">
                        {orgSketchTemplatesForSheet.map((t) => (
                          <option key={`o:${t.templateId}`} value={`o:${t.templateId}`}>
                            {t.name} ({t.annotations.length}
                            {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''})
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                  </select>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={!sheetTemplatePickId || sheetChromeReadOnly}
                      onClick={() => applySheetPinTemplate('merge')}
                    >
                      + К листу
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={!sheetTemplatePickId || sheetChromeReadOnly}
                      onClick={() => applySheetPinTemplate('replace')}
                    >
                      Заменить лист
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={sheetChromeReadOnly}
                      onClick={saveActiveSheetPinTemplate}
                    >
                      В досье
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={sheetChromeReadOnly}
                      onClick={saveActiveSheetPinTemplateToOrg}
                    >
                      В коллекцию
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </details>
        </div>
      ) : null}

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-h-[90vh] w-[min(1100px,95vw)] max-w-[95vw] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Сравнение листов</DialogTitle>
          </DialogHeader>
          {activeSheet && sheets.length >= 2 ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Label className="text-text-secondary whitespace-nowrap text-xs">
                    Второй лист
                  </Label>
                  <select
                    className="border-border-default h-9 min-w-[200px] rounded-md border bg-white px-2 text-sm"
                    value={comparePeerId ?? ''}
                    onChange={(e) => setComparePeerId(e.target.value || null)}
                  >
                    {sheets
                      .filter((s) => s.sheetId !== activeSheet.sheetId)
                      .map((s) => (
                        <option key={s.sheetId} value={s.sheetId}>
                          {(
                            s.title?.trim() ||
                            defaultExtraSketchSheetTitle(
                              Math.max(
                                0,
                                sheets.findIndex((x) => x.sheetId === s.sheetId)
                              )
                            )
                          ).slice(0, 48)}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex min-w-[200px] flex-1 flex-wrap items-center gap-2">
                  <Label className="text-text-secondary text-xs">Масштаб обоих</Label>
                  <input
                    type="range"
                    min={70}
                    max={130}
                    step={1}
                    className="h-9 w-full min-w-[120px] flex-1"
                    value={Math.round(compareZoom * 100)}
                    onChange={(e) => setCompareZoom(Number(e.target.value) / 100)}
                    aria-label="Масштаб сравнения"
                  />
                  <span className="text-text-secondary text-xs tabular-nums">
                    {Math.round(compareZoom * 100)}%
                  </span>
                </div>
              </div>
              <div
                className="grid gap-4 sm:grid-cols-2"
                style={{ zoom: compareZoom } as CSSProperties}
              >
                <div className="min-w-0 space-y-1">
                  <p className="text-text-secondary text-[10px] font-semibold uppercase">
                    {(
                      activeSheet.title?.trim() ||
                      SKETCH_SHEET_VIEW_LABELS[activeSheet.viewKind ?? 'other']
                    ).slice(0, 40)}
                  </p>
                  <SketchCompareMiniBoard
                    sheet={activeSheet}
                    currentLeaf={currentLeaf}
                    sketchContext={sketchContext}
                    leafId={leafId}
                  />
                </div>
                {comparePeerSheet ? (
                  <div className="min-w-0 space-y-1">
                    <p className="text-text-secondary text-[10px] font-semibold uppercase">
                      {(
                        comparePeerSheet.title?.trim() ||
                        SKETCH_SHEET_VIEW_LABELS[comparePeerSheet.viewKind ?? 'other']
                      ).slice(0, 40)}
                    </p>
                    <SketchCompareMiniBoard
                      sheet={comparePeerSheet}
                      currentLeaf={currentLeaf}
                      sketchContext={sketchContext}
                      leafId={leafId}
                    />
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">Выберите второй лист.</p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );

  if (!sketchSheetsRail) return mainColumn;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
      <div className="shrink-0">{sketchSheetsRail}</div>
      <div className="min-w-0 flex-1">{mainColumn}</div>
    </div>
  );
}
