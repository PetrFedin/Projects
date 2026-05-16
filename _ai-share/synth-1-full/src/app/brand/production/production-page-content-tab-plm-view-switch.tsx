'use client';

import { Button } from '@/components/ui/button';

export function ProductionPageContentTabPlmViewSwitch({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { plmView, setPlmView } = px;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      <Button
        variant={plmView === 'matrix' ? 'default' : 'outline'}
        size="sm"
        className="text-[9px]"
        onClick={() => setPlmView?.('matrix')}
      >
        Матрица
      </Button>
      <Button
        variant={plmView === 'variants' ? 'default' : 'outline'}
        size="sm"
        className="text-[9px]"
        onClick={() => setPlmView?.('variants')}
      >
        Варианты
      </Button>
      <Button
        variant={plmView === 'pim' ? 'default' : 'outline'}
        size="sm"
        className="text-[9px]"
        onClick={() => setPlmView?.('pim')}
      >
        Версии лекал
      </Button>
      <Button
        variant={plmView === 'techpack' ? 'default' : 'outline'}
        size="sm"
        className="text-[9px]"
        onClick={() => setPlmView?.('techpack')}
      >
        Tech Pack
      </Button>
    </div>
  );
}
