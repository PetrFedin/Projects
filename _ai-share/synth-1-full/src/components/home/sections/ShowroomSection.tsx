"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShowroomNavigation } from "@/components/showroom/ShowroomNavigation";
import { ShowroomGrid } from "@/components/showroom/ShowroomGrid";
import { useUIState } from "@/providers/ui-state";
import { useB2BState } from "@/providers/b2b-state";

interface ShowroomSectionProps {
  viewRole: string;
  showroomTab: string;
  setShowroomTab: (tab: string) => void;
  showroomViewMode: "products" | "looks" | "collections" | "my_orders";
  setShowroomViewMode: (mode: "products" | "looks" | "collections" | "my_orders") => void;
  toast: any;
  carousels: any[];
  filteredShowroomProducts: any[];
  totalLookCards: any[];
  isLinesheetMode: boolean;
  selectedLinesheetItems: string[];
  setSelectedLinesheetItems: (items: string[]) => void;
  setSelectedLook: (look: any) => void;
  setIsLookDetailsOpen: (open: boolean) => void;
  router: any;
  currency: "RUB" | "USD" | "EUR";
}

export function ShowroomSection({
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
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="section-spacing bg-transparent relative"
    >
      <div className="container mx-auto px-4 relative">
        <Card className="bg-white border-none rounded-xl shadow-2xl shadow-slate-200/50 relative transition-all group min-h-[400px] flex flex-col justify-center border border-slate-100">
          <CardContent className="p-4 relative z-10">
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
                    details: `Switched showroom tab to ${tab}.`
                  });
                }
              }}
              showroomViewMode={showroomViewMode}
              setShowroomViewMode={setShowroomViewMode}
              toast={toast}
              carousels={carousels}
            />

            <div className="relative group/showroom -mx-4 px-4">
              <div
                id="showroom-scroll"
                className="flex overflow-x-auto pb-6 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth min-h-[400px] overflow-y-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${showroomTab}-${showroomViewMode}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
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
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Showroom Banner Section */}
            <Card className="mt-6 bg-slate-900 border-none rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-2xl group/banner w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={showroomTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                      <img
                        src={
                          showroomTab === "all"
                            ? "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000"
                            : showroomTab === "outlet"
                            ? "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2000"
                            : showroomTab === "kickstarter"
                            ? "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000"
                            : showroomTab === "new_collections"
                            ? "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000"
                            : "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2000"
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                <CardContent className="relative z-10 p-4 space-y-4 max-w-4xl text-white w-full">
                  <div className="overflow-hidden whitespace-nowrap mb-4 py-2 border-y border-white/10 relative group/marquee">
                    <motion.div 
                      animate={{ x: ["0%", "-50%"] }} 
                      transition={{ duration: 120, repeat: Infinity, ease: "linear" }} 
                      className="flex items-center gap-3 w-fit"
                    >
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 shrink-0">
                          {showroomTab === "outlet" ? (
                            <>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Специальные цены</span>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Редкие модели</span>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Доступ к архивам</span>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Последний размер</span>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Дизайнерский сток</span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Новинки</span>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Хиты продаж</span>
                              <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Премиальное качество</span>
                            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Эксклюзивные коллекции</span>
                            </>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showroomTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight leading-tight">
                        {showroomTab === "all" && "МАРКЕТРУМ"}
                        {showroomTab === "outlet" && "АРХИВ"}
                        {showroomTab === "kickstarter" && "КРАУДФАНДИНГ"}
                        {showroomTab === "3d_fitting" && "ЦИФРОВАЯ ПРИМЕРКА"}
                      </h2>
                      <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">
                        {showroomTab === "all" &&
                          (viewRole === "b2b" 
                            ? '"Ваш надежный фундамент для стабильного развития"' 
                            : '"Ваш идеальный образ начинается здесь: лучшие коллекции в цифровом формате"')}
                        {showroomTab === "outlet" &&
                          '"Эксклюзивный доступ к коллекциям прошлых сезонов по специальным ценам"'}
                        {showroomTab === "kickstarter" &&
                          (viewRole === "b2b"
                            ? '"Умное производство и коллективный заказ"'
                            : '"Инвестируйте в уникальный стиль: поддержите запуск новинок по специальным ценам"')}
                        {showroomTab === "3d_fitting" &&
                          '"Интерактивная визуализация товаров"'}
                      </p>
                      {viewRole !== "b2b" && (
                        <div className="pt-4 flex">
                          <Button
                            asChild
                            variant="cta"
                            size="ctaLg"
                            className="min-w-[200px] w-fit"
                          >
                            <Link
                              href={
                                showroomTab === "all"
                                  ? "/search"
                                  : showroomTab === "outlet"
                                  ? "#showroom-scroll"
                                  : showroomTab === "kickstarter"
                                  ? "/kickstarter"
                                  : "/3d-viewer"
                              }
                              className="flex items-center gap-2"
                            >
                              {showroomTab === "all" && "Смотреть все"}
                              {showroomTab === "outlet" && "Смотреть все"}
                              {showroomTab === "kickstarter" &&
                                "Поддержать запуск"}
                              {showroomTab === "3d_fitting" && "Начать экспертизу"}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            <div className="absolute bottom-8 right-10 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-default z-20">
              <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                MARKETROOM_ENGINE_v4.2
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
