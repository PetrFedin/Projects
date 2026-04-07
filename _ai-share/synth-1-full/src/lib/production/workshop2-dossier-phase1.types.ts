import type {
  Workshop2BomLineCostingHint,
  Workshop2BomLineDeltaDraft,
  Workshop2MaterialAlternativeDraft,
} from '@/lib/production/workshop2-dossier-view-infrastructure';

/**
 * Модель досье фазы 1 Цеха 2 — соответствует schemas/workshop2-dossier-phase1.json.
 */

export type Workshop2Phase1ValueSource = 'handbook_parameter' | 'free_text' | 'numeric';

export type Workshop2Phase1AttributeValue = {
  valueId: string;
  valueSource: Workshop2Phase1ValueSource;
  parameterId?: string;
  text?: string;
  number?: number;
  displayLabel: string;
};

export type Workshop2Phase1AssignmentKind = 'canonical' | 'custom_proposed';

export type Workshop2Phase1CustomProposed = {
  label: string;
  note?: string;
};

export type Workshop2Phase1AttributeAssignment = {
  assignmentId: string;
  kind: Workshop2Phase1AssignmentKind;
  attributeId?: string;
  customProposed?: Workshop2Phase1CustomProposed;
  values: Workshop2Phase1AttributeValue[];
};

export type Workshop2Phase1TechPackAttachment = {
  attachmentId: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  /** Data URL; для крупных файлов может отсутствовать из‑за лимита localStorage. */
  previewDataUrl?: string;
  revisionNote?: string;
};

export type Workshop2SketchAnnotationType =
  | 'construction'
  | 'material'
  | 'fit'
  | 'finishing'
  | 'hardware'
  | 'labeling'
  | 'qc';

export type Workshop2SketchAnnotationPriority = 'critical' | 'important' | 'note';

export type Workshop2SketchAnnotationStatus = 'new' | 'in_progress' | 'done' | 'rejected';

export type Workshop2SketchAnnotationStage = 'tz' | 'sample' | 'prelaunch' | 'release' | 'qc';

export type Workshop2ProductionTaskStatus = 'new' | 'in_progress' | 'done' | 'blocked';

export type Workshop2ProductionTaskPriority = 'critical' | 'high' | 'normal';

export type Workshop2ProductionTaskStage = 'tz' | 'supply' | 'fit' | 'plan' | 'release' | 'qc';

/** Комментарий / тред у метки (как в документе; упоминания @роль — текстом). */
export type Workshop2SketchPinThreadComment = {
  commentId: string;
  /** ISO-8601 */
  at: string;
  by: string;
  body: string;
  parentCommentId?: string;
  /** Выделенные @упоминания (роли/метки), парсятся из текста в UI. */
  mentions?: string[];
  /** Событие в календаре коллаборации (localStorage), если создали из треда. */
  linkedCalendarEventId?: string;
  /** Заглушка под push/in-app: пометить после сохранения комментария с @упоминаниями. */
  mentionNotifyPending?: boolean;
};

/** Код дефекта MES / ОТК (иерархия L1→L2 через parentCode). */
export type Workshop2MesDefectCodeRow = {
  code: string;
  label: string;
  parentCode?: string;
};

/** Этапы маршрута Цеха 2 (вкладки воркспейса, привязка метки скетча). */
export type Workshop2TzSignoffStageId =
  | 'tz'
  | 'sample'
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc';

/** Активные вкладки ТЗ в навигации (4 шт.). */
export type Workshop2TzPanelSectionId = 'general' | 'visuals' | 'material' | 'construction';

/** Устаревшие ключи в сохранённых метках (табель мер / упаковка вынесены в конструкцию и материалы). */
export type Workshop2TzPanelSectionKeyStored = Workshop2TzPanelSectionId | 'measurements' | 'packaging';

/** Что именно берём с референса (решение, не только файл). */
export type Workshop2VisualRefTakeawayAspect =
  | 'silhouette'
  | 'color'
  | 'hardware'
  | 'fit'
  | 'fabric'
  | 'mood'
  | 'other';

