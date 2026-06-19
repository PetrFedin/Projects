import {
  getPillarCapabilityWorkspace,
  PILLAR_CAPABILITY_WORKSPACES,
  resolvePillarWorkspaceFeatureId,
} from '@/lib/platform/pillar-capability-workspaces';
import { PILLAR_CAPABILITY_REGISTRY } from '@/lib/platform/pillar-capability-registry';

describe('pillar-capability-workspaces', () => {
  it('workspace capabilityIds exist in registry', () => {
    const registryIds = new Set(PILLAR_CAPABILITY_REGISTRY.map((e) => e.id));
    for (const ws of Object.values(PILLAR_CAPABILITY_WORKSPACES)) {
      expect(registryIds.has(ws.capabilityId)).toBe(true);
    }
  });

  it('default feature exists and is not planned', () => {
    for (const ws of Object.values(PILLAR_CAPABILITY_WORKSPACES)) {
      const def = ws.features.find((f) => f.id === ws.defaultFeatureId);
      expect(def).toBeDefined();
      expect(def?.status).not.toBe('planned');
    }
  });

  it('resolvePillarWorkspaceFeatureId falls back from invalid tab', () => {
    const ws = getPillarCapabilityWorkspace('shop-wholesale-matrix')!;
    expect(resolvePillarWorkspaceFeatureId(ws, 'unknown')).toBe('matrix');
    expect(resolvePillarWorkspaceFeatureId(ws, 'prepack')).toBe('prepack');
  });
});
