/**
 * Wave 8 P1 #5: rollup predictive supply risk + blocked gates по коллекции (MASTER_PLAN heuristic).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2PredictiveSupplyRiskFromDossier } from '@/lib/production/workshop2-predictive-supply-risk';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { countWorkshop2VaultDocumentsForRelatedStrip } from '@/lib/production/workshop2-related-vault-enrichment';

export type Workshop2AssortmentRiskArticleRow = {
  collectionId: string;
  articleId: string;
  found: boolean;
  supplyScore: number;
  supplyRiskLevel: 'Low' | 'Medium' | 'High';
  blockedGateCount: number;
  blockerIds: string[];
};

export type Workshop2CollectionAssortmentRiskRollup = {
  collectionId: string;
  articleCount: number;
  foundCount: number;
  avgSupplyScore: number;
  collectionRiskLevel: 'Low' | 'Medium' | 'High';
  totalBlockedGates: number;
  highRiskArticles: string[];
  articles: Workshop2AssortmentRiskArticleRow[];
  computedAt: string;
  hintRu: string;
};

function countBlockedGatesForArticle(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): { count: number; ids: string[] } {
  const gate = evaluateWorkshop2SampleOrderGate({
    dossier: input.dossier,
    vaultFileCount: countWorkshop2VaultDocumentsForRelatedStrip(input.dossier),
  });
  const blockers = gate.readiness.checks.filter((c) => c.severity === 'blocker');
  return {
    count: blockers.length,
    ids: blockers.map((c) => c.id).slice(0, 6),
  };
}

export function buildWorkshop2AssortmentRiskArticleRow(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1 | null;
}): Workshop2AssortmentRiskArticleRow {
  if (!input.dossier) {
    return {
      collectionId: input.collectionId,
      articleId: input.articleId,
      found: false,
      supplyScore: 0,
      supplyRiskLevel: 'High',
      blockedGateCount: 0,
      blockerIds: ['dossier.missing'],
    };
  }
  const supply = evaluateWorkshop2PredictiveSupplyRiskFromDossier(input.dossier);
  const gates = countBlockedGatesForArticle({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    found: true,
    supplyScore: supply.score,
    supplyRiskLevel: supply.riskLevel,
    blockedGateCount: gates.count,
    blockerIds: gates.ids,
  };
}

export function rollupWorkshop2CollectionAssortmentRisk(input: {
  collectionId: string;
  articles: { articleId: string; dossier: Workshop2DossierPhase1 | null }[];
}): Workshop2CollectionAssortmentRiskRollup {
  const collectionId = input.collectionId.trim();
  const rows = input.articles.map((a) =>
    buildWorkshop2AssortmentRiskArticleRow({
      collectionId,
      articleId: a.articleId,
      dossier: a.dossier,
    })
  );
  const foundRows = rows.filter((r) => r.found);
  const avgSupplyScore =
    foundRows.length > 0
      ? Math.round(foundRows.reduce((s, r) => s + r.supplyScore, 0) / foundRows.length)
      : 0;
  const totalBlockedGates = rows.reduce((s, r) => s + r.blockedGateCount, 0);
  const highRiskArticles = rows
    .filter((r) => r.supplyRiskLevel === 'High' || r.blockedGateCount > 0)
    .map((r) => r.articleId);

  let collectionRiskLevel: Workshop2CollectionAssortmentRiskRollup['collectionRiskLevel'] = 'Low';
  if (avgSupplyScore < 45 || highRiskArticles.length > Math.max(1, Math.floor(rows.length * 0.4))) {
    collectionRiskLevel = 'High';
  } else if (avgSupplyScore < 70 || totalBlockedGates > 0) {
    collectionRiskLevel = 'Medium';
  }

  const hintRu =
    collectionRiskLevel === 'Low'
      ? `Ассортимент ${collectionId}: эвристика снабжения ${avgSupplyScore}/100, блокеров ${totalBlockedGates}.`
      : collectionRiskLevel === 'Medium'
        ? `Ассортимент ${collectionId}: средний риск — проверьте ${highRiskArticles.length} артикул(ов) с gate blockers.`
        : `Ассортимент ${collectionId}: высокий риск — ${highRiskArticles.length} артикул(ов) требуют внимания.`;

  return {
    collectionId,
    articleCount: rows.length,
    foundCount: foundRows.length,
    avgSupplyScore,
    collectionRiskLevel,
    totalBlockedGates,
    highRiskArticles,
    articles: rows,
    computedAt: new Date().toISOString(),
    hintRu,
  };
}
