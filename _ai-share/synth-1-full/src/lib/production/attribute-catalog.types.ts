/** Инстанс JSON каталога атрибутов (не путать с файлом схемы schemas/attribute-catalog.json). */

/** Совпадает с Workshop2SketchAnnotationType — без импорта из dossier.types. */
export type AttributeCatalogSketchPinType =
  | 'construction'
  | 'material'
  | 'fit'
  | 'finishing'
  | 'hardware'
  | 'labeling'
  | 'qc';

export type AttributeCatalogParameter = {
  parameterId: string;
  label: string;
  sortOrder: number;
  aliases?: string[];
  deprecated?: boolean;
  replacedByParameterId?: string;
  /** Сплошной цвет для кружка в UI */
  colorHex?: string;
  /** CSS background (linear-gradient) для пресета */
  gradientCss?: string;
};

export type AttributeCatalogAttribute = {
  attributeId: string;
  groupId: string;
  name: string;
  type: 'select' | 'multiselect' | 'text' | 'number';
  sortOrder: number;
  parameters: AttributeCatalogParameter[];
  allowFreeText: boolean;
  allowMultipleDistinct: boolean;
  requiredForPhase1?: boolean;
  /** Обязательно к заполнению перед переходом с шага 2 на шаг 3. */
  requiredForPhase2?: boolean;
  uiPlaceholder?: string;
  /** В каких фазах атрибут заполняется (экран фазы 1 — только `1`). */
  workflowPhases?: number[];
  uiPresentation?: 'default' | 'color_palette';
  /** Пояснение под заголовком (например, связь с биркой состава). */
  uiInformationHint?: string;
  /** Доп. текст для детальной подсказки в ТЗ (как у групп в каталоге). */
  descriptionHint?: string;
  /** Декларативная привязка к секции досье. Если не указано — определяется из groupId. */
  dossierSection?: 'general' | 'visuals' | 'material' | 'measurements' | 'construction' | 'packaging';
  /**
   * Типы меток скетча: при активной метке такого типа это поле (если секция «Визуал» на листе)
   * подсвечивается в блоке визуальных осей и попадает в быстрые ссылки в инспекторе метки.
   * Дополняет жёсткую матрицу `workshop2-sketch-tz-matrix`.
   */
  sketchHighlightForPinTypes?: AttributeCatalogSketchPinType[];
  /**
   * Общий регуляторный/идентификационный слой (ТН ВЭД, страны, маркировка…) — в справочнике паспорта и чеклистах.
   * Если не задано, для подсказок используется эвристика по id и globalAttributeIds.
   */
  passportCommon?: boolean;
  /**
   * На каких уровнях ветки каталога атрибут имеет смысл (ур.1 линия / ур.2 группа / лист ур.3).
   * Пусто или отсутствует — эвристика в `workshop2-passport-attribute-reference`.
   */
  passportApplicableLevels?: ('l1' | 'l2' | 'l3')[];
  /** Скрыть в мастере ТЗ; сохранённые значения в досье не трогаем. */
  retiredFromWorkshop?: boolean;
};

export type AttributeCatalogSizeScale = {
  label: string;
  sortOrder?: number;
  parameterIds: string[];
};

export type AttributeCatalogGroup = {
  groupId: string;
  label: string;
  descriptionHint?: string;
  sortOrder: number;
  scope: 'leaf' | 'global' | 'both';
  /** Примеры формулировок для подсказки под «свой атрибут». */
  phase1HintExamples?: string[];
};

export type AttributeCatalogInstance = {
  schemaVersion: number;
  catalogVersion?: string;
  updatedAt?: string;
  groups: AttributeCatalogGroup[];
  attributes: AttributeCatalogAttribute[];
  globalAttributeIds?: string[];
  leafBindings?: Record<string, string[]>;
  /** Порядок отображения на фазе 1 (фильтруется по фактическим id для листа). */
  phase1CoreOrder?: string[];
  /** Шкалы размеров для атрибута базового размера (по `parameterIds`). */
  sizeScales?: Record<string, AttributeCatalogSizeScale>;
  /**
   * Ограничение значений справочника по ур. 1 категории (имя L1 из справочника листьев).
   * Если для атрибута записи нет — показываются все параметры атрибута.
   */
  parameterAllowlistByL1Name?: Record<string, Partial<Record<string, string[]>>>;
  /**
   * Точечные исключения по leafId (перекрывает allowlist по L1 для этого листа).
   */
  parameterAllowlistByLeafId?: Record<string, Partial<Record<string, string[]>>>;
};
