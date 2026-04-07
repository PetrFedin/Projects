import React from 'react';
import { Brain, Sparkles, TrendingUp, List, Check, Trophy, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizResultsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    quizResults: any;
    displayName: string;
    setIsUpgradeRequested: (requested: boolean) => void;
    isUpgradeRequested: boolean;
    toast: any;
}

export function QuizResultsDialog({ 
    isOpen, 
    onOpenChange, 
    quizResults = {}, 
    displayName, 
    setIsUpgradeRequested, 
    isUpgradeRequested, 
    toast 
}: QuizResultsDialogProps) {
    if (!quizResults || Object.keys(quizResults).length === 0) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl rounded-xl p-0 border-none bg-background shadow-2xl overflow-hidden">
                <div className="bg-black p-3 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                        <Brain className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10">
                        <Badge className="bg-accent text-white border-none mb-4 text-[10px] font-black uppercase tracking-widest px-3 py-1">AI Brand Analysis</Badge>
                        <h2 className="text-sm font-black tracking-tighter uppercase leading-none mb-2">
                            Результаты <br/>
                            <span className="text-accent">Аудита Syntha</span>
                        </h2>
                        <p className="text-white/60 font-medium text-sm max-w-md mt-4 leading-relaxed">
                            На основе данных платформы и анализа позиционирования {displayName}
                        </p>
                    </div>
                </div>

                <div className="p-3 space-y-10 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Архетип бренда</h4>
                                <div className="p-4 rounded-3xl bg-muted/5 border-2 border-dashed border-accent/20">
                                    <h3 className="text-sm font-black uppercase tracking-tight mb-2">{quizResults.archetype}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">
                                        {quizResults.description}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Текущий сегмент</h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 p-4 rounded-2xl bg-muted/10 text-center">
                                        <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Сейчас</p>
                                        <p className="text-xs font-black uppercase">{quizResults.segment}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-accent" />
                                    <div className="flex-1 p-4 rounded-2xl bg-accent/10 text-center border border-accent/20">
                                        <p className="text-[8px] font-black uppercase text-accent mb-1">Цель</p>
                                        <p className="text-xs font-black uppercase text-accent">{quizResults.targetSegment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4">Сильные стороны (AI Score)</h4>
                                <div className="space-y-6">
                                    {quizResults.traits.map((trait: any) => (
                                        <div key={trait.name} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs font-black uppercase tracking-tight">{trait.name}</span>
                                                <span className="text-sm font-black text-accent">{trait.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${trait.value}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className="h-full bg-accent"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Card className="p-4 bg-accent/5 border-none rounded-3xl">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-sm uppercase tracking-tight mb-1">Рекомендация AI</h5>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                                            Для перехода в сегмент Heritage необходимо усилить блок «История и Прозрачность» через публикацию BTS-контента.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent text-center">Дорожная карта развития</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {quizResults.roadmap.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/5 group hover:bg-muted/10 transition-all">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border-2",
                                        item.status === 'completed' ? "bg-green-500 border-green-500 text-white" :
                                        item.status === 'in_progress' ? "border-accent text-accent animate-pulse" :
                                        "border-muted-foreground/20 text-muted-foreground"
                                    )}>
                                        {item.status === 'completed' ? <Check className="h-5 w-5" /> : <span className="text-xs font-black">{idx + 1}</span>}
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-black text-xs uppercase tracking-wider">{item.stage}</h5>
                                        <p className="text-[10px] text-muted-foreground font-medium">{item.description}</p>
                                    </div>
                                    <Badge variant="outline" className={cn(
                                        "text-[7px] font-black uppercase",
                                        item.status === 'completed' ? "text-green-600 border-green-200 bg-green-50" :
                                        item.status === 'in_progress' ? "text-accent border-accent/30 bg-accent/5" :
                                        "text-muted-foreground border-muted/20"
                                    )}>
                                        {item.status === 'completed' ? 'Готово' : item.status === 'in_progress' ? 'В процессе' : 'В планах'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-muted/5 border-t border-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-tight">Статус: Rising Star</p>
                            <p className="text-[10px] font-bold text-muted-foreground">До следующего уровня: 120 XP</p>
                        </div>
                    </div>
                    <Button 
                        className="rounded-2xl h-12 px-10 text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-accent transition-all shadow-xl"
                        onClick={() => {
                            setIsUpgradeRequested(true);
                            toast({
                                title: "Заявка принята!",
                                description: "Эксперт Syntha свяжется with вами для проведения глубокого аудита.",
                            });
                        }}
                        disabled={isUpgradeRequested}
                    >
                        {isUpgradeRequested ? 'Заявка отправлена' : 'Запросить глубокий аудит'}
                    </Button>
                </div>
                
                <DialogFooter className="p-4 bg-muted/30 border-t border-muted/10 shrink-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Info className="h-3 w-3" /> Анализ обновлен: {new Date().toLocaleDateString('ru-RU')}
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
