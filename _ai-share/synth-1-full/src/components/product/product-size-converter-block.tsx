'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Ruler, Info, Globe, ChevronRight } from 'lucide-react';
import { convertSize } from '@/lib/fashion/size-converter';

export const ProductSizeConverterBlock: React.FC<{ size: string; category: string }> = ({
  size,
  category,
}) => {
  const conversions = convertSize(size, category);

  return (
    <Card className="border-accent-primary/15 bg-accent-primary/10 border-2 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="text-accent-primary h-4 w-4" />
          <h4 className="text-text-secondary text-xs font-bold uppercase tracking-tight">
            Таблица соответствия
          </h4>
        </div>
        <div className="text-accent-primary flex items-center gap-1 text-[10px] font-black uppercase">
          <Globe className="h-3 w-3" /> Multi-Region
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {conversions.map((c) => (
          <div
            key={c.system}
            className="border-accent-primary/15 rounded-lg border bg-white p-2 text-center shadow-sm"
          >
            <div className="text-accent-primary mb-1.5 text-[9px] font-black uppercase leading-none">
              {c.system}
            </div>
            <div className="text-text-primary text-sm font-black">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-accent-primary/10 border-accent-primary/20 mt-4 flex items-start gap-2 rounded-md border p-2">
        <Info className="text-accent-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="text-accent-primary text-[10px] leading-tight">
          <b>Совет:</b> Российские размеры (RU) соответствуют ГОСТу. Рекомендуем выбирать основной
          RU размер.
        </div>
      </div>
    </Card>
  );
};
