'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { SLACountdown } from '@/components/brand/production/ProductionSectionEnhancements';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

type SampleRow = {
  skuId: string;
  skuName: string;
  stage: string;
  stageLabel?: string;
  status: string;
  dueDate?: string;
  slaOverdue?: boolean;
  factory?: string;
};

export function ProductionPageContentTabSamplesBodyTableRowCells({
  s,
  STAGE_LABELS,
  cn,
}: {
  s: SampleRow;
  STAGE_LABELS: Record<string, string>;
  cn: CnFn;
}) {
  return (
    <>
      <TableCell className="text-[10px] font-medium">{s.skuName}</TableCell>
      <TableCell>
        <Badge className="text-[8px]">{STAGE_LABELS[s.stage] || s.stageLabel}</Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={cn(
            'text-[8px]',
            s.status === 'approved'
              ? 'bg-emerald-500 text-white'
              : s.status === 'rejected'
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-white'
          )}
        >
          {s.status === 'approved'
            ? 'Утверждено'
            : s.status === 'rejected'
              ? 'Отклонено'
              : 'На проверке'}
        </Badge>
      </TableCell>
      <TableCell className="text-[10px]">
        <SLACountdown dueDate={s.dueDate} overdue={s.slaOverdue} />
      </TableCell>
      <TableCell className="text-[10px] font-bold">{s.factory}</TableCell>
    </>
  );
}
