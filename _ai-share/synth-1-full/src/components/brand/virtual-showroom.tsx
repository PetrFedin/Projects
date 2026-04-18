'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Maximize2,
  Move,
  Layers,
  ShoppingBag,
  RotateCcw,
  Info,
  CheckCircle2,
  Zap,
  Layout,
  MousePointer2,
  Eye,
  LayoutGrid,
  Camera,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_COLLECTION = [
  {
    id: 'p1',
    name: 'Urban Tech Parka',
    price: '45,000 ₽',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
    pos: { x: 20, y: 30 },
  },
  {
    id: 'p2',
    name: 'Cyber Wool Coat',
    price: '68,000 ₽',
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600',
    pos: { x: 50, y: 25 },
  },
  {
    id: 'p3',
    name: 'Graphite Trousers',
    price: '22,000 ₽',
    image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=600',
    pos: { x: 35, y: 55 },
  },
];

export function VirtualShowroom() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-slate-50 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-4">
        <div className="space-y-1">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600">
              <Box className="h-4 w-4 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Visual Merchandising Engine
            </span>
          </div>
          <CardTitle className="text-base font-black uppercase tracking-tighter text-slate-900">
            3D Virtual Showroom
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            Визуализация коллекции в пространстве. Смена развески и заказ в один клик.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-[9px] font-black uppercase tracking-widest"
          >
            <Camera className="mr-2 h-3.5 w-3.5" /> Снимок развески
          </Button>
          <Button className="h-10 rounded-xl bg-black px-6 text-[9px] font-black uppercase tracking-widest text-white">
            <LayoutGrid className="mr-2 h-3.5 w-3.5" /> 2D Сетка
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* 3D Canvas Mockup */}
          <div className="group relative aspect-video cursor-move overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner lg:col-span-8">
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
                      z: activeItem === item.id ? 50 : 0,
                    }}
                    transition={{
                      y: { repeat: Infinity, duration: 4, delay: i * 0.5 },
                      scale: { duration: 0.3 },
                    }}
                    onClick={() => setActiveItem(item.id)}
                    className={cn(
                      'absolute h-96 w-64 cursor-pointer overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-all',
                      activeItem === item.id
                        ? 'z-50 ring-4 ring-indigo-600 ring-offset-8'
                        : 'z-10 opacity-80'
                    )}
                  >
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <p className="text-[10px] font-black uppercase tracking-tighter">
                        {item.name}
                      </p>
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
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all',
                  isRotating ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'
                )}
              >
                <RotateCcw className={cn('h-4 w-4', isRotating && 'animate-spin-slow')} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-lg transition-colors hover:text-slate-900">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>

            {/* Viewport helper */}
            <div className="absolute right-8 top-4 flex flex-col items-end gap-2">
              <Badge className="border-none bg-black/50 text-[8px] font-black uppercase text-white backdrop-blur-md">
                Engine: Syntha-Ray
              </Badge>
              <Badge className="border-none bg-indigo-600 px-2 text-[8px] font-black uppercase text-white">
                FPS: 60
              </Badge>
            </div>
          </div>

          {/* Details & Ordering Sidebar */}
          <div className="space-y-6 lg:col-span-4">
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                      Выбранная модель
                    </p>
                    <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">
                      {MOCK_COLLECTION.find((i) => i.id === activeItem)?.name}
                    </h4>
                    <p className="text-sm font-black tabular-nums text-slate-400">
                      {MOCK_COLLECTION.find((i) => i.id === activeItem)?.price}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Характеристики ткани
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge
                          variant="outline"
                          className="border-slate-100 py-1 text-[8px] font-black uppercase"
                        >
                          Tech Nylon
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-100 py-1 text-[8px] font-black uppercase"
                        >
                          Waterproof
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-100 py-1 text-[8px] font-black uppercase"
                        >
                          Recycled
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-100 py-1 text-[8px] font-black uppercase"
                        >
                          Windstop
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <Zap className="h-5 w-5" />
                      </div>
                      <p className="text-[10px] font-bold uppercase leading-tight text-indigo-800">
                        AI: Модель станет бестселлером в вашем регионе. Прогноз sell-out: 94%.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button className="flex h-10 w-full items-center gap-2 rounded-2xl bg-black text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-105">
                      <ShoppingBag className="h-4 w-4" /> Добавить в предзаказ
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-12 w-full rounded-2xl text-[9px] font-black uppercase text-slate-400 transition-colors hover:text-slate-900"
                    >
                      <Info className="mr-2 h-4 w-4" /> Техническая спецификация
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-slate-200 p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <MousePointer2 className="h-8 w-8" />
                  </div>
                  <p className="text-xs font-bold uppercase leading-relaxed tracking-widest text-slate-400">
                    Выберите модель в шоуруме для просмотра деталей и заказа
                  </p>
                </div>
              )}
            </AnimatePresence>

            {/* Multi-view controls */}
            <div className="space-y-4 rounded-xl bg-slate-900 p-4 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Пресеты развески
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-xl bg-white/10 px-4 py-2 text-[9px] font-black uppercase text-white/60 transition-all hover:bg-white/20 hover:text-white">
                  По цвету
                </button>
                <button className="rounded-xl bg-white/10 px-4 py-2 text-[9px] font-black uppercase text-white/60 transition-all hover:bg-white/20 hover:text-white">
                  По категориям
                </button>
                <button className="rounded-xl bg-indigo-600 px-4 py-2 text-[9px] font-black uppercase text-white">
                  Best-Sellers First
                </button>
                <button className="rounded-xl bg-white/10 px-4 py-2 text-[9px] font-black uppercase text-white/60 transition-all hover:bg-white/20 hover:text-white">
                  Новинки
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
