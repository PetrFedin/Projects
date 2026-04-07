'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

export interface LogisticsCostCalcProps {
  onEstimate?: (params: { weight: number; volume: number; from: string; to: string }) => void;
}

export function LogisticsCostCalc({ onEstimate }: LogisticsCostCalcProps) {
  const [weight, setWeight] = useState(500);
  const [volume, setVolume] = useState(2);
  const [from, setFrom] = useState('Москва');
  const [to, setTo] = useState('Стамбул');
  const [result, setResult] = useState<number | null>(null);

  const estimate = () => {
    const est = Math.round(weight * 0.5 + volume * 15000);
    setResult(est);
    onEstimate?.({ weight, volume, from, to });
  };

  return (
    <Card className="rounded-xl border border-slate-100 shadow-sm">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-[10px] font-black uppercase flex items-center gap-2">
          <Truck className="h-4 w-4" /> Расчёт стоимости логистики
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold uppercase text-slate-500">Вес (кг)</label>
            <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="mt-1 h-8 text-[10px]" />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-slate-500">Объём (м³)</label>
            <Input type="number" step={0.1} value={volume} onChange={(e) => setVolume(Number(e.target.value) || 0)} className="mt-1 h-8 text-[10px]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold uppercase text-slate-500">Откуда</label>
            <Input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-8 text-[10px]" />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-slate-500">Куда</label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-8 text-[10px]" />
          </div>
        </div>
        <Button size="sm" className="w-full h-8 text-[9px]" onClick={estimate}>
          Рассчитать
        </Button>
        {result !== null && (
          <p className="text-[11px] font-bold text-indigo-600 text-center">
            ≈ {result.toLocaleString('ru-RU')} ₽
          </p>
        )}
      </CardContent>
    </Card>
  );
}
