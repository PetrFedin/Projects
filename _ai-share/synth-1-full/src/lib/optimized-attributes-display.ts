import { allAttributeOptions } from './product-attributes';
import { sportTypeOptionsByCategory } from './data/sport-type-attributes';
import { removedFromCategoriesAttributeOptions } from './data/removed-from-categories-attributes';

export type OptimizedAttributeCard = {
  key: string;
  label: string;
  values: string[];
};

/** Атрибуты, дублирующие категории / подтипы товара — не показываем в оптимизированном справочнике. */
const OMIT_AS_CATEGORY_LIKE = new Set([
  'newbornAccessoryOptions',
  'strollerTypeOptions',
  'strollerSeatAndBassinetOptions',
  'strollerAccessoryOptions',
  'outerwearSubtypeOptions',
  'trouserTypeOptions',
  'shoeUsageOptions',
  'productGroupOptions',
  'maskBuffTypeOptions',
]);

const GADGET_CLUSTER_SOURCES = [
  'watchAndGadgetOptions',
  'techAccessoryOptions',
  'lifestyleGadgetOptions',
  'newbornGadgetOptions',
] as const;
export const GADGET_CLUSTER_KEY = 'gadgetWearableTechOptions';

const STYLE_OCCASION_SOURCES = ['styleOptions', 'occasionOptions', 'activityTypeOptions'] as const;
export const STYLE_OCCASION_KEY = 'styleOccasionOptions';

/** Базовые поля ТЗ / артикула (все категории). */
/** Порядок как в паспорте артикула: сезон и стиль → страны → ТН ВЭД → маркировка/ТР → цвет и состав. */
export const TZ_ARTICLE_BASE_KEYS_ORDER: string[] = [
  'season',
  'styleOccasionOptions',
  'countryOfOriginMarketOptions',
  'certificationMarksOptions',
  'customsHsDeclarationOptions',
  'productBarcodeTypeOptions',
  'customsProductGroupOptions',
  'customsTnvedCodePrimary',
  'customsTnvedCodeSecondary',
  'customsTnvedCodeTertiary',
  'customsTnvedPreliminaryCode',
  'customsTnvedShipmentApprovedCode',
  'customsClassificationRationale',
  'okpd2CodeNote',
  'countryOfGoodsOriginOptions',
  'nationalMarkingTraceabilityOptions',
  'technicalRegulationEaeskOptions',
  'technicalRegulationDocReference',
  'customsValueIncotermsNote',
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
  'fabricCompositionPresetOptions',
  'fabricCompositionDetailClassOptions',
  'careWashingClassOptions',
  'articleWeightPackagingClassOptions',
  'packagingDimensionsClassOptions',
];

/** Обувь и сумки, затем шкалы по одной карточке на атрибут (без свалки в один список с префиксами). */
const DIMENSION_KEYS_ORDER: string[] = [
  'footwearShaftHeightOptions',
  'heelHeightOptions',
  'shoeUpperMaterialOptions',
  'shoeSoleMaterialOptions',
  'shoeLiningMaterialOptions',
  'shoeInsoleMaterialOptions',
  'shoeWidthFittingOptions',
  'bagSizeClassOptions',
  'bagCarryStyleOptions',
  'bagLaptopCompatInchesOptions',
  'bagCompartmentLayoutOptions',
];

/** Длина / протяжённость: разнесено по типам изделия (привязка к L1–L3 — на стороне категорий). */
const GARMENT_LENGTH_KEYS_ORDER: string[] = [
  'garmentLengthApparelOptions',
  'glovesLengthOptions',
  'scarfAndTieLengthOptions',
  'neckJewelryLengthOptions',
  'headwearFitDepthOptions',
  'homeTextileLengthOptions',
  'decorScaleOptions',
];

