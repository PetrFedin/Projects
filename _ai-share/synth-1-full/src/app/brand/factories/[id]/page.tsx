'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
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
import { RegistryPageHeader } from '@/components/design-system';

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
    <CabinetPageContent maxWidth="full" className="w-full space-y-6 pb-16">
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
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.brand.production}>Перейти в Production</Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-text-muted text-[10px] font-bold uppercase">Загруженность</p>
          <div className="mt-1 flex items-center gap-2">
            <Progress
              value={factory.load}
              className="h-2 flex-1"
              aria-label={`Загруженность фабрики: ${factory.load}%`}
            />
            <span className="font-bold">{factory.load}%</span>
          </div>
        </Card>
        <Card className="p-4">
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
        </Card>
      </div>

      <Tabs defaultValue="po" className="space-y-4">
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
            Штрафы
          </TabsTrigger>
        </TabsList>
        <TabsContent value="po" className={cn(cabinetSurface.cabinetProfileTabPanel, 'space-y-2')}>
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
                      <span className="text-text-secondary text-[11px]">{po.items} SKU</span>
                      <Badge variant="outline" className="text-[9px]">
                        {po.status}
                      </Badge>
                      <span className="text-text-secondary text-[11px]">ETA: {po.eta}</span>
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
                      <span className="text-text-secondary text-[11px]">дефектов: {q.defects}</span>
                      <span className="text-text-secondary text-[11px]">{q.date}</span>
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
              <p className="text-text-secondary mb-3 text-sm">Связь с VMI</p>
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
              <p className="text-text-secondary mb-3 text-sm">Настраиваются в Production → PO</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.brand.production}>Production</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getProductionLinks()} title="Связанные модули" />
    </CabinetPageContent>
  );
}
