'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/production-export-utils';

export const AUDIT_FILTER_VALUES = ['all', 'bom', 'sample', 'po', 'status'] as const;
export type AuditFilterValue = (typeof AUDIT_FILTER_VALUES)[number];

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabAuditBodyToolbar({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setAuditFilter, auditFilter, filteredAuditLog, handleAction } = px;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2">
        {AUDIT_FILTER_VALUES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAuditFilter?.(v)}
            className={cn(
              'rounded-xl px-4 py-2 text-[9px] font-bold uppercase transition-all',
              auditFilter === v
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'text-text-secondary hover:bg-bg-surface2'
            )}
          >
            {v === 'all' ? 'Все' : v}
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-[9px]"
        onClick={() => {
          exportToCSV(
            (filteredAuditLog || []).map((a: Record<string, unknown>) => ({
              actionLabel: a.actionLabel,
              entity: a.entity,
              user: a.user,
              time: a.time,
              detail: a.detail,
            })),
            [
              { key: 'actionLabel', label: 'Действие' },
              { key: 'entity', label: 'Сущность' },
              { key: 'user', label: 'Пользователь' },
              { key: 'time', label: 'Время' },
              { key: 'detail', label: 'Детали' },
            ],
            'audit-log'
          );
          handleAction?.('Экспорт', 'Журнал аудита экспортирован');
        }}
      >
        <Download className="h-3.5 w-3.5" /> Экспорт
      </Button>
    </div>
  );
}