/** Структурированный замысел (не только комментарии к картинкам). */
export type Workshop2DesignerIntentBlock = {
  /** Настроение / направление одной строкой. */
  mood?: string;
  /** До 5 тезисов; пустые строки в UI отбрасываются при сохранении. */
  bullets?: string[];
};

/** Чеклист готовности «Визуал» для менеджера (ручные галочки). */
export type Workshop2VisualReadinessChecklist = {
  refsAttached?: boolean;
  sketchWithPins?: boolean;
  floorReferenceReady?: boolean;
  refThreadsResolved?: boolean;
  canonicalArtifactSet?: boolean;
  designerIntentFilled?: boolean;
  versionOrSnapshotRecorded?: boolean;
};

/** Запись в журнале версий визуала (текстово, без бинарного diff). */
export type Workshop2VisualVersionLogEntry = {
  entryId: string;
  /** ISO-8601 */
  at: string;
  by: string;
  /** Подпись версии, напр. v3 или 2026-04-01-handoff */
  versionLabel: string;
  /** Что изменилось относительно предыдущего согласования. */
  changeSummary: string;
};

/** Утверждённые «главные» артефакты для подписи / передачи. */
export type Workshop2CanonicalSketchTarget =
  | { kind: 'master' }
  | { kind: 'sheet'; sheetId: string };

/** Метка на доске «скетч категории» (координаты в процентах подложки). */
export type Workshop2Phase1CategorySketchAnnotation = {
  annotationId: string;
  /** Лист справочника на момент создания; при смене категории метки других листов скрываются. */
  categoryLeafId: string;
  /** 0–100, от левого края подложки. */
  xPct: number;
  /** 0–100, от верхнего края подложки. */
  yPct: number;
  text: string;
  annotationType?: Workshop2SketchAnnotationType;
  priority?: Workshop2SketchAnnotationPriority;
  status?: Workshop2SketchAnnotationStatus;
  stage?: Workshop2SketchAnnotationStage;
  owner?: string;
  linkedAttributeId?: string;
  linkedQcZoneId?: string;
  /** `slotId` слота подкатегории (L1/L2/L3), см. `subcategorySketchSlots`. */
  linkedTaskId?: string;
  dueDate?: string;
  /** Фото с цеха / ОТК к метке (data URL; крупные файлы могут не сохраниться в local JSON). */
  proofPhotoDataUrl?: string;
  proofPhotoFileName?: string;
  proofStatus?: 'pending' | 'accepted' | 'rejected';
  /** Раздел ТЗ — открыть одним кликом из карточки метки. */
  linkedTzSectionKey?: Workshop2TzPanelSectionKeyStored;
  /** Этап маршрута SKU (вкладка операционного контура). */
  linkedRouteStageId?: Workshop2TzSignoffStageId;
  /** Ссылка на строку BOM / материал (id строки PIM/PLM или произвольная метка). */
  linkedBomLineRef?: string;
  /** Человекочитаемое описание материала/узла для цеха. */
  linkedMaterialNote?: string;
  /** Код дефекта из справочника `sketchMesDefectCatalog`. */
  mesDefectCode?: string;
  /** Смена / партия отчёта (MES). */
  mesShiftId?: string;
  /** Тред обсуждений у точки. */
  sketchPinComments?: Workshop2SketchPinThreadComment[];
  /** Тред закрыт (решён) — меньше шума в списках. */
  sketchPinThreadResolved?: boolean;
  /** Прочитано до (ISO): комментарии позже считаются «новыми» в UI. */
  sketchPinThreadLastReadAt?: string;
};

/** Черновик строки для посадки / ОТК, собранный из меток скетча. */
export type Workshop2SketchPropagatedDraft = {
  draftId: string;
  kind: 'fit' | 'qc';
  text: string;
  fromAnnotationId: string;
  createdAt: string;
};

/** Запись аудита изменений master-меток (для споров с фабрикой и внутреннего контроля). */
export type Workshop2SketchAnnotationAuditEntry = {
  entryId: string;
  /** ISO-8601 */
  at: string;
  /** ФИО / метка пользователя из паспорта артикула */
  by: string;
  annotationId: string;
  action: 'create' | 'update' | 'delete' | 'move' | 'bom_link' | 'revision_snapshot';
  summary: string;
};

