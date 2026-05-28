import type { Dispatch, SetStateAction } from 'react';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { ProductionFlowProfileId } from '@/lib/production/collection-production-profiles';
import {
  type CollectionSkuFlowDoc,
  type MatrixStepStatus,
  type SkuStageDetail,
} from '@/lib/production/unified-sku-flow-store';
import type { StagesSkuPanelTab } from '@/lib/production/stages-url';
import type {
  StagesFacetSetBundle,
  StagesLocalInventoryTools,
  StagesSubTab,
  StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import type { Workshop2StagesDependenciesDepsNodeInfoPortalProps } from '@/components/brand/production/Workshop2StagesDependenciesDepsNodeInfoPortal';
import type { FocusSkuContourGuidance } from '@/components/brand/production/Workshop2StagesDependenciesPreTabsChrome';
import type { Workshop2StagesDependenciesOpsTabProps } from '@/components/brand/production/Workshop2StagesDependenciesOpsTab';
import { computeStagesFacetPickerChoices } from '@/components/brand/production/stages-dependencies-tab-facet-picker-choices';

type FacetPickerChoices = ReturnType<typeof computeStagesFacetPickerChoices>;
/** Rows для deps/matrix-сетки; `chunkStepsForDepsSchema` — generic, без явного `T` даёт `unknown[][]`. */
type SchemaChunks = CollectionStep[][];

export type StagesDependenciesTabContentBuildArgs = {
  sliceEmptyButCollectionHasArticles: boolean;
  mergedLocalInventoryTools: StagesLocalInventoryTools | null;
  clearAllFacets: () => void;
  profilePanelOpen: boolean;
  setProfilePanelOpen: Dispatch<SetStateAction<boolean>>;
  productionProfileLabel: string;
  productionProfileHint: string;
  productionProfileId: ProductionFlowProfileId;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
  localInventoryOpen: boolean;
  setLocalInventoryOpen: Dispatch<SetStateAction<boolean>>;
  focusArticle: StagesTabArticle | null;
  steps: CollectionStep[];
  focusSkuContourGuidance: FocusSkuContourGuidance | null;
  jumpToMatrixRow: (stepId: string) => void;
  subTab: StagesSubTab;
  setSubTab: (next: StagesSubTab) => void;
  contextFilterActive: boolean;
  filterBadgeSub: StagesSubTab | null;
  slicePinned: boolean;
  setSlicePinned: Dispatch<SetStateAction<boolean>>;
  sliceOpen: boolean;
  setSliceOpen: Dispatch<SetStateAction<boolean>>;
  sliceExpanded: boolean;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeModuleHref: (href: string, stepId: string, articleId?: string) => string;
  pickerQ: string;
  setPickerQ: (q: string | ((prev: string) => string)) => void;
  facetBundle: StagesFacetSetBundle;
  audienceFacetChoices: FacetPickerChoices['audienceFacetChoices'];
  seasonFacetChoices: FacetPickerChoices['seasonFacetChoices'];
  l1FacetChoices: FacetPickerChoices['l1FacetChoices'];
  l2FacetChoices: FacetPickerChoices['l2FacetChoices'];
  l3FacetChoices: FacetPickerChoices['l3FacetChoices'];
  fabFacetChoices: FacetPickerChoices['fabFacetChoices'];
  toggleFacetValue: (
    param: 'stagesAudience' | 'stagesSeason' | 'stagesL1' | 'stagesL2' | 'stagesL3' | 'stagesFab',
    value: string
  ) => void;
  articlesForPickerList: StagesTabArticle[];
  resolvedFocusId: string;
  expandedPickDetailIds: Set<string>;
  togglePickDetailRow: (id: string) => void;
  setFocusSku: (id: string, opts?: { preserveChain?: boolean }) => void;
  boardPinned: boolean;
  setBoardPinned: Dispatch<SetStateAction<boolean>>;
  boardOpen: boolean;
  setBoardOpen: Dispatch<SetStateAction<boolean>>;
  boardExpanded: boolean;
  boardStepRows: SchemaChunks;
  columnStats: Workshop2StagesDependenciesOpsTabProps['columnStats'];
  isBlocked: (step: CollectionStep) => boolean;
  aggregateStatus: Workshop2StagesDependenciesOpsTabProps['aggregateStatus'];
  flowDoc: CollectionSkuFlowDoc;
  router: { push: (href: string) => void };
  navigateToStageModule: (step: CollectionStep, targetHref: string) => void;
  openSkuPanelForStep: (skuId: string, stepId: string, panelTab?: StagesSkuPanelTab) => void;
  buildTransitionUrl: (targetHref: string, chosenArticleId: string, stepId: string) => string;
  depsPinned: boolean;
  setDepsPinned: Dispatch<SetStateAction<boolean>>;
  depsOpen: boolean;
  setDepsOpen: Dispatch<SetStateAction<boolean>>;
  depsExpanded: boolean;
  chainFocusStepId: string;
  toggleChainFocus: (stepId: string) => void;
  viewArticles: StagesTabArticle[];
  depsSchemaChunks: SchemaChunks;
  setDepsNodeInfoStepId: Dispatch<SetStateAction<string | null>>;
  matrixPinned: boolean;
  setMatrixPinned: Dispatch<SetStateAction<boolean>>;
  matrixOpen: boolean;
  setMatrixOpen: Dispatch<SetStateAction<boolean>>;
  matrixExpanded: boolean;
  matrixStageFilterQ: string;
  onMatrixSearchChange: (v: string) => void;
  clearMatrixFilters: () => void;
  matrixPhaseParam: string;
  matrixTextQParam: string;
  scrollToCurrentMatrixStage: () => void;
  matrixPhaseOptions: string[];
  setMatrixPhaseFilter: (phase: string | null) => void;
  focusSkuMatrixPhase: string;
  matrixStepsFiltered: CollectionStep[];
  effectiveSkuIds: string[];
  markStatus: (id: string, next: MatrixStepStatus) => void;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  skuPanelPinned: boolean;
  setSkuPanelPinned: Dispatch<SetStateAction<boolean>>;
  skuPanelOpen: boolean;
  setSkuPanelOpen: Dispatch<SetStateAction<boolean>>;
  skuPanelExpanded: boolean;
  poolArticles: StagesTabArticle[];
  collectionArticles: StagesTabArticle[];
  skuSelectArticles: StagesTabArticle[];
  patchSkuStageLocal: (skuId: string, stepId: string, patch: Partial<SkuStageDetail>) => void;
  appendSkuAuditLineLocal: (
    skuId: string,
    stepId: string,
    line: { summary: string; by?: string }
  ) => void;
  collectionFlowKey: string;
  stagesSkuPanelParam: string;
  stagesSkuPanelTabParsed: StagesSkuPanelTab | null;
  consumePendingSkuPanel: () => void;
  depsPortal: Workshop2StagesDependenciesDepsNodeInfoPortalProps | null;
};
