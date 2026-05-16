import type { ReactNode } from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { VisualCatalogSketchLinkRow } from '@/lib/production/workshop2-sketch-tz-matrix';
import type { SketchPinTextSnippet } from '@/lib/production/workshop2-sketch-sheets';
import type {
  Workshop2CategorySketchCompliance,
  Workshop2DossierSignoffMeta,
  Workshop2MesDefectCodeRow,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2Phase1SubcategorySketchSlot,
  Workshop2SketchAnnotationAuditEntry,
  Workshop2SketchMaterialCard,
  Workshop2SketchPropagatedDraft,
  Workshop2SketchRevisionSnapshot,
  Workshop2SketchSheetViewKind,
  Workshop2TzPanelSectionId,
  Workshop2TzSignoffStageId,
} from '@/lib/production/workshop2-dossier-phase1.types';

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
  categorySketchMaterialCards?: Workshop2SketchMaterialCard[];
};

export type CategorySketchAnnotatorContext = {
  audienceId?: string;
  audienceName?: string;
  isUnisex?: boolean;
};

/** Внешнее хранение меток/фото (доп. скетч-листы) — без записи в `categorySketch*`. */
export type CategorySketchAnnotatorSheetStorage = {
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  onAnnotationsChange: (next: Workshop2Phase1CategorySketchAnnotation[]) => void;
  onImageChange: (imageDataUrl?: string, imageFileName?: string) => void;
};

export type CategorySketchAnnotatorHandle = {
  openSketchUpload: () => void;
  openSketchEditor: () => void;
  /** Выделить метку и прокрутить к ней (общая доска или лист с этим id в DOM). */
  focusPin: (annotationId: string) => void;
};

export type CategorySketchAnnotatorProps = {
  currentLeaf: HandbookCategoryLeaf;
  imageDataUrl?: string;
  imageFileName?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  attributeOptions?: { id: string; label: string }[];
  /** Аудитория и унисекс из паспорта — влияют на пропорции типового силуэта и промпт ИИ. */
  sketchContext?: CategorySketchAnnotatorContext;
  onNavigateStage?: (stage: 'fit' | 'qc') => void;
  onPatch: (patch: CategorySketchAnnotatorPatch) => void;
  /** В master-режиме: вместо замены текущей подложки добавить новый скетч-лист. */
  onAddAsNewSheetFromUpload?: (imageDataUrl: string, imageFileName?: string) => void;
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
  bomLinePickOptions?: readonly { value: string; label: string }[];
  /** Переключить секцию ТЗ в панели досье (фаза 1). */
  onJumpToDossierSection?: (section: Workshop2TzPanelSectionId) => void;
  /** Открыть операционную вкладку артикула по этапу маршрута. */
  onNavigateRouteStage?: (stage: Workshop2TzSignoffStageId) => void;
  /** Атрибуты из секции «Визуал» (фаза 1) — пересечение с матрицей типа активной метки подсвечивается в панели. */
  visualCatalogAttributeIds?: readonly string[];
  /** Поля секции «Визуал» с `sketchHighlightForPinTypes` из JSON каталога — доп. подсказки к матрице. */
  visualCatalogSketchLinks?: readonly VisualCatalogSketchLinkRow[];
  onVisualCatalogSuggestFromSketch?: (attributeIds: string[]) => void;
  /** Кнопки «Загрузить / Открыть» ренерятся снаружи (напр. в строке с вкладками досье). */
  externalPreviewSketchToolbar?: boolean;
  /** Карточки материалов на доске (master или лист); без колбэка блок скрыт. */
  sketchMaterialCards?: Workshop2SketchMaterialCard[];
  onSketchMaterialCardsChange?: (next: Workshop2SketchMaterialCard[]) => void;
};