/** Реквизиты комплаенса / передачи в цех (ссылки и версии, без вложений). */
export type Workshop2CategorySketchCompliance = {
  /** Утверждённый референс (URL или внутренний id). */
  approvedReferenceUrl?: string;
  /** Версия комплекта лекал / Tech pack. */
  patternPackVersion?: string;
  /** Акт / протокол приёмки образца. */
  sampleAcceptanceActRef?: string;
};

/** Зафиксированная ревизия master-меток (PLM-лайт: снимок меток + комплаенс). */
export type Workshop2SketchRevisionSnapshot = {
  snapshotId: string;
  at: string;
  by: string;
  revisionLabel: string;
  leafId: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  complianceCopy?: Workshop2CategorySketchCompliance;
};

/** Детализация задач для производства по уровню подкатегории (L1 / L2 / L3). */
export type Workshop2Phase1ProductionTaskDetail = {
  /** Что нужно сделать при пошиве */
  whatToDo: string;
  /** Что улучшить относительно референса / прошлой партии */
  improve: string;
  /** Что изменить в конструкции / материале */
  change: string;
  /** На что обратить внимание (КБ, швы, фурнитура…) */
  watchAttention: string;
  owner?: string;
  priority?: Workshop2ProductionTaskPriority;
  status?: Workshop2ProductionTaskStatus;
  acceptanceCriteria?: string;
  linkedStage?: Workshop2ProductionTaskStage;
  inheritedFromLevel?: 1 | 2;
  overrideReason?: string;
  linkedAnnotationIds?: string[];
};

/**
 * Скетч модели по уровню каталога: отдельная подложка и метки + текстовые задачи для цеха.
 * Сводка габаритов/атрибутов подставляется из досье артикула кнопкой «Обновить сводку».
 */
export type Workshop2Phase1SubcategorySketchSlot = {
  slotId: string;
  /** 1 = ур.1 каталога, 2 = ур.2, 3 = ур.3 (лист) */
  level: 1 | 2 | 3;
  imageDataUrl?: string;
  imageFileName?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  productionTasks: Workshop2Phase1ProductionTaskDetail;
  /** Снимок выбранных атрибутов и мерок на момент обновления */
  attributesDimensionsSnapshot?: string;
  attributesDimensionsSnapshotUpdatedAt?: string;
};

/** Назначение доп. скетч-листа (подсказка в UI, не жёсткая схема). */
export type Workshop2SketchSheetViewKind =
  | 'front'
  | 'back'
  | 'side'
  | 'detail'
  | 'flat'
  | 'photo'
  | 'other';

/** Статус листа в цех / согласованиях (отдельно от подписи всего ТЗ). */
export type Workshop2SketchSheetWorkflowStatus = 'draft' | 'review' | 'approved';

/** Чеклист готовности листа (ручные галочки). */
export type Workshop2SketchSheetChecklist = {
  substrateConfirmed?: boolean;
  qcPinsConfirmed?: boolean;
  workshopTaskConfirmed?: boolean;
};

/**
 * Дополнительный скетч-лист: своя подложка (файл) и метки.
 * Независим от master-полей `categorySketchImage*` / `categorySketchAnnotations`.
 */
export type Workshop2Phase1SketchSheet = {
  sheetId: string;
  title?: string;
  /** Один артикул — одна сцена: тот же id на листах анфас/спина/деталь. */
  sceneId?: string;
  viewKind?: Workshop2SketchSheetViewKind;
  imageDataUrl?: string;
  imageFileName?: string;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
  /** Короткая задача цеха по этому виду (не дубль меток). */
  workshopTaskNote?: string;
  /** Обсуждение листа (не привязано к точке). */
  sheetComment?: string;
  sheetWorkflowStatus?: Workshop2SketchSheetWorkflowStatus;
  sheetChecklist?: Workshop2SketchSheetChecklist;
  /**
   * Видео-референс движения/посадки: пока URL (без своего CDN).
   * При API медиа: заменить на `referenceMotionMediaId` или подписанный URL из бэкенда.
   */
  referenceMotionVideoUrl?: string;
  referenceMotionVideoNote?: string;
};

