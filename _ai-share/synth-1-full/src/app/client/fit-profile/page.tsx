'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/routes';
import { loadBodyProfile, saveBodyProfile } from '@/lib/fashion/fit-match-logic';
import type { BodyProfileV1 } from '@/lib/fashion/types';
import { ArrowLeft, UserCheck, Ruler } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FitProfilePage() {
  const { toast } = useToast();
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    const p = loadBodyProfile();
    if (p) {
      setChest(String(p.chest || ''));
      setWaist(String(p.waist || ''));
      setHips(String(p.hips || ''));
      setHeight(String(p.height || ''));
    }
  }, []);

  const handleSave = () => {
    const profile: BodyProfileV1 = {
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      height: height ? parseFloat(height) : undefined,
    };
    saveBodyProfile(profile);
    toast({ title: 'Профиль сохранён', description: 'Теперь на PDP будет отображаться процент соответствия размера.' });
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.client.home}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-emerald-600" />
            Ваши мерки (Fit Profile)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Укажите свои параметры в см для автоматического сравнения с изделием. Хранится локально.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Параметры тела</CardTitle>
          <CardDescription>Используются для расчета комфортной посадки (ease allowance).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chest">Обхват груди, см</Label>
              <Input id="chest" inputMode="decimal" value={chest} onChange={(e) => setChest(e.target.value)} placeholder="92" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waist">Обхват талии, см</Label>
              <Input id="waist" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="74" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hips">Обхват бёдер, см</Label>
              <Input id="hips" inputMode="decimal" value={hips} onChange={(e) => setHips(e.target.value)} placeholder="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Рост, см</Label>
              <Input id="height" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="176" />
            </div>
          </div>
          <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
            Сохранить профиль
          </Button>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-3">
        <Ruler className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-800 leading-relaxed">
          <p className="font-semibold mb-1">Как мы считаем?</p>
          Мы берем физические замеры изделия (chest, waist, hips) и сравниваем их с вашими. Для комфортной носки мы закладываем "прибавку на свободу облегания" (2-8 см в зависимости от типа вещи).
        </div>
      </div>
    </div>
  );
}