/** Порядок после сумок: аксессуары-шкалы → парфюм/косметика/дом → нишевые оси. */
const SCALE_AND_NICHE_KEYS_ORDER: string[] = [
  'fragranceVolumeClassOptions',
  'fragranceConcentrationOptions',
  'cosmeticApplicationZoneOptions',
  'cosmeticSpfClassOptions',
  'cosmeticFinishOptions',
  'cosmeticInciDeclarationOptions',
  'hosierySockHeightOptions',
  'hosieryDenierOptions',
  'hosieryPurposeOptions',
  'hosieryCompressionClassOptions',
  'kerchiefScarfTypeOptions',
  'kerchiefScarfSizeOptions',
  'smallLeatherGoodsTypeOptions',
  'walletCardSlotCapacityOptions',
  'walletRfidOptions',
  'luggageVolumeLitersOptions',
  'luggageCarryOnClassOptions',
  'luggageShellTypeOptions',
  'luggageWheelOptions',
  'bodyCareFormatOptions',
  'bodyCareVolumeClassOptions',
  'skinTypeTargetOptions',
  'hairTypeTargetOptions',
  'petSizeClassOptions',
  'petFurnitureOptions',
  'petAccessoriesOptions',
  'petGarmentBackLengthClassOptions',
  'toyAgeMarkingOptions',
  'toySafetyComplianceOptions',
  'faceCoveringTypeOptions',
  'faceCoveringLayerOptions',
  'gadgetPowerInterfaceOptions',
  'eyewearLensFeatureOptions',
  'jewelryMetalPlatingOptions',
  'newbornFeedingVolumePresetOptions',
  'newbornDiaperSizeOptions',
  'newbornTextileSwaddleOptions',
  'newbornCarrierSlingOptions',
  'newbornPacifierShapeOptions',
  'newbornHygieneProductOptions',
  'strollerSystemClassOptions',
  'curtainAndBlindTypeOptions',
  'carpetPileAndWeaveOptions',
  'windowTextileSizePresetOptions',
];

const SPORT_BY_CATEGORY_KEY = 'sportTypeOptionsByCategory';
export const SPORT_FLAT_KEY = 'sportDisciplineOptions';

