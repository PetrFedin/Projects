'use client';

import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { POOverviewAndPayments } from '@/components/brand/production/POOverviewAndPayments';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ProductionPageContentTabOrdersBody } from '@/app/brand/production/production-page-content-tab-orders-body';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabOrders({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { filteredProductionOrders, handleAction, setActiveTab } = px;

  return (
    <TabsContent value="orders" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Заказы на производство (PO)" barColor="bg-emerald-600" />
      <SectionInfoCard
        title="Заказы (PO)"
        description="PO связаны с коллекцией и фабрикой. Статус оплаты влияет на финансы. Здесь — размерная сетка, цвета, прогресс, связь с логистикой и QC-отчётами."
        icon={Package}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Коллекция, фабрика
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Оплата, логистика
            </Badge>
          </>
        }
      />
      <POOverviewAndPayments
        orders={(filteredProductionOrders || []).map((o: any) => ({
          id: o.id,
          collection: o.collection,
          factory: o.factory,
          total: o.total,
          status: o.status,
          paymentStatus:
            o.paymentStatus ||
            (o.payment === 'Оплачено' ? 'paid' : o.payment === 'Аванс 50%' ? 'advance' : 'pending'),
          dueDate: o.dueDate,
        }))}
        onPayClick={(id) => handleAction?.('Оплата', `Переход к оплате PO ${id}`)}
        onNavigateToFinance={() => setActiveTab?.('finance')}
      />
      <ProductionPageContentTabOrdersBody p={p} cn={cn} />
    </TabsContent>
  );
}
