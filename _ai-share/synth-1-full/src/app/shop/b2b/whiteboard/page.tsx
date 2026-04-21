'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { products } from '@/lib/products';
import Image from 'next/image';
import {
  LayoutGrid,
  Layers,
  Filter,
  Plus,
  Save,
  Share2,
  MousePointer2,
  GripHorizontal,
  Calendar,
  Info,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ShopB2bToolHeader, ShopB2bToolTitle } from '@/components/shop/ShopB2bToolHeader';
import { ROUTES } from '@/lib/routes';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { B2bOrderUrlContextBanner } from '@/components/b2b/B2bOrderUrlContextBanner';

export default function WhiteboardPage() {
  const [activeTab, setActiveTab] = useState('canvas');
  const whiteboardProducts = products.slice(0, 12);

  return (
    <CabinetPageContent maxWidth="full" className="!mx-0 flex h-[calc(100vh-64px)] flex-col overflow-hidden !rounded-none bg-[#F8F9FB] !p-0">
      <B2bOrderUrlContextBanner
        variant="shop"
        className={cn('shrink-0 rounded-none border-x-0 border-t-0', cabinetSurface.hubMainContentPaddingX)}
      />
      <ShopB2bToolHeader
        backHref={ROUTES.shop.home}
        className={cn('z-20 bg-white', cabinetSurface.hubMainContentPaddingX)}
        leading={
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-accent-primary shrink-0 rounded-xl p-2.5">
              <LayoutGrid className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <ShopB2bToolTitle visual="md" className="text-base tracking-tighter">
                Advanced Assortment Whiteboard
              </ShopB2bToolTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-accent-primary/20 bg-accent-primary/10 text-accent-primary text-[10px] font-bold"
                >
                  Season: FW24
                </Badge>
                <span className="text-text-muted text-[10px] font-medium">
                  Last saved: 2 mins ago
                </span>
              </div>
            </div>
          </div>
        }
        trailing={
          <>
            <div className="mr-4 flex items-center -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-border-subtle flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white"
                >
                  <Image
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    alt="user"
                    width={32}
                    height={32}
                  />
                </div>
              ))}
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold">
                +5
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-border-default rounded-xl">
              <Share2 className="mr-2 h-4 w-4" /> Поделиться
            </Button>
            <Button size="sm" className="bg-accent-primary hover:bg-accent-primary rounded-xl">
              <Save className="mr-2 h-4 w-4" /> Сохранить план
            </Button>
          </>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <aside className="z-10 flex w-12 flex-col items-center gap-3 border-r bg-white py-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-accent-primary/10 text-accent-primary h-10 w-10 rounded-xl"
                >
                  <MousePointer2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Выбор</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-muted hover:text-accent-primary h-10 w-10 rounded-xl"
                >
                  <Layers className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Слои</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-muted hover:text-accent-primary h-10 w-10 rounded-xl"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">График поставок</TooltipContent>
            </Tooltip>

            <div className="bg-bg-surface2 my-2 h-px w-8" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-text-muted hover:text-accent-primary h-10 w-10 rounded-xl"
                >
                  <Sparkles className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">AI Рекомендации</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </aside>

        {/* Main Canvas */}
        <main className="relative flex-1 overflow-hidden p-4">
          {/* Background Grid */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative z-10 grid h-full grid-cols-4 gap-3">
            {/* Drop 1 Section */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <Calendar className="h-3 w-3" /> Drop 1: August Arrival
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-accent-primary/10 text-accent-primary border-none text-[8px] uppercase"
                >
                  45 SKUs • 1200 Units
                </Badge>
              </div>
              <div className="border-border-default grid min-h-[400px] grid-cols-3 gap-3 rounded-3xl border-2 border-dashed bg-white/50 p-4">
                {whiteboardProducts.slice(0, 6).map((product, idx) => (
                  <Card
                    key={idx}
                    className="group relative cursor-grab overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl active:cursor-grabbing"
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-7 w-7 rounded-lg bg-white/90 backdrop-blur"
                          >
                            <Info className="text-text-secondary h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="border-border-subtle border-t bg-white p-2.5">
                        <p className="truncate text-[10px] font-black uppercase tracking-tighter">
                          {product.name}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-accent-primary text-[9px] font-bold">
                            {product.price} ₽
                          </span>
                          <Badge
                            variant="outline"
                            className="border-border-subtle h-3.5 py-0 text-[7px]"
                          >
                            Top 5%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Drop 2 Section */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-text-muted flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <Calendar className="h-3 w-3" /> Drop 2: September Arrival
                </h3>
                <Badge
                  variant="secondary"
                  className="border-none bg-emerald-50 text-[8px] uppercase text-emerald-600"
                >
                  32 SKUs • 850 Units
                </Badge>
              </div>
              <div className="border-border-default grid min-h-[400px] grid-cols-3 gap-3 rounded-3xl border-2 border-dashed bg-white/50 p-4">
                {whiteboardProducts.slice(6, 9).map((product, idx) => (
                  <Card
                    key={idx}
                    className="group relative cursor-grab overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl active:cursor-grabbing"
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="bg-white p-2.5">
                        <p className="truncate text-[10px] font-black uppercase tracking-tighter">
                          {product.name}
                        </p>
                        <p className="text-accent-primary mt-1 text-[9px] font-bold">
                          {product.price} ₽
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="ghost"
                  className="border-border-subtle text-text-muted hover:text-accent-primary flex h-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all hover:bg-white/80"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Добавить товар
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Product Library */}
        <aside className="z-10 flex w-80 flex-col border-l bg-white shadow-[-4px_0_12px_rgba(0,0,0,0.02)]">
          <div className="border-b p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-tighter">Библиотека SKU</h3>
              <Button variant="ghost" size="icon" className="text-text-muted h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по артикулу..."
                className="border-border-default focus:ring-accent-primary h-10 w-full rounded-xl px-4 text-sm outline-none transition-all focus:ring-2"
              />
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-3">
              {products.map((product, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="border-border-subtle group-hover:ring-accent-primary relative aspect-[3/4] overflow-hidden rounded-xl border transition-all group-hover:ring-2">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                      <Plus className="h-6 w-6 scale-50 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
                    </div>
                  </div>
                  <p className="text-text-secondary mt-1.5 truncate text-[9px] font-bold uppercase">
                    {product.name}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="bg-bg-surface2/80 border-t p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-[10px] font-black uppercase">
                  Итого в плане:
                </span>
                <span className="text-sm font-black">77 SKUs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-[10px] font-black uppercase">Бюджет:</span>
                <span className="text-accent-primary text-sm font-black">4 850 000 ₽</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </CabinetPageContent>
  );
}
