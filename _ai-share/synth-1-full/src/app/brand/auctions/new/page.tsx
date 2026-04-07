'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gavel, PlusCircle, Package, TrendingUp } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getAuctionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function NewAuctionPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Новый тендер / закупка"
        description="Создание аукциона для закупок бренда: ткани, фурнитура, услуги. Полноценный сценарий закупок и потребностей."
        icon={Gavel}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        badges={<><Badge variant="outline" className="text-[9px]">Закупки</Badge><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/auctions">Аукционы</Link></Button></>}
      />
      <h1 className="text-2xl font-bold uppercase">Создать тендер</h1>
      <Card className="rounded-xl border border-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" /> Новая закупка
          </CardTitle>
          <CardDescription>
            Опишите потребность: категория, объём, сроки. Поставщики смогут участвовать в аукционе.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <p className="text-sm font-medium mb-2">Тип закупки</p>
              <div className="flex gap-2">
                {['Ткани', 'Фурнитура', 'Услуги пошива', 'Логистика'].map(t => (
                  <Badge key={t} variant="outline" className="cursor-pointer hover:bg-indigo-50">{t}</Badge>
                ))}
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/brand/auctions">← Назад к аукционам</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getAuctionLinks()} />
    </div>
  );
}
