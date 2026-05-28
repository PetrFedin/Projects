'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CollectionChecklistItem } from '@/app/brand/production/production-page-collection-articles-helpers';
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  FileText,
  ListTodo,
} from 'lucide-react';

export function BrandProductionCollectionChecklistCard(props: {
  items: readonly CollectionChecklistItem[];
}) {
  return (
    <Card className="border-amber-100 bg-gradient-to-br from-amber-50/50 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
          <ListTodo className="h-4 w-4 text-amber-600" aria-hidden /> Что сделать по коллекции
        </CardTitle>
        <CardDescription className="text-xs">
          Чек-лист по статусам артикулов. Переход в нужный раздел по клику.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {props.items.map((item) => (
            <li key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-white',
                    item.done ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-white'
                  )}
                >
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleDot className="h-4 w-4 shrink-0 text-amber-500" />
                  )}
                  <span
                    className={cn(
                      'text-[11px] font-medium',
                      item.done ? 'text-emerald-800' : 'text-text-primary'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-3',
                    item.done
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-border-subtle bg-bg-surface2/80'
                  )}
                >
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleDot className="text-text-muted h-4 w-4 shrink-0" />
                  )}
                  <span
                    className={cn(
                      'text-[11px] font-medium',
                      item.done ? 'text-emerald-800' : 'text-text-secondary'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function BrandProductionWorkshopAttentionSummary(props: {
  needsAttentionCount: number;
  withoutTechPackCount: number;
  withoutPoCount: number;
  onNeedsAttentionClick: () => void;
}) {
  const { needsAttentionCount, withoutTechPackCount, withoutPoCount, onNeedsAttentionClick } =
    props;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card
        className="cursor-pointer border-amber-200 bg-amber-50/30 transition-colors hover:bg-amber-50/50"
        onClick={onNeedsAttentionClick}
      >
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Требуют внимания
            </p>
            <p className="text-text-primary text-lg font-black">{needsAttentionCount} артикулов</p>
            <p className="text-text-secondary text-[10px]">Без Tech Pack или без PO</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border-default">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
            <FileText className="text-text-secondary h-5 w-5" />
          </div>
          <div>
            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
              Без Tech Pack
            </p>
            <p className="text-text-primary text-lg font-black">{withoutTechPackCount} арт.</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border-default">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="bg-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-xl">
            <ClipboardCheck className="text-accent-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
              Без PO
            </p>
            <p className="text-text-primary text-lg font-black">{withoutPoCount} арт.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
