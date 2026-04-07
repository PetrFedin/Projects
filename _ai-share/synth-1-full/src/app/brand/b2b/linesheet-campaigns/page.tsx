'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, ArrowLeft, Send, BarChart2, Eye, MousePointer, ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getLinesheetCampaignsLinks } from '@/lib/data/entity-links';

/** NuOrder: кампании по лайншитам — отправка лайншита байерам (email), трекинг открытий/кликов/заказов. */
const MOCK_CAMPAIGNS = [
  { id: 'c1', name: 'FW26 Core — VIP байеры', linesheet: 'FW26 Core', sentAt: '2026-03-01', recipients: 24, openRate: 26, clickRate: 13, orderRate: 18, ordersCount: 4 },
  { id: 'c2', name: 'SS26 Early Bird', linesheet: 'SS26 Early', sentAt: '2026-02-15', recipients: 48, openRate: 22, clickRate: 11, orderRate: 12, ordersCount: 6 },
];

export default function LinesheetCampaignsPage() {
  const [creating, setCreating] = useState(false);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.b2bLinesheets}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Mail className="h-6 w-6" /> Кампании по лайншитам</h1>
            <p className="text-slate-500 text-sm mt-0.5">NuOrder: отправка лайншита конкретным байерам, трекинг открытий, кликов и заказов.</p>
          </div>
        </div>
        <Button onClick={() => setCreating(true)}><Send className="h-4 w-4 mr-2" /> Новая кампания</Button>
      </div>

      <div className="space-y-4">
        {MOCK_CAMPAIGNS.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{c.name}</CardTitle>
                <Badge variant="outline" className="text-[10px]">{c.linesheet}</Badge>
              </div>
              <CardDescription>Отправлено {new Date(c.sentAt).toLocaleDateString('ru-RU')} · {c.recipients} получателей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{c.openRate}%</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1"><Eye className="h-3 w-3" /> Открытия</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{c.clickRate}%</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1"><MousePointer className="h-3 w-3" /> Клики</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{c.orderRate}%</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">Клики → заказ</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{c.ordersCount}</p>
                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1"><ShoppingBag className="h-3 w-3" /> Заказов</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.b2bLinesheets}>Лайншиты</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.b2bOrders}>B2B Заказы</Link></Button>
      </div>
      <RelatedModulesBlock links={getLinesheetCampaignsLinks()} title="Лайншиты, заказы, выставки, партнёры" className="mt-6" />
    </div>
  );
}
