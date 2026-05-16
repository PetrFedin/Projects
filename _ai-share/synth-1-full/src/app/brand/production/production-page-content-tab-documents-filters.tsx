'use client';

import { Button } from '@/components/ui/button';
import { DocumentFilterBar } from '@/components/brand/production/ProductionSectionEnhancements';
import { exportToCSV } from '@/lib/production-export-utils';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabDocumentsFilters({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { docFilter, setDocFilter, productionDocuments, handleAction, setDocStatusFilter, docStatusFilter } =
    px;

  return (
    <>
      <DocumentFilterBar
        filter={docFilter || 'all'}
        onFilter={(v) => setDocFilter?.(v)}
        types={['tz', 'contract', 'invoice', 'qc', 'cmr']}
      />
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="text-text-muted self-center text-[9px] font-bold">Статус:</span>
        {['all', 'Утверждено', 'Подписан', 'Ожидает оплаты', 'PASSED', 'В пути'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setDocStatusFilter?.(s)}
            className={cn(
              'rounded-lg px-2.5 py-1 text-[9px] font-bold',
              (docStatusFilter || 'all') === s
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'text-text-secondary hover:bg-bg-surface2'
            )}
          >
            {s === 'all' ? 'Все' : s}
          </button>
        ))}
      </div>
      <div className="mb-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-[9px]"
          onClick={() => {
            exportToCSV(
              (productionDocuments || []).map((d: any) => ({
                type: d.type,
                name: d.name,
                collection: d.collection,
                status: d.status,
              })),
              [
                { key: 'type', label: 'Тип' },
                { key: 'name', label: 'Наименование' },
                { key: 'collection', label: 'Коллекция' },
                { key: 'status', label: 'Статус' },
              ],
              'production-documents'
            );
            handleAction?.('Экспорт', 'Документы экспортированы в CSV');
          }}
        >
          Экспорт CSV
        </Button>
      </div>
    </>
  );
}
