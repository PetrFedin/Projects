/**
 * Wave 7 P1 #6: массовая публикация шоурума по коллекции (gate showroom_publish).
 */
import { evaluateWorkshop2ShowroomPublishGate } from '@/lib/production/workshop2-showroom-publish-gate';
import { evaluateWorkshop2SampleOrderGate } from '@/lib/production/workshop2-sample-order-gate';
import { isWorkshop2Ss27UatDemoSeedDossier } from '@/lib/production/workshop2-ss27-uat-demo-seed';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2BulkShowroomPublishArticleInput = {
  articleId: string;
  dossier: Workshop2DossierPhase1 | null;
  publish?: {
    published?: boolean;
    wholesalePrice?: number | string;
    msrp?: number | string;
    moq?: number | string;
    windowStart?: string;
    windowEnd?: string;
    campaignName?: string;
  };
};

export type Workshop2BulkShowroomPublishArticleResult = {
  articleId: string;
  passed: boolean;
  reasons: string[];
  campaignName?: string;
};

export type Workshop2BulkShowroomPublishSummary = {
  collectionId: string;
  passed: number;
  blocked: Array<{ articleId: string; reasons: string[] }>;
  results: Workshop2BulkShowroomPublishArticleResult[];
};

export function evaluateWorkshop2BulkShowroomPublishForArticle(
  input: Workshop2BulkShowroomPublishArticleInput
): Workshop2BulkShowroomPublishArticleResult {
  if (!input.dossier) {
    return {
      articleId: input.articleId,
      passed: false,
      reasons: ['Досье не найдено — синхронизируйте workspace с PG.'],
    };
  }

  const draft = input.dossier.b2bIntegrationDraft ?? {};
  const mirror = input.dossier.showroomB2bMirror;
  const publishInput = {
    published: input.publish?.published ?? true,
    wholesalePrice: input.publish?.wholesalePrice ?? draft.wholesalePrice,
    msrp: input.publish?.msrp ?? draft.msrp,
    moq: input.publish?.moq ?? draft.moq,
    windowStart: input.publish?.windowStart ?? draft.startDate,
    windowEnd: input.publish?.windowEnd ?? draft.endDate,
    campaignName:
      input.publish?.campaignName ?? mirror?.campaignName ?? draft.campaignId ?? input.articleId,
  };

  const gate = evaluateWorkshop2ShowroomPublishGate(publishInput);
  const blockers = gate.checks.filter((c) => c.severity === 'blocker');
  const reasons = blockers.map((c) => c.messageRu);

  let devGateAllowed = true;
  if (!isWorkshop2Ss27UatDemoSeedDossier(input.dossier)) {
    const devGate = evaluateWorkshop2SampleOrderGate({
      dossier: input.dossier,
      categoryLeafId: 'catalog-apparel-g0-l0',
    });
    devGateAllowed = devGate.allowed;
    if (!devGate.allowed) {
      for (const c of devGate.readiness.checks
        .filter((x) => x.severity === 'blocker')
        .slice(0, 3)) {
        reasons.push(`Разработка: ${c.messageRu}`);
      }
    }
  }

  return {
    articleId: input.articleId,
    passed: gate.allowed && blockers.length === 0 && devGateAllowed,
    reasons,
    campaignName: publishInput.campaignName,
  };
}

export type Workshop2ShowroomPublishReadinessResult = {
  ready: boolean;
  blocked: Array<{ articleId: string; reasons: string[] }>;
  passedArticleIds: string[];
};

/** Wave 14: pre-flight showroom gate по коллекции (без публикации). */
export function evaluateWorkshop2CollectionShowroomPublishReadiness(input: {
  articleIds: string[];
  resolveArticle: (
    articleId: string
  ) => Workshop2BulkShowroomPublishArticleInput | Promise<Workshop2BulkShowroomPublishArticleInput>;
}): Workshop2ShowroomPublishReadinessResult | Promise<Workshop2ShowroomPublishReadinessResult> {
  const run = async () => {
    const results: Workshop2BulkShowroomPublishArticleResult[] = [];
    for (const articleId of input.articleIds) {
      const row = await input.resolveArticle(articleId);
      results.push(evaluateWorkshop2BulkShowroomPublishForArticle(row));
    }
    const blocked = results
      .filter((r) => !r.passed)
      .map((r) => ({ articleId: r.articleId, reasons: r.reasons }));
    const passedArticleIds = results.filter((r) => r.passed).map((r) => r.articleId);
    return {
      ready: blocked.length === 0 && passedArticleIds.length > 0,
      blocked,
      passedArticleIds,
    };
  };
  return run();
}

export function summarizeWorkshop2BulkShowroomPublish(input: {
  collectionId: string;
  results: Workshop2BulkShowroomPublishArticleResult[];
}): Workshop2BulkShowroomPublishSummary {
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
