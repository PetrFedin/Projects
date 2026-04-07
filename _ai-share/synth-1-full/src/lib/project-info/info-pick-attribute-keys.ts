/**
 * Оси справочника подборки для листа L1→L2→L3 (project-info / категории).
 * Глобальный блок ТЗ на артикул: `TZ_ARTICLE_BASE_KEYS_ORDER` + обязательные цвет/состав/уход/страна.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import {
  getOptimizedAttributeCards,
  TZ_ARTICLE_BASE_KEYS_ORDER,
} from '@/lib/optimized-attributes-display';
import { getTzLeafExtraRequirements } from '@/lib/project-info/tz-leaf-requirements.generated';

const STYLE_KEY = 'styleOccasionOptions';

const TZ_ARTICLE_BASE = new Set<string>(TZ_ARTICLE_BASE_KEYS_ORDER);

/** Обязательные для любой КТТ (кроме чистого fallback). */
const GLOBAL_TZ_REQUIRED = new Set<string>([
  'primaryColorFamilyOptions',
  'colorReferenceSystemOptions',
  'fabricCompositionPresetOptions',
  'fabricCompositionDetailClassOptions',
  'careWashingClassOptions',
  'countryOfOriginMarketOptions',
  'productBarcodeTypeOptions',
]);

const APPAREL_CONSTRUCTION = new Set([
  'clothingFitOptions',
  'garmentLengthApparelOptions',
  'sleeveOptionsByCategory',
  'cuffOptionsByCategory',
  'collarOptionsByCategory',
  'fasteningOptionsByCategory',
  'waistOptionsByCategory',
  'pocketOptions',
  'liningOptionsByCategory',
  'stitchingOptionsByCategory',
  'decorOptionsByCategory',
  'hardwareOptionsByCategory',
  'fabricTextureOptions',
  'processingTechOptionsByCategory',
  'patternOptionsByCategory',
  'shoulderOptionsByCategory',
  'backDetailOptionsByCategory',
  'hemTypeOptionsByCategory',
  'waistbandOptionsByCategory',
  'transformationOptionsByCategory',
  'reinforcementOptionsByCategory',
  'seamOptionsByCategory',
  'combinationOptionsByCategory',
  'draperyOptionsByCategory',
  'hemFinishOptionsByCategory',
  'specialNeedsOptions',
]);

const OUTERWEAR_THERMO = new Set([
  'temperatureOptions',
  'insulationMaterialOptions',
  'insulationLevelOptions',
  'thermoTechOptions',
]);

/**
 * Доп. обязательные поля ТЗ (сезон, упаковка, ТН ВЭД, сертификаты) задаются по полному листу L1›L2›L3
 * в `tz-leaf-requirements.generated.ts` (132 уникальных пути из справочника). Пересборка матрицы:
 * `npm run gen:tz-leaf-requirements`; правила — в `scripts/gen-tz-leaf-requirements.mjs`.
 */
function addTzLeafDrivenRequiredKeys(r: Set<string>, l1: string, l2: string, l3: string): void {
  const tz = getTzLeafExtraRequirements(l1, l2, l3);
  if (tz.packagingDimensionsRequired) r.add('packagingDimensionsClassOptions');
  if (tz.customsHsDeclarationRequired) r.add('customsHsDeclarationOptions');
  if (tz.certificationMarksRequired) r.add('certificationMarksOptions');
  if (tz.collectionSeasonRequired) r.add('season');
}

function addMaterialAndStyle(s: Set<string>): void {
  s.add('materialOptions');
  s.add(STYLE_KEY);
}

function addTzArticleBase(s: Set<string>): void {
  TZ_ARTICLE_BASE.forEach((k) => s.add(k));
}

/** Оси для «Дом › Текстиль»: по L3. */
function addHomeTextileKeysForL3(s: Set<string>, l3Name: string): void {
  const t = l3Name.trim();
  s.add('homeTextileLengthOptions');
  s.add('fabricTextureOptions');
  s.add('patternOptionsByCategory');
  s.add('processingTechOptionsByCategory');
  s.add('fabricWeightGsmPresetOptions');
  switch (t) {
    case 'Пледы':
      s.add('blanketTypeOptions');
      break;
    case 'Скатерти':
      break;
    case 'Постельное':
      s.add('blanketTypeOptions');
      s.add('pillowTypeOptions');
      s.add('mattressTypeOptions');
      break;
    case 'Полотенца':
    case 'Коврики для ванной':
      break;
    case 'Шторы':
      s.add('curtainAndBlindTypeOptions');
      s.add('windowTextileSizePresetOptions');
      break;
    default:
      s.add('blanketTypeOptions');
      s.add('pillowTypeOptions');
      s.add('mattressTypeOptions');
      s.add('curtainAndBlindTypeOptions');
      s.add('carpetPileAndWeaveOptions');
      s.add('windowTextileSizePresetOptions');
  }
}

