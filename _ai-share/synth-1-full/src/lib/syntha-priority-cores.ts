/**
 * Единая точка импорта для приоритетных направлений Syntha (ядра №1–3):
 * №1 ТЗ→отшив, №2 B2B как JOOR/NuOrder+, №3 чаты/календарь как надстройка (`syntha-overlay-context`).
 *
 * Хелперы маршрутов — ниже; UI-компоненты — реэкспорт для одного импорта с экранов.
 */

export { B2bPriorityWorkflowPanel } from '@/components/b2b/B2bPriorityWorkflowPanel';
export { B2bOrderUrlContextBanner } from '@/components/b2b/B2bOrderUrlContextBanner';
export { CommunicationsEntityContextBanner } from '@/components/brand/communications/CommunicationsEntityContextBanner';
export { CommunicationsArtifactPolicyStrip } from '@/components/brand/communications/CommunicationsArtifactPolicyStrip';
export { B2bOrderCommsContextButtons } from '@/components/b2b/B2bOrderCommsContextButtons';

export {
  getSynthaThreeCoresFullMatrixGroups,
  getSynthaProductionHubBridgeGroups,
  getBrandB2bOrderPriorityGroups,
  getShopB2bOrderPriorityGroups,
  getBrandB2bCollaborationProcessGroups,
  getShopB2bCollaborationProcessGroups,
} from '@/lib/data/b2b-priority-workflow-groups';

export {
  getSynthaThreeCoresQuickLinksForBuyer,
  getSynthaThreeCoresQuickLinksForBrand,
  getB2bOrderVerticalCoreLinks,
  getWorkshop2FloorTabLinks,
  getWorkshop2FloorExtraModuleLinks,
  getWorkshop2DevelopmentFloorTabLinks,
  getWorkshop2DevelopmentExtraModuleLinks,
  getWorkshop2HandoffToSeriesLinks,
} from '@/lib/data/entity-links';

export { WORKSHOP2_DEVELOPMENT_FLOOR_TAB_IDS } from '@/lib/production/workshop2-development-scope';

/** Шкала этапов каталога в разработке коллекции: разработка и ТЗ слева от `supply-path`, сэмплы и выпуск справа. */
export {
  WORKSHOP2_PIPELINE_SAMPLES_LANE_START_INDEX,
  WORKSHOP2_PIPELINE_STEP_IDS,
  workshop2PipelineLaneForArticleMainTab,
  workshop2PipelineLaneForStepId,
  workshop2PipelineLaneForTzSignoffStage,
  workshop2PipelineLaneLabelRu,
  type Workshop2ArticleMainTab,
  type Workshop2PipelineLane,
} from '@/lib/production/workshop2-collection-metrics';

/** Мост разработка коллекции (workshop2) ↔ пол: канонические href без дублирования query в UI. */
export {
  workshop2ContextToProductionFloorHubHref,
  workshop2ContextToProductionFloorTabHref,
  workshop2ContextToProductionModuleHref,
} from '@/lib/production/workshop2-floor-bridge';

/** Ядро №1: матрица этап каталога ↔ вкладка карточки артикула в разработке коллекции, deep link, handoff в серию. */
export {
  PRODUCTION_WINDOW_CATALOG_STEP_ID,
  WORKSHOP2_CATALOG_STEP_ROUTING,
  getSeriesHandoffMissingSteps,
  getSeriesHandoffPrerequisiteStepIds,
  getWorkshop2CatalogStepRoutingRow,
  getWorkshop2PrimaryPaneForCatalogStep,
  isSeriesHandoffReadyForSku,
  workshop2ArticleHrefForCatalogStep,
  type Workshop2CatalogStepRoutingRow,
} from '@/lib/production/workshop2-core1-stage-routing';

/** Ядро №1: канонические kind для outputs матрицы и сверка с PO в бандле артикула. */
export {
  CORE1_FLOW_OUTPUT_KIND_FLOOR_BATCH,
  CORE1_FLOW_OUTPUT_KIND_PO,
  CORE1_FLOW_OUTPUT_KIND_QC_INSPECTION,
  applyBundlePoRefsToUnifiedFlowPoStep,
  buildCore1PlanTabBridgeState,
  collectBundlePoRefsForMatrix,
  getSkuStageOutputRefsForKind,
  matrixPoOutputsAlignWithBundlePos,
  type ApplyBundlePoRefsResult,
  type Core1PlanTabBridgeState,
} from '@/lib/production/workshop2-core1-linkage';

export { buildStagesMatrixHrefForArticle } from '@/lib/production/stages-url';

/** Ядро №3: единый контракт URL для чатов и календаря (заказ, PO ref, коллекция, этап). */
export {
  SYNTHA_PO_REF_PARAM,
  appendSynthaOverlaySearchParams,
  brandCalendarTasksSynthaOverlayHref,
  brandMessagesSynthaOverlayHref,
  parseSynthaOverlayContext,
  shopCalendarTasksSynthaOverlayHref,
  shopMessagesSynthaOverlayHref,
  type SynthaOverlayHrefContext,
  type SynthaOverlayParsedContext,
} from '@/lib/communications/syntha-overlay-context';

/** Горизонталь: заготовка RBAC по шагам; реестр режимов интеграций. */
export { getProductionStepGate, type ProductionFlowGate } from '@/lib/rbac/production-step-gates';
export {
  BRAND_CONNECTOR_REGISTRY,
  getConnectorLifecycle,
  type ConnectorLifecycle,
  type ConnectorRegistryEntry,
} from '@/lib/integrations/connector-status-registry';

export { brandWorkshop2ArticleCardHref } from '@/lib/routes';

/** Deep-link контекста B2B-заказа (чат, календарь, матрица, Working Order, цех). */
export {
  brandB2bOrderHref,
  shopB2bOrderHref,
  brandMessagesB2bOrderContextHref,
  shopMessagesB2bOrderContextHref,
  brandCalendarB2bOrderContextHref,
  shopCalendarB2bOrderContextHref,
  brandProductsMatrixB2bOrderContextHref,
  brandProductionOperationsB2bOrderContextHref,
  shopB2bMatrixOrderContextHref,
  shopB2bSelectionBuilderOrderContextHref,
  shopB2bWhiteboardOrderContextHref,
  shopB2bWorkingOrderOrderContextHref,
} from '@/lib/routes';
