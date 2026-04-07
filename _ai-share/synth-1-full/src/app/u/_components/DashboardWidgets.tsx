import React from 'react';
import Image from 'next/image';
import { Sparkles, Info, Brain, Plus, TrendingDown, Gift, Zap, Rocket, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function RecommendationCard({ item }: { item: any }) {
    const badge = item.type === 'promo' 
        ? { label: 'Promo', color: 'bg-blue-600 shadow-blue-600/20' }
        : item.type === 'points'
        ? { label: 'Points', color: 'bg-purple-600 shadow-purple-600/20' }
        : item.oldPrice
        ? { label: 'Outlet', color: 'bg-zinc-800 shadow-zinc-800/20' }
        : null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="group cursor-pointer space-y-2 animate-in zoom-in-95 duration-500">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                        <Image 
                            src={item.img} 
                            alt={item.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg text-[9px] font-bold shadow-sm flex items-center gap-1 border border-indigo-100">
                            <Sparkles className="h-2.5 w-2.5 text-indigo-600" />
                            {item.match}%
                        </div>
                        {badge && (
                            <div className={cn(
                                "absolute top-2 left-2 text-white px-1.5 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest shadow-lg",
                                badge.color
                            )}>
                                {badge.label}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                            <Button size="sm" variant="accent" className="w-full h-7 text-[9px] font-bold uppercase rounded-lg shadow-lg shadow-indigo-600/20 bg-white text-slate-900 hover:bg-slate-50 border-none">
                                Quick View
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-0.5 px-0.5">
                        <div className="flex justify-between items-start gap-2">
                            <div className="text-[8px] uppercase font-bold text-slate-400 tracking-widest leading-none">{item.brand}</div>
                            <div className="text-[10px] font-bold text-slate-900 tabular-nums leading-none">
                                {item.type === 'points' ? item.pointsPrice : item.price}
                            </div>
                        </div>
                        <h4 className="text-[11px] font-bold truncate text-slate-800 uppercase tracking-tight">{item.name}</h4>
                        <div className="pt-0.5">
                            <div className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                AI Match Logic
                                <Info className="h-2 w-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-md overflow-hidden rounded-xl border border-slate-100 p-0 shadow-2xl bg-white">
                <div className="relative h-56 w-full">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                    <div className="absolute bottom-3 left-5 right-5">
                        <Badge className="bg-indigo-600 text-[8px] font-bold uppercase tracking-widest px-2 h-5 mb-1.5 shadow-lg border-none">Style DNA Match: {item.match}%</Badge>
                        <DialogHeader>
                            <DialogTitle className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none drop-shadow-sm">{item.name}</DialogTitle>
                        </DialogHeader>
                    </div>
                </div>
                <div className="p-3 space-y-5">
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-indigo-600 tracking-widest">
                            <Brain className="h-3.5 w-3.5" />
                            AI Intelligence Summary
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed italic border-l-2 border-indigo-100 pl-3 py-0.5 opacity-80">
                            {item.type === 'promo' 
                                ? `"Found in your wishlist. Personal promo ${item.promo} applied for maximum leverage today."`
                                : item.type === 'points'
                                ? `"High-yield points redemption available. Strategic value optimized for your capital profile."`
                                : `"Aligns with 'Minimalism' Style DNA. 90% palette overlap with your recent Syntha acquisitions."`
                            }
                        </p>
                    </div>
                    
                    {item.type === 'promo' && (
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between shadow-sm">
                            <div>
                                <div className="text-[8px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Voucher Code</div>
                                <div className="text-base font-mono font-bold text-blue-900 tracking-wider uppercase">{item.promo}</div>
                            </div>
                            <Button size="sm" variant="outline" className="h-7 border-blue-200 text-blue-600 hover:bg-blue-100 text-[9px] font-bold uppercase rounded-lg">Copy</Button>
                        </div>
                    )}

                    {item.type === 'points' && (
                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between shadow-sm">
                            <div>
                                <div className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">Points Value</div>
                                <div className="text-base font-bold text-indigo-900 tabular-nums">{item.pointsPrice} <span className="text-[10px] opacity-60">+ 1,200 pts</span></div>
                            </div>
                            <Badge className="bg-indigo-600 text-[8px] font-bold uppercase px-2 h-5 tracking-widest">Available</Badge>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-inner group/stat hover:bg-white hover:border-indigo-100 transition-all">
                            <div className="text-[8px] uppercase font-bold text-slate-400 tracking-widest mb-1 group-hover/stat:text-indigo-600 transition-colors">Style Synergy</div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1 uppercase tracking-tight">
                                <Plus className="h-2.5 w-2.5 text-emerald-500" />
                                {item.synergy} combinations
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-inner group/stat hover:bg-white hover:border-indigo-100 transition-all">
                            <div className="text-[8px] uppercase font-bold text-slate-400 tracking-widest mb-1 group-hover/stat:text-indigo-600 transition-colors">Economic Benefit</div>
                            <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                                {item.benefit}
                            </div>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-inner group/stat hover:bg-white hover:border-indigo-100 transition-all">
                        <div className="text-[8px] uppercase font-bold text-slate-400 tracking-widest mb-1 group-hover/stat:text-indigo-600 transition-colors">Market Rarity</div>
                        <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.rarity}</div>
                    </div>
                    <Button className="w-full h-10 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] shadow-xl shadow-indigo-600/20 bg-slate-900 text-white hover:bg-indigo-600 transition-all border-none">
                        {item.type === 'points' ? `Redeem Points — ${item.pointsPrice}` : `Add to Inventory — ${item.price}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function OfferCoupon({ type, brand, title, desc, expiry, color }: any) {
    const colors: any = {
        emerald: "from-emerald-50/50 to-teal-50/50 border-emerald-100 text-emerald-900 hover:border-emerald-300",
        accent: "from-indigo-50/50 to-indigo-100/50 border-indigo-100 text-indigo-900 hover:border-indigo-300",
        purple: "from-purple-50/50 to-indigo-50/50 border-purple-100 text-purple-900 hover:border-purple-300",
        indigo: "from-indigo-50/50 to-blue-50/50 border-indigo-100 text-indigo-900 hover:border-indigo-300",
    };

    const iconColors: any = {
        emerald: "bg-emerald-500/10 text-emerald-600 shadow-inner border border-emerald-100/50",
        accent: "bg-indigo-500/10 text-indigo-600 shadow-inner border border-indigo-100/50",
        purple: "bg-purple-500/10 text-purple-600 shadow-inner border border-purple-100/50",
        indigo: "bg-indigo-500/10 text-indigo-600 shadow-inner border border-indigo-100/50",
    };

    const style = colors[color] || colors.accent;
    const iconStyle = iconColors[color] || iconColors.accent;
    const Icon = type === 'discount' ? TrendingDown : type === 'gift' ? Gift : type === 'promo' ? Zap : Rocket;

    return (
        <div className={cn(
            "relative group rounded-xl border bg-gradient-to-br p-4 transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden",
            style
        )}>
            {/* Coupon Perforation Effect */}
            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-white rounded-full -translate-y-1/2 shadow-inner border border-slate-100" />
            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white rounded-full -translate-y-1/2 shadow-inner border border-slate-100" />
            
            <div className="flex gap-3.5 relative z-10">
                <div className={cn("p-2.5 rounded-lg shrink-0 h-fit transition-transform group-hover:scale-110 duration-500", iconStyle)}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5 pr-2 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 opacity-80 truncate mr-2">{brand}</span>
                        <div className="flex items-center gap-1 text-[8px] font-bold text-indigo-600 uppercase tracking-widest shrink-0">
                            <Clock className="h-2.5 w-2.5" />
                            {expiry}
                        </div>
                    </div>
                    <h4 className="text-[13px] font-bold font-headline tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight opacity-70 truncate">{desc}</p>
                </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mr-2 -mt-2 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110">
                <Icon className="h-24 w-24" />
            </div>
        </div>
    );
}
