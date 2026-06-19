'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { PillarCapabilityContext } from '@/lib/platform/pillar-capability-registry';
import { usePillarCapabilityWorkspace } from '@/hooks/use-pillar-capability-workspace';
import { getPillarWorkspaceCrossLinks } from '@/lib/platform/pillar-capability-workspace-nav';
import { buildPillarWorkspaceContext } from '@/lib/platform/pillar-workspace-context';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { platformCoreHeaderHubTabClass } from '@/lib/platform-core-header-controls';
import { PillarCapabilityCrossLinksStrip } from '@/components/platform/PillarCapabilityCrossLinksStrip';

export type PillarCapabilityWorkspaceChromeProps = {
  workspaceId: string;
  ctx?: PillarCapabilityContext;
  children: ReactNode;
  /** Контент над вкладками (banner, ERP strip). */
  beforeTabs?: ReactNode;
  className?: string;
  crossLinksTitle?: string;
  crossLinksLimit?: number;
  /** Скрыть footer cross-links (на hub — без дубля «Release gate / Handoff»). */
  showCrossLinks?: boolean;
};

/**
 * Единая оболочка workspace: заголовок + вкладки фич + контент + cross-links.
 * Новая фича = запись в pillar-capability-workspaces.ts, без нового route.
 */
export function PillarCapabilityWorkspaceChrome({
  workspaceId,
  ctx = {},
  children,
  beforeTabs,
  className,
  crossLinksTitle = 'Связанные разделы',
  crossLinksLimit = 6,
  showCrossLinks = true,
}: PillarCapabilityWorkspaceChromeProps) {
  const { workspace, activeFeatureId, setActiveFeatureId } = usePillarCapabilityWorkspace(workspaceId);

  const effectiveCtx = useMemo(
    () => (workspace ? buildPillarWorkspaceContext(workspaceId, ctx) : ctx),
    [workspaceId, ctx, workspace]
  );

  if (!workspace) return <>{children}</>;

  const coreMode = isPlatformCoreMode();
  const crossLinks = getPillarWorkspaceCrossLinks(workspaceId, effectiveCtx, crossLinksLimit);
  const missingOrderHintCount = effectiveCtx.orderId?.trim()
    ? 0
    : crossLinks.filter((link) => link.disabled).length;

  return (
    <div className={cn('space-y-4', className)} data-testid={`pillar-workspace-${workspaceId}`}>
      {!coreMode ? (
        <header className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-text-primary text-sm font-black uppercase tracking-tight">
              {workspace.titleRu}
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase">
              {workspace.pillar.replace('_', ' ')}
            </Badge>
            {effectiveCtx.role ? (
              <Badge
                variant="secondary"
                className="text-[10px] uppercase"
                data-testid={`pillar-workspace-${workspaceId}-role-${effectiveCtx.role}`}
              >
                {effectiveCtx.role}
              </Badge>
            ) : null}
          </div>
          <p className="text-text-secondary max-w-3xl text-sm">{workspace.leadRu}</p>
        </header>
      ) : null}

      {beforeTabs}

      <nav
        className={cn(
          coreMode
            ? cn(hubCabinet.workspacePillarStrip, 'border-b-0 pb-0')
            : 'border-border-subtle flex flex-wrap gap-1 border-b pb-2'
        )}
        aria-label="Функции workspace"
        data-testid={`pillar-workspace-${workspaceId}-tabs`}
      >
        <div className={cn(coreMode && hubCabinet.pillarNavPillRow, !coreMode && 'flex flex-wrap gap-1')}>
        {workspace.features.map((feature) => {
          const active = feature.id === activeFeatureId;
          const disabled = feature.status === 'planned';
          return (
            <button
              key={feature.id}
              type="button"
              disabled={disabled}
              onClick={() => setActiveFeatureId(feature.id)}
              className={cn(
                coreMode
                  ? cn(
                      platformCoreHeaderHubTabClass(active),
                      disabled && 'cursor-not-allowed opacity-40'
                    )
                  : cn(
                      'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
                      active
                        ? 'bg-text-primary text-white'
                        : 'text-text-secondary hover:bg-bg-surface2 hover:text-text-primary'
                    ),
                disabled && 'cursor-not-allowed opacity-40'
              )}
              data-testid={feature.testId}
              title={feature.summaryRu}
            >
              {feature.labelRu}
              {feature.status === 'stub' ? (
                <span className="ml-1 opacity-70">·</span>
              ) : null}
            </button>
          );
        })}
        </div>
      </nav>

      <div data-testid={`pillar-workspace-${workspaceId}-panel`}>{children}</div>

      {showCrossLinks ? (
        <PillarCapabilityCrossLinksStrip
          title={crossLinksTitle}
          links={crossLinks}
          missingOrderHintCount={missingOrderHintCount}
          testId={`pillar-workspace-${workspaceId}-cross-links`}
          className="pb-safe lg:pb-0"
        />
      ) : null}
    </div>
  );
}
