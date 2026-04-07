'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, ArrowLeft, Zap, Star, Tag, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';

/** NuOrder: версии лайншита — Early Bird / VIP / Outlet / Stock Lot, разные каталоги и условия по сезону. */
const VERSIONS = [
  { id: 'early-bird', name: 'Early Bird', desc: 'Ранний доступ, особые условия для ключевых партнёров', icon: Zap },
  { id: 'vip', name: 'VIP', desc: 'Расширенный ассортимент и приоритет отгрузки', icon: Star },
  { id: 'outlet', name: 'Outlet', desc: 'Ликвидация, уценённые позиции', icon: Tag },
  { id: 'stock-lot', name: 'Stock Lot', desc: 'Остатки со склада, лоты', icon: Package },
];

export default function LinesheetVersionsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.b2bLinesheets}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Layers className="h-6 w-6" /> Версии лайншита</h1>
          <p className="text-slate-500 text-sm mt-0.5">NuOrder: Early Bird, VIP, Outlet, Stock Lot — разные каталоги и условия по одному сезону.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Типы версий</CardTitle>
          <CardDescription>Создайте лайншит под тип аудитории и условия</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {VERSIONS.map((v) => {
            const Icon = v.icon;
            return (
              <Link key={v.id} href={ROUTES.brand.b2bLinesheetsCreate} className="block p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
                <Icon className="h-8 w-8 text-indigo-600 mb-2" />
                <p className="font-medium">{v.name}</p>
                <p className="text-xs text-slate-500">{v.desc}</p>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.b2bLinesheetCampaigns}>Кампании по лайншитам</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.b2bLinesheets}>Все лайншиты</Link></Button>
      </div>
      <RelatedModulesBlock links={getB2BLinks()} title="Лайншиты, кампании, заказы" />
    </div>
  );
}
