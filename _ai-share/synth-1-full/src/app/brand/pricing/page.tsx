'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import DynamicPricingEngine from '@/components/brand/pricing/DynamicPricingEngine';
import { CommercialTermsMatrix } from '@/components/brand/commercial-terms-matrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
=======
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash
import { DollarSign, Handshake, BarChart3, TrendingDown, Percent } from 'lucide-react';

const PriceComparisonContent = dynamic(
  () => import('@/app/brand/pricing/price-comparison/page').then((m) => m.default),
<<<<<<< HEAD
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const ElasticityContent = dynamic(
  () => import('@/app/brand/pricing/elasticity/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const MarkdownContent = dynamic(
  () => import('@/app/brand/pricing/markdown/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
=======
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const ElasticityContent = dynamic(
  () => import('@/app/brand/pricing/elasticity/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const MarkdownContent = dynamic(
  () => import('@/app/brand/pricing/markdown/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
>>>>>>> recover/cabinet-wip-from-stash
);

export default function BrandPricingPage() {
  const [tab, setTab] = useState('pricing');
  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-4 px-4 py-4">
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-9 flex-wrap gap-0.5 border border-slate-200 bg-slate-100/80 px-1">
          <TabsTrigger
            value="pricing"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
=======
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="Ценообразование"
        leadPlain="Динамические цены B2C, коммерческие условия B2B, сравнение каналов и markdown."
      />
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap')}>
          <TabsTrigger value="pricing" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
>>>>>>> recover/cabinet-wip-from-stash
            <DollarSign className="h-3 w-3 shrink-0" /> Ценообразование
          </TabsTrigger>
          <TabsTrigger
            value="price-comparison"
<<<<<<< HEAD
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BarChart3 className="h-3 w-3 shrink-0" /> Сравнение цен
          </TabsTrigger>
          <TabsTrigger
            value="elasticity"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <TrendingDown className="h-3 w-3 shrink-0" /> Эластичность
          </TabsTrigger>
          <TabsTrigger
            value="markdown"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
=======
            className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
          >
            <BarChart3 className="h-3 w-3 shrink-0" /> Сравнение цен
          </TabsTrigger>
          <TabsTrigger value="elasticity" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <TrendingDown className="h-3 w-3 shrink-0" /> Эластичность
          </TabsTrigger>
          <TabsTrigger value="markdown" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
>>>>>>> recover/cabinet-wip-from-stash
            <Percent className="h-3 w-3 shrink-0" /> Оптимизация скидок
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-0">
          <Tabs defaultValue="dynamic" className="space-y-4">
<<<<<<< HEAD
            <TabsList className="h-10 rounded-2xl border border-slate-200 bg-slate-100 p-1">
              <TabsTrigger
                value="dynamic"
                className="h-12 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <DollarSign className="mr-2 h-4 w-4" /> B2C Dynamic Pricing
              </TabsTrigger>
              <TabsTrigger
                value="wholesale"
                className="h-12 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Handshake className="mr-2 h-4 w-4" /> B2B Commercial Terms
=======
            <TabsList className={cn(cabinetSurface.tabsList, 'w-fit flex-wrap')}>
              <TabsTrigger
                value="dynamic"
                className={cn(cabinetSurface.tabsTrigger, 'h-9 gap-2 px-4')}
              >
                <DollarSign className="h-4 w-4 shrink-0" /> B2C Dynamic Pricing
              </TabsTrigger>
              <TabsTrigger
                value="wholesale"
                className={cn(cabinetSurface.tabsTrigger, 'h-9 gap-2 px-4')}
              >
                <Handshake className="h-4 w-4 shrink-0" /> B2B Commercial Terms
>>>>>>> recover/cabinet-wip-from-stash
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dynamic" className="mt-0">
              <DynamicPricingEngine />
            </TabsContent>

            <TabsContent value="wholesale" className="mt-0">
              <CommercialTermsMatrix />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="price-comparison" className="mt-0">
          {tab === 'price-comparison' && <PriceComparisonContent />}
        </TabsContent>

        <TabsContent value="elasticity" className="mt-0">
          {tab === 'elasticity' && <ElasticityContent />}
        </TabsContent>

        <TabsContent value="markdown" className="mt-0">
          {tab === 'markdown' && <MarkdownContent />}
        </TabsContent>
      </Tabs>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
