'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSearch, ArrowLeft, Cloud } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { MaterialsSuppliersBadges } from '@/components/brand/SectionBadgeCta';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { ROUTES } from '@/lib/routes';
import { getSupplierLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { listRfq, type SupplierRfq } from '@/lib/supplier-rfq';

const statusLabels: Record<SupplierRfq['status'], string> = {
  draft: 'Черновик',
  sent: 'Отправлено',
  quotes_received: 'Предложения получены',
  awarded: 'Присуждено',
  cancelled: 'Отменено',
};

export default function SupplierRfqPage() {
  const [rfqList, setRfqList] = useState<SupplierRfq[]>([]);
  const [catalogSummary, setCatalogSummary] = useState<{ productCount: number; source: string; lastSync?: string } | null>(null);

  useEffect(() => {
    listRfq().then(setRfqList);
  }, []);

  useEffect(() => {
    fetch('/api/b2b/integrations/catalog-summary')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && (data.source === 'fashion_cloud' || data.productCount >= 0) ? setCatalogSummary(data) : null)
      .catch(() => {});
  }, []);

  const rfq = rfqList[0];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Supplier RFQ Engine"
        description="Тендеры на ткань и фурнитуру. Создание запроса из Tech Pack, получение предложений, присуждение. Связь с Materials и поставщиками. РФ: рубли, ЭДО."
        icon={FileSearch}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={<MaterialsSuppliersBadges />}
      />
      <div className="flex items-center gap-3">
        <Link href={ROUTES.brand.suppliers}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold uppercase">Supplier RFQ</h1>
      </div>

      <B2BIntegrationStatusWidget settingsHref={ROUTES.brand.integrations} />
      {catalogSummary && catalogSummary.source === 'fashion_cloud' && (
        <Card className="border-slate-200">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Cloud className="h-4 w-4" /> Fashion Cloud
            </CardTitle>
            <CardDescription>
              В каталоге синдикации {catalogSummary.productCount} продуктов. Данные для RFQ можно брать из каталога (GTIN, артикулы).
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" /> {rfq?.title ?? 'Supplier RFQ'}
          </CardTitle>
          <CardDescription>Позиции и предложения поставщиков. При API — отправка запроса, сбор котировок, присуждение.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rfq && (
            <>
          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1">Позиции</p>
            <ul className="space-y-1 text-sm">
              {rfq.items.map((i) => (
                <li key={i.id}>{i.description} — {i.quantity} {i.unit}{i.techPackRef ? ` (${i.techPackRef})` : ''}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1">Предложения</p>
            <ul className="space-y-2">
              {rfq.quotes.map((q) => (
                <li key={q.supplierId} className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium">{q.supplierName}</span>
                  <span>{q.amountRub != null ? `${q.amountRub.toLocaleString('ru-RU')} ₽` : ''} · {q.leadTimeDays} дн.</span>
                </li>
              ))}
            </ul>
          </div>
          <Badge variant="outline" className="text-[10px]">{statusLabels[rfq.status]}</Badge>
            </>
          )}
          <p className="text-xs text-slate-400">API: SUPPLIER_RFQ_API — создание, отправка, присуждение.</p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getSupplierLinks()} />
    </div>
  );
}
