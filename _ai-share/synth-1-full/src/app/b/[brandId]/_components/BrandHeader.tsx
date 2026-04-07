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
    Youtube 
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
    toast
}: BrandHeaderProps) {
    return (
        <header className="mb-4 flex flex-col md:flex-row items-center md:items-start gap-3 border-b border-slate-100 pb-4 max-w-5xl mx-auto animate-in fade-in duration-700">
            {displaySettings.logo && (
                <div className="relative group shrink-0">
                    {/* Logo with Story Ring */}
                    <button 
                        onClick={() => storyImages.length > 0 && handleOpenStory(storyImages[0], storyImages)} 
                        className="relative w-24 h-24 rounded-full group/logo transition-all active:scale-95 shadow-xl hover:shadow-indigo-100/50"
                    >
                        <div className={cn(
                            "absolute -inset-1 rounded-full border-2 border-transparent transition-all duration-500",
                            storyImages.length > 0 ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-background animate-pulse-slow border-indigo-500/50" : "group-hover/logo:border-indigo-500/30"
                        )}></div>
                        <div className="relative w-full h-full rounded-full overflow-hidden border border-slate-200 bg-white p-2 shadow-inner">
                            <Image
                                src={brand.logo.url}
                                alt={brand.logo.alt}
                                fill
                                className="object-contain p-2 relative z-10 transition-transform group-hover/logo:scale-110 duration-500"
                                data-ai-hint={brand.logo.hint}
                                sizes="96px"
                            />
                        </div>
                    </button>

                    {/* Rating & Reviews Trigger */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 whitespace-nowrap group/trigger">
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsBrandReviewsOpen(true);
                            }}
                            className="bg-slate-900 text-white shadow-lg rounded-full px-3 py-1 flex items-center gap-2 cursor-pointer hover:bg-indigo-600 transition-all hover:scale-105 border border-white/10"
                        >
                            <div className="flex items-center gap-1">
                                <Star className="h-2.5 w-2.5 text-amber-400 fill-current" />
                                <span className="text-[10px] font-bold">{brandReviews.average}</span>
                            </div>
                            <div className="w-[1px] h-2 bg-white/20" />
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">{brandReviews.count} REVIEWS</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsStatsDialogOpen(true);
                            }}
                            className="h-6 w-6 rounded-full bg-white shadow-md border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        >
                            <TrendingUp className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}
            <div className="flex-1 text-center md:text-left pt-6 md:pt-2 space-y-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[8px] px-2 h-5 gap-1 tracking-widest shadow-sm transition-all uppercase">
                           <Building className="h-2.5 w-2.5" /> VERIFIED PARTNER
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-bold text-[8px] px-2 h-5 tracking-widest shadow-sm uppercase">
                           EST. 2012
                        </Badge>
                    </div>
                    {displaySettings.name && <h1 className="font-headline text-2xl md:text-4xl font-bold tracking-tight uppercase text-slate-900 leading-none mb-2">{displayName}</h1>}
                </div>
                {displaySettings.description && brand.description && (
                    <p className="text-sm md:text-base text-slate-500 font-medium tracking-tight leading-relaxed max-w-xl mx-auto md:mx-0 opacity-90">
                        {brand.description}
                    </p>
                )}
                
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                    {brand.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all cursor-default border-none rounded-md">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3 min-w-[220px]">
                <div className="flex items-center gap-2 w-full max-w-[200px]">
                    {displaySettings.action_button && (
                        <Button 
                            size="sm" 
                            className={cn(
                                "h-8 flex-1 rounded-lg transition-all duration-300 font-bold uppercase text-[9px] tracking-widest shadow-lg",
                                isFollowed ? "bg-slate-100 text-slate-400 hover:bg-slate-200 shadow-none border border-slate-200" : "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100/50"
                            )}
                            onClick={() => {
                                if (!isFollowed) {
                                    setAnimatedFollowers(prev => prev + 1);
                                } else {
                                    setAnimatedFollowers(prev => Math.max(0, prev - 1));
                                }
                                setIsFollowed(!isFollowed);
                            }}
                        >
                            {isFollowed ? <Check className="mr-1.5 h-3 w-3" /> : <Plus className="mr-1.5 h-3 w-3"/>}
                            {isFollowed ? 'FOLLOWING' : 'FOLLOW BRAND'}
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        className={cn(
                            "w-8 h-8 p-0 rounded-lg border transition-all duration-300 shadow-sm shrink-0",
                            isFavorite ? "border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-rose-100/50" : "hover:bg-slate-50 border-slate-200 text-slate-400"
                        )}
                        onClick={() => {
                            setIsFavorite(!isFavorite);
                            toast({
                                title: !isFavorite ? "Curated to Favorites" : "Removed from Curation",
                                description: !isFavorite ? `${displayName} is now prioritized in your neural feed.` : `${displayName} affinity has been reset.`
                            });
                        }}
                    >
                        <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-current")} />
                    </Button>
                </div>

                {storefrontSettings.showActivePromo && brandActivePromo && (
                    <Card className="p-2.5 bg-white w-full max-w-[200px] rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden group/promo hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 p-1">
                            <Tag className="h-3 w-3 text-indigo-600/20 rotate-12 group-hover/promo:text-indigo-600/40 transition-colors" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest leading-none">Access Protocol</p>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-mono font-bold text-xs text-indigo-600 uppercase tracking-tighter tabular-nums">{brandActivePromo.code}</p>
                                <button 
                                    className="h-5 w-5 flex items-center justify-center rounded-md hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 transition-all shadow-sm border border-transparent hover:border-indigo-100" 
                                    onClick={() => {
                                        navigator.clipboard.writeText(brandActivePromo.code);
                                        toast({title: "Protocol Copied"});
                                    }}
                                >
                                    <Copy className="h-2.5 w-2.5" />
                                </button>
                            </div>
                            <p className="text-[8px] font-bold text-emerald-600 mt-0.5 uppercase tracking-widest italic opacity-80">{brandActivePromo.expiry}</p>
                        </div>
                    </Card>
                )}

                {/* Loyalty Progress Tracker */}
                <Card className="p-3 bg-slate-900 rounded-xl shadow-xl relative overflow-hidden group/loyalty max-w-[200px] w-full border border-slate-800">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Trophy className="h-10 w-10 text-amber-400" />
                    </div>
                    <div className="relative space-y-2.5">
                        <div className="flex flex-col gap-1">
                            <p className="text-[8px] uppercase font-bold text-white/30 tracking-[0.2em] leading-none">ENTITY STATUS</p>
                            <div className="flex items-center gap-1.5">
                                <h4 className="text-[10px] font-bold text-white uppercase tracking-tighter">Elite Merchant</h4>
                                <Badge className="h-3.5 bg-amber-400 text-slate-900 text-[7px] font-bold border-none px-1 uppercase tracking-widest">LVL 2</Badge>
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end">
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">TO NEXT TIER</span>
                                <span className="text-[9px] font-bold text-white tabular-nums tracking-tighter italic">45.2K ₽</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-indigo-600 shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Personal Brand Stylist */}
                <button 
                    className="w-full max-w-[200px] h-10 rounded-xl bg-white border border-slate-200 hover:border-indigo-100 shadow-sm hover:shadow-md transition-all group/stylist overflow-hidden relative p-1.5 flex items-center gap-2"
                    onClick={() => setIsMessageDialogOpen(true)}
                >
                    <div className="absolute inset-0 bg-indigo-50/50 translate-y-full group-hover/stylist:translate-y-0 transition-transform duration-500" />
                    <div className="relative flex items-center gap-2 w-full">
                        <div className="relative shrink-0">
                            <div className="h-7 w-7 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shadow-inner group-hover/stylist:border-indigo-200 transition-colors">
                                <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" alt="Stylist" width={28} height={28} className="object-cover" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="text-[7px] font-bold uppercase text-indigo-600 tracking-widest leading-none mb-0.5 italic">PROTOCOL ACTIVE</p>
                            <p className="text-[9px] font-bold uppercase tracking-tight text-slate-900 truncate">Strategic Concierge</p>
                        </div>
                    </div>
                </button>
            </div>
        </header>
    );
}
