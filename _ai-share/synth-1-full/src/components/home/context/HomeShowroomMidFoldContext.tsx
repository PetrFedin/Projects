'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import type { GlobalCategory, Product } from '@/lib/types';
import { totalLookCards } from '@/components/home/_fixtures/home-data';
import { filterShowroomProducts } from '@/components/home/lib/filter-showroom-products';
import { HomeLookDetailsDialogHost } from '@/components/home/sections/HomeLookDetailsDialogHost';

type ShowroomViewMode = 'products' | 'looks' | 'collections' | 'my_orders' | 'planning';

export type HomeShowroomLookDialogContextValue = {
  selectedLook: unknown;
  setSelectedLook: (look: unknown) => void;
  isLookDetailsOpen: boolean;
  setIsLookDetailsOpen: (open: boolean) => void;
};

export type HomeShowroomLinesheetContextValue = {
  isLinesheetMode: boolean;
  setIsLinesheetMode: Dispatch<SetStateAction<boolean>>;
  selectedLinesheetItems: string[];
  setSelectedLinesheetItems: Dispatch<SetStateAction<string[]>>;
};

export type HomeShowroomBrandsContextValue = {
  brandsTab: string;
  setBrandsTab: (tab: string) => void;
};

export type HomeShowroomShowcaseContextValue = {
  viewRole: string;
  productsReady: boolean;
  products: Product[];
  showroomTab: string;
  setShowroomTab: (tab: string) => void;
  showroomViewMode: ShowroomViewMode;
  setShowroomViewMode: (mode: ShowroomViewMode) => void;
  currency: 'RUB' | 'USD' | 'EUR';
  toast: ReturnType<typeof useToast>['toast'];
  router: ReturnType<typeof useRouter>;
  carousels: CmsHomeConfig['carousels'];
  filteredShowroomProducts: Product[];
  totalLookCards: typeof totalLookCards;
};

const HomeShowroomLookDialogContext = createContext<HomeShowroomLookDialogContextValue | null>(
  null
);
const HomeShowroomLinesheetContext = createContext<HomeShowroomLinesheetContextValue | null>(null);
const HomeShowroomBrandsContext = createContext<HomeShowroomBrandsContextValue | null>(null);
const HomeShowroomShowcaseContext = createContext<HomeShowroomShowcaseContextValue | null>(null);

export function useHomeShowroomLookDialog() {
  const ctx = useContext(HomeShowroomLookDialogContext);
  if (!ctx) {
    throw new Error('useHomeShowroomLookDialog must be used within HomeShowroomMidFoldProvider');
  }
  return ctx;
}

export function useHomeShowroomLinesheet() {
  const ctx = useContext(HomeShowroomLinesheetContext);
  if (!ctx) {
    throw new Error('useHomeShowroomLinesheet must be used within HomeShowroomMidFoldProvider');
  }
  return ctx;
}

export function useHomeShowroomBrands() {
  const ctx = useContext(HomeShowroomBrandsContext);
  if (!ctx) {
    throw new Error('useHomeShowroomBrands must be used within HomeShowroomMidFoldProvider');
  }
  return ctx;
}

export function useHomeShowroomShowcase() {
  const ctx = useContext(HomeShowroomShowcaseContext);
  if (!ctx) {
    throw new Error('useHomeShowroomShowcase must be used within HomeShowroomMidFoldProvider');
  }
  return ctx;
}

/** @deprecated Используйте useHomeShowroomLookDialog / useHomeShowroomLinesheet / useHomeShowroomBrands / useHomeShowroomShowcase */
export function useHomeShowroomMidFold() {
  return {
    ...useHomeShowroomLookDialog(),
    ...useHomeShowroomLinesheet(),
    ...useHomeShowroomBrands(),
    ...useHomeShowroomShowcase(),
  };
}

type HomeShowroomMidFoldProviderProps = {
  viewRole: string;
  products: Product[];
  productsReady: boolean;
  globalCategory: GlobalCategory;
  carousels: CmsHomeConfig['carousels'];
  children: ReactNode;
};

/** Linesheet, brands tab, look dialog и showroom — четыре context для точечных re-renders. */
export function HomeShowroomMidFoldProvider({
  viewRole,
  products,
  productsReady,
  globalCategory,
  carousels,
  children,
}: HomeShowroomMidFoldProviderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [brandsTab, setBrandsTab] = useState('selection');
  const [isLinesheetMode, setIsLinesheetMode] = useState(false);
  const [selectedLinesheetItems, setSelectedLinesheetItems] = useState<string[]>([]);
  const [showroomTab, setShowroomTab] = useState('all');
  const [showroomViewMode, setShowroomViewMode] = useState<ShowroomViewMode>('products');
  const [currency] = useState<'RUB' | 'USD' | 'EUR'>('RUB');
  const [selectedLook, setSelectedLook] = useState<unknown>(null);
  const [isLookDetailsOpen, setIsLookDetailsOpen] = useState(false);

  const filteredShowroomProducts = useMemo(
    () => filterShowroomProducts(products, globalCategory, showroomTab, carousels),
    [products, globalCategory, showroomTab, carousels]
  );

  const lookDialogValue = useMemo<HomeShowroomLookDialogContextValue>(
    () => ({
      selectedLook,
      setSelectedLook,
      isLookDetailsOpen,
      setIsLookDetailsOpen,
    }),
    [selectedLook, isLookDetailsOpen]
  );

  const linesheetValue = useMemo<HomeShowroomLinesheetContextValue>(
    () => ({
      isLinesheetMode,
      setIsLinesheetMode,
      selectedLinesheetItems,
      setSelectedLinesheetItems,
    }),
    [isLinesheetMode, selectedLinesheetItems]
  );

  const brandsValue = useMemo<HomeShowroomBrandsContextValue>(
    () => ({
      brandsTab,
      setBrandsTab,
    }),
    [brandsTab]
  );

  const showcaseValue = useMemo<HomeShowroomShowcaseContextValue>(
    () => ({
      viewRole,
      productsReady,
      products,
      showroomTab,
      setShowroomTab,
      showroomViewMode,
      setShowroomViewMode,
      currency,
      toast,
      router,
      carousels,
      filteredShowroomProducts,
      totalLookCards,
    }),
    [
      viewRole,
      productsReady,
      products,
      showroomTab,
      showroomViewMode,
      currency,
      toast,
      router,
      carousels,
      filteredShowroomProducts,
    ]
  );

  return (
    <HomeShowroomLinesheetContext.Provider value={linesheetValue}>
      <HomeShowroomBrandsContext.Provider value={brandsValue}>
        <HomeShowroomLookDialogContext.Provider value={lookDialogValue}>
          <HomeShowroomShowcaseContext.Provider value={showcaseValue}>
            {children}
            <HomeLookDetailsDialogHost />
          </HomeShowroomShowcaseContext.Provider>
        </HomeShowroomLookDialogContext.Provider>
      </HomeShowroomBrandsContext.Provider>
    </HomeShowroomLinesheetContext.Provider>
  );
}
