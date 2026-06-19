/**
 * Wave 4 P1 #14: массовый handoff gate с хаба коллекции.
 */
import { evaluateWorkshop2FactoryHandoffCommitGate } from '@/lib/production/workshop2-factory-handoff-commit-gate';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { countWorkshop2VaultDocumentsForRelatedStrip } from '@/lib/production/workshop2-related-vault-enrichment';

export type Workshop2BulkHandoffArticleResult = {
  articleId: string;
  passed: boolean;
  reasons: string[];
  checks: Workshop2HandoffReadinessCheck[];
};

export type Workshop2BulkHandoffSummary = {
  collectionId: string;
  passed: number;
  blocked: Array<{ articleId: string; reasons: string[] }>;
  results: Workshop2BulkHandoffArticleResult[];
};

export function evaluateWorkshop2BulkHandoffForArticle(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1 | null;
  categoryLeafId?: string;
}): Workshop2BulkHandoffArticleResult {
  if (!input.dossier) {
    return {
      articleId: input.articleId,
      passed: false,
      reasons: ['Досье не найдено — откройте workspace для синхронизации с PG.'],
      checks: [
        {
          id: 'bulk_handoff.dossier_missing',
          severity: 'blocker',
          messageRu: 'Досье отсутствует на сервере.',
        },
      ],
    };
  }

  const gate = evaluateWorkshop2FactoryHandoffCommitGate({
    dossier: input.dossier,
    categoryLeafId: input.categoryLeafId,
    vaultFileCount: countWorkshop2VaultDocumentsForRelatedStrip(input.dossier),
  });
  const blockers = gate.readiness.checks.filter((c) => c.severity === 'blocker');
  const passed = gate.allowed && blockers.length === 0;
  const reasons = blockers.map((c) => c.messageRu);

  return {
    articleId: input.articleId,
    passed,
    reasons,
    checks: gate.readiness.checks,
  };
}

export function summarizeWorkshop2BulkHandoff(input: {
  collectionId: string;
  results: Workshop2BulkHandoffArticleResult[];
}): Workshop2BulkHandoffSummary {
  const blocked = input.results
    .filter((r) => !r.passed)
    .map((r) => ({ articleId: r.articleId, reasons: r.reasons }));
  return {
    collectionId: input.collectionId,
    passed: input.results.filter((r) => r.passed).length,
    blocked,
    results: input.results,
  };
}
