'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type LossRow = {
  type?: string;
  category?: string;
  item?: string;
  collection?: string;
  cost?: string;
  reason?: string;
};

function lossCategoryLabel(category: string | undefined): string | null {
  if (!category) return null;
  if (category === 'defect') return 'Брак';
  if (category === 'overrun') return 'Перерасход';
  if (category === 'writeoff') return 'Списание';
  return category;
}

export function ProductionPageContentTabLossesBodyRegistryTable({
  rows,
  toggleCollectionSelection,
  setActiveTab,
}: {
  rows: LossRow[];
  toggleCollectionSelection?: (id: string) => void;
  setActiveTab?: (tab: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[9px]">Тип</TableHead>
          <TableHead className="text-[9px]">Наименование</TableHead>
          <TableHead className="text-[9px]">Коллекция</TableHead>
          <TableHead className="text-[9px]">Стоимость</TableHead>
          <TableHead className="text-[9px]">Причина</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((l, i) => (
          <TableRow
            key={i}
            className="hover:bg-bg-surface2/80 cursor-pointer"
            onClick={() =>
              l.collection &&
              (toggleCollectionSelection?.(l.collection),
              setActiveTab?.(l.type === 'model' ? 'plm' : 'materials'))
            }
          >
            <TableCell className="text-[10px]">
              <div className="flex flex-col gap-0.5">
                <Badge variant="outline" className="w-fit text-[8px]">
                  {l.type === 'material' ? 'Материал' : 'Модель'}
                </Badge>
                {l.category && (
                  <span className="text-text-muted text-[8px]">{lossCategoryLabel(l.category)}</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-[10px]">{l.item}</TableCell>
            <TableCell className="text-[10px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  l.collection &&
                    (toggleCollectionSelection?.(l.collection), setActiveTab?.('plm'));
                }}
                className="text-accent-primary font-medium hover:underline"
              >
                {l.collection || '—'}
              </button>
            </TableCell>
            <TableCell className="text-[10px]">{l.cost}</TableCell>
            <TableCell className="text-[10px]">{l.reason}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
