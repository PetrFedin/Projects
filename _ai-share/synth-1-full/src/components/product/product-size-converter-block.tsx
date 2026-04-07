'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Ruler, Info, Globe, ChevronRight } from 'lucide-react';
import { convertSize } from '@/lib/fashion/size-converter';

export const ProductSizeConverterBlock: React.FC<{ size: string, category: string }> = ({ size, category }) => {
  const conversions = convertSize(size, category);
  
  return (
    <Card className="p-4 border-2 border-indigo-50 bg-indigo-50/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-indigo-500" />
          <h4 className="font-bold text-xs uppercase text-slate-600 tracking-tight">Таблица соответствия</h4>
        </div>
        <div className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1">
          <Globe className="w-3 h-3" /> Multi-Region
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {conversions.map((c) => (
          <div key={c.system} className="text-center p-2 rounded-lg bg-white border border-indigo-50 shadow-sm">
            <div className="text-[9px] font-black text-indigo-300 uppercase leading-none mb-1.5">{c.system}</div>
            <div className="text-sm font-black text-slate-800">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2 items-start p-2 bg-indigo-50/50 rounded-md border border-indigo-100">
        <Info className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
        <div className="text-[10px] text-indigo-700 leading-tight">
          <b>Совет:</b> Российские размеры (RU) соответствуют ГОСТу. Рекомендуем выбирать основной RU размер.
        </div>
      </div>
    </Card>
  );
};
