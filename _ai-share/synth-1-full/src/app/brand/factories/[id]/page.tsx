'use client';

import { use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft, Factory, Package, FileText, Layers, Truck,
  TrendingUp, ShieldCheck, MapPin
} from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';
import { Progress } from '@/components/ui/progress';

const mockFactory = {
  id: 'f1',
  name: 'Фабрика #1 (Москва)',
  specialization: 'Верхняя одежда, трикотаж',
  load: 75,
  qualityRating: 4.8,
  activeOrders: 3,
  activePO: [
    { id: 'PO-2026-001', collection: 'SS26', items: 24, status: 'В производстве', eta: '2026-03-25' },
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
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Карточка фабрики"
        description="Детальный профиль: PO, качество, штрафы, материалы. Связь с Production, VMI, B2B Orders."
        icon={Factory}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Production</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild>
              <Link href="/brand/production">Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/vmi">VMI</Link>
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/brand/factories"><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold uppercase">{factory.name}</h1>
          <p className="text-sm text-slate-500">{factory.specialization}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/brand/production">Перейти в Production</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Загруженность</p>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={factory.load} className="flex-1 h-2" />
            <span className="font-bold">{factory.load}%</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Рейтинг качества</p>
          <p className="text-xl font-black text-emerald-600">{factory.qualityRating}/5</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Активные PO</p>
          <p className="text-xl font-black text-slate-900">{factory.activeOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Штрафы</p>
          <p className="text-xl font-black text-slate-900">0</p>
        </Card>
      </div>

      <Tabs defaultValue="po" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="po" className="rounded-lg">Production Orders</TabsTrigger>
          <TabsTrigger value="quality" className="rounded-lg">Качество</TabsTrigger>
          <TabsTrigger value="materials" className="rounded-lg">Материалы</TabsTrigger>
          <TabsTrigger value="penalties" className="rounded-lg">Штрафы</TabsTrigger>
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
                  <div key={po.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-slate-400" />
                      <span className="font-mono text-sm">{po.id}</span>
                      <Badge variant="secondary" className="text-[9px]">{po.collection}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">{po.items} SKU</span>
                      <Badge variant="outline" className="text-[9px]">{po.status}</Badge>
                      <span className="text-slate-500 text-[11px]">ETA: {po.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link href="/brand/production">Все PO в Production</Link>
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
                  <div key={q.batch} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-mono text-sm">{q.batch}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-emerald-600">{q.score}%</span>
                      <span className="text-slate-500 text-[11px]">дефектов: {q.defects}</span>
                      <span className="text-slate-500 text-[11px]">{q.date}</span>
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
              <p className="text-slate-500 text-sm mb-3">Связь с VMI</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brand/vmi">Перейти в VMI</Link>
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
              <p className="text-slate-500 text-sm mb-3">Настраиваются в Production → PO</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/brand/production">Production</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getProductionLinks()} title="Связанные модули" />
    </div>
  );
}
