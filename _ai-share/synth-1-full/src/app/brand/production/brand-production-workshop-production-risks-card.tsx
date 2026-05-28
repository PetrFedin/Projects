'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type {
  FloorMilestonesSummary,
  FloorQcSummary,
  FloorSubcontractSummary,
} from '@/app/brand/production/production-page-floor-mock-summaries';

export function BrandProductionWorkshopProductionRisksCard(props: {
  qcSummary: FloorQcSummary;
  milestonesSummary: FloorMilestonesSummary;
  subcontractSummary: FloorSubcontractSummary;
  hasRisks: boolean;
}) {
  const { qcSummary, milestonesSummary, subcontractSummary, hasRisks } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-tight">
          Сводка по производству и риски по коллекции
        </CardTitle>
        <CardDescription className="text-xs">
          QC, видео‑этапы и субподряд по текущей коллекции. Помогает увидеть, есть ли риски по
          качеству, срокам и выполнению работ.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-[11px] md:grid-cols-3">
        <div className="border-border-subtle bg-bg-surface2/80 space-y-1 rounded-xl border p-3">
          <p className="text-text-primary font-bold">QC инспекции</p>
          <p className="text-text-secondary">
            Всего: <strong>{qcSummary.total}</strong>
          </p>
          <p className="text-emerald-700">
            Принято: <strong>{qcSummary.passed}</strong>
          </p>
          <p className={qcSummary.withIssues > 0 ? 'text-amber-700' : 'text-text-secondary'}>
            С вопросами: <strong>{qcSummary.withIssues}</strong>
          </p>
        </div>
        <div className="border-border-subtle bg-bg-surface2/80 space-y-1 rounded-xl border p-3">
          <p className="text-text-primary font-bold">Видео‑этапы по PO</p>
          <p className="text-text-secondary">
            Этапов: <strong>{milestonesSummary.total}</strong>
          </p>
          <p className="text-emerald-700">
            Утверждено: <strong>{milestonesSummary.approved}</strong>
          </p>
          <p className={milestonesSummary.pending > 0 ? 'text-amber-700' : 'text-text-secondary'}>
            Ожидает: <strong>{milestonesSummary.pending}</strong>
          </p>
        </div>
        <div className="border-border-subtle bg-bg-surface2/80 space-y-1 rounded-xl border p-3">
          <p className="text-text-primary font-bold">Субподряд (заказы на сторону)</p>
          <p className="text-text-secondary">
            Всего: <strong>{subcontractSummary.total}</strong>
          </p>
          <p className="text-emerald-700">
            Выполнено: <strong>{subcontractSummary.completed}</strong>
          </p>
          <p
            className={subcontractSummary.inProgress > 0 ? 'text-amber-700' : 'text-text-secondary'}
          >
            В работе: <strong>{subcontractSummary.inProgress}</strong>
          </p>
        </div>
        <div
          className={cn(
            'mt-1 flex items-center gap-2 rounded-xl border p-3 md:col-span-3',
            hasRisks ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50/80'
          )}
        >
          <span
            className={cn('h-2 w-2 rounded-full', hasRisks ? 'bg-amber-500' : 'bg-emerald-500')}
          />
          <p className="text-text-primary text-[10px]">
            {hasRisks
              ? 'Есть риски по коллекции: проверьте инспекции QC, незавершённые видео‑этапы и сроки отмены PO по дропам.'
              : 'Критических рисков по коллекции не выявлено: QC пройден, ключевые этапы подтверждены, дропы в пределах дедлайнов.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
