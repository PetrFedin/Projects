'use client';

import React from 'react';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, Zap, Activity, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnalysisDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brandName: string;
    brandId: string;
    viewRole: 'client' | 'b2b';
}

export function AnalysisDialog({ isOpen, onOpenChange, brandName, brandId, viewRole }: AnalysisDialogProps) {
    // Deterministic mock data for analysis
    const getDeterministicValue = (id: string, min: number, max: number, seed: number) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return min + (Math.abs(hash + seed) % (max - min));
    };

    const matchScore = getDeterministicValue(brandId, 85, 99, 123);
    const growthPotential = getDeterministicValue(brandId, 70, 95, 456);
    const demandScore = getDeterministicValue(brandId, 60, 98, 789);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <div className="p-4">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-accent-primary flex items-center justify-center text-white shadow-xl shadow-accent-primary/20">
                                <Brain className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-black tracking-tighter uppercase">
                                    {viewRole === 'client' ? "Анализ Мэтчинга" : "Анализ Перспектив"}
                                </DialogTitle>
                                <DialogDescription className="text-sm font-medium">
                                    Отчет системы Syntha OS для бренда <span className="text-accent-primary font-bold">{brandName}</span>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {viewRole === 'client' ? (
                        /* B2C Analysis Content */
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 rounded-3xl bg-bg-surface2 border border-border-subtle text-center">
                                    <span className="text-sm font-black text-accent-primary">{matchScore}%</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 text-center">Style Match</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-bg-surface2 border border-border-subtle text-center">
                                    <span className="text-sm font-black text-text-primary">A+</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 text-center">Vibe Rank</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-bg-surface2 border border-border-subtle text-center">
                                    <span className="text-sm font-black text-state-success">High</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 text-center">Compatibility</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-primary flex items-center gap-2">
                                    <Sparkles className="h-3 w-3" /> Почему этот бренд вам подходит:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { icon: Heart, label: "Соответствие вашему стилю", value: "98%" },
                                        { icon: Target, label: "Match по цветовой палитре", value: "92%" },
                                        { icon: ShieldCheck, label: "Предпочтения по материалам", value: "100%" },
                                        { icon: Zap, label: "Актуальность для гардероба", value: "High" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-accent-primary/5 border border-accent-primary/10">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-accent-primary shadow-sm">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter leading-none mb-1">{item.label}</p>
                                                <p className="text-xs font-black text-text-primary">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 blur-3xl -mr-16 -mt-16" />
                                <p className="text-xs font-medium leading-relaxed relative z-10 italic">
                                    «Система проанализировала ваши последние покупки и лайки. Эстетика {brandName} идеально дополняет ваш текущий вектор стиля, особенно в части базовых слоев и аксессуаров.»
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* B2B Analysis Content */
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 rounded-3xl bg-bg-surface2 border border-border-subtle text-center">
                                    <span className="text-sm font-black text-state-success">{growthPotential}%</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 text-center">Growth Potential</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-bg-surface2 border border-border-subtle text-center">
                                    <span className="text-sm font-black text-text-primary">{demandScore}%</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 text-center">Market Demand</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-bg-surface2 border border-border-subtle text-center">
                                    <span className="text-sm font-black text-accent-primary">4.8</span>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1 text-center">BPI Index</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-primary flex items-center gap-2">
                                    <Activity className="h-3 w-3" /> Аналитика для бизнеса:
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { icon: TrendingUp, label: "ROI Прогноз", value: "+24% годовых" },
                                        { icon: ShieldCheck, label: "Надежность поставок", value: "99.2%" },
                                        { icon: Target, label: "Региональный дефицит", value: "Высокий" },
                                        { icon: Zap, label: "Ликвидность стока", value: "Excellent" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-bg-surface2 border border-border-subtle">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-accent-primary shadow-sm border border-border-subtle">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter leading-none mb-1">{item.label}</p>
                                                <p className="text-xs font-black text-text-primary">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-3xl border-2 border-dashed border-accent-primary/20 bg-accent-primary/5">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-accent-primary mb-2">Заключение AI-Байера:</h5>
                                <p className="text-xs font-medium leading-relaxed text-text-secondary">
                                    «Бренд демонстрирует устойчивый рост в сегменте Contemporary. В вашем регионе наблюдается неудовлетворенный спрос на позиции данной ценовой категории. Рекомендуется рассмотреть партнерство для закрытия ниши базового трикотажа.»
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex gap-3">
                        <Button 
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-10 bg-bg-surface2 hover:bg-bg-surface border border-border-strong text-text-primary rounded-2xl font-mono text-[10px] uppercase tracking-widest transition-all"
                        >
                            Закрыть
                        </Button>
                        <Button 
                            className="flex-1 h-10 button-glimmer button-professional !bg-black hover:!bg-black shadow-xl shadow-slate-200/50 border-none rounded-2xl font-mono text-[10px] uppercase tracking-widest transition-all"
                        >
                            {viewRole === 'client' ? "Добавить в избранное" : "Обсудить условия"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
