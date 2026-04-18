'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  Factory,
  Package,
  FileText,
  Layers,
  Truck,
  TrendingUp,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

const mockFactory = {
  id: 'f1',
  name: 'Фабрика #1 (Москва)',
  specialization: 'Верхняя одежда, трикотаж',
  load: 75,
  qualityRating: 4.8,
  activeOrders: 3,
  activePO: [
    {
      id: 'PO-2026-001',
      collection: 'SS26',
      items: 24,
      status: 'В производстве',
      eta: '2026-03-25',
    },
    { id: 'PO-2026-002', collection: 'SS26', items: 12, status: 'Отборка', eta: '2026-04-01' },
  ],
  quality: [
    { batch: 'Q3-101', score: 98, defects: 2, date: '2026-03-01' },
    { batch: 'Q3-098', score: 96, defects: 4, date: '2026-02-15' },
  ],
};

export default function FactoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const factory = mockFactory;

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Карточка фабрики"
        description="Детальный профиль: PO, качество, штрафы, материалы. Связь с Production, VMI, B2B Orders."
        icon={Factory}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Production
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/production">Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/vmi">VMI</Link>
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title={factory.name}
        leadPlain={`${factory.specialization}. PO, качество, штрафы, материалы. Связь с Production, VMI и B2B.`}
        eyebrow={
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.brand.factories} aria-label="К списку производств">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        }
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Factory className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <Badge variant="outline" className="text-[9px]">
              Production
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.production}>Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.vmi}>VMI</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.brand.production}>Перейти в Production</Link>
            </Button>
          </div>
        }
      />

<<<<<<< HEAD
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/brand/factories">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold uppercase">{factory.name}</h1>
          <p className="text-sm text-slate-500">{factory.specialization}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/brand/production">Перейти в Production</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Загруженность</p>
=======
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-text-muted text-[10px] font-bold uppercase">Загруженность</p>
>>>>>>> recover/cabinet-wip-from-stash
          <div className="mt-1 flex items-center gap-2">
            <Progress value={factory.load} className="h-2 flex-1" />
            <span className="font-bold">{factory.load}%</span>
          </div>
        </Card>
        <Card className="p-4">
<<<<<<< HEAD
          <p className="text-[10px] font-bold uppercase text-slate-400">Рейтинг качества</p>
          <p className="text-xl font-black text-emerald-600">{factory.qualityRating}/5</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Активные PO</p>
          <p className="text-xl font-black text-slate-900">{factory.activeOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-400">Штрафы</p>
          <p className="text-xl font-black text-slate-900">0</p>
=======
          <p className="text-text-muted text-[10px] font-bold uppercase">Рейтинг качества</p>
          <p className="text-xl font-black text-emerald-600">{factory.qualityRating}/5</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-[10px] font-bold uppercase">Активные PO</p>
          <p className="text-text-primary text-xl font-black">{factory.activeOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-[10px] font-bold uppercase">Штрафы</p>
          <p className="text-text-primary text-xl font-black">0</p>
>>>>>>> recover/cabinet-wip-from-stash
        </Card>
      </div>

      <Tabs defaultValue="po" className="space-y-4">
<<<<<<< HEAD
        <TabsList className="rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="po" className="rounded-lg">
            Production Orders
          </TabsTrigger>
          <TabsTrigger value="quality" className="rounded-lg">
            Качество
          </TabsTrigger>
          <TabsTrigger value="materials" className="rounded-lg">
            Материалы
          </TabsTrigger>
          <TabsTrigger value="penalties" className="rounded-lg">
=======
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap')}>
          <TabsTrigger value="po" className={cn(cabinetSurface.tabsTrigger, 'h-8')}>
            Production Orders
          </TabsTrigger>
          <TabsTrigger value="quality" className={cn(cabinetSurface.tabsTrigger, 'h-8')}>
            Качество
          </TabsTrigger>
          <TabsTrigger value="materials" className={cn(cabinetSurface.tabsTrigger, 'h-8')}>
            Материалы
          </TabsTrigger>
          <TabsTrigger value="penalties" className={cn(cabinetSurface.tabsTrigger, 'h-8')}>
>>>>>>> recover/cabinet-wip-from-stash
            Штрафы
          </TabsTrigger>
        </TabsList>
        <TabsContent value="po" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Активные PO</CardTitle>
              <CardDescription>Заказы на производство</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {factory.activePO.map((po) => (
                  <div
                    key={po.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="text-text-muted h-4 w-4" />
                      <span className="font-mono text-sm">{po.id}</span>
                      <Badge variant="secondary" className="text-[9px]">
                        {po.collection}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                      <span className="text-[11px] text-slate-500">{po.items} SKU</span>
                      <Badge variant="outline" className="text-[9px]">
                        {po.status}
                      </Badge>
                      <span className="text-[11px] text-slate-500">ETA: {po.eta}</span>
=======
                      <span className="text-text-secondary text-[11px]">{po.items} SKU</span>
                      <Badge variant="outline" className="text-[9px]">
                        {po.status}
                      </Badge>
                      <span className="text-text-secondary text-[11px]">ETA: {po.eta}</span>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href={ROUTES.brand.production}>Все PO в Production</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Контроль качества</CardTitle>
              <CardDescription>Оценки по партиям</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {factory.quality.map((q) => (
                  <div
                    key={q.batch}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="font-mono text-sm">{q.batch}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-emerald-600">{q.score}%</span>
<<<<<<< HEAD
                      <span className="text-[11px] text-slate-500">дефектов: {q.defects}</span>
                      <span className="text-[11px] text-slate-500">{q.date}</span>
=======
                      <span className="text-text-secondary text-[11px]">дефектов: {q.defects}</span>
                      <span className="text-text-secondary text-[11px]">{q.date}</span>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Материалы на фабрике</CardTitle>
              <CardDescription>VMI: остатки сырья</CardDescription>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="mb-3 text-sm text-slate-500">Связь с VMI</p>
=======
              <p className="text-text-secondary mb-3 text-sm">Связь с VMI</p>
>>>>>>> recover/cabinet-wip-from-stash
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.brand.vmi}>Перейти в VMI</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="penalties">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Штрафные санкции</CardTitle>
              <CardDescription>Условия по браку и срокам</CardDescription>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
              <p className="mb-3 text-sm text-slate-500">Настраиваются в Production → PO</p>
=======
              <p className="text-text-secondary mb-3 text-sm">Настраиваются в Production → PO</p>
>>>>>>> recover/cabinet-wip-from-stash
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.brand.production}>Production</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getProductionLinks()} title="Связанные модули" />
    </RegistryPageShell>
  );
}