/**
 * Шаблон набора меток (в досье артикула): структура точек без подложки;
 * при применении id и привязки к атрибутам пересоздаются.
 */
export type Workshop2SketchPinTemplate = {
  templateId: string;
  name: string;
  createdAt: string;
  viewKind?: Workshop2SketchSheetViewKind;
  annotations: Workshop2Phase1CategorySketchAnnotation[];
};

/** Снимок меток до крупной правки (без data URL подложек — только аннотации). */
export type Workshop2SketchLabelsSnapshot = {
  snapshotId: string;
  at: string;
  by: string;
  label?: string;
  masterAnnotations?: Workshop2Phase1CategorySketchAnnotation[];
  sheets?: {
    sheetId: string;
    title?: string;
    viewKind?: Workshop2SketchSheetViewKind;
    annotations: Workshop2Phase1CategorySketchAnnotation[];
  }[];
};

/** Реакция к комментарию к референсу: не более одной на участника (лайк или дизлайк). */
export type Workshop2VisualRefCommentReactionType = 'like' | 'dislike';

export type Workshop2VisualRefCommentReaction = {
  by: string;
  type: Workshop2VisualRefCommentReactionType;
};

export type Workshop2VisualRefComment = {
  commentId: string;
  by: string;
  /** ISO-8601 */
  at: string;
  text: string;
  /** Явное закрытие треда по рефу (для чеклиста «комментарии закрыты»). */
  resolved?: boolean;
  reactions?: Workshop2VisualRefCommentReaction[];
};

/** Визуальные референсы (фото, короткое видео + текст) до согласования ТЗ. */
export type Workshop2Phase1VisualReference = {
  refId: string;
  title: string;
  description?: string;
  externalUrl?: string;
  fileName?: string;
  mimeType?: string;
  /** Data URL; для крупных файлов может отсутствовать из‑за лимита localStorage. */
  previewDataUrl?: string;
  /** Обсуждение по референсу (мессенджер + реакции). */
  comments?: Workshop2VisualRefComment[];
  /** Смыслы, которые забираем с этого рефа (решение команды). */
  takeawayAspects?: Workshop2VisualRefTakeawayAspect[];
  takeawayNote?: string;
};

/** Что показывать в превью «визуал паспорта» на карточке артикула. */
export type Workshop2PassportVisualSource = 'sketch' | 'reference' | 'generated';

/** Ячейка мин–макс в досье; `nominal` — одно значение для артикула/бирки поверх допуска. */
export type Workshop2Phase1DimensionRangeCell = {
  min: string;
  max: string;
  nominal?: string;
};

/** Режим цепочки: один переключатель → условная обязательность полей приёмки сэмпла (не второй каталог). */
export type Workshop2SampleProductionChainMode =
  | 'rf_sewn'
  | 'rf_import_materials'
  | 'import_finished'
  | 'eaeu_mixed'
  | 'non_eaeu';

/**
 * Финальный слой после образца, перед отгрузкой в коллекцию (этап «приёмка сэмпла» на вкладке Fit).
 * Черновой ТН ВЭД и обоснование остаются в паспорте ТЗ; здесь — утверждённые реквизиты.
 */
/** Жёсткость целевой даты образца / пилота. */
export type Workshop2PassportDeadlineCriticality = 'hard' | 'flexible' | 'tbd';

/** Кто ведёт карточку ТЗ на шаге 1 (не оргструктура). */
export type Workshop2PassportArticleCardOwnerRole = 'designer' | 'product' | 'technologist' | 'shared';

/** План запуска: своё производство / КНП / смешанный. */
export type Workshop2PassportPlannedLaunchType = 'own_floor' | 'cmt' | 'mixed' | 'undecided';

/**
 * Сроки, объём и запуск (паспорт, шаг 1): якоря для оценки срока и объёма;
 * тип запуска и регион пошива — подсказка снабжению, не замена материалам и финальному комплаенсу.
 */
