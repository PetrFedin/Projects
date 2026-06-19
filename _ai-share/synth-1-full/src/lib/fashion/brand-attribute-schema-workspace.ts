import { brandMaterialPassportFeatureHref } from '@/lib/fashion/brand-material-passport-workspace';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { ROUTES } from '@/lib/routes';

export function brandAttributeSchemaFeatureHref(
  featureId: 'health' | 'schemas' | 'size-chart',
  collectionId: string = PLATFORM_CORE_DEMO.collectionId
): string {
  return `${ROUTES.brand.attributeHealth}?${PILLAR_CAPABILITY_FEATURE_PARAM}=${featureId}&collection=${encodeURIComponent(collectionId)}`;
}

export function brandAttributeSchemaReleaseChecklistHref(
  collectionId: string = PLATFORM_CORE_DEMO.collectionId
): string {
  return `${ROUTES.brand.launchReadiness}?${PILLAR_CAPABILITY_FEATURE_PARAM}=checklist&collection=${encodeURIComponent(collectionId)}`;
}

export function brandAttributeSchemaMaterialPassportHref(
  collectionId: string = PLATFORM_CORE_DEMO.collectionId
): string {
  return brandMaterialPassportFeatureHref('rollup', collectionId);
}
