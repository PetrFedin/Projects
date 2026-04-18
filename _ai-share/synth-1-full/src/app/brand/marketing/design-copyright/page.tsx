'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, AlertTriangle } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getMarketingLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function DesignCopyrightPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Design Copyright AI"
        description="Глобальный мониторинг маркетплейсов на предмет появления визуальных копий моделей. Защита интеллектуальной собственности. Связь с IP Ledger, Products."
        icon={Shield}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              AI
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Маркетплейсы
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/ip-ledger">IP Ledger</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Design Copyright AI</h1>
      <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" /> Мониторинг копий
          </CardTitle>
          <CardDescription>
            Автоматический поиск визуально похожих моделей на Wildberries, Ozon, AliExpress и др.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-xl border bg-white p-4">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <div>
              <p className="font-bold">Сканирование</p>
              <p className="text-[11px] text-slate-500">
                Загрузите образцы для мониторинга. AI сравнивает с каталогами маркетплейсов.
              </p>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-400">Скоро: интеграция с маркетплейсами</p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getMarketingLinks()} />
    </div>
  );
}