function addNewbornKeysByL3(s: Set<string>, l2: string, l3: string): void {
  if (l2 === 'Коляски') {
    s.add('strollerSystemClassOptions');
    return;
  }
  if (l2 !== 'Аксессуары') return;
  switch (l3) {
    case 'Бутылочки':
    case 'Поильники':
      s.add('newbornFeedingVolumePresetOptions');
      break;
    case 'Подгузники':
      s.add('newbornDiaperSizeOptions');
      break;
    case 'Пелёнки':
      s.add('newbornTextileSwaddleOptions');
      break;
    case 'Переноски и слинги':
      s.add('newbornCarrierSlingOptions');
      break;
    case 'Соски и пустышки':
      s.add('newbornPacifierShapeOptions');
      break;
    case 'Гигиена и купание':
      s.add('newbornHygieneProductOptions');
      break;
    default:
      s.add('newbornFeedingVolumePresetOptions');
      break;
  }
}

function addNewbornRequiredByL3(r: Set<string>, l2: string, l3: string): void {
  if (l2 === 'Коляски') {
    r.add('strollerSystemClassOptions');
    return;
  }
  if (l2 !== 'Аксессуары') return;
  switch (l3) {
    case 'Бутылочки':
    case 'Поильники':
      r.add('newbornFeedingVolumePresetOptions');
      break;
    case 'Подгузники':
      r.add('newbornDiaperSizeOptions');
      break;
    case 'Пелёнки':
      r.add('newbornTextileSwaddleOptions');
      break;
    case 'Переноски и слинги':
      r.add('newbornCarrierSlingOptions');
      break;
    case 'Соски и пустышки':
      r.add('newbornPacifierShapeOptions');
      break;
    case 'Гигиена и купание':
      r.add('newbornHygieneProductOptions');
      break;
    default:
      r.add('newbornFeedingVolumePresetOptions');
      break;
  }
}

/**
 * Набор ключей опций для листа L1+L2 (+ L3 где учтён).
 */
