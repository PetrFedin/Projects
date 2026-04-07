'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Send, CheckCircle2, CloudDownload, Instagram, MessageCircle, MoreHorizontal } from 'lucide-react';
import { getPartnerContentPacks } from '@/lib/fashion/partner-content';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductPartnerContentBlock({ product }: { product: Product }) {
  const pack = getPartnerContentPacks([product.sku])[0];

  return (
    <Card className="p-4 border-2 border-slate-100 bg-white shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-slate-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Partner Marketing Pack (RU)</h4>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-slate-200 uppercase">
           SMM Ready
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
         <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <div className="text-[9px] font-black text-slate-600 uppercase">Telegram Pack</div>
         </div>
         <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-600 rounded flex items-center justify-center text-[10px] font-black text-white">ВК</div>
            <div className="text-[9px] font-black text-slate-600 uppercase">VK Feed/Stories</div>
         </div>
      </div>

      <div className="space-y-2 mb-4">
         <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
            <span>High-Res Photos</span>
            <span className="text-slate-800">{pack.assetsCount} Assets</span>
         </div>
         <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
            <span>Copywriting (RU)</span>
            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</span>
         </div>
      </div>

      <Button className="w-full h-10 bg-slate-800 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
         <CloudDownload className="w-4 h-4" /> Download Social Kit
      </Button>

      <div className="mt-4 pt-4 border-t border-slate-50 text-[8px] font-bold text-slate-400 uppercase italic text-center">
         * Assets automatically localized for Russian social platforms.
      </div>
    </Card>
  );
}
