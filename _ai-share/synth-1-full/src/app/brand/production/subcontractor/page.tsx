'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSuppliersFinanceBadges } from '@/components/brand/SectionBadgeCta';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import type { SubcontractOrder } from '@/lib/production/subcontractor';
import { useFloorTabDraftState } from '@/hooks/use-floor-tab-draft';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { RegistryPageShell } from '@/components/design-system';

const SUB_DEFAULT: { v: 1; orders: SubcontractOrder[] } = {
  v: 1,
  orders: [
    {
      id: 's1',
      subcontractorId: 'sc1',
      subcontractorName: 'Ателье «Стиль»',
      orderId: 'PO-201',
      workType: 'sewing',
      workTypeLabel: 'Пошив',
      quantity: 500,
      unit: 'шт',
      status: 'in_progress',
      requestedAt: '2026-03-05T10:00:00Z',
    },
    {
      id: 's2',
      subcontractorId: 'sc2',
      subcontractorName: 'Раскройный цех №2',
      orderId: 'PO-202',
      workType: 'cutting',
      workTypeLabel: 'Раскрой',
      quantity: 1200,
      unit: 'шт',
      status: 'completed',
      requestedAt: '2026-03-01T08:00:00Z',
      completedAt: '2026-03-08T17:00:00Z',
      actNumber: 'АКТ-2026-014',
    },
  ],
};

const statusLabels: Record<SubcontractOrder['status'], string> = {
  requested: 'Заявка',
  in_progress: 'В работе',
  completed: 'Выполнено',
  cancelled: 'Отменено',
};

export default function SubcontractorPage() {
  const { toast } = useToast();
  const { data, setData, save, hydrated } = useFloorTabDraftState('subcontractor', SUB_DEFAULT);

  const setOrder = (index: number, patch: Partial<SubcontractOrder>) => {
    setData((prev) => {
      const orders = [...prev.orders];
      orders[index] = { ...orders[index], ...patch };
      return { ...prev, orders };
    });
  };

  return (
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16">
      <SectionInfoCard
        title="Кабинет субподряда"
        description={
          <>
            Заказы на сторону — floor-tab: subcontractor. Контроль статусов по{' '}
            <AcronymWithTooltip abbr="PO" /> и актам.
          </>
        }
        icon={Building2}
        iconBg="bg-bg-surface2"
        iconColor="text-text-secondary"
        badges={<ProductionSuppliersFinanceBadges />}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={ROUTES.brand.production}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold uppercase">Кабинет субподряда</h1>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={!hydrated}
          onClick={async () => {
            await save();
            toast({ title: 'Сохранено', description: 'Субподряд записан.' });
          }}
        >
          <Save className="h-3.5 w-3.5" /> Сохранить
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Заказы на сторону
          </CardTitle>
          <CardDescription>Статусы до интеграции с актами</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.orders.map((o, i) => (
              <li
                key={o.id}
                className="bg-bg-surface2 border-border-subtle flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">{o.subcontractorName}</p>
                  <p className="text-text-secondary text-xs">
                    {o.workTypeLabel} · <AcronymWithTooltip abbr="PO" /> {o.orderId} · {o.quantity}{' '}
                    {o.unit}
                  </p>
                  {o.actNumber && (
                    <p className="text-text-secondary mt-1 text-xs">Акт: {o.actNumber}</p>
                  )}
                </div>
                <Select
                  value={o.status}
                  onValueChange={(v) => setOrder(i, { status: v as SubcontractOrder['status'] })}
                >
                  <SelectTrigger className="h-8 w-[130px] text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabels) as SubcontractOrder['status'][]).map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getProductionLinks()} />
    </RegistryPageShell>
  );
}
