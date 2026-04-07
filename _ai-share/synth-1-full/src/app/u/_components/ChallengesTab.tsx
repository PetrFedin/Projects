'use client';

import React, { useState } from 'react';
import { Trophy, Plus, Upload, Check, Camera, Image as ImageIcon, Sparkles, Clock, Users, ArrowRight, Target, Brain, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { lookboards } from '@/lib/lookboards';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export function ChallengesTab() {
    const { lookboards: userLookboards } = useUIState();
    const displayLookboards = userLookboards.length > 0 ? userLookboards : lookboards;
    const [selectedLookId, setSelectedLookId] = useState<string | null>(null);
    const [step, setStep] = useState<'browse' | 'submit'>('browse');

    const pastChallenges = [
        { id: 'c1', title: 'Cyber-Minimalism', date: 'Dec 2025', rank: 'Top 10%', status: 'Completed', result: '150 pts' },
        { id: 'c2', title: 'Winter Layers', date: 'Nov 2025', rank: 'Top 25%', status: 'Completed', result: '50 pts' }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-10">
            {/* Active Challenge Banner - Redesigned to match Syntha Business banner style */}
            <Card className="bg-slate-900 border-none rounded-xl overflow-hidden relative min-h-[400px] flex items-center shadow-2xl group/banner">
                <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                    <img 
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000" 
                        alt="Fashion Challenge" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                
                <CardContent className="relative z-10 p-4 space-y-4 max-w-4xl text-white w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <Badge className="bg-amber-500 text-white border-none font-black text-[10px] uppercase px-3 py-1">Active Challenge</Badge>
                        <Badge variant="outline" className="text-white border-white/20 text-[8px] font-black uppercase px-2 py-0.5 tracking-widest">Global Event</Badge>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-sm md:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                            FW26: STYLE<br />SYNTHESIS
                        </h2>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed italic max-w-xl border-l-2 border-amber-500/50 pl-6">
                            "Создайте образ, объединяющий высокие технологии и классический крой. Победитель получит грант на запуск собственной капсулы."
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Приз</p>
                                <p className="text-sm font-black text-white tabular-nums">500k ₽</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Участники</p>
                                <p className="text-sm font-black text-white tabular-nums">1,240</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Осталось</p>
                                <p className="text-sm font-black text-amber-400 tabular-nums">14д</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Рейтинг</p>
                                <p className="text-sm font-black text-white uppercase tracking-tight">Top 5%</p>
                            </div>
                        </div>
                        
                        <div className="hidden sm:block w-px h-12 bg-white/10 mx-4" />

                        <Button 
                            onClick={() => {
                                const el = document.getElementById('participation-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="button-glimmer button-professional !bg-white !text-black shadow-2xl border-none px-12 h-10 rounded-2xl w-full lg:w-auto font-black uppercase tracking-widest text-[11px] group/btn transition-all hover:scale-105"
                        >
                            Участвовать
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div id="participation-section" className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Main Action Area */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-3">
                            <div className="space-y-2">
                                <h3 className="text-base font-black uppercase tracking-tighter text-slate-900">Принять участие</h3>
                                <p className="text-slate-400 font-medium max-w-md">Ваш образ будет оценен Neural Engine и экспертным сообществом.</p>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                                <Button 
                                    variant="ghost"
                                    onClick={() => setStep('browse')}
                                    className={cn(
                                        "h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                                        step === 'browse' ? "bg-white text-slate-900 shadow-sm" : "text-muted-foreground hover:bg-white/50"
                                    )}
                                >
                                    Из лукбордов
                                </Button>
                                <Button 
                                    variant="ghost"
                                    onClick={() => setStep('submit')}
                                    className={cn(
                                        "h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                                        step === 'submit' ? "bg-white text-slate-900 shadow-sm" : "text-muted-foreground hover:bg-white/50"
                                    )}
                                >
                                    Загрузить фото
                                </Button>
                            </div>
                        </div>

                        {step === 'browse' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {displayLookboards.map((lb) => (
                                    <div 
                                        key={lb.id}
                                        onClick={() => setSelectedLookId(lb.id)}
                                        className={cn(
                                            "group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                                            selectedLookId === lb.id ? "border-slate-900 shadow-2xl scale-95" : "border-transparent bg-[#fcfcfc]"
                                        )}
                                    >
                                        <img 
                                            src={lb.coverImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800'} 
                                            alt={lb.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <p className="text-white font-black uppercase text-sm tracking-tight">{lb.title}</p>
                                            <p className="text-white/60 text-[10px] uppercase font-bold">{lb.itemsCount} предметов</p>
                                        </div>
                                        {selectedLookId === lb.id && (
                                            <div className="absolute top-4 right-6 h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl animate-in zoom-in duration-300">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-white border border-dashed border-slate-200 flex flex-col items-center text-center space-y-4 shadow-sm">
                                <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center">
                                    <Upload className="h-10 w-10 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Загрузка образа</h4>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto"> Neural Engine автоматически распознает вещи на фото и определит их соответствие стилю.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button className="h-10 px-10 rounded-2xl bg-black text-white font-black uppercase text-[11px] tracking-widest shadow-xl button-glimmer">
                                        Выбрать файл
                                    </Button>
                                    <Button variant="outline" className="h-10 px-10 rounded-2xl border-slate-900 text-slate-900 font-black uppercase text-[11px] tracking-widest border-2">
                                        <Camera className="mr-2 h-4 w-4" /> Сделать фото
                                    </Button>
                                </div>
                            </div>
                        )}

                        {selectedLookId && step === 'browse' && (
                            <div className="flex justify-center pt-8 animate-in slide-in-from-bottom-4 duration-500">
                                <Button className="button-glimmer h-12 px-16 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl">
                                    Отправить на скоринг <Sparkles className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Stats and History */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="rounded-xl bg-white border shadow-sm p-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Award className="h-5 w-5" />
                            </div>
                            <h4 className="text-base font-black uppercase tracking-tight">Style Rating</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-muted-foreground">Community Power</span>
                                    <span>Top 12%</span>
                                </div>
                                <Progress value={88} className="h-1.5" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-muted-foreground">Neural Accuracy</span>
                                    <span>A+</span>
                                </div>
                                <Progress value={95} className="h-1.5" />
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Текущие бонусы за активность</p>
                            <p className="text-sm font-black text-slate-900">450 pts</p>
                        </div>
                    </Card>

                    <Card className="rounded-xl bg-white border shadow-sm p-4 space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">История участий</h4>
                        <div className="space-y-4">
                            {pastChallenges.map((c) => (
                                <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-900 transition-colors cursor-default">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black uppercase tracking-tight">{c.title}</p>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{c.date} • {c.rank}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-emerald-600">+{c.result}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Посмотреть весь архив</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
