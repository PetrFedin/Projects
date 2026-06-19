/**
 * URL-навигация по вкладкам workspace (param `pcf`) + cross-links.
 */
import type { EntityLink } from '@/lib/data/entity-links';
import type { PillarCapabilityContext } from '@/lib/platform/pillar-capability-registry';
import { getPillarCapabilityCrossLinks } from '@/lib/platform/pillar-capability-links';
import {
  getPillarCapabilityWorkspace,
  PILLAR_CAPABILITY_FEATURE_PARAM,
  resolvePillarWorkspaceFeatureId,
  type PillarCapabilityWorkspace,
} from '@/lib/platform/pillar-capability-workspaces';

export function getPillarWorkspaceCrossLinks(
  workspaceId: string,
  ctx: PillarCapabilityContext = {},
  limit = 6
): EntityLink[] {
  const ws = getPillarCapabilityWorkspace(workspaceId);
  if (!ws) return [];
  const anchor = ws.crossLinkAnchorId ?? ws.capabilityId;
  const roleCtx = ctx.role ? ctx : { ...ctx, role: ws.role };
  const enrichedCtx = {
    ...roleCtx,
    workspaceId: ws.id,
    ...(ws.id.startsWith('platform-') && !roleCtx.surface ? { surface: 'platform' as const } : {}),
  };
  return getPillarCapabilityCrossLinks(anchor, enrichedCtx, limit);
}

export function buildPillarWorkspaceFeatureHref(
  basePath: string,
  featureId: string,
  preserveQuery?: { get(name: string): string | null; toString(): string }
): string {
  const sp = new URLSearchParams(preserveQuery?.toString() ?? '');
  sp.set(PILLAR_CAPABILITY_FEATURE_PARAM, featureId);
  const q = sp.toString();
  return q ? `${basePath}?${q}` : basePath;
}

export function readPillarWorkspaceFeatureFromSearchParams(
  workspace: PillarCapabilityWorkspace,
  searchParams: { get(name: string): string | null }
): string {
  return resolvePillarWorkspaceFeatureId(
    workspace,
    searchParams.get(PILLAR_CAPABILITY_FEATURE_PARAM)
  );
}
