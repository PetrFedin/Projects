/**
 * Аудит применения умной градации (persist в dossier PUT).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2GradingApplyRecord,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  applyWorkshop2SmartGrading,
  type Workshop2GradingApplyInput,
} from '@/lib/production/workshop2-grading-apply';

function uid(): string {
  return `gr-apply-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function appendWorkshop2SmartGradingWithAudit(
  input: Workshop2GradingApplyInput & { appliedBy?: string }
): { dossier: Workshop2DossierPhase1; record: Workshop2GradingApplyRecord } | null {
  const result = applyWorkshop2SmartGrading(input);
  if (!result) return null;

  const beforeCount = input.dossier.gradingRules?.length ?? 0;
  const record: Workshop2GradingApplyRecord = {
    id: uid(),
    appliedAt: new Date().toISOString(),
    appliedFrom: result.appliedFrom,
    sizeCount: result.gradingSizes.length,
    ruleCount: result.gradingRules.length,
    addedRuleCount: Math.max(0, result.gradingRules.length - beforeCount),
    categoryLeafId: input.categoryLeaf?.leafId,
  };

  const log = [record, ...(input.dossier.gradingApplyLog ?? [])].slice(0, 40);
  const dossier: Workshop2DossierPhase1 = {
    ...input.dossier,
    gradingSizes: result.gradingSizes,
    gradingRules: result.gradingRules,
    sampleBasePerSizeDimensions: result.sampleBasePerSizeDimensions,
    sampleBasePerSizeDimensionRanges: result.sampleBasePerSizeDimensionRanges,
    gradingApplyLog: log,
    updatedAt: record.appliedAt,
    updatedBy: input.appliedBy?.slice(0, 200) || input.dossier.updatedBy,
  };

  return { dossier, record };
}
