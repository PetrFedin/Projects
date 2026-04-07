'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  ShoppingBag, 
  BarChart3, 
  Layers, 
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Tag,
  Orbit,
  Scan,
  Package,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { VisualConstellation } from './VisualConstellation';
import { DigitalTwinRunway } from './DigitalTwinRunway';
import { VisualAssortmentPlanner } from '../b2b/AssortmentPlanner';
import { WholesaleCollectionExplorer } from '../b2b/WholesaleCollectionExplorer';
import { WholesaleOrderMatrix } from '../b2b/WholesaleOrderMatrix';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

interface ShowroomNavigationProps {
  viewRole: string;
  showroomTab: string;
  setShowroomTab: (tab: string) => void;
  showroomViewMode: string;
  setShowroomViewMode: (mode: any) => void;
  toast: any;
  carousels: any[];
}

export const ShowroomNavigation: React.FC<ShowroomNavigationProps> = ({
  viewRole,
  showroomTab,
  setShowroomTab,
  showroomViewMode,
  setShowroomViewMode,
  toast,
  carousels
}) => {
  const { isConstellationOpen, setIsConstellationOpen } = useUIState();
  const { addB2bActivityLog, assortmentPlan } = useB2BState();
  const [isRunwayOpen, setIsRunwayOpen] = React.useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = React.useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = React.useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = React.useState(false);

  const tabs = [
    { id: "all", title: "Маркетрум", desc: "Цифровая витрина товаров и готовых образов." },
    { id: "outlet", title: "Аутлет", desc: "Специальные предложения: товары прошлых коллекций с эксклюзивными скидками" },
    ...(viewRole === 'b2b' ? [{ id: "kickstarter", title: "ЛАБОРАТОРИЯ", desc: "Лимитированные серии и предпроизводство" }] : []),
  ];

  return (
    <div className="flex flex-col gap-3 mb-10 relative">
      {/* Feature Overlays */}
      <AnimatePresence>
        {isConstellationOpen && (
          <VisualConstellation onClose={() => setIsConstellationOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRunwayOpen && (
          <DigitalTwinRunway onClose={() => setIsRunwayOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMatrixOpen && (
          <WholesaleOrderMatrix 
            collectionId="current" 
            onClose={() => setIsMatrixOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCollectionsOpen && (
          <div className="fixed inset-0 z-[120] bg-white overflow-y-auto">
            <WholesaleCollectionExplorer />
            <Button 
              onClick={() => setIsCollectionsOpen(false)}
              className="fixed top-4 right-8 z-[130] h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-2xl"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPlannerOpen && (
          <VisualAssortmentPlanner onClose={() => setIsPlannerOpen(false)} />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start">
        {/* Title & Badge Block */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center transition-all">
              {showroomTab === 'outlet' ? <Tag className="h-4 w-4 text-white" /> :
               <LayoutGrid className="h-4 w-4 text-white" />}
            </div>
            <Badge
              variant="outline"
              className="text-[11px] border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5"
            >
              {showroomTab === 'kickstarter' ? (viewRole === 'b2b' ? "LABORATORY_B2B" : "LABORATORY_B2C") : 
               showroomTab === 'outlet' ? (viewRole === 'b2b' ? "OUTLET_b2b" : "OUTLET_b2c") :
               (viewRole === 'b2b' ? "SHOWCASE_b2b" : "SHOWCASE_b2c")}
            </Badge>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
            {tabs.find(t => t.id === showroomTab)?.title}
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-none whitespace-nowrap">
            {tabs.find(t => t.id === showroomTab)?.desc}
          </p>
        </div>

        {/* Feature & Scroll Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-6 border-r border-slate-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all group"
                    onClick={() => {
                      setIsConstellationOpen(true);
                      if (viewRole === 'b2b') {
                        addB2bActivityLog({
                          type: 'view_product',
                          actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                          target: { id: 'constellation', name: 'Neural Style Map', type: 'product' },
                          details: 'Launched Visual Constellation Exploration.'
                        });
                      }
                      toast({
                        title: "AI Visual Constellation",
                        description: "Запуск нейронной карты стилей... Переход в 3D пространство.",
                      });
                    }}
                  >
                    <Orbit className="h-3 w-3 group-hover:rotate-90 transition-transform duration-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-black uppercase tracking-widest">
                  Neural_Style_Map
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all group"
                    onClick={() => {
                      setIsRunwayOpen(true);
                      if (viewRole === 'b2b') {
                        addB2bActivityLog({
                          type: 'view_product',
                          actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                          target: { id: 'runway', name: 'Digital Twin Runway', type: 'product' },
                          details: 'Activated Virtual Runway simulation.'
                        });
                      }
                      toast({
                        title: "Digital Twin Runway",
                        description: "Активация вашего цифрового двойника. Подиум готов.",
                      });
                    }}
                  >
                    <Scan className="h-3 w-3 group-hover:scale-110 transition-transform" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-black uppercase tracking-widest">
                  Virtual_Runway
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all group"
                    onClick={() => setIsCollectionsOpen(true)}
                  >
                    <Package className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-black uppercase tracking-widest">
                  Collections_Registry
                </TooltipContent>
              </Tooltip>

              {viewRole === 'b2b' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all group relative"
                      onClick={() => setIsPlannerOpen(true)}
                    >
                      <Layers className="h-3 w-3 group-hover:scale-110 transition-transform" />
                      {assortmentPlan.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center shadow-lg animate-pulse-subtle">
                          {assortmentPlan.length}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 text-white border-none text-[10px] font-black uppercase tracking-widest">
                    Assortment_Planner
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="text-slate-400 hover:text-slate-900 transition-colors p-1"
              onClick={() =>
                document
                  .getElementById("showroom-scroll")
                  ?.scrollBy({ left: -400, behavior: "smooth" })
              }
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              className="text-slate-400 hover:text-slate-900 transition-colors p-1"
              onClick={() =>
                document
                  .getElementById("showroom-scroll")
                  ?.scrollBy({ left: 400, behavior: "smooth" })
              }
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row - Similar to Ecosystem style, aligned Left */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setShowroomTab(tab.id as any);
                if (tab.id === "all") setShowroomViewMode("products");
                if (tab.id === "outlet") setShowroomViewMode("products");
                if (tab.id === "kickstarter") setShowroomViewMode("products");
              }}
              className={cn(
                "btn-tab min-w-[140px]",
                showroomTab === tab.id ? "btn-tab-active" : "btn-tab-inactive"
              )}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Sub-navigation (Small buttons under the section info) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 w-fit">
          <button
            onClick={() => setShowroomViewMode("products")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-normal transition-all flex items-center gap-2 border shadow-sm",
              showroomViewMode === "products" ? "bg-white text-slate-900 border-slate-200" : "bg-white/50 text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <LayoutGrid className="h-3 w-3" />
            Витрина
          </button>
          <button
            onClick={() => setShowroomViewMode("looks")}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-normal transition-all flex items-center gap-2 border shadow-sm",
              showroomViewMode === "looks" ? "bg-white text-slate-900 border-slate-200" : "bg-white/50 text-slate-400 border-transparent hover:text-slate-600"
            )}
          >
            <Sparkles className="h-3 w-3" />
            Образы
          </button>

          {showroomTab === 'outlet' && (
            <div className="px-5 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-l border-slate-200 ml-2">
              Архивные коллекции
            </div>
          )}
          {showroomTab === 'kickstarter' && (
            <div className="px-5 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 border-l border-slate-200 ml-2">
              Проекты лаборатории
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