const DISPLAY_LABELS: Record<string, string> = {
  [GADGET_CLUSTER_KEY]: 'Гаджеты, часы и техника (единый справочник)',
  season: 'Сезонность',
  [STYLE_OCCASION_KEY]: 'Стиль, повод и активность',
  [SPORT_FLAT_KEY]: 'Вид спорта / дисциплина',
  toyTypeOptionsAll: 'Тип игрушек (детские)',
  clothingFitOptions: 'Посадка / силуэт',
  garmentLengthApparelOptions: 'Одежда: длина изделия',
  glovesLengthOptions: 'Перчатки: длина',
  scarfAndTieLengthOptions: 'Шарф и галстук: длина',
  neckJewelryLengthOptions: 'Украшения на шею: длина',
  headwearFitDepthOptions: 'Головные уборы: глубина посадки',
  homeTextileLengthOptions: 'Текстиль для дома: длина / протяжённость',
  decorScaleOptions: 'Декор: масштаб',
  sleeveOptionsByCategory: 'Длина рукава',
  cuffOptionsByCategory: 'Манжеты',
  collarOptionsByCategory: 'Воротник / вырез',
  fasteningOptionsByCategory: 'Застёжка',
  waistOptionsByCategory: 'Линия талии / посадка по талии (одежда)',
  footwearShaftHeightOptions: 'Обувь: высота подъёма / голенища',
  heelHeightOptions: 'Обувь: высота каблука / платформы',
  bagSizeClassOptions: 'Сумки: размер / объём класса',
  bagCarryStyleOptions: 'Сумки: способ ношения',
  fragranceVolumeClassOptions: 'Парфюмерия: объём флакона',
  hosierySockHeightOptions: 'Носки и чулки: высота',
  hosieryDenierOptions: 'Носки и чулки: плотность (денье)',
  hosieryPurposeOptions: 'Носки и чулки: назначение',
  hosieryCompressionClassOptions: 'Носки и чулки: компрессия',
  kerchiefScarfTypeOptions: 'Платки и шали: тип',
  kerchiefScarfSizeOptions: 'Платки и шали: размер',
  smallLeatherGoodsTypeOptions: 'Кожгалантерея мелкая: тип изделия',
  walletCardSlotCapacityOptions: 'Кожгалантерея: вместимость (карманы для карт)',
  walletRfidOptions: 'Кожгалантерея: защита бесконтактных карт (RFID)',
  luggageVolumeLitersOptions: 'Багаж: объём (л)',
  luggageCarryOnClassOptions: 'Багаж: класс / ручная кладь',
  luggageShellTypeOptions: 'Багаж: корпус',
  luggageWheelOptions: 'Багаж: колёса и ручки',
  bodyCareFormatOptions: 'Уход за телом: формат',
  bodyCareVolumeClassOptions: 'Уход за телом: объём',
  skinTypeTargetOptions: 'Уход: тип кожи',
  hairTypeTargetOptions: 'Уход: тип волос',
  petSizeClassOptions: 'Питомцы: размер',
  petFurnitureOptions: 'Питомцы: мебель',
  petAccessoriesOptions: 'Питомцы: аксессуары',
  curtainAndBlindTypeOptions: 'Шторы и жалюзи: тип',
  carpetPileAndWeaveOptions: 'Ковры: ворс и плетение',
  windowTextileSizePresetOptions: 'Шторы / текстиль: типовые размеры',
  pocketOptions: 'Карманы',
  liningOptionsByCategory: 'Подкладка',
  stitchingOptionsByCategory: 'Стёжка',
  decorOptionsByCategory: 'Декор',
  hardwareOptionsByCategory: 'Фурнитура',
  fabricTextureOptions: 'Фактура ткани',
  knitStitchOptions: 'Тип вязки / структура полотна',
  processingTechOptionsByCategory: 'Технология обработки',
  patternOptionsByCategory: 'Узор',
  shoulderOptionsByCategory: 'Плечо',
  backDetailOptionsByCategory: 'Детали спинки',
  hemTypeOptionsByCategory: 'Тип подола',
  waistbandOptionsByCategory: 'Пояс и ремень (в т.ч. посадка ремня и ширина полотна — блок «Аксессуары»)',
  transformationOptionsByCategory: 'Трансформация',
  reinforcementOptionsByCategory: 'Усиление',
  seamOptionsByCategory: 'Шов',
  combinationOptionsByCategory: 'Комбинация материалов',
  draperyOptionsByCategory: 'Драпировка / Складки',
  hemFinishOptionsByCategory: 'Обработка края',
  materialOptions: 'Материал',
  insulationMaterialOptions: 'Материал утеплителя',
  temperatureOptions: 'Температурный режим',
  insulationLevelOptions: 'Уровень утепления',
  thermoTechOptions: 'Термо-технологии',
  umbrellaTypeOptions: 'Тип зонтов',
  eyewearTypeOptions: 'Тип очков',
  jewelryTypeOptions: 'Тип украшений',
  specialNeedsOptions: 'Специальные группы',
  mattressTypeOptions: 'Типы матрасов',
  pillowTypeOptions: 'Типы подушек',
  blanketTypeOptions: 'Типы одеял',
  primaryColorFamilyOptions: 'Цвет основной (артикул / ТЗ)',
  fabricCompositionPresetOptions: 'Состав (пресеты для ТЗ)',
  careWashingClassOptions: 'Уход: стирка и обработка (ТЗ)',
  countryOfOriginMarketOptions: 'Страна производства',
  countryOfGoodsOriginOptions: 'Страна происхождения товара',
  certificationMarksOptions: 'Сертификаты и маркировки',
  technicalRegulationEaeskOptions: 'Техрегламенты ЕАЭС / соответствие',
  technicalRegulationDocReference: 'Декларация/сертификат: номер и реквизиты',
  articleWeightPackagingClassOptions: 'Вес нетто (класс)',
  customsProductGroupOptions: 'ТН ВЭД / товарная группа',
  customsTnvedCodePrimary: 'ТН ВЭД ЕАЭС: основной код',
  customsTnvedCodeSecondary: 'ТН ВЭД ЕАЭС: второй код',
  customsTnvedCodeTertiary: 'ТН ВЭД ЕАЭС: третий код',
  customsTnvedPreliminaryCode: 'ТН ВЭД: предварительный код',
  customsTnvedShipmentApprovedCode: 'ТН ВЭД: код для отгрузки',
  customsClassificationRationale: 'ТН ВЭД: обоснование классификации',
  okpd2CodeNote: 'ОКПД 2',
  nationalMarkingTraceabilityOptions: 'Маркировка и прослеживаемость',
  customsValueIncotermsNote: 'Таможенная стоимость / Incoterms',
  fabricWeightGsmPresetOptions: 'Плотность полотна (г/м²)',
  yarnGaugePresetOptions: 'Плотность вязки (gg / класс)',
  shoeUpperMaterialOptions: 'Обувь: материал верха',
  shoeSoleMaterialOptions: 'Обувь: материал подошвы',
  shoeLiningMaterialOptions: 'Обувь: подклад',
  shoeWidthFittingOptions: 'Обувь: полнота / колодка',
  bagLaptopCompatInchesOptions: 'Сумки: ноутбук до (дюймы)',
  bagCompartmentLayoutOptions: 'Сумки: отделения и раскладка',
  eyewearLensFeatureOptions: 'Очки: линзы и опции',
  jewelryMetalPlatingOptions: 'Украшения: металл и покрытие',
  fragranceConcentrationOptions: 'Парфюмерия: концентрация',
  cosmeticApplicationZoneOptions: 'Косметика: зона нанесения',
  cosmeticSpfClassOptions: 'Косметика: SPF',
  cosmeticFinishOptions: 'Косметика: финиш',
  toyAgeMarkingOptions: 'Игрушки: возрастная маркировка',
  toySafetyComplianceOptions: 'Игрушки: безопасность и стандарты',
  faceCoveringTypeOptions: 'Маски / бафы: тип изделия',
  faceCoveringLayerOptions: 'Маски / бафы: слои',
  gadgetPowerInterfaceOptions: 'Гаджеты: питание и интерфейс',
  petGarmentBackLengthClassOptions: 'Питомцы: длина спины (одежда)',
  newbornFeedingVolumePresetOptions: 'Новорождённые: объём бутылки / поильника',
  newbornDiaperSizeOptions: 'Новорождённые: размер подгузника',
  newbornTextileSwaddleOptions: 'Новорождённые: пелёнки и текстиль',
  newbornCarrierSlingOptions: 'Новорождённые: переноски и слинги',
  newbornPacifierShapeOptions: 'Новорождённые: соски и пустышки',
  newbornHygieneProductOptions: 'Новорождённые: гигиена и купание',
  strollerSystemClassOptions: 'Новорождённые: коляски и системы',
  productBarcodeTypeOptions: 'Идентификатор товара (штрихкод / QR)',
  colorReferenceSystemOptions: 'Референс цвета (Pantone, RAL, код)',
  fabricCompositionDetailClassOptions: 'Состав: формат в ТЗ (слои, таблица)',
  customsHsDeclarationOptions: 'ТН ВЭД: как задаётся код',
  packagingDimensionsClassOptions: 'Упаковка: габариты (класс)',
  shoeInsoleMaterialOptions: 'Обувь: стелька',
  cosmeticInciDeclarationOptions: 'Состав / INCI (декларация)',
};

