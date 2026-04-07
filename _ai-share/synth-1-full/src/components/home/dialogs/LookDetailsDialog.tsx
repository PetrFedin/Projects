"use client";

import Image from "next/image";
import {
  LayoutGrid,
  Sparkles,
  Plus,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LookDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLook: any;
  viewRole: string;
  setShowroomViewMode: (mode: "products" | "looks" | "collections" | "my_orders") => void;
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
      <DialogContent className="max-w-[95vw] w-[1200px] max-h-[90vh] p-0 overflow-hidden bg-white border-none rounded-xl shadow-2xl">
        {selectedLook && (
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            <div className="md:w-1/2 bg-slate-50 relative group h-[400px] md:h-[800px]">
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Hotspots Simulation */}
                <div className="absolute top-[30%] left-[45%] pointer-events-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group/spot hover:bg-white hover:scale-110 transition-all shadow-xl">
                        <div className="h-2 w-2 rounded-full bg-white group-hover/spot:bg-indigo-600 animate-pulse" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-white/10 w-48 z-[100]"
                    >
                      <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">
                        Технологичный анорак
                      </p>
                      <p className="text-[10px] font-medium leading-tight mb-2 text-white/80">
                        Доступен в 4 цветах. MOQ: 12 шт.
                      </p>
                      <Button variant="cta" size="ctaSm" className="h-6 w-full bg-indigo-600 hover:bg-indigo-700 text-[10px] rounded-lg">
                        В планировщик
                      </Button>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="absolute top-[65%] left-[55%] pointer-events-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group/spot hover:bg-white hover:scale-110 transition-all shadow-xl">
                        <div className="h-2 w-2 rounded-full bg-white group-hover/spot:bg-indigo-600 animate-pulse" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-white/10 w-48 z-[100]"
                    >
                      <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">
                        Брюки-карго
                      </p>
                      <p className="text-[10px] font-medium leading-tight mb-2 text-white/80">
                        Ткань с водоотталкивающей пропиткой.
                      </p>
                      <Button variant="cta" size="ctaSm" className="h-6 w-full bg-indigo-600 hover:bg-indigo-700 text-[10px] rounded-lg">
                        В планировщик
                      </Button>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Carousel className="w-full h-full">
                <CarouselContent className="h-full">
                  {(selectedLook.gallery || [selectedLook.imageUrl]).map(
                    (img: string, i: number) => (
                      <CarouselItem key={i} className="h-full">
                        <div className="relative w-full h-full aspect-[4/5] md:aspect-auto min-h-[400px] md:min-h-[800px]">
                          <Image
                            src={img}
                            alt={`Gallery ${i}`}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                      </CarouselItem>
                    ),
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/20 border-none text-white hover:bg-white hover:text-black transition-all" />
                <CarouselNext className="right-4 bg-white/20 border-none text-white hover:bg-white hover:text-black transition-all" />
              </Carousel>
              <div className="absolute top-4 left-6 z-10 flex flex-col gap-2">
                <Badge className="bg-black text-white px-4 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-wide border-none shadow-2xl">
                  {selectedLook.type.toUpperCase()} PREVIEW
                </Badge>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col h-full bg-white relative">
              <div className="p-4 md:p-4 space-y-10 overflow-y-auto max-h-[90vh]">
                <div className="space-y-4 border-b border-slate-100 pb-10 relative">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.3em] leading-none mb-2">
                      {selectedLook.author}
                    </p>
                    <DialogTitle className="text-sm md:text-sm font-bold text-slate-900 uppercase tracking-tight leading-none">
                      {selectedLook.title}
                    </DialogTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                        BUNDLE_PRICE
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                          {selectedLook.price.toLocaleString('ru-RU')}₽
                        </span>
                        <span className="text-sm font-bold text-slate-300 line-through tracking-tight">
                          {selectedLook.originalPrice.toLocaleString('ru-RU')}₽
                        </span>
                      </div>
                    </div>
                    <Badge className="h-10 px-4 bg-emerald-500 text-white border-none font-bold text-xs uppercase tracking-wide flex items-center justify-center rounded-2xl shadow-lg shadow-emerald-500/20">
                      -
                      {Math.round(
                        (1 - selectedLook.price / selectedLook.originalPrice) *
                          100,
                      )}
                      % ВЫГОДА
                    </Badge>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-indigo-600" /> СОСТАВ
                      ОБРАЗА ({selectedLook.items})
                    </h4>
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Sparkles className="h-3 w-3 fill-indigo-600" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        +{selectedLook.bonus} BONUSES
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {(selectedLook.products || []).map((product: any) => (
                      <div
                        key={product.id}
                        className="group/item flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-900 rounded-3xl transition-all duration-500 border border-transparent hover:border-white/10"
                      >
                        <div className="h-20 w-12 rounded-xl overflow-hidden relative shrink-0 shadow-md">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-indigo-600 group-hover/item:text-indigo-400 uppercase tracking-wide leading-none mb-1">
                            {product.brand}
                          </p>
                          <h5 className="text-sm font-bold text-slate-900 group-hover/item:text-white uppercase tracking-tight truncate leading-tight">
                            {product.name}
                          </h5>
                          <div className="flex gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="bg-white group-hover/item:bg-white/10 border-slate-200 group-hover/item:border-white/20 text-[10px] font-bold uppercase text-slate-500 group-hover/item:text-white/60"
                            >
                              S, M, L, XL
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-white group-hover/item:bg-white/10 border-slate-200 group-hover/item:border-white/20 text-[10px] font-bold uppercase text-slate-500 group-hover/item:text-white/60"
                            >
                              Black
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="font-bold text-slate-900 group-hover/item:text-white text-base tracking-tight leading-none">
                            {product.price.toLocaleString('ru-RU')}₽
                          </p>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white group-hover/item:bg-white/20 text-slate-400 group-hover/item:text-white hover:bg-black hover:text-white"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                        {viewRole === "b2b"
                          ? "B2B Wholesale Terms Active"
                          : "Global Rewards Active"}
                      </p>
                      <p className="text-xs text-indigo-900/60 font-medium">
                        {viewRole === "b2b"
                          ? "MOQ applied. Seasonal discounts included."
                          : "Бесплатная доставка + 2 года гарантии."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide">
                        SYNTHA_SECURE_PAY
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => {
                        if (viewRole === "b2b") {
                          setShowroomViewMode("planning");
                          onOpenChange(false);
                          // In a real app, we would also pre-fill the planning grid here
                        }
                      }}
                      variant="cta"
                      size="ctaLg"
                      className="flex-1"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {viewRole === "b2b"
                        ? "ПЕРЕЙТИ К ЗАКУПКЕ ОБРАЗА"
                        : `КУПИТЬ ВЕСЬ ОБРАЗ (${selectedLook.price.toLocaleString('ru-RU')}₽)`}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 w-12 hover:border-slate-900 hover:bg-white shrink-0"
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
