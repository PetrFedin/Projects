import {
  PILLAR_CAPABILITY_REGISTRY,
  type PillarCapabilityStatus,
} from '@/lib/platform/pillar-capability-registry';
import {
  PILLAR_CAPABILITY_WORKSPACES,
  type PillarCapabilityFeatureStatus,
} from '@/lib/platform/pillar-capability-workspaces';

export type PillarCapabilityStatusSummary = {
  capabilities: Record<PillarCapabilityStatus, number>;
  workspaceFeatures: Record<PillarCapabilityFeatureStatus, number>;
  workspaceCount: number;
  capabilityCount: number;
};

/** Честная сводка: registry status vs workspace tab status (аналитическая записка Platform Core). */
export function summarizePillarCapabilityPlatformStatus(): PillarCapabilityStatusSummary {
  const capabilities: Record<PillarCapabilityStatus, number> = {
    live: 0,
    enhance: 0,
    planned: 0,
  };
  for (const entry of PILLAR_CAPABILITY_REGISTRY) {
    capabilities[entry.status] += 1;
  }

  const workspaceFeatures: Record<PillarCapabilityFeatureStatus, number> = {
    live: 0,
    stub: 0,
    planned: 0,
  };
  for (const ws of Object.values(PILLAR_CAPABILITY_WORKSPACES)) {
    for (const f of ws.features) {
      workspaceFeatures[f.status] += 1;
    }
  }

  return {
    capabilities,
    workspaceFeatures,
    workspaceCount: Object.keys(PILLAR_CAPABILITY_WORKSPACES).length,
    capabilityCount: PILLAR_CAPABILITY_REGISTRY.length,
  };
}
