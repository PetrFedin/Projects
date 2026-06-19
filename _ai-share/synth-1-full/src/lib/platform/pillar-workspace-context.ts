import type { PillarCapabilityContext } from '@/lib/platform/pillar-capability-registry';
import { getPillarCapabilityWorkspace } from '@/lib/platform/pillar-capability-workspaces';

/** Единый ctx для chrome + cross-links: role/surface из workspace, без дублирования на каждой странице. */
export function buildPillarWorkspaceContext(
  workspaceId: string,
  input: PillarCapabilityContext = {}
): PillarCapabilityContext {
  const ws = getPillarCapabilityWorkspace(workspaceId);
  if (!ws) return { ...input, workspaceId };

  return {
    ...input,
    role: input.role ?? ws.role,
    workspaceId: input.workspaceId ?? workspaceId,
    surface:
      input.surface ??
      (workspaceId.startsWith('platform-') ? ('platform' as const) : input.surface),
  };
}
