'use client';

import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';
import { PlatformCoreContextBar } from '@/components/platform/PlatformCoreContextBar';

type Props = {
  roleId: CoreChainRoleId;
  pillarId: CoreHubPillarId;
  entityLabel?: string;
  backHref: string;
  backLabel: string;
  /** Cross-role peer на том же артикуле (напр. бренд → досье цеха). */
  peerHref?: string;
  peerLabel?: string;
  /** Ссылка на чат по артикулу (brand W2 dossier → comms). */
  commsHref?: string;
  commsLabel?: string;
  commsTestId?: string;
};

/** Путь и возврат на глубоких workspace без ListChrome (досье артикула и т.п.). */
export function PlatformCoreWorkspaceWayfinding({
  roleId,
  pillarId,
  entityLabel,
  backHref,
  backLabel,
  peerHref,
  peerLabel,
  commsHref,
  commsLabel = 'Чат по артикулу',
  commsTestId = 'workspace-article-chat-link',
}: Props) {
  return (
    <div
      data-testid="platform-core-workspace-wayfinding"
      className="border-border-subtle space-y-2 rounded-lg border bg-white px-3 py-2.5 shadow-sm"
    >
      <PlatformCoreContextBar
        roleId={roleId}
        pillarId={pillarId}
        entityLabel={entityLabel}
        showDemoIdStrip={false}
      />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link
          href={backHref}
          data-testid="platform-core-workspace-back"
          className="text-text-secondary hover:text-accent-primary inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {backLabel}
        </Link>
        {peerHref && peerLabel ? (
          <Link
            href={peerHref}
            data-testid="platform-core-workspace-peer"
            className="text-accent-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            {peerLabel} →
          </Link>
        ) : null}
        {commsHref ? (
          <Link
            href={commsHref}
            data-testid={commsTestId}
            className="text-accent-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {commsLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
