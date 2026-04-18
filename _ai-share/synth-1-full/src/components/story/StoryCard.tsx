'use client';

import Image from 'next/image';
import {
  Radio,
  ShoppingBag,
  Heart,
  Send,
  Sparkles,
  Ticket,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder, Product } from '@/lib/types';

interface StoryCardProps {
  story: ImagePlaceholder;
  progress: number;
  isLiveNow: boolean;
  products: Product[];
  mode: 'products' | 'gallery' | 'simple' | 'invitation';
  showProducts: boolean;
  setShowProducts: (show: boolean) => void;
  setIsLivePlayerOpenFromStory: (open: boolean) => void;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  likesCount: number;
  setLikesCount: React.Dispatch<React.SetStateAction<number>>;
  handleShare: () => void;
  isUGC: boolean;
  handleSendGift: () => void;
  handleJoinRaffle: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function StoryCard({
  story,
  progress,
  isLiveNow,
  products,
  mode,
  showProducts,
  setShowProducts,
  setIsLivePlayerOpenFromStory,
  isLiked,
  setIsLiked,
  likesCount,
  setLikesCount,
  handleShare,
  isUGC,
  handleSendGift,
  handleJoinRaffle,
  onPrev,
  onNext,
}: StoryCardProps) {
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

        {/* Progress Bar */}
        <div className="absolute left-6 right-6 top-4 z-20 flex gap-1">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute left-6 right-6 top-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full border-2 border-accent bg-white p-0.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-muted">
                <Image
                  src={story.imageUrl}
                  alt="brand"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
                Live Feed
              </p>
              <p className="text-[8px] font-bold uppercase tracking-tighter text-white/80 drop-shadow-md">
                В прямом эфире
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLiveNow && (
              <button
                onClick={() => setIsLivePlayerOpenFromStory(true)}
                className="group/live flex h-10 animate-pulse items-center gap-2.5 rounded-2xl bg-red-500 px-4 text-white shadow-[0_8px_20px_-4px_rgba(239,68,68,0.5)] transition-all hover:bg-red-600 active:scale-95"
              >
                <div className="relative">
                  <Radio className="relative z-10 h-4 w-4" />
                  <div className="absolute inset-0 scale-150 animate-ping rounded-full bg-white opacity-20" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                  Смотреть эфир
                </span>
              </button>
            )}

            {products.length > 0 && mode !== 'simple' && !isLiveNow && mode !== 'invitation' && (
              <Button
                onClick={() => setShowProducts(!showProducts)}
                className={cn(
                  'h-9 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all',
                  showProducts
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'animate-pulse bg-[#22c55e] text-white hover:bg-[#16a34a]'
                )}
              >
                <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                {showProducts ? 'Скрыть' : mode === 'gallery' ? 'Смотреть фото' : 'Показать'}
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-10 left-8 right-8 space-y-4 text-white">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                className={cn(
                  'border-none text-[8px] font-black uppercase tracking-widest',
                  isLiveNow ? 'bg-red-500 text-white' : 'bg-white/20 text-white/80'
                )}
              >
                {isLiveNow ? 'Live' : 'Story'}
              </Badge>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
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
                  setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
                }}
                className="group/like flex flex-col items-center gap-1 transition-transform active:scale-90"
              >
                <Heart
                  className={cn(
                    'h-7 w-7 transition-all',
                    isLiked
                      ? 'scale-110 fill-red-500 text-red-500'
                      : 'text-white group-hover/like:scale-110'
                  )}
                />
                <span className="text-[10px] font-black">{likesCount}</span>
              </button>
              <button
                onClick={handleShare}
                className="group/msg flex flex-col items-center gap-1 transition-transform active:scale-90"
              >
                <Send className="h-7 w-7 -rotate-12 text-white group-hover/msg:scale-110" />
                <span className="text-[10px] font-black">Поделиться</span>
              </button>
              {isUGC ? (
                <button
                  onClick={handleSendGift}
                  className="group/gift flex flex-col items-center gap-1 transition-transform active:scale-90"
                >
                  <Sparkles className="h-7 w-7 text-white group-hover/gift:scale-110" />
                  <span className="text-[10px] font-black">Подарок</span>
                </button>
              ) : (
                <button
                  onClick={handleJoinRaffle}
                  className="group/raffle flex flex-col items-center gap-1 transition-transform active:scale-90"
                >
                  <Ticket className="h-7 w-7 text-white group-hover/raffle:scale-110" />
                  <span className="text-[10px] font-black uppercase">Розыгрыш</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onPrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 active:scale-90"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={onNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 active:scale-90"
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
