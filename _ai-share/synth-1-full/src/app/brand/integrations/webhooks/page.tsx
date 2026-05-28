'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Webhook, Plus } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getIntegrationsLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';

export default function WebhooksPage() {
  return (
    <CabinetPageContent maxWidth="5xl" className="space-y-6 px-4 py-6 pb-24 sm:px-6">
      <SectionInfoCard
        title="Webhooks & API"
        description="Уведомления и автоматизация. Настройте webhooks для событий: заказы, сэмплы, оплаты. API для внешних систем."
        icon={Zap}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Webhooks
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              API
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.integrations}>Интеграции</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Webhooks & API</h1>
      <Card className="border-accent-primary/20 bg-accent-primary/10 rounded-xl border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" /> Webhooks
          </CardTitle>
          <CardDescription>Получайте уведомления о событиях в реальном времени</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-text-secondary text-[11px]">
              События: order.created, sample.approved, payment.received, shipment.sent
            </p>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Добавить webhook
            </Button>
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getIntegrationsLinks()} />
    </CabinetPageContent>
  );
}
