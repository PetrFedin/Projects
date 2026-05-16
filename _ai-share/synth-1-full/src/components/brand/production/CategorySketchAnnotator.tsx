'use client';


import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import {
  sketchFitVariantForContext,
  sketchKindForLeaf,
  type CategorySketchKind,
} from '@/lib/production/category-sketch-template';
import { buildCategorySketchAiPrompt } from '@/lib/production/category-sketch-ai-prompt';
import { BRANCH_CATALOG_SLOT_ROLE } from '@/lib/production/workshop2-tz-subcategory-sketches';
import {
  MAX_ANNOTATIONS,
  MAX_IMAGE_CHARS,
  SKETCH_ONBOARD_LS_KEY,
  SUBCATEGORY_TASK_SLOT_FALLBACK,
} from '@/components/brand/production/category-sketch-annotator-constants';
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
  Workshop2SketchMaterialCard,
  Workshop2SketchPropagatedDraft,
  Workshop2SketchRevisionSnapshot,
  Workshop2SketchSheetViewKind,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type {
  CategorySketchAnnotatorContext,
  CategorySketchAnnotatorHandle,
  CategorySketchAnnotatorPatch,
  CategorySketchAnnotatorProps,
  CategorySketchAnnotatorSheetStorage,
} from '@/components/brand/production/category-sketch-annotator-types';

export type {
  CategorySketchAnnotatorContext,
  CategorySketchAnnotatorHandle,
  CategorySketchAnnotatorPatch,
  CategorySketchAnnotatorProps,
  CategorySketchAnnotatorSheetStorage,
} from '@/components/brand/production/category-sketch-annotator-types';
import { normalizeLinkedTzPanelSectionForNav } from '@/lib/production/workshop2-visual-excellence';
import {
  mergeSuggestedTzAttributeIdsForSketchType,
  recommendedTzSectionForSketchType,
} from '@/lib/production/workshop2-sketch-tz-matrix';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { requestCatalogImageGeneration } from '@/lib/ai/catalog-image-gen';
import { downloadSketchBoardPng } from '@/lib/production/sketch-board-png-export';
import {
  isSketchDimensionLineAnnotation,
  sketchDimensionSummary,
} from '@/lib/production/sketch-dimension-line';
import {
  MAX_SKETCH_MATERIAL_CARDS_PER_BOARD,
  normalizeSketchMaterialCard,
} from '@/lib/production/workshop2-sketch-sheets';
import { sketchBoardQualityHints } from '@/lib/production/sketch-quality-hints';
import { computeSketchRevisionCompareBundle } from '@/lib/production/sketch-revision-diff';
import {
  bomRefsFromLiveAnnotations,
  bomRefsFromSnapshotAnnotations,
  latestRevisionSnapshotForLeaf,
} from '@/lib/production/sketch-bom-integrity';
import {
  mesDefectCodeCountsOnPins,
  mergedMesDefectCatalog,
} from '@/lib/production/sketch-mes-catalog';
import { isValidMesShiftId } from '@/lib/production/sketch-mes-shift-utils';
import { openSketchA4Print } from '@/lib/production/sketch-a4-print';
import { openSketchHandoffPackagePrint } from '@/lib/production/sketch-handoff-print';
import {
  buildAnnotationDiffAudit,
  mergeSketchMasterAuditLog,
} from '@/lib/production/sketch-annotation-audit';
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
import {
  HOTSPOT_PRESETS_BY_KIND,
  type CategorySketchHotspotPreset,
} from '@/components/brand/production/category-sketch-annotator-hotspot-presets';
import {
  collectCategorySketchPinValidationIssues,
  newUuid,
  normalizeAnnotation,
  priorityStageForNextPinPreset,
  readFileAsDataUrlLimited,
} from '@/components/brand/production/category-sketch-annotator-annotation-helpers';
import { CategorySketchAnnotatorPassportPreview } from '@/components/brand/production/category-sketch-annotator-passport-preview';
import { CategorySketchAnnotatorEditorWorkflowPanel } from '@/components/brand/production/category-sketch-annotator-editor-workflow-panel';
import { CategorySketchAnnotatorEditorBoardChrome } from '@/components/brand/production/category-sketch-annotator-editor-board-chrome';
import { CategorySketchAnnotatorEditorLeftToolbar } from '@/components/brand/production/category-sketch-annotator-editor-left-toolbar';
import { CategorySketchAnnotatorEditorBoardSubstrate } from '@/components/brand/production/category-sketch-annotator-editor-board-substrate';
import { CategorySketchAnnotatorEditorMaterialCardsPanel } from '@/components/brand/production/category-sketch-annotator-editor-material-cards-panel';
import { CategorySketchAnnotatorEditorSketchFilePanel } from '@/components/brand/production/category-sketch-annotator-editor-sketch-file-panel';
import { CategorySketchAnnotatorEditorHandoffExportPanel } from '@/components/brand/production/category-sketch-annotator-editor-handoff-export-panel';
import { CategorySketchAnnotatorEditorActivePinForm } from '@/components/brand/production/category-sketch-annotator-editor-active-pin-form';
import { CategorySketchAnnotatorEditorRightSidebar } from '@/components/brand/production/category-sketch-annotator-editor-right-sidebar';
import { SKETCH_SHEET_VIEW_LABELS } from '@/lib/production/workshop2-sketch-sheets';

type SketchWorkflowMode = 'setup' | 'review' | 'floor';

export const CategorySketchAnnotator = forwardRef<
  CategorySketchAnnotatorHandle,
  CategorySketchAnnotatorProps