/** Порядок ключей в справочнике подборки (используется в project-info / категории). */
export const OPTIMIZED_ATTRIBUTE_KEY_PRIORITY_ORDER: string[] = [
  'materialOptions',
  STYLE_OCCASION_KEY,
  ...TZ_ARTICLE_BASE_KEYS_ORDER,
  'toyTypeOptionsAll',
  'temperatureOptions',
  'insulationMaterialOptions',
  'insulationLevelOptions',
  'thermoTechOptions',
  'clothingFitOptions',
  ...GARMENT_LENGTH_KEYS_ORDER,
  'waistbandOptionsByCategory',
  ...DIMENSION_KEYS_ORDER,
  ...SCALE_AND_NICHE_KEYS_ORDER,
  'fabricTextureOptions',
  'knitStitchOptions',
  'fabricWeightGsmPresetOptions',
  'yarnGaugePresetOptions',
  'patternOptionsByCategory',
  'processingTechOptionsByCategory',
];

const PRIORITY_KEYS: string[] = OPTIMIZED_ATTRIBUTE_KEY_PRIORITY_ORDER;

function norm(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

function dedupeLocal(arr: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of arr) {
    const s = norm(raw);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/** Собирает все строковые значения из массива опций или объекта *ByCategory. */
export function flattenToStrings(v: unknown): string[] {
  if (v == null) return [];
  if (typeof v === 'string') {
    const s = norm(v);
    return s ? [s] : [];
  }
  if (Array.isArray(v)) {
    const out: string[] = [];
    for (const item of v) {
      if (typeof item === 'string') out.push(item);
      else if (item && typeof item === 'object') {
        const o = item as { label?: string; value?: string };
        const t = o.label ?? o.value;
        if (typeof t === 'string') out.push(t);
      }
    }
    return out;
  }
  if (typeof v === 'object') {
    const out: string[] = [];
    for (const sub of Object.values(v as Record<string, unknown>)) {
      out.push(...flattenToStrings(sub));
    }
    return out;
  }
  return [];
}

function sortKeys(keys: string[]): string[] {
  const pri = new Set(PRIORITY_KEYS);
  const first = PRIORITY_KEYS.filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !pri.has(k)).sort((a, b) => a.localeCompare(b, 'ru'));
  return [...first, ...rest];
}

function buildPreprocessedMap(): Record<string, unknown> {
  const m: Record<string, unknown> = {
    ...allAttributeOptions,
    [SPORT_BY_CATEGORY_KEY]: sportTypeOptionsByCategory,
    ...removedFromCategoriesAttributeOptions,
  };

  for (const k of OMIT_AS_CATEGORY_LIKE) {
    delete m[k];
  }

  const styleOccasionVals: string[] = [];
  for (const s of STYLE_OCCASION_SOURCES) {
    if (m[s] != null) {
      styleOccasionVals.push(...flattenToStrings(m[s]));
      delete m[s];
    }
  }
  if (styleOccasionVals.length) {
    m[STYLE_OCCASION_KEY] = dedupeLocal(styleOccasionVals);
  }

  const gadgetVals: string[] = [];
  for (const s of GADGET_CLUSTER_SOURCES) {
    if (m[s] != null) {
      gadgetVals.push(...flattenToStrings(m[s]));
      delete m[s];
    }
  }
  if (gadgetVals.length) {
    m[GADGET_CLUSTER_KEY] = dedupeLocal(gadgetVals);
  }

  if (m[SPORT_BY_CATEGORY_KEY] != null) {
    m[SPORT_FLAT_KEY] = dedupeLocal(flattenToStrings(m[SPORT_BY_CATEGORY_KEY]));
    delete m[SPORT_BY_CATEGORY_KEY];
  }

  return m;
}

/**
 * Карточки для UI: стиль+повод+активность и гаджеты — объединены; спорт — плоский список;
 * остальное — отдельная карточка на атрибут (шкалы аксессуаров, парфюм/дом, носки, багаж, уход, питомцы…).
 */
export function getOptimizedAttributeCards(): OptimizedAttributeCard[] {
  const raw = buildPreprocessedMap();
  const keys = sortKeys(Object.keys(raw));
  const globalSeen = new Set<string>();
  const cards: OptimizedAttributeCard[] = [];

  for (const key of keys) {
    const local = dedupeLocal(flattenToStrings(raw[key]));
    const values = local.filter((s) => {
      if (globalSeen.has(s)) return false;
      globalSeen.add(s);
      return true;
    });
    if (values.length === 0) continue;
    cards.push({
      key,
      label: DISPLAY_LABELS[key] ?? key.replace(/Options$/, '').replace(/ByCategory$/, ''),
      values,
    });
  }

  return cards;
}
