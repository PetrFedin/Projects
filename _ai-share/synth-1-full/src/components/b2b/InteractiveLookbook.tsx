'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Eye, 
  Settings2, 
  Trash2, 
  MousePointer2, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Share2,
  Sparkles,
  Layers,
  ArrowRight,
  Cloud
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useB2BState } from '@/providers/b2b-state';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';
import allProductsData from '@/lib/products';

export function InteractiveLookbook() {
  const { b2bLookbooks, addB2bLookbook } = useB2BState();
  const { activeCurrency } = useUIState();
  const [selectedLookbook, setSelectedLookbook] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [isEditorMode, setIsEditorMode] = useState(false);

  const activePage = selectedLookbook?.pages[activePageIdx];

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditorMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // In a real app, show product picker
    console.log(`New hotspot at x: ${x}, y: ${y}`);
  };

  return (
    <div className="space-y-4 p-3 bg-slate-50 min-h-screen text-left">
      <AnimatePresence mode="wait">
        {!selectedLookbook ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
                    VISUAL_SELL_v3.0
                  </Badge>
                </div>
                <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
                  Интерактивные<br/>Лукбуки
                </h2>
                <p className="text-slate-400 font-medium text-xs max-w-md">
                  Превратите имиджевые кампании в торговый опыт. Отмечайте товары прямо на фото для мгновенного оформления оптовых заказов.
                </p>
              </div>

              <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
                <Plus className="h-4 w-4" /> Создать новый лукбук
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {b2bLookbooks.map((lb) => (
                <Card 
                  key={lb.id}
                  onClick={() => setSelectedLookbook(lb)}
                  className="group border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all bg-white"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img src={lb.coverUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-6">
                      <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none text-[8px] font-black uppercase px-3 py-1">{lb.season}</Badge>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 leading-none">{lb.title}</h4>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{lb.pages.length} Стр. • {lb.pages.reduce((acc, p) => acc + p.hotspots.length, 0)} Товаров</p>
                    </div>
                  </div>
                  <CardContent className="p-4 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase text-slate-400">{lb.status}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 group-hover:text-slate-900 group-hover:bg-slate-50 transition-all">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <Button 
                onClick={() => setSelectedLookbook(null)}
                variant="ghost" 
                className="text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Назад в библиотеку
              </Button>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setIsEditorMode(!isEditorMode)}
                  variant={isEditorMode ? "default" : "outline"}
                  className={cn(
                    "h-12 rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2",
                    isEditorMode ? "bg-indigo-600 text-white" : "bg-white"
                  )}
                >
                  <Settings2 className="h-4 w-4" /> {isEditorMode ? 'Сохранить макет' : 'Режим редактора'}
                </Button>
                <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2">
                  <Share2 className="h-4 w-4" /> Опубликовать ссылку
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
              <div className="lg:col-span-8 space-y-6">
                <Card className="border-none shadow-2xl rounded-xl overflow-hidden bg-white relative">
                  <div 
                    className={cn(
                      "relative aspect-[4/5] cursor-crosshair",
                      !isEditorMode && "cursor-default"
                    )}
                    onClick={handlePageClick}
                  >
                    <img src={activePage.imageUrl} className="w-full h-full object-cover" />
                    
                    {activePage.hotspots.map((h: any) => {
                      const product = allProductsData.find(p => p.id === h.productId);
                      return (
                        <div 
                          key={h.id}
                          className="absolute group"
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                        >
                          <div className="relative">
                            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl animate-pulse group-hover:animate-none group-hover:scale-125 transition-all cursor-pointer">
                              <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            </div>
                            
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-2xl p-4 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none z-20">
                              <div className="space-y-3">
                                <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden">
                                  <img src={product?.images?.[0]?.url} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase text-slate-900 leading-none">{product?.name}</p>
                                  <p className="text-[9px] font-bold text-indigo-600 uppercase">{product?.price.toLocaleString('ru-RU')} ₽</p>
                                </div>
                                <Button className="w-full h-8 rounded-lg bg-slate-900 text-white text-[8px] font-black uppercase">В корзину</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute inset-y-0 left-0 flex items-center px-4">
                    <Button 
                      onClick={() => setActivePageIdx(Math.max(0, activePageIdx - 1))}
                      disabled={activePageIdx === 0}
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4">
                    <Button 
                      onClick={() => setActivePageIdx(Math.min(selectedLookbook.pages.length - 1, activePageIdx + 1))}
                      disabled={activePageIdx === selectedLookbook.pages.length - 1}
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-slate-900 disabled:opacity-30"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-center gap-3 overflow-x-auto py-2">
                  {selectedLookbook.pages.map((p: any, i: number) => (
                    <button 
                      key={p.id}
                      onClick={() => setActivePageIdx(i)}
                      className={cn(
                        "h-20 w-12 rounded-xl overflow-hidden border-4 transition-all shrink-0",
                        activePageIdx === i ? "border-indigo-600 scale-110 shadow-lg" : "border-white shadow-sm opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={p.imageUrl} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {isEditorMode && (
                    <button className="h-20 w-12 rounded-xl border-4 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-900 hover:border-slate-400 transition-all shrink-0">
                      <Plus className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <Card className="border-none shadow-xl bg-white p-4 rounded-xl space-y-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Товары на странице</h4>
                  <div className="space-y-4">
                    {activePage.hotspots.length > 0 ? activePage.hotspots.map((h: any) => {
                      const product = allProductsData.find(p => p.id === h.productId);
                      return (
                        <div key={h.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                              <img src={product?.images?.[0]?.url} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-slate-900">{product?.name}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{product?.sku}</p>
                            </div>
                          </div>
                          {isEditorMode ? (
                            <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">В НАЛИЧИИ</Badge>
                          )}
                        </div>
                      );
                    }) : (
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic py-4">Нет отмеченных товаров на странице</p>
                    )}
                  </div>
                  {isEditorMode && (
                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-black uppercase text-[9px] tracking-widest gap-2">
                      <Tag className="h-4 w-4" /> Отметить новый товар
                    </Button>
                  )}
                </Card>

                <Card className="border-none shadow-xl bg-slate-900 text-white p-4 rounded-xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="h-24 w-24" /></div>
                  <div className="relative z-10 space-y-4">
                    <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400">AI Визуальный Помощник</h5>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                      Наш ИИ автоматически обнаружил **3 потенциальных товара** на этом фото. Нажмите для проверки и подтверждения тегов.
                    </p>
                    <Button className="w-full h-10 bg-white text-slate-900 rounded-xl font-black uppercase text-[9px] tracking-widest">Запустить ИИ-сканирование</Button>
                  </div>
                </Card>

                <Card className="border-none shadow-xl bg-indigo-50 p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <MousePointer2 className="h-4 w-4 text-indigo-600" />
                    <h5 className="text-[10px] font-black uppercase text-indigo-900 tracking-widest">Эффективность страницы</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-indigo-400 uppercase">Ср. время фокуса</p>
                      <p className="text-base font-black text-indigo-900">12.4с</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-indigo-400 uppercase">Кликабельность (CTR)</p>
                      <p className="text-base font-black text-indigo-900">18.2%</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
