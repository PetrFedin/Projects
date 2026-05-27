'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductionPageContentTabSamplesBodyTableRow } from '@/app/brand/production/production-page-content-tab-samples-body-table-row';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabSamplesBodyTable({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { displaySampleStatuses, filteredSampleStatuses, sampleStageFilter } = px;

  const rows = ((displaySampleStatuses || filteredSampleStatuses || []) as any[]).filter(
    (s: any) => {
      if (!sampleStageFilter || sampleStageFilter === 'all') return true;
      if (sampleStageFilter === 'in_review')
        return s.status === 'in_review' || s.status === 'waiting';
      if (sampleStageFilter === 'approved') return s.status === 'approved';
      return s.stage === sampleStageFilter;
    }
  );

  return (
    <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[9px]">SKU</TableHead>
            <TableHead className="text-[9px]">Этап</TableHead>
            <TableHead className="text-[9px]">Статус</TableHead>
            <TableHead className="text-[9px]">Дедлайн</TableHead>
            <TableHead className="text-[9px]">Фабрика</TableHead>
            <TableHead className="text-right text-[9px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s: any) => (
            <ProductionPageContentTabSamplesBodyTableRow key={s.skuId} s={s} p={p} cn={cn} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