export type Workshop2PassportProductionBrief = {
  /** Целевая дата готовности образца или пилотной партии (ISO date YYYY-MM-DD). */
  targetSampleOrPilotDate?: string;
  /** Ориентир по MOQ (текст); в UI не показывается, поле оставлено для старых досье. */
  moqTargetNote?: string;
  /** Сколько образцов: не больше стольких размеров из справочника; сумма «Кол-во, шт» в табеле не выше этого числа. */
  moqTargetMaxPieces?: number;
  deadlineCriticality?: Workshop2PassportDeadlineCriticality;
  articleCardOwnerRole?: Workshop2PassportArticleCardOwnerRole;
  articleCardOwnerName?: string;
  plannedLaunchType?: Workshop2PassportPlannedLaunchType;
  /** Регион пошива / тип цеха — продуктовое правило, не дубль страны происхождения. */
  sewingRegionPlanNote?: string;
  /**
   * Целевые даты ответа по ролям на этапе ТЗ (YYYY-MM-DD): напоминание для команды, не блокирует сохранение.
   */
  tzRoleResponseDue?: {
    designer?: string;
    technologist?: string;
    manager?: string;
  };
};

export type Workshop2SampleIntakeRelease = {
  /** Для режимов пошива в РФ — явное подтверждение. */
  sewnInRussiaConfirmed?: boolean;
  /** Фактическое происхождение товара после фиксации сырья на образце. */
  countryOfOriginActual?: string;
  /** ТН ВЭД под отгрузку (финал). */
  finalTnvedCode?: string;
  /** Декларация / сертификат — реквизиты после испытаний. */
  declarationOrCertificateRef?: string;
  /** EAN / GTIN или код партии. */
  eanOrBatchCode?: string;
  /** Маркировка, ЧЗ, прослеживаемость — итог. */
  markingTraceabilityNote?: string;
  /** ТР ТС / ЕАЭС — реквизит или ссылка. */
  technicalRegulationRef?: string;
  /** ОКПД2 / отраслевой код. */
  okpd2Note?: string;
  /** Итоговый состав, если менялся на образце. */
  actualCompositionNote?: string;
};

/** true/undefined = участие/подпись на этапе; false = снято (для ТЗ — подпись этого уровня не обязательна). */
export type Workshop2TzPerRoleStageFlags = Partial<Record<Workshop2TzSignoffStageId, boolean>>;

/** Доп. роль с ответственным (без отдельной кнопки цифровой подписи в ТЗ). */
export type Workshop2TzSignatoryExtraRow = {
  rowId: string;
  roleTitle: string;
  assigneeDisplayLabel?: string;
  signStages?: Workshop2TzPerRoleStageFlags;
};

/** Закрепление уровней цифровой подписи ТЗ за исполнителями (ФИО как в профиле / списке команды). */
export type Workshop2TzSignatoryBindings = {
  designerDisplayLabel?: string;
  technologistDisplayLabel?: string;
  managerDisplayLabel?: string;
  designerSignStages?: Workshop2TzPerRoleStageFlags;
  technologistSignStages?: Workshop2TzPerRoleStageFlags;
  managerSignStages?: Workshop2TzPerRoleStageFlags;
  extraAssigneeRows?: Workshop2TzSignatoryExtraRow[];
};