export function collectInfoPickAttributeKeys(l1Name: string, l2Name: string, l3Name: string): Set<string> {
  const s = new Set<string>();
  const l1 = l1Name.trim();
  const l2 = l2Name.trim();
  const l3 = l3Name.trim();

  if (l1 === 'Одежда') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    APPAREL_CONSTRUCTION.forEach((k) => s.add(k));
    s.add('fabricWeightGsmPresetOptions');
    if (l2 === 'Трикотаж') {
      s.add('knitStitchOptions');
      s.add('yarnGaugePresetOptions');
    }
    if (l2 === 'Верхняя одежда') {
      OUTERWEAR_THERMO.forEach((k) => s.add(k));
    }
    if (l2 === 'Спортивная одежда') {
      s.add('sportDisciplineOptions');
    }
    return s;
  }

  if (l1 === 'Обувь') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    for (const k of [
      'footwearShaftHeightOptions',
      'heelHeightOptions',
      'shoeUpperMaterialOptions',
      'shoeSoleMaterialOptions',
      'shoeLiningMaterialOptions',
      'shoeInsoleMaterialOptions',
      'shoeWidthFittingOptions',
      'fasteningOptionsByCategory',
      'fabricTextureOptions',
      'patternOptionsByCategory',
      'processingTechOptionsByCategory',
      'hardwareOptionsByCategory',
    ]) {
      s.add(k);
    }
    return s;
  }

  if (l1 === 'Сумки') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    for (const k of [
      'hardwareOptionsByCategory',
      'fabricTextureOptions',
      'patternOptionsByCategory',
      'processingTechOptionsByCategory',
      'decorOptionsByCategory',
      'bagLaptopCompatInchesOptions',
      'bagCompartmentLayoutOptions',
    ]) {
      s.add(k);
    }
    if (l2 === 'Чемоданы' || l2 === 'Спортивные и дорожные') {
      for (const k of [
        'luggageVolumeLitersOptions',
        'luggageCarryOnClassOptions',
        'luggageShellTypeOptions',
        'luggageWheelOptions',
      ]) {
        s.add(k);
      }
    }
    if (l2 !== 'Чемоданы') {
      s.add('bagSizeClassOptions');
      s.add('bagCarryStyleOptions');
    }
    return s;
  }

  if (l1 === 'Аксессуары') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    for (const k of [
      'fabricTextureOptions',
      'patternOptionsByCategory',
      'hardwareOptionsByCategory',
      'processingTechOptionsByCategory',
    ]) {
      s.add(k);
    }
    if (l2 === 'Ремни и подтяжки') {
      s.add('waistbandOptionsByCategory');
    }
    if (l2 === 'Перчатки и варежки') {
      s.add('glovesLengthOptions');
    }
    if (l2 === 'Шарфы' || l2 === 'Галстуки и бабочки') {
      s.add('scarfAndTieLengthOptions');
    }
    if (l2 === 'Платки') {
      s.add('kerchiefScarfTypeOptions');
      s.add('kerchiefScarfSizeOptions');
    }
    if (l2 === 'Украшения') {
      s.add('jewelryTypeOptions');
      s.add('neckJewelryLengthOptions');
      s.add('jewelryMetalPlatingOptions');
    }
    if (l2 === 'Очки') {
      s.add('eyewearTypeOptions');
      s.add('eyewearLensFeatureOptions');
    }
    if (l2 === 'Кожгалантерея мелкая') {
      s.add('smallLeatherGoodsTypeOptions');
      s.add('walletCardSlotCapacityOptions');
      s.add('walletRfidOptions');
    }
    if (l2 === 'Зонты') {
      s.add('umbrellaTypeOptions');
    }
    if (l2 === 'Тех-аксессуары') {
      s.add('gadgetWearableTechOptions');
      s.add('gadgetPowerInterfaceOptions');
    }
    if (l2 === 'Маски и бафы') {
      s.add('faceCoveringTypeOptions');
      s.add('faceCoveringLayerOptions');
    }
    return s;
  }

  if (l1 === 'Головные уборы') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    s.add('headwearFitDepthOptions');
    if (l2 === 'Шапки' || l2 === 'Береты') {
      s.add('knitStitchOptions');
      s.add('yarnGaugePresetOptions');
    }
    for (const k of [
      'fabricTextureOptions',
      'fabricWeightGsmPresetOptions',
      'patternOptionsByCategory',
      'hardwareOptionsByCategory',
      'fasteningOptionsByCategory',
      'decorOptionsByCategory',
    ]) {
      s.add(k);
    }
    return s;
  }

  if (l1 === 'Носочно-чулочные') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    for (const k of [
      'hosierySockHeightOptions',
      'hosieryDenierOptions',
      'hosieryPurposeOptions',
      'hosieryCompressionClassOptions',
      'fabricTextureOptions',
      'fabricWeightGsmPresetOptions',
      'patternOptionsByCategory',
    ]) {
      s.add(k);
    }
    return s;
  }

  if (l1 === 'Красота и уход') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    s.add('cosmeticInciDeclarationOptions');
    if (l2 === 'Парфюмерия') {
      s.add('fragranceVolumeClassOptions');
      s.add('fragranceConcentrationOptions');
    } else if (l2 === 'Косметика') {
      s.add('bodyCareFormatOptions');
      s.add('bodyCareVolumeClassOptions');
      s.add('cosmeticApplicationZoneOptions');
      s.add('cosmeticSpfClassOptions');
      s.add('cosmeticFinishOptions');
    } else {
      s.add('bodyCareFormatOptions');
      s.add('bodyCareVolumeClassOptions');
      s.add('skinTypeTargetOptions');
      s.add('hairTypeTargetOptions');
    }
    return s;
  }

  if (l1 === 'Дом и стиль жизни') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    if (l2 === 'Текстиль') {
      addHomeTextileKeysForL3(s, l3);
      return s;
    }
    if (l2 === 'Декор') {
      s.add('decorScaleOptions');
      s.add('fabricTextureOptions');
      s.add('patternOptionsByCategory');
    }
    if (l2 === 'Аксессуары' || l2 === 'Lifestyle-гаджеты') {
      s.add('gadgetWearableTechOptions');
      s.add('gadgetPowerInterfaceOptions');
    }
    if (l2 === 'Питомцы') {
      s.add('petSizeClassOptions');
      if (l3 === 'Лежанки') {
        s.add('petFurnitureOptions');
      } else if (l3 === 'Одежда') {
        s.add('fabricTextureOptions');
        s.add('patternOptionsByCategory');
        s.add('processingTechOptionsByCategory');
        s.add('fabricWeightGsmPresetOptions');
        s.add('petGarmentBackLengthClassOptions');
      } else if (l3 === 'Поводки' || l3 === 'Переноски') {
        s.add('petAccessoriesOptions');
      } else {
        s.add('petFurnitureOptions');
        s.add('petAccessoriesOptions');
      }
    }
    return s;
  }

  if (l1 === 'Аксессуары для новорождённых') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    s.add('fabricTextureOptions');
    s.add('hardwareOptionsByCategory');
    addNewbornKeysByL3(s, l2, l3);
    return s;
  }

  if (l1 === 'Игрушки (детские)') {
    addMaterialAndStyle(s);
    addTzArticleBase(s);
    s.add('toyTypeOptionsAll');
    s.add('toyAgeMarkingOptions');
    s.add('toySafetyComplianceOptions');
    return s;
  }

  addMaterialAndStyle(s);
  addTzArticleBase(s);
  return s;
}

