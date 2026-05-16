'use client';

import { Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ProductionPageContentTabLossesBodyRegistryHeader({
  onAddLoss,
}: {
  onAddLoss?: () => void;
}) {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-sm font-black uppercase">Реестр потерь</CardTitle>
          <CardDescription className="text-[10px]">
            Материалы, готовые изделия — брак, перерасход, списание
          </CardDescription>
        </div>
      </div>
      <Button
        size="sm"
        className="h-9 rounded-xl text-[9px] font-bold"
        onClick={() => onAddLoss?.()}
      >
        <Plus className="mr-1 h-4 w-4" /> Добавить
      </Button>
    </CardHeader>
  );
}
