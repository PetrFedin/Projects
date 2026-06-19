'use client';

import type { ReactNode } from 'react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { PlatformCoreListChrome } from '@/components/platform/PlatformCoreListChrome';
import { PlatformCoreLegacyPathRedirect } from '@/components/platform/PlatformCoreLegacyPathRedirect';
import type { CoreChainRoleId, CoreHubPillarId } from '@/lib/platform-core-hub-matrix';

type Props = {
  highlightRole: CoreChainRoleId;
  pillarId: CoreHubPillarId;
  targetHref: string;
  testId: string;
  message: ReactNode;
  maxWidth?: '3xl' | '4xl' | '5xl' | 'full';
};

/** Core: легаси-маршрут вне golden path → ListChrome + редирект на канон. */
export function PlatformCoreLegacyTailPage({
  highlightRole,
  pillarId,
  targetHref,
  testId,
  message,
  maxWidth = '3xl',
}: Props) {
  return (
    <CabinetPageContent maxWidth={maxWidth} className="space-y-6 px-4 py-6">
      <PlatformCoreListChrome highlightRole={highlightRole} pillarId={pillarId}>
        <PlatformCoreLegacyPathRedirect targetHref={targetHref} testId={testId} message={message} />
      </PlatformCoreListChrome>
    </CabinetPageContent>
  );
}
