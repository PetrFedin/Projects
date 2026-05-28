'use client';

import { Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { FinancialCalendarPanel } from '@/components/brand/production/FinancialCalendarPanel';
import { SupplierPenaltyTerms } from '@/components/brand/production/SupplierPenaltyTerms';
import { CashFlowSummary } from '@/components/brand/production/ProductionEnhancementsHub';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabFinance({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setFinanceView, financeView, filteredProductionOrders, handleAction } = px;

  return (
    <TabsContent value="finance" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Финансы" barColor="bg-emerald-600" />
      <SectionInfoCard
        title="Финансы"
        description="Платежи по PO, поступления, штрафы по фабрикам. Cash flow, план платежей, согласование. Привязка к PO и документам."
        icon={Wallet}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Платежи → PO
            </Badge>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-5">
            <CashFlowSummary />
          </CardContent>
        </Card>
        <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
          <div className="from-accent-primary to-accent-primary h-1 w-full bg-gradient-to-r" />
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase">Условия и штрафы</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <SupplierPenaltyTerms
              factoryName={(filteredProductionOrders?.[0] as any)?.factory || 'Global Textiles'}
            />
          </CardContent>
        </Card>
      </div>
      <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1.5">
        {(['schedule', 'terms', 'factoring'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setFinanceView?.(v)}
            className={cn(
              'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
              financeView === v ? 'text-accent-primary bg-white shadow-sm' : 'text-text-secondary'
            )}
          >
            {v === 'schedule' && 'Платежи'}
            {v === 'terms' && 'Условия'}
            {v === 'factoring' && 'Факторинг'}
          </button>
        ))}
      </div>
      <FinancialCalendarPanel />
      {financeView === 'terms' && (
        <SupplierPenaltyTerms
          factoryName="Global Textiles"
          factoryId="F-01"
          onSave={() => handleAction?.('Условия сохранены', 'Штрафные санкции обновлены')}
        />
      )}
    </TabsContent>
  );
}
