import { STAGES_PRODUCTION_SITES, getHandbookAudiences } from '@/lib/production/stages-tab-facets';
import {
  articleMatchesFacetBundle,
  type StagesFacetSetBundle,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type StagesFacetPickerChoices = {
  audienceFacetChoices: { id: string; name: string }[];
  seasonFacetChoices: string[];
  l1FacetChoices: string[];
  l2FacetChoices: string[];
  l3FacetChoices: string[];
  fabFacetChoices: (typeof STAGES_PRODUCTION_SITES)[number][];
};

/** Варианты осей среза для пикера (без React — чистая функция для useMemo). */
export function computeStagesFacetPickerChoices(
  collectionArticles: StagesTabArticle[],
  facetBundle: StagesFacetSetBundle
): StagesFacetPickerChoices {
  const articlesForAudienceAxis = collectionArticles.filter((a) =>
    articleMatchesFacetBundle(a, facetBundle, 'audience')
  );
  const articlesForSeasonAxis = collectionArticles.filter((a) =>
    articleMatchesFacetBundle(a, facetBundle, 'season')
  );
  const articlesForL1Axis = collectionArticles.filter((a) =>
    articleMatchesFacetBundle(a, facetBundle, 'l1')
  );
  const articlesForL2Axis = collectionArticles.filter((a) =>
    articleMatchesFacetBundle(a, facetBundle, 'l2')
  );
  const articlesForL3Axis = collectionArticles.filter((a) =>
    articleMatchesFacetBundle(a, facetBundle, 'l3')
  );
  const articlesForFabAxis = collectionArticles.filter((a) =>
    articleMatchesFacetBundle(a, facetBundle, 'fab')
  );

  const audienceHandbook = getHandbookAudiences();

  const idsAudience = new Set<string>();
  for (const a of articlesForAudienceAxis) {
    if (a.audienceId) idsAudience.add(a.audienceId);
  }
  const audienceFacetChoices = audienceHandbook
    .filter((x) => idsAudience.has(x.id))
    .sort((x, y) => x.name.localeCompare(y.name, 'ru'));

  const setSeason = new Set<string>();
  for (const a of articlesForSeasonAxis) {
    if (a.season) setSeason.add(a.season);
  }
  const seasonFacetChoices = [...setSeason].sort((x, y) => x.localeCompare(y, 'ru'));

  const setL1 = new Set<string>();
  for (const a of articlesForL1Axis) {
    if (a.categoryL1) setL1.add(a.categoryL1);
  }
  const l1FacetChoices = [...setL1].sort((x, y) => x.localeCompare(y, 'ru'));

  const setL2 = new Set<string>();
  for (const a of articlesForL2Axis) {
    if (a.categoryL2 && a.categoryL2 !== '—') setL2.add(a.categoryL2);
  }
  const l2FacetChoices = [...setL2].sort((x, y) => x.localeCompare(y, 'ru'));

  const setL3 = new Set<string>();
  for (const a of articlesForL3Axis) {
    if (a.categoryL3 && a.categoryL3 !== '—') setL3.add(a.categoryL3);
  }
  const l3FacetChoices = [...setL3].sort((x, y) => x.localeCompare(y, 'ru'));

  const idsFab = new Set<string>();
  for (const a of articlesForFabAxis) {
    if (a.productionSiteId) idsFab.add(a.productionSiteId);
  }
  const fabFacetChoices = STAGES_PRODUCTION_SITES.filter((s) => idsFab.has(s.id));

  return {
    audienceFacetChoices,
    seasonFacetChoices,
    l1FacetChoices,
    l2FacetChoices,
    l3FacetChoices,
    fabFacetChoices,
  };
}
