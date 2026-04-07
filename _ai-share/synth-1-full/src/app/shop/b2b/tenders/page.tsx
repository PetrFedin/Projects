'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gavel, Search, FileText } from 'lucide-react';
import { B2BModulePage } from '@/components/shop/B2BModulePage';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/** B2B-Center: тендеры и аукционы закупок. */
export default function B2BTendersPage() {
  return (
    <B2BModulePage
      title="Тендеры B2B"
      description="Закупки и аукционы (B2B-Center) — участие в торгах, RFQ, поставщики"
      moduleId="tenders"
      icon={Gavel}
      phase={1}
    >
      <Card>
        <CardHeader>
          <CardTitle>Активные тендеры</CardTitle>
          <CardDescription>Участие в закупочных торгах, запросы котировок, аукционы.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 text-sm">
            <p className="text-slate-600">Синхронизация с B2B-Center: просмотр тендеров, подача заявок, торги.</p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" asChild>
                <Link href={ROUTES.shop.b2bSupplierDiscovery}><Search className="h-3 w-3 mr-1" /> Поиск поставщиков</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link href={ROUTES.shop.b2bRfq}><FileText className="h-3 w-3 mr-1" /> RFQ</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </B2BModulePage>
  );
}
