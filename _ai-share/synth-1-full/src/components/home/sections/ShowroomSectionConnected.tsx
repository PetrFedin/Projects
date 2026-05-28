'use client';

import { memo, type Dispatch, type SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { totalLookCards } from '@/components/home/_fixtures/home-data';

const ShowroomSection = dynamic(
  () =>
    import('@/components/home/sections/ShowroomSection').then((m) => ({
      default: m.ShowroomSection,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[420px] animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

export type ShowroomSectionConnectedProps = {
  viewRole: string;
  showroomTab: string;
  setShowroomTab: (tab: string) => void;
  showroomViewMode: 'products' | 'looks' | 'collections' | 'my_orders' | 'planning';
  setShowroomViewMode: (
    mode: 'products' | 'looks' | 'collections' | 'my_orders' | 'planning'
  ) => void;
  toast: ReturnType<typeof useToast>['toast'];
  carousels: CmsHomeConfig['carousels'];
  filteredShowroomProducts: Product[];
  totalLookCards: typeof totalLookCards;
  isLinesheetMode: boolean;
  selectedLinesheetItems: string[];
  setSelectedLinesheetItems: Dispatch<SetStateAction<string[]>>;
  setSelectedLook: (look: unknown) => void;
  setIsLookDetailsOpen: (open: boolean) => void;
  router: ReturnType<typeof useRouter>;
  currency: 'RUB' | 'USD' | 'EUR';
};

function ShowroomSectionConnectedComponent(props: ShowroomSectionConnectedProps) {
  return <ShowroomSection {...props} />;
}

/** memo — gate shell не пересобирает showroom при overlay toggles mid-fold body. */
export const ShowroomSectionConnected = memo(ShowroomSectionConnectedComponent);
