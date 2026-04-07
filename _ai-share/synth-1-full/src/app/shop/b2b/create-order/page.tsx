'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, ArrowLeft, LayoutGrid, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getAgentBrands } from '@/lib/b2b/agent-context';
import { joorGetDeliveryWindows, isNuOrderConfigured } from '@/lib/b2b/integrations';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

const SEASONS = ['FW26', 'SS26', 'FW25'] as const;

export default function B2BCreateOrderPage() {
  const searchParams = useSearchParams();
  const dropId = searchParams.get('drop') ?? '';
  const brands = getAgentBrands();
  const windows = joorGetDeliveryWindows();
  const nuOrderEnabled = isNuOrderConfigured();
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{ success: boolean; orderId?: string; error?: string } | null>(null);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <FilePlus className="h-6 w-6" /> Создать заказ
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            JOOR: выбор бренда, сезона и коллекции — затем матрица заказа или Working Order.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Способ создания</CardTitle>
          <CardDescription>Матрица по артикулам или загрузка Excel (NuOrder Working Order).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="default" className="rounded-xl font-black uppercase text-[10px] tracking-widest" size="lg">
            <Link href={ROUTES.shop.b2bMatrix}>
              <LayoutGrid className="h-4 w-4 mr-2" /> Матрица заказа
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest" size="lg">
            <Link href={ROUTES.shop.b2bWorkingOrder}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Working Order (Excel)
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Бренд и сезон</CardTitle>
          <CardDescription>Быстрый переход к заказу по бренду.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {brands.map((b) =>
            SEASONS.map((season) => (
              <Button
                key={`${b.id}-${season}`}
                variant="outline"
                size="sm"
                className="rounded-lg text-[10px] font-black uppercase"
                asChild
              >
                <Link href={`${ROUTES.shop.b2bMatrix}?brand=${encodeURIComponent(b.name)}&season=${season}`}>
                  {b.name} {season}
                </Link>
              </Button>
            ))
          )}
        </CardContent>
      </Card>

      {windows.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase">Окно доставки</CardTitle>
            <CardDescription>Текущий выбранный дроп: {dropId || 'не выбран'}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="rounded-lg" asChild>
              <Link href={ROUTES.shop.b2bDeliveryCalendar}>Выбрать в календаре поставок</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {nuOrderEnabled && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase">Экспорт в NuOrder</CardTitle>
            <CardDescription>
              Интеграция с NuOrder (OAuth 1.0). Отправка черновика заказа в NuOrder для синхронизации.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={exporting}
              onClick={async () => {
                setExportResult(null);
                setExporting(true);
                try {
                  const res = await fetch('/api/b2b/export-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      provider: 'nuorder',
                      payload: { company_code: 'MAIN', buyer: '', lines: [] },
                    }),
                  });
                  const data = await res.json();
                  setExportResult({ success: data.success, orderId: data.orderId, error: data.error });
                } catch (e) {
                  setExportResult({ success: false, error: e instanceof Error ? e.message : 'Request failed' });
                } finally {
                  setExporting(false);
                }
              }}
            >
              {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Отправить черновик в NuOrder
            </Button>
            {exportResult && (
              <p className={`text-sm ${exportResult.success ? 'text-green-600' : 'text-destructive'}`}>
                {exportResult.success
                  ? `Готово. Order ID: ${exportResult.orderId}`
                  : `Ошибка: ${exportResult.error}`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <B2BIntegrationStatusWidget settingsHref={ROUTES.shop.b2bSettings} />
      <RelatedModulesBlock title="Связанные разделы" links={getShopB2BHubLinks()} />
    </div>
  );
}
