'use client';

import Image from 'next/image';
import { LayoutGrid, Sparkles, Plus, ShoppingBag, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LookDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLook: any;
  viewRole: string;
  setShowroomViewMode: (
    mode: 'products' | 'looks' | 'collections' | 'my_orders' | 'planning'
  ) => void;
}

export function LookDetailsDialog({
  isOpen,
  onOpenChange,
  selectedLook,
  viewRole,
  setShowroomViewMode,
}: LookDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[1200px] max-w-[95vw] overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl">
        {selectedLook && (
          <div className="flex h-full flex-col overflow-hidden md:flex-row">
            <div className="bg-bg-surface2 group relative h-[400px] md:h-[800px] md:w-1/2">
              <div className="pointer-events-none absolute inset-0 z-20">
                {/* Hotspots Simulation */}
                <div className="pointer-events-auto absolute left-[45%] top-[30%]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="group/spot flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white">
                        <div className="group-hover/spot:bg-accent-primary h-2 w-2 animate-pulse rounded-full bg-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-text-primary z-[100] w-48 rounded-2xl border border-white/10 p-3 text-white shadow-2xl"
                    >
                      <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase">
                        Технологичный анорак
                      </p>
                      <p className="mb-2 text-[10px] font-medium leading-tight text-white/80">
                        Доступен в 4 цветах. MOQ: 12 шт.
                      </p>
                      <Button
                        variant="cta"
                        size="ctaSm"
                        className="bg-accent-primary hover:bg-accent-primary h-6 w-full rounded-lg text-[10px]"
                      >
                        В планировщик
                      </Button>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="pointer-events-auto absolute left-[55%] top-[65%]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="group/spot flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white">
                        <div className="group-hover/spot:bg-accent-primary h-2 w-2 animate-pulse rounded-full bg-white" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-text-primary z-[100] w-48 rounded-2xl border border-white/10 p-3 text-white shadow-2xl"
                    >
                      <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase">
                        Брюки-карго
                      </p>
                      <p className="mb-2 text-[10px] font-medium leading-tight text-white/80">
                        Ткань с водоотталкивающей пропиткой.
                      </p>
                      <Button
                        variant="cta"
                        size="ctaSm"
                        className="bg-accent-primary hover:bg-accent-primary h-6 w-full rounded-lg text-[10px]"
                      >
                        В планировщик
                      </Button>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Carousel className="h-full w-full">
                <CarouselContent className="h-full">
                  {(selectedLook.gallery || [selectedLook.imageUrl]).map(
                    (img: string, i: number) => (
                      <CarouselItem key={i} className="h-full">
                        <div className="relative aspect-[4/5] h-full min-h-[400px] w-full md:aspect-auto md:min-h-[800px]">
                          <Image
                            src={img}
                            alt={`Gallery ${i}`}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-4 border-none bg-white/20 text-white transition-all hover:bg-white hover:text-black" />
                <CarouselNext className="right-4 border-none bg-white/20 text-white transition-all hover:bg-white hover:text-black" />
              </Carousel>
              <div className="absolute left-6 top-4 z-10 flex flex-col gap-2">
                <Badge className="rounded-xl border-none bg-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-2xl">
                  {selectedLook.type.toUpperCase()} PREVIEW
                </Badge>
              </div>
            </div>
            <div className="relative flex h-full flex-col bg-white md:w-1/2">
              <div className="max-h-[90vh] space-y-10 overflow-y-auto p-4 md:p-4">
                <div className="border-border-subtle relative space-y-4 border-b pb-10">
                  <div className="space-y-1">
                    <p className="text-accent-primary mb-2 text-xs font-bold uppercase leading-none tracking-[0.3em]">
                      {selectedLook.author}
                    </p>
                    <DialogTitle className="text-text-primary text-sm font-bold uppercase leading-none tracking-tight md:text-sm">
                      {selectedLook.title}
                    </DialogTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-text-muted mb-1 text-[10px] font-bold uppercase tracking-wide">
                        BUNDLE_PRICE
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-text-primary text-sm font-bold leading-none tracking-tight">
                          {selectedLook.price.toLocaleString('ru-RU')}₽
                        </span>
                        <span className="text-text-muted text-sm font-bold tracking-tight line-through">
                          {selectedLook.originalPrice.toLocaleString('ru-RU')}₽
                        </span>
                      </div>
                    </div>
                    <Badge className="flex h-10 items-center justify-center rounded-2xl border-none bg-emerald-500 px-4 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                      -{Math.round((1 - selectedLook.price / selectedLook.originalPrice) * 100)}%
                      ВЫГОДА
                    </Badge>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-text-muted flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <LayoutGrid className="text-accent-primary h-4 w-4" /> СОСТАВ ОБРАЗА (
                      {selectedLook.items})
                    </h4>
                    <div className="text-accent-primary flex items-center gap-2">
                      <Sparkles className="fill-accent-primary h-3 w-3" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        +{selectedLook.bonus} BONUSES
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {(selectedLook.products || []).map((product: any) => (
                      <div
                        key={product.id}
                        className="group/item bg-bg-surface2 hover:bg-text-primary/90 flex items-center gap-3 rounded-3xl border border-transparent p-4 transition-all duration-500 hover:border-white/10"
                      >
                        <div className="relative h-20 w-12 shrink-0 overflow-hidden rounded-xl shadow-md">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-accent-primary group-hover/item:text-accent-primary mb-1 text-[10px] font-bold uppercase leading-none tracking-wide">
                            {product.brand}
                          </p>
                          <h5 className="text-text-primary truncate text-sm font-bold uppercase leading-tight tracking-tight group-hover/item:text-white">
                            {product.name}
                          </h5>
                          <div className="mt-2 flex gap-2">
                            <Badge
                              variant="outline"
                              className="border-border-default text-text-secondary bg-white text-[10px] font-bold uppercase group-hover/item:border-white/20 group-hover/item:bg-white/10 group-hover/item:text-white/60"
                            >
                              S, M, L, XL
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-border-default text-text-secondary bg-white text-[10px] font-bold uppercase group-hover/item:border-white/20 group-hover/item:bg-white/10 group-hover/item:text-white/60"
                            >
                              Black
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                          <p className="text-text-primary text-base font-bold leading-none tracking-tight group-hover/item:text-white">
                            {product.price.toLocaleString('ru-RU')}₽
                          </p>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-text-muted h-8 w-8 bg-white hover:bg-black hover:text-white group-hover/item:bg-white/20 group-hover/item:text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4 pt-6">
                  <div className="bg-accent-primary/10 border-accent-primary/20 flex flex-col items-center justify-between gap-3 rounded-3xl border p-4 md:flex-row">
                    <div className="space-y-1">
                      <p className="text-accent-primary text-[10px] font-bold uppercase tracking-wide">
                        {viewRole === 'b2b'
                          ? 'B2B Wholesale Terms Active'
                          : 'Global Rewards Active'}
                      </p>
                      <p className="text-accent-primary/60 text-xs font-medium">
                        {viewRole === 'b2b'
                          ? 'MOQ applied. Seasonal discounts included.'
                          : 'Бесплатная доставка + 2 года гарантии.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-accent-primary h-2 w-2 animate-pulse rounded-full" />
                      <span className="text-accent-primary text-[10px] font-bold uppercase tracking-wide">
                        SYNTHA_SECURE_PAY
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={() => {
                        if (viewRole === 'b2b') {
                          setShowroomViewMode('planning');
                          onOpenChange(false);
                          // In a real app, we would also pre-fill the planning grid here
                        }
                      }}
                      variant="cta"
                      size="ctaLg"
                      className="flex-1"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {viewRole === 'b2b'
                        ? 'ПЕРЕЙТИ К ЗАКУПКЕ ОБРАЗА'
                        : `КУПИТЬ ВЕСЬ ОБРАЗ (${selectedLook.price.toLocaleString('ru-RU')}₽)`}
                    </Button>
                    <Button
                      variant="outline"
                      className="hover:border-text-primary h-12 w-12 shrink-0 hover:bg-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
