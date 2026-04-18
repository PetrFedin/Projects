'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { useUIState } from '@/providers/ui-state';
import { AboutTab } from './tabs/AboutTab';
import { ProductsTab } from './tabs/ProductsTab';
import { MediaTab } from './tabs/MediaTab';
import { PartnershipTab } from './tabs/PartnershipTab';
import type { AudienceFilter } from './tabs/ProductsTab';

interface BrandTabsProps {
  filteredProducts: any[];
  brand: any;
  storefrontSettings: any;
  isTeamOpen: boolean;
  setIsTeamOpen: (open: boolean) => void;
  currentTeamIdx: number;
  setCurrentTeamIdx: (idx: number | ((prev: number) => number)) => void;
  setIsRetailerMapOpen: (open: boolean) => void;
  setIsRetailerOpen: (open: boolean) => void;
  setIsShareLookOpen: (open: boolean) => void;
  activeTopCatalog: any;
  setActiveTopCatalog: (v: any) => void;
<<<<<<< HEAD
  setFilterOutlet: (v: boolean) => void;
=======
  setFilterOutlet: React.Dispatch<React.SetStateAction<string[]>>;
>>>>>>> recover/cabinet-wip-from-stash
  capsuleCollections: any[];
  activeCapsule: any;
  setActiveCapsule: (v: any) => void;
  filterAvailability: any[];
<<<<<<< HEAD
  setFilterAvailability: (v: any[]) => void;
  activeTopAudience: any;
  setActiveTopAudience: (v: any) => void;
  setActiveAudience: (v: any) => void;
  setFilterCategory: (v: any[]) => void;
  setFilterAttributes: (v: any) => void;
  setFilterColor: (v: any[]) => void;
  setFilterSizes: (v: any[]) => void;
=======
  setFilterAvailability: React.Dispatch<React.SetStateAction<string[]>>;
  activeTopAudience: any;
  setActiveTopAudience: (v: any) => void;
  setActiveAudience: React.Dispatch<React.SetStateAction<AudienceFilter[]>>;
  setFilterCategory: React.Dispatch<React.SetStateAction<string[]>>;
  setFilterAttributes: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setFilterColor: React.Dispatch<React.SetStateAction<string[]>>;
  setFilterSizes: React.Dispatch<React.SetStateAction<string[]>>;
>>>>>>> recover/cabinet-wip-from-stash
  setSelectedSizeRow: (v: any) => void;
  isFilterSidebarOpen: boolean;
  setIsFilterSidebarOpen: (v: boolean) => void;
  activeAudience: any;
  filterCategory: any[];
  categoriesData: any[];
  getAllowedCategories: any;
  filterColor: any[];
  colorsData: any[];
  selectedSizeRow: any;
  activeSizeChart: any;
  measurementLabels: any;
  filterAttributes: any;
  attributesData: any[];
  getAllowedAttributes: any;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  setIsAiSizeDialogOpen: (v: boolean) => void;
  displayName: string;
  mediaPeriod: string;
<<<<<<< HEAD
  setMediaPeriod: (v: any) => void;
=======
  setMediaPeriod: (v: 'week' | 'month' | 'year' | 'all') => void;
>>>>>>> recover/cabinet-wip-from-stash
  selectedDate: Date | undefined;
  setSelectedDate: (v: Date | undefined) => void;
  activeMediaTab: string;
  setActiveMediaTab: (v: string) => void;
  filteredMediaData: any;
  storyImages: any[];
  handleOpenStory: (story: any, list: any[]) => void;
  setSelectedEvent: (v: any) => void;
  setIsLivePlayerOpen: (v: boolean) => void;
  setIsLiveReminderOpen: (v: boolean) => void;
  handleEventRegistration: (id: number, type: string) => void;
  registeredEvents: number[];
  setSelectedBlog: (v: any) => void;
  setSelectedSocial: (v: any) => void;
  setSelectedStoryVideo: (v: any) => void;
  setSelectedMention: (v: any) => void;
  setSelectedPress: (v: any) => void;
  setIsPressKitOpen: (v: boolean) => void;
  setMessageCategory: (v: string) => void;
  setIsMessageDialogOpen: (v: boolean) => void;
  handleB2bRequest: (v: string) => void;
  sentB2bRequests: any;
<<<<<<< HEAD
  b2bPartnerStatus: string;
  setB2bPartnerStatus: (v: string) => void;
  handleB2bRegistration: (v: string) => void;
=======
  b2bPartnerStatus: 'none' | 'pending' | 'friend' | 'active' | 'spot';
  setB2bPartnerStatus: (v: 'none' | 'pending' | 'friend' | 'active' | 'spot') => void;
  handleB2bRegistration: () => void;
>>>>>>> recover/cabinet-wip-from-stash
  toast: any;
}

