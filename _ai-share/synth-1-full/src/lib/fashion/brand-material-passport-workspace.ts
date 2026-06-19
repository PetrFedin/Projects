import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { ROUTES } from '@/lib/routes';

export function brandMaterialPassportFeatureHref(
  featureId: 'rollup' | 'certs' | 'release',
  collectionId: string = PLATFORM_CORE_DEMO.collectionId
): string {
  return `${ROUTES.brand.fabricPassportRollup}?${PILLAR_CAPABILITY_FEATURE_PARAM}=${featureId}&collection=${encodeURIComponent(collectionId)}`;
}

export function brandMaterialPassportReleaseChecklistHref(
  collectionId: string = PLATFORM_CORE_DEMO.collectionId
): string {
  return `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=checklist&collection=${encodeURIComponent(collectionId)}`;
}

export function brandMaterialPassportSyndicationHref(
  collectionId: string = PLATFORM_CORE_DEMO.collectionId
): string {
  return `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=syndication&collection=${encodeURIComponent(collectionId)}`;
}
