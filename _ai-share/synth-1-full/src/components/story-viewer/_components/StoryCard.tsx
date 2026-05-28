'use client';

import React from 'react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Radio,
  Heart,
  Send,
  Sparkles,
  Ticket,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder, Product } from '@/lib/types';

interface StoryCardProps {
  story: ImagePlaceholder;
  progress: number;
  isLiveNow: boolean;
  showProducts: boolean;
  setShowProducts: (show: boolean) => void;
  products: Product[];
  mode: string;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  likesCount: number;
  setLikesCount: (count: any) => void;
  handleShare: () => void;
  handleSendGift: () => void;
  handleJoinRaffle: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  setIsLivePlayerOpen: (open: boolean) => void;
}

export function StoryCard(props: StoryCardProps) {
  const {
    story,
    progress,
    isLiveNow,
    showProducts,
    setShowProducts,
    products,
    mode,
    isLiked,
    setIsLiked,
    likesCount,
    setLikesCount,
    handleShare,
    handleSendGift,
    handleJoinRaffle,
    onPrev,
    onNext,
    setIsLivePlayerOpen,
  } = props;

  const isUGC = story.category === 'UGC' || story.id.includes('ugc') || story.id.includes('client');

  return (
    <div className="group/story relative aspect-[9/16] w-full max-w-md shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500">
      <AspectRatio ratio={9 / 16}>
        <Image
          src={story.imageUrl}
          alt={story.description}
          fill
          className="rounded-xl object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        <div className="absolute left-6 right-6 top-4 z-20 flex gap-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="absolute left-6 right-6 top-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-accent bg-white p-0.5">
              <Image
                src={story.imageUrl}
                alt="brand"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white">
                Live Feed
              </p>
              <p className="text-[8px] font-bold uppercase text-white/80">В прямом эфире</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLiveNow && (
              <button
                onClick={() => setIsLivePlayerOpen(true)}
                className="flex h-10 animate-pulse items-center gap-2.5 rounded-2xl bg-red-500 px-4 text-white shadow-lg"
              >
                <Radio className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase">Смотреть эфир</span>
              </button>
            )}
            {products.length > 0 && mode !== 'simple' && !isLiveNow && mode !== 'invitation' && (
              <Button
                onClick={() => setShowProducts(!showProducts)}
                className={cn(
                  'h-9 rounded-xl px-4 text-[10px] font-black uppercase shadow-xl',
                  showProducts ? 'bg-white text-black' : 'animate-pulse bg-[#22c55e] text-white'
                )}
              >
                <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                {showProducts ? 'Скрыть' : 'Показать'}
              </Button>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-8 right-8 space-y-4 text-white">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge className="border-none bg-white/20 text-[8px] font-black uppercase text-white/80">
                {isLiveNow ? 'Live' : 'Story'}
              </Badge>
              <span className="text-[10px] font-black uppercase text-white/60">
                {(story as any).viewers || '842'} зрителей
              </span>
            </div>
            <p className="mt-2 text-xs font-medium leading-relaxed text-white/80">
              {story.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsLiked(!isLiked);
                  setLikesCount((p: any) => (isLiked ? p - 1 : p + 1));
                }}
                className="flex flex-col items-center gap-1"
              >
                <Heart
                  className={cn(
                    'h-7 w-7 transition-all',
                    isLiked ? 'scale-110 fill-red-500 text-red-500' : 'text-white'
                  )}
                />
                <span className="text-[10px] font-black">{likesCount}</span>
              </button>
              <button onClick={handleShare} className="flex flex-col items-center gap-1">
                <Send className="h-7 w-7 -rotate-12 text-white" />
                <span className="text-[10px] font-black">Поделиться</span>
              </button>
              {isUGC ? (
                <button onClick={handleSendGift} className="flex flex-col items-center gap-1">
                  <Sparkles className="h-7 w-7 text-white" />
                  <span className="text-[10px] font-black">Подарок</span>
                </button>
              ) : (
                <button onClick={handleJoinRaffle} className="flex flex-col items-center gap-1">
                  <Ticket className="h-7 w-7 text-white" />
                  <span className="text-[10px] font-black uppercase">Розыгрыш</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onPrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={onNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
}
