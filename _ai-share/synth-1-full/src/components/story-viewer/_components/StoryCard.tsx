'use client';

import React from 'react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Radio, Heart, Send, Sparkles, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
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
        story, progress, isLiveNow, showProducts, setShowProducts, products, mode,
        isLiked, setIsLiked, likesCount, setLikesCount, handleShare, handleSendGift,
        handleJoinRaffle, onPrev, onNext, setIsLivePlayerOpen
    } = props;

    const isUGC = story.category === 'UGC' || story.id.includes('ugc') || story.id.includes('client');

    return (
        <div className="relative w-full max-w-md aspect-[9/16] shrink-0 group/story shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500">
            <AspectRatio ratio={9 / 16}>
                <Image 
                    src={story.imageUrl} 
                    alt={story.description} 
                    fill 
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 rounded-xl" />
                
                <div className="absolute top-4 left-6 right-6 flex gap-1 z-20">
                    <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="absolute top-3 left-6 right-6 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full border-2 border-accent p-0.5 bg-white overflow-hidden">
                            <Image src={story.imageUrl} alt="brand" width={40} height={40} className="object-cover" />
                        </div>
                        <div>
                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Live Feed</p>
                            <p className="text-white/80 text-[8px] font-bold uppercase">В прямом эфире</p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        {isLiveNow && (
                            <button onClick={() => setIsLivePlayerOpen(true)} className="h-10 px-4 bg-red-500 text-white rounded-2xl flex items-center gap-2.5 shadow-lg animate-pulse">
                                <Radio className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase">Смотреть эфир</span>
                            </button>
                        )}
                        {products.length > 0 && mode !== 'simple' && !isLiveNow && mode !== 'invitation' && (
                            <Button onClick={() => setShowProducts(!showProducts)} className={cn("rounded-xl h-9 px-4 font-black uppercase text-[10px] shadow-xl", showProducts ? "bg-white text-black" : "bg-[#22c55e] text-white animate-pulse")}>
                                <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                                {showProducts ? 'Скрыть' : 'Показать'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-10 left-8 right-8 text-white space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="border-none text-[8px] font-black uppercase bg-white/20 text-white/80">{isLiveNow ? 'Live' : 'Story'}</Badge>
                            <span className="text-[10px] font-black text-white/60 uppercase">{(story as any).viewers || '842'} зрителей</span>
                        </div>
                        <p className="text-white/80 text-xs mt-2 font-medium leading-relaxed">{story.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => { setIsLiked(!isLiked); setLikesCount((p: any) => isLiked ? p - 1 : p + 1); }} className="flex flex-col items-center gap-1">
                                <Heart className={cn("h-7 w-7 transition-all", isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white")} />
                                <span className="text-[10px] font-black">{likesCount}</span>
                            </button>
                            <button onClick={handleShare} className="flex flex-col items-center gap-1">
                                <Send className="h-7 w-7 text-white -rotate-12" />
                                <span className="text-[10px] font-black">Поделиться</span>
                            </button>
                            {isUGC ? (
                                <button onClick={handleSendGift} className="flex flex-col items-center gap-1"><Sparkles className="h-7 w-7 text-white" /><span className="text-[10px] font-black">Подарок</span></button>
                            ) : (
                                <button onClick={handleJoinRaffle} className="flex flex-col items-center gap-1"><Ticket className="h-7 w-7 text-white" /><span className="text-[10px] font-black uppercase">Розыгрыш</span></button>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <button onClick={onPrev} className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><ChevronLeft className="h-5 w-5 text-white" /></button>
                            <button onClick={onNext} className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10"><ChevronRight className="h-5 w-5 text-white" /></button>
                        </div>
                    </div>
                </div>
            </AspectRatio>
        </div>
    );
}
