/**
 * Единая точка импорта каталога категорий (аудитории + листы L1–L3) для UI и логики.
 * Данные — `generated/category-handbook.snapshot.json`; обновление: `npm run gen:category-catalog`.
 */
export {
  buildCategoryHandbookSnapshot,
  findHandbookLeafById,
  getCategoryHandbookSnapshot,
  getHandbookAudiences,
  getHandbookAudiencesWorkshop2,
  getHandbookCategoryLeaves,
  getHandbookTaxonomyAliases,
  handbookAudienceCategoryPath,
  handbookL1OptionsForAudience,
  handbookL2OptionsForAudience,
  handbookL3OptionsForAudience,
  handbookLeafIdFromL123,
  resolveWorkshop2EffectiveAudienceId,
  resolveHandbookLeafId,
  type CategoryHandbookSnapshot,
  type HandbookCategoryLeaf,
  type TaxonomyLeafAlias,
} from './category-handbook-leaves';
export {
  formatComplianceSummary,
  formatStockUnitRu,
  getResolvedLeafProductionProfile,
  type LeafProductionProfile,
} from './category-leaf-production';
export {
  formatMarketplaceHintLine,
  formatTnvedHints,
  getLeafHandbookGuidance,
  productionDocumentKindLabelRu,
  type LeafHandbookGuidance,
} from './category-leaf-handbook-checklist';
