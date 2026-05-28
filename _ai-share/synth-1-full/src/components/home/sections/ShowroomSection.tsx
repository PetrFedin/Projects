'use client';

import { memo, type Dispatch, type SetStateAction } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { useB2BState } from '@/providers/b2b-state';

const ShowroomNavigation = dynamic(
  () =>
    import('@/components/showroom/ShowroomNavigation').then((m) => ({
      default: m.ShowroomNavigation,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mb-4 h-14 w-full animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

const ShowroomGrid = dynamic(
  () =>
    import('@/components/showroom/ShowroomGrid').then((m) => ({
      default: m.ShowroomGrid,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[400px] min-w-full snap-start items-center justify-center rounded-xl bg-muted/30"
        aria-hidden
      >
        <div className="h-48 w-full max-w-md animate-pulse rounded-lg bg-muted/50" />
      </div>
    ),
  }
);

const ShowroomSectionBanner = dynamic(
  () =>
    import('@/components/home/sections/ShowroomSectionBanner').then((m) => ({
      default: m.ShowroomSectionBanner,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 min-h-[300px] w-full animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

const ShowroomSectionWrapper = dynamic(
  () =>
    import('@/components/home/sections/ShowroomSectionMotion').then((m) => ({
      default: m.ShowroomSectionWrapper,
    })),
  { ssr: false }
);

const ShowroomGridPresence = dynamic(
  () =>
    import('@/components/home/sections/ShowroomSectionMotion').then((m) => ({
      default: m.ShowroomGridPresence,
    })),
  { ssr: false }
);

interface ShowroomSectionProps {
  viewRole: string;
  showroomTab: string;
  setShowroomTab: (tab: string) => void;
  showroomViewMode: 'products' | 'looks' | 'collections' | 'my_orders' | 'planning';
  setShowroomViewMode: (
    mode: 'products' | 'looks' | 'collections' | 'my_orders' | 'planning'
  ) => void;
  toast: any;
  carousels: any[];
  filteredShowroomProducts: any[];
  totalLookCards: any[];
  isLinesheetMode: boolean;
  selectedLinesheetItems: string[];
  setSelectedLinesheetItems: Dispatch<SetStateAction<string[]>>;
  setSelectedLook: (look: any) => void;
  setIsLookDetailsOpen: (open: boolean) => void;
  router: any;
  currency: 'RUB' | 'USD' | 'EUR';
}

function ShowroomSectionComponent({
  viewRole,
  showroomTab,
  setShowroomTab,
  showroomViewMode,
  setShowroomViewMode,
  toast,
  carousels,
  filteredShowroomProducts,
  totalLookCards,
  isLinesheetMode,
  selectedLinesheetItems,
  setSelectedLinesheetItems,
  setSelectedLook,
  setIsLookDetailsOpen,
  router,
  currency,
}: ShowroomSectionProps) {
  const { addB2bActivityLog } = useB2BState();
  const gridTabKey = `${showroomTab}-${showroomViewMode}`;

  return (
    <ShowroomSectionWrapper>
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle group relative flex min-h-[400px] flex-col justify-center rounded-xl border border-none bg-white shadow-2xl shadow-md transition-all">
          <CardContent className="relative z-10 p-4">
            <ShowroomNavigation
              viewRole={viewRole}
              showroomTab={showroomTab}
              setShowroomTab={(tab) => {
                setShowroomTab(tab);
                if (viewRole === 'b2b') {
                  addB2bActivityLog({
                    type: 'view_product',
                    actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                    target: { id: tab, name: tab === 'all' ? 'Marketroom' : tab, type: 'brand' },
                    details: `Switched showroom tab to ${tab}.`,
                  });
                }
              }}
              showroomViewMode={showroomViewMode}
              setShowroomViewMode={setShowroomViewMode}
              toast={toast}
              carousels={carousels}
            />

            <div className="group/showroom relative -mx-4 px-4">
              <div
                id="showroom-scroll"
                className="custom-scrollbar flex min-h-[400px] snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-6"
              >
                <ShowroomGridPresence tabKey={gridTabKey}>
                  <ShowroomGrid
                    viewRole={viewRole}
                    showroomTab={showroomTab}
                    showroomViewMode={showroomViewMode}
                    filteredShowroomProducts={filteredShowroomProducts}
                    totalLookCards={totalLookCards}
                    isLinesheetMode={isLinesheetMode}
                    selectedLinesheetItems={selectedLinesheetItems}
                    setSelectedLinesheetItems={setSelectedLinesheetItems}
                    setSelectedLook={setSelectedLook}
                    setIsLookDetailsOpen={setIsLookDetailsOpen}
                    router={router}
                    currency={currency}
                  />
                </ShowroomGridPresence>
              </div>
            </div>

            <ShowroomSectionBanner viewRole={viewRole} showroomTab={showroomTab} />

            <div className="absolute bottom-8 right-10 z-20 flex cursor-default items-center gap-2 opacity-20 transition-opacity hover:opacity-100">
              <div className="bg-accent-primary h-1 w-1 animate-pulse rounded-full" />
              <span className="text-text-muted text-[10px] font-medium uppercase tracking-wide">
                MARKETROOM_ENGINE_v4.2
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShowroomSectionWrapper>
  );
}

/** memo — linesheet/showroom props меняются точечно через split context gates. */
export const ShowroomSection = memo(ShowroomSectionComponent);
