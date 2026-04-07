import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, Star, Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    statsPeriod: string;
    setStatsPeriod: (period: any) => void;
    currentBrandStats: any[];
    brandMedalsByPeriod: Record<string, any[]>;
    setIsBrandReviewsOpen: (open: boolean) => void;
}

export function StatsDialog({ 
    isOpen, 
    onOpenChange, 
    statsPeriod, 
    setStatsPeriod, 
    currentBrandStats, 
    brandMedalsByPeriod,
    setIsBrandReviewsOpen 
}: StatsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden rounded-xl p-0 border-none bg-background shadow-2xl flex flex-col">
                <DialogHeader className="p-4 pb-6 bg-muted/5 shrink-0 border-b border-muted/10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <DialogTitle className="text-base font-black tracking-tighter uppercase flex items-center gap-3">
                                <TrendingUp className="h-8 w-8 text-accent" />
                                Показатели бренда
                            </DialogTitle>
                            <DialogDescription className="text-base font-medium">
                                Аналитика на основе реальных отзывов и данных экосистемы Syntha
                            </DialogDescription>
                        </div>
                        <div className="flex bg-muted/50 p-1 rounded-xl border shadow-sm shrink-0">
                            {[
                                { label: 'Месяц', value: 'month' },
                                { label: '6 мес.', value: '6months' },
                                { label: 'Год', value: 'year' },
                                { label: 'Все', value: 'all' }
                            ].map(p => (
                                <Button
                                    key={p.value}
                                    variant={statsPeriod === p.value ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={cn(
                                        "h-8 px-4 text-[10px] font-black uppercase rounded-lg transition-all",
                                        statsPeriod === p.value ? "bg-black text-white shadow-md" : "text-muted-foreground"
                                    )}
                                    onClick={() => setStatsPeriod(p.value as any)}
                                >
                                    {p.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </DialogHeader>

                <TooltipProvider>
                    <div className="flex-1 overflow-y-auto p-4 space-y-10 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                            {(currentBrandStats || []).map(stat => (
                                <div key={stat.id} className="space-y-2 group">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted/30 rounded-xl text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                                {stat.icon}
                                            </div>
                                            <span className="text-sm font-bold text-foreground/80">{stat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                                            <span className="text-base font-black">{stat.score.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-accent transition-all duration-1000 ease-out" 
                                            style={{ width: `${(stat.score / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-accent" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Заслуги и достижения за период</h4>
                                </div>
                                <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-50">Наведите на кубок для деталей</div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 items-start">
                                {(brandMedalsByPeriod?.[statsPeriod] || []).map((medal, i) => (
                                    <Tooltip key={i} delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center gap-2 group/cup cursor-help">
                                                <div className={cn(
                                                    "relative h-10 w-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 group-hover/cup:-translate-y-1",
                                                    medal.type === 'gold' ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950" :
                                                    medal.type === 'silver' ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900" :
                                                    "bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950"
                                                )}>
                                                    <Trophy className="h-7 w-7 drop-shadow-md" />
                                                    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover/cup:opacity-100 transition-opacity" />
                                                    <div className="absolute -top-1 -right-1 bg-white h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-current shadow-sm">
                                                        {medal.rank}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-foreground uppercase tracking-tight leading-none">{medal.date}</p>
                                                    <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1 opacity-60">{medal.id.includes('_') ? medal.id.split('_')[0] : medal.id}</p>
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent 
                                            className="bg-black text-white border-none p-4 rounded-2xl shadow-2xl max-w-xs animate-in zoom-in-95 duration-200" 
                                            side="top" 
                                            sideOffset={10}
                                            collisionPadding={10}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-lg flex items-center justify-center",
                                                        medal.type === 'gold' ? "bg-yellow-500/20 text-yellow-500" :
                                                        medal.type === 'silver' ? "bg-slate-500/20 text-slate-400" :
                                                        "bg-orange-500/20 text-orange-500"
                                                    )}>
                                                        <Trophy className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Лидер рейтинга</p>
                                                        <p className="text-sm font-black uppercase text-white">{medal.rank} МЕСТО</p>
                                                    </div>
                                                </div>
                                                <Separator className="bg-white/10" />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-white/90">Параметр: <span className="text-accent">{medal.name}</span></p>
                                                    <p className="text-[10px] text-white/60 leading-relaxed">
                                                        Бренд признан одним из лучших в категории <span className="text-white font-bold">{medal.category}</span> за период <span className="text-white font-bold">{medal.date}</span>.
                                                    </p>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                {(brandMedalsByPeriod?.[statsPeriod] || []).length === 0 && (
                                    <div className="w-full py-12 text-center bg-muted/10 rounded-3xl border border-dashed border-muted-foreground/20">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-40">Достижений за этот период пока нет</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-black/5 rounded-2xl border border-black/5">
                                <p className="text-[9px] font-bold text-muted-foreground leading-relaxed italic">
                                    * Эти достижения подтверждают статус «Platinum Partner» with эксклюзивными условиями продвижения в экосистеме Syntha.
                                </p>
                            </div>
                        </div>
                    </div>
                </TooltipProvider>
                
                <div className="p-4 border-t border-muted/10 bg-muted/5 rounded-b-[2.5rem] flex justify-center shrink-0">
                    <Button 
                        variant="link" 
                        className="text-accent font-black uppercase text-[11px] tracking-widest hover:translate-x-2 transition-all"
                        onClick={() => {
                            onOpenChange(false);
                            setIsBrandReviewsOpen(true);
                        }}
                    >
                        Перейти к подробным отзывам <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