>(
  function CategorySketchAnnotator(props, ref) {
  const {
    currentLeaf,
    imageDataUrl,
    imageFileName,
    annotations,
    attributeOptions = [],
    sketchContext,
    onNavigateStage,
    onPatch,
    onAddAsNewSheetFromUpload,
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
    externalPreviewSketchToolbar = false,
    sketchMaterialCards,
    onSketchMaterialCardsChange,
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
  const dataMaterialCards = sketchMaterialCards ?? [];
  const materialCardsEnabled = Boolean(onSketchMaterialCardsChange);
  const canOpenSketchEditor = Boolean(imageDataUrl?.trim());
  /** Скрываем дубль «Загрузить / Открыть» под превью: внешняя панель досье или режим скетч-листа (`sheetStorage`). */
  const suppressPreviewActionRow = externalPreviewSketchToolbar || Boolean(sheetStorage);
  useImperativeHandle(
    ref,
    () => ({
      openSketchUpload: () => {
        previewSketchFileInputRef.current?.click();
      },
      openSketchEditor: () => {
        if (!imageDataUrl?.trim()) return;
        setEditorOpen(true);
      },
      focusPin: (annotationId: string) => {
        const id = annotationId.trim();
        if (!id) return;
        setActiveId(id);
        window.requestAnimationFrame(() => {
          const el = document.getElementById(`w2-sketch-pin-${id}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (el instanceof HTMLElement) el.focus({ preventScroll: true });
        });
      },
    }),
    [imageDataUrl]
  );
  const sketchImageInputId = useId();
  const sketchCompareInputId = useId();

  const boardRef = useRef<HTMLDivElement>(null);
  const templateLayerRef = useRef<HTMLDivElement>(null);
  const previewSketchFileInputRef = useRef<HTMLInputElement>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [placeMode, setPlaceMode] = useState(false);
  const [materialCardPlaceMode, setMaterialCardPlaceMode] = useState(false);
  const [dimensionLinePlaceMode, setDimensionLinePlaceMode] = useState(false);
  const [dimensionLineStartDraft, setDimensionLineStartDraft] = useState<{
    xPct: number;
    yPct: number;
  } | null>(null);
  /** Один клик по доске — конец линии от уже выбранной метки (без новой метки). */
  const [dimensionLineExtendMode, setDimensionLineExtendMode] = useState(false);
  const [activeMaterialCardId, setActiveMaterialCardId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pendingMaterialCardImageId = useRef<string | null>(null);
  const materialCardFileInputRef = useRef<HTMLInputElement>(null);
  const [workflowMode, setWorkflowMode] = useState<SketchWorkflowMode>('setup');
  const [filterType, setFilterType] = useState<'all' | Workshop2SketchAnnotationType>('all');
  const [filterStage, setFilterStage] = useState<'all' | Workshop2SketchAnnotationStage>('all');
  /** Соответствует цвету пина на доске: критично / этап ОТК / остальные. */
  const [filterPinVisual, setFilterPinVisual] = useState<'all' | 'critical' | 'qc' | 'other'>(
    'all'
  );
  /** Какую группу пина ставить при следующем клике по доске в режиме «+ Метка». */
  const [nextPinPreset, setNextPinPreset] = useState<'critical' | 'qc' | 'other'>('other');
  /** Тип узла для следующей метки по клику на доске (не зона). */
  const [nextAnnotationType, setNextAnnotationType] =
    useState<Workshop2SketchAnnotationType>('construction');
  const [demoRefBusy, setDemoRefBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [webhookBusy, setWebhookBusy] = useState(false);
  const [lastExportSummary, setLastExportSummary] = useState<string>('');
  const [compareSnapIdA, setCompareSnapIdA] = useState<string>('');
  const [compareSnapIdB, setCompareSnapIdB] = useState<string>('');
  const [revisionDiffOverlayOn, setRevisionDiffOverlayOn] = useState(true);
  const [revisionDiffOnlyMode, setRevisionDiffOnlyMode] = useState(false);
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
    if (readOnly) setWorkflowMode('floor');
  }, [readOnly]);

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
  const fitVariant = useMemo(
    () =>
      sketchFitVariantForContext({
        audienceId: sketchContext?.audienceId ?? currentLeaf.audienceId,
        audienceName: sketchContext?.audienceName,
        isUnisex: sketchContext?.isUnisex,
      }),
    [
      currentLeaf.audienceId,
      sketchContext?.audienceId,
      sketchContext?.audienceName,
      sketchContext?.isUnisex,
    ]
  );

  /** Путь каталога — для ИИ-промпта и экспорта (не дублируем в шапке доски). */
  const sketchCatalogPathLabel = useMemo(
    () => currentLeaf.pathLabel.trim() || '—',
    [currentLeaf.pathLabel]
  );

  const demoCatalogImagePrompt = useMemo(
    () =>
      buildCategorySketchAiPrompt({
        pathLabel: sketchCatalogPathLabel,
        kind: sketchKind,
        variant: fitVariant,
        isUnisex: sketchContext?.isUnisex,
        extraHints: '',
        brandbookConstraints: sketchBrandbookConstraints,
      }),
    [
      sketchCatalogPathLabel,
      fitVariant,
      sketchBrandbookConstraints,
      sketchContext?.isUnisex,
      sketchKind,
    ]
  );

  const downloadSvgSilhouette = useCallback(() => {
    const svg = templateLayerRef.current?.querySelector('svg');
    if (!svg) {
      window.alert(
        'Не удалось сформировать SVG контура для этой категории. Загрузите скетч или откройте редактор на основной доске артикула.'
      );
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

  const applyDemoAiReference = useCallback(async (customPrompt?: string) => {
    setDemoRefBusy(true);
    try {
      const res = await requestCatalogImageGeneration({
        prompt: (customPrompt?.trim() || demoCatalogImagePrompt).slice(0, 900),
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
      window.alert(
        'Не удалось загрузить демо-изображение. Проверьте сеть или вставьте файл вручную.'
      );
    } finally {
      setDemoRefBusy(false);
    }
  }, [demoCatalogImagePrompt, onPatch, sheetStorage]);

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

  const selectedCompareSnapA = useMemo(
    () => categorySketchRevisionSnapshots.find((s) => s.snapshotId === compareSnapIdA),
    [categorySketchRevisionSnapshots, compareSnapIdA]
  );
  const selectedCompareSnapB = useMemo(
    () => categorySketchRevisionSnapshots.find((s) => s.snapshotId === compareSnapIdB),
    [categorySketchRevisionSnapshots, compareSnapIdB]
  );
  const { revisionDiff, revisionDiffOverlayPins, revisionDiffChangedIdSet } = useMemo(
    () =>
      computeSketchRevisionCompareBundle(
        selectedCompareSnapA,
        selectedCompareSnapB,
        compareSnapIdA,
        compareSnapIdB
      ),
    [compareSnapIdA, compareSnapIdB, selectedCompareSnapA, selectedCompareSnapB]
  );

  useEffect(() => {
    if (!activeId && dimensionLineExtendMode) setDimensionLineExtendMode(false);
  }, [activeId, dimensionLineExtendMode]);

  useEffect(() => {
    if (readOnly || sheetStorage) return;
    if (onboard.done) return;
    const s1 = onboard.s1 || nextPinPreset !== 'other';
    const s2 = onboard.s2 || placeMode || dimensionLinePlaceMode || dimensionLineExtendMode;
    const s3 = onboard.s3 || pinsOnLeaf.length >= 1;
    const s4 =
      onboard.s4 ||
      pinsOnLeaf.some((a) => {
        if (isSketchDimensionLineAnnotation(a)) {
          return (
            (a.dimensionLabel ?? '').trim().length > 0 &&
            (a.dimensionValueText ?? '').trim().length > 0
          );
        }
        return (a.text ?? '').trim().length > 1;
      });
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
    dimensionLinePlaceMode,
    dimensionLineExtendMode,
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
    const own = dataAnnotations
      .map(normalizeAnnotation)
      .filter((a) => sketchPinBelongsToLeaf(a, leafId));
    const incoming = buildPropagatedDraftsFromAnnotationsOnly(own);
    if (incoming.length === 0) {
      window.alert('Нет подходящих меток: тип «Посадка» или этап «Образец», либо тип/этап «ОТК».');
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
  }, [
    articleSku,
    currentLeaf.pathLabel,
    dataAnnotations,
    exportFileNameStem,
    leafId,
    sketchMesDefectCatalog,
  ]);

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
  }, [
    articleSku,
    currentLeaf.pathLabel,
    dataAnnotations,
    exportFileNameStem,
    leafId,
    sketchMesDefectCatalog,
  ]);

  const handleCriticalWebhook = useCallback(async () => {
    const norm = dataAnnotations.map(normalizeAnnotation);
    const criticalPins = norm.filter(
      (a) => sketchPinBelongsToLeaf(a, leafId) && a.priority === 'critical'
    );
    const badShift = criticalPins.filter(
      (a) => (a.mesShiftId ?? '').trim() && !isValidMesShiftId(a.mesShiftId)
    );
    if (badShift.length > 0) {
      window.alert(
        'Проверьте формат смены у критичных меток (допустимы буквы, цифры, пробел, дефис, дата).'
      );
      return;
    }
    setWebhookBusy(true);
    try {
      const payload = buildCriticalWebhookPayload(currentLeaf.pathLabel, articleSku, leafId, norm);
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

  const sketchHealth = useMemo(() => {
    const total = pinsOnLeaf.length;
    if (total === 0) {
      return {
        score: 0,
        complete: 0,
        incomplete: 0,
        criticalOpen: 0,
        noText: 0,
        noBom: 0,
        noOwner: 0,
      };
    }
    let complete = 0;
    let criticalOpen = 0;
    let noText = 0;
    let noBom = 0;
    let noOwner = 0;
    for (const a of pinsOnLeaf) {
      const issues = collectCategorySketchPinValidationIssues(a);
      if (issues.length === 0) complete++;
      if (a.priority === 'critical' && a.status !== 'done') criticalOpen++;
      if (isSketchDimensionLineAnnotation(a)) {
        if (!(a.dimensionLabel ?? '').trim() || !(a.dimensionValueText ?? '').trim()) noText++;
      } else if (!(a.text ?? '').trim()) {
        noText++;
      }
      if (!(a.linkedBomLineRef ?? '').trim()) noBom++;
      if (!(a.owner ?? '').trim()) noOwner++;
    }
    return {
      score: Math.round((complete / total) * 100),
      complete,
      incomplete: total - complete,
      criticalOpen,
      noText,
      noBom,
      noOwner,
    };
  }, [pinsOnLeaf]);

  const nextIncompletePinId = useMemo(() => {
    const incomplete = pinsOnLeaf.filter((a) => collectCategorySketchPinValidationIssues(a).length > 0);
    if (incomplete.length === 0) return null;
    if (!activeAnn) return incomplete[0]!.annotationId;
    const activeIncompleteIdx = incomplete.findIndex((a) => a.annotationId === activeAnn.annotationId);
    if (activeIncompleteIdx < 0) return incomplete[0]!.annotationId;
    return incomplete[(activeIncompleteIdx + 1) % incomplete.length]!.annotationId;
  }, [activeAnn, pinsOnLeaf]);

  const jumpToNextIncompletePin = useCallback(() => {
    if (!nextIncompletePinId) return;
    setActiveId(nextIncompletePinId);
  }, [nextIncompletePinId]);

  const activePinAuditTrail = useMemo(() => {
    if (!activeAnn) return [];
    return (sketchMasterAnnotationAuditLog ?? [])
      .filter((e) => e.annotationId === activeAnn.annotationId)
      .slice(-3)
      .reverse();
  }, [activeAnn, sketchMasterAnnotationAuditLog]);

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
      label: 'Не утверждён',
      detail: sheetStorage
        ? 'Лист: статус в досье артикула'
        : 'Подпись производства не проставлена',
    };
  }, [sheetStorage, categorySketchFreezeUntilDate, categorySketchProductionApproved]);

  const pinVisualCounts = useMemo(() => {
    const own = dataAnnotations
      .map(normalizeAnnotation)
      .filter((a) => sketchPinBelongsToLeaf(a, leafId));
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
    const own = dataAnnotations
      .map(normalizeAnnotation)
      .filter((a) => sketchPinBelongsToLeaf(a, leafId));
    const linked = own.filter(
      (a) => a.linkedAttributeId || a.linkedTaskId || a.linkedQcZoneId
    ).length;
    return {
      total: own.length,
      critical: own.filter((a) => a.priority === 'critical').length,
      inWork: own.filter((a) => a.status === 'in_progress').length,
      qc: own.filter((a) => a.stage === 'qc').length,
      linked,
    };
  }, [dataAnnotations, leafId]);

  const hotspotPresets = useMemo(() => HOTSPOT_PRESETS_BY_KIND[sketchKind] ?? [], [sketchKind]);

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
          patch.sketchMasterAnnotationAuditLog = mergeSketchMasterAuditLog(
            sketchMasterAnnotationAuditLog,
            diff
          );
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

  const setMaterialCards = useCallback(
    (next: Workshop2SketchMaterialCard[]) => {
      if (readOnly || !onSketchMaterialCardsChange) return;
      const norm = next
        .map((c) => normalizeSketchMaterialCard(c))
        .slice(0, MAX_SKETCH_MATERIAL_CARDS_PER_BOARD);
      onSketchMaterialCardsChange(norm);
    },
    [readOnly, onSketchMaterialCardsChange]
  );

  const updateMaterialCard = useCallback(
    (
      id: string,
      patch: Partial<Workshop2SketchMaterialCard> | ((c: Workshop2SketchMaterialCard) => Partial<Workshop2SketchMaterialCard>)
    ) => {
      if (readOnly || !onSketchMaterialCardsChange) return;
      setMaterialCards(
        dataMaterialCards.map((raw) => {
          if (raw.cardId !== id) return raw;
          const resolved = typeof patch === 'function' ? patch(raw) : patch;
          return normalizeSketchMaterialCard({ ...raw, ...resolved, cardId: id });
        })
      );
    },
    [dataMaterialCards, readOnly, onSketchMaterialCardsChange, setMaterialCards]
  );

  const removeMaterialCard = useCallback(
    (id: string) => {
      if (readOnly || !onSketchMaterialCardsChange) return;
      setMaterialCards(dataMaterialCards.filter((c) => c.cardId !== id));
      if (activeMaterialCardId === id) setActiveMaterialCardId(null);
    },
    [
      activeMaterialCardId,
      dataMaterialCards,
      readOnly,
      onSketchMaterialCardsChange,
      setMaterialCards,
    ]
  );

  const updateAnnotation = useCallback(
    (
      id: string,
      patch:
        | Partial<Workshop2Phase1CategorySketchAnnotation>
        | ((
            current: Workshop2Phase1CategorySketchAnnotation
          ) => Partial<Workshop2Phase1CategorySketchAnnotation>)
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

  const autoFixActivePin = useCallback(() => {
    if (!activeAnn || readOnly) return;
    const recSection = recommendedTzSectionForSketchType(activeAnn.annotationType);
    const suggestedAttrs = mergeSuggestedTzAttributeIdsForSketchType(
      activeAnn.annotationType,
      visualCatalogSketchLinks
    );
    const firstSuggestedAttr = attributeOptions.find((o) => suggestedAttrs.includes(o.id))?.id;
    updateAnnotation(activeAnn.annotationId, {
      linkedTzSectionKey:
        normalizeLinkedTzPanelSectionForNav(activeAnn.linkedTzSectionKey) ??
        recSection ??
        activeAnn.linkedTzSectionKey,
      linkedAttributeId: activeAnn.linkedAttributeId || firstSuggestedAttr,
      status: activeAnn.status ?? 'in_progress',
      stage: activeAnn.stage ?? (activeAnn.annotationType === 'qc' ? 'qc' : 'tz'),
    });
  }, [activeAnn, attributeOptions, readOnly, updateAnnotation, visualCatalogSketchLinks]);

  const qualityHints = useMemo(
    () =>
      sketchBoardQualityHints(dataAnnotations.map(normalizeAnnotation), {
        leafId,
        hasImageSubstrate: Boolean(imageDataUrl),
      }),
    [dataAnnotations, leafId, imageDataUrl]
  );

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
      if (e.key === 'Escape' && materialCardPlaceMode) {
        e.preventDefault();
        setMaterialCardPlaceMode(false);
        return;
      }
      if (e.key === 'Escape' && dimensionLinePlaceMode) {
        e.preventDefault();
        setDimensionLinePlaceMode(false);
        setDimensionLineStartDraft(null);
        return;
      }
      if (e.key === 'Escape' && dimensionLineExtendMode) {
        e.preventDefault();
        setDimensionLineExtendMode(false);
        return;
      }
      if (readOnly) return;
      const step = e.shiftKey ? 2 : 0.8;
      let dx = 0;
      let dy = 0;
      if (e.key === 'ArrowLeft') dx = -step;
      if (e.key === 'ArrowRight') dx = step;
      if (e.key === 'ArrowUp') dy = -step;
      if (e.key === 'ArrowDown') dy = step;
      if (activeMaterialCardId && !activeId && !placeMode && !materialCardPlaceMode) {
      if (!dx && !dy) return;
      e.preventDefault();
        updateMaterialCard(activeMaterialCardId, (cur) => ({
        xPct: Math.min(98, Math.max(2, cur.xPct + dx)),
        yPct: Math.min(98, Math.max(2, cur.yPct + dy)),
      }));
        return;
      }
      if (!activeId || placeMode || materialCardPlaceMode || dimensionLinePlaceMode || dimensionLineExtendMode)
        return;
      if (!dx && !dy) return;
      e.preventDefault();
      updateAnnotation(activeId, (cur) => {
        const nx = Math.min(98, Math.max(2, cur.xPct + dx));
        const ny = Math.min(98, Math.max(2, cur.yPct + dy));
        if (isSketchDimensionLineAnnotation(cur)) {
          return {
            xPct: nx,
            yPct: ny,
            lineEndXPct: Math.min(98, Math.max(2, cur.lineEndXPct! + dx)),
            lineEndYPct: Math.min(98, Math.max(2, cur.lineEndYPct! + dy)),
          };
        }
        return { xPct: nx, yPct: ny };
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    activeId,
    activeMaterialCardId,
    materialCardPlaceMode,
    dimensionLinePlaceMode,
    dimensionLineExtendMode,
    placeMode,
    readOnly,
    updateAnnotation,
    updateMaterialCard,
  ]);

  const applyLastPinStyleToNext = useCallback(() => {
    const own = dataAnnotations
      .filter((a) => sketchPinBelongsToLeaf(a, leafId))
      .map(normalizeAnnotation);
    if (own.length === 0) return;
    const last = own[own.length - 1]!;
    if (last.priority === 'critical') setNextPinPreset('critical');
    else if (last.stage === 'qc') setNextPinPreset('qc');
    else setNextPinPreset('other');
    setNextAnnotationType(last.annotationType ?? 'construction');
  }, [dataAnnotations, leafId]);

  const onBoardClick = (e: MouseEvent<HTMLDivElement>) => {
    if (readOnly || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const xPct = Math.min(98, Math.max(2, x));
    const yPct = Math.min(98, Math.max(2, y));
    if (materialCardPlaceMode && materialCardsEnabled) {
      if (dataMaterialCards.length >= MAX_SKETCH_MATERIAL_CARDS_PER_BOARD) {
        window.alert(
          `На доске уже ${MAX_SKETCH_MATERIAL_CARDS_PER_BOARD} карточек материала (лимит). Удалите лишние в списке ниже.`
        );
        return;
      }
      const id = newUuid();
      const card = normalizeSketchMaterialCard({
        cardId: id,
        xPct,
        yPct,
        widthPct: 12,
        caption: '',
      });
      setMaterialCards([...dataMaterialCards, card]);
      setActiveMaterialCardId(id);
      setActiveId(null);
      setMaterialCardPlaceMode(false);
      return;
    }
    if (dimensionLineExtendMode) {
      if (!activeId) {
        setDimensionLineExtendMode(false);
        return;
      }
      const pin = dataAnnotations.find((a) => a.annotationId === activeId);
      if (!pin || !sketchPinBelongsToLeaf(pin, leafId)) {
        setDimensionLineExtendMode(false);
        return;
      }
      const d = Math.hypot(xPct - pin.xPct, yPct - pin.yPct);
      if (d < 0.45) {
        window.alert('Слишком близко к метке — выберите конец линии дальше от центра номера.');
        return;
      }
      updateAnnotation(activeId, {
        lineEndXPct: xPct,
        lineEndYPct: yPct,
        dimensionLabel: pin.dimensionLabel ?? '',
        dimensionValueText: pin.dimensionValueText ?? '',
      });
      setDimensionLineExtendMode(false);
      return;
    }
    if (dimensionLinePlaceMode) {
      if (pinsOnLeaf.length >= annotationLimit) {
        window.alert(
          `На этой доске уже ${annotationLimit} меток (лимит). Удалите точки на текущем листе или откройте другой уровень категории.`
        );
        return;
      }
      if (!dimensionLineStartDraft) {
        setDimensionLineStartDraft({ xPct, yPct });
        return;
      }
      const id = newUuid();
      const nextAnnotation = normalizeAnnotation({
        annotationId: id,
        categoryLeafId: leafId,
        xPct: dimensionLineStartDraft.xPct,
        yPct: dimensionLineStartDraft.yPct,
        lineEndXPct: xPct,
        lineEndYPct: yPct,
        dimensionLabel: '',
        dimensionValueText: '',
        text: '',
        annotationType: nextAnnotationType,
        ...priorityStageForNextPinPreset(id, nextPinPreset),
      });
      setAnnotations([...dataAnnotations, nextAnnotation]);
      setActiveId(nextAnnotation.annotationId);
      setDimensionLinePlaceMode(false);
      setDimensionLineStartDraft(null);
      return;
    }
    if (!placeMode) return;
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
    if (activeId === id) setActiveId(null);
  };

  const addPresetAnnotation = useCallback(
    (preset: CategorySketchHotspotPreset) => {
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

  const handleExportPng = useCallback(async () => {
    const own = dataAnnotations
      .filter((a) => sketchPinBelongsToLeaf(a, leafId))
      .map(normalizeAnnotation);
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
          lineEndXPct: a.lineEndXPct,
          lineEndYPct: a.lineEndYPct,
          dimensionLabel: a.dimensionLabel,
          dimensionValueText: a.dimensionValueText,
        })),
        fileName: stem,
        subtitle: currentLeaf.pathLabel,
      });
    } catch {
      window.alert('Не удалось сформировать PNG.');
    } finally {
      setExportBusy(false);
    }
  }, [
    currentLeaf.leafId,
    currentLeaf.pathLabel,
    dataAnnotations,
    exportFileNameStem,
    imageDataUrl,
    leafId,
  ]);

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
      if (onAddAsNewSheetFromUpload) {
        onAddAsNewSheetFromUpload(u, f.name);
        return;
      }
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

  const onPickMaterialCardImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const targetId = pendingMaterialCardImageId.current;
    pendingMaterialCardImageId.current = null;
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/') || !targetId || readOnly) return;
    const u = await readFileAsDataUrlLimited(f, 380_000);
    if (!u) {
      window.alert('Файл слишком большой для карточки — уменьшите изображение или сожмите JPEG.');
      return;
    }
    updateMaterialCard(targetId, { imageDataUrl: u, imageFileName: f.name });
  };

  /** Сброс общей доски для текущей ветки каталога: метки этой ветки + своя подложка + сравнение. */
  const resetMasterSketchBoard = () => {
    if (readOnly || sheetStorage) return;
    const ownPins = dataAnnotations.filter((a) => sketchPinBelongsToLeaf(a, leafId));
    const ownCount = ownPins.length;
    const hasImage = Boolean(imageDataUrl);
    const hasOverlay = Boolean(compareOverlayDataUrl);
    const mcCount = dataMaterialCards.length;
    if (ownCount === 0 && !hasImage && !hasOverlay && mcCount === 0) {
      window.alert(
        'Нечего сбрасывать: для этой ветки нет меток на общей доске, своей подложки, карточек материала и сравнения с эталоном.'
      );
      return;
    }
    if (
      !window.confirm(
        `Очистить основную доску скетча для текущей ветки каталога?\n\n• Удалить меток: ${ownCount}\n• Убрать загруженное фото (доска снова пустая)${mcCount > 0 ? `\n• Удалить карточек материала: ${mcCount}` : ''}${hasOverlay ? '\n• Убрать наложение «сравнение с эталоном»' : ''}\n\nМетки других веток на этой доске не меняются. Отменить нельзя.`
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
      categorySketchMaterialCards: [],
    });
    setActiveId(null);
    setActiveMaterialCardId(null);
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

  const isFloorMode = workflowMode === 'floor';

  const editorBody = (
    <div className="space-y-2">
      <CategorySketchAnnotatorEditorWorkflowPanel
        qualityHints={qualityHints}
        readOnly={readOnly}
        sheetStorage={sheetStorage}
        workflowMode={workflowMode}
        onWorkflowModeChange={setWorkflowMode}
        sketchHealth={sketchHealth}
        pinsOnLeafCount={pinsOnLeaf.length}
        onResetMasterBoard={resetMasterSketchBoard}
      />
      <CategorySketchAnnotatorEditorBoardChrome
        sheetStorage={sheetStorage}
        isFloorMode={isFloorMode}
        readOnly={readOnly}
        onboard={onboard}
        persistOnboard={persistOnboard}
        articleSku={articleSku}
        showPassportSectionHeader={showPassportSectionHeader}
        categorySketchProductionApproved={categorySketchProductionApproved}
        categorySketchFreezeUntilDate={categorySketchFreezeUntilDate}
        boardSketchStatus={boardSketchStatus}
        countersTotal={counters.total}
        countersCritical={counters.critical}
        annotationLimit={annotationLimit}
        sceneId={sceneIdProp}
        sceneView={sceneViewProp}
        onSceneIdChange={(v) => onPatch({ categorySketchSceneId: v })}
        onSceneViewChange={(v) => onPatch({ categorySketchSceneView: v })}
      />

      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          !readOnly && 'lg:grid-cols-[minmax(0,6.5fr)_minmax(300px,3.5fr)] lg:items-start'
        )}
      >
        <div className="min-w-0 space-y-3">
          {!isFloorMode ? (
          <CategorySketchAnnotatorEditorLeftToolbar
            readOnly={readOnly}
            sheetStorage={sheetStorage}
            pinsOnLeafCount={pinsOnLeaf.length}
            pinsHasActiveAnnotation={Boolean(
              activeId && pinsOnLeaf.some((a) => a.annotationId === activeId)
            )}
            activeId={activeId}
            materialCardsEnabled={materialCardsEnabled}
            nextPinPreset={nextPinPreset}
            setNextPinPreset={setNextPinPreset}
            placeMode={placeMode}
            setPlaceMode={setPlaceMode}
            materialCardPlaceMode={materialCardPlaceMode}
            setMaterialCardPlaceMode={setMaterialCardPlaceMode}
            dimensionLinePlaceMode={dimensionLinePlaceMode}
            setDimensionLinePlaceMode={setDimensionLinePlaceMode}
            dimensionLineStartDraft={dimensionLineStartDraft}
            setDimensionLineStartDraft={setDimensionLineStartDraft}
            dimensionLineExtendMode={dimensionLineExtendMode}
            setDimensionLineExtendMode={setDimensionLineExtendMode}
            nextAnnotationType={nextAnnotationType}
            setNextAnnotationType={setNextAnnotationType}
            applyLastPinStyleToNext={applyLastPinStyleToNext}
            filterPinVisual={filterPinVisual}
            setFilterPinVisual={setFilterPinVisual}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStage={filterStage}
            setFilterStage={setFilterStage}
            pinVisualCounts={pinVisualCounts}
            hiddenByFilters={hiddenByFilters}
            hotspotPresets={hotspotPresets}
            addPresetAnnotation={addPresetAnnotation}
            pinTextSnippets={pinTextSnippets}
            applyPinTextSnippet={applyPinTextSnippet}
            onSavePinTemplateToDossier={onSavePinTemplateToDossier}
            onSavePinTemplateToOrg={onSavePinTemplateToOrg}
          />
                ) : null}

          <CategorySketchAnnotatorEditorBoardSubstrate
            boardRef={boardRef}
            templateLayerRef={templateLayerRef}
            materialCardFileInputRef={materialCardFileInputRef}
            readOnly={readOnly}
            sheetStorage={sheetStorage}
            imageDataUrl={imageDataUrl}
            currentLeaf={currentLeaf}
                      sketchContext={sketchContext}
            compareOverlayDataUrl={compareOverlayDataUrl}
            compareOpacity={compareOpacity}
            compareOffsetXPct={compareOffsetXPct}
            compareOffsetYPct={compareOffsetYPct}
            compareScalePct={compareScalePct}
            materialCardPlaceMode={materialCardPlaceMode}
            materialCardsEnabled={materialCardsEnabled}
            dimensionLineExtendMode={dimensionLineExtendMode}
            dimensionLinePlaceMode={dimensionLinePlaceMode}
            dimensionLineStartDraft={dimensionLineStartDraft}
            placeMode={placeMode}
            nextPinPreset={nextPinPreset}
            activeAnnIdx={activeAnnIdx}
            revisionDiff={revisionDiff}
            revisionDiffOverlayPins={revisionDiffOverlayPins}
            revisionDiffChangedIdSet={revisionDiffChangedIdSet}
            revisionDiffOverlayOn={revisionDiffOverlayOn}
            setRevisionDiffOverlayOn={setRevisionDiffOverlayOn}
            revisionDiffOnlyMode={revisionDiffOnlyMode}
            setRevisionDiffOnlyMode={setRevisionDiffOnlyMode}
            pinsOnLeaf={pinsOnLeaf}
            dataMaterialCards={dataMaterialCards}
            activeMaterialCardId={activeMaterialCardId}
            setActiveMaterialCardId={setActiveMaterialCardId}
            setActiveId={setActiveId}
            activeId={activeId}
            visibleIds={visibleIds}
                        attributeOptions={attributeOptions}
                        taskSlotLabelById={taskSlotLabelById}
            onBoardClick={onBoardClick}
            onPickMaterialCardImage={onPickMaterialCardImage}
          />

          {materialCardsEnabled ? (
            <CategorySketchAnnotatorEditorMaterialCardsPanel
              readOnly={readOnly}
              dataMaterialCards={dataMaterialCards}
              activeMaterialCardId={activeMaterialCardId}
              setActiveMaterialCardId={setActiveMaterialCardId}
              setActiveId={setActiveId}
              pendingMaterialCardImageId={pendingMaterialCardImageId}
              materialCardFileInputRef={materialCardFileInputRef}
              bomLinePickOptions={bomLinePickOptions}
              updateMaterialCard={updateMaterialCard}
              removeMaterialCard={removeMaterialCard}
            />
          ) : null}

          <CategorySketchAnnotatorEditorSketchFilePanel
            sketchImageInputId={sketchImageInputId}
            sketchCompareInputId={sketchCompareInputId}
            sheetStorage={sheetStorage}
            readOnly={readOnly}
            imageDataUrl={imageDataUrl}
            imageFileName={imageFileName}
            compareOverlayDataUrl={compareOverlayDataUrl}
            compareOverlayFileName={compareOverlayFileName}
            compareOpacity={compareOpacity}
            compareScalePct={compareScalePct}
            compareOffsetXPct={compareOffsetXPct}
            compareOffsetYPct={compareOffsetYPct}
            demoRefBusy={demoRefBusy}
            onPickImage={onPickImage}
            onPickCompareOverlay={onPickCompareOverlay}
            clearCompareOverlay={clearCompareOverlay}
            clearImage={clearImage}
            downloadSvgSilhouette={downloadSvgSilhouette}
            applyDemoAiReference={applyDemoAiReference}
            onPatch={onPatch}
          />

          <CategorySketchAnnotatorEditorHandoffExportPanel
            readOnly={readOnly}
            sketchTasksPanel={sketchTasksPanel}
            categorySketchRevisionLabel={categorySketchRevisionLabel}
            categorySketchFreezeUntilDate={categorySketchFreezeUntilDate}
            compliance={compliance}
            onPatch={onPatch}
            categorySketchRevisionSnapshots={categorySketchRevisionSnapshots}
            compareSnapIdA={compareSnapIdA}
            compareSnapIdB={compareSnapIdB}
            setCompareSnapIdA={setCompareSnapIdA}
            setCompareSnapIdB={setCompareSnapIdB}
            revisionDiff={revisionDiff}
            onAppendSketchRevisionSnapshot={onAppendSketchRevisionSnapshot}
            auditActor={auditActor}
            exportBusy={exportBusy}
            onExportPng={handleExportPng}
            onPrintA4={() => {
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
                            pageUrl:
                              typeof window !== 'undefined' ? window.location.href : undefined,
                            sceneCaption: printSceneCaption?.trim() || masterPrintSceneCaption,
                          });
                        })();
                      }}
            onPrintHandoffPackage={() => {
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
                            pageUrl:
                              typeof window !== 'undefined' ? window.location.href : undefined,
                            sceneCaption: printSceneCaption?.trim() || masterPrintSceneCaption,
                            includePlmAppendix: true,
                            threadExcerptLines: 2,
                          });
                        })();
                      }}
            onAppendPropagatedDrafts={handleAppendPropagatedDrafts}
            onCriticalCsv={handleCriticalCsv}
            onMesQualityCsv={handleMesQualityCsv}
            onMesQcCsv={handleMesQcCsv}
            webhookBusy={webhookBusy}
            onCriticalWebhook={handleCriticalWebhook}
            mesTopCodesOnBoard={mesTopCodesOnBoard}
            lastExportSummary={lastExportSummary}
            sketchPropagatedDrafts={sketchPropagatedDrafts}
          />
        </div>

        <CategorySketchAnnotatorEditorRightSidebar
          nextIncompletePinId={nextIncompletePinId}
          onJumpToNextIncompletePin={jumpToNextIncompletePin}
          readOnly={readOnly}
          activeAnn={activeAnn}
          onAutoFixActivePin={autoFixActivePin}
          revisionDiffOnlyMode={revisionDiffOnlyMode}
          revisionDiffOverlayOn={revisionDiffOverlayOn}
          pinsOnLeaf={pinsOnLeaf}
          revisionDiffChangedIdSet={revisionDiffChangedIdSet}
          visibleIds={visibleIds}
          onSelectPin={setActiveId}
        >
          {!activeAnn ? (
            <p className="text-sm text-zinc-500">Нет меток на этом листе.</p>
          ) : (
            <CategorySketchAnnotatorEditorActivePinForm
              activeAnn={activeAnn}
              activeAnnIdx={activeAnnIdx}
                readOnly={readOnly}
              updateAnnotation={updateAnnotation}
              removeAnn={removeAnn}
              onPickProofPhoto={onPickProofPhoto}
              attributeOptions={attributeOptions}
              taskSlotLabelOptions={taskSlotLabelOptions}
              taskSlotLabelById={taskSlotLabelById}
              subcategorySketchSlots={subcategorySketchSlots}
              onPatch={onPatch}
              setEditorOpen={setEditorOpen}
              onJumpToDossierSection={onJumpToDossierSection}
              onNavigateRouteStage={onNavigateRouteStage}
              visualCatalogSketchLinks={visualCatalogSketchLinks}
              bomLinePickOptions={bomLinePickOptions}
              baselineBomRefs={baselineBomRefs}
              liveBomRefs={liveBomRefs}
              sheetStorage={sheetStorage}
              mesDefectCatalogMerged={mesDefectCatalogMerged}
              auditActor={auditActor}
              articleSku={articleSku}
              pathLabel={currentLeaf.pathLabel}
                sketchPageUrl={sketchPageUrl}
              activePinAuditTrail={activePinAuditTrail}
            />
          )}
        </CategorySketchAnnotatorEditorRightSidebar>
      </div>

      {!sheetStorage && (sketchMasterAnnotationAuditLog?.length ?? 0) > 0 ? (
        <details className="rounded-lg border border-slate-200 bg-white p-2 text-xs">
          <summary className="cursor-pointer font-medium text-slate-700">
            Журнал изменений меток (последние {Math.min(15, sketchMasterAnnotationAuditLog.length)})
          </summary>
          <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-slate-600">
            {sketchMasterAnnotationAuditLog
              .slice(-15)
              .reverse()
              .map((e) => (
                <li
                  key={e.entryId}
                  className="border-b border-slate-100 pb-1 font-mono text-[9px] leading-snug"
                >
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

    </div>
  );

  return (
    <div className="space-y-3">
      <CategorySketchAnnotatorPassportPreview
        suppressPreviewActionRow={suppressPreviewActionRow}
        previewSketchFileInputRef={previewSketchFileInputRef}
        onPickImage={onPickImage}
        showPassportSectionHeader={showPassportSectionHeader}
        readOnly={readOnly}
        canOpenSketchEditor={canOpenSketchEditor}
        onOpenEditor={() => setEditorOpen(true)}
        imageDataUrl={imageDataUrl}
        sheetStorage={sheetStorage}
        externalPreviewSketchToolbar={externalPreviewSketchToolbar}
        dataAnnotations={dataAnnotations}
        leafId={leafId}
                    attributeOptions={attributeOptions}
                    taskSlotLabelById={taskSlotLabelById}
        onPinBadgeClick={(id) => {
          setActiveId(id);
          if (canOpenSketchEditor) setEditorOpen(true);
        }}
      />

      <Dialog
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) {
            setPlaceMode(false);
            setMaterialCardPlaceMode(false);
          }
        }}
      >
        <DialogContent
          className="m-3 max-h-[calc(100dvh-1.5rem)] overflow-hidden p-0 sm:m-5 sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-6xl"
          ariaTitle="Скетч по категории"
        >
          <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-3.5">
            <DialogHeader className="space-y-1.5">
              <DialogTitle>Скетч по категории</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-0.5 text-sm text-muted-foreground">
                  <p className="text-sm font-medium text-slate-800">{sketchCatalogPathLabel}</p>
                  <p className="text-[11px] leading-tight text-slate-500">
                    Подложка → точки → справа текст и связи (ТЗ, ветка, BOM). Esc — выход из режима
                    клика по доске.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="max-h-[min(85dvh,calc(100dvh-11rem))] overflow-y-auto bg-slate-50/40 px-4 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-4">
            {editorBody}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

CategorySketchAnnotator.displayName = 'CategorySketchAnnotator';
