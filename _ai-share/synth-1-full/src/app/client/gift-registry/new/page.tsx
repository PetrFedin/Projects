'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, ArrowLeft } from 'lucide-react';

export default function NewGiftRegistryPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/client/gift-registry"><ArrowLeft className="h-4 w-4 mr-2" /> Назад</Link>
        </Button>
      </header>
      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-rose-500" /> Новый список подарков
          </CardTitle>
          <CardDescription>Создайте список на свадьбу, день рождения или другой праздник. Укажите дату и добавьте позиции.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-[10px] font-bold uppercase text-slate-500">Название события</Label>
            <Input placeholder="Например: Свадьба · Анна и Михаил" className="mt-1 rounded-lg" />
          </div>
          <div>
            <Label className="text-[10px] font-bold uppercase text-slate-500">Дата события</Label>
            <Input type="date" className="mt-1 rounded-lg" />
          </div>
          <Button className="w-full rounded-xl font-bold uppercase text-[10px]" asChild>
            <Link href="/client/gift-registry">Создать и добавить подарки</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
