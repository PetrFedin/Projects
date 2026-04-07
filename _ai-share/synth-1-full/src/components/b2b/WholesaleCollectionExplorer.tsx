'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ChevronRight, 
  Download, 
  Video, 
  Image as   ImageIcon, 
  Box, 
  Calendar, 
  Percent, 
  ShieldCheck,
  Plus,
  ArrowRight,
  Filter,
  Search,
  ShoppingCart,
  Maximize2,
  Lock,
  Eye,
  FileCheck,
  Package,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { WholesaleCollection } from '@/lib/types/b2b';
import { WholesaleLookbook } from './WholesaleLookbook';
import { cn } from '@/lib/cn';

export function WholesaleCollectionExplorer() {
  const { viewRole } = useUIState();
  const { wholesaleCollections } = useB2BState();
  const [selectedCollection, setSelectedCollection] = useState<WholesaleCollection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDrop, setActiveDrop] = useState<string | null>(null);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'lookbook'>('grid');

  // Use collections from context (already filtered by brand)
  const collections = useMemo(() => {
    return wholesaleCollections;
  }, [wholesaleCollections]);

  return (
    <div className="space-y-4 p-4 bg-white min-h-screen">
      <AnimatePresence mode="wait">
        {!selectedCollection ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
                    Wholesale_Registry_v4.0
                  </Badge>
                </div>
                <h2 className="text-sm md:text-base font-black uppercase tracking-tighter text-slate-900 leading-none">
                  Маркетплейс<br/>Коллекций
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Поиск коллекций..." 
                    className="pl-10 h-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
                {viewRole === 'brand' && (
                  <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
                    <Plus className="h-4 w-4" /> Новая коллекция
                  </Button>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {collections.map((coll) => (
                <Card 
                  key={coll.id}
                  onClick={() => setSelectedCollection(coll)}
                  className="group border-none shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={coll.lookbookUrls[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-6">
                      <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[9px] uppercase px-3 py-1">
                        {coll.season} {coll.year}
                      </Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-tight">{coll.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-6 bg-white">
                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">"{coll.description}"</p>
                    <div className="grid grid-cols-3 gap-3 border-y border-slate-50 py-4">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Кол-во SKU</p>
                        <p className="text-sm font-black text-slate-900">42</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Входная цена</p>
                        <p className="text-sm font-black text-slate-900">12.5K ₽</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Дропы</p>
                        <p className="text-sm font-black text-slate-900">{coll.drops.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} />
                          </div>
                        ))}
                        <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[7px] font-black text-white">+12</div>
                      </div>
                      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest gap-2 p-0 hover:bg-transparent">
                        Исследовать коллекцию <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col lg:flex-row gap-3"
          >
            {/* Sidebar: Navigation & Docs */}
            <div className="w-full lg:w-[350px] space-y-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCollection(null)}
                className="mb-4 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest p-0 flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" /> Назад к списку
              </Button>

              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden bg-slate-900 text-white">
                <div className="p-4 space-y-6">
                  <div className="space-y-2">
                    <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black uppercase px-2 py-0.5 tracking-widest">Документация</Badge>
                    <h3 className="text-base font-black uppercase tracking-tight">Технический Хаб</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedCollection.documents.map((doc, i) => (
                      <button 
                        key={i}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            doc.type === 'price' ? "bg-emerald-500/20 text-emerald-400" :
                            doc.type === 'tech' ? "bg-indigo-500/20 text-indigo-400" : "bg-amber-500/20 text-amber-400"
                          )}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">{doc.title}</span>
                        </div>
                        <Download className="h-3.5 w-3.5 text-white/20 group-hover:text-white transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl p-4 space-y-6 bg-white">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ценовые уровни</p>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Действующие условия</h4>
                </div>
                <div className="space-y-4">
                  {selectedCollection.pricingTiers.map((tier) => (
                    <div key={tier.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{tier.name}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Мин. заказ: {tier.moq.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Percent className="h-2.5 w-2.5" />
                        <span className="text-[10px] font-black">{tier.discountPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
                  Запросить индивидуальные условия
                </Button>
              </Card>
            </div>

            {/* Main Content: Showcase & Lookbook */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <Button 
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "h-10 px-6 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all",
                        viewMode === 'grid' ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Сетка товаров
                    </Button>
                    <Button 
                      onClick={() => setViewMode('lookbook')}
                      className={cn(
                        "h-10 px-6 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all",
                        viewMode === 'lookbook' ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
                      )}
                    >
                      Интерактивный лукбук
                    </Button>
                 </div>
              </div>

              {viewMode === 'lookbook' ? (
                <div className="h-[700px]">
                   <WholesaleLookbook onShopProduct={(id) => setIsMatrixOpen(true)} />
                </div>
              ) : (
                <>
                  <div className="relative h-[400px] rounded-xl overflow-hidden group/hero shadow-2xl">
                    <img src={selectedCollection.lookbookUrls[1]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-all duration-500 scale-95 group-hover/hero:scale-100">
                      <Button className="h-12 w-12 rounded-full bg-white text-slate-900 shadow-2xl p-0 flex items-center justify-center">
                        <Video className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-10 left-10 space-y-2">
                      <Badge className="bg-indigo-600 text-white border-none text-[9px] font-black px-3 py-1 uppercase tracking-widest">Презентация бренда</Badge>
                      <h1 className="text-sm font-black text-white uppercase tracking-tighter leading-none">{selectedCollection.title}</h1>
                    </div>
                  </div>

                  {/* Delivery Drops */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCollection.drops.map((drop) => (
                      <Card 
                        key={drop.id}
                        onClick={() => setActiveDrop(drop.id)}
                        className={cn(
                          "group border-none shadow-2xl shadow-slate-200/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-500",
                          activeDrop === drop.id ? "ring-2 ring-indigo-600 scale-[1.02]" : "hover:bg-slate-50"
                        )}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors",
                              activeDrop === drop.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600"
                            )}>
                              <Calendar className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Окно поставки</p>
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{drop.name.replace('Drop', 'Дроп')}</h4>
                              <p className="text-xs font-bold text-indigo-600 uppercase">{drop.deliveryDate.replace('July', 'Июль').replace('August', 'Август').replace('September', 'Сентябрь')}</p>
                            </div>
                          </div>
                          <ChevronRight className={cn(
                            "h-5 w-5 transition-all",
                            activeDrop === drop.id ? "text-indigo-600 translate-x-1" : "text-slate-200"
                          )} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Grid: Order Matrix Pre-view */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Каталог коллекции</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Всего 42 модели / Выберите товар для настройки размеров</p>
                      </div>
                      <Button 
                        className="bg-indigo-600 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-indigo-200"
                        onClick={() => setIsMatrixOpen(true)}
                      >
                        Открыть матрицу заказа <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="group flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-500">
                          <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-white shadow-sm">
                            <img src={`https://placehold.co/400x400/f8fafc/64748b?text=STYLE_${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute top-2 right-2">
                              <button className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur-md text-slate-400 flex items-center justify-center shadow-sm hover:text-indigo-600 transition-all">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2 px-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest leading-none">Cyber Parka</p>
                              <Badge variant="outline" className="text-[7px] font-bold border-slate-200 uppercase px-1.5 py-0">Tech_Spec_v2</Badge>
                            </div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">STYLE_SKU_00{i}</h4>
                            
                            {/* New Detail Specs */}
                            <div className="pt-2 space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                <Box className="h-2.5 w-2.5 text-slate-400" />
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Состав: 80% Нейлон, 20% Графен</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Серт: OEKO-TEX Standard 100</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Truck className="h-2.5 w-2.5 text-amber-500" />
                                <span className="text-[8px] font-bold text-slate-500 uppercase">Пр-во: 45-60 дней</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                              <span className="text-[10px] font-black text-slate-900">12,400 ₽</span>
                              <button className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg">
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMatrixOpen && (
        <WholesaleOrderMatrix 
          collectionId={selectedCollection?.id || ""} 
          onClose={() => setIsMatrixOpen(false)} 
        />
      )}
    </div>
  );
}
