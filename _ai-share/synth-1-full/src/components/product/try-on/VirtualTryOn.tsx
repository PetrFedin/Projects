'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Maximize2,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Camera,
  Zap,
  Info,
  Share2,
  Download,
  MousePointer2,
  Ruler,
  Thermometer,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface VirtualTryOnProps {
  product: Product;
}

const AVATARS = [
  {
    id: 'av1',
    name: 'Athletic',
    desc: 'S / 178cm',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'av2',
    name: 'Curvy',
    desc: 'M / 172cm',
    img: 'https://images.unsplash.com/photo-1581044777050-4c5161903c33?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'av3',
    name: 'Petite',
    desc: 'XS / 162cm',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
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
        title: 'Примерка завершена',
        description: 'AI проанализировал посадку ткани на основе ваших мерок.',
      });
    }, 2000);
  };

  return (
    <div className="grid gap-3 duration-700 animate-in fade-in lg:grid-cols-12">
      {/* Left: Fitting Canvas */}
      <div className="space-y-6 lg:col-span-7">
        <Card className="group relative aspect-[3/4] overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
          {/* Simulated Fitting View */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'relative h-full w-full transition-all duration-1000',
                isFitting ? 'scale-110 opacity-50 blur-xl' : 'scale-100 opacity-100 blur-0'
              )}
            >
              <Image
                src={product.images[0].url}
                alt="Fitting Preview"
                fill
                className={cn(
                  'object-cover transition-all duration-700',
                  showHeatmap ? 'brightness-50 saturate-0' : 'contrast-105 brightness-110'
                )}
              />
              {/* Heatmap Overlay Simulation */}
              {showHeatmap && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-rose-500/40 via-emerald-500/20 to-indigo-500/40 mix-blend-overlay" />
              )}
            </div>
          </div>

          {/* AI Loading State */}
          {isFitting && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-6 bg-black/20 text-white backdrop-blur-md">
              <div className="relative">
                <RefreshCcw className="h-12 w-12 animate-spin text-indigo-400" />
                <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-bounce text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-black uppercase italic tracking-widest">
                  Simulating Fabric Physics...
                </h3>
                <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">
                  Neural Engine Processing Cloth-Body Intersection
                </p>
              </div>
            </div>
          )}

          {/* Canvas Controls */}
          <div className="absolute left-6 top-4 z-30 flex gap-2">
            <Badge className="border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase text-white backdrop-blur-md">
              {fitScore}% Fit Accuracy
            </Badge>
            <Badge className="border-none bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase text-white">
              DLSS 3.0 Rendering
            </Badge>
          </div>

          <div className="absolute inset-x-6 bottom-6 z-30 flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={cn(
                  'flex h-12 items-center gap-2 rounded-2xl border px-6 text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-all',
                  showHeatmap
                    ? 'border-none bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                )}
              >
                <Thermometer className="h-4 w-4" />{' '}
                {showHeatmap ? 'Hide Pressure Map' : 'Pressure Heatmap'}
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20">
                <Camera className="h-5 w-5" />
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right: Configuration & Specs */}
      <div className="space-y-10 lg:col-span-5">
        <div className="space-y-4">
          <Badge className="border-none bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            AI Fitting Room v2.4
          </Badge>
          <h1 className="text-sm font-black uppercase italic leading-none tracking-tight text-slate-900">
            Virtual <span className="text-indigo-600">Try-On</span> 2.0
          </h1>
          <p className="font-medium leading-relaxed text-slate-500">
            Почувствуйте посадку еще до покупки. Наш движок учитывает состав ткани (эластан,
            плотность) и ваши мерки из профиля Syntha.
          </p>
        </div>

        {/* Avatar Selection */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
            <User className="h-4 w-4" /> 1. Выберите свой тип фигуры
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => setSelectedAvatar(av)}
                className={cn(
                  'group rounded-xl border-2 p-3 transition-all',
                  selectedAvatar.id === av.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100'
                    : 'border-slate-50 bg-white hover:border-slate-200'
                )}
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={av.img}
                    alt={av.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <p className="truncate text-[10px] font-black uppercase text-slate-900">
                  {av.name}
                </p>
                <p className="truncate text-[8px] font-bold uppercase text-slate-400">{av.desc}</p>
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            className="h-12 w-full rounded-xl border border-dashed border-slate-200 text-[10px] font-black uppercase text-slate-400"
          >
            <Ruler className="mr-2 h-4 w-4" /> Использовать мои мерки
          </Button>
        </div>

        {/* Fit Analysis */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
            <Sparkles className="h-4 w-4" /> 2. AI Анализ посадки
          </h3>
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400">
                  Predicted Comfort Score
                </p>
                <p className="text-base font-black text-slate-900">{fitScore}/100</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
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
              className="h-10 w-full rounded-2xl bg-slate-900 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-indigo-600"
            >
              {isFitting ? (
                <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Zap className="mr-2 h-5 w-5 fill-white" />
              )}
              Run Deep Simulation
            </Button>
          </Card>
        </div>

        {/* Fabric Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 shadow-sm">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[8px] font-black uppercase text-slate-400">Stretch</p>
              <p className="text-[10px] font-black text-slate-900">High (12%)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 shadow-sm">
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
