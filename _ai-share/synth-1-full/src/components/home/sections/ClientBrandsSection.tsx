"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  ArrowRight, 
  FileText, 
  Store, 
  Check, 
  Plus, 
  Library, 
  Star,
  MapPin,
  Heart,
  Sparkles,
  Bell,
  Play,
  Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { brands } from "@/lib/placeholder-data";
import { useAuth } from "@/providers/auth-provider";
import { useUIState } from "@/providers/ui-state";
import { useB2BState } from "@/providers/b2b-state";

interface ClientBrandsSectionProps {
  viewRole: string;
  brandsTab: string;
  setBrandsTab: (tab: string) => void;
  isLinesheetMode: boolean;
  setIsLinesheetMode: (mode: boolean) => void;
}

function BrandCarouselItem({ brand, idx, brandsTab, viewRole }: { brand: any, idx: number, brandsTab: string, viewRole: string }) {
  const { followedBrands, toggleFollowBrand } = useUIState();
  const { requestLinesheet, b2bConnections, toggleB2bConnection, addB2bActivityLog } = useB2BState();
  const isSubscribed = followedBrands.includes(brand.id);
  const isConnected = b2bConnections.some(c => c.brandId === brand.id);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  
  const lookbookImages = [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200"
  ];

  const brandVideo = "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-rooftop-34440-large.mp4";

  const followerGrowth = [12, 18, 15, 25, 30, 28, 35]; // Mock data for chart

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-shrink-0 w-72 snap-start relative group/bcard"
    >
      <Card className="overflow-hidden border border-slate-100 rounded-xl bg-white hover:shadow-2xl hover:border-slate-900/10 transition-all duration-500 flex flex-col h-full relative">
        {/* Top Actions Layer */}
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
          <Dialog open={isLookbookOpen} onOpenChange={setIsLookbookOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      setIsLookbookOpen(true);
                      setMediaType('photo');
                    }}
                    className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all duration-300 shadow-sm"
                  >
                    <Library className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wide">Презентация</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white border-none rounded-xl shadow-2xl z-[100]">
              <DialogHeader className="sr-only">
                <DialogTitle>Презентация бренда {brand.name}</DialogTitle>
              </DialogHeader>
              
              <div className="relative aspect-[16/10] bg-slate-950">
                {mediaType === 'photo' ? (
                  <Carousel className="w-full h-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {lookbookImages.map((img, i) => (
                        <CarouselItem key={i}>
                          <div className="relative aspect-[16/10]">
                            <img src={img} alt={`Lookbook ${i}`} className="w-full h-full object-cover" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-6 bg-white/20 hover:bg-white/40 border-none text-white transition-all shadow-none" />
                    <CarouselNext className="right-6 bg-white/20 hover:bg-white/40 border-none text-white transition-all shadow-none" />
                  </Carousel>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video 
                      src={brandVideo} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Media Selector Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl z-20">
                  <button
                    onClick={() => setMediaType('photo')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all",
                      mediaType === 'photo' ? "bg-white text-black" : "text-white/60 hover:text-white"
                    )}
                  >
                    <ImageIcon className="h-3 w-3" /> Photo
                  </button>
                  <button
                    onClick={() => setMediaType('video')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 transition-all",
                      mediaType === 'video' ? "bg-white text-black" : "text-white/60 hover:text-white"
                    )}
                  >
                    <Play className="h-3 w-3" /> Video
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    toggleFollowBrand(brand.id);
                    if (viewRole === 'b2b') {
                      addB2bActivityLog({
                        type: 'connection_request',
                        actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                        target: { id: brand.id, name: brand.name, type: 'brand' },
                        details: isSubscribed ? 'Unfollowed brand.' : 'Followed brand / Connection requested.'
                      });
                    }
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 border",
                    isSubscribed 
                      ? "bg-black border-black text-white" 
                      : "bg-white/90 border-slate-100 text-slate-400 hover:text-slate-900"
                  )}
                >
                  {isSubscribed ? <Bell className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-xl">
                <p className="text-[10px] font-bold uppercase tracking-wide">{isSubscribed ? "Вы подписаны" : "Подписаться"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {viewRole === 'b2b' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      requestLinesheet(brand.id, 'retailer-1');
                    }}
                    className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ml-2"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white border-none p-2 rounded-lg shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wide">Запросить Linesheet</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Logo Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50/50 flex items-center justify-center px-16 py-4 border-b border-slate-100">
          <div className="w-[122px] h-[122px] bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-0.5 transition-all duration-700 group-hover/bcard:scale-110 group-hover/bcard:shadow-md group-hover/bcard:border-slate-200 relative overflow-hidden">
            {brand.logo?.url ? (
              <img
                src={brand.logo.url}
                alt={brand.name}
                className="w-full h-full object-contain transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/f8fafc/64748b?text=LOGO';
                }}
              />
            ) : (
              <span className="text-sm font-bold text-slate-200">{brand.name[0]}</span>
            )}
          </div>
          
          {/* Description Overlay on Hover */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md opacity-0 group-hover/bcard:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-4 z-20">
            <p className="text-xs text-slate-900 font-medium leading-relaxed text-center">
              {brand.description}
            </p>
            {brand.foundedYear && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-4">
                Est. {brand.foundedYear}
              </span>
            )}
          </div>

          {brandsTab === "selection" && (
            <div className="absolute bottom-6 left-0 right-0 h-px bg-transparent z-30">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="bg-black text-white border-none font-bold text-[7px] uppercase px-2 py-0.5 rounded-lg shadow-lg whitespace-nowrap">ВЫБОР SYNTHA</Badge>
              </div>
            </div>
          )}
          {brandsTab === "new" && (
            <div className="absolute bottom-6 left-0 right-0 h-px bg-transparent z-30">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white border-none font-bold text-[7px] uppercase px-2 py-0.5 rounded-lg shadow-lg whitespace-nowrap">НОВИНКА</Badge>
              </div>
            </div>
          )}
          {brandsTab === "local" && (
            <div className="absolute bottom-6 left-0 right-0 h-px bg-transparent z-30">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white border-none font-bold text-[7px] uppercase px-2 py-0.5 rounded-lg shadow-lg whitespace-nowrap">ЛОКАЛЬНЫЕ БРЕНДЫ</Badge>
              </div>
            </div>
          )}
          {brandsTab === "recommended" && (
            <div className="absolute bottom-6 left-0 right-0 h-px bg-transparent z-30">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="bg-indigo-600 text-white border-none font-bold text-[7px] uppercase px-2 py-0.5 rounded-lg shadow-lg whitespace-nowrap">ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4 pt-0 flex-1 flex flex-col items-center text-center space-y-1">
          <div className="pt-0 space-y-0.5">
            <h3 className="text-base font-semibold text-slate-900 uppercase tracking-tight leading-none group-hover/bcard:text-black transition-colors">{brand.name}</h3>
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide flex items-center justify-center gap-1">
                <MapPin className="h-2 w-2" /> {brand.city || 'Moscow'}
              </p>
              <p className="text-[7px] text-slate-300 font-bold uppercase tracking-wide">
                {brand.countryOfOrigin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2 border-y border-slate-50 w-full justify-center mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center cursor-help">
                    <span className="text-xs font-bold text-slate-900">{brand.followers.toLocaleString('ru-RU')}</span>
                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">Followers</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-none p-3 rounded-xl shadow-2xl w-48">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide border-b border-white/10 pb-1">Прирост за месяц</p>
                    <div className="flex items-end gap-1 h-12 pt-2">
                      {followerGrowth.map((val, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-indigo-500 rounded-t-sm transition-all hover:bg-white" 
                          style={{ height: `${(val / 40) * 100}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Стабильный рост +12% к прошлому периоду</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-px h-6 bg-slate-100" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center cursor-help">
                    <div className="flex items-center gap-0.5">
                      <span className="text-xs font-bold text-slate-900">4.9</span>
                      <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                    </div>
                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide">Rating</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-900 text-white border-none p-3 rounded-xl shadow-2xl w-48">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide border-b border-white/10 pb-1">Параметры оценки</p>
                    <div className="space-y-1.5">
                      {[
                        { label: "Качество", val: 4.9 },
                        { label: "Сроки", val: 4.8 },
                        { label: "Коммуникация", val: 5.0 },
                        { label: "Упаковка", val: 4.7 },
                        { label: "Соответствие", val: 4.9 }
                      ].map(p => (
                        <div key={p.label} className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{p.label}</span>
                          <span className="text-[10px] text-white font-bold">{p.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="w-full pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block mb-4 cursor-help hover:text-blue-800 transition-colors">
                    {brand.segment}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white border-none p-3 rounded-xl shadow-2xl max-w-[200px]">
                  <p className="text-[10px] font-medium leading-relaxed italic text-center">
                    "{brand.segment === "Premium" ? "Бренд относится к сегменту премиум за счет использования эксклюзивных материалов и ограниченных тиражей." : "Бренд прошел авторизацию платформы и соответствует высоким стандартам качества и дизайна."}"
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button 
              asChild
              variant="ctaOutline"
              size="ctaSm"
              onClick={() => {
                if (viewRole === 'b2b') {
                  addB2bActivityLog({
                    type: 'view_product',
                    actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                    target: { id: brand.id, name: brand.name, type: 'brand' },
                    details: 'Entered brand showroom for catalog exploration.'
                  });
                }
              }}
              className="mx-auto w-[160px] group/btn"
            >
              <Link href={`/b/${brand.slug}`}>
                В ШОУРУМ <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ClientBrandsSection({
  viewRole,
  brandsTab,
  setBrandsTab,
  isLinesheetMode,
  setIsLinesheetMode,
}: ClientBrandsSectionProps) {
  const auth = useAuth();
  
  const getDisplayBrands = () => {
    switch (brandsTab) {
      case "selection": {
        // Показываем оба бренда в подборке
        return brands.filter(b => b.name === "Syntha Lab" || b.name === "Nordic Wool");
      }
      case "new": {
        // В новинках только Nordic Wool
        const nordic = brands.find(b => b.name === "Nordic Wool");
        return nordic ? [nordic] : [];
      }
      case "local": {
        const syntha = brands.find(b => b.name === "Syntha Lab");
        return syntha ? [syntha] : brands.slice(0, 1);
      }
      case "recommended": {
        const nordic = brands.find(b => b.name === "Nordic Wool");
        return nordic ? [nordic] : brands.slice(2, 3);
      }
      default: return brands.slice(0, 1);
    }
  };

  const displayBrands = getDisplayBrands();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="section-spacing bg-transparent relative"
    >
      <div className="container mx-auto px-4 relative">
        <Card className="bg-white border-none rounded-xl shadow-2xl shadow-slate-200/50 relative transition-all group min-h-[500px] flex flex-col justify-center border border-slate-100">
          <CardContent className="p-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3 relative">
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-black" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-200 text-slate-900 uppercase font-bold tracking-normal px-2 py-0.5"
                    >
                      {viewRole === "b2b" ? "PARTNERS_b2b" : "PARTNERS_b2c"}
                    </Badge>
                  </div>
                  <Link
                    href="/brands"
                    className="hover:text-black transition-colors block"
                  >
                    <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
                      {viewRole === "b2b" ? "ПАРТНЕРЫ" : "БРЕНДЫ"}
                    </h2>
                  </Link>
                  <p className="text-slate-400 font-medium text-xs max-w-md">
                    {viewRole === "b2b"
                      ? "Прямой доступ к верифицированным поставщикам и сети профессиональных байеров."
                      : "Глобальная экосистема авторизованных партнеров и локальных талантов."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
                  {[
                    { id: "selection", label: "Подборка" },
                    { id: "new", label: "Новинки" },
                    { id: "local", label: "Локалы" },
                    { id: "recommended", label: "Рекомендации" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setBrandsTab(tab.id)}
                      className={cn(
                        "btn-tab min-w-[140px] gap-2",
                        brandsTab === tab.id ? "btn-tab-active" : "btn-tab-inactive",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {viewRole === "brand" && (
                  <button
                    onClick={() => setIsLinesheetMode(!isLinesheetMode)}
                    className={cn(
                      "px-4 h-[38px] rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all border flex items-center gap-2",
                      isLinesheetMode
                        ? "bg-amber-500 text-white border-amber-500 shadow-lg"
                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-400",
                    )}
                  >
                    <FileText className="h-3 w-3" />
                    {isLinesheetMode
                      ? " Режим выбора: ВКЛ"
                      : "Конструктор лайтшита"}
                  </button>
                )}
                <button
                  className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                  onClick={() =>
                    document
                      .getElementById("brands-scroll")
                      ?.scrollBy({ left: -400, behavior: "smooth" })
                  }
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  className="text-slate-400 hover:text-slate-900 transition-colors p-1"
                  onClick={() =>
                    document
                      .getElementById("brands-scroll")
                      ?.scrollBy({ left: 400, behavior: "smooth" })
                  }
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative group/brands px-8">
              <div
                id="brands-scroll"
                className="flex overflow-x-auto pb-6 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth"
              >
                <AnimatePresence mode="popLayout">
                  {displayBrands.map((brand, idx) => (
                    <BrandCarouselItem 
                      key={brand.id} 
                      brand={brand} 
                      idx={idx} 
                      brandsTab={brandsTab} 
                      viewRole={viewRole} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {viewRole === "client" && (
              <Card className="mt-6 bg-slate-900 border-none rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-2xl group/banner">
                <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                  <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000" alt="Brand Partnership" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                <CardContent className="relative z-10 p-4 space-y-4 max-w-4xl text-white w-full text-left">
                  <div className="overflow-hidden whitespace-nowrap mb-4 py-2 border-y border-white/10 relative group/marquee">
                    <motion.div 
                      animate={{ x: ["0%", "-50%"] }} 
                      transition={{ duration: 120, repeat: Infinity, ease: "linear" }} 
                      className="flex items-center gap-3 w-fit"
                    >
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Новинки</span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Эксклюзивы</span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">• Тренды</span>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tight leading-tight">ПАРТНЕРЫ</h2>
                    <p className="text-slate-300 text-sm font-medium border-l-2 border-indigo-500/50 pl-6 whitespace-nowrap">"Прямой доступ к брендам-участникам платформы и их коллекциям."</p>
                    <div className="pt-4 flex">
                      <Button
                        asChild
                        variant="cta"
                        size="ctaLg"
                        className="min-w-[200px] w-fit"
                      >
                        <Link href="/brands" className="flex items-center gap-2">
                          Смотреть все
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="absolute bottom-8 right-10 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-default z-20">
              <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 tracking-tight">
                PARTNER_MATRIX_v2.4
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
