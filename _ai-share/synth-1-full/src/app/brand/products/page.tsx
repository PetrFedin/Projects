'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedPIM } from '@/components/brand/AdvancedPIM';
import { Database, Layers, Target, Fingerprint } from 'lucide-react';

const VariantMatrixEditor = dynamic(
  () =>
    import('@/components/brand/VariantMatrixEditor').then((m) => ({
      default: m.VariantMatrixEditor,
    })),
  { ssr: false }
);
const SmartPlanningContent = dynamic(() => import('@/app/brand/planning/page'), { ssr: false });
const CreateReadyContent = dynamic(
  () => import('@/app/brand/products/create-ready/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const ColorsContent = dynamic(() => import('@/app/brand/colors/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div>,
});
const RangePlannerContent = dynamic(
  () => import('@/app/brand/range-planner/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const DigitalTwinTestingContent = dynamic(
  () => import('@/app/brand/products/digital-twin-testing/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const WeatherCollectionsContent = dynamic(
  () => import('@/app/brand/weather-collections/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const DigitalPassportContent = dynamic(
  () => import('@/app/brand/products/digital-passport/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);

export default function BrandProductsPage() {
  const [tab, setTab] = useState('pim');

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full space-y-4">
      <TabsList className="h-9 gap-0.5 border border-slate-200 bg-slate-50 px-1">
        <TabsTrigger
          value="pim"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Database className="h-3.5 w-3.5" />
          Карточки товаров
        </TabsTrigger>
        <TabsTrigger
          value="matrix"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Layers className="h-3.5 w-3.5" />
          Матрица ассортимента
        </TabsTrigger>
        <TabsTrigger
          value="planning"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Target className="h-3.5 w-3.5" />
          Планирование
        </TabsTrigger>
        <TabsTrigger
          value="create-ready"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Карточка товара
        </TabsTrigger>
        <TabsTrigger
          value="colors"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Цвета
        </TabsTrigger>
        <TabsTrigger
          value="range-planner"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Планировщик ассортимента
        </TabsTrigger>
        <TabsTrigger
          value="digital-testing"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Тест образцов
        </TabsTrigger>
        <TabsTrigger
          value="weather"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Погодные коллекции
        </TabsTrigger>
        <TabsTrigger
          value="digital-passport"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Fingerprint className="h-3.5 w-3.5" />
          Цифровой паспорт
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pim" className="mt-4">
        <AdvancedPIM />
      </TabsContent>

      <TabsContent value="matrix" className="mt-4">
        {tab === 'matrix' && <VariantMatrixEditor />}
      </TabsContent>

      <TabsContent value="planning" className="mt-4">
        {tab === 'planning' && <SmartPlanningContent />}
      </TabsContent>

      <TabsContent value="create-ready">
        {tab === 'create-ready' && <CreateReadyContent />}
      </TabsContent>
      <TabsContent value="colors">{tab === 'colors' && <ColorsContent />}</TabsContent>
      <TabsContent value="range-planner">
        {tab === 'range-planner' && <RangePlannerContent />}
      </TabsContent>
      <TabsContent value="digital-testing">
        {tab === 'digital-testing' && <DigitalTwinTestingContent />}
      </TabsContent>
      <TabsContent value="weather">
        {tab === 'weather' && <WeatherCollectionsContent />}
      </TabsContent>
      <TabsContent value="digital-passport">
        {tab === 'digital-passport' && <DigitalPassportContent />}
      </TabsContent>
    </Tabs>
  );
}
