import {
  STAGES_MATRIX_PHASE_PARAM,
  STAGES_MATRIX_Q_PARAM,
  STAGES_SKU_PARAM,
  STAGES_SKU_PANEL_STEP_PARAM,
  STAGES_SKU_PANEL_TAB_PARAM,
  STAGES_WORK_SKU_PARAM,
  parseStagesSkuPanelTab,
} from '@/lib/production/stages-url';

/** Снимок строковых параметров URL для вкладки «Этапы и зависимости» (без React). */
export type StagesDependenciesUrlSearchSnapshot = {
  legacyPickRaw: string;
  stagesSkuParam: string;
  rawAudience: string;
  rawSeason: string;
  rawL1: string;
  rawL2: string;
  rawL3: string;
  rawFab: string;
  chainFocusStepId: string;
  stagesMatrixSkuParam: string;
  stagesWorkSkuParam: string;
  stagesSkuPanelParam: string;
  stagesSkuPanelTabParsed: ReturnType<typeof parseStagesSkuPanelTab>;
  matrixPhaseParam: string;
  matrixTextQParam: string;
};

export function readStagesDependenciesUrlSearchSnapshot(
  sp: URLSearchParams
): StagesDependenciesUrlSearchSnapshot {
  return {
    legacyPickRaw: sp.get('stagesPick') || '',
    stagesSkuParam: sp.get(STAGES_SKU_PARAM)?.trim() ?? '',
    rawAudience: sp.get('stagesAudience') ?? '',
    rawSeason: sp.get('stagesSeason') ?? '',
    rawL1: sp.get('stagesL1') ?? '',
    rawL2: sp.get('stagesL2') ?? '',
    rawL3: sp.get('stagesL3') ?? '',
    rawFab: sp.get('stagesFab') ?? '',
    chainFocusStepId: sp.get('stagesChainFocus') || '',
    stagesMatrixSkuParam: sp.get('stagesMatrixSku')?.trim() ?? '',
    stagesWorkSkuParam: sp.get(STAGES_WORK_SKU_PARAM)?.trim() ?? '',
    stagesSkuPanelParam: sp.get(STAGES_SKU_PANEL_STEP_PARAM)?.trim() ?? '',
    stagesSkuPanelTabParsed: parseStagesSkuPanelTab(sp.get(STAGES_SKU_PANEL_TAB_PARAM)),
    matrixPhaseParam: sp.get(STAGES_MATRIX_PHASE_PARAM)?.trim() ?? '',
    matrixTextQParam: sp.get(STAGES_MATRIX_Q_PARAM)?.trim() ?? '',
  };
}
