'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
=======
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
>>>>>>> recover/cabinet-wip-from-stash
import { AdvancedPIM } from '@/components/brand/AdvancedPIM';
import { Database, Layers, Target, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { tid } from '@/lib/ui/test-ids';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ROUTES } from '@/lib/routes';

<<<<<<< HEAD
=======
function ProductsLoadingState() {
  return (
    <Card className="border-border-default bg-bg-surface2/70">
      <CardContent className="py-10 text-center">
        <p className="text-text-secondary text-sm font-medium">Загрузка раздела...</p>
      </CardContent>
    </Card>
  );
}

>>>>>>> recover/cabinet-wip-from-stash
const VariantMatrixEditor = dynamic(
  () =>
    import('@/components/brand/VariantMatrixEditor').then((m) => ({
      default: m.VariantMatrixEditor,
    })),
<<<<<<< HEAD
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
=======
  { ssr: false, loading: () => <ProductsLoadingState /> }
);
const SmartPlanningContent = dynamic(() => import('@/app/brand/planning/page'), {
  ssr: false,
  loading: () => <ProductsLoadingState />,
});
const CreateReadyContent = dynamic(
  () => import('@/app/brand/products/create-ready/page').then((m) => m.default),
  { ssr: false, loading: () => <ProductsLoadingState /> }
);
const ColorsContent = dynamic(() => import('@/app/brand/colors/page').then((m) => m.default), {
  ssr: false,
  loading: () => <ProductsLoadingState />,
});
const RangePlannerContent = dynamic(
  () => import('@/app/brand/range-planner/page').then((m) => m.default),
  { ssr: false, loading: () => <ProductsLoadingState /> }
);
const DigitalTwinTestingContent = dynamic(
  () => import('@/app/brand/products/digital-twin-testing/page').then((m) => m.default),
  { ssr: false, loading: () => <ProductsLoadingState /> }
);
const WeatherCollectionsContent = dynamic(
  () => import('@/app/brand/weather-collections/page').then((m) => m.default),
  { ssr: false, loading: () => <ProductsLoadingState /> }
);
const DigitalPassportContent = dynamic(
  () => import('@/app/brand/products/digital-passport/page').then((m) => m.default),
  { ssr: false, loading: () => <ProductsLoadingState /> }
>>>>>>> recover/cabinet-wip-from-stash
);

export default function BrandProductsPage() {
  const [tab, setTab] = useState('pim');

  return (
<<<<<<< HEAD
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
=======
    <RegistryPageShell className="space-y-4" data-testid={tid.page('brand-products')}>
      <RegistryPageHeader
        title="Продукт"
        leadPlain="Карточки, матрица ассортимента и продуктовые потоки от планирования до цифрового паспорта."
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link href={ROUTES.brand.planning}>Планирование</Link>
            </Button>
            <Button asChild size="sm" className="h-8">
              <Link href={ROUTES.brand.productsCreateReady}>Новая карточка</Link>
            </Button>
          </>
        }
      />
>>>>>>> recover/cabinet-wip-from-stash

      <Tabs value={tab} onValueChange={setTab} className="min-h-[200px] w-full space-y-4">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-9 w-fit shadow-inner')}>
            <TabsTrigger
              value="pim"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              <Database className="size-3.5" />
              Карточки товаров
            </TabsTrigger>
            <TabsTrigger
              value="matrix"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              <Layers className="size-3.5" />
              Матрица ассортимента
            </TabsTrigger>
            <TabsTrigger
              value="planning"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              <Target className="size-3.5" />
              Планирование
            </TabsTrigger>
            <TabsTrigger
              value="create-ready"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              Карточка товара
            </TabsTrigger>
            <TabsTrigger
              value="colors"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              Цвета
            </TabsTrigger>
            <TabsTrigger
              value="range-planner"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              Планировщик ассортимента
            </TabsTrigger>
            <TabsTrigger
              value="digital-testing"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              Тест образцов
            </TabsTrigger>
            <TabsTrigger
              value="weather"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              Погодные коллекции
            </TabsTrigger>
            <TabsTrigger
              value="digital-passport"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-7 gap-1.5 text-xs'
              )}
            >
              <Fingerprint className="size-3.5" />
              Цифровой паспорт
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="pim" className="mt-4">
          <AdvancedPIM />
        </TabsContent>

        <TabsContent value="matrix" className="mt-4">
          {tab === 'matrix' && <VariantMatrixEditor />}
        </TabsContent>

<<<<<<< HEAD
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
=======
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
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
