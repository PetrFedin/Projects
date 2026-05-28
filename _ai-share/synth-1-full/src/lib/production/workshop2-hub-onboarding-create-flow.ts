/**
 * Wave U — детерминированный create-flow онбординга хаба на file-store (demo-ss27-04).
 */
import { assembleWorkshop2ArticleFromTaxonomy } from '@/lib/production/workshop2-article-assembler';
import {
  applyWorkshop2ArticleCommit,
  storageKeyForCollectionId,
  type LocalCollectionInventory,
} from '@/lib/production/local-collection-inventory';
import { setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import { persistWorkshop2HubOnboardingStateToDossier } from '@/lib/production/workshop2-hub-onboarding-dossier-persist';
import type { StoredWorkshop2HubOnboardingRole } from '@/lib/production/workshop2-hub-onboarding-storage';

/** Фиксированный id для E2E онбординга (file-store, без PG). */
export const WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID = 'demo-ss27-04';

export const WORKSHOP2_HUB_ONBOARDING_DEMO_SKU = 'SS27-ONBOARD-04';

export type Workshop2HubOnboardingCreateFlowResult = {
  ok: boolean;
  articleId?: string;
  inventory?: LocalCollectionInventory;
  onboardingDone?: boolean;
  reason?: string;
};

/**
 * Создаёт demo-ss27-04 через hub commit + dossier assemble + onboarding mirror state.
 * Используется в file-store UAT (#8) и unit-тестах Wave U.
 */
export function runWorkshop2HubOnboardingCreateFlow(input: {
  inventory: LocalCollectionInventory;
  collectionId?: string;
  role?: StoredWorkshop2HubOnboardingRole;
  createdBy?: string;
}): Workshop2HubOnboardingCreateFlowResult {
  const collectionId = input.collectionId?.trim() || 'SS27';
  const createdBy = input.createdBy?.trim() || 'hub-onboarding';
  const role = input.role ?? 'technologist';

  const key = storageKeyForCollectionId(collectionId);
  const existing =
    input.inventory.articlesByCollection[key]?.some(
      (l) => l.id === WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID
    ) ?? false;
  if (existing) {
    return {
      ok: true,
      articleId: WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID,
      inventory: input.inventory,
      onboardingDone: true,
    };
  }

  const commitResult = applyWorkshop2ArticleCommit(
    input.inventory,
    collectionId,
    {
      kind: 'new',
      sku: WORKSHOP2_HUB_ONBOARDING_DEMO_SKU,
      name: 'Онбординг · demo-ss27-04',
      categoryLeafId: 'catalog-apparel-g1-l0',
      audienceId: 'women',
      isUnisex: false,
      comment: 'Создано через онбординг хаба (file-store flow).',
    },
    createdBy
  );

  if (!commitResult.ok || !commitResult.newArticleId) {
    return { ok: false, reason: commitResult.reason ?? 'commit_failed' };
  }

  const articleId = WORKSHOP2_HUB_ONBOARDING_DEMO_ARTICLE_ID;
  const keyList = commitResult.inventory.articlesByCollection[key] ?? [];
  const lineIdx = keyList.findIndex((l) => l.id === commitResult.newArticleId);
  if (lineIdx < 0) {
    return { ok: false, reason: 'line_missing_after_commit' };
  }

  const line = { ...keyList[lineIdx]!, id: articleId };
  const nextList = [...keyList];
  nextList[lineIdx] = line;
  let inventory: LocalCollectionInventory = {
    ...commitResult.inventory,
    articlesByCollection: {
      ...commitResult.inventory.articlesByCollection,
      [key]: nextList,
    },
  };

  const assembled = assembleWorkshop2ArticleFromTaxonomy({
    categoryLeafId: line.categoryLeafId ?? 'catalog-apparel-g1-l0',
    audienceId: line.workshopAudienceId ?? 'women',
    isUnisex: line.workshopIsUnisex,
    sku: line.sku,
    name: line.name,
    updatedBy: createdBy,
  });

  if (assembled) {
    const dossier = persistWorkshop2HubOnboardingStateToDossier(assembled.dossier, {
      done: true,
      workspaceOpened: false,
      role,
      markCompleted: true,
    });
    setWorkshop2Phase1Dossier(collectionId, articleId, dossier);
    return {
      ok: true,
      articleId,
      inventory,
      onboardingDone: dossier.hubOnboardingState?.done === true,
    };
  }

  return { ok: true, articleId, inventory, onboardingDone: false };
}
