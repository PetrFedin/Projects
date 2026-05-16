'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type MaterialsBodyRollsSfcOperation = {
  id?: string;
  collection?: string;
  status?: string;
  op?: string;
  label?: string;
  confirmed?: boolean;
};

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabMaterialsBodyRollsSfcOps({
  filteredOps,
  fullOps,
  cn,
  onToggleConfirmation,
}: {
  filteredOps: MaterialsBodyRollsSfcOperation[];
  fullOps: MaterialsBodyRollsSfcOperation[];
  cn: CnFn;
  onToggleConfirmation?: (indexInFullList: number) => void;
}) {
  if (filteredOps.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-[10px] font-black uppercase">SFC операции</p>
      {filteredOps.map((op) => {
        const origIdx = fullOps.indexOf(op);
        return (
          <div
            key={op.id ?? `sfc-${origIdx}`}
            className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <Badge
                className={cn(
                  'mb-2 text-[8px]',
                  op.status === 'success'
                    ? 'bg-emerald-100 text-emerald-600'
                    : op.status === 'warning'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-border-subtle'
                )}
              >
                {op.status}
              </Badge>
              <p className="text-[11px] font-bold">{op.op || op.label || 'Операция'}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[9px]"
              onClick={() => onToggleConfirmation?.(origIdx)}
            >
              {op.confirmed ? 'Подтверждено' : 'Подтвердить'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
