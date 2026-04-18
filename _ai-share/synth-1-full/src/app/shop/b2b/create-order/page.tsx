'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutGrid, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { getAgentBrands } from '@/lib/b2b/agent-context';
import { joorGetDeliveryWindows, isNuOrderConfigured } from '@/lib/b2b/integrations';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { B2BIntegrationStatusWidget } from '@/components/b2b/B2BIntegrationStatusWidget';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';
import { tid } from '@/lib/ui/test-ids';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';
import { B2bOptOrderIdCopy } from '@/components/shop/B2bOptOrderIdCopy';

const SEASONS = ['FW26', 'SS26', 'FW25'] as const;

export default function B2BCreateOrderPage() {
  const searchParams = useSearchParams();
  const dropId = searchParams.get('drop') ?? '';
  const brands = getAgentBrands();
  const windows = joorGetDeliveryWindows();
  const nuOrderEnabled = isNuOrderConfigured();
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{
    success: boolean;
    orderId?: string;
    error?: string;
  } | null>(null);

  return (
    <RegistryPageShell
      className="max-w-4xl space-y-6"
      data-testid={tid.page('shop-b2b-create-order')}
    >
      <ShopB2bContentHeader lead="JOOR: выбор бренда, сезона и коллекции — затем матрица заказа или Working Order." />
      <ShopAnalyticsSegmentErpStrip />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Способ создания</CardTitle>
          <CardDescription>
            Матрица по артикулам или загрузка Excel (NuOrder Working Order).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            asChild
            variant="default"
            className="rounded-xl text-[10px] font-black uppercase tracking-widest"
            size="lg"
          >
            <Link href={ROUTES.shop.b2bMatrix}>
              <LayoutGrid className="mr-2 h-4 w-4" /> Матрица заказа
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-xl text-[10px] font-black uppercase tracking-widest"
            size="lg"
          >
            <Link href={ROUTES.shop.b2bWorkingOrder}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Working Order (Excel)
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
                <Link
                  href={`${ROUTES.shop.b2bMatrix}?brand=${encodeURIComponent(b.name)}&season=${season}`}
                >
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
              Интеграция с NuOrder (OAuth 1.0). Отправка черновика заказа в NuOrder для
              синхронизации.
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
                  setExportResult({
                    success: data.success,
                    orderId: data.orderId,
                    error: data.error,
                  });
                } catch (e) {
                  setExportResult({
                    success: false,
                    error: e instanceof Error ? e.message : 'Request failed',
                  });
                } finally {
                  setExporting(false);
                }
              }}
            >
              {exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Отправить черновик в NuOrder
            </Button>
            {exportResult && (
              <div className="space-y-2">
                {exportResult.success ? (
                  <>
                    <p className="text-sm text-green-600">Черновик отправлен во внешнюю систему.</p>
                    {exportResult.orderId ? (
                      <B2bOptOrderIdCopy orderId={String(exportResult.orderId)} showLabel />
                    ) : null}
                  </>
                ) : (
                  <p className="text-sm text-destructive">Ошибка: {exportResult.error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-create-order-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-create-order-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

      <B2BIntegrationStatusWidget settingsHref={ROUTES.shop.b2bSettings} />
      <RelatedModulesBlock title="Связанные разделы" links={getShopB2BHubLinks()} />
    </RegistryPageShell>
  );
}
