'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  Move,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Plus,
  Info,
  ChevronRight,
  Smartphone,
  Tv,
  Layers,
  Maximize2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, Reorder } from 'framer-motion';

const MOCK_COLLECTION = [
  {
    id: '1',
    name: 'Cyber Parka',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300',
    price: '18,000 ₽',
    category: 'Outerwear',
  },
  {
    id: '2',
    name: 'Cargo Pants',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    price: '9,500 ₽',
    category: 'Pants',
  },
  {
    id: '3',
    name: 'Overshirt',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=300',
    price: '12,000 ₽',
    category: 'Shirts',
  },
  {
    id: '4',
    name: 'Neural Tee',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300',
    price: '4,500 ₽',
    category: 'Tees',
  },
];

export function VisualMerchandiser() {
  const [items, setItems] = useState(MOCK_COLLECTION);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'showroom'>('showroom');

  return (
    <div className="space-y-4 pb-20">
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="rounded-2xl bg-indigo-600 p-2.5">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">
              Digital Rack Planner
            </h1>
          </div>
          <p className="font-medium italic text-slate-500">
            Визуальный мерчандайзинг коллекции: спланируйте «идеальную развеску» для байеров.
          </p>
        </div>
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1">
=======
            <div className="bg-accent-primary rounded-2xl p-2.5">
              <LayoutGrid className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-text-primary text-base font-black uppercase tracking-tighter">
              Digital Rack Planner
            </h1>
          </div>
          <p className="text-text-secondary font-medium italic">
            Визуальный мерчандайзинг коллекции: спланируйте «идеальную развеску» для байеров.
          </p>
        </div>
        <div className="bg-bg-surface2 border-border-default flex gap-2 rounded-2xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
          <Button
            variant={previewMode === 'showroom' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('showroom')}
            className="rounded-xl text-[10px] font-black uppercase"
          >
            <Tv className="mr-2 h-3.5 w-3.5" /> Showroom
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="rounded-xl text-[10px] font-black uppercase"
          >
            <Smartphone className="mr-2 h-3.5 w-3.5" /> Mobile
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        {/* Rack Preview Area */}
        <div className="space-y-6 lg:col-span-3">
          <div
            className={cn(
<<<<<<< HEAD
              'rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-3 transition-all duration-500',
=======
              'bg-bg-surface2 border-border-default rounded-xl border-2 border-dashed p-3 transition-all duration-500',
>>>>>>> recover/cabinet-wip-from-stash
              previewMode === 'mobile' ? 'mx-auto max-w-[400px]' : 'w-full'
            )}
          >
            <div className="mb-8 flex items-center justify-between">
<<<<<<< HEAD
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
=======
              <h3 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Layout: Best Sellers Sequence
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-8 w-8 text-slate-400 hover:text-indigo-600"
=======
                  className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
<<<<<<< HEAD
                  className="h-8 w-8 text-slate-400 hover:text-indigo-600"
=======
                  className="text-text-muted hover:text-accent-primary h-8 w-8"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Reorder.Group
              axis="x"
              values={items}
              onReorder={setItems}
              className="flex flex-wrap justify-center gap-3"
            >
              {items.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="group w-[200px] cursor-grab active:cursor-grabbing"
                >
<<<<<<< HEAD
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all group-hover:border-indigo-200 group-hover:shadow-xl">
=======
                  <div className="border-border-subtle group-hover:border-accent-primary/30 overflow-hidden rounded-xl border bg-white shadow-sm transition-all group-hover:shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
<<<<<<< HEAD
                      <div className="absolute inset-0 bg-indigo-600/0 transition-colors group-hover:bg-indigo-600/10" />
                      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-lg">
                          <Move className="h-4 w-4 text-slate-400" />
=======
                      <div className="bg-accent-primary/0 group-hover:bg-accent-primary/10 absolute inset-0 transition-colors" />
                      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-lg">
                          <Move className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 p-4">
<<<<<<< HEAD
                      <p className="truncate text-[10px] font-black uppercase text-slate-900">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase text-slate-400">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-black text-indigo-600">{item.price}</span>
=======
                      <p className="text-text-primary truncate text-[10px] font-black uppercase">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted text-[9px] font-bold uppercase">
                          {item.category}
                        </span>
                        <span className="text-accent-primary text-[10px] font-black">
                          {item.price}
                        </span>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>

        {/* Strategy Sidebar */}
        <aside className="space-y-6">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-sm">
<<<<<<< HEAD
            <CardHeader className="border-b border-slate-100 bg-slate-50 p-4">
              <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-indigo-600" /> AI Merchandiser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-[10px] font-medium italic leading-relaxed text-indigo-900">
                «На основе данных прошлых сезонов в магазине ЦУМ, рекомендую поставить Cyber Parka
                первой в развеске для увеличения конверсии на 12.4%».
              </div>
              <Button className="h-12 w-full rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700">
=======
            <CardHeader className="bg-bg-surface2 border-border-subtle border-b p-4">
              <CardTitle className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                <Sparkles className="text-accent-primary h-4 w-4" /> AI Merchandiser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4">
              <div className="bg-accent-primary/10 border-accent-primary/20 text-accent-primary rounded-2xl border p-4 text-[10px] font-medium italic leading-relaxed">
                «На основе данных прошлых сезонов в магазине ЦУМ, рекомендую поставить Cyber Parka
                первой в развеске для увеличения конверсии на 12.4%».
              </div>
              <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                Применить AI-Layout
              </Button>
            </CardContent>
          </Card>

<<<<<<< HEAD
          <Card className="rounded-xl border-none bg-slate-900 p-4 text-white shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-indigo-400" />
=======
          <Card className="bg-text-primary rounded-xl border-none p-4 text-white shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                <h3 className="text-sm font-black uppercase tracking-tight">
                  Buy Limit Enforcement
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                    <span>MOQ Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
<<<<<<< HEAD
                    <div className="h-full w-[75%] bg-indigo-500" />
=======
                    <div className="bg-accent-primary h-full w-[75%]" />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Info className="h-4 w-4 text-amber-400" />
<<<<<<< HEAD
                  <p className="text-[9px] font-bold uppercase leading-tight text-slate-300">
=======
                  <p className="text-text-muted text-[9px] font-bold uppercase leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
                    Для активации этого набора байеру не хватает 250,000 ₽ до минимального порога.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
