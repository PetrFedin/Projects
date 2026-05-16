'use client';

import { History } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductionPageContentTabAuditBodyToolbar } from '@/app/brand/production/production-page-content-tab-audit-body-toolbar';
import { ProductionPageContentTabAuditBodyTable } from '@/app/brand/production/production-page-content-tab-audit-body-table';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabAuditBody({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { filteredAuditLog } = px;
  const rows = (filteredAuditLog || []) as Array<{
    id: string;
    actionLabel?: string;
    entity?: string;
    user?: string;
    time?: string;
    detail?: unknown;
    payload?: unknown;
    comment?: unknown;
  }>;

  return (
    <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
      <div className="from-text-secondary to-bg-surface2 h-1 w-full bg-gradient-to-r" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-bg-surface2 text-text-secondary flex h-10 w-10 items-center justify-center rounded-xl">
            <History className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase">Журнал изменений</CardTitle>
            <CardDescription className="text-[10px]">
              BOM, сэмплы, PO, статусы — кто и когда изменил
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ProductionPageContentTabAuditBodyToolbar p={p} cn={cn} />
        <ProductionPageContentTabAuditBodyTable rows={rows} />
      </CardContent>
    </Card>
  );
}
