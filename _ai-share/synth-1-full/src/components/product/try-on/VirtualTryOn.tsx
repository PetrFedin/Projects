'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Maximize2, User, Sparkles, AlertCircle, 
    CheckCircle2, RefreshCcw, Camera, 
    Zap, Info, Share2, Download,
    MousePointer2, Ruler, Thermometer,
    ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface VirtualTryOnProps {
    product: Product;
}

const AVATARS = [
    { id: 'av1', name: 'Athletic', desc: 'S / 178cm', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200' },
    { id: 'av2', name: 'Curvy', desc: 'M / 172cm', img: 'https://images.unsplash.com/photo-1581044777050-4c5161903c33?auto=format&fit=crop&q=80&w=200' },
    { id: 'av3', name: 'Petite', desc: 'XS / 162cm', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
];

export default function VirtualTryOn({ product }: VirtualTryOnProps) {
    const { toast } = useToast();
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [isFitting, setIsFitting] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [fitScore, setFitScore] = useState(92);

    const handleFit = () => {
        setIsFitting(true);
        setTimeout(() => {
            setIsFitting(false);
            setFitScore(Math.round(Math.random() * 10 + 85));
            toast({
                title: "Примерка завершена",
                description: "AI проанализировал посадку ткани на основе ваших мерок.",
            });
        }, 2000);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-3 animate-in fade-in duration-700">
            {/* Left: Fitting Canvas */}
            <div className="lg:col-span-7 space-y-6">
                <Card className="rounded-xl border-none shadow-2xl bg-slate-900 overflow-hidden relative aspect-[3/4] group">
                    {/* Simulated Fitting View */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={cn(
                            "relative w-full h-full transition-all duration-1000",
                            isFitting ? "blur-xl scale-110 opacity-50" : "blur-0 scale-100 opacity-100"
                        )}>
                            <Image 
                                src={product.images[0].url} 
                                alt="Fitting Preview" 
                                fill 
                                className={cn(
                                    "object-cover transition-all duration-700",
                                    showHeatmap ? "brightness-50 saturate-0" : "brightness-110 contrast-105"
                                )} 
                            />
                            {/* Heatmap Overlay Simulation */}
                            {showHeatmap && (
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/40 via-emerald-500/20 to-indigo-500/40 mix-blend-overlay animate-pulse" />
                            )}
                        </div>
                    </div>

                    {/* AI Loading State */}
                    {isFitting && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white space-y-6 bg-black/20 backdrop-blur-md">
                            <div className="relative">
                                <RefreshCcw className="h-12 w-12 animate-spin text-indigo-400" />
                                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-white animate-bounce" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-base font-black uppercase tracking-widest italic">Simulating Fabric Physics...</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Neural Engine Processing Cloth-Body Intersection</p>
                            </div>
                        </div>
                    )}

                    {/* Canvas Controls */}
                    <div className="absolute top-4 left-6 z-30 flex gap-2">
                        <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-black text-[10px] uppercase px-3 py-1">
                            {fitScore}% Fit Accuracy
                        </Badge>
                        <Badge className="bg-indigo-600 text-white border-none font-black text-[10px] uppercase px-3 py-1">
                            DLSS 3.0 Rendering
                        </Badge>
                    </div>

                    <div className="absolute bottom-6 inset-x-6 z-30 flex justify-between items-end">
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={cn(
                                    "h-12 px-6 rounded-2xl backdrop-blur-md border font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2",
                                    showHeatmap ? "bg-rose-500 border-none text-white shadow-lg shadow-rose-500/40" : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                )}
                            >
                                <Thermometer className="h-4 w-4" /> {showHeatmap ? "Hide Pressure Map" : "Pressure Heatmap"}
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                <Camera className="h-5 w-5" />
                            </button>
                            <button className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right: Configuration & Specs */}
            <div className="lg:col-span-5 space-y-10">
                <div className="space-y-4">
                    <Badge className="bg-indigo-600 text-white border-none px-3 py-1 font-black uppercase tracking-widest text-[10px]">
                        AI Fitting Room v2.4
                    </Badge>
                    <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none italic">
                        Virtual <span className="text-indigo-600">Try-On</span> 2.0
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Почувствуйте посадку еще до покупки. Наш движок учитывает состав ткани (эластан, плотность) и ваши мерки из профиля Syntha.
                    </p>
                </div>

                {/* Avatar Selection */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <User className="h-4 w-4" /> 1. Выберите свой тип фигуры
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {AVATARS.map(av => (
                            <button
                                key={av.id}
                                onClick={() => setSelectedAvatar(av)}
                                className={cn(
                                    "p-3 rounded-xl border-2 transition-all group",
                                    selectedAvatar.id === av.id ? "border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100" : "border-slate-50 bg-white hover:border-slate-200"
                                )}
                            >
                                <div className="aspect-square rounded-[1.5rem] overflow-hidden relative mb-3">
                                    <Image src={av.img} alt={av.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-slate-900 truncate">{av.name}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{av.desc}</p>
                            </button>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full h-12 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase">
                        <Ruler className="mr-2 h-4 w-4" /> Использовать мои мерки
                    </Button>
                </div>

                {/* Fit Analysis */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> 2. AI Анализ посадки
                    </h3>
                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-slate-400">Predicted Comfort Score</p>
                                <p className="text-base font-black text-slate-900">{fitScore}/100</p>
                            </div>
                            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Shoulders & Bust</span>
                                <span className="text-emerald-600">Perfect Fit</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Waist</span>
                                <span className="text-amber-500">Slightly Tight</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Sleeve Length</span>
                                <span className="text-emerald-600">Optimal</span>
                            </div>
                        </div>

                        <Button 
                            onClick={handleFit}
                            disabled={isFitting}
                            className="w-full h-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all"
                        >
                            {isFitting ? <RefreshCcw className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5 fill-white" />}
                            Run Deep Simulation
                        </Button>
                    </Card>
                </div>

                {/* Fabric Specs */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shadow-sm">
                            <Info className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-slate-400">Stretch</p>
                            <p className="text-[10px] font-black text-slate-900">High (12%)</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shadow-sm">
                            <Maximize2 className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase text-slate-400">Drape</p>
                            <p className="text-[10px] font-black text-slate-900">Structured</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
