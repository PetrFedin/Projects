'use client';

import type { CoreChainRoleId } from '@/lib/platform-core-hub-matrix';
import { PLATFORM_CORE_ROLE_LABELS } from '@/lib/platform-core-hub-matrix';
import { getPlatformCoreCollectionLabel } from '@/lib/platform-core-demo-context';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';

type HeaderProps = {
  roleId: CoreChainRoleId;
  collectionId: string;
};

/** Компактная шапка кабинета: одна строка «роль · коллекция». */
export function RoleCabinetHubHeader({ roleId, collectionId }: HeaderProps) {
  const collectionLabel = getPlatformCoreCollectionLabel(collectionId);
  return (
    <header className={hubCabinet.headerCompact} data-testid="role-cabinet-hub-header">
      <p className={hubCabinet.headerCompactLine}>
        <span className="text-text-primary font-bold">{PLATFORM_CORE_ROLE_LABELS[roleId]}</span>
        <span className="text-text-muted"> · </span>
        <span>{collectionLabel}</span>
      </p>
    </header>
  );
}
