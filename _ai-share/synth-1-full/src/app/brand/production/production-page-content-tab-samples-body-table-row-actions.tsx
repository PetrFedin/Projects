'use client';

import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';

type SampleRow = {
  skuId: string;
  skuName: string;
  stage: string;
  status: string;
};

type SampleStatusRow = SampleRow & Record<string, unknown>;

export function ProductionPageContentTabSamplesBodyTableRowActions({
  s,
  perms,
  stages,
  stageIdx,
  STAGE_LABELS,
  setSampleStatuses,
  setRejectSample,
  handleAction,
}: {
  s: SampleRow;
  perms?: { canCreatePO?: boolean };
  stages: string[];
  stageIdx: number;
  STAGE_LABELS: Record<string, string>;
  setSampleStatuses?: (fn: (prev: SampleStatusRow[]) => SampleStatusRow[]) => void;
  setRejectSample?: (v: { skuId: string; skuName: string }) => void;
  handleAction?: (title: string, detail?: string) => void;
}) {
  return (
    <TableCell className="text-right">
      {perms?.canCreatePO && s.status !== 'approved' && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="mr-1 h-7 border-emerald-200 text-[9px] text-emerald-600 hover:bg-emerald-50"
            onClick={() => {
              setSampleStatuses?.((prev) =>
                prev.map((x) => (x.skuId === s.skuId ? { ...x, status: 'approved' } : x))
              );
              handleAction?.('Сэмпл утверждён', `${s.skuName} — можно создавать PO`);
            }}
          >
            Утвердить
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="mr-1 h-7 border-rose-200 text-[9px] text-rose-600 hover:bg-rose-50"
            onClick={() => setRejectSample?.({ skuId: s.skuId, skuName: s.skuName })}
          >
            Отклонить
          </Button>
          {stageIdx >= 0 && stages[stageIdx + 1] && (
            <Button
              variant="ghost"
              size="sm"
              className="text-accent-primary h-7 text-[9px]"
              onClick={() => {
                const nextStage = stages[stageIdx + 1]!;
                setSampleStatuses?.((prev) =>
                  prev.map((x) =>
                    x.skuId === s.skuId
                      ? {
                          ...x,
                          stage: nextStage,
                          stageLabel: STAGE_LABELS[nextStage] || nextStage,
                        }
                      : x
                  )
                );
                handleAction?.('Этап изменён', `${s.skuName} → ${STAGE_LABELS[nextStage]}`);
              }}
            >
              → {STAGE_LABELS[stages[stageIdx + 1]!]}
            </Button>
          )}
        </>
      )}
    </TableCell>
  );
}
