'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, TrendingUp, Image, Video } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getMarketingLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function TrendSentimentPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Trend Sentiment Radar"
        description="Анализ соцсетей (TikTok, Instagram) для мгновенной корректировки дизайна в текущем цикле. Связь с Content Factory, Products, Production."
        icon={Megaphone}
        iconBg="bg-rose-100"
        iconColor="text-rose-600"
        badges={<><Badge variant="outline" className="text-[9px]">TikTok</Badge><Badge variant="outline" className="text-[9px]">Instagram</Badge><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/cms">Content</Link></Button></>}
      />
      <h1 className="text-2xl font-bold uppercase">Trend Sentiment Radar</h1>
      <Card className="rounded-xl border border-rose-100 bg-rose-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Радар трендов
          </CardTitle>
          <CardDescription>Мгновенная обратная связь из соцсетей для корректировки коллекции</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border flex items-center gap-3">
              <Image className="h-10 w-10 text-rose-500" />
              <div>
                <p className="font-bold">Instagram</p>
                <p className="text-[11px] text-slate-500">Охват, вовлечённость, топ-хэштеги</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border flex items-center gap-3">
              <Video className="h-10 w-10 text-slate-900" />
              <div>
                <p className="font-bold">TikTok</p>
                <p className="text-[11px] text-slate-500">Virality, тренды, звуки</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-4">Скоро: подключение API соцсетей</p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getMarketingLinks()} />
    </div>
  );
}
