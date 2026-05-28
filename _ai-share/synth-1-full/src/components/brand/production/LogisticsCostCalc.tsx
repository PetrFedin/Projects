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
    <Card className="border-border-subtle rounded-xl border shadow-sm">
      <CardHeader className="px-4 py-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
          <Truck className="h-4 w-4" /> Расчёт стоимости логистики
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-text-secondary text-[9px] font-bold uppercase">Вес (кг)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              className="mt-1 h-8 text-[10px]"
            />
          </div>
          <div>
            <label className="text-text-secondary text-[9px] font-bold uppercase">Объём (м³)</label>
            <Input
              type="number"
              step={0.1}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value) || 0)}
              className="mt-1 h-8 text-[10px]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-text-secondary text-[9px] font-bold uppercase">Откуда</label>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 h-8 text-[10px]"
            />
          </div>
          <div>
            <label className="text-text-secondary text-[9px] font-bold uppercase">Куда</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 h-8 text-[10px]"
            />
          </div>
        </div>
        <Button size="sm" className="h-8 w-full text-[9px]" onClick={estimate}>
          Рассчитать
        </Button>
        {result !== null && (
          <p className="text-accent-primary text-center text-[11px] font-bold">
            ≈ {result.toLocaleString('ru-RU')} ₽
          </p>
        )}
      </CardContent>
    </Card>
  );
}
