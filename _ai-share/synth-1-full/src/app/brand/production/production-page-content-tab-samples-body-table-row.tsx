'use client';

import { TableRow } from '@/components/ui/table';
import { DEFAULT_SAMPLE_STAGES } from '@/app/brand/production/production-page-content-tab-samples-body-default-stages';
import { ProductionPageContentTabSamplesBodyTableRowCells } from '@/app/brand/production/production-page-content-tab-samples-body-table-row-cells';
import { ProductionPageContentTabSamplesBodyTableRowActions } from '@/app/brand/production/production-page-content-tab-samples-body-table-row-actions';

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

export function ProductionPageContentTabSamplesBodyTableRow({
  s,
  p,
  cn,
}: {
  s: SampleRow;
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const {
    selectedSkuId,
    perms,
    setSampleStatuses,
    setRejectSample,
    handleAction,
    STAGE_LABELS = {},
    SAMPLE_STAGES = [],
    setSelectedSkuId,
  } = px;

  const stages: string[] = Array.isArray(SAMPLE_STAGES)
    ? (SAMPLE_STAGES as string[])
    : [...DEFAULT_SAMPLE_STAGES];
  const stageIdx = stages.indexOf(s.stage);

  return (
    <TableRow
      className="hover:bg-accent-primary/10 cursor-pointer"
      onClick={() => setSelectedSkuId?.(selectedSkuId === s.skuId ? null : s.skuId)}
    >
      <ProductionPageContentTabSamplesBodyTableRowCells
        s={s}
        STAGE_LABELS={STAGE_LABELS as Record<string, string>}
        cn={cn}
      />
      <ProductionPageContentTabSamplesBodyTableRowActions
        s={s}
        perms={perms}
        stages={stages}
        stageIdx={stageIdx}
        STAGE_LABELS={STAGE_LABELS as Record<string, string>}
        setSampleStatuses={setSampleStatuses}
        setRejectSample={setRejectSample}
        handleAction={handleAction}
      />
    </TableRow>
  );
}
