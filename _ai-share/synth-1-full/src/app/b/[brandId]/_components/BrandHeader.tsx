import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Building,
  Star,
  TrendingUp,
  Trophy,
  Check,
  Plus,
  MessageSquare,
  Heart,
  Tag,
  Copy,
  Instagram,
  Send,
  Youtube,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Brand } from '@/lib/types';

interface BrandHeaderProps {
  brand: Brand;
  displaySettings: any;
  displayName: string;
  storyImages: any[];
  handleOpenStory: (image: any, list: any[]) => void;
  setIsBrandReviewsOpen: (open: boolean) => void;
  brandReviews: { average: number; count: number };
  setIsStatsDialogOpen: (open: boolean) => void;
  setIsStatusesDialogOpen: (open: boolean) => void;
  activeStatuses: any[];
  currentStatusIndex: number;
  isFollowed: boolean;
  setIsFollowed: (followed: boolean) => void;
  setAnimatedFollowers: React.Dispatch<React.SetStateAction<number>>;
  setIsMessageDialogOpen: (open: boolean) => void;
  isFavorite: boolean;
  setIsFavorite: (favorite: boolean) => void;
  storefrontSettings: any;
  brandActivePromo: any;
  toast: any;
}

export function BrandHeader({
  brand,
  displaySettings,
  displayName,
  storyImages,
  handleOpenStory,
  setIsBrandReviewsOpen,
  brandReviews,
  setIsStatsDialogOpen,
  setIsStatusesDialogOpen,
  activeStatuses,
  currentStatusIndex,
  isFollowed,
  setIsFollowed,
  setAnimatedFollowers,
  setIsMessageDialogOpen,
  isFavorite,
  setIsFavorite,
  storefrontSettings,
  brandActivePromo,
  toast,
}: BrandHeaderProps) {
  return (
    <header className="mx-auto mb-4 flex max-w-5xl flex-col items-center gap-3 border-b border-slate-100 pb-4 duration-700 animate-in fade-in md:flex-row md:items-start">
      {displaySettings.logo && (
        <div className="group relative shrink-0">
          {/* Logo with Story Ring */}
          <button
            onClick={() => storyImages.length > 0 && handleOpenStory(storyImages[0], storyImages)}
            className="group/logo relative h-24 w-24 rounded-full shadow-xl transition-all hover:shadow-indigo-100/50 active:scale-95"
          >
            <div
              className={cn(
                'absolute -inset-1 rounded-full border-2 border-transparent transition-all duration-500',
                storyImages.length > 0
                  ? 'animate-pulse-slow border-indigo-500/50 ring-2 ring-indigo-500 ring-offset-2 ring-offset-background'
                  : 'group-hover/logo:border-indigo-500/30'
              )}
            ></div>
            <div className="relative h-full w-full overflow-hidden rounded-full border border-slate-200 bg-white p-2 shadow-inner">
              <Image
                src={brand.logo.url}
                alt={brand.logo.alt}
                fill
                className="relative z-10 object-contain p-2 transition-transform duration-500 group-hover/logo:scale-110"
                data-ai-hint={brand.logo.hint}
                sizes="96px"
              />
            </div>
          </button>

          {/* Rating & Reviews Trigger */}
          <div className="group/trigger absolute -bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsBrandReviewsOpen(true);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-white shadow-lg transition-all hover:scale-105 hover:bg-indigo-600"
            >
              <div className="flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-current text-amber-400" />
                <span className="text-[10px] font-bold">{brandReviews.average}</span>
              </div>
              <div className="h-2 w-[1px] bg-white/20" />
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                {brandReviews.count} REVIEWS
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsStatsDialogOpen(true);
              }}
              className="h-6 w-6 rounded-full border border-slate-200 bg-white shadow-md transition-all hover:bg-indigo-50 hover:text-indigo-600"
            >
              <TrendingUp className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex-1 space-y-3 pt-6 text-center md:pt-2 md:text-left">
        <div className="flex flex-col gap-1">
          <div className="mb-1 flex items-center justify-center gap-2 md:justify-start">
            <Badge
              variant="outline"
              className="h-5 gap-1 border-indigo-100 bg-indigo-50 px-2 text-[8px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm transition-all"
            >
              <Building className="h-2.5 w-2.5" /> VERIFIED PARTNER
            </Badge>
            <Badge
              variant="outline"
              className="h-5 border-slate-200 bg-slate-50 px-2 text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-sm"
            >
              EST. 2012
            </Badge>
          </div>
          {displaySettings.name && (
            <h1 className="mb-2 font-headline text-2xl font-bold uppercase leading-none tracking-tight text-slate-900 md:text-4xl">
              {displayName}
            </h1>
          )}
        </div>
        {displaySettings.description && brand.description && (
          <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed tracking-tight text-slate-500 opacity-90 md:mx-0 md:text-base">
            {brand.description}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-1.5 md:justify-start">
          {brand.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-default rounded-md border-none bg-slate-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500 transition-all hover:bg-slate-900 hover:text-white"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex min-w-[220px] flex-col items-center gap-3 md:items-end">
        <div className="flex w-full max-w-[200px] items-center gap-2">
          {displaySettings.action_button && (
            <Button
              size="sm"
              className={cn(
                'h-8 flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-lg transition-all duration-300',
                isFollowed
                  ? 'border border-slate-200 bg-slate-100 text-slate-400 shadow-none hover:bg-slate-200'
                  : 'bg-slate-900 text-white shadow-indigo-100/50 hover:bg-indigo-600'
              )}
              onClick={() => {
                if (!isFollowed) {
                  setAnimatedFollowers((prev) => prev + 1);
                } else {
                  setAnimatedFollowers((prev) => Math.max(0, prev - 1));
                }
                setIsFollowed(!isFollowed);
              }}
            >
              {isFollowed ? (
                <Check className="mr-1.5 h-3 w-3" />
              ) : (
                <Plus className="mr-1.5 h-3 w-3" />
              )}
              {isFollowed ? 'FOLLOWING' : 'FOLLOW BRAND'}
            </Button>
          )}
          <Button
            variant="outline"
            className={cn(
              'h-8 w-8 shrink-0 rounded-lg border p-0 shadow-sm transition-all duration-300',
              isFavorite
                ? 'border-rose-100 bg-rose-50 text-rose-500 shadow-rose-100/50 hover:bg-rose-100'
                : 'border-slate-200 text-slate-400 hover:bg-slate-50'
            )}
            onClick={() => {
              setIsFavorite(!isFavorite);
              toast({
                title: !isFavorite ? 'Curated to Favorites' : 'Removed from Curation',
                description: !isFavorite
                  ? `${displayName} is now prioritized in your neural feed.`
                  : `${displayName} affinity has been reset.`,
              });
            }}
          >
            <Heart className={cn('h-3.5 w-3.5', isFavorite && 'fill-current')} />
          </Button>
        </div>

        {storefrontSettings.showActivePromo && brandActivePromo && (
          <Card className="group/promo relative w-full max-w-[200px] overflow-hidden rounded-xl border border-indigo-100 bg-white p-2.5 shadow-sm transition-all hover:shadow-md">
            <div className="absolute right-0 top-0 p-1">
              <Tag className="h-3 w-3 rotate-12 text-indigo-600/20 transition-colors group-hover/promo:text-indigo-600/40" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                Access Protocol
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs font-bold uppercase tabular-nums tracking-tighter text-indigo-600">
                  {brandActivePromo.code}
                </p>
                <button
                  className="flex h-5 w-5 items-center justify-center rounded-md border border-transparent text-slate-300 shadow-sm transition-all hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
                  onClick={() => {
                    navigator.clipboard.writeText(brandActivePromo.code);
                    toast({ title: 'Protocol Copied' });
                  }}
                >
                  <Copy className="h-2.5 w-2.5" />
                </button>
              </div>
              <p className="mt-0.5 text-[8px] font-bold uppercase italic tracking-widest text-emerald-600 opacity-80">
                {brandActivePromo.expiry}
              </p>
            </div>
          </Card>
        )}

        {/* Loyalty Progress Tracker */}
        <Card className="group/loyalty relative w-full max-w-[200px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-xl">
          <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform duration-700 group-hover:scale-110">
            <Trophy className="h-10 w-10 text-amber-400" />
          </div>
          <div className="relative space-y-2.5">
            <div className="flex flex-col gap-1">
              <p className="text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-white/30">
                ENTITY STATUS
              </p>
              <div className="flex items-center gap-1.5">
                <h4 className="text-[10px] font-bold uppercase tracking-tighter text-white">
                  Elite Merchant
                </h4>
                <Badge className="h-3.5 border-none bg-amber-400 px-1 text-[7px] font-bold uppercase tracking-widest text-slate-900">
                  LVL 2
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-end justify-between">
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">
                  TO NEXT TIER
                </span>
                <span className="text-[9px] font-bold italic tabular-nums tracking-tighter text-white">
                  45.2K ₽
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full border border-white/5 bg-white/5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-indigo-600 shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Brand Stylist */}
        <button
          className="group/stylist relative flex h-10 w-full max-w-[200px] items-center gap-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md"
          onClick={() => setIsMessageDialogOpen(true)}
        >
          <div className="absolute inset-0 translate-y-full bg-indigo-50/50 transition-transform duration-500 group-hover/stylist:translate-y-0" />
          <div className="relative flex w-full items-center gap-2">
            <div className="relative shrink-0">
              <div className="h-7 w-7 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-inner transition-colors group-hover/stylist:border-indigo-200">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
                  alt="Stylist"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
            </div>
            <div className="min-w-0 text-left">
              <p className="mb-0.5 text-[7px] font-bold uppercase italic leading-none tracking-widest text-indigo-600">
                PROTOCOL ACTIVE
              </p>
              <p className="truncate text-[9px] font-bold uppercase tracking-tight text-slate-900">
                Strategic Concierge
              </p>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