export type Workshop2DossierPhase1 = {
  schemaVersion: 1;
  optionalNote?: string;
  updatedAt?: string;
  updatedBy?: string;
  /** Рабочая аудитория для brand-flow; может жить отдельно от leafId, если handbook snapshot еще не разведен по сегментам. */
  selectedAudienceId?: string;
  /** Модель унисекс (паспорт артикула). Без поля или false = нет. */
  isUnisex?: boolean;
  /** Сроки, объём, запуск, владелец ТЗ — см. `Workshop2PassportProductionBrief`. */
  passportProductionBrief?: Workshop2PassportProductionBrief;
  assignments: Workshop2Phase1AttributeAssignment[];
  /** До 5 файлов tech pack / лекал (дополнительно к ссылке и ревизии в атрибуте). */
  techPackAttachments?: Workshop2Phase1TechPackAttachment[];
  /** Референсы: описание + ссылка и/или вложение. */
  visualReferences?: Workshop2Phase1VisualReference[];
  /** Главное фото модели среди референсов (refId). */
  canonicalMainPhotoRefId?: string;
  /** Главный скетч для согласования: master или конкретный лист. */
  canonicalMainSketchTarget?: Workshop2CanonicalSketchTarget;
  /** Текущая подпись версии визуала (v1, v2…). */
  currentVisualVersionLabel?: string;
  /** Журнал «что изменилось» между версиями. */
  visualVersionLog?: Workshop2VisualVersionLogEntry[];
  /** Замысел: тезисы + mood. */
  designerIntent?: Workshop2DesignerIntentBlock;
  /** Чеклист готовности раздела «Визуал» (менеджер). */
  visualReadinessChecklist?: Workshop2VisualReadinessChecklist;
  /** Источник картинки в боковом превью паспорта (карточка SKU). */
  passportVisualSource?: Workshop2PassportVisualSource;
  /** Сгенерированные изображения (AI / рендер); при `passportVisualSource === 'generated'`. */
  passportGeneratedImageDataUrls?: string[];
  /** Своя подложка вместо типового скетча по категории (data URL). */
  categorySketchImageDataUrl?: string;
  categorySketchImageFileName?: string;
  /** Комментарии вокруг/на скетче для текущей категории. */
  categorySketchAnnotations?: Workshop2Phase1CategorySketchAnnotation[];
  /**
   * Полупрозрачное наложение для сравнения с эталоном (фото прошлой партии / референс).
   * Рисуется поверх подложки master-скетча с прозрачностью `categorySketchCompareOverlayOpacityPct`.
   */
  categorySketchCompareOverlayDataUrl?: string | null;
  categorySketchCompareOverlayFileName?: string | null;
  /** 15–100, по умолчанию в UI ~45. */
  categorySketchCompareOverlayOpacityPct?: number;
  /** Масштаб слоя эталона, % (40–200), 100 = как подложка. */
  categorySketchCompareOverlayScalePct?: number;
  /** Смещение эталона по X/Y в % ширины/высоты поля (-40…40), для совмещения опор. */
  categorySketchCompareOffsetXPct?: number;
  categorySketchCompareOffsetYPct?: number;
  /**
   * Черновики из меток (кнопка «Протянуть в посадку / ОТК»): копируйте в чек-листы или вкладку Fit/QC.
   */
  sketchPropagatedDrafts?: Workshop2SketchPropagatedDraft[];
  /** Ревизия скетча для передачи (A, B, COL26-03…). */
  categorySketchRevisionLabel?: string;
  /** Не вносить изменения в master-метки до даты без согласования (YYYY-MM-DD). */
  categorySketchFreezeUntilDate?: string;
  /** Кто утвердил скетч для производства и когда. */
  categorySketchProductionApproved?: Workshop2DossierSignoffMeta;
  /** Комплаенс: референс, версия лекал, акт образца. */
  categorySketchCompliance?: Workshop2CategorySketchCompliance;
  /** Ограничения брендбука (палитра, силуэт, запреты) — в промпт ИИ и для подсказки цеху. */
  sketchBrandbookConstraints?: string;
  /** Журнал изменений master-меток (последние записи; длина режется в UI). */
  sketchMasterAnnotationAuditLog?: Workshop2SketchAnnotationAuditEntry[];
  /** Снимки ревизий master-скетча (не подменяют текущие метки — архив для PLM). */
  categorySketchRevisionSnapshots?: Workshop2SketchRevisionSnapshot[];
  /**
   * Идентификатор «сцены» артикула: общий для master и листов (виды как в 3D — front/back/detail).
   * Листы могут дублировать в `Workshop2Phase1SketchSheet.sceneId`.
   */
  categorySketchSceneId?: string;
  /** Вид master-подложки в рамках сцены (анфас, спина…). */
  categorySketchSceneView?: Workshop2SketchSheetViewKind;
  /** Справочник кодов дефектов MES; в UI дополняется дефолтами. */
  sketchMesDefectCatalog?: Workshop2MesDefectCodeRow[];
  brandNotes?: string;
  isVerifiedByDesigner?: boolean;
  isVerifiedByTechnologist?: boolean;
  isVerifiedByManager?: boolean;
  /** Кто и когда отметил «Проверено дизайнером» (правый блок). */
  designerSignoff?: Workshop2DossierSignoffMeta;
  /** Кто и когда отметил «Проверено технологом». */
  technologistSignoff?: Workshop2DossierSignoffMeta;
  /** Менеджер (цифровая подпись). */
  managerSignoff?: Workshop2DossierSignoffMeta;
  /**
   * Цифровые подписи ТЗ для доп. ролей из паспорта (участие на этапе «ТЗ»).
   * Ключ — `rowId` из `tzSignatoryBindings.extraAssigneeRows`.
   */
  extraTzSignoffsByRowId?: Record<string, Workshop2DossierSignoffMeta>;
  /**
   * Закрепление подписей ТЗ за конкретными людьми (выбор при создании артикула).
   * Подпись уровня разрешена только если `updatedByLabel` совпадает с указанным ФИО (и есть право роли).
   */
  tzSignatoryBindings?: Workshop2TzSignatoryBindings;
  /** Галочки по секциям: бренд / технолог + метка времени. */
  sectionSignoffs?: Workshop2DossierSectionSignoffs;
  /** Журнал проставления/снятия подтверждений ТЗ (глобальные и по секциям). */
  tzActionLog?: Workshop2TzActionLogEntry[];
  /** Выбранная шкала базового размера; если нет — из правил каталога по L1. */
  sampleSizeScaleId?: string;
  /** @deprecated см. sampleBasePerSizeDimensions */
  sampleBaseDimensionOverrides?: Record<string, string>;
  /** Количество шт по строке базового размера (ключ — parameterId размера). Сумма ≤ moqTargetMaxPieces при заданном лимите образцов. */
  sampleBasePerSizePieceQty?: Record<string, number>;
  /** Габариты по каждому выбранному размеру: parameterId → (подпись мерки → значение см). */
  sampleBasePerSizeDimensions?: Record<string, Record<string, string>>;
  /** Режим ввода мин–макс по выбранным меркам (блок «Базовый размер»). */
  sampleBaseDimensionRangeMode?: boolean;
  /** Ключи мерок (как в sampleBasePerSizeDimensions), для которых показываются поля мин/макс. */
  sampleBaseDimensionRangeKeys?: string[];
  /** Явные мин/макс и опционально номинал для артикула; в sampleBasePerSizeDimensions — строка «min–макс». */
  sampleBasePerSizeDimensionRanges?: Record<
    string,
    Record<string, Workshop2Phase1DimensionRangeCell>
  >;
  /** Доп. мерки (значения в sampleBasePerSizeDimensions под ключом `__extra:${id}`). */
  sampleBaseExtraDimensions?: { id: string; label: string }[];
  /** Скрытые стандартные мерки (ключ — исходная подпись из справочника по листу). */
  sampleBaseHiddenDimensionKeys?: string[];
  /** Подписи стандартных мерок в таблице (ключ — исходная подпись из справочника). */
  sampleBaseDimensionLabelOverrides?: Record<string, string>;
  /**
   * Три слота скетчей по ур.1 / ур.2 / ур.3 каталога: детализация производственных задач
   * и опциональная сводка габаритов + атрибутов карточки артикула.
   */
  subcategorySketchSlots?: Workshop2Phase1SubcategorySketchSlot[];

  /**
   * Дополнительные скетч-листы (анфас, спина, деталь, фото…): загрузка и метки.
   * Старые `subcategorySketchSlots` сохраняются в JSON, в UI не показываются.
   */
  sketchSheets?: Workshop2Phase1SketchSheet[];

  /** История снимков меток скетча (ограничить длину в UI/нормализации). */
  sketchLabelSnapshots?: Workshop2SketchLabelsSnapshot[];

  /** Сохранённые наборы меток для повторного применения (master / листы). */
  sketchPinTemplates?: Workshop2SketchPinTemplate[];

  /** Цепочка производства / происхождения — задаёт акценты при приёмке сэмпла. */
  sampleProductionChainMode?: Workshop2SampleProductionChainMode;
  /** Обязательные финальные поля для кнопки «Принять сэмпл в коллекцию» (вкладка Fit). */
  sampleIntakeRelease?: Workshop2SampleIntakeRelease;

  /** Альтернативы материала / узла BOM (персистентно в досье до API). */
  materialAlternativeDrafts?: Workshop2MaterialAlternativeDraft[];
  /** Дельта BOM по строкам (ТЗ / образец / серия). */
  bomLineDeltaDrafts?: Workshop2BomLineDeltaDraft[];
  /** Costing-подсказки по lineRef (`mergeCostingHintsByLineRef` в UI). */
  bomLineCostingHints?: Workshop2BomLineCostingHint[];
  /**
   * Чеклист «комплаенс и сырьё» в хабе материалов (ключи — `stepId` из `W2_MATERIAL_COMPLIANCE_FLOW_STEPS`).
   * Сохраняется в досье вместе с общим persist (localStorage).
   */
  materialComplianceChecklist?: Record<string, boolean>;

  // --- Lifecycle & approvals ---

  /** Текущее состояние жизненного цикла досье. */
  lifecycleState?: Workshop2DossierLifecycleState;
  /** История ревизий и переходов между состояниями. */
  revisions?: Workshop2DossierRevision[];
  /** Записи согласований по секциям. */
  approvalRecords?: Workshop2DossierApprovalRecord[];
};

