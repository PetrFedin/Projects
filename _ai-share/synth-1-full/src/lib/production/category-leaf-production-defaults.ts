import type { HandbookCategoryLeaf } from './category-handbook-snapshot-builder';
import type {
  ComplianceTag,
  ExternalClassifiers,
  LeafProductionProfile,
  ProductionDocumentKind,
  StockUnitKind,
} from './category-leaf-production-types';

function norm(s: string): string {
  const t = s.trim();
  if (t === '—' || t === '–' || t === '-') return '';
  return t;
}

function baseDocuments(extra: ProductionDocumentKind[] = []): ProductionDocumentKind[] {
  const core: ProductionDocumentKind[] = ['tech_pack_pdf', 'specification_materials'];
  return [...core, ...extra];
}

function tnvedChapter(hint: string): ExternalClassifiers {
  return { tnvedEaEuChapterHint: hint };
}

export function deriveDefaultLeafProductionProfile(leaf: HandbookCategoryLeaf): LeafProductionProfile {
  const l1 = leaf.l1Name.trim();
  const l2 = norm(leaf.l2Name);
  const l3 = norm(leaf.l3Name);

  let stockUnitDefault: StockUnitKind = 'piece';
  const complianceTags: ComplianceTag[] = ['general_consumer'];
  let externalClassifiers: ExternalClassifiers = {};
  const marketplaceRefs: LeafProductionProfile['marketplaceRefs'] = [];
  let requiredDocuments = baseDocuments();
  const labelLocalesDefault = ['ru'];
  const mandatoryLabelBlocks: LeafProductionProfile['mandatoryLabelBlocks'] = [
    'composition',
    'care',
    'country_of_origin',
    'size_designation',
  ];

  if (l1 === 'Обувь' || l1 === 'Носочно-чулочные') {
    stockUnitDefault = 'pair';
    complianceTags.length = 0;
    complianceTags.push('footwear_tr_ts_017', 'textile_light_industry_tr_ts_017', 'general_consumer');
    externalClassifiers = tnvedChapter(l1 === 'Обувь' ? '64' : '61');
    mandatoryLabelBlocks.push('certification_marks', 'eac_mark');
  } else if (l1 === 'Одежда' || l1 === 'Головные уборы') {
    complianceTags.length = 0;
    complianceTags.push('textile_light_industry_tr_ts_017', 'general_consumer');
    externalClassifiers = tnvedChapter('61');
    requiredDocuments = baseDocuments(['grading_sheet', 'marker_nesting']);
    mandatoryLabelBlocks.push('certification_marks', 'eac_mark');
  } else if (l1 === 'Сумки' || l1 === 'Аксессуары') {
    complianceTags.length = 0;
    complianceTags.push('textile_light_industry_tr_ts_017', 'general_consumer');
    externalClassifiers = tnvedChapter(l1 === 'Сумки' ? '42' : '42');
    if (l2 === 'Тех-аксессуары') {
      stockUnitDefault = 'piece';
      complianceTags.push('electrical_low_voltage_tr_ts_004', 'radio_emc_tr_ts_020');
      externalClassifiers = { tnvedEaEuChapterHint: '85' };
    }
  } else if (l1 === 'Красота и уход') {
    stockUnitDefault = l2 === 'Парфюмерия' || l2 === 'Уход' || l2 === 'Косметика' ? 'volume_ml' : 'piece';
    complianceTags.length = 0;
    if (l2 === 'Парфюмерия') {
      complianceTags.push('perfumery_tr_ts_009', 'cosmetics_tr_ts_009', 'general_consumer');
    } else {
      complianceTags.push('cosmetics_tr_ts_009', 'general_consumer');
    }
    externalClassifiers = tnvedChapter('33');
    requiredDocuments = baseDocuments(['lab_test_report', 'conformity_declaration_copy']);
    mandatoryLabelBlocks.push('manufacturer_responsible', 'certification_marks', 'eac_mark');
  } else if (l1 === 'Игрушки (детские)') {
    complianceTags.length = 0;
    complianceTags.push('toy_tr_ts_008', 'kids_product_tr_ts_007', 'general_consumer');
    externalClassifiers = tnvedChapter('95');
    requiredDocuments = baseDocuments(['lab_test_report', 'conformity_declaration_copy']);
  } else if (l1 === 'Аксессуары для новорождённых') {
    complianceTags.length = 0;
    complianceTags.push('kids_product_tr_ts_007', 'general_consumer');
    externalClassifiers = tnvedChapter('61');
    requiredDocuments = baseDocuments(['lab_test_report', 'conformity_declaration_copy']);
    if (l2 === 'Коляски') {
      externalClassifiers = { tnvedEaEuChapterHint: '87' };
    }
  } else if (l1 === 'Дом и стиль жизни') {
    complianceTags.length = 0;
    complianceTags.push('general_consumer');
    externalClassifiers = tnvedChapter('63');
    if (l2 === 'Lifestyle-гаджеты' || l2 === 'Аксессуары') {
      complianceTags.push('electrical_low_voltage_tr_ts_004', 'radio_emc_tr_ts_020');
      externalClassifiers = { tnvedEaEuChapterHint: '85' };
    }
    if (l2 === 'Текстиль') {
      complianceTags.push('textile_light_industry_tr_ts_017');
      externalClassifiers = tnvedChapter('63');
    }
  }

  if (l2 === 'Маски и бафы' || l3 === 'Маски') {
    if (!complianceTags.includes('ppe_or_medical_context')) {
      complianceTags.push('ppe_or_medical_context');
    }
  }

  void l3;

  return {
    stockUnitDefault,
    complianceTags: [...new Set(complianceTags)],
    externalClassifiers,
    marketplaceRefs,
    requiredDocuments: [...new Set(requiredDocuments)],
    labelLocalesDefault,
    mandatoryLabelBlocks: [...new Set(mandatoryLabelBlocks)],
    attributeBinding: 'info_pick_matrix',
    attributeBindingNote:
      'Оси подборки и ТЗ задаются в `info-pick-attribute-keys.ts` + `product-attributes`; поле `CategoryNode.attributes` в дереве — опционально для узких кейсов.',
  };
}