/**
 * Обязательные ключи: глобальный ТЗ-блок + ветка L1/L2/L3.
 */
export function collectRequiredInfoPickAttributeKeys(
  l1Name: string,
  l2Name: string,
  l3Name: string = ''
): Set<string> {
  const l1 = l1Name.trim();
  const l2 = l2Name.trim();
  const l3 = l3Name.trim();
  const r = new Set<string>();
  r.add('materialOptions');
  r.add(STYLE_KEY);
  GLOBAL_TZ_REQUIRED.forEach((k) => r.add(k));
  addTzLeafDrivenRequiredKeys(r, l1, l2, l3);

  if (l1 === 'Одежда') {
    r.add('clothingFitOptions');
    r.add('garmentLengthApparelOptions');
    r.add('fabricWeightGsmPresetOptions');
    if (l2 === 'Трикотаж') {
      r.add('knitStitchOptions');
      r.add('yarnGaugePresetOptions');
    }
    if (l2 === 'Верхняя одежда') {
      OUTERWEAR_THERMO.forEach((k) => r.add(k));
    }
    if (l2 === 'Спортивная одежда') {
      r.add('sportDisciplineOptions');
    }
    return r;
  }

  if (l1 === 'Обувь') {
    r.add('footwearShaftHeightOptions');
    r.add('heelHeightOptions');
    r.add('shoeUpperMaterialOptions');
    r.add('shoeSoleMaterialOptions');
    r.add('shoeInsoleMaterialOptions');
    r.add('shoeWidthFittingOptions');
    r.add('fasteningOptionsByCategory');
    return r;
  }

  if (l1 === 'Сумки') {
    if (l2 === 'Чемоданы' || l2 === 'Спортивные и дорожные') {
      r.add('luggageVolumeLitersOptions');
      r.add('luggageCarryOnClassOptions');
      r.add('luggageShellTypeOptions');
      r.add('luggageWheelOptions');
    }
    if (l2 !== 'Чемоданы') {
      r.add('bagSizeClassOptions');
      r.add('bagCarryStyleOptions');
    }
    if (l2 === 'Рабочие') {
      r.add('bagLaptopCompatInchesOptions');
    }
    return r;
  }

  if (l1 === 'Аксессуары') {
    if (l2 === 'Ремни и подтяжки') r.add('waistbandOptionsByCategory');
    if (l2 === 'Перчатки и варежки') r.add('glovesLengthOptions');
    if (l2 === 'Шарфы' || l2 === 'Галстуки и бабочки') r.add('scarfAndTieLengthOptions');
    if (l2 === 'Платки') {
      r.add('kerchiefScarfTypeOptions');
      r.add('kerchiefScarfSizeOptions');
    }
    if (l2 === 'Украшения') {
      r.add('jewelryTypeOptions');
      r.add('neckJewelryLengthOptions');
      r.add('jewelryMetalPlatingOptions');
    }
    if (l2 === 'Очки') {
      r.add('eyewearTypeOptions');
      r.add('eyewearLensFeatureOptions');
    }
    if (l2 === 'Кожгалантерея мелкая') {
      r.add('smallLeatherGoodsTypeOptions');
      r.add('walletCardSlotCapacityOptions');
      r.add('walletRfidOptions');
    }
    if (l2 === 'Зонты') r.add('umbrellaTypeOptions');
    if (l2 === 'Тех-аксессуары') {
      r.add('gadgetWearableTechOptions');
      r.add('gadgetPowerInterfaceOptions');
    }
    if (l2 === 'Маски и бафы') {
      r.add('faceCoveringTypeOptions');
      r.add('faceCoveringLayerOptions');
    }
    return r;
  }

  if (l1 === 'Головные уборы') {
    r.add('headwearFitDepthOptions');
    if (l2 === 'Шапки' || l2 === 'Береты') {
      r.add('knitStitchOptions');
      r.add('yarnGaugePresetOptions');
    }
    return r;
  }

  if (l1 === 'Носочно-чулочные') {
    r.add('hosierySockHeightOptions');
    r.add('hosieryDenierOptions');
    r.add('hosieryPurposeOptions');
    r.add('hosieryCompressionClassOptions');
    r.add('fabricWeightGsmPresetOptions');
    return r;
  }

  if (l1 === 'Красота и уход') {
    r.add('cosmeticInciDeclarationOptions');
    if (l2 === 'Парфюмерия') {
      r.add('fragranceVolumeClassOptions');
      r.add('fragranceConcentrationOptions');
    } else if (l2 === 'Косметика') {
      r.add('bodyCareFormatOptions');
      r.add('bodyCareVolumeClassOptions');
      r.add('cosmeticApplicationZoneOptions');
      r.add('cosmeticSpfClassOptions');
      r.add('cosmeticFinishOptions');
    } else {
      r.add('bodyCareFormatOptions');
      r.add('bodyCareVolumeClassOptions');
      r.add('skinTypeTargetOptions');
      r.add('hairTypeTargetOptions');
    }
    return r;
  }

  if (l1 === 'Дом и стиль жизни') {
    if (l2 === 'Текстиль') {
      r.add('homeTextileLengthOptions');
      switch (l3) {
        case 'Пледы':
          r.add('blanketTypeOptions');
          break;
        case 'Постельное':
          r.add('blanketTypeOptions');
          r.add('pillowTypeOptions');
          r.add('mattressTypeOptions');
          break;
        case 'Шторы':
          r.add('curtainAndBlindTypeOptions');
          r.add('windowTextileSizePresetOptions');
          break;
        case 'Скатерти':
        case 'Полотенца':
        case 'Коврики для ванной':
          break;
        default:
          r.add('blanketTypeOptions');
          r.add('pillowTypeOptions');
          r.add('mattressTypeOptions');
          r.add('curtainAndBlindTypeOptions');
          r.add('carpetPileAndWeaveOptions');
          r.add('windowTextileSizePresetOptions');
      }
    }
    if (l2 === 'Декор') r.add('decorScaleOptions');
    if (l2 === 'Питомцы') {
      r.add('petSizeClassOptions');
      if (l3 === 'Лежанки') r.add('petFurnitureOptions');
      else if (l3 === 'Поводки' || l3 === 'Переноски') r.add('petAccessoriesOptions');
      else if (l3 === 'Одежда') r.add('petGarmentBackLengthClassOptions');
      else if (l3 !== 'Одежда') {
        r.add('petFurnitureOptions');
        r.add('petAccessoriesOptions');
      }
    }
    if (l2 === 'Аксессуары' || l2 === 'Lifestyle-гаджеты') {
      r.add('gadgetWearableTechOptions');
      r.add('gadgetPowerInterfaceOptions');
    }
    return r;
  }

  if (l1 === 'Аксессуары для новорождённых') {
    addNewbornRequiredByL3(r, l2, l3);
    return r;
  }

  if (l1 === 'Игрушки (детские)') {
    r.add('toyTypeOptionsAll');
    r.add('toyAgeMarkingOptions');
    r.add('toySafetyComplianceOptions');
    return r;
  }

  return r;
}

export type InfoPickAttributeGroups = { requiredLabels: string[]; commonLabels: string[] };

export function getInfoPickAttributeGroupsForLeaf(leaf: HandbookCategoryLeaf): InfoPickAttributeGroups {
  const wanted = collectInfoPickAttributeKeys(leaf.l1Name, leaf.l2Name, leaf.l3Name);
  const requiredRaw = collectRequiredInfoPickAttributeKeys(leaf.l1Name, leaf.l2Name, leaf.l3Name);
  const requiredKeys = new Set([...requiredRaw].filter((k) => wanted.has(k)));
  const cards = getOptimizedAttributeCards();
  const requiredLabels: string[] = [];
  const commonLabels: string[] = [];
  for (const c of cards) {
    if (!wanted.has(c.key)) continue;
    if (requiredKeys.has(c.key)) requiredLabels.push(c.label);
    else commonLabels.push(c.label);
  }
  return { requiredLabels, commonLabels };
}

export function getInfoPickAttributeLabelsForLeaf(leaf: HandbookCategoryLeaf): string[] {
  const { requiredLabels, commonLabels } = getInfoPickAttributeGroupsForLeaf(leaf);
  return [...requiredLabels, ...commonLabels];
}
