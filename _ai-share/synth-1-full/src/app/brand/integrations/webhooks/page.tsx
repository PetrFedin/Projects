'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Webhook, Plus } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getIntegrationLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

export default function WebhooksPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Webhooks & API"
        description="Уведомления и автоматизация. Настройте webhooks для событий: заказы, сэмплы, оплаты. API для внешних систем."
        icon={Zap}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<><Badge variant="outline" className="text-[9px]">Webhooks</Badge><Badge variant="outline" className="text-[9px]">API</Badge><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/integrations">Интеграции</Link></Button></>}
      />
      <h1 className="text-2xl font-bold uppercase">Webhooks & API</h1>
      <Card className="rounded-xl border border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" /> Webhooks
          </CardTitle>
          <CardDescription>Получайте уведомления о событиях в реальном времени</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-[11px] text-slate-600">События: order.created, sample.approved, payment.received, shipment.sent</p>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Добавить webhook
            </Button>
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getIntegrationLinks()} />
    </div>
  );
}
