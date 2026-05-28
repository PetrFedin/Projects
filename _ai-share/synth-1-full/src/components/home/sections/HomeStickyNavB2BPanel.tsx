'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { useHomeB2BScrollSync } from '@/components/home/hooks/use-home-b2b-scroll-sync';

const HomeB2BNavigation = dynamic(
  () =>
    import('@/components/home/B2BNavigation').then((m) => ({
      default: m.B2BNavigation,
    })),
  {
    ssr: false,
    loading: () => <div className="min-h-[48px] animate-pulse bg-muted/30" aria-hidden />,
  }
);

type HomeStickyNavB2BPanelProps = {
  viewRole: string;
};

/** B2B sticky nav + scroll spy — chunk только для b2b role. */
export const HomeStickyNavB2BPanel = memo(function HomeStickyNavB2BPanel({
  viewRole,
}: HomeStickyNavB2BPanelProps) {
  const { isScrolledDown, activeB2BSection, setActiveB2BSection } = useHomeB2BScrollSync(true);

  return (
    <div className="relative z-[100]">
      <HomeB2BNavigation
        viewRole={viewRole}
        activeB2BSection={activeB2BSection}
        onSectionChange={setActiveB2BSection}
        isScrolledDown={isScrolledDown}
      />
    </div>
  );
});
