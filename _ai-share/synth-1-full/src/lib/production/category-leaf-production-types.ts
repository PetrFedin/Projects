/**
 * Расширения листа справочника категорий для производства и интеграций (РФ/ЕАЭУ — ориентиры, не юридический вердикт).
 * Сборка профиля: `getResolvedLeafProductionProfile` в `category-leaf-production.ts`.
 */

/** Единица учёта / фасовка по умолчанию для артикула в этой ветке. */
export type StockUnitKind = 'piece' | 'pair' | 'set' | 'volume_ml' | 'weight_g' | 'length_m';

/**
 * Теги комплаенса для чеклистов документов и маркировки (привязка к типовым режимам ТР ТС ЕАЭУ / практике РФ).
 * Уточняйте по фактическому назначению изделия и документации.
 */
export type ComplianceTag =
  | 'kids_product_tr_ts_007'
  | 'toy_tr_ts_008'
  | 'cosmetics_tr_ts_009'
  | 'perfumery_tr_ts_009'
  | 'textile_light_industry_tr_ts_017'
  | 'footwear_tr_ts_017'
  | 'electrical_low_voltage_tr_ts_004'
  | 'radio_emc_tr_ts_020'
  | 'ppe_or_medical_context'
  | 'general_consumer';

/** Подсказки оператору и для 1С/таможни; финальные коды фиксирует специалист. */
export type ExternalClassifiers = {
  tnvedEaEuChapterHint?: string;
  tnvedEaEuCodeHints?: string[];
  okpd2Hints?: string[];
  vedCodeHints?: string[];
};

export type MarketplaceChannelId = 'wildberries' | 'ozon' | 'yandex_market' | string;

export type MarketplaceCategoryRef = {
  channelId: MarketplaceChannelId;
  subjectId?: string;
  categoryPathHint?: string;
  /** false — subjectId не сверен с личным кабинетом маркетплейса (ориентир). */
  subjectIdVerified?: boolean;
};

export type ProductionDocumentKind =
  | 'tech_pack_pdf'
  | 'specification_materials'
  | 'grading_sheet'
  | 'marker_nesting'
  | 'lab_test_report'
  | 'conformity_declaration_copy'
  | 'raw_material_acceptance_act';

export type LabelLocaleBlock =
  | 'composition'
  | 'care'
  | 'country_of_origin'
  | 'manufacturer_responsible'
  | 'size_designation'
  | 'certification_marks'
  | 'eac_mark';

/**
 * Источник осей атрибутов карточки:
 * - `info_pick_matrix` — `info-pick-attribute-keys` + `product-attributes` (текущий основной путь).
 * - `node_category_attribute` — поле `CategoryNode.attributes` в `category-handbook.ts` (если заполнено).
 * - `hybrid` — оба слоя; явно зафиксировать в заметке.
 */
export type CategoryAttributeBindingSource = 'info_pick_matrix' | 'node_category_attribute' | 'hybrid';

export type LeafProductionProfile = {
  stockUnitDefault: StockUnitKind;
  stockUnitNotes?: string;
  complianceTags: ComplianceTag[];
  externalClassifiers: ExternalClassifiers;
  /** Явный id профиля размеров/параметров; если пусто — эвристика `handbookCatL1FromLeaf`. */
  sizeParameterProfileId?: string;
  productionRouteTemplateId?: string;
  productionRouteTemplateLabel?: string;
  marketplaceRefs: MarketplaceCategoryRef[];
  requiredDocuments: ProductionDocumentKind[];
  /** Языки этикетки по умолчанию (ISO 639-1 или условные коды). */
  labelLocalesDefault: string[];
  mandatoryLabelBlocks: LabelLocaleBlock[];
  attributeBinding: CategoryAttributeBindingSource;
  attributeBindingNote?: string;
};

/** Запись переноса leafId при смене таксономии (история для артикулов и отчётов). */
export type TaxonomyLeafAlias = {
  fromLeafId: string;
  toLeafId: string;
  /** ISO-дата или произвольная метка релиза справочника. */
  since?: string;
  note?: string;
};
