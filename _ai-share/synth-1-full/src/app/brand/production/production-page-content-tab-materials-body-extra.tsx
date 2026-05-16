'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GRNPanel } from '@/components/brand/production/GRNPanel';
import { SupplierMatrix } from '@/components/brand/SupplierMatrix';

export function ProductionPageContentTabMaterialsBodyExtra({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { procurementView, setActiveTab } = px;

  return (
    <>
      {procurementView === 'haberdashery' && (
        <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase">Фурнитура</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary text-[10px]">
              Реестр фурнитуры: пуговицы, молнии, нитки.
            </p>
            <SupplierMatrix />
          </CardContent>
        </Card>
      )}
      {procurementView === 'receipt' && <GRNPanel />}
      {(procurementView === 'po' ||
        procurementView === 'quotes' ||
        procurementView === 'subcontract') && (
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase">
              {procurementView === 'po'
                ? 'Заказы на материалы'
                : procurementView === 'quotes'
                  ? 'Коммерческие предложения'
                  : 'Субподряд'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-3 text-[10px]">
              {procurementView === 'po'
                ? 'Заказы поставщикам на ткани и фурнитуру.'
                : procurementView === 'quotes'
                  ? 'Сравнение КП от поставщиков.'
                  : 'Договоры субподряда на пошив, печать.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-[9px]"
              onClick={() => procurementView === 'po' && setActiveTab?.('orders')}
            >
              {procurementView === 'po' ? 'Заказы (PO) →' : 'Перейти'}
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}