export type Workshop2DossierSignoffMeta = {
  by: string;
  /** ISO-8601 */
  at: string;
  /** Демо-отпечаток цифровой подписи (не КЭП). */
  signatureDigest?: string;
};

/** Ключи совпадают с секциями ТЗ · досье. */
export type Workshop2DossierSectionSignoffs = Partial<
  Record<
    'general' | 'visuals' | 'material' | 'construction',
    {
      brand?: Workshop2DossierSignoffMeta;
      tech?: Workshop2DossierSignoffMeta;
    }
  >
>;

/** Секции ТЗ, по которым пишется журнал (совпадает с ключами sectionSignoffs). */
export type Workshop2TzSignoffSectionKey = keyof Workshop2DossierSectionSignoffs;

export type Workshop2TzActionLogPayload =
  | { type: 'tz_global_signoff'; role: 'designer' | 'technologist' | 'manager'; set: boolean }
  | { type: 'tz_extra_signoff'; rowId: string; roleTitle: string; set: boolean }
  | {
      type: 'section_signoff';
      section: Workshop2TzSignoffSectionKey;
      role: 'brand' | 'tech';
      set: boolean;
    }
  /** Изменения данных ТЗ / карточки при сохранении или сразу после правки артикула (SKU, ветка). */
  | { type: 'dossier_edit'; summaries: string[] }
  /** Сохранён снимок меток скетча / листов. */
  | {
      type: 'sketch_labels_snapshot';
      label?: string;
      masterPins: number;
      sheetPinsTotal: number;
    }
  /** Восстановление меток из сохранённого снимка. */
  | {
      type: 'sketch_labels_restore';
      label?: string;
      snapshotAt: string;
    };

export type Workshop2TzActionLogEntry = {
  entryId: string;
  /** ISO-8601 */
  at: string;
  by: string;
  action: Workshop2TzActionLogPayload;
};

export type Workshop2DossierLifecycleState =
  | 'draft'
  | 'handoff_ready'
  | 'sent_to_production'
  | 'accepted'
  | 'rework_requested';

export type Workshop2DossierRevision = {
  revisionId: string;
  state: Workshop2DossierLifecycleState;
  changedAt: string;
  changedBy: string;
  comment?: string;
};

export type Workshop2DossierApprovalRecord = {
  approvalId: string;
  role: 'designer' | 'technologist' | 'brand_manager' | 'production_lead';
  decision: 'approved' | 'rejected' | 'rework';
  at: string;
  by: string;
  comment?: string;
  section?: string;
};
