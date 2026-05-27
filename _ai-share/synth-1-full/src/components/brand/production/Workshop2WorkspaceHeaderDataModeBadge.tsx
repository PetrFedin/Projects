'use client';

import { useArticleWorkspaceOptional } from '@/components/brand/production/article-workspace-context';
import { W2_OPERATIONAL_DATA_BADGE } from '@/components/brand/production/workshop2-operational-panel-chrome';
import { formatWorkshop2DataModeBadgeLabel } from '@/lib/production/workshop2-no-demo-deadends';

/** Единственный badge API/local в карточке артикула Workshop2. */
export function Workshop2WorkspaceHeaderDataModeBadge() {
  const workspace = useArticleWorkspaceOptional();
  if (!workspace) return null;
  const { dataMode } = workspace;
  return (
    <span
      className={W2_OPERATIONAL_DATA_BADGE}
      data-testid="workshop2-workspace-data-mode-badge"
      title={dataMode === 'http' ? 'Данные с API (PG)' : 'Локальные данные в браузере'}
    >
      {formatWorkshop2DataModeBadgeLabel(dataMode)}
    </span>
  );
}