export function BrandTabs({
  filteredProducts,
  brand,
  storefrontSettings,
  isTeamOpen,
  setIsTeamOpen,
  currentTeamIdx,
  setCurrentTeamIdx,
  setIsRetailerMapOpen,
  setIsRetailerOpen,
  setIsShareLookOpen,
  activeTopCatalog,
  setActiveTopCatalog,
  setFilterOutlet,
  capsuleCollections,
  activeCapsule,
  setActiveCapsule,
  filterAvailability,
  setFilterAvailability,
  activeTopAudience,
  setActiveTopAudience,
  setActiveAudience,
  setFilterCategory,
  setFilterAttributes,
  setFilterColor,
  setFilterSizes,
  setSelectedSizeRow,
  isFilterSidebarOpen,
  setIsFilterSidebarOpen,
  activeAudience,
  filterCategory,
  categoriesData,
  getAllowedCategories,
  filterColor,
  colorsData,
  selectedSizeRow,
  activeSizeChart,
  measurementLabels,
  filterAttributes,
  attributesData,
  getAllowedAttributes,
  viewMode,
  setViewMode,
  setIsAiSizeDialogOpen,
  displayName,
  mediaPeriod,
  setMediaPeriod,
  selectedDate,
  setSelectedDate,
  activeMediaTab,
  setActiveMediaTab,
  filteredMediaData,
  storyImages,
  handleOpenStory,
  setSelectedEvent,
  setIsLivePlayerOpen,
  setIsLiveReminderOpen,
  handleEventRegistration,
  registeredEvents,
  setSelectedBlog,
  setSelectedSocial,
  setSelectedStoryVideo,
  setSelectedMention,
  setSelectedPress,
  setIsPressKitOpen,
  setMessageCategory,
  setIsMessageDialogOpen,
  handleB2bRequest,
  sentB2bRequests,
  b2bPartnerStatus,
  setB2bPartnerStatus,
  handleB2bRegistration,
  toast,
}: BrandTabsProps) {
  return (
    <Tabs defaultValue="about" className="w-full">
<<<<<<< HEAD
      <TabsList className="no-scrollbar mb-8 flex h-auto justify-start gap-2 overflow-x-auto bg-transparent p-0 pb-2">
        <TabsTrigger
          value="about"
          className="h-9 rounded-xl border border-slate-200 bg-white px-6 text-[11px] font-black uppercase tracking-wider text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
=======
      {/* cabinetSurface v1 */}
      <TabsList
        className={cn(
          cabinetSurface.tabsList,
          'scrollbar-hide mb-8 flex-wrap overflow-x-auto pb-2'
        )}
      >
        <TabsTrigger
          value="about"
          className={cn(
            cabinetSurface.tabsTrigger,
            'h-9 px-4 text-[11px] font-black tracking-wider data-[state=active]:text-foreground'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          О бренде
        </TabsTrigger>
        <TabsTrigger
          value="products"
<<<<<<< HEAD
          className="h-9 rounded-xl border border-slate-200 bg-white px-6 text-[11px] font-black uppercase tracking-wider text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'h-9 px-4 text-[11px] font-black tracking-wider data-[state=active]:text-foreground'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Ассортимент ({filteredProducts.length})
        </TabsTrigger>
        <TabsTrigger
          value="media"
<<<<<<< HEAD
          className="h-9 rounded-xl border border-slate-200 bg-white px-6 text-[11px] font-black uppercase tracking-wider text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'h-9 px-4 text-[11px] font-black tracking-wider data-[state=active]:text-foreground'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Медиа
        </TabsTrigger>
        <TabsTrigger
          value="partnership"
<<<<<<< HEAD
          className="h-9 rounded-xl border border-slate-200 bg-white px-6 text-[11px] font-black uppercase tracking-wider text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
=======
          className={cn(
            cabinetSurface.tabsTrigger,
            'h-9 px-4 text-[11px] font-black tracking-wider data-[state=active]:text-foreground'
          )}
>>>>>>> recover/cabinet-wip-from-stash
        >
          Сотрудничество
        </TabsTrigger>
      </TabsList>

      <AboutTab
        brand={brand}
        storefrontSettings={storefrontSettings}
        isTeamOpen={isTeamOpen}
        setIsTeamOpen={setIsTeamOpen}
        currentTeamIdx={currentTeamIdx}
        setCurrentTeamIdx={setCurrentTeamIdx}
        setIsRetailerMapOpen={setIsRetailerMapOpen}
        setIsRetailerOpen={setIsRetailerOpen}
        setIsShareLookOpen={setIsShareLookOpen}
      />

      <ProductsTab
        activeTopCatalog={activeTopCatalog}
        setActiveTopCatalog={setActiveTopCatalog}
        setFilterOutlet={setFilterOutlet}
        capsuleCollections={capsuleCollections}
        activeCapsule={activeCapsule}
        setActiveCapsule={setActiveCapsule}
        filterAvailability={filterAvailability}
        setFilterAvailability={setFilterAvailability}
        activeTopAudience={activeTopAudience}
        setActiveTopAudience={setActiveTopAudience}
        setActiveAudience={setActiveAudience}
        setFilterCategory={setFilterCategory}
        setFilterAttributes={setFilterAttributes}
        setFilterColor={setFilterColor}
        setFilterSizes={setFilterSizes}
        setSelectedSizeRow={setSelectedSizeRow}
        isFilterSidebarOpen={isFilterSidebarOpen}
        setIsFilterSidebarOpen={setIsFilterSidebarOpen}
        activeAudience={activeAudience}
        filterCategory={filterCategory}
        categoriesData={categoriesData}
        getAllowedCategories={getAllowedCategories}
        filterColor={filterColor}
        colorsData={colorsData}
        selectedSizeRow={selectedSizeRow}
        activeSizeChart={activeSizeChart}
        measurementLabels={measurementLabels}
        filterAttributes={filterAttributes}
        attributesData={attributesData}
        getAllowedAttributes={getAllowedAttributes}
        filteredProducts={filteredProducts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setIsAiSizeDialogOpen={setIsAiSizeDialogOpen}
        displayName={displayName}
      />

      <MediaTab
<<<<<<< HEAD
=======
        displayName={displayName}
>>>>>>> recover/cabinet-wip-from-stash
        mediaPeriod={mediaPeriod}
        setMediaPeriod={setMediaPeriod}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        activeMediaTab={activeMediaTab}
        setActiveMediaTab={setActiveMediaTab}
        filteredMediaData={filteredMediaData}
        storyImages={storyImages}
        handleOpenStory={handleOpenStory}
        setSelectedEvent={setSelectedEvent}
        setIsLivePlayerOpen={setIsLivePlayerOpen}
        setIsLiveReminderOpen={setIsLiveReminderOpen}
        handleEventRegistration={handleEventRegistration}
        registeredEvents={registeredEvents}
        setSelectedBlog={setSelectedBlog}
        setSelectedSocial={setSelectedSocial}
        setSelectedStoryVideo={setSelectedStoryVideo}
        setSelectedMention={setSelectedMention}
        setSelectedPress={setSelectedPress}
        setIsPressKitOpen={setIsPressKitOpen}
<<<<<<< HEAD
=======
        toast={toast}
        setB2bPartnerStatus={setB2bPartnerStatus}
>>>>>>> recover/cabinet-wip-from-stash
      />

      <PartnershipTab
        brand={brand}
        displayName={displayName}
        setMessageCategory={setMessageCategory}
        setIsMessageDialogOpen={setIsMessageDialogOpen}
        handleB2bRequest={handleB2bRequest}
        sentB2bRequests={sentB2bRequests}
        b2bPartnerStatus={b2bPartnerStatus}
        setB2bPartnerStatus={setB2bPartnerStatus}
        handleB2bRegistration={handleB2bRegistration}
        toast={toast}
      />
    </Tabs>
  );
}
