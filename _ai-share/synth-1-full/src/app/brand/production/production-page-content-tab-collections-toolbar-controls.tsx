'use client';

import { Download, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/production-export-utils';

export const COLLECTION_SORT_KEYS = ['name', 'status', 'readiness'] as const;

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

type CollectionRow = Record<string, unknown> & {
  id?: string;
  name?: string;
  type?: string;
  status?: string;
  readiness?: string;
  budget?: string;
  deadline?: string;
};

export function ProductionPageContentTabCollectionsToolbarControls({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { collections, filteredCollections, handleAction } = px;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-text-muted text-[9px] font-bold uppercase">Сортировка:</span>
      {COLLECTION_SORT_KEYS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => px.setCollectionSortOrder?.(s)}
          className={cn(
            'rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase',
            (px.collectionSortOrder || 'name') === s
              ? 'bg-accent-primary/15 text-accent-primary'
              : 'text-text-secondary hover:bg-bg-surface2'
          )}
        >
          {s === 'name' ? 'Имя' : s === 'status' ? 'Статус' : 'Готовность'}
        </button>
      ))}
      <div className="bg-border-subtle h-5 w-px" />
      <button
        type="button"
        onClick={() => px.setCollectionViewMode?.('grid')}
        className={cn(
          'rounded-lg p-1.5',
          (px.collectionViewMode || 'grid') === 'grid'
            ? 'bg-accent-primary/15 text-accent-primary'
            : 'text-text-muted hover:bg-bg-surface2'
        )}
        title="Сетка"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => px.setCollectionViewMode?.('list')}
        className={cn(
          'rounded-lg p-1.5',
          (px.collectionViewMode || 'grid') === 'list'
            ? 'bg-accent-primary/15 text-accent-primary'
            : 'text-text-muted hover:bg-bg-surface2'
        )}
        title="Список"
      >
        <List className="h-4 w-4" />
      </button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1 text-[9px]"
        onClick={() => {
          const list = (filteredCollections ?? collections ?? []) as CollectionRow[];
          exportToCSV(
            list
              .filter((c) => c.id !== 'ARCHIVE')
              .map((c) => ({
                id: c.id ?? '',
                name: c.name ?? '',
                type: c.type ?? '',
                status: c.status ?? '',
                readiness: c.readiness ?? '',
                budget: c.budget ?? '',
                deadline: c.deadline ?? '',
              })),
            [
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Название' },
              { key: 'type', label: 'Тип' },
              { key: 'status', label: 'Статус' },
              { key: 'readiness', label: 'Готовность' },
              { key: 'budget', label: 'Бюджет' },
              { key: 'deadline', label: 'Дедлайн' },
            ],
            'collections'
          );
          handleAction?.('Экспорт', 'Коллекции экспортированы в CSV');
        }}
      >
        <Download className="h-3.5 w-3.5" /> Экспорт
      </Button>
    </div>
  );
}
