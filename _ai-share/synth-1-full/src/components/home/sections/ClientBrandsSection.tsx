'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Image as ImageIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { brands } from '@/lib/placeholder-data';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';

interface ClientBrandsSectionProps {
  viewRole: string;
  brandsTab: string;
  setBrandsTab: (tab: string) => void;
  isLinesheetMode: boolean;
  setIsLinesheetMode: (mode: boolean) => void;
}

function BrandCarouselItem({
  brand,
  idx,
  brandsTab,
  viewRole,
}: {
  brand: any;
  idx: number;
  brandsTab: string;
  viewRole: string;
}) {
  const { followedBrands, toggleFollowBrand } = useUIState();
  const { requestLinesheet, b2bConnections, toggleB2bConnection, addB2bActivityLog } =
    useB2BState();
  const isSubscribed = followedBrands.includes(brand.id);
  const isConnected = b2bConnections.some((c) => c.brandId === brand.id);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

  const lookbookImages = [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200',
  ];

  const brandVideo =
    'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-on-a-rooftop-34440-large.mp4';

  const followerGrowth = [12, 18, 15, 25, 30, 28, 35]; // Mock data for chart

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group/bcard relative w-72 flex-shrink-0 snap-start"
    >
      <Card className="border-border-subtle hover:border-text-primary/10 relative flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-all duration-500 hover:shadow-2xl">
        {/* Top Actions Layer */}
        <div className="absolute left-4 right-4 top-4 z-30 flex items-center justify-between">
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
                    className="border-border-subtle text-text-muted hover:text-text-primary flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300"
                  >
                    <Library className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-text-primary rounded-lg border-none p-2 text-white shadow-xl"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide">Презентация</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="z-[100] overflow-hidden rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-[900px]">
              <DialogHeader className="sr-only">
                <DialogTitle>Презентация бренда {brand.name}</DialogTitle>
              </DialogHeader>

              <div className="bg-text-primary relative aspect-[16/10]">
                {mediaType === 'photo' ? (
                  <Carousel className="h-full w-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {lookbookImages.map((img, i) => (
                        <CarouselItem key={i}>
                          <div className="relative aspect-[16/10]">
                            <img
                              src={img}
                              alt={`Lookbook ${i}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-6 border-none bg-white/20 text-white shadow-none transition-all hover:bg-white/40" />
                    <CarouselNext className="right-6 border-none bg-white/20 text-white shadow-none transition-all hover:bg-white/40" />
                  </Carousel>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black">
                    <video
                      src={brandVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Media Selector Overlay */}
                <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl">
                  <button
                    onClick={() => setMediaType('photo')}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition-all',
                      mediaType === 'photo'
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
                    )}
                  >
                    <ImageIcon className="h-3 w-3" /> Photo
                  </button>
                  <button
                    onClick={() => setMediaType('video')}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition-all',
                      mediaType === 'video'
                        ? 'bg-white text-black'
                        : 'text-white/60 hover:text-white'
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
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFollowBrand(brand.id);
                    if (viewRole === 'b2b') {
                      addB2bActivityLog({
                        type: 'connection_request',
                        actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
                        target: { id: brand.id, name: brand.name, type: 'brand' },
                        details: isSubscribed
                          ? 'Unfollowed brand.'
                          : 'Followed brand / Connection requested.',
                      });
                    }
                  }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300',
                    isSubscribed
                      ? 'border-black bg-black text-white'
                      : 'border-border-subtle text-text-muted hover:text-text-primary bg-white/90'
                  )}
                >
                  {isSubscribed ? (
                    <Bell className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-text-primary rounded-lg border-none p-2 text-white shadow-xl"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide">
                  {isSubscribed ? 'Вы подписаны' : 'Подписаться'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {viewRole === 'b2b' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      requestLinesheet(brand.id, 'retailer-1');
                    }}
                    className="bg-accent-primary ml-2 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-text-primary rounded-lg border-none p-2 text-white shadow-xl"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wide">
                    Запросить Linesheet
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Logo Section */}
        <div className="bg-bg-surface2/80 border-border-subtle relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b px-16 py-4">
          <div className="border-border-subtle group-hover/bcard:border-border-default relative flex h-[122px] w-[122px] items-center justify-center overflow-hidden rounded-2xl border bg-white p-0.5 shadow-sm transition-all duration-700 group-hover/bcard:scale-110 group-hover/bcard:shadow-md">
            {brand.logo?.url ? (
              <img
                src={brand.logo.url}
                alt={brand.name}
                className="h-full w-full object-contain transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/200x200/f8fafc/64748b?text=LOGO';
                }}
              />
            ) : (
              <span className="text-text-muted text-sm font-bold">{brand.name[0]}</span>
            )}
          </div>

          {/* Description Overlay on Hover */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 p-4 opacity-0 backdrop-blur-md transition-all duration-500 group-hover/bcard:opacity-100">
            <p className="text-text-primary text-center text-xs font-medium leading-relaxed">
              {brand.description}
            </p>
            {brand.foundedYear && (
              <span className="text-text-muted mt-4 text-[10px] font-bold uppercase tracking-wide">
                Est. {brand.foundedYear}
              </span>
            )}
          </div>

          {brandsTab === 'selection' && (
            <div className="absolute bottom-6 left-0 right-0 z-30 h-px bg-transparent">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="whitespace-nowrap rounded-lg border-none bg-black px-2 py-0.5 text-[7px] font-bold uppercase text-white shadow-lg">
                  ВЫБОР SYNTHA
                </Badge>
              </div>
            </div>
          )}
          {brandsTab === 'new' && (
            <div className="absolute bottom-6 left-0 right-0 z-30 h-px bg-transparent">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="whitespace-nowrap rounded-lg border-none bg-blue-600 px-2 py-0.5 text-[7px] font-bold uppercase text-white shadow-lg">
                  НОВИНКА
                </Badge>
              </div>
            </div>
          )}
          {brandsTab === 'local' && (
            <div className="absolute bottom-6 left-0 right-0 z-30 h-px bg-transparent">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="whitespace-nowrap rounded-lg border-none bg-amber-500 px-2 py-0.5 text-[7px] font-bold uppercase text-white shadow-lg">
                  ЛОКАЛЬНЫЕ БРЕНДЫ
                </Badge>
              </div>
            </div>
          )}
          {brandsTab === 'recommended' && (
            <div className="absolute bottom-6 left-0 right-0 z-30 h-px bg-transparent">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent-primary whitespace-nowrap rounded-lg border-none px-2 py-0.5 text-[7px] font-bold uppercase text-white shadow-lg">
                  ПЕРСОНАЛЬНОЕ ПРЕДЛОЖЕНИЕ
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="flex flex-1 flex-col items-center space-y-1 p-4 pt-0 text-center">
          <div className="space-y-0.5 pt-0">
            <h3 className="text-text-primary text-base font-semibold uppercase leading-none tracking-tight transition-colors group-hover/bcard:text-black">
              {brand.name}
            </h3>
            <div className="flex flex-col items-center">
              <p className="text-text-muted flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide">
                <MapPin className="h-2 w-2" /> {brand.city || 'Moscow'}
              </p>
              <p className="text-text-muted text-[7px] font-bold uppercase tracking-wide">
                {brand.countryOfOrigin}
              </p>
            </div>
          </div>

          <div className="border-border-subtle mt-2 flex w-full items-center justify-center gap-3 border-y py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help flex-col items-center">
                    <span className="text-text-primary text-xs font-bold">
                      {brand.followers.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-text-muted text-[7px] font-bold uppercase tracking-wide">
                      Followers
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-text-primary w-48 rounded-xl border-none p-3 text-white shadow-2xl"
                >
                  <div className="space-y-2">
                    <p className="border-b border-white/10 pb-1 text-[10px] font-bold uppercase tracking-wide">
                      Прирост за месяц
                    </p>
                    <div className="flex h-12 items-end gap-1 pt-2">
                      {followerGrowth.map((val, i) => (
                        <div
                          key={i}
                          className="bg-accent-primary flex-1 rounded-t-sm transition-all hover:bg-white"
                          style={{ height: `${(val / 40) * 100}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-text-muted text-[10px] font-medium">
                      Стабильный рост +12% к прошлому периоду
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="bg-bg-surface2 h-6 w-px" />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help flex-col items-center">
                    <div className="flex items-center gap-0.5">
                      <span className="text-text-primary text-xs font-bold">4.9</span>
                      <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                    </div>
                    <span className="text-text-muted text-[7px] font-bold uppercase tracking-wide">
                      Rating
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-text-primary w-48 rounded-xl border-none p-3 text-white shadow-2xl"
                >
                  <div className="space-y-2">
                    <p className="border-b border-white/10 pb-1 text-[10px] font-bold uppercase tracking-wide">
                      Параметры оценки
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Качество', val: 4.9 },
                        { label: 'Сроки', val: 4.8 },
                        { label: 'Коммуникация', val: 5.0 },
                        { label: 'Упаковка', val: 4.7 },
                        { label: 'Соответствие', val: 4.9 },
                      ].map((p) => (
                        <div key={p.label} className="flex items-center justify-between">
                          <span className="text-text-muted text-[10px] font-bold uppercase">
                            {p.label}
                          </span>
                          <span className="text-[10px] font-bold text-white">{p.val}</span>
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
                  <span className="mb-4 block cursor-help text-[10px] font-bold uppercase tracking-wide text-blue-600 transition-colors hover:text-blue-800">
                    {brand.segment}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-text-primary max-w-[200px] rounded-xl border-none p-3 text-white shadow-2xl"
                >
                  <p className="text-center text-[10px] font-medium italic leading-relaxed">
                    "
                    {brand.segment === 'Premium'
                      ? 'Бренд относится к сегменту премиум за счет использования эксклюзивных материалов и ограниченных тиражей.'
                      : 'Бренд прошел авторизацию платформы и соответствует высоким стандартам качества и дизайна.'}
                    "
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
                    details: 'Entered brand showroom for catalog exploration.',
                  });
                }
              }}
              className="group/btn mx-auto w-[160px]"
            >
              <Link href={`/b/${brand.slug}`}>
                В ШОУРУМ{' '}
                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
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
      case 'selection': {
        // Показываем оба бренда в подборке
        return brands.filter((b) => b.name === 'Syntha Lab' || b.name === 'Nordic Wool');
      }
      case 'new': {
        // В новинках только Nordic Wool
        const nordic = brands.find((b) => b.name === 'Nordic Wool');
        return nordic ? [nordic] : [];
      }
      case 'local': {
        const syntha = brands.find((b) => b.name === 'Syntha Lab');
        return syntha ? [syntha] : brands.slice(0, 1);
      }
      case 'recommended': {
        const nordic = brands.find((b) => b.name === 'Nordic Wool');
        return nordic ? [nordic] : brands.slice(2, 3);
      }
      default:
        return brands.slice(0, 1);
    }
  };

  const displayBrands = getDisplayBrands();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="section-spacing relative bg-transparent"
    >
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <Card className="border-border-subtle group relative flex min-h-[500px] flex-col justify-center rounded-xl border border-none bg-white shadow-2xl shadow-md transition-all">
          <CardContent className="relative z-10 p-4">
            <div className="relative mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-xl">
                      <Users className="h-4 w-4 text-black" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border-default text-text-primary px-2 py-0.5 text-xs font-bold uppercase tracking-normal"
                    >
                      {viewRole === 'b2b' ? 'PARTNERS_b2b' : 'PARTNERS_b2c'}
                    </Badge>
                  </div>
                  <Link href="/brands" className="block transition-colors hover:text-black">
                    <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                      {viewRole === 'b2b' ? 'ПАРТНЕРЫ' : 'БРЕНДЫ'}
                    </h2>
                  </Link>
                  <p className="text-text-muted max-w-md text-xs font-medium">
                    {viewRole === 'b2b'
                      ? 'Прямой доступ к верифицированным поставщикам и сети профессиональных байеров.'
                      : 'Глобальная экосистема авторизованных партнеров и локальных талантов.'}
                  </p>
                </div>

                <div className="bg-bg-surface2 border-border-subtle flex w-fit items-center gap-1.5 rounded-2xl border p-1">
                  {[
                    { id: 'selection', label: 'Подборка' },
                    { id: 'new', label: 'Новинки' },
                    { id: 'local', label: 'Локалы' },
                    { id: 'recommended', label: 'Рекомендации' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setBrandsTab(tab.id)}
                      className={cn(
                        'btn-tab min-w-[140px] gap-2',
                        brandsTab === tab.id ? 'btn-tab-active' : 'btn-tab-inactive'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {viewRole === 'brand' && (
                  <button
                    onClick={() => setIsLinesheetMode(!isLinesheetMode)}
                    className={cn(
                      'flex h-[38px] items-center gap-2 rounded-xl border px-4 text-[10px] font-bold uppercase tracking-wide transition-all',
                      isLinesheetMode
                        ? 'border-amber-500 bg-amber-500 text-white shadow-lg'
                        : 'text-text-muted border-border-default hover:border-border-strong bg-white'
                    )}
                  >
                    <FileText className="h-3 w-3" />
                    {isLinesheetMode ? ' Режим выбора: ВКЛ' : 'Конструктор лайтшита'}
                  </button>
                )}
                <button
                  className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  onClick={() =>
                    document
                      .getElementById('brands-scroll')
                      ?.scrollBy({ left: -400, behavior: 'smooth' })
                  }
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  className="text-text-muted hover:text-text-primary p-1 transition-colors"
                  onClick={() =>
                    document
                      .getElementById('brands-scroll')
                      ?.scrollBy({ left: 400, behavior: 'smooth' })
                  }
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="group/brands relative px-8">
              <div
                id="brands-scroll"
                className="custom-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-6"
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

            {viewRole === 'client' && (
              <Card className="bg-text-primary group/banner relative mt-6 flex min-h-[300px] items-center overflow-hidden rounded-xl border-none shadow-2xl">
                <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000"
                    alt="Brand Partnership"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
                <CardContent className="relative z-10 w-full max-w-4xl space-y-4 p-4 text-left text-white">
                  <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                    <motion.div
                      animate={{ x: ['0%', '-50%'] }}
                      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                      className="flex w-fit items-center gap-3"
                    >
                      {[1, 2].map((i) => (
                        <div key={i} className="flex shrink-0 items-center gap-3">
                          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                            • Новинки
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                            • Эксклюзивы
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/60">
                            • Тренды
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                      ПАРТНЕРЫ
                    </h2>
                    <p className="text-text-muted border-accent-primary/50 whitespace-nowrap border-l-2 pl-6 text-sm font-medium">
                      "Прямой доступ к брендам-участникам платформы и их коллекциям."
                    </p>
                    <div className="flex pt-4">
                      <Button asChild variant="cta" size="ctaLg" className="w-fit min-w-[200px]">
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

            <div className="absolute bottom-8 right-10 z-20 flex cursor-default items-center gap-2 opacity-20 transition-opacity hover:opacity-100">
              <div className="bg-accent-primary h-1 w-1 animate-pulse rounded-full" />
              <span className="text-text-muted text-[10px] font-medium uppercase tracking-tight tracking-wide">
                PARTNER_MATRIX_v2.4
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
