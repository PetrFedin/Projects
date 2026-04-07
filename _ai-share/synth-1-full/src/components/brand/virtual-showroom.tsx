'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Maximize2, Move, Layers, ShoppingBag, 
  RotateCcw, Info, CheckCircle2, Zap, Layout,
  MousePointer2, Eye, LayoutGrid, Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_COLLECTION = [
  { id: 'p1', name: 'Urban Tech Parka', price: '45,000 ₽', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', pos: { x: 20, y: 30 } },
  { id: 'p2', name: 'Cyber Wool Coat', price: '68,000 ₽', image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600', pos: { x: 50, y: 25 } },
  { id: 'p3', name: 'Graphite Trousers', price: '22,000 ₽', image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=600', pos: { x: 35, y: 55 } },
];

export function VirtualShowroom() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-slate-50">
      <CardHeader className="p-3 pb-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Box className="h-4 w-4 text-white" />
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Visual Merchandising Engine</span>
          </div>
          <CardTitle className="text-base font-black uppercase tracking-tighter text-slate-900">3D Virtual Showroom</CardTitle>
          <CardDescription className="text-sm font-medium">Визуализация коллекции в пространстве. Смена развески и заказ в один клик.</CardDescription>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-[9px] font-black uppercase tracking-widest">
              <Camera className="h-3.5 w-3.5 mr-2" /> Снимок развески
           </Button>
           <Button className="h-10 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest px-6">
              <LayoutGrid className="h-3.5 w-3.5 mr-2" /> 2D Сетка
           </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
           {/* 3D Canvas Mockup */}
           <div className="lg:col-span-8 relative aspect-video bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner group cursor-move">
              {/* Floor/Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(200px)_scale(2)]" />
              
              {/* Floating Rails and Items */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <AnimatePresence>
                   {MOCK_COLLECTION.map((item, i) => (
                     <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ 
                          opacity: 1, 
                          scale: activeItem === item.id ? 1.1 : 1, 
                          y: isRotating ? [0, -10, 0] : 0,
                          x: (i - 1) * 200, // Horizontal spread
                          z: activeItem === item.id ? 50 : 0
                        }}
                        transition={{ 
                          y: { repeat: Infinity, duration: 4, delay: i * 0.5 },
                          scale: { duration: 0.3 }
                        }}
                        onClick={() => setActiveItem(item.id)}
                        className={cn(
                          "absolute h-96 w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white cursor-pointer transition-all",
                          activeItem === item.id ? "ring-4 ring-indigo-600 ring-offset-8 z-50" : "z-10 opacity-80"
                        )}
                     >
                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                           <p className="text-[10px] font-black uppercase tracking-tighter">{item.name}</p>
                           <p className="text-[9px] font-bold text-white/60">{item.price}</p>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-8 left-8 flex gap-2">
                 <button 
                  onClick={() => setIsRotating(!isRotating)}
                  className={cn("h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all", isRotating ? "bg-indigo-600 text-white" : "bg-white text-slate-400")}
                 >
                    <RotateCcw className={cn("h-4 w-4", isRotating && "animate-spin-slow")} />
                 </button>
                 <button className="h-10 w-10 rounded-full bg-white text-slate-400 flex items-center justify-center shadow-lg hover:text-slate-900 transition-colors">
                    <Maximize2 className="h-4 w-4" />
                 </button>
              </div>

              {/* Viewport helper */}
              <div className="absolute top-4 right-8 flex flex-col items-end gap-2">
                 <Badge className="bg-black/50 backdrop-blur-md text-white border-none font-black text-[8px] uppercase">Engine: Syntha-Ray</Badge>
                 <Badge className="bg-indigo-600 text-white border-none font-black text-[8px] uppercase px-2">FPS: 60</Badge>
              </div>
           </div>

           {/* Details & Ordering Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div 
                    key={activeItem}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Выбранная модель</p>
                        <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">{MOCK_COLLECTION.find(i => i.id === activeItem)?.name}</h4>
                        <p className="text-sm font-black text-slate-400 tabular-nums">{MOCK_COLLECTION.find(i => i.id === activeItem)?.price}</p>
                     </div>

                     <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3">
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Характеристики ткани</p>
                           <div className="grid grid-cols-2 gap-2">
                              <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase py-1">Tech Nylon</Badge>
                              <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase py-1">Waterproof</Badge>
                              <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase py-1">Recycled</Badge>
                              <Badge variant="outline" className="border-slate-100 text-[8px] font-black uppercase py-1">Windstop</Badge>
                           </div>
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3">
                           <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Zap className="h-5 w-5" />
                           </div>
                           <p className="text-[10px] text-indigo-800 font-bold leading-tight uppercase">
                              AI: Модель станет бестселлером в вашем регионе. Прогноз sell-out: 94%.
                           </p>
                        </div>
                     </div>

                     <div className="space-y-3 pt-4">
                        <Button className="w-full h-10 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                           <ShoppingBag className="h-4 w-4" /> Добавить в предзаказ
                        </Button>
                        <Button variant="ghost" className="w-full h-12 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">
                           <Info className="h-4 w-4 mr-2" /> Техническая спецификация
                        </Button>
                     </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 border-2 border-dashed border-slate-200 rounded-xl">
                     <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <MousePointer2 className="h-8 w-8" />
                     </div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Выберите модель в шоуруме для просмотра деталей и заказа</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Multi-view controls */}
              <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Пресеты развески</p>
                 <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase text-white/60 hover:bg-white/20 hover:text-white transition-all">По цвету</button>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase text-white/60 hover:bg-white/20 hover:text-white transition-all">По категориям</button>
                    <button className="px-4 py-2 bg-indigo-600 rounded-xl text-[9px] font-black uppercase text-white">Best-Sellers First</button>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase text-white/60 hover:bg-white/20 hover:text-white transition-all">Новинки</button>
                 </div>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
