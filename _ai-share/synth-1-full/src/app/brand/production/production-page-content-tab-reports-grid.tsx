'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportToCSV } from '@/lib/production-export-utils';

type SkuRow = { id?: string; name?: string; collection?: string };

export function ProductionPageContentTabReportsGrid({
  filteredSkus,
  filteredProductionOrders,
  samplePendingCount,
  handleAction,
  setActiveTab,
}: {
  filteredSkus: SkuRow[];
  filteredProductionOrders: unknown[];
  samplePendingCount?: number;
  handleAction?: (title: string, detail?: string) => void;
  setActiveTab?: (tab: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="border-border-subtle rounded-2xl border p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-xs font-black">SKU по коллекциям</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-2xl font-black">{filteredSkus.length}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-[9px]"
            onClick={() => {
              exportToCSV(
                filteredSkus.map((s) => ({
                  id: s.id ?? '',
                  name: s.name ?? '',
                  collection: s.collection ?? '',
                })),
                [
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Название' },
                  { key: 'collection', label: 'Коллекция' },
                ],
                'skus'
              );
              handleAction?.('Экспорт', 'SKU экспортированы');
            }}
          >
            Экспорт CSV
          </Button>
        </CardContent>
      </Card>
      <Card className="border-border-subtle rounded-2xl border p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-xs font-black">Заказы (PO)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-2xl font-black">{filteredProductionOrders.length}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-[9px]"
            onClick={() => setActiveTab?.('orders')}
          >
            К заказам →
          </Button>
        </CardContent>
      </Card>
      <Card className="border-border-subtle rounded-2xl border p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-xs font-black">Сэмплы на проверку</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-2xl font-black">{samplePendingCount ?? 0}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-[9px]"
            onClick={() => setActiveTab?.('samples')}
          >
            К сэмплам →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
