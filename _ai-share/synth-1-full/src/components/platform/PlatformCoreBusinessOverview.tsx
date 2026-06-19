'use client';

import {
  getDemoTrailPrimaryHref,
  PLATFORM_CORE_PILLARS,
  type CoreHubPillarId,
} from '@/lib/platform-core-hub-matrix';
import { PLATFORM_CORE_HUB_CARD_ROW } from '@/lib/platform-core-hub-carousel';
import { PLATFORM_CORE_PILLAR_ICONS } from '@/lib/platform-core-pillar-icons';
import { PlatformCoreHubQuickCard } from '@/components/platform/PlatformCoreHubQuickCard';

export function PlatformCoreBusinessOverview() {
  return (
    <div data-testid="platform-core-business-overview" className="space-y-2">
      <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
        Столпы · быстрый вход
      </p>
      <div className={PLATFORM_CORE_HUB_CARD_ROW}>
        {PLATFORM_CORE_PILLARS.map((pillar) => {
          const href = getDemoTrailPrimaryHref(pillar.id as CoreHubPillarId);
          return (
            <PlatformCoreHubQuickCard
              key={pillar.id}
              id={`pillar-${pillar.id}`}
              href={href ?? `/platform#pillar-${pillar.id}`}
              testId={`hub-pillar-${pillar.id}`}
              icon={PLATFORM_CORE_PILLAR_ICONS[pillar.id]}
              title={pillar.title}
              subtitle={pillar.subtitle}
            />
          );
        })}
      </div>
    </div>
  );
}
