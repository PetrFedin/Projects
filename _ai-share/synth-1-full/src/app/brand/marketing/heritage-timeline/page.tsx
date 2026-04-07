'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Clock, BookOpen, QrCode, Package, ChevronRight } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getMarketingLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { cn } from '@/lib/utils';

const MOCK_TIMELINE = [
  { id: '1', step: 'Идея и эскиз', date: 'Янв 2026', desc: 'Концепция модели Cyber Parka', productId: 'P-502', sku: 'CP-001' },
  { id: '2', step: 'Техпакет и лекала', date: 'Фев 2026', desc: 'Digital Tech Pack 2.0, градация', productId: 'P-502', sku: 'CP-001' },
  { id: '3', step: 'Прототипы', date: 'Мар 2026', desc: 'Proto 1 → 2 → PP, Fit Comments', productId: 'P-502', sku: 'CP-001' },
  { id: '4', step: 'Gold Sample', date: 'Апр 2026', desc: 'Утверждение эталона, ЭДО', productId: 'P-502', sku: 'CP-001' },
  { id: '5', step: 'Массовый пошив', date: 'Май 2026', desc: 'Запуск в производство', productId: 'P-502', sku: 'CP-001' },
  { id: '6', step: 'Digital Passport', date: 'Июн 2026', desc: 'QR-история вещи для клиента', productId: 'P-502', sku: 'CP-001', passportId: 'PASS-9921' },
];

export default function HeritageTimelinePage() {
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_TIMELINE[0]?.id ?? null);
  const selected = MOCK_TIMELINE.find((t) => t.id === selectedId);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Brand Heritage Timeline"
        description="Интерактивная история создания каждой вещи для конечных клиентов. Storytelling, аутентичность. Связь с Digital Passport, Products, Production."
        icon={History}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Storytelling</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/dpp/1">Digital Passport</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/products">Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/production">Production</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Brand Heritage Timeline</h1>

      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> История продукта: Cyber Parka (CP-001)
          </CardTitle>
          <CardDescription>От идеи до производства — этапы для клиентского storytelling и Digital Passport</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {MOCK_TIMELINE.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-xl text-left border transition-all text-[11px] font-bold',
                  selectedId === t.id ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 hover:border-amber-200'
                )}
              >
                {t.step}
              </button>
            ))}
          </div>
          {selected && (
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500">{selected.date}</p>
                <p className="font-bold text-slate-900">{selected.step}</p>
                <p className="text-sm text-slate-600 mt-1">{selected.desc}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="rounded-lg text-[10px]">
                  <Link href={`/brand/products/${selected.productId}`}><Package className="h-3 w-3 mr-1" /> Карточка товара</Link>
                </Button>
                {selected.passportId && (
                  <Button variant="outline" size="sm" asChild className="rounded-lg text-[10px]">
                    <Link href="/dpp/1"><QrCode className="h-3 w-3 mr-1" /> Digital Passport</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="outline" size="sm" asChild className="text-[10px]">
              <Link href="/brand/production/fit-comments">Fit Comments <ChevronRight className="h-3 w-3 ml-1" /></Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-[10px]">
              <Link href="/brand/production/gold-sample">Gold Sample <ChevronRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getMarketingLinks()} />
    </div>
  );
}
