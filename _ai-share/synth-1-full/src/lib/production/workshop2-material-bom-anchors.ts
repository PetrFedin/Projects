/**
 * Якоря подстраницы «Материалы» — общие константы без логики гейта (избегаем циклических импортов).
 */
export const W2_MATERIAL_SUBPAGE_ANCHORS = {
  hub: 'w2-material-hub',
  /** Панель «Снабжение · дельта · costing» (черновики в досье). */
  supplyDrafts: 'w2-material-supply-chain-drafts',
  /** Подблок альтернатив внутри панели черновиков. */
  supplyDraftsAlts: 'w2-material-sc-drafts-alts',
  /** Подблок дельта BOM внутри панели черновиков. */
  supplyDraftsDelta: 'w2-material-sc-drafts-delta',
  /** Подблок costing по lineRef внутри панели черновиков. */
  supplyDraftsCosting: 'w2-material-sc-drafts-costing',
  /** Кнопки экспорта BOM + шапка фабричного CSV. */
  factoryExport: 'w2-material-bom-factory-export',
  /** Чеклист комплаенса внутри хаба (sessionStorage). */
  compliance: 'w2-material-compliance',
  /** Предупреждение «ref скетча не в mat» (BOM ↔ скетч). */
  matSketchGap: 'w2-material-mat-sketch-gap',
  /** Памятка по нормам / потерям BOM (без API). */
  bomNorms: 'w2-material-bom-norms',
  /** Дельта BOM + поток согласования замен (снабжение / комплаенс / производство). */
  supplyRoute: 'w2-material-supply-route',
  /** Черновик costing по строкам BOM (финансы / менеджер). */
  costingHints: 'w2-material-costing-hints',
  /** Обёртка всей секции полей (legacy, навигация может не использовать). */
  fields: 'w2-material-fields',
  mat: 'w2-material-mat',
  composition: 'w2-material-composition',
  catalog: 'w2-material-catalog',
} as const;
